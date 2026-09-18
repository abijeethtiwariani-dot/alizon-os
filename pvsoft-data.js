/* =====================================================================
   pvsoft-data.js — reference and seed data for the PV Lab simulator.

   THE CLINICAL FACTS LIVE IN pvx-learn-data.js, NOT HERE. Drug cards,
   interactions and patient factors are read from PVXLearnData at load
   time. That file has been audited; duplicating twelve drug monographs
   into a second file would guarantee the two drift apart, and the first
   thing to drift is always the one nobody re-checks.

   What this file adds is what a case-processing system needs and a
   teaching workshop does not: a terminology hierarchy deep enough to
   code against, reference safety information to judge listedness, a
   product dictionary with brands, a case library with hidden answer
   keys, literature records, and the user roster.

   TERMINOLOGY. This is a SYNTHETIC hierarchy in the SHAPE of MedDRA —
   Lowest Level Term, Preferred Term, High Level Term, System Organ
   Class. It is not MedDRA and contains no MedDRA content. MedDRA is
   maintained by the MSSO under licence from ICH and may not be embedded
   in a public page. The shape is what a student needs to learn; the
   codes are invented and are prefixed SYN- so nobody can mistake them
   for real ones.

   Everything is fictional. No real patient, reporter, product batch or
   laboratory value appears anywhere in this file.
   ===================================================================== */
(function(){
'use strict';

var LD = window.PVXLearnData || {};

/* ==================================================================== *
 * 1 · ROLES AND PERMISSIONS                                            *
 *                                                                      *
 * Permissions are listed per role rather than inherited, because a      *
 * hierarchy invites "the manager can do everything the student can",    *
 * which is how a manager ends up able to author the cases they later    *
 * approve. Each role is written out and can be read in one screen.      *
 * ==================================================================== */
var ROLES = {
  student:{
    id:'student', name:'Student', short:'STU', colour:'#0E7490',
    blurb:'Creates and works cases up to submission. Cannot approve their own work, and cannot delete anything.',
    can:['case.create','case.edit.own','case.submit','patient.edit','drug.edit','event.edit',
         'coding.edit','seriousness.edit','expectedness.edit','causality.edit','narrative.draft',
         'followup.request','duplicate.check','training.take','case.view.own','score.view.own']
  },
  pv_officer:{
    id:'pv_officer', name:'Pharmacovigilance Officer', short:'PVO', colour:'#0F766E',
    blurb:'Takes reports in, triages them, corrects data, runs duplicate review and sends cases on for medical review.',
    can:['case.create','case.view.all','case.edit.any','triage.perform','patient.edit','drug.edit','event.edit',
         'coding.edit','seriousness.edit','expectedness.edit','causality.edit','narrative.draft',
         'narrative.edit','followup.request','followup.close','duplicate.check','duplicate.decide',
         'case.advance.medical','case.return']
  },
  medical_reviewer:{
    id:'medical_reviewer', name:'Medical Reviewer', short:'MED', colour:'#7C3AED',
    blurb:'Reviews the clinical content — seriousness, causality and the narrative — and approves or returns it.',
    can:['case.view.all','medical.review','medical.approve','medical.return','seriousness.edit',
         'causality.edit','narrative.edit','followup.request','case.advance.qc']
  },
  qc_officer:{
    id:'qc_officer', name:'Quality Control Officer', short:'QC', colour:'#B45309',
    blurb:'Independent check of a completed case against the record before it goes anywhere.',
    can:['case.view.all','qc.perform','qc.pass','qc.fail','case.return','case.advance.reporting']
  },
  pv_manager:{
    id:'pv_manager', name:'PV Manager', short:'MGR', colour:'#1D4ED8',
    blurb:'Oversight: every case, the signal work, analytics and final closure.',
    can:['case.view.all','case.close','case.reopen','signal.view','signal.manage','analytics.view',
         'reports.view','audit.view','case.advance.reporting','regulatory.generate','literature.review']
  },
  admin:{
    id:'admin', name:'Administrator', short:'ADM', colour:'#475569',
    blurb:'Users, roles, reference data and system configuration. Deliberately not a case-processing role.',
    can:['user.manage','role.manage','drug.manage','terminology.manage','training.manage',
         'config.manage','audit.view','case.view.all','case.delete','analytics.view','signal.view']
  }
};

/* The demo roster. Passwords are not modelled at all — this is a training
   simulator on a public page, and a fake password field would teach the
   wrong lesson about how authentication works. You pick a role and the
   system enforces that role's permissions honestly. */
var USERS = [
  {id:'u-stu-01', username:'student01',  name:'Anjali Menon',      role:'student'},
  {id:'u-stu-02', username:'student02',  name:'Rahul Varghese',    role:'student'},
  {id:'u-pvo-01', username:'pvofficer01',name:'Dr Priya Nair',     role:'pv_officer'},
  {id:'u-med-01', username:'medrev01',   name:'Dr Samuel Thomas',  role:'medical_reviewer'},
  {id:'u-qc-01',  username:'qc01',       name:'Fathima Rasheed',   role:'qc_officer'},
  {id:'u-mgr-01', username:'pvmanager01',name:'Dr Meera Krishnan', role:'pv_manager'},
  {id:'u-adm-01', username:'admin01',    name:'System Administrator', role:'admin'}
];

/* ==================================================================== *
 * 2 · CASE WORKFLOW                                                    *
 *                                                                      *
 * The state machine is data, not code, so the diagram on the dashboard  *
 * and the transitions the buttons are allowed to make can never         *
 * disagree — they are generated from this one table.                    *
 * ==================================================================== */
var STATES = [
  {id:'DRAFT',        name:'Draft',                 colour:'#64748B', next:['SUBMITTED'],
   hint:'Being written. Only the author sees it.'},
  {id:'SUBMITTED',    name:'Submitted',             colour:'#0E7490', next:['TRIAGE'],
   hint:'Handed to the safety desk. The author can no longer change it.'},
  {id:'TRIAGE',       name:'Triage',                colour:'#0891B2', next:['VALIDATED','CLOSED'],
   hint:'Is it a valid case, how urgent is it, and who should work it.'},
  {id:'VALIDATED',    name:'Validated',             colour:'#0D9488', next:['DATA_ENTRY'],
   hint:'The four minimum elements are present. It is a case.'},
  {id:'DATA_ENTRY',   name:'Data entry',            colour:'#0F766E', next:['ASSESSMENT'],
   hint:'Full patient, drug and event detail, and the coding.'},
  {id:'ASSESSMENT',   name:'Assessment',            colour:'#15803D', next:['FOLLOW_UP','MEDICAL_REVIEW'],
   hint:'Seriousness, expectedness, causality, duplicates.'},
  {id:'FOLLOW_UP',    name:'Follow-up',             colour:'#B45309', next:['ASSESSMENT','MEDICAL_REVIEW'],
   hint:'Chasing what is missing. The case waits here until it comes back.'},
  {id:'MEDICAL_REVIEW',name:'Medical review',       colour:'#7C3AED', next:['QC','ASSESSMENT','FOLLOW_UP'],
   hint:'A clinician checks the clinical content and can send it back.'},
  {id:'QC',           name:'Quality control',       colour:'#C2410C', next:['REPORTING_SIMULATION','ASSESSMENT'],
   hint:'An independent check against the record. QC can fail a case.'},
  {id:'REPORTING_SIMULATION',name:'Reporting (simulated)', colour:'#1D4ED8', next:['CLOSED'],
   hint:'The ICSR is generated and taken through a simulated submission.'},
  {id:'CLOSED',       name:'Closed',                colour:'#334155', next:[],
   hint:'Finished. It now counts in analytics and feeds the signal database.'}
];

/* ==================================================================== *
 * 3 · SYNTHETIC TERMINOLOGY — MedDRA-SHAPED, NOT MedDRA                *
 *                                                                      *
 * Five levels, as a real dictionary has. Codes are invented and         *
 * prefixed SYN- precisely so that nobody can paste one into a real      *
 * safety database and have it look plausible.                           *
 * ==================================================================== */
var SOCS = [
  {code:'SYN-SOC-01', name:'Skin and subcutaneous tissue disorders'},
  {code:'SYN-SOC-02', name:'Gastrointestinal disorders'},
  {code:'SYN-SOC-03', name:'Hepatobiliary disorders'},
  {code:'SYN-SOC-04', name:'Nervous system disorders'},
  {code:'SYN-SOC-05', name:'Metabolism and nutrition disorders'},
  {code:'SYN-SOC-06', name:'Respiratory, thoracic and mediastinal disorders'},
  {code:'SYN-SOC-07', name:'Musculoskeletal and connective tissue disorders'},
  {code:'SYN-SOC-08', name:'Renal and urinary disorders'},
  {code:'SYN-SOC-09', name:'Blood and lymphatic system disorders'},
  {code:'SYN-SOC-10', name:'Immune system disorders'},
  {code:'SYN-SOC-11', name:'General disorders and administration site conditions'},
  {code:'SYN-SOC-12', name:'Cardiac disorders'},
  {code:'SYN-SOC-13', name:'Investigations'}
];

/* pt: the term a case is coded to. hlt groups related PTs. llts are the
   verbatim-ish phrasings that map onto the PT — which is the whole point
   of the level: the reporter's words are preserved AND standardised. */
var TERMS = [
 {pt:'Rash maculo-papular', code:'SYN-PT-0101', hlt:'Rashes, eruptions and exanthems', soc:'SYN-SOC-01',
  llts:['Maculopapular rash','Widespread itchy rash','Red spots all over body','Blotchy rash','Morbilliform rash'],
  serious:false},
 {pt:'Urticaria', code:'SYN-PT-0102', hlt:'Urticarias', soc:'SYN-SOC-01',
  llts:['Hives','Nettle rash','Weals','Raised itchy welts'], serious:false},
 {pt:'Angioedema', code:'SYN-PT-0103', hlt:'Angioedema and urticaria', soc:'SYN-SOC-01',
  llts:['Swollen lips','Facial swelling','Tongue swelling','Throat swelling','Puffy face'], serious:true},
 {pt:'Stevens-Johnson syndrome', code:'SYN-PT-0104', hlt:'Severe cutaneous adverse reactions', soc:'SYN-SOC-01',
  llts:['Blistering rash with mouth ulcers','Peeling skin with fever','Skin coming off','Sore eyes and blistering rash'],
  serious:true},
 {pt:'Drug eruption', code:'SYN-PT-0105', hlt:'Rashes, eruptions and exanthems', soc:'SYN-SOC-01',
  llts:['Drug rash','Eruption after medicine','Skin reaction to tablet'], serious:false},
 {pt:'Pruritus', code:'SYN-PT-0106', hlt:'Pruritus NEC', soc:'SYN-SOC-01',
  llts:['Itching','Itchy skin','Severe itch'], serious:false},

 {pt:'Nausea', code:'SYN-PT-0201', hlt:'Nausea and vomiting symptoms', soc:'SYN-SOC-02',
  llts:['Feeling sick','Queasy','Sick feeling','Upset stomach'], serious:false},
 {pt:'Vomiting', code:'SYN-PT-0202', hlt:'Nausea and vomiting symptoms', soc:'SYN-SOC-02',
  llts:['Being sick','Throwing up','Vomited'], serious:false},
 {pt:'Diarrhoea', code:'SYN-PT-0203', hlt:'Diarrhoea (excl infective)', soc:'SYN-SOC-02',
  llts:['Loose motions','Watery stools','Frequent loose stools','Loose stools'], serious:false},
 {pt:'Gastrointestinal haemorrhage', code:'SYN-PT-0204', hlt:'Gastrointestinal haemorrhages NEC', soc:'SYN-SOC-02',
  llts:['Bleeding from the stomach','Vomiting blood','Coffee ground vomit','GI bleed'], serious:true},
 {pt:'Melaena', code:'SYN-PT-0205', hlt:'Gastrointestinal haemorrhages NEC', soc:'SYN-SOC-02',
  llts:['Black tarry stools','Black motion','Dark sticky stools'], serious:true},
 {pt:'Abdominal pain upper', code:'SYN-PT-0206', hlt:'Abdominal pains', soc:'SYN-SOC-02',
  llts:['Stomach pain','Pain in upper abdomen','Epigastric pain'], serious:false},
 {pt:'Dyspepsia', code:'SYN-PT-0207', hlt:'Dyspeptic signs and symptoms', soc:'SYN-SOC-02',
  llts:['Indigestion','Heartburn','Acidity'], serious:false},

 {pt:'Drug-induced liver injury', code:'SYN-PT-0301', hlt:'Hepatic injuries', soc:'SYN-SOC-03',
  llts:['Liver damage from medicine','Hepatotoxicity','Drug induced hepatitis'], serious:true},
 {pt:'Jaundice', code:'SYN-PT-0302', hlt:'Bile duct and jaundice disorders', soc:'SYN-SOC-03',
  llts:['Yellow eyes','Yellow skin','Whites of eyes yellow','Dark urine and yellow eyes'], serious:true},
 {pt:'Cholestasis', code:'SYN-PT-0303', hlt:'Bile duct and jaundice disorders', soc:'SYN-SOC-03',
  llts:['Bile flow blocked','Pale stools and itching'], serious:true},

 {pt:'Dizziness', code:'SYN-PT-0401', hlt:'Neurological signs and symptoms NEC', soc:'SYN-SOC-04',
  llts:['Giddiness','Light headed','Feeling dizzy','Head spinning'], serious:false},
 {pt:'Headache', code:'SYN-PT-0402', hlt:'Headaches NEC', soc:'SYN-SOC-04',
  llts:['Head pain','Headache'], serious:false},
 {pt:'Dystonia', code:'SYN-PT-0403', hlt:'Dyskinesias and movement disorders', soc:'SYN-SOC-04',
  llts:['Neck twisting','Jaw spasm','Tongue sticking out','Eyes rolled up','Torticollis'], serious:true},
 {pt:'Peripheral neuropathy', code:'SYN-PT-0404', hlt:'Peripheral neuropathies NEC', soc:'SYN-SOC-04',
  llts:['Pins and needles','Numbness in feet','Burning feet','Tingling hands'], serious:true},
 {pt:'Seizure', code:'SYN-PT-0405', hlt:'Seizures and seizure disorders', soc:'SYN-SOC-04',
  llts:['Fit','Convulsion','Seizure episode'], serious:true},
 {pt:'Syncope', code:'SYN-PT-0406', hlt:'Loss of consciousness', soc:'SYN-SOC-04',
  llts:['Fainted','Blackout','Passed out'], serious:true},

 {pt:'Hypoglycaemia', code:'SYN-PT-0501', hlt:'Glucose metabolism disorders', soc:'SYN-SOC-05',
  llts:['Low blood sugar','Sugar dropped','Hypo','Sweating and shaking with low sugar'], serious:true},
 {pt:'Hyperkalaemia', code:'SYN-PT-0502', hlt:'Electrolyte imbalance', soc:'SYN-SOC-05',
  llts:['High potassium','Raised potassium'], serious:true},
 {pt:'Hyponatraemia', code:'SYN-PT-0503', hlt:'Electrolyte imbalance', soc:'SYN-SOC-05',
  llts:['Low sodium','Sodium low'], serious:true},
 {pt:'Lactic acidosis', code:'SYN-PT-0504', hlt:'Acid-base disorders', soc:'SYN-SOC-05',
  llts:['Acid build up','Lactic acid high'], serious:true},

 {pt:'Bronchospasm', code:'SYN-PT-0601', hlt:'Bronchospasm and obstruction', soc:'SYN-SOC-06',
  llts:['Wheeze','Chest tightness','Wheezing after painkiller','Difficulty breathing'], serious:true},
 {pt:'Cough', code:'SYN-PT-0602', hlt:'Coughing and associated symptoms', soc:'SYN-SOC-06',
  llts:['Dry cough','Tickly cough','Persistent cough','Cough that will not go'], serious:false},
 {pt:'Dyspnoea', code:'SYN-PT-0603', hlt:'Breathing abnormalities', soc:'SYN-SOC-06',
  llts:['Breathless','Short of breath','Cannot breathe'], serious:true},

 {pt:'Myalgia', code:'SYN-PT-0701', hlt:'Muscle pains', soc:'SYN-SOC-07',
  llts:['Muscle pain','Aching legs','Muscle aches','Sore muscles'], serious:false},
 {pt:'Rhabdomyolysis', code:'SYN-PT-0702', hlt:'Muscle related signs and symptoms', soc:'SYN-SOC-07',
  llts:['Muscle breakdown','Dark urine with muscle pain','Severe muscle damage'], serious:true},
 {pt:'Tendonitis', code:'SYN-PT-0703', hlt:'Tendon disorders', soc:'SYN-SOC-07',
  llts:['Heel pain','Achilles pain','Tendon pain','Pain behind ankle'], serious:false},
 {pt:'Arthralgia', code:'SYN-PT-0704', hlt:'Joint related signs and symptoms', soc:'SYN-SOC-07',
  llts:['Joint pain','Painful joints'], serious:false},

 {pt:'Acute kidney injury', code:'SYN-PT-0801', hlt:'Renal failure and impairment', soc:'SYN-SOC-08',
  llts:['Kidney failure','Renal failure','Creatinine rising','Kidneys stopped working'], serious:true},
 {pt:'Renal impairment', code:'SYN-PT-0802', hlt:'Renal failure and impairment', soc:'SYN-SOC-08',
  llts:['Reduced kidney function','Poor kidney function'], serious:true},

 {pt:'Anaemia', code:'SYN-PT-0901', hlt:'Anaemias NEC', soc:'SYN-SOC-09',
  llts:['Low haemoglobin','Low blood count','Anaemic'], serious:true},
 {pt:'Agranulocytosis', code:'SYN-PT-0902', hlt:'White blood cell disorders', soc:'SYN-SOC-09',
  llts:['No white cells','Very low neutrophils'], serious:true},
 {pt:'Thrombocytopenia', code:'SYN-PT-0903', hlt:'Platelet disorders', soc:'SYN-SOC-09',
  llts:['Low platelets','Platelet count low'], serious:true},
 {pt:'Haemorrhage', code:'SYN-PT-0904', hlt:'Haemorrhages NEC', soc:'SYN-SOC-09',
  llts:['Bleeding','Bleeding gums','Nosebleed','Unusual bruising'], serious:true},

 {pt:'Anaphylactic reaction', code:'SYN-PT-1001', hlt:'Anaphylactic responses', soc:'SYN-SOC-10',
  llts:['Anaphylaxis','Severe allergic reaction','Collapse after injection','Allergic shock'], serious:true},
 {pt:'Hypersensitivity', code:'SYN-PT-1002', hlt:'Allergic conditions NEC', soc:'SYN-SOC-10',
  llts:['Allergic reaction','Allergy to medicine'], serious:false},

 {pt:'Fatigue', code:'SYN-PT-1101', hlt:'Asthenic conditions', soc:'SYN-SOC-11',
  llts:['Very tired','Exhausted','No energy','Tired all the time'], serious:false},
 {pt:'Pyrexia', code:'SYN-PT-1102', hlt:'Febrile disorders', soc:'SYN-SOC-11',
  llts:['Fever','Temperature','Feverish'], serious:false},
 {pt:'Oedema peripheral', code:'SYN-PT-1103', hlt:'Oedema NEC', soc:'SYN-SOC-11',
  llts:['Ankle swelling','Swollen ankles','Swollen legs','Puffy feet','Fluid in legs'], serious:false},
 {pt:'Drug ineffective', code:'SYN-PT-1104', hlt:'Therapeutic response decreased', soc:'SYN-SOC-11',
  llts:['Medicine did not work','No effect','Treatment failed','Became pregnant on the pill'], serious:false},

 {pt:'Bradycardia', code:'SYN-PT-1201', hlt:'Rate and rhythm disorders', soc:'SYN-SOC-12',
  llts:['Slow pulse','Slow heart rate'], serious:true},
 {pt:'Palpitations', code:'SYN-PT-1202', hlt:'Rate and rhythm disorders', soc:'SYN-SOC-12',
  llts:['Heart racing','Fluttering in chest'], serious:false},
 {pt:'Hypotension', code:'SYN-PT-1203', hlt:'Vascular hypotensive disorders', soc:'SYN-SOC-12',
  llts:['Low blood pressure','BP dropped','Postural drop'], serious:false},

 {pt:'Blood creatinine increased', code:'SYN-PT-1301', hlt:'Renal function analyses', soc:'SYN-SOC-13',
  llts:['Creatinine up','Raised creatinine'], serious:false},
 {pt:'Transaminases increased', code:'SYN-PT-1302', hlt:'Liver function analyses', soc:'SYN-SOC-13',
  llts:['Liver enzymes raised','ALT high','AST high','LFTs deranged'], serious:false},
 {pt:'International normalised ratio increased', code:'SYN-PT-1303', hlt:'Coagulation analyses', soc:'SYN-SOC-13',
  llts:['INR high','INR raised','Blood too thin'], serious:false},
 {pt:'Blood glucose decreased', code:'SYN-PT-1304', hlt:'Carbohydrate analyses', soc:'SYN-SOC-13',
  llts:['Glucose low','Blood sugar low reading'], serious:false}
];

/* ==================================================================== *
 * 4 · PRODUCT DICTIONARY                                               *
 *                                                                      *
 * Built from the audited drug cards, with the presentation detail a     *
 * coding screen needs added on top. Brands are fictional where they     *
 * are not obviously generic.                                           *
 * ==================================================================== */
var PRODUCT_EXTRA = {
  amoxicillin:              {brands:['Amoxinil 500','Moxipen'], strengths:['250 mg','500 mg'], forms:['Capsule','Oral suspension'], routes:['Oral'], atc:'J01CA04'},
  'amoxicillin-clavulanate':{brands:['Clavunil 625','Amoxiclav-DT'], strengths:['375 mg','625 mg','1 g'], forms:['Tablet'], routes:['Oral'], atc:'J01CR02'},
  diclofenac:               {brands:['Diclonil 50','Voltamed'], strengths:['50 mg','75 mg','100 mg SR'], forms:['Tablet','Injection','Gel'], routes:['Oral','Intramuscular','Topical'], atc:'M01AB05'},
  warfarin:                 {brands:['Warfanil','Coumadin-K'], strengths:['1 mg','2 mg','5 mg'], forms:['Tablet'], routes:['Oral'], atc:'B01AA03'},
  metformin:                {brands:['Glucomet 500','Metfornil'], strengths:['500 mg','850 mg','1 g'], forms:['Tablet','Extended-release tablet'], routes:['Oral'], atc:'A10BA02'},
  glimepiride:              {brands:['Glimenil 2','Amarynil'], strengths:['1 mg','2 mg','3 mg','4 mg'], forms:['Tablet'], routes:['Oral'], atc:'A10BB12'},
  enalapril:                {brands:['Enalanil 5','Renitec-E'], strengths:['2.5 mg','5 mg','10 mg'], forms:['Tablet'], routes:['Oral'], atc:'C09AA02'},
  atorvastatin:             {brands:['Atornil 10','Lipistat'], strengths:['10 mg','20 mg','40 mg'], forms:['Tablet'], routes:['Oral'], atc:'C10AA05'},
  ciprofloxacin:            {brands:['Cipronil 500','Quinolex'], strengths:['250 mg','500 mg'], forms:['Tablet','Infusion'], routes:['Oral','Intravenous'], atc:'J01MA02'},
  carbamazepine:            {brands:['Carbanil 200','Tegrimed'], strengths:['100 mg','200 mg','400 mg CR'], forms:['Tablet'], routes:['Oral'], atc:'N03AF01'},
  propranolol:              {brands:['Propranil 40','Cardilol'], strengths:['10 mg','40 mg','80 mg'], forms:['Tablet'], routes:['Oral'], atc:'C07AA05'},
  metoclopramide:           {brands:['Metonil 10','Gastromid'], strengths:['10 mg'], forms:['Tablet','Injection'], routes:['Oral','Intravenous','Intramuscular'], atc:'A03FA01'}
};

function products(){
  var out = [];
  Object.keys(LD.DRUGS||{}).forEach(function(k){
    var d = LD.DRUGS[k], x = PRODUCT_EXTRA[k] || {};
    out.push({
      key:k, generic:d.generic, cls:d.cls, indications:d.why||[],
      brands:x.brands||[], strengths:x.strengths||[], forms:x.forms||['Tablet'],
      routes:x.routes||['Oral'], atc:x.atc||'—'
    });
  });
  return out;
}

/* ==================================================================== *
 * 5 · REFERENCE SAFETY INFORMATION (listedness)                        *
 *                                                                      *
 * A fictional company core data sheet per product: which reactions are  *
 * LISTED, and at what frequency. Expectedness is judged against this    *
 * and nothing else — the system never claims to have fetched current    *
 * approved labelling, because it has not.                               *
 * ==================================================================== */
var RSI = {
  amoxicillin:{version:'CCDS v4.2 (fictional)', listed:{
    'Rash maculo-papular':'Common', 'Nausea':'Common', 'Diarrhoea':'Common', 'Urticaria':'Uncommon',
    'Pruritus':'Common', 'Hypersensitivity':'Uncommon', 'Anaphylactic reaction':'Rare',
    'Stevens-Johnson syndrome':'Very rare', 'Drug eruption':'Common'}},
  'amoxicillin-clavulanate':{version:'CCDS v3.8 (fictional)', listed:{
    'Diarrhoea':'Very common','Nausea':'Common','Rash maculo-papular':'Common',
    'Drug-induced liver injury':'Rare','Jaundice':'Rare','Cholestasis':'Rare',
    'Transaminases increased':'Uncommon','Anaphylactic reaction':'Rare'}},
  diclofenac:{version:'CCDS v6.1 (fictional)', listed:{
    'Dyspepsia':'Very common','Abdominal pain upper':'Common','Nausea':'Common',
    'Gastrointestinal haemorrhage':'Uncommon','Melaena':'Uncommon','Headache':'Common',
    'Dizziness':'Common','Oedema peripheral':'Common','Acute kidney injury':'Rare',
    'Bronchospasm':'Uncommon','Transaminases increased':'Common'}},
  warfarin:{version:'CCDS v5.0 (fictional)', listed:{
    'Haemorrhage':'Very common','Melaena':'Common','Gastrointestinal haemorrhage':'Uncommon',
    'International normalised ratio increased':'Common','Anaemia':'Common'}},
  metformin:{version:'CCDS v4.9 (fictional)', listed:{
    'Diarrhoea':'Very common','Nausea':'Very common','Vomiting':'Common',
    'Abdominal pain upper':'Common','Lactic acidosis':'Very rare'}},
  glimepiride:{version:'CCDS v3.3 (fictional)', listed:{
    'Hypoglycaemia':'Common','Blood glucose decreased':'Common','Nausea':'Uncommon',
    'Hyponatraemia':'Rare','Jaundice':'Very rare'}},
  enalapril:{version:'CCDS v5.4 (fictional)', listed:{
    'Cough':'Very common','Dizziness':'Common','Hypotension':'Common',
    'Hyperkalaemia':'Common','Angioedema':'Uncommon','Acute kidney injury':'Uncommon',
    'Blood creatinine increased':'Common'}},
  atorvastatin:{version:'CCDS v4.0 (fictional)', listed:{
    'Myalgia':'Common','Headache':'Common','Nausea':'Common',
    'Transaminases increased':'Common','Rhabdomyolysis':'Rare'}},
  ciprofloxacin:{version:'CCDS v4.6 (fictional)', listed:{
    'Nausea':'Common','Diarrhoea':'Common','Headache':'Common','Dizziness':'Uncommon',
    'Tendonitis':'Uncommon','Peripheral neuropathy':'Rare','Seizure':'Rare',
    'Anaphylactic reaction':'Very rare','Hypersensitivity':'Uncommon','Urticaria':'Uncommon',
    'Rash maculo-papular':'Uncommon'}},
  carbamazepine:{version:'CCDS v5.2 (fictional)', listed:{
    'Dizziness':'Very common','Fatigue':'Common','Hyponatraemia':'Common',
    'Rash maculo-papular':'Common','Stevens-Johnson syndrome':'Rare',
    'Agranulocytosis':'Very rare','Thrombocytopenia':'Uncommon'}},
  propranolol:{version:'CCDS v3.1 (fictional)', listed:{
    'Fatigue':'Common','Bradycardia':'Common','Dizziness':'Common','Bronchospasm':'Uncommon'}},
  metoclopramide:{version:'CCDS v2.9 (fictional)', listed:{
    'Fatigue':'Common','Diarrhoea':'Common','Dystonia':'Uncommon'}}
};

/* ==================================================================== *
 * 6 · THE TRAINING CASE LIBRARY                                        *
 *                                                                      *
 * Ten cases. `expected` is the hidden answer key the student is scored  *
 * against — it is never rendered anywhere in the case-working screens,  *
 * only in the debrief after scoring.                                    *
 * ==================================================================== */
function C(o){ return o; }
var TRAINING = [
C({id:'TC-01', title:'Rash on day two of an antibiotic', level:1,
  brief:'A community pharmacist telephones about a young woman who developed a widespread itchy rash two days into a course of amoxicillin for a throat infection.',
  reporter:{type:'Healthcare professional', name:'S. Pillai', institution:'Community pharmacy, Thiruvananthapuram', country:'India', source:'Pharmacist', email:'reporter@example.org', phone:'+91 00000 00001'},
  patient:{age:'22', sex:'Female', weight:'54 kg', history:'No known drug allergy. Otherwise well.', labs:'None taken.'},
  drugs:[{category:'Suspect', key:'amoxicillin', dose:'500 mg', route:'Oral', freq:'Three times daily',
          start:'2026-09-01', stop:'2026-09-03', indication:'Streptococcal pharyngitis',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Widespread itchy rash', start:'2026-09-03', end:'2026-09-07', outcome:'Recovered',
           description:'Flat and raised red rash over trunk and both arms, itchy, no blisters, no mouth or eye involvement, no fever.',
           clinical:'Afebrile. No mucosal involvement. No facial swelling.', lab:'None', treatment:'Oral antihistamine', hosp:'No'}],
  expected:{ valid:true, serious:false, seriousCriteria:[], priority:'MEDIUM',
             pt:'Rash maculo-papular', expectedness:'Expected', causality:'probable',
             followupNeeded:true, dupe:false,
             teaching:'A textbook non-serious, expected, probable case. It matters because the description — no blisters, no mucosal involvement, no fever — is what separates it from a severe cutaneous reaction, and because the allergy label that follows will affect her care for life.' }}),

C({id:'TC-02', title:'Gastrointestinal upset on starting metformin', level:1,
  brief:'A newly diagnosed diabetic reports diarrhoea and nausea within days of starting metformin.',
  reporter:{type:'Healthcare professional', name:'Dr R. Menon', institution:'Primary health centre', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00002'},
  patient:{age:'47', sex:'Male', weight:'81 kg', history:'Type 2 diabetes, newly diagnosed. No renal impairment.', labs:'eGFR 88 mL/min/1.73m².'},
  drugs:[{category:'Suspect', key:'metformin', dose:'500 mg', route:'Oral', freq:'Twice daily',
          start:'2026-08-20', stop:'', indication:'Type 2 diabetes mellitus',
          action:'Dose not changed', dechallenge:'Not applicable', rechallenge:'Not done'}],
  events:[{reported:'Loose motions and feeling sick', start:'2026-08-22', end:'', outcome:'Recovering',
           description:'Three to four loose stools a day with nausea, worse after the morning dose, settling over two weeks.',
           clinical:'Well hydrated, no abdominal tenderness.', lab:'None', treatment:'Advised to take with food', hosp:'No'}],
  expected:{ valid:true, serious:false, seriousCriteria:[], priority:'LOW',
             pt:'Diarrhoea', expectedness:'Expected', causality:'probable',
             followupNeeded:true, dupe:false,
             teaching:'Very common, expected and self-limiting. The learning point is that an expected non-serious reaction is still reportable, and that the outcome field must not be left as "unknown" when the case is still running.' }}),

C({id:'TC-03', title:'Black stools in a patient taking an NSAID', level:3,
  brief:'An emergency department reports a patient admitted with black tarry stools and a low haemoglobin, on long-term diclofenac for knee pain.',
  reporter:{type:'Healthcare professional', name:'Dr A. Kurian', institution:'District hospital, emergency department', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00003'},
  patient:{age:'68', sex:'Male', weight:'70 kg', history:'Osteoarthritis. Hypertension. Previous duodenal ulcer 2019.', labs:'Haemoglobin 7.9 g/dL (was 13.1 g/dL in June 2026). Urea raised.'},
  drugs:[{category:'Suspect', key:'diclofenac', dose:'50 mg', route:'Oral', freq:'Three times daily',
          start:'2026-06-10', stop:'2026-09-12', indication:'Osteoarthritis knee pain',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'},
         {category:'Concomitant', key:'enalapril', dose:'5 mg', route:'Oral', freq:'Once daily',
          start:'2024-01-01', stop:'', indication:'Hypertension',
          action:'Dose not changed', dechallenge:'Not applicable', rechallenge:'Not done'}],
  events:[{reported:'Black tarry stools', start:'2026-09-11', end:'2026-09-18', outcome:'Recovered',
           description:'Three days of black tarry stools with dizziness on standing. Endoscopy showed a bleeding gastric ulcer.',
           clinical:'Pale, pulse 104, BP 96/60. Endoscopy: gastric ulcer with recent bleeding.',
           lab:'Haemoglobin 7.9 g/dL. Transfused two units.', treatment:'Transfusion, proton pump inhibitor, endoscopic haemostasis', hosp:'Yes — admitted 12 to 18 September 2026'}],
  expected:{ valid:true, serious:true, seriousCriteria:['hosp'], priority:'URGENT',
             pt:'Melaena', expectedness:'Expected', causality:'probable',
             followupNeeded:false, dupe:false,
             teaching:'Serious by hospitalisation, and expected — being in the label does not make it unimportant. The previous ulcer is the risk factor that should have stopped this prescription, and it is the kind of detail that only appears if medical history is actually asked for.' }}),

C({id:'TC-04', title:'Collapse before lunch in an elderly diabetic', level:4,
  brief:'A relative reports that an elderly woman on diabetes tablets has been sweaty, shaky and confused several times before lunch, once needing help to get off the floor.',
  reporter:{type:'Consumer', name:'Family member', institution:'—', country:'India', source:'Consumer', email:'reporter@example.org', phone:'+91 00000 00004'},
  patient:{age:'71', sex:'Female', weight:'58 kg', history:'Type 2 diabetes 12 years. Hypertension. Eating less since being told her sugar was high.', labs:'Capillary glucose 49 mg/dL during an episode. eGFR 41 mL/min/1.73m².'},
  drugs:[{category:'Suspect', key:'glimepiride', dose:'2 mg', route:'Oral', freq:'Once daily in the morning',
          start:'2026-08-15', stop:'', indication:'Type 2 diabetes mellitus',
          action:'Dose not changed', dechallenge:'Unknown', rechallenge:'Not done'},
         {category:'Concomitant', key:'metformin', dose:'1 g', route:'Oral', freq:'Twice daily',
          start:'2019-03-01', stop:'', indication:'Type 2 diabetes mellitus',
          action:'Dose not changed', dechallenge:'Not applicable', rechallenge:'Not done'},
         {category:'Interacting', key:'enalapril', dose:'5 mg', route:'Oral', freq:'Once daily',
          start:'2021-05-01', stop:'', indication:'Hypertension',
          action:'Dose not changed', dechallenge:'Not applicable', rechallenge:'Not done'}],
  events:[{reported:'Sweaty, shaky and confused before lunch', start:'2026-09-05', end:'', outcome:'Recovering',
           description:'Six episodes over three weeks, before lunch, relieved by sugar. Twice had to sit on the floor.',
           clinical:'No postural blood pressure drop recorded.', lab:'Capillary glucose 49 mg/dL during an episode.',
           treatment:'Oral glucose at the time', hosp:'No'}],
  expected:{ valid:true, serious:true, seriousCriteria:['important'], priority:'HIGH',
             pt:'Hypoglycaemia', expectedness:'Expected', causality:'probable',
             followupNeeded:true, dupe:false,
             teaching:'Serious as an "other medically important condition" despite no admission — the fall risk in a 71-year-old is the point. The reported term was "dizziness-like"; coding it to Dizziness instead of Hypoglycaemia would send this case to the wrong place entirely.' }}),

C({id:'TC-05', title:'Bruising and bleeding gums after an antibiotic course', level:3,
  brief:'A patient on long-term warfarin reports bleeding gums and heavy bruising a few days after finishing a course of ciprofloxacin.',
  reporter:{type:'Healthcare professional', name:'Ms L. George', institution:'Anticoagulation clinic', country:'India', source:'Nurse', email:'reporter@example.org', phone:'+91 00000 00005'},
  patient:{age:'63', sex:'Male', weight:'76 kg', history:'Atrial fibrillation on warfarin since 2022. INR normally 2.0 to 3.0.', labs:'INR 6.4 (target 2.0 to 3.0).'},
  /* Warfarin is listed first deliberately. Both drugs are suspect — the
     reaction belongs to the combination — but expectedness is a drug-event
     judgement, and haemorrhage is warfarin's labelled reaction, precipitated
     here by the antibiotic. Judging it against the ciprofloxacin label would
     wrongly return "unexpected". */
  drugs:[{category:'Suspect', key:'warfarin', dose:'4 mg', route:'Oral', freq:'Once daily',
          start:'2022-04-01', stop:'', indication:'Atrial fibrillation',
          action:'Dose reduced', dechallenge:'Positive', rechallenge:'Not done'},
         {category:'Suspect', key:'ciprofloxacin', dose:'500 mg', route:'Oral', freq:'Twice daily',
          start:'2026-08-28', stop:'2026-09-04', indication:'Urinary tract infection',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Bleeding gums and heavy bruising', start:'2026-09-06', end:'2026-09-12', outcome:'Recovered',
           description:'Bleeding from the gums when brushing, and large bruises on both forearms, six days after starting the antibiotic and two days after finishing it.',
           clinical:'No major bleeding. No melaena, no haematuria.', lab:'INR 6.4.', treatment:'Warfarin withheld, oral vitamin K, INR rechecked', hosp:'No'}],
  expected:{ valid:true, serious:true, seriousCriteria:['important'], priority:'HIGH',
             pt:'Haemorrhage', expectedness:'Expected', causality:'probable',
             followupNeeded:false, dupe:false,
             teaching:'The reaction belongs to the COMBINATION, not to either drug alone, which is why both are coded as suspect. Note the timing: the INR peaked after the antibiotic had finished, because warfarin acts with a lag.' }}),

C({id:'TC-06', title:'Collapse minutes after an injection', level:5,
  brief:'A hospital reports a patient who collapsed with facial swelling and difficulty breathing within minutes of receiving an antibiotic injection.',
  reporter:{type:'Healthcare professional', name:'Dr N. Joseph', institution:'Teaching hospital, medical ward', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00006'},
  patient:{age:'35', sex:'Female', weight:'62 kg', history:'No previously documented drug allergy. Received the same class of antibiotic three years ago without incident.', labs:'Serum tryptase raised at 90 minutes.'},
  drugs:[{category:'Suspect', key:'ciprofloxacin', dose:'400 mg', route:'Intravenous', freq:'Single dose',
          start:'2026-09-14', stop:'2026-09-14', indication:'Suspected pyelonephritis',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Collapse with facial swelling and difficulty breathing', start:'2026-09-14', end:'2026-09-15', outcome:'Recovered',
           description:'Within five minutes of the infusion starting: facial and lip swelling, wheeze, widespread urticaria, blood pressure 70/40, loss of consciousness.',
           clinical:'Airway maintained, wheeze throughout, BP 70/40, urticaria.',
           lab:'Serum tryptase raised.', treatment:'Intramuscular adrenaline, fluids, oxygen, antihistamine, corticosteroid. Observed 24 hours.',
           hosp:'Yes — admitted for observation 14 to 15 September 2026'}],
  expected:{ valid:true, serious:true, seriousCriteria:['lifethreat','hosp'], priority:'URGENT',
             pt:'Anaphylactic reaction', expectedness:'Expected', causality:'certain',
             followupNeeded:false, dupe:false,
             teaching:'Two seriousness criteria, not one. This is among the few cases that can reach "Certain" without a rechallenge: an immediate, characteristic, objectively confirmed reaction with a clear dechallenge and no alternative explanation.' }}),

C({id:'TC-07', title:'A cough that would not settle', level:2,
  brief:'A patient has had a dry cough for four months, treated twice with antibiotics and once with a chest X-ray, with no diagnosis.',
  reporter:{type:'Healthcare professional', name:'Dr S. Abraham', institution:'Family medicine clinic', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00007'},
  patient:{age:'57', sex:'Female', weight:'67 kg', history:'Hypertension. Non-smoker. No asthma.', labs:'Chest X-ray normal.'},
  drugs:[{category:'Suspect', key:'enalapril', dose:'10 mg', route:'Oral', freq:'Once daily',
          start:'2026-04-02', stop:'2026-09-10', indication:'Hypertension',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Dry cough that will not go away', start:'2026-05-20', end:'2026-09-24', outcome:'Recovered',
           description:'Persistent dry tickly cough, worse lying down, no sputum, no wheeze. Settled about two weeks after the tablet was stopped.',
           clinical:'Chest clear. No wheeze.', lab:'Chest X-ray normal.', treatment:'Antibiotics twice, with no benefit, before the drug was suspected.', hosp:'No'}],
  expected:{ valid:true, serious:false, seriousCriteria:[], priority:'LOW',
             pt:'Cough', expectedness:'Expected', causality:'probable',
             followupNeeded:false, dupe:false,
             teaching:'A non-serious reaction that cost four months, two antibiotic courses and an X-ray because nobody asked what started before the cough did. Time to onset here is months, not days — a long latency does not argue against causality for this reaction.' }}),

C({id:'TC-08', title:'Aching thighs and dark urine', level:4,
  brief:'A patient on a statin developed severe thigh pain and cola-coloured urine a week after being prescribed an antibiotic for a chest infection.',
  reporter:{type:'Healthcare professional', name:'Dr P. Sharma', institution:'District hospital', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00008'},
  patient:{age:'59', sex:'Male', weight:'88 kg', history:'Hyperlipidaemia. Previous myocardial infarction 2023.', labs:'Creatine kinase 18,400 U/L. Creatinine 2.1 mg/dL (baseline 0.9).'},
  drugs:[{category:'Suspect', key:'atorvastatin', dose:'40 mg', route:'Oral', freq:'Once at night',
          start:'2023-06-01', stop:'2026-09-16', indication:'Secondary cardiovascular prevention',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'},
         {category:'Interacting', key:'ciprofloxacin', dose:'500 mg', route:'Oral', freq:'Twice daily',
          start:'2026-09-08', stop:'2026-09-15', indication:'Lower respiratory tract infection',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Severe thigh pain with dark urine', start:'2026-09-15', end:'', outcome:'Recovering',
           description:'Severe bilateral thigh pain and weakness, unable to climb stairs, with cola-coloured urine.',
           clinical:'Marked proximal muscle tenderness and weakness.',
           lab:'Creatine kinase 18,400 U/L, creatinine 2.1 mg/dL.', treatment:'Statin stopped, intravenous fluids, renal function monitored', hosp:'Yes — admitted 16 September 2026, still an inpatient'}],
  expected:{ valid:true, serious:true, seriousCriteria:['hosp','important'], priority:'URGENT',
             pt:'Rhabdomyolysis', expectedness:'Expected', causality:'probable',
             followupNeeded:true, dupe:false,
             teaching:'The statin alone was tolerated for three years. What changed was the antibiotic, which is why it is coded as an interacting drug rather than left off. Myalgia and rhabdomyolysis are the same complaint at two ends of a spectrum: the creatine kinase and the dark urine are what move the coded term.' }}),

C({id:'TC-09', title:'Blistering rash five weeks into a new antiepileptic', level:5,
  brief:'A teenager started on carbamazepine has been admitted with a blistering rash, mouth ulcers, sore eyes and fever.',
  reporter:{type:'Healthcare professional', name:'Dr K. Rajan', institution:'Teaching hospital, dermatology', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00009'},
  patient:{age:'17', sex:'Male', weight:'55 kg', history:'Newly diagnosed focal epilepsy. South Asian ancestry. HLA-B*15:02 status not tested before starting.', labs:'Raised transaminases. Eosinophilia.'},
  drugs:[{category:'Suspect', key:'carbamazepine', dose:'200 mg', route:'Oral', freq:'Twice daily',
          start:'2026-08-05', stop:'2026-09-11', indication:'Focal epilepsy',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Blistering rash with mouth ulcers and sore eyes', start:'2026-09-09', end:'', outcome:'Not recovered',
           description:'Painful dusky rash on trunk and face progressing to blisters, with mouth ulceration, conjunctivitis and fever of 38.9°C. Skin detachment under 10% of body surface area.',
           clinical:'Mucosal involvement at mouth and eyes. Nikolsky sign positive. Fever 38.9°C.',
           lab:'Transaminases raised. Eosinophilia.', treatment:'Drug stopped, transferred to burns unit, supportive care', hosp:'Yes — admitted 11 September 2026, still an inpatient'}],
  expected:{ valid:true, serious:true, seriousCriteria:['lifethreat','hosp'], priority:'URGENT',
             pt:'Stevens-Johnson syndrome', expectedness:'Expected', causality:'probable',
             followupNeeded:true, dupe:false,
             teaching:'Coding this as "Rash" would lose the entire case. Mucosal involvement, fever and skin pain are what make it a dermatological emergency. Note also the pharmacogenomic angle: HLA-B*15:02 testing before starting is recommended in this ancestry and was not done.' }}),

C({id:'TC-10', title:'A second report of the same patient', level:2,
  brief:'A report arrives from a hospital about a 22-year-old woman with a rash on amoxicillin. A similar case is already in the database.',
  reporter:{type:'Healthcare professional', name:'Dr T. Mathew', institution:'Teaching hospital, general medicine', country:'India', source:'Doctor', email:'reporter@example.org', phone:'+91 00000 00010'},
  patient:{age:'22', sex:'Female', weight:'54 kg', history:'No known drug allergy.', labs:'None.'},
  drugs:[{category:'Suspect', key:'amoxicillin', dose:'500 mg', route:'Oral', freq:'Three times daily',
          start:'2026-09-01', stop:'2026-09-03', indication:'Sore throat',
          action:'Drug withdrawn', dechallenge:'Positive', rechallenge:'Not done'}],
  events:[{reported:'Itchy rash over the body', start:'2026-09-03', end:'2026-09-07', outcome:'Recovered',
           description:'Widespread itchy rash, settled after the antibiotic was stopped.',
           clinical:'No mucosal involvement, afebrile.', lab:'None', treatment:'Antihistamine', hosp:'No'}],
  expected:{ valid:true, serious:false, seriousCriteria:[], priority:'LOW',
             pt:'Rash maculo-papular', expectedness:'Expected', causality:'probable',
             followupNeeded:false, dupe:true,
             teaching:'This is the same patient and the same event as TC-01, reported a second time by a different reporter. Merging it is right; entering it as a new case would double-count one patient in every signal calculation that follows. Duplicate detection is not administrative tidiness — it is data integrity.' }})
];

/* ==================================================================== *
 * 7 · LITERATURE (training records only)                               *
 * ==================================================================== */
var LITERATURE = [
 {id:'LIT-01', title:'Cholestatic hepatitis following amoxicillin–clavulanate: a case series',
  journal:'Journal of Training Hepatology (fictional)', year:2025, authors:'Varma R, Iqbal S',
  drug:'amoxicillin-clavulanate', event:'Drug-induced liver injury', relevance:'High',
  abstract:'Nine patients presented with cholestatic jaundice between one and six weeks after a course of amoxicillin–clavulanate. Onset followed completion of therapy in five. All recovered with supportive care.'},
 {id:'LIT-02', title:'Sulfonylurea-associated hypoglycaemia in older adults with declining renal function',
  journal:'Training Journal of Diabetes Safety (fictional)', year:2026, authors:'Nair P, Thomas S',
  drug:'glimepiride', event:'Hypoglycaemia', relevance:'High',
  abstract:'Retrospective review of 140 admissions. Falling eGFR was the strongest predictor of severe or recurrent hypoglycaemia; a third of episodes presented as a fall or confusion rather than adrenergic symptoms.'},
 {id:'LIT-03', title:'Fluoroquinolone and statin co-prescription and rhabdomyolysis risk',
  journal:'Training Pharmacoepidemiology Reports (fictional)', year:2025, authors:'Sharma P, Kurian A',
  drug:'atorvastatin', event:'Rhabdomyolysis', relevance:'Medium',
  abstract:'Signal evaluation of co-prescription. Risk concentrated in patients over 55 and in the first two weeks of antibiotic therapy.'},
 {id:'LIT-04', title:'HLA-B*15:02 screening before carbamazepine in South Asian populations',
  journal:'Training Journal of Pharmacogenomics (fictional)', year:2026, authors:'Rajan K, Menon A',
  drug:'carbamazepine', event:'Stevens-Johnson syndrome', relevance:'High',
  abstract:'Cost-effectiveness and yield of pre-treatment screening. Screening averted an estimated 1 severe cutaneous reaction per 430 patients tested in the modelled population.'},
 {id:'LIT-05', title:'Angiotensin-converting enzyme inhibitor cough: time to recognition',
  journal:'Training Primary Care Journal (fictional)', year:2024, authors:'Abraham S',
  drug:'enalapril', event:'Cough', relevance:'Medium',
  abstract:'Median time from cough onset to the drug being suspected was 14 weeks; 61% received at least one course of antibiotics first.'},
 {id:'LIT-06', title:'Seasonal variation in coffee consumption among hospital staff',
  journal:'Training Journal of Miscellany (fictional)', year:2024, authors:'Anon',
  drug:'', event:'', relevance:'None',
  abstract:'Included deliberately. A literature screen returns irrelevant hits, and deciding that something is NOT relevant is part of the work.'}
];

/* ==================================================================== *
 * 8 · SEED SIGNALS                                                     *
 * ==================================================================== */
var SEED_SIGNALS = [
 {drug:'amoxicillin-clavulanate', event:'Drug-induced liver injury', count:18, status:'UNDER_ASSESSMENT',
  stage:'Signal assessment', opened:'2026-06-14',
  note:'Disproportionate reporting against the class. Cholestatic pattern, onset 1 to 6 weeks, several after completion of therapy.'},
 {drug:'glimepiride', event:'Hypoglycaemia', count:31, status:'MONITORING',
  stage:'Monitoring', opened:'2026-03-02',
  note:'Known and labelled. Kept under monitoring because of the age and renal-function distribution of the reports, not because the reaction is new.'},
 {drug:'ciprofloxacin', event:'Tendonitis', count:7, status:'OPEN',
  stage:'Signal validation', opened:'2026-08-21',
  note:'Small numbers, but concentrated in patients over 60 and on corticosteroids. Being validated against the background rate.'}
];

window.PVSoftData = {
  ROLES:ROLES, USERS:USERS, STATES:STATES,
  SOCS:SOCS, TERMS:TERMS, products:products, PRODUCT_EXTRA:PRODUCT_EXTRA,
  RSI:RSI, TRAINING:TRAINING, LITERATURE:LITERATURE, SEED_SIGNALS:SEED_SIGNALS
};
})();
