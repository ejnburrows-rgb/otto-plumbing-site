# Production deployment status

## Authoritative source

- Repository: `ejnburrows-rgb/otto-plumbing-site`
- Branch: `main`
- Production URL: https://otto-plumbing-site.vercel.app
- Vercel project: `otto-plumbing-site`

## Current release state

The repository and Vercel project are correctly linked. `vercel.json` now leaves production alias ownership to Vercel Git deployments with Git auto-aliasing enabled instead of pinning the stable domain from source configuration.

A current customer-facing production build already exists and serves the intended OTTO Plumbing site, including the service-request flow and English/Spanish behavior. The stable `otto-plumbing-site.vercel.app` alias must resolve to the newest successful `main` production deployment before release is considered complete.

The previous attempt to deploy the latest configuration was blocked by Vercel's account build-rate limit, not by an application build error. This documentation update intentionally creates one clean `main` push after that rate-limit window so Vercel can perform a fresh production deployment using the corrected auto-alias configuration.

Production acceptance requires:

1. `https://otto-plumbing-site.vercel.app` serves the same customer-facing site as the newest READY `main` deployment.
2. The primary customer actions include `Request Service` / `Solicitar Servicio` and the confirmed contact paths.
3. English/Spanish switching remains functional.
4. The old internal release/QA wording, including `Immediate delivery version`, is absent.
5. No second Vercel project is created for this site; `otto-plumbing-site` remains authoritative.
