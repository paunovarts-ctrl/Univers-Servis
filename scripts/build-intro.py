#!/usr/bin/env python3
"""Build assets/intro.mp4 and assets/intro-bg.jpg from scripts/intro-source.mp4.

The source is 2560x1440 at 120fps and 5.6 MB: right for a master, far too heavy
for the first thing a visitor downloads. This trims it to something a loading
screen can justify and derives the backdrop the overlay sits on.

    pip install pillow numpy imageio-ffmpeg
    python3 scripts/build-intro.py

On the settings: 1920 wide is past any screen the clip is shown on, 60fps keeps
the neon draw-on smooth, and `-tune animation` is the one that matters: on flat
cel-like material it gave both a smaller file and a better picture than the same
CRF without it (450 KB at 42.9 dB against 708 KB at 42.8). CRF 26 then costs
0.5 dB for another 120 KB saved, which on a five-second intro is worth taking.
"""
import os, sys, shutil, subprocess
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'scripts', 'intro-source.mp4')
OUT  = os.path.join(ROOT, 'assets')
WIDE, FPS, CRF = 1920, 60, 26

def ffmpeg():
    c = shutil.which('ffmpeg')
    if c: return c
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

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
    subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-i', SRC,
        '-vf', 'scale=%d:-2,fps=%d' % (WIDE, FPS), '-c:v', 'libx264', '-crf', str(CRF),
        '-tune', 'animation', '-preset', 'veryslow', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', '-an', '-y', os.path.join(OUT, 'intro.mp4')], check=True)

    # The backdrop the overlay wears, taken from the clip so the two are one field.
    # Frame 0 is almost all wall (the logo has barely started), so mask that
    # sliver, fill it from its surroundings, force grey and blur.
    tmp = os.path.join(OUT, '_f0.png')
    subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-i', SRC,
        '-vframes', '1', '-y', tmp], check=True)
    f0 = np.asarray(Image.open(tmp).convert('RGB'), dtype=np.float32)
    os.remove(tmp)
    m = ((f0.max(2) - f0.min(2)) > 18).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.MaxFilter(9)), np.float32) / 255.
    keep = 1.0 - m
    den = blur(keep, 60) + 1e-6
    plate = np.stack([blur(f0[:, :, c] * keep, 60) / den for c in range(3)], axis=2)
    plate = np.where(m[..., None] > 0.02, plate, f0)
    clean = blur(plate.mean(2), 40)
    Image.fromarray(clean.astype(np.uint8)).convert('RGB')\
        .resize((640, 360), Image.LANCZOS)\
        .save(os.path.join(OUT, 'intro-bg.jpg'), quality=92, optimize=True)

    for n in ('intro.mp4', 'intro-bg.jpg'):
        print('%-14s %d KB' % (n, os.path.getsize(os.path.join(OUT, n)) // 1024))

if __name__ == '__main__':
    main()
