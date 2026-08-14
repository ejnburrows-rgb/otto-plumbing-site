/* OTTO Plumbing Inc. — form and action polish.
 * Main customer-facing brand copy lives in prestige.js. This layer keeps the
 * service request bilingual and preserves functional contact behavior.
 */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';
  var PHONE_SMS = 'sms:+17863442837';

  var FORM_COPY = {
    en: {
      formTitle: 'Request service online',
      formLead: 'Tell us what you need and how you would like to be contacted. For a direct call or text, use ' + PHONE + '.',
      submitIdle: 'Send request',
      callInstead: 'Call ' + PHONE,
      fallbackLabel: 'Reach the office directly',
      fallbackBody: 'Your details are still in the form. Nothing has been sent to the office yet.',
      fallbackCall: 'Call ' + PHONE,
      fallbackText: 'Text ' + PHONE,
      fallbackEmail: 'Open a pre-filled email'
    },
    es: {
      labelName: 'Nombre',
      labelPhone: 'Teléfono',
      labelEmail: 'Correo (opcional)',
      labelService: 'Servicio que necesita',
      labelLocation: 'Ciudad o dirección (opcional)',
      labelContact: 'Contacto preferido (opcional)',
      labelDetails: '¿Qué está pasando?',
      optService: 'Elija un servicio',
      svcLeak: 'Reparación de fugas',
      svcDrain: 'Drenaje y alcantarillado',
      svcHeater: 'Calentadores de agua',
      svcGeneral: 'Plomería general',
      svcFixtures: 'Actualización de accesorios',
      svcRemodel: 'Apoyo para remodelación',
      svcOther: 'Otro trabajo de plomería',
      prefNone: 'Sin preferencia',
      prefCall: 'Llamada',
      prefText: 'Mensaje de texto',
      prefEmail: 'Correo',
      formTitle: 'Solicitar servicio en línea',
      formLead: 'Cuéntenos qué necesita y cómo prefiere que nos comuniquemos con usted. Para llamar o escribir directamente, use el ' + PHONE + '.',
      submitIdle: 'Enviar solicitud',
      submitSending: 'Enviando, espere',
      submitEmail: 'Preparar solicitud por correo',
      callInstead: 'Llamar al ' + PHONE,
      fallbackLabel: 'Comuníquese directamente con la oficina',
      fallbackBody: 'Sus datos siguen en el formulario. Todavía no se ha enviado nada a la oficina.',
      fallbackCall: 'Llamar al ' + PHONE,
      fallbackText: 'Escribir al ' + PHONE,
      fallbackEmail: 'Abrir un correo ya completado'
    }
  };

  var PLACEHOLDERS_ES = {
    phName: 'Nombre y apellido',
    phPhone: PHONE,
    phEmail: 'usted@ejemplo.com',
    phLocation: 'Barrio, ciudad o dirección',
    phDetails: 'Describa el problema, el accesorio afectado y cuándo comenzó.'
  };

  var SPANISH_TEXT_FIXES = {
    'Escriba un telefono de 10 digitos.': 'Escriba un teléfono de 10 dígitos.',
    'Escriba un correo valido o dejelo vacio.': 'Escriba un correo válido o déjelo vacío.',
    'Agregue un poco mas de detalle para poder ayudarle.': 'Agregue un poco más de detalle para poder ayudarle.',
    'Todavia no se ha enviado nada. Use el correo ya completado de abajo, o llame o escriba al (786) 344-2837.': 'Todavía no se ha enviado nada. Use el correo ya completado de abajo, o llame o escriba al (786) 344-2837.',
    'No se pudo verificar el envio, por lo que no se envio. Por favor llame o escriba al (786) 344-2837.': 'No se pudo verificar el envío, por lo que no se envió. Por favor llame o escriba al (786) 344-2837.',
    'Esta misma solicitud ya se envio. La oficina la tiene, no hace falta enviarla otra vez.': 'Esta misma solicitud ya se envió. La oficina la tiene; no hace falta enviarla otra vez.',
    'Enviando su solicitud...': 'Enviando su solicitud…',
    'Recibido. La oficina tiene su solicitud y le respondera. Si es urgente, llame o escriba al (786) 344-2837.': 'Recibido. La oficina tiene su solicitud y le responderá. Si es urgente, llame o escriba al (786) 344-2837.',
    'La solicitud NO se envio. El sistema receptor la rechazo. Sus datos siguen aqui.': 'La solicitud NO se envió. El sistema receptor la rechazó. Sus datos siguen aquí.',
    'La solicitud NO se envio. Fallo la conexion. Sus datos siguen aqui.': 'La solicitud NO se envió. Falló la conexión. Sus datos siguen aquí.',
    'La solicitud NO se envio. El envio expiro sin confirmacion. Sus datos siguen aqui.': 'La solicitud NO se envió. El envío expiró sin confirmación. Sus datos siguen aquí.'
  };

  function currentLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function applyFormCopy() {
    var lang = currentLang();
    var copy = FORM_COPY[lang];
    var nodes = document.querySelectorAll('[data-otto-i18n]');
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute('data-otto-i18n');
      if (copy[key] && nodes[i].textContent !== copy[key]) nodes[i].textContent = copy[key];
    }

    if (lang === 'es') {
      var placeholders = document.querySelectorAll('[data-otto-i18n-ph]');
      for (var j = 0; j < placeholders.length; j += 1) {
        var phKey = placeholders[j].getAttribute('data-otto-i18n-ph');
        if (PLACEHOLDERS_ES[phKey] && placeholders[j].getAttribute('placeholder') !== PLACEHOLDERS_ES[phKey]) placeholders[j].setAttribute('placeholder', PLACEHOLDERS_ES[phKey]);
      }

      var statusNodes = document.querySelectorAll('.intake-error, .intake-status');
      for (var k = 0; k < statusNodes.length; k += 1) {
        var replacement = SPANISH_TEXT_FIXES[statusNodes[k].textContent];
        if (replacement && statusNodes[k].textContent !== replacement) statusNodes[k].textContent = replacement;
      }
    }
  }

  function fixActions() {
    var secondary = document.querySelector('[data-i18n="secondaryCta"]');
    if (secondary) secondary.setAttribute('href', '#request');
    var textLinks = [
      document.querySelector('[data-i18n="contactButton2"]'),
      document.querySelector('[data-i18n="ctaText"]')
    ];
    textLinks.forEach(function (link) {
      if (link) link.setAttribute('href', PHONE_SMS);
    });
  }

  function clearSetupNotice() {
    var config = window.OTTO_INTAKE_CONFIG || {};
    if (config.endpoint) return;
    var status = document.getElementById('intakeStatus');
    if (!status) return;
    var text = status.textContent || '';
    if (text.indexOf('Online sending is not switched on') !== -1 || text.indexOf('El envio en linea aun no esta activado') !== -1) {
      status.textContent = '';
      status.classList.remove('is-error', 'is-ok');
    }
  }

  function applyAll() {
    applyFormCopy();
    fixActions();
    clearSetupNotice();
  }

  applyAll();

  var buttons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function () {
      window.setTimeout(applyAll, 10);
    });
  }

  var form = document.getElementById('intakeForm');
  if (form && window.MutationObserver) {
    var busy = false;
    new MutationObserver(function () {
      if (busy) return;
      busy = true;
      window.setTimeout(function () {
        applyFormCopy();
        busy = false;
      }, 0);
    }).observe(form, { subtree: true, childList: true, characterData: true });
  }
})();
