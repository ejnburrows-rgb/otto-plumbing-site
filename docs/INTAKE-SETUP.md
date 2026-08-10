# Customer intake workflow - setup and behaviour

The website request form is fully built in code. Online sending is switched off
until one public endpoint is pasted into `intake-config.js`. Nothing else in the
repository needs to change.

## Files

| File | Role |
|---|---|
| `index.html` | Form markup inside the existing `#contact` section, plus scoped `.intake-*` styles |
| `intake-core.js` | Sanitizing, validation, anti-spam, duplicate fingerprint, delivery call. No DOM, no secrets |
| `intake.js` | Form wiring: loading state, status messages, English/Spanish copy, fallbacks |
| `intake-config.js` | The one line to edit to switch online sending on |
| `tests/intake-core.test.mjs` | Regression test for the submission flow (`node --test tests/intake-core.test.mjs`) |

## Fields collected

Name and phone and service and details are required. Email, city or address, and
preferred contact method are optional. No other fields are collected.

Form element IDs (do not rename without updating `intake.js`): `intakeForm`,
`intakeName`, `intakePhone`, `intakeEmail`, `intakeService`, `intakeLocation`,
`intakeContact`, `intakeDetails`, `intakeCompany` (honeypot), `intakeSubmit`,
`intakeStatus`, `intakeFallback`, `intakeMailto`.

## External setup still required

1. Create a form at <https://formspree.io> on the free plan.
2. Set its notification email to the OTTO office inbox.
3. Copy the endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
4. Paste it into `endpoint` in `intake-config.js` on a branch and open a pull
   request.
5. After the deploy, submit one real test request and confirm the office
   receives the email.

A Formspree endpoint is a public URL, exactly like a form `action` attribute, so
it belongs in the repository. No API key, password, or service credential is
used anywhere in this workflow. Nothing is stored in the browser and nothing is
sent to Supabase or the CRM.

## Behaviour before that setup is done

The form validates the request, then tells the customer plainly that online
sending is not switched on and offers the phone line, a text link, and a
pre-filled email to `hernandezotto77@gmail.com`. It never claims a request was
sent.

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
7. On failure the entered information stays in the form and the phone, text, and
   pre-filled email fallbacks appear.

## Related open platform issue

`docs/DEPLOYMENT-MISMATCH.md` records that production has served stale content.
Confirm `/version.json` matches the deployed commit before judging the live form.
