/* =====================================================================
   medcity-data.js — the MEDCITY Testprep catalogue.

   THIS IS THE ONE FILE YOU EDIT to change what the section offers. The
   landing page, the batch catalogue and My Batches all render from here;
   none of them hard-codes a batch name, a date or a fee.

   ---------------------------------------------------------------------
   TWO WAYS TO PUT REAL CONTENT IN
   ---------------------------------------------------------------------
   1 · EDIT THIS FILE. Replace the sample TRACKS and BATCHES below with
       the real ones and redeploy. Simplest, and it is what a fresh
       visitor sees.

   2 · PUSH IT FROM THE OFFICE. If localStorage holds `alizonMedcityTracks`
       or `alizonMedcityBatches`, that wins over what is written here — the
       same arrangement the workshops and results desks already use, so the
       office can change a start date without a deploy, and firebase-sync.js
       carries it to every device.

   Whichever you use, the SHAPE is what matters. It is documented field by
   field above each list. Anything optional may simply be left out; the
   pages check before they render.

   ---------------------------------------------------------------------
   THE SAMPLE DATA BELOW IS PLACEHOLDER
   ---------------------------------------------------------------------
   Three tracks and five batches are seeded so the pages have something to
   draw. They are marked `sample:true`. Delete them when the real
   catalogue arrives — every page shows an honest "nothing published yet"
   state with an empty list, so removing them breaks nothing.
   ===================================================================== */
(function () {
  'use strict';
  if (window.MedcityData) return;

  /* -------------------------------------------------------------------
     TRACKS — the exams MEDCITY prepares candidates for.

       id      stable slug. Batches point at it, and it appears in URLs.
               Once published, do not change it: enrolments reference it.
       name    short label, e.g. "GPAT"
       full    the expanded name, spelled out once for people who
               do not know the acronym
       blurb   one or two sentences, shown on the landing page
       who     who the track is for
       accent  optional hex for the track's chip. Defaults to cardinal.
     ------------------------------------------------------------------- */
  var TRACKS = [
    {
      id: 'gpat',
      name: 'GPAT',
      full: 'Graduate Pharmacy Aptitude Test',
      blurb: 'The national entrance for M.Pharm admission and AICTE scholarship. Heavy on pharmaceutical chemistry, pharmacology and pharmaceutics, and unforgiving about arithmetic done under time pressure.',
      who: 'Final-year B.Pharm students and graduates',
      accent: '#8c1515',
      sample: true
    },
    {
      id: 'di',
      name: 'Drug Inspector',
      full: 'Drug Inspector & Drugs Control Recruitment',
      blurb: 'State and central recruitment for the drugs control administration. The syllabus leans on the Drugs and Cosmetics Act, pharmaceutical jurisprudence and quality control — the parts of the degree most candidates last read years ago.',
      who: 'B.Pharm and M.Pharm graduates sitting state PSC or central recruitment',
      accent: '#9a7b3f',
      sample: true
    },
    {
      id: 'norcet',
      name: 'NORCET',
      full: 'Nursing Officer Recruitment Common Eligibility Test',
      blurb: 'The AIIMS-conducted recruitment test for nursing officers, now the single gate to most central nursing posts. Broad clinical coverage, a punishing negative-marking scheme and a prelims-to-mains structure that rewards pacing.',
      who: 'B.Sc and GNM nursing graduates',
      accent: '#2e5d4b',
      sample: true
    }
  ];

  /* -------------------------------------------------------------------
     BATCHES — what a candidate actually enrols in.

     REQUIRED
       id          stable slug, unique across the catalogue. Enrolment
                   records store this, so never reuse or rename one that
                   candidates have already joined.
       track       a TRACKS id
       name        e.g. "GPAT 2027 — Regular Evening"
       mode        'online' | 'offline' | 'hybrid'
       starts      'YYYY-MM-DD'
       status      'open'     taking enrolments
                   'filling'  taking enrolments, few seats left
                   'waitlist' full, but collecting names
                   'running'  started; closed to new candidates
                   'closed'   not taking anyone

     OPTIONAL — every one of these may be omitted
       tagline     one line under the title
       ends        'YYYY-MM-DD'
       days        e.g. 'Mon-Fri'
       time        e.g. '18:30-20:30 IST'
       centre      for offline/hybrid, where it meets
       seats       total seats
       seatsLeft   seats remaining (drives the "filling" urgency line)
       fee         a number, in rupees. 0 or omitted reads as "Free".
       feeNote     e.g. 'in three instalments'
       faculty     array of names
       highlights  array of short strings — the selling points
       syllabus    array of { title, detail } — the phase plan
       mocks       array of { id, name, on:'YYYY-MM-DD', kind:'full'|'sectional',
                               questions, minutes }
       materials   array of { name, kind:'pdf'|'link'|'page', href }
     ------------------------------------------------------------------- */
  var BATCHES = [
    {
      id: 'gpat-2027-regular',
      track: 'gpat',
      name: 'GPAT 2027 — Regular Evening',
      tagline: 'The full eleven-month run, built around people who are still in college during the day.',
      mode: 'online',
      starts: '2026-11-03',
      ends: '2027-09-17',
      days: 'Mon-Fri',
      time: '18:30-20:30 IST',
      seats: 60,
      seatsLeft: 14,
      fee: 24000,
      feeNote: 'payable in three instalments',
      status: 'filling',
      faculty: ['Dr. Ann Sara Mathew', 'Dr. Rahul Menon'],
      highlights: [
        'Every session recorded — watch back for the length of the batch',
        'Weekly sectional test, monthly full-length mock',
        'A written answer-key walkthrough after every mock, not just a score'
      ],
      syllabus: [
        { title: 'Phase 1 · Foundations (Nov-Jan)', detail: 'Physical and organic chemistry rebuilt from the ground up, plus the pharmaceutics core. Assumes you have forgotten most of it, because most candidates have.' },
        { title: 'Phase 2 · Pharmacology and analysis (Jan-Apr)', detail: 'Systems pharmacology, medicinal chemistry and instrumental analysis, taught against previous-year question patterns rather than chapter order.' },
        { title: 'Phase 3 · Consolidation (Apr-Jul)', detail: 'Jurisprudence, biochemistry and the smaller-weight subjects, with the first full-syllabus mocks.' },
        { title: 'Phase 4 · Exam craft (Jul-Sep)', detail: 'Nothing new taught. Timed full mocks, error logs and the arithmetic drills that decide the last twenty marks.' }
      ],
      mocks: [
        { id: 'gpat27-m1', name: 'Sectional 1 — Physical Pharmaceutics', on: '2026-11-22', kind: 'sectional', questions: 50, minutes: 60 },
        { id: 'gpat27-m2', name: 'Sectional 2 — Organic Chemistry', on: '2026-12-13', kind: 'sectional', questions: 50, minutes: 60 },
        { id: 'gpat27-m3', name: 'Full Mock 1', on: '2027-01-24', kind: 'full', questions: 125, minutes: 180 },
        { id: 'gpat27-m4', name: 'Full Mock 2', on: '2027-03-21', kind: 'full', questions: 125, minutes: 180 }
      ],
      materials: [
        { name: 'Batch handbook and phase plan', kind: 'pdf', href: '' },
        { name: 'Previous-year question archive (2019-2026)', kind: 'pdf', href: '' }
      ],
      sample: true
    },
    {
      id: 'gpat-2027-crash',
      track: 'gpat',
      name: 'GPAT 2027 — Crash Course',
      tagline: 'Ten weeks, for candidates who have already covered the syllabus once and need the exam craft.',
      mode: 'online',
      starts: '2027-06-01',
      ends: '2027-08-14',
      days: 'Mon, Wed, Fri, Sat',
      time: '19:00-21:30 IST',
      seats: 80,
      seatsLeft: 80,
      fee: 9500,
      status: 'open',
      faculty: ['Dr. Rahul Menon'],
      highlights: [
        'Revision only — this batch teaches nothing for the first time',
        'Twelve full-length mocks in ten weeks',
        'Individual error log reviewed with a mentor twice'
      ],
      mocks: [
        { id: 'gpat27c-m1', name: 'Diagnostic Full Mock', on: '2027-06-06', kind: 'full', questions: 125, minutes: 180 },
        { id: 'gpat27c-m2', name: 'Full Mock 2', on: '2027-06-20', kind: 'full', questions: 125, minutes: 180 }
      ],
      sample: true
    },
    {
      id: 'di-kerala-2027',
      track: 'di',
      name: 'Drug Inspector — Kerala PSC 2027',
      tagline: 'Jurisprudence-first, taught against the Kerala PSC question pattern.',
      mode: 'hybrid',
      centre: 'Thiruvananthapuram',
      starts: '2026-12-01',
      ends: '2027-06-30',
      days: 'Sat and Sun',
      time: '09:30-13:00 IST',
      seats: 40,
      seatsLeft: 6,
      fee: 18000,
      feeNote: 'payable in two instalments',
      status: 'filling',
      faculty: ['Adv. Priya Nair', 'Dr. Ann Sara Mathew'],
      highlights: [
        'The Drugs and Cosmetics Act read section by section, not summarised',
        'Weekend contact classes in Thiruvananthapuram, weeknight doubt clinics online',
        'Interview and document-verification preparation included'
      ],
      syllabus: [
        { title: 'Block A · Jurisprudence', detail: 'The Act, the Rules, and the schedules that actually get asked about.' },
        { title: 'Block B · Quality control and analysis', detail: 'Pharmacopoeial testing, sampling procedure and the inspector’s own statutory powers.' },
        { title: 'Block C · General studies and Kerala-specific papers', detail: 'The non-technical half of the paper, which is where most pharmacy graduates lose the post.' }
      ],
      sample: true
    },
    {
      id: 'norcet-2027-foundation',
      track: 'norcet',
      name: 'NORCET 2027 — Foundation',
      tagline: 'Prelims and mains together, from the first week.',
      mode: 'online',
      starts: '2026-10-13',
      ends: '2027-05-29',
      days: 'Tue-Sat',
      time: '20:00-22:00 IST',
      seats: 120,
      seatsLeft: 31,
      fee: 16500,
      feeNote: 'payable in three instalments',
      status: 'filling',
      faculty: ['Ms. Deepa Thomas', 'Mr. Vivek R.'],
      highlights: [
        'Built around the negative-marking scheme — accuracy drilled before speed',
        'Clinical subjects taught with real ward scenarios, not question banks alone',
        'Separate mains module after prelims results'
      ],
      mocks: [
        { id: 'nor27-m1', name: 'Prelims Mock 1', on: '2026-11-15', kind: 'full', questions: 100, minutes: 60 },
        { id: 'nor27-m2', name: 'Prelims Mock 2', on: '2026-12-20', kind: 'full', questions: 100, minutes: 60 }
      ],
      sample: true
    },
    {
      id: 'norcet-2026-running',
      track: 'norcet',
      name: 'NORCET 2026 — Mains Intensive',
      tagline: 'Closed. Running to the May sitting.',
      mode: 'online',
      starts: '2026-08-04',
      ends: '2026-11-28',
      days: 'Mon-Thu',
      time: '20:00-22:00 IST',
      seats: 45,
      seatsLeft: 0,
      fee: 11000,
      status: 'running',
      faculty: ['Ms. Deepa Thomas'],
      sample: true
    }
  ];

  /* -------------------------------------------------------------------
     FAQ — shown on the landing page. Plain text; no markup.
     ------------------------------------------------------------------- */
  var FAQ = [
    { q: 'Do I need to be an Alizon student to enrol?',
      a: 'No. MEDCITY Testprep is open to any candidate sitting these exams. Alizon students enrol with the same register number they use elsewhere on the platform, so their batches show up alongside their coursework.' },
    { q: 'What happens after I enrol?',
      a: 'The batch appears on your My Batches page straight away, with its schedule, mock dates and materials. The office confirms your seat and payment separately — enrolling here reserves your place, it does not charge you.' },
    { q: 'Are the sessions recorded?',
      a: 'Where a batch says so in its highlights, yes, and the recordings stay available for the length of the batch. Contact classes at a centre are not recorded.' },
    { q: 'Can I move between batches?',
      a: 'Ask the office. A move within the same exam track before the batch starts is usually straightforward; after it has started it depends on how far along the batch is.' },
    { q: 'What if a batch is full?',
      a: 'Enrol anyway — a full batch collects a waitlist in order, and seats do open. You will see your position on My Batches.' }
  ];

  /* ===================================================================
     Below this line is plumbing. You should not need to change it to add
     or edit a batch.
     =================================================================== */

  /* The office's copy, if there is one, wins over what is written above.
     Anything malformed is ignored rather than allowed to blank the page. */
  function override(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return (Array.isArray(v) && v.length) ? v : fallback;
    } catch (e) { return fallback; }
  }

  function tracks() { return override('alizonMedcityTracks', TRACKS); }
  function batches() { return override('alizonMedcityBatches', BATCHES); }

  function track(id) {
    var all = tracks();
    for (var i = 0; i < all.length; i++) if (all[i] && all[i].id === id) return all[i];
    return null;
  }

  function batch(id) {
    var all = batches();
    for (var i = 0; i < all.length; i++) if (all[i] && all[i].id === id) return all[i];
    return null;
  }

  /* Open to new candidates? 'running' and 'closed' are not. */
  function isOpen(b) {
    var s = (b && b.status) || 'open';
    return s === 'open' || s === 'filling' || s === 'waitlist';
  }

  /* A batch with no seats left still accepts names, as a waitlist. */
  function isWaitlist(b) {
    if (!b) return false;
    if (b.status === 'waitlist') return true;
    return typeof b.seatsLeft === 'number' && b.seatsLeft <= 0 && isOpen(b);
  }

  var STATUS_LABEL = {
    open: 'Enrolling', filling: 'Filling fast', waitlist: 'Waitlist',
    running: 'In progress', closed: 'Closed'
  };
  function statusLabel(b) { return STATUS_LABEL[(b && b.status) || 'open'] || 'Enrolling'; }

  var MODE_LABEL = { online: 'Online', offline: 'At the centre', hybrid: 'Hybrid' };
  function modeLabel(b) {
    var m = MODE_LABEL[(b && b.mode) || 'online'] || 'Online';
    return (b && b.centre && b.mode !== 'online') ? m + ' · ' + b.centre : m;
  }

  /* Dates are written 'YYYY-MM-DD' and read as local dates. Parsing them
     with `new Date(str)` would treat them as UTC midnight and show the
     previous day to anyone west of Greenwich, so they are split by hand. */
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(s) {
    var d = parseDate(s);
    return d ? (d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear()) : '';
  }
  function fmtRange(a, b) {
    var x = fmtDate(a), y = fmtDate(b);
    if (x && y) return x + ' — ' + y;
    return x || y || '';
  }

  function fee(b) {
    var f = b && b.fee;
    if (!f) return 'Free';
    return '₹' + Number(f).toLocaleString('en-IN');
  }

  /* Whole days from today until the date, or null. Negative means past. */
  function daysUntil(s) {
    var d = parseDate(s);
    if (!d) return null;
    var t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((d - t) / 86400000);
  }

  /* The next mock still to come, for My Batches. */
  function nextMock(b) {
    var list = (b && b.mocks) || [], best = null, bestN = null;
    for (var i = 0; i < list.length; i++) {
      var n = daysUntil(list[i] && list[i].on);
      if (n == null || n < 0) continue;
      if (bestN == null || n < bestN) { bestN = n; best = list[i]; }
    }
    return best;
  }

  /* How far through a batch we are, 0-100, or null if the dates do not
     allow an honest answer. */
  function progress(b) {
    var s = parseDate(b && b.starts), e = parseDate(b && b.ends);
    if (!s || !e || e <= s) return null;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (now <= s) return 0;
    if (now >= e) return 100;
    return Math.round(((now - s) / (e - s)) * 100);
  }

  window.MedcityData = {
    tracks: tracks, batches: batches, track: track, batch: batch,
    isOpen: isOpen, isWaitlist: isWaitlist,
    statusLabel: statusLabel, modeLabel: modeLabel,
    parseDate: parseDate, fmtDate: fmtDate, fmtRange: fmtRange,
    fee: fee, daysUntil: daysUntil, nextMock: nextMock, progress: progress,
    faq: function () { return FAQ; },
    /* the built-in seed, ignoring any office override — the admin desk
       needs this to offer a "reset to the published catalogue" action */
    seed: function () { return { tracks: TRACKS, batches: BATCHES }; }
  };
})();
