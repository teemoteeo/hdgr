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

  /* ── Explore button ── */
  const exploreBtn = heroEl.querySelector('[data-hero-explore]');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const start = window.scrollY;
      const target = start + window.innerHeight;
      const duration = 2400;
      const startTime = performance.now();
      function step(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, start + (target - start) * eased);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
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
