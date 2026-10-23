// POST /api/admin/login: checks the admin e-mail and password and opens an 8-hour session.
import { adminConfigured, checkCredentials, sessionCookie } from "../_lib/auth.js";
import { json, route, store, clientIp, sameOrigin, readJson } from "../_lib/http.js";

export const POST = route(async (request) => {
  if (!sameOrigin(request)) return json({ error: "Origem não permitida." }, 403);
  if (!adminConfigured()) return json({ error: "Acesso admin ainda não configurado (veja o README)." }, 503);
  if (!(await store().allow(`login:${clientIp(request)}`, 5, 15 * 60))) {
    return json({ error: "Muitas tentativas. Aguarde 15 minutos." }, 429);
  }
  const body = await readJson(request, 2000);
  if (!body || !checkCredentials(body.email, body.senha)) {
    return json({ error: "E-mail ou senha incorretos." }, 401);
  }
  return json({ ok: true, email: process.env.ADMIN_EMAIL }, 200, { "set-cookie": sessionCookie(request) });
});
