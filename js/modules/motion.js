/**
 * Scroll reveals, the hero entrance sequence and the restrained parallax.
 * Everything here is skipped when the visitor prefers reduced motion.
 */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function prefersReducedMotion() {
  return reducedMotion.matches;
}

export function initReveal() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  items.forEach((el) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
}

export function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const start = () => hero.classList.add("is-ready");
  const image = hero.querySelector(".hero__media img");

  if (prefersReducedMotion()) {
    start();
    return;
  }
  if (image && !image.complete) {
    image.addEventListener("load", () => requestAnimationFrame(start), { once: true });
    image.addEventListener("error", start, { once: true });
    window.setTimeout(start, 1400);
  } else {
    requestAnimationFrame(start);
  }
}

export function initParallax() {
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!layers.length || prefersReducedMotion()) return;
  if (!window.matchMedia("(min-width: 768px)").matches) return;

  let ticking = false;

  const update = () => {
    const viewport = window.innerHeight;
    layers.forEach((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewport + 200) return;
      const amount = parseFloat(layer.dataset.parallax) || 0.1;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const shift = Math.max(-1, Math.min(1, progress)) * rect.height * amount * -0.5;
      layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    });
    ticking = false;
  };

  update();
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

/** Give every drawn path in the expertise diagram its true length. */
export function initDiagram() {
  const paths = Array.from(document.querySelectorAll("[data-draw]"));
  paths.forEach((path) => {
    if (typeof path.getTotalLength !== "function") return;
    const length = Math.ceil(path.getTotalLength());
    if (length) path.style.setProperty("--len", String(length));
  });
}
