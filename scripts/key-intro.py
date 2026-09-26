#!/usr/bin/env python3
"""Rebuild the loading-screen clip from scripts/intro-source.mp4.

Lifts the logo animation off the grey studio backdrop it was filmed against and
writes assets/intro.webm (VP9 with real transparency) and assets/intro.mp4
(the same thing baked onto the page tone, for players that ignore alpha).

    pip install pillow numpy imageio-ffmpeg
    python3 scripts/key-intro.py

Why subtraction and not a colour key: the wordmark is grey, the same family as
the backdrop behind it, so no colour separates the two. The backdrop is static
though, and frame 0 is almost clean, which is enough to reconstruct it.
"""
import os, sys, glob, shutil, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC    = os.path.join(ROOT, 'scripts', 'intro-source.mp4')
OUT    = os.path.join(ROOT, 'assets')
PAGE   = (244, 249, 245)   # the page's backdrop where the logo sits
LO, HI = 22., 62.          # alpha ramp; compression noise tops out near 7
CUT    = 560               # the clean gap between the logo and its floor shadow
FPS, WIDE, CRF = 24, 1024, 52

def ffmpeg():
    for c in (shutil.which('ffmpeg'), ):
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

def blur(a, r=40):
    out = a.astype(np.float32)
    for _ in range(3):
        out = box1(box1(out, r).T.copy(), r).T.copy()
    return out

def main():
    if not os.path.exists(SRC): sys.exit('missing ' + SRC)
    ff = ffmpeg()
    tmp = tempfile.mkdtemp(prefix='intro-')
    frames, rgba = os.path.join(tmp, 'f'), os.path.join(tmp, 'a')
    os.makedirs(frames); os.makedirs(rgba)
    run(ff, '-hide_banner', '-loglevel', 'error', '-i', SRC, '-vsync', '0',
        os.path.join(frames, '%04d.png'))
    fs = sorted(glob.glob(os.path.join(frames, '*.png')))
    arr = lambda p: np.asarray(Image.open(p).convert('RGB'), dtype=np.float32)

    # the plate: frame 0 with what little logo it holds masked out and filled in
    f0 = arr(fs[0])
    m = ((f0.max(2) - f0.min(2)) > 18).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.MaxFilter(9)), dtype=np.float32) / 255.
    keep = 1.0 - m
    den = blur(keep) + 1e-6
    plate = np.stack([blur(f0[:, :, c] * keep) / den for c in range(3)], axis=2)
    plate = np.where(m[..., None] > 0.02, plate, f0)

    bb = [10**9, 10**9, -1, -1]
    for i, p in enumerate(fs):
        f = arr(p)
        a = np.clip((np.abs(f - plate).max(2) - LO) / (HI - LO), 0, 1)
        a[CUT:, :] = 0
        aa = np.maximum(a, 1e-3)[..., None]
        c = np.clip((f - plate * (1 - aa)) / aa, 0, 255)
        # invisible pixels hold amplified noise; flatten them or the encoder
        # spends its whole budget on something nobody sees (5.9 MB vs 304 KB)
        for ch in range(3): c[:, :, ch][a < 0.04] = PAGE[ch]
        Image.fromarray(np.dstack([c, a * 255]).astype(np.uint8), 'RGBA').save(
            os.path.join(rgba, '%04d.png' % i))
        ys, xs = np.nonzero(a > 0.04)
        if len(xs):
            bb[0] = min(bb[0], int(xs.min())); bb[1] = min(bb[1], int(ys.min()))
            bb[2] = max(bb[2], int(xs.max())); bb[3] = max(bb[3], int(ys.max()))

    pad = 14
    x0, y0 = max(0, bb[0] - pad), max(0, bb[1] - pad)
    x1, y1 = min(plate.shape[1], bb[2] + 1 + pad), min(CUT, bb[3] + 1 + pad)
    x1 -= (x1 - x0) % 2; y1 -= (y1 - y0) % 2
    print('cropping to %dx%d' % (x1 - x0, y1 - y0))
    for p in sorted(glob.glob(os.path.join(rgba, '*.png'))):
        Image.open(p).crop((x0, y0, x1, y1)).save(p)

    seq = os.path.join(rgba, '%04d.png')
    run(ff, '-hide_banner', '-loglevel', 'error', '-framerate', str(FPS), '-i', seq,
        '-vf', 'scale=%d:-2' % WIDE, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
        '-b:v', '0', '-crf', str(CRF), '-auto-alt-ref', '0', '-an', '-y',
        os.path.join(OUT, 'intro.webm'))
    run(ff, '-hide_banner', '-loglevel', 'error',
        '-f', 'lavfi', '-i', 'color=c=0x%02X%02X%02X:s=%dx%d:r=%d:d=6' % (
            PAGE[0], PAGE[1], PAGE[2], WIDE, round(WIDE * (y1 - y0) / (x1 - x0) / 2) * 2, FPS),
        '-framerate', str(FPS), '-i', seq,
        '-filter_complex', '[1:v]scale=%d:-2[fg];[0:v][fg]overlay=shortest=1,format=yuv420p' % WIDE,
        '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart',
        '-an', '-y', os.path.join(OUT, 'intro.mp4'))
    shutil.rmtree(tmp)
    for n in ('intro.webm', 'intro.mp4'):
        print('%-12s %d KB' % (n, os.path.getsize(os.path.join(OUT, n)) // 1024))

if __name__ == '__main__':
    main()
