# STATUS — OTTO Plumbing Website

Last verified from GitHub on 2026-08-01. This is the factual current snapshot, not a wish list.

## Repository

- Repository: `ejnburrows-rgb/otto-plumbing-site`
- Default branch: `main`
- Baseline commit for this realignment: `53d1ec373f34efa52fa6593f52d17d647c1cae6d`
- Project type: static single-page HTML/CSS/JavaScript website
- Repository access: owner has administrative and push access

## Confirmed present on `main`

- OTTO business website source
- English and Spanish behavior
- light and dark theme behavior
- responsive and accessibility improvements
- PWA manifest and install icons
- confirmed OTTO phone, licence, hours, service area, and email fallback
- client-delivery draft documents
- `AGENTS.md` and a thin `CLAUDE.md` pointer

## Open pull requests at realignment

### PR #24 — V1 production readiness (consolidated)

Current production-readiness candidate. It consolidates earlier overlapping readiness PRs and includes deployment-version proof and a deployment-mismatch runbook. It must be reconciled and verified before merging.

### PR #15 — dark-first OTTO luxury facelift

Older visual branch. It predates later accessibility work and is not safe to merge as-is. Useful design ideas may be extracted only after comparison with current `main` and the director-approved design.

### PR #23 — Spanish client-delivery drafts

Documentation-only client contract, progress, and handoff drafts. This requires director approval of business and legal wording and is not a blocker to verifying site functionality.

## Current blockers and risks

- The public production URL has not been independently proven in this realignment to match current `main`.
- The hosting repository, production branch, and root-directory settings require direct proof before claiming synchronized deployment.
- GitHub Actions cannot be treated as reliable evidence until a successful run is observed.
- The older facelift branch can overwrite later accessibility or bilingual corrections if merged blindly.
- Contact-form success must remain disabled unless a real endpoint is configured and verified.
- Client-delivery documents contain decisions that code cannot safely make for the director.

## Current objective

Finish the public website by proving the deployment chain, applying the approved visual design without regressing accessibility or bilingual behavior, verifying all public interactions, and preparing an accurate client handoff.

## Not verified yet

- exact live production commit
- current Vercel project-to-repository connection
- contact-form endpoint configuration
- all open-PR checks
- full phone and desktop browser proof against the public production URL
- final director approval of visual design and client-delivery wording

## Session log

- **2026-08-01:** Repository realignment created an internal control center, current status, decision log, reusable template, and unified agent entry points. No website functionality or production configuration was changed.
