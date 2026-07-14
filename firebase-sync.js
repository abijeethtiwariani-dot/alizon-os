/* ============================================================
   ALIZON OS — Firebase Firestore sync
   Mirrors the shared institutional data (courses, students,
   submissions, fees, faculty, grievances, schedules, HR,
   staff messages, activity) between each browser's localStorage
   and a cloud Firestore database — so data is backed up and
   syncs across every device. Per-device settings stay local.
   ============================================================ */
(function(){
  if (window.__alizonFB) return; window.__alizonFB = 1;

  var CFG = {
    apiKey: "AIzaSyBH3mnYAwaFHJ_jo0mQ0Ohw4WxyYdZBe90",
    authDomain: "alizon-os-7a17d.firebaseapp.com",
    projectId: "alizon-os-7a17d",
    storageBucket: "alizon-os-7a17d.firebasestorage.app",
    messagingSenderId: "728863144429",
    appId: "1:728863144429:web:8939b7d234754cb0534fe4"
  };

  var KEYS = ['alizonPrograms','alizonStudents','alizonSubmissions','alizonGrievances',
    'alizonFees','alizonFaculty','alizonSchedule','alizonLinks','alizonActivity',
    'alizonHR','alizonStaffReqs','alizonStaffMsgs','alizonStaffMeta'];
  var KEYSET = {}; KEYS.forEach(function(k){ KEYSET[k] = 1; });

  var SDK = 'https://www.gstatic.com/firebasejs/10.12.5/';
  function load(f){ return new Promise(function(res,rej){
    var s = document.createElement('script'); s.src = SDK+f; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  }); }

  var origSet = localStorage.setItem.bind(localStorage);
  var origRemove = localStorage.removeItem.bind(localStorage);
  var lastSeen = {}, pushTimers = {}, seeded = {};
  var firstSeen = {}, initialChanged = false, initialDone = false;
  var db = null, ready = false;

  /* mirror shared writes up to the cloud (debounced) */
  localStorage.setItem = function(key, val){
    origSet(key, val);
    if (ready && KEYSET[key] && val !== lastSeen[key]) schedulePush(key, val);
  };
  localStorage.removeItem = function(key){
    origRemove(key);
    if (ready && KEYSET[key]) schedulePush(key, '[]');
  };
  function schedulePush(key, val){
    clearTimeout(pushTimers[key]);
    pushTimers[key] = setTimeout(function(){
      lastSeen[key] = val;
      db.collection('sync').doc(key).set({
        value: val, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function(e){ console.warn('[alizon-fb] push failed', key, e && e.message); });
    }, 700);
  }

  /* reload only when it's safe — never mid-typing, mid-overlay, or in a tight loop */
  function canReload(){
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return false;
    if (document.querySelector('.open, #docView.open, #practical.open, #subViewer.open, #moduleDetail.open')) return false;
    var now = Date.now(), last = +(sessionStorage.getItem('__fbReloadAt') || 0);
    return now - last > 12000;
  }
  function doReload(){ sessionStorage.setItem('__fbReloadAt', String(Date.now())); location.reload(); }

  /* after the first snapshot of every key arrives, refresh once if anything changed */
  function maybeInitialReload(){
    if (initialDone) return;
    for (var i=0;i<KEYS.length;i++){ if(!firstSeen[KEYS[i]]) return; }
    initialDone = true;
    if (initialChanged && sessionStorage.getItem('__fbSynced') !== '1' && canReload()){
      sessionStorage.setItem('__fbSynced','1'); doReload();
    } else {
      sessionStorage.setItem('__fbSynced','1');
    }
  }

  load('firebase-app-compat.js')
    .then(function(){ return load('firebase-firestore-compat.js'); })
    .then(function(){
      firebase.initializeApp(CFG);
      db = firebase.firestore();
      ready = true;
      KEYS.forEach(function(key){
        db.collection('sync').doc(key).onSnapshot(function(doc){
          var isFirst = !firstSeen[key]; firstSeen[key] = true;
          if (!doc.exists){
            var local = localStorage.getItem(key);
            if (local && local !== '[]' && local !== '{}' && !seeded[key]){
              seeded[key] = true; lastSeen[key] = local;
              db.collection('sync').doc(key).set({ value: local,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(function(){});
            }
            if (isFirst) maybeInitialReload();
            return;
          }
          var remote = doc.data().value;
          if (typeof remote === 'string' && remote !== localStorage.getItem(key)){
            lastSeen[key] = remote; origSet(key, remote);
            if (isFirst) initialChanged = true;
            else if (canReload()) doReload();   /* live update from another device */
          }
          if (isFirst) maybeInitialReload();
        }, function(err){
          firstSeen[key] = true;
          if (err) console.warn('[alizon-fb] listen error', key, err.code || err.message);
          maybeInitialReload();
        });
      });
      console.log('[alizon-fb] connected to project alizon-os-7a17d');
    })
    .catch(function(e){ console.warn('[alizon-fb] init failed', e && e.message); });
})();
