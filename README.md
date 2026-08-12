# Laxmi Narasimha Engineers

Website for Laxmi Narasimha Engineers: structural engineering, design and project documentation for
residential, commercial and industrial developments.

Live at <https://laxminarasimhaengineers.com> (GitHub Pages, custom domain set through `CNAME`).

## Stack

A static site: hand written HTML, CSS and ES modules. No build step, no framework, no runtime
dependencies. Everything in the repository is exactly what gets served, which keeps the existing
GitHub Pages deployment working with no extra configuration.

```
index.html               the complete one page site
404.html                 not found page
about|services|projects|contact.html
                         redirect stubs kept so old links still resolve to the right section
css/
  fonts.css              self hosted @font-face declarations
  tokens.css             design tokens: colour, type scale, spacing, motion
  base.css               reset, typography, buttons, forms, reveal animations
  sections.css           section by section styles
js/
  main.js                entry point, wires the modules together
  config.js              company contact details and contact form settings
  data/projects.js       project showcase data (currently empty by design)
  modules/
    nav.js               header state, mobile menu, active section indicator
    motion.js            scroll reveals, hero sequence, parallax, diagram drawing
    projects.js          renders the projects section from the data file
    contact-details.js   renders contact details from the config
    form.js              enquiry form validation and submission
assets/
  img/                   optimised photography (WebP with JPEG fallbacks)
  logo/                  logo lockups, knockout variants and favicons
  fonts/                 woff2 files, latin subset
Images/, img/, videos/   original source material supplied with the project, not used by the site
```

## Running it locally

Any static file server works. For example:

```bash
python -m http.server 8000
# then open http://127.0.0.1:8000/
```

Opening `index.html` directly from the file system will not work, because the page uses ES modules
which browsers block on `file://` URLs.

## Things to fill in before, or soon after, launch

### 1. Contact details

Open `js/config.js` and complete `companyContact`:

```js
export const companyContact = {
  phone: "+91 ...",
  email: "info@laxminarasimhaengineers.com",
  address: "Street, Area,\nCity, State, PIN",
  mapUrl: "https://maps.google.com/...",
  hours: "Monday to Saturday, 9:30 to 18:30"
};
```

Any value left as an empty string is not rendered anywhere. That is deliberate: the site never shows
a placeholder such as "your phone here" to a visitor. Fill a value in and it appears automatically in
the contact panel and the footer.

Social links work the same way. Only add profiles that actually exist:

```js
export const social = { linkedin: "", instagram: "", facebook: "", youtube: "" };
```

### 2. Contact form

The form validates in the browser and then POSTs the enquiry as JSON. Until an endpoint is
configured it tells the visitor plainly that the form is not connected yet. It never pretends a
message was sent.

Pick a form provider and paste its endpoint into `js/config.js`:

```js
export const contactForm = {
  endpoint: resolve("https://formspree.io/f/xxxxxxxx"),
  accessKey: resolve("__FORM_ACCESS_KEY__"),
  ...
};
```

Providers that are recognised out of the box:

| Provider | What to set | Where enquiries arrive |
| --- | --- | --- |
| [Formspree](https://formspree.io) | `endpoint` = the form URL from the dashboard | Email inbox and the Formspree dashboard |
| [Web3Forms](https://web3forms.com) | `endpoint` = `https://api.web3forms.com/submit`, `accessKey` = your access key | Email inbox |
| Your own API | `endpoint` = any URL that accepts a JSON POST | Wherever your API stores it |

The JSON body sent to the endpoint is:

```json
{
  "name": "...", "phone": "...", "email": "...", "projectType": "...",
  "location": "...", "message": "...", "subject": "...", "source": "https://..."
}
```

A submission is only reported as successful when the endpoint answers with a 2xx response (and, for
providers that return JSON, without `success: false`). Network failures and provider errors show an
error state and keep what the visitor typed.

The form also carries a hidden honeypot field. Submissions that fill it in are silently discarded.

#### Keeping the endpoint out of the repository

A form endpoint is a public identifier rather than a secret: it is visible in the browser to anyone
who inspects the page, whichever way it gets there. If you would still rather not commit it, leave
the `__FORM_ENDPOINT__` placeholder in `js/config.js` and substitute it at deploy time from a
repository secret. `.github/workflows/deploy.yml.example` contains a ready made workflow that does
this. To use it:

1. Rename the file to `.github/workflows/deploy.yml`.
2. Add `FORM_ENDPOINT` (and `FORM_ACCESS_KEY` if your provider needs one) under
   **Settings, Secrets and variables, Actions**.
3. Switch **Settings, Pages, Source** from "Deploy from a branch" to "GitHub Actions".

Leave the example file untouched if you prefer the current branch based deployment. Placeholders
that are never substituted resolve to an empty string, which is the same as leaving the field blank.

### 3. Projects

`js/data/projects.js` exports an empty array, and the Projects section shows a prepared empty state
because there are no confirmed project details yet. Add objects to the array and the section
switches to a card grid on its own, with no other change needed:

```js
export const projects = [
  {
    name: "...",
    category: "Industrial",
    location: "...",
    year: "2025",
    description: "...",
    services: ["Structural Design", "Engineering Drawings"],
    image: {
      src: "assets/img/projects/example.jpg",
      webp: "assets/img/projects/example.webp",
      alt: "...",
      width: 1400,
      height: 1050
    }
  }
];
```

Put project photographs in `assets/img/projects/` and record their source in `IMAGE_SOURCES.md` if
they are not the company's own.

## Editing the content

All copy lives in `index.html` as plain semantic HTML, which keeps it fully indexable and readable
without JavaScript. Search for the section comment (for example `Services`) and edit the text in
place. The parts that are genuinely data driven, projects and contact details, live in the two
config files described above.

Content rule that the current copy follows: no invented facts. There are no claims about years of
experience, project counts, client numbers, certifications, awards or testimonials anywhere on the
site, because none were supplied. Add them only when they are confirmed.

## Design system

Tokens in `css/tokens.css`:

- Deep architectural navy (`--navy-900` to `--navy-600`) for dark sections and text
- Steel blue (`--steel-700` to `--steel-300`) for supporting elements and links
- Muted bronze (`--bronze`) used sparingly for accents, rules and indices
- Warm off white, concrete grey and white for light sections
- Archivo for display, Inter for body copy, IBM Plex Mono for technical labels

Motion is deliberately restrained: mask reveals, slow image reveals, a small parallax shift on two
background images and short hover transitions. Everything is disabled automatically for visitors who
set `prefers-reduced-motion: reduce`.

## Accessibility

- Semantic landmarks, one `h1`, ordered heading levels
- Skip link, visible focus states, full keyboard support including the mobile menu
- Labelled form fields with `aria-describedby` error messages announced politely
- Decorative images marked `alt=""`, meaningful images described
- Reduced motion respected

## Performance notes

- Responsive WebP with JPEG fallbacks, sized per breakpoint through `srcset` and `sizes`
- The hero image is preloaded; everything below the fold is lazy loaded
- Fonts are self hosted, subset to latin, preloaded and set to `font-display: swap`
- No third party scripts, no analytics, no cookie banner, no external requests at runtime

## Original assets

`Images/`, `img/` and `videos/` hold the original material that came with the project, including
`videos/hero_wharehouse_vijayanagaram.mp4`. The site does not reference them: the logo files it uses
were derived into `assets/logo/` (a colour lockup for light backgrounds and a white knockout lockup
for dark ones, both preserving the supplied artwork exactly). The folders are kept so the source
files are not lost.
