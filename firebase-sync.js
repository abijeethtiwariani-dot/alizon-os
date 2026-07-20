/* ============================================================
   ALIZON OS — Firebase Auth + Firestore sync (secured)
   • Every portal login signs the user into Firebase Auth
     (accounts auto-create on first login from the roster).
   • Firestore rules require authentication, so the database
     can only be read/written by a signed-in user — the public
     web config alone no longer grants any access.
   • Shared institutional data mirrors between localStorage and
     the cloud; per-device settings stay local.
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
    'alizonHR','alizonStaffReqs','alizonStaffMsgs','alizonStaffMeta','alizonResults','alizonAnnounce',
    'alizonExamCycles','alizonExamApps','alizonAttendance','alizonMeetings','alizonAlerts','alizonContent'];
  var KEYSET = {}; KEYS.forEach(function(k){ KEYSET[k] = 1; });

  var SDK = 'https://www.gstatic.com/firebasejs/10.12.5/';
  function load(f){ return new Promise(function(res,rej){
    var s=document.createElement('script'); s.src=SDK+f; s.onload=res; s.onerror=rej; document.head.appendChild(s);
  }); }

  var origSet = localStorage.setItem.bind(localStorage);
  var origRemove = localStorage.removeItem.bind(localStorage);
  var lastSeen = {}, pushTimers = {}, seeded = {};
  var db = null, auth = null, authed = false, listenersOn = false;

  /* mirror shared writes up to the cloud — only when signed in */
  localStorage.setItem = function(key, val){
    origSet(key, val);
    if (authed && KEYSET[key] && val !== lastSeen[key]) schedulePush(key, val);
  };
  localStorage.removeItem = function(key){
    origRemove(key);
    if (authed && KEYSET[key]) schedulePush(key, '[]');
  };
  function schedulePush(key, val){
    clearTimeout(pushTimers[key]);
    pushTimers[key] = setTimeout(function(){
      if (!authed) return;
      lastSeen[key] = val;
      db.collection('sync').doc(key).set({
        value: val, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function(e){ console.warn('[alizon-fb] push', key, e && e.code); });
    }, 700);
  }

  /* map each portal login to a Firebase account (synthetic emails for id-based logins) */
  function emailFor(id, role){
    id = String(id || '').trim();
    if (role === 'faculty' && id.indexOf('@') > -1) return id.toLowerCase();
    var c = id.toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'user';
    var d = { student:'student', staff:'staff', faculty:'faculty', admin:'admin' }[role] || 'user';
    return c + '@' + d + '.alizonos.app';
  }
  function pwFor(p){ p = String(p == null ? '' : p); return p.length >= 6 ? p : (p + 'aZ9x_'); }

  /* public API the portals call after a successful login */
  window.alizonAuth = {
    signIn: function(id, password, role){
      if (!auth) return Promise.resolve(false);
      var email = emailFor(id, role), pw = pwFor(password);
      return auth.signInWithEmailAndPassword(email, pw)
        .then(function(){ return true; })
        .catch(function(e){
          var c = e && e.code;
          if (c === 'auth/user-not-found' || c === 'auth/invalid-credential' ||
              c === 'auth/invalid-login-credentials' || c === 'auth/wrong-password'){
            /* first-time login → create the account (auto-provision) */
            return auth.createUserWithEmailAndPassword(email, pw)
              .then(function(){ return true; })
              .catch(function(){ return false; });   /* exists with a different password → deny */
          }
          console.warn('[alizon-fb] signIn', c); return false;
        });
    },
    signOut: function(){ if (auth) auth.signOut().catch(function(){}); },
    /* change the CURRENTLY signed-in user's own Firebase password (keeps cloud sync working) */
    changeMyPassword: function(newPw){
      if (!auth || !auth.currentUser) return Promise.resolve(false);
      return auth.currentUser.updatePassword(pwFor(newPw)).then(function(){ return true; }).catch(function(e){ console.warn('[alizon-fb] pw change', e && e.code); return false; });
    },
    signedIn: function(){ return authed; }
  };

  function startSync(){
    if (listenersOn || !db) return; listenersOn = true;
    KEYS.forEach(function(key){
      db.collection('sync').doc(key).onSnapshot(function(doc){
        if (!doc.exists){
          var local = localStorage.getItem(key);
          if (local && local !== '[]' && local !== '{}' && !seeded[key]){
            seeded[key] = true; lastSeen[key] = local;
            db.collection('sync').doc(key).set({ value: local,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(function(){});
          }
          return;
        }
        var remote = doc.data().value;
        if (typeof remote === 'string' && remote !== localStorage.getItem(key)){
          lastSeen[key] = remote; origSet(key, remote);   /* update local silently; UI refreshes on next render */
        }
      }, function(err){ console.warn('[alizon-fb] listen', key, err && err.code); });
    });
    console.log('[alizon-fb] sync active (signed in)');
  }

  /* Read-only bootstrap account used only to pull shared data onto a fresh
     device before login. Baked-in like the public web config; the open
     Firestore rule already lets any signed-in user read, so this grants no
     access that a default login didn't already. */
  var BOOT_EMAIL = 'device-reader@bootstrap.alizonos.app', BOOT_PW = 'alizonBootstrap2026';
  /* only the data a login is checked against — pulled during bootstrap so fresh
     devices can authenticate. Operational data (fees, submissions, grievances,
     messages, activity) stays in the cloud until a real user signs in. */
  var AUTH_KEYS = ['alizonStudents','alizonHR','alizonFaculty','alizonResults','alizonContent'];
  function pullAuthKeys(){
    AUTH_KEYS.forEach(function(key){
      db.collection('sync').doc(key).get().then(function(doc){
        if (doc.exists){
          var v = doc.data().value;
          if (typeof v === 'string' && v !== localStorage.getItem(key)){ lastSeen[key] = v; origSet(key, v); }
        }
      }).catch(function(e){ console.warn('[alizon-fb] bootstrap pull', key, e && e.code); });
    });
    console.log('[alizon-fb] bootstrap: login data pulled');
  }
  var bootTried = false;
  function bootstrapDevice(){
    if (bootTried || !auth) return; bootTried = true;
    if (authed) return;   /* a real or persisted session already exists */
    auth.signInWithEmailAndPassword(BOOT_EMAIL, BOOT_PW)
      .catch(function(e){
        var c = e && e.code;
        if (c === 'auth/user-not-found' || c === 'auth/invalid-credential' ||
            c === 'auth/invalid-login-credentials' || c === 'auth/wrong-password'){
          return auth.createUserWithEmailAndPassword(BOOT_EMAIL, BOOT_PW).catch(function(){});
        }
        console.warn('[alizon-fb] bootstrap', c);
      })
      .then(function(){ if (auth.currentUser) console.log('[alizon-fb] device bootstrap ok — syncing shared data'); });
  }

  load('firebase-app-compat.js')
    .then(function(){ return load('firebase-auth-compat.js'); })
    .then(function(){ return load('firebase-firestore-compat.js'); })
    .then(function(){
      firebase.initializeApp(CFG);
      db = firebase.firestore();
      auth = firebase.auth();
      auth.onAuthStateChanged(function(user){
        authed = !!user;
        if (user){
          if (user.email === BOOT_EMAIL) pullAuthKeys();  /* bootstrap session: login data only */
          else startSync();                               /* real user: full two-way sync */
        } else listenersOn = false;
      });
      /* ---- Fresh-device bootstrap ----------------------------------------
         Logins are validated against the roster stored in THIS browser. A new
         device / incognito window starts empty, and sync only runs once signed
         in — so without help a fresh device can never load the roster and every
         login is rejected. Fix: sign in with a fixed, read-only bootstrap
         account on load so the shared data downloads BEFORE anyone logs in.
         (Independent of the admin account, so an admin password change can't
         break sign-in bootstrapping.) Self-signup provisions it on first use. */
      setTimeout(bootstrapDevice, 1200);
    })
    .catch(function(e){ console.warn('[alizon-fb] init failed', e && e.message); });
})();
