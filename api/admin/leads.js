// /api/admin/leads: list (GET, ?formato=csv for a spreadsheet), change status (PATCH) and delete (DELETE).
import { json, adminRoute, store, readJson } from "../_lib/http.js";

const STATUSES =["novo", "atendimento", "concluido"];
const COLUMNS = [["createdAt", "Data"], ["nome", "Nome"], ["telefone", "WhatsApp"], ["email", "E-mail"], ["assunto", "Assunto"], ["mensagem", "Mensagem"], ["status", "Status"], ["pagina", "Página"]];

function csv(leads) {
  // A leading = + - @ would run as a formula in Excel: prefix it so visitor text stays text
  const cell = (v) => `"${String(v ?? "").replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""')}"`;
  const rows = leads.map((l) => COLUMNS.map(([k]) => cell(k === "createdAt" ? new Date(l[k]).toLocaleString("pt-BR", { timeZone: "America/Campo_Grande" }) : l[k])).join(";"));
  // BOM + ";" so Excel in Portuguese opens accents and columns correctly
  return "﻿" + [COLUMNS.map(([, label]) => cell(label)).join(";"), ...rows].join("\r\n");
}

export const GET = adminRoute(async (request) => {
  const leads = await store().leads.list();
  if (new URL(request.url).searchParams.get("formato") === "csv") {
    return new Response(csv(leads), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="contatos-fort-${new Date().toISOString().slice(0, 10)}.csv"`,
        "cache-control": "no-store",
      },
    });
  }
  return json({ leads });
});

export const PATCH = adminRoute(async (request) => {
  const body = await readJson(request, 2000);
  if (!body?.id || !STATUSES.includes(body.status)) return json({ error: "Dados inválidos." }, 400);
  const lead = await store().leads.update(body.id, { status: body.status, updatedAt: new Date().toISOString() });
  return lead ? json({ lead }) : json({ error: "Contato não encontrado." }, 404);
});

export const DELETE = adminRoute(async (request) => {
  const id = new URL(request.url).searchParams.get("id");
  return id && (await store().leads.remove(id)) ? json({ ok: true }) : json({ error: "Contato não encontrado." }, 404);
});
