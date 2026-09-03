/* =====================================================================
   ALIZON — teaching deck for Hospital Administration MODULE 1,
   Practical 1 (Operations & Patient Flow) and Practical 2 (Decision
   Support & Performance Intelligence).

   Everything on a slide comes from the institution's own material:
     · hospital-admin/ha-experiment-data.js   the experiment briefs
     · the two practical HTML files            screens, meters, marking
   Nothing is invented.

   Run:  node tools-build-ha-practical-slides.js [outdir]
   ===================================================================== */
const fs = require('fs'), path = require('path');
const PptxGenJS = require('pptxgenjs');

const DEPLOY = __dirname;
const OUT = process.argv[2] || path.join(DEPLOY, 'resources/slides');
fs.mkdirSync(OUT, { recursive: true });

/* ---- house palette (same as tools-build-module-slides.js) ---- */
const CR='8C1515', GOLD='9A7B3F', INK='26221F', MUT='6E6A63',
      PAPER='FAF8F6', LINE='DDD5CE', WHITE='FFFFFF', DARK='14100F', DEEP='2E1010';
const SERIF='Cambria', SANS='Calibri';
const W=13.333, H=7.5;

/* ---- pull the briefs straight out of ha-experiment-data.js ---- */
function loadBriefs(){
  const src = fs.readFileSync(path.join(DEPLOY,'hospital-admin/ha-experiment-data.js'),'utf8');
  const start = src.indexOf('var DATA={');
  const end = src.indexOf('\n  };', start);
  if (start < 0 || end < 0) throw new Error('could not locate DATA in ha-experiment-data.js');
  const body = src.slice(start + 'var DATA='.length, end + 4);
  // eslint-disable-next-line no-eval
  return eval('(' + body + ')');
}
const B = loadBriefs();
const strip = s => String(s||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
function fit(s,max){ s=strip(s); if(s.length<=max) return s;
  const c=s.slice(0,max), i=c.lastIndexOf(' ');
  return (i>max*0.6?c.slice(0,i):c).replace(/[,;:.]$/,'')+'…'; }
const sents = (s,n)=>strip(s).split(/(?<=[.?!])\s+/).filter(Boolean).slice(0,n).join(' ');

/* ---- facts read from the practical files ---- */
const P1 = {
  key:'haops',
  file:'hospital-admin/ALIZON-HA-Practical1-Operations-Flow.html',
  screens:['Hospital KPI board','Patient journey','AI bottleneck analysis',
           'What-if simulation','Bed board','Staff allocation','Case 01 — Monday morning congestion'],
  meters:['Operational grip — falls when you act on the wrong bottleneck',
          'Evidence discipline — falls when you commit without opening the data'],
  marks:[['Problem identification',30],['Ranking',15],['Interventions chosen',20],
         ['Use of the simulator',15],['First action and justification',20]],
  teach:[
    'The busiest-looking stage is not the bottleneck. The bottleneck is the stage whose queue is still growing — everything downstream only looks quiet because the work has not reached it yet.',
    'Students reliably reach for more beds. Delayed discharge is a bed-capacity problem: the beds already exist and are occupied by patients who are ready to leave.',
    'Make them test one lever at a time. Changing three levers together tells them nothing about which one worked.',
    'The mark rewards reasoning, not the option letter — 20 of the 100 marks sit on the written justification and the first action together.'
  ]
};
const P2 = {
  key:'hadss',
  file:'hospital-admin/ALIZON-HA-Practical2-Decision-Support.html',
  screens:['Monthly performance dashboard','AI hospital performance analysis','Department intelligence',
           'Root cause analysis','Hospital risk monitor','Budget allocation','Executive decision'],
  meters:['Analytical rigour — falls when the apportionment is not defensible',
          'Evidence discipline — falls when a department card is never opened'],
  marks:[['Hospital data interpretation',15],['Problem identification',15],['Root-cause analysis',15],
         ['AI tool utilisation',15],['Administrative decision',15],['Resource allocation',10],
         ['Case justification',10],['Final report',5]],
  budget:'₹10,00,000',
  teach:[
    'A hospital reports its problems as separate numbers; they are rarely separate problems. Occupancy and discharge delay are usually the same fact seen twice.',
    'A round 20% in every row of the apportionment is an admission that it was not analysed. Make them defend each weight.',
    'What they decline to fund is part of the recommendation. The Board will ask about it, so the report must answer it.',
    'Never accept an unsimulated plan. Testing it is the difference between a recommendation and a guess.'
  ]
};

/* ================= deck ================= */
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Alizon School of Medical & Digital Intelligence';
pptx.company = 'Alizon School of Medical and Digital Intelligence';  /* pptxgenjs does not escape & in app.xml */
pptx.title = 'Hospital Administration · Module 1 · Practicals 1 and 2 — teaching deck';

function bar(s){
  s.addShape(pptx.ShapeType.rect,{x:0,y:H-0.42,w:W,h:0.42,fill:{color:PAPER},line:{color:PAPER}});
  s.addText('ALIZON AOS · Hospital Administration · Module 1',
    {x:0.5,y:H-0.40,w:8,h:0.34,fontSize:10,color:MUT,fontFace:SANS,valign:'middle'});
}
function head(s,kicker,title){
  s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:W,h:1.24,fill:{color:WHITE},line:{color:WHITE}});
  s.addShape(pptx.ShapeType.rect,{x:0,y:1.24,w:W,h:0.035,fill:{color:CR},line:{color:CR}});
  s.addText(kicker,{x:0.62,y:0.22,w:12,h:0.3,fontSize:11,bold:true,color:CR,fontFace:SANS,charSpacing:1.4});
  s.addText(title,{x:0.62,y:0.52,w:12.1,h:0.62,fontSize:26,bold:true,color:INK,fontFace:SERIF});
}
function slide(kicker,title){
  const s = pptx.addSlide();
  s.background = { color: PAPER };
  head(s,kicker,title); bar(s);
  return s;
}
function bullets(s,items,opt){
  opt=opt||{};
  s.addText(items.map(t=>({ text:strip(t), options:{ bullet:{code:'2022'}, breakLine:true } })),
    { x:opt.x||0.75, y:opt.y||1.66, w:opt.w||11.9, h:opt.h||5.1,
      fontSize:opt.fontSize||16, color:INK, fontFace:SANS, lineSpacingMultiple:1.22, valign:'top' });
}
function note(s,text,y){
  s.addShape(pptx.ShapeType.rect,{x:0.75,y:y||6.05,w:11.9,h:0.82,fill:{color:'F7EFEF'},line:{color:'E7CFCF'}});
  s.addShape(pptx.ShapeType.rect,{x:0.75,y:y||6.05,w:0.055,h:0.82,fill:{color:CR},line:{color:CR}});
  s.addText(strip(text),{x:0.95,y:(y||6.05)+0.06,w:11.5,h:0.7,fontSize:12.5,color:INK,fontFace:SANS,valign:'middle'});
}
function table(s,rows,opt){
  opt=opt||{};
  s.addTable(rows,{ x:opt.x||0.9, y:opt.y||1.75, w:opt.w||11.5,
    fontSize:opt.fontSize||13.5, fontFace:SANS, color:INK, valign:'middle',
    border:{type:'solid',color:LINE,pt:0.75}, autoPage:false,
    colW:opt.colW });
}

/* ---------- 1 · cover ---------- */
{
  const s = pptx.addSlide(); s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect,{x:0,y:2.72,w:W,h:0.05,fill:{color:CR},line:{color:CR}});
  s.addText('ALIZON SCHOOL OF MEDICAL & DIGITAL INTELLIGENCE',
    {x:0.9,y:1.5,w:11.5,h:0.34,fontSize:12.5,bold:true,color:GOLD,fontFace:SANS,charSpacing:2});
  s.addText('Hospital Administration · Module 1',
    {x:0.9,y:1.95,w:11.5,h:0.5,fontSize:19,color:'D9CFC7',fontFace:SANS});
  s.addText('How to run Practical 1 and Practical 2',
    {x:0.9,y:3.0,w:11.5,h:1.0,fontSize:40,bold:true,color:WHITE,fontFace:SERIF});
  s.addText('A teaching guide to the operations desk and the administrator command centre',
    {x:0.9,y:4.05,w:11.5,h:0.5,fontSize:16,color:'B9AFA7',fontFace:SANS});
  s.addText('Practical 1 · AI-Powered Hospital Operations, Patient Flow & Resource Optimization\n'
          + 'Practical 2 · AI-Enabled Administrator Decision Support & Performance Intelligence',
    {x:0.9,y:5.0,w:11.5,h:0.9,fontSize:13.5,color:GOLD,fontFace:SANS,lineSpacingMultiple:1.4});
}

/* ---------- 2 · what the two practicals are ---------- */
{
  const s = slide('Module 1 · overview','Two practicals, one hospital');
  table(s,[
    [{text:'',options:{fill:PAPER}},{text:'Practical 1',options:{bold:true,fill:'EFE7E1'}},{text:'Practical 2',options:{bold:true,fill:'EFE7E1'}}],
    [{text:'Role',options:{bold:true}},'Operations Administrator','Hospital Administrator'],
    [{text:'Time frame',options:{bold:true}},'One working morning','One monthly performance cycle'],
    [{text:'You are given',options:{bold:true}},'A live KPI board and the patient journey','A whole-hospital dataset across four domains'],
    [{text:'You must decide',options:{bold:true}},'Which single stage is the constraint','Where a finite budget goes'],
    [{text:'Deliverable',options:{bold:true}},'Operations Optimization Report','Improvement plan to the Board'],
    [{text:'Marked out of',options:{bold:true}},'100','100']
  ],{colW:[2.3,4.6,4.6]});
  note(s,'They are deliberately sequential: Practical 1 teaches you to find a constraint inside one morning. Practical 2 asks what you would spend on it across a month.');
}

/* ---------- 3 · how any Alizon practical runs ---------- */
{
  const s = slide('Before either practical','The shape of every practical');
  bullets(s,[
    'Briefing tab — aim, principle, theory, requirements, procedure and guided method. Students read it before touching anything.',
    'Work tab — the desk or command centre itself. Data stays closed until it is opened, and what was opened is recorded.',
    'Result & Record tab — the generated report, the mark, and the report writer.',
    'The student writes their own report (minimum word count enforced), attaches their PDFs, and submits it to faculty.',
    'Two live indices sit alongside the mark and are shown in the report. They are not decoration — they are how a confident wrong answer is told apart from a defensible one.'
  ]);
  note(s,'Deciding without looking costs marks. That is the single behaviour both practicals are built to train.');
}

/* ---------- 4-11 · PRACTICAL 1 ---------- */
{
  const s = pptx.addSlide(); s.background = { color: DEEP };
  s.addText('PRACTICAL 1',{x:0.9,y:2.6,w:11.5,h:0.5,fontSize:13,bold:true,color:GOLD,fontFace:SANS,charSpacing:2.4});
  s.addText(strip(B[P1.key].title),{x:0.9,y:3.1,w:11.5,h:1.5,fontSize:34,bold:true,color:WHITE,fontFace:SERIF});
}
{
  const s = slide('Practical 1 · aim','What the student is asked to do');
  s.addText(sents(B[P1.key].aim,3),{x:0.75,y:1.75,w:11.9,h:2.2,fontSize:17,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  s.addText('Requirements',{x:0.75,y:4.05,w:11.9,h:0.32,fontSize:12,bold:true,color:CR,fontFace:SANS,charSpacing:1.2});
  bullets(s,B[P1.key].requirements.slice(0,5),{y:4.42,h:1.5,fontSize:13.5});
}
{
  const s = slide('Practical 1 · the idea to teach','Principle');
  s.addText(sents(B[P1.key].principle,4),{x:0.75,y:1.75,w:11.9,h:2.5,fontSize:16.5,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  note(s,strip(B[P1.key].principleNote),4.5);
  s.addText(fit(B[P1.key].theory,470),{x:0.75,y:5.5,w:11.9,h:1.25,fontSize:12.5,color:MUT,fontFace:SANS,lineSpacingMultiple:1.18});
}
{
  const s = slide('Practical 1 · screen tour','What is on the operations desk');
  const rows = P1.screens.map((t,i)=>[{text:String(i+1),options:{bold:true,color:CR,align:'center'}},{text:t}]);
  table(s,[[{text:'',options:{fill:'EFE7E1'}},{text:'Panel',options:{bold:true,fill:'EFE7E1'}}]].concat(rows),
    {colW:[0.8,10.7],fontSize:14});
  note(s,'Each stage of the patient journey stays closed until the student opens it. The count of stages opened appears on the desk and in the report.');
}
{
  const s = slide('Practical 1 · how to work it','Procedure, in order');
  bullets(s,B[P1.key].procedure.slice(0,7),{fontSize:15});
}
{
  const s = slide('Practical 1 · method','The rules students should follow');
  bullets(s,B[P1.key].method.slice(0,6),{fontSize:14.5});
  note(s,strip(B[P1.key].methodNote),6.15);
}
{
  const s = slide('Practical 1 · assessment','How the 100 marks are awarded');
  table(s,[[{text:'Element',options:{bold:true,fill:'EFE7E1'}},{text:'Marks',options:{bold:true,fill:'EFE7E1',align:'right'}}]]
    .concat(P1.marks.map(m=>[m[0],{text:String(m[1]),options:{align:'right'}}]))
    .concat([[{text:'Total',options:{bold:true}},{text:'100',options:{bold:true,align:'right'}}]]),
    {colW:[9.2,2.3],fontSize:14.5});
  s.addText('Live indices shown alongside the mark',{x:0.9,y:5.35,w:11.5,h:0.3,fontSize:12,bold:true,color:CR,fontFace:SANS});
  bullets(s,P1.meters,{y:5.68,h:1.0,fontSize:13});
}
{
  const s = slide('Practical 1 · teaching notes','What to draw out in class');
  bullets(s,P1.teach,{fontSize:14.5});
}

/* ---------- PRACTICAL 2 ---------- */
{
  const s = pptx.addSlide(); s.background = { color: DEEP };
  s.addText('PRACTICAL 2',{x:0.9,y:2.6,w:11.5,h:0.5,fontSize:13,bold:true,color:GOLD,fontFace:SANS,charSpacing:2.4});
  s.addText(strip(B[P2.key].title),{x:0.9,y:3.1,w:11.5,h:1.6,fontSize:32,bold:true,color:WHITE,fontFace:SERIF});
}
{
  const s = slide('Practical 2 · aim','What the student is asked to do');
  s.addText(sents(B[P2.key].aim,3),{x:0.75,y:1.75,w:11.9,h:2.3,fontSize:17,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  s.addText('Requirements',{x:0.75,y:4.15,w:11.9,h:0.32,fontSize:12,bold:true,color:CR,fontFace:SANS,charSpacing:1.2});
  bullets(s,B[P2.key].requirements.slice(0,5),{y:4.52,h:1.4,fontSize:13.5});
}
{
  const s = slide('Practical 2 · the idea to teach','Principle');
  s.addText(sents(B[P2.key].principle,4),{x:0.75,y:1.75,w:11.9,h:2.5,fontSize:16.5,color:INK,fontFace:SANS,lineSpacingMultiple:1.3});
  note(s,strip(B[P2.key].principleNote),4.5);
  s.addText(fit(B[P2.key].theory,470),{x:0.75,y:5.5,w:11.9,h:1.25,fontSize:12.5,color:MUT,fontFace:SANS,lineSpacingMultiple:1.18});
}
{
  const s = slide('Practical 2 · screen tour','What is in the command centre');
  const rows = P2.screens.map((t,i)=>[{text:String(i+1),options:{bold:true,color:CR,align:'center'}},{text:t}]);
  table(s,[[{text:'',options:{fill:'EFE7E1'}},{text:'Panel',options:{bold:true,fill:'EFE7E1'}}]].concat(rows),
    {colW:[0.8,10.7],fontSize:14});
  note(s,'The budget is '+P2.budget+' across six costed interventions. It is not enough for all of them — that is the exercise.');
}
{
  const s = slide('Practical 2 · how to work it','Procedure, in order');
  bullets(s,B[P2.key].procedure.slice(0,9),{fontSize:13.5});
}
{
  const s = slide('Practical 2 · method','The rules students should follow');
  bullets(s,B[P2.key].method.slice(0,6),{fontSize:14.5});
  note(s,strip(B[P2.key].methodNote),6.15);
}
{
  const s = slide('Practical 2 · assessment','How the 100 marks are awarded');
  table(s,[[{text:'Element',options:{bold:true,fill:'EFE7E1'}},{text:'Marks',options:{bold:true,fill:'EFE7E1',align:'right'}}]]
    .concat(P2.marks.map(m=>[m[0],{text:String(m[1]),options:{align:'right'}}]))
    .concat([[{text:'Total',options:{bold:true}},{text:'100',options:{bold:true,align:'right'}}]]),
    {colW:[9.2,2.3],fontSize:13.5,y:1.7});
  s.addText('Live indices: '+P2.meters.join('   ·   '),
    {x:0.9,y:6.35,w:11.5,h:0.5,fontSize:11.5,color:MUT,fontFace:SANS});
}
{
  const s = slide('Practical 2 · teaching notes','What to draw out in class');
  bullets(s,P2.teach,{fontSize:14.5});
}

/* ---------- running it in class ---------- */
{
  const s = slide('Delivery','Running the session');
  table(s,[
    [{text:'Stage',options:{bold:true,fill:'EFE7E1'}},{text:'What the tutor does',options:{bold:true,fill:'EFE7E1'}},{text:'Time',options:{bold:true,fill:'EFE7E1',align:'right'}}],
    ['Briefing','Read the aim and principle together. Do not explain the answer.',{text:'10 min',options:{align:'right'}}],
    ['Demonstration','Open one panel and one lever on screen, then stop.',{text:'10 min',options:{align:'right'}}],
    ['Independent work','Students work the desk alone. Let them commit early and be wrong.',{text:'45 min',options:{align:'right'}}],
    ['Report','Students write and submit; PDFs attached.',{text:'20 min',options:{align:'right'}}],
    ['Debrief','Compare two students who chose differently and ask each to defend it.',{text:'15 min',options:{align:'right'}}]
  ],{colW:[2.6,7.4,1.5],fontSize:13.5});
  note(s,'Resist demonstrating the whole desk. The practical is built so that opening the data is itself the lesson — a student shown where to look has not learned to look.');
}
{
  const s = slide('Submission','What the student produces');
  bullets(s,[
    'The practical generates the report automatically on the Result & Record tab, with the mark, both indices and the data as it stood at the moment of the decision.',
    'The student then writes their own report in the report writer — a minimum word count is enforced before it can be generated.',
    'Download PDF produces a real PDF file of the letterheaded report, which the student keeps.',
    'Attach the required PDFs, then submit to faculty. It appears in the faculty evaluation queue.',
    'Faculty evaluate and return a mark; the student sees it on their dashboard against that module.'
  ],{fontSize:15});
}
{
  const s = slide('Limitations','What to state plainly to students');
  bullets(s,[
    'Every figure in both practicals is synthetic and generated for teaching. No patient, ward or department described is real.',
    'The simulators produce operational and administrative estimates, not clinical predictions.',
    'Nothing either practical outputs may be used to decide the care of any individual patient.',
    'Simulated projections are not real-world financial forecasts, and must never be presented to a committee as measured results.'
  ],{fontSize:15.5});
  note(s,'Students must state these limitations in their own report. It is part of the mark for the justification.');
}
{
  const s = pptx.addSlide(); s.background = { color: DARK };
  s.addText('Questions',{x:0.9,y:3.0,w:11.5,h:0.9,fontSize:38,bold:true,color:WHITE,fontFace:SERIF});
  s.addText('Hospital Administration · Module 1 · Practicals 1 and 2\nALIZON AOS',
    {x:0.9,y:4.0,w:11.5,h:0.9,fontSize:15,color:GOLD,fontFace:SANS,lineSpacingMultiple:1.4});
}

const file = path.join(OUT,'ALIZON-HA-Module1-Practicals-1-and-2-Teaching-Deck.pptx');
pptx.writeFile({ fileName: file }).then(()=>{
  const kb = Math.round(fs.statSync(file).size/1024);
  console.log('wrote', file, '('+kb+' KB)');
});
