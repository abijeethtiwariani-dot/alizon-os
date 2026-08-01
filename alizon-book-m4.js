/* alizon-book-m4.js — Module 4 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m4 = {
 meta:{module:'4', title:'AI in Drug Development, Vaccines & Injectables',
       sub:'Discovery, Sterile Products and the Cold Chain', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter AI in Drug Discovery & Molecular Targeting\n\n'+
'@objectives\n'+
'- Outline the stages of drug discovery and where AI contributes\n'+
'- Explain virtual screening and its limits\n'+
'- Describe what structure prediction changed\n'+
'- State why most candidates still fail\n\n'+
'@section The pipeline and its attrition\n\n'+
'Drug discovery moves from target identification through hit finding, lead optimisation and '+
'preclinical work to clinical trials. Attrition is severe at every stage, and most of it happens for '+
'reasons no computational method currently predicts well: unexpected toxicity, and lack of efficacy '+
'in real patients.\n\n'+
'@diagram flow Target > Hits > Leads > Preclinical > Clinical | Each arrow discards the great majority of candidates\n\n'+
'@section Virtual screening\n\n'+
'Virtual screening computationally ranks large libraries of compounds for likely binding, so that '+
'laboratory effort goes to the most promising. It narrows the search; it does not settle it.\n\n'+
'@caution\n'+
'A high docking score predicts binding, not benefit. A compound may bind beautifully and still be '+
'insoluble, rapidly metabolised, unable to reach its target tissue, or toxic.\n\n'+
'@know Did you know?\n'+
'Accurate protein structure prediction removed a bottleneck that had stood for fifty years. It made '+
'structures available for targets nobody had crystallised — which accelerates the earliest stage of '+
'discovery, the one that was never the main cause of failure.\n\n'+
'@activity Activity 1.1\n'+
'Choose one recently approved medicine and trace its published development timeline. Identify where '+
'computational methods were reported to have saved time.\n\n'+
'@keyterms\n'+
'Target: the molecule, usually a protein, a drug is intended to act on.\n'+
'Virtual screening: computational ranking of compound libraries for likely activity.\n'+
'Lead optimisation: refining a promising compound\'s potency, selectivity and safety.\n'+
'Attrition: the loss of candidates as they fail at successive stages.\n\n'+
'@summary\n'+
'- AI contributes most at the earliest, cheapest stages of discovery\n'+
'- Virtual screening narrows the search rather than settling it\n'+
'- Binding is necessary and nowhere near sufficient\n'+
'- Attrition is driven by toxicity and lack of efficacy, which remain hard to predict\n\n'+
'@exercise Exercises\n'+
'Q: List the stages of drug discovery and state where AI is most useful.\n'+
'Q: Explain virtual screening and name three reasons a high-scoring compound may still fail.\n'+
'Q: Why did protein structure prediction not solve the attrition problem?\n'+
'Q: Define lead optimisation.\n'+
'Q: Why is early-stage acceleration of limited value if late-stage attrition is unchanged?\n\n'+

'@chapter AI Support in Scientific Research & Data Analysis\n\n'+
'@objectives\n'+
'- Prepare a dataset for analysis and document what you changed\n'+
'- Choose an appropriate statistical test\n'+
'- Interpret a p-value and a confidence interval correctly\n'+
'- Verify anything an AI tool drafts for you\n\n'+
'@section Cleaning data honestly\n\n'+
'Most analysis time is spent preparing data. Every cleaning decision — an excluded outlier, an '+
'imputed value, a corrected duplicate — must be recorded, because each one can change the result.\n\n'+
'@diagram steps Inspect > Identify problems > Decide and document > Clean > Re-inspect | Cleaning is iterative and must be logged\n\n'+
'@caution\n'+
'Deleting an inconvenient outlier without a documented, pre-specified reason is data manipulation, '+
'however reasonable it feels at the time.\n\n'+
'@section Choosing a test, reading a result\n\n'+
'@table Common choices\n'+
'Question | Data | Usual test\n'+
'Difference between two independent groups | Continuous, roughly normal | Independent t-test\n'+
'Difference before and after in the same people | Continuous, paired | Paired t-test\n'+
'Difference between three or more groups | Continuous | ANOVA\n'+
'Association between two categories | Counts | Chi-squared\n'+
'Relationship between two continuous variables | Continuous | Correlation or regression\n\n'+
'@note\n'+
'A p-value is the probability of data at least this extreme if the null hypothesis were true. It is '+
'not the probability that the null hypothesis is true, and it says nothing about effect size. A '+
'confidence interval tells you far more.\n\n'+
'@section Verifying AI-drafted work\n\n'+
'AI tools will draft a method, summarise a paper or write code convincingly and sometimes wrongly. '+
'Check every number against the source, and every citation against the actual paper.\n\n'+
'@activity Activity 2.1\n'+
'Ask an AI tool to summarise a paper you have read closely. List every statement that is subtly '+
'wrong, and classify each as a fabrication, an overstatement or a misattribution.\n\n'+
'@keyterms\n'+
'Imputation: replacing a missing value with an estimate.\n'+
'p-value: the probability of data at least this extreme if the null hypothesis were true.\n'+
'Confidence interval: a range of values compatible with the data at a stated level.\n'+
'Reproducibility: the ability of others to obtain your results from your data and methods.\n\n'+
'@summary\n'+
'- Cleaning decisions change results, so document every one\n'+
'- Test choice follows from the question and the data type\n'+
'- A p-value is widely misread; the confidence interval carries more information\n'+
'- AI drafts must be checked line by line against sources\n\n'+
'@exercise Exercises\n'+
'Q: Why must every data-cleaning decision be documented?\n'+
'Q: Choose a test: comparing blood pressure in the same patients before and after treatment.\n'+
'Q: State what a p-value is and one common misinterpretation of it.\n'+
'Q: Why is a confidence interval more informative than a p-value alone?\n'+
'Q: Describe two ways an AI-drafted literature summary can mislead.\n\n'+

'@chapter Injectable Medicines & Sterile Products\n\n'+
'@objectives\n'+
'- Explain why sterile products demand a different standard of care\n'+
'- Describe aseptic technique and the environment it requires\n'+
'- Perform and check a dilution calculation\n'+
'- Identify the highest-risk points in preparing an injectable\n\n'+
'@section Why sterile is different\n\n'+
'An error in an oral medicine may be absorbed slowly and partly corrected. An error in an '+
'intravenous medicine is delivered directly and completely. There is no recall once the line is '+
'running.\n\n'+
'@diagram pyramid All medicines > Injectables > High-alert injectables > Given by infusion | Risk concentrates toward the base\n\n'+
'@caution\n'+
'Concentrated potassium chloride must never be given undiluted. It is the classic example of a '+
'medicine whose harm is immediate, irreversible and entirely preventable by system design.\n\n'+
'@section Aseptic technique and environment\n\n'+
'Aseptic preparation depends on the environment, the technique and the discipline of the operator '+
'together. Any one of the three failing defeats the other two.\n\n'+
'@table Controls that matter\n'+
'Control | Purpose\n'+
'Laminar airflow | Sweeps particles away from the critical zone\n'+
'Cleanroom grading | Limits the particle burden in the surrounding air\n'+
'Hand hygiene and gowning | Removes the operator as a source of contamination\n'+
'No-touch technique | Keeps critical surfaces untouched\n'+
'Second check of calculations | Catches arithmetic before it reaches a patient\n\n'+
'@section Getting the arithmetic right\n\n'+
'Dilution errors are among the most damaging in pharmacy because a factor-of-ten slip is easy to '+
'make and hard to see. Work in a consistent set of units and have a second person check '+
'independently — that is, calculate it themselves rather than reading your working.\n\n'+
'@note\n'+
'A check that consists of reading someone else\'s arithmetic tends to confirm it. An independent '+
'recalculation is a genuine check; a re-reading usually is not.\n\n'+
'@activity Activity 3.1\n'+
'Prepare, on paper, a 50 mL infusion of a drug at 4 mg/mL from a 200 mg in 5 mL vial. Show every '+
'step, then have a partner recalculate independently and compare.\n\n'+
'@keyterms\n'+
'Aseptic technique: practice that prevents contamination of a sterile product.\n'+
'Laminar airflow: unidirectional filtered airflow protecting a critical work zone.\n'+
'High-alert medicine: one that carries a heightened risk of significant harm when used in error.\n'+
'Independent double check: a second person calculating afresh, not reviewing the first working.\n\n'+
'@summary\n'+
'- An intravenous error is delivered directly and cannot be recalled\n'+
'- Environment, technique and operator discipline must all hold\n'+
'- Concentrated electrolytes are a designed-out hazard, not a judgement call\n'+
'- A genuine second check is an independent recalculation\n\n'+
'@exercise Exercises\n'+
'Q: Why do injectables demand a higher standard of care than oral medicines?\n'+
'Q: Name four controls in aseptic preparation and what each achieves.\n'+
'Q: Explain the difference between a re-read and an independent double check.\n'+
'Q: Calculate the volume of a 200 mg in 5 mL vial needed for a 150 mg dose.\n'+
'Q: Why is concentrated potassium chloride handled by system design rather than by care alone?\n\n'+

'@chapter Vaccines & Cold-Chain Analytics\n\n'+
'@objectives\n'+
'- Describe the cold chain and the consequences of breaking it\n'+
'- Interpret a vaccine vial monitor correctly\n'+
'- Distinguish heat damage from freeze damage\n'+
'- Investigate a temperature excursion\n\n'+
'@section The cold chain\n\n'+
'The cold chain is the unbroken series of controlled-temperature steps from manufacture to '+
'administration. Most vaccines require +2 °C to +8 °C. Damage accumulates and is invisible: a '+
'damaged vaccine looks exactly like a good one.\n\n'+
'@diagram flow Manufacture > Central store > Regional store > Clinic fridge > Patient | Every link must hold\n\n'+
'@section Reading a vaccine vial monitor\n\n'+
'A **vaccine vial monitor** is a heat-sensitive label whose inner square darkens with cumulative '+
'heat exposure. When the inner square is as dark as the outer ring, the vial is discarded.\n\n'+
'@caution\n'+
'A VVM records **heat only**. A vaccine destroyed by freezing will still show a perfect monitor. For '+
'freeze-sensitive vaccines the VVM tells you nothing about the damage that matters most.\n\n'+
'@table Which vaccines fear what\n'+
'Damage | Typical consequence\n'+
'Excess heat | Gradual, cumulative loss of potency\n'+
'Freezing | Sudden, irreversible damage to adsorbed vaccines\n'+
'Light | Loss of potency in light-sensitive products\n\n'+
'@diagram steps Detect the excursion > Quarantine the stock > Record the data > Assess against product limits > Decide and document | Investigating a temperature excursion\n\n'+
'@note\n'+
'Quarantine is not disposal. Stock is isolated so it cannot be used while the assessment is made — '+
'discarding usable vaccine is a real loss, and so is administering a damaged one.\n\n'+
'@activity Activity 4.1\n'+
'Obtain a week of temperature-logger data from a vaccine fridge. Identify every excursion, and for '+
'each state whether it was a heat or a freeze event and what you would do.\n\n'+
'@keyterms\n'+
'Cold chain: the unbroken temperature-controlled supply chain for thermolabile products.\n'+
'VVM: vaccine vial monitor, a label indicating cumulative heat exposure.\n'+
'Excursion: a period during which temperature left the required range.\n'+
'Shake test: a test used to identify a previously frozen adsorbed vaccine.\n\n'+
'@summary\n'+
'- Cold-chain damage accumulates and is invisible on inspection\n'+
'- A VVM records heat only and is silent about freezing\n'+
'- Freezing damages adsorbed vaccines suddenly and irreversibly\n'+
'- Quarantine first, assess against the product\'s own limits, then decide\n\n'+
'@exercise Exercises\n'+
'Q: Define the cold chain and state the usual temperature range for most vaccines.\n'+
'Q: Explain how a VVM works and state precisely what it does not tell you.\n'+
'Q: Contrast the effects of heat and freezing on an adsorbed vaccine.\n'+
'Q: List the steps of a temperature excursion investigation in order and justify the order.\n'+
'Q: Why is discarding vaccine unnecessarily treated as a real loss?\n'
};

/* ============================================================
   MODULE 5
   ============================================================ */;
})();
