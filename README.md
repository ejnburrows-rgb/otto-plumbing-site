# Otto Plumbing — Website

Static single-page marketing site, served as plain HTML/CSS/JS with PWA assets (`manifest.json` + icons).

## Files

```
index.html            # The entire site (markup, styles, scripts)
manifest.json         # PWA manifest
favicon.svg           # Favicon
apple-touch-icon.svg  # iOS home-screen icon
icon-192.png          # PWA icon (192×192)
icon-512.png          # PWA icon (512×512 slot)
```

## Local development

No build step. Open `index.html` directly in a browser, or run a tiny local server:

```bash
npx serve .
```

## Deployment

Pushes to `main` deploy automatically via the connected hosting (Vercel/GitHub integration). No manual deploy step.

## Maintenance notes

- `icon-512.png` is currently the same image file as `icon-192.png`. For crisp install icons, regenerate a true 512×512 export and replace it (safe swap — same filename, no code changes needed).
