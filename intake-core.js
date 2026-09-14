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
  var FIELD_ORDER = ['name', 'phone', 'email', 'category', 'address', 'contactPreference', 'preferredDate', 'preferredWindow', 'description'];

  var LIMITS = {
    name: 80,
    phone: 32,
    email: 120,
    category: 40,
    address: 180,
    contactPreference: 20,
    preferredDate: 16,
    preferredWindow: 30,
    description: 1200,
    answer: 220
  };

  var SERVICE_LABELS = {
    leak: 'Leak repair',
    drain: 'Drain / clog',
    fixtures: 'Toilet / faucet / fixture',
    heater: 'Water heater',
    installation: 'Plumbing installation',
    remodel: 'Remodel / construction',
    commercial: 'Commercial service',
    other: 'Other plumbing work',
    general: 'General plumbing'
  };

  var CONTACT_LABELS = {
    call: 'Phone call',
    text: 'Text message',
    email: 'Email',
    whatsapp: 'WhatsApp'
  };

  var WINDOW_LABELS = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    flexible: 'Flexible'
  };

  var ANSWER_KEYS = [
    'leakActive', 'leakWhere', 'leakShutoff',
    'drainScope', 'drainFlow',
    'fixtureType', 'fixtureNeed',
    'heaterIssue', 'heaterType',
    'installationType', 'propertyType',
    'remodelArea', 'remodelStage',
    'commercialNeed', 'commercialActive',
    'contextNote'
  ];

  var REQUIRED_ANSWERS = {
    leak: ['leakActive', 'leakWhere', 'leakShutoff'],
    drain: ['drainScope', 'drainFlow'],
    fixtures: ['fixtureType', 'fixtureNeed'],
    heater: ['heaterIssue', 'heaterType'],
    installation: ['installationType', 'propertyType'],
    remodel: ['remodelArea', 'remodelStage'],
    commercial: ['commercialNeed', 'commercialActive'],
    other: ['contextNote'],
    general: ['contextNote']
  };

  var ANSWER_LABELS = {
    leakActive: {
      label: 'Active leak now',
      values: { yes: 'Yes', no: 'No', notSure: 'Not sure' }
    },
    leakWhere: {
      label: 'Leak location',
      values: { sink: 'Sink / cabinet', toilet: 'Toilet', wallCeiling: 'Wall / ceiling', waterHeater: 'Water heater', outside: 'Outside', other: 'Other' }
    },
    leakShutoff: {
      label: 'Water can be shut off',
      values: { yes: 'Yes', no: 'No', notSure: 'Not sure' }
    },
    drainScope: {
      label: 'Affected fixtures',
      values: { one: 'One fixture', multiple: 'Multiple fixtures' }
    },
    drainFlow: {
      label: 'Drain condition',
      values: { blocked: 'Fully blocked', slow: 'Slow' }
    },
    fixtureType: {
      label: 'Fixture',
      values: { toilet: 'Toilet', faucet: 'Faucet', sink: 'Sink', shower: 'Shower / tub', other: 'Other' }
    },
    fixtureNeed: {
      label: 'Fixture need',
      values: { repair: 'Repair', replaceInstall: 'Replace / install', other: 'Other' }
    },
    heaterIssue: {
      label: 'Water heater need',
      values: { noHotWater: 'No hot water', leaking: 'Leaking', replaceInstall: 'Replace / install', other: 'Other' }
    },
    heaterType: {
      label: 'Water heater type',
      values: { tank: 'Tank', tankless: 'Tankless', notSure: 'Not sure' }
    },
    installationType: {
      label: 'Installation',
      values: { fixture: 'Fixture', waterHeater: 'Water heater', piping: 'Piping / plumbing lines', other: 'Other' }
    },
    propertyType: {
      label: 'Property',
      values: { residential: 'Residential', commercial: 'Commercial' }
    },
    remodelArea: {
      label: 'Remodel area',
      values: { kitchen: 'Kitchen', bath: 'Bathroom', multiple: 'Multiple areas', other: 'Other' }
    },
    remodelStage: {
      label: 'Project stage',
      values: { planning: 'Planning', inProgress: 'In progress', ready: 'Ready for plumbing' }
    },
    commercialNeed: {
      label: 'Commercial need',
      values: { leak: 'Leak', drain: 'Drain / clog', fixture: 'Fixture', heater: 'Water heater', installation: 'Installation', other: 'Other' }
    },
    commercialActive: {
      label: 'Issue active now',
      values: { yes: 'Yes', no: 'No' }
    },
    contextNote: {
      label: 'Need',
      values: {}
    }
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

  function windowLabel(key) {
    return WINDOW_LABELS[key] || '';
  }

  function sanitizeAnswers(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    var result = {};
    for (var i = 0; i < ANSWER_KEYS.length; i += 1) {
      var key = ANSWER_KEYS[i];
      var value = clean(raw[key], LIMITS.answer);
      if (value) result[key] = value;
    }
    return result;
  }

  function requiredAnswerKeys(category) {
    var keys = REQUIRED_ANSWERS[category] || [];
    return keys.slice();
  }

  function sanitize(raw) {
    raw = raw || {};
    var category = clean(raw.category || raw.service, LIMITS.category).toLowerCase();
    var address = clean(raw.address || raw.location, LIMITS.address);
    var description = cleanMultiline(raw.description !== undefined ? raw.description : raw.details, LIMITS.description);
    var preferredWindow = clean(raw.preferredWindow, LIMITS.preferredWindow);
    if (preferredWindow && !WINDOW_LABELS[preferredWindow]) preferredWindow = '';
    return {
      name: clean(raw.name, LIMITS.name),
      phone: clean(raw.phone, LIMITS.phone),
      email: clean(raw.email, LIMITS.email).toLowerCase(),
      category: category,
      address: address,
      contactPreference: clean(raw.contactPreference, LIMITS.contactPreference).toLowerCase(),
      preferredDate: clean(raw.preferredDate, LIMITS.preferredDate),
      preferredWindow: preferredWindow,
      description: description,
      answers: sanitizeAnswers(raw.answers)
    };
  }

  function validate(raw) {
    var values = sanitize(raw);
    var errors = {};

    if (values.name.length < 2) errors.name = 'required';

    if (!values.phone) errors.phone = 'required';
    else if (!isValidPhone(values.phone)) errors.phone = 'phone';

    if (values.email && !isValidEmail(values.email)) errors.email = 'email';

    if (!values.category) errors.category = 'required';
    else if (!SERVICE_LABELS[values.category]) errors.category = 'service';

    if (values.address.length < 3) errors.address = 'required';

    if (values.contactPreference && !CONTACT_LABELS[values.contactPreference]) {
      values.contactPreference = '';
    }

    if (values.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.preferredDate)) {
      errors.preferredDate = 'date';
    }

    var required = requiredAnswerKeys(values.category);
    for (var r = 0; r < required.length; r += 1) {
      if (!values.answers[required[r]]) {
        errors.answers = 'answers';
        break;
      }
    }

    var invalid = [];
    for (var i = 0; i < FIELD_ORDER.length; i += 1) {
      if (errors[FIELD_ORDER[i]]) invalid.push(FIELD_ORDER[i]);
    }
    if (errors.answers) invalid.push('answers');

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
    var text = String(values.description || '') + ' ' + String((values.answers && values.answers.contextNote) || '');
    var links = text.match(/https?:\/\/|www\./gi);
    if (links && links.length >= 2) return 'links';
    return null;
  }

  function answerSummary(category, answers) {
    var cleanAnswers = sanitizeAnswers(answers);
    var keys = requiredAnswerKeys(category);
    if (cleanAnswers.contextNote && keys.indexOf('contextNote') === -1) keys.push('contextNote');
    var parts = [];
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var value = cleanAnswers[key];
      if (!value) continue;
      var config = ANSWER_LABELS[key] || { label: key, values: {} };
      var readable = config.values[value] || value;
      parts.push(config.label + ': ' + readable);
    }
    return parts.join(' · ');
  }

  function fingerprint(values) {
    var v = sanitize(values || {});
    var answerParts = [];
    for (var i = 0; i < ANSWER_KEYS.length; i += 1) {
      var key = ANSWER_KEYS[i];
      if (v.answers[key]) answerParts.push(key + '=' + v.answers[key]);
    }
    var basis = [
      v.name,
      normalizePhone(v.phone),
      v.email,
      v.category,
      v.address,
      v.contactPreference,
      v.preferredDate,
      v.preferredWindow,
      answerParts.join('&'),
      v.description
    ].join('|').toLowerCase();
    var hash = 5381;
    for (var j = 0; j < basis.length; j += 1) {
      hash = ((hash * 33) ^ basis.charCodeAt(j)) >>> 0;
    }
    return 'v2-' + hash.toString(36) + '-' + basis.length.toString(36);
  }

  function buildPayload(values, meta) {
    var v = sanitize(values);
    meta = meta || {};
    var summary = answerSummary(v.category, v.answers);
    return {
      source: 'otto-plumbing-site',
      name: v.name,
      phone: formatPhone(v.phone),
      phoneDigits: normalizePhone(v.phone),
      email: v.email,
      service: serviceLabel(v.category),
      serviceKey: v.category,
      category: v.category,
      location: v.address,
      address: v.address,
      contactPreference: contactLabel(v.contactPreference),
      answers: v.answers,
      answersSummary: summary,
      details: v.description,
      description: v.description,
      preferredDate: v.preferredDate,
      preferredWindow: windowLabel(v.preferredWindow),
      preferredWindowKey: v.preferredWindow,
      _subject: 'Website service request - ' + v.name + ' - ' + (serviceLabel(v.category) || 'Plumbing'),
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
          timing: 'Horario preferido',
          context: 'Contexto',
          details: 'Descripcion'
        }
      : {
          subject: 'Service request',
          name: 'Name',
          phone: 'Phone',
          email: 'Email',
          service: 'Service',
          location: 'Service location',
          contact: 'Preferred contact',
          timing: 'Preferred timing',
          context: 'Context',
          details: 'Description'
        };
    var subject = labels.subject + ' - ' + (v.name || labels.name) + ' - ' + (serviceLabel(v.category) || 'Plumbing');
    var lines = [labels.name + ': ' + v.name, labels.phone + ': ' + formatPhone(v.phone)];
    if (v.email) lines.push(labels.email + ': ' + v.email);
    lines.push(labels.service + ': ' + (serviceLabel(v.category) || ''));
    lines.push(labels.location + ': ' + v.address);
    if (v.contactPreference) lines.push(labels.contact + ': ' + contactLabel(v.contactPreference));
    var timing = [v.preferredDate, windowLabel(v.preferredWindow)].filter(Boolean).join(' · ');
    if (timing) lines.push(labels.timing + ': ' + timing);
    var context = answerSummary(v.category, v.answers);
    if (context) lines.push(labels.context + ': ' + context);
    if (v.description) {
      lines.push('');
      lines.push(labels.details + ':');
      lines.push(v.description);
    }
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
    WINDOW_LABELS: WINDOW_LABELS,
    ANSWER_KEYS: ANSWER_KEYS,
    REQUIRED_ANSWERS: REQUIRED_ANSWERS,
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
    windowLabel: windowLabel,
    sanitizeAnswers: sanitizeAnswers,
    requiredAnswerKeys: requiredAnswerKeys,
    answerSummary: answerSummary,
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
