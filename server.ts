import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";

console.log(import.meta.env?.GITHUB_TOKEN);

Bun.serve({
  port: 3000,
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
        const data = await fetch(
          `https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/src/data/${name}.json`,
          {
            headers: {
              Authorization: import.meta.env?.GITHUB_TOKEN
                ? `Bearer ${import.meta.env?.GITHUB_TOKEN}`
                : (void 0 as any),
            },
          },
        ).then((res) => res.json());
        return new Response(JSON.stringify(data), {
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
        return await fetch(
          `https://assets.gi-tcg.guyutongxue.site/assets/${name}.webp`,
        );
      }
      return new Response(file);
    },
  },
});
console.log("Server running at http://localhost:3000/");
