# Univers Servis Poreč

Website for **Univers Servis Poreč** — painting, plastering and year-round
maintenance for hotels, apartments and private homes in Poreč (Parenzo),
Istria, Croatia.

One static page. No build step, no dependencies, no backend.

## What's on the page

- **Hero** with a draggable before/after slider (the slider sweeps once on load,
  then hands control to the visitor).
- **Services** — painting and finishes, surfaces and repair, protection and care.
- **Instant estimate** — 11 services at fixed €/m² rates; the visitor enters the
  area for each one and gets a live subtotal, VAT (25%, toggleable) and total.
  The calculator starts collapsed behind a toggle.
- **Quote request** — the estimate is carried into the contact form. *Send*
  posts the itemised quote to the company inbox (falling back to the visitor's
  own mail client); *Print / save* opens a formatted, printable quote.
- **Four languages** — Croatian, English, German, Italian, switched in place
  with a crossfade. The page loads in English.
- Tap-to-copy phone number, scroll reveals, and a grain/static texture over the
  whole page (both respect `prefers-reduced-motion`).

## Contact details shown on the page

| | |
|---|---|
| Address | Mate Vlašića 26/22, 52440 Poreč (Parenzo) |
| Phone | +385 98 335 031 · +385 91 9360 031 |
| Email | universervisporec@gmail.com |
| Hours | Mon–Fri 08:00–17:00 |

## Structure

```
index.html      the entire site — markup, styles, translations, logic,
                and the logo and photographs as embedded data URIs
vercel.json     cache and security headers
```

Everything lives in `index.html`, images included, so the page has no
same-origin requests to make. The only external resource is the Google Fonts
stylesheet (Bricolage Grotesque + Inter).

## Editing

- **Prices** — `RATES` near the top of the script, in the same order as the
  service list. One array, used by the calculator, the emailed quote and the
  printed quote.
- **Service names and descriptions** — the `svc` array inside each language
  block in `I18N`. Keep all four languages the same length and order as
  `RATES`.
- **Any other text** — find its `data-i18n` key in the markup, then edit that
  key in all four `I18N` blocks.
- **Company details** — the `COMPANY` object (used by the quote), plus the
  contact section and footer in the markup.

## Running it locally

```bash
python3 -m http.server 8145
```

Then open http://localhost:8145.

## Notes

- The quote form posts to FormSubmit, a third-party relay that forwards the
  submission to the company's Gmail address. The first submission from a new
  deployment has to be confirmed by clicking a link FormSubmit emails to that
  address. If the request fails, the page falls back to opening the visitor's
  mail client with the quote pre-filled.
- Estimate totals are indicative; the page says so twice, and every quote it
  produces repeats it. Final prices are confirmed after a site visit.

## Deployment

Deployed on Vercel from this repository's `main` branch — every push to `main`
publishes.
