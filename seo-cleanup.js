/* OTTO Plumbing Inc. — verified public metadata only. */
(function () {
  'use strict';

  var canonicalUrl = 'https://otto-plumbing-site.vercel.app/';
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
  if (ogTitle) ogTitle.setAttribute('content', 'OTTO Plumbing Inc. — Residential & Commercial Plumbing in South Florida');
  if (ogDescription) ogDescription.setAttribute('content', 'Residential and commercial plumbing across South Florida. Established 1996. Lic. CFC1429613.');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
})();
