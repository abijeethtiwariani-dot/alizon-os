/* =====================================================================
   ALIZON — ASAP curriculum ingest + display (shared)
   Requires SheetJS (vendor/xlsx.full.min.js) only for parsing (admin side).
   Storage: localStorage key "alizonCurriculum" = { "<courseKey>": {course} }
   courseKey = uppercased course code, else a slug of the course name.
   Public API: window.AlizonCurriculum = { parseWorkbook, render, courseKey, get, list }
   ===================================================================== */
(function () {
  'use strict';
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function num(v){ var n=Number(String(v).replace(/[^\d.\-]/g,'')); return isFinite(n)?n:0; }
  function txt(v){ return String(v==null?'':v).trim(); }
  function nlToBr(s){ return esc(s).replace(/\n+/g,'<br>'); }

  /* dense 2D array (A=col 0), so fixed column indices are reliable */
  function sheetTo2D(ws){
    if(!ws || !ws['!ref']) return [];
    var r=XLSX.utils.decode_range(ws['!ref']), out=[];
    for(var R=r.s.r; R<=r.e.r; R++){
      var row=[];
      for(var C=0; C<=r.e.c; C++){
        var cell=ws[XLSX.utils.encode_cell({r:R,c:C})];
        row.push(cell ? (cell.v==null?'':cell.v) : '');
      }
      out.push(row);
    }
    return out;
  }
  function rowText(row){ return row.map(txt).join(' ').toLowerCase(); }
  function firstRowContaining(rows, needle, from){
    needle=needle.toLowerCase();
    for(var i=(from||0); i<rows.length; i++){ if(rowText(rows[i]).indexOf(needle)>-1) return i; }
    return -1;
  }
  /* value cell to the right of a label cell containing `label` */
  function labelValue(rows, label){
    label=label.toLowerCase();
    for(var i=0;i<rows.length;i++){ var row=rows[i];
      for(var c=0;c<row.length;c++){ if(txt(row[c]).toLowerCase().indexOf(label)>-1){
        for(var k=c+1;k<row.length;k++){ if(txt(row[k])) return txt(row[k]); }
      } }
    }
    return '';
  }

  /* ------- parse one worksheet in the ASAP layout ------- */
  function parseSheet(ws){
    var rows=sheetTo2D(ws);
    if(!rows.length) return null;

    /* course header: locate the Code / Name / Category columns from the header row,
       then read the first values row below it (merged cells shift columns). */
    var hi=firstRowContaining(rows,'name of the course');
    var code='', name='', category='', durTotal='', elig='';
    if(hi>-1){
      var hrow=rows[hi], cCode=-1,cName=-1,cCat=-1,cElig=-1;
      for(var c=0;c<hrow.length;c++){ var t=txt(hrow[c]).toLowerCase();
        if(cCode<0 && t.indexOf('course code')>-1) cCode=c;
        if(cName<0 && t.indexOf('name of the course')>-1) cName=c;
        if(cCat<0 && t==='category') cCat=c;
        if(cElig<0 && t.indexOf('eligibility')>-1) cElig=c;
      }
      if(cName<0) cName=4; if(cCode<0) cCode=1;
      for(var r=hi+1;r<Math.min(hi+5,rows.length);r++){
        var v=rows[r], nm=txt(v[cName]);
        if(nm && nm.toLowerCase()!=='t' && nm.toLowerCase().indexOf('objective')<0){
          name=nm; code=txt(v[cCode]);
          category=cCat>-1?txt(v[cCat]):'';
          elig=cElig>-1?txt(v[cElig]):'';
          break;
        }
      }
    }
    var meta={
      code:code, name:name, category:category,
      objective: labelValue(rows,'course objective'),
      outcome: labelValue(rows,'course outcome'),
      mode: labelValue(rows,'mode of training'),
      medium: labelValue(rows,'medium of instruction'),
      assessment: labelValue(rows,'assessment stategy') || labelValue(rows,'assessment strategy'),
      eceDuration: labelValue(rows,'duration of ece'),
      maxMarks: labelValue(rows,'maximum marks'),
      passMark: labelValue(rows,'minimum marks'),
      eligibility: elig || labelValue(rows,'eligibility criteria'),
      duration:{ total:durTotal }
    };

    /* ------- module summary table ------- */
    var sHead=firstRowContaining(rows,'module name');
    var modules=[], byNo={};
    if(sHead>-1){
      /* data starts 2 rows below (header + T/P/OJT sub-header) */
      for(var i=sHead+2;i<rows.length;i++){
        var row=rows[i], nm=txt(row[4]);
        var lc=rowText(row);
        if(lc.indexOf('detailed curriculum')>-1) break;
        if(!nm) { if(txt(row[2])||txt(row[3])) continue; else if(i>sHead+2 && !lc.trim()) continue; else continue; }
        if(nm.toLowerCase()==='total' || lc.indexOf('total duration')>-1) break;
        var mno=txt(row[3])||txt(row[2]);
        var m={ no:String(num(mno)||mno).replace(/\.0$/,''), name:nm,
          hours:{ t:num(row[14]),p:num(row[15]),ojt:num(row[16]),intern:num(row[17]),total:num(row[18]) },
          ce:{ t:num(row[19]),p:num(row[20]),att:num(row[21]),asgn:num(row[22]),total:num(row[23]) },
          ece:{ theory:num(row[24]),practical:num(row[25]),project:num(row[26]),viva:num(row[27]),total:num(row[28]) },
          objective:'', outcome:'', methodology:'', units:[] };
        modules.push(m); byNo[m.no]=m;
      }
    }

    /* ------- detailed syllabus blocks ------- */
    var di=firstRowContaining(rows,'detailed curriculum');
    if(di>-1){
      var i2=di;
      while(i2<rows.length){
        /* find next block header "Module No." in col A */
        var bh=-1;
        for(var j=i2+1;j<rows.length;j++){ if(txt(rows[j][0]).toLowerCase()==='module no.'){ bh=j; break; } }
        if(bh<0) break;
        /* the module info row: first row after bh (skip the T/P sub-header) whose col A is numeric */
        var info=-1;
        for(var k=bh+1;k<Math.min(bh+4,rows.length);k++){ if(txt(rows[k][0]) && !isNaN(num(rows[k][0])) && num(rows[k][0])>0){ info=k; break; } }
        if(info<0){ i2=bh+1; continue; }
        var mno2=String(num(rows[info][0])).replace(/\.0$/,'');
        var m=byNo[mno2];
        if(!m){ m={ no:mno2, name:txt(rows[info][2]), hours:{}, ce:{}, ece:{}, units:[] }; modules.push(m); byNo[mno2]=m; }
        m.objective=txt(rows[info][15])||m.objective;
        m.outcome=txt(rows[info][24])||m.outcome;
        m.methodology=txt(rows[info][27])||m.methodology;
        if(!m.name) m.name=txt(rows[info][2]);
        /* units: rows with numeric col B until 'Module Total' or next 'Module No.' */
        var u=info+1;
        for(; u<rows.length; u++){
          var rt=rowText(rows[u]);
          if(rt.indexOf('module total')>-1){ break; }
          if(txt(rows[u][0]).toLowerCase()==='module no.'){ break; }
          var un=rows[u][1], topics=txt(rows[u][2]);
          if((txt(un)!=='' && !isNaN(num(un))) || topics){
            m.units.push({ no:txt(un)?String(num(un)).replace(/\.0$/,''):'', topics:topics,
              t:num(rows[u][19]),p:num(rows[u][20]),ojt:num(rows[u][21]),intern:num(rows[u][22]),total:num(rows[u][23]) });
          }
        }
        i2=u;
      }
    }
    if(!name && !modules.length) return null;
    return { meta:meta, modules:modules, updatedAt:'' };
  }

  function courseKey(course){
    var m=course&&course.meta||{};
    return (txt(m.code)||txt(m.name)||'course').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  /* parse a whole workbook -> array of {key, course} (one per non-empty sheet) */
  function parseWorkbook(ab){
    var wb=XLSX.read(ab,{type:'array'});
    var out=[];
    wb.SheetNames.forEach(function(sn){
      try{ var c=parseSheet(wb.Sheets[sn]); if(c){ out.push({ key:courseKey(c), course:c }); } }catch(e){ console.warn('curriculum parse',sn,e); }
    });
    return out;
  }

  /* ------- storage ------- */
  function store(){ try{var o=JSON.parse(localStorage.getItem('alizonCurriculum')||'{}');return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};} }
  function get(key){ return store()[String(key||'').toUpperCase()]||null; }
  function list(){ var s=store(); return Object.keys(s).map(function(k){ return {key:k, name:(s[k].meta&&s[k].meta.name)||k}; }); }
  /* match a course by a student's programme/course name */
  function findForCourse(courseName){
    var s=store(), n=String(courseName||'').toLowerCase().replace(/\s+/g,'');
    if(!n) return null;
    var keys=Object.keys(s);
    for(var i=0;i<keys.length;i++){ var m=s[keys[i]].meta||{};
      var mn=String(m.name||'').toLowerCase().replace(/\s+/g,''), mc=String(m.code||'').toLowerCase().replace(/\s+/g,'');
      if(mn && (mn.indexOf(n)>-1 || n.indexOf(mn)>-1)) return s[keys[i]];
      if(mc && n.indexOf(mc)>-1) return s[keys[i]];
    }
    return null;
  }

  /* ------- render (self-styled; container gets .alz-cur) ------- */
  function hoursChips(h){
    if(!h||h.total==null) return '';
    var parts=[];
    if(h.t) parts.push('T '+h.t); if(h.p) parts.push('P '+h.p);
    if(h.ojt) parts.push('OJT '+h.ojt); if(h.intern) parts.push('Intern '+h.intern);
    return parts.join(' · ');
  }
  function render(el, course){
    if(!el) return;
    if(!course){ el.innerHTML='<div class="cur-empty">No syllabus uploaded for this course yet.</div>'; return; }
    var m=course.meta||{}, mods=course.modules||[];
    var totH=mods.reduce(function(a,x){return a+((x.hours&&x.hours.total)||0);},0);
    var html='<div class="alz-cur">';
    html+='<div class="cur-head"><div class="cur-code">'+esc(m.code||'')+(m.category?' · '+esc(m.category):'')+'</div>'
      +'<h3 class="cur-title">'+esc(m.name||'Curriculum')+'</h3>'
      +'<div class="cur-meta">'
      +(m.duration&&m.duration.total?'<span><b>Duration:</b> '+esc(m.duration.total)+'</span>':(totH?'<span><b>Duration:</b> '+totH+' hrs</span>':''))
      +(m.maxMarks?'<span><b>Max marks:</b> '+esc(m.maxMarks)+'</span>':'')
      +(m.passMark?'<span><b>Pass:</b> '+esc(m.passMark)+'</span>':'')
      +(m.mode?'<span><b>Mode:</b> '+esc(m.mode)+'</span>':'')
      +'<span><b>Modules:</b> '+mods.length+'</span>'
      +'</div></div>';

    /* summary table: hours + marks */
    html+='<div class="cur-tblwrap"><table class="cur-tbl"><thead>'
      +'<tr><th rowspan="2">#</th><th rowspan="2">Module</th><th colspan="5">Hours</th><th colspan="5">Continuous Eval</th><th colspan="5">End-course Exam</th></tr>'
      +'<tr><th>T</th><th>P</th><th>OJT</th><th>Int</th><th>Tot</th><th>T</th><th>P</th><th>Att</th><th>Asg</th><th>Tot</th><th>Th</th><th>Pr</th><th>Prj</th><th>Viva</th><th>Tot</th></tr>'
      +'</thead><tbody>';
    mods.forEach(function(x){
      var h=x.hours||{}, ce=x.ce||{}, ec=x.ece||{};
      function c(v){ return '<td>'+(v?v:'<span class="z">–</span>')+'</td>'; }
      html+='<tr><td class="mno">'+esc(x.no)+'</td><td class="mnm">'+esc(x.name)+'</td>'
        +c(h.t)+c(h.p)+c(h.ojt)+c(h.intern)+'<td class="tot">'+(h.total||'')+'</td>'
        +c(ce.t)+c(ce.p)+c(ce.att)+c(ce.asgn)+'<td class="tot">'+(ce.total||'')+'</td>'
        +c(ec.theory)+c(ec.practical)+c(ec.project)+c(ec.viva)+'<td class="tot">'+(ec.total||'')+'</td></tr>';
    });
    html+='</tbody></table></div>';

    /* module detail cards */
    html+='<div class="cur-mods">';
    mods.forEach(function(x){
      var h=x.hours||{};
      html+='<details class="cur-mod"><summary><span class="cm-no">Module '+esc(x.no)+'</span>'
        +'<span class="cm-nm">'+esc(x.name)+'</span>'
        +'<span class="cm-h">'+(h.total?h.total+' hrs':'')+(x.ece&&x.ece.total?' · '+x.ece.total+' marks (exam)':'')+'</span></summary>'
        +'<div class="cm-body">';
      if(hoursChips(h)) html+='<div class="cm-chips">'+esc(hoursChips(h))+' · Total '+(h.total||0)+' hrs</div>';
      if(x.objective) html+='<div class="cm-sec"><b>Objective</b><p>'+nlToBr(x.objective)+'</p></div>';
      if(x.outcome) html+='<div class="cm-sec"><b>Outcome</b><p>'+nlToBr(x.outcome)+'</p></div>';
      if(x.methodology) html+='<div class="cm-sec"><b>Methodology &amp; Tools</b><p>'+nlToBr(x.methodology)+'</p></div>';
      if(x.units&&x.units.length){
        html+='<div class="cm-sec"><b>Units &amp; Topics</b><div class="cm-units">';
        x.units.forEach(function(u){
          html+='<div class="cm-unit"><div class="cu-h"><span class="cu-no">'+(u.no?'Unit '+esc(u.no):'')+'</span>'
            +(u.total?'<span class="cu-hrs">'+u.total+' hrs</span>':'')+'</div>'
            +'<div class="cu-t">'+nlToBr(u.topics)+'</div></div>';
        });
        html+='</div></div>';
      }
      html+='</div></details>';
    });
    html+='</div></div>';
    el.innerHTML=html;
  }

  /* inject styles once */
  if(!document.getElementById('alzCurCss')){
    var st=document.createElement('style'); st.id='alzCurCss';
    st.textContent='.alz-cur{color:var(--ink,#2e2d29);font-family:inherit}'
      +'.alz-cur .cur-head{margin-bottom:16px}'
      +'.alz-cur .cur-code{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#9a7b3f}'
      +'.alz-cur .cur-title{font-family:"Source Serif Pro",Georgia,serif;font-size:22px;font-weight:700;margin-top:4px;color:inherit}'
      +'.alz-cur .cur-meta{display:flex;gap:8px 18px;flex-wrap:wrap;margin-top:8px;font-size:13px;color:#6e6a63}'
      +'.alz-cur .cur-meta b{color:inherit}'
      +'.alz-cur .cur-tblwrap{overflow-x:auto;border:1px solid rgba(0,0,0,.1);border-radius:10px;margin:6px 0 20px}'
      +'.alz-cur .cur-tbl{border-collapse:collapse;width:100%;min-width:760px;font-size:12px}'
      +'.alz-cur .cur-tbl th{background:#8c1515;color:#fff;font-weight:600;padding:7px 6px;text-align:center;border:1px solid rgba(255,255,255,.15);font-size:11px}'
      +'.alz-cur .cur-tbl td{padding:7px 6px;text-align:center;border:1px solid rgba(0,0,0,.08);color:#2e2d29}'
      +'.alz-cur .cur-tbl td.mno{font-weight:700;color:#8c1515}'
      +'.alz-cur .cur-tbl td.mnm{text-align:left;font-weight:600;min-width:200px}'
      +'.alz-cur .cur-tbl td.tot{font-weight:700;background:#faf3f3}'
      +'.alz-cur .cur-tbl .z{color:#c9c2ba}'
      +'.alz-cur .cur-tbl tbody tr:nth-child(even){background:#faf8f6}'
      +'.alz-cur .cur-mods{display:flex;flex-direction:column;gap:10px}'
      +'.alz-cur .cur-mod{border:1px solid rgba(0,0,0,.1);border-radius:10px;background:#fff;overflow:hidden}'
      +'.alz-cur .cur-mod>summary{list-style:none;cursor:pointer;display:flex;gap:12px;align-items:center;padding:14px 16px;flex-wrap:wrap}'
      +'.alz-cur .cur-mod>summary::-webkit-details-marker{display:none}'
      +'.alz-cur .cur-mod .cm-no{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#8c1515;border-radius:100px;padding:4px 12px;flex:none}'
      +'.alz-cur .cur-mod .cm-nm{font-family:"Source Serif Pro",Georgia,serif;font-size:16px;font-weight:600;flex:1;min-width:180px}'
      +'.alz-cur .cur-mod .cm-h{font-size:12px;color:#6e6a63;font-weight:600}'
      +'.alz-cur .cur-mod[open]>summary{border-bottom:1px solid rgba(0,0,0,.08);background:#faf8f6}'
      +'.alz-cur .cm-body{padding:14px 18px 18px}'
      +'.alz-cur .cm-chips{font-size:12px;font-weight:600;color:#8c1515;background:rgba(140,21,21,.06);border:1px solid rgba(140,21,21,.16);border-radius:100px;padding:6px 14px;display:inline-block;margin-bottom:12px}'
      +'.alz-cur .cm-sec{margin-top:12px}'
      +'.alz-cur .cm-sec>b{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9a7b3f;display:block;margin-bottom:5px}'
      +'.alz-cur .cm-sec p{font-size:13.5px;line-height:1.6;color:#2e2d29}'
      +'.alz-cur .cm-units{display:flex;flex-direction:column;gap:8px}'
      +'.alz-cur .cm-unit{border:1px solid rgba(0,0,0,.09);border-left:3px solid #9a7b3f;border-radius:8px;padding:10px 14px;background:#faf8f6}'
      +'.alz-cur .cu-h{display:flex;gap:10px;align-items:center;margin-bottom:4px}'
      +'.alz-cur .cu-no{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8c1515}'
      +'.alz-cur .cu-hrs{margin-left:auto;font-size:11.5px;font-weight:600;color:#6e6a63}'
      +'.alz-cur .cu-t{font-size:13px;line-height:1.55;color:#2e2d29}'
      +'.alz-cur .cur-empty{color:#6e6a63;font-size:14px;padding:20px 0;text-align:center}';
    document.head.appendChild(st);
  }

  window.AlizonCurriculum={ parseWorkbook:parseWorkbook, render:render, courseKey:courseKey, get:get, list:list, findForCourse:findForCourse, store:store };
})();
