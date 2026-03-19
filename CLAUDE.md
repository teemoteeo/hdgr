# CLAUDE.md — HDGR Architecture Website
## Master specification v3.0 — Updated 2026-03-18

Leggi TUTTO questo file prima di scrivere una riga di codice.
Poi leggi SPRINT.md per i task attivi del sprint corrente.

---

## 0. CONTEXT

Studio architettura Warsaw. Fondatori: Julian e Leon Hendigery.
Developer lead: Timoteo.
Stack: Pure HTML + CSS + JS. Zero framework. GSAP 3.12.5 CDN. Host: Vercel (GitHub: teemoteeo/hdgr.git).
Domain: hdgr.eu (GoDaddy DNS → Vercel).

File CSS: reset.css / variables.css / typography.css / layout.css / components.css / main.css
File JS:  transitions.js / hero.js / menu.js / projects.js / logo-type.js / lightbox.js / flipboard.js / lang.js (NEW)

-

## 1. DESIGN TOKENS

--color-bg:         #FAF8F5
--color-text:       #0A0A0A
--color-text-muted: #6B6B6B
--color-border:     rgba(10, 10, 10, 0.12)
--color-white:      #FFFFFF
--color-overlay:    #0A0A0A
--font-mono: "Space Mono", monospace

Fluid type scale (Utopia, 360px→1600px):
--step--2 to --step-5 (see variables.css for values)

Fluid spacing: --space-4 / --space-8 / --space-12 / --space-16 / --space-20
--container-max: min(90vw, 1400px)
--header-height: clamp(3.75rem, 3.125rem + 1.25vw, 4.6875rem)

---

## 2. REGOLE INVIOLABILI

- border-radius: 0 su TUTTO. Nessuna eccezione.
- round 0px in clip-path (mai round 8px).
- Font body: Space Mono. Font logo: ABC Marfa Mono (woff2 locale, solo navbar logo).
- Uppercase: SOLO label di sezione. MAI nelle voci del burger menu overlay.
- scroll-behavior: smooth — RIMOSSO, mai riaggiungerlo.
- GSAP scrub: true (MAI valori numerici).
- normalizeScroll: MAI chiamato.
- will-change: gestito dinamicamente (set su animStart, auto su animEnd).
- ignoreMobileResize: true in ScrollTrigger.config().

---

## 3. HERO (index.html)

Struttura:
  section.hero [data-hero]
    div.hero-inner
      div.hero-left [data-hero-left]
        div.hero-services [data-hero-services]
          p.hero-location (flipboard rotating cities)
          div.hero-services-group x2
      button.hero-new-scroll [data-hero-explore]
      div.hero-img-wrap [data-hero-img-wrap]
        div.hero-title [data-hero-title]   ← CENTRATO: top:50% left:50% translate(-50%,-50%)
          h1.hero-new-title  "HDGR"
          p.hero-new-subtitle "Design & Development"
        img.hero-cycle-img x7 (hero/01-07.webp)

Animazione js/hero.js:
- Mobile: auto-rotate 1.8s, no GSAP
- Desktop scroll DOWN: tween controllato progress→1 (1.2s power3.inOut) — FINISCE PER FORZA
- Desktop scroll UP: tween controllato progress→0 (1.2s power3.inOut) — FINISCE PER FORZA
- onLeaveBack: reset istantaneo progress→0
- Title+explore fade-out scroll 0→18%
- header dark state su onEnter/onLeaveBack

CSS chiave:
  .hero { height: 260vh }
  .hero-inner { position: sticky; top: 0; height: 100dvh }
  .hero-left { position: absolute; top:0; left:0; width:33.333% }
  .hero-img-wrap { position: absolute; inset: 0 }
  .hero-title { position: absolute; top:50%; left:50%; transform: translate(-50%,-50%); text-align: center; white-space: nowrap }

---

## 4. PAGE TRANSITIONS (transitions.js)

Fix pagina nera su back nav → index.html (GSAP è defer):
  pageEnter() deve fare PRIMA:
    this.curtain.style.transform = 'translateY(100%)';
    this.curtain.style.transition = 'none';
  POI guard:
    if (typeof gsap !== 'undefined') { gsap.killTweensOf(this.curtain); gsap.set(...) }

Pattern ogni pagina:
  <div class="page-curtain" aria-hidden="true"></div>
  <script src="js/transitions.js"></script>  ← SEMPRE PRIMO

---

## 5. STRUTTURA PAGINE

index.html             header / .hero 260vh / .studio-statement / .projects / .about / footer
projects.html          header.header-dark / .projects-archive (axo-grid) / footer
visualizations.html    header.header-dark / .projects-archive (masonry-gallery) / footer
interior.html          header.header-dark / .projects-archive (masonry-gallery) / footer
portfolio.html         header.header-dark / .portfolio-archive / .buyer-journey / footer
investment.html        header.header-dark / .investment-opportunities / footer  ← NUOVA
interior/x.html        project-hero / project-body / next-project / footer
projects/x.html        project-hero / project-body / next-project / footer

Script in ogni pagina: transitions.js (PRIMO), menu.js, logo-type.js, lang.js
Extra: hero.js+flipboard.js (index), projects.js (projects), lightbox.js (viz+interior)

---

## 6. LOGO & HEADER

Layout header (sx→dx): logo | flex-spacer | lang-switcher | menu-toggle
- Desktop: SVG + typewriter hover (.logo-type)
- Mobile: SVG + "HDGR" (.logo-text) sempre visibili

---

## 7. LANGUAGE SWITCHER (js/lang.js — NUOVO)

Lingue: EN / ES / PL / ZH
- <html data-lang="en"> come root
- Testi traducibili: data-i18n="chiave" sugli elementi
- Lingua salvata in localStorage('hdgr-lang')
- UI: bottone lingua corrente + dropdown 4 opzioni
- Stile: adattivo come menu-toggle (bianco su hero, scuro su header-dark)
- Scope v1: solo UI statica (nav, label, footer, statement, hero subtitle)

HTML in ogni header:
  <div class="lang-switcher">
    <button class="lang-current">EN</button>
    <ul class="lang-dropdown">
      <li data-lang-option="en">EN</li>
      <li data-lang-option="es">ES</li>
      <li data-lang-option="pl">PL</li>
      <li data-lang-option="zh">ZH</li>
    </ul>
  </div>

---

## 8. MENU OVERLAY — VOCI

- About Us
- Investment Opportunities
- News
- Contact

---

## 9. HOMEPAGE CHANGES

Statement: "Design That Lasts, Development That Matters" — corsivo, centrato, bordi sopra/sotto
MOBILE: rimuovere statement in cima, tenere solo quella sotto .about (aggiornare testo)

Award-Winning Projects: SLIDES orizzontali (non masonry statica)
  Nepal School badge overlay: "NEPAL SCHOOL CONTEST / 1ST PRICE ZURICH INSTITUT - 2025"
  Quote card Nepal: "This shi tuff — Adolf Muller" italic

Quote "Building What Time Approves":
  font-weight: 700, centrata
  MOBILE: spostare SOTTO .about, rimuoverla sopra .projects

About Us mobile: flex-basis ~42vw (2+ persone visibili al load)

---

## 10. PORTFOLIO PAGE

Aggiungere .buyer-journey DOPO griglia portfolio:
  Bottone "Check Buyer Journey" → espansione inline (no modale)
  8 step: testo completo in SPRINT.md

---

## 11. INVESTMENT OPPORTUNITIES PAGE (investment.html — NUOVA)

Tab switcher 4 tab:
  - European investors in EU (default)
  - LatAm investors in EU
  - Asian investors in EU
  - EU investors in LatAm/ASEAN

Flowchart per ogni tab:
  Investor Consultation → Opportunity Presentation → In-House Architecture & Development Proposal
                                                                  ↓ (curva ritorno)
  Development & Execution ← Resource Acquisition ← Investment Agreement
          ↓
     Exit     Hold → Property Management

Link in pagina: "Click here" → portfolio.html
Footer con Contact Our Team button.

---

## 12. CONTACT OUR TEAM (tutte le pagine)

Nel footer, dentro .footer-contact:
  <div class="contact-form-wrap">
    <button class="contact-form-toggle">Contact Our Team</button>
    <form class="contact-form" hidden>
      <div class="contact-form-row">
        <input type="text" name="firstname" placeholder="First name">
        <input type="text" name="lastname" placeholder="Last name">
      </div>
      <input type="email" name="email" placeholder="Email">
      <textarea name="message" rows="4" placeholder="Message"></textarea>
      <button type="submit">Send Inquiry</button>
    </form>
  </div>

Toggle click: rimuovi hidden + animazione height.
Submit: mailto:contact@hdgr.eu (placeholder per ora).
Stile: Space Mono, border 1px --color-border, border-radius: 0, bg --color-bg.

---

## 13. SOCIAL LINKS

Instagram: https://www.instagram.com/hdgr.eu/
LinkedIn:  https://www.linkedin.com/company/hdgr-architecture/
Sostituire TUTTI gli href="#" per social in TUTTI i file HTML.

---

## 14. MOBILE SPECIFICHE

- Hero: auto-rotate 1.8s, no GSAP, header sempre dark
- About Us: flex-basis ~42vw
- Quote: solo quella sotto .about (testo "Design That Lasts...")
- Award-winning: scroll-snap orizzontale
- Lang switcher: visibile e funzionante

---

## 15. CHECKLIST SESSIONE

[ ] border-radius: 0
[ ] Space Mono body, ABC Marfa Mono logo
[ ] scroll-behavior smooth assente
[ ] .page-curtain in ogni HTML
[ ] transitions.js PRIMO
[ ] lang.js presente
[ ] scrub: true
[ ] normalizeScroll assente
[ ] will-change dinamico
[ ] ignoreMobileResize: true
[ ] data-hero-logo-nav su index.html header
[ ] Voci menu: sentence case
[ ] Instagram + LinkedIn href reali
[ ] Lang switcher in header

---

## 16. ANTI-REGRESSIONE

- normalizeScroll() → VIETATO
- scrub numerico → VIETATO
- scroll-behavior smooth → VIETATO
- border-radius → 0
- uppercase burger menu → VIETATO
- "Archive" → "Investment Opportunities"
- "Featured Projects" → "Award-Winning Projects"
- gsap.set in pageEnter senza typeof guard → pagina nera

---

## References
telhaclarke.com.au / arkitektkontoretvest.no / pihlmann.dk / bcarchitects.org / tlo.archi

v3.0 — 2026-03-18
