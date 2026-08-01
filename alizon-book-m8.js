/* alizon-book-m8.js — Module 8 textbook, expanded.
   HAND-AUTHORED. The manuscript carried only an outline for this module
   (1,517 words), so it is written out here against the Module 8 examination
   bank and the capstone simulation. tools-convert-textbook-docx.py SKIPS
   module 8, so regenerating the books from the Word file cannot overwrite this. */
(function(){
(window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m8 = {
 meta:{module:'8', title:"AI-Enabled Clinical Case Studies & Simulations",
       sub:"Putting It Together", prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Alizon School of Medical & Digital Intelligence'},
 src:
/* ============================== UNIT 1 ============================== */
'@chapter AI-Based Prescription Review & Safety Audits\n\n'+
'@objectives\n'+
'- Conduct a structured prescription review and state what each step catches\n'+
'- Recognise the classic high-risk prescribing patterns by sight\n'+
'- Use AI screening output as a reading order rather than a verdict\n'+
'- Plan, run and close a prescription safety audit\n\n'+

'@section Reviewing in a fixed order\n\n'+
'A review that follows the same sequence every time misses less than one driven by whatever '+
'catches the eye first. Begin with the six checks, then ask the clinical questions.\n\n'+
'@diagram steps Right patient > Right drug > Right dose > Right route > Right time > Documented | The sequence, every time\n\n'+
'Beyond those six: is there an indication for every medicine, and a medicine for every indication? '+
'Is anything being used to treat the side effect of something else? Is the duration defined, or has '+
'a short course quietly become permanent?\n\n'+
'@note\n'+
'An audit that finds the indication routinely omitted from antibiotic prescriptions has found a real '+
'defect. Without an indication nobody downstream can judge whether the choice, the dose or the '+
'duration was right, and nobody can stop it at review.\n\n'+

'@section Patterns that should stop you\n\n'+
'Some combinations are dangerous often enough that they should be recognised on sight rather than '+
'reasoned out each time.\n\n'+
'@table High-risk prescribing patterns\n'+
'Pattern | Why it matters | Usual action\n'+
'Warfarin + a macrolide such as clarithromycin | Marked rise in INR and bleeding risk | Avoid, or reduce dose with close INR monitoring\n'+
'Methotrexate written as a daily dose | It is a weekly drug; daily dosing has killed patients | Stop and clarify before any supply\n'+
'Methotrexate + trimethoprim | Additive antifolate effect, marrow suppression | Avoid the combination\n'+
'Lithium + ACE inhibitor, diuretic or NSAID | Reduced lithium clearance, toxicity | Avoid or monitor levels closely\n'+
'Non-selective NSAID + low-dose aspirin | Greatly increased gastrointestinal bleeding | Review need; gastroprotection if unavoidable\n'+
'Sodium valproate in a woman of childbearing potential | Serious teratogenic risk | Only under the pregnancy prevention programme\n'+
'Digoxin at standard dose in poor renal function | Accumulation and toxicity | Reduce dose to renal function; check level\n'+
'Duplicate paracetamol, regular and as required | Cumulative overdose | Combine into one order with a stated maximum\n\n'+
'@caution\n'+
'A documented **penicillin anaphylaxis** rules out piperacillin-tazobactam. The severity of the '+
'documented reaction, not the class label alone, decides whether a beta-lactam may be used at all — '+
'and anaphylaxis is the end of that discussion.\n\n'+
'@subsection Abbreviations that kill\n\n'+
'"U" for units in an insulin order is misread as a zero often enough that it is banned in most '+
'error-prevention lists. An audit finding that most insulin orders still use it has found a systems '+
'problem, and the fix is to remove the ability to write it — not to remind people again.\n\n'+

'@section Using AI screening properly\n\n'+
'An AI review tool that flags forty orders on a ward round, of which most turn out not to need '+
'action, has not failed — provided the flags are used as a reading order. The failure begins when '+
'the low-ranked orders stop being reviewed at all.\n\n'+
'@caution\n'+
'Risk ranking should change the **order** of your attention, never its **coverage**. A prescription '+
'ranked low is not thereby cleared, and the tool has no idea what you know about the patient.\n\n'+
'When a tool recommends stopping a medicine as "potentially inappropriate", treat that as a prompt '+
'to check the indication with the prescriber and the patient. Potentially inappropriate is a '+
'population-level judgement; this patient may be the reason the exception exists.\n\n'+

'@section The audit cycle\n\n'+
'@diagram cycle Set the standard > Measure practice > Compare and analyse > Change > Re-measure | An audit that never re-measures is only a survey\n\n'+
'@note\n'+
'The re-measurement **is** the audit. Without it you have described a problem and demonstrated '+
'nothing about whether your change helped — and you will be asked.\n\n'+
'@activity Activity 1.1\n'+
'Choose one prescribing standard. Audit twenty prescriptions against it, propose one change, and '+
'state exactly how and when you would re-measure. Predict what the second measurement will show.\n\n'+
'@keyterms\n'+
'Clinical audit: measuring practice against a standard and re-measuring after change.\n'+
'Risk stratification: ordering cases by predicted risk to guide attention.\n'+
'Potentially inappropriate prescribing: a population-level judgement that a medicine is usually best avoided.\n'+
'Time-critical medicine: one where a delayed dose causes harm in itself.\n\n'+
'@summary\n'+
'- A fixed review sequence misses less than opportunistic checking\n'+
'- Certain combinations should be recognised on sight, not reasoned out each time\n'+
'- Daily methotrexate and "U" for units are system defects, not lapses of attention\n'+
'- AI ranking changes the order of attention, not its coverage\n'+
'- An audit without re-measurement proves nothing\n\n'+
'@exercise Exercises\n'+
'Q: List the six rights of a prescription review and two further clinical questions.\n'+
'Q: A 72-year-old on warfarin is prescribed clarithromycin. State the risk and your action.\n'+
'Q: Methotrexate is written as 2.5 mg daily for rheumatoid arthritis. What do you do, and why immediately?\n'+
'Q: Why does documented penicillin anaphylaxis exclude piperacillin-tazobactam?\n'+
'Q: An audit finds 60% of insulin orders use "U" for units. Propose a fix that does not rely on reminders.\n'+
'Q: An AI tool flags 40 orders and most need no action. Is the tool failing? Justify your answer.\n'+
'Q: Draw the audit cycle and name the step most often omitted.\n\n'+

/* ============================== UNIT 2 ============================== */
'@chapter Drug Interaction & Dose Optimisation Simulations\n\n'+
'@objectives\n'+
'- Predict the direction and consequence of the common serious interactions\n'+
'- Adjust doses for renal function and recognise when an estimate misleads\n'+
'- Recognise toxicity syndromes early from their presenting picture\n'+
'- Communicate a specific, enactable recommendation\n\n'+

'@section Interactions you must know cold\n\n'+
'@table Serious interactions and what to expect\n'+
'Combination | Mechanism | Consequence to anticipate\n'+
'Warfarin + clarithromycin | CYP inhibition | INR rises; bleeding\n'+
'Warfarin + amiodarone | CYP2C9 inhibition, long half-life | Slow, prolonged INR rise; reduce warfarin, monitor for weeks\n'+
'Simvastatin + clarithromycin | CYP3A4 inhibition | Greatly raised statin exposure; myopathy, rhabdomyolysis\n'+
'SSRI + tramadol | Additive serotonergic effect | Serotonin syndrome\n'+
'DOAC + St John\'s wort | Enzyme and transporter induction | Reduced anticoagulant effect; thrombosis\n'+
'Methotrexate + trimethoprim | Additive antifolate | Marrow suppression\n'+
'QT-prolonging antipsychotic + macrolide | Additive QT prolongation | Torsades de pointes\n'+
'Digoxin + hypokalaemia | Increased myocardial sensitivity | Toxicity at a "normal" level\n\n'+
'@caution\n'+
'**Serotonin syndrome** — agitation, tremor, hyperreflexia, clonus, fever — comes on within hours, '+
'not days. It is a clinical diagnosis and the first action is to stop the serotonergic drugs.\n\n'+
'@know Did you know?\n'+
'With amiodarone the danger is a half-life measured in weeks. The INR keeps drifting upward long '+
'after the dose change you made, so a single reassuring INR a few days later means very little.\n\n'+

'@section Dosing to organ function\n\n'+
'A patient with an eGFR of 42 and an HbA1c of 9.4% on metformin 1 g twice daily illustrates the '+
'usual tension: the diabetes is poorly controlled and the kidneys limit what may be used. Metformin '+
'is generally continued with a reduced maximum down to an eGFR of 30 and stopped below it — the '+
'renal number sets the ceiling, and poor glycaemic control does not raise it.\n\n'+
'@caution\n'+
'In **acute kidney injury** the creatinine lags behind the true state, so an estimating equation '+
'flatters a patient who is deteriorating. A patient on a DOAC whose creatinine has doubled needs the '+
'anticoagulant reassessed now, not at the next clinic.\n\n'+
'@subsection Getting levels right\n\n'+
'A **vancomycin trough** taken two hours after the dose rather than immediately before the next one '+
'is not a trough. It will read high, and acting on it risks under-dosing an infected patient. Repeat '+
'the level at the correct time rather than reinterpreting a wrong sample.\n\n'+
'@subsection Recognising toxicity\n\n'+
'Nausea, visual disturbance and bradycardia in a patient on digoxin is digoxin toxicity until proved '+
'otherwise. Check the level, check the potassium, and remember that hypokalaemia produces toxicity '+
'at a concentration the laboratory will report as therapeutic.\n\n'+

'@section Making the recommendation\n\n'+
'@diagram steps List everything taken > Flag interactions > Rank by actual risk > Act on the top few > Communicate and monitor | Triage is the core skill\n\n'+
'With ten medicines there are forty-five possible pairs. You cannot act on all of them, so rank by '+
'severity of outcome, likelihood in this patient, therapeutic index, whether it can be monitored, '+
'and how easily it can be changed.\n\n'+
'@caution\n'+
'"Please review the anticoagulation" is not a recommendation. "Suggest reducing warfarin to 3 mg '+
'daily and rechecking INR in three days" is one. Use situation, background, assessment, '+
'recommendation — and make it specific enough to enact without a second conversation.\n\n'+
'@activity Activity 2.1\n'+
'Take a patient on eight or more medicines. Identify every interaction, rank them, and write an SBAR '+
'note recommending action on the top two only. Justify what you chose not to raise.\n\n'+
'@keyterms\n'+
'Serotonin syndrome: a potentially fatal syndrome of serotonergic excess, onset within hours.\n'+
'Trough level: a concentration taken immediately before the next dose.\n'+
'SBAR: Situation, Background, Assessment, Recommendation.\n'+
'Therapeutic index: the margin between an effective and a toxic concentration.\n\n'+
'@summary\n'+
'- A small set of interactions accounts for most serious harm; know them by sight\n'+
'- Amiodarone\'s long half-life makes an early reassuring INR meaningless\n'+
'- Renal function sets the ceiling on dose; poor control does not raise it\n'+
'- A mistimed level is repeated, not reinterpreted\n'+
'- Hypokalaemia produces digoxin toxicity at a "therapeutic" level\n\n'+
'@exercise Exercises\n'+
'Q: A patient stable on warfarin at INR 2.5 starts clarithromycin. What do you anticipate and do?\n'+
'Q: Why does amiodarone require prolonged INR monitoring after a warfarin dose change?\n'+
'Q: A patient on an SSRI starts tramadol and becomes agitated with tremor. Name the syndrome and the first action.\n'+
'Q: eGFR 42, HbA1c 9.4%, metformin 1 g twice daily. What do you advise, and what governs the decision?\n'+
'Q: A vancomycin trough was taken two hours after the dose. What is your action?\n'+
'Q: Which electrolyte disturbance most increases digoxin toxicity, and why does the level mislead?\n'+
'Q: Rewrite "please review the diabetes medication" as a specific recommendation.\n\n'+

/* ============================== UNIT 3 ============================== */
'@chapter Clinical & Pharmacogenomic Case Simulations\n\n'+
'@objectives\n'+
'- State the established drug-gene pairs and what each test prevents\n'+
'- Explain why prodrugs invert the expected consequence of metaboliser status\n'+
'- Integrate a genomic result with the rest of the clinical picture\n'+
'- Record and explain a result so it is still useful years later\n\n'+

'@section The drug-gene pairs that are already practice\n\n'+
'@table Established pharmacogenomic tests\n'+
'Gene | Drug | What the test prevents\n'+
'HLA-B*57:01 | Abacavir | Potentially fatal hypersensitivity; testing is mandatory before starting\n'+
'HLA-B*15:02 | Carbamazepine | Stevens-Johnson syndrome; screen patients of South-East Asian ancestry\n'+
'TPMT and NUDT15 | Azathioprine, mercaptopurine | Severe, sometimes fatal myelosuppression\n'+
'DPYD | Capecitabine, fluorouracil | Severe, sometimes fatal fluoropyrimidine toxicity\n'+
'CYP2C19 | Clopidogrel | Treatment failure and stent thrombosis in poor metabolisers\n'+
'SLCO1B1 | Simvastatin | Myopathy, particularly at higher doses\n'+
'VKORC1 and CYP2C9 | Warfarin | Informs the starting dose, not the target INR\n'+
'CYP2D6 | Codeine, tramadol | Both failure and life-threatening toxicity, depending on phenotype\n\n'+
'@note\n'+
'**CPIC guidelines** answer one specific question: given a genotype result you already have, what '+
'should you do about the drug? They do not tell you whom to test.\n\n'+

'@section Prodrugs invert the logic\n\n'+
'Codeine is inactive until CYP2D6 converts it to morphine, so the consequences run opposite to '+
'intuition. An **ultra-rapid metaboliser** produces morphine faster than expected and risks '+
'respiratory depression; a **poor metaboliser** gets little analgesia at all.\n\n'+
'@diagram compare Poor metaboliser | Ultra-rapid metaboliser ; Ordinary drug: accumulates, toxicity | Ordinary drug: cleared fast, may fail ; Prodrug such as codeine: no effect | Prodrug such as codeine: toxicity\n\n'+
'@caution\n'+
'Codeine is contraindicated after tonsillectomy or adenoidectomy in children. Deaths in ultra-rapid '+
'metabolisers are exactly why. A patient who reports that codeine has never worked for them is '+
'plausibly a poor metaboliser — believe them and choose a different analgesic.\n\n'+

'@section Genomics as one input among several\n\n'+
'@diagram flow Genomic result > Clinical picture > Laboratory values > Current medicines > Patient priorities > Decision | No single strand decides\n\n'+
'A result describes a probability, not a certainty. A normal metaboliser can still react unexpectedly '+
'and a poor metaboliser may tolerate a standard dose. Where the genomic result and the clinical '+
'picture disagree, the patient in front of you is the more recent evidence.\n\n'+
'@subsection The older patient on many medicines\n\n'+
'A 78-year-old on eight medicines presenting with falls and confusion is a medicines review before '+
'it is anything else. Anticholinergic burden, sedatives, antihypertensives and hypoglycaemics are '+
'the usual contributors, and deprescribing is a legitimate intervention rather than a failure to treat.\n\n'+

'@section Explaining and recording a result\n\n'+
'@table What the conversation must cover\n'+
'Point | Why\n'+
'What was tested | The result covers specific genes, not all medicines\n'+
'What changes now | The immediate dosing or drug choice\n'+
'What it does not tell us | Other drugs, other genes, future conditions\n'+
'Who else it might concern | Genetic results can have family implications\n'+
'Where it is recorded | So it informs prescribing years from now\n\n'+
'@note\n'+
'A pharmacogenomic result is **durable** — it will not change for the rest of the patient\'s life. '+
'That is precisely why it must be recorded permanently and prominently. A test whose result is lost '+
'when the patient changes hospital has been wasted.\n\n'+
'@activity Activity 3.1\n'+
'Write, in plain language and under 150 words, an explanation for a patient who is a CYP2D6 poor '+
'metaboliser and has been told codeine "does not work" for them. Avoid the words gene and enzyme, '+
'and see whether it still works.\n\n'+
'@keyterms\n'+
'Prodrug: an inactive compound converted to the active drug by the body.\n'+
'Actionable variant: a genetic result that changes a prescribing decision.\n'+
'CPIC: guidelines stating what to do about a drug given a genotype you already have.\n'+
'Anticholinergic burden: the cumulative anticholinergic effect of a patient\'s medicines.\n\n'+
'@summary\n'+
'- A short list of drug-gene pairs is already routine practice; know what each prevents\n'+
'- Prodrugs invert the expected consequence of metaboliser status\n'+
'- Results are probabilistic; the patient in front of you is the more recent evidence\n'+
'- A durable result must be recorded where a future prescriber will find it\n\n'+
'@exercise Exercises\n'+
'Q: Name the mandatory pharmacogenomic test before abacavir and state what it prevents.\n'+
'Q: Which test is recommended before carbamazepine in patients of South-East Asian ancestry, and why?\n'+
'Q: Explain why an ultra-rapid metaboliser faces toxicity rather than failure with codeine.\n'+
'Q: A patient says codeine has never relieved their pain. Give a plausible explanation and your action.\n'+
'Q: What question do CPIC guidelines answer, and what do they not answer?\n'+
'Q: Why must a pharmacogenomic result be recorded permanently?\n'+
'Q: A 78-year-old on eight medicines has falls and confusion. Outline your approach.\n\n'+

/* ============================== UNIT 4 ============================== */
'@chapter Digital Patient Care & Pharmacy Operations\n\n'+
'@objectives\n'+
'- Use adherence and dashboard data without over-reading it\n'+
'- Manage discharge as the highest-risk transition of care\n'+
'- Interpret operational measures and design a service change that holds\n'+
'- Triage digital patient contact safely\n\n'+

'@section What adherence data does and does not show\n\n'+
'A dashboard showing a patient collecting a statin every ninety days instead of every twenty-eight '+
'tells you about **collection**, not about **ingestion**. It is a prompt for a conversation, not a '+
'conclusion about the patient.\n\n'+
'@caution\n'+
'A patient who collects an inhaler faultlessly may still be getting no drug into their lungs. '+
'Technique must be observed, not inferred from supply records — and a poor technique demonstrated at '+
'the counter is worth more than any dashboard.\n\n'+

'@section Discharge is the dangerous moment\n\n'+
'A patient discharged on eight medicines, three of them new, is at high risk of harm in the '+
'following weeks. The single most valuable element of a discharge medication summary for the '+
'community pharmacist and the GP is **what changed and why** — which medicines were started, stopped '+
'or altered, and the reason. A list of current medicines without the changes forces everyone '+
'downstream to guess.\n\n'+
'@diagram steps Reconcile on admission > Track changes through the stay > State what changed and why > Counsel the patient > Communicate to primary care | Discharge safety is built across the whole admission\n\n'+
'@note\n'+
'Where a digital record shows **conflicting allergy information**, the conflict is resolved before '+
'the next dose, not noted for later. Ask the patient, find the source of each entry and correct the '+
'record — leaving both in place guarantees that someone eventually acts on the wrong one.\n\n'+

'@section Operational measures\n\n'+
'A pharmacy operations dashboard should be built to answer a question someone can act on today, not '+
'to display everything measurable.\n\n'+
'@table Measures and how to read them\n'+
'Measure | Read it as\n'+
'Turnaround time | Best monitored as a distribution, because the long tail is where harm sits\n'+
'Missed doses on the eMAR | A supply-chain signal when the reason is "medicine unavailable"\n'+
'Time-critical medicine delays | A safety incident in itself, not a service inconvenience\n'+
'Intervention rate | Meaningless without case mix\n\n'+
'@caution\n'+
'An average turnaround time hides the prescriptions that took four hours. Monitor the distribution — '+
'the median and a high percentile — because the tail is the part that harms patients.\n\n'+
'Medicines for Parkinson\'s disease are the standard example of a **time-critical** medicine: a dose '+
'given late is not a minor deviation but an immediate deterioration that can take days to recover.\n\n'+
'@subsection When a change makes things worse elsewhere\n\n'+
'A redesign that reduces dispensing time but increases prescribing errors has not improved the '+
'service. Judge a change on the whole pathway, and measure the thing you might have broken as well '+
'as the thing you set out to improve.\n\n'+
'@note\n'+
'The most reliable predictor of whether a new digital workflow succeeds is whether the people who '+
'must use it were involved in designing it. Technical quality is necessary and nowhere near '+
'sufficient.\n\n'+

'@section Digital contact and its limits\n\n'+
'A telepharmacy follow-up that discovers a patient has not started a new medicine has found '+
'something no dashboard would show, and the useful question is why — cost, fear, confusion, or a '+
'side effect they were never warned about.\n\n'+
'@caution\n'+
'A patient portal message describing **chest pain** is not a message to answer in the portal. It is '+
'escalated immediately through an urgent clinical route. Asynchronous channels are unsuitable for '+
'anything time-critical, and the patient has no way of knowing that.\n\n'+
'@activity Activity 4.1\n'+
'Take a discharge summary from your placement. Rewrite the medication section so a community '+
'pharmacist could act on it in thirty seconds. Note what you had to hunt for elsewhere in the notes.\n\n'+
'@activity Activity 4.2\n'+
'Keep a log for one week of every decision where you were uncertain. Group them at the end. The '+
'largest group is your next learning objective — state it as something you can measure.\n\n'+
'@keyterms\n'+
'Time-critical medicine: one where a delayed dose causes harm in itself.\n'+
'Turnaround time: the interval from receipt of a prescription to it being ready.\n'+
'Medicines reconciliation: comparing medicine lists across care settings to resolve discrepancies.\n'+
'Escalation: raising a concern through a route with the authority and speed to act.\n\n'+
'@summary\n'+
'- Adherence data shows collection, not ingestion, and technique must be observed\n'+
'- The most valuable part of a discharge summary is what changed and why\n'+
'- Monitor turnaround as a distribution; the tail is where harm sits\n'+
'- A change that improves one measure and worsens another has not improved the service\n'+
'- Asynchronous channels are unsafe for anything time-critical\n\n'+
'@exercise Exercises\n'+
'Q: A dashboard shows a patient collecting a statin every 90 days instead of 28. What does this tell you, and what does it not?\n'+
'Q: State the most valuable element of a discharge medication summary and justify your answer.\n'+
'Q: Why should turnaround time be monitored as a distribution rather than an average?\n'+
'Q: Why are Parkinson\'s disease medicines treated as time-critical?\n'+
'Q: A portal message describes chest pain. State your action and the principle behind it.\n'+
'Q: A redesign cuts dispensing time but raises prescribing errors. Has the service improved? Justify.\n'+
'Q: A record shows conflicting allergy entries. Describe how you resolve it and by when.\n\n'+

'@section Practical programme\n\n'+
'The practicals for this module run in ALIZON OS and are scored in the browser. Each one withholds '+
'information until you go and look for it, so the mark reflects what you investigated as well as '+
'what you concluded.\n\n'+
'@activity Practical 1 · AI Prescription Review & Safety Audit (Unit 1)\n'+
'A ward round of prescriptions ranked by an AI risk score. Work them in the order the tool suggests, '+
'but clear every one — because the most dangerous order on the round is ranked low.\n\n'+
'@activity Capstone · Integrated Clinical Simulation\n'+
'A full patient journey drawing on everything in the programme.\n'
};
})();
