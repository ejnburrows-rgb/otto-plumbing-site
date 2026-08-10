/* Regression test for the OTTO Plumbing customer intake submission flow.
 * Zero dependencies. Run with: node --test tests/intake-core.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, '..', 'intake-core.js'), 'utf8');
const load = new Function('globalThis', source + '\nreturn globalThis.OTTOIntakeCore;');
const core = load({});

const ENDPOINT = 'https://formspree.io/f/testtest';

function goodRequest(overrides = {}) {
	return {
		name: 'Maria Lopez',
		phone: '(305) 555-0142',
		email: 'maria@example.com',
		service: 'leak',
		location: 'Hialeah, FL',
		contactPreference: 'text',
		details: 'Kitchen sink is leaking under the cabinet since last night.',
		...overrides,
	}
}

function response(status, body) {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async () => body,
	}
}

test('a complete request passes validation and keeps every supplied field', () => {
	const result = core.validate(goodRequest())
	assert.equal(result.valid, true)
	assert.deepEqual(result.errors, {})
	assert.equal(result.values.name, 'Maria Lopez')
	assert.equal(result.values.service, 'leak')
	assert.equal(result.values.location, 'Hialeah, FL')
	assert.equal(result.values.contactPreference, 'text')
})

test('missing required fields are reported and nothing is treated as valid', () => {
	const result = core.validate(goodRequest({ name: '', phone: '', service: '', details: '' }))
	assert.equal(result.valid, false)
	assert.equal(result.errors.name, 'required')
	assert.equal(result.errors.phone, 'required')
	assert.equal(result.errors.service, 'required')
	assert.equal(result.errors.details, 'required')
	assert.deepEqual(result.invalidFields, ['name', 'phone', 'service', 'details'])
})

test('invalid phone numbers are rejected and valid formats are accepted', () => {
	assert.equal(core.validate(goodRequest({ phone: '555-01' })).errors.phone, 'phone')
	assert.equal(core.validate(goodRequest({ phone: '1111111111' })).errors.phone, 'phone')
	assert.equal(core.validate(goodRequest({ phone: '+1 786 344 2837' })).valid, true)
	assert.equal(core.formatPhone('17863442837'), '(786) 344-2837')
})

test('an invalid email is rejected but an empty email is allowed', () => {
	assert.equal(core.validate(goodRequest({ email: 'maria@@example' })).errors.email, 'email')
	assert.equal(core.validate(goodRequest({ email: '' })).valid, true)
})

test('input is sanitized and length capped before it leaves the browser', () => {
	const values = core.sanitize({
		name: '  Maria\u0000   Lopez  ',
		phone: '(305) 555-0142',
		email: ' MARIA@EXAMPLE.COM ',
		service: 'leak',
		details: 'x'.repeat(5000),
	})
	assert.equal(values.name, 'Maria Lopez')
	assert.equal(values.email, 'maria@example.com')
	assert.equal(values.details.length, core.LIMITS.details)
})

test('anti-spam catches the honeypot and instant submissions', () => {
	const values = core.validate(goodRequest()).values
	assert.equal(core.checkSpam({ values, honeypot: 'buy-now', elapsedMs: 60000 }), 'honeypot')
	assert.equal(core.checkSpam({ values, honeypot: '', elapsedMs: 100 }), 'tooFast')
	assert.equal(core.checkSpam({ values, honeypot: '', elapsedMs: 60000 }), null)
})

test('an identical resubmission produces an identical fingerprint', () => {
	const a = core.fingerprint(core.validate(goodRequest()).values)
	const b = core.fingerprint(core.validate(goodRequest()).values)
	const c = core.fingerprint(core.validate(goodRequest({ details: 'Different problem entirely.' })).values)
	assert.equal(a, b)
	assert.notEqual(a, c)
})

test('the payload carries readable job information', () => {
	const payload = core.buildPayload(core.validate(goodRequest()).values, { language: 'es', page: 'https://otto-plumbing-site.vercel.app/' })
	assert.equal(payload.name, 'Maria Lopez')
	assert.equal(payload.phone, '(305) 555-0142')
	assert.equal(payload.service, 'Leak repair')
	assert.equal(payload.contactPreference, 'Text message')
	assert.equal(payload.language, 'es')
	assert.match(payload._subject, /Website service request - Maria Lopez/)
})

test('the email fallback is pre-filled with the entered request', () => {
	const href = core.buildMailtoUrl('office@example.com', core.validate(goodRequest()).values, 'en')
	assert.ok(href.startsWith('mailto:office@example.com?subject='))
	assert.ok(decodeURIComponent(href).includes('Phone: (305) 555-0142'))
	assert.equal(core.buildMailtoUrl('', core.validate(goodRequest()).values, 'en'), '')
})

test('an unconfigured endpoint never attempts a send', async () => {
	let called = false
	await assert.rejects(
		core.deliverIntake({ endpoint: '', payload: {}, fetchImpl: () => { called = true } }),
		(error) => error.code === 'notConfigured',
	)
	assert.equal(called, false)
})

test('delivery succeeds only when the receiving system accepts it', async () => {
	let sentBody = null
	const result = await core.deliverIntake({
		endpoint: ENDPOINT,
		payload: core.buildPayload(core.validate(goodRequest()).values, {}),
		fetchImpl: async (url, init) => {
			assert.equal(url, ENDPOINT)
			assert.equal(init.method, 'POST')
			sentBody = JSON.parse(init.body)
			return response(200, { ok: true })
		},
	})
	assert.equal(result.ok, true)
	assert.equal(sentBody.name, 'Maria Lopez')
	assert.equal(sentBody.details, 'Kitchen sink is leaking under the cabinet since last night.')
})

test('a server error is surfaced as a failure, never as a success', async () => {
	await assert.rejects(
		core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => response(500, { error: 'boom' }) }),
		(error) => error.code === 'server' && error.status === 500,
	)
})

test('a rejected submission is surfaced as a failure', async () => {
	await assert.rejects(
		core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => response(422, { errors: [{ message: 'Form not found' }] }) }),
		(error) => error.code === 'rejected' && error.detail === 'Form not found',
	)
})

test('a 200 response that reports an error is still a failure', async () => {
	await assert.rejects(
		core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => response(200, { ok: false, error: 'inactive form' }) }),
		(error) => error.code === 'rejected',
	)
})

test('a network error is not swallowed', async () => {
	await assert.rejects(
		core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => { throw new TypeError('Failed to fetch') } }),
		(error) => error.code === 'network',
	)
})

test('a hung request times out instead of reporting success', async () => {
	await assert.rejects(
		core.deliverIntake({ endpoint: ENDPOINT, payload: {}, timeoutMs: 25, fetchImpl: () => new Promise(() => {}) }),
		(error) => error.code === 'timeout',
	)
})

test('placeholder endpoints are treated as not configured', () => {
	assert.equal(core.isConfiguredEndpoint('https://formspree.io/f/YOUR_FORM_ID'), false)
	assert.equal(core.isConfiguredEndpoint('http://formspree.io/f/testtest'), false)
	assert.equal(core.isConfiguredEndpoint(ENDPOINT), true)
})
