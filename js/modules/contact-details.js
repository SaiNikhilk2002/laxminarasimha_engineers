/**
 * Renders the contact details in the contact panel and the footer from
 * js/config.js. Anything left blank in the config is simply not rendered,
 * so no placeholder ever reaches a visitor.
 */

import { companyContact, social } from "../config.js";

const escape = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function detail(icon, label, value, href) {
  const body = href
    ? `<a href="${escape(href)}">${value}</a>`
    : `<span class="v">${value}</span>`;
  return `
    <div class="contact__detail">
      <svg width="20" height="20" aria-hidden="true"><use href="#icon-${icon}"></use></svg>
      <div>
        <span class="k">${escape(label)}</span>
        ${body}
      </div>
    </div>`;
}

export function initContactDetails() {
  const panel = document.getElementById("contact-details");
  const footer = document.getElementById("footer-contact");

  const blocks = [];
  const footerItems = [];

  if (companyContact.phone) {
    blocks.push(detail("phone", "Phone", escape(companyContact.phone), telHref(companyContact.phone)));
    footerItems.push(`<li><a href="${escape(telHref(companyContact.phone))}">${escape(companyContact.phone)}</a></li>`);
  }

  if (companyContact.email) {
    blocks.push(detail("mail", "Email", escape(companyContact.email), `mailto:${companyContact.email}`));
    footerItems.push(`<li><a href="mailto:${escape(companyContact.email)}">${escape(companyContact.email)}</a></li>`);
  }

  if (companyContact.address) {
    const address = escape(companyContact.address).replace(/\n/g, "<br>");
    blocks.push(detail("pin", "Office", address, companyContact.mapUrl || ""));
    footerItems.push(`<li><span>${address}</span></li>`);
  }

  if (companyContact.hours) {
    blocks.push(detail("check", "Working hours", escape(companyContact.hours), ""));
  }

  const SOCIAL_LABELS = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube"
  };

  const socialLinks = Object.entries(social)
    .filter(([, url]) => Boolean(url))
    .map(([name, url]) => {
      const label = SOCIAL_LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1);
      return `<li><a href="${escape(url)}" rel="noopener" target="_blank">${escape(label)}</a></li>`;
    });

  if (panel && blocks.length) panel.innerHTML = blocks.join("");
  if (footer && (footerItems.length || socialLinks.length)) {
    footer.innerHTML = footerItems.join("") + socialLinks.join("") + footer.innerHTML;
  }
}
