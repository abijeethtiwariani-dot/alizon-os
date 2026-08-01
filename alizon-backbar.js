/* alizon-backbar.js
   One navigation control for every app page, with exactly two actions.

   The portal had grown seven different ways of going back — "← Dashboard",
   "← Home", "← Career hub", "← Back to Alizon OS", "← Back to campus sign-in"
   and others — placed differently on each page. Worse, labs open with
   target="_blank", so a fresh tab has no history and an ordinary back link
   leads nowhere.

   This replaces all of them with:
       Back        closes the tab when it was opened from another window,
                   otherwise steps back in history, otherwise falls back to
                   the practicals index. It never leaves the student stranded.
       Dashboard   always the student dashboard.

   Include it on any page that can be opened in its own window. It removes
   the page's own ad-hoc back links so there is never more than one.
*/
(function(){
'use strict';
if(window.__alizonBackBar) return;
window.__alizonBackBar = true;

var DASH = 'ASMDI-dashboard.html';
var FALLBACK = 'os-practicals.html';

function ready(fn){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

/* Strip the page's own back links so this bar is the only one.
   Matched on the link text, because they were each hand-written. */
var STRIP = /^\s*(←|↩|&#8592;|&larr;)?\s*(back|back to .*|go back|dashboard|home|return.*|back to alizon os|back to campus sign-in|back to homepage|career hub|all courses)\s*$/i;
function stripOldLinks(){
  var n = 0;
  [].forEach.call(document.querySelectorAll('a'), function(a){
    if(a.closest('#alizonBackBar')) return;
    if(a.closest('#labGate, .labgate, [data-keep-back]')) return;   /* the locked-out screen keeps its own */
    var t = (a.textContent || '').replace(/\s+/g,' ').trim();
    if(!STRIP.test(t)) return;
    /* only strip if it actually points at a portal destination */
    var h = (a.getAttribute('href') || '');
    if(!/ASMDI-dashboard|os-practicals|index\.html|alizon-home|alizon-career|alizon-course|^#|^$/.test(h)) return;
    a.parentNode && a.parentNode.removeChild(a);
    n++;
  });
  return n;
}

function goBack(){
  /* Opened from another window — the honest "back" is to close this one and
     return the student to the tab they were already on. */
  try{
    if(window.opener && !window.opener.closed){ window.close(); return; }
  }catch(e){}
  /* Same-tab navigation with somewhere to go back to. */
  if(window.history.length > 1 && document.referrer){
    try{
      var ref = new URL(document.referrer, location.href);
      if(ref.origin === location.origin){ window.history.back(); return; }
    }catch(e){}
  }
  location.href = FALLBACK;
}

function build(){
  if(document.getElementById('alizonBackBar')) return;

  var css = document.createElement('style');
  css.textContent =
    '#alizonBackBar{position:fixed;top:10px;right:10px;z-index:2147483000;display:flex;gap:7px;'+
      'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'+
    '#alizonBackBar button{font:inherit;font-size:12.5px;font-weight:700;line-height:1;'+
      'display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:100px;cursor:pointer;'+
      'border:1px solid rgba(255,255,255,.28);color:#fff;'+
      'background:linear-gradient(120deg,#8c1515,#b1040e);box-shadow:0 4px 14px rgba(0,0,0,.28);'+
      '-webkit-appearance:none;appearance:none}'+
    '#alizonBackBar button:hover{filter:brightness(1.08)}'+
    '#alizonBackBar button:focus-visible{outline:2px solid #fff;outline-offset:2px}'+
    /* On a phone there is no free corner — floating it covers the page heading.
       Below 700px it becomes a sticky strip that content flows beneath. */
    '@media(max-width:700px){'+
      '#alizonBackBar{position:sticky;top:0;right:auto;width:100%;gap:6px;padding:7px 10px;'+
        'background:linear-gradient(120deg,#6b0f0f,#8c1515);box-shadow:0 2px 10px rgba(0,0,0,.22)}'+
      '#alizonBackBar button{padding:7px 13px;font-size:12px;background:rgba(255,255,255,.14);'+
        'box-shadow:none;border-color:rgba(255,255,255,.35)}'+
      '#alizonBackBar button:hover{background:rgba(255,255,255,.24)}'+
    '}'+
    '@media print{#alizonBackBar{display:none!important}}';
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.id = 'alizonBackBar';
  bar.innerHTML =
    '<button type="button" id="abbBack" title="Go back">&#8592; Back</button>'+
    '<button type="button" id="abbDash" title="Go to the dashboard">&#8962; Dashboard</button>';
  /* First child, not last: on a phone the bar is sticky rather than fixed, and a
     sticky element only sticks to the top if it appears before the content. */
  document.body.insertBefore(bar, document.body.firstChild);

  bar.querySelector('#abbBack').addEventListener('click', goBack);
  bar.querySelector('#abbDash').addEventListener('click', function(){ location.href = DASH; });

  /* Escape goes back, which is what people try first in a pop-out window. */
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !document.querySelector('.ov, [role=dialog]')) goBack();
  });
}

ready(function(){
  stripOldLinks();
  build();
  /* Some pages render their chrome after load; sweep once more. */
  setTimeout(stripOldLinks, 1200);
});

window.AlizonBackBar = { back: goBack, strip: stripOldLinks };
})();
