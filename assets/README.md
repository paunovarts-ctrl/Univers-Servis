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

## intro.webm / intro.mp4

The loading screen: the logo drawing itself, on the page's own backdrop.

The clip as supplied was 1280x720 H.264, 1035 KB, and the logo sat on a grey
studio vignette — 143 at the corners, 236 in the middle — with a floor shadow
under it. On a near-white page that read as a grey slab. What ships now is the
same animation, untouched, with that backdrop removed.

### How the backdrop came off

No colour key could do it: the wordmark is grey, the same family as the
backdrop behind it. So it was subtracted instead.

1. The backdrop is static — away from the shadow it drifts by at most 7 across
   the whole clip — so one plate serves every frame.
2. Frame 0 is 98.5% clean (the logo has barely started). Mask the few coloured
   pixels, fill them by normalised convolution from their surroundings, and
   that is the plate.
3. Per frame and per pixel, alpha ramps over the distance from the plate
   (22 to 62 — above the compression noise, which tops out near 7), and the
   colour is un-premultiplied against the plate, which recovers the true logo
   colour rather than leaving a grey fringe on the soft edges.
4. The studio floor shadow survives that, being absent from the plate. There is
   a clean gap at y=560 between the logo and the shadow, so alpha is cut there.
5. Crop to the logo's bounds across all frames: 1024x386, from 1280x720.

`scripts/key-intro.py` does all of it, and reruns from `scripts/intro-source.mp4`.

### Two files

| | | |
|---|---|---|
| `intro.webm` | VP9, `yuva420p`, real transparency | 304 KB |
| `intro.mp4` | H.264, logo baked on `#F4F9F5` | 236 KB |

The WebM comes first in the markup. Safari plays VP9 but ignores alpha in
WebM, so the transparent areas of the WebM are filled with that same
`#F4F9F5` — if the alpha is dropped it looks like the fallback rather than a
grey slab.

CRF 52 on the WebM: between CRF 40 and 52 the visible error barely moves
(0.66 to 0.72 mean, against the source composited over the page tone) while
the file halves, so the codec is not what limits quality here.

One more thing matters for size: where alpha is zero, un-premultiplying divides
by nearly nothing and fills the invisible area with amplified noise. Encoded
straight, that came to 5.9 MB. Flattening those pixels to a single colour first
brought it to 304 KB for the same picture.

### The overlay

Full-viewport, wearing the same background stack as `body`, fixed the same way,
so the intro's field and the page's field line up exactly and the dissolve
crosses nothing. The logo runs to `min(92vw, 1100px)` — 92% of a phone, capped
just above the source's own 1024px so it is never softened by upscaling.
