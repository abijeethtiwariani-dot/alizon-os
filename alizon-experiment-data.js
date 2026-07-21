/* alizon-experiment-data.js
   Central content for every practical's standard experiment sheet.
   A practical includes: <div id="expBrief" data-exp="KEY"></div>
   plus alizon-experiment-brief.js + this file. On load it renders the matching entry.
*/
(function(){
  var DATA={
   dispensing:{
    practicalNo:'Module 2 · Unit 1 · Practical 1',
    title:'Digital Dispensing Using FEFO/FIFO Principles & Patient Counselling',
    aim:'To accurately dispense prescribed medicines using a digital pharmacy system by selecting the correct drug on <b>FEFO/FIFO</b> principles, verifying product details, documenting the process and counselling the patient.',
    principle:'Safe dispensing means giving the <b>right drug, right strength, right quantity to the right patient</b>, and rotating stock so medicines are used before they expire. <b>FEFO (First Expiry First Out)</b> dispenses the earliest-expiry batch first to minimise wastage; <b>FIFO (First In First Out)</b> is used when expiry dates are identical, dispensing the earliest-received stock. Expired or wrong-strength products must never be dispensed.',
    theory:'Every pack carries a batch number, manufacturing date and expiry date, linked in a digital inventory to stock levels. Dispensing errors (wrong drug/strength/quantity, expired stock) are a major cause of medication harm. Step-by-step verification and accurate records (dispensing label, inventory update, electronic medication record) prevent errors and support traceability and product recall.',
    requirements:['Digital pharmacy / e-prescription system','Patient electronic prescription','Digital drug rack with batch, expiry &amp; stock data','Dispensing-label generator','Patient medication record'],
    procedure:['Verify patient identity and prescription validity.','Locate the prescribed medicine; verify drug name, strength and dosage form.','Check batch number, manufacturing and expiry dates, and stock availability.','Apply <b>FEFO</b> (earliest expiry first); apply <b>FIFO</b> if expiry dates are identical.','Dispense the correct quantity; if a batch is short, complete from the next FEFO batch and record both.','Generate the dispensing label and update the inventory and medication record.','Counsel the patient and document the counselling.'],
    method:['Read the prescription carefully — confirm the exact drug and strength (watch look-alike strengths).','Immediately ignore any expired or wrong-strength batch on the rack.','Among correct-strength, in-date batches, pick the one with the <b>earliest expiry</b> (FEFO).','If two valid batches share the same expiry, choose the earliest received (FIFO).','Enter the exact quantity; split across batches only if needed and document each batch.','Generate the label, update stock, then complete the counselling checklist.']
   },
   adr:{
    practicalNo:'Module 2 · Unit 4 · Practical 4',
    title:'Electronic ADR Reporting & Pharmacovigilance',
    aim:'To identify, document, assess and electronically report a suspected <b>Adverse Drug Reaction (ADR)</b> using a digital pharmacovigilance reporting system.',
    principle:'An ADR is any <b>harmful, unintended response to a medicine at a normal dose</b>. Pharmacovigilance detects, assesses and prevents such reactions. <b>Causality</b> — how confident we are the drug caused the reaction — is judged with the <b>WHO-UMC scale</b>: time relationship, other possible causes, response to stopping the drug (dechallenge) and to restarting it (rechallenge).',
    theory:'ADRs are classified by type (Type A dose-related, Type B idiosyncratic), by severity, and as <b>serious</b> (death, hospitalisation, disability, life-threatening) or non-serious. Recognising, documenting and reporting ADRs to a pharmacovigilance centre improves medication safety, informs regulators and protects future patients.',
    requirements:['Patient clinical history &amp; medication record','Electronic ADR reporting form','WHO-UMC causality criteria','Suspected-drug and reaction details','Pharmacovigilance-centre link'],
    procedure:['Review the patient condition and prescribed medicines.','Identify the suspected reaction and the suspected drug.','Assess severity and whether the reaction is serious or non-serious.','Assess causality using the WHO-UMC criteria (time link, other causes, dechallenge, rechallenge).','Complete the electronic ADR form (patient, drug, reaction, management, reporter).','Submit to the Pharmacovigilance Centre and counsel the patient.'],
    method:['Read the patient condition — note when the reaction started relative to the drug.','Match the reaction to a known effect of the drug to identify the suspected medicine.','Decide seriousness: could it cause death, hospitalisation or lasting harm? Then it is serious.','Work the WHO criteria one by one, then choose the causality category they point to.','Fill every required field and record the management taken.','Submit, then counsel on what happened, what to avoid and when to seek help.']
   },
   cdss:{
    practicalNo:'Module 3 · Unit 1 · Practical 1',
    title:'Clinical Decision Support Systems (CDSS) — Alert Management',
    aim:'To review a patient’s EHR and new prescription, interpret the alerts generated by a <b>Clinical Decision Support System</b>, triage each by severity, take the correct action and manage alert fatigue safely.',
    principle:'A CDSS applies a <b>knowledge base</b> of clinical rules (interactions, allergies, dosing, duplicates) to patient data from the EHR (via an <b>inference engine</b>) and raises <b>alerts</b> at the point of prescribing. The pharmacist judges each alert’s clinical importance and acts appropriately — critical alerts are never overridden, while low-value alerts are accepted to avoid alert fatigue.',
    theory:'CDSS components are the knowledge base, inference engine, EHR/communication link and the alert interface. Alerts differ in clinical value; too many low-value alerts cause <b>alert fatigue</b>, where important warnings may be missed. Good governance — severity triage, documented overrides and escalation — improves prescribing safety.',
    requirements:['CDSS console','Patient EHR (allergies, current medicines, labs, conditions)','New electronic prescription','Interaction / allergy / dose knowledge base','Alert severity &amp; action framework'],
    procedure:['Review the new prescription and the linked patient EHR.','Read each CDSS alert generated.','Classify each alert as Critical, Major or Minor.','Choose the correct action (accept, override with reason, adjust, contact prescriber, or do not dispense).','Never override a critical alert; avoid over-escalating minor ones.','Document the decision and any override reasons, escalating when required.'],
    method:['For each alert, check it against the patient EHR — is the interaction/allergy real here?','Grade severity: serious harm (Critical), clinically important (Major) or low value (Minor)?','Match the action to the severity — critical → hold/contact/do-not-dispense; minor → accept/override.','Type a clear reason whenever you override.','Summarise your overall clinical decision before submitting.']
   },
   antimicrobial:{
    practicalNo:'Module 3 · Unit 2 · Practical 2',
    title:'Selection of Safe & Effective Antimicrobial Therapy',
    aim:'To select the safest, most effective and most appropriate antimicrobial for a patient using the infection, culture &amp; sensitivity (antibiogram), allergy, kidney function and pregnancy status, applying <b>antimicrobial-stewardship</b> principles.',
    principle:'Antimicrobials act selectively on bacteria — the cell wall, protein synthesis, DNA or metabolic pathways human cells lack. A rational choice must be <b>Effective</b> (organism sensitive on the antibiogram — a large zone of inhibition), <b>Safe</b> (no allergy or contraindication for pregnancy/renal function) and <b>Appropriate</b> (the narrowest-spectrum agent that works). Overuse of broad-spectrum agents drives <b>antimicrobial resistance</b>.',
    theory:'The antibiogram (disc-diffusion / MIC) shows sensitivity as a zone of inhibition. Antibiotics differ in spectrum (narrow vs broad), route, tissue penetration and safety in pregnancy/renal impairment. <b>Empirical</b> therapy covers likely organisms before cultures return; <b>targeted</b> therapy and <b>de-escalation</b> follow the sensitivity result. Stewardship (right drug, dose, duration, de-escalation) preserves antibiotic effectiveness.',
    requirements:['Patient clinical scenario &amp; infection site','Culture &amp; sensitivity report (antibiogram)','Allergy, pregnancy and renal-function data','Antimicrobial formulary / options','Antimicrobial-stewardship guidance'],
    procedure:['Confirm the infection and likely / cultured organism.','Read the antibiogram for sensitive vs resistant agents.','Check allergy, pregnancy, kidney/liver function and interactions.','Shortlist agents that are both effective and safe.','Choose the narrowest effective agent, correct dose, route and duration.','In severe infection start broad empirical therapy, then de-escalate on cultures; document and counsel.'],
    method:['Identify the organism from the site and culture.','Rule out any agent the organism is resistant to (ineffective).','Rule out any agent unsafe for this patient (allergy / pregnancy / renal).','From what remains, pick the narrowest-spectrum option (stewardship).','Confirm you checked allergy, renal and pregnancy, and record your rationale.']
   },
   drugdiscovery:{
    practicalNo:'Module 1 · Unit 1 · Practical 1',
    title:'Designing a Drug-like Candidate using Machine Learning',
    aim:'To design a candidate drug molecule in-silico, correct faulty candidates, and evaluate its <b>drug-likeness</b> and predicted <b>oral bioavailability</b> using an AI (machine-learning) model.',
    principle:'Most oral drugs share physicochemical properties captured by <b>Lipinski’s Rule of Five</b> (MW ≤ 500, LogP ≤ 5, H-bond donors ≤ 5, acceptors ≤ 10) and <b>Veber’s rules</b> (rotatable bonds ≤ 10, TPSA ≤ 140). A machine-learning classifier learns the relationship between these descriptors and drug-likeness/bioavailability, screening candidates rapidly before laboratory work.',
    theory:'AI/ML/DL learn patterns from data. A logistic-regression classifier outputs a probability (0–1) of drug-likeness from molecular descriptors. High TPSA and molecular weight reduce membrane permeability and oral absorption; balanced lipophilicity (LogP ~2–3) improves it. In-silico screening cuts cost and time in early drug discovery.',
    requirements:['AI molecule synthesizer / design tool','Property sliders (MW, LogP, TPSA, H-bond donors/acceptors, rotatable bonds)','Machine-learning drug-likeness classifier','Lipinski &amp; Veber rule references','Built-in report generator'],
    procedure:['Load a molecular scaffold into the AI synthesizer.','Tune the physicochemical properties using the sliders.','Correct any candidate that violates Lipinski or Veber rules.','Read the AI gauges for predicted drug-likeness and oral bioavailability.','Select your best candidate and record its properties.','Generate the report with your results.'],
    method:['Start from a scaffold and watch the AI gauges as you adjust each property.','Keep MW ≤ 500 and LogP around 2–3; lower TPSA below ~90 to raise predicted bioavailability.','Fix any rule violation the model flags (e.g. too many H-bond donors).','Compare candidates and keep the one with the highest drug-likeness and bioavailability.','Name your best molecule and generate the report.']
   },
   ethics:{
    practicalNo:'Module 1 · Unit 3 · Practical',
    title:'Ethics, Regulation & Data Protection in Digital Pharmacy',
    aim:'To apply ethical, regulatory and data-protection principles to real digital-pharmacy scenarios — consent, confidentiality, EHR access, medication-error reporting and data security.',
    principle:'Digital pharmacy handles sensitive patient data and automated decisions. Ethical practice rests on <b>autonomy</b> (informed consent), <b>confidentiality</b> (need-to-know, role-based access), <b>beneficence / non-maleficence</b> and <b>justice</b>, within legal frameworks for data protection and pharmacovigilance. Honest reporting of medication errors improves safety.',
    theory:'Electronic health records are access-logged and role-based; accessing a record without a care relationship is a breach. Consent must be informed and documented, especially for substitution or data sharing. Data-protection rules govern storage, sharing and disclosure. Transparent error reporting — not concealment — is both ethical and required.',
    requirements:['Scenario-based digital-ethics simulator','Sample EHR &amp; consent records','Data-protection &amp; confidentiality rules','Medication-error reporting workflow','Self-assessment report tool'],
    procedure:['Read each scenario and identify the ethical / legal issue.','Decide the correct action based on consent, confidentiality and data-protection rules.','For EHR access, confirm a legitimate care relationship before viewing.','Document consent for any substitution or data sharing.','Report medication errors honestly through the correct workflow.','Complete the practical record and self-assessment.'],
    method:['For each case, ask: do I have consent, a care relationship and a lawful basis?','Choose “need-to-know” access — no care role, no access.','Be transparent — inform patients and document consent for substitutions.','Never conceal an error; report it through the proper channel.','Reflect on each decision in your report.']
   },
   clinicalsim:{
    practicalNo:'Module 8 · Practical',
    title:'Clinical Simulation Suite',
    aim:'To manage simulated virtual patients — interpreting clinical data, screening drug interactions, adjusting renal dosing and auditing prescriptions for safety.',
    principle:'Clinical pharmacy applies pharmacology and patient data to <b>optimise therapy</b>. Interaction screening, renal dose adjustment and prescription audit are core safety activities. Simulation lets students practise these clinical decisions safely before real patient contact.',
    theory:'Drug interactions, organ function (especially renal) and prescribing errors all affect patient safety. Renally-cleared drugs need dose adjustment as kidney function falls; interaction checks prevent additive toxicity; a structured prescription audit catches errors before they reach the patient.',
    requirements:['Virtual-patient clinical simulator','Patient vitals, labs &amp; medication list','Drug-interaction screening tool','Renal dose-adjustment reference','Prescription-audit checklist'],
    procedure:['Review each virtual patient’s data and medication list.','Screen the regimen for clinically significant drug interactions.','Adjust doses for renal (and other organ) function where required.','Audit the prescription for errors and safety issues.','Record your decisions and complete the simulation report.'],
    method:['Read the vitals and labs first — flag abnormal kidney function.','Run each pair of drugs through the interaction screen and act on significant hits.','Recalculate doses for any renally-cleared drug when eGFR is reduced.','Work the audit checklist line by line before signing off.','Summarise your findings and decisions in the report.']
   }
  };
  function boot(){
    var el=document.getElementById('expBrief'); if(!el) return;
    var key=el.getAttribute('data-exp'); var d=DATA[key];
    if(d && window.AlizonExperimentBrief) window.AlizonExperimentBrief.render(el,d);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
