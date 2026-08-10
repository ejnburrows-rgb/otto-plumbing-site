/* OTTO Plumbing Inc. - customer intake form wiring.
 *
 * Behaviour rules baked in here:
 *  - the form is never cleared until the receiving system confirms delivery
 *  - a failed or unconfirmed delivery always shows an error plus the phone line
 *  - repeat clicks cannot send the same request twice
 *  - all copy exists in English and Spanish and follows the site language toggle
 */
(function () {
  'use strict';

  var core = window.OTTOIntakeCore;
  var form = document.getElementById('intakeForm');
  if (!core || !form) return;

  var config = window.OTTO_INTAKE_CONFIG || {};
  var endpoint = typeof config.endpoint === 'string' ? config.endpoint.trim() : '';
  var fallbackEmail = typeof config.fallbackEmail === 'string' ? config.fallbackEmail.trim() : '';
  var configured = core.isConfiguredEndpoint(endpoint);

  var els = {
    name: document.getElementById('intakeName'),
    phone: document.getElementById('intakePhone'),
    email: document.getElementById('intakeEmail'),
    service: document.getElementById('intakeService'),
    location: document.getElementById('intakeLocation'),
    contactPreference: document.getElementById('intakeContact'),
    details: document.getElementById('intakeDetails'),
    honeypot: document.getElementById('intakeCompany'),
    submit: document.getElementById('intakeSubmit'),
    status: document.getElementById('intakeStatus'),
    fallback: document.getElementById('intakeFallback'),
    mailto: document.getElementById('intakeMailto')
  };

  var COPY = {
    en: {
      labelName: 'Name',
      labelPhone: 'Phone',
      labelEmail: 'Email (optional)',
      labelService: 'Service needed',
      labelLocation: 'City or address (optional)',
      labelContact: 'Preferred contact (optional)',
      labelDetails: 'What is happening?',
      phName: 'First and last name',
      phPhone: '(786) 344-2837',
      phEmail: 'you@example.com',
      phLocation: 'Neighborhood, city, or street address',
      phDetails: 'Describe the problem, the fixture involved, and when it started.',
      optService: 'Choose a service',
      svcLeak: 'Leak repair',
      svcDrain: 'Drain and sewer',
      svcHeater: 'Water heaters',
      svcGeneral: 'General plumbing',
      svcFixtures: 'Fixture updates',
      svcRemodel: 'Remodel support',
      svcOther: 'Other plumbing work',
      prefNone: 'No preference',
      prefCall: 'Phone call',
      prefText: 'Text message',
      prefEmail: 'Email',
      formTitle: 'Request service online',
      formLead: 'Send the job details and the office will follow up. Nothing is reported as sent unless the receiving system confirms it. To reach OTTO Plumbing right now, call or text (786) 344-2837.',
      submitIdle: 'Send request',
      submitSending: 'Sending, please wait',
      submitEmail: 'Prepare email request',
      callInstead: 'Call (786) 344-2837',
      fallbackLabel: 'Reach the office directly',
      fallbackBody: 'Your details are still in the form. Nothing has been sent to the office yet.',
      fallbackCall: 'Call (786) 344-2837',
      fallbackText: 'Text (786) 344-2837',
      fallbackEmail: 'Open a pre-filled email',
      statusNotConfigured: 'Online sending is not switched on for this site yet. Fill in the form and it will open a pre-filled email, or call or text (786) 344-2837 for an immediate answer.',
      statusInvalid: 'Some required details are missing or look incorrect. Nothing has been sent.',
      statusSpam: 'That submission could not be checked as genuine, so it was not sent. Please call or text (786) 344-2837.',
      statusDuplicate: 'This exact request was already sent. The office has it, so there is no need to send it again.',
      statusSending: 'Sending your request...',
      statusSuccess: 'Received. The office has your request and will follow up. For anything urgent, call or text (786) 344-2837.',
      statusFailed: 'The request was NOT sent. The receiving system rejected it. Your details are still here.',
      statusNetwork: 'The request was NOT sent. The connection failed. Your details are still here.',
      statusTimeout: 'The request was NOT sent. The send timed out with no confirmation. Your details are still here.',
      statusEmailHandoff: 'Nothing has been sent yet. Use the pre-filled email below, or call or text (786) 344-2837.',
      errRequired: 'Required.',
      errPhone: 'Enter a 10-digit phone number.',
      errEmail: 'Enter a valid email address or leave this empty.',
      errService: 'Choose one of the listed services.',
      errDetails: 'Add a little more detail so the office can help.'
    },
    es: {
      labelName: 'Nombre',
      labelPhone: 'Telefono',
      labelEmail: 'Correo (opcional)',
      labelService: 'Servicio que necesita',
      labelLocation: 'Ciudad o direccion (opcional)',
      labelContact: 'Contacto preferido (opcional)',
      labelDetails: 'Que esta pasando?',
      phName: 'Nombre y apellido',
      phPhone: '(786) 344-2837',
      phEmail: 'usted@ejemplo.com',
      phLocation: 'Barrio, ciudad o direccion',
      phDetails: 'Describa el problema, el accesorio afectado y cuando comenzo.',
      optService: 'Elija un servicio',
      svcLeak: 'Reparacion de fugas',
      svcDrain: 'Drenaje y alcantarillado',
      svcHeater: 'Calentadores de agua',
      svcGeneral: 'Plomeria general',
      svcFixtures: 'Actualizacion de accesorios',
      svcRemodel: 'Apoyo para remodelacion',
      svcOther: 'Otro trabajo de plomeria',
      prefNone: 'Sin preferencia',
      prefCall: 'Llamada',
      prefText: 'Mensaje de texto',
      prefEmail: 'Correo',
      formTitle: 'Solicitar servicio en linea',
      formLead: 'Envie los detalles del trabajo y la oficina le respondera. Nada se reporta como enviado hasta que el sistema receptor lo confirme. Para atencion inmediata, llame o escriba al (786) 344-2837.',
      submitIdle: 'Enviar solicitud',
      submitSending: 'Enviando, espere',
      submitEmail: 'Preparar solicitud por correo',
      callInstead: 'Llamar al (786) 344-2837',
      fallbackLabel: 'Comuniquese directamente con la oficina',
      fallbackBody: 'Sus datos siguen en el formulario. Todavia no se ha enviado nada a la oficina.',
      fallbackCall: 'Llamar al (786) 344-2837',
      fallbackText: 'Escribir al (786) 344-2837',
      fallbackEmail: 'Abrir un correo ya completado',
      statusNotConfigured: 'El envio en linea aun no esta activado en este sitio. Complete el formulario y se abrira un correo ya escrito, o llame o escriba al (786) 344-2837 para una respuesta inmediata.',
      statusInvalid: 'Faltan datos obligatorios o hay algo incorrecto. No se ha enviado nada.',
      statusSpam: 'No se pudo verificar el envio, por lo que no se envio. Por favor llame o escriba al (786) 344-2837.',
      statusDuplicate: 'Esta misma solicitud ya se envio. La oficina la tiene, no hace falta enviarla otra vez.',
      statusSending: 'Enviando su solicitud...',
      statusSuccess: 'Recibido. La oficina tiene su solicitud y le respondera. Si es urgente, llame o escriba al (786) 344-2837.',
      statusFailed: 'La solicitud NO se envio. El sistema receptor la rechazo. Sus datos siguen aqui.',
      statusNetwork: 'La solicitud NO se envio. Fallo la conexion. Sus datos siguen aqui.',
      statusTimeout: 'La solicitud NO se envio. El envio expiro sin confirmacion. Sus datos siguen aqui.',
      statusEmailHandoff: 'Todavia no se ha enviado nada. Use el correo ya completado de abajo, o llame o escriba al (786) 344-2837.',
      errRequired: 'Obligatorio.',
      errPhone: 'Escriba un telefono de 10 digitos.',
      errEmail: 'Escriba un correo valido o dejelo vacio.',
      errService: 'Elija uno de los servicios de la lista.',
      errDetails: 'Agregue un poco mas de detalle para poder ayudarle.'
    }
  };

  var ERROR_KEYS = {
    required: 'errRequired',
    phone: 'errPhone',
    email: 'errEmail',
    service: 'errService',
    details: 'errDetails'
  };

  var startedAt = Date.now();
  var sending = false;
  var lastSent = { fingerprint: '', at: 0 };
  var status = null;
  var fieldErrors = {};

  function language() {
    var value = (document.documentElement.lang || 'en').toLowerCase();
    return value.indexOf('es') === 0 ? 'es' : 'en';
  }

  function t(key) {
    var dict = COPY[language()] || COPY.en;
    return dict[key] || COPY.en[key] || '';
  }

  function readValues() {
    return {
      name: els.name ? els.name.value : '',
      phone: els.phone ? els.phone.value : '',
      email: els.email ? els.email.value : '',
      service: els.service ? els.service.value : '',
      location: els.location ? els.location.value : '',
      contactPreference: els.contactPreference ? els.contactPreference.value : '',
      details: els.details ? els.details.value : ''
    };
  }

  function submitLabel() {
    if (sending) return t('submitSending');
    return configured ? t('submitIdle') : t('submitEmail');
  }

  function renderCopy() {
    var nodes = form.parentNode.querySelectorAll('[data-otto-i18n]');
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute('data-otto-i18n');
      var text = t(key);
      if (text) nodes[i].textContent = text;
    }
    var placeholders = form.querySelectorAll('[data-otto-i18n-ph]');
    for (var j = 0; j < placeholders.length; j += 1) {
      var phKey = placeholders[j].getAttribute('data-otto-i18n-ph');
      var phText = t(phKey);
      if (phText) placeholders[j].setAttribute('placeholder', phText);
    }
    if (els.submit) els.submit.textContent = submitLabel();
    renderErrors();
    renderStatus();
  }

  function renderStatus() {
    if (!els.status) return;
    els.status.classList.remove('is-error', 'is-ok');
    if (!status) {
      els.status.textContent = '';
      return;
    }
    els.status.textContent = t(status.key);
    if (status.tone === 'error') els.status.classList.add('is-error');
    if (status.tone === 'ok') els.status.classList.add('is-ok');
  }

  function setStatus(key, tone) {
    status = key ? { key: key, tone: tone || null } : null;
    renderStatus();
  }

  function renderErrors() {
    var slots = form.querySelectorAll('[data-otto-error-for]');
    for (var i = 0; i < slots.length; i += 1) {
      var field = slots[i].getAttribute('data-otto-error-for');
      var code = fieldErrors[field];
      slots[i].textContent = code ? t(ERROR_KEYS[code] || 'errRequired') : '';
      if (els[field]) {
        if (code) els[field].setAttribute('aria-invalid', 'true');
        else els[field].removeAttribute('aria-invalid');
      }
    }
  }

  function setErrors(errors) {
    fieldErrors = errors || {};
    renderErrors();
  }

  function showFallback(on, values) {
    if (!els.fallback) return;
    if (on && els.mailto) {
      var href = fallbackEmail ? core.buildMailtoUrl(fallbackEmail, values || readValues(), language()) : '';
      if (href) {
        els.mailto.setAttribute('href', href);
        els.mailto.hidden = false;
      } else {
        els.mailto.hidden = true;
      }
    }
    if (on) els.fallback.classList.add('is-on');
    else els.fallback.classList.remove('is-on');
  }

  function setBusy(on) {
    sending = on;
    if (els.submit) {
      els.submit.disabled = on;
      els.submit.textContent = submitLabel();
    }
    if (on) form.setAttribute('aria-busy', 'true');
    else form.removeAttribute('aria-busy');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sending) return;

    var result = core.validate(readValues());
    setErrors(result.errors);

    if (!result.valid) {
      setStatus('statusInvalid', 'error');
      showFallback(false);
      var first = result.invalidFields[0];
      if (first && els[first] && typeof els[first].focus === 'function') els[first].focus();
      return;
    }

    var spam = core.checkSpam({
      values: result.values,
      honeypot: els.honeypot ? els.honeypot.value : '',
      elapsedMs: Date.now() - startedAt
    });
    if (spam) {
      setStatus('statusSpam', 'error');
      showFallback(true, result.values);
      return;
    }

    var stamp = core.fingerprint(result.values);
    if (stamp === lastSent.fingerprint && Date.now() - lastSent.at < core.DUPLICATE_WINDOW_MS) {
      setStatus('statusDuplicate', 'ok');
      showFallback(false);
      return;
    }

    if (!configured) {
      setStatus('statusEmailHandoff', 'error');
      showFallback(true, result.values);
      if (els.mailto && !els.mailto.hidden && typeof els.mailto.focus === 'function') els.mailto.focus();
      return;
    }

    setBusy(true);
    setStatus('statusSending', null);
    showFallback(false);

    core
      .deliverIntake({
        endpoint: endpoint,
        payload: core.buildPayload(result.values, {
          language: language(),
          page: window.location ? window.location.href : ''
        }),
        fetchImpl: typeof window.fetch === 'function' ? window.fetch.bind(window) : null,
        timeoutMs: typeof config.timeoutMs === 'number' ? config.timeoutMs : 15000
      })
      .then(function () {
        lastSent = { fingerprint: stamp, at: Date.now() };
        setStatus('statusSuccess', 'ok');
        showFallback(false);
        form.reset();
        setErrors({});
        startedAt = Date.now();
      })
      .catch(function (error) {
        var code = error && error.code ? error.code : 'unexpected';
        var key = 'statusFailed';
        if (code === 'network' || code === 'unsupported') key = 'statusNetwork';
        if (code === 'timeout') key = 'statusTimeout';
        if (code === 'notConfigured') key = 'statusEmailHandoff';
        setStatus(key, 'error');
        showFallback(true, result.values);
      })
      .then(function () {
        setBusy(false);
      });
  });

  var langButtons = document.querySelectorAll('[data-lang]');
  for (var b = 0; b < langButtons.length; b += 1) {
    langButtons[b].addEventListener('click', function () {
      window.setTimeout(renderCopy, 0);
    });
  }

  renderCopy();
  if (!configured) setStatus('statusNotConfigured', null);
})();
