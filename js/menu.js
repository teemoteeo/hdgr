/* menu.js - Fullscreen overlay menu toggle
 *
 * iOS fix: position:fixed on body + save/restore scrollY
 * to prevent background scroll when menu is open.
 */

const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const menuOverlay = document.querySelector('.menu-overlay');

let savedScrollY = 0;

function openMenu() {
  if (!menuOverlay) return;
  savedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  menuOverlay.classList.add('active');
}

function closeMenu() {
  if (!menuOverlay) return;
  menuOverlay.classList.remove('active');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, savedScrollY);
}

if (menuToggle) menuToggle.addEventListener('click', openMenu);
if (menuClose) menuClose.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
    closeMenu();
  }
});

if (menuOverlay) {
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
      closeMenu();
    }
  });
}

/* Anchor links inside menu: close first, then scroll to target */
if (menuOverlay) {
  menuOverlay.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      setTimeout(() => target.scrollIntoView(), 50);
    });
  });
}
