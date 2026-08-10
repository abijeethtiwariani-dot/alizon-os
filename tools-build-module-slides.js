/* =====================================================================
   ALIZON — builds a 25-slide teaching deck for every module, entirely from
   the institution's own material:
     · alizon-book-mN.js         the module textbook (@chapter/@section/@table/@note…)
     · briefs.json               the practical briefs (from alizon-experiment-data.js)
     · alizon-exam-bank-mN.js    the unit structure and question counts
   Nothing on a slide is invented.
   ===================================================================== */
const fs = require('fs'), path = require('path');
const PptxGenJS = require('pptxgenjs');

const DEPLOY = '/Users/kukku/Desktop/junk/alizon-os-deploy';
const OUT    = process.argv[2] || path.join(DEPLOY, 'resources/slides');
const BRIEFS = JSON.parse(fs.readFileSync(path.join(__dirname, 'briefs.json'), 'utf8'));

const CR='8C1515', GOLD='9A7B3F', INK='26221F', MUT='6E6A63',
      PAPER='FAF8F6', LINE='DDD5CE', WHITE='FFFFFF', DARK='14100F', DEEP='2E1010';
const SERIF='Cambria', SANS='Calibri';
const W=13.333, H=7.5, TARGET=25;

/* markers that carry teaching content worth its own slide */
const BOXES = { note:'Note', know:'Did you know?', caution:'Caution',
                keyterms:'Key terms', objectives:'Unit objectives', summary:'Summary' };
/* deliberately skipped: activity (the practical slides cover these),
   exercise (self-test), diagram / fig (layout hints) */
const SKIP = { activity:1, exercise:1, diagram:1, fig:1 };

/* the textbooks use ALL CAPS for emphasis; on a slide that just reads as shouting.
   Runs of 3+ capitalised words are folded back to normal case, keeping acronyms. */
const ACRO = new Set(('AI ML DL NLP IOT AR VR EHR EMR HIS LIS CPOE BCMA CDSS TDM EBP '
  + 'ADR ADE ADRS ADME PGX DNA RNA RCT PK PD GMP GCP GLP GDP ICH WHO FDA EMA CDSCO '
  + 'NABH NABL USP IP BP API APIS SOP SOPS QA QC IEC IRB CTMS EDC CRF SAE PSUR DSUR '
  + 'RFID ASRS ADC ADCS UDI GS1 FEFO FIFO ATC DDD ICU OPD IPD PPE HIPAA GDPR PVPI '
  + 'VAERS OSCE KUHS ASAP KPI ROI TAT OS IT US UK EU PDF CSV MCQ 2D 3D').split(' '));
function decaps(s) {
  return s.replace(/\b[A-Z][A-Z'’-]+(?:[,;:]?\s+[A-Z][A-Z'’-]+){2,}[,;:]?/g, run =>
    run.split(/\s+/).map(w =>
      ACRO.has(w.replace(/[^A-Z0-9]/g,'')) ? w : w.toLowerCase()).join(' '));
}
const clean = s => decaps(String(s||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&')
  .replace(/&nbsp;/g,' ').replace(/[“”]/g,'"').replace(/\s+/g,' ').trim())
  /* re-capitalise a sentence that began inside a folded run */
  .replace(/(^|[.!?]\s+)([a-z])/g, (m,a,b) => a + b.toUpperCase());

function fit(s, max) {
  s = clean(s);
  if (s.length <= max) return s;
  const cut = s.slice(0, max), i = cut.lastIndexOf(' ');
  return (i > max*0.6 ? cut.slice(0,i) : cut).replace(/[,;:.]$/,'') + '…';
}
const splitSent = s => String(s||'').split(/(?<=[.?!])\s+/).filter(Boolean);
const sentences = (s,n) => splitSent(s).slice(0,n).join(' ');

/* a slide title taken from the paragraph's own subject phrase */
const VERB = 'are|is|was|were|represents?|plays?|refers?|forms?|remains?|provides?|enables?'
  + '|allows?|ensures?|supports?|includes?|involves?|requires?|has|have|can|will|must'
  + '|serves?|offers?|combines?|helps?|occurs?|begins?|began|depends?|introduces?'
  + '|highlights?|presents?|contributes?|creates?|reduces?|improves?|transforms?'
  + '|integrates?|encompasses|comprises?|consists?|describes?|covers?|addresses?'
  + '|focuses?|aims?|leads?|emerged|emerges?|continues?|delivers?|generates?'
  + '|monitors?|tracks?|manages?|performs?|operates?|enhances?|represent|reflects?';
const SUBJ = new RegExp('^(.{4,66}?)\\s+(?:' + VERB + ')\\b');
/* discourse openers stripped before the subject can be read */
const LEAD = new RegExp('^(?:in conclusion|in summary|in addition|as a result|for example'
  + '|for instance|on the other hand|overall|furthermore|moreover|however|therefore|thus'
  + '|finally|additionally|consequently|importantly|notably|similarly|conversely'
  + '|by the end of this module'
  /* any short leading prepositional / subordinate clause: "In retail pharmacies, …" */
  + '|(?:in|for|with|by|through|across|within|during|at|on|from|despite|although|while'
  + '|as|since|beyond|under|over|unlike|besides|apart from|because of|due to|given)'
  + '\\s[^,]{3,64})[,:]\\s+', 'i');
const HEADWORD = /^(?:definition of|introduction to|overview of|the role of|the importance of|the concept of)\s+/i;
const TAIL = /\b(?:and|or|of|in|to|for|with|the|a|an|that|which|by|on|at|as|from|its|their|such|also|too|often|now|then|thus|still|already)$/i;
const GENERIC = /^(?:it|they|there|which|that|this|these|those|learners?|students?|users?|readers?|participants?|the (?:module|chapter|section|unit)|this (?:module|chapter|section|unit))$/i;
/* the source occasionally merges a heading into its paragraph
   ("Definition of Pharmacy Data Analytics Pharmacy data analytics refers to …") */
function dedupePhrase(t) {
  const w = t.split(' ');
  for (let len = Math.floor(w.length/2); len >= 2; len--)
    for (let i = 0; i + 2*len <= w.length; i++)
      if (w.slice(i,i+len).join(' ').toLowerCase() === w.slice(i+len,i+2*len).join(' ').toLowerCase())
        return w.slice(0, i+len).join(' ');
  return t;
}
function unitTitle(text, fallback) {
  let first = splitSent(text)[0] || '';
  for (let i = 0; i < 2 && LEAD.test(first); i++) first = first.replace(LEAD, '');
  /* drop an appositive: "Machine Learning (ML), a subset of AI, is transforming …" */
  first = first.replace(/^([^,]{4,60}),\s[^,]{3,60},\s(?=\w)/, '$1 ');
  const m = SUBJ.exec(first);
  if (m) {
    let t = dedupePhrase(m[1].trim())
      .replace(/^(?:the|a|an|these|this|such|both|one of the|one of)\s+/i, '')
      .replace(HEADWORD, '')
      .replace(/[,;]$/, '').trim();
    if (t.length >= 8 && t.length <= 60 && /[a-z]/.test(t) && !TAIL.test(t) && !GENERIC.test(t))
      return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return fallback;
}
/* "Table 3: Benefits and Limitations" -> "Benefits and Limitations" */
const tableTitle = (t, fb) => {
  const s = clean(t).replace(/^table\s*\d*\s*[:.–-]?\s*/i, '');
  if (s.length >= 6 && !/^(conclusion|introduction)$/i.test(s)) return s;
  return fb ? fb + ' at a glance' : 'At a glance';
};
const unquote = s => clean(s).replace(/^["'“”‘’]+/, '').replace(/["'“”‘’]+$/, '');

/* ---------------- parse a book into chapters of typed units ------------- */
function readBook(n) {
  const g = {};
  new Function('window', fs.readFileSync(path.join(DEPLOY, `alizon-book-m${n}.js`), 'utf8'))(g);
  return g.ALIZON_TEXTBOOKS['m' + n];
}
function parseBook(book) {
  const chapters = [];
  let ch = null, secTitle = null, mode = null, box = null, table = null, para = [];

  const flushPara = () => {
    if (!ch || !para.length) { para = []; return; }
    const bul = para.filter(p => /^[-•]\s+/.test(p));
    if (bul.length >= 2 && bul.length === para.length) {
      ch.units.push({ kind:'list', title: secTitle || ch.title, sec: secTitle || ch.title,
        items: para.map(p => clean(p.replace(/^[-•]\s+/,''))) });
      para = []; return;
    }
    const isConc = /^conclusion$/i.test(secTitle || '');
    const concT = `Unit ${chapters.length} summary`;   /* ch was just pushed */
    para.forEach(p => {
      const c = clean(p);
      /* too thin to fill a slide, or a colon lead-in to the table that follows.
         Every unit still has 8+ candidates at this threshold — see quota below. */
      if (c.length < 300 || /:$/.test(c)) return;
      const fb = isConc ? concT
        : (secTitle && !/^introduction$/i.test(secTitle) ? secTitle : ch.title);
      ch.units.push({ kind:'prose', text:c, sec: secTitle || ch.title,
        title: isConc ? concT : unitTitle(c, fb) });
    });
    para = [];
  };
  const flushTable = () => {
    if (table && ch && table.rows.length >= 2) {
      const ok = table.sec && !/^(table|conclusion$|introduction$)/i.test(table.sec);
      ch.units.push({ kind:'table', sec: table.sec, rows: table.rows,
        title: tableTitle(table.title, ok ? table.sec : ch.title),
        note: clean(table.note||'') });
    }
    table = null;
  };
  const flushBox = () => {
    if (box && ch && box.lines.join(' ').trim().length > 40) {
      const body = box.lines.map(clean).filter(Boolean);
      const items = body.filter(b => /^[-•]/.test(b)).map(b => b.replace(/^[-•]\s*/,''));
      const text  = body.filter(b => !/^[-•]/.test(b)).join(' ');
      const label = BOXES[box.m];
      /* a bare marker carries no title of its own — read one out of the body,
         and let the unit number distinguish repeated objectives/summaries */
      let t = box.title && box.title.toLowerCase() !== label.toLowerCase() ? box.title : '';
      if (!t) {
        /* prefer the enclosing heading over echoing the marker name as a title */
        const secOk = secTitle && !/^(introduction|conclusion)$/i.test(secTitle)
          && secTitle.toLowerCase() !== label.toLowerCase();
        t = (box.m === 'objectives' || box.m === 'summary')
          ? `Unit ${chapters.length} ${box.m === 'summary' ? 'summary' : 'objectives'}`
          : unitTitle(text || items[0] || '', secOk ? secTitle : label);
      }
      ch.units.push({ kind:'box', label, sec: secTitle || ch.title, title:t, items, text });
    }
    box = null;
  };
  const flushAll = () => { flushPara(); flushTable(); flushBox(); mode = null; };

  for (const raw of book.src.split('\n')) {
    const t = raw.trim();
    const m = /^@(\w+)\s*(.*)$/.exec(t);
    if (m) {
      const tag = m[1], rest = clean(m[2]);
      flushAll();
      if (tag === 'chapter') { ch = { title: rest, units: [] }; chapters.push(ch); secTitle = null; }
      else if (tag === 'section' || tag === 'subsection') secTitle = rest;
      else if (tag === 'table') { table = { title: rest || secTitle || 'Table',
        sec: secTitle || (ch && ch.title), rows: [], note:'' }; mode = 'table'; }
      else if (BOXES[tag]) { box = { m: tag, title: rest, lines: [] }; mode = 'box'; }
      else if (SKIP[tag]) mode = 'skip';
      continue;
    }
    if (!t || mode === 'skip') continue;
    if (mode === 'table') {
      if (t.includes('|')) { const r = t.split('|').map(clean); if (r.length >= 2) table.rows.push(r); }
      else table.note = (table.note ? table.note + ' ' : '') + t;
      continue;
    }
    if (mode === 'box') { box.lines.push(t); continue; }
    para.push(t);
  }
  flushAll();
  return chapters.filter(c => c.units.length);
}

/* n positions spread evenly across a list, always including its ends */
function spread(list, n) {
  if (n <= 0 || !list.length) return [];
  if (n >= list.length) return list.slice();
  if (n === 1) return [list[0]];
  const out = new Set();
  for (let i = 0; i < n; i++) out.add(list[Math.round(i * (list.length-1) / (n-1))]);
  for (let k = 0; out.size < n && k < list.length; k++) out.add(list[k]);
  return [...out];
}
/* pick `q` units spanning the whole chapter, in book order.
   Prose and tables carry the teaching; note/caution/summary boxes are garnish,
   so cap them at one per unit — otherwise a heavily annotated chapter (M8)
   turns into a deck of boxes with nothing taught in between. */
function choose(units, q) {
  if (units.length <= q) return units.slice();
  const all  = units.map((u,i) => i);
  const box  = all.filter(i => units[i].kind === 'box');
  const main = all.filter(i => units[i].kind !== 'box');
  const nBox = Math.min(box.length, q >= 4 ? 1 : 0);
  let pick = new Set(spread(main, Math.min(main.length, q - nBox)));
  spread(box, nBox).forEach(i => pick.add(i));
  for (let k = 0; pick.size < q && k < all.length; k++) pick.add(all[k]);
  let arr = [...pick].sort((a,b) => a-b);
  /* a unit with a table should show it */
  if (!arr.some(i => units[i].kind === 'table')) {
    const t = main.find(i => units[i].kind === 'table');
    if (t !== undefined) {
      const worst = arr.filter(i => units[i].kind === 'prose')
        .sort((a,b) => (units[a].text||'').length - (units[b].text||'').length)[0];
      if (worst !== undefined) arr = arr.filter(i => i !== worst).concat(t).sort((a,b) => a-b);
    }
  }
  return arr.map(i => units[i]);
}

/* ============================== deck ================================== */
function buildModule(n) {
  const book = readBook(n), chapters = parseBook(book), meta = book.meta || {};
  const title = clean(meta.title || `Module ${n}`);
  const pracs = Object.values(BRIEFS).filter(b => b.mod === n)
    .sort((a,b) => String(a.no).localeCompare(String(b.no)));
  const exw = {};
  new Function('window', fs.readFileSync(path.join(DEPLOY, `alizon-exam-bank-m${n}.js`), 'utf8'))(exw);
  const bank = exw.ALIZON_EXAM_BANKS['ALZ-PH-M' + n];
  const qTotal = bank.units.reduce((a,u) => a + u.qs.length, 0);

  const pptx = new PptxGenJS();
  pptx.layout  = 'LAYOUT_WIDE';
  pptx.author  = 'Alizon School of Medical & Digital Intelligence';
  /* pptxgenjs does not XML-escape `company` in app.xml — keep it ampersand-free */
  pptx.company = 'Alizon School of Medical and Digital Intelligence';
  pptx.title   = `Module ${n} — ${title}`;
  pptx.subject = 'Certificate Course in Digital Health & Artificial Intelligence for Pharmacy';
  let page = 0, num = 0;

  const foot = (s, isDark) => {
    page++;
    s.addText(`Module ${n} · ${title}`, { x:0.55, y:H-0.5, w:9.6, h:0.28, fontSize:9.5,
      color: isDark ? '6E6058' : MUT, fontFace:SANS, margin:0 });
    s.addText(String(page), { x:W-1.05, y:H-0.52, w:0.5, h:0.32, fontSize:10.5, bold:true,
      color: isDark ? GOLD : CR, align:'right', fontFace:SANS, margin:0 });
  };
  const white = () => { const s = pptx.addSlide(); s.background = { color:WHITE }; return s; };
  const dark  = () => { const s = pptx.addSlide(); s.background = { color:DARK  }; return s; };
  const head = (s, t, kicker) => {
    num++;
    s.addShape(pptx.ShapeType.ellipse, { x:0.55, y:0.46, w:0.52, h:0.52, fill:{ color:CR } });
    s.addText(String(num), { x:0.55, y:0.46, w:0.52, h:0.52, fontSize:15, bold:true,
      color:WHITE, align:'center', valign:'middle', fontFace:SANS, margin:0 });
    if (kicker) s.addText(fit(kicker, 84).toUpperCase(), { x:1.28, y:0.42, w:11.4, h:0.24,
      fontSize:10, bold:true, color:GOLD, charSpacing:2, fontFace:SANS, margin:0 });
    const tt = fit(t, 68);
    s.addText(tt, { x:1.28, y: kicker ? 0.66 : 0.52, w:11.4, h:0.68,
      fontSize: tt.length > 48 ? 24 : 29, bold:true, color:INK, fontFace:SERIF, margin:0 });
  };
  const card = (s,x,y,w,h,fill) => s.addShape(pptx.ShapeType.roundRect,
    { x,y,w,h, rectRadius:0.06, fill:{ color: fill||PAPER },
      line:{ color: fill===DEEP ? '46201F' : LINE, width:0.75 } });
  const bullets = (s,x,y,w,h,items,sz,col) => s.addText(
    items.map((t,i) => ({ text:t, options:{ bullet:true, breakLine: i < items.length-1 } })),
    { x,y,w,h, fontSize: sz||13, color: col||INK, fontFace:SANS,
      lineSpacing: Math.round((sz||13)*1.42), paraSpaceAfter:7, margin:0, valign:'top' });

  /* ---- 1 · title ---- */
  {
    const s = dark();
    s.addShape(pptx.ShapeType.ellipse, { x:10.4, y:-1.5, w:5.2, h:5.2, fill:{ color:CR, transparency:72 } });
    s.addShape(pptx.ShapeType.ellipse, { x:11.6, y:4.7, w:3.2, h:3.2, fill:{ color:GOLD, transparency:80 } });
    s.addText('ALIZON SCHOOL OF MEDICAL & DIGITAL INTELLIGENCE', { x:0.85, y:0.85, w:10.6, h:0.3,
      fontSize:11, bold:true, color:'E8B4B4', charSpacing:2.2, fontFace:SANS, margin:0 });
    s.addText(`Module ${n}`, { x:0.85, y:1.58, w:9, h:0.6, fontSize:20, color:GOLD, fontFace:SANS, margin:0 });
    s.addText(title, { x:0.85, y:2.18, w:10.6, h:2.1, fontSize: title.length > 52 ? 34 : 41,
      bold:true, color:WHITE, fontFace:SERIF, lineSpacing: title.length > 52 ? 42 : 48, margin:0 });
    if (meta.sub) s.addText(fit(meta.sub, 120), { x:0.85, y:4.4, w:9.8, h:0.42,
      fontSize:16, italic:true, color:'C9C2BA', fontFace:SANS, margin:0 });
    s.addText([
      { text:'Certificate Course in Digital Health & Artificial Intelligence for Pharmacy', options:{ breakLine:true } },
      { text:`${chapters.length} units  ·  ${pracs.length} assessed practical${pracs.length===1?'':'s'}  ·  ${qTotal} examination questions`, options:{} }
    ], { x:0.85, y:5.3, w:10.4, h:0.95, fontSize:13, color:'9A938C', fontFace:SANS, lineSpacing:21, margin:0 });
    s.addText('ASAP Kerala  ·  www.alizongov.com', { x:0.85, y:H-0.62, w:8, h:0.3,
      fontSize:10, color:'6E6058', fontFace:SANS, margin:0 });
    page++;
  }

  /* ---- 2 · module map ---- */
  {
    const s = white(); head(s, 'What this module covers', 'Module map');
    chapters.slice(0,4).forEach((c,i) => {
      const x = 0.55 + (i%2)*6.3, y = 1.62 + Math.floor(i/2)*1.72;
      card(s, x, y, 5.95, 1.5);
      s.addShape(pptx.ShapeType.ellipse, { x:x+0.26, y:y+0.3, w:0.42, h:0.42, fill:{ color:CR } });
      s.addText('0'+(i+1), { x:x+0.26, y:y+0.3, w:0.42, h:0.42, fontSize:12, bold:true,
        color:WHITE, align:'center', valign:'middle', fontFace:SANS, margin:0 });
      s.addText(fit(c.title, 58), { x:x+0.82, y:y+0.2, w:4.9, h:0.54, fontSize:13.5,
        bold:true, color:INK, fontFace:SANS, margin:0 });
      const topics = [...new Set(c.units.map(u => u.sec))]
        .filter(t => t && !/^(introduction|conclusion)$/i.test(t) && t !== c.title && !/^table\s*\d/i.test(t));
      s.addText(fit(topics.join(' · ') || (bank.units[i] ? bank.units[i].t : ''), 126),
        { x:x+0.82, y:y+0.74, w:4.9, h:0.62, fontSize:10.5, color:MUT, fontFace:SANS,
          lineSpacing:14, margin:0 });
    });
    if (pracs.length) {
      card(s, 0.55, 5.12, 12.23, 1.08, DEEP);
      s.addText(`${pracs.length} assessed practical${pracs.length===1?'':'s'}`,
        { x:0.95, y:5.3, w:3.6, h:0.32, fontSize:13.5, bold:true, color:'F0C9C9', fontFace:SANS, margin:0 });
      s.addText(fit(pracs.map(p => p.title).join('   ·   '), 156), { x:0.95, y:5.64, w:11.5, h:0.42,
        fontSize:11.5, color:'E7DCD8', fontFace:SANS, margin:0 });
    }
    foot(s);
  }

  /* ---- 3 · learning outcomes ---- */
  {
    const s = white(); head(s, 'What you will be able to do', 'Learning outcomes');
    const verbs = ['Explain','Apply','Describe','Operate','Evaluate','Document'];
    const outs = [];
    chapters.forEach((c,i) => {
      outs.push([verbs[i%verbs.length], fit(c.title, 68)]);
      const topics = [...new Set(c.units.map(u => u.sec))]
        .filter(t => t && !/^(introduction|conclusion)$/i.test(t) && t !== c.title && !/^table\s*\d/i.test(t));
      if (topics[0]) outs.push([verbs[(i+3)%verbs.length], fit(topics[0], 68)]);
    });
    outs.slice(0,6).forEach((o,i) => {
      const x = 0.55 + (i%2)*6.3, y = 1.72 + Math.floor(i/2)*1.5;
      s.addShape(pptx.ShapeType.ellipse, { x:x, y:y+0.02, w:0.34, h:0.34, fill:{ color:'F2E4E4' } });
      s.addText('▸', { x:x, y:y+0.02, w:0.34, h:0.34, fontSize:12, bold:true, color:CR,
        align:'center', valign:'middle', fontFace:SANS, margin:0 });
      s.addText(o[0], { x:x+0.5, y:y, w:5.4, h:0.32, fontSize:14, bold:true, color:CR, fontFace:SANS, margin:0 });
      s.addText(o[1], { x:x+0.5, y:y+0.36, w:5.4, h:0.9, fontSize:12.5, color:INK,
        fontFace:SANS, lineSpacing:17, margin:0 });
    });
    card(s, 0.55, 6.02, 12.23, 0.64);
    s.addText(`Assessment · ${pracs.length} faculty-evaluated practical${pracs.length===1?'':'s'}  +  ${qTotal}-question internal examination (${bank.units.length} units × ${bank.units[0].qs.length})`,
      { x:0.95, y:6.02, w:11.5, h:0.64, fontSize:12, color:INK, fontFace:SANS, valign:'middle', margin:0 });
    foot(s);
  }

  /* ---- content slides ---- */
  const C = Math.max(8, TARGET - 5 - pracs.length);
  const totalU = chapters.reduce((a,c) => a + c.units.length, 0) || 1;
  chapters.forEach(c => c.quota = Math.max(1, Math.min(c.units.length,
    Math.round(C * c.units.length / totalU))));
  const bal = () => chapters.reduce((a,c) => a + c.quota, 0);
  for (let g = 0; bal() > C && g < 300; g++) {
    const big = chapters.slice().sort((a,b) => b.quota - a.quota)[0];
    if (big.quota <= 2) break; big.quota--;
  }
  for (let g = 0; bal() < C && g < 300; g++) {
    const small = chapters.filter(c => c.quota < c.units.length)
      .sort((a,b) => (a.quota/a.units.length) - (b.quota/b.units.length))[0];
    if (!small) break; small.quota++;
  }

  /* titles are deduped across the whole deck — several units carry a table with
     the same name ("Benefits and Limitations"), and three identical slide titles
     in one deck is confusing even though the kicker differs */
  const seen = {};
  /* match on meaning, not spelling — "Workflow Optimisation & Quality Assurance"
     and "Workflow optimisation and quality assurance" are the same slide title */
  const keyOf = s => s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
  function uniqueTitle(base, ci) {
    const k = keyOf(base);
    if (seen[k] === undefined) { seen[k] = ci; return base; }   /* ci is 0 for Unit 1 */
    /* "· Unit N" only disambiguates when the clash is across units */
    if (seen[k] !== ci) {
      const byUnit = `${base} · Unit ${ci+1}`;
      if (seen[keyOf(byUnit)] === undefined) { seen[keyOf(byUnit)] = ci; return byUnit; }
    }
    let j = 2, cand;
    do { cand = `${base} (${j++})`; } while (seen[keyOf(cand)] !== undefined);
    seen[keyOf(cand)] = ci;
    return cand;
  }
  chapters.forEach((c, ci) => {
    const kicker = `Unit ${ci+1} · ${c.title}`;
    choose(c.units, c.quota).forEach(u => {
      const s = white();
      const t = uniqueTitle(unquote(u.title || c.title) || c.title, ci);
      head(s, t, kicker);

      if (u.kind === 'table') {
        const hdr = u.rows[0], rows = u.rows.slice(1, 7);
        const cols = Math.min(4, hdr.length);
        const colW = cols === 2 ? [4.9,7.33] : cols === 3 ? [3.5,4.36,4.37] : [2.9,3.2,3.1,3.03];
        s.addShape(pptx.ShapeType.rect, { x:0.55, y:1.7, w:12.23, h:0.56, fill:{ color:CR }, line:{ color:CR } });
        let cx = 0.55;
        hdr.slice(0,cols).forEach((hh,i) => {
          s.addText(fit(hh, 34), { x:cx+0.2, y:1.7, w:colW[i]-0.34, h:0.56, fontSize:11.5,
            bold:true, color:WHITE, fontFace:SANS, valign:'middle', margin:0 });
          cx += colW[i];
        });
        const rh = rows.length <= 5 ? 0.72 : 0.62;
        rows.forEach((r,ri) => {
          const y = 2.26 + ri*rh;
          s.addShape(pptx.ShapeType.rect, { x:0.55, y, w:12.23, h:rh,
            fill:{ color: ri%2 ? PAPER : WHITE }, line:{ color:LINE, width:0.75 } });
          let x2 = 0.55;
          r.slice(0,cols).forEach((cc,i) => {
            s.addText(fit(cc, cols===2 ? 96 : cols===3 ? 64 : 46), { x:x2+0.2, y, w:colW[i]-0.34, h:rh,
              fontSize: cols===4 ? 10.5 : 11.5, color:INK, bold:i===0, fontFace:SANS,
              valign:'middle', margin:0 });
            x2 += colW[i];
          });
        });
        const ny = 2.26 + rows.length*rh + 0.22;
        if (u.note && ny < 6.1) s.addText(fit(u.note, 220), { x:0.55, y:ny, w:12.23, h:6.85-ny,
          fontSize:12, italic:true, color:MUT, fontFace:SANS, lineSpacing:16, margin:0 });

      } else if (u.kind === 'list') {
        const items = u.items.slice(0,7).map(b => fit(b, 116));
        card(s, 0.55, 1.7, 12.23, Math.min(4.7, 0.7 + items.length*0.58));
        bullets(s, 1.0, 2.0, 11.35, Math.min(4.1, items.length*0.58), items, 13.5);

      } else if (u.kind === 'box') {
        const bt = u.text ? fit(u.text, 560) : '';
        const bi = u.items.slice(0,6).map(b => fit(b, 112));
        /* size the card to its contents — a fixed-height panel leaves a short
           note floating in the middle of a mostly empty box */
        const th = bt ? Math.ceil(bt.length/124) * 0.292 : 0;
        const ih = bi.reduce((a,b) => a + Math.ceil(b.length/130) * 0.256 + 0.097, 0);
        const ch2 = Math.min(4.7, Math.max(1.9, 0.92 + th + (bt && bi.length ? 0.22 : 0) + ih));
        card(s, 0.55, 1.7, 12.23, ch2, DEEP);
        s.addText(String(u.label).toUpperCase(), { x:1.0, y:1.98, w:5, h:0.3, fontSize:10.5,
          bold:true, color:GOLD, charSpacing:1.8, fontFace:SANS, margin:0 });
        let y = 2.42;
        if (bt) {
          s.addText(bt, { x:1.0, y, w:11.3, h:th || 0.3, fontSize:14, color:'F4ECE9',
            fontFace:SANS, lineSpacing:21, margin:0, valign:'top' });
          y += th + (bi.length ? 0.22 : 0);
        }
        if (bi.length) bullets(s, 1.0, y, 11.3, ih, bi, 13, 'E7DCD8');

      } else {
        const sent = splitSent(u.text);
        const last = sent.length >= 3 ? sent[sent.length-1] : '';
        const body = last ? sent.slice(0,-1).join(' ') : u.text;
        /* scale the type to the paragraph so a short one doesn't leave the slide bare */
        const sizeFor = (len, w) => len > w*0.62 ? 14 : len > w*0.38 ? 15.5 : 17.5;
        if (last && last.length > 60) {
          const fs = sizeFor(body.length, 830);
          s.addText(fit(body, 830), { x:0.55, y:1.68, w:7.55, h:4.7, fontSize:fs,
            color:INK, fontFace:SANS, lineSpacing:Math.round(fs*1.5), margin:0, valign:'top' });
          /* the pull-quote card is sized to its own text, not left half-empty */
          const q = fit(last, 400);
          const ch = Math.min(4.7, Math.max(2.0, 1.15 + Math.ceil(q.length/42) * 0.265));
          card(s, 8.4, 1.68, 4.38, ch, DEEP);
          s.addText('WHY IT MATTERS', { x:8.78, y:1.98, w:3.7, h:0.28, fontSize:10.5, bold:true,
            color:GOLD, charSpacing:1.6, fontFace:SANS, margin:0 });
          s.addText(q, { x:8.78, y:2.42, w:3.62, h:ch-0.94, fontSize:13,
            color:'F0E7E4', fontFace:SANS, lineSpacing:19, margin:0, valign:'top' });
        } else {
          const fs = sizeFor(u.text.length, 1150);
          s.addText(fit(u.text, 1150), { x:0.55, y:1.68, w:12.23, h:4.7, fontSize:fs,
            color:INK, fontFace:SANS, lineSpacing:Math.round(fs*1.58), margin:0, valign:'top' });
        }
      }
      foot(s);
    });
  });

  /* ---- practicals divider + one slide each ---- */
  if (pracs.length) {
    const s = dark(); num++;
    s.addShape(pptx.ShapeType.ellipse, { x:11.0, y:-1.2, w:4.4, h:4.4, fill:{ color:CR, transparency:72 } });
    s.addText('THE PRACTICALS', { x:0.85, y:0.82, w:9, h:0.3, fontSize:11, bold:true,
      color:GOLD, charSpacing:2.2, fontFace:SANS, margin:0 });
    s.addText(`${pracs.length} assessed practical${pracs.length===1?'':'s'}`,
      { x:0.85, y:1.2, w:11, h:0.72, fontSize:34, bold:true, color:WHITE, fontFace:SERIF, margin:0 });
    s.addText('Every practical follows the institutional standard — Aim, Principle, Theory, Requirements, Procedure and Guided Method — and is submitted to faculty for evaluation. Verified practicals count towards the hands-on experience certificate.',
      { x:0.85, y:2.02, w:11.2, h:0.82, fontSize:13, color:'C9C2BA', fontFace:SANS, lineSpacing:19, margin:0 });
    const rowH = pracs.length > 4 ? 0.72 : 0.95, gap = pracs.length > 4 ? 0.83 : 1.14;
    pracs.forEach((p,i) => {
      const y = 3.02 + i*gap;
      s.addShape(pptx.ShapeType.roundRect, { x:0.85, y, w:11.6, h:rowH, rectRadius:0.06,
        fill:{ color:'241A19' }, line:{ color:'3E2A28', width:0.75 } });
      s.addShape(pptx.ShapeType.ellipse, { x:1.2, y:y+(rowH-0.42)/2, w:0.42, h:0.42, fill:{ color:CR } });
      s.addText(String(i+1), { x:1.2, y:y+(rowH-0.42)/2, w:0.42, h:0.42, fontSize:13, bold:true,
        color:WHITE, align:'center', valign:'middle', fontFace:SANS, margin:0 });
      s.addText(fit(p.no, 44), { x:1.82, y:y+0.08, w:5, h:0.25, fontSize:10, bold:true,
        color:GOLD, fontFace:SANS, margin:0 });
      s.addText(fit(p.title, 90), { x:1.82, y:y+0.32, w:10.3, h:0.34, fontSize:13.5,
        color:WHITE, fontFace:SANS, margin:0 });
    });
    foot(s, true);

    pracs.forEach((p,i) => {
      const s2 = white();
      /* p.no already reads "Module N · Unit N · Practical N" */
      head(s2, p.title, p.no || `Practical ${i+1}`);
      card(s2, 0.55, 1.66, 5.95, 1.95, DEEP);
      s2.addText('AIM', { x:0.95, y:1.88, w:2, h:0.28, fontSize:10.5, bold:true, color:GOLD,
        charSpacing:1.6, fontFace:SANS, margin:0 });
      s2.addText(fit(p.aim, 300), { x:0.95, y:2.2, w:5.2, h:1.3, fontSize:12,
        color:'F0E7E4', fontFace:SANS, lineSpacing:16, margin:0 });

      card(s2, 0.55, 3.76, 5.95, 2.6);
      s2.addText('PRINCIPLE & THEORY', { x:0.95, y:3.98, w:3.6, h:0.28, fontSize:10.5, bold:true,
        color:CR, charSpacing:1.6, fontFace:SANS, margin:0 });
      s2.addText(fit((sentences(p.principle,2) + ' ' + sentences(p.theory,1)).trim(), 540),
        { x:0.95, y:4.32, w:5.2, h:1.88, fontSize:11.5, color:INK, fontFace:SANS,
          lineSpacing:15, margin:0 });

      s2.addText('PROCEDURE', { x:6.85, y:1.7, w:3.5, h:0.28, fontSize:10.5, bold:true,
        color:CR, charSpacing:1.6, fontFace:SANS, margin:0 });
      const more = p.procedure.length > 6, steps = p.procedure.slice(0,6), sh = more ? 0.7 : 0.74;
      steps.forEach((t, si) => {
        const y = 2.1 + si*sh;
        s2.addShape(pptx.ShapeType.ellipse, { x:6.85, y:y+0.02, w:0.32, h:0.32, fill:{ color:'F2E4E4' } });
        s2.addText(String(si+1), { x:6.85, y:y+0.02, w:0.32, h:0.32, fontSize:11, bold:true,
          color:CR, align:'center', valign:'middle', fontFace:SANS, margin:0 });
        s2.addText(fit(t, 124), { x:7.3, y, w:5.48, h:sh-0.05, fontSize:11.5, color:INK,
          fontFace:SANS, lineSpacing:15, margin:0 });
      });
      if (more) s2.addText(`+ ${p.procedure.length-6} further steps — see the practical brief on ALIZON OS`,
        { x:7.3, y:2.1 + 6*sh + 0.06, w:5.48, h:0.3, fontSize:10.5, italic:true,
          color:MUT, fontFace:SANS, margin:0 });
      foot(s2);
    });
  }

  /* ---- closing ---- */
  {
    const s = dark(); num++;
    s.addShape(pptx.ShapeType.ellipse, { x:10.6, y:4.2, w:4.6, h:4.6, fill:{ color:CR, transparency:74 } });
    s.addText('HOW THIS MODULE IS ASSESSED', { x:0.85, y:0.82, w:9, h:0.3, fontSize:11, bold:true,
      color:GOLD, charSpacing:2.2, fontFace:SANS, margin:0 });
    s.addText(`Completing Module ${n}`, { x:0.85, y:1.2, w:11, h:0.72, fontSize:34, bold:true,
      color:WHITE, fontFace:SERIF, margin:0 });
    [ ['Practicals', `Complete all ${pracs.length} practical${pracs.length===1?'':'s'} on ALIZON OS. Every submission is evaluated by faculty.`],
      ['Attendance', 'Attendance is recorded automatically from submitted work — signing in alone does not count.'],
      ['Examination', `${qTotal} multiple-choice questions across ${bank.units.length} units. Practise on the mock paper before the internal examination.`],
      ['Certificate', 'Faculty-verified practicals earn a Certificate of Practical Experience, with the hours set by the institution.']
    ].forEach((it,i) => {
      const y = 2.24 + i*1.06;
      s.addShape(pptx.ShapeType.roundRect, { x:0.85, y, w:11.6, h:0.9, rectRadius:0.06,
        fill:{ color:'241A19' }, line:{ color:'3E2A28', width:0.75 } });
      s.addText(it[0], { x:1.25, y, w:2.3, h:0.9, fontSize:13, bold:true, color:'F0C9C9',
        fontFace:SANS, valign:'middle', margin:0 });
      s.addText(it[1], { x:3.5, y, w:8.7, h:0.9, fontSize:12.5, color:'D8CFC9',
        fontFace:SANS, valign:'middle', lineSpacing:17, margin:0 });
    });
    s.addText('Study material, practicals, mock papers and results · alizon.in      Institution · www.alizongov.com',
      { x:0.85, y:6.62, w:11.6, h:0.34, fontSize:11.5, color:GOLD, fontFace:SANS, margin:0 });
    foot(s, true);
  }

  const file = path.join(OUT, `ALIZON-Module-${n}-Slides.pptx`);
  return pptx.writeFile({ fileName:file }).then(() => ({ n, file, slides:page, title, pracs:pracs.length }));
}

fs.mkdirSync(OUT, { recursive:true });
(async () => {
  const rows = [];
  for (let n = 1; n <= 8; n++) rows.push(await buildModule(n));
  rows.forEach(r => console.log(`M${r.n}  ${String(r.slides).padStart(2)} slides  ${r.pracs} prac  ` +
    `${(fs.statSync(r.file).size/1024).toFixed(0).padStart(4)} KB  ${r.title}`));
})();
