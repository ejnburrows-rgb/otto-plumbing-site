# AGENTS.md — mandatory, every session, no exceptions

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
caps). Plain HTML/CSS/JS — no build step. Live site deploys from `main`.

Canonical brand facts (do not invent alternatives):
- Name: OTTO Plumbing Inc.
- Phone: (786) 344-2837 / tel:+17863442837
- Experience: 30+ years, founded 1996
- Licence: #CFC1429613
- Hours: Mon–Sat 7 AM – 7 PM
- Service area: South Florida
- Form email fallback: hernandezotto77@gmail.com

---

## REPLIES

Short and plain-language. Define any technical term in one phrase the first
time it appears.

---

## BEFORE WRITING CODE

- Vague request → ask clarifying questions until the spec is clear.
- Re-read any file immediately before editing it.
- Smallest high-quality change. Never rewrite the whole file when a targeted
  edit does the job — `index.html` is large; surgical edits only.

## BEFORE SAYING "DONE"

1. Verify with real evidence. Never claim something works without checking it.
2. UI changes → open the real page and capture proof.
3. No output = not done. Never fabricate results.

---

## GIT

- **Never commit to `main`.** Branch + pull request with a plain-language
  description.
- Never force-push. Never rewrite shared history.
- Every commit authored `EJN <ejnburrows@gmail.com>`.
- Never put an AI or tool name in commits, messages, or PR text.

---

## SAFETY

- No secrets in code. Never invent Formspree IDs, Instagram handles, phone
  numbers, or licence numbers.
- Contact form: real POST when an endpoint is configured; honest error or
  truthful mailto fallback when not. **Never fake a success message.**
- Human sign-off for anything a client can see on the live site before merge.

---

## IF YOU GET STUCK

One line: what is blocked and the minimum unblock. Then move to the next item.
