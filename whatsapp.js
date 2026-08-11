/* OTTO Plumbing Inc. — consent-respecting WhatsApp click-to-chat helper. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OTTOWhatsApp = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var MESSAGES = Object.freeze({
    es: 'Hola, estoy interesado/a en el servicio. Me gustaría comunicarme con ustedes para recibir más información.',
    en: 'Hello, I am interested in the service. I would like to speak with someone and receive more information.'
  });

  function normalizeNumber(value) {
    var digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15 ? digits : '';
  }

  function buildUrl(number, language) {
    var digits = normalizeNumber(number);
    var lang = language === 'es' ? 'es' : 'en';
    return digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(MESSAGES[lang]) : '';
  }

  function init() {
    if (typeof document === 'undefined') return;
    var root = document.querySelector('[data-whatsapp-contact]');
    if (!root) return;

    var config = (typeof window !== 'undefined' && window.OTTO_INTAKE_CONFIG) || {};
    var number = normalizeNumber(config.whatsappNumber);
    var link = root.querySelector('[data-whatsapp-link]');
    var missing = root.querySelector('[data-whatsapp-missing]');
    var buttons = root.querySelectorAll('[data-whatsapp-language]');
    var selected = document.documentElement.lang === 'es' ? 'es' : 'en';

    function apply(language) {
      selected = language === 'es' ? 'es' : 'en';
      for (var i = 0; i < buttons.length; i += 1) {
        var active = buttons[i].getAttribute('data-whatsapp-language') === selected;
        buttons[i].classList.toggle('is-on', active);
        buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
      }
      if (!link) return;
      var url = buildUrl(number, selected);
      if (url) {
        link.href = url;
        link.hidden = false;
        link.textContent = selected === 'es' ? 'Abrir WhatsApp' : 'Open WhatsApp';
        link.setAttribute('aria-label', selected === 'es'
          ? 'Abrir WhatsApp con el mensaje en español preparado'
          : 'Open WhatsApp with the prepared English message');
        if (missing) missing.hidden = true;
      } else {
        link.removeAttribute('href');
        link.hidden = true;
        if (missing) {
          missing.hidden = false;
          missing.textContent = selected === 'es'
            ? 'El número de WhatsApp del negocio necesita confirmación antes de activar este enlace.'
            : 'The business WhatsApp number must be confirmed before this link can be activated.';
        }
      }
    }

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener('click', function () {
        apply(this.getAttribute('data-whatsapp-language'));
      });
    }
    apply(selected);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
  }

  return Object.freeze({ MESSAGES: MESSAGES, normalizeNumber: normalizeNumber, buildUrl: buildUrl });
});
