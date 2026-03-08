/* transitions.js - Page transition system (curtain overlay)
 *
 * FORWARD navigation (link click):
 *   Exit:  curtain slides UP from bottom   (yPercent: 100 → 0)
 *   Enter: curtain slides UP off screen    (yPercent: 0 → -100)
 *
 * BACK navigation (.project-back button):
 *   Exit:  curtain slides DOWN from top    (yPercent: -100 → 0)
 *   Enter: curtain slides DOWN off screen  (yPercent: 0 → 100)
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

    if (this.prefersReducedMotion) {
      gsap.set(this.curtain, { yPercent: 100 });
      return;
    }

    const isBack = sessionStorage.getItem('back-nav') === '1';
    sessionStorage.removeItem('back-nav');

    if (isBack) {
      // Back: curtain slides DOWN off screen
      gsap.to(this.curtain, {
        yPercent: 100,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => gsap.set(this.curtain, { yPercent: 100 })
      });
    } else {
      // Forward: curtain slides UP off screen
      gsap.to(this.curtain, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => gsap.set(this.curtain, { yPercent: 100 })
      });
    }
  },

  pageExit(url, duration = 0.4) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (this.prefersReducedMotion) {
      window.location.href = url;
      return;
    }

    gsap.to(this.curtain, {
      yPercent: 0,
      duration,
      ease: 'expo.in',
      onComplete: () => { window.location.href = url; }
    });
  },

  pageBack(duration = 0.4) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    sessionStorage.setItem('back-nav', '1');

    // Fallback: se non c'è storia nel browser, vai a index.html
    const hasHistory = window.history.length > 1;
    const goBack = () => hasHistory ? history.back() : (window.location.href = 'index.html');

    if (this.prefersReducedMotion) {
      goBack();
      return;
    }

    gsap.set(this.curtain, { yPercent: -100 });
    gsap.to(this.curtain, {
      yPercent: 0,
      duration,
      ease: 'expo.in',
      onComplete: goBack
    });
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
        this.pageExit(href, isHeroPage ? 0.6 : 0.4);
      });
    });
  },

  bindBackButtons() {
    document.querySelectorAll('.project-back').forEach(btn => {
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
