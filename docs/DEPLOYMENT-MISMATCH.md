# Production deployment mismatch

**Status: confirmed and reproducible. The public site is not serving this
repository's current `main`.** Nothing in this file changes any hosting
setting; the actions that can only be taken in a dashboard are isolated in
section 5.

- Repository: `ejnburrows-rgb/otto-plumbing-site`
- Production URL: https://otto-plumbing-site.vercel.app

---

## 1. Evidence

Measured 2026-07-30 by fetching the public page and comparing it against this
checkout. Reproduce at any time with:

```
node scripts/check-deployed-version.mjs
```

```
source    : ejnburrows-rgb/otto-plumbing-site @ 53d1ec3
production: https://otto-plumbing-site.vercel.app  → HTTP 200

marker                                 source                   production
------------------------------------------------------------------------------
! version.json is served               present                  HTTP 404
! version.json reports this repository ejnburrows-rgb/...       (not JSON)
! version.json reports this commit     53d1ec3...               (not JSON)
  doctype present                      yes                      yes
! translated element count             70                       62
! instagram references                 0                        4
! "5,000+" claim occurrences           2                        1
! "5.0" rating claim occurrences       2                        1
! "24 h" claim occurrences             2                        1

MISMATCH on 8 of 9 markers.
```

Eight independent markers disagree. Three are decisive on their own:

1. **`/version.json` returns HTTP 404.** The file is committed at the
   repository root and would be served as a static asset by any deployment of
   this repository. Its absence means production is not built from this
   repository's current `main`.
2. **Instagram appears 4 times in production and 0 times in the source.** Those
   links were removed from `main`. A deployment of `main` cannot contain them.
3. **The claim counts differ in *shape*, not just presence.** Each of the three
   claims appears **twice** in the source (hero stat row and trust bar) but
   **once** in production. A merely stale copy of *this* file would show two.
   One occurrence means production is built from markup this repository does
   not contain — an older layout with a single stats block.

A fourth marker points the same way: production **has** a doctype, while `main`
did not until the commit accompanying this document. Production is therefore
not simply *behind* `main` — it is a **different lineage**.

A documentation-only merge to `main` also failed to change the served content,
which rules out browser cache and CDN staleness as sufficient explanations.

---

## 2. Root cause, most to least likely

1. **The production alias belongs to a different Vercel project** — one wired
   to another repository, another branch, or an uploaded/CLI deployment never
   connected to Git. This is the only explanation that accounts for all the
   evidence at once, including the differing claim **counts** and the doctype,
   which indicate different markup rather than older markup.
2. **The project is connected but its production branch is not `main`** — for
   example still pointing at an old working branch. Explains the staleness and
   the 404, but explains the single-occurrence claim counts less well unless
   that branch is very old.
3. **The project's root directory is wrong**, so a different `index.html` is
   published and `version.json` falls outside the served output.
4. **Deploys are failing and the last good deployment is being kept.** Least
   likely: a failed deploy normally leaves the previous *Git* deployment in
   place, which would still carry some of `main`'s history.

Not credible on this evidence: browser cache, CDN cache, or a source-code fault
in this repository. The repository is internally consistent and its committed
files are correct.

---

## 3. Code-side changes made

All inside the repository. No hosting setting was touched.

- **`scripts/check-deployed-version.mjs`** — compares production against this
  checkout across nine markers and exits non-zero on any mismatch. No secrets,
  no Vercel token, no paid service; it only fetches the public URL. This turns
  "the site looks out of date" into a repeatable pass/fail anyone can run.
- **`version.json`** — refreshed to the current `main` commit, with a note
  recording that it is the deployment fingerprint. It is deliberately a plain
  static file, so requesting `/version.json` is a one-second check.
- **`<!DOCTYPE html>` added to `index.html`.** The file began with an HTML
  comment and no doctype, so browsers rendered the site in **quirks mode**
  (`document.compatMode === "BackCompat"`, confirmed in a real browser against
  both `main` and this branch). Quirks mode changes box-model and line-height
  behaviour, so this is a genuine rendering fault, not only a validation one.
  The comment it replaced referenced an editor's local MCP configuration and
  had no effect on the page.

---

## 4. GitHub Actions — investigated; the workflow is NOT at fault

Workflow logic was deliberately left unchanged, because the evidence says the
workflow is not the problem.

**What was checked:**

- Every action reference resolves to a real published version.
  `actions/checkout@v7` **does exist** (v7.0.1, released 2026-07-17). An initial
  assumption that this reference was invalid turned out to be wrong, and was
  verified before anything was edited.
- `.github/workflows/ci.yml` parses as valid YAML and its steps are coherent.

**What the run history actually shows:**

| Run | Branch | Conclusion | Duration |
|---|---|---|---|
| 2026-07-29 21:35 | `main` | failure | 5s |
| 2026-07-29 21:35 | `docs/client-drafts` | failure | 9s |
| 2026-07-29 21:35 | `fix/claims-and-localization` | failure | 4s |
| 2026-07-29 21:55 | `fix/claims-and-localization` | failure | 4s |
| 2026-07-30 10:47 | `fix/approved-claims-and-spanish` | failure | 5s |

Every run on every branch fails in **4–12 seconds**, and **all jobs in a run
fail together** — including jobs whose only shared step is `checkout`. Job logs
return HTTP 404 rather than showing a failed step, and the check runs carry an
empty summary. A run cannot check out a repository, provision a toolchain and
execute a step in five seconds. **No step is running at all.**

The same pattern appears in the sibling CRM repository under the same account,
where all 248 recorded runs ended in `startup_failure` with zero successes.

**Conclusion: an account-level GitHub Actions problem, not a fault in either
repository's workflow files.** No code change here can turn CI green.

---

## 5. Owner-only actions

Two things need a dashboard. Neither can be done from a repository.

**A. Vercel — fix which source the production alias serves.**

Open the Vercel project that currently owns `otto-plumbing-site.vercel.app` and
confirm exactly these three settings:

1. Git repository: `ejnburrows-rgb/otto-plumbing-site`
2. Production branch: `main`
3. Root directory: repository root

If any is wrong, correct it and redeploy the latest `main`. Do **not** create a
second project, and do **not** change the domain, unless the alias is proven to
belong to the wrong project — that would leave two projects competing for one
name.

**B. GitHub — re-enable Actions for the account.**

Check, in order:

1. Repository → Settings → Actions → General → confirm Actions are allowed.
2. The account's billing page → confirm Actions minutes are not exhausted and
   that no payment method has failed.

Section 4 is the evidence to bring to that check.

---

## 6. How to prove it is fixed

After the owner has completed section 5A, run:

```
node scripts/check-deployed-version.mjs
```

Fixed means **`MATCH — production is serving this checkout.`** and exit code 0.

The two decisive markers to watch:

- `https://otto-plumbing-site.vercel.app/version.json` returns HTTP 200 with
  `"repository": "ejnburrows-rgb/otto-plumbing-site"` and a `baselineCommit`
  matching the deployed commit.
- Instagram references drop from 4 to 0.

Until `/version.json` returns 200, the production alias is still serving
something other than this repository.
