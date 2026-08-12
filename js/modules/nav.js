/**
 * Header behaviour: scrolled state, hide on scroll down, mobile panel,
 * and the active section indicator.
 */

const SCROLLED_AT = 24;
const HIDE_AFTER = 640;

export function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > SCROLLED_AT);

    const menuOpen = document.body.classList.contains("is-locked");
    const goingDown = y > last && y - last > 4;
    const goingUp = y < last - 4;

    if (!menuOpen && goingDown && y > HIDE_AFTER) {
      header.classList.add("is-hidden");
    } else if (goingUp || y <= HIDE_AFTER) {
      header.classList.remove("is-hidden");
    }

    last = y;
    ticking = false;
  };

  update();
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

export function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("mobile-nav");
  const header = document.getElementById("site-header");
  if (!toggle || !panel) return;

  panel.hidden = false;
  const links = Array.from(panel.querySelectorAll("a"));

  const setState = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("is-locked", open);
    if (open && header) header.classList.remove("is-hidden");
    // Stagger the links on the way in.
    links.forEach((link, i) => {
      link.style.transitionDelay = open ? `${80 + i * 55}ms` : "0ms";
    });
  };

  const close = ({ focusToggle = false } = {}) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setState(false);
    if (focusToggle) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setState(!open);
    if (!open) {
      const first = links[0];
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 240);
    }
  });

  links.forEach((link) => link.addEventListener("click", () => close()));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close({ focusToggle: true });
    if (event.key !== "Tab" || !panel.classList.contains("is-open")) return;
    // Keep focus inside the open panel.
    const focusables = [toggle, ...links];
    const index = focusables.indexOf(document.activeElement);
    if (index === -1) return;
    const next = event.shiftKey ? index - 1 : index + 1;
    if (next < 0 || next >= focusables.length) {
      event.preventDefault();
      focusables[next < 0 ? focusables.length - 1 : 0].focus();
    }
  });

  const mq = window.matchMedia("(min-width: 1081px)");
  mq.addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

export function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav__link[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const visible = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });
    let best = "";
    let bestRatio = 0;
    visible.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = id;
      }
    });
    if (best) setActive(best);
  }, { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] });

  sections.forEach((section) => observer.observe(section));
}
