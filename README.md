# ShieldCore — Official Website

<p align="center">
  <img src="assets/shieldcore-mark.png" width="120" alt="ShieldCore mark">
</p>

<p align="center"><strong>Security infrastructure for digital transactions.</strong></p>

<p align="center">
  Arabic-first, responsive company website for the ShieldCore academic B2B API security concept.
</p>

---

## About

ShieldCore is a proposed privacy-first security layer for digital platforms. The concept combines behavioral risk analysis, an API gateway, and Zero-Knowledge Proof techniques to help assess suspicious transactions while minimizing exposure of personal information.

This repository contains the public-facing static website only.

## Website features

- Responsive Arabic RTL layout with the ShieldCore black, red, and white identity.
- Animated hero, visual security motif, scroll reveals, and navigation interactions.
- Sections explaining the challenge, platform concept, workflow, target sectors, business model, and operational resilience.
- Interactive transaction-risk demonstration using synthetic examples.
- Accessible navigation controls and reduced-motion-aware animation behavior.

## Project structure

```text
.
├── index.html
├── loader.js
├── styles.css.gz
├── script.js.gz
├── assets/
│   ├── favicon.png
│   └── shieldcore-mark.png
├── .github/
│   └── workflows/
│       └── pages.yml
├── .gitignore
└── README.md
```

The CSS and JavaScript bundles are GZIP-compressed. `loader.js` loads and decompresses them in the browser using the standard `DecompressionStream` API. Keep the three files together when deploying.

## Run locally

Use a local HTTP server (rather than opening the HTML file directly):

```bash
python -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Deploy with GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/pages.yml`.

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to the `main` branch, or run the workflow manually from the **Actions** tab.
4. After the workflow succeeds, GitHub Pages will show the public website URL in **Settings → Pages**.

The first deployment requires the Pages source setting above.

## Deploy with Cloudflare Pages

Create a Pages project connected to this repository and set the build output directory to `/` (repository root). No build command is required.

## Important scope and accuracy notes

- This is a static front-end concept website. It is not connected to a production fraud-detection engine, payment processor, API gateway, or live threat intelligence service.
- The transaction demonstration is illustrative and uses synthetic data only.
- Figures such as 99.4%, under 12 ms, 42%, and 85% are project targets stated in the supplied report; they are not independently validated production results.
- No real customer, card, identity, or payment data should be entered into the demonstration.
- References to cloud providers and payment gateways describe potential integrations, not confirmed commercial partnerships.

## Editing

- Edit page content in `index.html`.
- To inspect or change the bundled CSS and JavaScript, decompress the files locally:

  ```bash
  gzip -dk styles.css.gz script.js.gz
  ```

- Recompress edited files with `gzip -9 -c styles.css > styles.css.gz` and `gzip -9 -c script.js > script.js.gz`.

---

**ShieldCore** · Project website · 2026
