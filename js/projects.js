/* projects.js - Filter toggle for projects archive
 *
 * Matches data-filter on buttons to data-type on cards.
 * Hidden cards get opacity 0 + translateY(10px), then display:none after transition.
 * Updates the project count badge.
 */

const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const projectCards = document.querySelectorAll('.project-card[data-type]');
const projectCount = document.querySelector('.project-count');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;

        if (match) {
          card.style.display = '';
          // Force reflow before removing hidden class
          void card.offsetHeight;
          card.classList.remove('card-hidden');
          visibleCount++;
        } else {
          card.classList.add('card-hidden');
          card.addEventListener('transitionend', function hide(e) {
            if (e.propertyName === 'opacity' && card.classList.contains('card-hidden')) {
              card.style.display = 'none';
            }
            card.removeEventListener('transitionend', hide);
          });
        }
      });

      // Update count
      if (projectCount) {
        projectCount.textContent = '(' + String(visibleCount).padStart(2, '0') + ')';
      }
    });
  });
}
