/* ALIZON — Home "Upcoming Events" band, auto-populated from alizonWorkshops.
   Renders up to 4 upcoming workshops into #evgrid; hides #events if none.
   Include on the home page: <script src="alizon-events.js" defer></script> */
(function () {
  "use strict";
  var grid = document.getElementById("evgrid");
  if (!grid) return;
  var section = document.getElementById("events");

  function U(id){ return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=800&q=70"; }
  var POOL = ["1579165466741-7f35e4755660","1524178232363-1fb2b075b655","1522202176988-66273c2fd55f","1434030216411-0b793f4b4173"];
  function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function load(){ try{ var a=JSON.parse(localStorage.getItem("alizonWorkshops")||"[]"); return Array.isArray(a)?a:[]; }catch(e){ return []; } }

  /* no per-workshop image field yet → pick a fitting stock photo by category */
  function imgFor(w,i){
    if(w.img) return w.img;
    var k=(w.kind||"").toLowerCase();
    if(/master/.test(k)) return U("1551288049-bebda4e38f71");
    if(/workshop/.test(k)) return U("1579165466741-7f35e4755660");
    if(/boot|seminar/.test(k)) return U("1524178232363-1fb2b075b655");
    return U(POOL[i % POOL.length]);
  }
  function fmtTime(t){
    if(!t) return "";
    var p=String(t).split(":"); var h=parseInt(p[0],10); if(isNaN(h)) return "";
    var m=(p[1]||"00"); var ap=h<12?"AM":"PM"; var h12=(h%12)||12;
    return h12+":"+m+" "+ap+" IST";
  }
  function badge(dstr){
    var d=new Date(dstr+"T00:00:00"); if(isNaN(d.getTime())) return "";
    return '<span class="evdate"><span class="m">'+d.toLocaleString("en",{month:"short"}).toUpperCase()+
      '</span><span class="d">'+d.getDate()+"</span></span>";
  }
  function render(){
    var all=load().filter(function(w){ return w && w.on!==false && w.date; });
    all.sort(function(a,b){ return a.date<b.date?-1:(a.date>b.date?1:0); });
    var today=new Date().toISOString().slice(0,10);
    var up=all.filter(function(w){ return w.date>=today; });
    var show=(up.length?up:all).slice(0,4);
    if(!show.length){ if(section) section.style.display="none"; return; }
    if(section) section.style.display="";
    grid.innerHTML=show.map(function(w,i){
      var meta=fmtTime(w.timeStart) || (w.mode?esc(w.mode):"");
      return '<a class="evcard" href="alizon-workshops.html#regdesk">'+
        '<div class="evimg"><img src="'+esc(imgFor(w,i))+'" alt="" loading="lazy">'+badge(w.date)+"</div>"+
        '<div class="evbody">'+
          '<div class="evkick">'+esc((w.kind||"Workshop").toUpperCase())+"</div>"+
          '<h3 class="evttl">'+esc(w.title||"Workshop")+"</h3>"+
          '<p class="evdesc">'+esc(w.desc||"")+"</p>"+
          '<div class="evtime">'+meta+"</div>"+
        "</div></a>";
    }).join("");
  }
  render();
  /* re-render when the synced data lands (firebase-sync) or another tab updates it */
  window.addEventListener("storage", function(e){ if(e.key==="alizonWorkshops") render(); });
  setTimeout(render, 900); setTimeout(render, 2400);
})();
