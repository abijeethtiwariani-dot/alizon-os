/* alizon-book-m7.js — Module 7 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m7 = {
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
   ============================================================ */;
})();
