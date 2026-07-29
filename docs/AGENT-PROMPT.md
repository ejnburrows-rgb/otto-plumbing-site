# Autonomous Agent Prompt — OTTO website

**How to use:** open your coding agent in this repo and say: "Read docs/AGENT-PROMPT.md and execute it."

---

Repo: github.com/ejnburrows-rgb/otto-plumbing-site — owner ejnburrows-rgb. PUBLIC repo, so assume everything you write is visible to the world. Static single-page site: index.html holds all markup, styles and scripts. No build step — a push to main deploys live.

Read first: AGENTS.md, README.md, PWA-ICON-NOTES.md.

## RULES

- Never commit to main. On this repo main is production. Branch + PR only. The owner merges.
- OTTO is always in all caps.
- Never invent business facts. This is a licensed trade. Do not write a phone number, license number, review, price, year-founded, or service-area claim the owner has not given you. If a real value is missing, leave a visible TODO(owner) and list it in the PR.
- Proof required: file:line or a screenshot.

## PHASE 1 — MERGE (5 open PRs)

1. **#1 and #2 are designed to apply together** — #1 covers manifest/AGENTS.md/docs, #2 covers the index.html half of the same work (OTTO brand caps + making the Formspree contact form fail honestly instead of silently when the endpoint isn't configured). Merge #1 then #2. Confirm after both land that there is exactly one Formspree failure path, not two competing ones.
2. Then the three Dependabot bumps: **#5** (anishathalye/proof-html 1→2), **#6** (gitleaks-action 2→3), **#7** (actions/checkout 4→7). Check .github/workflows for breaking-change fallout — checkout v7 blocks fork PR checkout under pull_request_target, and gitleaks v3 moves to the Node 24 runtime. If a workflow breaks, fix it in the same PR. If CI goes red after any of these, revert that one and report why.

## PHASE 2 — MAKE THE CONTACT PATH ACTUALLY WORK

Branch fix/contact-path-reliability. Find every way a customer can reach OTTO on this page and test each one. Report which are live and which are dead. At minimum:
- tel: links must be real, tappable, and correctly formatted on iOS and Android
- the contact form must show a clear success state, and a clear failure state that still gives the customer the phone number
- no form submission may silently vanish

Done when: you can show a screenshot of a successful submit and a screenshot of the failure state with the phone fallback visible.

## PHASE 3 — QUALITY AND ACCESSIBILITY PASS

Branch fix/quality-and-a11y-pass. Fixes only, no redesign:
- contrast to 4.5:1 (the faint service-card text is a known offender)
- accessible names on every button and link, alt text on every image
- the 512px icon is currently a duplicate of the 192px one — see PWA-ICON-NOTES.md. Generate a real 512px icon from the existing source art. Do not draw new art or add a mascot.
- mobile first: test at 390px wide before anything else. Most of OTTO's customers arrive by phone.

Proof: before/after screenshots at 390px.

## PHASE 4 — SPANISH VERSION, PLANNING ONLY

Branch docs/spanish-version-plan. Do not translate anything yet. Write docs/SPANISH-PLAN.md listing every string that would need translating, and recommend one approach (separate page vs in-page toggle) with a reason. Translation of customer-facing marketing copy is the owner's call.

Then stop and write docs/SITE-INVENTORY.md: every section, link, form and asset on the page, and which are placeholder vs real. Branch docs/site-inventory.

PR body format: What changed · Why · What the owner should check · What is still not done · Proof.
