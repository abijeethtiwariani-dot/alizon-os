/* alizon-experiment-brief.js
   Standard experiment sheet for every Alizon practical — accordion / dropdown style
   matching the Module 1 Unit 1 lab manual (badges, chevrons, red-line callouts).
   AlizonExperimentBrief.render('#expBrief', {
     practicalNo, title,
     aim, aimNote,
     principle, theory, principleNote,
     requirements:[...], procedure:[...], method:[...], methodNote
   });   // strings are author-trusted HTML
*/
(function(){
  if(window.AlizonExperimentBrief) return;
  function injectCss(){
    if(document.getElementById('ebxCss')) return;
    var st=document.createElement('style'); st.id='ebxCss';
    st.textContent=
      '.ebx{background:var(--panel,#fff);border:1px solid var(--line,rgba(0,0,0,.12));border-top:3px solid var(--crimson,#8c1515);border-radius:16px;overflow:hidden;box-shadow:var(--card-shadow,0 14px 40px -28px rgba(20,10,12,.5));margin-bottom:16px}'
      +'.ebx-head{padding:16px 20px 13px}'
      +'.ebx-tag{font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--crimson,#8c1515);border-radius:100px;padding:3px 11px;display:inline-block}'
      +'.ebx-head h2{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(18px,2.4vw,21px);font-weight:700;margin-top:9px;color:var(--ink,#1c1a1f)}'
      +'.ebx-acc{border-top:1px solid var(--line,rgba(0,0,0,.12))}'
      +'.ebx-acc details{border-bottom:1px solid var(--line,rgba(0,0,0,.1))}'
      +'.ebx-acc details:last-child{border-bottom:none}'
      +'.ebx-acc summary{list-style:none;cursor:pointer;padding:14px 20px;display:flex;align-items:center;gap:12px;font-weight:700;font-size:14.5px;color:var(--ink,#1c1a1f);user-select:none}'
      +'.ebx-acc summary::-webkit-details-marker{display:none}'
      +'.ebx-acc summary:hover{background:var(--panel2,rgba(140,21,21,.035))}'
      +'.ebx-badge{font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#A16207);background:var(--gold-soft,rgba(161,98,7,.14));border-radius:100px;padding:3px 9px}'
      +'.ebx-chev{margin-left:auto;color:var(--muted,#8a8a8a);transition:transform .2s;flex:none;font-size:11px}'
      +'.ebx-acc details[open] summary .ebx-chev{transform:rotate(90deg)}'
      +'.ebx-body{padding:0 20px 18px;color:var(--ink,#1c1a1f);font-size:13.7px;line-height:1.72}'
      +'.ebx-body p{margin:0 0 10px} .ebx-body p:last-child{margin-bottom:0}'
      +'.ebx-body b,.ebx-body strong{color:var(--crimson,#8c1515)}'
      +'.ebx-body em{color:var(--gold,#A16207);font-style:italic}'
      +'.ebx-body ul,.ebx-body ol{margin:4px 0 10px;padding-left:20px} .ebx-body li{margin:5px 0}'
      +'.ebx-callout{background:rgba(196,38,46,.07);border:1px solid rgba(196,38,46,.22);border-left:4px solid var(--crimson,#C4262E);border-radius:0 10px 10px 0;padding:11px 14px;margin-top:10px;font-size:13px;line-height:1.6;color:var(--ink,#1c1a1f)}'
      +'.ebx-callout b{color:var(--crimson,#8c1515)}';
    document.head.appendChild(st);
  }
  function esc(s){ return String(s==null?'':s); }
  function list(items,ordered){ if(!items||!items.length) return ''; var t=ordered?'ol':'ul'; return '<'+t+'>'+items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</'+t+'>'; }
  function callout(t){ return t?'<div class="ebx-callout">'+t+'</div>':''; }
  function sec(title,badge,body,open){ if(!body) return ''; return '<details'+(open?' open':'')+'><summary>'+title+' <span class="ebx-badge">'+badge+'</span><span class="ebx-chev">&#9656;</span></summary><div class="ebx-body">'+body+'</div></details>'; }

  window.AlizonExperimentBrief={
    render:function(host,d){
      if(typeof host==='string') host=document.querySelector(host);
      if(!host||!d) return;
      injectCss();
      var h='<div class="ebx"><div class="ebx-head">'+(d.practicalNo?'<span class="ebx-tag">'+esc(d.practicalNo)+'</span>':'')+(d.title?'<h2>'+esc(d.title)+'</h2>':'')+'</div><div class="ebx-acc">';
      h+=sec('Aim','objective',(d.aim?'<p>'+d.aim+'</p>':'')+callout(d.aimNote),true);
      h+=sec('Principle &amp; Theory','concept',(d.principle?'<p>'+d.principle+'</p>':'')+(d.theory?'<p>'+d.theory+'</p>':'')+callout(d.principleNote),false);
      h+=sec('Requirements','setup',list(d.requirements,false),false);
      h+=sec('Procedure','steps',list(d.procedure,true),false);
      h+=sec('Guided Method','method',list(d.method,true)+callout(d.methodNote),false);
      h+='</div></div>';
      host.innerHTML=h;
    }
  };
})();
