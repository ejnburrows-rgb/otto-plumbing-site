# PWA icon fix notes (Task 5)

## What changed in this PR
- `manifest.json` no longer uses the discouraged combined `"purpose": "any maskable"`. It now has separate entries:
  - `favicon.svg` and `icon-512.svg` with `purpose: "any"`
  - `icon-maskable.svg` with `purpose: "maskable"`
  - `icon-192.png` kept as `purpose: "any"` for older browsers
- New `icon-maskable.svg` keeps all critical content inside a centered circle of radius 40% of the 512×512 viewBox, with an opaque gradient background. The outer 10% may be safely cropped by Android/Chrome OS masks.
- New `icon-512.svg` is a true 512×512 vector icon that scales cleanly on high-DPI devices.

## What still needs the owner/design source
- The original `icon-512.png` was a duplicate of `icon-192.png` (same bytes). A true 512×512 **PNG** export requires the original design source file (the OTTO logo in its native design app). This PR replaces the broken PNG with a scalable SVG equivalent, but the owner should still export a real 512×512 PNG from the source if a PNG is preferred.

## How to verify after merge
1. Open https://otto-plumbing-site.vercel.app in Chrome DevTools → Application → Manifest.
2. Confirm no icon has `"purpose": "any maskable"`.
3. Confirm the maskable icon preview shows the circle logo fully inside the safe zone.
4. Run Lighthouse → PWA → confirm installability passes.
