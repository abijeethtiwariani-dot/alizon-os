/* =====================================================================
   ALIZON — automatic attendance

   Records a student as present the moment they actually use the portal:
   signing in, submitting a practical, an assignment or a self-assessment,
   or sitting an internal exam. No one has to mark a register by hand.

   Storage: localStorage "alizonAttendance" (already in firebase-sync KEYS)
     { "<REG>": { "YYYY-MM-DD": <entry> } }

   An <entry> is EITHER
     - a plain string  "present" | "absent" | "leave" | "holiday"
         a manual mark made by admin/faculty. Always wins; auto never
         touches a day that carries one.
     - an object  { s:'present', auto:1, l:2, p:1, a:0, x:0, e:0, t:<ms> }
         l = sign-ins, p = practicals, a = assignments, x = self-assessments,
         e = exams, t = last activity. Written only by this file.

   Read it through AlizonAttendance.status()/detail() so both shapes work.

   Public API: window.AlizonAttendance = {
     mark, markFor, status, detail, isAuto, verified, dayKey,
     forStudent, summary, today, since
   }
   ===================================================================== */
(function () {
  'use strict';
  if (window.AlizonAttendance) return;

  var KEY = 'alizonAttendance';
  var KEEP_DAYS = 550;                    /* ~18 months, keeps the synced doc small */
  var KINDS = { login:'l', practical:'p', assignment:'a', self:'x', exam:'e' };

  function J(k, d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function pad(n){ return (n<10?'0':'')+n; }
  function dayKey(d){ d=d||new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function store(){ var o=J(KEY,{}); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{}; }
  function myReg(){ var p=J('alizonProfile',{}); return String((p&&p.reg)||'').toUpperCase(); }

  /* ---- reading (handles the manual string and the auto object) ---- */
  function status(entry){
    if(!entry) return '';
    if(typeof entry==='string') return entry;
    return entry.s || 'present';
  }
  function detail(entry){ return (entry && typeof entry==='object') ? entry : null; }
  function isAuto(entry){ return !!(entry && typeof entry==='object' && entry.auto); }
  /* present with real coursework behind it, not just a sign-in */
  function verified(entry){
    var d=detail(entry); if(!d) return false;
    return ((d.p|0)+(d.a|0)+(d.x|0)+(d.e|0))>0;
  }

  /* drop anything older than KEEP_DAYS so the synced document cannot creep
     towards Firestore's 1 MB per-document ceiling */
  function trim(all){
    var cutoff=new Date(); cutoff.setDate(cutoff.getDate()-KEEP_DAYS);
    var min=dayKey(cutoff), dropped=0;
    Object.keys(all).forEach(function(reg){
      var rec=all[reg]; if(!rec||typeof rec!=='object') return;
      Object.keys(rec).forEach(function(d){ if(d<min){ delete rec[d]; dropped++; } });
      if(!Object.keys(rec).length) delete all[reg];
    });
    return dropped;
  }

  /* ---- writing ---- */
  function markFor(reg, kind, meta){
    reg=String(reg||'').toUpperCase();
    var field=KINDS[kind];
    if(!reg || !field) return null;

    var all=store(), day=dayKey();
    if(!all[reg]) all[reg]={};
    var cur=all[reg][day];

    /* a manual mark by admin or faculty is the authority — leave it alone */
    if(typeof cur==='string') return cur;

    var e = cur || { s:'present', auto:1, l:0, p:0, a:0, x:0, e:0 };
    e.s = e.s || 'present';
    e.auto = 1;
    e[field] = (e[field]|0) + 1;
    e.t = Date.now();
    if(meta && meta.module){
      var m = e.m || [];
      if(m.indexOf(meta.module)<0 && m.length<12) m.push(meta.module);
      e.m = m;
    }
    all[reg][day]=e;
    trim(all);
    try{ localStorage.setItem(KEY, JSON.stringify(all)); }catch(err){ return null; }
    return e;
  }

  /* mark the currently signed-in student */
  function mark(kind, meta){
    var reg=myReg();
    if(!reg) return null;                 /* admin / signed-out — nothing to record */
    return markFor(reg, kind, meta);
  }

  /* ---- queries ---- */
  function forStudent(reg){ return store()[String(reg||'').toUpperCase()] || {}; }
  function today(reg){ return forStudent(reg)[dayKey()] || null; }

  /* every student with auto activity on a given day -> [{reg, entry}] */
  function since(day){
    day = day || dayKey();
    var all=store(), out=[];
    Object.keys(all).forEach(function(reg){
      Object.keys(all[reg]||{}).forEach(function(d){
        if(d>=day) out.push({ reg:reg, day:d, entry:all[reg][d] });
      });
    });
    out.sort(function(a,b){ return a.day===b.day ? a.reg.localeCompare(b.reg) : (a.day<b.day?1:-1); });
    return out;
  }

  /* month summary; pass y/m to scope it, omit for the whole record */
  function summary(reg, y, m){
    var rec=forStudent(reg), prefix=(y!=null&&m!=null)?(y+'-'+pad(m+1)):'';
    var s={ present:0, absent:0, leave:0, holiday:0, marked:0, auto:0, verified:0, pct:0 };
    Object.keys(rec).forEach(function(d){
      if(prefix && d.indexOf(prefix)!==0) return;
      var e=rec[d], st=status(e);
      if(st==='present'){ s.present++; s.marked++; }
      else if(st==='absent'){ s.absent++; s.marked++; }
      else if(st==='leave'){ s.leave++; s.marked++; }
      else if(st==='holiday'){ s.holiday++; }
      if(isAuto(e)) s.auto++;
      if(verified(e)) s.verified++;
    });
    s.pct = s.marked ? Math.round(s.present/s.marked*100) : 0;
    return s;
  }

  window.AlizonAttendance = {
    mark:mark, markFor:markFor,
    status:status, detail:detail, isAuto:isAuto, verified:verified,
    dayKey:dayKey, forStudent:forStudent, today:today, since:since, summary:summary
  };
})();
