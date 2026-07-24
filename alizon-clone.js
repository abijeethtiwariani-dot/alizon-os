/* ALIZON clone — shared motion: scroll-reveal, count-up, hero carousel, smooth scroll.
   Vanilla, dependency-free, respects prefers-reduced-motion.
   Uses scroll-position checks (not IntersectionObserver) for maximum reliability. */
(function(){
  "use strict";
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- collect reveal targets ---------- */
  var revealSel = '.section-head,.card,.two > div,.two > img,.feature .txt,.feature img,.stat,.cta-band .in';
  var revealEls = [].slice.call(document.querySelectorAll(revealSel)).filter(function(el){
    return !el.closest('.hero');
  });
  if(!RM){
    revealEls.forEach(function(el){ el.classList.add('reveal'); });
    document.querySelectorAll('.grid').forEach(function(g){
      [].slice.call(g.children).forEach(function(c,i){ c.style.transitionDelay = ((i % 4) * 0.09) + 's'; });
    });
  }

  /* ---------- count-up stats ---------- */
  var stats = [].slice.call(document.querySelectorAll('.stat b'));
  stats.forEach(function(b){
    b.setAttribute('data-target', b.textContent.trim());
    if(!RM && /^\d/.test(b.textContent.trim())) b.textContent = '0';
  });
  function countTo(el){
    var m = (el.getAttribute('data-target') || '').match(/^(\d+)(.*)$/);
    if(!m) return;
    var end = parseInt(m[1], 10), suf = m[2] || '';
    if(RM){ el.textContent = end + suf; return; }
    var t0 = null, dur = 1400;
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * end) + suf;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- reliable scroll-position reveal ---------- */
  function vh(){ return window.innerHeight || document.documentElement.clientHeight; }
  function inView(el, frac){
    var r = el.getBoundingClientRect();
    return r.top < vh() * (frac || 0.88) && r.bottom > 0;
  }
  var ticking = false;
  function check(){
    ticking = false;
    for(var i = 0; i < revealEls.length; i++){
      var el = revealEls[i];
      if(!el.classList.contains('in') && inView(el)) el.classList.add('in');
    }
    for(var j = 0; j < stats.length; j++){
      var b = stats[j];
      if(!b._counted && inView(b, 0.96)){ b._counted = true; countTo(b); }
    }
  }
  var lastRun = 0;
  function onScroll(){
    var now = Date.now ? Date.now() : +new Date();
    if(now - lastRun < 60) return;   /* lightweight time throttle, no rAF dependency */
    lastRun = now;
    check();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', check);
  document.addEventListener('DOMContentLoaded', check);
  check();
  /* re-check shortly after load in case images shift the layout */
  setTimeout(check, 150);
  setTimeout(check, 700);
  setTimeout(check, 1600);
  /* failsafe: content must never stay hidden even if something goes wrong */
  setTimeout(function(){
    revealEls.forEach(function(el){ el.classList.add('in'); });
    stats.forEach(function(b){ if(!b._counted){ b._counted = true; countTo(b); } });
  }, 4500);

  /* ---------- hero carousel (data-slides="url|url|url") ---------- */
  document.querySelectorAll('.hero[data-slides]').forEach(function(hero){
    var urls = hero.getAttribute('data-slides').split('|').map(function(s){ return s.trim(); }).filter(Boolean);
    var base = hero.querySelector('.bg');
    if(urls.length < 2 || !base) return;
    var layers = urls.map(function(u, i){
      var im = (i === 0) ? base : base.cloneNode(false);
      im.src = u; im.style.opacity = (i === 0) ? '1' : '0';
      if(i > 0) base.parentNode.insertBefore(im, base.nextSibling);
      return im;
    });
    var dots = document.createElement('div'); dots.className = 'hero-dots';
    var btns = urls.map(function(_, i){
      var b = document.createElement('button');
      b.className = (i === 0) ? 'on' : '';
      b.setAttribute('aria-label', 'Show slide ' + (i + 1));
      dots.appendChild(b); return b;
    });
    hero.appendChild(dots);
    var cur = 0, timer;
    function go(n){
      if(n === cur) return;
      layers[cur].style.opacity = '0'; btns[cur].className = '';
      cur = n;
      layers[cur].style.opacity = '1'; btns[cur].className = 'on';
    }
    btns.forEach(function(b, i){ b.addEventListener('click', function(){ go(i); restart(); }); });
    function restart(){ if(RM) return; clearInterval(timer); timer = setInterval(function(){ go((cur + 1) % urls.length); }, 5500); }
    restart();
  });
  /* subtle ken-burns on single-image heroes */
  document.querySelectorAll('.hero:not([data-slides]) .bg').forEach(function(b){ if(!RM) b.classList.add('kb'); });

  /* ---------- smooth in-page anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length < 2) return;
      var t = document.querySelector(id);
      if(t){ e.preventDefault(); t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); }
    });
  });
})();
