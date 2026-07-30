// Proves whether the public site is serving this repository's current source.
//
// Needs no secrets, no Vercel token, and no paid service - it fetches the
// public page and compares it against the files in this checkout.
//
// Run with:  node scripts/check-deployed-version.mjs
//            SITE_URL=https://example.com node scripts/check-deployed-version.mjs
//
// Exit code 0 means production matches this checkout on every marker.
// Exit code 1 means it does not - the deployment is stale or points elsewhere.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = (process.env.SITE_URL || 'https://otto-plumbing-site.vercel.app').replace(/\/$/, '');

const localHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const localVersion = JSON.parse(readFileSync(path.join(ROOT, 'version.json'), 'utf8'));

async function get(url) {
  try {
    const r = await fetch(url, { redirect: 'follow' });
    return { status: r.status, body: await r.text() };
  } catch (e) {
    return { status: 0, body: '', error: String(e && e.message || e) };
  }
}

const MARKERS = [
  {
    name: 'version.json is served',
    local: () => 'present',
    remote: (_, v) => (v.status === 200 ? 'present' : `HTTP ${v.status}`),
  },
  {
    name: 'version.json reports this repository',
    local: () => localVersion.repository,
    remote: (_, v) => { try { return JSON.parse(v.body).repository; } catch { return '(not JSON)'; } },
  },
  {
    name: 'version.json reports this commit',
    local: () => localVersion.baselineCommit,
    remote: (_, v) => { try { return JSON.parse(v.body).baselineCommit; } catch { return '(not JSON)'; } },
  },
  {
    name: 'doctype present',
    local: () => (/^<!DOCTYPE html>/i.test(localHtml.trim()) ? 'yes' : 'no'),
    remote: (h) => (/^<!DOCTYPE html>/i.test(h.body.trim()) ? 'yes' : 'no'),
  },
  {
    name: 'translated element count',
    local: () => String((localHtml.match(/data-i18n[=-]/g) || []).length),
    remote: (h) => String((h.body.match(/data-i18n[=-]/g) || []).length),
  },
  {
    name: 'instagram references',
    local: () => String((localHtml.match(/instagram/gi) || []).length),
    remote: (h) => String((h.body.match(/instagram/gi) || []).length),
  },
  {
    name: '"5,000+" claim occurrences',
    local: () => String((localHtml.match(/5,000\+/g) || []).length),
    remote: (h) => String((h.body.match(/5,000\+/g) || []).length),
  },
  {
    name: '"5.0" rating claim occurrences',
    local: () => String((localHtml.match(/5\.0 ★/g) || []).length),
    remote: (h) => String((h.body.match(/5\.0 ★/g) || []).length),
  },
  {
    name: '"24 h" claim occurrences',
    local: () => String((localHtml.match(/24 h/g) || []).length),
    remote: (h) => String((h.body.match(/24 h/g) || []).length),
  },
];

const page = await get(SITE + '/');
const version = await get(SITE + '/version.json');

console.log(`\nsource    : this checkout (${localVersion.repository} @ ${localVersion.baselineCommit.slice(0, 7)})`);
console.log(`production: ${SITE}  -> HTTP ${page.status}\n`);

if (page.status !== 200) {
  console.log('Could not fetch the production page, so nothing can be proved either way.');
  if (page.error) console.log('  ' + page.error);
  process.exit(1);
}

let mismatches = 0;
console.log(`${'marker'.padEnd(38)} ${'source'.padEnd(24)} production`);
console.log('-'.repeat(90));
for (const m of MARKERS) {
  const a = String(m.local());
  const b = String(m.remote(page, version));
  const same = a === b;
  if (!same) mismatches++;
  console.log(`${(same ? '  ' : '! ') + m.name.padEnd(36)} ${a.padEnd(24)} ${b}`);
}

console.log();
if (mismatches === 0) {
  console.log('MATCH - production is serving this checkout.');
  process.exit(0);
}
console.log(`MISMATCH on ${mismatches} of ${MARKERS.length} markers.`);
console.log("Production is not serving this repository's current source.");
console.log('See docs/DEPLOYMENT-MISMATCH.md for what to check.');
process.exit(1);
