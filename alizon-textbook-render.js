/* alizon-textbook-render.js
   The single parser and renderer for Alizon textbooks, shared by the authoring
   studio (alizon-textbook.html) and the student library (alizon-library.html).
   Kept in one file on purpose: two copies of a markup parser drift, and then a
   book reads differently to the student than it looked to the author.

   window.AlizonBook = { parse, renderChapter, BOX_LABEL }
*/
(function(){
'use strict';
if(window.AlizonBook) return;

function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
/* inline markup, applied AFTER escaping so pasted text can never inject HTML */
function inl(s){
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g,'$1<i>$2</i>')
    .replace(/`([^`]+)`/g,'<code>$1</code>');
}

var BOX_KINDS={objectives:'obj', know:'know', activity:'activity', note:'note', caution:'caution',
               summary:'summary', keyterms:'keyterms', quote:'quote'};
var BOX_LABEL={obj:'Learning outcomes', know:'Did you know?', activity:'Activity',
               note:'Note', caution:'Caution', summary:'What we have learnt',
               keyterms:'Key terms', quote:''};

/* ---------------- parser ---------------- */
function parse(text){
  var lines=String(text||'').replace(/\r/g,'').split('\n');
  var chapters=[], cur=null, buf=[], box=null, tbl=null;

  function flushPara(){
    if(!buf.length) return;
    var joined=buf.join('\n'); buf=[];
    var target = box ? box.body : (cur ? cur.blocks : null);
    if(!target) return;
    joined.split(/\n{2,}/).forEach(function(chunk){
      var ls=chunk.split('\n').filter(function(l){ return l.trim()!==''; });
      if(!ls.length) return;
      if(ls.every(function(l){ return /^\s*[-*]\s+/.test(l); })){
        target.push({t:'ul', items:ls.map(function(l){ return l.replace(/^\s*[-*]\s+/,''); })});
      } else if(ls.every(function(l){ return /^\s*\d+[.)]\s+/.test(l); })){
        target.push({t:'ol', items:ls.map(function(l){ return l.replace(/^\s*\d+[.)]\s+/,''); })});
      } else if(ls.length>1 && ls.some(function(l){ return /^Q\s*[:.)]/i.test(l); })){
        /* Consecutive lines normally join into one paragraph. Inside an exercise
           each "Q:" is a separate question, so keep them apart. */
        ls.forEach(function(l){ target.push({t:'p', text:l.trim()}); });
      } else if(box && box.kind==='keyterms' && ls.every(function(l){ return /^[^:]{1,60}:\s*.+/.test(l); })){
        target.push({t:'dl', items:ls.map(function(l){ var i=l.indexOf(':'); return [l.slice(0,i), l.slice(i+1).trim()]; })});
      } else {
        target.push({t:'p', text:ls.join(' ')});
      }
    });
  }
  function closeBox(){ flushPara(); if(box && cur) cur.blocks.push(box); box=null; }
  function closeTable(){ if(!tbl) return; if(cur && tbl.rows.length) cur.blocks.push(tbl); tbl=null; }
  function ensureChapter(){ if(!cur){ cur={title:'Untitled chapter', blocks:[]}; chapters.push(cur); } }

  for(var i=0;i<lines.length;i++){
    var raw=lines[i], line=raw.trim();

    if(tbl){
      if(line==='' || line.charAt(0)==='@'){ closeTable(); }
      else { tbl.rows.push(line.split('|').map(function(c){ return c.trim(); })); continue; }
    }

    if(line.charAt(0)==='@'){
      var m=/^@([a-zA-Z]+)\s*(.*)$/.exec(line);
      if(!m){ buf.push(raw); continue; }
      var tag=m[1].toLowerCase(), rest=m[2].trim();

      if(tag==='chapter'){ closeBox(); cur={title:rest||'Untitled chapter', blocks:[]}; chapters.push(cur); continue; }
      if(tag==='section'){ closeBox(); ensureChapter(); cur.blocks.push({t:'sec', text:rest}); continue; }
      if(tag==='subsection'){ closeBox(); ensureChapter(); cur.blocks.push({t:'sub', text:rest}); continue; }
      if(tag==='figure'){
        closeBox(); ensureChapter();
        var parts=rest.split('|'), srcv=(parts[0]||'').trim(), cap=(parts.slice(1).join('|')||'').trim();
        if(srcv && !cap && !/\.(png|jpe?g|gif|svg|webp)$/i.test(srcv) && srcv.indexOf('data:')!==0){ cap=srcv; srcv=''; }
        cur.blocks.push({t:'fig', src:srcv, cap:cap}); continue;
      }
      if(tag==='diagram'){
        closeBox(); ensureChapter();
        var dm=/^(\w+)\s*([\s\S]*)$/.exec(rest)||[null,'flow',''];
        cur.blocks.push({t:'dia', kind:(dm[1]||'flow').toLowerCase(), spec:dm[2]||''});
        continue;
      }
      if(tag==='table'){ closeBox(); ensureChapter(); tbl={t:'table', cap:rest, rows:[]}; continue; }
      if(tag==='exercise'){ closeBox(); ensureChapter(); cur.blocks.push({t:'exstart', text:rest||'Exercises'}); continue; }
      if(tag==='pagebreak'){ closeBox(); ensureChapter(); cur.blocks.push({t:'pb'}); continue; }
      if(BOX_KINDS[tag]){ closeBox(); ensureChapter(); box={t:'box', kind:BOX_KINDS[tag], title:rest, body:[]}; continue; }
      buf.push(raw); continue;    /* unknown directive → keep as text, never lose it */
    }

    if(line===''){ flushPara(); continue; }
    ensureChapter();
    buf.push(raw);
  }
  closeTable(); closeBox(); flushPara();
  return chapters;
}

/* ============================================================
   DIAGRAMS
   Inline SVG built from one line of text. Chosen over images because a
   diagram costs ~1 KB instead of ~200 KB — which matters when a whole
   book must fit inside one 1 MB Firestore document — and because vector
   art stays sharp in print and recolours itself for night mode.
     @diagram flow Prescribe > Verify > Dispense > Counsel
     @diagram cycle Plan > Do > Check > Act
     @diagram steps Collect the data > Clean it > Model it
     @diagram bar Rural 34 > Urban 68 > Tertiary 91
     @diagram pyramid Population > At risk > Diagnosed > Treated
     @diagram timeline 1972 MYCIN > 2011 Watson > 2020 AlphaFold
     @diagram compare Rule-based | Learning ; Explains itself | Often opaque
   Any type may be followed by "| Caption".
   ============================================================ */
var DIA_C={ink:'#141210', line:'#c9c2bb', crimson:'#b1040e', soft:'#fdf3f3', muted:'#5f5a54', alt:'#f7f4f1'};

function wrapText(s, per){
  var words=String(s).split(/\s+/), out=[], cur='';
  words.forEach(function(w){
    if((cur+' '+w).trim().length>per){ if(cur) out.push(cur); cur=w; } else { cur=(cur?cur+' ':'')+w; }
  });
  if(cur) out.push(cur);
  return out;
}
function svgLines(lines, x, y, lh, cls){
  return lines.map(function(t,i){
    return '<text x="'+x+'" y="'+(y+i*lh)+'" class="'+cls+'">'+esc(t)+'</text>';
  }).join('');
}

function diagram(kind, spec){
  var parts=String(spec||'').split('|');
  var cap='';
  /* "compare" uses | as a column separator, so only other types take a caption that way */
  if(kind!=='compare' && parts.length>1){ spec=parts[0]; cap=parts.slice(1).join('|').trim(); }
  var items=String(spec).split('>').map(function(s){ return s.trim(); }).filter(Boolean);

  var W=560, H=160, body='';
  var CSS='<style>'
    +'.dg-t{font-family:Inter,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:12px;fill:'+DIA_C.ink+'}'
    +'.dg-s{font-family:Inter,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:10.5px;fill:'+DIA_C.muted+'}'
    +'.dg-n{font-family:Inter,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:12px;font-weight:800;fill:'+DIA_C.crimson+'}'
    +'.dg-w{font-family:Inter,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:11.5px;font-weight:700;fill:#fff}'
    +'</style>';

  if(kind==='flow' || kind==='steps'){
    var n=Math.max(1,items.length), gap=14;
    var bw=Math.floor((W-gap*(n-1))/n), bh=64;
    H=bh+26;
    items.forEach(function(it,i){
      var x=i*(bw+gap), lines=wrapText(it, Math.max(10, Math.floor(bw/6.4))).slice(0,3);
      var ty=bh/2 - (lines.length-1)*7 + 4;
      body+='<rect x="'+x+'" y="0" width="'+bw+'" height="'+bh+'" rx="9" fill="'+DIA_C.soft+'" stroke="'+DIA_C.crimson+'" stroke-opacity=".35"/>';
      if(kind==='steps') body+='<circle cx="'+(x+15)+'" cy="15" r="9.5" fill="'+DIA_C.crimson+'"/><text x="'+(x+15)+'" y="19" text-anchor="middle" class="dg-w">'+(i+1)+'</text>';
      body+=lines.map(function(t,k){ return '<text x="'+(x+bw/2)+'" y="'+(ty+k*14)+'" text-anchor="middle" class="dg-t">'+esc(t)+'</text>'; }).join('');
      if(i<n-1){
        var ax=x+bw+2, ay=bh/2;
        body+='<path d="M'+ax+' '+ay+' L'+(ax+gap-4)+' '+ay+'" stroke="'+DIA_C.crimson+'" stroke-width="1.6"/>'
             +'<path d="M'+(ax+gap-4)+' '+ay+' l-4.5 -3.4 v6.8 z" fill="'+DIA_C.crimson+'"/>';
      }
    });
  }
  else if(kind==='cycle'){
    W=430; H=300;
    var cx=215, cy=142, R=104, n2=Math.max(1,items.length);
    body+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="'+DIA_C.line+'" stroke-dasharray="4 5"/>';
    items.forEach(function(it,i){
      var a=(-90 + i*360/n2)*Math.PI/180;
      var x=cx+R*Math.cos(a), y=cy+R*Math.sin(a);
      var lines=wrapText(it,14).slice(0,2);
      body+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="34" fill="'+DIA_C.soft+'" stroke="'+DIA_C.crimson+'" stroke-opacity=".45"/>';
      body+=lines.map(function(t,k){
        return '<text x="'+x.toFixed(1)+'" y="'+(y-(lines.length-1)*6+k*13+4).toFixed(1)+'" text-anchor="middle" class="dg-t">'+esc(t)+'</text>';
      }).join('');
      /* arrow to the next node, drawn along the circle */
      var a2=(-90 + (i+1)*360/n2)*Math.PI/180, mid=(a+a2)/2;
      var mx=cx+(R+0)*Math.cos(mid), my=cy+(R+0)*Math.sin(mid);
      var rot=(mid*180/Math.PI)+90;
      body+='<path d="M'+mx.toFixed(1)+' '+my.toFixed(1)+' l-5 -3.6 v7.2 z" fill="'+DIA_C.crimson+'" transform="rotate('+rot.toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1)+')"/>';
    });
  }
  else if(kind==='bar'){
    var rows=items.map(function(it){
      var m=/^(.*?)[\s:]+(-?\d+(?:\.\d+)?)\s*$/.exec(it);
      return m ? {l:m[1].trim(), v:parseFloat(m[2])} : {l:it, v:0};
    });
    var max=Math.max.apply(null, rows.map(function(r){ return r.v; }).concat([1]));
    var rh=30, lw=150, bw2=W-lw-52;
    H=rows.length*rh+8;
    rows.forEach(function(r,i){
      var y=i*rh, w=Math.max(2, r.v/max*bw2);
      body+='<text x="0" y="'+(y+19)+'" class="dg-t">'+esc(r.l)+'</text>'
         +'<rect x="'+lw+'" y="'+(y+6)+'" width="'+bw2+'" height="17" rx="3.5" fill="'+DIA_C.alt+'"/>'
         +'<rect x="'+lw+'" y="'+(y+6)+'" width="'+w.toFixed(1)+'" height="17" rx="3.5" fill="'+DIA_C.crimson+'" fill-opacity=".82"/>'
         +'<text x="'+(lw+bw2+8)+'" y="'+(y+19)+'" class="dg-n">'+esc(r.v)+'</text>';
    });
  }
  else if(kind==='pyramid'){
    var n3=Math.max(1,items.length), rh2=44, topW=140;
    H=n3*rh2+8; W=520;
    items.forEach(function(it,i){
      var wTop=topW+(W-topW-40)*(i/n3), wBot=topW+(W-topW-40)*((i+1)/n3);
      var y=i*rh2, cxp=W/2;
      body+='<path d="M'+(cxp-wTop/2)+' '+y+' L'+(cxp+wTop/2)+' '+y+' L'+(cxp+wBot/2)+' '+(y+rh2-5)+' L'+(cxp-wBot/2)+' '+(y+rh2-5)+' z" '
        +'fill="'+DIA_C.crimson+'" fill-opacity="'+(0.16+i*0.13).toFixed(2)+'" stroke="'+DIA_C.crimson+'" stroke-opacity=".4"/>'
        +'<text x="'+cxp+'" y="'+(y+rh2/2+2)+'" text-anchor="middle" class="dg-t">'+esc(it)+'</text>';
    });
  }
  else if(kind==='timeline'){
    var n4=Math.max(1,items.length);
    W=560; H=118;
    var y0=56, step=n4>1?(W-60)/(n4-1):0;
    body+='<line x1="14" y1="'+y0+'" x2="'+(W-14)+'" y2="'+y0+'" stroke="'+DIA_C.line+'" stroke-width="2"/>';
    items.forEach(function(it,i){
      var x=30+i*step;
      var m=/^(\S+)\s+([\s\S]*)$/.exec(it) || [null, it, ''];
      var lines=wrapText(m[2]||'', 16).slice(0,2);
      /* the outermost labels are centred on a node near the edge, so they would
         run off the artboard — anchor the first left and the last right */
      var anchor = (n4>1 && i===0) ? 'start' : (n4>1 && i===n4-1) ? 'end' : 'middle';
      var tx = anchor==='start' ? 8 : anchor==='end' ? W-8 : x;
      body+='<circle cx="'+x.toFixed(1)+'" cy="'+y0+'" r="6.5" fill="'+DIA_C.crimson+'"/>'
         +'<text x="'+(+tx).toFixed(1)+'" y="'+(y0-16)+'" text-anchor="'+anchor+'" class="dg-n">'+esc(m[1])+'</text>'
         +lines.map(function(t,k){ return '<text x="'+(+tx).toFixed(1)+'" y="'+(y0+24+k*13)+'" text-anchor="'+anchor+'" class="dg-s">'+esc(t)+'</text>'; }).join('');
    });
  }
  else if(kind==='compare'){
    var rows2=String(spec).split(';').map(function(r){ return r.split('|').map(function(c){ return c.trim(); }); }).filter(function(r){ return r.length>1; });
    if(!rows2.length) rows2=[['—','—']];
    var rh3=34, colW=(W-8)/2;
    H=rows2.length*rh3+6;
    rows2.forEach(function(r,i){
      var y=i*rh3, head=(i===0);
      [0,1].forEach(function(c){
        var x=c*(colW+8);
        body+='<rect x="'+x+'" y="'+y+'" width="'+colW+'" height="'+(rh3-6)+'" rx="7" '
          +'fill="'+(head?DIA_C.crimson:(c===0?DIA_C.soft:DIA_C.alt))+'" '
          +(head?'':'stroke="'+DIA_C.line+'"')+'/>';
        var lines=wrapText(r[c]||'', Math.floor(colW/6.2)).slice(0,2);
        body+=lines.map(function(t,k){
          return '<text x="'+(x+colW/2)+'" y="'+(y+(rh3-6)/2 - (lines.length-1)*6 + k*13 + 4)+'" text-anchor="middle" class="'+(head?'dg-w':'dg-t')+'">'+esc(t)+'</text>';
        }).join('');
      });
    });
  }
  else {
    return {svg:'<div class="ph">Unknown diagram type “'+esc(kind)+'”</div>', cap:cap};
  }

  var svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg">'
    +CSS+body+'</svg>';
  return {svg:svg, cap:cap};
}

/* ---------------- renderer ---------------- */
function el(html){ var d=document.createElement('div'); d.innerHTML=String(html).trim(); return d.firstChild; }

/* Returns a flat list of {node, newPage?, forceBreak?, keepNext?, toc?} so the
   studio can flow them into A4 pages and the reader can simply append them. */
function renderChapter(ch, cn){
  var out=[], secN=0, subN=0, figN=0, tabN=0, inEx=false, exItems=null;

  out.push({node:el('<div class="chopen"><h2 class="chapnum">Chapter '+cn+'</h2><h1 class="chaptitle">'+inl(ch.title)+'</h1></div>'),
            newPage:true, toc:{lvl:1, no:String(cn), text:ch.title}});

  function flushEx(){
    if(!exItems) return;
    out.push({node:el('<div class="exwrap"><span class="bt">'+esc(inEx)+'</span><ol>'
      +exItems.map(function(q){ return '<li>'+inl(q)+'</li>'; }).join('')+'</ol></div>')});
    exItems=null; inEx=false;
  }
  function bodyHtml(blocks){
    return blocks.map(function(b){
      if(b.t==='p')  return '<p>'+inl(b.text)+'</p>';
      if(b.t==='ul') return '<ul>'+b.items.map(function(x){return '<li>'+inl(x)+'</li>';}).join('')+'</ul>';
      if(b.t==='ol') return '<ol>'+b.items.map(function(x){return '<li>'+inl(x)+'</li>';}).join('')+'</ol>';
      if(b.t==='dl') return '<dl>'+b.items.map(function(x){return '<dt>'+inl(x[0])+'</dt><dd>'+inl(x[1])+'</dd>';}).join('')+'</dl>';
      return '';
    }).join('');
  }

  ch.blocks.forEach(function(b){
    if(b.t==='exstart'){ flushEx(); inEx=b.text; exItems=[]; return; }
    if(inEx && b.t==='p'){ exItems.push(b.text.replace(/^Q\s*[:.)]\s*/i,'')); return; }
    if(inEx && (b.t==='ul'||b.t==='ol')){ b.items.forEach(function(x){ exItems.push(x); }); return; }
    if(inEx) flushEx();

    if(b.t==='sec'){
      secN++; subN=0;
      out.push({node:el('<h3 class="sec" id="s'+cn+'-'+secN+'">'+cn+'.'+secN+'&nbsp;&nbsp;'+inl(b.text)+'</h3>'),
                keepNext:true, toc:{lvl:2, no:cn+'.'+secN, text:b.text, id:'s'+cn+'-'+secN}});
      return;
    }
    if(b.t==='sub'){
      subN++;
      out.push({node:el('<h4 class="sub">'+cn+'.'+secN+'.'+subN+'&nbsp;&nbsp;'+inl(b.text)+'</h4>'), keepNext:true});
      return;
    }
    if(b.t==='p'){  out.push({node:el('<p>'+inl(b.text)+'</p>')}); return; }
    if(b.t==='ul'){ out.push({node:el('<ul>'+b.items.map(function(x){return '<li>'+inl(x)+'</li>';}).join('')+'</ul>')}); return; }
    if(b.t==='ol'){ out.push({node:el('<ol>'+b.items.map(function(x){return '<li>'+inl(x)+'</li>';}).join('')+'</ol>')}); return; }
    if(b.t==='pb'){ out.push({node:el('<div></div>'), forceBreak:true}); return; }

    if(b.t==='fig'){
      figN++;
      var inner = b.src ? '<img src="'+esc(b.src)+'" alt="">'
                        : '<div class="ph">Figure placeholder</div>';
      out.push({node:el('<figure>'+inner+'<figcaption><b>Fig. '+cn+'.'+figN+'</b>&nbsp; '+inl(b.cap||'')+'</figcaption></figure>')});
      return;
    }
    if(b.t==='dia'){
      figN++;
      var d=diagram(b.kind, b.spec);
      out.push({node:el('<figure class="dia">'+d.svg
        +'<figcaption><b>Fig. '+cn+'.'+figN+'</b>&nbsp; '+inl(d.cap||'')+'</figcaption></figure>')});
      return;
    }
    if(b.t==='table'){
      tabN++;
      var rows=b.rows.slice(), head=rows.shift()||[];
      var th='<tr>'+head.map(function(c){return '<th>'+inl(c)+'</th>';}).join('')+'</tr>';
      var td=rows.map(function(r){ return '<tr>'+r.map(function(c){return '<td>'+inl(c)+'</td>';}).join('')+'</tr>'; }).join('');
      out.push({node:el('<div class="tblwrap"><table class="bk">'+th+td+'</table></div>'), keepNext:true});
      out.push({node:el('<div class="tcap"><b>Table '+cn+'.'+tabN+'</b>&nbsp; '+inl(b.cap||'')+'</div>')});
      return;
    }
    if(b.t==='box'){
      var label = b.title || BOX_LABEL[b.kind] || '';
      out.push({node:el('<div class="box '+b.kind+'">'+(label?'<span class="bt">'+esc(label)+'</span>':'')+bodyHtml(b.body)+'</div>')});
      return;
    }
  });
  flushEx();
  return out;
}

window.AlizonBook={ parse:parse, renderChapter:renderChapter, BOX_LABEL:BOX_LABEL, esc:esc, inl:inl };
})();
