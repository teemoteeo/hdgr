if (window.innerWidth <= 768) { /* logo-type disabled on mobile */ }

if (window.innerWidth > 768) {
  const LOGO_TEXT = 'HDGR — Design & Development';
  const SPEED_TYPE = 20;
  const SPEED_ERASE = 10;

  document.querySelectorAll('header .logo, .menu-header .logo').forEach(logo => {
    const span = logo.querySelector('.logo-type');
    if (!span) return;

    let frame = null;
    let current = '';

    function type() {
      clearTimeout(frame);
      if (current.length < LOGO_TEXT.length) {
        current = LOGO_TEXT.slice(0, current.length + 1);
        span.textContent = current;
        frame = setTimeout(type, SPEED_TYPE);
      }
    }

    function erase() {
      clearTimeout(frame);
      if (current.length > 0) {
        current = current.slice(0, -1);
        span.textContent = current;
        frame = setTimeout(erase, SPEED_ERASE);
      }
    }

    logo.addEventListener('mouseenter', type);
    logo.addEventListener('mouseleave', erase);
  });
}
