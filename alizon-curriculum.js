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
  /* purely numeric cell (serial numbers, hour counts) — num() alone never returns NaN */
  function isNumLike(v){ var t=txt(v); return t!=='' && /^[\d.,\s%+\-]+$/.test(t); }
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
  function labelValue(rows, label, from){
    label=label.toLowerCase();
    for(var i=(from||0);i<rows.length;i++){ var row=rows[i];
      for(var c=0;c<row.length;c++){ if(txt(row[c]).toLowerCase().indexOf(label)>-1){
        for(var k=c+1;k<row.length;k++){ if(txt(row[k])) return txt(row[k]); }
      } }
    }
    return '';
  }
  /* some ASAP sheets put the paragraph on the row BELOW its label (Course Objective /
     Course Outcome) instead of to its right — fall back to the next prose row. */
  function labelBelow(rows, label){
    label=label.toLowerCase();
    for(var i=0;i<rows.length;i++){ var row=rows[i], hit=-1;
      for(var c=0;c<row.length;c++){ if(txt(row[c]).toLowerCase().indexOf(label)>-1){ hit=c; break; } }
      if(hit<0) continue;
      for(var k=hit+1;k<row.length;k++){ if(txt(row[k])) return txt(row[k]); }   /* to the right first */
      for(var r=i+1;r<Math.min(i+3,rows.length);r++){                            /* then below */
        for(var c2=0;c2<rows[r].length;c2++){ var v=txt(rows[r][c2]);
          if(v.length>20 && !isNumLike(v)) return v; }
      }
    }
    return '';
  }
  /* a numbered trailing block ("21. Text / Reference Books") -> list of its entries */
  function listAfter(rows, label){
    var i=firstRowContaining(rows,label); if(i<0) return [];
    var out=[], blanks=0;
    for(var r=i+1;r<rows.length;r++){
      var row=rows[r], joined=row.map(txt).filter(Boolean);
      if(!joined.length){ if(++blanks>2) break; continue; }
      blanks=0;
      /* a new numbered section starts with a number in col A and a label in col B */
      if(isNumLike(row[0]) && txt(row[1]) && !isNumLike(row[1])) break;
      /* entry rows carry the text in col C (col B holds the serial number) */
      var t=txt(row[2]); if(!t){ for(var c=2;c<row.length;c++){ if(txt(row[c]) && !isNumLike(row[c])){ t=txt(row[c]); break; } } }
      if(t && t.length>4) out.push(t);
      if(out.length>60) break;
    }
    return out;
  }

  /* ------- parse one worksheet in the ASAP layout ------- */
  function parseSheet(ws){
    var rows=sheetTo2D(ws);
    if(!rows.length) return null;

    /* course header: locate the Code / Name / Category columns from the header row,
       then read the first values row below it (merged cells shift columns). */
    var hi=firstRowContaining(rows,'name of the course');
    var code='', name='', category='', elig='', tp='', dur={t:0,p:0,ojt:0,intern:0,total:0};
    var metaFrom=0;
    if(hi>-1){
      var hrow=rows[hi], cCode=-1,cName=-1,cCat=-1,cElig=-1,cTp=-1,cDur=-1;
      for(var c=0;c<hrow.length;c++){ var t=txt(hrow[c]).toLowerCase();
        if(cCode<0 && t.indexOf('course code')>-1) cCode=c;
        if(cName<0 && t.indexOf('name of the course')>-1) cName=c;
        if(cCat<0 && t==='category') cCat=c;
        if(cElig<0 && t.indexOf('eligibility')>-1) cElig=c;
        if(cTp<0 && t.indexOf('name and address')>-1) cTp=c;
        if(cDur<0 && t.indexOf('duration of the course')>-1) cDur=c;
      }
      if(cName<0) cName=4; if(cCode<0) cCode=1;
      for(var r=hi+1;r<Math.min(hi+5,rows.length);r++){
        var v=rows[r], nm=txt(v[cName]);
        if(nm && nm.toLowerCase()!=='t' && nm.toLowerCase().indexOf('objective')<0){
          name=nm; code=txt(v[cCode]);
          category=cCat>-1?txt(v[cCat]):'';
          elig=cElig>-1?txt(v[cElig]):'';
          tp=cTp>-1?txt(v[cTp]):'';
          if(cDur>-1) dur={ t:num(v[cDur]), p:num(v[cDur+1]), ojt:num(v[cDur+2]),
                            intern:num(v[cDur+3]), total:num(v[cDur+4]) };
          metaFrom=r+1;   /* detail fields live below the header block */
          break;
        }
      }
    }
    var meta={
      code:code, name:name, category:category,
      objective: labelBelow(rows,'course objective'),
      outcome: labelBelow(rows,'course outcome'),
      mode: labelValue(rows,'mode of training'),
      medium: labelValue(rows,'medium of instruction'),
      assessment: labelValue(rows,'assessment stategy') || labelValue(rows,'assessment strategy'),
      assessMode: labelValue(rows,'mode of assessment'),
      assessMedium: labelValue(rows,'medium of assessment'),
      eceDuration: labelValue(rows,'duration of ece'),
      maxMarks: labelValue(rows,'maximum marks'),
      passMark: labelValue(rows,'minimum marks'),
      eligibility: elig || labelValue(rows,'eligibility criteria'),
      eligibilityDetail: labelValue(rows,'eligibility criteria', metaFrom),
      type: labelValue(rows,'type of course'),
      sector: labelValue(rows,'skill sector'),
      nqr: labelValue(rows,'nqr code'),
      batchSize: labelValue(rows,'batch size'),
      computerLab: labelValue(rows,'computer lab included'),
      skillLab: labelValue(rows,'skill lab included'),
      ojtIncluded: labelValue(rows,'intership included') || labelValue(rows,'internship included'),
      ojtPlan: labelValue(rows,'plan for implementing ojt'),
      internPlan: labelValue(rows,'plan for implementing internship'),
      computerLabKit: labelValue(rows,'equipments required in the computer'),
      skillLabKit: labelValue(rows,'equipments required in the skill'),
      nsqf: labelValue(rows,'nsqf filing'),
      provider: tp,
      books: listAfter(rows,'reference books'),
      duration: dur
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
          /* the ASAP template leaves spare numbered rows with no topic — skip them */
          if(topics){
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
  function letterhead(){
    return '<header class="d-lh">'
      +'<img class="d-lh-logo" src="/alizon-logo.png" alt="Alizon crest" onerror="this.style.display=\'none\'">'
      +'<div class="d-lh-txt">'
        +'<div class="d-lh-name">Alizon School of Medical &amp; Digital Intelligence</div>'
        +'<div class="d-lh-tag">Advancing Artificial Intelligence in Healthcare Education</div>'
        +'<div class="d-lh-addr">Thiruvananthapuram, Kerala, India&nbsp; ·&nbsp; www.alizongov.com</div>'
      +'</div>'
      +'</header>'
      +'<div class="d-lh-affil">An initiative under <b>ASAP Kerala</b> — Additional Skill Acquisition Programme, Department of Higher Education, Government of Kerala&nbsp; ·&nbsp; Registered with <b>Kerala Startup Mission</b></div>';
  }
  function statTile(label,val){
    if(val==null||val==='') return '';
    return '<div class="d-stat"><span class="ds-v">'+esc(val)+'</span><span class="ds-l">'+esc(label)+'</span></div>';
  }
  function render(el, course){
    if(!el) return;
    if(!course){ el.innerHTML='<div class="cur-empty">Choose a course above to view its official curriculum &amp; syllabus.</div>'; return; }
    var m=course.meta||{}, mods=course.modules||[];
    var totH=mods.reduce(function(a,x){return a+((x.hours&&x.hours.total)||0);},0);

    var html='<article class="alz-doc" id="alzDoc">';
    html+=letterhead();
    html+='<div class="d-docbody">';

    /* toolbar (screen only) */
    html+='<div class="d-actions no-print">'
      +'<button type="button" class="d-print d-dl" onclick="AlizonCurriculum.printDoc()">Download PDF</button>'
      +'<button type="button" class="d-print d-pr" onclick="AlizonCurriculum.printDoc()">Print</button>'
      +'</div>';

    /* document title band */
    html+='<div class="d-title">'
      +'<div class="d-kicker">Curriculum &amp; Syllabus</div>'
      +'<h2 class="d-name">'+esc(m.name||'Curriculum')+'</h2>'
      +'<div class="d-sub">'
        +(m.code?'<span>Programme code&nbsp; <b>'+esc(m.code)+'</b></span>':'')
        +(m.category?'<span>'+esc(m.category)+'</span>':'')
      +'</div></div>';

    /* overview stat tiles */
    var d=m.duration||{}, dTot=num(d.total)||totH;
    html+='<div class="d-stats">'
      + statTile('Duration', dTot?dTot+' hrs':'')
      + statTile('Theory · Practical', (num(d.t)||num(d.p))?(num(d.t)+' · '+num(d.p)+' hrs'):(totH?totH+' hrs':''))
      + statTile('OJT · Internship', (num(d.ojt)||num(d.intern))?(num(d.ojt)+' · '+num(d.intern)+' hrs'):'')
      + statTile('Modules', mods.length)
      + statTile('Maximum marks', m.maxMarks)
      + statTile('Pass criterion', m.passMark)
      +'</div>';
    if(m.mode) html+='<div class="d-mode"><span class="dm-l">Mode of delivery</span><span class="dm-v">'+esc(m.mode)+'</span></div>';

    /* programme objective & outcome */
    if(m.objective || m.outcome){
      html+='<h3 class="d-sec">Programme Objective &amp; Outcome</h3><div class="d-cards">';
      if(m.objective) html+='<div class="d-card"><span class="d-field-l">Course Objective</span><p>'+nlToBr(m.objective)+'</p></div>';
      if(m.outcome)   html+='<div class="d-card"><span class="d-field-l">Course Outcome</span><p>'+nlToBr(m.outcome)+'</p></div>';
      html+='</div>';
    }

    /* programme particulars — the ASAP filing fields, as a definition grid */
    var facts=[
      ['Type of course', m.type], ['Skill sector / area', m.sector],
      ['NQR code &amp; version', m.nqr], ['Eligibility', m.eligibilityDetail || m.eligibility],
      ['Medium of instruction', m.medium], ['Batch size', m.batchSize],
      ['Computer lab', m.computerLab], ['Skill lab', m.skillLab],
      ['OJT / Internship', m.ojtIncluded], ['Assessment strategy', m.assessment],
      ['Mode of assessment', m.assessMode], ['Medium of assessment', m.assessMedium],
      ['Duration of ECE', m.eceDuration], ['NSQF filing', m.nsqf],
      ['Training provider', m.provider]
    ].filter(function(f){ return txt(f[1]); });
    if(facts.length){
      html+='<h3 class="d-sec">Programme Particulars</h3><dl class="d-facts">';
      facts.forEach(function(f){ html+='<div class="d-fact"><dt>'+f[0]+'</dt><dd>'+nlToBr(f[1])+'</dd></div>'; });
      html+='</dl>';
    }

    /* assessment & hours structure table */
    html+='<h3 class="d-sec">Assessment &amp; Hours Structure</h3>';
    html+='<div class="cur-tblwrap"><table class="cur-tbl"><thead>'
      +'<tr><th rowspan="2">#</th><th rowspan="2">Module</th><th colspan="5">Training Hours</th><th colspan="5">Continuous Evaluation</th><th colspan="5">End-course Examination</th></tr>'
      +'<tr><th>T</th><th>P</th><th>OJT</th><th>Int</th><th>Tot</th><th>T</th><th>P</th><th>Att</th><th>Asg</th><th>Tot</th><th>Th</th><th>Pr</th><th>Prj</th><th>Viva</th><th>Tot</th></tr>'
      +'</thead><tbody>';
    var sumH={t:0,p:0,ojt:0,intern:0,total:0}, sumCE={t:0,p:0,att:0,asgn:0,total:0}, sumEC={theory:0,practical:0,project:0,viva:0,total:0};
    mods.forEach(function(x){
      var h=x.hours||{}, ce=x.ce||{}, ec=x.ece||{};
      ['t','p','ojt','intern','total'].forEach(function(k){ sumH[k]+=num(h[k]); });
      ['t','p','att','asgn','total'].forEach(function(k){ sumCE[k]+=num(ce[k]); });
      ['theory','practical','project','viva','total'].forEach(function(k){ sumEC[k]+=num(ec[k]); });
      function c(v){ return '<td>'+(v?v:'<span class="z">–</span>')+'</td>'; }
      html+='<tr><td class="mno">'+esc(x.no)+'</td><td class="mnm">'+esc(x.name)+'</td>'
        +c(h.t)+c(h.p)+c(h.ojt)+c(h.intern)+'<td class="tot">'+(h.total||'')+'</td>'
        +c(ce.t)+c(ce.p)+c(ce.att)+c(ce.asgn)+'<td class="tot">'+(ce.total||'')+'</td>'
        +c(ec.theory)+c(ec.practical)+c(ec.project)+c(ec.viva)+'<td class="tot">'+(ec.total||'')+'</td></tr>';
    });
    function tc(v){ return '<td>'+(v||'<span class="z">–</span>')+'</td>'; }
    html+='<tr class="trow"><td></td><td class="mnm">Total</td>'
      +tc(sumH.t)+tc(sumH.p)+tc(sumH.ojt)+tc(sumH.intern)+'<td class="tot">'+(sumH.total||'')+'</td>'
      +tc(sumCE.t)+tc(sumCE.p)+tc(sumCE.att)+tc(sumCE.asgn)+'<td class="tot">'+(sumCE.total||'')+'</td>'
      +tc(sumEC.theory)+tc(sumEC.practical)+tc(sumEC.project)+tc(sumEC.viva)+'<td class="tot">'+(sumEC.total||'')+'</td></tr>';
    html+='</tbody></table></div>';
    html+='<div class="d-legend">T — Theory&nbsp; ·&nbsp; P — Practical&nbsp; ·&nbsp; OJT — On-the-Job Training&nbsp; ·&nbsp; Int — Internship&nbsp; ·&nbsp; Att — Attendance&nbsp; ·&nbsp; Asg — Assignment&nbsp; ·&nbsp; Th — Theory&nbsp; ·&nbsp; Pr — Practical&nbsp; ·&nbsp; Prj — Project</div>';

    /* detailed syllabus — collapsible module accordion (click a module to reveal its detail) */
    html+='<div class="d-secrow"><h3 class="d-sec">Detailed Syllabus</h3>'
      +'<button type="button" class="d-expand no-print" onclick="AlizonCurriculum.toggleAll(this)">Collapse all</button></div>';
    html+='<div class="d-hint no-print">Every module is shown in full below — use a module title (or the button above) to collapse.</div>';
    html+='<div class="d-mods">';
    mods.forEach(function(x){
      var h=x.hours||{};
      html+='<details class="d-mod" open>'
        +'<summary class="d-mod-h"><span class="d-mod-no">Module '+esc(x.no)+'</span>'
        +'<span class="d-mod-nm">'+esc(x.name)+'</span>'
        +'<span class="d-mod-meta">'+(h.total?h.total+' hrs':'')+(x.ece&&x.ece.total?'&nbsp; ·&nbsp; '+x.ece.total+' marks':'')+'</span>'
        +'<span class="d-mod-tg" aria-hidden="true">+</span></summary>'
        +'<div class="d-mod-b">';
      var any=false;
      if(hoursChips(h)){ html+='<div class="d-chips">'+esc(hoursChips(h))+'&nbsp; ·&nbsp; Total '+(h.total||0)+' hrs</div>'; any=true; }
      if(x.objective){   html+='<div class="d-field"><span class="d-field-l">Learning Objective</span><p>'+nlToBr(x.objective)+'</p></div>'; any=true; }
      if(x.outcome){     html+='<div class="d-field"><span class="d-field-l">Learning Outcome</span><p>'+nlToBr(x.outcome)+'</p></div>'; any=true; }
      if(x.methodology){ html+='<div class="d-field"><span class="d-field-l">Methodology &amp; Tools</span><p>'+nlToBr(x.methodology)+'</p></div>'; any=true; }
      if(x.units&&x.units.length){
        html+='<div class="d-field"><span class="d-field-l">Units &amp; Topics</span><div class="d-units">';
        x.units.forEach(function(u){
          html+='<div class="d-unit"><div class="du-h"><span class="du-no">'+(u.no?'Unit '+esc(u.no):'Unit')+'</span>'
            +(u.total?'<span class="du-hrs">'+u.total+' hrs</span>':'')+'</div>'
            +'<div class="du-t">'+nlToBr(u.topics)+'</div></div>';
        });
        html+='</div></div>'; any=true;
      }
      if(!any) html+='<div class="d-empty2">Detailed topics for this module will be published shortly.</div>';
      html+='</div></details>';
    });
    html+='</div>';

    /* training delivery — OJT, internship and lab requirements */
    var plans=[
      ['On-the-Job Training (OJT)', m.ojtPlan], ['Internship', m.internPlan],
      ['Computer lab requirements', m.computerLabKit], ['Skill lab requirements', m.skillLabKit]
    ].filter(function(f){ return txt(f[1]); });
    if(plans.length){
      html+='<h3 class="d-sec">Training Delivery, OJT &amp; Internship</h3><div class="d-cards">';
      plans.forEach(function(f){ html+='<div class="d-card"><span class="d-field-l">'+f[0]+'</span><p>'+nlToBr(f[1])+'</p></div>'; });
      html+='</div>';
    }

    /* prescribed reading */
    if(m.books && m.books.length){
      html+='<h3 class="d-sec">Text &amp; Reference Books</h3><ol class="d-books">';
      m.books.forEach(function(b){ html+='<li>'+nlToBr(b)+'</li>'; });
      html+='</ol>';
    }

    html+='</div>'; /* /.d-docbody */

    /* document footer */
    html+='<footer class="d-foot">'
      +'<div class="d-foot-rule"></div>'
      +'<p>This curriculum is delivered in accordance with the ASAP Kerala framework. '
      +'The document is issued by the Controller of Examinations, Alizon School of Medical &amp; Digital Intelligence, and is a system-generated academic record.</p>'
      +'<div class="d-foot-brand">Alizon School of Medical &amp; Digital Intelligence&nbsp; ·&nbsp; Thiruvananthapuram, Kerala&nbsp; ·&nbsp; www.alizongov.com</div>'
      +'</footer>';

    html+='</article>';
    el.innerHTML=html;
  }

  /* expand / collapse all module sections */
  function toggleAll(btn){
    var scope=(btn&&btn.closest)?btn.closest('.alz-doc'):null;
    var mods=(scope||document).querySelectorAll('.d-mod');
    var anyClosed=false; [].forEach.call(mods,function(d){ if(!d.open) anyClosed=true; });
    [].forEach.call(mods,function(d){ d.open=anyClosed; });
    if(btn) btn.textContent=anyClosed?'Collapse all':'Expand all';
  }
  /* open every module then invoke the browser print dialog (Save as PDF or print) */
  function printDoc(){
    [].forEach.call(document.querySelectorAll('.alz-doc .d-mod'),function(d){ d.open=true; });
    var btn=document.querySelector('.alz-doc .d-expand'); if(btn) btn.textContent='Collapse all';
    var doc=document.getElementById('alzDoc');
    setTimeout(function(){
      /* professional multi-page output: letterhead + affiliation repeat on every
         A4 page and the footer carries "Page X of Y" (shared LHPrint paginator) */
      if(window.LHPrint && doc){
        try{ LHPrint(doc,{ headerEnd:'.d-lh-affil', footer:'.d-foot',
          flatten:['.d-docbody','.d-mods','.d-mod','.d-mod-b','.d-units','.d-cards','.d-facts','.d-books'] }); return; }catch(e){}
      }
      try{ window.print(); }catch(e){}
    }, 60);
  }

  /* inject styles once */
  if(!document.getElementById('alzCurCss')){
    var st=document.createElement('style'); st.id='alzCurCss';
    st.textContent=
       '.alz-doc{--cr:#8c1515;--cr2:#6b0f0f;--gold:#9a7b3f;--ink:#26221f;--muted:#6e6a63;'
      +'max-width:900px;margin:0 auto;color:var(--ink);font-family:"Source Sans 3","Source Sans Pro",-apple-system,Helvetica,Arial,sans-serif}'
      /* ---- letterhead ---- */
      +'.alz-doc .d-lh{display:flex;align-items:center;gap:18px;padding-bottom:16px;border-bottom:2.5px solid var(--cr)}'
      +'.alz-doc .d-lh-logo{width:66px;height:66px;object-fit:contain;flex:none}'
      +'.alz-doc .d-lh-name{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(18px,2.6vw,25px);font-weight:700;color:var(--cr);line-height:1.15;letter-spacing:.2px}'
      +'.alz-doc .d-lh-tag{font-size:12.5px;font-style:italic;color:var(--muted);margin-top:3px}'
      +'.alz-doc .d-lh-addr{font-size:11.5px;letter-spacing:.04em;color:#8a827b;margin-top:5px;font-weight:600}'
      +'.alz-doc .d-lh-affil{font-size:11px;line-height:1.5;color:#5f5a54;background:linear-gradient(90deg,rgba(154,123,63,.1),rgba(154,123,63,.02));border-left:3px solid var(--gold);padding:7px 12px;margin-top:10px;border-radius:0 6px 6px 0}'
      +'.alz-doc .d-lh-affil b{color:var(--cr2)}'
      /* ---- actions ---- */
      +'.alz-doc .d-actions{display:flex;justify-content:flex-end;gap:10px;margin:16px 0 4px}'
      +'.alz-doc .d-print{cursor:pointer;font:inherit;font-size:13px;font-weight:600;border-radius:100px;padding:9px 20px}'
      +'.alz-doc .d-dl{color:#fff;background:var(--cr);border:1px solid var(--cr)}'
      +'.alz-doc .d-dl:hover{background:var(--cr2)}'
      +'.alz-doc .d-pr{color:var(--cr);background:#fff;border:1px solid rgba(140,21,21,.4)}'
      +'.alz-doc .d-pr:hover{background:var(--cr);color:#fff}'
      /* ---- title band ---- */
      +'.alz-doc .d-title{text-align:center;padding:14px 0 6px;margin-top:6px}'
      +'.alz-doc .d-kicker{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--gold)}'
      +'.alz-doc .d-name{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(20px,3.2vw,27px);font-weight:700;color:var(--cr);margin:8px 0 0;line-height:1.25}'
      +'.alz-doc .d-sub{display:flex;gap:10px 20px;justify-content:center;flex-wrap:wrap;margin-top:8px;font-size:12.5px;color:var(--muted)}'
      +'.alz-doc .d-sub b{color:var(--cr)}'
      /* ---- stat tiles ---- */
      +'.alz-doc .d-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:22px 0 8px}'
      +'.alz-doc .d-stat{border:1px solid rgba(0,0,0,.1);border-top:3px solid var(--cr);border-radius:10px;padding:14px 14px;text-align:center;background:#fff;box-shadow:0 8px 22px -18px rgba(20,18,16,.4)}'
      +'.alz-doc .ds-v{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:19px;font-weight:700;color:var(--cr);line-height:1.2}'
      +'.alz-doc .ds-l{display:block;font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-top:6px}'
      +'.alz-doc .d-mode{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-top:12px;border:1px solid rgba(0,0,0,.1);border-left:3px solid var(--gold);border-radius:0 8px 8px 0;padding:11px 15px;background:#faf8f6}'
      +'.alz-doc .dm-l{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);flex:none}'
      +'.alz-doc .dm-v{font-size:13.5px;font-weight:600;color:var(--ink)}'
      /* ---- objective / outcome / plan cards ---- */
      +'.alz-doc .d-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}'
      +'.alz-doc .d-card{border:1px solid rgba(0,0,0,.1);border-left:3px solid var(--cr);border-radius:0 10px 10px 0;padding:14px 17px;background:#faf8f6}'
      +'.alz-doc .d-card p{font-size:13.5px;line-height:1.65;margin:0}'
      /* ---- particulars grid ---- */
      +'.alz-doc .d-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.1);border-radius:10px;overflow:hidden}'
      +'.alz-doc .d-fact{background:#fff;padding:11px 15px}'
      +'.alz-doc .d-fact dt{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--gold);margin-bottom:4px}'
      +'.alz-doc .d-fact dd{font-size:13px;line-height:1.55;color:var(--ink);margin:0}'
      /* ---- reference books ---- */
      +'.alz-doc .d-books{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:8px}'
      +'.alz-doc .d-books li{font-size:13.5px;line-height:1.6;color:var(--ink);padding-left:4px}'
      +'.alz-doc .d-books li::marker{color:var(--cr);font-weight:700}'
      /* ---- section heading ---- */
      +'.alz-doc .d-sec{font-family:"Source Serif Pro",Georgia,serif;font-size:17px;font-weight:700;color:var(--ink);margin:30px 0 12px;padding-bottom:7px;border-bottom:1px solid rgba(140,21,21,.2);display:flex;align-items:center;gap:9px}'
      +'.alz-doc .d-sec:before{content:"";width:8px;height:18px;background:var(--cr);border-radius:2px;display:inline-block}'
      /* ---- table ---- */
      +'.alz-doc .cur-tblwrap{overflow-x:auto;border:1px solid rgba(0,0,0,.12);border-radius:10px}'
      +'.alz-doc .cur-tbl{border-collapse:collapse;width:100%;min-width:780px;font-size:13px}'
      +'.alz-doc .cur-tbl th{background:var(--cr);color:#fff;font-weight:600;padding:9px 7px;text-align:center;border:1px solid rgba(255,255,255,.18);font-size:11px;letter-spacing:.02em}'
      +'.alz-doc .cur-tbl td{padding:9px 7px;text-align:center;border:1px solid rgba(0,0,0,.08);color:var(--ink)}'
      +'.alz-doc .cur-tbl td.mno{font-weight:700;color:var(--cr)}'
      +'.alz-doc .cur-tbl td.mnm{text-align:left;font-weight:600;min-width:210px}'
      +'.alz-doc .cur-tbl td.tot{font-weight:700;background:#faf3f3}'
      +'.alz-doc .cur-tbl .z{color:#c9c2ba}'
      +'.alz-doc .cur-tbl tbody tr:nth-child(even){background:#faf8f6}'
      +'.alz-doc .cur-tbl tr.trow td{background:var(--cr);color:#fff;font-weight:700;border-color:rgba(255,255,255,.18)}'
      +'.alz-doc .cur-tbl tr.trow td.tot{background:var(--cr2)}'
      +'.alz-doc .cur-tbl tr.trow .z{color:rgba(255,255,255,.4)}'
      +'.alz-doc .d-legend{font-size:10.5px;color:var(--muted);margin:8px 2px 0;line-height:1.6}'
      /* ---- module sections ---- */
      +'.alz-doc .d-secrow{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:30px 0 4px;padding-bottom:7px;border-bottom:1px solid rgba(140,21,21,.2)}'
      +'.alz-doc .d-secrow .d-sec{margin:0;padding:0;border:none}'
      +'.alz-doc .d-expand{cursor:pointer;font:inherit;font-size:12px;font-weight:600;color:var(--cr);background:#fff;border:1px solid rgba(140,21,21,.35);border-radius:100px;padding:6px 15px;flex:none}'
      +'.alz-doc .d-expand:hover{background:var(--cr);color:#fff}'
      +'.alz-doc .d-hint{font-size:12px;color:var(--muted);margin:0 2px 12px}'
      +'.alz-doc .d-mods{display:flex;flex-direction:column;gap:12px}'
      +'.alz-doc .d-mod{border:1px solid rgba(0,0,0,.12);border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 10px 26px -22px rgba(20,18,16,.45)}'
      +'.alz-doc summary.d-mod-h{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:13px 18px;cursor:pointer;list-style:none;user-select:none;background:linear-gradient(90deg,rgba(140,21,21,.06),rgba(140,21,21,0))}'
      +'.alz-doc summary.d-mod-h::-webkit-details-marker{display:none}'
      +'.alz-doc summary.d-mod-h:hover{background:linear-gradient(90deg,rgba(140,21,21,.11),rgba(140,21,21,.02))}'
      +'.alz-doc .d-mod[open]>summary.d-mod-h{border-bottom:1px solid rgba(140,21,21,.14)}'
      +'.alz-doc .d-mod-tg{width:24px;height:24px;border-radius:50%;background:var(--cr);color:#fff;display:grid;place-items:center;font-size:17px;font-weight:700;line-height:1;flex:none;transition:transform .2s}'
      +'.alz-doc .d-mod[open] .d-mod-tg{transform:rotate(45deg)}'
      +'.alz-doc .d-empty2{font-size:12.5px;color:var(--muted);font-style:italic}'
      +'.alz-doc .d-mod-no{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--cr);border-radius:100px;padding:5px 13px;flex:none}'
      +'.alz-doc .d-mod-nm{font-family:"Source Serif Pro",Georgia,serif;font-size:16.5px;font-weight:700;flex:1;min-width:180px;margin:0;color:var(--cr)}'
      +'.alz-doc .d-mod-meta{font-size:12px;color:var(--muted);font-weight:600}'
      +'.alz-doc .d-mod-b{padding:16px 20px 18px}'
      +'.alz-doc .d-chips{font-size:11.5px;font-weight:700;color:var(--cr);background:rgba(140,21,21,.06);border:1px solid rgba(140,21,21,.16);border-radius:100px;padding:6px 14px;display:inline-block;margin-bottom:14px}'
      +'.alz-doc .d-field{margin-top:14px}'
      +'.alz-doc .d-field:first-child{margin-top:0}'
      +'.alz-doc .d-field-l{font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:6px}'
      +'.alz-doc .d-field p{font-size:13.5px;line-height:1.65;color:var(--ink);margin:0}'
      +'.alz-doc .d-units{display:flex;flex-direction:column;gap:9px}'
      +'.alz-doc .d-unit{border:1px solid rgba(0,0,0,.09);border-left:3px solid var(--gold);border-radius:8px;padding:11px 15px;background:#faf8f6}'
      +'.alz-doc .du-h{display:flex;gap:10px;align-items:center;margin-bottom:5px}'
      +'.alz-doc .du-no{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--cr)}'
      +'.alz-doc .du-hrs{margin-left:auto;font-size:11px;font-weight:700;color:var(--muted)}'
      +'.alz-doc .du-t{font-size:13px;line-height:1.6;color:var(--ink)}'
      /* ---- footer ---- */
      +'.alz-doc .d-foot{margin-top:30px}'
      +'.alz-doc .d-foot-rule{height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));border-radius:2px}'
      +'.alz-doc .d-foot p{font-size:11.5px;line-height:1.6;color:var(--muted);margin:12px 0 8px;text-align:center}'
      +'.alz-doc .d-foot-brand{font-size:11px;font-weight:700;letter-spacing:.05em;color:var(--cr);text-align:center}'
      +'.cur-empty{color:#6e6a63;font-size:14px;padding:26px 0;text-align:center}'
      /* ---- print: clean official A4 document, chrome hidden ---- */
      +'@media print{body{background:#fff!important}'
      +'.nav,.strip,.pick,.admin,footer,#alizonBack,.alz-back,.no-print,.alz-doc .d-mod-tg{display:none!important}'
      +'main,.wrap,.box{padding:0!important;margin:0!important;border:none!important;box-shadow:none!important;max-width:none!important;background:#fff!important}'
      +'.alz-doc{max-width:none}'
      +'.alz-doc .d-mod,.alz-doc .d-stat,.alz-doc .cur-tblwrap,.alz-doc .d-card,.alz-doc .d-fact,.alz-doc .d-books li{box-shadow:none!important;break-inside:avoid}'
      +'.alz-doc .d-sec{break-after:avoid}}';
    document.head.appendChild(st);
    /* Ctrl/Cmd+P or OS print: open every module so the PDF shows the full syllabus */
    window.addEventListener('beforeprint',function(){ [].forEach.call(document.querySelectorAll('.alz-doc .d-mod'),function(d){ d.open=true; }); });
  }

  window.AlizonCurriculum={ parseWorkbook:parseWorkbook, render:render, courseKey:courseKey, get:get, list:list, findForCourse:findForCourse, store:store, toggleAll:toggleAll, printDoc:printDoc };
})();
