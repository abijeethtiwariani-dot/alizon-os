/* ALIZON OS — Module 2 examination question bank
   Digital Pharmacy, EHR & Telepharmacy · 4 units × 25 MCQs · 1 mark each      */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M2'] = window.ALIZON_EXAM_M2 = {
  module: 'Module 2 · Digital Pharmacy, EHR & Telepharmacy',
  code: 'ALZ-PH-M2',
  n: 2,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'Digital Pharmacy & E-Prescription Systems', hrs:7.5, qs:[

  {q:'An electronic prescription differs from a scanned image of a paper prescription because it:',
   o:['Is simply a clearer picture of the same document','Is always in colour','Is transmitted as structured, coded data that the receiving system can read, check and act on','Cannot be printed'],c:2,
   e:'The defining feature is <b>structured coded data</b>, not the medium. A scanned image cannot be checked against an interaction database or auto-populated into a dispensing record; a true e-prescription can.'},

  {q:'Which is the principal safety gain of e-prescribing over handwriting?',
   o:['The prescriber saves time','Elimination of illegibility and of transcription steps between prescribing and dispensing',
      'Prescriptions look more professional','Paper costs are reduced'],c:1,
   e:'Illegibility and transcription are two of the best-documented causes of medication error. Removing both is the core safety argument for e-prescribing.'},

  {q:'A prescriber types “MTX” intending methotrexate, and the system offers mitoxantrone first. This risk is best mitigated by:',
   o:['Training prescribers to type faster','Requiring a minimum number of characters, displaying full generic names, and using Tall Man lettering in the picking list','Removing the search function entirely','Allowing free-text entry instead'],c:1,
   e:'Abbreviation-driven selection errors are an <b>interface design</b> problem. Minimum character thresholds, full generic names and Tall Man lettering address it at source; free text would remove decision support altogether.'},

  {q:'What is the correct way to express a dose of 0.5 mg in an electronic order to minimise error?',
   o:['0.5 mg','.5 mg','0.50 mg','1/2 mg'],c:0,
   e:'Always use a <b>leading zero</b> and never a trailing zero. A missed decimal point in “.5 mg” reads as 5 mg — a tenfold overdose — and “0.50 mg” risks being read as 50 mg.'},

  {q:'A “hard stop” in an e-prescribing system is:',
   o:['A block that prevents the order being completed at all until the unsafe condition is resolved','A prompt the prescriber may override with a reason','A warning that appears only after the order is signed','An alert shown to the pharmacist but not the prescriber'],c:0,
   e:'A <b>hard stop</b> cannot be overridden. It is reserved for the small number of truly unacceptable orders — a documented anaphylactic allergy, an absolute contraindication — because overusing it obstructs legitimate care.'},

  {q:'Order sets in an e-prescribing system primarily improve care by:',
   o:['Reducing the number of prescribers required',
      'Making the evidence-based default the easiest option to choose, improving consistency for common presentations',
      'Preventing any deviation from protocol','Removing the need for clinical judgement'],c:1,
   e:'Order sets work through <b>defaults</b>. They must remain editable — a set that cannot be tailored to the patient becomes a safety hazard of its own.'},

  {q:'Which element is NOT required for an electronic prescription to be legally valid?',
   o:['The patient’s identification','The prescriber’s attributable electronic signature',
      'The medicine, strength, dose and directions','The patient’s insurance policy number'],c:3,
   e:'Insurance details are administrative, not part of legal validity. The legal core is <b>who prescribed, for whom, what exactly, and an attributable signature</b>.'},

  {q:'In a closed-loop medication system, the “loop” is closed when:',
   o:['Administration is electronically verified and recorded against the original order at the bedside','The prescription is printed','The medicine is delivered to the ward','The pharmacy invoice is settled'],c:0,
   e:'The loop runs prescribe → verify → dispense → administer → document. It closes only when <b>administration is verified back against the original order</b>, usually by barcode at the bedside.'},

  {q:'A prescriber overrides an interaction alert without recording a reason. The system should:',
   o:['Accept the override silently','Require a reason for override on clinically significant alerts and store it in the audit trail',
      'Block the prescriber from the system','Notify the patient directly'],c:1,
   e:'A recorded override reason preserves <b>accountability</b> and provides the data needed to identify which alerts are firing uselessly — the evidence base for reducing alert fatigue.'},

  {q:'Repeat (refill) prescribing in a digital system carries the particular risk that:',
   o:['Medicines continue to be issued long after the clinical indication has ended, because reauthorisation is passive','The medicine may be dispensed too quickly','The label may be printed twice','The patient may lose the paper copy'],c:0,
   e:'The danger of repeat prescribing is <b>therapeutic inertia</b>. Scheduled medication review, and expiry on the repeat authorisation itself, are the controls that prevent indefinite continuation.'},

  {q:'What does “e-prescription tokenisation” mean in national digital health systems?',
   o:['Charging a token fee for each prescription','Converting the prescription into a cryptocurrency',
      'Issuing a unique identifier that the patient presents at any pharmacy to retrieve the prescription from a central repository',
      'Storing prescriptions on the patient’s own device only'],c:2,
   e:'A <b>token</b> is a unique retrieval key. The prescription itself lives in the central repository; the token lets the patient choose any pharmacy without carrying the document.'},

  {q:'Which practice best protects against a prescription being dispensed twice at different pharmacies?',
   o:['Printing the prescription on watermarked paper','Asking the patient to confirm honestly','Central status tracking that marks the prescription as dispensed once claimed','Limiting each patient to one pharmacy'],c:2,
   e:'A <b>single authoritative status</b> in the central repository is what prevents duplicate claiming. Physical security features cannot prevent the same electronic prescription being retrieved twice.'},

  {q:'In pharmacy practice, “dispensing verification” by the pharmacist means:',
   o:['Confirming the patient has paid','Checking the stock level is sufficient','Clinically checking the order for appropriateness, dose, interactions, allergy and duplication before supply','Confirming the printer worked correctly'],c:2,
   e:'Verification is a <b>clinical</b> act. Electronic transmission removes transcription error, but the professional judgement about whether the medicine is right for this patient remains with the pharmacist.'},

  {q:'A significant unintended consequence of e-prescribing systems reported in the literature is:',
   o:['New error types such as wrong-patient and wrong-drug selection errors created by the interface itself','Prescribers write fewer prescriptions overall','Medicines become more expensive','Pharmacists become unnecessary'],c:0,
   e:'E-prescribing removes some errors and <b>creates others</b>. Recognising interface-generated errors — juxtaposition, wrong-patient, default acceptance — is essential to designing and using these systems safely.'},

  {q:'Which is the safest configuration for a default duration on an antibiotic order?',
   o:['A default of 30 days','A default of 12 months','No duration field at all','No default, requiring the prescriber to enter a duration actively'],c:3,
   e:'For antibiotics, an <b>active choice</b> is safer than any default, because a default duration will be accepted unchanged and drives unnecessary prolonged courses — a direct antimicrobial stewardship concern.'},

  {q:'Digital prescription systems support antimicrobial stewardship most effectively by:',
   o:['Making antibiotics cheaper','Restricting all antibiotics to consultants','Hiding antibiotics from the formulary','Requiring an indication and duration at the point of ordering, with automatic review prompts'],c:3,
   e:'Requiring <b>indication and duration</b> creates the data stewardship needs and makes automatic review prompts possible. Blanket restriction delays necessary treatment.'},

  {q:'When an e-prescribing system is unavailable, the safest immediate action for the ward pharmacist is to:',
   o:['Activate the documented downtime procedure, with paper orders, manual clinical verification and defined back-entry','Wait until the system returns','Allow verbal orders without any record','Dispense from memory of the previous day’s orders'],c:0,
   e:'Downtime is inevitable. The <b>rehearsed contingency process</b> — paper forms, manual verification, and reconciliation into the system afterwards — is what keeps supply both continuous and documented.'},

  {q:'Which patient group requires particular care in weight-based electronic dose calculation?',
   o:['Adults with stable chronic disease','Patients collecting repeat prescriptions','Patients on a single medicine','Paediatric patients, where an error in the recorded weight propagates directly into every calculated dose'],c:3,
   e:'In paediatrics the weight is the <b>input to the calculation</b>, so a data entry error becomes a dosing error automatically. Mandatory recent weight, units, and range checks are essential controls.'},

  {q:'An “allergy” field recorded as free text rather than a coded entry means that:',
   o:['The record is more detailed and therefore safer','The allergy is legally invalid','Only doctors can read it','Automated cross-checking against prescribed medicines cannot reliably occur'],c:3,
   e:'Only <b>coded</b> allergies can be matched automatically against an order. Free text is visible to a human reader but invisible to the checking engine — a classic silent failure.'},

  {q:'The correct response when a patient reports a “penicillin allergy” described only as childhood nausea is to:',
   o:['Record it as a true allergy and avoid all beta-lactams permanently','Document the specific reaction and its nature, so that intolerance is distinguished from true allergy','Ignore the report entirely','Ask the patient to take penicillin to test it'],c:1,
   e:'Recording <b>what actually happened</b> matters clinically. Labelling an intolerance as an allergy denies patients first-line therapy for life; ignoring a report risks anaphylaxis. Documentation of the reaction is what allows proper assessment.'},

  {q:'What is the main advantage of generic-name prescribing in an electronic system?',
   o:['It is cheaper for the pharmacy','It is faster to type','It avoids confusion between multiple brand names of the same molecule and supports accurate interaction checking','Brands are not permitted by law'],c:2,
   e:'Generic prescribing gives an <b>unambiguous identity</b> for the molecule. It prevents therapeutic duplication where a patient receives the same drug under two brand names, and makes decision support reliable.'},

  {q:'A digital prescription with the direction “as directed” is unsatisfactory because:',
   o:['It is too short to print','It gives the patient no usable instruction and cannot be checked for dose appropriateness','It cannot be dispensed legally in any circumstance','It requires an extra signature'],c:1,
   e:'“As directed” transfers the entire instruction outside the record. Neither the pharmacist nor the patient can verify the dose, and there is nothing to audit against.'},

  {q:'In an e-prescribing system, therapeutic duplication checking detects:',
   o:['Two prescriptions printed on the same page','A prescription written twice by mistake','Two medicines from the same therapeutic class or with the same action prescribed concurrently','Two patients with the same name'],c:2,
   e:'<b>Therapeutic duplication</b> checking catches, for example, two NSAIDs or two proton pump inhibitors running concurrently — often the result of one being prescribed by brand and the other by generic name.'},

  {q:'Which statement about electronic prescribing of controlled substances is correct?',
   o:['Controlled drugs cannot be prescribed electronically anywhere','They require no signature because the system records the user','The rules are identical to those for ordinary medicines','They require additional authentication and stricter audit than ordinary medicines'],c:3,
   e:'Controlled substances carry <b>enhanced identity assurance</b> requirements — typically stronger authentication, tighter audit and specific record retention — reflecting their diversion risk.'},

  {q:'The pharmacist’s professional responsibility when an e-prescribing system auto-populates a dose is to:',
   o:['Verify it against the patient’s clinical parameters and the prescriber’s intention before supply','Accept it, since the system is validated','Change it to the standard adult dose','Refer every such order back to the prescriber'],c:0,
   e:'Auto-population is a convenience, not an authority. The pharmacist <b>verifies against the patient</b> — renal function, weight, age, indication — and remains accountable for the supply.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'Electronic Health Records (EHR) in Pharmacy Practice', hrs:7.5, qs:[

  {q:'The key difference between an Electronic Medical Record (EMR) and an Electronic Health Record (EHR) is that an EHR:',
   o:['Contains only laboratory results','Is designed to be shared across organisations and follow the patient through their care',
      'Is stored on paper as well','Can only be read by doctors'],c:1,
   e:'An <b>EMR</b> is generally confined to one organisation. An <b>EHR</b> is longitudinal and shareable across settings, which is what makes continuity of medication information possible.'},

  {q:'For a pharmacist verifying an order, the single most valuable EHR element beyond the prescription itself is usually:',
   o:['Renal function, allergies and the current medication list','The patient’s billing history','The admitting clerk’s name','The ward bed number'],c:0,
   e:'Dose appropriateness turns on <b>renal function</b>, safety on <b>allergies</b>, and duplication and interaction checking on the <b>full medication list</b>. These three convert a supply function into a clinical one.'},

  {q:'HL7 FHIR differs from earlier HL7 v2 messaging chiefly in that it:',
   o:['Uses modern web APIs and modular resources, making data easier to exchange and consume',
      'Is a type of encryption','Applies only to radiology','Removes the need for any standard'],c:0,
   e:'<b>FHIR</b> exposes clinical concepts as modular resources over standard web APIs, which is far easier to implement than the pipe-delimited v2 messages, and enables app-style integration.'},

  {q:'A coding system such as SNOMED CT or LOINC is used in an EHR to:',
   o:['Encrypt the record','Compress the database','Give clinical concepts and laboratory tests unambiguous machine-readable identifiers','Number the pages'],c:2,
   e:'Shared <b>terminologies</b> are what let two systems agree that they mean the same thing. Without them, exchanged data can be transmitted but not safely interpreted.'},

  {q:'“Break the glass” access in an EHR refers to:',
   o:['Physically damaging the terminal','Emergency override access to a restricted record, which is permitted but heavily audited and must be justified',
      'Deleting a record permanently','Resetting a forgotten password'],c:1,
   e:'Emergency access must be possible when a patient’s life depends on it, so it is <b>allowed but conspicuously logged</b>. Every use is reviewed, and an unjustified break-glass is a disciplinary matter.'},

  {q:'Medication reconciliation using the EHR is most error-prone at which point?',
   o:['During a routine outpatient repeat','Transitions of care — admission, transfer and discharge',
      'When the patient is stable on the ward','During the annual review'],c:1,
   e:'<b>Transitions</b> are where medication information is duplicated, dropped or garbled. This is why reconciliation is mandated specifically at admission, transfer and discharge.'},

  {q:'A patient’s EHR shows two entries for the same medicine at different doses from different sources. The pharmacist should:',
   o:['Use the higher dose','Use the more recent entry automatically','Supply neither and take no further action','Investigate and reconcile the discrepancy with the patient and prescriber before supply'],c:3,
   e:'A discrepancy is a <b>signal</b>, not a choice between two options. Neither recency nor magnitude establishes which is correct — only reconciliation with the patient and prescriber does.'},

  {q:'The clinical risk of “copy and paste” in EHR documentation is that:',
   o:['Outdated or incorrect information is propagated forward and appears to be current','It uses excessive storage','It slows down the system','It is prohibited by data protection law'],c:0,
   e:'Copy-forward makes stale information look freshly verified. The subsequent reader cannot tell what was <b>actually assessed today</b>, which is how resolved problems and stopped medicines persist in records.'},

  {q:'Structured medication data in the EHR is essential because:',
   o:['It looks neater on screen','Only coded, structured entries can drive interaction checking, analytics and safe data exchange',
      'It takes less space than text','It is required for billing only'],c:1,
   e:'A narrative sentence about a medicine is invisible to the checking engine. <b>Structured, coded</b> entries are what make automated safety checks possible at all.'},

  {q:'Which is the correct approach to an EHR entry that a pharmacist later finds to be wrong?',
   o:['Amend it through the system’s correction function so the original, the correction, the author and the time all remain visible','Delete it and enter the correct information','Leave it and add a verbal handover','Ask IT to remove it from the database'],c:0,
   e:'The audit trail must survive the correction. The original entry stays <b>visible</b> alongside the amendment — the electronic equivalent of a single line strike-through with initials and date.'},

  {q:'Patient access to their own EHR (a patient portal) tends to:',
   o:['Increase medication errors','Breach confidentiality by definition','Improve engagement and allow patients to identify errors in their own medication list','Be prohibited in hospital practice'],c:2,
   e:'Patients are an <b>underused source of error detection</b> — they frequently spot medicines they no longer take or were never prescribed. Portals also improve adherence and engagement.'},

  {q:'A pharmacist’s clinical note in the EHR should be written on the assumption that:',
   o:['Only pharmacists will read it','It will be deleted after discharge','The patient, other clinicians, auditors and potentially a court may read it','It is informal and private'],c:2,
   e:'EHR entries are <b>disclosable legal records</b>. Writing factually and objectively, without speculation about colleagues, is both a professional and a practical requirement.'},

  {q:'Interoperability failure between the pharmacy system and the EHR most commonly manifests clinically as:',
   o:['Medication lists that disagree between systems, so the pharmacist cannot tell which is authoritative','Slow printing','Incorrect ward names','Duplicate patient photographs'],c:0,
   e:'Divergent medication lists are the practical face of poor interoperability, and they are dangerous precisely because <b>each system looks internally consistent</b>.'},

  {q:'What does an EHR audit log allow an investigator to establish?',
   o:['How much the treatment cost','Whether the patient was satisfied','How long the patient waited','Which staff member accessed or amended a record, what they did and when'],c:3,
   e:'The audit log answers <b>who, what and when</b>. It is the mechanism by which confidentiality breaches are detected and by which data integrity is demonstrated to an inspector.'},

  {q:'A “single source of truth” for the medication list means:',
   o:['Only one clinician may edit it','The list is printed once and never changed','One authoritative, reconciled list that every system and clinician refers to','Only the pharmacy holds the list'],c:2,
   e:'Multiple parallel lists guarantee divergence. A <b>single reconciled list</b>, visible to all authorised users and updated in one place, is the structural fix for transition-of-care error.'},

  {q:'Clinical decision support drawing on EHR data can check dose appropriateness automatically because it can access:',
   o:['The patient’s address','Renal function, weight, age and current medicines',
      'The patient’s employment status','The prescriber’s workload'],c:1,
   e:'Automated dose checking is only as good as the <b>clinical parameters</b> available to it. Without renal function and weight in structured form, the system can check little more than the maximum licensed dose.'},

  {q:'The main limitation of relying on the EHR problem list for clinical context is that:',
   o:['It is always encrypted','Pharmacists cannot access it','It is frequently incomplete or out of date, since maintaining it depends on clinician discipline','It contains only surgical history'],c:2,
   e:'Problem lists decay. Resolved problems remain and new ones are omitted, so the list should be <b>corroborated</b> against medicines, results and the current episode rather than trusted alone.'},

  {q:'When a patient is transferred between hospitals, medication information is best transferred by:',
   o:['A verbal telephone handover alone','Giving the patient a bag of medicines with no list','A photograph of the drug chart','A structured electronic discharge or transfer summary including what changed and why'],c:3,
   e:'A <b>structured summary that states the changes and the reasons</b> is what prevents the receiving team reinstating stopped medicines. This is the single most valuable and most often omitted element.'},

  {q:'Which is the strongest argument for pharmacist documentation directly in the EHR rather than a separate pharmacy system?',
   o:['It reduces the pharmacy’s software costs','It is faster to type','It avoids the need for a signature','The intervention becomes visible to the whole care team at the point they need it'],c:3,
   e:'An intervention recorded where <b>nobody else looks</b> cannot influence care. Visibility to the treating team, at the moment of decision, is the entire point of documenting it.'},

  {q:'Data quality in an EHR is best safeguarded at the point of:',
   o:['Entry, through validation rules, controlled vocabularies and mandatory fields','Annual audit','Archiving','Report generation'],c:0,
   e:'Errors are cheapest to prevent and most expensive to correct downstream. <b>Validation at entry</b> — range checks, coded terms, required fields — is the highest-yield control.'},

  {q:'A pharmacist notices a colleague has left an EHR session open on a ward terminal. The correct action is to:',
   o:['Use it, since the colleague is trusted','Ignore it','Report the patient to the ward manager','Lock the session immediately and remind the colleague of the policy'],c:3,
   e:'An open session means any subsequent action is attributed to the absent colleague, destroying both access control and the audit trail. The immediate fix is to <b>lock it</b>.'},

  {q:'Which best describes “data provenance” in a shared health record?',
   o:['How long the data will be kept','The physical location of the server','The cost of collecting the data','A record of where a data item originated, who entered it and when'],c:3,
   e:'In a record aggregating data from many sources, <b>provenance</b> is what lets a clinician judge how much weight to give an item — a self-reported allergy differs from a documented anaphylaxis.'},

  {q:'The commonest cause of a pharmacist being unable to verify a dose safely in a well-implemented EHR is:',
   o:['The prescription being unsigned','A missing or outdated weight or renal function result',
      'The ward being busy','The patient being asleep'],c:1,
   e:'Dose verification depends on <b>current clinical parameters</b>. A stale creatinine or an absent weight blocks the calculation regardless of how good the software is.'},

  {q:'When an EHR alert repeatedly fires on a clinically irrelevant interaction, the appropriate response is to:',
   o:['Report it for review so the alert rule can be refined or suppressed on evidence','Instruct staff to ignore that alert','Disable all interaction alerts','Continue as normal and record nothing'],c:0,
   e:'Telling staff to ignore a specific alert trains them to ignore alerts generally. The correct route is <b>governed review and refinement</b> of the rule, so specificity improves.'},

  {q:'Pharmacist access to the EHR should be governed by:',
   o:['Seniority alone','Unrestricted access for all registered staff','The minimum access required for the professional role, with all access audited','Access granted per patient by the patient'],c:2,
   e:'<b>Least privilege plus audit</b> is the governing principle. Broad access is sometimes clinically necessary, which is precisely why the audit trail carries the accountability burden.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Telepharmacy & Remote Patient Care', hrs:7.5, qs:[

  {q:'Telepharmacy is best defined as:',
   o:['Selling medicines by post','The delivery of pharmaceutical care by a registered pharmacist to patients at a distance using telecommunications',
      'An automated vending machine for medicines','A pharmacy without any pharmacist'],c:1,
   e:'The defining element is a <b>registered pharmacist providing care</b> remotely. Supply logistics alone, without professional input, is not telepharmacy.'},

  {q:'Which activity is most appropriately delivered by telepharmacy?',
   o:['Medication counselling, adherence review and chronic disease follow-up','Sterile compounding of a cytotoxic infusion','Physical inspection of a suspected counterfeit tablet','Emergency resuscitation'],c:0,
   e:'Telepharmacy suits <b>cognitive, conversational</b> services. Tasks requiring physical handling, aseptic technique or immediate physical presence are not suitable.'},

  {q:'The greatest clinical limitation of a remote consultation compared with a face-to-face one is:',
   o:['The inability to perform physical assessment and the reduced availability of non-verbal cues','The pharmacist cannot speak clearly','Patients cannot hear well','Prescriptions cannot be issued'],c:0,
   e:'Loss of <b>physical examination and non-verbal information</b> is the substantive limitation. Recognising when a consultation must be escalated to in-person assessment is a core telepharmacy competence.'},

  {q:'Before beginning a telepharmacy consultation, the pharmacist must first:',
   o:['Take payment','Check the patient’s social media','Send the medicine','Confirm the patient’s identity and obtain consent for the remote consultation'],c:3,
   e:'<b>Identity verification and consent</b> come first. Remote contact removes the visual cues that normally confirm identity, so an explicit check is required.'},

  {q:'Which platform requirement is essential for a telepharmacy consultation involving clinical information?',
   o:['End-to-end encryption and a platform approved for handling health data','High-definition video quality','Availability of a mobile app','Free access for the patient'],c:0,
   e:'Confidentiality obligations do not relax because the consultation is remote. The platform must be <b>secure and approved</b> for personal health data; picture quality is secondary.'},

  {q:'Documentation of a telepharmacy consultation should:',
   o:['Be optional if the consultation was brief','Be kept separately from the patient record','Be recorded only if a problem arose','Meet the same standard as an in-person consultation, and additionally record the medium used and consent obtained'],c:3,
   e:'Remote consultations require the <b>same standard plus</b> the medium and consent. The record must show a reader that a remote encounter was appropriate and properly conducted.'},

  {q:'A patient in a remote consultation describes chest pain radiating to the jaw. The pharmacist should:',
   o:['Advise paracetamol and review in a week','Continue with the medication review','Recognise the red flag, terminate the consultation and direct the patient to emergency care immediately','Email a leaflet about angina'],c:2,
   e:'Red-flag recognition and <b>immediate escalation</b> are the most important safety skills in remote practice. Continuing a routine consultation in the presence of a possible acute coronary syndrome is indefensible.'},

  {q:'Remote video verification of dispensing in a telepharmacy model is used to:',
   o:['Replace the pharmacist entirely','Allow a pharmacist at a central site to check the product and label prepared by a technician at a remote site',
      'Record the patient for marketing','Reduce the need for stock control'],c:1,
   e:'This model extends pharmacist oversight to sites that cannot support a resident pharmacist. The <b>final clinical and product check remains a pharmacist act</b>, performed over video.'},

  {q:'The main public health argument for telepharmacy is that it:',
   o:['Reduces the salary bill','Increases medicine sales','Eliminates the need for hospitals','Extends pharmaceutical care to rural and underserved populations who otherwise have none'],c:3,
   e:'<b>Access</b> is the central justification. Telepharmacy places a pharmacist where the population cannot sustain a full physical pharmacy.'},

  {q:'Which patient is least suitable for a purely remote medication review?',
   o:['A patient stable on two long-term medicines','A patient with cognitive impairment and no carer present, on a complex regimen',
      'A patient requesting inhaler technique advice by video','A patient with a simple adherence question'],c:1,
   e:'Remote care depends on <b>reliable communication</b>. Cognitive impairment without support undermines both history-taking and the delivery of advice, and warrants in-person review.'},

  {q:'Remote inhaler technique assessment by video is:',
   o:['Feasible and valuable, though the pharmacist must be alert to camera angle and device visibility limitations','Impossible and should never be attempted','Equivalent in every respect to in-person assessment','Only for children'],c:0,
   e:'Video assessment works well in practice but has <b>real limitations</b> — angle, framing, resolution. The competent practitioner works around them and knows when to bring the patient in.'},

  {q:'Remote patient monitoring in chronic disease management typically involves:',
   o:['Watching the patient continuously by camera','Patient-generated data such as blood pressure, glucose or peak flow being transmitted for clinician review',
      'Weekly hospital visits','Telephone calls only'],c:1,
   e:'<b>Patient-generated health data</b> reviewed asynchronously is the core model. Its value depends on clear thresholds for action and defined responsibility for reviewing the data.'},

  {q:'The greatest governance risk of remote monitoring data is:',
   o:['The data takes up storage space','Patients enjoy using the devices','The devices are expensive','Data arriving with no clearly assigned clinician responsible for reviewing and acting on it'],c:3,
   e:'Unreviewed data creates an <b>illusion of monitoring</b> and a real liability. Named responsibility, defined review intervals and escalation thresholds must be agreed before monitoring starts.'},

  {q:'When prescribing or supplying across state or national borders by telepharmacy, the pharmacist must:',
   o:['Comply with the registration and regulatory requirements of the jurisdiction where the patient is located','Follow only the rules of their own location','Ignore jurisdiction as care is remote','Ask the patient which rules to follow'],c:0,
   e:'Regulation generally follows the <b>patient’s location</b>. Practising into a jurisdiction where one is not registered is a serious regulatory breach, however competent the care.'},

  {q:'A telepharmacy service must have a defined escalation pathway primarily because:',
   o:['It reduces call volumes','It is required for billing','Remote assessment will sometimes identify problems that cannot be managed remotely, and the route to in-person care must be immediate and known','Patients prefer it'],c:2,
   e:'The safety of a remote service rests on <b>knowing its own limits</b> and having a rehearsed, immediate route out of them.'},

  {q:'Digital exclusion is a relevant concern in telepharmacy because:',
   o:['Some patients prefer paper','Digital services are always more expensive','Older, poorer and rural patients may lack devices, connectivity or digital skills, so a remote-only service can widen inequity','It slows down the consultation'],c:2,
   e:'A service that is remote-only can <b>worsen the very inequity</b> telepharmacy is meant to address. Maintaining non-digital routes is an equity requirement, not an optional extra.'},

  {q:'Obtaining consent for a telepharmacy consultation requires explaining:',
   o:['Only the price','The nature of remote consultation, its limitations, how data will be handled, and the alternative of in-person care',
      'The pharmacist’s qualifications only','Nothing, as consent is implied by joining the call'],c:1,
   e:'Informed consent must cover the <b>limitations of the medium</b> and the fact that an in-person alternative exists. Joining a call is not by itself informed consent.'},

  {q:'Recording a telepharmacy video consultation requires:',
   o:['No permission, as the pharmacist owns the record','Only the employer’s approval','The patient’s explicit consent, with clear information on storage, access and retention','Consent only if the patient asks'],c:2,
   e:'A recording is <b>sensitive personal data</b>. Explicit consent, and transparency about who can access it and for how long it is kept, are prerequisites.'},

  {q:'In a hub-and-spoke telepharmacy model, the “hub” typically provides:',
   o:['Physical dispensing only','Storage of expired medicines','Patient transport','Centralised pharmacist clinical verification and supervision for several remote sites'],c:3,
   e:'The <b>hub</b> concentrates scarce pharmacist expertise and supplies clinical verification and supervision to spoke sites, which handle local supply and patient contact.'},

  {q:'Which outcome measure best demonstrates the clinical value of a telepharmacy service?',
   o:['Number of calls answered','Clinical outcomes such as interventions accepted, adherence improvement and reduction in medication-related harm',
      'Average call duration','Number of staff employed'],c:1,
   e:'Activity counts measure effort, not benefit. <b>Clinical outcomes and accepted interventions</b> are what demonstrate that the service changes care.'},

  {q:'A pharmacist conducting remote consultations from home must ensure that:',
   o:['The consultation cannot be overheard or the screen viewed by others, and the connection and device are secure','The room is well lit','A professional background image is used','The consultation is short'],c:0,
   e:'<b>Confidentiality of the physical environment</b> is as important as encryption. A secure platform is worthless if the conversation can be overheard by family members.'},

  {q:'The pharmacist’s professional accountability in telepharmacy is:',
   o:['Identical to that in face-to-face practice','Reduced, because the patient is not physically present','Transferred to the platform provider','Shared with the patient'],c:0,
   e:'Standards of care are <b>medium-independent</b>. The same professional and legal accountability applies, which is why recognising when remote care is inadequate is itself part of the duty.'},

  {q:'Asynchronous telepharmacy (such as secure messaging) is particularly suited to:',
   o:['Acute chest pain','Anaphylaxis management','Emergency contraception supply','Non-urgent queries, adherence support and routine follow-up where an immediate response is not required'],c:3,
   e:'Asynchronous channels suit <b>non-urgent</b> matters. Their defining risk is delay, so they must carry clear guidance about what to do in an emergency instead of messaging.'},

  {q:'A remote consultation reveals that the patient has been taking double their prescribed warfarin dose for a week. The pharmacist should:',
   o:['Send an information leaflet','Note it for the next scheduled review','Advise stopping and arrange urgent INR testing and clinical review, documenting the intervention and escalation','Advise halving the dose from now on'],c:2,
   e:'This is a <b>potential emergency</b>. Remote identification of the problem must be followed by immediate arrangement of testing and review, not by information alone.'},

  {q:'Which technology issue most directly threatens patient safety during a video consultation?',
   o:['A low-resolution profile picture','An unattractive interface','Poor audio quality causing medicine names or doses to be misheard','A slow-loading logo'],c:2,
   e:'<b>Mishearing a drug name or dose</b> is a direct clinical risk. Where audio is poor, the practitioner should switch medium or confirm details in writing rather than proceed.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Digital Inventory, ADR & Compliance Systems', hrs:7.5, qs:[

  {q:'FEFO stock rotation means issuing stock:',
   o:['First Expiry, First Out — the pack with the earliest expiry date is issued first','In the order it was purchased','In the order it was received','Largest pack first'],c:0,
   e:'<b>FEFO</b> is the correct rule for medicines because expiry, not arrival order, determines usability. FIFO can leave a short-dated pack behind a longer-dated one received later.'},

  {q:'An ABC analysis of pharmacy inventory classifies items by:',
   o:['Alphabetical order','Physical size','Manufacturer','Annual consumption value, so that the small number of items representing most of the spend receive the tightest control'],c:3,
   e:'<b>ABC analysis</b> concentrates management effort where the money is: class A items are few but dominate expenditure and warrant close control and frequent review.'},

  {q:'VED analysis classifies medicines by:',
   o:['Volume of packaging','Value in rupees','Vitality — Vital, Essential and Desirable — based on the clinical consequence of a stock-out','Vendor reliability'],c:2,
   e:'<b>VED</b> is a clinical rather than financial classification. A cheap vital medicine must never stock out, whereas an expensive desirable one may reasonably be ordered on demand.'},

  {q:'The reorder level for a medicine is best calculated from:',
   o:['The size of the shelf','The supplier’s minimum order quantity','Average consumption during the lead time plus a safety stock','Last month’s spend'],c:2,
   e:'The reorder level must cover <b>demand during the replenishment lead time</b>, plus a buffer for variability in both demand and delivery.'},

  {q:'Barcode scanning at goods receipt principally protects against:',
   o:['Theft by staff','Receiving the wrong product, strength or an incorrectly dated batch into stock',
      'Damage in transit','Supplier overcharging'],c:1,
   e:'Scanning at receipt validates the <b>identity, strength and batch/expiry</b> of what physically arrived against what was ordered, before it can enter the dispensing chain.'},

  {q:'Batch and expiry tracking in a digital inventory system is essential primarily for:',
   o:['Rapid, complete product recall and prevention of expired supply','Calculating profit','Deciding shelf layout','Staff rostering'],c:0,
   e:'When a recall is issued, the system must identify <b>every affected pack and where it went</b> within minutes. Batch-level traceability is what makes that possible.'},

  {q:'On receiving a manufacturer recall notice, the pharmacy’s first action should be to:',
   o:['Inform patients before checking stock','Return the stock without recording it','Wait for the regulator’s confirmation','Quarantine affected stock immediately so it cannot be dispensed, then trace and act'],c:3,
   e:'<b>Quarantine first</b>, exactly as with a temperature excursion. Preventing further supply takes precedence; tracing, patient notification and return follow.'},

  {q:'Perpetual inventory differs from periodic stocktaking in that it:',
   o:['Is performed once a year','Requires no computer','Maintains a continuously updated stock figure with every transaction, allowing discrepancies to be detected quickly','Applies only to controlled drugs'],c:2,
   e:'A <b>perpetual</b> system means the recorded balance is always current, so a discrepancy surfaces within days rather than at the annual count.'},

  {q:'Cold-chain monitoring for refrigerated medicines requires:',
   o:['A daily glance at the thermometer','Continuous temperature logging with alarms, and a documented excursion procedure',
      'Storage in any refrigerator','Monthly temperature checks'],c:1,
   e:'A spot reading proves nothing about the overnight period. <b>Continuous logging with alarms</b>, plus a defined excursion response, is the standard.'},

  {q:'On discovering a refrigerator temperature excursion, the pharmacist must first:',
   o:['Discard all the stock immediately','Continue dispensing if the excursion was brief','Quarantine the affected stock so it cannot be dispensed, then assess suitability with the manufacturer','Reset the alarm and carry on'],c:2,
   e:'Again the rule is <b>quarantine, then assess</b>. Continuing to dispense exposes patients to product of unknown quality; unilateral destruction destroys evidence and value.'},

  {q:'Digital controlled drug registers must, above all, provide:',
   o:['Attractive report formatting','Access for all pharmacy staff','A tamper-evident audit trail with running balances that cannot be silently altered','Automatic ordering'],c:2,
   e:'The register is a <b>legal record</b>. Its value depends entirely on the impossibility of silent alteration, which is why an ordinary spreadsheet is unacceptable for the purpose.'},

  {q:'A discrepancy in the controlled drug balance must be:',
   o:['Corrected quietly to match the physical count','Investigated and reported according to the organisation’s procedure, with the discrepancy and investigation documented',
      'Ignored if small','Carried forward to the next month'],c:1,
   e:'Adjusting the record to match the shelf conceals a possible <b>diversion</b>. Every discrepancy requires investigation and documentation regardless of size.'},

  {q:'Which is the correct definition of an adverse drug reaction (ADR)?',
   o:['Any unwanted event occurring during treatment','Any error made when prescribing','Any complaint from a patient','A noxious and unintended response to a medicinal product at doses normally used in humans'],c:3,
   e:'An <b>ADR</b> is a response to the medicine at normal doses. An adverse <b>event</b> is any occurrence during treatment, whether or not caused by the medicine — the distinction is causality.'},

  {q:'In pharmacovigilance, a serious adverse event is one that:',
   o:['Requires any treatment','The patient found unpleasant','Occurred more than once','Results in death, is life-threatening, requires or prolongs hospitalisation, causes persistent disability, or is a congenital anomaly'],c:3,
   e:'“Serious” is a <b>defined regulatory category</b> based on outcome, not on how severe the symptom felt. This is what triggers the expedited reporting clock.'},

  {q:'The Naranjo algorithm is used to:',
   o:['Calculate a paediatric dose','Determine a medicine’s shelf-life','Rank suppliers','Assess the probability that a drug caused a suspected adverse reaction'],c:3,
   e:'The <b>Naranjo</b> scale scores factors such as temporal relationship, dechallenge, rechallenge and alternative causes to grade causality as doubtful, possible, probable or definite.'},

  {q:'Under the Indian Pharmacovigilance Programme, suspected ADRs are reported to:',
   o:['An ADR Monitoring Centre, from where reports flow to the National Coordination Centre','The medicine’s manufacturer only','The local police','The patient’s employer'],c:0,
   e:'Reports go through <b>ADR Monitoring Centres</b> to the National Coordination Centre at the IPC, and from there into the global VigiBase database.'},

  {q:'Which suspected ADRs should be reported?',
   o:['Suspected reactions — certainty of causation is not required to report','Only those that are certainly caused by the drug','Only fatal reactions','Only reactions to new medicines'],c:0,
   e:'The threshold is <b>suspicion, not proof</b>. Requiring certainty would suppress exactly the early signals that pharmacovigilance exists to detect.'},

  {q:'Under-reporting of ADRs is a problem chiefly because:',
   o:['It reduces the pharmacy’s income','Signals of new or rare reactions are delayed or missed entirely',
      'It increases paperwork','It affects only regulators'],c:1,
   e:'Spontaneous reporting is the main early-warning system for reactions too rare to appear in trials. <b>Under-reporting delays signal detection</b> and therefore patient protection.'},

  {q:'A digital ADR reporting system improves pharmacovigilance mainly by:',
   o:['Making reports look neater','Reducing the effort of reporting and auto-populating patient and drug details, which raises reporting rates and data quality',
      'Removing the need for causality assessment','Guaranteeing regulatory approval'],c:1,
   e:'Reporting rates are strongly influenced by <b>effort</b>. Integrating the form into the workflow with pre-filled data addresses the commonest cited barrier — time.'},

  {q:'A “Periodic Safety Update Report” (PSUR) is:',
   o:['A weekly pharmacy stock report','A patient satisfaction survey','A regular comprehensive review of a product’s worldwide safety data submitted by the marketing authorisation holder','A monthly staff briefing'],c:2,
   e:'The <b>PSUR</b> periodically re-evaluates the benefit–risk balance of a marketed product using accumulated worldwide data, and is a core post-marketing obligation.'},

  {q:'Which record is essential when a pharmacy supplies a medicine subject to additional monitoring?',
   o:['The patient’s occupation','Batch number and traceable patient supply details, to support follow-up if a safety issue arises',
      'The colour of the packaging','The delivery driver’s name'],c:1,
   e:'<b>Batch-level traceability to the patient</b> is what allows a targeted response to an emerging safety signal or a recall.'},

  {q:'Automated expiry alerts in a digital inventory system are most useful when they:',
   o:['Give sufficient advance warning for the stock to be used, redistributed or returned','Appear on the day of expiry','Are emailed to all staff daily','List every item regardless of date'],c:0,
   e:'An alert on the expiry date itself prevents nothing. <b>Advance warning</b> is what allows the value to be recovered and waste avoided.'},

  {q:'Compliance dashboards in pharmacy operations are most valuable when they:',
   o:['Highlight exceptions requiring action, such as overdue temperature checks or unreconciled controlled drug balances','Display the maximum number of metrics','Show only annual data','Are accessible only to the head pharmacist'],c:0,
   e:'A compliance dashboard should surface <b>what is out of tolerance now</b>. A screen of green figures communicates less than a short, current exception list.'},

  {q:'The audit trail requirement for a digital inventory system means the system must record:',
   o:['Every transaction with its user, timestamp and previous value, without allowing silent alteration','Only stock additions','Only monthly totals','Only actions by junior staff'],c:0,
   e:'The same integrity standard applies to inventory as to clinical records: <b>attributable, complete and tamper-evident</b>, with the original value preserved.'},

  {q:'Integrating inventory data with dispensing data allows a pharmacy to:',
   o:['Reduce the number of medicines stocked to one supplier','Avoid the need for stocktaking entirely','Set retail prices automatically','Detect discrepancies between what was dispensed, what was billed and what physically moved'],c:3,
   e:'<b>Three-way reconciliation</b> — dispensed, billed and stock movement — is the control that surfaces both error and diversion, neither of which is visible in any single stream.'}
  ]}

  ]
};
