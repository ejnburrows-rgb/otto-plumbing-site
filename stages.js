/* OTTO Plumbing Inc. — panel photography and scroll-panel fallback.
 *
 * Real OTTO photographs are stored as compact WebP base64 assets so this
 * static site can ship them through the same repository/deployment path.
 * The hero is loaded immediately; later panels load only as they approach the
 * viewport. A single passive, animation-frame-throttled scroll update keeps
 * the panel handoff consistent across modern browsers.
 */
(function () {
  'use strict';

  var stages = [].slice.call(document.querySelectorAll('.stage'));
  if (!stages.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced && reduced.matches) return;

  /* Keep will-change scoped to stages that are actually near the viewport, so
   * the compositor is not asked to hold layers for the whole page. */
  if (window.IntersectionObserver) {
    var nearby = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-near', entry.isIntersecting);
      });
    }, { rootMargin: '80% 0px 80% 0px' });

    stages.forEach(function (stage) { nearby.observe(stage); });
  }

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function setMotion(inner, incoming, outgoing, viewportHeight) {
    var scale = .95 + (.05 * incoming) - (.08 * outgoing);
    var opacity = .65 + (.35 * incoming) - (.55 * outgoing);
    var edge = Math.max(1 - incoming, outgoing);
    inner.style.setProperty('--stage-scale', scale.toFixed(4));
    inner.style.setProperty('--stage-opacity', opacity.toFixed(4));
    inner.style.setProperty('--stage-radius', (28 * edge).toFixed(2) + 'px');
    inner.style.setProperty('--stage-shift', (-viewportHeight * .02 * outgoing).toFixed(2) + 'px');
  }

  var framePending = false;
  function renderMotion() {
    framePending = false;
    var viewportHeight = Math.max(window.innerHeight || 0, 1);
    var desktop = window.innerWidth >= 768;

    stages.forEach(function (stage, index) {
      var inner = stage.querySelector('.stage__inner');
      if (!inner) return;
      var rect = stage.getBoundingClientRect();
      var incoming;
      var outgoing;

      if (desktop) {
        incoming = index === 0 ? 1 : clamp((viewportHeight - rect.top) / viewportHeight);
        outgoing = index === stages.length - 1 ? 0 : clamp(-rect.top / viewportHeight);
      } else {
        incoming = index === 0 ? 1 : clamp((viewportHeight - rect.top) / (viewportHeight * .65));
        outgoing = index === stages.length - 1
          ? 0
          : clamp((viewportHeight * .25 - rect.bottom) / (viewportHeight * .65));
      }

      setMotion(inner, incoming, outgoing, viewportHeight);
    });
  }

  function requestMotion() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(renderMotion);
  }

  document.documentElement.classList.add('stage-motion');
  window.addEventListener('scroll', requestMotion, { passive: true });
  window.addEventListener('resize', requestMotion);
  window.addEventListener('pageshow', requestMotion);
  renderMotion();
})();
