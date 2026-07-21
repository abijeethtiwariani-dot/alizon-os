/* alizon-practical-submit.js
   Shared "Submit report to faculty" widget for every practical lab.
   Writes an alizonSubmissions entry (type:'practical') containing the student's
   final report + result, so the faculty portal can evaluate it and the mark
   flows back to the student's result summary.

   Usage from a practical:
     AlizonPracticalSubmit.mount({
       module: 'Module 2 · Unit 1 — Digital Dispensing (FEFO/FIFO)',
       title:  'Digital Dispensing — FEFO/FIFO & Counselling',
       programme: 'Pharmacy AI',
       getReport: function(){
         // return null if the student hasn't finished yet, else:
         return { html:'<...report html...>', pct: 84, resultText:'PASS (84%)', name:'', reg:'' };
       }
     });
*/
(function(){
  if(window.AlizonPracticalSubmit) return;
  function J(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function profile(){ var p=J('alizonProfile',{}); return (p&&typeof p==='object')?p:{}; }
  function progName(){
    try{ var ap=localStorage.getItem('alizonActiveProgram'); if(ap) return ap; }catch(e){}
    var p=profile(); return p.programme||p.course||'';
  }
  function fmtNow(){ try{ var d=new Date(); return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } }

  function wrapReport(o,name,reg){
    return '<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1516;max-width:820px;margin:0 auto;padding:6px">'
      /* ===== ALIZON LETTERHEAD ===== */
      +'<table role="presentation" width="100%" style="border-collapse:collapse;border-bottom:2.5px solid #8c1515;padding-bottom:8px"><tr>'
        +'<td style="width:70px;vertical-align:middle;padding-bottom:10px">'
          +'<img src="/alizon-logo.png" alt="Alizon" width="60" height="60" style="display:block;object-fit:contain" '
          +'onerror="this.style.display=\'none\'"></td>'
        +'<td style="vertical-align:middle;padding:0 0 10px 6px">'
          +'<div style="font-family:Georgia,\'Source Serif Pro\',serif;font-weight:700;color:#8c1515;font-size:18px;line-height:1.2">Alizon School of Medical &amp; Digital Intelligence</div>'
          +'<div style="font-size:11.5px;font-style:italic;color:#6e6a63;margin-top:2px">Advancing Artificial Intelligence in Healthcare Education</div>'
          +'<div style="font-size:10.5px;letter-spacing:.04em;color:#8a827b;margin-top:3px;font-weight:600">Thiruvananthapuram, Kerala, India&nbsp; ·&nbsp; www.alizon.in</div>'
        +'</td>'
      +'</tr></table>'
      +'<div style="font-size:9.8px;line-height:1.5;color:#5f5a54;background:#faf4f2;border-left:3px solid #9a7b3f;padding:6px 10px;margin:8px 0 14px">'
        +'An initiative under <b>ASAP Kerala</b> — Additional Skill Acquisition Programme, Department of Higher Education, Government of Kerala&nbsp; ·&nbsp; Registered with <b>Kerala Startup Mission</b></div>'
      /* ===== document title ===== */
      +'<div style="text-align:center;margin:6px 0 14px">'
        +'<div style="font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#9a7b3f;font-weight:700">Practical Report</div>'
        +'<div style="font-family:Georgia,\'Source Serif Pro\',serif;font-size:16px;font-weight:700;color:#26221f;margin-top:3px">'+esc(o.module||'')+'</div>'
      +'</div>'
      /* ===== candidate line ===== */
      +'<div style="font-size:12px;color:#333;margin-bottom:14px;line-height:1.7;border:1px solid #eadfd9;border-radius:8px;padding:9px 12px;background:#fbfaf9">'
        +'<b>Candidate:</b> '+esc(name||'—')+(reg?' ('+esc(reg)+')':'')+' &nbsp;&middot;&nbsp; '
        +'<b>Programme:</b> '+esc(o.programme||progName()||'—')+' &nbsp;&middot;&nbsp; '
        +'<b>Submitted:</b> '+esc(fmtNow())
        +(o.resultText?' &nbsp;&middot;&nbsp; <b>Final result:</b> '+esc(o.resultText):'')
      +'</div>'
      +'<div>'+(o.html||'')+'</div>'
      /* ===== footer ===== */
      +'<div style="border-top:2px solid #8c1515;margin-top:18px;padding-top:8px">'
        +'<div style="font-size:10.5px;color:#8a827b;line-height:1.6">This is a system-generated practical report issued by the Controller of Examinations, Alizon School of Medical &amp; Digital Intelligence. Awaiting faculty evaluation · Pass mark 50%.</div>'
        +'<div style="font-size:10.5px;font-weight:700;color:#8c1515;margin-top:4px">Alizon School of Medical &amp; Digital Intelligence&nbsp; ·&nbsp; Thiruvananthapuram, Kerala&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</div>'
    +'</div>';
  }

  function pushSubmission(sub){
    var subs=J('alizonSubmissions',[]); if(!Array.isArray(subs)) subs=[];
    subs.push(sub);
    try{ localStorage.setItem('alizonSubmissions', JSON.stringify(subs)); }catch(e){}
    /* nudge firebase-sync (this page or the parent dashboard) to mirror it to the cloud */
    try{ window.dispatchEvent(new StorageEvent('storage',{key:'alizonSubmissions'})); }catch(e){}
    try{ if(window.parent&&window.parent!==window) window.parent.postMessage({type:'alizon-submission',id:sub.id,module:sub.module},'*'); }catch(e){}
  }

  /* --- minimal modal for confirm + name/reg fallback --- */
  function modal(html){
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:2147483000;background:rgba(10,6,8,.55);display:flex;align-items:center;justify-content:center;padding:18px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif';
    ov.innerHTML='<div style="background:#fff;color:#1a1516;max-width:440px;width:100%;border-radius:16px;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);padding:22px 22px 18px">'+html+'</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function doSubmit(opts, report){
    var p=profile();
    var name=(report.name||p.name||'').trim(), reg=(report.reg||p.reg||'').trim();
    var need = !name || !reg;
    var idBar='<div style="font-weight:700;font-size:17px;margin-bottom:4px">Submit report to faculty</div>'
      +'<div style="font-size:12.5px;color:#6e6a63;margin-bottom:14px">Your final report &amp; result will be sent to your faculty for evaluation. You will see the mark in your student portal once graded.</div>';
    var idFields = need
      ? '<label style="display:block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#8a827b;margin:0 0 5px">Your name</label>'
        +'<input id="apsName" value="'+esc(name)+'" placeholder="Full name" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:9px;font:inherit;margin-bottom:10px">'
        +'<label style="display:block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#8a827b;margin:0 0 5px">Registration no.</label>'
        +'<input id="apsReg" value="'+esc(reg)+'" placeholder="e.g. ALZ102" style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:9px;font:inherit;margin-bottom:14px">'
      : '<div style="font-size:13px;color:#333;background:#faf6f4;border:1px solid #eaded8;border-radius:10px;padding:10px 12px;margin-bottom:14px"><b>'+esc(name)+'</b>'+(reg?' ('+esc(reg)+')':'')+'<br><span style="font-size:12px;color:#6e6a63">'+esc(opts.module||'')+(report.resultText?' · '+esc(report.resultText):'')+'</span></div>';
    var ov=modal(idBar+idFields
      +'<div style="display:flex;gap:10px;justify-content:flex-end">'
      +'<button id="apsCancel" style="cursor:pointer;font:inherit;font-weight:600;font-size:13px;padding:10px 16px;border-radius:100px;border:1px solid #ccc;background:#fff;color:#333">Cancel</button>'
      +'<button id="apsGo" style="cursor:pointer;font:inherit;font-weight:700;font-size:13px;padding:10px 20px;border-radius:100px;border:none;background:linear-gradient(120deg,#6b0f0f,#8c1515);color:#fff">Submit to faculty</button>'
      +'</div>');
    ov.querySelector('#apsCancel').onclick=function(){ document.body.removeChild(ov); };
    ov.querySelector('#apsGo').onclick=function(){
      var nm=name, rg=reg;
      if(need){ nm=(ov.querySelector('#apsName').value||'').trim(); rg=(ov.querySelector('#apsReg').value||'').trim();
        if(!nm||!rg){ alert('Please enter your name and registration number.'); return; } }
      var pct=(report.pct!=null && isFinite(report.pct))?Math.round(report.pct):null;
      var sub={
        id:'P'+Date.now()+'-'+Math.floor(Math.random()*100000),
        type:'practical', typeLabel:'Practical',
        module:opts.module||opts.title||'Practical', title:opts.title||opts.module||'Practical',
        name:nm, reg:rg, programme:report.programme||opts.programme||progName()||'',
        ts:Date.now(),
        html:wrapReport({module:opts.module,programme:opts.programme,resultText:report.resultText,html:report.html},nm,rg),
        status:'submitted'
      };
      if(pct!=null) sub.ai={grade:String(pct), mark:pct, verdict:report.resultText||('Auto-scored '+pct+'%'), feedback:report.resultText||''};
      pushSubmission(sub);
      document.body.removeChild(ov);
      setState('done');
      modalDone(nm,rg,opts);
    };
  }

  function modalDone(nm,rg,opts){
    var ov=modal('<div style="text-align:center">'
      +'<div style="width:52px;height:52px;border-radius:50%;background:#e7f5ec;color:#137a3a;display:flex;align-items:center;justify-content:center;font-size:28px;margin:2px auto 12px">✓</div>'
      +'<div style="font-weight:700;font-size:17px;margin-bottom:6px">Report submitted to faculty</div>'
      +'<div style="font-size:13px;color:#6e6a63;line-height:1.6;margin-bottom:16px">Your practical report for <b>'+esc(opts.module||'')+'</b> has been sent for evaluation. Your faculty will grade it out of 100 — the result will appear in your <b>student portal → Assessments</b>.</div>'
      +'<button id="apsOk" style="cursor:pointer;font:inherit;font-weight:700;font-size:13px;padding:10px 24px;border-radius:100px;border:none;background:linear-gradient(120deg,#6b0f0f,#8c1515);color:#fff">Done</button></div>');
    ov.querySelector('#apsOk').onclick=function(){ document.body.removeChild(ov); };
  }

  var barBtn=null, curState='idle';
  function setState(s){ curState=s; if(!barBtn) return;
    if(s==='done'){ barBtn.textContent='✓ Submitted to faculty'; barBtn.style.background='linear-gradient(120deg,#137a3a,#1E8E5A)'; }
    else { barBtn.textContent='⤴ Submit report to faculty'; barBtn.style.background='linear-gradient(120deg,#6b0f0f,#8c1515)'; }
  }

  window.AlizonPracticalSubmit={
    mount:function(opts){
      opts=opts||{};
      var bar=document.createElement('div');
      bar.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147482000';
      barBtn=document.createElement('button');
      barBtn.type='button';
      barBtn.style.cssText='cursor:pointer;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-weight:700;font-size:13.5px;color:#fff;border:none;border-radius:100px;padding:13px 22px;box-shadow:0 14px 34px -12px rgba(140,21,21,.6);background:linear-gradient(120deg,#6b0f0f,#8c1515)';
      barBtn.textContent='⤴ Submit report to faculty';
      barBtn.className='no-print';
      bar.appendChild(barBtn);
      bar.className='no-print';
      var add=function(){ document.body.appendChild(bar); };
      if(document.body) add(); else document.addEventListener('DOMContentLoaded',add);
      barBtn.addEventListener('click',function(){
        var r=null;
        try{ r=opts.getReport?opts.getReport():null; }catch(e){ r=null; }
        if((!r||!r.html) && opts.reportSelector){
          var el=document.querySelector(opts.reportSelector);
          if(el && el.offsetParent!==null && el.innerHTML.trim()) r={html:el.innerHTML};
        }
        if(!r||!r.html){ alert(opts.incompleteMsg||'Please complete and generate your practical report first, then submit it to faculty.'); return; }
        doSubmit(opts,r);
      });
      return window.AlizonPracticalSubmit;
    },
    submit:function(opts,report){ doSubmit(opts||{},report||{}); },
    /* build the letterheaded report and open it in a printable window for download / Save-as-PDF */
    download:function(opts,report){
      opts=opts||{}; report=report||{};
      var p=profile();
      var name=(report.name||p.name||'').trim()||'Candidate', reg=(report.reg||p.reg||'').trim();
      var html=wrapReport({module:opts.module,programme:opts.programme,resultText:report.resultText,html:report.html||''},name,reg);
      var w=null; try{ w=window.open('','_blank'); }catch(e){ w=null; }
      if(!w){ alert('Please allow pop-ups to download your report.'); return; }
      w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+esc((opts.title||'Practical Report'))+' — Alizon</title>'
        +'<style>@page{size:A4;margin:15mm}*{box-sizing:border-box}body{margin:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
        +'.dlbar{position:fixed;top:0;left:0;right:0;background:#8c1515;color:#fff;padding:10px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;display:flex;gap:12px;align-items:center;z-index:99}'
        +'.dlbar b{flex:1}.dlbar button{cursor:pointer;font:inherit;font-weight:700;border:none;border-radius:100px;padding:8px 18px;background:#fff;color:#8c1515}'
        +'.doc{padding:70px 22px 40px}@media print{.dlbar{display:none}.doc{padding:0}}</style></head><body>'
        +'<div class="dlbar"><b>Alizon Practical Report</b><button onclick="window.print()">⤓ Download / Save as PDF</button></div>'
        +'<div class="doc">'+html+'</div>'
        +'<scr'+'ipt>setTimeout(function(){try{window.print();}catch(e){}},500);</scr'+'ipt>'
        +'</body></html>');
      w.document.close();
    }
  };
})();
