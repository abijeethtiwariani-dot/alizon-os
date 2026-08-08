/* =====================================================================
   ALIZON — Police Clearance Certificate (PCC) letters

   Two letters, both on the institution letterhead:

   'candidate'  — tells an applicant that a PCC is required before their
                  admission can be confirmed, what to produce and by when.
   'authority'  — a bonafide request TO the issuing authority asking that a
                  PCC be issued in the candidate's favour, with their
                  particulars set out for verification.

   Scope 'india' addresses the jurisdictional police; scope 'abroad'
   addresses the Regional Passport Office / mission abroad and adds the
   attestation wording those need.

   Storage: localStorage "alizonPCC" (registered in firebase-sync)
     { seq: <n>, items: [ {no, ts, ...} ] }   — a reprint log, no images

   Public API: window.AlizonPCC = {
     KINDS, SCOPES, blank, fromRoster, issue, list, get, remove,
     html, render, open, print
   }
   ===================================================================== */
(function () {
  'use strict';
  if (window.AlizonPCC) return;

  var KEY = 'alizonPCC';
  var MAX = 2000;

  var KINDS = {
    candidate:'Requirement notice to the candidate',
    authority:'Request to the issuing authority'
  };
  var SCOPES = { india:'Within India', abroad:'Outside India' };

  function J(k, d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function txt(s){ return String(s==null?'':s).trim(); }
  function store(){
    var o=J(KEY,{seq:0,items:[]});
    if(!o||typeof o!=='object'||Array.isArray(o)) o={seq:0,items:[]};
    if(!Array.isArray(o.items)) o.items=[];
    return o;
  }
  function save_(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); return true; }catch(e){ return false; } }
  function pad(n){ return (n<10?'0':'')+n; }
  function today(){ var d=new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function longDate(v){
    if(!v) return '';
    var d=new Date(String(v).length===10?(v+'T00:00:00'):v);
    if(isNaN(d.getTime())) return String(v);
    var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
    return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();
  }
  /* the roster keeps dates of birth as a bare DDMMYYYY string — print it readably */
  function humanDob(v){
    var t=txt(v); if(!t) return '';
    var m=/^(\d{2})(\d{2})(\d{4})$/.exec(t.replace(/[^\d]/g,''));
    if(m) return m[1]+'-'+m[2]+'-'+m[3];
    return t;
  }
  function addDays(n){
    var d=new Date(); d.setDate(d.getDate()+n);
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  }

  function blank(){
    return { kind:'candidate', scope:'india', date:today(), deadline:addDays(21),
             name:'', salutation:'', reg:'', dob:'', guardian:'', address:'',
             course:'', batch:'', country:'', authority:'', place:'Thiruvananthapuram',
             signerId:'', note:'' };
  }

  /* pull what we already hold about the candidate so nothing is retyped */
  function fromRoster(reg){
    var all=J('alizonStudents',[]); if(!Array.isArray(all)) return null;
    reg=txt(reg).toUpperCase();
    var st=null;
    for(var i=0;i<all.length;i++){ if(txt(all[i].reg).toUpperCase()===reg){ st=all[i]; break; } }
    if(!st) return null;
    var addr=[st.address, st.city, st.district, st.state, st.pin].map(txt).filter(Boolean).join(', ');
    var o=blank();
    o.name=txt(st.name); o.salutation=txt(st.salutation); o.reg=txt(st.reg);
    o.dob=txt(st.dob); o.guardian=txt(st.father)||txt(st.mother);
    o.address=addr; o.course=txt(st.course); o.batch=txt(st.batch);
    return o;
  }

  /* the default addressee for the chosen scope */
  function defaultAuthority(o){
    if(txt(o.authority)) return txt(o.authority);
    if(o.scope==='abroad')
      return 'The Regional Passport Officer / The Competent Authority'
           + (txt(o.country)?',\n'+txt(o.country):'');
    return 'The Commissioner of Police / The Superintendent of Police';
  }

  /* ---- storage: a reprint log, so a reference number stays stable ---- */
  function nextNo(s){
    var highest=0;
    s.items.forEach(function(x){
      var m=/(\d+)\s*$/.exec(String(x.no||''));
      if(m) highest=Math.max(highest, parseInt(m[1],10)||0);
    });
    var n=Math.max(Number(s.seq)||0, highest)+1;
    s.seq=n;
    return 'ALZ/PCC/'+new Date().getFullYear()+'/'+('000'+n).slice(-4);
  }
  function issue(o){
    if(!o || !txt(o.name)) return null;
    var s=store();
    var rec=JSON.parse(JSON.stringify(o));
    rec.no=txt(o.no)||nextNo(s);
    rec.ts=Date.now();
    /* re-issuing the same reference replaces its record rather than piling up */
    var i=-1; s.items.forEach(function(x,ix){ if(x.no===rec.no) i=ix; });
    if(i<0) s.items.push(rec); else s.items[i]=rec;
    if(s.items.length>MAX) s.items=s.items.slice(-MAX);
    return save_(s)?rec:null;
  }
  function list(){ return store().items.slice().sort(function(a,b){ return (b.ts||0)-(a.ts||0); }); }
  function get(no){
    var it=store().items;
    for(var i=0;i<it.length;i++){ if(it[i].no===no) return it[i]; }
    return null;
  }
  function remove(no){
    var s=store();
    s.items=s.items.filter(function(x){ return x.no!==no; });
    return save_(s);
  }

  /* ---- the letter ---- */
  function who(o){
    return (txt(o.salutation)?txt(o.salutation)+' ':'')+txt(o.name);
  }
  function bodyCandidate(o){
    var p=[];
    p.push('This is to inform you that, as part of the admission and verification process for the '
      +'<b>'+esc(txt(o.course)||'programme')+'</b>'+(txt(o.batch)?' ('+esc(txt(o.batch))+')':'')
      +' at this institution, you are required to produce a <b>Police Clearance Certificate</b>.');
    if(o.scope==='abroad'){
      p.push('As your candidature involves study, training or placement outside India'
        +(txt(o.country)?' in <b>'+esc(txt(o.country))+'</b>':'')
        +', the certificate should be obtained from the Regional Passport Office or the competent '
        +'authority of the country concerned, and should carry any attestation or apostille that '
        +'authority requires.');
    } else {
      p.push('The certificate should be obtained from the jurisdictional police authority for your '
        +'place of residence, or through the Passport Seva portal where that facility applies to you.');
    }
    p.push('The certificate must be in your own name, must state that there is no adverse record '
      +'against you, and should ordinarily have been issued within the six months preceding the date '
      +'of submission. A clear scanned copy may be submitted to the Office of Admissions, with the '
      +'original produced for verification.');
    p.push('Kindly submit the certificate on or before <b>'+esc(longDate(o.deadline))+'</b>. '
      +'Admission is confirmed only on satisfactory completion of this verification. Should you need '
      +'a supporting letter addressed to the issuing authority, the Office of Admissions will provide one on request.');
    if(txt(o.note)) p.push(esc(txt(o.note)));
    return p;
  }
  function bodyAuthority(o){
    var p=[];
    p.push('It is certified that <b>'+esc(who(o))+'</b>'
      +(txt(o.guardian)?', son / daughter of <b>'+esc(txt(o.guardian))+'</b>':'')
      +(txt(o.reg)?' (Register No. <b>'+esc(txt(o.reg))+'</b>)':'')
      +', is a candidate for admission to the <b>'+esc(txt(o.course)||'programme')+'</b>'
      +(txt(o.batch)?' ('+esc(txt(o.batch))+')':'')
      +' at Alizon School of Medical &amp; Digital Intelligence, Thiruvananthapuram, Kerala — an '
      +'institution operating under the ASAP Kerala framework of the Department of Higher Education, '
      +'Government of Kerala.');
    p.push('A <b>Police Clearance Certificate</b> is required as part of this institution&rsquo;s admission '
      +'verification process'
      +(o.scope==='abroad'
        ? ', and for the candidate&rsquo;s subsequent study, training or placement outside India'
          +(txt(o.country)?' in <b>'+esc(txt(o.country))+'</b>':'')+'.'
        : '.'));
    p.push('You are kindly requested to issue a Police Clearance Certificate in favour of the '
      +'candidate whose particulars are set out below. The institution has no objection to the '
      +'verification of any information furnished by the candidate, and will provide any further '
      +'confirmation your office may require.');
    if(txt(o.note)) p.push(esc(txt(o.note)));
    return p;
  }

  function html(o){
    if(typeof o==='string') o=get(o);
    if(!o) return '';
    var isAuth=(o.kind==='authority');

    var sb=null;
    try{ if(window.AlizonExperience) sb=window.AlizonExperience.signatureBits('p',
      { doc:'pcc', signerId:o.signerId }); }catch(e){}
    if(!sb) sb={ seal:'', sign:'<div class="p-sig-area"></div><div class="p-sig-rule"></div>'
      +'<div class="p-sig-n">&nbsp;</div>', note:'' };

    var asap='';
    try{
      var lg=(window.AlizonExperience && window.AlizonExperience.settings().asapLogo)||'/asap-logo.png';
      asap='<img class="p-asap" src="'+esc(lg)+'" alt="ASAP — Additional Skill Acquisition Programme"'
         +' onerror="this.style.display=\'none\'">';
    }catch(e){}

    var h='<article class="alz-pcc" id="alzPccDoc">';
    h+='<header class="p-lh">'
      +'<img class="p-lh-logo" src="/alizon-logo.png" alt="Alizon crest" onerror="this.style.display=\'none\'">'
      +'<div class="p-lh-txt">'
        +'<div class="p-lh-name">Alizon School of Medical &amp; Digital Intelligence</div>'
        +'<div class="p-lh-tag">Advancing Artificial Intelligence in Healthcare Education</div>'
        +'<div class="p-lh-addr">Thiruvananthapuram, Kerala, India&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</div><div class="p-lh-asap">'+asap+'</div></header>'
      +'<div class="p-affil">An initiative under <b>ASAP Kerala</b> — Additional Skill Acquisition Programme, '
      +'Department of Higher Education, Government of Kerala&nbsp; ·&nbsp; Registered with <b>Kerala Startup Mission</b></div>';

    h+='<div class="p-body">';
    h+='<div class="p-top"><span>'+(txt(o.no)?'Ref: <b>'+esc(o.no)+'</b>':'')+'</span>'
      +'<span>Date: <b>'+longDate(o.date)+'</b></span></div>';

    if(isAuth){
      h+='<div class="p-to"><span class="p-lbl">To</span>'
        +'<div>'+esc(defaultAuthority(o)).replace(/\n/g,'<br>')+'</div></div>';
    } else {
      h+='<div class="p-to"><span class="p-lbl">To</span><div>'+esc(who(o))
        +(txt(o.reg)?'<br>Register No. '+esc(txt(o.reg)):'')
        +(txt(o.address)?'<br>'+esc(txt(o.address)):'')+'</div></div>';
    }

    h+='<h2 class="p-subj"><span>Subject:</span> '
      +(isAuth
        ? 'Request for issuance of a Police Clearance Certificate — '+esc(who(o))
          +(txt(o.reg)?' ('+esc(txt(o.reg))+')':'')
        : 'Police Clearance Certificate required for confirmation of admission')
      +'</h2>';

    h+='<p class="p-sal">'+(isAuth?'Sir / Madam,':'Dear '+esc(who(o))+',')+'</p>';
    (isAuth?bodyAuthority(o):bodyCandidate(o)).forEach(function(t){ h+='<p class="p-p">'+t+'</p>'; });

    if(isAuth){
      var rows=[
        ['Name of candidate', who(o)],
        ['Father / Guardian', txt(o.guardian)],
        ['Date of birth', humanDob(o.dob)],
        ['Register number', txt(o.reg)],
        ['Address on record', txt(o.address)],
        ['Programme', txt(o.course)+(txt(o.batch)?' · '+txt(o.batch):'')],
        ['Purpose', 'Admission verification'+(o.scope==='abroad'
            ? ' and study / training abroad'+(txt(o.country)?' — '+txt(o.country):'') : '')]
      ].filter(function(r){ return txt(r[1]); });
      h+='<div class="p-tblwrap"><table class="p-tbl"><thead><tr><th colspan="2">Particulars of the candidate</th></tr></thead><tbody>'
        +rows.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>'; }).join('')
        +'</tbody></table></div>';
    }

    h+='<p class="p-p">'+(isAuth
      ? 'Thanking you for your kind consideration.'
      : 'For any clarification, please contact the Office of Admissions.')+'</p>';

    h+='<div class="p-sign">'
      +'<div class="p-sign-l">'
        +(txt(o.place)?'<div class="p-kv">Place: <b>'+esc(txt(o.place))+'</b></div>':'')
        +'<div class="p-kv">Date: <b>'+longDate(o.date)+'</b></div>'
        +sb.seal+'</div>'
      +'<div class="p-sign-r">'+sb.sign+'</div></div>';
    if(sb.note) h+='<div class="p-sysnote">'+sb.note+'</div>';
    h+='</div>';

    h+='<footer class="p-foot"><div class="p-foot-rule"></div>'
      +'<p>Issued by the Office of Admissions, Alizon School of Medical &amp; Digital Intelligence. '
      +'Authenticity may be confirmed with the institution quoting the reference number above.</p>'
      +'<div class="p-foot-b">Alizon School of Medical &amp; Digital Intelligence&nbsp; ·&nbsp; '
      +'Thiruvananthapuram, Kerala&nbsp; ·&nbsp; www.alizon.in</div></footer>';
    h+='</article>';
    return h;
  }

  var CSS =
     '.alz-pcc{--cr:#8c1515;--cr2:#6b0f0f;--gold:#9a7b3f;--ink:#26221f;--muted:#6e6a63;'
    +'max-width:820px;margin:0 auto;background:#fff;color:var(--ink);'
    +'font-family:"Source Sans 3","Source Sans Pro",-apple-system,Helvetica,Arial,sans-serif}'
    +'.alz-pcc .p-lh{display:flex;align-items:center;gap:16px;padding-bottom:14px;border-bottom:2.5px solid var(--cr)}'
    +'.alz-pcc .p-lh-logo{width:62px;height:62px;object-fit:contain;flex:none}'
    +'.alz-pcc .p-lh-txt{flex:1;min-width:0}'
    +'.alz-pcc .p-lh-name{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(17px,2.4vw,23px);font-weight:700;color:var(--cr);line-height:1.15}'
    +'.alz-pcc .p-lh-tag{font-size:12px;font-style:italic;color:var(--muted);margin-top:3px}'
    +'.alz-pcc .p-lh-addr{font-size:11px;letter-spacing:.04em;color:#8a827b;margin-top:4px;font-weight:600}'
    +'.alz-pcc .p-lh-asap{flex:none;display:grid;place-items:center;min-width:96px}'
    +'.alz-pcc .p-asap{max-width:132px;max-height:56px;object-fit:contain}'
    +'.alz-pcc .p-affil{font-size:10.5px;line-height:1.5;color:#5f5a54;background:linear-gradient(90deg,rgba(154,123,63,.1),rgba(154,123,63,.02));'
    +'border-left:3px solid var(--gold);padding:6px 12px;margin-top:9px;border-radius:0 6px 6px 0}'
    +'.alz-pcc .p-affil b{color:var(--cr2)}'
    +'.alz-pcc .p-body{padding-top:18px}'
    +'.alz-pcc .p-top{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}'
    +'.alz-pcc .p-top b{color:var(--ink)}'
    +'.alz-pcc .p-to{margin-top:20px;font-size:13.5px;line-height:1.7}'
    +'.alz-pcc .p-lbl{display:block;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:3px}'
    +'.alz-pcc .p-subj{font-size:14px;font-weight:700;margin:20px 0 4px;line-height:1.5;color:var(--ink);'
    +'border-left:3px solid var(--cr);padding:8px 13px;background:#faf8f6;border-radius:0 7px 7px 0}'
    +'.alz-pcc .p-subj span{color:var(--cr);text-transform:uppercase;letter-spacing:.05em;font-size:11.5px}'
    +'.alz-pcc .p-sal{font-size:13.8px;margin:18px 0 12px}'
    +'.alz-pcc .p-p{font-size:13.8px;line-height:1.85;margin:0 0 13px;text-align:justify}'
    +'.alz-pcc .p-tblwrap{border:1px solid rgba(0,0,0,.12);border-radius:9px;overflow:hidden;margin:16px 0}'
    +'.alz-pcc .p-tbl{border-collapse:collapse;width:100%;font-size:13px}'
    +'.alz-pcc .p-tbl th{background:var(--cr);color:#fff;font-weight:600;padding:9px 12px;text-align:left;'
    +'font-size:11.5px;letter-spacing:.05em;text-transform:uppercase}'
    +'.alz-pcc .p-tbl td{padding:9px 12px;border-top:1px solid rgba(0,0,0,.08);line-height:1.55;vertical-align:top}'
    +'.alz-pcc .p-tbl td:first-child{width:38%;color:var(--muted);font-size:12.5px}'
    +'.alz-pcc .p-tbl td:last-child{font-weight:600}'
    +'.alz-pcc .p-tbl tbody tr:nth-child(even){background:#faf8f6}'
    +'.alz-pcc .p-sign{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-top:34px}'
    +'.alz-pcc .p-kv{font-size:12.5px;margin-bottom:5px}'
    +'.alz-pcc .p-seal{margin-top:20px;width:104px;height:104px;border:1.5px dashed rgba(140,21,21,.35);border-radius:50%;'
    +'display:grid;place-items:center;font-size:10px;color:#a8a099;text-align:center;padding:8px}'
    +'.alz-pcc .p-seal-img{border:none;padding:0}'
    +'.alz-pcc .p-seal-img img{max-width:100px;max-height:100px;object-fit:contain}'
    +'.alz-pcc .p-sign-r{text-align:center;align-self:flex-end;min-width:230px}'
    +'.alz-pcc .p-sig-area{height:60px;display:flex;align-items:flex-end;justify-content:center}'
    +'.alz-pcc .p-sig-img{max-height:58px;max-width:210px;object-fit:contain}'
    +'.alz-pcc .p-sig-rule{border-top:1.5px solid var(--ink);margin-bottom:7px}'
    +'.alz-pcc .p-sig-n{font-weight:700;font-size:13.5px}'
    +'.alz-pcc .p-sig-d{font-size:12px;color:var(--muted)}'
    +'.alz-pcc .p-sig-i{font-size:11px;color:var(--muted);margin-top:2px}'
    +'.alz-pcc .p-sysnote{margin-top:14px;font-size:11px;font-style:italic;color:var(--muted);text-align:center}'
    +'.alz-pcc .p-foot{margin-top:28px}'
    +'.alz-pcc .p-foot-rule{height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));border-radius:2px}'
    +'.alz-pcc .p-foot p{font-size:10.5px;line-height:1.6;color:var(--muted);margin:10px 0 7px;text-align:center}'
    +'.alz-pcc .p-foot-b{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--cr);text-align:center}'
    +'@media print{body{background:#fff!important}'
    +'.no-print,.strip,#alizonBackBar,#azsitehdr{display:none!important}'
    +'.alz-pcc{max-width:none}'
    +'.alz-pcc .p-tblwrap,.alz-pcc .p-sign{break-inside:avoid}}';

  function injectCss(doc){
    doc=doc||document;
    if(doc.getElementById('alzPccCss')) return;
    var st=doc.createElement('style'); st.id='alzPccCss'; st.textContent=CSS;
    doc.head.appendChild(st);
  }
  function render(el, o){
    if(!el) return false;
    var h=html(o);
    if(!h){ el.innerHTML='<div style="padding:24px;text-align:center;color:#6e6a63">Choose a candidate to draft the letter.</div>'; return false; }
    injectCss(); el.innerHTML=h; return true;
  }
  function print_(){
    var doc=document.getElementById('alzPccDoc');
    if(window.LHPrint && doc){
      try{ LHPrint(doc,{ headerEnd:'.p-affil', footer:'.p-foot', flatten:['.p-body'] }); return true; }catch(e){}
    }
    try{ window.print(); }catch(e){}
    return true;
  }
  function open_(o){
    var h=html(o); if(!h) return false;
    var w=window.open('','_blank'); if(!w) return false;
    var rec=(typeof o==='string'?(get(o)||{}):o)||{};
    w.document.write('<!doctype html><html><head><meta charset="utf-8">'
      +'<title>Police Clearance Certificate letter — '+esc(rec.name||'')+'</title>'
      +'<link rel="preconnect" href="https://fonts.googleapis.com">'
      +'<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet">'
      +'<style>body{margin:0;padding:26px 20px;background:#f4f1ee}'+CSS
      +'.p-print{max-width:820px;margin:0 auto 14px;text-align:right}'
      +'.p-print button{cursor:pointer;font:inherit;font-size:13px;font-weight:600;border-radius:100px;'
      +'padding:9px 20px;color:#fff;background:#8c1515;border:1px solid #8c1515}'
      +'@media print{body{padding:0;background:#fff}.p-print{display:none}}</style></head><body>'
      +'<div class="p-print"><button onclick="window.print()">Download / Print PDF</button></div>'
      +h+'</body></html>');
    w.document.close();
    return true;
  }

  window.AlizonPCC = {
    KINDS:KINDS, SCOPES:SCOPES, blank:blank, fromRoster:fromRoster,
    issue:issue, list:list, get:get, remove:remove,
    html:html, render:render, open:open_, print:print_, css:CSS
  };
})();
