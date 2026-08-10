/* OTTO Plumbing Inc. — premium brand pass.
 * Presentation only. Keeps intake delivery and interaction behavior untouched.
 */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';
  var CRM_LOGO = 'https://raw.githubusercontent.com/ejnburrows-rgb/otto/main/logo.jpg';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing · Established 1996',
      eyebrow: 'South Florida · Established 1996 · Lic. CFC1429613',
      heroTitle: 'Plumbing built on 30+ years of craft.',
      heroLead: 'Residential and commercial plumbing across South Florida, backed by a Florida-licensed business established in 1996.',
      primaryCta: 'Call ' + PHONE,
      secondaryCta: 'Request service',
      fact1Label: 'Established',
      fact2Label: 'Business hours',
      fact3Label: 'Florida license',
      badge: 'Licensed · Experienced · Local',
      info1Title: 'Established in 1996',
      info1Body: 'More than three decades of plumbing experience serving South Florida homes and businesses.',
      info2Title: 'Residential + commercial',
      info2Body: 'Service for everyday repairs, larger plumbing needs, replacements, and project work.',
      info3Title: 'Direct business line',
      info3Body: 'Call or text OTTO Plumbing directly Monday through Saturday, 7 AM to 7 PM.',
      servicesTitle: 'Plumbing, handled with experience.',
      servicesLead: 'Repairs, replacements, installations, and project support for residential and commercial plumbing needs.',
      businessTitle: 'Experience you can verify.',
      businessLead: 'Established in 1996. Florida licensed. Serving South Florida six days a week.',
      contactTitle: 'Speak with OTTO Plumbing.',
      contactLead: 'Call or text the business directly, or send the details of a non-urgent job through the service-request form.',
      contactCardTitle: 'A clear next step.',
      contactCardLead: 'For the fastest path, call or text. For detailed requests, use the online service form below.',
      contactWhyLabel: 'Service area',
      contactWhyBody: 'Serving South Florida.',
      ctaTitle: 'Ready when you need a plumber.',
      ctaLead: 'Talk directly with OTTO Plumbing Inc. about your residential or commercial plumbing needs.',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida · Desde 1996',
      eyebrow: 'Sur de Florida · Desde 1996 · Lic. CFC1429613',
      heroTitle: 'Plomería respaldada por más de 30 años de experiencia.',
      heroLead: 'Servicio de plomería residencial y comercial en el sur de Florida, respaldado por un negocio con licencia de Florida establecido en 1996.',
      primaryCta: 'Llamar al ' + PHONE,
      secondaryCta: 'Solicitar servicio',
      fact1Label: 'Establecida',
      fact2Label: 'Horario',
      fact3Label: 'Licencia de Florida',
      badge: 'Con licencia · Experiencia · Servicio local',
      info1Title: 'Establecida en 1996',
      info1Body: 'Más de tres décadas de experiencia atendiendo necesidades de plomería en hogares y negocios del sur de Florida.',
      info2Title: 'Residencial + comercial',
      info2Body: 'Servicio para reparaciones, reemplazos, instalaciones y trabajos de proyecto.',
      info3Title: 'Línea directa del negocio',
      info3Body: 'Llame o escriba directamente a OTTO Plumbing de lunes a sábado, de 7 AM a 7 PM.',
      servicesTitle: 'Plomería atendida con experiencia.',
      servicesLead: 'Reparaciones, reemplazos, instalaciones y apoyo para proyectos residenciales y comerciales.',
      businessTitle: 'Experiencia que puede verificar.',
      businessLead: 'Establecida en 1996. Con licencia de Florida. Servicio en el sur de Florida seis días a la semana.',
      contactTitle: 'Hable con OTTO Plumbing.',
      contactLead: 'Llame o escriba directamente al negocio, o envíe los detalles de un trabajo que no sea urgente mediante el formulario de servicio.',
      contactCardTitle: 'Un siguiente paso claro.',
      contactCardLead: 'Para la vía más rápida, llame o escriba. Para solicitudes detalladas, use el formulario de servicio de abajo.',
      contactWhyLabel: 'Área de servicio',
      contactWhyBody: 'Servicio en el sur de Florida.',
      ctaTitle: 'Listos cuando necesite un plomero.',
      ctaLead: 'Hable directamente con OTTO Plumbing Inc. sobre sus necesidades de plomería residencial o comercial.',
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
