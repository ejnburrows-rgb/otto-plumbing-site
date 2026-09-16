import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, '..', 'intake-core.js'), 'utf8');
const load = new Function('globalThis', source + '\nreturn globalThis.OTTOIntakeCore;');
const core = load({});
const ENDPOINT = 'https://intake.test/submit';

function goodRequest(overrides = {}) {
  return {
    name: 'Maria Lopez',
    phone: '(305) 555-0142',
    email: 'maria@example.com',
    category: 'leak',
    address: '123 Main St, Hialeah, FL',
    contactPreference: 'text',
    preferredDate: '2026-09-18',
    preferredWindow: 'morning',
    answers: { leakActive: 'yes', leakWhere: 'sink', leakShutoff: 'yes' },
    description: 'Water is visible under the kitchen cabinet.',
    ...overrides,
  };
}

function response(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test('guided request validates and preserves CRM fields', () => {
  const result = core.validate(goodRequest());
  assert.equal(result.valid, true);
  assert.equal(result.values.category, 'leak');
  assert.equal(result.values.address, '123 Main St, Hialeah, FL');
  assert.deepEqual(result.values.answers, { leakActive: 'yes', leakWhere: 'sink', leakShutoff: 'yes' });
  assert.equal(result.values.preferredWindow, 'morning');
});

test('customer and job context are required while description stays optional', () => {
  const missing = core.validate(goodRequest({ name: '', phone: '', category: '', address: '', answers: {} }));
  assert.equal(missing.valid, false);
  assert.equal(missing.errors.name, 'required');
  assert.equal(missing.errors.phone, 'required');
  assert.equal(missing.errors.category, 'required');
  assert.equal(missing.errors.address, 'required');
  assert.equal(core.validate(goodRequest({ description: '' })).valid, true);
});

test('each service requires only its deterministic context answers', () => {
  assert.equal(core.validate(goodRequest({ category: 'drain', answers: { drainScope: 'one', drainFlow: 'slow' } })).valid, true);
  assert.equal(core.validate(goodRequest({ category: 'drain', answers: { drainScope: 'one' } })).errors.answers, 'answers');
  assert.equal(core.validate(goodRequest({ category: 'commercial', answers: { commercialNeed: 'fixture', commercialActive: 'no' } })).valid, true);
  assert.equal(core.validate(goodRequest({ category: 'other', answers: { contextNote: 'Need help identifying a plumbing issue.' } })).valid, true);
});

test('supported service categories include the public guided choices', () => {
  for (const key of ['leak','drain','fixtures','heater','installation','remodel','commercial','other']) {
    assert.ok(core.SERVICE_LABELS[key]);
  }
});

test('phone and email validation remains strict', () => {
  assert.equal(core.validate(goodRequest({ phone: '555-01' })).errors.phone, 'phone');
  assert.equal(core.validate(goodRequest({ phone: '+1 786 344 2837' })).valid, true);
  assert.equal(core.validate(goodRequest({ email: 'bad@@email' })).errors.email, 'email');
  assert.equal(core.validate(goodRequest({ email: '' })).valid, true);
});

test('payload carries source, category, answers, timing and customer data', () => {
  const payload = core.buildPayload(core.validate(goodRequest()).values, { language: 'es', page: 'https://otto-plumbing-site.vercel.app/' });
  assert.equal(payload.source, 'otto-plumbing-site');
  assert.equal(payload.name, 'Maria Lopez');
  assert.equal(payload.phone, '(305) 555-0142');
  assert.equal(payload.category, 'leak');
  assert.equal(payload.address, '123 Main St, Hialeah, FL');
  assert.equal(payload.answers.leakActive, 'yes');
  assert.match(payload.answersSummary, /Active leak now: Yes/);
  assert.equal(payload.preferredDate, '2026-09-18');
  assert.equal(payload.preferredWindow, 'Morning');
  assert.equal(payload.language, 'es');
});

test('email fallback contains the same request context', () => {
  const href = core.buildMailtoUrl('office@example.com', core.validate(goodRequest()).values, 'en');
  const decoded = decodeURIComponent(href);
  assert.ok(href.startsWith('mailto:office@example.com?subject='));
  assert.match(decoded, /Service location: 123 Main St/);
  assert.match(decoded, /Preferred timing: 2026-09-18 · Morning/);
  assert.match(decoded, /Active leak now: Yes/);
});

test('anti-spam and duplicate fingerprint cover guided request content', () => {
  const values = core.validate(goodRequest()).values;
  assert.equal(core.checkSpam({ values, honeypot: 'bot', elapsedMs: 60000 }), 'honeypot');
  assert.equal(core.checkSpam({ values, honeypot: '', elapsedMs: 100 }), 'tooFast');
  assert.equal(core.checkSpam({ values, honeypot: '', elapsedMs: 60000 }), null);
  const a = core.fingerprint(values);
  const b = core.fingerprint(core.validate(goodRequest()).values);
  const c = core.fingerprint(core.validate(goodRequest({ answers: { leakActive: 'no', leakWhere: 'sink', leakShutoff: 'yes' } })).values);
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test('delivery succeeds only after receiver confirms acceptance and exposes response body', async () => {
  let sentBody;
  const result = await core.deliverIntake({
    endpoint: ENDPOINT,
    payload: core.buildPayload(core.validate(goodRequest()).values, {}),
    fetchImpl: async (url, init) => {
      assert.equal(url, ENDPOINT);
      assert.equal(init.method, 'POST');
      sentBody = JSON.parse(init.body);
      return response(200, { ok: true, id: 'web_test_123' });
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.body.id, 'web_test_123');
  assert.equal(sentBody.category, 'leak');
});

test('server, receiver, network and timeout failures never become success', async () => {
  await assert.rejects(core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => response(500, { error: 'boom' }) }), (e) => e.code === 'server');
  await assert.rejects(core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => response(422, { error: 'invalid' }) }), (e) => e.code === 'rejected');
  await assert.rejects(core.deliverIntake({ endpoint: ENDPOINT, payload: {}, fetchImpl: async () => { throw new TypeError('Failed to fetch'); } }), (e) => e.code === 'network');
  await assert.rejects(core.deliverIntake({ endpoint: ENDPOINT, payload: {}, timeoutMs: 20, fetchImpl: () => new Promise(() => {}) }), (e) => e.code === 'timeout');
});

test('unconfigured and placeholder endpoints never send', async () => {
  assert.equal(core.isConfiguredEndpoint('https://example.com/YOUR_FORM_ID'), false);
  assert.equal(core.isConfiguredEndpoint('http://example.com/intake'), false);
  let called = false;
  await assert.rejects(core.deliverIntake({ endpoint: '', payload: {}, fetchImpl: () => { called = true; } }), (e) => e.code === 'notConfigured');
  assert.equal(called, false);
});
