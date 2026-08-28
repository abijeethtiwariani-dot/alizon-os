/* ALIZON AOS — Module 8 examination question bank
   AI-Enabled Clinical Case Studies & Simulations · 4 units × 25 MCQs
   Written as short clinical vignettes to match the case-based nature of the module */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M8'] = window.ALIZON_EXAM_M8 = {
  module: 'Module 8 · AI-Enabled Clinical Case Studies & Simulations',
  code: 'ALZ-PH-M8',
  n: 8,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'AI-Based Prescription Review & Safety Audits', hrs:7.5, qs:[

  {q:'A 72-year-old woman on warfarin is prescribed a five-day course of ciprofloxacin. The most important pharmacist action is to:',
   o:['Dispense as written','Halve the warfarin dose without monitoring','Recommend INR monitoring within 3–5 days, as ciprofloxacin inhibits warfarin metabolism and raises INR','Refuse to dispense the antibiotic'],c:2,
   e:'Ciprofloxacin inhibits <b>CYP1A2 and CYP3A4</b>, raising warfarin effect. The correct response is a specific management plan — early INR check — rather than either dispensing blindly or refusing.'},

  {q:'A prescription reads “Digoxin 0.25 mg OD” for an 84-year-old with eGFR 28. The pharmacist should:',
   o:['Dispense as written','Contact the prescriber — this dose is likely excessive in significant renal impairment and risks toxicity',
      'Substitute a different cardiac drug','Reduce the dose independently to 0.125 mg'],c:1,
   e:'Digoxin is <b>renally cleared with a narrow therapeutic index</b>. Age and eGFR 28 both demand a lower dose, but the pharmacist recommends rather than unilaterally alters.'},

  {q:'An AI prescription-review tool flags 40 orders on a ward round, of which 36 are dismissed as irrelevant. This indicates:',
   o:['Excellent sensitivity','Poor specificity, which will drive alert fatigue and eventual dismissal of the true positives',
      'The pharmacist is not reading carefully','The tool should be used more often'],c:1,
   e:'A 90% dismissal rate is the signature of <b>poor specificity</b>. The remedy is refining thresholds and context, not exhorting staff to read more carefully.'},

  {q:'A patient with a documented penicillin anaphylaxis is prescribed piperacillin–tazobactam. This should be treated as:',
   o:['A critical alert requiring the order to be stopped and the prescriber contacted immediately','A minor formulary matter','Acceptable if given slowly','Acceptable with antihistamine cover'],c:0,
   e:'Piperacillin is a <b>penicillin</b>. Documented anaphylaxis is an absolute contraindication and one of the few situations justifying a hard stop.'},

  {q:'A safety audit shows that 60% of insulin orders use the abbreviation “U” for units. The correct corrective action is:',
   o:['Remove the ability to enter “U” in the system and require “units” in full','Remind staff to write clearly','Add a warning poster','Accept it as common practice'],c:0,
   e:'“U” misread as a zero has caused tenfold insulin overdoses. A <b>system-level forcing function</b> outperforms reminders, which depend on vigilance.'},

  {q:'A pharmacist reviewing an AI-generated prescription audit notes the tool did not flag a serious interaction it should have detected. The priority action is:',
   o:['Ignore it, as no harm occurred','Report it so the rule can be checked, as silent rule failure after an update is a known and dangerous mode',
      'Stop using the tool entirely','Manually check every order forever'],c:1,
   e:'<b>Silent rule malfunction</b> is invisible precisely because nothing appears. A missed alert is a reportable system event, not a non-event.'},

  {q:'A 30-year-old woman of childbearing potential is prescribed sodium valproate for epilepsy. The pharmacist must verify:',
   o:['Only that the dose is correct','That the brand matches previous supply','Only the quantity supplied','That the conditions of the pregnancy prevention programme are met, including counselling and effective contraception'],c:3,
   e:'Valproate is highly teratogenic. Supply is governed by a <b>pregnancy prevention programme</b> with specific documented requirements, not clinical judgement alone.'},

  {q:'An audit finds paracetamol prescribed both regularly and as a separate PRN order for the same patient. The risk is:',
   o:['Cumulative overdose exceeding 4 g in 24 hours through therapeutic duplication','Under-treatment of pain','Reduced absorption','Interaction with food'],c:0,
   e:'<b>Therapeutic duplication</b> of paracetamol, often across regular and PRN orders or across brands, is a well-documented route to inadvertent hepatotoxicity.'},

  {q:'A prescription for methotrexate reads “2.5 mg daily” for rheumatoid arthritis. The pharmacist should:',
   o:['Dispense as written','Contact the prescriber urgently — methotrexate for this indication is a weekly dose, and daily administration can be fatal',
      'Supply a week’s quantity only','Change it to weekly and annotate'],c:1,
   e:'<b>Daily rather than weekly methotrexate</b> is a classic fatal error. The pharmacist must clarify with the prescriber, not silently amend a prescription.'},

  {q:'An AI tool recommends stopping a medicine as “potentially inappropriate” under Beers Criteria. The pharmacist should:',
   o:['Assess whether the criterion applies to this patient’s circumstances and discuss with the prescriber if it does','Stop it immediately','Ignore all such flags','Ask the patient to decide'],c:0,
   e:'Beers is a <b>screening tool, not a prohibition</b>. Some flagged medicines remain appropriate for a specific patient with an appropriate indication and monitoring.'},

  {q:'A patient on lithium is newly prescribed an ACE inhibitor. The pharmacist should recognise:',
   o:['No interaction of importance','That lithium should be stopped permanently','That ACE inhibitors reduce lithium clearance, raising levels, so lithium monitoring must be intensified','That the ACE inhibitor is contraindicated absolutely'],c:2,
   e:'Reduced renal lithium clearance can precipitate <b>lithium toxicity</b>. The combination is often necessary, so the management is closer monitoring, not automatic avoidance.'},

  {q:'A prescription audit reveals frequent omission of the indication on antibiotic orders. The main consequence is:',
   o:['Slower dispensing','Higher medicine costs only','Inability to assess appropriateness, review duration or support stewardship','Illegible prescriptions'],c:2,
   e:'Without an <b>indication</b> the antibiotic cannot be judged appropriate, reviewed at 48–72 hours or de-escalated — the core stewardship activities become impossible.'},

  {q:'A patient is prescribed both a non-selective NSAID and low-dose aspirin, with no gastroprotection. The pharmacist should:',
   o:['Dispense as written','Stop the aspirin','Recommend gastroprotection, as combined antiplatelet and NSAID use substantially raises upper gastrointestinal bleeding risk','Advise taking both with milk'],c:2,
   e:'The combination multiplies <b>GI bleeding risk</b>. A proton pump inhibitor is the standard recommendation where the combination cannot be avoided.'},

  {q:'An AI audit identifies a ward where dose omissions are three times the hospital average. The most useful first step is:',
   o:['Investigate the local causes — stock availability, workload, cabinet access or documentation practice','Discipline the ward staff','Increase stock on all wards','Report to the regulator'],c:0,
   e:'A localised outlier almost always has a <b>local system cause</b>. Understanding it precedes any intervention, and blame would suppress the reporting that revealed it.'},

  {q:'A prescription for a paediatric patient specifies a dose in mg/kg but no weight is recorded. The pharmacist should:',
   o:['Estimate the weight from age','Dispense the adult dose','Use the weight from a previous admission','Obtain a current documented weight before calculating and verifying the dose'],c:3,
   e:'The weight is the <b>input to the calculation</b>. An estimated or stale weight converts directly into a dosing error, and children change weight rapidly.'},

  {q:'A patient on clozapine has not had a recent full blood count. The pharmacist must:',
   o:['Supply and remind the patient','Supply a reduced quantity','Supply and notify the prescriber afterwards','Withhold supply until the mandatory monitoring result is confirmed, as required by the monitoring service'],c:3,
   e:'Clozapine supply is <b>conditional on documented haematological monitoring</b> because of the risk of agranulocytosis. This is one of the few absolute supply blocks in practice.'},

  {q:'An audit shows several patients receiving two medicines from the same class prescribed by different specialists. This indicates a failure of:',
   o:['Medication reconciliation and shared visibility of the medication list across settings','Individual prescriber competence','The dispensing robot','Patient adherence'],c:0,
   e:'Cross-specialty duplication is a <b>structural</b> failure of the shared record, not of individual prescribers who each acted reasonably on partial information.'},

  {q:'A prescription for an oral anticoagulant specifies a dose that does not match any licensed regimen. The pharmacist should:',
   o:['Round to the nearest licensed dose','Supply the higher licensed dose','Supply and monitor','Contact the prescriber to clarify before supply, as DOAC dosing is indication and renal-function specific'],c:3,
   e:'DOAC doses differ by <b>indication, renal function, age and weight</b>. Rounding or guessing risks either thrombosis or major bleeding.'},

  {q:'An AI prescription reviewer is trained on data from a tertiary hospital and deployed in a district hospital. The pharmacist should expect:',
   o:['Identical performance','Improved performance','No difference if the software is the same','Possible degradation, since case-mix, formulary and prescribing patterns differ'],c:3,
   e:'This is <b>dataset shift</b>. Local validation before reliance is required, whatever the reported performance in the development setting.'},

  {q:'During a safety audit, the most valuable metric for prescription review is:',
   o:['Number of prescriptions reviewed','Number and severity of clinically significant interventions accepted by prescribers',
      'Time taken per review','Number of pharmacists involved'],c:1,
   e:'<b>Accepted interventions weighted by severity</b> measures the harm actually prevented. Volume measures effort only.'},

  {q:'A patient’s record shows an allergy entered as free text: “reacts badly to sulfa”. The pharmacist should:',
   o:['Leave it as written','Delete it as unclear','Clarify and code the allergy properly, as free text is invisible to automated checking','Assume it means sulfonylureas'],c:2,
   e:'Only a <b>coded</b> allergy is checked automatically. Leaving it as free text means the checking engine will not see it, however clearly a human reads it.'},

  {q:'An elderly patient is prescribed three medicines with anticholinergic properties. The pharmacist should:',
   o:['Consider each medicine individually only','Calculate the cumulative anticholinergic burden and discuss deprescribing options, given falls and cognitive risk',
      'Stop all three immediately','Take no action as each dose is low'],c:1,
   e:'The harm is <b>cumulative</b>. Assessing drugs individually misses a burden that collectively causes confusion, falls and functional decline.'},

  {q:'A prescription-review AI produces a recommendation with no supporting reasoning. The pharmacist should:',
   o:['Follow it, as the system is validated','Forward it to the prescriber unchanged','Not act on it until the basis can be understood and verified against the patient and an authoritative source','Record it and ignore it'],c:2,
   e:'An unexplained recommendation cannot be <b>professionally justified</b> if challenged. Verification against source and patient is required before action.'},

  {q:'The most appropriate use of AI in prescription review is to:',
   o:['Replace pharmacist verification','Approve routine prescriptions automatically','Generate prescriptions','Prioritise the review queue so that the highest-risk prescriptions reach a pharmacist first'],c:3,
   e:'<b>Triage</b> is the realistic and valuable application. It changes the order of work, not the requirement for professional verification.'},

  {q:'A safety audit finds that most interventions are documented only in the pharmacy system, not the shared record. The consequence is:',
   o:['The treating team cannot see the intervention, so it is far less likely to change care','Improved confidentiality','Faster documentation','Reduced duplication'],c:0,
   e:'An intervention recorded where the clinical team does not look has <b>no clinical effect</b> and cannot be followed up or audited by others.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'Drug Interaction & Dose Optimisation Simulations', hrs:7.5, qs:[

  {q:'A patient stabilised on warfarin (INR 2.5) starts clarithromycin. Three days later the INR is 6.2 with bruising. The immediate priority is:',
   o:['Continue warfarin and recheck in a week','Withhold warfarin, assess bleeding, consider vitamin K per protocol, and stop or change the interacting antibiotic',
      'Increase the warfarin dose','Give a further dose of clarithromycin'],c:1,
   e:'INR above 6 with bleeding requires <b>immediate action</b>: withhold, assess, reverse per protocol, and remove the precipitant. Recording it as an ADR follows.'},

  {q:'A patient on simvastatin 40 mg is prescribed clarithromycin. The safest management is:',
   o:['Withhold the statin for the duration of the antibiotic course','Continue both at full dose','Double the statin dose','Change to a different statin at higher dose'],c:0,
   e:'Clarithromycin inhibits CYP3A4, raising simvastatin exposure and <b>rhabdomyolysis risk</b>. A short statin holiday carries negligible cardiovascular risk.'},

  {q:'A 68-year-old with eGFR 42 and HbA1c 9.4% is on metformin 1 g twice daily. The correct action regarding metformin is:',
   o:['Reduce to a maximum of 1000 mg daily, as this exceeds the permitted dose at eGFR 30–44','Increase the dose','Stop it entirely','Leave unchanged'],c:0,
   e:'At <b>eGFR 30–44</b> metformin is capped at 1000 mg daily and stopped below 30. The current 2 g daily is itself a prescribing error to correct.'},

  {q:'The same patient has atrial fibrillation, an INR of 1.0 and is taking aspirin 75 mg. The correct antithrombotic management is:',
   o:['Continue aspirin alone','Add a DOAC to the aspirin','Stop aspirin and start a renally dosed direct oral anticoagulant','Start clopidogrel instead'],c:2,
   e:'Aspirin does not prevent <b>cardioembolic stroke</b> and has no separate indication here. Continuing it alongside an anticoagulant only adds bleeding risk.'},

  {q:'A patient taking a DOAC develops acute kidney injury with creatinine clearance falling to 25 mL/min. The correct action is:',
   o:['Stop the anticoagulant permanently','Review and adjust the dose or agent for the reduced clearance, without leaving the patient unprotected',
      'Continue the same dose','Add aspirin as cover'],c:1,
   e:'Stroke risk does not pause during AKI. The response is <b>dose or agent review</b>, not withdrawal, and certainly not substitution with an antiplatelet.'},

  {q:'A patient on an SSRI is started on tramadol and becomes agitated with tremor, hyperreflexia and fever. The likely diagnosis is:',
   o:['Opioid withdrawal','Serotonin syndrome','Anticholinergic toxicity','Hypoglycaemia'],c:1,
   e:'The triad of <b>neuromuscular excitation, autonomic instability and altered mental state</b> after adding a serotonergic drug is serotonin syndrome — a medical emergency.'},

  {q:'A patient on amiodarone requires warfarin. The pharmacist should anticipate:',
   o:['No interaction','An immediate fall in INR','That amiodarone must be stopped','A need to reduce the warfarin dose and monitor INR closely for several weeks, given amiodarone’s long half-life'],c:3,
   e:'Amiodarone’s <b>very long half-life</b> means the interaction builds over weeks and persists for weeks after stopping — prolonged monitoring is essential.'},

  {q:'A patient taking St John’s wort is prescribed a DOAC. The pharmacist should advise:',
   o:['That St John’s wort induces metabolism and transport, reducing anticoagulant effect and risking thrombosis','No action is needed','To double the DOAC dose','To take them at different times'],c:0,
   e:'<b>St John’s wort</b> induces CYP3A4 and P-glycoprotein, lowering DOAC exposure. Patients rarely volunteer herbal use, so it must be asked about directly.'},

  {q:'A patient on methotrexate is prescribed trimethoprim for a urinary infection. The concern is:',
   o:['Reduced antibiotic efficacy','Additive antifolate effect causing severe myelosuppression',
      'Increased renal clearance of methotrexate','No clinically relevant interaction'],c:1,
   e:'Both drugs are <b>antifolates</b>. The combination has caused fatal pancytopenia and should be avoided; an alternative antibiotic is required.'},

  {q:'A patient with a QT-prolonging antipsychotic is prescribed a macrolide. The pharmacist should:',
   o:['Assess cumulative QT risk, check electrolytes and ECG, and consider a non-QT-prolonging alternative','Dispense without comment','Halve both doses','Advise the patient to rest'],c:0,
   e:'Additive QT prolongation risks <b>torsades de pointes</b>, and risk rises further with hypokalaemia or hypomagnesaemia — which must be checked and corrected.'},

  {q:'A vancomycin trough is taken two hours after the dose rather than immediately before the next one. The result should be:',
   o:['Used to adjust the dose','Halved to estimate the trough','Regarded as uninterpretable, and the sample repeated at the correct time','Reported as a peak level'],c:2,
   e:'A <b>mistimed level</b> is not a trough. Acting on it risks an inappropriate dose change in either direction.'},

  {q:'A patient on digoxin develops nausea, visual disturbance and bradycardia. The pharmacist should suspect:',
   o:['Viral illness','Anxiety','Digoxin toxicity, and recommend a level with electrolytes and renal function','A drug allergy'],c:2,
   e:'This classic triad suggests <b>digoxin toxicity</b>, commonly precipitated by renal decline, hypokalaemia or an interacting drug such as amiodarone.'},

  {q:'Which electrolyte disturbance most increases the risk of digoxin toxicity at a given level?',
   o:['Hypokalaemia','Hypernatraemia','Hypercalcaemia only','Hypochloraemia'],c:0,
   e:'<b>Hypokalaemia</b> increases digoxin binding at the sodium–potassium pump, so toxicity can occur at concentrations within the usual range.'},

  {q:'A patient on an ACE inhibitor, spironolactone and a potassium supplement presents with potassium 6.3 mmol/L. The most important immediate action is:',
   o:['Recheck in a week','Increase the ACE inhibitor','Advise a high-potassium diet','Treat the hyperkalaemia urgently and stop the contributing agents, starting with the potassium supplement and spironolactone'],c:3,
   e:'Potassium above 6 is a <b>medical emergency</b>. Three additive potassium-raising agents together is a preventable prescribing pattern.'},

  {q:'A simulation shows a patient receiving gentamicin with a rising trough level. This indicates:',
   o:['Underdosing','The need for a higher dose','Accumulation, requiring an extended dosing interval to allow adequate clearance between doses','A laboratory error'],c:2,
   e:'A rising trough signals <b>accumulation</b>. For aminoglycosides the trough is the toxicity marker, and the correct adjustment is usually to the interval.'},

  {q:'Carbapenem therapy in a patient on sodium valproate risks:',
   o:['Increased valproate levels','A marked fall in valproate concentration with loss of seizure control',
      'No interaction','Increased carbapenem toxicity'],c:1,
   e:'Carbapenems reduce valproate levels substantially and unpredictably. The combination should be <b>avoided</b>; dose escalation does not reliably compensate.'},

  {q:'A patient on a proton pump inhibitor is started on clopidogrel after stenting. The pharmacist should:',
   o:['Stop the PPI in all cases','Double the clopidogrel dose','Consider a PPI with less CYP2C19 inhibition, such as pantoprazole, where gastroprotection is indicated','Stop the clopidogrel'],c:2,
   e:'Omeprazole and esomeprazole inhibit <b>CYP2C19</b>, which activates clopidogrel. Where a PPI is genuinely indicated, choosing a weaker inhibitor is the pragmatic resolution.'},

  {q:'A dose optimisation simulation for a patient with obesity should account for:',
   o:['Total body weight for every drug','Ideal body weight for every drug','Age only','The drug’s distribution characteristics, since hydrophilic and lipophilic agents require different weight descriptors'],c:3,
   e:'Some drugs dose on <b>ideal or adjusted body weight</b> and others on total body weight, depending on lipophilicity and volume of distribution. One rule does not fit all.'},

  {q:'A patient receiving an infusion develops a precipitate in the line when two drugs are co-administered. This is:',
   o:['A pharmacokinetic interaction','A pharmacodynamic interaction','An allergic reaction','A physicochemical incompatibility, requiring separate lines or flushing between drugs'],c:3,
   e:'<b>Incompatibility</b> occurs in the line, not the body. Infusing a precipitate risks embolism, so the infusion must be stopped and the line changed.'},

  {q:'In a simulation, a patient on multiple sedatives has a respiratory rate of 8. The pharmacist should:',
   o:['Escalate immediately and review the cumulative sedative burden, with naloxone available if opioids are involved','Continue as prescribed','Increase the analgesia','Wait for the next observation round'],c:0,
   e:'A respiratory rate of 8 with cumulative sedation is a <b>pre-arrest sign</b>. Immediate escalation and review of the additive burden are required.'},

  {q:'A dose optimisation tool suggests a dose above the licensed maximum for a resistant infection. The pharmacist should:',
   o:['Refuse outright','Accept it without question','Halve the suggested dose','Evaluate the pharmacokinetic rationale, confirm with a specialist, document the justification and monitoring plan'],c:3,
   e:'Above-licence dosing is sometimes clinically justified. What is required is <b>specialist agreement, documented rationale and an explicit monitoring plan</b>.'},

  {q:'A simulation involves a patient on phenytoin with a low total level but normal free level and hypoalbuminaemia. The correct interpretation is:',
   o:['The dose should be increased','Phenytoin should be stopped','A different anticonvulsant is required','The total level is misleading in hypoalbuminaemia; the free level is therapeutic and no increase is needed'],c:3,
   e:'Phenytoin is highly <b>protein bound</b>. In hypoalbuminaemia the total level underestimates the active free fraction, and increasing the dose risks toxicity.'},

  {q:'A patient reports taking their weekly methotrexate every day for four days. The pharmacist should:',
   o:['Advise stopping and resuming next week','Treat as a medical emergency, arrange urgent assessment with full blood count and consider folinic acid rescue',
      'Advise increased fluid intake only','Reassure the patient'],c:1,
   e:'Four consecutive daily doses of methotrexate risks <b>severe mucositis and bone marrow suppression</b>. This requires urgent assessment, not reassurance.'},

  {q:'In an interaction simulation, the most valuable pharmacist output is:',
   o:['A prioritised assessment with a specific management recommendation for each clinically relevant interaction','A list of every interaction found','A copy of the database entry','A referral to the prescriber'],c:0,
   e:'Listing interactions transfers the work. The professional contribution is <b>prioritisation and a concrete plan</b>: avoid, adjust, or monitor with specified parameters.'},

  {q:'When a simulation presents conflicting severity gradings from two databases, the correct approach is:',
   o:['Take the more severe','Take the less severe','Evaluate the underlying evidence and the individual patient’s risk factors before deciding',
      'Report both and take no action'],c:2,
   e:'Databases disagree because their gradings are generic. The resolution comes from the <b>evidence and this patient</b> — dose, duration, renal function and monitoring available.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Clinical & Pharmacogenomic Case Simulations', hrs:7.5, qs:[

  {q:'A child undergoing tonsillectomy is prescribed codeine post-operatively. Current guidance is that codeine:',
   o:['Is first-line in this setting','Is contraindicated in children after tonsillectomy because of deaths in ultrarapid metabolisers',
      'Should be given at double dose','Is safe if given with paracetamol'],c:1,
   e:'Deaths from <b>respiratory depression in CYP2D6 ultrarapid metabolisers</b> led to regulatory contraindication in this exact population.'},

  {q:'A patient reports that codeine has never relieved their pain. A plausible pharmacogenomic explanation is:',
   o:['They are a CYP2D6 poor metaboliser and convert little codeine to morphine','They are a CYP2D6 ultrarapid metaboliser','They have a penicillin allergy','They absorb codeine too quickly'],c:0,
   e:'Codeine is a <b>prodrug</b>. Poor metabolisers, roughly 5–10% of many populations, obtain little analgesia and need an alternative that does not require activation.'},

  {q:'A patient of Han Chinese descent is to start carbamazepine. Best practice is to:',
   o:['Screen for HLA-B*15:02 before initiation, given the strong association with Stevens–Johnson syndrome','Start at a low dose without testing','Avoid all anticonvulsants','Test after the first month'],c:0,
   e:'The <b>HLA-B*15:02</b> association is strong and the allele is markedly more prevalent in South-East Asian populations, making pre-treatment screening worthwhile there.'},

  {q:'Before starting abacavir, the mandatory pharmacogenomic test is:',
   o:['CYP2C19','TPMT','DPYD','HLA-B*57:01'],c:3,
   e:'<b>HLA-B*57:01</b> predicts abacavir hypersensitivity, which can be fatal on rechallenge. Screening before initiation is firmly established practice.'},

  {q:'A patient with inflammatory bowel disease is to start azathioprine. Testing TPMT and NUDT15 identifies risk of:',
   o:['Severe myelosuppression at standard doses','Treatment failure','Hepatic fibrosis','Allergic rash'],c:0,
   e:'Deficient activity causes accumulation of active thiopurine metabolites and <b>profound marrow suppression</b>. Dose reduction or an alternative agent is required.'},

  {q:'A patient is to receive capecitabine. DPYD genotyping predicts risk of:',
   o:['Reduced tumour response','Hair loss only','Infusion site reactions','Severe and potentially fatal fluoropyrimidine toxicity'],c:3,
   e:'<b>DPD deficiency</b> impairs 5-FU catabolism, causing severe mucositis, diarrhoea and myelosuppression. Pre-treatment genotyping with dose reduction is now standard in many systems.'},

  {q:'A patient with a recent coronary stent is a CYP2C19 poor metaboliser. Regarding clopidogrel:',
   o:['No change is needed','The dose should be quartered','Antiplatelet effect will be reduced, and an alternative such as prasugrel or ticagrelor should be considered','Clopidogrel should be combined with warfarin'],c:2,
   e:'Clopidogrel requires <b>CYP2C19 activation</b>. Poor metabolisers have higher stent thrombosis rates, so a non-CYP2C19-dependent agent is preferred where suitable.'},

  {q:'A patient develops myopathy on simvastatin 80 mg. A relevant pharmacogenomic factor is:',
   o:['HLA-B*57:01','SLCO1B1 reduced-function variants raising statin exposure','TPMT deficiency','DPYD deficiency'],c:1,
   e:'<b>SLCO1B1</b> encodes a hepatic uptake transporter; reduced function raises plasma statin concentration, and the association is strongest with high-dose simvastatin.'},

  {q:'A patient requires warfarin. VKORC1 and CYP2C9 genotyping would inform:',
   o:['Whether warfarin is contraindicated','The target INR','The duration of therapy','The likely starting dose requirement, as these variants explain much of the inter-patient variation'],c:3,
   e:'<b>VKORC1</b> affects target sensitivity and <b>CYP2C9</b> affects clearance. Genotype-guided dosing can shorten the time to stable INR, though INR monitoring remains essential.'},

  {q:'A pharmacogenomic result should be recorded permanently in the patient record because:',
   o:['It expires after two years','Genotype does not change and will be relevant to prescribing decisions throughout the patient’s life',
      'It is required for billing','It replaces future monitoring'],c:1,
   e:'Unlike most results, genotype is <b>lifelong</b>. Recording it in a retrievable, coded form converts a one-off test into a permanent clinical asset.'},

  {q:'A simulation presents a patient with a known pharmacogenomic variant and a drug unaffected by that gene. The correct action is:',
   o:['Take no genotype-based action, as the variant is not relevant to this medicine','Adjust the dose anyway','Avoid the drug','Order further genetic testing'],c:0,
   e:'A result is only actionable where the <b>gene–drug pair is established</b>. Applying an unrelated variant is a misuse of the information.'},

  {q:'CPIC guidelines answer which question?',
   o:['Whether a patient should be tested','Given an available genotype result, what prescribing action should follow',
      'Which laboratory to use','How much testing costs'],c:1,
   e:'<b>CPIC</b> deliberately addresses only what to do with a result already available, which is the question clinicians most often face.'},

  {q:'A 78-year-old on eight medicines presents with falls and confusion. The most likely medication-related contributor is:',
   o:['Insufficient dosing','Allergy to an excipient','Poor adherence only','Cumulative anticholinergic and sedative burden'],c:3,
   e:'<b>Cumulative anticholinergic and sedative load</b> is a leading and highly modifiable cause of falls and delirium in older adults.'},

  {q:'In a deprescribing simulation for a frail elderly patient, the first medicine to consider stopping is one that:',
   o:['Has no current indication, or whose risk now outweighs benefit given limited life expectancy','Is the most expensive','Was started most recently','Has the most tablets per day'],c:0,
   e:'Deprescribing starts with <b>indication and benefit–risk in the current context</b>, particularly where time-to-benefit exceeds likely life expectancy.'},

  {q:'A patient with severe hepatic impairment is prescribed a medicine extensively metabolised by the liver. The pharmacist should:',
   o:['Use the standard dose','Double the dose','Assess whether dose reduction or an alternative with non-hepatic clearance is needed, and plan closer monitoring','Withhold all medicines'],c:2,
   e:'Hepatic impairment affects clearance, protein binding and first-pass metabolism unpredictably, so <b>reduced dosing with closer monitoring</b> is the general principle.'},

  {q:'A pregnant patient at 8 weeks is taking an ACE inhibitor for hypertension. The pharmacist should:',
   o:['Continue unchanged','Halve the dose','Escalate urgently — ACE inhibitors are foetotoxic and must be switched to a pregnancy-appropriate agent','Add a diuretic'],c:2,
   e:'ACE inhibitors cause <b>foetal renal damage and oligohydramnios</b>. Switching to labetalol, methyldopa or nifedipine is required.'},

  {q:'A breastfeeding mother requires an antibiotic. The pharmacist should assess:',
   o:['Only the mother’s allergy history','Transfer into milk, infant exposure and any infant risk, selecting an agent with an established safety profile in lactation',
      'Only the cost','Whether breastfeeding should be stopped'],c:1,
   e:'Most antibiotics are compatible with breastfeeding. Advising cessation is rarely necessary and carries its own harms, so <b>agent selection</b> is the better route.'},

  {q:'A patient with chronic kidney disease stage 4 is prescribed a standard-dose NSAID. The pharmacist should:',
   o:['Dispense as written','Halve the dose and dispense','Recommend avoiding the NSAID, as it risks further renal decline, fluid retention and hyperkalaemia','Add gastroprotection and dispense'],c:2,
   e:'NSAIDs reduce renal perfusion and are generally <b>avoided in advanced CKD</b>, particularly alongside an ACE inhibitor or ARB and a diuretic.'},

  {q:'In a case simulation, a patient’s renal function has fallen sharply since admission. Doses calculated from the admission creatinine are:',
   o:['Still valid','Automatically corrected by the system','Only relevant for antibiotics','Potentially unsafe, as they reflect a renal function the patient no longer has'],c:3,
   e:'Dosing must follow <b>current</b> renal function. Estimating equations also lag in rapidly changing function, so trend and clinical judgement matter.'},

  {q:'A patient with sepsis has hypoalbuminaemia and increased renal clearance. For a hydrophilic antibiotic this may mean:',
   o:['Higher than expected concentrations','Lower than expected concentrations, risking underdosing and treatment failure',
      'No change from normal','That the antibiotic should be stopped'],c:1,
   e:'<b>Augmented renal clearance and expanded volume of distribution</b> in sepsis frequently cause subtherapeutic concentrations of hydrophilic antibiotics.'},

  {q:'A simulation requires a decision on an unlicensed use of a medicine. The pharmacist should:',
   o:['Establish the evidence base, confirm informed consent and prescriber responsibility, and document the rationale','Refuse in all cases','Proceed without documentation','Treat it as identical to licensed use'],c:0,
   e:'Off-label use is often clinically necessary and lawful. What is required is <b>evidence, consent and documentation</b>, with responsibility clearly held by the prescriber.'},

  {q:'A patient with a nasogastric tube is prescribed a modified-release tablet. The pharmacist should:',
   o:['Recommend an alternative formulation, as crushing a modified-release product can cause dose dumping','Crush and administer it','Give a double dose','Dissolve it in hot water'],c:0,
   e:'Crushing modified-release products destroys the release mechanism, causing <b>dose dumping</b> and potential toxicity. A liquid or immediate-release equivalent is needed.'},

  {q:'A case simulation presents a patient with three specialists each managing one condition. The pharmacist’s distinctive contribution is to:',
   o:['Choose between the specialists’ plans','Reduce the number of medicines to five','Refer the patient elsewhere','Review the whole regimen for interactions, duplication and cumulative burden that no single specialist sees'],c:3,
   e:'The pharmacist holds the only <b>whole-regimen view</b>. Each specialist is optimising within their domain; the interactions between domains are where harm accumulates.'},

  {q:'When a simulated patient declines a recommended medicine, the pharmacist should:',
   o:['Insist on the recommendation','Report the patient','Explore the reasons, provide information, respect the informed decision and document it','Dispense anyway'],c:2,
   e:'A competent patient may decline any treatment. The professional obligation is to ensure the decision is <b>informed</b>, then to respect and document it.'},

  {q:'The most important learning outcome from a clinical case simulation is:',
   o:['Memorising the correct answers','Completing it quickly','Developing a reproducible reasoning process that can be applied to unfamiliar cases','Achieving a high score'],c:2,
   e:'Cases are vehicles for <b>transferable reasoning</b>. A student who memorises outcomes without the process cannot handle the next, different patient.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Digital Patient Care & Pharmacy Operations', hrs:7.5, qs:[

  {q:'A patient collects their inhaler but demonstrates poor technique on video review. The most effective intervention is:',
   o:['Direct technique correction with demonstration and teach-back, then reassessment','Supplying a leaflet','Changing to a different drug','Doubling the dose'],c:0,
   e:'<b>Teach-back</b> — the patient demonstrating rather than agreeing — is what confirms the technique has actually transferred.'},

  {q:'A digital adherence dashboard shows a patient collecting their statin at 40% of expected frequency. The best first step is:',
   o:['Record non-adherence in the notes','Stop the statin','Reduce the quantity supplied','Ask the patient openly and without judgement why, since cost, side effects, beliefs and complexity all require different responses'],c:3,
   e:'Non-adherence is a <b>symptom with several possible causes</b>. The intervention must match the cause, which only the patient can identify.'},

  {q:'A patient discharged on eight medicines, three of them new, is at highest risk of:',
   o:['Allergy','Overdose from a single agent','A medication discrepancy or duplication between hospital and community records','Non-collection of the prescription'],c:2,
   e:'<b>Transitions of care</b> are where medication information is lost or duplicated. A structured discharge summary stating what changed and why is the key control.'},

  {q:'The most valuable element of a discharge medication summary for the community team is:',
   o:['The full admission history','The hospital’s contact details','A clear statement of what medicines changed, what stopped, what started and why','The patient’s ward number'],c:2,
   e:'“What changed and why” is the element <b>most often omitted and most often needed</b>. Without it, community teams frequently reinstate deliberately stopped medicines.'},

  {q:'A pharmacy operations dashboard should be designed to answer:',
   o:['How busy was last year?','What needs attention right now?',
      'Which staff work fastest?','How much profit was made?'],c:1,
   e:'An operational dashboard is an <b>exception display</b>. Historical analysis belongs in periodic reports, not the live screen.'},

  {q:'Turnaround time for inpatient prescriptions is best monitored using:',
   o:['The distribution, particularly the proportion exceeding the agreed target','The mean only','The single fastest time','The total number processed'],c:0,
   e:'A good average conceals a tail of very long waits, and it is those <b>outliers</b> that translate into missed doses.'},

  {q:'A missed dose recorded on the eMAR because the medicine was unavailable indicates a failure in:',
   o:['Nursing practice','The patient’s adherence','The prescriber’s judgement','The supply chain or ward stock process, which should be investigated as a safety issue'],c:3,
   e:'Missed doses from unavailability are <b>system failures</b> and a recognised source of patient harm, particularly for time-critical medicines.'},

  {q:'Time-critical medicines such as those for Parkinson’s disease require:',
   o:['Standard ward rounds','Weekly review only','Administration within a narrow window of the prescribed time, with specific provision to prevent omission','Storage in the pharmacy'],c:2,
   e:'Delayed Parkinson’s medication causes rapid deterioration that can take days to reverse. Such medicines need <b>protected administration timing</b>.'},

  {q:'A telepharmacy follow-up identifies that a patient has not started a newly prescribed medicine. The pharmacist should:',
   o:['Record it and close the case','Explore the reason, address it, and confirm a plan with the patient and prescriber',
      'Report the patient to the prescriber only','Arrange automatic delivery'],c:1,
   e:'<b>Primary non-adherence</b> — never starting — is common and invisible unless someone asks. The value of the contact lies in resolving the reason.'},

  {q:'A patient portal message from a patient describing chest pain should be:',
   o:['Answered within the standard 48-hour target','Forwarded to the prescriber routinely','Escalated immediately, with the patient directed to emergency care','Answered with an information leaflet'],c:2,
   e:'Asynchronous channels are unsuitable for emergencies. Services must have <b>triage and escalation</b> for red flags arriving through non-urgent routes.'},

  {q:'A pharmacy service redesign reduces dispensing time but increases prescription queries. This suggests:',
   o:['The redesign is a success','Prescribers are performing worse','A step was removed that had been catching problems earlier, moving work rather than eliminating it','The measurement is wrong'],c:2,
   e:'Improvement must be assessed <b>across the whole system</b>. Speed gained by shifting work downstream is not a genuine improvement.'},

  {q:'When implementing a new digital workflow, the most reliable predictor of success is:',
   o:['The sophistication of the software','Involvement of frontline staff in design and adequate training and support at go-live',
      'The size of the budget','The vendor’s reputation'],c:1,
   e:'Adoption, not capability, determines outcome. Systems designed without the people who use them generate <b>workarounds</b> that undo the intended benefit.'},

  {q:'A digital patient care record shows conflicting allergy information from two sources. The pharmacist should:',
   o:['Use the more recent entry','Use the more severe entry','Delete both entries','Reconcile with the patient directly and correct the record, documenting the source of the confirmed information'],c:3,
   e:'Allergy discrepancies must be <b>resolved with the patient</b> and corrected at source, with provenance recorded — not settled by recency or severity.'},

  {q:'Remote monitoring data arrives showing a patient’s blood pressure consistently above target. Governance requires:',
   o:['That the data be stored only','That the patient interpret it','Monthly review at most','A named clinician responsible for reviewing it and a defined threshold and pathway for action'],c:3,
   e:'Unreviewed monitoring data creates an <b>illusion of care</b> and real liability. Responsibility and thresholds must be agreed before monitoring begins.'},

  {q:'A simulation of a pharmacy during a system outage should test:',
   o:['Only the technical recovery','Only staff attendance','Only the vendor’s response time','The clinical contingency — manual verification, access to stock, prioritisation and later reconciliation'],c:3,
   e:'Outage simulations must rehearse the <b>clinical workaround</b>, since that is what protects patients while the technical recovery proceeds.'},

  {q:'The most appropriate measure of a digital pharmacy service’s patient impact is:',
   o:['Clinical outcomes such as adherence improvement, interventions accepted and harm avoided','Number of logins','Time on the platform','Number of messages sent'],c:0,
   e:'Engagement metrics measure <b>use</b>. Only clinical outcomes demonstrate that the service changed anything for patients.'},

  {q:'Patients who cannot access digital services should be:',
   o:['Provided with equivalent non-digital access, since digital-only provision widens inequity','Excluded from the service','Required to obtain a smartphone','Referred elsewhere'],c:0,
   e:'A digital-only service can <b>worsen the inequity</b> it was meant to reduce. Maintaining alternative routes is an equity requirement.'},

  {q:'A pharmacist notices that an AI triage tool consistently deprioritises non-English-speaking patients. This should be:',
   o:['Accepted as a limitation','Escalated as a potential algorithmic bias issue requiring investigation and correction',
      'Corrected by the pharmacist manually each time','Ignored if overall performance is good'],c:1,
   e:'Systematic disadvantage to a group is <b>algorithmic bias</b>, not a quirk. Manual correction treats the symptom; investigation and correction address the cause.'},

  {q:'Documentation of a digital consultation should include:',
   o:['Only the outcome','The same clinical content as an in-person consultation, plus the medium used and consent obtained',
      'Only the duration','Only the medicines discussed'],c:1,
   e:'Remote consultations require the <b>same standard plus</b> medium and consent, so a later reader can judge that remote care was appropriate.'},

  {q:'An operations simulation shows the pharmacy consistently short-staffed at a predictable daily peak. The correct response is:',
   o:['Ask staff to work faster','Reduce the service offered','Match staffing to the demand profile, since predictable peaks are a rostering problem rather than a performance problem','Extend everyone’s hours'],c:2,
   e:'A <b>predictable</b> peak is a planning failure. Asking people to absorb it through effort produces errors and burnout.'},

  {q:'When an AI system and a pharmacist disagree in a simulation, the appropriate resolution is:',
   o:['The AI decides','The pharmacist investigates the basis of the recommendation and documents the reasoning for the final decision',
      'Escalate every disagreement','The pharmacist always overrides without review'],c:1,
   e:'Neither deference nor reflexive dismissal is professional. Understanding <b>why</b> the system advises what it does, and documenting the reasoning, is the defensible course.'},

  {q:'The purpose of debriefing after a clinical simulation is to:',
   o:['Convert the experience into transferable learning by examining the reasoning behind decisions','Rank the participants','Complete the paperwork','Identify who performed worst'],c:0,
   e:'Evidence consistently shows that <b>debriefing, not the simulation itself</b>, produces most of the learning. The focus is reasoning, not outcome.'},

  {q:'A simulation in which a student makes a serious error and then corrects it after seeing the consequence is:',
   o:['Highly valuable, since consequence-based learning in a safe environment is the point of simulation','A failure of the simulation','Grounds for removing the student','Evidence the simulation is too difficult'],c:0,
   e:'Simulation exists so that errors happen <b>where no patient is harmed</b>. An error followed by correction is the intended outcome, not a failure.'},

  {q:'The overarching professional principle across all digital pharmacy practice is that:',
   o:['The pharmacist remains accountable for the clinical decision, whatever tool informed it','Technology decisions rest with the IT department','Accountability is shared with the software vendor','Digital practice has lower standards than in-person practice'],c:0,
   e:'Software cannot hold a registration or answer to a patient. <b>Accountability stays with the professional</b>, which is why understanding and verifying the tool is part of the job.'},

  {q:'The most important question for a pharmacist to ask of any new digital tool is:',
   o:['Is it the newest available?','Is it the cheapest?','Does it have the most features?','Does it make safe practice easier, and what new failure modes does it introduce?'],c:3,
   e:'Every tool <b>removes some errors and creates others</b>. Asking both halves of the question is what distinguishes informed adoption from technology enthusiasm.'}
  ]}

  ]
};
