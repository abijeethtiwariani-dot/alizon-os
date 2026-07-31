/* ============================================================
   ALIZON OS — shared CMS bridge (alizon-cms.js)
   Loaded by alizon-home.html (applies overrides) AND
   admin-portal.html (uses the fields map to build the editor).

   Storage: localStorage key "alizonContent" = JSON object
   { "<fieldKey>": "<override text>", ... }
   firebase-sync.js propagates that key across devices; this
   script re-applies on the cross-tab 'storage' event.

   Public API: window.__alizonCMS = { fields, get, set, apply }
   All DOM work is guarded — safe on pages where selectors
   do not exist (e.g. the admin portal).
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'alizonContent';

  /* ----------------------------------------------------------
     Field map.
     key       kebab-case id stored in alizonContent
     label     human label for the admin editor
     sel       CSS selector on the home page
     idx       which match of sel (default 0)
     area      grouping label for the admin editor
     multiline true => render a <textarea> in the admin editor
     part      'text' => edit only the first non-empty TEXT NODE
               of the element (used so <span class="accent"> and
               the ✓ dot spans inside headings/bullets survive;
               the accent half of each heading is its own field)
     ---------------------------------------------------------- */
  var fields = [
    /* ---- Hero ---- */

    /* ---- Stat strip (4 numbers + 4 labels) ---- */

    /* ---- Programmes section ---- */


    /* ---- Practicals feature ---- */

    /* ---- Aliz feature ---- */

    /* ---- Assessment ---- */

    /* ---- CTA block + footer ---- */

    /* ================================================================
       ACADEMICS PAGE (alizon-academics.html).
       These selectors are unique IDs that exist ONLY on the academics
       page, so apply() is a no-op on the home page and admin portal.
       The academics page has its own tiny applier (it must NOT load
       this file — the home '.hero h1' etc. selectors would clash).
       def = current hard-coded text, shown as a placeholder hint in
       the admin editor when no override is stored.
       ================================================================ */
    { key: 'acad-hero-ey',    label: 'Hero — eyebrow',   sel: '#acHeroEy', idx:0, area:'Academics — Hero', def:'Academics' },
    { key: 'acad-hero-title', label: 'Hero — title',     sel: '#acHeroTitle', idx:0, area:'Academics — Hero', def:'Academics at Alizon' },
    { key: 'acad-hero-lead',  label: 'Hero — subtitle',  sel: '#acHeroLead', idx:0, area:'Academics — Hero', multiline:true, def:'Discover world-class programmes in healthcare, artificial intelligence and digital medicine.' },
    { key: 'acad-hero-cta',   label: 'Hero — scroll button label', sel:'#acHeroCta', idx:0, area:'Academics — Hero', def:'Explore Academics' },
    { key: 'acad-hero-img-url', label: 'Hero — photo URL (optional; or use the uploader in Page hero images)', sel:'#x-acad-hero', idx:0, area:'Academics — Hero', def:'' },

    { key: 'acad-intro-ey', label: 'Intro — eyebrow',   sel:'#acIntroEy', idx:0, area:'Academics — Intro', def:'Explore Academics' },
    { key: 'acad-intro-h',  label: 'Intro — heading',   sel:'#acIntroH', idx:0, area:'Academics — Intro', def:'Explore Academics at Alizon' },
    { key: 'acad-intro-p',  label: 'Intro — paragraph', sel:'#acIntroP', idx:0, area:'Academics — Intro', multiline:true },

    { key: 'acad-why-ey', label: 'Why — eyebrow',   sel:'#acWhyEy', idx:0, area:'Academics — Why Study', def:'Why Study at Alizon' },
    { key: 'acad-why-h',  label: 'Why — heading',   sel:'#acWhyH', idx:0, area:'Academics — Why Study', def:'Learn Skills That Change Lives' },
    { key: 'acad-why-p',  label: 'Why — subtitle',  sel:'#acWhyP', idx:0, area:'Academics — Why Study', multiline:true },
    { key: 'acad-wc1-t', label: 'Card 1 — title', sel:'#acWc1T', idx:0, area:'Academics — Why Study' },
    { key: 'acad-wc1-d', label: 'Card 1 — text',  sel:'#acWc1D', idx:0, area:'Academics — Why Study', multiline:true },
    { key: 'acad-wc2-t', label: 'Card 2 — title', sel:'#acWc2T', idx:0, area:'Academics — Why Study' },
    { key: 'acad-wc2-d', label: 'Card 2 — text',  sel:'#acWc2D', idx:0, area:'Academics — Why Study', multiline:true },
    { key: 'acad-wc3-t', label: 'Card 3 — title', sel:'#acWc3T', idx:0, area:'Academics — Why Study' },
    { key: 'acad-wc3-d', label: 'Card 3 — text',  sel:'#acWc3D', idx:0, area:'Academics — Why Study', multiline:true },
    { key: 'acad-wc4-t', label: 'Card 4 — title', sel:'#acWc4T', idx:0, area:'Academics — Why Study' },
    { key: 'acad-wc4-d', label: 'Card 4 — text',  sel:'#acWc4D', idx:0, area:'Academics — Why Study', multiline:true },

    { key: 'acad-wc1-img', label: 'Card 1 — image URL (optional)', sel:'#x-wc1', idx:0, area:'Academics — Why Study', def:'' },
    { key: 'acad-wc2-img', label: 'Card 2 — image URL (optional)', sel:'#x-wc2', idx:0, area:'Academics — Why Study', def:'' },
    { key: 'acad-wc3-img', label: 'Card 3 — image URL (optional)', sel:'#x-wc3', idx:0, area:'Academics — Why Study', def:'' },
    { key: 'acad-wc4-img', label: 'Card 4 — image URL (optional)', sel:'#x-wc4', idx:0, area:'Academics — Why Study', def:'' },

    { key: 'acad-love-img', label: 'Numbers band — background image URL (optional)', sel:'#x-love', idx:0, area:'Academics — Numbers', def:'' },
    { key: 'acad-imp-ey',   label: 'Numbers — eyebrow',  sel:'#acImpEy', idx:0, area:'Academics — Numbers', def:'Learning that adds up' },
    { key: 'acad-imp-h',    label: 'Numbers — heading',  sel:'#acImpH', idx:0, area:'Academics — Numbers', def:'The Alizon classroom, in numbers' },
    { key: 'acad-imp-p',    label: 'Numbers — sub line', sel:'#acImpP', idx:0, area:'Academics — Numbers', multiline:true },
    { key: 'acad-stat-1-num',   label: 'Number 1 — value', sel:'#acN1', idx:0, area:'Academics — Numbers', part:'text', def:'500' },
    { key: 'acad-stat-1-label', label: 'Number 1 — label', sel:'#acL1', idx:0, area:'Academics — Numbers', def:'Students on campus' },
    { key: 'acad-stat-2-num',   label: 'Number 2 — value', sel:'#acN2', idx:0, area:'Academics — Numbers', part:'text', def:'4' },
    { key: 'acad-stat-2-label', label: 'Number 2 — label', sel:'#acL2', idx:0, area:'Academics — Numbers', def:'AI certificate programmes' },
    { key: 'acad-stat-3-num',   label: 'Number 3 — value', sel:'#acN3', idx:0, area:'Academics — Numbers', part:'text', def:'12' },
    { key: 'acad-stat-3-label', label: 'Number 3 — label', sel:'#acL3', idx:0, area:'Academics — Numbers', def:'Virtual practicals' },
    { key: 'acad-stat-4-num',   label: 'Number 4 — value', sel:'#acN4', idx:0, area:'Academics — Numbers', part:'text', def:'10' },
    { key: 'acad-stat-4-label', label: 'Number 4 — label', sel:'#acL4', idx:0, area:'Academics — Numbers', def:'AI-scored assessments' },
    { key: 'acad-imp-note',     label: 'Numbers — footnote', sel:'#acImpNote', idx:0, area:'Academics — Numbers' },

    { key: 'acad-story-ey', label: 'Stories — eyebrow',  sel:'#acStoryEy', idx:0, area:'Academics — Student Stories', def:'Student Stories' },
    { key: 'acad-story-h',  label: 'Stories — heading',  sel:'#acStoryH', idx:0, area:'Academics — Student Stories', def:'Voices from our classrooms' },
    { key: 'acad-story-p',  label: 'Stories — sub line', sel:'#acStoryP', idx:0, area:'Academics — Student Stories', multiline:true },

    { key: 'acad-ben-ey', label: 'Benefits — eyebrow',  sel:'#acBenEy', idx:0, area:'Academics — Benefits', def:'What Every Student Gets' },
    { key: 'acad-ben-h',  label: 'Benefits — heading',  sel:'#acBenH', idx:0, area:'Academics — Benefits', def:'Learning built for real careers' },
    { key: 'acad-ben-p',  label: 'Benefits — sub line', sel:'#acBenP', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b1-t', label: 'Benefit 1 — title', sel:'#acB1T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b1-d', label: 'Benefit 1 — text',  sel:'#acB1D', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b2-t', label: 'Benefit 2 — title', sel:'#acB2T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b2-d', label: 'Benefit 2 — text',  sel:'#acB2D', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b3-t', label: 'Benefit 3 — title', sel:'#acB3T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b3-d', label: 'Benefit 3 — text',  sel:'#acB3D', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b4-t', label: 'Benefit 4 — title', sel:'#acB4T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b4-d', label: 'Benefit 4 — text',  sel:'#acB4D', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b5-t', label: 'Benefit 5 — title', sel:'#acB5T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b5-d', label: 'Benefit 5 — text',  sel:'#acB5D', idx:0, area:'Academics — Benefits', multiline:true },
    { key: 'acad-b6-t', label: 'Benefit 6 — title', sel:'#acB6T', idx:0, area:'Academics — Benefits' },
    { key: 'acad-b6-d', label: 'Benefit 6 — text',  sel:'#acB6D', idx:0, area:'Academics — Benefits', multiline:true },

    { key: 'acad-cta-h', label: 'Closing CTA — heading', sel:'#acCtaH', idx:0, area:'Academics — Closing CTA', def:'Start your journey with Alizon' },


    /* ============ EVERY-PAGE HERO (image + title + subtitle) ============ */
    { key:'home-hero-img',   label:'Hero — background image URL(s) — separate several with | for a carousel', sel:'#heroSecHome', idx:0, area:'Home — Hero', type:'image', multiline:true },
    { key:'home-hero-title', label:'Hero — title',    sel:'#heroH1Home',  idx:0, area:'Home — Hero' },
    { key:'home-hero-sub',   label:'Hero — subtitle', sel:'#heroSubHome', idx:0, area:'Home — Hero', multiline:true },

    { key:'prac-hero-img',   label:'Hero — background image URL', sel:'#heroImgprac',  idx:0, area:'Practicals — Hero', type:'image' },
    { key:'prac-hero-title', label:'Hero — title',    sel:'#heroH1prac',  idx:0, area:'Practicals — Hero' },
    { key:'prac-hero-sub',   label:'Hero — subtitle', sel:'#heroSubprac', idx:0, area:'Practicals — Hero', multiline:true },

    { key:'career-hero-img',   label:'Hero — background image URL', sel:'#heroImgcareer',  idx:0, area:'Career — Hero', type:'image' },
    { key:'career-hero-title', label:'Hero — title',    sel:'#heroH1career',  idx:0, area:'Career — Hero' },
    { key:'career-hero-sub',   label:'Hero — subtitle', sel:'#heroSubcareer', idx:0, area:'Career — Hero', multiline:true },

    { key:'vac-hero-img',   label:'Hero — background image URL', sel:'#heroImgvac',  idx:0, area:'Vacancies — Hero', type:'image' },
    { key:'vac-hero-title', label:'Hero — title',    sel:'#heroH1vac',  idx:0, area:'Vacancies — Hero' },
    { key:'vac-hero-sub',   label:'Hero — subtitle', sel:'#heroSubvac', idx:0, area:'Vacancies — Hero', multiline:true },

    { key:'sess-hero-img',   label:'Hero — background image URL', sel:'#heroImgsess',  idx:0, area:'Sessions — Hero', type:'image' },
    { key:'sess-hero-title', label:'Hero — title',    sel:'#heroH1sess',  idx:0, area:'Sessions — Hero' },
    { key:'sess-hero-sub',   label:'Hero — subtitle', sel:'#heroSubsess', idx:0, area:'Sessions — Hero', multiline:true },

    { key:'cv-hero-img',   label:'Hero — background image URL', sel:'#heroImgcv',  idx:0, area:'CV Builder — Hero', type:'image' },
    { key:'cv-hero-title', label:'Hero — title',    sel:'#heroH1cv',  idx:0, area:'CV Builder — Hero' },
    { key:'cv-hero-sub',   label:'Hero — subtitle', sel:'#heroSubcv', idx:0, area:'CV Builder — Hero', multiline:true },

    { key:'exam-hero-img',   label:'Hero — background image URL', sel:'#heroImgexam',  idx:0, area:'Examinations — Hero', type:'image' },
    { key:'exam-hero-title', label:'Hero — title',    sel:'#heroH1exam',  idx:0, area:'Examinations — Hero' },
    { key:'exam-hero-sub',   label:'Hero — subtitle', sel:'#heroSubexam', idx:0, area:'Examinations — Hero', multiline:true },

    { key:'results-hero-img',   label:'Hero — background image URL', sel:'#heroImgresults',  idx:0, area:'Results — Hero', type:'image' },
    { key:'results-hero-title', label:'Hero — title',    sel:'#heroH1results',  idx:0, area:'Results — Hero' },
    { key:'results-hero-sub',   label:'Hero — subtitle', sel:'#heroSubresults', idx:0, area:'Results — Hero', multiline:true },

    { key:'verify-hero-img',   label:'Hero — background image URL', sel:'#heroImgverify',  idx:0, area:'Verify — Hero', type:'image' },
    { key:'verify-hero-title', label:'Hero — title',    sel:'#heroH1verify',  idx:0, area:'Verify — Hero' },
    { key:'verify-hero-sub',   label:'Hero — subtitle', sel:'#heroSubverify', idx:0, area:'Verify — Hero', multiline:true },

    /* Examinations — content folders */
    { key:'exam-apply-h',    label:'Apply — heading',  sel:'#exApplyH',   idx:0, area:'Examinations — Apply for Exam' },
    { key:'exam-apply-hint', label:'Apply — description', sel:'#exApplyHint', idx:0, area:'Examinations — Apply for Exam', multiline:true },
    { key:'exam-sec-h',      label:'Examination Section — heading', sel:'#exSecH', idx:0, area:'Examinations — Examination Section' },
    { key:'exam-sec-hint',   label:'Examination Section — description', sel:'#exSecHint', idx:0, area:'Examinations — Examination Section', multiline:true },

    /* Verify — content folders */
    { key:'verify-stud-h',    label:'Student panel — heading', sel:'#vStudH', idx:0, area:'Verify — Student Panel' },
    { key:'verify-stud-hint', label:'Student panel — description', sel:'#vStudHint', idx:0, area:'Verify — Student Panel', multiline:true },
    { key:'verify-emp-h',     label:'Employee panel — heading', sel:'#vEmpH', idx:0, area:'Verify — Employee Panel' },
    { key:'verify-emp-hint',  label:'Employee panel — description', sel:'#vEmpHint', idx:0, area:'Verify — Employee Panel', multiline:true },

    /* Workshops */
    { key:'ws-hero-ey',    label:'Hero — eyebrow',  sel:'#heroEyworkshops',  idx:0, area:'Workshops — Hero' },
    { key:'ws-hero-title', label:'Hero — title',    sel:'#heroH1workshops',  idx:0, area:'Workshops — Hero' },
    { key:'ws-hero-tag',   label:'Hero — tagline',  sel:'#heroTagworkshops', idx:0, area:'Workshops — Hero' },
    { key:'ws-hero-sub',   label:'Hero — subtitle', sel:'#heroSubworkshops', idx:0, area:'Workshops — Hero', multiline:true },
    { key:'ws-upcoming-h', label:'Upcoming — heading', sel:'#wsUpcomingH', idx:0, area:'Workshops — Upcoming' },
    { key:'ws-reg-h',      label:'Register — heading', sel:'#wsRegH', idx:0, area:'Workshops — Registration' },

    /* ============ HOME HUB — other sections ============ */
    { key:'hb-intro-h',   label:'Intro — heading',      sel:'#hbIntroH',  idx:0, area:'Home — Intro' },
    { key:'hb-intro-p1',  label:'Intro — paragraph 1',  sel:'#hbIntroP1', idx:0, area:'Home — Intro', multiline:true },
    { key:'hb-intro-p2',  label:'Intro — paragraph 2',  sel:'#hbIntroP2', idx:0, area:'Home — Intro', multiline:true },
    { key:'hb-intro-img', label:'Intro — image URL',    sel:'#hbIntroImg',idx:0, area:'Home — Intro', type:'image' },

    { key:'hb-sc-h',   label:'Showcase — heading',  sel:'#hbScH',   idx:0, area:'Home — Showcase' },
    { key:'hb-sc-sub', label:'Showcase — subtitle', sel:'#hbScSub', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c1-t', label:'Card 1 — title', sel:'#hbC1T', idx:0, area:'Home — Showcase' },
    { key:'hb-c1-img', label:'Card 1 — image', sel:'#hbC1Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c1-d', label:'Card 1 — description', sel:'#hbC1D', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c2-t', label:'Card 2 — title', sel:'#hbC2T', idx:0, area:'Home — Showcase' },
    { key:'hb-c2-img', label:'Card 2 — image', sel:'#hbC2Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c2-d', label:'Card 2 — description', sel:'#hbC2D', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c3-t', label:'Card 3 — title', sel:'#hbC3T', idx:0, area:'Home — Showcase' },
    { key:'hb-c3-img', label:'Card 3 — image', sel:'#hbC3Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c3-d', label:'Card 3 — description', sel:'#hbC3D', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c4-t', label:'Card 4 — title', sel:'#hbC4T', idx:0, area:'Home — Showcase' },
    { key:'hb-c4-img', label:'Card 4 — image', sel:'#hbC4Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c4-d', label:'Card 4 — description', sel:'#hbC4D', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c5-t', label:'Card 5 — title', sel:'#hbC5T', idx:0, area:'Home — Showcase' },
    { key:'hb-c5-img', label:'Card 5 — image', sel:'#hbC5Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c5-d', label:'Card 5 — description', sel:'#hbC5D', idx:0, area:'Home — Showcase', multiline:true },
    { key:'hb-c6-t', label:'Card 6 — title', sel:'#hbC6T', idx:0, area:'Home — Showcase' },
    { key:'hb-c6-img', label:'Card 6 — image', sel:'#hbC6Img', idx:0, area:'Home — Showcase', type:'image' },
    { key:'hb-c6-d', label:'Card 6 — description', sel:'#hbC6D', idx:0, area:'Home — Showcase', multiline:true },

    { key:'hb-imp-h',   label:'Impact — heading',  sel:'#hbImpH',   idx:0, area:'Home — Impact' },
    { key:'hb-imp-sub', label:'Impact — subtitle', sel:'#hbImpSub', idx:0, area:'Home — Impact', multiline:true },
    { key:'hb-st1', label:'Stat 1 — number', sel:'#hbSt1', idx:0, area:'Home — Impact' },
    { key:'hb-sl1', label:'Stat 1 — label',  sel:'#hbSl1', idx:0, area:'Home — Impact' },
    { key:'hb-st2', label:'Stat 2 — number', sel:'#hbSt2', idx:0, area:'Home — Impact' },
    { key:'hb-sl2', label:'Stat 2 — label',  sel:'#hbSl2', idx:0, area:'Home — Impact' },
    { key:'hb-st3', label:'Stat 3 — number', sel:'#hbSt3', idx:0, area:'Home — Impact' },
    { key:'hb-sl3', label:'Stat 3 — label',  sel:'#hbSl3', idx:0, area:'Home — Impact' },
    { key:'hb-st4', label:'Stat 4 — number', sel:'#hbSt4', idx:0, area:'Home — Impact' },
    { key:'hb-sl4', label:'Stat 4 — label',  sel:'#hbSl4', idx:0, area:'Home — Impact' },
    { key:'hb-st5', label:'Stat 5 — number (e.g. scholarships awarded)', sel:'#hbSt5', idx:0, area:'Home — Impact' },
    { key:'hb-sl5', label:'Stat 5 — label',  sel:'#hbSl5', idx:0, area:'Home — Impact' },

    { key:'hb-cta-h',   label:'CTA — heading',    sel:'#hbCtaH',   idx:0, area:'Home — Call to Action' },
    { key:'hb-cta-p',   label:'CTA — paragraph',  sel:'#hbCtaP',   idx:0, area:'Home — Call to Action', multiline:true },
    { key:'hb-cta-btn', label:'CTA — button text',sel:'#hbCtaBtn', idx:0, area:'Home — Call to Action' }
  ];

  var fieldByKey = {};
  for (var i = 0; i < fields.length; i++) fieldByKey[fields[i].key] = fields[i];

  /* ---------------- internal helpers (all guarded) ---------------- */

  function findEl(f) {
    if (!f || !f.sel || typeof document === 'undefined') return null;
    try {
      var list = document.querySelectorAll(f.sel);
      return list && list.length ? (list[f.idx || 0] || null) : null;
    } catch (e) { return null; }
  }

  /* first child TEXT NODE with visible content (skips the ✓ dot
     span in bullets and the .accent span in headings) */
  function firstTextNode(el) {
    if (!el || !el.childNodes) return null;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue && n.nodeValue.replace(/\s+/g, '') !== '') return n;
    }
    return null;
  }

  function readDomText(f) {
    var el = findEl(f);
    if (!el) return null;
    try {
      if (f.type === 'image') {
        if (el.tagName === 'IMG') return el.getAttribute('src') || '';
        if (el.hasAttribute && el.hasAttribute('data-slides')) return (el.getAttribute('data-slides') || '').split('|')[0];
        var bg = (el.style && el.style.backgroundImage) || '';
        var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
        return m ? m[1] : '';
      }
      var raw;
      if (f.part === 'text') {
        var tn = firstTextNode(el);
        raw = tn ? tn.nodeValue : '';
      } else {
        raw = el.textContent || '';
      }
      return String(raw).replace(/\s+/g, ' ').trim();
    } catch (e) { return null; }
  }

  function writeDomText(f, text) {
    var el = findEl(f);
    if (!el) return false;
    try {
      if (f.type === 'image') {
        if (el.tagName === 'IMG') { el.setAttribute('src', text); }
        else if (el.hasAttribute && el.hasAttribute('data-slides')) {
          el.setAttribute('data-slides', text);
          /* refresh EVERY already-built carousel layer, not just the first —
             layer i shows slide i; layers beyond the new list are hidden */
          var slides = (text || '').split('|').filter(function (s) { return s.trim(); });
          var layers = el.querySelectorAll ? el.querySelectorAll('img.bg') : [];
          for (var li = 0; li < layers.length; li++) {
            if (slides[li]) { layers[li].setAttribute('src', slides[li]); layers[li].style.display = ''; }
            else { layers[li].style.opacity = '0'; layers[li].style.display = 'none'; }
          }
        } else { el.style.backgroundImage = 'url("' + text + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
        return true;
      }
      if (f.part === 'text') {
        var tn = firstTextNode(el);
        if (tn) tn.nodeValue = text;
        else el.insertBefore(document.createTextNode(text), el.firstChild || null);
      } else {
        el.textContent = text; /* NEVER innerHTML */
      }
      return true;
    } catch (e) { return false; }
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var obj = JSON.parse(raw);
      return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
    } catch (e) { return {}; }
  }

  function writeStore(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); return true; }
    catch (e) { return false; }
  }

  /* ---------------- public API ---------------- */

  /* get(key): override if one exists, otherwise the live DOM text
     (so the admin form can seed from reality). '' if unknown. */
  function get(key) {
    var store = readStore();
    if (Object.prototype.hasOwnProperty.call(store, key) && typeof store[key] === 'string') {
      return store[key];
    }
    var f = fieldByKey[key];
    if (!f) return '';
    var live = readDomText(f);
    return live === null ? '' : live;
  }

  /* set(key, text)   — store one override (string). text === null or
                        undefined removes the override.
     set({k:v, ...})  — merge many overrides at once.
     Saves to localStorage (firebase-sync's setItem hook picks it up)
     and immediately re-applies on this page. */
  function set(key, text) {
    var store = readStore(), k;
    if (key && typeof key === 'object') {
      for (k in key) {
        if (!Object.prototype.hasOwnProperty.call(key, k)) continue;
        if (key[k] === null || typeof key[k] === 'undefined') delete store[k];
        else store[k] = String(key[k]);
      }
    } else if (typeof key === 'string') {
      if (text === null || typeof text === 'undefined') delete store[key];
      else store[key] = String(text);
    } else {
      return false;
    }
    var ok = writeStore(store);
    apply();
    return ok;
  }

  /* apply(): push every stored override into the DOM. Fields with no
     override are left untouched (their hard-coded HTML is the default).
     Unknown keys and missing elements are silently skipped. */
  function apply() {
    if (typeof document === 'undefined') return;
    var store = readStore();
    for (var k in store) {
      if (!Object.prototype.hasOwnProperty.call(store, k)) continue;
      var f = fieldByKey[k];
      if (!f || typeof store[k] !== 'string') continue;
      if (!store[k].trim()) continue; /* never blank site text with an empty override */
      writeDomText(f, store[k]);
    }
  }

  /* Keep a private, closure-bound copy so everything below still
     works even if another script overwrites window.__alizonCMS. */
  var api = { fields: fields, get: get, set: set, apply: apply, storageKey: STORAGE_KEY };
  try { window.__alizonCMS = api; } catch (e) { /* non-window env */ }

  /* ---------------- boot ---------------- */

  function boot() { apply(); }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  } catch (e) { /* no DOM */ }

  /* live cross-tab / cross-device updates: firebase-sync writes the
     pulled value into localStorage, which fires 'storage' in other
     tabs; same-tab programmatic writes are covered by set() calling
     apply() directly. */
  try {
    window.addEventListener('storage', function (e) {
      if (e && e.key === STORAGE_KEY) apply();
    });
  } catch (e) { /* no window */ }
})();
