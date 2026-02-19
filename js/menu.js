const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const menuOverlay = document.querySelector('.menu-overlay');

function openMenu() {
  menuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
    closeMenu();
  }
});

menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    closeMenu();
  }
});
