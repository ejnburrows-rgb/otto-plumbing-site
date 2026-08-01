# OTTO Plumbing Website — Clean Rebuild Handoff

This file preserves the verified information worth carrying into a replacement repository. It is intentionally independent of the current website implementation.

## Rebuild objective

Build a clean, reliable, bilingual marketing website for OTTO Plumbing Inc. from the approved Gemini Stitch design references.

Do not port the current broken page wholesale. Reuse only verified business facts, approved wording, valid brand assets, and useful design evidence.

## Canonical business facts

- Business name: **OTTO Plumbing Inc.**
- Phone: **(786) 344-2837**
- Telephone link: `tel:+17863442837`
- Experience: **30+ years**
- Founded: **1996**
- License: **#CFC1429613**
- Hours: **Monday–Saturday, 7:00 AM–7:00 PM**
- Service area: **South Florida**
- Languages: **English and Spanish**
- Email fallback currently recorded in the old repository: `hernandezotto77@gmail.com`

Do not add or change business claims, social-media handles, addresses, ratings, job counts, emergency availability, insurance claims, or response-time promises without owner confirmation.

## Required website purpose

The website must help a visitor:

1. Understand what OTTO Plumbing does.
2. See the service area and verified credentials.
3. Call or contact the business quickly.
4. View the complete site in English or Spanish.
5. Use the site comfortably on a phone or desktop.

This is a public marketing website, not the OTTO CRM.

## Required content areas

- Header/navigation
- Hero section
- Plumbing services
- Why choose OTTO
- Verified credentials and trust information
- Contact section
- Phone call-to-action
- Honest contact form or email fallback
- Footer with verified business information
- English/Spanish language switch

## Services currently represented

These may be reused as the initial service set, subject to owner approval:

- Leak repair
- Water heaters
- Drain and sewer work
- Emergency plumbing service
- Commercial plumbing
- Bathroom and kitchen remodeling plumbing

## Design source of truth

The final design must come from the Gemini Stitch project or screenshots the owner supplies again.

The old repository does **not** contain a complete or trustworthy Stitch package.

Existing PR #15 may be used only as historical visual evidence of a dark-first direction. It must not be merged or copied wholesale because it predates accessibility fixes and includes obsolete deployment files, old icons, and an unverified skyline asset.

When the Stitch materials are supplied, store them in the replacement repository under:

`docs/design/stitch/`

Preserve:

- approved desktop screenshots,
- approved mobile screenshots,
- Stitch project and screen identifiers,
- exported real assets,
- exact colors and fonts,
- approved prompt or design brief,
- and a screen-to-page implementation map.

Never use temporary Stitch asset URLs, generated prompt text, or missing placeholder assets in production.

## Brand and visual rules

- Always write **OTTO** in capital letters.
- Professional plumbing/trades appearance.
- No mascots or cartoon characters.
- Use the approved Stitch layout exactly once supplied.
- Real image and font assets must be stored in the repository or loaded from a reliable approved source.
- Maintain readable contrast and keyboard accessibility.
- Preserve correct phone and desktop layouts.

## Language requirements

- Every visible customer-facing string must exist in both English and Spanish.
- Changing language must update the page language metadata for screen readers.
- No mixed English text should remain in Spanish mode.
- Phone numbers, license numbers, and business names remain unchanged.

## Contact behavior

The contact experience must never claim success unless the message was actually submitted.

Acceptable implementations:

1. A verified form provider endpoint configured outside source code, or
2. A truthful email fallback that opens the visitor's email application.

Do not commit API keys, passwords, private endpoints, or credentials.

No Instagram link should appear until the real OTTO Plumbing account is confirmed.

## Deployment requirements

The old public site was confirmed to be serving an outdated July 17 deployment rather than current GitHub content.

For the replacement:

- Create a new Vercel project connected to the replacement repository.
- Deploy only from the replacement repository's `main` branch.
- Verify the GitHub commit and deployed page match before switching the public domain.
- Keep the old deployment available only until the replacement is verified.
- Do not assume a successful Vercel build means the correct project or repository is serving the public domain.

## Acceptance criteria

The replacement is ready only when:

- the live page matches the approved Stitch design,
- all pages and assets load without errors,
- every link and button works,
- the phone number is correct everywhere,
- English and Spanish are complete,
- the contact process is truthful,
- no unverified claims or social links appear,
- phone and desktop layouts have no overlap or sideways scrolling,
- accessibility checks pass,
- the deployed production page matches the tested GitHub commit,
- and the owner approves the visible result.

## Useful historical references before deleting the old repository

- Current canonical business facts: `AGENTS.md` and `README.md`
- Current English and Spanish wording: `index.html`
- Accessibility and icon fixes: merged PR #11 / commit `59d023b57bb1ff0117cb462339918e2880309f12`
- Historical dark-first visual direction: draft PR #15, branch `feat/ui-dark-luxury`
- Deployment mismatch evidence and release corrections: open PR #24
- Spanish client-delivery drafts: open PR #23

These references are historical evidence only. The replacement repository should receive a clean implementation rather than inherited code.

## Do not carry forward

- the current `index.html` implementation as a whole,
- duplicated desktop and mobile navigation systems,
- missing `miami-skyline.svg` references,
- generic Instagram links,
- unsupported claims such as `5,000+` jobs or `5.0` rating unless confirmed,
- stale Vercel configuration,
- old external status-file dependencies,
- abandoned branches and agent prompts,
- temporary or generated SVG branding not approved by the owner,
- and any code that displays a success message without a confirmed submission.

## Clean replacement repository structure

Suggested minimum:

```text
AGENTS.md
README.md
index.html
assets/
  logo/
  images/
  fonts/
docs/
  REPO-CONTROL.md
  STATUS.md
  DECISIONS.md
  design/stitch/
```

Keep the new implementation simple. A static site is sufficient unless a confirmed business requirement needs more.

## First instruction for the replacement agent

Read this handoff, then inspect the supplied Gemini Stitch materials. Build the replacement website from a clean repository. Do not copy the old implementation wholesale. Preserve the verified facts and content above, implement the approved design faithfully, verify the live deployment, and report only what is proven.
