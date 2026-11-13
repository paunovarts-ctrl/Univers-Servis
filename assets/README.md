# assets

Files the page loads besides itself: fonts and images.

## fonts/

Archivo (variable: weight 400–800, width 62–100) and IBM Plex Mono 500, each
split in two by `unicode-range`: basic Latin, and a small file with only the
Croatian letters (Č Ć Đ Š Ž), which a page in English never downloads.

## img/

Every photograph comes in AVIF, WebP and JPEG, and the page lets the browser
pick the smallest format it supports and the right width for the screen.

| Files | Shows | Widths |
|---|---|---|
| `before-*` | the room before the work: damaged plaster, damp, cracks | 640, 1200, 1800 |
| `after-*` | the same room after skimming and painting | 640, 1200, 1800 |
| `interior-*` | a room masked off, furniture sheeted, floor papered | 640, 1200 |
| `exterior-*` | a house under facade scaffolding | 640, 1200 |
| `after-wall-1200.webp` | the colour room's mask (below) | 1200 |
| `logo-dark-360`, `logo-light-360` | the logo for light and dark backgrounds | 360 |
| `wordmark-1180` | the name alone, for the intro | 1180 |

The originals were 1200px wide. The 1800px hero versions are upscaled with
Lanczos and a light unsharp mask, which holds up better full-screen than
letting the browser stretch the 1200. Real job photos at full camera
resolution would beat all of this, and are the single biggest improvement
left for the page.

### The before and after pair must stay aligned

The hero rolls one over the other, so both photos must have the same framing
and size (1200x896 at the base width). Replacing one means replacing both
with a matched pair taken from the same spot.

### The wall mask

`after-wall-1200.webp` is an alpha-only image the size of `after-1200.jpg`:
opaque where there is painted wall, transparent everywhere else (windows,
trim, sills, ceiling, skirting, floor). The colour room paints through it. It
was traced against this exact photo, so **a new "after" photo needs a new
mask**; without one, keep the old photo or the paint lands in the wrong
places.

The colour room also uses the wall's median luminosity in this photo
(`WALL_LUM` in `src/app.js`, 0.5775) to set how far each paint lightens or
darkens the walls. Re-measure it if the photo changes.

## Replacing a photo

Keep the aspect ratio (16:9 for interior and exterior, 1200x896 for the
before/after pair), export every width and format listed above, and update
the `alt` text for that photo in all four languages in `src/i18n.js`, since it
is what a screen reader and a search engine read.

`vercel.json` serves everything in `/assets/` with a one-year immutable cache,
so a changed photo needs a **new filename** to reach anyone who has already
visited.
