/* hero-animation.js — Clip-path card shrink effect driven by GSAP ScrollTrigger */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const heroImg = document.querySelector(".hero img");
  const heroContent = document.querySelector(".hero-content");

  const clip = { inset: 0 };

  gsap.to(clip, {
    inset: 7,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "55% bottom",
      scrub: 1.5,
    },
    onUpdate: () => {
      const v = clip.inset;
      const left = v * 3;     /* 30% at max — reveals services on left */
      const right = v * 0.5;  /* 5% at max — subtle right inset */
      const r = v > 0 ? 8 : 0;
      heroImg.style.clipPath = `inset(${v}% ${right}% ${v}% ${left}% round ${r}px)`;
    },
  });

  gsap.to(heroContent, {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "8% top",
      scrub: 0.3,
      onUpdate: (self) => {
        heroContent.style.visibility = self.progress > 0.85 ? 'hidden' : 'visible';
      },
      onLeave: () => { heroContent.style.visibility = 'hidden'; },
      onEnterBack: () => { heroContent.style.visibility = 'visible'; },
    },
  });

  ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const header = document.querySelector("header");
    // Appena inizia lo shrink il bg grigio è visibile
    if (self.progress > 0.05) {
      header.classList.add("header-dark");
    } else {
      header.classList.remove("header-dark");
    }
  }
});
});
