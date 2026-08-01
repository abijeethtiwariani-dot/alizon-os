/* alizon-book-m6.js — Module 6 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m6 = {
 meta:{module:'6', title:'Pharmacy Data Analytics & Predictive Modelling',
       sub:'From Records to Decisions', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Introduction to Pharmacy Data & Analytics\n\n'+
'@objectives\n'+
'- Identify the main data a pharmacy generates\n'+
'- Distinguish descriptive, diagnostic, predictive and prescriptive analytics\n'+
'- Judge data quality before analysing anything\n'+
'- Present a finding so that someone can act on it\n\n'+
'@section What a pharmacy already knows\n\n'+
'Dispensing records, stock movements, purchase histories, intervention logs, temperature logs and '+
'incident reports are all data. Most of it is collected for operational reasons and never analysed.\n\n'+
'@diagram flow Descriptive: what happened > Diagnostic: why > Predictive: what next > Prescriptive: what to do | Four levels of analytics\n\n'+
'@section Quality before cleverness\n\n'+
'No model repairs bad data. Before analysis, check completeness, consistency, timeliness and whether '+
'the field means what its name suggests — free-text fields in particular rarely do.\n\n'+
'@caution\n'+
'A field labelled "quantity" may hold packs in one system and units in another. Aggregating the two '+
'produces a confident, precise and entirely wrong number.\n\n'+
'@table Quality checks worth doing first\n'+
'Check | Typical problem it finds\n'+
'Completeness | Whole days missing from a log\n'+
'Range | Ages of 0 or 200, negative quantities\n'+
'Consistency | The same drug spelled six ways\n'+
'Duplication | The same dispensing recorded twice\n'+
'Timeliness | Records entered in batches days later\n\n'+
'@section Presenting a finding\n\n'+
'A finding that is not acted on has failed. State what you found, how confident you are, what it '+
'implies, and what decision it supports — in that order, and briefly.\n\n'+
'@activity Activity 1.1\n'+
'Take one month of dispensing data. Run the five quality checks above and write a one-page note on '+
'what you would fix before trusting any analysis of it.\n\n'+
'@keyterms\n'+
'Descriptive analytics: summarising what has happened.\n'+
'Predictive analytics: estimating what is likely to happen next.\n'+
'Data quality: the fitness of data for its intended use.\n'+
'Granularity: the level of detail at which data is recorded.\n\n'+
'@summary\n'+
'- Pharmacies collect far more data than they analyse\n'+
'- The four levels progress from what happened to what to do\n'+
'- Quality checks come before any modelling\n'+
'- A finding must end in a decision to be worth reporting\n\n'+
'@exercise Exercises\n'+
'Q: Name four sources of data in a hospital pharmacy.\n'+
'Q: Distinguish predictive from prescriptive analytics with an example of each.\n'+
'Q: Give three data-quality checks and a problem each would reveal.\n'+
'Q: Why is a mismatched unit of measure especially dangerous in aggregation?\n'+
'Q: What four things should a finding communicate?\n\n'+

'@chapter Machine Learning in Pharmacy Practice\n\n'+
'@objectives\n'+
'- Distinguish supervised, unsupervised and reinforcement learning\n'+
'- Explain overfitting and how validation detects it\n'+
'- Read the common performance measures\n'+
'- Recognise bias entering through the training data\n\n'+
'@section Three kinds of learning\n\n'+
'@diagram compare Supervised | Unsupervised ; Learns from labelled examples | Finds structure without labels ; Predicts a known target | Groups similar cases ; Readmission risk | Patient segmentation\n\n'+
'Reinforcement learning, the third kind, learns by trial and feedback. It is rare in direct clinical '+
'use because the trials happen on someone.\n\n'+
'@section Overfitting\n\n'+
'A model that memorises its training data performs superbly on it and poorly on anything new. This '+
'is why performance must be measured on data the model has never seen.\n\n'+
'@diagram steps Split the data > Train on the training set > Tune on validation > Report on the held-out test set | Honest evaluation requires unseen data\n\n'+
'@caution\n'+
'Reporting accuracy on the training data is meaningless. If a published figure does not say which '+
'data it was measured on, treat the claim as unsupported.\n\n'+
'@section Reading the numbers\n\n'+
'@table Measures and what they hide\n'+
'Measure | Meaning | Trap\n'+
'Accuracy | Proportion correct | Useless when classes are imbalanced\n'+
'Sensitivity | Of those with the condition, how many found | Ignores false alarms\n'+
'Specificity | Of those without, how many correctly cleared | Ignores missed cases\n'+
'Precision | Of those flagged, how many were real | Depends on prevalence\n'+
'AUC | Ranking ability across thresholds | Says nothing about calibration\n\n'+
'@note\n'+
'If one per cent of patients have a condition, a model that always says "no" is 99% accurate and '+
'entirely useless. Always ask what the base rate is.\n\n'+
'@section Bias in, bias out\n\n'+
'A model trained on historical decisions learns historical patterns, including inequitable ones. If '+
'a group was historically under-treated, the model will predict that they need less treatment.\n\n'+
'@activity Activity 2.1\n'+
'Find a published clinical prediction model. Record which population it was trained on, which it was '+
'validated on, and whether that resembles the patients you serve.\n\n'+
'@keyterms\n'+
'Supervised learning: learning a mapping from labelled examples.\n'+
'Overfitting: fitting noise in the training data so performance does not generalise.\n'+
'Validation set: data held back to tune a model honestly.\n'+
'Calibration: whether predicted probabilities match observed frequencies.\n\n'+
'@summary\n'+
'- Supervised learning predicts a labelled target; unsupervised finds structure\n'+
'- Performance means nothing unless measured on unseen data\n'+
'- Accuracy is misleading whenever the outcome is rare\n'+
'- Models trained on past decisions reproduce past inequities\n\n'+
'@exercise Exercises\n'+
'Q: Distinguish supervised from unsupervised learning with a pharmacy example of each.\n'+
'Q: Explain overfitting and how a held-out test set detects it.\n'+
'Q: Why is 99% accuracy unimpressive for a condition affecting 1% of patients?\n'+
'Q: Define sensitivity and specificity and state what each ignores.\n'+
'Q: Explain how historical bias enters a model and one way to look for it.\n\n'+

'@chapter Prescription Analytics & Safety Monitoring\n\n'+
'@objectives\n'+
'- Analyse prescribing patterns for safety and quality\n'+
'- Detect outlier prescribing fairly\n'+
'- Build an indicator that changes behaviour\n'+
'- Avoid the harms of crude measurement\n\n'+
'@section Looking at prescribing as data\n\n'+
'Aggregate prescribing data reveals what individual review cannot: a rising trend, an unusual '+
'combination, one prescriber far from their peers. It also invites unfair conclusions.\n\n'+
'@caution\n'+
'A prescriber whose antibiotic rate is twice their peers\' may be careless — or may run the clinic '+
'that sees the sickest patients. Always adjust for case mix before drawing a conclusion about a person.\n\n'+
'@table Indicators worth monitoring\n'+
'Indicator | What it may reveal\n'+
'Broad-spectrum share of antibiotic prescribing | Stewardship pressure\n'+
'High-risk combinations dispensed | Interaction management gaps\n'+
'Repeat prescriptions without review | Drift in long-term care\n'+
'Dose outside the licensed range | Unintentional error or unrecorded rationale\n'+
'Potentially inappropriate prescribing in older adults | Deprescribing opportunity\n\n'+
'@diagram bar Peer median 100 > Prescriber A 118 > Prescriber B 164 > Prescriber C 92 | Indexed prescribing rate; investigate B, do not accuse\n\n'+
'@section Making an indicator that works\n\n'+
'A good indicator is specific, actionable, adjusted for case mix, and returned to the person who can '+
'change it. An indicator that reaches only management changes nothing at the point of prescribing.\n\n'+
'@note\n'+
'Any measure used as a target will be gamed. Expect it, and design so that gaming the measure and '+
'improving care are the same action.\n\n'+
'@activity Activity 3.1\n'+
'Design one prescribing indicator for your setting. State exactly what it counts, what it excludes, '+
'how it adjusts for case mix, and who receives it.\n\n'+
'@keyterms\n'+
'Case mix: the composition of a clinician\'s patients by complexity and condition.\n'+
'Outlier: a value far from the distribution of its peers.\n'+
'Indicator: a defined, repeatable measure of quality or safety.\n'+
'Deprescribing: the planned withdrawal of medicines no longer of benefit.\n\n'+
'@summary\n'+
'- Aggregate data reveals what case-by-case review cannot\n'+
'- Unadjusted comparison between prescribers is unfair and usually wrong\n'+
'- An indicator must reach the person who can act on it\n'+
'- Every target is gamed, so align gaming with good care\n\n'+
'@exercise Exercises\n'+
'Q: Give three prescribing indicators and what each may reveal.\n'+
'Q: Why must comparison between prescribers be adjusted for case mix?\n'+
'Q: What four properties make an indicator useful?\n'+
'Q: Explain the risk of turning an indicator into a target.\n'+
'Q: An outlier is identified. Describe the steps before any conclusion about the prescriber.\n\n'+

'@chapter Demand Forecasting & Inventory Analytics\n\n'+
'@objectives\n'+
'- Forecast demand using simple, defensible methods\n'+
'- Calculate reorder level and safety stock\n'+
'- Apply ABC and VED analysis\n'+
'- Balance stock-out risk against expiry waste\n\n'+
'@section Forecasting without pretending\n\n'+
'Simple methods — moving averages and seasonal adjustment — are usually adequate and always '+
'explainable. Complex models are hard to justify when the underlying demand is driven by a handful '+
'of prescribers changing their habits.\n\n'+
'@diagram flow Historical usage > Adjust for seasonality > Adjust for known changes > Forecast > Review against actual | Forecasting is a loop, not a calculation\n\n'+
'@section Reorder level and safety stock\n\n'+
'The **reorder level** is the stock at which you must order to avoid running out before delivery: '+
'average daily usage multiplied by lead time, plus safety stock. **Safety stock** covers variability '+
'in both demand and lead time.\n\n'+
'@note\n'+
'Safety stock is the price of uncertainty. Reduce the uncertainty — a more reliable supplier, a '+
'shorter lead time — and you can hold less stock for the same service level.\n\n'+
'@section Classifying what you hold\n\n'+
'@table Two complementary classifications\n'+
'Method | Classifies by | Purpose\n'+
'ABC | Annual value consumed | Focus control on the costly few\n'+
'VED | Criticality — vital, essential, desirable | Never stock out of the vital\n\n'+
'@caution\n'+
'A cheap item can be vital. ABC alone would leave it under-controlled — which is exactly why VED is '+
'used alongside it, not instead of it.\n\n'+
'@diagram compare Stock-out | Overstock ; Treatment delayed or missed | Capital tied up ; Emergency purchase at premium | Expiry and disposal ; Patient harm possible | Waste and audit findings\n\n'+
'@activity Activity 4.1\n'+
'Take twenty items from your formulary. Classify each by ABC and by VED, then identify any that are '+
'low-value but vital, and state how you would control them.\n\n'+
'@keyterms\n'+
'Reorder level: the stock level that triggers a replenishment order.\n'+
'Safety stock: buffer stock held against variability in demand and supply.\n'+
'Lead time: the interval between placing and receiving an order.\n'+
'ABC analysis: classification of items by annual consumption value.\n\n'+
'@summary\n'+
'- Simple, explainable forecasts usually beat complex ones in this setting\n'+
'- Reorder level = usage × lead time + safety stock\n'+
'- Safety stock is the price of uncertainty and falls as reliability rises\n'+
'- ABC and VED answer different questions and are used together\n\n'+
'@exercise Exercises\n'+
'Q: Calculate a reorder level for an item using 20 units a day with a 7-day lead time and 60 units of safety stock.\n'+
'Q: Explain why safety stock falls when supplier reliability improves.\n'+
'Q: Contrast ABC and VED analysis and explain why both are needed.\n'+
'Q: List two consequences each of stock-out and of overstock.\n'+
'Q: Why are simple forecasting methods often preferable in a pharmacy?\n'
};

/* ============================================================
   MODULE 7
   ============================================================ */;
})();
