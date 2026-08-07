/* =====================================================================
   ALIZON — practical experience letter

   A letter is NEVER issued automatically. Faculty evaluate a practical
   (alizonSubmissions entry gains status:'evaluated' + a mark), then an
   administrator picks which of those verified practicals go on the letter
   and issues it. Only then does it appear on the student's profile.

   Storage: localStorage "alizonExperience" (registered in firebase-sync)
     {
       _settings: { asapLogo, signatory, designation, place, hoursPer },
       "<REG>": { no, issued, by, hoursPer, total, items:[...], from, to }
     }

   Public API: window.AlizonExperience = {
     settings, saveSettings, verifiedPracticals, get, list, issue, revoke,
     letterHtml, open, print, HOURS_PER_PRACTICAL
   }
   ===================================================================== */
(function () {
  'use strict';
  if (window.AlizonExperience) return;

  var KEY = 'alizonExperience';
  /* every practical is credited as this many hours of hands-on experience;
     an administrator can override it per letter before issuing */
  var HOURS_PER_PRACTICAL = 30;

  function J(k, d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function store(){ var o=J(KEY,{}); return (o&&typeof o==='object'&&!Array.isArray(o))?o:{}; }
  function save(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); return true; }catch(e){ return false; } }
  function pad(n){ return (n<10?'0':'')+n; }
  function ymd(ms){ var d=new Date(ms); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function longDate(ms){
    var d=new Date(ms||Date.now());
    var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
    return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();
  }

  var DEFAULTS = {
    asapLogo:'', signatory:'Dr Abijeeth Tiwari', designation:'Director',
    place:'Thiruvananthapuram', hoursPer:HOURS_PER_PRACTICAL,
    /* signMode 'wet' leaves a blank space to sign by hand; 'digital' applies the
       stored signature so the PDF comes out already signed. Shared with the
       admission notification, so one upload serves every document. */
    signMode:'wet', signImage:'', sealImage:''
  };
  function settings(){
    var s=store()._settings||{}, out={};
    Object.keys(DEFAULTS).forEach(function(k){ out[k]=(s[k]==null||s[k]==='')?DEFAULTS[k]:s[k]; });
    return out;
  }
  function saveSettings(patch){
    var all=store(), s=all._settings||{};
    Object.keys(patch||{}).forEach(function(k){ s[k]=patch[k]; });
    all._settings=s; return save(all);
  }

  /* ---- what the student has actually had verified ---- */
  function roster(reg){
    var all=J('alizonStudents',[]); if(!Array.isArray(all)) return {};
    reg=String(reg||'').toUpperCase();
    for(var i=0;i<all.length;i++){ if(String(all[i].reg||'').toUpperCase()===reg) return all[i]; }
    return {};
  }
  /* evaluated practicals only — an unmarked submission is not experience.
     A student can submit the same practical more than once and faculty may grade
     each attempt; certifying both would bill the same work twice, so only the
     latest evaluated attempt of a given practical is offered. */
  function verifiedPracticals(reg){
    reg=String(reg||'').toUpperCase();
    var subs=J('alizonSubmissions',[]); if(!Array.isArray(subs)) return [];
    var rows=subs.filter(function(s){
      return s && s.type==='practical'
        && String(s.reg||'').toUpperCase()===reg
        && s.status==='evaluated' && s.mark!=null;
    }).map(function(s){
      return { id:s.id, title:s.title||s.module||'Practical', module:s.module||'',
               mark:s.mark, at:s.evaluatedAt||s.ts, by:s.gradedBy||'', attempts:1 };
    }).sort(function(a,b){ return (a.at||0)-(b.at||0); });

    var byWork={}, out=[];
    rows.forEach(function(r){
      var k=((r.module||'')+'||'+(r.title||'')).toLowerCase().replace(/\s+/g,' ').trim();
      var prev=byWork[k];
      if(!prev){ byWork[k]=r; out.push(r); return; }
      prev.attempts++;                       /* keep the newest attempt in place */
      prev.id=r.id; prev.mark=r.mark; prev.at=r.at; prev.by=r.by;
    });
    return out;
  }

  function get(reg){ return store()[String(reg||'').toUpperCase()] || null; }
  function list(){
    var s=store();
    return Object.keys(s).filter(function(k){ return k!=='_settings'; })
      .map(function(k){ return { reg:k, letter:s[k] }; })
      .sort(function(a,b){ return (b.letter.issued||0)-(a.letter.issued||0); });
  }

  /* A certificate number must never be reused: a revoked letter may already be
     printed and in someone's hands. Counting the surviving letters would rewind
     after every revoke, so the sequence is stored and only ever goes up.
     Takes the caller's store object and bumps the counter on it, so the
     single save() at the end of issue() persists the new sequence too. */
  function nextNo(all){
    var s=all._settings||{};
    var highest=0;
    Object.keys(all).forEach(function(k){
      if(k==='_settings') return;
      var m=/(\d+)\s*$/.exec(String((all[k]||{}).no||''));
      if(m) highest=Math.max(highest, parseInt(m[1],10)||0);
    });
    var n=Math.max(Number(s.seq)||0, highest)+1;
    s.seq=n; all._settings=s;
    return 'ALZ/EXP/'+new Date().getFullYear()+'/'+('000'+n).slice(-4);
  }

  /* issue for the selected verified practicals only */
  function issue(reg, items, opts){
    reg=String(reg||'').toUpperCase();
    if(!reg || !items || !items.length) return null;
    opts=opts||{};
    var st=settings();
    /* the fallback rate, used only for a practical the administrator left blank */
    var hoursPer=Number(opts.hoursPer!=null?opts.hoursPer:st.hoursPer)||HOURS_PER_PRACTICAL;
    var all=store(), prev=all[reg];
    var times=items.map(function(i){ return i.at||0; }).filter(Boolean);
    /* hours are decided by the administrator, per practical */
    var priced=items.map(function(i){
      var h=Number(i.hours);
      return { id:i.id, title:i.title, module:i.module, mark:i.mark, at:i.at, by:i.by,
               hours: (isFinite(h)&&h>0)?h:hoursPer };
    });
    var rec={
      no: (prev&&prev.no)||opts.no||nextNo(all),
      /* opts.issued lets a caller put a letter back exactly as it was
         (the admin preview stashes and restores) without re-dating it */
      issued: opts.issued||Date.now(), by: opts.by||'Administrator',
      hoursPer: hoursPer,
      total: priced.reduce(function(a,i){ return a+i.hours; }, 0),
      items: priced,
      from: times.length?ymd(Math.min.apply(null,times)):'',
      to:   times.length?ymd(Math.max.apply(null,times)):''
    };
    all[reg]=rec;
    return save(all)?rec:null;
  }

  /* hours for one row — letters issued before per-practical hours existed
     carry only the flat rate, so fall back to it */
  function itemHours(rec, it){
    var h=Number(it&&it.hours);
    if(isFinite(h)&&h>0) return h;
    return Number(rec&&rec.hoursPer)||HOURS_PER_PRACTICAL;
  }
  function uniformHours(rec){
    var items=(rec&&rec.items)||[]; if(!items.length) return 0;
    var first=itemHours(rec,items[0]);
    for(var i=1;i<items.length;i++){ if(itemHours(rec,items[i])!==first) return 0; }
    return first;
  }
  function revoke(reg){
    var all=store(); reg=String(reg||'').toUpperCase();
    if(!all[reg]) return false;
    delete all[reg]; return save(all);
  }

  /* ---- the ASAP mark that sits beside our crest ----
     The official artwork ships with the site; an administrator upload
     overrides it, and the typographic mark is the last resort. */
  var ASAP_ASSET='/asap-logo.png';
  function asapMark(){
    var logo=settings().asapLogo||ASAP_ASSET;
    return '<img class="x-asap-img" src="'+esc(logo)+'" alt="ASAP — Additional Skill Acquisition Programme"'
      +' onerror="this.outerHTML=\'<div class=&quot;x-asap-txt&quot;><b>ASAP</b><span>KERALA</span></div>\'">';
  }

  /* the signature block, shared with the admission notification.
     `p` is the class prefix ('x' for the letter, 'n' for the notification). */
  function signatureBits(p, o){
    var s=settings();
    o=o||{};
    var digital=(s.signMode==='digital' && s.signImage);
    var seal=s.sealImage
      ? '<div class="'+p+'-seal '+p+'-seal-img"><img src="'+esc(s.sealImage)+'" alt="Institution seal"></div>'
      : '<div class="'+p+'-seal">(Institution seal)</div>';
    var area=digital
      ? '<div class="'+p+'-sig-area"><img class="'+p+'-sig-img" src="'+esc(s.signImage)+'" alt="Signature"></div>'
      : '<div class="'+p+'-sig-area"></div>';
    return {
      seal: seal,
      sign: area+'<div class="'+p+'-sig-rule"></div>'
            +'<div class="'+p+'-sig-n">'+esc(o.signatory||s.signatory)+'</div>'
            +'<div class="'+p+'-sig-d">'+esc(o.designation||s.designation)+'</div>'
            +'<div class="'+p+'-sig-i">Alizon School of Medical &amp; Digital Intelligence</div>',
      digital: digital,
      note: digital
        ? 'This is a system-generated document. The signature above is applied digitally and the document is valid without a physical signature.'
        : ''
    };
  }

  function letterhead(){
    return '<header class="x-lh">'
      +'<img class="x-lh-logo" src="/alizon-logo.png" alt="Alizon crest" onerror="this.style.display=\'none\'">'
      +'<div class="x-lh-txt">'
        +'<div class="x-lh-name">Alizon School of Medical &amp; Digital Intelligence</div>'
        +'<div class="x-lh-tag">Advancing Artificial Intelligence in Healthcare Education</div>'
        +'<div class="x-lh-addr">Thiruvananthapuram, Kerala, India&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</div>'
      +'<div class="x-lh-asap">'+asapMark()+'</div>'
      +'</header>'
      +'<div class="x-lh-affil">An initiative under <b>ASAP Kerala</b> — Additional Skill Acquisition Programme, '
      +'Department of Higher Education, Government of Kerala&nbsp; ·&nbsp; Registered with <b>Kerala Startup Mission</b></div>';
  }

  function letterHtml(reg){
    reg=String(reg||'').toUpperCase();
    var rec=get(reg); if(!rec) return '';
    var st=roster(reg), s=settings();
    var name=((st.salutation?st.salutation+' ':'')+(st.name||'')).trim()||'The candidate';
    var course=st.course||'';
    var items=rec.items||[];

    var h='<article class="alz-exp" id="alzExpDoc">';
    h+=letterhead();
    h+='<div class="x-body">';

    h+='<div class="x-top"><span>Ref: <b>'+esc(rec.no)+'</b></span><span>Date: <b>'+longDate(rec.issued)+'</b></span></div>';
    h+='<h2 class="x-title">Certificate of Practical Experience</h2>';
    h+='<div class="x-rule"></div>';

    h+='<p class="x-p">This is to certify that <b>'+esc(name)+'</b>'
      +(st.reg?' (Register No. <b>'+esc(st.reg)+'</b>)':'')
      +(course?', a candidate of the <b>'+esc(course)+'</b>':'')
      +(st.batch?', '+esc(st.batch):'')
      +', has satisfactorily completed supervised hands-on practical training at this institution.</p>';

    var uni=uniformHours(rec);
    h+='<p class="x-p">'
      +(uni
        ? 'Each practical listed below carries <b>'+uni+' hours</b> of hands-on experience, amounting to '
        : 'The practicals listed below carry the hours of hands-on experience shown against each, amounting to ')
      +'<b>'+rec.total+' hours</b> of supervised practical training in total. '
      +'Every practical was submitted through the institution&rsquo;s laboratory platform, and was '
      +'<b>evaluated and verified</b> by the faculty before being recorded here.</p>';

    h+='<div class="x-tblwrap"><table class="x-tbl"><thead><tr>'
      +'<th style="width:36px">#</th><th>Practical</th><th>Module</th>'
      +'<th style="width:74px">Hours</th><th style="width:74px">Mark</th><th style="width:96px">Verified on</th>'
      +'</tr></thead><tbody>';
    items.forEach(function(it,i){
      h+='<tr><td class="c">'+(i+1)+'</td><td class="l">'+esc(it.title)+'</td>'
        +'<td class="l s">'+esc(it.module||'—')+'</td>'
        +'<td class="c">'+itemHours(rec,it)+'</td>'
        +'<td class="c">'+(it.mark!=null?esc(it.mark)+'/100':'—')+'</td>'
        +'<td class="c s">'+(it.at?esc(ymd(it.at)):'—')+'</td></tr>';
    });
    h+='<tr class="x-tot"><td></td><td class="l">Total — '+items.length+' practical'+(items.length===1?'':'s')+'</td><td></td>'
      +'<td class="c">'+rec.total+'</td><td></td><td></td></tr>';
    h+='</tbody></table></div>';

    if(rec.from&&rec.to) h+='<p class="x-p x-period">Period of practical training on record: <b>'+esc(rec.from)+'</b> to <b>'+esc(rec.to)+'</b>.</p>';

    h+='<p class="x-p">During the training the candidate demonstrated professional conduct, followed the prescribed '
      +'standard operating procedures and documentation practice, and worked under faculty supervision throughout. '
      +'This certificate is issued on request for the purpose of academic and employment record.</p>';

    var sb=signatureBits('x');
    h+='<div class="x-sign">'
      +'<div class="x-sign-l"><div class="x-kv">Place: <b>'+esc(s.place)+'</b></div>'
        +'<div class="x-kv">Date: <b>'+longDate(rec.issued)+'</b></div>'
        +sb.seal+'</div>'
      +'<div class="x-sign-r">'+sb.sign+'</div>'
      +'</div>';
    if(sb.note) h+='<div class="x-sysnote">'+sb.note+'</div>';

    h+='</div>';
    h+='<footer class="x-foot"><div class="x-foot-rule"></div>'
      +'<p>Certificate '+esc(rec.no)+' · system-generated from verified practical records held by the Controller of Examinations. '
      +'Authenticity can be confirmed with the institution quoting the reference number above.</p>'
      +'<div class="x-foot-b">Alizon School of Medical &amp; Digital Intelligence&nbsp; ·&nbsp; Thiruvananthapuram, Kerala&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</footer>';
    h+='</article>';
    return h;
  }

  var CSS =
     '.alz-exp{--cr:#8c1515;--cr2:#6b0f0f;--gold:#9a7b3f;--ink:#26221f;--muted:#6e6a63;'
    +'max-width:820px;margin:0 auto;color:var(--ink);background:#fff;'
    +'font-family:"Source Sans 3","Source Sans Pro",-apple-system,Helvetica,Arial,sans-serif}'
    +'.alz-exp .x-lh{display:flex;align-items:center;gap:16px;padding-bottom:14px;border-bottom:2.5px solid var(--cr)}'
    +'.alz-exp .x-lh-logo{width:62px;height:62px;object-fit:contain;flex:none}'
    +'.alz-exp .x-lh-txt{flex:1;min-width:0}'
    +'.alz-exp .x-lh-name{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(17px,2.4vw,23px);font-weight:700;color:var(--cr);line-height:1.15}'
    +'.alz-exp .x-lh-tag{font-size:12px;font-style:italic;color:var(--muted);margin-top:3px}'
    +'.alz-exp .x-lh-addr{font-size:11px;letter-spacing:.04em;color:#8a827b;margin-top:4px;font-weight:600}'
    +'.alz-exp .x-lh-asap{flex:none;display:grid;place-items:center;min-width:96px}'
    +'.alz-exp .x-asap-img{max-width:132px;max-height:56px;object-fit:contain}'
    +'.alz-exp .x-asap-txt{text-align:center;border:1.5px solid var(--gold);border-radius:8px;padding:6px 10px;line-height:1}'
    +'.alz-exp .x-asap-txt b{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:19px;font-weight:700;color:var(--cr);letter-spacing:.04em}'
    +'.alz-exp .x-asap-txt span{display:block;font-size:8.5px;font-weight:700;letter-spacing:.19em;color:var(--gold);margin-top:3px}'
    +'.alz-exp .x-lh-affil{font-size:10.5px;line-height:1.5;color:#5f5a54;background:linear-gradient(90deg,rgba(154,123,63,.1),rgba(154,123,63,.02));'
    +'border-left:3px solid var(--gold);padding:6px 12px;margin-top:9px;border-radius:0 6px 6px 0}'
    +'.alz-exp .x-lh-affil b{color:var(--cr2)}'
    +'.alz-exp .x-body{padding-top:18px}'
    +'.alz-exp .x-top{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}'
    +'.alz-exp .x-top b{color:var(--ink)}'
    +'.alz-exp .x-title{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(18px,2.8vw,24px);font-weight:700;'
    +'color:var(--cr);text-align:center;margin:16px 0 0;letter-spacing:.01em}'
    +'.alz-exp .x-rule{width:120px;height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));margin:9px auto 20px;border-radius:2px}'
    +'.alz-exp .x-p{font-size:13.8px;line-height:1.8;margin:0 0 13px;text-align:justify}'
    +'.alz-exp .x-period{background:#faf8f6;border-left:3px solid var(--gold);border-radius:0 7px 7px 0;padding:9px 13px}'
    +'.alz-exp .x-tblwrap{overflow-x:auto;border:1px solid rgba(0,0,0,.12);border-radius:9px;margin:16px 0}'
    +'.alz-exp .x-tbl{border-collapse:collapse;width:100%;min-width:540px;font-size:12.5px}'
    +'.alz-exp .x-tbl th{background:var(--cr);color:#fff;font-weight:600;padding:8px 9px;text-align:center;'
    +'border:1px solid rgba(255,255,255,.18);font-size:11px;letter-spacing:.02em}'
    +'.alz-exp .x-tbl td{padding:8px 9px;border:1px solid rgba(0,0,0,.08)}'
    +'.alz-exp .x-tbl td.c{text-align:center}.alz-exp .x-tbl td.l{text-align:left}'
    +'.alz-exp .x-tbl td.s{font-size:11.5px;color:var(--muted)}'
    +'.alz-exp .x-tbl tbody tr:nth-child(even){background:#faf8f6}'
    +'.alz-exp .x-tbl tr.x-tot td{background:var(--cr);color:#fff;font-weight:700;border-color:rgba(255,255,255,.18)}'
    +'.alz-exp .x-sign{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-top:34px}'
    +'.alz-exp .x-kv{font-size:12.5px;margin-bottom:5px}'
    +'.alz-exp .x-seal{margin-top:22px;width:104px;height:104px;border:1.5px dashed rgba(140,21,21,.35);border-radius:50%;'
    +'display:grid;place-items:center;font-size:10px;color:#a8a099;text-align:center;padding:8px}'
    +'.alz-exp .x-sign-r{text-align:center;align-self:flex-end;min-width:230px}'
    +'.alz-exp .x-sig-area{height:60px;display:flex;align-items:flex-end;justify-content:center}'
    +'.alz-exp .x-sig-img{max-height:58px;max-width:210px;object-fit:contain}'
    +'.alz-exp .x-sig-rule{border-top:1.5px solid var(--ink);margin-bottom:7px}'
    +'.alz-exp .x-seal-img{border:none;padding:0}'
    +'.alz-exp .x-seal-img img{max-width:100px;max-height:100px;object-fit:contain}'
    +'.alz-exp .x-sysnote{margin-top:14px;font-size:11px;font-style:italic;color:var(--muted);text-align:center}'
    +'.alz-exp .x-sig-n{font-weight:700;font-size:13.5px}'
    +'.alz-exp .x-sig-d{font-size:12px;color:var(--muted)}'
    +'.alz-exp .x-sig-i{font-size:11px;color:var(--muted);margin-top:2px}'
    +'.alz-exp .x-foot{margin-top:28px}'
    +'.alz-exp .x-foot-rule{height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));border-radius:2px}'
    +'.alz-exp .x-foot p{font-size:10.5px;line-height:1.6;color:var(--muted);margin:10px 0 7px;text-align:center}'
    +'.alz-exp .x-foot-b{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--cr);text-align:center}'
    +'@media print{body{background:#fff!important}'
    +'.no-print,.nav,.strip,#alizonBackBar,#azsitehdr,footer.site{display:none!important}'
    +'.alz-exp{max-width:none}'
    +'.alz-exp .x-tblwrap,.alz-exp .x-sign,.alz-exp .x-tbl tr{break-inside:avoid}}';

  function injectCss(doc){
    doc=doc||document;
    if(doc.getElementById('alzExpCss')) return;
    var st=doc.createElement('style'); st.id='alzExpCss'; st.textContent=CSS;
    doc.head.appendChild(st);
  }

  /* render into an element on the current page */
  function render(el, reg){
    if(!el) return false;
    var h=letterHtml(reg);
    if(!h){ el.innerHTML=''; return false; }
    injectCss(); el.innerHTML=h; return true;
  }

  /* open the letter in its own window, ready to print / save as PDF */
  function open_(reg){
    var h=letterHtml(reg); if(!h) return false;
    var w=window.open('','_blank'); if(!w) return false;
    w.document.write('<!doctype html><html><head><meta charset="utf-8">'
      +'<title>Certificate of Practical Experience — '+esc(reg)+'</title>'
      +'<link rel="preconnect" href="https://fonts.googleapis.com">'
      +'<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet">'
      +'<style>body{margin:0;padding:26px 20px;background:#f4f1ee}'+CSS
      +'.x-print{max-width:820px;margin:0 auto 14px;text-align:right}'
      +'.x-print button{cursor:pointer;font:inherit;font-size:13px;font-weight:600;border-radius:100px;'
      +'padding:9px 20px;color:#fff;background:#8c1515;border:1px solid #8c1515}'
      +'@media print{body{padding:0;background:#fff}.x-print{display:none}}</style></head><body>'
      +'<div class="x-print"><button onclick="window.print()">Download / Print PDF</button></div>'
      +h+'</body></html>');
    w.document.close();
    return true;
  }

  window.AlizonExperience = {
    HOURS_PER_PRACTICAL: HOURS_PER_PRACTICAL,
    settings:settings, saveSettings:saveSettings,
    verifiedPracticals:verifiedPracticals,
    get:get, list:list, issue:issue, revoke:revoke,
    itemHours:itemHours, uniformHours:uniformHours, signatureBits:signatureBits,
    letterHtml:letterHtml, render:render, open:open_, css:CSS
  };
})();
