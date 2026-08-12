/**
 * Laxmi Narasimha Engineers, site entry point.
 */

import { initHeader, initMobileNav, initScrollSpy } from "./modules/nav.js";
import { initReveal, initHero, initParallax, initDiagram } from "./modules/motion.js";
import { initProjects } from "./modules/projects.js";
import { initContactDetails } from "./modules/contact-details.js";
import { initForm } from "./modules/form.js";

function start() {
  initHeader();
  initMobileNav();
  initScrollSpy();
  initDiagram();
  initHero();
  initProjects();
  initContactDetails();
  initForm();
  initReveal();
  initParallax();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
