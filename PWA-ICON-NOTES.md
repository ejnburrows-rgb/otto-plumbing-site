# PWA icon notes

The browser and install metadata intentionally retains only these required assets:

- `favicon.svg`
- `apple-touch-icon.svg`
- `icon-192.png`
- `icon-512.png`

The two PNGs are correctly sized OTTO ring marks retained for PWA compatibility and older browsers. Unused icon variants were removed with the prior website imagery.

To verify, open the production site in Chrome DevTools, inspect Application → Manifest, and confirm each declared icon loads at its stated size.
