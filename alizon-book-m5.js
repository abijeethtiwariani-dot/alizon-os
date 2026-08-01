/* alizon-book-m5.js — Module 5 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m5 = {
 meta:{module:'5', title:'Clinical Trials, Pharmacovigilance & Evidence-Based Pharmacy',
       sub:'Evidence, Ethics and Safety', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Clinical Trials in Pharmacy\n\n'+
'@objectives\n'+
'- Describe the phases of a clinical trial and what each answers\n'+
'- Explain randomisation, blinding and control\n'+
'- State the pharmacist\'s responsibilities for investigational products\n'+
'- Recognise a protocol deviation and respond correctly\n\n'+
'@section What each phase asks\n\n'+
'@table The phases\n'+
'Phase | Question | Typical size\n'+
'I | Is it safe, and at what dose? | 20–100\n'+
'II | Does it appear to work, and at what dose? | 100–300\n'+
'III | Is it better than current treatment? | 300–3000+\n'+
'IV | What happens in real use, over time? | Post-marketing\n\n'+
'@diagram flow Phase I safety > Phase II efficacy signal > Phase III comparison > Phase IV real-world | Each phase answers a different question\n\n'+
'@section Why randomisation and blinding\n\n'+
'**Randomisation** distributes both known and unknown confounders between groups. That second part '+
'is the one no amount of statistical adjustment can replicate. **Blinding** prevents expectation '+
'from shaping how treatment is given, reported and assessed.\n\n'+
'@note\n'+
'Allocation concealment and blinding are different things. Concealment stops the person enrolling a '+
'patient from knowing the next assignment; blinding keeps people unaware after allocation.\n\n'+
'@section The pharmacist\'s role\n\n'+
'The trial pharmacist holds accountability for the investigational product: receipt, storage under '+
'defined conditions, dispensing to the right participant against the randomisation, and full '+
'reconciliation of every unit. Nothing may be unaccounted for.\n\n'+
'@caution\n'+
'Dispensing an expired investigational product or breaking the blind without cause are among the '+
'most serious deviations. Both are reportable and both can invalidate a participant\'s data.\n\n'+
'@activity Activity 1.1\n'+
'Write the standard operating procedure for receiving investigational product into your pharmacy. '+
'Include temperature verification, quarantine, and what to do if the shipment arrives warm.\n\n'+
'@keyterms\n'+
'Randomisation: allocating participants to groups by chance to balance confounders.\n'+
'Blinding: keeping participants and/or assessors unaware of allocation.\n'+
'Investigational product: the trial medicine or its comparator.\n'+
'Protocol deviation: any departure from the approved protocol.\n\n'+
'@summary\n'+
'- Each phase answers a distinct question; skipping a question is not permitted\n'+
'- Randomisation balances unknown confounders, which adjustment cannot\n'+
'- The pharmacist accounts for every unit of investigational product\n'+
'- Deviations must be recorded and reported, not quietly corrected\n\n'+
'@exercise Exercises\n'+
'Q: State the question each trial phase answers.\n'+
'Q: Why is randomisation superior to statistical adjustment for confounding?\n'+
'Q: Distinguish allocation concealment from blinding.\n'+
'Q: List four responsibilities of the trial pharmacist for investigational product.\n'+
'Q: A participant is given the wrong kit number. What is this, and what must happen next?\n\n'+

'@chapter Good Clinical Practice (GCP) & Ethics\n\n'+
'@objectives\n'+
'- State the principles underlying GCP\n'+
'- Explain what makes consent valid\n'+
'- Describe the role of the ethics committee\n'+
'- Apply the principle of equipoise\n\n'+
'@section Where the rules came from\n\n'+
'The Nuremberg Code, the Declaration of Helsinki and later GCP guidance were each written in '+
'response to research that harmed the people it studied. The rules are not bureaucracy; they are the '+
'residue of specific failures.\n\n'+
'@diagram timeline 1947 Nuremberg Code > 1964 Declaration of Helsinki > 1996 ICH-GCP > 2017 New Drugs & Clinical Trials Rules | Milestones in research ethics\n\n'+
'@section Valid consent\n\n'+
'Consent is a process, not a signature. It requires **capacity**, **sufficient information**, '+
'**understanding**, and that it be **voluntary** — free from pressure, including the subtle pressure '+
'of a treating clinician making the request.\n\n'+
'@caution\n'+
'A signed form from someone who did not understand is not consent; it is documentation of a failure. '+
'Check understanding by asking the participant to explain the study back to you.\n\n'+
'@section Equipoise and the ethics committee\n\n'+
'**Clinical equipoise** is genuine uncertainty in the expert community about which arm is better. '+
'Without it, randomising a patient means knowingly assigning some to worse treatment. The ethics '+
'committee reviews the science, the risk, the consent materials, and the arrangements for '+
'vulnerable participants — and it has authority to stop a trial.\n\n'+
'@activity Activity 2.1\n'+
'Take a patient information sheet and rewrite one paragraph for a reader with limited literacy, '+
'without losing any material fact. Note what was hardest to keep.\n\n'+
'@keyterms\n'+
'GCP: an international standard for the ethical and scientific conduct of trials.\n'+
'Informed consent: a voluntary, informed and understood agreement to take part.\n'+
'Equipoise: genuine uncertainty about which trial arm is superior.\n'+
'Ethics committee: the independent body that reviews and oversees a study.\n\n'+
'@summary\n'+
'- GCP encodes lessons from research that harmed participants\n'+
'- Consent needs capacity, information, understanding and voluntariness\n'+
'- Without equipoise, randomisation is not ethically defensible\n'+
'- The ethics committee can and does halt studies\n\n'+
'@exercise Exercises\n'+
'Q: Name the four requirements of valid consent.\n'+
'Q: Explain clinical equipoise and why a trial cannot proceed without it.\n'+
'Q: Why might a treating clinician be the wrong person to seek consent?\n'+
'Q: State three things an ethics committee reviews.\n'+
'Q: How would you check that a participant has genuinely understood a study?\n\n'+

'@chapter Pharmacovigilance & ADR Reporting\n\n'+
'@objectives\n'+
'- Classify adverse drug reactions\n'+
'- Assess causality using a structured method\n'+
'- Decide whether a reaction is serious\n'+
'- Complete a report that is actually useful\n\n'+
'@section Classifying reactions\n\n'+
'@table The classical types\n'+
'Type | Character | Example\n'+
'A — Augmented | Dose-related, predictable from pharmacology | Bleeding with an anticoagulant\n'+
'B — Bizarre | Not dose-related, unpredictable | Anaphylaxis to penicillin\n'+
'C — Chronic | Related to cumulative dose | Osteoporosis with long-term steroids\n'+
'D — Delayed | Appears long after exposure | Teratogenicity\n'+
'E — End of use | Follows withdrawal | Rebound hypertension\n\n'+
'@section Seriousness and causality are different questions\n\n'+
'**Seriousness** is defined by outcome — death, life-threatening event, hospitalisation, persistent '+
'disability, congenital anomaly, or another medically important event. It is not a synonym for '+
'severe. A severe headache may not be serious; a symptomless arrhythmia may be.\n\n'+
'@note\n'+
'Causality assessment scales such as Naranjo ask about temporal relationship, dechallenge, '+
'rechallenge, alternative explanations and prior reports. They produce a category — doubtful, '+
'possible, probable, definite — not a verdict.\n\n'+
'@diagram steps Suspect > Record the four elements > Assess seriousness > Assess causality > Report > Follow up | The reporting sequence\n\n'+
'@caution\n'+
'Never rechallenge deliberately to confirm causality. Positive rechallenge is strong evidence, but '+
'deliberately re-exposing a patient to a suspected harm is not defensible.\n\n'+
'@activity Activity 3.1\n'+
'Apply a causality scale to a case from your placement. Note which questions you could not answer '+
'and what that missing information would have changed.\n\n'+
'@keyterms\n'+
'Serious reaction: one meeting a defined outcome criterion, regardless of severity.\n'+
'Dechallenge: the response when the suspect drug is stopped.\n'+
'Rechallenge: the response if the drug is given again.\n'+
'Causality assessment: structured judgement of how likely the drug caused the event.\n\n'+
'@summary\n'+
'- The A–E classification tells you what kind of problem you have\n'+
'- Serious is a definition about outcome, not a description of severity\n'+
'- Causality scales categorise; they do not prove\n'+
'- Deliberate rechallenge is not an acceptable diagnostic step\n\n'+
'@exercise Exercises\n'+
'Q: Classify: anaphylaxis after a first dose of penicillin. Give the type and justify it.\n'+
'Q: Distinguish serious from severe with an example of each.\n'+
'Q: Name four factors a causality scale considers.\n'+
'Q: Why is deliberate rechallenge unacceptable despite its evidential value?\n'+
'Q: State the four minimum elements of a valid report.\n\n'+

'@chapter Evidence-Based Pharmacy & AI-Driven Literature Analysis\n\n'+
'@objectives\n'+
'- Frame an answerable clinical question\n'+
'- Rank study designs by susceptibility to bias\n'+
'- Appraise a paper for internal validity\n'+
'- Use AI literature tools without inheriting their errors\n\n'+
'@section Asking a question you can answer\n\n'+
'The **PICO** structure — Population, Intervention, Comparator, Outcome — converts a vague worry '+
'into something searchable. "Is this drug any good?" cannot be answered. "In adults with type 2 '+
'diabetes and nephropathy, does drug X compared with placebo reduce progression to dialysis?" can.\n\n'+
'@diagram pyramid Systematic review > Randomised trial > Cohort > Case-control > Case series | The hierarchy of evidence by susceptibility to bias\n\n'+
'@note\n'+
'The hierarchy ranks designs, not individual papers. A badly conducted randomised trial can be '+
'weaker evidence than an excellent cohort study. Appraise the paper, not just its label.\n\n'+
'@section Appraising a paper\n\n'+
'@table Questions that expose weakness\n'+
'Question | What a weak answer looks like\n'+
'Was allocation concealed? | Method not described\n'+
'Were groups similar at baseline? | Meaningful imbalance, unadjusted\n'+
'Was follow-up complete? | Large or unequal loss between arms\n'+
'Was the outcome patient-relevant? | A surrogate marker only\n'+
'Was the analysis by intention to treat? | Only completers analysed\n\n'+
'@caution\n'+
'A **surrogate outcome** such as a blood test result is not the same as a clinical outcome. Drugs '+
'have improved surrogate markers while making patient outcomes worse.\n\n'+
'@section Using AI on the literature\n\n'+
'AI tools can find, cluster and summarise papers far faster than you can. They also hallucinate '+
'citations, misattribute findings and flatten caveats. Treat any AI output as a lead to verify.\n\n'+
'@diagram steps Search with AI > Retrieve the actual papers > Read the methods yourself > Appraise > Synthesise | AI accelerates finding, not judging\n\n'+
'@activity Activity 4.1\n'+
'Ask an AI tool for the evidence on a clinical question you know well. Verify every citation it '+
'gives. Record how many were real, relevant and correctly described.\n\n'+
'@keyterms\n'+
'PICO: Population, Intervention, Comparator, Outcome — a question framework.\n'+
'Intention to treat: analysing participants in the group they were allocated to.\n'+
'Surrogate outcome: a measurable substitute for a clinically important outcome.\n'+
'Internal validity: the extent to which a study\'s result is free from bias.\n\n'+
'@summary\n'+
'- PICO turns a worry into an answerable question\n'+
'- The hierarchy ranks designs; individual papers still need appraisal\n'+
'- Surrogate outcomes can improve while patients do worse\n'+
'- AI finds literature quickly and must never be the last word on what it says\n\n'+
'@exercise Exercises\n'+
'Q: Convert "should we use drug X?" into a PICO question.\n'+
'Q: Why can a randomised trial be weaker evidence than a cohort study?\n'+
'Q: Explain intention to treat and why it matters.\n'+
'Q: Give an example of a surrogate outcome and the risk of relying on it.\n'+
'Q: List three ways an AI literature summary can mislead, and how you would detect each.\n'
};

/* ============================================================
   MODULE 6
   ============================================================ */;
})();
