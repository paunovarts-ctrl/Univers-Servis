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

## intro.mp4

The loading screen. 5.1 seconds, H.264 + AAC, 1.0 MB, shown full-screen over
the site on every load.

The sequence, in `index.html`'s first inline script: play it through, hold
600 ms on the last frame, run it backwards in 520 ms, then dissolve the
overlay over 700 ms. About 7 seconds from opening the page to reaching the
site.

**It does not rewind by seeking.** Seeking backwards is limited to keyframes,
so it stutters, and on some files `seekable` is empty and every seek lands at
zero. Instead the script keeps 18 frames on the way forward — drawn into small
canvases, capped at 600px wide — and flips through those. A few megabytes of
memory, freed when the overlay goes, and it runs at whatever speed we ask for
regardless of the codec.

The overlay's backdrop is sampled from the clip's own first frame: if all four
corners are within 10 of each other it is a flat backdrop and the overlay
adopts it, otherwise it stays white. So a clip on any background colour sits
on a matching field with no visible edge.

The audio track is never heard — the video is muted, which is also what lets
it autoplay at all. Muting is required; browsers block autoplay with sound.

It always ends. Click or press Escape to skip, a missing or blocked video
finishes immediately, `prefers-reduced-motion` removes it before it starts,
and a nine-second timer catches anything else.

Replacing it: same filename works, but `assets/` carries a one-year immutable
cache, so returning visitors keep the old clip until it lapses — use a new
filename if that matters. Keep it short and keep it small; it loads before
anyone sees the site.
