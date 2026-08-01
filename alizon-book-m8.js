/* alizon-book-m8.js — Module 8 textbook. Self-registers for the lazy loader
   in alizon-textbook-content.js. Edit freely: this is a starting text. */
(function(){
  (window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m8 = {
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
})();
