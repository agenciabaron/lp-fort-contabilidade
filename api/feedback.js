// /api/feedback: clients rate the firm. POST saves a review as "pendente"; GET lists only the ones the
// admin approved, with the public fields, so nothing reaches the site without a person reading it first.
import { randomUUID } from "node:crypto";
import { json, route, store, clientIp, sameOrigin, readJson } from "./_lib/http.js";

const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export const GET = route(async () => {
  const reviews = (await store().reviews.list())
    .filter((r) => r.status === "aprovado")
    .slice(0, 30)
    .map(({ nome, empresa, nota, comentario, createdAt }) => ({ nome, empresa, nota, comentario, createdAt }));
  // Shared caches may keep it for 2 minutes; an approval shows up shortly after
  return json({ reviews }, 200, { "cache-control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600" });
});

export const POST = route(async (request) => {
  if (!sameOrigin(request)) return json({ error: "Origem não permitida." }, 403);
  const body = await readJson(request, 4000);
  if (!body) return json({ error: "Dados inválidos." }, 400);
  if (body.site || Date.now() - Number(body.t) < 3000) return json({ ok: true }); // bot trap, see contact.js

  const db = store();
  if (!(await db.allow(`feedback:${clientIp(request)}`, 3, 60 * 60))) {
    return json({ error: "Recebemos várias avaliações deste acesso. Tente de novo mais tarde." }, 429);
  }
  const review = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    nome: clean(body.nome, 60),
    empresa: clean(body.empresa, 80),
    nota: Number(body.nota),
    comentario: String(body.comentario ?? "").trim().slice(0, 600),
    status: "pendente",
  };
  const errors = [];
  if (!Number.isInteger(review.nota) || review.nota < 1 || review.nota > 5) errors.push("Escolha uma nota de 1 a 5 estrelas.");
  if (review.nome.length < 2) errors.push("Informe seu nome.");
  if (review.comentario.length < 10) errors.push("Escreva um comentário de pelo menos 10 caracteres.");
  if (body.aceite !== true) errors.push("Autorize a publicação para enviar.");
  if (errors.length) return json({ error: errors.join(" ") }, 422);

  await db.reviews.add(review);
  return json({ ok: true });
});
