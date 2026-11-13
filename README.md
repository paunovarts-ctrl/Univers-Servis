# Univers Servis Poreč

Website for **Univers Servis Poreč** (UNIVERS SERVIS POREČ d.o.o.): painting,
plastering and facade work for flats, houses, holiday apartments and hotels in
Poreč (Parenzo), Istria, Croatia.

One static page. The deployed file is the built `index.html`; Vercel serves it
as is, with no build step and no backend.

## What's on the page

- **Hero**: one full-screen stage. The damaged room fills the screen and, as
  you scroll, a lime roller line rolls the finished room in over it. A short
  opening pass paints the first strip by itself so the idea reads before
  anyone scrolls. The headline, buttons and phone number sit over the photo.
- **Promises**: three lines under the stage (free visit and written quote,
  all year round, no need to be there).
- **01 Services**: interior and exterior, each with a photograph that runs to
  the edge of the page, a paragraph and the trades that belong to it; then
  the stats strip (1990, 500+, 11).
- **Colour room** (`#colours`): the finished room with eight paint chips.
  Tap one and the walls repaint, left to right. Only the walls change: the
  windows, trim, skirting and floor stay as photographed. It says plainly
  that screen colours are approximate and the real shade is chosen on site.
- **02 Works schedule**: the 11 services with where each applies (inside,
  outside, both) and no prices: the quote follows a site visit.
- **03 Process**: four steps, then a dark band on working while the owner is
  away, with a sample work log (labelled as an example).
- **04 Area**: the towns served and a facade-season calendar.
- **05 FAQ**, **06 Contact** (quote form with photo attachments) and
  **07 Careers** (application form with an optional CV).
- **Four languages**: Croatian (default, at `/`), English, German, Italian
  (`?lang=en|de|it`), switched in place with a crossfade.
- Motion is all transform and opacity, and `prefers-reduced-motion` gets a
  still before/after split, no parallax and fades instead of travel.

## Contact details shown on the page

| | |
|---|---|
| Address | Tarska ul. 26-22, 52440 Poreč (Parenzo) |
| Phone | +385 98 335 031 · +385 91 9360 031 |
| Email | uservis@net.hr |
| Hours | Mon–Fri 08:00–17:00 |

## Structure

```
index.html      the built page (generated: do not edit by hand)
src/            the sources it is built from
  head.html       <head>: meta, hreflang, structured data
  body.html       markup with {{key}} placeholders
  style.css       all styles
  i18n.js         every word on the page, in four languages
  app.js          behaviour
  build.mjs       fills the placeholders and checks the languages agree
assets/fonts/   self-hosted Archivo and IBM Plex Mono, subset
assets/img/     photographs, logos and the wall mask (see assets/README.md)
brand/          logo files, favicon, social image
vercel.json     cache and security headers
```

`src/` is in `.vercelignore`, so only the built page and its assets deploy.

## Editing

1. Change the sources in `src/`.
2. Build: `node src/build.mjs index.html`
3. Commit both the sources and the rebuilt `index.html`.

The build stops with an error if a key is missing in any language, if the
languages have different keys, or if a list (services, FAQ, paint chips and so
on) has a different length in one of them.

- **Any text**: find its key in `src/body.html` (`{{key}}` or `data-i18n`),
  then edit that key in all four blocks of `src/i18n.js`.
- **Paint chips**: names and one-line descriptions are the `paints` array in
  `i18n.js`; the colours themselves are `PAINT` in `src/build.mjs` (index 0 is
  the room as photographed, so it has no paint).
- **Services, steps, FAQ, towns, job roles**: the matching arrays in
  `i18n.js`. Keep every language the same length and order.
- **Company details**: the `COMPANY` object in `app.js` (used by the forms),
  plus the contact section and footer in `body.html` and the structured data
  in `head.html`.
- **Hover and press**: hover changes colour and depth only, never position,
  and sits inside `@media (hover:hover) and (pointer:fine)` so a tap on a phone
  cannot leave a control stuck in its hover state.

## Running it locally

```bash
node src/build.mjs index.html
python3 -m http.server 8145
```

Then open http://localhost:8145.

## Notes

- The quote form posts to FormSubmit, a third-party relay that forwards the
  submission to the company's inbox. The first submission to a new address has
  to be confirmed by clicking a link FormSubmit emails there, so changing the
  address in `COMPANY.email` means confirming again. If the request fails, the
  page falls back to opening the visitor's mail client with the message
  pre-filled.
- Because that relay sends from its own domain rather than the company's, the
  notifications tend to land in spam. A rule on `from: formsubmit.co` set to
  never junk it fixes that; sending from an owned domain with SPF/DKIM/DMARC
  is the real cure.
- **Photos.** FormSubmit caps a submission at 10 MB across all files, and a
  phone photo is 3–8 MB, so each one is drawn to a canvas, capped at 1600px
  on its long edge and re-encoded as JPEG at quality 0.82 before it is
  queued, roughly 250–400 KB each. Anything the canvas cannot decode (HEIC,
  usually) is passed through untouched at its original size. The form refuses
  to send over 8 MB total and says so.
- **Attachments never go over AJAX.** FormSubmit's AJAX endpoint accepts a
  multipart body, answers `200`, and silently discards the files. The email
  arrives with every text field intact and nothing attached. So a submission
  carrying photos is posted as a real `multipart/form-data` form to the plain
  endpoint, with the first file field named `attachment` per FormSubmit's
  convention and the rest `attachment2`…`attachment8`. That navigates away, so
  `_next` returns the visitor to `?sent=1`, where the page confirms the send
  and strips the marker from the URL. Submissions without photos still go as
  JSON over AJAX, which works fine for text.
- **Both forms share one path.** `fsPostForm(fields, files)` posts the
  multipart form; the quote passes its photos, the job application passes the
  CV. They come back on separate markers: `?sent=1` for a quote and `?applied=1`
  for an application, so each confirms in its own form and scrolls there.
- **No prices on the page.** Every building is different, so the site lists
  what the firm does and leaves the number to a site visit. The service
  section says so, and the contact copy repeats it in all four languages.

## Deployment

Deployed on Vercel from this repository's `main` branch; every push to `main`
publishes.
