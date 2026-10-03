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
frame occupies on a desktop, which covers a retina screen and stops there:
the originals were 1200px, so going wider would have added file size without
adding detail.

## Replacing one

Drop the new file in over the old name and match the recipe: crop to 16:9,
1200px wide, JPEG at quality 0.80, and keep it under about 200 KB. Nothing in
the markup needs touching, though the `alt` text in `index.html` describes
what is in the current photo, so rewrite it to match the new one, since it is what
a screen reader and a search engine read.

The images carry `width`, `height` and `loading="lazy"`, so the card reserves
its space before the photo arrives and the page does not shift as you scroll
to it. Keep those attributes, and update the numbers if the dimensions change.

`vercel.json` serves everything in this folder with a one-year immutable
cache, so a changed photo needs a changed filename to reach anyone who has
already visited, or accept that they keep the old one until the cache lapses.

## The intro

There isn't one here any more. The loading overlay used to be a 338 KB H.264
clip plus a 7.5 KB backdrop plate, rebuilt from a master in `scripts/`. It is
now four SVG paths drawn with `stroke-dashoffset`, inline in `index.html`, so
there is nothing to download, nothing to decode, and nothing to rebuild when
the logo changes.

The paths are the logo's own geometry, measured off
`brand/univers-servis-logo-master-2096x695-transparent.png`: stroke width 24,
colour `#dde679`, on the logo's own 2096x695 canvas. The wordmark sits over
them as a transparent PNG on that same canvas, so the frame wraps the name
exactly as it does in the logo.

If the logo ever changes shape, re-measure the stroke endpoints against the
master and update the four `d` attributes; the wordmark PNG is the master with
the green line art masked out and dilated away, scaled to 1180px wide.
