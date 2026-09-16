/* OTTO Plumbing — secondary phone + optional claim/draft intake.
 * Extends the existing guided request without changing its core validation.
 */
(function () {
  'use strict';

  var SECONDARY_DISPLAY = '(786) 922-6330';
  var SECONDARY_E164 = '+17869226330';
  var MAX_PDF_BYTES = 5 * 1024 * 1024;
  var state = { claimText: '', claimDraftUrl: '', file: null, fileError: '' };
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
      '.otto-secondary-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}',
      '.otto-secondary-actions a{font-size:.82rem;text-decoration:underline}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureSecondaryPhone() {
    var contact = document.querySelector('#contact .contact-grid .contact-card .contact-stack');
    if (contact && !contact.querySelector('[data-otto-secondary-phone]')) {
      var row = document.createElement('div');
      row.className = 'contact-row';
      row.setAttribute('data-otto-secondary-phone', '1');
      row.innerHTML = '<small data-secondary-label></small><strong><a href="tel:' + SECONDARY_E164 + '">' + SECONDARY_DISPLAY + '</a></strong>' +
        '<div class="otto-secondary-actions"><a href="tel:' + SECONDARY_E164 + '" data-secondary-call></a><a href="sms:' + SECONDARY_E164 + '" data-secondary-text></a></div>';
      var first = contact.querySelector('.contact-row');
      if (first && first.nextSibling) contact.insertBefore(row, first.nextSibling); else contact.appendChild(row);
    }

    var labelText = words('Secondary line', 'Línea secundaria');
    var callText = words('Call secondary', 'Llamar a secundaria');
    var smsText = words('Text secondary', 'Escribir a secundaria');
    document.querySelectorAll('[data-secondary-label]').forEach(function (el) { setText(el, labelText); });
    document.querySelectorAll('[data-secondary-call]').forEach(function (el) { setText(el, callText); });
    document.querySelectorAll('[data-secondary-text]').forEach(function (el) { setText(el, smsText); });

    var foot = document.querySelector('.foot-box');
    if (foot && !foot.querySelector('[data-otto-secondary-footer]')) {
      var extra = document.createElement('div');
      extra.setAttribute('data-otto-secondary-footer', '1');
      foot.appendChild(extra);
    }
    var footer = foot && foot.querySelector('[data-otto-secondary-footer]');
    setText(footer, words('Secondary: ', 'Secundario: ') + SECONDARY_DISPLAY);
  }

  function claimBoxHtml() {
    var selected = state.file ? state.file.name + ' · ' + Math.ceil(state.file.size / 1024) + ' KB' : '';
    var note = state.fileError || selected || words('PDF only · maximum 5 MB', 'Solo PDF · máximo 5 MB');
    return '<div class="intake-field is-wide otto-claim-box" data-otto-claim-box>' +
      '<h4>' + words('Claim / draft information (optional)', 'Información de reclamación / borrador (opcional)') + '</h4>' +
      '<p>' + words('Include claim notes, attach a PDF, or paste a link to the draft. These details will be included in the OTTO CRM alert.', 'Incluya notas de la reclamación, adjunte un PDF o pegue un enlace al borrador. Estos datos se incluirán en la alerta del CRM de OTTO.') + '</p>' +
      '<label for="ottoClaimText">' + words('Claim information / notes', 'Información / notas de la reclamación') + '</label>' +
      '<textarea id="ottoClaimText" rows="4" maxlength="3000" placeholder="' + words('Add the claim text or instructions to include.', 'Agregue el texto o las instrucciones de la reclamación.') + '"></textarea>' +
      '<label for="ottoClaimDraftUrl" style="margin-top:12px">' + words('Draft link', 'Enlace del borrador') + '</label>' +
      '<input id="ottoClaimDraftUrl" type="url" inputmode="url" maxlength="800" placeholder="https://...">' +
      '<label for="ottoClaimPdf" style="margin-top:12px">' + words('PDF attachment', 'Adjunto PDF') + '</label>' +
      '<input id="ottoClaimPdf" type="file" accept="application/pdf,.pdf">' +
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
    var url = document.getElementById('ottoClaimDraftUrl');
    var file = document.getElementById('ottoClaimPdf');
    if (text) text.value = state.claimText;
    if (url) url.value = state.claimDraftUrl;
    if (text) text.addEventListener('input', function () { state.claimText = text.value; });
    if (url) url.addEventListener('input', function () { state.claimDraftUrl = url.value; });
    if (file) file.addEventListener('change', function () {
      state.fileError = '';
      var chosen = file.files && file.files[0];
      if (!chosen) { state.file = null; updateFileNote(); return; }
      var isPdf = chosen.type === 'application/pdf' || /\.pdf$/i.test(chosen.name || '');
      if (!isPdf) {
        state.file = null;
        state.fileError = words('Please choose a PDF file.', 'Seleccione un archivo PDF.');
        file.value = '';
      } else if (chosen.size > MAX_PDF_BYTES) {
        state.file = null;
        state.fileError = words('The PDF must be 5 MB or smaller.', 'El PDF debe tener 5 MB o menos.');
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
    setText(note, state.fileError || (state.file ? state.file.name + ' · ' + Math.ceil(state.file.size / 1024) + ' KB' : words('PDF only · maximum 5 MB', 'Solo PDF · máximo 5 MB')));
  }

  function ensureReviewClaim() {
    var review = document.querySelector('.intake-review');
    if (!review || review.querySelector('[data-otto-claim-review]')) return;
    if (!state.claimText && !state.claimDraftUrl && !state.file) return;
    var row = document.createElement('div');
    row.className = 'intake-review__row';
    row.setAttribute('data-otto-claim-review', '1');
    var values = [];
    if (state.claimText) values.push(words('Notes included', 'Notas incluidas'));
    if (state.claimDraftUrl) values.push(state.claimDraftUrl);
    if (state.file) values.push(words('PDF: ', 'PDF: ') + state.file.name);
    var dt = document.createElement('dt');
    dt.textContent = words('Claim / draft', 'Reclamación / borrador');
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
      reader.onerror = function () { reject(new Error('pdf_read_failed')); };
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
      var draft = normalizeUrl(state.claimDraftUrl);
      if (state.claimDraftUrl && !draft) {
        var bad = new Error('invalid_claim_url');
        bad.code = 'rejected';
        return Promise.reject(bad);
      }
      payload.claimText = safeText(state.claimText).trim().slice(0, 3000);
      payload.claimDraftUrl = draft;
      if (!state.file) return original(Object.assign({}, options, { payload: payload }));
      return fileToBase64(state.file).then(function (base64) {
        payload.claimPdfName = safeText(state.file.name).slice(0, 180);
        payload.claimPdfMime = 'application/pdf';
        payload.claimPdfSize = state.file.size;
        payload.claimPdfBase64 = base64;
        return original(Object.assign({}, options, { payload: payload }));
      });
    };
    core.__ottoClaimPatched = true;
  }

  function enhance() {
    ensureStyles();
    ensureSecondaryPhone();
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
