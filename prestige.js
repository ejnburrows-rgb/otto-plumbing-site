/* OTTO Plumbing Inc. — premium brand copy layer. */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';
  var CRM_LOGO = 'https://raw.githubusercontent.com/ejnburrows-rgb/otto/main/logo.jpg';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing · Established 1996',
      eyebrow: 'South Florida · Est. 1996 · Lic. CFC1429613',
      heroTitle: 'Trusted plumbing for South Florida homes and businesses.',
      heroLead: 'Residential and commercial plumbing backed by more than 30 years of experience, direct service, and Florida license CFC1429613.',
      primaryCta: 'Call ' + PHONE,
      secondaryCta: 'Request service',
      fact1Label: 'Established',
      fact2Label: 'Hours',
      fact3Label: 'License',
      badge: 'Why customers call OTTO',
      info1Title: '30+ years of experience',
      info1Body: 'Serving South Florida homes and businesses since 1996.',
      info2Title: 'Residential + commercial',
      info2Body: 'Repairs, replacements, installations, and plumbing project support.',
      info3Title: 'Direct business line',
      info3Body: 'Call or text Monday through Saturday, 7 AM to 7 PM.',
      servicesTitle: 'Plumbing services',
      servicesLead: 'Straightforward service for repairs, replacements, installations, and residential or commercial plumbing needs.',
      businessTitle: 'A local plumbing company you can verify.',
      businessLead: 'Established in 1996, Florida licensed, and serving South Florida six days a week.',
      biz1Title: 'Company',
      biz2Title: 'Direct line',
      biz3Title: 'Florida license',
      biz4Title: 'Established',
      biz4Body: 'Serving customers since 1996.',
      biz5Title: 'Service',
      biz5Body: 'Residential and commercial plumbing.',
      biz6Title: 'Availability',
      biz6Body: 'Monday–Saturday · 7 AM–7 PM',
      contactTitle: 'Contact OTTO Plumbing',
      contactLead: 'Call or text directly, or send the details of a non-urgent job through the service-request form.',
      contactPhoneLabel: 'Direct business line',
      contactLicenseLabel: 'Florida license',
      contactNotesLabel: 'Business hours',
      contactNotesBody: 'Monday through Saturday · 7 AM to 7 PM.',
      contactCardTitle: 'Need service?',
      contactCardLead: 'Call or text for the fastest response. For detailed requests, use the online service form below.',
      contactButton1: 'Call now',
      contactButton2: 'Text now',
      contactWhyLabel: 'Service area',
      contactWhyBody: 'Serving South Florida.',
      ctaTitle: 'Need a plumber?',
      ctaLead: 'Talk directly with OTTO Plumbing Inc. about your residential or commercial plumbing needs.',
      ctaCall: 'Call ' + PHONE,
      ctaText: 'Text the business line',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida · Desde 1996',
      eyebrow: 'Sur de Florida · Desde 1996 · Lic. CFC1429613',
      heroTitle: 'Plomería de confianza para hogares y negocios del sur de Florida.',
      heroLead: 'Servicio residencial y comercial respaldado por más de 30 años de experiencia, atención directa y la licencia de Florida CFC1429613.',
      primaryCta: 'Llamar al ' + PHONE,
      secondaryCta: 'Solicitar servicio',
      fact1Label: 'Establecida',
      fact2Label: 'Horario',
      fact3Label: 'Licencia',
      badge: 'Por qué llaman a OTTO',
      info1Title: 'Más de 30 años de experiencia',
      info1Body: 'Atendiendo hogares y negocios del sur de Florida desde 1996.',
      info2Title: 'Residencial + comercial',
      info2Body: 'Reparaciones, reemplazos, instalaciones y apoyo para proyectos de plomería.',
      info3Title: 'Línea directa del negocio',
      info3Body: 'Llame o escriba de lunes a sábado, de 7 AM a 7 PM.',
      servicesTitle: 'Servicios de plomería',
      servicesLead: 'Servicio directo para reparaciones, reemplazos, instalaciones y necesidades residenciales o comerciales.',
      businessTitle: 'Una compañía local que puede verificar.',
      businessLead: 'Establecida en 1996, con licencia de Florida y servicio en el sur de Florida seis días a la semana.',
      biz1Title: 'Empresa',
      biz2Title: 'Línea directa',
      biz3Title: 'Licencia de Florida',
      biz4Title: 'Establecida',
      biz4Body: 'Atendiendo clientes desde 1996.',
      biz5Title: 'Servicio',
      biz5Body: 'Plomería residencial y comercial.',
      biz6Title: 'Disponibilidad',
      biz6Body: 'Lunes–sábado · 7 AM–7 PM',
      contactTitle: 'Contacte a OTTO Plumbing',
      contactLead: 'Llame o escriba directamente, o envíe los detalles de un trabajo no urgente mediante el formulario de servicio.',
      contactPhoneLabel: 'Línea directa del negocio',
      contactLicenseLabel: 'Licencia de Florida',
      contactNotesLabel: 'Horario',
      contactNotesBody: 'Lunes a sábado · 7 AM a 7 PM.',
      contactCardTitle: '¿Necesita servicio?',
      contactCardLead: 'Llame o escriba para la respuesta más rápida. Para solicitudes detalladas, use el formulario de abajo.',
      contactButton1: 'Llamar ahora',
      contactButton2: 'Escribir ahora',
      contactWhyLabel: 'Área de servicio',
      contactWhyBody: 'Servicio en el sur de Florida.',
      ctaTitle: '¿Necesita un plomero?',
      ctaLead: 'Hable directamente con OTTO Plumbing Inc. sobre sus necesidades residenciales o comerciales.',
      ctaCall: 'Llamar al ' + PHONE,
      ctaText: 'Escribir a la línea del negocio',
      footerRight: 'Sur de Florida · Lic. #CFC1429613 · ' + PHONE
    }
  };

  var HERO_VALUES = {
    en: ['Since 1996', 'Mon–Sat · 7 AM–7 PM', 'CFC1429613'],
    es: ['Desde 1996', 'Lun–sáb · 7 AM–7 PM', 'CFC1429613']
  };

  function currentLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function applyLogo() {
    var img = document.querySelector('.brand img');
    if (!img) return;
    if (img.getAttribute('src') !== CRM_LOGO) img.setAttribute('src', CRM_LOGO);
    img.setAttribute('alt', 'OTTO Plumbing Inc.');
    img.removeAttribute('aria-hidden');
    img.classList.add('crm-wordmark');
  }

  function applyCopy() {
    var lang = currentLang();
    try {
      if (typeof translations !== 'undefined') {
        Object.assign(translations.en, COPY.en);
        Object.assign(translations.es, COPY.es);
      }
      if (typeof setLang === 'function') setLang(lang);
    } catch (ignored) {}

    var values = HERO_VALUES[lang];
    var facts = document.querySelectorAll('.hero-facts .fact-value');
    for (var i = 0; i < facts.length && i < values.length; i += 1) facts[i].textContent = values[i];

    document.title = lang === 'es'
      ? 'OTTO Plumbing Inc. — Plomería en el sur de Florida desde 1996'
      : 'OTTO Plumbing Inc. — South Florida Plumbing Since 1996';

    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', lang === 'es'
        ? 'OTTO Plumbing Inc. ofrece plomería residencial y comercial en el sur de Florida. Más de 30 años de experiencia. Lic. CFC1429613. Llame o escriba al (786) 344-2837.'
        : 'OTTO Plumbing Inc. provides residential and commercial plumbing across South Florida. 30+ years of experience. Lic. CFC1429613. Call or text (786) 344-2837.');
    }
  }

  function applyAll() {
    applyLogo();
    applyCopy();
  }

  applyAll();

  var buttons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function () {
      window.setTimeout(applyAll, 8);
    });
  }
})();
