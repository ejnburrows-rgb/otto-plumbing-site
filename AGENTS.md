# AGENTS.md — OTTO Plumbing Inc. website

**Read this fully before doing anything. Mandatory, every session, no exceptions.
`CLAUDE.md` is a one-line pointer back to this file.**

You are assisting with this project's authorized work. The owner's current directive (2026-10-29) is **organization and instruction reconciliation only**; do not initiate or finish product implementation, dispatch agents or publish production. Resume development only on a later explicit owner instruction.

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

Actual repository code, PRs and verified Vercel deployments establish current state. Any `dev-firm-compass/projects/otto-plumbing-site/STATUS.md` record is a historical/supporting snapshot, **not** an external controller or current authoritative work queue for this repository.

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
- **Coordinate existing file ownership.** Inspect this repository's actual PRs, branches, and last verified evidence. Do not require editing `dev-firm-compass` or its status JSON to work in this repository.
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
A past deployment-storage incident is historical context, **not a verified current global Vercel blocker**. Avoid unnecessary deployments. An unrelated repository's failure blocks only the affected action after current verification.

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
