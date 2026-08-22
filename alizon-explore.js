/* alizon-explore.js — the interactive layer on the public home page.
   Three things, all driven by generated catalogues so they cannot go stale:

     1. count-up statistics that animate once, when scrolled into view
     2. a programme explorer — pick a programme, see its real modules,
        their unit counts, whether they are live, and their practicals
     3. scroll reveal for sections

   Reads ONLY programme-catalogue.json and book-catalogue.json, both of
   which contain course structure and nothing else. This file never reads
   or writes student data, localStorage or any synced key.                */
(function () {
  'use strict';
  if (window.__alizonExplore) return; window.__alizonExplore = 1;

  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function $(id){ return document.getElementById(id); }

  /* ---------------------------------------------------------------- 1. count up */
  var EASE = function (t) { return 1 - Math.pow(1 - t, 3); };

  function countUp(el, target, suffix, ms) {
    if (REDUCED) { el.textContent = target + suffix; return; }
    var start = null, from = 0;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / ms);
      el.textContent = Math.round(from + (target - from) * EASE(p)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Animate any element carrying data-count once it scrolls into view.

     FAIL-SAFE: the true value is written immediately, so a viewport where the
     observer never fires shows the real number rather than a zero. The
     animation only ever replaces a correct value with the same correct value. */
  function wireCounters(root) {
    var els = (root || document).querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        countUp(el, parseFloat(el.getAttribute('data-count')) || 0,
                el.getAttribute('data-suffix') || '', 1100);
      });
    }, { threshold: 0.25 }) : null;
    [].forEach.call(els, function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = target + suffix;          /* truth first, animation second */
      if (io && !REDUCED) io.observe(el);
    });
  }

  /* The "Built for scale" tiles are deliberately left alone. alizon-clone.js
     already animates them, and an administrator owns their text through the
     CMS — a second animator on the same element only fights the first. */

  /* ---------------------------------------------------------------- 2. reveal */
  /* FAIL-SAFE: .az-reveal is only hidden while <html> carries .az-anim, and
     that class is added by this function alone. If the observer is missing, or
     motion is reduced, or anything below throws, the class is never added and
     every section renders normally. A hard timeout also reveals everything
     after three seconds, so no content can be stranded invisible. */
  function wireReveal() {
    var targets = document.querySelectorAll('.az-reveal');
    if (!targets.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) return;

    var root = document.documentElement;
    root.classList.add('az-anim');

    function revealAll() {
      [].forEach.call(targets, function (t) { t.classList.add('az-in'); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('az-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    try { [].forEach.call(targets, function (t) { io.observe(t); }); }
    catch (e) { revealAll(); return; }

    /* whatever happens, nothing stays hidden */
    setTimeout(revealAll, 3000);
  }

  /* ---------------------------------------------------------------- 3. explorer */
  var CAT = null, active = null;

  function ring(pct) {
    var r = 26, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return '<svg class="axr" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="' + r + '" class="axr-bg"></circle>' +
      '<circle cx="32" cy="32" r="' + r + '" class="axr-fg" ' +
        'style="stroke-dasharray:' + c.toFixed(1) + ';stroke-dashoffset:' + off.toFixed(1) + '"></circle>' +
      '<text x="32" y="37" text-anchor="middle" class="axr-t">' + Math.round(pct) + '%</text></svg>';
  }

  function renderTabs() {
    $('axTabs').innerHTML = CAT.programmes.map(function (p, i) {
      return '<button type="button" role="tab" data-i="' + i + '"' +
             (i === active ? ' class="on" aria-selected="true"' : ' aria-selected="false"') + '>' +
             esc(p.name) + '<i>' + p.stats.live + '/' + p.stats.modules + '</i></button>';
    }).join('');
    [].forEach.call($('axTabs').querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        active = +b.getAttribute('data-i');
        renderTabs(); renderBody();
      });
    });
  }

  function renderBody() {
    var p = CAT.programmes[active];
    var pct = p.stats.modules ? (p.stats.live / p.stats.modules) * 100 : 0;

    $('axHead').innerHTML =
      '<div class="axhead-l">' +
        '<h3>' + esc(p.name) + '</h3>' +
        (p.course ? '<p>' + esc(p.course) + '</p>' : '') +
        '<div class="axnums">' +
          '<span><b>' + p.stats.modules + '</b> modules</span>' +
          '<span><b>' + p.stats.units + '</b> units</span>' +
          '<span><b>' + p.stats.practicals + '</b> practicals</span>' +
        '</div>' +
      '</div>' +
      '<div class="axhead-r">' + ring(pct) + '<span>modules live</span></div>';

    $('axModules').innerHTML = p.modules.map(function (m, i) {
      var live = m.status === 'live';
      return '<article class="axmod' + (live ? ' live' : '') + '" style="--d:' + (i * 45) + 'ms">' +
        '<div class="axmod-top">' +
          '<span class="axunit">' + esc(m.unit) + '</span>' +
          '<span class="axpill ' + (live ? 'ok' : 'soon') + '">' + (live ? 'Live' : 'In development') + '</span>' +
        '</div>' +
        '<h4>' + esc(m.title) + '</h4>' +
        (m.desc ? '<p>' + esc(m.desc) + '</p>' : '') +
        '<div class="axmeta">' + m.units + ' units' +
          (m.practicals.length ? ' · ' + m.practicals.length + ' practical' + (m.practicals.length > 1 ? 's' : '') : '') +
        '</div>' +
        (m.practicals.length
          ? '<ul class="axpr">' + m.practicals.map(function (t) {
              return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
          : '') +
      '</article>';
    }).join('');

    /* stagger the cards in */
    if (!REDUCED) {
      [].forEach.call($('axModules').querySelectorAll('.axmod'), function (c) {
        c.classList.add('axfade');
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('axfade-in'); }); });
      });
    }
  }

  function bootExplorer() {
    var host = $('azExplore');
    if (!host) return;
    fetch('programme-catalogue.json').then(function (r) { return r.json(); }).then(function (d) {
      CAT = d;
      if (!CAT || !CAT.programmes || !CAT.programmes.length) { host.style.display = 'none'; return; }
      /* open on the programme with the most live modules — the strongest one */
      active = 0;
      CAT.programmes.forEach(function (p, i) {
        if (p.stats.live > CAT.programmes[active].stats.live) active = i;
      });
      /* totals line */
      var t = CAT.totals;
      var tot = $('axTotals');
      if (tot) {
        tot.innerHTML =
          '<div class="axtot"><b data-count="' + t.programmes + '">0</b><span>Programmes</span></div>' +
          '<div class="axtot"><b data-count="' + t.modules + '">0</b><span>Modules</span></div>' +
          '<div class="axtot"><b data-count="' + t.units + '">0</b><span>Units</span></div>' +
          '<div class="axtot"><b data-count="' + t.practicals + '">0</b><span>Practicals built</span></div>';
        wireCounters(tot);
      }
      renderTabs(); renderBody();
    }).catch(function () { host.style.display = 'none'; });
  }

  function boot() {
    wireCounters(document);
    wireReveal();
    bootExplorer();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
