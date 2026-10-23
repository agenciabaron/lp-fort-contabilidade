// Where contact messages (leads) and client reviews live.
// Production: Upstash Redis through its REST API (Vercel → Storage/Marketplace → Upstash, free tier),
// configured by the KV_REST_API_* or UPSTASH_REDIS_REST_* variables the integration adds.
// Locally, without those variables: JSON files in .data/ so everything works with no setup.
import { readFile, writeFile, mkdir } from "node:fs/promises";

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(...command) {
  const res = await fetch(redisUrl(), {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken()}` },
    body: JSON.stringify(command),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(`Redis: ${data.error || res.status}`);
  return data.result;
}

// A collection is a sorted set of ids (newest first) plus one JSON value per item: "<name>:<id>"
const redisCollection = (name) => ({
  async add(item) {
    await redis("SET", `${name}:${item.id}`, JSON.stringify(item));
    await redis("ZADD", name, Date.parse(item.createdAt), item.id);
  },
  async list() {
    const ids = await redis("ZREVRANGE", name, 0, 999);
    if (!ids.length) return [];
    const rows = await redis("MGET", ...ids.map((id) => `${name}:${id}`));
    return rows.filter(Boolean).map((row) => JSON.parse(row));
  },
  async update(id, patch) {
    const row = await redis("GET", `${name}:${id}`);
    if (!row) return null;
    const item = { ...JSON.parse(row), ...patch };
    await redis("SET", `${name}:${id}`, JSON.stringify(item));
    return item;
  },
  async remove(id) {
    await redis("DEL", `${name}:${id}`);
    return (await redis("ZREM", name, id)) > 0;
  },
});

const redisStore = {
  leads: redisCollection("leads"),
  reviews: redisCollection("reviews"),
  // Fixed-window counter: true while `key` was hit at most `limit` times in `seconds`
  async allow(key, limit, seconds) {
    const count = await redis("INCR", `rl:${key}`);
    if (count === 1) await redis("EXPIRE", `rl:${key}`, seconds);
    return count <= limit;
  },
};

const fileCollection = (name) => {
  const file = new URL(`../../.data/${name}.json`, import.meta.url);
  const read = async () => { try { return JSON.parse(await readFile(file, "utf8")); } catch { return []; } };
  const write = async (items) => {
    await mkdir(new URL(".", file), { recursive: true });
    await writeFile(file, JSON.stringify(items, null, 2));
  };
  return {
    async add(item) { await write([item, ...(await read())]); },
    list: read,
    async update(id, patch) {
      const items = await read();
      const i = items.findIndex((x) => x.id === id);
      if (i < 0) return null;
      items[i] = { ...items[i], ...patch };
      await write(items);
      return items[i];
    },
    async remove(id) {
      const items = await read();
      const kept = items.filter((x) => x.id !== id);
      await write(kept);
      return kept.length < items.length;
    },
  };
};

const hits = new Map();
const fileStore = {
  leads: fileCollection("leads"),
  reviews: fileCollection("reviews"),
  async allow(key, limit, seconds) {
    const now = Date.now();
    const hit = hits.get(key);
    if (!hit || hit.until < now) { hits.set(key, { count: 1, until: now + seconds * 1000 }); return true; }
    return ++hit.count <= limit;
  },
};

export class StorageNotConfigured extends Error {}

export function store() {
  if (redisUrl() && redisToken()) return redisStore;
  // Vercel's file system is read-only: without Redis there is nowhere to keep the messages
  if (process.env.VERCEL) throw new StorageNotConfigured("Conecte o Upstash Redis ao projeto na Vercel (Storage).");
  return fileStore;
}
