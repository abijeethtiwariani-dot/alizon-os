/* ALIZON OAK — shared OAK-University-style theme + uploadable hero.
   Include with:  <script>window.ALIZON_OAK={root:'#app',mount:'#app',title:'Overview'}</script>
                  <script src="alizon-oak.js"></script>
   root  = selector whose CSS tokens get flipped to the OAK light palette
   mount = selector the hero band is prepended into (first child)         */
(function(){
  if(window.__alizonOak) return; window.__alizonOak=1;
  var cfg = window.ALIZON_OAK || {};
  var R = cfg.root || '#app';
  var MOUNT = cfg.mount || R;
  var TITLE = cfg.title || 'Overview';

  /* ---------- 1) theme + hero CSS (every rule scoped under R) ---------- */
  var css = ([
    '{R}{',
    '--bg:#F3F4F6 !important;--navy:#FFF !important;--navy2:#FFF !important;--navy3:#F5F6F8 !important;',
    '--ink:#1B1D21 !important;--muted:#7E8590 !important;--line:#EAECEF !important;',
    '--crimson:#1B1D21 !important;--crimson-deep:#111317 !important;--crimson-soft:rgba(27,29,33,.06) !important;',
    '--gold:#8C9E2B !important;--gold-soft:rgba(174,197,59,.18) !important;',
    '--pill:#F5F6F8 !important;--glass:#FFFFFF !important;',
    '--success:#12A971 !important;--succ:#12A971 !important;--warn:#C0872A !important;',
    'background:#F3F4F6 !important;color:#1B1D21 !important;}',
    /* surfaces */
    /* kill dark background layers so the canvas reads light */
    '{R} .bgwrap,{R} .vignette,{R} #bg,{R} canvas#bg,{R} .particles{opacity:0 !important;display:none !important}',
    '{R} .topbar,{R} .adm-top,{R} .abar,{R} header.top{background:rgba(255,255,255,.82) !important;border-color:#EAECEF !important;color:#1B1D21 !important}',
    '{R} .aside,{R} .side,{R} .sidebar{background:#fff !important;border-color:#EAECEF !important}',
    '{R} .card,{R} .prog,{R} .apanel,{R} .newprog,{R} .pickbar,{R} .tile,{R} .panel,{R} .lead,{R} .faccard,{R} .modcard{',
    'background:#fff !important;border:1px solid #EAECEF !important;box-shadow:0 1px 2px rgba(16,24,40,.04),0 10px 26px -16px rgba(16,24,40,.14) !important;color:#1B1D21 !important}',
    /* active nav + primary buttons -> near-black */
    '{R} .anavv a.on,{R} .anavv a.active,{R} .anav a.on,{R} .nav a.active,{R} .navv a.active,{R} .side .nav a.active{background:#1B1D21 !important;color:#fff !important;box-shadow:0 6px 16px -8px rgba(27,29,33,.5) !important}',
    '{R} .anavv a.on .aic,{R} .anavv a.on b.cnt{color:#c6e000 !important}',
    '{R} .btn-primary,{R} .primary,{R} .btn.gold,{R} button.save,{R} .savebtn{background:#1B1D21 !important;color:#fff !important;border-color:#1B1D21 !important}',
    '{R} a{color:#3a5a12}',
    /* inputs */
    '{R} input,{R} select,{R} textarea{background:#fff !important;border:1px solid #E3E6EA !important;color:#1B1D21 !important}',
    '{R} input:focus,{R} select:focus,{R} textarea:focus{border-color:#AEC53B !important;box-shadow:0 0 0 3px rgba(174,197,59,.22) !important}',
    /* ---- hero ---- */
    '{R} .oak-hero{position:relative;border-radius:24px;overflow:hidden;margin:0 0 18px}',
    '{R} .oak-hero-bg{position:absolute;inset:0;background:radial-gradient(130% 150% at 80% -30%,rgba(174,197,59,.55),transparent 55%),radial-gradient(90% 130% at 105% 120%,rgba(120,150,180,.45),transparent 60%),linear-gradient(120deg,#c9d3b6,#e9edd9 58%,#e4ebf3)}',
    '{R} .oak-hero-bg:after{content:"ALIZON";position:absolute;right:26px;top:2px;font-weight:800;font-size:64px;letter-spacing:.06em;color:rgba(27,29,33,.06);font-family:"Source Serif Pro",Georgia,serif}',
    '{R} .oak-hero.has-cover .oak-hero-bg{background-size:cover;background-position:center}',
    '{R} .oak-hero.has-cover .oak-hero-bg:after{display:none}',
    '{R} .oak-hero.has-cover .oak-hero-bg:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,18,8,.34),rgba(14,18,8,.12) 46%,rgba(255,255,255,.06))}',
    '{R} .oak-cover-btn{position:absolute;top:12px;right:14px;z-index:4;display:inline-flex;align-items:center;gap:6px;background:rgba(27,29,33,.82);color:#fff;border:0;border-radius:100px;padding:7px 13px;font-size:11.5px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '{R} .oak-cover-btn span{color:#c6e000;font-size:10px}',
    '{R} .oak-cover-rm{position:absolute;top:12px;right:14px;z-index:4;display:none;width:30px;height:30px;border:0;border-radius:50%;background:rgba(27,29,33,.82);color:#fff;font-size:13px;cursor:pointer}',
    '{R} .oak-hero.has-cover .oak-cover-btn{right:52px}',
    '{R} .oak-hero.has-cover .oak-cover-rm{display:grid;place-items:center}',
    '{R} .oak-hero-head{position:relative;padding:16px 18px 0;font-family:"Source Serif Pro",Georgia,serif;font-size:20px;font-weight:800;color:#1B1D21}',
    '{R} .oak-hero.has-cover .oak-hero-head{color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.4)}',
    '{R} .oak-hero-cards{position:relative;display:grid;grid-template-columns:repeat(3,1fr) 1.2fr;gap:13px;padding:14px 16px 16px}',
    '{R} .oak-stat{background:rgba(255,255,255,.78);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);border:1px solid rgba(255,255,255,.7);border-radius:18px;padding:14px 15px;min-height:110px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 30px -18px rgba(16,24,40,.35)}',
    '{R} .oak-stat .t{display:flex;align-items:center;justify-content:space-between}',
    '{R} .oak-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#1B1D21;background:#fff;border-radius:100px;padding:5px 11px;box-shadow:0 2px 6px rgba(16,24,40,.08)}',
    '{R} .oak-chip i{color:#8C9E2B;font-style:normal;font-size:11px}',
    '{R} .oak-stat .b{display:flex;align-items:flex-end;justify-content:space-between}',
    '{R} .oak-num{font-size:34px;font-weight:700;letter-spacing:-.03em;color:#1B1D21;line-height:1}',
    '{R} .oak-arrow{width:32px;height:32px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:14px;color:#1B1D21;box-shadow:0 2px 8px rgba(16,24,40,.14)}',
    '{R} .oak-add{background:linear-gradient(135deg,#e2f277,#c6e000);border-radius:18px;padding:15px;display:flex;flex-direction:column;justify-content:center;gap:10px;box-shadow:0 14px 30px -16px rgba(150,180,0,.55)}',
    '{R} .oak-add b{font-size:14px;color:#2c3300}',
    '{R} .oak-add .r{display:flex;gap:8px;flex-wrap:wrap}',
    '{R} .oak-add a{background:rgba(255,255,255,.9);color:#2c3300;font-weight:600;font-size:11px;border-radius:100px;padding:7px 12px;cursor:pointer;text-decoration:none}',
    '@media(max-width:1000px){{R} .oak-hero-cards{grid-template-columns:1fr 1fr}}'
  ].join('\n')).replace(/\{R\}/g, R);

  var st=document.createElement('style'); st.id='alizonOakStyle'; st.textContent=css;
  document.head.appendChild(st);

  /* ---------- 2) hero markup ---------- */
  function ls(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
  function heroHTML(){
    var s=ls('alizonStudents',[]),f=ls('alizonFaculty',[]),p=ls('alizonPrograms',[]);
    var nS=(Array.isArray(s)&&s.length)||248, nF=(Array.isArray(f)&&f.length)||9, nP=(Array.isArray(p)&&p.length)||4;
    function stat(icon,label,n){return '<div class="oak-stat"><div class="t"><span class="oak-chip"><i>'+icon+'</i> '+label+'</span><span style="color:#9aa0aa">⋯</span></div><div class="b"><b class="oak-num">'+Number(n).toLocaleString()+'</b><span class="oak-arrow">↗</span></div></div>';}
    return '<div class="oak-hero" id="oakHero"><div class="oak-hero-bg" id="oakHeroBg"></div>'+
      '<button class="oak-cover-btn" id="oakCoverBtn"><span>◈</span> Cover photo</button>'+
      '<button class="oak-cover-rm" id="oakCoverRm">✕</button>'+
      '<input type="file" id="oakCoverInput" accept="image/*" style="display:none">'+
      '<div class="oak-hero-head">'+TITLE+'</div>'+
      '<div class="oak-hero-cards">'+
        stat('◗','Students',nS)+stat('❖','Faculty',nF)+stat('▤','Programmes',nP)+
        '<div class="oak-add"><b>Add New Members</b><div class="r"><a>＋ Add Student</a><a>＋ Add Faculty</a></div></div>'+
      '</div></div>';
  }

  /* ---------- 3) cover upload ---------- */
  function applyCover(){
    var hero=document.getElementById('oakHero'),bg=document.getElementById('oakHeroBg');if(!hero||!bg)return;
    var img='';try{img=localStorage.getItem('alizonHeroCover')||'';}catch(e){}
    if(img){bg.style.backgroundImage='url('+img+')';hero.classList.add('has-cover');}
    else{bg.style.backgroundImage='';hero.classList.remove('has-cover');}
  }
  function wireCover(){
    var btn=document.getElementById('oakCoverBtn'),inp=document.getElementById('oakCoverInput'),rm=document.getElementById('oakCoverRm');
    if(!btn||btn.__w)return;btn.__w=1;
    btn.addEventListener('click',function(){inp.click();});
    if(rm)rm.addEventListener('click',function(){try{localStorage.removeItem('alizonHeroCover');}catch(e){}applyCover();});
    inp.addEventListener('change',function(){var file=inp.files&&inp.files[0];if(!file)return;
      var rd=new FileReader();rd.onload=function(){var im=new Image();
        im.onload=function(){var mw=1500,sc=Math.min(1,mw/im.width),w=Math.round(im.width*sc),h=Math.round(im.height*sc);
          var cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(im,0,0,w,h);
          var data;try{data=cv.toDataURL('image/jpeg',0.78);}catch(e){alert('Could not process that image.');return;}
          try{localStorage.setItem('alizonHeroCover',data);}catch(e){alert('Picture too large to save on this device — try a smaller one.');return;}
          applyCover();};
        im.onerror=function(){alert('Could not read that image.');};im.src=rd.result;};
      rd.readAsDataURL(file);inp.value='';});
  }

  function mount(){
    var host=document.querySelector(MOUNT); if(!host) return;
    if(document.getElementById('oakHero')) { applyCover(); return; }
    var wrap=document.createElement('div'); wrap.innerHTML=heroHTML();
    host.insertBefore(wrap.firstChild, host.firstChild);
    wireCover(); applyCover();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,80);});
  else setTimeout(mount,80);
  /* re-mount after login screens reveal the app */
  setTimeout(mount,1200); setTimeout(mount,2600);
  window.AlizonOak={mount:mount,applyCover:applyCover};
})();
