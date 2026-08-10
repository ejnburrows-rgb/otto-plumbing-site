module.exports = async function handler(req, res) {
  const origin = `https://${req.headers.host}`;
  const paths = [
    '/',
    '/facelift.css',
    '/facelift.js',
    '/shell.css',
    '/shell.js',
    '/intake-config.js',
    '/intake-core.js',
    '/intake.js'
  ];
  const results = [];

  function ok(name, condition, detail) {
    results.push({ name, ok: Boolean(condition), detail: detail || null });
  }

  try {
    const bodies = {};
    for (const path of paths) {
      const response = await fetch(origin + path, { headers: { 'user-agent': 'otto-final-qa' } });
      const text = await response.text();
      bodies[path] = text;
      ok(`HTTP ${path}`, response.ok, `${response.status} ${response.statusText}`);
    }

    const jsPaths = ['/facelift.js', '/shell.js', '/intake-config.js', '/intake-core.js', '/intake.js'];
    for (const path of jsPaths) {
      try {
        new Function(bodies[path]);
        ok(`Syntax ${path}`, true);
      } catch (error) {
        ok(`Syntax ${path}`, false, error && error.message);
      }
    }

    const html = bodies['/'];
    [
      'id="request"',
      'id="intakeForm"',
      'id="intakeName"',
      'id="intakePhone"',
      'id="intakeService"',
      'id="intakeDetails"',
      'src="intake-config.js"',
      'src="intake-core.js"',
      'src="intake.js"'
    ].forEach((needle) => ok(`HTML contains ${needle}`, html.includes(needle)));

    const config = bodies['/intake-config.js'];
    ok('Formspree endpoint intentionally blank', /endpoint:\s*''/.test(config));
    ok('Unverified fallback email intentionally blank', /fallbackEmail:\s*''/.test(config));
    ok('Final facelift CSS bootstrap present', config.includes("stylesheet('facelift.css')"));
    ok('Approved shell CSS bootstrap present', config.includes("stylesheet('shell.css')"));
    ok('Final facelift JS bootstrap present', config.includes("script('facelift.js'"));
    ok('Approved shell JS bootstrap present', config.includes("script('shell.js')"));

    const css = bodies['/facelift.css'];
    [
      '.hero-main',
      '.hero-side',
      '.section-card',
      '.contact-card',
      '.intake-field input',
      '@media (max-width: 720px)',
      '@media (prefers-reduced-motion: reduce)'
    ].forEach((needle) => ok(`Facelift CSS contains ${needle}`, css.includes(needle)));

    const facelift = bodies['/facelift.js'];
    ok('English customer hero copy present', facelift.includes('Experienced plumbing service for South Florida homes and businesses.'));
    ok('Spanish customer hero copy present', facelift.includes('Servicio de plomería con experiencia para hogares y negocios del sur de Florida.'));
    ok('Text actions corrected to SMS', facelift.includes("sms:+17863442837"));
    ok('Request CTA points to form', facelift.includes("setAttribute('href', '#request')"));
    ok('Verified founding year used', facelift.includes('Since 1996') && facelift.includes('Desde 1996'));
    ok('Verified business hours used', facelift.includes('7 AM–7 PM'));
    ok('Verified license used', facelift.includes('CFC1429613'));

    try {
      const root = {};
      const core = new Function('globalThis', bodies['/intake-core.js'] + '\nreturn globalThis.OTTOIntakeCore;')(root);
      ok('Intake core loads', Boolean(core && core.validate && core.deliverIntake));
      const good = {
        name: 'Maria Lopez',
        phone: '(305) 555-0142',
        email: 'maria@example.com',
        service: 'leak',
        location: 'Hialeah, FL',
        contactPreference: 'text',
        details: 'Kitchen sink is leaking under the cabinet since last night.'
      };
      const valid = core.validate(good);
      ok('Valid intake request accepted by validator', valid.valid === true);
      ok('Invalid phone rejected', core.validate({ ...good, phone: '123' }).valid === false);
      ok('Unknown service rejected', core.validate({ ...good, service: 'made-up' }).valid === false);
      ok('Configured endpoint validator rejects blank endpoint', core.isConfiguredEndpoint('') === false);
      const accepted = await core.deliverIntake({
        endpoint: 'https://formspree.io/f/testtest',
        payload: core.buildPayload(valid.values, { language: 'en', page: origin }),
        fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }),
        timeoutMs: 500
      });
      ok('Accepted delivery reports success', accepted && accepted.ok === true);
      let rejected = false;
      try {
        await core.deliverIntake({
          endpoint: 'https://formspree.io/f/testtest',
          payload: {},
          fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({ error: 'test failure' }) }),
          timeoutMs: 500
        });
      } catch (error) {
        rejected = error && error.code === 'server';
      }
      ok('Failed delivery never reports success', rejected);
    } catch (error) {
      ok('Intake core execution', false, error && error.stack ? error.stack.slice(0, 500) : String(error));
    }
  } catch (error) {
    ok('QA runner execution', false, error && error.stack ? error.stack.slice(0, 1000) : String(error));
  }

  const passed = results.filter((x) => x.ok).length;
  const failed = results.length - passed;
  res.status(failed ? 500 : 200).json({
    ok: failed === 0,
    passed,
    failed,
    results
  });
};
