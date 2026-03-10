/* hero.js — Static hero: header dark-state scroll listener only */

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('[data-hero]');
  if (!heroEl) return;

  const header = document.querySelector('header');
  if (!header) return;

  const threshold = heroEl.offsetHeight * 0.05;

  window.addEventListener('scroll', () => {
    header.classList.toggle('header-dark', window.scrollY > threshold);
  }, { passive: true });
});
