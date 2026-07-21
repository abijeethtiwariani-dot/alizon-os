/* ALIZON — shared floating "Back" button for every portal/page.
   Uses browser history when possible; falls back to a page-provided
   data-back target or the home page. Safe to include anywhere. */
(function(){
  'use strict';
  if (window.__alzBack) return; window.__alzBack = 1;
  function add(){
    if (document.getElementById('alzBackBtn')) return;
    var b=document.createElement('a');
    b.id='alzBackBtn'; b.href='#'; b.setAttribute('role','button'); b.setAttribute('aria-label','Go back');
    b.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><polyline points="15 18 9 12 15 6"/></svg>Back';
    b.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483000;display:inline-flex;align-items:center;gap:6px;'
      +'background:#8c1515;color:#fff;font-family:"Source Sans 3","Source Sans Pro",Inter,-apple-system,sans-serif;'
      +'font-weight:600;font-size:13px;line-height:1;padding:11px 17px;border-radius:100px;text-decoration:none;'
      +'box-shadow:0 8px 24px rgba(60,8,8,.32);cursor:pointer;transition:transform .15s,background .2s';
    b.onmouseenter=function(){ b.style.background='#6b0f0f'; b.style.transform='translateY(-2px)'; };
    b.onmouseleave=function(){ b.style.background='#8c1515'; b.style.transform='none'; };
    b.onclick=function(e){
      e.preventDefault();
      var fb=document.documentElement.getAttribute('data-back') || b.getAttribute('data-back');
      if (window.history && history.length > 1) history.back();
      else location.href = fb || 'index.html';
    };
    (document.body||document.documentElement).appendChild(b);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', add);
  else add();
  /* @media print — hide it */
  var st=document.createElement('style'); st.textContent='@media print{#alzBackBtn{display:none!important}}';
  (document.head||document.documentElement).appendChild(st);
})();
