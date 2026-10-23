import "./style.css";

const WHATSAPP = "5567991269082";

// WhatsApp links with a prefilled message per button
document.querySelectorAll(".js-wa").forEach((el) => {
  const msg = el.dataset.msg || "Olá! Vim pelo site da Fort Contabilidade.";
  el.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// Nav: solid on scroll + mobile menu
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
const toggle = nav.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Reveal on scroll, staggered within the same parent
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.querySelectorAll(":scope > .reveal")];
    el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 80}ms`;
    el.classList.add("is-in");
    io.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// 3D tilt on cards (pointer devices only)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(10px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Video cards: use the clip if the file exists, otherwise keep the motion placeholder
const modal = document.getElementById("videoModal");
const modalVideo = modal.querySelector("video");
document.querySelectorAll(".vcard").forEach((card) => {
  const src = card.dataset.video;
  const video = card.querySelector("video");
  fetch(src, { method: "HEAD" }).then((res) => {
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("video")) return;
    video.src = src;
    card.classList.add("has-video");
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => video.pause());
  }).catch(() => {});

  card.addEventListener("click", () => {
    if (!card.classList.contains("has-video")) {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero saber mais sobre: ${card.querySelector("h3").textContent}`)}`, "_blank", "noopener");
      return;
    }
    modalVideo.src = src;
    modal.hidden = false;
    modalVideo.muted = false;
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

// Hero 3D loads after first paint so text shows immediately
const canvas = document.getElementById("hero3d");
const start = () => import("./hero3d.js").then((m) => m.initHero3D(canvas));
if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1200 });
else setTimeout(start, 300);
