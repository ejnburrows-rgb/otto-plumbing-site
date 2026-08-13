import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const logo = readFileSync(new URL('../logo.jpg', import.meta.url));
const copy = readFileSync(new URL('../prestige.js', import.meta.url), 'utf8');
const polish = readFileSync(new URL('../production-polish.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mobilePolish = readFileSync(new URL('../prestige-polish.css', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../shell.js', import.meta.url), 'utf8');
const shellStyles = readFileSync(new URL('../shell.css', import.meta.url), 'utf8');
const intakeConfig = readFileSync(new URL('../intake-config.js', import.meta.url), 'utf8');

test('uses the supplied official company logo without alteration', () => {
  assert.equal(
    createHash('sha256').update(logo).digest('hex'),
    'c65156b7497dd40f83a270272021ac069af95964f00bb6dbce8fbc34fcfbfc4a'
  );
});

test('publishes the company slogan in English and Spanish', () => {
  assert.match(copy, /Making water flow through our pipes, like integrity through our name/);
  assert.match(copy, /Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre/);
});

test('shows more than 30 years prominently in both languages', () => {
  assert.match(copy, /experienceValue: '30\+ YEARS'/);
  assert.match(copy, /experienceValue: 'MÁS DE 30 AÑOS'/);
  assert.match(polish, /\.experience-banner strong/);
});

test('clearly includes residential and commercial buildings across South Florida', () => {
  assert.match(copy, /homes, businesses, and buildings/);
  assert.match(copy, /hogares, negocios y edificios/);
  assert.match(copy, /commercial plumbing/);
  assert.match(copy, /Plomería profesional/);
});

test('uses the concise WhatsApp contact invitation in both languages', () => {
  assert.match(copy, /Contact us on WhatsApp/);
  assert.match(copy, /Tap the link and we’ll get in touch with you/);
  assert.match(copy, /Contáctenos por WhatsApp/);
  assert.match(copy, /Contáctenos, presione el enlace y nos comunicaremos con usted/);
  assert.doesNotMatch(copy, /Prepare (a|un) WhatsApp message/);
});

test('centers the logo inside a seamless matching navy band', () => {
  assert.match(polish, /background:\s*#0b1222/);
  assert.match(polish, /grid-template-areas:\s*"links brand actions"/);
  assert.match(polish, /justify-self:\s*center/);
  assert.match(polish, /\.brand[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/);
});

test('publishes only the confirmed credential claims', () => {
  assert.doesNotMatch(page, /bbb\.org|A\+ rating|July 2026 license verification/);
  assert.doesNotMatch(copy, /Better Business Bureau|July 2026 license verification/);
  assert.match(page, /CFC1429613/);
});

test('keeps mobile call, language, and sticky navigation paths available', () => {
  assert.doesNotMatch(mobilePolish, /\.nav-actions\s*>\s*\.call-btn\s*\{\s*display:\s*none/);
  assert.doesNotMatch(polish, /\.nav-actions\s+\.toggle-group\s*\{\s*display:\s*none/);
  assert.match(polish, /\.nav\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(shell, /class="shell-callbar"/);
});

test('adds touch-specific controls for Android phones and tablets', () => {
  assert.match(page, /viewport-fit=cover/);
  assert.match(page, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(page, /touch-action:\s*manipulation/);
  assert.match(shellStyles, /min-width:\s*721px[\s\S]*?max-width:\s*980px[\s\S]*?pointer:\s*coarse/);
  assert.match(shellStyles, /\.shell-callbar[\s\S]*?display:\s*grid/);
  assert.match(polish, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*?\.shell-menu-btn[\s\S]*?min-height:\s*48px/);
  assert.match(polish, /\.nav-actions\s*>\s*\.call-btn[\s\S]*?min-width:\s*48px/);
});

test('configures the confirmed email fallback', () => {
  assert.match(intakeConfig, /fallbackEmail:\s*'hernandezotto77@gmail\.com'/);
});

test('includes parseable Plumber structured data', () => {
  const match = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'Plumber');
  assert.equal(data.telephone, '+1-786-344-2837');
  assert.equal(data.identifier.value, 'CFC1429613');
});
