/* alizon-book-m1.js — Module 1 textbook, full text.
   Self-registers for the lazy loader in alizon-textbook-content.js.
   Written to cover the Module 1 examination syllabus (4 units × 25 MCQs) and to
   support the Module 1 practicals: AI Drug Discovery, Research Ethics Lab and
   RxDetect. Edit freely. */
(function(){
(window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m1 = {
 meta:{module:'1', title:'AI Foundations & Digital Systems for Pharmacy Practice',
       sub:'A Practice-Based Introduction', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
/* ============================== UNIT 1 ============================== */
'@chapter Foundations of Artificial Intelligence in Pharmacy\n\n'+

'@objectives\n'+
'- Define artificial intelligence, machine learning and deep learning, and state how they are related\n'+
'- Distinguish supervised, unsupervised and reinforcement learning, with a pharmacy example of each\n'+
'- Explain overfitting, and why data is split into training, validation and test sets\n'+
'- Describe how AI is applied across drug discovery, formulation, manufacture and pharmacovigilance\n'+
'- Interpret accuracy, sensitivity, specificity and precision, and say when each misleads\n'+
'- Recognise algorithmic bias, explain how it arises, and state the professional position on AI output\n\n'+

'@section What artificial intelligence means\n\n'+
'Artificial intelligence is the branch of computing concerned with machines that carry out tasks '+
'which would ordinarily require human judgement. In pharmacy the term stretches a long way — from a '+
'rule that flags a duplicate prescription, to a model that predicts which patients are most likely '+
'to be readmitted after discharge.\n\n'+
'The three terms you will meet most often sit inside one another. **Artificial intelligence** is the '+
'whole field. **Machine learning** is the part of AI in which the rules are not written by a person '+
'but inferred from data. **Deep learning** is a part of machine learning that uses neural networks '+
'with many layers. Every deep learning system is machine learning, and every machine learning system '+
'is artificial intelligence — but not the other way round.\n\n'+
'@diagram pyramid Artificial intelligence > Machine learning > Deep learning | The three terms are nested, not alternatives\n\n'+
'It also helps to separate **automation** from **intelligence**. A dispensing robot that counts '+
'tablets is automation: it repeats a fixed action faultlessly and does the same thing every time. A '+
'system that learns which prescriptions your team most often queries, and moves those to the top of '+
'the worklist, is doing something different — it is adapting to the case in front of it.\n\n'+
'@diagram compare Automation | Intelligence ; Repeats a fixed action | Adapts to the case ; Rules written by people | Patterns learned from data ; Fails predictably | May fail silently\n\n'+

'@know Did you know?\n'+
'MYCIN, built at Stanford in the early 1970s, could recommend antibiotics for blood infections and '+
'in trials often matched specialist physicians. It was never used on a real patient — the ethical '+
'and legal questions of the day had no settled answers. Those same questions are still with us.\n\n'+

'@section How machines learn\n\n'+
'@subsection Supervised learning\n\n'+
'In **supervised learning** the model is shown examples that already carry the answer. Each '+
'prescription in the training set is labelled *appropriate* or *inappropriate*; each patient record '+
'is labelled *readmitted* or *not readmitted*. The model learns a mapping from the input to that '+
'label, and is then asked to apply it to cases it has never seen. Almost every clinical prediction '+
'tool you will meet is supervised.\n\n'+
'@subsection Unsupervised learning\n\n'+
'In **unsupervised learning** there are no labels. The model is given the data and asked to find '+
'structure in it. An algorithm that groups fifty thousand medication records into clusters of '+
'similar prescribing patterns is doing unsupervised learning — nobody told it what the groups should '+
'be, and the groups it finds may or may not be clinically meaningful. This is why the output of '+
'clustering is a hypothesis to investigate, not a finding.\n\n'+
'@subsection Reinforcement learning\n\n'+
'In **reinforcement learning** an agent learns by acting and receiving feedback — a reward when the '+
'outcome is good, a penalty when it is not. It is rare in direct clinical use, for an obvious '+
'reason: the trials happen on someone. It appears more often in operational settings such as '+
'optimising stock ordering, where a poor decision costs money rather than health.\n\n'+
'@diagram compare Supervised | Unsupervised ; Labelled examples | No labels ; Predicts a known target | Finds structure ; Readmission risk | Prescribing-pattern clusters\n\n'+

'@section Overfitting and honest evaluation\n\n'+
'A model that **overfits** has learned the noise in its training data as though it were signal. It '+
'performs superbly on the examples it was trained on and poorly on anything new, because it has '+
'memorised rather than generalised. Overfitting is the single most common reason a model that looked '+
'impressive in development disappoints in practice.\n\n'+
'The defence is to keep some data away from the model and use it only to judge performance. '+
'Conventionally the data is divided three ways.\n\n'+
'@table Why three sets, not two\n'+
'Set | Used for | Why it must be separate\n'+
'Training | Fitting the model | The model sees this and learns from it\n'+
'Validation | Tuning choices — which model, which settings | Tuning on the test set would leak information into it\n'+
'Test | The final, reported performance | Touched once, at the end, so the figure is honest\n\n'+
'@caution\n'+
'Performance measured on the training data is meaningless. If a published claim does not state which '+
'data the figure came from, treat the claim as unsupported until it does.\n\n'+

'@section Reading performance figures\n\n'+
'A single number rarely tells you what you need. Consider a screening model that reports **99% '+
'accuracy** for a condition affecting one per cent of patients. A model that simply answers "no" to '+
'every case achieves exactly that accuracy and finds nobody. Accuracy is close to useless whenever '+
'the outcome is rare.\n\n'+
'@table What each measure tells you, and what it hides\n'+
'Measure | Definition | What it hides\n'+
'Accuracy | Proportion of all cases classified correctly | Collapses when classes are imbalanced\n'+
'Sensitivity | Of those who have the condition, the proportion found | Says nothing about false alarms\n'+
'Specificity | Of those without it, the proportion correctly cleared | Says nothing about missed cases\n'+
'Precision | Of those flagged, the proportion that were real | Falls sharply when the condition is rare\n'+
'AUC | Ability to rank cases across all thresholds | Says nothing about calibration\n\n'+
'@note\n'+
'Sensitivity and specificity trade against each other. Moving the threshold to catch more true cases '+
'always admits more false ones. The right balance is a clinical decision about which error is worse '+
'here — not a property of the model.\n\n'+

'@section Where AI is used across the medicines lifecycle\n\n'+
'@subsection Discovery and design\n\n'+
'A **QSAR** model — quantitative structure–activity relationship — relates the chemical structure of '+
'a compound to its biological activity, allowing activity to be predicted before synthesis. '+
'**In silico ADMET prediction** estimates absorption, distribution, metabolism, excretion and '+
'toxicity computationally. Its value is chiefly that it removes hopeless candidates early, when '+
'discarding them is cheap, rather than after months of laboratory work.\n\n'+
'**AlphaFold** is best known for predicting the three-dimensional structure of proteins from their '+
'amino-acid sequence with accuracy approaching experimental methods. This removed a bottleneck that '+
'had stood for half a century, making structures available for targets nobody had ever crystallised.\n\n'+
'@subsection Formulation and manufacture\n\n'+
'In formulation development, machine learning is most usefully applied to predicting how the '+
'variables you control — excipient choice and ratios, compression force, granulation conditions — '+
'affect the properties you care about, so that fewer physical batches are needed to find a workable '+
'formulation.\n\n'+
'**Quality by Design (QbD)** means building quality into the product by understanding and '+
'controlling the process, rather than relying on testing the finished article to detect failures. '+
'The distinction matters: testing detects a bad batch, design prevents one. AI supports QbD by '+
'modelling the relationship between process parameters and product quality.\n\n'+
'Applied to **stability studies**, AI is chiefly used to predict shelf life and degradation '+
'behaviour from early or accelerated data, shortening the time before a sensible expiry date can be '+
'proposed.\n\n'+
'@subsection Pharmacovigilance\n\n'+
'**Signal detection** means identifying information suggesting a new or changed causal association '+
'between a medicine and an adverse event — something worth investigating, not something proven. '+
'**Disproportionality analysis** finds these by comparing how often a particular drug–event pair is '+
'reported against how often that event is reported for all drugs. A pair reported far more than '+
'expected is a signal.\n\n'+
'**Natural language processing** matters here because so much safety-relevant information is written '+
'as free text — case narratives, discharge letters, clinical notes — which no database query can '+
'search. NLP makes that text searchable at scale.\n\n'+
'@diagram flow Discovery > Formulation > Manufacture > Clinical use > Pharmacovigilance | AI contributes at every stage, in different ways\n\n'+

'@section Decision support at the point of care\n\n'+
'A **Clinical Decision Support System** presents patient-specific advice at the moment a decision is '+
'being made — checking a prescription against allergies, interactions, renal function and duplicate '+
'therapy, and raising an alert where something needs attention.\n\n'+
'**Alert fatigue** describes what happens when too many of those alerts are unimportant: clinicians '+
'learn to dismiss them without reading, including the few that matter. Override rates above eighty '+
'per cent are common, and they should be read as a fault in how the system is tuned rather than as '+
'carelessness in the people using it.\n\n'+
'@caution\n'+
'The severity label a system attaches to an alert is a generalisation made without knowing your '+
'patient. An alert badged "moderate" can be the most dangerous item in your queue — a moderate '+
'interaction in a patient who is already bleeding is not a moderate problem.\n\n'+

'@section When AI goes wrong\n\n'+
'@subsection Distribution shift\n\n'+
'The most important limitation of a model trained only on data from one hospital is that the '+
'patients, prescribing habits and recording conventions of another hospital differ — so performance '+
'that was excellent in development can degrade badly elsewhere. This is why external validation, on '+
'data from a different site, matters more than another decimal place of accuracy at home.\n\n'+
'@subsection Algorithmic bias\n\n'+
'**Algorithmic bias** most commonly arises not from the algorithm but from the training data: it '+
'reflects historical patterns of care, including inequitable ones. If a group was historically '+
'under-treated, a model trained on those records learns that such patients need less treatment, and '+
'reproduces the inequity while appearing objective.\n\n'+
'@subsection Explainability\n\n'+
'**Explainability** means being able to say why a model produced the output it did, in terms a '+
'clinician can evaluate. It matters because a recommendation you cannot interrogate is one you '+
'cannot safely disagree with — and disagreeing, when the patient in front of you is the exception, '+
'is the whole of professional judgement.\n\n'+
'@subsection Confabulation in generative tools\n\n'+
'A generative AI tool asked about a drug interaction may produce a plausible-looking reference that '+
'does not exist. The correct response is to verify the citation against the actual source before '+
'relying on any part of the answer. A fabricated reference is not a rare glitch; it is a predictable '+
'property of systems that generate fluent text rather than retrieve facts.\n\n'+
'@caution\n'+
'The professional position on AI output is settled and simple: the system proposes, the pharmacist '+
'disposes. AI output is an input to your decision, and accountability for the decision does not '+
'transfer to the software, its vendor, or the person who configured it.\n\n'+
'@subsection Neural networks for images\n\n'+
'A **convolutional neural network** is designed to work on grid-like data and is most suited to '+
'image tasks. In a pharmaceutical setting that means visual inspection — detecting defects in '+
'tablets, vials or packaging on a production line, where the task is to recognise a visual pattern '+
'rather than to reason about a patient.\n\n'+

'@activity Activity 1.1\n'+
'Ask two working pharmacists which parts of their day are already assisted by software. Write down '+
'which of those are automation and which involve any judgement. For each of the second kind, note '+
'what would happen if the software were quietly wrong for a week.\n\n'+
'@activity Activity 1.2\n'+
'Ask a generative AI tool for three references supporting a drug interaction you know well. Try to '+
'find each reference. Record how many exist, how many say what was claimed, and how confident the '+
'tool sounded in each case.\n\n'+

'@keyterms\n'+
'Artificial intelligence: computing concerned with tasks that would ordinarily need human judgement.\n'+
'Machine learning: an approach in which rules are inferred from data rather than written by hand.\n'+
'Deep learning: machine learning using neural networks with many layers.\n'+
'Supervised learning: learning a mapping from examples that carry the correct answer.\n'+
'Unsupervised learning: finding structure in data that carries no labels.\n'+
'Overfitting: fitting noise in the training data, so performance does not generalise.\n'+
'QSAR: a model relating chemical structure to biological activity.\n'+
'ADMET: absorption, distribution, metabolism, excretion and toxicity.\n'+
'Quality by Design: building quality in through process understanding rather than end testing.\n'+
'Signal: information suggesting a new or changed drug-event association, warranting investigation.\n'+
'Algorithmic bias: systematic unfairness in output, usually inherited from the training data.\n'+
'Explainability: being able to state why a model produced a particular output.\n\n'+

'@summary\n'+
'- AI, machine learning and deep learning are nested, not alternatives\n'+
'- Supervised learning predicts a labelled target; unsupervised finds structure; reinforcement learns from reward\n'+
'- Overfitting is defeated by honest evaluation on data the model has never seen\n'+
'- Accuracy misleads whenever the outcome is rare; sensitivity and specificity trade against each other\n'+
'- AI contributes across discovery, formulation, manufacture and pharmacovigilance in different ways\n'+
'- Bias usually enters through the data, not the algorithm\n'+
'- The system proposes and the pharmacist disposes; accountability does not transfer\n\n'+

'@exercise Exercises\n'+
'Q: State the relationship between artificial intelligence, machine learning and deep learning.\n'+
'Q: A model is trained on prescriptions already labelled appropriate or inappropriate. Name the type of learning and justify your answer.\n'+
'Q: Define overfitting and explain how a held-out test set detects it.\n'+
'Q: Why are three data splits used rather than two?\n'+
'Q: A screening model reports 99% accuracy for a condition affecting 1% of patients. Explain why this is unimpressive.\n'+
'Q: Define sensitivity and specificity, and explain why improving one usually worsens the other.\n'+
'Q: What does a QSAR model relate, and why is in silico ADMET prediction valuable?\n'+
'Q: Explain Quality by Design and contrast it with end-product testing.\n'+
'Q: Define signal detection and explain how disproportionality analysis generates a signal.\n'+
'Q: Why is natural language processing particularly useful in pharmacovigilance?\n'+
'Q: Explain how algorithmic bias arises and give a pharmacy example.\n'+
'Q: A generative tool supplies a plausible but non-existent reference. State the correct professional response.\n\n'+

/* ============================== UNIT 2 ============================== */
'@chapter Digital Pharmacy & Information Systems\n\n'+

'@objectives\n'+
'- Describe the purpose of a Pharmacy Information System and how it relates to the hospital system\n'+
'- Classify drug information sources as primary, secondary or tertiary and choose appropriately\n'+
'- Explain interoperability, and the role of HL7, FHIR and standard drug coding\n'+
'- Describe CPOE, eMAR and barcode medication administration and the errors each addresses\n'+
'- State the risks and controls when pharmacy data moves to the cloud\n'+
'- Explain backup, redundancy and downtime procedures\n\n'+

'@section The systems behind the counter\n\n'+
'A **Pharmacy Information System (PIS)** exists to manage the medicines-use process: recording and '+
'processing orders, maintaining dispensing records, controlling stock, and supporting the clinical '+
'checks a pharmacist makes. It is a specialised system, and in a hospital it is normally a component '+
'of, or interfaced to, the wider **Hospital Information System (HIS)**, which covers admissions, '+
'laboratory, radiology, billing and the clinical record.\n\n'+
'@diagram flow Prescriber > CPOE > Pharmacy system > Dispensing and stock > eMAR at the bedside | An order moving through the systems\n\n'+
'An **Electronic Health Record** is the longitudinal, digital record of a patient\'s health '+
'information, created and maintained across encounters and intended to be shared between authorised '+
'clinicians. It is not merely a store of documents; its value lies in being structured, current and '+
'available to whoever is caring for the patient now.\n\n'+

'@section Finding drug information\n\n'+
'Drug information sources are conventionally classified in three levels, and choosing the wrong '+
'level wastes time or produces the wrong answer.\n\n'+
'@table The three levels of drug information\n'+
'Level | What it is | Examples\n'+
'Primary | Original research reports | A clinical trial published in a journal\n'+
'Secondary | Indexes and abstracting services that point you to primary sources | Bibliographic databases\n'+
'Tertiary | Material that has digested and summarised the primary literature | Textbooks, formularies, compendia, reviews\n\n'+
'A tertiary source is where you begin: fast, organised and usually sufficient. Its main limitation is '+
'that it lags behind the current literature — writing, editing and publishing take time, so the '+
'newest findings are not yet in it. When the question concerns something recent, or something rare '+
'enough not to be covered, you must move back toward the primary literature.\n\n'+
'@note\n'+
'A hospital **digital formulary** answers a specific question: which medicines this institution has '+
'agreed to stock and use, and under what restrictions. It is not a clinical reference and it does '+
'not tell you whether a medicine is appropriate for your patient.\n\n'+
'For the severity grading and management of a suspected drug–drug interaction, a specialised '+
'interaction reference — a tertiary source built for that purpose — is the appropriate first stop.\n\n'+

'@section Interoperability\n\n'+
'**Interoperability** is the ability of separate systems to exchange information *and use it*. The '+
'second half matters: a system that receives a message it cannot interpret has achieved nothing. '+
'Where interoperability is absent, the pharmacist becomes the integration layer — re-keying data, '+
'reconciling lists by eye, and carrying in their head what the systems will not tell each other.\n\n'+
'@caution\n'+
'Every manual re-entry of data is an opportunity for a transcription error. When you evaluate a new '+
'system, count how many times a human must retype something the computer already knows.\n\n'+
'@table Standards that make exchange possible\n'+
'Standard | What it does\n'+
'HL7 | A family of messaging standards for exchanging clinical and administrative data\n'+
'FHIR | A modern HL7 standard using web technologies, designed for easier integration\n'+
'SNOMED CT | A clinical terminology for conditions, procedures and findings\n'+
'ICD | Classification of diseases, widely used for coding diagnoses\n'+
'GS1 barcodes | Identify product, batch and expiry at the point of scanning\n\n'+
'Pharmacy systems use **standard drug coding** rather than local names because a shared code means '+
'the same thing in every system it reaches. Without it, "paracetamol", "acetaminophen" and a local '+
'product number are three unrelated strings, and no automated check across systems is trustworthy.\n\n'+
'**Master data management** is the discipline of maintaining a single, authoritative, consistent set '+
'of core reference data — the drug catalogue, prescriber list, location list — so that every part of '+
'the system agrees on what exists and what it is called.\n\n'+

'@section Order entry, administration and verification\n\n'+
'**CPOE** stands for Computerised Provider Order Entry: the prescriber enters the order directly '+
'into the system rather than writing it. This removes illegibility and ambiguous abbreviations at '+
'source, and allows checks to run as the order is written.\n\n'+
'An **eMAR** — electronic Medication Administration Record — records and displays what has actually '+
'been given to the patient, when, and by whom. It is the administration counterpart to the '+
'prescription.\n\n'+
'**Barcode medication administration** improves safety principally by verifying, at the bedside, '+
'that the right medicine is being given to the right patient — the scan matches the product in hand '+
'against the order for the patient whose wristband was scanned.\n\n'+
'@diagram steps Order entered in CPOE > Screened by the pharmacy system > Verified by the pharmacist > Scanned at the bedside > Recorded in the eMAR | Each step closes a different gap\n\n'+
'@know Did you know?\n'+
'E-prescribing removed illegibility almost entirely and introduced **selection error** — the '+
'prescriber choosing the item above or below the intended one in a list. The total error rate falls; '+
'the *kind* of error changes. When a prescription looks clinically odd, consider that the wrong '+
'neighbour may have been clicked.\n\n'+

'@section Cloud, resilience and downtime\n\n'+
'In the **Software as a Service** model the application is hosted by a provider and reached over the '+
'network; the institution does not run the servers or install the software locally. The saving in '+
'local infrastructure is real, and so is the change in risk: patient data now sits with a third '+
'party, and a significant risk to be managed is loss of control over where that data resides, who '+
'can access it, and what happens if the relationship ends.\n\n'+
'@table Resilience concepts you must be able to define\n'+
'Concept | Meaning\n'+
'3-2-1 backup rule | Three copies of the data, on two different media, one of them off-site\n'+
'Data redundancy | Duplicating components or data so a single failure does not cause loss of service\n'+
'Downtime procedure | The agreed manual process for continuing safely when the system is unavailable\n\n'+
'@caution\n'+
'A backup that has never been restored is a hope, not a backup. The only evidence that a backup works '+
'is a restore that has actually been performed and checked.\n\n'+
'When the pharmacy system is unavailable and a prescription must still be supplied, the downtime '+
'procedure applies: supply is made and recorded manually against the agreed process, and every '+
'manual transaction is entered into the system once it returns. The dangerous failure is not the '+
'downtime itself but the gap left in the record afterwards.\n\n'+

'@section Structured data and dashboards\n\n'+
'**Structured data** is organised into defined fields with a defined format, so software can query '+
'and check it. Unstructured data — free text, scanned images, dictated notes — carries meaning for a '+
'human reader but cannot be reliably searched or checked by a machine. This is precisely why a '+
'scanned image of a prescription is not the same as an electronic prescription.\n\n'+
'A **pharmacy dashboard** is most useful when it presents a small number of measures that someone '+
'can act on, updated often enough to matter. A dashboard that reports everything is read by nobody.\n\n'+
'**Automated dispensing cabinets** on wards improve medication management chiefly by combining '+
'controlled, individually attributable access to medicines with an automatic record of every '+
'transaction — stock is available where it is needed without losing accountability for it.\n\n'+
'@note\n'+
'A single shared medication record across care settings is clinically justified because it removes '+
'the reconciliation gap at transitions of care, where most avoidable medication error occurs.\n\n'+

'@activity Activity 2.1\n'+
'Follow one prescription from arrival to hand-out in your placement pharmacy. List every system it '+
'passes through and every point where a human retypes information. Mark the riskiest step and say '+
'what would catch an error introduced there.\n\n'+
'@activity Activity 2.2\n'+
'Find your organisation\'s downtime procedure for the pharmacy system. Note what it says about '+
'recording supplies made while the system is down, and how those are reconciled afterwards.\n\n'+

'@keyterms\n'+
'Pharmacy Information System: the system managing orders, dispensing, stock and clinical checks.\n'+
'EHR: the longitudinal digital health record, shared between authorised clinicians.\n'+
'Tertiary source: material that has digested and summarised the primary literature.\n'+
'Interoperability: the ability of separate systems to exchange information and use it.\n'+
'FHIR: a modern HL7 standard for exchanging healthcare data using web technologies.\n'+
'CPOE: Computerised Provider Order Entry, where the prescriber enters the order directly.\n'+
'eMAR: the electronic record of medicines actually administered.\n'+
'Master data management: maintaining one authoritative set of core reference data.\n'+
'3-2-1 rule: three copies, two media, one off-site.\n'+
'Downtime procedure: the agreed safe manual process for when a system is unavailable.\n\n'+

'@summary\n'+
'- The PIS manages the medicines-use process and interfaces with the wider hospital system\n'+
'- Tertiary sources are the sensible starting point but lag the current literature\n'+
'- Interoperability requires shared standards; without them the pharmacist becomes the integration layer\n'+
'- CPOE, eMAR and barcode administration each close a different gap in the chain\n'+
'- Cloud hosting transfers infrastructure, not accountability for the data\n'+
'- A backup is only proven by a restore that has actually been performed\n\n'+

'@exercise Exercises\n'+
'Q: State the primary purpose of a Pharmacy Information System and its relationship to the HIS.\n'+
'Q: Classify a formulary, a clinical trial report and a bibliographic index as primary, secondary or tertiary.\n'+
'Q: What is the main limitation of tertiary drug information sources?\n'+
'Q: Define interoperability, and explain why exchange alone is not enough.\n'+
'Q: What do HL7 and FHIR do, and how do they differ?\n'+
'Q: Expand CPOE and eMAR and state which error each addresses.\n'+
'Q: What does barcode medication administration verify at the bedside?\n'+
'Q: State the 3-2-1 backup rule and explain why an untested backup is not a backup.\n'+
'Q: Define data redundancy and downtime procedures.\n'+
'Q: Explain why structured data can be checked by software when unstructured data cannot.\n'+
'Q: What is master data management, and what fails without it?\n'+
'Q: Give the clinical justification for a single shared medication record.\n\n'+

/* ============================== UNIT 3 ============================== */
'@chapter Ethics, Regulation & Data Protection in Digital Pharmacy\n\n'+

'@objectives\n'+
'- State the role of the Pharmacy Council of India and the pharmacist\'s duty of confidentiality\n'+
'- Define medication error and describe how errors and near misses should be handled\n'+
'- Apply the Digital Personal Data Protection Act, 2023 to pharmacy practice\n'+
'- Judge when consent is required, and what makes it valid\n'+
'- Respond correctly to a suspected personal data breach\n'+
'- Recognise the ethical issues specific to AI in patient care\n\n'+

'@section Professional regulation and the duty of confidence\n\n'+
'The **Pharmacy Council of India** is the statutory body responsible for regulating pharmacy '+
'education and practice — prescribing minimum standards of education, maintaining the register of '+
'pharmacists, and setting the standards of professional conduct expected of them.\n\n'+
'Under the Pharmacy Practice Regulations a pharmacist\'s **duty of confidentiality** is a continuing '+
'professional obligation. Information learned in the course of professional practice is not yours to '+
'use for any other purpose, and the duty does not lapse when the patient stops attending, nor when '+
'they die.\n\n'+
'@caution\n'+
'A colleague who looks up the medication record of a neighbour, a relative or a public figure out of '+
'curiosity has breached confidentiality even if they tell nobody what they saw. Access is logged, '+
'curiosity is not a lawful purpose, and the correct response is to raise it — not to overlook it '+
'because no harm appears to have followed.\n\n'+

'@section Medication error\n\n'+
'A **medication error** is any preventable event that may cause or lead to inappropriate medicine '+
'use or patient harm, while the medicine is in the control of a health professional, patient or '+
'consumer. Two parts of that definition are commonly missed: the event need only be *preventable* '+
'and *capable* of leading to harm — actual harm is not required for something to be an error.\n\n'+
'@diagram pyramid All errors > Errors reaching the patient > Errors causing harm > Serious harm | Most errors never reach a patient, and those are the ones you learn from cheaply\n\n'+
'@note\n'+
'Near misses are the most valuable safety data an organisation has, because they reveal the same '+
'system weaknesses at no cost to a patient. An organisation whose near-miss reporting is low is '+
'usually not safer; it is less willing to report.\n\n'+

'@section Data protection under the DPDP Act, 2023\n\n'+
'India\'s Digital Personal Data Protection Act, 2023 frames the relationship in terms of a **Data '+
'Fiduciary** — the organisation deciding the purpose and means of processing — and the **Data '+
'Principal**, the individual the data describes. The word *fiduciary* is deliberate: it implies a '+
'duty of trust, not merely a contract.\n\n'+
'@table Principles that shape day-to-day practice\n'+
'Principle | What it means at the counter\n'+
'Purpose limitation | Use the data for the care you collected it for, and nothing else\n'+
'Data minimisation | Collect only what that purpose actually requires\n'+
'Accuracy | Keep records correct, and correct them when told they are wrong\n'+
'Storage limitation | Do not keep records longer than there is a reason to\n'+
'Security safeguards | Protect data with measures proportionate to its sensitivity\n'+
'Accountability | Be able to demonstrate compliance, not merely assert it\n'+
'Breach notification | Report a personal data breach to the Board and to those affected\n\n'+
'@diagram pyramid Everything recorded > What you may access > What you need for this patient > What you may disclose | Access narrows as you move toward disclosure\n\n'+
'@subsection Consent\n\n'+
'Consent must be free, specific, informed, unconditional and unambiguous, given by a clear '+
'affirmative action, and it must be as easy to withdraw as it was to give. A pre-ticked box is not '+
'consent. A bundled agreement covering unrelated purposes is not specific.\n\n'+
'Consent is not required for everything. Processing necessary to provide the care the patient came '+
'for rests on a different footing from processing for marketing or research, and conflating the two '+
'leads either to asking permission you do not need or to proceeding where you do.\n\n'+

'@section When something goes wrong\n\n'+
'A **personal data breach** is any unauthorised processing, disclosure, acquisition, sharing, use, '+
'alteration, destruction or loss of access to personal data. It is not only a hacker: a prescription '+
'emailed to the wrong address, a screen left unlocked in a public area, a list of patients on a lost '+
'phone — each is a breach and each has a defined response.\n\n'+
'@diagram steps Contain the exposure > Assess what and whom > Notify as required > Support those affected > Fix the cause | The order matters: contain before you investigate\n\n'+
'@caution\n'+
'Containment comes first because harm is still accumulating while the exposure is open. An '+
'investigation that delays containment increases the number of people affected — and the '+
'investigation will still be there in ten minutes.\n\n'+
'A notification that is actually useful to a patient states four things plainly: what happened, what '+
'it means for them, what has been done, and what they can do. Everything else is padding.\n\n'+

'@section Ethics specific to AI\n\n'+
'Beyond confidentiality, AI raises questions older technology did not. Who is accountable when a '+
'model contributes to harm. Whether a patient should be told that software influenced a decision '+
'about their care. Whether a model that performs worse for one group than another may be deployed at '+
'all. Whether data collected for care may be reused to train a model without asking.\n\n'+
'@note\n'+
'None of these questions is answered by the software performing well. A model can be accurate and '+
'still be deployed unethically — for instance where patients were never told, or where the benefit '+
'accrues to the institution and the risk to the patient.\n\n'+

'@activity Activity 3.1\n'+
'Write the notification you would send to a patient whose dispensing history was emailed to the '+
'wrong person. Say what happened, what it means for them, what you have done, and what they can do. '+
'Keep it under 200 words and free of jargon.\n\n'+
'@activity Activity 3.2\n'+
'List every place in your placement pharmacy where patient-identifiable information can be seen by '+
'someone who does not need it — screens, printouts, labels, bags, conversations. Propose the '+
'smallest change that would fix the worst of them.\n\n'+

'@keyterms\n'+
'Pharmacy Council of India: the statutory body regulating pharmacy education and practice.\n'+
'Medication error: a preventable event that may cause or lead to inappropriate use or harm.\n'+
'Near miss: an error caught before it reached the patient.\n'+
'Data Fiduciary: the organisation determining the purpose and means of processing.\n'+
'Data Principal: the individual the personal data relates to.\n'+
'Purpose limitation: using data only for the purpose it was collected for.\n'+
'Personal data breach: unauthorised processing, disclosure, loss or alteration of personal data.\n\n'+

'@summary\n'+
'- The PCI regulates pharmacy education, registration and professional conduct\n'+
'- An error need only be preventable and capable of harm; actual harm is not required\n'+
'- Near misses are the cheapest safety lessons an organisation will ever get\n'+
'- The DPDP Act frames the pharmacy as a fiduciary — a relationship of trust\n'+
'- Purpose limitation and minimisation are the two principles you will apply most often\n'+
'- Contain a breach first, then assess, notify and fix the cause\n\n'+

'@exercise Exercises\n'+
'Q: State the statutory responsibilities of the Pharmacy Council of India.\n'+
'Q: Define medication error and explain why actual harm is not part of the definition.\n'+
'Q: Why are near misses considered valuable safety data?\n'+
'Q: Distinguish a Data Fiduciary from a Data Principal, with a pharmacy example of each.\n'+
'Q: List four requirements for consent to be valid under the DPDP Act.\n'+
'Q: A colleague looks up a celebrity\'s record out of curiosity. Is this a breach? Justify your answer.\n'+
'Q: Why must containment precede investigation when a breach is discovered?\n'+
'Q: State the four things a useful breach notification tells a patient.\n'+
'Q: Give two examples of data minimisation in a community pharmacy.\n'+
'Q: Name two ethical questions raised by AI that accuracy alone does not answer.\n\n'+

/* ============================== UNIT 4 ============================== */
'@chapter Computer Applications & Digital Documentation\n\n'+

'@objectives\n'+
'- Produce accurate, auditable pharmacy records in standard software\n'+
'- Apply the ALCOA+ principles to any record you create\n'+
'- Use spreadsheets safely for stock and dispensing data\n'+
'- Explain audit trails, version control and electronic signatures\n'+
'- Present pharmacy data so that it supports a decision\n\n'+

'@section What makes a record trustworthy\n\n'+
'A pharmacy record is not a note to yourself. It is evidence — of what was supplied, by whom, to '+
'whom, and when — and it may be read years later by someone investigating an incident. The **ALCOA+** '+
'principles describe what a trustworthy record looks like, and they apply as much to a spreadsheet '+
'as to a validated system.\n\n'+
'@table The ALCOA+ principles\n'+
'Principle | Meaning\n'+
'Attributable | You can tell who made the entry\n'+
'Legible | It can be read, now and in ten years\n'+
'Contemporaneous | Recorded at the time, not reconstructed later\n'+
'Original | The first record, or a verified true copy\n'+
'Accurate | It reflects what actually happened\n'+
'Complete | Nothing is missing, including corrections\n'+
'Consistent | Dates and sequence make sense\n'+
'Enduring | It survives as long as it is required to\n'+
'Available | It can be retrieved when needed\n\n'+
'@caution\n'+
'Overwriting a value destroys the original record. A correction must remain visible *as* a '+
'correction — the old value, the new value, who changed it and why. A record with no history cannot '+
'be audited, and a record that cannot be audited cannot be defended.\n\n'+

'@section Audit trails, versions and signatures\n\n'+
'An **audit trail** is a secure, time-stamped record of who did what to a record and when. It is '+
'generated by the system rather than by the user, which is the point: a trail the user can edit '+
'proves nothing.\n\n'+
'**Version control** manages successive versions of a document so the current one is unambiguous. A '+
'document without a version number and date will be superseded and still be in use — usually by the '+
'person who needed the current one most.\n\n'+
'An **electronic signature** must be uniquely attributable to one person, under their sole control, '+
'and linked to the record such that later alteration is detectable. A typed name in a box is not an '+
'electronic signature, whatever the box is labelled.\n\n'+
'@diagram flow Draft > Review > Approve > Issue with a version number > Withdraw the previous version | A controlled document has a lifecycle\n\n'+

'@section Spreadsheets: useful and dangerous\n\n'+
'Spreadsheets are everywhere in pharmacy because they are quick and need nobody\'s permission. They '+
'are also the source of a great many errors, because nothing stops you typing over a formula and no '+
'one is told when you do.\n\n'+
'@diagram compare Safer practice | Common mistake ; Lock formula cells | Typing over a formula ; One fact per column | Mixing units in one column ; Dates stored as real dates | Dates stored as free text ; Keep a change log | Silent edits\n\n'+
'@caution\n'+
'Sorting a table with only one column selected separates each row\'s data from its label. It is a '+
'silent, total corruption of the sheet with no error message and no visible symptom. Always select '+
'the whole table before sorting.\n\n'+
'@note\n'+
'A column headed "quantity" that holds packs in one row and units in the next will produce a total '+
'that is confident, precise and meaningless. Decide the unit of measure before you collect anything.\n\n'+

'@section Documents and data that others will read\n\n'+
'Use styles rather than manual formatting, so a document can be restructured without being retyped. '+
'Number the pages. Put a version and a date in the footer of anything that will circulate.\n\n'+
'When presenting pharmacy data the purpose is a decision, not a display. State what you found, how '+
'confident you are, what it implies, and what decision it supports — in that order and briefly. A '+
'chart that requires explanation has usually failed; a table of forty numbers with no highlighted '+
'row has certainly failed.\n\n'+

'@activity Activity 4.1\n'+
'Take any stock spreadsheet you have access to and audit it against ALCOA+. List each principle it '+
'fails and propose the smallest change that would fix it.\n\n'+
'@activity Activity 4.2\n'+
'Find a controlled document in your placement whose version is ambiguous — no number, no date, or '+
'two versions in circulation. Write the footer it should have had.\n\n'+

'@keyterms\n'+
'ALCOA+: the set of principles describing a trustworthy record.\n'+
'Audit trail: a secure, time-stamped, system-generated record of changes.\n'+
'Contemporaneous: recorded at the time the event happened.\n'+
'Version control: managing successive versions so the current one is unambiguous.\n'+
'Electronic signature: a signature uniquely attributable, under sole control, and tamper-evident.\n\n'+

'@summary\n'+
'- A pharmacy record is evidence, and ALCOA+ describes what makes it trustworthy\n'+
'- Corrections must remain visible; overwriting destroys the original\n'+
'- An audit trail the user can edit proves nothing\n'+
'- Spreadsheets fail silently, so lock formulas and keep one fact per column\n'+
'- A document without a version and date will be superseded and still used\n'+
'- Data is presented to support a decision, not to display effort\n\n'+

'@exercise Exercises\n'+
'Q: Expand ALCOA+ and give a pharmacy example of a record failing any three principles.\n'+
'Q: Why must a correction show the original value?\n'+
'Q: What makes an audit trail credible as evidence?\n'+
'Q: State the three requirements of a valid electronic signature.\n'+
'Q: Describe two ways a spreadsheet can be corrupted without anyone noticing.\n'+
'Q: What belongs in the footer of a controlled document, and why?\n'+
'Q: A record is legible and accurate but was written up the next morning. Which principle fails?\n'+
'Q: State the four things a presentation of pharmacy data should communicate, in order.\n'
};
})();
