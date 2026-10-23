import "./style.css";
import "./admin.css";

// Admin panel: sign-in, then the list of messages sent through the site's contact form.
const app = document.getElementById("app");
const STATUS = { novo: "Novo", atendimento: "Em atendimento", concluido: "Concluído" };
const logo = '<svg class="logo" viewBox="0 0 2144 795" width="124" height="46" role="img" aria-label="Fort Contabilidade"><use href="#logo" /></svg>';
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const when = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Campo_Grande", dateStyle: "short", timeStyle: "short" });
const waReply = (lead) => {
  const digits = lead.telefone.replace(/\D/g, "");
  const msg = `Olá, ${lead.nome.split(" ")[0]}! Aqui é da Fort Contabilidade. Recebemos sua mensagem pelo site.`;
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}?text=${encodeURIComponent(msg)}`;
};

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "Não foi possível concluir."), { status: res.status });
  return data;
}

// ---- Sign-in ----
function showLogin(message = "") {
  app.innerHTML = `
    <form class="glass auth" id="login" novalidate>
      ${logo}
      <h1>Painel de contatos</h1>
      <p class="auth__lead">Acesso restrito à equipe da Fort.</p>
      <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="username" required /></label>
      <label class="field"><span>Senha</span><input name="senha" type="password" autocomplete="current-password" required /></label>
      <p class="cform__msg is-error" role="alert">${esc(message)}</p>
      <button class="btn btn--gold" type="submit">Entrar</button>
    </form>`;
  const form = document.getElementById("login");
  form.email.focus();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Entrando…";
    try {
      const { email } = await api("/api/admin/login", { method: "POST", body: { email: form.email.value, senha: form.senha.value } });
      showDashboard(email);
    } catch (err) {
      form.querySelector(".cform__msg").textContent = err.message;
      form.senha.value = "";
      button.disabled = false;
      button.textContent = "Entrar";
    }
  });
}

// ---- Dashboard: two tabs, contact messages and client reviews ----
let leads = [];
let reviews = [];
function showDashboard(email) {
  app.innerHTML = `
    <header class="adm-bar">
      ${logo}
      <div class="adm-bar__who"><strong>Painel do site</strong><span>${esc(email)}</span></div>
      <div class="adm-bar__actions">
        <button class="btn btn--glass" id="logout" type="button">Sair</button>
      </div>
    </header>
    <nav class="adm-tabs" role="tablist" aria-label="Seções do painel">
      <button class="adm-tab" role="tab" data-tab="leads" aria-selected="true">Contatos</button>
      <button class="adm-tab" role="tab" data-tab="reviews" aria-selected="false">Avaliações <span class="adm-tab__count" id="pending" hidden></span></button>
    </nav>
    <div id="view"></div>`;
  document.getElementById("logout").addEventListener("click", async () => {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    showLogin();
  });
  document.querySelector(".adm-tabs").addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (!tab) return;
    document.querySelectorAll(".adm-tab").forEach((t) => t.setAttribute("aria-selected", t === tab));
    (tab.dataset.tab === "reviews" ? showReviews : showLeads)();
  });
  showLeads();
  loadReviews(false); // fills the "pending" badge on the tab
}

function showLeads() {
  document.getElementById("view").innerHTML = `
    <section class="adm-stats" id="stats"></section>
    <div class="adm-tools">
      <input class="adm-input" type="search" id="q" placeholder="Buscar por nome, telefone, e-mail ou mensagem" />
      <select class="adm-input" id="filter"><option value="">Todos os status</option>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
      <button class="btn btn--glass" id="refresh" type="button">Atualizar</button>
      <a class="btn btn--glass" href="/api/admin/leads?formato=csv">Exportar planilha</a>
    </div>
    <div class="adm-list" id="list"><p class="adm-empty">Carregando…</p></div>`;
  document.getElementById("refresh").addEventListener("click", load);
  document.getElementById("q").addEventListener("input", render);
  document.getElementById("filter").addEventListener("change", render);
  document.getElementById("list").addEventListener("change", onStatus);
  document.getElementById("list").addEventListener("click", onDelete);
  load();
}

async function load() {
  try {
    leads = (await api("/api/admin/leads")).leads;
    render();
  } catch (err) {
    if (err.status === 401) return showLogin(err.message);
    document.getElementById("list").innerHTML = `<p class="adm-empty">${esc(err.message)}</p>`;
  }
}

function render() {
  const count = (s) => leads.filter((l) => l.status === s).length;
  document.getElementById("stats").innerHTML = [
    ["Novos", count("novo"), "novo"], ["Em atendimento", count("atendimento"), "atendimento"], ["Concluídos", count("concluido"), "concluido"], ["Total", leads.length, ""],
  ].map(([label, n, s]) => `<div class="glass adm-stat${s ? ` adm-stat--${s}` : ""}"><strong>${n}</strong><span>${label}</span></div>`).join("");

  const q = document.getElementById("q").value.trim().toLowerCase();
  const status = document.getElementById("filter").value;
  const shown = leads.filter((l) => (!status || l.status === status)
    && (!q || [l.nome, l.telefone, l.email, l.assunto, l.mensagem].join(" ").toLowerCase().includes(q)));

  document.getElementById("list").innerHTML = shown.length ? shown.map((l) => `
    <article class="glass lead lead--${l.status}">
      <header class="lead__head">
        <div><h3>${esc(l.nome)}</h3><time datetime="${l.createdAt}">${when(l.createdAt)}</time></div>
        <span class="lead__badge">${STATUS[l.status] || l.status}</span>
      </header>
      <dl class="lead__data">
        <div><dt>WhatsApp</dt><dd><a href="${waReply(l)}" target="_blank" rel="noopener">${esc(l.telefone)}</a></dd></div>
        ${l.email ? `<div><dt>E-mail</dt><dd><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></dd></div>` : ""}
        <div><dt>Assunto</dt><dd>${esc(l.assunto)}</dd></div>
        ${l.pagina ? `<div><dt>Página</dt><dd>${esc(l.pagina)}</dd></div>` : ""}
      </dl>
      <p class="lead__msg">${esc(l.mensagem)}</p>
      <footer class="lead__foot">
        <select class="adm-input" data-id="${l.id}" aria-label="Status de ${esc(l.nome)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}"${k === l.status ? " selected" : ""}>${v}</option>`).join("")}</select>
        <a class="btn btn--gold" href="${waReply(l)}" target="_blank" rel="noopener">Responder no WhatsApp</a>
        <button class="lead__del" type="button" data-del="${l.id}">Excluir</button>
      </footer>
    </article>`).join("") : `<p class="adm-empty">${leads.length ? "Nenhum contato com esse filtro." : "Ainda não chegou nenhuma mensagem pelo site."}</p>`;
}

async function onStatus(e) {
  const select = e.target.closest("select[data-id]");
  if (!select) return;
  try {
    const { lead } = await api("/api/admin/leads", { method: "PATCH", body: { id: select.dataset.id, status: select.value } });
    leads = leads.map((l) => (l.id === lead.id ? lead : l));
    render();
  } catch (err) {
    if (err.status === 401) return showLogin(err.message);
    alert(err.message);
    render();
  }
}

async function onDelete(e) {
  const button = e.target.closest("[data-del]");
  if (!button) return;
  const lead = leads.find((l) => l.id === button.dataset.del);
  if (!confirm(`Excluir a mensagem de ${lead?.nome}? Isso não pode ser desfeito.`)) return;
  try {
    await api(`/api/admin/leads?id=${encodeURIComponent(button.dataset.del)}`, { method: "DELETE" });
    leads = leads.filter((l) => l.id !== button.dataset.del);
    render();
  } catch (err) {
    if (err.status === 401) return showLogin(err.message);
    alert(err.message);
  }
}

// ---- Reviews: approve what goes on the site ----
const REVIEW_STATUS = { pendente: "Aguardando", aprovado: "Publicada", oculto: "Oculta" };
const starRow = (n) => `<span class="stars" aria-label="${n} de 5 estrelas">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;

function showReviews() {
  document.getElementById("view").innerHTML = `
    <section class="adm-stats" id="rstats"></section>
    <p class="adm-hint">Só as avaliações <strong>publicadas</strong> aparecem no site, na seção "Quem é cliente, recomenda".</p>
    <div class="adm-list" id="rlist"><p class="adm-empty">Carregando…</p></div>`;
  document.getElementById("rlist").addEventListener("click", onReviewAction);
  loadReviews(true);
}

async function loadReviews(draw) {
  try {
    reviews = (await api("/api/admin/feedback")).reviews;
    const pending = reviews.filter((r) => r.status === "pendente").length;
    const badge = document.getElementById("pending");
    if (badge) { badge.textContent = pending; badge.hidden = !pending; }
    if (draw) renderReviews();
  } catch (err) {
    if (err.status === 401) return showLogin(err.message);
    if (draw) document.getElementById("rlist").innerHTML = `<p class="adm-empty">${esc(err.message)}</p>`;
  }
}

function renderReviews() {
  const count = (s) => reviews.filter((r) => r.status === s).length;
  const published = reviews.filter((r) => r.status === "aprovado");
  const avg = published.length ? (published.reduce((a, r) => a + r.nota, 0) / published.length).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "–";
  document.getElementById("rstats").innerHTML = [
    ["Aguardando", count("pendente"), "novo"], ["Publicadas", count("aprovado"), ""], ["Ocultas", count("oculto"), ""], ["Nota média no site", avg, ""],
  ].map(([label, n, s]) => `<div class="glass adm-stat${s ? ` adm-stat--${s}` : ""}"><strong>${n}</strong><span>${label}</span></div>`).join("");
  const badge = document.getElementById("pending");
  badge.textContent = count("pendente");
  badge.hidden = !count("pendente");

  document.getElementById("rlist").innerHTML = reviews.length ? reviews.map((r) => `
    <article class="glass lead review-adm review-adm--${r.status}">
      <header class="lead__head">
        <div><h3>${esc(r.nome)}</h3><time datetime="${r.createdAt}">${when(r.createdAt)}${r.empresa ? ` · ${esc(r.empresa)}` : ""}</time></div>
        <span class="lead__badge">${REVIEW_STATUS[r.status] || r.status}</span>
      </header>
      ${starRow(r.nota)}
      <p class="lead__msg">${esc(r.comentario)}</p>
      <footer class="lead__foot">
        ${r.status !== "aprovado" ? `<button class="btn btn--gold" type="button" data-review="${r.id}" data-set="aprovado">Publicar no site</button>` : ""}
        ${r.status !== "oculto" ? `<button class="btn btn--glass" type="button" data-review="${r.id}" data-set="oculto">${r.status === "aprovado" ? "Tirar do site" : "Ocultar"}</button>` : ""}
        <button class="lead__del" type="button" data-review="${r.id}" data-set="excluir">Excluir</button>
      </footer>
    </article>`).join("") : `<p class="adm-empty">Nenhuma avaliação recebida ainda. Elas chegam pelo botão "Avaliar a Fort" no site.</p>`;
}

async function onReviewAction(e) {
  const button = e.target.closest("[data-review]");
  if (!button) return;
  const id = button.dataset.review;
  try {
    if (button.dataset.set === "excluir") {
      const review = reviews.find((r) => r.id === id);
      if (!confirm(`Excluir a avaliação de ${review?.nome}? Isso não pode ser desfeito.`)) return;
      await api(`/api/admin/feedback?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      reviews = reviews.filter((r) => r.id !== id);
    } else {
      const { review } = await api("/api/admin/feedback", { method: "PATCH", body: { id, status: button.dataset.set } });
      reviews = reviews.map((r) => (r.id === id ? review : r));
    }
    renderReviews();
  } catch (err) {
    if (err.status === 401) return showLogin(err.message);
    alert(err.message);
  }
}

api("/api/admin/me").then(({ email }) => showDashboard(email), () => showLogin());
