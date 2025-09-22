import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";
import puppeteer from "puppeteer";
import { CharacterRawData, EntityRawData, keywords } from "@gi-tcg/static-data";

console.log(!!import.meta.env?.GITHUB_TOKEN);

const browser = await puppeteer.launch({
  executablePath: import.meta.env?.CHROME_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

const prodDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation/refs/heads/main/packages/static-data/src/data/";
const betaDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/src/data/";
const customDataUrl = "";

const CUSTOM_CHARACTERS: CharacterRawData[] = JSON.parse(await Bun.file("./data/custom/characters.json").text());
const CUSTOM_ENTITIES: EntityRawData[] = JSON.parse(await Bun.file("./data/custom/entities.json").text());;

const CUSTOM_DATA = {
  characters: CUSTOM_CHARACTERS,
  entities: CUSTOM_ENTITIES,
  action_cards: [],
  keywords: [],
};

const loadData = (baseUrl: string) =>
  new Map(
    (["characters", "action_cards", "entities", "keywords"] as const).map(
      (name) => [
        name,
        fetch(`${baseUrl}/${name}.json`, {
          headers: {
            Authorization: import.meta.env?.GITHUB_TOKEN
              ? `Bearer ${import.meta.env?.GITHUB_TOKEN}`
              : (void 0 as any),
          }, verbose: true
        })
          .then(async (res) => [...(await res.json()), ...CUSTOM_DATA[name]])
          .catch(() => []),
          // .then(async (res) => {
          //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
          //   return [...(await res.json()), ...CUSTOM_DATA[name]];
          // })
          // .catch(async (err) => {
          //   console.warn(`[fetch] ${name} failed, using fallback:`, err);
          //   let fallbackUrl =
          //     `###fallbackUrl###/${name}.json?remote=1`;
          //   if (baseUrl.includes("beta")) {
          //     fallbackUrl += "&beta=1";
          //   }
          //   const res = await fetch(fallbackUrl);
          //   if (!res.ok) throw new Error(`[fallback] ${name} failed: HTTP ${res.status}`);
          //   return [...(await res.json()), ...CUSTOM_DATA[name]];
          // }),
      ] as const,
    ),
  );

// 预加载生产和测试环境数据
const [prodData, data, customData] = [loadData(prodDataUrl), loadData(betaDataUrl), loadData(customDataUrl)];

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
        const custom = !!url.searchParams.get("custom");
        const useData = custom ? customData : beta ? data : prodData;
        return new Response(
          JSON.stringify((await useData.get(name as any)) ?? []),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
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
      const custom = !!search.get("custom");
      return renderCard(query ?? "", beta, custom);
    },
  },
  port: import.meta.env?.PORT || 8013,
});

const homepage = `http://${server.hostname}:${server.port}`;
await page.goto(homepage, { waitUntil: "networkidle0" });
console.log(`Server running at ${homepage}`);

const renderCard = async (nameOrId: string, beta: boolean, custom: boolean) => {
  if (!nameOrId) {
    throw new Error("nameOrId is required");
  }
  const useData = custom ? customData : beta ? data : prodData;
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
    custom: custom ? "1" : "",
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
