/* =====================================================================
   medcity-ui.js — the pieces all three MEDCITY Testprep pages share.

   The batch card, the meta list, the identity dialog and the enrol flow
   live here so that the catalogue and My Batches cannot drift apart: a
   batch looks the same and enrols the same wherever it is shown.

   Depends on medcity-data.js and medcity-enrol.js, both of which must be
   loaded first.

   API:
     MedcityUI.esc(str)
     MedcityUI.toast(message)
     MedcityUI.icon(name)            -> inline svg string
     MedcityUI.metaList(batch)       -> the dates/mode/seats block
     MedcityUI.seats(batch)          -> the seat bar, or ''
     MedcityUI.batchCard(batch, o)   -> a catalogue card
     MedcityUI.askIdentity()         -> Promise<candidate|null>
     MedcityUI.enrol(batchId)        -> Promise<boolean>  (true = joined)
     MedcityUI.bindEnrolButtons(root)
   ===================================================================== */
(function () {
  'use strict';
  if (window.MedcityUI) return;

  var D = window.MedcityData;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------------------------------------------------------- */
  /* toast                                                              */
  var toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'mc-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    /* let the element land before animating, or the transition is skipped */
    requestAnimationFrame(function () { toastEl.classList.add('on'); });
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 4200);
  }

  /* ---------------------------------------------------------------- */
  /* icons                                                              */
  var ICONS = {
    cal: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    teach: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>'
  };
  function icon(n) {
    var p = ICONS[n] || ICONS.info;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------------------------------------------------------------- */
  /* the reusable bits of a batch                                       */

  function row(ic, label, value) {
    if (!value) return '';
    return '<li>' + icon(ic) + '<span>' + (label ? '<b>' + esc(label) + '</b> ' : '') + esc(value) + '</span></li>';
  }

  function metaList(b) {
    var when = D.fmtRange(b.starts, b.ends);
    var sched = [b.days, b.time].filter(Boolean).join(' · ');
    var html = '';
    html += row('cal', '', when);
    html += row('clock', '', sched);
    html += row('pin', '', D.modeLabel(b));
    if (b.faculty && b.faculty.length) html += row('teach', '', b.faculty.join(', '));
    return html ? '<ul class="meta">' + html + '</ul>' : '';
  }

  /* The seat bar only appears when both numbers are known — a bar drawn
     from a guess would be worse than no bar. */
  function seats(b) {
    if (typeof b.seats !== 'number' || typeof b.seatsLeft !== 'number' || b.seats <= 0) return '';
    var left = Math.max(0, Math.min(b.seats, b.seatsLeft));
    var taken = b.seats - left;
    var pct = Math.round((taken / b.seats) * 100);
    var low = left > 0 && left <= Math.max(3, Math.round(b.seats * 0.2));
    var note = left === 0
      ? 'All ' + b.seats + ' seats taken — enrolling joins the waitlist'
      : left + ' of ' + b.seats + ' seats left';
    return '<div class="seatbar"><i style="width:' + pct + '%"></i></div>' +
      '<p class="seatnote' + (low || left === 0 ? ' low' : '') + '">' + esc(note) + '</p>';
  }

  function trackChip(b) {
    var t = D.track(b.track);
    if (!t) return '';
    var style = t.accent ? ' style="background:' + esc(t.accent) + '1a;color:' + esc(t.accent) + '"' : '';
    return '<span class="chip chip-track"' + style + '>' + esc(t.name) + '</span>';
  }

  function statusChip(b) {
    var s = b.status || 'open';
    return '<span class="chip chip-' + esc(s) + '">' + esc(D.statusLabel(b)) + '</span>';
  }

  /* The action a batch offers depends on where the candidate already
     stands with it, so the catalogue and My Batches never disagree. */
  function action(b) {
    if (window.MedcityEnrol && MedcityEnrol.has(b.id)) {
      return '<a class="btn btn-ghost btn-sm" href="medcity-my-batches.html">In My Batches →</a>';
    }
    if (!D.isOpen(b)) return '<span class="btn btn-ghost btn-sm" aria-disabled="true" style="opacity:.55">Not enrolling</span>';
    var label = D.isWaitlist(b) ? 'Join waitlist' : 'Enrol';
    return '<button type="button" class="btn btn-primary btn-sm" data-enrol="' + esc(b.id) + '">' + label + '</button>';
  }

  function batchCard(b, o) {
    o = o || {};
    var mine = window.MedcityEnrol && MedcityEnrol.has(b.id);
    var h = '<article class="batch" id="batch-' + esc(b.id) + '">';
    h += '<div class="b-top">' + trackChip(b) + statusChip(b) +
      (mine ? '<span class="chip chip-mine">Enrolled</span>' : '') + '</div>';
    h += '<div class="b-body">';
    h += '<h3>' + esc(b.name) + '</h3>';
    if (b.tagline) h += '<p class="tagline">' + esc(b.tagline) + '</p>';
    h += metaList(b);
    h += seats(b);
    if (o.highlights !== false && b.highlights && b.highlights.length) {
      h += '<ul class="meta" style="margin-top:14px">';
      b.highlights.forEach(function (x) { h += '<li>' + icon('check') + '<span>' + esc(x) + '</span></li>'; });
      h += '</ul>';
    }
    h += '</div>';
    h += '<div class="b-foot">';
    h += '<div class="price">' + esc(D.fee(b)) + (b.feeNote ? '<small>' + esc(b.feeNote) + '</small>' : '') + '</div>';
    h += action(b);
    h += '</div></article>';
    return h;
  }

  /* ---------------------------------------------------------------- */
  /* the identity dialog                                                */

  /* Resolves with the candidate once they are known, or null if the
     candidate closed the dialog. Already-known candidates resolve at once
     without being asked again. */
  function askIdentity(opts) {
    opts = opts || {};
    var known = MedcityEnrol.candidate();
    if (known && !opts.force) return Promise.resolve(known);

    return new Promise(function (resolve) {
      var dim = document.createElement('div');
      dim.className = 'mc-dim';
      dim.innerHTML =
        '<div class="mc-dlg" role="dialog" aria-modal="true" aria-labelledby="mcDlgH">' +
          '<h2 id="mcDlgH">' + (known ? 'Your details' : 'Before you enrol') + '</h2>' +
          '<p>' + (opts.lead || 'MEDCITY Testprep is open to any candidate, so there is no portal login to sign in with. Tell us who you are and the office can hold your seat.') + '</p>' +
          '<div class="fld"><label for="mcName">Full name</label><input id="mcName" autocomplete="name" required></div>' +
          '<div class="two-up">' +
            '<div class="fld"><label for="mcRoll">Register / roll number</label><input id="mcRoll" autocomplete="off" required></div>' +
            '<div class="fld"><label for="mcPhone">Phone</label><input id="mcPhone" type="tel" autocomplete="tel" inputmode="tel" required></div>' +
          '</div>' +
          '<div class="two-up">' +
            '<div class="fld"><label for="mcInst">College <span class="opt">(optional)</span></label><input id="mcInst" autocomplete="organization"></div>' +
            '<div class="fld"><label for="mcMail">Email <span class="opt">(optional)</span></label><input id="mcMail" type="email" autocomplete="email"></div>' +
          '</div>' +
          '<p class="err" id="mcErr" role="alert"></p>' +
          '<p class="consent">Your name, register number and phone are kept in this browser and sent to the Alizon office so it can confirm your seat. Nothing else is collected here, and enrolling does not charge you — the office arranges payment separately.</p>' +
          '<div class="dlg-acts">' +
            '<button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button>' +
            '<button type="button" class="btn btn-primary btn-sm" data-save>' + (known ? 'Save' : 'Continue') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(dim);

      var q = function (id) { return dim.querySelector(id); };
      if (known) {
        q('#mcName').value = known.name || ''; q('#mcRoll').value = known.roll || '';
        q('#mcPhone').value = known.phone || ''; q('#mcInst').value = known.institution || '';
        q('#mcMail').value = known.email || '';
      }
      var errEl = q('#mcErr');
      var prevFocus = document.activeElement;

      function close(v) {
        document.removeEventListener('keydown', onKey, true);
        if (dim.parentNode) dim.parentNode.removeChild(dim);
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
        resolve(v);
      }
      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(null); return; }
        if (e.key !== 'Tab') return;
        /* keep focus inside the dialog while it is open */
        var f = dim.querySelectorAll('input,button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      document.addEventListener('keydown', onKey, true);

      function submit() {
        var d = {
          name: q('#mcName').value, roll: q('#mcRoll').value, phone: q('#mcPhone').value,
          institution: q('#mcInst').value, email: q('#mcMail').value
        };
        var err = MedcityEnrol.validate(d);
        if (err) { errEl.textContent = err; errEl.classList.add('on'); return; }
        errEl.classList.remove('on');
        var btn = q('[data-save]'); btn.disabled = true; btn.textContent = 'Saving…';
        MedcityEnrol.saveCandidate(d).then(function (r) {
          if (!r.ok) {
            btn.disabled = false; btn.textContent = known ? 'Save' : 'Continue';
            errEl.textContent = r.error || 'Something went wrong. Please try again.';
            errEl.classList.add('on');
            return;
          }
          close(MedcityEnrol.candidate());
        });
      }

      q('[data-save]').addEventListener('click', submit);
      q('[data-close]').addEventListener('click', function () { close(null); });
      dim.addEventListener('click', function (e) { if (e.target === dim) close(null); });
      dim.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); submit(); }
      });
      setTimeout(function () { q('#mcName').focus(); }, 30);
    });
  }

  /* ---------------------------------------------------------------- */
  /* the enrol flow                                                     */

  function enrol(batchId) {
    var b = D.batch(batchId);
    if (!b) { toast('That batch is no longer in the catalogue.'); return Promise.resolve(false); }
    if (MedcityEnrol.has(batchId)) { toast('You are already on ' + b.name + '.'); return Promise.resolve(false); }

    return askIdentity().then(function (who) {
      if (!who) return false;
      return MedcityEnrol.join(batchId).then(function (r) {
        if (!r.ok) { toast(r.error || 'That did not go through. Please try again.'); return false; }
        toast(r.status === 'waitlist'
          ? 'You are on the waitlist for ' + b.name + '. The office will call if a seat opens.'
          : 'Enrolled in ' + b.name + '. It is on your My Batches page now.');
        return true;
      });
    });
  }

  /* One delegated listener per page, rather than one per button, so cards
     can be redrawn without rebinding anything. */
  function bindEnrolButtons(root) {
    (root || document).addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-enrol]');
      if (!btn) return;
      e.preventDefault();
      btn.disabled = true;
      enrol(btn.getAttribute('data-enrol')).then(function () { btn.disabled = false; });
    });
  }

  window.MedcityUI = {
    esc: esc, toast: toast, icon: icon,
    metaList: metaList, seats: seats, batchCard: batchCard,
    trackChip: trackChip, statusChip: statusChip,
    askIdentity: askIdentity, enrol: enrol, bindEnrolButtons: bindEnrolButtons
  };
})();
