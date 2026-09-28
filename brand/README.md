# Brand assets

Mastered from the transparent PNG embedded in `index.html` (2096 × 695, the
cleanest copy of the logo we have — the JPEG doing the rounds has compression
artefacts and a baked-in white background).

## Google Ads

| File | Use |
|---|---|
| `univers-servis-1x1-white.png` | **Square logo (1:1)** — required by Google Ads. 1200 × 1200. |
| `univers-servis-4x1-white.png` | **Landscape logo (4:1)** — optional but worth uploading. 1200 × 300. |
| `univers-servis-1x1-transparent.png` | Same square, transparent background. |
| `univers-servis-4x1-transparent.png` | Same landscape, transparent background. |

Upload the white versions unless a placement specifically wants transparency:
white composites predictably everywhere, transparent can end up dark-on-dark.

Google renders the square logo inside a **circle** in some placements, so the
artwork is sized to fit the inscribed circle rather than the square — it
lands at 92% of the canvas width with the furthest ink 563 px from centre,
against a 600 px crop radius. Nothing is clipped either way.

The logo is 3.02:1, so it can never fill a 1:1 or 4:1 frame edge to edge
without being stretched. It is scaled, never distorted; the rest is padding.

## Regenerating

Both sizes come from the master at the top of this file. Scale it down, never
up: 2096 px wide is the largest clean copy. If a vector (SVG/AI/EPS) ever
turns up, master from that instead and these can be re-rendered at any size.
