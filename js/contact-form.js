/* contact-form.js — Toggle inline contact form + buyer journey */
document.addEventListener('DOMContentLoaded', () => {
  function toggleContent(btn, content) {
    if (!content) return;
    const isHidden = content.hidden;
    content.hidden = false;
    if (isHidden) {
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.4s ease';
      requestAnimationFrame(() => {
        content.style.maxHeight = content.scrollHeight + 'px';
      });
      content.addEventListener('transitionend', () => {
        content.style.maxHeight = '';
        content.style.overflow = '';
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, { once: true });
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.overflow = 'hidden';
      requestAnimationFrame(() => { content.style.maxHeight = '0'; });
      content.addEventListener('transitionend', () => {
        content.hidden = true;
        content.style.maxHeight = '';
        content.style.overflow = '';
      }, { once: true });
    }
  }

  document.querySelectorAll('.contact-form-toggle').forEach(btn => {
    btn.addEventListener('click', () => toggleContent(btn, btn.nextElementSibling));
  });

  document.querySelectorAll('.buyer-journey-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.closest('.container').querySelector('.buyer-journey-content');
      toggleContent(btn, content);
    });
  });
});
