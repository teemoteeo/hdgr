let images = [];
let currentIndex = 0;

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">✕</button>
  <button class="lightbox-prev" aria-label="Previous">←</button>
  <img class="lightbox-img" src="" alt="">
  <button class="lightbox-next" aria-label="Next">→</button>
`;
document.body.appendChild(lightbox);

function openLightbox(index) {
  currentIndex = index;
  lightbox.querySelector('.lightbox-img').src = images[currentIndex].src;
  lightbox.querySelector('.lightbox-img').alt = images[currentIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function prev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightbox.querySelector('.lightbox-img').src = images[currentIndex].src;
}

function next() {
  currentIndex = (currentIndex + 1) % images.length;
  lightbox.querySelector('.lightbox-img').src = images[currentIndex].src;
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

document.querySelectorAll('.project-card-img img').forEach((img, i) => {
  images.push(img);
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => openLightbox(i));
});
