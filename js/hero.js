/* hero.js — Hero split animation
 *
 * STATO INIZIALE:
 *   - Immagine fullscreen (wrapper inset: 0 0 0 0)
 *   - Logo HDGR grande nel terzo sinistro, bianco, sovrapposto all'immagine
 *   - Immagine scale 1.15
 *
 * LOAD (dopo curtain):
 *   - Zoom-out immagine: scale 1.15 → 1.0 (~1.5s)
 *
 * SCROLL FASI:
 *   FASE 1 (0% → 20%): Logo grande svanisce (opacity 0, scale down, y up)
 *                        → logo nav header appare
 *   FASE 2 (15% → 70%): Wrapper immagine si riduce:
 *                        - left: 0 → 33.333%
 *                        - top: 0 → 50px
 *                        - right: 0 → 50px
 *                        - bottom: 0 → 50px
 *                        Risultato: immagine nei 2/3 destri con margine 50px cornice
 *   FASE 3 (25% → 65%): Services fade-in (opacity 0 → 1)
 *   FASE 4 (5%):         Header → dark state
 *
 * REGOLE:
 *   - scrub: true (MAI numeri — macOS trackpad)
 *   - normalizeScroll: MAI
 *   - will-change: gestito dinamicamente via callbacks
 *   - ignoreMobileResize: true
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('[data-hero]');
  if (!heroEl) return;

  // Mobile: nessuna animazione
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const imgWrap   = document.querySelector('[data-hero-img-wrap]');
  const heroImg   = document.querySelector('[data-hero-img]');
  const heroLogo  = document.querySelector('[data-hero-logo]');
  const navLogo   = document.querySelector('[data-hero-logo-nav]');
  const services  = document.querySelector('[data-hero-services]');
  const heroLeft  = document.querySelector('[data-hero-left]');
  const header    = document.querySelector('header');

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Mostra stato finale senza animazione
    if (heroImg) gsap.set(heroImg, { scale: 1 });
    if (imgWrap) gsap.set(imgWrap, { top: 100, right: 50, bottom: 100, left: '33.333%' });
    if (services) gsap.set(services, { opacity: 1, pointerEvents: 'auto' });
    if (navLogo) navLogo.style.opacity = '1';
    if (heroLogo) gsap.set(heroLogo, { opacity: 0 });
    return;
  }

  /* ── LOAD: zoom-out immagine ─────────────────────────────── */
  if (heroImg) {
    gsap.to(heroImg, {
      scale: 1.0,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.6  // aspetta fine curtain enter
    });
  }

  /* ── FASE 1: Logo grande → sale verticalmente verso il nav logo ── */
  if (heroLogo) {
    // Calcola distanza dal logo hero (50vh) al nav logo (top of page)
    const logoRect = heroLogo.getBoundingClientRect();
    const navRect  = navLogo ? navLogo.getBoundingClientRect() : { top: 0 };
    const yDistance = navRect.top - logoRect.top;

    gsap.to(heroLogo, {
      opacity: 0,
      scale: 0.15,
      y: yDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: '20% top',
        scrub: true,
        onLeave: () => {
          if (navLogo) navLogo.style.opacity = '1';
        },
        onEnterBack: () => {
          if (navLogo) navLogo.style.opacity = '0';
        }
      }
    });
  }

  /* ── FASE 2 + 3: Shrink + Services ──────────────────────── *
   *
   * SCROLL DOWN → timeline controllata (1.2s, power3.inOut)
   * SCROLL UP   → legata allo scroll (scrub)
   *
   * Usa una timeline paused. Scroll down: tween il progress a 1.
   * Scroll up: il progress segue la posizione scroll.
   */
  if (imgWrap) {
    const insetProxy = { top: 0, right: 0, bottom: 0, leftPct: 0 };
    const INSET_TB = 100;
    const INSET_R  = 50;
    const INSET_LEFT = 33.333;

    const shrinkTl = gsap.timeline({ paused: true });

    // Shrink immagine
    shrinkTl.to(insetProxy, {
      top: INSET_TB,
      right: INSET_R,
      bottom: INSET_TB,
      leftPct: INSET_LEFT,
      duration: 1,
      ease: 'none',
      onUpdate() {
        imgWrap.style.top    = insetProxy.top + 'px';
        imgWrap.style.right  = insetProxy.right + 'px';
        imgWrap.style.bottom = insetProxy.bottom + 'px';
        imgWrap.style.left   = insetProxy.leftPct + '%';
      }
    }, 0);

    // Services fade-in (parte a 40% della timeline)
    if (services) {
      shrinkTl.to(services, {
        opacity: 1,
        duration: 0.6,
        ease: 'none'
      }, 0.4);
    }

    let controlTween = null;

    ScrollTrigger.create({
      trigger: heroEl,
      start: '10% top',
      end: '38% top',
      onUpdate: (self) => {
        if (self.direction === -1) {
          // Scroll UP → kill forward tween, tie to scroll
          if (controlTween) { controlTween.kill(); controlTween = null; }
          imgWrap.style.willChange = 'top, right, bottom, left';
          shrinkTl.progress(self.progress);
        }
      },
      onEnter: () => {
        // Scroll DOWN → animazione controllata
        imgWrap.style.willChange = 'top, right, bottom, left';
        controlTween = gsap.to(shrinkTl, {
          progress: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            imgWrap.style.willChange = 'auto';
            if (services) services.style.pointerEvents = 'auto';
            controlTween = null;
          }
        });
      },
      onLeaveBack: () => {
        if (controlTween) { controlTween.kill(); controlTween = null; }
        shrinkTl.progress(0);
        imgWrap.style.willChange = 'auto';
        if (services) services.style.pointerEvents = 'none';
      }
    });
  }

  /* ── FASE 4: Header dark state ───────────────────────────── */
  if (header) {
    ScrollTrigger.create({
      trigger: heroEl,
      start: '5% top',
      onEnter:     () => header.classList.add('header-dark'),
      onLeaveBack: () => header.classList.remove('header-dark')
    });
  }
});
