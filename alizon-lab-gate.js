/* ALIZON OS — practical/lab access gate.
   Include on every ALIZON-OS-Module*.html / lab page:
     <script src="alizon-lab-gate.js"></script>

   Two things it enforces, in order:
     1. only a signed-in student, faculty member or admin may open a practical;
     2. a student may only open a practical that belongs to THEIR programme.

   (2) is new. The gate used to ask nothing but "is some student signed in", so
   a Pharmacy student could type the URL of any Hospital Administration lab and
   work it — and `?admin=1` in the query string turned the gate off completely
   with no password, which meant anyone at all could read any practical.

   Ownership comes from alizonPrograms: a file is "owned" by every programme
   that lists it as a module href or a practical href. A file no programme
   claims — the Enterprise EHR simulators, the Clinical Simulation Suite — is
   deliberately cross-programme and stays open to every student.

   This is a soft client-side gate on a static site. It pairs with the portal
   login and raises the floor; it is not a substitute for server-side authz.

   NOTE: the programme-resolution order below is deliberately identical to
   programmeForStudent() in ASMDI-dashboard.html. The labs do not load that
   file, so the logic is duplicated here on purpose — change both together. */
(function () {
  'use strict';
  var LOGIN = 'ASMDI-dashboard.html';
  function get(k, d){ try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function sess(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } }

  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  function fileKey(h){
    return String(h || '').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
  }

  /* ---- who is this? ---------------------------------------------------- */
  /* An admin session is set by the admin portal after a password check. It is
     NOT settable from the URL any more. */
  var isAdmin   = sess('alizonAdminAuth') === '1';
  var isFaculty = !!sess('alizonFacultyAuth');
  var prof      = get('alizonProfile', null);
  var isStudent = !!(prof && (prof.reg || prof.name));

  if (isAdmin || isFaculty) return;                 /* staff see everything */
  if (!isStudent) return block(
    'Student access only',
    'This practical is available to logged-in Alizon students. Please sign in to the ALIZON OS portal to continue.');

  /* ---- which programmes claim this file? -------------------------------- */
  var programs = get('alizonPrograms', []);
  if (!Array.isArray(programs) || !programs.length) return;   /* nothing to check against */

  var owners = programs.filter(function (p) {
    if (!p || !Array.isArray(p.modules)) return false;
    return p.modules.some(function (m) {
      if (!m) return false;
      if (fileKey(m.href) === file) return true;
      return Array.isArray(m.practicals) && m.practicals.some(function (pr) {
        return pr && fileKey(pr.href) === file;
      });
    });
  });
  if (!owners.length) return;                        /* cross-programme lab */

  /* an admin may open a lab to everyone by listing it in alizonLabAccess */
  var open = get('alizonLabAccess', []);
  if (Array.isArray(open) && open.some(function (x) { return fileKey(x) === file; })) return;

  /* ---- which programme is this student enrolled in? --------------------- */
  var HINTS = [
    { id:'hospital',    re:/hospital\s*admin/i },
    { id:'paramedical', re:/paramedical/i },
    { id:'stockmarket', re:/stock\s*market|investment\s*analytic/i },
    { id:'pharmacy',    re:/pharmac/i },
    { id:'medical',     re:/\bmedicine\b|\bmedical\b/i }
  ];
  function mine() {
    var explicit = String((prof && (prof.programId || prof.programme || prof.program)) || '').trim();
    if (explicit && programs.some(function (p) { return p && p.id === explicit; })) return explicit;
    var course = String((prof && prof.course) || '').trim();
    if (!course) return null;
    var lc = course.toLowerCase(), i;
    for (i = 0; i < programs.length; i++) {
      if (programs[i] && programs[i].course && String(programs[i].course).toLowerCase() === lc) return programs[i].id;
    }
    var byName = programs.filter(function (p) { return p && p.name; })
      .sort(function (a, b) { return String(b.name).length - String(a.name).length; })
      .filter(function (p) {
        return new RegExp('\\b' + String(p.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(course);
      })[0];
    if (byName) return byName.id;
    for (i = 0; i < HINTS.length; i++) {
      if (HINTS[i].re.test(course) && programs.some(function (p) { return p && p.id === HINTS[i].id; })) return HINTS[i].id;
    }
    return null;
  }
  var enrolled = mine();
  /* Unresolvable enrolment must never lock a real student out of their own
     coursework — same principle as the dashboard. Let them through. */
  if (!enrolled) return;
  if (owners.some(function (p) { return p.id === enrolled; })) return;   /* allowed */

  var ownerName = (owners[0] && owners[0].name) || 'another programme';
  var myName = (programs.filter(function (p) { return p.id === enrolled; })[0] || {}).name || 'your programme';
  block('This practical is not part of your programme',
    'It belongs to <b>' + esc(ownerName) + '</b>. You are enrolled in <b>' + esc(myName) + '</b>, '
    + 'and your dashboard lists every practical that counts towards it.');

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  function block(title, msg) {
    function paint(){
      var d = document.createElement('div');
      d.setAttribute('data-lab-gate','1');
      d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(18,4,4,.95);backdrop-filter:blur(6px);color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px';
      d.innerHTML =
        '<div style="max-width:460px">'+
          '<div style="font-size:56px;line-height:1">🔒</div>'+
          '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-weight:700;margin:12px 0 8px;font-size:26px">'+title+'</h2>'+
          '<p style="color:#eccccc;line-height:1.65;font-size:15px;margin:0">'+msg+'</p>'+
          '<a href="'+LOGIN+'?next='+encodeURIComponent(file)+'" style="display:inline-block;margin-top:18px;background:#b1040e;color:#fff;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:100px;box-shadow:0 6px 20px -4px rgba(177,4,14,.6)">Go to my dashboard ↗</a>'+
        '</div>';
      (document.body || document.documentElement).appendChild(d);
      try { document.documentElement.style.overflow = 'hidden'; if (document.body) document.body.style.overflow = 'hidden'; } catch (e) {}
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();
  }
})();
