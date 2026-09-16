/* OTTO Plumbing Inc. — verified public metadata only. */
(function () {
  'use strict';

  /* Use the Vercel project production alias that is actually serving current
   * main. The shorter vanity alias can replace this once Vercel routes it to
   * the same deployment. */
  var canonicalUrl = 'https://otto-plumbing-site-ejns-projects-1b938dd2.vercel.app/';
  var canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', canonicalUrl);

  var jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (jsonLd) {
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Plumber',
      name: 'OTTO Plumbing Inc.',
      telephone: '+1-786-344-2837',
      url: canonicalUrl,
      areaServed: 'South Florida',
      openingHours: 'Mo-Sa 07:00-19:00',
      foundingDate: '1996',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'Florida Certified Plumbing Contractor License',
        value: 'CFC1429613'
      }
    });
  }

  var ogTitle = document.querySelector('meta[property="og:title"]');
  var ogDescription = document.querySelector('meta[property="og:description"]');
  var ogUrl = document.querySelector('meta[property="og:url"]');
  var ogImage = document.querySelector('meta[property="og:image"]');
  if (ogTitle) ogTitle.setAttribute('content', 'OTTO Plumbing Inc. — Residential & Commercial Plumbing in South Florida');
  if (ogDescription) ogDescription.setAttribute('content', 'Residential and commercial plumbing across South Florida. Established 1996. Lic. CFC1429613.');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  if (ogImage) ogImage.setAttribute('content', canonicalUrl + 'icon-512.png');

  function applyRequestHeading() {
    var es = document.documentElement.lang === 'es';
    var title = document.querySelector('#request-section [data-otto-i18n="formTitle"]');
    var lead = document.querySelector('#request-section [data-otto-i18n="formLead"]');
    if (title) title.textContent = es ? 'Solicitar servicio' : 'Request service';
    if (lead) lead.textContent = es
      ? 'Una solicitud guiada y breve que llega directamente al sistema de servicio de OTTO.'
      : 'A short guided request that goes directly into OTTO’s service system.';
  }

  applyRequestHeading();
  var languageButtons = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < languageButtons.length; i += 1) {
    languageButtons[i].addEventListener('click', function () {
      window.setTimeout(applyRequestHeading, 10);
    });
  }
})();