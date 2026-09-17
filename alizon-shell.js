/* alizon-shell.js — mobile menu behaviour for the shared site shell.
   Loaded sitewide so every page with a burger button has a working menu.
   Guarded so it is harmless if a page somehow loads it twice. */
(function () {
  if (window.__azShellMenu) return;
  window.__azShellMenu = 1;

  function init() {
    var b = document.getElementById('azburger');
    var m = document.getElementById('azmobilemenu');
    if (!b || !m) return;

    function set(open) {
      b.classList.toggle('open', open);
      m.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    b.addEventListener('click', function () { set(!m.classList.contains('open')); });
    m.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && m.classList.contains('open')) { set(false); b.focus(); }
    });
    addEventListener('resize', function () { if (innerWidth > 860) set(false); }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
