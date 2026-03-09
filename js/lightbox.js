let images = [];
let currentIndex = 0;

const GALLERY_SELECTORS = '.project-card-img img, .project-gallery img, .project-info-img img';

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">✕</button>
  <button class="lightbox-prev" aria-label="Previous">←</button>
  <img class="lightbox-img" src="" alt="">
  <button class="lightbox-next" aria-label="Next">→</button>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-img');

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function prev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

function next() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prev(); });
lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); next(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

// Event delegation — works regardless of when images are added to the DOM
document.addEventListener('click', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG') return;
  if (!img.closest('.project-card-img, .project-gallery, .project-info-img')) return;

  images = Array.from(document.querySelectorAll(GALLERY_SELECTORS));
  const index = images.indexOf(img);
  if (index === -1) return;

  openLightbox(index);
});
