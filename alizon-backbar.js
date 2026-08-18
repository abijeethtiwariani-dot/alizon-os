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

/* Root-relative: labs also live in subfolders (hospital-admin/), where a bare
   filename would resolve against the folder and 404. */
var DASH = '/ASMDI-dashboard.html';
/* Back used to fall back to the practicals index, which is the PUBLIC page and
   opens with "Sign in to the student portal" — a signed-in student pressing
   Back landed on what looks like a logout. With nowhere to go back to, the
   dashboard is the honest destination. */
var FALLBACK = DASH;

function ready(fn){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

/* Remove the page's own EXIT controls so this bar is the only way out.
   Precise by design: an over-broad sweep would also delete in-exercise
   navigation such as "Back to the ward" or "← All cases", which move within
   a lab rather than leaving it, and view tabs such as the HR studio's
   "Dashboard". Those must survive. */
var EXIT_LABELS = [
  /^←?\s*back$/i,
  /^←?\s*dashboard$/i,
  /^←?\s*home$/i,
  /^←?\s*portal$/i,
  /^←?\s*admin portal$/i,
  /^←?\s*library$/i,
  /^←?\s*back to (alizon os|the portal|dashboard|homepage|campus sign-in|home)$/i,
  /^←?\s*.{0,40} course desk$/i,
  /^←?\s*all courses$/i,
  /^←?\s*career hub$/i
];
/* Never touch anything that navigates inside the page. */
function isInPageControl(e){
  if(e.closest('#alizonBackBar')) return true;
  if(e.closest('#labGate, .labgate, [data-keep-back], nav, .nav-tabs, .tabs, .toc')) return true;
  if(e.hasAttribute('data-view') || e.hasAttribute('data-p') || e.hasAttribute('data-sec')) return true;
  var t=(e.textContent||'').replace(/\s+/g,' ').trim();
  /* in-exercise wording — these move within a simulation, not out of it */
  if(/\b(case|cases|ward|list|queue|round|step|unit|chapter|shelf)\b/i.test(t)) return true;
  return false;
}
function stripOldLinks(){
  var n=0;
  [].forEach.call(document.querySelectorAll('a,button'), function(e){
    if(isInPageControl(e)) return;
    var t=(e.textContent||'').replace(/\s+/g,' ').replace(/[\u2190\u21a9\u2302]/g,'').trim();
    var raw=(e.textContent||'').replace(/\s+/g,' ').trim();
    if(!raw || raw.length>46) return;
    if(!EXIT_LABELS.some(function(rx){ return rx.test(raw) || rx.test(t); })) return;
    /* an anchor must actually be leaving; a button is judged on its label alone */
    if(e.tagName==='A'){
      var h=e.getAttribute('href')||'';
      if(!h || /^javascript:/i.test(h)) return;
    }
    e.style.display='none';   /* hide rather than remove: page scripts may hold a reference */
    e.setAttribute('data-alizon-hidden','1');
    n++;
  });
  return n;
}

var pageHandler = null;
function goBack(){
  /* A page may own a meaningful "back" of its own — the library's reader
     returning to the shelf. If it handles the press, we stop there. */
  try{ if(pageHandler && pageHandler() === true) return; }catch(e){}

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

window.AlizonBackBar = { back: goBack, strip: stripOldLinks,
  onBack: function(fn){ pageHandler = fn; } };
})();
