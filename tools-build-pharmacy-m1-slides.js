/* =====================================================================
   ALIZON — teaching deck for Pharmacy AI MODULE 1,
   Practical 1 (AI Drug Discovery Lab) and Practical 2 (Ethics,
   Regulation & Data Protection — Data Breach Response Simulation).

   Everything on a slide comes from the institution's own material:
     · alizon-experiment-data.js               the experiment briefs
     · ALIZON-OS-Module1-AI-Drug-Discovery.html the descriptors, cases, paper
     · ALIZON-OS-Module1-Ethics-Lab.html        the incident and the rubric
   Nothing is invented.

   Run:  node tools-build-pharmacy-m1-slides.js [outdir]
   ===================================================================== */
const fs = require('fs'), path = require('path');
const PptxGenJS = require('pptxgenjs');

const DEPLOY = __dirname;
const OUT = process.argv[2] || path.join(DEPLOY, 'resources/slides');
fs.mkdirSync(OUT, { recursive: true });

const CR='8C1515', GOLD='9A7B3F', INK='26221F', MUT='6E6A63',
      PAPER='FAF8F6', LINE='DDD5CE', WHITE='FFFFFF', DARK='14100F', DEEP='2E1010';
const SERIF='Cambria', SANS='Calibri';
const W=13.333, H=7.5;

function loadBriefs(){
  const src = fs.readFileSync(path.join(DEPLOY,'alizon-experiment-data.js'),'utf8');
  const i = src.indexOf('var DATA={'), j = src.indexOf('\n  };', i);
  if (i<0||j<0) throw new Error('could not locate DATA in alizon-experiment-data.js');
  // eslint-disable-next-line no-eval
  return eval('(' + src.slice(i + 'var DATA='.length, j+4) + ')');
}
const B = loadBriefs();
const strip = s => String(s||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&mdash;/g,'—')
  .replace(/&nbsp;/g,' ').replace(/[“”]/g,'"').replace(/\s+/g,' ').trim();
function fit(s,max){ s=strip(s); if(s.length<=max) return s;
  const c=s.slice(0,max), k=c.lastIndexOf(' ');
  return (k>max*0.6?c.slice(0,k):c).replace(/[,;:.]$/,'')+'…'; }
const sents = (s,n)=>strip(s).split(/(?<=[.?!])\s+/).filter(Boolean).slice(0,n).join(' ');

/* ---- facts read out of the two practical pages ---- */
const P1 = {
  key:'drugdiscovery',
  screens:['Lab Manual — the experiment sheet you work from',
           'Molecule Builder — load a scaffold, then edit it',
           'AI Analysis — predicted properties and gauges',
           'Formulation Workbench',
           'Fix the Medicine — nine clinical challenges',
           'Observation Table — recorded as you go',
           'Practical Question Paper — assigned by code',
           'Generate Report'],
  desc:[['MW','≤ 500','Molecular weight'],
        ['LogP','≤ 5  (ideal 1–3)','Lipophilicity'],
        ['HBD','≤ 5','Hydrogen-bond donors'],
        ['HBA','≤ 10','Hydrogen-bond acceptors'],
        ['TPSA','≤ 140  (< 90 well absorbed)','Topological polar surface area'],
        ['RotB','—','Rotatable bonds — molecular flexibility']],
  cases:['Case 1 · Overweight','Case 2 · Too greasy','Case 3 · Poor absorption',
         'Case 4 · Too flexible','Case 5 · Multiple faults','Case 6 · Borderline',
         'Case 7 · Big & lipophilic','Case 8 · Peptide-like','Case 9 · Almost there'],
  paper:[['Part A','Correct the faulty candidates','2 × 5 = 10'],
         ['Part B','Design task','5'],
         ['Part C','Viva / theory','5'],
         ['Total','','20']],
  report:['Experiment','Principle','Best Designed Candidate','Method','Observation Table',
          'Observation','Result','Discussion','Conclusion'],
  teach:[
    'The rules are a guide, not a law. A violation is something the student must explain, not an automatic fail — real marketed drugs break them.',
    'The gauges are model predictions, not measurements. Say so out loud: bioavailability here is estimated from the descriptors, not observed in a patient.',
    'Each "Fix the Medicine" case has one identifiable fault. Make students name which rule is broken BEFORE they start editing the molecule.',
    'The observation table must be filled as they work. A student who reconstructs it at the end has skipped the experiment and it shows in the discussion.'
  ]
};
const P2 = {
  key:'ethics',
  incident:'INC-2026-0803 · Data Breach Response',
  timeline:['Mon 08:12 — the exposure is discovered',
            'Mon 08:40 — pressure to keep producing the discharge lists',
            'Mon 11:05 — a subject access request arrives',
            'Mon 14:20 — a request for an improper disclosure'],
  screens:['Incident inbox — events arrive on a clock',
           'The incident — what is known so far',
           'Stage-by-stage decisions',
           'Assessment rubric — visible while you work',
           'Achievement badges',
           'Incident report & regulatory outcome'],
  rubric:[['Immediate containment',25],['Scope and risk assessment',15],
          ['Notifiability decision',20],['Handling the subject access request',15],
          ['Refusing improper disclosure',15],['Preventive action',10]],
  teach:[
    'Containment carries the most marks (25) and it is an ordered task: secure what you control before chasing what you do not.',
    'Notifiability is a threshold decision, not a reflex. Students must say what made it notifiable — or defensibly why it was not.',
    'The access request and the improper-disclosure pressure arrive WHILE the incident is live. Handling pressure under time is the skill being assessed.',
    'Preventive action is the smallest weight and the only one that stops it happening again. Do not let them skip it because the clock is running.'
  ]
};

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Alizon School of Medical & Digital Intelligence';
pptx.company = 'Alizon School of Medical and Digital Intelligence';
pptx.title = 'Pharmacy AI · Module 1 · Practicals 1 and 2 — teaching deck';

function bar(s){
  s.addShape(pptx.ShapeType.rect,{x:0,y:H-0.42,w:W,h:0.42,fill:{color:PAPER},line:{color:PAPER}});
  s.addText('ALIZON AOS · Pharmacy AI · Module 1 — AI Foundations & Digital Systems',
    {x:0.5,y:H-0.40,w:9,h:0.34,fontSize:10,color:MUT,fontFace:SANS,valign:'middle'});
}
function slide(kicker,title){
  const s = pptx.addSlide(); s.background = { color: PAPER };
  s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:W,h:1.24,fill:{color:WHITE},line:{color:WHITE}});
  s.addShape(pptx.ShapeType.rect,{x:0,y:1.24,w:W,h:0.035,fill:{color:CR},line:{color:CR}});
  s.addText(kicker,{x:0.62,y:0.22,w:12,h:0.3,fontSize:11,bold:true,color:CR,fontFace:SANS,charSpacing:1.4});
  s.addText(title,{x:0.62,y:0.52,w:12.1,h:0.62,fontSize:26,bold:true,color:INK,fontFace:SERIF});
  bar(s); return s;
}
function bullets(s,items,o){ o=o||{};
  s.addText(items.map(t=>({text:strip(t),options:{bullet:{code:'2022'},breakLine:true}})),
    {x:o.x||0.75,y:o.y||1.66,w:o.w||11.9,h:o.h||5.0,fontSize:o.fontSize||16,color:INK,
     fontFace:SANS,lineSpacingMultiple:1.22,valign:'top'});
}
function note(s,text,y){ y=y||6.05;
  s.addShape(pptx.ShapeType.rect,{x:0.75,y:y,w:11.9,h:0.82,fill:{color:'F7EFEF'},line:{color:'E7CFCF'}});
  s.addShape(pptx.ShapeType.rect,{x:0.75,y:y,w:0.055,h:0.82,fill:{color:CR},line:{color:CR}});
  s.addText(strip(text),{x:0.95,y:y+0.06,w:11.5,h:0.7,fontSize:12.5,color:INK,fontFace:SANS,valign:'middle'});
}
function table(s,rows,o){ o=o||{};
  s.addTable(rows,{x:o.x||0.9,y:o.y||1.75,w:o.w||11.5,fontSize:o.fontSize||13.5,fontFace:SANS,
    color:INK,valign:'middle',border:{type:'solid',color:LINE,pt:0.75},autoPage:false,colW:o.colW});
}

/* ---- screenshots of the real labs, fitted into a side area ---- */
const IMGDIR = path.join(DEPLOY,'resources/slides/img');
function pngSize(file){
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
/* fit an image inside a box, preserving aspect, and frame it */
function shot(s, name, box){
  const file = path.join(IMGDIR, name + '.png');
  if (!fs.existsSync(file)) return;
  const { w:iw, h:ih } = pngSize(file);
  const scale = Math.min(box.w/iw, box.h/ih);
  const w = iw*scale, h = ih*scale;
  const x = box.x + (box.w-w)/2, y = box.y + (box.h-h)/2;
  s.addShape(pptx.ShapeType.rect,{x:x-0.045,y:y-0.045,w:w+0.09,h:h+0.09,
    fill:{color:WHITE},line:{color:LINE,width:0.75}});
  s.addImage({ path:file, x, y, w, h });
  if (box.cap) s.addText(box.cap,{x:box.x,y:y+h+0.08,w:box.w,h:0.28,
    fontSize:10.5,italic:true,color:MUT,fontFace:SANS,align:'center'});
}

function divider(kicker,title){
  const s = pptx.addSlide(); s.background = { color: DEEP };
  s.addText(kicker,{x:0.9,y:2.6,w:11.5,h:0.5,fontSize:13,bold:true,color:GOLD,fontFace:SANS,charSpacing:2.4});
  s.addText(strip(title),{x:0.9,y:3.1,w:11.5,h:1.6,fontSize:34,bold:true,color:WHITE,fontFace:SERIF});
  return s;
}

/* 1 cover */
{
  const s = pptx.addSlide(); s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect,{x:0,y:2.72,w:W,h:0.05,fill:{color:CR},line:{color:CR}});
  s.addText('ALIZON SCHOOL OF MEDICAL & DIGITAL INTELLIGENCE',
    {x:0.9,y:1.5,w:11.5,h:0.34,fontSize:12.5,bold:true,color:GOLD,fontFace:SANS,charSpacing:2});
  s.addText('Pharmacy AI · Module 1 — AI Foundations & Digital Systems',
    {x:0.9,y:1.95,w:11.5,h:0.5,fontSize:18,color:'D9CFC7',fontFace:SANS});
  s.addText('How to do Practical 1 and Practical 2',
    {x:0.9,y:3.0,w:11.5,h:1.0,fontSize:40,bold:true,color:WHITE,fontFace:SERIF});
  s.addText('What the practical is, what you are doing, and how to work it',
    {x:0.9,y:4.05,w:11.5,h:0.5,fontSize:16,color:'B9AFA7',fontFace:SANS});
  s.addText('Practical 1 · '+strip(B[P1.key].title)+'   (Unit 1)\n'
          + 'Practical 2 · '+strip(B[P2.key].title)+'   (Unit 3)',
    {x:0.9,y:5.0,w:11.5,h:0.9,fontSize:13.5,color:GOLD,fontFace:SANS,lineSpacingMultiple:1.4});
}

/* 2 overview */
{
  const s = slide('Module 1 · overview','Two practicals, two different skills');
  table(s,[
    [{text:'',options:{fill:PAPER}},{text:'Practical 1',options:{bold:true,fill:'EFE7E1'}},{text:'Practical 2',options:{bold:true,fill:'EFE7E1'}}],
    [{text:'Unit',options:{bold:true}},'Unit 1','Unit 3'],
    [{text:'You are',options:{bold:true}},'Designing a drug-like candidate','Responding to a live data breach'],
    [{text:'You work with',options:{bold:true}},'A molecule and its predicted properties','An incident arriving on a clock'],
    [{text:'The skill',options:{bold:true}},'Reading an AI prediction and acting on it','Deciding correctly under time and pressure'],
    [{text:'Assessed by',options:{bold:true}},'Question paper (20) + report','Six-criterion rubric out of 100']
  ],{colW:[2.3,4.6,4.6]});
  note(s,'Both are AI-foundation practicals: one asks what the model predicts and what you do about it, the other asks what you do when digital systems fail and personal data is exposed.');
}

/* 3 shape of a practical */
{
  const s = slide('Before either practical','The shape of every practical');
  bullets(s,[
    'Briefing — aim, principle, theory, requirements, procedure and guided method. Read it before touching anything.',
    'The work area — the molecule builder, or the incident room. This is where the marks are earned.',
    'Result & Record — the generated report and your mark.',
    'You then write your own report, attach the required PDFs and submit it to faculty.',
    'Download PDF gives you a real PDF file of the letterheaded report to keep.'
  ]);
  note(s,'Everything in both practicals is simulated for teaching. No molecule here is a medicine and no record here belongs to a real person.');
}

/* ---------------- PRACTICAL 1 ---------------- */
divider('PRACTICAL 1 · UNIT 1', B[P1.key].title);
{
  const s = slide('Practical 1 · what you are doing','Aim');
  s.addText(sents(B[P1.key].aim,3),{x:0.75,y:1.75,w:11.9,h:2.2,fontSize:17,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  s.addText('You will need',{x:0.75,y:4.1,w:11.9,h:0.32,fontSize:12,bold:true,color:CR,fontFace:SANS,charSpacing:1.2});
  bullets(s,B[P1.key].requirements.slice(0,5),{y:4.46,h:1.5,fontSize:13.5});
}
{
  const s = slide('Practical 1 · why it works','Principle');
  s.addText(sents(B[P1.key].principle,4),{x:0.75,y:1.75,w:11.9,h:2.4,fontSize:16.5,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  if (B[P1.key].principleNote) note(s,B[P1.key].principleNote,4.35);
  s.addText(fit(B[P1.key].theory,430),{x:0.75,y:5.35,w:11.9,h:1.3,fontSize:12.5,color:MUT,fontFace:SANS,lineSpacingMultiple:1.18});
}
{
  const s = slide('Practical 1 · screen tour','What is on the bench');
  const rows = P1.screens.map((t,i)=>[{text:String(i+1),options:{bold:true,color:CR,align:'center'}},{text:t}]);
  table(s,[[{text:'',options:{fill:'EFE7E1'}},{text:'Panel',options:{bold:true,fill:'EFE7E1'}}]].concat(rows),
    {x:0.62,y:1.7,w:5.5,colW:[0.55,4.95],fontSize:11.5});
  shot(s,'p1_manual',{x:6.5,y:1.65,w:6.2,h:5.0,cap:'01 Lab Manual — the experiment sheet, opened at the Aim'});
}
{
  const s = slide('Practical 1 · the bench','Molecule Builder and AI Analysis, side by side');
  shot(s,'p1_workbench',{x:0.9,y:1.6,w:11.5,h:5.35,cap:'02 Formulation Workbench — sliders on the left, the AI verdict on the right. Every rule that passes turns green.'});
}
{
  const s = slide('Practical 1 · what the AI reports','The properties you are reading');
  table(s,[[{text:'Descriptor',options:{bold:true,fill:'EFE7E1'}},{text:'Target',options:{bold:true,fill:'EFE7E1'}},{text:'What it means',options:{bold:true,fill:'EFE7E1'}}]]
    .concat(P1.desc.map(d=>[{text:d[0],options:{bold:true}},d[1],d[2]])),
    {colW:[1.9,3.6,6.0],fontSize:13.5});
  note(s,'A candidate that meets the targets is predicted to be more drug-like by mouth. It is a prediction from the structure, not a measurement in a patient.');
}
{
  const s = slide('Practical 1 · how to do it','Procedure, in order');
  bullets(s,B[P1.key].procedure.slice(0,6),{x:0.7,w:5.7,fontSize:13.5});
  shot(s,'p1_case',{x:6.7,y:1.62,w:6.0,h:5.1,cap:'A faulty candidate loaded from Fix the Medicine — read the diagnosis, then correct it'});
}
{
  const s = slide('Practical 1 · the challenges','Fix the Medicine — nine cases');
  const half = Math.ceil(P1.cases.length/2);
  bullets(s,P1.cases.slice(0,half),{x:0.85,w:5.6,fontSize:15});
  bullets(s,P1.cases.slice(half),{x:6.9,w:5.6,fontSize:15});
  note(s,'Each case has one identifiable fault. Name the rule that is broken before editing the molecule — then fix that, and check you have not broken another.');
}
{
  const s = slide('Practical 1 · the rules','Guided method');
  bullets(s,B[P1.key].method.slice(0,5),{fontSize:15});
  if (B[P1.key].methodNote) note(s,B[P1.key].methodNote,6.15);
}
{
  const s = slide('Practical 1 · assessment','Question paper and report');
  table(s,[[{text:'Section',options:{bold:true,fill:'EFE7E1'}},{text:'Task',options:{bold:true,fill:'EFE7E1'}},{text:'Marks',options:{bold:true,fill:'EFE7E1',align:'right'}}]]
    .concat(P1.paper.map(p=>[{text:p[0],options:{bold:p[0]==='Total'}},p[1],{text:p[2],options:{align:'right',bold:p[0]==='Total'}}])),
    {x:0.9,y:1.7,w:5.6,colW:[1.1,3.2,1.3],fontSize:11.5});
  s.addText('Your report must contain',{x:0.9,y:4.15,w:5.6,h:0.3,fontSize:12,bold:true,color:CR,fontFace:SANS,charSpacing:1.2});
  s.addText(P1.report.join(' · '),{x:0.9,y:4.5,w:5.6,h:1.1,fontSize:12,color:INK,fontFace:SANS});
  shot(s,'p1_paper',{x:6.7,y:1.6,w:6.0,h:5.2,cap:'04 A generated paper — every student gets a different one, traceable by its paper code'});
}
{
  const s = slide('Practical 1 · teaching notes','What to draw out in class');
  bullets(s,P1.teach,{fontSize:14.5});
}

/* ---------------- PRACTICAL 2 ---------------- */
divider('PRACTICAL 2 · UNIT 3', B[P2.key].title);
{
  const s = slide('Practical 2 · what you are doing','Aim');
  s.addText(sents(B[P2.key].aim,3),{x:0.75,y:1.75,w:11.9,h:2.3,fontSize:17,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  s.addText('You will need',{x:0.75,y:4.2,w:11.9,h:0.32,fontSize:12,bold:true,color:CR,fontFace:SANS,charSpacing:1.2});
  bullets(s,B[P2.key].requirements.slice(0,5),{y:4.56,h:1.4,fontSize:13.5});
}
{
  const s = slide('Practical 2 · why it works','Principle');
  s.addText(sents(B[P2.key].principle,4),{x:0.75,y:1.75,w:11.9,h:2.4,fontSize:16.5,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  if (B[P2.key].principleNote) note(s,B[P2.key].principleNote,4.35);
  s.addText(fit(B[P2.key].theory,430),{x:0.75,y:5.35,w:11.9,h:1.3,fontSize:12.5,color:MUT,fontFace:SANS,lineSpacingMultiple:1.18});
}
{
  const s = slide('Practical 2 · the incident','What arrives, and when');
  s.addText(P2.incident,{x:0.9,y:1.7,w:11.5,h:0.4,fontSize:15,bold:true,color:CR,fontFace:SANS});
  bullets(s,P2.timeline,{y:2.25,h:2.3,fontSize:16});
  note(s,'The events arrive while you are still dealing with the first one. That is deliberate — the practical assesses what you do under pressure, not what you would do with unlimited time.',4.75);
}
{
  const s = slide('Practical 2 · screen tour','What is in the incident room');
  const rows = P2.screens.map((t,i)=>[{text:String(i+1),options:{bold:true,color:CR,align:'center'}},{text:t}]);
  table(s,[[{text:'',options:{fill:'EFE7E1'}},{text:'Panel',options:{bold:true,fill:'EFE7E1'}}]].concat(rows),
    {x:0.62,y:1.7,w:5.5,colW:[0.55,4.95],fontSize:11.5});
  shot(s,'p2_brief',{x:6.5,y:1.62,w:6.2,h:5.1,cap:'The briefing — read before the clock starts'});
}
{
  const s = slide('Practical 2 · how to do it','Procedure, in order');
  bullets(s,B[P2.key].procedure.slice(0,6),{x:0.7,w:5.7,fontSize:13});
  shot(s,'p2_incident',{x:6.7,y:1.9,w:6.0,h:4.4,cap:'Stage 1 of 6 · Immediate containment · 25 marks — order the five actions against the clock'});
}
{
  const s = slide('Practical 2 · the rules','Guided method');
  bullets(s,B[P2.key].method.slice(0,7),{fontSize:14});
  if (B[P2.key].methodNote) note(s,B[P2.key].methodNote,6.2);
}
{
  const s = slide('Practical 2 · assessment','How the 100 marks are awarded');
  table(s,[[{text:'Assessment criterion',options:{bold:true,fill:'EFE7E1'}},{text:'Marks',options:{bold:true,fill:'EFE7E1',align:'right'}}]]
    .concat(P2.rubric.map(r=>[r[0],{text:String(r[1]),options:{align:'right'}}]))
    .concat([[{text:'Total',options:{bold:true}},{text:'100',options:{bold:true,align:'right'}}]]),
    {colW:[9.2,2.3],fontSize:14.5});
  note(s,'The rubric is on screen while you work. Containment carries the most marks, and preventive action — the smallest — is the only one that stops it recurring.');
}
{
  const s = slide('Practical 2 · teaching notes','What to draw out in class');
  bullets(s,P2.teach,{fontSize:14.5});
}

/* delivery / submission / limits */
{
  const s = slide('Delivery','Running the session');
  table(s,[
    [{text:'Stage',options:{bold:true,fill:'EFE7E1'}},{text:'What the tutor does',options:{bold:true,fill:'EFE7E1'}},{text:'Time',options:{bold:true,fill:'EFE7E1',align:'right'}}],
    ['Briefing','Read the aim and principle together.',{text:'10 min',options:{align:'right'}}],
    ['Demonstration','Build one molecule, or open one incident event — then stop.',{text:'10 min',options:{align:'right'}}],
    ['Independent work','Students work alone. Let them break a rule and see the gauge move.',{text:'45 min',options:{align:'right'}}],
    ['Report','Write, attach PDFs, submit to faculty.',{text:'20 min',options:{align:'right'}}],
    ['Debrief','Compare two students who fixed the same case differently.',{text:'15 min',options:{align:'right'}}]
  ],{colW:[2.6,7.4,1.5],fontSize:13.5});
}
{
  const s = slide('Submission','What you hand in');
  bullets(s,[
    'The practical generates your result automatically on the Result & Record tab.',
    'You then write your own report — a minimum word count is enforced before it can be generated.',
    'Download PDF produces a real PDF file of the letterheaded report. Keep it.',
    'Attach the required PDFs and submit. It goes to the faculty evaluation queue.',
    'Faculty return a mark, and it appears on your dashboard against Module 1.'
  ],{fontSize:15.5});
}
{
  const s = slide('Limitations','State these plainly');
  bullets(s,[
    'Every molecule, patient, record and incident in these practicals is simulated for teaching.',
    'The predicted properties are model estimates from structure — not laboratory measurements and not clinical results.',
    'Nothing produced here may be used to make a decision about a real medicine or a real patient.',
    'The regulatory judgements are exercises in principle. Follow your institution’s actual procedure in practice.'
  ],{fontSize:15.5});
  note(s,'Students must state these limitations in their own report — it carries marks in the discussion.');
}
{
  const s = pptx.addSlide(); s.background = { color: DARK };
  s.addText('Questions',{x:0.9,y:3.0,w:11.5,h:0.9,fontSize:38,bold:true,color:WHITE,fontFace:SERIF});
  s.addText('Pharmacy AI · Module 1 · Practicals 1 and 2\nALIZON AOS',
    {x:0.9,y:4.0,w:11.5,h:0.9,fontSize:15,color:GOLD,fontFace:SANS,lineSpacingMultiple:1.4});
}

const file = path.join(OUT,'ALIZON-Pharmacy-Module1-Practicals-1-and-2-Teaching-Deck.pptx');
pptx.writeFile({ fileName:file }).then(()=>{
  console.log('wrote', file, '('+Math.round(fs.statSync(file).size/1024)+' KB)');
});
