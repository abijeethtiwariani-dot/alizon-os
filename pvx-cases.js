/* =====================================================================
   pvx-cases.js — the HIDDEN case database for PV-X · AI ADR Detective.

   Nothing in this file is shown to the student directly. The engine
   (pvx-engine.js) decides what a simulated patient would reasonably say
   in answer to the question that was actually asked, and what only a
   pharmacist, a doctor, a record or a laboratory could tell them.

   Every case therefore carries three separate things:

     truth[]          the complete, structured case — the answer key
     say{}            optional hand-written lines, in the patient's own
                      words, that override the generated answer
     contradiction{}  what the patient *believes* but has wrong. This is
                      the whole point of the exercise: the student who
                      never opens the dispensing record builds the
                      timeline on the patient's memory and gets the
                      temporal relationship — and therefore causality —
                      wrong.

   All patients, identifiers, batch numbers and laboratory values are
   fictional and synthetic. Nothing here is clinical decision support.
   ===================================================================== */
(function(){
'use strict';

/* ---------- persona catalogue (spec §5) ---------------------------- */
var PERSONAS = {
  A:{name:'Excellent historian', note:'Answers clearly and remembers dates. Tests structure, not patience.'},
  B:{name:'Elderly patient',     note:'Cannot name the medicine and dates drift. The record has to be obtained elsewhere.'},
  C:{name:'Poor historian',      note:'Answers in fragments. One question is never enough — the follow-up is the skill.'},
  D:{name:'Anxious patient',     note:'Volunteers a great deal that does not matter. Tests the ability to stay on the thread.'},
  E:{name:'Parent / guardian',   note:'Reports on behalf of a child. Weight, dose and formulation all matter.'},
  F:{name:'Confused patient',    note:'Mixes up names and doses, confidently. Everything must be verified.'},
  G:{name:'Consumer reporter',   note:'No clinical vocabulary at all. The student must translate, not correct.'}
};

/* ---------- CASE 1 · Level 4 · serious hepatic injury -------------- */
var C1 = {
  id:'PV-HEP-001', level:4, persona:'B',
  label:'Yellow eyes after a new medicine',
  difficulty:'Level 4 — Serious case (hospitalisation)',
  reporter:{who:'Patient, self-reported', qual:'Consumer / patient', country:'India',
            contact:'Walk-in, hospital pharmacy ADR desk', date:'22 August 2026'},
  opening:'I started a new medicine recently. After about two weeks I became very tired, and then my wife noticed that my eyes had gone yellow.',
  truth:{
    patient:{id:'PV-HEP-001-P', name:'Arun M.', age:'56 years', sex:'Male', weight:'78 kg',
             pregnancy:'Not applicable', occupation:'Bank clerk', ethnicity:'—'},
    drug:{generic:'Amoxicillin–clavulanate', brand:'Clavamox 625', dose:'625 mg', route:'Oral',
          freq:'Twice daily', start:'1 August 2026', stop:'15 August 2026', indication:'Dental abscess',
          batch:'AC-7741', prescriber:'Dental surgeon, private clinic', duration:'14 days dispensed'},
    event:{lay:'very tired, then the whites of my eyes and my skin turned yellow, and my urine went dark',
           term:'Drug-induced liver injury — mixed cholestatic/hepatocellular pattern',
           onset:'13 August 2026', dayOfOnset:12,
           symptoms:['Fatigue','Scleral icterus and jaundice','Dark urine','Pale stools','Itching','Anorexia'],
           diagnosis:'Drug-induced liver injury attributed to amoxicillin–clavulanate',
           course:'Admitted 15 August. Suspect drug stopped on admission. Supportive care only. Bilirubin peaked 5.2 mg/dL on 16 August, then fell steadily. Discharged 25 August.',
           outcome:'Recovering', serious:true, criterion:'Hospitalisation / prolongation of hospitalisation',
           hosp:'Admitted 15 August 2026, discharged 25 August 2026'},
    conmeds:[{name:'Atorvastatin',dose:'20 mg',route:'Oral',freq:'Once at night',start:'March 2024',stop:'Continuing',ind:'Dyslipidaemia'},
             {name:'Paracetamol',dose:'500 mg',route:'Oral',freq:'As required, 2–3 tablets a day for 3 days only',start:'2 August 2026',stop:'4 August 2026',ind:'Dental pain'}],
    history:{pmh:'Dyslipidaemia since 2024. No previous liver disease. No diabetes.',
             allergy:'No known drug allergy',
             prevExposure:'Received a course of the same antibiotic about four years ago for a chest infection, with no problem at that time',
             family:'Nothing relevant', surgical:'Nil'},
    lifestyle:{alcohol:'Two or three beers at the weekend. None since falling ill.',
               smoking:'Non-smoker', herbal:'A neighbour gave him a herbal liver tonic on 18 August, three days AFTER admission',
               travel:'No travel outside the district in the last year', diet:'Unremarkable',
               transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — stopped 15 August 2026', improved:'Yes', time:'Symptoms began improving within about a week; bilirubin fell from 5.2 to 2.8 mg/dL by 23 August; transaminases near normal by 5 September'},
    rechallenge:{done:'No', why:'Not performed — deliberately avoided; the drug is now recorded as an allergy', result:'Not applicable'},
    alt:{viral:'Hepatitis A IgM, B surface antigen, C antibody and E IgM all negative (16 August)',
         autoimmune:'ANA and anti-smooth-muscle antibody negative',
         imaging:'Ultrasound abdomen: normal liver echotexture, no biliary dilatation, no gallstones',
         statin:'Atorvastatin taken unchanged for over two years with normal liver function in June 2026',
         paracetamol:'Maximum 1.5 g/day for three days only; well below the hepatotoxic threshold, and the biochemical pattern is not that of paracetamol overdose',
         alcohol:'Modest intake; AST:ALT ratio is well below 2, which does not fit alcoholic liver injury'}
  },
  labs:[
    {day:'Day −7',date:'25 Jul 2026',ALT:32,AST:28,ALP:96,BIL:0.8,INR:1.0,note:'Routine pre-treatment screen — normal'},
    {day:'Day 12',date:'13 Aug 2026',ALT:684,AST:520,ALP:310,BIL:3.1,INR:1.1,note:'First abnormal set, day symptoms began'},
    {day:'Day 15',date:'16 Aug 2026',ALT:780,AST:620,ALP:355,BIL:5.2,INR:1.2,note:'Peak — one day after the drug was stopped'},
    {day:'Day 22',date:'23 Aug 2026',ALT:420,AST:300,ALP:240,BIL:2.8,INR:1.1,note:'Falling after dechallenge'},
    {day:'Day 35',date:'5 Sep 2026',ALT:85,AST:62,ALP:130,BIL:1.1,INR:1.0,note:'Near normal'}
  ],
  /* what the patient has WRONG — only the dispensing record settles it */
  contradiction:{
    slots:{
      drug_name:'It was a white tablet for the tooth infection. Amoxy… something. I am not sure of the full name.',
      drug_start:'I think I started it around the middle of July. Maybe the 14th or 15th.',
      drug_dose:'One tablet. I could not tell you the strength.',
      drug_stop:'I stopped when I went into the hospital.'
    },
    truthIs:'Dispensed 1 August 2026 — amoxicillin–clavulanate 625 mg twice daily, 14 days.',
    resolvedBy:'pharmacist',
    why:'The patient places the start two weeks too early. A student who accepts it records a latency of about 30 days instead of 12, which weakens the temporal relationship, changes the Naranjo temporal item and understates causality.'
  },
  say:{
    event_desc:'First I was just very tired — I put it down to the tooth. Then my wife said my eyes looked yellow, and I noticed my urine had gone the colour of tea.',
    event_onset:'The tiredness was there for a few days before that. The yellow eyes — my wife noticed that on the 13th, I remember because it was her birthday.',
    conmeds:'I take a cholesterol tablet every night, and I was taking paracetamol for the tooth pain.',
    alcohol:'I have two or three beers at the weekend, nothing since I fell ill.',
    prev_exposure:'I had something similar four years ago for a chest infection. It did not trouble me then.',
    herbal:'My neighbour gave me a herbal tonic for the liver. But that was after I was already in the hospital — the 18th, I think.',
    rechallenge:'No. They wrote it on my card, in red, that I must never take it again.'
  },
  doctor:[
    'ALT was 780 U/L and AST 620 U/L on 16 August, with a bilirubin of 5.2 mg/dL and an alkaline phosphatase of 355. The pattern is mixed, leaning cholestatic.',
    'Full viral hepatitis serology was negative — A, B, C and E. ANA and anti-smooth-muscle antibody were also negative.',
    'Ultrasound showed a normal liver with no biliary dilatation and no stones.',
    'He took paracetamol, but no more than 1.5 g a day for three days. That is nowhere near a hepatotoxic dose, and the biochemistry is not the paracetamol picture — you would expect transaminases in the thousands with a much later bilirubin rise.',
    'The atorvastatin has been unchanged for two years and his liver function was normal in June. I would not attribute it to the statin.',
    'We stopped the antibiotic on admission and gave supportive care only. He improved without any specific treatment.',
    'I have recorded this as a drug-induced liver injury and marked the drug as contraindicated for him.'
  ],
  pharmacist:[
    'Amoxicillin–clavulanate 625 mg was dispensed on 1 August 2026 — one tablet twice daily, fourteen days, batch AC-7741. Brand was Clavamox 625.',
    'Prescriber was the dental surgeon. Indication written as dental abscess.',
    'He collected the full quantity and did not return any. On the refill history he had the same antibiotic in September 2022, a five-day course, with no adverse note against it.',
    'His regular atorvastatin 20 mg has been dispensed monthly since March 2024 without interruption.',
    'Nothing else has been dispensed to him in the last six months.'
  ],
  records:[
    'Attendance 15 August 2026 — emergency, jaundice. Admitted under medicine. Discharged 25 August 2026.',
    'Past history: dyslipidaemia, on atorvastatin since 2024. No prior hepatic or biliary disease recorded.',
    'Liver function on 12 June 2026 (annual check) was entirely normal.',
    'Allergy list before this admission: nil. Amoxicillin–clavulanate has now been added as a contraindication.',
    'No alcohol-related attendance. No transfusion, no tattoo, no recent travel recorded.'
  ],
  expect:{
    adr:['drug induced liver injury','drug-induced liver injury','dili','hepatotoxicity','hepatic injury','hepatitis','liver injury','jaundice','cholestatic','hepatocellular'],
    adrText:'Drug-induced liver injury (mixed cholestatic/hepatocellular) attributed to amoxicillin–clavulanate',
    serious:true, criterion:'hospitalisation',
    naranjo:{q1:'yes',q2:'yes',q3:'yes',q4:'unknown',q5:'no',q6:'unknown',q7:'unknown',q8:'unknown',q9:'yes',q10:'yes'},
    naranjoScore:8, causality:'probable',
    who:'probable',
    alt:['paracetamol','atorvastatin','viral hepatitis','alcohol','herbal tonic'],
    altRefuted:'All four principal alternatives are excluded on the record: viral serology negative, statin unchanged for two years with normal June biochemistry, paracetamol dose sub-therapeutic-for-harm, herbal tonic taken three days after admission and therefore after onset.',
    timeline:[
      {t:'1 Aug 2026',e:'Amoxicillin–clavulanate 625 mg twice daily started',key:true},
      {t:'13 Aug 2026',e:'Fatigue and jaundice — symptom onset (day 12)',key:true},
      {t:'13 Aug 2026',e:'First abnormal liver biochemistry (ALT 684)',key:true},
      {t:'15 Aug 2026',e:'Hospital admission; suspect drug withdrawn (dechallenge)',key:true},
      {t:'16 Aug 2026',e:'Peak bilirubin 5.2 mg/dL, ALT 780',key:false},
      {t:'23 Aug 2026',e:'Clinical and biochemical improvement',key:true},
      {t:'5 Sep 2026',e:'Liver biochemistry near normal',key:true}
    ],
    distractors:[
      {t:'14 Jul 2026',e:'Antibiotic started (patient recollection)',trap:'This is the date the patient gives. The dispensing record says 1 August.'},
      {t:'18 Aug 2026',e:'Herbal liver tonic started',trap:'Three days after admission — it cannot have caused an event that began on 13 August.'},
      {t:'March 2024',e:'Atorvastatin started',trap:'True, but two years before the event and with normal biochemistry in June 2026.'}
    ],
    decision:['follow-up','signal','monitor'],
    decisionText:'Report expeditiously as a serious case, request follow-up (final outcome, repeat biochemistry, confirmation that no rechallenge occurs) and add the case to the standing hepatic-injury signal review for this drug class.',
    followUp:['Final outcome and date of full recovery','Repeat liver biochemistry to confirm normalisation','Confirmation that no rechallenge is planned','Exact daily paracetamol dose and duration, documented','Whether the 2022 course was the same brand and strength'],
    critical:['patient_age','patient_sex','drug_name','drug_dose','drug_freq','drug_start','drug_stop','drug_indication',
              'event_desc','event_onset','event_outcome','labs','conmeds','pmh','allergy','prev_exposure',
              'alcohol','herbal','dechallenge','rechallenge','event_hosp','reporter'],
    signal:{isSignal:true, drug:'Amoxicillin–clavulanate', event:'Drug-induced liver injury',
            strength:'moderate', duplicates:['PV-HEP-017'],
            note:'A recognised association. This case adds to it rather than creating it — the correct reading is that the report is consistent with a known risk and belongs in routine signal review, not that it proves causation on its own.'}
  }
};

/* ---------- CASE 2 · Level 2 · two candidate drugs ----------------- */
var C2 = {
  id:'PV-DERM-002', level:2, persona:'G',
  label:'A rash, and two new tablets',
  difficulty:'Level 2 — Concomitant medication (more than one suspect)',
  reporter:{who:'Patient, self-reported', qual:'Consumer / patient', country:'India',
            contact:'Telephone call to the pharmacy', date:'19 September 2026'},
  opening:'I have come out in a terrible rash all over. I started two new tablets last month and I do not know which one has done it.',
  truth:{
    patient:{id:'PV-DERM-002-P', name:'Suma R.', age:'44 years', sex:'Female', weight:'62 kg',
             pregnancy:'Not pregnant', occupation:'School teacher', ethnicity:'—'},
    drug:{generic:'Allopurinol', brand:'Zyloric 100', dose:'100 mg', route:'Oral', freq:'Once daily',
          start:'22 August 2026', stop:'16 September 2026', indication:'Hyperuricaemia with recurrent gout',
          batch:'ZY-2210', prescriber:'General physician', duration:'One month supplied'},
    event:{lay:'red itchy patches everywhere, then blisters, and my mouth got sore so I could not eat',
           term:'Severe cutaneous adverse reaction — Stevens–Johnson syndrome, early',
           onset:'15 September 2026', dayOfOnset:24,
           symptoms:['Widespread maculopapular rash','Target lesions on the trunk','Oral mucosal ulceration','Fever 38.6 °C','Conjunctival injection','Skin detachment under 5% body surface'],
           diagnosis:'Stevens–Johnson syndrome',
           course:'Admitted 17 September. Both suspect drugs stopped. Supportive care, ophthalmology review, no systemic steroid. Improving by 24 September.',
           outcome:'Recovering', serious:true, criterion:'Hospitalisation; also a medically important condition',
           hosp:'Admitted 17 September 2026, still inpatient at the time of report'},
    conmeds:[{name:'Amoxicillin',dose:'500 mg',route:'Oral',freq:'Three times daily',start:'10 September 2026',stop:'15 September 2026',ind:'Sore throat'},
             {name:'Metformin',dose:'500 mg',route:'Oral',freq:'Twice daily',start:'2019',stop:'Continuing',ind:'Type 2 diabetes'},
             {name:'Cetirizine',dose:'10 mg',route:'Oral',freq:'Once daily as required',start:'16 September 2026',stop:'Continuing',ind:'Taken FOR the rash, after onset'}],
    history:{pmh:'Type 2 diabetes since 2019. Recurrent gout since 2025. Chronic kidney disease stage 3 (eGFR 48).',
             allergy:'No known drug allergy before this event',
             prevExposure:'Never taken allopurinol before. Has had amoxicillin several times over the years without any rash.',
             family:'A sister had a severe drug rash, drug unknown', surgical:'Nil'},
    lifestyle:{alcohol:'Nil', smoking:'Non-smoker', herbal:'None', travel:'None', diet:'Unremarkable', transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — both allopurinol and amoxicillin stopped 16–17 September 2026',
                 improved:'Yes, slowly', time:'No new lesions after about four days; mucosal healing over the second week'},
    rechallenge:{done:'No', why:'Contraindicated — rechallenge with a suspected cause of Stevens–Johnson syndrome would be unethical', result:'Not applicable'},
    alt:{amox:'Amoxicillin is a genuine alternative suspect. It was, however, taken for five days only, ending on the day of onset, and she has tolerated it repeatedly before.',
         allo:'Allopurinol latency was 24 days — squarely inside the two-to-eight-week window in which allopurinol hypersensitivity characteristically occurs, and it was a first exposure.',
         renal:'Reduced renal function raises allopurinol risk; the starting dose of 100 mg was not reduced for an eGFR of 48.',
         viral:'Mycoplasma serology and HSV PCR negative.',
         cet:'Cetirizine was started the day after the rash appeared and cannot be causal.'}
  },
  labs:[
    {day:'Baseline',date:'20 Aug 2026',ALT:24,AST:22,ALP:88,BIL:0.6,EOS:'0.3 ×10⁹/L',CRE:'1.3 mg/dL',note:'eGFR 48 — reduced'},
    {day:'Admission',date:'17 Sep 2026',ALT:96,AST:88,ALP:140,BIL:1.0,EOS:'1.4 ×10⁹/L',CRE:'1.4 mg/dL',note:'Eosinophilia; mild transaminitis'},
    {day:'Day 7',date:'24 Sep 2026',ALT:58,AST:50,ALP:120,BIL:0.9,EOS:'0.7 ×10⁹/L',CRE:'1.3 mg/dL',note:'Settling'}
  ],
  contradiction:{
    slots:{ drug_start:'Both of them I started around the same time, I think in September.' },
    truthIs:'Allopurinol was dispensed 22 August; the amoxicillin only on 10 September. They are nineteen days apart.',
    resolvedBy:'pharmacist',
    why:'If the two drugs are believed to have started together, the student has no way to separate them and usually blames the antibiotic, because antibiotics are the familiar cause. The dispensing dates are what make allopurinol the stronger suspect.'
  },
  say:{
    event_desc:'It started as red patches on my chest, then it spread everywhere, and some of them turned into blisters. My mouth is so sore I cannot eat.',
    event_onset:'The patches came up on the 15th. By the 17th my mouth was bad and they admitted me.',
    conmeds:'I take a sugar tablet, morning and night, for years. And they gave me an antibiotic for my throat this month. And I took an anti-allergy tablet for the rash.',
    allergy:'No, I have never reacted to anything before.',
    prev_exposure:'The gout tablet is new — I never took it before. The antibiotic I have had many times.',
    family:'My sister had a bad rash from some medicine once, they never told us which one.'
  },
  doctor:[
    'This is Stevens–Johnson syndrome — target lesions, two mucosal surfaces involved, detachment under five per cent. She was admitted on 17 September.',
    'Both the allopurinol and the amoxicillin were stopped. No systemic steroid; supportive care and ophthalmology review.',
    'There is an eosinophilia of 1.4 and a mild transaminitis, which fits a drug hypersensitivity rather than an infection.',
    'Mycoplasma serology and herpes simplex PCR were negative, so I have no infective trigger.',
    'Her eGFR is 48. She was started on allopurinol 100 mg without any renal dose reduction, which is a recognised risk factor for allopurinol hypersensitivity.',
    'The latency for the allopurinol is around three and a half weeks, which is typical. The amoxicillin had only been running five days and she has tolerated it many times before.'
  ],
  pharmacist:[
    'Allopurinol 100 mg once daily was dispensed on 22 August 2026 — thirty tablets, batch ZY-2210, brand Zyloric.',
    'Amoxicillin 500 mg three times daily was dispensed separately on 10 September 2026, for five days.',
    'So the two were not started together — there are nineteen days between them.',
    'Her metformin 500 mg twice daily has been continuous since 2019.',
    'Cetirizine 10 mg was bought over the counter on 16 September, the day after the rash started.',
    'Nothing on her record shows any previous allopurinol.'
  ],
  records:[
    'Type 2 diabetes since 2019. Gout since 2025. CKD stage 3, last eGFR 48 (20 August 2026).',
    'No documented drug allergy before September 2026.',
    'Amoxicillin dispensed on four previous occasions since 2019, no adverse reaction recorded.',
    'Admission 17 September 2026 — Stevens–Johnson syndrome. Ongoing at the time of report.',
    'Allopurinol and amoxicillin now both listed as suspected; allopurinol recorded as contraindicated.'
  ],
  expect:{
    adr:['stevens','sjs','severe cutaneous','scar','toxic epidermal','drug rash','drug eruption','hypersensitivity','erythema multiforme'],
    adrText:'Stevens–Johnson syndrome (severe cutaneous adverse reaction), suspect allopurinol, amoxicillin as an alternative suspect',
    serious:true, criterion:'hospitalisation',
    naranjo:{q1:'yes',q2:'yes',q3:'yes',q4:'unknown',q5:'no',q6:'unknown',q7:'unknown',q8:'unknown',q9:'no',q10:'yes'},
    naranjoScore:7, causality:'probable', who:'probable',
    alt:['amoxicillin','infection','mycoplasma','cetirizine','metformin'],
    altRefuted:'Amoxicillin cannot be dismissed and must stay on the report as a second suspect — but the latency, the first exposure, the un-reduced dose in renal impairment and her repeated past tolerance of amoxicillin all point to allopurinol. Cetirizine began after onset. Infective causes were excluded.',
    timeline:[
      {t:'22 Aug 2026',e:'Allopurinol 100 mg once daily started (first ever exposure)',key:true},
      {t:'10 Sep 2026',e:'Amoxicillin 500 mg three times daily started',key:true},
      {t:'15 Sep 2026',e:'Rash onset — day 24 of allopurinol, day 5 of amoxicillin',key:true},
      {t:'16 Sep 2026',e:'Allopurinol stopped; cetirizine bought over the counter',key:true},
      {t:'17 Sep 2026',e:'Admitted — Stevens–Johnson syndrome; amoxicillin also stopped',key:true},
      {t:'24 Sep 2026',e:'No new lesions; eosinophilia settling',key:true}
    ],
    distractors:[
      {t:'2019',e:'Metformin started',trap:'Seven years of uneventful use. Not a plausible suspect.'},
      {t:'16 Sep 2026',e:'Cetirizine started',trap:'Started the day AFTER onset. It was taken for the rash, not before it.'},
      {t:'Sept 2026',e:'Both new drugs started together',trap:'The patient believes this. The dispensing record disproves it.'}
    ],
    decision:['signal','follow-up','escalate','risk'],
    decisionText:'Report expeditiously with two suspect drugs listed, request follow-up on outcome and HLA-B*5801 status where available, and escalate for review of renal dose-reduction guidance at initiation of allopurinol.',
    followUp:['Final outcome and extent of skin involvement','HLA-B*5801 typing if available','Confirmation of the exact amoxicillin course dates','Whether a renal dose reduction was considered at prescribing','Ophthalmology outcome'],
    critical:['patient_age','patient_sex','drug_name','drug_dose','drug_start','drug_indication','event_desc','event_onset',
              'event_outcome','conmeds','pmh','allergy','prev_exposure','labs','dechallenge','rechallenge','event_hosp','reporter','renal'],
    signal:{isSignal:false, drug:'Allopurinol', event:'Stevens–Johnson syndrome', strength:'known — labelled',
            duplicates:[],
            note:'This is an established, labelled reaction. The correct answer is that it is NOT a new signal. What it does raise is a possible prescribing-quality signal — initiation without renal dose reduction — which is a different question and belongs to risk minimisation, not signal detection.'}
  }
};

/* ---------- CASE 3 · Level 3 · incomplete reporter, child --------- */
var C3 = {
  id:'PV-NEURO-003', level:3, persona:'E',
  label:'My son cannot stop his neck from turning',
  difficulty:'Level 3 — Incomplete reporter (important information missing)',
  reporter:{who:'Mother, reporting for her son', qual:'Consumer / parent', country:'India',
            contact:'Emergency department, verbal report to the clinical pharmacist', date:'6 October 2026'},
  opening:'Something is wrong with my son. His neck has pulled to one side and his eyes are rolling upwards and he cannot control it. He only had a tablet for vomiting.',
  truth:{
    patient:{id:'PV-NEURO-003-P', name:'Nihal S.', age:'14 years', sex:'Male', weight:'38 kg',
             pregnancy:'Not applicable', occupation:'School student', ethnicity:'—'},
    drug:{generic:'Metoclopramide', brand:'Perinorm 10', dose:'10 mg', route:'Oral', freq:'Three times daily',
          start:'5 October 2026', stop:'6 October 2026', indication:'Vomiting with gastroenteritis',
          batch:'PN-3390', prescriber:'Local clinic', duration:'Three doses taken in total'},
    event:{lay:'his neck twisted to one side, his eyes rolled up, his tongue was pushing out and he could not speak properly',
           term:'Acute dystonic reaction (oculogyric crisis with torticollis)',
           onset:'6 October 2026, about 14 hours after the first dose', dayOfOnset:1,
           symptoms:['Torticollis','Oculogyric crisis','Tongue protrusion','Dysarthria','Marked distress and fear','No loss of consciousness'],
           diagnosis:'Acute dystonic reaction to metoclopramide',
           course:'Brought to the emergency department. Given intravenous promethazine; complete resolution within twenty minutes. Observed four hours and discharged. Metoclopramide stopped and recorded as contraindicated.',
           outcome:'Recovered', serious:true,
           criterion:'Other medically important condition (required emergency intervention); the child was NOT admitted',
           hosp:'Emergency department attendance only, 6 October 2026. No admission.'},
    conmeds:[{name:'Oral rehydration salts',dose:'—',route:'Oral',freq:'As required',start:'4 October 2026',stop:'Continuing',ind:'Gastroenteritis'},
             {name:'Paracetamol',dose:'500 mg',route:'Oral',freq:'Twice on 4 October only',start:'4 October 2026',stop:'4 October 2026',ind:'Fever'},
             {name:'Domperidone',dose:'10 mg',route:'Oral',freq:'One dose on 4 October, from a leftover strip at home',start:'4 October 2026',stop:'4 October 2026',ind:'Vomiting — mother gave it before seeing the clinic'}],
    history:{pmh:'Nothing significant. No epilepsy, no movement disorder, no psychiatric illness.',
             allergy:'No known drug allergy',
             prevExposure:'Has never had metoclopramide before. Had domperidone once, two years ago, uneventfully.',
             family:'No family history of movement disorder', surgical:'Nil'},
    lifestyle:{alcohol:'None — the patient is 14', smoking:'None', herbal:'None', travel:'None',
               diet:'Ate at a roadside stall on 3 October — the presumed source of the gastroenteritis',
               transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — stopped after the third dose, on 6 October 2026',
                 improved:'Yes, complete', time:'Within twenty minutes of intravenous promethazine; no recurrence in the following week'},
    rechallenge:{done:'No', why:'Not performed. Metoclopramide is now recorded as contraindicated.', result:'Not applicable'},
    alt:{epilepsy:'No history of seizure. There was no loss of consciousness, no incontinence and no post-ictal drowsiness — and the boy was fully aware and frightened throughout, which is characteristic of dystonia and against a seizure.',
         electrolyte:'Sodium 138, potassium 3.9, calcium normal on the day. Dehydration alone does not produce an oculogyric crisis.',
         domp:'A single dose of domperidone was taken two days earlier. Domperidone crosses the blood–brain barrier poorly and is a far weaker cause, but it must still be recorded as a concomitant suspect.',
         tetanus:'No trismus, no risus sardonicus, no wound. Not tetanus.',
         dose:'10 mg three times daily is an adult dose. For 38 kg the appropriate dose is weight-based and considerably lower — dose is a contributory factor here, not an incidental detail.'}
  },
  labs:[
    {day:'ED',date:'6 Oct 2026',NA:'138 mmol/L',K:'3.9 mmol/L',CA:'9.2 mg/dL',GLU:'92 mg/dL',note:'No metabolic cause found'},
    {day:'ED',date:'6 Oct 2026',CBC:'Normal',CRP:'8 mg/L',note:'Mild inflammatory response consistent with recent gastroenteritis'}
  ],
  contradiction:{
    slots:{
      drug_dose:'They gave him a tablet three times a day. I do not know how many milligrams — it was just what the clinic gave.',
      conmeds:'Nothing else. Only the vomiting tablet.'
    },
    truthIs:'10 mg three times daily — a full adult dose in a 38 kg child; and a leftover domperidone tablet was given at home on 4 October, before the clinic was seen.',
    resolvedBy:'pharmacist',
    why:'The mother does not think of the tablet she gave herself, from a strip already in the house, as a medicine the pharmacist needs to know about. Almost every student accepts "nothing else" at face value. Home and over-the-counter medicines are the single most commonly missed field in real reports.'
  },
  say:{
    event_desc:'His neck pulled over to the left and stayed there, and his eyes went up so I could only see the white. His tongue was pushing out of his mouth. He was trying to talk and could not.',
    event_onset:'He took the first tablet yesterday evening after the clinic. This morning about nine o\'clock it started.',
    drug_indication:'He had vomiting and loose motions since Saturday. He ate something from a stall.',
    event_outcome:'They gave him an injection in the vein and it stopped, maybe twenty minutes. He is completely normal now.',
    pmh:'He has never been ill like this. No fits, nothing.',
    prev_exposure:'No, he has never had this tablet before.'
  },
  doctor:[
    'This is an acute dystonic reaction — torticollis with an oculogyric crisis. It resolved completely within twenty minutes of intravenous promethazine.',
    'He was fully conscious and aware throughout, and very frightened. That is dystonia, not a seizure. No incontinence, no post-ictal phase.',
    'Sodium 138, potassium 3.9, calcium normal, glucose 92. There is no metabolic explanation.',
    'No trismus, no wound, no risus sardonicus — I considered tetanus and it is not that.',
    'He was on 10 milligrams three times a day. He weighs 38 kilos. That is an adult dose in a child, and children and young adults are the group most prone to metoclopramide dystonia in the first place.',
    'We did not admit him. He was observed for four hours in the emergency department and went home. I would still classify it as medically important — it required emergency parenteral treatment.'
  ],
  pharmacist:[
    'Metoclopramide 10 mg, one tablet three times daily, was dispensed on 5 October 2026 from the clinic — brand Perinorm, batch PN-3390. Six tablets issued, three taken.',
    'There is no weight-based reduction recorded. For a 38 kg child that is a full adult dose.',
    'The mother has since told me she also gave him a domperidone 10 mg tablet on 4 October, from a strip left over at home, before they went to the clinic. That is not on any prescription.',
    'Paracetamol 500 mg was bought over the counter on 4 October.',
    'Nothing else dispensed to this patient in the last two years apart from a domperidone course in 2024.'
  ],
  records:[
    'No previous hospital attendance in the last three years apart from immunisations.',
    'No history of epilepsy, movement disorder or psychiatric illness.',
    'No documented drug allergy prior to this event.',
    'Emergency attendance 6 October 2026 — acute dystonic reaction. Treated and discharged the same day. Not admitted.',
    'Metoclopramide added to the contraindication list on 6 October 2026.'
  ],
  expect:{
    adr:['dystonic','dystonia','extrapyramidal','oculogyric','torticollis','eps','acute dystonic reaction'],
    adrText:'Acute dystonic reaction (oculogyric crisis with torticollis) due to metoclopramide',
    serious:true, criterion:'medically important',
    naranjo:{q1:'yes',q2:'yes',q3:'yes',q4:'unknown',q5:'no',q6:'unknown',q7:'unknown',q8:'yes',q9:'no',q10:'yes'},
    naranjoScore:8, causality:'probable', who:'probable',
    alt:['domperidone','seizure','epilepsy','electrolyte','dehydration','tetanus'],
    altRefuted:'The presentation is dystonic, not ictal, and the child was aware throughout. Electrolytes and glucose were normal. Tetanus was excluded clinically. Domperidone is a weak but genuine second suspect and belongs on the report as a concomitant — leaving it off is the commonest error in this case.',
    timeline:[
      {t:'3 Oct 2026',e:'Food from a roadside stall — presumed source of gastroenteritis',key:false},
      {t:'4 Oct 2026',e:'Domperidone 10 mg given at home from a leftover strip',key:true},
      {t:'5 Oct 2026',e:'Metoclopramide 10 mg three times daily started at the clinic',key:true},
      {t:'6 Oct 2026, 09:00',e:'Acute dystonic reaction — about 14 hours after the first dose',key:true},
      {t:'6 Oct 2026',e:'Emergency department; intravenous promethazine given; drug stopped',key:true},
      {t:'6 Oct 2026, +20 min',e:'Complete resolution — positive dechallenge',key:true}
    ],
    distractors:[
      {t:'4 Oct 2026',e:'Paracetamol given for fever',trap:'Taken, but not a cause of dystonia. Record it as a concomitant, do not put it in the causal chain.'},
      {t:'6 Oct 2026',e:'Patient admitted to hospital',trap:'He was NOT admitted. Seriousness here rests on "other medically important condition", not on hospitalisation.'},
      {t:'2024',e:'Domperidone course',trap:'Two years earlier and uneventful. Relevant as previous exposure, not as a cause.'}
    ],
    decision:['follow-up','risk','monitor'],
    decisionText:'Report as a serious case on the "other medically important condition" criterion, request follow-up on the omitted home medication, and escalate the dosing question — an adult dose issued to a 38 kg child — for prescribing risk minimisation.',
    followUp:['Written confirmation of the domperidone dose and date','Whether any weight was recorded at the clinic','Confirmation of complete and sustained recovery','Whether the clinic holds a paediatric dosing protocol for metoclopramide'],
    critical:['patient_age','patient_sex','patient_weight','drug_name','drug_dose','drug_freq','drug_start','drug_stop',
              'drug_indication','event_desc','event_onset','event_outcome','conmeds','otc','pmh','allergy','prev_exposure',
              'dechallenge','rechallenge','event_hosp','reporter'],
    signal:{isSignal:false, drug:'Metoclopramide', event:'Acute dystonic reaction', strength:'known — labelled, age-related',
            duplicates:[],
            note:'A well-established, labelled reaction with a known age association. Not a new signal. The reportable finding is a medication-error component: an adult dose dispensed for a 38 kg child.'}
  }
};

/* ---------- CASE 4 · Level 5 · special situation ------------------- */
var C4 = {
  id:'PV-PREG-004', level:5, persona:'D',
  label:'I only found out I was pregnant afterwards',
  difficulty:'Level 5 — Special situation (pregnancy exposure)',
  reporter:{who:'Patient, self-reported', qual:'Consumer / patient', country:'India',
            contact:'Pharmacy helpline, follow-up in person', date:'11 November 2026'},
  opening:'I need to speak to somebody. I have been taking a tablet for my skin for months and I have just found out I am nine weeks pregnant and I have read some terrible things on the internet and I have not slept.',
  truth:{
    patient:{id:'PV-PREG-004-P', name:'Meera T.', age:'27 years', sex:'Female', weight:'54 kg',
             pregnancy:'Pregnant — nine weeks by dating scan on 10 November 2026; last menstrual period 5 September 2026',
             occupation:'Graphic designer', ethnicity:'—'},
    drug:{generic:'Isotretinoin', brand:'Sotret 20', dose:'20 mg', route:'Oral', freq:'Once daily',
          start:'12 July 2026', stop:'10 November 2026', indication:'Severe nodulocystic acne',
          batch:'ST-8812', prescriber:'Dermatologist', duration:'Four months continuous'},
    event:{lay:'nothing has happened to me — I am frightened about the baby',
           term:'Exposure to a known teratogen during the first trimester of pregnancy — no adverse outcome yet observed',
           onset:'Conception estimated 19 September 2026; exposure continued to 10 November 2026', dayOfOnset:null,
           symptoms:['No adverse event in the mother','Pregnancy ongoing','Outcome for the foetus not yet known'],
           diagnosis:'First-trimester isotretinoin exposure',
           course:'Isotretinoin stopped immediately on 10 November. Urgent dermatology and obstetric review arranged. Detailed anomaly scan planned at 18–20 weeks. Counselling given.',
           outcome:'Unknown — pregnancy ongoing at the time of report',
           serious:true, criterion:'Other medically important condition — known teratogenic exposure requiring intervention and follow-up',
           hosp:'No admission'},
    conmeds:[{name:'Folic acid',dose:'5 mg',route:'Oral',freq:'Once daily',start:'10 November 2026',stop:'Continuing',ind:'Started after the pregnancy was confirmed'},
             {name:'Doxycycline',dose:'100 mg',route:'Oral',freq:'Once daily',start:'February 2026',stop:'June 2026',ind:'Acne, before isotretinoin'},
             {name:'Topical adapalene',dose:'0.1%',route:'Topical',freq:'At night',start:'January 2026',stop:'10 November 2026',ind:'Acne'}],
    history:{pmh:'Severe nodulocystic acne since 2023. Otherwise well. No chronic illness.',
             allergy:'No known drug allergy',
             prevExposure:'First course of isotretinoin.',
             family:'No family history of congenital anomaly', surgical:'Nil',
             obstetric:'First pregnancy. No previous pregnancy, no miscarriage.'},
    lifestyle:{alcohol:'Occasional, none since the pregnancy test', smoking:'Non-smoker',
               herbal:'None', travel:'None', diet:'Vegetarian', transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — stopped 10 November 2026 on the day the pregnancy was confirmed',
                 improved:'Not applicable — there is no maternal event to improve',
                 time:'Not applicable'},
    rechallenge:{done:'No', why:'Absolutely contraindicated in pregnancy', result:'Not applicable'},
    alt:{none:'There is no alternative cause to weigh, because there is as yet no adverse outcome. The reportable fact is the exposure itself.',
         ppp:'A pregnancy-prevention programme applies to this drug: two negative pregnancy tests before starting, monthly testing during treatment, and two forms of contraception. Only one baseline test was documented and no monthly testing was performed.',
         contra:'She was using a single method of contraception, inconsistently, and was not told that two were required.'}
  },
  labs:[
    {day:'Baseline',date:'10 Jul 2026',ALT:22,AST:20,TG:'118 mg/dL',CHOL:'170 mg/dL',HCG:'Negative',note:'One baseline pregnancy test documented'},
    {day:'Month 2',date:'14 Sep 2026',ALT:31,AST:27,TG:'186 mg/dL',CHOL:'198 mg/dL',HCG:'Not performed',note:'Monthly pregnancy test NOT done — protocol deviation'},
    {day:'Confirmation',date:'10 Nov 2026',ALT:26,AST:24,TG:'150 mg/dL',CHOL:'176 mg/dL',HCG:'Positive',note:'Dating scan: nine weeks. Exposure spans the whole first trimester.'}
  ],
  contradiction:{
    slots:{
      drug_stop:'I stopped as soon as I knew — but honestly I missed a lot of doses in October, I was travelling, so maybe it does not count.',
      event_onset:'I suppose it all started in November when I found out.'
    },
    truthIs:'Continuous supply was dispensed and collected every month from 12 July to 10 November. The exposure period that matters is from conception on about 19 September, not from the day she found out.',
    resolvedBy:'pharmacist',
    why:'The student who dates the "event" from the day of discovery loses the whole point. In a pregnancy-exposure report the reportable window is the period of exposure relative to conception, and the patient will always describe it from the day she found out.'
  },
  say:{
    event_desc:'Nothing has happened to me. I feel fine. It is the baby — I read that this tablet causes terrible defects and I have been on it the whole time without knowing.',
    event_onset:'The test was on the 9th and the scan on the 10th. They said nine weeks. I have been taking the tablet all through that.',
    drug_indication:'For my skin. I had very bad acne, the deep painful kind, for three years and nothing else worked.',
    contraception:'I was on the pill but I am not always regular with it. Nobody told me I needed two methods.',
    pregnancy_test:'They did one test at the start. After that nobody asked me again.',
    conmeds:'I use a cream at night as well. And I started folic acid the day before yesterday.'
  },
  doctor:[
    'There is no maternal adverse event. What we have is a first-trimester exposure to a known human teratogen, and that is itself reportable.',
    'Dating scan on 10 November gives nine weeks, so conception was around 19 September. She has been on isotretinoin continuously since 12 July.',
    'The exposure therefore covers the entire period of organogenesis. That is the part that matters.',
    'I have stopped the drug, started folic acid, and arranged obstetric review with a detailed anomaly scan at 18 to 20 weeks.',
    'The pregnancy-prevention programme was not followed. One baseline pregnancy test, no monthly testing, and a single unreliable contraceptive method. That is a systems failure, not a patient failure.',
    'The outcome of the pregnancy is unknown. This report will need follow-up until delivery, whatever the outcome.'
  ],
  pharmacist:[
    'Isotretinoin 20 mg once daily, brand Sotret, batch ST-8812. Dispensed 12 July, 11 August, 9 September and 8 October 2026 — four consecutive months, thirty capsules each time.',
    'All four were collected. There is no gap in supply.',
    'There is no pregnancy-prevention programme documentation attached to any of the four dispensings. Our own checklist was not completed.',
    'Doxycycline 100 mg was dispensed February to June 2026 and stopped before the isotretinoin started.',
    'Topical adapalene has been on repeat since January 2026.',
    'Folic acid 5 mg was dispensed on 10 November 2026.'
  ],
  records:[
    'Severe nodulocystic acne, dermatology follow-up since 2023.',
    'Isotretinoin initiated 12 July 2026. One negative pregnancy test recorded 10 July 2026.',
    'No monthly pregnancy test recorded during treatment — a documented deviation from the pregnancy-prevention programme.',
    'First pregnancy. No previous obstetric history.',
    'Pregnancy confirmed 9 November 2026, dating scan 10 November 2026 — nine weeks.',
    'Isotretinoin discontinued 10 November 2026. Obstetric referral made the same day.'
  ],
  expect:{
    adr:['pregnancy exposure','teratogen','foetal exposure','fetal exposure','drug exposure in pregnancy','first trimester exposure','in utero'],
    adrText:'First-trimester in-utero exposure to isotretinoin, a known teratogen; pregnancy ongoing and outcome unknown',
    serious:true, criterion:'medically important',
    naranjo:{q1:'unknown',q2:'unknown',q3:'unknown',q4:'unknown',q5:'unknown',q6:'unknown',q7:'unknown',q8:'unknown',q9:'no',q10:'unknown'},
    naranjoScore:0, causality:'not assessable',
    who:'unassessable',
    naranjoNote:'This is the trap in the case. There is no adverse outcome yet, so there is nothing whose causality can be assessed. A student who scores a confident "probable" has assessed a harm that has not happened. The correct answer is that causality is not assessable at this time and the case is followed to term.',
    alt:['none applicable'],
    altRefuted:'Alternative causes do not arise: there is no event to attribute. What must be captured instead is the exact exposure window relative to conception, and the pregnancy-prevention programme deviation.',
    timeline:[
      {t:'10 Jul 2026',e:'Baseline pregnancy test — negative (the only one performed)',key:true},
      {t:'12 Jul 2026',e:'Isotretinoin 20 mg daily started',key:true},
      {t:'19 Sep 2026',e:'Estimated date of conception — exposure continues',key:true},
      {t:'8 Oct 2026',e:'Fourth and last monthly supply collected',key:false},
      {t:'9 Nov 2026',e:'Pregnancy confirmed',key:true},
      {t:'10 Nov 2026',e:'Dating scan nine weeks; isotretinoin stopped; folic acid started',key:true}
    ],
    distractors:[
      {t:'Feb–Jun 2026',e:'Doxycycline course',trap:'Stopped before conception and before the isotretinoin. Not part of the exposure window.'},
      {t:'10 Nov 2026',e:'Adverse event onset',trap:'There is no adverse event. Dating the "event" from the day of discovery is the central error in this case.'},
      {t:'Nov 2026',e:'Congenital anomaly identified',trap:'Nothing of the kind has happened. The outcome is unknown and must be reported as unknown.'}
    ],
    decision:['follow-up','risk','escalate'],
    decisionText:'Report as a serious pregnancy-exposure case with outcome unknown, commit to structured follow-up until delivery and beyond, and escalate the pregnancy-prevention programme failure for risk-minimisation action at the dispensing site.',
    followUp:['Outcome of the pregnancy — live birth, loss or termination, with date','Detailed anomaly scan result at 18–20 weeks','Neonatal examination findings if the pregnancy continues','Confirmation of the exact last dose taken','Documentation of the pregnancy-prevention programme deviation for the site'],
    critical:['patient_age','patient_sex','pregnancy','drug_name','drug_dose','drug_start','drug_stop','drug_indication',
              'event_desc','event_onset','event_outcome','conmeds','pmh','contraception','dechallenge','rechallenge','event_hosp','reporter'],
    signal:{isSignal:false, drug:'Isotretinoin', event:'Pregnancy exposure', strength:'known — the reason the risk programme exists',
            duplicates:[],
            note:'Isotretinoin teratogenicity is not a signal; it is the established fact that the pregnancy-prevention programme exists to manage. The genuine signal in the dataset is the rate of programme non-compliance — repeated exposures despite the programme.'}
  }
};

/* ---------- CASE 5 · Level 1 · clean single suspect ---------------- */
var C5 = {
  id:'PV-RESP-005', level:1, persona:'A',
  label:'A cough that will not go',
  difficulty:'Level 1 — Basic ADR (clear single suspect)',
  reporter:{who:'Patient, self-reported', qual:'Consumer / patient', country:'India',
            contact:'Community pharmacy counter', date:'14 December 2026'},
  opening:'I have had a dry cough for nearly two months now. It started not long after the doctor changed my blood-pressure tablet, and nothing I take for it helps.',
  truth:{
    patient:{id:'PV-RESP-005-P', name:'Joseph K.', age:'61 years', sex:'Male', weight:'71 kg',
             pregnancy:'Not applicable', occupation:'Retired schoolteacher', ethnicity:'—'},
    drug:{generic:'Enalapril', brand:'Envas 5', dose:'5 mg', route:'Oral', freq:'Twice daily',
          start:'8 October 2026', stop:'15 December 2026', indication:'Essential hypertension',
          batch:'EN-1145', prescriber:'General physician', duration:'Continuous since October'},
    event:{lay:'a dry tickling cough, worse when I lie down at night, with nothing coming up',
           term:'ACE-inhibitor–induced persistent dry cough',
           onset:'22 October 2026', dayOfOnset:14,
           symptoms:['Persistent dry non-productive cough','Tickling sensation in the throat','Worse at night and on lying flat','No fever, no sputum, no wheeze','No weight loss'],
           diagnosis:'Cough attributable to angiotensin-converting-enzyme inhibitor',
           course:'Enalapril stopped 15 December and replaced with telmisartan. Cough settled completely over about three weeks.',
           outcome:'Recovered', serious:false, criterion:'Not serious',
           hosp:'No hospitalisation'},
    conmeds:[{name:'Amlodipine',dose:'5 mg',route:'Oral',freq:'Once daily',start:'2021',stop:'Continuing',ind:'Hypertension'},
             {name:'Atorvastatin',dose:'10 mg',route:'Oral',freq:'Once at night',start:'2021',stop:'Continuing',ind:'Dyslipidaemia'}],
    history:{pmh:'Hypertension since 2021. Dyslipidaemia. No asthma, no chronic obstructive pulmonary disease, no reflux disease.',
             allergy:'No known drug allergy',
             prevExposure:'No previous angiotensin-converting-enzyme inhibitor. He was on amlodipine alone until October.',
             family:'Nothing relevant', surgical:'Nil'},
    lifestyle:{alcohol:'Nil', smoking:'Never smoked', herbal:'None', travel:'None',
               diet:'Unremarkable', transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — stopped 15 December 2026', improved:'Yes, complete',
                 time:'Cough eased over about ten days and had gone completely by early January'},
    rechallenge:{done:'No', why:'Not performed — an angiotensin receptor blocker was substituted instead', result:'Not applicable'},
    alt:{asthma:'No wheeze, no diurnal variation, normal spirometry.',
         infection:'No fever, no sputum, no weight loss. Chest radiograph normal.',
         reflux:'No heartburn, no relation to meals.',
         smoking:'Lifelong non-smoker.',
         amlodipine:'Taken for five years without any cough. Not a plausible cause.'}
  },
  labs:[
    {day:'Review',date:'8 Dec 2026',CXR:'Normal',SPIRO:'Normal — FEV1/FVC 0.78',HB:'13.9 g/dL',note:'No respiratory disease found'}
  ],
  contradiction:null,
  say:{
    event_desc:'It is a dry cough, no phlegm at all, just a tickle in the throat. It is worst when I lie down. My wife has moved to the other room.',
    event_onset:'About two weeks after the new tablet started. So the last week of October.',
    drug_name:'Enalapril, five milligrams, morning and night. The doctor added it in October because my pressure was still high on the amlodipine.',
    conmeds:'Amlodipine five milligrams in the morning and atorvastatin ten at night. Both for five years now.',
    smoking:'Never smoked in my life.',
    prev_exposure:'This is the first tablet of that kind I have taken.'
  },
  doctor:[
    'Chest radiograph is normal and spirometry is normal. There is no asthma and no chronic obstructive disease.',
    'No fever, no sputum, no weight loss — this is not an infection or anything sinister.',
    'No reflux symptoms and no relation to meals.',
    'The cough began about a fortnight after the enalapril was added, which is entirely typical.',
    'I stopped the enalapril on 15 December and put him on telmisartan instead. The cough has since gone completely.',
    'I would not rechallenge. There is no need — an angiotensin receptor blocker does the same job without the cough.'
  ],
  pharmacist:[
    'Enalapril 5 mg twice daily, brand Envas, batch EN-1145. First dispensed 8 October 2026, refilled 6 November and 5 December.',
    'Amlodipine 5 mg once daily and atorvastatin 10 mg at night have both been on repeat since 2021, unchanged.',
    'No cough or cold preparations have been dispensed to him, although he tells me he has bought lozenges.',
    'Telmisartan 40 mg was dispensed on 15 December 2026 in place of the enalapril.',
    'No previous angiotensin-converting-enzyme inhibitor anywhere on his record.'
  ],
  records:[
    'Hypertension since 2021, managed on amlodipine alone until October 2026.',
    'Enalapril added 8 October 2026 for inadequate blood-pressure control.',
    'Consultation 8 December 2026 — persistent dry cough, chest radiograph and spirometry normal.',
    'Enalapril discontinued 15 December 2026, telmisartan substituted.',
    'Review January 2027 — cough resolved, blood pressure controlled.'
  ],
  expect:{
    adr:['cough','ace inhibitor cough','dry cough','ace-inhibitor induced cough','persistent cough'],
    adrText:'Persistent dry cough induced by an angiotensin-converting-enzyme inhibitor (enalapril)',
    serious:false, criterion:'not serious',
    naranjo:{q1:'yes',q2:'yes',q3:'yes',q4:'unknown',q5:'no',q6:'unknown',q7:'unknown',q8:'unknown',q9:'no',q10:'yes'},
    naranjoScore:7, causality:'probable', who:'probable',
    alt:['asthma','infection','reflux','smoking','amlodipine'],
    altRefuted:'Every alternative is excluded on the record: normal radiograph and spirometry, no infective features, no reflux symptoms, lifelong non-smoker, and five uneventful years on amlodipine.',
    timeline:[
      {t:'8 Oct 2026',e:'Enalapril 5 mg twice daily added',key:true},
      {t:'22 Oct 2026',e:'Dry cough begins — day 14',key:true},
      {t:'8 Dec 2026',e:'Chest radiograph and spirometry normal',key:true},
      {t:'15 Dec 2026',e:'Enalapril stopped, telmisartan substituted (dechallenge)',key:true},
      {t:'Early Jan 2027',e:'Cough completely resolved',key:true}
    ],
    distractors:[
      {t:'2021',e:'Amlodipine started',trap:'Five uneventful years. A concomitant, not a suspect.'},
      {t:'15 Dec 2026',e:'Telmisartan started',trap:'Started as the replacement, after the event. It is not a suspect.'},
      {t:'Dec 2026',e:'Patient hospitalised',trap:'He was never hospitalised. This case is not serious, and saying otherwise is a marking error, not a safe default.'}
    ],
    decision:['no-action','monitor'],
    decisionText:'Record as a non-serious, expected, labelled reaction with a positive dechallenge. Routine (non-expedited) reporting and routine surveillance are sufficient; no signal action is warranted.',
    followUp:['Confirmation that the cough remained resolved on the substitute','Confirmation that blood pressure stayed controlled'],
    critical:['patient_age','patient_sex','drug_name','drug_dose','drug_freq','drug_start','drug_stop','drug_indication',
              'event_desc','event_onset','event_outcome','conmeds','pmh','allergy','smoking','prev_exposure',
              'dechallenge','rechallenge','event_hosp','reporter'],
    signal:{isSignal:false, drug:'Enalapril', event:'Cough', strength:'known — labelled and common',
            duplicates:[],
            note:'One of the best-described reactions in the whole formulary. Nothing here is a signal. The teaching point is that a correct, well-documented, non-serious report is still a valuable report — under-reporting of the ordinary is what hides the extraordinary.'}
  }
};

/* ---------- CASE 6 · Level 6 · complex causality ------------------- */
var C6 = {
  id:'PV-CARD-006', level:6, persona:'F',
  label:'Breathless again, and nobody agrees why',
  difficulty:'Level 6 — Complex causality (several plausible alternatives)',
  reporter:{who:'Patient, self-reported, with his daughter present', qual:'Consumer / patient', country:'India',
            contact:'Cardiology day clinic, referred to the pharmacovigilance desk', date:'3 February 2027'},
  opening:'My breathing has got much worse again over the last two months. They keep changing my tablets and nobody can tell me what is doing it. I have a cough too, dry, and I get tired walking to the gate.',
  truth:{
    patient:{id:'PV-CARD-006-P', name:'Ramesh V.', age:'68 years', sex:'Male', weight:'66 kg',
             pregnancy:'Not applicable', occupation:'Retired, former textile mill worker', ethnicity:'—'},
    drug:{generic:'Amiodarone', brand:'Cordarone 200', dose:'200 mg', route:'Oral', freq:'Once daily (after a loading course)',
          start:'2 July 2026', stop:'Continuing at the time of report', indication:'Paroxysmal atrial fibrillation',
          batch:'CD-6620', prescriber:'Cardiologist', duration:'Seven months; cumulative dose approximately 46 g'},
    event:{lay:'breathless walking even a short distance, a dry cough, and very tired',
           term:'Amiodarone pulmonary toxicity (interstitial pneumonitis) — superimposed on chronic heart failure',
           onset:'Early December 2026, insidious', dayOfOnset:150,
           symptoms:['Progressive exertional dyspnoea over eight weeks','Dry cough','Fatigue','Low-grade fever on two occasions','Weight loss 3 kg','Fine inspiratory crackles at both bases'],
           diagnosis:'Amiodarone-induced interstitial pneumonitis',
           course:'High-resolution computed tomography showed bilateral ground-glass and reticular change with a peripheral distribution. Echocardiogram showed a stable ejection fraction of 42%, unchanged from July. Thyroid function was normal. Amiodarone withdrawal recommended 3 February with corticosteroid cover and cardiology substitution.',
           outcome:'Not recovered at the time of report',
           serious:true, criterion:'Other medically important condition; hospitalisation being arranged',
           hosp:'Elective admission planned for withdrawal and steroid initiation'},
    conmeds:[{name:'Furosemide',dose:'40 mg',route:'Oral',freq:'Once daily',start:'2023',stop:'Continuing',ind:'Chronic heart failure'},
             {name:'Ramipril',dose:'5 mg',route:'Oral',freq:'Once daily',start:'2023',stop:'Continuing',ind:'Heart failure'},
             {name:'Bisoprolol',dose:'2.5 mg',route:'Oral',freq:'Once daily',start:'2023',stop:'Continuing',ind:'Heart failure'},
             {name:'Warfarin',dose:'Variable by international normalised ratio',route:'Oral',freq:'Once daily',start:'July 2026',stop:'Continuing',ind:'Atrial fibrillation'}],
    history:{pmh:'Chronic heart failure with reduced ejection fraction since 2023. Paroxysmal atrial fibrillation since 2026. Former textile mill worker — twenty-two years of cotton dust exposure. Ex-smoker, twenty pack-years, stopped 2009.',
             allergy:'No known drug allergy',
             prevExposure:'No previous amiodarone.',
             family:'Nothing relevant', surgical:'Nil'},
    lifestyle:{alcohol:'Nil for ten years', smoking:'Ex-smoker, stopped 2009, twenty pack-years',
               herbal:'None', travel:'None', occupationExposure:'Twenty-two years in a textile mill, heavy cotton dust',
               diet:'Unremarkable', transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Not yet at the time of report — withdrawal recommended on 3 February 2027',
                 improved:'Unknown', time:'Not applicable. Note that amiodarone has a half-life of several weeks, so improvement after withdrawal is slow and a negative early dechallenge means nothing.'},
    rechallenge:{done:'No', why:'Would be unsafe', result:'Not applicable'},
    alt:{hf:'Heart failure progression is the obvious alternative — but the echocardiographic ejection fraction is 42%, unchanged from July, and there is no orthopnoea, no raised jugular venous pressure and no peripheral oedema. The breathlessness is not congestive.',
         thyroid:'Amiodarone-induced thyrotoxicosis was actively considered and excluded: thyroid-stimulating hormone 1.8, free T4 normal on 20 January.',
         infection:'No consolidation on imaging, no purulent sputum, white cell count normal, C-reactive protein only mildly raised.',
         occupational:'Twenty-two years of cotton dust and a twenty-pack-year smoking history are genuine confounders and must be recorded — but the radiological change is new since a normal chest radiograph in June 2026, and the pattern is ground-glass with reticulation rather than the fixed changes of an old occupational disease.',
         warfarin:'Not a cause of interstitial lung disease.',
         ramipril:'Causes cough, but not this radiological picture, and it has been unchanged since 2023.'}
  },
  labs:[
    {day:'Baseline',date:'28 Jun 2026',CXR:'Normal',TSH:'2.1 mIU/L',ALT:26,note:'Pre-treatment screen before amiodarone'},
    {day:'Month 4',date:'2 Nov 2026',TSH:'2.4 mIU/L',ALT:38,note:'Routine monitoring — no chest imaging performed'},
    {day:'Current',date:'20 Jan 2027',TSH:'1.8 mIU/L',FT4:'Normal',ALT:41,CRP:'18 mg/L',WBC:'7.8 ×10⁹/L',note:'Thyroid function normal — thyrotoxicosis excluded'},
    {day:'Current',date:'27 Jan 2027',HRCT:'Bilateral peripheral ground-glass with reticulation',ECHO:'Ejection fraction 42% — unchanged from July 2026',note:'New change since the normal radiograph in June 2026'}
  ],
  contradiction:{
    slots:{
      drug_dose:'Two hundred milligrams, three times a day. I have been on that since July.',
      drug_start:'Since about July, I think. Or maybe June.',
      conmeds:'Water tablet, a heart tablet and the blood thinner. I do not remember the names.'
    },
    truthIs:'Loading was 200 mg three times daily for one week only, from 2 July 2026; maintenance has been 200 mg ONCE daily since 9 July. Cumulative exposure is about 46 g.',
    resolvedBy:'pharmacist',
    why:'Amiodarone pulmonary toxicity is related to cumulative dose. A student who takes the patient at his word calculates roughly three times the true cumulative exposure — and then either over-states the case or, worse, dismisses the patient as an unreliable historian and stops verifying anything else he said.'
  },
  say:{
    event_desc:'Before, I could walk to the shop and back. Now I stop twice on the way to the gate. And there is this dry cough that will not clear.',
    event_onset:'It has been creeping up since December. Slowly, not suddenly.',
    orthopnoea:'No, I sleep flat with one pillow, same as always. My ankles are not swollen either — they were, two years ago, but not now.',
    smoking:'I gave up in 2009. Before that, yes, about a packet a day for twenty years.',
    occupation:'I worked twenty-two years in the mill. Cotton dust everywhere, we had no masks in those days.',
    fever:'A little temperature twice, in January. Not high.',
    weight:'I have lost about three kilos. My daughter noticed my shirts were loose.'
  },
  doctor:[
    'The high-resolution scan on 27 January shows bilateral peripheral ground-glass with reticulation. His chest radiograph in June, before the amiodarone, was normal. This is new.',
    'The echocardiogram gives an ejection fraction of 42%, exactly what it was in July. His heart failure has not progressed, and clinically there is no orthopnoea, no raised venous pressure and no oedema. This is not congestive breathlessness.',
    'Thyroid function on 20 January was normal — thyroid-stimulating hormone 1.8, free T4 normal. So this is not amiodarone thyrotoxicosis, which I did consider.',
    'No consolidation, white cell count normal, C-reactive protein only 18. I do not think this is infective.',
    'His occupational history is significant — twenty-two years of cotton dust and twenty pack-years — and I cannot dismiss it. But those exposures ended years ago and the radiology is new since June.',
    'Cumulative amiodarone exposure is around 46 grams over seven months, which is well within the range at which pulmonary toxicity is described.',
    'I am recommending withdrawal with steroid cover and an alternative rhythm strategy. Be aware the half-life is weeks — do not expect a fast dechallenge, and do not read a slow one as evidence against the drug.'
  ],
  pharmacist:[
    'Amiodarone, brand Cordarone 200. Loading was 200 mg three times daily for seven days from 2 July 2026 — twenty-one tablets. Maintenance has been 200 mg ONCE daily ever since, dispensed monthly.',
    'So the patient is mistaken about taking three a day for seven months. Cumulative dose to date is about 46 grams, not 130.',
    'Furosemide 40 mg, ramipril 5 mg and bisoprolol 2.5 mg have all been unchanged on repeat since 2023.',
    'Warfarin was started in July 2026 alongside the amiodarone; the dose has been adjusted several times by the anticoagulation clinic.',
    'No inhalers, no steroids and no nitrofurantoin have ever been dispensed to him.',
    'Every amiodarone refill has been collected on time. There is no gap in supply.'
  ],
  records:[
    'Chronic heart failure with reduced ejection fraction since 2023 — furosemide, ramipril, bisoprolol.',
    'Paroxysmal atrial fibrillation diagnosed June 2026. Amiodarone started 2 July 2026 after cardiology review.',
    'Chest radiograph 28 June 2026 — normal. Baseline thyroid-stimulating hormone 2.1.',
    'Occupational history: textile mill 1979–2001, cotton dust exposure. Ex-smoker, stopped 2009, twenty pack-years.',
    'Echocardiogram July 2026 — ejection fraction 42%. Repeat January 2027 — ejection fraction 42%, unchanged.',
    'No chest imaging performed between July 2026 and January 2027, although amiodarone monitoring guidance advises periodic imaging.'
  ],
  expect:{
    adr:['pulmonary toxicity','pneumonitis','interstitial','lung toxicity','interstitial lung disease','amiodarone lung','pulmonary fibrosis'],
    adrText:'Amiodarone-induced interstitial pneumonitis (pulmonary toxicity)',
    serious:true, criterion:'medically important',
    naranjo:{q1:'yes',q2:'yes',q3:'unknown',q4:'unknown',q5:'no',q6:'unknown',q7:'unknown',q8:'unknown',q9:'no',q10:'yes'},
    naranjoScore:6, causality:'probable',
    who:'possible',
    naranjoNote:'The honest answer sits on the boundary. Dechallenge has not happened yet, so item 3 is unknown — not "no". Marking it "no" because the patient has not improved is the classic error, and with amiodarone\'s weeks-long half-life it is also biologically wrong. Occupational exposure keeps alternative causes from being fully excluded, which is what holds this at possible-to-probable rather than certain.',
    alt:['heart failure','thyrotoxicosis','infection','occupational','smoking','ramipril'],
    altRefuted:'Heart failure progression is excluded by an unchanged ejection fraction and the absence of congestive signs. Thyrotoxicosis is excluded biochemically. Infection is unlikely on imaging and inflammatory markers. Occupational and smoking exposure are real confounders that must be recorded — they lower certainty without displacing the drug, because the radiological change is new since a normal pre-treatment radiograph.',
    timeline:[
      {t:'28 Jun 2026',e:'Baseline chest radiograph normal; thyroid-stimulating hormone 2.1',key:true},
      {t:'2 Jul 2026',e:'Amiodarone loading 200 mg three times daily for seven days',key:true},
      {t:'9 Jul 2026',e:'Maintenance 200 mg once daily begins',key:true},
      {t:'Early Dec 2026',e:'Insidious onset of exertional breathlessness and dry cough',key:true},
      {t:'20 Jan 2027',e:'Thyroid function normal — thyrotoxicosis excluded',key:true},
      {t:'27 Jan 2027',e:'High-resolution scan: bilateral ground-glass and reticulation; ejection fraction unchanged',key:true},
      {t:'3 Feb 2027',e:'Withdrawal with steroid cover recommended — dechallenge not yet performed',key:true}
    ],
    distractors:[
      {t:'Jul 2026 – Feb 2027',e:'Amiodarone 200 mg three times daily throughout',trap:'What the patient believes. Loading was one week only. Cumulative dose is 46 g, not 130 g.'},
      {t:'2023',e:'Ramipril started',trap:'Causes cough, but not ground-glass change, and unchanged for four years.'},
      {t:'1979–2001',e:'Cotton dust exposure',trap:'A real confounder that belongs in the report — but it cannot explain radiology that was normal in June 2026.'}
    ],
    decision:['signal','escalate','follow-up','risk'],
    decisionText:'Report as a serious case, request follow-up on the outcome of withdrawal, and escalate the monitoring gap — no chest imaging between July and January despite guidance — as a risk-minimisation finding.',
    followUp:['Outcome after withdrawal, with repeat imaging at three and six months','Whether corticosteroid was started and the response','Confirmed cumulative amiodarone dose from dispensing records','Formal pulmonary function testing including transfer factor','Whether periodic chest imaging is part of the local amiodarone protocol'],
    critical:['patient_age','patient_sex','drug_name','drug_dose','drug_freq','drug_start','drug_indication',
              'event_desc','event_onset','event_outcome','conmeds','pmh','smoking','occupation_exposure','labs',
              'dechallenge','rechallenge','event_hosp','reporter','prev_exposure'],
    signal:{isSignal:true, drug:'Amiodarone', event:'Interstitial pneumonitis', strength:'moderate — labelled but under-recognised',
            duplicates:[],
            note:'The reaction is labelled, so this is not a new signal in the classical sense. What the dataset does support is a signal of under-monitoring: cases clustering where no interval chest imaging was performed. That is a signal about practice, and it is actionable.'}
  }
};

/* ---------- CASE 7 · Level 7 · signal investigation ---------------- */
var C7 = {
  id:'PV-SIG-007', level:7, persona:'C',
  label:'Blisters, and it is not the first one this year',
  difficulty:'Level 7 — Signal investigation (this case plus the historical database)',
  reporter:{who:'Hospital pharmacist', qual:'Healthcare professional — pharmacist', country:'India',
            contact:'Dermatology ward, teaching hospital', date:'8 March 2027'},
  opening:'Blisters. Big ones. On my arms and my legs. It started a few weeks ago… I do not know exactly. They itch.',
  truth:{
    patient:{id:'PV-SIG-007-P', name:'Devaki N.', age:'73 years', sex:'Female', weight:'58 kg',
             pregnancy:'Not applicable', occupation:'Retired', ethnicity:'—'},
    drug:{generic:'Sitagliptin', brand:'Januvia 100', dose:'100 mg', route:'Oral', freq:'Once daily',
          start:'14 May 2026', stop:'6 March 2027', indication:'Type 2 diabetes mellitus',
          batch:'JV-4407', prescriber:'Endocrinologist', duration:'Nine and a half months'},
    event:{lay:'big tense blisters on my arms and legs, very itchy, some of them burst and left raw patches',
           term:'Bullous pemphigoid',
           onset:'Approximately 2 February 2027', dayOfOnset:264,
           symptoms:['Tense bullae on the limbs and trunk','Intense pruritus','Some erosions where bullae ruptured','No mucosal involvement','Nikolsky sign negative'],
           diagnosis:'Bullous pemphigoid, confirmed on biopsy and direct immunofluorescence',
           course:'Skin biopsy showed a subepidermal blister with eosinophils; direct immunofluorescence showed linear IgG and C3 at the basement membrane zone. Anti-BP180 antibody strongly positive. Sitagliptin stopped 6 March; topical and systemic corticosteroid started.',
           outcome:'Recovering', serious:true, criterion:'Hospitalisation',
           hosp:'Admitted 6 March 2027, inpatient at the time of report'},
    conmeds:[{name:'Metformin',dose:'1000 mg',route:'Oral',freq:'Twice daily',start:'2016',stop:'Continuing',ind:'Type 2 diabetes'},
             {name:'Telmisartan',dose:'40 mg',route:'Oral',freq:'Once daily',start:'2018',stop:'Continuing',ind:'Hypertension'},
             {name:'Atorvastatin',dose:'20 mg',route:'Oral',freq:'Once at night',start:'2018',stop:'Continuing',ind:'Dyslipidaemia'}],
    history:{pmh:'Type 2 diabetes since 2016. Hypertension. No previous skin disease, no autoimmune disease.',
             allergy:'No known drug allergy',
             prevExposure:'No previous dipeptidyl peptidase-4 inhibitor.',
             family:'No family history of blistering disease', surgical:'Nil'},
    lifestyle:{alcohol:'Nil', smoking:'Never', herbal:'None', travel:'None', diet:'Unremarkable',
               transfusion:'Never', tattoo:'None'},
    dechallenge:{done:'Yes — stopped 6 March 2027', improved:'Early improvement; no new bullae after nine days',
                 time:'Slow. Bullous pemphigoid associated with this class characteristically takes weeks to months to settle even after withdrawal.'},
    rechallenge:{done:'No', why:'Would be unsafe and unnecessary', result:'Not applicable'},
    alt:{idiopathic:'Bullous pemphigoid is commonest in exactly this age group, so age alone is a genuine confounder and can never be excluded in a single case. This is precisely why the individual case cannot settle the question and the database has to be examined.',
         other:'Telmisartan and atorvastatin have both been unchanged since 2018, well outside any plausible latency.',
         infection:'No preceding infection, no fever.',
         scabies:'Considered and excluded — no burrows, no household contacts affected, biopsy diagnostic.'}
  },
  labs:[
    {day:'Admission',date:'6 Mar 2027',EOS:'0.9 ×10⁹/L',HBA1C:'7.2%',ALB:'3.6 g/dL',note:'Peripheral eosinophilia'},
    {day:'Biopsy',date:'7 Mar 2027',HISTO:'Subepidermal blister with eosinophil-rich infiltrate',DIF:'Linear IgG and C3 along the basement membrane zone',note:'Diagnostic of bullous pemphigoid'},
    {day:'Serology',date:'8 Mar 2027',BP180:'Strongly positive',BP230:'Weakly positive',note:'Confirms the diagnosis; says nothing about the cause'}
  ],
  contradiction:{
    slots:{
      event_onset:'A few weeks. Maybe a month. I am not sure.',
      drug_start:'The sugar tablets? I have had those for years.',
      drug_name:'There are three or four tablets. I take them together in the morning.'
    },
    truthIs:'Sitagliptin specifically was added on 14 May 2026 — the metformin is the one she has had for years. Bullae began about 2 February 2027, a latency of roughly nine months, which is exactly the latency described for this association.',
    resolvedBy:'pharmacist',
    why:'A poor historian collapses several drugs into "my sugar tablets" and several weeks into "a while". Latency is the single most important variable in this case, and it can only be recovered from the dispensing record.'
  },
  say:{
    event_desc:'Blisters. Tight ones, full of fluid, on my arms and legs. They itch terribly. Some burst.',
    event_onset:'A few weeks ago. Maybe a month. I did not write it down.',
    conmeds:'Sugar tablets. And one for pressure. And something at night.',
    pmh:'Sugar since a long time. Pressure also.',
    prev_exposure:'I do not know. They change the tablets sometimes.',
    allergy:'No.'
  },
  doctor:[
    'The biopsy shows a subepidermal blister with an eosinophil-rich infiltrate, and direct immunofluorescence shows linear IgG and C3 at the basement membrane zone. That is bullous pemphigoid.',
    'Anti-BP180 is strongly positive. That confirms the diagnosis. It does not tell you the cause.',
    'No mucosal involvement, Nikolsky negative. Scabies was considered and excluded.',
    'She is 73, and bullous pemphigoid is commonest in this age group anyway. I cannot exclude idiopathic disease in one patient.',
    'What made me report it is the latency and the class. This is the third patient on a dipeptidyl peptidase-4 inhibitor I have seen with pemphigoid in fourteen months.',
    'We stopped the sitagliptin on 6 March and started steroid. Expect a slow response — this association is described as taking weeks to months to settle after withdrawal.'
  ],
  pharmacist:[
    'Sitagliptin 100 mg once daily, brand Januvia, batch JV-4407. First dispensed 14 May 2026, refilled monthly, last collected 5 February 2027.',
    'The metformin 1000 mg twice daily she has had since 2016 — that is the tablet she means when she says she has had them for years.',
    'Telmisartan 40 mg and atorvastatin 20 mg both unchanged on repeat since 2018.',
    'So the latency from sitagliptin to the first bullae is about nine months.',
    'Nothing else has been dispensed. No new topical preparation, no antibiotic, no diuretic.'
  ],
  records:[
    'Type 2 diabetes since 2016, on metformin. Sitagliptin added 14 May 2026 for inadequate control.',
    'Hypertension and dyslipidaemia since 2018, therapy unchanged.',
    'No previous dermatological or autoimmune diagnosis.',
    'Dermatology referral 1 March 2027. Admission 6 March 2027, bullous pemphigoid.',
    'Departmental note: two other patients on dipeptidyl peptidase-4 inhibitors presented with bullous pemphigoid in the preceding fourteen months.'
  ],
  expect:{
    adr:['bullous pemphigoid','pemphigoid','bullous','blistering','subepidermal'],
    adrText:'Bullous pemphigoid associated with sitagliptin (dipeptidyl peptidase-4 inhibitor)',
    serious:true, criterion:'hospitalisation',
    naranjo:{q1:'yes',q2:'yes',q3:'unknown',q4:'unknown',q5:'unknown',q6:'unknown',q7:'unknown',q8:'unknown',q9:'no',q10:'yes'},
    naranjoScore:4, causality:'possible', who:'possible',
    naranjoNote:'Alternative causes cannot be excluded in a 73-year-old, because idiopathic bullous pemphigoid is common at this age — so item 5 is genuinely uncertain and the honest single-case verdict is possible, not probable. This is the case where the database, not the case, carries the argument.',
    alt:['idiopathic bullous pemphigoid','age','telmisartan','atorvastatin','scabies','infection'],
    altRefuted:'Idiopathic disease cannot be excluded and should not be pretended away. The other drugs are outside any plausible latency. The strength of the case comes from the consistent nine-month latency and the class clustering in the database, not from excluding age.',
    timeline:[
      {t:'2016',e:'Metformin started — the tablet the patient means by "for years"',key:false},
      {t:'14 May 2026',e:'Sitagliptin 100 mg once daily added',key:true},
      {t:'≈2 Feb 2027',e:'First tense bullae — latency about nine months',key:true},
      {t:'1 Mar 2027',e:'Dermatology referral',key:true},
      {t:'6 Mar 2027',e:'Admitted; sitagliptin stopped; corticosteroid started (dechallenge)',key:true},
      {t:'7–8 Mar 2027',e:'Biopsy, immunofluorescence and anti-BP180 confirm bullous pemphigoid',key:true},
      {t:'15 Mar 2027',e:'No new bullae for nine days',key:true}
    ],
    distractors:[
      {t:'2018',e:'Telmisartan started',trap:'Nine years of uneventful use. Outside any plausible latency.'},
      {t:'Feb 2027',e:'Sitagliptin started',trap:'The patient implies this. The record says May 2026. Latency is the crux of the case.'},
      {t:'Mar 2027',e:'Anti-BP180 positive proves the drug caused it',trap:'It confirms the diagnosis, not the cause. Confusing the two is the commonest error in this case.'}
    ],
    decision:['signal','escalate','follow-up'],
    decisionText:'Report as a serious case, and — on the strength of the database rather than this case alone — initiate a formal signal investigation into dipeptidyl peptidase-4 inhibitors and bullous pemphigoid, with escalation to the safety committee.',
    followUp:['Outcome and time to remission after withdrawal','Whether any rechallenge occurs inadvertently on another agent of the class','Anti-BP180 titre on follow-up','Case details of the two other departmental cases','Denominator data — how many patients on this class at the site'],
    critical:['patient_age','patient_sex','drug_name','drug_dose','drug_start','drug_stop','drug_indication',
              'event_desc','event_onset','event_outcome','conmeds','pmh','allergy','prev_exposure','labs',
              'dechallenge','rechallenge','event_hosp','reporter'],
    signal:{isSignal:true, drug:'Sitagliptin (dipeptidyl peptidase-4 inhibitor class)', event:'Bullous pemphigoid',
            strength:'strong', duplicates:[],
            note:'This is the genuine signal in the whole library. The database shows the reports clustering by class rather than by single product, with a consistent latency of months, a marked age skew and positive dechallenge where recorded. The correct conclusion is still that a signal is a HYPOTHESIS requiring evaluation — it justifies investigation and a request for denominator data, not a statement that the drug causes the disease.'}
  }
};
window.PVX_PERSONAS = PERSONAS;
window.PVX_CASES = [C5, C2, C3, C1, C4, C6, C7];
})();
