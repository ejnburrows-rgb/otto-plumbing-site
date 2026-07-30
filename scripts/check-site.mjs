// Static checks for the OTTO Plumbing site.
//   - EN/ES translation dictionaries cover exactly the same keys
//   - every data-i18n / data-i18n-ph / data-i18n-aria attribute resolves
//   - manifest.json is valid JSON, every SVG parses, internal anchors resolve
//   - the three removed claims stay removed
//   - the contact form never claims a message was delivered
//
// Run with:  node scripts/check-site.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(ROOT, 'index.html'), 'utf8');

let passed = 0, failed = 0;
function check(name, ok, detail = '') {
  if (ok) { passed++; console.log(`  ok   ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? '\n       ' + detail : ''}`); }
}

// ── dictionaries ─────────────────────────────────────────────────────────────
const dictSrc = html.match(/const translations = (\{[\s\S]*?\n\});/);
if (!dictSrc) { console.error('could not find the translations object'); process.exit(1); }
const translations = new Function(`return ${dictSrc[1]};`)();
const en = Object.keys(translations.en).sort();
const es = Object.keys(translations.es).sort();

console.log('\ntranslation dictionaries');
check('EN and ES define the same number of keys', en.length === es.length, `en=${en.length} es=${es.length}`);
const missingEs = en.filter(k => !(k in translations.es));
const missingEn = es.filter(k => !(k in translations.en));
check('no key missing from Spanish', missingEs.length === 0, missingEs.join(', '));
check('no key missing from English', missingEn.length === 0, missingEn.join(', '));

const identical = en.filter(k => {
  const a = translations.en[k], b = translations.es[k];
  if (a !== b) return false;
  // Values that are legitimately the same in both languages.
  return !/^(OTTO|\(786\)|©|30\+)/.test(a) && k !== 'meta.title';
});
check('no Spanish value left as the English string', identical.length === 0, identical.join(', '));

const emptyEs = es.filter(k => !String(translations.es[k]).trim());
check('no empty Spanish value', emptyEs.length === 0, emptyEs.join(', '));

// ── every referenced key exists ──────────────────────────────────────────────
console.log('\nmarkup references');
for (const attr of ['data-i18n', 'data-i18n-ph', 'data-i18n-aria']) {
  const keys = [...html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))].map(m => m[1]);
  const unresolved = [...new Set(keys)].filter(k => !(k in translations.en) || !(k in translations.es));
  check(`${attr}: all ${new Set(keys).size} keys resolve in both languages`,
    unresolved.length === 0, unresolved.join(', '));
}

// Keys defined but never used, so the dictionaries do not rot.
const referenced = new Set([...html.matchAll(/data-i18n(?:-ph|-aria)?="([^"]+)"/g)].map(m => m[1]));
for (const k of ['meta.title', 'meta.desc', 'form.sending', 'aria.closeMenu']) referenced.add(k); // used from JS
const orphans = en.filter(k => !referenced.has(k));
check('no orphaned dictionary keys', orphans.length === 0, orphans.join(', '));

// ── approved claim removals ──────────────────────────────────────────────────
console.log('\napproved claim removals');
for (const claim of ['5,000+', '5.0 ★', '24 h', 'stat.jobs', 'stat.rating', 'stat.response']) {
  check(`"${claim}" is gone`, !html.includes(claim));
}
check('no replacement number was invented',
  !/\b(4,000|6,000|1,000|4\.9|4\.8|48 h|12 h)\b/.test(html));

// ── the contact form must not claim delivery ─────────────────────────────────
console.log('\ncontact form honesty');
const claimsSent = /has been sent|ha sido enviado|message was sent|mensaje fue enviado(?! )/i;
const notePart = html.slice(html.indexOf('id="form-note"'), html.indexOf('id="form-note"') + 800);
check('the visible form note does not claim the message was sent', !claimsSent.test(notePart));
for (const lang of ['en', 'es']) {
  const vals = Object.entries(translations[lang]).filter(([k]) => k.startsWith('form.'));
  const bad = vals.filter(([, v]) => /has been sent|ha sido enviado/i.test(v));
  check(`no ${lang} form string claims delivery`, bad.length === 0, bad.map(([k]) => k).join(', '));
}
check('form endpoint is still unconfigured (no lead capture added)',
  /const FORMSPREE_ENDPOINT = "";/.test(html));

// ── document language ────────────────────────────────────────────────────────
console.log('\ndocument language');
check('setLang sets document.documentElement.lang', /document\.documentElement\.lang = lang;/.test(html));
check('setLang updates the page title from the dictionary', /document\.title = dict\["meta\.title"\]/.test(html));
check('setLang updates the meta description', /meta\[name="description"\]/.test(html));

// ── internal anchors ─────────────────────────────────────────────────────────
console.log('\ninternal anchors');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const anchors = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))];
const broken = anchors.filter(a => a && !ids.has(a));
check(`all ${anchors.length} internal anchors resolve`, broken.length === 0, broken.join(', '));

// ── JSON and SVG assets ──────────────────────────────────────────────────────
console.log('\nassets');
try { JSON.parse(readFileSync(path.join(ROOT, 'manifest.json'), 'utf8')); check('manifest.json is valid JSON', true); }
catch (e) { check('manifest.json is valid JSON', false, e.message); }
try { JSON.parse(readFileSync(path.join(ROOT, 'version.json'), 'utf8')); check('version.json is valid JSON', true); }
catch (e) { check('version.json is valid JSON', false, e.message); }

for (const f of readdirSync(ROOT).filter(f => f.endsWith('.svg'))) {
  const src = readFileSync(path.join(ROOT, f), 'utf8');
  const opens = (src.match(/<(?!\/|\?|!)[a-zA-Z]/g) || []).length;
  const closes = (src.match(/<\/[a-zA-Z]/g) || []).length + (src.match(/\/>/g) || []).length;
  check(`${f} tags balance`, opens === closes, `${opens} open vs ${closes} closed`);
}

// ── basic HTML sanity ────────────────────────────────────────────────────────
console.log('\nHTML sanity');
check('has a <title>', /<title>[^<]+<\/title>/.test(html));
check('has a meta description', /<meta name="description"/.test(html));
check('has a single <main>', (html.match(/<main[\s>]/g) || []).length === 1);
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
check('every <img> has alt text', imgs.every(t => /\salt=/.test(t)), `${imgs.length} images`);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
