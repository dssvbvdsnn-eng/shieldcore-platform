# SHIELDCORE — Company Kit

A branded product-and-business prototype built from the supplied ShieldCore business report, existing presentation, team execution plan and logo.

## What's included

- `ShieldCore_Premium_Company_Presentation.pptx` — editable 18-slide company / product presentation.
- `ShieldCore_Premium_Company_Presentation.pdf` — read-only presentation copy.
- `website/` — responsive product dashboard and company workspace. The navigation labels can switch between Arabic and English; detailed operational screen content remains in English.
- `website/supabase/schema.sql` — PostgreSQL schema, tenant relationships and initial RLS policies.
- `website/supabase/seed.sql` — optional synthetic starter records. Replace the user UUID before running.
- `website/DEMO_WALKTHROUGH.md` — a practical presentation route.

## Open the website locally

1. Unzip the package.
2. Open `website/index.html` in Chrome / Edge. The UI is self-contained and uses synthetic data stored in your browser.
3. Use **API Lab** to evaluate sample requests, **Risk Cases** to assign and resolve a case, and **Customers CRM** to log an interaction.
4. The **EN / AR** control switches the navigation labels, static shell text and page direction; detailed dashboard content remains in English. The reset icon restores the synthetic sample dataset.

For a more consistent local server, run from the `website` folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Recommended free launch stack

**Website:** Cloudflare Pages (static hosting). It gives a `*.pages.dev` project URL and supports drag-and-drop deployment of a ZIP / folder or Git-based deployments. The supplied `ShieldCore_Website_Deploy.zip` is ready for direct upload. Official guide: https://developers.cloudflare.com/pages/get-started/direct-upload/

**Database + Auth:** Supabase Postgres. The current Free tier is suitable for an academic/demo prototype (currently two active free projects and 500 MB database per project). Free projects can pause after a week of low database activity; restore them from the Supabase dashboard if needed. Check current quotas before launch:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/free-project-pausing

**Source control:** GitHub private repository. Keep `config.js` out of public commits if it contains project identifiers; the publishable key is not a secret, but the database must be protected with RLS.

## Connect Supabase

1. Create a Supabase project and open **SQL Editor**.
2. Run `supabase/schema.sql`.
3. In Supabase **Authentication → Users**, create/sign up your team user and copy its UUID.
4. Replace the placeholder UUID in `supabase/seed.sql` with that user's UUID. Run the seed script once.
5. Copy the Project URL and the **publishable key** (or legacy anon key) into `website/config.js`:

```js
window.SHIELDCORE_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "YOUR_PUBLISHABLE_KEY"
};
```

6. Reload the site, open **Settings & Integration**, and sign in with the Supabase Auth user. The app reads from your workspace and writes new demo records to the database.

**Critical:** Never expose a Supabase `service_role` / secret key in browser code. The SQL turns on Row Level Security (RLS) and scopes rows to authenticated workspace members. Before production, also add role-specific write policies (owner/admin/analyst/viewer), audit triggers, data-retention jobs, tested backups, abuse protection and a complete authorization review. Do not put real customer or payment data into this academic prototype.

## Suggested company architecture

- **Cloudflare Pages:** public website and dashboard static assets.
- **Supabase Auth:** team identity and authentication.
- **Supabase PostgreSQL:** workspaces, members, customers, transactions, risk cases, interactions, policies and audit logs.
- **Future API backend (not included as production code):** a separately deployed service should own API keys, gateway enforcement, server-side decisioning, rate limits, secrets and third-party integrations. A static frontend must never be the enforcement boundary.
- **Optional future components:** managed logging/monitoring, secrets manager, background jobs, email service and a formal incident-response workflow.

## What is implemented vs. proposed

**Implemented in this demo:** responsive dashboard interface, synthetic transaction/customer/case records, browser-local persistence, CSV export, deterministic example scoring, case status/owner updates, CRM interactions and optional Supabase reads/writes after configuration.

**Not implemented as production controls:** real API gateway or proxy, production authentication policies for tenant customers, live fraud detection, trained AI/ML, real payment integration, production ZKP circuit, guaranteed SLA / high availability, penetration testing, legal compliance certification or operational incident response.

## Business assumptions carried from the supplied report

- Starter: EGP 2,500 / month (proposed test price).
- Growth: EGP 7,500 / month (proposed test price).
- Illustrative ARPA: EGP 6,000 / month.
- Illustrative target gross margin: 70%.
- Illustrative fixed monthly OPEX: EGP 130,000.
- Illustrative variable cost: 30% of revenue.
- Simplified break-even: around 31 customers at those assumptions.
- Pilot targets such as precision ≥90%, recall ≥85%, false-positive rate ≤2%, P95 latency <50 ms and availability 99.5% are targets to test, not measured results.

## Team execution from the submitted plan

- Abdullah — technical lead, website and live demo.
- Yousef El-Sherbiny — product owner and video editing.
- Shams — site copy, screenshots and user journey.
- Samah — presentation assembly and opening.
- Ibrahim — CRM scenarios and synthetic data.
- Hossam — website explainer video production and security segment.

All six share end-to-end testing, rehearsal and final review.
