// HTML templates rendered at build time by the plugin in vite.config.js.
// Header, footer, home tabs, timeline and the area pages all come from data.js,
// so every page ships as static HTML and each text lives in one place.
import { AREAS, STEPS, TIMELINE, TOPICS } from "./data.js";
import { CONTACT, SITE_URL, waLink } from "./contact.js";

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const areaUrl = (a) => `/${a.slug}/`;
const serviceMsg = (a, item) => `Olá! Quero saber mais sobre ${a.label}: ${item.name}.`;
const wa = (msg) => `href="${esc(waLink(msg))}" target="_blank" rel="noopener"`;
const img = (...files) => `--img:${files.map((f) => `url(/img/${f})`).join(", ")}`;
const pad = (n) => String(n).padStart(2, "0");
const chevron = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
const logo = '<svg class="logo" viewBox="0 0 2144 795" width="124" height="46" role="img" aria-label="Fort Contabilidade"><use href="#logo" /></svg>';
const waIcon = '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6a10.6 10.6 0 01-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1116 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 01-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.7 6.3 6.3 0 001.3 3.3 14.4 14.4 0 005.5 4.9c2 .9 2.8.9 3.8.8a3.3 3.3 0 002.1-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>';

// Menu highlights must name real services, otherwise their anchors would lead nowhere
for (const a of AREAS) for (const name of a.menu) {
  if (!a.groups.some((g) => g.items.some((it) => it.name === name))) throw new Error(`Menu item "${name}" is not a service of ${a.label}`);
}

export const areaById = (id) => {
  const area = AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown area "${id}" in page marker`);
  return area;
};

export const headCommon = () => `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0f1012" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Fort Contabilidade" />
  <meta property="og:locale" content="pt_BR" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <!-- fonts load without blocking the first paint (only the widths the CSS uses: 85% to 110%) -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@85..110,500..900&family=Inter:wght@400;500;600&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@85..110,500..900&family=Inter:wght@400;500;600&display=swap" /></noscript>
  <!-- Chrome/Edge prepare the next page while the pointer rests on a link, so it opens almost instantly -->
  <script type="speculationrules">{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>
  <style>
    /* Critical CSS: applies before the main stylesheet loads, so nothing flashes unstyled behind the loader */
    html, body { margin: 0; background: #0f1012; }
    .logo { height: 46px; width: auto; }
    .loader { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; background: radial-gradient(60% 50% at 50% 45%, #1e1f24, #0f1012 70%); transition: opacity .4s cubic-bezier(.2,.7,.2,1), visibility .4s; animation: loaderSafe .4s 2.5s forwards; }
    .loader__inner { display: grid; justify-items: center; gap: 28px; }
    .loader__logo { width: min(230px, 58vw); height: auto; --lg-c: #e6c77f; --lg-f: #f4f3ef; --lg-t: #a9aaad; animation: loaderPulse 1.8s ease-in-out infinite; }
    .loader__bar { position: relative; width: 132px; height: 2px; border-radius: 2px; overflow: hidden; background: rgba(255,255,255,.12); }
    .loader__bar span { position: absolute; inset: 0; width: 45%; background: linear-gradient(90deg, transparent, #e6c77f, transparent); animation: loaderBar 1.1s ease-in-out infinite; }
    @keyframes loaderPulse { 0%, 100% { opacity: .7; transform: scale(.97); } 50% { opacity: 1; transform: scale(1); } }
    @keyframes loaderBar { from { transform: translateX(-100%); } to { transform: translateX(240%); } }
    @keyframes loaderSafe { to { opacity: 0; visibility: hidden; } } /* fallback if the script never runs */
    html.is-ready .loader { opacity: 0; visibility: hidden; animation: none; }
    html.is-loaded .loader { display: none; } /* removed after the fade, so it can never block clicks */
    html.is-leaving .loader { opacity: 1; visibility: visible; animation: none; transition-duration: .18s; }
  </style>`;

const serviceCount = (a) => a.groups.reduce((n, g) => n + g.items.length, 0);

export function header(path) {
  const link = (href, label) => `<li><a class="menu__link" href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a></li>`;
  // All areas live under one "Serviços" panel: each shows its page link and a few highlighted services
  const onArea = AREAS.some((a) => path === areaUrl(a));
  const services = `
          <li class="menu__item menu__item--services">
            <button class="menu__link${onArea ? " is-current" : ""}" aria-expanded="false">Serviços${chevron}</button>
            <div class="mega mega--services glass">
              ${AREAS.map((a) => `
              <div class="mega__area${path === areaUrl(a) ? " is-current" : ""}">
                <a class="mega__head" href="${areaUrl(a)}">${esc(a.label)}<small>${serviceCount(a)} serviços</small></a>
                <ul>${a.menu.map((name) => `<li><a href="${areaUrl(a)}#${slugify(name)}">${esc(name)}</a></li>`).join("")}</ul>
                <a class="mega__all" href="${areaUrl(a)}#servicos">Ver todos →</a>
              </div>`).join("")}
              <div class="mega__foot"><span>Não sabe qual serviço precisa?</span><a ${wa("Olá! Não sei qual serviço preciso e quero falar com um contador.")}>Fale com um contador ↗</a></div>
            </div>
          </li>`;
  return `
  <div class="loader" aria-hidden="true">
    <div class="loader__inner">
      <svg class="loader__logo" viewBox="0 0 2144 795" width="230" height="85"><use href="#logo" /></svg>
      <span class="loader__bar"><span></span></span>
    </div>
  </div>
  <div class="scroll-progress" aria-hidden="true"><span></span></div>
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a href="/" class="nav__logo" aria-label="Fort Contabilidade, início">${logo}</a>
      <nav class="menu" id="menu" aria-label="Principal">
        <ul class="menu__list">
          ${link("/", "Home")}
          ${link("/quem-somos/", "Quem somos")}${services}
          ${link("/#contato", "Contato")}
        </ul>
        <a class="btn btn--gold menu__cta" ${wa("Olá! Quero falar com um contador da Fort.")}>Fale com um contador</a>
      </nav>
      <button class="nav__toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
    </div>
  </header>`;
}

export function footer() {
  const list = (items) => `<ul>${items.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul>`;
  const services = [AREAS.slice(0, 3), AREAS.slice(3)].map((col) => `<div><h4>Serviços</h4>${list(col.map((a) => [areaUrl(a), a.label]))}</div>`).join("");
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          ${logo}
          <p>Contabilidade próxima, estratégica e comprometida com os resultados de cada cliente.</p>
          <ul class="footer__contact">
            <li>${esc(CONTACT.address)}</li>
            <li><a ${wa("Olá! Vim pelo site da Fort Contabilidade.")}>WhatsApp ${esc(CONTACT.phone)}</a></li>
            <li><a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a></li>
            <li>${esc(CONTACT.hours)}</li>
          </ul>
        </div>
        <div class="footer__cols">
          <div><h4>Institucional</h4>${list([["/", "Home"], ["/quem-somos/", "Quem somos"], ["/quem-somos/#historia", "Nossa história"], ["/#avaliacoes", "Depoimentos"], ["/#contato", "Contato"]])}</div>
          ${services}
        </div>
      </div>
      <div class="footer__bottom">
        <p>CNPJ 49.795.525/0001-50 · CRC/MS 001894/O-5</p>
        <p>© <span id="year">${new Date().getFullYear()}</span> Fort Contabilidade. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>

  <a class="wa-float" ${wa("Olá! Vim pelo site e gostaria de falar com a Fort Contabilidade.")} aria-label="Falar no WhatsApp">${waIcon}</a>`;
}

// Home: one tab per area, services open WhatsApp with the service in the message
export function areaTabs() {
  const tabs = AREAS.map((a, i) => `<button class="areas__tab" role="tab" id="tab-${a.id}" aria-controls="${a.id}" aria-selected="${i === 0}">${esc(a.label)}</button>`).join("");
  const panels = AREAS.map((a, i) => `
          <div class="glass panel" role="tabpanel" id="${a.id}" aria-labelledby="tab-${a.id}"${i ? " hidden" : ""}>
            <div><h3>${esc(a.title)}</h3><p class="panel__lead">${esc(a.lead)}</p>
              <div class="panel__cta">
                <a class="btn btn--gold" href="${areaUrl(a)}">Ver ${esc(a.title.toLowerCase())}</a>
                <a class="btn btn--glass" ${wa(`Olá! Quero falar sobre ${a.label}.`)}>WhatsApp</a>
              </div></div>
            <div class="panel__groups">${a.groups.map((g) => `
              <div class="panel__group"><h4>${esc(g.title)}</h4>
                <ul class="chips">${g.items.map((it) => `<li><a href="${areaUrl(a)}#${slugify(it.name)}">${esc(it.name)}</a></li>`).join("")}</ul>
              </div>`).join("")}</div>
          </div>`).join("");
  return `<div class="areas__tabs reveal" role="tablist" aria-label="Áreas de atuação">${tabs}</div>
        <div class="areas__panels">${panels}</div>`;
}

export const timeline = () => `<ol class="timeline">${TIMELINE.map((t) => `
          <li class="tl reveal"><span class="tl__dot" aria-hidden="true"></span><span class="tl__year">${t.year}</span><div class="glass tl__card${t.gold ? " tl__card--gold" : ""}"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join("")}
        </ol>`;

// Grid of area cards linking to their pages (area pages and "Quem somos").
// An odd count gets a WhatsApp card so the last row of the 3-column grid is full.
export const areaCards = (areas) => `<div class="others__grid">${areas.map((a) => `
          <a class="other tilt reveal" href="${areaUrl(a)}">
            <div class="ph other__ph" style="${img(a.photo)}" aria-hidden="true"></div>
            <span class="other__go" aria-hidden="true">→</span>
            <div class="other__body"><h3>${esc(a.title)}</h3><p>${esc(a.lead)}</p></div>
          </a>`).join("")}${areas.length % 3 ? `
          <a class="other other--cta tilt reveal" ${wa("Olá! Não sei qual serviço preciso e quero falar com um contador.")}>
            <span class="other__go" aria-hidden="true">↗</span>
            <div class="other__body"><h3>Não sabe por onde começar?</h3><p>Conte o que sua empresa precisa e indicamos o caminho.</p><span class="btn btn--gold">Falar no WhatsApp</span></div>
          </a>` : ""}
        </div>`;

const icon = {
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 1114 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  insta: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
};

// Contact section: details on one side, the form (sent to /api/contact) on the other.
// `topic` preselects the subject; `map` adds the Google map below (home only).
export function contactSection({ title = "Fale com um contador agora", topic = "", map = false } = {}) {
  const item = (svg, label, value) => `<li class="glass reveal">${svg}<div><strong>${label}</strong>${value}</div></li>`;
  return `
    <section class="section contact" id="contato">
      <div class="container contact__grid">
        <div class="contact__info">
          <p class="eyebrow reveal">Contato</p>
          <h2 class="reveal">${esc(title)}</h2>
          <p class="section__lead reveal">Mande sua mensagem e respondemos no horário de atendimento. Se preferir, chame direto no WhatsApp.</p>
          <ul class="contact__list">
            ${item(icon.phone, "WhatsApp", `<a ${wa("Olá! Vim pelo site da Fort Contabilidade.")}>${esc(CONTACT.phone)}</a>`)}
            ${item(icon.mail, "E-mail", `<a href="mailto:${CONTACT.email}">${esc(CONTACT.email)}</a>`)}
            ${item(icon.pin, "Endereço", `<span>${esc(CONTACT.address)}</span>`)}
            ${item(icon.clock, "Horário", `<span>${esc(CONTACT.hours)}</span>`)}
            ${item(icon.insta, "Instagram", `<a href="${CONTACT.instagram}" target="_blank" rel="noopener">@fort_contabilidade</a>`)}
          </ul>
        </div>
        <form class="glass cform reveal" data-contact-form novalidate>
          <h3 class="cform__title">Envie sua mensagem</h3>
          <div class="cform__row">
            <label class="field"><span>Nome *</span><input name="nome" autocomplete="name" required minlength="2" maxlength="80" /></label>
            <label class="field"><span>WhatsApp *</span><input name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(67) 99999-9999" required maxlength="20" /></label>
          </div>
          <div class="cform__row">
            <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email" maxlength="120" /></label>
            <label class="field"><span>Assunto</span><select name="assunto">${TOPICS.map((t) => `<option${t === topic ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
          </div>
          <label class="field"><span>Mensagem *</span><textarea name="mensagem" rows="4" required minlength="5" maxlength="2000" placeholder="Conte rapidamente o que sua empresa precisa"></textarea></label>
          <label class="field field--hp" aria-hidden="true"><span>Site</span><input name="site" tabindex="-1" autocomplete="off" /></label>
          <label class="check"><input type="checkbox" name="aceite" required /><span>Autorizo a Fort Contabilidade a usar estes dados para responder ao meu contato, conforme a LGPD.</span></label>
          <p class="cform__msg" role="status" aria-live="polite"></p>
          <button class="btn btn--gold cform__send" type="submit">Enviar mensagem</button>
        </form>
      </div>${map ? `
      <div class="container">
        <div class="glass contact__map reveal">
          <iframe title="Mapa: Fort Contabilidade, Rua Cuiabá 1840, Dourados/MS" src="https://www.google.com/maps?q=Rua+Cuiab%C3%A1,+1840,+Centro,+Dourados+-+MS&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>` : ""}
    </section>`;
}

// Client reviews: approved ones load from /api/feedback (main.js); the dialog sends new ones for approval
export const reviewsSection = () => `
    <section class="section reviews" id="avaliacoes">
      <div class="container">
        <div class="reviews__head">
          <div class="section__head reveal">
            <p class="eyebrow">Depoimentos</p>
            <h2>Quem é cliente, recomenda</h2>
            <p class="section__lead">Avaliações de clientes da Fort, publicadas depois de conferidas pela nossa equipe.</p>
          </div>
          <div class="reviews__summary reveal" data-reviews-summary hidden></div>
        </div>
        <div class="reviews__track" data-reviews hidden></div>
        <div class="glass reviews__cta reveal">
          <div><h3 data-reviews-cta>Já é cliente da Fort?</h3><p>Conte como é trabalhar com a gente. Sua avaliação ajuda outras empresas a escolher com segurança.</p></div>
          <button class="btn btn--gold" type="button" data-review-open>Avaliar a Fort</button>
        </div>
      </div>
      <dialog class="glass review-dialog" data-review-dialog aria-labelledby="review-title">
        <form class="cform" data-review-form novalidate>
          <button class="review-dialog__close" type="button" data-review-close aria-label="Fechar">×</button>
          <h3 class="cform__title" id="review-title">Avaliar a Fort</h3>
          <fieldset class="field rating">
            <legend>Sua nota *</legend>
            <div class="stars-input">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" id="nota-${n}" name="nota" value="${n}" required /><label for="nota-${n}" title="${n} estrela${n > 1 ? "s" : ""}">★</label>`).join("")}</div>
          </fieldset>
          <div class="cform__row">
            <label class="field"><span>Nome *</span><input name="nome" autocomplete="name" required minlength="2" maxlength="60" /></label>
            <label class="field"><span>Empresa ou profissão</span><input name="empresa" autocomplete="organization" maxlength="80" /></label>
          </div>
          <label class="field"><span>Comentário *</span><textarea name="comentario" rows="4" required minlength="10" maxlength="600" placeholder="Como a Fort ajudou a sua empresa?"></textarea></label>
          <label class="field field--hp" aria-hidden="true"><span>Site</span><input name="site" tabindex="-1" autocomplete="off" /></label>
          <label class="check"><input type="checkbox" name="aceite" required /><span>Autorizo a Fort a publicar no site meu nome, empresa e comentário.</span></label>
          <p class="cform__msg" role="status" aria-live="polite"></p>
          <button class="btn btn--gold cform__send" type="submit">Enviar avaliação</button>
        </form>
      </dialog>
    </section>`;

export const areaHead = (a) => `
  <title>${esc(a.heading)} | Fort Contabilidade Dourados/MS</title>
  <meta name="description" content="${esc(a.lead)}" />
  <link rel="canonical" href="${SITE_URL}${areaUrl(a)}" />
  <meta property="og:title" content="${esc(a.title)} | Fort Contabilidade" />
  <meta property="og:description" content="${esc(a.lead)}" />
  <meta property="og:image" content="${SITE_URL}/img/${a.photo}" />`;

export function areaPage(a) {
  const count = serviceCount(a);
  let n = 0;
  return `
  <main>
    <section class="page-hero">
      <div class="ph page-hero__bg" data-parallax="0.12" style="${img(a.photo)}" aria-hidden="true"></div>
      <div class="container page-hero__inner">
        <nav class="crumbs" aria-label="Você está em"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#servicos">Áreas de atuação</a><span aria-hidden="true">/</span><span aria-current="page">${esc(a.label)}</span></nav>
        <p class="eyebrow">${esc(a.title)}</p>
        <h1 class="page-hero__title">${esc(a.heading)}</h1>
        <p class="page-hero__lead">${esc(a.lead)}</p>
        <div class="hero__cta">
          <a class="btn btn--gold" href="#contato" data-prefill="Quero falar com um especialista em ${esc(a.label)}.">Falar com um especialista</a>
          <a class="btn btn--glass" href="#servicos">Ver os serviços</a>
        </div>
      </div>
    </section>

    <section class="section intro">
      <div class="container intro__grid">
        <div>
          <p class="eyebrow reveal">Como ajudamos</p>
          <h2 class="reveal">O que a Fort faz pela sua empresa</h2>
          <p class="intro__text reveal">${esc(a.intro)}</p>
          <h3 class="intro__sub reveal">Para quem é</h3>
          <ul class="checks reveal">${a.audience.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>
        <figure class="about__photo reveal" data-parallax="0.06">
          <div class="ph" style="${img(a.photo2)}" role="img" aria-label="${esc(a.title)}"></div>
          <figcaption class="glass about__badge"><strong data-count>${count} serviços</strong><span>em ${esc(a.label)}</span></figcaption>
        </figure>
      </div>
    </section>

    <section class="section services" id="servicos">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Serviços</p>
          <h2>Tudo o que fazemos em ${esc(a.label)}</h2>
          <p class="section__lead">Escolha um serviço e envie sua solicitação em poucos segundos.</p>
        </div>
        ${a.groups.map((g) => `
        <div class="svc-group">
          <h3 class="svc-group__title reveal">${esc(g.title)}</h3>
          <div class="svc-grid">${g.items.map((it) => `
            <article class="glass svc reveal" id="${slugify(it.name)}">
              <span class="svc__n">${pad(++n)}</span>
              <h3>${esc(it.name)}</h3>
              <p>${esc(it.desc)}</p>
              <div class="svc__actions">
                <a class="svc__go" href="#contato" data-prefill="Quero saber mais sobre ${esc(it.name)}.">Quero este serviço <span aria-hidden="true">→</span></a>
                <a class="svc__wa" ${wa(serviceMsg(a, it))} aria-label="Falar sobre ${esc(it.name)} no WhatsApp">WhatsApp</a>
              </div>
            </article>`).join("")}
          </div>
        </div>`).join("")}
      </div>
    </section>

    <section class="section steps">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Como trabalhamos</p>
          <h2>Do primeiro contato ao acompanhamento</h2>
        </div>
        <ol class="steps__grid">${STEPS.map((s, i) => `
          <li class="glass step tilt reveal reveal--zoom"><span class="step__n">${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="section faq">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Dúvidas frequentes</p>
          <h2>Perguntas sobre ${esc(a.label)}</h2>
        </div>
        <div class="faq__list">${a.faq.map((f) => `
          <details class="glass faq__item reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
        </div>
      </div>
    </section>
${contactSection({ title: `Vamos conversar sobre ${a.label}?`, topic: a.label })}

    <section class="section others">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Outras áreas</p>
          <h2>Conheça também</h2>
        </div>
        ${areaCards(AREAS.filter((x) => x !== a))}
      </div>
    </section>
  </main>`;
}
