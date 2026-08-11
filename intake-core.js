/* OTTO Plumbing Inc. - customer intake core.
 *
 * Pure logic only: no DOM access, no implicit network calls, no secrets.
 * The browser wiring lives in intake.js and the delivery endpoint lives in
 * intake-config.js. This file is also loaded directly by the regression test
 * in tests/intake-core.test.mjs, so it must stay dependency-free.
 */
(function (root) {
  'use strict';

  var PHONE_DISPLAY = '(786) 344-2837';
  var PHONE_E164 = '+17863442837';
  var MIN_FILL_MS = 2500;
  var DUPLICATE_WINDOW_MS = 120000;
  var FIELD_ORDER = ['name', 'phone', 'email', 'service', 'location', 'contactPreference', 'details'];

  var LIMITS = {
    name: 80,
    phone: 32,
    email: 120,
    service: 40,
    location: 140,
    contactPreference: 20,
    details: 1200
  };

  var SERVICE_LABELS = {
    leak: 'Leak repair',
    drain: 'Drain and sewer',
    heater: 'Water heaters',
    general: 'General plumbing',
    fixtures: 'Fixture updates',
    remodel: 'Remodel support',
    other: 'Other plumbing work'
  };

  var CONTACT_LABELS = {
    call: 'Phone call',
    text: 'Text message',
    email: 'Email'
  };

  function stripControl(value) {
    return String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ');
  }

  function clean(value, max) {
    if (value === null || value === undefined) return '';
    var text = stripControl(value).replace(/[\r\n\t]/g, ' ').replace(/\s{2,}/g, ' ').trim();
    if (max && text.length > max) text = text.slice(0, max).trim();
    return text;
  }

  function cleanMultiline(value, max) {
    if (value === null || value === undefined) return '';
    var text = stripControl(value).replace(/\r\n?/g, '\n');
    text = text.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if (max && text.length > max) text = text.slice(0, max).trim();
    return text;
  }

  function digits(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\D/g, '');
  }

  function normalizePhone(value) {
    var d = digits(value);
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d;
  }

  function isValidPhone(value) {
    var d = normalizePhone(value);
    if (d.length !== 10) return false;
    if (/^(\d)\1{9}$/.test(d)) return false;
    if (d.charAt(0) === '0' || d.charAt(0) === '1') return false;
    if (d.charAt(3) === '1' && d.charAt(4) === '1') return false;
    return true;
  }

  function formatPhone(value) {
    var d = normalizePhone(value);
    if (d.length !== 10) return clean(value, LIMITS.phone);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function isValidEmail(value) {
    var text = clean(value, LIMITS.email + 1);
    if (!text || text.length > LIMITS.email) return false;
    if (text.indexOf('..') !== -1) return false;
    if (text.indexOf(',') !== -1 || text.indexOf(';') !== -1) return false;
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(text);
  }

  function serviceLabel(key) {
    return SERVICE_LABELS[key] || '';
  }

  function contactLabel(key) {
    return CONTACT_LABELS[key] || '';
  }

  function sanitize(raw) {
    raw = raw || {};
    return {
      name: clean(raw.name, LIMITS.name),
      phone: clean(raw.phone, LIMITS.phone),
      email: clean(raw.email, LIMITS.email).toLowerCase(),
      service: clean(raw.service, LIMITS.service).toLowerCase(),
      location: clean(raw.location, LIMITS.location),
      contactPreference: clean(raw.contactPreference, LIMITS.contactPreference).toLowerCase(),
      details: cleanMultiline(raw.details, LIMITS.details)
    };
  }

  function validate(raw) {
    var values = sanitize(raw);
    var errors = {};

    if (values.name.length < 2) errors.name = 'required';

    if (!values.phone) errors.phone = 'required';
    else if (!isValidPhone(values.phone)) errors.phone = 'phone';

    if (values.email && !isValidEmail(values.email)) errors.email = 'email';

    if (!values.service) errors.service = 'required';
    else if (!SERVICE_LABELS[values.service]) errors.service = 'service';

    if (values.contactPreference && !CONTACT_LABELS[values.contactPreference]) {
      values.contactPreference = '';
    }

    if (!values.details) errors.details = 'required';
    else if (values.details.length < 10) errors.details = 'details';

    var invalid = [];
    for (var i = 0; i < FIELD_ORDER.length; i += 1) {
      if (errors[FIELD_ORDER[i]]) invalid.push(FIELD_ORDER[i]);
    }

    return {
      valid: invalid.length === 0,
      errors: errors,
      invalidFields: invalid,
      values: values
    };
  }

  function checkSpam(input) {
    input = input || {};
    var values = input.values || {};
    if (clean(input.honeypot, 200)) return 'honeypot';
    if (typeof input.elapsedMs === 'number' && input.elapsedMs >= 0 && input.elapsedMs < MIN_FILL_MS) {
      return 'tooFast';
    }
    var links = String(values.details || '').match(/https?:\/\/|www\./gi);
    if (links && links.length >= 2) return 'links';
    return null;
  }

  function fingerprint(values) {
    var v = values || {};
    var basis = [
      clean(v.name, LIMITS.name),
      normalizePhone(v.phone),
      clean(v.email, LIMITS.email),
      clean(v.service, LIMITS.service),
      clean(v.location, LIMITS.location),
      clean(v.contactPreference, LIMITS.contactPreference),
      cleanMultiline(v.details, LIMITS.details)
    ].join('|').toLowerCase();
    var hash = 5381;
    for (var i = 0; i < basis.length; i += 1) {
      hash = ((hash * 33) ^ basis.charCodeAt(i)) >>> 0;
    }
    return 'v1-' + hash.toString(36) + '-' + basis.length.toString(36);
  }

  function buildPayload(values, meta) {
    var v = sanitize(values);
    meta = meta || {};
    return {
      name: v.name,
      phone: formatPhone(v.phone),
      phoneDigits: normalizePhone(v.phone),
      email: v.email,
      service: serviceLabel(v.service),
      serviceKey: v.service,
      location: v.location,
      contactPreference: contactLabel(v.contactPreference),
      details: v.details,
      _subject: 'Website service request - ' + v.name + ' - ' + (serviceLabel(v.service) || 'Plumbing'),
      submittedAt: new Date().toISOString(),
      language: meta.language === 'es' ? 'es' : 'en',
      page: clean(meta.page, 300)
    };
  }

  function buildMailtoUrl(to, values, language) {
    var address = clean(to, LIMITS.email);
    if (!address) return '';
    var v = sanitize(values);
    var es = language === 'es';
    var labels = es
      ? {
          subject: 'Solicitud de servicio',
          name: 'Nombre',
          phone: 'Telefono',
          email: 'Correo',
          service: 'Servicio',
          location: 'Ubicacion',
          contact: 'Contacto preferido',
          details: 'Detalles'
        }
      : {
          subject: 'Service request',
          name: 'Name',
          phone: 'Phone',
          email: 'Email',
          service: 'Service',
          location: 'Location',
          contact: 'Preferred contact',
          details: 'Details'
        };
    var subject = labels.subject + ' - ' + (v.name || labels.name) + ' - ' + (serviceLabel(v.service) || 'Plumbing');
    var lines = [labels.name + ': ' + v.name, labels.phone + ': ' + formatPhone(v.phone)];
    if (v.email) lines.push(labels.email + ': ' + v.email);
    lines.push(labels.service + ': ' + (serviceLabel(v.service) || ''));
    if (v.location) lines.push(labels.location + ': ' + v.location);
    if (v.contactPreference) lines.push(labels.contact + ': ' + contactLabel(v.contactPreference));
    lines.push('');
    lines.push(labels.details + ':');
    lines.push(v.details);
    return 'mailto:' + address + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function isConfiguredEndpoint(endpoint) {
    var url = clean(endpoint, 300);
    if (!url) return false;
    if (url.indexOf('https://') !== 0) return false;
    if (/YOUR|REPLACE|EXAMPLE|PLACEHOLDER|XXXX/i.test(url)) return false;
    return true;
  }

  function failure(code, status, detail) {
    var error = new Error('intake-delivery-failed:' + code);
    error.code = code;
    error.status = typeof status === 'number' ? status : 0;
    if (detail) error.detail = String(detail).slice(0, 300);
    return error;
  }

  function messageFrom(body) {
    if (!body || typeof body !== 'object') return '';
    if (typeof body.error === 'string') return body.error;
    if (Array.isArray(body.errors) && body.errors.length) {
      var first = body.errors[0];
      if (first && typeof first.message === 'string') return first.message;
      if (typeof first === 'string') return first;
    }
    return '';
  }

  function readJson(response) {
    if (!response || typeof response.json !== 'function') return Promise.resolve(null);
    return Promise.resolve()
      .then(function () {
        return response.json();
      })
      .then(
        function (body) {
          return body;
        },
        function () {
          return null;
        }
      );
  }

  /* Resolves only when the receiving system actually accepted the request.
   * Every other outcome rejects with an error carrying a `code`, so the UI can
   * never show a success state for a failed or unconfirmed delivery. */
  function deliverIntake(options) {
    options = options || {};
    var endpoint = options.endpoint;
    var payload = options.payload;
    var fetchImpl = options.fetchImpl;
    var timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 15000;

    if (!isConfiguredEndpoint(endpoint)) return Promise.reject(failure('notConfigured'));
    if (typeof fetchImpl !== 'function') return Promise.reject(failure('unsupported'));

    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = null;
    var timedOut = false;

    var request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    };
    if (controller) request.signal = controller.signal;

    var attempt;
    try {
      attempt = Promise.resolve(fetchImpl(endpoint, request));
    } catch (thrown) {
      return Promise.reject(failure('network', 0, thrown && thrown.message));
    }

    var accepted = attempt.then(
      function (response) {
        var status = response && typeof response.status === 'number' ? response.status : 0;
        var ok = !!(response && response.ok);
        return readJson(response).then(function (body) {
          if (!ok) {
            throw failure(status >= 500 || status === 0 ? 'server' : 'rejected', status, messageFrom(body));
          }
          if (body && typeof body === 'object' && (body.ok === false || messageFrom(body))) {
            throw failure('rejected', status, messageFrom(body));
          }
          return { ok: true, status: status, body: body };
        });
      },
      function (thrown) {
        if (timedOut) throw failure('timeout');
        if (thrown && thrown.code) throw thrown;
        throw failure('network', 0, thrown && thrown.message);
      }
    );

    var guarded = timeoutMs > 0
      ? Promise.race([
          accepted,
          new Promise(function (resolve, reject) {
            timer = setTimeout(function () {
              timedOut = true;
              if (controller) {
                try {
                  controller.abort();
                } catch (ignored) {
                  /* aborting is best effort */
                }
              }
              reject(failure('timeout'));
            }, timeoutMs);
          })
        ])
      : accepted;

    return guarded.then(
      function (result) {
        if (timer) clearTimeout(timer);
        return result;
      },
      function (error) {
        if (timer) clearTimeout(timer);
        throw error;
      }
    );
  }

  root.OTTOIntakeCore = {
    PHONE_DISPLAY: PHONE_DISPLAY,
    PHONE_E164: PHONE_E164,
    LIMITS: LIMITS,
    FIELD_ORDER: FIELD_ORDER,
    SERVICE_LABELS: SERVICE_LABELS,
    CONTACT_LABELS: CONTACT_LABELS,
    MIN_FILL_MS: MIN_FILL_MS,
    DUPLICATE_WINDOW_MS: DUPLICATE_WINDOW_MS,
    clean: clean,
    cleanMultiline: cleanMultiline,
    digits: digits,
    normalizePhone: normalizePhone,
    formatPhone: formatPhone,
    isValidPhone: isValidPhone,
    isValidEmail: isValidEmail,
    serviceLabel: serviceLabel,
    contactLabel: contactLabel,
    sanitize: sanitize,
    validate: validate,
    checkSpam: checkSpam,
    fingerprint: fingerprint,
    buildPayload: buildPayload,
    buildMailtoUrl: buildMailtoUrl,
    isConfiguredEndpoint: isConfiguredEndpoint,
    deliverIntake: deliverIntake
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
