/* OTTO Plumbing Inc. — panel photography and scroll-panel fallback.
 *
 * Real OTTO photographs are stored as compact WebP base64 assets so this
 * static site can ship them through the same repository/deployment path.
 * The hero is loaded immediately; later panels load only as they approach the
 * viewport. Scroll motion remains CSS-first with an IntersectionObserver
 * fallback and no scroll listener.
 */
(function () {
  'use strict';

  var doc = document;
  var photoMap = [
    {
      selector: '#top .panel__media img',
      file: 'img/closing.webp.b64',
      alt: 'OTTO Plumbing technician working in a marble bathroom.'
    },
    {
      selector: '#services .panel__media img',
      file: 'img/services.webp.b64',
      alt: 'Gloved OTTO Plumbing technician using wrenches on a brass plumbing fixture.'
    },
    {
      selector: '#business .panel__media img',
      file: 'img/contact.webp.b64',
      alt: 'OTTO Plumbing technician servicing a brass tub fixture.'
    },
    {
      selector: '#contact .panel__media img',
      file: 'img/contact.webp.b64',
      alt: 'OTTO Plumbing technician servicing a brass tub fixture.'
    },
    {
      selector: '#closing .panel__media img',
      file: 'img/closing.webp.b64',
      alt: 'OTTO Plumbing technician working in a marble bathroom.'
    }
  ];

  function webpObjectUrl(base64) {
    var clean = base64.replace(/\s+/g, '');
    var binary = window.atob(clean);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
  }

  function loadPhoto(photo) {
    var img = doc.querySelector(photo.selector);
    if (!img || img.getAttribute('data-otto-photo')) return;
    img.setAttribute('data-otto-photo', 'loading');

    fetch(photo.file, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Photo request failed');
        return response.text();
      })
      .then(function (base64) {
        var objectUrl = webpObjectUrl(base64);
        img.alt = photo.alt;
        img.removeAttribute('aria-hidden');
        img.addEventListener('load', function () {
          URL.revokeObjectURL(objectUrl);
        }, { once: true });
        img.src = objectUrl;
        img.setAttribute('data-otto-photo', 'loaded');
      })
      .catch(function () {
        img.removeAttribute('data-otto-photo');
      });
  }

  if (photoMap.length) loadPhoto(photoMap[0]);

  if (window.IntersectionObserver) {
    var photoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = Number(entry.target.getAttribute('data-otto-photo-index'));
        if (!Number.isNaN(index) && photoMap[index]) loadPhoto(photoMap[index]);
        photoObserver.unobserve(entry.target);
      });
    }, { rootMargin: '100% 0px 100% 0px' });

    photoMap.slice(1).forEach(function (photo, offset) {
      var img = doc.querySelector(photo.selector);
      if (!img) return;
      img.setAttribute('data-otto-photo-index', String(offset + 1));
      photoObserver.observe(img);
    });
  } else {
    photoMap.slice(1).forEach(loadPhoto);
  }

  var stages = [].slice.call(doc.querySelectorAll('.stage'));
  if (!stages.length || !window.IntersectionObserver) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced && reduced.matches) return;

  var supportsTimeline = false;
  try {
    supportsTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');
  } catch (ignored) {
    supportsTimeline = false;
  }

  /* Keep will-change scoped to stages that are actually near the viewport, so
   * the compositor is not asked to hold layers for the whole page. */
  var nearby = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-near', entry.isIntersecting);
    });
  }, { rootMargin: '80% 0px 80% 0px' });

  stages.forEach(function (stage) { nearby.observe(stage); });

  if (supportsTimeline) return;

  /* Fallback handoff: a stage recedes once its own scroll range is mostly
   * spent, which is the same moment the next panel has covered the screen. */
  var recede = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var stage = entry.target;
      if (stage === stages[stages.length - 1]) return;
      var rect = entry.boundingClientRect;
      var past = rect.top <= 0 && rect.bottom <= window.innerHeight * 1.15;
      stage.classList.toggle('is-receding', past);
    });
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  stages.forEach(function (stage) { recede.observe(stage); });

  /* A stage that is scrolled past entirely while the observer is throttled can
   * be left mid-state; settle it when the tab regains focus. */
  window.addEventListener('pageshow', function () {
    stages.forEach(function (stage) {
      var rect = stage.getBoundingClientRect();
      if (stage === stages[stages.length - 1]) return;
      stage.classList.toggle('is-receding', rect.top <= 0 && rect.bottom <= window.innerHeight * 1.15);
    });
  });
})();
