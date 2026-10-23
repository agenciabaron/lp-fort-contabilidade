// /api/admin/feedback: every review (GET), approve or hide (PATCH) and delete (DELETE).
import { json, adminRoute, store, readJson } from "../_lib/http.js";

const STATUSES = ["pendente", "aprovado", "oculto"];

export const GET = adminRoute(async () => json({ reviews: await store().reviews.list() }));

export const PATCH = adminRoute(async (request) => {
  const body = await readJson(request, 2000);
  if (!body?.id || !STATUSES.includes(body.status)) return json({ error: "Dados inválidos." }, 400);
  const review = await store().reviews.update(body.id, { status: body.status, updatedAt: new Date().toISOString() });
  return review ? json({ review }) : json({ error: "Avaliação não encontrada." }, 404);
});

export const DELETE = adminRoute(async (request) => {
  const id = new URL(request.url).searchParams.get("id");
  return id && (await store().reviews.remove(id)) ? json({ ok: true }) : json({ error: "Avaliação não encontrada." }, 404);
});
