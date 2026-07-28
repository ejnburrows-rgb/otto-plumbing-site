# OTTO Plumbing — Website

Static single-page marketing site for **OTTO Plumbing Inc.**, served as plain HTML/CSS/JS with PWA assets (`manifest.json` + icons).

## Files

```
index.html            # The entire site (markup, styles, scripts)
manifest.json         # PWA manifest
AGENTS.md             # Rules for every coding tool
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

## Contact form

The form posts to Formspree when `window.OTTO_FORM_ENDPOINT` (or the `FORMSPREE_ENDPOINT` constant at the top of the script in `index.html`) is set to a real `https://formspree.io/f/...` URL. Until then it shows an honest on-screen error and offers call/email — it never fakes success.

## Brand facts (do not invent)

- OTTO Plumbing Inc. (caps)
- (786) 344-2837
- 30+ years / founded 1996
- Licence #CFC1429613
- Mon–Sat 7 AM – 7 PM · South Florida

## Maintenance notes

- `icon-512.png` has historically been the same bytes as `icon-192.png`. For crisp install icons, regenerate a true 512×512 export and replace it (safe swap — same filename, no code changes needed).
- Instagram links stay off the page until a real handle is confirmed.
