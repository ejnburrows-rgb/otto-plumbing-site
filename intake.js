/* OTTO Plumbing Inc. - guided customer intake form wiring.
 *
 * The experience is deterministic and zero-cost: category -> short context ->
 * customer details -> optional timing/description -> review -> confirmed send.
 * A success state appears only after the receiving system confirms the request.
 */
(function () {
  'use strict';

  var core = window.OTTOIntakeCore;
  var form = document.getElementById('intakeForm');
  if (!core || !form) return;

  var config = window.OTTO_INTAKE_CONFIG || {};
  var endpoint = typeof config.endpoint === 'string' ? config.endpoint.trim() : '';
  var fallbackEmail = typeof config.fallbackEmail === 'string' ? config.fallbackEmail.trim() : '';
  var whatsappNumber = String(config.whatsappNumber || '').replace(/\D/g, '');
  var configured = core.isConfiguredEndpoint(endpoint);

  var CATEGORIES = ['leak', 'drain', 'fixtures', 'heater', 'installation', 'remodel', 'commercial', 'other'];
  var QUESTION_SETS = {
    leak: [
      { key: 'leakActive', type: 'radio', options: ['yes', 'no', 'notSure'] },
      { key: 'leakWhere', type: 'select', options: ['sink', 'toilet', 'wallCeiling', 'waterHeater', 'outside', 'other'] },
      { key: 'leakShutoff', type: 'radio', options: ['yes', 'no', 'notSure'] }
    ],
    drain: [
      { key: 'drainScope', type: 'radio', options: ['one', 'multiple'] },
      { key: 'drainFlow', type: 'radio', options: ['blocked', 'slow'] }
    ],
    fixtures: [
      { key: 'fixtureType', type: 'select', options: ['toilet', 'faucet', 'sink', 'shower', 'other'] },
      { key: 'fixtureNeed', type: 'radio', options: ['repair', 'replaceInstall', 'other'] }
    ],
    heater: [
      { key: 'heaterIssue', type: 'select', options: ['noHotWater', 'leaking', 'replaceInstall', 'other'] },
      { key: 'heaterType', type: 'radio', options: ['tank', 'tankless', 'notSure'] }
    ],
    installation: [
      { key: 'installationType', type: 'select', options: ['fixture', 'waterHeater', 'piping', 'other'] },
      { key: 'propertyType', type: 'radio', options: ['residential', 'commercial'] }
    ],
    remodel: [
      { key: 'remodelArea', type: 'select', options: ['kitchen', 'bath', 'multiple', 'other'] },
      { key: 'remodelStage', type: 'radio', options: ['planning', 'inProgress', 'ready'] }
    ],
    commercial: [
      { key: 'commercialNeed', type: 'select', options: ['leak', 'drain', 'fixture', 'heater', 'installation', 'other'] },
      { key: 'commercialActive', type: 'radio', options: ['yes', 'no'] }
    ],
    other: [
      { key: 'contextNote', type: 'text' }
    ]
  };

  var COPY = {
    en: {
      formTitle: 'Request service',
      formLead: 'A short guided request. OTTO receives it directly in the service system.',
      stepLabel: 'Step {current} of 5',
      back: 'Back',
      next: 'Continue',
      submit: 'Send request',
      sending: 'Sending…',
      categoryTitle: 'What do you need help with?',
      categoryLead: 'Choose the closest match.',
      contextTitle: 'A few quick details',
      contextLead: 'Only the questions that apply to this service.',
      customerTitle: 'Where should OTTO contact you?',
      customerLead: 'Use the service address where the work is needed.',
      optionalTitle: 'Anything else that helps?',
      optionalLead: 'These details are optional.',
      reviewTitle: 'Review your request',
      reviewLead: 'Confirm the details before sending them to OTTO.',
      name: 'Name',
      phone: 'Phone',
      email: 'Email (optional)',
      address: 'Service address / location',
      contactPreference: 'Preferred contact (optional)',
      contactNone: 'No preference',
      call: 'Phone call',
      text: 'Text message',
      emailContact: 'Email',
      whatsapp: 'WhatsApp',
      description: 'Description (optional)',
      descriptionPh: 'Add anything useful that the short questions did not cover.',
      preferredDate: 'Preferred date (optional)',
      preferredWindow: 'Preferred time window (optional)',
      windowNone: 'No preference',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      flexible: 'Flexible',
      catLeak: 'Leak',
      catDrain: 'Drain / clog',
      catFixtures: 'Toilet / faucet',
      catHeater: 'Water heater',
      catInstallation: 'Plumbing installation',
      catRemodel: 'Remodel / construction',
      catCommercial: 'Commercial service',
      catOther: 'Other',
      leakActive: 'Is the leak active now?',
      leakWhere: 'Where is the leak?',
      leakShutoff: 'Can the water be shut off?',
      drainScope: 'Is it one fixture or multiple fixtures?',
      drainFlow: 'Is it fully blocked or slow?',
      fixtureType: 'Which fixture?',
      fixtureNeed: 'What does it need?',
      heaterIssue: 'What is happening with the water heater?',
      heaterType: 'What type is it?',
      installationType: 'What are you installing?',
      propertyType: 'Property type',
      remodelArea: 'What area is being remodeled?',
      remodelStage: 'Project stage',
      commercialNeed: 'What does the commercial property need?',
      commercialActive: 'Is the issue active now?',
      contextNote: 'Briefly, what do you need?',
      choose: 'Choose one',
      yes: 'Yes',
      no: 'No',
      notSure: 'Not sure',
      sink: 'Sink / cabinet',
      toilet: 'Toilet',
      wallCeiling: 'Wall / ceiling',
      waterHeater: 'Water heater',
      outside: 'Outside',
      other: 'Other',
      one: 'One fixture',
      multiple: 'Multiple fixtures / areas',
      blocked: 'Fully blocked',
      slow: 'Slow',
      faucet: 'Faucet',
      shower: 'Shower / tub',
      repair: 'Repair',
      replaceInstall: 'Replace / install',
      noHotWater: 'No hot water',
      leaking: 'Leaking',
      tank: 'Tank',
      tankless: 'Tankless',
      fixture: 'Fixture',
      piping: 'Piping / plumbing lines',
      residential: 'Residential',
      commercial: 'Commercial',
      kitchen: 'Kitchen',
      bath: 'Bathroom',
      planning: 'Planning',
      inProgress: 'In progress',
      ready: 'Ready for plumbing',
      installation: 'Installation',
      reviewService: 'Service',
      reviewContext: 'Job details',
      reviewCustomer: 'Customer',
      reviewLocation: 'Service location',
      reviewContact: 'Preferred contact',
      reviewTiming: 'Preferred timing',
      reviewDescription: 'Description',
      required: 'Required.',
      phoneError: 'Enter a valid 10-digit phone number.',
      emailError: 'Enter a valid email address or leave it empty.',
      answersError: 'Answer the short service questions to continue.',
      invalid: 'Check the highlighted details before continuing.',
      spam: 'This request could not be verified as genuine and was not sent.',
      duplicate: 'This exact request was already received. There is no need to send it again.',
      failed: 'The request was not sent. Your information is still here. Try again, call OTTO, or use WhatsApp.',
      network: 'The request was not sent because the connection failed. Your information is still here.',
      timeout: 'The request was not sent because no confirmation came back in time. Your information is still here.',
      notConfigured: 'Online sending is unavailable right now. Nothing has been sent.',
      receivedTitle: 'Request received',
      receivedLead: 'OTTO has your service request. The office will review it and follow up using your contact details.',
      reference: 'Reference',
      whatNext: 'What happens next',
      whatNextBody: 'The request is now in OTTO’s service system. No automatic response-time promise is being made.',
      callOtto: 'Call OTTO',
      openWhatsapp: 'Open WhatsApp',
      newRequest: 'Start another request',
      fallbackTitle: 'Need another contact path?',
      fallbackEmail: 'Open a pre-filled email',
      noTiming: 'No timing preference'
    },
    es: {
      formTitle: 'Solicitar servicio',
      formLead: 'Una solicitud guiada y breve. OTTO la recibe directamente en el sistema de servicio.',
      stepLabel: 'Paso {current} de 5',
      back: 'Atrás',
      next: 'Continuar',
      submit: 'Enviar solicitud',
      sending: 'Enviando…',
      categoryTitle: '¿Con qué necesita ayuda?',
      categoryLead: 'Elija la opción que más se acerque.',
      contextTitle: 'Unos detalles rápidos',
      contextLead: 'Solo preguntamos lo que aplica a este servicio.',
      customerTitle: '¿Dónde debe contactarle OTTO?',
      customerLead: 'Use la dirección donde se necesita el trabajo.',
      optionalTitle: '¿Hay algo más que ayude?',
      optionalLead: 'Estos datos son opcionales.',
      reviewTitle: 'Revise su solicitud',
      reviewLead: 'Confirme los datos antes de enviarlos a OTTO.',
      name: 'Nombre',
      phone: 'Teléfono',
      email: 'Correo (opcional)',
      address: 'Dirección / ubicación del servicio',
      contactPreference: 'Contacto preferido (opcional)',
      contactNone: 'Sin preferencia',
      call: 'Llamada',
      text: 'Mensaje de texto',
      emailContact: 'Correo',
      whatsapp: 'WhatsApp',
      description: 'Descripción (opcional)',
      descriptionPh: 'Agregue cualquier dato útil que las preguntas breves no cubrieron.',
      preferredDate: 'Fecha preferida (opcional)',
      preferredWindow: 'Horario preferido (opcional)',
      windowNone: 'Sin preferencia',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      flexible: 'Flexible',
      catLeak: 'Fuga',
      catDrain: 'Drenaje / tapón',
      catFixtures: 'Inodoro / llave',
      catHeater: 'Calentador de agua',
      catInstallation: 'Instalación de plomería',
      catRemodel: 'Remodelación / construcción',
      catCommercial: 'Servicio comercial',
      catOther: 'Otro',
      leakActive: '¿La fuga está activa ahora?',
      leakWhere: '¿Dónde está la fuga?',
      leakShutoff: '¿Se puede cerrar el agua?',
      drainScope: '¿Es un solo accesorio o varios?',
      drainFlow: '¿Está totalmente tapado o drena lento?',
      fixtureType: '¿Qué accesorio?',
      fixtureNeed: '¿Qué necesita?',
      heaterIssue: '¿Qué pasa con el calentador?',
      heaterType: '¿Qué tipo es?',
      installationType: '¿Qué se va a instalar?',
      propertyType: 'Tipo de propiedad',
      remodelArea: '¿Qué área se está remodelando?',
      remodelStage: 'Etapa del proyecto',
      commercialNeed: '¿Qué necesita la propiedad comercial?',
      commercialActive: '¿El problema está activo ahora?',
      contextNote: 'Describa brevemente lo que necesita',
      choose: 'Elija una opción',
      yes: 'Sí',
      no: 'No',
      notSure: 'No estoy seguro',
      sink: 'Fregadero / gabinete',
      toilet: 'Inodoro',
      wallCeiling: 'Pared / techo',
      waterHeater: 'Calentador de agua',
      outside: 'Exterior',
      other: 'Otro',
      one: 'Un accesorio',
      multiple: 'Varios accesorios / áreas',
      blocked: 'Totalmente tapado',
      slow: 'Lento',
      faucet: 'Llave',
      shower: 'Ducha / bañera',
      repair: 'Reparar',
      replaceInstall: 'Reemplazar / instalar',
      noHotWater: 'No hay agua caliente',
      leaking: 'Tiene fuga',
      tank: 'Tanque',
      tankless: 'Sin tanque',
      fixture: 'Accesorio',
      piping: 'Tuberías / líneas de plomería',
      residential: 'Residencial',
      commercial: 'Comercial',
      kitchen: 'Cocina',
      bath: 'Baño',
      planning: 'Planificación',
      inProgress: 'En progreso',
      ready: 'Listo para plomería',
      installation: 'Instalación',
      reviewService: 'Servicio',
      reviewContext: 'Detalles del trabajo',
      reviewCustomer: 'Cliente',
      reviewLocation: 'Ubicación del servicio',
      reviewContact: 'Contacto preferido',
      reviewTiming: 'Horario preferido',
      reviewDescription: 'Descripción',
      required: 'Obligatorio.',
      phoneError: 'Escriba un teléfono válido de 10 dígitos.',
      emailError: 'Escriba un correo válido o déjelo vacío.',
      answersError: 'Responda las preguntas breves del servicio para continuar.',
      invalid: 'Revise los datos marcados antes de continuar.',
      spam: 'No se pudo verificar esta solicitud como legítima y no se envió.',
      duplicate: 'Esta misma solicitud ya fue recibida. No hace falta enviarla otra vez.',
      failed: 'La solicitud no se envió. Sus datos siguen aquí. Intente otra vez, llame a OTTO o use WhatsApp.',
      network: 'La solicitud no se envió porque falló la conexión. Sus datos siguen aquí.',
      timeout: 'La solicitud no se envió porque no llegó confirmación a tiempo. Sus datos siguen aquí.',
      notConfigured: 'El envío en línea no está disponible ahora. No se ha enviado nada.',
      receivedTitle: 'Solicitud recibida',
      receivedLead: 'OTTO tiene su solicitud de servicio. La oficina la revisará y se comunicará usando sus datos de contacto.',
      reference: 'Referencia',
      whatNext: 'Qué sucede ahora',
      whatNextBody: 'La solicitud ya está en el sistema de servicio de OTTO. No se promete automáticamente un tiempo de respuesta.',
      callOtto: 'Llamar a OTTO',
      openWhatsapp: 'Abrir WhatsApp',
      newRequest: 'Crear otra solicitud',
      fallbackTitle: '¿Necesita otra forma de contacto?',
      fallbackEmail: 'Abrir un correo ya preparado',
      noTiming: 'Sin preferencia de horario'
    }
  };

  var state = {
    step: 0,
    startedAt: Date.now(),
    sending: false,
    status: '',
    statusTone: '',
    lastSent: { fingerprint: '', at: 0 },
    success: null,
    data: {
      category: '',
      answers: {},
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPreference: '',
      preferredDate: '',
      preferredWindow: '',
      description: '',
      honeypot: ''
    },
    errors: {}
  };

  function language() {
    return (document.documentElement.lang || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  function t(key) {
    var dict = COPY[language()] || COPY.en;
    return dict[key] || COPY.en[key] || key;
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function checked(value, expected) {
    return value === expected ? ' checked' : '';
  }

  function selected(value, expected) {
    return value === expected ? ' selected' : '';
  }

  function categoryLabel(key) {
    var map = {
      leak: 'catLeak',
      drain: 'catDrain',
      fixtures: 'catFixtures',
      heater: 'catHeater',
      installation: 'catInstallation',
      remodel: 'catRemodel',
      commercial: 'catCommercial',
      other: 'catOther'
    };
    return t(map[key] || 'catOther');
  }

  function optionLabel(value) {
    return t(value);
  }

  function questionLabel(key) {
    return t(key);
  }

  function whatsappUrl(lang) {
    if (whatsappNumber.length < 10) return '';
    var message = lang === 'es'
      ? 'Hola, acabo de enviar una solicitud de servicio a OTTO Plumbing.'
      : 'Hello, I just submitted a service request to OTTO Plumbing.';
    return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function currentDateIso() {
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function collect() {
    var category = form.querySelector('[name="category"]:checked');
    if (category) state.data.category = category.value;

    var answerFields = form.querySelectorAll('[data-answer-key]');
    for (var i = 0; i < answerFields.length; i += 1) {
      var field = answerFields[i];
      var key = field.getAttribute('data-answer-key');
      if (!key) continue;
      if (field.type === 'radio') {
        if (field.checked) state.data.answers[key] = field.value;
      } else {
        state.data.answers[key] = field.value;
      }
    }

    var names = ['name', 'phone', 'email', 'address', 'contactPreference', 'preferredDate', 'preferredWindow', 'description', 'honeypot'];
    for (var j = 0; j < names.length; j += 1) {
      var input = form.querySelector('[name="' + names[j] + '"]');
      if (input) state.data[names[j]] = input.value;
    }
  }

  function fieldError(name) {
    return state.errors[name] ? '<p class="intake-error">' + escapeHtml(state.errors[name]) + '</p>' : '<p class="intake-error"></p>';
  }

  function progressHtml() {
    var current = state.step + 1;
    var label = t('stepLabel').replace('{current}', String(current));
    var dots = '';
    for (var i = 0; i < 5; i += 1) {
      dots += '<span class="intake-progress__dot' + (i <= state.step ? ' is-on' : '') + '" aria-hidden="true"></span>';
    }
    return '<div class="intake-progress"><span>' + escapeHtml(label) + '</span><div class="intake-progress__dots">' + dots + '</div></div>';
  }

  function headingHtml(titleKey, leadKey) {
    return '<div class="intake-step__heading"><h3 tabindex="-1" data-step-heading>' + escapeHtml(t(titleKey)) + '</h3><p>' + escapeHtml(t(leadKey)) + '</p></div>';
  }

  function categoryStep() {
    var html = progressHtml() + headingHtml('categoryTitle', 'categoryLead');
    html += '<fieldset class="intake-step" aria-describedby="category-error"><legend class="sr-only">' + escapeHtml(t('categoryTitle')) + '</legend>';
    html += '<div class="intake-choice-grid">';
    for (var i = 0; i < CATEGORIES.length; i += 1) {
      var key = CATEGORIES[i];
      html += '<label class="intake-choice"><input type="radio" name="category" value="' + key + '"' + checked(state.data.category, key) + '><span>' + escapeHtml(categoryLabel(key)) + '</span></label>';
    }
    html += '</div><p class="intake-error" id="category-error">' + escapeHtml(state.errors.category || '') + '</p></fieldset>';
    return html;
  }

  function questionControl(question) {
    var value = state.data.answers[question.key] || '';
    var html = '<div class="intake-question">';
    html += '<div class="intake-question__label">' + escapeHtml(questionLabel(question.key)) + '</div>';
    if (question.type === 'text') {
      html += '<input type="text" data-answer-key="' + question.key + '" value="' + escapeHtml(value) + '" maxlength="220" autocomplete="off">';
    } else if (question.type === 'select') {
      html += '<select data-answer-key="' + question.key + '"><option value="">' + escapeHtml(t('choose')) + '</option>';
      for (var s = 0; s < question.options.length; s += 1) {
        var option = question.options[s];
        html += '<option value="' + option + '"' + selected(value, option) + '>' + escapeHtml(optionLabel(option)) + '</option>';
      }
      html += '</select>';
    } else {
      html += '<div class="intake-segmented">';
      for (var r = 0; r < question.options.length; r += 1) {
        var radio = question.options[r];
        html += '<label><input type="radio" name="answer-' + question.key + '" data-answer-key="' + question.key + '" value="' + radio + '"' + checked(value, radio) + '><span>' + escapeHtml(optionLabel(radio)) + '</span></label>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function contextStep() {
    var questions = QUESTION_SETS[state.data.category] || QUESTION_SETS.other;
    var html = progressHtml() + headingHtml('contextTitle', 'contextLead');
    html += '<div class="intake-question-grid">';
    for (var i = 0; i < questions.length; i += 1) html += questionControl(questions[i]);
    html += '</div><p class="intake-error">' + escapeHtml(state.errors.answers || '') + '</p>';
    return html;
  }

  function customerStep() {
    var html = progressHtml() + headingHtml('customerTitle', 'customerLead');
    html += '<div class="intake-grid">';
    html += '<div class="intake-field"><label for="intakeName">' + escapeHtml(t('name')) + '</label><input id="intakeName" name="name" type="text" autocomplete="name" maxlength="80" value="' + escapeHtml(state.data.name) + '" required>' + fieldError('name') + '</div>';
    html += '<div class="intake-field"><label for="intakePhone">' + escapeHtml(t('phone')) + '</label><input id="intakePhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="32" value="' + escapeHtml(state.data.phone) + '" required>' + fieldError('phone') + '</div>';
    html += '<div class="intake-field"><label for="intakeEmail">' + escapeHtml(t('email')) + '</label><input id="intakeEmail" name="email" type="email" autocomplete="email" maxlength="120" value="' + escapeHtml(state.data.email) + '">' + fieldError('email') + '</div>';
    html += '<div class="intake-field"><label for="intakeContact">' + escapeHtml(t('contactPreference')) + '</label><select id="intakeContact" name="contactPreference"><option value="">' + escapeHtml(t('contactNone')) + '</option><option value="call"' + selected(state.data.contactPreference, 'call') + '>' + escapeHtml(t('call')) + '</option><option value="text"' + selected(state.data.contactPreference, 'text') + '>' + escapeHtml(t('text')) + '</option><option value="email"' + selected(state.data.contactPreference, 'email') + '>' + escapeHtml(t('emailContact')) + '</option><option value="whatsapp"' + selected(state.data.contactPreference, 'whatsapp') + '>' + escapeHtml(t('whatsapp')) + '</option></select>' + fieldError('contactPreference') + '</div>';
    html += '<div class="intake-field is-wide"><label for="intakeAddress">' + escapeHtml(t('address')) + '</label><input id="intakeAddress" name="address" type="text" autocomplete="street-address" maxlength="180" value="' + escapeHtml(state.data.address) + '" required>' + fieldError('address') + '</div>';
    html += '</div>';
    return html;
  }

  function optionalStep() {
    var html = progressHtml() + headingHtml('optionalTitle', 'optionalLead');
    html += '<div class="intake-grid">';
    html += '<div class="intake-field"><label for="intakeDate">' + escapeHtml(t('preferredDate')) + '</label><input id="intakeDate" name="preferredDate" type="date" min="' + currentDateIso() + '" value="' + escapeHtml(state.data.preferredDate) + '">' + fieldError('preferredDate') + '</div>';
    html += '<div class="intake-field"><label for="intakeWindow">' + escapeHtml(t('preferredWindow')) + '</label><select id="intakeWindow" name="preferredWindow"><option value="">' + escapeHtml(t('windowNone')) + '</option><option value="morning"' + selected(state.data.preferredWindow, 'morning') + '>' + escapeHtml(t('morning')) + '</option><option value="afternoon"' + selected(state.data.preferredWindow, 'afternoon') + '>' + escapeHtml(t('afternoon')) + '</option><option value="evening"' + selected(state.data.preferredWindow, 'evening') + '>' + escapeHtml(t('evening')) + '</option><option value="flexible"' + selected(state.data.preferredWindow, 'flexible') + '>' + escapeHtml(t('flexible')) + '</option></select>' + fieldError('preferredWindow') + '</div>';
    html += '<div class="intake-field is-wide"><label for="intakeDescription">' + escapeHtml(t('description')) + '</label><textarea id="intakeDescription" name="description" rows="4" maxlength="1200" placeholder="' + escapeHtml(t('descriptionPh')) + '">' + escapeHtml(state.data.description) + '</textarea>' + fieldError('description') + '</div>';
    html += '</div>';
    return html;
  }

  function localizedAnswerSummary() {
    var questions = QUESTION_SETS[state.data.category] || [];
    var parts = [];
    for (var i = 0; i < questions.length; i += 1) {
      var q = questions[i];
      var value = state.data.answers[q.key];
      if (!value) continue;
      parts.push(questionLabel(q.key) + ': ' + (q.type === 'text' ? value : optionLabel(value)));
    }
    return parts.join(' · ');
  }

  function reviewRow(label, value) {
    if (!value) return '';
    return '<div class="intake-review__row"><dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value) + '</dd></div>';
  }

  function reviewStep() {
    var timing = [state.data.preferredDate, state.data.preferredWindow ? t(state.data.preferredWindow) : ''].filter(Boolean).join(' · ') || t('noTiming');
    var customer = [state.data.name, core.formatPhone(state.data.phone), state.data.email].filter(Boolean).join(' · ');
    var contact = state.data.contactPreference ? t(state.data.contactPreference === 'email' ? 'emailContact' : state.data.contactPreference) : t('contactNone');
    var html = progressHtml() + headingHtml('reviewTitle', 'reviewLead');
    html += '<dl class="intake-review">';
    html += reviewRow(t('reviewService'), categoryLabel(state.data.category));
    html += reviewRow(t('reviewContext'), localizedAnswerSummary());
    html += reviewRow(t('reviewCustomer'), customer);
    html += reviewRow(t('reviewLocation'), state.data.address);
    html += reviewRow(t('reviewContact'), contact);
    html += reviewRow(t('reviewTiming'), timing);
    html += reviewRow(t('reviewDescription'), state.data.description);
    html += '</dl>';
    if (state.status) html += '<p class="intake-status ' + (state.statusTone === 'error' ? 'is-error' : state.statusTone === 'ok' ? 'is-ok' : '') + '" role="status" aria-live="polite">' + escapeHtml(state.status) + '</p>';
    return html;
  }

  function actionsHtml() {
    var html = '<div class="intake-wizard__actions">';
    if (state.step > 0) html += '<button type="button" class="intake-back" data-action="back">' + escapeHtml(t('back')) + '</button>';
    if (state.step < 4) html += '<button type="button" class="intake-submit" data-action="next">' + escapeHtml(t('next')) + '</button>';
    else html += '<button type="submit" class="intake-submit"' + (state.sending ? ' disabled' : '') + '>' + escapeHtml(state.sending ? t('sending') : t('submit')) + '</button>';
    html += '</div>';
    return html;
  }

  function fallbackHtml(values) {
    var mailto = fallbackEmail ? core.buildMailtoUrl(fallbackEmail, values || state.data, language()) : '';
    var wa = whatsappUrl(language());
    var html = '<div class="intake-fallback is-on"><strong>' + escapeHtml(t('fallbackTitle')) + '</strong><div class="intake-fallback__actions">';
    html += '<a class="call-btn" href="tel:' + core.PHONE_E164 + '">' + escapeHtml(t('callOtto')) + '</a>';
    if (wa) html += '<a class="call-btn intake-whatsapp" href="' + escapeHtml(wa) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('openWhatsapp')) + '</a>';
    if (mailto) html += '<a class="call-btn intake-email" href="' + escapeHtml(mailto) + '">' + escapeHtml(t('fallbackEmail')) + '</a>';
    html += '</div></div>';
    return html;
  }

  function renderSuccess() {
    var success = state.success || {};
    var values = success.values || state.data;
    var wa = whatsappUrl(language());
    var html = '<div class="intake-confirmation" role="status" aria-live="polite">';
    html += '<div class="intake-confirmation__mark" aria-hidden="true">✓</div>';
    html += '<h3>' + escapeHtml(t('receivedTitle')) + '</h3><p>' + escapeHtml(t('receivedLead')) + '</p>';
    html += '<dl class="intake-review intake-review--confirmation">';
    html += reviewRow(t('reviewService'), categoryLabel(values.category));
    html += reviewRow(t('reviewLocation'), values.address);
    if (success.id) html += reviewRow(t('reference'), success.id);
    html += '</dl>';
    html += '<div class="intake-next"><strong>' + escapeHtml(t('whatNext')) + '</strong><p>' + escapeHtml(t('whatNextBody')) + '</p></div>';
    html += '<div class="intake-confirmation__actions"><a class="intake-submit" href="tel:' + core.PHONE_E164 + '">' + escapeHtml(t('callOtto')) + '</a>';
    if (wa) html += '<a class="intake-back intake-whatsapp" href="' + escapeHtml(wa) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('openWhatsapp')) + '</a>';
    html += '<button type="button" class="intake-back" data-action="new">' + escapeHtml(t('newRequest')) + '</button></div>';
    html += '</div>';
    form.innerHTML = html;
  }

  function render() {
    if (state.success) {
      renderSuccess();
      return;
    }

    var html = '<div class="intake-wizard">';
    if (state.step === 0) html += categoryStep();
    else if (state.step === 1) html += contextStep();
    else if (state.step === 2) html += customerStep();
    else if (state.step === 3) html += optionalStep();
    else html += reviewStep();
    html += actionsHtml();
    html += '<div class="intake-hp"><label for="intakeCompany">Company</label><input id="intakeCompany" name="honeypot" type="text" tabindex="-1" autocomplete="off" value="' + escapeHtml(state.data.honeypot) + '"></div>';
    if (state.statusTone === 'error' && state.step === 4) html += fallbackHtml(state.data);
    html += '</div>';
    form.innerHTML = html;

    var heading = form.querySelector('[data-step-heading]');
    if (heading && typeof heading.focus === 'function') heading.focus({ preventScroll: true });
  }

  function validateStep(step) {
    state.errors = {};
    collect();

    if (step === 0) {
      if (!state.data.category || CATEGORIES.indexOf(state.data.category) === -1) state.errors.category = t('required');
    } else if (step === 1) {
      var required = core.requiredAnswerKeys(state.data.category);
      for (var i = 0; i < required.length; i += 1) {
        if (!state.data.answers[required[i]] || !String(state.data.answers[required[i]]).trim()) {
          state.errors.answers = t('answersError');
          break;
        }
      }
    } else if (step === 2) {
      var result = core.validate(state.data);
      if (result.errors.name) state.errors.name = t('required');
      if (result.errors.phone) state.errors.phone = result.errors.phone === 'phone' ? t('phoneError') : t('required');
      if (result.errors.email) state.errors.email = t('emailError');
      if (result.errors.address) state.errors.address = t('required');
    } else if (step === 3) {
      if (state.data.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(state.data.preferredDate)) state.errors.preferredDate = t('invalid');
    }

    return Object.keys(state.errors).length === 0;
  }

  function resetRequest() {
    state.step = 0;
    state.startedAt = Date.now();
    state.sending = false;
    state.status = '';
    state.statusTone = '';
    state.success = null;
    state.errors = {};
    state.data = {
      category: '', answers: {}, name: '', phone: '', email: '', address: '', contactPreference: '',
      preferredDate: '', preferredWindow: '', description: '', honeypot: ''
    };
    render();
  }

  form.addEventListener('input', collect);
  form.addEventListener('change', collect);

  form.addEventListener('click', function (event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    if (action === 'back') {
      event.preventDefault();
      collect();
      state.errors = {};
      state.status = '';
      state.statusTone = '';
      state.step = Math.max(0, state.step - 1);
      render();
    } else if (action === 'next') {
      event.preventDefault();
      if (!validateStep(state.step)) {
        render();
        return;
      }
      state.status = '';
      state.statusTone = '';
      state.step = Math.min(4, state.step + 1);
      render();
    } else if (action === 'new') {
      event.preventDefault();
      resetRequest();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (state.sending || state.step !== 4) return;
    collect();

    var result = core.validate(state.data);
    if (!result.valid) {
      state.status = t('invalid');
      state.statusTone = 'error';
      if (result.errors.answers || result.errors.category) state.step = result.errors.category ? 0 : 1;
      else if (result.errors.name || result.errors.phone || result.errors.email || result.errors.address) state.step = 2;
      else if (result.errors.preferredDate) state.step = 3;
      render();
      return;
    }

    var spam = core.checkSpam({
      values: result.values,
      honeypot: state.data.honeypot,
      elapsedMs: Date.now() - state.startedAt
    });
    if (spam) {
      state.status = t('spam');
      state.statusTone = 'error';
      render();
      return;
    }

    var stamp = core.fingerprint(result.values);
    if (stamp === state.lastSent.fingerprint && Date.now() - state.lastSent.at < core.DUPLICATE_WINDOW_MS) {
      state.status = t('duplicate');
      state.statusTone = 'ok';
      render();
      return;
    }

    if (!configured) {
      state.status = t('notConfigured');
      state.statusTone = 'error';
      render();
      return;
    }

    state.sending = true;
    state.status = '';
    state.statusTone = '';
    render();

    core.deliverIntake({
      endpoint: endpoint,
      payload: core.buildPayload(result.values, {
        language: language(),
        page: window.location ? window.location.href : ''
      }),
      fetchImpl: typeof window.fetch === 'function' ? window.fetch.bind(window) : null,
      timeoutMs: typeof config.timeoutMs === 'number' ? config.timeoutMs : 15000
    }).then(function (delivery) {
      state.lastSent = { fingerprint: stamp, at: Date.now() };
      state.sending = false;
      state.success = {
        id: delivery && delivery.body && delivery.body.id ? String(delivery.body.id) : '',
        values: result.values
      };
      render();
    }).catch(function (error) {
      state.sending = false;
      var code = error && error.code ? error.code : 'unexpected';
      if (code === 'network' || code === 'unsupported') state.status = t('network');
      else if (code === 'timeout') state.status = t('timeout');
      else if (code === 'notConfigured') state.status = t('notConfigured');
      else state.status = t('failed');
      state.statusTone = 'error';
      render();
    });
  });

  var langButtons = document.querySelectorAll('[data-lang]');
  for (var b = 0; b < langButtons.length; b += 1) {
    langButtons[b].addEventListener('click', function () {
      collect();
      window.setTimeout(render, 12);
    });
  }

  render();
})();
