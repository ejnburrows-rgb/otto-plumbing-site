# Otto Plumbing — Marketing Site

Public marketing/landing site for Otto Plumbing Inc. (South Florida). A
single-file, bilingual (English/Spanish) static page — no build step, no
server required.

## Files
- `index.html` — the entire site.
- `manifest.json` — PWA install metadata.
- `favicon.svg`, `apple-touch-icon.svg`, `icon-192.png`, `icon-512.png` — icons.

## Contact form → CRM
The contact form (`#contact`) posts submissions to `/api/website-lead` on the
[otto](https://github.com/ejnburrows-rgb/otto) CRM's deployment (see the
`CRM_API_BASE` constant near the top of the `<script>` block in `index.html`).
That endpoint appends the lead as a new "call" in the CRM's Firestore data, so
it shows up in the CRM's Calls list automatically. If the request fails (CRM
unreachable or not configured), the form falls back to a `mailto:` link so a
lead is never lost.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
