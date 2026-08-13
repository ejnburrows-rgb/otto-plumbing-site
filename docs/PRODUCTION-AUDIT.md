# OTTO Plumbing — production audit & UI/UX improvement handoff

Inspection date: 2026-08-12 · Production: https://otto-plumbing-site.vercel.app/
No site code was changed. This document is the only file added.

---

## Requested

A hands-on inspection of the live OTTO Plumbing website — what works, what is
broken, what is unfinished, what looks weak — plus a creative UI/UX assessment
and the shortest path from the current site to a polished production website.

### How this was inspected (method, and one honest limitation)

The sandbox browser used for this audit has no outbound HTTPS — every host,
including `example.com`, fails with `ERR_CONNECTION_RESET`. Command-line HTTPS
works. So production was inspected in two layers:

1. **Directly over the network.** Headers, status codes, byte payloads,
   response timings, and every served asset were fetched from the live host.
2. **In a real browser, against a byte-verified replica.** Every asset the live
   page loads was downloaded and its SHA-256 compared against the replica the
   browser was pointed at. All 18 assets match byte-for-byte, and the two
   external assets (Google Fonts, the header logo) were downloaded from their
   real origins and replayed. Rendering, DOM, layout, and interaction evidence
   therefore reflect the live payload exactly.

The one thing this cannot produce is production **field** performance data.
Lab numbers below are labelled as such.

---

## Current Production State

The live site is a single-page, no-build static site. It loads fast, renders
cleanly at phone, tablet, and desktop widths, has no console errors, no failed
same-origin requests, no layout shift, and one clear job: get the visitor to
call **(786) 344-2837**. That job it does — the phone number appears seven
times and every call/text link is correct.

Everything else about it is either unfinished or advertised but non-functional.

**Production is not serving `main`, and it is not serving the current branch
either.** The live `index.html` is byte-identical to commit `8e8e169`
("Publish final OTTO Plumbing website facelift"), which is **10 commits behind**
the tip of `claude/otto-plumbing-audit-4rbs63` and is **not an ancestor of
`main`**. For its part, `main`'s `index.html` is a different, older document
that still begins with a stray build comment before the doctype:

```
<!-- Kilo wiring complete - MCP servers configured in .vscode/mcp.json -->
<!DOCTYPE html>
```

So the incident recorded in `docs/DEPLOYMENT-MISMATCH.md` is still live, in a
new shape: production is now *ahead* of `main` rather than behind it.

**The served asset set is also internally inconsistent** — it comes from at
least two different builds:

| Asset | `last-modified` | Content matches |
|---|---|---|
| `meeting-polish.css` | Tue, 11 Aug 2026 **16:43:13** | commit `7888d46` and newer |
| `index.html` | Tue, 11 Aug 2026 **17:42:50** | commit `8e8e169` only |
| `prestige.js`, `shell.css`, `intake-config.js` | Tue, 11 Aug 2026 **17:42:50** | commit `8e8e169` |

The HTML from one build is being styled by CSS from another. No asset filename
carries a content hash, and every file is served
`cache-control: public, max-age=0, must-revalidate`, so this mismatch class is
structural rather than a one-off.

`/version.json` — the file `docs/DEPLOYMENT-MISMATCH.md` designates as the
deployment proof — resolves but reports
`releaseMarker: final-delivery-site-cleanup-2026-08-10`, older than the HTML
beside it. `logo.jpg`, `robots.txt`, `sitemap.xml`, and `release.json` all 404.

The Vercel project settings could **not** be read directly — the connected
account's API access does not expose this project (its only listed project is
an unrelated one, and a deployment lookup for the hostname returns
`not_found`). But the pull request opened alongside this audit produced enough
evidence to narrow the problem considerably:

- The project is **`otto-plumbing-site`** (`prj_e3XUAppseApwOPcvmcSO1FmTk4bU`)
  in team `ejns-projects-1b938dd2`.
- **The GitHub↔Vercel connection works.** Vercel built a preview from the audit
  branch within seconds of the push and reported Ready.
- **The preview serves the branch content exactly.** The preview's
  `index.html` is byte-identical to the branch tip apart from Vercel's own
  preview-only feedback script, and `logo.jpg`, `production-polish.css`, and
  `whatsapp.js` — all of which 404 on production — resolve on the preview.

So Vercel is not disconnected and the build is not broken. **The fault is
confined to what the production alias points at** — the production branch
setting, or an alias bound to a deployment that is no longer produced by the
`main` branch. That is a dashboard setting, and it is the one thing the owner
has to check. See *Best Next Action*.

---

## Confirmed Working

Directly verified on the live payload:

- **Deployment and page load.** HTTP 200, HTML 35,971 bytes, HSTS present.
  Real-network TTFB across three runs: 561ms, 562ms, 239ms.
- **Zero console errors, zero page errors, zero failed same-origin requests,
  zero 4xx/5xx sub-resources** at 390 / 820 / 1440px.
- **No horizontal overflow** at any of the three widths. The only off-canvas
  elements are the intentionally off-screen honeypot field.
- **Call and text links.** Every `tel:+17863442837` and `sms:+17863442837`
  href is correct and present in the header, hero, contact card, and CTA band.
- **Bilingual switching.** EN→ES swaps the `<html lang>`, the `<h1>`, the
  `<title>`, and the body copy including the form labels and placeholders.
- **Form validation and anti-spam.** Required-field validation, honeypot,
  minimum fill time, in-flight double-submit lock, and duplicate fingerprint
  all behave as documented in `docs/INTAKE-SETUP.md`.
- **The form never fakes success.** A submit with valid data produces
  `This request has not been sent. Please call or text (786) 344-2837.` in
  error styling, keeps the customer's typed data, and surfaces call/text
  fallbacks. This is the correct behaviour and it is worth protecting.
- **Skip link, single `<h1>`, and focus rings on links and buttons** (3px).
- **Mobile menu drawer** opens and closes and contains the section links plus
  call and text actions.
- **Lab performance** (local replica, 390px, throttling off): CLS **0**,
  LCP **120ms**, 15 requests, 135KB decoded.

---

## Confirmed Bugs

Bugs 1–7 are **live on production now**. Bugs 8–14 exist only on the current
branch and would ship the moment it is deployed.

---

### 1. Business section shows mislabelled facts, and the phone number vanishes

**Priority:** P2
**Area:** Content / "A local plumbing company you can verify." section
**Reproduction:** Load production, scroll to the business section.
**Expected:** `Company → OTTO Plumbing Inc.`, `Direct line → (786) 344-2837`.
**Actual:** `Company → Since 1996`, `Direct line → 30+ years`. The phone number
does not appear in this grid at all.
**Root cause:** Two copy layers own the same nodes. `facelift.js`
`applyBusinessValues()` writes six values positionally into
`#business .reason-grid .tile p`:

```js
en: ['Since 1996', '30+ years', 'CFC1429613', 'Mon–Sat · 7 AM–7 PM', 'South Florida', PHONE]
```

paired with its own labels `['Established','Experience','License',…]`. Then
`prestige.js` loads afterwards and rewrites only the **labels** through the
`translations` object — `biz1Title:'Company'`, `biz2Title:'Direct line'`,
`biz3Title:'Florida license'` — without rewriting the corresponding values.
Tiles 4–6 survive because `prestige.js` also supplies `biz4Body`/`biz5Body`/
`biz6Body`; tiles 1–3 keep the old values under new labels.
**Recommended fix:** One copy layer owns this section. Delete
`applyBusinessValues()` from `facelift.js` and move the six values into
`prestige.js` as `biz1Body`…`biz6Body` alongside the titles they belong to.
**Evidence:** Rendered heading/value pairs captured from the live payload:
`COMPANY / Since 1996`, `DIRECT LINE / 30+ years`, `FLORIDA LICENSE /
CFC1429613`, `ESTABLISHED / Serving customers since 1996.`, `SERVICE /
Residential and commercial plumbing.`, `AVAILABILITY / Monday–Saturday · 7 AM–7 PM`.

---

### 2. The form's primary button promises an action it does not perform

**Priority:** P2
**Area:** Service request form
**Reproduction:** Fill name, phone, service, and details. Wait past the
minimum fill time. Press the primary button, which reads **"Prepare email
request"**.
**Expected:** An email is prepared, or the button does not offer to prepare one.
**Actual:** No email is prepared. No network request of any kind is made. The
status line reads "This request has not been sent. Please call or text
(786) 344-2837." The pre-filled-email link stays hidden because
`intake-config.js` has `fallbackEmail: ''`, so `intake.js` sets
`els.mailto.hidden = true`.
**Root cause:** The button label is chosen for the email-fallback path while
the email fallback is switched off. The label and the configuration disagree.
**Recommended fix:** While `endpoint` and `fallbackEmail` are both empty, the
button should read "Call (786) 344-2837" and act as the call link, or the form
should be replaced by the call/text block entirely. Restore "Send request" the
moment an endpoint is configured.
**Evidence:** Post-submit DOM state — `submitLabel: "Prepare email request"`,
`status: "This request has not been sent…"`, `statusClass: "intake-status
is-error"`, `POSTs made: NONE`, `mailto: {visible: false, hidden: true}`.

---

### 3. The header logo is served from a third-party host, from a different repo

**Priority:** P2
**Area:** Branding / availability
**Reproduction:** Inspect the header `<img>` src on production.
**Expected:** The site's own `logo.jpg`.
**Actual:** `prestige.js` sets
`CRM_LOGO = 'https://raw.githubusercontent.com/ejnburrows-rgb/otto/main/logo.jpg'`
and rewrites the header image to it on every load.
**Root cause:** The logo was referenced cross-origin before it was committed to
this repository. Production's build predates the local `logo.jpg`, which 404s
on the live host.
**Impact:** The most important brand element on the page depends on a host
GitHub explicitly does not offer as a CDN — it is rate-limited, uncached, and
carries no availability guarantee. It also points at a *different* repository
(`ejnburrows-rgb/otto`), so a rename or a visibility change there blanks the
OTTO header. The file returns HTTP 200 today (79,651 bytes, 1024×1024), so this
is a live risk, not a live outage.
**Recommended fix:** Ship `logo.jpg` with the deployment and set
`CRM_LOGO = 'logo.jpg'` — already done on the branch. Better still, replace the
raster with an SVG wordmark (see *Images and assets*).
**Evidence:** `curl` of the raw URL returns 200; `curl` of
`https://otto-plumbing-site.vercel.app/logo.jpg` returns 404.

---

### 4. Dark mode is advertised, half-applied, and unreachable

**Priority:** P3
**Area:** Theming / accessibility
**Reproduction:** (a) Look for the theme toggle in the header. (b) Load the
site with the OS set to dark mode.
**Expected:** Either a working dark theme or no claim of one.
**Actual:** (a) `#themeToggle` exists in the DOM with
`aria-label="Toggle theme"` but computes to `display: none` — the toggle cannot
be reached by mouse, touch, or keyboard. (b) Under `prefers-color-scheme: dark`,
`shell.js` *does* set `data-theme="dark"` on `<html>`, but the page still
renders `background: rgb(255, 255, 255)` with dark navy text, because the five
stylesheets loaded after the inline `<style>` hard-code light surfaces and
never define dark variants. Meanwhile
`<meta name="color-scheme" content="light dark">` tells the browser the page
supports dark, which is how form controls and scrollbars get told to render
dark against a permanently light page.
**Root cause:** The dark palette lives only in the inline `<style>` as
`html[data-theme="dark"]` variables. Every later stylesheet overrides those
variables with literal light colours.
**Recommended fix:** Pick one. Either drop the dark palette, the `data-theme`
logic, and the `color-scheme` meta entirely (recommended for this site), or
define the dark surfaces in the same stylesheet that defines the light ones.
**Evidence:** With `colorScheme: 'dark'`: `{dataTheme: "dark", bodyBg:
"rgb(255, 255, 255)", bodyColor: "rgb(23, 50, 77)", metaColorScheme:
"light dark"}`.

---

### 5. Form fields have no visible focus indicator

**Priority:** P2
**Area:** Accessibility (WCAG 2.4.7 Focus Visible, Level AA)
**Reproduction:** Tab into the service request form.
**Expected:** A visible focus indicator on each field.
**Actual:** Every input, select, and textarea computes to
`outline-width: 0px` with no box-shadow and no border change. Links and buttons
correctly show a 3px outline, so the omission is confined to form controls —
exactly the place a keyboard user needs it most.
**Root cause:** A scoped `.intake-field` rule removes the outline set by the
global `:focus-visible` rule without substituting anything.
**Recommended fix:** Add `outline: 3px solid var(--ring); outline-offset: 2px;`
to `.intake-field :is(input, select, textarea):focus-visible`.
**Evidence:** `#intakeName` focused → `{outline: "rgb(23, 50, 77) none 0px",
outlineWidth: "0px", boxShadow: "oklab(0 0 0 / 0) 0px 0px 0px 0px",
borderColor: "rgb(207, 219, 229)"}` — identical on production and branch.

---

### 6. The persistent mobile dock holds "Back to top" where the call button belongs

**Priority:** P3
**Area:** Mobile conversion
**Reproduction:** Load on a phone. Note the header. Scroll past ~1.2 screens.
**Expected:** The call action is always one tap away.
**Actual:** `.nav-actions .call-btn` computes to `display: none` at mobile
widths — the header offers only Menu and EN/ES. The fixed bottom dock that
*could* hold a call action instead surfaces `↑ Back to top` and
`← Back to where you were / Dismiss`. On a 390×844 screen the "Back to top"
pill sits at y=786 and visually covers the form's own submit button when the
form is in view.
**Recommended fix:** Replace the bottom dock's default content on mobile with a
two-up **Call · Text** bar, and demote "Back to top" into the footer, where it
already exists.
**Evidence:** `navCall: {display: "none", visible: false}` at 390px on both
builds; dock rect `[12, 786, 366, 46]` after scrolling; screenshot shows the
pill overlapping "Prepare email request".

---

### 7. Marketing sections can be collapsed by the visitor

**Priority:** P3
**Area:** Interaction model
**Actual:** `#shellToggle-services` and `#shellToggle-business` render a
`– Minimize` control on the Services and Business sections, letting a visitor
collapse the content the page exists to show. They also occupy two of the first
twelve tab stops.
**Recommended fix:** Remove. An accordion is right for an FAQ; it is not right
for a six-item service list a customer is scanning to find their problem.

---

### 8. BRANCH ONLY — the mobile call CTA falls below the fold

**Priority:** P1 if deployed
**Reproduction:** 390×844 viewport, branch tip.
**Expected:** The call action is visible without scrolling, as it is today.
**Actual:** The hero's primary CTA sits at **y=850 in an 844px viewport** —
entirely off-screen. On production the same button sits at **y=563**.
**Root cause:** Three additions stack up above it: the nav band grows from 69px
to 124px, the `30+ YEARS / SERVING SOUTH FLORIDA` banner is inserted, the H1
grows from 254px to 355px tall (from "Trusted plumbing for South Florida homes
and businesses." to "Trusted residential and commercial plumbing across South
Florida."), and a pull-quote is added beneath the lead.
**Recommended fix:** Shorten the H1 to three lines on mobile, move the
pull-quote out of the hero, and reduce the mobile nav band. Verify the CTA
lands above 700px at 390×844 before merging.
**Evidence:** `primaryCta: {top: 850}` branch vs `{top: 563}` production.
Desktop regresses too — 907px in a 900px viewport, vs 668px on production.

---

### 9. BRANCH ONLY — the English/Spanish switcher disappears on a 390px phone

**Priority:** P1 if deployed
**Area:** Bilingual access
**Actual:** `production-polish.css` contains
`@media (max-width: 390px) { .nav-actions .toggle-group { display: none !important; } }`.
At exactly 390px — the width of an iPhone 12/13/14/15 — the EN/ES control is
gone, and it is not reproduced in the mobile drawer. A Spanish-speaking
customer on the most common iPhone width has no way to switch languages.
**Recommended fix:** Never hide the language switcher. If the header is tight,
move it into the drawer as well, and keep it in the footer.
**Evidence:** Visible buttons at 390px, production: `EN`, `ES` present.
Branch: absent (only the WhatsApp `English`/`Español` pair remains, which
controls the WhatsApp message language, not the site).

---

### 10. BRANCH ONLY — the sticky header stops sticking

**Priority:** P2 if deployed
**Actual:** `production-polish.css` line 5 sets `.nav { position: relative; }`,
overriding the `position: sticky` in the inline `<style>`. Computed
`navPosition` is `"sticky"` on production and `"relative"` on the branch. The
header also grows to **205px** on desktop and **124px** on mobile, and
`.nav-links { display: none !important }` hides the primary navigation on every
screen under 980px.
**Net effect:** the header scrolls away and never comes back, so from the
services section onward there is no persistent navigation and no persistent
call button anywhere on the page.
**Recommended fix:** Restore `position: sticky`, shrink the band, and let the
header compress on scroll rather than removing it.

---

### 11. BRANCH ONLY — an internal setup notice renders to customers

**Priority:** P2 if deployed
**Actual:** The Contact section's WhatsApp card displays, in the live page:
*"The business WhatsApp number must be confirmed before this link can be
activated."* This fires because `whatsapp.js` finds no
`config.whatsappNumber` and shows its "missing" state.
**Recommended fix:** Render the WhatsApp card only when a number is configured.
An unfinished feature should be invisible, not explained to the customer.

---

### 12. BRANCH ONLY — third-party trust claims are partly unsupported, and one links leads to a competitor

**Priority:** P2 if deployed
**Area:** Trust / credibility claims

Verified against the live sources:

| Claim | Status |
|---|---|
| BuildZoom "Score 110" | **Confirmed** — page reads "BZ SCORE: 110" |
| BuildZoom "Top 4%" | **Confirmed** — "ranks in the top 4% of 191,428 Florida licensed contractors" |
| "175 permitted projects" | **Confirmed** — "has worked on 175 permitted projects" |
| "a July 2026 license verification" | **Not supported.** The page reads `Updated: Aug 04, 2026` and explicitly labels the licence **"License Not Verified"** |
| BBB "A+ rating" | **Could not verify** — bbb.org returns HTTP 403 to non-browser clients. Owner must confirm |

Two further problems with the BuildZoom card, independent of accuracy:

- The BuildZoom profile lists **a different phone number, (407) 349-3763**, a
  different address, and an owner name. Sending a customer there to "verify"
  hands them a competing contact route for OTTO.
- BuildZoom's page CTA is *"request a quote" / "we'll also connect you with
  other vetted professionals"* — it is a lead marketplace. The verification
  link can route an OTTO lead to OTTO's competitors.

**Recommended fix:** Drop the "July 2026 license verification" sentence. Do not
publish the BBB rating until the owner confirms it. Keep BuildZoom's numbers if
wanted, but cite them as text without an outbound link, or link with a clear
"third-party listing" label.

---

### 13. BRANCH ONLY — the licence "Verify source" link verifies nothing

**Priority:** P2 if deployed
**Reproduction:** Follow the DBPR credential card's link.
**Expected:** OTTO's licence record.
**Actual:** `myfloridalicense.com/wl11.asp?mode=0&search=LicNbr&licnbr=CFC1429613`
returns the generic **"Licensee Search Options"** form. The returned page
contains **zero** occurrences of `CFC1429613` or `OTTO` — DBPR's search needs a
session/POST and does not accept a deep link in this form.
**Impact:** The single most valuable trust element on the page — one-click
verification of a real Florida licence — silently does nothing.
**Recommended fix:** Link to the DBPR licensee search landing page with the
licence number displayed next to it and an instruction to paste it, or drop the
link and present the number as verifiable text.

---

### 14. BRANCH ONLY — a scheduled workflow pushes to `main` every five minutes

**Priority:** P2
**Area:** Release process / repo safety
**Actual:** `.github/workflows/production-release-trigger.yml` is present at the
branch tip:

```yaml
on:
  schedule:
    - cron: "*/5 * * * *"
permissions:
  contents: write
...
    git rm .github/workflows/production-release-trigger.yml
    git commit -m "Trigger production hosting release"
    git push origin main
```

It is meant to be self-deleting, but it is **not** self-deleting — it is
firing right now and failing every time. The workflow-run history shows it
triggering roughly hourly and failing on every attempt:

```
2026-08-12T11:33:59Z  schedule  main  failure  bf1a76b6
2026-08-12T10:45:53Z  schedule  main  failure  bf1a76b6
2026-08-12T09:50:23Z  schedule  main  failure  bf1a76b6
2026-08-12T08:51:01Z  schedule  main  failure  bf1a76b6
… eight consecutive failures in the twelve hours before this audit
```

The likely reason it cannot clean itself up: the job checks out `ref: main`,
and the workflow file does not exist on `main` — it exists only on this branch
— so `git rm` fails before the commit and push can run. The job therefore
never removes its own trigger and will keep firing indefinitely, burning
Actions minutes on a permanently red workflow. The commit history shows it did
succeed at least once (`dcb8cea Trigger verified production hosting release`),
which is how a commit reached `main` without a pull request.
**Recommended fix:** Delete the file from the branch. Deployment should be
triggered by Vercel watching `main`, not by a cron job that rewrites `main`.

---

## Visual / UI Problems

**The single biggest problem is that there is not one photograph on the entire
website.** Every section is text in a bordered box on white. A plumbing company
with 30 years of work and 175 permitted projects is presenting itself with
less visual evidence than a landing-page template. This — more than spacing,
type, or colour — is why the site reads as generic.

**Hierarchy.** The page has one rhythm and repeats it five times: heading,
lead paragraph, grid of bordered tiles. Hero facts (3 tiles), hero info cards
(3), services (6), business facts (6), contact rows (3). Twenty-one boxes,
almost all the same width, weight, and border. Nothing on the page tells the
eye what matters most after the H1.

**Proportions.** The hero is a rounded card floating on a light background,
inset from every edge — it reads as a dashboard widget rather than a brand
statement. Its right column is a light panel bolted to a blue left panel with a
hard vertical seam and no shared logic; the two halves look like different
designs. The "WHY CUSTOMERS CALL OTTO" badge is cream/gold on that panel — the
only warm colour anywhere in an otherwise blue/navy/white palette.

**Typography.** Newsreader is loaded and paid for but is used for almost
nothing — the H1, H2s, and body are all Inter. The one place the serif appears
on the branch is the hero pull-quote. Either commit to the serif for display
type or stop loading it. The mobile H1 at 50.7px runs to five lines on
production and seven on the branch; that is a headline losing an argument with
the viewport.

**Imagery and icons.** No icon set at all — service tiles are numbered `01`–`06`
in small blue type. The only image is the logo: a 1024×1024 (production) /
1536×1536 (branch) metallic-effect JPEG rendered at 34px tall in the production
header, where the wordmark is illegible. On the branch it renders at 96–184px
on a `#0b1222` band chosen to match the logo's own dark background — a dark
metallic mark on a near-black bar, which reads as low-contrast and muddy rather
than premium.

**Navigation.** Production's header is competent and sticky. The branch replaces
it with a 205px navy band that does not stick and drops the nav links entirely
below 980px. That is a step backwards on every axis.

**Responsiveness.** Genuinely solid — no overflow, no broken layouts at 390 /
820 / 1440. The failures are compositional (what is above the fold), not
structural.

**Interaction.** Almost nothing responds. Credential cards lift 3px on hover;
nav links have an underline sweep. There are no reveals, no state changes, no
progressive disclosure. The two interactive affordances that *do* exist —
"Minimize" and "Back to where you were" — are borrowed from application UI and
serve no customer need.

**Design system consistency.** This is the structural cause of most of the
above. Six stylesheets are stacked, each overriding the last:

| Selector | facelift | prestige | prestige-polish | meeting-polish | production-polish |
|---|---|---|---|---|---|
| `.hero*` | 7 | 11 | 16 | 6 | 0 |
| `.section-card` | 8 | 5 | 4 | 5 | 0 |
| `.nav` | 1 | 1 | 1 | 0 | 1 |

`.hero` and its children are redefined **40 times across four files**.
`production-polish.css` needs **28 `!important` declarations** to win. There is
no source of truth for any value, which is precisely how the sticky header got
switched off and the language toggle got hidden without anyone noticing.

---

## Recommended UI Evolution

Not a redesign. Four specific moves, in order of impact.

**1. Put real photography in three places.** This is the whole difference
between "template with plumbing text in it" and "established plumbing company."
Nothing else on this list matters as much.
- *Hero right half:* one strong horizontal photograph — the OTTO van, a
  technician on a job, or a finished install — replacing the three info cards.
  The license/hours/established strip stays beneath the headline.
- *Services:* one photograph per service group (see move 3).
- *Proof strip:* four to six real job photographs in a horizontal rail between
  Services and Contact.
Required from the owner — do not substitute stock imagery. Stock plumbing
photos are recognisable and would actively damage the credibility this section
is meant to build.

**2. Collapse six stylesheets into one.** Merge `facelift`, `prestige`,
`prestige-polish`, `meeting-polish`, and `production-polish` into a single
`otto.css` with a token block at the top (colour, spacing scale, radius, type
scale, one shadow, one transition duration). Delete all 32 `!important`
declarations, which exist only to fight the stack. This is mechanical, testable
against the current rendering, and it is the prerequisite for every other
change being safe.

**3. Replace six identical service tiles with three image-led panels.** Group
the real services as they are, without inventing any: **Leaks, drains & sewer**
· **Water heaters & fixtures** · **Remodel & commercial**. Each panel is a
photograph with a heading and one line, tapping/clicking to expand the specific
items underneath (leak repair, stoppages, heater replacement, fixture updates,
remodel support, general service calls). This gives the page visual variety, cuts
21 boxes to a manageable number, and answers "do they handle my problem?"
faster than a flat list.

**4. Rebuild the header, and make one identity decision.** Light header,
sticky, compressing from ~76px to ~60px on scroll. Logo as an **SVG wordmark**,
not a 142KB metallic JPEG — the current mark is unreadable at header size and
cannot be recoloured. Header holds: logo · Services / About / Contact ·
EN/ES · **Call (786) 344-2837** as a filled button that is present at every
width. The "match the header colour to the logo's own background" approach on
the branch should be abandoned; fix the asset instead of building the site
around its background.

Beyond these: drop the cream badge, use Newsreader for H1/H2 or remove it, and
remove the "Minimize" controls.

---

## Recommended Scroll Experience

**Recommendation: build the full-screen → contract → next-page-expands effect
for exactly one transition, hero → services, and leave every other section
conventional. Desktop only.**

The reasoning matters more than the technique. This is a four-screen local
service page whose success metric is a phone call within about fifteen seconds
of landing. A site-wide pinned-section system adds scroll distance between the
visitor and the phone number on every single section boundary. One signature
moment gives the page the sense of craft you are after; five of them would make
OTTO harder to hire.

**How it should behave.** The hero occupies the full viewport. As the visitor
begins to scroll, the hero stays pinned and contracts — scaling to about 0.92,
gaining a 24px radius, dimming slightly — while the Services section rises into
place beneath it and settles at full size. The handoff completes within roughly
one viewport of scrolling, after which the page scrolls normally to the end.
Scrolling back up reverses it exactly, because the effect is a pure function of
scroll position with no state of its own.

**Which sections use it.** Hero → Services only. Services, Business/Trust,
Contact, the form, and the CTA band all stay in normal flow. The form
especially must never sit inside a pinned container — pinning plus soft
keyboards plus scroll-into-view on validation errors is a reliable way to trap
a customer mid-request.

**Desktop.** As described, at ≥1024px with a fine pointer.

**Mobile and tablet.** Disabled entirely below 1024px, and disabled for any
coarse pointer. Phones get the plain document with the call button at the top.
This is not a degraded experience — it is the better one, and it removes the
whole class of iOS sticky-plus-transform repaint bugs.

**Reduced motion.** `@media (prefers-reduced-motion: reduce)` collapses to the
same static path as mobile. Not a shortened animation — no animation.

**Implementation approach.** CSS-only, no JavaScript, no scroll listeners:

```css
.stage { height: 200vh; }                    /* scroll distance for the handoff */
.stage__inner {
  position: sticky; top: 0; height: 100svh;
  will-change: transform;
}
@supports (animation-timeline: scroll()) {
  @media (min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .stage__inner {
      animation: hero-contract linear both;
      animation-timeline: scroll(root);
      animation-range: 0 100vh;
    }
    @keyframes hero-contract {
      to { transform: scale(.92); border-radius: 24px; opacity: .82; }
    }
  }
}
```

Browsers without `animation-timeline` get plain `position: sticky` — the hero
holds, then releases. That is a perfectly good experience and costs nothing.
Because the document stays in normal flow, in-page anchors, browser back and
forward, `Ctrl+F`, and screen-reader linear order all keep working; none of
them survive a JS scroll-hijacking implementation intact.

**Performance risks and how they are contained.** Only `transform`, `opacity`,
and `border-radius` are animated, so the work stays on the compositor. There is
no scroll handler, so nothing runs on the main thread per frame. `will-change`
is scoped to the single sticky element. The `200vh` container adds scroll
distance, which is the real cost: it is why this is limited to one transition
and to desktop, where the extra distance is cheap. Do not add `scroll-snap-type:
mandatory` to the document — it is the fastest way to make a page feel like it
is fighting the user.

---

## Recommended Add-Ons

Ranked by business value.

---

**1. Persistent mobile call/text bar**
**What:** A fixed two-up bar at the bottom of every mobile viewport: **Call** ·
**Text**, replacing the current "Back to top" dock content.
**Why:** The header has no call button on mobile and the hero CTA is the only
call action above the fold — and on the current branch it isn't even that.
**User benefit:** The phone number is always one thumb-tap away.
**Business value:** Highest on this list. On a plumbing site most mobile
visitors have an active problem; every scroll position where calling requires
hunting is lost revenue.
**Difficulty:** Low — the dock component already exists and is already
positioned.
**Timing:** NOW.

---

**2. LocalBusiness / Plumber structured data + `robots.txt` + `sitemap.xml`**
**What:** One JSON-LD block with the verified facts (name, phone, licence,
hours, service area, URL), plus the two missing crawl files.
**Why:** All three are absent. This is the cheapest local-search work available
and none of it has been done.
**User benefit:** The business appears correctly in search with hours and a
tappable phone number.
**Business value:** High — a local service business is found through search
before it is found through a link.
**Difficulty:** Low.
**Timing:** NOW.

---

**3. Real project photography rail**
**What:** A horizontally scrollable strip of four to eight real OTTO job
photographs between Services and Contact, each with a one-line caption
(job type + city). Swipeable on touch, arrow-scrollable on desktop.
**Why:** It is the only element on this list that proves the company does the
work. 175 permitted projects and nothing to show for them.
**User benefit:** Evidence instead of assertion.
**Business value:** High.
**Difficulty:** Low to build, **blocked on the owner supplying photographs**.
**Timing:** NOW to build the component, ships when the photos arrive.

---

**4. Working service request delivery**
**What:** Configure the Formspree endpoint in `intake-config.js` and verify a
real submission arrives.
**Why:** The form is fully built, validated, spam-protected, and connected to
nothing. See *Lead Generation / CRM*.
**User benefit:** The advertised online path actually reaches the office.
**Business value:** High — captures the segment that will not phone a stranger,
and after-hours requests.
**Difficulty:** Low in code, **blocked on the owner** (account + verified inbox).
**Timing:** NOW.

---

**5. Service-area statement, then a map**
**What:** First, name the actual cities OTTO serves in text. Later, a light
static map image with the coverage area.
**Why:** "South Florida" is the only geographic signal on the entire site, and
no address appears anywhere. Customers and search engines both need specifics.
**User benefit:** "Do they come to me?" answered in one glance.
**Business value:** High for local search.
**Difficulty:** Low for the text, medium for the map. Do the text first.
**Blocked on the owner** confirming the real service cities — do not guess.
**Timing:** Text NOW, map LATER.

---

**6. Interactive FAQ**
**What:** Six to eight real questions with accordion answers — pricing
approach, emergency availability, warranty, permits, payment, response time.
**Why:** Every one of these is a reason a customer hesitates before calling.
**User benefit:** Objections answered without a phone call.
**Business value:** Medium-high; also earns search visibility for question
queries.
**Difficulty:** Low.
**Blocked on the owner** for truthful answers. Do not draft plausible ones.
**Timing:** NEXT.

---

**7. Verified review module**
**What:** `prestige.js` already contains `renderVerifiedReviews()`, which reads
`window.OTTO_VERIFIED_REVIEWS`, validates each entry has a name, platform,
excerpt, source URL, and a 1–5 rating, and renders nothing when the array is
empty. It is well-built and currently dormant.
**Why:** Reviews are the strongest trust signal available to a trades business.
**Business value:** High.
**Difficulty:** Low — the component exists.
**Blocked on the owner** supplying real, sourced reviews.
**Timing:** NEXT.

---

**8. Hero → Services scroll transition**
**What:** As specified above.
**Why:** The one piece of craft that makes the site memorable rather than
merely correct.
**User benefit:** Modest — this is a perceived-quality investment.
**Business value:** Medium; it is what separates "clean" from "premium."
**Difficulty:** Medium.
**Timing:** NEXT — after the stylesheet consolidation, not before.

---

**Do not build:** an emergency-service banner (no verified 24/7 availability —
hours are Mon–Sat 7–7), before/after sliders (requires paired photography that
does not exist), a multi-step request wizard (the current form is six fields
and its problem is that it does not send, not that it is too long), and a
service comparison table (a plumber is hired, not comparison-shopped by
tier).

---

## Mobile Experience

Mobile is where this site is weakest relative to its purpose, and the current
branch makes it worse rather than better.

**Fix now:**

1. **Put a call button in the mobile header.** `display: none` on
   `.nav-actions .call-btn` is the single most costly line of CSS on the site.
2. **Add the persistent call/text bar** and reclaim the dock from "Back to top."
3. **Get the hero CTA back above the fold.** Production has it at 563px; the
   branch pushes it to 850px in an 844px viewport. Target under 700px.
4. **Never hide the EN/ES switcher.** The branch hides it at exactly 390px.
5. **Keep the header sticky.** The branch un-sticks it, so past the hero there
   is no navigation and no call action anywhere on screen.
6. **Enlarge the language toggle.** EN and ES measure 35×32px against a 44×44px
   minimum.
7. **Keep the mobile scroll conventional.** No pinning, no snapping, no
   transforms below 1024px.

**Preserve:** no horizontal overflow at 390px, the working drawer, the
correct `tel:`/`sms:` links, and the honest form failure state.

---

## Lead Generation / CRM

**Classification: frontend only.**

Traced end to end. A valid submission produces **no network request of any
kind** — no POST, no beacon, no image ping. `intake-config.js` ships with
`endpoint: ''` and `fallbackEmail: ''`, so `intake-core.js` never reaches its
delivery call. The status line reads *"This request has not been sent. Please
call or text (786) 344-2837."* with error styling, the customer's data is
retained, and call/text fallbacks are surfaced.

**No lead has ever reached OTTO through this form, and none can until an
endpoint is configured.** There is no Supabase write, no CRM call, and no
webhook anywhere in the codebase — consistent with `docs/INTAKE-SETUP.md`,
which states the form writes to neither.

The behaviour is **correct**. It validates, it protects against spam, it retains
data, and it never claims a success that did not happen. That honesty is worth
defending — a form that silently drops leads while showing a green checkmark is
far more damaging than one that says so.

But from the customer's side the online path is a dead end, and it is presented
as a real option: the nav says "Request Service," the hero says "Request
service," and the section is headed "Request service online."

**The customer journey today:** call or text works, and is the only thing that
does. Every other advertised path — the form, and on the branch WhatsApp —
terminates in a message explaining why it doesn't work.

**To fix it:**

1. **From the owner:** a Formspree account on the business email, that email
   verified, a form created, and its public endpoint. This is a public URL, not
   a credential — nothing secret enters the repository.
2. Set `endpoint` and `fallbackEmail` in `intake-config.js`.
3. Submit one real request from a phone and confirm the office receives it
   before declaring it working.
4. Restore the submit label to "Send request" at the same time (bug 2).

**Then improve it:** the six fields are right and the form does not need a
wizard. What it needs is an **urgency selector** — "Emergency / today" ·
"This week" · "Planning a project" — which costs one tap, tells the office how
to triage, and lets the emergency path route to the phone immediately. Add an
optional photo upload only after delivery is proven working.

---

## Security and Production Risks

Only verified items.

**No secrets are exposed.** `intake-config.js` contains empty strings and a
timeout. Nothing in the repository holds an API key, token, or password, and CI
runs gitleaks on every push. Confirmed by reading every served file.

**No unauthenticated backend exists to attack.** The site is fully static —
there is no API route, no database, and no server-side code. Most of the usual
attack surface for a lead-capture site simply is not present.

**Verified risks:**

| Risk | Severity | Detail |
|---|---|---|
| Scheduled workflow pushes to `main` every 5 min | P2 | `production-release-trigger.yml`, `contents: write`, `cron */5`. Bug 14 |
| Brand asset served from a third-party host | P2 | Header logo from `raw.githubusercontent.com`, different repo. Bug 3 |
| Production serving mixed-build assets | P2 | HTML and CSS from different builds; no content hashing |
| No security response headers | P3 | No `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/CSP `frame-ancestors`, or `Permissions-Policy`. No `vercel.json` exists. Low impact on a static site, but a ten-line file closes it |
| `access-control-allow-origin: *` on the HTML | P4 | Vercel default; no credentials or private data are served, so this is noted rather than flagged |

**Spam exposure** is currently zero because nothing is delivered. Once the
Formspree endpoint is live, the existing honeypot, fill-time floor, and
duplicate fingerprint are a reasonable baseline; Formspree's own filtering
should be enabled alongside them.

Not flagged, deliberately: there is no CAPTCHA, and none is recommended. On a
six-field trades form it costs more real leads than it blocks bots.

---

## SEO / Search Readiness

Weak. This is the largest pool of cheap, uncontroversial value on the site.

**Present:** a correct canonical, a reasonable title and meta description, a
manifest, a favicon set, one `<h1>`, semantic headings, `lang` switching, and
fully crawlable static HTML.

**Missing:**

| Item | Status |
|---|---|
| `robots.txt` | **404** |
| `sitemap.xml` | **404** |
| LocalBusiness / Plumber JSON-LD | **None** |
| Open Graph tags | **None** — shared links render as a bare URL |
| Twitter card tags | **None** |
| Physical address / NAP block | **None anywhere on the site** |
| Named service areas | **None** — only "South Florida" |
| `hreflang` for the ES variant | **None** |

**Two structural problems beyond the missing files:**

The title and meta description are **overwritten by JavaScript** after load.
The static HTML says "Licensed Plumbing Service"; `facelift.js` then
`prestige.js` rewrite it to "South Florida Plumbing Since 1996." Google renders
JavaScript and will usually see the final version, but other crawlers and
social scrapers will not, and it makes the page's identity depend on a
four-script chain completing. Put the intended title in the HTML.

The Spanish version has **no URL of its own** — it is a runtime DOM swap on the
same URL with no `hreflang`, so it cannot be indexed or shared. For a bilingual
South Florida business that is a meaningful amount of invisible search traffic.
A `/es/` route would be the proper fix; it is a LATER item, not a NOW one.

**Highest-value improvements, in order:** JSON-LD → `robots.txt` + `sitemap.xml`
→ Open Graph → static title/description → named service cities → `/es/`.

Not recommended: any form of keyword stuffing, invented location pages, or
service-area claims the owner has not confirmed.

---

## Verification Matrix

Assessed against **production** unless noted.

| Area | Status | Note |
|---|---|---|
| Production deployment | **PARTIAL** | Serves commit `8e8e169` — 10 behind branch, not on `main`; assets from two builds |
| Homepage | **PASS** | 200, no errors, renders correctly |
| Hero | **PARTIAL** | Works; no imagery, split-panel treatment is incoherent |
| Navigation | **PASS** | Sticky, correct links, working mobile drawer *(FAIL on branch — bug 10)* |
| Services | **PARTIAL** | Content correct; six identical tiles, collapsible for no reason |
| Contact actions | **PASS** | All `tel:`/`sms:` links correct *(no mobile header call button — bug 6)* |
| Contact form | **PARTIAL** | Validation, anti-spam, honest failure all work; button label wrong (bug 2) |
| Lead delivery | **FAIL** | Frontend only. No request is ever sent |
| CRM connection | **FAIL** | None exists in the codebase, by design |
| Mobile | **PARTIAL** | Layout sound; CTA and language regressions on branch (bugs 8, 9) |
| Tablet | **PASS** | 820px clean, no overflow |
| Desktop | **PASS** | 1440px clean, no overflow |
| Scroll experience | **PASS** | Conventional and smooth; no advanced system exists yet |
| Images / assets | **FAIL** | One image on the entire site; served cross-origin; `logo.jpg` 404s |
| Accessibility | **PARTIAL** | Skip link, headings, focus rings on links/buttons all good; **no focus indicator on form fields** (bug 5); small touch targets; unreachable theme toggle |
| Performance | **PASS (lab)** | CLS 0, LCP 120ms, 135KB, 15 requests on a byte-identical replica. Real TTFB 239–562ms. **Field data: NOT TESTED** |
| SEO | **FAIL** | No robots, sitemap, structured data, or OG tags |
| Security | **PASS** | No secrets, no backend, no exposed data. Process risks noted separately |
| Vercel configuration | **BLOCKED** | Project not visible to the connected account — owner must verify |
| BBB "A+ rating" claim | **BLOCKED** | bbb.org returns 403 to non-browser clients — owner must confirm |
| CI pipeline | **FAIL** | Both jobs red on this branch — see below |

### CI status

The `CI` workflow is **red on this branch**, and it is red for reasons that
predate this audit — the audit added one Markdown file and no HTML, CSS, JS,
or workflow changes.

Everything scriptable in the `validate` job passes when run locally against the
branch: all seven `node --check` calls, `node --test tests/*.test.mjs`
(**27 passed, 0 failed**), the `manifest.json` JSON parse, all four SVG parses,
and the final-candidate integration-hook check.

The one step that cannot be run locally is `anishathalye/proof-html@v2`, which
link-checks the HTML. Testing every external link in `index.html` the way that
action would:

| Link | Status |
|---|---|
| `fonts.googleapis.com/css2?family=…` | 200 |
| `otto-plumbing-site.vercel.app/` | 200 |
| `buildzoom.com/contractor/otto-plumbing-inc` | 200 |
| `myfloridalicense.com/wl11.asp?…` | 200 |
| `bbb.org/us/fl/miami/profile/plumber/otto-plumbing-inc-…` | **403** |

The BBB link — added to `index.html` by commit `563e9ed` on this branch —
returns 403 to non-browser clients, which html-proofer treats as a broken
external link. That is the strongest available explanation for the `validate`
failure, and it is a second, independent reason to reconsider the BBB
credential card (bug 12).

The `Secret scan (gitleaks)` job also fails. **Its cause was not determined** —
GitHub's log download returned HTTP 404 for both failed jobs in this
environment, so this is inference from reproducible local evidence rather than
from the CI log itself. What can be stated: the audit's Markdown file contains
no keys, tokens, credentials, or high-entropy strings, so it is not a plausible
cause. Someone with dashboard access should open the run and read the log.

---

## Top 10 Improvements

1. **Get production and `main` onto the same commit, and find out why they
   diverged.** Everything below is unverifiable until deploys are deterministic.
2. **Configure Formspree and prove one real lead arrives.** The advertised
   online path currently reaches no one.
3. **Add a persistent mobile call action** — header button plus bottom bar.
4. **Do not ship the branch as-is.** Fix the below-fold CTA, the hidden EN/ES
   switcher, and the un-stuck header first (bugs 8, 9, 10).
5. **Get real photography from the owner and put it in the hero, the services
   section, and a project rail.** The largest single visual gain available.
6. **Add LocalBusiness JSON-LD, `robots.txt`, `sitemap.xml`, and Open Graph.**
7. **Consolidate six stylesheets into one tokenised sheet** and delete all 32
   `!important` declarations. Prerequisite for safe change.
8. **Fix the business-section labels** so "Direct line" shows the phone number
   (bug 1), and fix the form button label (bug 2).
9. **Fix the form focus indicators** and enlarge sub-44px touch targets (bug 5).
10. **Then, and only then, build the hero → services scroll transition** as the
    site's one signature moment.

---

## Best Next Action

**Open the Vercel project that owns `otto-plumbing-site.vercel.app` and confirm
three settings: connected repository `ejnburrows-rgb/otto-plumbing-site`,
production branch `main`, root directory = repository root. Then merge the
reviewed branch to `main`, redeploy, and confirm `/version.json` reports the
new release marker.**

This is first because it is the only blocker that invalidates everything else.
Production is currently serving a commit that exists on no deployable branch,
its HTML and CSS come from different builds, and `docs/DEPLOYMENT-MISMATCH.md`
records this same class of failure from a previous incident. Until a push
reliably becomes the live site, every fix below is unverifiable — and the
project has already burned five commits (`4dcbb3e`, `4b38aab`, `15a0396`,
`6659dbd`, `17a6fe0`) trying to force deploys instead of diagnosing this.

**The problem is narrower than it looks, and the diagnosis is nearly done.**
Vercel built a preview from the audit branch immediately and served the branch
content byte-for-byte, so the repository connection, the build, and the deploy
pipeline all work. What is broken is only what the **production alias** points
at. Check, in this order: the project's production branch setting, then whether
`otto-plumbing-site.vercel.app` is aliased to a specific old deployment rather
than following production, then whether `main` is being skipped by an ignored-
build setting.

The final step is not optional: after redeploying, load
`/version.json` and confirm the release marker changed. That file exists
precisely so this is verifiable, and it currently reports a marker two releases
stale.

This step needs the owner — the connected account's API access does not expose
this project, so it can only be done from the Vercel dashboard.

---

## Remaining

What materially stands between this site and "professional, polished,
distinctive, production-ready":

1. **Deployment is not deterministic.** Production serves an orphaned commit
   with mixed-build assets. Nothing can be confirmed fixed until this is.
2. **Lead capture does not capture leads.** The form is complete, correct, and
   connected to nothing.
3. **There is no visual evidence the company exists.** Zero photographs. This
   is the difference between a template and a real business's website, and no
   amount of typography or motion work substitutes for it.
4. **Mobile does not put the phone first.** No header call button, no persistent
   call bar, and on the current branch the only call CTA is below the fold.
5. **Search cannot find it properly.** No structured data, no sitemap, no
   robots file, no social preview, no named service areas.
6. **Trust claims are not all verified.** The BBB rating is unconfirmed, the
   BuildZoom verification date is contradicted by its own source, the DBPR
   verification link verifies nothing, and one "verify" link routes customers
   to a lead marketplace that lists a different phone number.
7. **The CSS cannot be changed safely.** Five override layers and 32
   `!important` declarations already silently disabled the sticky header and
   the Spanish switcher. It will do so again.

Nothing here requires a redesign. Items 1, 2, 4, and 5 are days of work with
clear definitions of done. Items 3 and 6 are blocked on the owner and should be
requested today. Item 7 is the refactor that makes the rest durable.

---

## What to request from the owner

Nothing below can be written, guessed, or sourced by a developer.

1. **Photographs** — 8–15 real job/van/team images, highest resolution
   available, with permission to publish.
2. **Formspree** — account on the business email, email verified, form created,
   public endpoint copied.
3. **Office inbox** — the confirmed address for the email fallback.
4. **Service cities** — the actual municipalities served, not "South Florida."
5. **BBB rating** — confirmation of the A+ rating and the correct profile URL.
6. **Business address** — whether a public address can be listed (required for
   full LocalBusiness structured data).
7. **WhatsApp** — the business WhatsApp number, or confirmation to remove the
   feature.
8. **Reviews** — real customer reviews with name, platform, and source link.
9. **Logo** — a vector (SVG/AI/EPS) version of the wordmark.
10. **Warranty / guarantee terms** — if any exist and can be stated publicly.
