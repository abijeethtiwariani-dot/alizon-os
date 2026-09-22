/* =====================================================================
   shield-ui.js — ALIZON Shield interface.

   Renders every view, owns the scan queue, and talks to the engine
   through a worker (falling back to a direct call where a worker cannot
   start). Nothing in here decides whether a file is dangerous; that is
   entirely shield-engine.js. This file's job is to make the engine's
   reasoning legible — every finding is shown with the explanation of
   why it matters, because a verdict nobody understands is a verdict
   nobody can act on.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     STATE
     --------------------------------------------------------------- */
  var S = {
    view: 'scan',
    results: [],
    queue: [],
    scanning: false,
    cancelled: false,
    done: 0,
    total: 0,
    startedAt: 0,
    filter: 'all',
    sort: 'risk',
    selected: null,
    extraHashes: null,
    extraCount: 0,
    rootHandle: null,        /* set when a folder is opened for writing */
    handles: {},             /* path -> { file, parent, name } for quarantine */
    quarantined: [],
    skipNoise: true,
    engineInfo: null
  };

  var VERDICT = {
    malicious:   { label:'Malicious',   cls:'v-mal',   mark:'✕', rank:4,
                   advice:'Do not open, run or forward this file. If it came from an email, report it and delete it.' },
    suspicious:  { label:'Suspicious',  cls:'v-susp',  mark:'!', rank:3,
                   advice:'Several traits here are worth understanding before you open it. Read the findings and check where the file came from.' },
    low:         { label:'Low risk',    cls:'v-low',   mark:'•', rank:2,
                   advice:'Minor notes only. Nothing here would normally stop you using the file.' },
    clean:       { label:'Clean',       cls:'v-clean', mark:'✓', rank:1,
                   advice:'Nothing identifiably wrong was found. That is not the same as proof the file is safe — see the limits below.' },
    unscannable: { label:'Unreadable',  cls:'v-uns',   mark:'?',      rank:0,
                   advice:'The file could not be read, so nothing was checked.' }
  };

  var SEV = {
    critical: { label:'Critical', cls:'s-crit' },
    high:     { label:'High',     cls:'s-high' },
    medium:   { label:'Medium',   cls:'s-med'  },
    low:      { label:'Low',      cls:'s-low'  },
    info:     { label:'Note',     cls:'s-info' }
  };

  /* ---------------------------------------------------------------
     HELPERS
     --------------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function bytes(n) {
    if (n === undefined || n === null) return '—';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
  }
  function ms(n) { return n < 1000 ? n + ' ms' : (n / 1000).toFixed(1) + ' s'; }

  /* Neutralise anything in a report that a mail client or terminal might
     turn back into a live link. Standard practice when writing up
     indicators, and it stops a saved report from being dangerous itself. */
  function defang(s) {
    return String(s)
      .replace(/\bhttps?:\/\//gi, function (m) { return m[4] === 's' ? 'hxxps://' : 'hxxp://'; })
      .replace(/\b((?:[\w-]+\.)+)(com|net|org|io|ru|cn|onion|xyz|top|info|biz|co|uk|in)\b/gi,
               function (m, a, b) { return a.replace(/\./g, '[.]') + b; });
  }

  function verdictOf(r) { return VERDICT[r.verdict] || VERDICT.clean; }

  function summary() {
    var c = { malicious:0, suspicious:0, low:0, clean:0, unscannable:0, bytes:0 };
    S.results.forEach(function (r) {
      c[r.verdict] = (c[r.verdict] || 0) + 1;
      c.bytes += r.size || 0;
    });
    return c;
  }

  /* ---------------------------------------------------------------
     THE ENGINE, IN A WORKER WHERE POSSIBLE
     --------------------------------------------------------------- */
  var worker = null, workerJobs = {}, jobSeq = 0, workerOK = false;

  function startWorker() {
    if (!window.Worker) return false;
    try {
      worker = new Worker('shield-worker.js?v=1');
      worker.onmessage = function (e) {
        var m = e.data || {};
        if (m.type === 'ready') {
          workerOK = true;
          S.engineInfo = m;
          return;
        }
        var job = workerJobs[m.id];
        if (!job) return;
        delete workerJobs[m.id];
        if (m.type === 'result') job.resolve(m.result);
        else job.reject(new Error(m.message || 'scan failed'));
      };
      worker.onerror = function () { workerOK = false; worker = null; };
      worker.postMessage({ type: 'ping' });
      return true;
    } catch (e) { worker = null; return false; }
  }

  function scanOne(file, path) {
    if (worker && workerOK) {
      return new Promise(function (resolve, reject) {
        var id = ++jobSeq;
        workerJobs[id] = { resolve: resolve, reject: reject };
        try {
          worker.postMessage({ type:'scan', id:id, file:file, path:path,
                               name:file.name, size:file.size });
        } catch (err) {
          delete workerJobs[id];
          /* Structured-clone refused the File; fall back for this one. */
          window.ShieldEngine.scanFile(file, { path:path, extraHashes:S.extraHashes })
            .then(resolve, reject);
        }
      });
    }
    return window.ShieldEngine.scanFile(file, { path:path, extraHashes:S.extraHashes });
  }

  /* ---------------------------------------------------------------
     GATHERING FILES
     --------------------------------------------------------------- */
  var NOISE = /(^|\/)(\.git|\.svn|\.hg|node_modules|\.next|\.nuxt|__pycache__|\.venv|venv|\.gradle|\.idea|\.DS_Store|Thumbs\.db)(\/|$)/i;
  var MAX_FILES = 20000;

  function addToQueue(items) {
    var skipped = 0;
    items.forEach(function (it) {
      if (S.queue.length + S.results.length >= MAX_FILES) { skipped++; return; }
      if (S.skipNoise && NOISE.test(it.path)) { skipped++; return; }
      S.queue.push(it);
    });
    return skipped;
  }

  /* A drag-and-drop of a folder arrives as directory entries, not files. */
  function walkEntry(entry, prefix, out, depth) {
    return new Promise(function (resolve) {
      if (!entry || depth > 12 || out.length > MAX_FILES) return resolve();
      if (entry.isFile) {
        entry.file(function (f) { out.push({ file:f, path:prefix + entry.name }); resolve(); },
                   function () { resolve(); });
        return;
      }
      if (!entry.isDirectory) return resolve();
      var reader = entry.createReader(), all = [];
      (function read() {
        reader.readEntries(function (ents) {
          if (!ents.length) {
            var i = 0;
            (function nextChild() {
              if (i >= all.length) return resolve();
              walkEntry(all[i++], prefix + entry.name + '/', out, depth + 1).then(nextChild);
            })();
            return;
          }
          all = all.concat(Array.prototype.slice.call(ents));
          read();
        }, function () { resolve(); });
      })();
    });
  }

  function fromDataTransfer(dt) {
    var out = [];
    var items = dt.items ? Array.prototype.slice.call(dt.items) : [];
    var entries = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].kind !== 'file') continue;
      var ge = items[i].webkitGetAsEntry || items[i].getAsEntry;
      var entry = ge ? ge.call(items[i]) : null;
      if (entry) entries.push(entry);
    }
    if (!entries.length) {
      for (var j = 0; j < dt.files.length; j++) out.push({ file: dt.files[j], path: dt.files[j].name });
      return Promise.resolve(out);
    }
    var k = 0;
    return new Promise(function (resolve) {
      (function next() {
        if (k >= entries.length) return resolve(out);
        walkEntry(entries[k++], '', out, 0).then(next);
      })();
    });
  }

  /* Where the File System Access API exists, a folder can be opened once
     and revisited — which is what makes quarantine possible at all. */
  function walkHandle(dir, prefix, out, depth) {
    if (depth > 12 || out.length > MAX_FILES) return Promise.resolve(out);
    var it = dir.entries ? dir.entries() : null;
    if (!it) return Promise.resolve(out);
    function step() {
      return it.next().then(function (r) {
        if (r.done || out.length > MAX_FILES) return out;
        var name = r.value[0], h = r.value[1], p = prefix + name;
        if (h.kind === 'file') {
          out.push({ handle: h, parent: dir, name: name, path: p });
          return step();
        }
        if (h.kind === 'directory') {
          if (name === 'ALIZON-Quarantine') return step();
          if (S.skipNoise && NOISE.test(p + '/')) return step();
          return walkHandle(h, p + '/', out, depth + 1).then(step);
        }
        return step();
      }).catch(function () { return out; });
    }
    return step();
  }

  /* ---------------------------------------------------------------
     THE SCAN LOOP
     --------------------------------------------------------------- */
  function runScan() {
    if (S.scanning || !S.queue.length) return;
    S.scanning = true;
    S.cancelled = false;
    S.startedAt = Date.now();
    S.done = 0;
    S.total = S.queue.length;
    render();

    function next() {
      if (S.cancelled || !S.queue.length) {
        S.scanning = false;
        S.queue = [];
        render();
        return;
      }
      var item = S.queue.shift();
      var got = item.file ? Promise.resolve(item.file)
                          : item.handle.getFile();
      got.then(function (file) {
        if (item.handle) S.handles[item.path] = item;
        return scanOne(file, item.path);
      }).then(function (res) {
        res.path = item.path;
        if (item.handle) res.writable = true;
        S.results.push(res);
      }).catch(function (err) {
        S.results.push({
          name: item.path.split('/').pop(), path: item.path, size: item.file ? item.file.size : 0,
          format: 'Unreadable', family: 'error', verdict: 'unscannable', score: 0,
          entropy: 0, hashes: {}, nested: [], findings: [{
            id:'read-error', sev:'info', count:1, title:'File could not be read',
            detail: String((err && err.message) || err),
            why:'The browser could not open this file. Files that are locked by another program, or that moved during the scan, do this.'
          }]
        });
      }).then(function () {
        S.done++;
        /* Repaint periodically rather than per file: on a folder of
           thousands, rendering every file costs more than scanning it. */
        if (S.done % 8 === 0 || !S.queue.length) render();
        else updateProgress();
        setTimeout(next, 0);
      });
    }
    next();
  }

  function updateProgress() {
    var bar = $('pgFill'), lbl = $('pgLabel');
    if (!bar) return;
    var pct = S.total ? Math.round((S.done / S.total) * 100) : 0;
    bar.style.width = pct + '%';
    if (lbl) lbl.textContent = S.done + ' of ' + S.total + ' · ' + pct + '%';
  }

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  function render() {
    var nav = $('nav');
    var c = summary();
    var threats = c.malicious + c.suspicious;
    nav.innerHTML =
      navLink('scan', 'Scan', '◎', S.results.length || '') +
      navLink('threats', 'Detections', '⚠', threats || '') +
      navLink('signatures', 'Signatures', '⌘', '') +
      navLink('about', 'How it works', 'ⓘ', '');

    $('ttl').textContent = ({ scan:'Scan', threats:'Detections',
                              signatures:'Signature database', about:'How Shield works' })[S.view];
    $('crumb').textContent = S.results.length
      ? S.results.length + ' file' + (S.results.length === 1 ? '' : 's') + ' scanned · ' +
        threats + ' need attention'
      : 'Nothing scanned yet';

    var v = $('view');
    if (S.view === 'scan' || S.view === 'threats') v.innerHTML = viewScan(S.view === 'threats');
    else if (S.view === 'signatures') v.innerHTML = viewSignatures();
    else v.innerHTML = viewAbout();
    updateProgress();
  }

  function navLink(id, label, icon, count) {
    return '<a class="nv' + (S.view === id ? ' on' : '') + '" data-view="' + id + '" href="#">' +
      '<span class="ic">' + icon + '</span>' + esc(label) +
      (count !== '' && count ? '<span class="ct">' + count + '</span>' : '') + '</a>';
  }

  /* ---- scan view ---- */
  function viewScan(onlyThreats) {
    var c = summary();
    var h = '';

    if (S.scanning) {
      h += '<div class="card scanning"><div class="bd">' +
        '<div class="row" style="justify-content:space-between">' +
          '<b>Scanning…</b>' +
          '<button class="btn sec sm" data-act="cancel">Stop</button></div>' +
        '<div class="pg"><i id="pgFill"></i></div>' +
        '<div class="pgl" id="pgLabel">' + S.done + ' of ' + S.total + '</div>' +
      '</div></div>';
    } else {
      h += '<div class="drop" id="dropzone">' +
        '<div class="dz-ic">◎</div>' +
        '<h2>Drop files or a folder here</h2>' +
        '<p>Everything is analysed inside your browser. No file, no hash and no filename is ever uploaded — there is no server to upload it to.</p>' +
        '<div class="row" style="justify-content:center;margin-top:16px">' +
          '<button class="btn" data-act="pickFiles">Choose files</button>' +
          '<button class="btn sec" data-act="pickFolder">Choose a folder</button>' +
          (window.showDirectoryPicker
            ? '<button class="btn sec" data-act="pickWritable">Open a folder for quarantine</button>' : '') +
        '</div>' +
        '<label class="chk-line"><input type="checkbox" data-act="skipNoise"' +
          (S.skipNoise ? ' checked' : '') + '> Skip build and version-control folders</label>' +
        '<div class="chk-hint"><code>node_modules</code>, <code>.git</code>, caches and the like. ' +
          'Turn it off for a complete sweep.</div>' +
      '</div>';
    }

    if (!S.results.length) {
      h += '<div class="note info" style="margin-top:18px"><span class="t">Before you start</span>' +
        'Shield is an <b>on-demand scanner</b>. It examines files you give it, thoroughly. It does not sit in the ' +
        'background watching your machine, and it is not a replacement for the resident antivirus your operating ' +
        'system already runs — it is a second opinion you can point at a specific download, attachment or folder. ' +
        '<a href="#" data-view="about">What it checks, and what it cannot see →</a></div>';
      return h;
    }

    /* summary tiles */
    h += '<div class="grid g5" style="margin-top:18px">' +
      tile('Malicious',  c.malicious,  'acc-red',   'Do not open') +
      tile('Suspicious', c.suspicious, 'acc-amber', 'Worth checking') +
      tile('Low risk',   c.low,        'acc-sky',   'Minor notes') +
      tile('Clean',      c.clean,      'acc-green', 'Nothing found') +
      tile('Scanned',    S.results.length, 'acc-slate', bytes(c.bytes)) +
    '</div>';

    /* filter + actions */
    var shown = S.results.filter(function (r) {
      if (onlyThreats) return r.verdict === 'malicious' || r.verdict === 'suspicious';
      if (S.filter === 'all') return true;
      return r.verdict === S.filter;
    });
    shown = shown.slice().sort(function (a, b) {
      if (S.sort === 'risk') {
        var d = verdictOf(b).rank - verdictOf(a).rank;
        if (d) return d;
        return (b.score || 0) - (a.score || 0);
      }
      if (S.sort === 'size') return (b.size || 0) - (a.size || 0);
      return String(a.path).localeCompare(String(b.path));
    });

    h += '<div class="card" style="margin-top:18px"><div class="hd">' +
      '<h2>' + (onlyThreats ? 'Files needing attention' : 'Results') + '</h2>' +
      '<span class="muted" style="font-size:12px">' + shown.length + ' shown</span>' +
      '<div class="sp"></div>' +
      (onlyThreats ? '' :
        '<select class="mini" data-act="filter">' +
          opt('all', 'All verdicts', S.filter) + opt('malicious', 'Malicious', S.filter) +
          opt('suspicious', 'Suspicious', S.filter) + opt('low', 'Low risk', S.filter) +
          opt('clean', 'Clean', S.filter) + opt('unscannable', 'Unreadable', S.filter) +
        '</select>') +
      '<select class="mini" data-act="sort">' +
        opt('risk', 'Highest risk first', S.sort) + opt('size', 'Largest first', S.sort) +
        opt('name', 'By name', S.sort) +
      '</select>' +
      '<button class="btn sec sm" data-act="report">Export report</button>' +
      (S.rootHandle && (c.malicious + c.suspicious)
        ? '<button class="btn dgr sm" data-act="quarantineAll">Quarantine ' +
          (c.malicious + c.suspicious) + '</button>' : '') +
      '<button class="btn sec sm" data-act="clear">Clear</button>' +
    '</div><div class="bd tight"><div class="tw"><table><thead><tr>' +
      '<th style="width:118px">Verdict</th><th>File</th><th style="width:210px">Type</th>' +
      '<th style="width:88px">Size</th><th>What was found</th>' +
    '</tr></thead><tbody>';

    if (!shown.length) {
      h += '<tr><td colspan="5"><div class="empty"><h3>Nothing matches this filter</h3>' +
           '<p>Every file scanned came back outside the selected verdict.</p></div></td></tr>';
    }
    shown.forEach(function (r) {
      var v = verdictOf(r);
      var top = (r.findings || []).filter(function (f) { return f.sev !== 'info'; });
      h += '<tr class="clk" data-open="' + esc(r.path) + '">' +
        '<td><span class="badge ' + v.cls + '"><span class="mk">' + v.mark + '</span>' + v.label + '</span></td>' +
        '<td><div class="fn">' + esc(r.name) + '</div>' +
          (r.path !== r.name ? '<div class="fp">' + esc(r.path) + '</div>' : '') + '</td>' +
        '<td class="muted">' + esc(r.format || '—') + '</td>' +
        '<td class="num">' + bytes(r.size) + '</td>' +
        '<td>' + (top.length
            ? '<div class="fnd">' + esc(top[0].title) + '</div>' +
              (top.length > 1 ? '<div class="fp">and ' + (top.length - 1) + ' more</div>' : '')
            : '<span class="muted">—</span>') + '</td>' +
      '</tr>';
    });
    h += '</tbody></table></div></div></div>';
    return h;
  }

  function tile(label, n, cls, sub) {
    return '<div class="stat ' + cls + '"><div class="lb">' + label + '</div>' +
      '<div class="vl">' + n + '</div><div class="sub">' + esc(sub) + '</div></div>';
  }
  function opt(val, label, cur) {
    return '<option value="' + val + '"' + (cur === val ? ' selected' : '') + '>' + esc(label) + '</option>';
  }

  /* ---- detail drawer ---- */
  function openDetail(path) {
    var r = null;
    for (var i = 0; i < S.results.length; i++) if (S.results[i].path === path) { r = S.results[i]; break; }
    if (!r) return;
    S.selected = r;
    var v = verdictOf(r);
    $('drTitle').innerHTML = '<span class="badge ' + v.cls + '"><span class="mk">' + v.mark + '</span>' +
      v.label + '</span> <span class="drname">' + esc(r.name) + '</span>';

    var h = '<div class="note ' + (r.verdict === 'malicious' ? 'bad' : r.verdict === 'suspicious' ? 'warn' :
              r.verdict === 'clean' ? 'ok' : 'info') + '">' + esc(v.advice) + '</div>';

    h += '<div class="kv">' +
      kv('Path', r.path) +
      kv('Type', r.format + (r.family ? ' · ' + r.family : '')) +
      kv('Size', bytes(r.size) + (r.partial ? ' (analysed in part)' : '')) +
      kv('Risk score', (r.score || 0) + '  \u00b7  suspicious from ' +
         window.SHIELD_SIG.bands.suspicious + ', malicious from ' + window.SHIELD_SIG.bands.malicious) +
      kv('Entropy', (r.entropy || 0).toFixed(2) + ' bits/byte' +
         (r.peakEntropy ? ' (peak ' + r.peakEntropy.toFixed(2) + ')' : '')) +
      (r.ms !== undefined ? kv('Analysed in', ms(r.ms)) : '') +
    '</div>';

    if (r.hashes && (r.hashes.sha256 || r.hashes.md5)) {
      h += '<h3 class="dh">Fingerprints</h3><div class="hashes">' +
        (r.hashes.sha256 ? hashRow('SHA-256', r.hashes.sha256) : '') +
        (r.hashes.sha1   ? hashRow('SHA-1',   r.hashes.sha1)   : '') +
        (r.hashes.md5    ? hashRow('MD5',     r.hashes.md5)    : '') +
      '</div><p class="hint">Paste a hash into a reputation service such as VirusTotal to check it against ' +
        'dozens of commercial engines. The hash identifies the file without revealing its contents, so looking ' +
        'one up shares nothing but the fingerprint.</p>';
    }

    var real = (r.findings || []).filter(function (f) { return f.sev !== 'info'; });
    var notes = (r.findings || []).filter(function (f) { return f.sev === 'info'; });

    h += '<h3 class="dh">Findings' + (real.length ? ' (' + real.length + ')' : '') + '</h3>';
    if (!real.length && !notes.length) {
      h += '<p class="hint">Nothing of note. The file parsed cleanly and matched no rule.</p>';
    }
    real.concat(notes).forEach(function (f) {
      var s = SEV[f.sev] || SEV.info;
      h += '<div class="find ' + s.cls + '">' +
        '<div class="fh"><span class="sev">' + s.label + '</span><b>' + esc(f.title) + '</b>' +
          (f.count > 1 ? '<span class="cnt">×' + f.count + '</span>' : '') + '</div>' +
        (f.detail ? '<div class="fd"><code>' + esc(f.detail) + '</code></div>' : '') +
        (f.why ? '<div class="fw">' + esc(f.why) + '</div>' : '') +
      '</div>';
    });

    if (r.pe) h += peBlock(r.pe);
    if (r.zip) h += zipBlock(r.zip);
    if (r.ole) h += oleBlock(r.ole);
    if (r.pdf) h += pdfBlock(r.pdf);

    if (r.nested && r.nested.length) {
      h += '<h3 class="dh">Inside this archive (' + r.nested.length + ' flagged)</h3>';
      r.nested.forEach(function (n) {
        var nv = verdictOf(n);
        h += '<div class="nest"><div class="row">' +
          '<span class="badge ' + nv.cls + '"><span class="mk">' + nv.mark + '</span>' + nv.label + '</span>' +
          '<b>' + esc(n.name) + '</b><span class="muted">' + esc(n.format) + ' · ' + bytes(n.size) + '</span></div>' +
          '<div class="fp">' + esc(n.path) + '</div>' +
          (n.findings || []).filter(function (f) { return f.sev !== 'info'; }).slice(0, 4).map(function (f) {
            return '<div class="nf"><span class="sev ' + (SEV[f.sev] || SEV.info).cls + '">' +
              (SEV[f.sev] || SEV.info).label + '</span> ' + esc(f.title) + '</div>';
          }).join('') +
        '</div>';
      });
    }

    if (r.writable && S.rootHandle && (r.verdict === 'malicious' || r.verdict === 'suspicious')) {
      h += '<div class="qz"><b>Quarantine this file</b>' +
        '<p>Moves it into <code>ALIZON-Quarantine/</code> inside the folder you opened and appends ' +
        '<code>.quarantined</code> so it cannot be run by a double-click. A manifest records where it came ' +
        'from, so the move can be undone.</p>' +
        '<button class="btn dgr sm" data-act="quarantineOne" data-path="' + esc(r.path) + '">Quarantine</button></div>';
    }

    $('drBody').innerHTML = h;
    $('drawer').classList.add('on');
  }

  function kv(k, v) { return '<div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div>'; }
  function hashRow(label, val) {
    return '<div class="hrow"><span class="hl">' + label + '</span>' +
      '<code class="hv">' + esc(val) + '</code>' +
      '<button class="copy" data-copy="' + esc(val) + '" title="Copy">⧉</button></div>';
  }

  function peBlock(pe) {
    var h = '<h3 class="dh">Executable structure</h3><div class="kv">' +
      kv('Architecture', pe.bits + '-bit ' + pe.machine) +
      kv('Subsystem', pe.subsystem + (pe.dll ? ' (library)' : '')) +
      kv('Runtime', pe.dotnet ? '.NET managed code' : 'Native') +
      kv('Signature', pe.signed ? 'Present (not verifiable in a browser)' : 'None') +
      kv('Built', pe.timestamp || 'not recorded') +
      kv('Imports', pe.imports + ' functions from ' + pe.dlls + ' libraries') +
      kv('Hardening', [pe.aslr ? 'ASLR' : null, pe.dep ? 'DEP' : null, pe.cfg ? 'CFG' : null]
            .filter(Boolean).join(', ') || 'none of ASLR, DEP or CFG') +
      (pe.capabilities && pe.capabilities.length ? kv('Capabilities', pe.capabilities.join(', ')) : '') +
    '</div>';
    if (pe.sectionList && pe.sectionList.length) {
      h += '<div class="tw" style="margin-top:12px"><table class="mini-t"><thead><tr>' +
        '<th>Section</th><th>Flags</th><th>On disk</th><th>In memory</th><th>Entropy</th></tr></thead><tbody>';
      pe.sectionList.forEach(function (s) {
        h += '<tr><td><code>' + esc(s.name || '(unnamed)') + '</code></td>' +
          '<td><code>' + esc(s.flags) + '</code></td>' +
          '<td class="num">' + bytes(s.rsize) + '</td>' +
          '<td class="num">' + bytes(s.vsize) + '</td>' +
          '<td class="num' + (s.entropy > 7.2 ? ' hot' : '') + '">' + s.entropy.toFixed(2) + '</td></tr>';
      });
      h += '</tbody></table></div><p class="hint">Entropy above about 7.2 means that section is compressed or ' +
           'encrypted rather than plain code. <code>W</code> together with <code>X</code> means the program can ' +
           'rewrite its own executable memory.</p>';
    }
    return h;
  }

  function zipBlock(z) {
    var h = '<h3 class="dh">Archive contents</h3><div class="kv">' +
      kv('Members', z.entries + (z.declared && z.declared !== z.entries ? ' of ' + z.declared + ' declared' : '')) +
      kv('Compressed', bytes(z.compressed)) +
      kv('Uncompressed', bytes(z.uncompressed)) +
      (z.encrypted ? kv('Encrypted members', z.encrypted + ' (cannot be scanned)') : '') +
      (z.ooxml ? kv('Office document', 'Yes — Open XML package') : '') +
    '</div>';
    if (z.names && z.names.length) {
      h += '<details class="names"><summary>' + z.names.length + ' member names</summary><ul>' +
        z.names.map(function (n) { return '<li><code>' + esc(n) + '</code></li>'; }).join('') +
      '</ul></details>';
    }
    return h;
  }

  function oleBlock(o) {
    return '<h3 class="dh">Compound document</h3><div class="kv">' +
      kv('Streams and storages', o.streams) +
      (o.installer ? kv('Installer database', 'Yes') : '') +
    '</div>' + (o.names && o.names.length
      ? '<details class="names"><summary>Stream names</summary><ul>' +
        o.names.map(function (n) { return '<li><code>' + esc(n) + '</code></li>'; }).join('') + '</ul></details>'
      : '');
  }

  function pdfBlock(p) {
    return '<h3 class="dh">PDF structure</h3><div class="kv">' +
      kv('Version', p.version) + kv('Objects', p.objects) + kv('Streams', p.streams) +
      kv('Incremental updates', p.updates) + kv('Encrypted', p.encrypted ? 'Yes' : 'No') +
    '</div>';
  }

  /* ---- signatures view ---- */
  function viewSignatures() {
    var sig = window.SHIELD_SIG;
    /* Count distinct samples, not hash entries: EICAR contributes a SHA-256
       and a SHA-1 for the same file, and reporting that as "2" would imply
       two samples are covered when only one is. */
    var names = {}, nEntries = 0;
    ['sha256', 'sha1', 'md5'].forEach(function (a) {
      Object.keys(sig.hashes[a] || {}).forEach(function (h) {
        names[sig.hashes[a][h].name] = 1; nEntries++;
      });
    });
    var base = Object.keys(names).length + ' sample' + (Object.keys(names).length === 1 ? '' : 's') +
               ' (' + nEntries + ' hash entr' + (nEntries === 1 ? 'y' : 'ies') + ')';
    return '<div class="grid g2">' +
      '<div class="card"><div class="hd"><h2>What is loaded</h2></div><div class="bd">' +
        '<div class="kv">' +
          kv('Database version', sig.version + ' (' + sig.built + ')') +
          kv('Content rules', sig.rules.length) +
          kv('Format signatures', sig.magic.length) +
          kv('Packer signatures', Object.keys(sig.packers).length) +
          kv('Windows API groups', sig.apiGroups.length) +
          kv('Built-in hashes', base) +
          kv('Imported hashes', S.extraCount ? S.extraCount + ' entries' : 'none') +
        '</div>' +
        '<div class="note info" style="margin-top:14px"><span class="t">Why the hash list is tiny</span>' +
        'A commercial engine ships millions of hashes and refreshes them hourly from a cloud service. A web page ' +
        'cannot do that, and pretending otherwise would be dishonest. Shield leans on structural analysis instead ' +
        '— parsing the format and reasoning about what it finds — which is what catches a file nobody ' +
        'has seen before. The built-in list contains only the EICAR test file, so you can prove the pipeline works.' +
        '</div>' +
      '</div></div>' +
      '<div class="card"><div class="hd"><h2>Import a hash list</h2></div><div class="bd">' +
        '<p class="hint">Paste or load SHA-256, SHA-1 or MD5 hashes, one per line. Anything after the hash on a ' +
        'line is kept as the detection name, so exports from MalwareBazaar, a threat-intel feed or your own ' +
        'institutional blocklist can be pasted in directly. Lines starting with <code>#</code> are ignored.</p>' +
        '<textarea id="hashIn" rows="8" spellcheck="false" placeholder="275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f  EICAR-Test-File&#10;44d88612fea8a8f36de82e1278abb02f  Example.MD5.Entry"></textarea>' +
        '<div class="row" style="margin-top:10px">' +
          '<button class="btn" data-act="importHashes">Load into the scanner</button>' +
          '<button class="btn sec" data-act="importFile">Load from a file</button>' +
          (S.extraCount ? '<button class="btn sec" data-act="clearHashes">Remove imported</button>' : '') +
        '</div>' +
        '<p class="hint">Imported hashes stay in this tab only. Nothing is uploaded and nothing is stored between ' +
        'visits — reload the page and the list is gone.</p>' +
      '</div></div>' +
    '</div>';
  }

  /* ---- about view ---- */
  function viewAbout() {
    var e = S.engineInfo || {};
    return '<div class="prose">' +
      '<h2>What Shield actually does</h2>' +
      '<p>You hand it files. It reads them in your browser, takes them apart according to what they really are, ' +
      'and tells you what it found and why that matters. Nothing leaves the machine: there is no upload, no ' +
      'account and no server component. The page works offline once loaded.</p>' +

      '<h3>The four passes</h3>' +
      '<ol class="steps-list">' +
        '<li><b>Identity.</b> SHA-256, SHA-1 and MD5, and the true file format read from its magic bytes rather ' +
        'than its name. This is what catches an executable called <code>invoice.pdf</code>.</li>' +
        '<li><b>Structure.</b> The format gets parsed properly. A Windows program has its section table and ' +
        '<i>import table</i> read — the list of operating-system capabilities it asked for before running a ' +
        'single instruction. An archive has its directory walked and its members decompressed and scanned in turn. ' +
        'An Office document has its storage enumerated to see whether it carries macros. A PDF has its scripts ' +
        'and automatic actions counted.</li>' +
        '<li><b>Content.</b> ' + (window.SHIELD_SIG.rules.length) + ' rules run over the file’s text, and over ' +
        'the UTF-16 strings extracted from binaries. Base64 blocks are decoded and scanned again, which is how an ' +
        'encoded PowerShell command or an executable smuggled into a text file gets caught.</li>' +
        '<li><b>Judgement.</b> Findings are weighted and summed, with a bonus when unrelated categories appear ' +
        'together — because &ldquo;packed&rdquo;, &ldquo;injects code&rdquo; and &ldquo;talks to a raw IP ' +
        'address&rdquo; mean something jointly that none of them means alone.</li>' +
      '</ol>' +

      '<h3 class="warn-h">What it cannot see</h3>' +
      '<p>This matters more than the feature list, so it is stated plainly rather than buried.</p>' +
      '<ul>' +
        '<li><b>There is no real-time protection.</b> Shield never runs in the background. It cannot stop a file ' +
        'being written, block a program starting, or notice anything you do not explicitly hand it. Keep your ' +
        'operating system’s resident antivirus switched on — Shield is a second opinion, not a replacement.</li>' +
        '<li><b>Static analysis has a ceiling.</b> A clean-looking loader that downloads its payload only after it ' +
        'starts, or a file that stays encrypted until an attacker sends the key, looks unremarkable to any scanner ' +
        'that is not running it. <i>Clean</i> here means &ldquo;nothing identifiably wrong was found&rdquo;, never ' +
        '&ldquo;safe to run&rdquo;.</li>' +
        '<li><b>Signatures can’t see a brand-new sample.</b> The built-in hash list holds one entry. Structural ' +
        'analysis is what carries the weight here, and it reasons about shape rather than identity — so it will ' +
        'flag a packed injector it has never seen, and it will not name the malware family.</li>' +
        '<li><b>Signed does not mean verified.</b> Shield can see that a Windows program carries a digital ' +
        'signature, but validating the certificate chain needs the operating system’s trust store, which a web ' +
        'page has no access to. Check Properties → Digital Signatures for that.</li>' +
        '<li><b>Encrypted archives are opaque.</b> A password-protected zip cannot be opened by anything without ' +
        'the password. Shield will say so rather than call it clean.</li>' +
        '<li><b>A scan report will flag itself.</b> Exported reports quote the strings that were matched, so ' +
        'scanning your own report will light up the same rules. Exports defang URLs for this reason.</li>' +
      '</ul>' +

      '<h3>Privacy</h3>' +
      '<p>Files are read with the browser’s own file APIs and analysed in a worker thread on your machine. ' +
      'No network request is made at any point during a scan — you can verify that in your browser’s ' +
      'developer tools, or disconnect from the network entirely and scan anyway. Nothing is written to storage: ' +
      'close the tab and every result is gone.</p>' +

      '<h3>This build</h3>' +
      '<div class="kv">' +
        kv('Engine', window.ShieldEngine.version) +
        kv('Signatures', window.SHIELD_SIG.version + ' (' + window.SHIELD_SIG.built + ')') +
        kv('Scanning thread', (worker && workerOK) ? 'Background worker' : 'Main thread (worker unavailable)') +
        kv('Archive decompression', window.ShieldEngine.haveInflate ? 'Available' : 'Unavailable in this browser') +
        kv('Cryptographic hashing', window.ShieldEngine.haveCrypto ? 'Available'
             : 'Unavailable — needs a secure (https) context') +
        kv('Folder quarantine', window.showDirectoryPicker ? 'Supported by this browser'
             : 'Needs a Chromium-based browser') +
      '</div>' +
      '<p class="hint">Shield is part of ALIZON AOS and is free to use. It carries no licence key, no account and ' +
      'no telemetry.</p>' +
    '</div>';
  }

  /* ---------------------------------------------------------------
     REPORT
     --------------------------------------------------------------- */
  function buildReport() {
    var c = summary();
    var when = new Date();
    var rows = S.results.slice().sort(function (a, b) {
      return verdictOf(b).rank - verdictOf(a).rank || (b.score || 0) - (a.score || 0);
    });
    var h = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<title>ALIZON Shield scan report</title><style>' +
      'body{font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0F172A;max-width:960px;margin:40px auto;padding:0 20px}' +
      'h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:28px 0 8px;border-bottom:1px solid #E2E8F0;padding-bottom:6px}' +
      'table{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0}th{text-align:left;background:#F8FAFC;padding:8px;border-bottom:1px solid #E2E8F0;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748B}' +
      'td{padding:8px;border-bottom:1px solid #F1F5F9;vertical-align:top}code{font-size:12px;background:#F1F5F9;padding:1px 4px;border-radius:3px;word-break:break-all}' +
      '.v{font-weight:700;white-space:nowrap}.mal{color:#B91C1C}.susp{color:#B45309}.low{color:#0369A1}.clean{color:#15803D}.uns{color:#7C3AED}' +
      '.why{color:#475569;font-size:12px}.muted{color:#64748B}.hdr{color:#64748B;font-size:12px}' +
      '.note{background:#FEF3C7;border:1px solid #FDE68A;color:#78350F;padding:10px 14px;border-radius:6px;font-size:12.5px;margin:14px 0}' +
      '</style></head><body>' +
      '<h1>ALIZON Shield — scan report</h1>' +
      '<div class="hdr">' + esc(when.toString()) + ' · engine ' + esc(window.ShieldEngine.version) +
        ' · signatures ' + esc(window.SHIELD_SIG.version) + '</div>' +
      '<div class="note"><b>Read this first.</b> Shield is an on-demand static scanner. A <i>clean</i> result means ' +
      'nothing identifiably wrong was found, not that a file is safe to run. Indicators below are defanged ' +
      '(<code>hxxp://</code>, <code>example[.]com</code>) so this report cannot be clicked into action.</div>' +
      '<h2>Summary</h2><table><tr><th>Malicious</th><th>Suspicious</th><th>Low risk</th><th>Clean</th>' +
      '<th>Unreadable</th><th>Total</th><th>Data</th></tr><tr>' +
      '<td class="v mal">' + c.malicious + '</td><td class="v susp">' + c.suspicious + '</td>' +
      '<td class="v low">' + c.low + '</td><td class="v clean">' + c.clean + '</td>' +
      '<td class="v uns">' + c.unscannable + '</td><td>' + S.results.length + '</td><td>' + bytes(c.bytes) + '</td>' +
      '</tr></table>';

    var flagged = rows.filter(function (r) { return r.verdict === 'malicious' || r.verdict === 'suspicious'; });
    if (flagged.length) {
      h += '<h2>Files needing attention (' + flagged.length + ')</h2>';
      flagged.forEach(function (r) {
        var cls = r.verdict === 'malicious' ? 'mal' : 'susp';
        h += '<h3 style="margin:18px 0 4px"><span class="v ' + cls + '">' + verdictOf(r).label + '</span> — ' +
          esc(r.name) + '</h3>' +
          '<div class="muted" style="font-size:12px">' + esc(defang(r.path)) + '</div>' +
          '<table><tr><th style="width:120px">Type</th><td>' + esc(r.format) + '</td></tr>' +
          '<tr><th>Size</th><td>' + bytes(r.size) + '</td></tr>' +
          (r.hashes && r.hashes.sha256 ? '<tr><th>SHA-256</th><td><code>' + esc(r.hashes.sha256) + '</code></td></tr>' : '') +
          (r.hashes && r.hashes.md5 ? '<tr><th>MD5</th><td><code>' + esc(r.hashes.md5) + '</code></td></tr>' : '') +
          '<tr><th>Score</th><td>' + (r.score || 0) + '</td></tr></table>' +
          '<table><tr><th style="width:80px">Severity</th><th>Finding</th></tr>' +
          (r.findings || []).map(function (f) {
            return '<tr><td>' + esc((SEV[f.sev] || SEV.info).label) + '</td><td><b>' + esc(f.title) + '</b>' +
              (f.detail ? '<br><code>' + esc(defang(f.detail)) + '</code>' : '') +
              (f.why ? '<div class="why">' + esc(f.why) + '</div>' : '') + '</td></tr>';
          }).join('') + '</table>';
      });
    }

    h += '<h2>All files (' + rows.length + ')</h2><table><tr><th>Verdict</th><th>File</th><th>Type</th>' +
         '<th>Size</th><th>SHA-256</th></tr>';
    rows.forEach(function (r) {
      var cls = { malicious:'mal', suspicious:'susp', low:'low', clean:'clean', unscannable:'uns' }[r.verdict] || '';
      h += '<tr><td class="v ' + cls + '">' + verdictOf(r).label + '</td><td>' + esc(defang(r.path)) + '</td>' +
        '<td class="muted">' + esc(r.format) + '</td><td>' + bytes(r.size) + '</td>' +
        '<td><code>' + esc((r.hashes && r.hashes.sha256) ? r.hashes.sha256.slice(0, 32) + '…' : '—') + '</code></td></tr>';
    });
    h += '</table></body></html>';
    return h;
  }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  /* ---------------------------------------------------------------
     QUARANTINE
     Only possible where a folder was opened for writing. The copy is
     written and verified before the original is removed, so an
     interruption leaves a duplicate rather than nothing at all.
     --------------------------------------------------------------- */
  function quarantine(paths) {
    if (!S.rootHandle) return Promise.resolve();
    var moved = [], failed = [];
    return S.rootHandle.getDirectoryHandle('ALIZON-Quarantine', { create: true }).then(function (qdir) {
      var i = 0;
      function next() {
        if (i >= paths.length) return;
        var path = paths[i++];
        var rec = S.handles[path];
        if (!rec) { failed.push(path + ' (no longer open)'); return next(); }
        var safe = path.replace(/[\\\/]/g, '__') + '.quarantined';
        return rec.handle.getFile()
          .then(function (file) { return file.arrayBuffer().then(function (b) { return { b:b, size:file.size }; }); })
          .then(function (d) {
            return qdir.getFileHandle(safe, { create: true })
              .then(function (fh) { return fh.createWritable(); })
              .then(function (w) { return w.write(d.b).then(function () { return w.close(); }); })
              .then(function () { return qdir.getFileHandle(safe); })
              .then(function (fh) { return fh.getFile(); })
              .then(function (written) {
                /* Verify before destroying the original. */
                if (written.size !== d.size) throw new Error('copy size mismatch');
                return rec.parent.removeEntry(rec.name);
              })
              .then(function () {
                moved.push({ original: path, quarantined: 'ALIZON-Quarantine/' + safe,
                             size: d.size, movedAt: new Date().toISOString() });
              });
          })
          .catch(function (err) { failed.push(path + ' (' + ((err && err.message) || err) + ')'); })
          .then(next);
      }
      return Promise.resolve(next()).then(function () {
        if (!moved.length) return;
        S.quarantined = S.quarantined.concat(moved);
        var manifest = JSON.stringify({
          tool: 'ALIZON Shield', written: new Date().toISOString(),
          note: 'Each entry records where a quarantined file came from. To restore one, rename it back and move ' +
                'it to its original path. These files were flagged by a scanner and may be dangerous.',
          files: S.quarantined
        }, null, 2);
        return qdir.getFileHandle('_manifest.json', { create: true })
          .then(function (fh) { return fh.createWritable(); })
          .then(function (w) { return w.write(manifest).then(function () { return w.close(); }); });
      }).then(function () {
        /* Reflect the move in the results table. */
        moved.forEach(function (m) {
          for (var k = 0; k < S.results.length; k++) {
            if (S.results[k].path === m.original) {
              S.results[k].quarantined = true;
              S.results[k].writable = false;
            }
          }
        });
        modal('Quarantine complete',
          '<p>' + moved.length + ' file' + (moved.length === 1 ? '' : 's') + ' moved into ' +
          '<code>ALIZON-Quarantine/</code> and renamed with a <code>.quarantined</code> suffix so nothing can run ' +
          'them by accident. <code>_manifest.json</code> in that folder records where each one came from.</p>' +
          (failed.length ? '<div class="note warn" style="margin-top:12px"><span class="t">' + failed.length +
            ' could not be moved</span>' + failed.map(esc).join('<br>') + '</div>' : ''));
        render();
      });
    }).catch(function (err) {
      modal('Quarantine failed', '<div class="note bad">' + esc((err && err.message) || err) + '</div>' +
        '<p>Nothing was moved. This usually means write permission for the folder was withdrawn — open it ' +
        'again with <b>Open a folder for quarantine</b>.</p>');
    });
  }

  /* ---------------------------------------------------------------
     MODAL
     --------------------------------------------------------------- */
  function modal(title, body, footer) {
    $('modalT').textContent = title;
    $('modalB').innerHTML = body;
    $('modalF').innerHTML = footer || '<button class="btn sec" data-act="closeModal">Close</button>';
    $('modal').classList.add('on');
  }
  function closeModal() { $('modal').classList.remove('on'); }

  /* ---------------------------------------------------------------
     EVENTS
     --------------------------------------------------------------- */
  function pick(opts) {
    var inp = document.createElement('input');
    inp.type = 'file';
    if (opts.dir) { inp.webkitdirectory = true; inp.directory = true; }
    else inp.multiple = true;
    if (opts.accept) inp.accept = opts.accept;
    inp.style.display = 'none';
    document.body.appendChild(inp);
    inp.addEventListener('change', function () {
      var items = [];
      for (var i = 0; i < inp.files.length; i++) {
        var f = inp.files[i];
        items.push({ file: f, path: f.webkitRelativePath || f.name });
      }
      inp.remove();
      if (opts.onFiles) return opts.onFiles(inp.files);
      queueAndRun(items);
    });
    inp.click();
  }

  function queueAndRun(items) {
    if (!items.length) return;
    var skipped = addToQueue(items);
    if (skipped) {
      var msg = skipped + ' item' + (skipped === 1 ? '' : 's') + ' skipped';
      console.info('[shield] ' + msg);
    }
    runScan();
  }

  function openWritableFolder() {
    window.showDirectoryPicker({ mode: 'readwrite' }).then(function (handle) {
      S.rootHandle = handle;
      return walkHandle(handle, '', [], 0);
    }).then(function (items) {
      queueAndRun(items);
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;
      modal('Could not open the folder', '<div class="note bad">' + esc((err && err.message) || err) + '</div>');
    });
  }

  function parseHashes(text) {
    var out = { sha256:{}, sha1:{}, md5:{} }, n = 0;
    String(text).split(/\r?\n/).forEach(function (line) {
      line = line.trim();
      if (!line || line[0] === '#') return;
      var m = /^([0-9a-fA-F]{32}|[0-9a-fA-F]{40}|[0-9a-fA-F]{64})\b[\s,;|]*(.*)$/.exec(line);
      if (!m) return;
      var h = m[1].toLowerCase();
      var name = (m[2] || '').trim().replace(/^["']|["']$/g, '') || 'Imported signature';
      var algo = h.length === 64 ? 'sha256' : h.length === 40 ? 'sha1' : 'md5';
      out[algo][h] = { name: name, sev: 'critical',
        note: 'Matched an entry in the hash list you imported. A hash match is exact — this file is ' +
              'byte-for-byte identical to the one the list names.' };
      n++;
    });
    return { table: out, count: n };
  }

  function applyHashes(text) {
    var p = parseHashes(text);
    if (!p.count) {
      modal('Nothing to import',
        '<p>No SHA-256, SHA-1 or MD5 hashes were found. Each line should begin with a 32, 40 or 64-character ' +
        'hexadecimal hash; anything after it is kept as the detection name.</p>');
      return;
    }
    S.extraHashes = p.table;
    S.extraCount = p.count;
    if (worker && workerOK) worker.postMessage({ type:'hashes', hashes: p.table });
    render();
    modal('Signatures loaded',
      '<p><b>' + p.count + '</b> hash' + (p.count === 1 ? '' : 'es') + ' added for this session. Files scanned from ' +
      'now on are checked against them. Nothing was uploaded, and the list is discarded when you close the tab.</p>');
  }

  function bind() {
    /* navigation */
    document.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-view]');
      if (nav) {
        e.preventDefault();
        S.view = nav.getAttribute('data-view');
        render();
        window.scrollTo(0, 0);
        return;
      }

      var copy = e.target.closest('[data-copy]');
      if (copy) {
        var val = copy.getAttribute('data-copy');
        if (navigator.clipboard) navigator.clipboard.writeText(val);
        copy.textContent = '✓';
        setTimeout(function () { copy.innerHTML = '⧉'; }, 1200);
        return;
      }

      var row = e.target.closest('[data-open]');
      if (row) { openDetail(row.getAttribute('data-open')); return; }

      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');

      if (act === 'pickFiles')     pick({});
      else if (act === 'pickFolder') pick({ dir: true });
      else if (act === 'pickWritable') openWritableFolder();
      else if (act === 'cancel')   { S.cancelled = true; }
      else if (act === 'clear')    { S.results = []; S.handles = {}; S.selected = null; render(); }
      else if (act === 'closeModal') closeModal();
      else if (act === 'closeDrawer') $('drawer').classList.remove('on');
      else if (act === 'report') {
        download('alizon-shield-report-' + new Date().toISOString().slice(0, 10) + '.html',
                 buildReport(), 'text/html;charset=utf-8');
        download('alizon-shield-report-' + new Date().toISOString().slice(0, 10) + '.json',
                 JSON.stringify({ tool:'ALIZON Shield', engine: window.ShieldEngine.version,
                                  signatures: window.SHIELD_SIG.version,
                                  scanned: new Date().toISOString(),
                                  summary: summary(), results: S.results }, null, 2),
                 'application/json');
      }
      else if (act === 'importHashes') { var ta = $('hashIn'); if (ta) applyHashes(ta.value); }
      else if (act === 'importFile') {
        pick({ accept: '.txt,.csv,.json,.lst', onFiles: function (files) {
          if (!files.length) return;
          files[0].text().then(applyHashes);
        } });
      }
      else if (act === 'clearHashes') {
        S.extraHashes = null; S.extraCount = 0;
        if (worker && workerOK) worker.postMessage({ type:'hashes', hashes: null });
        render();
      }
      else if (act === 'quarantineOne') {
        var p = btn.getAttribute('data-path');
        modal('Quarantine this file?',
          '<p>This moves <code>' + esc(p) + '</code> into <code>ALIZON-Quarantine/</code> and renames it so it ' +
          'cannot be opened by a double-click. The original location is recorded in a manifest, so you can undo it.</p>',
          '<button class="btn sec" data-act="closeModal">Cancel</button>' +
          '<button class="btn dgr" data-act="doQuarantine" data-paths="' + esc(p) + '">Move to quarantine</button>');
      }
      else if (act === 'quarantineAll') {
        var list = S.results.filter(function (r) {
          return r.writable && !r.quarantined && (r.verdict === 'malicious' || r.verdict === 'suspicious');
        }).map(function (r) { return r.path; });
        if (!list.length) { modal('Nothing to quarantine', '<p>No flagged file in this scan is in a folder that was opened for writing.</p>'); return; }
        modal('Quarantine ' + list.length + ' file' + (list.length === 1 ? '' : 's') + '?',
          '<p>These will be moved into <code>ALIZON-Quarantine/</code> and renamed with a ' +
          '<code>.quarantined</code> suffix:</p><ul class="qlist">' +
          list.map(function (x) { return '<li><code>' + esc(x) + '</code></li>'; }).join('') + '</ul>' +
          '<p>A manifest records where each came from, so the move can be undone.</p>',
          '<button class="btn sec" data-act="closeModal">Cancel</button>' +
          '<button class="btn dgr" data-act="doQuarantine" data-paths="' + esc(list.join('\n')) + '">Move ' +
            list.length + ' to quarantine</button>');
      }
      else if (act === 'doQuarantine') {
        var paths = btn.getAttribute('data-paths').split('\n').filter(Boolean);
        closeModal();
        quarantine(paths);
      }
    });

    document.addEventListener('change', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'filter') { S.filter = e.target.value; render(); }
      else if (act === 'sort') { S.sort = e.target.value; render(); }
      else if (act === 'skipNoise') { S.skipNoise = e.target.checked; }
    });

    /* drag and drop over the whole window */
    var depth = 0;
    window.addEventListener('dragenter', function (e) {
      e.preventDefault();
      if (++depth === 1) document.body.classList.add('dragging');
    });
    window.addEventListener('dragover', function (e) { e.preventDefault(); });
    window.addEventListener('dragleave', function () {
      if (--depth <= 0) { depth = 0; document.body.classList.remove('dragging'); }
    });
    window.addEventListener('drop', function (e) {
      e.preventDefault();
      depth = 0;
      document.body.classList.remove('dragging');
      fromDataTransfer(e.dataTransfer).then(queueAndRun);
    });

    $('drClose').addEventListener('click', function () { $('drawer').classList.remove('on'); });
    $('drScrim').addEventListener('click', function () { $('drawer').classList.remove('on'); });
    $('modalSc').addEventListener('click', closeModal);
    $('modalX').addEventListener('click', closeModal);
    $('burger').addEventListener('click', function () {
      $('side').classList.toggle('open'); $('scrim').classList.toggle('on');
    });
    $('scrim').addEventListener('click', function () {
      $('side').classList.remove('open'); $('scrim').classList.remove('on');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeModal();
      $('drawer').classList.remove('on');
    });
  }

  /* ---------------------------------------------------------------
     START
     --------------------------------------------------------------- */
  function boot() {
    if (!window.ShieldEngine) {
      document.getElementById('view').innerHTML =
        '<div class="note bad"><span class="t">Shield could not start</span>' +
        'The detection engine did not load. Reload the page; if it keeps happening, the scripts are being blocked.</div>';
      return;
    }
    startWorker();
    if (!window.ShieldEngine.haveCrypto) {
      setTimeout(function () {
        modal('Hashing unavailable',
          '<p>This page is not running in a secure context, so the browser will not provide the cryptographic ' +
          'hashing API. Files can still be analysed structurally, but no SHA-256 will be computed and hash-based ' +
          'detection will not work.</p><p>Opening the page over <code>https://</code> fixes this.</p>');
      }, 400);
    }
    bind();
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
