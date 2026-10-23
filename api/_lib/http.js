// Small helpers shared by the API routes (Web-standard Request/Response, as Vercel Functions use).
import { store, StorageNotConfigured } from "./store.js";
import { readSession } from "./auth.js";

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });

export const clientIp = (request) => (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";

// Requests that change data must come from this site (the cookie is SameSite=Strict as well)
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === new URL(request.url).host;
}

export async function readJson(request, maxBytes = 12000) {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try { return JSON.parse(text); } catch { return null; }
}

// Wraps a handler: storage misconfiguration and unexpected errors become clean JSON answers
export const route = (handler) => async (request) => {
  try {
    return await handler(request);
  } catch (err) {
    if (err instanceof StorageNotConfigured) return json({ error: err.message }, 503);
    console.error(err);
    return json({ error: "Erro interno. Tente novamente em instantes." }, 500);
  }
};

// Same as route(), for admin-only handlers: no valid session → 401
export const adminRoute = (handler) => route(async (request) => {
  const session = readSession(request);
  if (!session) return json({ error: "Sessão expirada. Entre novamente." }, 401);
  if (request.method !== "GET" && !sameOrigin(request)) return json({ error: "Origem não permitida." }, 403);
  return handler(request, session);
});

export { store };
