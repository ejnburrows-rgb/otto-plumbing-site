# Repository Realignment Template

Use this process when an existing repository has accumulated conflicting AI instructions, stale status files, unclear branches, or repeated audits.

## Required outcome

Create one reliable continuation point without restarting the project or rebuilding completed work.

## 1. Confirm the repository

Record:

- owner and repository name,
- default branch,
- current commit,
- local or remote operating mode,
- deployment source,
- and available permissions.

Stop if the repository is not the intended one.

## 2. Establish the authority order

Use:

1. `AGENTS.md` — permanent rules
2. `docs/REPO-CONTROL.md` — current objective and priorities
3. `docs/STATUS.md` — factual current state
4. `docs/DECISIONS.md` — durable reasoning

Tool-specific files should only point to this order.

## 3. Separate facts from rules

Permanent rules include:

- safety,
- Git discipline,
- approval requirements,
- verification standards,
- and reporting format.

Changing facts include:

- current commit,
- open PRs,
- deployment status,
- test results,
- active blockers,
- and finish order.

Never hardcode changing facts into every agent file.

## 4. Inspect active instructions

Find every file that may direct an agent, including:

- `AGENTS.md`,
- `CLAUDE.md`,
- `GEMINI.md`,
- `.cursorrules`,
- Copilot instructions,
- autonomous loops,
- task queues,
- status documents,
- and external-repository references.

Classify each as keep, update, archive, delete, or reference-only.

## 5. Record current product truth

State only verified facts:

- what is live,
- what works,
- what is broken,
- what is blocked,
- what is not implemented,
- and what is not verified.

Do not turn assumptions or old reports into current truth.

## 6. Classify branches and pull requests

For each active PR or branch, decide:

- current work,
- merged and removable,
- closed but containing unique work,
- outdated or harmful,
- director decision,
- or safe to archive/delete.

A different tip commit does not automatically mean a branch is unmerged. Compare useful changes with current `main`.

## 7. Define the finish order

Use one prioritized outcome-based sequence. Do not create parallel competing task queues.

Earlier safety, deployment, or data-integrity blockers outrank cosmetic or optional work unless independent work can safely continue.

## 8. Define completion evidence

Require evidence appropriate to the project, such as:

- complete tests,
- static or QA checks,
- real-browser verification,
- mobile and desktop checks,
- screenshots,
- deployment-source proof,
- data-isolation proof,
- and a reviewed diff.

No evidence means not done.

## 9. Publish through one governance PR

The realignment PR should change instructions and documentation only unless the director explicitly authorizes product changes.

It should:

- add the control center,
- add current status and decisions,
- shorten tool-specific pointers,
- retire contradictory loops,
- remove external status dependencies,
- and preserve historical evidence without letting it control current work.

## 10. Close realignment

Realignment is complete when:

- all agents read the same authority chain,
- current facts live in the repository,
- stale instructions cannot override current control,
- active PRs and branches have explicit decisions,
- the finish order is clear,
- and the next session can begin product work without another discovery audit.
