/* tools-build-shell.js — stamp the shared site shell (header, mobile menu,
   footer) into every page from one source of truth.

     node tools-build-shell.js                  rebuild all marked regions
     node tools-build-shell.js --check          exit 1 if any page is stale (CI)
     node tools-build-shell.js --migrate FILES  convert pages to use markers
     node tools-build-shell.js --list           show what each page is wired to

   Edit partials/shell.json, re-run, done — instead of hand-editing 28 copies.
   Markup between the ALIZON:SHELL / ALIZON:FOOTER markers is generated: any
   hand edit there is overwritten on the next build. */

const fs = require('fs');
const path = require('path');

const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'partials/shell.json'), 'utf8'));

/* Pages deliberately left on their own bespoke shell. */
const SKIP = new Set([
  'alizon-clone-home.html', // standalone university-template experiment
  'alizon-cv.html',         // focused CV-builder sub-nav, not the site nav
  'offline.html',           // service-worker fallback, must stay dependency-free
  'theme-preview.html',     // design sandbox
]);

const SHELL_BEGIN = /<!--\s*ALIZON:SHELL:BEGIN([^>]*?)-->[\s\S]*?<!--\s*ALIZON:SHELL:END\s*-->/;
const FOOTER_BEGIN = /<!--\s*ALIZON:FOOTER:BEGIN([^>]*?)-->[\s\S]*?<!--\s*ALIZON:FOOTER:END\s*-->/;

const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (a, k) => { const m = a.match(new RegExp(`${k}="([^"]*)"`)); return m ? m[1] : ''; };
const link = l => `<a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}>${e(l.label)}</a>`;

const BELL = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>';

function brandMark(sh, opts) {
  const small = opts && opts.smallStyle ? ` style="${opts.smallStyle}"` : '';
  const href = (opts && opts.href) || sh.brand.href;
  const style = opts && opts.style ? ` style="${opts.style}"` : '';
  return `<a class="brand" href="${href}"${style}><img src="alizon-logo.png" alt="Alizon">`
       + `<span>${e(sh.brand.title)}<small${small}>${e(sh.brand.tagline)}</small></span></a>`;
}

function buildHeader(shellName, active, variant) {
  const sh = CFG.shells[shellName];
  const cls = variant ? ` class="${variant}"` : '';
  const cta = sh.cta
    ? `\n      <a class="${sh.ctaClass}"${sh.ctaStyle ? ` style="${sh.ctaStyle}"` : ''} href="${sh.cta.href}">${e(sh.cta.label)}</a>`
    : '';

  return `<header id="azsitehdr"${cls}>
  <div class="azhdr-util">
    <div class="in">
      ${brandMark(sh)}
      <div class="util-r">
        <span class="lbl">${e(CFG.util.label)}</span>
        ${CFG.util.links.map(link).join('\n        ')}
      </div>
      <button id="azburger" aria-label="Open menu" aria-expanded="false" aria-controls="azmobilemenu"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="azhdr-nav">
    <nav class="in">
      <div class="navlinks2">
        ${sh.nav.map(n => `<a href="${n.href}"${n.key === active ? ' class="active"' : ''}>${e(n.label)}</a>`).join('\n        ')}
      </div>${cta}
    </nav>
  </div>
  <div class="azhdr-tick" aria-label="Latest updates">
    <span class="tk-tag">${BELL} ${e(CFG.ticker.tag)}</span>
    <div class="tk-track">
      ${CFG.ticker.items.map(e).join('\n      <span class="sep">•</span> ')}
    </div>
  </div>
</header>
<div id="azmobilemenu" role="navigation" aria-label="Mobile">
  ${sh.nav.map(n => `<a href="${n.href}">${e(n.label)}</a>`).join('\n  ')}${
    sh.cta ? `\n  <a class="azmm-cta" href="${sh.cta.href}">${e(sh.cta.label)}</a>` : ''}
</div>`;
}

function buildFooter(shellName) {
  const sh = CFG.shells[shellName];
  const f = sh.footer;
  const cols = f.cols.map(c =>
    `<div><h4>${e(c.title)}</h4>${c.links.map(link).join('')}</div>`).join('\n      ');

  if (f.layout === 'aos') {
    return `<footer class="site">
  <div class="in">
    <div class="cols">
      <div>
        ${brandMark(sh, { style: 'margin-bottom:14px', smallStyle: 'color:#bdbdbd' })}
        <p style="color:#bdbdbd;max-width:34ch">${e(f.blurb)}</p>
      </div>
      ${cols}
    </div>
    <div class="foot-bottom"><span>${e(f.baseLeft)}</span><span>${e(f.baseRight)}</span></div>
  </div>
</footer>`;
  }

  return `<footer>
  <div class="in">
    <div>
      ${brandMark(sh)}
      <p style="max-width:260px;margin-top:16px;font-weight:300;font-size:13.5px;line-height:1.6">${e(f.blurb)}</p>
    </div>
    <div class="cols">
      ${cols}
    </div>
  </div>
  <div class="base"><span>${e(f.baseLeft)}</span><span>${e(f.baseRight)}</span></div>
</footer>`;
}

/* Make sure the page loads the shared shell stylesheet + script.
   Some pages are fragments with no <head>/<body> tags at all, so each
   insertion falls back through a chain of anchors and reports what it used. */
const CSS_TAG = '<link rel="stylesheet" href="alizon-shell.css?v=1">';
const JS_TAG  = '<script src="alizon-shell.js?v=1" defer></script>';

function insertAt(src, tag, anchors) {
  for (const [re, mode] of anchors) {
    const m = src.match(re);
    if (!m) continue;
    const i = mode === 'before' ? m.index : m.index + m[0].length;
    return { out: src.slice(0, i) + (mode === 'before' ? `  ${tag}\n` : `\n${tag}`) + src.slice(i), how: re.source.slice(0, 22) };
  }
  return null;
}

function ensureAssets(src, file, warn) {
  let out = src;

  if (!/alizon-shell\.css/.test(out)) {
    const r = insertAt(out, CSS_TAG, [
      [/<\/head>/i, 'before'],
      [/<link rel="stylesheet"[^>]*>(?![\s\S]*<link rel="stylesheet")/i, 'after'],
      [/<meta charset=[^>]*>/i, 'after'],
    ]);
    if (r) { out = r.out; if (!/<\/head>/i.test(src) && warn) warn(`${file}: no </head> — shell CSS anchored to ${r.how}`); }
    else if (warn) warn(`${file}: COULD NOT inject shell CSS`);
  }

  if (!/alizon-shell\.js/.test(out)) {
    const r = insertAt(out, JS_TAG, [
      [/<\/body>/i, 'before'],
      [/<\/html>/i, 'before'],
    ]);
    if (r) out = r.out;
    else { out = out.replace(/\s*$/, '\n') + JS_TAG + '\n';
           if (warn) warn(`${file}: no </body> — shell JS appended at end of file`); }
  }

  return out;
}

/* The inline mobile-menu IIFE is now in alizon-shell.js — drop the copy. */
function stripInlineMenu(src) {
  return src.replace(
    /\n?<script>\s*\/\*\s*mobile menu\s*\*\/[\s\S]*?getElementById\(['"]azburger['"][\s\S]*?<\/script>/g, '');
}

function render(src, file, warn) {
  let out = src, changed = false;

  out = out.replace(SHELL_BEGIN, (m, a) => {
    const shell = attr(a, 'shell') || 'school';
    const body = `<!-- ALIZON:SHELL:BEGIN shell="${shell}"${attr(a, 'active') ? ` active="${attr(a, 'active')}"` : ''}${attr(a, 'variant') ? ` variant="${attr(a, 'variant')}"` : ''} -->\n`
      + buildHeader(shell, attr(a, 'active'), attr(a, 'variant'))
      + `\n<!-- ALIZON:SHELL:END -->`;
    if (body !== m) changed = true;
    return body;
  });

  out = out.replace(FOOTER_BEGIN, (m, a) => {
    const shell = attr(a, 'shell') || 'school';
    const body = `<!-- ALIZON:FOOTER:BEGIN shell="${shell}" -->\n` + buildFooter(shell) + `\n<!-- ALIZON:FOOTER:END -->`;
    if (body !== m) changed = true;
    return body;
  });

  if (SHELL_BEGIN.test(src)) out = ensureAssets(out, file, warn);
  return { out, changed: changed || out !== src };
}

/* ---- migration: turn a hand-written shell into a marked region ---- */

function detectShell(src) {
  /* Read the tagline out of the header brand only — the strings also appear
     in body copy, and matching those wires a page to the wrong nav. */
  const hdr = src.match(/<header\s+id="azsitehdr"[\s\S]*?<\/header>/);
  const brand = hdr && hdr[0].match(/<a class="brand"[\s\S]*?<small[^>]*>([^<]*)<\/small>/);
  const tag = brand ? brand[1] : '';
  for (const [name, sh] of Object.entries(CFG.shells)) {
    if (tag.replace(/&amp;/g, '&').trim() === sh.brand.tagline.trim()) return name;
  }
  if (/Practical Learning Platform/.test(tag)) return 'aos';
  return 'school';
}

function detectActive(src, shellName, file) {
  const sh = CFG.shells[shellName];
  const cur = src.match(/<a href="([^"]+)"\s+class="active"/);
  if (cur) { const hit = sh.nav.find(n => n.href === cur[1]); if (hit) return hit.key; }
  const self = sh.nav.find(n => n.href === file);
  return self ? self.key : '';
}

function migrate(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (SHELL_BEGIN.test(src)) return { file, status: 'already migrated' };

  const hdr = src.match(/<header\s+id="azsitehdr"[\s\S]*?<\/header>\s*(?:<div id="azmobilemenu"[\s\S]*?<\/div>\s*)?/);
  if (!hdr) return { file, status: 'SKIP — no site header' };

  const shell = detectShell(src);
  const variant = (hdr[0].match(/<header\s+id="azsitehdr"\s+class="([^"]*)"/) || [, ''])[1];
  const active = detectActive(src, shell, path.basename(file));

  let out = src.replace(hdr[0],
    `<!-- ALIZON:SHELL:BEGIN shell="${shell}"${active ? ` active="${active}"` : ''}${variant ? ` variant="${variant}"` : ''} -->\n`
    + `<!-- ALIZON:SHELL:END -->\n`);

  /* site footer = the last <footer> that carries the link columns */
  const footers = [...out.matchAll(/<footer[^>]*>[\s\S]*?<\/footer>/g)];
  const site = footers.reverse().find(m => /class="cols"/.test(m[0]));
  if (site) out = out.replace(site[0], `<!-- ALIZON:FOOTER:BEGIN shell="${shell}" -->\n<!-- ALIZON:FOOTER:END -->`);

  out = stripInlineMenu(out);
  out = render(out, file, m => console.warn(`  ! ${m}`)).out;
  fs.writeFileSync(file, out);
  return { file, status: `migrated  shell=${shell}${active ? ` active=${active}` : ''}${variant ? ` variant=${variant}` : ''}${site ? ' +footer' : ' (no footer)'}` };
}

/* ---------------------------- cli ---------------------------- */

const argv = process.argv.slice(2);
const pages = () => fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !SKIP.has(f));

if (argv[0] === '--migrate') {
  const files = argv.slice(1);
  if (!files.length) { console.error('usage: --migrate <files...>'); process.exit(2); }
  for (const f of files) {
    if (SKIP.has(path.basename(f))) { console.log(`  ${f}: SKIP (opted out)`); continue; }
    const r = migrate(f); console.log(`  ${r.file}: ${r.status}`);
  }
  process.exit(0);
}

if (argv[0] === '--list') {
  for (const f of pages()) {
    const m = fs.readFileSync(path.join(__dirname, f), 'utf8').match(SHELL_BEGIN);
    if (m) console.log(`  ${f.padEnd(30)} shell=${attr(m[1], 'shell') || 'school'} active=${attr(m[1], 'active') || '-'}`);
  }
  process.exit(0);
}

const check = argv.includes('--check');
let stale = 0, built = 0;
for (const f of pages()) {
  const p = path.join(__dirname, f);
  const src = fs.readFileSync(p, 'utf8');
  if (!SHELL_BEGIN.test(src) && !FOOTER_BEGIN.test(src)) continue;
  const { out, changed } = render(src, f, m => console.warn(`  ! ${m}`));
  if (!changed) continue;
  if (check) { console.error(`  stale: ${f}`); stale++; }
  else { fs.writeFileSync(p, out); console.log(`  rebuilt: ${f}`); built++; }
}

if (check) {
  if (stale) { console.error(`\n${stale} page(s) out of date — run: node tools-build-shell.js`); process.exit(1); }
  console.log('shell: all pages up to date'); process.exit(0);
}
console.log(built ? `\nshell: rebuilt ${built} page(s)` : 'shell: nothing to do');
