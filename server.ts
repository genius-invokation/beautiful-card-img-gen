import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": indexHtml,
    "/assets/*": (req) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
    "/images/*": async (req: BunRequest) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      if (!(await file.exists())) {
        const { name } = parse(path);
        console.log(name);
        return await fetch(
          `https://assets.gi-tcg.guyutongxue.site/assets/${name}.webp`
        );
      }
      return new Response(file);
    },
  },
});
console.log("Server running at http://localhost:3000/");
