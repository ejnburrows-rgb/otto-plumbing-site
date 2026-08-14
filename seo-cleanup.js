/* OTTO Plumbing Inc. — keep rendered metadata limited to verified public claims. */
(function () {
  'use strict';

  var jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (jsonLd) {
    try {
      var data = JSON.parse(jsonLd.textContent || '{}');
      delete data.openingHours;
      delete data.foundingDate;
      jsonLd.textContent = JSON.stringify(data);
    } catch (ignored) {}
  }

  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'OTTO Plumbing Inc. — Residential & Commercial Plumbing in South Florida');

  try {
    if (typeof translations !== 'undefined') {
      translations.en.brandSub = 'South Florida plumbing · 30+ years';
      translations.es.brandSub = 'Plomería en el sur de Florida · Más de 30 años';
      if (typeof setLang === 'function') setLang(document.documentElement.lang === 'es' ? 'es' : 'en');
    }
  } catch (ignored) {}
})();
