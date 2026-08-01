# DECISIONS — OTTO Plumbing Website

Record only real decisions and why they were made. Do not turn this into a task list.

- **2026-08-01 — Repository control lives inside this repository.** The previous `AGENTS.md` depended on an external `dev-firm-compass` status file. That allowed the website repo and its instructions to drift apart. `AGENTS.md`, `docs/REPO-CONTROL.md`, `docs/STATUS.md`, and this file are now the authoritative read order.

- **2026-08-01 — Permanent rules and changing facts are separated.** Safety, Git, verification, and communication rules stay in `AGENTS.md`. Current objectives, priorities, open-PR decisions, and deployment blockers stay in `docs/REPO-CONTROL.md` and `docs/STATUS.md`.

- **2026-08-01 — Tool-specific files remain thin pointers.** Claude, Gemini, Cursor, and Copilot must not carry their own test totals, deployment claims, task queues, or product facts. This prevents different agents from receiving conflicting instructions.

- **2026-08-01 — PR #24 is the production-readiness candidate.** It consolidates earlier overlapping readiness work. It must be reconciled with current `main` and verified before merge rather than replaced by another fragmented readiness branch.

- **2026-08-01 — PR #15 will not be merged blindly.** It contains an older visual facelift that predates later accessibility work. Approved visual ideas can be reapplied to current `main`, but current accessibility, bilingual behavior, brand facts, and functionality must be preserved.

- **2026-08-01 — PR #23 is a separate director decision.** Client contract and handoff wording is not the same as production readiness. Unknown legal, pricing, timeline, hosting, and support terms must remain unapproved until the director confirms them.

- **2026-08-01 — Deployment readiness requires direct proof.** A GitHub commit, Vercel status, or documentation claim alone is not enough. The public URL must be shown to serve the approved source version before the site is called synchronized or delivered.

- **2026-08-01 — Contact behavior must be truthful.** The form may submit only to a real verified endpoint. Otherwise the site must clearly offer the confirmed phone or email fallback and must never display a false success state.

- **Existing architecture — static single-page site.** The website remains plain HTML/CSS/JavaScript with no required build system. New frameworks, databases, analytics, paid integrations, or runtime services require a clear need and director approval.

- **Existing brand rule — confirmed facts only.** OTTO is always capitalized. Public claims must use confirmed business information; no invented testimonials, guarantees, awards, social accounts, locations, or response times.
