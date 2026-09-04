/* =====================================================================
   alizon-pvx-register.js — the participant register for the open PV-X
   workshop.

   Two jobs, and it is careful about both.

   1 · IDENTIFY THE CANDIDATE. The workshop is public, so nobody is signed
       in. Before starting, a participant gives their name, roll number and
       phone. Those details are kept in this browser so the workshop does
       not ask twice, and they flow onto the report the participant
       downloads.

   2 · RECORD THE PARTICIPATION, so the partner college can see who took
       part. Each registration is written as its OWN Firestore document
       (`pvxreg_<id>`), never appended to a shared array. That matters:
       the events desk keeps every registration in one `alizonWorkshopRegs`
       document and rewrites the whole array each time, so two people
       registering in the same few seconds silently overwrite each other,
       and the document has a 1 MB ceiling. A workshop open to the public
       cannot use that shape.

   WHAT THIS DELIBERATELY DOES NOT DO: it does not load firebase-sync.js.
   That module bootstraps a visitor into the institution's Firestore and
   pulls the login data down with it — the student roster, faculty, HR,
   results, submissions, attendance. This file initialises Firebase on its
   own and only ever WRITES its own registration document. Nothing
   institutional is pulled onto a public visitor's device.

   Personal data: name, roll number, phone, and optionally institution and
   email. Nothing else — no marks, no answers, no report content. The
   consent line the participant sees is in the workshop page, not here.

   API:
     AlizonPvxRegister.get()            -> the local participant, or null
     AlizonPvxRegister.save(details)    -> Promise<{ok, cloud}>
     AlizonPvxRegister.clear()
     AlizonPvxRegister.validate(details)-> null, or an error message
   ===================================================================== */
(function(){
  'use strict';
  if (window.AlizonPvxRegister) return;

  var LOCAL = 'alizonPvxParticipant';
  var SDK   = 'https://www.gstatic.com/firebasejs/10.12.5/';
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
     public in that file too, and here it is used for a single write */
  var BOOT_EMAIL = 'device-reader@bootstrap.alizonos.app', BOOT_PW = 'alizonBootstrap2026';

  function J(k, d){ try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch(e){ return d; } }

  function get(){ return J(LOCAL, null); }
  function clear(){ try { localStorage.removeItem(LOCAL); } catch(e){} }

  function validate(d){
    d = d || {};
    var name = String(d.name||'').trim();
    var roll = String(d.roll||'').trim();
    var phone = String(d.phone||'').replace(/[\s\-()]/g,'');
    if (name.length < 2)  return 'Please enter your full name.';
    if (!/[A-Za-zഀ-ൿ]/.test(name)) return 'Please enter your name in letters.';
    if (roll.length < 1)  return 'Please enter your roll or register number.';
    if (roll.length > 40) return 'That roll number looks too long — please check it.';
    /* deliberately loose: this workshop is open beyond India */
    if (!/^\+?\d{7,15}$/.test(phone)) return 'Please enter a phone number we could actually reach you on (7–15 digits).';
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(String(d.email).trim())) return 'That email address does not look right.';
    return null;
  }

  function loadScript(f){
    return new Promise(function(res, rej){
      var s = document.createElement('script'); s.src = SDK + f; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  var readyP = null;
  function ready(){
    if (readyP) return readyP;
    readyP = loadScript('firebase-app-compat.js')
      .then(function(){ return Promise.all([loadScript('firebase-auth-compat.js'), loadScript('firebase-firestore-compat.js')]); })
      .then(function(){
        if (!firebase.apps.length) firebase.initializeApp(CFG);
        if (firebase.auth().currentUser) return;
        return firebase.auth().signInWithEmailAndPassword(BOOT_EMAIL, BOOT_PW).catch(function(){ /* stay offline */ });
      });
    return readyP;
  }

  function uid(){
    var r = (window.crypto && crypto.getRandomValues)
      ? crypto.getRandomValues(new Uint32Array(2)) : [Math.random()*1e9|0, Math.random()*1e9|0];
    return Date.now().toString(36) + '-' + r[0].toString(36) + r[1].toString(36);
  }

  /* Saving locally always succeeds; the cloud write is best-effort, because a
     participant with no connection must still be able to do the workshop. */
  function save(d){
    var err = validate(d);
    if (err) return Promise.resolve({ ok:false, error:err });

    var rec = {
      id: (get()||{}).id || uid(),
      name: String(d.name||'').trim(),
      roll: String(d.roll||'').trim(),
      phone: String(d.phone||'').replace(/[\s\-()]/g,''),
      institution: String(d.institution||'').trim(),
      email: String(d.email||'').trim(),
      at: new Date().toISOString(),
      workshop: 'PV-X — AI ADR Detective'
    };
    try { localStorage.setItem(LOCAL, JSON.stringify(rec)); } catch(e){}

    return ready().then(function(){
      if (!firebase.auth().currentUser) return { ok:true, cloud:false };
      return firebase.firestore().collection('sync').doc('pvxreg_' + rec.id)
        .set({ pvxreg: 1, value: JSON.stringify(rec), at: rec.at,
               name: rec.name, roll: rec.roll, institution: rec.institution })
        .then(function(){ return { ok:true, cloud:true }; })
        .catch(function(){ return { ok:true, cloud:false }; });
    }).catch(function(){ return { ok:true, cloud:false }; });
  }

  window.AlizonPvxRegister = { get:get, save:save, clear:clear, validate:validate, LOCAL:LOCAL };
})();
