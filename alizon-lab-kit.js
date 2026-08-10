/* alizon-lab-kit.js
   The two simulation shapes that the rebuilt ALIZON labs converged on, extracted
   so a new practical is data rather than another 500 lines of near-identical code.

     AlizonLabKit.queue(cfg)   a worklist — items ranked or listed, each with a
                               record that stays closed until opened, an action,
                               a reason, and a consequence at the end.
     AlizonLabKit.stages(cfg)  a staged investigation — gather evidence, then a
                               sequence of decisions, each explained on the spot.

   Both give: page chrome, three tabs, two independent indices tracked apart from
   the mark, per-item feedback, a scored report, and the practical-report mount.
   Both honour the house rule that deciding without looking is recorded and costs.
*/
(function(){
'use strict';
if(window.AlizonLabKit) return;

function $(i){ return document.getElementById(i); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
function el(h){ var d=document.createElement('div'); d.innerHTML=String(h).trim(); return d.firstChild; }

/* ---------- shared chrome ---------- */
var CSS = `
:root{--crimson:#b1040e;--ink:#141210;--muted:#5f5a54;--line:#e6e2de;--panel:#fff;--bg:#f4f2ef;
  --serif:"Source Serif Pro",Georgia,serif;--sans:"Inter",-apple-system,"Segoe UI",Roboto,sans-serif;
  --card-shadow:0 2px 10px rgba(0,0,0,.06)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:14.5px;line-height:1.6}
.wrap{max-width:1140px;margin:0 auto;padding:0 18px 80px}
.hero{padding:26px 0 6px}
.hero .mod{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--crimson)}
.hero h1{font-family:var(--serif);font-size:clamp(22px,3.4vw,31px);margin:7px 0 6px}
.hero p{color:var(--muted);margin:0;max-width:72ch}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 16px;position:sticky;top:0;z-index:30;padding:8px 0;background:var(--bg)}
.tabs button{font:inherit;font-size:13px;font-weight:700;padding:8px 16px;border-radius:100px;border:1px solid var(--line);
  background:#fff;color:var(--muted);cursor:pointer}
.tabs button.on{background:var(--crimson);color:#fff;border-color:var(--crimson)}
.panel{display:none}.panel.on{display:block}
.opbar{position:sticky;top:56px;z-index:25;color:#fff;border-radius:14px;padding:12px 16px;
  display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.opbar .k{font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.7}
.opbar .v{font-size:17px;font-weight:800;font-variant-numeric:tabular-nums}
.meter{min-width:150px}
.meter .bar{height:6px;border-radius:3px;background:rgba(255,255,255,.18);margin-top:5px;overflow:hidden}
.meter .bar i{display:block;height:100%;background:#5ec27a}
.meter.warn .bar i{background:#e0a800}.meter.bad .bar i{background:#ff6b6b}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:var(--card-shadow);padding:16px 18px;margin-bottom:14px}
.card h3{font-family:var(--serif);font-size:17px;margin:0 0 8px}
.grid2{display:grid;grid-template-columns:1.05fr .95fr;gap:16px;align-items:start}
@media(max-width:900px){.grid2{grid-template-columns:1fr}}
.queue{background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:var(--card-shadow);overflow:hidden}
.queue h4{font-family:var(--sans);font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
  margin:0;padding:11px 14px;background:#faf8f6;border-bottom:1px solid var(--line);color:var(--muted)}
.rx{display:flex;gap:11px;align-items:flex-start;padding:11px 14px;border-bottom:1px solid var(--line);cursor:pointer}
.rx:hover{background:#faf8f6}.rx.on{background:#fdf3f3;box-shadow:inset 3px 0 0 var(--crimson)}
.rx.done{opacity:.5}
.score{flex:none;min-width:40px;height:40px;padding:0 6px;border-radius:9px;display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:13px;color:#fff}
.s-hi{background:#c2410c}.s-md{background:#d9a406}.s-lo{background:#6b7280}
.rx .t{font-size:13px;font-weight:700;line-height:1.3}.rx .s{font-size:11.5px;color:var(--muted)}
.pill{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  padding:2px 8px;border-radius:100px;background:#eee;color:#555;margin-left:6px}
.pill.ok{background:#e7f5ec;color:#137a3a}.pill.no{background:#fdecea;color:#a31515}
.chart{border:1px solid var(--line);border-radius:11px;overflow:hidden;margin:10px 0}
.chart .ch{background:#f7f4f1;padding:8px 12px;font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;
  color:var(--muted);display:flex;gap:8px;flex-wrap:wrap}
.chart .ch button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--line);background:#fff;color:var(--muted);
  border-radius:100px;padding:3px 11px;cursor:pointer}
.chart .ch button.seen{border-color:#137a3a;color:#137a3a}
.chart .body{padding:12px 14px;font-size:13px;min-height:74px;white-space:pre-wrap}
.stage{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.stage span{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px;
  background:#fff;border:1px solid var(--line);color:var(--muted)}
.stage span.on{background:var(--crimson);color:#fff;border-color:var(--crimson)}
.stage span.did{border-color:#137a3a;color:#137a3a}
.ev{display:grid;grid-template-columns:repeat(auto-fit,minmax(212px,1fr));gap:10px;margin:10px 0}
.evb{text-align:left;font:inherit;background:#fff;border:1px solid var(--line);border-radius:11px;padding:11px 13px;cursor:pointer}
.evb:hover{border-color:var(--crimson)}.evb.seen{border-color:#137a3a;background:#f4faf6}
.evb b{display:block;font-size:13px;margin-bottom:2px}.evb small{color:var(--muted);font-size:11.5px}
.out{background:#0f1115;color:#dfe3e8;border-radius:11px;padding:12px 14px;font-family:ui-monospace,Menlo,monospace;
  font-size:12.2px;line-height:1.65;white-space:pre-wrap;margin:10px 0;min-height:58px;overflow-x:auto}
.opts{display:flex;flex-wrap:wrap;gap:7px;margin:8px 0}
.opt{font:inherit;font-size:12.5px;padding:7px 13px;border-radius:100px;border:1px solid var(--line);background:#fff;
  cursor:pointer;text-align:left}
.opt.sel{border-color:var(--crimson);background:#fdf3f3;color:var(--crimson);font-weight:700}
.lbl{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin:13px 0 3px}
.btn{font:inherit;font-size:13px;font-weight:700;padding:9px 18px;border-radius:100px;border:0;background:var(--crimson);color:#fff;cursor:pointer}
.btn.ghost{background:#fff;color:var(--crimson);border:1px solid var(--crimson)}
.btn:disabled{opacity:.45;cursor:default}
.fb{border-radius:11px;padding:11px 14px;margin-top:10px;font-size:13px;line-height:1.55}
.fb.yes{background:#e7f5ec;border:1px solid #b7e0c5}
.fb.no{background:#fdecea;border:1px solid #f3c2bd}
.fb .hd{font-weight:800;margin-bottom:3px}
.muted{color:var(--muted);font-size:12.5px}
table.rep,table.d{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0}
table.rep th,table.rep td,table.d th,table.d td{border:1px solid var(--line);padding:7px 10px;text-align:left}
table.rep th,table.d th{background:#f7f4f1;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
table.d td.n{text-align:right;font-variant-numeric:tabular-nums}
tr.hot td{background:#fdf3f3}
.barwrap{display:flex;align-items:center;gap:8px}
.barwrap .b{flex:1;height:14px;background:#f0ece8;border-radius:3px;overflow:hidden;min-width:60px}
.barwrap .b i{display:block;height:100%;background:var(--crimson);opacity:.8}
.clk .v{font-variant-numeric:tabular-nums}
.clk.warn .v{color:#ffd166}.clk.bad .v{color:#ff8a8a}
.later{border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:14px 0 4px}
.later h4{margin:0;padding:10px 14px;background:#141210;color:#f0e7e4;font-family:var(--sans);
  font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.later .row{display:flex;gap:12px;padding:11px 14px;border-top:1px solid var(--line);align-items:flex-start}
.later .row:first-of-type{border-top:0}
.later .dot{flex:none;width:9px;height:9px;border-radius:50%;margin-top:6px;background:#137a3a}
.later .row.bad .dot{background:var(--crimson)}
.later .who{font-size:12.5px;font-weight:800;min-width:132px;flex:none}
.later .what{font-size:13px;line-height:1.55}
.miss{background:#fff8e6;border:1px solid #f0dca8;border-radius:11px;padding:11px 14px;margin:10px 0;font-size:13px}
@media print{.tabs,.opbar,.btn,.no-print{display:none!important}.panel{display:block!important}}
`;

function shell(cfg){
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  /* Render into a root node rather than replacing document.body: the lab gate has
     already run and may have put an overlay on the body, and a <script> inserted
     via innerHTML would never execute anyway. */
  var root=document.getElementById('labRoot');
  if(!root){ root=document.createElement('div'); root.id='labRoot'; document.body.appendChild(root); }
  root.innerHTML =
    '<div class="wrap">'
    +'<div class="hero"><div class="mod">'+esc(cfg.unitLabel)+'</div>'
    +'<h1>'+esc(cfg.title)+'</h1><p>'+cfg.blurb+'</p></div>'
    +'<div class="tabs"><button data-p="brief" class="on">Briefing</button>'
    +'<button data-p="work">'+esc(cfg.workTab||'Console')+'</button>'
    +'<button data-p="res">Result &amp; Record</button></div>'
    +'<section class="panel on" id="p-brief"><div id="expBrief" data-exp="'+esc(cfg.expKey)+'"></div>'
      +'<div class="card no-print"><h3>Before you start</h3>'+cfg.before
      +'<button class="btn" id="startBtn">▶ '+esc(cfg.startLabel||'Begin')+'</button></div></section>'
    +'<section class="panel" id="p-work">'
      +'<div class="opbar" style="background:'+(cfg.opbar||'linear-gradient(120deg,#12131c,#1d1f2b)')+'">'
        +'<div><div class="k">'+esc(cfg.counterLabel||'Progress')+'</div><div class="v" id="mCount">—</div></div>'
        +'<div class="meter" id="mAW"><div class="k">'+esc(cfg.meterA)+'</div><div class="v" id="mA">100%</div><div class="bar"><i id="bA" style="width:100%"></i></div></div>'
        +'<div class="meter" id="mBW"><div class="k">'+esc(cfg.meterB)+'</div><div class="v" id="mB">100%</div><div class="bar"><i id="bB" style="width:100%"></i></div></div>'
        +(cfg.clock?'<div class="clk" id="mCW"><div class="k">'+esc(cfg.clock.label||'Time remaining')
            +'</div><div class="v" id="mC">'+String(cfg.clock.minutes)+':00</div></div>':'')
        +'<div style="margin-left:auto"><button class="btn ghost" id="endBtn" style="display:none">'+esc(cfg.finishLabel||'Finish')+'</button></div>'
      +'</div><div id="workArea"></div></section>'
    +'<section class="panel" id="p-res"><div id="resBox">'
      +'<p class="muted" id="resEmpty">Complete the exercise to generate your report, then write and submit it below.</p>'
      +'</div><div id="reportWriter" class="no-print"></div></section>'
    +'</div>';

  [].forEach.call(document.querySelectorAll('.tabs button'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('.tabs button'),function(x){x.classList.remove('on');});
      [].forEach.call(document.querySelectorAll('.panel'),function(x){x.classList.remove('on');});
      b.classList.add('on'); $('p-'+b.getAttribute('data-p')).classList.add('on');
    });
  });
}
function goTab(n){ [].forEach.call(document.querySelectorAll('.tabs button'),function(b){ if(b.getAttribute('data-p')===n) b.click(); }); }

function Meters(){
  var a=100,b=100;
  return {
    get a(){return a;}, get b(){return b;},
    hitA:function(n){ a=Math.max(0,a-n); this.paint(); },
    hitB:function(n){ b=Math.max(0,b-n); this.paint(); },
    count:function(t){ $('mCount').textContent=t; },
    paint:function(){
      $('mA').textContent=a+'%'; $('bA').style.width=a+'%';
      $('mB').textContent=b+'%'; $('bB').style.width=b+'%';
      $('mAW').className='meter'+(a<50?' bad':(a<80?' warn':''));
      $('mBW').className='meter'+(b<50?' bad':(b<80?' warn':''));
    }
  };
}

/* A shift clock, where the time pressure is part of the professional reality —
   a driver waiting at the goods-in bay, an on-call queue that keeps filling.
   Never used on work that ought to be unhurried, like a data-quality audit.

   Elapsed time is always computed from Date.now(); the interval only decides how
   often the display repaints. Counting ticks would hand a much longer shift to
   any student whose browser throttled the tab in the background. */
function Clock(cfg, onExpire){
  if(!cfg.clock) return null;
  var total=(cfg.clock.minutes||20)*60000, t0=null, iv=null, fired=false;
  function fmt(ms){
    var s=Math.max(0,Math.round(ms/1000));
    return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);
  }
  function paint(){
    var left=api.left(), box=$('mCW'), v=$('mC');
    if(!v) return;
    v.textContent=fmt(left);
    if(box) box.className='clk'+(left<=total*0.15?' bad':(left<=total*0.35?' warn':''));
    if(left<=0 && !fired){ fired=true; api.stop(); onExpire(); }
  }
  var api={
    start:function(){ if(t0!=null) return; t0=Date.now(); iv=setInterval(paint,1000); paint(); },
    stop:function(){ if(iv) clearInterval(iv); iv=null; },
    expired:function(){ return fired; },
    left:function(){ return t0==null?total:Math.max(0,total-(Date.now()-t0)); },
    usedText:function(){ return t0==null?'not started':fmt(Math.min(total,Date.now()-t0))+' of '+fmt(total); }
  };
  return api;
}

/* "What happened next" — advance the clock past the decision and report the fate
   of each case, branched on what the student actually did. A mark tells a student
   whether they were right; this tells them what it cost. */
function laterHtml(cfg, rows){
  rows=(rows||[]).filter(function(r){ return r && r.text; });
  if(!rows.length) return '';
  return '<div class="later"><h4>'+esc(cfg.laterHead||'What happened next')+'</h4>'
    +rows.map(function(r){
      return '<div class="row'+(r.ok?'':' bad')+'"><span class="dot"></span>'
        +'<div class="who">'+esc(r.who)+'</div><div class="what">'+r.text+'</div></div>';
    }).join('')+'</div>';
}

function mountReport(cfg, pct, resultText, html){
  var OPTS={module:cfg.module, title:cfg.title, programme:'Pharmacy AI', pct:pct, resultText:resultText};
  if(window.AlizonPracticalReport) AlizonPracticalReport.mount({
    container:'#reportWriter', module:OPTS.module, title:OPTS.title, programme:OPTS.programme, submitOpts:OPTS,
    titleField:{label:cfg.reportLabel||'Outcome', placeholder:cfg.reportPlaceholder||''},
    minWords:400,
    attachments:cfg.attachments||[{label:'1. Report / Printout (PDF)'},{label:'2. Reflection (PDF)'}],
    reportHtml:html
  });
}

/* ============================================================
   SHAPE 1 — worklist queue
   ============================================================ */
function queue(cfg){
  shell(cfg);
  var M=Meters(), S={cur:null,done:{},opened:{},log:[]};
  var items=cfg.items, total=items.length, per=cfg.perItem||10;
  var C=Clock(cfg,function(){ finish(true); });

  function scoreClass(n){ return n>=70?'s-hi':(n>=35?'s-md':'s-lo'); }
  function paintQueue(){
    $('workArea').querySelector('#qList').innerHTML=items.map(function(r){
      var d=S.done[r.id];
      return '<div class="rx'+(S.cur===r.id?' on':'')+(d?' done':'')+'" data-id="'+r.id+'">'
        +(r.score!=null?'<div class="score '+scoreClass(r.score)+'">'+r.score+'</div>':'')
        +'<div><div class="t">'+esc(r.head)+(d?'<span class="pill '+(d.ok?'ok':'no')+'">reviewed</span>':'')+'</div>'
        +'<div class="s">'+esc(r.sub||'')+'</div></div></div>';
    }).join('');
    [].forEach.call($('workArea').querySelectorAll('.rx'),function(e){
      e.addEventListener('click',function(){ open(e.getAttribute('data-id')); });
    });
    M.count(Object.keys(S.done).length+' / '+total);
    $('endBtn').style.display = Object.keys(S.done).length===total ? '' : 'none';
  }

  function open(id){
    S.cur=id;
    var r=null; items.forEach(function(x){ if(x.id===id) r=x; });
    if(!r) return;
    S.opened[id]=S.opened[id]||{};
    var d=S.done[id], tabs=cfg.recordTabs;
    var h='<div class="card"><h3>'+esc(r.head)+'</h3>'
      +'<p class="muted" style="margin:0 0 4px">'+esc(r.sub||'')+(r.score!=null?' &nbsp;·&nbsp; '+esc(cfg.scoreName||'Score')+' <b>'+r.score+'</b>':'')+'</p>'
      +'<div class="chart"><div class="ch">'
        +tabs.map(function(t){ return '<button data-c="'+t[0]+'" class="'+(S.opened[id][t[0]]?'seen':'')+'">'+esc(t[1])+'</button>'; }).join('')
      +'</div><div class="body" id="chartBody"><span class="muted">Nothing open. The record is closed until you look.</span></div></div>';
    if(d){ h+='<div class="fb '+(d.ok?'yes':'no')+'"><div class="hd">'+(d.ok?'Correct':'Not correct')+'</div>'+esc(r.truth)+'</div>'; }
    else {
      h+='<div class="lbl">'+esc(cfg.actionLabel||'Your action')+'</div><div class="opts" id="actOpts">'
        +cfg.actions.map(function(a){ return '<button class="opt" data-a="'+a[0]+'">'+esc(a[1])+'</button>'; }).join('')+'</div>'
        +'<div class="lbl">'+esc(cfg.reasonLabel||'Principal reason')+'</div><div class="opts" id="whyOpts">'
        +cfg.reasons.map(function(a){ return '<button class="opt" data-w="'+a[0]+'">'+esc(a[1])+'</button>'; }).join('')+'</div>'
        +'<button class="btn" id="goBtn" style="margin-top:10px">Record decision</button><div id="fbk"></div>';
    }
    h+='</div>';
    var wa=$('workArea').querySelector('#workPane'); wa.innerHTML=h;
    paintQueue();

    [].forEach.call(wa.querySelectorAll('.ch button'),function(b){
      b.addEventListener('click',function(){
        var k=b.getAttribute('data-c'); S.opened[id][k]=true; b.classList.add('seen');
        var lbl=tabs.filter(function(t){return t[0]===k;})[0][1];
        wa.querySelector('#chartBody').textContent=lbl+'\n\n'+r.record[k];
      });
    });
    if(d) return;
    var pick={a:null,w:null};
    function wireOpts(sel,key){
      [].forEach.call(wa.querySelector(sel).querySelectorAll('.opt'),function(b){
        b.addEventListener('click',function(){
          [].forEach.call(wa.querySelector(sel).querySelectorAll('.opt'),function(x){x.classList.remove('sel');});
          b.classList.add('sel'); pick[key]=b.getAttribute(key==='a'?'data-a':'data-w');
        });
      });
    }
    wireOpts('#actOpts','a'); wireOpts('#whyOpts','w');
    wa.querySelector('#goBtn').addEventListener('click',function(){
      if(!pick.a||!pick.w){
        wa.querySelector('#fbk').innerHTML='<div class="fb no"><div class="hd">Incomplete</div>Choose an action and a reason before recording.</div>';
        return;
      }
      var looked=(r.need||[]).every(function(k){ return S.opened[id][k]; });
      var actOk=pick.a===r.action, whyOk=pick.w===r.why;
      var mark=(actOk?Math.round(per*0.6):0)+(whyOk?Math.round(per*0.3):0)+(looked?Math.round(per*0.1):0);
      if(!actOk) M.hitA((cfg.sevWeight&&cfg.sevWeight[r.sev]!=null?cfg.sevWeight[r.sev]:1)*11);
      if(!looked) M.hitB(9);
      S.done[id]={ok:actOk&&whyOk,actOk:actOk,whyOk:whyOk,looked:looked,mark:mark};
      S.log.push({id:id,head:r.head,mark:mark,actOk:actOk,whyOk:whyOk,looked:looked,sev:r.sev});
      open(id);
    });
  }

  $('startBtn').addEventListener('click',function(){
    goTab('work');
    $('workArea').innerHTML='<div class="grid2"><div><div class="queue"><h4>'+esc(cfg.queueHead||'Worklist')+'</h4>'
      +'<div id="qList"></div></div>'+(cfg.queueFoot?'<p class="muted" style="margin-top:10px">'+cfg.queueFoot+'</p>':'')
      +'</div><div id="workPane"></div></div>';
    paintQueue(); open(items[0].id); M.paint();
    if(C) C.start();
  });

  function finish(expired){
    if(S.ended) return; S.ended=true;
    if(C) C.stop();
    /* Anything not reached scores zero — that is the honest consequence of the
       shift ending, and it is what the epilogue then reports on. */
    var missed=[];
    if(expired) items.forEach(function(r){
      if(!S.done[r.id]){
        missed.push(r);
        S.done[r.id]={ok:false,actOk:false,whyOk:false,looked:false,mark:0,missed:true};
        S.log.push({id:r.id,head:r.head,mark:0,actOk:false,whyOk:false,looked:false,sev:r.sev,missed:true});
      }
    });
    var got=S.log.reduce(function(a,x){return a+x.mark;},0), max=total*per;
    var pct=Math.round(got/max*100);
    var rows=S.log.map(function(x){
      return '<tr><td>'+esc(x.head.slice(0,52))+(x.missed?' <span class="pill no">not reached</span>':'')
        +'</td><td>'+(x.actOk?'✓':'✗')+'</td><td>'+(x.whyOk?'✓':'✗')
        +'</td><td>'+(x.looked?'✓':'✗')+'</td><td>'+x.mark+' / '+per+'</td></tr>';}).join('');
    var later=laterHtml(cfg, items.map(function(r){
      var d=S.done[r.id]; if(!r.after) return null;
      var ok=!!(d&&d.actOk), txt=d&&d.missed&&r.after.missed ? r.after.missed : (ok?r.after.ok:r.after.bad);
      return {who:r.afterWho||r.head, ok:ok&&!(d&&d.missed), text:txt};
    }));
    var html='<div class="card"><h3>'+esc(cfg.finishHead||'Complete')+'</h3>'
      +'<p><b>'+got+' / '+max+'</b> ('+pct+'%) &nbsp;·&nbsp; '+esc(cfg.meterA)+' <b>'+M.a+'%</b> &nbsp;·&nbsp; '+esc(cfg.meterB)+' <b>'+M.b+'%</b>'
      +(C?' &nbsp;·&nbsp; Time used <b>'+esc(C.usedText())+'</b>':'')+'</p>'
      +(expired&&missed.length?'<div class="miss"><b>The shift ended with '+missed.length+' item'
        +(missed.length===1?'':'s')+' still in the queue.</b> '+esc(cfg.clock&&cfg.clock.expiredNote
        ||'Work you never reached scores nothing, because the patient never got it either.')+'</div>':'')
      +'<table class="rep"><tr><th>Item</th><th>Action</th><th>Reason</th><th>Record opened</th><th>Mark</th></tr>'+rows+'</table>'
      +cfg.outcome(S,M)
      +later
      +'<p class="muted no-print" style="font-size:12px">Now write and submit your report below — faculty will evaluate it.</p></div>';
    $('resEmpty').style.display='none'; $('resBox').innerHTML=html; goTab('res');
    mountReport(cfg,pct,got+'/'+max+' ('+pct+'%) · '+M.a+'% / '+M.b+'%',html);
  }
  $('endBtn').addEventListener('click',function(){ finish(false); });
  M.paint();
}

/* ============================================================
   SHAPE 2 — staged investigation
   ============================================================ */
function stages(cfg){
  shell(cfg);
  var M=Meters(), S={stage:0,opened:{},marks:{},ans:{}};
  var EV=cfg.evidence, evKeys=Object.keys(EV), steps=cfg.steps;
  var C=Clock(cfg,function(){ finish(true); });

  function bar(){
    var names=[{t:cfg.gatherLabel||'Gather evidence'}].concat(steps.map(function(s){return {t:s.t};}));
    return '<div class="stage">'+names.map(function(s,i){
      return '<span class="'+(i===S.stage?'on':(i<S.stage?'did':''))+'">'+(i+1)+'. '+esc(s.t)+'</span>';}).join('')+'</div>';
  }
  function paint(){
    M.count(Math.min(S.stage+1,steps.length+1)+' / '+(steps.length+1));
    if(S.stage===0) return gather();
    var st=steps[S.stage-1];
    if(!st) return finish();
    choice(st);
  }
  function gather(){
    $('workArea').innerHTML=bar()+'<div class="card"><h3>Evidence available</h3>'
      +'<p class="muted">'+(cfg.gatherNote||'Open what you need. You may proceed at any time — but a conclusion drawn without the evidence is recorded as such.')+'</p>'
      +'<div class="ev">'+evKeys.map(function(k){
          return '<button class="evb'+(S.opened[k]?' seen':'')+'" data-k="'+k+'"><b>'+esc(EV[k].t)+'</b><small>'+esc(EV[k].s)+'</small></button>';
        }).join('')+'</div><div class="out" id="evOut">Nothing open.</div>'
      +'<button class="btn" id="nextBtn">Continue</button></div>';
    [].forEach.call($('workArea').querySelectorAll('.evb'),function(b){
      b.addEventListener('click',function(){
        var k=b.getAttribute('data-k'); S.opened[k]=true; b.classList.add('seen');
        $('evOut').textContent=EV[k].body;
        M.count(Object.keys(S.opened).length+' evidence · stage 1 / '+(steps.length+1));
      });
    });
    $('nextBtn').addEventListener('click',function(){ S.stage=1; paint(); });
  }
  function choice(st){
    $('workArea').innerHTML=bar()+'<div class="card">'
      +(st.pre||'')
      +'<h3>'+esc(st.q)+'</h3>'
      +'<div class="opts" id="ch">'+st.options.map(function(o){
          return '<button class="opt" data-v="'+o[0]+'">'+esc(o[1])+'</button>';}).join('')+'</div>'
      +'<p class="muted">Evidence opened: '+(Object.keys(S.opened).map(function(k){return EV[k].t;}).join(' · ')||'nothing')+'</p>'
      +'<button class="btn" id="goBtn">Record</button><div id="fbk"></div></div>';
    var pick=null;
    [].forEach.call($('ch').querySelectorAll('.opt'),function(b){
      b.addEventListener('click',function(){
        [].forEach.call($('ch').querySelectorAll('.opt'),function(x){x.classList.remove('sel');});
        b.classList.add('sel'); pick=b.getAttribute('data-v');
      });
    });
    $('goBtn').addEventListener('click',function(){
      if(!pick){ $('fbk').innerHTML='<div class="fb no"><div class="hd">Choose an option</div>Select an answer before recording.</div>'; return; }
      var ok=pick===st.right;
      var looked=(st.need||[]).every(function(k){ return S.opened[k]; });
      var mark=(ok?8:0)+(looked?2:0);
      S.marks[st.k]=mark; S.ans[st.k]={pick:pick,ok:ok,looked:looked};
      if(!ok) M.hitA(14);
      if(!looked) M.hitA(8);
      if(st.penaltyB && st.penaltyB[pick]) M.hitB(st.penaltyB[pick]);
      $('fbk').innerHTML='<div class="fb '+(ok?'yes':'no')+'"><div class="hd">'+(ok?'Correct':'Not correct')+'</div>'
        +esc(st.explain[pick])+(looked?'':'<br><br><b>You concluded without opening the evidence that would have shown it.</b>')+'</div>'
        +'<button class="btn" id="onBtn" style="margin-top:10px">Continue</button>';
      $('onBtn').addEventListener('click',function(){ S.stage++; paint(); });
    });
  }
  function finish(expired){
    if(S.ended) return; S.ended=true;
    if(C) C.stop();
    var evMark=Math.round(Object.keys(S.opened).length/evKeys.length*10);
    var got=steps.reduce(function(a,s){return a+(S.marks[s.k]||0);},0)+evMark;
    var max=(steps.length+1)*10, pct=Math.round(got/max*100);
    var undone=steps.filter(function(s){ return S.marks[s.k]==null; });
    var rows=[['Evidence gathered',evMark+' / 10']].concat(steps.map(function(s){
      return [s.t+(S.marks[s.k]==null?' — not reached':''),(S.marks[s.k]||0)+' / 10'];})).map(function(r){
      return '<tr><td>'+esc(r[0])+'</td><td>'+r[1]+'</td></tr>';}).join('');
    var later=laterHtml(cfg, steps.map(function(s){
      if(!s.after) return null;
      var a=S.ans[s.k], ok=!!(a&&a.ok);
      var txt=!a&&s.after.missed ? s.after.missed : (ok?s.after.ok:s.after.bad);
      return {who:s.afterWho||s.t, ok:ok, text:txt};
    }));
    var html='<div class="card"><h3>'+esc(cfg.finishHead||'Complete')+'</h3>'
      +'<p><b>'+got+' / '+max+'</b> ('+pct+'%) &nbsp;·&nbsp; '+esc(cfg.meterA)+' <b>'+M.a+'%</b> &nbsp;·&nbsp; '+esc(cfg.meterB)+' <b>'+M.b+'%</b>'
      +(C?' &nbsp;·&nbsp; Time used <b>'+esc(C.usedText())+'</b>':'')+'</p>'
      +(expired&&undone.length?'<div class="miss"><b>Time ran out with '+undone.length+' decision'
        +(undone.length===1?'':'s')+' still open.</b> '+esc(cfg.clock&&cfg.clock.expiredNote
        ||'A decision never made is not a neutral outcome — the default simply happened instead.')+'</div>':'')
      +'<table class="rep"><tr><th>Element</th><th>Mark</th></tr>'+rows+'</table>'
      +cfg.outcome(S,M)
      +later
      +'<p class="muted no-print" style="font-size:12px">Now write and submit your report below — faculty will evaluate it.</p></div>';
    $('resEmpty').style.display='none'; $('resBox').innerHTML=html; goTab('res');
    mountReport(cfg,pct,got+'/'+max+' ('+pct+'%) · '+M.a+'% / '+M.b+'%',html);
  }
  $('startBtn').addEventListener('click',function(){ goTab('work'); paint(); M.paint(); if(C) C.start(); });
  M.paint();
}

window.AlizonLabKit={ queue:queue, stages:stages, esc:esc };
})();
