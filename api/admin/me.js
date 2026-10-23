// GET /api/admin/me: who is signed in (401 when nobody is).
import { json, adminRoute } from "../_lib/http.js";

export const GET = adminRoute(async (request, session) => json({ email: session.email }));
