/* ALIZON OS — Module 3 examination question bank
   AI-Based Clinical Decision Support in Pharmacy · 4 units × 25 MCQs         */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M3'] = window.ALIZON_EXAM_M3 = {
  module: 'Module 3 · AI-Based Clinical Decision Support in Pharmacy',
  code: 'ALZ-PH-M3',
  n: 3,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'Clinical Decision Support Systems (CDSS)', hrs:7.5, qs:[

  {q:'A Clinical Decision Support System is best defined as software that:',
   o:['Replaces the clinician for routine decisions','Stores clinical records for later retrieval','Links patient-specific data to a knowledge base to generate patient-specific assessments or recommendations at the point of care','Automates billing for clinical services'],c:2,
   e:'The defining features are <b>patient-specific data</b>, a <b>knowledge base</b>, and delivery <b>at the point of decision</b>. A system that merely stores data is a record, not decision support.'},

  {q:'The difference between knowledge-based and non-knowledge-based CDSS is that the latter:',
   o:['Uses explicit IF–THEN rules written by experts',
      'Learns patterns from data using machine learning rather than following pre-written rules',
      'Requires no patient data','Works only for laboratory results'],c:1,
   e:'<b>Knowledge-based</b> systems encode expert rules explicitly. <b>Non-knowledge-based</b> systems infer patterns from data, which makes them powerful but far harder to explain and validate.'},

  {q:'Which is an example of active, rather than passive, decision support?',
   o:['A reference monograph the pharmacist may choose to open',
      'An unprompted alert that fires when a contraindicated order is entered',
      'A printed formulary on the desk','A textbook in the pharmacy'],c:1,
   e:'<b>Active</b> support intervenes without being asked. <b>Passive</b> support waits to be consulted, and therefore only helps the clinician who already suspects a problem.'},

  {q:'The “five rights” of clinical decision support state that support must deliver:',
   o:['The right information, to the right person, in the right format, through the right channel, at the right time','The right dose, route, patient, time and drug','The right price, supplier, quantity, batch and expiry','The right diagnosis, test, referral, follow-up and record'],c:0,
   e:'The CDSS five rights are about <b>delivery</b>, not medication. Correct content shown to the wrong person, or after the decision is made, changes nothing.'},

  {q:'Alert fatigue is best measured by:',
   o:['The override rate — the proportion of alerts dismissed without action','The total number of alerts generated','The size of the alert window','How quickly the system loads'],c:0,
   e:'A high <b>override rate</b> is the operational signature of alert fatigue. Override rates above roughly 90% are commonly reported for interaction alerts, indicating the alerts are not earning their interruption.'},

  {q:'The most effective way to reduce alert fatigue is to:',
   o:['Make alerts larger and more colourful','Increase the severity threshold and tailor alerts to patient context so fewer, more relevant alerts fire',
      'Require a password for each override','Turn off all alerts'],c:1,
   e:'The problem is <b>specificity</b>, not visibility. Filtering by severity and patient context reduces volume while preserving the alerts that matter.'},

  {q:'“Interruptive” alerts should be reserved for:',
   o:['All drug interactions','Formulary preferences','Cost-saving suggestions','Situations where proceeding without acting would cause serious harm'],c:3,
   e:'Interruption is a scarce resource. Reserving it for <b>serious harm</b> preserves its signalling value; spending it on formulary or cost messages destroys it.'},

  {q:'A CDSS recommends a dose reduction based on an eGFR that is three months old. The pharmacist should:',
   o:['Check whether current renal function is available before acting on the recommendation','Follow the recommendation exactly','Ignore all CDSS output','Double the recommended dose'],c:0,
   e:'A recommendation is only as valid as the <b>currency of its inputs</b>. Stale parameters are one of the commonest sources of confidently wrong decision support.'},

  {q:'Which factor most strongly predicts whether a CDSS will actually improve care?',
   o:['The sophistication of its algorithm','Integration into the existing clinical workflow so that advice arrives without extra steps',
      'The number of rules it contains','The attractiveness of the interface'],c:1,
   e:'<b>Workflow integration</b> is the best-established predictor of CDSS success. Systems requiring a separate login or extra navigation are simply not used, however good their content.'},

  {q:'“Automation bias” in the context of CDSS refers to:',
   o:['Clinicians over-relying on system output and failing to detect when it is wrong','The system running too fast','A preference for automated dispensing','Bias in the training data'],c:0,
   e:'<b>Automation bias</b> is the tendency to accept machine output uncritically. It produces errors of commission (following wrong advice) and omission (missing what the system did not flag).'},

  {q:'The clinical risk of a CDSS with low specificity is that:',
   o:['It misses genuine problems','It runs slowly','It generates many false alarms, driving overrides that eventually include the true positives','It cannot be audited'],c:2,
   e:'Low specificity does not merely annoy — it <b>trains clinicians to dismiss</b>, so the rare true positive is dismissed with everything else.'},

  {q:'Before a new CDSS rule goes live, it should be:',
   o:['Announced by email only','Enabled immediately for all users','Tested against historical data to estimate how often it would fire and how often that firing would be appropriate','Approved by the software vendor only'],c:2,
   e:'<b>Silent testing</b> against historical data predicts alert burden and appropriateness before any clinician is interrupted, and is the standard governance step.'},

  {q:'Who should be accountable for the clinical content of CDSS rules in a hospital?',
   o:['The software vendor','The IT department alone','A multidisciplinary clinical governance group including pharmacy, with documented review','Individual prescribers'],c:2,
   e:'CDSS content is <b>clinical policy expressed in software</b>. It requires the same multidisciplinary governance and periodic review as any other clinical guideline.'},

  {q:'A CDSS that provides a recommendation without any explanation is problematic because:',
   o:['The clinician cannot evaluate the reasoning, and so cannot safely accept or reject it, nor justify the decision afterwards','It runs more slowly','It uses more memory','Patients dislike it'],c:0,
   e:'<b>Explainability</b> is a clinical requirement, not a technical nicety. A professional must be able to justify a decision to a colleague, a patient and a regulator.'},

  {q:'Which CDSS function has the strongest published evidence of reducing harm?',
   o:['Cost display at ordering','Suggesting alternative brands','Displaying the prescriber’s workload','Dose checking with renal adjustment and drug–allergy checking'],c:3,
   e:'<b>Dose and allergy checking</b> have the most consistent evidence of preventing harm. Cost and formulary prompts affect spending, not safety.'},

  {q:'A “soft stop” differs from a “hard stop” in that a soft stop:',
   o:['Cannot be overridden','Appears only in reports','Applies only to nurses','Permits the clinician to proceed after acknowledging, and usually justifying, the override'],c:3,
   e:'A <b>soft stop</b> preserves clinical autonomy while creating a documented decision point. Hard stops remove autonomy and must therefore be very tightly restricted.'},

  {q:'Monitoring the performance of a live CDSS should include:',
   o:['Alert volumes, override rates, override reasons and any harm events that occurred despite or because of alerts','User satisfaction alone','Server uptime only','Number of rules configured'],c:0,
   e:'Live monitoring must cover <b>burden, behaviour and outcome</b>. Uptime says nothing about whether the system is helping or being ignored.'},

  {q:'Which is the most appropriate role for a pharmacist in CDSS implementation?',
   o:['Writing the underlying code','Purchasing the hardware','Training the IT team in programming','Defining and reviewing the medication-related clinical rules and evaluating their real-world effect'],c:3,
   e:'The pharmacist supplies the <b>clinical content and its evaluation</b> — which interactions matter, at what threshold, and whether the resulting alerts changed practice.'},

  {q:'A CDSS validated in a tertiary hospital is being deployed in a rural primary care clinic. The main concern is:',
   o:['The clinic may have slower computers','Staff may not like the colours','It will cost more to license','The population, prescribing patterns and available tests differ, so performance may not transfer'],c:3,
   e:'This is <b>external validity</b>. A model or rule set reflects the setting it came from; deploying it elsewhere requires local validation before it can be trusted.'},

  {q:'When a CDSS and the pharmacist’s clinical judgement conflict, the correct approach is to:',
   o:['Always follow the CDSS','Investigate the basis of the recommendation and document the reasoning for the decision taken','Always follow personal judgement','Refer every case to the prescriber'],c:1,
   e:'Neither blind deference nor blind dismissal is professional. Understanding <b>why</b> the system advises what it does, and documenting the reasoning, is the defensible course.'},

  {q:'“Malfunction” of a CDSS in the published literature most often means:',
   o:['The server crashed','The screen displays the wrong colour','A rule silently stops firing or fires incorrectly after a system update, without anyone noticing','Users forget their passwords'],c:2,
   e:'<b>Silent rule malfunction</b> after upgrades or content changes is a well-documented and dangerous failure mode, because the absence of an alert is invisible. Periodic rule testing is the control.'},

  {q:'Which measure best demonstrates that a CDSS intervention improved medication safety?',
   o:['Number of alerts fired','Reduction in the rate of the specific prescribing error the alert targets',
      'Number of users trained','Number of rules in the system'],c:1,
   e:'The outcome that matters is <b>fewer of the targeted errors</b>. Alert counts measure activity, and can rise while safety is unchanged.'},

  {q:'A CDSS drawing on a machine learning model requires ongoing monitoring because:',
   o:['The licence expires annually','The code degrades','Model performance can drift as populations, prescribing habits and documentation practices change over time','Users lose interest'],c:2,
   e:'<b>Model drift</b> is the gradual divergence between the world the model learned and the world it now operates in. Continuous performance monitoring and periodic retraining are required.'},

  {q:'Which statement about CDSS and professional liability is correct?',
   o:['Liability transfers to the vendor once a recommendation is accepted','No one is liable for automated advice','Liability rests with the hospital IT department','The clinician who acts on the recommendation remains professionally accountable for the decision'],c:3,
   e:'Software cannot hold a registration or be accountable to a patient. Accountability stays with the <b>professional who acts</b>, which is why understanding and verification matter.'},

  {q:'The most important consideration when displaying a CDSS alert is:',
   o:['That it states the specific patient-relevant reason and the recommended action, not merely that a risk exists','That it appears in a bright colour','That it requires two clicks to dismiss','That it appears on every screen'],c:0,
   e:'An alert saying only “interaction detected” shifts all the work to the clinician. An actionable alert states <b>what the risk is for this patient and what to do</b>.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'Drug Interaction & Dose Optimization Software Tools', hrs:7.5, qs:[

  {q:'A pharmacokinetic drug interaction is one in which:',
   o:['Two drugs have additive effects on the same receptor',
      'One drug alters the absorption, distribution, metabolism or excretion of another, changing its concentration',
      'Two drugs are physically incompatible in the same syringe','A drug interacts with a food'],c:1,
   e:'<b>Pharmacokinetic</b> interactions change drug concentration through ADME. <b>Pharmacodynamic</b> interactions change effect at the target without changing concentration.'},

  {q:'Clarithromycin raising the concentration of a statin is an example of:',
   o:['CYP3A4 inhibition reducing statin metabolism','Enzyme induction','Renal competition','Protein-binding displacement only'],c:0,
   e:'Clarithromycin is a potent <b>CYP3A4 inhibitor</b>. Reduced metabolism of simvastatin or atorvastatin raises exposure and with it the risk of myopathy and rhabdomyolysis.'},

  {q:'Rifampicin reduces the effect of many drugs because it is a potent:',
   o:['Enzyme inducer that increases the metabolism of co-administered drugs','CYP enzyme inhibitor','Renal tubular blocker','Protein-binding competitor'],c:0,
   e:'<b>Induction</b> increases enzyme synthesis, accelerating metabolism and lowering concentrations. It develops over days to weeks and, importantly, wears off equally slowly.'},

  {q:'A key practical difference between enzyme inhibition and induction is that inhibition:',
   o:['Takes weeks to develop','Only affects renally cleared drugs','Occurs rapidly, often within hours to days, whereas induction develops over one to two weeks','Cannot be predicted'],c:2,
   e:'The <b>time course</b> matters clinically. Inhibition can cause toxicity within days; induction causes gradual loss of effect, and stopping an inducer can later cause toxicity as enzyme levels fall.'},

  {q:'Warfarin plus amiodarone requires particular caution because amiodarone:',
   o:['Reduces warfarin absorption','Inhibits warfarin metabolism, raising INR, with an effect that persists for weeks due to its long half-life',
      'Displaces warfarin from albumin only briefly','Has no interaction with warfarin'],c:1,
   e:'Amiodarone inhibits CYP2C9 and its extremely <b>long half-life</b> means the interaction both develops and resolves over weeks — dose reduction and prolonged INR monitoring are needed.'},

  {q:'A “therapeutic duplication” alert fires when:',
   o:['The same prescription is entered twice','Two medicines of the same class or with the same pharmacological action are prescribed together',
      'A medicine is prescribed at double the dose','The patient collects a prescription twice'],c:1,
   e:'Duplication alerts catch two NSAIDs, two PPIs or the same molecule under different brand names — a classic consequence of prescribing across multiple settings.'},

  {q:'The main limitation of commercial interaction databases in practice is that they:',
   o:['Contain too few interactions','Are not available electronically','Only cover injectable medicines','Differ in severity grading and often flag interactions with limited clinical relevance for a given patient'],c:3,
   e:'Databases <b>disagree</b>, and their gradings are generic. The pharmacist must apply the patient’s own circumstances — dose, duration, renal function, monitoring — to judge relevance.'},

  {q:'Two interaction databases grade the same pair differently. The pharmacist should:',
   o:['Evaluate the underlying evidence and the patient’s specific risk factors before deciding','Always take the more severe grading','Always take the less severe grading','Disregard both and dispense'],c:0,
   e:'Neither automatic caution nor automatic reassurance is professional practice. The resolution comes from the <b>evidence and the patient</b>, not from picking a database.'},

  {q:'Therapeutic drug monitoring is most clearly indicated for a drug with:',
   o:['A wide therapeutic index and predictable kinetics','A narrow therapeutic index and variable pharmacokinetics',
      'No known adverse effects','Once-weekly dosing'],c:1,
   e:'TDM adds value where the <b>margin between effect and toxicity is narrow</b> and concentration cannot be predicted reliably from the dose — vancomycin, digoxin, phenytoin, lithium.'},

  {q:'For vancomycin, current guidance favours dosing based on:',
   o:['AUC/MIC-guided dosing, which better predicts efficacy while reducing nephrotoxicity','Trough concentration alone','Peak concentration alone','Fixed dosing for all adults'],c:0,
   e:'<b>AUC/MIC-guided</b> dosing has largely replaced trough-only targets because it achieves the efficacy target with lower total exposure and less nephrotoxicity.'},

  {q:'Bayesian dose-optimisation software works by:',
   o:['Averaging the doses used in previous patients','Selecting the maximum licensed dose','Combining a population pharmacokinetic model with the individual patient’s measured concentrations to estimate their own parameters','Randomly sampling possible doses'],c:2,
   e:'Bayesian forecasting starts from a <b>population prior</b> and updates it with the patient’s own levels, so a useful individualised estimate can be made from very few samples.'},

  {q:'The Cockcroft–Gault equation estimates:',
   o:['Body surface area','Hepatic function','Creatinine clearance, used for renal dose adjustment of many medicines','Ideal body weight'],c:2,
   e:'<b>Cockcroft–Gault</b> estimates creatinine clearance and remains the reference for many drug dosing recommendations, since most renal dosing studies used it.'},

  {q:'Why can eGFR reported by the laboratory be unsuitable for drug dose adjustment in some patients?',
   o:['It is normalised to 1.73 m² body surface area, so at extremes of body size it must be de-indexed to the individual','It is always inaccurate','It cannot be measured in adults','It changes hourly'],c:0,
   e:'Reported eGFR is <b>indexed to standard body surface area</b>. In very small or very large patients it must be converted to an absolute clearance before being used for dosing.'},

  {q:'Carboplatin dosing uses the Calvert formula because:',
   o:['It is easier to remember','Body weight is unreliable','It avoids the need for blood tests','Dose is targeted to a desired AUC based on renal function, since clearance is predominantly renal'],c:3,
   e:'Carboplatin clearance is largely <b>renal</b>, so targeting an AUC using GFR gives far more consistent exposure than body surface area dosing.'},

  {q:'A dose-checking module cannot detect which of the following?',
   o:['A dose above the maximum licensed dose','A dose not adjusted for renal function',
      'That the drug is clinically inappropriate for the patient’s actual diagnosis',
      'A duplicate order for the same medicine'],c:2,
   e:'Software checks the dose against <b>rules and parameters</b>. Whether the medicine suits the clinical situation at all is a judgement it cannot make.'},

  {q:'QT-prolonging drug combinations matter because they can precipitate:',
   o:['Hypoglycaemia','Torsades de pointes, a potentially fatal ventricular arrhythmia',
      'Acute kidney injury','Hepatic failure'],c:1,
   e:'Additive QT prolongation risks <b>torsades de pointes</b>. Risk rises with electrolyte disturbance, bradycardia and multiple QT-prolonging agents, all of which decision support should consider together.'},

  {q:'A patient on an SSRI is prescribed tramadol. The pharmacist should be alert to:',
   o:['Reduced analgesic effect only','A pharmacokinetic interaction only','Serotonin syndrome from additive serotonergic activity','No interaction of relevance'],c:2,
   e:'This is a <b>pharmacodynamic</b> interaction. Additive serotonergic effect can produce agitation, clonus, hyperthermia and autonomic instability, and tramadol also lowers the seizure threshold.'},

  {q:'Drug–food interaction checking is important for which of these?',
   o:['Paracetamol and water','Amoxicillin and bread','Metformin and tea','Grapefruit juice and CYP3A4 substrates such as certain statins and calcium-channel blockers'],c:3,
   e:'<b>Grapefruit juice</b> irreversibly inhibits intestinal CYP3A4, raising exposure to affected drugs, and the effect can persist for a day or more after a single glass.'},

  {q:'Interaction checking in a patient taking herbal products should specifically include:',
   o:['Only prescription medicines','Only injectable medicines','Only medicines from the hospital formulary','St John’s wort, a potent enzyme inducer that reduces the effect of many drugs including anticoagulants and contraceptives'],c:3,
   e:'<b>St John’s wort</b> induces CYP3A4 and P-glycoprotein. Because patients rarely volunteer herbal use, it must be asked about directly during medication history taking.'},

  {q:'Renal dose adjustment software gives a recommendation based on an eGFR taken during acute kidney injury. The pharmacist should recognise that:',
   o:['eGFR equations assume steady state and are unreliable when renal function is changing rapidly','The value is fully reliable','The dose should simply be halved','No adjustment is ever needed in AKI'],c:0,
   e:'Estimating equations assume a <b>stable creatinine</b>. In rapidly changing renal function they lag reality, so dosing must be guided by trend, clinical judgement and levels where available.'},

  {q:'A paediatric dose calculated by software should always be checked against:',
   o:['The adult dose only','The price of the medicine','The dose used for the previous patient','The maximum recommended dose for the indication, so that a weight-based calculation does not exceed the adult ceiling'],c:3,
   e:'Weight-based calculation in a large child or adolescent can exceed the <b>adult maximum</b>. Capping against that ceiling is a standard and essential safety check.'},

  {q:'Which is the most important input for accurate dose optimisation software output?',
   o:['A fast internet connection','The brand of the medicine','The prescriber’s grade','Accurate, current patient parameters — weight, renal and hepatic function, and correct sampling times'],c:3,
   e:'Dose optimisation is <b>parameter-driven</b>. A mistimed level or an outdated weight produces a confidently wrong recommendation, which is more dangerous than no recommendation.'},

  {q:'For therapeutic drug monitoring of most drugs, the trough sample should be taken:',
   o:['One hour after the dose','Immediately before the next dose, once steady state has been reached',
      'At any convenient time','Halfway between doses'],c:1,
   e:'A <b>pre-dose trough at steady state</b> is the standard, because a mistimed sample is uninterpretable and may prompt an inappropriate dose change.'},

  {q:'Interaction alerts should ideally take account of the route of administration because:',
   o:['Some interactions occur only by a specific route, such as chelation of oral tetracyclines by antacids','Route never affects interactions','Only injections interact','Route affects only cost'],c:0,
   e:'Route-blind alerting is a common source of false positives. An <b>oral chelation</b> interaction is irrelevant for an intravenous dose, and flagging it wastes clinician attention.'},

  {q:'The pharmacist’s most valuable contribution when software flags a major interaction is to:',
   o:['Automatically cancel the prescription','Forward the alert to the prescriber unchanged','Assess the clinical relevance for this patient and recommend a specific management plan — alternative, dose change or monitoring','Record the alert and take no action'],c:2,
   e:'Forwarding a raw alert adds nothing the prescriber could not see. The value the pharmacist adds is <b>contextual judgement and a concrete plan</b>.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Pharmacogenomics & Antibiogram Analysis', hrs:7.5, qs:[

  {q:'Pharmacogenomics is the study of:',
   o:['How medicines are manufactured','How an individual’s genetic variation influences their response to medicines',
      'How medicines are distributed to pharmacies','How bacteria acquire resistance'],c:1,
   e:'Pharmacogenomics links <b>genotype to drug response</b> — efficacy, dose requirement and adverse reaction risk — and is the scientific basis of individualised prescribing.'},

  {q:'A patient is described as a CYP2D6 “poor metaboliser”. For a drug activated by CYP2D6, such as codeine, this means:',
   o:['Reduced conversion to morphine and therefore poor analgesic effect','Increased conversion to the active metabolite and risk of toxicity','No effect on the drug','Faster elimination of morphine'],c:0,
   e:'Codeine is a <b>prodrug</b>. A poor metaboliser converts little to morphine and gets inadequate analgesia; the opposite phenotype, the ultrarapid metaboliser, risks life-threatening opioid toxicity.'},

  {q:'Why is codeine contraindicated in CYP2D6 ultrarapid metabolisers, particularly children?',
   o:['Excessive and rapid conversion to morphine can cause fatal respiratory depression','It is ineffective','It causes an allergic reaction','It interacts with all antibiotics'],c:0,
   e:'Ultrarapid metabolisers generate <b>unexpectedly high morphine concentrations</b> from standard doses. Deaths in children after tonsillectomy led to specific regulatory restrictions.'},

  {q:'HLA-B*15:02 testing before carbamazepine is recommended in certain Asian populations because the allele predicts:',
   o:['Poor efficacy','Rapid metabolism','Renal toxicity','Severe cutaneous reactions including Stevens–Johnson syndrome and toxic epidermal necrolysis'],c:3,
   e:'<b>HLA-B*15:02</b> carries a strong association with carbamazepine-induced SJS/TEN and is markedly more prevalent in South-East Asian populations, making pre-treatment screening cost-effective there.'},

  {q:'HLA-B*57:01 screening is performed before prescribing:',
   o:['Abacavir, to avoid a potentially fatal hypersensitivity reaction','Warfarin','Metformin','Atorvastatin'],c:0,
   e:'<b>Abacavir hypersensitivity</b> is strongly associated with HLA-B*57:01. Screening before initiation is one of the most firmly established pharmacogenomic tests in routine practice.'},

  {q:'TPMT or NUDT15 testing before thiopurine therapy identifies patients at risk of:',
   o:['Treatment failure','Hepatic fibrosis only','Allergic rash','Severe myelosuppression from standard doses'],c:3,
   e:'Deficient <b>TPMT</b> or <b>NUDT15</b> activity causes accumulation of active thiopurine metabolites and profound, potentially fatal bone marrow suppression. Dose reduction is required.'},

  {q:'DPYD genotyping before fluoropyrimidine chemotherapy predicts risk of:',
   o:['Reduced tumour response','Injection site reactions','Severe, sometimes fatal toxicity from 5-fluorouracil or capecitabine','Hair loss only'],c:2,
   e:'<b>DPD deficiency</b> impairs 5-FU catabolism, causing severe mucositis, myelosuppression and neurotoxicity. Pre-treatment genotyping with dose reduction is now standard in many systems.'},

  {q:'CYP2C19 status is clinically relevant for clopidogrel because clopidogrel is:',
   o:['Directly active without metabolism','A prodrug requiring CYP2C19 activation, so poor metabolisers get reduced antiplatelet effect',
      'Eliminated unchanged by the kidney','Not affected by genetics'],c:1,
   e:'Clopidogrel <b>requires CYP2C19 activation</b>. Poor metabolisers have reduced platelet inhibition and higher event rates after stenting, which may justify an alternative agent.'},

  {q:'VKORC1 and CYP2C9 variants influence:',
   o:['Aspirin absorption','Insulin secretion','Antibiotic resistance','Warfarin dose requirement, affecting both sensitivity and metabolism'],c:3,
   e:'<b>VKORC1</b> affects target sensitivity and <b>CYP2C9</b> affects clearance. Together they explain a substantial part of the wide variation in warfarin dose requirement between patients.'},

  {q:'SLCO1B1 variants are associated with which statin-related risk?',
   o:['Reduced cholesterol lowering','Increased simvastatin exposure and a higher risk of myopathy',
      'Increased hepatic clearance','Photosensitivity'],c:1,
   e:'<b>SLCO1B1</b> encodes a hepatic uptake transporter. Reduced-function variants raise plasma statin concentrations, particularly with simvastatin, increasing myopathy risk.'},

  {q:'CPIC guidelines are best described as:',
   o:['Peer-reviewed guidance translating pharmacogenomic test results into specific prescribing recommendations','A commercial genetic testing service','A list of approved medicines','A patient support organisation'],c:0,
   e:'<b>CPIC</b> answers the practical question: given this genotype, what should be prescribed? It does not advise whether to test, but what to do with a result already available.'},

  {q:'The main practical barrier to routine pharmacogenomic testing in most hospitals is:',
   o:['The tests are unreliable','Turnaround time, cost and the absence of results integrated into prescribing systems at the moment of decision',
      'Patients refuse testing','No genes have been identified'],c:1,
   e:'The science is ahead of the <b>implementation</b>. A result that arrives after the prescription, or that sits outside the EHR, cannot influence the decision it was meant to inform.'},

  {q:'A pharmacogenomic result should be recorded in the patient record because:',
   o:['It changes every few years','It is needed for billing','It replaces the need for other tests','Genotype is lifelong and will be relevant to future prescribing decisions across the patient’s life'],c:3,
   e:'Unlike most laboratory results, genotype <b>does not change</b>. Recording it in a persistent, retrievable form makes it a lifelong asset rather than a one-off test.'},

  {q:'An antibiogram is:',
   o:['A periodic summary of the susceptibility of organisms isolated in an institution to a range of antimicrobials','A prescription for antibiotics','A graph of antibiotic sales','A record of allergic reactions'],c:0,
   e:'The <b>antibiogram</b> aggregates local isolates to show the proportion susceptible to each agent, and is the primary evidence base for empirical therapy choice in that institution.'},

  {q:'The main clinical use of a hospital antibiogram is to:',
   o:['Set antibiotic prices','Decide which antibiotics to stock only','Guide empirical antibiotic choice before culture and sensitivity results are available','Replace culture testing'],c:2,
   e:'Empirical therapy is a probability judgement. The antibiogram tells the prescriber <b>which agent is most likely to cover the likely organism locally</b>.'},

  {q:'Antibiograms should be interpreted with caution because:',
   o:['They are updated hourly','They only cover viruses','They aggregate all isolates, so they may not reflect a specific unit such as intensive care, and may be skewed by repeat isolates from the same patient','They are not evidence based'],c:2,
   e:'Unit-level resistance often differs markedly from the hospital average, and duplicate isolates from a single colonised patient can distort the figures. <b>Unit-specific antibiograms</b> are preferred where numbers allow.'},

  {q:'MIC stands for:',
   o:['Maximum Inhibitory Concentration','Minimum Inhibitory Concentration — the lowest concentration preventing visible growth',
      'Mean Infection Count','Microbial Identification Code'],c:1,
   e:'The <b>MIC</b> is the lowest concentration that inhibits visible growth. Compared against achievable concentrations at the infection site, it determines whether an organism is reported susceptible.'},

  {q:'An organism reported as “susceptible” means that:',
   o:['The infection will certainly be cured','The organism is harmless','Growth is likely to be inhibited by concentrations achieved with the usual dose at the site of infection','No treatment is needed'],c:2,
   e:'Susceptibility is a <b>probabilistic pharmacological statement</b>, tied to normal dosing and to the site. It is not a guarantee of cure, and site penetration must still be considered.'},

  {q:'“Susceptible, increased exposure” (I) in current EUCAST terminology means:',
   o:['The organism is resistant','The result is uninterpretable','The test failed','Susceptibility is likely if a higher dose or optimised regimen is used to achieve greater exposure'],c:3,
   e:'The category was redefined away from “intermediate”. It now signals that the agent <b>can work if exposure is increased</b>, which is a direct prompt for dose optimisation.'},

  {q:'Antimicrobial de-escalation means:',
   o:['Stopping all antibiotics abruptly','Narrowing from broad-spectrum empirical therapy to a targeted agent once culture results are available',
      'Reducing the dose by half','Switching from oral to intravenous therapy'],c:1,
   e:'<b>De-escalation</b> preserves broad-spectrum agents, reduces collateral damage to the microbiome and lowers cost, without compromising the individual patient’s treatment.'},

  {q:'An AI model predicting antimicrobial resistance from patient data would be most useful for:',
   o:['Improving empirical therapy choice in the interval before culture results are available','Replacing microbiology laboratories','Setting antibiotic prices','Deciding hospital staffing'],c:0,
   e:'The clinical gap is the <b>24–72 hour wait</b> for cultures. Predicting the likely organism and its resistance for this individual patient makes empirical therapy less blind.'},

  {q:'A predictive resistance model trained on one hospital’s data must be locally validated because:',
   o:['Resistance patterns are strongly local and change over time, so performance does not transfer automatically','Models are always wrong','The software licence requires it','Patients differ in age'],c:0,
   e:'Resistance epidemiology is <b>intensely local and temporally unstable</b>. A model that performs well in one institution can be actively misleading in another.'},

  {q:'The pharmacist’s role in antimicrobial stewardship includes:',
   o:['Approving all antibiotic prescriptions personally','Restricting antibiotics to weekends','Choosing suppliers','Reviewing therapy against culture results, prompting de-escalation, IV-to-oral switch and duration limits'],c:3,
   e:'The high-yield stewardship interventions delivered by pharmacy are <b>de-escalation, IV-to-oral switch and duration control</b>, all of which depend on reviewing therapy against results.'},

  {q:'Combining pharmacogenomic and antibiogram data in a decision support system would allow:',
   o:['Elimination of all adverse reactions','Prescribing without any laboratory tests','Selection of an antimicrobial likely to be effective locally and safe for that patient’s metabolic and hypersensitivity profile','Automatic dispensing without pharmacist review'],c:2,
   e:'The two answer different questions — <b>what will work here</b> and <b>what is safe for this person</b>. Combined, they support genuinely individualised antimicrobial prescribing.'},

  {q:'Before acting on a pharmacogenomic result, the pharmacist should confirm:',
   o:['The patient’s insurance status','The cost of the test','That the result belongs to this patient, the gene and allele tested are relevant to the drug, and a recognised guideline supports the action','The name of the laboratory technician'],c:2,
   e:'Acting on genotype requires <b>identity, relevance and an evidence-based recommendation</b>. A result for a gene unrelated to the drug in question supports no prescribing change at all.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Predictive Pharmacovigilance', hrs:7.5, qs:[

  {q:'Predictive pharmacovigilance differs from traditional spontaneous reporting in that it:',
   o:['Actively mines existing data sources to identify potential safety signals before they are spontaneously reported','Waits for clinicians to submit reports','Only examines fatal reactions','Applies only to new medicines'],c:0,
   e:'Traditional pharmacovigilance is <b>reactive</b> and limited by under-reporting. Predictive approaches interrogate EHRs, claims and literature to surface signals earlier.'},

  {q:'The proportional reporting ratio (PRR) compares:',
   o:['The cost of two medicines','The number of patients treated','The severity of two reactions','The proportion of reports for a given event with one drug against the proportion for all other drugs in the database'],c:3,
   e:'<b>PRR</b> is a disproportionality measure. A high value means the event is reported more often with this drug than expected from the rest of the database — a hypothesis, not proof.'},

  {q:'A key limitation of disproportionality analysis is that:',
   o:['It requires genetic data','It only works for injectables','It cannot establish causality or incidence, because the true number of patients exposed is unknown','It requires a randomised trial'],c:2,
   e:'Spontaneous databases have <b>no denominator</b>. They can rank suspicion but cannot give incidence, and are vulnerable to reporting biases such as media attention.'},

  {q:'The Weber effect describes the tendency for adverse event reporting to:',
   o:['Increase steadily for the lifetime of a product','Be unaffected by time','Peak in the first two years after launch and then decline, independent of true risk','Occur only in hospital settings'],c:2,
   e:'The <b>Weber effect</b> means a rise or fall in report numbers may reflect the product’s age and attention rather than any change in real risk — a crucial caveat when interpreting trends.'},

  {q:'“Notoriety bias” in pharmacovigilance means:',
   o:['Famous doctors report more often','Publicity about a suspected reaction increases reporting of that reaction, inflating the apparent signal',
      'Only serious events get reported','Reports come mainly from one country'],c:1,
   e:'<b>Notoriety bias</b> creates a feedback loop: media coverage prompts reporting, which strengthens the apparent signal, which generates more coverage. Signal evaluation must account for it.'},

  {q:'Using EHR data for active safety surveillance has which major advantage over spontaneous reports?',
   o:['A defined denominator of exposed patients, allowing incidence rates rather than only report counts','It requires no ethical approval','It contains no missing data','It is always coded perfectly'],c:0,
   e:'A <b>denominator</b> transforms surveillance. Knowing how many patients were exposed allows a rate to be calculated and compared, which spontaneous reporting can never do.'},

  {q:'Confounding by indication occurs when:',
   o:['Two drugs are given together','The dose is recorded incorrectly','Patients are randomised','The underlying disease being treated, rather than the drug, causes the observed outcome'],c:3,
   e:'<b>Confounding by indication</b> is the central threat in observational drug safety research: the sickest patients receive certain drugs, so the drug appears associated with poor outcomes.'},

  {q:'A self-controlled case series design reduces confounding by:',
   o:['Randomising patients to treatment','Excluding all comorbid patients','Comparing the risk during exposed and unexposed periods within the same individual, so fixed patient characteristics cannot confound','Using only healthy volunteers'],c:2,
   e:'By using each patient as their own control, <b>time-invariant confounders</b> such as genetics, sex and chronic comorbidity are eliminated by design.'},

  {q:'Natural language processing contributes to pharmacovigilance mainly by:',
   o:['Translating package inserts','Extracting adverse event information from unstructured clinical narratives, discharge summaries and literature at scale',
      'Designing clinical trials','Setting medicine prices'],c:1,
   e:'Most of the richest safety information is <b>unstructured free text</b>. NLP converts it into analysable structured data, which is impossible manually at population scale.'},

  {q:'Social media listening for adverse events is limited chiefly by:',
   o:['Excessive clinical detail','Insufficient volume of posts','Poor data quality, absent clinical verification, duplication and inability to confirm the patient or the exposure','Legal prohibition in all countries'],c:2,
   e:'Social media gives volume and timeliness but very low <b>signal quality</b>. Posts cannot usually be verified, deduplicated or linked to a confirmed exposure.'},

  {q:'The purpose of signal prioritisation in a pharmacovigilance unit is to:',
   o:['Reduce the number of reports received','Avoid reporting to regulators','Focus limited assessment resources on signals with the greatest potential public health impact','Speed up marketing approval'],c:2,
   e:'Signal detection generates far more candidates than can be assessed. <b>Prioritisation</b> by seriousness, preventability, population exposure and strength of evidence directs the work.'},

  {q:'A machine learning model flags a possible new drug–event association. The correct next step is:',
   o:['Immediate suspension of the medicine','Structured signal evaluation including clinical review, causality assessment and examination of alternative explanations','Immediate publication in the press','Deleting the signal as a false positive'],c:1,
   e:'A statistical flag is a <b>hypothesis</b>. It enters the same formal evaluation pathway as any other signal; neither regulatory action nor dismissal is justified by the flag alone.'},

  {q:'Predictive models of individual patient ADR risk are most useful clinically when they:',
   o:['Predict very rare events with low certainty','Produce a single overall risk number with no detail','Are kept confidential from clinicians','Identify modifiable risk factors that allow the prescriber to act — dose reduction, monitoring or an alternative agent'],c:3,
   e:'A risk score that cannot be acted on changes nothing. <b>Modifiable, actionable</b> factors are what turn prediction into prevention.'},

  {q:'The main risk of deploying an ADR prediction model without prospective evaluation is that:',
   o:['It will run too slowly','It will use too much storage','Clinicians will not understand the mathematics','It may perform worse in practice than in development, and may shift care in unintended and harmful ways'],c:3,
   e:'Retrospective performance routinely overstates prospective performance, and deployment <b>changes behaviour</b>, which can create new harms the development data could not show.'},

  {q:'An "expedited report" to a regulator is required when a case is:',
   o:['Any adverse event','Reported by a pharmacist only','Reported more than once','Serious, unexpected and suspected to be related to the medicine'],c:3,
   e:'The classic expedited criteria are <b>serious, unexpected and suspected related</b>. All three must be present, and the reporting clock is short.'},

  {q:'A "listed" adverse reaction means one that is:',
   o:['Already described in the approved product information','Reported at least ten times','Fatal','Reported by the manufacturer'],c:0,
   e:'“Listed” means <b>already in the reference safety information</b>. Unlisted (unexpected) serious suspected reactions are the ones requiring expedited reporting.'},

  {q:'Risk Minimisation Measures for a medicine may include:',
   o:['Controlled distribution, mandatory pregnancy prevention programmes, prescriber training or patient alert cards','Reducing the medicine’s price','Increasing the pack size','Removing the patient information leaflet'],c:0,
   e:'<b>Additional risk minimisation measures</b> go beyond labelling. Isotretinoin and valproate pregnancy prevention programmes are the standard examples of controls with real operational teeth.'},

  {q:'The purpose of a Risk Management Plan (RMP) is to:',
   o:['Plan the marketing campaign','Describe the known and potential risks of a medicine and the measures to identify, characterise and minimise them',
      'Set the manufacturing schedule','Determine the retail price'],c:1,
   e:'An <b>RMP</b> is a lifecycle document. It states what is known, what is suspected, what is missing, and exactly what will be done about each.'},

  {q:'Which data source is most likely to detect a rare adverse reaction occurring in 1 in 50,000 patients?',
   o:['A single phase III trial of 3,000 patients','Large-scale post-marketing surveillance across linked databases',
      'A case series of 20 patients','A laboratory study'],c:1,
   e:'Pre-marketing trials are simply <b>too small</b> for very rare events. Detecting them requires post-marketing exposure across very large populations.'},

  {q:'Medication error reports differ from ADR reports in that errors are:',
   o:['Never clinically important','Always caused by pharmacists','Preventable by definition, and their analysis focuses on system causes rather than drug properties','Not worth reporting'],c:2,
   e:'ADRs are properties of the drug; <b>errors are properties of the system</b>. Both should be reported, but they lead to entirely different corrective actions.'},

  {q:'A pharmacovigilance dashboard is most useful to a hospital when it:',
   o:['Displays national data only','Shows local reporting rates, the medicines most frequently implicated, and outstanding causality assessments',
      'Lists all medicines in the formulary','Shows only annual totals'],c:1,
   e:'A local dashboard should drive <b>local action</b>: which wards are under-reporting, which medicines recur, and what assessment work is outstanding.'},

  {q:'Prescription sequence symmetry analysis detects possible ADRs by examining:',
   o:['Whether a second medicine is started disproportionately often after a first, suggesting treatment of an adverse effect','The alphabetical order of drug names','The price sequence of prescriptions','How long a prescription takes to dispense'],c:0,
   e:'If drug B is started after drug A far more often than the reverse, B may be <b>treating an adverse effect</b> of A. It is a fast screening method using routine dispensing data.'},

  {q:'A prescribing cascade occurs when:',
   o:['An adverse effect of one medicine is misinterpreted as a new condition and treated with a further medicine','Several drugs are prescribed on the same day','A prescription is repeated automatically','Doses are increased in steps'],c:0,
   e:'The classic <b>prescribing cascade</b> — a calcium-channel blocker causing oedema, treated with a diuretic — adds risk without addressing the cause. Recognising it is a core pharmacist skill.'},

  {q:'Which is the strongest evidence that a suspected ADR is causally related to a medicine?',
   o:['A clear temporal relationship with resolution on withdrawal and recurrence on rechallenge','The patient believes it is','The event was serious','The medicine is new'],c:0,
   e:'<b>Positive dechallenge and rechallenge</b> with a plausible time course is the strongest individual-case evidence, though deliberate rechallenge is often ethically unacceptable.'},

  {q:'The ultimate purpose of predictive pharmacovigilance is to:',
   o:['Increase the number of reports filed','Reduce the cost of medicines','Support marketing claims','Detect and act on medication-related risk early enough to prevent harm to patients'],c:3,
   e:'Every method — disproportionality, EHR surveillance, NLP, prediction — serves one end: <b>identifying risk in time to prevent harm</b>, rather than documenting it afterwards.'}
  ]}

  ]
};
