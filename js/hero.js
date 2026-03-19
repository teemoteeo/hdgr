/* hero.js — Hero animation
 *
 * Mobile:  auto-rotate images every 3s (same cross-fade)
 * Desktop: fullscreen → shrinks to 2/3 right on scroll + mousemove cycle
 *
 * REGOLE:
 *   - scrub: true (MAI numeri)
 *   - normalizeScroll: MAI
 *   - ignoreMobileResize: true
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('[data-hero]');
  if (!heroEl) return;

  const imgWrap = heroEl.querySelector('[data-hero-img-wrap]');
  if (!imgWrap) return;

  const imgs = Array.from(imgWrap.querySelectorAll('.hero-cycle-img'));
  if (!imgs.length) return;

  /* ── Shared image cycle logic ── */
  let currentIndex = 0;
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
    }, 300);
  }

  /* ── Mobile: auto-rotate every 3s ── */
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    // Clear any inline styles to ensure CSS controls layout
    imgWrap.style.cssText = '';
    setInterval(() => {
      goToImage((currentIndex + 1) % imgs.length);
    }, 1800);
    return;
  }

  /* ── Desktop only from here ── */
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header   = document.querySelector('header');
  const heroLeft = heroEl.querySelector('[data-hero-left]');
  const heroTitle  = heroEl.querySelector('[data-hero-title]');
  const exploreBtnEl = heroEl.querySelector('[data-hero-explore]');

  if (prefersReducedMotion) {
    if (imgWrap) {
      const s = measureVar('--space-8');
      imgWrap.style.top    = s + 'px';
      imgWrap.style.right  = '16.666%';
      imgWrap.style.bottom = '0px';
      imgWrap.style.left   = '16.666%';
    }
    if (heroLeft) heroLeft.style.opacity = '1';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  function measureVar(varName) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;width:var(${varName});visibility:hidden;pointer-events:none;`;
    document.body.appendChild(el);
    const val = el.offsetWidth;
    document.body.removeChild(el);
    return val;
  }

  const space8 = measureVar('--space-8');

  /* ── Shrink timeline (paused — driven manually) ── */
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(imgWrap,
    { top: 0, right: 0, bottom: 0, left: '0%' },
    { top: space8, right: '16.666%', bottom: 0, left: '16.666%', ease: 'none', duration: 1 }
  );

  if (heroLeft) {
    tl.to(heroLeft, { opacity: 1, ease: 'none', duration: 0.6 }, 0.4);
  }

  let controlTween = null;
  let fadeTl = null;
  let fadeTween = null;

  ScrollTrigger.create({
    trigger: heroEl,
    start: 'top top',
    end: 'bottom bottom',
    onEnter: () => {
      if (header) header.classList.add('header-dark');
      if (controlTween) { controlTween.kill(); }
      imgWrap.style.willChange = 'top, right, bottom, left';
      controlTween = gsap.to(tl, {
        progress: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          imgWrap.style.willChange = 'auto';
          controlTween = null;
        }
      });
    },
    onUpdate: (self) => {
      if (self.direction === -1) {
        if (controlTween && !controlTween.paused() &&
            tl.progress() > 0 && tl.progress() < 1) {
          const target = controlTween.vars && controlTween.vars.progress;
          if (target === 0) return;
        }
        if (controlTween) { controlTween.kill(); controlTween = null; }
        imgWrap.style.willChange = 'top, right, bottom, left';
        controlTween = gsap.to(tl, {
          progress: 0,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete: () => {
            imgWrap.style.willChange = 'auto';
            controlTween = null;
          }
        });
      } else if (self.direction === 1) {
        if (controlTween && !controlTween.paused()) {
          const target = controlTween.vars && controlTween.vars.progress;
          if (target === 1) return;
        }
        if (controlTween) { controlTween.kill(); controlTween = null; }
        imgWrap.style.willChange = 'top, right, bottom, left';
        controlTween = gsap.to(tl, {
          progress: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            imgWrap.style.willChange = 'auto';
            controlTween = null;
          }
        });
      }
    },
    onLeaveBack: () => {
      if (header) header.classList.remove('header-dark');
      // If already tweening to 0, let it finish — don't snap
      if (controlTween && !controlTween.paused()) {
        const target = controlTween.vars && controlTween.vars.progress;
        if (target === 0) return;
      }
      if (controlTween) { controlTween.kill(); controlTween = null; }
      imgWrap.style.willChange = 'top, right, bottom, left';
      controlTween = gsap.to(tl, {
        progress: 0,
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          imgWrap.style.willChange = 'auto';
          controlTween = null;
        }
      });
    }
  });

  ScrollTrigger.addEventListener('scrollEnd', () => {
    if (controlTween) return;
    const p = tl.progress();
    if (p <= 0 || p >= 1) return;
    const snapTo = p < 0.5 ? 0 : 1;
    controlTween = gsap.to(tl, {
      progress: snapTo,
      duration: 0.4,
      ease: 'power3.inOut',
      onComplete: () => {
        imgWrap.style.willChange = 'auto';
        controlTween = null;
      }
    });
    if (snapTo === 0 && fadeTl) {
      if (fadeTween) { fadeTween.kill(); }
      fadeTween = gsap.to(fadeTl, {
        progress: 0,
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => { fadeTween = null; }
      });
    }
  });

  /* ── Title + explore scroll-away ── */
  const fadeOutEls = [heroTitle, exploreBtnEl].filter(Boolean);
  if (fadeOutEls.length) {
    fadeTl = gsap.timeline({ paused: true });
    fadeTl.to(fadeOutEls, { opacity: 0, y: -40, ease: 'none', duration: 1 });

    ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: '18% top',
      onEnter: () => {
        if (fadeTween) { fadeTween.kill(); }
        fadeTween = gsap.to(fadeTl, {
          progress: 1,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => { fadeTween = null; }
        });
      },
      onUpdate: (self) => {
        if (self.direction === -1) {
          if (fadeTween && !fadeTween.paused()) {
            const target = fadeTween.vars && fadeTween.vars.progress;
            if (target === 0) return;
          }
          if (fadeTween) { fadeTween.kill(); fadeTween = null; }
          fadeTween = gsap.to(fadeTl, {
            progress: 0,
            duration: 0.7,
            ease: 'power3.inOut',
            onComplete: () => { fadeTween = null; }
          });
        }
      },
      onLeaveBack: () => {
        if (fadeTween) { fadeTween.kill(); fadeTween = null; }
        fadeTween = gsap.to(fadeTl, {
          progress: 0,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete: () => { fadeTween = null; }
        });
      }
    });
  }

  /* ── Explore button click ── */
  if (exploreBtnEl) {
    exploreBtnEl.addEventListener('click', () => {
      const start = window.scrollY;
      const target = start + window.innerHeight;
      const duration = 1800;
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

  /* ── Desktop: mousemove image cycle ── */
  let totalDistance = 0;
  let lastX = null, lastY = null;
  const THRESHOLD = 40;

  imgWrap.addEventListener('mousemove', (e) => {
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

  imgWrap.addEventListener('mouseleave', () => {
    lastX = null; lastY = null; totalDistance = 0;
  });
});
