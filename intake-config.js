/* OTTO Plumbing Inc. - customer intake delivery configuration.
 *
 * This file holds NO secrets. A Formspree form endpoint is a public URL, the
 * same way a form `action` attribute is public. Never put an API key, password,
 * or service credential in this file.
 *
 * TO SWITCH ONLINE SUBMISSION ON:
 *   1. Create the form at https://formspree.io (free plan is enough).
 *   2. Set the form's notification email to the OTTO office inbox.
 *   3. Paste the endpoint below, e.g. 'https://formspree.io/f/abcdwxyz'.
 *   4. Commit on a branch and open a pull request.
 *
 * While `endpoint` is empty the website does NOT pretend to send anything. It
 * validates the request, then hands the customer the phone line and a
 * pre-filled email instead. See docs/INTAKE-SETUP.md.
 */
window.OTTO_INTAKE_CONFIG = {
  endpoint: '',
  fallbackEmail: 'hernandezotto77@gmail.com',
  timeoutMs: 15000
};
