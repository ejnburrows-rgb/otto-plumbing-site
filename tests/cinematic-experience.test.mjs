import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const config = readFileSync(new URL('../intake-config.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../cinematic.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../cinematic.js', import.meta.url), 'utf8');
const wallpaper = readFileSync(new URL('../south-florida-waterfront.webp', import.meta.url));

test('loads the cinematic layer after the existing approved presentation layers', () => {
  assert.match(config, /stylesheet\('cinematic\.css'\)/);
  assert.match(config, /script\('cinematic\.js'\)/);
});

test('uses the project wallpaper and preserves readable fallbacks', () => {
  assert.match(css, /south-florida-waterfront\.webp/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /max-width: 900px/);
  assert.ok(wallpaper.length > 10_000);
  assert.ok(wallpaper.length < 250_000);
});

test('limits the stacked transition to major sections', () => {
  assert.match(js, /'#top', '#services', '#business'/);
  assert.doesNotMatch(js, /'#contact'.*cinematic-panel/);
});
