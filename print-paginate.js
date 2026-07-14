/* ============================================================
   ALIZON OS — shared multi-page print paginator
   Splits a single rendered document element into real A4 pages
   for printing: repeats the letterhead header + footer on every
   page, keeps content clear of the footer, and stamps
   "Page X of Y". Used by every portal that prints a letterhead.

   Usage at print time (instead of window.print()):
     LHPrint(document.getElementById('paper'), {
       headerEnd : '.lh-rule',        // last element of the repeating header
       footer    : '.doc-footer',     // footer element (page no. appended)
       flatten   : ['.doc-body'],     // containers whose children may split across pages
       repeat    : ['.watermark']     // absolute elements redrawn on every page
     });
   ============================================================ */
(function(){
  function injectStyle(){
    if(document.getElementById('lhp-style')) return;
    var st=document.createElement('style'); st.id='lhp-style';
    st.textContent=
      '.lhp-page{height:296mm!important;min-height:0!important;display:flex!important;'+
        'flex-direction:column!important;overflow:hidden!important;position:relative}'+
      '.lhp-body{flex:1 1 auto;min-height:0;overflow:hidden;position:relative}'+
      '.lhp-head,.lhp-foot{flex:0 0 auto}'+
      '.lhp-pno{font-family:Arial,Helvetica,system-ui,sans-serif;font-size:9px;text-align:center;'+
        'color:#8a8082;letter-spacing:.05em;margin-top:5px}'+
      '#lhp-print{position:fixed;left:-99999px;top:0}'+
      '@media print{'+
        'body>*{display:none!important}'+
        '#lhp-print{display:block!important;position:static!important;left:auto!important}'+
        '#lhp-print .lhp-page{box-shadow:none!important;margin:0 auto!important;'+
          'break-after:page;page-break-after:always}'+
        '#lhp-print .lhp-page:last-child{break-after:auto;page-break-after:auto}'+
      '}';
    document.head.appendChild(st);
  }

  window.LHPrint=function(source, opts){
    if(!source){ window.print(); return; }
    opts=opts||{};
    var flatten=opts.flatten||['.doc-body','.body'];
    var repeatSel=opts.repeat||[];
    var pageNo=opts.pageNumbers!==false;
    var buffer=opts.buffer||12;
    injectStyle();

    var kids=Array.prototype.slice.call(source.children);
    var matches=function(el,sel){ return el && el.matches && el.matches(sel); };
    var repeatNodes=kids.filter(function(k){ return repeatSel.some(function(s){return matches(k,s);}); });
    var hEnd=opts.headerEnd?kids.findIndex(function(k){return matches(k,opts.headerEnd);}):-1;
    var headerNodes=hEnd>=0?kids.slice(0,hEnd+1).filter(function(k){return repeatNodes.indexOf(k)<0;}):[];
    var footerNode=opts.footer?source.querySelector(':scope > '+opts.footer):null;
    var skip={}; repeatNodes.concat(headerNodes).forEach(function(n){ skip[kids.indexOf(n)]=1; });
    if(footerNode) skip[kids.indexOf(footerNode)]=1;
    var bodyNodes=kids.filter(function(k,i){ return !skip[i]; });

    var blocks=[];
    bodyNodes.forEach(function(n){
      if(flatten.some(function(s){return matches(n,s);}) && n.children.length){
        Array.prototype.slice.call(n.children).forEach(function(c){
          var w=n.cloneNode(false); w.appendChild(c.cloneNode(true)); blocks.push(w.outerHTML);
        });
      } else blocks.push(n.outerHTML);
    });
    var headerHTML=headerNodes.map(function(n){return n.outerHTML;}).join('');
    var footerHTML=footerNode?footerNode.outerHTML:'';
    var repeatHTML=repeatNodes.map(function(n){return n.outerHTML;}).join('');
    var cls=source.className;

    /* measure available body height on a real (hidden) A4 page */
    var mp=document.createElement('div'); mp.className=cls+' lhp-page';
    mp.style.cssText='position:absolute;left:-99999px;top:0;visibility:hidden';
    mp.innerHTML=repeatHTML+'<div class="lhp-head">'+headerHTML+'</div>'+
      '<div class="lhp-body" id="__lhpb"></div>'+
      '<div class="lhp-foot">'+footerHTML+(pageNo?'<div class="lhp-pno">Page 1 of 1</div>':'')+'</div>';
    document.body.appendChild(mp);
    var mb=mp.querySelector('#__lhpb');
    mb.innerHTML=blocks.join('');
    var availH=mb.clientHeight-buffer;
    var els=Array.prototype.slice.call(mb.children);
    var pages=[], cur=[], start=els.length?els[0].offsetTop:0;
    els.forEach(function(el,i){
      var bottom=el.offsetTop+el.getBoundingClientRect().height;
      if(cur.length && (bottom-start)>availH){ pages.push(cur); cur=[]; start=el.offsetTop; }
      cur.push(blocks[i]);
    });
    if(cur.length||!pages.length) pages.push(cur);
    mp.parentNode.removeChild(mp);

    var total=pages.length;
    var html=pages.map(function(pg,i){
      return '<div class="'+cls+' lhp-page">'+repeatHTML+
        '<div class="lhp-head">'+headerHTML+'</div>'+
        '<div class="lhp-body">'+pg.join('')+'</div>'+
        '<div class="lhp-foot">'+footerHTML+
          (pageNo?'<div class="lhp-pno">Page '+(i+1)+' of '+total+'</div>':'')+
        '</div></div>';
    }).join('');

    var ov=document.getElementById('lhp-print'); if(ov) ov.parentNode.removeChild(ov);
    ov=document.createElement('div'); ov.id='lhp-print'; ov.innerHTML=html; document.body.appendChild(ov);
    var cleaned=false;
    function done(){ if(cleaned) return; cleaned=true; try{ov.parentNode.removeChild(ov);}catch(e){} window.removeEventListener('afterprint',done); }
    window.addEventListener('afterprint',done);
    window.print();
    setTimeout(done, 2000);
    return total;
  };
})();
