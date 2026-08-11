import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const whatsapp = require('../whatsapp.js');
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('uses the exact English and Spanish messages', () => {
  assert.equal(whatsapp.MESSAGES.en, 'Hello, I am interested in the service. I would like to speak with someone and receive more information.');
  assert.equal(whatsapp.MESSAGES.es, 'Hola, estoy interesado/a en el servicio. Me gustaría comunicarme con ustedes para recibir más información.');
});

test('builds language-specific encoded wa.me links', () => {
  const english = whatsapp.buildUrl('+1 (555) 123-4567', 'en');
  const spanish = whatsapp.buildUrl('+1 (555) 123-4567', 'es');
  assert.match(english, /^https:\/\/wa\.me\/15551234567\?text=/);
  assert.match(spanish, /^https:\/\/wa\.me\/15551234567\?text=/);
  assert.equal(decodeURIComponent(english.split('?text=')[1]), whatsapp.MESSAGES.en);
  assert.equal(decodeURIComponent(spanish.split('?text=')[1]), whatsapp.MESSAGES.es);
  assert.notEqual(english, spanish);
});

test('does not invent or activate an invalid number', () => {
  assert.equal(whatsapp.buildUrl('', 'en'), '');
  assert.equal(whatsapp.buildUrl('not confirmed', 'es'), '');
});

test('keeps the WhatsApp interface inside Contact only', () => {
  const marker = 'data-whatsapp-contact';
  const contactStart = page.indexOf('<section class="section" id="contact">');
  const contactEnd = page.indexOf('</section>', contactStart);
  assert.ok(contactStart >= 0 && contactEnd > contactStart);
  assert.equal(page.split(marker).length - 1, 1);
  assert.ok(page.indexOf(marker) > contactStart);
  assert.ok(page.indexOf(marker) < contactEnd);
  assert.equal(page.includes('wa.me/'), false);
});
