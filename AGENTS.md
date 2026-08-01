# AGENTS.md — permanent repository rules

You are EJN's development team. EJN is the owner and client, not the project manager. The repository must brief you so he does not have to repeat the project story.

## Read first, in this order

1. `AGENTS.md` — permanent safety and working rules.
2. `docs/REPO-CONTROL.md` — current objective, priorities, and decision rights.
3. `docs/STATUS.md` — verified site state and known blockers.
4. `docs/DECISIONS.md` — why major choices were made.

Old task queues, outside-repository status files, branch reports, PR descriptions, and tool-specific prompts are reference material only unless `docs/REPO-CONTROL.md` explicitly activates them.

## Communication

- Be direct and use plain language.
- Give the owner the problem, why it matters, what will be done, and the evidence.
- Do not drip-feed work that can be completed and reported in one pass.
- Ask only questions whose answers materially change the work.

## Product facts that must not be invented

- Name: OTTO Plumbing Inc.
- Phone: (786) 344-2837 / `tel:+17863442837`
- Experience: 30+ years; founded 1996
- Licence: #CFC1429613
- Hours: Mon–Sat, 7 AM–7 PM
- Service area: South Florida
- Email fallback: hernandezotto77@gmail.com

Never invent testimonials, certifications, awards, locations, social accounts, prices, response times, guarantees, or service claims.

## Before changing anything

- Confirm the exact repository, branch, remote, and current commit.
- Read the current control and status documents.
- Re-read each file immediately before editing it.
- Preserve working behavior and use the smallest high-quality change.
- This is a static site; do not introduce a framework, build system, database, or paid service without director approval.

## Safety

- Never commit secrets, tokens, passwords, private customer data, or fallback credentials.
- Never fake contact-form success. Submit to a verified endpoint or show an honest fallback.
- Never invent test results, screenshots, deployment claims, links, or file paths.
- Never force-push or rewrite shared history.
- Never deploy client-visible changes, add paid services, publish new claims, or make irreversible cleanup without director approval.
- Say exactly what will be removed before destructive work.

## Git and pull requests

- Never commit directly to `main`.
- Start from current `main` on a focused branch.
- Open one clear pull request with acceptance criteria.
- Do not merge while required checks or direct verification are failing, missing, or unknown.
- Never include an AI or tool name in commit authors, messages, co-author lines, or PR text.
- Commit as `EJN <ejnburrows@gmail.com>`.
- Do not bulk-delete branches using an old report; verify against current GitHub state.

## Design and content

- The site must remain professional, bilingual, responsive, and accessible.
- OTTO is always written in capital letters.
- No mascots or cartoon creative unless the director explicitly approves it.
- Approved design references are specifications, not suggestions. Match them closely and prove the result visually.
- Commit real assets and reference them locally. Do not paste generation prompts or temporary remote asset URLs into the site.
- Preserve English and Spanish parity; changing visible copy requires checking both languages.

## Definition of done

A change is not done until all applicable evidence exists:

1. The site opens successfully from the changed source.
2. The real page is exercised in a browser at phone and desktop widths.
3. JavaScript errors, broken images, dead controls, and unintended horizontal scrolling are zero.
4. English and Spanish behavior is checked when visible content changes.
5. Accessibility and contrast are checked when UI changes.
6. The visible result is captured with screenshots or equivalent direct evidence.
7. The deployment source and live version are verified when claiming production readiness.
8. The diff is reviewed against the approved objective.
9. `docs/STATUS.md` receives one factual dated update.

## Reporting

Every report must state:

- **Works** — verified with evidence.
- **Broken** — confirmed fault and impact.
- **Blocked** — exact dependency and who controls it.
- **Changed** — files and visible behavior changed.
- **Not done yet** — remaining work.

No evidence means not done.

## Tool neutrality

Any capable agent may work in this repository. These rules govern the work, not the tool.

## Corrected twice?

When the same failure or misunderstanding occurs twice, update this file or `docs/REPO-CONTROL.md` so it does not happen again.
