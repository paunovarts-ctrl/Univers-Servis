# assets

Photographs used by the site. Everything else on the page is embedded directly
in `index.html`; these are the only files kept separately, because they are the
ones that get replaced.

## The two branch photos

Both are in place and wired into `index.html`:

| File | Shows | Size |
|---|---|---|
| `interior.jpg` | a room masked off, furniture sheeted, floor papered | 1200x675, 96 KB |
| `exterior.jpg` | a house in fresh render, scaffolding still standing | 1200x675, 157 KB |

They are cropped to **16:9**, which is the frame's own ratio, so the card
never has to crop them again. 1200px wide is about double the ~620px the
frame occupies on a desktop, which covers a retina screen and stops there —
the originals were 1200px, so going wider would have added file size without
adding detail.

## Replacing one

Drop the new file in over the old name and match the recipe: crop to 16:9,
1200px wide, JPEG at quality 0.80, and keep it under about 200 KB. Nothing in
the markup needs touching, though the `alt` text in `index.html` describes
what is in the current photo, so rewrite it to match the new one — it is what
a screen reader and a search engine read.

The images carry `width`, `height` and `loading="lazy"`, so the card reserves
its space before the photo arrives and the page does not shift as you scroll
to it. Keep those attributes, and update the numbers if the dimensions change.

`vercel.json` serves everything in this folder with a one-year immutable
cache, so a changed photo needs a changed filename to reach anyone who has
already visited — or accept that they keep the old one until the cache lapses.

## intro.mp4 / intro-bg.jpg

The loading screen, built by `scripts/build-intro.py` from
`scripts/intro-source.mp4`.

The source is 2560x1440 at 120fps, 5.6 MB — a master, not something to put in
front of a visitor before the site loads. Nothing is done to the picture; it is
only trimmed to a size a loading screen can justify.

| | |
|---|---|
| Source | 2560x1440, 120 fps, 5.6 MB |
| Shipped | 1920x1080, 60 fps, **330 KB** |

1920 is past any screen the clip is shown on, and 60fps keeps the neon draw-on
smooth. The setting that did the work is **`-tune animation`**: on flat cel-like
material it gave a smaller file *and* a better picture than the same CRF without
it — 450 KB at 42.9 dB against 708 KB at 42.8. CRF 26 then trades 0.5 dB for
another 120 KB, worth taking on a five-second intro. Error measured on the neon
itself barely moves across that range: 4.07 at CRF 24, 4.19 at 26.

This source needed no repair. Its wall measures 0.071 roughness where the first
clip measured 0.216 — the earlier one had 8x8 blocking baked into the backdrop,
which is why it had to be rebuilt. This one is clean as shot.

`intro-bg.jpg` is the backdrop the overlay wears, derived from the clip's own
frame 0: the logo has barely started there, so masking that sliver, filling it
from its surroundings, forcing grey and blurring gives the wall on its own.

**If the clip is ever replaced, rebuild `intro-bg.jpg` with it** — the overlay
and the clip have to be the same field or the join below 8:5 will show.

### Filling the screen without cutting the logo

The wordmark runs nearly the full width of the frame — 88 px of margin inside
1280 — so `cover` can only crop so far before it eats letters. Above **8:5** the
crop stays inside that margin and the clip covers, edge to edge: nothing cropped
at 16:9, 64 px a side at 16:10.

Below 8:5 it fills the width instead, which would leave bars. There are none,
because two things happen. `intro-bg.jpg` — the clip's own backdrop,
reconstructed from frame 0 with its sliver of logo masked out and filled from
its surroundings, then forced grey and blurred to lift out the floor shadow and
what the inpainting left behind — is stretched to the viewport with
`center/100% 100%`, so the vignette runs edge to edge as one field. And the
clip's top and bottom edges are feathered into it over the outer 17% with a
mask. The logo is clear of that: it occupies rows 168 to 560 of 720, leaving
22% of margin.

The mask needs the element box to be the picture, not the viewport, or it fades
empty space — hence `width:100%; height:auto` rather than `inset:0` in that
branch.

The join measures a maximum step of about 1 grey level per row, against roughly
15 in a single row for a flat fill, which read as two hard lines across the
screen.

### The rewind

No seeking: seeking backwards only lands on keyframes, so it stutters, and some
files report an empty seekable range and every seek lands at zero. Instead 14
frames are kept on the way forward, drawn into canvases sized to roughly what
the clip is displayed at — `max(640, min(1100, innerWidth))` — and flipped
through in reverse. About 36 MB on a desktop, 12 MB on a phone, freed with the
overlay. Capturing at a fixed 600 px was fine when the clip sat in a 540 px box
and soft once it went full-screen.

### It always ends

Click or Escape to skip, a missing or blocked video finishes immediately,
`prefers-reduced-motion` removes it before it starts, and a nine-second timer
catches anything else. A loading screen that can strand someone on a blank page
is worse than no loading screen.

Replacing the clip: same filename works, but `assets/` carries a one-year
immutable cache, so returning visitors keep the old one until it lapses — use a
new filename if that matters. If the new clip's backdrop differs, `intro-bg.jpg`
needs rebuilding from it too, or the bars below 8:5 will not match.
