/* OTTO Plumbing Inc. — premium, minimal customer-facing composition layer. */
(function () {
  'use strict';

  var PHONE = '(786) 344-2837';
  var PHONE_HREF = 'tel:+17863442837';

  var COPY = {
    en: {
      brandSub: 'South Florida plumbing · Established 1996',
      navServices: 'Services',
      navBusiness: 'About',
      navContact: 'Request Service',
      callNow: 'Call OTTO',
      eyebrow: '30+ years serving South Florida',
      experienceValue: 'EST. 1996',
      experienceLabel: 'South Florida',
      heroTitle: 'Plumbing service across South Florida.',
      heroLead: 'Residential and commercial plumbing from OTTO Plumbing Inc. Florida license CFC1429613. English / Español.',
      brandQuote: '“Making water flow through our pipes, like integrity through our name.”',
      primaryCta: 'Request Service',
      secondaryCta: 'Call OTTO',
      servicesTitle: 'What can OTTO help with?',
      servicesLead: 'Choose a service to start a short request, or call OTTO directly.',
      businessTitle: 'OTTO Plumbing Inc.',
      businessLead: 'Verified business information customers can use before requesting service.',
      contactTitle: 'Contact OTTO',
      contactLead: 'Request service online, call (786) 344-2837, or use WhatsApp.',
      contactPhoneLabel: 'Phone',
      contactLicenseLabel: 'Florida license',
      contactNotesLabel: 'Service area',
      contactNotesBody: 'South Florida · Residential & Commercial',
      contactCardTitle: 'Direct contact',
      contactCardLead: 'Use the online request for job details. Call or WhatsApp when you prefer direct contact.',
      contactButton1: 'Call OTTO',
      contactButton2: 'Text OTTO',
      contactWhyLabel: 'Hours',
      contactWhyBody: 'Monday–Saturday · 7 AM–7 PM',
      whatsappTitle: 'WhatsApp',
      whatsappLead: 'Open WhatsApp with a prepared message to OTTO.',
      ctaTitle: 'Ready to request service?',
      ctaLead: 'Send the job details in a few short steps.',
      ctaCall: 'Request Service',
      ctaText: 'Call OTTO',
      footerRight: 'South Florida · Lic. #CFC1429613 · ' + PHONE
    },
    es: {
      brandSub: 'Plomería en el sur de Florida · Desde 1996',
      navServices: 'Servicios',
      navBusiness: 'Nosotros',
      navContact: 'Solicitar servicio',
      callNow: 'Llamar a OTTO',
      eyebrow: 'Más de 30 años sirviendo al sur de Florida',
      experienceValue: 'DESDE 1996',
      experienceLabel: 'Sur de Florida',
      heroTitle: 'Servicio de plomería en el sur de Florida.',
      heroLead: 'Plomería residencial y comercial de OTTO Plumbing Inc. Licencia de Florida CFC1429613. English / Español.',
      brandQuote: '“Hacemos fluir el agua por nuestras tuberías, como la integridad fluye por nuestro nombre.”',
      primaryCta: 'Solicitar servicio',
      secondaryCta: 'Llamar a OTTO',
      servicesTitle: '¿Con qué puede ayudar OTTO?',
      servicesLead: 'Elija un servicio para comenzar una solicitud breve, o llame directamente a OTTO.',
      businessTitle: 'OTTO Plumbing Inc.',
      businessLead: 'Información comercial verificada que puede consultar antes de solicitar servicio.',
      contactTitle: 'Contactar a OTTO',
      contactLead: 'Solicite servicio en línea, llame al (786) 344-2837 o use WhatsApp.',
      contactPhoneLabel: 'Teléfono',
      contactLicenseLabel: 'Licencia de Florida',
      contactNotesLabel: 'Área de servicio',
      contactNotesBody: 'Sur de Florida · Residencial y comercial',
      contactCardTitle: 'Contacto directo',
      contactCardLead: 'Use la solicitud en línea para enviar los detalles del trabajo. Llame o use WhatsApp si prefiere contacto directo.',
      contactButton1: 'Llamar a OTTO',
      contactButton2: 'Escribir a OTTO',
      contactWhyLabel: 'Horario',
      contactWhyBody: 'Lunes–sábado · 7 AM–7 PM',
      whatsappTitle: 'WhatsApp',
      whatsappLead: 'Abra WhatsApp con un mensaje preparado para OTTO.',
      ctaTitle: '¿Listo para solicitar servicio?',
      ctaLead: 'Envíe los detalles del trabajo en unos pasos breves.',
      ctaCall: 'Solicitar servicio',
      ctaText: 'Llamar a OTTO',
      footerRight: 'Sur de Florida · Lic. #CFC1429613 · ' + PHONE
    }
  };

  var TRUST = {
    en: [
      ['Established', '1996'],
      ['Service Area', 'South Florida'],
      ['Service', 'Residential & Commercial'],
      ['Florida License', 'CFC1429613']
    ],
    es: [
      ['Desde', '1996'],
      ['Área de servicio', 'Sur de Florida'],
      ['Servicio', 'Residencial y comercial'],
      ['Licencia de Florida', 'CFC1429613']
    ]
  };

  var SERVICES = {
    en: [
      ['Leak', 'Active or visible plumbing leaks.', 'leak'],
      ['Drain / clog', 'Slow or blocked drains and stoppages.', 'drain'],
      ['Toilet / faucet', 'Fixture repair, replacement, and installation.', 'fixtures'],
      ['Water heater', 'Water heater service, replacement, and installation.', 'heater'],
      ['Plumbing installation', 'Fixtures, piping, and plumbing installations.', 'installation'],
      ['Remodel / construction', 'Plumbing work for kitchens, baths, and projects.', 'remodel'],
      ['Commercial service', 'Plumbing service for commercial properties.', 'commercial'],
      ['Other', 'Another plumbing need not listed here.', 'other']
    ],
    es: [
      ['Fuga', 'Fugas de plomería activas o visibles.', 'leak'],
      ['Drenaje / tapón', 'Drenajes lentos, tapados y obstrucciones.', 'drain'],
      ['Inodoro / llave', 'Reparación, reemplazo e instalación de accesorios.', 'fixtures'],
      ['Calentador de agua', 'Servicio, reemplazo e instalación de calentadores.', 'heater'],
      ['Instalación de plomería', 'Accesorios, tuberías e instalaciones de plomería.', 'installation'],
      ['Remodelación / construcción', 'Plomería para cocinas, baños y proyectos.', 'remodel'],
      ['Servicio comercial', 'Servicio de plomería para propiedades comerciales.', 'commercial'],
      ['Otro', 'Otra necesidad de plomería no incluida aquí.', 'other']
    ]
  };

  var SERVICE_FLOW = {
    en: {
      title: 'How it works',
      steps: [
        ['Request service', 'Tell OTTO what you need in a few short steps.'],
        ['OTTO reviews it', 'The request arrives in OTTO’s service system with the job details.'],
        ['The office follows up', 'OTTO uses the contact information you provided to continue the service conversation.']
      ]
    },
    es: {
      title: 'Cómo funciona',
      steps: [
        ['Solicite servicio', 'Cuéntele a OTTO lo que necesita en unos pasos breves.'],
        ['OTTO revisa la solicitud', 'La solicitud llega al sistema de servicio de OTTO con los detalles del trabajo.'],
        ['La oficina le da seguimiento', 'OTTO usa los datos de contacto que proporcionó para continuar la conversación de servicio.']
      ]
    }
  };

  var BUSINESS = {
    en: [
      ['Florida license', 'CFC1429613', 'Florida Certified Plumbing Contractor license.'],
      ['Established', '1996', 'More than 30 years serving South Florida.'],
      ['Hours', 'Mon–Sat · 7 AM–7 PM', 'Published business hours.'],
      ['Service area', 'South Florida', 'Residential and commercial plumbing.']
    ],
    es: [
      ['Licencia de Florida', 'CFC1429613', 'Licencia de Contratista Certificado de Plomería de Florida.'],
      ['Desde', '1996', 'Más de 30 años sirviendo al sur de Florida.'],
      ['Horario', 'Lun–sáb · 7 AM–7 PM', 'Horario publicado del negocio.'],
      ['Área de servicio', 'Sur de Florida', 'Plomería residencial y comercial.']
    ]
  };

  function currentLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function setHref(selector, href) {
    var node = document.querySelector(selector);
    if (node) node.setAttribute('href', href);
  }

  function renderTrustStrip(lang) {
    var root = document.querySelector('.hero-facts');
    if (!root) return;
    root.textContent = '';
    TRUST[lang].forEach(function (item) {
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

  function renderServices(lang) {
    var grid = document.querySelector('#services .service-grid');
    if (!grid) return;
    grid.textContent = '';
    SERVICES[lang].forEach(function (service) {
      var link = document.createElement('a');
      link.className = 'tile service-tile';
      link.href = '#request';
      link.setAttribute('data-service-key', service[2]);
      var heading = document.createElement('h3');
      heading.textContent = service[0];
      var body = document.createElement('p');
      body.textContent = service[1];
      link.appendChild(heading);
      link.appendChild(body);
      grid.appendChild(link);
    });
  }

  function renderServiceFlow(lang) {
    var serviceGrid = document.querySelector('#services .service-grid');
    if (!serviceGrid || !serviceGrid.parentNode) return;
    var flow = document.querySelector('.service-flow');
    if (!flow) {
      flow = document.createElement('div');
      flow.className = 'service-flow';
      serviceGrid.parentNode.appendChild(flow);
    }
    flow.setAttribute('aria-label', lang === 'es' ? 'Proceso de servicio' : 'Service process');
    flow.textContent = '';

    var data = SERVICE_FLOW[lang];
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

  function renderBusiness(lang) {
    var root = document.querySelector('#business .credential-grid');
    if (!root) return;
    root.textContent = '';
    BUSINESS[lang].forEach(function (item, index) {
      var card = index === 0 ? document.createElement('a') : document.createElement('div');
      card.className = 'credential-card';
      if (index === 0) {
        card.href = 'https://www.myfloridalicense.com/portalsearches/VerifyLicensee';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }
      var kicker = document.createElement('span');
      kicker.className = 'credential-kicker';
      kicker.textContent = item[0];
      var strong = document.createElement('strong');
      strong.textContent = item[1];
      var body = document.createElement('p');
      body.textContent = item[2];
      card.appendChild(kicker);
      card.appendChild(strong);
      card.appendChild(body);
      if (index === 0) {
        var verify = document.createElement('span');
        verify.className = 'credential-link';
        verify.textContent = lang === 'es' ? 'Verificar con el estado ↗' : 'Verify with the state ↗';
        card.appendChild(verify);
      }
      root.appendChild(card);
    });
  }

  function applyLinks() {
    setHref('.hero-cta .btn-primary', '#request');
    setHref('.hero-cta .btn-secondary', PHONE_HREF);
    setHref('.nav-links a[href="#contact"]', '#request');
    setHref('#closing .cta-actions .btn-primary', '#request');
    setHref('#closing .cta-actions .btn-secondary', PHONE_HREF);
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
    renderServices(lang);
    renderServiceFlow(lang);
    renderBusiness(lang);
    applyLinks();

    document.title = lang === 'es'
      ? 'OTTO Plumbing Inc. — Plomería residencial y comercial en el sur de Florida'
      : 'OTTO Plumbing Inc. — Residential & Commercial Plumbing in South Florida';

    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', lang === 'es'
        ? 'OTTO Plumbing Inc. ofrece plomería residencial y comercial en el sur de Florida. Desde 1996. Lic. CFC1429613. Solicite servicio o llame al (786) 344-2837.'
        : 'OTTO Plumbing Inc. provides residential and commercial plumbing across South Florida. Established 1996. Lic. CFC1429613. Request service or call (786) 344-2837.');
    }
  }

  applyCopy();

  var buttons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function () {
      window.setTimeout(applyCopy, 8);
    });
  }
})();
