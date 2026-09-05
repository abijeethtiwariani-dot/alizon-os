/* =====================================================================
   ALIZON — Pharmacy AI · MODULE 1
   Practicals deck (Practicals 1–3) + four assignment questions,
   with the alizongov.com submission rules read from the portal source.

   Every fact on a slide is read from the institution's own material:
     · alizon-book-m1.js                        module structure + practical programme
     · alizon-experiment-data.js                experiment briefs (ethics, rxdetect)
     · ALIZON-OS-Module1-AI-Drug-Discovery.html descriptors, 9 cases, question paper
     · ALIZON-OS-Module1-Ethics-Lab.html        incident timeline + rubric
     · ALIZON-OS-Module1-RxDetect.html          case, prescription, pathway, rubric
   The four assignment questions are new teaching content, one per unit.
   The upload rules come from the alizongov.com portal source:
     · src/lib/student-constants.ts        PDF only, 10 MB, 45-day resubmission
     · src/lib/assignment-upload-policy.ts one live submission per module

   Run:  node tools-build-m1-practicals-deck.js [outfile]
   ===================================================================== */
const fs = require('fs'), path = require('path');
const PptxGenJS = require('pptxgenjs');

const DIR = __dirname;
const OUT = process.argv[2] ||
  '/Users/kukku/Desktop/ALIZON-Pharmacy-Module-1-Practicals.pptx';

/* ---------------- house palette (matches the ALIZON teaching decks) ---- */
const CR = '8C1515', GOLD = '9A7B3F', INK = '26221F', MUT = '6E6A63',
      PAPER = 'FAF8F6', CARD = 'FFFFFF', LINE = 'E4DBD4',
      DARK = '14100F', DEEP = '2E1010', WHITE = 'FFFFFF',
      TINT = 'F7EFEC', HEAD = 'EFE7E1';
const SERIF = 'Cambria', SANS = 'Calibri';
const W = 13.333, H = 7.5;

const strip = s => String(s || '').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/\s+/g, ' ').trim();
const sents = (s, n) => strip(s).split(/(?<=[.?!])\s+/).filter(Boolean).slice(0, n).join(' ');

/* ---------------- read the experiment briefs ---------------------------- */
function loadBriefs() {
  const src = fs.readFileSync(path.join(DIR, 'alizon-experiment-data.js'), 'utf8');
  const i = src.indexOf('var DATA={'), j = src.indexOf('\n  };', i);
  if (i < 0 || j < 0) throw new Error('DATA block not found in alizon-experiment-data.js');
  return eval('(' + src.slice(i + 'var DATA='.length, j + 4) + ')');
}
const B = loadBriefs();

/* ---------------- facts drawn from the three practical pages ----------- */
const P1 = {
  no: 'Module 1 · Unit 1 · Practical 1',
  title: 'AI Drug Discovery Lab',
  sub: 'Designing a drug-like candidate using machine learning',
  aim: 'To design a candidate drug molecule in-silico, to correct faulty candidates, and to evaluate drug-likeness and predicted oral bioavailability using an AI (logistic-regression) model, relating physicochemical properties to Lipinski’s and Veber’s rules.',
  screens: [
    ['Lab Manual', 'The experiment sheet the student works from'],
    ['Molecule Builder', 'Load a scaffold, then edit it property by property'],
    ['AI Analysis', 'Predicted properties, gauges and rule violations'],
    ['Formulation Workbench', 'Take the candidate toward a dosage form'],
    ['Fix the Medicine', 'Nine faulty candidates to diagnose and correct'],
    ['Observation Table', 'Recorded live as the student works'],
    ['Question Paper', 'Assigned by code, then Generate Report']
  ],
  desc: [
    ['MW', '≤ 500 Da', 'Molecular weight — bigger molecules cross membranes badly'],
    ['LogP', '≤ 5 (ideal 1–3)', 'Lipophilicity — too greasy dissolves poorly and risks toxicity'],
    ['HBD', '≤ 5', 'Hydrogen-bond donors'],
    ['HBA', '≤ 10', 'Hydrogen-bond acceptors'],
    ['TPSA', '≤ 140 Å² (< 90 well absorbed)', 'Topological polar surface area — gut-wall permeability'],
    ['RotB', '≤ 10 (Veber)', 'Rotatable bonds — a floppy chain absorbs poorly']
  ],
  cases: [
    ['Case 1 · Overweight', 'BX-21', 'MW and acceptor count too high'],
    ['Case 2 · Too greasy', 'LX-7', 'Very high LogP — dissolves poorly, toxicity risk'],
    ['Case 3 · Poor absorption', 'PR-9', 'TPSA and donors too high — cannot cross the gut wall'],
    ['Case 4 · Too flexible', 'FL-3', 'Too many rotatable bonds (Veber)'],
    ['Case 5 · Multiple faults', 'MX-12', 'Several rules broken at once'],
    ['Case 6 · Borderline', 'BD-4', 'No violation, but every property at its limit'],
    ['Case 7 · Big & lipophilic', 'TX-8', 'Breaks MW and LogP — hard to formulate'],
    ['Case 8 · Peptide-like', 'PP-15', 'Huge and highly polar — very poor oral absorption'],
    ['Case 9 · Almost there', 'AL-2', 'Just tips over the weight limit — one small fix']
  ],
  paper: [['Part A', 'Correct the faulty candidates', '2 × 5 = 10'],
          ['Part B', 'Design task', '5'],
          ['Part C', 'Viva / theory', '5'],
          ['Total', '', '20']],
  report: ['Experiment', 'Aim', 'Principle', 'Best Designed Candidate', 'Method',
           'Observation Table', 'Observation', 'Result', 'Discussion', 'Conclusion'],
  teach: [
    'The rules are a guide, not a law. A violation is something the student must explain, not an automatic fail — real marketed drugs break them.',
    'The gauges are model predictions, not measurements. Say it out loud: bioavailability here is estimated from descriptors, never observed in a patient.',
    'Each "Fix the Medicine" case has one identifiable fault. Make students name the rule that is broken BEFORE they touch the molecule.',
    'The observation table must be filled as they work. A student who reconstructs it at the end has skipped the experiment, and it shows in the discussion.'
  ]
};

const P2 = {
  no: strip(B.ethics.practicalNo),
  title: strip(B.ethics.title),
  sub: 'Ethics, Regulation & Data Protection Lab',
  aim: strip(B.ethics.aim),
  incident: 'INC-2026-0803 · live patient-data breach, hospital pharmacy',
  timeline: [
    ['Mon 08:12', 'The exposure is discovered', 'Contain what you control before chasing what you do not'],
    ['Mon 08:40', 'Pressure to keep producing the discharge lists', 'Operational pressure against containment'],
    ['Mon 11:05', 'A subject access request arrives', 'A data principal exercises their right mid-incident'],
    ['Mon 14:20', 'A request for an improper disclosure', 'The press; the answer is refusal, correctly worded']
  ],
  screens: ['Incident inbox — events arrive on a clock',
            'The incident — what is known so far',
            'Stage-by-stage decisions',
            'Assessment rubric — visible while you work',
            'Achievement badges',
            'Incident report & regulatory outcome'],
  rubric: [['Immediate containment', 25], ['Scope and risk assessment', 15],
           ['Notifiability decision', 20], ['Handling the subject access request', 15],
           ['Refusing improper disclosure', 15], ['Preventive action', 10]],
  teach: [
    'Containment carries the most marks (25) and it is an ordered task — secure what you control before chasing what you do not.',
    'Notifiability is a threshold decision, not a reflex. Students must say what made it notifiable under the DPDP Act — or defensibly why it was not.',
    'The access request and the disclosure pressure arrive WHILE the incident is live. Handling pressure under time is the skill being assessed.',
    'Preventive action is the smallest weight and the only stage that stops it happening again. Do not let them skip it because the clock is running.'
  ]
};

const P3 = {
  no: strip(B.rxdetect.practicalNo),
  title: 'RxDetect — Digital Drug Information & Formulary Investigation',
  sub: 'Verify a live hospital prescription',
  aim: strip(B.rxdetect.aim),
  patient: [
    ['Age / weight', '68 years · 71 kg'],
    ['Diagnosis', 'Atrial fibrillation + respiratory infection'],
    ['Known allergy', 'PENICILLIN'],
    ['Current complaint', 'New bruising'],
    ['Relevant history', 'AF since 2021 · warfarin since 2021']
  ],
  rx: [['Warfarin', '5 mg', 'OD'], ['Amiodarone', '200 mg', 'OD'],
       ['Clarithromycin', '500 mg', 'BD'], ['Atorvastatin', '40 mg', 'HS'],
       ['Paracetamol', '500 mg', 'PRN']],
  steps: [
    ['Review the patient record', 4], ['Verify the e-prescription', 3],
    ['Choose what to investigate', 5], ['Select the right information source', 10],
    ['Assess the drug interactions', 20], ['Request the investigations', 3],
    ['Interpret the results', 8], ['Interview the patient', 3],
    ['Check contraindications', 4], ['Resolve the formulary alert', 10],
    ['Reconcile the database conflict', 5], ['Verify the AI assistant', 10],
    ['Medication review board', 5], ['Communicate with the physician', 5],
    ['Document the intervention', 5]
  ],
  rubric: [['Information retrieval', 15], ['Database selection', 10],
           ['Interaction assessment', 20], ['Clinical interpretation', 20],
           ['Formulary decision', 10], ['AI verification', 10],
           ['Pharmacist intervention', 10], ['Documentation', 5]],
  traps: [
    ['Nothing is handed over', 'The record, the labs and the history are hidden until requested. What the student chooses to check is itself marked.'],
    ['Three sources, one right answer', 'MediRef, RxInteract and the Hospital Digital Formulary. Using the right source for the right question is a marked skill.'],
    ['Finding is not judging', 'Detecting an interaction earns nothing. Judging whether it matters for THIS patient is what earns the 20 marks.'],
    ['The AI is wrong on purpose', 'The AI clinical assistant offers a summary containing errors — including a drug the patient is allergic to. Verify before accepting.']
  ]
};

/* ---------------- the principle behind each practical -------------------
   Condensed from the labs' own Principle & Theory sections, because a
   student meeting the practical for the first time will not know it. --- */
const PRINCIPLE = {
  1: {
    lead: 'Why a computer can judge a molecule before anyone makes it',
    body: 'Screening real molecules in a laboratory is slow and expensive. A machine-learning model trained on thousands of known drugs and non-drugs learns which physicochemical properties make a molecule a good oral drug, so a new candidate can be screened in seconds. This is in-silico screening.',
    points: [
      ['Lipinski’s Rule of Five', 'A molecule is likely to be orally active if it breaks no more than one of: MW ≤ 500 Da, LogP ≤ 5, HBD ≤ 5, HBA ≤ 10.'],
      ['Veber’s two additions', 'TPSA ≤ 140 Å² and rotatable bonds ≤ 10 — both about whether the molecule can actually cross the gut wall.'],
      ['What the AI verdict is', 'A logistic-regression classifier: it multiplies each descriptor by a learned weight, sums them and passes the result through a sigmoid to give a probability between 0 and 1.'],
      ['The limit of all this', 'These are guidelines, not laws. Erythromycin and cyclosporine break several and are real medicines. AI screening narrows the search; it never replaces laboratory and clinical testing.']
    ]
  },
  2: {
    lead: 'Why breach response follows a fixed order',
    body: 'A personal data breach is any event causing unauthorised access to, or disclosure, loss or alteration of, personal data. In healthcare the harm is rarely financial — it is stigma, discrimination, lost employment, damaged relationships, and the erosion of the trust that makes patients disclose anything at all.',
    points: [
      ['Contain first', 'Work outward from what you still control to what you do not. Record the time of discovery — every later obligation runs from it.'],
      ['Then assess', 'How many individuals, which categories of data, what consequence to them. Notify the Data Protection Officer, whose responsibility the incident becomes.'],
      ['Then notify', 'Under the DPDP Act 2023 the Data Fiduciary must inform both the Data Protection Board of India and every affected Data Principal.'],
      ['No exemptions', 'Not because the data was recovered, not while you wait for a complaint, and not only the most sensitive subset. An initial notification is made and updated as facts emerge.']
    ]
  },
  3: {
    lead: 'Why verification is a fixed list, not a hunch',
    body: 'Prescription verification is a systematic search for the things that could harm this patient, done before the medicine leaves the pharmacy. The pharmacist works to a fixed set of checks — indication, dose, interactions, contraindications, allergy, organ function, formulary status, adverse effects, monitoring — because the check that is skipped is the one that causes harm.',
    points: [
      ['Each check has its own source', 'Monographs carry pharmacology and monitoring; interaction databases carry pairwise severity and mechanism; only the hospital formulary carries local availability and restriction.'],
      ['Databases legitimately disagree', 'Severity gradings are editorial judgements, not measurements. Do not default to the worst grading — that is how alert fatigue starts — and do not dismiss it. Read the evidence and apply it to this patient.'],
      ['AI is verified, not accepted', 'AI assistants summarise fluently but optimise for the question asked, and will confidently recommend a drug the patient is allergic to.'],
      ['A finding is worthless unsaid', 'Structure the intervention as problem → evidence → clinical significance → recommendation → monitoring, because that is the form a prescriber can act on immediately.']
    ]
  }
};

const { ASSIGN, PORTAL, BRIEF } = require('./tools-m1-assignment-data.js');

/* ---------------- deck ------------------------------------------------- */
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Alizon School of Medical & Digital Intelligence';
pptx.company = 'Alizon School of Medical and Digital Intelligence';
pptx.title = 'Pharmacy AI · Module 1 · Practicals and assignments';
pptx.subject = 'Module 1 — AI Foundations & Digital Systems for Pharmacy Practice';

function foot(s, dark) {
  s.addText('ALIZON AOS · Pharmacy AI · Module 1 — AI Foundations & Digital Systems',
    { x: 0.62, y: H - 0.52, w: 9.5, h: 0.32, fontSize: 9.5,
      color: dark ? '8A7F79' : MUT, fontFace: SANS, valign: 'middle', margin: 0 });
}

/* numbered circle — the deck's one repeated motif */
function pip(s, x, y, label, o) {
  o = o || {};
  const d = o.d || 0.42;
  s.addShape(pptx.ShapeType.ellipse, { x: x, y: y, w: d, h: d,
    fill: { color: o.fill || CR }, line: { color: o.fill || CR } });
  s.addText(String(label), { x: x, y: y, w: d, h: d, fontSize: o.fs || 13, bold: true,
    color: o.color || WHITE, fontFace: SANS, align: 'center', valign: 'middle', margin: 0 });
}

function slide(kicker, title) {
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  s.addText(kicker, { x: 0.62, y: 0.42, w: 12.1, h: 0.3, fontSize: 11, bold: true,
    color: CR, fontFace: SANS, charSpacing: 1.6, margin: 0 });
  s.addText(title, { x: 0.62, y: 0.76, w: 12.1, h: 0.72, fontSize: 30, bold: true,
    color: INK, fontFace: SERIF, margin: 0 });
  foot(s, false);
  return s;
}

function darkSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.ellipse, { x: 9.6, y: -2.2, w: 6.6, h: 6.6,
    fill: { color: DEEP }, line: { color: DEEP } });
  return s;
}

function bullets(s, items, o) {
  o = o || {};
  s.addText(items.map((t, i) => ({
    text: strip(t),
    options: { bullet: { code: '2022' }, breakLine: i < items.length - 1,
               paraSpaceAfter: o.gap === undefined ? 10 : o.gap }
  })), { x: o.x || 0.75, y: o.y || 1.72, w: o.w || 11.9, h: o.h || 4.9,
         fontSize: o.fontSize || 15.5, color: o.color || INK, fontFace: SANS,
         valign: 'top', margin: 0 });
}

function table(s, rows, o) {
  o = o || {};
  s.addTable(rows, {
    x: o.x || 0.75, y: o.y || 1.78, w: o.w || 11.85,
    colW: o.colW, rowH: o.rowH || 0.34,
    fontSize: o.fontSize || 13, fontFace: SANS, color: INK,
    border: { type: 'solid', pt: 0.5, color: LINE },
    fill: { color: CARD }, align: 'left', valign: 'middle',
    margin: [4, 8, 4, 8]
  });
}
const th = t => ({ text: t, options: { bold: true, fill: HEAD, color: DEEP } });

/* a card: white panel + bold heading + body */
function card(s, x, y, w, h, head, body, o) {
  o = o || {};
  s.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: w, h: h, rectRadius: 0.06,
    fill: { color: o.fill || CARD }, line: { color: LINE, width: 0.75 },
    shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
  let ty = y + 0.16;
  if (o.pip !== undefined) {
    pip(s, x + 0.22, ty + 0.02, o.pip, { d: 0.36, fs: 12 });
    s.addText(head, { x: x + 0.68, y: ty, w: w - 0.9, h: 0.34, fontSize: o.hs || 14,
      bold: true, color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
  } else {
    s.addText(head, { x: x + 0.24, y: ty, w: w - 0.48, h: 0.34, fontSize: o.hs || 14,
      bold: true, color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
  }
  if (body) {
    s.addText(strip(body), { x: x + (o.pip !== undefined ? 0.68 : 0.24), y: ty + 0.36,
      w: w - (o.pip !== undefined ? 0.9 : 0.48), h: h - 0.58, fontSize: o.bs || 11.5,
      color: MUT, fontFace: SANS, valign: 'top', margin: 0, lineSpacingMultiple: 1.08 });
  }
}


/* a Principle slide — the theory a first-time student will not know */
function principleSlide(n, kicker) {
  const P = PRINCIPLE[n];
  const s = slide(kicker + ' · PRINCIPLE', P.lead);
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 1.8, w: 11.85, h: 1.05,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText(strip(P.body), { x: 1.05, y: 1.9, w: 11.25, h: 0.85, fontSize: 12.5,
    color: INK, fontFace: SANS, valign: 'middle', margin: 0, lineSpacingMultiple: 1.08 });
  P.points.forEach((pt, i) => {
    const y = 3.0 + i * 0.98;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 0.9,
      rectRadius: 0.06, fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    pip(s, 0.97, y + 0.25, i + 1, { d: 0.4, fs: 12.5 });
    s.addText([{ text: strip(pt[0]) + ' — ', options: { bold: true, color: DEEP } },
               { text: strip(pt[1]), options: { color: INK } }],
      { x: 1.55, y: y, w: 10.8, h: 0.9, fontSize: 12, fontFace: SANS,
        valign: 'middle', margin: 0, lineSpacingMultiple: 1.08 });
  });
  s.addNotes('Principle for Practical ' + n + '. Cover this before the students open the lab — it is the theory the practical assumes.');
  return s;
}

/* ============================ 1 · TITLE =============================== */
{
  const s = darkSlide();
  s.addText('ALIZON', { x: 0.9, y: 0.72, w: 6, h: 0.4, fontSize: 15, bold: true,
    color: GOLD, fontFace: SERIF, charSpacing: 5, margin: 0 });
  s.addText('School of Medical & Digital Intelligence', { x: 0.9, y: 1.08, w: 7, h: 0.3,
    fontSize: 11, color: '9A8F88', fontFace: SANS, margin: 0 });
  s.addText('Module 1 — Practicals', { x: 0.9, y: 2.15, w: 11, h: 0.95,
    fontSize: 46, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText('AI Foundations & Digital Systems for Pharmacy Practice',
    { x: 0.9, y: 3.12, w: 10.6, h: 0.45, fontSize: 19, color: 'D9CFC7', fontFace: SANS, margin: 0 });
  s.addText('Three browser-based laboratories, and five assignment topics for the module',
    { x: 0.9, y: 3.62, w: 10.6, h: 0.4, fontSize: 14, color: '9A8F88', fontFace: SANS, margin: 0 });

  const items = [['3', 'Practicals'], ['5', 'Assignments'], ['4', 'Units covered']];
  items.forEach((it, i) => {
    const x = 0.9 + i * 2.55;
    s.addText(it[0], { x: x, y: 4.62, w: 2.3, h: 0.72, fontSize: 44, bold: true,
      color: GOLD, fontFace: SERIF, margin: 0 });
    s.addText(it[1], { x: x, y: 5.34, w: 2.3, h: 0.3, fontSize: 12, color: 'BCB1A9',
      fontFace: SANS, charSpacing: 1, margin: 0 });
  });
  s.addText('Certificate Course in Digital Health & Artificial Intelligence for Pharmacy · alizongov.com',
    { x: 0.9, y: 6.6, w: 11, h: 0.32, fontSize: 11, color: '7C716A', fontFace: SANS, margin: 0 });
  s.addNotes('Module 1 has three practicals, one each from Units 1, 3 and 4. All three run in the browser inside ALIZON AOS and are scored automatically. The five assignment topics at the end are written work, mapped across all four units.');
}

/* ============================ 1b · HOW THE MODULE IS ASSESSED ========== */
{
  const s = slide('READ THIS FIRST', 'Where you practise, and where you are marked');
  const cols = [
    ['ALIZON AOS', 'alizon.in',
     'Where you DO the practicals',
     ['Open the lab and work the case', 'The lab guides you and shows a score as you go',
      'Generate your practical report at the end', 'Download that report as a PDF'],
     'Nothing here is your mark. The score on screen is practice feedback so you know how you did.',
     CR],
    ['The main portal', PORTAL.site,
     'Where you are MARKED',
     ['Upload your work as one PDF', 'Faculty read it and award the marks',
      'Your status and marks appear on your dashboard', 'Rejected work can be corrected and re-uploaded'],
     'Every mark for this module comes from what you upload here. Nothing else counts.',
     '2C5F2D']
  ];
  cols.forEach((c, i) => {
    const x = 0.75 + i * 6.05;
    s.addShape(pptx.ShapeType.roundRect, { x: x, y: 1.78, w: 5.8, h: 4.05, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    s.addText(c[0], { x: x + 0.28, y: 1.94, w: 5.24, h: 0.36, fontSize: 17, bold: true,
      color: c[5], fontFace: SERIF, margin: 0 });
    s.addText(c[1], { x: x + 0.28, y: 2.3, w: 5.24, h: 0.26, fontSize: 11, color: MUT,
      fontFace: SANS, margin: 0 });
    s.addText(c[2].toUpperCase(), { x: x + 0.28, y: 2.66, w: 5.24, h: 0.3, fontSize: 11,
      bold: true, color: c[5], fontFace: SANS, charSpacing: 1.2, margin: 0 });
    s.addText(c[3].map((t, k) => ({ text: t, options: { bullet: { code: '2022' },
      breakLine: k < c[3].length - 1, paraSpaceAfter: 7 } })),
      { x: x + 0.28, y: 3.02, w: 5.24, h: 1.66, fontSize: 12, color: INK, fontFace: SANS,
        valign: 'top', margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.28, y: 4.76, w: 5.24, h: 0.92,
      rectRadius: 0.06, fill: { color: i === 0 ? TINT : 'EDF3ED' },
      line: { color: i === 0 ? 'E7CFCF' : 'D3E2D3', width: 0.75 } });
    s.addText(c[4], { x: x + 0.46, y: 4.86, w: 4.88, h: 0.74, fontSize: 11.5, bold: true,
      color: i === 0 ? DEEP : '234B24', fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('Do the practical in ALIZON AOS · download the report · upload it to ' + PORTAL.site + ' — that upload is your submission.',
    { x: 0.75, y: 6.05, w: 11.85, h: 0.5, fontSize: 13.5, bold: true, color: DEEP,
      fontFace: SANS, align: 'center', valign: 'middle', margin: 0 });
  s.addNotes('Say this before anything else. Students routinely assume the score the lab shows them is their mark. It is not — ALIZON AOS carries no evaluation. Marks exist only against what reaches ' + PORTAL.site + '.');
}

/* ============================ 2 · AT A GLANCE ========================== */
{
  const s = slide('MODULE 1', 'Four units, three laboratories');
  const units = [
    ['Foundations of Artificial Intelligence in Pharmacy', 'Practical 1 · AI Drug Discovery'],
    ['Digital Pharmacy & Information Systems', 'Theory unit — assessed by assignment'],
    ['Ethics, Regulation & Data Protection', 'Practical 2 · Data Breach Response'],
    ['Computer Applications & Digital Documentation', 'Practical 3 · RxDetect']
  ];
  units.forEach((u, i) => {
    const y = 1.78 + i * 1.14;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 1.0, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    pip(s, 0.97, y + 0.29, i + 1, { d: 0.42, fs: 13 });
    s.addText(u[0], { x: 1.55, y: y, w: 5.8, h: 1.0, fontSize: 15, bold: true,
      color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(u[1], { x: 7.5, y: y, w: 4.85, h: 1.0, fontSize: 12.5,
      color: u[1].indexOf('Theory') === 0 ? MUT : CR, bold: u[1].indexOf('Theory') !== 0,
      fontFace: SANS, align: 'right', valign: 'middle', margin: 0 });
  });
  s.addText('Every practical runs in the browser and returns a written report you download. Each one contains a decision that looks obvious and is not.',
    { x: 0.75, y: 6.42, w: 11.85, h: 0.4, fontSize: 12.5, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
  s.addNotes('Unit 2 has no laboratory of its own — it is assessed through Assignment 2, which traces a prescription across the PIS and HIS.');
}

/* ============================ 3 · HOW THEY WORK ======================== */
{
  const s = slide('BEFORE YOU START', 'How these practicals are meant to run');
  const rules = [
    ['Nothing is handed over', 'Each lab withholds information until the student goes and looks for it. What they chose to investigate is part of the mark.'],
    ['A written report every time', 'Aim, Principle, Method, Observation, Result, Discussion, Conclusion — generated in the lab, downloaded as PDF, then uploaded to the portal.'],
    ['The observation table is live', 'It fills as the student works. Reconstructing it afterwards is visible in the discussion and marks down.'],
    ['The AI is not an authority', 'Every lab in this module makes the student check an AI output against a named source before accepting it.'],
    ['The lab does not mark you', 'The score ALIZON AOS shows is practice feedback. Your mark comes only from the PDF you upload to the portal.'],
    ['One decision that looks obvious', 'Each lab plants a reversal. Students who answer from the first screen get it wrong.']
  ];
  rules.forEach((r, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.82 + Math.floor(i / 2) * 1.52;
    card(s, x, y, 5.8, 1.36, r[0], r[1], { pip: i + 1, hs: 13.5, bs: 11 });
  });
  s.addNotes('Read these out before the first lab session. The most common failure in the module is a student who answers from the first screen without investigating.');
}

/* ============================ 4 · SECTION P1 =========================== */
function sectionSlide(num, kicker, title, sub, unit) {
  const s = darkSlide();
  s.addText(kicker, { x: 0.9, y: 2.05, w: 10, h: 0.3, fontSize: 12, bold: true,
    color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText(title, { x: 0.9, y: 2.5, w: 10.6, h: 1.5, fontSize: 38, bold: true,
    color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText(sub, { x: 0.9, y: 4.05, w: 10.2, h: 0.45, fontSize: 16, color: 'BCB1A9',
    fontFace: SANS, margin: 0 });
  s.addText(unit, { x: 0.9, y: 4.62, w: 10.2, h: 0.35, fontSize: 12, color: '7C716A',
    fontFace: SANS, margin: 0 });
  pip(s, 11.35, 2.12, num, { d: 1.0, fs: 34, fill: CR });
  return s;
}
sectionSlide('1', 'PRACTICAL ONE', 'AI Drug Discovery Lab', P1.sub, P1.no)
  .addNotes('Practical 1 sits in Unit 1. It is the only lab in the module where the student builds something rather than judges something.');

/* ============================ 5 · P1 AIM =============================== */
{
  const s = slide(P1.no.toUpperCase(), 'Aim and what the student actually does');
  card(s, 0.75, 1.8, 6.6, 1.95, 'Aim', P1.aim, { hs: 15, bs: 12.5 });
  card(s, 7.6, 1.8, 5.0, 1.95, 'Assessed on', null, { hs: 15 });
  const marks = [['Part A · Correct faulty candidates', '10'],
                 ['Part B · Design task', '5'],
                 ['Part C · Viva / theory', '5']];
  marks.forEach((m, i) => {
    s.addText(m[0], { x: 7.84, y: 2.28 + i * 0.36, w: 3.6, h: 0.32, fontSize: 12,
      color: INK, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(m[1], { x: 11.5, y: 2.28 + i * 0.36, w: 0.85, h: 0.32, fontSize: 12,
      bold: true, color: CR, fontFace: SANS, align: 'right', valign: 'middle', margin: 0 });
  });
  s.addText('Total', { x: 7.84, y: 3.38, w: 3.6, h: 0.32, fontSize: 12.5, bold: true,
    color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
  s.addText('20 marks', { x: 10.9, y: 3.38, w: 1.45, h: 0.32, fontSize: 12.5, bold: true,
    color: CR, fontFace: SANS, align: 'right', valign: 'middle', margin: 0 });

  s.addText('The session in four moves', { x: 0.75, y: 4.18, w: 11.85, h: 0.36,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  const moves = [['Build', 'Load a scaffold in the Molecule Builder and edit its properties'],
                 ['Predict', 'Read the AI gauges — drug-likeness and predicted oral bioavailability'],
                 ['Fix', 'Diagnose and correct the faulty candidates in Fix the Medicine'],
                 ['Report', 'Answer the assigned question paper and generate the report']];
  moves.forEach((m, i) => {
    const x = 0.75 + i * 3.0;
    card(s, x, 4.62, 2.82, 1.62, m[0], m[1], { pip: i + 1, hs: 13.5, bs: 11 });
  });
  s.addNotes('Aim text is taken verbatim from the lab manual inside the practical, so the deck and the student report agree word for word.');
}

/* ---- P1 PRINCIPLE ---- */
principleSlide(1, 'PRACTICAL 1');

/* ============================ 6 · P1 SCREENS =========================== */
{
  const s = slide('PRACTICAL 1', 'The seven screens of the laboratory');
  P1.screens.forEach((sc, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.8 + Math.floor(i / 2) * 1.16;
    if (i === 6) {
      card(s, 0.75, 1.8 + 3 * 1.16, 11.85, 1.02, sc[0], sc[1], { pip: 7, hs: 13.5, bs: 11 });
    } else {
      card(s, x, y, 5.8, 1.02, sc[0], sc[1], { pip: i + 1, hs: 13.5, bs: 11 });
    }
  });
  s.addText('Students move left to right. The Observation Table fills itself as they work — it is not a form to complete at the end.',
    { x: 0.75, y: 6.5, w: 11.85, h: 0.34, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 7 · P1 DESCRIPTORS ======================= */
{
  const s = slide('PRACTICAL 1 · THE SCIENCE', 'Drug-likeness descriptors the AI model reads');
  const rows = [[th('Descriptor'), th('Target'), th('What it means')]].concat(
    P1.desc.map(d => [{ text: d[0], options: { bold: true, color: DEEP } },
                      { text: d[1], options: { color: CR, bold: true } },
                      d[2]]));
  table(s, rows, { y: 1.82, colW: [1.5, 2.75, 7.6], rowH: 0.46, fontSize: 12.5 });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 5.42, w: 11.85, h: 1.0,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText([{ text: 'Say this out loud: ', options: { bold: true, color: DEEP } },
             { text: 'Lipinski’s and Veber’s rules are guidance, not law. A violation is something the student must explain — not an automatic fail. Several marketed drugs break them, and the gauge on screen is a model prediction, never a measurement in a patient.',
               options: { color: INK } }],
    { x: 1.05, y: 5.56, w: 11.25, h: 0.75, fontSize: 12.5, fontFace: SANS, valign: 'middle', margin: 0 });
}

/* ============================ 8 · P1 CASES ============================= */
{
  const s = slide('PRACTICAL 1 · FIX THE MEDICINE', 'Nine faulty candidates, one identifiable fault each');
  P1.cases.forEach((c, i) => {
    const x = 0.75 + (i % 3) * 4.0, y = 1.8 + Math.floor(i / 3) * 1.42;
    card(s, x, y, 3.8, 1.28, c[0], c[2], { pip: i + 1, hs: 12.5, bs: 10.5 });
    s.addText(c[1], { x: x + 0.68, y: y + 1.0, w: 3.0, h: 0.22, fontSize: 9.5,
      bold: true, color: GOLD, fontFace: SANS, charSpacing: 0.8, margin: 0 });
  });
  s.addText('Make the student name the rule that is broken before they touch a slider. Cases 5 and 8 are the two that separate the class.',
    { x: 0.75, y: 6.24, w: 11.85, h: 0.34, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 9 · P1 PAPER + REPORT ==================== */
{
  const s = slide('PRACTICAL 1 · THE REPORT', 'The question paper and the report it produces');
  s.addText('Practical question paper', { x: 0.75, y: 1.78, w: 5.8, h: 0.34,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  const rows = [[th('Section'), th('Task'),
                 { text: 'Marks', options: { bold: true, fill: HEAD, color: DEEP, align: 'right' } }]].concat(
    P1.paper.map(p => [{ text: p[0], options: { bold: true, color: DEEP } }, p[1],
                       { text: p[2], options: { align: 'right', bold: true, color: CR } }]));
  table(s, rows, { x: 0.75, y: 2.2, w: 5.8, colW: [1.15, 3.35, 1.3], rowH: 0.42, fontSize: 12 });
  s.addText('Papers are assigned by code, so adjacent students do not receive the same one.',
    { x: 0.75, y: 4.6, w: 5.8, h: 0.5, fontSize: 11.5, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });

  s.addText('The generated report', { x: 6.9, y: 1.78, w: 5.7, h: 0.34,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 2.2, w: 5.7, h: 3.9, rectRadius: 0.06,
    fill: { color: CARD }, line: { color: LINE, width: 0.75 } });
  P1.report.forEach((r, i) => {
    s.addText(String(i + 1).padStart(2, '0'), { x: 7.15, y: 2.36 + i * 0.365, w: 0.45, h: 0.3,
      fontSize: 10, bold: true, color: GOLD, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(r, { x: 7.62, y: 2.36 + i * 0.365, w: 4.8, h: 0.3, fontSize: 12,
      color: INK, fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('Downloadable as PDF, with student and faculty signature blocks.',
    { x: 6.9, y: 6.2, w: 5.7, h: 0.3, fontSize: 11.5, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 10 · P1 TEACHING ========================= */
{
  const s = slide('PRACTICAL 1', 'Teaching notes for the demonstrator');
  P1.teach.forEach((t, i) => {
    const y = 1.85 + i * 1.19;
    card(s, 0.75, y, 11.85, 1.04, ['Rules are guidance', 'Predictions, not measurements',
      'Name the fault first', 'Fill the table live'][i], t, { pip: i + 1, hs: 13.5, bs: 11.5 });
  });
  s.addNotes('These four notes come from the lab’s own teaching guidance and should be repeated in every batch.');
}

/* ============================ 11 · SECTION P2 ========================== */
sectionSlide('2', 'PRACTICAL TWO', 'Data Breach Response Simulation', P2.sub, P2.no)
  .addNotes('Practical 2 sits in Unit 3. The student is the responsible pharmacist during a live patient-data breach.');

/* ============================ 12 · P2 AIM ============================== */
{
  const s = slide(P2.no.toUpperCase(), 'Aim and the incident');
  card(s, 0.75, 1.8, 7.3, 2.5, 'Aim', P2.aim, { hs: 15, bs: 12.5 });
  card(s, 8.3, 1.8, 4.3, 2.5, 'The incident', null, { hs: 15 });
  s.addText('INC-2026-0803', { x: 8.54, y: 2.24, w: 3.85, h: 0.46, fontSize: 22, bold: true,
    color: CR, fontFace: SERIF, margin: 0 });
  s.addText('A live personal-data breach in a hospital pharmacy. The inbox fills as the incident develops — the student responds while it is still running.',
    { x: 8.54, y: 2.76, w: 3.85, h: 1.4, fontSize: 11.5, color: MUT, fontFace: SANS,
      valign: 'top', margin: 0 });

  s.addText('What the student must do, in order', { x: 0.75, y: 4.56, w: 11.85, h: 0.36,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  const steps = [['Contain', 'Secure what you control'],
                 ['Assess', 'Scope and risk of harm'],
                 ['Decide', 'Notifiable under the DPDP Act?'],
                 ['Respond', 'Access request · refuse the press'],
                 ['Prevent', 'The action that stops a repeat']];
  steps.forEach((st, i) => {
    const x = 0.75 + i * 2.4;
    card(s, x, 5.0, 2.25, 1.24, st[0], st[1], { pip: i + 1, hs: 13, bs: 10.5 });
  });
}

/* ---- P2 PRINCIPLE ---- */
principleSlide(2, 'PRACTICAL 2');

/* ============================ 13 · P2 TIMELINE ========================= */
{
  const s = slide('PRACTICAL 2 · THE CLOCK', 'Four events, arriving while the response is live');
  P2.timeline.forEach((t, i) => {
    const y = 1.85 + i * 1.19;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 1.04,
      rectRadius: 0.06, fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    s.addText(t[0], { x: 1.0, y: y + 0.3, w: 1.5, h: 0.44, fontSize: 15, bold: true,
      color: CR, fontFace: SERIF, valign: 'middle', margin: 0 });
    s.addText(t[1], { x: 2.65, y: y + 0.16, w: 6.4, h: 0.4, fontSize: 14, bold: true,
      color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(t[2], { x: 2.65, y: y + 0.56, w: 9.6, h: 0.36, fontSize: 11.5,
      color: MUT, fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('The subject access request and the press call land mid-incident on purpose. Handling pressure under time is the skill being assessed.',
    { x: 0.75, y: 6.62, w: 11.85, h: 0.34, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 14 · P2 RUBRIC =========================== */
{
  const s = slide('PRACTICAL 2 · THE RUBRIC', 'What the lab checks as you work');
  const max = 25;
  P2.rubric.forEach((r, i) => {
    const y = 1.85 + i * 0.74;
    s.addText(r[0], { x: 0.75, y: y, w: 4.6, h: 0.5, fontSize: 13.5, color: INK,
      fontFace: SANS, valign: 'middle', margin: 0 });
    const bw = (r[1] / max) * 5.6;
    s.addShape(pptx.ShapeType.roundRect, { x: 5.5, y: y + 0.11, w: 5.6, h: 0.28,
      rectRadius: 0.14, fill: { color: 'EDE4DE' }, line: { color: 'EDE4DE' } });
    s.addShape(pptx.ShapeType.roundRect, { x: 5.5, y: y + 0.11, w: bw, h: 0.28,
      rectRadius: 0.14, fill: { color: i === 0 ? CR : GOLD }, line: { color: i === 0 ? CR : GOLD } });
    s.addText(String(r[1]), { x: 11.25, y: y, w: 1.0, h: 0.5, fontSize: 14, bold: true,
      color: DEEP, fontFace: SANS, align: 'right', valign: 'middle', margin: 0 });
  });
  s.addText('These weights tell you what the lab is looking for — they are not your module mark.',
    { x: 0.75, y: 6.82, w: 11.85, h: 0.3, fontSize: 11.5, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
  s.addText('100', { x: 11.25, y: 6.34, w: 1.0, h: 0.4, fontSize: 16, bold: true,
    color: CR, fontFace: SERIF, align: 'right', valign: 'middle', margin: 0 });
  s.addText('Total', { x: 0.75, y: 6.34, w: 3.0, h: 0.4, fontSize: 13.5, bold: true,
    color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
  s.addNotes('Containment is weighted highest at 25 because it is the only stage that limits the harm. Preventive action at 10 is the one students skip.');
}

/* ============================ 15 · P2 TEACHING ========================= */
{
  const s = slide('PRACTICAL 2', 'Teaching notes for the demonstrator');
  P2.teach.forEach((t, i) => {
    const y = 1.85 + i * 1.19;
    card(s, 0.75, y, 11.85, 1.04, ['Containment is ordered', 'Notifiability is argued',
      'The pressure is the point', 'Do not skip prevention'][i], t, { pip: i + 1, hs: 13.5, bs: 11.5 });
  });
}

/* ============================ 16 · SECTION P3 ========================== */
sectionSlide('3', 'PRACTICAL THREE', 'RxDetect', 'Digital drug information & formulary investigation', P3.no)
  .addNotes('Practical 3 sits in Unit 4. The student is the Clinical Pharmacist at CityCare Digital Hospital verifying one complex prescription.');

/* ============================ 17 · P3 AIM ============================== */
{
  const s = slide(P3.no.toUpperCase(), 'Aim and the shift');
  card(s, 0.75, 1.78, 7.3, 1.78, 'Aim', P3.aim, { hs: 15, bs: 12 });
  card(s, 8.3, 1.78, 4.3, 1.78, 'Your shift', 'Clinical Pharmacist, CityCare Digital Hospital. An urgent case arrives from Internal Medicine: a 68-year-old man on anticoagulation whose prescription needs verification. Nothing is handed to you.',
    { hs: 15, bs: 11.5 });

  s.addText('The patient', { x: 0.75, y: 3.92, w: 5.8, h: 0.34, fontSize: 16, bold: true,
    color: DEEP, fontFace: SERIF, margin: 0 });
  const prows = P3.patient.map(p => [{ text: p[0], options: { color: MUT } },
    { text: p[1], options: { bold: p[0] === 'Known allergy', color: p[0] === 'Known allergy' ? CR : INK } }]);
  table(s, prows, { x: 0.75, y: 4.34, w: 5.8, colW: [2.2, 3.6], rowH: 0.44, fontSize: 11.5 });

  s.addText('The e-prescription · RX20381', { x: 6.9, y: 3.92, w: 5.7, h: 0.34,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  const rrows = [[th('Drug'), th('Strength'), th('Frequency')]].concat(
    P3.rx.map(r => [{ text: r[0], options: { bold: true, color: DEEP } }, r[1], r[2]]));
  table(s, rrows, { x: 6.9, y: 4.34, w: 5.7, colW: [2.7, 1.5, 1.5], rowH: 0.365, fontSize: 11 });
}

/* ---- P3 PRINCIPLE ---- */
principleSlide(3, 'PRACTICAL 3');

/* ============================ 18 · P3 PATHWAY ========================== */
{
  const s = slide('PRACTICAL 3 · THE CASE PATHWAY', 'Fifteen marked steps, in the order they arrive');
  const half = Math.ceil(P3.steps.length / 2);
  [[0, half, 0.75], [half, P3.steps.length, 6.9]].forEach(col => {
    const rows = [[th('#'), th('Step'), th('Marks')]].concat(
      P3.steps.slice(col[0], col[1]).map((st, i) => [
        { text: String(col[0] + i + 1), options: { color: GOLD, bold: true } },
        { text: st[0], options: { color: st[1] >= 10 ? DEEP : INK, bold: st[1] >= 10 } },
        { text: String(st[1]), options: { align: 'right', bold: true, color: st[1] >= 10 ? CR : MUT } }
      ]));
    table(s, rows, { x: col[2], y: 1.82, w: 5.7, colW: [0.5, 4.0, 1.2], rowH: 0.4, fontSize: 12 });
  });
  s.addText('The four heavy steps — interactions (20), database selection (10), the formulary alert (10) and verifying the AI (10) — carry half the mark between them.',
    { x: 0.75, y: 6.45, w: 11.85, h: 0.34, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 19 · P3 RUBRIC =========================== */
{
  const s = slide('PRACTICAL 3 · THE RUBRIC', 'Eight skills the lab weighs as you work');
  P3.rubric.forEach((r, i) => {
    const x = 0.75 + (i % 4) * 3.03, y = 1.9 + Math.floor(i / 4) * 1.62;
    s.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: 2.85, h: 1.42, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    s.addText(String(r[1]), { x: x + 0.22, y: y + 0.16, w: 2.4, h: 0.6, fontSize: 34,
      bold: true, color: r[1] >= 15 ? CR : GOLD, fontFace: SERIF, margin: 0 });
    s.addText(r[0], { x: x + 0.22, y: y + 0.8, w: 2.45, h: 0.5, fontSize: 12,
      color: INK, fontFace: SANS, valign: 'top', margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 5.42, w: 11.85, h: 1.0,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText([{ text: 'Where the marks really go: ', options: { bold: true, color: DEEP } },
             { text: 'finding an interaction earns nothing — judging whether it matters for this patient is what the lab weighs at 20. The case then advances 24 hours and the patient responds to the student’s decisions; a rewind is allowed and is recorded on the report. These weights are the lab’s feedback, not your module mark.',
               options: { color: INK } }],
    { x: 1.05, y: 5.56, w: 11.25, h: 0.75, fontSize: 12.5, fontFace: SANS, valign: 'middle', margin: 0 });
}

/* ============================ 20 · P3 TRAPS ============================ */
{
  const s = slide('PRACTICAL 3', 'The four things students get wrong');
  P3.traps.forEach((t, i) => {
    const y = 1.85 + i * 1.19;
    card(s, 0.75, y, 11.85, 1.04, t[0], t[1], { pip: i + 1, hs: 13.5, bs: 11.5 });
  });
  s.addText('The patient has a documented PENICILLIN allergy. Every antibiotic decision in the case must respect it — including the one the AI assistant recommends.',
    { x: 0.75, y: 6.62, w: 11.85, h: 0.34, fontSize: 12, italic: true, color: CR,
      fontFace: SANS, bold: true, margin: 0 });
}

/* ============================ SECTION · ASSIGNMENTS =================== */
{
  const s = darkSlide();
  s.addText('ASSIGNMENTS', { x: 0.9, y: 2.05, w: 10, h: 0.3, fontSize: 12, bold: true,
    color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText('Choose one topic', { x: 0.9, y: 2.5, w: 10.6, h: 0.9,
    fontSize: 38, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText('Four topics offered, one from each unit of Module 1', { x: 0.9, y: 3.5, w: 10.2, h: 0.45,
    fontSize: 16, color: 'BCB1A9', fontFace: SANS, margin: 0 });
  s.addText(BRIEF.instruction + ' It goes into one PDF with your practical reports, and that single file is uploaded to ' + PORTAL.site + '.',
    { x: 0.9, y: 4.1, w: 9.8, h: 0.8, fontSize: 13, color: '8A7F79', fontFace: SANS, margin: 0 });
  pip(s, 11.35, 2.12, '4', { d: 1.0, fs: 34, fill: CR });
}

/* ============================ THE FOUR TOPICS ========================= */
{
  const s = slide('ASSIGNMENTS', 'The four topics on offer');
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 1.76, w: 11.85, h: 0.62,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText([{ text: 'Instructions — ', options: { bold: true, color: CR } },
             { text: BRIEF.instruction, options: { color: DEEP, bold: true } }],
    { x: 1.05, y: 1.76, w: 11.25, h: 0.62, fontSize: 13.5, fontFace: SANS,
      valign: 'middle', margin: 0 });
  ASSIGN.forEach((a, i) => {
    const y = 2.58 + i * 1.0, rec = a.n === BRIEF.recommended;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 0.92,
      rectRadius: 0.06, fill: { color: rec ? 'FBF6EF' : CARD },
      line: { color: rec ? GOLD : LINE, width: rec ? 1.25 : 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    pip(s, 0.97, y + 0.26, a.n, { d: 0.4, fs: 13, fill: rec ? GOLD : CR });
    s.addText(a.title, { x: 1.55, y: y + 0.1, w: rec ? 8.9 : 10.8, h: 0.42, fontSize: 12.5,
      bold: true, color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(strip(a.brief), { x: 1.55, y: y + 0.5, w: 10.8, h: 0.34, fontSize: 10.5,
      color: MUT, fontFace: SANS, valign: 'middle', margin: 0 });
    if (rec) {
      s.addShape(pptx.ShapeType.roundRect, { x: 10.62, y: y + 0.27, w: 1.72, h: 0.38,
        rectRadius: 0.18, fill: { color: GOLD }, line: { color: GOLD } });
      s.addText('RECOMMENDED', { x: 10.62, y: y + 0.27, w: 1.72, h: 0.38, fontSize: 9,
        bold: true, color: WHITE, fontFace: SANS, align: 'center', valign: 'middle',
        charSpacing: 0.6, margin: 0 });
    }
  });
  s.addText('Full topic briefs, with the points each one must cover, are in the Module 1 Assignments deck.',
    { x: 0.75, y: 6.66, w: 11.85, h: 0.32, fontSize: 11.5, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
  s.addNotes('Students choose one topic. Topic ' + BRIEF.recommended + ' is recommended: ' + BRIEF.why);
}

/* ============================ SECTION · SUBMITTING ==================== */
{
  const s = darkSlide();
  s.addText('SUBMITTING YOUR WORK', { x: 0.9, y: 2.05, w: 10, h: 0.3, fontSize: 12,
    bold: true, color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText('One PDF, uploaded to ' + PORTAL.site, { x: 0.9, y: 2.5, w: 11, h: 0.9,
    fontSize: 36, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText('Your practical reports and your assignment travel together',
    { x: 0.9, y: 3.5, w: 10.2, h: 0.45, fontSize: 16, color: 'BCB1A9', fontFace: SANS, margin: 0 });
  s.addText('The portal accepts one live submission per module, so Module 1 is submitted once, as a single complete file.',
    { x: 0.9, y: 4.1, w: 9.8, h: 0.8, fontSize: 13, color: '8A7F79', fontFace: SANS, margin: 0 });
}

/* ============================ THE FLOW =============================== */
{
  const s = slide('SUBMITTING', 'What to do after each practical');
  const steps = [
    ['Finish the practical', 'Complete the lab in ALIZON AOS and answer its question paper.'],
    ['Generate the report', 'Use Generate Report at the end of the lab — it writes up your Aim, Method, Observation, Result and Conclusion.'],
    ['Download it as PDF', 'Save it. Do this after every practical — you need all three reports before you can submit.'],
    ['Write your chosen topic', BRIEF.instruction],
    ['Combine into one PDF', 'Three practical reports, then your assignment, as a single file under 10 MB.'],
    ['Upload to ' + PORTAL.site, PORTAL.path + ' → choose Module 1 → title it → attach the PDF → Upload.']
  ];
  steps.forEach((t, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.82 + Math.floor(i / 2) * 1.6;
    card(s, x, y, 5.8, 1.42, t[0], t[1], { pip: i + 1, hs: 13.5, bs: 11.5 });
  });
  s.addText('Keep your own copy of every report. Once a submission is approved the portal will not accept another for that module.',
    { x: 0.75, y: 6.68, w: 11.85, h: 0.32, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
  s.addNotes('The three practical reports are downloaded as you go, one after each lab, then submitted together with the assignment answers as a single Module 1 PDF.');
}

/* ============================ THE UPLOAD FORM ======================== */
{
  const s = slide('SUBMITTING', 'The upload form, field by field');
  s.addText(PORTAL.path, { x: 0.75, y: 1.78, w: 11.85, h: 0.36, fontSize: 15, bold: true,
    color: CR, fontFace: SANS, margin: 0 });
  PORTAL.fields.forEach((f, i) => {
    const y = 2.24 + i * 0.86;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 0.72,
      rectRadius: 0.06, fill: { color: CARD }, line: { color: LINE, width: 0.75 } });
    s.addText(f[0], { x: 1.05, y: y, w: 2.2, h: 0.72, fontSize: 13.5, bold: true,
      color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(f[1], { x: 3.35, y: y, w: 8.95, h: 0.72, fontSize: 12.5, color: MUT,
      fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('The rules the portal enforces', { x: 0.75, y: 4.92, w: 11.85, h: 0.34,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  PORTAL.rules.forEach((r, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 5.34 + Math.floor(i / 2) * 0.82;
    s.addText([{ text: r[0] + ' — ', options: { bold: true, color: CR } },
               { text: r[1], options: { color: INK } }],
      { x: x, y: y, w: 5.8, h: 0.74, fontSize: 11.5, fontFace: SANS, valign: 'top',
        margin: 0, lineSpacingMultiple: 1.05 });
  });
}

/* ============================ AFTER YOU SUBMIT ======================= */
{
  const s = slide('SUBMITTING', 'What happens after you upload');
  PORTAL.statuses.forEach((st, i) => {
    const x = 0.75 + i * 4.0;
    s.addShape(pptx.ShapeType.roundRect, { x: x, y: 1.82, w: 3.8, h: 2.3, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.26, y: 2.06, w: 1.5, h: 0.38,
      rectRadius: 0.18, fill: { color: st[2] }, line: { color: st[2] } });
    s.addText(st[0], { x: x + 0.26, y: 2.06, w: 1.5, h: 0.38, fontSize: 11.5, bold: true,
      color: WHITE, fontFace: SANS, align: 'center', valign: 'middle', margin: 0 });
    s.addText(st[1], { x: x + 0.26, y: 2.6, w: 3.28, h: 1.3, fontSize: 12, color: INK,
      fontFace: SANS, valign: 'top', margin: 0, lineSpacingMultiple: 1.08 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 4.42, w: 11.85, h: 1.1,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText([{ text: 'If your work is rejected: ', options: { bold: true, color: DEEP } },
             { text: 'read the feedback, correct the file and upload it again within the resubmission window — 45 days from the date it was graded, unless your programme sets a different figure. After that the window closes and the portal will not take it.',
               options: { color: INK } }],
    { x: 1.05, y: 4.54, w: 11.25, h: 0.88, fontSize: 12.5, fontFace: SANS, valign: 'middle', margin: 0 });
  s.addText('Your marks appear against Module 1 on your dashboard once the submission is approved. Marks are never shown inside ALIZON AOS.',
    { x: 0.75, y: 5.74, w: 11.85, h: 0.4, fontSize: 12.5, bold: true, color: DEEP,
      fontFace: SANS, margin: 0 });
  s.addNotes('Statuses and the 45-day resubmission default are the portal\'s own rules, read from its source. Individual programmes may set a different resubmission window.');
}

/* ============================ 29 · CLOSING ============================= */
{
  const s = darkSlide();
  s.addText('MODULE 1 · SUMMARY', { x: 0.9, y: 1.5, w: 10, h: 0.3, fontSize: 12,
    bold: true, color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText('What a student leaves Module 1 able to do',
    { x: 0.9, y: 1.95, w: 10.6, h: 0.9, fontSize: 34, bold: true, color: WHITE,
      fontFace: SERIF, margin: 0 });
  const out = [
    'Judge a candidate molecule against Lipinski’s and Veber’s rules, and explain a violation rather than fear it',
    'Run the first hour of a patient-data breach: contain, assess, decide notifiability under the DPDP Act, refuse an improper disclosure',
    'Verify a complex prescription from primary sources, and say why an interaction matters for this patient',
    'Choose the right information source for the question being asked',
    'Check an AI clinical output claim by claim, and act when it is wrong',
    'Assemble the module into one PDF and submit it correctly on ' + PORTAL.site
  ];
  out.forEach((t, i) => {
    const y = 3.05 + i * 0.66;
    pip(s, 0.9, y, i + 1, { d: 0.38, fs: 12, fill: CR });
    s.addText(t, { x: 1.48, y: y - 0.03, w: 10.9, h: 0.44, fontSize: 13.5,
      color: 'D9CFC7', fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('Alizon School of Medical & Digital Intelligence · alizongov.com',
    { x: 0.9, y: 6.75, w: 11, h: 0.32, fontSize: 11, color: '7C716A', fontFace: SANS, margin: 0 });
}

pptx.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));
