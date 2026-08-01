/* alizon-book-m2.js — Module 2 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m2 = {
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
   ============================================================ */;
})();
