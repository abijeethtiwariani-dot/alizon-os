/* alizon-book-m3.js — Module 3 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m3 = {
 meta:{module:'3', title:'AI-Based Clinical Decision Support in Pharmacy',
       sub:'Alerts, Interactions and Prediction', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Clinical Decision Support Systems (CDSS)\n\n'+
'@objectives\n'+
'- Describe what a CDSS does and the forms it takes\n'+
'- Explain alert fatigue and its consequences for patient safety\n'+
'- Triage an alert queue by clinical risk rather than by system severity\n'+
'- Justify overriding an alert in a defensible way\n\n'+
'@section What decision support actually is\n\n'+
'A clinical decision support system presents patient-specific advice at the moment a decision is '+
'being made. It may be a hard stop, a pop-up warning, an order set, or a quiet reminder in the '+
'margin. The best support is often the least intrusive.\n\n'+
'@diagram compare Interruptive | Non-interruptive ; Pop-up that blocks work | Information in the margin ; High compliance, high fatigue | Low fatigue, easier to miss ; Reserve for real danger | Suits routine guidance\n\n'+
'@section Alert fatigue\n\n'+
'Where most alerts are unimportant, clinicians learn to dismiss them without reading — including the '+
'few that matter. Override rates above eighty per cent are common and should be read as a fault in '+
'the system, not in the clinician.\n\n'+
'@caution\n'+
'The system\'s severity label is a generalisation. An alert badged "moderate" can be the most '+
'dangerous item in your queue once you know the patient — an interaction of moderate severity in a '+
'patient already bleeding is not a moderate problem.\n\n'+
'@diagram steps Read the alert > Open the patient record > Judge the actual risk > Act or override > Record your reasoning | Working an alert properly\n\n'+
'@note\n'+
'An override without a recorded reason is indistinguishable from not having looked. Your reasoning '+
'is the evidence that a professional judgement took place.\n\n'+
'@activity Activity 1.1\n'+
'Record every alert you meet in one shift, with its severity and what you did. Calculate your '+
'override rate, then review whether each override was justified.\n\n'+
'@keyterms\n'+
'CDSS: software presenting patient-specific advice at the point of a clinical decision.\n'+
'Alert fatigue: desensitisation from excessive low-value warnings.\n'+
'Override: proceeding despite an alert, ideally with a documented reason.\n'+
'Hard stop: an alert that cannot be overridden without a separate authorisation.\n\n'+
'@summary\n'+
'- Decision support ranges from quiet reminders to hard stops\n'+
'- High override rates indicate a poorly tuned system, not careless staff\n'+
'- Severity labels are generalisations; the patient decides the real risk\n'+
'- Record the reasoning, not just the decision\n\n'+
'@exercise Exercises\n'+
'Q: Define a CDSS and give two examples from dispensing practice.\n'+
'Q: Explain alert fatigue and its consequence for patient safety.\n'+
'Q: Why can a "moderate" alert be more urgent than a "severe" one?\n'+
'Q: What must a defensible override record contain?\n'+
'Q: Suggest two changes that would reduce alert volume without hiding real risk.\n\n'+

'@chapter Drug Interaction & Dose Optimization Software Tools\n\n'+
'@objectives\n'+
'- Classify interactions by mechanism\n'+
'- Judge the clinical significance of a flagged interaction\n'+
'- Adjust a dose for renal function using a recognised method\n'+
'- State the limits of automated dose calculators\n\n'+
'@section Mechanisms of interaction\n\n'+
'Interactions are conventionally divided into **pharmacokinetic** — one drug alters the absorption, '+
'distribution, metabolism or excretion of another — and **pharmacodynamic**, where effects combine '+
'at the site of action. Knowing which you are dealing with tells you what to do about it.\n\n'+
'@diagram flow Absorption > Distribution > Metabolism > Excretion | Pharmacokinetic interactions can occur at any stage\n\n'+
'@table Judging significance\n'+
'Question | Why it matters\n'+
'Is the effect clinically meaningful? | Many documented interactions are not\n'+
'How narrow is the therapeutic index? | Narrow-index drugs leave no margin\n'+
'Is this patient vulnerable? | Age, renal and hepatic function change everything\n'+
'Can it be monitored? | A monitorable interaction may be acceptable\n'+
'Is there an alternative? | Substitution may be simpler than management\n\n'+
'@section Dose adjustment in renal impairment\n\n'+
'Renal function drives dosing for a large share of medicines. Estimating equations give a number; '+
'they do not give a decision, and each has assumptions that fail in particular patients.\n\n'+
'@caution\n'+
'Estimating equations assume stable renal function. In acute kidney injury the creatinine lags '+
'behind the true state, so a reassuring estimate may describe a patient who is deteriorating.\n\n'+
'@activity Activity 2.1\n'+
'Take three medicines from your formulary that need renal adjustment. Work out the dose for a '+
'patient with an eGFR of 28, then check each against the summary of product characteristics.\n\n'+
'@keyterms\n'+
'Pharmacokinetic interaction: one drug alters the handling of another by the body.\n'+
'Pharmacodynamic interaction: two drugs act on the same system, additively or oppositely.\n'+
'Therapeutic index: the margin between an effective and a toxic concentration.\n'+
'eGFR: estimated glomerular filtration rate, an index of renal function.\n\n'+
'@summary\n'+
'- Mechanism tells you what management is possible\n'+
'- A documented interaction is not automatically a clinically significant one\n'+
'- Narrow therapeutic index plus a vulnerable patient is the combination to fear\n'+
'- Estimating equations assume stability and mislead in acute illness\n\n'+
'@exercise Exercises\n'+
'Q: Distinguish pharmacokinetic from pharmacodynamic interaction with one example of each.\n'+
'Q: List five questions you would ask to judge whether a flagged interaction matters.\n'+
'Q: Why is a narrow therapeutic index a risk multiplier?\n'+
'Q: Explain why eGFR misleads in acute kidney injury.\n'+
'Q: When is monitoring a reasonable alternative to stopping one of two interacting drugs?\n\n'+

'@chapter Pharmacogenomics & Antibiogram Analysis\n\n'+
'@objectives\n'+
'- Explain how genetic variation alters drug response\n'+
'- Interpret a common pharmacogenomic result\n'+
'- Read a local antibiogram and use it for empirical choice\n'+
'- Describe how stewardship uses local resistance data\n\n'+
'@section Why the same dose does not suit everyone\n\n'+
'Variation in the enzymes that metabolise drugs means a standard dose can be sub-therapeutic in one '+
'patient and toxic in another. Metaboliser status is conventionally grouped into four phenotypes.\n\n'+
'@diagram compare Phenotype | Consequence ; Poor metaboliser | Drug accumulates, toxicity risk ; Intermediate | Reduced clearance ; Normal | Expected response ; Ultra-rapid | Drug cleared fast, may fail\n\n'+
'@know Did you know?\n'+
'For a **prodrug** the logic inverts. Codeine must be converted to morphine to work at all, so an '+
'ultra-rapid metaboliser produces morphine faster than expected — the risk is toxicity, not failure. '+
'Always ask whether you are dealing with a drug or a prodrug before predicting the effect.\n\n'+
'@section Reading a local antibiogram\n\n'+
'An antibiogram summarises how often local isolates of an organism are susceptible to each agent. It '+
'is the evidence base for empirical therapy — the choice you make before culture results return.\n\n'+
'@diagram bar Co-amoxiclav 61 > Ciprofloxacin 48 > Gentamicin 88 > Meropenem 96 | Illustrative susceptibility (%) of local E. coli isolates\n\n'+
'@note\n'+
'Susceptibility percentages are local and they drift. An antibiogram from another hospital, or from '+
'three years ago, is a description of a different problem.\n\n'+
'@caution\n'+
'Choosing the agent with the highest susceptibility every time drives resistance to it. Stewardship '+
'means choosing the narrowest agent that will work, not the strongest available.\n\n'+
'@activity Activity 3.1\n'+
'Obtain your hospital\'s current antibiogram. For an uncomplicated urinary infection, decide which '+
'empirical agent you would recommend and justify it in three sentences.\n\n'+
'@keyterms\n'+
'Pharmacogenomics: the study of how genetic variation affects response to medicines.\n'+
'Prodrug: an inactive compound converted into the active drug by the body.\n'+
'Antibiogram: a summary of local antimicrobial susceptibility patterns.\n'+
'Empirical therapy: treatment started before the causative organism is known.\n\n'+
'@summary\n'+
'- Metaboliser status changes the effect of a standard dose in both directions\n'+
'- Prodrugs invert the expected consequence of rapid metabolism\n'+
'- Antibiograms are local and perishable\n'+
'- Stewardship selects the narrowest effective agent, not the strongest\n\n'+
'@exercise Exercises\n'+
'Q: Name the four metaboliser phenotypes and their consequences for a standard drug.\n'+
'Q: Why does an ultra-rapid metaboliser face toxicity rather than failure with codeine?\n'+
'Q: What is an antibiogram and why must it be local?\n'+
'Q: Define empirical therapy and explain the antibiogram\'s role in it.\n'+
'Q: Explain why always choosing the most active agent is poor stewardship.\n\n'+

'@chapter Predictive Pharmacovigilance\n\n'+
'@objectives\n'+
'- Explain how safety signals are detected in large datasets\n'+
'- Distinguish association from causation in spontaneous report data\n'+
'- Describe the biases in spontaneous reporting\n'+
'- Judge when a signal warrants action\n\n'+
'@section From reports to signals\n\n'+
'Pharmacovigilance looks for **disproportionality**: a drug–event pair reported more often than the '+
'background rate of that event across all drugs. Disproportionality is a reason to look, not a '+
'finding of causation.\n\n'+
'@diagram steps Collect reports > Detect disproportionality > Triage the signal > Investigate > Act and communicate | From report to regulatory action\n\n'+
'@table Biases that shape the data\n'+
'Bias | Effect\n'+
'Under-reporting | Most reactions are never reported at all\n'+
'Notoriety | Publicity about a drug increases reporting of it\n'+
'Weber effect | Reporting peaks in the first years after launch, then falls\n'+
'Indication confounding | The disease, not the drug, may cause the event\n\n'+
'@caution\n'+
'Spontaneous report databases have no denominator. You know how many reports arrived, not how many '+
'patients took the drug — so you cannot calculate a true incidence from them.\n\n'+
'@section Machine learning\'s contribution\n\n'+
'Models can search combinations no human could review and can surface signals earlier. They also '+
'inherit every bias in the reports and can produce confident nonsense at scale. Every signal still '+
'requires clinical assessment before it means anything.\n\n'+
'@activity Activity 4.1\n'+
'Find a published safety signal that was later withdrawn on investigation. Write a short account of '+
'what made it look convincing and what eventually disproved it.\n\n'+
'@keyterms\n'+
'Signal: information suggesting a new or changed causal association between a drug and an event.\n'+
'Disproportionality: a drug–event pair reported more often than expected relative to all drugs.\n'+
'Under-reporting: the systematic tendency for reactions to go unreported.\n'+
'Confounding by indication: the underlying disease causing the event attributed to the drug.\n\n'+
'@summary\n'+
'- Signals are generated by disproportionality, then assessed clinically\n'+
'- Spontaneous data has no denominator and cannot give incidence\n'+
'- Under-reporting, notoriety and confounding all distort the picture\n'+
'- Machine learning widens the search and inherits every existing bias\n\n'+
'@exercise Exercises\n'+
'Q: Define a safety signal and explain how disproportionality analysis generates one.\n'+
'Q: Why can incidence not be calculated from spontaneous reports?\n'+
'Q: Describe the Weber effect and its consequence for interpreting trends.\n'+
'Q: Explain confounding by indication with a worked example.\n'+
'Q: What must happen between a statistical signal and a regulatory action?\n'
};

/* ============================================================
   MODULE 4
   ============================================================ */;
})();
