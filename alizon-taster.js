/* alizon-taster.js — "Try a practical" on the public practicals page.

   Three real decision points lifted from three real ALIZON OS practicals, so a
   visitor can experience what the platform actually asks of a student instead
   of reading a description of it. No sign-in, no scoring record, no storage:
   state lives in a closure variable and dies with the page. This file reads
   and writes nothing — no localStorage, no cookies, no student data.        */
(function () {
  'use strict';
  if (window.__alizonTaster) return; window.__alizonTaster = 1;

  var CASES = [
    {
      from: 'Module 1 · AI Prescription Screening',
      kicker: 'The dispensing counter',
      stem: 'A prescription reads <b>“MTX 15 mg — take ONE tablet DAILY”</b> for rheumatoid arthritis. ' +
            'The AI screening tool flags nothing: the dose is within range, the drug is indicated, ' +
            'the patient is on the right therapy.',
      q: 'What do you do?',
      options: [
        { t: 'Dispense — the AI cleared it and the dose is correct for methotrexate.', ok: false,
          why: 'The dose is correct. The <b>frequency</b> is not. Methotrexate for rheumatoid arthritis is dosed <b>once a week</b>, and daily administration at 15 mg is a well-documented fatal error. A range check cannot catch it, because 15 mg is a perfectly ordinary methotrexate dose — it is only lethal at this interval.' },
        { t: 'Contact the prescriber before dispensing — the frequency looks wrong.', ok: true,
          why: 'Correct, and this is the error that range-checking software misses. Methotrexate for RA is a <b>weekly</b> dose; “daily” at 15 mg is a classic and potentially fatal prescribing slip. The AI sees a valid dose and a valid indication, and has nothing to compare the interval against.' },
        { t: 'Dispense, and counsel the patient to watch for side effects.', ok: false,
          why: 'Counselling does not fix it. By the time toxicity appears — mouth ulcers, marrow suppression — the patient has already taken seven weekly doses in seven days. The intervention has to happen <b>before</b> dispensing.' }
      ]
    },
    {
      from: 'Hospital Administration · Module 6 · KPI Validation',
      kicker: 'The board pack',
      stem: 'The quality cell reports <b>gross inpatient mortality of 0.89%</b>, improved from 1.40%. ' +
            'You check the arithmetic: 11 deaths ÷ 1,240 discharges. <b>It is exactly right.</b> ' +
            'In the same month, discharges against medical advice — patients taken home in extremis — ' +
            'rose from <b>6 to 38</b>.',
      q: 'What goes to the board?',
      options: [
        { t: 'Publish it. The figure is arithmetically correct and the trend is good news.', ok: false,
          why: 'The arithmetic is correct and the conclusion is false. A sixfold rise in patients taken home to die, in the month mortality “improved”, means the deaths did not stop — they left the denominator. Publishing the improvement alone tells the board the opposite of what happened.' },
        { t: 'Withhold it until the data team can explain the discrepancy.', ok: false,
          why: 'Closer, but withholding buries a governance signal rather than raising it. The board needs to see this now, not next quarter — and a pack that reports nothing until everything is perfect stops being useful to govern with.' },
        { t: 'Escalate it — this is a clinical governance signal, not a performance win.', ok: true,
          why: 'Correct. The number is right and the indicator is misleading, which is the hardest case to catch. Both figures go up together, to the medical director, with the DAMA rise beside the mortality fall — because the question is no longer statistical.' }
      ]
    },
    {
      from: 'Hospital Administration · Module 4 · Documentation Integrity',
      kicker: 'The records desk',
      stem: 'A documentation engine scores a chart <b>98% complete — no action required</b>, the highest in the queue. ' +
            'You open it. Every field is filled and every entry signed. The day-2 progress note reads: ' +
            '<b>“Post-op day 3 following right total knee replacement.”</b> ' +
            'This admission is day 2, and the planned procedure is a <b>left</b> knee replacement — <b>scheduled for tomorrow</b>.',
      q: 'What is your finding?',
      options: [
        { t: 'Accept it. 98% complete with every entry signed is a sound chart.', ok: false,
          why: 'Completeness measured the wrong thing. Every field is full, which is exactly why it scored highest — the note was copy-forwarded from a previous admission and documents a post-operative course for surgery that has not happened, on the wrong side.' },
        { t: 'Send it to coding — the note is inconsistent with the procedure list.', ok: false,
          why: 'This is not a coding query. A note describing a knee replacement that has not occurred, on the opposite side, is a patient-safety problem: a clinician reading this chart could reasonably believe the knee had been done.' },
        { t: 'Escalate immediately — the note is copy-forwarded and clinically wrong.', ok: true,
          why: 'Correct. Copy-forward produces text that is internally consistent and externally false, and a completeness engine cannot see it because nothing is missing. It goes back before the pre-operative check, not into the committee papers.' }
      ]
    }
  ];

  var i = 0, right = 0, answered = false;   /* in-memory only */

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  function render(host) {
    var c = CASES[i];
    answered = false;
    host.innerHTML =
      '<div class="tsprog">' + CASES.map(function (_, n) {
        return '<i class="' + (n < i ? 'done' : n === i ? 'now' : '') + '"></i>'; }).join('') +
        '<span>Case ' + (i + 1) + ' of ' + CASES.length + '</span></div>' +
      '<div class="tskick">' + esc(c.kicker) + '</div>' +
      '<p class="tsstem">' + c.stem + '</p>' +
      '<p class="tsq">' + esc(c.q) + '</p>' +
      '<div class="tsopts">' + c.options.map(function (o, n) {
        return '<button type="button" data-n="' + n + '">' + esc(o.t) + '</button>'; }).join('') +
      '</div>' +
      '<div class="tsfeed" id="tsFeed"></div>' +
      '<p class="tsfrom">From <b>' + esc(c.from) + '</b> — one of 59 practicals in ALIZON OS.</p>';

    [].forEach.call(host.querySelectorAll('.tsopts button'), function (b) {
      b.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var n = +b.getAttribute('data-n'), o = c.options[n];
        if (o.ok) right++;
        [].forEach.call(host.querySelectorAll('.tsopts button'), function (x, xi) {
          x.classList.add('locked');
          if (c.options[xi].ok) x.classList.add('correct');
          else if (xi === n) x.classList.add('wrong');
        });
        var feed = host.querySelector('#tsFeed');
        feed.className = 'tsfeed show ' + (o.ok ? 'ok' : 'no');
        feed.innerHTML =
          '<div class="tsverdict">' + (o.ok ? '✓ That is the call' : '✗ Not this one') + '</div>' +
          '<p>' + o.why + '</p>' +
          '<button type="button" class="tsnext" id="tsNext">' +
            (i + 1 < CASES.length ? 'Next case →' : 'See how you did →') + '</button>';
        feed.querySelector('#tsNext').addEventListener('click', function () {
          i++;
          if (i < CASES.length) render(host); else finish(host);
        });
        feed.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
  }

  function finish(host) {
    var msg = right === 3
      ? 'Three from three. That is the standard the practicals are marked against — and every one of those traps was designed to be missed.'
      : right === 2
      ? 'Two from three. The one you missed is the kind that gets past experienced staff too, which is exactly why it is in the practical.'
      : right === 1
      ? 'One from three. Every case here inverts what the system in front of you says — which is the whole point of the exercise.'
      : 'None from three, and that is worth knowing now rather than on a ward. All three AI outputs were confident, and all three were wrong.';
    host.innerHTML =
      '<div class="tsdone">' +
        '<div class="tsscore">' + right + '<span>/ 3</span></div>' +
        '<p class="tsmsg">' + esc(msg) + '</p>' +
        '<p class="tssub">The real practicals run longer, hold a wall clock, track two consequence meters, ' +
          'show you what happened next in each case, and produce an assessed report you download as a PDF.</p>' +
        '<div class="tsacts">' +
          '<a class="btn btn-primary" href="ASMDI-dashboard.html">Enter the portal ↗</a>' +
          '<button type="button" class="btn btn-ghost" id="tsAgain">Try again</button>' +
        '</div>' +
      '</div>';
    host.querySelector('#tsAgain').addEventListener('click', function () {
      i = 0; right = 0; render(host);
    });
  }

  function boot() {
    var host = document.getElementById('azTaster');
    if (!host) return;
    render(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
