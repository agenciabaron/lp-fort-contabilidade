import { defineConfig, loadEnv } from "vite";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AREAS } from "./src/data.js";
import * as T from "./src/render.js";

const page = (p) => fileURLToPath(new URL(p, import.meta.url));

// One folder per page so /fiscal/ works the same in dev, preview and on Vercel.
const input = {
  main: page("./index.html"),
  "quem-somos": page("./quem-somos/index.html"),
  admin: page("./admin/index.html"),
  ...Object.fromEntries(AREAS.map((a) => [a.slug, page(`./${a.slug}/index.html`)])),
};

// Fills the <!--MARKERS--> in each page with the templates from src/render.js and inlines
// the traced logo as an SVG <symbol> so every <use href="#logo"> renders without an extra request.
const templates = () => ({
  name: "fort-templates",
  transformIndexHtml(html, ctx) {
    const path = ctx.path.replace(/index\.html$/, "");
    const symbol = readFileSync(page("./src/logo-symbol.html"), "utf8");
    return html
      .replace("<!--HEAD_COMMON-->", T.headCommon())
      .replace("<!--LOGO_SYMBOL-->", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbol}</svg>`)
      .replace("<!--HEADER-->", T.header(path))
      .replace("<!--FOOTER-->", T.footer())
      .replace("<!--AREA_TABS-->", T.areaTabs())
      .replace("<!--TIMELINE-->", T.timeline())
      .replace("<!--AREA_CARDS-->", T.areaCards(AREAS))
      .replace("<!--REVIEWS-->", T.reviewsSection())
      .replace(/<!--CONTACT(:map)?-->/, (_, map) => T.contactSection({ map: Boolean(map) }))
      .replace(/<!--AREA_HEAD:(\w+)-->/, (_, id) => T.areaHead(T.areaById(id)))
      .replace(/<!--AREA_PAGE:(\w+)-->/, (_, id) => T.areaPage(T.areaById(id)));
  },
});

// Serves api/*.js locally exactly as Vercel does in production: each file exports GET/POST/PATCH/DELETE
// handlers that take a Web Request and return a Response. Files and folders starting with "_" are not routes.
const HOP_BY_HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "host"]);
const api = () => {
  const middleware = (load) => async (req, res, next) => {
    const path = req.url.split("?")[0].replace(/\/$/, "");
    if (!path.startsWith("/api/") || path.includes("/_")) return next();
    const file = page(`.${path}.js`);
    if (!existsSync(file)) return next();
    try {
      const handler = (await load(file))[req.method];
      if (!handler) { res.statusCode = 405; return res.end(); }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const headers = Object.entries(req.headers).filter(([k]) => !HOP_BY_HOP.has(k));
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      const response = await handler(request);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => { if (key !== "set-cookie") res.setHeader(key, value); });
      const cookies = response.headers.getSetCookie();
      if (cookies.length) res.setHeader("set-cookie", cookies);
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Erro interno");
    }
  };
  return {
    name: "fort-api",
    configureServer(server) { server.middlewares.use(middleware((file) => server.ssrLoadModule(file))); },
    configurePreviewServer(server) { server.middlewares.use(middleware((file) => import(pathToFileURL(file).href))); },
  };
};

export default defineConfig(({ mode }) => {
  // Make .env / .env.local visible to the local API (Vercel injects them in production)
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) process.env[key] ??= value;
  return {
    plugins: [templates(), api()],
    build: { rollupOptions: { input } },
  };
});
