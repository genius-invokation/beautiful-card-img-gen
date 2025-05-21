import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";
import puppeteer from "puppeteer";

console.log(!!import.meta.env?.GITHUB_TOKEN);

const browser = await puppeteer.launch({
  executablePath: import.meta.env?.CHROME_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

const prodDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation/refs/heads/main/packages/static-data/";
const betaDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/";

const loadData = (baseUrl: string) =>
  new Map(
    ["characters", "action_cards", "entities", "keywords"].map(
      (name) =>
        [
          name,
          fetch(`${baseUrl}/src/data/${name}.json`, {
            headers: {
              Authorization: import.meta.env?.GITHUB_TOKEN
                ? `Bearer ${import.meta.env?.GITHUB_TOKEN}`
                : (void 0 as any),
            },
          })
            .then((res) => res.json())
            .catch(() => []),
        ] as const,
    ),
  );

// 预加载生产和测试环境数据
const [prodData, data] = [loadData(prodDataUrl), loadData(betaDataUrl)];

const server = Bun.serve({
  routes: {
    "/": indexHtml,
    "/assets/*": (req) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
    "/data/*": async (req: BunRequest) => {
      const url = new URL(req.url);
      const remote = url.searchParams.get("remote");
      if (remote) {
        const { name } = parse(url.pathname);
        const beta = !!url.searchParams.get("beta");
        const useData = beta ? data : prodData;
        return new Response(JSON.stringify((await useData.get(name)) ?? []), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      const path = decodeURIComponent(url.pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
    "/images/*": async (req: BunRequest) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      if (!(await file.exists())) {
        const { name } = parse(path);
        const blob = await fetch(
          `https://assets.gi-tcg.guyutongxue.site/assets/${name}.webp`,
        ).then((r) => r.blob());
        return new Response(blob, {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
      return new Response(file);
    },
    "/render": async (req: BunRequest) => {
      const search = new URL(req.url).searchParams;
      const query = search.get("q");
      const beta = !!search.get("beta");
      return renderCard(query ?? "", beta);
    },
  },
  port: import.meta.env?.PORT || 8013,
});

const homepage = `http://${server.hostname}:${server.port}`;
await page.goto(homepage, { waitUntil: "networkidle0" });
console.log(`Server running at ${homepage}`);

const renderCard = async (nameOrId: string, beta: boolean) => {
  if (!nameOrId) {
    throw new Error("nameOrId is required");
  }
  const useData = beta ? data : prodData;
  const namedThings = (
    await Promise.all([useData.get("action_cards"), useData.get("characters")])
  )
    .flat()
    .filter((item) => item.obtainable !== false);
  let id = Number(nameOrId);
  if (isNaN(id)) {
    const card = namedThings.find((item) => item.name.includes(nameOrId));
    if (!card) {
      throw new Error(`Card ${nameOrId} not found`);
    }
    id = card.id;
  }
  const search = new URLSearchParams({
    display_story: "1",
    display_id: "1",
    beta: beta ? "1" : "",
  });
  if (String(id).length === 4) {
    search.set("id", `A${id}`);
  } else {
    search.set("id", `C${id}`);
  }
  const url = `${homepage}/?${search}`;
  console.log(`Rendering ${nameOrId} (${id})`);
  await page.goto(url, { waitUntil: "networkidle0" });
  const root = await page.$("#root");
  const buffer = await root!.screenshot({
    quality: 80,
    optimizeForSpeed: true,
    type: "webp",
  });
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

process.on("exit", () => {
  browser.close();
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => {
    browser.close().finally(() => {
      process.exit(0);
    });
  });
});
