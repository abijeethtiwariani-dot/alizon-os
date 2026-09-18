/* =====================================================================
   pvsoft-ui.js — the PV Lab application.

   The rule this file is written to, and the one the specification put
   hardest: NO CONTROL IS DECORATIVE. Every button either changes stored
   state, moves the case through the state machine, or explains in words
   why it will not. A button that does nothing is worse than a missing
   one, because the student believes they have done something.

   Layering. This file draws and wires; PVSoftDB owns state and
   permissions; PVSoftEngine owns every decision. When a control is
   refused it is refused by the DB layer and this file shows the reason
   the DB gave, rather than second-guessing it.
   ===================================================================== */
(function(){
'use strict';

var D  = window.PVSoftData, DB = window.PVSoftDB, E = window.PVSoftEngine;
var LD = window.PVXLearnData || {};
if(!D || !DB || !E){
  document.getElementById('view').innerHTML =
    '<div class="note bad"><span class="t">PV Lab failed to load</span>'
    +'One of the application scripts did not load. Refresh the page.</div>';
  return;
}
DB.boot();

/* ---------- helpers ---------- */
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function el(t,c,h){ var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; }
function on(node, sel, ev, fn){
  node.addEventListener(ev, function(e){
    var t = e.target.closest ? e.target.closest(sel) : null;
    if(t && node.contains(t)){ fn(e,t); }
  });
}
function fmt(ms){
  try{ return new Date(ms).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
  catch(e){ return ''; }
}
function fmtD(ms){
  try{ return new Date(ms).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
  catch(e){ return ''; }
}
function initials(n){ return String(n||'?').split(/\s+/).map(function(w){return w[0];}).join('').slice(0,2).toUpperCase(); }
function toast(msg, kind){
  var t = el('div','note '+(kind||'ok'));
  t.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:90;'
    +'box-shadow:0 12px 34px -12px rgba(15,23,42,.4);max-width:560px';
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.transition='opacity .3s'; t.style.opacity='0';
    setTimeout(function(){ t.remove(); }, 320); }, 3200);
}
function stateBadge(id){
  var s = DB.stateById(id)||{name:id, colour:'#64748B'};
  var map = {DRAFT:'b-grey',SUBMITTED:'b-teal',TRIAGE:'b-teal',VALIDATED:'b-teal',DATA_ENTRY:'b-teal',
    ASSESSMENT:'b-green',FOLLOW_UP:'b-amber',MEDICAL_REVIEW:'b-purple',QC:'b-amber',
    REPORTING_SIMULATION:'b-teal',CLOSED:'b-navy'};
  return '<span class="badge '+(map[id]||'b-grey')+'"><span class="pip"></span>'+esc(s.name)+'</span>';
}
function prioBadge(p){
  if(!p) return '<span class="badge b-grey">Not triaged</span>';
  var m = {LOW:'b-grey',MEDIUM:'b-teal',HIGH:'b-amber',URGENT:'b-red'};
  return '<span class="badge '+(m[p]||'b-grey')+'">'+esc(p)+'</span>';
}

/* ---------- modal ---------- */
var modalDone = null;
function modal(title, bodyHtml, buttons, onMount){
  $('modalT').innerHTML = title;
  $('modalB').innerHTML = bodyHtml;
  var f = $('modalF'); f.innerHTML='';
  (buttons||[]).forEach(function(b,i){
    var btn = el('button','btn '+(b.cls||'sec'), b.label);
    btn.addEventListener('click', function(){
      if(b.act){ var r = b.act(); if(r===false) return; }
      closeModal();
    });
    f.appendChild(btn);
  });
  $('modal').classList.add('on');
  if(onMount) onMount($('modalB'));
}
function closeModal(){ $('modal').classList.remove('on'); }
$('modalX').addEventListener('click', closeModal);
$('modalSc').addEventListener('click', closeModal);
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

/* ================================================================== *
 * NAVIGATION                                                          *
 * ================================================================== */
var NAV = [
 {grp:'Overview'},
 {k:'dashboard', ic:'▦', label:'Dashboard'},
 {k:'intake',    ic:'✉', label:'Safety Intake'},
 {grp:'Cases'},
 {k:'cases',     ic:'▤', label:'All Cases', count:function(){ return DB.cases().length; }},
 {k:'cases:DRAFT',      ic:'○', label:'Draft', sub:true, count:function(){ return byStatus('DRAFT').length; }},
 {k:'cases:review',     ic:'○', label:'Under Review', sub:true, count:function(){ return underReview().length; }},
 {k:'cases:FOLLOW_UP',  ic:'○', label:'Follow-up', sub:true, count:function(){ return byStatus('FOLLOW_UP').length; }},
 {k:'cases:QC',         ic:'○', label:'QC Pending', sub:true, count:function(){ return byStatus('QC').length; }},
 {k:'cases:CLOSED',     ic:'○', label:'Closed', sub:true, count:function(){ return byStatus('CLOSED').length; }},
 {grp:'Work'},
 {k:'assessment',ic:'⚖', label:'Assessment'},
 {k:'coding',    ic:'≡', label:'Coding'},
 {k:'followup',  ic:'↻', label:'Follow-up'},
 {k:'medical',   ic:'⚕', label:'Medical Review', count:function(){ return byStatus('MEDICAL_REVIEW').length; }},
 {k:'qc',        ic:'✓', label:'Quality Control', count:function(){ return byStatus('QC').length; }},
 {k:'narrative', ic:'✎', label:'Narrative'},
 {k:'regulatory',ic:'⚑', label:'Regulatory Reporting'},
 {grp:'Safety science'},
 {k:'signals',   ic:'⚠', label:'Signal Management', count:function(){ return DB.signals().length; }},
 {k:'literature',ic:'▧', label:'Literature Monitoring'},
 {k:'analytics', ic:'◩', label:'Analytics'},
 {k:'audit',     ic:'☷', label:'Audit Trail'},
 {grp:'Learning'},
 {k:'training',  ic:'✦', label:'Training Centre'},
 {k:'settings',  ic:'⚙', label:'Settings'}
];

function byStatus(s){ return DB.cases().filter(function(c){ return c.status===s; }); }
function underReview(){
  return DB.cases().filter(function(c){
    return ['TRIAGE','VALIDATED','DATA_ENTRY','ASSESSMENT','MEDICAL_REVIEW'].indexOf(c.status)>=0; });
}

function drawNav(){
  var h = '';
  NAV.forEach(function(n){
    if(n.grp){ h += '<div class="grp">'+esc(n.grp)+'</div>'; return; }
    var cnt = n.count ? n.count() : null;
    h += '<a class="nv'+(n.sub?' sub':'')+(route.split('/')[0]===n.k?' on':'')+'" href="#'+n.k+'">'
      +  '<span class="ic">'+n.ic+'</span>'+esc(n.label)
      +  (cnt ? '<span class="ct">'+cnt+'</span>' : '')+'</a>';
  });
  $('nav').innerHTML = h;
}

/* ================================================================== *
 * SESSION HEADER                                                      *
 * ================================================================== */
function drawWho(){
  var u = DB.session();
  var w = $('who');
  if(!u){ w.innerHTML = '<span style="font-size:12.5px;font-weight:600">Not signed in</span>'; return; }
  var r = DB.roleOf(u);
  w.innerHTML = '<span class="av" style="background:'+r.colour+'">'+initials(u.name)+'</span>'
    + '<span><span class="nm">'+esc(u.name)+'</span><br><span class="rl">'+esc(r.name)+'</span></span>';
}
$('who').addEventListener('click', function(){ go('settings'); });

function drawBell(){
  var u = DB.session();
  var n = u ? DB.notifications(u).filter(function(x){ return !x.read; }).length : 0;
  var b = $('bellN');
  b.style.display = n ? 'grid' : 'none';
  b.textContent = n;
}
$('bell').addEventListener('click', function(){
  var list = DB.notifications();
  modal('Notifications',
    list.length
      ? '<div class="stack">' + list.slice(0,25).map(function(n){
          return '<div class="note '+(n.read?'info':'warn')+'" style="margin:0">'
            + '<span class="t">'+esc(n.type)+' · '+fmt(n.at)+'</span>'+esc(n.text)+'</div>';
        }).join('') + '</div>'
      : '<div class="empty"><div class="ic">✉</div><h3>Nothing waiting</h3>'
        +'<p>Notifications arrive when a case reaches a stage your role is responsible for.</p></div>',
    [{label:'Mark all read', cls:'sec', act:function(){ DB.markAllRead(); drawBell(); }},
     {label:'Close', cls:'btn'}]);
});

/* ================================================================== *
 * ROUTER                                                              *
 * ================================================================== */
var route = 'dashboard';
var VIEWS = {};

function go(r){ location.hash = '#'+r; }
function render(){
  route = (location.hash||'#dashboard').replace(/^#/,'') || 'dashboard';
  var parts = route.split('/');
  var fn = VIEWS[parts[0]] || VIEWS.dashboard;
  drawNav(); drawWho(); drawBell();
  var v = $('view');
  v.innerHTML = '';
  try{
    fn(v, parts.slice(1));
  }catch(err){
    v.innerHTML = '<div class="note bad"><span class="t">This screen failed to draw</span>'
      + esc(err && err.message || String(err)) + '</div>';
  }
  window.scrollTo({top:0});
  $('side').classList.remove('open'); $('scrim').classList.remove('on');
}
window.addEventListener('hashchange', render);
$('burger').addEventListener('click', function(){
  $('side').classList.toggle('open'); $('scrim').classList.toggle('on');
});
$('scrim').addEventListener('click', function(){
  $('side').classList.remove('open'); $('scrim').classList.remove('on');
});

function title(t, crumb){ $('ttl').textContent = t; $('crumb').textContent = crumb||''; }

/* ================================================================== *
 * DASHBOARD                                                           *
 * ================================================================== */
VIEWS.dashboard = function(v){
  title('Dashboard', 'Overview of the safety database');
  var all = DB.cases();
  var serious = all.filter(function(c){ return c.seriousness && c.seriousness.serious; });
  var fu = all.filter(function(c){
    var g = E.gaps(c); return g.required && c.status!=='CLOSED'; });
  var sigs = DB.signals();

  var stats = [
    ['Total cases', all.length, 'acc-navy', 'in the training database'],
    ['New / draft', byStatus('DRAFT').length + byStatus('SUBMITTED').length, 'acc-teal', 'not yet triaged'],
    ['Under review', underReview().length, 'acc-teal', 'being worked'],
    ['Serious cases', serious.length, 'acc-red', 'meeting a seriousness criterion'],
    ['Follow-up required', fu.length, 'acc-amber', 'missing information that matters'],
    ['QC pending', byStatus('QC').length, 'acc-amber', 'awaiting quality control'],
    ['Closed', byStatus('CLOSED').length, 'acc-green', 'finished'],
    ['Open signals', sigs.filter(function(s){ return s.status!=='CLOSED'; }).length, 'acc-purple', 'under assessment or monitoring']
  ];

  var h = '<div class="stack">';

  if(!DB.session()){
    h += '<div class="note warn"><span class="t">You are not signed in</span>'
      + 'PV Lab is role-based: what you can do depends on who you are. Choose a role in '
      + '<a href="#settings">Settings</a> to begin. Nothing is hidden from you — refused actions explain '
      + 'which role is responsible instead.</div>';
  }

  h += '<div class="grid g4">'
    + stats.map(function(s){
        return '<div class="stat '+s[2]+'"><div class="lb">'+esc(s[0])+'</div>'
          + '<div class="vl">'+s[1]+'</div><div class="sub">'+esc(s[3])+'</div></div>';
      }).join('')
    + '</div>';

  /* guided case — the spec's headline demo control */
  h += '<div class="card"><div class="bd" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">'
    + '<div style="flex:1;min-width:260px">'
    + '<h2 style="font-size:16px;font-weight:700;margin-bottom:5px">Start a guided case</h2>'
    + '<p style="font-size:13px;color:var(--muted);line-height:1.6">You are the pharmacovigilance officer. '
    + 'Take one safety report from the moment it arrives through to closure, with the system explaining at every '
    + 'stage what you are doing, why it matters and what to look for. About 20 minutes.</p></div>'
    + '<button class="btn lg" data-act="guided">Start guided case</button></div></div>';

  /* the workflow pipeline, generated from the state machine */
  h += '<div class="card"><div class="hd"><h2>Case workflow</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Cases at each stage. A case moves only along these arrows.</span></div>'
    + '<div class="bd"><div class="pipe">'
    + D.STATES.map(function(s){
        var n = byStatus(s.id).length;
        return '<div class="st'+(n?' hot':'')+'"><div class="bx"><div class="n">'+n+'</div>'
          + '<div class="l">'+esc(s.name)+'</div></div><span class="ar">›</span></div>';
      }).join('')
    + '</div></div></div>';

  /* recent cases */
  var recent = all.slice().sort(function(a,b){ return b.updated-a.updated; }).slice(0,8);
  h += '<div class="card"><div class="hd"><h2>Recently updated</h2>'
    + '<span class="sp"></span><a class="btn sec sm" href="#cases">All cases</a>'
    + '<button class="btn sm" data-act="new">+ New safety case</button></div>';
  h += recent.length ? caseTable(recent)
    : '<div class="empty"><div class="ic">▤</div><h3>No cases yet</h3>'
      +'<p>Create one from a training case, or start the guided walkthrough above.</p>'
      +'<button class="btn" data-act="new">+ Create the first case</button></div>';
  h += '</div></div>';

  v.innerHTML = h;
  on(v,'[data-act=new]','click', newCaseDialog);
  on(v,'[data-act=guided]','click', startGuided);
  wireCaseTable(v);
};

function caseTable(list){
  return '<div class="tw"><table><thead><tr>'
    + '<th>Case</th><th>Patient</th><th>Suspect drug</th><th>Reaction</th>'
    + '<th>Status</th><th>Priority</th><th>Updated</th></tr></thead><tbody>'
    + list.map(function(c){
        var d = (c.drugs||[]).filter(function(x){return x.category==='Suspect';})[0]||{};
        var e = (c.events||[])[0]||{};
        return '<tr class="clk" data-case="'+c.id+'">'
          + '<td><b>'+esc(c.caseNo)+'</b></td>'
          + '<td>'+esc([c.patient&&c.patient.age, c.patient&&c.patient.sex].filter(Boolean).join(', ')||'—')+'</td>'
          + '<td>'+esc(d.generic||'—')+'</td>'
          + '<td>'+esc((e.coded&&e.coded.pt) || e.reported || '—')+'</td>'
          + '<td>'+stateBadge(c.status)+'</td>'
          + '<td>'+prioBadge(c.priority)+'</td>'
          + '<td style="color:var(--muted);white-space:nowrap">'+fmtD(c.updated)+'</td></tr>';
      }).join('')
    + '</tbody></table></div>';
}
function wireCaseTable(scope){
  on(scope,'[data-case]','click', function(e,t){ go('case/'+t.getAttribute('data-case')); });
}

/* ================================================================== *
 * NEW CASE                                                            *
 * ================================================================== */
function newCaseDialog(){
  var g = DB.require('case.create');
  if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why), 'bad'); return; }
  var h = '<p style="font-size:13px;color:var(--muted);margin-bottom:14px">'
    + 'Start from a training case and the intake form is pre-filled with the report as it arrived, so you '
    + 'practise processing rather than typing. Each training case has a hidden answer key and is scored when you '
    + 'close it. A blank case starts empty.</p><div class="stack">';
  h += '<div class="fld"><label>Training case</label><select id="ncPick">'
    + '<option value="">— Blank case, enter everything myself —</option>'
    + D.TRAINING.map(function(t){
        return '<option value="'+t.id+'">'+esc(t.id+' · '+t.title+' (level '+t.level+')')+'</option>'; }).join('')
    + '</select><div class="hint" id="ncHint">Pick one to see the report that came in.</div></div>';
  h += '<div id="ncBrief"></div></div>';
  modal('Create a new safety case', h, [
    {label:'Cancel', cls:'sec'},
    {label:'Create case', cls:'btn', act:function(){
      var id = $('ncPick').value;
      var c = DB.createCase(id?{trainingCaseId:id}:{});
      if(c.error){ toast('<span class="t">Not permitted</span>'+esc(c.error),'bad'); return false; }
      if(id) prefill(c, id);
      toast('<span class="t">Case '+esc(c.caseNo)+' created</span>Opening intake.');
      setTimeout(function(){ go('case/'+c.id); }, 60);
    }}
  ], function(body){
    var sel = body.querySelector('#ncPick');
    function upd(){
      var t = D.TRAINING.filter(function(x){ return x.id===sel.value; })[0];
      body.querySelector('#ncBrief').innerHTML = t
        ? '<div class="note info"><span class="t">'+esc(t.title)+'</span>'+esc(t.brief)+'</div>'
        : '';
    }
    sel.addEventListener('change', upd); upd();
  });
}

function prefill(c, trainingId){
  var t = D.TRAINING.filter(function(x){ return x.id===trainingId; })[0];
  if(!t) return c;
  c.reporter = Object.assign({}, c.reporter, t.reporter, {
    reportDate: new Date().toISOString().slice(0,10), contactPref:'Email'});
  c.patient  = Object.assign({}, c.patient, t.patient, {pid: t.id+'-P'});
  c.drugs = t.drugs.map(function(d){
    var card = (LD.DRUGS||{})[d.key] || {};
    var extra = (D.PRODUCT_EXTRA||{})[d.key] || {};
    return Object.assign({id:DB.uid('drg')}, d, {
      generic: card.generic || d.key,
      product: (extra.brands||[])[0] || card.generic || d.key,
      brand:   (extra.brands||[])[0] || '',
      strength:d.dose||'', form:(extra.forms||['Tablet'])[0],
      batch:'', expiry:''
    });
  });
  c.events = t.events.map(function(e){
    return Object.assign({id:DB.uid('evt')}, e, {coded:null});
  });
  DB.saveCase(c);
  DB.audit('case.prefill','case',c.id,'Intake pre-filled from training case '+trainingId);
  return c;
}

/* ================================================================== *
 * CASE LIST                                                           *
 * ================================================================== */
VIEWS.cases = function(v, args){
  var filter = args[0]||'';
  var all = DB.cases();
  var list = all, label = 'All cases';
  if(filter==='review'){ list = underReview(); label = 'Under review'; }
  else if(filter){ list = byStatus(filter); label = (DB.stateById(filter)||{}).name || filter; }
  title(label, list.length + ' case' + (list.length===1?'':'s'));

  var h = '<div class="stack"><div class="card"><div class="hd"><h2>'+esc(label)+'</h2>'
    + '<span class="sp"></span>'
    + '<input id="cq" placeholder="Filter by case number, drug or reaction" '
    + 'style="padding:7px 11px;border:1px solid var(--line-2);border-radius:8px;font-size:12.5px;width:260px">'
    + '<button class="btn sm" data-act="new">+ New case</button></div>';
  h += list.length ? '<div id="clist">'+caseTable(list)+'</div>'
    : '<div class="empty"><div class="ic">▤</div><h3>Nothing here</h3>'
      +'<p>No case is currently at this stage.</p><button class="btn" data-act="new">+ New safety case</button></div>';
  h += '</div></div>';
  v.innerHTML = h;
  on(v,'[data-act=new]','click', newCaseDialog);
  wireCaseTable(v);
  var q = v.querySelector('#cq');
  if(q) q.addEventListener('input', function(){
    var s = q.value.toLowerCase();
    var f = list.filter(function(c){
      var d = (c.drugs||[]).map(function(x){return x.generic;}).join(' ');
      var e = (c.events||[]).map(function(x){return (x.reported||'')+' '+((x.coded&&x.coded.pt)||'');}).join(' ');
      return (c.caseNo+' '+d+' '+e).toLowerCase().indexOf(s)>=0;
    });
    v.querySelector('#clist').innerHTML = f.length ? caseTable(f)
      : '<div class="empty"><p>No case matches that.</p></div>';
    wireCaseTable(v);
  });
};

/* ================================================================== *
 * THE CASE WORKSPACE                                                  *
 *                                                                     *
 * One screen per stage of the lifecycle, in the order the spec sets    *
 * out. The step strip across the top is the whole workflow, and it     *
 * marks what is done rather than merely where you are.                 *
 * ================================================================== */
var STEPS = [
 {k:'intake',    label:'1 Intake',        done:function(c){ return !!(c.reporter.name && c.patient.age); }},
 {k:'drugs',     label:'2 Medication',    done:function(c){ return (c.drugs||[]).length>0; }},
 {k:'event',     label:'3 Adverse event', done:function(c){ return (c.events||[]).length>0; }},
 {k:'validity',  label:'4 Validity',      done:function(c){ return !!c.validity; }},
 {k:'triage',    label:'5 Triage',        done:function(c){ return !!c.triage; }},
 {k:'dupe',      label:'6 Duplicates',    done:function(c){ return !!(c.duplicate&&c.duplicate.checked); }},
 {k:'coding',    label:'7 Coding',        done:function(c){ return !!(((c.events||[])[0]||{}).coded); }},
 {k:'serious',   label:'8 Seriousness',   done:function(c){ return !!c.seriousness; }},
 {k:'expected',  label:'9 Expectedness',  done:function(c){ return !!c.expectedness; }},
 {k:'causality', label:'10 Causality',    done:function(c){ return !!c.causality; }},
 {k:'followup',  label:'11 Follow-up',    done:function(c){ return (c.followups||[]).length>0 || !E.gaps(c).required; }},
 {k:'narrative', label:'12 Narrative',    done:function(c){ return !!(c.narrative&&c.narrative.accepted); }},
 {k:'medical',   label:'13 Medical review',done:function(c){ return !!(c.medicalReview&&c.medicalReview.decision); }},
 {k:'qc',        label:'14 QC',           done:function(c){ return !!(c.qc&&c.qc.decision); }},
 {k:'icsr',      label:'15 ICSR',         done:function(c){ return !!(c.regulatory&&c.regulatory.icsrStatus); }},
 {k:'close',     label:'16 Closure',      done:function(c){ return c.status==='CLOSED'; }}
];

VIEWS.case = function(v, args){
  var id = args[0], step = args[1]||'intake';
  var c = DB.case(id);
  if(!c){ v.innerHTML = '<div class="note bad"><span class="t">Case not found</span>'
    + 'It may have been deleted. <a href="#cases">Back to all cases</a></div>'; return; }
  title(c.caseNo, (DB.stateById(c.status)||{}).name + ' · ' + (c.trainingCaseId||'free-form case'));

  var h = '<div class="stack">';

  /* header strip */
  h += '<div class="card"><div class="bd" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">'
    + '<div><div style="font-size:19px;font-weight:800">'+esc(c.caseNo)+'</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:3px">Created '+fmt(c.created)
    + (c.createdByName?' by '+esc(c.createdByName):'')+'</div></div>'
    + '<div class="row" style="gap:7px">'+stateBadge(c.status)+prioBadge(c.priority)+'</div>'
    + '<div class="sp" style="margin-left:auto"></div>'
    + moveButtons(c)
    + '</div></div>';

  /* guided coaching panel */
  if(c.guided) h += guidedPanel(c, step);

  /* step strip */
  h += '<div class="steps">'
    + STEPS.map(function(s){
        var done = false; try{ done = s.done(c); }catch(e){}
        return '<button class="s'+(s.k===step?' on':(done?' done':''))+'" data-step="'+s.k+'">'
          + (done && s.k!==step ? '✓ ' : '') + esc(s.label)+'</button>';
      }).join('')
    + '</div>';

  h += '<div id="stepBody"></div></div>';
  v.innerHTML = h;

  on(v,'[data-step]','click', function(e,t){ go('case/'+id+'/'+t.getAttribute('data-step')); });
  on(v,'[data-move]','click', function(e,t){
    var to = t.getAttribute('data-move');
    var r = DB.transition(id, to);
    if(r.error){ toast('<span class="t">Cannot move the case</span>'+esc(r.error),'bad'); return; }
    toast('<span class="t">Moved to '+esc((DB.stateById(to)||{}).name)+'</span>'
      + 'Recorded in the audit trail.');
    render();
  });

  var fn = STEP_VIEWS[step] || STEP_VIEWS.intake;
  fn($('stepBody'), c);
  currentCaseId = id;
};

var currentCaseId = null;

function moveButtons(c){
  var moves = DB.allowedMoves(c);
  if(!moves.length) return '<span class="badge b-navy">Terminal state — this case is finished</span>';
  return moves.map(function(m){
    return '<button class="btn '+(m.allowed?'':'sec')+' sm" data-move="'+m.to+'"'
      + (m.allowed?'':' title="Requires permission: '+esc(m.perm)+'"')
      + '>'+(m.allowed?'→ ':'⚿ ')+esc(m.name)+'</button>';
  }).join(' ');
}

function saveAnd(c, what){
  DB.saveCase(c);
  DB.audit('case.update','case',c.id, c.caseNo+': '+what);
  toast('<span class="t">Saved</span>'+esc(what));
}

/* ---- guided coaching ---- */
var GUIDE = {
  intake:   ['Record who is reporting and who the patient is.',
             'Without an identifiable patient and an identifiable reporter there is no valid case, whatever else you have.',
             'A contact route for the reporter. A name with no email or phone cannot be followed up.'],
  drugs:    ['Enter the medicines, marking which are suspect.',
             'The suspect drug is one of the four minimum elements, and the concomitant list is what lets you exclude other causes later.',
             'Dose, route, frequency and the start date. The start date is half of the temporal relationship.'],
  event:    ['Record the reaction in the reporter’s own words, then the detail.',
             'The verbatim term is preserved for good reason — coding loses detail that may matter later.',
             'The onset date, and the outcome. Outcome is the field most often left blank in real reports.'],
  validity: ['Run the four minimum elements check.',
             'Until all four are present this is an enquiry, not a case, and it cannot be processed.',
             'Which element is missing, and what would satisfy it.'],
  triage:   ['Answer the triage questions to set a priority.',
             'Triage decides what gets worked first and whether a clinician needs to see it today.',
             'Seriousness drives everything. If in doubt, ask whether intervention was needed to prevent something worse.'],
  dupe:     ['Check whether this case is already in the database.',
             'A duplicate double-counts one patient in every signal calculation that follows. This is data integrity, not tidiness.',
             'The fields that matched, not just the percentage. Read both cases before deciding.'],
  coding:   ['Translate the reported wording into a standardised term.',
             'The coded term is what makes this case findable alongside similar ones. The wrong term hides the case.',
             'Whether a more specific term fits. "Rash" and "Stevens-Johnson syndrome" are not interchangeable.'],
  serious:  ['Apply the six seriousness criteria.',
             'Seriousness sets the reporting timeline, and it is a regulatory classification based on outcome.',
             '"Other medically important condition" — the criterion that catches dangerous events managed outside hospital.'],
  expected: ['Compare the reaction against the reference safety information.',
             'An unexpected serious reaction is what signal detection exists to find.',
             'That expected does not mean unimportant, and unlisted does not mean impossible.'],
  causality:['Work through the causality questions.',
             'This is the assessment everything else was gathered for.',
             'Whether alternatives were excluded, and what the dechallenge showed.'],
  followup: ['Decide what to chase and raise the request.',
             'Most reports arrive incomplete. Follow-up is where a weak case becomes a usable one.',
             'The fields that change the assessment: dates, dechallenge, outcome, concomitant medication.'],
  narrative:['Generate the narrative and review it.',
             'The narrative is what a reader who never sees your form will actually read.',
             'Anything the draft states that the record does not support. You are accountable for it, not the generator.'],
  medical:  ['A clinician reviews the clinical content.',
             'Separation of duties: the person who entered the case does not approve it.',
             'Whether seriousness and causality are supportable on the evidence recorded.'],
  qc:       ['Independent check against the record.',
             'QC catches what familiarity hides. It is the last chance before the case is used.',
             'Dates that do not line up, and coding that does not match the narrative.'],
  icsr:     ['Generate the ICSR and take it through the simulated submission.',
             'This is the artefact the whole process exists to produce.',
             'That every required field is populated before it goes.'],
  close:    ['Close the case.',
             'A closed case counts in analytics and feeds signal detection. That is what all of this was for.',
             'Your score, and the debrief for the training case.']
};
function guidedPanel(c, step){
  var g = GUIDE[step]; if(!g) return '';
  return '<div class="card" style="border-left:4px solid var(--teal)"><div class="bd">'
    + '<div class="grid g3" style="gap:14px">'
    + '<div><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal)">What you are doing</div>'
    + '<div style="font-size:13px;margin-top:4px;line-height:1.55">'+esc(g[0])+'</div></div>'
    + '<div><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal)">Why it matters</div>'
    + '<div style="font-size:13px;margin-top:4px;line-height:1.55">'+esc(g[1])+'</div></div>'
    + '<div><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal)">What to look for</div>'
    + '<div style="font-size:13px;margin-top:4px;line-height:1.55">'+esc(g[2])+'</div></div>'
    + '</div></div></div>';
}

function startGuided(){
  var g = DB.require('case.create');
  if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
  modal('Welcome to the PV simulation',
    '<div class="stack">'
    + '<div class="note info"><span class="t">You are a Pharmacovigilance Officer</span>'
    + 'Your task is to process the following safety report from initial receipt to case closure. '
    + 'At every stage the system will tell you what you are doing, why it matters and what to look for. '
    + 'Estimated time: about 20 minutes.</div>'
    + '<div class="note warn" style="margin:0"><span class="t">'+esc(D.TRAINING[0].title)+'</span>'
    + esc(D.TRAINING[0].brief)+'</div>'
    + '<p style="font-size:12.5px;color:var(--muted)">You can leave and come back — the case is saved as you go. '
    + 'At the end it is scored against a hidden answer key and you get a debrief.</p></div>',
    [{label:'Not now', cls:'sec'},
     {label:'Start case', cls:'btn', act:function(){
        var c = DB.createCase({trainingCaseId:'TC-01', guided:true});
        if(c.error){ toast('<span class="t">Not permitted</span>'+esc(c.error),'bad'); return false; }
        prefill(c,'TC-01');
        setTimeout(function(){ go('case/'+c.id+'/intake'); },60);
     }}]);
}

/* ================================================================== *
 * STEP SCREENS                                                        *
 * ================================================================== */
var STEP_VIEWS = {};

function field(label, id, val, opts){
  opts = opts||{};
  var input;
  if(opts.type==='textarea')
    input = '<textarea id="'+id+'" placeholder="'+esc(opts.ph||'')+'">'+esc(val||'')+'</textarea>';
  else if(opts.type==='select')
    input = '<select id="'+id+'">'
      + (opts.blank!==false?'<option value="">—</option>':'')
      + (opts.options||[]).map(function(o){
          var vv = (typeof o==='string')?o:o.v, ll = (typeof o==='string')?o:o.l;
          return '<option value="'+esc(vv)+'"'+(String(val)===String(vv)?' selected':'')+'>'+esc(ll)+'</option>';
        }).join('') + '</select>';
  else
    input = '<input id="'+id+'" type="'+(opts.type||'text')+'" value="'+esc(val||'')+'" placeholder="'+esc(opts.ph||'')+'">';
  return '<div class="fld"><label>'+esc(label)+(opts.req?' <span class="req">*</span>':'')+'</label>'
    + input + (opts.hint?'<div class="hint">'+esc(opts.hint)+'</div>':'') + '</div>';
}
function val(scope, id){ var e = scope.querySelector('#'+id); return e?e.value.trim():''; }

/* ---------- 1 · INTAKE ---------- */
STEP_VIEWS.intake = function(host, c){
  var r = c.reporter, p = c.patient;
  host.innerHTML = '<div class="stack">'
   + '<div class="card"><div class="hd"><h2>Reporter information</h2></div><div class="bd">'
   + '<div class="fgrid">'
   + field('Reporter type','rType', r.type, {type:'select', req:true,
       options:['Healthcare professional','Consumer','Patient','Lawyer','Other']})
   + field('Source of report','rSource', r.source, {type:'select', req:true,
       options:['Doctor','Pharmacist','Nurse','Patient','Consumer','Literature','Clinical Trial','Social Media','Other']})
   + field('Name','rName', r.name, {req:true, ph:'Reporter name or initials'})
   + field('Institution','rInst', r.institution, {ph:'Hospital, pharmacy or clinic'})
   + field('Country','rCountry', r.country, {})
   + field('Email','rEmail', r.email, {ph:'For follow-up'})
   + field('Phone','rPhone', r.phone, {})
   + field('Preferred contact','rPref', r.contactPref, {type:'select', options:['Email','Phone','Post'], blank:false})
   + field('Reporting date','rDate', r.reportDate, {type:'date'})
   + '</div></div></div>'

   + '<div class="card"><div class="hd"><h2>Patient information</h2>'
   + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Identifiable to the reporter, de-identified here.</span></div>'
   + '<div class="bd">'
   + '<div class="note info" style="margin-bottom:15px">Do not enter a real name or any real identifier. '
   + 'A case number, initials, age and sex are enough to make a patient identifiable for reporting purposes, '
   + 'and collecting more than the report needs is a privacy failure rather than thoroughness.</div>'
   + '<div class="fgrid">'
   + field('Patient identifier','pPid', p.pid, {req:true, ph:'Initials or a case reference'})
   + field('Age','pAge', p.age, {req:true, ph:'e.g. 47 or 47 years'})
   + field('Date of birth','pDob', p.dob, {type:'date'})
   + field('Sex','pSex', p.sex, {type:'select', options:['Female','Male','Other','Unknown']})
   + field('Weight','pWt', p.weight, {ph:'e.g. 68 kg'})
   + field('Height','pHt', p.height, {ph:'e.g. 165 cm'})
   + field('Pregnancy status','pPreg', p.pregnancy, {type:'select',
       options:['Not applicable','Not pregnant','Pregnant','Breastfeeding','Unknown']})
   + '</div>'
   + field('Relevant medical history','pHist', p.history, {type:'textarea',
       ph:'Conditions, allergies, previous reactions', hint:'Drug–disease interactions and confounders both live here.'})
   + field('Relevant laboratory data','pLabs', p.labs, {type:'textarea',
       ph:'Results with dates', hint:'Objective evidence is what moves a report from an anecdote towards evidence.'})
   + '</div></div>'
   + '<div class="row"><button class="btn" data-act="save">Save intake</button>'
   + '<a class="btn sec" href="#case/'+c.id+'/drugs">Next: medication →</a></div>'
   + '</div>';

  on(host,'[data-act=save]','click', function(){
    c.reporter = {type:val(host,'rType'), source:val(host,'rSource'), name:val(host,'rName'),
      institution:val(host,'rInst'), country:val(host,'rCountry'), email:val(host,'rEmail'),
      phone:val(host,'rPhone'), contactPref:val(host,'rPref'), reportDate:val(host,'rDate')};
    c.patient = {pid:val(host,'pPid'), age:val(host,'pAge'), dob:val(host,'pDob'), sex:val(host,'pSex'),
      weight:val(host,'pWt'), height:val(host,'pHt'), pregnancy:val(host,'pPreg'),
      history:val(host,'pHist'), labs:val(host,'pLabs')};
    saveAnd(c,'reporter and patient information updated');
    render();
  });
};

/* ---------- 2 · MEDICATION ---------- */
STEP_VIEWS.drugs = function(host, c){
  function rows(){
    if(!(c.drugs||[]).length)
      return '<div class="empty"><div class="ic">⊕</div><h3>No medication recorded</h3>'
        +'<p>At least one suspect drug is needed — it is one of the four minimum elements.</p></div>';
    return '<div class="tw"><table><thead><tr><th>Category</th><th>Product</th><th>Dose / route / frequency</th>'
      + '<th>Dates</th><th>Indication</th><th>Action / dechallenge</th><th></th></tr></thead><tbody>'
      + c.drugs.map(function(d,i){
          var badge = d.category==='Suspect'?'b-red':d.category==='Interacting'?'b-amber':'b-grey';
          return '<tr><td><span class="badge '+badge+'">'+esc(d.category)+'</span></td>'
            + '<td><b>'+esc(d.generic||d.product||'—')+'</b>'
            + (d.brand?'<br><span style="color:var(--muted);font-size:11.5px">'+esc(d.brand)+'</span>':'')+'</td>'
            + '<td>'+esc([d.dose,d.route,d.freq].filter(Boolean).join(' · ')||'—')+'</td>'
            + '<td style="white-space:nowrap">'+esc(d.start||'—')+'<br>'
            + '<span style="color:var(--muted)">'+esc(d.stop||'continuing')+'</span></td>'
            + '<td>'+esc(d.indication||'—')+'</td>'
            + '<td>'+esc(d.action||'—')+'<br><span style="color:var(--muted);font-size:11.5px">DC: '
            + esc(d.dechallenge||'—')+' · RC: '+esc(d.rechallenge||'—')+'</span></td>'
            + '<td><button class="btn sec sm" data-edit="'+i+'">Edit</button> '
            + '<button class="btn sec sm" data-del="'+i+'">Remove</button></td></tr>';
        }).join('')
      + '</tbody></table></div>';
  }
  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Medication</h2><span class="sp"></span>'
    + '<button class="btn sm" data-add="Suspect">+ Add suspect drug</button>'
    + '<button class="btn sec sm" data-add="Concomitant">+ Add concomitant drug</button>'
    + '<button class="btn sec sm" data-add="Interacting">+ Add interacting drug</button></div>'
    + '<div id="drows">'+rows()+'</div></div>'
    + interactionPanel(c)
    + '<div class="row"><a class="btn sec" href="#case/'+c.id+'/intake">← Intake</a>'
    + '<a class="btn" href="#case/'+c.id+'/event">Next: adverse event →</a></div></div>';

  on(host,'[data-add]','click', function(e,t){ drugDialog(c, null, t.getAttribute('data-add')); });
  on(host,'[data-edit]','click', function(e,t){ drugDialog(c, +t.getAttribute('data-edit')); });
  on(host,'[data-del]','click', function(e,t){
    var i = +t.getAttribute('data-del'), d = c.drugs[i];
    modal('Remove this medicine?', '<p style="font-size:13px">Remove <b>'+esc(d.generic||d.product)
      + '</b> from this case? The removal is recorded in the audit trail.</p>',
      [{label:'Cancel',cls:'sec'},{label:'Remove',cls:'btn dgr',act:function(){
        c.drugs.splice(i,1); saveAnd(c,'removed medicine '+(d.generic||d.product)); render(); }}]);
  });
};

/* The interaction and patient-factor check, drawing on the audited
   workshop data rather than a second copy of it. */
function interactionPanel(c){
  var LE = window.PVXLearn;
  if(!LE || !LE.findInteraction) return '';
  var keys = (c.drugs||[]).map(function(d){ return d.key; }).filter(Boolean);
  if(keys.length < 1) return '';
  var found = [], seen = {};
  for(var i=0;i<keys.length;i++){
    for(var j=i+1;j<keys.length;j++){
      var r = LE.findInteraction(keys[i], keys[j]);
      if(r.found){
        var id = [keys[i],keys[j]].sort().join('|');
        if(seen[id]) continue; seen[id]=1;
        found.push({a:keys[i], b:keys[j], r:r});
      }
    }
  }
  var factors = [];
  var hist = ((c.patient&&c.patient.history)||'').toLowerCase();
  keys.forEach(function(k){
    (LE.diseaseRisksFor?LE.diseaseRisksFor(k):[]).forEach(function(x){
      var words = x.cond.toLowerCase().split(/[^a-z]+/).filter(function(w){ return w.length>4; });
      if(words.some(function(w){ return hist.indexOf(w)>=0; })) factors.push(x);
    });
  });
  if(!found.length && !factors.length) return '';
  var h = '<div class="card"><div class="hd"><h2>Interaction and patient-factor screen</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Run automatically on the medicines and history recorded</span></div><div class="bd"><div class="stack">';
  found.forEach(function(f){
    var rag = f.r.pair.rag;
    h += '<div class="note '+(rag==='red'?'bad':rag==='amber'?'warn':'ok')+'" style="margin:0">'
      + '<span class="t">'+esc((LD.DRUGS[f.a]||{}).generic||f.a)+' + '
      + esc((LD.DRUGS[f.b]||{}).generic||f.b)+' — '+esc((LD.RAG||{})[rag].label)+'</span>'
      + esc(f.r.pair.effect)+' '+esc(f.r.pair.conseq)+'</div>';
  });
  factors.forEach(function(x){
    h += '<div class="note '+(x.rag==='red'?'bad':'warn')+'" style="margin:0">'
      + '<span class="t">Patient factor — '+esc(x.cond)+'</span>'+esc(x.conseq)+'</div>';
  });
  h += '</div></div></div>';
  return h;
}

function drugDialog(c, idx, category){
  var d = idx==null ? {id:DB.uid('drg'), category:category||'Suspect'} : Object.assign({}, c.drugs[idx]);
  var prods = D.products();
  var h = '<div class="stack">'
    + '<div class="fgrid">'
    + field('Category','dCat', d.category, {type:'select', blank:false,
        options:['Suspect','Concomitant','Interacting','Previous']})
    + field('Product (training dictionary)','dKey', d.key, {type:'select',
        options: prods.map(function(p){ return {v:p.key, l:p.generic}; }),
        hint:'Choosing one fills the generic name, strengths, forms and routes.'})
    + '</div>'
    + '<div class="fgrid">'
    + field('Generic name','dGen', d.generic, {req:true})
    + field('Brand name','dBrand', d.brand, {})
    + field('Strength','dStr', d.strength, {})
    + field('Dosage form','dForm', d.form, {})
    + field('Dose','dDose', d.dose, {ph:'e.g. 500 mg'})
    + field('Route','dRoute', d.route, {})
    + field('Frequency','dFreq', d.freq, {ph:'e.g. Three times daily'})
    + field('Indication','dInd', d.indication, {})
    + field('Start date','dStart', d.start, {type:'date'})
    + field('Stop date','dStop', d.stop, {type:'date', hint:'Leave blank if continuing.'})
    + field('Batch / lot number','dBatch', d.batch, {})
    + field('Expiry','dExp', d.expiry, {type:'date'})
    + field('Action taken','dAct', d.action, {type:'select',
        options:['Drug withdrawn','Dose reduced','Dose increased','Dose not changed','Unknown','Not applicable']})
    + field('Dechallenge','dDe', d.dechallenge, {type:'select',
        options:['Positive','Negative','Unknown','Not applicable'],
        hint:'Positive means the reaction improved when the drug was stopped — usually the strongest causality evidence you can get.'})
    + field('Rechallenge','dRe', d.rechallenge, {type:'select',
        options:['Positive','Negative','Unknown','Not done'],
        hint:'Was the drug given again, and did the reaction come back? Usually and rightly not done.'})
    + '</div></div>';
  modal(idx==null?'Add medicine':'Edit medicine', h,
    [{label:'Cancel',cls:'sec'},
     {label:'Save', cls:'btn', act:function(){
       var b = $('modalB');
       var nd = {id:d.id, category:val(b,'dCat'), key:val(b,'dKey'), generic:val(b,'dGen'),
         brand:val(b,'dBrand'), strength:val(b,'dStr'), form:val(b,'dForm'), dose:val(b,'dDose'),
         route:val(b,'dRoute'), freq:val(b,'dFreq'), indication:val(b,'dInd'), start:val(b,'dStart'),
         stop:val(b,'dStop'), batch:val(b,'dBatch'), expiry:val(b,'dExp'), action:val(b,'dAct'),
         dechallenge:val(b,'dDe'), rechallenge:val(b,'dRe')};
       if(!nd.generic){ toast('<span class="t">Generic name is required</span>'
         + 'A product that is not named cannot satisfy the minimum elements.','bad'); return false; }
       c.drugs = c.drugs||[];
       if(idx==null) c.drugs.push(nd); else c.drugs[idx]=nd;
       saveAnd(c, (idx==null?'added ':'updated ')+nd.category.toLowerCase()+' drug '+nd.generic);
       render();
     }}],
    function(body){
      var sel = body.querySelector('#dKey');
      sel.addEventListener('change', function(){
        var p = prods.filter(function(x){ return x.key===sel.value; })[0];
        if(!p) return;
        body.querySelector('#dGen').value = p.generic;
        if(!body.querySelector('#dBrand').value) body.querySelector('#dBrand').value = p.brands[0]||'';
        if(!body.querySelector('#dStr').value)   body.querySelector('#dStr').value = p.strengths[0]||'';
        if(!body.querySelector('#dForm').value)  body.querySelector('#dForm').value = p.forms[0]||'';
        if(!body.querySelector('#dRoute').value) body.querySelector('#dRoute').value = p.routes[0]||'';
      });
    });
}

/* ---------- 3 · ADVERSE EVENT ---------- */
STEP_VIEWS.event = function(host, c){
  var e = (c.events||[])[0] || {id:DB.uid('evt')};
  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Adverse event</h2></div><div class="bd">'
    + field('Reported event, in the reporter’s words','eRep', e.reported, {req:true,
        ph:'e.g. widespread itchy rash', hint:'Record the verbatim wording before you code it. The coded term loses detail the original keeps.'})
    + '<div class="fgrid">'
    + field('Event start date','eStart', e.start, {type:'date', req:true,
        hint:'Half of the temporal relationship.'})
    + field('Event end date','eEnd', e.end, {type:'date', hint:'Blank if ongoing.'})
    + field('Outcome','eOut', e.outcome, {type:'select', req:true,
        options:['Recovered','Recovering','Not recovered','Recovered with sequelae','Fatal','Unknown']})
    + field('Hospitalisation','eHosp', e.hosp, {ph:'No, or the admission dates'})
    + '</div>'
    + field('Event description','eDesc', e.description, {type:'textarea'})
    + field('Clinical findings','eClin', e.clinical, {type:'textarea'})
    + field('Laboratory findings','eLab', e.lab, {type:'textarea'})
    + field('Treatment given for the event','eTx', e.treatment, {type:'textarea'})
    + '</div></div>'
    + '<div class="row"><button class="btn" data-act="save">Save event</button>'
    + '<a class="btn sec" href="#case/'+c.id+'/validity">Next: validity check →</a></div></div>';

  on(host,'[data-act=save]','click', function(){
    var ne = {id:e.id, reported:val(host,'eRep'), start:val(host,'eStart'), end:val(host,'eEnd'),
      outcome:val(host,'eOut'), hosp:val(host,'eHosp'), description:val(host,'eDesc'),
      clinical:val(host,'eClin'), lab:val(host,'eLab'), treatment:val(host,'eTx'), coded:e.coded||null};
    if(!ne.reported){ toast('<span class="t">The reported event is required</span>'
      + 'It is one of the four minimum elements.','bad'); return; }
    c.events = [ne];
    saveAnd(c,'adverse event recorded: '+ne.reported);
    render();
  });
};

/* ---------- 4 · VALIDITY ---------- */
STEP_VIEWS.validity = function(host, c){
  var v = E.validity(c);
  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Case validity check</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">The four minimum elements</span></div><div class="bd">'
    + '<div class="note '+(v.valid?'ok':'bad')+'" style="margin-bottom:15px"><span class="t">'
    + (v.valid?'VALID SAFETY CASE':'INCOMPLETE REPORT')+'</span>'+esc(v.verdict)+'</div>'
    + v.checks.map(function(x){
        return '<div class="chk"><span class="mk '+(x.ok?'y':'n')+'">'+(x.ok?'✓':'✕')+'</span>'
          + '<span class="tx"><b>'+esc(x.label)+'</b><span class="w">'+esc(x.why)+'</span></span></div>';
      }).join('')
    + '</div></div>'
    + '<div class="row"><button class="btn" data-act="record">Record this check</button>'
    + (v.valid?'<a class="btn sec" href="#case/'+c.id+'/triage">Next: triage →</a>'
              :'<a class="btn sec" href="#case/'+c.id+'/intake">Go back and complete it</a>')
    + '</div></div>';
  on(host,'[data-act=record]','click', function(){
    c.validity = {valid:v.valid, at:Date.now(), missing:v.missing.map(function(m){return m.k;})};
    saveAnd(c,'validity check recorded — '+(v.valid?'valid':'incomplete'));
    render();
  });
};

/* ---------- 5 · TRIAGE ---------- */
STEP_VIEWS.triage = function(host, c){
  var prev = (c.triage&&c.triage.answers)||{};
  var ans = Object.assign({}, prev);
  function draw(){
    var t = E.triage(c, ans);
    host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Triage</h2></div><div class="bd">'
      + E.TRIAGE_Q.map(function(q){
          return '<div style="padding:12px 0;border-bottom:1px solid var(--line)">'
            + '<div style="font-size:13.4px;font-weight:600">'+esc(q.q)+'</div>'
            + '<div style="font-size:11.8px;color:var(--muted);margin:3px 0 8px;line-height:1.5">'+esc(q.help)+'</div>'
            + '<div class="row">'
            + ['yes','no','unknown'].map(function(x){
                return '<button class="btn '+(ans[q.k]===x?'nav':'sec')+' sm" data-q="'+q.k+'" data-v="'+x+'">'
                  + (x==='unknown'?'Not known':x.charAt(0).toUpperCase()+x.slice(1))+'</button>';
              }).join('')
            + '</div></div>';
        }).join('')
      + '<div style="margin-top:16px"><div class="note info"><span class="t">Derived priority: '+t.priority+'</span>'
      + '<ul style="margin:6px 0 0 17px">'+t.reasons.map(function(r){ return '<li>'+esc(r)+'</li>'; }).join('')+'</ul>'
      + '<div style="margin-top:9px;font-size:11.6px">'+esc(t.note)+'</div></div></div>'
      + '</div></div>'
      + '<div class="row"><button class="btn" data-act="save">Record triage</button>'
      + '<a class="btn sec" href="#case/'+c.id+'/dupe">Next: duplicate check →</a></div></div>';
    on(host,'[data-q]','click', function(e,b){ ans[b.getAttribute('data-q')] = b.getAttribute('data-v'); draw(); });
    on(host,'[data-act=save]','click', function(){
      var tt = E.triage(c, ans);
      c.triage = {answers:ans, priority:tt.priority, reasons:tt.reasons, at:Date.now(),
                  by:(DB.session()||{}).name||''};
      c.priority = tt.priority;
      saveAnd(c,'triaged as '+tt.priority);
      render();
    });
  }
  draw();
};

/* ---------- 6 · DUPLICATES ---------- */
STEP_VIEWS.dupe = function(host, c){
  var matches = E.duplicates(c, DB.cases());
  var h = '<div class="stack"><div class="card"><div class="hd"><h2>Duplicate detection</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Compared against '+DB.cases().length+' cases</span></div><div class="bd">';
  if(!matches.length){
    h += '<div class="note ok"><span class="t">No likely duplicate found</span>'
      + 'No other case scored above the similarity threshold on patient, drug, reaction and dates. '
      + 'That is not proof — a duplicate reported with different details can still slip through.</div>';
  } else {
    h += '<div class="note warn" style="margin-bottom:14px"><span class="t">'+matches.length
      + ' possible duplicate'+(matches.length===1?'':'s')+'</span>'
      + 'Read both cases before deciding. Merging wrongly loses a real report; not merging double-counts one patient '
      + 'in every signal calculation that follows.</div>';
    h += matches.map(function(m){
      return '<div class="card" style="margin-bottom:11px"><div class="bd">'
        + '<div class="row" style="margin-bottom:9px"><b style="font-size:14px">'+esc(m.case.caseNo)+'</b>'
        + '<span class="badge '+(m.score>=80?'b-red':m.score>=60?'b-amber':'b-grey')+'">'+m.score+'% similar</span>'
        + '<span style="font-size:12.5px;color:var(--muted)">'+esc(m.verdict)+'</span></div>'
        + '<div style="font-size:12.5px;margin-bottom:10px">Matched on: '+esc(m.matched.join(', '))+'</div>'
        + '<div class="row"><a class="btn sec sm" href="#case/'+m.case.id+'">View case</a>'
        + '<button class="btn sm" data-dup="merge" data-id="'+m.case.id+'">Mark as duplicate</button>'
        + '<button class="btn sec sm" data-dup="not" data-id="'+m.case.id+'">Not a duplicate</button>'
        + '<button class="btn warn sm" data-dup="esc" data-id="'+m.case.id+'">Escalate for review</button>'
        + '</div></div></div>';
    }).join('');
  }
  h += '</div></div>';
  if(c.duplicate && c.duplicate.checked)
    h += '<div class="note info"><span class="t">Check recorded</span>Decision: <b>'
      + esc(c.duplicate.decision||'none')+'</b> at '+fmt(c.duplicate.at)+'.</div>';
  h += '<div class="row"><button class="btn" data-act="clear">Record: checked, no duplicate</button>'
    + '<a class="btn sec" href="#case/'+c.id+'/coding">Next: coding →</a></div></div>';
  host.innerHTML = h;

  function record(decision, otherId){
    c.duplicate = {checked:true, decision:decision, otherId:otherId||null, at:Date.now(),
                   by:(DB.session()||{}).name||''};
    saveAnd(c,'duplicate check — '+decision);
    if(decision==='Escalated for review') DB.notify('pv_manager','duplicate',
      c.caseNo+' has been escalated as a possible duplicate.', c.id);
    render();
  }
  on(host,'[data-act=clear]','click', function(){ record('No duplicate identified'); });
  on(host,'[data-dup]','click', function(e,t){
    var kind = t.getAttribute('data-dup'), oid = t.getAttribute('data-id');
    var other = DB.case(oid);
    if(kind==='merge'){
      modal('Mark as duplicate?','<p style="font-size:13px">Record this case as a duplicate of <b>'
        + esc(other.caseNo)+'</b>? The link is recorded and the case is kept — nothing is deleted, because '
        + 'a wrongly merged report cannot be recovered.</p>',
        [{label:'Cancel',cls:'sec'},{label:'Mark as duplicate',cls:'btn warn',act:function(){
          record('Duplicate of '+other.caseNo, oid); }}]);
    }
    else if(kind==='not') record('Not a duplicate of '+other.caseNo, oid);
    else record('Escalated for review', oid);
  });
};

/* ---------- 7 · CODING ---------- */
STEP_VIEWS.coding = function(host, c){
  var e = (c.events||[])[0];
  if(!e){ host.innerHTML = '<div class="note warn"><span class="t">No event to code</span>'
    + 'Record the adverse event first. <a href="#case/'+c.id+'/event">Go to the event screen</a></div>'; return; }
  var d0 = (c.drugs||[]).filter(function(x){return x.category==='Suspect';})[0];

  function draw(q){
    var hits = E.searchTerms(q || e.reported || '');
    var h = '<div class="stack">';

    /* drug coding */
    h += '<div class="card"><div class="hd"><h2>Drug coding</h2></div><div class="bd">';
    if(d0){
      var p = D.products().filter(function(x){ return x.key===d0.key; })[0];
      h += '<div class="kv">'
        + '<div class="k">Reported product</div><div>'+esc(d0.product||d0.brand||d0.generic)+'</div>'
        + '<div class="k">Active ingredient</div><div><b>'+esc(d0.generic)+'</b></div>'
        + '<div class="k">Strength</div><div>'+esc(d0.strength||d0.dose||'—')+'</div>'
        + '<div class="k">Dosage form</div><div>'+esc(d0.form||'—')+'</div>'
        + '<div class="k">Route</div><div>'+esc(d0.route||'—')+'</div>'
        + (p?'<div class="k">Class</div><div>'+esc(p.cls)+'</div>'
            +'<div class="k">ATC (training)</div><div>'+esc(p.atc)+'</div>':'')
        + '</div>';
    } else h += '<div class="note warn" style="margin:0">No suspect drug recorded yet.</div>';
    h += '</div></div>';

    /* event coding */
    h += '<div class="card"><div class="hd"><h2>Adverse event coding</h2>'
      + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Synthetic training dictionary</span></div><div class="bd">'
      + '<div class="note info" style="margin-bottom:14px">This is a <b>synthetic dictionary in the shape of '
      + 'MedDRA</b> — lowest level term, preferred term, high level term, system organ class. It is not MedDRA '
      + 'and contains no MedDRA content; codes are prefixed SYN- so they cannot be mistaken for real ones. '
      + 'The structure is the lesson. Real coding needs a current licensed browser.</div>'
      + '<div class="fld"><label>Reported term</label>'
      + '<input id="cq2" value="'+esc(q!=null?q:(e.reported||''))+'">'
      + '<div class="hint">Type what the reporter said. The dictionary matches on the lowest level terms.</div></div>'
      + '<button class="btn sm" data-act="search">Search terminology</button>';

    if(e.coded){
      h += '<div class="note ok" style="margin-top:14px"><span class="t">Coded</span>'
        + '<div class="kv" style="margin-top:7px">'
        + '<div class="k">Reported term</div><div>'+esc(e.reported)+'</div>'
        + '<div class="k">Lowest level term</div><div>'+esc(e.coded.llt||'—')+'</div>'
        + '<div class="k">Preferred term</div><div><b>'+esc(e.coded.pt)+'</b> ('+esc(e.coded.code||'')+')</div>'
        + '<div class="k">High level term</div><div>'+esc(e.coded.hlt||'—')+'</div>'
        + '<div class="k">System organ class</div><div>'+esc(e.coded.socName||'—')+'</div>'
        + '</div></div>';
    }

    if(hits.length){
      h += '<div style="margin-top:16px"><div style="font-size:11px;font-weight:700;letter-spacing:.07em;'
        + 'text-transform:uppercase;color:var(--muted);margin-bottom:8px">Suggested terms</div>';
      h += hits.map(function(x,i){
        var t = x.term;
        return '<div class="card" style="margin-bottom:9px'+(i===0?';border-color:var(--teal)':'')+'"><div class="bd">'
          + '<div class="row" style="margin-bottom:7px"><b style="font-size:14px">'+esc(t.pt)+'</b>'
          + '<span class="badge b-grey">'+esc(t.code)+'</span>'
          + (t.serious?'<span class="badge b-red">Usually serious</span>':'')
          + (i===0?'<span class="badge b-teal">Closest match</span>':'')+'</div>'
          + '<div style="font-size:12.4px;color:var(--muted);line-height:1.7">'
          + 'Reported term → <b style="color:var(--ink)">'+esc(x.llt)+'</b> (LLT)<br>'
          + '→ <b style="color:var(--ink)">'+esc(t.pt)+'</b> (PT)<br>'
          + '→ '+esc(t.hlt)+' (HLT)<br>'
          + '→ '+esc(x.socName)+' (SOC)</div>'
          + '<button class="btn sm" style="margin-top:10px" data-code="'+esc(t.pt)+'">Code to this term</button>'
          + '</div></div>';
      }).join('') + '</div>';
    } else if(q!=null){
      h += '<div class="note warn" style="margin-top:14px"><span class="t">Nothing matched</span>'
        + 'Try plainer wording — the dictionary matches the kind of phrase a reporter would use.</div>';
    }
    h += '</div></div>';
    h += '<div class="row"><a class="btn sec" href="#case/'+c.id+'/dupe">← Duplicates</a>'
      + '<a class="btn" href="#case/'+c.id+'/serious">Next: seriousness →</a></div></div>';
    host.innerHTML = h;

    on(host,'[data-act=search]','click', function(){ draw(host.querySelector('#cq2').value); });
    host.querySelector('#cq2').addEventListener('keydown', function(ev){
      if(ev.key==='Enter') draw(host.querySelector('#cq2').value); });
    on(host,'[data-code]','click', function(ev,t){
      var pt = t.getAttribute('data-code');
      var term = E.termByPt(pt);
      var soc = D.SOCS.filter(function(s){ return s.code===term.soc; })[0];
      var hit = E.searchTerms(host.querySelector('#cq2').value || e.reported)
                 .filter(function(x){ return x.term.pt===pt; })[0];
      e.coded = {pt:term.pt, code:term.code, hlt:term.hlt, soc:term.soc,
                 socName: soc?soc.name:term.soc, llt: hit?hit.llt:term.llts[0]};
      c.events[0] = e;
      saveAnd(c,'reaction coded to '+pt);
      render();
    });
  }
  draw(null);
};

/* ---------- 8 · SERIOUSNESS ---------- */
STEP_VIEWS.serious = function(host, c){
  var sel = (c.seriousness && (c.seriousness.criteria||[]).map(function(x){return x.k;})) || [];
  var reason = (c.seriousness && c.seriousness.reason) || '';
  function draw(){
    var r = E.seriousness(sel);
    host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Seriousness assessment</h2></div><div class="bd">'
      + '<div class="note info" style="margin-bottom:15px"><span class="t">Seriousness is not severity</span>'
      + '<b>Severity</b> is how intense the reaction was. <b>Seriousness</b> is a regulatory classification decided '
      + 'against these six outcomes, and it sets the reporting timeline. A severe migraine is not serious; '
      + 'a symptomless critical potassium is.</div>'
      + E.criteria().map(function(x){
          var on_ = sel.indexOf(x.k)>=0;
          return '<div class="chk" style="cursor:pointer" data-crit="'+x.k+'">'
            + '<span class="mk '+(on_?'y':'n')+'" style="'+(on_?'':'background:#F1F5F9;color:#94A3B8')+'">'
            + (on_?'✓':' ')+'</span>'
            + '<span class="tx"><b>'+esc(x.label)+'</b><span class="w">'+esc(x.ex)+'</span></span></div>';
        }).join('')
      + '<div class="note '+(r.serious?'bad':'ok')+'" style="margin-top:15px"><span class="t">'
      + (r.serious?'SERIOUS':'NON-SERIOUS')+'</span>'+esc(r.verdict)+'<div style="margin-top:7px;font-size:11.8px">'
      + esc(r.note)+'</div></div>'
      + '<div style="margin-top:15px">'
      + field('Why? Record your reasoning','sReason', reason, {type:'textarea', req:true,
          ph:'Which criterion applies and why, or why none does',
          hint:'A seriousness decision nobody can explain is one nobody can check. This is required.'})
      + '</div></div></div>'
      + '<div class="row"><button class="btn" data-act="save">Record seriousness</button>'
      + '<a class="btn sec" href="#case/'+c.id+'/expected">Next: expectedness →</a></div></div>';
    on(host,'[data-crit]','click', function(e,t){
      var k = t.getAttribute('data-crit'), i = sel.indexOf(k);
      reason = host.querySelector('#sReason').value;
      if(i>=0) sel.splice(i,1); else sel.push(k);
      draw();
    });
    on(host,'[data-act=save]','click', function(){
      var rs = host.querySelector('#sReason').value.trim();
      if(!rs){ toast('<span class="t">A reason is required</span>'
        + 'Record why this case is serious or is not. It is the part a reviewer will read.','bad'); return; }
      var rr = E.seriousness(sel);
      c.seriousness = {criteria:rr.criteria, serious:rr.serious, reason:rs, at:Date.now(),
                       by:(DB.session()||{}).name||''};
      saveAnd(c,'seriousness recorded — '+(rr.serious?'serious':'non-serious'));
      render();
    });
  }
  draw();
};

/* ---------- 9 · EXPECTEDNESS ---------- */
STEP_VIEWS.expected = function(host, c){
  var e = (c.events||[])[0]||{};
  var d0 = (c.drugs||[]).filter(function(x){return x.category==='Suspect';})[0];
  if(!d0 || !e.coded){
    host.innerHTML = '<div class="note warn"><span class="t">Not ready</span>'
      + 'Expectedness compares a coded reaction against the reference safety information for a suspect drug. '
      + (d0?'Code the reaction first.':'Add a suspect drug first.')+'</div>'; return;
  }
  var r = E.expectedness(d0.key, e.coded.pt);
  var rsi = (D.RSI||{})[d0.key];
  var chosen = (c.expectedness && c.expectedness.verdict) || r.verdict;

  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Expectedness / listedness</h2></div><div class="bd">'
    + '<div class="kv" style="margin-bottom:15px">'
    + '<div class="k">Suspect drug</div><div><b>'+esc(d0.generic)+'</b></div>'
    + '<div class="k">Reported event</div><div>'+esc(e.reported)+'</div>'
    + '<div class="k">Coded reaction</div><div><b>'+esc(e.coded.pt)+'</b></div></div>'
    + '<div class="note '+(r.listed?'ok':'warn')+'"><span class="t">'
    + (r.listed?'Listed event — '+esc(r.frequency):'Not listed in the reference safety information')+'</span>'
    + esc(r.note)+'</div>'
    + (rsi?'<div style="margin-top:15px"><div style="font-size:11px;font-weight:700;letter-spacing:.07em;'
      + 'text-transform:uppercase;color:var(--muted);margin-bottom:8px">Reference safety information — '
      + esc(rsi.version)+'</div><div class="tw"><table><thead><tr><th>Listed reaction</th><th>Frequency</th></tr></thead><tbody>'
      + Object.keys(rsi.listed).map(function(k){
          return '<tr'+(k===e.coded.pt?' style="background:var(--teal-soft)"':'')+'><td>'+esc(k)
            + (k===e.coded.pt?' <span class="badge b-teal">this case</span>':'')+'</td><td>'+esc(rsi.listed[k])+'</td></tr>';
        }).join('')
      + '</tbody></table></div><div class="hint" style="margin-top:7px">A fictional company core data sheet held in '
      + 'the training dataset. This system does not retrieve current approved labelling and does not claim to.</div></div>':'')
    + '<div style="margin-top:16px">'
    + field('Your assessment','xVerdict', chosen, {type:'select', blank:false,
        options:['Expected','Unexpected','Unknown'],
        hint:'The system proposes from the reference data. You record the assessment.'})
    + '</div></div></div>'
    + '<div class="row"><button class="btn" data-act="save">Record expectedness</button>'
    + '<a class="btn sec" href="#case/'+c.id+'/causality">Next: causality →</a></div></div>';

  on(host,'[data-act=save]','click', function(){
    c.expectedness = {verdict:val(host,'xVerdict'), listed:r.listed, frequency:r.frequency||null,
      rsiVersion:rsi?rsi.version:null, at:Date.now(), by:(DB.session()||{}).name||''};
    saveAnd(c,'expectedness recorded — '+c.expectedness.verdict);
    render();
  });
};

/* ---------- 10 · CAUSALITY ---------- */
STEP_VIEWS.causality = function(host, c){
  var ans = (c.causality && c.causality.answers) || {};
  function draw(){
    var r = E.causality(ans);
    var answered = E.CAUS_Q.filter(function(q){ return ans[q.k]; }).length;
    host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Causality assessment</h2>'
      + '<span class="sp" style="font-size:11.5px;color:var(--muted)">'+answered+' of '+E.CAUS_Q.length+' answered</span></div><div class="bd">'
      + E.CAUS_Q.map(function(q){
          return '<div style="padding:11px 0;border-bottom:1px solid var(--line)">'
            + '<div style="font-size:13.4px;font-weight:600;margin-bottom:7px">'+esc(q.q)+'</div>'
            + '<div class="row">'
            + ['yes','no','unknown'].map(function(x){
                return '<button class="btn '+(ans[q.k]===x?'nav':'sec')+' sm" data-cq="'+q.k+'" data-v="'+x+'">'
                  + (x==='unknown'?'Not known':x.charAt(0).toUpperCase()+x.slice(1))+'</button>';
              }).join('')+'</div></div>';
        }).join('')
      + '<div class="note info" style="margin-top:15px"><span class="t">Assessment: '+esc(r.name)+'</span>'
      + r.why.map(esc).join(' ')
      + (r.need.length?'<div style="margin-top:9px;font-size:11.8px"><b>This category requires:</b><ul style="margin:5px 0 0 17px">'
          + r.need.map(function(n){ return '<li>'+esc(n)+'</li>'; }).join('')+'</ul></div>':'')
      + (r.note?'<div style="margin-top:8px;font-size:11.8px"><i>'+esc(r.note)+'</i></div>':'')
      + '</div>'
      + '<div class="note warn" style="margin-top:12px">'+esc(r.disclaimer)+'</div>'
      + '</div></div>'
      + '<div class="row"><button class="btn" data-act="save">Record causality</button>'
      + '<a class="btn sec" href="#case/'+c.id+'/followup">Next: follow-up →</a></div></div>';
    on(host,'[data-cq]','click', function(e,t){ ans[t.getAttribute('data-cq')] = t.getAttribute('data-v'); draw(); });
    on(host,'[data-act=save]','click', function(){
      var rr = E.causality(ans);
      c.causality = {answers:ans, verdict:rr.verdict, name:rr.name, why:rr.why,
                     at:Date.now(), by:(DB.session()||{}).name||''};
      saveAnd(c,'causality recorded — '+rr.name);
      render();
    });
  }
  draw();
};

/* ---------- 11 · FOLLOW-UP ---------- */
STEP_VIEWS.followup = function(host, c){
  var g = E.gaps(c);
  var h = '<div class="stack"><div class="card"><div class="hd"><h2>Follow-up</h2>'
    + '<span class="sp"><span class="badge '+(g.completeness>=80?'b-green':g.completeness>=55?'b-amber':'b-red')+'">'
    + g.completeness+'% complete</span></span></div><div class="bd">';
  h += '<div class="note '+(g.required?'warn':'ok')+'" style="margin-bottom:14px"><span class="t">'
    + (g.required?'FOLLOW-UP REQUIRED':'No essential information missing')+'</span>'
    + (g.required
       ? 'Fields that change the assessment are missing. Raise a request before this case goes for review.'
       : 'Everything that would change the assessment is present. A follow-up may still add value but is not required.')
    + '</div>';
  h += g.items.map(function(i){
    return '<div class="chk"><span class="mk '+(i.have?'y':'n')+'">'+(i.have?'✓':'✕')+'</span>'
      + '<span class="tx"><b>'+esc(i.label)+'</b>'
      + '<span class="badge '+(i.weight>=3?'b-red':i.weight===2?'b-amber':'b-grey')+'" style="margin-left:7px">'
      + (i.weight>=3?'changes the assessment':i.weight===2?'important':'useful')+'</span>'
      + '<span class="w">'+esc(i.why)+'</span></span></div>';
  }).join('');
  h += '</div></div>';

  if((c.followups||[]).length){
    h += '<div class="card"><div class="hd"><h2>Follow-up requests</h2></div><div class="bd tight">'
      + '<div class="tw"><table><thead><tr><th>Raised</th><th>Asking for</th><th>Status</th><th></th></tr></thead><tbody>'
      + c.followups.map(function(f,i){
          return '<tr><td style="white-space:nowrap">'+fmtD(f.created)+'</td>'
            + '<td>'+esc(f.items.join('; '))+'</td>'
            + '<td><span class="badge '+(f.status==='Closed'?'b-green':f.status==='Received'?'b-teal':'b-amber')+'">'
            + esc(f.status)+'</span></td>'
            + '<td class="row" style="gap:5px">'
            + ['Sent','Awaiting response','Received','Reviewed','Closed'].map(function(s){
                return '<button class="btn sec sm" data-fu="'+i+'" data-st="'+s+'">'+s+'</button>'; }).join('')
            + '</td></tr>';
        }).join('')
      + '</tbody></table></div></div></div>';
  }

  h += '<div class="row"><button class="btn" data-act="create"'+(g.missing.length?'':' disabled')+'>'
    + 'Create follow-up request</button>'
    + '<a class="btn sec" href="#case/'+c.id+'/narrative">Next: narrative →</a></div></div>';
  host.innerHTML = h;

  on(host,'[data-act=create]','click', function(){
    var items = g.missing.map(function(m){ return m.label; });
    modal('Follow-up request',
      '<p style="font-size:13px;margin-bottom:12px">A questionnaire will be raised for '
      + '<b>'+esc((c.reporter&&c.reporter.name)||'the reporter')+'</b> asking for the following. '
      + 'Ordered by what changes the assessment.</p>'
      + '<ol style="margin-left:18px;font-size:13px;line-height:1.8">'
      + g.missing.map(function(m){ return '<li><b>'+esc(m.label)+'</b><br>'
          + '<span style="color:var(--muted);font-size:12px">'+esc(m.why)+'</span></li>'; }).join('')
      + '</ol>',
      [{label:'Cancel',cls:'sec'},
       {label:'Raise request',cls:'btn',act:function(){
         var gg = DB.require('followup.request');
         if(!gg.ok){ toast('<span class="t">Not permitted</span>'+esc(gg.why),'bad'); return false; }
         c.followups = c.followups||[];
         c.followups.push({id:DB.uid('fu'), created:Date.now(), items:items, status:'Requested',
                           by:(DB.session()||{}).name||''});
         saveAnd(c,'follow-up raised for '+items.length+' item'+(items.length===1?'':'s'));
         render();
       }}]);
  });
  on(host,'[data-fu]','click', function(e,t){
    var i = +t.getAttribute('data-fu'), st = t.getAttribute('data-st');
    c.followups[i].status = st;
    saveAnd(c,'follow-up marked '+st);
    render();
  });
};

/* ---------- 12 · NARRATIVE ---------- */
STEP_VIEWS.narrative = function(host, c){
  var n = c.narrative || {};
  function draw(){
    var gen = E.narrative(c);
    host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Case narrative</h2>'
      + '<span class="sp"></span><button class="btn sm" data-act="gen">'
      + (n.draft?'Regenerate':'Generate')+'</button></div><div class="bd">'
      + '<div class="note warn" style="margin-bottom:14px"><span class="t">Generated draft — human review required</span>'
      + esc(gen.source)+'</div>'
      + field('Narrative','nText', n.draft || '', {type:'textarea',
          ph:'Press Generate to compose a draft from the structured data, then edit it.',
          hint:'You are accountable for what this says, not the generator. Check that every statement is supported by the record.'})
      + (n.accepted?'<div class="note ok" style="margin-top:12px"><span class="t">Accepted</span>'
          + 'Accepted by '+esc(n.by||'—')+' on '+fmt(n.at)+'.</div>':'')
      + '</div></div>'
      + '<div class="row"><button class="btn sec" data-act="save">Save edit</button>'
      + '<button class="btn ok" data-act="accept">Accept narrative</button>'
      + '<button class="btn sec" data-act="reject">Reject and clear</button>'
      + '<a class="btn sec" href="#case/'+c.id+'/medical">Next: medical review →</a></div></div>';

    on(host,'[data-act=gen]','click', function(){
      n.draft = gen.text; n.accepted=false;
      c.narrative = n; saveAnd(c,'narrative draft generated'); render();
    });
    on(host,'[data-act=save]','click', function(){
      n.draft = host.querySelector('#nText').value; n.accepted=false;
      c.narrative = n; saveAnd(c,'narrative edited'); render();
    });
    on(host,'[data-act=accept]','click', function(){
      var txt = host.querySelector('#nText').value.trim();
      if(!txt){ toast('<span class="t">Nothing to accept</span>Generate or write a narrative first.','bad'); return; }
      c.narrative = {draft:txt, accepted:true, at:Date.now(), by:(DB.session()||{}).name||''};
      saveAnd(c,'narrative accepted'); render();
    });
    on(host,'[data-act=reject]','click', function(){
      c.narrative = null; saveAnd(c,'narrative rejected and cleared'); render();
    });
  }
  draw();
};

/* ---------- 13 · MEDICAL REVIEW ---------- */
STEP_VIEWS.medical = function(host, c){
  var perm = DB.can('medical.review');
  var rows = [
    ['Patient information', !!(c.patient&&c.patient.age&&c.patient.sex), 'case/'+c.id+'/intake'],
    ['Drug information', (c.drugs||[]).length>0, 'case/'+c.id+'/drugs'],
    ['Event information', (c.events||[]).length>0, 'case/'+c.id+'/event'],
    ['Seriousness', !!c.seriousness, 'case/'+c.id+'/serious'],
    ['Expectedness', !!c.expectedness, 'case/'+c.id+'/expected'],
    ['Causality', !!c.causality, 'case/'+c.id+'/causality'],
    ['Narrative', !!(c.narrative&&c.narrative.accepted), 'case/'+c.id+'/narrative'],
    ['Follow-up', (c.followups||[]).length>0 || !E.gaps(c).required, 'case/'+c.id+'/followup'],
    ['Duplicate check', !!(c.duplicate&&c.duplicate.checked), 'case/'+c.id+'/dupe']
  ];
  var ready = rows.every(function(r){ return r[1]; });
  var mr = c.medicalReview||{};

  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Medical review</h2>'
    + '<span class="sp"><span class="badge '+(ready?'b-green':'b-amber')+'">'
    + (ready?'Complete':'Incomplete')+'</span></span></div><div class="bd">'
    + (perm?'':'<div class="note info" style="margin-bottom:14px"><span class="t">You are viewing this read-only</span>'
        + 'Medical review is the Medical Reviewer’s role. That separation is deliberate: the person who entered '
        + 'the case does not approve it. Switch role in <a href="#settings">Settings</a> to act here.</div>')
    + rows.map(function(r){
        return '<div class="chk"><span class="mk '+(r[1]?'y':'n')+'">'+(r[1]?'✓':'✕')+'</span>'
          + '<span class="tx"><b>'+esc(r[0])+'</b>'
          + (r[1]?'':'<span class="w">Not completed — <a href="#'+r[2]+'">go to that step</a></span>')
          + '</span></div>';
      }).join('')
    + (c.causality?'<div class="note info" style="margin-top:14px"><span class="t">Clinical summary</span>'
        + '<b>Seriousness:</b> '+esc(c.seriousness?c.seriousness.verdict:'—')+'<br>'
        + '<b>Expectedness:</b> '+esc(c.expectedness?c.expectedness.verdict:'—')+'<br>'
        + '<b>Causality:</b> '+esc(c.causality.name)+'</div>':'')
    + (mr.decision?'<div class="note '+(mr.decision==='Approved'?'ok':'warn')+'" style="margin-top:14px">'
        + '<span class="t">'+esc(mr.decision)+'</span>'+esc(mr.comments||'')
        + '<div style="margin-top:6px;font-size:11.6px">'+esc(mr.by||'')+' · '+fmt(mr.at)+'</div></div>':'')
    + '<div style="margin-top:15px">'
    + field('Reviewer comments','mComm', mr.comments||'', {type:'textarea', req:true,
        ph:'What you checked and what you concluded',
        hint:'Comments are required on every decision, including an approval. A silent approval records nothing about what was checked.'})
    + '</div></div></div>'
    + '<div class="row">'
    + '<button class="btn ok" data-mr="Approved"'+(perm?'':' disabled')+'>Approve</button>'
    + '<button class="btn warn" data-mr="Returned for correction"'+(perm?'':' disabled')+'>Return for correction</button>'
    + '<button class="btn sec" data-mr="Follow-up requested"'+(perm?'':' disabled')+'>Request follow-up</button>'
    + '<a class="btn sec" href="#case/'+c.id+'/qc">Next: quality control →</a></div></div>';

  on(host,'[data-mr]','click', function(e,t){
    var g = DB.require('medical.review');
    if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
    var comments = host.querySelector('#mComm').value.trim();
    if(!comments){ toast('<span class="t">Comments are required</span>'
      + 'Record what you checked. An approval with no comment is not a review.','bad'); return; }
    var dec = t.getAttribute('data-mr');
    c.medicalReview = {decision:dec, comments:comments, at:Date.now(), by:(DB.session()||{}).name||''};
    saveAnd(c,'medical review — '+dec);
    if(dec==='Returned for correction') DB.transition(c.id,'ASSESSMENT','Returned by medical review');
    else if(dec==='Follow-up requested') DB.transition(c.id,'FOLLOW_UP','Follow-up requested at medical review');
    render();
  });
};

/* ---------- 14 · QUALITY CONTROL ---------- */
STEP_VIEWS.qc = function(host, c){
  var perm = DB.can('qc.perform');
  var q = E.qcChecks(c);
  var saved = (c.qc && c.qc.checks) || {};
  var picks = {};
  q.list.forEach(function(x){ picks[x.k] = saved[x.k]!=null ? saved[x.k] : x.auto; });

  function draw(){
    var passed = q.list.every(function(x){ return picks[x.k]; });
    host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>Quality control</h2>'
      + '<span class="sp"><span class="badge '+(passed?'b-green':'b-amber')+'">'
      + (passed?'All checks pass':'Outstanding checks')+'</span></span></div><div class="bd">'
      + (perm?'':'<div class="note info" style="margin-bottom:14px"><span class="t">Read-only</span>'
          + 'Quality control is an independent stage, performed by the QC Officer. Switch role in '
          + '<a href="#settings">Settings</a> to act here.</div>')
      + '<div class="note info" style="margin-bottom:14px"><span class="t">The system proposes, you dispose</span>'
      + 'Each row is pre-ticked from what the record actually supports. Untick anything you are not satisfied with '
      + '— QC exists to catch what familiarity hides.</div>'
      + q.list.map(function(x){
          return '<div class="chk" style="cursor:'+(perm?'pointer':'default')+'" data-qc="'+x.k+'">'
            + '<span class="mk '+(picks[x.k]?'y':'n')+'">'+(picks[x.k]?'✓':'✕')+'</span>'
            + '<span class="tx"><b>'+esc(x.label)+'</b>'
            + '<span class="w">System check: '+(x.auto?'the record supports this':'the record does NOT support this')+'</span>'
            + '</span></div>';
        }).join('')
      + '<div style="margin-top:15px">'
      + field('QC comments','qComm', (c.qc&&c.qc.comments)||'', {type:'textarea',
          ph:'What failed, or confirmation that nothing did'})
      + '</div>'
      + ((c.qc&&c.qc.decision)?'<div class="note '+(c.qc.decision==='QC PASSED'?'ok':'bad')+'">'
          + '<span class="t">'+esc(c.qc.decision)+'</span>'+esc(c.qc.comments||'')
          + '<div style="margin-top:6px;font-size:11.6px">'+esc(c.qc.by||'')+' · '+fmt(c.qc.at)+'</div></div>':'')
      + '</div></div>'
      + '<div class="row"><button class="btn ok" data-dec="QC PASSED"'+(perm?'':' disabled')+'>QC passed</button>'
      + '<button class="btn dgr" data-dec="QC FAILED"'+(perm?'':' disabled')+'>QC failed</button>'
      + '<a class="btn sec" href="#case/'+c.id+'/icsr">Next: ICSR →</a></div></div>';

    on(host,'[data-qc]','click', function(e,t){
      if(!perm) return;
      var k = t.getAttribute('data-qc'); picks[k] = !picks[k]; draw();
    });
    on(host,'[data-dec]','click', function(e,t){
      var g = DB.require('qc.perform');
      if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
      var dec = t.getAttribute('data-dec');
      var comments = host.querySelector('#qComm').value.trim();
      if(dec==='QC FAILED' && !comments){
        toast('<span class="t">Comments are required to fail QC</span>'
          + 'The person correcting the case needs to know what failed.','bad'); return; }
      c.qc = {checks:picks, decision:dec, comments:comments, at:Date.now(), by:(DB.session()||{}).name||''};
      saveAnd(c,'quality control — '+dec);
      if(dec==='QC FAILED') DB.transition(c.id,'ASSESSMENT','Returned by QC');
      render();
    });
  }
  draw();
};

/* ---------- 15 · ICSR ---------- */
STEP_VIEWS.icsr = function(host, c){
  var ic = E.icsr(c);
  var reg = c.regulatory || {icsrStatus:null};
  var idx = ic.flow.indexOf(reg.icsrStatus);

  host.innerHTML = '<div class="stack"><div class="card"><div class="hd"><h2>ICSR — simulated reporting</h2>'
    + '<span class="sp"><span class="badge '+(ic.valid?'b-green':'b-red')+'">'
    + (ic.valid?'Valid':'Not valid')+'</span></span></div><div class="bd">'
    + '<div class="note warn" style="margin-bottom:15px"><span class="t">Simulation</span>'+esc(ic.note)+'</div>'
    + (!ic.valid?'<div class="note bad" style="margin-bottom:15px"><span class="t">Cannot be generated</span>'
        + 'Missing minimum elements: '+ic.missing.map(function(m){ return esc(m.label); }).join(', ')
        + '. <a href="#case/'+c.id+'/validity">Run the validity check</a>.</div>':'')
    + '<div class="tw"><table><tbody>'
    + ic.fields.map(function(f){
        return '<tr><td style="color:var(--muted);font-weight:600;width:34%">'+esc(f[0])+'</td>'
          + '<td>'+esc(f[1])+'</td></tr>'; }).join('')
    + '</tbody></table></div>'
    + '<div style="margin-top:18px"><div style="font-size:11px;font-weight:700;letter-spacing:.07em;'
    + 'text-transform:uppercase;color:var(--muted);margin-bottom:9px">Submission status</div>'
    + '<div class="pipe">'+ic.flow.map(function(f,i){
        return '<div class="st'+(i<=idx?' hot':'')+'"><div class="bx"><div class="n" style="font-size:15px">'
          + (i<=idx?'✓':'·')+'</div><div class="l">'+esc(f)+'</div></div><span class="ar">›</span></div>';
      }).join('')+'</div></div>'
    + '</div></div>'
    + '<div class="row">'
    + ic.flow.map(function(f,i){
        return '<button class="btn '+(i===idx+1?'':'sec')+' sm" data-icsr="'+esc(f)+'"'
          + (ic.valid?'':' disabled')+'>'+esc(f)+'</button>'; }).join('')
    + '</div>'
    + '<div class="row"><a class="btn sec" href="#case/'+c.id+'/close">Next: closure →</a></div></div>';

  on(host,'[data-icsr]','click', function(e,t){
    var st = t.getAttribute('data-icsr');
    c.regulatory = {icsrStatus:st, at:Date.now(), by:(DB.session()||{}).name||''};
    saveAnd(c,'ICSR status — '+st);
    render();
  });
};

/* ---------- 16 · CLOSURE + SCORE ---------- */
STEP_VIEWS.close = function(host, c){
  var sc = E.score(c);
  var h = '<div class="stack">';

  if(c.status!=='CLOSED'){
    h += '<div class="card"><div class="hd"><h2>Close the case</h2></div><div class="bd">'
      + '<p style="font-size:13px;line-height:1.65;margin-bottom:14px">A closed case counts in analytics and feeds '
      + 'signal detection. That is what the whole process was for. Closing is the PV Manager’s decision.</p>'
      + field('Closure reason','clReason','',{type:'select', blank:false,
          options:['Case complete and reported','Duplicate of another case','Invalid — minimum elements never obtained','No further follow-up possible']})
      + '<button class="btn ok" data-act="close">Close case</button></div></div>';
  } else {
    h += '<div class="note ok"><span class="t">Case closed</span>'
      + esc((c.closure&&c.closure.reason)||'') + ' · ' + fmt((c.closure&&c.closure.at)||c.updated)+'</div>';
  }

  if(sc){
    h += '<div class="card"><div class="hd"><h2>Case score</h2>'
      + '<span class="sp"><span class="badge '+(sc.pct>=70?'b-green':sc.pct>=50?'b-amber':'b-red')+'">'
      + sc.got+' / '+sc.max+' · '+esc(sc.band)+'</span></span></div><div class="bd tight">'
      + '<div class="tw"><table><thead><tr><th>Element</th><th style="width:90px">Score</th><th>Comment</th></tr></thead><tbody>'
      + sc.rows.map(function(r){
          return '<tr><td><b>'+esc(r.label)+'</b></td>'
            + '<td style="font-variant-numeric:tabular-nums;color:'+(r.ok?'var(--green)':'var(--red)')+';font-weight:700">'
            + r.pts+' / '+r.of+'</td><td style="font-size:12.5px">'+esc(r.note)+'</td></tr>';
        }).join('')
      + '<tr style="background:var(--panel-2)"><td><b>Total</b></td>'
      + '<td style="font-weight:800">'+sc.got+' / '+sc.max+'</td><td><b>'+esc(sc.band)+'</b></td></tr>'
      + '</tbody></table></div></div></div>';
    if(sc.improve.length){
      h += '<div class="card"><div class="hd"><h2>Areas to improve</h2></div><div class="bd">'
        + sc.improve.map(function(r){
            return '<div class="chk"><span class="mk n">✕</span><span class="tx"><b>'+esc(r.label)+'</b>'
              + '<span class="w">'+esc(r.note)+'</span></span></div>'; }).join('')
        + '</div></div>';
    }
    if(c.status==='CLOSED')
      h += '<div class="note info"><span class="t">Debrief — what this case was teaching</span>'+esc(sc.teaching)+'</div>';
  }
  h += '</div>';
  host.innerHTML = h;

  on(host,'[data-act=close]','click', function(){
    var g = DB.require('case.close');
    if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
    var reason = val(host,'clReason');
    var r = DB.transition(c.id,'CLOSED', reason);
    if(r.error){ toast('<span class="t">Cannot close yet</span>'+esc(r.error),'bad'); return; }
    c = DB.case(c.id);
    c.closure = {at:Date.now(), by:(DB.session()||{}).name||'', reason:reason};
    if(sc) c.score = {pct:sc.pct, got:sc.got, max:sc.max, band:sc.band};
    DB.saveCase(c);
    toast('<span class="t">Case closed</span>It now counts in analytics and feeds signal detection.');
    render();
  });
};

/* ================================================================== *
 * WORK QUEUES (sidebar shortcuts into the case workspace)             *
 * ================================================================== */
function queue(v, statusList, heading, blurb, step){
  var list = DB.cases().filter(function(c){ return statusList.indexOf(c.status)>=0; });
  title(heading, list.length+' case'+(list.length===1?'':'s'));
  v.innerHTML = '<div class="stack"><div class="note info">'+blurb+'</div>'
    + '<div class="card"><div class="hd"><h2>'+esc(heading)+'</h2></div>'
    + (list.length ? caseTable(list)
      : '<div class="empty"><div class="ic">✓</div><h3>Queue is empty</h3>'
        + '<p>No case is at this stage right now.</p></div>')
    + '</div></div>';
  on(v,'[data-case]','click', function(e,t){ go('case/'+t.getAttribute('data-case')+(step?'/'+step:'')); });
}
VIEWS.medical = function(v){ queue(v,['MEDICAL_REVIEW'],'Medical review',
  'Cases where a clinician must check the clinical content before they go further. The reviewer is not the person who entered the case — that separation is the control.','medical'); };
VIEWS.qc = function(v){ queue(v,['QC'],'Quality control',
  'An independent check against the record before the case is used for anything. QC can and should fail cases.','qc'); };
VIEWS.assessment = function(v){ queue(v,['ASSESSMENT','VALIDATED','DATA_ENTRY'],'Assessment',
  'Cases at the assessment stage: seriousness, expectedness, causality and the duplicate check.','serious'); };
VIEWS.followup = function(v){ queue(v,['FOLLOW_UP'],'Follow-up',
  'Cases waiting on information. Most reports arrive incomplete; this is where a weak case becomes a usable one.','followup'); };
VIEWS.narrative = function(v){ queue(v,['ASSESSMENT','MEDICAL_REVIEW','QC'],'Narrative',
  'Cases ready for a narrative. The narrative is what a reader who never sees the form will actually read.','narrative'); };
VIEWS.regulatory = function(v){ queue(v,['REPORTING_SIMULATION','QC'],'Regulatory reporting',
  'Cases ready for the simulated ICSR. Nothing leaves this browser and no regulatory system is contacted.','icsr'); };
VIEWS.intake = function(v){
  title('Safety intake','New reports');
  var drafts = DB.cases().filter(function(c){ return ['DRAFT','SUBMITTED','TRIAGE'].indexOf(c.status)>=0; });
  v.innerHTML = '<div class="stack">'
    + '<div class="card"><div class="bd" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">'
    + '<div style="flex:1;min-width:250px"><h2 style="font-size:16px;font-weight:700;margin-bottom:4px">Create a new safety case</h2>'
    + '<p style="font-size:13px;color:var(--muted)">The case number is generated by the system. It is not '
    + 'something a user picks — numbering has to be reliable for a database to be auditable.</p></div>'
    + '<button class="btn lg" data-act="new">+ Create new safety case</button></div></div>'
    + '<div class="card"><div class="hd"><h2>Awaiting processing</h2></div>'
    + (drafts.length?caseTable(drafts)
       :'<div class="empty"><div class="ic">✉</div><h3>Nothing waiting</h3><p>No case is in draft, submitted or triage.</p></div>')
    + '</div></div>';
  on(v,'[data-act=new]','click', newCaseDialog);
  wireCaseTable(v);
};
VIEWS.coding = function(v){
  title('Coding','Drug and reaction terminology');
  var q = '';
  function draw(){
    var hits = q ? E.searchTerms(q) : [];
    v.innerHTML = '<div class="stack">'
      + '<div class="note info"><span class="t">Synthetic training dictionary</span>'
      + 'A MedDRA-shaped hierarchy — lowest level term, preferred term, high level term, system organ class — '
      + 'built for teaching. It contains no MedDRA content and its codes are prefixed SYN-. '
      + D.TERMS.length+' preferred terms across '+D.SOCS.length+' system organ classes.</div>'
      + '<div class="card"><div class="hd"><h2>Terminology search</h2></div><div class="bd">'
      + '<div class="fld"><label>Search by reported wording</label><input id="tq" value="'+esc(q)+'" '
      + 'placeholder="e.g. black tarry stools, yellow eyes, sugar dropped"></div>'
      + '<button class="btn sm" data-act="s">Search</button>'
      + (hits.length?'<div style="margin-top:15px">'+hits.map(function(x){
          return '<div class="card" style="margin-bottom:9px"><div class="bd">'
            + '<div class="row" style="margin-bottom:6px"><b>'+esc(x.term.pt)+'</b>'
            + '<span class="badge b-grey">'+esc(x.term.code)+'</span>'
            + (x.term.serious?'<span class="badge b-red">Usually serious</span>':'')+'</div>'
            + '<div style="font-size:12.4px;color:var(--muted);line-height:1.7">'
            + esc(x.llt)+' (LLT) → <b style="color:var(--ink)">'+esc(x.term.pt)+'</b> (PT) → '
            + esc(x.term.hlt)+' (HLT) → '+esc(x.socName)+' (SOC)</div></div></div>';
        }).join('')+'</div>':(q?'<div class="note warn" style="margin-top:14px">Nothing matched. Try plainer wording.</div>':''))
      + '</div></div>'
      + '<div class="card"><div class="hd"><h2>Product dictionary</h2></div><div class="bd tight"><div class="tw">'
      + '<table><thead><tr><th>Generic</th><th>Class</th><th>Brands (fictional)</th><th>Strengths</th><th>Routes</th><th>ATC</th></tr></thead><tbody>'
      + D.products().map(function(p){
          return '<tr><td><b>'+esc(p.generic)+'</b></td><td>'+esc(p.cls)+'</td>'
            + '<td>'+esc(p.brands.join(', ')||'—')+'</td><td>'+esc(p.strengths.join(', ')||'—')+'</td>'
            + '<td>'+esc(p.routes.join(', '))+'</td><td>'+esc(p.atc)+'</td></tr>'; }).join('')
      + '</tbody></table></div></div></div></div>';
    on(v,'[data-act=s]','click', function(){ q = v.querySelector('#tq').value; draw(); });
    v.querySelector('#tq').addEventListener('keydown', function(e){
      if(e.key==='Enter'){ q = v.querySelector('#tq').value; draw(); } });
  }
  draw();
};

/* ================================================================== *
 * SIGNAL MANAGEMENT                                                   *
 * ================================================================== */
var SIG_STAGES = ['Signal detection','Signal validation','Signal prioritisation','Signal assessment','Action','Monitoring'];

VIEWS.signals = function(v, args){
  if(args[0]) return signalDetail(v, args[0]);
  title('Signal management','From accumulated cases to a decision');
  var sigs = DB.signals();
  var detected = E.detectSignals(DB.cases());
  var counts = {OPEN:0, UNDER_ASSESSMENT:0, MONITORING:0, CLOSED:0};
  sigs.forEach(function(s){ counts[s.status] = (counts[s.status]||0)+1; });

  v.innerHTML = '<div class="stack">'
    + '<div class="grid g4">'
    + [['Open signals',counts.OPEN,'acc-red'],['Under assessment',counts.UNDER_ASSESSMENT,'acc-amber'],
       ['Monitoring',counts.MONITORING,'acc-teal'],['Closed',counts.CLOSED,'acc-green']]
      .map(function(s){ return '<div class="stat '+s[2]+'"><div class="lb">'+s[0]+'</div><div class="vl">'+s[1]+'</div></div>'; }).join('')
    + '</div>'
    + '<div class="card"><div class="hd"><h2>Signal register</h2></div><div class="bd tight"><div class="tw">'
    + '<table><thead><tr><th>Reference</th><th>Drug</th><th>Reaction</th><th>Cases</th><th>Stage</th><th>Status</th></tr></thead><tbody>'
    + sigs.map(function(s){
        return '<tr class="clk" data-sig="'+s.id+'"><td><b>'+esc(s.no)+'</b></td>'
          + '<td>'+esc((LD.DRUGS[s.drug]||{}).generic||s.drug)+'</td><td>'+esc(s.event)+'</td>'
          + '<td><b>'+s.count+'</b></td><td>'+esc(s.stage||'—')+'</td>'
          + '<td><span class="badge '+(s.status==='OPEN'?'b-red':s.status==='UNDER_ASSESSMENT'?'b-amber':
              s.status==='MONITORING'?'b-teal':'b-green')+'">'+esc(s.status.replace(/_/g,' '))+'</span></td></tr>';
      }).join('')
    + '</tbody></table></div></div></div>'

    + '<div class="card"><div class="hd"><h2>Detected from your closed cases</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Recomputed from the case database</span></div><div class="bd">'
    + '<div class="note info" style="margin-bottom:14px"><span class="t">The biggest number is not the signal</span>'
    + 'Candidates are ranked by seriousness and by whether the reaction is unlisted, not by count alone. '
    + 'Fifteen reports of expected nausea matter less than three of unlisted liver injury.</div>'
    + (detected.length
       ? '<div class="tw"><table><thead><tr><th>Drug</th><th>Reaction</th><th>Cases</th><th>Serious</th><th>Unexpected</th><th>Assessment</th><th></th></tr></thead><tbody>'
         + detected.map(function(d,i){
             return '<tr><td>'+esc(d.drug)+'</td><td>'+esc(d.event)+'</td><td><b>'+d.count+'</b></td>'
               + '<td>'+d.serious+'</td><td>'+d.unexpected+'</td>'
               + '<td style="font-size:12.4px">'+esc(d.why)+'</td>'
               + '<td>'+(d.candidate?'<button class="btn sm" data-open="'+i+'">Open signal</button>':'')+'</td></tr>';
           }).join('')
         + '</tbody></table></div>'
       : '<div class="empty"><div class="ic">⚠</div><h3>No candidates yet</h3>'
         + '<p>Close some cases and they are aggregated here by drug and coded reaction.</p></div>')
    + '</div></div></div>';

  on(v,'[data-sig]','click', function(e,t){ go('signals/'+t.getAttribute('data-sig')); });
  on(v,'[data-open]','click', function(e,t){
    var g = DB.require('signal.manage');
    if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
    var d = detected[+t.getAttribute('data-open')];
    var s = DB.saveSignal({drug:d.drug, event:d.event, count:d.count, status:'OPEN',
      stage:'Signal detection', note:d.why, opened:new Date().toISOString().slice(0,10), notes:[]});
    toast('<span class="t">Signal '+esc(s.no)+' opened</span>'+esc(d.drug)+' / '+esc(d.event));
    render();
  });
};

function signalDetail(v, id){
  var s = DB.signals().filter(function(x){ return x.id===id; })[0];
  if(!s){ v.innerHTML = '<div class="note bad">Signal not found. <a href="#signals">Back</a></div>'; return; }
  title(s.no, (LD.DRUGS[s.drug]||{}).generic || s.drug);
  var i = SIG_STAGES.indexOf(s.stage);
  v.innerHTML = '<div class="stack">'
    + '<div class="card"><div class="bd">'
    + '<div class="kv"><div class="k">Drug</div><div><b>'+esc((LD.DRUGS[s.drug]||{}).generic||s.drug)+'</b></div>'
    + '<div class="k">Reaction</div><div>'+esc(s.event)+'</div>'
    + '<div class="k">Cases</div><div>'+s.count+'</div>'
    + '<div class="k">Opened</div><div>'+esc(s.opened||fmtD(s.created))+'</div>'
    + '<div class="k">Status</div><div>'+esc(s.status.replace(/_/g,' '))+'</div></div>'
    + (s.note?'<div class="note info" style="margin-top:14px">'+esc(s.note)+'</div>':'')
    + '</div></div>'
    + '<div class="card"><div class="hd"><h2>Signal lifecycle</h2></div><div class="bd">'
    + '<div class="pipe">'+SIG_STAGES.map(function(st,k){
        return '<div class="st'+(k<=i?' hot':'')+'"><div class="bx"><div class="n" style="font-size:15px">'
          + (k<=i?'✓':'·')+'</div><div class="l">'+esc(st)+'</div></div><span class="ar">›</span></div>';
      }).join('')+'</div>'
    + '<div class="row" style="margin-top:15px">'
    + SIG_STAGES.map(function(st){
        return '<button class="btn '+(st===s.stage?'nav':'sec')+' sm" data-stage="'+esc(st)+'">'+esc(st)+'</button>'; }).join('')
    + '</div>'
    + '<div class="row" style="margin-top:12px">'
    + ['OPEN','UNDER_ASSESSMENT','MONITORING','CLOSED'].map(function(st){
        return '<button class="btn '+(st===s.status?'nav':'sec')+' sm" data-status="'+st+'">'+st.replace(/_/g,' ')+'</button>'; }).join('')
    + '</div></div></div>'
    + '<div class="card"><div class="hd"><h2>Assessment notes</h2></div><div class="bd">'
    + ((s.notes||[]).length?(s.notes||[]).map(function(n){
        return '<div class="note info" style="margin-bottom:9px"><span class="t">'+esc(n.by)+' · '+fmt(n.at)+'</span>'
          + esc(n.text)+'</div>'; }).join(''):'<p style="font-size:13px;color:var(--muted)">No notes yet.</p>')
    + '<div style="margin-top:14px">'+field('Add a note','sgNote','',{type:'textarea'})+'</div>'
    + '<button class="btn sm" data-act="note">Add note</button></div></div>'
    + '<a class="btn sec" href="#signals">← Signal register</a></div>';

  function guard(){
    var g = DB.require('signal.manage');
    if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return false; }
    return true;
  }
  on(v,'[data-stage]','click', function(e,t){
    if(!guard()) return;
    s.stage = t.getAttribute('data-stage'); DB.saveSignal(s); render(); });
  on(v,'[data-status]','click', function(e,t){
    if(!guard()) return;
    s.status = t.getAttribute('data-status'); DB.saveSignal(s); render(); });
  on(v,'[data-act=note]','click', function(){
    if(!guard()) return;
    var txt = v.querySelector('#sgNote').value.trim();
    if(!txt) return;
    s.notes = s.notes||[];
    s.notes.push({at:Date.now(), by:(DB.session()||{}).name||'', text:txt});
    DB.saveSignal(s); render();
  });
}

/* ================================================================== *
 * LITERATURE                                                          *
 * ================================================================== */
VIEWS.literature = function(v){
  title('Literature monitoring','Training records only');
  var lits = DB.literature();
  var q = '';
  function draw(){
    var list = q ? lits.filter(function(l){
      return (l.title+' '+l.journal+' '+l.authors+' '+l.drug+' '+l.event+' '+l.year)
        .toLowerCase().indexOf(q.toLowerCase())>=0; }) : lits;
    v.innerHTML = '<div class="stack">'
      + '<div class="note info"><span class="t">A fictional literature set</span>'
      + 'Six records, one of them deliberately irrelevant — a real screen returns hits that do not matter, and '
      + 'deciding something is <i>not</i> relevant is part of the work.</div>'
      + '<div class="card"><div class="hd"><h2>Search</h2></div><div class="bd">'
      + '<div class="fld"><label>Drug, adverse event, author or year</label>'
      + '<input id="lq" value="'+esc(q)+'" placeholder="e.g. hypoglycaemia, 2026, Nair"></div>'
      + '<button class="btn sm" data-act="s">Search</button></div></div>'
      + list.map(function(l){
          return '<div class="card"><div class="bd">'
            + '<div class="row" style="margin-bottom:6px"><b style="font-size:14px">'+esc(l.title)+'</b>'
            + '<span class="badge '+(l.relevance==='High'?'b-red':l.relevance==='Medium'?'b-amber':'b-grey')+'">'
            + esc(l.relevance)+' relevance</span>'
            + (l.decision?'<span class="badge b-teal">'+esc(l.decision)+'</span>':'')+'</div>'
            + '<div style="font-size:12.4px;color:var(--muted);margin-bottom:8px">'+esc(l.authors)+' · '
            + esc(l.journal)+' · '+l.year+'</div>'
            + '<div style="font-size:13px;line-height:1.6;margin-bottom:11px">'+esc(l.abstract)+'</div>'
            + '<div class="row">'
            + '<button class="btn sm" data-lit="Relevant" data-id="'+l.id+'">Relevant</button>'
            + '<button class="btn sec sm" data-lit="Not relevant" data-id="'+l.id+'">Not relevant</button>'
            + '<button class="btn sec sm" data-lit="Needs review" data-id="'+l.id+'">Needs review</button>'
            + (l.decision==='Relevant' && l.drug
               ? '<button class="btn warn sm" data-mkcase="'+l.id+'">Create safety case from this article</button>':'')
            + '</div></div></div>';
        }).join('')
      + '</div>';
    on(v,'[data-act=s]','click', function(){ q = v.querySelector('#lq').value; draw(); });
    v.querySelector('#lq').addEventListener('keydown', function(e){
      if(e.key==='Enter'){ q = v.querySelector('#lq').value; draw(); } });
    on(v,'[data-lit]','click', function(e,t){
      var l = lits.filter(function(x){ return x.id===t.getAttribute('data-id'); })[0];
      l.decision = t.getAttribute('data-lit'); l.reviewed = true;
      DB.saveLit(l); toast('<span class="t">Recorded</span>'+esc(l.title.slice(0,60))+' — '+esc(l.decision));
      draw();
    });
    on(v,'[data-mkcase]','click', function(e,t){
      var l = lits.filter(function(x){ return x.id===t.getAttribute('data-mkcase'); })[0];
      var c = DB.createCase({});
      if(c.error){ toast('<span class="t">Not permitted</span>'+esc(c.error),'bad'); return; }
      c.reporter = Object.assign({}, c.reporter, {type:'Healthcare professional', source:'Literature',
        name:l.authors, institution:l.journal+' '+l.year, country:'—',
        reportDate:new Date().toISOString().slice(0,10)});
      var card = (LD.DRUGS||{})[l.drug]||{};
      c.drugs = [{id:DB.uid('drg'), category:'Suspect', key:l.drug, generic:card.generic||l.drug}];
      c.events = [{id:DB.uid('evt'), reported:l.event, description:l.abstract, coded:null}];
      DB.saveCase(c);
      DB.audit('case.fromLiterature','case',c.id,'Case created from literature article '+l.id);
      toast('<span class="t">'+esc(c.caseNo)+' created from literature</span>Reporter is the article.');
      setTimeout(function(){ go('case/'+c.id); },60);
    });
  }
  draw();
};

/* ================================================================== *
 * ANALYTICS                                                           *
 * ================================================================== */
function bars(rows, max){
  if(!rows.length) return '<p style="font-size:12.5px;color:var(--muted)">No data yet.</p>';
  var top = Math.max.apply(null, rows.map(function(r){ return r.n; }));
  return '<div class="bars">'+rows.slice(0, max||8).map(function(r){
    return '<div class="b"><div class="l" title="'+esc(r.k)+'">'+esc(r.k)+'</div>'
      + '<div class="t"><i style="width:'+Math.round(r.n*100/top)+'%"></i></div>'
      + '<div class="n">'+r.n+'</div></div>'; }).join('')+'</div>';
}
VIEWS.analytics = function(v){
  title('Analytics','Across '+DB.cases().length+' cases');
  var a = E.analytics(DB.cases());
  if(!a.total){
    v.innerHTML = '<div class="empty"><div class="ic">◩</div><h3>Nothing to analyse yet</h3>'
      + '<p>Create and work some cases and they appear here broken down by drug, reaction, seriousness, age, sex, reporter and outcome.</p>'
      + '<a class="btn" href="#intake">Create a case</a></div>';
    return;
  }
  var panels = [
    ['Cases by suspect drug', a.byDrug], ['Cases by reaction', a.byEvent],
    ['Cases by system organ class', a.bySoc], ['Serious vs non-serious', a.bySerious],
    ['Cases by age band', a.byAge], ['Cases by sex', a.bySex],
    ['Cases by reporter type', a.byReporter], ['Cases by source', a.bySource],
    ['Cases by outcome', a.byOutcome], ['Cases by workflow status', a.byStatus],
    ['Cases by country', a.byCountry], ['Cases by month', a.byMonth]
  ];
  v.innerHTML = '<div class="stack"><div class="grid g2">'
    + panels.map(function(p){
        return '<div class="card"><div class="hd"><h2>'+esc(p[0])+'</h2></div><div class="bd">'+bars(p[1])+'</div></div>';
      }).join('')
    + '</div></div>';
};

/* ================================================================== *
 * AUDIT TRAIL                                                         *
 * ================================================================== */
VIEWS.audit = function(v){
  title('Audit trail','Append-only record of every action');
  var rows = DB.auditLog();
  v.innerHTML = '<div class="stack">'
    + '<div class="note info"><span class="t">This log cannot be edited</span>'
    + 'There is no update or delete for an audit entry anywhere in the application, and no user role carries a '
    + 'permission to change one. An audit trail a user can amend is worse than none, because it looks like evidence.</div>'
    + '<div class="card"><div class="hd"><h2>Recent activity</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">'+rows.length+' entries</span></div>'
    + '<div class="bd tight"><div class="tw"><table><thead><tr>'
    + '<th>When</th><th>User</th><th>Role</th><th>Action</th><th>Detail</th></tr></thead><tbody>'
    + rows.slice(0,200).map(function(r){
        return '<tr><td style="white-space:nowrap;color:var(--muted)">'+fmt(r.at)+'</td>'
          + '<td><b>'+esc(r.user)+'</b></td>'
          + '<td><span class="badge b-grey">'+esc(DB.roleName(r.role))+'</span></td>'
          + '<td style="font-family:ui-monospace,monospace;font-size:11.8px">'+esc(r.action)+'</td>'
          + '<td>'+esc(r.detail)+'</td></tr>'; }).join('')
    + '</tbody></table></div></div></div></div>';
};

/* ================================================================== *
 * TRAINING CENTRE                                                     *
 * ================================================================== */
var MODULES = [
 {k:'whatis', t:'What is pharmacovigilance?', body:'The science and activities relating to the detection, assessment, understanding and prevention of adverse effects or any other medicine-related problem. Note how wide that is: it takes in medication errors, poor-quality medicines, misuse, overdose and treatment failure, not only side effects.'},
 {k:'adr',    t:'What is an ADR?', body:'A response to a medicine which is noxious and unintended. In practice you are reporting a SUSPECTED reaction — the threshold for reporting is suspicion, never proof, and causality is assessed afterwards by people with the whole database in front of them.'},
 {k:'icsr',   t:'What is an ICSR?', body:'An Individual Case Safety Report: the structured record of one patient, one or more suspect medicines and one or more reactions, from one reporter. It is the unit the entire global system is built out of.'},
 {k:'valid',  t:'Case validity', body:'Four minimum elements: an identifiable patient, an identifiable reporter, a suspect product and an adverse event. Miss one and it is an enquiry, not a case. None of the four is about proving the drug did it.'},
 {k:'serious',t:'Seriousness', body:'Six outcome criteria: death, life-threatening, hospitalisation or its prolongation, persistent or significant disability, congenital anomaly, and other medically important condition. Seriousness sets the reporting timeline. Severity — mild, moderate, severe — is a different question in a different field.'},
 {k:'expect', t:'Expectedness', body:'Whether the reaction is already listed in the reference safety information for that product. Expected does not mean unimportant; unexpected and serious is what signal detection is looking for.'},
 {k:'causal', t:'Causality', body:'How confident you can be that the drug did it. Four questions underlie every formal scale: time relationship, dechallenge, alternative causes, and whether the reaction is recognised. WHO-UMC gives categories; Naranjo gives a number.'},
 {k:'coding', t:'Reaction coding', body:'The patient’s words are not the coded term, and both belong in the report. The hierarchy runs lowest level term, preferred term, high level term, system organ class. The term you pick decides what the database can find.'},
 {k:'drugcode',t:'Drug coding', body:'A reported brand has to resolve to an active ingredient, strength, form and route before a case can be compared with any other. A brand name may not even identify the same molecule in another country.'},
 {k:'dupe',   t:'Duplicate detection', body:'The same patient reported twice double-counts them in every calculation that follows. Compare patient, drug, reaction and dates — and read both cases before merging, because a wrongly merged report cannot be recovered.'},
 {k:'fu',     t:'Follow-up', body:'Most reports arrive incomplete. Chase the fields that change the assessment: onset date, dechallenge, outcome, concomitant medication, objective evidence. Not more personal data — that is the one category where less is better.'},
 {k:'narr',   t:'Narrative writing', body:'A short account in plain clinical prose, in time order: who the patient was, what they took, what happened, when, what was done, and how it ended. Everything in it must be supported by the structured record.'},
 {k:'signal', t:'Signal detection', body:'Information suggesting a new potentially causal association, or a new aspect of a known one, likely enough to justify verificatory action. The biggest count is not the signal — seriousness, expectedness and plausibility decide it.'},
 {k:'reg',    t:'Regulatory reporting', body:'Serious cases are expedited, normally within 15 calendar days of first receipt of the minimum information. The clock starts when the report arrives, not when the investigation is finished — so you submit what you have and follow up afterwards.'}
];

VIEWS.training = function(v){
  title('Training centre','Modules and the case library');
  v.innerHTML = '<div class="stack">'
    + '<div class="card"><div class="hd"><h2>Learning modules</h2></div><div class="bd"><div class="grid g2">'
    + MODULES.map(function(m){
        return '<div style="border:1px solid var(--line);border-radius:8px;padding:13px 15px">'
          + '<b style="font-size:13.5px">'+esc(m.t)+'</b>'
          + '<p style="font-size:12.6px;color:var(--muted);line-height:1.62;margin-top:6px">'+esc(m.body)+'</p></div>';
      }).join('')
    + '</div></div></div>'
    + '<div class="card"><div class="hd"><h2>Practical case library</h2>'
    + '<span class="sp" style="font-size:11.5px;color:var(--muted)">Each has a hidden answer key and is scored on closure</span></div>'
    + '<div class="bd tight"><div class="tw"><table><thead><tr>'
    + '<th>Case</th><th>Title</th><th>Level</th><th>The report as it arrived</th><th></th></tr></thead><tbody>'
    + D.TRAINING.map(function(t){
        var done = DB.cases().filter(function(c){ return c.trainingCaseId===t.id && c.status==='CLOSED'; })[0];
        return '<tr><td><b>'+esc(t.id)+'</b></td><td>'+esc(t.title)+'</td>'
          + '<td><span class="badge '+(t.level>=4?'b-red':t.level>=3?'b-amber':'b-grey')+'">Level '+t.level+'</span></td>'
          + '<td style="font-size:12.4px">'+esc(t.brief)+'</td>'
          + '<td style="white-space:nowrap">'
          + (done?'<span class="badge b-green">'+(done.score?done.score.pct+'%':'done')+'</span> ':'')
          + '<button class="btn sm" data-tc="'+t.id+'">Work this case</button></td></tr>';
      }).join('')
    + '</tbody></table></div></div></div></div>';
  on(v,'[data-tc]','click', function(e,t){
    var g = DB.require('case.create');
    if(!g.ok){ toast('<span class="t">Not permitted</span>'+esc(g.why),'bad'); return; }
    var id = t.getAttribute('data-tc');
    var c = DB.createCase({trainingCaseId:id, guided:true});
    prefill(c, id);
    toast('<span class="t">'+esc(c.caseNo)+' created</span>Pre-filled from '+esc(id)+'.');
    setTimeout(function(){ go('case/'+c.id+'/intake'); },60);
  });
};

/* ================================================================== *
 * SETTINGS — role switching, reference data, reset                    *
 * ================================================================== */
VIEWS.settings = function(v){
  title('Settings','Users, roles and system');
  var me = DB.session();
  v.innerHTML = '<div class="stack">'
    + '<div class="card"><div class="hd"><h2>Who are you?</h2></div><div class="bd">'
    + '<div class="note info" style="margin-bottom:15px"><span class="t">No passwords, on purpose</span>'
    + 'This is a training simulator on a public page. A fake password box would teach the wrong lesson about '
    + 'authentication. You pick a role and the system enforces that role’s permissions honestly — including '
    + 'refusing you, with the reason.</div>'
    + '<div class="grid g2">'
    + DB.users().map(function(u){
        var r = DB.roleOf(u);
        var on_ = me && me.id===u.id;
        return '<div style="border:2px solid '+(on_?r.colour:'var(--line)')+';border-radius:9px;padding:13px 15px;cursor:pointer" data-user="'+u.id+'">'
          + '<div class="row" style="margin-bottom:6px">'
          + '<span class="av" style="background:'+r.colour+';width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:800">'
          + initials(u.name)+'</span>'
          + '<div><b style="font-size:13.4px">'+esc(u.name)+'</b><br>'
          + '<span style="font-size:11.6px;color:var(--muted)">'+esc(r.name)+'</span></div>'
          + (on_?'<span class="badge b-green" style="margin-left:auto">Signed in</span>':'')+'</div>'
          + '<p style="font-size:12.2px;color:var(--muted);line-height:1.55">'+esc(r.blurb)+'</p></div>';
      }).join('')
    + '</div></div></div>'

    + (me?'<div class="card"><div class="hd"><h2>What '+esc(DB.roleOf(me).name)+' can do</h2></div><div class="bd">'
      + '<div class="row" style="gap:6px">'
      + DB.roleOf(me).can.map(function(p){ return '<span class="badge b-teal">'+esc(p)+'</span>'; }).join('')
      + '</div><p style="font-size:12.4px;color:var(--muted);margin-top:12px;line-height:1.6">'
      + 'Permissions are checked when the action runs, not only when the button is drawn. Hiding a control is a '
      + 'courtesy; refusing the write is the control.</p>'
      + '<button class="btn sec sm" style="margin-top:12px" data-act="out">Sign out</button></div></div>':'')

    + '<div class="card"><div class="hd"><h2>Reference data</h2></div><div class="bd">'
    + '<div class="kv">'
    + '<div class="k">Products</div><div>'+D.products().length+' in the training dictionary</div>'
    + '<div class="k">Terminology</div><div>'+D.TERMS.length+' preferred terms across '+D.SOCS.length+' system organ classes (synthetic, MedDRA-shaped)</div>'
    + '<div class="k">Reference safety info</div><div>'+Object.keys(D.RSI).length+' fictional core data sheets</div>'
    + '<div class="k">Training cases</div><div>'+D.TRAINING.length+' with hidden answer keys</div>'
    + '<div class="k">Literature</div><div>'+D.LITERATURE.length+' fictional records</div>'
    + '<div class="k">Storage</div><div>This browser only. Nothing is uploaded and nothing leaves your device.</div>'
    + '</div></div></div>'

    + '<div class="card"><div class="hd"><h2>Reset</h2></div><div class="bd">'
    + '<p style="font-size:13px;color:var(--muted);margin-bottom:12px">Deletes every case, signal note and audit '
    + 'entry in this browser and reloads the seed data. There is no undo.</p>'
    + '<button class="btn dgr sm" data-act="reset">Reset the training database</button></div></div></div>';

  on(v,'[data-user]','click', function(e,t){
    DB.login(t.getAttribute('data-user'));
    toast('<span class="t">Signed in</span>You are now '+esc(DB.roleOf(DB.session()).name)+'.');
    render();
  });
  on(v,'[data-act=out]','click', function(){ DB.logout(); render(); });
  on(v,'[data-act=reset]','click', function(){
    modal('Reset the training database?',
      '<p style="font-size:13px">This deletes every case you have worked, every signal note and the whole audit '
      + 'trail in this browser, then reloads the seed data. It cannot be undone.</p>',
      [{label:'Cancel',cls:'sec'},
       {label:'Reset everything',cls:'btn dgr',act:function(){
         DB.reset(); toast('<span class="t">Reset</span>Seed data reloaded.'); go('dashboard'); render(); }}]);
  });
};

/* ================================================================== *
 * THE ASSISTANT                                                       *
 * ================================================================== */
function drawAssist(){
  var c = currentCaseId ? DB.case(currentCaseId) : null;
  var h = '<div class="ah"><b>PV Assistant</b>'
    + '<span class="sp" style="margin-left:auto;font-size:11px;color:var(--muted)">rule-based</span></div>'
    + '<div class="ab">';
  h += '<div class="note info" style="margin-bottom:12px;font-size:11.8px">'
    + 'Answers are composed from this case and the reference data by fixed rules. '
    + '<b>There is no language model here</b> — it cannot reason about your patient, and it never makes a '
    + 'clinical or regulatory decision.</div>';
  if(!c){
    h += '<p style="font-size:12.8px;color:var(--muted)">Open a case and I can explain it, tell you what is '
      + 'missing, suggest terminology, draft the narrative or look for a duplicate.</p>';
  } else {
    h += '<div style="font-size:12px;color:var(--muted);margin-bottom:9px">Working on <b>'+esc(c.caseNo)+'</b></div>'
      + '<div class="ig">'
      + E.INTENTS.map(function(i){ return '<button data-int="'+i.k+'">'+esc(i.label)+'</button>'; }).join('')
      + '</div><div id="aOut"></div>';
  }
  h += '</div>';
  $('asstPn').innerHTML = h;
  on($('asstPn'),'[data-int]','click', function(e,t){
    var r = E.assist(DB.case(currentCaseId), t.getAttribute('data-int'), DB.cases());
    $('asstPn').querySelector('#aOut').innerHTML =
      '<div class="ans"><div class="k">Suggestion</div><div class="v">'+esc(r.suggestion)+'</div>'
      + '<div class="k">Reason</div><div class="v">'+esc(r.reason)+'</div>'
      + '<div class="k">Source</div><div class="v">'+esc(r.source)+'</div>'
      + '<div class="rv">'+esc(r.review)+'</div></div>';
  });
}
$('asstBtn').addEventListener('click', function(){
  var a = $('asst');
  a.classList.toggle('on');
  if(a.classList.contains('on')) drawAssist();
});

/* ================================================================== *
 * GLOBAL SEARCH                                                       *
 * ================================================================== */
$('gsearch').addEventListener('keydown', function(e){
  if(e.key!=='Enter') return;
  var q = e.target.value.trim().toLowerCase();
  if(!q) return;
  var cs = DB.cases().filter(function(c){
    var d = (c.drugs||[]).map(function(x){return x.generic;}).join(' ');
    var ev = (c.events||[]).map(function(x){ return (x.reported||'')+' '+((x.coded&&x.coded.pt)||''); }).join(' ');
    return (c.caseNo+' '+d+' '+ev).toLowerCase().indexOf(q)>=0;
  });
  var terms = E.searchTerms(q);
  modal('Search: '+esc(q),
    '<div class="stack">'
    + '<div><b style="font-size:13px">Cases ('+cs.length+')</b>'
    + (cs.length?caseTable(cs.slice(0,8)):'<p style="font-size:12.5px;color:var(--muted);margin-top:6px">No case matches.</p>')+'</div>'
    + '<div><b style="font-size:13px">Terminology ('+terms.length+')</b>'
    + (terms.length?'<ul style="margin:6px 0 0 18px;font-size:12.8px;line-height:1.7">'
        + terms.slice(0,6).map(function(t){ return '<li><b>'+esc(t.term.pt)+'</b> — '+esc(t.socName)+'</li>'; }).join('')+'</ul>'
      :'<p style="font-size:12.5px;color:var(--muted);margin-top:6px">No term matches.</p>')+'</div></div>',
    [{label:'Close', cls:'btn'}],
    function(body){ on(body,'[data-case]','click', function(ev,t){
      closeModal(); go('case/'+t.getAttribute('data-case')); }); });
});

/* ---------- start ---------- */
if(!DB.session()) DB.login('u-stu-01');   /* a sensible default; switchable in Settings */
render();
})();
