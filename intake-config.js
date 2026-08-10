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

  stylesheet('shell.css');
  stylesheet('facelift.css');

  function start() {
    script('facelift.js', function () {
      script('shell.js');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
