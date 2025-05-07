import indexHtml from "./index.html";

Bun.serve({
  port: 3000,
  routes: {
    '/': indexHtml,
    '/assets/*': (req) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
  },
});
console.log("Server running at http://localhost:3000/");