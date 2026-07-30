# Production deployment mismatch

**Status: confirmed and reproducible. The public site is not serving this
repository's current `main`.** Nothing in this file changes any hosting
setting; the actions that can only be taken in a dashboard are isolated in
section 5.

- Repository: `ejnburrows-rgb/otto-plumbing-site`
- Production URL: https://otto-plumbing-site.vercel.app

---

## 1. Evidence

Reproduce at any time with:

```
node scripts/check-deployed-version.mjs
```

## 2. Root cause, most to least likely

1. The production alias belongs to a different Vercel project.
2. The project is connected but its production branch is not `main`.
3. The project's root directory is wrong.
4. Deploys are failing and the last good deployment is being kept.

## 3. Code-side changes made

- `scripts/check-deployed-version.mjs` added.
- `version.json` refreshed.
- `<!DOCTYPE html>` added to `index.html`.

## 4. GitHub Actions - investigated; the workflow is NOT at fault

Every run on every branch fails in 4-12 seconds with all jobs failing together and job logs returning HTTP 404. This is an account-level GitHub Actions problem, not a workflow fault. Confirmed matching pattern (248 runs, zero successes) in the sibling CRM repository under the same account.

## 5. Owner-only actions

**A. Vercel** - confirm the project owning `otto-plumbing-site.vercel.app` has Git repository `ejnburrows-rgb/otto-plumbing-site`, production branch `main`, root directory = repo root. Redeploy if wrong.

**B. GitHub** - Settings -> Actions -> General (confirm allowed) and the billing page (confirm minutes/payment).

## 6. How to prove it is fixed

`node scripts/check-deployed-version.mjs` should print `MATCH - production is serving this checkout.` and exit 0.
