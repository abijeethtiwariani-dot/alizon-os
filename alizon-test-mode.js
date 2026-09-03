/* =====================================================================
   alizon-test-mode.js — the staff test account.

   Why this exists: staff had no way to open a practical and check it.
   Signing in as `admin` on the dashboard let you into the portal but wrote
   no student profile, so alizon-lab-gate.js saw nobody signed in and
   blocked every practical with "Student access only". The only way to test
   a lab was to sign in as a real student, which pollutes that student's
   submissions and attendance.

   Test mode fixes that. It:
     · opens every practical in every programme, ignoring the enrolment lock;
     · writes NOTHING to institutional data — no submission, no attendance,
       no result, no exam attempt. A test run cannot corrupt a real record;
     · is visible on screen the whole time, so a test view is never mistaken
       for what a student actually sees;
     · stashes any real profile on the device and puts it back on exit.

   It lives in localStorage rather than sessionStorage on purpose: staff open
   practicals in new tabs, and a sessionStorage flag does not survive that.

   ---------------------------------------------------------------------
   SECURITY, PLAINLY: this is a static site. The credential below is in a
   file anyone can read, so treat it as a convenience, not as a secret. It
   is safe to have precisely because test mode is READ-ONLY against
   institutional data and cannot reach the admin portal, the student roster,
   HR or results — those keep their own passwords. Change CRED below at any
   time; nothing else needs editing.
   ===================================================================== */
(function(){
  'use strict';
  if (window.AlizonTest) return;

  var CRED = { user: 'test', pass: 'test' };      /* <-- change here, and nowhere else */

  var KEY   = 'alizonTestMode';        /* '1' while test mode is on          */
  var STASH = 'alizonProfileBeforeTest';
  var PROFILE = {
    name: 'Test Account', reg: 'TEST', sem: '', email: '', dob: '', batch: 'Test',
    course: '', test: true
  };

  function lget(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function lset(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function ldel(k){ try { localStorage.removeItem(k); } catch(e){} }

  function isOn(){ return lget(KEY) === '1'; }

  /* Does this id/password pair open test mode? Case-insensitive on the id.
     `admin`/`admin123` keeps working and now also opens practicals — that
     was always the intent of the master login. */
  function matches(id, pw){
    var u = String(id||'').trim().toLowerCase();
    if (u === CRED.user && String(pw) === CRED.pass) return 'test';
    if (u === 'admin' && String(pw) === 'admin123') return 'admin';
    return null;
  }

  function start(kind){
    /* keep whatever real profile is on this device, so exiting restores it */
    var cur = lget('alizonProfile');
    if (cur && !isOn()) lset(STASH, cur);
    var p = JSON.parse(JSON.stringify(PROFILE));
    if (kind === 'admin') { p.name = 'Administrator (test)'; p.reg = 'ADMIN-TEST'; }
    lset('alizonProfile', JSON.stringify(p));
    lset(KEY, '1');
    ribbon();
    return p;
  }

  function stop(reload){
    ldel(KEY);
    var prev = lget(STASH);
    if (prev) { lset('alizonProfile', prev); ldel(STASH); }
    else ldel('alizonProfile');
    var r = document.querySelector('[data-alizon-test-ribbon]');
    if (r && r.parentNode) r.parentNode.removeChild(r);
    if (reload !== false) location.reload();
  }

  /* ---- the guard every institutional write must ask ------------------- */
  /* Returns true when the write should be SKIPPED. Callers report the skip
     to the user rather than failing silently — a tester who thinks their
     submission was filed and finds nothing is worse off than one who is
     told plainly that test mode files nothing. */
  function blocks(what){
    if (!isOn()) return false;
    try { console.info('[ALIZON test mode] not writing ' + (what||'institutional data')); } catch(e){}
    return true;
  }

  /* ---- the ribbon ----------------------------------------------------- */
  function ribbon(){
    if (!isOn()) return;
    if (document.querySelector('[data-alizon-test-ribbon]')) return;
    function paint(){
      if (!document.body || document.querySelector('[data-alizon-test-ribbon]')) return;
      var d = document.createElement('div');
      d.setAttribute('data-alizon-test-ribbon','1');
      d.style.cssText =
        'position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;gap:10px;'+
        'background:#7c2d12;color:#fff;border:1px solid #c2410c;border-radius:100px;padding:7px 8px 7px 15px;'+
        'font:600 12px/1 -apple-system,Segoe UI,Roboto,Arial,sans-serif;box-shadow:0 8px 24px -10px rgba(0,0,0,.6)';
      d.innerHTML =
        '<span style="letter-spacing:.09em">TEST MODE — nothing is saved</span>'+
        '<button type="button" style="font:700 11px/1 inherit;cursor:pointer;border:0;border-radius:100px;'+
        'padding:6px 12px;background:#fff;color:#7c2d12">Exit</button>';
      d.querySelector('button').addEventListener('click', function(){ stop(true); });
      document.body.appendChild(d);
      var st = document.createElement('style');
      st.textContent = '@media print{[data-alizon-test-ribbon]{display:none!important}}';
      document.head.appendChild(st);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
    else paint();
  }

  window.AlizonTest = {
    isOn: isOn, matches: matches, start: start, stop: stop,
    blocks: blocks, ribbon: ribbon, credential: function(){ return { user: CRED.user }; }
  };
  ribbon();                       /* every page that includes this file shows it */
})();
