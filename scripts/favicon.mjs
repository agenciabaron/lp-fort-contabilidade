// Builds public/favicon.svg from the logo column path (gold column on a dark rounded square).
import { readFile, writeFile } from "node:fs/promises";

const symbol = await readFile(new URL("../src/logo-symbol.html", import.meta.url), "utf8");
const d = symbol.match(/<path fill="var\(--lg-c[^"]*" d="([^"]+)"/)[1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-239 -120 1038 1038"><rect x="-239" y="-120" width="1038" height="1038" rx="208" fill="#0f1012"/><path fill="#e6c77f" d="${d}"/></svg>`;
await writeFile(new URL("../public/favicon.svg", import.meta.url), svg);
