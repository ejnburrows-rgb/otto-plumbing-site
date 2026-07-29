# Site inventory

Every section, link, form and asset on the page, and whether each is real or a
placeholder.

Taken from `index.html` on `main`, by walking the rendered page in a browser
rather than reading the source. Where one of the open pull requests changes an
item, that is noted.

**Legend** — ✅ real · ⚠️ unverified claim, needs the owner to confirm ·
🔴 placeholder or non-functional

---

## 1. Sections, in page order

| # | Section | `id` | Heading | Status |
| --- | --- | --- | --- | --- |
| 1 | Navbar | — | — | ✅ real |
| 2 | Mobile menu | `mobile-menu` | — | ✅ real |
| 3 | Hero | `top` | South Florida's most trusted plumbers. | ⚠️ contains unverified stats |
| 4 | Trust bar | — | — | ⚠️ contains unverified stats |
| 5 | Services | `services` | Plumbing done right. | ✅ real |
| 6 | Why OTTO | `why` | Built on reliability. | ✅ real |
| 7 | Portfolio | `portfolio` | Portfolio | 🔴 placeholder — see §5 |
| 8 | Mastery | `mastery` | 30 Years of Mastery. | ⚠️ see §5 |
| 9 | Contact | `contact` | Contact Us | ✅ real (form is 🔴, see §3) |
| 10 | CTA band | — | Got a plumbing problem? | ✅ real |
| 11 | Footer | — | — | ✅ real |

Services cards (6): Leak Repair · Water Heaters · Drain & Sewer · Emergency
Service · Commercial · Remodeling. All ✅ — plain descriptions of trade
services, no specific claims.

Why OTTO items (4): Licensed, insured professionals · Same-day response ·
Clear, honest pricing · Bilingual service. All ✅ — "Licensed, insured" is
backed by licence #CFC1429613; "Bilingual" is backed by the EN/ES toggle,
though see `docs/SPANISH-PLAN.md`, that toggle is only two-thirds complete.

---

## 2. Links — 21 in total, 8 unique targets

| Target | Uses | Appears as | Status |
| --- | --- | --- | --- |
| `tel:+17863442837` | **7** | "Call (786) 344-2837", "(786) 344-2837", "Book a Plumber" | ✅ real — correct E.164, dials on iOS and Android |
| `#contact` | 3 | Contact Us, Send a Message | ✅ resolves |
| `#services` | 2 | Services | ✅ resolves |
| `#why` | 2 | Why OTTO | ✅ resolves |
| `#portfolio` | 2 | Portfolio | ✅ resolves |
| `#mastery` | 2 | Mastery | ✅ resolves |
| `#main` | 1 | Skip to main content | ✅ resolves |
| `#top` | 1 | brand wordmark, back to top | ✅ resolves |

**No external links and no `mailto:` links exist on the page.** Two placeholder
Instagram links pointing at the bare `https://www.instagram.com` homepage were
removed in #2; no real OTTO Instagram handle has been supplied, so nothing
replaced them.

All 13 internal anchors resolve to a real element — no dead jumps.

Of the 7 `tel:` links, one is hidden below 560px by design (the navbar button,
which the mobile menu duplicates). The other six are reachable on a phone.

---

## 3. Forms — 1

The contact form, in the Contact section.

| Field | `name` | `id` | Required |
| --- | --- | --- | --- |
| Your name | `name` | `f-name` | yes |
| Phone or email | `contact` | `f-contact` | yes |
| How can we help? | `message` | `f-msg` | yes |
| Submit button | — | — | — |

**Status: 🔴 cannot deliver a message.**

- `action` is empty and `method` is unset; submission is handled entirely in JS
  by `submitForm()`.
- `FORMSPREE_ENDPOINT` is `""`. No endpoint is configured, so **every**
  submission fails. There is a `TODO(owner)` on that line.
- On `main` as it stands, failure shows a browser `alert()` with no phone number
  and no email fallback, and the customer's message is lost.
- **#10 fixes the failure handling** — on-screen panel, tappable phone number,
  `mailto:` pre-filled with what was typed, fields preserved. It does **not**
  make the form deliver; only a real Formspree endpoint can do that.

**This is the single most important open item on the site.** One of only two
ways a customer can reach OTTO is currently a dead end.

---

## 4. Assets

### Files in the repository

| File | Purpose | Status |
| --- | --- | --- |
| `index.html` | the entire site — markup, styles, scripts | ✅ real |
| `manifest.json` | PWA manifest | ✅ real |
| `favicon.svg` | favicon | ✅ real |
| `apple-touch-icon.svg` | iOS home-screen icon | ⚠️ declared `"purpose": "monochrome"` in the manifest, which permits the browser to recolour it. Looks unintended. |
| `icon-512.svg` | vector app icon | ✅ real |
| `icon-maskable.svg` | Android maskable icon | ✅ real |
| `icon-192.png` | PWA icon | 🔴 on `main` this is a **cartoon plumber mascot**, and it is actually 512×512 while the manifest declares it 192×192. Violates the no-mascots rule in `AGENTS.md`. **Fixed in #11.** |
| `icon-512.png` | PWA icon | ⚠️ correct art since #2, but **not referenced by `manifest.json` at all** on `main`. **Wired up in #11.** |

### Imagery on the page

- **`<img>` elements: 0.** There is not a single raster image on the page.
- **Inline `<svg>` elements: 27.** All icons and the brand mark are inline
  vector, drawn in the HTML.
- **No photographs of OTTO, its team, its vans, or its work exist anywhere on
  the site.**

### External resources

| Resource | Status |
| --- | --- |
| `fonts.googleapis.com` stylesheet (Newsreader + Inter) | ✅ real third-party dependency |
| `fonts.googleapis.com` preconnect | ✅ |
| `fonts.gstatic.com` preconnect | ✅ |

The page makes no other outbound requests. No analytics, no tag manager, no
tracking pixels, no chat widget.

---

## 5. Placeholder and unverified content — the list that needs the owner

### 🔴 Placeholder

| Item | Why |
| --- | --- |
| **The entire Portfolio section** | A section titled "Portfolio" with **no photographs of any work**. It is four cards with generic stock icons and generic copy ("From kitchen remodels to bathroom upgrades, we handle it all"). It shows nothing OTTO has actually done. Either supply real job photos or the section is arguably worse than not having it. |
| **Contact form delivery** | No Formspree endpoint. See §3. |
| **Instagram** | Removed rather than left pointing at a placeholder. If OTTO has a real handle, it can go back. |

### ⚠️ Unverified business claims

These appear on the live site as statements of fact. Only the first is backed by
the canonical brand facts in `AGENTS.md`. **I did not write any of them — they
pre-date this work — but none of the last three has a source I can find, and
they are the kind of claim a licensed trade should be able to stand behind.**

| Claim | Appears | Backed by? |
| --- | --- | --- |
| **30+** years / founded 1996 | hero + trust bar | ✅ yes, in `AGENTS.md` |
| **5,000+** jobs completed on time | hero + trust bar | ⚠️ no source |
| **5.0 ★** average customer rating | hero + trust bar | ⚠️ no source. This is a **review claim** — if there is no review platform showing 5.0, it should come down. |
| **24 h** most jobs scheduled within a day | hero + trust bar | ⚠️ no source |
| "Same-day response" | Why OTTO | ⚠️ no source |
| "30 Years of Mastery" / "Founded in 1996" | Mastery | ✅ consistent with `AGENTS.md` |
| "We diagnose with advanced telemetry before a wrench is turned" | Mastery | ⚠️ describes a capability — confirm it is true |
| "Technicians arrive in pristine uniforms with protective floor covering" | Mastery | ⚠️ describes a service standard — confirm it is true |

### ✅ Verified real

- Phone **(786) 344-2837**, `tel:+17863442837` — 7 links, correct format.
- Licence **#CFC1429613** — footer, both languages.
- Hours **Mon–Sat 7 AM – 7 PM** — contact card and CTA band.
- Service area **South Florida**.
- Email **hernandezotto77@gmail.com** — used only as the form's fallback in #10;
  it is not displayed as a contact method anywhere on the page.

---

## 6. Summary of what is broken or missing

1. **The contact form cannot deliver anything.** Needs a Formspree endpoint.
2. **No photographs of real work** anywhere, and a Portfolio section that
   implies there are.
3. **Three or four unverified statistics** presented as fact, including a 5.0
   star rating.
4. **The install icon on `main` is a cartoon mascot** — fixed in #11.
5. **The Spanish toggle is two-thirds done** and reverts to English partway down
   the page — see `docs/SPANISH-PLAN.md`.
6. **CI has never passed.** GitHub Actions is not assigning runners for this
   repository; every run in its history, including on `main`, fails in seconds
   with `runner_id: 0` and no logs. Needs an account-level Actions billing
   check. This means nothing merged so far was machine-verified.
