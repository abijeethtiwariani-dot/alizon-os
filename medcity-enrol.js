/* =====================================================================
   medcity-enrol.js — who the candidate is, and which MEDCITY Testprep
   batches they have joined.

   MEDCITY Testprep is open beyond Alizon: a candidate sitting GPAT or
   NORCET does not have a student portal login, so this module carries its
   own lightweight identity rather than borrowing the portal's.

   Two jobs.

   1 · IDENTIFY THE CANDIDATE. Name, register or roll number, and a phone
       number the office can reach them on. Kept in this browser so the
       section does not ask twice, and carried onto every enrolment.

   2 · RECORD EACH ENROLMENT as its OWN Firestore document, keyed
       `medcityenrol_<candidate>_<batch>`. Never appended to a shared
       array — the events desk does that for workshop registrations and it
       has two faults a public enrolment cannot live with: two candidates
       enrolling in the same few seconds silently overwrite each other,
       and one document has a 1 MB ceiling. Keying on candidate AND batch
       also makes the write idempotent, so a double-tapped Enrol button
       produces one seat, not two.

   WHAT THIS DELIBERATELY DOES NOT DO — the same line alizon-pvx-register.js
   draws: it does not load firebase-sync.js. That module bootstraps a
   visitor into the institution's Firestore and pulls the login data down
   with it — the student roster, faculty, HR, results, submissions,
   attendance. This file initialises Firebase on its own and only ever
   WRITES its own enrolment documents. Nothing institutional is pulled onto
   a public candidate's device.

   Personal data: name, roll number, phone, and optionally institution and
   email, plus which batches they joined and when. Nothing else — no marks,
   no answers. The consent line the candidate sees lives in the page, not
   here.

   Everything works offline. The cloud write is best-effort throughout,
   because a candidate on a bad connection must still be able to enrol;
   the local record is the one the pages read.

   API:
     MedcityEnrol.candidate()          -> the local candidate, or null
     MedcityEnrol.validate(details)    -> null, or an error message
     MedcityEnrol.saveCandidate(d)     -> Promise<{ok, error?, cloud}>
     MedcityEnrol.signOut()            -> forgets candidate AND enrolments
     MedcityEnrol.list()               -> [{batchId, at, status}], newest first
     MedcityEnrol.has(batchId)         -> boolean
     MedcityEnrol.get(batchId)         -> the enrolment, or null
     MedcityEnrol.join(batchId, opts)  -> Promise<{ok, error?, cloud, status}>
     MedcityEnrol.leave(batchId)       -> Promise<{ok, cloud}>
     MedcityEnrol.onChange(fn)         -> unsubscribe fn
   ===================================================================== */
(function () {
  'use strict';
  if (window.MedcityEnrol) return;

  var K_WHO = 'alizonMedcityCandidate';
  var K_ENROL = 'alizonMedcityEnrolments';

  var SDK = 'https://www.gstatic.com/firebasejs/10.12.5/';
  /* the same project firebase-sync.js uses — keep these in step with it */
  var CFG = {
    apiKey: "AIzaSyBH3mnYAwaFHJ_jo0mQ0Ohw4WxyYdZBe90",
    authDomain: "alizon-os-7a17d.firebaseapp.com",
    projectId: "alizon-os-7a17d",
    storageBucket: "alizon-os-7a17d.firebasestorage.app",
    messagingSenderId: "728863144429",
    appId: "1:728863144429:web:8939b7d234754cb0534fe4"
  };
  /* the same read-only device account firebase-sync.js already uses; it is
     public in that file too, and here it is used only for these writes */
  var BOOT_EMAIL = 'device-reader@bootstrap.alizonos.app', BOOT_PW = 'alizonBootstrap2026';

  function J(k, d) {
    try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }
    catch (e) { return d; }
  }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------------------------------------------------------------- */
  /* listeners — the pages redraw themselves rather than being told what
     to redraw, so a single "something changed" signal is enough          */
  var subs = [];
  function onChange(fn) {
    if (typeof fn !== 'function') return function () {};
    subs.push(fn);
    return function () { var i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); };
  }
  function fire() { subs.slice().forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* Another tab enrolling counts as a change here too. */
  window.addEventListener('storage', function (e) {
    if (e && (e.key === K_ENROL || e.key === K_WHO)) fire();
  });

  /* ---------------------------------------------------------------- */
  /* the candidate                                                      */

  function candidate() { return J(K_WHO, null); }

  function validate(d) {
    d = d || {};
    var name = String(d.name || '').trim();
    var roll = String(d.roll || '').trim();
    var phone = String(d.phone || '').replace(/[\s\-()]/g, '');
    if (name.length < 2) return 'Please enter your full name.';
    if (!/[A-Za-zഀ-ൿ]/.test(name)) return 'Please enter your name in letters.';
    if (roll.length < 1) return 'Please enter your register or roll number.';
    if (roll.length > 40) return 'That register number looks too long — please check it.';
    /* deliberately loose: these exams draw candidates from outside India */
    if (!/^\+?\d{7,15}$/.test(phone)) return 'Please enter a phone number the office could actually reach you on (7–15 digits).';
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(String(d.email).trim()))
      return 'That email address does not look right.';
    return null;
  }

  function uid() {
    var r = (window.crypto && crypto.getRandomValues)
      ? crypto.getRandomValues(new Uint32Array(2))
      : [Math.random() * 1e9 | 0, Math.random() * 1e9 | 0];
    return Date.now().toString(36) + '-' + r[0].toString(36) + r[1].toString(36);
  }

  function saveCandidate(d) {
    var err = validate(d);
    if (err) return Promise.resolve({ ok: false, error: err });

    var prev = candidate();
    var rec = {
      id: (prev && prev.id) || uid(),
      name: String(d.name || '').trim(),
      roll: String(d.roll || '').trim(),
      phone: String(d.phone || '').replace(/[\s\-()]/g, ''),
      institution: String(d.institution || '').trim(),
      email: String(d.email || '').trim(),
      at: new Date().toISOString()
    };
    put(K_WHO, rec);
    fire();

    return ready().then(function () {
      if (!signedIn()) return { ok: true, cloud: false };
      return db().collection('sync').doc('medcitycand_' + rec.id)
        .set({
          medcitycand: 1, value: JSON.stringify(rec), at: rec.at,
          name: rec.name, roll: rec.roll, phone: rec.phone,
          institution: rec.institution, email: rec.email
        })
        .then(function () { return { ok: true, cloud: true }; })
        .catch(function () { return { ok: true, cloud: false }; });
    }).catch(function () { return { ok: true, cloud: false }; });
  }

  /* Signing out forgets the enrolments too. They belong to the candidate,
     and leaving them behind would show the next person on a shared
     college machine somebody else's batches. The cloud record stays —
     that is the office's copy of a real enrolment, not this browser's. */
  function signOut() {
    try { localStorage.removeItem(K_WHO); localStorage.removeItem(K_ENROL); } catch (e) {}
    fire();
  }

  /* ---------------------------------------------------------------- */
  /* enrolments                                                         */

  function list() {
    var a = J(K_ENROL, []);
    if (!Array.isArray(a)) return [];
    return a.filter(function (e) { return e && e.batchId; })
            .sort(function (x, y) { return String(y.at || '').localeCompare(String(x.at || '')); });
  }
  function get(batchId) {
    var a = list();
    for (var i = 0; i < a.length; i++) if (a[i].batchId === batchId) return a[i];
    return null;
  }
  function has(batchId) { return !!get(batchId); }

  function join(batchId, opts) {
    opts = opts || {};
    var who = candidate();
    if (!who) return Promise.resolve({ ok: false, error: 'Please enter your details first.' });
    if (!batchId) return Promise.resolve({ ok: false, error: 'No batch was chosen.' });

    var D = window.MedcityData;
    var b = D ? D.batch(batchId) : null;
    if (D && !b) return Promise.resolve({ ok: false, error: 'That batch is no longer in the catalogue.' });
    if (b && D && !D.isOpen(b)) return Promise.resolve({ ok: false, error: 'This batch is not taking enrolments.' });

    /* A batch with no seats left still takes names — in order. The page
       tells the candidate which of the two happened. */
    var status = (b && D && D.isWaitlist(b)) ? 'waitlist' : 'enrolled';

    var existing = get(batchId);
    if (existing) return Promise.resolve({ ok: true, cloud: false, status: existing.status, already: true });

    var rec = {
      batchId: batchId,
      batchName: (b && b.name) || batchId,
      track: (b && b.track) || '',
      status: status,
      at: new Date().toISOString()
    };
    var all = list(); all.unshift(rec); put(K_ENROL, all);
    fire();

    return ready().then(function () {
      if (!signedIn()) return { ok: true, cloud: false, status: status };
      return db().collection('sync').doc('medcityenrol_' + who.id + '_' + batchId)
        .set({
          medcityenrol: 1, value: JSON.stringify(rec), at: rec.at,
          candidate: who.id, name: who.name, roll: who.roll, phone: who.phone,
          institution: who.institution, email: who.email,
          batchId: batchId, batchName: rec.batchName, track: rec.track, status: status
        })
        .then(function () { return { ok: true, cloud: true, status: status }; })
        .catch(function () { return { ok: true, cloud: false, status: status }; });
    }).catch(function () { return { ok: true, cloud: false, status: status }; });
  }

  /* Leaving marks the office's copy withdrawn rather than deleting it —
     a seat that was held and released is something the office needs to
     see. Locally it simply goes. */
  function leave(batchId) {
    var who = candidate();
    var all = list().filter(function (e) { return e.batchId !== batchId; });
    put(K_ENROL, all);
    fire();

    if (!who) return Promise.resolve({ ok: true, cloud: false });
    return ready().then(function () {
      if (!signedIn()) return { ok: true, cloud: false };
      return db().collection('sync').doc('medcityenrol_' + who.id + '_' + batchId)
        .set({ status: 'withdrawn', withdrawnAt: new Date().toISOString() }, { merge: true })
        .then(function () { return { ok: true, cloud: true }; })
        .catch(function () { return { ok: true, cloud: false }; });
    }).catch(function () { return { ok: true, cloud: false }; });
  }

  /* ---------------------------------------------------------------- */
  /* firebase, loaded lazily and never allowed to block the page        */

  function loadScript(f) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = SDK + f; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  var readyP = null;
  function ready() {
    if (readyP) return readyP;
    readyP = loadScript('firebase-app-compat.js')
      .then(function () {
        return Promise.all([loadScript('firebase-auth-compat.js'), loadScript('firebase-firestore-compat.js')]);
      })
      .then(function () {
        if (!firebase.apps.length) firebase.initializeApp(CFG);
        if (firebase.auth().currentUser) return;
        return firebase.auth().signInWithEmailAndPassword(BOOT_EMAIL, BOOT_PW)
          .catch(function () { /* stay offline */ });
      });
    return readyP;
  }
  function signedIn() {
    try { return !!(window.firebase && firebase.auth && firebase.auth().currentUser); }
    catch (e) { return false; }
  }
  function db() { return firebase.firestore(); }

  window.MedcityEnrol = {
    candidate: candidate, validate: validate, saveCandidate: saveCandidate, signOut: signOut,
    list: list, get: get, has: has, join: join, leave: leave, onChange: onChange,
    K_WHO: K_WHO, K_ENROL: K_ENROL
  };
})();
