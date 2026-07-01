"""Generate SAR pipeline layer images from Chandrayaan-2 DFSAR reference data."""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "frontend" / "public" / "images" / "sar"
SOURCE = OUT_DIR / "isro-dfsar-sample.webp"
TARGET_SIZE = (1280, 800)


def load_base_sar() -> np.ndarray:
    """Crop the DFSAR half from the ISRO optical/DFSAR comparison image."""
    img = Image.open(SOURCE).convert("L")
    width, height = img.size
    dfsar = img.crop((width // 2, 0, width, height))
    dfsar = dfsar.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    return np.asarray(dfsar, dtype=np.float32)


def normalize(arr: np.ndarray, low_pct: float = 2, high_pct: float = 98) -> np.ndarray:
    lo, hi = np.percentile(arr, [low_pct, high_pct])
    if hi <= lo:
        hi = lo + 1
    return np.clip((arr - lo) / (hi - lo), 0, 1)


def add_speckle(arr: np.ndarray, strength: float = 0.35) -> np.ndarray:
    noise = np.random.gamma(1.0, strength, arr.shape).astype(np.float32)
    return np.clip(arr * noise, 0, 1)


def to_gray_image(arr: np.ndarray) -> Image.Image:
    return Image.fromarray((normalize(arr) * 255).astype(np.uint8), mode="L")


def enhanced_from(base: np.ndarray) -> np.ndarray:
    img = to_gray_image(base)
    img = ImageEnhance.Contrast(img).enhance(1.45)
    img = ImageEnhance.Sharpness(img).enhance(1.35)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    return np.asarray(img, dtype=np.float32) / 255.0


def ice_probability_map(base: np.ndarray) -> np.ndarray:
    h, w = base.shape
    y, x = np.mgrid[0:h, 0:w]
    cx, cy = w * 0.58, h * 0.52
    crater = np.exp(-(((x - cx) ** 2) / (2 * (w * 0.18) ** 2) + ((y - cy) ** 2) / (2 * (h * 0.14) ** 2)))
    ridge = np.exp(-(((x - w * 0.34) ** 2 + (y - h * 0.38) ** 2) / (2 * (w * 0.11) ** 2)))
    shadow = np.exp(-(((x - w * 0.72) ** 2 + (y - h * 0.68) ** 2) / (2 * (w * 0.09) ** 2)))
    low_backscatter = 1.0 - normalize(base)
    prob = 0.15 + 0.55 * crater + 0.25 * ridge + 0.35 * shadow + 0.2 * low_backscatter
    return normalize(prob, 5, 95)


def apply_colormap(prob: np.ndarray) -> Image.Image:
    stops = [
        (0.00, (8, 16, 28)),
        (0.25, (12, 40, 64)),
        (0.45, (29, 78, 140)),
        (0.65, (77, 160, 220)),
        (0.82, (103, 216, 255)),
        (1.00, (165, 243, 252)),
    ]
    h, w = prob.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]
        t1, c1 = stops[i + 1]
        mask = (prob >= t0) & (prob <= t1)
        if not mask.any():
            continue
        local = (prob[mask] - t0) / max(t1 - t0, 1e-6)
        for channel in range(3):
            rgb[..., channel][mask] = (
                c0[channel] + (c1[channel] - c0[channel]) * local
            ).astype(np.uint8)
    return Image.fromarray(rgb, mode="RGB")


def segmentation_overlay(base_img: Image.Image, prob: np.ndarray) -> Image.Image:
    rgb = np.asarray(base_img.convert("RGB"), dtype=np.float32)
    mask = prob > 0.58
    overlay = rgb.copy()
    overlay[mask] = overlay[mask] * 0.35 + np.array([110, 93, 255]) * 0.65

    edges = prob > 0.58
    edge_img = Image.fromarray((edges.astype(np.uint8) * 255), mode="L")
    edge_img = edge_img.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    edge_arr = np.asarray(edge_img, dtype=np.float32) / 255.0
    boundary = np.clip(edge_arr - np.asarray(edge_img.filter(ImageFilter.MinFilter(5)), dtype=np.float32) / 255.0, 0, 1)
    overlay[boundary > 0.2] = np.array([103, 216, 255])

    return Image.fromarray(np.clip(overlay, 0, 255).astype(np.uint8), mode="RGB")


def landing_overlay(base_img: Image.Image, prob: np.ndarray) -> Image.Image:
    img = base_img.convert("RGBA")
    draw = ImageDraw.Draw(img)
    h, w = img.size[1], img.size[0]

    sites = [
        (0.56, 0.50, "Site α", "#34d399", 94),
        (0.34, 0.62, "Site β", "#fbbf24", 81),
        (0.71, 0.58, "Site γ", "#4d8cff", 76),
    ]

    for px, py, label, color, score in sites:
        x, y = int(px * w), int(py * h)
        radius = int(min(w, h) * 0.055)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=color, width=3)
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=color)
        draw.line((x, y, x, y - radius - 12), fill=color, width=2)
        draw.polygon([(x, y - radius - 18), (x + 6, y - radius - 8), (x - 6, y - radius - 8)], fill=color)
        draw.text((x + 14, y - 10), f"{label} · {score}%", fill=color)

    # Safety corridor
    corridor = [
        (int(0.42 * w), int(0.72 * h)),
        (int(0.52 * w), int(0.46 * h)),
        (int(0.64 * w), int(0.54 * h)),
        (int(0.58 * w), int(0.78 * h)),
    ]
    draw.line(corridor + [corridor[0]], fill="#34d399", width=2)

    heat = apply_colormap(prob).convert("RGBA")
    heat.putalpha(70)
    return Image.alpha_composite(img.convert("RGBA"), heat).convert("RGB")


def main() -> None:
    np.random.seed(42)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    base = load_base_sar()
    original = add_speckle(normalize(base), strength=0.42)
    enhanced = enhanced_from(base)
    prob = ice_probability_map(base)

    original_img = to_gray_image(original)
    enhanced_img = to_gray_image(enhanced)
    heatmap_img = apply_colormap(prob)
    segmentation_img = segmentation_overlay(enhanced_img, prob)
    landing_img = landing_overlay(enhanced_img, prob)

    original_img.save(OUT_DIR / "original.png", optimize=True)
    enhanced_img.save(OUT_DIR / "enhanced.png", optimize=True)
    segmentation_img.save(OUT_DIR / "segmentation.png", optimize=True)
    heatmap_img.save(OUT_DIR / "heatmap.png", optimize=True)
    landing_img.save(OUT_DIR / "landing.png", optimize=True)

    print("Generated SAR layer images:")
    for name in ["original.png", "enhanced.png", "segmentation.png", "heatmap.png", "landing.png"]:
        path = OUT_DIR / name
        print(f"  {path.name}: {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
