# AGENTS.md — OTTO Plumbing Inc. website

**Read this fully before doing anything. `CLAUDE.md` is a one-line pointer back to this file.**

## PROJECT

Static marketing website for OTTO Plumbing Inc., a South Florida plumbing business. This repo holds the source that auto-deploys to https://otto-plumbing-site.vercel.app on every push to `main`.

## HARD RULES

- **Never commit to `main`.** All changes go on a branch as a pull request.
- **Client name is always written OTTO** (all caps).
- **No mascots or cartoon creative.** This is a business/trades site; keep deliverables professional.
- **No secrets in code.** No API keys, tokens, or passwords in the source. Use environment variables if the site ever needs them.
- **One agent per repo at a time.** Read the project's `STATUS.md` in `dev-firm-compass` before starting, and update it before ending.
- **Cross-agent review:** the agent that authored a PR never approves it. A different agent reviews and posts a plain-English verdict + a 3-item "what E N should personally check" list before the PR is presented to E N.

## HOW WE WORK

- Inspect the actual files before claiming anything about the site's condition.
- Prefer small, targeted edits. This is a static site; do not over-engineer.
- Verify UI changes with a real screenshot or live preview before declaring done.
- Report in the format: Found → Needed → Did/Propose → In plain terms.
- End every report with: done · blocked (on what) · single next action + owner.

## WHAT'S LIVE

Production URL: https://otto-plumbing-site.vercel.app

Current status is tracked in `dev-firm-compass/projects/otto-plumbing-site/STATUS.md`.
