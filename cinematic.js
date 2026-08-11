/* OTTO Plumbing Inc. — restrained stacked-page scroll motion. */
(function () {
  'use strict';

  var motion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia && window.matchMedia('(min-width: 901px)');
  var selectors = ['#top', '#services', '#business'];
  var panels = selectors.map(function (selector) {
    return document.querySelector(selector);
  }).filter(Boolean);
  var ticking = false;
  var positions = [];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function enabled() {
    return (!motion || !motion.matches) && (!desktop || desktop.matches);
  }

  function measure() {
    positions = panels.map(function (panel) {
      var rect = panel.getBoundingClientRect();
      return rect.top + window.pageYOffset;
    });
  }

  function clearMotion() {
    panels.forEach(function (panel) {
      var wrap = panel.querySelector(':scope > .wrap');
      panel.classList.remove('is-receding');
      panel.style.removeProperty('--panel-enter');
      panel.style.removeProperty('--panel-exit');
      if (!wrap) return;
      wrap.style.removeProperty('transform');
      wrap.style.removeProperty('opacity');
      wrap.style.removeProperty('filter');
    });
  }

  function render() {
    ticking = false;
    if (!enabled()) {
      clearMotion();
      return;
    }

    var y = window.pageYOffset;
    var viewport = window.innerHeight || 800;

    panels.forEach(function (panel, index) {
      var wrap = panel.querySelector(':scope > .wrap');
      if (!wrap) return;

      var top = positions[index] || 0;
      var nextTop = index + 1 < positions.length ? positions[index + 1] : Number.POSITIVE_INFINITY;
      var enter = clamp((y + viewport - top) / (viewport * .7), 0, 1);
      var exit = Number.isFinite(nextTop)
        ? clamp((y - (nextTop - viewport * .74)) / (viewport * .56), 0, 1)
        : 0;
      var scale = .935 + (enter * .065) - (exit * .055);
      var rise = (1 - enter) * 54;
      var opacity = .72 + (enter * .28) - (exit * .13);

      panel.style.setProperty('--panel-enter', enter.toFixed(3));
      panel.style.setProperty('--panel-exit', exit.toFixed(3));
      panel.classList.toggle('is-receding', exit > .02);
      wrap.style.transform = 'translate3d(0,' + rise.toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')';
      wrap.style.opacity = opacity.toFixed(3);
    });
  }

  function requestRender() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(render);
  }

  panels.forEach(function (panel, index) {
    panel.classList.add('cinematic-panel');
    panel.style.setProperty('--panel-layer', String(index + 2));
  });

  measure();
  render();
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', function () {
    clearMotion();
    window.requestAnimationFrame(function () {
      measure();
      render();
    });
  });
  window.addEventListener('load', function () {
    measure();
    render();
  }, { once: true });
})();
