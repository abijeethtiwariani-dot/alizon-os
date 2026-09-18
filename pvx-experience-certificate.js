/* =====================================================================
   pvx-experience-certificate.js — the hands-on training record issued at
   the end of PV Foundations.

   WHY THIS IS NOT alizon-experience.js. That module already issues the
   institution's experience letters, but it is built for enrolled
   students: it is keyed by register number, it reads verifiedPracticals
   from the roster, and it takes its signatory from institution settings.
   PV Foundations is open to the public, and the public pages deliberately
   do not load firebase-sync — pulling the student roster onto a stranger's
   device to print them a certificate would be an unreasonable trade. So
   this issues from the participant's own attempt and nothing else.

   WHAT IT IS CAREFUL ABOUT, and please keep this if you edit it.

   An "experience certificate" is normally understood to mean workplace
   experience. This one certifies four hours at a simulator. If a holder
   showed it to an employer and that employer read it as supervised
   clinical practice, the document would have misled them — so it says
   what it is, on its face, in the body text and again in the footer:
   simulation-based training, fictional patients, not employment and not
   supervised clinical practice. That wording is not boilerplate to be
   trimmed for looks.

   It also reports what the participant ACTUALLY did rather than a fixed
   blurb: the stations they worked, the time they spent, the mode they
   chose. A certificate that says the same thing whatever the holder did
   is worth nothing to the person reading it.

   Public API:
     PVXExperience.eligible(mark, st)   -> {ok, why, stations, of}
     PVXExperience.build(opts)          -> {html, rec}
     PVXExperience.issue(opts)          -> Promise<rec|null>
     PVXExperience.open(html)           -> print / save-as-PDF window
   ===================================================================== */
(function(){
'use strict';
if (window.PVXExperience) return;

function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function longDate(ms){
  try{ return new Date(ms||Date.now()).toLocaleDateString('en-GB',
    {day:'numeric', month:'long', year:'numeric'}); }catch(e){ return ''; }
}

/* ------------------------------------------------------------------ *
 * 1 · who has actually earned one                                     *
 *                                                                     *
 * Deliberately NOT the pass mark. This certifies that training was     *
 * undertaken, not that it was passed — those are different claims and  *
 * the completion certificate already makes the second one. What it     *
 * does require is that the work was genuinely done, because a document *
 * anyone can mint by opening a page and clicking once is worthless to  *
 * the person being shown it.                                          *
 * ------------------------------------------------------------------ */
var MIN_STATIONS = 9;     /* of the 12 tracked stations, at least half-done */
var MIN_MINUTES  = 15;

function eligible(mark, st){
  var pr = (mark && mark.progress) || {};
  var keys = Object.keys(pr);
  var done = keys.filter(function(k){ return pr[k] && pr[k].pct >= 50; });
  var mins = (mark && mark.minutes) || 0;

  if(done.length < MIN_STATIONS){
    return {ok:false, stations:done.length, of:keys.length,
      why:'A training record is issued once you have worked at least '+MIN_STATIONS+' of the '
         +keys.length+' stations. You are at '+done.length+'. Carry on — nothing you have already '
         +'done is lost.'};
  }
  if(mins < MIN_MINUTES){
    return {ok:false, stations:done.length, of:keys.length,
      why:'The stations are marked done, but only '+mins+' minute'+(mins===1?' has':'s have')+' passed. '
         +'A training record that can be produced in under '+MIN_MINUTES+' minutes is not worth '
         +'showing anyone, so this one waits until the time matches the work.'};
  }
  return {ok:true, stations:done.length, of:keys.length};
}

/* ------------------------------------------------------------------ *
 * 2 · what the holder actually practised                              *
 *                                                                     *
 * Built from the attempt, not from a fixed list, so the document       *
 * describes this participant and not the brochure.                     *
 * ------------------------------------------------------------------ */
var COMPETENCY = {
  basics:  'Purpose and scope of pharmacovigilance; what is reportable and by whom',
  read:    'Extracting patient, drug, indication, timing, event, action and outcome from a narrative',
  drug:    'Using a drug reference before assessing a suspected reaction to that drug',
  inter:   'Drug–drug interaction checking, and drug–disease and patient-factor screening',
  adr:     'Distinguishing an adverse drug reaction from a coincident event; excluding alternative causes',
  serious: 'Applying the seriousness criteria, and separating seriousness from severity',
  causal:  'Structured causality assessment, WHO-UMC categories and the Naranjo scale',
  code:    'Translating a reported term into a standardised reaction term',
  icsr:    'Constructing an Individual Case Safety Report and checking it against the minimum elements',
  follow:  'Follow-up prioritisation, reporting timelines and report quality review',
  signal:  'Interpreting accumulated case data and the concept of a safety signal',
  final:   'Working an incomplete case end to end: gap analysis, multi-source investigation, decision'
};

function practised(mark){
  var pr = (mark && mark.progress) || {};
  var out = [];
  Object.keys(COMPETENCY).forEach(function(k){
    if(pr[k] && pr[k].pct >= 50) out.push(COMPETENCY[k]);
  });
  return out;
}

/* ------------------------------------------------------------------ *
 * 3 · the document                                                    *
 * ------------------------------------------------------------------ */
var PARTNERS = [
  'Mar Dioscorus College of Pharmacy, Malankara Orthodox Church, Sreekariyam, Thiruvananthapuram, Kerala',
  'International Organisation for Preventive Health & Medical Research Centre'
];

function build(o){
  o = o||{};
  var mark = o.mark||{}, me = o.participant||{};
  var t = {};
  try{ if(window.AlizonCertificate) t = AlizonCertificate.template()||{}; }catch(e){}

  var rec = {
    code: o.code||'',
    name: String(me.name||'').trim(),
    reg:  String(me.roll||'').trim(),
    institution: String(me.institution||'').trim(),
    course: 'PV Foundations — Pharmacovigilance Practical Training',
    programme: 'PVF-TR',
    mode: mark.mode||'',
    minutes: mark.minutes||0,
    score: (mark.total==null?null:mark.total),
    band: mark.band||'',
    stations: (o.stations||0),
    of: (o.of||12),
    issued: Date.now()
  };

  var comp = practised(mark);
  var accent = t.accent || '#8c1515';
  var place  = t.place  || 'Thiruvananthapuram, Kerala';
  var verify = t.verifyUrl || 'https://www.alizon.in/alizon-verify';
  var logos  = Array.isArray(t.logos) ? t.logos : [];

  var html =
'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
+'<meta name="viewport" content="width=device-width, initial-scale=1">'
+'<title>Practical Training Record — '+esc(rec.name)+'</title>'
+'<link rel="preconnect" href="https://fonts.googleapis.com">'
+'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet">'
+'<style>'
+'@page{size:A4 portrait;margin:14mm}'
+'*{margin:0;padding:0;box-sizing:border-box}'
+'body{font-family:Inter,-apple-system,sans-serif;color:#1c1a1f;background:#eceae6;line-height:1.55;padding:22px}'
+'.sheet{max-width:820px;margin:0 auto;background:#fff;border:1px solid rgba(0,0,0,.14);'
+'border-top:7px solid '+esc(accent)+';padding:40px 46px 34px;box-shadow:0 18px 50px -34px rgba(0,0,0,.5)}'
+'h1,h2,.nm{font-family:"Source Serif Pro",Georgia,serif}'
+'.eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.17em;text-transform:uppercase;color:'+esc(accent)+'}'
+'h1{font-size:27px;font-weight:700;margin:7px 0 3px;line-height:1.14}'
+'.sub{font-size:12.5px;color:#6b6570;font-weight:600}'
+'.rule{height:1px;background:rgba(0,0,0,.13);margin:19px 0}'
+'.lead{font-size:13.5px;color:#4a4550}'
+'.nm{font-size:29px;font-weight:700;margin:9px 0 3px;color:'+esc(accent)+'}'
+'.meta{font-size:12.5px;color:#6b6570}'
+'.body{font-size:13.5px;line-height:1.75;margin-top:15px}'
+'.tbl{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}'
+'.tbl td{padding:7px 9px;border-top:1px solid rgba(0,0,0,.1);vertical-align:top}'
+'.tbl td.k{color:#6b6570;width:34%;font-weight:600}'
+'.comp{margin:15px 0 0}'
+'.comp .ch{font-size:10.5px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:'+esc(accent)+';margin-bottom:6px}'
+'.comp ul{margin-left:17px;font-size:12.2px;line-height:1.66}'
+'.comp li{margin-bottom:3px}'
+'.honest{margin-top:17px;border:1px solid rgba(140,21,21,.3);background:rgba(140,21,21,.05);'
+'border-radius:8px;padding:11px 14px;font-size:11.8px;line-height:1.62;color:#4a4550}'
+'.honest b{color:'+esc(accent)+'}'
+'.foot{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-top:26px;flex-wrap:wrap}'
+'.code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:700;letter-spacing:.06em}'
+'.sig{text-align:right;font-size:11.5px;color:#6b6570;min-width:210px}'
+'.sig .ln{border-top:1px solid rgba(0,0,0,.4);margin-bottom:5px;padding-top:5px}'
+'.note{font-size:10.6px;color:#8a8590;line-height:1.55;margin-top:15px;border-top:1px solid rgba(0,0,0,.1);padding-top:11px}'
+'.lg{display:flex;gap:13px;align-items:center;flex-wrap:wrap;margin-bottom:13px}'
+'.lg img{height:38px;width:auto;object-fit:contain}'
+'.prt{text-align:center;margin:20px auto 0;max-width:820px}'
+'.prt button{font:inherit;font-size:13.5px;font-weight:700;color:#fff;background:'+esc(accent)+';'
+'border:none;border-radius:100px;padding:11px 24px;cursor:pointer}'
+'@media print{body{background:#fff;padding:0}.sheet{border:none;box-shadow:none;max-width:none;padding:0}.prt{display:none}}'
+'</style></head><body>'

+'<div class="sheet">'
+  (logos.length ? '<div class="lg">'+logos.map(function(src){
       return '<img src="'+esc(src)+'" alt="" onerror="this.style.display=\'none\'">'; }).join('')+'</div>' : '')
+  '<div class="eyebrow">Alizon School of Medical &amp; Digital Intelligence</div>'
+  '<h1>Certificate of Practical Training Experience</h1>'
+  '<div class="sub">Simulation-based hands-on training in pharmacovigilance</div>'
+  '<div class="rule"></div>'

+  '<div class="lead">This is to certify that</div>'
+  '<div class="nm">'+esc(rec.name||'—')+'</div>'
+  '<div class="meta">'
+    (rec.reg ? 'Register number '+esc(rec.reg) : '')
+    (rec.reg && rec.institution ? ' &nbsp;·&nbsp; ' : '')
+    (rec.institution ? esc(rec.institution) : '')
+  '</div>'

+  '<div class="body">has undergone hands-on practical training in pharmacovigilance through '
+  '<b>PV Foundations</b>, an interactive case simulation in which the participant investigates suspected '
+  'adverse drug reactions and carries a case from first report through to a completed Individual Case '
+  'Safety Report. The training was delivered by the Alizon School of Medical &amp; Digital Intelligence in '
+  'collaboration with '+PARTNERS.map(esc).join(' and ')+'.</div>'

+  '<table class="tbl">'
+    '<tr><td class="k">Training undertaken</td><td>'+esc(rec.course)+'</td></tr>'
+    '<tr><td class="k">Stations worked</td><td>'+rec.stations+' of '+rec.of+'</td></tr>'
+    '<tr><td class="k">Time at the simulator</td><td>'+rec.minutes+' minute'+(rec.minutes===1?'':'s')+' of recorded activity</td></tr>'
+    '<tr><td class="k">Level taken</td><td>'+esc(rec.mode||'—')+'</td></tr>'
+    (rec.score!=null
      ? '<tr><td class="k">Assessed performance</td><td>'+rec.score+' / 100'
        +(rec.band?' &nbsp;·&nbsp; '+esc(rec.band):'')+'</td></tr>' : '')
+    '<tr><td class="k">Date of training</td><td>'+esc(longDate(rec.issued))+'</td></tr>'
+  '</table>'

+  (comp.length
    ? '<div class="comp"><div class="ch">Competencies practised</div><ul>'
      + comp.map(function(c){ return '<li>'+esc(c)+'</li>'; }).join('')
      + '</ul></div>' : '')

+  '<div class="honest"><b>What this document is.</b> This records <b>simulation-based training</b>. '
+  'Every patient, medicine, identifier and laboratory value used in the workshop is fictional. '
+  'It is <b>not</b> a record of employment, of internship, or of supervised clinical practice, and it does '
+  'not by itself confer competence to perform pharmacovigilance duties unsupervised.</div>'

+  '<div class="foot">'
+    '<div><div class="meta" style="font-size:10.5px;letter-spacing:.1em;text-transform:uppercase">'
+      'Reference</div><div class="code">'+esc(rec.code||'—')+'</div></div>'
+    '<div class="sig"><div class="ln">Alizon School of Medical &amp; Digital Intelligence</div>'
+      esc(place)+'<br>'+esc(longDate(rec.issued))+'</div>'
+  '</div>'

+  '<div class="note">Issued electronically. '
+  (rec.code ? 'Its validity can be confirmed at '+esc(verify)+' using the reference above. ' : '')
+  'The stations, timings and performance shown are taken from the participant’s own recorded attempt.</div>'
+'</div>'

+'<div class="prt"><button onclick="window.print()">Print / save as PDF</button></div>'
+'</body></html>';

  return {html:html, rec:rec};
}

/* ------------------------------------------------------------------ *
 * 4 · issuing                                                         *
 *                                                                     *
 * The verifiable code comes from AlizonCertificate so that a training  *
 * record can be checked at the same address as everything else the     *
 * site issues. If that module is unavailable or offline the document   *
 * is still produced — the holder should not lose their record because  *
 * a network call failed — it simply carries no reference.             *
 * ------------------------------------------------------------------ */
function issue(o){
  o = o||{};
  var me = o.participant||{}, mark = o.mark||{};
  if(!me.name) return Promise.resolve(null);

  if(!window.AlizonCertificate || !AlizonCertificate.issue){
    return Promise.resolve(build(o).rec ? build(o) : null);
  }
  return AlizonCertificate.issue({
    name:me.name, reg:me.roll, institution:me.institution,
    course:'PV Foundations — Pharmacovigilance Practical Training',
    programme:'PVFTR', score:(mark.total==null?null:mark.total), band:mark.band,
    hours:4
  }).then(function(cr){
    var built = build(Object.assign({}, o, {code: cr && cr.code}));
    built.cloud = !!(cr && cr.cloud);
    built.rec.code = (cr && cr.code) || '';
    return built;
  }).catch(function(){
    return build(o);
  });
}

function open_(html){
  var w;
  try{ w = window.open('', '_blank'); }catch(e){ w = null; }
  if(!w){
    /* Popup blocked. Offer the document as a download rather than losing it. */
    try{
      var blob = new Blob([html], {type:'text/html'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pv-foundations-training-record.html';
      document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 4000);
      return 'downloaded';
    }catch(e){ return 'blocked'; }
  }
  w.document.open(); w.document.write(html); w.document.close();
  return 'opened';
}

window.PVXExperience = {
  eligible:eligible, build:build, issue:issue, open:open_,
  practised:practised, COMPETENCY:COMPETENCY,
  MIN_STATIONS:MIN_STATIONS, MIN_MINUTES:MIN_MINUTES
};
})();
