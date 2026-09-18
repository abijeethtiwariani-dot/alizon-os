/* =====================================================================
   pvsoft-engine.js — everything the PV Lab decides.

   Deterministic and offline, for the same reason the workshop engine is:
   two students working the same case must get the same result, and a
   training system that needs a network to mark a case is a training
   system that stops working on the day of the workshop.

   ABOUT THE "AI ASSISTANT" AND THE NARRATIVE GENERATOR. There is no
   language model here and this file does not pretend otherwise. The
   narrative is composed from the structured case data by rules, which is
   how narrative tooling in real safety systems mostly works, and the
   assistant answers from the case record and the reference data. The UI
   says so plainly rather than implying a model is reasoning about the
   patient. Overstating what generated a clinical narrative is exactly
   the kind of claim a safety system should not make about itself.

   Public API:
     PVSoftEngine.validity(c)         the four minimum elements
     PVSoftEngine.triage(c, answers)  priority, with reasons
     PVSoftEngine.duplicates(c, all)  scored candidate matches
     PVSoftEngine.seriousness(crit)   serious? and which criterion
     PVSoftEngine.expectedness(drugKey, pt)
     PVSoftEngine.causality(answers)  WHO-UMC style verdict
     PVSoftEngine.searchTerms(q)      the synthetic dictionary
     PVSoftEngine.gaps(c)             what follow-up should chase
     PVSoftEngine.narrative(c)        the generated draft
     PVSoftEngine.qcChecks(c)         the QC checklist, auto-evaluated
     PVSoftEngine.icsr(c)             the ICSR field set
     PVSoftEngine.detectSignals(cases)
     PVSoftEngine.analytics(cases)
     PVSoftEngine.score(c)            against the training answer key
     PVSoftEngine.assist(c, intent)   the assistant
   ===================================================================== */
(function(){
'use strict';
if (window.PVSoftEngine) return;

var D  = window.PVSoftData || {};
var LD = window.PVXLearnData || {};
var LE = window.PVXLearn || {};

function s(x){ return String(x==null?'':x).trim(); }
function has(x){ return s(x) !== ''; }
function days(a, b){
  if(!a || !b) return null;
  var d1 = new Date(a), d2 = new Date(b);
  if(isNaN(d1) || isNaN(d2)) return null;
  return Math.round((d2-d1)/86400000);
}

/* ================================================================== *
 * 1 · CASE VALIDITY — the four minimum elements                      *
 * ================================================================== */
function validity(c){
  var suspects = (c.drugs||[]).filter(function(d){ return d.category==='Suspect'; });
  var checks = [
    {k:'patient',  label:'Identifiable patient',
     ok: has(c.patient && c.patient.pid) || has(c.patient && c.patient.age) || has(c.patient && c.patient.sex),
     why:'Initials, age or sex will do. A named patient is not required and usually should not be recorded.'},
    {k:'reporter', label:'Identifiable reporter',
     ok: has(c.reporter && c.reporter.name) && (has(c.reporter.email) || has(c.reporter.phone)),
     why:'Somebody who can be contacted for follow-up. A name with no way to reach them is not enough.'},
    {k:'product',  label:'Suspect product',
     ok: suspects.length > 0 && has(suspects[0].generic || suspects[0].product),
     why:'At least one drug recorded as Suspect, named.'},
    {k:'event',    label:'Adverse event',
     ok: (c.events||[]).length > 0 && has(c.events[0].reported),
     why:'Something that actually happened to the patient, in the reporter’s words.'}
  ];
  var missing = checks.filter(function(x){ return !x.ok; });
  return {checks:checks, valid:missing.length===0, missing:missing,
    verdict: missing.length===0
      ? 'VALID SAFETY CASE — all four minimum elements are present, so this can be processed.'
      : 'INCOMPLETE REPORT — '+missing.length+' of the four minimum elements '
        +(missing.length===1?'is':'are')+' missing. Until they are present this is an enquiry, not a case.'};
}

/* ================================================================== *
 * 2 · TRIAGE                                                         *
 *                                                                    *
 * Priority is derived from the answers rather than typed in, and the  *
 * derivation is shown, because a priority nobody can explain is a     *
 * priority nobody will trust.                                         *
 * ================================================================== */
var TRIAGE_Q = [
 {k:'valid',    q:'Is this a valid safety case?',
  help:'All four minimum elements present. If not, it cannot be processed and needs follow-up first.'},
 {k:'serious',  q:'Does the report describe a serious reaction?',
  help:'Death, life-threatening, hospitalisation, disability, congenital anomaly, or otherwise medically important.'},
 {k:'important',q:'Is it medically important even if not obviously serious?',
  help:'The judgement criterion — an event needing intervention to prevent one of the others.'},
 {k:'followup', q:'Does it require follow-up?',
  help:'Are fields missing that would change the assessment?'},
 {k:'dupe',     q:'Could this be a duplicate of a case already held?',
  help:'Same patient, same drug, same event, similar dates.'},
 {k:'expedite', q:'Might expedited reporting be required?',
  help:'Serious cases are normally expedited. This simulation does not make a regulatory determination.'},
 {k:'medical',  q:'Is medical review required?',
  help:'Any serious case, any death, anything where the clinical picture needs a clinician.'}
];

function triage(c, a){
  a = a||{};
  var reasons = [], p = 'LOW';
  if(a.valid === 'no'){
    reasons.push('Not a valid case yet — follow-up is needed before anything else.');
    p = 'MEDIUM';
  }
  if(a.serious === 'yes'){ p = 'URGENT'; reasons.push('Serious reaction reported.'); }
  else if(a.important === 'yes'){ p = 'HIGH'; reasons.push('Medically important even though not meeting an outcome criterion.'); }
  if(a.expedite === 'yes' && p !== 'URGENT'){ p = 'HIGH'; reasons.push('Possible expedited reporting.'); }
  if(a.dupe === 'yes') reasons.push('Possible duplicate — check before entering it as new.');
  if(a.followup === 'yes') reasons.push('Follow-up required.');
  if(a.medical === 'yes') reasons.push('Needs medical review.');
  if(!reasons.length) reasons.push('Non-serious, complete and unremarkable on the information given.');

  return {priority:p, reasons:reasons, answers:a,
    note:'Priority is derived from your answers by fixed rules, as a training aid. '
       + 'It is not a regulatory determination and this system does not make one.'};
}

/* ================================================================== *
 * 3 · DUPLICATE DETECTION                                            *
 *                                                                    *
 * Weighted field agreement. Shown as a percentage AND as the list of  *
 * fields that matched, because a bare similarity number gives the     *
 * student nothing to decide with.                                    *
 * ================================================================== */
function duplicates(c, all){
  var mine = {
    age: s(c.patient && c.patient.age).replace(/\D/g,''),
    sex: s(c.patient && c.patient.sex).toLowerCase(),
    drug: ((c.drugs||[]).filter(function(d){return d.category==='Suspect';})[0]||{}).generic||'',
    event: ((c.events||[])[0]||{}).reported||'',
    coded: (((c.events||[])[0]||{}).coded||{}).pt||'',
    onset: ((c.events||[])[0]||{}).start||'',
    reporter: s(c.reporter && c.reporter.name).toLowerCase()
  };
  var out = [];
  (all||[]).forEach(function(o){
    if(o.id === c.id) return;
    var t = {
      age: s(o.patient && o.patient.age).replace(/\D/g,''),
      sex: s(o.patient && o.patient.sex).toLowerCase(),
      drug: ((o.drugs||[]).filter(function(d){return d.category==='Suspect';})[0]||{}).generic||'',
      event: ((o.events||[])[0]||{}).reported||'',
      coded: (((o.events||[])[0]||{}).coded||{}).pt||'',
      onset: ((o.events||[])[0]||{}).start||'',
      reporter: s(o.reporter && o.reporter.name).toLowerCase()
    };
    var pts = 0, max = 0, hit = [];
    function cmp(w, label, a, b, fuzzy){
      max += w;
      if(!a || !b) return;
      var same = fuzzy
        ? (a.toLowerCase().indexOf(b.toLowerCase())>=0 || b.toLowerCase().indexOf(a.toLowerCase())>=0)
        : (a === b);
      if(same){ pts += w; hit.push(label); }
    }
    cmp(30,'Same suspect drug', mine.drug, t.drug);
    cmp(20,'Same coded reaction', mine.coded, t.coded);
    cmp(15,'Similar reported event', mine.event, t.event, true);
    cmp(15,'Same patient age', mine.age, t.age);
    cmp(10,'Same sex', mine.sex, t.sex);
    var dd = days(mine.onset, t.onset);
    max += 10;
    if(dd !== null && Math.abs(dd) <= 3){ pts += 10; hit.push('Event date within 3 days'); }

    var pct = max ? Math.round(pts*100/max) : 0;
    if(pct >= 45) out.push({case:o, score:pct, matched:hit,
      verdict: pct>=80 ? 'Very likely the same case' : pct>=60 ? 'Possible duplicate' : 'Weak match — probably not'});
  });
  out.sort(function(a,b){ return b.score-a.score; });
  return out;
}

/* ================================================================== *
 * 4 · SERIOUSNESS — one source of truth, shared with the workshop     *
 * ================================================================== */
function criteria(){
  return (LE.SERIOUS_CRITERIA || []).slice();
}
function seriousness(sel){
  sel = sel||[];
  var all = criteria();
  var picked = all.filter(function(x){ return sel.indexOf(x.k)>=0; });
  return {
    serious: picked.length>0, criteria:picked,
    verdict: picked.length
      ? 'SERIOUS — '+picked.map(function(p){ return p.label; }).join('; ')
      : 'NON-SERIOUS — none of the six criteria is met',
    note:'Seriousness is a regulatory classification based on outcome and it sets the reporting timeline. '
       + 'It is not the same question as severity, which describes how intense the reaction was.'
  };
}

/* ================================================================== *
 * 5 · EXPECTEDNESS, against the fictional reference safety information *
 * ================================================================== */
function expectedness(drugKey, pt){
  var rsi = (D.RSI||{})[drugKey];
  if(!rsi) return {known:false, listed:false, verdict:'Unknown',
    note:'No reference safety information held for this product in the training dataset, so listedness cannot be judged.'};
  var freq = rsi.listed[pt];
  return {
    known:true, listed:!!freq, frequency:freq||null, version:rsi.version,
    verdict: freq ? 'Expected' : 'Unexpected',
    note: freq
      ? 'Listed in the reference safety information at frequency "'+freq+'". An expected reaction is still '
        +'reportable — expectedness affects how the case is assessed, not whether it is worth sending.'
      : 'Not listed in the reference safety information. An unexpected serious reaction is the kind of case '
        +'signal detection exists to find, so this one matters more, not less.'
  };
}

/* ================================================================== *
 * 6 · CAUSALITY                                                       *
 * ================================================================== */
var CAUS_Q = [
 {k:'temporal', q:'Was there a reasonable temporal relationship between the drug and the event?'},
 {k:'after',    q:'Did the event occur after the drug was started?'},
 {k:'dechal',   q:'Did the event improve when the drug was stopped or reduced?'},
 {k:'rechal',   q:'Was the drug restarted?'},
 {k:'recur',    q:'Did the event recur on restarting?'},
 {k:'alt',      q:'Are there alternative explanations — the illness, another drug, something else?'},
 {k:'known',    q:'Is this a recognised reaction to this medicine?'},
 {k:'plaus',    q:'Is the relationship biologically plausible?'}
];

function causality(a){
  a = a||{};
  var v, why = [];
  function yes(k){ return a[k]==='yes'; }
  function no(k){ return a[k]==='no'; }

  if(no('after')){
    v = 'unlikely'; why.push('The event began before the drug was given, so this drug cannot have caused it.');
  } else if(yes('rechal') && yes('recur') && no('alt')){
    v = 'certain';
    why.push('Positive rechallenge with recurrence, a clear time relationship and no alternative explanation.');
  } else if(yes('dechal') && no('alt') && yes('known') && yes('temporal')){
    v = 'probable';
    why.push('Reasonable time relationship, positive dechallenge, alternatives excluded, and a recognised reaction.');
  } else if(yes('alt')){
    v = 'possible';
    why.push('A competing explanation has not been excluded, which caps the assessment at possible.');
  } else if(!a.temporal || !a.dechal){
    v = 'conditional';
    why.push('Key information is missing. More data are needed before this can be assessed properly.');
  } else if(yes('temporal')){
    v = 'possible';
    why.push('A reasonable time relationship, but without a clear dechallenge or exclusion of alternatives.');
  } else {
    v = 'unassessable';
    why.push('The information available is insufficient or contradictory.');
  }
  var def = (LE.WHO_UMC||{})[v] || null;
  return {verdict:v, name: def?def.name:v, need: def?def.need:[], note: def?def.note:'',
    why:why,
    disclaimer:'Educational simulation only. A final clinical or regulatory causality assessment requires '
              +'qualified review, and this system does not make one.'};
}

/* ================================================================== *
 * 7 · TERMINOLOGY SEARCH                                              *
 * ================================================================== */
function tok(x){
  return s(x).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/)
    .filter(function(w){ return w.length>2 && ['the','and','with','was','has','for','all','over','very'].indexOf(w)<0; });
}
function searchTerms(q){
  var qt = tok(q);
  if(!qt.length) return [];
  var out = [];
  (D.TERMS||[]).forEach(function(T){
    var best = 0, via = '';
    T.llts.concat([T.pt]).forEach(function(phrase){
      var pt = tok(phrase), n = 0;
      qt.forEach(function(w){ pt.forEach(function(p){
        if(p===w) n += 2; else if(p.indexOf(w)===0 || w.indexOf(p)===0) n += 1; }); });
      var sc = n / Math.max(1, qt.length);
      if(sc > best){ best = sc; via = phrase; }
    });
    if(best > 0){
      var soc = (D.SOCS||[]).filter(function(x){ return x.code===T.soc; })[0];
      out.push({term:T, score:Math.round(best*100)/100, llt:via,
                socName: soc?soc.name:T.soc});
    }
  });
  out.sort(function(a,b){ return b.score-a.score; });
  return out.slice(0,8);
}
function termByPt(pt){
  return (D.TERMS||[]).filter(function(t){ return t.pt===pt; })[0]||null;
}

/* ================================================================== *
 * 8 · FOLLOW-UP GAPS                                                  *
 *                                                                    *
 * Ordered by what actually changes the assessment, not by field order. *
 * ================================================================== */
function gaps(c){
  var d0 = (c.drugs||[])[0]||{}, e0 = (c.events||[])[0]||{};
  var items = [
    {k:'outcome', label:'Patient outcome', have:has(e0.outcome) && e0.outcome!=='Unknown', weight:3,
     why:'A required field and the most commonly omitted one. It changes how the case is weighted.'},
    {k:'onset',   label:'Event onset date', have:has(e0.start), weight:3,
     why:'Without it there is no time to onset, and without that there is no causality assessment.'},
    {k:'start',   label:'Drug start date', have:has(d0.start), weight:3,
     why:'The other half of the temporal relationship.'},
    {k:'dechal',  label:'Dechallenge — what happened after stopping', have:has(d0.dechallenge) && d0.dechallenge!=='Unknown', weight:3,
     why:'Usually the strongest causality evidence obtainable in practice.'},
    {k:'dose',    label:'Dose and frequency', have:has(d0.dose) && has(d0.freq), weight:2,
     why:'Needed to judge whether the reaction is dose-related.'},
    {k:'conmeds', label:'Concomitant medication', have:(c.drugs||[]).some(function(x){ return x.category==='Concomitant'; }), weight:2,
     why:'Alternative causes cannot be excluded against a partial medicine list.'},
    {k:'history', label:'Relevant medical history', have:has(c.patient && c.patient.history), weight:2,
     why:'Drug–disease interactions and confounders both live here.'},
    {k:'labs',    label:'Laboratory values', have:has(c.patient && c.patient.labs) || has(e0.lab), weight:2,
     why:'Objective evidence. It is what moves a report from an anecdote towards evidence.'},
    {k:'age',     label:'Patient age', have:has(c.patient && c.patient.age), weight:1,
     why:'Needed to spot reactions concentrated in the very young or the elderly.'},
    {k:'batch',   label:'Batch or lot number', have:has(d0.batch), weight:1,
     why:'Critical for vaccines, biologicals and any suspected quality defect. Often unobtainable.'}
  ];
  var missing = items.filter(function(i){ return !i.have; });
  var got = items.filter(function(i){ return i.have; });
  var wTotal = items.reduce(function(a,b){ return a+b.weight; },0);
  var wGot = got.reduce(function(a,b){ return a+b.weight; },0);
  return {items:items, missing:missing, present:got,
    completeness: wTotal?Math.round(wGot*100/wTotal):0,
    required: missing.some(function(m){ return m.weight>=3; })};
}

/* ================================================================== *
 * 9 · NARRATIVE                                                       *
 *                                                                    *
 * Composed from the structured data by rules. Not a language model,    *
 * and the UI says so.                                                 *
 * ================================================================== */
function narrative(c){
  var p = c.patient||{}, r = c.reporter||{};
  var suspects = (c.drugs||[]).filter(function(d){ return d.category==='Suspect'; });
  var cons = (c.drugs||[]).filter(function(d){ return d.category==='Concomitant'; });
  var inter = (c.drugs||[]).filter(function(d){ return d.category==='Interacting'; });
  var e = (c.events||[])[0]||{};
  var d = suspects[0]||{};
  var out = [];

  var who = [];
  if(has(p.age)) who.push(p.age.replace(/\s*years?\s*$/i,'')+'-year-old');
  if(has(p.sex)) who.push(s(p.sex).toLowerCase());
  out.push('A '+(who.length?who.join(' '):'patient')+' patient'
    + (has(p.history) ? ', with a history of '+s(p.history).replace(/\.$/,'') : '')
    + (has(d.generic)
        ? ', received '+d.generic + (has(d.dose)?' '+d.dose:'')
          + (has(d.route)?' '+s(d.route).toLowerCase():'')
          + (has(d.freq)?', '+s(d.freq).toLowerCase():'')
          + (has(d.indication)?', for '+s(d.indication).toLowerCase():'')
        : '')
    + '.');

  if(has(d.start)){
    var lat = days(d.start, e.start);
    out.push('Treatment began on '+s(d.start)+'.'
      + (lat !== null
          ? ' ' + (lat===0 ? 'On the same day' : lat===1 ? 'One day later' : lat+' days later')
            + ', the patient developed '+s(e.reported).toLowerCase()+'.'
          : ''));
  }
  if(!has(d.start) && has(e.reported)){
    out.push('The patient developed '+s(e.reported).toLowerCase()+'.');
  }
  if(has(e.description)) out.push(s(e.description).replace(/\.?$/,'.'));
  if(has(e.clinical))    out.push('On examination: '+s(e.clinical).replace(/\.?$/,'.'));
  if(has(e.lab))         out.push('Relevant investigations: '+s(e.lab).replace(/\.?$/,'.'));

  if(has(d.action) || has(d.stop)){
    out.push('Action taken with the suspect drug: '+(has(d.action)?s(d.action).toLowerCase():'not stated')
      + (has(d.stop)?', stopped on '+s(d.stop):'')+'.');
  }
  if(has(d.dechallenge) && d.dechallenge!=='Not applicable'){
    out.push('Dechallenge was '+s(d.dechallenge).toLowerCase()+'.'
      + (has(d.rechallenge) && d.rechallenge!=='Not done'
          ? ' Rechallenge was '+s(d.rechallenge).toLowerCase()+'.'
          : ' Rechallenge was not performed.'));
  }
  if(has(e.treatment)) out.push('Treatment given for the event: '+s(e.treatment).replace(/\.?$/,'.'));
  if(has(e.hosp) && !/^no$/i.test(s(e.hosp))) out.push('Hospitalisation: '+s(e.hosp).replace(/\.?$/,'.'));

  if(cons.length) out.push('Concomitant medication: '
    + cons.map(function(x){ return x.generic + (has(x.dose)?' '+x.dose:''); }).join(', ') + '.');
  if(inter.length) out.push('Also taking, and considered as potentially interacting: '
    + inter.map(function(x){ return x.generic + (has(x.dose)?' '+x.dose:''); }).join(', ') + '.');
  if(!cons.length && !inter.length) out.push('No concomitant medication was reported.');

  if(has(e.outcome)) out.push('At the time of reporting the outcome was: '+s(e.outcome).toLowerCase()+'.');
  if(has(r.type)) out.push('The case was reported by a '+s(r.type).toLowerCase()
    + (has(r.source)?' ('+s(r.source).toLowerCase()+')':'')+'.');

  return {
    text: out.join(' '),
    sentences: out,
    source:'Composed from the structured case data by rule. No language model was used, and no clinical '
          +'judgement has been applied — it restates what was entered, in narrative order.',
    warning:'Generated draft. Human review is required before this is used for anything.'
  };
}

/* ================================================================== *
 * 10 · QC                                                             *
 *                                                                    *
 * Each check is auto-evaluated so the QC officer sees what the record  *
 * supports, then records their own verdict. The system proposes; the   *
 * human disposes.                                                     *
 * ================================================================== */
function qcChecks(c){
  var v = validity(c), g = gaps(c);
  var e0 = (c.events||[])[0]||{}, d0 = (c.drugs||[])[0]||{};
  var list = [
    {k:'patient',  label:'Patient information verified', auto: has(c.patient&&c.patient.age) && has(c.patient&&c.patient.sex)},
    {k:'drug',     label:'Drug information verified',    auto: has(d0.generic) && has(d0.dose) && has(d0.route)},
    {k:'dates',    label:'Dates verified and consistent',auto: has(d0.start) && has(e0.start) && (days(d0.start, e0.start)||0) >= 0},
    {k:'eventcode',label:'Event coding verified',        auto: !!(e0.coded && e0.coded.pt)},
    {k:'drugcode', label:'Drug coding verified',         auto: has(d0.generic)},
    {k:'serious',  label:'Seriousness verified',         auto: !!c.seriousness},
    {k:'expected', label:'Expectedness verified',        auto: !!c.expectedness},
    {k:'causal',   label:'Causality verified',           auto: !!c.causality},
    {k:'narrative',label:'Narrative verified',           auto: !!(c.narrative && c.narrative.accepted)},
    {k:'dupe',     label:'Duplicate check verified',     auto: !!(c.duplicate && c.duplicate.checked)},
    {k:'followup', label:'Follow-up status verified',    auto: !g.required || (c.followups||[]).length>0}
  ];
  return {list:list, autoPass: list.every(function(x){ return x.auto; }),
    validity:v, completeness:g.completeness};
}

/* ================================================================== *
 * 11 · ICSR                                                           *
 * ================================================================== */
function icsr(c){
  var d0 = (c.drugs||[]).filter(function(d){ return d.category==='Suspect'; })[0]||{};
  var e0 = (c.events||[])[0]||{};
  var v = validity(c);
  return {
    valid: v.valid, missing: v.missing,
    fields:[
      ['Case reference', c.caseNo],
      ['Report type', (c.followups||[]).length ? 'Follow-up' : 'Initial'],
      ['Report date', (c.reporter&&c.reporter.reportDate)||'—'],
      ['Reporter', ((c.reporter&&c.reporter.name)||'—')+' ('+((c.reporter&&c.reporter.type)||'—')+')'],
      ['Reporter country', (c.reporter&&c.reporter.country)||'—'],
      ['Patient', [(c.patient&&c.patient.pid), (c.patient&&c.patient.age), (c.patient&&c.patient.sex)].filter(has).join(', ')||'—'],
      ['Suspect product', [d0.generic, d0.strength||d0.dose, d0.form].filter(has).join(', ')||'—'],
      ['Dose regimen', [d0.dose, d0.route, d0.freq].filter(has).join(', ')||'—'],
      ['Indication', d0.indication||'—'],
      ['Treatment dates', [d0.start, d0.stop||'continuing'].filter(has).join(' to ')||'—'],
      ['Reaction (verbatim)', e0.reported||'—'],
      ['Reaction (coded)', (e0.coded&&e0.coded.pt)||'—'],
      ['System organ class', (e0.coded&&e0.coded.socName)||'—'],
      ['Onset date', e0.start||'—'],
      ['Seriousness', c.seriousness ? (c.seriousness.serious?'Serious — '+(c.seriousness.criteria||[]).map(function(x){return x.label;}).join('; '):'Non-serious') : '—'],
      ['Expectedness', c.expectedness ? c.expectedness.verdict : '—'],
      ['Outcome', e0.outcome||'—'],
      ['Action taken', d0.action||'—'],
      ['Dechallenge', d0.dechallenge||'—'],
      ['Rechallenge', d0.rechallenge||'—'],
      ['Causality', c.causality ? c.causality.name : '—']
    ],
    flow:['Draft','Validated','Ready for submission','Submitted — simulation','Acknowledged — simulation'],
    note:'This is a simulated submission. Nothing leaves this browser and no regulatory system is contacted.'
  };
}

/* ================================================================== *
 * 12 · SIGNALS AND ANALYTICS                                          *
 * ================================================================== */
function detectSignals(cases){
  var closed = (cases||[]).filter(function(c){ return c.status==='CLOSED' || c.status==='REPORTING_SIMULATION'; });
  var by = {};
  closed.forEach(function(c){
    var d = ((c.drugs||[]).filter(function(x){return x.category==='Suspect';})[0]||{}).generic;
    var e = (((c.events||[])[0]||{}).coded||{}).pt;
    if(!d || !e) return;
    var k = d+'||'+e;
    by[k] = by[k] || {drug:d, event:e, cases:[], serious:0, unexpected:0};
    by[k].cases.push(c);
    if(c.seriousness && c.seriousness.serious) by[k].serious++;
    if(c.expectedness && c.expectedness.verdict==='Unexpected') by[k].unexpected++;
  });
  return Object.keys(by).map(function(k){
    var g = by[k], n = g.cases.length;
    /* A candidate is not "the biggest number". Seriousness and being
       unlisted are what raise it, exactly as at the workshop's signal
       station. */
    var score = n + g.serious*3 + g.unexpected*4;
    return {drug:g.drug, event:g.event, count:n, serious:g.serious, unexpected:g.unexpected,
      score:score, cases:g.cases.map(function(c){ return c.caseNo; }),
      candidate: (g.unexpected>0 && g.serious>0) || n>=3,
      why: g.unexpected>0 && g.serious>0
        ? 'Serious and not listed in the reference safety information — the combination that matters.'
        : n>=3 ? 'Enough cases of the same drug and reaction to be worth a look.'
        : 'Below the threshold this simulation uses.'};
  }).sort(function(a,b){ return b.score-a.score; });
}

function analytics(cases){
  cases = cases||[];
  function tally(fn){
    var m = {};
    cases.forEach(function(c){ var k = fn(c); if(!k) return; m[k] = (m[k]||0)+1; });
    return Object.keys(m).map(function(k){ return {k:k, n:m[k]}; })
                  .sort(function(a,b){ return b.n-a.n; });
  }
  var ageBand = function(c){
    var n = parseInt(s(c.patient&&c.patient.age),10);
    if(isNaN(n)) return null;
    return n<18?'Under 18' : n<40?'18–39' : n<65?'40–64' : '65 and over';
  };
  return {
    total: cases.length,
    byDrug: tally(function(c){ return ((c.drugs||[]).filter(function(d){return d.category==='Suspect';})[0]||{}).generic; }),
    byEvent: tally(function(c){ return (((c.events||[])[0]||{}).coded||{}).pt || ((c.events||[])[0]||{}).reported; }),
    bySoc: tally(function(c){ return (((c.events||[])[0]||{}).coded||{}).socName; }),
    bySerious: tally(function(c){ return c.seriousness ? (c.seriousness.serious?'Serious':'Non-serious') : 'Not assessed'; }),
    byAge: tally(ageBand),
    bySex: tally(function(c){ return c.patient && c.patient.sex; }),
    byReporter: tally(function(c){ return c.reporter && c.reporter.type; }),
    bySource: tally(function(c){ return c.reporter && c.reporter.source; }),
    byOutcome: tally(function(c){ return ((c.events||[])[0]||{}).outcome; }),
    byStatus: tally(function(c){ return c.status; }),
    byCountry: tally(function(c){ return c.reporter && c.reporter.country; }),
    byMonth: tally(function(c){
      var d = new Date(c.created);
      return isNaN(d)?null:d.toLocaleDateString('en-GB',{month:'short', year:'numeric'});
    })
  };
}

/* ================================================================== *
 * 13 · SCORING against the training answer key                        *
 * ================================================================== */
function score(c){
  var tc = (D.TRAINING||[]).filter(function(t){ return t.id===c.trainingCaseId; })[0];
  if(!tc) return null;
  var x = tc.expected, rows = [], got = 0, max = 0;

  function row(label, pts, ok, note){
    max += pts; if(ok) got += pts;
    rows.push({label:label, pts:ok?pts:0, of:pts, ok:!!ok, note:note||''});
  }

  var v = validity(c);
  row('Case validity', 10, v.valid === x.valid,
      v.valid===x.valid ? 'Correctly established.' : 'The four minimum elements were not settled correctly.');

  var g = gaps(c);
  row('Data entry completeness', 15, g.completeness >= 70,
      'Record is '+g.completeness+'% complete by weight. '+(g.completeness>=70?'':'The fields that change the assessment are the ones to fill.'));

  var ser = c.seriousness;
  var serOk = ser && ser.serious === x.serious;
  var critOk = serOk && (!x.seriousCriteria.length ||
    x.seriousCriteria.every(function(k){ return (ser.criteria||[]).some(function(cc){ return cc.k===k; }); }));
  row('Seriousness', 10, serOk,
      !ser ? 'Not assessed.' : serOk ? (critOk?'Correct, including the criterion.':'Correct verdict; the criterion chosen was not the expected one ('+x.seriousCriteria.join(', ')+').')
           : 'Expected '+(x.serious?'SERIOUS':'NON-SERIOUS')+'.');

  var pt = (((c.events||[])[0]||{}).coded||{}).pt;
  row('Reaction coding', 15, pt === x.pt,
      !pt ? 'Not coded.' : pt===x.pt ? 'Coded correctly.' : 'Coded to "'+pt+'"; the expected term was "'+x.pt+'".');

  var exp = c.expectedness;
  row('Expectedness', 10, exp && exp.verdict === x.expectedness,
      !exp ? 'Not assessed.' : exp.verdict===x.expectedness ? 'Correct.' : 'Expected "'+x.expectedness+'".');

  var cau = c.causality;
  row('Causality', 15, cau && cau.verdict === x.causality,
      !cau ? 'Not assessed.' : cau.verdict===x.causality ? 'Correct.' :
      'Assessed as '+cau.name+'; the expected category was '+((LE.WHO_UMC||{})[x.causality]||{}).name+'.');

  row('Narrative', 10, !!(c.narrative && c.narrative.accepted),
      c.narrative && c.narrative.accepted ? 'Drafted and accepted.' : 'No accepted narrative.');

  row('Duplicate check', 5, !!(c.duplicate && c.duplicate.checked),
      c.duplicate && c.duplicate.checked ? 'Performed.' : 'Not performed.');

  row('Follow-up handling', 5, x.followupNeeded ? (c.followups||[]).length>0 : true,
      x.followupNeeded ? ((c.followups||[]).length?'Follow-up raised, correctly.':'This case needed follow-up and none was raised.')
                       : 'No follow-up was required.');

  row('Workflow completion', 5, c.status==='CLOSED' || c.status==='REPORTING_SIMULATION',
      c.status==='CLOSED' ? 'Case taken to closure.' : 'Case not taken through to closure.');

  var pct = max ? Math.round(got*100/max) : 0;
  return {rows:rows, got:got, max:max, pct:pct,
    band: pct>=85?'Excellent' : pct>=70?'Good' : pct>=55?'Satisfactory' : pct>=40?'Weak':'Needs more practice',
    improve: rows.filter(function(r){ return !r.ok; }),
    teaching: x.teaching};
}

/* ================================================================== *
 * 14 · THE ASSISTANT                                                  *
 *                                                                    *
 * Answers from the case record and the reference data. Every answer    *
 * carries what it is based on and says a human decides, because an     *
 * assistant in a safety system that sounds certain is a hazard.        *
 * ================================================================== */
var INTENTS = [
 {k:'explain',   label:'Explain this case'},
 {k:'serious',   label:'Why is this case serious?'},
 {k:'missing',   label:'What information is missing?'},
 {k:'dechal',    label:'Explain dechallenge'},
 {k:'rechal',    label:'Explain rechallenge'},
 {k:'term',      label:'Suggest terminology'},
 {k:'narrative', label:'Draft the narrative'},
 {k:'dupe',      label:'Find a possible duplicate'},
 {k:'causality', label:'Explain causality'}
];

function assist(c, intent, all){
  var e0 = (c.events||[])[0]||{}, d0 = (c.drugs||[]).filter(function(d){return d.category==='Suspect';})[0]||{};
  function A(suggestion, reason, source){
    return {suggestion:suggestion, reason:reason, source:source,
            review:'Human review required. This is a training aid and does not make clinical or regulatory decisions.'};
  }
  switch(intent){
    case 'explain':
      return A(
        (has(d0.generic)?d0.generic:'The suspect drug')+' was given'
          + (has(d0.indication)?' for '+s(d0.indication).toLowerCase():'')
          + ', and '+(has(e0.reported)?s(e0.reported).toLowerCase():'an event')+' was reported'
          + (has(d0.start)&&has(e0.start) ? ' '+days(d0.start,e0.start)+' days after treatment started' : '')+'.',
        'Read from the drug and event records you entered.',
        'Case '+c.caseNo);
    case 'serious':
      if(!c.seriousness) return A('Seriousness has not been assessed yet.',
        'No seriousness record on this case.', 'Case '+c.caseNo);
      return A(c.seriousness.verdict,
        c.seriousness.serious
          ? 'One or more of the six outcome criteria was selected. Seriousness is decided on outcome, not on how unpleasant the reaction was.'
          : 'None of the six criteria was selected. Note that "other medically important condition" is the one most often missed.',
        'ICH E2A seriousness criteria');
    case 'missing':
      var g = gaps(c);
      return A(g.missing.length ? g.missing.map(function(m){ return m.label; }).join('; ') : 'Nothing significant is missing.',
        g.missing.length ? 'These are ordered by how much they change the assessment, not by form order.'
                         : 'Every weighted field carries a value.',
        'Follow-up gap analysis — '+g.completeness+'% complete by weight');
    case 'dechal':
      return A('Dechallenge is what happened to the reaction when the drug was stopped or reduced.',
        'A positive dechallenge (the reaction improved) is usually the strongest causality evidence obtainable in practice. '
        + 'Negative means it did not improve; note that some reactions, such as severe liver injury or nerve damage, take weeks or never resolve, '
        + 'so a negative dechallenge does not always exonerate the drug.', 'WHO-UMC causality criteria');
    case 'rechal':
      return A('Rechallenge is whether the drug was given again, and whether the reaction came back.',
        'A positive rechallenge is the strongest evidence there is, and it is usually unethical to do deliberately. '
        + '"Not done" is a complete and normal answer, and it is the main reason most real cases cannot reach "Certain".',
        'WHO-UMC causality criteria');
    case 'term':
      var hits = searchTerms(e0.reported||'');
      return A(hits.length ? hits.slice(0,4).map(function(h){ return h.term.pt; }).join(', ') : 'No suggestion — record the reported event first.',
        hits.length ? 'Ranked by how closely the reported wording matches the dictionary. The top suggestion is usually right, but read the alternatives — the term you choose decides what the database can find.' : 'Nothing to match against.',
        'Synthetic training terminology (MedDRA-shaped, not MedDRA)');
    case 'narrative':
      var n = narrative(c);
      return A(n.text, n.source, 'Structured case data');
    case 'dupe':
      var dd = duplicates(c, all||[]);
      return A(dd.length ? dd[0].case.caseNo+' — '+dd[0].score+'% similar ('+dd[0].matched.join(', ')+')' : 'No likely duplicate found.',
        dd.length ? dd[0].verdict+'. Read both cases before deciding; the decision is yours, not the system’s.' : 'No case scored above the threshold.',
        'Weighted field comparison across '+((all||[]).length)+' cases');
    case 'causality':
      if(!c.causality) return A('Causality has not been assessed yet.','No causality record on this case.','Case '+c.caseNo);
      return A(c.causality.name, c.causality.why.join(' '), 'WHO-UMC categories');
  }
  return A('I do not have an answer for that.','Unrecognised request.','—');
}

window.PVSoftEngine = {
  validity:validity, TRIAGE_Q:TRIAGE_Q, triage:triage, duplicates:duplicates,
  criteria:criteria, seriousness:seriousness, expectedness:expectedness,
  CAUS_Q:CAUS_Q, causality:causality,
  searchTerms:searchTerms, termByPt:termByPt,
  gaps:gaps, narrative:narrative, qcChecks:qcChecks, icsr:icsr,
  detectSignals:detectSignals, analytics:analytics, score:score,
  INTENTS:INTENTS, assist:assist, days:days
};
})();
