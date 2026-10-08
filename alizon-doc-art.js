/* alizon-doc-art.js — the certificate and experience letter artwork, shared
   by every page that hands them out:
     pvx-certificate / pvx-cert-desk-*   the PV-X workshop (via pvx-certificate-art.js)
     alizon-certificates                 course certificates published from the admin portal
     admin-portal → Course Certificates  the preview while designing

   Everything a document says comes from a settings object S, so one design
   serves any course:
     S = { title, lead, midline, course, subtitle, tail, hours, mode, date, issued,
           partners:['mardioscorus','ipmr'], skills:[...], letter:true, verifyBase,
           letterBody?: function(p,S,esc) → html   (optional, replaces the opening paragraphs) }
   A person is p = { name, line?, code? }. No code → no QR: a QR that answers
   "no such certificate" would be worse than none.

   AlizonDocArt.html(p,S) / letter(p,S)    the two documents as HTML
   AlizonDocArt.qr(root)                   paints QR codes (needs qrcodejs)
   AlizonDocArt.pdf(p,S,btn,kind)          downloads a PDF; kind 'letter' for the letter
   AlizonDocArt.print(p,S,kind)            opens a print window
   AlizonDocArt.panel(el) → set(p,S)       both documents side by side with buttons
   AlizonDocArt.PARTNERS                   the organisations that can be credited */
(function(){
'use strict';
if (window.AlizonDocArt) return;

var FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:wght@400;600;700&display=swap';
var ALIZON = 'Alizon School of Medical &amp; Digital Intelligence';
var PARTNERS = {
  mardioscorus: { name:'Mar Dioscorus College of Pharmacy', short:'Mar Dioscorus College of Pharmacy',
                  logo:'resources/partners/mar-dioscorus-college-of-pharmacy.png' },
  ipmr: { name:'International Organisation for Preventive Health and Medical Research Centre', short:'IPMR',
          logo:'resources/partners/ipmr-logo.png' }
};
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function short(code){ return String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,''); }
function parts(S){ return (S.partners||[]).map(function(k){ return PARTNERS[k]; }).filter(Boolean); }
function logos(S){
  return '<img src="alizon-logo.png" alt="Alizon">' + parts(S).map(function(p){
    return '<img src="'+p.logo+'" alt="'+esc(p.name)+'">'; }).join('');
}
/* "with A", "with A and the B (B)" — written out, because a collaborator named only by an acronym means nothing to a reader */
function collab(S){
  var ps = parts(S); if (!ps.length) return '';
  return ' in collaboration with ' + ps.map(function(p, i){
    var n = p.short!==p.name ? 'the '+esc(p.name)+' ('+esc(p.short)+')' : esc(p.name);
    return (i && i===ps.length-1 ? 'and ' : '') + n;
  }).join(ps.length>2 ? ', ' : ' ');
}
/* {hours} in the wording becomes the number; with no hours set, "the {hours}-hour " drops out cleanly */
function fill(t, S){
  t = String(t||'');
  if (!S.hours) t = t.replace(/\bthe \{hours\}-hour /g, '').replace(/\{hours\}-hour /g, '').replace(/\{hours\}/g, '');
  return t.replace(/\{hours\}/g, S.hours);
}

var CSS = [
/* certificate: A4 landscape, 1123 × 794 px at 96 dpi */
'.cert{--ac:#8c1515;--ink:#2e2d29;--mut:#6e6a63;--line:#ded7d0;box-sizing:border-box;width:1123px;height:794px;padding:44px;background:#fff;color:var(--ink);position:relative;font-family:Inter,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.6}',
'.cert *{box-sizing:border-box}',
'.cert .frame{height:100%;border:2px solid var(--ac);position:relative;padding:30px 50px 22px;display:flex;flex-direction:column}',
'.cert .frame:before{content:"";position:absolute;inset:11px;border:1px solid var(--ac);opacity:.4;pointer-events:none}',
'.cert .logos{display:flex;align-items:center;justify-content:center;gap:26px}',
'.cert .logos img{height:66px;width:auto}',
'.cert .logos img+img{border-left:1px solid var(--line);padding-left:26px}',
'.cert .eyebrow{text-align:center;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mut);margin-top:12px}',
'.cert h2{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:40px;font-weight:700;color:var(--ac);margin:6px 0 0;line-height:1.3}',
'.cert .rule{width:170px;height:2px;background:var(--ac);margin:10px auto 0}',
'.cert .lead{text-align:center;font-size:14px;color:var(--mut);margin-top:18px}',
'.cert .who{text-align:center;margin-top:6px}',
'.cert .who b{font-family:"Source Serif Pro",Georgia,serif;font-size:36px;display:inline-block;min-width:460px;padding:0 20px 6px;border-bottom:1px solid var(--line);line-height:1.2}',
'.cert .inst{text-align:center;font-size:13px;color:var(--mut);margin-top:6px;min-height:6px}',
'.cert .mid{text-align:center;font-size:14px;color:var(--mut);margin-top:14px}',
'.cert .course{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:23px;font-weight:600;margin-top:4px;line-height:1.35}',
'.cert .course small{display:block;font-family:Inter,Arial,sans-serif;font-size:13.5px;font-weight:500;color:var(--mut);margin-top:2px}',
'.cert .tail{text-align:center;font-size:12px;color:var(--mut);margin:12px auto 0;max-width:860px;line-height:1.6}',
'.cert .stats{display:flex;justify-content:center;gap:56px;margin-top:16px}',
'.cert .stat{text-align:center}',
'.cert .stat b{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:19px;color:var(--ac)}',
'.cert .stat span{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#8a827b}',
'.cert .foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;min-height:91px;border-top:1px solid var(--line);padding-top:12px;font-size:10.5px;color:#8a827b;line-height:1.6}',
'.cert .foot .code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:700;color:var(--ink);letter-spacing:.04em}',
'.cert .qr{width:78px;height:78px;flex:none}',
'.cert .qr img,.cert .qr canvas{width:78px!important;height:78px!important}',
/* experience letter: A4 portrait, 794 × 1123 px */
'.xl{--ac:#8c1515;--ink:#2e2d29;--mut:#6e6a63;--line:#ded7d0;box-sizing:border-box;width:794px;height:1123px;padding:56px 72px 44px;background:#fff;color:var(--ink);font-family:Inter,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;display:flex;flex-direction:column;font-size:14px;line-height:1.75}',
'.xl *{box-sizing:border-box}',
'.xl .hd{display:flex;align-items:center;gap:18px;padding-bottom:16px;border-bottom:2px solid var(--ac)}',
'.xl .hd img{height:54px;width:auto}',
'.xl .hd .nm{margin-left:auto;text-align:right;font-size:11px;line-height:1.5;color:var(--mut)}',
'.xl .hd .nm b{display:block;font-family:"Source Serif Pro",Georgia,serif;font-size:16px;color:var(--ac)}',
'.xl .meta{display:flex;justify-content:space-between;font-size:12.5px;color:var(--mut);margin-top:22px}',
'.xl h2{font-family:"Source Serif Pro",Georgia,serif;text-align:center;font-size:24px;color:var(--ac);margin:30px 0 4px;letter-spacing:.02em}',
'.xl .to{text-align:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:22px}',
'.xl p{margin:0 0 14px;text-align:justify}',
'.xl ul{margin:0 0 14px;padding-left:22px}',
'.xl li{margin-bottom:3px}',
'.xl .sign{margin-top:26px}',
'.xl .sign b{display:block;font-size:14px}',
'.xl .sign span{font-size:12.5px;color:var(--mut)}',
'.xl .foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;border-top:1px solid var(--line);padding-top:12px;font-size:10.5px;color:#8a827b;line-height:1.6}',
'.xl .foot .code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:700;color:var(--ink)}',
'.xl .qr{width:70px;height:70px;flex:none}',
'.xl .qr img,.xl .qr canvas{width:70px!important;height:70px!important}',
/* the two-document panel */
'.pvx-docs{display:grid;grid-template-columns:3fr 2fr;gap:16px;margin-top:16px}',
'.pvx-docs.one{grid-template-columns:1fr}',
'@media(max-width:640px){.pvx-docs{grid-template-columns:1fr}}',
'.pvx-doc{border:1px solid #ded7d0;border-radius:12px;padding:12px;background:#faf8f6;display:flex;flex-direction:column;gap:10px;min-width:0}',
'.pvx-doc h3{margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6e6a63}',
'.pvx-doc .pv{overflow:hidden;border:1px solid #ded7d0;border-radius:8px;background:#fff}',
'.pvx-doc .pv>div{transform-origin:top left}',
'.pvx-doc .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}',
'.pvx-doc button{font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;border-radius:100px;padding:9px 16px;border:1px solid #8c1515;background:#8c1515;color:#fff}',
'.pvx-doc button.g{background:#fff;color:#2e2d29;border-color:#c9c1b8}',
'.pvx-doc button[disabled]{opacity:.55;cursor:not-allowed}',
'.pvx-both{margin-top:14px}',
'.pvx-both button{font:inherit;font-size:14.5px;font-weight:700;cursor:pointer;border:0;border-radius:100px;padding:12px 22px;background:#2e2d29;color:#fff;width:100%}',
'.pvx-both button[disabled]{opacity:.55;cursor:not-allowed}'
].join('\n');
(function(){ var st=document.createElement('style'); st.id='alizonDocArtCss'; st.textContent=CSS; document.head.appendChild(st); })();

function stats(S){
  var out = [];
  if (S.hours) out.push([S.hours+' hours','Duration']);
  if (S.mode)  out.push([S.mode,'Mode']);
  if (S.date)  out.push([S.date,'Date']);
  return out.map(function(x){ return '<div class="stat"><b>'+esc(x[0])+'</b><span>'+x[1]+'</span></div>'; }).join('');
}
function foot(p, S, ref, what){
  return p.code
    ? '<div class="foot"><div><div class="code">'+esc(ref)+'</div>'
      + 'Issued digitally; it carries no handwritten signature. Scan the QR code to confirm on alizon.in that '+what+' is genuine.</div>'
      + '<div class="qr" data-qr="'+esc(S.verifyBase+'?code='+short(p.code))+'"></div></div>'
    : '<div class="foot"><div>Issued digitally; it carries no handwritten signature.</div></div>';
}

function html(p, S){
  p = p || {}; S = S || {};
  var eyebrow = [ALIZON].concat(parts(S).map(function(x){ return esc(x.short); })).join(' · ');
  return '<div class="cert"><div class="frame">'
    + '<div class="logos">'+logos(S)+'</div>'
    + '<div class="eyebrow">'+eyebrow+'</div>'
    + '<h2>'+esc(S.title||'Certificate of Completion')+'</h2><div class="rule"></div>'
    + '<div class="lead">'+esc(S.lead||'This is to certify that')+'</div>'
    + '<div class="who"><b>'+esc(p.name)+'</b></div>'
    + '<div class="inst">'+esc(p.line||'')+'</div>'
    + '<div class="mid">'+esc(fill(S.midline, S))+'</div>'
    + '<div class="course">'+esc(S.course)+(S.subtitle?'<small>'+esc(S.subtitle)+'</small>':'')+'</div>'
    + (S.tail ? '<div class="tail">'+esc(S.tail)+'</div>'
              : '<div class="tail">conducted by the '+ALIZON+collab(S)+'.</div>')
    + '<div class="stats">'+stats(S)+'</div>'
    + foot(p, S, p.code, 'this certificate')
    + '</div></div>';
}

/* Written without pronouns on purpose: the rosters record names only, and a
   guessed he/she on a formal letter is a real error. */
function letter(p, S){
  p = p || {}; S = S || {};
  var ref = p.code ? p.code+'/EL' : 'ALZ/EL';
  var ps = parts(S);
  var body = S.letterBody ? S.letterBody(p, S, esc)
    : '<p>This is to certify that <b>'+esc(p.name)+'</b>'+(p.line?', '+esc(p.line)+',':'')+' completed '
      + (S.hours ? '<b>'+esc(S.hours)+' hours of '+esc(String(S.mode||'hands-on').toLowerCase())+' training</b>' : 'training')
      + ' as part of the <b>'+esc(S.course)+'</b>'+(S.subtitle?' ('+esc(S.subtitle)+')':'')
      + (S.date ? ', finishing on <b>'+esc(S.date)+'</b>' : '')+'.</p>'
      + '<p>The training was conducted by the '+ALIZON+collab(S)+'.'
      + ((S.skills||[]).length ? ' During the training, '+esc(p.name)+' gained practical experience in:' : '')+'</p>';
  var skills = (S.skills||[]).filter(Boolean);
  return '<div class="xl">'
    + '<div class="hd">'+logos(S)
    +   '<div class="nm"><b>'+ALIZON+'</b>'
    +   (ps.length ? 'with '+ps.map(function(x){ return esc(x.short); }).join('<br>and ')+' · ' : '')+'Thiruvananthapuram, Kerala</div></div>'
    + '<div class="meta"><span>Ref: '+esc(ref)+'</span><span>Date: '+esc(S.issued || S.date || '')+'</span></div>'
    + '<h2>Experience Letter</h2><div class="to">To whom it may concern</div>'
    + body
    + (skills.length ? '<ul>'+skills.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ul>' : '')
    + '<p>This letter is issued on request, to be used wherever it may be required.</p>'
    + '<p>We wish '+esc(p.name)+' every success.</p>'
    + '<div class="sign"><b>For '+ALIZON+'</b>'
    +   (ps.length ? '<span>In collaboration with '+ps.map(function(x){ return esc(x.short); }).join(' and ')+'</span>' : '')+'</div>'
    + foot(p, S, ref, 'it')
    + '</div>';
}

function qr(root){
  root.querySelectorAll('[data-qr]').forEach(function(el){
    el.innerHTML = '';
    if (window.QRCode) new QRCode(el, { text:el.getAttribute('data-qr'), width:156, height:156, correctLevel:QRCode.CorrectLevel.M });
  });
}

/* PDF: drawn at full size off-screen, rasterised at 2×, placed on one A4 page */
var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
function load(src){ return new Promise(function(ok, no){ var s=document.createElement('script'); s.src=src; s.onload=ok; s.onerror=no; document.head.appendChild(s); }); }
function libs(){
  return Promise.all([
    window.jspdf ? 0 : load(CDN+'jspdf/2.5.1/jspdf.umd.min.js'),
    window.html2canvas ? 0 : load(CDN+'html2canvas/1.4.1/html2canvas.min.js')
  ]);
}
function fileName(p, S, L){
  var pre = S.filePrefix || String(S.course||'Alizon').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
  return pre+'-'+(L?'Experience-Letter-':'Certificate-')+String(p.name||'').trim().replace(/[^A-Za-z0-9]+/g,'-')+'.pdf';
}
function pdf(p, S, btn, kind){
  var L = kind==='letter';
  var label = btn ? btn.textContent : '';
  if (btn){ btn.disabled = true; btn.textContent = 'Preparing…'; }
  var stage = document.createElement('div');
  stage.style.cssText = 'position:fixed;left:-10000px;top:0';
  stage.innerHTML = L ? letter(p, S) : html(p, S); document.body.appendChild(stage); qr(stage);
  return libs().then(function(){ return document.fonts ? document.fonts.ready : 0; })
    .then(function(){ return html2canvas(stage.firstChild, { scale:2, backgroundColor:'#ffffff', useCORS:true, logging:false }); })
    .then(function(cv){
      var doc = new window.jspdf.jsPDF({ unit:'mm', format:'a4', orientation:L?'portrait':'landscape', compress:true });
      doc.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, L?210:297, L?297:210);
      doc.save(fileName(p, S, L));
    })
    .catch(function(){ alert('The PDF could not be made on this device. Use Print and choose "Save as PDF" instead.'); })
    .then(function(){ stage.remove(); if (btn){ btn.disabled = false; btn.textContent = label; } });
}
function print_(p, S, kind){
  var L = kind==='letter';
  var w = window.open('', '_blank');
  if (!w){ alert('Please allow pop-ups to print.'); return; }
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+esc(p.name)+' — '+(L?'experience letter':'certificate')+'</title>'
    + '<link href="'+FONTS+'" rel="stylesheet">'
    + '<base href="'+location.href.replace(/[?#].*$/,'').replace(/[^/]*$/,'')+'">'
    + '<style>'+CSS+'@page{size:A4 '+(L?'portrait':'landscape')+';margin:0}body{background:#fff;margin:0}.cert,.xl{margin:0 auto}</style></head><body>'
    + (L ? letter(p, S) : html(p, S)) + '</body></html>');
  w.document.close();
  qr(w.document);
  setTimeout(function(){ w.focus(); w.print(); }, 900);
}

/* panel(el) → set(p, S): certificate and experience letter side by side, each
   with its own download and print, plus one button that downloads both.
   When S.letter is false only the certificate is offered. */
function panel(el){
  var cur = null, S = {};
  function fit(){
    el.querySelectorAll('.pv').forEach(function(box){
      var L = box.getAttribute('data-k')==='l', w = L?794:1123, h = L?1123:794, k = box.clientWidth / w;
      box.firstChild.style.transform = 'scale('+k+')'; box.style.height = (h*k)+'px';
    });
  }
  function build(withLetter){
    el.innerHTML = '<div class="pvx-docs'+(withLetter?'':' one')+'">'
      + '<div class="pvx-doc"><h3>Certificate</h3><div class="pv" data-k="c"><div></div></div>'
      +   '<div class="acts"><button type="button" data-a="pc">Download certificate</button><button type="button" class="g" data-a="rc">Print</button></div></div>'
      + (withLetter
        ? '<div class="pvx-doc"><h3>Experience letter</h3><div class="pv" data-k="l"><div></div></div>'
          + '<div class="acts"><button type="button" data-a="pl">Download letter</button><button type="button" class="g" data-a="rl">Print</button></div></div>'
        : '')
      + '</div>'
      + (withLetter ? '<div class="pvx-both"><button type="button" data-a="both">Download both</button></div>' : '');
    el._letter = withLetter;
  }
  el.addEventListener('click', function(e){
    var b = e.target.closest('button[data-a]'); if (!b || !cur) return;
    var a = b.getAttribute('data-a');
    if (a==='pc') pdf(cur, S, b);
    else if (a==='pl') pdf(cur, S, b, 'letter');
    else if (a==='rc') print_(cur, S);
    else if (a==='rl') print_(cur, S, 'letter');
    else if (a==='both') pdf(cur, S, b).then(function(){ return pdf(cur, S, b, 'letter'); });
  });
  window.addEventListener('resize', fit);
  return function set(p, settings){
    S = settings || S;
    var withLetter = S.letter !== false;
    if (el._letter !== withLetter) build(withLetter);
    cur = p || null;
    var show = p || { name:'Student name' };
    var c = el.querySelector('[data-k=c]>div'), l = el.querySelector('[data-k=l]>div');
    c.innerHTML = html(show, S); qr(c);
    if (l){ l.innerHTML = letter(show, S); qr(l); }
    el.querySelectorAll('button').forEach(function(b){ b.disabled = !cur; });
    fit();
  };
}

window.AlizonDocArt = { html:html, letter:letter, qr:qr, pdf:pdf, print:print_, panel:panel,
                        PARTNERS:PARTNERS, css:CSS, esc:esc, short:short };
})();
