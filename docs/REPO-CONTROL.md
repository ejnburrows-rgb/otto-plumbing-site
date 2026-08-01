# OTTO Plumbing Website — Repository Control Center

This is the current control point for `ejnburrows-rgb/otto-plumbing-site`. It is not a restart. It tells every agent what the website is trying to finish, what is already known, what must not be changed casually, and how completion is proven.

## Read order

1. `AGENTS.md`
2. This file
3. `docs/STATUS.md`
4. `docs/DECISIONS.md`
5. Task-specific material only when activated here

No outside status file, old report, autonomous loop, PR description, or tool-specific prompt may silently become a competing source of truth.

## Current objective

Finish the OTTO Plumbing public website as a polished, bilingual, accurate, accessible, and verifiably deployed client-facing site without rebuilding completed work.

The website must:

- present only confirmed OTTO business facts,
- match the director-approved visual direction,
- work cleanly on phone and desktop,
- provide honest contact behavior,
- maintain English and Spanish parity,
- and prove that the public URL is serving the approved `main` version.

## Current repository truth

- The project is a static single-page HTML/CSS/JavaScript website with no required build step.
- `main` is the production source of truth.
- The repository contains accessibility, bilingual, PWA, and brand work already merged.
- Production deployment alignment has been questioned and must be directly proven before the site is called ready.
- PR #24 is the consolidated production-readiness branch and supersedes the fragmented readiness PRs it names.
- PR #15 contains an older dark-luxury facelift and is not safe to merge blindly because it predates later accessibility work.
- PR #23 contains expanded Spanish client-delivery drafts and requires a director decision separate from site functionality.
- The contact form must never report success unless a real verified endpoint accepts the submission.
- GitHub Actions must not be treated as proof until a successful run is observed.

## Priority order

1. **Repository governance realignment** — one current source of truth inside this repository.
2. **Production-chain proof** — confirm repository, `main`, hosting project, deployed commit, and public URL match.
3. **Approved full-site visual completion** — reconcile the approved design direction with current accessibility and bilingual work; do not merge stale facelift code blindly.
4. **Functional and content verification** — navigation, mobile menu, language switch, theme behavior, contact actions, PWA assets, links, and confirmed business claims.
5. **Contact decision** — verified form endpoint or an honest call/email fallback.
6. **Client handoff readiness** — only after the public site matches approved source and all unknown business/legal fields are confirmed.
7. **Final release proof** — phone and desktop screenshots, English and Spanish checks, accessibility checks, and live-version evidence.

Do not jump to a later item while an earlier item is unresolved unless the earlier item is genuinely blocked and the next item is independent.

## Decision rights

The director approves:

- final visual direction and supplied design references,
- new public business claims,
- contact-form provider and paid services,
- production deployment,
- domain or hosting changes,
- client contract and handoff language,
- and irreversible cleanup.

Agents may investigate, implement approved work on branches, verify it, and open pull requests under `AGENTS.md`.

## Pull-request decisions

- **PR #24:** keep as the current production-readiness candidate until its contents are reconciled with the current control system and verified.
- **PR #15:** do not merge as-is. Extract useful visual ideas only after comparison with current `main` and approved designs.
- **PR #23:** keep separate from product readiness; merge only after the director approves the client-facing language.
- Superseded or closed branches may be deleted only after unique useful work is confirmed absent or preserved.

## Definition of done

The website is ready only when:

- approved source is on `main`,
- the hosting project is connected to this repository and correct branch,
- the public URL serves the approved version,
- the full approved visual system is implemented consistently,
- phone and desktop layouts work without errors or overflow,
- English and Spanish visible content are complete,
- business claims match confirmed facts,
- contact actions behave truthfully,
- accessibility checks pass for the changed experience,
- and direct screenshots plus deployment evidence exist.

## Reporting format

Every agent report must state:

- **Works**
- **Broken**
- **Blocked**
- **Changed**
- **Not done yet**

No evidence receipt means the work is not accepted.

## Instruction-file policy

`AGENTS.md` and this file are controlling documents.

`CLAUDE.md`, `GEMINI.md`, `.cursorrules`, and `.github/copilot-instructions.md` must remain short pointers. They may not contain changing commit IDs, branch counts, deployment claims, or task queues.

`docs/PASTE-ME.md` exists for tools that do not automatically read repository instructions.

## Realignment completion standard

The repository is realigned when:

- all agent entry files use the same read order,
- current status and decisions live inside this repository,
- no active instruction depends on `dev-firm-compass` or another repository,
- open PRs are classified clearly,
- old reports cannot override current control,
- and `docs/REALIGNMENT-TEMPLATE.md` can be reused in another repository.
