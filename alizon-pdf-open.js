/* alizon-pdf-open.js
   Opens PDFs stored as chunked Firestore docs (sync/xdfile_<id>_<n>).
   Any element with data-xf (id), data-xfn (chunk count), data-xfname (filename)
   becomes clickable to open/download the PDF. Include on any page that shows
   practical reports with attachments (faculty portal, dashboard, practical pages).
   Requires firebase-sync.js (provides firebase + auth).
*/
(function(){
  if(window.__alizonPdfOpen) return; window.__alizonPdfOpen=1;
  function whenAuthed(cb,tries){ tries=tries||0;
    try{ if(window.firebase&&firebase.auth&&firebase.auth().currentUser){ cb(true); return; } }catch(e){}
    if(tries>26){ cb(false); return; }
    setTimeout(function(){ whenAuthed(cb,tries+1); },400);
  }
  document.addEventListener('click',function(ev){
    var b=ev.target && ev.target.closest ? ev.target.closest('[data-xf]') : null;
    if(!b || b.disabled) return;
    ev.preventDefault();
    var id=b.getAttribute('data-xf'), n=parseInt(b.getAttribute('data-xfn'),10)||1, name=b.getAttribute('data-xfname')||'document.pdf';
    var w=null; try{ w=window.open('about:blank','_blank'); }catch(e){}
    b.disabled=true; var old=b.textContent; b.textContent='Loading…';
    whenAuthed(function(ok){
      if(!ok||!window.firebase||!firebase.firestore){ b.disabled=false; b.textContent=old; if(w)w.close(); alert('Could not connect to the document store. Please try again.'); return; }
      var db=firebase.firestore(); var gets=[];
      for(var i=0;i<n;i++) gets.push(db.collection('sync').doc('xdfile_'+id+'_'+i).get());
      Promise.all(gets).then(function(snaps){
        var b64=snaps.map(function(s){ return (s.exists&&s.data()&&s.data().value)||''; }).join('');
        if(!b64) throw new Error('empty');
        var bin=atob(b64), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++) bytes[j]=bin.charCodeAt(j);
        var url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
        if(w){ w.location=url; } else { var a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
        b.disabled=false; b.textContent=old;
      }).catch(function(){ b.disabled=false; b.textContent=old; if(w)w.close(); alert('Could not load the PDF. Please try again.'); });
    });
  });
})();
