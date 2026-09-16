/* OTTO Plumbing — contact details + optional plans/attachments intake. */
(function () {
  'use strict';

  var PRIMARY_DISPLAY = '(786) 344-2837';
  var PRIMARY_E164 = '+17863442837';
  var SECONDARY_DISPLAY = '(786) 922-6330';
  var SECONDARY_E164 = '+17869226330';
  var CONTACT_EMAIL = ((window.OTTO_INTAKE_CONFIG || {}).fallbackEmail || 'hernandezotto77@gmail.com').trim();
  var WHATSAPP_NUMBER = String((window.OTTO_INTAKE_CONFIG || {}).whatsappNumber || '17863442837').replace(/\D/g, '');
  var MAX_FILE_BYTES = 10 * 1024 * 1024;
  var ACCEPT = '.pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.heic,.heif,.dwg,.dxf,.dwf,.dgn,.json';
  var ALLOWED_EXTENSIONS = /\.(pdf|doc|docx|txt|rtf|csv|xls|xlsx|ppt|pptx|jpg|jpeg|png|webp|heic|heif|dwg|dxf|dwf|dgn|json)$/i;
  var state = { claimText: '', sharedLink: '', file: null, fileError: '' };
  var enhanceQueued = false;

  function lang() { return document.documentElement.lang === 'es' ? 'es' : 'en'; }
  function words(en, es) { return lang() === 'es' ? es : en; }
  function safeText(value) { return String(value == null ? '' : value); }
  function setText(el, value) { if (el && el.textContent !== value) el.textContent = value; }

  function normalizeUrl(value) {
    var text = safeText(value).trim();
    if (!text) return '';
    try {
      var url = new URL(text);
      return (url.protocol === 'http:' || url.protocol === 'https:') ? url.href : '';
    } catch (_) {
      return '';
    }
  }

  function whatsappUrl() {
    if (WHATSAPP_NUMBER.length < 10) return '';
    var message = words('Hello, I need plumbing service from OTTO Plumbing.', 'Hola, necesito servicio de plomería de OTTO Plumbing.');
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function ensureStyles() {
    if (document.getElementById('otto-claim-intake-style')) return;
    var style = document.createElement('style');
    style.id = 'otto-claim-intake-style';
    style.textContent = [
      '.otto-claim-box{margin-top:8px;padding:18px;border:1px solid var(--line,#d7dfec);border-radius:18px;background:rgba(255,255,255,.72)}',
      '.otto-claim-box h4{margin:0 0 6px;font-size:1rem}',
      '.otto-claim-box>p{margin:0 0 14px;color:var(--muted,#5a667c);font-size:.9rem}',
      '.otto-claim-file-note{display:block;margin-top:7px;color:var(--muted,#5a667c);font-size:.82rem}',
      '.otto-claim-file-note.is-error{color:#b42318;font-weight:700}',
      '.otto-contact-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}',
      '.otto-contact-actions a{font-size:.85rem;text-decoration:underline}',
      '.otto-contact-link{overflow-wrap:anywhere}',
      '.otto-contact-questionnaire{display:inline-flex;align-items:center;font-weight:700;color:var(--blue-2,#274690)}'
    ].join('');
    document.head.appendChild(style);
  }

  function stripEstablished1996() {
    setText(document.querySelector('.brand-sub'), words('South Florida plumbing', 'Plomería en el sur de Florida'));
    var businessTitle = document.querySelector('#panel-credentials-h');
    setText(businessTitle, words('Licensed. Easy to verify.', 'Con licencia. Fácil de verificar.'));
    var oldAlt = document.querySelector('img[alt*="1996"]');
    if (oldAlt) oldAlt.alt = words(
      'Two OTTO Plumbing technicians reviewing plans beside copper rough-in work and a service van.',
      'Dos técnicos de OTTO Plumbing revisando planos junto a una instalación de cobre y una camioneta de servicio.'
    );
  }

  function contactRow(label, body) {
    return '<div class="contact-row"><small>' + label + '</small>' + body + '</div>';
  }

  function ensureContactDetails() {
    var stack = document.querySelector('#contact .contact-grid .contact-card .contact-stack');
    if (!stack) return;
    var version = lang() + '-contact-v3';
    if (stack.getAttribute('data-otto-contact-version') === version) return;
    var wa = whatsappUrl();
    var html = '';
    html += contactRow(words('Primary phone', 'Teléfono principal'),
      '<strong><a href="tel:' + PRIMARY_E164 + '">' + PRIMARY_DISPLAY + '</a></strong>' +
      '<div class="otto-contact-actions"><a href="tel:' + PRIMARY_E164 + '">' + words('Call', 'Llamar') + '</a><a href="sms:' + PRIMARY_E164 + '">' + words('Text', 'Escribir') + '</a></div>');
    html += contactRow(words('Secondary phone', 'Teléfono secundario'),
      '<strong><a href="tel:' + SECONDARY_E164 + '">' + SECONDARY_DISPLAY + '</a></strong>' +
      '<div class="otto-contact-actions"><a href="tel:' + SECONDARY_E164 + '">' + words('Call', 'Llamar') + '</a><a href="sms:' + SECONDARY_E164 + '">' + words('Text', 'Escribir') + '</a></div>');
    html += contactRow(words('Email', 'Correo'),
      '<strong class="otto-contact-link"><a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a></strong>');
    if (wa) {
      html += contactRow('WhatsApp', '<strong><a href="' + wa + '" target="_blank" rel="noopener noreferrer">' + words('Open WhatsApp', 'Abrir WhatsApp') + '</a></strong><div class="contact-note">' + PRIMARY_DISPLAY + '</div>');
    }
    html += contactRow(words('Online questionnaire', 'Cuestionario en línea'),
      '<a class="otto-contact-questionnaire" href="#request">' + words('Fill out the service request', 'Completar la solicitud de servicio') + ' →</a>');
    stack.innerHTML = html;
    stack.setAttribute('data-otto-contact-version', version);

    var lead = document.querySelector('#panel-contact-h + .contact-lead');
    setText(lead, words(
      'Call, text, email, WhatsApp, or send the job through the service questionnaire below.',
      'Llame, escriba, envíe un correo, use WhatsApp o mande el trabajo mediante el cuestionario de servicio de abajo.'
    ));
  }

  function fileSummary(file) {
    if (!file) return '';
    var mb = file.size / (1024 * 1024);
    return file.name + ' · ' + (mb >= 1 ? mb.toFixed(1) + ' MB' : Math.ceil(file.size / 1024) + ' KB');
  }

  function claimBoxHtml() {
    var selected = state.file ? fileSummary(state.file) : '';
    var note = state.fileError || selected || words(
      'PDF, Word, Excel, PowerPoint, text/CSV, images, or common CAD files · maximum 10 MB. For larger plans, use the shared-link field.',
      'PDF, Word, Excel, PowerPoint, texto/CSV, imágenes o archivos CAD comunes · máximo 10 MB. Para planos más grandes, use el campo de enlace compartido.'
    );
    return '<div class="intake-field is-wide otto-claim-box" data-otto-claim-box>' +
      '<h4>' + words('Plans / supporting files (optional)', 'Planos / archivos de apoyo (opcional)') + '</h4>' +
      '<p>' + words('Attach a plan or document, paste a Dropbox/Google Drive/OneDrive link, and add any notes OTTO should see with the request.', 'Adjunte un plano o documento, pegue un enlace de Dropbox/Google Drive/OneDrive y agregue las notas que OTTO deba ver con la solicitud.') + '</p>' +
      '<label for="ottoClaimText">' + words('Notes for the file or plans', 'Notas para el archivo o los planos') + '</label>' +
      '<textarea id="ottoClaimText" rows="3" maxlength="3000" placeholder="' + words('Optional instructions or context for the attached plans.', 'Instrucciones o contexto opcional para los planos adjuntos.') + '"></textarea>' +
      '<label for="ottoSharedLink" style="margin-top:12px">' + words('Shared link', 'Enlace compartido') + '</label>' +
      '<input id="ottoSharedLink" type="url" inputmode="url" maxlength="800" placeholder="https://dropbox.com/...">' +
      '<label for="ottoAttachment" style="margin-top:12px">' + words('Attachment', 'Adjunto') + '</label>' +
      '<input id="ottoAttachment" type="file" accept="' + ACCEPT + '">' +
      '<span class="otto-claim-file-note' + (state.fileError ? ' is-error' : '') + '" data-otto-claim-file-note>' + note + '</span>' +
      '</div>';
  }

  function ensureClaimFields() {
    var description = document.getElementById('intakeDescription');
    if (!description) return;
    var grid = description.closest('.intake-grid');
    if (!grid || grid.querySelector('[data-otto-claim-box]')) return;
    grid.insertAdjacentHTML('beforeend', claimBoxHtml());
    var text = document.getElementById('ottoClaimText');
    var url = document.getElementById('ottoSharedLink');
    var file = document.getElementById('ottoAttachment');
    if (text) text.value = state.claimText;
    if (url) url.value = state.sharedLink;
    if (text) text.addEventListener('input', function () { state.claimText = text.value; });
    if (url) url.addEventListener('input', function () { state.sharedLink = url.value; });
    if (file) file.addEventListener('change', function () {
      state.fileError = '';
      var chosen = file.files && file.files[0];
      if (!chosen) { state.file = null; updateFileNote(); return; }
      if (!ALLOWED_EXTENSIONS.test(chosen.name || '')) {
        state.file = null;
        state.fileError = words('Choose a supported document, image, or plan file.', 'Seleccione un documento, imagen o archivo de plano compatible.');
        file.value = '';
      } else if (chosen.size > MAX_FILE_BYTES) {
        state.file = null;
        state.fileError = words('The attachment must be 10 MB or smaller. Use a shared link for larger files.', 'El adjunto debe ser de 10 MB o menos. Use un enlace compartido para archivos más grandes.');
        file.value = '';
      } else {
        state.file = chosen;
      }
      updateFileNote();
    });
  }

  function updateFileNote() {
    var note = document.querySelector('[data-otto-claim-file-note]');
    if (!note) return;
    note.classList.toggle('is-error', !!state.fileError);
    setText(note, state.fileError || (state.file ? fileSummary(state.file) : words(
      'PDF, Word, Excel, PowerPoint, text/CSV, images, or common CAD files · maximum 10 MB. For larger plans, use the shared-link field.',
      'PDF, Word, Excel, PowerPoint, texto/CSV, imágenes o archivos CAD comunes · máximo 10 MB. Para planos más grandes, use el campo de enlace compartido.'
    )));
  }

  function ensureReviewClaim() {
    var review = document.querySelector('.intake-review');
    if (!review || review.querySelector('[data-otto-claim-review]')) return;
    if (!state.claimText && !state.sharedLink && !state.file) return;
    var row = document.createElement('div');
    row.className = 'intake-review__row';
    row.setAttribute('data-otto-claim-review', '1');
    var values = [];
    if (state.claimText) values.push(words('Notes included', 'Notas incluidas'));
    if (state.sharedLink) values.push(words('Link: ', 'Enlace: ') + state.sharedLink);
    if (state.file) values.push(words('Attachment: ', 'Adjunto: ') + state.file.name);
    var dt = document.createElement('dt');
    dt.textContent = words('Plans / files', 'Planos / archivos');
    var dd = document.createElement('dd');
    dd.textContent = values.join(' · ');
    row.appendChild(dt); row.appendChild(dd); review.appendChild(row);
  }

  function fileToBase64(file) {
    if (!file) return Promise.resolve('');
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || '');
        resolve(result.indexOf(',') >= 0 ? result.slice(result.indexOf(',') + 1) : result);
      };
      reader.onerror = function () { reject(new Error('attachment_read_failed')); };
      reader.readAsDataURL(file);
    });
  }

  function patchDelivery() {
    var core = window.OTTOIntakeCore;
    if (!core || core.__ottoClaimPatched || typeof core.deliverIntake !== 'function') return;
    var original = core.deliverIntake;
    core.deliverIntake = function (options) {
      options = options || {};
      var payload = Object.assign({}, options.payload || {});
      var shared = normalizeUrl(state.sharedLink);
      if (state.sharedLink && !shared) {
        var bad = new Error('invalid_shared_link');
        bad.code = 'rejected';
        return Promise.reject(bad);
      }
      payload.claimText = safeText(state.claimText).trim().slice(0, 3000);
      payload.sharedLink = shared;
      payload.claimDraftUrl = shared;
      if (!state.file) return original(Object.assign({}, options, { payload: payload }));
      return fileToBase64(state.file).then(function (base64) {
        payload.attachmentName = safeText(state.file.name).slice(0, 180);
        payload.attachmentMime = safeText(state.file.type || 'application/octet-stream').slice(0, 120);
        payload.attachmentSize = state.file.size;
        payload.attachmentBase64 = base64;
        return original(Object.assign({}, options, { payload: payload }));
      });
    };
    core.__ottoClaimPatched = true;
  }

  function enhance() {
    ensureStyles();
    stripEstablished1996();
    ensureContactDetails();
    patchDelivery();
    ensureClaimFields();
    ensureReviewClaim();
  }

  function queueEnhance() {
    if (enhanceQueued) return;
    enhanceQueued = true;
    var run = function () { enhanceQueued = false; enhance(); };
    if (window.queueMicrotask) queueMicrotask(run); else setTimeout(run, 0);
  }

  function start() {
    enhance();
    new MutationObserver(queueEnhance)
      .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
