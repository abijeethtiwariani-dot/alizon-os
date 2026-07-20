/* =====================================================================
   ALIZON — motion layer for the Stanford-language pages
   (alizon-academics / alizon-workshops / alizon-testimonials)
   Load AFTER vendor/gsap.min.js + vendor/ScrollTrigger.min.js.

   Implements the premium reference behaviours with original code:
     1. hero entrance (staggered fade/rise + visual panel slide)
     2. scroll-reveal for every section head, card grid and ruled row
        — including content injected later (news, workshops, voices)
     3. subtle image parallax on the hero visual and cardinal bands
     4. count-up animation on the numbers band (suffixes preserved)
     5. smooth anchor scrolling is native (scroll-behavior in page CSS)

   Safe everywhere: no-ops without GSAP, on reduced-motion, and after
   every tween clearProps so print styles never inherit inline values.
   ===================================================================== */
(function () {
  'use strict';
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm || !window.gsap) return;
  var g = window.gsap;
  var hasST = !!window.ScrollTrigger;
  if (hasST) g.registerPlugin(window.ScrollTrigger);

  /* containers whose insides are functional, not editorial — never animate */
  var EXCLUDE = '#lg-out, .ws-form, #rg-ok, #printArea, .idc, .idcard, #wsf-list';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {

    /* ---------- 1) hero entrance ---------- */
    var heroTxt = document.querySelector('.hero .txt');
    if (heroTxt) {
      var tl = g.timeline({ defaults: { ease: 'power3.out' } });
      var h1 = heroTxt.querySelector('h1'), p = heroTxt.querySelector('p');
      if (h1) tl.from(h1, { y: 44, autoAlpha: 0, duration: 0.9, clearProps: 'all' }, 0.05);
      if (p) tl.from(p, { y: 30, autoAlpha: 0, duration: 0.85, clearProps: 'all' }, 0.22);
      var vis = document.querySelector('.hero .vis');
      if (vis) tl.from(vis, { autoAlpha: 0, xPercent: 6, duration: 1.0, clearProps: 'opacity,visibility,transform' }, 0.15);
      var badge = document.querySelector('.hero .vis .badge');
      if (badge) tl.from(badge, { y: 14, autoAlpha: 0, duration: 0.6, clearProps: 'all' }, 0.7);
      setTimeout(function () { try { if (tl.progress() < 1) tl.progress(1); } catch (e) {} }, 4000);
    }
    var affil = document.querySelector('.affil .in');
    if (affil) g.from(affil, { autoAlpha: 0, y: 12, duration: 0.7, delay: 0.5, ease: 'power2.out', clearProps: 'all' });

    if (!hasST) return;

    /* ---------- 2) scroll reveals (static + dynamic content) ---------- */
    var CARD_SELS = [
      '.bhead', '.cc', '.crs > *', '.chips .chip',
      '.nw-card', '.nw-spot', '.nw-grid > *', '.nws > *',
      '.ws-card', '.ws-grid > *', '.tcard', '.tgrid > *',
      '.stat', '.row-i', '.rows > *',
      '.topic .lead', '.topic .rows',
      '.deg-band .in > *', '.spot .in > *',
      '.login-grid > *', '.rd-box', '.cta .row', '.cta h2'
    ].join(',');

    function eligible(el) {
      return !el.__alzDone && !el.closest(EXCLUDE);
    }
    function arm(els) {
      els = els.filter(eligible);
      if (!els.length) return;
      els.forEach(function (e) { e.__alzDone = 1; });
      window.ScrollTrigger.batch(els, {
        start: 'top 90%', once: true,
        onEnter: function (b) {
          g.from(b, { y: 34, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'all' });
        }
      });
      window.ScrollTrigger.refresh();
    }
    function scan() { arm(Array.prototype.slice.call(document.querySelectorAll(CARD_SELS))); }
    scan();
    /* dynamic sections (news / workshops / voices) render after the cloud
       pull — keep watching for fresh, un-animated elements */
    var scans = 0;
    var iv = setInterval(function () { scan(); if (++scans > 40) clearInterval(iv); }, 1200);

    /* ---------- 3) parallax ---------- */
    /* hero visual: art/photo drifts slower than the page */
    var visInner = document.querySelector('.hero .vis svg, .hero .vis .photo');
    var visWrap = document.querySelector('.hero .vis');
    if (visWrap) {
      Array.prototype.forEach.call(document.querySelectorAll('.hero .vis svg, .hero .vis .photo'), function (el) {
        g.fromTo(el, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: visWrap, start: 'top top', end: 'bottom top', scrub: true }
        });
      });
    }
    /* cardinal statement bands: content rises gently while the band scrolls */
    ['.deg-band', '.spot', '.impact'].forEach(function (sel) {
      var band = document.querySelector(sel);
      if (!band) return;
      var inner = band.querySelector('.in') || band.querySelector('.wrap');
      if (!inner) return;
      g.fromTo(inner, { yPercent: 4 }, {
        yPercent: -4, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ---------- 4) numbers band count-up (keeps the styled suffix) ---------- */
    function countUp(el) {
      if (el.__alzCounted) return;
      var tn = null, i;
      for (i = 0; i < el.childNodes.length; i++) {
        var n = el.childNodes[i];
        if (n.nodeType === 3 && n.nodeValue && n.nodeValue.replace(/\s+/g, '') !== '') { tn = n; break; }
      }
      if (!tn) return;
      var target = parseInt(String(tn.nodeValue).replace(/[^\d]/g, ''), 10);
      if (!isFinite(target) || target <= 0) return;
      el.__alzCounted = 1;
      var obj = { v: 0 };
      g.to(obj, {
        v: target, duration: Math.min(2, 0.6 + target / 400), ease: 'power2.out',
        onUpdate: function () { tn.nodeValue = String(Math.round(obj.v)); },
        onComplete: function () { tn.nodeValue = String(target); }
      });
    }
    function armCounters() {
      Array.prototype.forEach.call(document.querySelectorAll('.stat .n'), function (el) {
        if (el.__alzCountArmed) return;
        el.__alzCountArmed = 1;
        window.ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: function () { countUp(el); }
        });
      });
    }
    armCounters();
    /* live counters (workshops page) fill in after the cloud pull */
    var cScans = 0;
    var civ = setInterval(function () { armCounters(); if (++cScans > 20) clearInterval(civ); }, 1500);

    /* ---------- 5) header: deepen the shadow once scrolled ---------- */
    var bar = document.querySelector('.topbar');
    if (bar) {
      window.ScrollTrigger.create({
        start: 80, end: 'max',
        onEnter: function () { bar.style.boxShadow = '0 6px 24px rgba(60,8,8,.38)'; },
        onLeaveBack: function () { bar.style.boxShadow = ''; }
      });
    }
  });
})();
