/* OTTO Plumbing Inc. - interaction shell.
 *
 * Scope: how a visitor moves through the page. Mobile menu drawer, section
 * in-page jumps that land below the sticky header,
 * clearly labelled return controls, current-section marking, and keyboard and
 * focus handling.
 *
 * Notes for anyone editing this file:
 * - The page's own script rewrites textContent for every [data-i18n] element,
 *   so nothing added here uses that attribute. This file uses data-shell-copy
 *   and re-renders itself when the visitor switches language.
 * - Everything is added by script, so if this file fails to load the page is
 *   exactly the plain page it was before. No content depends on it.
 * - Styling hooks that already exist (.call-btn, .wrap, .section-card) are
 *   reused rather than replaced.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var header = doc.querySelector('.nav');
  var navLinksWrap = doc.querySelector('.nav-links');
  var navActions = doc.querySelector('.nav-actions');
  var brand = doc.querySelector('.brand');
  if (!header || !navLinksWrap || !navActions) return;

  var COPY = {
    en: {
      menu: 'Menu',
      menuAria: 'Open the site menu',
      panelTitle: 'Site menu',
      close: 'Close menu',
      sections: 'Sections',
      home: 'Top of page',
      call: 'Call (786) 344-2837',
      text: 'Text (786) 344-2837',
      back: 'Back to where you were',
      dismiss: 'Dismiss',
      top: 'Back to top',
      footTop: 'Back to top of page'
    },
    es: {
      menu: 'Menú',
      menuAria: 'Abrir el menú del sitio',
      panelTitle: 'Menú del sitio',
      close: 'Cerrar menú',
      sections: 'Secciones',
      home: 'Inicio de la página',
      call: 'Llamar al (786) 344-2837',
      text: 'Escribir al (786) 344-2837',
      back: 'Volver a donde estaba',
      dismiss: 'Descartar',
      top: 'Volver arriba',
      footTop: 'Volver al inicio de la página'
    }
  };

  var SPEED = 240;

  function lang() {
    return root.getAttribute('lang') === 'es' ? 'es' : 'en';
  }
  function t(key) {
    var dict = COPY[lang()] || COPY.en;
    return dict[key] || COPY.en[key] || '';
  }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function headerHeight() {
    return header.offsetHeight || 76;
  }
  function targetOffset(el) {
    var y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 14;
    return y < 0 ? 0 : Math.round(y);
  }
  function scrollToY(y) {
    if (reduced() || !('scrollBehavior' in root.style)) window.scrollTo(0, y);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }
  function focusables(scope) {
    return [].slice
      .call(scope.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'))
      .filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0;
      });
  }
  function moveFocusTo(el) {
    if (!el) return;
    var had = el.hasAttribute('tabindex');
    if (!had) el.setAttribute('tabindex', '-1');
    try {
      el.focus({ preventScroll: true });
    } catch (err) {
      el.focus();
    }
    if (!had) {
      el.addEventListener(
        'blur',
        function () {
          el.removeAttribute('tabindex');
        },
        { once: true }
      );
    }
  }

  /* ---------------------------------------------------------------- drawer */

  var menuBtn = doc.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className = 'shell-menu-btn';
  menuBtn.id = 'shellMenuBtn';
  menuBtn.setAttribute('aria-controls', 'shellDrawer');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.innerHTML =
    '<span class="shell-bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span data-shell-copy="menu">Menu</span>';
  navActions.insertBefore(menuBtn, navActions.firstChild);

  var drawer = doc.createElement('div');
  drawer.className = 'shell-drawer';
  drawer.id = 'shellDrawer';
  drawer.hidden = true;
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'shellPanelTitle');
  drawer.innerHTML =
    '<div class="shell-scrim" data-shell-close="1"></div>' +
    '<div class="shell-panel">' +
    '<div class="shell-panel-head">' +
    '<p class="shell-panel-title" id="shellPanelTitle" data-shell-copy="panelTitle">Site menu</p>' +
    '<button type="button" class="shell-close" data-shell-close="1">' +
    '<span aria-hidden="true">\u2715</span><span data-shell-copy="close">Close menu</span>' +
    '</button>' +
    '</div>' +
    '<div class="shell-panel-body">' +
    '<p class="shell-kicker" data-shell-copy="sections">Sections</p>' +
    '<nav class="shell-panel-nav" id="shellPanelNav" aria-label="Sections"></nav>' +
    '<div class="shell-panel-actions">' +
    '<a class="call-btn" href="tel:+17863442837" data-shell-copy="call">Call (786) 344-2837</a>' +
    '<a class="call-btn shell-alt-btn" href="sms:+17863442837" data-shell-copy="text">Text (786) 344-2837</a>' +
    '</div>' +
    '</div>' +
    '</div>';
  doc.body.appendChild(drawer);

  var panel = drawer.querySelector('.shell-panel');
  var panelNav = drawer.querySelector('#shellPanelNav');
  var pageLinks = [].slice.call(navLinksWrap.querySelectorAll('a[href^="#"]'));

  function buildPanelLinks() {
    panelNav.innerHTML = '';
    var items = [{ href: '#top', copy: 'home' }];
    pageLinks.forEach(function (a) {
      items.push({ href: a.getAttribute('href'), source: a });
    });
    items.forEach(function (item) {
      var a = doc.createElement('a');
      a.className = 'shell-link';
      a.href = item.href;
      var label = doc.createElement('span');
      if (item.copy) {
        label.setAttribute('data-shell-copy', item.copy);
        label.textContent = t(item.copy);
      } else {
        label.setAttribute('data-shell-mirror', item.href);
        label.textContent = item.source.textContent.trim();
      }
      var cue = doc.createElement('span');
      cue.className = 'shell-cue';
      cue.setAttribute('aria-hidden', 'true');
      cue.textContent = '\u2192';
      a.appendChild(label);
      a.appendChild(cue);
      panelNav.appendChild(a);
    });
  }
  buildPanelLinks();

  var drawerOpen = false;
  var lastTrigger = null;

  function openDrawer() {
    if (drawerOpen) return;
    lastTrigger = doc.activeElement;
    drawer.hidden = false;
    root.classList.add('shell-lock');
    drawerOpen = true;
    menuBtn.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(function () {
      drawer.classList.add('is-open');
    });
    moveFocusTo(drawer.querySelector('.shell-close'));
  }

  function closeDrawer(returnFocus) {
    if (!drawerOpen) return;
    drawerOpen = false;
    drawer.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    root.classList.remove('shell-lock');
    var finish = function () {
      if (!drawerOpen) drawer.hidden = true;
    };
    if (reduced()) finish();
    else window.setTimeout(finish, SPEED);
    if (returnFocus !== false) {
      var back = lastTrigger && lastTrigger.isConnected ? lastTrigger : menuBtn;
      moveFocusTo(back);
    }
  }

  menuBtn.addEventListener('click', function () {
    if (drawerOpen) closeDrawer();
    else openDrawer();
  });

  drawer.addEventListener('click', function (event) {
    var el = event.target;
    while (el && el !== drawer) {
      if (el.getAttribute && el.getAttribute('data-shell-close')) {
        closeDrawer();
        return;
      }
      el = el.parentNode;
    }
  });

  drawer.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var list = focusables(panel);
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------ return controls */

  var dock = doc.createElement('div');
  dock.className = 'shell-dock';
  dock.id = 'shellDock';
  dock.innerHTML =
    '<div class="shell-return" id="shellReturn" role="group" aria-label="Return">' +
    '<button type="button" class="shell-return-go" id="shellReturnGo">' +
    '<span aria-hidden="true">\u2190</span><span data-shell-copy="back">Back to where you were</span>' +
    '</button>' +
    '<button type="button" class="shell-return-dismiss" id="shellReturnDismiss" data-shell-copy="dismiss">Dismiss</button>' +
    '</div>' +
    '<div class="shell-callbar" id="shellCallBar">' +
    '<a class="call-btn" href="tel:+17863442837" data-shell-copy="call">Call (786) 344-2837</a>' +
    '<a class="call-btn shell-alt-btn" href="sms:+17863442837" data-shell-copy="text">Text (786) 344-2837</a>' +
    '</div>' +
    '<button type="button" class="shell-top" id="shellTop">' +
    '<span aria-hidden="true">\u2191</span><span data-shell-copy="top">Back to top</span>' +
    '</button>';
  doc.body.appendChild(dock);

  var returnBar = dock.querySelector('#shellReturn');
  var returnGo = dock.querySelector('#shellReturnGo');
  var returnDismiss = dock.querySelector('#shellReturnDismiss');
  var topBtn = dock.querySelector('#shellTop');
  var origin = null;

  function armReturn(y, trigger) {
    origin = { y: y, trigger: trigger, left: false };
    returnBar.classList.add('is-on');
  }
  function clearReturn() {
    origin = null;
    returnBar.classList.remove('is-on');
  }
  returnGo.addEventListener('click', function () {
    if (!origin) return;
    var back = origin.trigger;
    scrollToY(origin.y);
    clearReturn();
    if (back && back.isConnected) moveFocusTo(back);
  });
  returnDismiss.addEventListener('click', clearReturn);
  topBtn.addEventListener('click', function () {
    scrollToY(0);
    clearReturn();
    moveFocusTo(brand);
  });

  /* footer return link, always visible, never floating */
  var footBox = doc.querySelector('.foot-box');
  if (footBox) {
    var footLink = doc.createElement('a');
    footLink.className = 'shell-foot-top';
    footLink.href = '#top';
    footLink.innerHTML =
      '<span aria-hidden="true">\u2191</span><span data-shell-copy="footTop">Back to top of page</span>';
    footBox.appendChild(footLink);
  }

  /* --------------------------------------------------- in-page navigation */

  doc.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    var el = event.target;
    var link = null;
    while (el && el.nodeType === 1) {
      if (el.tagName === 'A') {
        link = el;
        break;
      }
      el = el.parentNode;
    }
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#' || href === '#') return;
    if (link.classList.contains('skip-link')) return;
    var target = doc.querySelector(href);
    if (!target) return;

    event.preventDefault();
    var fromY = window.pageYOffset;
    var fromDrawer = drawerOpen && drawer.contains(link);
    if (drawerOpen) closeDrawer(false);

    var toY = targetOffset(target);
    scrollToY(toY);
    var heading = target.querySelector('h1, h2') || target;
    moveFocusTo(heading);
    if (Math.abs(toY - fromY) > 200) armReturn(fromY, fromDrawer ? menuBtn : link);
    else clearReturn();
  });

  /* ------------------------------------------------- current section state */

  var watched = [];
  ['#top', '#services', '#business', '#contact'].forEach(function (hash) {
    var el = doc.querySelector(hash);
    if (el) watched.push({ hash: hash, el: el });
  });

  function markCurrent(hash) {
    [].slice.call(doc.querySelectorAll('.nav-links a[href^="#"]')).forEach(function (a) {
      var on = a.getAttribute('href') === hash;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    [].slice.call(panelNav.querySelectorAll('a')).forEach(function (a) {
      if (a.getAttribute('href') === hash) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (window.IntersectionObserver && watched.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        var best = null;
        entries.forEach(function (entry) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) best = entry;
        });
        if (!best) return;
        var match = watched.filter(function (w) {
          return w.el === best.target;
        })[0];
        if (match) markCurrent(match.hash);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01, 0.5] }
    );
    watched.forEach(function (w) {
      observer.observe(w.el);
    });
  }

  /* ----------------------------------------------------- global behaviour */

  doc.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' && event.key !== 'Esc') return;
    if (drawerOpen) {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (origin) {
      event.preventDefault();
      clearReturn();
    }
  });

  var ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var y = window.pageYOffset;
        root.classList.toggle('shell-scrolled', y > 8);
        topBtn.classList.toggle('is-on', y > window.innerHeight * 1.2);
        if (origin) {
          /* the bar only retires once the reader has actually travelled away
             and then come back near where they started */
          var gap = Math.abs(y - origin.y);
          if (!origin.left) {
            if (gap > 200) origin.left = true;
          } else if (gap < 120) {
            clearReturn();
          }
        }
      });
    },
    { passive: true }
  );

  window.addEventListener('resize', function () {
    if (drawerOpen && window.innerWidth > 980) closeDrawer(false);
  });

  /* --------------------------------------------------------- translations */

  function renderCopy() {
    [].slice.call(doc.querySelectorAll('[data-shell-copy]')).forEach(function (el) {
      el.textContent = t(el.getAttribute('data-shell-copy'));
    });
    [].slice.call(doc.querySelectorAll('[data-shell-mirror]')).forEach(function (el) {
      var source = navLinksWrap.querySelector('a[href="' + el.getAttribute('data-shell-mirror') + '"]');
      if (source) el.textContent = source.textContent.trim();
    });
    menuBtn.setAttribute('aria-label', t('menuAria'));
  }

  [].slice.call(doc.querySelectorAll('[data-lang]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.setTimeout(renderCopy, 0);
    });
  });

  renderCopy();
  root.classList.toggle('shell-scrolled', window.pageYOffset > 8);
  root.classList.add('shell-ready');
})();
