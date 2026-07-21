/* alizon-practical-report.js
   Shared "Generate Report" writer for practicals (mirrors the Module 1 Unit 1 format).
   Renders: Student name, Class/Roll no., Batch/Date, an optional titled field, and the
   standard written sections (Principle, Method, Observation, Result, Discussion, Conclusion)
   with a minimum-word gate. On "Generate report" it builds the report; the student can then
   "Submit report to faculty" (via AlizonPracticalSubmit) for evaluation.

   AlizonPracticalReport.mount({
     container:'#reportWriter', module:'…', title:'…', programme:'…',
     titleField:{label:'Name your …', placeholder:'e.g. …'},   // optional
     sections:[…],                                             // optional; defaults to the standard 6
     minWords:400,
     autoResult:function(){ return '<html result block>' | '' },  // optional auto-scored result prepended
     autoPct:function(){ return 84 | null },                      // optional provisional mark
     autoResultText:function(){ return 'PASS (84%)' | '' }
   });
*/
(function(){
  if(window.AlizonPracticalReport) return;
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function J(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function niceDate(){ try{ return new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){ return ''; } }

  var DEFAULT_SECTIONS=[
    {key:'principle',label:'Principle (in your own words)',hint:'Explain the scientific principle behind this practical and how it relates to the outcome…'},
    {key:'method',label:'Method / procedure you followed',hint:'Describe, step by step, exactly what you did in the practical…'},
    {key:'observation',label:'Observation — what did you notice?',hint:'Record what you observed while performing the practical…'},
    {key:'result',label:'Result',hint:'State your final result / output clearly, with the key values…'},
    {key:'discussion',label:'Discussion',hint:'Discuss why you obtained this result, its significance and any limitations…'},
    {key:'conclusion',label:'Conclusion',hint:'Summarise, in one or two lines, what the practical demonstrated…'}
  ];

  function injectCss(){
    if(document.getElementById('aprCss')) return;
    var st=document.createElement('style'); st.id='aprCss';
    st.textContent=
      '.apr-form{--c:var(--crimson,#8c1515);color:var(--ink,#1c1a1f);font-family:inherit;margin-top:6px}'
      +'.apr-title{font-family:"Source Serif Pro",Georgia,serif;font-size:19px;font-weight:700;margin-bottom:4px}'
      +'.apr-sub{font-size:12.5px;color:var(--muted,#6e6a63);margin-bottom:14px}'
      +'.apr-fld{margin-bottom:12px}'
      +'.apr-fld label{display:block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,#6e6a63);margin-bottom:5px}'
      +'.apr-fld input,.apr-fld textarea{width:100%;font-family:inherit;font-size:13.5px;color:var(--ink,#1c1a1f);background:var(--panel2,#f7f5f1);border:1px solid var(--line,rgba(0,0,0,.14));border-radius:9px;padding:10px 12px}'
      +'.apr-fld textarea{min-height:86px;line-height:1.55;resize:vertical}'
      +'.apr-fld input:focus,.apr-fld textarea:focus{outline:none;border-color:var(--c);box-shadow:0 0 0 3px rgba(140,21,21,.14)}'
      +'.apr-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}'
      +'.apr-wc{font-size:12.5px;color:var(--muted,#6e6a63);margin:6px 0 12px}.apr-wc b{color:var(--c)}.apr-wc.ok b{color:#1E8E5A}'
      +'.apr-btn{cursor:pointer;font-family:inherit;font-weight:700;font-size:13.5px;color:#fff;border:none;border-radius:100px;padding:12px 22px;background:linear-gradient(120deg,#6b0f0f,#8c1515)}'
      +'.apr-btn:disabled{opacity:.45;cursor:not-allowed}'
      +'.apr-out{margin-top:14px}'
      +'.apr-preview{background:#fff;color:#1a1516;border:1px solid #e2d8d2;border-radius:12px;padding:18px 20px;margin-bottom:12px;font-family:Arial,sans-serif;font-size:13px;line-height:1.6}'
      +'.apr-preview h4{font-family:Georgia,serif}';
    document.head.appendChild(st);
  }

  window.AlizonPracticalReport={
    mount:function(opts){
      opts=opts||{};
      var host=typeof opts.container==='string'?document.querySelector(opts.container):opts.container;
      if(!host) return;
      injectCss();
      var sections=opts.sections||DEFAULT_SECTIONS;
      var minWords=opts.minWords||400;
      var pf=J('alizonProfile',{}); if(!pf||typeof pf!=='object') pf={};
      function fld(id,label,ph,val){ return '<div class="apr-fld"><label>'+esc(label)+'</label><input id="'+id+'" value="'+esc(val||'')+'" placeholder="'+esc(ph)+'" autocomplete="off"></div>'; }
      function area(id,label,ph){ return '<div class="apr-fld"><label>'+esc(label)+'</label><textarea id="'+id+'" placeholder="'+esc(ph)+'"></textarea></div>'; }

      host.innerHTML='<div class="apr-form">'
        +'<div class="apr-title">Generate Report</div>'
        +'<div class="apr-sub">Write up your practical, then generate and submit it — your faculty will evaluate it out of 100.</div>'
        +'<div class="apr-row">'
          +fld('apr-name','Student name','Your full name',pf.name||'')
          +fld('apr-class','Class / Roll no.','e.g. B.Pharm II · 21','')
          +fld('apr-batch','Batch / Date',niceDate(),pf.batch||'')
        +'</div>'
        +(opts.titleField?fld('apr-titlefield',opts.titleField.label,opts.titleField.placeholder,''):'')
        +sections.map(function(s){ return area('apr-'+s.key,s.label,s.hint); }).join('')
        +'<div class="apr-wc" id="aprWcWrap">Your writing: <b id="aprWc">0</b> / '+minWords+' words minimum</div>'
        +'<button type="button" class="apr-btn" id="aprGen" disabled>Generate report</button>'
        +'<div class="apr-out" id="aprOut"></div>'
        +'</div>';

      var areas=sections.map(function(s){ return host.querySelector('#apr-'+s.key); });
      var gen=host.querySelector('#aprGen'), wcEl=host.querySelector('#aprWc'), wcWrap=host.querySelector('#aprWcWrap');
      function words(){ var t=areas.map(function(a){return a.value;}).join(' ').replace(/\s+/g,' ').trim(); return t?t.split(' ').length:0; }
      function upd(){ var n=words(); wcEl.textContent=n; var ok=n>=minWords; gen.disabled=!ok; wcWrap.classList.toggle('ok',ok); }
      areas.forEach(function(a){ a.addEventListener('input',upd); });
      function v(id){ var e=host.querySelector('#'+id); return e?(e.value||'').trim():''; }

      gen.addEventListener('click',function(){
        var name=v('apr-name'); if(!name){ alert('Please enter your name.'); host.querySelector('#apr-name').focus(); return; }
        var cls=v('apr-class'), batch=v('apr-batch'), reg=pf.reg||'';
        var body='';
        body+='<p style="font-family:Arial,sans-serif;font-size:12px;color:#333"><b>Student:</b> '+esc(name)+(reg?' ('+esc(reg)+')':'')
             +(cls?' &nbsp;·&nbsp; <b>Class/Roll:</b> '+esc(cls):'')+(batch?' &nbsp;·&nbsp; <b>Batch/Date:</b> '+esc(batch):'')+'</p>';
        if(opts.titleField){ var tv=v('apr-titlefield'); if(tv) body+='<p><b>'+esc(opts.titleField.label)+':</b> '+esc(tv)+'</p>'; }
        var auto=''; try{ auto=opts.autoResult?opts.autoResult():''; }catch(e){}
        if(auto) body+='<div style="margin:12px 0;padding:10px 12px;background:#faf6f4;border:1px solid #eaded8;border-radius:8px">'+auto+'</div>';
        sections.forEach(function(s){ var val=v('apr-'+s.key); if(val) body+='<h4 style="color:#8c1515;margin:14px 0 4px">'+esc(s.label)+'</h4><p style="white-space:pre-wrap;margin:0">'+esc(val)+'</p>'; });

        var pct=null,rt=''; try{ pct=opts.autoPct?opts.autoPct():null; }catch(e){} try{ rt=opts.autoResultText?opts.autoResultText():''; }catch(e){}
        var reportObj={html:body,name:name,reg:reg,pct:pct,resultText:rt};

        host.querySelector('#aprOut').innerHTML='<div class="apr-preview">'+body+'</div>'
          +'<button type="button" class="apr-btn" id="aprSubmit">⤴ Submit report to faculty</button>'
          +'<span style="font-size:12px;color:var(--muted,#6e6a63);margin-left:10px">Review your report above, then submit.</span>';
        host.querySelector('#aprSubmit').addEventListener('click',function(){
          if(window.AlizonPracticalSubmit) AlizonPracticalSubmit.submit(opts.submitOpts||{module:opts.module,title:opts.title,programme:opts.programme},reportObj);
          else alert('Submission service not loaded — please refresh and try again.');
        });
        host.querySelector('#aprOut').scrollIntoView({behavior:'smooth',block:'nearest'});
      });
      upd();
      return {refreshProfile:function(){ var p=J('alizonProfile',{}); if(p&&p.name&&!v('apr-name')) host.querySelector('#apr-name').value=p.name; }};
    }
  };
})();
