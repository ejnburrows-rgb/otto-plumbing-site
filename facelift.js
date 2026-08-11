/* OTTO Plumbing Inc. — customer-facing copy and final presentation polish.
 * This file changes presentation/copy only. Intake validation/delivery and the
 * approved interaction shell remain untouched.
 */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';
  var PHONE_SMS = 'sms:+17863442837';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing since 1996',
      navServices: 'Services',
      navBusiness: 'About',
      navContact: 'Request Service',
      callNow: 'Call or text',
      eyebrow: 'South Florida plumbing • Since 1996',
      heroTitle: 'Experienced plumbing service for South Florida homes and businesses.',
      heroLead: 'OTTO Plumbing Inc. has served South Florida since 1996. Call or text ' + PHONE + ' for residential and commercial plumbing service.',
      primaryCta: 'Call ' + PHONE,
      secondaryCta: 'Request service',
      fact1Label: 'Experience',
      fact2Label: 'Hours',
      fact3Label: 'License',
      badge: 'Licensed • Since 1996 • South Florida',
      info1Title: '30+ years of experience',
      info1Body: 'Established in 1996 and serving plumbing needs across South Florida.',
      info2Title: 'Licensed plumbing service',
      info2Body: 'Florida plumbing license CFC1429613.',
      info3Title: 'Open six days a week',
      info3Body: 'Monday through Saturday, 7 AM to 7 PM.',
      servicesTitle: 'Plumbing services',
      servicesLead: 'From leaks and drains to water heaters, fixtures, and remodel work, OTTO handles residential and commercial plumbing service.',
      businessTitle: 'Why call OTTO',
      businessLead: 'Clear credentials, decades of experience, and direct access to a South Florida plumbing business.',
      biz1Title: 'Established',
      biz2Title: 'Experience',
      biz3Title: 'License',
      biz4Title: 'Business hours',
      biz5Title: 'Service area',
      biz6Title: 'Direct line',
      contactTitle: 'Talk directly with OTTO Plumbing',
      contactLead: 'Call or text during business hours, or send the job details with the service-request form below.',
      contactPhoneLabel: 'Call or text',
      contactLicenseLabel: 'License',
      contactNotesLabel: 'Business hours',
      contactNotesBody: 'Monday–Saturday · 7 AM–7 PM',
      contactCardTitle: 'Choose the easiest way to reach us',
      contactCardLead: 'Call or text the business line. For a detailed, non-urgent request, use the online form below.',
      contactButton1: 'Call now',
      contactButton2: 'Text now',
      contactWhyLabel: 'Service area',
      contactWhyBody: 'Serving South Florida.',
      ctaTitle: 'Need a plumber?',
      ctaLead: 'Call or text OTTO Plumbing Inc. to discuss the job.',
      ctaCall: 'Call ' + PHONE,
      ctaText: 'Text the business line',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida desde 1996',
      navServices: 'Servicios',
      navBusiness: 'Nosotros',
      navContact: 'Solicitar servicio',
      callNow: 'Llamar o escribir',
      eyebrow: 'Plomería en el sur de Florida • Desde 1996',
      heroTitle: 'Servicio de plomería con experiencia para hogares y negocios del sur de Florida.',
      heroLead: 'OTTO Plumbing Inc. sirve al sur de Florida desde 1996. Llame o escriba al ' + PHONE + ' para servicio de plomería residencial y comercial.',
      primaryCta: 'Llamar al ' + PHONE,
      secondaryCta: 'Solicitar servicio',
      fact1Label: 'Experiencia',
      fact2Label: 'Horario',
      fact3Label: 'Licencia',
      badge: 'Con licencia • Desde 1996 • Sur de Florida',
      info1Title: 'Más de 30 años de experiencia',
      info1Body: 'Establecida en 1996 y atendiendo necesidades de plomería en el sur de Florida.',
      info2Title: 'Servicio de plomería con licencia',
      info2Body: 'Licencia de plomería de Florida CFC1429613.',
      info3Title: 'Abierto seis días a la semana',
      info3Body: 'De lunes a sábado, de 7 AM a 7 PM.',
      servicesTitle: 'Servicios de plomería',
      servicesLead: 'Desde fugas y drenajes hasta calentadores de agua, accesorios y remodelaciones, OTTO atiende trabajos residenciales y comerciales.',
      businessTitle: 'Por qué llamar a OTTO',
      businessLead: 'Credenciales claras, décadas de experiencia y contacto directo con un negocio de plomería del sur de Florida.',
      biz1Title: 'Establecida',
      biz2Title: 'Experiencia',
      biz3Title: 'Licencia',
      biz4Title: 'Horario',
      biz5Title: 'Área de servicio',
      biz6Title: 'Línea directa',
      contactTitle: 'Hable directamente con OTTO Plumbing',
      contactLead: 'Llame o escriba durante el horario comercial, o envíe los detalles del trabajo con el formulario de servicio de abajo.',
      contactPhoneLabel: 'Llamar o escribir',
      contactLicenseLabel: 'Licencia',
      contactNotesLabel: 'Horario comercial',
      contactNotesBody: 'Lunes–sábado · 7 AM–7 PM',
      contactCardTitle: 'Elija la forma más fácil de comunicarse',
      contactCardLead: 'Llame o escriba a la línea del negocio. Para una solicitud detallada que no sea urgente, use el formulario de abajo.',
      contactButton1: 'Llamar ahora',
      contactButton2: 'Escribir ahora',
      contactWhyLabel: 'Área de servicio',
      contactWhyBody: 'Servicio en el sur de Florida.',
      ctaTitle: '¿Necesita un plomero?',
      ctaLead: 'Llame o escriba a OTTO Plumbing Inc. para hablar sobre el trabajo.',
      ctaCall: 'Llamar al ' + PHONE,
      ctaText: 'Escribir a la línea del negocio',
      footerRight: 'Sur de Florida · Lic. #CFC1429613 · ' + PHONE
    }
  };

  var HERO_VALUES = {
    en: ['30+ years', 'Mon–Sat · 7 AM–7 PM', 'CFC1429613'],
    es: ['Más de 30 años', 'Lun–sáb · 7 AM–7 PM', 'CFC1429613']
  };

  var BUSINESS_VALUES = {
    en: ['Since 1996', '30+ years', 'CFC1429613', 'Mon–Sat · 7 AM–7 PM', 'South Florida', PHONE],
    es: ['Desde 1996', 'Más de 30 años', 'CFC1429613', 'Lun–sáb · 7 AM–7 PM', 'Sur de Florida', PHONE]
  };

  var FORM_ES = {
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
    formLead: 'Envíe los detalles del trabajo y la oficina le responderá. Nada se reporta como enviado hasta que el sistema receptor lo confirme. Para atención inmediata, llame o escriba al ' + PHONE + '.',
    submitIdle: 'Enviar solicitud',
    submitSending: 'Enviando, espere',
    submitEmail: 'Preparar solicitud por correo',
    callInstead: 'Llamar al ' + PHONE,
    fallbackLabel: 'Comuníquese directamente con la oficina',
    fallbackBody: 'Sus datos siguen en el formulario. Todavía no se ha enviado nada a la oficina.',
    fallbackCall: 'Llamar al ' + PHONE,
    fallbackText: 'Escribir al ' + PHONE,
    fallbackEmail: 'Abrir un correo ya completado'
  };

  var FORM_ES_PLACEHOLDERS = {
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

  function applyTranslationLayer() {
    try {
      if (typeof translations !== 'undefined') {
        Object.assign(translations.en, COPY.en);
        Object.assign(translations.es, COPY.es);
      }
      if (typeof setLang === 'function') setLang(currentLang());
    } catch (ignored) {}
  }

  function applyHeroValues() {
    var values = HERO_VALUES[currentLang()];
    var nodes = document.querySelectorAll('.hero-facts .fact-value');
    for (var i = 0; i < nodes.length && i < values.length; i += 1) nodes[i].textContent = values[i];
  }

  function applyBusinessValues() {
    var values = BUSINESS_VALUES[currentLang()];
    var tiles = document.querySelectorAll('#business .reason-grid .tile');
    for (var i = 0; i < tiles.length && i < values.length; i += 1) {
      var p = tiles[i].querySelector('p');
      if (p) p.textContent = values[i];
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

  function fixMeta() {
    document.title = currentLang() === 'es'
      ? 'OTTO Plumbing Inc. — Plomería en el sur de Florida'
      : 'OTTO Plumbing Inc. — South Florida Plumbing Service';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', currentLang() === 'es'
        ? 'OTTO Plumbing Inc. ofrece servicio de plomería residencial y comercial en el sur de Florida. Establecida en 1996. Llame o escriba al (786) 344-2837.'
        : 'OTTO Plumbing Inc. provides residential and commercial plumbing service across South Florida. Established in 1996. Call or text (786) 344-2837.');
    }
  }

  function polishSpanishForm() {
    if (currentLang() !== 'es') return;
    var nodes = document.querySelectorAll('[data-otto-i18n]');
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute('data-otto-i18n');
      if (FORM_ES[key] && nodes[i].textContent !== FORM_ES[key]) nodes[i].textContent = FORM_ES[key];
    }
    var placeholders = document.querySelectorAll('[data-otto-i18n-ph]');
    for (var j = 0; j < placeholders.length; j += 1) {
      var phKey = placeholders[j].getAttribute('data-otto-i18n-ph');
      if (FORM_ES_PLACEHOLDERS[phKey]) placeholders[j].setAttribute('placeholder', FORM_ES_PLACEHOLDERS[phKey]);
    }
    var statusNodes = document.querySelectorAll('.intake-error, .intake-status');
    for (var k = 0; k < statusNodes.length; k += 1) {
      var replacement = SPANISH_TEXT_FIXES[statusNodes[k].textContent];
      if (replacement && replacement !== statusNodes[k].textContent) statusNodes[k].textContent = replacement;
    }
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
    applyTranslationLayer();
    applyHeroValues();
    applyBusinessValues();
    fixActions();
    fixMeta();
    polishSpanishForm();
  }

  applyAll();
  window.setTimeout(clearSetupNotice, 0);

  var buttons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function () {
      window.setTimeout(function () {
        applyAll();
        clearSetupNotice();
      }, 1);
    });
  }

  var form = document.getElementById('intakeForm');
  if (form && window.MutationObserver) {
    var busy = false;
    new MutationObserver(function () {
      if (busy || currentLang() !== 'es') return;
      busy = true;
      window.setTimeout(function () {
        polishSpanishForm();
        busy = false;
      }, 0);
    }).observe(form, { subtree: true, childList: true, characterData: true });
  }
})();
