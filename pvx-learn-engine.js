/* =====================================================================
   pvx-learn-engine.js — the tutor engine for PV Foundations.

   This is not the PV-X marking engine with hints bolted on. It scores a
   different thing.

   PV-X asks "did you find out what happened?". A beginner cannot answer
   that yet, so this engine asks "are you reasoning like a safety
   officer?" — and it separates the two halves of that question:

     the ANSWER      did you reach the right conclusion
     the REASONING   did you reach it for the right reason

   Those are recorded and reported separately, because the student who
   gets "serious: yes" right for the wrong reason has not learned
   anything and currently looks identical to one who has. A report that
   shows 90% answers and 40% reasoning is far more useful to a teacher
   than a single number, and it is the main thing this engine exists to
   produce.

   Three further design commitments, each of which cost something:

   1. A FIRST WRONG ANSWER IS NOT WRONG. In beginner and intermediate
      mode the first miss returns a hint and the question stays open.
      Nothing is revealed and nothing is marked until the student has
      had the second attempt. Partial credit for a second-attempt
      success is deliberate: recovering from a wrong answer after a hint
      is a real skill and worth more than zero.

   2. "I WOULD NEED MORE INFORMATION" IS SOMETIMES THE RIGHT ANSWER.
      Several items score it as correct. A workshop that punishes
      appropriate uncertainty teaches students to guess confidently,
      which is the opposite of the professional habit being built.

   3. NO NETWORK, NO LANGUAGE MODEL, FULLY DETERMINISTIC. Same answers,
      same score, every time, on any machine, with the college wifi
      down. A teaching tool that cannot be relied on to mark two
      students the same way is not a teaching tool.

   Public surface:
     PVXLearn.newState(mode)            -> a fresh attempt
     PVXLearn.setMode(st, mode)
     PVXLearn.item(id)                  -> a quiz item
     PVXLearn.items(stage)              -> the items for one station
     PVXLearn.submit(st, id, picks)     -> {ok, stage2, hint, feedback, ...}
     PVXLearn.reveal(st, id)            -> give up, show the answer, score 0
     PVXLearn.submitWhy(st, id, picks)  -> score the reasoning step
     PVXLearn.hint(st, id)              -> spend a hint
     PVXLearn.findInteraction(a, b)     -> the pair, either way round
     PVXLearn.findDiseaseRisk(drug, c)  -> the drug-disease entry
     PVXLearn.searchTerms(q)            -> ranked coding suggestions
     PVXLearn.causality(answers)        -> the guided verdict
     PVXLearn.naranjo(answers)          -> score, band, per-item breakdown
     PVXLearn.whoUmc(key)               -> the WHO-UMC category definition
     PVXLearn.validateIcsr(fields)      -> {valid, minimum, quality}
     PVXLearn.progress(st)              -> per-station completion
     PVXLearn.mark(st)                  -> the full performance report
   ===================================================================== */
(function(){
'use strict';

var D = window.PVXLearnData || {};

/* ------------------------------------------------------------------ *
 * 1 · the seriousness criteria (ICH E2A / CIOMS)                      *
 *                                                                     *
 * Kept here rather than in the data file because the engine scores    *
 * against them directly and they must not drift apart.               *
 * ------------------------------------------------------------------ */
var SERIOUS_CRITERIA = [
 {k:'death',    label:'Resulted in death', ex:'The reaction caused or contributed to the death.'},
 {k:'lifethreat',label:'Life-threatening', ex:'The patient was at risk of death AT THE TIME of the reaction — not a reaction that might hypothetically become fatal.'},
 {k:'hosp',     label:'Required hospitalisation, or prolonged an existing admission', ex:'An inpatient admission, or extra days added to one already in progress. An outpatient or emergency visit that does not become an admission does not count on its own.'},
 {k:'disability',label:'Persistent or significant disability or incapacity', ex:'A substantial disruption of the ability to conduct normal life functions.'},
 {k:'congenital',label:'Congenital anomaly or birth defect', ex:'Following exposure before or during pregnancy.'},
 {k:'important',label:'Other medically important condition', ex:'The judgement clause. An event that did not meet the others but required intervention to prevent one of them — bronchospasm treated at home, a blood dyscrasia, a seizure, a severe hypoglycaemia. This is where experienced assessors do most of their work.'}
];

var WHO_UMC = {
 certain:{k:'certain', name:'Certain', need:[
   'Plausible time relationship to taking the drug',
   'Cannot be explained by disease or other drugs',
   'Response to withdrawal is plausible (pharmacologically, pathologically)',
   'The event is definitive pharmacologically or phenomenologically — an objective and specific medical disorder or a recognised pharmacological phenomenon',
   'Rechallenge, if performed, was positive'],
  note:'Note the last line. Without a positive rechallenge you almost never reach Certain, and rechallenge is usually and rightly avoided. Most good cases are Probable.'},
 probable:{k:'probable', name:'Probable / Likely', need:[
   'Reasonable time relationship to taking the drug',
   'Unlikely to be attributed to disease or other drugs',
   'Clinically reasonable response on withdrawal',
   'Rechallenge not required'],
  note:'This is where a well-investigated case with a clear dechallenge usually lands, and it is a good outcome.'},
 possible:{k:'possible', name:'Possible', need:[
   'Reasonable time relationship to taking the drug',
   'Could also be explained by disease or other drugs',
   'Information on drug withdrawal may be lacking or unclear'],
  note:'A confounded case, or one where nobody recorded what happened after the drug stopped. Very common, and not a failure — it is an honest category.'},
 unlikely:{k:'unlikely', name:'Unlikely', need:[
   'Temporal relationship makes a causal connection improbable',
   'Other drugs, chemicals or underlying disease provide plausible explanations'],
  note:'Say so when it is true. Over-attributing reactions to drugs damages the database just as much as missing them.'},
 conditional:{k:'conditional', name:'Conditional / Unclassified', need:[
   'The event or laboratory test abnormality is reported as an adverse reaction',
   'More data are essential for a proper assessment, or the additional data are under examination'],
  note:'Use this while you are still waiting for information you have actually asked for.'},
 unassessable:{k:'unassessable', name:'Unassessable / Unclassifiable', need:[
   'A report suggesting an adverse reaction that cannot be judged because information is insufficient or contradictory',
   'The data cannot be supplemented or verified'],
  note:'The information is not coming. This is the category for a case that can never be assessed, not for one you have not chased yet.'}
};

/* The ten Naranjo items, in the standard order, with the score for each
   answer. Weights are [yes, no, unknown] as in the published scale. */
var NARANJO = [
 {q:'Are there previous conclusive reports on this reaction?', w:[1,0,0],
  help:'Is the reaction described in the product information, a formulary, or the published literature? Looking it up counts — this is not a memory test.'},
 {q:'Did the adverse event appear after the suspected drug was administered?', w:[2,-1,0],
  help:'The temporal relationship. If the event started BEFORE the drug, the answer is no and the scale takes a point off.'},
 {q:'Did the adverse reaction improve when the drug was discontinued, or a specific antagonist was administered?', w:[1,0,0],
  help:'The dechallenge. If the drug was never stopped, the honest answer is unknown, which scores zero.'},
 {q:'Did the adverse reaction reappear when the drug was re-administered?', w:[2,-1,0],
  help:'The rechallenge. Usually not done, and usually should not be. Unknown scores zero, which is why most real cases cannot reach the top band.'},
 {q:'Are there alternative causes that could on their own have caused the reaction?', w:[-1,2,0],
  help:'Careful — this one is reversed. Finding an alternative cause LOSES a point; ruling them out gains two. This is the item that rewards actually investigating.'},
 {q:'Did the reaction reappear when a placebo was given?', w:[-1,1,0],
  help:'Essentially never done outside a trial. Unknown scores zero.'},
 {q:'Was the drug detected in blood or other fluids in concentrations known to be toxic?', w:[1,0,0],
  help:'Only relevant for drugs where levels are measured — digoxin, lithium, phenytoin, theophylline.'},
 {q:'Was the reaction more severe when the dose was increased, or less severe when the dose was decreased?', w:[1,0,0],
  help:'A dose-response relationship is strong evidence. It also tells you the reaction is probably pharmacological rather than immunological.'},
 {q:'Did the patient have a similar reaction to the same or a similar drug in any previous exposure?', w:[1,0,0],
  help:'Previous exposure history. Worth asking about every single time, and routinely forgotten.'},
 {q:'Was the adverse event confirmed by any objective evidence?', w:[1,0,0],
  help:'A laboratory result, a photograph, a biopsy, a measured blood pressure or glucose. Objective evidence is what separates a good report from an anecdote.'}
];

/* ------------------------------------------------------------------ *
 * 2 · the question bank                                               *
 *                                                                     *
 * Every item carries:                                                 *
 *   opts[]      each with .t text, .ok correctness, .fb why THIS      *
 *               option is right or wrong — a wrong option that is not *
 *               explained teaches nothing                             *
 *   hint        what the student gets on a first miss, which must      *
 *               point at the reasoning and never at the answer        *
 *   teach       the concept, given after the item is settled          *
 *   why{}       the reasoning step: the options for "why did you      *
 *               choose that", with .ok marking sound reasons          *
 * ------------------------------------------------------------------ */
function I(o){ return o; }

var ITEMS = [

/* ---------- Station 1 · PV basics -------------------------------- */
I({id:'b1', stage:'basics', max:4,
 stem:'Pharmacovigilance is best described as which of the following?',
 opts:[
  {t:'The science and activities relating to the detection, assessment, understanding and prevention of adverse effects or any other medicine-related problem', ok:true,
   fb:'Correct — this is the WHO definition. Notice how wide it is: "any other medicine-related problem" brings in medication errors, poor quality medicines, misuse and lack of effect, not only side effects.'},
  {t:'Checking prescriptions for errors before they are dispensed', ok:false,
   fb:'That is prescription screening. It is important, and it prevents harm, but it happens before the medicine is given. Pharmacovigilance is mainly about what happens afterwards.'},
  {t:'Testing new medicines in clinical trials before they are approved', ok:false,
   fb:'That is clinical research. Trials are small, short and involve carefully selected patients — which is exactly why pharmacovigilance has to continue for the life of the medicine.'},
  {t:'Making sure medicines are stored at the correct temperature', ok:false,
   fb:'That is cold chain and good distribution practice. A quality defect can certainly cause harm and is reportable, but it is not the definition.'}],
 hint:'Think about WHEN the activity happens. Two of these options describe things done BEFORE a patient takes the medicine. Pharmacovigilance is mostly concerned with what happens after.',
 teach:'Hold on to the phrase "and any other medicine-related problem". Students assume pharmacovigilance means side effects. It also covers medication errors, counterfeit and substandard medicines, misuse, abuse, overdose, and treatment failure. A patient who became pregnant because an interaction stopped her contraceptive working is a pharmacovigilance case.'}),

I({id:'b2', stage:'basics', max:5, multi:true,
 stem:'Which of these should be reported to the national pharmacovigilance programme? Select every one that applies.',
 opts:[
  {t:'A serious reaction, even if it is already well known and in the product information', ok:true,
   fb:'Yes. Known reactions still need reporting — the numbers are how frequency estimates get refined and how at-risk groups get identified.'},
  {t:'A reaction you are not sure was caused by the medicine', ok:true,
   fb:'Yes. Reporting a SUSPECTED reaction is the whole point. You are not required to prove causality before reporting, and if that were the standard almost nothing would ever be reported.'},
  {t:'A medicine that did not work when it should have', ok:true,
   fb:'Yes. Lack of efficacy is reportable, and it is badly under-reported. It can indicate a quality problem, a counterfeit product, or an interaction.'},
  {t:'A reaction in a patient who took the medicine wrongly, or took too much', ok:true,
   fb:'Yes. Medication errors, overdose, misuse and off-label use are all within scope.'},
  {t:'A mild, expected reaction that settled on its own', ok:true,
   fb:'Yes — report it. It contributes to frequency data. Many programmes prioritise serious and unexpected reactions, but they do not exclude the rest.'},
  {t:'Only reactions you can prove were caused by the medicine', ok:false,
   fb:'No. This is the single biggest reason for under-reporting. If proof were required the system would collect almost nothing, because proof of causality in an individual patient is very rarely available.'}],
 hint:'Ask yourself what the system is FOR. It exists to collect suspicions so that patterns can be found across many reports. What would that purpose require you to send in?',
 teach:'The reporting threshold is suspicion, not proof. The assessment of causality is done afterwards, by people with the whole database in front of them. Your job at the point of care is to notice and to send it.',
 why:{stem:'Why should a reaction you cannot prove still be reported?',
      opts:[{t:'One report is a suspicion; many similar reports become evidence', ok:true},
            {t:'The assessment of causality is done centrally, not by the reporter', ok:true},
            {t:'Requiring proof would mean almost nothing is ever reported', ok:true},
            {t:'Because reporting is compulsory and there is a penalty for not doing it', ok:false},
            {t:'Because it protects the reporter from blame later', ok:false}]}}),

I({id:'b3', stage:'basics', max:4, multi:true,
 stem:'In India, who may submit a suspected adverse drug reaction report to the Pharmacovigilance Programme of India? Select all that apply.',
 opts:[
  {t:'Any healthcare professional — doctor, dentist, pharmacist, nurse', ok:true,
   fb:'Yes, and pharmacists are a major and growing source of reports.'},
  {t:'A pharmacy student, intern or trainee under supervision', ok:true,
   fb:'Yes. Many reports from teaching hospitals are prepared by students. This is real work, not practice.'},
  {t:'The patient or a consumer, directly', ok:true,
   fb:'Yes. Consumer reporting is accepted, and there is a dedicated helpline. Consumer reports often describe things clinicians never hear about.'},
  {t:'The marketing authorisation holder — the pharmaceutical company', ok:true,
   fb:'Yes, and for them it is a legal obligation with strict timelines, not a voluntary act.'},
  {t:'Only a registered medical practitioner', ok:false,
   fb:'No. This belief is widespread and it suppresses a great many reports that should have been made.'}],
 hint:'The programme is deliberately open. Think about who is in the best position to NOTICE a reaction — it is often not the prescriber.',
 teach:'Reporting in India goes to an ADR Monitoring Centre, or directly to the National Coordination Centre at the Indian Pharmacopoeia Commission in Ghaziabad, using the Suspected ADR Reporting Form. There is a toll-free helpline for consumers. Reports are entered into VigiFlow and forwarded to VigiBase at the WHO Collaborating Centre in Uppsala, which now holds well over 30 million reports from more than 150 countries.'}),

I({id:'b4', stage:'basics', max:4,
 stem:'A patient develops a reaction that is already listed in the product information, is not serious, and settles by itself. What is the best action?',
 opts:[
  {t:'Report it — a known reaction still contributes to how often it happens and to who it happens to', ok:true,
   fb:'Correct. Frequency in the label comes from trials in selected patients. Real-world reporting is how it gets corrected, and how risk groups are found.'},
  {t:'Do not report it, because it is already known', ok:false,
   fb:'This is the commonest reason given for not reporting, and it is wrong. Known does not mean fully characterised. The label may have the frequency wrong, or may not yet know which patients are at risk.'},
  {t:'Do not report it, because it was not serious', ok:false,
   fb:'Seriousness affects PRIORITY and timelines — serious cases are expedited. It does not decide whether a report is worth making.'},
  {t:'Record it in the patient notes only', ok:false,
   fb:'Necessary but not sufficient. A note in one chart cannot be seen by anyone assessing the medicine nationally.'}],
 hint:'The label says the reaction happens. Does it necessarily say how often, or in which patients, or what makes it worse?',
 teach:'"Already known" is the most common and most damaging excuse in pharmacovigilance. The label for a new drug is written from a few thousand carefully chosen trial patients. Whether a reaction is commoner in the elderly, in renal impairment, in one ethnic group, or with a particular co-prescription is knowledge that only comes from reports after launch.'}),

I({id:'b5', stage:'basics', max:4,
 stem:'Roughly what proportion of adverse drug reactions is thought to be reported through spontaneous reporting systems?',
 opts:[
  {t:'Under 10% — most reactions are never reported at all', ok:true,
   fb:'Correct. Published estimates commonly put spontaneous reporting at under 10%, and often around 5%. This is called under-reporting and it is the central limitation of the whole method.'},
  {t:'About half', ok:false, fb:'Far too optimistic.'},
  {t:'Most of them — around 80%', ok:false, fb:'No. If this were true, signals would be detected far faster than they actually are.'},
  {t:'Almost all serious ones', ok:false,
   fb:'Serious reactions are reported better than mild ones, but still nowhere near completely.'}],
 hint:'Think about how many reactions you have personally seen or heard about, and how many of those you know resulted in a form being filled in.',
 teach:'Under-reporting is why spontaneous reporting can only ever generate hypotheses, never measure incidence. It is also why one more report genuinely matters: with a reporting rate of a few per cent, each case you send in stands for many that were never sent. Your form is not a formality.'}),

/* ---------- Station 5 · ADR identification ------------------------ */
I({id:'a1', stage:'adr', max:6, multi:true,
 stem:'A 22-year-old develops a widespread itchy rash on day 2 of amoxicillin. Before you decide this is an adverse drug reaction, which alternative explanations should you actively rule out? Select all that apply.',
 opts:[
  {t:'The infection itself, or another viral illness causing the rash', ok:true,
   fb:'Yes, and this is the big one. Viral rashes are extremely common, and the patient had an infection — that is why they were given the antibiotic in the first place.'},
  {t:'Any other medicine started recently, including something bought over the counter', ok:true,
   fb:'Yes. Always get the complete list, and ask specifically about shop-bought medicines, because patients do not count them.'},
  {t:'A new food, soap, detergent, cosmetic or plant contact', ok:true,
   fb:'Yes. Ordinary, unglamorous, and genuinely responsible for a lot of rashes.'},
  {t:'Glandular fever — infectious mononucleosis', ok:true,
   fb:'Yes, and it is worth asking about specifically in a 22-year-old with a sore throat. Amoxicillin in glandular fever causes a rash very often, and it is not a true penicillin allergy.'},
  {t:'Nothing — the timing alone proves the drug caused it', ok:false,
   fb:'No. A temporal relationship is necessary but not remotely sufficient. This is the single most common error a beginner makes in causality assessment.'},
  {t:'Nothing — amoxicillin is known to cause rash, so the question is settled', ok:false,
   fb:'No. That the drug CAN cause it makes the case plausible. It does not make the drug responsible in THIS patient.'}],
 hint:'A temporal relationship is one piece of evidence. What else was going on in this patient at the same time — including the reason she was given the antibiotic at all?',
 teach:'Ruling out alternative causes is the step beginners skip and assessors care most about. It is also the highest-scoring item on the Naranjo scale: finding an alternative cause costs a point, while ruling them out gains two. Investigation is rewarded.',
 why:{stem:'Why does the timing alone not establish that the drug caused the rash?',
      opts:[{t:'Two things happening in sequence does not mean one caused the other', ok:true},
            {t:'The illness being treated can itself cause a rash', ok:true},
            {t:'Other exposures — food, products, other medicines — happen at the same time', ok:true},
            {t:'Because a rash is never caused by a medicine', ok:false},
            {t:'Because two days is too early for any drug reaction', ok:false}]}}),

I({id:'a2', stage:'adr', max:5, multi:true,
 stem:'What are the four minimum elements without which a report is not a valid Individual Case Safety Report? Select exactly four.',
 opts:[
  {t:'An identifiable patient', ok:true, fb:'Yes. Initials, age, sex or a case number will do — a full name is not required, and often should not be included.'},
  {t:'An identifiable reporter', ok:true, fb:'Yes. Somebody who can be contacted for follow-up. Anonymous reports cannot be followed up, which is most of their value lost.'},
  {t:'A suspect medicinal product', ok:true, fb:'Yes. At least one named suspect drug.'},
  {t:'A suspected adverse reaction or event', ok:true, fb:'Yes. Something that actually happened to the patient.'},
  {t:'A confirmed causality assessment', ok:false, fb:'No — and this is the trap. Causality is assessed after the report arrives. Requiring it first would stop reports being made.'},
  {t:'Laboratory confirmation of the reaction', ok:false, fb:'No. Very desirable, and it strengthens a report considerably, but it is not a minimum requirement.'},
  {t:'The batch number of the product', ok:false, fb:'No. Important for vaccines and biologicals and for quality defects, but not one of the four.'}],
 hint:'Think of it as four questions: who was affected, who is telling us, what did they take, and what happened. Nothing about proof.',
 teach:'Patient, reporter, product, event. Learn these four as a checklist and run it before you send any report — a report missing one of them cannot be processed at all. Note that none of the four is about proving the drug did it.'}),

I({id:'a3', stage:'adr', max:5,
 stem:'A 45-year-old developed a headache three days after starting a new medicine. He has also slept badly for a week, has been drinking very little in hot weather, and has run out of coffee for two days. What is the best next step?',
 opts:[
  {t:'Record the case as needing more information, and list the alternative causes to be excluded before any causality assessment', ok:true,
   fb:'Correct. There genuinely is a temporal relationship, so the case cannot be dismissed — but there are at least three competing explanations, so it cannot be assessed either. Saying so is the professional answer.'},
  {t:'Assess it as a probable adverse drug reaction, because the headache followed the new medicine', ok:false,
   fb:'No. With three plausible alternative causes untested, this cannot be probable. Over-attributing to drugs is as damaging to the database as missing reactions.'},
  {t:'Dismiss it — the sleep, dehydration and caffeine withdrawal explain it', ok:false,
   fb:'Too quick the other way. They are plausible, but they have not been tested, and the drug has not been excluded. Dismissing a case is also an assessment, and it needs evidence too.'},
  {t:'Do not report it, because the cause is unclear', ok:false,
   fb:'No. Unclear cases are exactly what the system is for. Report it and mark it as requiring follow-up.'}],
 hint:'Two of these options reach a confident verdict. Look at how much information you actually have, and ask whether either verdict is earned yet.',
 teach:'This is confounding, and "I need more information before I can assess this" is a correct and professional answer. In WHO-UMC terms a case like this sits at Possible, or Conditional while you are still chasing information. Both are honest categories and both are used constantly.',
 why:{stem:'Why is this case not assessable as it stands?',
      opts:[{t:'There are several alternative causes that have not been excluded', ok:true},
            {t:'A temporal relationship alone does not establish causation', ok:true},
            {t:'Key information — what the medicine was, the exact dates — is missing', ok:true},
            {t:'Because headache is never a drug reaction', ok:false},
            {t:'Because the patient is not seriously ill', ok:false}]}}),

/* ---------- Station 6 · seriousness and severity ------------------- */
I({id:'s1', stage:'serious', max:6, multi:true,
 stem:'Which of the following make an adverse reaction SERIOUS in the regulatory sense? Select all that apply.',
 opts:[
  {t:'It resulted in death', ok:true, fb:'Yes.'},
  {t:'It was life-threatening at the time it happened', ok:true,
   fb:'Yes — at the time. Not a reaction that might theoretically have become fatal if untreated.'},
  {t:'It required hospitalisation, or made an existing admission longer', ok:true,
   fb:'Yes. Note that an emergency department visit which does not become an admission generally does not count on its own.'},
  {t:'It caused persistent or significant disability or incapacity', ok:true, fb:'Yes.'},
  {t:'It caused a congenital anomaly or birth defect', ok:true, fb:'Yes, following exposure before or during pregnancy.'},
  {t:'It was another medically important condition requiring intervention to prevent one of the above', ok:true,
   fb:'Yes. This is the judgement criterion, and it is where most difficult decisions actually land — a treated anaphylaxis, a severe hypoglycaemia, a blood dyscrasia.'},
  {t:'The patient found it very unpleasant and distressing', ok:false,
   fb:'No — and this is the crucial distinction. That describes SEVERITY, which is about intensity. A migraine can be agonising and still not be serious.'},
  {t:'It needed treatment with another medicine', ok:false,
   fb:'Not on its own. Plenty of mild reactions need treatment. It may point towards "other medically important condition", but needing treatment does not by itself make a reaction serious.'}],
 hint:'Six of these are a fixed regulatory list about OUTCOME. The ones that do not belong are about how bad it felt or how much treatment it took.',
 teach:'Seriousness is a regulatory classification based on outcome, and it drives reporting timelines — serious cases are expedited, typically within 15 calendar days. Severity is a clinical description of intensity: mild, moderate, severe. The two words are not interchangeable and mixing them up is the most common error in this whole subject.'}),

I({id:'s2', stage:'serious', max:5,
 stem:'A patient has a severe migraine after starting a new medicine. It was agonising and she could not work for a day, but she needed no hospital treatment and recovered fully. How is this classified?',
 opts:[
  {t:'Severe in severity, but NOT serious', ok:true,
   fb:'Correct, and this is the case that makes the distinction concrete. It was intense, so severe. It met none of the six outcome criteria, so not serious.'},
  {t:'Serious, because it was severe', ok:false,
   fb:'No. This is the exact confusion the terms exist to prevent. Severity describes intensity; seriousness describes outcome against a fixed list.'},
  {t:'Serious, because she could not work', ok:false,
   fb:'Careful. "Persistent or significant disability" means a substantial and lasting disruption of the ability to conduct normal life functions — not one day off work.'},
  {t:'Neither severe nor serious, as she recovered fully', ok:false,
   fb:'No. Recovery is the OUTCOME field and it is recorded separately. It does not retrospectively make a severe reaction mild.'}],
 hint:'Two separate questions, asked in two separate fields. One asks how intense it was. The other asks whether one of six specific things happened.',
 teach:'Now the mirror image, which is worth as much: a patient found to have a dangerously low potassium on a routine blood test, who feels completely well, IS serious — medically important, needing intervention to prevent an arrhythmia — while being mild in severity. Severe is not serious, and serious is not always severe.',
 why:{stem:'Why is this reaction severe but not serious?',
      opts:[{t:'Severity describes the intensity of the reaction', ok:true},
            {t:'Seriousness is decided against a fixed list of outcomes, and none was met', ok:true},
            {t:'One day off work is not persistent or significant disability', ok:true},
            {t:'Because the patient recovered', ok:false},
            {t:'Because migraine is never caused by medicines', ok:false}]}}),

I({id:'s3', stage:'serious', max:5,
 stem:'A 67-year-old on a sulfonylurea has repeated episodes of sweating, shaking and confusion, twice having to sit down on the floor. A capillary glucose during an episode was 52 mg/dL. She was not admitted. Serious or not?',
 opts:[
  {t:'Serious — other medically important condition', ok:true,
   fb:'Correct. No admission, so not that criterion. But recurrent symptomatic hypoglycaemia in a 67-year-old carries a real risk of a fall, a fracture, a seizure or a road accident, and it requires intervention to prevent exactly the outcomes on the list. This is what the criterion is for.'},
  {t:'Not serious, because she was not hospitalised', ok:false,
   fb:'This is the commonest wrong answer in the whole workshop. Hospitalisation is one criterion of six, not a test of seriousness. "Other medically important condition" exists precisely so that dangerous events managed outside hospital are not dismissed.'},
  {t:'Not serious, because she recovered each time', ok:false,
   fb:'No. Outcome and seriousness are separate fields. A recovered anaphylaxis is still serious.'},
  {t:'Serious — life-threatening', ok:false,
   fb:'Close, and defensible in a worse episode, but "life-threatening" means the patient was at risk of death at the time. Here the better fit is "other medically important condition". A severe episode with loss of consciousness or a seizure would change that.'}],
 hint:'Go through all six criteria, not just the obvious one. If hospitalisation does not fit, is there another that does — and think about what could have happened on those episodes.',
 teach:'"Other medically important condition" is not a lesser category. It is the one that captures the treated anaphylaxis, the severe hypoglycaemia, the bronchospasm settled at home, the agranulocytosis found on a blood count. If you only ever use the admission criterion you will classify a great many dangerous cases as non-serious.'}),

/* ---------- Station 10 · follow-up and quality --------------------- */
I({id:'f1', stage:'follow', max:5,
 stem:'Within what timeline must a serious adverse reaction case normally be reported onward by a marketing authorisation holder?',
 opts:[
  {t:'15 calendar days from first receipt of the minimum information', ok:true,
   fb:'Correct. Serious cases are expedited on a 15-calendar-day clock, which starts on day zero when the report is first received with the minimum information — not when the investigation is finished.'},
  {t:'90 days', ok:false, fb:'Too long for a serious case. Non-serious cases go in periodic reports on much longer cycles.'},
  {t:'24 hours', ok:false, fb:'That is nearer the expectation for certain public health emergencies and specific safety issues, not the standard serious-case rule.'},
  {t:'There is no fixed timeline as long as it is reported eventually', ok:false,
   fb:'No. Timelines are a legal obligation for marketing authorisation holders, and missing them is a compliance failure.'}],
 hint:'It is measured in calendar days, not working days, and it is short enough that you cannot wait for the investigation to finish first.',
 teach:'The clock starts when you first have the minimum information, not when you are satisfied with the case. That is why you submit what you have and follow up afterwards — an incomplete report on time beats a complete one that is late. Healthcare professionals reporting voluntarily are not bound by the 15-day rule, but the habit of reporting promptly is the right one.'}),

I({id:'f2', stage:'follow', max:5, multi:true,
 stem:'Your report has been submitted with gaps. Which follow-up items are worth chasing first? Select the highest-value ones.',
 opts:[
  {t:'The outcome — did the patient recover, and were there lasting effects?', ok:true,
   fb:'Yes. Outcome is a required field and it changes how the case is weighted. It is also the item most often left blank.'},
  {t:'The dechallenge — what happened after the drug was stopped?', ok:true,
   fb:'Yes. This is usually the single strongest piece of causality evidence obtainable, and it is often simply never recorded.'},
  {t:'The exact dates of starting the drug and of the event beginning', ok:true,
   fb:'Yes. Without the interval there is no temporal relationship, and without that there is no causality assessment.'},
  {t:'Relevant laboratory results and objective evidence', ok:true,
   fb:'Yes. It is what moves a report from an anecdote towards evidence, and it can change the coded term itself.'},
  {t:'The complete concomitant medicine list, including over-the-counter products', ok:true,
   fb:'Yes. You cannot exclude alternative causes against a partial list.'},
  {t:'The patient’s full name and address', ok:false,
   fb:'No — and actively avoid it. The patient must be identifiable to the REPORTER, not named in the database. Collecting more personal data than the report needs is a privacy failure, not thoroughness.'},
  {t:'The colour and shape of the tablet', ok:false,
   fb:'Rarely useful, with one real exception: identifying an unnamed product, or investigating a suspected quality defect or counterfeit.'}],
 hint:'Think about which missing fields would actually change the causality assessment. And think carefully about whether more personal data is ever an improvement.',
 teach:'Follow-up is not about filling every box. It is about the fields that change the assessment: dates, dechallenge, outcome, objective evidence, and the full medicine list. Personal identifiers are the one category where less is better — identifiable to the reporter, de-identified in the database.'}),

I({id:'f3', stage:'follow', max:4,
 stem:'A colleague says "I did not report it because I was not certain the drug caused it, and I did not want to accuse the manufacturer." What is the best response?',
 opts:[
  {t:'Reporting a suspicion is what the system is designed for; it is not an accusation and certainty is not required', ok:true,
   fb:'Correct. The word on the form is "suspected". A report is a data point, not a finding of fault, and causality is assessed centrally with the whole database available.'},
  {t:'They are right to be cautious — only report cases you are confident about', ok:false,
   fb:'No. That standard is why under-reporting runs at well over 90%, and why signals are found years later than they could be.'},
  {t:'They should report it but leave out the drug name to be fair to the manufacturer', ok:false,
   fb:'That would make the report useless. Without a suspect product there is no valid ICSR at all — it is one of the four minimum elements.'},
  {t:'They should ask the patient to report it instead', ok:false,
   fb:'Consumers certainly may report, and should be encouraged to. But it does not discharge a professional’s own responsibility, and a clinician’s report usually carries clinical detail a patient cannot supply.'}],
 hint:'Look at the wording on the form itself. What single adjective is in front of the words "adverse drug reaction"?',
 teach:'Fear of blame is one of the documented reasons for under-reporting, alongside lack of time, not knowing how, and believing a known reaction is not worth reporting. Every one of those is answerable, and answering them is part of a pharmacist’s job.'})
];

var BY_ID = {};
ITEMS.forEach(function(it){ BY_ID[it.id] = it; });

/* ------------------------------------------------------------------ *
 * 3 · attempt state                                                   *
 * ------------------------------------------------------------------ */
function newState(mode){
  return {
    mode: (D.MODES && D.MODES[mode]) ? mode : 'beginner',
    started: Date.now(),
    ans:{},          /* id -> {picks, attempts, score, max, first, revealed} */
    why:{},          /* id -> {picks, score, max} */
    hintsUsed:0,
    hintOn:{},       /* id -> true once a hint has been shown */
    tags:{},         /* station 2 — the extraction trainer */
    lookups:{drug:{}, inter:{}, disease:{}, term:{}},   /* what they looked up */
    desk:{},         /* final challenge — which sources opened */
    missing:{},      /* final challenge — which gaps they spotted */
    causal:null, naranjo:null, whoPick:null,
    icsr:null, signal:null, finalAns:{},
    log:[]
  };
}
function M(st){ return (D.MODES && D.MODES[st.mode]) || D.MODES.beginner; }
function setMode(st, mode){ if(D.MODES && D.MODES[mode]) st.mode = mode; return st.mode; }

function logit(st, kind, detail){
  st.log.push({t:Date.now()-st.started, kind:kind, detail:detail});
  if(st.log.length>600) st.log.shift();
}

/* ------------------------------------------------------------------ *
 * 4 · answering an item                                               *
 *                                                                     *
 * The whole first-attempt protection lives here. On a miss:            *
 *   beginner / intermediate  -> stage2, with a hint, nothing revealed  *
 *   challenge                -> marked immediately                     *
 * ------------------------------------------------------------------ */
function sameSet(a, b){
  if(a.length !== b.length) return false;
  var s = {}; a.forEach(function(x){ s[x]=1; });
  return b.every(function(x){ return s[x]; });
}
function correctIdx(it){
  var out=[]; (it.opts||[]).forEach(function(o,i){ if(o.ok) out.push(i); });
  return out;
}

function submit(st, id, picks){
  var it = BY_ID[id];
  if(!it) return {error:'unknown-item'};
  picks = (picks||[]).slice().sort(function(a,b){ return a-b; });
  var rec = st.ans[id] || (st.ans[id] = {picks:[], attempts:0, score:0, max:it.max, first:null, revealed:false});
  if(rec.settled) return {settled:true, ok:rec.score>0, feedback:optFeedback(it, rec.picks), rec:rec};

  rec.attempts++;
  rec.picks = picks;
  var want = correctIdx(it);
  var ok = sameSet(picks, want);
  if(rec.first === null) rec.first = ok;

  var m = M(st);
  logit(st, 'answer', {id:id, ok:ok, attempt:rec.attempts});

  /* right first time */
  if(ok && rec.attempts === 1){
    rec.score = it.max; rec.settled = true;
    return {ok:true, settled:true, score:rec.score, max:it.max,
            feedback:optFeedback(it, picks), teach:it.teach, why:it.why||null, band:'first'};
  }
  /* right after a hint */
  if(ok){
    rec.score = Math.round(it.max * 0.6 * 10)/10; rec.settled = true;
    return {ok:true, settled:true, score:rec.score, max:it.max,
            feedback:optFeedback(it, picks), teach:it.teach, why:it.why||null, band:'second',
            note:'Correct on the second attempt — 60% credit. Recovering from a wrong answer after a hint is worth more than nothing, and less than getting it right first.'};
  }
  /* wrong, and a second chance is allowed */
  if(rec.attempts === 1 && m.secondChance){
    st.hintOn[id] = true;
    return {ok:false, settled:false, stage2:true, hint:it.hint,
            nudge:nudge(it, picks, want),
            note:'Not marked yet. Read the hint and try again — a first wrong answer does not count against you in this mode.'};
  }
  /* wrong, and that is that */
  rec.score = 0; rec.settled = true;
  return {ok:false, settled:true, score:0, max:it.max,
          feedback:optFeedback(it, picks), teach:it.teach, why:it.why||null, band:'missed',
          correct:want.map(function(i){ return it.opts[i].t; })};
}

/* A nudge is NOT the hint. It tells the student the shape of their error
   without telling them the answer — how many they should have picked,
   and whether they over- or under-selected. On a multi-select that is
   the difference between a useful retry and blind guessing. */
function nudge(it, picks, want){
  if(!it.multi) return null;
  if(picks.length < want.length) return 'You have selected fewer than the number that apply. There are more.';
  if(picks.length > want.length) return 'You have selected more than apply. At least one of your choices does not belong.';
  return 'You have the right NUMBER of selections, but not the right combination.';
}

function optFeedback(it, picks){
  var p={}; (picks||[]).forEach(function(i){ p[i]=1; });
  return (it.opts||[]).map(function(o,i){
    return {t:o.t, ok:!!o.ok, picked:!!p[i], fb:o.fb,
            state: o.ok ? (p[i]?'right':'missed') : (p[i]?'wrong':'ignored')};
  });
}

function reveal(st, id){
  var it = BY_ID[id]; if(!it) return {error:'unknown-item'};
  var rec = st.ans[id] || (st.ans[id] = {picks:[], attempts:0, score:0, max:it.max, first:false, revealed:false});
  if(rec.settled) return {settled:true, feedback:optFeedback(it, rec.picks), teach:it.teach};
  rec.revealed = true; rec.settled = true; rec.score = 0;
  if(rec.first === null) rec.first = false;
  logit(st, 'reveal', {id:id});
  return {settled:true, revealed:true, score:0, max:it.max,
          feedback:optFeedback(it, rec.picks), teach:it.teach, why:it.why||null,
          correct:correctIdx(it).map(function(i){ return it.opts[i].t; })};
}

function hint(st, id){
  var it = BY_ID[id]; if(!it) return {error:'unknown-item'};
  var m = M(st);
  if(!m.hints) return {denied:true, why:'Challenge mode gives no hints. The reference desk is still open — use it.'};
  if(st.hintOn[id]) return {hint:it.hint, free:true};
  if(st.hintsUsed >= m.freeHints) return {denied:true, why:'You have used all '+m.freeHints+' hints for this workshop.'};
  st.hintsUsed++; st.hintOn[id] = true;
  logit(st, 'hint', {id:id});
  return {hint:it.hint, used:st.hintsUsed, left:Math.max(0, m.freeHints - st.hintsUsed)};
}

/* ------------------------------------------------------------------ *
 * 5 · the reasoning step — the "Why?" button                          *
 *                                                                     *
 * Scored separately from the answer, and deliberately generously: a    *
 * student who selects two of three sound reasons and no unsound ones   *
 * has reasoned adequately. Selecting an unsound reason costs, because  *
 * "right answer, wrong reason" is the thing this is here to catch.     *
 * ------------------------------------------------------------------ */
function submitWhy(st, id, picks){
  var it = BY_ID[id];
  if(!it || !it.why) return {error:'no-why'};
  picks = picks||[];
  var opts = it.why.opts, good=0, bad=0, totalGood=0;
  opts.forEach(function(o,i){
    if(o.ok) totalGood++;
    if(picks.indexOf(i)>=0){ if(o.ok) good++; else bad++; }
  });
  var frac = totalGood ? good/totalGood : 0;
  frac = Math.max(0, frac - bad*0.34);
  var max = 3, score = Math.round(frac*max*10)/10;
  st.why[id] = {picks:picks, score:score, max:max, good:good, bad:bad, totalGood:totalGood};
  logit(st, 'why', {id:id, good:good, bad:bad});
  return {score:score, max:max, good:good, bad:bad, totalGood:totalGood,
          detail:opts.map(function(o,i){
            return {t:o.t, ok:!!o.ok, picked:picks.indexOf(i)>=0};
          }),
          verdict: bad>0 ? (good>0 ? 'mixed' : 'unsound') : (frac>=0.99 ? 'complete' : good>0 ? 'partial' : 'none'),
          note: bad>0
            ? 'At least one reason you gave does not hold. Getting the right answer for a wrong reason is worth flagging — it usually means the next, slightly different case will be got wrong.'
            : (frac>=0.99 ? 'Sound reasoning, fully stated.' : 'Sound as far as it goes. There were more valid reasons available.')};
}

/* ------------------------------------------------------------------ *
 * 6 · the reference desk lookups                                      *
 *                                                                     *
 * Recorded, because USING the desk is a graded behaviour. A student    *
 * who assesses a drug reaction without once opening the drug card is   *
 * guessing, and the report should say so.                             *
 * ------------------------------------------------------------------ */
function drugCard(st, key){
  var d = (D.DRUGS||{})[key];
  if(d && st){ st.lookups.drug[key] = (st.lookups.drug[key]||0)+1; logit(st,'lookup-drug',{k:key}); }
  return d||null;
}
function norm(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

/* A drug card links to its partners by DRUG key ("enalapril"), while some
   interaction entries are written at CLASS level ("ace-inhibitor") because
   the pharmacology belongs to the class and not to the molecule. Rather
   than duplicate thirty entries per class, resolve a key to its aliases and
   try each combination. Co-amoxiclav inherits amoxicillin's pairs for the
   same reason — the penicillin half is what is interacting. */
var ALIAS = {
  'enalapril':['ace-inhibitor'],           'ace-inhibitor':['enalapril'],
  'propranolol':['beta-blocker'],          'beta-blocker':['propranolol'],
  'amoxicillin-clavulanate':['amoxicillin'],
  'diclofenac':['nsaid'],                  'nsaid':['diclofenac']
};
function keys(k){ return [k].concat(ALIAS[k]||[]); }

function findInteraction(a, b, st){
  a = norm(a); b = norm(b);
  var list = D.INTERACTIONS||[], hit=null;
  var as = keys(a), bs = keys(b);
  for(var i=0;i<list.length && !hit;i++){
    var x=list[i], xa=norm(x.a), xb=norm(x.b);
    for(var j=0;j<as.length && !hit;j++){
      for(var k=0;k<bs.length && !hit;k++){
        if((xa===as[j] && xb===bs[k]) || (xa===bs[k] && xb===as[j])) hit=x;
      }
    }
  }
  if(st){ st.lookups.inter[a+'|'+b] = 1; logit(st,'lookup-inter',{a:a,b:b,found:!!hit}); }
  if(hit) return {found:true, pair:hit, rag:(D.RAG||{})[hit.rag]};
  /* An honest miss. A checker that invents a reassuring answer for a pair
     it has never heard of is worse than one that says it does not know. */
  return {found:false, rag:(D.RAG||{}).green,
    message:'No entry for this pair in the workshop database.',
    caution:'This means the workshop has no entry — NOT that the combination is safe. A real checker covers tens of thousands of pairs and is updated constantly. '
           +'In practice you would check a current reference and the product information for both medicines before concluding there is no interaction.'};
}

function findDiseaseRisk(drug, cond, st){
  drug = norm(drug);
  var list = D.DRUG_DISEASE||[], out=[];
  list.forEach(function(x){
    if(norm(x.drug)!==drug) return;
    if(cond && norm(x.cond).indexOf(norm(cond))<0 && norm(cond).indexOf(norm(x.cond))<0) return;
    out.push(x);
  });
  if(st){ st.lookups.disease[drug+'|'+norm(cond||'all')] = 1; logit(st,'lookup-disease',{d:drug,c:cond}); }
  return out;
}
function diseaseRisksFor(drug){ return (D.DRUG_DISEASE||[]).filter(function(x){ return norm(x.drug)===norm(drug); }); }

/* ------------------------------------------------------------------ *
 * 7 · term coding search                                              *
 *                                                                     *
 * Scored by phrase overlap rather than exact match, because a student  *
 * typing "swelling round the ankles" must find the same entry as one   *
 * typing "ankle swelling". The ranking is transparent on purpose — a   *
 * search that cannot explain why it matched teaches nothing.          *
 * ------------------------------------------------------------------ */
function tokens(s){
  return String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/)
    .filter(function(w){ return w && w.length>2 && ['the','and','was','has','with','have','for','all','over','very','are','not','but','his','her','their','they','she'].indexOf(w)<0; });
}
function searchTerms(q, st){
  var qt = tokens(q);
  if(!qt.length) return [];
  var out = [];
  (D.TERMS||[]).forEach(function(T){
    var best = 0, via = '';
    T.lay.concat([T.verbatim, T.pt]).forEach(function(phrase){
      var pt = tokens(phrase), n = 0;
      qt.forEach(function(w){
        pt.forEach(function(p){
          if(p===w) n += 2;
          else if(p.indexOf(w)===0 || w.indexOf(p)===0) n += 1;
        });
      });
      var sc = n / Math.max(1, qt.length);
      if(sc > best){ best = sc; via = phrase; }
    });
    if(best>0) out.push({term:T, score:Math.round(best*100)/100, via:via});
  });
  out.sort(function(a,b){ return b.score-a.score; });
  if(st){ st.lookups.term[String(q).slice(0,60)] = 1; logit(st,'lookup-term',{q:String(q).slice(0,40),hits:out.length}); }
  return out.slice(0,6);
}

/* ------------------------------------------------------------------ *
 * 8 · the guided causality assistant                                  *
 *                                                                     *
 * Four plain-language questions, in the order a clinician actually     *
 * thinks, deliberately BEFORE any formal terminology is introduced.    *
 * The verdict is expressed in words first and mapped to WHO-UMC after, *
 * which is the whole pedagogical point: the student should recognise   *
 * that they have already been doing causality assessment before being  *
 * told what it is called.                                             *
 * ------------------------------------------------------------------ */
var GUIDE_Q = [
 {k:'after',   q:'Did the reaction occur AFTER the drug was started?',
  yes:'A temporal relationship exists. That is the foundation — without it there is no case at all.',
  no:'If the event began before the drug was started, this drug cannot have caused it. That single question settles a surprising number of referrals.',
  unsure:'Get the dates. This is the one question you cannot leave unanswered — everything else depends on it.'},
 {k:'stopped', q:'Did the reaction improve after the drug was stopped or the dose reduced?',
  yes:'A positive dechallenge. Usually the strongest single piece of evidence you can obtain in practice.',
  no:'No improvement on stopping argues against the drug — though not always. Some reactions, such as severe liver injury or permanent nerve damage, take weeks to settle or never do.',
  unsure:'Either the drug was never stopped, or nobody recorded what happened next. This is the commonest gap in real reports and the first thing to chase.'},
 {k:'other',   q:'Is there another obvious explanation — the illness itself, another medicine, or something else?',
  yes:'A competing cause. It does not rule the drug out, but the case cannot be better than Possible until that alternative is excluded.',
  no:'Alternative causes actively considered and excluded. This is the highest-value investigative step there is, and on the Naranjo scale it is worth two points.',
  unsure:'You have not looked yet. Open the drug card, the medicine list and the history — this is the step that separates an assessment from a guess.'},
 {k:'known',   q:'Is this a recognised reaction to this medicine?',
  yes:'Biological plausibility, established. Look it up rather than recalling it — that is what the reference desk is for.',
  no:'An unexpected reaction. That makes the case MORE valuable, not less — unexpected serious reactions are what signal detection is looking for. It does lower the Naranjo score, which is a limitation of the scale rather than of your case.',
  unsure:'Check the product information and the drug card before answering. This is a lookup, not a memory test.'}
];

function causality(ans){
  var a = ans||{};
  var after=a.after, stopped=a.stopped, other=a.other, known=a.known;
  var lines = [], verdict, who, conf;

  GUIDE_Q.forEach(function(g){
    var v = a[g.k];
    if(v) lines.push({q:g.q, a:v, say:g[v]||''});
  });

  if(after === 'no'){
    verdict = 'These findings do NOT support a relationship between the drug and the event.';
    who = 'unlikely'; conf='strong';
  } else if(after === 'unsure'){
    verdict = 'This case cannot be assessed until the dates are established.';
    who = 'conditional'; conf='none';
  } else if(other === 'yes'){
    verdict = 'These findings support a POSSIBLE relationship. A competing explanation has to be excluded before it can be judged more likely than that.';
    who = 'possible'; conf='moderate';
  } else if(other === 'unsure'){
    verdict = 'These findings are consistent with a relationship, but alternative causes have not been examined, so the case is not yet assessable beyond Possible.';
    who = 'possible'; conf='weak';
  } else if(stopped === 'yes' && other === 'no' && known === 'yes'){
    verdict = 'These findings support a PROBABLE relationship between the drug and the event.';
    who = 'probable'; conf='strong';
  } else if(stopped === 'yes' && other === 'no'){
    verdict = 'These findings support a PROBABLE relationship — the time course and the dechallenge both fit, and alternatives have been excluded.';
    who = 'probable'; conf='good';
  } else if(other === 'no' && known === 'yes'){
    verdict = 'These findings support at least a POSSIBLE and arguably a PROBABLE relationship. What is missing is what happened after the drug was stopped.';
    who = 'possible'; conf='moderate';
  } else {
    verdict = 'These findings support a POSSIBLE relationship. More information would strengthen or weaken it.';
    who = 'possible'; conf='weak';
  }

  var teach = 'You have just done a causality assessment. Four questions — time relationship, dechallenge, alternative '
    +'causes, and known reaction — and you reached a graded conclusion. The formal scales do exactly this, in more '
    +'detail and with a published set of words for the answer. WHO-UMC gives you the categories; Naranjo gives you a '
    +'number. Neither adds a step you have not already taken.';

  var ceiling = (stopped!=='yes' || other!=='no')
    ? 'Note the ceiling on this case. Without a clear dechallenge AND alternative causes excluded, no scale will let you go above Possible. That is not a defect in your reasoning — it is missing information, and it tells you exactly what to follow up.'
    : 'To go above Probable you would need a positive rechallenge, which is almost never ethical and almost never done. Probable is the realistic top of a well-investigated case.';

  return {verdict:verdict, who:who, whoDef:WHO_UMC[who], confidence:conf, lines:lines, teach:teach, ceiling:ceiling};
}

function naranjo(ans){
  var a = ans||{}, total=0, rows=[];
  NARANJO.forEach(function(item, i){
    var v = a['q'+(i+1)];
    var pts = v==='yes'?item.w[0] : v==='no'?item.w[1] : item.w[2];
    if(v) total += pts;
    rows.push({n:i+1, q:item.q, help:item.help, a:v||null, pts:v?pts:null, w:item.w});
  });
  var band = total>=9?'Definite' : total>=5?'Probable' : total>=1?'Possible' : 'Doubtful';
  var answered = rows.filter(function(r){ return r.a; }).length;
  return {total:total, band:band, rows:rows, answered:answered, complete:answered===10,
    bands:[['≥9','Definite'],['5–8','Probable'],['1–4','Possible'],['≤0','Doubtful']],
    caveat:'A Naranjo score is an aid to consistency, not a verdict. Items 4 and 6 — rechallenge and placebo — are '
          +'almost never answerable in practice, which quietly caps most real cases in the Probable band. Do not '
          +'read a low score as evidence the drug is innocent; read it as a description of how much evidence you '
          +'were able to obtain.'};
}
function whoUmc(k){ return WHO_UMC[k]||null; }

/* ------------------------------------------------------------------ *
 * 9 · ICSR validity and quality                                       *
 *                                                                     *
 * Two separate verdicts, because they answer different questions:      *
 *   minimum  -> can this be processed AT ALL (the four elements)       *
 *   quality  -> is it any USE once it has been processed               *
 * A report can be perfectly valid and nearly worthless, and a student  *
 * should see those as two different failures.                          *
 * ------------------------------------------------------------------ */
var ICSR_FIELDS = [
 {k:'pt_id',   g:'Patient',  label:'Patient identifier (initials, or a case number)', min:true,
  why:'One of the four minimum elements. Identifiable does NOT mean named — initials, age and sex are enough, and a full name should usually be left out.'},
 {k:'pt_age',  g:'Patient',  label:'Age or age group', min:false, quality:true,
  why:'Needed to spot reactions concentrated in the very young or the elderly.'},
 {k:'pt_sex',  g:'Patient',  label:'Sex', min:false, quality:true, why:'Some reactions are strongly sex-related.'},
 {k:'pt_weight',g:'Patient', label:'Weight', min:false, why:'Essential in children, and wherever dose is calculated per kilogram.'},

 {k:'drug',    g:'Suspect drug', label:'Suspect medicine — generic name', min:true,
  why:'One of the four minimum elements. Generic name, because a brand name may not identify the molecule outside its own country.'},
 {k:'dose',    g:'Suspect drug', label:'Dose and strength', min:false, quality:true, why:'Needed to judge whether the reaction is dose-related.'},
 {k:'route',   g:'Suspect drug', label:'Route of administration', min:false, quality:true, why:'Intravenous and oral routes do not carry the same risks.'},
 {k:'freq',    g:'Suspect drug', label:'Frequency / dose regimen', min:false, quality:true,
  why:'Dose alone is not the exposure. 500 mg once a day and 500 mg four times a day are very different, and dose-relatedness cannot be judged without it.'},
 {k:'start',   g:'Suspect drug', label:'Date started', min:false, quality:true,
  why:'Half of the temporal relationship. Without it there is no time to onset, and without that the case cannot be assessed.'},
 {k:'stop',    g:'Suspect drug', label:'Date stopped, or "continuing"', min:false, quality:true, why:'Sets up the dechallenge.'},
 {k:'indication',g:'Suspect drug',label:'Indication — why it was given', min:false, quality:true,
  why:'The indication can itself be the cause of the event, and it is needed to judge whether the use was appropriate.'},
 {k:'batch',   g:'Suspect drug', label:'Batch or lot number', min:false,
  why:'Critical for vaccines, biologicals and any suspected quality defect. Often unobtainable, and that is acceptable.'},

 {k:'event',   g:'Reaction', label:'Reaction, in the reporter’s own words', min:true,
  why:'One of the four minimum elements. Record the verbatim description BEFORE you code it — the coded term loses detail that may matter later.'},
 {k:'coded',   g:'Reaction', label:'Coded reaction term', min:false, quality:true, why:'What makes the case findable in a database alongside similar ones.'},
 {k:'onset',   g:'Reaction', label:'Date the reaction began', min:false, quality:true,
  why:'The other half of the temporal relationship. The most valuable single field in the whole report after the drug name.'},
 {k:'serious', g:'Reaction', label:'Serious? — and which criterion', min:false, quality:true,
  why:'Decides the reporting timeline. A serious case is expedited.'},
 {k:'severity',g:'Reaction', label:'Severity — mild, moderate, severe', min:false, why:'A clinical description. Not the same field as seriousness, and not a substitute for it.'},
 {k:'outcome', g:'Reaction', label:'Outcome', min:false, quality:true,
  why:'Recovered, recovering, not recovered, recovered with sequelae, fatal, or unknown. Required, and very often left blank.'},
 {k:'action',  g:'Reaction', label:'Action taken with the drug', min:false, quality:true,
  why:'Withdrawn, dose reduced, dose not changed, or unknown. It is what makes the dechallenge interpretable.'},

 {k:'conmeds', g:'Context', label:'Concomitant medicines, with dates', min:false, quality:true,
  why:'You cannot exclude alternative causes without the full list. Include over-the-counter and herbal products.'},
 {k:'history', g:'Context', label:'Relevant medical history', min:false, quality:true,
  why:'Drug-disease interactions and confounders both live here.'},
 {k:'labs',    g:'Context', label:'Relevant tests and results, with dates', min:false, quality:true,
  why:'Objective evidence. It is what moves a report from an anecdote towards evidence.'},
 {k:'dechal',  g:'Context', label:'Dechallenge — what happened after stopping', min:false, quality:true,
  why:'Usually the strongest causality evidence obtainable in practice.'},
 {k:'rechal',  g:'Context', label:'Rechallenge — was it given again?', min:false,
  why:'The strongest evidence of all, and usually unethical to seek deliberately. "Not done" is a complete answer.'},

 {k:'reporter',g:'Reporter', label:'Reporter name and qualification', min:true,
  why:'One of the four minimum elements. Without a contactable reporter there is no follow-up, and follow-up is where most of a report’s value comes from.'},
 {k:'contact', g:'Reporter', label:'Reporter contact details', min:false, quality:true, why:'Follow-up, again. This is the field that makes a report improvable.'},
 {k:'rdate',   g:'Reporter', label:'Date of this report', min:false, quality:true, why:'Day zero of the regulatory clock.'}
];

function validateIcsr(f){
  f = f||{};
  function has(k){ var v=f[k]; return v!=null && String(v).trim() !== ''; }
  var minimum = ICSR_FIELDS.filter(function(x){ return x.min; });
  var minMissing = minimum.filter(function(x){ return !has(x.k); });
  var qual = ICSR_FIELDS.filter(function(x){ return x.quality; });
  var qMissing = qual.filter(function(x){ return !has(x.k); });
  var filled = ICSR_FIELDS.filter(function(x){ return has(x.k); }).length;

  var qScore = qual.length ? Math.round((qual.length-qMissing.length)*100/qual.length) : 0;
  var grade = qScore>=90?'Excellent' : qScore>=75?'Good' : qScore>=55?'Acceptable' : qScore>=35?'Poor' : 'Unusable';

  /* The specific, named quality failures a reviewer would actually write
     on the form. Vague feedback ("add more detail") teaches nothing. */
  var flags = [];
  if(!has('onset') || !has('start'))
    flags.push({sev:'high', t:'No time to onset can be calculated. Either the start date or the reaction date is missing, and without the interval the case cannot be assessed for causality at all.'});
  if(has('event') && has('coded') && String(f.event).trim().toLowerCase() === String(f.coded).trim().toLowerCase())
    flags.push({sev:'med', t:'The verbatim term and the coded term are identical. Record what the reporter actually said, then code it separately — the two fields exist to keep the original words.'});
  if(!has('outcome'))
    flags.push({sev:'high', t:'Outcome is blank. It is a required field and the most commonly omitted one in real reports.'});
  if(!has('conmeds'))
    flags.push({sev:'high', t:'No concomitant medicines recorded. If the answer is genuinely none, write "none" — a blank field is read as "not asked", which is a different and worse thing.'});
  if(!has('dechal'))
    flags.push({sev:'med', t:'Dechallenge not recorded. This is usually the strongest causality evidence available and it is free to obtain.'});
  if(has('serious') && !has('labs') && /yes|serious/i.test(String(f.serious)))
    flags.push({sev:'med', t:'The case is marked serious but carries no objective evidence. A serious case without a laboratory result, a measurement or a clinical finding is much harder to assess.'});
  if(!has('history'))
    flags.push({sev:'med', t:'No medical history. Drug-disease interactions and confounders both live in this field.'});
  if(!has('contact'))
    flags.push({sev:'med', t:'No reporter contact details, so the case cannot be followed up. Most of a report’s eventual value comes from follow-up.'});

  return {
    valid: minMissing.length===0,
    minimum:{ total:minimum.length, missing:minMissing.map(function(x){ return {k:x.k,label:x.label,why:x.why}; }) },
    quality:{ score:qScore, grade:grade, missing:qMissing.map(function(x){ return {k:x.k,label:x.label,why:x.why}; }) },
    filled:filled, of:ICSR_FIELDS.length, flags:flags,
    verdict: minMissing.length
      ? 'NOT a valid ICSR. It is missing '+minMissing.length+' of the four minimum elements, so it cannot be processed at all — it is an enquiry, not a report.'
      : (qScore>=75 ? 'A valid ICSR of usable quality. It can be assessed.'
                    : 'A valid ICSR, but of limited use. It will be accepted and it will be hard to assess, which is how most reports in the world actually look.')
  };
}
function icsrFields(){ return ICSR_FIELDS.slice(); }

/* ------------------------------------------------------------------ *
 * 10 · signal station                                                 *
 * ------------------------------------------------------------------ */
function gradeSignal(st, picks){
  var set = D.SIGNAL_SET||{rows:[]};
  picks = picks||[];
  var rows = set.rows||[];
  var wantYes = [], gotYes=0, wrong=[];
  rows.forEach(function(r,i){
    if(r.verdict==='yes') wantYes.push(i);
    if(picks.indexOf(i)>=0){
      if(r.verdict==='yes') gotYes++;
      else wrong.push(r);
    }
  });
  var ok = gotYes===wantYes.length && wrong.length===0;
  var nausea = rows.filter(function(r,i){ return /nausea/i.test(r.adr) && picks.indexOf(i)>=0; }).length>0;
  var score = ok?6 : (gotYes>0 ? 3 : 0);
  if(st) st.signal = {picks:picks, score:score, max:6, ok:ok};
  return {
    ok:ok, score:score, max:6, rows:rows,
    trap: nausea ? 'You picked nausea, which has by far the most cases. That is the trap this station is built around: '
                  +'it is already in the label, it is not serious, and 15 reports in 40,000 patients is well below the '
                  +'frequency the label itself describes. Counting is not assessing.' : null,
    lesson:set.lesson, definition:set.definition, chain:set.chain
  };
}

/* ------------------------------------------------------------------ *
 * 11 · final challenge                                               *
 * ------------------------------------------------------------------ */
function gradeMissing(st, picks){
  var F = D.FINAL||{missing:[]};
  picks = picks||[];
  var total=0, got=0, hit=[], miss=[];
  (F.missing||[]).forEach(function(m){
    total += m.weight;
    if(picks.indexOf(m.k)>=0){ got += m.weight; hit.push(m); } else miss.push(m);
  });
  var pctv = total?Math.round(got*100/total):0;
  st.missing = {picks:picks, pct:pctv, score:Math.round(pctv*8/100*10)/10, max:8};
  return {pct:pctv, score:st.missing.score, max:8, hit:hit, missed:miss,
    verdict: pctv>=80 ? 'A thorough gap analysis. This is the habit that makes a safety officer useful.'
           : pctv>=55 ? 'You found the main gaps but left real ones behind. Work through the case field by field rather than by impression.'
           : 'Too many gaps missed. Before assessing any case, walk the ICSR fields one at a time and ask of each: do I actually have this?'};
}
function openSource(st, key){
  var F = D.FINAL||{}; var src = (F.reveal||{})[key];
  if(!src) return null;
  st.desk[key] = true;
  logit(st,'final-source',{k:key});
  return src;
}

/* ------------------------------------------------------------------ *
 * 12 · progress and marking                                           *
 * ------------------------------------------------------------------ */
var STAGES = [
 {k:'basics',  name:'PV basics'},
 {k:'read',    name:'Reading a case'},
 {k:'drug',    name:'Drug intelligence'},
 {k:'inter',   name:'Interactions and patient factors'},
 {k:'adr',     name:'ADR identification'},
 {k:'serious', name:'Seriousness and severity'},
 {k:'causal',  name:'Causality'},
 {k:'code',    name:'Coding'},
 {k:'icsr',    name:'ICSR'},
 {k:'follow',  name:'Follow-up and quality'},
 {k:'signal',  name:'Signals'},
 {k:'final',   name:'Team challenge'}
];
function items(stage){ return ITEMS.filter(function(i){ return i.stage===stage; }); }
function item(id){ return BY_ID[id]||null; }

function progress(st){
  var out = {};
  STAGES.forEach(function(s){
    var its = items(s.k);
    if(its.length){
      var done = its.filter(function(i){ var r=st.ans[i.id]; return r&&r.settled; }).length;
      out[s.k] = {done:done, total:its.length, pct:Math.round(done*100/its.length)};
      return;
    }
    /* the stations that are not question banks */
    var p = 0;
    if(s.k==='read'){
      var tg = D.READ_CASE ? D.READ_CASE.tags.length : 0;
      p = tg ? Math.round(Object.keys(st.tags).length*100/tg) : 0;
    }
    else if(s.k==='drug')  p = Math.min(100, Object.keys(st.lookups.drug).length*34);
    else if(s.k==='inter') p = Math.min(100, (Object.keys(st.lookups.inter).length + Object.keys(st.lookups.disease).length)*25);
    else if(s.k==='causal')p = (st.causal?50:0) + (st.naranjo&&st.naranjo.complete?50:0);
    else if(s.k==='code')  p = Math.min(100, Object.keys(st.lookups.term).length*34);
    else if(s.k==='icsr')  p = st.icsr ? (st.icsr.valid?100:60) : 0;
    else if(s.k==='signal')p = st.signal?100:0;
    else if(s.k==='final') p = Math.min(100, (st.missing?40:0) + Object.keys(st.desk).length*12);
    out[s.k] = {done:p>=100?1:0, total:1, pct:p};
  });
  return out;
}

function band(p){ return p>=85?'Excellent' : p>=70?'Good' : p>=55?'Satisfactory' : p>=40?'Weak' : 'Needs more practice'; }

function mark(st){
  var m = M(st);

  /* --- the answer score --- */
  var aGot=0, aMax=0, first=0, firstOf=0, second=0, missed=0, revealed=0;
  ITEMS.forEach(function(it){
    var r = st.ans[it.id];
    aMax += it.max;
    if(!r || !r.settled) return;
    aGot += r.score; firstOf++;
    if(r.revealed) revealed++;
    else if(r.first) first++;
    else if(r.score>0) second++;
    else missed++;
  });

  /* --- the reasoning score, kept separate on purpose --- */
  var wGot=0, wMax=0, wUnsound=0;
  ITEMS.forEach(function(it){
    if(!it.why) return;
    var r = st.why[it.id];
    wMax += 3;
    if(r){ wGot += r.score; if(r.bad>0) wUnsound++; }
  });

  /* --- the practical stations --- */
  var pGot=0, pMax=0, practical=[];
  function P(name, got, max, note){
    pGot+=got; pMax+=max;
    practical.push({name:name, got:Math.round(got*10)/10, max:max,
                    pct:max?Math.round(got*100/max):0, note:note||''});
  }
  var tagTotal = D.READ_CASE ? D.READ_CASE.tags.length : 7;
  var tagOk = 0; Object.keys(st.tags).forEach(function(k){ if(st.tags[k]===true) tagOk++; });
  P('Reading a case — information extraction', tagOk*7/tagTotal, 7,
    tagOk>=tagTotal?'All seven elements extracted.':'Extracted '+tagOk+' of '+tagTotal+' elements.');

  var nDrug = Object.keys(st.lookups.drug).length;
  P('Use of the drug reference', Math.min(5, nDrug*1.7), 5,
    nDrug?('Opened '+nDrug+' drug card'+(nDrug>1?'s':'')+'.')
         :'Never opened a drug card. Assessing a reaction without reading about the drug is guessing.');

  var nInt = Object.keys(st.lookups.inter).length, nDis = Object.keys(st.lookups.disease).length;
  P('Interaction and patient-factor checking', Math.min(8, nInt*1.2+nDis*1.6), 8,
    'Ran '+nInt+' drug-drug and '+nDis+' drug-disease check'+((nInt+nDis)===1?'':'s')+'.');

  var nTerm = Object.keys(st.lookups.term).length;
  P('Coding — term search', Math.min(5, nTerm*1.7), 5,
    nTerm?('Searched '+nTerm+' term'+(nTerm>1?'s':'')+'.'):'No term searches. The coded term is what makes a case findable.');

  if(st.causal){
    var c = st.causal, full = ['after','stopped','other','known'].every(function(k){ return c.ans&&c.ans[k]; });
    P('Guided causality reasoning', full?6:3, 6, full?'All four guiding questions answered.':'Guided assessment left incomplete.');
  } else P('Guided causality reasoning', 0, 6, 'Not attempted.');

  if(st.naranjo && st.naranjo.complete){
    var agree = st.whoPick && st.causal && st.causal.who &&
      (norm(st.whoPick)===norm(st.causal.who) ||
       (st.whoPick==='probable' && st.naranjo.band==='Probable') ||
       (st.whoPick==='possible' && st.naranjo.band==='Possible'));
    P('Formal causality — Naranjo and WHO-UMC', agree?8:5, 8,
      'Naranjo '+st.naranjo.total+' ('+st.naranjo.band+')'
      + (st.whoPick?(', WHO-UMC '+(WHO_UMC[st.whoPick]?WHO_UMC[st.whoPick].name:st.whoPick)):'')
      + (agree?' — the two agree, which is what a well-reasoned case looks like.'
             :' — the two do not line up. Worth understanding why before you finish.'));
  } else P('Formal causality — Naranjo and WHO-UMC', st.naranjo?2:0, 8,
      st.naranjo?'Naranjo started but not completed.':'Not attempted.');

  if(st.icsr){
    var q = st.icsr;
    P('ICSR construction', (q.valid?6:0) + Math.round(q.quality.score*6/100), 12,
      q.valid ? ('Valid report, quality '+q.quality.grade+' ('+q.quality.score+'%).')
              : 'Not a valid ICSR — one or more of the four minimum elements is missing.');
  } else P('ICSR construction', 0, 12, 'No report built.');

  P('Signal assessment', (st.signal && typeof st.signal.score==='number')?st.signal.score:0, 6,
    st.signal ? (st.signal.ok?'Identified the signal correctly.':'Did not isolate the signal.') : 'Not attempted.');

  /* st.missing starts life as {} (the set of gaps ticked) and is replaced by
     gradeMissing with a scored result. Test for the score, not for the
     object, or an ungraded attempt scores NaN and takes the total with it. */
  var mg = (st.missing && typeof st.missing.score === 'number') ? st.missing : null;
  P('Final challenge — gap analysis', mg?mg.score:0, 8,
    mg?('Found '+mg.pct+'% of the missing information, by weight.'):'Not attempted.');

  var nSrc = Object.keys(st.desk).length, srcTotal = D.FINAL ? Object.keys(D.FINAL.reveal||{}).length : 5;
  P('Final challenge — investigation', Math.min(6, nSrc*6/srcTotal), 6,
    'Consulted '+nSrc+' of '+srcTotal+' sources.');

  /* --- totals --- */
  var raw = aGot + wGot + pGot, rawMax = aMax + wMax + pMax;
  if(!isFinite(raw)) raw = 0;
  var pct = rawMax ? (raw*100/rawMax) : 0;
  var weighted = Math.min(100, Math.max(0, Math.round(pct * (m.weight||1))));

  var ansPct = aMax?Math.round(aGot*100/aMax):0;
  var whyPct = wMax?Math.round(wGot*100/wMax):0;

  /* The gap that is the whole reason this engine keeps two scores. */
  var gap = null;
  if(wMax && ansPct-whyPct >= 20)
    gap = 'Your answers are ahead of your reasoning. You are reaching correct conclusions without being able to say '
        +'why, which works until the case changes slightly. Go back through the "Why did you choose this?" steps.';
  else if(wMax && whyPct-ansPct >= 20)
    gap = 'Your reasoning is ahead of your answers — you understand the principles and are slipping on the '
        +'application. That is the better way round, and it usually fixes itself with more cases.';
  else if(wMax && whyPct>=70 && ansPct>=70)
    gap = 'Answers and reasoning are aligned and both sound. That is what competence looks like at this stage.';

  var advice = [];
  if(!nDrug) advice.push('You never opened a drug card. Look the drug up before you assess a reaction to it — that is the habit, not the knowledge.');
  if(!nInt && !nDis) advice.push('You ran no interaction or patient-factor checks. In a real case those two checks find most of what is findable.');
  if(!st.icsr || !st.icsr.valid) advice.push('Learn the four minimum elements by heart: patient, reporter, product, event. A report missing one cannot be processed.');
  if(st.signal && st.signal.max && !st.signal.ok) advice.push('Re-read the signal station. The biggest number is not the signal — seriousness, expectedness and plausibility decide it.');
  if(missed+revealed >= 3) advice.push('Several questions were missed or revealed. Repeat the workshop in Beginner mode before moving to PV-X.');
  if(whyPct && whyPct<55) advice.push('Reasoning scored below 55%. The concepts are what transfer to the next case; the answers do not.');
  if(st.mode!=='challenge' && weighted>=75) advice.push('You are ready for Challenge mode, and after that for PV-X, where nothing is given to you at all.');
  if(!advice.length) advice.push('A clean run. The next step up is Challenge mode, and then PV-X.');

  return {
    mode:m.name, modeKey:st.mode, weight:m.weight,
    total:weighted, raw:Math.round(raw*10)/10, rawMax:rawMax, band:band(weighted),
    answers:{got:Math.round(aGot*10)/10, max:aMax, pct:ansPct,
             first:first, second:second, missed:missed, revealed:revealed, settled:firstOf, of:ITEMS.length},
    reasoning:{got:Math.round(wGot*10)/10, max:wMax, pct:whyPct, unsound:wUnsound,
               of:ITEMS.filter(function(i){return i.why;}).length},
    practical:practical, practicalPct: pMax?Math.round(pGot*100/pMax):0,
    hints:st.hintsUsed, gap:gap, advice:advice,
    minutes: Math.max(1, Math.round((Date.now()-st.started)/60000)),
    progress:progress(st)
  };
}

/* ---------------------------------------------------------------- */
window.PVXLearn = {
  newState:newState, setMode:setMode, modeOf:M,
  ITEMS:ITEMS, STAGES:STAGES, items:items, item:item,
  submit:submit, reveal:reveal, hint:hint, submitWhy:submitWhy,
  drugCard:drugCard, findInteraction:findInteraction,
  findDiseaseRisk:findDiseaseRisk, diseaseRisksFor:diseaseRisksFor,
  searchTerms:searchTerms,
  GUIDE_Q:GUIDE_Q, causality:causality, naranjo:naranjo, NARANJO:NARANJO,
  whoUmc:whoUmc, WHO_UMC:WHO_UMC, SERIOUS_CRITERIA:SERIOUS_CRITERIA,
  icsrFields:icsrFields, validateIcsr:validateIcsr,
  gradeSignal:gradeSignal, gradeMissing:gradeMissing, openSource:openSource,
  progress:progress, mark:mark
};
})();
