import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const logo = readFileSync(new URL('../logo.jpg', import.meta.url));
const copy = readFileSync(new URL('../prestige.js', import.meta.url), 'utf8');

test('uses the supplied official company logo without alteration', () => {
  assert.equal(
    createHash('sha256').update(logo).digest('hex'),
    'c65156b7497dd40f83a270272021ac069af95964f00bb6dbce8fbc34fcfbfc4a'
  );
});

test('publishes the integrity statement in English and Spanish', () => {
  assert.match(copy, /Integrity is what keeps the waters of trust flowing/);
  assert.match(copy, /La integridad es lo que mantiene fluyendo las aguas de la confianza/);
});

test('clearly includes residential and commercial buildings across South Florida', () => {
  assert.match(copy, /homes, businesses, and buildings/);
  assert.match(copy, /hogares, negocios y edificios/);
  assert.match(copy, /commercial plumbing/);
  assert.match(copy, /Plomería profesional/);
});
