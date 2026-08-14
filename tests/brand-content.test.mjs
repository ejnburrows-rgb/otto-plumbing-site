import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const copy = readFileSync(new URL('../prestige.js', import.meta.url), 'utf8');
const polish = readFileSync(new URL('../production-polish.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mobilePolish = readFileSync(new URL('../prestige-polish.css', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../shell.js', import.meta.url), 'utf8');
const stages = readFileSync(new URL('../stages.css', import.meta.url), 'utf8');
const stageMotion = readFileSync(new URL('../stages.js', import.meta.url), 'utf8');
const intakeConfig = readFileSync(new URL('../intake-config.js', import.meta.url), 'utf8');

test('uses the four approved website photographs and supplied company logo', () => {
  const references = [...page.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(references)].sort(), [
    'img/credentials-1996.webp',
    'img/hero-technicians.webp',
    'img/luxury-bathroom.webp',
    'img/services-closeup.webp',
    'logo.jpg'
  ]);
});

test('publishes the company slogan in English and Spanish', () => {
  assert.match(copy, /Making water flow through our pipes, like integrity through our name/);
  assert.match(copy, /Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre/);
});

test('shows more than 30 years prominently in both languages', () => {
  assert.match(copy, /experienceValue: '30\+ YEARS'/);
  assert.match(copy, /experienceValue: 'MÁS DE 30 AÑOS'/);
});

test('clearly presents residential and commercial plumbing in both languages', () => {
  assert.match(copy, /Residential Plumbing/);
  assert.match(copy, /Commercial Plumbing/);
  assert.match(copy, /Residential & Commercial/);
  assert.match(copy, /Plomería residencial/);
  assert.match(copy, /Plomería comercial/);
  assert.match(copy, /Residencial y comercial/);
});

test('customer-facing runtime copy contains no internal QA language', () => {
  assert.doesNotMatch(copy, /Immediate delivery version/i);
  assert.doesNotMatch(copy, /No unsupported public claims/i);
  assert.doesNotMatch(copy, /What customers should do now/i);
  assert.doesNotMatch(copy, /Why this is safer/i);
  assert.match(copy, /primaryCta: 'Call OTTO'/);
  assert.match(copy, /secondaryCta: 'Request Service'/);
  assert.match(copy, /How service works/);
  assert.match(copy, /Cómo funciona el servicio/);
});

test('uses the concise WhatsApp contact invitation in both languages', () => {
  assert.match(copy, /Contact us on WhatsApp/);
  assert.match(copy, /Tap the link and we’ll get in touch with you/);
  assert.match(copy, /Contáctenos por WhatsApp/);
  assert.match(copy, /Contáctenos, presione el enlace y nos comunicaremos con usted/);
});

test('keeps the supplied logo in the navy header', () => {
  assert.match(polish, /background:\s*#0b1222/);
  assert.match(polish, /\.brand[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/);
});

test('publishes only the existing confirmed credential claims', () => {
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

test('uses restrained content-led scroll storytelling instead of minimizing whole screens', () => {
  assert.doesNotMatch(stages, /margin-top:\s*-100svh/);
  assert.doesNotMatch(stages, /scale\(\.92\)|scale\(\.95\)/);
  assert.doesNotMatch(stages, /border-radius:\s*28px/);
  assert.match(stages, /height:\s*135svh/);
  assert.match(stages, /html\.stage-motion\s+\.stage__inner\s*\{[\s\S]*?transform:\s*none/);
  assert.match(stageMotion, /requestAnimationFrame\(renderMotion\)/);
  assert.match(stageMotion, /--copy-y/);
  assert.match(stageMotion, /--copy-opacity/);
  assert.match(stageMotion, /--media-scale/);
  assert.doesNotMatch(stageMotion, /--stage-scale|--stage-radius|--stage-shift|--stage-opacity/);
});

test('mobile and reduced motion preserve ordinary document flow', () => {
  assert.match(stages, /@media \(max-width:\s*767\.98px\)[\s\S]*?\.stage__inner[\s\S]*?position:\s*relative/);
  assert.match(stages, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?margin-top:\s*0/);
  assert.match(stages, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?transform:\s*none/);
  assert.match(stageMotion, /prefers-reduced-motion:\s*reduce/);
});

test('configures the confirmed email fallback without inventing WhatsApp data', () => {
  assert.match(intakeConfig, /fallbackEmail:\s*'hernandezotto77@gmail\.com'/);
  assert.match(intakeConfig, /whatsappNumber:\s*''/);
});

test('includes parseable Plumber structured data', () => {
  const match = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'Plumber');
  assert.equal(data.telephone, '+1-786-344-2837');
  assert.equal(data.identifier.value, 'CFC1429613');
});
