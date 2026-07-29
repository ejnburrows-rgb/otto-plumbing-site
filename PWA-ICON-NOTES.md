# PWA icon fix notes (Task 5)

## What changed in this PR
- `manifest.json` no longer uses the discouraged combined `"purpose": "any maskable"`. It now has separate entries:
  - `favicon.svg` and `icon-512.svg` with `purpose: "any"`
  - `icon-maskable.svg` with `purpose: "maskable"`
  - `icon-192.png` kept as `purpose: "any"` for older browsers
- New `icon-maskable.svg` keeps all critical content inside a centered circle of radius 40% of the 512×512 viewBox, with an opaque gradient background. The outer 10% may be safely cropped by Android/Chrome OS masks.
- New `icon-512.svg` is a true 512×512 vector icon that scales cleanly on high-DPI devices.

## Raster icons — resolved

Both PNGs are now real, correctly sized, and generated from the vector source
art already in this repo (`icon-512.svg`, the same OTTO ring mark used as the
inline brand mark in `index.html`). No new art was drawn.

| File | Was | Now |
| --- | --- | --- |
| `icon-192.png` | cartoon plumber mascot, actually 512×512 but declared 192×192 | 192×192 OTTO ring mark |
| `icon-512.png` | byte-identical duplicate of the mascot file | 512×512 OTTO ring mark |

Two things this fixed beyond the size bug:

- The mascot violated the "no mascots or cartoon creative" rule in `AGENTS.md`,
  and it was the icon Android used when installing the site.
- `icon-512.png` was not referenced in `manifest.json` at all; it now is.

To regenerate after a change to `icon-512.svg`, render that SVG at 192×192 and
512×512 and overwrite the two PNGs — no code changes needed, the filenames and
manifest entries stay the same.

## How to verify after merge
1. Open https://otto-plumbing-site.vercel.app in Chrome DevTools → Application → Manifest.
2. Confirm no icon has `"purpose": "any maskable"`.
3. Confirm the maskable icon preview shows the circle logo fully inside the safe zone.
4. Run Lighthouse → PWA → confirm installability passes.
