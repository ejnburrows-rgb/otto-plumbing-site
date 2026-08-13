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
const stages = readFileSync(new URL('../stages.js', import.meta.url), 'utf8');

test('uses the supplied official company logo without alteration', () => {
  assert.equal(
    createHash('sha256').update(logo).digest('hex'),
    '003b024a7dafc57efc65459b6ba340a4c1b9aa25f52846a24b2733d0febc4eb2'
  );
  assert.match(page, /class="hero-brand-logo"\s+src="logo\.jpg"/);
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

test('publishes one visible header number with call, SMS, and WhatsApp choices', () => {
  assert.match(page, /class="brand-established">EST\.1996</);
  assert.match(page, /class="header-phone"[^>]+>\(786\) 344-2837<\/a>/);
  assert.match(page, /class="header-contact-link"\s+href="tel:\+17863442837">llamar<\/a>/);
  assert.match(page, /<summary>escribir<\/summary>/);
  assert.match(page, /href="sms:\+17863442837">SMS<\/a>/);
  assert.match(page, /href="https:\/\/wa\.me\/17863442837"/);
  assert.match(intakeConfig, /whatsappNumber:\s*'17863442837'/);
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
  assert.match(polish, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*?\.header-contact-link[\s\S]*?min-height:\s*48px/);
});

test('references complete WebP photographs for every staged panel', () => {
  const photoFiles = [...stages.matchAll(/file:\s*'([^']+\.webp\.b64)'/g)].map((match) => match[1]);
  assert.equal(photoFiles.length, 5);

  for (const photoFile of photoFiles) {
    const base64 = readFileSync(new URL(`../${photoFile}`, import.meta.url), 'utf8').replace(/\s+/g, '');
    const photo = Buffer.from(base64, 'base64');
    assert.equal(photo.subarray(0, 4).toString('ascii'), 'RIFF', `${photoFile} has a valid RIFF header`);
    assert.equal(photo.subarray(8, 12).toString('ascii'), 'WEBP', `${photoFile} is a WebP image`);
    assert.equal(photo.readUInt32LE(4) + 8, photo.length, `${photoFile} is not truncated`);
  }
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
