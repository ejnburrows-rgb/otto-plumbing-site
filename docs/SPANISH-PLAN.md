# Spanish version — plan only

**Nothing is translated in this document, and nothing was translated in this
branch.** Translation of customer-facing marketing copy is E N's call. This is
the inventory and the recommendation, so that when you say go, the work is
mechanical.

Measured against `index.html` at commit on `main`, by walking the rendered page
in a browser rather than reading the source, so nothing hidden behind a
collapsed menu was missed.

---

## The headline finding

The site **already has** a working EN/ES toggle and a Spanish dictionary
covering **67 strings**. It is roughly two thirds finished, and nobody has said
so out loud.

But **50 further visible strings have no translation key at all**. The Portfolio
and Mastery sections — two full sections, about a third of the page's body copy
— are **entirely English-only**. A Spanish-speaking customer who presses **ES**
today gets a page that switches the navigation, hero, services, why, contact and
footer to Spanish and then drops back into English halfway down.

That is worse than having no toggle at all, because it looks broken rather than
unfinished.

---

## Full string inventory

### A. Already translated — 67 strings, no work needed

Everything carrying a `data-i18n` attribute, held in the `translations` object
in `index.html`. Covers: navigation, hero, the four trust-bar labels, all six
service cards, the "Why OTTO" list, contact card, the whole contact form
including its three placeholders, the CTA band, and the footer copyright.

These need **review**, not translation — see "What to check in the existing
Spanish" below.

### B. Visible copy with no key — 26 unique strings

This is the actual translation job.

| # | Section | String |
| --- | --- | --- |
| 1 | skip link | Skip to main content |
| 2 | navbar | South Florida *(the small line under the wordmark)* |
| 3 | nav + mobile menu | Portfolio *(one key, used twice)* |
| 4 | nav + mobile menu | Mastery *(one key, used twice)* |
| 5 | hero chip | Emergency response |
| 6 | hero chip | We answer the call, day or night |
| 7 | portfolio | Our Work |
| 8 | portfolio | Portfolio *(section heading)* |
| 9 | portfolio | From residential repairs to commercial installations, see the quality… |
| 10 | portfolio | Residential Projects |
| 11 | portfolio | From kitchen remodels to bathroom upgrades, we handle it all. |
| 12 | portfolio | Commercial Installations |
| 13 | portfolio | Full-service plumbing for businesses and multi-family properties. |
| 14 | portfolio | Restoration Services |
| 15 | portfolio | Emergency water damage restoration and plumbing repairs. |
| 16 | portfolio | Fixture Upgrades |
| 17 | portfolio | High-end faucets, valves, and plumbing fixtures installation. |
| 18 | mastery | Mastery *(kicker)* |
| 19 | mastery | 30 Years of Mastery. |
| 20 | mastery | Founded in 1996, OTTO Plumbing began with a simple premise… |
| 21 | mastery | The OTTO Standard |
| 22 | mastery | We diagnose with advanced telemetry before a wrench is turned. |
| 23 | mastery | White-Glove Service |
| 24 | mastery | Technicians arrive in pristine uniforms with protective floor covering… |
| 25 | mastery | Precision Scheduling |
| 26 | mastery | We communicate clearly and arrive on time, every time. |

### C. Accessibility and metadata strings — 7

Invisible on screen but read aloud by screen readers or shown by Google. Easy to
forget; a Spanish screen-reader user hits every one of these.

| # | Where | String |
| --- | --- | --- |
| 27 | `<meta name="description">` | Licensed, insured plumbing for South Florida homes and businesses… |
| 28 | brand link `aria-label` | OTTO Plumbing, back to top |
| 29 | primary nav `aria-label` | Primary |
| 30 | language group `aria-label` | Choose language |
| 31 | theme button `aria-label` | Toggle dark mode |
| 32 | menu button `aria-label` | Open menu / Close menu |
| 33 | mobile nav `aria-label` | Mobile |

The `<title>` is already switched in `setLang()` and needs no new key.

### D. Deliberately NOT translated

Listed so nobody "helpfully" translates them later.

- **OTTO**, **OTTO Plumbing**, **OTTO Plumbing Inc.** — brand name, always caps,
  never translated.
- **(786) 344-2837** — appears 7 times.
- **License #CFC1429613** — the word "License" is already handled inside the
  translated footer string; the number never changes.
- **30+**, **5,000+**, **5.0 ★**, **24 h**, **01**–**04** — numerals.
- **EN** / **ES** — the language buttons themselves.

### Totals

| | Count |
| --- | --- |
| Already translated | 67 |
| New keys needed — visible copy | 26 |
| New keys needed — a11y + metadata | 7 |
| **New keys total** | **33** |
| Not translated by design | 13 |

---

## Recommendation: keep the in-page toggle. Do not build a separate page.

### Why

1. **It is already built and already two-thirds populated.** A separate `/es/`
   page throws away 67 working translations and the toggle UI. Finishing the
   toggle is 33 keys in one dictionary; a second page is a second copy of a
   1,300-line file.

2. **There is no build step.** `README.md` and `AGENTS.md` are explicit that this
   is plain HTML with no pipeline. Two pages means every future edit — a new
   phone number, a new service, a price — has to be made twice by hand, forever.
   That is precisely the setup where the two copies silently drift apart, and
   the Spanish one rots. For a business whose brand facts are legally
   significant (a licence number, a service area), two drifting copies is a real
   risk, not a tidiness complaint.

3. **The switch already persists.** `localStorage` under the key `otto-lang`,
   with the choice re-applied on load. A returning Spanish-speaking customer
   stays in Spanish.

4. **The cost of the toggle's main weakness is low here.** See below.

### The honest trade-off

A single URL can only rank once. With an in-page toggle, Google indexes one
page, and it will be the English one — so "plomero Miami" style searches will
not find a distinct Spanish page. Separate `/es/` URLs with `hreflang` tags are
the textbook answer for multilingual SEO, and if Spanish-language **search**
traffic is a business goal, that is the correct build.

I am still recommending the toggle because for this business most arrivals are
already on the phone and most come from Maps, referrals and paid local listings
rather than organic Spanish search. The toggle serves the customer who is
already looking at the page, which is the common case here.

**The one thing that would flip this recommendation:** if you want to
rank in Spanish-language Google results. Say so and the plan becomes two
pages, and it should then be done properly with `hreflang` and a real
`/es/` URL rather than a toggle. That is a bigger job and worth scoping
separately.

---

## What to check in the existing Spanish before shipping any of this

The 67 existing strings were not written by a native speaker as far as I can
tell, and I have not verified them. Before the toggle is promoted anywhere,
someone who speaks Miami Spanish should read them. Specific things to look at:

- **"Por qué OTTO"** as the section kicker — reads fine, but confirm.
- **Formal vs informal address.** The existing copy uses *usted* forms
  ("Llámenos", "su mensaje", "puede llamarnos"). That is the right register for
  a trades business, but it must be consistent across all 100 strings once the
  new ones are added. Mixing *usted* and *tú* is the most common tell of
  machine translation.
- **"plomería" vs "fontanería".** The page uses *plomería*, which is correct for
  Miami and Latin America. *Fontanería* is the Spain term. Keep *plomería*.
- **Three failure-state strings** added in the contact-path work (`form.errTitle`,
  `form.errBody`, `form.errMail`) were written by me and are explicitly flagged
  there for your review.

---

## Suggested order of work, once approved

1. Add the 33 keys to **both** the `en` and `es` blocks of `translations`, with
   the English text in both, and wire the `data-i18n` attributes. This is
   mechanical, changes nothing visually, and can ship on its own.
2. Have a native speaker produce the 33 Spanish strings and review the existing
   67 in one pass.
3. Paste the Spanish in. No structural change needed.
4. Translate the `aria-label` and `meta description` strings — these need a
   small amount of JS, since `setLang()` currently only handles text content,
   placeholders and the title.

Step 1 is safe to do at any time and makes the eventual translation a
copy-paste. Steps 2 and 3 wait on E N.
