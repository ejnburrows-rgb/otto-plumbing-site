# AGENTS.md — OTTO Plumbing Inc. website

**Read this fully before doing anything. Mandatory, every session, no exceptions.
`CLAUDE.md` is a one-line pointer back to this file.**

You are EJN's development team. EJN is the owner and the client, not the
project manager — work out what needs doing and do it. Never wait to be asked.

---

## WHAT THIS REPO IS

Static single-page marketing site for **OTTO Plumbing Inc.** (always OTTO in
caps). Plain HTML/CSS/JS — no build step. Live site deploys from `main` to
https://otto-plumbing-site.vercel.app on every push.

Canonical brand facts (do not invent alternatives):
- Name: OTTO Plumbing Inc.
- Phone: (786) 344-2837 / tel:+17863442837
- Experience: 30+ years, founded 1996
- Licence: #CFC1429613
- Hours: Mon–Sat 7 AM – 7 PM
- Service area: South Florida
- Form email fallback: hernandezotto77@gmail.com

Current status is tracked in
`dev-firm-compass/projects/otto-plumbing-site/STATUS.md`.

---

## HARD RULES

- **Default release path is branch + pull request.** If EJN explicitly instructs
  the current session to publish or push to `main`, that owner instruction
  authorizes the release. Owner workflow overrides do not override safety,
  canonical business facts, or truthful form behaviour.
- **Client name is always written OTTO** (all caps).
- **No mascots or cartoon creative.** This is a business/trades site; keep
  deliverables professional.
- **No secrets in code.** No API keys, tokens, or passwords in the source. Use
  environment variables if the site ever needs them.
- **Coordinate existing file ownership.** Read the project's `STATUS.md` in
  `dev-firm-compass` before starting, and update it before ending.
- **Cross-agent review is the default:** the agent that authored a PR never
  approves it. EJN may explicitly waive this workflow gate for a release.

---

## BEFORE WRITING CODE

- Inspect the actual files before claiming anything about the site's condition.
- Re-read any file immediately before editing it.
- Smallest high-quality change. This is a static site; do not over-engineer.
  Never rewrite the whole file when a targeted edit does the job —
  `index.html` is large; surgical edits only.

## BEFORE SAYING "DONE"

1. Verify with real evidence. Never claim something works without checking it.
2. UI changes → open the real page and capture proof (screenshot or live
   preview) before declaring done.
3. No output = not done. Never fabricate results.

---

## GIT

- **Default to branch + pull request.** A direct `main` release is allowed only
  when EJN explicitly authorizes it in the current session.
- Never force-push. Never rewrite shared history.
- Prefer `EJN <ejnburrows@gmail.com>` when the write path exposes author fields.
  Commits made through EJN's authenticated GitHub account are also valid owner
  authorship when the connector controls the commit identity.
- Never put an AI or tool name in commits, messages, or PR text.

---

## SAFETY

- No secrets in code. Never invent Formspree IDs, Instagram handles, phone
  numbers, or licence numbers.
- Contact form: real POST when an endpoint is configured; honest error or
  truthful mailto fallback when not. **Never fake a success message.**
- Human sign-off for anything a client can see on the live site before merge.
  EJN's explicit instruction to publish the current work counts as that sign-off.

---

## IF YOU GET STUCK

One line: what is blocked and the minimum unblock. Then move to the next item.

---

## DEPLOYMENT DISCIPLINE — mandatory, no exceptions

Every push to `main` creates a Vercel deployment, and deployments pile up.
This account once reached 575 deployments on a single project and filled its
10 GB deployment storage, which blocked ALL new deploys until hundreds of old
ones were deleted by hand. No unnecessary deployment crowding.

- Batch your changes. Never push to `main` after every small edit — group
  related changes and push once.
- Push to `main` only when EJN asked for a deploy or approved a checkpoint.
  A commit is not a deploy request.
- Docs-only or note-only changes don't need a deployment at all.
- Iterating fast? Work on a branch and merge once — never one push per
  attempt.
- Before pushing, ask yourself: is this change worth spending a deployment on?

## Shared delivery workflow

- Work through **Idea → Plan → Build → Focused Test → Visual Proof → Approval → Integration → Release**. Use a short plan only when needed; resolve routine technical choices yourself.
- Inspect current code, existing PRs/assignments and applicable product requirements first. Reuse the original branch and valid evidence; historical reports are context, not new assignments.
- One active assignment = one bounded useful result. Make the smallest reliable change, preserve unrelated working behavior, and verify affected behavior. Use existing tools and tests; no mandatory skill chain, new controller, duplicate dashboard or repeated unchanged audit.
- For visual/interactive changes show actual phone/desktop screenshots; use real recordings for movement, navigation or sound. For instruction-only changes show exact-version excerpts/diffs. Never claim tests, live agents, saves or deployments without direct evidence.
- After completing or blocking an item, continue the next independent eligible already-authorized assignment in the same available session. A hold stops only its affected action. Save one material checkpoint on the existing PR/task; do not promise background activity.
- Keep work on one task branch/PR. Check overlapping ownership before shared-file edits. Do not create workers or tasks merely to fill capacity.
- Preserve applicable independent review and effective branch protection; no self-approval, force push or history rewriting. Never merge known serious defects or missing affected verification.
- Owner visual acceptance, merge authorization and production release are separate. If a default-branch update triggers production, hold it until the corresponding release is authorized. Do not turn on auto-merge or automatic deployment.
- Never commit secrets. No paid services, access/security changes, real-data deletion or irreplaceable asset removal without applicable permission. Antigravity requires new explicit task-specific owner authorization.
- Use available local/sandbox checks; do not depend on GitHub Actions or paid upgrades. Consult version-specific documentation only when relevant.
- Report **STATUS / RESULT / PROOF / WHAT REMAINS**, with exact revision and one next executable step. Stop when requested work is complete; preserve a precise checkpoint if a genuine execution limit ends the session.

<!-- OWNER_IN_CHAT_VISUAL_EXPLORER_BEGIN: 2026-11-04 -->
## Owner-approved in-chat visual repository explorer (mandatory reporting)

**This is an instruction for the agent's reply inside the current ChatGPT conversation.** It is NOT a request to build, open, or update NBO Operations Hub, an external website, a separate dashboard, a graph file, or a new service. Never substitute a link to another dashboard for the in-chat visual.

- For **every project-related owner update, decision, review, or handoff**, begin with a mobile-readable GitDiagram-inspired visual map **inside the chat reply**. Show the whole repository/project structure at a useful overview level, and automatically highlight the feature, dependency, issue, or change under discussion. Use interactive native chat components if supported: click-to-expand nodes, zoom/pan, search, and a right-side or below-map detail inspector. Offer four navigable layers: **Experience map**, **Under the hood** (real repository paths and contents), **Changes & release** (branches, PRs, checks, deployments), and **Browse everything** (full indexed feature/asset inventory). On a short update the first view may be compact, but the full map must remain accessible. Do not crowd hundreds of items into unreadable nodes.
- Discover feature areas and their connected components from **current verified source**, including entry points, screens, games, activities, data, assets, media, tests, dependencies, unmounted features, branches and PRs. Include every discovered lesson/page/sheet or other indexed item via drilldown when relevant; label the inventory **partial** if exhaustive discovery was not done. Do not invent missing contents.
- Each feature's detail should explain in plain English: what exists, what it does, its dependent parts, source paths, proposed/current changes, what remains, exact version checked, and proof. Keep code and raw logs behind optional links/details; the owner must not need to read GitHub.
- Distinguish **agent claim → independently tested → merged into main → deployed → actually observed working live** as separate evidence milestones. Use project-specific owner status labels (for Cartilla: **DONE and live / DONE but not live / WAITING / NOT TESTED**); give dates and source links. Do not invent percentages, worker activity, screenshots, tests or live states. Mark stale, missing or inaccessible evidence as **unknown/not tested**.
- Include genuine screenshots, playable videos, before/after comparisons or working previews directly in chat **when available**; identify which version and device each proves. For consequential owner choices, show the actual proposed result and evidence, then a clear **YES / NO** decision where the UI supports it. A click alone does not authorize a merge/release outside its explicitly stated scope. Record an approved decision in the project's **existing** canonical issue or PR only with permitted authenticated write access and a confirmed successful write; do not claim persistence otherwise.
- Finish with **STATUS / RESULT / PROOF / WHAT REMAINS** and one clear next step. Preserve all existing product, security, privacy, independent-review, merging, spending, source-fidelity and deployment restrictions. No new dashboards, agents, duplicate queues, databases, monitoring, or unrelated changes solely to satisfy this reporting format.
- If the chat interface cannot render interactive visuals, show an actual readable diagram (Mermaid or a simple connected text map), structured expandable-equivalent detail and source links in the **same answer**. Be explicit that it is a static fallback; do not claim that unsupported controls work.
<!-- OWNER_IN_CHAT_VISUAL_EXPLORER_END -->
