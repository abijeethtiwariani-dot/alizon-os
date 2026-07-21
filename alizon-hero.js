/* =====================================================================
   ALIZON — shared changeable-hero-image helper
   Any page with a split hero can opt in by marking the visual panel:
       <div class="vis" data-hero-key="xxx-hero-img"> … </div>
   The office uploads a photo in Admin → Website Content → Page hero
   images. It is stored in alizonContent under <key> ("id:chunks",
   chunks live in sync/nwimg_*) or <key>-url (a direct URL). The photo
   replaces the built-in artwork; removing it restores the artwork.
   Requires firebase-sync.js on the page (for the chunked variant).
   Safe/no-op if the hero, the key, or Firestore is unavailable.
   ===================================================================== */
(function () {
  'use strict';
  function J(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function whenAuthed(cb, tries) {
    tries = tries || 0;
    try { if (window.firebase && firebase.auth && firebase.auth().currentUser) { cb(true); return; } } catch (e) {}
    if (tries > 25) { cb(false); return; }
    setTimeout(function () { whenAuthed(cb, tries + 1); }, 400);
  }
  var cache = {};

  function apply() {
    var vis = document.querySelector('.hero .vis[data-hero-key]');
    if (!vis) return;
    var key = vis.getAttribute('data-hero-key');
    var ph = vis.querySelector('.photo');
    if (!ph) {
      ph = document.createElement('img');
      ph.className = 'photo';
      ph.alt = '';
      vis.insertBefore(ph, vis.firstChild);
    }
    var store = J('alizonContent', {}); if (!store || typeof store !== 'object') store = {};
    var url = String(store[key + '-url'] || '').trim();
    var meta = String(store[key] || '').trim();

    if (url) {
      if (ph.getAttribute('data-src') !== url) { ph.setAttribute('data-src', url); ph.src = url; }
      vis.classList.add('hasphoto'); return;
    }
    if (!meta) { vis.classList.remove('hasphoto'); ph.removeAttribute('data-src'); ph.removeAttribute('src'); return; }
    if (ph.getAttribute('data-src') === meta) { vis.classList.add('hasphoto'); return; }
    ph.setAttribute('data-src', meta);
    var p = meta.split(':'), id = p[0], n = parseInt(p[1], 10) || 1;
    if (cache[id]) { ph.src = cache[id]; vis.classList.add('hasphoto'); return; }
    whenAuthed(function (ok) {
      if (!ok || !window.firebase || !firebase.firestore) return;
      var db = firebase.firestore(), gets = [];
      for (var i = 0; i < n; i++) gets.push(db.collection('sync').doc('nwimg_' + id + '_' + i).get());
      Promise.all(gets).then(function (snaps) {
        var b64 = snaps.map(function (x) { return (x.exists && x.data() && x.data().value) || ''; }).join('');
        if (!b64) return;
        cache[id] = 'data:image/jpeg;base64,' + b64;
        ph.src = cache[id]; vis.classList.add('hasphoto');
      }).catch(function () {});
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  window.addEventListener('storage', function (e) { if (e.key === 'alizonContent') apply(); });
  setInterval(apply, 6000);
  window.__alizonHero = { apply: apply };
})();
