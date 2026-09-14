import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const copy = readFileSync(new URL('../prestige.js', import.meta.url), 'utf8');
const polish = readFileSync(new URL('../production-polish.css', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../stages-theme.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mobilePolish = readFileSync(new URL('../prestige-polish.css', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../shell.js', import.meta.url), 'utf8');
const stages = readFileSync(new URL('../stages.css', import.meta.url), 'utf8');
const stageMotion = readFileSync(new URL('../stages.js', import.meta.url), 'utf8');
const intakeConfig = readFileSync(new URL('../intake-config.js', import.meta.url), 'utf8');
const intake = readFileSync(new URL('../intake.js', import.meta.url), 'utf8');
const seo = readFileSync(new URL('../seo-cleanup.js', import.meta.url), 'utf8');

test('uses the supplied OTTO photography and company logo', () => {
  const references = [...page.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(references)].sort(), [
    'img/credentials-1996.webp',
    'img/hero-technicians.webp',
    'img/luxury-bathroom.webp',
    'img/services-closeup.webp',
    'logo.jpg'
  ]);
});

test('makes Request Service the dominant bilingual hero action', () => {
  assert.match(copy, /primaryCta: 'Request Service'/);
  assert.match(copy, /primaryCta: 'Solicitar servicio'/);
  assert.match(copy, /setHref\('\.hero-cta \.btn-primary', '#request'\)/);
  assert.match(copy, /setHref\('\.hero-cta \.btn-secondary', PHONE_HREF\)/);
  assert.match(copy, /navContact: 'Request Service'/);
  assert.match(copy, /navContact: 'Solicitar servicio'/);
});

test('guided intake has five stages and full English Spanish customer states', () => {
  assert.match(intake, /Step \{current\} of 5/);
  assert.match(intake, /Paso \{current\} de 5/);
  assert.match(intake, /categoryTitle: 'What do you need help with\?'/);
  assert.match(intake, /categoryTitle: '¿Con qué necesita ayuda\?'/);
  assert.match(intake, /reviewTitle: 'Review your request'/);
  assert.match(intake, /reviewTitle: 'Revise su solicitud'/);
  assert.match(intake, /receivedTitle: 'Request received'/);
  assert.match(intake, /receivedTitle: 'Solicitud recibida'/);
  assert.match(intake, /failed: 'The request was not sent/);
  assert.match(intake, /failed: 'La solicitud no se envió/);
});

test('public service categories match the guided intake categories', () => {
  for (const label of ['Leak','Drain / clog','Toilet / faucet','Water heater','Plumbing installation','Remodel / construction','Commercial service','Other']) {
    assert.match(copy, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const key of ['leak','drain','fixtures','heater','installation','remodel','commercial','other']) {
    assert.match(intake, new RegExp("'" + key + "'"));
  }
});

test('homepage contains no internal QA copy or unverified score claims at runtime', () => {
  assert.doesNotMatch(copy, /Immediate delivery version|No unsupported public claims|What customers should do now|Why this is safer/i);
  assert.doesNotMatch(copy, /Score 110|Top 4%|175 permitted projects|BuildZoom/i);
  assert.match(copy, /Florida license/);
  assert.match(copy, /Established/);
  assert.match(copy, /Mon–Sat · 7 AM–7 PM/);
  assert.match(copy, /South Florida/);
});

test('keeps the company slogan in English and Spanish', () => {
  assert.match(copy, /Making water flow through our pipes, like integrity through our name/);
  assert.match(copy, /Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre/);
});

test('keeps mobile call, language and accessible responsive paths available', () => {
  assert.doesNotMatch(mobilePolish, /\.nav-actions\s*>\s*\.call-btn\s*\{\s*display:\s*none/);
  assert.doesNotMatch(polish, /\.nav-actions\s+\.toggle-group\s*\{\s*display:\s*none/);
  assert.match(polish, /\.nav\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(shell, /class="shell-callbar"/);
  assert.match(theme, /@media \(max-width:\s*767\.98px\)/);
  assert.match(theme, /\.intake-choice-grid,[\s\S]*?\.intake-grid \{ grid-template-columns: 1fr; \}/);
});

test('uses restrained motion and honors reduced motion', () => {
  assert.doesNotMatch(stages, /margin-top:\s*-100svh/);
  assert.doesNotMatch(stages, /scale\(\.92\)|scale\(\.95\)/);
  assert.match(stageMotion, /requestAnimationFrame\(renderMotion\)/);
  assert.match(stageMotion, /prefers-reduced-motion:\s*reduce/);
  assert.match(theme, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test('uses confirmed CRM endpoint, fallback email and WhatsApp number', () => {
  assert.match(intakeConfig, /fallbackEmail:\s*'hernandezotto77@gmail\.com'/);
  assert.match(intakeConfig, /whatsappNumber:\s*'17863442837'/);
  assert.match(intakeConfig, /endpoint:\s*'https:\/\/huaehartegjbihyygqgb\.supabase\.co\/functions\/v1\/website-intake'/);
});

test('metadata contains only verified business facts and correct canonical', () => {
  assert.match(seo, /canonicalUrl = 'https:\/\/otto-plumbing-site\.vercel\.app\/'/);
  assert.match(seo, /openingHours: 'Mo-Sa 07:00-19:00'/);
  assert.match(seo, /foundingDate: '1996'/);
  assert.match(seo, /CFC1429613/);
  assert.doesNotMatch(seo, /aggregateRating|priceRange|24\/7/);
  assert.match(page, /<link rel="canonical" href="https:\/\/otto-plumbing-site\.vercel\.app\/">/);
});
