/* =====================================================================
   alizon-certificate.js — completion certificates, issued by the site.

   The signatory library, the signature images, the seal and the image
   downscaler already exist in alizon-experience.js and are NOT rebuilt
   here. This module adds what a certificate needs on top: an editable
   template (title, wording, credit hours, logos), the artwork itself,
   and issue / verify / revoke.

   STORAGE. Each certificate is its own Firestore document, `cert_<code>`,
   never an entry in one shared array. Two reasons, both learned the hard
   way on this platform: a single synced document has a 1 MB ceiling (see
   alizonSubmissions, which reached it), and a shared array is a
   read-modify-write, so two people finishing a public workshop in the
   same few seconds would overwrite each other. Verification is then a
   single document read by code, which stays fast however many are issued.

   NUMBERING. A short random code rather than a running serial, for the
   same concurrency reason — a sequential counter needs a lock this
   platform has no way to take. The code carries the year and the
   programme so it is still readable: ALZ/2026/PVX/7K3M9Q.

   Public API:
     AlizonCertificate.template() / saveTemplate(o)
     AlizonCertificate.issue({name, reg, phone, institution, course,
                              score, band, programme, hours})   -> Promise<rec>
     AlizonCertificate.verify(code)                             -> Promise<rec|null>
     AlizonCertificate.list()                                   -> Promise<[rec]>
     AlizonCertificate.revoke(code, reason)                     -> Promise<bool>
     AlizonCertificate.html(rec)      the certificate as printable HTML
     AlizonCertificate.open(rec)      preview / print window
     AlizonCertificate.designer(el)   drop-in admin editor
   ===================================================================== */
(function(){
'use strict';
if (window.AlizonCertificate) return;

var TKEY = 'alizonCertTemplate';     /* the design — small, one synced doc */
var PFX  = 'cert_';                  /* one Firestore doc per certificate  */

function J(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function longDate(ms){
  var d=new Date(ms||Date.now());
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();
}

/* ---------- the editable template ---------- */
var DEFAULTS = {
  enabled:true,
  passMark:50,
  eyebrow:'Alizon School of Medical &amp; Digital Intelligence',
  title:'Certificate of Completion',
  lead:'This is to certify that',
  midline:'has successfully completed',
  tail:'an assessed practical workshop delivered online and marked automatically against a published rubric.',
  showScore:true, showHours:true, showPartner:true,
  hours:8,
  place:'Thiruvananthapuram, Kerala',
  accent:'#8c1515',
  /* logos are administrator-managed; each is a downscaled PNG data URL */
  logos:[],
  verifyUrl:'https://www.alizon.in/alizon-verify',
  note:'Issued electronically by the Alizon School of Medical &amp; Digital Intelligence. '
      +'Its validity can be confirmed at the address above using the certificate code.'
};
function template(){
  var o=J(TKEY,null);
  if(!o || typeof o!=='object' || Array.isArray(o)) o={};
  var out={};
  Object.keys(DEFAULTS).forEach(function(k){ out[k] = (o[k]===undefined?DEFAULTS[k]:o[k]); });
  if(!Array.isArray(out.logos)) out.logos=[];
  return out;
}
function saveTemplate(o){
  try{ localStorage.setItem(TKEY, JSON.stringify(o||{})); return true; }catch(e){ return false; }
}

/* The public workshop deliberately does not load firebase-sync, because that
   would pull the student roster and the rest of the institution's data onto a
   stranger's device. But a participant's certificate still has to carry the
   wording and logos the administrator set. So this fetches exactly one
   document — the template — and caches it. Nothing else is read. */
function refresh(){
  return ready().then(function(){
    var d=db(); if(!d) return template();
    return d.collection('sync').doc(TKEY).get().then(function(doc){
      if(doc.exists){
        var v=doc.data().value;
        if(typeof v==='string' && v) { try{ localStorage.setItem(TKEY, v); }catch(e){} }
      }
      return template();
    });
  }).catch(function(){ return template(); });
}

/* ---------- firebase, write-and-read only for certificates ---------- */
var SDK='https://www.gstatic.com/firebasejs/10.12.5/';
var CFG={ apiKey:"AIzaSyBH3mnYAwaFHJ_jo0mQ0Ohw4WxyYdZBe90", authDomain:"alizon-os-7a17d.firebaseapp.com",
  projectId:"alizon-os-7a17d", storageBucket:"alizon-os-7a17d.firebasestorage.app",
  messagingSenderId:"728863144429", appId:"1:728863144429:web:8939b7d234754cb0534fe4" };
var BOOT_EMAIL='device-reader@bootstrap.alizonos.app', BOOT_PW='alizonBootstrap2026';
function loadScript(f){ return new Promise(function(res,rej){
  var s=document.createElement('script'); s.src=SDK+f; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
var readyP=null;
function ready(){
  if(readyP) return readyP;
  if(window.firebase && firebase.apps && firebase.apps.length && firebase.auth().currentUser){
    readyP=Promise.resolve(); return readyP;      /* a page with firebase-sync already signed in */
  }
  readyP = (window.firebase ? Promise.resolve() :
      loadScript('firebase-app-compat.js').then(function(){
        return Promise.all([loadScript('firebase-auth-compat.js'), loadScript('firebase-firestore-compat.js')]); }))
    .then(function(){
      if(!firebase.apps.length) firebase.initializeApp(CFG);
      if(firebase.auth().currentUser) return;
      return firebase.auth().signInWithEmailAndPassword(BOOT_EMAIL,BOOT_PW).catch(function(){});
    });
  return readyP;
}
function db(){ try{ return firebase.firestore(); }catch(e){ return null; } }

/* ---------- codes ---------- */
var ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* no I/O/0/1 — these get read aloud and written down */
function randomCode(n){
  var out='', i, r;
  var buf=(window.crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint32Array(n)):null;
  for(i=0;i<n;i++){ r = buf?buf[i]:Math.floor(Math.random()*4294967296); out+=ALPHABET[r%ALPHABET.length]; }
  return out;
}
function makeCode(programme){
  var p=String(programme||'GEN').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4)||'GEN';
  return 'ALZ/'+new Date().getFullYear()+'/'+p+'/'+randomCode(6);
}
function docId(code){ return PFX + String(code).replace(/[^A-Za-z0-9]/g,''); }

/* ---------- issue / verify / revoke ---------- */
function issue(d){
  d=d||{};
  var t=template();
  if(!t.enabled) return Promise.resolve(null);
  var rec={
    code: d.code || makeCode(d.programme),
    name: String(d.name||'').trim(),
    reg: String(d.reg||'').trim(),
    institution: String(d.institution||'').trim(),
    course: String(d.course||'').trim(),
    programme: String(d.programme||'').trim(),
    score: (d.score==null?null:Number(d.score)),
    band: String(d.band||'').trim(),
    hours: (d.hours==null? t.hours : Number(d.hours)),
    issued: Date.now(),
    revoked: false
  };
  if(!rec.name) return Promise.resolve(null);
  return ready().then(function(){
    var d2=db();
    if(!d2 || !firebase.auth().currentUser) return rec;    /* offline: the holder still gets their copy */
    return d2.collection('sync').doc(docId(rec.code)).set({
      cert:1, code:rec.code, name:rec.name, reg:rec.reg, course:rec.course,
      programme:rec.programme, score:rec.score, band:rec.band, hours:rec.hours,
      institution:rec.institution, issued:rec.issued, revoked:false,
      value: JSON.stringify(rec)
    }).then(function(){ rec.cloud=true; return rec; })
      .catch(function(){ return rec; });
  }).catch(function(){ return rec; });
}
/* Resolves to the record, or null when the code genuinely does not exist, or
   {unreachable:true} when we could not check. Those last two must never be
   conflated: telling someone a real certificate was "not found" because the
   network was down is a false accusation against the holder. */
function verify(code){
  var c=String(code||'').trim().toUpperCase();
  if(!c) return Promise.resolve(null);
  return ready().then(function(){
    var d=db();
    if(!d || !firebase.auth().currentUser) return { unreachable:true };
    return d.collection('sync').doc(docId(c)).get().then(function(doc){
      if(!doc.exists) return null;                 /* checked, and there is nothing */
      var x=doc.data()||{}, rec={};
      try{ rec=JSON.parse(x.value||'{}'); }catch(e){ rec=x; }
      rec.revoked = !!x.revoked; rec.revokeReason = x.revokeReason||'';
      return rec;
    }).catch(function(){ return { unreachable:true }; });
  }).catch(function(){ return { unreachable:true }; });
}
function list(){
  return ready().then(function(){
    var d=db(); if(!d) return [];
    return d.collection('sync').where('cert','==',1).get().then(function(qs){
      var out=[];
      qs.forEach(function(doc){
        var x=doc.data()||{}, r={};
        try{ r=JSON.parse(x.value||'{}'); }catch(e){ r=x; }
        r.revoked=!!x.revoked; r.revokeReason=x.revokeReason||'';
        out.push(r);
      });
      out.sort(function(a,b){ return (b.issued||0)-(a.issued||0); });
      return out;
    });
  }).catch(function(){ return []; });
}
function revoke(code, reason){
  return ready().then(function(){
    var d=db(); if(!d) return false;
    return d.collection('sync').doc(docId(code))
      .set({ revoked:true, revokeReason:String(reason||'') }, {merge:true})
      .then(function(){ return true; }).catch(function(){ return false; });
  }).catch(function(){ return false; });
}

/* ---------- signatories and seal ----------
   On an administrator's machine these come live from alizon-experience.js,
   which owns the shared signatory library.

   They CANNOT be read that way on the public workshop. The `alizonExperience`
   key holds the settings AND every issued experience letter, keyed by student
   registration number — names, practicals and marks. Fetching it onto a
   stranger's device to find out who signs a certificate would hand over the
   student records with it.

   So the designer snapshots just what printing needs — the signatory's name,
   designation and signature image, the seal, and whether signatures are
   printed — into the certificate template. The public page reads that one
   document and nothing else. */
function signBits(){
  var t=template();
  if(t.signSnapshot && t.signSnapshot.signers) return t.signSnapshot;
  var X=window.AlizonExperience;
  if(!X) return { signers:[], seal:'', sealMode:'off', mode:'wet' };
  return liveSignBits();
}
function liveSignBits(){
  var X=window.AlizonExperience;
  if(!X) return { signers:[], seal:'', sealMode:'off', mode:'wet' };
  var st=X.settings(), chosen=null;
  try{ chosen = X.signerFor ? X.signerFor('certificate') : null; }catch(e){}
  var all=[];
  if(chosen) all.push({ name:chosen.name||'', designation:chosen.designation||'', image:chosen.image||'' });
  return { signers:all, seal:st.sealImage||'', sealMode:(X.sealMode?X.sealMode():(st.sealImage?'image':'off')),
           mode:st.signMode||'wet' };
}

/* ---------- the certificate ---------- */
var CSS =
  '@page{size:A4 landscape;margin:0}'
 +'.alz-cert{width:297mm;height:210mm;box-sizing:border-box;padding:13mm;background:#fff;color:#2e2d29;'
 +'font-family:Inter,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;position:relative;margin:0 auto;'
 +'display:flex;flex-direction:column}'
 +'.alz-cert *{box-sizing:border-box}'
 +'.alz-cert .frame{border:2px solid var(--ac);flex:1;display:flex;flex-direction:column;padding:9mm 12mm 7mm;position:relative}'
 +'.alz-cert .frame:before{content:"";position:absolute;inset:3.2mm;border:0.5pt solid var(--ac);opacity:.42;pointer-events:none}'
 +'.alz-cert .logos{display:flex;gap:16px;align-items:center;justify-content:center;min-height:17mm;flex-wrap:wrap}'
 +'.alz-cert .logos img{max-height:17mm;max-width:44mm;object-fit:contain;display:block}'
 +'.alz-cert .eyebrow{text-align:center;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#6e6a63;margin-top:4mm}'
 +'.alz-cert h1{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:34px;font-weight:700;'
 +'color:var(--ac);margin:2mm 0 0;letter-spacing:.01em}'
 +'.alz-cert .rule{width:46mm;height:2px;background:var(--ac);margin:3mm auto 0;opacity:.85}'
 +'.alz-cert .lead{text-align:center;font-size:12.5px;color:#6e6a63;margin-top:5mm}'
 +'.alz-cert .who{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:31px;font-weight:700;'
 +'margin-top:2mm;line-height:1.15;padding-bottom:2mm;border-bottom:1px solid #ded7d0;display:inline-block;'
 +'min-width:120mm;max-width:100%}'
 +'.alz-cert .whowrap{text-align:center}'
 +'.alz-cert .sub{text-align:center;font-size:11.5px;color:#6e6a63;margin-top:2mm}'
 +'.alz-cert .mid{text-align:center;font-size:12.5px;color:#6e6a63;margin-top:4mm}'
 +'.alz-cert .course{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:19px;font-weight:600;'
 +'margin-top:1.5mm;line-height:1.3}'
 +'.alz-cert .tail{text-align:center;font-size:11px;color:#6e6a63;margin-top:3mm;max-width:190mm;'
 +'margin-left:auto;margin-right:auto;line-height:1.6}'
 +'.alz-cert .stats{display:flex;justify-content:center;gap:9mm;margin-top:5mm;flex-wrap:wrap}'
 +'.alz-cert .stat{text-align:center;min-width:26mm}'
 +'.alz-cert .stat b{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:17px;color:var(--ac)}'
 +'.alz-cert .stat span{font-size:8.6px;letter-spacing:.09em;text-transform:uppercase;color:#8a827b}'
 +'.alz-cert .foot{margin-top:auto;display:flex;align-items:flex-end;gap:10mm}'
 +'.alz-cert .sigs{flex:1;display:flex;gap:12mm;justify-content:center;align-items:flex-end}'
 +'.alz-cert .sig{text-align:center;min-width:56mm}'
 +'.alz-cert .sig .im{height:13mm;display:flex;align-items:flex-end;justify-content:center}'
 +'.alz-cert .sig .im img{max-height:13mm;max-width:52mm;object-fit:contain}'
 +'.alz-cert .sig .ln{border-top:1px solid #2e2d29;margin-top:1.5mm;padding-top:1.5mm}'
 +'.alz-cert .sig b{display:block;font-size:12px}'
 +'.alz-cert .sig span{font-size:10px;color:#6e6a63}'
 +'.alz-cert .seal{width:26mm;height:26mm;display:flex;align-items:center;justify-content:center;flex:none}'
 +'.alz-cert .seal img{max-width:26mm;max-height:26mm;object-fit:contain}'
 +'.alz-cert .seal .dash{width:24mm;height:24mm;border:1px dashed #b9b1a9;border-radius:50%;'
 +'display:flex;align-items:center;justify-content:center;font-size:7.5px;color:#b9b1a9;text-align:center;line-height:1.3}'
 +'.alz-cert .verify{margin-top:5mm;border-top:1px solid #ded7d0;padding-top:3mm;display:flex;'
 +'justify-content:space-between;gap:8mm;align-items:flex-start;font-size:9px;color:#8a827b;line-height:1.6}'
 +'.alz-cert .verify .code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;color:#2e2d29;'
 +'font-weight:600;letter-spacing:.04em}'
 +'.alz-cert .void{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
 +'font-family:"Source Serif Pro",Georgia,serif;font-size:86px;font-weight:700;color:rgba(177,4,14,.14);'
 +'transform:rotate(-22deg);letter-spacing:.1em;pointer-events:none}';

function html(rec, opts){
  rec=rec||{}; opts=opts||{};
  var t=template(), b=signBits();
  var logos=(t.logos||[]).filter(function(l){ return l && l.src; });
  var s=rec.score;
  var stats=[];
  if(t.showScore && s!=null && isFinite(s)) stats.push(['Result', Math.round(s)+' / 100'+(rec.band?' · '+rec.band:'')]);
  if(t.showHours && rec.hours) stats.push(['Credit', rec.hours+' hour'+(rec.hours==1?'':'s')]);
  stats.push(['Issued', longDate(rec.issued)]);

  var sig='';
  (b.signers||[]).forEach(function(p){
    sig += '<div class="sig"><div class="im">'
        + ((b.mode==='digital' && p.image) ? '<img src="'+esc(p.image)+'" alt="">' : '')
        + '</div><div class="ln"><b>'+esc(p.name||'')+'</b><span>'+esc(p.designation||'')+'</span></div></div>';
  });
  if(!sig) sig='<div class="sig"><div class="im"></div><div class="ln"><b>&nbsp;</b><span>For the School</span></div></div>';

  var seal='';
  if(b.sealMode==='image' && b.seal) seal='<div class="seal"><img src="'+esc(b.seal)+'" alt=""></div>';
  else if(b.sealMode==='space') seal='<div class="seal"><div class="dash">Seal</div></div>';
  else seal='<div class="seal" aria-hidden="true"></div>';

  return '<div class="alz-cert" style="--ac:'+esc(t.accent||'#8c1515')+'">'
    + (rec.revoked?'<div class="void">REVOKED</div>':'')
    + '<div class="frame">'
      + (logos.length? '<div class="logos">'+logos.map(function(l){
            return '<img src="'+esc(l.src)+'" alt="'+esc(l.alt||'')+'">'; }).join('')+'</div>' : '')
      + '<div class="eyebrow">'+t.eyebrow+'</div>'
      + '<h1>'+esc(t.title)+'</h1><div class="rule"></div>'
      + '<div class="lead">'+esc(t.lead)+'</div>'
      + '<div class="whowrap"><div class="who">'+esc(rec.name||'—')+'</div></div>'
      + ((rec.reg||rec.institution)
          ? '<div class="sub">'+esc([rec.reg,rec.institution].filter(Boolean).join(' · '))+'</div>' : '')
      + '<div class="mid">'+esc(t.midline)+'</div>'
      + '<div class="course">'+esc(rec.course||'')+'</div>'
      + (t.tail?'<div class="tail">'+esc(t.tail)+'</div>':'')
      + '<div class="stats">'+stats.map(function(x){
          return '<div class="stat"><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>'; }).join('')+'</div>'
      + '<div class="foot"><div class="sigs">'+sig+'</div>'+seal+'</div>'
      + '<div class="verify"><div style="flex:1">'
        + '<div class="code">'+esc(rec.code||'—')+'</div>'
        + esc(t.note).replace(/&amp;/g,'&')
        + '</div><div style="text-align:right;flex:none;max-width:78mm">'
        + esc(t.place)+'<br>'+esc(t.verifyUrl)
        + '</div></div>'
    + '</div></div>';
}
/* The certificate is A4 landscape full-bleed artwork, so the browser's own
   print pipeline gives a far better PDF than rasterising it would. The window
   therefore opens with a print bar rather than a download button, and the bar
   hides itself when printing. */
var BAR =
  '<div class="cert-bar">'
 +'<button type="button" onclick="window.print()">&#10515; Save as PDF / print</button>'
 +'<span>Choose <b>A4</b> and <b>Landscape</b>, and set margins to <b>None</b> so the border is not cropped.</span>'
 +'</div>';
var BARCSS =
  '.cert-bar{position:sticky;top:0;z-index:9;display:flex;gap:12px;align-items:center;flex-wrap:wrap;'
 +'padding:12px 16px;background:#fff;border-bottom:1px solid #ded7d0;font:14px Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif}'
 +'.cert-bar button{font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;border:0;border-radius:100px;'
 +'padding:9px 18px;background:#8c1515;color:#fff}'
 +'.cert-bar span{font-size:12.5px;color:#6e6a63}'
 +'@media print{.cert-bar{display:none!important}}';

function open_(rec){
  var w=window.open('','_blank');
  if(!w){ alert('Please allow pop-ups so the certificate can open.'); return null; }
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8">'
    +'<title>'+esc(rec&&rec.code||'Certificate')+'</title>'
    +'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet">'
    +'<style>body{margin:0;background:#e9e5e0}@media print{body{background:#fff}}'+BARCSS+CSS+'</style></head><body>'
    + BAR + '<div style="padding:16px 0">' + html(rec) + '</div></body></html>');
  w.document.close();
  return w;
}


/* ---------------------------------------------------------------
   The administrator's certificate designer. A drop-in, so it can sit
   in the admin portal today and anywhere else later:
     AlizonCertificate.designer(el, {onChange:fn})
   Everything the certificate says, the logos on it and who signs it
   are edited here. Saves as the administrator types; the preview
   re-renders but the form is never re-rendered mid-edit, which would
   steal the caret.
   --------------------------------------------------------------- */
var DCSS =
  '.alz-cd{font-family:inherit;font-size:14px}'
 +'.alz-cd .cd-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}'
 +'@media(max-width:900px){.alz-cd .cd-grid{grid-template-columns:1fr}}'
 +'.alz-cd .cd-f{display:flex;flex-direction:column;gap:5px;margin-bottom:11px}'
 +'.alz-cd label.cd-l{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#6e6a63}'
 +'.alz-cd input[type=text],.alz-cd input[type=number],.alz-cd textarea{width:100%;font:inherit;font-size:13.5px;'
 +'padding:8px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.15);background:#fff;color:#26221f}'
 +'.alz-cd textarea{min-height:64px;resize:vertical;line-height:1.55}'
 +'.alz-cd .cd-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}'
 +'.alz-cd .cd-chk{display:flex;gap:8px;align-items:center;font-size:13px;padding:7px 0}'
 +'.alz-cd .cd-chk input{accent-color:#8c1515;width:16px;height:16px}'
 +'.alz-cd .cd-btn{cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;border-radius:100px;padding:8px 15px;'
 +'border:1px solid rgba(0,0,0,.15);background:#fff;color:#26221f}'
 +'.alz-cd .cd-btn.pri{background:#8c1515;border-color:#8c1515;color:#fff}'
 +'.alz-cd .cd-btn.rm{color:#b1040e;border-color:rgba(177,4,14,.35)}'
 +'.alz-cd .cd-logos{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}'
 +'.alz-cd .cd-logo{border:1px solid rgba(0,0,0,.12);border-radius:10px;padding:9px;background:#fff;text-align:center;width:150px}'
 +'.alz-cd .cd-logo img{max-width:120px;max-height:52px;object-fit:contain;display:block;margin:0 auto 7px}'
 +'.alz-cd .cd-logo input[type=text]{font-size:12px;padding:5px 8px;margin-bottom:6px}'
 +'.alz-cd .cd-sec{font-family:"Source Serif Pro",Georgia,serif;font-size:16px;margin:18px 0 8px;padding-bottom:5px;'
 +'border-bottom:1px solid rgba(0,0,0,.12)}'
 +'.alz-cd .cd-hint{font-size:12px;color:#6e6a63;line-height:1.6;margin-bottom:8px}'
 +'.alz-cd .cd-ok{font-size:11.5px;font-weight:700;color:#1E8E5A;opacity:0;transition:opacity .3s}'
 +'.alz-cd .cd-prev{border:1px solid rgba(0,0,0,.12);border-radius:12px;background:#e9e5e0;padding:14px;overflow:auto}'
 +'.alz-cd .cd-prev .scale{transform-origin:top left;transform:scale(.42);width:297mm;height:210mm}'
 +'.alz-cd .cd-prevwrap{height:calc(210mm * .42 + 6px);overflow:hidden}';

function designer(el, opts){
  opts=opts||{};
  var host=(typeof el==='string')?document.querySelector(el):el;
  if(!host) return;
  if(!document.getElementById('alzCertCss')){
    var st=document.createElement('style'); st.id='alzCertCss'; st.textContent=DCSS+CSS;
    document.head.appendChild(st);
  }
  var t=template();

  function flash(){ var k=host.querySelector('.cd-ok'); if(!k) return;
    k.style.opacity='1'; clearTimeout(k._t); k._t=setTimeout(function(){ k.style.opacity='0'; },1400); }
  function snapshot(){
    /* carry the printable signature details with the template, so the public
       workshop never has to read the experience-letter store */
    try{ t.signSnapshot = liveSignBits(); }catch(e){}
  }
  function commit(){ snapshot(); saveTemplate(t); flash(); draw(); if(opts.onChange) opts.onChange(t); }

  var SAMPLE={ code:'ALZ/'+new Date().getFullYear()+'/PVX/7K3M9Q', name:'Anita Joseph', reg:'21PH045',
    institution:'Mar Dioscorus College of Pharmacy', course:'PV-X — AI ADR Detective: virtual patient safety investigation',
    programme:'PVX', score:92, band:'Excellent', hours:t.hours, issued:Date.now() };

  function draw(){
    var p=host.querySelector('.cd-prev .scale'); if(!p) return;
    SAMPLE.hours=t.hours;
    p.innerHTML=html(SAMPLE);
  }

  function field(key, label, kind, hint){
    var id='cd-'+key;
    var input = kind==='area' ? '<textarea id="'+id+'"></textarea>'
              : kind==='num'  ? '<input type="number" id="'+id+'" min="0" step="1">'
              : '<input type="text" id="'+id+'">';
    return '<div class="cd-f"><label class="cd-l" for="'+id+'">'+esc(label)+'</label>'+input
         + (hint?'<div class="cd-hint" style="margin:0">'+esc(hint)+'</div>':'')+'</div>';
  }
  function check(key, label){
    return '<label class="cd-chk"><input type="checkbox" id="cd-'+key+'"><span>'+esc(label)+'</span></label>';
  }

  host.innerHTML =
    '<div class="alz-cd">'
    + '<div class="cd-row" style="justify-content:space-between;margin-bottom:6px">'
      + check('enabled','Issue certificates on completion')
      + '<span class="cd-ok">Saved</span></div>'
    + '<div class="cd-hint">Everything below appears on the certificate. Changes take effect for every certificate '
      + 'issued from now on; certificates already issued keep the wording they were issued with.</div>'

    + '<div class="cd-grid"><div>'
      + '<div class="cd-sec">Wording</div>'
      + field('eyebrow','Line above the title')
      + field('title','Title')
      + field('lead','Line before the name')
      + field('midline','Line after the name')
      + field('tail','Closing sentence','area')
      + '<div class="cd-sec">Details shown</div>'
      + check('showScore','Show the mark out of 100')
      + check('showHours','Show credit hours')
      + '<div class="cd-grid" style="gap:10px">'
        + field('hours','Credit hours','num')
        + field('passMark','Pass mark for issue','num','A certificate is offered only at or above this mark.')
      + '</div>'
      + field('place','Place of issue')
      + field('accent','Accent colour','text','Any CSS colour. The house cardinal is #8c1515.')
      + field('verifyUrl','Verification address')
      + field('note','Footnote','area')
    + '</div><div>'
      + '<div class="cd-sec">Logos</div>'
      + '<div class="cd-hint">Appear across the top of the certificate. Images are reduced to 420&nbsp;px wide and '
        + 'stored with the template. Three or four is the most that reads well.</div>'
      + '<div class="cd-row"><button type="button" class="cd-btn pri" id="cdAddLogo">Add a logo</button>'
        + '<input type="file" id="cdLogoFile" accept="image/*" style="display:none">'
        + '<span class="cd-hint" id="cdLogoMsg" style="margin:0"></span></div>'
      + '<div class="cd-logos" id="cdLogos"></div>'
      + '<div class="cd-sec">Who signs it</div>'
      + '<div class="cd-hint">The signatory library is shared with the other documents the portal issues, so a '
        + 'corrected name or designation fixes the experience letters and notifications too.</div>'
      + '<div id="cdSigners"></div>'
      + '<div class="cd-f" style="margin-top:12px"><label class="cd-l">The signature itself</label>'
        + '<div class="cd-row">'
        + '<label class="cd-chk"><input type="radio" name="cdSignMode" value="wet"><span>Leave a blank line to sign by hand</span></label>'
        + '<label class="cd-chk"><input type="radio" name="cdSignMode" value="digital"><span>Print the uploaded signature</span></label>'
        + '</div></div>'
      + '<div class="cd-f"><label class="cd-l">Seal</label>'
        + '<div class="cd-row">'
        + '<label class="cd-chk"><input type="radio" name="cdSealMode" value="off"><span>None</span></label>'
        + '<label class="cd-chk"><input type="radio" name="cdSealMode" value="space"><span>Leave a space to stamp</span></label>'
        + '<label class="cd-chk"><input type="radio" name="cdSealMode" value="image"><span>Print the uploaded seal</span></label>'
        + '</div>'
        + '<div class="cd-row" style="margin-top:4px">'
        + '<button type="button" class="cd-btn" id="cdSealBtn">Upload a seal</button>'
        + '<input type="file" id="cdSealFile" accept="image/*" style="display:none">'
        + '<img id="cdSealImg" alt="" style="max-height:46px;max-width:46px;object-fit:contain;display:none">'
        + '<span class="cd-hint" id="cdSealMsg" style="margin:0"></span></div></div>'
      + '<div class="cd-sec">Preview</div>'
      + '<div class="cd-prev cd-prevwrap"><div class="scale"></div></div>'
      + '<div class="cd-row" style="margin-top:10px">'
        + '<button type="button" class="cd-btn" id="cdOpen">Open a full-size sample</button>'
        + '<button type="button" class="cd-btn rm" id="cdReset">Reset to the defaults</button></div>'
    + '</div></div></div>';

  /* --- text and number fields --- */
  ['eyebrow','title','lead','midline','tail','place','accent','verifyUrl','note'].forEach(function(k){
    var e=host.querySelector('#cd-'+k); if(!e) return;
    e.value=t[k]||'';
    e.addEventListener('input',function(){ t[k]=e.value; commit(); });
  });
  ['hours','passMark'].forEach(function(k){
    var e=host.querySelector('#cd-'+k); if(!e) return;
    e.value=t[k];
    e.addEventListener('input',function(){ var v=parseInt(e.value,10); t[k]=isFinite(v)?v:0; commit(); });
  });
  ['enabled','showScore','showHours'].forEach(function(k){
    var e=host.querySelector('#cd-'+k); if(!e) return;
    e.checked=!!t[k];
    e.addEventListener('change',function(){ t[k]=e.checked; commit(); });
  });

  /* --- logos --- */
  function drawLogos(){
    var box=host.querySelector('#cdLogos');
    if(!t.logos.length){ box.innerHTML='<div class="cd-hint" style="margin:0">No logos yet.</div>'; return; }
    box.innerHTML=t.logos.map(function(l,i){
      return '<div class="cd-logo"><img src="'+esc(l.src)+'" alt="">'
        + '<input type="text" data-alt="'+i+'" value="'+esc(l.alt||'')+'" placeholder="Describe it">'
        + '<div class="cd-row" style="justify-content:center;gap:6px">'
        + '<button type="button" class="cd-btn" data-mv="'+i+'" '+(i===0?'disabled':'')+'>&larr;</button>'
        + '<button type="button" class="cd-btn rm" data-rm="'+i+'">Remove</button></div></div>';
    }).join('');
    box.querySelectorAll('input[data-alt]').forEach(function(inp){
      inp.addEventListener('input',function(){ t.logos[+inp.getAttribute('data-alt')].alt=inp.value; saveTemplate(t); flash(); });
    });
    box.querySelectorAll('button[data-rm]').forEach(function(b){
      b.addEventListener('click',function(){
        var i=+b.getAttribute('data-rm');
        if(!confirm('Remove this logo from the certificate?')) return;
        t.logos.splice(i,1); commit(); drawLogos();
      });
    });
    box.querySelectorAll('button[data-mv]').forEach(function(b){
      b.addEventListener('click',function(){
        var i=+b.getAttribute('data-mv'); if(i<1) return;
        var x=t.logos.splice(i,1)[0]; t.logos.splice(i-1,0,x); commit(); drawLogos();
      });
    });
  }
  host.querySelector('#cdAddLogo').addEventListener('click',function(){ host.querySelector('#cdLogoFile').click(); });
  host.querySelector('#cdLogoFile').addEventListener('change',function(){
    var f=this.files&&this.files[0], msg=host.querySelector('#cdLogoMsg');
    if(!f) return;
    this.value='';
    if(!window.AlizonExperience || !AlizonExperience.readImage){ msg.textContent='Image tools are not loaded on this page.'; return; }
    msg.textContent='Reading…';
    AlizonExperience.readImage(f, 420, function(dataUrl, err){
      if(!dataUrl){ msg.textContent=err||'Could not read that image.'; return; }
      t.logos.push({ src:dataUrl, alt:'' });
      msg.textContent='Added.';
      commit(); drawLogos();
      setTimeout(function(){ msg.textContent=''; }, 1600);
    });
  });
  drawLogos();

  /* --- signatory, reusing the shared library --- */
  if(window.AlizonExperience && AlizonExperience.signerPanel){
    AlizonExperience.signerPanel(host.querySelector('#cdSigners'),
      { doc:'certificate', onChange:function(){ commit(); } });
  } else {
    host.querySelector('#cdSigners').innerHTML='<div class="cd-hint">Load alizon-experience.js on this page to edit signatories.</div>';
  }

  /* --- signature mode and seal: these live in the shared settings, because
         every document the portal issues signs and stamps the same way --- */
  function X(){ return window.AlizonExperience; }
  function paintSignSeal(){
    if(!X()) return;
    var st=X().settings();
    var sm=st.signMode||'wet';
    host.querySelectorAll('input[name=cdSignMode]').forEach(function(r){ r.checked=(r.value===sm); });
    var seal=X().sealMode?X().sealMode():(st.sealImage?'image':'off');
    host.querySelectorAll('input[name=cdSealMode]').forEach(function(r){ r.checked=(r.value===seal); });
    var im=host.querySelector('#cdSealImg');
    if(st.sealImage){ im.src=st.sealImage; im.style.display=''; } else { im.style.display='none'; }
  }
  host.querySelectorAll('input[name=cdSignMode]').forEach(function(r){
    r.addEventListener('change',function(){ if(!r.checked||!X()) return;
      X().saveSettings({ signMode:r.value }); commit(); });
  });
  host.querySelectorAll('input[name=cdSealMode]').forEach(function(r){
    r.addEventListener('change',function(){ if(!r.checked||!X()) return;
      X().saveSettings({ sealMode:r.value }); commit(); });
  });
  host.querySelector('#cdSealBtn').addEventListener('click',function(){ host.querySelector('#cdSealFile').click(); });
  host.querySelector('#cdSealFile').addEventListener('change',function(){
    var f=this.files&&this.files[0], msg=host.querySelector('#cdSealMsg');
    if(!f||!X()) return;
    this.value='';
    msg.textContent='Reading…';
    X().readImage(f, 300, function(dataUrl, err){
      if(!dataUrl){ msg.textContent=err||'Could not read that image.'; return; }
      X().saveSettings({ sealImage:dataUrl, sealMode:'image' });
      msg.textContent='Seal updated.';
      paintSignSeal(); commit();
      setTimeout(function(){ msg.textContent=''; }, 1600);
    });
  });
  paintSignSeal();

  snapshot(); saveTemplate(t);
  host.querySelector('#cdOpen').addEventListener('click',function(){ open_(SAMPLE); });
  host.querySelector('#cdReset').addEventListener('click',function(){
    if(!confirm('Reset the certificate wording, colours and logos to the defaults? Issued certificates are not affected.')) return;
    t=JSON.parse(JSON.stringify(DEFAULTS)); t.logos=[];
    saveTemplate(t); designer(host, opts);
  });
  draw();
}

window.AlizonCertificate = {
  template:template, saveTemplate:saveTemplate, refresh:refresh, DEFAULTS:DEFAULTS,
  issue:issue, verify:verify, list:list, revoke:revoke,
  makeCode:makeCode, randomCode:randomCode,
  html:html, open:open_, css:CSS, signBits:signBits, liveSignBits:liveSignBits, longDate:longDate,
  designer:designer
};

})();
