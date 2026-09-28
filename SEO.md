# SEO — what was done, and what only you can do

Research: four language markets plus local-search visibility, Sept 2026.
**No search-volume figures appear anywhere below.** No keyword tool was
available, so everything is ranked by reasoning and by observed competitor
behaviour. Nothing here is an invented number.

---

## ⚠️ Read this first: the business identity does not agree with itself

Two separate research passes turned up the same problem in the public
Croatian company register (companywall.hr, sourced from the court register):

| Field | This website says | Register says |
|---|---|---|
| Name | Univers Servis Poreč | UNIVERS SERVIS POREČ **d.o.o.** |
| Address | Mate Vlašića 26/22 | **Bračka 37** |
| Phone | +385 98 335 031 / +385 91 9360 031 | **052 452 067** |
| Founded | "30 years" | **02.11.2012** |
| Email | uservis@net.hr | uservis@net.hr ✓ |

A second, older entity also exists: **UNIVERS - SERVIS d.o.o.**, Bračka 35,
registered 1990-05-30.

**Nothing on the site was changed to match the register.** Earlier in this
project the instruction was that the d.o.o. is a different firm — but the
logo now in `brand/` reads "UNIVERS SERVIS POREČ d.o.o.", which points the
other way. Only the owner can settle this.

Why it matters more than any keyword: Google decides whether two listings
are one business by matching name, address and phone. Right now a search
engine sees two or three near-identical businesses and splits the trust
between them instead of giving one of them full credit. Inconsistent NAP is
reported to cost 2–3 positions in the local pack.

**Settle it at <https://sudreg.pravosudje.hr/>**, write down the legal name,
short name (*skraćeni naziv*), OIB and registered seat verbatim, then use
that one string byte-for-byte on the site, the Google profile, every
directory, invoices and the van. The 1990 date, if it belongs to a
predecessor obrt, supports the "30 years" claim honestly:
*"Obiteljski obrt od 1990., kao d.o.o. od 2012."*

---

## The honest priority order

On-page SEO is roughly **19%** of what decides local-pack position. Google
Business Profile is about **32%** and reviews **16–20%** (Whitespark 2026).
Everything in this repo is the 19%. The rest is not something code can do.

1. **Fix the identity contradiction above.** Gates everything else.
2. **Google Business Profile.** Biggest single lever by a wide margin.
3. **Reviews.** Second biggest, and compounding.
4. Directories, then the rest.

For `soboslikar Poreč` the entire first page is directories and *job boards*
— not one painter's own website ranks. Google is padding with wrong-intent
results because no strong local page exists. Don't try to out-rank
eistra.info at being a directory; take the map pack, which sits above it.

---

## Google Business Profile — the specifics

Set up as a **service-area business**: enter the real address, then clear
the address field and add service areas (Poreč, Vrsar, Funtana, Tar-Vabriga,
Kaštelir-Labinci, Višnjan, Novigrad, Sv. Lovreč, Brtonigla, Umag, Vižinada,
Motovun, Buje, Rovinj). Max 20; don't pad it, padding dilutes relevance.

**Verification is video by default since July 2026.** One continuous
unedited take, 30s–5min: branded van → scaffolding and equipment → material
stacks → a headed invoice or registry extract showing the legal name →
the office door. Editing or splicing is the top rejection cause.

**Category is the single most important field.** The Croatian category
strings could not be verified from here. Get them yourself in ten minutes:
in the dashboard with the profile language set to Croatian, type
`soboslikar`, `slikar`, `fasad`, `žbuk`, `štukat`, `gips`, `izolacij` and
take whatever autocompletes. Use **1 primary + 3–4 secondaries**, no more.
Given the registered activity is F43.31 (fasadni i štukaturski radovi), test
a facade/plastering primary against a painting primary and keep the winner.

Then: fill the **Services** list exhaustively in Croatian (12–20 entries,
each with its own description — almost no competitor does this), 40–60 real
photos at launch and 5–10 monthly, every remaining field, and 6–8 seeded
Q&A. Set "languages spoken" to include German and Italian.

**Reviews:** ask everyone, never only the happy ones (that is gating, and
it is banned). No incentives of any kind — enforcement tightened in 2026,
and since April 2026 you may not ask customers to name a staff member.
Pace 3–5 requests a day, not 60 in an afternoon; a spike on a new profile
looks bought and gets filtered. Target 10–15 in 90 days, then 2–4 a month
forever. Hotel and B2B clients will almost never leave one — get written
references from them instead and weight review effort at homeowners.
German and Italian reviews are disproportionately valuable: review *text*
is now itself a relevance signal, so a German review helps you surface for
German queries.

---

## Language findings that shaped the copy

**Croatian — `pitur` is the Istrian word.** eistra.info, a lead-generating
directory, built a page per Istrian town with `pituri` in the URL slug and
the title tag, paired with `farbanje` rather than `bojanje`. Directories do
not put a dialect word in a slug template unless the data says people type
it. Rijeka's press writes *pituri* where Zagreb's writes *molera* — Poreč is
pitur territory. `soboslikar` and `fasade` carry the titles; `pitur`,
`farbanje`, `ličenje`, `krečenje` live in the body line under the service
menu. That earns the synonym coverage without the stuffing signal that is
currently sinking a local competitor whose title runs to 130 characters.

**All three foreign languages share one trap: the word for "painter" means
"artist".** German "Maler Kroatien" returns Wikipedia's category of Croatian
*painters* and art marketplaces. Italian "imbianchino Istria" returns Milan,
because Istria is also a Milan neighbourhood on the M5. English "painting
Istria" returns painting *holidays* and paint-and-pottery studios. Every
title now leads with a trade noun and a place that disambiguates — never a
bare "Istria".

**The same three fears appear in all three foreign markets**, independently:
the price goes up mid-job, the contractor takes a deposit and disappears,
and the work turns out to have needed a permit. German-speaking absentee
owners add a fourth — *who is in my house while I am not there*. The page
does not yet answer any of these. That is the highest-value copy work left,
and it is worth more than any keyword: say who holds the key, that you send
photo updates, that the quote is written and does not change without
written agreement, that you issue a proper invoice, and that you work
year-round including off-season.

**Italian: use `Parenzo (Poreč)`.** Italian publishers overwhelmingly pair
both spellings, because owners have "Poreč" on every document they possess
but write "Parenzo". The address block keeps the official `52440 Poreč` for
local-pack consistency.

**German: do not claim a fixed price per m².** Research suggested it as a
trust signal, but this site deliberately publishes no prices. Left out.

---

## What is in the code now

- Per-language `<title>` and meta description, rewritten by `setLang()`
- One URL per language (`/`, `?lang=hr`, `?lang=de`, `?lang=it`) with
  `hreflang` + `x-default`, self-referencing canonical, and the address bar
  kept in step with the content
- Browser-language auto-detection on first visit
- `HousePainter` + `GeneralContractor` structured data with the full service
  catalogue in English and Croatian, plus `WebSite`
- Open Graph and Twitter cards, `brand/og-image.png`, favicons
- `robots.txt`, `sitemap.xml` with per-language alternates

**`geo` was deliberately left out of the structured data.** Guessed
coordinates are worse than none. Copy the exact pin from the Google
Business Profile once it exists.

---

## Not done, and why

- **No FAQ / price / seasonality pages.** The highest-value remaining SEO
  work is content: "kada raditi fasadu u Istri", the mould and salt-damage
  problem pages, and the absentee-owner reassurances above. That is writing,
  not markup, and it should be written by someone who knows the trade.
- **Nothing was changed to match the company register.** See the top.
- **English research was done inline**, not by the research agent — that
  agent hit the session rate limit before reporting. The English findings
  above are thinner than the other three as a result.
