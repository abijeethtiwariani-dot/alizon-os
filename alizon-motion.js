/* =====================================================================
   ALIZON OS — shared GSAP motion layer (loaded after vendor/gsap + ScrollTrigger)
   Safe everywhere: no-ops if GSAP is missing, an element is absent, or the
   user prefers reduced motion. clearProps after every tween so print styles
   and later JS never inherit stale inline styles.
   ===================================================================== */
(function () {
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm || !window.gsap) return;
  var g = window.gsap;
  var hasST = !!window.ScrollTrigger;
  if (hasST) g.registerPlugin(window.ScrollTrigger);

  /* GSAP takes over from the CSS .reveal system: force-reveal, kill its transition */
  document.documentElement.classList.add('gsap-motion');
  var st = document.createElement('style');
  st.textContent = 'html.gsap-motion .reveal{opacity:1 !important;transform:none !important;transition:none !important}';
  document.head.appendChild(st);

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    /* ---------- 1) Hero entrance (public pages) ---------- */
    if (document.querySelector('.hero')) {
      var tl = g.timeline({ defaults: { ease: 'power3.out' } });
      ['.hero .eyebrow', '.hero h1', '.hero .tag', '.hero p.lead', '.hero .cta', '.hero .price'].forEach(function (sel, i) {
        var el = document.querySelector(sel);
        if (el) tl.from(el, { y: 36, autoAlpha: 0, duration: 0.85, clearProps: 'all' }, i * 0.12);
      });
      /* failsafe: if rAF was throttled (hidden tab) ensure content is never left hidden */
      setTimeout(function () { try { if (tl.progress() < 1) tl.progress(1); } catch (e) {} }, 4000);
    }

    /* ---------- 2) Scroll-triggered staggered reveals (public pages) ---------- */
    if (hasST) {
      var SELS = ['.pc', '.strip .in > div', '.wc',
        '.azrole-card', '.azstat-tile', '.azstat-card', '.azfinder-card', '.azest-card',
        '.azest-panel', '.azverify-card', '.azverify-panel', '.apanel', '.prog'];
      var seen = [], els = [];
      SELS.forEach(function (s) {
        document.querySelectorAll(s).forEach(function (e) {
          if (seen.indexOf(e) < 0 && !e.closest('#app') && !e.closest('.dsec')) { seen.push(e); els.push(e); }
        });
      });
      if (els.length) {
        window.ScrollTrigger.batch(els, {
          start: 'top 88%', once: true,
          onEnter: function (b) { g.from(b, { y: 38, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'all' }); }
        });
      }
      /* section headings drift up as they arrive */
      document.querySelectorAll('.blk .ey, .blk h2, .blk p.sub').forEach(function (el) {
        g.from(el, { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      /* app-window showcase: gentle parallax */
      var win_ = document.querySelector('.showcase .window');
      if (win_) g.fromTo(win_, { y: 56 }, { y: -36, ease: 'none',
        scrollTrigger: { trigger: '.showcase', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    }

    /* ---------- 3) Dashboard: login entrance + section-switch stagger ---------- */
    var app = document.getElementById('app');
    if (app) {
      var lc = document.querySelector('.login-card');
      if (lc) g.from(lc, { y: 30, autoAlpha: 0, scale: 0.97, duration: 0.8, ease: 'power3.out', clearProps: 'all' });

      var lastAnim = {};
      function animateSection(sec) {
        if (!sec) return;
        var now = Date.now();
        if (lastAnim[sec.id] && now - lastAnim[sec.id] < 300) return; /* debounce double-fires */
        lastAnim[sec.id] = now;
        var items = sec.querySelectorAll('.modhead, .card, .modcard, .dcard, .subrow, .faccard, .setcard, .updlist, .attwrap > *');
        if (!items.length) return;
        g.killTweensOf(items);
        /* fromTo with explicit endpoints — immune to capturing mid-tween state */
        g.fromTo(items, { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'all', overwrite: 'auto' });
      }
      /* sidebar clicks use an internal closure, so hook the nav directly */
      var nav = document.getElementById('sideNav');
      if (nav) nav.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-dsec]');
        if (a) setTimeout(function () { animateSection(document.querySelector('.dsec.on')); }, 30);
      });
      /* other code paths go through window.__showDsec */
      if (window.__showDsec) {
        var orig = window.__showDsec;
        window.__showDsec = function (id) { orig(id); animateSection(document.getElementById(id)); };
      }
      /* after login, sweep the first visible section in */
      var lf = document.getElementById('loginForm');
      if (lf) lf.addEventListener('submit', function () {
        setTimeout(function () {
          var bar = document.querySelector('#app .topbar');
          if (bar) g.from(bar, { y: -18, autoAlpha: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
          animateSection(document.querySelector('.dsec.on'));
        }, 150);
      });
    }
  });
})();
