# OTTO Plumbing Inc. website

Public website for OTTO Plumbing Inc., including bilingual English/Spanish content, responsive desktop/mobile layouts, direct call/text actions, WhatsApp handoff, and the customer service-request intake flow.

## Production

- Authoritative branch: `main`
- Vercel project: `otto-plumbing-site`
- Production URL: https://otto-plumbing-site.vercel.app
- Deploy workflow: pushes to `main` build a Vercel production deployment.

## Customer intake

The service-request form posts to the existing Supabase Edge Function at `website-intake`. No paid AI service is used. The public configuration contains no secrets and falls back to the published OTTO contact paths if delivery is unavailable.

## Release state

Current `main` contains the intended customer-facing site. English/Spanish, mobile layouts, call/text actions, WhatsApp configuration, and CRM-connected intake must remain working for release.

Known deployment concern: the stable Vercel production domain must be verified after each production build to ensure it is serving the latest `main` deployment rather than an older cached/aliased build.
