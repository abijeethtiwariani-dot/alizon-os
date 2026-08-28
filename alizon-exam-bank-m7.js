/* ALIZON AOS — Module 7 examination question bank
   Robotics & Automation in Pharmacy Practice · 4 units × 25 MCQs            */
(window.ALIZON_EXAM_BANKS = window.ALIZON_EXAM_BANKS || {})['ALZ-PH-M7'] = window.ALIZON_EXAM_M7 = {
  module: 'Module 7 · Robotics & Automation in Pharmacy Practice',
  code: 'ALZ-PH-M7',
  n: 7,
  units: [

  /* ===================== UNIT 1 ===================== */
  {n:1, t:'Introduction to Pharmacy Robotics', hrs:7.5, qs:[

  {q:'The primary justification for pharmacy automation is:',
   o:['Reducing staff numbers','Making the pharmacy look modern','Improving accuracy and safety while releasing pharmacist time for clinical work','Increasing the range of stock'],c:2,
   e:'The strongest evidence for automation is <b>accuracy plus redeployment</b> of professional time. Automation justified only by headcount reduction usually disappoints.'},

  {q:'Which pharmacy task is most suitable for robotic automation?',
   o:['Counselling a newly diagnosed diabetic patient','High-volume, repetitive, rule-based picking and packing of medicines',
      'Assessing an ambiguous drug interaction','Deciding whether to withhold a dose'],c:1,
   e:'Automation excels at <b>repetitive, rule-based physical tasks</b>. Judgement, communication and ambiguity remain human work.'},

  {q:'“Fixed automation” differs from “flexible automation” in that fixed automation:',
   o:['Costs less to install','Performs a specific sequence efficiently but cannot easily be reconfigured for new tasks',
      'Requires no maintenance','Can only be used at night'],c:1,
   e:'<b>Fixed</b> automation delivers high throughput for a stable task; <b>flexible</b> systems adapt to changing products and workflows at higher cost and complexity.'},

  {q:'A robotic dispensing system’s barcode verification protects against:',
   o:['Selecting the wrong product or an incorrectly dated pack','Mechanical breakdown','Power failure','Software licence expiry'],c:0,
   e:'Barcode verification is the <b>identity check</b> at the heart of automated picking. Without it the robot picks quickly but not necessarily correctly.'},

  {q:'The greatest risk introduced by pharmacy automation is:',
   o:['Automation complacency — staff ceasing to apply independent checks because the machine is assumed to be right','Slower dispensing','Higher medicine prices','Reduced storage capacity'],c:0,
   e:'<b>Automation complacency</b> is the well-documented human factors risk. Automation changes the error profile rather than eliminating error.'},

  {q:'Before automating a pharmacy process, the first step should be to:',
   o:['Purchase the equipment','Map and improve the existing process, since automating a flawed process simply produces errors faster',
      'Train all staff','Rearrange the dispensary'],c:1,
   e:'Automating waste industrialises waste. <b>Process mapping and redesign</b> must precede technology selection.'},

  {q:'A “human factors” assessment of a new automated system examines:',
   o:['Staff salaries','The colour of the machine','The manufacturer’s reputation','How people will actually interact with the system, including the errors the interface invites'],c:3,
   e:'<b>Human factors</b> analysis predicts the errors a design makes likely — confusing prompts, easy mis-selection, unclear alarms — before they occur in practice.'},

  {q:'Validation of a new pharmacy robot must demonstrate that it:',
   o:['Performs consistently and correctly under the range of conditions it will meet in routine use','Runs quickly','Is cheaper than manual work','Was installed by a qualified engineer'],c:0,
   e:'Validation is about <b>documented, reproducible correctness</b> across realistic conditions, including edge cases and recovery from interruption.'},

  {q:'A downtime plan for an automated dispensing system must include:',
   o:['A maintenance contract only','A manual process, access to stock held inside the machine, and a defined recovery and reconciliation procedure',
      'A spare machine','An alarm only'],c:1,
   e:'The critical and often overlooked element is <b>physical access to stock locked inside the robot</b>. Without it, a mechanical failure halts supply entirely.'},

  {q:'Automated systems change the role of the pharmacy technician primarily by:',
   o:['Shifting effort from manual picking toward loading, verification, exception handling and system oversight','Eliminating the role','Requiring no training','Restricting them to administrative work'],c:0,
   e:'The work moves <b>upstream and toward exceptions</b>. Loading accuracy and exception handling become the critical control points.'},

  {q:'Return on investment for pharmacy automation should account for:',
   o:['Purchase price only','Staff savings only','Purchase, installation, maintenance, training, downtime contingency and the value of released professional time','Floor space only'],c:2,
   e:'Ongoing <b>maintenance and downtime provision</b> are commonly underestimated, and the benefit is frequently redeployed time rather than cash savings.'},

  {q:'Which measure best demonstrates that automation improved safety?',
   o:['Number of items dispensed per hour','Number of staff trained','Reduction in dispensing error rate per thousand items','Machine uptime percentage'],c:2,
   e:'Throughput and uptime are <b>operational</b> measures. Only an error rate with a denominator speaks to safety.'},

  {q:'Automation is least appropriate for medicines that are:',
   o:['High volume and stable in packaging','Commonly prescribed','Irregularly shaped, refrigerated, controlled or requiring individual clinical assessment','Low cost'],c:2,
   e:'Physical handling constraints and <b>legal or clinical requirements</b> limit automation. Controlled drugs in particular carry specific custody requirements.'},

  {q:'A robot picks the correct product but the pack is later found to be short dated. This indicates a failure of:',
   o:['The stock loading and expiry data process, since the robot dispenses what it was told it holds','The picking mechanism','The barcode scanner','The patient label printer'],c:0,
   e:'A robot is only as accurate as the <b>data entered at loading</b>. Loading is the point at which most automation errors are actually introduced.'},

  {q:'The “last mile” problem in pharmacy automation refers to:',
   o:['Delivery vans','The distance to the ward','Network cabling','The persistent manual steps at the end of the process, such as final clinical check and handover to the patient'],c:3,
   e:'Automation handles the middle of the process well. The <b>clinical check and patient interaction</b> at each end remain human and often become the bottleneck.'},

  {q:'Collaborative robots (cobots) differ from traditional industrial robots in that they:',
   o:['Are always larger','Require no programming','Work only in sterile areas','Are designed to work safely alongside people without physical barriers'],c:3,
   e:'<b>Cobots</b> use force limiting and sensing to operate safely near people, which suits the mixed human–machine environment of a hospital pharmacy.'},

  {q:'Preventive maintenance of pharmacy automation should be:',
   o:['Scheduled, documented, and planned around service demand to minimise clinical disruption','Performed only after a breakdown','Left to the manufacturer entirely','Performed annually regardless of use'],c:0,
   e:'<b>Planned maintenance</b> converts unpredictable failure into scheduled downtime, which can be covered by contingency arrangements.'},

  {q:'The pharmacist’s accountability for a dispensing error made by an automated system is:',
   o:['Transferred to the manufacturer','Shared with the patient','Removed if the system was validated','Unchanged — the pharmacy remains accountable for the supply, including for verifying and governing the system'],c:3,
   e:'Automation is a <b>tool</b>. Accountability for the supply, and for the governance of the tool, remains with the pharmacy.'},

  {q:'Which staff issue most often undermines a pharmacy automation project?',
   o:['Excessive enthusiasm','Too much training','Too many staff available','Inadequate involvement of frontline staff in design and inadequate training, leading to workarounds'],c:3,
   e:'<b>Workarounds</b> arise when the system does not fit real work. Early frontline involvement is the strongest predictor of successful adoption.'},

  {q:'A workaround developed by staff to bypass an automated safety step should be:',
   o:['Encouraged if it saves time','Investigated as a signal that the system does not fit the work, then addressed at source',
      'Ignored','Punished immediately'],c:1,
   e:'A workaround is <b>diagnostic information</b>. Punishing it drives it underground; understanding why it was necessary fixes the underlying design problem.'},

  {q:'Automated systems in pharmacy must retain an audit trail because:',
   o:['It speeds up dispensing','Regulators require large files','Every transaction must be attributable and reconstructable for investigation, recall and inspection','It reduces maintenance'],c:2,
   e:'The same integrity standard applies to machines as to people: <b>attributable, complete, tamper-evident</b> records of every transaction.'},

  {q:'Integration between a dispensing robot and the pharmacy information system is essential so that:',
   o:['The robot can print labels','Stock levels, expiry data and dispensing records remain consistent without manual re-entry',
      'The robot runs faster','Fewer staff are needed'],c:1,
   e:'Without integration, two divergent stock pictures develop and <b>manual re-entry reintroduces exactly the errors automation was meant to remove</b>.'},

  {q:'When evaluating a robot vendor’s throughput claim, the pharmacist should ask:',
   o:['How loud the machine is','The colour options available','Under what conditions the figure was measured, including pack mix, loading time and error handling','The vendor’s market share'],c:2,
   e:'Headline throughput is usually measured under <b>ideal conditions</b>. Real performance depends on pack variety, loading and how exceptions are handled.'},

  {q:'Automation of the dispensing process is most likely to reduce which error type?',
   o:['Wrong patient selection at prescribing','Incorrect clinical decision','Incorrect counselling','Wrong product or wrong strength selected from the shelf'],c:3,
   e:'Automation addresses <b>physical selection errors</b>. Errors of clinical judgement upstream and communication downstream are untouched.'},

  {q:'The most important pre-implementation question for any pharmacy automation is:',
   o:['What problem are we solving, and how will we know whether it has been solved?','What is the fastest model available?','Which vendor is largest?','How much floor space is free?'],c:0,
   e:'A defined problem and a <b>pre-agreed measure of success</b> prevent the common outcome of an expensive system that nobody can prove has helped.'}
  ]},

  /* ===================== UNIT 2 ===================== */
  {n:2, t:'Automated Dispensing & Storage Systems', hrs:7.5, qs:[

  {q:'An automated dispensing cabinet on a ward primarily provides:',
   o:['Refrigerated storage only','Controlled, recorded access to medicines at the point of care, with real-time stock visibility',
      'Automatic prescribing','Patient counselling'],c:1,
   e:'The two core functions are <b>access control with attribution</b> and <b>stock visibility</b>. Both support accountability and reduce ward stock discrepancies.'},

  {q:'“Profiled” automated dispensing cabinets differ from non-profiled ones because they:',
   o:['Only permit removal of medicines that a pharmacist has verified against the patient’s profile','Hold more medicines','Are physically larger','Require no login'],c:0,
   e:'<b>Profiling</b> inserts pharmacist verification before the medicine can be removed, which is why profiled cabinets are substantially safer than open-access ones.'},

  {q:'Override access on an automated dispensing cabinet should be:',
   o:['Restricted to a defined list of urgent medicines, with every override recorded and reviewed','Available for all medicines to avoid delay','Available to all staff at all times','Never permitted'],c:0,
   e:'Overrides bypass pharmacist verification, so they must be <b>limited, logged and audited</b>. A long override list quietly disables the cabinet’s main safety feature.'},

  {q:'Carousel storage systems improve pharmacy efficiency by:',
   o:['Refrigerating all stock','Eliminating stock records','Bringing the required stock location to the operator rather than the operator walking to the stock','Reducing the number of medicines held'],c:2,
   e:'<b>Goods-to-person</b> retrieval removes walking time, which is a large proportion of manual picking effort in a large dispensary.'},

  {q:'A unit-dose dispensing system supplies medicines:',
   o:['In bulk containers to the ward','In individually packaged, labelled single doses ready for administration',
      'Only as injections','Directly to the patient’s home'],c:1,
   e:'<b>Unit dose</b> reduces ward-level handling and supports barcode verification at administration, closing the medication loop.'},

  {q:'Automated tablet packaging into patient-specific pouches is most useful for:',
   o:['Emergency medicines','Patients on complex chronic regimens where adherence and administration accuracy are concerns',
      'Refrigerated products','Controlled drugs only'],c:1,
   e:'Pouch packaging suits <b>complex stable regimens</b>. It is unsuitable for frequently changing therapy, since a change requires the whole supply to be repacked.'},

  {q:'A significant limitation of automated pouch packaging is that:',
   o:['It cannot print labels','It is always more expensive','It cannot handle tablets','Regimen changes require repackaging, and some formulations are unsuitable for de-blistering'],c:3,
   e:'<b>Stability after de-blistering</b> and the cost of change are the two practical constraints, alongside cytotoxic and hygroscopic products that must not be repacked.'},

  {q:'Refrigerated automated storage requires the same controls as manual cold storage, specifically:',
   o:['Continuous temperature monitoring with alarms and a documented excursion procedure','Weekly manual checks only','A thermometer inside the unit only','Annual servicing only'],c:0,
   e:'Automation does not relax cold-chain requirements. <b>Continuous monitoring, alarms and an excursion procedure</b> apply exactly as they do to a manual refrigerator.'},

  {q:'Controlled drugs held in an automated cabinet still require:',
   o:['No register, since the system records everything','A legally compliant register with running balances, regular reconciliation and witnessed destruction where required',
      'Access by any registered staff member','Storage at room temperature only'],c:1,
   e:'The system supports compliance but does not replace the <b>legal record and reconciliation requirements</b>, which remain the pharmacy’s responsibility.'},

  {q:'A discrepancy between the cabinet’s recorded balance and the physical count must be:',
   o:['Investigated and documented according to procedure, as it may indicate diversion','Adjusted silently to match','Ignored if under five units','Reported only at the annual audit'],c:0,
   e:'Silently adjusting the record <b>conceals possible diversion</b>. Every discrepancy is investigated and documented, regardless of size.'},

  {q:'Restocking an automated dispensing cabinet is a critical control point because:',
   o:['It takes a long time','It requires two staff members','An error at loading is replicated into every subsequent dispense from that pocket','It must be done overnight'],c:2,
   e:'A single loading error <b>propagates silently</b> until discovered. Barcode verification at restocking is the standard defence.'},

  {q:'Which restocking practice most reduces error?',
   o:['Loading from memory of the layout','Loading as quickly as possible','Barcode scanning of both the product and the destination location before loading','Loading by a single person without checks'],c:2,
   e:'Scanning <b>both product and location</b> catches the two ways a loading error occurs: right pocket wrong drug, and right drug wrong pocket.'},

  {q:'Automated dispensing cabinets improve nursing efficiency mainly by:',
   o:['Reducing time spent obtaining medicines from a central pharmacy','Prescribing medicines','Administering medicines','Documenting the care plan'],c:0,
   e:'Point-of-care availability removes waiting and travel. The safety benefit, however, depends on the cabinet being <b>profiled</b> so pharmacist verification is preserved.'},

  {q:'A pharmacy robot that stores packs randomly rather than by drug name is using:',
   o:['An inefficient method','An outdated approach','A method unsuitable for medicines','Chaotic or random storage, where the system tracks each pack’s location so shelf space is used optimally'],c:3,
   e:'<b>Chaotic storage</b> maximises space use and, because retrieval is system-directed, also removes the look-alike shelf-neighbour error entirely.'},

  {q:'An advantage of chaotic storage in an automated system is that it:',
   o:['Allows manual picking more easily','Requires no barcode scanning','Eliminates errors caused by similar packs being stored adjacent to one another','Reduces the need for expiry tracking'],c:2,
   e:'Because packs are not grouped by name, the classic <b>look-alike neighbour</b> selection error cannot occur. The tradeoff is total dependence on the system’s location data.'},

  {q:'When an automated system fails, the immediate priority is to:',
   o:['Contact the vendor and wait','Activate the manual contingency process so that supply of critical medicines continues safely',
      'Send patients elsewhere','Complete the reconciliation first'],c:1,
   e:'<b>Continuity of supply</b> comes first. Vendor contact and reconciliation follow, once patients are protected.'},

  {q:'Automated dispensing systems support antimicrobial stewardship when they:',
   o:['Stock every antibiotic on every ward','Dispense antibiotics fastest','Restrict access to reserved agents to those with documented approval','Remove all antibiotics from wards'],c:2,
   e:'<b>Access control at the point of removal</b> is an effective stewardship lever, though critical first doses must remain immediately available.'},

  {q:'A key patient safety consideration when stocking an automated cabinet is:',
   o:['Filling every pocket','Storing alphabetically only','Maximising the number of medicines','Separating look-alike, sound-alike medicines and applying Tall Man lettering in the display'],c:3,
   e:'Even with system-directed retrieval, the <b>screen display</b> is a selection point where LASA confusion occurs, so the same countermeasures apply.'},

  {q:'The pharmacist should review automated cabinet stock lists periodically to:',
   o:['Reduce the vendor’s fees','Increase the range stocked','Satisfy the nursing staff','Ensure the medicines held match current clinical need and remove obsolete or high-risk items'],c:3,
   e:'Ward stock lists <b>drift</b> as practice changes. Periodic review removes discontinued items and prevents dangerous concentrations remaining available.'},

  {q:'Concentrated potassium chloride ampoules should be:',
   o:['Removed from general ward stock and supplied only as ready-to-use dilutions or via strict controls','Stocked in all ward cabinets for convenience','Stored next to sodium chloride','Available on override'],c:0,
   e:'Inadvertent administration of concentrated potassium is <b>rapidly fatal</b>. Removal from general ward areas is a long-standing and effective system control.'},

  {q:'An automated system reports 100% picking accuracy over a year. The pharmacist should:',
   o:['Accept it as proof of safety','Reduce all other checks','Publish it as a safety outcome','Ask how errors are detected and counted, since undetected errors cannot appear in the figure'],c:3,
   e:'A perfect figure usually reflects <b>detection limits, not perfection</b>. Independent audit is needed to know the true rate.'},

  {q:'Interfacing an automated cabinet with the eMAR allows:',
   o:['Automatic prescribing','Automatic ordering from suppliers','Elimination of the pharmacist','Verification that the medicine removed corresponds to a current order for that patient, and recording of administration'],c:3,
   e:'Interfacing closes the loop between <b>order, removal and administration</b>, so a removal without a matching order becomes visible.'},

  {q:'Which is the correct approach to expired stock inside an automated system?',
   o:['Rely on staff noticing at picking','Use system expiry tracking with advance alerts and scheduled physical verification',
      'Check annually','Remove expiry tracking to save time'],c:1,
   e:'Because staff no longer handle the shelf, <b>system-driven expiry alerts plus periodic physical verification</b> replace the informal visual check of manual storage.'},

  {q:'The benefit of automation for controlled drug management is chiefly:',
   o:['Attributable access with a complete electronic transaction record, making discrepancies visible quickly','Removing the need for a register','Allowing more staff access','Reducing the required stock'],c:0,
   e:'The value is <b>attribution and speed of detection</b>. Legal register and reconciliation duties continue unchanged.'},

  {q:'Before decommissioning an automated dispensing system, the pharmacy must:',
   o:['Simply switch it off','Return it to the vendor immediately','Reconcile and remove all stock, export and retain the transaction records for the required retention period, and confirm the manual process is operating','Delete all data'],c:2,
   e:'Transaction records must be <b>retained and remain readable</b> for the statutory period. Deleting them on decommissioning destroys evidence of past supply.'}
  ]},

  /* ===================== UNIT 3 ===================== */
  {n:3, t:'Smart Packaging & Medication Tracking', hrs:7.5, qs:[

  {q:'A linear barcode differs from a 2D data matrix code in that the 2D code:',
   o:['Is easier to print','Can encode far more data, including batch number and expiry date, in a smaller area','Can only be read by humans','Cannot be scanned electronically'],c:1,
   e:'<b>2D data matrix</b> codes carry product identifier, batch and expiry together, which is what makes item-level traceability practical.'},

  {q:'A GTIN in pharmaceutical coding identifies:',
   o:['The trade item — the specific product, strength and pack size','The patient','The prescriber','The pharmacy'],c:0,
   e:'The <b>Global Trade Item Number</b> uniquely identifies the product. Combined with batch, expiry and serial number it identifies the individual pack.'},

  {q:'Serialisation of medicine packs means:',
   o:['Assigning a unique serial number to each individual pack so it can be authenticated and traced','Numbering the boxes in a delivery','Sorting stock alphabetically','Recording the order of dispensing'],c:0,
   e:'<b>Serialisation</b> is the foundation of anti-counterfeiting: a pack whose serial number has already been dispensed elsewhere is identified as suspect.'},

  {q:'Track and trace systems in the pharmaceutical supply chain primarily combat:',
   o:['Expiry wastage','Poor storage conditions','Prescribing errors','Counterfeit and diverted medicines entering the legitimate supply chain'],c:3,
   e:'By verifying each pack’s unique identity at points along the chain, <b>falsified medicines</b> can be detected before reaching a patient.'},

  {q:'RFID differs from barcode scanning in that RFID:',
   o:['Does not require line of sight and can read many tags simultaneously','Requires closer contact','Cannot store batch data','Is always cheaper'],c:0,
   e:'<b>No line of sight and bulk reading</b> allow an entire tray to be inventoried in seconds, which suits emergency trolleys and high-value consignments.'},

  {q:'The main barrier to widespread RFID adoption at individual pack level is:',
   o:['Poor accuracy','Lack of standards entirely','Inability to store data','Cost per tag relative to the value of many medicines, and interference from liquids and metals'],c:3,
   e:'<b>Unit cost</b> is decisive for low-value items, and RFID performance degrades near liquids and foil, both common in pharmaceutical packaging.'},

  {q:'A time–temperature indicator on a package shows:',
   o:['The current temperature only','The expiry date','Cumulative exposure to temperatures outside the acceptable range over time','The batch number'],c:2,
   e:'<b>Cumulative</b> exposure matters because damage from repeated small excursions accumulates, and a spot temperature reading cannot reveal it.'},

  {q:'A Vaccine Vial Monitor becomes unusable when:',
   o:['The label peels off','The inner square is as dark as or darker than the outer reference ring','The vial is opened','The expiry date passes'],c:1,
   e:'The <b>VVM</b> reflects cumulative heat exposure. When the inner square matches or exceeds the reference ring, the vial is discarded whatever the printed expiry.'},

  {q:'Smart blister packaging with electronic monitoring records:',
   o:['The patient’s blood pressure','The medicine’s potency','The prescriber’s identity','The date and time each dose was removed from the pack'],c:3,
   e:'It records <b>removal</b>, which is a closer proxy for adherence than refill data but still not proof of ingestion.'},

  {q:'The main limitation of electronic adherence monitoring packaging is that it:',
   o:['Cannot record dates','Confirms removal from the pack but not that the dose was actually taken','Requires refrigeration','Only works for liquids'],c:1,
   e:'Every objective adherence measure short of directly observed therapy shares this gap between <b>removal and ingestion</b>.'},

  {q:'Tamper-evident packaging is designed to:',
   o:['Make it visibly apparent that the pack has been opened or interfered with','Prevent the pack being opened','Extend the shelf-life','Reduce the pack size'],c:0,
   e:'The purpose is <b>evidence, not prevention</b>. Any pack can be opened; what matters is that interference cannot be concealed.'},

  {q:'Child-resistant packaging is required for many medicines because:',
   o:['Children dislike the taste','It substantially reduces accidental poisoning in young children','It extends shelf-life','It reduces cost'],c:1,
   e:'Child-resistant closures are among the most effective <b>poisoning prevention</b> measures, though they must be balanced against accessibility for elderly patients.'},

  {q:'Barcode medication administration verifies which elements at the bedside?',
   o:['Only the patient’s name','Only the drug name','Only the time','Right patient, right drug, right dose, right route and right time'],c:3,
   e:'BCMA electronically checks the <b>five rights</b> at the final step, catching errors that survived prescribing, verification and dispensing.'},

  {q:'A nurse routinely scans the patient wristband copy taped to the trolley rather than the patient. This workaround:',
   o:['Defeats the purpose of BCMA entirely, since patient identity is no longer verified','Is acceptable if faster','Improves accuracy','Is required when the patient is asleep'],c:0,
   e:'This documented workaround <b>removes the single most important check</b>. It signals that the process does not fit the work and must be addressed at source.'},

  {q:'Unique Device Identification requirements apply to:',
   o:['All medicines','Only implants','Medical devices, enabling traceability and recall','Only diagnostic tests'],c:2,
   e:'<b>UDI</b> is the device equivalent of medicine serialisation, supporting recall, adverse event reporting and inventory management.'},

  {q:'Smart packaging that communicates with a patient’s smartphone raises which particular concern?',
   o:['Battery life only','The colour of the packaging','Privacy and security of the health data transmitted, and who has access to it','The weight of the pack'],c:2,
   e:'Adherence data is <b>sensitive health data</b>. Transparency about collection, transmission, storage and access is essential, particularly where third parties are involved.'},

  {q:'An anti-counterfeiting authentication check at the point of dispensing involves:',
   o:['Inspecting the pack visually only','Scanning the unique identifier and verifying it against the national repository before supply',
      'Weighing the pack','Checking the price'],c:1,
   e:'<b>Verification against the repository</b> at the last point before the patient is where a falsified pack is most reliably intercepted.'},

  {q:'If a pack fails authentication at dispensing, the pharmacist should:',
   o:['Supply it and report later','Try scanning a different pack and ignore the failure','Quarantine the pack, not supply it, and report according to the falsified medicines procedure','Return it to the shelf'],c:2,
   e:'A failed authentication may indicate a <b>falsified or diverted</b> pack. It must be quarantined and reported, not returned to stock.'},

  {q:'Cold-chain data loggers accompanying a shipment allow the receiving pharmacy to:',
   o:['Estimate the delivery cost','Identify the driver','Check the invoice','Verify that the required temperature range was maintained throughout transit before accepting the consignment'],c:3,
   e:'Acceptance should follow <b>verification of the transit record</b>. Accepting first and checking later transfers the risk to the pharmacy.'},

  {q:'Medication tracking within a hospital is most valuable for:',
   o:['Reducing staff numbers','Locating urgently needed doses, reducing missed doses and identifying where delays occur',
      'Setting prices','Scheduling maintenance'],c:1,
   e:'Missed and delayed doses are a common and under-recognised harm. <b>Tracking</b> reveals where in the chain the delay actually occurs.'},

  {q:'A key data quality requirement for effective medication tracking is:',
   o:['Consistent scanning at every defined handover point, since a missed scan breaks the chain','A large database','Frequent software updates','A dedicated tracking team'],c:0,
   e:'QR-linked resources support <b>accessibility and comprehension</b>, particularly for patients with low literacy or who read another language.'},

  {q:'Smart labels with QR codes for patients can usefully provide:',
   o:['Access to the patient information leaflet, administration instructions and video guidance in the patient’s language','The wholesale price','The pharmacy’s profit margin','The prescriber’s home address'],c:0,
   e:'QR-linked resources support <b>accessibility and comprehension</b>, particularly for patients with low literacy or who read another language.'},

  {q:'Aggregation coding on a shipping case allows a distributor to:',
   o:['Estimate the weight of the case','Identify the delivery driver','Set the price of the contents','Read every individual pack’s serial number by scanning the outer case alone'],c:3,
   e:'<b>Aggregation</b> links the serial numbers of individual packs to the case and pallet that contain them, so a whole consignment can be verified without opening it.'},

  {q:'Which is the strongest argument for item-level traceability in hospital pharmacy?',
   o:['It reduces the cost of stock','It removes the need for stocktaking','A recall can be executed precisely, identifying exactly which packs went to which patients','It speeds up dispensing'],c:2,
   e:'Without item-level traceability a recall becomes a <b>broad appeal</b> rather than a targeted intervention, with far greater cost and clinical disruption.'},

  {q:'The pharmacist’s role in smart packaging implementation is chiefly to:',
   o:['Design the packaging','Negotiate the price only','Ensure the technology supports safe practice, integrates with existing systems, and does not create new workarounds','Train the manufacturer'],c:2,
   e:'The professional contribution is assessing whether the technology <b>fits real work</b>. A technically impressive system that invites workarounds reduces safety.'}
  ]},

  /* ===================== UNIT 4 ===================== */
  {n:4, t:'Workflow Optimisation & Quality Assurance', hrs:7.5, qs:[

  {q:'Value stream mapping in a pharmacy is used to:',
   o:['Visualise every step from prescription receipt to patient supply, distinguishing value-adding steps from waste','Calculate medicine prices','Rank staff performance','Design the pharmacy layout only'],c:0,
   e:'<b>Value stream mapping</b> makes delay, rework and unnecessary movement visible, which is the prerequisite for removing them.'},

  {q:'In lean methodology, “waste” includes:',
   o:['Only expired medicines','Only financial loss','Only staff time','Waiting, unnecessary movement, over-processing, defects and rework'],c:3,
   e:'Lean identifies several categories of waste. In pharmacy, <b>waiting and rework</b> from incomplete prescriptions typically dominate.'},

  {q:'A bottleneck in a pharmacy workflow is:',
   o:['The busiest member of staff','The most expensive step','The step that limits the throughput of the entire process','The last step in the process'],c:2,
   e:'Improving any step other than the <b>bottleneck</b> increases work-in-progress without increasing output. Identifying it correctly is the whole point of the analysis.'},

  {q:'The “5S” approach to workplace organisation stands for:',
   o:['Safety, Speed, Service, Standards, Satisfaction','Stock, Supply, Store, Sell, Summarise','Sort, Set in order, Shine, Standardise, Sustain','Screen, Select, Support, Signal, Send'],c:2,
   e:'<b>5S</b> reduces search time and error by making the correct item obvious and the abnormal condition visible at a glance.'},

  {q:'A Plan–Do–Study–Act cycle is used to:',
   o:['Plan the annual budget','Test a change on a small scale, study the effect, and adapt before wider implementation','Schedule staff shifts','Audit once a year'],c:1,
   e:'<b>PDSA</b> favours rapid small-scale testing over large untested implementation, so failures are cheap and learning is fast.'},

  {q:'Root cause analysis after a serious dispensing error should focus on:',
   o:['The system factors and latent conditions that allowed the error to occur and to reach the patient','Identifying who was responsible','Whether the patient complained','The cost of the medicine involved'],c:0,
   e:'RCA asks <b>why the system permitted it</b>. Stopping at individual blame guarantees the same conditions produce the same error again.'},

  {q:'Failure Mode and Effects Analysis differs from root cause analysis in that FMEA is:',
   o:['Performed after an incident','Only for equipment','A financial technique','Prospective — identifying how a process could fail before any harm occurs'],c:3,
   e:'<b>FMEA is proactive</b>, scoring potential failure modes by severity, likelihood and detectability. RCA is retrospective.'},

  {q:'In FMEA, the risk priority number is calculated from:',
   o:['Cost and time','Staff numbers and workload','Severity, occurrence and detectability','Volume and price'],c:2,
   e:'The <b>RPN</b> deliberately includes <b>detectability</b>: a severe failure that is always caught before reaching the patient ranks lower than a moderate one that is invisible.'},

  {q:'The hierarchy of controls ranks which intervention as most effective?',
   o:['Staff training','Elimination or substitution of the hazard, followed by engineering controls such as forcing functions',
      'Warning signs','Written policies'],c:1,
   e:'<b>Design out the hazard</b> first. Training, policies and warnings depend on human vigilance and are the weakest controls.'},

  {q:'Removing concentrated potassium chloride from ward stock is an example of:',
   o:['A warning control','An administrative control','Elimination of the hazard — the strongest form of control','Personal protective equipment'],c:2,
   e:'If the ampoule is not present, it cannot be given in error. This is <b>elimination</b>, and it is why the intervention has been so effective internationally.'},

  {q:'A forcing function in pharmacy software is:',
   o:['A mandatory training module','A warning message','A design feature that makes it impossible to proceed without completing the required safety step','A monthly audit'],c:2,
   e:'A <b>forcing function</b> is an engineering control. Requiring an indication before a high-risk medicine can be ordered is a typical pharmacy example.'},

  {q:'Standardisation of a pharmacy process improves safety because it:',
   o:['Reduces staff autonomy','Reduces unwarranted variation, making deviations visible and training more effective','Speeds up every task','Eliminates the need for checking'],c:1,
   e:'Standardisation makes the <b>abnormal conspicuous</b>. Where everyone works differently, an unsafe deviation looks like just another way of working.'},

  {q:'An independent double check is only effective when:',
   o:['Both people check together and discuss as they go','The second person is more senior','It is performed for every medicine','The second person checks independently against the original order, without being told the first person’s conclusion'],c:3,
   e:'A check performed jointly produces <b>confirmation bias</b>. Independence is what gives the second check its value.'},

  {q:'Quality assurance differs from quality control in that assurance:',
   o:['Tests the finished product','Is performed by external auditors only','Applies only to manufacturing','Focuses on designing and operating processes so that defects do not occur'],c:3,
   e:'<b>QC inspects the output; QA designs the process.</b> Relying on inspection alone means defects are found rather than prevented.'},

  {q:'A near-miss reporting system contributes to quality assurance by:',
   o:['Identifying staff for discipline','Reducing the number of incidents reported','Satisfying insurers','Revealing latent system weaknesses before they cause patient harm'],c:3,
   e:'Near misses are the <b>cheapest possible safety data</b> — the failure has been demonstrated without the patient paying for the lesson.'},

  {q:'A pharmacy quality management system should include:',
   o:['Documented procedures, training records, audit, incident management, CAPA and management review','Only standard operating procedures','Only annual audit','Only equipment maintenance'],c:0,
   e:'A QMS is a <b>closed loop</b>: define, do, check, correct and review. Procedures alone, without audit and corrective action, are only paperwork.'},

  {q:'CAPA stands for:',
   o:['Corrective And Preventive Action','Clinical Audit and Pharmacy Assessment','Controlled Access Pharmacy Agreement','Central Approval for Purchase Authorisation'],c:0,
   e:'<b>Corrective</b> action addresses the specific problem; <b>preventive</b> action addresses the underlying cause so it cannot recur elsewhere.'},

  {q:'An effective corrective action following a dispensing error is:',
   o:['Reminding staff to be more careful','A change to the process or system that makes the same error substantially less likely','Recording the incident only','Increasing the workload'],c:1,
   e:'“Be more careful” is not a corrective action — it changes nothing structural. Effective actions <b>alter the conditions</b> under which people work.'},

  {q:'Workflow analysis in a pharmacy often reveals that the largest source of delay is:',
   o:['Slow dispensing by staff','Waiting — for clarification, for stock, or for the next step in the process',
      'Excessive checking','Too few medicines stocked'],c:1,
   e:'In most services <b>waiting dominates</b> total elapsed time, while the value-adding steps occupy a small fraction. This is why speeding up individuals rarely helps.'},

  {q:'Interruptions during dispensing are important because they:',
   o:['Improve alertness','Have no measurable effect','Substantially increase the risk of error, particularly during checking','Only affect junior staff'],c:2,
   e:'Interruption during checking is one of the best-documented error mechanisms. Protected checking areas and <b>do-not-disturb</b> conventions are the standard countermeasures.'},

  {q:'A quality indicator for pharmacy turnaround time is most useful when reported as:',
   o:['The mean alone','The distribution including the proportion exceeding an agreed target, since outliers cause the clinical harm','The fastest time achieved','The total number of prescriptions'],c:1,
   e:'A good mean can conceal a tail of very long waits. It is the <b>outliers</b>, not the average, that result in missed doses.'},

  {q:'Continuous quality improvement differs from a one-off project because it:',
   o:['Establishes ongoing measurement and iterative change as routine practice rather than a discrete event','Costs more','Requires external consultants','Applies only to large hospitals'],c:0,
   e:'Improvement decays without maintenance. <b>Embedded measurement and iteration</b> are what distinguish sustained improvement from a temporary project effect.'},

  {q:'When automation is introduced, quality assurance must additionally cover:',
   o:['System validation, loading accuracy, interface integrity, downtime procedures and periodic verification that safety rules still function','Nothing new','Only staff training','Only the maintenance contract'],c:0,
   e:'Automation introduces <b>new failure modes</b>, notably silent rule failure after updates and loading errors that propagate. QA must be extended to cover them.'},

  {q:'The most reliable way to confirm that a pharmacy quality system is working is to:',
   o:['Audit actual practice and outcomes against the documented standard, and act on the gaps','Ask staff whether they follow procedures','Review the procedure manual','Count the number of policies in place'],c:0,
   e:'Documents describe intent; <b>audit of actual practice</b> reveals reality. The gap between the two is where the improvement work lies.'},

  {q:'The pharmacist’s overarching responsibility in workflow and quality management is to:',
   o:['Maximise throughput','Minimise staff costs','Purchase the newest technology','Ensure that efficiency improvements never erode the safety checks that protect patients'],c:3,
   e:'Efficiency and safety usually align, but where they conflict <b>safety governs</b>. Recognising and defending that boundary is a professional obligation.'}
  ]}

  ]
};
