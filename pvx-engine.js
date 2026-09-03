/* =====================================================================
   pvx-engine.js — the simulation and assessment engine for PV-X.

   There is no language model behind this and there is no network call.
   The patient is a deterministic interviewer-response engine: it maps the
   student's free-text question onto one of the fields a real patient could
   answer, then answers ONLY that field, in the voice of the assigned
   persona, from the hidden case.

   That is a deliberate choice, not a limitation. A marking engine has to
   be reproducible — the same interview must produce the same score for
   every student and every examiner, and it must keep working when the
   college wifi does not. It also means the patient physically cannot leak
   an answer that was not asked for, which is the whole premise of §3 of
   the specification.

   Public surface:
     PVX.classify(q)              -> {slot, quality, flags}
     PVX.answer(state, q)         -> {text, slot, quality, gained, note}
     PVX.completeness(state)      -> 0..100
     PVX.grantSource(state, key)  -> slots credited by an external source
     PVX.mark(state, answers)     -> the full performance report
   ===================================================================== */
(function(){
'use strict';

/* ------------------------------------------------------------------ *
 * 1 · the fields a patient can be asked about                         *
 * ------------------------------------------------------------------ */
var SLOTS = [
 {id:'patient_name', g:'Patient',  label:'Patient identity',
  p:['your name','who am i speaking','what.*call you','patient name','identify yourself']},
 {id:'patient_age', g:'Patient',   label:'Age',
  p:['how old','your age','\\bage\\b','date of birth','\\bdob\\b','what age']},
 {id:'patient_sex', g:'Patient',   label:'Sex',
  p:['male or female','your (sex|gender)','\\bgender\\b']},
 {id:'patient_weight', g:'Patient',label:'Weight',
  p:['weight','weigh','kilos','\\bkg\\b','how heavy']},
 {id:'pregnancy', g:'Patient',     label:'Pregnancy status',
  p:['pregnan','expecting','last (menstrual|period)','\\blmp\\b','breast.?feed','menstrual']},
 {id:'occupation', g:'Patient',    label:'Occupation',
  p:['what do you do','your (job|work|occupation)','for a living','what is your profession']},

 {id:'drug_name', g:'Suspect drug',label:'Name of the suspect medicine',
  p:['(name|which|what).{0,24}(medicine|drug|tablet|medication|capsule)','what.{0,20}(medicine|tablet|drug).{0,20}(taking|started|given)',
     'new medicine','which one','name of the (drug|medicine|tablet)','what are you taking']},
 {id:'drug_dose', g:'Suspect drug',label:'Dose and strength',
  p:['\\bdose\\b','dosage','how (much|many).{0,20}(mg|milligram|tablet)','strength','milligram','\\bmg\\b','how many tablets']},
 {id:'drug_route', g:'Suspect drug',label:'Route',
  p:['how do you take','by mouth','\\boral','injection','\\broute\\b','swallow','tablet or injection']},
 {id:'drug_freq', g:'Suspect drug',label:'Frequency',
  p:['how (often|many times)','frequency','once a day','twice a day','times a day','per day','\\bdaily\\b','morning and night']},
 {id:'drug_start', g:'Suspect drug',label:'Start date',
  p:['when did you start','start(ed)? (the|taking|it)','first (dose|took|take)','begin taking','since when','how long have you been taking','when was it started']},
 {id:'drug_stop', g:'Suspect drug',label:'Stop date',
  p:['when did you stop','stop(ped)? (the|taking|it)','last dose','still taking','discontinu','are you still on']},
 {id:'drug_indication', g:'Suspect drug',label:'Indication',
  p:['why (were|are|was) (you|he|she|it)','what (is|was) it for','indication','prescribed for','what was it given for','why did they give']},
 {id:'drug_brand', g:'Suspect drug',label:'Brand',
  p:['\\bbrand\\b','which company','trade name','manufacturer']},
 {id:'drug_batch', g:'Suspect drug',label:'Batch number',
  p:['batch','lot number','expiry','strip']},
 {id:'drug_prescriber', g:'Suspect drug',label:'Prescriber',
  p:['who prescribed','which doctor','who gave you','who wrote']},
 {id:'adherence', g:'Suspect drug',label:'Adherence',
  p:['take (it|them) regularly','miss.{0,12}dose','forget.{0,12}dose','adheren','complian','every day without']},

 {id:'event_desc', g:'Reaction',   label:'Description of the reaction',
  p:['what happened','describe','what (symptoms|is wrong|was wrong)','tell me about the (reaction|problem|symptom|rash|blister)',
     'what (are|were) (you|the) (feeling|symptoms)','what is the problem','how does it look']},
 {id:'event_onset', g:'Reaction',  label:'Date of onset',
  p:['when did .{0,60}(start|begin|happen|appear|come|develop)','\\bonset\\b','how long after','how many days after',
     'first (notice|appear|start|develop)','when did you first','what date did (it|they) start','how soon after']},
 {id:'event_course', g:'Reaction', label:'Clinical course',
  p:['(getting|got|gotten) (worse|better)','how has it (changed|progressed)','since then','is it spreading','progress']},
 {id:'event_outcome', g:'Reaction',label:'Outcome',
  p:['(are|is) (you|he|she) (better|recovered|alright|ok)','outcome','recovered','resolved','back to normal','how are you now']},
 {id:'event_hosp', g:'Reaction',   label:'Hospitalisation',
  p:['hospital','admit','admitted','\\bward\\b','emergency','casualty','icu','stay in']},
 {id:'severity', g:'Reaction',     label:'Severity',
  p:['how (bad|severe)','severity','how serious','life threatening']},
 {id:'fever', g:'Reaction',        label:'Fever',
  p:['fever','temperature']},
 {id:'weightloss', g:'Reaction',   label:'Weight loss',
  p:['lost weight','weight loss','losing weight','shirts loose']},
 {id:'orthopnoea', g:'Reaction',   label:'Congestive features',
  p:['pillow','lie (flat|down)','orthopn','ankle','swell','oedema','edema','breathless at night']},

 {id:'conmeds', g:'Other medicines',label:'Concomitant medicines',
  p:['other (medicine|drug|tablet|medication)','any other','(what|anything|something) else','concomitant',
     'regular medicine','currently taking','all your medicines','list of medicines','what medicines are you on']},
 {id:'otc', g:'Other medicines',   label:'Over-the-counter and home medicines',
  p:['over the counter','\\botc\\b','bought','chemist','without (a )?prescription','at home','leftover','pain killer','painkiller','self.?medicat']},
 {id:'herbal', g:'Other medicines',label:'Herbal and traditional medicines',
  p:['herbal','ayurved','homeopath','siddha','unani','supplement','vitamin','tonic','traditional','home remedy']},

 {id:'pmh', g:'History',           label:'Medical history',
  p:['medical history','past (illness|history|medical)','other (illness|condition|disease)','any (illness|conditions|diseases)',
     'do you have any (other |long.term |chronic )?(illness|condition|disease|problem)','background illness','chronic (illness|disease|condition)',
     'any health problems','are you being treated for']},
 {id:'allergy', g:'History',       label:'Allergies',
  p:['allerg','reacted to any','sensitive to','intoleran']},
 {id:'prev_exposure', g:'History', label:'Previous exposure to the drug',
  p:['taken (it|this|the drug|the medicine) before','previously','ever (had|taken) (this|it)','first time','before this','in the past have you']},
 {id:'family', g:'History',        label:'Family history',
  p:['family history','anyone in your family','relatives','your (mother|father|sister|brother)']},
 {id:'renal', g:'History',         label:'Renal function',
  p:['kidney','renal','creatinine','egfr','dialysis']},

 {id:'alcohol', g:'Lifestyle',     label:'Alcohol',
  p:['alcohol','\\bdrink','beer','liquor','whisky','toddy']},
 {id:'smoking', g:'Lifestyle',     label:'Smoking',
  p:['smok','cigarette','tobacco','beedi','pack.?year']},
 {id:'travel', g:'Lifestyle',      label:'Travel',
  p:['travel','abroad','outside the','\\btrip\\b','journey']},
 {id:'diet', g:'Lifestyle',        label:'Diet and food exposure',
  p:['\\beat','food','\\bdiet\\b','\\bmeal','street','stall','outside food']},
 {id:'occupation_exposure', g:'Lifestyle',label:'Occupational exposure',
  p:['\\bdust\\b','chemical','factory','\\bmill\\b','exposure at work','occupational','asbestos','fumes']},

 {id:'dechallenge', g:'Challenge', label:'Dechallenge',
  p:['(stop|stopped|withdraw|withdrew).{0,40}(improve|better|settle|resolve|recover|go away)',
     '(improve|better|settle|resolve|recover|go away).{0,40}(stop|stopped|withdraw|discontinu)',
     'after (stopping|you stopped|it was stopped)','dechallenge','what happened when.{0,20}stopped',
     'did it get better after','once you stopped']},
 {id:'rechallenge', g:'Challenge', label:'Rechallenge',
  p:['(take|taken|took|start|started|give|given|prescrib\\w*|put back on).{0,25}again','restart','re.?challenge',
     'second time','tried it again','come back when','re.?exposed','back on the (drug|medicine|tablet)']},

 {id:'labs', g:'Investigations',   label:'Investigations',
  p:['blood test','\\blab\\b','laborator','liver function','\\btests?\\b','(lab|test|blood|pathology|biopsy|scan)\\s+report',
     'investigation','\\bscan\\b','x.?ray','biopsy','ultrasound','\\becg\\b','\\bresults?\\b','blood work']},

 {id:'contraception', g:'Special', label:'Contraception',
  p:['contracept','birth control','the pill','condom','protection','family planning']},
 {id:'pregnancy_test', g:'Special',label:'Pregnancy testing',
  p:['pregnancy test','urine test','beta ?hcg','\\bhcg\\b','tested for pregnancy']},

 {id:'reporter', g:'Reporter',     label:'Reporter details',
  p:['who (are|is) (you|reporting)','your (qualification|profession)','contact (number|details)','reporting this',
     'how (can|do) (we|i) (contact|reach)','can i (have|take) your','who is the reporter','for the report',
     'reach you','your (phone|mobile|address|contact)','reporter details']}
];
var SLOT_BY_ID = {}; SLOTS.forEach(function(s){
  SLOT_BY_ID[s.id]=s;
  s.rx = s.p.map(function(x){ return new RegExp(x,'i'); });
});

/* meta-patterns */
var RX_FISH   = /(tell|give) me everything|everything you know|everything about|full history|all the details|whole story|complete history|summarise the case|summarize the case|what is the diagnosis|what caused it|what do you think caused/i;
var RX_LEAD   = /did(n'?t| not) it\??\s*$|isn'?t (it|that)\??\s*$|wasn'?t it\??\s*$|,? *right\??\s*$|,? *correct\??\s*$|(medicine|drug|tablet|it) caused (your|the|this)|so the (medicine|drug|tablet) caused|you agree|obviously (the|it)|it must have been the|surely the/i;
var RX_GREET  = /^\s*(hello|hi|hey|good (morning|afternoon|evening)|namaste|namaskar)\b/i;
var RX_THANKS = /^\s*(thank|thanks|ok(ay)?|alright|got it|noted|i see)\b/i;
var RX_SPEC   = /\b(exact|exactly|which date|what date|how many|how much|milligram|mg\b|strength|dose|specific|precisely|name of)\b/i;

/* ------------------------------------------------------------------ *
 * 2 · classifying the question                                        *
 * ------------------------------------------------------------------ */
function classify(q){
  var t = String(q||'').trim();
  var words = t.split(/\s+/).filter(Boolean).length;
  if(!t) return {slot:null, quality:'empty', flags:[]};
  if(RX_GREET.test(t) && words<=4)  return {slot:null, quality:'social', flags:['greeting']};
  if(RX_THANKS.test(t) && words<=4) return {slot:null, quality:'social', flags:['ack']};
  if(RX_FISH.test(t))               return {slot:null, quality:'fishing', flags:['fishing']};

  /* Two slots can legitimately match the same sentence. These rules settle the
     ones that actually come up: "what OTHER medicines" is a concomitant-medicine
     question even though it also reads as a drug-name question, and "did it get
     better after you stopped" is a dechallenge question, not a stop-date one. */
  var PREFER = [
    {when:/\b(other|else|also|besides|apart from|additional|any more|anything more)\b/i, prefer:'conmeds', over:['drug_name','drug_dose','drug_freq']},
    {when:/\b(improve|better|settle|resolve|recover|go away|went away)\b/i, prefer:'dechallenge', over:['drug_stop','event_course','event_outcome']},
    {when:/\bfor the report\b|contact (number|details)/i, prefer:'reporter', over:['labs','event_desc']}
  ];

  var hits=[];
  SLOTS.forEach(function(s){
    var n=0; s.rx.forEach(function(r){ if(r.test(t)) n++; });
    if(n) hits.push({id:s.id, n:n});
  });
  hits.sort(function(a,b){ return b.n-a.n; });
  PREFER.forEach(function(r){
    if(!r.when.test(t)) return;
    var has = hits.filter(function(h){ return h.id===r.prefer; })[0];
    if(!has) return;
    if(r.over.indexOf(hits[0].id)<0) return;
    hits = [has].concat(hits.filter(function(h){ return h.id!==r.prefer; }));
  });

  var leading = RX_LEAD.test(t);
  if(!hits.length){
    return {slot:null, quality: leading?'leading':'irrelevant', flags: leading?['leading']:[]};
  }
  if(leading) return {slot:hits[0].id, quality:'leading', flags:['leading']};

  var flags=[];
  var quality;
  if(hits.length>=4){ quality='poor'; flags.push('shotgun'); }
  else if(words<=2){ quality='poor'; flags.push('too-terse'); }
  else if(RX_SPEC.test(t) || words>=6){ quality='excellent'; }
  else { quality='relevant'; }
  return {slot:hits[0].id, quality:quality, flags:flags, alt:hits.slice(1,3).map(function(h){return h.id;})};
}

/* ------------------------------------------------------------------ *
 * 3 · what the patient can say                                        *
 * ------------------------------------------------------------------ */
function dot(s){ s=String(s||'').trim(); return /[.!?]$/.test(s)?s:s+'.'; }
function fmtConmeds(list){
  if(!list||!list.length) return 'Nothing else.';
  return list.map(function(m){
    return m.name+' '+m.dose+', '+String(m.freq).toLowerCase()+' — '+String(m.ind).toLowerCase();
  }).join('. ')+'.';
}
function generated(slot, C){
  var T=C.truth, P=T.patient, D=T.drug, E=T.event, H=T.history, L=T.lifestyle;
  switch(slot){
    case 'patient_name': return dot('My name is '+P.name);
    case 'patient_age':  return dot('I am '+P.age);
    case 'patient_sex':  return dot(P.sex);
    case 'patient_weight': return dot('About '+P.weight);
    case 'pregnancy':    return dot(P.pregnancy);
    case 'occupation':   return dot(P.occupation);
    case 'drug_name':    return 'It is '+D.generic+'. The strip says '+D.brand+'.';
    case 'drug_dose':    return dot(D.dose);
    case 'drug_route':   return D.route.toLowerCase()==='oral'?'By mouth, a tablet.':D.route+'.';
    case 'drug_freq':    return dot(D.freq);
    case 'drug_start':   return 'I started it on '+D.start+'.';
    case 'drug_stop':    return D.stop==='Continuing at the time of report'?'I am still taking it.':'I stopped on '+D.stop+'.';
    case 'drug_indication': return 'It was for '+String(D.indication).toLowerCase()+'.';
    case 'drug_brand':   return 'The brand is '+D.brand+'.';
    case 'drug_batch':   return 'I do not have the strip with me — the pharmacy would have the batch number.';
    case 'drug_prescriber': return dot(D.prescriber);
    case 'adherence':    return 'I took it as they told me.';
    case 'event_desc':   return E.lay.charAt(0).toUpperCase()+E.lay.slice(1)+'.';
    case 'event_onset':  return E.onset==='—'?'I cannot put a date on it.':'It began on '+E.onset+'.';
    case 'event_course': return dot(E.course);
    case 'event_outcome':return dot(E.outcome);
    case 'event_hosp':   return dot(E.hosp);
    case 'severity':     return E.serious?'It was bad enough that they took it seriously.':'It has not put me in any danger, but it will not go away.';
    case 'fever':        return (L&&L.fever)||'I did not check my temperature much.';
    case 'weightloss':   return 'I have not weighed myself.';
    case 'orthopnoea':   return 'I sleep the same as always.';
    case 'conmeds':      return fmtConmeds(T.conmeds);
    case 'otc':          return 'Only what I have told you about.';
    case 'herbal':       return (L&&L.herbal)||'No herbal medicines.';
    case 'pmh':          return dot(H.pmh);
    case 'allergy':      return dot(H.allergy);
    case 'prev_exposure':return dot(H.prevExposure);
    case 'family':       return dot(H.family);
    case 'renal':        return 'They have never told me anything about my kidneys.';
    case 'alcohol':      return dot(L.alcohol);
    case 'smoking':      return dot(L.smoking);
    case 'travel':       return dot(L.travel);
    case 'diet':         return dot(L.diet);
    case 'occupation_exposure': return L.occupationExposure||'Nothing like that at my work.';
    case 'dechallenge':  return T.dechallenge.done+'. '+T.dechallenge.improved+'. '+T.dechallenge.time;
    case 'rechallenge':  return T.rechallenge.done+'. '+T.rechallenge.why;
    case 'labs':         return 'They did take blood, but I do not understand the numbers. The doctor has them.';
    case 'contraception':return 'I would rather the doctor explained that part.';
    case 'pregnancy_test':return 'They did a test at the beginning.';
    case 'reporter':     return C.reporter.who+'. You can reach me — '+C.reporter.contact+'.';
  }
  return null;
}

/* persona voice ---------------------------------------------------- */
var TANGENT = [
 'Sorry — I know I am talking too much, I have not slept properly.',
 'My husband said I should not have taken anything at all, but what was I supposed to do?',
 'I looked it up on the internet last night and now I am more frightened than before.',
 'My neighbour had something similar, she said it was the water.',
 'Is this going to be on my record? Will it affect my insurance?'
];
var FRAGMENT_TAIL = ' I cannot remember more than that just now.';

function persona(text, slot, C, st){
  var p = C.persona;
  if(!text) return text;
  if(p==='C'){
    var asked = st.slotAsk[slot]||0;
    if(asked<=1){
      var first = text.split(/(?<=[.!?])\s+/)[0];
      if(first && first.length < text.length) return first + FRAGMENT_TAIL;
      if(text.length>90) return text.slice(0,80).replace(/[ ,;]+$/,'')+'…'+FRAGMENT_TAIL;
    }
    return text;
  }
  if(p==='D'){
    st.tang = (st.tang||0)+1;
    if(st.tang%2===0) return text+' '+TANGENT[(st.tang/2-1)%TANGENT.length];
    return text;
  }
  if(p==='E'){
    /* the reporter is the parent — symptom and history answers are about the child */
    var third = ['event_desc','event_course','event_outcome','severity','pmh','allergy','prev_exposure','adherence','fever'];
    if(third.indexOf(slot)>=0 && !/^he\b|^his\b/i.test(text)) return text;
  }
  return text;
}

var DEFLECT = [
 'I am not sure what you mean. Could you ask me that a different way?',
 'I would not know about that, I am afraid.',
 'Nobody has ever asked me that. I could not say.',
 'That is not something I can tell you.'
];
var FISHING = [
 'I have already told you what I remember. What exactly would you like to know?',
 'I would not know where to start. Ask me something and I will answer it.',
 'I am not a doctor — you will have to ask me the questions.',
 'I have told you everything I thought was important. If there is something specific, ask me.'
];
var LEADING = [
 'I would not like to say that. I only know what happened to me.',
 'You are putting words in my mouth. All I can tell you is what I noticed.',
 'That is for you to work out, is it not? I can only tell you what I felt.'
];
var SOCIAL = 'Hello. Thank you for seeing me.';

/* ------------------------------------------------------------------ *
 * 4 · answering                                                       *
 * ------------------------------------------------------------------ */
function answer(st, q){
  var C = st.C;
  var c = classify(q);
  var out = {slot:c.slot, quality:c.quality, flags:c.flags||[], gained:false, note:'', text:''};

  if(c.quality==='social'){ out.text = SOCIAL; return out; }
  if(c.quality==='fishing'){
    out.text = FISHING[(st.fish=(st.fish||0)+1)%FISHING.length];
    out.note = 'The patient will not summarise the case for you. §29 — the interview is the assessment.';
    return out;
  }
  if(c.quality==='leading'){
    out.text = LEADING[(st.lead=(st.lead||0)+1)%LEADING.length];
    out.note = 'Leading question — recorded against the interview score.';
    return out;
  }
  if(!c.slot){ out.text = DEFLECT[(st.defl=(st.defl||0)+1)%DEFLECT.length]; return out; }

  st.slotAsk[c.slot] = (st.slotAsk[c.slot]||0)+1;

  var txt = null, wrong = false;
  if(C.contradiction && C.contradiction.slots && C.contradiction.slots[c.slot]!=null){
    txt = C.contradiction.slots[c.slot]; wrong = true;
  } else if(C.say && C.say[c.slot]!=null){
    txt = C.say[c.slot];
  } else {
    txt = generated(c.slot, C);
  }
  if(txt==null){ out.text = DEFLECT[(st.defl=(st.defl||0)+1)%DEFLECT.length]; return out; }

  out.text = persona(txt, c.slot, C, st);

  var fragmented = (C.persona==='C' && st.slotAsk[c.slot]<=1 && /cannot remember more/.test(out.text));
  if(!fragmented){
    if(!st.obtained[c.slot]){ st.obtained[c.slot]='patient'; out.gained = true; }
    if(wrong) st.unverified[c.slot] = true;   /* obtained, but from an unreliable source */
  } else {
    out.note = 'Fragmented answer — a follow-up on the same point will get you more.';
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 5 · the external sources                                            *
 * ------------------------------------------------------------------ */
var SOURCE_GRANTS = {
  doctor:   ['event_desc','event_course','event_outcome','severity','labs','renal','event_hosp','dechallenge'],
  pharmacist:['drug_name','drug_dose','drug_freq','drug_route','drug_start','drug_stop','drug_brand',
              'drug_batch','drug_prescriber','conmeds','otc','adherence'],
  records:  ['pmh','allergy','prev_exposure','event_hosp','patient_age','patient_sex','family'],
  labs:     ['labs']
};
function grantSource(st, key){
  var got = [];
  (SOURCE_GRANTS[key]||[]).forEach(function(s){
    if(!st.obtained[s]){ st.obtained[s]=key; got.push(s); }
    if(st.unverified[s]) delete st.unverified[s];      /* the record settles it */
  });
  st.sources[key] = true;
  st.regDay += 1;                                       /* every enquiry costs a day */
  return got;
}

/* ------------------------------------------------------------------ *
 * 6 · completeness                                                    *
 * ------------------------------------------------------------------ */
function completeness(st){
  var crit = st.C.expect.critical||[];
  if(!crit.length) return 0;
  var n=0; crit.forEach(function(s){ if(st.obtained[s]) n++; });
  return Math.round(n*100/crit.length);
}
function missing(st){
  return (st.C.expect.critical||[]).filter(function(s){ return !st.obtained[s]; });
}

/* ------------------------------------------------------------------ *
 * 7 · marking                                                         *
 * ------------------------------------------------------------------ */
function pct(n,d){ return d>0?Math.max(0,Math.min(100,Math.round(n*100/d))):0; }
function band(p){ return p>=85?'Excellent':p>=70?'Good':p>=55?'Satisfactory':p>=40?'Weak':'Poor'; }

function naranjoTotal(a){
  /* +1/-1 scoring per the ten Naranjo items, in the order presented */
  var W = [[1,0,0],[2,-1,0],[1,0,0],[2,-1,0],[-1,2,0],[-1,1,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0]];
  var t=0;
  for(var i=0;i<10;i++){
    var v=a['q'+(i+1)];
    t += v==='yes'?W[i][0] : v==='no'?W[i][1] : W[i][2];
  }
  return t;
}
function naranjoBand(t){
  return t>=9?'definite' : t>=5?'probable' : t>=1?'possible' : 'doubtful';
}

function textMatch(given, list){
  var g = String(given||'').toLowerCase();
  if(!g.trim()) return false;
  for(var i=0;i<list.length;i++){ if(g.indexOf(String(list[i]).toLowerCase())>=0) return true; }
  return false;
}

function mark(st, A){
  var C = st.C, X = C.expect, out = {rows:[], flags:[], strengths:[], gaps:[]};

  /* --- 1 · patient interviewing (question quality) --- */
  var q = st.qstats;
  var asked = q.excellent+q.relevant+q.poor+q.irrelevant+q.leading+q.fishing;
  var good  = q.excellent*1 + q.relevant*0.7;
  var iv = asked ? pct(good - (q.leading*0.9 + q.irrelevant*0.5 + q.fishing*0.7), asked) : 0;
  if(asked<8) iv = Math.min(iv, 45);
  out.rows.push({k:'Patient interviewing', w:10, p:iv});

  /* --- 2 · relevant questioning (did they cover the groups) --- */
  var groups = {}; SLOTS.forEach(function(s){ groups[s.g]=groups[s.g]||0; });
  Object.keys(st.obtained).forEach(function(s){ if(SLOT_BY_ID[s]) groups[SLOT_BY_ID[s].g]++; });
  var covered = Object.keys(groups).filter(function(g){ return groups[g]>0; }).length;
  out.rows.push({k:'Relevant questioning', w:10, p:pct(covered, Object.keys(groups).length)});

  /* --- 3 · case completeness --- */
  var comp = completeness(st);
  out.rows.push({k:'Case completeness', w:12, p:comp});

  /* --- 4 · timeline --- */
  var tl = A.timeline||{};
  var keyEvents = X.timeline.filter(function(e){ return e.key; });
  var tHit=0; keyEvents.forEach(function(e,i){ if(tl['t'+i]) tHit++; });
  var tTrap=0; (X.distractors||[]).forEach(function(dd,i){ if(tl['d'+i]) tTrap++; });
  var tp = pct(tHit, keyEvents.length) - tTrap*18;
  out.rows.push({k:'Timeline construction', w:10, p:Math.max(0,tp)});
  if(tTrap) out.flags.push('You placed '+tTrap+' event'+(tTrap>1?'s':'')+' in the timeline that the record does not support.');

  /* --- 5 · ADR identification --- */
  var adrOK = textMatch(A.adr, X.adr);
  out.rows.push({k:'ADR identification', w:10, p:adrOK?100:0});

  /* --- 6 · seriousness --- */
  var sOK = (A.serious==='serious') === !!X.serious;
  var cOK = sOK && (!X.serious || String(A.criterion||'')===X.criterion);
  out.rows.push({k:'Seriousness assessment', w:10, p: sOK ? (X.serious ? (cOK?100:60) : 100) : 0});
  if(sOK && X.serious && !cOK) out.flags.push('Serious was correct, but the criterion was not — the expected criterion is "'+X.criterion+'".');

  /* --- 7 · causality --- */
  var nt = naranjoTotal(A.naranjo||{});
  var nb = naranjoBand(nt);
  var expBand = X.causality;
  var adjacent = {doubtful:['possible'], possible:['doubtful','probable'], probable:['possible','definite'], definite:['probable'],
                  'not assessable':['doubtful','possible']};
  var cp;
  if(expBand==='not assessable'){
    /* PV-PREG-004: there is no adverse outcome yet, so there is nothing whose
       causality can be scored. Confidently scoring "probable" here is a worse
       error than scoring it low, and the marking has to say so. */
    cp = (nt<=2 || A.who==='unassessable') ? 100 : 25;
  } else {
    cp = nb===expBand?100 : ((adjacent[expBand]||[]).indexOf(nb)>=0?65:20);
  }
  /* the number is only half of it — was the reasoning about alternatives done? */
  var altGiven = String(A.alt||'').toLowerCase();
  var altHit = (X.alt||[]).filter(function(a){ return altGiven.indexOf(String(a).split(' ')[0].toLowerCase())>=0; }).length;
  var altP = pct(altHit, Math.min(3,(X.alt||[]).length||1));
  out.rows.push({k:'Causality assessment', w:14, p:Math.round(cp*0.6+altP*0.4)});
  out.naranjo = {score:nt, band:nb, expected:expBand, expectedScore:X.naranjoScore};

  /* --- 8 · follow-up strategy --- */
  var fu = (A.followUp||[]).length;
  out.rows.push({k:'Follow-up strategy', w:8, p:pct(Math.min(fu,4),4)});

  /* --- 9 · ICSR accuracy --- */
  var icsr = A.icsr||{};
  var need = ['patient','drug','event','reporter'];
  var have = need.filter(function(k){ return String(icsr[k]||'').trim().length>2; }).length;
  var extra = ['dose','route','start','onset','outcome','conmeds','history','causality'];
  var haveX = extra.filter(function(k){ return String(icsr[k]||'').trim().length>1; }).length;
  var vErr = (A.validation||[]).length;
  var ip = Math.round(pct(have,4)*0.5 + pct(haveX,extra.length)*0.5) - vErr*12;
  out.rows.push({k:'ICSR accuracy', w:10, p:Math.max(0,ip)});
  if(have<4) out.flags.push('The report is missing one of the four minimum elements — an identifiable patient, an identifiable reporter, a suspect medicine and a suspected reaction. Without all four it is not a valid case.');

  /* --- 10 · signal interpretation --- */
  var sg = A.signal||{};
  var dupOK = !!sg.dupCorrect, dupBad = sg.dupWrong||0;
  var sigOK = (sg.isSignal===!!X.signal.isSignal);
  var hypOK = !!sg.hypothesis;
  var sp = (sigOK?45:0) + (dupOK?25:0) + (hypOK?30:0) - dupBad*15;
  out.rows.push({k:'Signal interpretation', w:6, p:Math.max(0,Math.min(100,sp))});

  /* ---- weighted total ---- */
  var tot=0, wt=0;
  out.rows.forEach(function(r){ tot += r.p*r.w; wt += r.w; });
  out.total = Math.round(tot/wt);
  out.band = band(out.total);
  out.pass = out.total>=50;

  /* ---- meters ---- */
  out.discipline = st.meters.discipline;
  out.integrity  = st.meters.integrity;

  /* ---- narrative ---- */
  out.missed = missing(st).map(function(s){ return (SLOT_BY_ID[s]||{}).label||s; });
  if(adrOK) out.strengths.push('You identified the reaction correctly as '+X.adrText+'.');
  if(comp>=80) out.strengths.push('Case completeness reached '+comp+'% — a well-worked interview.');
  if(st.sources.pharmacist) out.strengths.push('You went to the dispensing record rather than relying on the patient’s memory.');
  if(sOK) out.strengths.push('Seriousness was classified correctly.');
  if(tHit===keyEvents.length && !tTrap) out.strengths.push('The timeline is exactly right, with none of the distractors included.');
  if(altHit>=2) out.strengths.push('Alternative causes were actually investigated rather than asserted away.');

  if(!st.sources.pharmacist && C.contradiction) out.gaps.push('You never contacted the pharmacist. '+C.contradiction.why);
  if(q.leading) out.gaps.push('You asked '+q.leading+' leading question'+(q.leading>1?'s':'')+'. A leading question contaminates the answer you get, and in a real investigation it is the first thing an auditor looks for.');
  if(q.fishing) out.gaps.push('You tried to get the patient to summarise the case '+q.fishing+' time'+(q.fishing>1?'s':'')+'. Patients do not present cases; they answer questions.');
  if(!adrOK) out.gaps.push('The reaction was not correctly identified. The expected concept was: '+X.adrText+'.');
  if(altHit<2) out.gaps.push('Alternative causes were not adequately investigated. '+X.altRefuted);
  if(fu<3) out.gaps.push('Your follow-up plan is thin. Every case with unknown or incomplete elements needs a specific, written request for the missing information.');
  if(Object.keys(st.unverified).length) out.gaps.push('You accepted information from the patient that the record contradicts, and never verified it: '+
      Object.keys(st.unverified).map(function(s){return (SLOT_BY_ID[s]||{}).label||s;}).join(', ')+'.');
  if(!hypOK) out.gaps.push('You did not record that a signal is a hypothesis requiring evaluation. A signal is never, on its own, proof of causation.');

  return out;
}

/* ------------------------------------------------------------------ *
 * 8 · session state                                                   *
 * ------------------------------------------------------------------ */
function newState(C){
  return {
    C:C, started:Date.now(), regDay:0,
    obtained:{}, unverified:{}, slotAsk:{}, sources:{},
    transcript:[],
    qstats:{excellent:0,relevant:0,poor:0,irrelevant:0,leading:0,fishing:0,social:0},
    meters:{discipline:100, integrity:100}
  };
}
function record(st, q, a){
  st.transcript.push({q:q, a:a.text, slot:a.slot, quality:a.quality, at:new Date().toISOString()});
  var k = a.quality;
  if(st.qstats[k]!=null) st.qstats[k]++;
  if(k==='leading')    st.meters.discipline -= 12;
  if(k==='irrelevant') st.meters.discipline -= 4;
  if(k==='fishing')    st.meters.discipline -= 8;
  if(k==='poor')       st.meters.discipline -= 2;
  st.meters.discipline = Math.max(0, st.meters.discipline);
}

window.PVX = {
  SLOTS:SLOTS, SLOT_BY_ID:SLOT_BY_ID, SOURCE_GRANTS:SOURCE_GRANTS,
  classify:classify, answer:answer, record:record, newState:newState,
  grantSource:grantSource, completeness:completeness, missing:missing,
  mark:mark, naranjoTotal:naranjoTotal, naranjoBand:naranjoBand
};
})();
