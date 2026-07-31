/* ALIZON OS — Module 1 internal examination question bank
   Certificate Course in Digital Health & Artificial Intelligence for Pharmacy
   4 units × 25 multiple-choice questions · 1 mark each · no negative marking
   c = index of the correct option · e = explanation shown in the answer review   */
window.ALIZON_EXAM_M1 = {
  module: 'Module 1 · Digital Health & Artificial Intelligence for Pharmacy',
  code: 'ALZ-PH-M1',
  units: [

  /* ============================================================
     UNIT 1 — Foundations of Artificial Intelligence in Pharmacy
     ============================================================ */
  {n:1, t:'Foundations of Artificial Intelligence in Pharmacy', hrs:30, qs:[

  {q:'Which statement correctly describes the relationship between artificial intelligence, machine learning and deep learning?',
   o:[
      'Deep learning is a subset of machine learning, which is itself a subset of artificial intelligence',
      'Machine learning is a subset of deep learning, which is a subset of artificial intelligence',
      'Artificial intelligence is a subset of machine learning','They are three independent fields with no overlap'],c:0,
   e:'They are nested. <b>Artificial intelligence</b> is the broadest field — any system performing tasks that would need human intelligence. <b>Machine learning</b> is the subset that learns patterns from data instead of following hand-written rules. <b>Deep learning</b> is the subset of machine learning that uses multi-layered neural networks.'},

  {q:'A model is trained on prescriptions already labelled as “appropriate” or “inappropriate” and learns to classify new ones. What type of learning is this?',
   o:['Unsupervised learning','Supervised learning','Reinforcement learning','Transfer learning'],c:1,
   e:'<b>Supervised learning</b> uses data where the correct answer (the label) is already known, and the model learns the mapping from input to label. Unsupervised learning works on unlabelled data; reinforcement learning learns from rewards and penalties.'},

  {q:'An algorithm groups 50,000 patient medication records into clusters of similar prescribing patterns without being told what the groups should be. This is:',
   o:['Rule-based expert system','Supervised learning','Unsupervised learning','Reinforcement learning'],c:2,
   e:'<b>Unsupervised learning</b> discovers structure in unlabelled data. Clustering is its commonest form — the algorithm is never told what the groups are, only to find records that resemble one another.'},

  {q:'What does “overfitting” mean when training a machine learning model?',
   o:[
      'The model is too simple to capture the pattern in the data',
      'The training dataset is too large for the available memory',
      'The model takes too long to train','The model performs well on training data but poorly on new, unseen data'],c:3,
   e:'<b>Overfitting</b> means the model has memorised the noise and peculiarities of the training set rather than the underlying pattern, so it fails to generalise. The opposite problem — a model too simple to capture the pattern — is called underfitting.'},

  {q:'Why is a dataset split into training, validation and test sets?',
   o:[
      'To train on one portion, tune the model on a second, and obtain an unbiased performance estimate on a third that the model has never seen',
      'Because computers cannot process large datasets at once',
      'To create three separate models and average them','To reduce the total amount of data required'],c:0,
   e:'The <b>test set must remain untouched</b> during development. If the model is tuned using the test data, the reported performance is optimistic and no longer an honest estimate of how it will behave on new patients.'},

  {q:'Which of the following is the best example of artificial intelligence being used in drug discovery?',
   o:['Printing batch labels automatically',
      'Virtual screening of millions of compounds to predict which are likely to bind a target protein',
      'Recording the temperature of a refrigerator',
      'Generating an invoice for dispensed medicines'],c:1,
   e:'<b>Virtual screening</b> uses computational models to rank enormous compound libraries by predicted binding affinity, so that only the most promising candidates go to laboratory testing. The other options are ordinary automation, not AI.'},

  {q:'AlphaFold is best known for which achievement?',
   o:['Detecting counterfeit medicines by barcode',
      'Scheduling clinical trial visits','Predicting the three-dimensional structure of proteins from their amino acid sequence',
      'Automating tablet compression'],c:2,
   e:'AlphaFold predicts <b>protein three-dimensional structure from sequence</b> with remarkable accuracy. Because a drug target’s shape determines what can bind it, this directly accelerates structure-based drug design.'},

  {q:'A QSAR model relates:',
   o:[
      'The number of tablets in a batch to packaging time',
      'Patient age to hospital length of stay','The cost of a drug to its selling price',
      'Chemical structure of compounds to their biological activity'],c:3,
   e:'<b>Quantitative Structure–Activity Relationship</b> modelling correlates molecular descriptors of chemical structure with measured biological activity, allowing the activity of untested compounds to be predicted from structure alone.'},

  {q:'In silico prediction of ADMET properties is valuable primarily because it:',
   o:[
      'Identifies compounds likely to fail on absorption, distribution, metabolism, excretion or toxicity grounds early, before costly development',
      'Guarantees regulatory approval',
      'Eliminates the need for formulation work','Replaces the need for any clinical trials'],c:0,
   e:'Most candidate molecules fail late and expensively on <b>ADMET</b> grounds. Predicting these properties computationally allows poor candidates to be dropped early — “fail fast, fail cheap” — but it never replaces experimental or clinical confirmation.'},

  {q:'How is machine learning most usefully applied to formulation development?',
   o:[
      'By setting the retail price of the product','By predicting how formulation variables such as excipient ratio and compression force affect critical quality attributes, reducing the number of experimental batches',
      'By printing the product label',
      'By replacing the pharmacist entirely'],c:1,
   e:'Formulation involves many interacting variables. A model trained on past batch data can <b>predict quality attributes across the design space</b>, so far fewer physical batches are needed to find an optimum. This complements Quality by Design rather than replacing it.'},

  {q:'“Quality by Design” (QbD) in pharmaceutical development means:',
   o:[
      'Allowing quality standards to be set by the marketing department','Testing quality only in the finished product',
      'Building quality into the product by understanding and controlling the process and its design space from the outset',
      'Designing attractive packaging'],c:2,
   e:'<b>QbD</b> is a systematic approach that begins with predefined objectives and builds quality into the process through understanding of the design space. It replaces the older idea that quality can be tested into a product at the end.'},

  {q:'AI applied to stability studies is chiefly used to:',
   o:[
      'Change the colour of the tablet','Reduce the price of the raw material',
      'Replace the need to store samples altogether','Predict degradation behaviour and shelf-life from accelerated and historical stability data'],c:3,
   e:'Models trained on accelerated and long-term stability data can <b>predict degradation kinetics and estimate shelf-life</b> earlier than waiting for full real-time data. Regulatory confirmation with real-time data is still required.'},

  {q:'In pharmacovigilance, “signal detection” means:',
   o:[
      'Identifying a previously unknown or incompletely documented association between a drug and an adverse event',
      'Measuring the strength of a tablet',
      'Detecting expired stock on the shelf','Checking the mobile network in the pharmacy'],c:0,
   e:'A <b>signal</b> is information suggesting a new, potentially causal association between a medicine and an adverse event, arising from one or more reports and judged sufficient to justify further investigation.'},

  {q:'Disproportionality analysis in a spontaneous reporting database works by:',
   o:['Counting the total number of prescriptions issued',
      'Comparing how often a drug–event pair is reported against how often it would be expected if there were no association',
      'Measuring the disproportion between tablet weight and strength',
      'Comparing prices between two manufacturers'],c:1,
   e:'Measures such as the <b>proportional reporting ratio</b> and <b>reporting odds ratio</b> compare observed with expected reporting frequency. A disproportionately high rate flags the pair for review — it is a hypothesis, not proof of causality.'},

  {q:'Natural language processing is valuable in pharmacovigilance mainly because:',
   o:['It calculates doses','It translates prescriptions into other languages',
      'It extracts adverse-event information from unstructured free text such as case narratives, discharge summaries and literature',
      'It reads barcodes'],c:2,
   e:'Much safety information exists as <b>unstructured free text</b>, which cannot be queried like a database field. NLP extracts drugs, events, timing and outcomes from that text so it can be analysed at scale.'},

  {q:'A Clinical Decision Support System (CDSS) in pharmacy practice typically:',
   o:[
      'Stores only financial records',
      'Prints shelf labels','Replaces the pharmacist’s professional judgement',
      'Provides alerts and recommendations at the point of prescribing or dispensing to support, not replace, professional judgement'],c:3,
   e:'A CDSS <b>supports</b> the clinician — checking interactions, doses, allergies and duplications, and surfacing guidance at the moment of decision. Accountability for the decision remains with the professional.'},

  {q:'“Alert fatigue” describes:',
   o:[
      'Clinicians becoming desensitised and overriding alerts, including important ones, because too many low-value alerts are generated',
      'The battery of a handheld scanner running down',
      'A pharmacist working excessive hours','A system crashing from too many users'],c:0,
   e:'<b>Alert fatigue</b> is a serious patient-safety problem. When most alerts are trivial, clinicians dismiss them reflexively, and the occasional critical alert is dismissed along with the rest. The remedy is better alert specificity, not more alerts.'},

  {q:'Which is the most important limitation of an AI model trained only on data from one hospital?',
   o:['It will run slowly on other computers',
      'Its performance may not generalise to populations with different demographics, prescribing patterns or documentation practices',
      'It cannot be printed','It will use too much electricity'],c:1,
   e:'This is <b>dataset shift</b>. A model reflects the population it learned from; applied elsewhere it may perform substantially worse. External validation on independent data is therefore essential before clinical deployment.'},

  {q:'Algorithmic bias in a healthcare AI system most commonly arises from:',
   o:['Writing the code in the wrong language','Slow internet connections',
      'Training data that under-represents or systematically mis-measures certain patient groups',
      'Using too many computers'],c:2,
   e:'A model learns whatever is in its training data, <b>including historical inequities</b>. If a group is under-represented or its outcomes were recorded differently, the model reproduces and can amplify that disadvantage.'},

  {q:'What does “explainability” mean in the context of clinical AI?',
   o:[
      'Writing the user manual in simple language',
      'Explaining the software licence to the patient','The ability of the system to speak aloud',
      'The ability to understand and communicate why the model produced a particular output'],c:3,
   e:'<b>Explainability</b> matters clinically because a professional must be able to justify a decision. A recommendation that cannot be interrogated cannot be safely relied upon, and may not satisfy regulators or patients.'},

  {q:'A screening model reports 99% accuracy on a condition affecting 1% of patients. Why might this be misleading?',
   o:[
      'A model that simply labels everyone as negative would also score about 99%, so accuracy alone says nothing about detection of actual cases',
      'Accuracy cannot be calculated for medical data',
      'Because 99% is too low for clinical use','Accuracy above 95% is always suspicious'],c:0,
   e:'This is the <b>class imbalance</b> trap. With a rare outcome, accuracy is dominated by the majority class. <b>Sensitivity, specificity, positive predictive value</b> and the confusion matrix are the informative measures.'},

  {q:'Sensitivity of a diagnostic model is defined as:',
   o:['The proportion of patients without the condition who are correctly identified as negative',
      'The proportion of patients with the condition who are correctly identified as positive',
      'The proportion of all predictions that are correct',
      'The speed at which the model produces a result'],c:1,
   e:'<b>Sensitivity</b> (true positive rate) is the ability to detect disease when it is present. Specificity is the mirror measure — correctly identifying those without the condition.'},

  {q:'Which task is a convolutional neural network most suited to in pharmaceutical practice?',
   o:['Sending an email reminder','Balancing the pharmacy cash register',
      'Image-based tasks such as identifying tablets from photographs or detecting defects in blister packs',
      'Sorting a list alphabetically'],c:2,
   e:'<b>Convolutional neural networks</b> are designed to extract spatial features from images, which makes them the standard choice for visual inspection, tablet identification and packaging defect detection.'},

  {q:'A generative AI tool produces a plausible-looking reference for a drug interaction that does not actually exist. This is known as:',
   o:['A hardware fault','An encryption error','A firewall block','A hallucination'],c:3,
   e:'A <b>hallucination</b> is confidently produced but fabricated output. It is the characteristic failure mode of generative models and the reason every AI-supplied citation must be resolved against the primary source before use.'},

  {q:'What is the correct professional position on using AI output in pharmacy practice?',
   o:[
      'Use AI to support the work, but verify its output against authoritative sources before acting, with the pharmacist retaining accountability',
      'Use AI only if the patient gives written consent for each query','Accept AI output directly, since the model has processed more data than any human',
      'Refuse to use AI tools in any clinical context'],c:0,
   e:'The professional standard is neither dependence nor refusal but <b>verification</b>. AI can retrieve, summarise and flag; the pharmacist confirms against authoritative references and <b>remains accountable</b> for the decision.'}
  ]},

  /* ============================================================
     UNIT 2 — Digital Pharmacy & Information Systems
     ============================================================ */
  {n:2, t:'Digital Pharmacy & Information Systems', hrs:7.5, qs:[

  {q:'The primary purpose of a Pharmacy Information System (PIS) is to:',
   o:['Control the building’s air conditioning','Manage the medication use process — order entry, dispensing, inventory and patient medication records',
      'Store radiology images','Manage hospital human resources'],c:1,
   e:'A <b>PIS</b> supports the whole medication use process within the pharmacy: order processing, dispensing records, stock control, patient medication profiles and reporting.'},

  {q:'How does a Hospital Information System (HIS) relate to a Pharmacy Information System?',
   o:[
      'They cannot exchange data','They are the same thing under different names',
      'The HIS is the hospital-wide system covering clinical, administrative and financial functions; the PIS is a specialised subsystem that integrates with it',
      'The PIS contains the HIS'],c:2,
   e:'The <b>HIS</b> is the enterprise system; the <b>PIS</b> is a departmental subsystem within or interfaced to it. Integration is what allows a prescription entered on the ward to reach the pharmacy without re-keying.'},

  {q:'Which is the best example of a tertiary source of drug information?',
   o:[
      'An index such as PubMed used to locate articles',
      'A conference abstract of unpublished data','An original randomised controlled trial published in a journal',
      'A textbook, compendium or drug database monograph that summarises and organises existing knowledge'],c:3,
   e:'<b>Tertiary</b> sources — textbooks, compendia, drug database monographs — summarise established knowledge and are the usual first stop. <b>Primary</b> sources are original studies; <b>secondary</b> sources are indexes and abstracting services that help you find primary literature.'},

  {q:'The main limitation of tertiary drug information sources is that they:',
   o:[
      'May lag behind the current literature, since compilation and publication take time',
      'Cannot be searched electronically',
      'Are never peer reviewed','Are always inaccurate'],c:0,
   e:'Tertiary sources are convenient and generally reliable, but there is an inevitable <b>publication lag</b>. For a very recent safety issue or newly approved medicine, primary literature or a regulator’s alert must be consulted.'},

  {q:'A hospital digital formulary primarily tells the pharmacist:',
   o:['The price the patient paid last year',
      'Which medicines the hospital has approved for use, their formulary status, restrictions and availability',
      'The chemical synthesis route of each drug',
      'The names of the manufacturing staff'],c:1,
   e:'A <b>formulary</b> is the list of medicines approved for use in that institution, with status, restrictions and any conditions of use. It answers “can I supply this here?”, which no external drug database can answer.'},

  {q:'You need the severity grading and management advice for a suspected drug–drug interaction. Which source is most appropriate?',
   o:[
      'The ward duty roster','The hospital digital formulary',
      'A dedicated interaction database',
      'The hospital’s billing system'],c:2,
   e:'Matching the question to the source is a core skill. A <b>dedicated interaction database</b> gives severity, mechanism and management. A general monograph gives dose and pharmacokinetics; the formulary gives local availability.'},

  {q:'What is an Electronic Health Record (EHR)?',
   o:[
      'A spreadsheet of pharmacy sales',
      'A backup tape kept off site','A paper chart stored in a locked cupboard',
      'A longitudinal digital record of a patient’s health information, designed to be shared across authorised providers and settings'],c:3,
   e:'An <b>EHR</b> is longitudinal and shareable across care settings. This distinguishes it from an Electronic Medical Record, which is generally confined to a single organisation.'},

  {q:'HL7 and FHIR are best described as:',
   o:[
      'Standards for exchanging healthcare information between different systems',
      'Types of computer virus',
      'Categories of controlled drug','Brands of pharmacy refrigerator'],c:0,
   e:'<b>HL7</b> and its modern web-based standard <b>FHIR</b> define how clinical data is structured and transmitted, so that systems from different vendors can exchange information reliably.'},

  {q:'“Interoperability” between pharmacy systems and the EHR means:',
   o:['Both systems are made by the same vendor',
      'The systems can exchange data and, crucially, use the information that has been exchanged',
      'Both systems are installed on the same computer',
      'Both use the same password'],c:1,
   e:'True interoperability requires more than moving a file. The receiving system must be able to <b>interpret and act on</b> the data — which is why shared standards and coding systems matter.'},

  {q:'A key patient-safety benefit of integrating pharmacy systems with the EHR is:',
   o:[
      'Lower medicine prices','Reduced electricity consumption',
      'Access to allergies, laboratory results and the full medication list at the point of dispensing, without transcription',
      'Faster printing of labels'],c:2,
   e:'Integration removes <b>transcription steps</b> — a classic error source — and gives the pharmacist the clinical context needed to verify safely: allergies, renal function, and everything else the patient is taking.'},

  {q:'CPOE stands for:',
   o:['Central Pharmacy Ordering Equipment',
      'Clinical Pharmacy Outcome Evaluation','Controlled Prescription Oversight Entity','Computerised Physician Order Entry'],c:3,
   e:'<b>Computerised Physician Order Entry</b> allows prescribers to enter orders directly into the system. Its main safety gain is the elimination of illegible handwriting and transcription errors, and it enables decision support at the moment of prescribing.'},

  {q:'An eMAR is used to:',
   o:[
      'Record electronically that each dose of medicine was administered to the patient, and when',
      'Calculate the pharmacy’s profit',
      'Store radiology images','Order stock from the supplier'],c:0,
   e:'The <b>electronic Medication Administration Record</b> documents administration at the bedside. Combined with barcode verification it closes the final loop of the medication use process.'},

  {q:'Barcode medication administration principally improves safety by verifying:',
   o:['That the patient’s bill has been paid',
      'The right patient, right drug, right dose, right route and right time at the bedside',
      'That the pharmacy shelf is tidy',
      'The manufacturer’s share price'],c:1,
   e:'Barcode scanning at the point of administration checks the <b>five rights</b> electronically, catching errors that have survived every earlier step in the process.'},

  {q:'Which best describes cloud computing in the “Software as a Service” model?',
   o:[
      'Software is delivered on CD-ROM','The hospital buys and maintains all its own servers',
      'Applications are hosted by a provider and accessed over the internet, with the provider managing the underlying infrastructure',
      'Data is stored only on individual desktop computers'],c:2,
   e:'In <b>SaaS</b> the provider runs the application and the infrastructure beneath it, and the organisation subscribes to the service. IaaS and PaaS give the customer progressively more control and more responsibility.'},

  {q:'A significant risk that must be managed when a pharmacy moves patient data to a cloud service is:',
   o:[
      'The size of the monitor required',
      'The need to buy new furniture','The colour scheme of the interface',
      'Loss of direct physical control over where and how data is stored, making the contract, jurisdiction and security terms critical'],c:3,
   e:'Cloud adoption transfers custody but <b>not accountability</b>. Data residency, encryption, access control, breach notification and exit terms must all be governed by contract, because the organisation remains responsible for the data.'},

  {q:'What is the purpose of the 3-2-1 rule in data backup?',
   o:[
      'Three copies of the data, on two different media types, with one copy kept off site',
      'Backups every three hours for two days in one location',
      'Three servers in one room','Three passwords, two users, one administrator'],c:0,
   e:'The <b>3-2-1 rule</b> protects against correlated failure: multiple copies guard against corruption, different media against a technology-specific fault, and an off-site copy against fire, flood or ransomware affecting the site.'},

  {q:'“Data redundancy” in the context of system resilience means:',
   o:['Storing unnecessary duplicate records that waste space',
      'Deliberately maintaining duplicate data or components so that the failure of one does not cause loss of service or information',
      'Deleting old data','Compressing files to save space'],c:1,
   e:'In resilience terms, <b>redundancy is deliberate</b> — mirrored disks, failover servers, duplicated copies — so that a single failure does not become an outage. This differs from redundancy as an unwanted duplication in database design.'},

  {q:'Which is the correct definition of “downtime procedures” in a hospital pharmacy?',
   o:[
      'The period when the pharmacy is closed','The staff rest break rota',
      'Documented contingency processes for continuing safe medication supply when the electronic systems are unavailable',
      'The time taken to shut down a computer'],c:2,
   e:'Every digital system will eventually be unavailable, whether planned or not. <b>Downtime procedures</b> — paper forms, printed patient lists, and a defined recovery and back-entry process — are a mandatory element of digital workflow planning.'},

  {q:'Structured data differs from unstructured data in that structured data:',
   o:[
      'Is always more accurate','Cannot be stored electronically','Is longer','Is organised in a predefined format such as defined database fields, making it directly searchable and analysable'],c:3,
   e:'<b>Structured</b> data sits in defined fields and can be queried directly. <b>Unstructured</b> data — clinical narratives, scanned letters — carries rich information but needs processing such as NLP before it can be analysed at scale.'},

  {q:'A pharmacy dashboard is most useful when it:',
   o:[
      'Presents a small number of decision-relevant indicators clearly, so that a problem is visible at a glance',
      'Uses as many colours as possible',
      'Requires a long training course to interpret','Displays every available data field at once'],c:0,
   e:'A dashboard exists to support <b>action</b>. Too many metrics obscure the ones that matter; the test of a good dashboard is whether an exception is noticed immediately without study.'},

  {q:'Automated dispensing cabinets on wards improve medication management mainly by:',
   o:['Reducing the price of medicines',
      'Controlling and recording access to medicines at ward level, supporting accountability and stock visibility',
      'Removing the need for a pharmacist',
      'Increasing the ward stock list indefinitely'],c:1,
   e:'These cabinets provide <b>controlled, recorded access</b> — who removed what, when, and for which patient — which supports both accountability for controlled drugs and accurate real-time stock information.'},

  {q:'Which is a valid clinical justification for maintaining a single shared medication list across systems?',
   o:[
      'It allows faster printing','It reduces the number of computers needed',
      'It prevents discrepancies between what different care settings believe the patient is taking, which is a leading cause of medication error at transitions of care',
      'It makes the software cheaper'],c:2,
   e:'Discrepancies at <b>transitions of care</b> — admission, transfer, discharge — are a major source of harm. A single reconciled list, visible to all authorised users, is the structural fix that medication reconciliation depends on.'},

  {q:'Master data management in a pharmacy system refers to:',
   o:[
      'Backing up the database once a year',
      'Deleting old patient records','Managing the head pharmacist’s personal files',
      'Maintaining consistent, accurate core reference data such as the drug catalogue, so every system refers to the same definitions'],c:3,
   e:'If the drug catalogue is inconsistent across systems, interaction checking, stock control and reporting all become unreliable. <b>Master data management</b> keeps that shared reference layer accurate and controlled.'},

  {q:'When a pharmacy system is unavailable and a prescription must be supplied urgently, the pharmacist should:',
   o:[
      'Follow the documented downtime procedure, supply safely with manual verification and documentation, and back-enter the record once the system is restored',
      'Supply without any record at all',
      'Ask the patient to return the following week','Refuse to supply anything until the system returns'],c:0,
   e:'Neither refusing care nor abandoning documentation is acceptable. The <b>downtime procedure</b> exists precisely for this: verify manually, document on the contingency form, and reconcile into the system afterwards.'},

  {q:'The main reason pharmacy systems use standard drug coding systems rather than free-text drug names is that:',
   o:['Codes are shorter to type',
      'Coded entries allow reliable interaction checking, analytics and data exchange, which free text cannot support',
      'Free text is not permitted by law',
      'Codes look more professional'],c:1,
   e:'A free-text entry cannot be matched reliably against an interaction database or aggregated for analysis. <b>Coded terminology</b> is what makes decision support and interoperability possible at all.'}
  ]},

  /* ============================================================
     UNIT 3 — Ethics, Regulation & Data Protection
     ============================================================ */
  {n:3, t:'Ethics, Regulation & Data Protection in Digital Pharmacy', hrs:7.5, qs:[

  {q:'The Pharmacy Council of India is the statutory body responsible for:',
   o:['Running all government hospitals','Setting the retail price of all medicines',
      'Regulating pharmacy education and the registration and professional conduct of pharmacists',
      'Manufacturing generic medicines'],c:2,
   e:'The <b>PCI</b> is constituted under the Pharmacy Act and governs pharmacy education standards, registration of pharmacists and professional conduct — including the Pharmacy Practice Regulations.'},

  {q:'Under the Pharmacy Practice Regulations, a pharmacist’s duty of confidentiality regarding patient information:',
   o:[
      'Ends as soon as the patient leaves the pharmacy',
      'Applies only to information marked confidential','Applies only to paper records',
      'Applies to information in any form, including electronic records, and continues after the professional relationship ends'],c:3,
   e:'Confidentiality is <b>format-independent and enduring</b>. Moving records into an electronic system changes the safeguards required, not the obligation itself.'},

  {q:'A pharmacist discovers a colleague has looked up the medication record of a neighbour who is not their patient. This is:',
   o:[
      'A breach of confidentiality and of the principle that access must be justified by a legitimate care relationship',
      'Acceptable if nothing is disclosed to anyone',
      'Only a problem if the neighbour finds out','Acceptable, because the colleague is an authorised system user'],c:0,
   e:'Having a login authorises access <b>for a legitimate purpose</b>, not to any record at will. Unjustified access is a disciplinary and legal matter even where nothing is disclosed — which is exactly why audit trails record every view.'},

  {q:'Which of the following best defines a “medication error”?',
   o:['Any adverse reaction to a correctly prescribed medicine',
      'Any preventable event that may cause or lead to inappropriate medication use or patient harm while the medication is under the control of a professional or patient',
      'Only errors that reach the patient','Only errors made by pharmacists'],c:1,
   e:'The definition turns on <b>preventability</b> and includes errors intercepted before reaching the patient. An unavoidable adverse drug reaction to a correctly used medicine is not an error.'},

  {q:'“Look-alike, sound-alike” (LASA) medicines are managed by measures such as:',
   o:[
      'Relying on staff to be careful','Storing them next to each other for convenience',
      'Tall Man lettering, physical separation, and alerts at selection in the dispensing system',
      'Removing them from the formulary entirely'],c:2,
   e:'LASA errors are a design problem, not a carelessness problem. The effective controls are <b>structural</b>: Tall Man lettering to make names visually distinct, separated storage, and system alerts at the point of selection.'},

  {q:'A “high-alert medication” is one that:',
   o:[
      'Must be stored in a refrigerator',
      'Has an unpleasant taste','Is expensive',
      'Carries a heightened risk of significant patient harm when used in error'],c:3,
   e:'High-alert medicines — anticoagulants, insulin, concentrated electrolytes, opioids among them — are not necessarily more error-prone, but <b>the consequences of an error are far more serious</b>, so they warrant independent double checks and additional safeguards.'},

  {q:'What is the purpose of an independent double check for high-risk medicines?',
   o:[
      'To have a second practitioner verify the preparation independently, so that an error made by the first is more likely to be detected',
      'To slow down the dispensing process deliberately',
      'To satisfy the manufacturer','To share the blame if something goes wrong'],c:0,
   e:'The check must be <b>independent</b> — the second person verifies from the original order without being told the first person’s conclusion. A check that simply confirms what the first person says adds almost nothing.'},

  {q:'In an effective patient-safety culture, the response to a reported error should primarily be to:',
   o:['Identify and discipline the individual responsible',
      'Examine the system factors that allowed the error and address them, while maintaining accountability for reckless behaviour',
      'Ignore it if no harm occurred',
      'Record it without any analysis'],c:1,
   e:'A <b>just culture</b> distinguishes human error and at-risk behaviour, which call for system redesign and coaching, from reckless behaviour, which warrants accountability. Punishing honest error simply stops errors being reported.'},

  {q:'Under India’s Digital Personal Data Protection Act, 2023, an organisation that determines the purpose and means of processing personal data is called the:',
   o:['Data Auditor','Data Principal','Data Fiduciary','Data Processor'],c:2,
   e:'The Act uses <b>Data Fiduciary</b> for the entity determining purpose and means, and <b>Data Principal</b> for the individual the data relates to — terminology that deliberately emphasises the duty of care owed to the individual.'},

  {q:'Under the same Act, the individual whose personal data is being processed is the:',
   o:['Data Processor','Consent Manager','Data Fiduciary','Data Principal'],c:3,
   e:'The <b>Data Principal</b> is the individual. The choice of the word “principal” signals that the data is handled on their behalf and in their interest.'},

  {q:'For consent to be valid for processing personal health data, it must be:',
   o:[
      'Free, specific, informed, unconditional and unambiguous, given by a clear affirmative action',
      'Obtained once and valid indefinitely for all purposes',
      'Given verbally to any staff member','Implied by the patient attending the pharmacy'],c:0,
   e:'Valid consent requires a <b>clear affirmative action</b> and must be specific to a stated purpose. Pre-ticked boxes, silence, or bundling unrelated purposes into a single acceptance do not constitute consent.'},

  {q:'The principle of “purpose limitation” means that personal data:',
   o:['Can be used for any purpose once collected',
      'May be used only for the specified purpose for which it was collected, unless further valid consent or a lawful basis exists',
      'Must be deleted immediately after use',
      'Can be shared freely within the healthcare sector'],c:1,
   e:'<b>Purpose limitation</b> prevents function creep — data gathered for dispensing being reused for marketing or research without a fresh lawful basis.'},

  {q:'“Data minimisation” requires that an organisation:',
   o:[
      'Minimise the number of staff with a login','Collect as much data as possible in case it is useful later',
      'Collect only the personal data that is necessary for the stated purpose',
      'Store data in the smallest possible file format'],c:2,
   e:'<b>Data minimisation</b> concerns how much is collected, not how it is stored. Data never collected cannot be breached, misused or lost — it is the most reliable protection available.'},

  {q:'Which is the correct distinction between anonymised and pseudonymised data?',
   o:[
      'Pseudonymised data can never be re-identified',
      'Anonymised data is simply data with the name field deleted','They are the same thing',
      'Anonymised data cannot be linked back to an individual by any reasonable means; pseudonymised data can be re-identified using a separately held key and therefore remains personal data'],c:3,
   e:'Because <b>pseudonymised</b> data can be re-identified via the key, it stays within the scope of data protection law. Genuine <b>anonymisation</b> is a high bar — removing the name alone rarely achieves it, since combinations of remaining fields can still identify a person.'},

  {q:'Role-based access control in a pharmacy system means that:',
   o:[
      'Each user is granted the minimum access their professional role requires',
      'Only the head pharmacist may use the system',
      'Access is granted according to length of service','Everyone shares one login for efficiency'],c:0,
   e:'<b>RBAC</b> implements the principle of least privilege — access matched to role. Shared logins destroy both access control and the audit trail, since actions can no longer be attributed to a person.'},

  {q:'The single most effective technical control against unauthorised account access is:',
   o:['Changing passwords every week',
      'Multi-factor authentication',
      'Writing passwords in a secure notebook',
      'Using the same strong password across all systems'],c:1,
   e:'<b>Multi-factor authentication</b> means a stolen password alone is not enough. Forced frequent rotation is now discouraged as it drives weaker, predictable passwords, and password reuse means one breach compromises every system.'},

  {q:'A phishing attack in a hospital setting typically involves:',
   o:[
      'A hardware manufacturing defect','Physically breaking into the pharmacy',
      'A deceptive message designed to trick a user into revealing credentials or opening malicious content',
      'A power failure'],c:2,
   e:'<b>Phishing</b> attacks the user rather than the technology, which is why it defeats technical controls so often. Staff awareness and verification of unexpected requests are the primary defences.'},

  {q:'Ransomware poses a particular danger to hospital pharmacy because it:',
   o:[
      'Only affects financial records',
      'Can always be resolved by restarting the computer','Slightly slows down printing',
      'Encrypts systems and data, potentially making medication records and dispensing systems unavailable and directly threatening patient care'],c:3,
   e:'The clinical risk is <b>loss of availability</b>. Tested offline backups and rehearsed downtime procedures are what preserve patient safety when systems go dark.'},

  {q:'Encryption “at rest” protects data:',
   o:[
      'While it is stored on disks, servers or backup media',
      'Only while the user is logged in',
      'Only when the computer is switched off','While it is being transmitted across a network'],c:0,
   e:'Encryption <b>at rest</b> protects stored data — including stolen laptops and backup media. Encryption <b>in transit</b> protects data moving across networks. Both are needed.'},

  {q:'The ALCOA+ principles of data integrity require that data be:',
   o:['Anonymous, Legal, Coded, Original, Approved',
      'Attributable, Legible, Contemporaneous, Original and Accurate, plus complete, consistent, enduring and available',
      'Accessible, Local, Cheap, Open, Automated',
      'Audited, Licensed, Certified, Owned, Archived'],c:1,
   e:'<b>ALCOA+</b> is the international benchmark for data integrity in regulated environments. Each element answers a specific question an inspector will ask about a record.'},

  {q:'In ALCOA+, “contemporaneous” means that a record must be:',
   o:[
      'Reviewed within thirty days','Written by a contemporary of the patient',
      'Made at the time the activity was performed, not reconstructed afterwards',
      'Stored on modern equipment'],c:2,
   e:'Recording <b>at the time</b> is what makes a record reliable evidence. Retrospective completion, however honest, cannot be verified and is a common inspection finding.'},

  {q:'An audit trail in pharmacy software must record:',
   o:[
      'Only the actions of junior staff',
      'Only changes made after midnight','Only successful transactions',
      'Who did what, to which record, when, and what the previous value was — securely and without the ability to alter it'],c:3,
   e:'A meaningful audit trail is <b>complete, attributable and tamper-evident</b>, and preserves the original value. An audit trail that can be edited by users proves nothing at all.'},

  {q:'When a data entry error is discovered in an electronic pharmacy record, the correct action is to:',
   o:[
      'Amend the record through the system’s correction function, so that the original entry, the correction, the reason, the user and the time all remain visible',
      'Overwrite the value without comment',
      'Leave the error and note it verbally to a colleague','Delete the entry so the record is clean'],c:0,
   e:'The original entry must <b>remain visible</b> — this is the electronic equivalent of a single line strike-through with initials and date. Deleting or overwriting destroys the audit trail and breaches data integrity requirements.'},

  {q:'An electronic signature in a regulated pharmacy system must be:',
   o:['A scanned image of a handwritten signature pasted into the document',
      'Uniquely attributable to one individual, under their sole control, and permanently linked to the record signed',
      'Shared within the department for convenience',
      'Optional if the user is trusted'],c:1,
   e:'An electronic signature must be <b>uniquely attributable, under sole control and permanently bound</b> to the signed record. A pasted image satisfies none of these and can be copied by anyone.'},

  {q:'A pharmacy is asked by a patient’s employer to confirm which medicines the patient collects. The pharmacist should:',
   o:[
      'Ask a colleague to disclose it instead','Provide the information, since the employer has a legitimate interest',
      'Decline to disclose without the patient’s valid consent or another lawful basis, and document the request',
      'Provide only the names of the medicines but not the doses'],c:2,
   e:'An employer has <b>no lawful basis</b> for access to a patient’s medication record. Partial disclosure is still disclosure. The correct action is to decline, document the request, and direct the employer to seek the patient’s own consent.'}
  ]},

  /* ============================================================
     UNIT 4 — Computer Applications & Digital Documentation
     ============================================================ */
  {n:4, t:'Computer Applications & Digital Documentation', hrs:7.5, qs:[

  {q:'The principal patient-safety advantage of an electronic prescription over a handwritten one is that it:',
   o:[
      'Is faster for the prescriber in every case',
      'Cannot ever contain an error','Uses less paper',
      'Eliminates illegibility and transcription steps, and allows automated checking of dose, interactions and allergies at the point of prescribing'],c:3,
   e:'E-prescribing removes <b>illegibility and transcription</b> as error sources and enables decision support at the moment of ordering. It does not eliminate error — it substitutes new failure modes such as selection from a drop-down list.'},

  {q:'A “wrong-patient” error in electronic prescribing most commonly occurs when:',
   o:[
      'The prescriber has several patient records open and enters the order in the wrong one',
      'The medicine is out of stock',
      'The pharmacy closes early','The printer runs out of paper'],c:0,
   e:'Multiple open records is the classic mechanism. Controls include limiting simultaneously open charts, displaying patient identifiers prominently, and confirmation prompts on high-risk orders.'},

  {q:'A prescriber intends to select “Dopamine” from a drop-down list and selects “Dobutamine”, immediately above it. This is an example of:',
   o:['A transcription error','A juxtaposition or selection error inherent to list-based interfaces',
      'A dispensing error','A patient compliance error'],c:1,
   e:'<b>Juxtaposition errors</b> are created by the interface itself — adjacent similar entries in a picking list. Tall Man lettering, requiring more characters before the list appears, and confirmation of high-risk selections all mitigate it.'},

  {q:'Which is a mandatory element of a legally valid electronic prescription?',
   o:[
      'The pharmacy’s bank account number','The prescriber’s photograph',
      'Identification of the prescriber with a valid electronic signature, patient identification, and the medicine, strength, dose, quantity and directions',
      'The patient’s employment details'],c:2,
   e:'A prescription is a legal document. Its validity rests on <b>identification of prescriber and patient, an attributable signature, and unambiguous medicine details</b> — the medium does not alter these requirements.'},

  {q:'Clinical decision support integrated into electronic prescribing is most effective when alerts are:',
   o:[
      'Displayed only after the order has been sent',
      'Disabled to save time','Generated for every possible interaction regardless of severity',
      'Targeted and severity-stratified, so that the alerts that appear are the ones that warrant action'],c:3,
   e:'Specificity is what makes decision support work. Firing every possible alert produces <b>alert fatigue</b>, and the critical warning is then dismissed with the rest.'},

  {q:'Medication reconciliation is best defined as:',
   o:[
      'Formally comparing the medicines a patient is actually taking with those newly prescribed, and resolving any discrepancies, at every transition of care',
      'Counting stock at the end of the month',
      'Reconciling two different brands of the same drug','Balancing the pharmacy accounts'],c:0,
   e:'<b>Reconciliation</b> is a structured comparison at admission, transfer and discharge — the points where medication information is most often lost or duplicated, and where a large share of preventable harm originates.'},

  {q:'What does the SOAP format structure in pharmacy documentation?',
   o:['Stock, Order, Availability, Price',
      'Subjective, Objective, Assessment, Plan',
      'Safety, Outcome, Audit, Protocol',
      'Supply, Origin, Approval, Payment'],c:1,
   e:'<b>SOAP</b> separates what the patient reports (subjective) from measurable findings (objective), then the clinician’s interpretation (assessment) and the intended action (plan). Keeping these apart is what makes a note auditable.'},

  {q:'A pharmacist’s clinical intervention note should always record:',
   o:[
      'Only the time the call was made','Only the recommendation made',
      'The problem identified, the evidence for it, the recommendation, to whom it was communicated, the outcome, and the monitoring required',
      'Only the name of the doctor contacted'],c:2,
   e:'A complete intervention note allows another professional to <b>act on it without speaking to you</b>. A recommendation with no problem statement, no evidence and no outcome cannot be followed up or audited.'},

  {q:'When documenting in an electronic patient record, the pharmacist should:',
   o:[
      'Include personal opinions about the prescriber',
      'Copy forward previous notes without review','Use informal abbreviations to save time',
      'Write factually and objectively, avoiding ambiguous abbreviations, and record only what can be substantiated'],c:3,
   e:'Records are legal documents readable by patients and courts. Ambiguous abbreviations cause error — “U” for units being a well-known example — and uncritically <b>copying forward</b> propagates outdated information as if it were current.'},

  {q:'Why are certain abbreviations placed on a “do not use” list?',
   o:[
      'They have been repeatedly misread in ways that caused patient harm, such as “U” read as a zero or “QD” read as “QID”',
      'They are too long','They are not in English','They are difficult to spell'],c:0,
   e:'The list is <b>evidence-based</b>, built from actual harm. Writing “units” in full, and “daily” instead of QD, removes the ambiguity at source.'},

  {q:'A discharge medication summary given to the patient should primarily:',
   o:['List the hospital’s charges',
      'State clearly what medicines to take, what has changed and why, and what follow-up or monitoring is needed',
      'Contain the full clinical notes of the admission',
      'List all medicines ever prescribed'],c:1,
   e:'The discharge summary is a <b>handover</b> to the patient and to primary care. What changed and why is the part most often omitted and most often needed — without it, community teams frequently reinstate stopped medicines.'},

  {q:'A key requirement when a pharmacy generates a regulatory report from its software is that the data must be:',
   o:[
      'Approved by the software vendor','Formatted attractively',
      'Complete, accurate and traceable to the underlying source records',
      'Summarised so that details are hidden'],c:2,
   e:'Any regulatory submission must be <b>traceable back to source</b>. A figure that cannot be reproduced from the underlying records is not verifiable, and an inspector will treat it as unsupported.'},

  {q:'In pharmacy billing systems, the main control preventing revenue and inventory discrepancies is:',
   o:[
      'Increasing prices',
      'Reducing the number of transactions','Weekly staff meetings',
      'Reconciliation of dispensed quantities against billed quantities and stock movements'],c:3,
   e:'<b>Three-way reconciliation</b> — dispensed, billed, and stock movement — is what surfaces both error and diversion. Any one of the three alone can look entirely normal.'},

  {q:'Which describes a valid approach to retention of electronic pharmacy records?',
   o:[
      'Retain records for the period required by law and professional regulation, in a form that remains readable and retrievable throughout',
      'Retain everything forever regardless of any policy',
      'Retention is at the discretion of individual staff','Delete records as soon as the patient is discharged'],c:0,
   e:'Retention must satisfy the <b>statutory period</b>, and — a point often missed — the record must remain <b>readable</b> for that whole period. Obsolete file formats and unsupported systems are a genuine long-term risk.'},

  {q:'A good pharmacy dashboard for a hospital pharmacy manager would prioritise:',
   o:['Every data field the system can produce',
      'A small set of actionable indicators such as pending verifications, stock-outs, overdue interventions and expiring stock',
      'Historical data from ten years ago only',
      'Decorative charts with no numbers'],c:1,
   e:'A dashboard should answer “what needs my attention now?”. <b>Actionable, current indicators</b> earn their place; everything else belongs in a report that is run when needed.'},

  {q:'In user interface design for clinical software, the concept of a “forcing function” means:',
   o:[
      'Making the font size larger','Forcing staff to work faster',
      'Designing the interface so that an unsafe action cannot be completed without the required step being taken',
      'Requiring users to change passwords'],c:2,
   e:'A <b>forcing function</b> makes the unsafe path structurally impossible — for example, requiring an indication before a high-risk medicine can be ordered. Design constraints outperform reminders, which can always be ignored.'},

  {q:'Why is the default setting in a clinical software field a patient-safety issue?',
   o:[
      'Defaults slow the system down',
      'Defaults are prohibited by regulation','Defaults make the screen look untidy',
      'Most users accept defaults, so an inappropriate default becomes the most frequently chosen option'],c:3,
   e:'Defaults are powerful precisely because they are passive. A default dose, route or duration that is wrong for the common case will be accepted repeatedly — which is why defaults must be clinically reviewed, not set for convenience.'},

  {q:'What is the purpose of user acceptance testing before new pharmacy software goes live?',
   o:[
      'To have the people who will actually use the system confirm it supports their real workflows correctly and safely',
      'To check the colour scheme',
      'To satisfy the finance department','To let the vendor demonstrate the product’s features'],c:0,
   e:'<b>UAT</b> is carried out by end users against real workflows, including edge cases and downtime scenarios. Technical correctness in a vendor demonstration says nothing about whether the system works on a busy ward round.'},

  {q:'When a pharmacy system generates an automatic report of dispensing errors, the pharmacist should regard it as:',
   o:['A definitive and complete account of all errors',
      'A useful but incomplete picture, since only reported and detectable events are captured',
      'Irrelevant to practice',
      'Confidential and never to be reviewed'],c:1,
   e:'Any error report reflects <b>what was reported and detectable</b>, never the true incidence. Under-reporting is universal, so a fall in reported errors may reflect reporting behaviour rather than improved safety.'},

  {q:'Which practice best protects data quality at the point of entry?',
   o:[
      'Letting each user choose their own format','Allowing free-text entry everywhere for flexibility',
      'Using structured fields with validation rules and controlled vocabularies where the data will be reused or analysed',
      'Entering data at the end of the shift from memory'],c:2,
   e:'Validation at entry prevents impossible values and inconsistent formats. Free text has its place for narrative, but data that will be <b>reused, checked or analysed</b> must be structured and coded.'},

  {q:'Version control of pharmacy standard operating procedures in a digital system ensures that:',
   o:[
      'Every member of staff can edit the document freely',
      'Documents never need review','Older versions are permanently deleted',
      'Only the current approved version is in use, while superseded versions remain retrievable for audit'],c:3,
   e:'Two requirements operate at once: staff must be unable to work from a superseded version, yet the <b>historical version must remain retrievable</b> to show what procedure applied on a given past date.'},

  {q:'A pharmacy uses a spreadsheet to track controlled drug balances. The main data-integrity weakness of this approach is that:',
   o:[
      'Entries can be altered without an audit trail, so changes cannot be attributed or detected',
      'Spreadsheets cannot be printed',
      'Spreadsheets require an internet connection','Spreadsheets cannot perform arithmetic'],c:0,
   e:'The fatal weakness is the absence of a <b>tamper-evident audit trail</b>. A validated system records who changed what and when; an ordinary spreadsheet allows silent alteration of any cell.'},

  {q:'Before adopting a new digital documentation tool, the most important question for a pharmacist to ask is:',
   o:['Does it have the newest visual design?',
      'Does it support safe, complete, attributable documentation and integrate with the systems we already use?',
      'Is it the cheapest available?',
      'Does it have the most features?'],c:1,
   e:'Tools are judged by whether they support <b>safe practice and integrate</b> with existing systems. A feature-rich tool that fragments the record or cannot attribute entries makes documentation less reliable, not more.'},

  {q:'A pharmacist notices the electronic system has auto-populated a dose that differs from the prescriber’s written intention. The correct action is to:',
   o:[
      'Dispense the lower of the two doses','Dispense according to the system, since it is validated',
      'Stop, verify against the original order and the patient’s clinical details, and resolve the discrepancy with the prescriber before dispensing',
      'Change the prescriber’s order to match the system'],c:2,
   e:'A validated system is still only as reliable as its configuration and its inputs. Any discrepancy between the system and the clinical intention must be <b>resolved with the prescriber</b>, never silently reconciled by the pharmacist.'},

  {q:'Which statement best reflects professional accountability when using pharmacy software?',
   o:[
      'Accountability rests with whoever installed the system',
      'Accountability applies only to manual processes','If the software approved it, responsibility passes to the vendor',
      'The pharmacist remains professionally accountable for the decision, and must exercise judgement over what the system suggests'],c:3,
   e:'Software is a <b>tool supporting</b> professional practice. It does not hold a registration and cannot be accountable to a regulator or a patient. The pharmacist who acts on its output owns that decision.'}
  ]}

  ]
};
