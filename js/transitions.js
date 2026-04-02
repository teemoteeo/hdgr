(function() {
  var isBack = sessionStorage.getItem('back-nav') === '1' || window.name === 'hdgr-back';
  if (isBack) {
    var curtain = document.querySelector('.page-curtain');
    if (curtain) {
      curtain.style.transition = 'none';
      curtain.style.transform = 'translateY(100%)';
    }
  }
})();

/* transitions.js - Page transition system (curtain overlay)
 *
 * FORWARD navigation (link click):
 *   Exit:  curtain slides UP from bottom   (yPercent: 100 → 0)
 *   Enter: curtain slides UP off screen    (yPercent: 0 → -100)
 *
 * BACK navigation (.project-back button):
 *   No animation — history.back() + bfcache make curtain coordination unreliable.
 *   Curtain is cleared instantly on enter.
 *
 * Uses history.back() so the destination is always correct.
 * pageshow listener handles bfcache restores (modern browsers).
 */

const PageTransitions = {
  curtain: null,
  isAnimating: false,
  prefersReducedMotion: false,

  init() {
    this.curtain = document.querySelector('.page-curtain');
    if (!this.curtain) return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // bfcache: page restored from memory after history.back() —
    // DOMContentLoaded does NOT fire again, but pageshow does.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) this.pageEnter();
    });

    this.pageEnter();
    this.bindLinks();
    this.bindBackButtons();
    this.initBackButtonColor();
  },

  pageEnter() {
    // Always reset — page is interactive again (fixes bfcache restore with isAnimating = true)
    this.isAnimating = false;

    // Detect back navigation via two signals: sessionStorage (standard) + window.name (bfcache-safe)
    const isBack = sessionStorage.getItem('back-nav') === '1' || window.name === 'hdgr-back';
    sessionStorage.removeItem('back-nav');
    if (window.name === 'hdgr-back') window.name = '';

    if (this.prefersReducedMotion || isBack) {
      // Direct style fallback — works even if GSAP not yet parsed
      this.curtain.style.transition = 'none';
      this.curtain.style.transform = 'translateY(100%)';
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(this.curtain);
        gsap.set(this.curtain, { yPercent: 100 });
      }
      return;
    }

    // Forward enter — also guard gsap
    if (typeof gsap === 'undefined') {
      this.curtain.style.transition = 'transform 0.65s ease';
      this.curtain.style.transform = 'translateY(-100%)';
      setTimeout(() => { this.curtain.style.transform = 'translateY(100%)'; }, 750);
      return;
    }
    gsap.to(this.curtain, {
      yPercent: -100,
      duration: 0.65,
      ease: 'power3.out',
      onComplete: () => gsap.set(this.curtain, { yPercent: 100 })
    });
  },

  pageExit(url, duration = 0.55) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (this.prefersReducedMotion) {
      window.location.href = url;
      return;
    }

    // Start the animation first, then navigate after 2 rAF frames.
    // This guarantees GSAP paints its first frame before the browser
    // begins unloading — eliminating the first-navigation stutter.
    gsap.to(this.curtain, {
      yPercent: 0,
      duration,
      ease: 'power2.in'
    });
    requestAnimationFrame(() => requestAnimationFrame(() => { window.location.href = url; }));
  },

  pageBack() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Set both signals: sessionStorage for fresh loads, window.name for bfcache restores
    sessionStorage.setItem('back-nav', '1');
    window.name = 'hdgr-back';

    // Navigate immediately — no curtain animation for back nav
    const hasHistory = window.history.length > 1;
    hasHistory ? history.back() : (window.location.href = 'index.html');
  },

  bindLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('http') ||
          link.target === '_blank') return;

      link.addEventListener('click', e => {
        e.preventDefault();
        const isHeroPage = !!document.querySelector('[data-hero]');
        this.pageExit(href, isHeroPage ? 0.75 : 0.55);
      });
    });
  },

  bindBackButtons() {
    document.querySelectorAll('.project-back, .project-back-fixed, .project-back-abs').forEach(btn => {
      btn.addEventListener('click', () => this.pageBack());
    });
  },

  initBackButtonColor() {
    const nav = document.querySelector('.project-nav');
    const body = document.querySelector('.project-body');
    if (!nav || !body) return;

    nav.classList.add('is-light');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nav.classList.remove('is-light');
          nav.classList.add('is-dark');
        } else {
          nav.classList.remove('is-dark');
          nav.classList.add('is-light');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -95% 0px'
    });

    observer.observe(body);
  }
};

document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
