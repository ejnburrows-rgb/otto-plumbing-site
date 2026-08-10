/* OTTO Plumbing Inc. - customer intake delivery configuration.
 * Final review candidate. No secrets belong here. The Formspree endpoint and
 * confirmed office email stay empty until the client setup visit.
 */
window.OTTO_INTAKE_CONFIG = {
  endpoint: '',
  fallbackEmail: '',
  timeoutMs: 15000
};

/* Final-candidate asset bootstrap.
 * The intake branch owns the page markup; this loads the already-approved
 * interaction shell plus the visual/copy facelift without rewriting that
 * tested markup. If either enhancement fails, the underlying page and form
 * remain usable.
 */
(function () {
  'use strict';

  function stylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

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

  stylesheet('shell.css');
  stylesheet('facelift.css');
  stylesheet('prestige.css');

  function start() {
    protectUnconfiguredHandoff();
    script('facelift.js', function () {
      script('prestige.js', function () {
        script('shell.js');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
