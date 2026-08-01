# OTTO Plumbing Website — Clean Rebuild Handoff

This file preserves the useful facts from the old website repository so the implementation can be discarded and rebuilt cleanly without losing the business requirements.

## Purpose

The current website implementation is not the rebuild baseline. Preserve the facts below, then use the director-approved Google/Gemini Stitch design as the visual source of truth for the replacement site.

Do not copy old layout/CSS/JavaScript merely because it exists. Reuse only verified content and valid assets.

## Confirmed business facts

- Business name: **OTTO Plumbing Inc.**
- Public phone: **(786) 344-2837**
- Experience claim: **30+ years**
- Founded: **1996**
- License: **#CFC1429613**
- Hours: **Monday–Saturday, 7 AM–7 PM**
- Service area wording currently approved in the repo: **South Florida**
- Brand rule: write **OTTO** in capitals.

Do not invent testimonials, guarantees, awards, social accounts, additional locations, response times, prices, email addresses, or legal claims.

## Required replacement-site behavior

The clean replacement must be:

- a public marketing website for OTTO Plumbing Inc.,
- English/Spanish with visible-content parity,
- responsive on phone and desktop,
- accessible,
- truthful about contact behavior,
- lightweight and reliable,
- and visually implemented from the director-approved Google/Gemini Stitch design.

The current repo is a static HTML/CSS/JavaScript site. The replacement does not need a heavier framework unless there is a demonstrated reason.

## Contact behavior

The existing site was designed to use Formspree only when a real endpoint is configured. Preserve the principle, not necessarily the old implementation:

- Never show a successful form submission unless a real endpoint accepted it.
- If no verified form endpoint exists, provide the confirmed phone fallback instead.
- Do not invent an email address.

## Design source of truth

The old repository does **not** contain a complete, verified Stitch package.

The director will re-share the approved Google/Gemini Stitch project/designs. Those designs supersede the old website UI.

For the rebuild, preserve a local design package containing, where available:

- approved desktop screenshots,
- approved mobile screenshots,
- Stitch project/screen identifiers,
- approved prompt/design brief,
- exported images/icons,
- fonts and colors,
- and a simple mapping from Stitch screens to website sections/pages.

Do not use temporary Stitch URLs or image-generation prompt text as production assets. Store real approved assets in the replacement repository.

## Existing assets worth reviewing before reuse

The old repository contains PWA/brand files including:

- `favicon.svg`
- `apple-touch-icon.svg`
- `icon-192.png`
- `icon-512.png`
- `manifest.json`

Review each visually before copying it. The old README warns that `icon-512.png` historically used the same bytes as the 192px icon, so regenerate it if needed rather than blindly preserving it.

## Known old-site problems — do not carry forward

- The public deployment was observed serving an older build rather than the current repository state.
- At least one referenced visual asset (`miami-skyline.svg`) was missing on the live site.
- The old implementation accumulated overlapping facelift work and conflicting branches/PRs.
- Mobile/navigation behavior and visual consistency require a clean implementation rather than piecemeal repair.
- Old facelift PR #15 is reference material only; do not merge or copy it wholesale.
- Old production-readiness PR #24 belongs to the discarded implementation and should not define the replacement architecture.
- Client-delivery PR #23 contains separate wording decisions and is not a source of UI truth.

## What not to migrate

Do not migrate merely for historical continuity:

- old CSS/layout structure,
- old JavaScript UI behavior,
- broken asset references,
- abandoned facelift experiments,
- stale deployment assumptions,
- old autonomous-agent task queues,
- obsolete branch-cleanup reports,
- or duplicated agent instructions.

## New-repository control system

The replacement repository should start with the same simple governance pattern used during realignment:

1. `AGENTS.md` — permanent safety and working rules.
2. `docs/REPO-CONTROL.md` — current objective, priorities, and director decisions.
3. `docs/STATUS.md` — factual current state only.
4. `docs/DECISIONS.md` — durable decisions and reasons.
5. Thin `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, and Copilot pointers if those tools are used.

Do not duplicate changing project facts across agent-specific files.

## Rebuild definition of done

The replacement is ready only when:

- the approved Stitch design is implemented and visually compared against the source designs,
- English and Spanish are complete,
- confirmed business facts are accurate,
- phone and desktop layouts are verified,
- navigation and contact actions work,
- there are no broken images or dead controls,
- accessibility is checked,
- the hosting project is connected to the intended repository and branch,
- and the public URL is proven to serve the tested commit.

## Director inputs still required for the clean rebuild

These are intentionally not guessed:

- re-shared approved Stitch designs/project,
- any approved logo/photography not already preserved as valid assets,
- verified contact-form endpoint if a form is desired,
- any public email address to display,
- confirmed social profiles if desired,
- final domain/hosting choice if changing from the existing deployment.

Everything else should be derived from this handoff and the approved Stitch source rather than reconstructed from the broken old implementation.
