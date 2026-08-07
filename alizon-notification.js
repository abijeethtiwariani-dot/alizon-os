/* =====================================================================
   ALIZON — admission / allotment notification

   A sectioned official notification on the institution letterhead: numbered
   sections, particulars and fee tables, lettered eligibility lists, an
   important-dates table and a contact block. Built for the Batch 8 admission
   notice but general enough for any future one — a notification is just an
   ordered list of sections, each of which is paragraphs, a lettered list or
   a two-column table.

   Storage: localStorage "alizonNotifications" (registered in firebase-sync)
     { items: [ {id, ...notification} ], }

   Public API: window.AlizonNotification = {
     BATCH8, blank, list, get, published, save, remove, publish,
     render, html, open, print
   }
   ===================================================================== */
(function () {
  'use strict';
  if (window.AlizonNotification) return;

  var KEY = 'alizonNotifications';

  function J(k, d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function nlToP(s){
    return String(s==null?'':s).split(/\n{2,}/).map(function(p){ return p.trim(); }).filter(Boolean)
      .map(function(p){ return '<p class="n-p">'+esc(p).replace(/\n/g,'<br>')+'</p>'; }).join('');
  }
  function store(){
    var o=J(KEY,{items:[]});
    if(!o||typeof o!=='object'||Array.isArray(o)) o={items:[]};
    if(!Array.isArray(o.items)) o.items=[];
    return o;
  }
  function save_(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); return true; }catch(e){ return false; } }
  var LETTERS='abcdefghijklmnopqrstuvwxyz';

  /* ---- the Batch 8 notification, as supplied by the institution ---- */
  var BATCH8 = {
    id:'aidp-batch8-2026',
    ref:'ALZ/ADM/2026-27/08',
    year:'2026–2027',
    batch:'Batch 8',
    course:'Certificate Course in Digital Health & Artificial Intelligence for Pharmacy',
    title:'Admission Notification',
    date:'2026-08-07',
    published:true,
    lede:'Applications are invited from eligible candidates for admission to the '
        +'Certificate Course in Digital Health & Artificial Intelligence for Pharmacy '
        +'for the Academic Year 2026–2027.',
    sections:[
      { t:'About the Programme', k:'text', body:
        'The programme is designed to equip pharmacy professionals with advanced knowledge and practical '
       +'skills in digital healthcare and artificial intelligence. The curriculum covers AI-assisted drug '
       +'discovery, digital therapeutics, precision medicine, clinical decision support systems, healthcare '
       +'automation, and emerging digital pharmacy technologies, preparing learners for modern, '
       +'technology-driven healthcare practice.\n\n'
       +'The programme is offered in academic collaboration with Alphabet Healthcare Technology (USA), '
       +'NTH Academy, CVS Health, and DoctorSmart Healthcare.' },

      { t:'Course Particulars', k:'table', head:['Particular','Details'], rows:[
        ['Course Duration','350 Hours'],
        ['Mode of Delivery','Online'],
        ['Accrediting Authority','ASAP Kerala, Higher Education Department, Government of Kerala'],
        ['Accreditation Validity','Valid up to 20 April 2028'],
        ['Course Category','Skill Development Programme'],
        ['Total Intake','40 Seats'],
        ['Scholarship Seats','28 Seats']
      ]},

      { t:'Eligibility', k:'list',
        intro:'Applications are invited from candidates possessing any one of the following qualifications:',
        items:[
          'Diploma in Pharmacy (D.Pharm)',
          'Bachelor of Pharmacy (B.Pharm)',
          'Doctor of Pharmacy (Pharm.D)',
          'Master of Pharmacy (M.Pharm)',
          'Registered Pharmacists',
          'Pharmacy Interns and Final-Year / Final-Semester Pharmacy Students'
        ],
        note:'Students studying from the 5th Semester onwards are also eligible to apply.' },

      { t:'Fee Structure', k:'table', head:['Particular','Amount'], rows:[
        ['Approved Course Fee','₹20,000/-'],
        ['Scholarship Fee','₹7,500/-'],
        ['GST @ 18%','₹1,350/-'],
        ['Total Payable Amount','₹8,850/-']
      ], total:true,
        note:'Scholarship concession of up to 62.5% is available on the approved course fee for eligible candidates.' },

      { t:'Scholarship Benefits', k:'list', items:[
        'Scholarship concession of up to 62.5% on the approved course fee.',
        'Reservation benefits, wherever applicable, as per institutional norms.',
        'Placement opportunities for top-performing candidates, subject to partner and employer requirements.'
      ]},

      { t:'Selection Process', k:'text', body:
        'Selection to the 28 scholarship seats shall be based on the performance of candidates in the '
       +'Scholarship Screening Examination conducted by the institution.\n\n'
       +'Details regarding the examination schedule, mode of examination, and further instructions will be '
       +'communicated to registered applicants.' },

      { t:'Important Dates', k:'table', head:['Event','Date'], rows:[
        ['Commencement of Applications','07 August 2026'],
        ['Last Date for Submission of Applications','27 August 2026'],
        ['Scholarship Screening Examination','28 August 2026'],
        ['Publication of Results','29 August 2026'],
        ['Commencement of Classes','01 September 2026']
      ]},

      { t:'How to Apply', k:'list',
        intro:'Applications may be submitted through the official website www.alizongov.com or by contacting '
             +'the Admission Helpline.\n\nDocuments to be submitted:',
        items:[
          'Qualifying Degree Certificate and / or Mark Sheets',
          'Proof of Current Enrolment (for students presently pursuing the course)',
          'Pharmacy Council Registration Certificate (where applicable)',
          'Valid Government-issued Photo Identity Proof',
          'Recent Passport-size Photograph'
        ]}
    ],
    contact:{
      name:'ALIZON School of Medical & Digital Intelligence',
      address:'Building No. 398B & C, Near Tharangini, Peringammala, Kerala – 695042',
      phone:'+91 81118 66752',
      email:'admissions@alizongov.com',
      web:'www.alizongov.com'
    },
    signatory:'Dr Abijeeth Tiwari',
    designation:'Director',
    place:'Thiruvananthapuram'
  };

  function blank(){
    return { id:'', ref:'', year:'', batch:'', course:'', title:'Admission Notification',
             date:'', published:false, lede:'', sections:[],
             contact:JSON.parse(JSON.stringify(BATCH8.contact)),
             signatory:BATCH8.signatory, designation:BATCH8.designation, place:BATCH8.place };
  }

  /* ---- storage ---- */
  function list(){ return store().items.slice(); }
  function get(id){
    var it=store().items;
    for(var i=0;i<it.length;i++){ if(it[i].id===id) return it[i]; }
    return null;
  }
  function published(){ return store().items.filter(function(n){ return n.published; }); }
  function save(n){
    if(!n||!n.id) return false;
    var s=store(), i=-1;
    s.items.forEach(function(x,ix){ if(x.id===n.id) i=ix; });
    if(i<0) s.items.push(n); else s.items[i]=n;
    return save_(s);
  }
  function remove(id){
    var s=store();
    s.items=s.items.filter(function(x){ return x.id!==id; });
    return save_(s);
  }
  function publish(id,on){
    var n=get(id); if(!n) return false;
    n.published=!!on; return save(n);
  }
  /* seed the supplied Batch 8 notice if nothing has been created yet */
  function seed(){
    if(get(BATCH8.id)) return get(BATCH8.id);
    save(JSON.parse(JSON.stringify(BATCH8)));
    return get(BATCH8.id);
  }

  function longDate(v){
    if(!v) return '';
    var d=new Date(v+(String(v).length===10?'T00:00:00':''));
    if(isNaN(d.getTime())) return String(v);
    var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
    return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();
  }

  /* the ASAP mark, shared with the experience letter so one upload serves both */
  function asapMark(){
    var logo='';
    try{ if(window.AlizonExperience) logo=window.AlizonExperience.settings().asapLogo||''; }catch(e){}
    if(logo) return '<img class="n-asap-img" src="'+esc(logo)+'" alt="ASAP Kerala">';
    return '<div class="n-asap-txt"><b>ASAP</b><span>KERALA</span></div>';
  }

  function html(n){
    if(typeof n==='string') n=get(n);
    if(!n) return '';
    var c=n.contact||{};
    var h='<article class="alz-note" id="alzNoteDoc">';

    h+='<header class="n-lh">'
      +'<img class="n-lh-logo" src="/alizon-logo.png" alt="Alizon crest" onerror="this.style.display=\'none\'">'
      +'<div class="n-lh-txt">'
        +'<div class="n-lh-name">Alizon School of Medical &amp; Digital Intelligence</div>'
        +'<div class="n-lh-tag">Advancing Artificial Intelligence in Healthcare Education</div>'
        +'<div class="n-lh-addr">Thiruvananthapuram, Kerala, India&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</div>'
      +'<div class="n-lh-asap">'+asapMark()+'</div>'
      +'</header>'
      +'<div class="n-affil">An initiative under <b>ASAP Kerala</b> — Additional Skill Acquisition Programme, '
      +'Department of Higher Education, Government of Kerala&nbsp; ·&nbsp; Registered with <b>Kerala Startup Mission</b></div>';

    h+='<div class="n-body">';
    h+='<div class="n-top">'
      +'<span>'+(n.ref?'Ref: <b>'+esc(n.ref)+'</b>':'')+'</span>'
      +'<span>'+(n.date?'Date: <b>'+longDate(n.date)+'</b>':'')+'</span></div>';

    h+='<div class="n-head">'
      +'<h2 class="n-title">'+esc(n.title||'Admission Notification')+'</h2>'
      +(n.year?'<div class="n-year">Academic Year '+esc(n.year)+'</div>':'')
      +'<div class="n-rule"></div>'
      +(n.course?'<div class="n-course">'+esc(n.course)+(n.batch?'&nbsp; ·&nbsp; '+esc(n.batch):'')+'</div>':'')
      +'</div>';

    if(n.lede) h+='<div class="n-lede">'+nlToP(n.lede)+'</div>';

    (n.sections||[]).forEach(function(s,i){
      h+='<section class="n-sec">';
      h+='<h3 class="n-sh"><span class="n-no">'+(i+1)+'</span>'+esc(s.t||'')+'</h3>';
      if(s.k==='text'){
        h+=nlToP(s.body);
      } else if(s.k==='list'){
        if(s.intro) h+=nlToP(s.intro);
        h+='<ol class="n-list">'+(s.items||[]).map(function(x,ix){
          return '<li><span class="n-al">'+(LETTERS[ix]||(ix+1))+')</span><span>'+esc(x)+'</span></li>';
        }).join('')+'</ol>';
        if(s.note) h+='<div class="n-note">'+esc(s.note)+'</div>';
      } else if(s.k==='table'){
        var rows=s.rows||[];
        h+='<div class="n-tblwrap"><table class="n-tbl"><thead><tr>'
          +(s.head||['Particular','Details']).map(function(x){ return '<th>'+esc(x)+'</th>'; }).join('')
          +'</tr></thead><tbody>'
          +rows.map(function(r,ix){
              var last=s.total && ix===rows.length-1;
              return '<tr'+(last?' class="n-tot"':'')+'><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>';
            }).join('')
          +'</tbody></table></div>';
        if(s.note) h+='<div class="n-note">'+esc(s.note)+'</div>';
      }
      h+='</section>';
    });

    /* contact block, always last and numbered with the rest */
    var cn=(n.sections||[]).length+1;
    h+='<section class="n-sec"><h3 class="n-sh"><span class="n-no">'+cn+'</span>Contact Details</h3>'
      +'<div class="n-contact">'
        +(c.name?'<div class="n-cn">'+esc(c.name)+'</div>':'')
        +(c.address?'<div>'+esc(c.address)+'</div>':'')
        +(c.phone?'<div><b>Admission Helpline:</b> '+esc(c.phone)+'</div>':'')
        +(c.email?'<div><b>Email:</b> '+esc(c.email)+'</div>':'')
        +(c.web?'<div><b>Website:</b> '+esc(c.web)+'</div>':'')
      +'</div></section>';

    h+='<div class="n-sign">'
      +'<div class="n-sign-l">'
        +(n.place?'<div class="n-kv">Place: <b>'+esc(n.place)+'</b></div>':'')
        +(n.date?'<div class="n-kv">Date: <b>'+longDate(n.date)+'</b></div>':'')
        +'<div class="n-seal">(Institution seal)</div></div>'
      +'<div class="n-sign-r"><div class="n-sig-line"></div>'
        +'<div class="n-sig-n">'+esc(n.signatory||'')+'</div>'
        +'<div class="n-sig-d">'+esc(n.designation||'')+'</div>'
        +'<div class="n-sig-i">Alizon School of Medical &amp; Digital Intelligence</div></div>'
      +'</div>';

    h+='</div>';
    h+='<footer class="n-foot"><div class="n-foot-rule"></div>'
      +'<p>This notification is issued by the Office of Admissions, Alizon School of Medical &amp; Digital '
      +'Intelligence. Candidates are advised to read all conditions carefully before applying.</p>'
      +'<div class="n-foot-b">Alizon School of Medical &amp; Digital Intelligence&nbsp; ·&nbsp; Thiruvananthapuram, Kerala&nbsp; ·&nbsp; www.alizon.in</div>'
      +'</footer>';
    h+='</article>';
    return h;
  }

  var CSS =
     '.alz-note{--cr:#8c1515;--cr2:#6b0f0f;--gold:#9a7b3f;--ink:#26221f;--muted:#6e6a63;'
    +'max-width:820px;margin:0 auto;background:#fff;color:var(--ink);'
    +'font-family:"Source Sans 3","Source Sans Pro",-apple-system,Helvetica,Arial,sans-serif}'
    +'.alz-note .n-lh{display:flex;align-items:center;gap:16px;padding-bottom:14px;border-bottom:2.5px solid var(--cr)}'
    +'.alz-note .n-lh-logo{width:62px;height:62px;object-fit:contain;flex:none}'
    +'.alz-note .n-lh-txt{flex:1;min-width:0}'
    +'.alz-note .n-lh-name{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(17px,2.4vw,23px);font-weight:700;color:var(--cr);line-height:1.15}'
    +'.alz-note .n-lh-tag{font-size:12px;font-style:italic;color:var(--muted);margin-top:3px}'
    +'.alz-note .n-lh-addr{font-size:11px;letter-spacing:.04em;color:#8a827b;margin-top:4px;font-weight:600}'
    +'.alz-note .n-lh-asap{flex:none;display:grid;place-items:center;min-width:70px}'
    +'.alz-note .n-asap-img{max-width:82px;max-height:62px;object-fit:contain}'
    +'.alz-note .n-asap-txt{text-align:center;border:1.5px solid var(--gold);border-radius:8px;padding:6px 10px;line-height:1}'
    +'.alz-note .n-asap-txt b{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:19px;font-weight:700;color:var(--cr);letter-spacing:.04em}'
    +'.alz-note .n-asap-txt span{display:block;font-size:8.5px;font-weight:700;letter-spacing:.19em;color:var(--gold);margin-top:3px}'
    +'.alz-note .n-affil{font-size:10.5px;line-height:1.5;color:#5f5a54;background:linear-gradient(90deg,rgba(154,123,63,.1),rgba(154,123,63,.02));'
    +'border-left:3px solid var(--gold);padding:6px 12px;margin-top:9px;border-radius:0 6px 6px 0}'
    +'.alz-note .n-affil b{color:var(--cr2)}'
    +'.alz-note .n-body{padding-top:16px}'
    +'.alz-note .n-top{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted)}'
    +'.alz-note .n-top b{color:var(--ink)}'
    +'.alz-note .n-head{text-align:center;margin-top:12px}'
    +'.alz-note .n-title{font-family:"Source Serif Pro",Georgia,serif;font-size:clamp(19px,3vw,26px);font-weight:700;'
    +'color:var(--cr);margin:0;letter-spacing:.02em;text-transform:uppercase}'
    +'.alz-note .n-year{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-top:7px}'
    +'.alz-note .n-rule{width:120px;height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));margin:11px auto;border-radius:2px}'
    +'.alz-note .n-course{font-family:"Source Serif Pro",Georgia,serif;font-size:15.5px;font-weight:600;color:var(--ink);line-height:1.4}'
    +'.alz-note .n-lede{margin-top:18px;background:#faf8f6;border-left:3px solid var(--cr);border-radius:0 8px 8px 0;padding:12px 16px}'
    +'.alz-note .n-lede .n-p{margin:0}'
    +'.alz-note .n-p{font-size:13.8px;line-height:1.8;margin:0 0 11px;text-align:justify}'
    +'.alz-note .n-sec{margin-top:22px}'
    +'.alz-note .n-sh{display:flex;align-items:center;gap:10px;font-family:"Source Serif Pro",Georgia,serif;'
    +'font-size:15.5px;font-weight:700;color:var(--cr);margin:0 0 10px;padding-bottom:7px;'
    +'border-bottom:1px solid rgba(140,21,21,.2);text-transform:uppercase;letter-spacing:.03em}'
    +'.alz-note .n-no{flex:none;width:23px;height:23px;border-radius:50%;background:var(--cr);color:#fff;'
    +'display:grid;place-items:center;font-family:inherit;font-size:12px;font-weight:700}'
    +'.alz-note .n-list{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}'
    +'.alz-note .n-list li{display:flex;gap:9px;font-size:13.5px;line-height:1.65}'
    +'.alz-note .n-al{flex:none;font-weight:700;color:var(--cr);min-width:19px}'
    +'.alz-note .n-note{margin-top:11px;font-size:13px;line-height:1.7;color:var(--ink);'
    +'background:#faf8f6;border-left:3px solid var(--gold);border-radius:0 7px 7px 0;padding:9px 13px}'
    +'.alz-note .n-tblwrap{overflow-x:auto;border:1px solid rgba(0,0,0,.12);border-radius:9px;margin-top:6px}'
    +'.alz-note .n-tbl{border-collapse:collapse;width:100%;min-width:420px;font-size:13px}'
    +'.alz-note .n-tbl th{background:var(--cr);color:#fff;font-weight:600;padding:9px 12px;text-align:left;'
    +'border:1px solid rgba(255,255,255,.18);font-size:11.5px;letter-spacing:.03em;text-transform:uppercase}'
    +'.alz-note .n-tbl td{padding:9px 12px;border:1px solid rgba(0,0,0,.08);line-height:1.55}'
    +'.alz-note .n-tbl td:last-child{font-weight:600;white-space:nowrap}'
    +'.alz-note .n-tbl tbody tr:nth-child(even){background:#faf8f6}'
    +'.alz-note .n-tbl tr.n-tot td{background:var(--cr);color:#fff;font-weight:700;border-color:rgba(255,255,255,.18)}'
    +'.alz-note .n-contact{font-size:13.5px;line-height:1.85}'
    +'.alz-note .n-cn{font-weight:700;color:var(--cr);font-size:14.5px;margin-bottom:2px}'
    +'.alz-note .n-sign{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-top:32px}'
    +'.alz-note .n-kv{font-size:12.5px;margin-bottom:5px}'
    +'.alz-note .n-seal{margin-top:20px;width:104px;height:104px;border:1.5px dashed rgba(140,21,21,.35);border-radius:50%;'
    +'display:grid;place-items:center;font-size:10px;color:#a8a099;text-align:center;padding:8px}'
    +'.alz-note .n-sign-r{text-align:center;align-self:flex-end;min-width:230px}'
    +'.alz-note .n-sig-line{border-top:1.5px solid var(--ink);margin-bottom:7px;height:56px}'
    +'.alz-note .n-sig-n{font-weight:700;font-size:13.5px}'
    +'.alz-note .n-sig-d{font-size:12px;color:var(--muted)}'
    +'.alz-note .n-sig-i{font-size:11px;color:var(--muted);margin-top:2px}'
    +'.alz-note .n-foot{margin-top:26px}'
    +'.alz-note .n-foot-rule{height:2px;background:linear-gradient(90deg,var(--cr),var(--gold));border-radius:2px}'
    +'.alz-note .n-foot p{font-size:10.5px;line-height:1.6;color:var(--muted);margin:10px 0 7px;text-align:center}'
    +'.alz-note .n-foot-b{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--cr);text-align:center}'
    +'@media print{body{background:#fff!important}'
    +'.no-print,.nav,.strip,#alizonBackBar,#azsitehdr{display:none!important}'
    +'.alz-note{max-width:none}'
    +'.alz-note .n-sec,.alz-note .n-tblwrap,.alz-note .n-sign,.alz-note .n-tbl tr{break-inside:avoid}'
    +'.alz-note .n-sh{break-after:avoid}}';

  function injectCss(doc){
    doc=doc||document;
    if(doc.getElementById('alzNoteCss')) return;
    var st=doc.createElement('style'); st.id='alzNoteCss'; st.textContent=CSS;
    doc.head.appendChild(st);
  }
  function render(el, n){
    if(!el) return false;
    var h=html(n);
    if(!h){ el.innerHTML='<div style="padding:24px;text-align:center;color:#6e6a63">No notification published yet.</div>'; return false; }
    injectCss(); el.innerHTML=h; return true;
  }
  /* multi-page A4 with a repeating letterhead and "Page X of Y" when the
     shared paginator is on the page, otherwise a plain print */
  function print_(){
    var doc=document.getElementById('alzNoteDoc');
    if(window.LHPrint && doc){
      try{ LHPrint(doc,{ headerEnd:'.n-affil', footer:'.n-foot',
        flatten:['.n-body'] }); return true; }catch(e){}
    }
    try{ window.print(); }catch(e){}
    return true;
  }
  function open_(n){
    var h=html(n); if(!h) return false;
    var w=window.open('','_blank'); if(!w) return false;
    var title=(typeof n==='string'?(get(n)||{}):n)||{};
    w.document.write('<!doctype html><html><head><meta charset="utf-8">'
      +'<title>'+esc((title.title||'Admission Notification')+' — '+(title.batch||''))+'</title>'
      +'<link rel="preconnect" href="https://fonts.googleapis.com">'
      +'<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet">'
      +'<style>body{margin:0;padding:26px 20px;background:#f4f1ee}'+CSS
      +'.n-print{max-width:820px;margin:0 auto 14px;text-align:right}'
      +'.n-print button{cursor:pointer;font:inherit;font-size:13px;font-weight:600;border-radius:100px;'
      +'padding:9px 20px;color:#fff;background:#8c1515;border:1px solid #8c1515}'
      +'@media print{body{padding:0;background:#fff}.n-print{display:none}}</style></head><body>'
      +'<div class="n-print"><button onclick="window.print()">Download / Print PDF</button></div>'
      +h+'</body></html>');
    w.document.close();
    return true;
  }

  window.AlizonNotification = {
    BATCH8:BATCH8, blank:blank, seed:seed,
    list:list, get:get, published:published, save:save, remove:remove, publish:publish,
    html:html, render:render, open:open_, print:print_, css:CSS
  };
})();
