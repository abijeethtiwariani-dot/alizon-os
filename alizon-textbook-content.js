/* alizon-textbook-content.js
   Starter textbooks for the Pharmacy AI programme — one chapter per syllabus
   unit, so a "unit-wise" download is simply a chapter.

   These are written to be edited. Load one in the Textbook Studio, change what
   your faculty want changed, then Publish. Nothing here is locked.

   window.ALIZON_TEXTBOOKS = { m1: {meta, src}, … m8 }
*/
(function(){
'use strict';
var T={};

/* ============================================================
   MODULE 1
   ============================================================ */
T.m1={
 meta:{module:'1', title:'AI Foundations & Digital Systems for Pharmacy Practice',
       sub:'A Practice-Based Introduction', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Foundations of Artificial Intelligence in Pharmacy\n\n'+
'@objectives\n'+
'- Define artificial intelligence and distinguish it from ordinary automation\n'+
'- Describe where AI already sits inside hospital and community pharmacy\n'+
'- Explain why accountability for an AI-assisted decision stays with the pharmacist\n'+
'- Recognise the main ways an AI system fails\n\n'+

'@section What artificial intelligence means\n\n'+
'Artificial intelligence is the branch of computing concerned with machines that carry out tasks '+
'which would ordinarily require human judgement. In pharmacy the term stretches a long way — from a '+
'rule that flags a duplicate prescription, to a model that predicts which patients are most likely '+
'to be readmitted after discharge.\n\n'+
'It helps to separate **automation** from **intelligence**. A dispensing robot that counts tablets '+
'is automation: it repeats a fixed action faultlessly and does exactly the same thing every time. A '+
'system that learns which prescriptions your team most often queries, and moves those to the top of '+
'the worklist, is doing something different — it is adapting to the case in front of it.\n\n'+
'@diagram compare Automation | Intelligence ; Repeats a fixed action | Adapts to the case ; Rules written by people | Patterns learned from data ; Fails predictably | May fail silently\n\n'+
'@know Did you know?\n'+
'MYCIN, built at Stanford in the early 1970s, could recommend antibiotics for blood infections and '+
'in trials often matched specialist physicians. It was never used on a real patient — the ethical '+
'and legal questions of the day had no settled answers. Those same questions are still with us.\n\n'+

'@subsection Machine learning in one paragraph\n\n'+
'Machine learning is the part of AI where the rules are not written by a person but inferred from '+
'data. You supply examples, the model finds patterns, and it applies those patterns to cases it has '+
'never seen. This is powerful and it is fragile: a model trained on one hospital\'s patients may '+
'behave quite differently at another, because the patients, the prescribing habits and even the way '+
'data is recorded are all different.\n\n'+

'@section Where AI already sits in pharmacy\n\n'+
'You will meet AI long before anyone calls it that. Interaction checking, stock forecasting, '+
'prescription screening and adverse-event signal detection all use it in some form.\n\n'+
'@diagram flow Prescribe > Screen > Verify > Dispense > Counsel | Points in the medicines pathway where software assists the pharmacist\n\n'+
'At each of those points the software proposes and the pharmacist disposes. That distinction is the '+
'whole of professional practice in a digital setting: the system may be right far more often than '+
'it is wrong, and you are still answerable for the dose that reaches the patient.\n\n'+

'@subsection How these systems fail\n\n'+
'Three failure modes matter most in practice. **Distribution shift** — the model meets patients '+
'unlike its training data. **Automation bias** — the human stops checking because the machine is '+
'usually right. **Silent failure** — the system produces a confident answer with no signal that '+
'anything is wrong.\n\n'+
'@caution\n'+
'A model that fails silently is more dangerous than one that fails loudly. Before you rely on any '+
'tool, ask yourself: if this were wrong right now, how would I know?\n\n'+

'@activity Activity 1.1\n'+
'Ask two working pharmacists which parts of their day are already assisted by software. Write down '+
'which of those are automation and which involve any judgement. Bring your list to the next session.\n\n'+

'@keyterms\n'+
'Artificial intelligence: computing concerned with tasks that would ordinarily need human judgement.\n'+
'Machine learning: an approach in which rules are inferred from data rather than written by hand.\n'+
'Automation bias: the tendency to stop checking a system because it is usually correct.\n'+
'Distribution shift: the drop in performance when a model meets data unlike its training set.\n\n'+

'@summary\n'+
'- AI spans simple rules to learned models; the label alone tells you very little\n'+
'- Automation repeats an action, intelligence adapts to the case\n'+
'- A learned model reflects the data it was trained on and may not transfer between hospitals\n'+
'- The system proposes, the pharmacist disposes, and accountability does not transfer\n\n'+
'@exercise Exercises\n'+
'Q: Define artificial intelligence in one sentence, in your own words.\n'+
'Q: Give one example of automation and one of intelligence from a community pharmacy.\n'+
'Q: A model trained in one hospital performs poorly in another. Give two reasons why.\n'+
'Q: Explain automation bias and describe one way a pharmacy team can guard against it.\n'+
'Q: Why is a silent failure more dangerous than an obvious one? Answer with reference to patient safety.\n\n'+

'@chapter Digital Pharmacy & Information Systems\n\n'+
'@objectives\n'+
'- Describe the main information systems used in a modern pharmacy\n'+
'- Explain how an electronic prescription differs from a scanned paper one\n'+
'- Trace a medicine order through the systems that handle it\n'+
'- State why interoperability matters to patient safety\n\n'+

'@section The systems behind the counter\n\n'+
'A pharmacy runs on several systems that must agree with each other: the **pharmacy management '+
'system** that holds dispensing records and stock, the **electronic health record** that holds the '+
'clinical picture, and the **e-prescribing system** through which orders arrive.\n\n'+
'@diagram flow Prescriber > E-prescribing system > Pharmacy management system > Stock & labelling > Patient record | How an order moves between systems\n\n'+
'An **electronic prescription** is structured data: the drug, the strength, the form, the dose and '+
'the frequency each sit in their own field, so software can check them. A scanned image of a paper '+
'prescription is a picture. It may be perfectly legible to you and completely opaque to any checking '+
'system, which is why scanning is not digitisation.\n\n'+

'@know Did you know?\n'+
'Illegible handwriting was for decades among the most cited causes of medication error. '+
'E-prescribing removed that cause almost entirely — and introduced new ones, such as selecting the '+
'drug directly above or below the intended one in a dropdown list.\n\n'+

'@section Interoperability, and why it is a safety issue\n\n'+
'Interoperability is the ability of separate systems to exchange information and use it. Where it '+
'is absent, the pharmacist becomes the integration layer: re-keying data, reconciling lists by eye, '+
'and carrying in their head what the systems will not tell each other.\n\n'+
'@note\n'+
'Every manual re-entry of data is an opportunity for a transcription error. When you evaluate a new '+
'system, count how many times a human must retype something the computer already knows.\n\n'+

'@subsection Standards you will meet\n\n'+
'Coding systems give different software a shared vocabulary. Without them, "paracetamol", '+
'"acetaminophen" and a local product code are three unrelated strings.\n\n'+
'@table Common standards in pharmacy information systems\n'+
'Standard | What it does\n'+
'HL7 / FHIR | Messaging formats for exchanging clinical data between systems\n'+
'SNOMED CT | A clinical terminology for conditions, procedures and findings\n'+
'ICD | Classification of diseases, used widely for coding diagnoses\n'+
'Barcode / GS1 | Identifies the product, batch and expiry at the point of scanning\n\n'+

'@activity Activity 2.1\n'+
'Follow one prescription from arrival to hand-out in your placement pharmacy. List every system it '+
'passes through and every point where a human retypes information. Mark the riskiest step.\n\n'+

'@keyterms\n'+
'E-prescription: a prescription transmitted as structured data rather than as an image or on paper.\n'+
'Interoperability: the ability of separate systems to exchange information and act on it.\n'+
'FHIR: a modern HL7 standard for exchanging healthcare data between systems.\n'+
'Medication reconciliation: comparing medicine lists across care settings to resolve discrepancies.\n\n'+

'@summary\n'+
'- A pharmacy depends on several systems agreeing with one another\n'+
'- Structured e-prescriptions can be checked by software; scanned images cannot\n'+
'- Where interoperability fails, the pharmacist becomes the integration layer\n'+
'- Shared coding standards are what let separate systems mean the same thing\n\n'+
'@exercise Exercises\n'+
'Q: Explain the difference between an electronic prescription and a scanned paper one.\n'+
'Q: Name three systems a dispensed item passes through and state what each contributes.\n'+
'Q: Why is scanning a prescription not the same as digitising it?\n'+
'Q: Give two safety consequences of poor interoperability.\n'+
'Q: What problem do shared terminologies such as SNOMED CT solve?\n\n'+

'@chapter Ethics, Regulation & Data Protection in Digital Pharmacy\n\n'+
'@objectives\n'+
'- State the core duties owed to a patient whose data you hold\n'+
'- Apply the principles of the Digital Personal Data Protection Act, 2023 to pharmacy practice\n'+
'- Judge when consent is required and when it is not\n'+
'- Respond appropriately to a suspected data breach\n\n'+

'@section Confidentiality as a professional duty\n\n'+
'The duty of confidence is older than any statute. A patient tells you what they take, and what '+
'they are being treated for, on the understanding that you will use it to care for them and not for '+
'anything else. Digital systems do not soften that duty; they make it easier to breach at scale.\n\n'+
'@diagram pyramid Everything recorded > What you may access > What you need for this patient > What you may disclose | Access narrows as you move toward disclosure\n\n'+

'@subsection The DPDP Act, 2023 in practice\n\n'+
'India\'s Digital Personal Data Protection Act, 2023 frames the relationship in terms of a **Data '+
'Fiduciary** — the organisation holding the data — and the **Data Principal**, the person it '+
'describes. The word *fiduciary* is deliberate: it implies a duty of trust, not merely a contract.\n\n'+
'@table Duties that shape day-to-day practice\n'+
'Principle | What it means at the counter\n'+
'Purpose limitation | Use the data for the care you collected it for, nothing else\n'+
'Data minimisation | Collect only what that purpose actually requires\n'+
'Accuracy | Keep records correct and correct them when told they are wrong\n'+
'Storage limitation | Do not keep records longer than there is a reason to\n'+
'Security safeguards | Protect the data with measures proportionate to its sensitivity\n'+
'Breach notification | Report a personal data breach to the Board and to those affected\n\n'+

'@caution\n'+
'Looking up the record of a neighbour, a colleague or a public figure out of curiosity is a breach '+
'of confidence even if you tell no one. Access is logged. Curiosity is not a lawful purpose.\n\n'+

'@section When something goes wrong\n\n'+
'A breach is not only a hacker. A prescription emailed to the wrong address, a screen left unlocked, '+
'a list of patients on a lost phone — each is a personal data breach and each has a defined response.\n\n'+
'@diagram steps Contain the exposure > Assess what and whom > Notify as required > Support those affected > Fix the cause | The order matters: contain before you investigate\n\n'+
'@note\n'+
'Containment comes first because the harm is still growing while the exposure is open. Investigation '+
'that delays containment increases the number of people affected.\n\n'+

'@activity Activity 3.1\n'+
'Write the notification you would send to a patient whose dispensing history was emailed to the '+
'wrong person. Say what happened, what it means for them, what you have done, and what they can do. '+
'Keep it under 200 words and free of jargon.\n\n'+

'@keyterms\n'+
'Data Fiduciary: the organisation that determines the purpose and means of processing personal data.\n'+
'Data Principal: the individual the personal data relates to.\n'+
'Purpose limitation: the requirement to use data only for the purpose it was collected for.\n'+
'Personal data breach: any unauthorised processing, disclosure, loss or alteration of personal data.\n\n'+

'@summary\n'+
'- Confidentiality is a professional duty that digital systems make easier to breach at scale\n'+
'- The DPDP Act frames the pharmacy as a fiduciary — a relationship of trust\n'+
'- Purpose limitation and minimisation are the two principles you will apply most often\n'+
'- Contain a breach first, then assess, notify and fix the cause\n\n'+
'@exercise Exercises\n'+
'Q: Distinguish a Data Fiduciary from a Data Principal with a pharmacy example.\n'+
'Q: A colleague looks up a celebrity\'s record out of curiosity. Is this a breach? Justify your answer.\n'+
'Q: Why must containment precede investigation when a breach is discovered?\n'+
'Q: Give two examples of data minimisation in a community pharmacy.\n'+
'Q: List the four things a good breach notification to a patient must tell them.\n\n'+

'@chapter Computer Applications & Digital Documentation\n\n'+
'@objectives\n'+
'- Produce accurate, auditable pharmacy records in standard software\n'+
'- Apply the ALCOA+ principles to any record you create\n'+
'- Use spreadsheets safely for stock and dispensing data\n'+
'- Explain what an audit trail is and why it cannot be optional\n\n'+

'@section What makes a record trustworthy\n\n'+
'A record is not merely a note to yourself. It is evidence — of what was supplied, by whom, to whom '+
'and when. The **ALCOA+** principles describe what a trustworthy record looks like, and they apply '+
'as much to a spreadsheet as to a validated system.\n\n'+
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
'Overwriting a value destroys the original record. Corrections must be visible as corrections — the '+
'old value, the new value, who changed it and why. A record with no history cannot be audited.\n\n'+

'@section Spreadsheets: useful and dangerous\n\n'+
'Spreadsheets are everywhere in pharmacy because they are quick. They are also the source of a great '+
'many errors, because nothing stops you typing over a formula, and no one is told when you do.\n\n'+
'@diagram compare Safer practice | Common mistake ; Lock formula cells | Typing over a formula ; One fact per column | Mixing units in one column ; Dates as real dates | Dates as free text ; Keep a change log | Silent edits\n\n'+
'@note\n'+
'Sort a table with only one column selected and you will separate each row\'s data from its label. '+
'It is a silent, total corruption of the sheet. Always select the whole table before sorting.\n\n'+

'@subsection Documents that will be read by others\n\n'+
'Use styles rather than manual formatting so a document can be restructured without being retyped. '+
'Number pages. Put a version and a date in the footer of anything that will circulate. A document '+
'without a version number will be superseded and still be in use.\n\n'+

'@activity Activity 4.1\n'+
'Take any stock spreadsheet you have access to and audit it against ALCOA+. List each principle it '+
'fails and propose the smallest change that would fix it.\n\n'+

'@keyterms\n'+
'Audit trail: a secure, time-stamped record of who did what to a record and when.\n'+
'ALCOA+: the set of principles describing a trustworthy record.\n'+
'Version control: managing successive versions of a document so the current one is unambiguous.\n'+
'Contemporaneous: recorded at the time the event happened.\n\n'+

'@summary\n'+
'- A pharmacy record is evidence, and ALCOA+ describes what makes it trustworthy\n'+
'- Corrections must remain visible; overwriting destroys the original\n'+
'- Spreadsheets fail silently, so lock formulas and keep one fact per column\n'+
'- An audit trail is not an optional extra; without it a record cannot be defended\n\n'+
'@exercise Exercises\n'+
'Q: Expand ALCOA+ and give a pharmacy example of a record failing any three of the principles.\n'+
'Q: Why must a correction show the original value?\n'+
'Q: Describe two ways a spreadsheet can be corrupted without anyone noticing.\n'+
'Q: What belongs in the footer of a controlled document, and why?\n'+
'Q: A record is legible and accurate but was written up the next morning. Which principle fails?\n'
};

/* ============================================================
   MODULE 2
   ============================================================ */
T.m2={
 meta:{module:'2', title:'Digital Pharmacy, EHR & Telepharmacy',
       sub:'Systems, Records and Remote Care', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Digital Pharmacy & E-Prescription Systems\n\n'+
'@objectives\n'+
'- Describe the lifecycle of an electronic prescription\n'+
'- Identify the new classes of error that e-prescribing introduces\n'+
'- Verify an electronic prescription competently\n'+
'- Explain the legal status of an electronic signature on a prescription\n\n'+

'@section The lifecycle of an e-prescription\n\n'+
'An electronic prescription is created, signed, transmitted, received, verified, dispensed and '+
'archived. At each stage the record can be checked by software, which is the whole advantage — and '+
'at each stage something specific can go wrong.\n\n'+
'@diagram steps Create > Sign > Transmit > Verify > Dispense > Archive | The stages of an electronic prescription\n\n'+
'@know Did you know?\n'+
'Studies of e-prescribing consistently show large falls in errors caused by illegibility and '+
'ambiguous abbreviations — and a rise in **selection errors**, where the prescriber picks the item '+
'next to the intended one. The total error rate falls; the *kind* of error changes.\n\n'+

'@subsection Selection errors and look-alike lists\n\n'+
'A dropdown list sorted alphabetically places many dangerous neighbours side by side. The classic '+
'pairs are familiar to every pharmacist, and the digital list has not retired them.\n\n'+
'@caution\n'+
'When a prescription looks clinically odd, consider that the prescriber may have clicked the line '+
'above or below the one they meant. Check the indication, not just the drug.\n\n'+

'@section Verifying competently\n\n'+
'Verification is not proofreading. You are asking whether this medicine, at this dose, by this '+
'route, for this patient, makes clinical sense — and the system can only help you with part of it.\n\n'+
'@table What the system checks and what only you can check\n'+
'The system can check | Only you can judge\n'+
'Dose outside the usual range | Whether this patient is the exception\n'+
'A recorded interaction | Whether the combination is justified here\n'+
'A recorded allergy | Whether the reaction described is a true allergy\n'+
'Duplicate therapy | Whether duplication is deliberate\n\n'+

'@activity Activity 1.1\n'+
'Collect five alerts raised by a dispensing system in one shift. For each, decide whether it needed '+
'a pharmacist\'s judgement or could safely have been suppressed. Justify each decision.\n\n'+
'@keyterms\n'+
'Selection error: choosing the wrong item from a list of similar entries.\n'+
'Clinical verification: the pharmacist\'s judgement that a prescription is appropriate for the patient.\n'+
'Alert fatigue: desensitisation caused by too many low-value warnings.\n\n'+
'@summary\n'+
'- E-prescribing removes illegibility and introduces selection error\n'+
'- Verification is a clinical judgement, not proofreading\n'+
'- Software checks the rule; the pharmacist judges the patient\n\n'+
'@exercise Exercises\n'+
'Q: List the stages of an e-prescription lifecycle and one risk at each.\n'+
'Q: What is a selection error and why does an alphabetical dropdown encourage it?\n'+
'Q: Give two checks a system cannot make for you.\n'+
'Q: How would you detect that a prescriber had chosen an adjacent list item by mistake?\n'+
'Q: Define alert fatigue and give one way to reduce it without hiding real risk.\n\n'+

'@chapter Electronic Health Records (EHR) in Pharmacy Practice\n\n'+
'@objectives\n'+
'- Navigate an EHR to answer a specific clinical question\n'+
'- Perform a structured medication reconciliation\n'+
'- Judge the reliability of what an EHR tells you\n'+
'- Document a pharmacist intervention so another clinician can act on it\n\n'+

'@section Reading a record with a question in mind\n\n'+
'An EHR is large, and reading it end to end is neither possible nor useful. Competent practice means '+
'arriving with a question — *is this dose safe given the renal function?* — and going to the part of '+
'the record that answers it.\n\n'+
'@diagram flow Ask the question > Find the right section > Check how old the data is > Decide > Record the decision | Using a record purposefully\n\n'+
'@note\n'+
'Always look at the date of a result before you use it. A creatinine from four months ago tells you '+
'about a patient who no longer exists.\n\n'+

'@section Medication reconciliation\n\n'+
'Reconciliation compares what the patient is actually taking with what the record says, at every '+
'transition of care. It is among the highest-value things a pharmacist does, and it is unglamorous.\n\n'+
'@diagram steps Collect the best possible history > Compare with the current chart > Identify discrepancies > Resolve with the prescriber > Document | The reconciliation sequence\n\n'+
'@table Types of discrepancy\n'+
'Type | Example\n'+
'Omission | A regular medicine missing from the admission chart\n'+
'Commission | A medicine on the chart the patient never took\n'+
'Dose discrepancy | Chart says 10 mg, patient takes 5 mg\n'+
'Duplication | Two products containing the same active ingredient\n\n'+

'@activity Activity 2.1\n'+
'Take a medicines history from a volunteer playing a patient on six medicines, two of which they '+
'buy over the counter and do not think of as medicines. Note what your questions missed.\n\n'+
'@keyterms\n'+
'Best possible medication history: a systematic history verified against more than one source.\n'+
'Discrepancy: any unexplained difference between two accounts of a patient\'s medicines.\n'+
'Transition of care: admission, transfer or discharge — the points where lists diverge.\n\n'+
'@summary\n'+
'- Read a record with a specific question, and check how old the data is\n'+
'- Reconciliation at transitions of care catches errors nothing else will\n'+
'- Patients often omit inhalers, drops, injections and anything bought over the counter\n\n'+
'@exercise Exercises\n'+
'Q: Why should you check the date of a laboratory result before acting on it?\n'+
'Q: Define the best possible medication history and name two sources you would use.\n'+
'Q: Classify: the chart omits the patient\'s regular levothyroxine. What kind of discrepancy is this?\n'+
'Q: Which medicines do patients most often fail to mention, and why?\n'+
'Q: How should a pharmacist document an intervention so a doctor can act on it?\n\n'+

'@chapter Telepharmacy & Remote Patient Care\n\n'+
'@objectives\n'+
'- Describe the models of telepharmacy in use\n'+
'- Conduct a structured remote consultation\n'+
'- Recognise when remote care is not appropriate\n'+
'- Apply confidentiality standards to a consultation you cannot physically control\n\n'+

'@section Models of remote practice\n\n'+
'Telepharmacy covers remote dispensing supervision, remote clinical review and direct patient '+
'consultation by video or telephone. What they share is that you cannot see everything.\n\n'+
'@diagram compare In person | Remote ; You see the patient | You see what the camera shows ; You control the room | You do not ; Physical checks possible | Must be described to you\n\n'+
'@caution\n'+
'You cannot confirm who else is in the room. Before discussing anything sensitive, ask whether the '+
'patient is able to speak freely. A patient may not be alone by choice.\n\n'+

'@section Structuring a remote consultation\n\n'+
'Structure matters more at a distance, because the informal cues that keep a face-to-face '+
'conversation on track are missing.\n\n'+
'@diagram steps Confirm identity > Confirm privacy > Establish the concern > Explore and check > Agree a plan > Safety-net | A structured remote consultation\n\n'+
'The **safety-net** is the part most often left out and the part that matters most: what should '+
'happen if things do not go as expected, by when, and who to contact.\n\n'+
'@activity Activity 3.1\n'+
'Role-play a five-minute remote counselling session on a new inhaler. Your partner should '+
'deliberately misuse the device off camera. Notice how you discover it — or fail to.\n\n'+
'@keyterms\n'+
'Telepharmacy: pharmaceutical care delivered at a distance using telecommunications.\n'+
'Safety-netting: telling the patient what to watch for, what to do and by when.\n'+
'Red flag: a symptom that requires escalation rather than remote management.\n\n'+
'@summary\n'+
'- Remote care changes what you can observe, not what you are responsible for\n'+
'- Confirm identity and privacy before anything clinical\n'+
'- Structure and safety-netting matter more, not less, at a distance\n\n'+
'@exercise Exercises\n'+
'Q: Name three models of telepharmacy and one risk specific to each.\n'+
'Q: Why must you ask whether a patient can speak freely?\n'+
'Q: What is safety-netting and what three things must it state?\n'+
'Q: Give two situations where a remote consultation should be converted to a face-to-face one.\n'+
'Q: How would you verify inhaler technique remotely, and what are the limits of your verification?\n\n'+

'@chapter Digital Inventory, ADR & Compliance Systems\n\n'+
'@objectives\n'+
'- Apply FEFO principles in a digital stock system\n'+
'- Interpret basic inventory measures\n'+
'- Report an adverse drug reaction through the correct channel\n'+
'- Explain what a compliance system is auditing\n\n'+

'@section Stock control that a computer can help with\n\n'+
'Digital inventory systems can enforce **FEFO** — first expired, first out — which is not the same '+
'as first in, first out. A pack received today may expire before one received last year.\n\n'+
'@caution\n'+
'FIFO and FEFO give different answers whenever shelf lives differ. Dispensing by receipt order '+
'rather than expiry order is how stock is allowed to expire on the shelf.\n\n'+
'@table Measures worth understanding\n'+
'Measure | What it tells you\n'+
'Stock turnover | How many times stock is used and replaced in a period\n'+
'Days of cover | How long current stock will last at current usage\n'+
'Stock-out rate | How often an item is unavailable when needed\n'+
'Wastage rate | The proportion of stock discarded, usually on expiry\n\n'+
'@diagram bar Days of cover target 30 > Fast movers 12 > Slow movers 90 | Cover differs sharply by product class\n\n'+

'@section Reporting an adverse drug reaction\n\n'+
'A suspected ADR should be reported even when you are uncertain the medicine caused it. Certainty is '+
'not the threshold; suspicion is. Signal detection depends on volume, and a report you withhold is '+
'a signal nobody sees.\n\n'+
'@diagram flow Suspect > Record the four minimum elements > Assess seriousness > Submit > Follow up | Reporting pathway\n\n'+
'@note\n'+
'A valid report needs four things at minimum: an identifiable patient, an identifiable reporter, a '+
'suspect medicine, and a suspected reaction. Without all four it cannot be processed.\n\n'+
'@activity Activity 4.1\n'+
'Complete a suspected ADR report for a patient who developed a rash five days after starting a new '+
'antibiotic. Note which fields you had to guess at, and what you would ask to fill them properly.\n\n'+
'@keyterms\n'+
'FEFO: first expired, first out — issuing the shortest-dated stock first.\n'+
'Adverse drug reaction: a harmful, unintended response to a medicine at normal doses.\n'+
'Signal: information suggesting a new or changed association between a drug and an event.\n'+
'Days of cover: how long current stock will last at the current rate of use.\n\n'+
'@summary\n'+
'- FEFO and FIFO differ whenever shelf lives differ, and only FEFO prevents expiry waste\n'+
'- Inventory measures turn stock into decisions rather than a number on a shelf\n'+
'- Report suspected ADRs on suspicion, not certainty\n'+
'- Four minimum elements make a report valid\n\n'+
'@exercise Exercises\n'+
'Q: Explain the difference between FIFO and FEFO with a worked example.\n'+
'Q: Define days of cover and state why it differs between fast and slow movers.\n'+
'Q: List the four minimum elements of a valid ADR report.\n'+
'Q: Why should an ADR be reported when causality is uncertain?\n'+
'Q: A high wastage rate is found on one shelf. Give three possible causes and how you would test each.\n'
};

/* ============================================================
   MODULE 3
   ============================================================ */
T.m3={
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
   ============================================================ */
T.m4={
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
   ============================================================ */
T.m5={
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
   ============================================================ */
T.m6={
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
   ============================================================ */
T.m7={
 meta:{module:'7', title:'Robotics & Automation in Pharmacy Practice',
       sub:'Machines, Workflow and Quality', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter Introduction to Pharmacy Robotics\n\n'+
'@objectives\n'+
'- Describe the types of automation used in pharmacy\n'+
'- Explain what automation does and does not remove\n'+
'- Identify the new risks automation introduces\n'+
'- Judge where automation is worth its cost\n\n'+
'@section What the machines do\n\n'+
'Pharmacy automation covers robotic dispensing cabinets, carousel storage, automated packaging, '+
'compounding devices and transport systems. What they have in common is that they perform a defined '+
'physical task consistently, without tiring.\n\n'+
'@diagram compare Machines are better at | People are better at ; Repetition without fatigue | Judgement in an unfamiliar case ; Exact counting | Noticing that something is odd ; Working overnight | Explaining to a frightened patient ; Perfect audit logging | Deciding when the rule should bend\n\n'+
'@section What automation does not remove\n\n'+
'Automation removes the *execution* error, not the *decision* error. A robot will dispense the wrong '+
'medicine perfectly if the wrong medicine was selected, and it will do so faster and more reliably '+
'than a human could.\n\n'+
'@caution\n'+
'Automating a bad process gives you a fast, consistent bad process. Map and fix the workflow before '+
'you automate it, never after.\n\n'+
'@section New risks\n\n'+
'@table Risks that arrive with the machine\n'+
'Risk | Description\n'+
'Loading error | Wrong product placed in a canister, repeated on every dispense\n'+
'Automation bias | Staff stop checking output because it is usually right\n'+
'Single point of failure | One machine down halts the whole workflow\n'+
'Skill fade | Manual competence decays and cannot be recovered quickly\n'+
'Calibration drift | Gradual loss of accuracy with no obvious symptom\n\n'+
'@note\n'+
'A loading error is systematically dangerous because it is not a single mistake — it is one mistake '+
'reproduced faithfully on every subsequent dispense until someone notices.\n\n'+
'@activity Activity 1.1\n'+
'Visit or research an automated dispensing installation. List three tasks it removed from staff and '+
'three new tasks it created.\n\n'+
'@keyterms\n'+
'Automation: machinery performing a defined task without continuous human control.\n'+
'Loading error: an error introduced when stock is placed into an automated system.\n'+
'Skill fade: loss of manual competence through disuse.\n'+
'Downtime procedure: the agreed manual process for when automation fails.\n\n'+
'@summary\n'+
'- Automation excels at repetition and is poor at judgement\n'+
'- It removes execution errors and leaves decision errors untouched\n'+
'- Loading errors are reproduced on every subsequent dispense\n'+
'- Fix the workflow before automating it\n\n'+
'@exercise Exercises\n'+
'Q: Name four types of pharmacy automation and their function.\n'+
'Q: Explain why automating a poor process makes it worse.\n'+
'Q: Why is a loading error more dangerous than a single manual picking error?\n'+
'Q: Define skill fade and give one way to prevent it.\n'+
'Q: What must a downtime procedure specify?\n\n'+

'@chapter Automated Dispensing & Storage Systems\n\n'+
'@objectives\n'+
'- Describe how automated dispensing cabinets work\n'+
'- Explain the controls that make them safe\n'+
'- Perform stock reconciliation on an automated system\n'+
'- Respond correctly to a discrepancy\n\n'+
'@section How the cabinet works\n\n'+
'An automated dispensing cabinet holds medicines in controlled compartments, releases them against '+
'an authorised request, and records every transaction with a user, a time and a quantity.\n\n'+
'@diagram steps Authenticate the user > Select the patient and item > Cabinet opens only that pocket > Record the transaction > Reconcile against the count | The controlled release cycle\n\n'+
'@section The controls that matter\n\n'+
'@table Safety controls\n'+
'Control | Purpose\n'+
'Individual login | Every action is attributable\n'+
'Single-pocket opening | Prevents picking from an adjacent compartment\n'+
'Blind count on removal | The user counts before seeing the expected number\n'+
'Override list | Restricts what may be taken before pharmacist review\n'+
'Automatic discrepancy flag | Surfaces a mismatch immediately, not at month end\n\n'+
'@note\n'+
'A **blind count** matters because being shown the expected number invites you to confirm it. '+
'Counting first and comparing after is a real check.\n\n'+
'@caution\n'+
'Overrides exist for genuine emergencies. A high override rate means the stock list does not match '+
'clinical need — investigate the list, do not simply restrict the staff.\n\n'+
'@section Handling a discrepancy\n\n'+
'A discrepancy is a difference between the expected and actual count. It must be investigated at the '+
'time, by someone other than the person who created it where possible, and documented — particularly '+
'for controlled drugs.\n\n'+
'@activity Activity 2.1\n'+
'Given a cabinet transaction log with one unexplained discrepancy, write the investigation you would '+
'conduct: who you would speak to, what records you would compare, and what you would document.\n\n'+
'@keyterms\n'+
'Automated dispensing cabinet: a secure, computer-controlled medicine storage unit.\n'+
'Blind count: counting stock before the expected quantity is displayed.\n'+
'Override: removal of a medicine before pharmacist review, for urgent need.\n'+
'Discrepancy: a difference between recorded and actual stock.\n\n'+
'@summary\n'+
'- Cabinets combine controlled access with a complete audit trail\n'+
'- Single-pocket opening and blind counts are the core safety controls\n'+
'- A high override rate is a signal about the stock list, not the staff\n'+
'- Discrepancies are investigated at the time, not at month end\n\n'+
'@exercise Exercises\n'+
'Q: Describe the release cycle of an automated dispensing cabinet.\n'+
'Q: Why is a blind count more reliable than confirming a displayed number?\n'+
'Q: What does a persistently high override rate indicate?\n'+
'Q: State three things a discrepancy investigation must establish.\n'+
'Q: Why must every user have an individual login?\n\n'+

'@chapter Smart Packaging & Medication Tracking\n\n'+
'@objectives\n'+
'- Explain barcode and RFID identification in the medicines supply chain\n'+
'- Describe serialisation and its purpose\n'+
'- Outline how track-and-trace counters falsified medicines\n'+
'- Describe smart packaging for adherence\n\n'+
'@section Identifying a pack uniquely\n\n'+
'A barcode may identify a product; **serialisation** gives every individual pack its own identifier, '+
'so a specific pack can be followed and verified.\n\n'+
'@diagram flow Manufacturer serialises > Distributor scans > Pharmacy verifies > Pack decommissioned at supply | Track and trace through the chain\n\n'+
'@table Identification technologies\n'+
'Technology | Strength | Limitation\n'+
'Linear barcode | Cheap, universal | Holds little data, needs line of sight\n'+
'2D data matrix | Holds batch, expiry and serial | Still needs line of sight\n'+
'RFID | Reads many tags at once, no line of sight | Costlier, can be shielded by liquids and metals\n\n'+
'@know Did you know?\n'+
'Verifying a pack at the point of supply and **decommissioning** its serial number is what stops the '+
'same valid number appearing on many counterfeit packs. Without decommissioning, one genuine serial '+
'could authenticate an unlimited number of fakes.\n\n'+
'@section Packaging that supports adherence\n\n'+
'Smart blisters that record the time a dose was removed, and connected caps that log openings, '+
'produce objective adherence data. They record removal, not ingestion — a distinction that matters '+
'when interpreting the data.\n\n'+
'@caution\n'+
'Adherence monitoring collects sensitive behavioural data about a person\'s daily life. Consent, '+
'purpose limitation and clear retention rules are not optional extras here.\n\n'+
'@activity Activity 3.1\n'+
'Design the counselling conversation you would have before giving a patient a connected adherence '+
'device. State what you would tell them about who sees the data.\n\n'+
'@keyterms\n'+
'Serialisation: assigning a unique identifier to each individual pack.\n'+
'Decommissioning: retiring a serial number when the pack is supplied to a patient.\n'+
'RFID: radio-frequency identification, readable without line of sight.\n'+
'Falsified medicine: one with a false representation of identity, history or source.\n\n'+
'@summary\n'+
'- Serialisation identifies the pack, not merely the product\n'+
'- Decommissioning at supply is what defeats duplicated serials\n'+
'- RFID trades cost for reading many tags without line of sight\n'+
'- Adherence devices record removal and generate sensitive personal data\n\n'+
'@exercise Exercises\n'+
'Q: Distinguish a product barcode from a serialised pack identifier.\n'+
'Q: Why is decommissioning essential to track and trace?\n'+
'Q: Compare 2D data matrix and RFID on two dimensions.\n'+
'Q: What does an adherence device actually measure, and what does it not?\n'+
'Q: List three data-protection duties when issuing a connected adherence device.\n\n'+

'@chapter Workflow Optimisation & Quality Assurance\n\n'+
'@objectives\n'+
'- Map a pharmacy workflow and find its constraint\n'+
'- Apply basic improvement methods\n'+
'- Distinguish quality control from quality assurance\n'+
'- Run a meaningful root cause analysis\n\n'+
'@section Finding the constraint\n\n'+
'Throughput is set by the slowest step. Improving any other step increases work in progress without '+
'increasing output — a common and expensive mistake.\n\n'+
'@diagram bar Receive 40 > Verify 12 > Pick 30 > Check 25 > Hand out 35 | Items per hour by step; verification is the constraint\n\n'+
'@note\n'+
'In the figure above, adding staff to picking achieves nothing. Only relieving verification raises '+
'total output.\n\n'+
'@section Improvement methods\n\n'+
'@diagram cycle Plan > Do > Study > Act | The improvement cycle, run in small fast loops\n\n'+
'Small, rapid cycles beat large redesigns because you learn what actually happens before committing. '+
'Waste — waiting, unnecessary movement, rework, over-processing — is usually visible once a process '+
'is drawn honestly rather than as intended.\n\n'+
'@section Quality control and quality assurance\n\n'+
'@diagram compare Quality control | Quality assurance ; Detects defects in output | Designs the system so defects are unlikely ; Checking the finished item | Validating the process ; Reactive | Preventive\n\n'+
'@section Root cause analysis\n\n'+
'When something goes wrong, the person at the end of the chain is the easiest thing to blame and '+
'almost never the cause. Ask *why* until you reach something the organisation controls.\n\n'+
'@caution\n'+
'If your root cause analysis concludes "staff member was careless — retrain", it has stopped too '+
'early. Retraining an individual does not prevent the next person meeting the same trap.\n\n'+
'@activity Activity 4.1\n'+
'Take a real near-miss from your placement. Ask "why" five times. Note the point at which the answer '+
'stopped being about a person and started being about the system.\n\n'+
'@keyterms\n'+
'Constraint: the step that limits the throughput of the whole process.\n'+
'PDSA cycle: Plan–Do–Study–Act, a structure for small improvement experiments.\n'+
'Quality assurance: designing a process so defects are unlikely.\n'+
'Root cause analysis: structured enquiry into the underlying cause of an incident.\n\n'+
'@summary\n'+
'- Only the constraint limits throughput; improving elsewhere adds work in progress\n'+
'- Small rapid PDSA cycles outperform large redesigns\n'+
'- Control detects defects; assurance prevents them\n'+
'- A root cause that names a person has stopped too early\n\n'+
'@exercise Exercises\n'+
'Q: Define a constraint and explain why improving other steps does not help.\n'+
'Q: Describe the PDSA cycle and why small cycles are preferred.\n'+
'Q: Contrast quality control with quality assurance.\n'+
'Q: Give four categories of waste visible in a dispensing workflow.\n'+
'Q: Why is "retrain the individual" usually an inadequate root cause?\n'
};

/* ============================================================
   MODULE 8
   ============================================================ */
T.m8={
 meta:{module:'8', title:'AI-Enabled Clinical Case Studies & Simulations',
       sub:'Putting It Together', prog:'Diploma in Pharmacy AI',
       ed:'First Edition · 2026', auth:'Department of Pharmacy AI'},
 src:
'@chapter AI-Based Prescription Review & Safety Audits\n\n'+
'@objectives\n'+
'- Conduct a structured prescription review\n'+
'- Use AI screening output without deferring to it\n'+
'- Plan and carry out a safety audit\n'+
'- Report audit findings so that practice changes\n\n'+
'@section A structured review\n\n'+
'A review that follows the same sequence every time misses less than one driven by whatever catches '+
'the eye first.\n\n'+
'@diagram steps Right patient > Right drug > Right dose > Right route > Right time > Documented | The sequence, every time\n\n'+
'Beyond the six checks, ask the clinical questions: is there an indication for every medicine, and a '+
'medicine for every indication? Is anything being used to treat the side effect of something else?\n\n'+
'@section Using AI screening properly\n\n'+
'AI screening ranks prescriptions by predicted risk. Treat the ranking as a reading order, not a '+
'verdict — a prescription ranked low is not thereby cleared.\n\n'+
'@caution\n'+
'The most dangerous outcome of risk ranking is that low-ranked items stop being reviewed at all. '+
'Ranking should change the order of your attention, never its coverage.\n\n'+
'@section The audit cycle\n\n'+
'@diagram cycle Set the standard > Measure practice > Compare and analyse > Change > Re-measure | An audit that never re-measures is a survey\n\n'+
'@note\n'+
'The re-measurement is the audit. Without it you have described a problem and demonstrated nothing '+
'about whether your change helped.\n\n'+
'@activity Activity 1.1\n'+
'Choose one prescribing standard. Audit twenty prescriptions against it, propose one change, and '+
'state exactly how and when you would re-measure.\n\n'+
'@keyterms\n'+
'Clinical audit: measuring practice against a standard and re-measuring after change.\n'+
'Risk stratification: ordering cases by predicted risk to guide attention.\n'+
'Standard: an explicit statement of expected practice against which you measure.\n\n'+
'@summary\n'+
'- A fixed review sequence misses less than opportunistic checking\n'+
'- AI ranking changes the order of attention, not its coverage\n'+
'- An audit without re-measurement is only a survey\n\n'+
'@exercise Exercises\n'+
'Q: List the six rights of a prescription review and one further clinical question.\n'+
'Q: Why must a low AI risk score not remove a prescription from review?\n'+
'Q: Draw the audit cycle and explain which step is most often omitted.\n'+
'Q: What makes a standard auditable?\n'+
'Q: Give an example of a medicine prescribed to treat another medicine\'s side effect.\n\n'+

'@chapter Drug Interaction & Dose Optimisation Simulations\n\n'+
'@objectives\n'+
'- Work a complex polypharmacy case systematically\n'+
'- Prioritise which of several interactions to act on\n'+
'- Recommend a dose change and justify it\n'+
'- Communicate a recommendation to a prescriber\n\n'+
'@section Working a polypharmacy case\n\n'+
'With ten medicines, the number of possible pairs is forty-five. You cannot act on all of them, so '+
'the skill is deciding which few matter for this patient today.\n\n'+
'@diagram steps List everything taken > Flag interactions > Rank by actual risk > Decide on the top few > Communicate and monitor | Triage is the core skill\n\n'+
'@table Ranking what to act on\n'+
'Factor | Raises priority when\n'+
'Severity of possible outcome | Harm would be serious or irreversible\n'+
'Likelihood in this patient | Risk factors are present\n'+
'Therapeutic index | The margin is narrow\n'+
'Monitorability | No practical way to monitor\n'+
'Ease of change | A safe alternative exists\n\n'+
'@section Making the recommendation\n\n'+
'A recommendation that is not acted on has failed. Use a structured handover — situation, '+
'background, assessment, recommendation — and make the recommendation specific enough to enact.\n\n'+
'@caution\n'+
'"Please review the anticoagulation" is not a recommendation. "Suggest reducing warfarin to 3 mg '+
'daily and rechecking INR in three days" is one.\n\n'+
'@activity Activity 2.1\n'+
'Take a patient on eight or more medicines. Identify every interaction, rank them, and write an SBAR '+
'note recommending action on the top two only.\n\n'+
'@keyterms\n'+
'Polypharmacy: the concurrent use of multiple medicines by one patient.\n'+
'SBAR: Situation, Background, Assessment, Recommendation — a handover structure.\n'+
'Deprescribing: planned withdrawal of a medicine no longer of net benefit.\n\n'+
'@summary\n'+
'- The number of interactions grows far faster than the number of medicines\n'+
'- Triage by consequence, likelihood, index, monitorability and ease of change\n'+
'- A vague recommendation is not a recommendation\n\n'+
'@exercise Exercises\n'+
'Q: How many possible pairs exist among ten medicines, and why does this matter?\n'+
'Q: Name five factors that raise the priority of an interaction.\n'+
'Q: Rewrite "please review the diabetes medication" as a specific recommendation.\n'+
'Q: What does SBAR stand for and why is it used?\n'+
'Q: When is monitoring a better answer than stopping a drug?\n\n'+

'@chapter Clinical & Pharmacogenomic Case Simulations\n\n'+
'@objectives\n'+
'- Integrate genomic, clinical and laboratory information in one decision\n'+
'- Explain a genomic result to a patient\n'+
'- Recognise the limits of pharmacogenomic testing\n'+
'- Document a genomically informed decision\n\n'+
'@section Bringing the strands together\n\n'+
'A genomic result is one input among several. Renal function, age, interacting medicines, adherence '+
'and the patient\'s own priorities all bear on the same decision, and they can point in opposite '+
'directions.\n\n'+
'@diagram flow Genomic result > Clinical picture > Laboratory values > Current medicines > Patient priorities > Decision | No single strand decides\n\n'+
'@caution\n'+
'A pharmacogenomic result describes a probability, not a certainty. A normal metaboliser can still '+
'have an unexpected reaction, and a poor metaboliser may tolerate a standard dose.\n\n'+
'@section Explaining a result\n\n'+
'Patients frequently hear a genetic result as fixed and total — "the drug will not work for me". '+
'Explain what was tested, what it changes, and importantly what it does not cover.\n\n'+
'@table What to cover in the conversation\n'+
'Point | Why\n'+
'What was tested | The result covers specific genes, not all medicines\n'+
'What it changes now | The immediate dosing or drug choice\n'+
'What it does not tell us | Other drugs, other genes, future conditions\n'+
'Who else it might concern | Genetic results can have family implications\n'+
'Where it is recorded | So it informs future prescribing\n\n'+
'@note\n'+
'A pharmacogenomic result is durable — it does not change. Record it where future prescribers will '+
'see it, or the test\'s value is lost the moment the patient moves setting.\n\n'+
'@activity Activity 3.1\n'+
'Write, in plain language and under 150 words, an explanation for a patient who is a poor '+
'metaboliser of a common drug. Avoid the words "gene" and "enzyme" and see whether it still works.\n\n'+
'@keyterms\n'+
'Phenotype: the observable characteristic, here the metaboliser status.\n'+
'Actionable variant: a genetic result that changes a prescribing decision.\n'+
'Incidental finding: a result of significance found while looking for something else.\n\n'+
'@summary\n'+
'- Genomic data is one input among several and may conflict with others\n'+
'- Results are probabilistic, not deterministic\n'+
'- Durable results must be recorded where future prescribers will find them\n\n'+
'@exercise Exercises\n'+
'Q: Name five inputs to a genomically informed prescribing decision.\n'+
'Q: Why is a pharmacogenomic result probabilistic rather than definitive?\n'+
'Q: List five things to cover when explaining a result to a patient.\n'+
'Q: Why does a durable result need careful recording?\n'+
'Q: A genomic result conflicts with the clinical picture. How do you proceed?\n\n'+

'@chapter Digital Patient Care & Pharmacy Operations\n\n'+
'@objectives\n'+
'- Integrate the digital tools of the programme into one workflow\n'+
'- Prioritise competing demands in a live pharmacy\n'+
'- Maintain professional standards under time pressure\n'+
'- Reflect on your own practice systematically\n\n'+
'@section The day as a whole\n\n'+
'Everything in this programme meets in a single shift: prescriptions arriving electronically, alerts '+
'to triage, stock to manage, a patient waiting for counselling, an ADR to report, and an audit due.\n\n'+
'@diagram compare Urgent | Important ; A patient waiting at the counter | The audit due this month ; A critical interaction alert | Reviewing the stock list ; Cold-chain excursion now | Updating the SOP\n\n'+
'@note\n'+
'Urgent and important are different. The work that is important but never urgent — audits, '+
'procedure updates, stock list review — is the work that quietly stops happening, and its absence '+
'shows up later as an incident.\n\n'+
'@section Standards under pressure\n\n'+
'Pressure is when standards matter, because that is when they are inconvenient. The checks most '+
'often skipped when busy are the independent double check, the identity check, and reading the alert '+
'before dismissing it — which are precisely the checks that prevent the most serious harm.\n\n'+
'@caution\n'+
'"We were busy" has never been an acceptable account of a serious medication error. If the workload '+
'genuinely makes safe practice impossible, that itself is the incident to escalate.\n\n'+
'@section Reflecting usefully\n\n'+
'@diagram steps What happened > What I did > What I now think > What I will do differently > How I will know it worked | Reflection that ends in a change\n\n'+
'@activity Activity 4.1\n'+
'Keep a log for one week of every decision where you were uncertain. At the end, group them. The '+
'largest group is your next learning objective — state it as something you can measure.\n\n'+
'@keyterms\n'+
'Prioritisation: allocating limited attention across competing demands.\n'+
'Reflective practice: structured review of one\'s own practice leading to change.\n'+
'Escalation: raising a concern to someone with the authority to act on it.\n\n'+
'@summary\n'+
'- The programme\'s tools meet in a single shift and compete for attention\n'+
'- Important-but-not-urgent work disappears first and returns as incidents\n'+
'- The checks skipped under pressure are the ones that prevent the worst harm\n'+
'- Reflection that does not end in a change is not reflection\n\n'+
'@exercise Exercises\n'+
'Q: Distinguish urgent from important with two pharmacy examples of each.\n'+
'Q: Which three checks are most often skipped under pressure, and what does each prevent?\n'+
'Q: Why is "we were busy" not an acceptable account of a serious error?\n'+
'Q: When does workload itself become the incident to escalate?\n'+
'Q: Describe the steps of a reflective cycle that ends in measurable change.\n'
};

window.ALIZON_TEXTBOOKS=T;
})();
