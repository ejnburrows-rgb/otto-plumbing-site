/* OTTO Plumbing Inc. — customer intake delivery configuration.
 * No secrets belong here. External delivery stays fail-safe: the form reports
 * success only after the receiving system confirms it.
 */
window.OTTO_INTAKE_CONFIG = {
  endpoint: 'https://huaehartegjbihyygqgb.supabase.co/functions/v1/website-intake',
  fallbackEmail: 'hernandezotto77@gmail.com',
  // OTTO's published business contact number, country code plus digits only.
  whatsappNumber: '17863442837',
  timeoutMs: 15000
};

/* Publish no testimonial until the owner supplies a source that can be
 * checked. Supported fields: name, rating, platform, excerpt, and url. */
window.OTTO_VERIFIED_REVIEWS = [];

(function () {
  'use strict';

  function script(src, done) {
    if (document.querySelector('script[src="' + src + '"]')) {
      if (done) done();
      return;
    }
    var tag = document.createElement('script');
    tag.src = src;
    tag.async = false;
    tag.onload = function () { if (done) done(); };
    tag.onerror = function () { if (done) done(); };
    document.body.appendChild(tag);
  }

  function installThemeControl() {
    if (document.querySelector('[data-otto-theme-toggle]')) return;

    var style = document.createElement('style');
    style.id = 'otto-theme-overrides';
    style.textContent = [
      ':root[data-theme="dark"] {',
      '  color-scheme: dark;',
      '  --ink: #eef3fb;',
      '  --muted: #aeb9cb;',
      '  --line: #33415d;',
      '  --bg: #09111f;',
      '  --card: rgba(15, 25, 43, 0.94);',
      '  --card-solid: #111c2f;',
      '  --shadow: 0 20px 50px rgba(0,0,0,0.28);',
      '  --hero-shadow: 0 30px 80px rgba(0,0,0,0.38);',
      '  --ring: #8fb0ff;',
      '}',
      ':root[data-theme="dark"] body { background: var(--bg) !important; color: var(--ink) !important; }',
      ':root[data-theme="dark"] .nav { background: rgba(9,17,31,0.92) !important; border-color: var(--line) !important; }',
      ':root[data-theme="dark"] :is(.hero-side,.section-card,.contact-card,.info-card,.tile,.contact-row,.credential-card,.intake-card,.intake-panel,.intake-step,.review-card) { background-color: var(--card) !important; color: var(--ink) !important; border-color: var(--line) !important; }',
      ':root[data-theme="dark"] :is(.toggle-group,.icon-btn,.otto-theme-toggle) { background: var(--card-solid) !important; border-color: var(--line) !important; color: var(--ink) !important; }',
      ':root[data-theme="dark"] :is(input,select,textarea) { background: #0c1728 !important; color: var(--ink) !important; border-color: var(--line) !important; }',
      ':root[data-theme="dark"] :is(.section-lead,.contact-lead,.contact-note,.tile p,.info-card p,.brand-sub,.nav-links,.intake-status) { color: var(--muted) !important; }',
      '.otto-theme-toggle { flex: 0 0 auto; font-size: 1.05rem; line-height: 1; }',
      '.otto-theme-toggle span { pointer-events: none; }'
    ].join('\n');
    document.head.appendChild(style);

    var actions = document.querySelector('.nav-actions');
    if (!actions) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-btn otto-theme-toggle';
    button.setAttribute('data-otto-theme-toggle', '');

    function preferredTheme() {
      var saved = localStorage.getItem('otto-site-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function labelFor(nextTheme) {
      var spanish = document.documentElement.lang === 'es';
      if (nextTheme === 'dark') return spanish ? 'Cambiar a modo oscuro' : 'Switch to dark mode';
      return spanish ? 'Cambiar a modo claro' : 'Switch to light mode';
    }

    function applyTheme(theme, save) {
      var dark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      button.innerHTML = '<span aria-hidden="true">' + (dark ? '☀' : '☾') + '</span>';
      var next = dark ? 'light' : 'dark';
      button.setAttribute('aria-label', labelFor(next));
      button.title = labelFor(next);
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      if (save) localStorage.setItem('otto-site-theme', dark ? 'dark' : 'light');
    }

    button.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });

    var callButton = actions.querySelector('.call-btn');
    actions.insertBefore(button, callButton || null);
    applyTheme(preferredTheme(), false);

    if (window.MutationObserver) {
      new MutationObserver(function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        button.setAttribute('aria-label', labelFor(next));
        button.title = labelFor(next);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }

  function protectUnconfiguredHandoff() {
    var config = window.OTTO_INTAKE_CONFIG || {};
    if (config.endpoint || config.fallbackEmail) return;
    var status = document.getElementById('intakeStatus');
    if (!status) return;

    var enOld = 'Nothing has been sent yet. Use the pre-filled email below, or call or text (786) 344-2837.';
    var esOld = 'Todavia no se ha enviado nada. Use el correo ya completado de abajo, o llame o escriba al (786) 344-2837.';
    var enSafe = 'This request has not been sent. Please call or text (786) 344-2837.';
    var esSafe = 'Esta solicitud no se ha enviado. Llame o escriba al (786) 344-2837.';

    function normalize() {
      var value = status.textContent || '';
      if (value === enOld) status.textContent = enSafe;
      else if (value === esOld) status.textContent = esSafe;
    }

    normalize();
    if (window.MutationObserver) {
      var busy = false;
      new MutationObserver(function () {
        if (busy) return;
        busy = true;
        normalize();
        busy = false;
      }).observe(status, { childList: true, characterData: true, subtree: true });
    }
  }

  /* Customer-facing copy settles first; metadata is then trimmed to verified
   * claims before the form, contact, shell, and motion enhancements load. */
  function start() {
    installThemeControl();
    protectUnconfiguredHandoff();
    script('prestige.js', function () {
      script('seo-cleanup.js', function () {
        script('facelift.js', function () {
          script('whatsapp.js', function () {
            script('shell.js', function () {
              script('stages.js');
            });
          });
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
