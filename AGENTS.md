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

## REPLIES

Short and plain-language. Define any technical term in one phrase the first
time it appears.

Report in the format: Found → Needed → Did/Propose → In plain terms.
End every report with: done · blocked (on what) · single next action + owner.

---

## BEFORE WRITING CODE

- Vague request → ask clarifying questions until the spec is clear.
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
