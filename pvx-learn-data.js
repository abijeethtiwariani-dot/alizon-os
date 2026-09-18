/* =====================================================================
   pvx-learn-data.js — the TEACHING content for PV Foundations.

   PV-X (pvx-cases.js) hides everything from the student on purpose: you
   are given a patient and nothing else. That is the right design for an
   assessment and the wrong one for a beginner, who does not yet know
   that a question about previous exposure exists to be asked.

   So this file is the opposite of that one. Nothing here is hidden. It
   is the reference library the student is *supposed* to open — drug
   cards, an interaction checker, a term dictionary — because the skill
   being taught is not recall, it is knowing what to look up and what to
   do with the answer.

   Everything is written for somebody who has not done pharmacology yet:
   mechanism in one plain sentence first, the technical sentence second.

   ---------------------------------------------------------------------
   ACCURACY NOTE, and please read it before editing any drug card.

   The pharmacology here is deliberately textbook-level and conservative:
   interactions and contraindications that appear in standard references
   and national formularies, not edge cases from single reports. Where a
   number is given (an incidence, a time to onset) it is a typical
   teaching figure, not a value to quote in an exam answer.

   The MedDRA section is a TEACHING STAND-IN, not MedDRA. MedDRA is
   maintained by the MSSO under licence from ICH and cannot be embedded
   in a public web page. What is modelled here is the *structure* — lay
   phrase, verbatim reported term, a preferred-term-style label and a
   system organ class — because the structure is the lesson. A student
   who understands that a patient's words are not the coded term has
   learned the thing that matters. Anyone coding a real case must use a
   current licensed MedDRA browser.

   Every patient, identifier and laboratory value is fictional. Nothing
   in this file is clinical decision support.
   ===================================================================== */
(function(){
'use strict';

/* ==================================================================== *
 * 1 · DRUG INTELLIGENCE CARDS                                          *
 *                                                                      *
 * The student meets the drug BEFORE being asked to spot a reaction to  *
 * it. Each card answers, in order, the five questions a pharmacy       *
 * student actually has: what is it, why is it given, what goes wrong   *
 * often, what goes wrong seriously, and what must I check.             *
 *                                                                      *
 * `teach` is what appears behind "I don't know this drug" — the same   *
 * content pitched lower, with the class explained from scratch.        *
 * ==================================================================== */
var DRUGS = {

amoxicillin:{
  key:'amoxicillin', generic:'Amoxicillin', brandish:'Novamox, Mox (examples)',
  cls:'Antibiotic — aminopenicillin (a beta-lactam)',
  what:'An antibiotic. It kills bacteria.',
  why:['Throat, ear and sinus infections','Chest infections','Dental infections','Urinary infections',
       'Part of combination treatment for H. pylori stomach ulcers'],
  how:'It stops bacteria from building their cell wall, so the cell bursts as it tries to grow.',
  howTech:'Inhibits bacterial transpeptidases (penicillin-binding proteins), blocking peptidoglycan cross-linking — bactericidal.',
  common:[{e:'Nausea',n:'Common, usually mild'},{e:'Diarrhoea',n:'Common — it disturbs normal gut bacteria'},
          {e:'Rash',n:'Common; a maculopapular rash is the classic one'},{e:'Oral or vaginal thrush',n:'Same reason as the diarrhoea'}],
  serious:[{e:'Anaphylaxis',n:'Minutes to an hour. Airway, breathing, circulation. A medical emergency.'},
           {e:'Severe cutaneous adverse reactions (SJS/TEN, DRESS)',n:'Rare. Blistering, mucosal involvement, fever, skin pain.'},
           {e:'Clostridioides difficile colitis',n:'Watery diarrhoea during or weeks after the course'},
           {e:'Cholestatic liver injury',n:'Mainly with the clavulanate combination. Often 1–6 weeks in, sometimes after the course has finished.'},
           {e:'Acute interstitial nephritis',n:'Rare. Rash, fever, rising creatinine.'}],
  inter:['warfarin','methotrexate','allopurinol','oral-contraceptive'],
  contra:[{c:'Previous serious allergic reaction to any penicillin',n:'Absolute. Ask, every single time — and ask what actually happened, because "allergy" in a record is often a stomach upset.'},
          {c:'Infectious mononucleosis (glandular fever)',n:'A rash is very likely and gets mislabelled as penicillin allergy for life.'}],
  cautions:[{c:'Kidney impairment',n:'Dose interval usually needs lengthening'},
            {c:'History of any drug rash',n:'Document what it looked like and when it started'}],
  monitor:['Ask about penicillin allergy before the first dose','Rash: when did it start, where is it, is it itchy, any blisters or mouth involvement',
           'Diarrhoea that is watery or persists','Yellowing of eyes or dark urine if the clavulanate combination was used'],
  counsel:'Finish the course. Come back straight away for a rash, swelling of the face or lips, breathing difficulty, or watery diarrhoea.',
  onset:'Rash: typically 5–10 days into a first course, but within hours to 2 days if the patient has met a penicillin before. Anaphylaxis: minutes.',
  teach:'Amoxicillin is one of the penicillins — the oldest family of antibiotics and still one of the most used. '
      +'Two things about it matter for pharmacovigilance. First, rash is genuinely common, and telling a harmless rash '
      +'from the start of something dangerous is a real clinical skill. Second, penicillin allergy is the single most '
      +'important thing to ask before dispensing it, and it is the question most often skipped.'},

'amoxicillin-clavulanate':{
  key:'amoxicillin-clavulanate', generic:'Amoxicillin–clavulanate (co-amoxiclav)', brandish:'Augmentin, Clavam (examples)',
  cls:'Antibiotic — aminopenicillin plus a beta-lactamase inhibitor',
  what:'Amoxicillin with a second ingredient that protects it from being destroyed by resistant bacteria.',
  why:['Infections where resistance to plain amoxicillin is likely','Dental abscess','Sinusitis that has not responded',
       'Animal and human bites','Some chest and urinary infections'],
  how:'The amoxicillin part kills the bacteria. The clavulanate part is a decoy — it soaks up the enzyme the bacteria use to break amoxicillin down.',
  howTech:'Clavulanic acid irreversibly inhibits many bacterial beta-lactamases, restoring amoxicillin activity against beta-lactamase-producing organisms.',
  common:[{e:'Diarrhoea',n:'More common than with plain amoxicillin'},{e:'Nausea',n:'Take it with food'},{e:'Rash',n:''},{e:'Thrush',n:''}],
  serious:[{e:'Cholestatic liver injury',n:'THE one to know. Attributed to the clavulanate. Classically 1–6 weeks after starting, and often after the course has already finished. Jaundice, itching, dark urine, pale stools.'},
           {e:'Anaphylaxis',n:'As for any penicillin'},{e:'Severe cutaneous adverse reactions',n:'Rare'},
           {e:'C. difficile colitis',n:'Higher risk than with narrower antibiotics'}],
  inter:['warfarin','methotrexate','allopurinol','oral-contraceptive'],
  contra:[{c:'Previous serious penicillin allergy',n:'Absolute'},
          {c:'Previous jaundice or liver injury with this combination',n:'Absolute — it recurs, and more severely'}],
  cautions:[{c:'Older age, and longer courses',n:'Both raise the liver injury risk'},{c:'Kidney impairment',n:'Dose adjustment'}],
  monitor:['Yellow eyes, itching, dark urine, pale stools — during the course AND for about six weeks after',
           'Liver function tests if any of those appear','Diarrhoea severity'],
  counsel:'Take it with food. If your eyes or skin turn yellow, or your urine goes dark, stop and be seen the same day — even if you finished the course weeks ago.',
  onset:'Liver injury: commonly 1–6 weeks from the first dose, with a good number starting after the course ended. That delay is why it gets missed.',
  teach:'This is plain amoxicillin plus a bodyguard. The bodyguard is the problem: clavulanate is one of the most '
      +'common causes of drug-induced liver injury in the world, precisely because the drug is prescribed so much. '
      +'The reaction arrives late — often after the patient has stopped taking it — so a student who only looks for '
      +'reactions "during treatment" will miss it every time.'},

diclofenac:{
  key:'diclofenac', generic:'Diclofenac', brandish:'Voveran, Voltaren (examples)',
  cls:'NSAID — non-steroidal anti-inflammatory drug',
  what:'A painkiller that also brings down inflammation and fever.',
  why:['Joint and muscle pain','Arthritis','Period pain','Pain after injury or surgery','Dental pain'],
  how:'It blocks the enzyme that makes the chemicals which cause pain and swelling. Those same chemicals protect the stomach lining and help the kidneys keep their blood flow — which is why blocking them causes the trouble it does.',
  howTech:'Non-selective COX-1/COX-2 inhibition reduces prostaglandin synthesis. Loss of gastroprotective PGE2 and of afferent arteriolar vasodilator prostaglandins explains the GI and renal toxicity.',
  common:[{e:'Indigestion, heartburn, stomach pain',n:'Very common'},{e:'Nausea',n:''},{e:'Headache, dizziness',n:''},
          {e:'Fluid retention, mild ankle swelling',n:''},{e:'Rise in blood pressure',n:'Small but real, and it matters in a hypertensive'}],
  serious:[{e:'Gastrointestinal bleeding or perforation',n:'Black tarry stools, vomiting blood, sudden severe abdominal pain. Can occur without any warning indigestion.'},
           {e:'Acute kidney injury',n:'Much more likely in dehydration, in the elderly, and in the triple-whammy combination'},
           {e:'Heart attack and stroke',n:'Small increase in risk, dose-related, higher with diclofenac than with most other NSAIDs'},
           {e:'Bronchospasm in susceptible asthmatics',n:'NSAID-exacerbated respiratory disease'},
           {e:'Heart failure decompensation',n:'Through salt and water retention'},
           {e:'Severe cutaneous adverse reactions',n:'Rare'}],
  inter:['warfarin','ace-inhibitor','diuretic','methotrexate','ssri','lithium','aspirin-low-dose','other-nsaid'],
  contra:[{c:'Active peptic ulcer or GI bleeding',n:'Absolute'},
          {c:'Established heart failure (moderate to severe), ischaemic heart disease, peripheral arterial or cerebrovascular disease',n:'Contraindicated for diclofenac specifically'},
          {c:'Severe kidney or liver impairment',n:''},
          {c:'Third trimester of pregnancy',n:'Premature closure of the ductus arteriosus, and kidney effects in the fetus'},
          {c:'Previous NSAID-triggered asthma, urticaria or angioedema',n:'Absolute — and it cross-reacts across the whole NSAID class'}],
  cautions:[{c:'Asthma',n:'Ask whether any painkiller has ever made the breathing worse'},
            {c:'Age over 65',n:'GI and renal risk both rise'},{c:'Hypertension',n:'Blood pressure control worsens'},
            {c:'Diabetes with kidney disease',n:''},{c:'Taking an ACE inhibitor and a diuretic',n:'See the interaction checker — this is the triple whammy'}],
  monitor:['Black stools, vomiting blood, new indigestion','Urine output, ankle swelling, weight gain','Blood pressure',
           'Kidney function and potassium in anyone at risk','Breathing, in an asthmatic'],
  counsel:'Take it with or just after food, at the lowest dose that works, for the shortest time. Stop and be seen for black stools, blood in vomit, much less urine, or swelling.',
  onset:'Indigestion: days. GI bleed: any time, including the first week. Kidney injury: often within days of starting, especially if the patient is dehydrated. Asthma reaction: within hours of a dose.',
  teach:'NSAIDs are the most quietly dangerous drugs on an over-the-counter shelf. The mechanism explains every '
      +'adverse effect: the chemical they block does three useful jobs — signalling pain, protecting the stomach '
      +'lining, and keeping blood flowing through the kidney. Block it and you get pain relief, a vulnerable stomach '
      +'and a kidney that cannot defend its own blood supply. Once you can recite that sentence you never again have '
      +'to memorise an NSAID side-effect list.'},

warfarin:{
  key:'warfarin', generic:'Warfarin', brandish:'Warf, Uniwarfin (examples)',
  cls:'Oral anticoagulant — vitamin K antagonist',
  what:'A blood thinner. It makes clots much less likely to form.',
  why:['Atrial fibrillation, to prevent stroke','Deep vein thrombosis and pulmonary embolism','Mechanical heart valves'],
  how:'Your liver needs vitamin K to build clotting proteins. Warfarin blocks the recycling of vitamin K, so the liver makes fewer working ones.',
  howTech:'Inhibits vitamin K epoxide reductase (VKORC1), reducing functional factors II, VII, IX and X and proteins C and S. Metabolised largely by CYP2C9.',
  common:[{e:'Bruising',n:'Expected to a degree'},{e:'Bleeding gums, nosebleeds',n:'Check the INR'},{e:'Heavier periods',n:''}],
  serious:[{e:'Major haemorrhage',n:'Intracranial, gastrointestinal, retroperitoneal. This is the reaction that kills.'},
           {e:'Warfarin-induced skin necrosis',n:'Rare, early, painful skin lesions'},
           {e:'Purple toe syndrome',n:'Rare'},{e:'Teratogenicity',n:'Contraindicated in pregnancy'}],
  inter:['amoxicillin','ciprofloxacin','fluconazole','metronidazole','diclofenac','aspirin-low-dose','carbamazepine','vitamin-k-foods','tramadol'],
  contra:[{c:'Pregnancy',n:'Crosses the placenta and is teratogenic'},{c:'Active major bleeding',n:''},
          {c:'Severe uncontrolled hypertension',n:''},{c:'Inability to attend for INR monitoring',n:'A practical contraindication and a real one'}],
  cautions:[{c:'Any new medicine at all, including over-the-counter and herbal',n:'Warfarin interacts with more drugs than almost anything else in the pharmacy'},
            {c:'Big changes in green vegetable intake',n:'Vitamin K in the diet works against it'},
            {c:'Alcohol, especially binge drinking',n:''},{c:'Older age, falls risk',n:''}],
  monitor:['INR — the number that tells you how thin the blood is','Any bleeding: gums, nose, urine, stool, unexplained bruising',
           'Sudden severe headache, or a fall involving the head','Every new medicine, checked against warfarin before it is dispensed'],
  counsel:'Never start any new medicine, including painkillers from a shop or herbal remedies, without asking first. Keep your green vegetable intake roughly steady rather than stopping or starting. Report any unusual bleeding.',
  onset:'INR shifts 2–5 days after an interacting drug starts, because the existing clotting factors have to be used up first. That lag is why the bleed arrives after the antibiotic course has finished.',
  teach:'Warfarin is the classic teaching drug for interactions, for two reasons. It has a narrow therapeutic index — '
      +'a little too much causes bleeding, a little too little causes a stroke — and its effect is measurable as a '
      +'single number, the INR. So every interaction shows up as a number moving. In pharmacovigilance terms, warfarin '
      +'is where you learn that the adverse reaction may belong to the *combination*, not to either drug alone.'},

metformin:{
  key:'metformin', generic:'Metformin', brandish:'Glycomet, Glucophage (examples)',
  cls:'Antidiabetic — biguanide',
  what:'The usual first tablet for type 2 diabetes. It lowers blood sugar.',
  why:['Type 2 diabetes','Polycystic ovary syndrome, sometimes','Prediabetes, in some guidelines'],
  how:'It makes the liver release less stored sugar and helps the body respond to its own insulin better. Importantly, it does not force the pancreas to release insulin — so on its own it very rarely causes a low sugar.',
  howTech:'Reduces hepatic gluconeogenesis and improves peripheral insulin sensitivity, largely via AMPK-dependent pathways. Not an insulin secretagogue.',
  common:[{e:'Diarrhoea',n:'Very common at the start and on dose increases'},{e:'Nausea, metallic taste',n:''},
          {e:'Abdominal discomfort, loss of appetite',n:'Usually settles over 1–2 weeks'}],
  serious:[{e:'Lactic acidosis',n:'Rare but often fatal. Almost always when metformin accumulates — acute kidney injury, dehydration, sepsis, a contrast scan, severe illness. Deep rapid breathing, vomiting, muscle pain, drowsiness.'},
           {e:'Vitamin B12 deficiency',n:'With long-term use. Anaemia, and numbness or tingling in the feet.'}],
  inter:['contrast-media','ace-inhibitor','diuretic','alcohol','glimepiride'],
  contra:[{c:'eGFR below 30 mL/min/1.73m²',n:'Absolute'},{c:'Acute metabolic acidosis, including diabetic ketoacidosis',n:''},
          {c:'Acute conditions that can damage the kidney',n:'Dehydration, severe infection, shock'}],
  cautions:[{c:'eGFR 30–45',n:'Reduced dose, and review'},{c:'Iodinated contrast imaging',n:'Withhold around the procedure and restart when kidney function is confirmed stable'},
            {c:'Vomiting or diarrhoea illness',n:'Sick-day rules — hold it while dehydrated'},{c:'Heavy alcohol use',n:''}],
  monitor:['Kidney function at least yearly, more often if it is borderline','B12 if long-term, or if there is anaemia or neuropathy',
           'Sick-day advice understood: hold it if dehydrated'],
  counsel:'Take it with food to reduce the stomach upset, and it usually settles. Stop it and get advice if you have vomiting or diarrhoea and cannot keep fluids down. It should not cause a low sugar on its own.',
  onset:'Gut effects: first days to two weeks. Lactic acidosis: whenever the kidney fails, not on a fixed schedule from starting.',
  teach:'Metformin matters for a beginner because of one sentence: it does not make the pancreas release insulin, '
      +'so it is not the usual cause of hypoglycaemia. When a patient on metformin plus something else has a low '
      +'sugar, the "something else" is nearly always the suspect drug. That single fact solves a great many exam '
      +'cases and a great many real ones.'},

glimepiride:{
  key:'glimepiride', generic:'Glimepiride', brandish:'Amaryl, Glimy (examples)',
  cls:'Antidiabetic — sulfonylurea',
  what:'A tablet for type 2 diabetes that makes the pancreas release more insulin.',
  why:['Type 2 diabetes, usually added when metformin alone is not enough'],
  how:'It squeezes insulin out of the pancreas whether or not you have just eaten. That is exactly why it can push the sugar too low.',
  howTech:'Closes ATP-sensitive potassium channels on pancreatic beta cells, depolarising the membrane and triggering insulin release independently of glucose concentration.',
  common:[{e:'Hypoglycaemia',n:'THE characteristic reaction. Sweating, shakiness, hunger, palpitations, confusion, dizziness, falls.'},
          {e:'Weight gain',n:''},{e:'Nausea',n:''}],
  serious:[{e:'Severe or prolonged hypoglycaemia',n:'Seizure, coma, injury from a fall, and occasionally death. In the elderly and in kidney impairment it can last for many hours and recur after treatment.'},
           {e:'Hyponatraemia (SIADH)',n:'Uncommon'},{e:'Cholestatic jaundice, blood dyscrasias',n:'Rare'},
           {e:'Severe cutaneous adverse reactions',n:'Rare; sulfonamide-related structure'}],
  inter:['ace-inhibitor','beta-blocker','fluconazole','alcohol','diclofenac','metformin'],
  contra:[{c:'Severe kidney or liver impairment',n:'The drug accumulates and the hypoglycaemia becomes prolonged'},
          {c:'Type 1 diabetes, diabetic ketoacidosis',n:''},{c:'Pregnancy and breastfeeding',n:''}],
  cautions:[{c:'Age over 65',n:'A recognised high-risk group. Lower starting dose, and consider whether a sulfonylurea is the right choice at all.'},
            {c:'Irregular meals, fasting, Ramadan, alcohol',n:'All raise the hypoglycaemia risk'},
            {c:'Taking a beta-blocker',n:'It masks the warning symptoms — see the interaction checker'},
            {c:'Declining kidney function',n:'A dose that was safe last year may not be safe now'}],
  monitor:['Blood glucose, and specifically any reading below 70 mg/dL (3.9 mmol/L)','Symptoms of low sugar, and whether the patient recognises them',
           'Dizziness, falls, confusion — especially in an older patient','Kidney function','Meal pattern and any fasting'],
  counsel:'Do not skip meals. Carry glucose or sugar. Learn the warning signs: sweating, shakiness, hunger, palpitations, feeling confused. Dizziness is a warning sign, not just old age.',
  onset:'Hypoglycaemia can occur from the first dose, and typically becomes a problem within days to weeks of starting or of a dose increase — or when the kidney function falls.',
  teach:'Sulfonylureas cause more hospital admissions for drug-related harm in older people than almost anything '
      +'else except anticoagulants. The reason is that the harm looks like ordinary ageing: dizziness, a fall, a bit '
      +'of confusion. Nobody reports "dizziness" as an adverse drug reaction. That is the trap this workshop is built '
      +'around, and why the final case is a 67-year-old who feels dizzy.'},

enalapril:{
  key:'enalapril', generic:'Enalapril (an ACE inhibitor)', brandish:'Envas, Enapril (examples)',
  cls:'Antihypertensive — angiotensin-converting enzyme inhibitor',
  what:'A blood pressure tablet. Also protects the heart and the kidneys in several conditions.',
  why:['High blood pressure','Heart failure','After a heart attack','Diabetic kidney disease, to protect the kidney'],
  how:'It blocks the making of a hormone that tightens blood vessels, so the vessels relax and the pressure falls.',
  howTech:'Inhibits ACE, reducing angiotensin II formation — vasodilatation, reduced aldosterone, reduced intraglomerular pressure. Also reduces bradykinin breakdown, which explains the cough.',
  common:[{e:'Dry, tickly, persistent cough',n:'Very common and very often missed as an adverse reaction. Worse lying down. Usually starts within weeks but can appear months later.'},
          {e:'Dizziness, especially on standing',n:'First-dose and dose-increase effect'},{e:'Rise in potassium',n:''},
          {e:'Rise in creatinine',n:'A small early rise is expected; a large one is not'},{e:'Taste disturbance',n:''}],
  serious:[{e:'Angioedema',n:'Swelling of lips, tongue, face or throat. Can obstruct the airway. May appear after months or years of uneventful treatment, which is why it gets attributed to food.'},
           {e:'Acute kidney injury',n:'Especially with an NSAID and a diuretic, or with renal artery stenosis'},
           {e:'Severe hyperkalaemia',n:'Arrhythmia risk'},{e:'Fetal toxicity',n:'Contraindicated in pregnancy'},
           {e:'Symptomatic hypotension',n:'In dehydration or heart failure'}],
  inter:['diclofenac','diuretic','potassium-supplement','lithium','glimepiride'],
  contra:[{c:'Pregnancy',n:'Absolute — fetal renal damage and death'},{c:'Previous angioedema on an ACE inhibitor',n:'Absolute'},
          {c:'Bilateral renal artery stenosis',n:''}],
  cautions:[{c:'Existing kidney impairment',n:'Check function and potassium after starting'},
            {c:'On a diuretic, or dehydrated',n:'Hypotension risk'},{c:'Taking an NSAID',n:'See the triple whammy'},
            {c:'Women who might become pregnant',n:'Discuss it before, not after'}],
  monitor:['Creatinine, eGFR and potassium — before starting and 1–2 weeks after any change','Blood pressure sitting and standing',
           'Ask directly about a dry cough at every review','Any facial, lip or tongue swelling — treat as an emergency'],
  counsel:'A dry irritating cough that will not go away may be the tablet, not an infection — tell us rather than buying cough syrup. Any swelling of the lips, tongue or face is an emergency. Tell us at once if you may be pregnant.',
  onset:'Cough: weeks to months, occasionally over a year. Angioedema: most in the first weeks, but it can genuinely be years. Kidney effects: days to two weeks after starting or after adding an NSAID.',
  teach:'The ACE inhibitor cough is the best first example of an adverse drug reaction hiding in plain sight, because '
      +'the patient does not connect a cough to a blood pressure tablet and neither does anybody else. Patients get '
      +'cough syrups, antibiotics, chest X-rays and referrals for something that stops within a week or two of '
      +'stopping the tablet. Learning to ask "when did the cough start, and what started just before it" is the whole '
      +'skill of pharmacovigilance in miniature.'},

atorvastatin:{
  key:'atorvastatin', generic:'Atorvastatin', brandish:'Atorva, Lipitor (examples)',
  cls:'Lipid-lowering — HMG-CoA reductase inhibitor (a statin)',
  what:'A tablet that lowers cholesterol and reduces the risk of heart attack and stroke.',
  why:['High cholesterol','After a heart attack or stroke','Diabetes with cardiovascular risk'],
  how:'It slows the liver enzyme that builds cholesterol, so the liver pulls more cholesterol out of the blood.',
  howTech:'Competitively inhibits HMG-CoA reductase; upregulated hepatic LDL receptors clear circulating LDL. Metabolised by CYP3A4.',
  common:[{e:'Muscle aches',n:'Common, usually mild and often not actually the statin — but always worth taking seriously'},
          {e:'Headache, nausea',n:''},{e:'Mild rise in liver enzymes',n:'Usually transient and not a reason to stop'},
          {e:'Small rise in blood sugar',n:''}],
  serious:[{e:'Rhabdomyolysis',n:'Severe muscle pain and weakness with dark cola-coloured urine, and kidney failure. Rare, and the risk is multiplied by interacting drugs.'},
           {e:'Myopathy with raised creatine kinase',n:''},{e:'Autoimmune myositis',n:'Very rare'},{e:'Liver injury',n:'Rare'}],
  inter:['clarithromycin','fluconazole','grapefruit','amiodarone','fibrate'],
  contra:[{c:'Active liver disease',n:''},{c:'Pregnancy and breastfeeding',n:''}],
  cautions:[{c:'Hypothyroidism, alcohol excess, kidney impairment',n:'All raise the myopathy risk'},
            {c:'Any new CYP3A4 inhibitor',n:'Check before dispensing'},{c:'Older, frail, low body weight',n:''}],
  monitor:['Muscle pain, tenderness or weakness — and ask whether the urine has darkened','Creatine kinase if muscle symptoms appear',
           'Liver function before starting','A new interacting antibiotic or antifungal'],
  counsel:'Muscle pain with dark urine needs to be seen the same day. Tell any prescriber you are on a statin before you take a new antibiotic.',
  onset:'Muscle symptoms: usually within weeks of starting or of a dose increase, or within days of an interacting drug being added.',
  teach:'Statins are useful here as a contrast case. Muscle ache is a common complaint in the general population, so '
      +'a patient on a statin with aching legs is the standard example of "event, but is it a reaction?". The answer '
      +'comes from timing, from whether anything else was added recently, and from one objective test. That is the '
      +'reasoning pattern, not the drug, that you are meant to take away.'},

ciprofloxacin:{
  key:'ciprofloxacin', generic:'Ciprofloxacin', brandish:'Ciplox, Cifran (examples)',
  cls:'Antibiotic — fluoroquinolone',
  what:'A broad antibiotic, used when narrower ones will not do.',
  why:['Urinary infections','Some gut infections','Typhoid','Certain bone, joint and prostate infections'],
  how:'It breaks the machinery bacteria use to copy their own DNA, so they cannot divide.',
  howTech:'Inhibits bacterial DNA gyrase and topoisomerase IV. Inhibits human CYP1A2, which explains several interactions.',
  common:[{e:'Nausea, diarrhoea',n:''},{e:'Headache, dizziness',n:''},{e:'Sleep disturbance, restlessness',n:''},{e:'Rash, photosensitivity',n:''}],
  serious:[{e:'Tendon pain and rupture, classically the Achilles',n:'Can occur within days and up to months after the course. Higher risk over 60, on a corticosteroid, or after a transplant.'},
           {e:'Peripheral neuropathy',n:'May be irreversible. Numbness, tingling, burning pain.'},
           {e:'Central nervous system effects',n:'Confusion, agitation, psychosis, seizures'},
           {e:'QT prolongation and arrhythmia',n:''},{e:'Aortic aneurysm and dissection',n:'Rare'},
           {e:'C. difficile colitis',n:''},{e:'Tendinitis-like and neuropathic symptoms that persist',n:'The reason regulators restricted this class'}],
  inter:['warfarin','theophylline','tizanidine','antacid-calcium-iron','nsaid-seizure','corticosteroid'],
  contra:[{c:'Previous tendon disorder with a quinolone',n:'Absolute'},{c:'Co-administration with tizanidine',n:'Absolute'},
          {c:'Myasthenia gravis',n:'Can worsen it severely'}],
  cautions:[{c:'Age over 60',n:'Tendon risk'},{c:'On a corticosteroid',n:'Tendon risk multiplied'},
            {c:'Epilepsy or a lowered seizure threshold',n:''},{c:'Prolonged QT, or other QT-prolonging drugs',n:''},
            {c:'Children and adolescents',n:'Generally avoided'}],
  monitor:['New heel, ankle or shoulder pain — stop the drug and get it seen','Numbness, tingling or burning in the hands or feet',
           'Confusion or agitation, especially in an older patient','Separate from antacids, calcium, iron and zinc by at least two hours'],
  counsel:'Stop taking it and get advice if you develop tendon pain, or pins and needles. Do not take it within two hours of milk, antacids or iron tablets — they stop it being absorbed.',
  onset:'Tendon problems: days into the course, and up to several months after it. CNS effects: often the first days.',
  teach:'Fluoroquinolones are the modern case study in how pharmacovigilance actually changes practice. The serious '
      +'reactions — tendon rupture, lasting nerve damage — were not obvious from the trials. They came out of '
      +'spontaneous reports, accumulating over years, which is exactly the process you are being taught. Regulators '
      +'worldwide then restricted a very widely used class of antibiotic on that evidence.'},

carbamazepine:{
  key:'carbamazepine', generic:'Carbamazepine', brandish:'Tegretol, Mazetol (examples)',
  cls:'Antiepileptic — also a mood stabiliser and used for nerve pain',
  what:'A tablet that calms overactive electrical signalling in nerves.',
  why:['Epilepsy','Trigeminal neuralgia','Bipolar disorder'],
  how:'It holds sodium channels in nerve cells shut for longer, so nerves cannot fire repeatedly.',
  howTech:'Use-dependent blockade of voltage-gated sodium channels. A potent inducer of CYP3A4 and other enzymes, and an inducer of its own metabolism.',
  common:[{e:'Drowsiness, dizziness, unsteadiness',n:'Dose-related, worst early'},{e:'Double or blurred vision',n:'A sign the level is too high'},
          {e:'Nausea',n:''},{e:'Low sodium',n:'Common, and easy to miss — confusion, falls, seizures'}],
  serious:[{e:'Severe cutaneous adverse reactions — SJS, TEN, DRESS',n:'The reaction this drug is known for. Strongly linked to HLA-B*15:02, which is carried much more often in South, Southeast and East Asian populations. Usually in the first eight weeks.'},
           {e:'Aplastic anaemia and agranulocytosis',n:'Rare. Fever, sore throat, mouth ulcers, unexplained bruising.'},
           {e:'Liver injury',n:''},{e:'Severe hyponatraemia',n:''},{e:'Teratogenicity',n:'Neural tube and other defects'}],
  inter:['oral-contraceptive','warfarin','atorvastatin-inducer','clarithromycin','valproate'],
  contra:[{c:'Previous severe skin reaction to carbamazepine',n:'Absolute'},{c:'Bone marrow depression',n:''},
          {c:'AV conduction block',n:''}],
  cautions:[{c:'South, Southeast or East Asian ancestry',n:'HLA-B*15:02 testing is recommended before starting in several guidelines'},
            {c:'Women of childbearing age',n:'Teratogenic, AND it makes hormonal contraception fail'},
            {c:'Any rash in the first two months',n:'Treat as potentially serious until proved otherwise'}],
  monitor:['Any rash in the first eight weeks — with fever, mouth or eye involvement, or skin pain, this is an emergency',
           'Full blood count, sodium, liver function','Double vision or unsteadiness','Contraception, if relevant'],
  counsel:'If you get a rash, especially with fever, mouth ulcers or sore eyes, stop and be seen the same day. This tablet stops the contraceptive pill working properly.',
  onset:'Severe skin reactions: typically 1–8 weeks from starting, rarely later. Low sodium: weeks to months. Double vision: whenever the level rises.',
  teach:'Carbamazepine teaches two things at once. First, that a rash is not automatically trivial — the same word '
      +'covers a nuisance and a life-threatening emergency, and the difference is fever, mucosal involvement and '
      +'skin pain. Second, that genetics can decide who reacts: the HLA-B*15:02 link is one of the clearest examples '
      +'in all of pharmacovigilance, and it is particularly relevant to Indian and Southeast Asian patients.'},

propranolol:{
  key:'propranolol', generic:'Propranolol', brandish:'Ciplar, Inderal (examples)',
  cls:'Non-selective beta-blocker',
  what:'A tablet that slows the heart and reduces the effect of adrenaline.',
  why:['Tremor','Migraine prevention','Performance anxiety','Overactive thyroid symptoms','Portal hypertension'],
  how:'It blocks the receptors adrenaline uses. Non-selective means it blocks them in the lungs too, not just the heart — which is the problem in asthma.',
  howTech:'Non-selective beta-1 and beta-2 adrenoceptor antagonist. Beta-2 blockade in bronchial smooth muscle causes bronchoconstriction; it also blunts the adrenergic warning symptoms and the glycogenolytic response to hypoglycaemia.',
  common:[{e:'Tiredness, cold hands and feet',n:''},{e:'Slow pulse',n:''},{e:'Dizziness',n:''},{e:'Vivid dreams, low mood',n:''}],
  serious:[{e:'Severe bronchospasm in asthma',n:'Can be fatal. This is why non-selective beta-blockers are avoided in asthma.'},
           {e:'Masked and prolonged hypoglycaemia',n:'In a patient on insulin or a sulfonylurea, it removes the sweating and palpitations that warn them'},
           {e:'Symptomatic bradycardia, heart block',n:''},{e:'Heart failure decompensation if started wrongly',n:''}],
  inter:['glimepiride','insulin','verapamil-diltiazem','salbutamol'],
  contra:[{c:'Asthma',n:'Contraindicated for non-selective beta-blockers'},{c:'Second or third degree AV block',n:''},
          {c:'Severe bradycardia, uncontrolled heart failure',n:''}],
  cautions:[{c:'Diabetes on insulin or a sulfonylurea',n:'Masks the warning signs of a low sugar'},
            {c:'COPD',n:'Cardioselective agents preferred, and cautiously'},{c:'Peripheral arterial disease',n:''},
            {c:'Never stop abruptly in ischaemic heart disease',n:'Rebound angina and infarction'}],
  monitor:['Breathing and wheeze in anyone with airway disease','Pulse and blood pressure',
           'In a diabetic: whether they can still feel a low sugar coming'],
  counsel:'Tell any prescriber if you have asthma. If you are diabetic, this tablet can hide the early warning signs of a low sugar, so check your sugar rather than waiting to feel it. Never stop it suddenly.',
  onset:'Bronchospasm: within hours of a dose in a susceptible asthmatic. Masked hypoglycaemia: from the first dose.',
  teach:'This is the cleanest drug–disease interaction in the syllabus. The drug is not dangerous; the drug in an '
      +'asthmatic is. Nothing about the prescription looks wrong until you know what else the patient has. That is '
      +'the point of asking about medical history before dispensing, and the point of Station 4.'},

metoclopramide:{
  key:'metoclopramide', generic:'Metoclopramide', brandish:'Perinorm, Reglan (examples)',
  cls:'Antiemetic and prokinetic — dopamine D2 antagonist',
  what:'An injection or tablet for nausea and vomiting. It also helps the stomach empty.',
  why:['Nausea and vomiting','Gastroparesis','With migraine treatment'],
  how:'It blocks dopamine, which both settles the vomiting centre and speeds the stomach up. Blocking dopamine elsewhere in the brain is what causes the movement problems.',
  howTech:'Central and peripheral D2 antagonism. Nigrostriatal D2 blockade produces extrapyramidal reactions; it crosses the blood–brain barrier readily, and more so in the young.',
  common:[{e:'Drowsiness',n:''},{e:'Restlessness',n:''},{e:'Diarrhoea',n:''}],
  serious:[{e:'Acute dystonic reaction',n:'Neck twisting, jaw and tongue spasm, eyes rolled upward, fixed stare. Frightening, often mistaken for a seizure or a psychiatric episode, and commonest in children and young adults within 24–72 hours.'},
           {e:'Tardive dyskinesia',n:'Involuntary movements that may be permanent. The reason treatment is limited to five days.'},
           {e:'Parkinsonism, and worsening of existing Parkinson’s disease',n:''},
           {e:'Neuroleptic malignant syndrome',n:'Rare'},{e:'Raised prolactin',n:''}],
  inter:['levodopa','antipsychotic','ssri'],
  contra:[{c:'Parkinson’s disease',n:'It undoes the treatment'},{c:'Previous dystonic reaction or tardive dyskinesia',n:''},
          {c:'Phaeochromocytoma, bowel obstruction or perforation',n:''}],
  cautions:[{c:'Children and young adults',n:'Much higher dystonia risk; use restricted'},
            {c:'Treatment beyond five days',n:'Not recommended'},{c:'Kidney or liver impairment',n:'Dose reduction'}],
  monitor:['Any abnormal movement, neck stiffness or jaw spasm — and ask when the last dose was','Total duration of treatment',
           'In a Parkinson’s patient, whether the tremor or stiffness has worsened'],
  counsel:'This is for a few days only. If you get neck stiffness, jaw or tongue spasm, or your eyes roll up, come in at once — it is treatable and it is caused by the medicine.',
  onset:'Dystonia: usually within 24–72 hours of the first dose. Tardive dyskinesia: after prolonged use.',
  teach:'Metoclopramide produces the most theatrical adverse reaction a pharmacy student will see, and the one most '
      +'often misdiagnosed. A teenager arrives with their neck twisted and their tongue protruding after an injection '
      +'for vomiting, and is worked up for a neurological catastrophe. The treatment is an anticholinergic and the '
      +'diagnosis is one question: what were they given, and when.'}
};

/* ==================================================================== *
 * 2 · DRUG–DRUG INTERACTIONS                                           *
 *                                                                      *
 * Each entry is written in the order the student is asked to think:    *
 *   pair -> mechanism -> effect -> clinical consequence -> what to do  *
 *                                                                      *
 * rag: 'green' | 'amber' | 'red', matching the traffic lights on the   *
 * checker screen. The rating is about what the PHARMACIST must do, not *
 * about how interesting the pharmacology is.                           *
 * ==================================================================== */
var RAG = {
  green:{k:'green', dot:'🟢', label:'No significant interaction identified',
         doing:'Dispense as prescribed. Nothing further is needed for this pair.'},
  amber:{k:'amber', dot:'🟡', label:'Monitor — potential interaction',
         doing:'It can be used, but something has to change: monitoring, a dose, timing, or counselling.'},
  red:{k:'red', dot:'🔴', label:'Clinically important interaction',
       doing:'Do not dispense without speaking to the prescriber. An alternative is usually needed.'}
};

var INTERACTIONS = [
{a:'amoxicillin', b:'warfarin', rag:'amber',
 mech:'Antibiotics kill the gut bacteria that make vitamin K, and the infection itself changes how warfarin is handled.',
 mechTech:'Reduced gut flora synthesis of vitamin K2, plus illness-related reduction in clotting factor synthesis and possible protein-binding displacement.',
 effect:'Warfarin’s effect increases. The INR rises.',
 conseq:'Bleeding — gums, nose, bruising, and occasionally something much worse.',
 action:['Do not refuse the antibiotic — the infection needs treating.','Arrange an INR check within 3–5 days of starting.',
         'Warn the patient specifically about bleeding gums, nosebleeds and unusual bruising.',
         'Remember the INR may keep drifting after the course has finished.'],
 pearl:'The bleed often arrives AFTER the antibiotic course ends, because warfarin acts with a 2–5 day lag. Students who only look for reactions during treatment miss this one.'},

{a:'amoxicillin', b:'methotrexate', rag:'red',
 mech:'Penicillins and methotrexate leave the body by the same route out of the kidney, and they compete for it.',
 mechTech:'Penicillins inhibit renal tubular secretion of methotrexate, reducing its clearance and raising plasma levels.',
 effect:'Methotrexate builds up.',
 conseq:'Mouth ulcers, bone marrow suppression, low blood counts, liver and kidney toxicity. Potentially fatal.',
 action:['Contact the prescriber before dispensing.','Choose an antibiotic that is not a penicillin where possible.',
         'If it must be given, full blood count monitoring and specialist advice.',
         'Check the methotrexate is weekly, not daily — the commonest fatal prescribing error in the pharmacy.'],
 pearl:'Methotrexate is weekly. Any methotrexate prescription written as a daily dose is an error to stop at the counter, interaction or no interaction.'},

{a:'amoxicillin', b:'allopurinol', rag:'amber',
 mech:'Taking these two together makes a rash considerably more likely than either alone.',
 mechTech:'A well-documented increase in the incidence of maculopapular rash with ampicillin or amoxicillin plus allopurinol; the mechanism is not fully established.',
 effect:'Higher chance of a drug rash.',
 conseq:'Usually a nuisance, but it gets recorded as penicillin allergy for life — which then removes a whole useful antibiotic class from that patient forever.',
 action:['Warn the patient that a rash is more likely with the combination.',
         'If a rash appears, describe it properly in the notes: what it looked like, when it started, whether it itched, whether there were blisters.',
         'Do not write "penicillin allergy" in a record without that description.'],
 pearl:'A badly documented rash is itself a patient-safety problem. "Allergy" written without a description costs that patient a better antibiotic for the rest of their life.'},

{a:'diclofenac', b:'warfarin', rag:'red',
 mech:'One thins the blood; the other damages the stomach lining and stops platelets working properly. Both push the same way.',
 mechTech:'Additive bleeding risk: NSAID-induced gastric mucosal injury and COX-1-mediated platelet inhibition on top of anticoagulation. Some protein-binding displacement.',
 effect:'Much higher bleeding risk, especially from the stomach.',
 conseq:'Gastrointestinal haemorrhage. This combination is a leading cause of drug-related emergency admission worldwide.',
 action:['Do not dispense together without contacting the prescriber.','Offer paracetamol as the alternative analgesic.',
         'If an NSAID is unavoidable, a proton pump inhibitor and close INR monitoring are the minimum.',
         'Ask what the patient has bought over the counter — this pair is often self-inflicted.'],
 pearl:'Patients do not think of a painkiller from a shop as a medicine. Always ask about over-the-counter purchases by name, not by asking "any other medicines?".'},

{a:'diclofenac', b:'ace-inhibitor', rag:'amber',
 mech:'The NSAID takes away the kidney’s ability to widen the vessel bringing blood in; the ACE inhibitor takes away its ability to narrow the vessel taking blood out. The kidney loses both of its defences.',
 mechTech:'NSAIDs block prostaglandin-mediated afferent arteriolar vasodilatation; ACE inhibitors block angiotensin-II-mediated efferent constriction. Glomerular filtration pressure cannot be maintained.',
 effect:'Falling kidney function, rising potassium, and worse blood pressure control.',
 conseq:'Acute kidney injury. Add a diuretic and it becomes the "triple whammy", with a well-documented sharp rise in risk.',
 action:['Check whether a diuretic is also on the list — if it is, escalate to red.','Check kidney function and potassium.',
         'Shortest possible NSAID course, or paracetamol instead.','Sick-day rules: hold all three if the patient becomes dehydrated.'],
 pearl:'ACE inhibitor + diuretic + NSAID = the triple whammy. Learn those three words. It is one of the most preventable causes of acute kidney injury in general practice.'},

{a:'diclofenac', b:'diuretic', rag:'amber',
 mech:'The NSAID makes the body hold on to salt and water, which is the opposite of what a diuretic is for.',
 mechTech:'Reduced renal prostaglandins cause sodium and water retention, antagonising diuretic and antihypertensive effect, and reducing renal perfusion in a volume-depleted patient.',
 effect:'The diuretic works less well. Kidney function may fall.',
 conseq:'Fluid overload, worsening heart failure, rising blood pressure, acute kidney injury.',
 action:['Check for an ACE inhibitor or ARB as well — the three together are the triple whammy.',
         'Weigh the patient and ask about ankle swelling and breathlessness.','Prefer paracetamol.'],
 pearl:'Ankle swelling in someone who has just started an NSAID is an adverse reaction, not a coincidence of the weather.'},

{a:'diclofenac', b:'methotrexate', rag:'red',
 mech:'The NSAID slows methotrexate’s exit through the kidney, so the methotrexate accumulates.',
 mechTech:'NSAIDs reduce renal tubular secretion and renal perfusion, decreasing methotrexate clearance — the risk is greatest at higher methotrexate doses.',
 effect:'Methotrexate toxicity.',
 conseq:'Bone marrow suppression, mucositis, and death in reported cases.',
 action:['Contact the prescriber.','Paracetamol instead.','Full blood count monitoring if the combination is unavoidable.'],
 pearl:'Two different drug classes reach methotrexate toxicity by the same route — the kidney. If you remember the route, you do not have to remember the list.'},

{a:'diclofenac', b:'ssri', rag:'amber',
 mech:'Both interfere with platelets, so the stomach bleeds more easily.',
 mechTech:'SSRIs deplete platelet serotonin and impair aggregation; combined with NSAID mucosal injury the upper GI bleeding risk rises several-fold.',
 effect:'Considerably higher risk of gastrointestinal bleeding.',
 conseq:'Upper GI haemorrhage — and this pair is extremely common because both drugs are so widely prescribed.',
 action:['Consider a proton pump inhibitor.','Counsel about black stools and vomiting blood.','Prefer paracetamol for the pain.'],
 pearl:'Nobody thinks of an antidepressant as a bleeding risk. This is a good example of an interaction you will only catch by checking, never by intuition.'},

{a:'diclofenac', b:'aspirin-low-dose', rag:'amber',
 mech:'Two drugs from the same family, so the stomach damage adds up — and the NSAID can get in the way of the aspirin’s heart protection.',
 mechTech:'Additive COX-1-mediated mucosal injury; some NSAIDs competitively hinder aspirin’s irreversible platelet COX-1 acetylation.',
 effect:'Higher GI bleeding risk, and possibly less cardioprotection.',
 conseq:'GI bleed; theoretical loss of the aspirin benefit the patient is taking it for.',
 action:['Gastroprotection.','Question whether the NSAID is needed at all.','Paracetamol first.'],
 pearl:'Low-dose aspirin is a medicine. Patients and students both routinely leave it off the list because it is "just a blood thinner" or "just 75 mg".'},

{a:'diclofenac', b:'other-nsaid', rag:'red',
 mech:'Two NSAIDs do not give more pain relief. They give more bleeding and more kidney damage.',
 mechTech:'No additive analgesic benefit above ceiling effect; fully additive COX-1 toxicity.',
 effect:'All of the harm, none of the extra benefit.',
 conseq:'GI bleeding and acute kidney injury.',
 action:['Never dispense two NSAIDs together. Stop one.',
         'Check the over-the-counter purchases and any topical or combination product — ibuprofen hides inside cold and flu preparations.',
         'Check pain-relief combination products for a second NSAID.'],
 pearl:'The second NSAID is nearly always one the patient bought themselves, in a cold remedy or a combination painkiller. Ask to see the packets.'},

{a:'diclofenac', b:'lithium', rag:'red',
 mech:'The NSAID slows lithium’s exit through the kidney, and lithium is dangerous the moment the level rises.',
 mechTech:'Reduced renal prostaglandins increase proximal tubular lithium reabsorption, raising serum lithium.',
 effect:'Lithium level rises.',
 conseq:'Tremor, vomiting, unsteadiness, confusion, seizures. Lithium toxicity is a medical emergency.',
 action:['Contact the prescriber before dispensing.','Paracetamol instead.','Lithium level check if it has already been taken.'],
 pearl:'Narrow therapeutic index drugs — lithium, warfarin, digoxin, methotrexate, phenytoin — are where interactions turn into admissions. Learn the list of five.'},

{a:'warfarin', b:'fluconazole', rag:'red',
 mech:'The antifungal switches off the liver enzyme that breaks warfarin down, so warfarin piles up.',
 mechTech:'Potent CYP2C9 inhibition markedly reduces S-warfarin clearance; INR rises steeply and often unpredictably.',
 effect:'INR rises sharply, sometimes to dangerous levels.',
 conseq:'Major haemorrhage.',
 action:['Contact the prescriber. Even a single high dose of fluconazole matters.','Pre-emptive warfarin dose reduction and an early INR check.',
         'Consider a topical antifungal instead where the indication allows.'],
 pearl:'"It was only one tablet for thrush" has caused fatal bleeds. Duration does not make an enzyme inhibitor safe.'},

{a:'warfarin', b:'ciprofloxacin', rag:'amber',
 mech:'Enzyme inhibition plus the gut-bacteria effect shared by all antibiotics.',
 mechTech:'CYP1A2 inhibition affects R-warfarin; combined with reduced vitamin K2 synthesis the INR rises.',
 effect:'INR rises.', conseq:'Bleeding.',
 action:['INR within 3–5 days.','Counsel about bleeding.','Watch for the tendon and neuropathy warnings for the quinolone itself.'],
 pearl:'Assume that any antibiotic will move the INR until you have checked it. That default is right far more often than it is wrong.'},

{a:'warfarin', b:'metronidazole', rag:'red',
 mech:'Strong inhibition of the enzyme that clears the active half of warfarin.',
 mechTech:'Potent CYP2C9 inhibition of S-warfarin metabolism.',
 effect:'Marked INR rise.', conseq:'Serious bleeding.',
 action:['Contact the prescriber.','Pre-emptive dose reduction and close INR monitoring.',
         'Remember the disulfiram-like alcohol reaction with metronidazole while you are counselling.'],
 pearl:'Metronidazole and fluconazole are the two "small course, big INR" traps. Neither looks like a dangerous prescription.'},

{a:'warfarin', b:'carbamazepine', rag:'red',
 mech:'This one goes the other way. Carbamazepine speeds the liver up, so warfarin is destroyed faster and stops working.',
 mechTech:'Potent CYP3A4/2C9 induction increases warfarin clearance; INR falls over 1–2 weeks and rebounds dangerously when the inducer stops.',
 effect:'INR falls. The blood is no longer thin enough.',
 conseq:'Clot, stroke or pulmonary embolism — the harm the warfarin was preventing.',
 action:['Contact the prescriber; the warfarin dose will need increasing, with frequent INR checks.',
         'Crucially, plan for the carbamazepine STOPPING — the INR then climbs and the patient bleeds.'],
 pearl:'An interaction that makes a drug FAIL is still an adverse drug reaction. Treatment failure gets reported far less often than it should be.'},

{a:'warfarin', b:'tramadol', rag:'amber',
 mech:'Tramadol raises the INR in some patients, for reasons that are not fully settled.',
 mechTech:'Reported INR elevation, possibly through CYP2D6/3A4-mediated effects; the interaction is inconsistent but well described.',
 effect:'INR may rise.', conseq:'Bleeding.',
 action:['INR check after starting.','Paracetamol is the safer first choice.'],
 pearl:'"Inconsistent" does not mean "ignore". It means monitor, because you cannot tell in advance which patient it will be.'},

{a:'warfarin', b:'vitamin-k-foods', rag:'amber',
 mech:'Green leafy vegetables contain vitamin K, which is exactly what warfarin is working against.',
 mechTech:'Dietary vitamin K1 competes with warfarin’s inhibition of vitamin K epoxide reductase.',
 effect:'A big increase in green vegetables weakens warfarin; suddenly stopping them strengthens it.',
 conseq:'Clot if the INR falls, bleeding if it rises.',
 action:['Do not tell the patient to avoid green vegetables. Tell them to keep the amount STEADY.',
         'Ask about fasting, festivals and diet changes at every INR review.'],
 pearl:'The advice "avoid green vegetables" is wrong and still gets given daily. Consistency, not avoidance, is the instruction.'},

{a:'atorvastatin', b:'clarithromycin', rag:'red',
 mech:'The antibiotic blocks the enzyme that clears the statin, so the statin level climbs and starts damaging muscle.',
 mechTech:'Potent CYP3A4 inhibition raises atorvastatin exposure several-fold, sharply increasing myopathy and rhabdomyolysis risk.',
 effect:'Statin level rises steeply.',
 conseq:'Muscle pain and weakness, rhabdomyolysis, acute kidney injury from myoglobin.',
 action:['Contact the prescriber. Standard practice is to withhold the statin for the few days of the antibiotic course, or use azithromycin instead.',
         'Counsel: muscle pain with dark urine means be seen the same day.'],
 pearl:'Stopping a statin for five days costs the patient almost nothing. Rhabdomyolysis costs them a kidney. This is the easiest good decision in the pharmacy.'},

{a:'atorvastatin', b:'grapefruit', rag:'amber',
 mech:'Grapefruit juice blocks the same enzyme in the gut wall.',
 mechTech:'Furanocoumarins irreversibly inhibit intestinal CYP3A4, increasing bioavailability. The effect lasts well beyond the drink.',
 effect:'Higher statin exposure.', conseq:'Muscle toxicity.',
 action:['Advise avoiding grapefruit and its juice.','Ask about it when a patient reports muscle aches — nobody volunteers fruit juice as a medicine.'],
 pearl:'Food and drink belong in a medication history. So do herbal products, tonics and supplements. If you only ask about "tablets" you will miss them.'},

{a:'atorvastatin', b:'fibrate', rag:'amber',
 mech:'Both can irritate muscle, so together the risk multiplies.',
 mechTech:'Additive myotoxicity; gemfibrozil also inhibits statin glucuronidation and raises exposure.',
 effect:'Higher myopathy risk.', conseq:'Rhabdomyolysis.',
 action:['Use the lowest effective statin dose; fenofibrate is preferred over gemfibrozil.','Counsel about muscle symptoms and dark urine.'],
 pearl:'Two drugs with the same toxicity are an interaction even when neither affects the other’s metabolism. Additive harm counts.'},

{a:'glimepiride', b:'ace-inhibitor', rag:'amber',
 mech:'ACE inhibitors improve insulin sensitivity a little, which can tip a patient on a sulfonylurea into a low sugar.',
 mechTech:'Improved insulin sensitivity plus reduced hepatic gluconeogenesis; recognised hypoglycaemia risk factor in combination with secretagogues.',
 effect:'Blood sugar may fall further than intended.',
 conseq:'Hypoglycaemia — sweating, shakiness, confusion, dizziness, falls.',
 action:['More frequent glucose monitoring after starting or increasing either drug.',
         'Counsel the patient on recognising and treating a low sugar.','Review the sulfonylurea dose, especially in an older patient.'],
 pearl:'In an older patient, hypoglycaemia presents as a fall or as confusion — not as the textbook sweating. Dizziness in a diabetic is a glucose reading waiting to be taken.'},

{a:'glimepiride', b:'beta-blocker', rag:'amber',
 mech:'The beta-blocker removes the warning symptoms of a low sugar, so the patient does not notice until they are much worse.',
 mechTech:'Beta-blockade blunts adrenergic warning symptoms (tremor, palpitations) and impairs the glycogenolytic recovery response. Sweating is typically preserved.',
 effect:'Hypoglycaemia becomes silent and recovery is slower.',
 conseq:'Severe hypoglycaemia with no warning: collapse, seizure, injury.',
 action:['Counsel that the usual warning signs may be absent — measure the glucose rather than waiting to feel it.',
         'Prefer a cardioselective beta-blocker where one is needed.','Teach that sweating usually remains as a clue.'],
 pearl:'An interaction can be dangerous by hiding a reaction rather than by causing one. That is a subtle idea and worth a minute of the workshop.'},

{a:'glimepiride', b:'fluconazole', rag:'red',
 mech:'The antifungal blocks the enzyme that clears the sulfonylurea, so it stays in the body much longer.',
 mechTech:'CYP2C9 inhibition substantially increases sulfonylurea exposure and half-life.',
 effect:'Prolonged, deep hypoglycaemia.',
 conseq:'Hypoglycaemia lasting many hours, recurring after treatment, requiring admission.',
 action:['Contact the prescriber.','Dose reduction and frequent glucose monitoring if unavoidable.','Topical antifungal where possible.'],
 pearl:'CYP2C9 is the enzyme behind warfarin, sulfonylureas and phenytoin. One enzyme, three narrow-margin drugs. Learning the enzyme is more efficient than learning the pairs.'},

{a:'glimepiride', b:'alcohol', rag:'amber',
 mech:'Alcohol stops the liver releasing its stored sugar, which is precisely the rescue mechanism a low sugar depends on.',
 mechTech:'Ethanol inhibits hepatic gluconeogenesis; hypoglycaemia may be delayed, prolonged and severe, and its symptoms are easily mistaken for intoxication.',
 effect:'Deeper and longer hypoglycaemia.',
 conseq:'Severe hypoglycaemia, often missed because it looks like drunkenness.',
 action:['Counsel: never drink on an empty stomach; eat carbohydrate with alcohol.','Warn family or friends that confusion may be a low sugar.'],
 pearl:'Anything that looks like something else — drunkenness, ageing, anxiety — is where adverse reactions go unreported. Always ask what medicines are involved.'},

{a:'metformin', b:'contrast-media', rag:'red',
 mech:'The contrast dye can injure the kidney, and metformin is cleared by the kidney. If the kidney stops, metformin accumulates.',
 mechTech:'Contrast-associated acute kidney injury reduces metformin clearance, allowing accumulation and lactic acidosis.',
 effect:'Metformin accumulates.',
 conseq:'Lactic acidosis — rare, and often fatal when it happens.',
 action:['Withhold metformin around the procedure as per local protocol.','Restart only when kidney function is confirmed stable.',
         'Make sure the patient knows to hold it, not just the notes.'],
 pearl:'This is a systems failure as much as a pharmacology one. The radiology list and the drug chart rarely talk to each other, and the pharmacist is often the only person who sees both.'},

{a:'ciprofloxacin', b:'theophylline', rag:'red',
 mech:'The antibiotic blocks the enzyme that clears theophylline, and theophylline is toxic as soon as the level rises.',
 mechTech:'CYP1A2 inhibition markedly raises theophylline concentration.',
 effect:'Theophylline level rises.', conseq:'Vomiting, arrhythmia, seizures.',
 action:['Contact the prescriber; choose another antibiotic.','Theophylline level and dose reduction if unavoidable.'],
 pearl:'Same enzyme, different victim. CYP1A2 inhibition by ciprofloxacin also affects caffeine — patients report palpitations and insomnia and blame the antibiotic, correctly.'},

{a:'ciprofloxacin', b:'tizanidine', rag:'red',
 mech:'Ciprofloxacin massively increases tizanidine levels.',
 mechTech:'CYP1A2 inhibition raises tizanidine exposure roughly ten-fold.',
 effect:'Severe hypotension and sedation.', conseq:'Collapse. This pair is formally contraindicated.',
 action:['Do not dispense. Contact the prescriber for an alternative.'],
 pearl:'A handful of pairs are absolutely contraindicated rather than merely risky. Knowing the short list is more useful than knowing a hundred amber ones.'},

{a:'ciprofloxacin', b:'antacid-calcium-iron', rag:'amber',
 mech:'Calcium, magnesium, iron and zinc grab the antibiotic in the gut so it never gets absorbed.',
 mechTech:'Chelation of the fluoroquinolone by divalent and trivalent cations markedly reduces bioavailability.',
 effect:'The antibiotic does not work.',
 conseq:'Treatment failure — and treatment failure of an infection is a reportable adverse outcome.',
 action:['Separate the doses by at least two hours.','Include milk, antacids, iron and multivitamins in the counselling, not just prescribed medicines.'],
 pearl:'An interaction that causes treatment failure produces no symptom to report, which is why these are so under-recognised. The patient simply does not get better.'},

{a:'ciprofloxacin', b:'corticosteroid', rag:'amber',
 mech:'Both damage tendon tissue, and together the risk of a rupture rises sharply.',
 mechTech:'Additive tendon toxicity; the combination is a recognised risk factor for Achilles tendon rupture, particularly over 60.',
 effect:'Much higher tendon rupture risk.', conseq:'Achilles rupture, sometimes needing surgery.',
 action:['Avoid the combination in older patients where an alternative exists.','Counsel: stop the antibiotic and be seen for any new heel or ankle pain.'],
 pearl:'The patient will not connect heel pain to an antibiotic. Nor will most clinicians. You have to ask the question in the other direction: what did they start recently?'},

{a:'ciprofloxacin', b:'nsaid-seizure', rag:'amber',
 mech:'Both lower the threshold at which the brain will have a seizure.',
 mechTech:'Additive GABA-A antagonism at the receptor level.',
 effect:'Higher seizure risk.', conseq:'Seizure, particularly in epilepsy or renal impairment.',
 action:['Caution in epilepsy.','Counsel about confusion, agitation and any fit.'],
 pearl:'Central nervous system effects of antibiotics are routinely blamed on the infection. In an older patient, new confusion after a new antibiotic is an adverse reaction until proved otherwise.'},

{a:'carbamazepine', b:'oral-contraceptive', rag:'red',
 mech:'Carbamazepine speeds the liver up so much that it destroys the contraceptive hormones before they can work.',
 mechTech:'Potent CYP3A4 induction accelerates oestrogen and progestogen metabolism; contraceptive efficacy is lost.',
 effect:'The pill stops working.',
 conseq:'Unintended pregnancy — while taking a drug that causes birth defects. Both halves of that sentence matter.',
 action:['Contact the prescriber and discuss a non-hormonal or non-affected method, such as a copper IUD.',
         'Counsel the patient directly. She must know, not just the notes.','Discuss folic acid and pre-conception advice.'],
 pearl:'Contraceptive failure caused by an interaction is an adverse drug reaction and is reportable. Almost nobody reports it. Consider that the next time you are told spontaneous reporting captures everything.'},

{a:'carbamazepine', b:'clarithromycin', rag:'red',
 mech:'The antibiotic blocks the enzyme that clears carbamazepine, so the level climbs.',
 mechTech:'CYP3A4 inhibition raises carbamazepine concentration into the toxic range.',
 effect:'Carbamazepine toxicity.', conseq:'Double vision, unsteadiness, drowsiness, vomiting, confusion.',
 action:['Contact the prescriber; use an alternative antibiotic such as amoxicillin if appropriate.','Carbamazepine level if the patient is symptomatic.'],
 pearl:'Double vision and unsteadiness in an epileptic patient on a new antibiotic is not "the infection". It is a drug level, and it is measurable.'},

{a:'carbamazepine', b:'atorvastatin-inducer', rag:'amber',
 mech:'Carbamazepine speeds up the clearance of the statin, so the cholesterol control is lost.',
 mechTech:'CYP3A4 induction reduces statin exposure and lipid-lowering effect.',
 effect:'The statin works less well.', conseq:'Loss of cardiovascular protection — silent, and only visible in a lipid profile.',
 action:['Monitor lipids and expect to need a higher dose or a statin less dependent on CYP3A4.'],
 pearl:'Induction interactions are invisible. Nobody feels their statin failing. Only a blood test or, years later, an event will show it.'},

{a:'propranolol', b:'salbutamol', rag:'red',
 mech:'The reliever opens the airways through exactly the receptor propranolol is blocking.',
 mechTech:'Non-selective beta-blockade antagonises beta-2 mediated bronchodilatation, and can precipitate bronchospasm in its own right.',
 effect:'The inhaler stops working properly.',
 conseq:'Severe asthma attack that does not respond to the usual rescue treatment.',
 action:['Do not dispense a non-selective beta-blocker to an asthmatic. Contact the prescriber.',
         'If a beta-blocker is genuinely needed, a cardioselective one under specialist supervision.'],
 pearl:'The presence of a salbutamol inhaler on a medication list is a diagnosis of asthma, written in drug form. Read medication lists for what they tell you about the patient.'},

{a:'propranolol', b:'verapamil-diltiazem', rag:'red',
 mech:'Both slow the heart and both weaken its contraction. Together they can stop it slowing safely.',
 mechTech:'Additive negative chronotropic, dromotropic and inotropic effects; risk of severe bradycardia, AV block and asystole.',
 effect:'Dangerous slowing of the heart.', conseq:'Profound bradycardia, heart block, heart failure, cardiac arrest.',
 action:['Do not dispense together without specialist confirmation.','Contact the prescriber.'],
 pearl:'When two drugs do the same thing to the same organ, expect the harm to add up even if neither touches the other’s metabolism.'},

{a:'metoclopramide', b:'levodopa', rag:'red',
 mech:'Metoclopramide blocks dopamine. Levodopa is given to increase dopamine. They cancel each other out.',
 mechTech:'Central D2 antagonism directly opposes dopaminergic therapy and worsens parkinsonian motor symptoms.',
 effect:'Parkinson’s control is lost.', conseq:'Severe worsening of rigidity and tremor; falls; loss of mobility.',
 action:['Do not dispense. Contact the prescriber.','Domperidone is the usual antiemetic alternative in Parkinson’s disease.'],
 pearl:'Pharmacological opposites prescribed together usually mean two clinicians who have not seen each other’s notes. The pharmacist is the last person who can catch it.'},

{a:'metoclopramide', b:'antipsychotic', rag:'amber',
 mech:'Both block dopamine, so movement disorders become much more likely.',
 mechTech:'Additive D2 blockade increases extrapyramidal reaction and neuroleptic malignant syndrome risk.',
 effect:'Higher risk of dystonia and other movement reactions.', conseq:'Acute dystonia; tardive dyskinesia with longer use.',
 action:['Avoid where possible; limit duration strictly.','Counsel about abnormal movements and jaw or neck spasm.'],
 pearl:'The five-day limit on metoclopramide exists because of accumulated spontaneous reports. Every restriction like it began as somebody filling in a form.'},

{a:'glimepiride', b:'metformin', rag:'green',
 mech:'This is a deliberate and standard combination. They lower sugar by different mechanisms.',
 mechTech:'Complementary mechanisms: insulin secretagogue plus insulin sensitiser. Widely recommended as second-line therapy.',
 effect:'Better glucose control than either alone.',
 conseq:'None from the pairing itself — but the sulfonylurea still carries its own hypoglycaemia risk.',
 action:['Dispense as prescribed.','Counsel on hypoglycaemia recognition, because of the sulfonylurea component.',
         'Monitor kidney function, because of the metformin component.'],
 pearl:'"No interaction" does not mean "no adverse reaction". Every drug on the list keeps its own side-effect profile. This is the commonest mistake beginners make with an interaction checker.'},

{a:'warfarin', b:'aspirin-low-dose', rag:'red',
 mech:'One stops the blood clotting; the other stops platelets sticking together. Two different parts of the same system, both switched off.',
 mechTech:'Anticoagulation plus irreversible platelet COX-1 inhibition. Additive bleeding risk, and aspirin adds direct gastric mucosal injury.',
 effect:'Substantially higher bleeding risk than either alone.',
 conseq:'Gastrointestinal and intracranial haemorrhage.',
 action:['Check whether there is a documented reason for both — a mechanical valve, or recent stenting, are real indications and the combination is then deliberate.',
         'If there is no documented reason, contact the prescriber: it is often a leftover nobody has reviewed.',
         'Gastroprotection where the combination continues.','Counsel about bleeding, and about not adding an NSAID on top.'],
 pearl:'Some red interactions are prescribed on purpose. The question is never only "do these interact" — it is "does this patient have a reason for both, and has anyone written it down".'},

{a:'metformin', b:'alcohol', rag:'amber',
 mech:'Alcohol makes lactic acid build up by the same route metformin does, and it also stops the liver releasing its stored sugar.',
 mechTech:'Ethanol potentiates metformin-associated lactic acidosis through impaired hepatic lactate clearance, and inhibits gluconeogenesis.',
 effect:'Higher lactic acidosis risk, and hypoglycaemia if other glucose-lowering drugs are present.',
 conseq:'Lactic acidosis; hypoglycaemia that is mistaken for drunkenness.',
 action:['Counsel against binge drinking specifically — the risk is with the binge, not the occasional drink.',
         'Advise eating carbohydrate alongside alcohol.','Reinforce sick-day rules: hold metformin if vomiting or dehydrated.'],
 pearl:'Alcohol belongs in a medication history. It changes the risk of at least three of the drugs in this workshop.'},

{a:'metformin', b:'ace-inhibitor', rag:'amber',
 mech:'The concern is not the two drugs meeting. It is that the ACE inhibitor can reduce kidney function, and metformin only leaves the body through the kidney.',
 mechTech:'ACE inhibitor-associated reduction in GFR — particularly with volume depletion, an NSAID or renal artery disease — reduces metformin clearance. ACE inhibitors also modestly improve insulin sensitivity.',
 effect:'Metformin may accumulate if renal function falls. Glucose may run slightly lower.',
 conseq:'Lactic acidosis if the kidney injury is significant; hypoglycaemia if a sulfonylurea or insulin is also present.',
 action:['This is a standard and appropriate combination — do not refuse it.','Check kidney function after starting or changing the ACE inhibitor.',
         'Check whether an NSAID is also on the list; that is what turns this from routine into dangerous.',
         'Sick-day rules for both.'],
 pearl:'Many important interactions are indirect: drug A does not touch drug B, it damages the organ that clears drug B. Look for the shared organ, not the shared enzyme.'},

{a:'metformin', b:'diuretic', rag:'amber',
 mech:'A diuretic removes fluid. If the patient becomes dry, the kidney suffers, and metformin builds up.',
 mechTech:'Volume depletion reduces renal perfusion and metformin clearance; thiazides also modestly raise blood glucose.',
 effect:'Metformin may accumulate in dehydration. Glucose control may worsen slightly.',
 conseq:'Lactic acidosis during a dehydrating illness.',
 action:['Teach sick-day rules explicitly: hold both during vomiting, diarrhoea or fever.','Monitor kidney function.',
         'Look for the ACE inhibitor plus NSAID combination alongside.'],
 pearl:'Sick-day rules are where this interaction is actually managed. A patient who keeps taking everything through a diarrhoeal illness is the one who comes to harm.'},

{a:'glimepiride', b:'diclofenac', rag:'amber',
 mech:'The NSAID can reduce kidney function, and a sulfonylurea that is not cleared properly keeps pushing insulin out.',
 mechTech:'NSAID-induced reduction in GFR prolongs sulfonylurea exposure; there is also historical evidence of protein-binding displacement with older agents.',
 effect:'Prolonged hypoglycaemia risk.',
 conseq:'Hypoglycaemia in a patient whose renal function has quietly fallen.',
 action:['Avoid the NSAID; paracetamol instead.','If it is used, check kidney function and warn about hypoglycaemia.',
         'Ask specifically about over-the-counter painkillers — this pair is usually self-assembled by the patient.'],
 pearl:'This is the interaction hiding in the final case of this workshop. The patient bought the NSAID herself and did not think it counted as a medicine.'},

{a:'enalapril', b:'diuretic', rag:'amber',
 mech:'The diuretic has already reduced the circulating volume, and the ACE inhibitor then relaxes the vessels on top of that. The pressure can fall sharply with the first dose.',
 mechTech:'Volume depletion activates the renin-angiotensin system, so ACE inhibition in a diuretic-treated patient produces an exaggerated first-dose fall in blood pressure. Combined, they also reduce the kidney\u2019s capacity to maintain filtration pressure.',
 effect:'Marked first-dose hypotension, and reduced renal reserve.',
 conseq:'Dizziness, collapse and falls, particularly in the elderly; acute kidney injury, especially if an NSAID is added.',
 action:['This is a standard and effective combination — the issue is how it is started, not whether.',
         'Start the ACE inhibitor at a low dose, ideally at night, and warn about dizziness on standing.',
         'Check creatinine and potassium 1\u20132 weeks after starting or any change.',
         'Then check for an NSAID: ACE inhibitor + diuretic + NSAID is the triple whammy, and the third drug is often bought over the counter.'],
 pearl:'Two of the three triple-whammy drugs are already here. Whenever you see this pair, your next question is whether the patient is taking a painkiller nobody prescribed.'},

{a:'enalapril', b:'potassium-supplement', rag:'red',
 mech:'The ACE inhibitor already makes the body hold on to potassium. Adding more potassium pushes it to a dangerous level.',
 mechTech:'Reduced aldosterone decreases renal potassium excretion; exogenous potassium, potassium-sparing diuretics and salt substitutes are additive.',
 effect:'Potassium rises.',
 conseq:'Hyperkalaemia, cardiac arrhythmia and cardiac arrest. Often entirely without symptoms until the arrhythmia.',
 action:['Contact the prescriber before dispensing.','Check the potassium.',
         'Remember low-sodium salt substitutes are potassium chloride — ask about them, they are sold as a health product.'],
 pearl:'Hyperkalaemia is silent until it is fatal. Ask about salt substitutes and potassium-sparing diuretics in anyone on an ACE inhibitor.'},

{a:'enalapril', b:'lithium', rag:'red',
 mech:'The ACE inhibitor makes the kidney hold on to lithium along with sodium.',
 mechTech:'Reduced aldosterone and altered proximal tubular sodium handling increase lithium reabsorption, raising serum lithium.',
 effect:'Lithium level rises.',
 conseq:'Lithium toxicity: tremor, vomiting, unsteadiness, confusion, seizures, renal damage.',
 action:['Contact the prescriber.','Lithium level monitoring if the combination is unavoidable.',
         'Counsel on the symptoms of toxicity and on staying hydrated.'],
 pearl:'Lithium is retained by anything that makes the kidney retain sodium — ACE inhibitors, ARBs, thiazides, NSAIDs and dehydration. One mechanism, five interactions.'},

{a:'atorvastatin', b:'fluconazole', rag:'amber',
 mech:'The antifungal blocks the enzymes that clear the statin, so the statin level rises.',
 mechTech:'CYP3A4 and CYP2C9 inhibition increases statin exposure and myopathy risk.',
 effect:'Statin level rises.', conseq:'Muscle pain, myopathy, rhabdomyolysis.',
 action:['Consider withholding the statin during a short antifungal course.','Counsel about muscle pain and dark urine.',
         'A topical antifungal avoids the problem entirely where the indication allows.'],
 pearl:'Fluconazole appears three times in this workshop — with warfarin, with a sulfonylurea and with a statin. One enzyme inhibitor, three narrow-margin victims.'},

{a:'atorvastatin', b:'amiodarone', rag:'amber',
 mech:'Amiodarone blocks the statin\u2019s clearance, and it can cause muscle problems of its own.',
 mechTech:'CYP3A4 inhibition raises statin exposure; amiodarone is independently associated with myopathy and neuropathy.',
 effect:'Higher statin exposure and additive muscle toxicity.', conseq:'Myopathy, rhabdomyolysis.',
 action:['Use a lower statin dose, or a statin less dependent on CYP3A4.','Counsel about muscle symptoms.',
         'Amiodarone has a very long half-life — the interaction persists for weeks after it is stopped.'],
 pearl:'Amiodarone\u2019s half-life is measured in weeks. Stopping it does not stop the interaction, which catches people out constantly.'},

{a:'carbamazepine', b:'valproate', rag:'amber',
 mech:'Each one changes what the other does, and in opposite directions — which makes the result hard to predict.',
 mechTech:'Carbamazepine induces valproate metabolism and lowers its level; valproate inhibits epoxide hydrolase, raising the active carbamazepine-10,11-epoxide metabolite, which can cause toxicity at a normal-looking carbamazepine level.',
 effect:'Valproate falls; the toxic carbamazepine metabolite rises.',
 conseq:'Loss of seizure control, and carbamazepine toxicity that the blood level does not show.',
 action:['Specialist management. Do not adjust doses at the counter.','Monitor levels and clinical state, not levels alone.',
         'Counsel about double vision, unsteadiness and drowsiness.'],
 pearl:'A normal drug level does not always mean no toxicity. Here the toxic species is a metabolite the routine assay does not measure — a good reminder that the test answers a narrower question than you asked.'},

{a:'propranolol', b:'insulin', rag:'amber',
 mech:'The beta-blocker removes the warning signs of a low sugar and slows the recovery from it.',
 mechTech:'Beta-blockade blunts adrenergic warning symptoms and impairs hepatic glycogenolysis. Non-selective agents also delay recovery. Sweating is generally preserved.',
 effect:'Hypoglycaemia becomes silent and lasts longer.',
 conseq:'Severe hypoglycaemia without warning: collapse, seizure, injury.',
 action:['Counsel that the patient must measure the glucose rather than wait to feel it.','Prefer a cardioselective beta-blocker.',
         'Teach that sweating usually remains as a clue.','Warn family and carers.'],
 pearl:'The same interaction appears with a sulfonylurea. Anything that raises insulin plus anything that blocks beta receptors equals hypoglycaemia you cannot feel coming.'},

{a:'metoclopramide', b:'ssri', rag:'amber',
 mech:'Both act on brain chemistry in ways that can add up — more movement problems, and a small risk of serotonin excess.',
 mechTech:'Additive extrapyramidal risk through D2 blockade in a serotonergically driven state; case reports of serotonin syndrome with the combination.',
 effect:'Higher risk of dystonia and other movement reactions; a small serotonin syndrome risk.',
 conseq:'Acute dystonia; agitation, tremor, fever and rigidity in serotonin syndrome.',
 action:['Limit metoclopramide strictly to five days.','Counsel about abnormal movements, and about agitation with tremor and fever.',
         'Consider an alternative antiemetic such as domperidone or ondansetron.'],
 pearl:'Two centrally acting drugs from different classes can interact without sharing a receptor or an enzyme. Additive effects on the same organ are enough.'},

{a:'amoxicillin', b:'oral-contraceptive', rag:'green',
 mech:'This one is mostly a myth. Broad-spectrum antibiotics were long believed to stop the pill working; the evidence does not support it, except for the enzyme inducers such as rifampicin.',
 mechTech:'No clinically significant pharmacokinetic interaction for non-enzyme-inducing antibiotics. Enzyme inducers (rifampicin, rifabutin) genuinely do reduce efficacy.',
 effect:'No meaningful reduction in contraceptive efficacy.',
 conseq:'None from the interaction. Vomiting or diarrhoea from the infection can reduce absorption, which is a different mechanism.',
 action:['Reassure, and correct the myth.','Do advise extra precautions if there is vomiting or significant diarrhoea.',
         'Do flag rifampicin and rifabutin, which are real.'],
 pearl:'A good interaction checker tells you when NOT to worry. Over-warning has a cost too: patients stop trusting the warnings that matter.'}
];

/* ==================================================================== *
 * 3 · DRUG–DISEASE INTERACTIONS AND PATIENT FACTORS                    *
 *                                                                      *
 * The point of this section, and the reason it is separate from the    *
 * drug-drug list: nothing about the prescription looks wrong. The      *
 * danger is in the combination of the drug with THIS patient.          *
 * ==================================================================== */
var DRUG_DISEASE = [
{drug:'diclofenac', cond:'Asthma', rag:'red',
 q:'Does this patient’s medical history create a potential medication-related concern?',
 mech:'In some people with asthma, blocking this enzyme pushes the body to make more of a different chemical that tightens the airways.',
 mechTech:'COX-1 inhibition shunts arachidonic acid down the 5-lipoxygenase pathway, increasing cysteinyl leukotrienes — NSAID-exacerbated respiratory disease, affecting roughly 5–20% of adults with asthma, more where there is nasal polyposis.',
 effect:'Bronchospasm within minutes to hours of a dose.',
 conseq:'Severe, occasionally fatal asthma attack. Cross-reacts across the whole NSAID class.',
 action:['Ask directly: has any painkiller ever made your breathing or your nose worse?',
         'If yes, avoid all NSAIDs and record it properly as a class reaction.','Paracetamol is generally tolerated.',
         'Higher suspicion still with nasal polyps or chronic sinus disease.'],
 pearl:'Aspirin-exacerbated respiratory disease: asthma, nasal polyps and NSAID sensitivity travel together. Spotting the triad is a genuinely useful clinical skill.'},

{drug:'diclofenac', cond:'Chronic kidney disease', rag:'red',
 q:'Is an NSAID safe in a patient whose kidney function is already reduced?',
 mech:'A damaged kidney depends even more heavily on the chemical the NSAID blocks to keep its blood supply going.',
 mechTech:'In reduced eGFR, prostaglandin-dependent afferent vasodilatation is a critical compensatory mechanism. Removing it precipitates acute-on-chronic kidney injury and hyperkalaemia.',
 effect:'Falling eGFR, rising creatinine and potassium.',
 conseq:'Acute kidney injury, sometimes needing dialysis, and sometimes permanent.',
 action:['Avoid NSAIDs. Paracetamol is the alternative.','If genuinely unavoidable: lowest dose, shortest course, and check kidney function.',
         'Check for an ACE inhibitor, ARB or diuretic — the triple whammy.'],
 pearl:'Ask every patient buying an NSAID whether they have kidney trouble, diabetes or high blood pressure. It takes ten seconds at the counter.'},

{drug:'diclofenac', cond:'Heart failure', rag:'red',
 q:'What does salt and water retention do to a failing heart?',
 mech:'The NSAID makes the body hold fluid, and a weak heart cannot cope with the extra volume.',
 mechTech:'Prostaglandin inhibition causes sodium and water retention and increases systemic vascular resistance, worsening congestion. Diclofenac specifically is contraindicated in established heart failure.',
 effect:'Fluid overload.',
 conseq:'Breathlessness, ankle and leg swelling, weight gain, admission for decompensated heart failure.',
 action:['Avoid.','Paracetamol.','Weigh the patient and ask about breathlessness lying flat and about swelling.'],
 pearl:'Weight gain of two or three kilos in a week is fluid, not fat, and in a heart failure patient it is a warning that needs acting on today.'},

{drug:'diclofenac', cond:'Peptic ulcer disease', rag:'red',
 q:'Is there an obvious reason to avoid this class in this patient?',
 mech:'The NSAID removes the stomach lining’s own protection, in someone whose stomach has already proved vulnerable.',
 mechTech:'Loss of mucosal PGE2 in a patient with prior ulceration carries a substantially increased re-bleeding risk.',
 effect:'Ulcer recurrence and bleeding.',
 conseq:'Gastrointestinal haemorrhage or perforation.',
 action:['Avoid. Paracetamol instead.','If unavoidable, a proton pump inhibitor is mandatory, not optional.','Test and treat H. pylori.'],
 pearl:'A previous ulcer is the strongest single predictor of the next one. Always ask, and ask specifically — "any stomach trouble?" is too vague to catch it.'},

{drug:'propranolol', cond:'Asthma', rag:'red',
 q:'This is a non-selective beta-blocker. What does the patient’s asthma change?',
 mech:'The drug blocks the receptors in the lungs that keep the airways open, as well as the ones in the heart.',
 mechTech:'Beta-2 blockade in bronchial smooth muscle causes bronchoconstriction and blunts the response to beta-2 agonist rescue therapy.',
 effect:'Bronchospasm; salbutamol works less well.',
 conseq:'Severe, potentially fatal asthma attack that resists rescue treatment.',
 action:['Do not dispense; contact the prescriber.','A cardioselective beta-blocker under supervision if one is truly needed.',
         'Check the list for an inhaler — it tells you the diagnosis.'],
 pearl:'Non-selective beta-blockers and asthma is one of the few genuinely absolute drug–disease contraindications. Learn it as an absolute.'},

{drug:'metformin', cond:'Acute kidney injury or eGFR below 30', rag:'red',
 q:'Metformin leaves the body unchanged through the kidney. What happens if the kidney is failing?',
 mech:'The drug cannot get out, so it builds up, and at high levels it drives acid into the blood.',
 mechTech:'Metformin is renally excreted unchanged. Accumulation inhibits hepatic mitochondrial respiration and promotes lactate production — metformin-associated lactic acidosis.',
 effect:'Metformin accumulates; lactate rises.',
 conseq:'Lactic acidosis: deep rapid breathing, vomiting, muscle pain, drowsiness. Mortality is high.',
 action:['Withhold metformin.','Contact the prescriber urgently.','Teach sick-day rules: hold it during vomiting, diarrhoea or dehydration.',
         'Check kidney function at least yearly, and after any acute illness.'],
 pearl:'Sick-day rules are a pharmacovigilance intervention, not a nursing detail. Most metformin lactic acidosis follows a dehydrating illness in a patient who kept taking their tablets.'},

{drug:'glimepiride', cond:'Age over 65 with reduced kidney function', rag:'red',
 q:'Two patient factors here, not one. What do they do together?',
 mech:'The drug hangs around much longer in an older patient with a weaker kidney, and it keeps pushing insulin out the whole time.',
 mechTech:'Reduced renal clearance prolongs sulfonylurea exposure; ageing also blunts counter-regulatory hormone responses and symptom awareness. Hypoglycaemia is prolonged and recurrent.',
 effect:'Hypoglycaemia lasting many hours, and recurring after it is treated.',
 conseq:'Falls, fracture, confusion, seizure, admission, death. And it is often not recognised as drug-related at all.',
 action:['Review whether a sulfonylurea is appropriate at all; a lower-risk agent is usually better.','Lowest possible dose.',
         'Teach the patient and the family what a low sugar looks like.','Check a glucose in any older diabetic patient who reports dizziness, a fall or confusion.'],
 pearl:'In an older person, hypoglycaemia looks like ageing. This is the single most important idea in this workshop, and the final case is built on it.'},

{drug:'metoclopramide', cond:'Parkinson’s disease', rag:'red',
 q:'The drug blocks dopamine. The disease is a shortage of dopamine. Continue?',
 mech:'You would be giving a drug that does the exact opposite of the treatment.',
 mechTech:'Central D2 antagonism directly opposes dopaminergic therapy and worsens nigrostriatal deficit.',
 effect:'Marked worsening of rigidity, tremor and mobility.',
 conseq:'Loss of function, falls, aspiration risk. Sometimes mistaken for disease progression and treated with more levodopa.',
 action:['Do not dispense. Contact the prescriber.','Domperidone crosses into the brain far less and is the usual alternative.'],
 pearl:'Drug-induced worsening of a disease gets recorded as "the disease got worse". Asking what changed in the medicines first is how you find these.'},

{drug:'carbamazepine', cond:'South, Southeast or East Asian ancestry', rag:'amber',
 q:'Is there a patient factor that changes the risk of a serious reaction here?',
 mech:'Some people carry a gene variant that makes their immune system attack the skin when it meets this drug.',
 mechTech:'HLA-B*15:02 is strongly associated with carbamazepine-induced SJS/TEN and is carried by roughly 10–15% of some Han Chinese, Thai and Malay populations, with meaningful frequencies in parts of South Asia. Screening before starting is recommended in several guidelines.',
 effect:'Much higher risk of Stevens–Johnson syndrome and toxic epidermal necrolysis.',
 conseq:'A life-threatening skin reaction, usually in the first eight weeks.',
 action:['Consider HLA-B*15:02 testing before starting, where it is available.','Counsel very specifically about rash, fever, mouth ulcers and sore eyes.',
         'Any rash in the first eight weeks: stop and be seen the same day.'],
 pearl:'Pharmacogenomics is not a future topic. It is already the standard of care for this drug, and it is especially relevant to Indian and Southeast Asian patients.'},

{drug:'enalapril', cond:'Pregnancy, or planning pregnancy', rag:'red',
 q:'Is there anything about this patient that makes an ACE inhibitor the wrong choice?',
 mech:'The drug interferes with the system the developing baby’s kidneys need in order to form.',
 mechTech:'ACE inhibitors cause fetal renal dysgenesis, oligohydramnios, skull hypoplasia and death, particularly with second and third trimester exposure.',
 effect:'Fetal injury.', conseq:'Fetal renal failure, deformity, stillbirth.',
 action:['Stop and contact the prescriber urgently.','Switch to an antihypertensive appropriate in pregnancy, such as labetalol or methyldopa.',
         'Discuss contraception and pre-conception planning with every woman of childbearing age BEFORE starting.'],
 pearl:'"Are you or could you be pregnant?" belongs in a routine dispensing check, not just in an obstetric clinic.'},

{drug:'ciprofloxacin', cond:'Age over 60, on a corticosteroid', rag:'amber',
 q:'Two patient factors again. What are they doing to the same tissue?',
 mech:'Both the antibiotic and the steroid weaken tendon, and age has already weakened it.',
 mechTech:'Fluoroquinolone-induced disruption of tendon collagen and matrix metalloproteinase activity, compounded by corticosteroid catabolic effects on connective tissue.',
 effect:'Much higher risk of tendinitis and tendon rupture.',
 conseq:'Achilles rupture, often needing surgery and months of recovery.',
 action:['Prefer another antibiotic class if one will do.','Counsel: stop the antibiotic and get seen for any new heel, ankle or shoulder pain.',
         'Advise against strenuous exercise during and shortly after the course.'],
 pearl:'Risk factors multiply rather than add. Age, a steroid and a quinolone is not three small risks, it is one large one.'},

{drug:'amoxicillin', cond:'Infectious mononucleosis (glandular fever)', rag:'amber',
 q:'Why does this particular infection matter before dispensing a penicillin?',
 mech:'In glandular fever, a rash after amoxicillin is very likely — and it is not a true allergy.',
 mechTech:'A high rate of maculopapular eruption with ampicillin/amoxicillin in acute EBV infection; the mechanism is not IgE-mediated and the patient is generally not penicillin-allergic afterwards.',
 effect:'A widespread rash.',
 conseq:'The real harm is the label: "penicillin allergy" recorded for life, which then removes the best antibiotic for many later infections.',
 action:['Avoid amoxicillin where glandular fever is suspected.','If a rash occurs, document it in full — the illness, the timing, the appearance.',
         'Do not enter "penicillin allergy" without that description.','Consider later allergy assessment.'],
 pearl:'An incorrect allergy label is a patient-safety problem with a measurable cost: worse antibiotics, longer illness, more resistance. Documentation is clinical work.'}
];

/* ==================================================================== *
 * 4 · TERM CODING — a TEACHING STAND-IN for MedDRA                     *
 *                                                                      *
 * See the accuracy note at the top of this file. This models the       *
 * STRUCTURE of coding — lay phrase, verbatim reported term, a          *
 * preferred-term-style label, a system organ class — because the       *
 * structure is what a beginner needs to understand. It is not a        *
 * MedDRA extract and must not be used to code a real case.            *
 * ==================================================================== */
var TERMS = [
{lay:['ankle swelling','swollen ankles','swelling around both ankles','feet swollen','puffy ankles','swollen legs','leg swelling','fluid in legs'],
 verbatim:'Swelling around both ankles', pt:'Peripheral oedema', soc:'General disorders and administration site conditions',
 sibling:['Oedema','Generalised oedema','Face oedema','Fluid retention'],
 note:'Note what the coded term does NOT decide: it records the finding, not the cause. Heart failure, an NSAID, a calcium channel blocker and standing all day can all produce it.'},
{lay:['yellow eyes','eyes turned yellow','yellow skin','dark urine and yellow eyes','skin went yellow','whites of eyes yellow'],
 verbatim:'Whites of the eyes and skin turned yellow', pt:'Jaundice', soc:'Hepatobiliary disorders',
 sibling:['Ocular icterus','Hyperbilirubinaemia','Cholestasis','Drug-induced liver injury'],
 note:'The patient describes a colour. The coder records a sign. The diagnosis — say, drug-induced liver injury — is a separate, later term that needs laboratory evidence behind it.'},
{lay:['itchy rash','widespread itchy rash','red spots all over','rash all over body','skin eruption','nettle rash','hives'],
 verbatim:'Widespread itchy rash', pt:'Rash maculo-papular', soc:'Skin and subcutaneous tissue disorders',
 sibling:['Rash','Urticaria','Rash pruritic','Erythema','Drug eruption'],
 note:'"Rash" is not one term. Urticaria, a maculopapular rash and the start of Stevens-Johnson syndrome are coded differently and mean very different things, so the description you take from the patient decides the code.'},
{lay:['dizziness','feeling dizzy','light headed','giddy','head spinning','felt faint','unsteady'],
 verbatim:'Episodes of dizziness', pt:'Dizziness', soc:'Nervous system disorders',
 sibling:['Vertigo','Presyncope','Syncope','Balance disorder','Hypoglycaemia'],
 note:'Dizziness is the most over-coded and least informative term in pharmacovigilance. Press for what the patient actually means: the room spinning, about to faint, unsteady, or confused. In a diabetic it may really be hypoglycaemia, which is a completely different term and a completely different case.'},
{lay:['dry cough','tickly cough','cough that will not go','persistent cough','irritating cough','cough at night'],
 verbatim:'Persistent dry cough', pt:'Cough', soc:'Respiratory, thoracic and mediastinal disorders',
 sibling:['Productive cough','Dyspnoea','Throat irritation'],
 note:'A plain-sounding term attached to an ACE inhibitor is one of the most frequently reported reactions in the world. Do not skip a report because the term looks trivial.'},
{lay:['swollen lips','face swelling','tongue swelling','throat closing','swollen face and lips','puffy face'],
 verbatim:'Swelling of the lips and face', pt:'Angioedema', soc:'Skin and subcutaneous tissue disorders',
 sibling:['Face oedema','Lip swelling','Tongue oedema','Laryngeal oedema','Anaphylactic reaction'],
 note:'Coding this as "face oedema" instead of "angioedema" loses the seriousness of the case. When an airway is involved, the term must say so.'},
{lay:['black stools','tarry stools','blood in stool','vomiting blood','coffee ground vomit','passing black motion'],
 verbatim:'Black tarry stools', pt:'Melaena', soc:'Gastrointestinal disorders',
 sibling:['Haematemesis','Gastrointestinal haemorrhage','Upper gastrointestinal haemorrhage','Anaemia'],
 note:'This term is always serious. It should never be coded without also recording the seriousness criterion and the haemoglobin.'},
{lay:['muscle pain','aching legs','muscle aches','weak muscles','pain in thighs','dark urine and muscle pain'],
 verbatim:'Aching, weak thigh muscles with dark urine', pt:'Rhabdomyolysis', soc:'Musculoskeletal and connective tissue disorders',
 sibling:['Myalgia','Myopathy','Blood creatine phosphokinase increased','Acute kidney injury'],
 note:'Myalgia and rhabdomyolysis are the same complaint at two ends of a spectrum. Dark urine and a creatine kinase result are what move the code from one to the other — which is why the laboratory belongs in the investigation.'},
{lay:['low sugar','sugar dropped','sweating and shaking','hypo','blood sugar low','confused and sweaty'],
 verbatim:'Blood glucose 52 mg/dL with sweating and confusion', pt:'Hypoglycaemia', soc:'Metabolism and nutrition disorders',
 sibling:['Blood glucose decreased','Hypoglycaemic unconsciousness','Dizziness','Confusional state'],
 note:'When a measurement exists, the coded term should reflect the measurement, not just the symptom. "Dizziness" and "Hypoglycaemia" would send this case into two different places in a safety database.'},
{lay:['neck twisting','jaw spasm','tongue sticking out','eyes rolled up','stiff neck after injection','abnormal movements'],
 verbatim:'Neck twisted to one side with jaw spasm', pt:'Dystonia', soc:'Nervous system disorders',
 sibling:['Oculogyric crisis','Extrapyramidal disorder','Torticollis','Muscle spasticity'],
 note:'Frequently coded as a seizure or a psychiatric event by somebody who did not ask what was given in the previous 72 hours. The wrong code hides the whole signal.'},
{lay:['blisters','peeling skin','sores in mouth','skin coming off','rash with fever and mouth ulcers','sore eyes and rash'],
 verbatim:'Blistering rash with mouth ulcers, sore eyes and fever', pt:'Stevens-Johnson syndrome', soc:'Skin and subcutaneous tissue disorders',
 sibling:['Toxic epidermal necrolysis','Drug reaction with eosinophilia and systemic symptoms','Erythema multiforme','Rash'],
 note:'Never code this as "rash". Mucosal involvement, fever and skin pain are what separate a nuisance from a dermatological emergency, and the term must carry that.'},
{lay:['no periods','pregnant while on the pill','contraceptive failed','became pregnant','pill did not work'],
 verbatim:'Became pregnant while taking the contraceptive pill', pt:'Drug ineffective', soc:'General disorders and administration site conditions',
 sibling:['Contraceptive failure','Unintended pregnancy','Therapeutic response decreased'],
 note:'Lack of effect is a reportable adverse reaction. It is one of the most under-reported of all, because nothing in it feels like a side effect.'},
{lay:['heel pain','achilles pain','ankle pain after antibiotic','tendon pain','pain behind the ankle'],
 verbatim:'Pain behind the right ankle', pt:'Tendonitis', soc:'Musculoskeletal and connective tissue disorders',
 sibling:['Tendon rupture','Achilles tendinitis','Arthralgia','Pain in extremity'],
 note:'Pain and rupture are separate terms with very different seriousness. Code what happened, and follow the case up to find out whether it progressed.'},
{lay:['numbness','tingling','pins and needles','burning feet','loss of sensation in hands'],
 verbatim:'Burning and tingling in both feet', pt:'Peripheral neuropathy', soc:'Nervous system disorders',
 sibling:['Paraesthesia','Hypoaesthesia','Neuropathy peripheral','Burning sensation'],
 note:'Ask whether it has resolved. A reaction that may be permanent is coded and followed differently from one that settles, and outcome is a required ICSR field.'},
{lay:['very tired','no energy','exhausted','weakness','tired all the time'],
 verbatim:'Persistent tiredness', pt:'Fatigue', soc:'General disorders and administration site conditions',
 sibling:['Asthenia','Malaise','Lethargy','Anaemia'],
 note:'Fatigue on its own carries almost no information. It becomes useful only when you find what accompanies it — jaundice, anaemia, a low sodium, a thyroid result.'},
{lay:['nausea','feeling sick','queasy','upset stomach','sick feeling'],
 verbatim:'Feeling sick', pt:'Nausea', soc:'Gastrointestinal disorders',
 sibling:['Vomiting','Dyspepsia','Abdominal pain upper','Decreased appetite'],
 note:'Expected, labelled and non-serious for most medicines. Still report it: expectedness affects how a case is assessed, not whether it is worth reporting.'},
{lay:['watery diarrhoea','loose motion','diarrhoea after antibiotic','frequent loose stools'],
 verbatim:'Frequent watery stools during an antibiotic course', pt:'Diarrhoea', soc:'Gastrointestinal disorders',
 sibling:['Clostridium difficile colitis','Colitis','Abdominal pain','Dehydration'],
 note:'"Diarrhoea" and "C. difficile colitis" are a routine event and a serious one. The stool test is what decides which term this case gets.'},
{lay:['breathless','wheezing','cannot breathe','tight chest','asthma got worse after painkiller'],
 verbatim:'Wheeze and chest tightness after a painkiller', pt:'Bronchospasm', soc:'Respiratory, thoracic and mediastinal disorders',
 sibling:['Asthma','Dyspnoea','Wheezing','Asthmatic crisis'],
 note:'Coding this as "asthma" makes it look like the disease. "Bronchospasm" after a specific dose points at the drug. The term you choose changes what the database can find.'}
];

/* ==================================================================== *
 * 5 · TEACHING CASES                                                   *
 *                                                                      *
 * Cases 1-3 are the comparison set for Station 5. The student is NOT   *
 * asked "which is the ADR" — they are asked which case requires        *
 * further investigation, which is a different and better question,     *
 * because the honest answer for a beginner is usually "I would need to *
 * know more", and that instinct should be rewarded rather than marked  *
 * wrong.                                                               *
 * ==================================================================== */
var READ_CASE = {
  id:'RC-1',
  text:'A 22-year-old female was prescribed amoxicillin 500 mg three times a day for a throat infection. '
      +'Two days after starting treatment, she developed a widespread itchy rash. She stopped the medicine after '
      +'consulting her physician. The rash gradually disappeared over four days.',
  /* The extraction trainer. Each tag is a span of the text above, and the
     student has to assign the right label to it. Order is the order a
     report is built in, which is itself the lesson. */
  tags:[
    {k:'PATIENT',    label:'Patient',    txt:'A 22-year-old female',
     why:'Age and sex. Without an identifiable patient the report is not a valid ICSR at all — it is one of the four minimum elements.'},
    {k:'DRUG',       label:'Suspect drug',txt:'amoxicillin 500 mg three times a day',
     why:'Name, dose and frequency. The name alone is not enough: dose and frequency are needed to judge whether the reaction is dose-related.'},
    {k:'INDICATION', label:'Indication', txt:'for a throat infection',
     why:'Why the drug was given. It matters because the indication itself can cause the event — and because a rash in glandular fever is a different story entirely.'},
    {k:'TIME',       label:'Time to onset',txt:'Two days after starting treatment',
     why:'The temporal relationship. This single phrase does more work in causality assessment than any other in the case.'},
    {k:'EVENT',      label:'Adverse event',txt:'a widespread itchy rash',
     why:'What actually happened, in the patient’s words. You will code this later, but first you record it verbatim.'},
    {k:'ACTION',     label:'Action taken',txt:'She stopped the medicine',
     why:'Drug withdrawn, dose reduced, dose unchanged, or unknown. This is a required ICSR field and it sets up the dechallenge.'},
    {k:'OUTCOME',    label:'Outcome',    txt:'The rash gradually disappeared',
     why:'Recovered, recovering, not recovered, recovered with sequelae, fatal, or unknown. Also the dechallenge result — it improved after stopping.'}
  ],
  missing:[
    {q:'Has she ever reacted to a penicillin before?', why:'Previous exposure and previous reaction change the causality assessment and the allergy record.'},
    {q:'What exactly did the rash look like — flat, raised, blistered? Any mouth or eye involvement? Any fever?',
     why:'This is what separates a nuisance rash from the beginning of Stevens-Johnson syndrome. "Rash" is not a sufficient description.'},
    {q:'What else was she taking, including anything bought over the counter?', why:'Alternative causes, and possible interactions.'},
    {q:'Was she given the drug again afterwards?', why:'Rechallenge. It is the strongest single piece of causality evidence — and it is usually, and rightly, avoided.'},
    {q:'Who is reporting this, and how can they be contacted?', why:'An identifiable reporter is one of the four minimum elements for a valid report.'}
  ]
};

var COMPARE = [
{id:'A', title:'Case A', drug:'Paracetamol', drugKey:null,
 text:'A 30-year-old man took paracetamol 500 mg for a headache. About an hour later he felt mildly nauseous. '
     +'He took the next dose anyway and felt nothing further. He has taken paracetamol many times before without trouble.',
 event:'Mild nausea', timing:'1 hour after the dose',
 verdict:'low',
 why:'A mild, self-limiting, non-serious event with an extremely common medicine the patient has tolerated many times, '
    +'and it did not recur on further doses. It is worth recording, but it does not demand an investigation.',
 teach:'Note what made this low priority: not seriousness alone, but the combination of a mild non-serious event, long '
      +'prior uneventful exposure, and no recurrence when the drug was taken again. That last point is an informal '
      +'rechallenge and it argues against the drug.'},
{id:'B', title:'Case B', drug:'Amoxicillin', drugKey:'amoxicillin',
 text:'A 22-year-old woman started amoxicillin for a throat infection. On day two she developed a widespread itchy rash. '
     +'The medicine was stopped and the rash settled over four days. She has never taken a penicillin before.',
 event:'Widespread itchy rash', timing:'Day 2 of treatment',
 verdict:'high',
 why:'A plausible reaction to a drug well known to cause it, with a clear temporal relationship and improvement on '
    +'withdrawal. Crucially, the description is not yet good enough to be sure it is harmless — and the allergy label '
    +'that follows will affect her care for life.',
 teach:'This case needs investigation not because it looks dangerous but because the answer MATTERS. Get the '
      +'description right and she has a documented penicillin reaction. Get it wrong and she either carries a false '
      +'allergy label forever, or a genuine severe reaction gets dismissed as a nuisance rash.'},
{id:'C', title:'Case C', drug:'A newly started medicine', drugKey:null,
 text:'A 45-year-old man developed a headache three days after starting a new medicine. He has also slept badly for a '
     +'week because of a family problem, has been drinking very little water in hot weather, and has run out of his '
     +'usual morning coffee for two days.',
 event:'Headache', timing:'Day 3 of treatment',
 verdict:'confounded',
 why:'There is a temporal relationship, but there are at least three competing explanations: sleep deprivation, '
    +'dehydration and caffeine withdrawal. The honest answer is that you cannot assess this case without more '
    +'information — and saying so is the correct professional response, not a failure.',
 teach:'This is the case that teaches the word "confounding". A temporal relationship is necessary for causality but '
      +'nowhere near sufficient. The right next step is not a verdict, it is a list of alternative causes to rule out. '
      +'In WHO-UMC terms, a case like this often ends up "Possible" at best — and "Unassessable" if the information '
      +'never arrives.'}
];

/* ==================================================================== *
 * 6 · THE SIGNAL DATASET                                               *
 *                                                                      *
 * Deliberately built so the biggest NUMBER is not the answer. A        *
 * student who sorts the column and picks the top row gets it wrong,    *
 * which is the entire point of the station.                            *
 * ==================================================================== */
var SIGNAL_SET = {
  drug:'Drug A', exposure:'Approximately 40,000 patients treated since launch 14 months ago',
  rows:[
    {adr:'Nausea', n:15, labelled:true, serious:false, expected:'Listed as very common in the product information',
     verdict:'no', why:'The most cases by a distance, and the least interesting. It is already in the label, it is not serious, and 15 reports in 40,000 patients is far below the incidence the label itself describes. Expected and non-serious.'},
    {adr:'Liver injury', n:8, labelled:false, serious:true, expected:'NOT in the product information. Not described for this drug class.',
     verdict:'yes', why:'Eight cases of a serious, unlabelled, unexpected event. Every one of those three words is doing work: serious raises the stakes, unlabelled means it is new information, and unexpected for the class means it cannot be explained away. This is the signal.'},
    {adr:'Headache', n:3, labelled:true, serious:false, expected:'Listed as common',
     verdict:'no', why:'Small number, expected, non-serious, and headache has a very high background rate in any population. Nothing here rises above noise.'},
    {adr:'Rash', n:2, labelled:true, serious:false, expected:'Listed as uncommon',
     verdict:'watch', why:'Only two cases and already labelled, so not a signal on these numbers. But read the individual reports before dismissing it — if either one involved blistering, mucosal involvement or fever, two cases of a severe cutaneous reaction would matter far more than fifteen of nausea.'}
  ],
  lesson:'A signal is not the biggest number in the column. Four things decide it: how serious the event is, whether '
        +'it is already in the label, how plausible it is for that drug and its class, and how good the individual '
        +'reports are. Counting is the easy part and it is not the assessment.',
  definition:'Information arising from one or more sources which suggests a new, potentially causal association — or a '
            +'new aspect of a known association — between an intervention and an event, judged likely enough to '
            +'justify verificatory action. (The sense used by WHO and CIOMS.)',
  chain:['A single case report','Several similar cases','A recognisable pattern: same event, same drug, same time course',
         'A potential signal, formally recorded and prioritised','Signal evaluation: review of all data, literature, background rates',
         'Regulatory action: label change, restriction, direct communication to healthcare professionals, or withdrawal']
};

/* ==================================================================== *
 * 7 · THE FINAL TEAM CHALLENGE                                         *
 *                                                                      *
 * Built exactly to the brief: a 67-year-old diabetic on metformin plus  *
 * a recently started medicine, complaining of dizziness, with one       *
 * laboratory value available and a history of hypertension. The         *
 * information is incomplete ON PURPOSE. Step 1 is not "what is the      *
 * diagnosis", it is "what is missing" — because that is the first       *
 * thing a real safety officer does with a report like this.             *
 *                                                                      *
 * `reveal` is released stage by stage, only after the team has asked.   *
 * ==================================================================== */
var FINAL = {
  id:'PVF-FINAL-01',
  handover:{
    patient:'67 years old',
    condition:'Type 2 diabetes for 11 years. Hypertension.',
    meds:'Metformin 1 g twice daily (long-standing) + one other antidiabetic tablet, recently started',
    newDrug:'Started about three weeks ago. The patient cannot name it.',
    complaint:'Dizziness. Several episodes, mostly late morning.',
    labs:'One laboratory value is available on the referral slip.',
    pmh:'Hypertension, on treatment',
    reporter:'Telephone call from a community pharmacist',
    note:'That is everything the call contained. Nothing else was recorded.'
  },
  /* what a team SHOULD notice is missing, before anything else */
  missing:[
    {k:'drug_name', label:'The name, dose and strength of the new medicine', weight:3,
     why:'You cannot assess a case against an unnamed drug. This is the first phone call to make, and the dispensing record will answer it.'},
    {k:'lab_value', label:'What the laboratory value actually is', weight:3,
     why:'A value was mentioned and not read. In a diabetic with dizziness, a glucose reading either makes the case or breaks it.'},
    {k:'timing', label:'Exact dates: when the new drug started, when the dizziness started', weight:3,
     why:'Without the interval between them there is no temporal relationship, and without that there is no causality assessment.'},
    {k:'episode', label:'What "dizziness" actually means to this patient', weight:2,
     why:'Room spinning, about to faint, unsteady, or confused? These are four different events with four different codes and four different causes.'},
    {k:'timing_of_day', label:'When in the day the episodes happen, and in relation to meals',
     weight:2, why:'"Late morning" is a clue on its own. Before lunch, several hours after a morning tablet, is exactly when a sulfonylurea hypoglycaemia appears.'},
    {k:'bp_meds', label:'Which antihypertensive, at what dose', weight:2,
     why:'Postural hypotension is the other strong candidate for dizziness in a 67-year-old, and an ACE inhibitor also potentiates hypoglycaemia.'},
    {k:'renal', label:'Kidney function — creatinine and eGFR', weight:2,
     why:'It decides whether metformin is still safe and whether a sulfonylurea is accumulating. It changes the answer.'},
    {k:'conmeds', label:'The complete medicine list, including over-the-counter and herbal', weight:2,
     why:'You have been given two drugs out of what is probably five or six. Never assess a case on a partial list.'},
    {k:'outcome', label:'What has happened since — has anything been stopped or changed?', weight:1,
     why:'Action taken and outcome are required ICSR fields, and the dechallenge is the strongest evidence you can get here.'},
    {k:'reporter', label:'Full reporter details and contact', weight:1,
     why:'An identifiable reporter is one of the four minimum elements. Without it there is no valid report and no way to follow up.'}
  ],
  /* the investigation. Each source answers only what it would really know. */
  reveal:{
    pharmacy:{title:'Community pharmacy dispensing record',
      body:['Metformin 1 g twice daily — continuously since 2019.',
            'Glimepiride 2 mg once daily in the morning — FIRST dispensed 24 August 2026. Repeat collected 14 September.',
            'Enalapril 5 mg once daily — since 2021.',
            'Atorvastatin 10 mg at night — since 2021.',
            'Patient also bought ibuprofen 400 mg tablets over the counter on 2 September, for knee pain. Not on any prescription.'],
      grants:['drug_name','conmeds','bp_meds'],
      teach:'The new medicine is a sulfonylurea, started 24 August. Note also the over-the-counter ibuprofen, which nobody mentioned and which nobody prescribed — an NSAID on top of an ACE inhibitor in a 67-year-old diabetic.'},
    lab:{title:'Laboratory and point-of-care results',
      body:['Capillary blood glucose 52 mg/dL (2.9 mmol/L), taken at 11:40 on 15 September during an episode.',
            'HbA1c 6.1% (was 8.4% in July 2026).',
            'Creatinine 1.6 mg/dL. eGFR 38 mL/min/1.73m² — was eGFR 52 in March 2026.',
            'Potassium 5.3 mmol/L. Sodium 138 mmol/L. Haemoglobin 12.1 g/dL.'],
      grants:['lab_value','renal'],
      teach:'Three findings, and each one changes the case. The glucose of 52 mg/dL during an episode makes the diagnosis. '
           +'The HbA1c falling from 8.4% to 6.1% shows the patient is now over-treated, not under-treated. And the eGFR has '
           +'dropped from 52 to 38, which makes both the glimepiride accumulate AND takes metformin below its safe threshold.'},
    patient:{title:'Telephone interview with the patient',
      body:['"It comes on before lunch, mostly. I go sweaty and my hands shake, and everything feels far away."',
            '"It has happened maybe six or seven times. Twice I had to sit down on the floor."',
            '"I take the new small tablet with my tea in the morning, before I eat anything."',
            '"I have been trying to eat less since the doctor said my sugar was high."',
            '"The dizzy feeling goes off after I eat something sweet."',
            '"I took some pain tablets from the shop for my knee, but those are not medicines really."'],
      grants:['episode','timing_of_day'],
      teach:'Every line here is diagnostic. Sweating and shaking is adrenergic. Before lunch, on an empty stomach, after a '
           +'morning sulfonylurea. Relieved by sugar. And the patient has independently reduced their food intake while on a '
           +'drug that pushes insulin out regardless of whether they have eaten. Note too that they do not count shop-bought '
           +'tablets as medicines — which is why "any other medicines?" is the wrong question.'},
    gp:{title:'Prescriber notes',
      body:['24 August 2026: "HbA1c 8.4%. Adding glimepiride 2 mg od. Continue metformin."',
            '15 September 2026: "Patient reports dizzy spells. BP 138/82 sitting, 130/78 standing. No postural drop. '
            +'Advised to monitor."',
            'No medication change made at that visit. Renal function was last formally reviewed in March 2026.'],
      grants:['timing','outcome'],
      teach:'Two important things. The dates give you the interval: glimepiride on 24 August, symptoms about three weeks later. '
           +'And the prescriber has already ruled out the main alternative — there is no postural blood pressure drop, so this '
           +'is not simply orthostatic hypotension from the enalapril.'},
    reporterDesk:{title:'Reporter and follow-up details',
      body:['Reporter: community pharmacist, registered, contactable by telephone and email.',
            'Reporter is willing to provide follow-up information and to obtain patient consent.',
            'Patient is identifiable to the reporter. Initials, age and sex available; name withheld from the report.'],
      grants:['reporter'],
      teach:'Now you have a valid ICSR: an identifiable patient, an identifiable reporter, a suspect product and an '
           +'adverse event. Those are the four minimum elements, and until you had all four you had an enquiry, not a report.'}
  },
  truth:{
    drug:'Glimepiride 2 mg once daily, started 24 August 2026',
    event:'Hypoglycaemia (capillary glucose 52 mg/dL during a symptomatic episode)',
    coded:'Hypoglycaemia — Metabolism and nutrition disorders',
    verbatim:'Dizzy spells with sweating and shaking before lunch',
    serious:true,
    criterion:'Other medically important condition — recurrent symptomatic hypoglycaemia with episodes severe enough to '
             +'require the patient to sit on the floor, in a 67-year-old with falling renal function. Significant fall and '
             +'fracture risk; medical intervention required to prevent a serious outcome.',
    severity:'Moderate to severe in intensity — but note that severity and seriousness are answering different questions.',
    causality:'Probable (WHO-UMC). Reasonable time relationship, a well-recognised reaction to the drug class, made '
             +'more likely by declining renal function and reduced food intake, with no postural drop to support the '
             +'main alternative. No dechallenge at the time of the report, which is what keeps it from "Certain".',
    naranjoNote:'Naranjo typically lands in the 5-8 "probable" band. The absence of a documented dechallenge and '
               +'rechallenge is what caps it.',
    contributors:['Falling eGFR (52 to 38) — the glimepiride is accumulating',
                  'Reduced food intake, self-initiated, while on an insulin secretagogue',
                  'Morning dose taken before eating',
                  'Enalapril, which potentiates the hypoglycaemic effect',
                  'Over-the-counter ibuprofen, which with the enalapril is very likely contributing to the renal decline that caused the accumulation'],
    alsoWrong:['Metformin is now contraindicated at eGFR 38 — well, it needs dose reduction below 45 and is '
              +'contraindicated below 30, so it requires review urgently.',
              'The ibuprofen plus enalapril combination is driving the renal decline and nobody has flagged it.',
              'The HbA1c of 6.1% in a 67-year-old on a sulfonylurea is too tight a target and is itself a safety problem.'],
    actions:['Stop the glimepiride, or reduce it substantially, and discuss with the prescriber today.',
             'Stop the over-the-counter ibuprofen and explain why.',
             'Review metformin dose against the current eGFR.',
             'Repeat renal function.','Relax the HbA1c target for a 67-year-old with renal impairment.',
             'Teach the patient and family to recognise and treat hypoglycaemia, and not to skip meals.',
             'File the ICSR, and follow it up for outcome after the change.'],
    lesson:'The reported complaint was "dizziness". The actual case was recurrent drug-induced hypoglycaemia in a '
          +'patient whose kidney function had quietly fallen, made worse by a painkiller she did not consider a '
          +'medicine and by eating less on her own initiative. Nothing in the original phone call said any of that. '
          +'It came out of asking what was missing, and then going and getting it.'}
};

/* ==================================================================== *
 * 8 · THE FOUR-HOUR SESSION PLAN                                       *
 * ==================================================================== */
var TIMETABLE = [
  {t:'20 min', s:'PV Basics — what is pharmacovigilance?', p:'basics', o:'Why reporting exists, who may report, and what happens to a report after it is filed.'},
  {t:'20 min', s:'How to read a medication safety case', p:'read',  o:'Extract patient, drug, indication, timing, event, action and outcome from a plain narrative.'},
  {t:'25 min', s:'Drug and ADR intelligence',            p:'drug',  o:'Use a drug card before assessing a reaction to that drug. Look it up rather than recall it.'},
  {t:'30 min', s:'Interactions, contraindications and patient factors', p:'inter', o:'Run a drug-drug check and a drug-disease check, and say what the pharmacist should do.'},
  {t:'30 min', s:'ADR identification and case validation', p:'adr',  o:'Decide which cases need investigating, list alternative causes, and confirm the four minimum elements.'},
  {t:'30 min', s:'Seriousness, severity and causality',   p:'serious', o:'Apply the seriousness criteria, separate seriousness from severity, and reach a causality category with reasons.'},
  {t:'25 min', s:'Coding the reaction',                   p:'code',  o:'Translate the patient’s words into a reported term and then a standardised term.'},
  {t:'30 min', s:'Creating the ICSR',                     p:'icsr',  o:'Build a report that would pass a quality check, and know why each field is there.'},
  {t:'20 min', s:'Follow-up and quality check',           p:'follow', o:'Decide what to chase, in what order, and inside what timeline.'},
  {t:'30 min', s:'Final team challenge',                  p:'final', o:'An incomplete case. Work out what is missing, get it, and take the case to a decision.'}
];

/* ==================================================================== *
 * 9 · WHAT THE THREE MODES CHANGE                                      *
 * ==================================================================== */
var MODES = {
  beginner:{k:'beginner', name:'Beginner', tag:'Teach me as I go',
    blurb:'Every concept is explained before you are asked to use it. Hints are available on every question, and a '
         +'first wrong answer is never marked wrong — you get a hint and another attempt. The reference desk is open '
         +'from the start.',
    hints:true, freeHints:99, explainFirst:true, secondChance:true, deskOpen:true, weight:1.0},
  intermediate:{k:'intermediate', name:'Intermediate', tag:'Fewer hints',
    blurb:'Explanations come after you answer rather than before. Two hints for the whole workshop. One retry on a '
         +'wrong answer, with partial credit.',
    hints:true, freeHints:2, explainFirst:false, secondChance:true, deskOpen:true, weight:1.15},
  challenge:{k:'challenge', name:'Challenge', tag:'Case and databases only',
    blurb:'No hints, no explanation until the debrief, no second attempt. You get the case and the reference desk, '
         +'and nothing else. This is how PV-X and a real safety desk work.',
    hints:false, freeHints:0, explainFirst:false, secondChance:false, deskOpen:true, weight:1.3}
};

/* ---------------------------------------------------------------- */
window.PVXLearnData = {
  DRUGS:DRUGS, INTERACTIONS:INTERACTIONS, DRUG_DISEASE:DRUG_DISEASE, RAG:RAG,
  TERMS:TERMS, READ_CASE:READ_CASE, COMPARE:COMPARE, SIGNAL_SET:SIGNAL_SET,
  FINAL:FINAL, TIMETABLE:TIMETABLE, MODES:MODES
};
})();
