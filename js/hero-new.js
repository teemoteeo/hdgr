/* hero-new.js — Mouse-driven image cycle + header dark state */

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('[data-hero-new]');
  if (!heroEl) return;

  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('header-dark', window.scrollY > window.innerHeight * 0.45);
  }, { passive: true });

  if (window.matchMedia('(max-width: 768px)').matches) {
    if (header) header.classList.add('header-dark');
    return;
  }

  /* ── Custom cursor ── */
  const cursor = document.createElement('div');
  cursor.className = 'hero-cursor';
  document.body.appendChild(cursor);

  heroEl.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
  heroEl.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
    lastX = null; lastY = null; totalDistance = 0;
  });

  /* ── Image cycle ── */
  const imgs = Array.from(heroEl.querySelectorAll('.hero-new-img'));
  if (!imgs.length) return;

  let currentIndex = 0;
  let totalDistance = 0;
  const THRESHOLD = 80;
  let lastX = null;
  let lastY = null;
  let isTransitioning = false;

  function goToImage(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    const prev = imgs[currentIndex];
    const next = imgs[index];
    next.classList.add('is-active');
    setTimeout(() => {
      prev.classList.remove('is-active');
      currentIndex = index;
      isTransitioning = false;
    }, 500);
  }

  heroEl.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    if (lastX === null) { lastX = e.clientX; lastY = e.clientY; return; }
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    lastX = e.clientX;
    lastY = e.clientY;
    if (totalDistance >= THRESHOLD) {
      totalDistance = 0;
      goToImage((currentIndex + 1) % imgs.length);
    }
  });
});
