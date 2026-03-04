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
 * sessionStorage keys:
 *   prev-url  — URL stored on every pageExit, used by pageBack()
 *   back-nav  — flag set by pageBack(), read + cleared by pageEnter()
 */

const PageTransitions = {
  curtain: null,
  isAnimating: false,
  prefersReducedMotion: false,

  init() {
    this.curtain = document.querySelector('.page-curtain');
    if (!this.curtain) return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.pageEnter();
    this.bindLinks();
    this.bindBackButtons();
  },

  pageEnter() {
    if (this.prefersReducedMotion) {
      gsap.set(this.curtain, { yPercent: 100 });
      return;
    }

    const isBack = sessionStorage.getItem('back-nav') === '1';
    sessionStorage.removeItem('back-nav');

    if (isBack) {
      // Back: curtain slides DOWN off screen, revealing page from top
      gsap.to(this.curtain, {
        yPercent: 100,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => gsap.set(this.curtain, { yPercent: 100 })
      });
    } else {
      // Forward: curtain slides UP off screen, revealing page from bottom
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

    // Store current URL so pageBack() knows where to return
    sessionStorage.setItem('prev-url', window.location.href);

    if (this.prefersReducedMotion) {
      window.location.href = url;
      return;
    }

    // Curtain slides UP from bottom to cover screen
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

    // Fallback: go up one directory toward index
    const url = sessionStorage.getItem('prev-url') || '../index.html';
    sessionStorage.setItem('back-nav', '1');

    if (this.prefersReducedMotion) {
      window.location.href = url;
      return;
    }

    // Snap curtain above screen, then slide DOWN to cover
    gsap.set(this.curtain, { yPercent: -100 });
    gsap.to(this.curtain, {
      yPercent: 0,
      duration,
      ease: 'expo.in',
      onComplete: () => { window.location.href = url; }
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
  }
};

document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
