/* transitions.js - Page transition system (curtain overlay)
 *
 * Every navigation triggers a dark curtain that slides up (exit)
 * then slides away on the new page (enter).
 *
 * Curtain starts covering the page (CSS translateY(0%)),
 * so there is never a flash of content before the reveal.
 *
 * Timing:
 *   Exit from hero page (index.html): 0.6s
 *   Exit from other pages: 0.4s
 *   Enter (all pages): 0.5s
 */

const PageTransitions = {
  curtain: null,
  isAnimating: false,
  prefersReducedMotion: false,

  init() {
    this.curtain = document.querySelector('.page-curtain');
    if (!this.curtain) return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Curtain already covers page via CSS — just reveal
    this.pageEnter();
    this.bindLinks();
  },

  pageEnter() {
    if (this.prefersReducedMotion) {
      gsap.set(this.curtain, { yPercent: 100 });
      return;
    }

    gsap.to(this.curtain, {
      yPercent: -100,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => gsap.set(this.curtain, { yPercent: 100 })
    });
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
  }
};

document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
