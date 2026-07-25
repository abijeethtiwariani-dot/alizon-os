/* ALIZON OS — practical/lab access gate.
   Locks a practical to logged-in Alizon students (and admin) UNLESS the lab
   has been marked "open for outside" by an admin (alizonLabAccess list).
   Include on every ALIZON-OS-Module*.html / lab page:  <script src="alizon-lab-gate.js"></script>
   Soft client-side gate (static site) — pairs with the portal login. */
(function () {
  'use strict';
  var LOGIN = 'ASMDI-dashboard.html';
  function get(k, d){ try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }

  var file = (location.pathname.split('/').pop() || '').toLowerCase();

  var params = new URLSearchParams(location.search);
  var isAdmin = (function(){ try { return sessionStorage.getItem('alizonAdminAuth') === '1'; } catch(e){ return false; } })() || !!params.get('admin');
  var prof = get('alizonProfile', null);
  var isStudent = !!(prof && (prof.reg || prof.name));

  /* HARD LOCK: every practical is student/admin only — no public access. */
  if (isAdmin || isStudent) return;   /* allowed */

  function block() {
    var d = document.createElement('div');
    d.setAttribute('data-lab-gate','1');
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(18,4,4,.95);backdrop-filter:blur(6px);color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px';
    d.innerHTML =
      '<div style="max-width:440px">'+
        '<div style="font-size:56px;line-height:1">🔒</div>'+
        '<h2 style="font-family:Georgia,\'Times New Roman\',serif;font-weight:700;margin:12px 0 8px;font-size:26px">Student access only</h2>'+
        '<p style="color:#eccccc;line-height:1.65;font-size:15px;margin:0">This practical is available to logged-in Alizon students. Please sign in to the ALIZON OS portal to continue.</p>'+
        '<a href="'+LOGIN+'?next='+encodeURIComponent(file)+'" style="display:inline-block;margin-top:18px;background:#b1040e;color:#fff;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:100px;box-shadow:0 6px 20px -4px rgba(177,4,14,.6)">Sign in to ALIZON OS ↗</a>'+
        '<div style="margin-top:14px"><a href="os-practicals.html" style="color:#e9c9c9;font-size:13px;text-decoration:underline">← Back to practicals</a></div>'+
      '</div>';
    (document.body || document.documentElement).appendChild(d);
    try { document.documentElement.style.overflow = 'hidden'; if (document.body) document.body.style.overflow = 'hidden'; } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', block); else block();
})();
