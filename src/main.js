import "./style.css";
import { waLink } from "./contact.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Header, footer, tabs and area pages are rendered at build time (src/render.js); this file only adds behavior.

// ---- Loader, starting position and page transitions ----
// The loader (in the header template, styled inline in <head>) covers the page until fonts are in,
// then html.is-ready fades it out and starts the entrance animations.
const root = document.documentElement;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
// A new page always opens at the top, or at the service/section named in the link (#anchor)
const goToStart = () => {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  let top = 0;
  if (target) {
    // offsetTop ignores the reveal's translate, so the target lands where it ends up, below the fixed header
    for (let el = target; el; el = el.offsetParent) top += el.offsetTop;
    top -= parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  }
  window.scrollTo({ top, behavior: "instant" });
};
goToStart();
const pageReady = Promise.all([
  Promise.race([document.fonts?.ready, wait(600)]),
  wait(Math.max(0, 250 - performance.now())), // keeps a fast load from flashing the loader
]).then(() => {
  goToStart();
  root.classList.add("is-ready");
  setTimeout(() => root.classList.add("is-loaded"), 450);
});

// Internal links fade the loader in before leaving, so pages change without a blank flash
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (link.target === "_blank" || link.hasAttribute("download")) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
  e.preventDefault();
  root.classList.remove("is-loaded");
  void root.offsetWidth; // let the loader come back before fading it in
  root.classList.add("is-leaving");
  setTimeout(() => { location.href = url.href; }, reduceMotion ? 0 : 180);
});
// Coming back through the browser's back/forward cache restores the page with the loader still up
window.addEventListener("pageshow", (e) => {
  if (e.persisted) root.classList.replace("is-leaving", "is-loaded");
});

// ---- Home: area tabs ----
const tabs = document.querySelector(".areas__tabs");
if (tabs) {
  const panels = document.querySelector(".areas__panels");
  const selectArea = (id) => {
    tabs.querySelectorAll(".areas__tab").forEach((t) => t.setAttribute("aria-selected", t.getAttribute("aria-controls") === id));
    panels.querySelectorAll(".panel").forEach((p) => { p.hidden = p.id !== id; });
  };
  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".areas__tab");
    if (tab) selectArea(tab.getAttribute("aria-controls"));
  });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const all = [...tabs.children];
    const i = all.indexOf(document.activeElement);
    const next = all[(i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
    next.focus();
    selectArea(next.getAttribute("aria-controls"));
  });
}

// ---- WhatsApp buttons ----
document.querySelectorAll(".js-wa").forEach((el) => {
  el.href = waLink(el.dataset.msg || "Olá! Vim pelo site da Fort Contabilidade.");
  el.target = "_blank";
  el.rel = "noopener";
});

// ---- Home: hero headline rotates through short phrases ----
const rotator = document.querySelector("[data-rotator]");
if (rotator) {
  const items = [...rotator.children];
  let current = 0;
  pageReady.then(() => setInterval(() => {
    if (document.hidden) return;
    items[current].classList.replace("is-active", "is-out");
    const leaving = items[current];
    setTimeout(() => leaving.classList.remove("is-out"), 900);
    current = (current + 1) % items.length;
    items[current].classList.add("is-active");
  }, 2800));
}

// ---- Contact form: validates, sends to /api/contact and thanks the visitor ----
document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const openedAt = Date.now();
  const msg = form.querySelector(".cform__msg");
  const send = form.querySelector(".cform__send");
  const say = (text, error = false) => { msg.textContent = text; msg.classList.toggle("is-error", error); };
  // (67) 99999-9999 while typing
  form.telefone.addEventListener("input", () => {
    const d = form.telefone.value.replace(/\D/g, "").slice(0, 11);
    form.telefone.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  form.addEventListener("input", (e) => e.target.removeAttribute("aria-invalid"));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll("[required]")].filter((el) => !el.checkValidity()
      || (el.name === "telefone" && el.value.replace(/\D/g, "").length < 10));
    invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
    if (invalid.length) {
      invalid[0].focus();
      return say(form.aceite.checked || invalid[0] !== form.aceite ? "Preencha os campos marcados." : "Marque a autorização para enviarmos a resposta.", true);
    }
    send.disabled = true;
    send.textContent = "Enviando…";
    say("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.value, telefone: form.telefone.value, email: form.email.value, assunto: form.assunto.value,
          mensagem: form.mensagem.value, aceite: form.aceite.checked, site: form.site.value, t: openedAt, pagina: location.pathname,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível enviar agora.");
      const first = form.nome.value.trim().split(" ")[0];
      form.innerHTML = `<div class="cform__done"><strong>Mensagem enviada, ${first.replace(/[<>&"]/g, "")}!</strong><p>Nossa equipe responde no horário de atendimento. Se for urgente, fale agora pelo WhatsApp.</p><a class="btn btn--glass" href="${waLink(`Olá! Sou ${first} e acabei de enviar uma mensagem pelo site.`)}" target="_blank" rel="noopener">Abrir o WhatsApp</a></div>`;
    } catch (err) {
      say(`${err.message} Você também pode chamar no WhatsApp.`, true);
      send.disabled = false;
      send.textContent = "Enviar mensagem";
    }
  });
});

// ---- Reviews: approved ones from /api/feedback, and the dialog where clients rate the firm ----
const reviewsTrack = document.querySelector("[data-reviews]");
if (reviewsTrack) {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const stars = (n) => `<span class="stars" aria-label="${n} de 5 estrelas">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;
  fetch("/api/feedback").then((r) => (r.ok ? r.json() : { reviews: [] })).then(({ reviews = [] }) => {
    if (!reviews.length) {
      document.querySelector("[data-reviews-cta]").textContent = "Seja o primeiro a avaliar a Fort";
      return;
    }
    reviewsTrack.innerHTML = reviews.map((r) => `
      <figure class="glass review">
        ${stars(r.nota)}
        <blockquote>${esc(r.comentario)}</blockquote>
        <figcaption><strong>${esc(r.nome)}</strong>${r.empresa ? `<span>${esc(r.empresa)}</span>` : ""}</figcaption>
      </figure>`).join("");
    reviewsTrack.hidden = false;
    const avg = reviews.reduce((sum, r) => sum + r.nota, 0) / reviews.length;
    const summary = document.querySelector("[data-reviews-summary]");
    summary.innerHTML = `<strong>${avg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong><div>${stars(Math.round(avg))}<span>${reviews.length} ${reviews.length > 1 ? "avaliações" : "avaliação"}</span></div>`;
    summary.hidden = false;
  }).catch(() => {});

  const dialog = document.querySelector("[data-review-dialog]");
  const form = dialog.querySelector("[data-review-form]");
  let openedAt = 0;
  document.querySelector("[data-review-open]").addEventListener("click", () => { openedAt = Date.now(); dialog.showModal(); });
  dialog.querySelector("[data-review-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); }); // click on the backdrop
  form.addEventListener("input", (e) => (e.target.closest(".rating") || e.target).removeAttribute("aria-invalid"));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = form.querySelector(".cform__msg");
    const send = form.querySelector(".cform__send");
    const say = (text, error = false) => { msg.textContent = text; msg.classList.toggle("is-error", error); };
    const invalid = [...form.querySelectorAll("input[name=nome], textarea, input[name=aceite]")].filter((el) => !el.checkValidity());
    invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
    if (!form.nota.value) form.querySelector(".rating").setAttribute("aria-invalid", "true");
    if (!form.nota.value || invalid.length) return say(!form.nota.value ? "Escolha de 1 a 5 estrelas." : "Preencha os campos marcados.", true);
    send.disabled = true;
    send.textContent = "Enviando…";
    say("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nota: Number(form.nota.value), nome: form.nome.value, empresa: form.empresa.value, comentario: form.comentario.value, aceite: form.aceite.checked, site: form.site.value, t: openedAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível enviar agora.");
      form.innerHTML = `<div class="cform__done"><strong>Obrigado pela avaliação!</strong><p>Ela aparece no site assim que nossa equipe conferir.</p><button class="btn btn--glass" type="button" data-review-close>Fechar</button></div>`;
      form.querySelector("[data-review-close]").addEventListener("click", () => dialog.close());
    } catch (err) {
      say(err.message, true);
      send.disabled = false;
      send.textContent = "Enviar avaliação";
    }
  });
}

// ---- Nav: scrolled state, dropdowns, mobile drawer ----
const nav = document.getElementById("nav");
const toggle = nav.querySelector(".nav__toggle");
const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;
function closeMenu() {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
const items = [...nav.querySelectorAll(".menu__item")];
const setOpen = (item, open) => {
  item.classList.toggle("is-open", open);
  item.querySelector(".menu__link").setAttribute("aria-expanded", open);
};
items.forEach((item) => {
  const btn = item.querySelector(".menu__link");
  btn.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    items.forEach((other) => setOpen(other, false));
    setOpen(item, open);
  });
  item.addEventListener("mouseenter", () => { if (isDesktop()) setOpen(item, true); });
  item.addEventListener("mouseleave", () => { if (isDesktop()) setOpen(item, false); });
});
nav.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => { items.forEach((i) => setOpen(i, false)); closeMenu(); }));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { items.forEach((i) => setOpen(i, false)); closeMenu(); } });
document.addEventListener("click", (e) => { if (!e.target.closest(".menu__item")) items.forEach((i) => setOpen(i, false)); });

// ---- Scroll-driven effects: progress bar, parallax photos, timeline line ----
const progress = document.querySelector(".scroll-progress");
const parallax = [...document.querySelectorAll("[data-parallax]")];
const timeline = document.querySelector(".timeline");
let ticking = false;
function onScroll() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  nav.classList.toggle("is-scrolled", y > 30);
  progress.style.setProperty("--p", y / Math.max(1, document.documentElement.scrollHeight - vh));
  if (reduceMotion) return;
  parallax.forEach((el) => {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
  if (!timeline) return;
  const t = timeline.getBoundingClientRect();
  timeline.style.setProperty("--tl", Math.min(1, Math.max(0, (vh * 0.85 - t.top) / (t.height + vh * 0.3))).toFixed(3));
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---- Reveal on scroll (content stays visible without JS); starts once the loader is gone ----
if (!reduceMotion && "IntersectionObserver" in window) {
  root.classList.add("js-anim");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = `${Math.min(4, Math.max(0, siblings.indexOf(el))) * 60}ms`;
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  pageReady.then(() => document.querySelectorAll(".reveal").forEach((el) => io.observe(el)));

  // Numbers count up when they come into view ("+40 anos", "11 serviços")
  const countUp = (el) => {
    const text = el.textContent;
    const target = Number(text.match(/\d+/)?.[0]);
    if (!target) return;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 1000);
      el.textContent = text.replace(/\d+/, String(Math.round(target * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      counters.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  pageReady.then(() => document.querySelectorAll("[data-count]").forEach((el) => counters.observe(el)));
}

// ---- Glass sheen + 3D tilt follow the pointer ----
if (finePointer) {
  document.addEventListener("pointermove", (e) => {
    const g = e.target.closest(".glass");
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", `${e.clientX - r.left}px`);
    g.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
  if (!reduceMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(6px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
}

// ---- Video cards: the card opens its page (link stretched over it); the play button appears only
// once the clip exists in public/videos and opens it in the modal ----
const modal = document.getElementById("videoModal");
const modalVideo = modal?.querySelector("video");
document.querySelectorAll(".vcard").forEach((card) => {
  const src = card.dataset.video;
  const video = card.querySelector("video");
  fetch(src, { method: "HEAD" }).then((res) => {
    if (!res.ok || !(res.headers.get("content-type") || "").startsWith("video")) return;
    video.src = src;
    card.classList.add("has-video");
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => video.pause());
  }).catch(() => {});
  card.querySelector(".vcard__play").addEventListener("click", () => {
    modalVideo.src = src;
    modal.hidden = false;
    modalVideo.play().catch(() => {});
  });
});

// ---- Links to #contato with data-topic / data-prefill choose the subject and start the message ----
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-topic], a[data-prefill]");
  const form = document.querySelector("[data-contact-form]");
  if (!link || !form?.mensagem) return; // no form here, or it was already sent
  if (link.dataset.topic) form.assunto.value = link.dataset.topic;
  // only replace a message we wrote ourselves, never what the visitor typed
  if (link.dataset.prefill && (!form.mensagem.value.trim() || form.mensagem.value === form.dataset.prefilled)) {
    form.mensagem.value = form.dataset.prefilled = link.dataset.prefill;
  }
  setTimeout(() => form.nome.focus({ preventScroll: true }), 700);
});
modal?.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal && !modal.hidden) closeModal(); });
function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modal.hidden = true;
}

document.getElementById("year").textContent = new Date().getFullYear();

// ---- Hero 3D column loads after first paint ----
const canvas = document.getElementById("hero3d");
if (canvas) {
  const start = () => import("./hero3d.js").then((m) => m.initHero3D(canvas));
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 300);
}
