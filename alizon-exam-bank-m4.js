/* ALIZON AOS — Module 4 examination question bank
   AI in Drug Development, Vaccines & Injectables · 4 units × 25 MCQs         */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M4'] = window.ALIZON_EXAM_M4 = {
  module: 'Module 4 · AI in Drug Development, Vaccines & Injectables',
  code: 'ALZ-PH-M4',
  n: 4,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'AI in Drug Discovery & Molecular Targeting', hrs:7.5, qs:[

  {q:'“Target identification” in drug discovery means:',
   o:['Choosing which patients to recruit','Selecting the tablet strength','Establishing which biological molecule, when modulated, is likely to alter the course of the disease','Identifying the target market'],c:2,
   e:'A <b>target</b> is the biological molecule — usually a protein — whose modulation is expected to produce clinical benefit. Poor target selection is the leading cause of late-stage attrition.'},

  {q:'Target validation is the process of:',
   o:['Confirming the tablet dissolves correctly','Generating evidence that modulating the target actually alters the disease process',
      'Checking the patent is valid','Verifying the supplier'],c:1,
   e:'<b>Validation</b> asks whether the target is causally involved, using genetic evidence, knockout models and human data. Without it, a beautifully optimised molecule can hit a target that does not matter.'},

  {q:'Virtual high-throughput screening uses computational models to:',
   o:['Physically test compounds in the laboratory faster','Rank very large compound libraries by predicted binding, so only the most promising are tested experimentally',
      'Manufacture compounds automatically','Recruit trial participants'],c:1,
   e:'Virtual screening <b>triages</b> libraries far larger than any laboratory could test, converting an intractable search into a manageable shortlist for confirmation.'},

  {q:'Molecular docking predicts:',
   o:['The preferred orientation and binding affinity of a small molecule within a target’s binding site','The price of a compound','The shelf-life of a tablet','The rate of tablet disintegration'],c:0,
   e:'<b>Docking</b> estimates pose and affinity from the three-dimensional structures involved. It is fast and approximate, so hits require experimental confirmation.'},

  {q:'AlphaFold’s significance for drug discovery lies in its ability to:',
   o:['Predict protein three-dimensional structure from amino acid sequence, making structure-based design possible for targets without an experimental structure','Synthesise new compounds automatically','Run clinical trials','Predict market demand'],c:0,
   e:'Structure-based design previously required a crystal structure. Accurate <b>predicted structures</b> extend the approach to targets that had resisted experimental structure determination.'},

  {q:'De novo drug design using generative AI means:',
   o:['Screening compounds that already exist','Generating entirely novel molecular structures predicted to have the desired properties',
      'Copying a competitor’s molecule','Reformulating an existing tablet'],c:1,
   e:'<b>Generative</b> models propose molecules that have never been made, optimised in silico for potency, selectivity and drug-likeness — though synthesisability remains a real constraint.'},

  {q:'A QSAR model correlates:',
   o:['Manufacturing cost with batch size','Patient age with response','Storage temperature with stability','Molecular structural descriptors with measured biological activity'],c:3,
   e:'<b>QSAR</b> models let the activity of untested compounds be predicted from structure alone, which is what makes rapid computational optimisation possible.'},

  {q:'Lipinski’s Rule of Five is used to assess:',
   o:['The likelihood that a compound will be orally bioavailable','The number of clinical trial phases','The number of manufacturing steps','The number of patents required'],c:0,
   e:'The rule uses molecular weight, lipophilicity and hydrogen bond donors and acceptors as a rough filter for <b>oral bioavailability</b>. It is a guide, not a law — many successful drugs break it.'},

  {q:'ADMET prediction models are most valuable because they:',
   o:['Replace all animal and human studies','Identify likely failures on pharmacokinetic or toxicity grounds early, before large sums are committed',
      'Guarantee the compound will be approved','Determine the retail price'],c:1,
   e:'Late attrition is ruinously expensive. Predicting <b>ADMET</b> liabilities early allows candidates to be dropped or redesigned cheaply, though experimental confirmation is still required.'},

  {q:'Drug repurposing supported by AI involves:',
   o:['Identifying new therapeutic indications for medicines already approved for another use','Changing the packaging of an existing product','Recycling expired stock','Selling a medicine in a new country'],c:0,
   e:'<b>Repurposing</b> is attractive because safety and pharmacokinetics are already characterised, which can shorten development dramatically. AI helps by mining literature, omics and clinical data for unexpected links.'},

  {q:'A “lead compound” is:',
   o:['The first compound synthesised in a project','The cheapest compound available','A compound with confirmed activity against the target that serves as the starting point for optimisation','The compound with the highest molecular weight'],c:2,
   e:'A <b>lead</b> has demonstrated activity and acceptable initial properties. Lead optimisation then improves potency, selectivity and ADMET characteristics in iterative cycles.'},

  {q:'“Hit to lead” optimisation aims primarily to:',
   o:['Reduce the manufacturing cost','Increase the molecular weight','Improve potency, selectivity and drug-like properties while retaining target activity','Simplify the packaging'],c:2,
   e:'The transition from hit to lead is about <b>improving the whole property profile</b>, not potency alone. A very potent molecule with poor absorption or high toxicity is not a viable lead.'},

  {q:'The principal limitation of AI predictions in early drug discovery is that:',
   o:['They are too slow','They cannot handle small molecules','Models are only as reliable as their training data, and chemical space far exceeds what has been experimentally measured','They require no computing power'],c:2,
   e:'Prediction into <b>sparsely sampled regions</b> of chemical space is unreliable. This is why computational hits are always confirmed experimentally before commitment.'},

  {q:'Structure-based drug design requires knowledge of:',
   o:['The three-dimensional structure of the target binding site','The patient’s genome','The manufacturing plant layout','The competitor’s pricing'],c:0,
   e:'<b>Structure-based</b> design works from the shape and chemistry of the binding site. Where no structure is available, ligand-based approaches such as QSAR are used instead.'},

  {q:'Molecular dynamics simulation adds to static docking by:',
   o:['Making the calculation faster','Removing the need for a structure','Predicting the retail price','Modelling how the protein and ligand move over time, capturing flexibility that a static pose cannot show'],c:3,
   e:'Proteins are not rigid. <b>Molecular dynamics</b> reveals conformational changes, transient pockets and binding stability that a single static docking pose misses.'},

  {q:'In pharmaceutical AI, “explainability” of a discovery model matters because:',
   o:['Regulators require the source code','It makes the model faster','It reduces licensing costs','Chemists need to understand which structural features drive the prediction in order to act on it in design'],c:3,
   e:'A prediction with no rationale gives a medicinal chemist nothing to work with. <b>Interpretable structure–activity relationships</b> are what guide the next round of synthesis.'},

  {q:'Which is the correct order of the drug development pipeline?',
   o:['Target identification → hit discovery → lead optimisation → preclinical → clinical trials','Clinical trials → target identification → lead optimisation → preclinical','Preclinical → target identification → clinical trials → hit discovery','Lead optimisation → target identification → preclinical → clinical trials'],c:0,
   e:'Discovery proceeds from <b>biology to molecule to animal to human</b>. Each stage is a filter, and the cost of failure rises steeply at every step.'},

  {q:'AI-assisted patient stratification in trial design aims to:',
   o:['Reduce the number of investigators','Shorten the consent form','Lower the price of the medicine','Identify the subgroup most likely to benefit, increasing the chance of detecting a true effect'],c:3,
   e:'Enriching a trial with <b>likely responders</b> increases statistical power for a given sample size, though it narrows the population to which the result applies.'},

  {q:'The primary regulatory concern about AI-designed molecules is:',
   o:['They are automatically unsafe','They cannot be patented','They must be tested only in silico','They must meet exactly the same standards of evidence for quality, safety and efficacy as any other candidate'],c:3,
   e:'Regulators are <b>method-neutral</b>. How a molecule was discovered does not change the evidence required to license it.'},

  {q:'“Chemical space” refers to:',
   o:['The physical storage area for compounds','The set of all possible molecules, which is vastly larger than the number ever synthesised',
      'A laboratory clean room','The space inside a reaction vessel'],c:1,
   e:'Estimates of drug-like <b>chemical space</b> run to 10^60 molecules. Navigating it intelligently, rather than exhaustively, is precisely the problem AI addresses.'},

  {q:'Target selectivity is important because a compound acting on unintended targets may:',
   o:['Be more effective','Be cheaper to make','Cause off-target adverse effects and toxicity','Have a longer shelf-life'],c:2,
   e:'<b>Off-target activity</b> is a major source of toxicity. Selectivity profiling against related proteins is a standard part of lead optimisation.'},

  {q:'Which data type is most directly useful for AI-driven target identification?',
   o:['Pharmacy sales figures','Genomic, transcriptomic and proteomic data linked to disease phenotype',
      'Packaging specifications','Advertising response rates'],c:1,
   e:'Target identification is a <b>biology</b> problem. Multi-omic data linked to phenotype is what allows a causal molecular driver to be distinguished from a bystander.'},

  {q:'A major reason drug candidates fail in Phase II is:',
   o:['Manufacturing problems','Excessive patient recruitment','Lack of efficacy, frequently because the target was not properly validated in humans','Packaging failures'],c:2,
   e:'Phase II is where <b>efficacy</b> is first properly tested in patients. Failure here usually reflects a biological hypothesis that did not hold in humans.'},

  {q:'Federated learning is attractive for pharmaceutical AI because it:',
   o:['Requires less computing power','Removes the need for validation','Produces smaller models','Allows models to be trained across organisations without the underlying proprietary or patient data leaving each site'],c:3,
   e:'<b>Federated learning</b> shares model updates rather than raw data, addressing both commercial confidentiality and patient privacy — the two main barriers to pooling pharmaceutical data.'},

  {q:'The pharmacist’s contribution to an AI-supported drug discovery team is chiefly:',
   o:['Bringing therapeutic, formulation and clinical-use context that determines whether a candidate is practically usable','Writing the machine learning code','Managing the laboratory budget','Recruiting staff'],c:0,
   e:'Pharmacists supply the <b>practice-facing perspective</b> — dosing feasibility, formulation constraints, likely adherence and real-world use — which computational metrics do not capture.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'AI Support in Scientific Research & Data Analysis', hrs:7.5, qs:[

  {q:'A p-value of 0.03 means:',
   o:['There is a 3% chance the null hypothesis is true','If the null hypothesis were true, data at least as extreme as this would occur 3% of the time',
      'The treatment is 97% effective','The result is clinically important'],c:1,
   e:'This is the most misinterpreted statistic in medicine. The p-value is the probability of the <b>data given the null hypothesis</b>, not the probability of the hypothesis, and says nothing about clinical importance.'},

  {q:'A 95% confidence interval for a difference in means that includes zero indicates:',
   o:['The result is not statistically significant at the 5% level','The study was too large','The treatment definitely does not work','A calculation error'],c:0,
   e:'For a <b>difference</b> measure, the null value is zero; for a <b>ratio</b> measure it is one. Non-significance is not evidence of no effect — it may simply reflect imprecision.'},

  {q:'Statistical significance differs from clinical significance in that a result may be:',
   o:['Statistically significant yet too small to matter to a patient, particularly in very large studies','Clinically important but never statistically significant','Both are always identical','Neither can be measured'],c:0,
   e:'With a large enough sample, <b>trivial differences become statistically significant</b>. The question that matters is the size of the effect and whether patients would value it.'},

  {q:'Which measure best conveys the practical benefit of a treatment to a clinician?',
   o:['The p-value','The relative risk alone','The absolute risk reduction and the number needed to treat','The sample size'],c:2,
   e:'<b>Absolute</b> measures are anchored to baseline risk. A relative risk reduction of 50% may mean a great deal or almost nothing depending on how common the outcome is.'},

  {q:'Intention-to-treat analysis means analysing participants:',
   o:['Only if they completed the study','According to the group to which they were randomised, regardless of what treatment they actually received',
      'According to the treatment they actually took','Only if they adhered fully'],c:1,
   e:'<b>ITT</b> preserves the randomisation and therefore the comparability of the groups. Per-protocol analysis, by excluding non-adherers, reintroduces selection bias.'},

  {q:'Blinding in a clinical trial primarily reduces:',
   o:['Selection bias at randomisation','Performance and detection bias arising from knowledge of the allocation',
      'Confounding by indication','Attrition'],c:1,
   e:'Allocation concealment protects randomisation; <b>blinding</b> protects what happens afterwards — how patients are treated and how outcomes are judged.'},

  {q:'A study reports a hazard ratio of 0.80 (95% CI 0.65–0.98). The correct interpretation is:',
   o:['An 80% reduction in risk','No significant effect','An 80% increase in risk','A 20% relative reduction in the hazard, statistically significant as the interval excludes 1'],c:3,
   e:'HR 0.80 means the hazard is <b>80% of control — a 20% relative reduction</b>. The interval excludes 1, so it is significant, but the upper limit of 0.98 shows the benefit could be very small.'},

  {q:'Sample size calculation before a trial is essential because:',
   o:['An underpowered study may miss a real effect, and an oversized one exposes more participants than necessary','Regulators require a round number','It determines the price of the drug','It sets the trial duration only'],c:0,
   e:'Sample size is an <b>ethical as well as statistical</b> matter: too few participants wastes their contribution, too many exposes people to risk unnecessarily.'},

  {q:'Multiple hypothesis testing without correction increases the risk of:',
   o:['Type II error','Type I error — finding at least one apparently significant result by chance alone',
      'Selection bias','Recall bias'],c:1,
   e:'Testing twenty independent hypotheses at p&lt;0.05 gives roughly a 64% chance of at least one false positive. <b>Correction</b> or pre-specification of a primary outcome is required.'},

  {q:'A Type II error occurs when a study:',
   o:['Fails to detect an effect that genuinely exists','Finds an effect that does not exist','Uses the wrong statistical test','Recruits too many participants'],c:0,
   e:'A <b>Type II error</b> is a false negative, usually caused by inadequate power. It is why “no significant difference” must never be reported as “no difference”.'},

  {q:'Data cleaning before analysis primarily involves:',
   o:['Deleting inconvenient results','Rounding all values','Identifying and handling missing values, impossible values, duplicates and inconsistent coding, with the process documented','Removing the control group'],c:2,
   e:'Cleaning must be <b>documented and pre-specified</b>. Undocumented exclusion of awkward data points is a form of research misconduct, not data cleaning.'},

  {q:'Missing data handled by simply deleting incomplete records risks:',
   o:['Making the analysis faster','Increasing the sample size','Bias, if the data are not missing completely at random','Improving precision'],c:2,
   e:'<b>Complete case analysis</b> is only unbiased if missingness is unrelated to the outcome. When sicker patients drop out, deletion systematically distorts the result.'},

  {q:'Correlation does not imply causation because:',
   o:['An observed association may be explained by confounding, reverse causation or chance','Correlation coefficients are unreliable','Causation cannot be studied','Correlation is always negative'],c:0,
   e:'The three standard alternative explanations are <b>confounding, reverse causation and chance</b>. Excluding them requires design, not stronger correlation.'},

  {q:'A systematic review differs from a narrative review in that it:',
   o:['Is written by more authors','Is always shorter','Includes only randomised trials','Follows a pre-specified protocol with an explicit, reproducible search and appraisal method'],c:3,
   e:'The defining feature is <b>method, not content</b>: a stated protocol, a reproducible search, defined eligibility criteria and structured appraisal.'},

  {q:'Publication bias means that:',
   o:['Journals publish too many papers','Authors publish in the wrong journals','Studies with positive results are more likely to be published, so the visible literature overstates effect sizes','Reviewers are biased against new authors'],c:2,
   e:'<b>Publication bias</b> systematically inflates apparent benefit. Searching trial registries and grey literature is the principal defence.'},

  {q:'A funnel plot in a meta-analysis is used to:',
   o:['Display patient recruitment over time','Assess for small-study effects and possible publication bias by plotting effect size against precision',
      'Show the funding sources','Compare two guidelines'],c:1,
   e:'Asymmetry in a <b>funnel plot</b> suggests small negative studies are missing, though asymmetry can also arise from genuine heterogeneity rather than bias alone.'},

  {q:'AI-assisted literature screening in a systematic review is best used to:',
   o:['Replace human screening entirely','Write the conclusions','Prioritise and pre-screen records for human reviewers, reducing workload while retaining human decisions','Select the journal for publication'],c:2,
   e:'Current practice is <b>machine-assisted, human-decided</b>. Automation reduces the screening burden but the eligibility judgement, and accountability for it, remain human.'},

  {q:'The most important caution when using a large language model to summarise research is that it:',
   o:['Writes too formally','Cannot process English','Requires special hardware','May fabricate citations or misstate numerical results while sounding entirely authoritative'],c:3,
   e:'<b>Hallucinated references and misstated statistics</b> are the characteristic failure. Every citation must be resolved and every number recomputed against the source.'},

  {q:'Research data should be stored in a way that is:',
   o:['Accessible only to the lead author','Deleted after publication','Kept only on a personal laptop','Findable, Accessible, Interoperable and Reusable, with appropriate protection for personal data'],c:3,
   e:'The <b>FAIR</b> principles govern research data stewardship. They coexist with, rather than override, data protection obligations for personal data.'},

  {q:'Pre-registration of a study protocol primarily prevents:',
   o:['Outcome switching and selective reporting of whichever results proved favourable','Data loss','Recruitment failure','Statistical errors'],c:0,
   e:'Pre-registration fixes the <b>primary outcome and analysis plan in advance</b>, so a disappointing primary result cannot be quietly replaced by a favourable secondary one.'},

  {q:'A confounding variable is one that:',
   o:['Is measured with error','Appears only in the control group','Has no effect on the outcome','Is associated with both the exposure and the outcome and can create a spurious association'],c:3,
   e:'A confounder must be associated with <b>both exposure and outcome</b>, and not lie on the causal pathway between them. Randomisation deals with confounders known and unknown.'},

  {q:'Randomisation in a controlled trial achieves:',
   o:['Equal numbers in each group only','Elimination of measurement error','Guaranteed statistical significance','Balance of known and unknown confounders between groups, in expectation'],c:3,
   e:'The unique power of randomisation is balancing <b>unknown</b> confounders. No statistical adjustment in an observational study can achieve the same.'},

  {q:'Reproducibility of a data analysis is best supported by:',
   o:['Keeping the method confidential','Sharing the analysis code, the data dictionary and the exact software versions used',
      'Using a spreadsheet with manual steps','Reporting only the final figures'],c:1,
   e:'Manual spreadsheet steps cannot be reproduced or audited. <b>Scripted, version-controlled analysis</b> with documented dependencies is what makes a result checkable.'},

  {q:'When reporting a randomised trial, the CONSORT statement provides:',
   o:['A checklist and flow diagram specifying what must be reported for the trial to be assessable','A statistical test','A funding application form','An ethics approval template'],c:0,
   e:'<b>CONSORT</b> exists because incomplete reporting makes a trial impossible to appraise. Related standards include PRISMA for systematic reviews and STROBE for observational studies.'},

  {q:'The pharmacist’s most valuable skill when appraising AI-based research claims is:',
   o:['Ability to write code','Knowledge of hardware','Asking whether the model was validated on independent data, in a population resembling their own patients','Familiarity with the vendor'],c:2,
   e:'<b>External validation and applicability</b> are the two questions that separate a usable model from an impressive one. Internal performance figures alone predict very little.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Injectable Medicines & Sterile Products', hrs:7.5, qs:[

  {q:'A parenteral product must be:',
   o:['Sweetened for palatability','Sterile, pyrogen-free, and free from visible particulate matter',
      'Coloured for identification','Buffered to pH 2'],c:1,
   e:'Bypassing the gastrointestinal barrier removes the body’s defences. <b>Sterility, absence of pyrogens and freedom from particulates</b> are therefore absolute requirements.'},

  {q:'Pyrogens in an injectable product are:',
   o:['Substances, typically bacterial endotoxins, that produce a febrile reaction when injected','Colouring agents','Preservatives','Stabilising excipients'],c:0,
   e:'<b>Endotoxins</b> survive sterilisation by autoclaving. Depyrogenation requires dry heat or removal, which is why sterility alone does not guarantee a safe parenteral.'},

  {q:'An ISO Class 5 (Grade A) environment is required for:',
   o:['The critical zone where sterile product is exposed, such as aseptic filling or compounding','Storing cardboard cartons','The pharmacy office','Goods receipt'],c:0,
   e:'<b>Grade A / ISO Class 5</b> is the critical zone. It is surrounded by progressively less stringent grades so that contamination cannot migrate inward.'},

  {q:'Terminal sterilisation is preferred over aseptic processing whenever possible because:',
   o:['It is cheaper','It is faster','It requires no validation','The product is sterilised in its final sealed container, giving far greater assurance of sterility'],c:3,
   e:'Terminal sterilisation gives a measurable <b>sterility assurance level</b> for the sealed unit. Aseptic processing depends on maintaining sterility throughout, which is inherently less certain.'},

  {q:'Media fill (process simulation) testing is used to:',
   o:['Validate the aseptic process by substituting growth medium for product and checking for contamination','Test the strength of the product','Measure fill volume accuracy','Check the label'],c:0,
   e:'A <b>media fill</b> tests the whole aseptic process, including operator technique. Any contaminated unit triggers investigation, because it demonstrates the process can fail.'},

  {q:'Laminar airflow in a cabinet protects the product by:',
   o:['Cooling it','Sterilising the surface chemically','Reducing humidity','Providing HEPA-filtered air in a unidirectional flow that sweeps contamination away from the critical zone'],c:3,
   e:'Unidirectional <b>HEPA-filtered airflow</b> maintains the critical zone. This is why obstructing the airflow path, or working downstream of a non-sterile object, breaks the protection.'},

  {q:'“First air” in aseptic technique refers to:',
   o:['The first air entering the room each morning','Air exhaled by the operator','Air that has passed directly from the HEPA filter to the critical site without passing over any object first','Compressed air used for drying'],c:2,
   e:'Any object placed upstream sheds particles into the airstream. Preserving <b>first air</b> to critical sites is a fundamental rule of aseptic manipulation.'},

  {q:'A cytotoxic drug should be prepared in:',
   o:['An open bench in the dispensary','A negative-pressure containment isolator or Class II biological safety cabinet, protecting both product and operator',
      'A positive-pressure isolator for maximum product protection','Any refrigerated area'],c:1,
   e:'Cytotoxics require <b>containment</b> as well as sterility. Negative pressure protects the operator; standard aseptic isolators for non-hazardous products are positive pressure.'},

  {q:'A “closed system transfer device” for hazardous drugs is designed to:',
   o:['Speed up reconstitution','Reduce the cost of vials','Allow multiple patients to share a vial','Prevent the escape of drug or vapour and prevent environmental contaminants entering the system'],c:3,
   e:'A <b>CSTD</b> is a bidirectional barrier. It reduces occupational exposure to hazardous drugs and is now standard in cytotoxic reconstitution.'},

  {q:'Which is the correct definition of “beyond-use date” for a compounded sterile preparation?',
   o:['The manufacturer’s expiry date on the vial','The date or time after which the compounded preparation must not be used, based on sterility and stability risk',
      'The date the product was made','The date the batch was ordered'],c:1,
   e:'The <b>BUD</b> is set by compounding conditions and storage, and is usually far shorter than the vial’s expiry, because sterility assurance and stability after manipulation are the limiting factors.'},

  {q:'Osmolarity matters in parenteral products because a markedly hypertonic solution given peripherally may cause:',
   o:['Phlebitis and venous damage','Reduced efficacy','Increased shelf-life','Precipitation of the label'],c:0,
   e:'High osmolarity damages the venous endothelium. Solutions above roughly 900 mOsm/L generally require <b>central venous administration</b>.'},

  {q:'Parenteral nutrition admixtures require particular care because of the risk of:',
   o:['Excessive sweetness','Calcium–phosphate precipitation, which can be fatal if infused',
      'Colour change only','Increased viscosity only'],c:1,
   e:'<b>Calcium–phosphate precipitation</b> is a documented cause of death from pulmonary emboli. Order of mixing, concentrations and pH must all be controlled, and a filter used.'},

  {q:'An in-line filter is used during infusion primarily to:',
   o:['Slow the infusion rate','Warm the solution','Change the pH','Remove particulate matter and, with the appropriate filter, microorganisms'],c:3,
   e:'Filters protect against <b>particulates and precipitates</b>. A 0.22 micron filter also retains bacteria, and lipid-containing admixtures require a larger pore size.'},

  {q:'Which check is most critical before administering an intrathecal medicine?',
   o:['Independent verification that the drug is intended for intrathecal use and that vincristine is never given by this route','The colour of the label','The manufacturer’s name','The size of the syringe'],c:0,
   e:'<b>Intrathecal vincristine is invariably fatal.</b> This is why intrathecal chemotherapy is governed by strict national protocols with separate timing, storage and independent verification.'},

  {q:'Reconstitution of a powder for injection requires attention to:',
   o:['Only the volume of diluent','Only the expiry date','The correct diluent, its volume, the resulting concentration, and the stability period after reconstitution','Only the syringe brand'],c:2,
   e:'Using the wrong <b>diluent</b> can cause precipitation or inactivation, and the final concentration determines the volume to be withdrawn. Post-reconstitution stability is often only hours.'},

  {q:'A visible particulate is observed in a prepared infusion bag. The correct action is to:',
   o:['Administer it through a filter','Shake the bag until the particle disperses','Do not administer; quarantine the product and investigate, reporting as required','Administer more slowly'],c:2,
   e:'A visible particulate means the preparation has <b>failed</b>. It must not be given; filtering does not resolve the underlying problem, which may be incompatibility or contamination.'},

  {q:'AI-based visual inspection systems in sterile manufacturing are used to:',
   o:['Read the batch number aloud','Detect particulates, container defects and fill-level anomalies more consistently than human inspection',
      'Sterilise the vials','Print the labels'],c:1,
   e:'Human visual inspection is subject to fatigue and variability. <b>Automated vision systems</b> apply a consistent standard at speed, though they require careful validation against defect libraries.'},

  {q:'Environmental monitoring in a cleanroom includes:',
   o:['Counting staff entries only','Weekly temperature checks only','Viable and non-viable particle monitoring, surface sampling and personnel monitoring, trended over time','Annual air conditioning service only'],c:2,
   e:'Environmental monitoring is about <b>trend</b>. A single result means little; a rising trend or a recurring organism signals loss of control before a product failure occurs.'},

  {q:'Predictive analytics applied to cleanroom environmental data can:',
   o:['Replace all sampling','Eliminate the need for gowning','Certify the batch automatically','Identify drift toward action limits early, allowing intervention before a batch is compromised'],c:3,
   e:'The value is <b>early warning</b>. Detecting an adverse trend days before an excursion converts a batch loss into a routine maintenance action.'},

  {q:'The greatest single source of contamination risk in aseptic compounding is:',
   o:['The HEPA filter','The operator, through shedding, poor technique or incorrect gowning',
      'The vial glass','The ambient temperature'],c:1,
   e:'People shed vast numbers of particles and organisms. This is why <b>gowning, technique and validated operator competence</b> dominate aseptic quality assurance.'},

  {q:'Aseptic technique competency of an operator should be assessed:',
   o:['Periodically through media fills, gloved fingertip sampling and observed technique, with documented requalification','Once at induction','Only after a contamination event','By the operator themselves'],c:0,
   e:'Competence <b>decays</b>. Periodic revalidation, not one-off certification, is the standard, and it must be documented to satisfy inspection.'},

  {q:'A “sterility assurance level” of 10⁻⁶ means:',
   o:['A probability of no more than one non-sterile unit in one million units','One in a million units contains a million organisms','The product is sterile for one million hours','Six sterilisation cycles were used'],c:0,
   e:'<b>SAL 10⁻⁶</b> is the accepted standard for terminally sterilised products. Sterility is expressed as a probability because absolute proof would require testing every unit.'},

  {q:'Why is 100% sterility testing of a batch not performed?',
   o:['It is too expensive','Regulators prohibit it','It is not accurate enough','Sterility testing is destructive, so testing every unit would leave nothing to release'],c:3,
   e:'Sterility testing <b>destroys the sample</b>. Assurance therefore comes from validated process control plus testing a statistically defined sample, not from testing everything.'},

  {q:'Cold-chain injectable products that have experienced a temperature excursion should be:',
   o:['Used immediately before further deterioration','Discarded without record','Quarantined and assessed for suitability with reference to stability data and the manufacturer','Returned to the refrigerator and used normally'],c:2,
   e:'The universal rule is <b>quarantine then assess</b>. Neither continued use nor unrecorded destruction is acceptable.'},

  {q:'Documentation of a compounded sterile preparation must include:',
   o:['Only the patient’s name','Only the final volume','Ingredients with batch numbers and expiry, quantities, the operator and checker, date and time, and the beyond-use date','Only the prescriber’s name'],c:2,
   e:'The record must allow the preparation to be <b>fully reconstructed and traced</b> — every component identified by batch, every person identified, and the BUD stated.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Vaccines & Cold-Chain Analytics', hrs:7.5, qs:[

  {q:'The recommended storage temperature range for most routine vaccines is:',
   o:['+2 °C to +8 °C','−20 °C to −10 °C','+15 °C to +25 °C','Below −70 °C'],c:0,
   e:'<b>+2 °C to +8 °C</b> is the standard cold-chain range. Certain products, notably some mRNA vaccines, require ultra-cold storage and are handled under separate arrangements.'},

  {q:'Freezing is particularly damaging to which vaccines?',
   o:['All vaccines equally','Only live vaccines','Only oral vaccines','Aluminium-adjuvanted vaccines such as DTP, hepatitis B and tetanus, where freezing causes irreversible loss of potency'],c:3,
   e:'Freezing disrupts the <b>adjuvant–antigen complex</b> irreversibly. Because the vial may look normal afterwards, freezing is a particularly insidious cold-chain failure.'},

  {q:'A Vaccine Vial Monitor (VVM) indicates:',
   o:['The expiry date','Whether the vial has been frozen','Cumulative heat exposure the vial has experienced over time','The number of doses remaining'],c:2,
   e:'The <b>VVM</b> is a heat-sensitive label. When the inner square is as dark as or darker than the outer ring, the vial must be discarded regardless of the printed expiry.'},

  {q:'A “shake test” is used to determine whether a vaccine:',
   o:['Has been exposed to light','Is still within expiry','Has been frozen, by observing the sedimentation pattern compared with a deliberately frozen control','Has the correct concentration'],c:2,
   e:'A previously frozen adjuvanted vaccine sediments rapidly with a granular appearance. The test requires comparison against a <b>known frozen control</b> of the same product.'},

  {q:'The correct arrangement of vaccines inside a refrigerator is:',
   o:['Packed tightly against the walls to keep cool','Arranged with space for air circulation, away from walls, the floor and the freezer compartment',
      'In the door for easy access','Directly on top of ice packs'],c:1,
   e:'Air must circulate to maintain a uniform temperature. Contact with the <b>cold wall</b> risks freezing, while the <b>door</b> is the warmest and most variable location.'},

  {q:'Vaccines should never be stored in the refrigerator door because:',
   o:['Temperature there fluctuates most with door opening, and the location is not temperature-mapped','It is difficult to reach','The light damages them','It is too cold'],c:0,
   e:'The door experiences the <b>largest temperature swings</b>. Only mapped, validated locations within the cabinet should hold vaccine.'},

  {q:'Temperature mapping of a vaccine refrigerator is performed to:',
   o:['Measure how much electricity it uses','Check the door seal only','Determine the shelf material','Identify warm and cold spots so that vaccine is stored only in validated locations and the probe is correctly placed'],c:3,
   e:'Cabinets are not uniform. <b>Mapping</b> establishes where the extremes are, which determines both safe storage locations and where the monitoring probe must sit.'},

  {q:'A continuous temperature data logger is superior to twice-daily manual readings because it:',
   o:['Is cheaper','Requires no calibration','Captures excursions occurring overnight, at weekends and between readings, with a permanent record','Eliminates the need for an alarm'],c:2,
   e:'Manual readings sample two moments in a day. The excursions that damage vaccine typically happen <b>unobserved</b>, which only continuous logging can detect.'},

  {q:'On discovering a vaccine cold-chain excursion, the first action is to:',
   o:['Discard all affected vaccine immediately','Isolate and label the affected stock “do not use”, continue to store it correctly, and seek advice from the manufacturer or programme',
      'Continue administering while awaiting advice','Move the vaccine to a freezer'],c:1,
   e:'<b>Quarantine but preserve.</b> Much excursion-affected vaccine remains usable after assessment, so immediate destruction wastes both product and evidence.'},

  {q:'The multi-dose vial policy allows an opened multi-dose vial to be used for a limited period only if:',
   o:['It is kept at room temperature','It looks and smells normal','The vaccine has a preservative, the vial is correctly stored, the VVM is valid and it is within the specified period after opening','Fewer than half the doses have been used'],c:2,
   e:'The policy depends on <b>preservative content, correct storage, a valid VVM and the time since opening</b>. Preservative-free vials must be discarded promptly after opening.'},

  {q:'“Open vial wastage” differs from “closed vial wastage” in that open vial wastage:',
   o:['Occurs during transport','Applies only to expired stock','Arises from doses discarded from vials already opened, typically when fewer patients attend than the vial contains','Cannot be measured'],c:2,
   e:'Open vial wastage is driven by <b>session size versus vial size</b>. Analytics that match vial presentation to expected attendance is the practical lever for reducing it.'},

  {q:'Predictive analytics applied to vaccine demand forecasting helps most by:',
   o:['Setting the vaccine price','Matching stock to expected uptake, reducing both stock-outs and expiry wastage',
      'Choosing the manufacturer','Deciding the clinic location only'],c:1,
   e:'Vaccine logistics is a two-sided problem: too little causes missed immunisation, too much causes expiry. <b>Forecasting</b> optimises between the two.'},

  {q:'IoT-enabled cold-chain monitoring adds value chiefly through:',
   o:['Reducing electricity consumption','Removing the need for refrigerators','Automatic ordering of vaccine','Real-time alerts that allow intervention before the excursion damages the product'],c:3,
   e:'A logger that is only read afterwards documents the loss. <b>Real-time alerting</b> is what allows someone to act while the stock can still be saved.'},

  {q:'A cold box differs from a vaccine carrier in that a cold box:',
   o:['Is smaller and used for a single session','Requires electricity','Is used only for diluents','Has greater capacity and longer cold-life, and is used for transport or temporary storage during power failure'],c:3,
   e:'<b>Cold boxes</b> hold larger volumes for longer and serve as contingency storage during power failure; <b>carriers</b> are for outreach sessions of a day or less.'},

  {q:'Conditioning of ice packs before use in a vaccine carrier is necessary to:',
   o:['Make them last longer','Make them lighter','Improve their appearance','Prevent freezing of the vaccine by allowing the pack to warm until water droplets appear'],c:3,
   e:'A pack straight from the freezer will <b>freeze adjacent vaccine</b>. Conditioning until it begins to sweat is a small step that prevents a common and invisible failure.'},

  {q:'Which vaccine characteristic makes cold-chain failure especially difficult to detect?',
   o:['Loss of potency produces no visible change in the vial','A strong smell when spoiled','The vial changes colour','The volume decreases'],c:0,
   e:'A heat- or freeze-damaged vaccine looks entirely normal. This is precisely why <b>monitoring devices and documented procedures</b>, rather than inspection, are the control.'},

  {q:'The main clinical consequence of administering a vaccine that has lost potency is:',
   o:['Failure of protection, leaving the person unknowingly susceptible','An immediate allergic reaction','A local reaction only','Immediate illness'],c:0,
   e:'The harm is <b>silent</b>: the patient believes they are protected and is not. This is why cold-chain breaches usually require recall and revaccination.'},

  {q:'AEFI stands for:',
   o:['Assessment of Effective Formulation Ingredients','Adverse Event Following Immunisation',
      'Annual Estimate of Financial Investment','Approved Excipient Formulation Index'],c:1,
   e:'An <b>AEFI</b> is any untoward medical occurrence following immunisation, which does not necessarily have a causal relationship with the vaccine — that is determined by investigation.'},

  {q:'A cluster of AEFIs from a single vaccination session most often indicates:',
   o:['A defective vaccine batch','A programmatic error such as incorrect reconstitution, wrong diluent or poor injection technique',
      'A new adverse reaction','Coincidental illness'],c:1,
   e:'<b>Clustering by session or vaccinator</b> points strongly to programme error rather than product defect, and is investigated as such.'},

  {q:'Which is a programmatic error rather than a vaccine product problem?',
   o:['An unexpected allergic reaction to an excipient','A rare reaction described in the product information','Reconstituting a vaccine with the wrong diluent','Expected local soreness'],c:2,
   e:'Using the <b>wrong diluent</b> is an error of practice. It has caused deaths, most notoriously when a muscle relaxant was used in place of vaccine diluent.'},

  {q:'The main purpose of an electronic vaccine registry is to:',
   o:['Bill patients accurately','Maintain an accurate individual immunisation record, enabling recall, coverage measurement and rapid response to a recall',
      'Track staff attendance','Order stock automatically'],c:1,
   e:'A registry supports <b>the individual and the population</b>: it prevents missed and duplicated doses and identifies exactly who received an affected batch.'},

  {q:'Vaccine coverage analytics is most useful when it can:',
   o:['Identify geographical or demographic pockets of low coverage where outbreaks are likely to begin','Show only the national average','Rank clinics by revenue','Measure staff satisfaction'],c:0,
   e:'Outbreaks start in <b>susceptible clusters</b>. A high national average can conceal a community with coverage low enough to sustain transmission.'},

  {q:'Batch and expiry recording at the point of vaccine administration is essential because:',
   o:['A recall or a cold-chain breach requires the exact list of recipients of the affected batch','It is needed for invoicing','It speeds up the clinic','Patients request it'],c:0,
   e:'Without <b>batch-to-recipient traceability</b>, a recall becomes a public appeal rather than a targeted recall of the specific people affected.'},

  {q:'Diluent supplied with a vaccine must be:',
   o:['The diluent supplied by the same manufacturer for that specific vaccine, at the correct temperature','Any available sterile water','Stored in the freezer','Reused between vials'],c:0,
   e:'Diluents are <b>product-specific</b> in composition and volume. They should also be cooled before reconstitution so that a warm diluent does not damage the vaccine.'},

  {q:'The pharmacist’s central role in vaccine cold-chain governance is to:',
   o:['Administer every dose personally','Choose the vaccine manufacturer','Set the immunisation schedule','Own the storage procedures, monitoring, excursion response and staff training, and to document them'],c:3,
   e:'Cold-chain integrity is a <b>systems responsibility</b>: validated equipment, continuous monitoring, a rehearsed excursion procedure, trained staff and records that prove all of it.'}
  ]}

  ]
};
