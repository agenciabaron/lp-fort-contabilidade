// POST /api/contact: saves a message from the site's contact form.
import { randomUUID } from "node:crypto";
import { TOPICS } from "../src/data.js";
import { json, route, store, clientIp, sameOrigin, readJson } from "./_lib/http.js";

const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export const POST = route(async (request) => {
  if (!sameOrigin(request)) return json({ error: "Origem não permitida." }, 403);
  const body = await readJson(request);
  if (!body) return json({ error: "Dados inválidos." }, 400);

  // Bots: the hidden "site" field gets filled, or the form is sent faster than a person could type.
  // They get a normal answer so they don't retry, but nothing is saved.
  if (body.site || Date.now() - Number(body.t) < 2500) return json({ ok: true });

  const db = store();
  if (!(await db.allow(`contact:${clientIp(request)}`, 5, 60 * 60))) {
    return json({ error: "Muitas mensagens em pouco tempo. Tente de novo mais tarde ou fale pelo WhatsApp." }, 429);
  }

  const lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    nome: clean(body.nome, 80),
    telefone: clean(body.telefone, 20),
    email: clean(body.email, 120).toLowerCase(),
    assunto: TOPICS.includes(body.assunto) ? body.assunto : "Outro assunto",
    mensagem: String(body.mensagem ?? "").trim().slice(0, 2000),
    pagina: clean(body.pagina, 80),
    status: "novo",
  };
  const errors = [];
  if (lead.nome.length < 2) errors.push("Informe seu nome.");
  if (lead.telefone.replace(/\D/g, "").length < 10) errors.push("Informe um WhatsApp com DDD.");
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("Confira o e-mail.");
  if (lead.mensagem.length < 5) errors.push("Escreva uma mensagem.");
  if (body.aceite !== true) errors.push("Confirme o aceite para que possamos responder.");
  if (errors.length) return json({ error: errors.join(" ") }, 422);

  await db.leads.add(lead);
  return json({ ok: true });
});
