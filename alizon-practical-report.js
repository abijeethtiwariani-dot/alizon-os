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
  /* pull the Aim from the on-page experiment sheet (Module-1-Unit-1 style report format) */
  function aimFromBrief(){ try{ var d=document.querySelector('.ebx details, .acc details'); if(d){ var p=d.querySelector('.ebx-body p, .body p'); if(p) return p.innerHTML; } }catch(e){} return ''; }
  /* upload a PDF as chunked Firestore docs (sync/xdfile_<id>_<n>) — same store as portal documents */
  function xdUploadPdf(file,id){
    return new Promise(function(resolve,reject){
      if(!(window.firebase&&firebase.firestore)){ reject(new Error('no-firebase')); return; }
      var db=firebase.firestore(), r=new FileReader();
      r.onload=function(){ try{
        var b64=String(r.result).split(',')[1]||''; var CH=700000, n=Math.max(1,Math.ceil(b64.length/CH)), ops=[];
        for(var i=0;i<n;i++) ops.push(db.collection('sync').doc('xdfile_'+id+'_'+i).set({value:b64.slice(i*CH,(i+1)*CH)}));
        Promise.all(ops).then(function(){ resolve({id:id,name:file.name,chunks:n}); }).catch(reject);
      }catch(e){ reject(e); } };
      r.onerror=reject; r.readAsDataURL(file);
    });
  }

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
        +((opts.attachments&&opts.attachments.length)?('<div class="apr-fld" style="margin-top:6px"><label>Attach your work (PDF)</label>'
          +'<div style="font-size:12px;color:var(--muted,#6e6a63);margin:-2px 0 8px">Upload up to '+opts.attachments.length+' PDF file(s) of your work — they will be attached to your report for faculty.</div>'
          +opts.attachments.map(function(a,i){ return '<div style="margin-bottom:8px"><div style="font-size:12.5px;font-weight:600;margin-bottom:4px">'+esc(a.label)+'</div><input type="file" accept="application/pdf,.pdf" id="apr-att-'+i+'" style="font-size:12.5px"></div>'; }).join('')
          +'</div>'):'')
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
        /* Module-1-Unit-1 report format: Experiment · Aim · sections as formal headings · signature block */
        var RT='font-family:Georgia,\'Source Serif Pro\',serif;color:#8c1515;font-size:14.5px;font-weight:700;border-bottom:1px solid #e6d8d2;padding-bottom:3px;margin:18px 0 7px';
        var PB='font-family:Arial,sans-serif;font-size:13px;line-height:1.65;color:#26221f;margin:0;white-space:pre-wrap';
        var body='';
        body+='<p style="font-family:Arial,sans-serif;font-size:12px;color:#333;margin:0 0 2px"><b>Student:</b> '+esc(name)+(reg?' ('+esc(reg)+')':'')
             +(cls?' &nbsp;·&nbsp; <b>Class/Roll:</b> '+esc(cls):'')+(batch?' &nbsp;·&nbsp; <b>Batch/Date:</b> '+esc(batch):'')+'</p>';
        body+='<h3 style="'+RT+'">Experiment</h3><p style="'+PB+';white-space:normal"><b>'+esc(opts.module||'')+'</b></p>';
        var aim=aimFromBrief(); if(aim) body+='<h3 style="'+RT+'">Aim</h3><p style="'+PB+';white-space:normal">'+aim+'</p>';
        if(opts.titleField){ var tv=v('apr-titlefield'); if(tv) body+='<h3 style="'+RT+'">'+esc(opts.titleField.label)+'</h3><p style="'+PB+';white-space:normal">'+esc(tv)+'</p>'; }
        var auto=''; try{ auto=opts.autoResult?opts.autoResult():''; }catch(e){}
        if(auto) body+='<h3 style="'+RT+'">Result Summary (auto-assessed)</h3><div style="font-family:Arial,sans-serif">'+auto+'</div>';
        sections.forEach(function(s){ var val=v('apr-'+s.key); if(val) body+='<h3 style="'+RT+'">'+esc(s.label)+'</h3><p style="'+PB+'">'+esc(val)+'</p>'; });
        body+='<table role="presentation" width="100%" style="margin-top:32px;font-family:Arial,sans-serif;border-collapse:collapse"><tr>'
          +'<td style="text-align:center;padding-top:26px"><div style="border-top:1px solid #777;width:78%;margin:0 auto;padding-top:5px;font-size:11px;color:#555">Student signature</div></td>'
          +'<td style="text-align:center;padding-top:26px"><div style="border-top:1px solid #777;width:78%;margin:0 auto;padding-top:5px;font-size:11px;color:#555">Faculty signature &amp; evaluation</div></td>'
          +'</tr></table>';

        var pct=null,rt=''; try{ pct=opts.autoPct?opts.autoPct():null; }catch(e){} try{ rt=opts.autoResultText?opts.autoResultText():''; }catch(e){}
        var reportObj={html:body,name:name,reg:reg,pct:pct,resultText:rt};

        var subOpts=opts.submitOpts||{module:opts.module,title:opts.title,programme:opts.programme};
        host.querySelector('#aprOut').innerHTML='<div class="apr-preview">'+body+'</div>'
          +'<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'
          +'<button type="button" class="apr-btn" id="aprSubmit">⤴ Submit report to faculty</button>'
          +'<button type="button" class="apr-btn" id="aprDownload" style="background:#fff;color:#8c1515;border:1.5px solid #8c1515">⤓ Download PDF</button>'
          +'<span style="font-size:12px;color:var(--muted,#6e6a63)">Review your report above, then submit and/or download it.</span></div>';
        /* collect any attached PDF files */
        function attFiles(){ var out=[]; (opts.attachments||[]).forEach(function(a,i){ var el=host.querySelector('#apr-att-'+i); if(el&&el.files&&el.files[0]) out.push({label:a.label,file:el.files[0]}); }); return out; }
        host.querySelector('#aprSubmit').addEventListener('click',function(){
          if(!window.AlizonPracticalSubmit){ alert('Submission service not loaded — please refresh and try again.'); return; }
          var files=attFiles(), btn=this;
          if(!files.length){ AlizonPracticalSubmit.submit(subOpts,reportObj); return; }
          if(!(window.firebase&&firebase.firestore)){ alert('Upload service is still connecting — please wait a moment and try again.'); return; }
          btn.disabled=true; btn.textContent='Uploading '+files.length+' file(s)…';
          (async function(){
            var atts=[];
            try{
              for(var i=0;i<files.length;i++){
                var id='P'+Date.now()+'-'+Math.floor((window.crypto&&crypto.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]:Math.random()*1e9))+'-'+i;
                var ref=await xdUploadPdf(files[i].file,id); ref.label=files[i].label; atts.push(ref);
              }
            }catch(e){ btn.disabled=false; btn.textContent='⤴ Submit report to faculty'; alert('Could not upload your PDF(s). Please check your connection and try again.'); return; }
            var attHtml='<h3 style="'+RT+'">Attached Work (PDF)</h3>'+atts.map(function(a){ return '<p style="'+PB+';white-space:normal;margin:2px 0"><b>'+esc(a.label)+':</b> <button type="button" data-xf="'+esc(a.id)+'" data-xfn="'+a.chunks+'" data-xfname="'+esc(a.name)+'" style="cursor:pointer;font:inherit;font-weight:700;color:#8c1515;background:#fff;border:1px solid #8c1515;border-radius:100px;padding:4px 12px">⤓ Open '+esc(a.name)+'</button></p>'; }).join('');
            var subReport={html:reportObj.html+attHtml,name:reportObj.name,reg:reportObj.reg,pct:reportObj.pct,resultText:reportObj.resultText,attachments:atts};
            AlizonPracticalSubmit.submit(subOpts,subReport);
            btn.disabled=false; btn.textContent='✓ Submitted';
          })();
        });
        host.querySelector('#aprDownload').addEventListener('click',function(){
          if(window.AlizonPracticalSubmit&&AlizonPracticalSubmit.download) AlizonPracticalSubmit.download(subOpts,reportObj);
          else alert('Download service not loaded — please refresh and try again.');
        });
        host.querySelector('#aprOut').scrollIntoView({behavior:'smooth',block:'nearest'});
      });
      upd();
      return {refreshProfile:function(){ var p=J('alizonProfile',{}); if(p&&p.name&&!v('apr-name')) host.querySelector('#apr-name').value=p.name; }};
    }
  };
})();
