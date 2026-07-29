# Production deployment mismatch

## Remote repository

`ejnburrows-rgb/otto-plumbing-site`

https://github.com/ejnburrows-rgb/otto-plumbing-site

## Production URL

https://otto-plumbing-site.vercel.app

## Confirmed evidence

The production URL is not serving current `main`.

| Marker | Current repository | Production page observed 2026-07-29 |
|---|---|---|
| Instagram links | Removed from current `main` | Still visible |
| `5,000+` claim | Approved for removal in active work | Still visible |
| `5.0 ★` claim | Approved for removal in active work | Still visible |
| `24 h` claim | Approved for removal in active work | Still visible |
| Recent accessibility/icon merge | Present on `main` | Not provable on production |

A documentation-only merge to `main` also failed to change the served production content. This makes browser cache alone unlikely and ranks a wrong Vercel project/repository/production-branch link above a source-code fault.

## Source-controlled proof

`/version.json` identifies the repository, intended source branch, and baseline commit. After every intended production deployment, load:

https://otto-plumbing-site.vercel.app/version.json

The deployment is from the correct source only when that file exists and its repository/branch values match this document. A missing file means the production alias is still serving a different source or an older deployment.

## Owner-only platform gate

In Vercel, open the project currently owning `otto-plumbing-site.vercel.app` and verify exactly these settings:

1. Git repository: `ejnburrows-rgb/otto-plumbing-site`
2. Production branch: `main`
3. Root directory: repository root

Then redeploy the latest `main` commit and recheck `/version.json` plus the visible page markers above.

Do not create a second project or change the domain unless the existing alias is proven to belong to the wrong project.
