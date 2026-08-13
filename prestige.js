/* OTTO Plumbing Inc. — premium brand copy layer. */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing · Established 1996',
      eyebrow: 'South Florida · Est. 1996 · Lic. CFC1429613',
      experienceValue: '30+ YEARS',
      experienceLabel: 'Serving South Florida',
      heroTitle: 'Trusted residential and commercial plumbing across South Florida.',
      heroLead: 'Professional plumbing for homes, businesses, and buildings, backed by more than 30 years of experience and Florida license CFC1429613.',
      brandQuote: '“Making water flow through our pipes, like integrity through our name.”',
      primaryCta: 'Call ' + PHONE,
      secondaryCta: 'Request service',
      fact1Label: 'Established',
      fact2Label: 'Hours',
      fact3Label: 'License',
      badge: 'Why customers call OTTO',
      info1Title: '30+ years of experience',
      info1Body: 'Serving South Florida homes and businesses since 1996.',
      info2Title: 'Homes, businesses + buildings',
      info2Body: 'Residential and commercial repairs, installations, replacements, and project support across South Florida.',
      info3Title: 'Direct business line',
      info3Body: 'Call or text Monday through Saturday, 7 AM to 7 PM.',
      servicesTitle: 'Plumbing services',
      servicesLead: 'Residential and commercial plumbing for homes, businesses, and buildings across South Florida.',
      businessTitle: 'A local plumbing company you can verify.',
      businessLead: 'Independent public records support the company’s license and permitted project history.',
      credential1Kicker: 'Florida DBPR',
      credential1Body: 'Florida Certified Plumbing Contractor license. Verify its current status directly with the state.',
      credential3Value: 'Score 110 · Top 4%',
      credential3Body: 'Public contractor profile reporting 175 permitted projects.',
      verifySource: 'Verify source ↗',
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
      whatsappTitle: 'Contact us on WhatsApp',
      whatsappLead: 'Tap the link and we’ll get in touch with you.',
      ctaTitle: 'Need a plumber?',
      ctaLead: 'Talk directly with OTTO Plumbing Inc. about your residential or commercial plumbing needs.',
      ctaCall: 'Call ' + PHONE,
      ctaText: 'Text the business line',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida · Desde 1996',
      eyebrow: 'Sur de Florida · Desde 1996 · Lic. CFC1429613',
      experienceValue: 'MÁS DE 30 AÑOS',
      experienceLabel: 'Sirviendo al sur de Florida',
      heroTitle: 'Plomería residencial y comercial de confianza en todo el sur de Florida.',
      heroLead: 'Plomería profesional para hogares, negocios y edificios, respaldada por más de 30 años de experiencia y la licencia de Florida CFC1429613.',
      brandQuote: '“Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre.”',
      primaryCta: 'Llamar al ' + PHONE,
      secondaryCta: 'Solicitar servicio',
      fact1Label: 'Establecida',
      fact2Label: 'Horario',
      fact3Label: 'Licencia',
      badge: 'Por qué llaman a OTTO',
      info1Title: 'Más de 30 años de experiencia',
      info1Body: 'Atendiendo hogares y negocios del sur de Florida desde 1996.',
      info2Title: 'Hogares, negocios + edificios',
      info2Body: 'Reparaciones, instalaciones, reemplazos y apoyo para proyectos residenciales y comerciales en todo el sur de Florida.',
      info3Title: 'Línea directa del negocio',
      info3Body: 'Llame o escriba de lunes a sábado, de 7 AM a 7 PM.',
      servicesTitle: 'Servicios de plomería',
      servicesLead: 'Plomería residencial y comercial para hogares, negocios y edificios en todo el sur de Florida.',
      businessTitle: 'Una compañía local que puede verificar.',
      businessLead: 'Registros públicos independientes respaldan la licencia y el historial de proyectos con permisos.',
      credential1Kicker: 'DBPR de Florida',
      credential1Body: 'Licencia de Contratista Certificado de Plomería de Florida. Verifique su estado actual directamente con el estado.',
      credential3Value: 'Puntuación 110 · 4% superior',
      credential3Body: 'Perfil público de contratista que informa 175 proyectos con permisos.',
      verifySource: 'Verificar fuente ↗',
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
      whatsappTitle: 'Contáctenos por WhatsApp',
      whatsappLead: 'Contáctenos, presione el enlace y nos comunicaremos con usted.',
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

  function renderVerifiedReviews() {
    var reviews = (window.OTTO_VERIFIED_REVIEWS || []).filter(function (review) {
      return review && review.name && review.platform && review.excerpt && review.url && Number(review.rating) >= 1 && Number(review.rating) <= 5;
    });
    if (!reviews.length || document.querySelector('.verified-reviews')) return;

    var contact = document.getElementById('contact');
    if (!contact || !contact.parentNode) return;
    var section = document.createElement('section');
    section.className = 'verified-reviews';
    section.setAttribute('aria-labelledby', 'verified-reviews-title');
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    var title = document.createElement('h2');
    title.id = 'verified-reviews-title';
    title.textContent = currentLang() === 'es' ? 'Opiniones verificadas' : 'Verified customer reviews';
    var grid = document.createElement('div');
    grid.className = 'verified-review-grid';

    reviews.forEach(function (review) {
      var card = document.createElement('article');
      card.className = 'verified-review-card';
      var stars = document.createElement('div');
      stars.className = 'verified-review-stars';
      stars.setAttribute('aria-label', review.rating + ' out of 5 stars');
      stars.textContent = '★★★★★'.slice(0, Math.round(Number(review.rating)));
      var quote = document.createElement('blockquote');
      quote.textContent = '“' + review.excerpt + '”';
      var source = document.createElement('a');
      source.href = review.url;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = review.name + ' · ' + review.platform;
      card.appendChild(stars);
      card.appendChild(quote);
      card.appendChild(source);
      grid.appendChild(card);
    });
    wrap.appendChild(title);
    wrap.appendChild(grid);
    section.appendChild(wrap);
    contact.parentNode.insertBefore(section, contact);
  }

  function applyAll() {
    applyCopy();
    renderVerifiedReviews();
  }

  applyAll();

  var buttons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function () {
      window.setTimeout(applyAll, 8);
    });
  }
})();
