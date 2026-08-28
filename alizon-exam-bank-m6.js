/* ALIZON AOS — Module 6 examination question bank
   Pharmacy Data Analytics & Predictive Modelling · 4 units × 25 MCQs        */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M6'] = window.ALIZON_EXAM_M6 = {
  module: 'Module 6 · Pharmacy Data Analytics & Predictive Modelling',
  code: 'ALZ-PH-M6',
  n: 6,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'Introduction to Pharmacy Data & Analytics', hrs:7.5, qs:[

  {q:'Descriptive analytics answers which question?',
   o:['What will happen next?','What should we do about it?','What has happened?','Why did it happen?'],c:2,
   e:'The four levels are <b>descriptive</b> (what happened), <b>diagnostic</b> (why), <b>predictive</b> (what will happen) and <b>prescriptive</b> (what to do). Most pharmacy reporting stops at descriptive.'},

  {q:'Prescriptive analytics differs from predictive analytics in that it:',
   o:['Uses more data','Recommends a course of action rather than only forecasting an outcome',
      'Is always more accurate','Requires no historical data'],c:1,
   e:'Prediction tells you a stock-out is likely; <b>prescription</b> tells you how much to order and when. The second requires the first plus a decision model.'},

  {q:'Structured data in a pharmacy context includes:',
   o:['A pharmacist’s free-text intervention note','Dispensed quantity, drug code and date fields in the dispensing system',
      'A scanned prescription image','A recorded telephone consultation'],c:1,
   e:'<b>Structured</b> data sits in defined fields and can be queried directly. Notes, images and recordings are unstructured and require processing before analysis.'},

  {q:'Which is a measure of central tendency that is resistant to extreme outliers?',
   o:['Median','Mean','Range','Standard deviation'],c:0,
   e:'The <b>median</b> is unaffected by extreme values. For skewed pharmacy data such as length of stay or cost per patient, the median describes the typical case far better than the mean.'},

  {q:'Pharmacy expenditure data are typically right-skewed. The most appropriate summary is therefore:',
   o:['The median with the interquartile range','The mean alone','The mode alone','The standard deviation alone'],c:0,
   e:'With <b>right skew</b>, a few very expensive patients drag the mean upwards. Median and IQR describe the distribution honestly.'},

  {q:'The standard deviation measures:',
   o:['The middle value of a dataset','The typical spread of values around the mean',
      'The largest value minus the smallest','The most frequent value'],c:1,
   e:'<b>Standard deviation</b> quantifies dispersion. Two datasets with the same mean can differ entirely in how variable and therefore how predictable they are.'},

  {q:'A data dictionary for a pharmacy dataset defines:',
   o:['The medicines stocked','The names of the analysts','The software licence terms','Each field’s meaning, permitted values, units and provenance'],c:3,
   e:'Without a <b>data dictionary</b>, the same field name means different things to different users and analysis silently diverges from reality.'},

  {q:'“Garbage in, garbage out” in pharmacy analytics means:',
   o:['Analysis cannot be more reliable than the quality of the underlying data','Old data should be deleted','Waste medicines must be recorded','Data must be compressed'],c:0,
   e:'Sophisticated methods cannot rescue poor data. <b>Data quality at source</b> determines the ceiling on the value of any analysis.'},

  {q:'Which dimension of data quality is compromised when a patient appears twice under slightly different names?',
   o:['Timeliness','Uniqueness','Accuracy of the medicine name','Data volume'],c:1,
   e:'Duplicate records breach <b>uniqueness</b> and corrupt every count, denominator and per-patient measure derived from the dataset.'},

  {q:'A key performance indicator should be:',
   o:['Specific, measurable, tied to a decision, and reported often enough to act on','Interesting to management','As complex as possible','Reported annually only'],c:0,
   e:'A KPI that no one can act on is a statistic, not an indicator. The test is whether a change in the number <b>triggers a decision</b>.'},

  {q:'Which is the most useful pharmacy KPI for medication safety?',
   o:['Total number of items dispensed','Number of staff employed','Rate of prescribing errors intercepted per thousand items verified','Total pharmacy expenditure'],c:2,
   e:'A <b>rate with a denominator</b> permits comparison over time and between sites. Raw counts rise and fall with activity and say nothing about performance.'},

  {q:'Benchmarking pharmacy performance against another hospital requires:',
   o:['Identical software','The same number of staff','Comparable case-mix and consistent definitions, otherwise differences reflect the population rather than performance','The same suppliers'],c:2,
   e:'Without <b>case-mix adjustment and definitional consistency</b>, benchmarking measures how different the hospitals are, not how well they perform.'},

  {q:'Real-world data differs from clinical trial data principally in that it:',
   o:['Is always more accurate','Contains fewer patients','Reflects routine practice in unselected populations, but was collected for care rather than research','Requires no ethical approval'],c:2,
   e:'Real-world data has <b>breadth and relevance but not research-grade rigour</b> — it is incomplete, inconsistently coded and subject to confounding by indication.'},

  {q:'Data visualisation of a time series is best done with:',
   o:['A line chart with time on the horizontal axis','A pie chart','A word cloud','A single summary figure'],c:0,
   e:'A <b>line chart</b> shows trend, seasonality and abrupt change. A pie chart cannot represent time at all.'},

  {q:'A pie chart is inappropriate when:',
   o:['There are two categories','The data are percentages','The data are recent','There are many categories or the values do not sum to a meaningful whole'],c:3,
   e:'Pie charts rely on angle comparison, which the eye judges poorly. With many slices, or with non-exhaustive categories, a <b>bar chart</b> is clearer and more honest.'},

  {q:'Starting the vertical axis of a bar chart at a value other than zero:',
   o:['Improves clarity always','Is required by convention','Has no effect on interpretation','Can exaggerate differences and mislead the reader'],c:3,
   e:'Bar length encodes value, so a <b>truncated axis</b> distorts the visual comparison. Line charts of a narrow range may legitimately truncate; bars generally should not.'},

  {q:'A statistical process control chart is used to distinguish:',
   o:['Common-cause variation inherent in the process from special-cause variation indicating a real change','Two different medicines','Costs from revenues','Inpatients from outpatients'],c:0,
   e:'<b>SPC</b> prevents the two classic errors: reacting to normal noise, and failing to notice a genuine shift. It is far more informative than comparing this month with last.'},

  {q:'Which pattern on a control chart indicates special-cause variation?',
   o:['Points fluctuating randomly within the limits','One point near the centre line','Alternating high and low points within limits','A run of eight consecutive points on one side of the centre line'],c:3,
   e:'A <b>long run on one side</b> is too improbable to be chance, and signals a real shift even when every point remains inside the control limits.'},

  {q:'Anonymisation of a pharmacy dataset for analysis requires more than removing names because:',
   o:['Names are not identifying','Names are stored separately anyway','Anonymisation is not required','Combinations of remaining fields such as age, postcode and rare diagnosis can re-identify individuals'],c:3,
   e:'<b>Quasi-identifiers</b> in combination are frequently uniquely identifying. Genuine anonymisation requires aggregation, suppression or other statistical disclosure control.'},

  {q:'A pharmacy analyst should ask “what decision will this analysis inform?” because:',
   o:['It shortens the analysis','Analysis that informs no decision consumes effort without improving care',
      'It is required by regulators','It reduces the data needed'],c:1,
   e:'Starting from the <b>decision</b> determines what to measure, at what granularity and how often. Starting from available data produces dashboards nobody uses.'},

  {q:'Which is a valid reason to aggregate patient-level data before sharing?',
   o:['It reduces file size','It improves accuracy','It reduces the risk of identifying individuals while preserving population-level insight','It removes the need for governance'],c:2,
   e:'<b>Aggregation</b> is a standard disclosure control. Small cell counts must still be suppressed, because a cell of one is as identifying as a name.'},

  {q:'The main risk of interpreting a correlation between two pharmacy metrics as causal is:',
   o:['Correlation is unreliable','A confounding factor may drive both, or the causal direction may be reversed',
      'Correlations cannot be calculated','Causation is never possible'],c:1,
   e:'Winter admissions and antibiotic use rise together, but neither causes the other — <b>seasonal illness drives both</b>. Design, not correlation strength, establishes causality.'},

  {q:'Simpson’s paradox describes a situation where:',
   o:['Two analysts disagree','The data are missing at random','A trend present in subgroups reverses when the groups are combined','The sample size is too small'],c:2,
   e:'<b>Simpson’s paradox</b> arises from confounding by group composition. It is a powerful argument for examining stratified as well as aggregate results.'},

  {q:'A dashboard reporting last month’s data on the fifteenth of the current month is limited by poor:',
   o:['Accuracy','Completeness','Uniqueness','Timeliness'],c:3,
   e:'<b>Timeliness</b> is a data quality dimension in its own right. Data arriving after the decision point cannot influence it, however accurate it is.'},

  {q:'The pharmacist’s distinctive contribution to a pharmacy analytics team is:',
   o:['Knowing what the data actually means clinically and whether a finding is plausible in practice','Programming ability','Managing the servers','Negotiating software licences'],c:0,
   e:'Domain knowledge is what separates a real finding from an artefact of coding. A pharmacist recognises when a “spike in insulin use” is really a <b>change in how the field is recorded</b>.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'Machine Learning in Pharmacy Practice', hrs:7.5, qs:[

  {q:'Supervised learning requires:',
   o:['Unlabelled data only','A dataset in which the correct output is known for each example',
      'No historical data','Real-time data only'],c:1,
   e:'<b>Supervised</b> learning maps inputs to known labels. The quality and correctness of those labels sets the ceiling on what the model can learn.'},

  {q:'Predicting whether a patient will be readmitted within 30 days is:',
   o:['A binary classification problem','A regression problem','A clustering problem','A dimensionality reduction problem'],c:0,
   e:'The outcome is a <b>yes/no category</b>, making it binary classification. Predicting the number of days to readmission would be regression.'},

  {q:'Predicting next month’s demand for a medicine in units is:',
   o:['Regression','Classification','Clustering','Association rule mining'],c:0,
   e:'<b>Regression</b> predicts a continuous numeric value. Classification predicts membership of a category.'},

  {q:'K-means is an example of:',
   o:['Supervised classification','Reinforcement learning','Unsupervised clustering','A statistical significance test'],c:2,
   e:'<b>K-means</b> groups similar records without labels. In pharmacy it can segment patients by prescribing pattern or adherence behaviour.'},

  {q:'Cross-validation is used to:',
   o:['Increase the size of the dataset','Estimate model performance more reliably by repeatedly training and testing on different partitions',
      'Clean the data','Choose the programming language'],c:1,
   e:'<b>K-fold cross-validation</b> reduces the chance that a favourable result reflects one lucky split, and uses the available data efficiently.'},

  {q:'A model with 99% accuracy predicting an outcome occurring in 1% of patients:',
   o:['Is excellent','May be worthless, since predicting “no” for everyone would also achieve about 99%',
      'Must be overfitted','Has high sensitivity'],c:1,
   e:'This is the <b>class imbalance</b> trap. Accuracy is dominated by the majority class; sensitivity, specificity and predictive values are the informative measures.'},

  {q:'Sensitivity is defined as:',
   o:['True negatives divided by all actual negatives','True positives divided by all predicted positives','Correct predictions divided by all predictions','True positives divided by all actual positives'],c:3,
   e:'<b>Sensitivity</b> (recall) is the ability to detect the condition when present. Specificity is its mirror; positive predictive value uses predicted positives as the denominator.'},

  {q:'Positive predictive value depends on prevalence because:',
   o:['When the outcome is rare, even a specific test produces mostly false positives among those flagged','It is calculated differently in each hospital','Prevalence affects sensitivity','It is a measure of cost'],c:0,
   e:'<b>PPV</b> answers the clinically relevant question: given a positive flag, how likely is it real? At low prevalence the answer can be disappointing despite excellent sensitivity and specificity.'},

  {q:'The area under the ROC curve (AUC) measures:',
   o:['The proportion of correct predictions at one threshold','The model’s ability to discriminate between classes across all thresholds',
      'The calibration of predicted probabilities','The training time'],c:1,
   e:'<b>AUC</b> summarises discrimination. It says nothing about <b>calibration</b> — whether a predicted 20% risk actually occurs 20% of the time — which matters just as much clinically.'},

  {q:'Model calibration refers to:',
   o:['Agreement between predicted probabilities and observed event rates','Adjusting the hardware','Ranking patients correctly','The speed of prediction'],c:0,
   e:'A model can rank patients perfectly yet be badly <b>calibrated</b>. If a decision threshold is applied to the predicted probability, calibration must be checked.'},

  {q:'Overfitting is best detected by:',
   o:['High accuracy on the training set','A long training time','A large gap between performance on training data and on held-out test data','A small number of features'],c:2,
   e:'The signature of overfitting is <b>excellent training performance with poor test performance</b> — the model memorised noise rather than learning the pattern.'},

  {q:'Regularisation techniques are used to:',
   o:['Increase model complexity','Speed up data loading','Penalise complexity and so reduce overfitting','Clean missing values'],c:2,
   e:'<b>Regularisation</b> constrains coefficient magnitude, favouring simpler models that generalise better — a direct implementation of parsimony.'},

  {q:'Feature engineering means:',
   o:['Creating informative input variables from raw data, such as deriving adherence from refill dates','Buying better hardware','Selecting the algorithm','Writing the final report'],c:0,
   e:'<b>Feature engineering</b> often contributes more to performance than the choice of algorithm, and it is where clinical domain knowledge is most valuable.'},

  {q:'Data leakage in model development occurs when:',
   o:['Data is stolen','The dataset is too small','Records are duplicated','Information unavailable at prediction time is included in the features, inflating apparent performance'],c:3,
   e:'<b>Leakage</b> — including a discharge code when predicting admission outcome, for example — produces spectacular internal results and complete failure in deployment.'},

  {q:'Class imbalance in a rare-outcome dataset can be addressed by:',
   o:['Ignoring the minority class','Removing all negative cases','Resampling, class weighting, and evaluating with metrics appropriate to imbalance','Increasing the number of features'],c:2,
   e:'The methods address the training process; equally important is <b>choosing the right metric</b>, since accuracy is meaningless under imbalance.'},

  {q:'A random forest is:',
   o:['A single decision tree','An ensemble of decision trees whose predictions are combined, reducing variance',
      'A clustering method','A visualisation technique'],c:1,
   e:'<b>Ensembles</b> average away the instability of individual trees, usually improving accuracy at the cost of some interpretability.'},

  {q:'Compared with a deep neural network, logistic regression in clinical prediction offers:',
   o:['Always higher accuracy','Faster data collection','Greater interpretability and easier validation, often with comparable performance on tabular clinical data','No need for validation'],c:2,
   e:'On modest tabular clinical datasets, regression frequently matches complex models while remaining <b>inspectable and defensible</b> — a decisive advantage in regulated practice.'},

  {q:'SHAP values are used to:',
   o:['Speed up training','Clean the dataset','Select the sample size','Explain the contribution of each feature to an individual prediction'],c:3,
   e:'<b>SHAP</b> provides per-prediction attribution, allowing a clinician to see why this patient was flagged rather than only that they were.'},

  {q:'External validation of a clinical prediction model means testing it on:',
   o:['A different subset of the same dataset','Simulated data','The training data again','Data from a different population, institution or time period'],c:3,
   e:'Internal validation controls optimism; <b>external validation</b> tests transportability. Performance almost always degrades, and by how much determines usability.'},

  {q:'Model drift means that:',
   o:['Performance degrades over time as the underlying population, practice or data capture changes','The software becomes corrupted','The model runs more slowly','Predictions become random'],c:0,
   e:'<b>Drift</b> is inevitable in healthcare, where formularies, guidelines and coding practices change. Continuous monitoring and periodic retraining are mandatory.'},

  {q:'Algorithmic bias in a pharmacy prediction model is most likely to arise from:',
   o:['A slow processor','Using open-source software','Too many features','Training data that under-represents or systematically mis-measures certain patient groups'],c:3,
   e:'A model reproduces the <b>inequities in its training data</b>. Subgroup performance must be reported separately, not just overall accuracy.'},

  {q:'Before a machine learning model is used clinically, it should be:',
   o:['Published in a journal','Approved by the vendor','Trained on the largest possible dataset','Externally validated, prospectively evaluated, governed and monitored, with a clear action attached to its output'],c:3,
   e:'A model that produces a number nobody acts on changes nothing; a model acted on without validation can cause harm. <b>Both</b> the evidence and the pathway are required.'},

  {q:'The most important question a pharmacist should ask about a vendor’s AI claim is:',
   o:['How fast does it run?','On what population was it validated, and how does that compare with our patients?',
      'How much does it cost?','What programming language was used?'],c:1,
   e:'<b>Validation population and applicability</b> determine whether headline performance will transfer. Everything else is secondary.'},

  {q:'Human-in-the-loop deployment of a clinical model means:',
   o:['The model informs a decision that a qualified professional makes and remains accountable for','A human writes the code','Humans label all the data','The model runs only when requested'],c:0,
   e:'This is the appropriate model for clinical AI: the system <b>surfaces and prioritises</b>, the professional decides and carries the accountability.'},

  {q:'An adherence prediction model flags a patient as high risk. The most useful next step is:',
   o:['Record the score in the notes','Repeat the prediction weekly','Deliver the intervention the model was designed to target, such as counselling or a simplified regimen','Inform the patient of their score'],c:2,
   e:'Prediction only creates value when <b>coupled to an intervention</b>. A risk score with no attached action is an observation, not a service.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Prescription Analytics & Safety Monitoring', hrs:7.5, qs:[

  {q:'The Defined Daily Dose (DDD) is:',
   o:['The dose prescribed for an individual patient','The assumed average maintenance dose per day for a drug used for its main indication in adults',
      'The maximum safe daily dose','The dose dispensed per prescription'],c:1,
   e:'The <b>DDD</b> is a technical unit of measurement for comparing consumption between populations. It is deliberately not a recommended dose.'},

  {q:'DDDs per 1000 inhabitants per day is used to:',
   o:['Compare drug utilisation between populations or over time, independent of pack size and strength','Set the price of medicines','Calculate an individual dose','Measure adherence'],c:0,
   e:'Standardising to a <b>population denominator</b> allows meaningful comparison. Raw expenditure or pack counts confound strength, price and pack size.'},

  {q:'The Medication Possession Ratio measures:',
   o:['The proportion of a period for which a patient had medication supplied, as a proxy for adherence','How many medicines a patient takes','The number of pharmacies used','The cost per patient'],c:0,
   e:'<b>MPR</b> and the related Proportion of Days Covered are refill-based proxies. They show medicine was <b>obtained</b>, which is not proof it was taken.'},

  {q:'A key limitation of refill-based adherence measures is that they:',
   o:['Require patient interviews','Cannot be calculated electronically','Only work for injections','Show that medicine was collected but not that it was actually taken'],c:3,
   e:'Collection is a <b>necessary but not sufficient</b> condition for adherence. Refill data cannot detect a patient who collects faithfully and takes nothing.'},

  {q:'Polypharmacy is generally defined as:',
   o:['The concurrent use of multiple medicines, commonly five or more','Any patient taking more than one medicine','Taking medicines from two pharmacies','Prescribing by more than one doctor'],c:0,
   e:'The common threshold is <b>five or more</b>, though the clinically important distinction is between appropriate polypharmacy and problematic polypharmacy.'},

  {q:'A prescribing cascade is identified in prescription data when:',
   o:['Two medicines are dispensed together','A prescription is repeated','The dose is increased','A new medicine is consistently started shortly after another, suggesting treatment of its adverse effect'],c:3,
   e:'Prescription sequence symmetry analysis detects <b>asymmetric ordering</b> — drug B started after drug A far more often than the reverse — which flags a possible cascade.'},

  {q:'Beers Criteria and STOPP/START are tools for:',
   o:['Calculating renal doses','Assessing adherence','Identifying potentially inappropriate prescribing in older adults','Ranking antibiotic resistance'],c:2,
   e:'<b>Beers</b> and <b>STOPP/START</b> can be applied computationally across a whole population, turning a manual review tool into a screening programme.'},

  {q:'An anticholinergic burden score is used to:',
   o:['Measure the cost of medicines','Quantify cumulative anticholinergic exposure, which is associated with confusion, falls and cognitive decline',
      'Assess renal function','Predict antibiotic resistance'],c:1,
   e:'The harm is <b>cumulative across multiple medicines</b>, each individually modest. Scoring makes a burden visible that reviewing drugs one at a time misses.'},

  {q:'A trigger tool for detecting adverse drug events works by:',
   o:['Asking patients directly','Counting all prescriptions','Reviewing every record manually','Searching records for markers such as antidote administration or abnormal results that suggest possible harm'],c:3,
   e:'<b>Triggers</b> such as naloxone, vitamin K or a very high INR are efficient markers. They focus scarce review time on records likely to contain an event.'},

  {q:'Which is the strongest indicator of a systemic prescribing problem rather than an isolated error?',
   o:['A single wrong dose','The same error type recurring across different prescribers and wards',
      'One patient complaint','A near miss reported once'],c:1,
   e:'<b>Recurrence across people and places</b> indicates the system, not the individual, is producing the error — and the fix must therefore be systemic.'},

  {q:'Antimicrobial consumption is best monitored using:',
   o:['DDDs or days of therapy per 1000 patient-days','Total expenditure','Number of prescriptions only','Number of suppliers'],c:0,
   e:'<b>Days of therapy per 1000 patient-days</b> is preferred in hospitals because it is not distorted by dose adjustments in renal impairment, unlike DDD.'},

  {q:'A sudden fall in reported medication errors most likely indicates:',
   o:['A genuine improvement in safety','A change in reporting behaviour, which must be excluded before claiming improvement',
      'Better prescribing software','Fewer patients'],c:1,
   e:'Reported errors measure <b>reporting</b> as much as safety. A fall should prompt investigation of reporting culture before it is celebrated.'},

  {q:'Interrupted time series analysis is used to:',
   o:['Compare two hospitals','Measure patient satisfaction','Rank prescribers','Assess whether an intervention changed the level or slope of an outcome, accounting for the pre-existing trend'],c:3,
   e:'Comparing simple before-and-after averages attributes a pre-existing trend to the intervention. <b>ITS</b> separates the two and is the standard quasi-experimental design.'},

  {q:'Prescriber-level feedback is most effective at changing behaviour when it is:',
   o:['Individual, benchmarked against peers, specific and delivered with a clear recommended action','Anonymous and annual','Delivered only to senior staff','Purely numerical with no interpretation'],c:0,
   e:'<b>Audit and feedback</b> works best when personalised, peer-benchmarked, repeated and accompanied by a concrete action — not merely a report card.'},

  {q:'Identifying a duplicate therapy signal across primary and secondary care requires:',
   o:['Separate systems for each setting','Patient self-report only','A linked or shared medication record across settings','Manual review of paper records'],c:2,
   e:'Duplication typically arises <b>between</b> settings — the same drug by brand in one and by generic name in another. Only a linked record makes it visible.'},

  {q:'A high-alert medication dashboard should prioritise:',
   o:['All medicines equally','The most expensive medicines','Anticoagulants, insulins, opioids and concentrated electrolytes, where error consequences are most severe','The most frequently dispensed medicines'],c:2,
   e:'<b>High-alert medicines</b> are not necessarily more error-prone, but the consequence of error is disproportionate, so monitoring effort is concentrated there.'},

  {q:'Natural language processing applied to pharmacist intervention notes can:',
   o:['Replace the pharmacist','Quantify intervention types and outcomes at scale from text that would otherwise never be analysed',
      'Write the interventions automatically','Eliminate the need to document'],c:1,
   e:'Intervention notes are usually <b>free text and therefore invisible to analysis</b>. NLP converts them into countable categories, which is how pharmacy demonstrates its value.'},

  {q:'A model predicting which prescriptions need pharmacist review is most useful when it:',
   o:['Flags every prescription','Replaces pharmacist verification','Prioritises the queue so limited pharmacist time reaches the highest-risk orders first','Flags only the cheapest medicines'],c:2,
   e:'The realistic gain is <b>triage</b>, not replacement. Ensuring the riskiest orders are seen first is achievable and clinically valuable.'},

  {q:'Which finding in prescription analytics warrants immediate investigation rather than routine review?',
   o:['A gradual rise in generic prescribing','Seasonal variation in antibiotic use','A slow decline in a drug’s use','A cluster of tenfold dosing errors involving the same medicine and system screen'],c:3,
   e:'A cluster of the same <b>high-severity error</b> with a common feature suggests an active system hazard, such as a confusing default or picking list, and needs immediate action.'},

  {q:'Risk stratification of patients for pharmacist medication review should prioritise:',
   o:['Patients with the longest medication lists only','Patients combining polypharmacy, high-risk medicines, renal impairment and recent transitions of care',
      'Patients who ask for a review','Patients with the highest medicine costs'],c:1,
   e:'These factors <b>compound</b>. Count alone is a weak criterion; the combination of risk factors identifies where review most changes outcomes.'},

  {q:'An adherence dashboard showing a patient consistently collecting late is best used to:',
   o:['Prompt a conversation to identify the cause — cost, side effects, complexity or belief — and address it','Record non-compliance in the notes','Discharge the patient from the service','Reduce the quantity supplied'],c:0,
   e:'Non-adherence is a <b>symptom</b>. Labelling it changes nothing; identifying and addressing the underlying reason is the intervention.'},

  {q:'When presenting prescribing data to clinicians, the most important principle is:',
   o:['Present it fairly with appropriate case-mix context, so it is credible and prompts discussion rather than defensiveness','Show as much data as possible','Rank individuals publicly','Use only national comparisons'],c:0,
   e:'Data perceived as unfair is <b>rejected rather than acted on</b>. Credibility, achieved through case-mix context and transparent definitions, determines whether feedback changes practice.'},

  {q:'A near-miss reporting analysis is valuable primarily because it:',
   o:['Identifies staff for retraining','Reduces the number of reports','Satisfies regulators','Reveals system weaknesses at no cost to a patient'],c:3,
   e:'Near misses are <b>free lessons</b>. A system that reports them well learns without harming anyone; one that does not learns only from injury.'},

  {q:'Which measure best captures the clinical impact of a pharmacy intervention service?',
   o:['Number of interventions made','Time spent per intervention','Proportion accepted by prescribers and the severity of harm avoided','Number of pharmacists employed'],c:2,
   e:'An intervention that is not accepted changes nothing. <b>Acceptance rate weighted by potential severity</b> is the meaningful outcome measure.'},

  {q:'The main governance requirement before acting on prescription analytics at individual patient level is:',
   o:['Publication of the method','Approval from the software vendor','A lawful basis and appropriate governance for using identifiable data for direct care or improvement, with access controlled and audited','Consent from every prescriber'],c:2,
   e:'Moving from aggregate to <b>identifiable individual</b> analysis crosses a governance boundary. The purpose, lawful basis and access controls must be established first.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Demand Forecasting & Inventory Analytics', hrs:7.5, qs:[

  {q:'Demand forecasting in pharmacy aims to:',
   o:['Predict future consumption so stock levels avoid both stock-outs and expiry wastage','Increase total purchasing','Reduce the number of suppliers','Set the retail price'],c:0,
   e:'Forecasting balances <b>two opposing costs</b>: the clinical cost of a stock-out and the financial cost of expired stock.'},

  {q:'A moving average forecast is best suited to demand that is:',
   o:['Strongly seasonal','Rapidly trending upward','Highly erratic','Relatively stable with random fluctuation around a constant level'],c:3,
   e:'A <b>moving average</b> smooths noise but lags trend and cannot represent seasonality. Trending or seasonal series need methods that model those components.'},

  {q:'Exponential smoothing differs from a simple moving average in that it:',
   o:['Uses fewer data points','Requires no historical data','Weights recent observations more heavily than older ones','Only works for annual data'],c:2,
   e:'<b>Exponential smoothing</b> responds faster to genuine change because recency is weighted, with the smoothing constant controlling responsiveness against stability.'},

  {q:'Seasonality in pharmacy demand is illustrated by:',
   o:['A steady rise in statin use over five years','A one-off spike after a media report','Increased antihistamine demand during pollen season each year','A gradual fall following a price change'],c:2,
   e:'<b>Seasonality</b> is a repeating within-year pattern. A steady rise is trend, and a one-off spike is an irregular event.'},

  {q:'Safety stock exists to protect against:',
   o:['Price increases','Variability in demand and in supplier lead time',
      'Expiry of stock','Theft only'],c:1,
   e:'<b>Safety stock</b> buffers uncertainty on both sides. Its size should reflect measured variability and the clinical consequence of a stock-out, not a fixed rule of thumb.'},

  {q:'The reorder point is calculated as:',
   o:['Average demand during lead time plus safety stock','Maximum stock minus minimum stock','Annual demand divided by twelve','Supplier minimum order quantity'],c:0,
   e:'The reorder point must cover <b>demand during replenishment</b> plus a buffer. Setting it from shelf space or supplier minimums causes both stock-outs and overstocking.'},

  {q:'Economic Order Quantity balances:',
   o:['Purchase price against selling price','Demand against supply','Expiry against wastage','Ordering costs against holding costs, to minimise total inventory cost'],c:3,
   e:'<b>EOQ</b> optimises order size. For medicines it must be constrained by shelf-life, since the mathematically optimal quantity may expire before use.'},

  {q:'Inventory turnover ratio measures:',
   o:['The number of suppliers used','The value of expired stock','How many times stock is sold and replaced over a period','The number of orders placed'],c:2,
   e:'Higher <b>turnover</b> generally means less capital tied up and less expiry risk, but pushed too far it increases stock-out risk.'},

  {q:'A very high inventory turnover ratio may indicate:',
   o:['Excellent management in all cases','Stock levels so lean that stock-outs are frequent',
      'Excessive holding of stock','Poor supplier relationships only'],c:1,
   e:'Turnover must be read alongside <b>stock-out and emergency order rates</b>. Efficiency achieved by running out is not efficiency.'},

  {q:'Combining ABC and VED analysis is useful because it:',
   o:['Simplifies the stock list','Reduces the number of items stocked','Identifies items that are both high value and clinically vital, which need the tightest control','Eliminates the need for forecasting'],c:2,
   e:'The <b>AV category</b> — high expenditure and clinically vital — justifies the closest monitoring. A cheap vital item still must never stock out, but needs less financial scrutiny.'},

  {q:'Lead time variability affects inventory policy because:',
   o:['It changes the purchase price','It affects only expiry','Greater variability requires more safety stock to maintain the same service level','It has no effect if average lead time is known'],c:2,
   e:'Safety stock protects against <b>uncertainty, not the average</b>. An unreliable supplier requires more buffer than a slow but predictable one.'},

  {q:'A stock-out of a vital medicine should be recorded and analysed because:',
   o:['It affects the monthly accounts','It is a patient safety event that reveals a forecasting, ordering or supply failure',
      'Suppliers require notification','It reduces turnover'],c:1,
   e:'Treating stock-outs as <b>safety incidents</b> rather than purchasing inconveniences is what drives the root-cause analysis that prevents recurrence.'},

  {q:'Expiry wastage analysis is most actionable when it identifies:',
   o:['The total value wasted','The number of items discarded','The staff member who ordered them','Which specific items expire repeatedly and why — over-ordering, short-dated deliveries or falling demand'],c:3,
   e:'A total figure prompts concern but no action. <b>Item-level causes</b> point to a specific fix: order quantity, supplier dating or a discontinued protocol.'},

  {q:'Consignment stock arrangements benefit a pharmacy by:',
   o:['Reducing the purchase price','Removing the need for stock records','Guaranteeing supply','Deferring payment and expiry risk until the item is actually used'],c:3,
   e:'<b>Consignment</b> shifts holding and expiry risk to the supplier. It suits expensive, slow-moving but clinically necessary items.'},

  {q:'Just-in-time inventory in a hospital pharmacy is risky because:',
   o:['It increases holding costs','It requires more storage space','It increases expiry wastage','Supply chain disruption or a demand surge can cause immediate stock-out of critical medicines'],c:3,
   e:'JIT optimises for cost under <b>stable conditions</b>. Healthcare demand is not stable, and the consequence of failure is clinical rather than financial.'},

  {q:'A machine learning demand forecast may outperform traditional methods when:',
   o:['Demand is influenced by many interacting factors such as seasonality, epidemics, admissions and protocol changes','Data are scarce','Demand is perfectly constant','Only one year of data exists'],c:0,
   e:'ML earns its complexity where <b>multiple interacting drivers</b> exist. For simple stable demand, exponential smoothing performs comparably and is far easier to maintain.'},

  {q:'A forecasting model that performed well last year now systematically under-predicts. The most likely explanation is:',
   o:['A real change in demand drivers — a new protocol, a new service or a population shift','The software is corrupted','The data are encrypted','The model needs a faster computer'],c:0,
   e:'Systematic bias in one direction signals <b>a structural change the model has not learned</b>. Investigate the cause before simply retraining.'},

  {q:'Forecast accuracy is commonly measured using:',
   o:['The number of orders placed','Mean absolute percentage error between forecast and actual demand',
      'Total expenditure','Inventory turnover'],c:1,
   e:'<b>MAPE</b> expresses error relative to demand size, allowing comparison across items — though it behaves poorly for very low-volume items.'},

  {q:'Pandemic or outbreak demand surges are difficult to forecast because:',
   o:['Data are always missing','They are step changes with no historical precedent in the series, so models trained on normal demand fail',
      'Medicines change during outbreaks','Suppliers stop responding'],c:1,
   e:'Models extrapolate the past. A genuine <b>step change</b> requires scenario planning, buffer policy and human judgement rather than statistical extrapolation.'},

  {q:'A pharmacy inventory dashboard should surface:',
   o:['Every item’s current balance','Only annual expenditure','Exceptions — items below reorder level, short-dated stock, and unusual consumption patterns','Only the most expensive items'],c:2,
   e:'An <b>exception-based</b> dashboard directs attention. A complete stock list is a report to be consulted, not a management tool.'},

  {q:'Integrating inventory data with clinical activity data allows a pharmacy to:',
   o:['Reduce the number of medicines stocked','Forecast demand from planned activity such as surgical schedules and admission patterns',
      'Avoid stocktaking','Set retail prices'],c:1,
   e:'<b>Activity-driven forecasting</b> is far more responsive than extrapolating past consumption, because it anticipates demand before it appears in usage data.'},

  {q:'Vendor-managed inventory involves:',
   o:['The supplier monitoring stock levels and replenishing according to an agreed policy','The pharmacy managing the supplier’s stock','Removing all stock records','Buying only in bulk'],c:0,
   e:'<b>VMI</b> can reduce administrative effort and stock-outs, but the pharmacy retains accountability for availability and must monitor supplier performance.'},

  {q:'The service level in inventory management expresses:',
   o:['The probability of meeting demand from stock without a stock-out','Staff satisfaction','Delivery speed','Supplier quality'],c:0,
   e:'Higher <b>service levels</b> require disproportionately more safety stock. Vital medicines justify a high target; desirable items do not.'},

  {q:'Which item warrants the highest service level target?',
   o:['A vital emergency medicine with no therapeutic alternative','A vitamin supplement','The most expensive item','The most frequently used item'],c:0,
   e:'The target should follow the <b>consequence of a stock-out</b>. Cost and volume determine how the stock is managed, not how essential availability is.'},

  {q:'The pharmacist’s judgement remains essential in automated inventory systems because:',
   o:['Computers cannot calculate','Automation is unreliable','Suppliers require human contact','Clinical context — a new protocol, an outbreak, a discontinued line — is known to the pharmacist before it appears in the data'],c:3,
   e:'Algorithms are <b>backward-looking</b>. The pharmacist supplies the forward-looking clinical intelligence that has not yet reached the consumption history.'}
  ]}

  ]
};
