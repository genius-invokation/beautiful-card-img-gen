import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";
import puppeteer from "puppeteer";

console.log(!!import.meta.env?.GITHUB_TOKEN);

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

const data = new Map(
  ["characters", "action_cards", "entities", "keywords"].map(
    (name) =>
      [
        name,
        fetch(
          `https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/src/data/${name}.json`,
          {
            headers: {
              Authorization: import.meta.env?.GITHUB_TOKEN
                ? `Bearer ${import.meta.env?.GITHUB_TOKEN}`
                : (void 0 as any),
            },
          },
        )
          .then((res) => res.json())
          .catch(() => []),
      ] as const,
  ),
);

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
        return new Response(JSON.stringify((await data.get(name)) ?? []), {
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
      const query = new URL(req.url).searchParams.get("q");
      return renderCard(query ?? "");
    }
  },
  port: import.meta.env?.PORT || 8013,
});

const homepage = `http://${server.hostname}:${server.port}`;
await page.goto(homepage, { waitUntil: "networkidle0" });
console.log(`Server running at ${homepage}`);

const renderCard = async (nameOrId: string) => {
  if (!nameOrId) {
    throw new Error("nameOrId is required");
  }
  const namedThings = (
    await Promise.all([data.get("action_cards"), data.get("characters")])
  )
    .flat()
    .filter((item) => item.obtainable !== false);
  let id = Number(nameOrId);
  let url: string;
  if (isNaN(id)) {
    const card = namedThings.find((item) => item.name.includes(nameOrId));
    if (!card) {
      throw new Error(`Card ${nameOrId} not found`);
    }
    id = card.id;
  }
  if (String(id).length === 4) {
    url = `${homepage}/?display_story=1&id=A${id}`;
  } else {
    url = `${homepage}?display_story=1&id=C${id}`;
  }
  console.log(`Rendering ${nameOrId} (${id})`);
  await page.goto(url, { waitUntil: "networkidle0" });
  const root = await page.$("#root");
  const buffer = await root!.screenshot({
    quality: 100,
    optimizeForSpeed: true,
    type: "webp",
  });
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
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
