#!/usr/bin/env python3
"""Rebuild assets/intro.mp4 and assets/intro-bg.jpg from scripts/intro-source.mp4.

The clip was filmed against a grey studio wall, and that wall came through the
encoder with 8x8 block artefacts in it — invisible in a small box, mottled and
banded once the clip runs full-screen. The logo is fine; only the wall is not.

So the wall is replaced. The logo is lifted off it, a mathematically smooth
vignette is built in its place, and the logo goes back on top. Nothing about
the animation changes.

    pip install pillow numpy imageio-ffmpeg
    python3 scripts/clean-intro.py
"""
import os, sys, glob, shutil, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'scripts', 'intro-source.mp4')
OUT  = os.path.join(ROOT, 'assets')
LO, HI = 22., 62.      # alpha ramp; the source's own noise tops out near 7
SHADOW = 548           # below this row there is only floor, no logo
FPS, CRF = 24, 18

def ffmpeg():
    c = shutil.which('ffmpeg')
    if c: return c
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

def run(*a): subprocess.run(a, check=True)

def box1(a, r):
    n = a.shape[1]
    c = np.concatenate([np.zeros((a.shape[0], 1), np.float32),
                        np.cumsum(a, axis=1, dtype=np.float32)], axis=1)
    lo = np.clip(np.arange(n) - r, 0, n); hi = np.clip(np.arange(n) + r + 1, 0, n)
    return (c[:, hi] - c[:, lo]) / np.maximum(hi - lo, 1)

def blur(a, r):
    o = a.astype(np.float32)
    for _ in range(3):
        o = box1(box1(o, r).T.copy(), r).T.copy()
    return o

def main():
    if not os.path.exists(SRC): sys.exit('missing ' + SRC)
    ff = ffmpeg()
    tmp = tempfile.mkdtemp(prefix='intro-')
    src, dst = os.path.join(tmp, 's'), os.path.join(tmp, 'd')
    os.makedirs(src); os.makedirs(dst)
    run(ff, '-hide_banner', '-loglevel', 'error', '-i', SRC, '-vsync', '0',
        os.path.join(src, '%04d.png'))
    fs = sorted(glob.glob(os.path.join(src, '*.png')))
    arr = lambda p: np.asarray(Image.open(p).convert('RGB'), dtype=np.float32)

    # The wall as filmed. Frame 0 is 98.5% clean, the logo having barely started,
    # so mask that sliver and fill it from its surroundings.
    f0 = arr(fs[0])
    m = ((f0.max(2) - f0.min(2)) > 18).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.MaxFilter(9)), np.float32) / 255.
    keep = 1.0 - m
    den = blur(keep, 40) + 1e-6
    plate = np.stack([blur(f0[:, :, c] * keep, 40) / den for c in range(3)], axis=2)
    plate = np.where(m[..., None] > 0.02, plate, f0)

    # The wall as it should be: grey, and smooth enough that no block survives.
    clean = blur(plate.mean(2), 30)
    bg0 = np.dstack([clean] * 3)
    h = clean.shape[0]
    ramp = np.clip((np.arange(h) - (SHADOW - 40)) / 40., 0, 1)[:, None]

    for i, p in enumerate(fs):
        f = arr(p)
        a = np.clip((np.abs(f - plate).max(2) - LO) / (HI - LO), 0, 1)[..., None]
        # The floor shadow is soft by nature: an alpha threshold chops its faint
        # half into dashes, so it travels as its own blurred layer instead.
        delta = np.minimum(blur((f - plate).mean(2), 5), 0)
        bg = bg0 + (delta * ramp)[..., None]
        a = a * (1 - ramp)[..., None]
        aa = np.maximum(a, 1e-3)
        logo = np.clip((f - plate * (1 - aa)) / aa, 0, 255)
        Image.fromarray(np.clip(logo * a + bg * (1 - a), 0, 255).astype(np.uint8)).save(
            os.path.join(dst, '%04d.png' % i))

    run(ff, '-hide_banner', '-loglevel', 'error', '-framerate', str(FPS),
        '-i', os.path.join(dst, '%04d.png'), '-c:v', 'libx264', '-crf', str(CRF),
        '-preset', 'veryslow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        '-an', '-y', os.path.join(OUT, 'intro.mp4'))
    # the same field the clip sits on, for the overlay behind it
    Image.fromarray(clean.astype(np.uint8)).convert('RGB').resize((640, 360), Image.LANCZOS)\
        .save(os.path.join(OUT, 'intro-bg.jpg'), quality=92, optimize=True)
    shutil.rmtree(tmp)
    for n in ('intro.mp4', 'intro-bg.jpg'):
        print('%-14s %d KB' % (n, os.path.getsize(os.path.join(OUT, n)) // 1024))

if __name__ == '__main__':
    main()
