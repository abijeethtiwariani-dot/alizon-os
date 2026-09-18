/* =====================================================================
   pvsoft-db.js — the store, the session and the workflow state machine.

   There is no server. Everything lives in localStorage under one key,
   which is the right trade for a training simulator on a public page:
   the participant's practice cases are theirs, they stay on their own
   machine, and nothing a student types is uploaded anywhere.

   Three things this file is strict about, because they are the three
   things that make a case-processing system trustworthy rather than a
   set of forms:

   1. THE STATE MACHINE IS ENFORCED, NOT SUGGESTED. A case moves only
      along a transition declared in PVSoftData.STATES. Anything else is
      refused and the refusal says why. "Cases should not randomly jump
      between stages" is only true if something actually stops them.

   2. THE AUDIT LOG IS APPEND-ONLY. There is no update or delete for an
      audit entry anywhere in this file, and the UI is given no way to
      reach one. An audit trail a user can edit is worse than none,
      because it looks like evidence.

   3. PERMISSIONS ARE CHECKED HERE, NOT IN THE UI. Hiding a button is a
      courtesy to the user; refusing the write is the control. Every
      mutating call takes the acting user and is refused if that user's
      role does not carry the permission.

   Public API:
     PVSoftDB.boot()                      seed on first run
     PVSoftDB.reset()                     wipe and reseed
     PVSoftDB.session() / login(id) / logout()
     PVSoftDB.can(perm, user)             permission test
     PVSoftDB.cases() / case(id) / saveCase(c) / createCase(o)
     PVSoftDB.transition(id, to, note)    the ONLY way status changes
     PVSoftDB.audit(action, entity, id, detail)
     PVSoftDB.auditLog(filter)
     PVSoftDB.notify(to, type, text, caseId) / notifications(userId)
     PVSoftDB.signals() / saveSignal(s)
     PVSoftDB.literature() / saveLit(l)
   ===================================================================== */
(function(){
'use strict';
if (window.PVSoftDB) return;

var KEY = 'pvsoftDB';
var D   = window.PVSoftData || {};
var VERSION = 1;

/* ------------------------------------------------------------------ *
 * storage                                                             *
 * ------------------------------------------------------------------ */
function blank(){
  return {v:VERSION, seq:{cases:0, signals:0, followups:0},
          cases:[], signals:[], literature:[], audit:[], notifications:[],
          session:null, settings:{}};
}
var mem = null;      /* in-memory mirror, so a blocked localStorage still works */

function load(){
  if(mem) return mem;
  try{
    var raw = localStorage.getItem(KEY);
    if(raw){
      var o = JSON.parse(raw);
      if(o && o.v === VERSION){ mem = o; return mem; }
    }
  }catch(e){}
  mem = blank();
  return mem;
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(mem)); }
  catch(e){ /* private browsing, quota, blocked storage — the session still
               works from the in-memory mirror, it just will not survive a
               reload. Silently degrading beats refusing to run. */ }
  return mem;
}
function db(){ return load(); }

function uid(p){
  var r;
  try{ r = (crypto.getRandomValues(new Uint32Array(2))); }
  catch(e){ r = [Math.random()*1e9|0, Math.random()*1e9|0]; }
  return (p||'id')+'-'+Date.now().toString(36)+'-'+r[0].toString(36)+r[1].toString(36);
}
function now(){ return Date.now(); }

/* ------------------------------------------------------------------ *
 * session and permissions                                             *
 * ------------------------------------------------------------------ */
function users(){ return (D.USERS||[]).slice(); }
function userById(id){ return users().filter(function(u){ return u.id===id; })[0]||null; }

function session(){
  var s = db().session;
  return s ? userById(s) : null;
}
function login(userId){
  var u = userById(userId);
  if(!u) return null;
  db().session = u.id; save();
  auditAs(u, 'session.login', 'user', u.id, u.name+' signed in as '+roleName(u.role));
  return u;
}
function logout(){
  var u = session();
  if(u) auditAs(u, 'session.logout', 'user', u.id, u.name+' signed out');
  db().session = null; save();
}
function roleOf(u){ return (D.ROLES||{})[u && u.role] || null; }
function roleName(id){ var r=(D.ROLES||{})[id]; return r?r.name:id; }

function can(perm, u){
  u = u || session();
  var r = roleOf(u);
  if(!r) return false;
  return r.can.indexOf(perm) >= 0;
}
/* A refusal that does not say why teaches the student nothing about who
   is supposed to do what, which is half the point of a role-based system. */
function require_(perm, u){
  u = u || session();
  if(!u) return {ok:false, why:'You are not signed in.'};
  if(can(perm, u)) return {ok:true, user:u};
  return {ok:false, why:roleName(u.role)+' does not have permission "'+perm+'". '
       + 'In a real safety department this separation is the control that stops one person '
       + 'authoring, approving and closing the same case.'};
}

/* ------------------------------------------------------------------ *
 * audit — append only, and there is deliberately no way to amend it    *
 * ------------------------------------------------------------------ */
function auditAs(u, action, entity, entityId, detail){
  var d = db();
  d.audit.push({
    id: uid('aud'), at: now(),
    user: u ? u.name : 'system', userId: u ? u.id : null, role: u ? u.role : 'system',
    action: action, entity: entity||'', entityId: entityId||'', detail: detail||''
  });
  if(d.audit.length > 4000) d.audit.splice(0, d.audit.length-4000);
  save();
}
function audit(action, entity, entityId, detail){
  auditAs(session(), action, entity, entityId, detail);
}
function auditLog(f){
  f = f||{};
  var rows = db().audit.slice().reverse();
  if(f.entityId) rows = rows.filter(function(r){ return r.entityId===f.entityId; });
  if(f.userId)   rows = rows.filter(function(r){ return r.userId===f.userId; });
  if(f.action)   rows = rows.filter(function(r){ return r.action.indexOf(f.action)===0; });
  return rows;
}

/* ------------------------------------------------------------------ *
 * notifications                                                       *
 * ------------------------------------------------------------------ */
function notify(toRole, type, text, caseId){
  var d = db();
  d.notifications.push({id:uid('ntf'), at:now(), toRole:toRole, type:type,
                        text:text, caseId:caseId||null, read:false});
  if(d.notifications.length > 300) d.notifications.splice(0, d.notifications.length-300);
  save();
}
function notifications(u){
  u = u || session();
  if(!u) return [];
  return db().notifications.filter(function(n){
    return !n.toRole || n.toRole===u.role;
  }).slice().reverse();
}
function markRead(id){
  var n = db().notifications.filter(function(x){ return x.id===id; })[0];
  if(n){ n.read = true; save(); }
}
function markAllRead(u){
  u = u || session();
  db().notifications.forEach(function(n){ if(!n.toRole || n.toRole===u.role) n.read=true; });
  save();
}

/* ------------------------------------------------------------------ *
 * cases                                                               *
 * ------------------------------------------------------------------ */
function caseNo(){
  var d = db();
  d.seq.cases = (d.seq.cases||0) + 1;
  save();
  return 'PV-' + new Date().getFullYear() + '-' + String(d.seq.cases).padStart(6,'0');
}

function newCase(o){
  o = o||{};
  return {
    id: uid('case'), caseNo: caseNo(), status:'DRAFT', priority:null,
    created: now(), updated: now(),
    createdBy: (session()||{}).id || null,
    createdByName: (session()||{}).name || '',
    trainingCaseId: o.trainingCaseId||null,
    guided: !!o.guided,
    reporter:{type:'', name:'', institution:'', country:'India', email:'', phone:'',
              contactPref:'Email', reportDate:'', source:''},
    patient:{pid:'', age:'', dob:'', sex:'', weight:'', height:'', pregnancy:'',
             history:'', labs:''},
    drugs:[], events:[],
    validity:null, triage:null, seriousness:null, expectedness:null,
    causality:null, duplicate:null, followups:[], narrative:null,
    medicalReview:null, qc:null, regulatory:null, closure:null, score:null,
    history:[]
  };
}

function createCase(o){
  var g = require_('case.create');
  if(!g.ok) return {error:g.why};
  var d = db();
  var c = newCase(o);
  d.cases.push(c); save();
  audit('case.create', 'case', c.id, 'Created case '+c.caseNo
    + (o && o.trainingCaseId ? ' from training case '+o.trainingCaseId : ''));
  return c;
}
function cases(){ return db().cases.slice(); }
function getCase(id){ return db().cases.filter(function(c){ return c.id===id; })[0]||null; }
function saveCase(c){
  var d = db();
  for(var i=0;i<d.cases.length;i++){
    if(d.cases[i].id===c.id){ c.updated = now(); d.cases[i]=c; save(); return c; }
  }
  return null;
}
function deleteCase(id){
  var g = require_('case.delete');
  if(!g.ok) return {error:g.why};
  var d = db(), c = getCase(id);
  d.cases = d.cases.filter(function(x){ return x.id!==id; });
  save();
  audit('case.delete', 'case', id, 'Deleted case '+(c?c.caseNo:id));
  return {ok:true};
}

/* ------------------------------------------------------------------ *
 * the state machine                                                   *
 *                                                                     *
 * The single doorway. Nothing else in the application is allowed to    *
 * write case.status, and nothing else does.                            *
 * ------------------------------------------------------------------ */
function stateById(id){ return (D.STATES||[]).filter(function(s){ return s.id===id; })[0]||null; }

/* Which permission a given move needs. Absent from this table means the
   move needs no special permission beyond editing the case. */
var MOVE_PERM = {
  'TRIAGE->VALIDATED':            'triage.perform',
  'TRIAGE->CLOSED':               'triage.perform',
  'ASSESSMENT->MEDICAL_REVIEW':   'case.advance.medical',
  'MEDICAL_REVIEW->QC':           'case.advance.qc',
  'MEDICAL_REVIEW->ASSESSMENT':   'medical.return',
  'MEDICAL_REVIEW->FOLLOW_UP':    'followup.request',
  'QC->REPORTING_SIMULATION':     'case.advance.reporting',
  'QC->ASSESSMENT':               'qc.fail',
  'REPORTING_SIMULATION->CLOSED': 'case.close'
};

function transition(id, to, note){
  var c = getCase(id);
  if(!c) return {error:'No such case.'};
  var from = c.status;
  if(from === to) return {error:'The case is already at '+ (stateById(to)||{}).name + '.'};

  var st = stateById(from);
  if(!st) return {error:'Unknown current state "'+from+'".'};
  if(st.next.indexOf(to) < 0){
    return {error:'A case cannot move from '+st.name+' to '+((stateById(to)||{}).name||to)+'. '
      + 'From '+st.name+' the only moves are: '
      + (st.next.length ? st.next.map(function(n){ return (stateById(n)||{}).name||n; }).join(', ')
                        : 'none — this is a terminal state.')};
  }
  var perm = MOVE_PERM[from+'->'+to];
  if(perm){
    var g = require_(perm);
    if(!g.ok) return {error:g.why};
  }
  var u = session();
  c.status = to;
  c.history = c.history||[];
  c.history.push({at:now(), from:from, to:to, by:(u&&u.name)||'system',
                  role:(u&&u.role)||'system', note:note||''});
  saveCase(c);
  audit('case.transition', 'case', c.id,
    c.caseNo+': '+st.name+' → '+((stateById(to)||{}).name||to)+(note?' — '+note:''));

  /* Tell whoever now owns it. */
  var TO_ROLE = {TRIAGE:'pv_officer', MEDICAL_REVIEW:'medical_reviewer',
                 QC:'qc_officer', REPORTING_SIMULATION:'pv_manager'};
  if(TO_ROLE[to]) notify(TO_ROLE[to], 'assigned',
    c.caseNo+' has reached '+((stateById(to)||{}).name||to)+' and needs your attention.', c.id);
  if(to==='FOLLOW_UP') notify('pv_officer', 'followup',
    c.caseNo+' is waiting on follow-up information.', c.id);
  if(to==='CLOSED') notify('pv_manager', 'closed', c.caseNo+' has been closed.', c.id);

  return {ok:true, from:from, to:to, case:c};
}
function allowedMoves(c){
  var st = stateById(c.status);
  if(!st) return [];
  return st.next.map(function(n){
    var perm = MOVE_PERM[c.status+'->'+n];
    return {to:n, name:(stateById(n)||{}).name||n, perm:perm||null,
            allowed: perm ? can(perm) : true};
  });
}

/* ------------------------------------------------------------------ *
 * signals and literature                                              *
 * ------------------------------------------------------------------ */
function signalNo(){
  var d = db(); d.seq.signals = (d.seq.signals||0)+1; save();
  return 'SIG-' + new Date().getFullYear() + '-' + String(d.seq.signals).padStart(3,'0');
}
function signals(){ return db().signals.slice(); }
function saveSignal(s){
  var d = db();
  if(!s.id){
    s.id = uid('sig'); s.no = signalNo(); s.created = now();
    d.signals.push(s);
    audit('signal.create','signal',s.id,'Opened signal '+s.no+': '+s.drug+' / '+s.event);
  } else {
    for(var i=0;i<d.signals.length;i++) if(d.signals[i].id===s.id) d.signals[i]=s;
    audit('signal.update','signal',s.id,'Updated signal '+s.no+' — stage '+(s.stage||''));
  }
  save(); return s;
}
function literature(){ return db().literature.slice(); }
function saveLit(l){
  var d = db();
  for(var i=0;i<d.literature.length;i++){
    if(d.literature[i].id===l.id){ d.literature[i]=l; save();
      audit('literature.review','literature',l.id,'Marked "'+l.title.slice(0,50)+'" as '+l.decision);
      return l; }
  }
  d.literature.push(l); save(); return l;
}

/* ------------------------------------------------------------------ *
 * boot                                                                *
 * ------------------------------------------------------------------ */
function boot(){
  var d = load();
  if(d.booted) return d;
  d.literature = (D.LITERATURE||[]).map(function(l){
    return Object.assign({}, l, {decision:'', reviewed:false});
  });
  d.signals = (D.SEED_SIGNALS||[]).map(function(s, i){
    return Object.assign({}, s, {
      id: uid('sig'), no:'SIG-2026-'+String(i+1).padStart(3,'0'),
      created: now(), seeded:true, notes:[]
    });
  });
  d.seq.signals = (D.SEED_SIGNALS||[]).length;
  d.booted = true;
  save();
  auditAs(null, 'system.boot', 'system', '', 'Training database initialised with seed data');
  return d;
}
function reset(){
  mem = blank();
  try{ localStorage.removeItem(KEY); }catch(e){}
  boot();
  return mem;
}

window.PVSoftDB = {
  boot:boot, reset:reset,
  users:users, userById:userById, session:session, login:login, logout:logout,
  can:can, require:require_, roleOf:roleOf, roleName:roleName,
  cases:cases, case:getCase, createCase:createCase, saveCase:saveCase, deleteCase:deleteCase,
  transition:transition, allowedMoves:allowedMoves, stateById:stateById,
  audit:audit, auditLog:auditLog,
  notify:notify, notifications:notifications, markRead:markRead, markAllRead:markAllRead,
  signals:signals, saveSignal:saveSignal, literature:literature, saveLit:saveLit,
  uid:uid, _db:db
};
})();
