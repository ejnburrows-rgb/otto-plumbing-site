/* OTTO Plumbing Inc. — scroll-panel fallback.
 *
 * Browsers with scroll-driven animations (animation-timeline) drive the panel
 * handoff entirely in CSS and this file does nothing but manage will-change.
 *
 * Everywhere else, an IntersectionObserver toggles `.is-receding` and CSS
 * transitions do the work. There is deliberately no scroll listener, so
 * nothing runs on the main thread per frame.
 */
(function () {
  'use strict';

  var doc = document;
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
