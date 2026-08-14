/* OTTO Plumbing Inc. — restrained scroll storytelling.
 * Native browser scrolling remains in control. Motion is limited to the
 * photograph and copy layers, never the full viewport/stage.
 */
(function () {
  'use strict';

  var stages = [].slice.call(document.querySelectorAll('.stage'));
  if (!stages.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var framePending = false;

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function easeOut(value) {
    var inverse = 1 - value;
    return 1 - (inverse * inverse * inverse);
  }

  function resetMotion() {
    document.documentElement.classList.remove('stage-motion');
    stages.forEach(function (stage) {
      stage.classList.remove('is-near');
      var media = stage.querySelector('.panel__media');
      var copy = stage.querySelector('.panel__copy');
      var scrim = stage.querySelector('.panel__scrim');
      if (media) media.style.removeProperty('--media-scale');
      if (copy) {
        copy.style.removeProperty('--copy-y');
        copy.style.removeProperty('--copy-opacity');
      }
      if (scrim) scrim.style.removeProperty('--scrim-opacity');
    });
  }

  function renderMotion() {
    framePending = false;
    if (reduced && reduced.matches) {
      resetMotion();
      return;
    }

    var viewportHeight = Math.max(window.innerHeight || 0, 1);
    var desktop = window.innerWidth >= 768;
    document.documentElement.classList.add('stage-motion');

    stages.forEach(function (stage, index) {
      var rect = stage.getBoundingClientRect();
      var media = stage.querySelector('.panel__media');
      var copy = stage.querySelector('.panel__copy');
      var scrim = stage.querySelector('.panel__scrim');
      if (!copy) return;

      var rawIncoming = index === 0
        ? 1
        : clamp((viewportHeight - rect.top) / (viewportHeight * (desktop ? .58 : .72)));
      var incoming = easeOut(rawIncoming);
      var outgoing = desktop ? clamp((-rect.top) / (viewportHeight * .72)) : 0;

      /* Content moves only a few pixels. It becomes readable before the stage
       * fully owns the viewport and stays nearly opaque while leaving. */
      var copyY = ((1 - incoming) * (desktop ? 18 : 12)) - (outgoing * 5);
      var copyOpacity = Math.max(.90, (.18 + (.82 * incoming)) - (.06 * outgoing));
      copy.style.setProperty('--copy-y', copyY.toFixed(2) + 'px');
      copy.style.setProperty('--copy-opacity', copyOpacity.toFixed(3));

      if (media) {
        /* A 1.2% settle is enough to add depth without looking like zoom. */
        var mediaScale = desktop ? 1.012 - (.012 * incoming) : 1;
        media.style.setProperty('--media-scale', mediaScale.toFixed(4));
      }

      if (scrim) {
        var scrimOpacity = .94 + (.06 * incoming);
        scrim.style.setProperty('--scrim-opacity', scrimOpacity.toFixed(3));
      }
    });
  }

  function requestMotion() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(renderMotion);
  }

  if (window.IntersectionObserver) {
    var nearby = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-near', entry.isIntersecting);
      });
    }, { rootMargin: '65% 0px 65% 0px' });
    stages.forEach(function (stage) { nearby.observe(stage); });
  }

  window.addEventListener('scroll', requestMotion, { passive: true });
  window.addEventListener('resize', requestMotion, { passive: true });
  window.addEventListener('pageshow', requestMotion);

  if (reduced) {
    if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', requestMotion);
    else if (typeof reduced.addListener === 'function') reduced.addListener(requestMotion);
  }

  renderMotion();
})();
