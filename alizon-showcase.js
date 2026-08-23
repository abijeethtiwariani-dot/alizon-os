/* alizon-showcase.js — "Inside a practical": a self-playing, 12-second
   illustration of what an ALIZON OS practical actually does, built from a real
   case (Module 4 · Practical 1, chart MR-4517).

   It is a dramatisation of the interface, not the interface itself, and it says
   so on screen. It runs entirely on a timeline of CSS class changes: no data is
   read, nothing is stored, and it pauses when scrolled out of view so it never
   burns cycles in a background tab.                                          */
(function () {
  'use strict';
  if (window.__alizonShowcase) return; window.__alizonShowcase = 1;

  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var host, timers = [], playing = false, clockT = null, elapsed = 0;

  function el(sel) { return host.querySelector(sel); }
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clearAll() { timers.forEach(clearTimeout); timers = []; if (clockT) { clearInterval(clockT); clockT = null; } }

  function shell() {
    host.innerHTML =
      '<div class="scwin">' +
        '<div class="scbar"><i></i><i></i><i></i><span>ALIZON OS — Records Desk · Module 4 · Practical 1</span></div>' +
        '<div class="scbody">' +

          '<div class="scops">' +
            '<div class="scop"><b>Session clock</b><span id="scClock">00:00</span></div>' +
            '<div class="scop"><b>Charts audited</b><span id="scSeen">0 / 6</span></div>' +
            '<div class="scop scm"><b>Record integrity</b><span id="scAv">100%</span>' +
              '<i class="scbar2"><u id="scA" style="width:100%"></u></i></div>' +
            '<div class="scop scm"><b>Legal defensibility</b><span id="scBv">100%</span>' +
              '<i class="scbar2"><u id="scB" style="width:100%"></u></i></div>' +
          '</div>' +

          '<div class="sccase" id="scCase">' +
            '<div class="scchips"><span>MR-4517</span><span>Female, 58</span><span>Orthopaedics · Day 2</span></div>' +
            '<div class="scai" id="scAI">' +
              '<b>AI documentation engine</b>' +
              '<p><span class="scscore">98% complete</span> — Complete, no action required ' +
              '<i>(engine confidence: High)</i></p>' +
            '</div>' +

            '<button class="scopen" id="scOpen" type="button">Open the chart</button>' +

            '<div class="scchart" id="scChart">' +
              '<b>The chart</b>' +
              '<ul>' +
                '<li>Every field populated. Every entry signed.</li>' +
                '<li class="scred">Day 2 note reads: “Post-op day 3 following <u>right</u> total knee replacement.”</li>' +
                '<li class="scred">This admission is <u>day 2</u>. The planned procedure is the <u>left</u> knee — <u>tomorrow</u>.</li>' +
                '<li>The identical paragraph appears in last year’s admission.</li>' +
              '</ul>' +
            '</div>' +

            '<div class="scdec" id="scDec">' +
              '<b>Your disposition</b>' +
              '<div class="scopts">' +
                '<span data-o="accept">Accept — file for committee</span>' +
                '<span data-o="return">Return for addendum</span>' +
                '<span data-o="escalate">Escalate to HIM committee</span>' +
              '</div>' +
            '</div>' +

            '<div class="scverdict" id="scVerdict">' +
              '<b>✓ Escalated — sound audit</b>' +
              '<p>The highest-scoring chart in the queue and the most dangerous. The note was ' +
                 'copy-forwarded: it documents a post-operative course for surgery that has not ' +
                 'happened, on the wrong side. A completeness engine cannot see it, because every ' +
                 'field is full.</p>' +
            '</div>' +

            '<div class="sclater" id="scLater">' +
              '<b>What happened next</b>' +
              '<p>Escalated within the hour. The note was retracted and the surgical site verified ' +
                 'before the list next morning.</p>' +
            '</div>' +
          '</div>' +

          '<div class="sccursor" id="scCursor"></div>' +
        '</div>' +
      '</div>' +

      '<div class="scend" id="scEnd">' +
        '<p><b>That is one chart, in one practical.</b> The real one runs six, holds a wall clock, ' +
           'tracks both meters against every decision, and produces an assessed report you download as a PDF.</p>' +
        '<div class="scacts">' +
          '<a class="btn btn-primary" href="os-practicals.html#azTasterSec">Try three cases yourself →</a>' +
          '<button class="btn btn-ghost" type="button" id="scReplay">Replay</button>' +
        '</div>' +
      '</div>' +
      '<p class="scnote">An illustration of a real ALIZON OS practical, on synthetic teaching data.</p>';

    el('#scReplay').addEventListener('click', function () { play(true); });
  }

  function setMeter(which, pct) {
    el(which === 'a' ? '#scA' : '#scB').style.width = pct + '%';
    el(which === 'a' ? '#scAv' : '#scBv').textContent = pct + '%';
  }

  function moveCursor(target, cb) {
    var c = el('#scCursor'), t = el(target);
    if (!c || !t) { if (cb) cb(); return; }
    var hb = host.querySelector('.scbody').getBoundingClientRect();
    var tb = t.getBoundingClientRect();
    c.style.opacity = '1';
    c.style.transform = 'translate(' + (tb.left - hb.left + tb.width / 2) + 'px,' +
                                       (tb.top - hb.top + tb.height / 2) + 'px)';
    at(760, function () { c.classList.add('tap'); t.classList.add('pressed'); });
    at(980, function () { c.classList.remove('tap'); if (cb) cb(); });
  }

  function reset() {
    clearAll();
    elapsed = 0;
    ['#scChart', '#scDec', '#scVerdict', '#scLater', '#scEnd'].forEach(function (s) { el(s).classList.remove('on'); });
    el('#scOpen').classList.remove('pressed', 'gone');
    el('#scOpen').style.display = '';
    el('#scCursor').style.opacity = '0';
    el('#scCase').classList.remove('on');
    el('#scAI').classList.remove('dim');
    [].forEach.call(host.querySelectorAll('.scopts span'), function (s) { s.classList.remove('picked', 'faded'); });
    el('#scClock').textContent = '00:00';
    el('#scSeen').textContent = '0 / 6';
    setMeter('a', 100); setMeter('b', 100);
  }

  function finalState() {          /* what a reduced-motion visitor sees */
    reset();
    el('#scCase').classList.add('on');
    el('#scOpen').style.display = 'none';
    ['#scChart', '#scDec', '#scVerdict', '#scLater', '#scEnd'].forEach(function (s) { el(s).classList.add('on'); });
    var pick = host.querySelector('.scopts [data-o="escalate"]');
    if (pick) pick.classList.add('picked');
    el('#scClock').textContent = '04:12';
    el('#scSeen').textContent = '1 / 6';
  }

  function play(force) {
    if (playing && !force) return;
    playing = true;
    reset();

    clockT = setInterval(function () {
      elapsed++;
      el('#scClock').textContent = '0' + Math.floor(elapsed / 60) + ':' + ('0' + (elapsed % 60)).slice(-2);
    }, 1000);

    at(150,  function () { el('#scCase').classList.add('on'); });
    at(1500, function () { moveCursor('#scOpen'); });
    at(2500, function () {
      el('#scOpen').classList.add('gone');
      el('#scChart').classList.add('on');
      el('#scAI').classList.add('dim');
    });
    at(4600, function () { el('#scDec').classList.add('on'); });
    at(5400, function () { moveCursor('.scopts [data-o="escalate"]'); });
    at(6400, function () {
      var opts = host.querySelectorAll('.scopts span');
      [].forEach.call(opts, function (s) {
        if (s.getAttribute('data-o') === 'escalate') s.classList.add('picked');
        else s.classList.add('faded');
      });
      el('#scCursor').style.opacity = '0';
    });
    at(6900, function () {
      el('#scVerdict').classList.add('on');
      el('#scSeen').textContent = '1 / 6';
    });
    at(9000, function () { el('#scLater').classList.add('on'); });
    at(11200, function () {
      el('#scEnd').classList.add('on');
      if (clockT) { clearInterval(clockT); clockT = null; }
      playing = false;
    });
  }

  /* Trigger. IntersectionObserver proved unreliable in some embedded and
     zero-height-layout contexts, where it simply never reports the section as
     intersecting and the demo sits frozen. This uses the same plain
     getBoundingClientRect check the rest of the site already relies on, driven
     by scroll, resize and a few timed passes — and if none of that has started
     it within six seconds, it plays regardless. A visitor should never meet a
     motionless screen that was supposed to be showing them something. */
  function inView() {
    var r = host.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return true;                     /* no measurable viewport — just play */
    return r.top < vh * 0.9 && r.bottom > 0;
  }

  function maybeStart() {
    if (playing || started) return;
    if (!inView()) return;
    started = true;
    play();
  }

  var started = false;

  function boot() {
    host = document.getElementById('azShowcase');
    if (!host) return;
    shell();
    if (REDUCED) { finalState(); return; }
    reset();

    window.addEventListener('scroll', maybeStart, { passive: true });
    window.addEventListener('resize', maybeStart, { passive: true });
    [200, 700, 1500, 3000].forEach(function (ms) { setTimeout(maybeStart, ms); });

    /* last resort: play it rather than leave a dead panel on the page */
    setTimeout(function () { if (!started) { started = true; play(); } }, 6000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
