/* OTTO Plumbing Inc. — premium customer-facing copy and composition layer. */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing · Established 1996',
      navServices: 'Services',
      navBusiness: 'About',
      navContact: 'Request Service',
      callNow: 'Call OTTO',
      eyebrow: '30+ years serving South Florida',
      experienceValue: '30+ YEARS',
      experienceLabel: 'Serving South Florida',
      heroTitle: 'OTTO Plumbing Inc.',
      heroLead: 'Residential and commercial plumbing across South Florida. Florida plumbing license CFC1429613. English / Español.',
      brandQuote: '“Making water flow through our pipes, like integrity through our name.”',
      primaryCta: 'Call OTTO',
      secondaryCta: 'Request Service',
      badge: 'OTTO Plumbing Inc.',
      info1Title: 'Residential Plumbing',
      info1Body: 'Plumbing service for homes across South Florida.',
      info2Title: 'Commercial Plumbing',
      info2Body: 'Commercial plumbing service across South Florida.',
      info3Title: 'English / Español',
      info3Body: 'Choose English or Spanish at any time.',
      servicesTitle: 'Plumbing services',
      servicesLead: 'Leak repair, drain and sewer work, water heaters, general plumbing, fixture updates, and remodel support for residential and commercial customers.',
      businessTitle: 'Licensed. Established. Easy to verify.',
      businessLead: 'Florida license CFC1429613 and public project records provide direct ways to verify OTTO Plumbing Inc.',
      credential1Kicker: 'Florida DBPR',
      credential1Body: 'Florida Certified Plumbing Contractor license. Verify its current status directly with the state.',
      credential3Value: 'Score 110 · Top 4%',
      credential3Body: 'Public contractor profile reporting 175 permitted projects.',
      verifySource: 'Verify source ↗',
      contactTitle: 'Contact OTTO Plumbing',
      contactLead: 'Call or text (786) 344-2837, or send the job details with the service-request form below.',
      contactPhoneLabel: 'Call or text',
      contactLicenseLabel: 'Florida license',
      contactNotesLabel: 'Service area',
      contactNotesBody: 'South Florida · Residential & Commercial',
      contactCardTitle: 'Contact options',
      contactCardLead: 'Call OTTO for the most direct path. Text and the online service request are also available.',
      contactButton1: 'Call OTTO',
      contactButton2: 'Text OTTO',
      contactWhyLabel: 'English / Español',
      contactWhyBody: 'Use the language selector at the top of the page at any time.',
      whatsappTitle: 'Contact us on WhatsApp',
      whatsappLead: 'Tap the link and we’ll get in touch with you.',
      ctaTitle: 'Need plumbing service?',
      ctaLead: 'Call or text OTTO Plumbing Inc. about your residential or commercial plumbing needs.',
      ctaCall: 'Call OTTO',
      ctaText: 'Text OTTO',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida · Desde 1996',
      navServices: 'Servicios',
      navBusiness: 'Nosotros',
      navContact: 'Solicitar servicio',
      callNow: 'Llamar a OTTO',
      eyebrow: 'Más de 30 años sirviendo al sur de Florida',
      experienceValue: 'MÁS DE 30 AÑOS',
      experienceLabel: 'Sirviendo al sur de Florida',
      heroTitle: 'OTTO Plumbing Inc.',
      heroLead: 'Plomería residencial y comercial en el sur de Florida. Licencia de plomería de Florida CFC1429613. English / Español.',
      brandQuote: '“Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre.”',
      primaryCta: 'Llamar a OTTO',
      secondaryCta: 'Solicitar servicio',
      badge: 'OTTO Plumbing Inc.',
      info1Title: 'Plomería residencial',
      info1Body: 'Servicio de plomería para hogares en el sur de Florida.',
      info2Title: 'Plomería comercial',
      info2Body: 'Servicio de plomería comercial en el sur de Florida.',
      info3Title: 'English / Español',
      info3Body: 'Puede cambiar entre inglés y español en cualquier momento.',
      servicesTitle: 'Servicios de plomería',
      servicesLead: 'Reparación de fugas, drenaje y alcantarillado, calentadores de agua, plomería general, actualización de accesorios y apoyo para remodelaciones residenciales y comerciales.',
      businessTitle: 'Con licencia. Establecida. Fácil de verificar.',
      businessLead: 'La licencia de Florida CFC1429613 y los registros públicos de proyectos ofrecen formas directas de verificar a OTTO Plumbing Inc.',
      credential1Kicker: 'DBPR de Florida',
      credential1Body: 'Licencia de Contratista Certificado de Plomería de Florida. Verifique su estado actual directamente con el estado.',
      credential3Value: 'Puntuación 110 · 4% superior',
      credential3Body: 'Perfil público de contratista que informa 175 proyectos con permisos.',
      verifySource: 'Verificar fuente ↗',
      contactTitle: 'Contacte a OTTO Plumbing',
      contactLead: 'Llame o escriba al (786) 344-2837, o envíe los detalles del trabajo mediante el formulario de servicio de abajo.',
      contactPhoneLabel: 'Llamar o escribir',
      contactLicenseLabel: 'Licencia de Florida',
      contactNotesLabel: 'Área de servicio',
      contactNotesBody: 'Sur de Florida · Residencial y comercial',
      contactCardTitle: 'Opciones de contacto',
      contactCardLead: 'Llame a OTTO como opción principal. También puede escribir o enviar la solicitud de servicio en línea.',
      contactButton1: 'Llamar a OTTO',
      contactButton2: 'Escribir a OTTO',
      contactWhyLabel: 'English / Español',
      contactWhyBody: 'Use el selector de idioma en la parte superior de la página en cualquier momento.',
      whatsappTitle: 'Contáctenos por WhatsApp',
      whatsappLead: 'Contáctenos, presione el enlace y nos comunicaremos con usted.',
      ctaTitle: '¿Necesita servicio de plomería?',
      ctaLead: 'Llame o escriba a OTTO Plumbing Inc. para hablar sobre sus necesidades residenciales o comerciales.',
      ctaCall: 'Llamar a OTTO',
      ctaText: 'Escribir a OTTO',
      footerRight: 'Sur de Florida · Lic. #CFC1429613 · ' + PHONE
    }
  };

  var TRUST = {
    en: [
      ['Experience', '30+ Years'],
      ['Service Area', 'South Florida'],
      ['Plumbing', 'Residential & Commercial'],
      ['Florida License', 'CFC1429613'],
      ['Languages', 'English / Español']
    ],
    es: [
      ['Experiencia', 'Más de 30 años'],
      ['Área de servicio', 'Sur de Florida'],
      ['Plomería', 'Residencial y comercial'],
      ['Licencia de Florida', 'CFC1429613'],
      ['Idiomas', 'English / Español']
    ]
  };

  var SERVICE_FLOW = {
    en: {
      title: 'How service works',
      steps: [
        ['Contact OTTO', 'Call, text, WhatsApp when available, or submit the service request.'],
        ['Tell Us What You Need', 'Share the plumbing issue and the location or job information.'],
        ['OTTO Follows Up', 'The office receives the request and follows up through the selected contact method.']
      ]
    },
    es: {
      title: 'Cómo funciona el servicio',
      steps: [
        ['Contacte a OTTO', 'Llame, escriba, use WhatsApp cuando esté disponible o envíe la solicitud de servicio.'],
        ['Cuéntenos qué necesita', 'Comparta el problema de plomería y la información de la ubicación o del trabajo.'],
        ['OTTO le da seguimiento', 'La oficina recibe la solicitud y se comunica por el método de contacto seleccionado.']
      ]
    }
  };

  var FORM_COPY = {
    en: {
      formTitle: 'Request service online',
      formLead: 'Tell us what you need and how you would like to be contacted. For a direct call or text, use (786) 344-2837.'
    },
    es: {
      formTitle: 'Solicitar servicio en línea',
      formLead: 'Cuéntenos qué necesita y cómo prefiere que nos comuniquemos con usted. Para llamar o escribir directamente, use el (786) 344-2837.'
    }
  };

  function currentLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function renderTrustStrip(lang) {
    var root = document.querySelector('.hero-facts');
    if (!root) return;
    var items = TRUST[lang];
    root.textContent = '';
    items.forEach(function (item) {
      var fact = document.createElement('div');
      fact.className = 'fact';
      var label = document.createElement('div');
      label.className = 'fact-label';
      label.textContent = item[0];
      var value = document.createElement('div');
      value.className = 'fact-value';
      value.textContent = item[1];
      fact.appendChild(label);
      fact.appendChild(value);
      root.appendChild(fact);
    });
  }

  function renderServiceFlow(lang) {
    var serviceGrid = document.querySelector('#services .service-grid');
    if (!serviceGrid || !serviceGrid.parentNode) return;
    var flow = document.querySelector('.service-flow');
    if (!flow) {
      flow = document.createElement('div');
      flow.className = 'service-flow';
      flow.setAttribute('aria-label', 'Service process');
      serviceGrid.parentNode.appendChild(flow);
    }

    var data = SERVICE_FLOW[lang];
    flow.textContent = '';
    var title = document.createElement('div');
    title.className = 'service-flow__title';
    title.textContent = data.title;
    var grid = document.createElement('div');
    grid.className = 'service-flow__grid';

    data.steps.forEach(function (step, index) {
      var item = document.createElement('div');
      item.className = 'service-flow__step';
      var number = document.createElement('span');
      number.className = 'service-flow__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = '0' + (index + 1);
      var heading = document.createElement('h3');
      heading.textContent = step[0];
      var copy = document.createElement('p');
      copy.textContent = step[1];
      item.appendChild(number);
      item.appendChild(heading);
      item.appendChild(copy);
      grid.appendChild(item);
    });

    flow.appendChild(title);
    flow.appendChild(grid);
  }

  function applyFormCopy(lang) {
    var copy = FORM_COPY[lang];
    Object.keys(copy).forEach(function (key) {
      var node = document.querySelector('[data-otto-i18n="' + key + '"]');
      if (node) node.textContent = copy[key];
    });
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

    renderTrustStrip(lang);
    renderServiceFlow(lang);
    applyFormCopy(lang);

    document.title = lang === 'es'
      ? 'OTTO Plumbing Inc. — Plomería residencial y comercial en el sur de Florida'
      : 'OTTO Plumbing Inc. — Residential & Commercial Plumbing in South Florida';

    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', lang === 'es'
        ? 'OTTO Plumbing Inc. ofrece plomería residencial y comercial en el sur de Florida. Más de 30 años. Lic. CFC1429613. Llame o escriba al (786) 344-2837.'
        : 'OTTO Plumbing Inc. provides residential and commercial plumbing across South Florida. 30+ years. Lic. CFC1429613. Call or text (786) 344-2837.');
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
