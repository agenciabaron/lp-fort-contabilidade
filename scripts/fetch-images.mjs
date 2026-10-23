// Downloads the Magnific (Freepik) stock photos used by the page into public/img before each build.
// Licensed through the agency's Magnific account. A failed download is skipped: the page falls back to gradients.
import { mkdir, writeFile, access } from "node:fs/promises";

const BASE = "https://img.magnific.com/free-photo/";
const PHOTOS = {
  "socios.jpg": "portrait-successful-businessmen-office-two-serious-man-suits-working-with-computer-table-making-decisions-developing-strategy-business-growth-business-growth-finance-concept_74855-24621.jpg",
  "abertura.jpg": "entrepreneurs-signing-new-partnership-contract-their-firms_482257-93887.jpg",
  "rural-card.jpg": "senior-hardworking-farmer-agronomist-soybean-field-checking-crops-before-harvest_342744-1260.jpg",
  "rural.jpg": "senior-farmer-agronomist-soybean-field-overlooking-checking-crops-before-harvest_342744-1251.jpg",
  "mesa.jpg": "golden-pen-notebook-calculator-glasses-black-desk_1387-471.jpg",
  "escritorio.jpg": "professional-accountancy-executives-imputing-bookkeeping-administrative-data-paperwork-laptop-bureaucracy-archival-cabinet-room-filled-with-folders-diagram-charts_482257-66950.jpg",
};

const dir = new URL("../public/img/", import.meta.url);
await mkdir(dir, { recursive: true });

await Promise.all(Object.entries(PHOTOS).map(async ([name, path]) => {
  const target = new URL(name, dir);
  try { await access(target); return; } catch {}
  try {
    const res = await fetch(`${BASE}${path}?w=1600`, { headers: { "user-agent": "Mozilla/5.0 (fort-build)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    console.log(`img: ${name} ok`);
  } catch (err) {
    console.warn(`img: ${name} skipped (${err.message})`);
  }
}));
