/**
 * Site configuration.
 *
 * Everything a site owner normally needs to change lives in this one file.
 * Empty values are never rendered, so the site stays honest until the real
 * details are supplied. See README.md for the full explanation.
 */

/* Values written as __TOKEN__ are placeholders. They can either be replaced by
   hand in this file, or substituted at deploy time from a repository secret
   (see README.md, "Contact form"). Anything left as a placeholder resolves to
   an empty string. */
const resolve = (value) => (/^__[A-Z0-9_]+__$/.test(value) ? "" : value.trim());

export const company = {
  name: "Laxmi Narasimha Engineers",
  shortName: "LNE",
  tagline: "Engineering. Structures. Construction.",
  url: "https://laxminarasimhaengineers.com/"
};

/**
 * Contact details.
 * Fill these in to make them appear in the contact panel and the footer.
 * Leave a value empty and it is left out entirely.
 */
export const companyContact = {
  phone: "",          // for example "+91 90000 00000"
  email: "",          // for example "info@laxminarasimhaengineers.com"
  address: "",        // postal address, use \n for a line break
  mapUrl: "",         // optional link to the office location on a map
  hours: ""           // for example "Monday to Saturday, 9:30 to 18:30"
};

/**
 * Social profiles. Only real, existing profiles should be added here.
 * Anything left empty is not rendered anywhere on the site.
 */
export const social = {
  linkedin: "",
  instagram: "",
  facebook: "",
  youtube: ""
};

/**
 * Contact form delivery.
 *
 * endpoint  the URL that receives the submission. Any provider that accepts a
 *           JSON POST works. Formspree and Web3Forms are detected automatically.
 * accessKey only needed for Web3Forms.
 *
 * A form endpoint is a public identifier rather than a secret, so it can live in
 * this file. If you would rather keep it out of the repository, leave the
 * __FORM_ENDPOINT__ placeholder in place and inject it at deploy time.
 */
export const contactForm = {
  endpoint: resolve("__FORM_ENDPOINT__"),
  accessKey: resolve("__FORM_ACCESS_KEY__"),
  subject: "New project enquiry from laxminarasimhaengineers.com",
  successMessage:
    "Thank you for getting in touch. Your enquiry has been received and we will respond shortly.",
  errorMessage:
    "Please try again in a moment, or contact us directly."
};
