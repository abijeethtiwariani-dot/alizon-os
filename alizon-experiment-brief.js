/* alizon-experiment-brief.js
   Standard experiment sheet for every Alizon practical.
   AlizonExperimentBrief.render('#expBrief', {
     practicalNo, title,
     aim, principle, theory,        // HTML strings (author-trusted)
     requirements:[...],            // unordered list
     procedure:[...],               // numbered
     method:[...]                   // numbered (guided method)
   });
*/
(function(){
  if(window.AlizonExperimentBrief) return;
  function injectCss(){
    if(document.getElementById('ebCss')) return;
    var st=document.createElement('style'); st.id='ebCss';
    st.textContent=
      '.expbrief{background:var(--panel,#fff);border:1px solid var(--line,rgba(0,0,0,.12));border-top:3px solid var(--crimson,#8c1515);border-radius:16px;padding:clamp(16px,2.6vw,24px);box-shadow:var(--card-shadow,0 14px 40px -28px rgba(20,10,12,.5));margin-bottom:16px}'
      +'.expbrief .eb-head{border-bottom:1px solid var(--line,rgba(0,0,0,.12));padding-bottom:12px;margin-bottom:4px}'
      +'.expbrief .eb-tag{font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--crimson,#8c1515);border-radius:100px;padding:3px 11px;display:inline-block}'
      +'.expbrief .eb-head h2{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(18px,2.4vw,21px);font-weight:700;margin-top:9px;color:var(--ink,#1c1a1f)}'
      +'.expbrief .eb-sec{margin-top:16px}'
      +'.expbrief .eb-sec h3{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold,#A16207);margin-bottom:6px;display:flex;align-items:center;gap:8px}'
      +'.expbrief .eb-sec h3:before{content:"";width:7px;height:15px;background:var(--crimson,#8c1515);border-radius:2px;display:inline-block}'
      +'.expbrief .eb-sec p{font-size:13.5px;line-height:1.7;color:var(--ink,#1c1a1f)}'
      +'.expbrief .eb-list{margin:4px 0 0 2px;padding-left:18px;font-size:13.5px;line-height:1.75;color:var(--ink,#1c1a1f)}'
      +'.expbrief .eb-list li{margin-bottom:5px}';
    document.head.appendChild(st);
  }
  function list(items,ordered){
    if(!items||!items.length) return '';
    var tag=ordered?'ol':'ul';
    return '<'+tag+' class="eb-list">'+items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</'+tag+'>';
  }
  window.AlizonExperimentBrief={
    render:function(host,d){
      if(typeof host==='string') host=document.querySelector(host);
      if(!host||!d) return;
      injectCss();
      var h='<div class="expbrief">';
      h+='<div class="eb-head">'+(d.practicalNo?'<span class="eb-tag">'+d.practicalNo+'</span>':'')+(d.title?'<h2>'+d.title+'</h2>':'')+'</div>';
      if(d.aim)        h+='<div class="eb-sec"><h3>Aim</h3><p>'+d.aim+'</p></div>';
      if(d.principle)  h+='<div class="eb-sec"><h3>Principle</h3><p>'+d.principle+'</p></div>';
      if(d.theory)     h+='<div class="eb-sec"><h3>Theory</h3><p>'+d.theory+'</p></div>';
      if(d.requirements&&d.requirements.length) h+='<div class="eb-sec"><h3>Requirements</h3>'+list(d.requirements,false)+'</div>';
      if(d.procedure&&d.procedure.length)       h+='<div class="eb-sec"><h3>Procedure</h3>'+list(d.procedure,true)+'</div>';
      if(d.method&&d.method.length)             h+='<div class="eb-sec"><h3>Guided Method</h3>'+list(d.method,true)+'</div>';
      h+='</div>';
      host.innerHTML=h;
    }
  };
})();
