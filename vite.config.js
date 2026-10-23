import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

// Inlines the traced logo as an SVG <symbol> so every <use href="#logo"> renders without an extra request.
const inlineLogo = () => ({
  name: "inline-logo",
  transformIndexHtml(html) {
    const symbol = readFileSync(new URL("./src/logo-symbol.html", import.meta.url), "utf8");
    return html.replace("<!--LOGO_SYMBOL-->", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbol}</svg>`);
  },
});

export default defineConfig({ plugins: [inlineLogo()] });
