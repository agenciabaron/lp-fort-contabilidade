// POST /api/admin/logout: ends the session.
import { clearedCookie } from "../_lib/auth.js";
import { json, route } from "../_lib/http.js";

export const POST = route(async () => json({ ok: true }, 200, { "set-cookie": clearedCookie }));
