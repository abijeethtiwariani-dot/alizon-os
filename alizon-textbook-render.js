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
