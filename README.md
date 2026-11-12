# ShieldCore — Official Website

<p align="center"><img src="assets/shieldcore-mark.png" width="120" alt="ShieldCore mark"></p>

<p align="center"><strong>Security starts at the core of every transaction.</strong></p>

<p align="center">English-language, responsive company website for the ShieldCore privacy-first B2B API security concept.</p>

---

## About

ShieldCore is a proposed security layer for digital platforms. The concept combines behavioral risk analysis, an API gateway, and Zero-Knowledge Proof techniques to help assess suspicious transactions while minimizing exposure of personal information.

This repository contains the public-facing static website.

## Website features

- Fully English interface with left-to-right layout.
- Responsive design with the ShieldCore black, red, and white visual identity.
- Animated hero section, shield visualization, scroll reveals, KPI count-ups, and interactive navigation.
- Sections covering the challenge, proposed platform, transaction workflow, project KPIs, target industries, business model, resilience, SWOT, pricing approach, and FAQs.
- Interactive transaction-risk demonstration using synthetic examples.
- Reduced-motion support and semantic navigation.

## Project structure

```text
.
├── index.html
├── loader.js
├── styles.css.gz
├── script.js
├── assets/
│   ├── favicon.png
│   └── shieldcore-mark.png
├── .github/workflows/pages.yml
├── .gitignore
├── _headers
└── robots.txt
```

The stylesheet is GZIP-compressed to keep the repository lightweight. `loader.js` loads and decompresses it in the browser using the standard `DecompressionStream` API, then applies the English left-to-right typography and spacing adjustments. Interactive behavior is maintained in the readable `script.js` file.

## Run locally

From the repository root, run:

```bash
python -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080). Use HTTP/HTTPS rather than opening `index.html` directly because the stylesheet loader fetches the compressed CSS file.

## Deploy with GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.
4. After the workflow succeeds, GitHub Pages displays the public website URL in **Settings → Pages**.

## Deploy with Cloudflare Pages

Connect this repository to a Cloudflare Pages project and set the build output directory to `/` (repository root). No build command is required.

## Important scope and accuracy notes

- This is a static front-end concept website. It is not connected to a production fraud-detection engine, payment processor, API gateway, or live threat-intelligence service.
- The transaction demonstration is illustrative and uses synthetic data only.
- Figures such as 99.4%, under 12 ms, 42%, and 85% are project targets stated in the supplied report; they are not independently validated production results.
- Do not enter real customer, card, identity, or payment data into the demonstration.
- References to cloud providers and payment gateways describe potential integrations, not confirmed commercial partnerships.

## Editing

- Edit content in `index.html`.
- Edit interactive behavior in `script.js`.
- The stylesheet is stored in `styles.css.gz`. Decompress with `gzip -dk styles.css.gz`, edit `styles.css`, then recompress with `gzip -9 -c styles.css > styles.css.gz`.

---

**ShieldCore** · Project website · 2026
