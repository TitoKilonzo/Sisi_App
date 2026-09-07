# Sisi — Kilimani Ward pilot

A four-page, hand-coded HTML/CSS site built from the *Sisi Lab Workbook*
(Labs 0-8 and the capstone). It is the citizen participation site described
in the workbook, filled in with a real county and ward — Nairobi City
County, Kilimani Ward (Dagoretti North) — instead of placeholder content.

No build tools, no framework, no JavaScript. Every file is plain HTML,
one shared stylesheet, and hand-drawn SVG.

## File structure

```
sisi-site/
├── index.html            Home — what Sisi does, the current participation window
├── participate.html      Upcoming forums, projects open for voting, ward allocation
├── register.html         Registration form (county, ward, contact, topics)
├── privacy.html          Privacy notice — what is collected and why
├── favicon.ico           Root favicon (browsers request this automatically)
├── styles/
│   └── main.css          Shared stylesheet — white background, navy/blue accents
└── images/
    ├── mark.svg           Brand mark used in the header and as the SVG favicon
    ├── kilimani-baraza.svg  Illustration used in the figure on the home page
    ├── favicon-16.png
    ├── favicon-32.png
    └── apple-touch-icon.png
```

All four HTML pages share the same `<header>`/`<nav>`/`<footer>`, so they
are fully interlinked: the nav bar and footer are identical on every page,
each page's current position is marked with `aria-current="page"`, and
`index.html` links directly into `participate.html#forums` and
`register.html`.

## Running it locally

Do not open `index.html` with `file:///…` — root-relative links and the
favicon behave correctly only over real HTTP. From inside the `sisi-site/`
folder, run:

```
python3 -m http.server 8000
```

or, with Node installed:

```
npx serve .
```

Then visit `http://localhost:8000`.

## Validating

Paste each `.html` file into the W3C validator and fix anything it flags:
https://validator.w3.org/#validate_by_input

## Publishing to GitHub Pages

1. Create a repository named `sisi-site` and push this folder to it
   (keep the folder structure exactly as it is — the CSS and images use
   relative paths).
2. In the repository, go to **Settings → Pages** and set the source to
   deploy from the `main` branch.
3. GitHub will serve the site over HTTPS a few minutes later.

## Notes and assumptions

- **Ward and county**: Kilimani Ward, Dagoretti North, Nairobi City County
  was chosen as the running example in place of the workbook's Kiambu
  example. Swap the county, ward, venues and dates in the four HTML files
  to match your own.
- **Budget figures and vote counts** are illustrative, as the capstone
  brief requires, and are labelled as such in each table caption.
- **The registration form** posts to `https://httpbin.org/post`, a public
  echo endpoint, exactly as the workbook specifies for the exercise. Do not
  submit real names, emails or phone numbers — point `action` at a real
  backend before this goes anywhere near production.
- **Favicon**: `favicon.ico` sits at the root because most browsers request
  `/favicon.ico` directly regardless of `<link>` tags. `images/mark.svg`,
  `favicon-16.png` and `favicon-32.png` are also linked from `<head>` for
  browsers that prefer those, and `apple-touch-icon.png` covers iOS
  home-screen icons.
