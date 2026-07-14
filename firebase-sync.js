/* ============================================================
   ALIZON OS — Firebase Firestore sync
   Keeps the shared institutional data (courses, students,
   submissions, fees, faculty, grievances, schedules, HR,
   staff messages, activity) mirrored between each browser's
   localStorage and a cloud Firestore database, so data is
   backed up and syncs across every device.
   Per-device settings (theme, login session, prefs) stay local.
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

  /* shared keys that sync to the cloud (everything institution-wide) */
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
  var lastSeen = {};          /* key -> value string last pushed or pulled (echo-loop guard) */
  var pushTimers = {};
  var seeded = {};
  var db = null, ready = false;

  /* --- intercept writes: mirror shared keys up to Firestore --- */
  localStorage.setItem = function(key, val){
    origSet(key, val);
    if (ready && KEYSET[key] && val !== lastSeen[key]) schedulePush(key, val);
  };
  localStorage.removeItem = function(key){
    origRemove(key);
    if (ready && KEYSET[key]) schedulePush(key, '[]');  /* clearing propagates as empty */
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

  /* --- reflect an incoming remote change into the running page --- */
  function refresh(){
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;      /* don't interrupt typing */
    if (document.querySelector('.open, #docView.open, #practical.open, #subViewer.open, #moduleDetail.open')) return; /* don't interrupt an open overlay */
    var now = Date.now(), last = +(sessionStorage.getItem('__fbReload') || 0);
    if (now - last > 5000){ sessionStorage.setItem('__fbReload', String(now)); location.reload(); }
  }

  load('firebase-app-compat.js')
    .then(function(){ return load('firebase-firestore-compat.js'); })
    .then(function(){
      firebase.initializeApp(CFG);
      db = firebase.firestore();
      ready = true;
      KEYS.forEach(function(key){
        db.collection('sync').doc(key).onSnapshot(function(doc){
          if (!doc.exists){
            /* cloud has nothing for this key yet — seed it from this device if we have data */
            var local = localStorage.getItem(key);
            if (local && local !== '[]' && local !== '{}' && !seeded[key]){
              seeded[key] = true; lastSeen[key] = local;
              db.collection('sync').doc(key).set({
                value: local, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }).catch(function(){});
            }
            return;
          }
          var remote = doc.data().value;
          if (typeof remote !== 'string' || remote === localStorage.getItem(key)) return;
          lastSeen[key] = remote;
          origSet(key, remote);           /* update local copy without re-triggering a push */
          refresh();                      /* show the fresh data (guarded) */
        }, function(err){ console.warn('[alizon-fb] listen error', key, err && err.message); });
      });
      console.log('[alizon-fb] connected to project alizon-os-7a17d');
    })
    .catch(function(e){ console.warn('[alizon-fb] init failed', e && e.message); });
})();
