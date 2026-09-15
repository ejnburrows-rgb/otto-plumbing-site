# Production deployment status

## Authoritative source

- Repository: `ejnburrows-rgb/otto-plumbing-site`
- Branch: `main`
- Production URL: https://otto-plumbing-site.vercel.app
- Vercel project: `otto-plumbing-site`

## Current release action

The Vercel project/domain configuration has been corrected. This commit intentionally triggers a fresh `main` production deployment so the stable production alias can attach to the current source instead of the older pinned deployment.

After deployment, production is considered correct only when:

1. `https://otto-plumbing-site.vercel.app` serves the same customer-facing site as the newest READY `main` deployment.
2. The page includes the current OTTO Plumbing service-request experience and English/Spanish behavior.
3. The old internal release/QA wording (including `Immediate delivery version`) is absent.
4. `/version.json` identifies this repository and `main` when that endpoint is present in the deployed build.

Do not create a second Vercel project for this site. `otto-plumbing-site` is the authoritative project.
