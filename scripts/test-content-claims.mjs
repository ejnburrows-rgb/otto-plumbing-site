import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.error(`  FAIL ${name}`);
  }
}

console.log('\nWebsite claims and Spanish-parity guard');

for (const claim of ['5,000+', '5.0 ★', '24 h']) {
  check(`${claim} is absent`, !html.includes(claim));
}

// These facts are not in the approved canonical fact set and must not be used
// as replacements for the three removed metrics.
check('unverified family-owned claim is absent',
  !html.includes('stat.family_n') &&
  !html.includes('stat.family') &&
  !html.includes('Negocio Familiar'));

// Removing the 24-hour metric must not leave an equivalent unsupported speed
// promise in page metadata.
check('metadata has no same-day promise',
  !/"a11y\.desc"[^\n]*(same-day service|servicio el mismo día)/i.test(html));

const requiredKeys = [
  'nav.portfolio', 'nav.mastery',
  'port.kicker', 'port.title', 'port.sub',
  'port1.h', 'port1.p', 'port2.h', 'port2.p',
  'port3.h', 'port3.p', 'port4.h', 'port4.p',
  'mast.kicker', 'mast.title', 'mast.sub',
  'mast1.h', 'mast1.p', 'mast2.h', 'mast2.p', 'mast3.h', 'mast3.p',
  'a11y.skip', 'a11y.brand', 'a11y.nav', 'a11y.lang',
  'a11y.theme', 'a11y.mobile'
];

for (const key of requiredKeys) {
  const occurrences = html.split(`"${key}"`).length - 1;
  check(`${key} has EN and ES values`, occurrences >= 2);
}

check('language switch updates document lang',
  html.includes('document.documentElement.lang = lang'));
check('menu label still announces current open/closed state',
  html.includes('open ? (currentLang === "es" ? "Cerrar menú" : "Close menu")') &&
  html.includes('(currentLang === "es" ? "Abrir menú"  : "Open menu")'));
check('canonical phone remains intact', html.includes('tel:+17863442837'));
check('canonical license remains intact', html.includes('#CFC1429613'));
check('verified 30+ years fact remains intact', html.includes('30+'));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
