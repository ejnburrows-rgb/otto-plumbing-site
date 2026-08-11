import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const logo = readFileSync(new URL('../logo.jpg', import.meta.url));
const copy = readFileSync(new URL('../prestige.js', import.meta.url), 'utf8');
const polish = readFileSync(new URL('../production-polish.css', import.meta.url), 'utf8');

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
