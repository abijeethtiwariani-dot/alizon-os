/* pvx-certificate-art.js — the PV-X workshop's settings for the shared
   certificate and experience-letter artwork in alizon-doc-art.js. Used by the
   public name search (pvx-certificate.html) and the staff desk. Load
   pvx-certificate-roster.js and alizon-doc-art.js first.

   PVXCert.html(p) / letter(p)   p = {name, code?, institution?}
   PVXCert.pdf(p, btn, kind)     kind 'letter' for the letter
   PVXCert.print(p, kind)
   PVXCert.panel(el) → set(p)    both documents with their buttons
   PVXCert.find(name)            the roster entry with exactly this name, or null */
(function(){
'use strict';
var R = window.PVX_ROSTER || { people:[] }, A = window.AlizonDocArt;
function norm(s){ return String(s||'').toUpperCase().replace(/[^A-Z]/g,''); }

var S = {
  title:'Certificate of Participation',
  midline:'has participated in the {hours}-hour hands-on workshop',
  course:R.workshop, subtitle:R.subtitle,
  tail:'conducted by the Alizon School of Medical & Digital Intelligence in collaboration with Mar Dioscorus '
      +'College of Pharmacy and the International Organisation for Preventive Health and Medical Research Centre (IPMR), '
      +'covering patient interviewing, adverse drug reaction identification, seriousness assessment, '
      +'Naranjo causality scoring, ICSR reporting and safety-signal assessment on simulated patient cases.',
  hours:R.hours, mode:'Hands-on', date:R.date, issued:R.issued,
  partners:['mardioscorus','ipmr'],
  skills:[
    'interviewing a patient to take a structured medication and adverse-event history;',
    'gathering corroborating evidence from the prescriber, dispensing record, medical notes and laboratory;',
    'identifying a suspected adverse drug reaction and assessing its seriousness;',
    'assessing causality with the Naranjo algorithm;',
    'completing an Individual Case Safety Report (ICSR) and checking for duplicate reports;',
    'reviewing case series to judge whether a safety signal is present.'
  ],
  letter:true,
  verifyBase:'https://www.alizon.in/pvx-certificate',
  filePrefix:'PVX',
  letterBody:function(p, S, esc){
    return '<p>This is to certify that <b>'+esc(p.name)+'</b>, of '+esc(p.line)+', completed <b>'+S.hours+' hours of hands-on '
      + 'training</b> in pharmacovigilance at the workshop <b>'+esc(S.course)+'</b> — '+esc(String(S.subtitle).toLowerCase())
      + (S.date ? ', held on <b>'+esc(S.date)+'</b>' : '')+'.</p>'
      + '<p>The workshop was conducted by the Alizon School of Medical &amp; Digital Intelligence in collaboration with Mar '
      + 'Dioscorus College of Pharmacy and the International Organisation for Preventive Health and Medical Research '
      + 'Centre (IPMR). Working on simulated patient cases, '+esc(p.name)+' gained practical experience in:</p>';
  }
};
/* a PV-X person carries `institution`; the shared artwork prints `line` */
function P(p){
  p = p || {};
  return { name:p.name, code:p.code, line:p.institution || (R.institution+', Thiruvananthapuram') };
}

window.PVXCert = {
  html:function(p){ return A.html(P(p), S); },
  letter:function(p){ return A.letter(P(p), S); },
  qr:A.qr,
  pdf:function(p, btn, kind){ return A.pdf(P(p), S, btn, kind); },
  print:function(p, kind){ return A.print(P(p), S, kind); },
  panel:function(el){ var set = A.panel(el); return function(p){ set(p ? P(p) : null, S); }; },
  find:function(name){
    var k = norm(name);
    return k ? (R.people.filter(function(x){ return norm(x.name)===k; })[0] || null) : null;
  }
};
})();
