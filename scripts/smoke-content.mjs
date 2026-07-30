import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const html = fs.readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) { passed++; console.log(`  ok   ${name}`); }
  else { failed++; console.error(`  FAIL ${name}`); }
}

console.log('\nOTTO — Production-readiness guard\n');

// Claims absence
for (const claim of ['5,000+', '5.0 ★', '24 h']) {
  check(`${claim} is absent`, !html.includes(claim));
}

// Trust language
check('no "most trusted" in visible text', !html.includes('Most Trusted'));
check('no "seven days" ', !html.includes('seven days'));
check('no Instagram links', !html.includes('instagram.com'));
check('no Follow Us', !html.includes('Follow Us') && !html.includes('Síganos'));

// Canonical facts
check('phone tel:+17863442837', html.includes('tel:+17863442837'));
check('license #CFC1429613', html.includes('#CFC1429613'));
check('founded 1996', html.includes('1996'));
check('30+ years', html.includes('30+'));

// SEO
check('DOCTYPE html', html.startsWith('<!DOCTYPE html>'));
check('canonical URL', html.includes('rel="canonical"'));
check('structured data', html.includes('"@type":"Plumber"'));
check('Open Graph title', html.includes('property="og:title"'));

// i18n keys
const keys = ['nav.portfolio','nav.mastery','hero.chip1','hero.chip2','port.kicker','port.title','port.sub','port1.h','port1.p','port2.h','port2.p','port3.h','port3.p','port4.h','port4.p','mast.kicker','mast.title','mast.sub','mast1.h','mast1.p','mast2.h','mast2.p','mast3.h','mast3.p','a11y.skip','a11y.brand','a11y.nav','a11y.lang','a11y.theme','a11y.menu','a11y.mobile'];
for (const key of keys) {
  const re = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const count = (html.match(re) || []).length;
  check(`i18n ${key} (>=2)`, count >= 2);
}

// Form
check('form validation', html.includes('validateForm'));
check('field-error elements', html.includes('field-error'));
check('privacy notice', html.includes('form.privacy'));
check('data-i18n-aria', html.includes('data-i18n-aria'));

// Manifest description
const manifest = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../manifest.json', import.meta.url)), 'utf8'));
check('manifest description is verifiable', !manifest.description.includes('Most Trusted'));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
