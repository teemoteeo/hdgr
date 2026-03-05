/* flipboard.js — Split-flap airport board effect for .hero-location
 *
 * Cycles through cities every 3s with a character-by-character scramble.
 * Uses requestAnimationFrame only — no GSAP, no libraries.
 *
 * Cities:
 *   Warsaw, PL  → Valencia, SP → Shanghai, CN → (loop)
 *
 * All strings are padded to MAX_LEN (12) with spaces so span count
 * never changes — no DOM add/remove during animation.
 */

(function () {

  const CITIES = [
    { city: 'Warsaw',   code: 'PL' },
    { city: 'Valencia', code: 'SP' },
    { city: 'Shanghai', code: 'CN' }
  ];

  const CHARS            = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,';
  const INTERVAL         = 3000;   // ms between flips
  const SCRAMBLE_DURATION = 600;   // ms each character scrambles
  const STAGGER          = 30;     // ms delay per character (left → right)
  const MAX_LEN          = 12;     // length of longest city string

  let container   = null;
  let currentIndex = 0;

  /* ── Helpers ────────────────────────────────────────────── */

  function getString(entry) {
    return (entry.city + ', ' + entry.code).padEnd(MAX_LEN, ' ');
  }

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  /* ── Build initial static spans (no animation) ──────────── */

  function buildStatic(str) {
    container.innerHTML = '';
    for (let i = 0; i < str.length; i++) {
      const span = document.createElement('span');
      span.className = 'flap';
      span.textContent = str[i];
      container.appendChild(span);
    }
  }

  /* ── Animate a single span to its target character ──────── */

  function scrambleChar(span, targetChar, delay) {
    const startTime = performance.now() + delay;

    function tick(now) {
      if (now < startTime) {
        requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startTime;

      if (elapsed >= SCRAMBLE_DURATION) {
        span.textContent = targetChar;
        return;
      }

      span.textContent = randomChar();
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ── Flip all spans to a new city string ────────────────── */

  function flipTo(str) {
    const spans = container.querySelectorAll('.flap');
    for (let i = 0; i < spans.length; i++) {
      scrambleChar(spans[i], str[i], i * STAGGER);
    }
  }

  /* ── Init ───────────────────────────────────────────────── */

  function init() {
    container = document.querySelector('.hero-location');
    if (!container) return;

    // Render first city immediately — no animation
    buildStatic(getString(CITIES[0]));

    // Cycle every INTERVAL ms
    setInterval(function () {
      currentIndex = (currentIndex + 1) % CITIES.length;
      flipTo(getString(CITIES[currentIndex]));
    }, INTERVAL);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
