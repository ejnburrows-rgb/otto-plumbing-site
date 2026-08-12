# Customer intake workflow - setup and behaviour

The website request form is fully built in code. The confirmed office email
fallback is active. Direct Formspree sending stays switched off until the
client's verified endpoint is added to `intake-config.js`.

## Files

| File | Role |
|---|---|
| `index.html` | Form markup inside the existing `#contact` section, plus scoped `.intake-*` styles |
| `intake-core.js` | Sanitizing, validation, anti-spam, duplicate fingerprint, delivery call. No DOM, no secrets |
| `intake.js` | Form wiring: loading state, status messages, English/Spanish copy, fallbacks |
| `intake-config.js` | Public delivery endpoint, confirmed fallback email, and final-candidate asset bootstrap |
| `tests/intake-core.test.mjs` | Regression test for the submission flow (`node --test tests/intake-core.test.mjs`) |

## Fields collected

Name, phone, service, and details are required. Email, city or address, and
preferred contact method are optional. No other fields are collected.

Form element IDs (do not rename without updating `intake.js`): `intakeForm`,
`intakeName`, `intakePhone`, `intakeEmail`, `intakeService`, `intakeLocation`,
`intakeContact`, `intakeDetails`, `intakeCompany` (honeypot), `intakeSubmit`,
`intakeStatus`, `intakeFallback`, `intakeMailto`.

## External setup still required

1. At the client computer, create or sign in to Formspree using the client's business email.
2. Verify that email and set it as the form notification destination.
3. Create the OTTO Plumbing service-request form and copy its public endpoint.
4. Put that endpoint in `endpoint` in `intake-config.js`.
5. Deploy the candidate, submit one real request from a phone, and confirm the office receives it.
6. Confirm the website shows success only after Formspree accepts the request.

A Formspree endpoint is a public URL, like a form `action` attribute. No API key,
password, or service credential belongs in this repository. Nothing in this
workflow writes customer requests to Supabase or the CRM.

## Behaviour before Formspree setup is done

The form validates customer details and prepares a pre-filled message to the
confirmed office inbox. The visitor must send that message from their own email
app, so the site never claims it was delivered. Direct call and text paths also
remain available.

## Behaviour after that setup is done

1. Required details are validated in the browser; invalid fields are marked.
2. A honeypot field and a minimum fill time block simple bots.
3. Repeat clicks are blocked while a send is in flight, and an identical request
   cannot be sent twice within two minutes.
4. The button switches to a sending state and the form is marked busy.
5. The request is posted as JSON to the configured endpoint.
6. Success is shown only after the endpoint returns a 2xx response that does not
   contain an error. A 4xx, 5xx, timeout, network failure, or an error body all
   produce a clear failure message.
7. On failure the entered information stays in the form and the direct call/text
   paths remain available; the pre-filled email fallback is shown only when a
   confirmed `fallbackEmail` is configured.

## Deployment check

`docs/DEPLOYMENT-MISMATCH.md` records a prior stale-production incident. Before
release, verify the Vercel deployment metadata points to the exact final-candidate
commit and then verify the public production URL after publication.
