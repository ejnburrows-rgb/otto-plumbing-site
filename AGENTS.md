# AGENTS.md — OTTO Plumbing Inc. website

**Read this fully before doing anything. Mandatory, every session, no exceptions.
`CLAUDE.md` is a one-line pointer back to this file.**

You are EJN's development team. EJN is the owner and the client, not the
project manager — work out what needs doing and do it. Never wait to be asked.

---

## ANY TOOL MAY DO ANY WORK

Claude, Antigravity, Kilo, Gemini, Jules, or anything else. No lane is
reserved for a particular tool and no tool is banned. **These rules apply to
the work, never to which tool is doing it.**

Everything below is a **behaviour, not a tool.** Use named skills if your
environment has them; otherwise do the same thing by hand. Never skip a step
because a tool is missing.

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
- **One agent per repo at a time.** Read the project's `STATUS.md` in
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

## GITHUB ACCOUNT LIMITS

- EJN uses a free GitHub account and does not have GitHub Actions available.
- Do not depend on GitHub Actions, required CI checks, or hosted Actions runners to complete or verify work.
- Use direct verification, local/sandbox testing, or other available tools instead.
- Do not recommend upgrading GitHub solely to enable Actions unless EJN explicitly asks about paid options.

---

## NON-TECHNICAL OWNER WORKFLOW — MANDATORY

EJN does not review code or GitHub internals. Agents own the technical judgment and must show proof in chat.

- Never put unfinished or unverified work into `main`.
- One branch per active job. No backup, experiment, duplicate, or unrelated branches.
- Maximum two active coding lanes at once. Before changing shared areas, check the other active lane and avoid overlap.
- Make normal technical choices yourself. Do not ask EJN to choose libraries, Git methods, file structure, or test methods unless it changes what he will actually see or use.
- Before asking for approval, fix obvious issues, run relevant tests, confirm the project builds, check the actual feature/screen, and address known important review findings.
- Preserve unrelated working parts of the project. Do not reorganize or modernize outside the task.
- Do not claim success without verification.

### Proof shown to EJN
For visual work, show screenshots/images or before-and-after proof in chat. For functional work, explain in plain English what works and what was tested. EJN should not need to open GitHub.

When work is ready, report exactly:

```
RESULT:
What changed in plain English.

PROOF:
What was checked and the result. Include visible proof when appropriate.

KNOWN LIMITATIONS:
Anything unfinished, blocked, or uncertain. Write "None" if there are none.

READY TO PUSH:
Yes or No.
```

Then stop and wait.

### Meaning of "Push it"
When EJN says **"Push it"**, put the completed, tested work into `main`, confirm it is there, let the finished branch be removed when safe, and report back. EJN should never have to merge, rebase, cherry-pick, resolve conflicts, or supervise GitHub.

"Push it" does **not** mean deploy publicly. Do not deploy, publish, spend money, change production data, delete data, or take another hard-to-reverse external action without explicit authorization. If updating `main` would automatically deploy production, warn EJN first and wait.

Never merge work with known serious bugs, unresolved important review findings, a broken build, missing relevant testing, or a real conflict with another active lane. Fix those issues first.

Do not enable automatic merging. Do not depend on GitHub Actions or paid GitHub features; use direct verification instead.

If something goes wrong after "Push it", diagnose the cause, repair it if clearly within the approved task, verify the repair, and show the result without making EJN perform Git operations.

Normal workflow: EJN asks → agent builds safely → agent tests → agent shows proof → EJN says "Push it" → agent puts finished work in `main` → agent confirms it.
