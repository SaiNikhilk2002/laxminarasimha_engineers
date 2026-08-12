/**
 * Enquiry form: client side validation, submission and status handling.
 *
 * Submissions are POSTed as JSON to the endpoint configured in js/config.js.
 * Formspree and Web3Forms are recognised automatically; any other endpoint that
 * accepts a JSON POST works as well. Nothing is ever reported as sent unless the
 * endpoint confirms it.
 */

import { contactForm, companyContact } from "../config.js";

const RULES = {
  name: {
    required: true,
    test: (value) => value.trim().length >= 2 && value.trim().length <= 80,
    message: "Please enter your full name."
  },
  phone: {
    required: true,
    test: (value) => {
      const digits = value.replace(/\D/g, "");
      return /^[+\d][\d\s\-()]{6,19}$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
    },
    message: "Please enter a valid phone number."
  },
  email: {
    required: true,
    test: (value) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value.trim()),
    message: "Please enter a valid email address."
  },
  projectType: {
    required: true,
    test: (value) => value.trim().length > 0,
    message: "Please select a project type."
  },
  location: {
    required: false,
    test: (value) => value.trim().length <= 120,
    message: "Please keep the location under 120 characters."
  },
  message: {
    required: true,
    test: (value) => value.trim().length >= 10 && value.trim().length <= 2000,
    message: "Please describe your project in at least 10 characters."
  }
};

const REQUIRED_MESSAGE = {
  name: "Please enter your full name.",
  phone: "Please enter your phone number.",
  email: "Please enter your email address.",
  projectType: "Please select a project type.",
  message: "Please tell us about your project."
};

function fieldError(form, name) {
  const input = form.elements[name];
  if (!input) return null;
  const describedBy = input.getAttribute("aria-describedby");
  return describedBy ? document.getElementById(describedBy) : null;
}

function setError(form, name, message) {
  const input = form.elements[name];
  const target = fieldError(form, name);
  if (!input) return;
  if (message) {
    input.setAttribute("aria-invalid", "true");
    if (target) target.textContent = message;
  } else {
    input.removeAttribute("aria-invalid");
    if (target) target.textContent = "";
  }
}

function validateField(form, name) {
  const rule = RULES[name];
  const input = form.elements[name];
  if (!rule || !input) return true;
  const value = input.value || "";

  if (rule.required && value.trim() === "") {
    setError(form, name, REQUIRED_MESSAGE[name] || "This field is required.");
    return false;
  }
  if (value.trim() !== "" && !rule.test(value)) {
    setError(form, name, rule.message);
    return false;
  }
  setError(form, name, "");
  return true;
}

function showStatus(box, state, title, text) {
  box.className = `form__status is-visible is-${state}`;
  box.innerHTML = `<strong>${title}</strong>${text}`;
}

function buildPayload(form) {
  const data = new FormData(form);
  const payload = {
    name: (data.get("name") || "").toString().trim(),
    phone: (data.get("phone") || "").toString().trim(),
    email: (data.get("email") || "").toString().trim(),
    projectType: (data.get("projectType") || "").toString().trim(),
    location: (data.get("location") || "").toString().trim(),
    message: (data.get("message") || "").toString().trim(),
    subject: contactForm.subject,
    source: window.location.href
  };
  return payload;
}

async function send(payload) {
  const endpoint = contactForm.endpoint;
  const isWeb3Forms = /web3forms\.com/i.test(endpoint) || Boolean(contactForm.accessKey);

  const body = isWeb3Forms
    ? { access_key: contactForm.accessKey, ...payload, from_name: payload.name }
    : payload;

  // Never leave the button spinning if the provider does not answer.
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 20000);

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  // Providers that answer with JSON report their own success flag.
  try {
    const result = await response.clone().json();
    if (result && result.success === false) {
      throw new Error(result.message || "The form provider rejected the submission.");
    }
  } catch (error) {
    if (error instanceof SyntaxError) return; // plain 200 with no JSON body
    throw error;
  }
}

export function initForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const button = document.getElementById("form-submit");
  const label = button ? button.querySelector(".btn__label") : null;
  let submitted = false;

  Object.keys(RULES).forEach((name) => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener("blur", () => {
      if (submitted || input.value.trim() !== "") validateField(form, name);
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(form, name);
    });
    if (input.tagName === "SELECT") {
      input.addEventListener("change", () => validateField(form, name));
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitted = true;

    const invalid = Object.keys(RULES).filter((name) => !validateField(form, name));
    if (invalid.length) {
      showStatus(status, "error", "Please check the form.",
        "Some details are missing or need correcting before the enquiry can be sent.");
      const first = form.elements[invalid[0]];
      if (first) first.focus();
      return;
    }

    // Spam trap: quietly accept and discard.
    const trap = form.elements._company;
    if (trap && trap.value.trim() !== "") {
      form.reset();
      showStatus(status, "success", "Thank you.", contactForm.successMessage);
      return;
    }

    if (!contactForm.endpoint) {
      const direct = [companyContact.phone, companyContact.email].filter(Boolean).join(" or ");
      showStatus(status, "error", "The enquiry form is not connected yet.",
        direct
          ? `Please contact us directly on ${direct} and we will respond to your enquiry.`
          : "Please try again later, or reach us through the contact details published on this page.");
      // eslint-disable-next-line no-console
      console.warn("[LNE] contactForm.endpoint is empty in js/config.js. See README.md, section \"Contact form\".");
      return;
    }

    button.classList.add("is-loading");
    button.disabled = true;
    if (label) label.textContent = "Sending";
    showStatus(status, "pending", "Sending your enquiry.", "This will only take a moment.");

    try {
      await send(buildPayload(form));
      form.reset();
      Object.keys(RULES).forEach((name) => setError(form, name, ""));
      submitted = false;
      showStatus(status, "success", "Enquiry received.", contactForm.successMessage);
    } catch (error) {
      const direct = [companyContact.phone, companyContact.email].filter(Boolean).join(" or ");
      showStatus(status, "error", "Your enquiry could not be sent.",
        direct
          ? `${contactForm.errorMessage} You can also reach us on ${direct}.`
          : contactForm.errorMessage);
      // eslint-disable-next-line no-console
      console.error("[LNE] Enquiry submission failed:", error);
    } finally {
      button.classList.remove("is-loading");
      button.disabled = false;
      if (label) label.textContent = "Request a Consultation";
    }
  });
}
