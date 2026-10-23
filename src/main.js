import "./style.css";
import { AREAS } from "./data.js";

const WHATSAPP = "5567991269082";
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const serviceMsg = (area, item) => `Olá! Quero saber mais sobre ${area.label}: ${item}.`;
const chevron = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';

// ---- Mega menu, area tabs and footer columns, all from data.js ----
const menuList = document.querySelector(".menu__list");
menuList.insertAdjacentHTML("beforeend", AREAS.map((area) => `
  <li class="menu__item">
    <button class="menu__link" aria-expanded="false">${esc(area.label)}${chevron}</button>
    <div class="mega glass" style="--cols:${area.groups.length}">
      ${area.groups.map((g) => `
        <div class="mega__group">
          ${g.title ? `<p class="mega__title">${esc(g.title)}</p>` : ""}
          <ul>${g.items.map((it) => `<li><a href="${waLink(serviceMsg(area, it))}" target="_blank" rel="noopener">${esc(it)}</a></li>`).join("")}</ul>
        </div>`).join("")}
      <a class="mega__more" href="#${area.id}" data-area="${area.id}">Ver ${esc(area.title.toLowerCase())} →</a>
    </div>
  </li>`).join(""));

const tabs = document.querySelector(".areas__tabs");
const panels = document.querySelector(".areas__panels");
tabs.innerHTML = AREAS.map((a, i) => `<button class="areas__tab" role="tab" id="tab-${a.id}" aria-controls="${a.id}" aria-selected="${i === 0}">${esc(a.label)}</button>`).join("");
panels.innerHTML = AREAS.map((a, i) => `
  <div class="glass panel" role="tabpanel" id="${a.id}" aria-labelledby="tab-${a.id}" ${i ? "hidden" : ""}>
    <div><h3>${esc(a.title)}</h3><p class="panel__lead">${esc(a.lead)}</p>
      <a class="btn btn--gold" href="${waLink(`Olá! Quero falar sobre ${a.label}.`)}" target="_blank" rel="noopener">Falar sobre ${esc(a.label)}</a></div>
    <div class="panel__groups">${a.groups.map((g) => `
      <div class="panel__group">${g.title ? `<h4>${esc(g.title)}</h4>` : ""}
        <ul class="chips">${g.items.map((it) => `<li><a href="${waLink(serviceMsg(a, it))}" target="_blank" rel="noopener">${esc(it)}</a></li>`).join("")}</ul>
      </div>`).join("")}</div>
  </div>`).join("");

function selectArea(id) {
  tabs.querySelectorAll(".areas__tab").forEach((t) => t.setAttribute("aria-selected", t.getAttribute("aria-controls") === id));
  panels.querySelectorAll(".panel").forEach((p) => { p.hidden = p.id !== id; });
}
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

document.querySelector(".footer__cols").innerHTML = [
  `<div><h4>Institucional</h4><ul><li><a href="#inicio">Home</a></li><li><a href="#quemsomos">Quem somos</a></li><li><a href="#historia">Nossa história</a></li><li><a href="#contato">Contato</a></li></ul></div>`,
  ...[AREAS.slice(0, 3), AREAS.slice(3)].map((col) => `<div><h4>Serviços</h4><ul>${col.map((a) => `<li><a href="#${a.id}" data-area="${a.id}">${esc(a.label)}</a></li>`).join("")}</ul></div>`),
].join("");

// Links that point at an area open its tab and scroll to the section
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-area]");
  if (!link) return;
  e.preventDefault();
  selectArea(link.dataset.area);
  closeMenu();
  document.getElementById("servicos").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});

// ---- WhatsApp buttons ----
document.querySelectorAll(".js-wa").forEach((el) => {
  el.href = waLink(el.dataset.msg || "Olá! Vim pelo site da Fort Contabilidade.");
  el.target = "_blank";
  el.rel = "noopener";
});

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
nav.querySelectorAll(".menu__list > li > a.menu__link").forEach((a) => a.addEventListener("click", closeMenu));
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
  const t = timeline.getBoundingClientRect();
  timeline.style.setProperty("--tl", Math.min(1, Math.max(0, (vh * 0.85 - t.top) / (t.height + vh * 0.3))).toFixed(3));
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---- Reveal on scroll (content stays visible without JS) ----
if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js-anim");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 90}ms`;
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
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

// ---- Video cards: play the clip if it exists, otherwise open WhatsApp ----
const modal = document.getElementById("videoModal");
const modalVideo = modal.querySelector("video");
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
  card.addEventListener("click", () => {
    if (!card.classList.contains("has-video")) {
      window.open(waLink(`Olá! Quero saber mais sobre: ${card.querySelector("h3").textContent}`), "_blank", "noopener");
      return;
    }
    modalVideo.src = src;
    modal.hidden = false;
    modalVideo.play().catch(() => {});
  });
});
modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modal.hidden = true;
}

document.getElementById("year").textContent = new Date().getFullYear();

// ---- Hero 3D column loads after first paint ----
const canvas = document.getElementById("hero3d");
const start = () => import("./hero3d.js").then((m) => m.initHero3D(canvas));
if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1200 });
else setTimeout(start, 300);
