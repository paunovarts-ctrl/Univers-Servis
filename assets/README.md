# assets

Photographs used by the site. Everything else on the page is embedded directly
in `index.html`; these are the only files kept separately, because they are the
ones that get replaced.

## The two branch photos

`index.html` has a photo slot in each branch card, sitting in the markup as a
comment:

```html
<div class="branch-media">
  <svg class="branch-ic" ...></svg>
  <!-- photo slot: replace this comment with  <img src="assets/interior.jpg" alt="">  -->
</div>
```

Drop the file in here, swap the comment for the `<img>` tag it shows, and the
photo fills the frame — it is already set to `object-fit: cover`, so it crops to
the card rather than stretching. Remove the `<svg>` line at the same time; the
icon only exists to hold the space until a photograph arrives.

Wanted:

| File | Shows |
|---|---|
| `interior.jpg` | a finished interior — a painted room, clean edges, good light |
| `exterior.jpg` | a finished facade, ideally with scaffolding down and the render visible |

Shoot or crop them at **16:9** and around **1600px wide**. Save as JPEG at
quality 80 or so: the frame is never displayed larger than about 860px, so
anything beyond 1600px is weight for nothing. Keep each file under ~300 KB.

Write a real `alt` description in the tag rather than leaving it empty — it is
what a screen reader and a search engine read.
