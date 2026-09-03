/* =====================================================================
   ALIZON — Pharmacy AI · MODULE 1
   Assignments deck — a standalone student handout.

   Four questions, one per unit of Module 1, plus the alizongov.com
   submission rules. The questions and the portal policy are shared with
   the practicals deck via tools-m1-assignment-data.js, so the two decks
   cannot drift apart. The upload rules in that file are read from the
   portal's own source:
     · src/lib/student-constants.ts        PDF only, 10 MB, 45-day resubmission
     · src/lib/assignment-upload-policy.ts one live submission per module
     · src/components/student/StudentDashboardView.tsx  the upload form

   Run:  node tools-build-m1-assignments-deck.js [outfile]
   ===================================================================== */
const PptxGenJS = require('pptxgenjs');
const { ASSIGN, PORTAL, BRIEF } = require('./tools-m1-assignment-data.js');

const OUT = process.argv[2] ||
  '/Users/kukku/Desktop/ALIZON-Pharmacy-Module-1-Assignments.pptx';

/* ---------------- house palette (matches the ALIZON teaching decks) ---- */
const CR = '8C1515', GOLD = '9A7B3F', INK = '26221F', MUT = '6E6A63',
      PAPER = 'FAF8F6', CARD = 'FFFFFF', LINE = 'E4DBD4',
      DARK = '14100F', DEEP = '2E1010', WHITE = 'FFFFFF',
      TINT = 'F7EFEC', HEAD = 'EFE7E1', GREEN = '2C5F2D';
const SERIF = 'Cambria', SANS = 'Calibri';
const W = 13.333, H = 7.5;

const strip = s => String(s || '').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Alizon School of Medical & Digital Intelligence';
pptx.company = 'Alizon School of Medical and Digital Intelligence';
pptx.title = 'Pharmacy AI · Module 1 · Assignments';
pptx.subject = 'Module 1 — AI Foundations & Digital Systems for Pharmacy Practice';

function foot(s) {
  s.addText('ALIZON AOS · Pharmacy AI · Module 1 — Assignments',
    { x: 0.62, y: H - 0.52, w: 9.5, h: 0.32, fontSize: 9.5, color: MUT,
      fontFace: SANS, valign: 'middle', margin: 0 });
}
function pip(s, x, y, label, o) {
  o = o || {};
  const d = o.d || 0.42;
  s.addShape(pptx.ShapeType.ellipse, { x: x, y: y, w: d, h: d,
    fill: { color: o.fill || CR }, line: { color: o.fill || CR } });
  s.addText(String(label), { x: x, y: y, w: d, h: d, fontSize: o.fs || 13, bold: true,
    color: WHITE, fontFace: SANS, align: 'center', valign: 'middle', margin: 0 });
}
function slide(kicker, title, o) {
  o = o || {};
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  s.addText(kicker, { x: 0.62, y: 0.42, w: 12.1, h: 0.3, fontSize: 11, bold: true,
    color: CR, fontFace: SANS, charSpacing: 1.6, margin: 0 });
  s.addText(title, { x: 0.62, y: 0.76, w: o.tw || 12.1, h: o.th || 0.72,
    fontSize: o.ts || 30, bold: true, color: INK, fontFace: SERIF, margin: 0 });
  foot(s);
  return s;
}
function darkSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.ellipse, { x: 9.6, y: -2.2, w: 6.6, h: 6.6,
    fill: { color: DEEP }, line: { color: DEEP } });
  return s;
}
function table(s, rows, o) {
  o = o || {};
  s.addTable(rows, {
    x: o.x || 0.75, y: o.y || 1.85, w: o.w || 11.85, colW: o.colW, rowH: o.rowH || 0.34,
    fontSize: o.fontSize || 13, fontFace: SANS, color: INK,
    border: { type: 'solid', pt: 0.5, color: LINE },
    fill: { color: CARD }, align: 'left', valign: 'middle', margin: [4, 8, 4, 8]
  });
}
const th = t => ({ text: t, options: { bold: true, fill: HEAD, color: DEEP } });

function card(s, x, y, w, h, head, body, o) {
  o = o || {};
  s.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: w, h: h, rectRadius: 0.06,
    fill: { color: o.fill || CARD }, line: { color: LINE, width: 0.75 },
    shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
  const ty = y + 0.16;
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

/* ============================ 1 · TITLE =============================== */
{
  const s = darkSlide();
  s.addText('ALIZON', { x: 0.9, y: 0.72, w: 6, h: 0.4, fontSize: 15, bold: true,
    color: GOLD, fontFace: SERIF, charSpacing: 5, margin: 0 });
  s.addText('School of Medical & Digital Intelligence', { x: 0.9, y: 1.08, w: 7, h: 0.3,
    fontSize: 11, color: '9A8F88', fontFace: SANS, margin: 0 });
  s.addText('Module 1 — Assignments', { x: 0.9, y: 2.15, w: 11, h: 0.95,
    fontSize: 46, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText('AI Foundations & Digital Systems for Pharmacy Practice',
    { x: 0.9, y: 3.12, w: 10.6, h: 0.45, fontSize: 19, color: 'D9CFC7', fontFace: SANS, margin: 0 });
  s.addText(BRIEF.instruction,
    { x: 0.9, y: 3.62, w: 10.6, h: 0.4, fontSize: 14, color: '9A8F88', fontFace: SANS, margin: 0 });

  [['4', 'Topics offered'], ['1', 'You choose one'], [BRIEF.length.split('\u2013')[0] + '+', 'Words']].forEach((it, i) => {
    const x = 0.9 + i * 2.75;
    s.addText(it[0], { x: x, y: 4.62, w: 2.5, h: 0.72, fontSize: 44, bold: true,
      color: GOLD, fontFace: SERIF, margin: 0 });
    s.addText(it[1], { x: x, y: 5.34, w: 2.5, h: 0.3, fontSize: 12, color: 'BCB1A9',
      fontFace: SANS, charSpacing: 1, margin: 0 });
  });
  s.addText('Submitted on ' + PORTAL.site + ' · Certificate Course in Digital Health & Artificial Intelligence for Pharmacy',
    { x: 0.9, y: 6.6, w: 11, h: 0.32, fontSize: 11, color: '7C716A', fontFace: SANS, margin: 0 });
  s.addNotes('Hand this deck to the batch at the start of Module 1. Students pick ONE topic — they do not write all four.');
}

/* ============================ 2 · READ THIS FIRST ===================== */
{
  const s = slide('READ THIS FIRST', 'Choose one topic, then submit it');
  const pts = [
    ['Choose ONE topic', 'Four topics are offered, one from each unit of Module 1. You write on one of them only — not all four.'],
    ['About ' + BRIEF.length, 'Roughly. A little over or under is fine; a page and a half is not.'],
    ['Write in your own words', 'Name your sources. Copied text scores nothing, and a paragraph that could have been written without reading the unit scores little more.'],
    ['ALIZON AOS does not mark you', 'The labs give you practice feedback only. No mark for this module exists inside ALIZON AOS.'],
    ['Everything is marked on ' + PORTAL.site, 'Your write-up travels with your three practical reports in one PDF, uploaded to the portal. That upload is your submission.'],
    ['One submission per module', 'The portal accepts one live submission for Module 1. Send the complete work the first time — you cannot add to it later.']
  ];
  pts.forEach((t, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.82 + Math.floor(i / 2) * 1.52;
    card(s, x, y, 5.8, 1.36, t[0], t[1], { pip: i + 1, hs: 13.5, bs: 11 });
  });
  s.addNotes('Read this slide out. The commonest mistake is a student assuming the score the lab shows is their assignment mark.');
}

/* ============================ 3 · AT A GLANCE ========================= */
{
  const s = slide('MODULE 1 · ASSIGNMENT TOPICS', 'Choose any one of these four');
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 1.76, w: 11.85, h: 0.62,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText([{ text: 'Instructions — ', options: { bold: true, color: CR } },
             { text: BRIEF.instruction, options: { color: DEEP, bold: true } }],
    { x: 1.05, y: 1.76, w: 11.25, h: 0.62, fontSize: 13.5, fontFace: SANS,
      valign: 'middle', margin: 0 });
  ASSIGN.forEach((a, i) => {
    const y = 2.58 + i * 0.98, rec = a.n === BRIEF.recommended;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: y, w: 11.85, h: 0.9,
      rectRadius: 0.06, fill: { color: rec ? 'FBF6EF' : CARD },
      line: { color: rec ? GOLD : LINE, width: rec ? 1.25 : 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    pip(s, 0.97, y + 0.25, a.n, { d: 0.4, fs: 13, fill: rec ? GOLD : CR });
    s.addText(a.title, { x: 1.55, y: y + 0.1, w: rec ? 8.9 : 10.8, h: 0.42, fontSize: 13,
      bold: true, color: DEEP, fontFace: SANS, valign: 'middle', margin: 0 });
    s.addText(a.unit, { x: 1.55, y: y + 0.5, w: 10.8, h: 0.3, fontSize: 11,
      color: MUT, fontFace: SANS, valign: 'middle', margin: 0 });
    if (rec) {
      s.addShape(pptx.ShapeType.roundRect, { x: 10.62, y: y + 0.26, w: 1.72, h: 0.38,
        rectRadius: 0.18, fill: { color: GOLD }, line: { color: GOLD } });
      s.addText('RECOMMENDED', { x: 10.62, y: y + 0.26, w: 1.72, h: 0.38, fontSize: 9,
        bold: true, color: WHITE, fontFace: SANS, align: 'center', valign: 'middle',
        charSpacing: 0.6, margin: 0 });
    }
  });
  s.addText([{ text: 'Why Topic ' + BRIEF.recommended + ' is recommended — ', options: { bold: true, color: DEEP } },
             { text: BRIEF.why, options: { color: INK } }],
    { x: 0.75, y: 6.56, w: 11.85, h: 0.42, fontSize: 12, fontFace: SANS,
      valign: 'middle', margin: 0 });
  s.addNotes('Students choose one. Topic ' + BRIEF.recommended + ' is recommended but not compulsory.');
}

/* ============================ 4–7 · THE TOPICS ======================== */
ASSIGN.forEach(a => {
  const rec = a.n === BRIEF.recommended;
  const s = slide('TOPIC ' + a.n + ' · ' + a.unit.toUpperCase(), a.title,
    { ts: 23, th: 1.1, tw: 11.4 });
  if (rec) {
    s.addShape(pptx.ShapeType.roundRect, { x: 10.3, y: 0.38, w: 1.72, h: 0.38,
      rectRadius: 0.18, fill: { color: GOLD }, line: { color: GOLD } });
    s.addText('RECOMMENDED', { x: 10.3, y: 0.38, w: 1.72, h: 0.38, fontSize: 9, bold: true,
      color: WHITE, fontFace: SANS, align: 'center', valign: 'middle', charSpacing: 0.6, margin: 0 });
  }
  s.addShape(pptx.ShapeType.roundRect, { x: 0.75, y: 2.02, w: 11.85, h: 1.0,
    rectRadius: 0.06, fill: { color: TINT }, line: { color: 'E7CFCF', width: 0.75 } });
  s.addText(strip(a.brief), { x: 1.05, y: 2.02, w: 11.25, h: 1.0, fontSize: 13.5,
    color: DEEP, fontFace: SANS, valign: 'middle', margin: 0, lineSpacingMultiple: 1.08 });

  s.addText('Make sure you cover', { x: 0.75, y: 3.26, w: 11.85, h: 0.34,
    fontSize: 16, bold: true, color: DEEP, fontFace: SERIF, margin: 0 });
  const n = a.cover.length, perRow = n > 6 ? 4 : (n > 3 ? 3 : 2);
  const cw = (11.85 - (perRow - 1) * 0.2) / perRow;
  a.cover.forEach((c, i) => {
    const x = 0.75 + (i % perRow) * (cw + 0.2);
    const y = 3.72 + Math.floor(i / perRow) * 0.86;
    s.addShape(pptx.ShapeType.roundRect, { x: x, y: y, w: cw, h: 0.72, rectRadius: 0.06,
      fill: { color: CARD }, line: { color: LINE, width: 0.75 },
      shadow: { type: 'outer', angle: 90, blur: 6, offset: 0.03, color: 'BBB0A8', opacity: 0.28 } });
    s.addText(strip(c), { x: x + 0.18, y: y, w: cw - 0.36, h: 0.72, fontSize: 12,
      bold: true, color: INK, fontFace: SANS, valign: 'middle', margin: 0,
      lineSpacingMultiple: 1.02 });
  });
  s.addText('Approximately ' + BRIEF.length + ' · in your own words, with your sources named',
    { x: 0.75, y: 6.72, w: 11.85, h: 0.32, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
  pip(s, 12.35, 0.38, a.n, { d: 0.52, fs: 17 });
  s.addNotes('Topic ' + a.n + ' — ' + a.unit + '. ' + strip(a.brief));
});

/* ============================ 8 · SECTION SUBMITTING ================== */
{
  const s = darkSlide();
  s.addText('SUBMITTING YOUR WORK', { x: 0.9, y: 2.05, w: 10, h: 0.3, fontSize: 12,
    bold: true, color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText('One PDF, uploaded to ' + PORTAL.site, { x: 0.9, y: 2.5, w: 11, h: 0.9,
    fontSize: 36, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  s.addText('Your write-up travels with your three practical reports',
    { x: 0.9, y: 3.5, w: 10.2, h: 0.45, fontSize: 16, color: 'BCB1A9', fontFace: SANS, margin: 0 });
  s.addText('The portal accepts one live submission per module, so Module 1 is submitted once, as a single complete file.',
    { x: 0.9, y: 4.1, w: 9.8, h: 0.8, fontSize: 13, color: '8A7F79', fontFace: SANS, margin: 0 });
}

/* ============================ 9 · THE FLOW ============================ */
{
  const s = slide('SUBMITTING', 'Building your Module 1 file');
  const steps = [
    ['Finish each practical', 'Complete all three labs in ALIZON AOS and answer each question paper.'],
    ['Download each report', 'Use Generate Report at the end of every lab and save the PDF. Do it as you go — you need all three.'],
    ['Write your chosen topic', 'About ' + BRIEF.length + ', covering every point listed under that topic.'],
    ['Combine into one PDF', 'Three practical reports first, then your assignment, as a single file under 10 MB.'],
    ['Upload it', PORTAL.path + ' → choose Module 1 → give it a title → attach the PDF → Upload.'],
    ['Keep your own copy', 'Once a submission is approved the portal will not accept another for this module.']
  ];
  steps.forEach((t, i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.82 + Math.floor(i / 2) * 1.6;
    card(s, x, y, 5.8, 1.42, t[0], t[1], { pip: i + 1, hs: 13.5, bs: 11.5 });
  });
  s.addText('Name the file so a stranger can identify it — your registration number, the module and the date.',
    { x: 0.75, y: 6.68, w: 11.85, h: 0.32, fontSize: 12, italic: true, color: MUT,
      fontFace: SANS, margin: 0 });
}

/* ============================ 10 · THE UPLOAD FORM ==================== */
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

/* ============================ 11 · AFTER YOU SUBMIT =================== */
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
}

/* ============================ 12 · CHECKLIST ========================== */
{
  const s = darkSlide();
  s.addText('BEFORE YOU UPLOAD', { x: 0.9, y: 1.5, w: 10, h: 0.3, fontSize: 12,
    bold: true, color: GOLD, fontFace: SANS, charSpacing: 3, margin: 0 });
  s.addText('Check all eight, then submit', { x: 0.9, y: 1.95, w: 10.6, h: 0.9,
    fontSize: 34, bold: true, color: WHITE, fontFace: SERIF, margin: 0 });
  const list = [
    'All three practical reports are downloaded and included',
    'My chosen topic is written up, covering every listed point',
    'It is in my own words, about ' + BRIEF.length + ', with sources named',
    'No patient name, hospital number or date of birth appears anywhere',
    'Everything is in ONE file, in order, and the file is a PDF',
    'The file is under 10 MB',
    'The file is named with my registration number and the module',
    'I have kept my own copy of the whole submission'
  ];
  list.forEach((t, i) => {
    const x = 0.9 + (i % 2) * 5.9, y = 3.1 + Math.floor(i / 2) * 0.78;
    pip(s, x, y, '✓', { d: 0.36, fs: 13, fill: CR });
    s.addText(t, { x: x + 0.52, y: y - 0.03, w: 5.2, h: 0.42, fontSize: 12.5,
      color: 'D9CFC7', fontFace: SANS, valign: 'middle', margin: 0 });
  });
  s.addText('Alizon School of Medical & Digital Intelligence · ' + PORTAL.site,
    { x: 0.9, y: 6.75, w: 11, h: 0.32, fontSize: 11, color: '7C716A', fontFace: SANS, margin: 0 });
}

pptx.writeFile({ fileName: OUT }).then(() => console.log('wrote', OUT));
