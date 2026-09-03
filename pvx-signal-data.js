/* =====================================================================
   pvx-signal-data.js — the historical safety database for PV-X.

   130 synthetic Individual Case Safety Reports. Everything is fictional.

   Three things are deliberately planted in it:

     1. A REAL SIGNAL. Bullous pemphigoid clusters across the whole
        dipeptidyl peptidase-4 inhibitor class — not one brand — with a
        consistent latency of months and a marked age skew. A student who
        filters by drug alone will not see it; it only appears on filtering
        by CLASS. That is the lesson.

     2. A DUPLICATE. PV-HEP-017 is the same patient as the playable case
        PV-HEP-001, reported a second time by the treating physician after
        the patient had already reported it himself. Same age, same sex,
        same drug, same onset date, different reporter and report date.
        Counting it twice inflates every disproportionality figure.

     3. A NEAR-DUPLICATE THAT IS NOT ONE. PV-HEP-031 is a different
        patient with the same drug and the same reaction. Flagging it is
        an error — over-merging destroys real cases just as surely as
        under-merging inflates them.

   The generator is seeded, so every student and every examiner sees the
   identical database.
   ===================================================================== */
(function(){
'use strict';

/* deterministic PRNG — mulberry32 */
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0;
  var t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
var R = rng(20260904);
function pick(a){ return a[Math.floor(R()*a.length)]; }
function ri(lo,hi){ return lo+Math.floor(R()*(hi-lo+1)); }
function d(y,m,day){ return y+'-'+('0'+m).slice(-2)+'-'+('0'+day).slice(-2); }
function rdate(){ return d(pick([2025,2026,2026,2026,2027]), ri(1,12), ri(1,28)); }

var COUNTRY = ['India','India','India','India','United Kingdom','Germany','Japan','Brazil','Canada','Australia','France','Spain'];
var OUT = ['Recovered','Recovering','Recovered','Not recovered','Recovered with sequelae','Unknown'];
var REPORTER = ['Physician','Pharmacist','Physician','Nurse','Consumer','Pharmacist','Physician'];

function row(o){
  return { id:o.id, drug:o.drug, cls:o.cls, event:o.event, age:o.age, sex:o.sex,
           serious:o.serious, outcome:o.outcome, country:o.country, date:o.date,
           latency:o.latency, dechal:o.dechal, rechal:o.rechal||'Not done',
           reporter:o.reporter, note:o.note||'' };
}

var ROWS = [];
var n = 1;
function nid(pfx){ return pfx+'-'+('00'+(n++)).slice(-3); }

/* ---- 1 · the planted signal: DPP-4 inhibitors and bullous pemphigoid ---- */
var DPP4 = ['Sitagliptin','Vildagliptin','Linagliptin','Sitagliptin','Vildagliptin','Saxagliptin','Sitagliptin','Linagliptin','Vildagliptin'];
DPP4.forEach(function(dr,i){
  ROWS.push(row({ id:'PV-DPP-'+('00'+(101+i)).slice(-3), drug:dr, cls:'DPP-4 inhibitor',
    event:'Bullous pemphigoid', age:ri(66,84), sex:pick(['M','F','F','M']),
    serious:'Yes — hospitalisation', outcome:pick(['Recovering','Recovering','Recovered','Not recovered']),
    country:pick(COUNTRY), date:rdate(), latency:ri(140,340),
    dechal:pick(['Positive — slow','Positive — slow','Positive','Unknown']),
    reporter:pick(['Physician','Pharmacist','Physician']),
    note:'Biopsy and immunofluorescence confirmed in '+(i%3===0?'this case':'the referring centre') }));
});
/* two same-class cases with a different event — so the cluster is not the only thing the class does */
ROWS.push(row({id:'PV-DPP-201',drug:'Sitagliptin',cls:'DPP-4 inhibitor',event:'Acute pancreatitis',age:58,sex:'M',
  serious:'Yes — hospitalisation',outcome:'Recovered',country:'India',date:'2026-04-11',latency:64,dechal:'Positive',reporter:'Physician'}));
ROWS.push(row({id:'PV-DPP-202',drug:'Vildagliptin',cls:'DPP-4 inhibitor',event:'Arthralgia',age:61,sex:'F',
  serious:'No',outcome:'Recovered',country:'Germany',date:'2026-09-02',latency:120,dechal:'Positive',reporter:'Consumer'}));

/* ---- 2 · the known association: amoxicillin–clavulanate hepatic injury ---- */
var HEP = [
  {id:'PV-HEP-017', age:56, sex:'M', country:'India', date:'2026-08-29', latency:12,
   dechal:'Positive', outcome:'Recovering', reporter:'Physician',
   note:'Jaundice, ALT 780, bilirubin 5.2, admitted 15 Aug 2026, viral serology negative'},
  {id:'PV-HEP-031', age:63, sex:'F', country:'India', date:'2026-09-04', latency:19,
   dechal:'Positive', outcome:'Recovered', reporter:'Pharmacist',
   note:'Cholestatic picture, ALT 402, bilirubin 3.4, admitted 28 Aug 2026'},
  {id:'PV-HEP-044', age:71, sex:'M', country:'United Kingdom', date:'2025-11-19', latency:26,
   dechal:'Positive', outcome:'Recovered', reporter:'Physician', note:''},
  {id:'PV-HEP-052', age:48, sex:'F', country:'Spain', date:'2026-02-07', latency:9,
   dechal:'Unknown', outcome:'Unknown', reporter:'Consumer', note:'Minimal information supplied'},
  {id:'PV-HEP-068', age:66, sex:'M', country:'India', date:'2026-06-23', latency:31,
   dechal:'Positive', outcome:'Recovered with sequelae', reporter:'Physician', note:''},
  {id:'PV-HEP-079', age:39, sex:'F', country:'Canada', date:'2027-01-14', latency:15,
   dechal:'Positive', outcome:'Recovering', reporter:'Pharmacist', note:''},
  {id:'PV-HEP-088', age:74, sex:'M', country:'France', date:'2026-10-30', latency:22,
   dechal:'Positive', outcome:'Recovered', reporter:'Physician', note:''}
];
HEP.forEach(function(h){
  ROWS.push(row({ id:h.id, drug:'Amoxicillin–clavulanate', cls:'Beta-lactam antibiotic',
    event:'Drug-induced liver injury', age:h.age, sex:h.sex, serious:'Yes — hospitalisation',
    outcome:h.outcome, country:h.country, date:h.date, latency:h.latency,
    dechal:h.dechal, reporter:h.reporter, note:h.note }));
});

/* ---- 3 · the rest: background noise across the formulary ---- */
var BG = [
  ['Allopurinol','Xanthine oxidase inhibitor','Stevens–Johnson syndrome',[30,70],'Yes — hospitalisation',6],
  ['Allopurinol','Xanthine oxidase inhibitor','Rash',[10,60],'No',5],
  ['Enalapril','ACE inhibitor','Cough',[7,90],'No',9],
  ['Ramipril','ACE inhibitor','Cough',[10,120],'No',6],
  ['Ramipril','ACE inhibitor','Angioedema',[1,400],'Yes — life-threatening',3],
  ['Metoclopramide','Prokinetic / dopamine antagonist','Acute dystonic reaction',[1,3],'Yes — medically important',7],
  ['Metoclopramide','Prokinetic / dopamine antagonist','Tardive dyskinesia',[200,900],'Yes — disability',2],
  ['Amiodarone','Antiarrhythmic','Interstitial pneumonitis',[90,700],'Yes — medically important',6],
  ['Amiodarone','Antiarrhythmic','Thyrotoxicosis',[60,600],'Yes — medically important',5],
  ['Amiodarone','Antiarrhythmic','Hepatotoxicity',[30,400],'Yes — hospitalisation',2],
  ['Isotretinoin','Retinoid','Pregnancy exposure',[1,200],'Yes — medically important',5],
  ['Isotretinoin','Retinoid','Depression',[20,200],'Yes — medically important',3],
  ['Atorvastatin','Statin','Myalgia',[7,300],'No',8],
  ['Atorvastatin','Statin','Rhabdomyolysis',[14,400],'Yes — hospitalisation',2],
  ['Metformin','Biguanide','Lactic acidosis',[30,1200],'Yes — life-threatening',3],
  ['Metformin','Biguanide','Diarrhoea',[1,30],'No',6],
  ['Warfarin','Vitamin K antagonist','Gastrointestinal haemorrhage',[20,900],'Yes — hospitalisation',5],
  ['Ciprofloxacin','Fluoroquinolone','Tendon rupture',[3,60],'Yes — disability',4],
  ['Ciprofloxacin','Fluoroquinolone','QT prolongation',[1,10],'Yes — medically important',2],
  ['Carbamazepine','Anticonvulsant','Stevens–Johnson syndrome',[7,60],'Yes — hospitalisation',4],
  ['Phenytoin','Anticonvulsant','DRESS syndrome',[14,60],'Yes — hospitalisation',3],
  ['Nitrofurantoin','Urinary antibacterial','Pulmonary fibrosis',[180,1500],'Yes — medically important',3],
  ['Omeprazole','Proton pump inhibitor','Hyponatraemia',[10,400],'Yes — hospitalisation',3],
  ['Furosemide','Loop diuretic','Bullous pemphigoid',[60,600],'Yes — hospitalisation',2],
  ['Telmisartan','Angiotensin receptor blocker','Dizziness',[1,60],'No',4],
  ['Paracetamol','Analgesic','Hepatotoxicity (overdose)',[1,4],'Yes — life-threatening',3],
  ['Ibuprofen','NSAID','Gastrointestinal ulceration',[7,400],'Yes — hospitalisation',4],
  ['Vancomycin','Glycopeptide','Acute kidney injury',[3,21],'Yes — hospitalisation',3],
  ['Rifampicin','Antimycobacterial','Hepatitis',[14,90],'Yes — hospitalisation',3],
  ['Insulin glargine','Insulin','Hypoglycaemia',[1,300],'Yes — hospitalisation',4]
];
BG.forEach(function(b){
  for (var i=0;i<b[5];i++){
    ROWS.push(row({ id:nid('PV-GEN'), drug:b[0], cls:b[1], event:b[2],
      age:ri(18,86), sex:pick(['M','F']), serious:b[4],
      outcome:pick(OUT), country:pick(COUNTRY), date:rdate(),
      latency:ri(b[3][0],b[3][1]), dechal:pick(['Positive','Positive','Unknown','Not applicable','Negative']),
      reporter:pick(REPORTER) }));
  }
});

/* stable display order — by report date, newest first */
ROWS.sort(function(a,b){ return b.date.localeCompare(a.date); });

window.PVX_SIGNAL_DATA = ROWS;
window.PVX_SIGNAL_TRUTH = {
  /* what the database actually supports — used only by the marking engine */
  signalDrug:'DPP-4 inhibitor class (sitagliptin, vildagliptin, linagliptin, saxagliptin)',
  signalEvent:'Bullous pemphigoid',
  signalRows:11,
  classPoint:'The cluster is visible by CLASS, not by product. Filtering on one brand splits nine reports into three, four and two, and none of those looks like anything.',
  duplicatePair:['PV-HEP-001','PV-HEP-017'],
  duplicateWhy:'Same age, same sex, same suspect drug, same onset and the same laboratory values — reported once by the patient and once by the treating physician, eight days apart.',
  notDuplicate:'PV-HEP-031',
  notDuplicateWhy:'Same drug and same reaction, but a 63-year-old woman with different biochemistry and a different admission date. A different patient. Merging it would delete a real case.',
  knownAssociations:['Amoxicillin–clavulanate / liver injury','Allopurinol / Stevens–Johnson syndrome',
                     'ACE inhibitor / cough','Metoclopramide / dystonia','Amiodarone / pneumonitis',
                     'Isotretinoin / pregnancy exposure'],
  hypothesisRule:'A signal is a hypothesis that warrants evaluation. It is never, on its own, proof of causation — and a disproportionality figure computed on unmerged duplicates is not even a good hypothesis.'
};
})();
