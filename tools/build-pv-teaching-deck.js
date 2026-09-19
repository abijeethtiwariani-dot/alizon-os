/* Builds the Pharmacovigilance Foundations teaching deck.

   Content is pulled from the audited workshop dataset (pvx-learn-data.js and
   pvx-learn-engine.js) wherever the same fact appears in both, so the slides
   and the simulator cannot drift apart. Where a card is too narrow for the
   full wording, the generator holds a shortened display form next to the
   line that uses it, and says so in a comment.

   Rebuild:
     npm install pptxgenjs         (not a project dependency; the site has no build step)
     node tools/build-pv-teaching-deck.js ALIZON-OS-PV-Foundations-Teaching-Deck.pptx
*/
const path = require('path');
const pptxgen = require('pptxgenjs');
const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'pvx-learn-data.js'));
require(path.join(ROOT, 'pvx-learn-engine.js'));
const D = window.PVXLearnData, E = window.PVXLearn;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';            // 13.3 x 7.5
pres.author = 'Alizon School of Medical & Digital Intelligence';
pres.title  = 'Pharmacovigilance — Foundations';

/* ---- palette: clinical navy dominant, teal support, crimson alert.
   The traffic-light colours are CONTENT here, not decoration — the
   workshop teaches red/amber/green as a working tool. ---- */
const INK='0F2B3D', INK2='16394F', TEAL='0E7490', TEAL2='0891B2';
const CRIM='C40D16', GREEN='15803D', AMBER='B45309', RED='B91C1C';
const WHITE='FFFFFF', PAPER='F1F5F9', LINE='E2E8F0', MUTE='64748B', FAINT='94A3B8';
const HEAD='Cambria', BODY='Calibri';

const W=13.3, H=7.5, M=0.62;            // margins

/* ---------------- helpers ---------------- */
function notes(s, t){ s.addNotes(t); }

function darkBase(s){ s.background = { color: INK }; }

function titleSlide(){
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, {x:10.2,y:-1.5,w:5.2,h:5.2,fill:{color:INK2}});
  s.addShape(pres.ShapeType.ellipse, {x:11.4,y:4.6,w:3.0,h:3.0,fill:{color:TEAL},transparency:72});
  s.addText('OPEN WORKSHOP', {x:M,y:1.45,w:8,h:0.3,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:12,bold:true,color:TEAL2,charSpacing:3});
  s.addText('Pharmacovigilance', {x:M,y:1.85,w:9.4,h:1.0,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:52,bold:true,color:WHITE});
  s.addText('Foundations', {x:M,y:2.82,w:9.4,h:0.9,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:52,bold:true,color:TEAL2});
  s.addText('Finding, assessing and reporting harm from medicines — for people who have not studied it yet.',
    {x:M,y:3.95,w:8.6,h:0.8,isTextBox:true,margin:0,fontFace:BODY,fontSize:17,color:'CBD5E1',lineSpacing:26});
  s.addText([
    {text:'Alizon School of Medical & Digital Intelligence',options:{bold:true,breakLine:true}},
    {text:'with Mar Dioscorus College of Pharmacy',options:{breakLine:true}},
    {text:'and the International Organisation for Preventive Health & Medical Research Centre',options:{}}
  ],{x:M,y:5.55,w:9.0,h:1.1,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,color:FAINT,lineSpacing:18});
  notes(s,'Open by saying what the session is NOT: it is not a lecture you need pharmacology for. '
    +'Everything is taught at the moment it is needed. Ask the room who has ever filled in an ADR form — '
    +'usually almost nobody, which is the point.');
}

function sectionSlide(num, kicker, title, blurb){
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse, {x:M,y:2.25,w:1.15,h:1.15,fill:{color:TEAL}});
  s.addText(String(num), {x:M,y:2.25,w:1.15,h:1.15,isTextBox:true,margin:0,align:'center',valign:'middle',
    fontFace:HEAD,fontSize:34,bold:true,color:WHITE});
  s.addText(kicker, {x:2.05,y:2.32,w:9,h:0.3,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:12,bold:true,color:TEAL2,charSpacing:3});
  var wraps = title.length > 28;
  s.addText(title, {x:2.05,y:2.62,w:10.2,h:wraps?1.25:0.68,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:40,bold:true,color:WHITE,lineSpacing:46});
  s.addText(blurb, {x:2.05,y:wraps?3.98:3.45,w:9.6,h:0.9,isTextBox:true,margin:0,valign:'top',
    fontFace:BODY,fontSize:15.5,color:'CBD5E1',lineSpacing:24});
  notes(s,'Section divider. '+blurb);
}

function slide(title, kicker){
  const s = pres.addSlide(); s.background={color:WHITE};
  if(kicker) s.addText(kicker,{x:M,y:0.42,w:11,h:0.28,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:11,bold:true,color:TEAL,charSpacing:2.5});
  var lng = title.length > 44;
  s.addText(title,{x:M,y:kicker?0.70:0.48,w:12.1,h:lng?0.86:0.6,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:lng?25:31,bold:true,color:INK,lineSpacing:lng?32:38});
  return s;
}

/* card: tinted panel, no edge stripes */
function card(s,x,y,w,h,fill){ s.addShape(pres.ShapeType.roundRect,{x,y,w,h,rectRadius:0.06,
  fill:{color:fill||PAPER},line:{color:LINE,width:1}}); }

function numDot(s,x,y,n,col,d){ d=d||0.42;
  s.addShape(pres.ShapeType.ellipse,{x,y,w:d,h:d,fill:{color:col||TEAL}});
  s.addText(String(n),{x,y,w:d,h:d,isTextBox:true,margin:0,align:'center',valign:'middle',
    fontFace:BODY,fontSize:d>0.5?15:12,bold:true,color:WHITE});
}

function bullets(s,x,y,w,h,items,size,gap){
  s.addText(items.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<items.length-1}})),
    {x,y,w,h,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:size||14.5,
     color:'1E293B',lineSpacing:Math.round((size||14.5)*1.42),
     paraSpaceAfter:(gap===undefined?6:gap)});
}

function statBlock(s,x,y,w,val,label,col){
  s.addText(val,{x,y,w,h:0.95,isTextBox:true,margin:0,align:'center',
    fontFace:HEAD,fontSize:52,bold:true,color:col||CRIM});
  s.addText(label,{x,y:y+0.95,w,h:0.6,isTextBox:true,margin:0,align:'center',
    fontFace:BODY,fontSize:12.5,color:MUTE,lineSpacing:17});
}

function tbl(s,x,y,w,rows,colW,opts){
  opts = opts||{};
  s.addTable(rows,{x,y,w,colW,fontFace:BODY,fontSize:opts.fs||12.5,color:'1E293B',
    border:{type:'solid',color:LINE,pt:1},valign:'top',
    autoPage:false, rowH:opts.rowH||undefined});
}

/* ================= 1 · TITLE + FRAME ================= */
titleSlide();

(function(){
  const s = slide('What you will be able to do by the end','Learning outcomes');
  const items = [
    ['Read a case','Pull patient, drug, indication, timing, event, action and outcome out of a plain narrative.'],
    ['Look the drug up','Use a reference before judging a reaction to a medicine. Nobody memorises this.'],
    ['Check the combination','Drug–drug, drug–disease and patient factors — and say what the pharmacist does.'],
    ['Decide if it is an ADR','Including recognising when you cannot decide yet.'],
    ['Classify and assess','Seriousness, severity, expectedness, causality.'],
    ['Code and report','Turn words into a standardised term and build a valid ICSR.']
  ];
  items.forEach((it,i)=>{
    const col = i%2, row = Math.floor(i/2);
    const x = M + col*6.15, y = 1.7 + row*1.78;
    card(s,x,y,5.85,1.58);
    numDot(s,x+0.28,y+0.32,i+1,TEAL,0.46);
    s.addText(it[0],{x:x+0.92,y:y+0.26,w:4.7,h:0.34,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:16,bold:true,color:INK});
    s.addText(it[1],{x:x+0.92,y:y+0.68,w:4.75,h:0.74,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:12.5,color:MUTE,lineSpacing:17});
  });
  notes(s,'Read these out. The framing that matters: we are not testing recall. Every one of these is a '
    +'thing you DO, with a reference open in front of you.');
})();

(function(){
  const s = slide('The four hours','Session plan');
  const rows = [[
    {text:'Time',options:{bold:true,color:WHITE,fill:{color:INK}}},
    {text:'Session',options:{bold:true,color:WHITE,fill:{color:INK}}},
    {text:'What you walk out able to do',options:{bold:true,color:WHITE,fill:{color:INK}}}
  ]];
  D.TIMETABLE.forEach(r=>rows.push([
    {text:r.t,options:{bold:true,color:TEAL}},
    {text:r.s,options:{bold:true}},
    {text:r.o,options:{color:MUTE}}
  ]));
  tbl(s,M,1.55,12.06,rows,[1.35,3.9,6.81],{fs:11.5});
  notes(s,'Ten blocks. The last one is a team challenge on an incomplete case — flag now that it is the '
    +'point the whole day builds to, so nobody treats the earlier blocks as separate topics.');
})();

/* ================= 2 · FOUNDATIONS ================= */
sectionSlide(1,'Part one','What pharmacovigilance is',
  'And why a system built on voluntary reports is the best tool we have.');

(function(){
  const s = slide('The definition, and the half of it everyone forgets','What is pharmacovigilance?');
  card(s,M,1.6,12.06,1.5,'ECFEFF');
  s.addText('"The science and activities relating to the detection, assessment, understanding and prevention of adverse effects '
    +'or any other medicine-related problem."',
    {x:M+0.35,y:1.82,w:11.4,h:1.1,isTextBox:true,margin:0,fontFace:HEAD,fontSize:17,italic:true,
     color:INK,lineSpacing:26});
  s.addText('Students assume this means side effects. Look again at the last six words.',
    {x:M,y:3.32,w:12,h:0.34,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,bold:true,color:INK});
  const also = [
    ['Medication errors','The wrong dose, the wrong route, the wrong patient.'],
    ['Substandard or falsified medicines','A quality defect is a safety problem.'],
    ['Misuse, abuse and overdose','Including deliberate and accidental.'],
    ['Treatment failure','A medicine that did not work when it should have.'],
    ['Interactions','Harm that belongs to the combination, not either drug.'],
    ['Exposure in pregnancy and breastfeeding','And occupational exposure.']
  ];
  also.forEach((a,i)=>{
    const col=i%3, row=Math.floor(i/3);
    const x=M+col*4.03, y=3.85+row*1.5;
    card(s,x,y,3.78,1.32);
    s.addText(a[0],{x:x+0.25,y:y+0.2,w:3.3,h:0.5,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:13.5,bold:true,color:TEAL});
    s.addText(a[1],{x:x+0.25,y:y+0.7,w:3.32,h:0.5,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:MUTE,lineSpacing:15});
  });
  notes(s,'Worked example to give: a woman becomes pregnant because an enzyme-inducing drug stopped her '
    +'contraceptive working. That is a pharmacovigilance case. Almost nobody reports it.');
})();

(function(){
  const s = slide('Why one more report matters','The problem this system has');
  statBlock(s,M,1.7,3.6,'< 10%','of adverse reactions are ever reported through spontaneous systems',CRIM);
  statBlock(s,M+4.2,1.7,3.6,'~ 5%','is the figure most published reviews settle near',CRIM);
  statBlock(s,M+8.4,1.7,3.62,'15','calendar days to report a serious case, from first receipt',TEAL);
  card(s,M,4.15,12.06,1.25,'FEF2F2');
  s.addText('At a reporting rate of a few per cent, every form you send in stands for many that were never sent. '
    +'That is why "somebody else will have reported it" is the most expensive sentence in pharmacovigilance.',
    {x:M+0.35,y:4.38,w:11.4,h:0.85,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,color:'7F1D1D',lineSpacing:21});
  s.addText('Under-reporting is why spontaneous reporting can only ever generate hypotheses — never measure incidence. '
    +'It is a hypothesis machine, and a very good one.',
    {x:M,y:5.65,w:12.06,h:0.7,isTextBox:true,margin:0,fontFace:BODY,fontSize:13.5,color:MUTE,lineSpacing:20});
  notes(s,'The four documented reasons people do not report: no time, did not know how, thought it was already '
    +'known, feared blame. Every one is answerable and answering them is part of the job.');
})();

(function(){
  const s = slide('Who may report, and where it goes','Reporting in India');
  const who = ['Any healthcare professional — doctor, dentist, pharmacist, nurse',
    'Pharmacy students and interns, under supervision',
    'Patients and consumers, directly',
    'Marketing authorisation holders — for whom it is a legal duty with timelines'];
  s.addText('Who can report',{x:M,y:1.62,w:5.5,h:0.35,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:17,bold:true,color:INK});
  bullets(s,M,2.05,5.5,1.9,who,13.5);
  card(s,M,4.15,5.7,1.35,'FEF2F2');
  s.addText('The belief that only a doctor may report suppresses a great many reports that should have been made.',
    {x:M+0.3,y:4.15,w:5.1,h:1.35,isTextBox:true,margin:0,valign:'middle',fontFace:BODY,fontSize:13,
     bold:true,color:'7F1D1D',lineSpacing:19});
  card(s,M,5.7,5.7,1.18,'ECFEFF');
  s.addText('Suspicion is the threshold, not proof. You are not being asked to be sure — you are being '
    +'asked to say what you saw.',
    {x:M+0.3,y:5.7,w:5.1,h:1.18,isTextBox:true,margin:0,valign:'middle',fontFace:BODY,fontSize:13,
     color:'0C4A6E',lineSpacing:19});
  const journey = [
    'You notice a suspected reaction. Suspicion is the threshold — never proof.',
    'You record it on the Suspected ADR Reporting Form.',
    'It goes to an ADR Monitoring Centre, then to the National Coordination Centre at the IPC, Ghaziabad.',
    'It is entered into VigiFlow, the WHO case management system.',
    'It joins VigiBase at the Uppsala Monitoring Centre — tens of millions of reports from 150+ countries.',
    'It is screened against every similar report worldwide.',
    'Something changes: a label, a restriction, a communication, a withdrawal.'
  ];
  s.addText('What happens next',{x:6.75,y:1.62,w:6,h:0.35,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:17,bold:true,color:INK});
  journey.forEach((t,i)=>{
    const y = 2.02 + i*0.7;
    numDot(s,6.75,y,i+1,i===6?CRIM:TEAL,0.34);
    s.addText(t,{x:7.24,y:y-0.05,w:5.44,h:0.66,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:12,color:'1E293B',lineSpacing:16});
  });
  notes(s,'The National Coordination Centre is at the Indian Pharmacopoeia Commission in Ghaziabad — say '
    +'the full name once. Land step 7 hard. Every restriction students have ever heard of — the fluoroquinolone warnings, '
    +'the rofecoxib withdrawal — began with somebody filling in a form exactly like the one they will fill in today.');
})();

/* ================= 3 · READING A CASE ================= */
sectionSlide(2,'Part two','How to read a safety case',
  'Nobody hands you a form with the boxes filled in. You get a story.');

(function(){
  const s = slide('Seven things, in this order','The shape of every case');
  const els = [
    ['Patient','Age, sex, identifier','One of the four minimum elements'],
    ['Drug','Name, dose, route, frequency','Name alone is not enough'],
    ['Indication','Why it was given','The illness can cause the event too'],
    ['Time','Drug start → event onset','Does more work than anything else'],
    ['Event','What happened, verbatim','Record the words before you code them'],
    ['Action','Withdrawn, reduced, unchanged','Sets up the dechallenge'],
    ['Outcome','Recovered, recovering, fatal…','The field most often left blank']
  ];
  els.forEach((e,i)=>{
    const x = M + i*1.73;
    card(s,x,1.7,1.6,3.0);
    numDot(s,x+0.58,1.92,i+1,TEAL,0.44);
    s.addText(e[0],{x:x+0.08,y:2.48,w:1.44,h:0.34,isTextBox:true,margin:0,align:'center',
      fontFace:HEAD,fontSize:15,bold:true,color:INK});
    s.addText(e[1],{x:x+0.12,y:2.86,w:1.36,h:0.8,isTextBox:true,margin:0,align:'center',
      fontFace:BODY,fontSize:11,color:'1E293B',lineSpacing:14});
    s.addText(e[2],{x:x+0.12,y:3.72,w:1.36,h:0.85,isTextBox:true,margin:0,align:'center',
      fontFace:BODY,fontSize:10,italic:true,color:MUTE,lineSpacing:13});
    if(i<6) s.addText('›',{x:x+1.58,y:2.9,w:0.2,h:0.3,isTextBox:true,margin:0,align:'center',
      fontFace:BODY,fontSize:18,color:FAINT});
  });
  card(s,M,5.0,12.06,1.15,'ECFEFF');
  s.addText('Learn that sequence. It is the order a report is built in, the order you should ask questions in, '
    +'and the order the rest of this workshop follows.',
    {x:M+0.35,y:5.25,w:11.4,h:0.7,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,color:'0C4A6E',lineSpacing:20});
  notes(s,'Drill this. Ask the room to recite it back: Patient, Drug, Indication, Time, Event, Action, Outcome. '
    +'If they remember one thing from the morning, it should be this.');
})();

(function(){
  const s = slide('Pull the seven elements out of this','A worked narrative');
  card(s,M,1.6,12.06,1.5,PAPER);
  s.addText([
    {text:'A 22-year-old female ',options:{color:CRIM,bold:true}},
    {text:'was prescribed ',options:{}},
    {text:'amoxicillin 500 mg three times a day ',options:{color:TEAL,bold:true}},
    {text:'for a throat infection. ',options:{color:'7C3AED',bold:true}},
    {text:'Two days after starting treatment, ',options:{color:AMBER,bold:true}},
    {text:'she developed ',options:{}},
    {text:'a widespread itchy rash. ',options:{color:RED,bold:true}},
    {text:'She stopped the medicine ',options:{color:GREEN,bold:true}},
    {text:'after consulting her physician. ',options:{}},
    {text:'The rash gradually disappeared ',options:{color:INK,bold:true}},
    {text:'over four days.',options:{}}
  ],{x:M+0.35,y:1.82,w:11.4,h:1.1,isTextBox:true,margin:0,fontFace:BODY,fontSize:16,
     color:'1E293B',lineSpacing:27});
  const key = [['Patient','A 22-year-old female',CRIM],['Drug','amoxicillin 500 mg t.d.s.',TEAL],
    ['Indication','for a throat infection','7C3AED'],['Time','two days after starting',AMBER],
    ['Event','widespread itchy rash',RED],['Action','she stopped the medicine',GREEN],
    ['Outcome','the rash disappeared',INK]];
  key.forEach((k,i)=>{
    const col=i%4, row=Math.floor(i/4);
    const x=M+col*3.03, y=3.32+row*0.95;
    s.addShape(pres.ShapeType.ellipse,{x,y:y+0.1,w:0.22,h:0.22,fill:{color:k[2]}});
    s.addText(k[0],{x:x+0.34,y,w:2.6,h:0.3,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:13.5,bold:true,color:INK});
    s.addText(k[1],{x:x+0.34,y:y+0.32,w:2.6,h:0.5,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:MUTE,lineSpacing:15});
  });
  card(s,M,5.35,12.06,1.5,'FEF3C7');
  s.addText('What the story did NOT tell you',{x:M+0.35,y:5.52,w:11.3,h:0.3,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:14,bold:true,color:'78350F'});
  s.addText('Has she ever reacted to a penicillin before?  ·  What did the rash actually look like — flat, raised, '
    +'blistered, any mouth or eye involvement, any fever?  ·  What else was she taking, including anything bought '
    +'over the counter?  ·  Who is reporting, and how do we reach them?',
    {x:M+0.35,y:5.88,w:11.4,h:0.85,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     color:'78350F',lineSpacing:18});
  notes(s,'The description question is the important one. "Rash" covers a nuisance and a dermatological '
    +'emergency. Fever, mucosal involvement and skin pain are what separate them — and if nobody asks, '
    +'the case is unassessable forever.');
})();

/* ================= 4 · THE DRUG ================= */
sectionSlide(3,'Part three','Understand the drug first',
  'Assessing a reaction without reading about the medicine is guessing.');

(function(){
  const s = slide('One sentence of mechanism explains every adverse effect','Worked drug card — diclofenac');
  const d = D.DRUGS.diclofenac;
  card(s,M,1.58,12.06,1.3,'ECFEFF');
  s.addText('How it works',{x:M+0.35,y:1.72,w:3,h:0.28,isTextBox:true,margin:0,valign:'top',
    fontFace:BODY,fontSize:11,bold:true,color:TEAL,charSpacing:2});
  s.addText(d.how,{x:M+0.35,y:2.02,w:11.4,h:0.78,isTextBox:true,margin:0,valign:'top',
    fontFace:BODY,fontSize:13.5,color:'0C4A6E',lineSpacing:19});
  /* Shortened for the column width; the full wording lives on the drug card
     in the workshop, which is where students read it. */
  const cols = [
    ['Common',['Indigestion, heartburn, stomach pain','Nausea','Headache, dizziness',
      'Fluid retention, ankle swelling','Rise in blood pressure'],TEAL],
    ['Serious',['GI bleeding or perforation','Acute kidney injury','Heart attack and stroke',
      'Bronchospasm in asthmatics','Heart failure decompensation'],RED],
    ['Do not give if',['Active peptic ulcer or GI bleed','Heart failure, ischaemic heart or '
      +'vascular disease','Severe kidney or liver impairment','Third trimester of pregnancy'],AMBER],
    ['Ask / monitor',['Black stools, vomiting blood','Urine output, swelling, weight',
      'Blood pressure','Kidney function and potassium'],GREEN]
  ];
  cols.forEach((c,i)=>{
    const x = M+i*3.03;
    card(s,x,3.05,2.85,2.9);
    s.addText(c[0],{x:x+0.22,y:3.2,w:2.4,h:0.3,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:14,bold:true,color:c[2]});
    bullets(s,x+0.22,3.6,2.45,2.25,c[1],10.5);
  });
  card(s,M,6.08,12.06,0.85,'FEF3C7');
  s.addText('Block the chemical that signals pain and you also block the one protecting the stomach lining and '
    +'keeping blood flowing through the kidney. Learn that sentence and you never memorise an NSAID side-effect list again.',
    {x:M+0.3,y:6.24,w:11.5,h:0.6,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     bold:true,color:'78350F',lineSpacing:17});
  notes(s,'This is the slide to slow down on. Every NSAID adverse effect — GI bleed, kidney injury, fluid '
    +'retention, the asthma reaction — falls out of that one mechanism. Students who get this stop memorising.');
})();

/* ================= 5 · INTERACTIONS ================= */
sectionSlide(4,'Part four','Interactions and patient factors',
  'Nobody knows these from memory. What you are expected to do is check.');

(function(){
  const s = slide('Five steps, every time','How to read any interaction');
  const steps=[['Drug A + Drug B','the pair in front of you'],['Mechanism','what is actually happening'],
    ['Effect','what changes'],['Consequence','what it does to the patient'],
    ['What the pharmacist does','the only step that reaches the patient']];
  steps.forEach((st,i)=>{
    const x=M+i*2.45;
    card(s,x,1.66,2.28,1.68,i===4?'DCFCE7':PAPER);
    numDot(s,x+0.22,1.84,i+1,i===4?GREEN:TEAL,0.38);
    s.addText(st[0],{x:x+0.18,y:2.3,w:1.95,h:0.46,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:12.5,bold:true,color:INK,lineSpacing:16});
    s.addText(st[1],{x:x+0.18,y:2.78,w:1.95,h:0.48,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:10.5,color:MUTE,lineSpacing:14});
    if(i<4) s.addText('›',{x:x+2.26,y:2.34,w:0.2,h:0.3,isTextBox:true,margin:0,
      align:'center',fontFace:BODY,fontSize:17,color:FAINT});
  });
  const rag=[['🟢','No significant interaction','Dispense as prescribed.',GREEN,'DCFCE7'],
    ['🟡','Monitor — potential interaction','It can be used, but something must change: monitoring, a dose, timing, counselling.',AMBER,'FEF3C7'],
    ['🔴','Clinically important','Do not dispense without speaking to the prescriber.',RED,'FEE2E2']];
  s.addText('The traffic lights are about what YOU must do, not how interesting the pharmacology is',
    {x:M,y:3.52,w:12,h:0.32,isTextBox:true,margin:0,fontFace:HEAD,fontSize:15,bold:true,color:INK});
  rag.forEach((r,i)=>{
    const x=M+i*4.03;
    card(s,x,3.95,3.78,1.5,r[4]);
    s.addText(r[0],{x:x+0.22,y:4.12,w:0.4,h:0.4,isTextBox:true,margin:0,fontFace:BODY,fontSize:17});
    s.addText(r[1],{x:x+0.7,y:4.14,w:2.9,h:0.36,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:12.5,bold:true,color:r[3]});
    s.addText(r[2],{x:x+0.22,y:4.62,w:3.35,h:0.7,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11,color:'1E293B',lineSpacing:15});
  });
  card(s,M,5.65,12.06,1.1,'ECFEFF');
  s.addText('A good checker also tells you when NOT to worry. Over-warning has a cost: people stop reading the '
    +'warnings that matter. Amoxicillin and the contraceptive pill is a myth — rifampicin is not.',
    {x:M+0.35,y:5.85,w:11.4,h:0.75,isTextBox:true,margin:0,fontFace:BODY,fontSize:13,
     color:'0C4A6E',lineSpacing:19});
  notes(s,'Demonstrate live in the workshop tool if you can. The point to land: students think the skill is '
    +'knowing the pairs. It is not. It is running the check and then saying what happens next.');
})();

(function(){
  const s = slide('Three drugs, one kidney, no defences left','Worked example — the triple whammy');
  const three=[['ACE inhibitor','blocks the vessel LEAVING the glomerulus from narrowing'],
    ['NSAID','blocks the vessel ENTERING it from widening'],
    ['Diuretic','removes the circulating volume the kidney needed']];
  three.forEach((t,i)=>{
    const x=M+i*4.03;
    card(s,x,1.7,3.78,1.45,'FEE2E2');
    s.addText(t[0],{x:x+0.25,y:1.88,w:3.3,h:0.34,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:15,bold:true,color:RED});
    s.addText(t[1],{x:x+0.25,y:2.26,w:3.32,h:0.75,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:12,color:'7F1D1D',lineSpacing:16});
    if(i<2) s.addText('+',{x:x+3.76,y:2.2,w:0.3,h:0.3,isTextBox:true,margin:0,align:'center',
      fontFace:BODY,fontSize:19,bold:true,color:RED});
  });
  s.addText('↓',{x:6.4,y:3.18,w:0.5,h:0.36,isTextBox:true,margin:0,align:'center',
    fontFace:BODY,fontSize:22,color:RED});
  card(s,M,3.56,12.06,0.9,INK);
  s.addText('Acute kidney injury — one of the most preventable causes in general practice',
    {x:M,y:3.56,w:12.06,h:0.9,isTextBox:true,margin:0,align:'center',valign:'middle',
     fontFace:HEAD,fontSize:19,bold:true,color:WHITE});
  const acts=['Check for the third drug. Two of the three are often already on the repeat.',
    'The third is usually bought over the counter — ask by name, not "any other medicines?".',
    'Check creatinine, eGFR and potassium.','Sick-day rules: hold all three if the patient becomes dehydrated.',
    'Paracetamol instead, wherever the indication allows.'];
  s.addText('What the pharmacist does',{x:M,y:4.62,w:6,h:0.32,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:15,bold:true,color:GREEN});
  bullets(s,M,5.0,6.0,1.95,acts,11.8);
  card(s,6.9,4.6,5.78,2.36,'FEF3C7');
  s.addText('Why patients assemble this themselves',{x:7.18,y:4.8,w:5.2,h:0.32,isTextBox:true,margin:0,
    valign:'top',fontFace:HEAD,fontSize:13.5,bold:true,color:'78350F'});
  s.addText('The blood pressure tablets came from the surgery. The painkiller came from a shop, for a bad knee, '
    +'and does not feel like a medicine. Neither prescriber ever saw all three together. You might be the only '
    +'person who does.',
    {x:7.18,y:5.2,w:5.24,h:1.6,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:12,
     color:'78350F',lineSpacing:17});
  notes(s,'Say the three words out loud and make the room repeat them: triple whammy. It is one of the very '
    +'few mnemonics in this session worth carrying.');
})();

(function(){
  const s = slide('Same prescription. Different patient. Different answer.','Drug–disease and patient factors');
  card(s,M,1.42,12.06,0.85,INK);
  s.addText('Never assess a medicine on its own. Assess  drug + patient + disease + other drugs.',
    {x:M,y:1.42,w:12.06,h:0.85,isTextBox:true,margin:0,align:'center',valign:'middle',
     fontFace:HEAD,fontSize:18,bold:true,color:WHITE});
  const pairs = D.DRUG_DISEASE.slice(0,6).map(x=>[
    (D.DRUGS[x.drug]||{}).generic||x.drug, x.cond, x.conseq, x.rag
  ]);
  pairs.forEach((p,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=M+col*6.15, y=2.44+row*1.4;
    card(s,x,y,5.85,1.26, p[3]==='red'?'FEE2E2':'FEF3C7');
    s.addText(p[0]+'  +  '+p[1],{x:x+0.25,y:y+0.14,w:5.35,h:0.36,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:13,bold:true,color:p[3]==='red'?RED:AMBER});
    s.addText(p[2],{x:x+0.25,y:y+0.54,w:5.35,h:0.6,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:11.5,color:'1E293B',lineSpacing:15});
  });
  s.addText('Nothing about the prescription looks wrong until you know what else the patient has.',
    {x:M,y:6.72,w:12.06,h:0.35,isTextBox:true,margin:0,align:'center',valign:'top',
     fontFace:BODY,fontSize:13.5,italic:true,color:MUTE});
  notes(s,'The beta-blocker in an asthmatic is the cleanest example in the syllabus — a good medicine that '
    +'can kill this particular patient, on a prescription that looks identical either way.');
})();

/* ================= 6 · IS IT AN ADR? ================= */
sectionSlide(5,'Part five','Is it even an adverse drug reaction?',
  'Three patients took a medicine and then had a symptom. That does not make three ADRs.');

(function(){
  const s = slide('Which case requires further investigation?','Compare three cases');
  const cases = D.COMPARE;
  cases.forEach((c,i)=>{
    const x = M+i*4.03;
    const tint = c.verdict==='high'?'DCFCE7':c.verdict==='confounded'?'ECFEFF':PAPER;
    card(s,x,1.65,3.78,3.3,tint);
    s.addText(c.title+' · '+c.drug,{x:x+0.25,y:1.85,w:3.3,h:0.34,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:14,bold:true,color:INK});
    s.addText(c.text,{x:x+0.25,y:2.24,w:3.32,h:1.65,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:'1E293B',lineSpacing:16});
    s.addText([{text:'Event: ',options:{bold:true}},{text:c.event,options:{breakLine:true}},
               {text:'Timing: ',options:{bold:true}},{text:c.timing,options:{}}],
      {x:x+0.25,y:3.98,w:3.32,h:0.72,isTextBox:true,margin:0,fontFace:BODY,fontSize:11,
       color:MUTE,lineSpacing:15});
  });
  const verdicts=[['Case A','Record it. It does not demand investigation.',MUTE],
    ['Case B','Investigate. The answer will follow her for life.',GREEN],
    ['Case C','Cannot be assessed yet — and saying so is correct.',TEAL]];
  verdicts.forEach((v,i)=>{
    const x=M+i*4.03;
    s.addText(v[0],{x,y:5.1,w:1.2,h:0.3,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:13,bold:true,color:v[2]});
    s.addText(v[1],{x,y:5.42,w:3.78,h:0.6,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:'1E293B',lineSpacing:15});
  });
  card(s,M,6.15,12.06,0.95,'FEF3C7');
  s.addText('B and C are both right answers. B because getting it right matters; C because you genuinely cannot tell yet. '
    +'A student who confidently assigns causality to Case C has learned the wrong lesson.',
    {x:M+0.35,y:6.33,w:11.4,h:0.65,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     bold:true,color:'78350F',lineSpacing:17});
  notes(s,'Run this as a vote before revealing. Most rooms pick B. Ask who picked C and why — then tell them '
    +'they are also right. That moment is worth more than the slide.');
})();

(function(){
  const s = slide('The step beginners skip and assessors care most about','Alternative causes');
  card(s,M,1.6,12.06,0.9,'FEE2E2');
  s.addText('A temporal relationship is necessary. It is nowhere near sufficient.',
    {x:M,y:1.78,w:12.06,h:0.5,isTextBox:true,margin:0,align:'center',
     fontFace:HEAD,fontSize:19,bold:true,color:RED});
  const alts=[['The illness itself','A viral rash in someone given an antibiotic for a sore throat.'],
    ['Another medicine','Including anything bought over the counter, herbal, or borrowed.'],
    ['Food, products, environment','New soap, new detergent, a plant, street food.'],
    ['A co-existing condition','Kidney or liver disease changing how the drug behaves.'],
    ['Something entirely unrelated','Poor sleep, dehydration, caffeine withdrawal.'],
    ['A specific interaction','Harm that belongs to the combination, not the drug.']];
  alts.forEach((a,i)=>{
    const col=i%3,row=Math.floor(i/3);
    const x=M+col*4.03,y=2.7+row*1.45;
    card(s,x,y,3.78,1.28);
    numDot(s,x+0.25,y+0.22,i+1,TEAL,0.38);
    s.addText(a[0],{x:x+0.72,y:y+0.2,w:2.85,h:0.34,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:13,bold:true,color:INK});
    s.addText(a[1],{x:x+0.25,y:y+0.6,w:3.32,h:0.6,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:MUTE,lineSpacing:15});
  });
  card(s,M,5.7,12.06,1.15,'DCFCE7');
  s.addText('Ruling alternatives out is the highest-scoring single item on the Naranjo scale: finding one costs a point, '
    +'excluding them gains two. The scale is built to reward actually investigating.',
    {x:M+0.35,y:5.92,w:11.4,h:0.75,isTextBox:true,margin:0,fontFace:BODY,fontSize:13.5,
     color:'14532D',lineSpacing:19});
  notes(s,'Confounding is the word to introduce here. Case C from the previous slide is the illustration: '
    +'three competing explanations, none tested.');
})();

(function(){
  const s = slide('Four things, or it is not a report','The minimum elements of an ICSR');
  const four=[['An identifiable patient','Initials, age or sex will do. A full name is not required — and usually should not be recorded.'],
    ['An identifiable reporter','Somebody contactable. A name with no email or phone cannot be followed up.'],
    ['A suspect medicinal product','At least one named suspect drug.'],
    ['A suspected adverse reaction','Something that actually happened to the patient.']];
  four.forEach((f,i)=>{
    const x=M+i*3.03;
    card(s,x,1.75,2.85,2.6,'ECFEFF');
    numDot(s,x+1.16,1.98,i+1,TEAL,0.55);
    s.addText(f[0],{x:x+0.2,y:2.66,w:2.48,h:0.65,isTextBox:true,margin:0,align:'center',
      fontFace:HEAD,fontSize:14,bold:true,color:INK});
    s.addText(f[1],{x:x+0.2,y:3.32,w:2.5,h:0.92,isTextBox:true,margin:0,align:'center',
      fontFace:BODY,fontSize:11,color:MUTE,lineSpacing:15});
  });
  card(s,M,4.6,5.85,2.1,'FEE2E2');
  s.addText('Not on the list',{x:M+0.3,y:4.8,w:5.2,h:0.3,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:14,bold:true,color:RED});
  bullets(s,M+0.3,5.15,5.2,1.4,['A confirmed causality assessment',
    'Laboratory confirmation','Proof the drug did it'],12.5);
  card(s,6.77,4.6,5.91,2.1,'DCFCE7');
  s.addText('Why none of them is about proof',{x:7.07,y:4.8,w:5.3,h:0.3,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:14,bold:true,color:GREEN});
  s.addText('Causality is assessed afterwards, centrally, by people with the whole database in front of them. '
    +'If proof were the threshold the system would collect almost nothing — which is exactly what happens '
    +'in departments where people believe it is.',
    {x:7.07,y:5.15,w:5.35,h:1.4,isTextBox:true,margin:0,fontFace:BODY,fontSize:12,
     color:'14532D',lineSpacing:17});
  notes(s,'Make them recite: patient, reporter, product, event. Then ask what is missing from the list. '
    +'Somebody always says "proof" — that is the teachable moment.');
})();

/* ================= 7 · SERIOUSNESS & CAUSALITY ================= */
sectionSlide(6,'Part six','Seriousness, severity and causality',
  'Two words that are not interchangeable, and the assessment everything else was gathered for.');

(function(){
  const s = slide('Six outcomes. Any one of them makes a case serious.','Seriousness');
  const crit = E.SERIOUS_CRITERIA;
  /* criterion six is the longest in the dataset; the closing sentence is on
     the dark bar below, so it is not repeated inside the card */
  const trim = t => t.replace(' This is where experienced assessors do most of their work.','');
  crit.forEach((c,i)=>{
    const col=i%2,row=Math.floor(i/2);
    const x=M+col*6.15, y=1.56+row*1.5;
    const twoLine = c.label.length > 38;
    card(s,x,y,5.85,1.4, i===5?'FEF3C7':PAPER);
    numDot(s,x+0.25,y+0.2,i+1,i===5?AMBER:RED,0.4);
    s.addText(c.label,{x:x+0.75,y:y+0.16,w:4.95,h:twoLine?0.5:0.3,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:13,bold:true,color:INK,lineSpacing:17});
    s.addText(trim(c.ex),{x:x+0.25,y:y+(twoLine?0.72:0.54),w:5.38,h:twoLine?0.58:0.76,
      isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:10.5,color:MUTE,lineSpacing:14});
  });
  card(s,M,6.1,12.06,0.92,INK);
  s.addText('"Other medically important condition" is not a lesser category. It is the one that catches the treated '
    +'anaphylaxis, the severe hypoglycaemia, the bronchospasm settled at home.',
    {x:M+0.35,y:6.1,w:11.4,h:0.92,isTextBox:true,margin:0,valign:'middle',fontFace:BODY,fontSize:13,
     color:'CBD5E1',lineSpacing:19});
  notes(s,'If students only ever use the hospitalisation criterion they will classify a great many dangerous '
    +'cases as non-serious. That is the failure this slide exists to prevent.');
})();

(function(){
  const s = slide('Severity is how intense. Seriousness is what happened.','Two different questions');
  card(s,M,1.7,5.85,2.6,'ECFEFF');
  s.addText('SEVERITY',{x:M+0.32,y:1.92,w:5.2,h:0.32,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:12,bold:true,color:TEAL,charSpacing:3});
  s.addText('How intense was it?',{x:M+0.32,y:2.26,w:5.2,h:0.4,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:20,bold:true,color:INK});
  s.addText('Mild · Moderate · Severe\n\nA clinical description of the reaction itself. '
    +'It is recorded, but it does not set any timeline.',
    {x:M+0.32,y:2.78,w:5.25,h:1.35,isTextBox:true,margin:0,fontFace:BODY,fontSize:13,
     color:'0C4A6E',lineSpacing:19});
  card(s,6.77,1.7,5.91,2.6,'FEE2E2');
  s.addText('SERIOUSNESS',{x:7.09,y:1.92,w:5.2,h:0.32,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:12,bold:true,color:RED,charSpacing:3});
  s.addText('Did one of six things happen?',{x:7.09,y:2.26,w:5.3,h:0.4,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:20,bold:true,color:INK});
  s.addText('Serious · Non-serious\n\nA regulatory classification based on outcome. '
    +'It sets the reporting timeline — serious cases are expedited.',
    {x:7.09,y:2.78,w:5.3,h:1.35,isTextBox:true,margin:0,fontFace:BODY,fontSize:13,
     color:'7F1D1D',lineSpacing:19});
  s.addText('Two worked examples that make the difference unforgettable',
    {x:M,y:4.55,w:12,h:0.34,isTextBox:true,margin:0,fontFace:HEAD,fontSize:16,bold:true,color:INK});
  const ex=[['A severe migraine','Agonising. Off work for a day. No admission, full recovery.',
      'SEVERE but NOT SERIOUS',AMBER,'FEF3C7'],
    ['A dangerously low potassium found on a routine blood test','Patient feels completely well.',
      'SERIOUS but NOT SEVERE',RED,'FEE2E2']];
  ex.forEach((e,i)=>{
    const x=M+i*6.15;
    card(s,x,5.0,5.85,1.75,e[4]);
    s.addText(e[0],{x:x+0.28,y:5.18,w:5.3,h:0.5,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:14,bold:true,color:INK});
    s.addText(e[1],{x:x+0.28,y:5.68,w:5.3,h:0.42,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:12,color:MUTE,lineSpacing:16});
    s.addText(e[2],{x:x+0.28,y:6.16,w:5.3,h:0.38,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:15,bold:true,color:e[3]});
  });
  notes(s,'Mixing these two up is the single most common error in the whole subject. Both examples are worth '
    +'stating slowly. The potassium one usually gets an audible reaction.');
})();

(function(){
  const s = slide('Four plain questions. No jargon yet.','Causality, the way a clinician actually thinks');
  const qs = E.GUIDE_Q.map((g,i)=>[i+1,g.q]);
  qs.forEach((q,i)=>{
    const y = 1.72+i*1.02;
    numDot(s,M,y+0.08,q[0],TEAL,0.5);
    card(s,M+0.68,y,6.1,0.86,PAPER);
    s.addText(q[1],{x:M+0.92,y:y+0.13,w:5.65,h:0.62,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:13,color:'1E293B',lineSpacing:17});
  });
  card(s,7.65,1.68,5.03,2.55,'DCFCE7');
  s.addText('You have just done a causality assessment',{x:7.93,y:1.88,w:4.5,h:0.62,isTextBox:true,margin:0,
    valign:'top',fontFace:HEAD,fontSize:16,bold:true,color:GREEN});
  s.addText('Time relationship, dechallenge, alternative causes, known reaction. Every formal scale is a more '
    +'detailed version of exactly those four. The terminology comes after, on purpose — so you recognise you '
    +'were already doing it.',
    {x:7.93,y:2.54,w:4.5,h:1.6,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:12,
     color:'14532D',lineSpacing:17});
  card(s,7.65,4.4,5.03,2.0,'FEF3C7');
  s.addText('The ceiling on almost every real case',{x:7.93,y:4.6,w:4.5,h:0.34,isTextBox:true,margin:0,
    valign:'top',fontFace:HEAD,fontSize:14,bold:true,color:'78350F'});
  s.addText('To go above "probable" you need a positive rechallenge — giving the drug again and watching the '
    +'reaction return. That is almost never ethical and almost never done. Probable is the realistic top of a '
    +'well-investigated case, and that is fine.',
    {x:7.93,y:4.98,w:4.5,h:1.32,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:11.5,
     color:'78350F',lineSpacing:16});
  notes(s,'Do these four aloud against the amoxicillin rash case. Yes, yes, no, yes — probable. Then reveal '
    +'that they have just used the WHO-UMC framework without being told its name.');
})();

(function(){
  const s = slide('Six categories, and what each one requires','WHO-UMC causality');
  const order=['certain','probable','possible','unlikely','conditional','unassessable'];
  const tint={certain:'DCFCE7',probable:'DCFCE7',possible:'ECFEFF',unlikely:'F1F5F9',
    conditional:'FEF3C7',unassessable:'FEF3C7'};
  /* Condensed for the card; the full WHO-UMC wording is in pvx-learn-engine.js
     and is what the workshop marks students against. */
  const need = {
    certain:['Plausible time relationship','Not explained by disease or other drugs',
      'Plausible response to withdrawal','A definitive, recognised drug effect','Rechallenge positive'],
    probable:['Reasonable time relationship','Unlikely to be disease or other drugs',
      'Clinically reasonable response on withdrawal','Rechallenge not required'],
    possible:['Reasonable time relationship','Could also be disease or other drugs',
      'Withdrawal information lacking or unclear'],
    unlikely:['Timing makes causation improbable','Other drugs or disease explain it plausibly'],
    conditional:['Reported as an adverse reaction','More data essential before it can be assessed',
      'Data requested and awaited'],
    unassessable:['Cannot be judged — information insufficient or contradictory',
      'The data cannot be supplemented or verified']
  };
  const note = {
    certain:'Without a positive rechallenge you almost never get here.',
    probable:'Where a well-investigated case with a clear dechallenge lands.',
    possible:'Confounded, or nobody recorded the dechallenge. Very common.',
    unlikely:'Say so when it is true. Over-attributing damages the database too.',
    conditional:'You are waiting for information you have actually asked for.',
    unassessable:'The information is never coming — not merely unchased.'
  };
  order.forEach((k,i)=>{
    const w = E.WHO_UMC[k];
    const col=i%3,row=Math.floor(i/3);
    const x=M+col*4.03,y=1.45+row*2.45;
    card(s,x,y,3.78,2.36,tint[k]);
    s.addText(w.name,{x:x+0.25,y:y+0.16,w:3.3,h:0.52,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:15,bold:true,color:INK,lineSpacing:19});
    bullets(s,x+0.25,y+0.7,3.3,1.24,need[k],9.2,3);
    s.addText(note[k],{x:x+0.25,y:y+1.98,w:3.3,h:0.38,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:9.8,italic:true,color:MUTE,lineSpacing:13});
  });
  card(s,M,6.44,12.06,0.56,INK);
  s.addText('"Possible" and "Unassessable" are honest categories, used constantly. They are not failures.',
    {x:M,y:6.44,w:12.06,h:0.56,isTextBox:true,margin:0,align:'center',valign:'middle',
     fontFace:BODY,fontSize:13.5,color:'CBD5E1'});
  notes(s,'Conditional means you are still waiting for information you have asked for. Unassessable means it '
    +'is never coming. Students conflate them constantly.');
})();

(function(){
  const s = slide('Ten questions, and two of them are reversed','The Naranjo scale');
  const rows=[[
    {text:'#',options:{bold:true,color:WHITE,fill:{color:INK}}},
    {text:'Item',options:{bold:true,color:WHITE,fill:{color:INK}}},
    {text:'Yes',options:{bold:true,color:WHITE,fill:{color:INK},align:'center'}},
    {text:'No',options:{bold:true,color:WHITE,fill:{color:INK},align:'center'}},
    {text:'Unknown',options:{bold:true,color:WHITE,fill:{color:INK},align:'center'}}
  ]];
  /* The three longest items, shortened so no row is cut mid-sentence.
     The full wording is in pvx-learn-engine.js and is what the workshop asks. */
  const SHORT_Q = {
    2:'Did the reaction improve when the drug was stopped, or an antagonist given?',
    7:'Was the reaction worse on a higher dose, or milder on a lower one?',
    8:'Has the patient reacted to this or a similar drug before?'
  };
  E.NARANJO.forEach((n,i)=>{
    const rev = (i===4||i===5);
    rows.push([
      {text:String(i+1),options:{bold:true,color:rev?AMBER:MUTE}},
      {text:SHORT_Q[i]||n.q,options:{bold:rev}},
      {text:(n.w[0]>0?'+':'')+n.w[0],options:{align:'center',bold:true,color:n.w[0]>0?GREEN:RED}},
      {text:(n.w[1]>0?'+':'')+n.w[1],options:{align:'center',bold:true,color:n.w[1]>0?GREEN:(n.w[1]<0?RED:MUTE)}},
      {text:String(n.w[2]),options:{align:'center',color:MUTE}}
    ]);
  });
  tbl(s,M,1.6,7.5,rows,[0.4,4.95,0.6,0.6,0.95],{fs:10});
  card(s,8.3,1.6,4.38,1.55,'FEF3C7');
  s.addText('Items 5 and 6 are reversed',{x:8.58,y:1.78,w:3.85,h:0.32,isTextBox:true,margin:0,
    valign:'top',fontFace:HEAD,fontSize:14,bold:true,color:'78350F'});
  s.addText('Finding an alternative cause LOSES a point. Ruling them out gains two. The scale is built to '
    +'reward investigating.',
    {x:8.58,y:2.14,w:3.85,h:0.92,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:11.5,
     color:'78350F',lineSpacing:16});
  const bands=[['≥ 9','Definite',GREEN],['5–8','Probable',TEAL],
    ['1–4','Possible',AMBER],['≤ 0','Doubtful',MUTE]];
  s.addText('Bands',{x:8.3,y:3.3,w:4,h:0.3,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:14,bold:true,color:INK});
  bands.forEach((b,i)=>{
    const y=3.66+i*0.48;
    card(s,8.3,y,4.38,0.42);
    s.addText(b[0],{x:8.5,y:y+0.05,w:0.9,h:0.32,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:12,bold:true,color:b[2]});
    s.addText(b[1],{x:9.45,y:y+0.05,w:3.1,h:0.32,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:12,color:'1E293B'});
  });
  card(s,8.3,5.7,4.38,1.3,'FEE2E2');
  s.addText('A low score is not innocence',{x:8.58,y:5.86,w:3.85,h:0.3,isTextBox:true,margin:0,
    valign:'top',fontFace:HEAD,fontSize:13,bold:true,color:RED});
  s.addText('Rechallenge and placebo are almost never answerable, which quietly caps most real cases. '
    +'Read the score as how much evidence you could GET.',
    {x:8.58,y:6.2,w:3.85,h:0.74,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:11,
     color:'7F1D1D',lineSpacing:15});
  notes(s,'Maximum realistically achievable is 13, not the theoretical top. Work an example: a typical '
    +'well-documented case lands on 6 or 7 — probable.');
})();

/* ================= 8 · CODING AND THE REPORT ================= */
sectionSlide(7,'Part seven','Coding and building the report',
  'The patient’s words are not the coded term, and both belong in the report.');

(function(){
  const s = slide('The same complaint, at four levels','Coding a reaction');
  const chain=[['What the patient said','"Swelling around both ankles"','The verbatim record. Never discard it.',CRIM],
    ['Lowest level term','Ankle swelling','The phrasing the dictionary recognises.',AMBER],
    ['Preferred term','Peripheral oedema','What the case is coded to.',TEAL],
    ['System organ class','General disorders','How the database groups it.',INK]];
  chain.forEach((c,i)=>{
    const y=1.65+i*1.25;
    numDot(s,M,y+0.16,i+1,c[3],0.46);
    card(s,M+0.68,y,6.75,1.08);
    s.addText(c[0],{x:M+0.95,y:y+0.13,w:2.6,h:0.28,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:11,bold:true,color:c[3],charSpacing:1.5});
    s.addText(c[1],{x:M+0.95,y:y+0.4,w:6.2,h:0.36,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:16,bold:true,color:INK});
    s.addText(c[2],{x:M+0.95,y:y+0.77,w:6.2,h:0.26,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:11,color:MUTE});
    if(i<3) s.addText('↓',{x:M+0.16,y:y+0.72,w:0.28,h:0.4,isTextBox:true,margin:0,
      align:'center',fontFace:BODY,fontSize:15,color:FAINT});
  });
  card(s,8.25,1.65,4.43,2.3,'FEE2E2');
  s.addText('The term you choose decides what the database can find',
    {x:8.53,y:1.85,w:3.9,h:0.6,isTextBox:true,margin:0,valign:'top',fontFace:HEAD,fontSize:14.5,bold:true,color:RED});
  s.addText('Code a blistering rash with mouth ulcers and fever as "Rash" and the case disappears. '
    +'Code a diabetic’s collapse as "Dizziness" instead of "Hypoglycaemia" and it lands in a completely '
    +'different part of the database.',
    {x:8.53,y:2.5,w:3.9,h:1.32,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:11.5,
     color:'7F1D1D',lineSpacing:16});
  card(s,8.25,4.1,4.43,2.5,'FEF3C7');
  s.addText('A note on MedDRA',{x:8.53,y:4.3,w:3.9,h:0.32,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:14,bold:true,color:'78350F'});
  s.addText('The real dictionary is maintained by the MSSO under licence from ICH and cannot be embedded in a '
    +'public teaching tool. What the workshop uses is a synthetic dictionary in the same SHAPE, with codes '
    +'prefixed SYN- so they can never be mistaken for real ones. The structure is the lesson. Real coding needs '
    +'a current licensed browser.',
    {x:8.53,y:4.66,w:3.9,h:1.82,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:10.8,
     color:'78350F',lineSpacing:15});
  notes(s,'Emphasise: record the verbatim term BEFORE coding. Students want to jump straight to the standardised '
    +'word and the detail that separates a nuisance from an emergency is lost in that jump.');
})();

(function(){
  const s = slide('Valid and useless are different failures','Building the ICSR');
  card(s,M,1.68,5.85,2.35,'ECFEFF');
  s.addText('IS IT VALID?',{x:M+0.32,y:1.88,w:5.2,h:0.3,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:11.5,bold:true,color:TEAL,charSpacing:2.5});
  s.addText('Can it be processed at all?',{x:M+0.32,y:2.2,w:5.2,h:0.36,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:18,bold:true,color:INK});
  s.addText('The four minimum elements. Miss one and it is an enquiry, not a case — it cannot enter the '
    +'database at all.',
    {x:M+0.32,y:2.66,w:5.25,h:1.1,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     color:'0C4A6E',lineSpacing:18});
  card(s,6.77,1.68,5.91,2.35,'FEF3C7');
  s.addText('IS IT ANY USE?',{x:7.09,y:1.88,w:5.2,h:0.3,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:11.5,bold:true,color:AMBER,charSpacing:2.5});
  s.addText('Can anyone assess it?',{x:7.09,y:2.2,w:5.2,h:0.36,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:18,bold:true,color:INK});
  s.addText('Onset date, dechallenge, outcome, concomitant medicines. Most reports in the world’s databases '
    +'are valid and hard to assess, because these are the fields people leave blank.',
    {x:7.09,y:2.66,w:5.3,h:1.1,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     color:'78350F',lineSpacing:18});
  s.addText('The five fields that carry the reasoning',{x:M,y:4.28,w:12,h:0.34,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:16,bold:true,color:INK});
  const fields=[['Drug start date','half of the temporal relationship'],
    ['Event onset date','the other half'],
    ['Dechallenge','the strongest evidence you can actually get'],
    ['Outcome','required, and the most commonly omitted'],
    ['Concomitant medicines','you cannot exclude alternatives without it']];
  fields.forEach((f,i)=>{
    const x=M+i*2.45;
    card(s,x,4.62,2.28,1.7,'DCFCE7');
    numDot(s,x+0.94,4.8,i+1,GREEN,0.42);
    s.addText(f[0],{x:x+0.15,y:5.3,w:1.98,h:0.5,isTextBox:true,margin:0,align:'center',valign:'top',
      fontFace:HEAD,fontSize:12,bold:true,color:INK,lineSpacing:16});
    s.addText(f[1],{x:x+0.15,y:5.8,w:1.98,h:0.46,isTextBox:true,margin:0,align:'center',valign:'top',
      fontFace:BODY,fontSize:10.2,color:'14532D',lineSpacing:13});
  });
  card(s,M,6.5,12.06,0.64,INK);
  s.addText('If the answer is genuinely "none", write none. A blank field is read as "not asked" — a different, worse thing.',
    {x:M,y:6.5,w:12.06,h:0.64,isTextBox:true,margin:0,align:'center',valign:'middle',
     fontFace:BODY,fontSize:13,color:'CBD5E1'});
  notes(s,'Filling in those five fields is the single biggest contribution a student can make to the quality '
    +'of the world’s safety data. Say that plainly — it is true and it is motivating.');
})();

(function(){
  const s = slide('What to chase, in what order','Follow-up');
  card(s,M,1.6,12.06,0.85,'DCFCE7');
  s.addText('Most reports arrive incomplete. Follow-up is where a weak case becomes a usable one.',
    {x:M,y:1.78,w:12.06,h:0.45,isTextBox:true,margin:0,align:'center',
     fontFace:HEAD,fontSize:17,bold:true,color:GREEN});
  const chase=[['Chase first — it changes the assessment',
      ['Outcome — did the patient recover, any lasting effects?',
       'The exact dates: drug started, event began',
       'Dechallenge — what happened after stopping',
       'The complete medicine list, including over the counter'],GREEN,'DCFCE7'],
    ['Chase next — it strengthens the case',
      ['Relevant laboratory results and objective evidence',
       'Dose and frequency','Relevant medical history','Batch number, where obtainable'],TEAL,'ECFEFF'],
    ['Do NOT chase',
      ['The patient’s full name and address',
       'Anything else the report does not need',
       'More personal data is a privacy failure, not thoroughness'],RED,'FEE2E2']];
  chase.forEach((c,i)=>{
    const x=M+i*4.03;
    card(s,x,2.68,3.78,3.22,c[3]);
    s.addText(c[0],{x:x+0.25,y:2.86,w:3.3,h:0.58,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:13.5,bold:true,color:c[2],lineSpacing:18});
    bullets(s,x+0.25,3.5,3.3,2.25,c[1],11);
  });
  card(s,M,6.1,12.06,1.0,'FEF3C7');
  s.addText('The patient must be identifiable to the REPORTER, not named in the database. This is the one category '
    +'where collecting less is doing the job better.',
    {x:M+0.35,y:6.3,w:11.4,h:0.65,isTextBox:true,margin:0,fontFace:BODY,fontSize:13.5,
     bold:true,color:'78350F',lineSpacing:19});
  notes(s,'The "do not chase" column usually surprises people. Students equate thoroughness with collecting '
    +'everything. In safety data, restraint about identifiers is professional competence.');
})();

/* ================= 8 · SIGNALS ================= */
sectionSlide(8,'Part eight','From one case to a signal',
  'One report is an observation. The job of the whole system is to notice when many observations mean something new.');

(function(){
  const s = slide('What a signal actually is','Definition');
  card(s,M,1.6,12.06,1.35,'ECFEFF');
  s.addText(D.SIGNAL_SET.definition,
    {x:M+0.4,y:1.8,w:11.3,h:1.0,isTextBox:true,margin:0,fontFace:BODY,fontSize:14,
     italic:true,color:'0C4A6E',lineSpacing:21});

  s.addText('How a single report becomes regulatory action',
    {x:M,y:3.14,w:12.06,h:0.35,isTextBox:true,margin:0,valign:'top',
     fontFace:HEAD,fontSize:16,bold:true,color:INK});

  const chain = D.SIGNAL_SET.chain;
  chain.forEach((step,i)=>{
    const y = 3.62 + i*0.56;
    numDot(s,M,y,i+1, i<2?FAINT:(i<4?TEAL:CRIM), 0.4);
    s.addText(step,{x:M+0.58,y:y+0.01,w:11.4,h:0.48,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:13.5,bold:i===chain.length-1,color:i===chain.length-1?CRIM:'1E293B',
      lineSpacing:18});
  });
  notes(s,'Walk down the chain slowly. Most students imagine pharmacovigilance stops at step one — filling '
    +'in the form. Point out that steps four to six are where a label gets changed for everybody, and that '
    +'none of it happens unless step one happened first. The person who files the report is the start of '
    +'this chain, not a clerk at the end of someone else’s.');
})();

(function(){
  const s = slide('The biggest number is the trap','Signal detection · worked example');
  s.addText(D.SIGNAL_SET.drug+' — '+D.SIGNAL_SET.exposure,
    {x:M,y:1.55,w:12.06,h:0.32,isTextBox:true,margin:0,
     fontFace:BODY,fontSize:13.5,bold:true,color:MUTE});

  const hdr = ['Reported reaction','Cases','In the label?','Serious?','Signal?'];
  const rows = [hdr.map(t=>({text:t,options:{bold:true,color:WHITE,fill:{color:INK},
    fontSize:12,valign:'middle'}}))];
  const vcol = {yes:RED, watch:AMBER, no:GREEN};
  const vtxt = {yes:'YES — signal', watch:'Watch', no:'No'};
  D.SIGNAL_SET.rows.forEach(r=>{
    rows.push([
      {text:r.adr,options:{bold:true,color:INK}},
      {text:String(r.n),options:{align:'center',bold:true,fontSize:15,
        color:r.verdict==='yes'?RED:MUTE}},
      {text:r.labelled?'Yes':'No — unlabelled',options:{color:r.labelled?'1E293B':RED,
        bold:!r.labelled}},
      {text:r.serious?'Yes':'No',options:{color:r.serious?RED:'1E293B',bold:r.serious}},
      {text:vtxt[r.verdict],options:{bold:true,color:vcol[r.verdict],align:'center'}}
    ]);
  });
  tbl(s,M,2.0,12.06,rows,[3.4,1.3,3.2,1.7,2.46],{fs:12.5,rowH:0.42});

  card(s,M,4.35,12.06,1.25,'FEE2E2');
  s.addText([{text:'Nausea has 15 cases. Liver injury has 8. ',options:{bold:true,color:'7F1D1D'}},
    {text:'The eight are the signal.',options:{bold:true,color:RED}}],
    {x:M+0.4,y:4.52,w:11.3,h:0.34,isTextBox:true,margin:0,fontFace:BODY,fontSize:15});
  s.addText(D.SIGNAL_SET.rows[1].why.split('. ').slice(1).join('. '),
    {x:M+0.4,y:4.88,w:11.3,h:0.6,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,
     color:'7F1D1D',lineSpacing:18});

  card(s,M,5.82,12.06,1.12,'F8FAFC');
  s.addText([{text:'Four things decide it — not one:  ',options:{bold:true,color:INK}},
    {text:'how serious the event is  ·  whether it is already in the label  ·  how plausible it is for '
      +'that drug and its class  ·  how good the individual reports are.',options:{color:'334155'}}],
    {x:M+0.4,y:6.0,w:11.3,h:0.8,isTextBox:true,margin:0,fontFace:BODY,fontSize:13.5,lineSpacing:20});
  notes(s,'Show the table with the Signal column covered and ask the room to pick. Most will say nausea, '
    +'because it has the most cases. Then uncover it. The rash row is worth a minute too: two cases and '
    +'labelled, so not a signal on the numbers — but if either involved blistering or mucosal '
    +'involvement, two cases of a severe cutaneous reaction outweigh fifteen of nausea. Counting is the '
    +'easy part and it is not the assessment.');
})();

/* ================= 9 · THE FINAL CASE ================= */
sectionSlide(9,'Part nine','The case that looked like nothing',
  'A three-line phone call about dizziness. Everything in this course, used at once, on one patient.');

(function(){
  const s = slide('This is the entire handover','Final case · what you are given');
  const h = D.FINAL.handover;
  const pairs = [['Patient',h.patient],['Conditions',h.condition],['Medicines',h.meds],
    ['New medicine',h.newDrug],['Complaint',h.complaint],['Laboratory',h.labs],
    ['Past history',h.pmh],['Reporter',h.reporter]];
  card(s,M,1.6,12.06,4.05,'F8FAFC');
  pairs.forEach((p,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=M+0.35+col*5.85, y=1.85+row*0.95;
    s.addText(p[0].toUpperCase(),{x,y,w:5.4,h:0.24,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:10,bold:true,color:TEAL,charSpacing:1.5});
    s.addText(p[1],{x,y:y+0.26,w:5.4,h:0.62,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:13,color:'1E293B',lineSpacing:18});
  });
  card(s,M,5.85,12.06,1.05,'FEF3C7');
  s.addText('“'+h.note+'”  The drug is unnamed. The laboratory value was never read out. There are no dates. '
    +'This is what a real referral looks like.',
    {x:M+0.4,y:6.05,w:11.3,h:0.7,isTextBox:true,margin:0,fontFace:BODY,fontSize:13.5,
     bold:true,color:'78350F',lineSpacing:19});
  notes(s,'Read the handover aloud exactly as written and then stop. Let the silence sit. Ask: can anyone '
    +'assess this? The correct answer is no — and recognising that is the skill being tested, not '
    +'producing a confident guess from three lines.');
})();

(function(){
  const s = slide('The first move is not an answer — it is a list','Final case · what is missing');
  const ranked = D.FINAL.missing.filter(m=>m.weight===3)
    .concat(D.FINAL.missing.filter(m=>m.weight===2))
    .concat(D.FINAL.missing.filter(m=>m.weight===1));
  const top = ranked.slice(0,4), rest = ranked.slice(4);
  s.addText(D.FINAL.missing.length+' things are missing. These four come first.',
    {x:M,y:1.5,w:12.06,h:0.32,isTextBox:true,margin:0,valign:'top',
     fontFace:BODY,fontSize:14,color:MUTE});
  top.forEach((m,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=M+col*6.15, y=1.95+row*1.62;
    card(s,x,y,5.82,1.46, m.weight===3?'FEE2E2':'ECFEFF');
    numDot(s,x+0.25,y+0.2,i+1, m.weight===3?RED:TEAL, 0.36);
    s.addText(m.label,{x:x+0.72,y:y+0.17,w:4.85,h:0.44,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:12.5,bold:true,color:INK,lineSpacing:17});
    s.addText(m.why,{x:x+0.25,y:y+0.7,w:5.35,h:0.62,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:10.8,color:'475569',lineSpacing:15});
  });
  s.addText([{text:'And '+rest.length+' more: ',options:{bold:true,color:INK}},
    {text:rest.map(m=>m.label.replace(/^The /,'').replace(/^What /,'')).join('  ·  ')+'.',
     options:{color:'475569'}}],
    {x:M,y:5.28,w:12.06,h:0.5,isTextBox:true,margin:0,valign:'top',
     fontFace:BODY,fontSize:11.8,lineSpacing:17});
  card(s,M,5.9,12.06,1.05,'F8FAFC');
  s.addText('Nobody in the room can diagnose this patient. Everybody in the room can write this list — and '
    +'the list is what actually gets the case solved.',
    {x:M+0.4,y:5.9,w:11.3,h:1.05,isTextBox:true,margin:0,valign:'middle',fontFace:BODY,fontSize:14,
     bold:true,color:INK,lineSpacing:20});
  notes(s,'This is the pivot of the whole workshop. Beginners freeze because they think the task is to know '
    +'the answer. Reframe it: the task is to know what you are missing. Have the room build the list on a '
    +'board before you show this slide.');
})();

(function(){
  const s = slide('Five places to look — and what each one gave','Final case · the investigation');
  const R = D.FINAL.reveal;
  const src = [['Pharmacy dispensing record',
      'The drug has a name: glimepiride 2 mg, first dispensed 24 August. And an over-the-counter ibuprofen '
      +'nobody mentioned and nobody prescribed.',TEAL],
    ['Laboratory results',
      'Glucose 52 mg/dL during an episode. eGFR fallen from 52 to 38. The HbA1c of 7.9% looks reassuring '
      +'and is a trap — it lags 8–12 weeks and still describes the period before this drug.',CRIM],
    ['Patient interview',
      'Sweating and shaking, before lunch, on an empty stomach, relieved by sugar. And she has been eating '
      +'less on her own initiative.',TEAL],
    ['Prescriber notes',
      'The dates, so you finally have an interval. And BP 138/82 sitting, 130/78 standing — no postural '
      +'drop, so the main alternative is ruled out.',TEAL],
    ['Reporter details',
      'Identifiable, contactable, willing to follow up. The case is now a valid, followable ICSR.',TEAL]];
  src.forEach((c,i)=>{
    const y = 1.56 + i*1.04;
    card(s,M,y,12.06,0.96, i===1?'FEF2F2':'F8FAFC');
    numDot(s,M+0.28,y+0.27,i+1,c[2],0.42);
    s.addText(c[0],{x:M+0.85,y:y+0.12,w:3.3,h:0.32,isTextBox:true,margin:0,valign:'top',
      fontFace:HEAD,fontSize:13,bold:true,color:c[2]});
    s.addText(c[1],{x:M+0.85,y:y+0.44,w:10.9,h:0.48,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:11.5,color:'334155',lineSpacing:16});
  });
  s.addText('Nothing here required a diagnosis. It required five phone calls.',
    {x:M,y:6.85,w:12.06,h:0.34,isTextBox:true,margin:0,align:'center',valign:'top',
     fontFace:HEAD,fontSize:15,bold:true,color:INK});
  notes(s,'Each source costs the student a point in the workshop, so they have to choose in what order. '
    +'That is deliberate: in practice you rarely get all five at once. Ask which two they would call first. '
    +'Pharmacy and laboratory is the strong answer — one names the drug, the other confirms the event.');
})();

(function(){
  const s = slide('What it actually was','Final case · the assessment');
  const T = D.FINAL.truth;
  card(s,M,1.5,12.06,0.98,'FEE2E2');
  s.addText([{text:'Reported as ',options:{color:'7F1D1D'}},
    {text:'“dizziness”',options:{italic:true,color:'7F1D1D'}},
    {text:'   →   ',options:{color:RED,bold:true}},
    {text:T.event,options:{bold:true,color:RED}}],
    {x:M+0.4,y:1.5,w:11.3,h:0.98,isTextBox:true,margin:0,valign:'middle',
     fontFace:BODY,fontSize:16,lineSpacing:22});

  const box = [['Suspect drug',T.drug,'1E293B',false,0.5],
    ['Coded term',T.coded,'1E293B',false,0.5],
    ['Serious?','YES — other medically important condition: recurrent symptomatic hypoglycaemia, with '
      +'episodes severe enough to put a 67-year-old on the floor, and falling renal function',RED,true,0.78],
    ['Causality',T.causality,AMBER,true,1.12]];
  let y = 2.72;
  box.forEach(b=>{
    s.addText(b[0].toUpperCase(),{x:M,y:y+0.02,w:2.2,h:0.28,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:10.5,bold:true,color:TEAL,charSpacing:1.5});
    s.addText(b[1],{x:M+2.3,y,w:9.76,h:b[4],isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:12.5,color:b[2],bold:b[3],lineSpacing:17});
    y += b[4] + 0.22;
  });
  card(s,M,6.5,12.06,0.66,'ECFEFF');
  s.addText('Probable, not Certain — the drug had not yet been stopped when the case was reported. '
    +'No dechallenge, no upgrade.',
    {x:M+0.4,y:6.5,w:11.3,h:0.66,isTextBox:true,margin:0,valign:'middle',fontFace:BODY,fontSize:12.5,
     bold:true,color:'0C4A6E'});
  notes(s,'Make them justify each row against the definitions from part six. Seriousness is the one people '
    +'get wrong: she was not hospitalised, so students say non-serious. Recurrent hypoglycaemia severe '
    +'enough to put a 67-year-old on the floor, with falling renal function, is an other medically '
    +'important condition — the fall and fracture risk alone is the argument.');
})();

(function(){
  const s = slide('Five things made it happen, not one','Final case · contributing factors');
  const C = D.FINAL.truth.contributors;
  C.forEach((c,i)=>{
    const y = 1.56 + i*0.7;
    numDot(s,M,y,i+1,AMBER,0.44);
    s.addText(c,{x:M+0.62,y:y+0.03,w:11.4,h:0.52,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:13.5,color:'1E293B',lineSpacing:19});
  });
  s.addText('And three things nobody had noticed at all',
    {x:M,y:5.14,w:12.06,h:0.34,isTextBox:true,margin:0,valign:'top',
     fontFace:HEAD,fontSize:16,bold:true,color:CRIM});
  card(s,M,5.55,12.06,1.4,'FEE2E2');
  bullets(s,M+0.4,5.75,11.3,1.1,[
    'Metformin has not been reviewed against the new eGFR of 38 — not contraindicated, but the dose should be reduced.',
    'Ibuprofen plus enalapril is driving the renal decline, and nobody has flagged it.',
    'Chasing the HbA1c target in a 67-year-old with falling kidneys will look like success while she keeps having hypos.'
  ],11.2);
  notes(s,'The point of this slide: a real case almost never has a single cause. The drug is the suspect, '
    +'but renal decline, an unreported painkiller, a missed meal and a second interacting drug all had to '
    +'line up. Pharmacovigilance that stops at naming the suspect drug misses four of the five.');
})();

(function(){
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse,{x:11.0,y:5.4,w:3.2,h:3.2,fill:{color:TEAL},transparency:80});
  s.addText('FINAL CASE · WHAT TO TAKE AWAY',{x:M,y:0.46,w:8,h:0.28,isTextBox:true,margin:0,valign:'top',
    fontFace:BODY,fontSize:11,bold:true,color:TEAL2,charSpacing:2.5});
  s.addText('The lesson',{x:M,y:0.8,w:12.1,h:0.62,isTextBox:true,margin:0,valign:'top',
    fontFace:HEAD,fontSize:31,bold:true,color:WHITE});
  s.addText(D.FINAL.truth.lesson,
    {x:M,y:1.68,w:11.6,h:2.1,isTextBox:true,margin:0,valign:'top',fontFace:HEAD,fontSize:17,
     color:WHITE,lineSpacing:28});
  s.addText('WHAT HAPPENS NEXT',{x:M,y:3.95,w:6,h:0.28,isTextBox:true,margin:0,valign:'top',
    fontFace:BODY,fontSize:11,bold:true,color:TEAL2,charSpacing:2.5});
  const acts = D.FINAL.truth.actions.slice(0,6);
  acts.forEach((a,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=M+col*6.0, y=4.36+row*0.66;
    s.addShape(pres.ShapeType.ellipse,{x,y:y+0.09,w:0.14,h:0.14,fill:{color:TEAL2}});
    s.addText(a,{x:x+0.32,y,w:5.5,h:0.58,isTextBox:true,margin:0,valign:'top',
      fontFace:BODY,fontSize:11.8,color:'CBD5E1',lineSpacing:16});
  });
  s.addText('Stop the drug, file the report, follow it up for outcome. All three, or none of it counted.',
    {x:M,y:6.65,w:11.6,h:0.4,isTextBox:true,margin:0,valign:'top',fontFace:BODY,fontSize:14,
     bold:true,italic:true,color:WHITE});
  notes(s,'Close the case here. The reported complaint was dizziness; the actual case was drug-induced '
    +'hypoglycaemia in a patient whose kidneys had quietly failed, worsened by a painkiller she did not '
    +'count as a medicine. None of that was in the phone call. It came out of asking what was missing and '
    +'then going and getting it — which is the entire method of this course.');
})();

/* ================= 10 · THE TOOLS AND THE CLOSE ================= */
(function(){
  const s = slide('Two things you can use after today','Hands-on');
  const tools = [
    {name:'PV Foundations', sub:'The workshop, as a self-paced trainer',
     col:TEAL, tint:'ECFEFF',
     items:['Thirteen stations, in the order taught today',
       'Beginner, Intermediate and Challenge modes',
       'A “Why?” prompt on every decision you make',
       'Drug cards, interaction checker, MedDRA-shaped term search',
       'The final case, scored, with a costed investigation desk',
       'A completion certificate and a hands-on experience certificate']},
    {name:'PV Lab', sub:'A working safety-database simulation',
     col:CRIM, tint:'FEF2F2',
     items:['Six roles: intake, PV officer, coder, medical reviewer, QC, manager',
       'A full case lifecycle with permission-checked transitions',
       'Coding, causality, narrative, medical review, QC, ICSR export',
       'Signal detection, literature screening, analytics',
       'An append-only audit trail on every action',
       'Ten training cases with worked answer keys']}
  ];
  tools.forEach((t,i)=>{
    const x = M + i*6.15;
    card(s,x,1.62,5.82,4.55,t.tint);
    s.addText(t.name,{x:x+0.38,y:1.9,w:5.1,h:0.48,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:24,bold:true,color:t.col});
    s.addText(t.sub,{x:x+0.38,y:2.42,w:5.1,h:0.32,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:12.5,bold:true,color:MUTE});
    bullets(s,x+0.38,2.88,5.1,3.1,t.items,12);
  });
  card(s,M,6.4,12.06,0.82,'F8FAFC');
  s.addText([{text:'Both are educational simulations. ',options:{bold:true,color:INK}},
    {text:'Fictional data throughout. Not connected to any patient record or regulatory system, and '
      +'nothing entered into them is a report to anybody.',options:{color:'334155'}}],
    {x:M+0.4,y:6.58,w:11.3,h:0.5,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,lineSpacing:18});
  notes(s,'Say plainly that neither tool reports anything to anybody — a real ADR goes to the national '
    +'programme on the real form. These exist so people can practise the reasoning enough times that the '
    +'real form stops being intimidating. Point them at the workshops page for both links.');
})();

(function(){
  const s = slide('If you remember six things','Close');
  const keys = [
    ['A reaction is not a failure','Reporting one is how the label gets corrected for everybody else. '
      +'Nobody is blamed for a report.'],
    ['Look it up','Nobody memorises interactions. Competence is knowing to check, and knowing where.'],
    ['Serious is not severe','Serious is a regulatory category with six criteria. Severe is how bad it felt. '
      +'A mild event can be serious; an agonising one may not be.'],
    ['“I don’t know yet” is an answer','Causality has a category for unassessable. Writing down what is '
      +'missing beats guessing confidently.'],
    ['Four elements make it real','An identifiable patient, an identifiable reporter, a suspect product, '
      +'an event. Without all four there is no case.'],
    ['The signal is not the biggest number','Seriousness, labelling, plausibility and report quality '
      +'decide it — not the count.']
  ];
  keys.forEach((k,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const x=M+col*6.15, y=1.62+row*1.68;
    card(s,x,y,5.82,1.5);
    numDot(s,x+0.3,y+0.24,i+1,i%2?TEAL:INK,0.4);
    s.addText(k[0],{x:x+0.82,y:y+0.22,w:4.75,h:0.4,isTextBox:true,margin:0,
      fontFace:HEAD,fontSize:13.5,bold:true,color:INK});
    s.addText(k[1],{x:x+0.3,y:y+0.7,w:5.25,h:0.72,isTextBox:true,margin:0,
      fontFace:BODY,fontSize:11.5,color:'475569',lineSpacing:16});
  });
  notes(s,'Go round the room and ask six different people to read one each. It fixes them better than '
    +'reading all six yourself.');
})();

(function(){
  const s = pres.addSlide(); darkBase(s);
  s.addShape(pres.ShapeType.ellipse,{x:-1.6,y:4.4,w:5.0,h:5.0,fill:{color:INK2}});
  s.addShape(pres.ShapeType.ellipse,{x:10.8,y:-1.2,w:3.6,h:3.6,fill:{color:TEAL},transparency:74});
  s.addText('The one thing',{x:M,y:1.5,w:8,h:0.36,isTextBox:true,margin:0,
    fontFace:BODY,fontSize:12,bold:true,color:TEAL2,charSpacing:3});
  s.addText('If you see it, report it.',{x:M,y:2.0,w:11.0,h:1.0,isTextBox:true,margin:0,
    fontFace:HEAD,fontSize:46,bold:true,color:WHITE});
  s.addText('An incomplete report that gets sent is worth more than a perfect one that doesn’t. '
    +'Somebody will follow it up — that is what the system is for.',
    {x:M,y:3.25,w:9.6,h:1.0,isTextBox:true,margin:0,fontFace:BODY,fontSize:17,
     color:'CBD5E1',lineSpacing:27});
  card(s,M,4.62,11.9,1.05,INK2);
  s.addText([{text:'Report to:  ',options:{bold:true,color:TEAL2}},
    {text:'Pharmacovigilance Programme of India (PvPI) · National Coordination Centre, Indian Pharmacopoeia '
      +'Commission, Ghaziabad · Suspected ADR Reporting Form, the PvPI helpline, or your hospital’s ADR '
      +'monitoring centre.',options:{color:'CBD5E1'}}],
    {x:M+0.4,y:4.78,w:11.1,h:0.75,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,lineSpacing:18});
  s.addText([
    {text:'Alizon School of Medical & Digital Intelligence',options:{bold:true,color:WHITE,breakLine:true}},
    {text:'in collaboration with Mar Dioscorus College of Pharmacy and the International Organisation for '
      +'Preventive Health & Medical Research Centre',options:{color:FAINT}}
  ],{x:M,y:6.15,w:11.0,h:0.9,isTextBox:true,margin:0,fontFace:BODY,fontSize:12.5,lineSpacing:19});
  notes(s,'Finish on this and nothing after it. The single behaviour change worth getting from four hours '
    +'is that the next time somebody in the room sees a suspected reaction, they send the form instead of '
    +'deciding they are not sure enough.');
})();

/* ---------------- write ---------------- */
pres.writeFile({fileName: process.argv[2] || 'Pharmacovigilance-Foundations-Teaching-Deck.pptx'})
  .then(f => console.log('wrote', f, '·', pres.slides ? pres.slides.length : '?', 'slides'));
