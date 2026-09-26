# Univers Servis Poreč

Website for **Univers Servis Poreč** — painting, plastering and year-round
maintenance for hotels, apartments and private homes in Poreč (Parenzo),
Istria, Croatia.

One static page. No build step, no dependencies, no backend.

## What's on the page

- **Hero** with a draggable before/after slider (the slider sweeps once on load,
  then hands control to the visitor).
- **Services** — painting and finishes, surfaces and repair, protection and care.
- **Branches** — two cards, interior and exterior, each with a photo frame, an
  icon, a paragraph of context and the trades that belong to it as chips.
- **Instant estimate** — 11 services at fixed €/m² rates; the visitor enters the
  area for each one and gets a live subtotal, VAT (25%, toggleable) and total.
  The calculator starts collapsed behind a toggle.
- **Quote request** — the estimate is carried into the contact form. *Send*
  posts the itemised quote to the company inbox (falling back to the visitor's
  own mail client); *Print / save* opens a formatted, printable quote.
- **Photo attachments** — up to 8 photos of the walls, picked or dragged in
  (a phone offers the camera), shown as removable thumbnails with a running
  size total, and sent with the quote.
- **Careers** — a nav tab and a section listing the four roles, with an
  application form that takes an optional CV and lands in the same inbox as
  the quotes.
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
assets/         the two branch photographs (see assets/README.md)
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
- **Job roles** — the `job_roles` array in each language block, each entry
  `{n, d}`. It fills both the list and the position dropdown, so adding a role
  to all four languages is all it takes. Same rule as the chips: keep the
  arrays the same length across languages.
- **Branch chips** — the `br1_tags` and `br2_tags` arrays in each language
  block. They are rendered by `buildTags()`, which relabels existing `<li>`
  nodes rather than rebuilding them, so the language crossfade has something
  stable to fade. Keep the arrays the same length in all four languages or the
  list is rebuilt and the crossfade skips.
- **Branch photographs** — `assets/interior.jpg` and `assets/exterior.jpg`;
  see `assets/README.md` for the crop and encoding recipe.
- **Any other text** — find its `data-i18n` key in the markup, then edit that
  key in all four `I18N` blocks.
- **Company details** — the `COMPANY` object (used by the quote), plus the
  contact section and footer in the markup.
- **Hover and press** — all of it lives in one `INTERACTION` block in the
  stylesheet. Hover changes colour and depth only, never position, and sits
  inside `@media (hover:hover) and (pointer:fine)` so a tap on a phone cannot
  leave a control stuck in its hover state. Movement belongs to `:active`
  (`scale(.98)`). Keep new controls in that block rather than adding `:hover`
  rules beside the component.

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
- Because that relay sends from its own domain rather than the company's, the
  notifications tend to land in Gmail's spam folder. A filter on
  `from: formsubmit.co` set to *never send to spam* fixes it; sending from an
  owned domain with SPF/DKIM/DMARC is the real cure.
- **Photos.** FormSubmit caps a submission at 10 MB across all files, and a
  phone photo is 3–8 MB, so each one is drawn to a canvas, capped at 1600px
  on its long edge and re-encoded as JPEG at quality 0.82 before it is
  queued — roughly 250–400 KB each. Anything the canvas cannot decode (HEIC,
  usually) is passed through untouched at its original size. The form refuses
  to send over 8 MB total and says so.
- **Attachments never go over AJAX.** FormSubmit's AJAX endpoint accepts a
  multipart body, answers `200`, and silently discards the files — the email
  arrives with every text field intact and nothing attached. So a submission
  carrying photos is posted as a real `multipart/form-data` form to the plain
  endpoint, with the first file field named `attachment` per FormSubmit's
  convention and the rest `attachment2`…`attachment8`. That navigates away, so
  `_next` returns the visitor to `?sent=1`, where the page confirms the send
  and strips the marker from the URL. Submissions without photos still go as
  JSON over AJAX, which works fine for text.
- **Both forms share one path.** `fsPostForm(fields, files)` posts the
  multipart form; the quote passes its photos, the job application passes the
  CV. They come back on separate markers — `?sent=1` for a quote, `?applied=1`
  for an application — so each confirms in its own form and scrolls there.
- Estimate totals are indicative; the page says so twice, and every quote it
  produces repeats it. Final prices are confirmed after a site visit.

## Deployment

Deployed on Vercel from this repository's `main` branch — every push to `main`
publishes.
