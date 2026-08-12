/**
 * Projects section.
 *
 * While js/data/projects.js exports an empty array the markup already in the
 * page (a prepared empty state) is left untouched. As soon as real projects are
 * added, the same section renders them as a card grid.
 */

import { projects } from "../data/projects.js";

const escape = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

function media(project) {
  const image = project.image;
  if (!image || !image.src) return "";
  const source = image.webp
    ? `<source type="image/webp" srcset="${escape(image.webp)}">`
    : "";
  return `
      <div class="frame">
        <picture>${source}
          <img src="${escape(image.src)}" alt="${escape(image.alt || project.name || "")}"
            ${image.width ? `width="${escape(image.width)}"` : ""}
            ${image.height ? `height="${escape(image.height)}"` : ""}
            loading="lazy" decoding="async">
        </picture>
      </div>`;
}

function card(project) {
  const meta = [project.category, project.location, project.year]
    .filter(Boolean)
    .map((value) => `<span>${escape(value)}</span>`)
    .join("");

  const services = Array.isArray(project.services) && project.services.length
    ? `<ul class="project-card__services">${project.services
        .map((service) => `<li>${escape(service)}</li>`)
        .join("")}</ul>`
    : "";

  return `
    <article class="project-card reveal" data-reveal>
      ${media(project)}
      ${meta ? `<div class="project-card__meta">${meta}</div>` : ""}
      <h3>${escape(project.name || "")}</h3>
      ${project.description ? `<p>${escape(project.description)}</p>` : ""}
      ${services}
    </article>`;
}

export function initProjects() {
  const mount = document.getElementById("projects-content");
  if (!mount || !Array.isArray(projects) || projects.length === 0) return;

  mount.innerHTML = `<div class="projects__grid">${projects.map(card).join("")}</div>`;
  mount.classList.add("is-visible");
}
