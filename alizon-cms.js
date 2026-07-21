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
    { key: 'hero-eyebrow',   label: 'Hero — eyebrow line',        sel: '.hero .eyebrow',          idx: 0, area: 'Hero' },
    { key: 'hero-title',     label: 'Hero — main title',          sel: '.hero h1',                idx: 0, area: 'Hero' },
    { key: 'hero-tagline',   label: 'Hero — tagline',             sel: '.hero .tag',              idx: 0, area: 'Hero' },
    { key: 'hero-lead',      label: 'Hero — lead paragraph',      sel: '.hero .lead',             idx: 0, area: 'Hero', multiline: true },
    { key: 'hero-cta-label', label: 'Hero — primary button text', sel: '.hero .cta .btn.primary', idx: 0, area: 'Hero' },
    { key: 'hero-notice',    label: 'Hero — announcement line',   sel: '.hero .price',            idx: 0, area: 'Hero' },

    /* ---- Stat strip (4 numbers + 4 labels) ---- */
    { key: 'stat-1-num',   label: 'Stat 1 — number', sel: '.strip .in .n', idx: 0, area: 'Stats' },
    { key: 'stat-1-label', label: 'Stat 1 — label',  sel: '.strip .in .k', idx: 0, area: 'Stats' },
    { key: 'stat-2-num',   label: 'Stat 2 — number', sel: '.strip .in .n', idx: 1, area: 'Stats' },
    { key: 'stat-2-label', label: 'Stat 2 — label',  sel: '.strip .in .k', idx: 1, area: 'Stats' },
    { key: 'stat-3-num',   label: 'Stat 3 — number', sel: '.strip .in .n', idx: 2, area: 'Stats' },
    { key: 'stat-3-label', label: 'Stat 3 — label',  sel: '.strip .in .k', idx: 2, area: 'Stats' },
    { key: 'stat-4-num',   label: 'Stat 4 — number', sel: '.strip .in .n', idx: 3, area: 'Stats' },
    { key: 'stat-4-label', label: 'Stat 4 — label',  sel: '.strip .in .k', idx: 3, area: 'Stats' },

    /* ---- Programmes section ---- */
    { key: 'prog-eyebrow',        label: 'Programmes — eyebrow',                sel: '#programmes .ey',         idx: 0, area: 'Programmes' },
    { key: 'prog-heading',        label: 'Programmes — heading (plain part)',   sel: '#programmes > h2',        idx: 0, area: 'Programmes', part: 'text' },
    { key: 'prog-heading-accent', label: 'Programmes — heading (accent part)',  sel: '#programmes > h2 .accent',idx: 0, area: 'Programmes' },
    { key: 'prog-sub',            label: 'Programmes — sub paragraph',          sel: '#programmes .sub',        idx: 0, area: 'Programmes', multiline: true },

    { key: 'prog-card-1-title', label: 'Card 1 (Paramedical) — title',       sel: '#programmes .pc h3',    idx: 0, area: 'Programmes' },
    { key: 'prog-card-1-desc',  label: 'Card 1 (Paramedical) — description', sel: '#programmes .pc p',     idx: 0, area: 'Programmes', multiline: true },
    { key: 'prog-card-1-meta',  label: 'Card 1 (Paramedical) — meta tags',   sel: '#programmes .pc .meta', idx: 0, area: 'Programmes' },
    { key: 'prog-card-2-title', label: 'Card 2 (Pharmacy) — title',          sel: '#programmes .pc h3',    idx: 1, area: 'Programmes' },
    { key: 'prog-card-2-desc',  label: 'Card 2 (Pharmacy) — description',    sel: '#programmes .pc p',     idx: 1, area: 'Programmes', multiline: true },
    { key: 'prog-card-2-meta',  label: 'Card 2 (Pharmacy) — meta tags',      sel: '#programmes .pc .meta', idx: 1, area: 'Programmes' },
    { key: 'prog-card-3-title', label: 'Card 3 (Medical) — title',           sel: '#programmes .pc h3',    idx: 2, area: 'Programmes' },
    { key: 'prog-card-3-desc',  label: 'Card 3 (Medical) — description',     sel: '#programmes .pc p',     idx: 2, area: 'Programmes', multiline: true },
    { key: 'prog-card-3-meta',  label: 'Card 3 (Medical) — meta tags',       sel: '#programmes .pc .meta', idx: 2, area: 'Programmes' },
    { key: 'prog-card-4-title', label: 'Card 4 (Hospital Admin) — title',    sel: '#programmes .pc h3',    idx: 3, area: 'Programmes' },
    { key: 'prog-card-4-desc',  label: 'Card 4 (Hospital Admin) — description', sel: '#programmes .pc p',  idx: 3, area: 'Programmes', multiline: true },
    { key: 'prog-card-4-meta',  label: 'Card 4 (Hospital Admin) — meta tags',sel: '#programmes .pc .meta', idx: 3, area: 'Programmes' },

    /* ---- Practicals feature ---- */
    { key: 'practicals-heading',        label: 'Practicals — heading (plain part)',  sel: '#practicals h2',         idx: 0, area: 'Sections', part: 'text' },
    { key: 'practicals-heading-accent', label: 'Practicals — heading (accent part)', sel: '#practicals h2 .accent', idx: 0, area: 'Sections' },
    { key: 'practicals-para',           label: 'Practicals — paragraph',             sel: '#practicals .feat p',    idx: 0, area: 'Sections', multiline: true },
    { key: 'practicals-bullet-1', label: 'Practicals — bullet 1', sel: '#practicals ul li', idx: 0, area: 'Sections', part: 'text' },
    { key: 'practicals-bullet-2', label: 'Practicals — bullet 2', sel: '#practicals ul li', idx: 1, area: 'Sections', part: 'text' },
    { key: 'practicals-bullet-3', label: 'Practicals — bullet 3', sel: '#practicals ul li', idx: 2, area: 'Sections', part: 'text' },
    { key: 'practicals-bullet-4', label: 'Practicals — bullet 4', sel: '#practicals ul li', idx: 3, area: 'Sections', part: 'text' },

    /* ---- Aliz feature ---- */
    { key: 'aliz-heading',        label: 'Aliz — heading (plain part)',  sel: '#aliz h2',         idx: 0, area: 'Sections', part: 'text' },
    { key: 'aliz-heading-accent', label: 'Aliz — heading (accent part)', sel: '#aliz h2 .accent', idx: 0, area: 'Sections' },
    { key: 'aliz-para',           label: 'Aliz — paragraph',             sel: '#aliz .feat p',    idx: 0, area: 'Sections', multiline: true },

    /* ---- Assessment ---- */
    { key: 'assessment-heading',        label: 'Assessment — heading (plain part)',  sel: '#assessment h2',         idx: 0, area: 'Sections', part: 'text' },
    { key: 'assessment-heading-accent', label: 'Assessment — heading (accent part)', sel: '#assessment h2 .accent', idx: 0, area: 'Sections' },
    { key: 'assessment-sub',            label: 'Assessment — sub paragraph',         sel: '#assessment .sub',       idx: 0, area: 'Sections', multiline: true },

    /* ---- CTA block + footer ---- */
    { key: 'cta-heading',  label: 'CTA block — heading',  sel: '.cta-blk h2', idx: 0, area: 'CTA & Footer' },
    { key: 'cta-sub',      label: 'CTA block — subtitle', sel: '.cta-blk p',  idx: 0, area: 'CTA & Footer', multiline: true },
    { key: 'footer-blurb', label: 'Footer — blurb',       sel: 'footer .in p',idx: 0, area: 'CTA & Footer', multiline: true },

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

    { key: 'acad-cta-h', label: 'Closing CTA — heading', sel:'#acCtaH', idx:0, area:'Academics — Closing CTA', def:'Start your journey with Alizon' }
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
