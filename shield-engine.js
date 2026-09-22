/* =====================================================================
   shield-engine.js — ALIZON Shield analysis engine.

   Pure analysis. No DOM, no globals beyond SHIELD_SIG, so this file
   loads identically in the page and inside a Web Worker.

   HOW IT DECIDES. Four passes, cheapest first:

     1. Identity   — SHA-256 / SHA-1 / MD5, and the real format read
                     from the file's magic bytes rather than its name.
     2. Structure  — parse the format properly. A PE file gets its
                     section table and import table read; a ZIP gets its
                     central directory walked and its entries inflated
                     and rescanned; an OLE2 document gets its storage
                     directory enumerated; a PDF gets its action and
                     script objects counted.
     3. Content    — the rule set in shield-signatures.js, run over a
                     latin-1 view of the bytes and, for binaries, over
                     the wide strings extracted from them. Base64 blobs
                     are decoded and the decoded bytes scanned again,
                     which is what catches an encoded PowerShell command
                     or an executable smuggled inside a text file.
     4. Judgement  — weighted score, plus a bonus when unrelated
                     categories of finding appear together, because
                     "packed" and "injects code" and "talks to a raw IP"
                     mean something jointly that none of them means alone.

   WHAT IT WILL MISS, stated plainly: anything whose malice only exists
   at runtime. A clean-looking loader that fetches its payload after it
   starts, a file encrypted until an attacker-supplied key arrives, or a
   novel exploit in a format this engine parses only structurally. Static
   analysis has a ceiling and this sits under it. A "clean" result here
   means "nothing identifiably wrong was found", never "safe to run".
   ===================================================================== */
(function (root) {
  'use strict';

  var SIG = root.SHIELD_SIG;
  if (!SIG) throw new Error('shield-signatures.js must load before shield-engine.js');

  /* Limits. A browser tab has one heap and no swap; these keep a folder
     scan from taking the page down. Everything a limit truncates is
     reported in the result rather than silently dropped, because a
     partial scan the user does not know about is worse than no scan. */
  var LIMITS = {
    fullRead:      64 * 1024 * 1024,   /* read entirely into memory below this */
    headTail:       8 * 1024 * 1024,   /* otherwise take this much from each end */
    textScan:      12 * 1024 * 1024,   /* bytes turned into a searchable string */
    md5:           32 * 1024 * 1024,   /* MD5 is in JS, so it gets a tighter cap */
    entropyWindow:      64 * 1024,
    nestedDepth:            3,
    nestedEntries:        400,
    nestedBytes:   48 * 1024 * 1024,
    nestedEach:    24 * 1024 * 1024,
    b64Blobs:              24,
    imports:             4000,
    sections:              96
  };

  /* ---------------------------------------------------------------
     BYTES
     --------------------------------------------------------------- */

  function hex(bytes, from, len) {
    var s = '', end = Math.min(bytes.length, from + len);
    for (var i = from; i < end; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return s.toUpperCase();
  }

  /* 1:1 byte-to-codepoint. TextDecoder('latin1') is really windows-1252,
     which remaps 0x80-0x9F and would break exact byte patterns such as a
     NOP sled, so the mapping is done by hand. */
  function latin1(bytes, cap) {
    var end = Math.min(bytes.length, cap || bytes.length), out = [], CH = 32768;
    for (var i = 0; i < end; i += CH) {
      out.push(String.fromCharCode.apply(null, bytes.subarray(i, Math.min(end, i + CH))));
    }
    return out.join('');
  }

  /* Windows stores most of its strings as UTF-16, so a latin-1 sweep of a
     PE file sees "p\0o\0w\0e\0r\0s\0h\0e\0l\0l" and matches nothing.
     Pull out runs of (printable, 0x00) pairs and hand those to the rules
     as a second text surface. */
  function wideStrings(bytes, cap) {
    var end = Math.min(bytes.length, cap || bytes.length);
    var out = [], run = [], i, c;
    for (i = 0; i + 1 < end; i += 2) {
      c = bytes[i];
      if (bytes[i + 1] === 0 && c >= 0x20 && c < 0x7f) {
        run.push(c);
      } else {
        if (run.length >= 5) out.push(String.fromCharCode.apply(null, run));
        run = [];
        /* Realign: wide strings are not guaranteed to start on an even
           offset, so step back one byte after a break. */
        if (bytes[i + 1] !== 0 && bytes[i] === 0) i--;
      }
      if (out.length > 60000) break;
    }
    if (run.length >= 5) out.push(String.fromCharCode.apply(null, run));
    return out.join('\n');
  }

  function indexOfBytes(hay, needle, from) {
    var n = needle.length, end = hay.length - n, i, j;
    if (n === 0) return -1;
    var first = needle[0];
    for (i = from || 0; i <= end; i++) {
      if (hay[i] !== first) continue;
      for (j = 1; j < n; j++) if (hay[i + j] !== needle[j]) break;
      if (j === n) return i;
    }
    return -1;
  }

  function hexToBytes(h) {
    var a = new Uint8Array(h.length / 2);
    for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16);
    return a;
  }

  /* Shannon entropy in bits per byte. 8.0 is indistinguishable from random;
     English prose sits near 4.5, x86 code near 6.0-6.5, and anything
     compressed or encrypted pins above 7.5. */
  function entropy(bytes, from, to) {
    from = from || 0; to = Math.min(to === undefined ? bytes.length : to, bytes.length);
    var n = to - from;
    if (n < 64) return 0;
    var f = new Uint32Array(256), i;
    for (i = from; i < to; i++) f[bytes[i]]++;
    var e = 0, p;
    for (i = 0; i < 256; i++) {
      if (!f[i]) continue;
      p = f[i] / n;
      e -= p * (Math.log(p) / Math.LN2);
    }
    return e;
  }

  /* The highest-entropy window in the file. A payload appended to an
     otherwise ordinary document raises this without moving the whole-file
     average enough to notice. */
  function peakEntropy(bytes) {
    var W = LIMITS.entropyWindow;
    if (bytes.length <= W) return { peak: entropy(bytes), at: 0 };
    var step = Math.max(W, Math.floor(bytes.length / 64)), best = 0, at = 0, e;
    for (var i = 0; i + W <= bytes.length; i += step) {
      e = entropy(bytes, i, i + W);
      if (e > best) { best = e; at = i; }
    }
    return { peak: best, at: at };
  }

  /* ---------------------------------------------------------------
     HASHES
     SHA-256 and SHA-1 come from WebCrypto. MD5 is implemented here
     because WebCrypto deliberately omits it — it is broken for
     signatures, but most public malware feeds still publish MD5, so an
     engine that cannot compute one cannot consume those feeds.
     --------------------------------------------------------------- */

  function toHex(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16);
    return s;
  }

  var subtle = (root.crypto && root.crypto.subtle) || null;

  function digest(algo, bytes) {
    if (!subtle) return Promise.resolve(null);
    /* Copy into a fresh buffer: a subarray view of a larger ArrayBuffer
       would hash the whole backing store. */
    var copy = new Uint8Array(bytes.length);
    copy.set(bytes);
    return subtle.digest(algo, copy.buffer).then(toHex).catch(function () { return null; });
  }

  var MD5_S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
               5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
               4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
               6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  var MD5_K = (function () {
    var k = new Int32Array(64);
    for (var i = 0; i < 64; i++) k[i] = (Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
    return k;
  })();

  function md5(bytes) {
    var len = bytes.length;
    var padLen = (((len + 8) >> 6) + 1) << 6;
    var buf = new ArrayBuffer(padLen);
    var p = new Uint8Array(buf);
    p.set(bytes);
    p[len] = 0x80;
    var dv = new DataView(buf);
    var bits = len * 8;
    dv.setUint32(padLen - 8, bits >>> 0, true);
    dv.setUint32(padLen - 4, Math.floor(bits / 4294967296), true);

    var a0 = 1732584193, b0 = -271733879, c0 = -1732584194, d0 = 271733878;
    var M = new Int32Array(16), off, j, i, F, g, tmp, A, B, C, D, s;
    for (off = 0; off < padLen; off += 64) {
      for (j = 0; j < 16; j++) M[j] = dv.getInt32(off + j * 4, true);
      A = a0; B = b0; C = c0; D = d0;
      for (i = 0; i < 64; i++) {
        if (i < 16)      { F = (B & C) | (~B & D);  g = i; }
        else if (i < 32) { F = (D & B) | (~D & C);  g = (5 * i + 1) & 15; }
        else if (i < 48) { F = B ^ C ^ D;           g = (3 * i + 5) & 15; }
        else             { F = C ^ (B | ~D);        g = (7 * i) & 15; }
        F = (F + A + MD5_K[i] + M[g]) | 0;
        A = D; D = C; C = B;
        s = MD5_S[i];
        B = (B + ((F << s) | (F >>> (32 - s)))) | 0;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }
    function le(n) {
      var o = '';
      for (var k = 0; k < 4; k++) {
        var byte = (n >>> (k * 8)) & 255;
        o += (byte < 16 ? '0' : '') + byte.toString(16);
      }
      return o;
    }
    return le(a0) + le(b0) + le(c0) + le(d0);
  }

  /* ---------------------------------------------------------------
     FILENAME
     --------------------------------------------------------------- */

  function extOf(name) {
    var base = String(name).split(/[\\\/]/).pop();
    var i = base.lastIndexOf('.');
    return i <= 0 ? '' : base.slice(i + 1).toLowerCase();
  }

  /* ---------------------------------------------------------------
     FORMAT IDENTIFICATION
     --------------------------------------------------------------- */

  var MAGIC_PREP = SIG.magic.map(function (m) {
    return { m: m, bytes: hexToBytes(m.hex) };
  });

  function identify(bytes) {
    var hits = [], i, k, sig, ok;
    for (i = 0; i < MAGIC_PREP.length; i++) {
      sig = MAGIC_PREP[i];
      var off = sig.m.off;
      if (off + sig.bytes.length > bytes.length) continue;
      ok = true;
      for (k = 0; k < sig.bytes.length; k++) {
        if (bytes[off + k] !== sig.bytes[k]) { ok = false; break; }
      }
      if (ok) hits.push(sig.m);
    }
    /* Longest magic wins: RAR5's signature extends RAR4's, and a Mach-O
       universal binary shares CAFEBABE with a Java class. */
    hits.sort(function (a, b) { return b.hex.length - a.hex.length; });
    return hits[0] || null;
  }

  function looksTextual(bytes) {
    var end = Math.min(bytes.length, 8192), printable = 0, nul = 0, c;
    if (!end) return true;
    for (var i = 0; i < end; i++) {
      c = bytes[i];
      if (c === 0) nul++;
      else if (c === 9 || c === 10 || c === 13 || (c >= 32 && c < 127) || c >= 0xc2) printable++;
    }
    return nul === 0 && printable / end > 0.92;
  }

  /* ---------------------------------------------------------------
     PORTABLE EXECUTABLE
     --------------------------------------------------------------- */

  var MACHINE = { 0x14c:'x86 (32-bit)', 0x8664:'x64', 0x1c0:'ARM', 0xaa64:'ARM64', 0x1c4:'ARMv7',
                  0x200:'Itanium', 0x5032:'RISC-V 32', 0x5064:'RISC-V 64', 0x166:'MIPS' };
  var SUBSYS = { 1:'Native/driver', 2:'Windows GUI', 3:'Windows console', 5:'OS/2', 7:'POSIX',
                 9:'Windows CE', 10:'EFI application', 11:'EFI boot driver', 12:'EFI runtime driver',
                 13:'EFI ROM', 14:'Xbox', 16:'Windows boot application' };

  function parsePE(bytes) {
    try {
      if (bytes.length < 0x40 || bytes[0] !== 0x4d || bytes[1] !== 0x5a) return null;
      var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var e_lfanew = dv.getUint32(0x3c, true);
      if (e_lfanew < 0x40 || e_lfanew + 24 > bytes.length) return null;
      if (dv.getUint32(e_lfanew, true) !== 0x00004550) return null;   /* 'PE\0\0' */

      var coff = e_lfanew + 4;
      var pe = {
        machine:    dv.getUint16(coff, true),
        nSections:  dv.getUint16(coff + 2, true),
        timestamp:  dv.getUint32(coff + 4, true),
        optSize:    dv.getUint16(coff + 16, true),
        chars:      dv.getUint16(coff + 18, true),
        sections:   [],
        imports:    [],
        dlls:       [],
        truncated:  false
      };
      pe.isDLL    = !!(pe.chars & 0x2000);
      pe.isSystem = !!(pe.chars & 0x1000);
      pe.machineName = MACHINE[pe.machine] || ('0x' + pe.machine.toString(16));

      var opt = coff + 20;
      if (opt + 2 > bytes.length) return pe;
      var magic = dv.getUint16(opt, true);
      pe.bits = magic === 0x20b ? 64 : magic === 0x10b ? 32 : 0;
      if (!pe.bits) return pe;

      pe.entryRVA   = dv.getUint32(opt + 16, true);
      pe.sizeOfImage = dv.getUint32(opt + 56, true);
      pe.subsystem  = dv.getUint16(opt + 68, true);
      pe.subsystemName = SUBSYS[pe.subsystem] || ('0x' + pe.subsystem.toString(16));
      pe.dllChars   = dv.getUint16(opt + 70, true);
      pe.aslr       = !!(pe.dllChars & 0x0040);
      pe.dep        = !!(pe.dllChars & 0x0100);
      pe.cfg        = !!(pe.dllChars & 0x4000);

      var ddOff = opt + (pe.bits === 64 ? 112 : 96);
      var nDD   = dv.getUint32(opt + (pe.bits === 64 ? 108 : 92), true);
      pe.dd = [];
      for (var d = 0; d < Math.min(nDD, 16); d++) {
        if (ddOff + d * 8 + 8 > bytes.length) break;
        pe.dd.push({ rva: dv.getUint32(ddOff + d * 8, true), size: dv.getUint32(ddOff + d * 8 + 4, true) });
      }
      pe.signed   = !!(pe.dd[4] && pe.dd[4].size > 0);
      pe.dotnet   = !!(pe.dd[14] && pe.dd[14].rva > 0);
      pe.hasTLS   = !!(pe.dd[9] && pe.dd[9].rva > 0);
      pe.hasReloc = !!(pe.dd[5] && pe.dd[5].size > 0);

      /* --- sections --- */
      var secOff = opt + pe.optSize, s, i, nameBytes, name;
      var count = Math.min(pe.nSections, LIMITS.sections);
      if (pe.nSections > LIMITS.sections) pe.truncated = true;
      for (i = 0; i < count; i++) {
        var so = secOff + i * 40;
        if (so + 40 > bytes.length) { pe.truncated = true; break; }
        nameBytes = bytes.subarray(so, so + 8);
        name = '';
        for (var n = 0; n < 8 && nameBytes[n]; n++) name += String.fromCharCode(nameBytes[n]);
        s = {
          name: name,
          vsize: dv.getUint32(so + 8, true),
          vaddr: dv.getUint32(so + 12, true),
          rsize: dv.getUint32(so + 16, true),
          raddr: dv.getUint32(so + 20, true),
          chars: dv.getUint32(so + 36, true)
        };
        s.exec  = !!(s.chars & 0x20000000);
        s.write = !!(s.chars & 0x80000000);
        s.read  = !!(s.chars & 0x40000000);
        s.code  = !!(s.chars & 0x00000020);
        if (s.raddr < bytes.length && s.rsize > 0) {
          s.entropy = entropy(bytes, s.raddr, Math.min(s.raddr + s.rsize, bytes.length));
        } else {
          s.entropy = 0;
        }
        pe.sections.push(s);
      }

      /* --- RVA to file offset --- */
      pe.rvaToOff = function (rva) {
        for (var k = 0; k < pe.sections.length; k++) {
          var sec = pe.sections[k];
          var span = Math.max(sec.vsize, sec.rsize);
          if (rva >= sec.vaddr && rva < sec.vaddr + span) {
            var o = sec.raddr + (rva - sec.vaddr);
            return (o >= 0 && o < bytes.length) ? o : -1;
          }
        }
        /* Headers are mapped at their file offset. */
        return (rva < 4096 && rva < bytes.length) ? rva : -1;
      };

      /* Where the entry point lands tells you whether the file is what it
         claims. Normal compilers put it in the first executable section;
         packers put it in the last one, which is the region they just
         decompressed into. */
      pe.entrySection = null;
      if (pe.entryRVA) {
        for (i = 0; i < pe.sections.length; i++) {
          var sc = pe.sections[i];
          if (pe.entryRVA >= sc.vaddr && pe.entryRVA < sc.vaddr + Math.max(sc.vsize, sc.rsize)) {
            pe.entrySection = sc; pe.entryIndex = i; break;
          }
        }
      }

      /* --- imports --- */
      if (pe.dd[1] && pe.dd[1].rva) {
        var impOff = pe.rvaToOff(pe.dd[1].rva), total = 0;
        if (impOff > 0) {
          for (var di = 0; di < 200; di++) {
            var de = impOff + di * 20;
            if (de + 20 > bytes.length) break;
            var oft = dv.getUint32(de, true);
            var nameRVA = dv.getUint32(de + 12, true);
            var ft = dv.getUint32(de + 16, true);
            if (!oft && !nameRVA && !ft) break;
            var dllOff = pe.rvaToOff(nameRVA), dllName = '';
            if (dllOff > 0) {
              for (var c = dllOff; c < bytes.length && bytes[c] && c - dllOff < 64; c++) {
                dllName += String.fromCharCode(bytes[c]);
              }
            }
            if (dllName) pe.dlls.push(dllName);

            var thunkRVA = oft || ft;
            var tOff = thunkRVA ? pe.rvaToOff(thunkRVA) : -1;
            if (tOff > 0) {
              var step = pe.bits === 64 ? 8 : 4;
              for (var t = 0; t < 2000 && total < LIMITS.imports; t++) {
                var to = tOff + t * step;
                if (to + step > bytes.length) break;
                var lo = dv.getUint32(to, true);
                var hi = pe.bits === 64 ? dv.getUint32(to + 4, true) : 0;
                if (!lo && !hi) break;
                var byOrdinal = pe.bits === 64 ? (hi & 0x80000000) !== 0 : (lo & 0x80000000) !== 0;
                if (byOrdinal) { total++; continue; }
                var ibnOff = pe.rvaToOff(lo);
                if (ibnOff > 0 && ibnOff + 2 < bytes.length) {
                  var fn = '';
                  for (var f = ibnOff + 2; f < bytes.length && bytes[f] && f - ibnOff < 128; f++) {
                    fn += String.fromCharCode(bytes[f]);
                  }
                  if (fn) { pe.imports.push(fn); total++; }
                }
              }
            }
          }
        }
      }

      /* Data appended past the last section. Installers and self-extractors
         legitimately carry their payload here; so does anything that
         staples a second file onto a signed binary. */
      var lastEnd = 0;
      for (i = 0; i < pe.sections.length; i++) {
        var se = pe.sections[i].raddr + pe.sections[i].rsize;
        if (se > lastEnd) lastEnd = se;
      }
      pe.overlay = bytes.length > lastEnd ? bytes.length - lastEnd : 0;
      pe.overlayAt = lastEnd;
      return pe;
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------
     ELF (identification and a few structural checks)
     --------------------------------------------------------------- */
  function parseELF(bytes) {
    try {
      if (bytes.length < 20) return null;
      if (bytes[0] !== 0x7f || bytes[1] !== 0x45 || bytes[2] !== 0x4c || bytes[3] !== 0x46) return null;
      var cls = bytes[4], end = bytes[5];
      var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var le = end === 1;
      var TYPES = { 1:'relocatable', 2:'executable', 3:'shared object', 4:'core dump' };
      var MACH = { 3:'x86', 62:'x86-64', 40:'ARM', 183:'ARM64', 243:'RISC-V', 8:'MIPS', 20:'PowerPC' };
      return {
        bits: cls === 2 ? 64 : 32,
        endian: le ? 'little' : 'big',
        type: TYPES[dv.getUint16(16, le)] || ('type ' + dv.getUint16(16, le)),
        machine: MACH[dv.getUint16(18, le)] || ('machine ' + dv.getUint16(18, le)),
        entry: cls === 2 ? dv.getUint32(24, le) : dv.getUint32(24, le),
        shnum: cls === 2 ? dv.getUint16(60, le) : dv.getUint16(48, le)
      };
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------
     ZIP / OOXML
     --------------------------------------------------------------- */

  var HAVE_INFLATE = typeof root.DecompressionStream === 'function';

  function inflateRaw(bytes) {
    if (!HAVE_INFLATE) return Promise.resolve(null);
    try {
      var copy = new Uint8Array(bytes.length);
      copy.set(bytes);
      var stream = new Blob([copy]).stream().pipeThrough(new root.DecompressionStream('deflate-raw'));
      return new Response(stream).arrayBuffer()
        .then(function (b) { return new Uint8Array(b); })
        .catch(function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }

  function parseZip(bytes) {
    /* Find the end-of-central-directory record by scanning backwards; the
       comment field means it is not at a fixed offset. */
    var sig = [0x50, 0x4b, 0x05, 0x06], eocd = -1;
    var from = Math.max(0, bytes.length - 66000);
    for (var i = bytes.length - 22; i >= from; i--) {
      if (bytes[i] === sig[0] && bytes[i+1] === sig[1] && bytes[i+2] === sig[2] && bytes[i+3] === sig[3]) { eocd = i; break; }
    }
    if (eocd < 0) return null;
    var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var total = dv.getUint16(eocd + 10, true);
    var cdOff = dv.getUint32(eocd + 16, true);

    /* ZIP64: the 32-bit fields saturate and the real values live in a
       separate record pointed at by the ZIP64 locator. */
    var zip64 = false;
    if (cdOff === 0xffffffff || total === 0xffff) {
      zip64 = true;
      for (var z = eocd - 20; z >= 0 && z > eocd - 200; z--) {
        if (bytes[z] === 0x50 && bytes[z+1] === 0x4b && bytes[z+2] === 0x06 && bytes[z+3] === 0x07) {
          var z64 = dv.getUint32(z + 8, true);
          if (z64 < bytes.length && bytes[z64] === 0x50 && bytes[z64+1] === 0x4b && bytes[z64+2] === 0x06 && bytes[z64+3] === 0x06) {
            total = dv.getUint32(z64 + 32, true);
            cdOff = dv.getUint32(z64 + 48, true);
          }
          break;
        }
      }
    }
    if (cdOff >= bytes.length) return null;

    var entries = [], p = cdOff, n = 0, truncated = false;
    while (p + 46 <= bytes.length && n < LIMITS.nestedEntries * 4) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      var flags    = dv.getUint16(p + 8, true);
      var method   = dv.getUint16(p + 10, true);
      var crc      = dv.getUint32(p + 16, true);
      var comp     = dv.getUint32(p + 20, true);
      var uncomp   = dv.getUint32(p + 24, true);
      var nameLen  = dv.getUint16(p + 28, true);
      var extraLen = dv.getUint16(p + 30, true);
      var cmtLen   = dv.getUint16(p + 32, true);
      var lho      = dv.getUint32(p + 42, true);
      var nm = '';
      for (var k = 0; k < nameLen && p + 46 + k < bytes.length; k++) nm += String.fromCharCode(bytes[p + 46 + k]);
      /* Names are UTF-8 when bit 11 is set; decode so non-Latin paths read
         correctly in the report. */
      if (flags & 0x800) {
        try { nm = decodeURIComponent(escape(nm)); } catch (e) { /* keep raw */ }
      }
      entries.push({
        name: nm, method: method, comp: comp, uncomp: uncomp, crc: crc,
        encrypted: !!(flags & 1), lho: lho, dir: /\/$/.test(nm)
      });
      p += 46 + nameLen + extraLen + cmtLen;
      n++;
      if (n >= total && total > 0) break;
    }
    if (n < total) truncated = true;
    return { entries: entries, count: total, zip64: zip64, truncated: truncated };
  }

  function readZipEntry(bytes, entry) {
    try {
      if (entry.encrypted || entry.dir) return Promise.resolve(null);
      if (entry.uncomp > LIMITS.nestedEach) return Promise.resolve(null);
      var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var lho = entry.lho;
      if (lho + 30 > bytes.length || dv.getUint32(lho, true) !== 0x04034b50) return Promise.resolve(null);
      var nameLen = dv.getUint16(lho + 26, true);
      var extraLen = dv.getUint16(lho + 28, true);
      var start = lho + 30 + nameLen + extraLen;
      var size = entry.comp;
      if (!size || start + size > bytes.length) return Promise.resolve(null);
      var raw = bytes.subarray(start, start + size);
      if (entry.method === 0) {
        var copy = new Uint8Array(raw.length); copy.set(raw);
        return Promise.resolve(copy);
      }
      if (entry.method === 8) return inflateRaw(raw);
      return Promise.resolve(null);                /* bzip2/lzma inside zip */
    } catch (e) { return Promise.resolve(null); }
  }

  /* ---------------------------------------------------------------
     OLE2 COMPOUND FILE  (legacy .doc / .xls / .ppt / .msi / .msg)
     The directory is a tree stored in a sector chain. Walking it
     properly is what distinguishes "this document contains a VBA
     project" from "the bytes 'Macros' appear somewhere in this file".
     --------------------------------------------------------------- */
  function parseOLE(bytes) {
    try {
      var SIGB = [0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1];
      for (var i = 0; i < 8; i++) if (bytes[i] !== SIGB[i]) return null;
      var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var sectorSize = 1 << dv.getUint16(30, true);
      if (sectorSize < 128 || sectorSize > 65536) return null;
      var nFat   = dv.getUint32(44, true);
      var dirStart = dv.getUint32(48, true);
      var difatStart = dv.getUint32(68, true);
      var nDifat = dv.getUint32(72, true);

      function sectorOffset(s) { return 512 + s * sectorSize; }

      /* Assemble the FAT from the 109 DIFAT entries in the header, then
         follow the DIFAT chain if the file is large enough to need one. */
      var fatSectors = [], j;
      for (j = 0; j < 109 && j < nFat; j++) {
        var fs = dv.getUint32(76 + j * 4, true);
        if (fs === 0xffffffff) break;
        fatSectors.push(fs);
      }
      var dfs = difatStart, guard = 0;
      while (dfs !== 0xffffffff && dfs !== 0xfffffffe && guard++ < nDifat + 8 && fatSectors.length < nFat) {
        var dOff = sectorOffset(dfs);
        if (dOff + sectorSize > bytes.length) break;
        var perSector = (sectorSize / 4) - 1;
        for (j = 0; j < perSector; j++) {
          var v = dv.getUint32(dOff + j * 4, true);
          if (v === 0xffffffff) break;
          fatSectors.push(v);
        }
        dfs = dv.getUint32(dOff + sectorSize - 4, true);
      }

      var fat = [];
      for (j = 0; j < fatSectors.length; j++) {
        var fo = sectorOffset(fatSectors[j]);
        if (fo + sectorSize > bytes.length) break;
        for (var e = 0; e < sectorSize / 4; e++) fat.push(dv.getUint32(fo + e * 4, true));
      }

      /* Walk the directory sector chain and read the 128-byte entries. */
      var entries = [], sec = dirStart, hops = 0, perDir = sectorSize / 128;
      while (sec !== 0xfffffffe && sec !== 0xffffffff && hops++ < 4096) {
        var base = sectorOffset(sec);
        if (base + sectorSize > bytes.length) break;
        for (var d = 0; d < perDir; d++) {
          var o = base + d * 128;
          var nameLen = dv.getUint16(o + 64, true);
          if (nameLen < 2 || nameLen > 64) continue;
          var nm = '';
          for (var c = 0; c < nameLen - 2; c += 2) {
            var ch = dv.getUint16(o + c, true);
            if (ch) nm += String.fromCharCode(ch);
          }
          var type = bytes[o + 66];
          if (!nm || (type !== 1 && type !== 2 && type !== 5)) continue;
          entries.push({
            name: nm,
            type: type === 5 ? 'root' : type === 1 ? 'storage' : 'stream',
            size: dv.getUint32(o + 120, true),
            clsid: hex(bytes, o + 80, 16)
          });
          if (entries.length > 2048) break;
        }
        sec = fat[sec];
        if (sec === undefined) break;
      }
      return { sectorSize: sectorSize, entries: entries };
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------
     BASE64
     Blobs are decoded and rescanned, which is how an encoded payload is
     caught without the engine needing a signature for the encoding of it.
     --------------------------------------------------------------- */
  var B64_RE = /[A-Za-z0-9+\/]{120,}={0,2}/g;

  function b64decode(s) {
    try {
      var bin = (root.atob || function () { throw 0; })(s.replace(/[^A-Za-z0-9+\/=]/g, ''));
      var out = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 255;
      return out;
    } catch (e) { return null; }
  }

  /* PowerShell -EncodedCommand is UTF-16LE base64, so the decoded bytes
     are half zeroes; collapse them back to readable text. */
  function maybeUtf16(bytes) {
    if (bytes.length < 8) return null;
    var zeros = 0, n = Math.min(bytes.length, 512);
    for (var i = 1; i < n; i += 2) if (bytes[i] === 0) zeros++;
    if (zeros < (n / 2) * 0.85) return null;
    var s = '';
    for (var j = 0; j + 1 < bytes.length; j += 2) s += String.fromCharCode(bytes[j] | (bytes[j + 1] << 8));
    return s;
  }

  /* ---------------------------------------------------------------
     SCORING
     --------------------------------------------------------------- */

  function Findings() {
    this.list = [];
    this.seen = {};
  }
  Findings.prototype.add = function (f) {
    if (this.seen[f.id]) { this.seen[f.id].count++; return this.seen[f.id]; }
    f.count = 1;
    this.seen[f.id] = f;
    this.list.push(f);
    return f;
  };

  function score(findings) {
    var W = SIG.weights, total = 0, cats = {}, i, f;
    for (i = 0; i < findings.length; i++) {
      f = findings[i];
      total += W[f.sev] || 0;
      if (f.sev === 'medium' || f.sev === 'high' || f.sev === 'critical') cats[f.cat || f.id] = 1;
    }
    /* Corroboration bonus. Three unrelated categories of concern is a very
       different thing from one finding repeated — it is the shape of a
       file doing several suspicious things in concert. */
    var nCats = Object.keys(cats).length;
    if (nCats >= 3) total += 12;
    if (nCats >= 5) total += 18;
    return Math.round(total);
  }

  function verdictFor(n, findings) {
    for (var i = 0; i < findings.length; i++) if (findings[i].sev === 'critical') return 'malicious';
    if (n >= SIG.bands.malicious)   return 'malicious';
    if (n >= SIG.bands.suspicious)  return 'suspicious';
    if (n >= SIG.bands.low)         return 'low';
    return 'clean';
  }

  /* ---------------------------------------------------------------
     RULE SWEEP
     --------------------------------------------------------------- */

  var SCOPE_FAMILY = {
    text:   ['script','text','html','unknown',''],
    office: ['ole','zip','rtf'],
    pdf:    ['pdf'],
    pe:     ['exe']
  };

  function ruleApplies(rule, family, ext) {
    if (rule.scope === 'any') return true;
    if (rule.scope === 'text') {
      return SCOPE_FAMILY.text.indexOf(family) >= 0 || family === 'exe' || family === 'lnk' || family === 'ole' || family === 'zip';
    }
    if (rule.scope === 'office') return SCOPE_FAMILY.office.indexOf(family) >= 0;
    if (rule.scope === 'pdf')    return family === 'pdf' || ext === 'pdf';
    if (rule.scope === 'pe')     return family === 'exe';
    return true;
  }

  function sweep(text, lower, family, ext, found, where) {
    for (var i = 0; i < SIG.rules.length; i++) {
      var r = SIG.rules[i];
      if (!ruleApplies(r, family, ext)) continue;
      /* Cheap literal gate before the expensive regex. */
      if (r.anchor && lower.indexOf(r.anchor) < 0) continue;
      var m = r.re.exec(text);
      if (!m) continue;
      found.add({
        id: r.id, sev: r.sev, cat: r.id.split('-')[0],
        title: r.title, why: r.why,
        detail: where ? (where + ': ' + snippet(m[0])) : snippet(m[0])
      });
    }
  }

  function snippet(s) {
    s = String(s).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '.').replace(/\s+/g, ' ').trim();
    return s.length > 160 ? s.slice(0, 157) + '…' : s;
  }

  /* ---------------------------------------------------------------
     THE SCAN
     --------------------------------------------------------------- */

  function analyze(bytes, meta, ctx) {
    ctx = ctx || { depth: 0, budget: LIMITS.nestedBytes, entries: 0 };
    var name = meta.name || 'unnamed';
    var ext  = extOf(name);
    var found = new Findings();
    var res = {
      name: name,
      path: meta.path || name,
      size: meta.size !== undefined ? meta.size : bytes.length,
      analysed: bytes.length,
      partial: !!meta.partial,
      ext: ext,
      depth: ctx.depth,
      findings: found.list,
      nested: [],
      info: {}
    };

    var mg = identify(bytes);
    var family = mg ? mg.family : (looksTextual(bytes) ? 'text' : 'unknown');
    res.format = mg ? mg.label : (family === 'text' ? 'Plain text or script' : 'Unrecognised binary');
    res.formatId = mg ? mg.id : family;
    res.family = family;

    /* Script extensions carrying no magic still get the text rules. */
    var SCRIPT_EXT = ['js','mjs','cjs','jse','vbs','vbe','ps1','psm1','psd1','bat','cmd','sh','bash',
                      'zsh','py','pyw','rb','pl','php','phtml','asp','aspx','jsp','jspx','hta','wsf',
                      'wsh','html','htm','xhtml','xml','svg','json','yml','yaml','sql','reg','inf',
                      'ini','conf','md','txt','csv','lua','ts','tsx','jsx','cs','java','go','rs','c','cpp','h'];
    if (family === 'text' || family === 'unknown') {
      if (SCRIPT_EXT.indexOf(ext) >= 0) { family = 'script'; res.family = 'script'; }
      if (!mg && looksTextual(bytes)) res.format = 'Plain text or script';
    }
    if (mg && mg.id === 'shebang') { family = 'script'; res.family = 'script'; }

    /* ---- entropy ---- */
    res.entropy = +entropy(bytes).toFixed(3);
    var pk = peakEntropy(bytes);
    res.peakEntropy = +pk.peak.toFixed(3);
    res.peakAt = pk.at;

    /* ---- filename ---------------------------------------------- */
    if (/[‪-‮⁦-⁩]/.test(name)) {
      found.add({ id:'name-rlo', sev:'critical', cat:'name',
        title:'Bidirectional override character in the filename',
        detail:'The name contains an invisible text-direction control character.',
        why:'These characters reverse how the rest of the name is displayed, so a file actually called "gpj.exe" can appear in every file manager as "exe.jpg". The only purpose of putting one in a filename is to make an executable look like something else.' });
    }
    var dbl = /\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|txt|rtf|zip|rar|mp[34]|avi|csv|html?|json|xml|odt)\s*\.(exe|scr|pif|com|bat|cmd|js|jse|vbs|vbe|wsf|wsh|hta|lnk|ps1|msi|jar|cpl|reg|apk|sh)$/i.exec(name);
    if (dbl) {
      found.add({ id:'name-double', sev:'high', cat:'name',
        title:'Double extension',
        detail:'Named "' + snippet(name) + '".',
        why:'A document extension followed by an executable one. Windows hides known extensions by default, so this is displayed as an innocuous ".' + dbl[1].toLowerCase() + '" file while remaining a program.' });
    }
    if (/\s{6,}\.[a-z0-9]{1,5}$/i.test(name)) {
      found.add({ id:'name-pad', sev:'high', cat:'name',
        title:'Filename padded with spaces before the extension',
        detail:'Named "' + snippet(name) + '".',
        why:'Padding pushes the real extension out of the visible part of the name in most file listings.' });
    }

    /* ---- extension versus reality ------------------------------- */
    if (mg && ext && mg.exts.indexOf(ext) < 0) {
      var lure = SIG.lureExt.indexOf(ext) >= 0;
      var dangerous = mg.family === 'exe' || mg.family === 'lnk';
      if (dangerous && lure) {
        found.add({ id:'mismatch-exe', sev:'critical', cat:'mismatch',
          title:'Executable disguised as a ' + ext.toUpperCase() + ' file',
          detail:'Content is ' + mg.label + ', but the file is named .' + ext + '.',
          why:'The bytes are unambiguous — this is a program. Nothing legitimate ships an executable under a document or image extension; the mismatch exists to get it opened.' });
      } else if (dangerous) {
        found.add({ id:'mismatch-exe2', sev:'high', cat:'mismatch',
          title:'Executable content under a .' + ext + ' extension',
          detail:'Content is ' + mg.label + '.',
          why:'The file is a program but is not named like one.' });
      } else if (lure || SIG.execExt.indexOf(ext) >= 0) {
        found.add({ id:'mismatch', sev:'medium', cat:'mismatch',
          title:'File content does not match its extension',
          detail:'Content is ' + mg.label + ', extension is .' + ext + '.',
          why:'Usually a renamed file or a wrong extension rather than an attack, but it is also the simplest way to get a blocked file type past a filter.' });
      }
    }
    if (!ext && mg && mg.family === 'exe') {
      found.add({ id:'noext-exe', sev:'low', cat:'mismatch',
        title:'Executable with no extension',
        detail:mg.label, why:'Normal on Unix-like systems; unusual on Windows.' });
    }
    if (SIG.execExt.indexOf(ext) >= 0 && ['scr','pif','hta','jse','vbe','wsf','wsh','cpl','sct','settingcontent-ms','url'].indexOf(ext) >= 0) {
      found.add({ id:'ext-rare', sev:'medium', cat:'name',
        title:'Rarely legitimate executable type (.' + ext + ')',
        detail:'Extension .' + ext + ' runs code when opened.',
        why:'These formats execute on a double-click but are almost never used by real software any more. Their continued existence is mostly as attachment lures, which is why many mail gateways strip them outright.' });
    }

    /* ---- text surfaces ------------------------------------------ */
    var text = latin1(bytes, LIMITS.textScan);
    var lower = text.toLowerCase();
    sweep(text, lower, family, ext, found, null);

    if (family === 'exe' || family === 'ole' || family === 'lnk') {
      var wide = wideStrings(bytes, LIMITS.textScan);
      if (wide) sweep(wide, wide.toLowerCase(), family, ext, found, 'UTF-16 string');
    }

    /* ---- base64 recursion --------------------------------------- */
    if (family === 'script' || family === 'text' || family === 'html' || family === 'pdf' || family === 'ole' || family === 'rtf') {
      B64_RE.lastIndex = 0;
      var m, blobs = 0;
      while ((m = B64_RE.exec(text)) && blobs < LIMITS.b64Blobs) {
        blobs++;
        var dec = b64decode(m[0]);
        if (!dec || dec.length < 16) continue;
        if (dec[0] === 0x4d && dec[1] === 0x5a) {
          found.add({ id:'b64-mz', sev:'critical', cat:'embed',
            title:'Base64 block decodes to a Windows executable',
            detail:'A ' + dec.length.toLocaleString() + '-byte MZ image encoded as text.',
            why:'A complete program hidden inside what looks like a text file. Encoding it this way is how an executable travels through channels that would block or scan a real .exe.' });
          continue;
        }
        if (dec[0] === 0x50 && dec[1] === 0x4b && dec[2] === 0x03) {
          found.add({ id:'b64-zip', sev:'high', cat:'embed',
            title:'Base64 block decodes to a ZIP archive',
            detail:dec.length.toLocaleString() + ' bytes.',
            why:'An archive carried inside a text file, which hides its contents from anything inspecting the file as text.' });
          continue;
        }
        var wtxt = maybeUtf16(dec);
        var dtxt = wtxt || latin1(dec, 262144);
        var dlow = dtxt.toLowerCase();
        var before = found.list.length;
        sweep(dtxt, dlow, 'script', ext, found, 'decoded base64');
        if (found.list.length > before) {
          found.add({ id:'b64-cmd', sev:'high', cat:'embed',
            title:'Base64 block decodes to executable commands',
            detail:snippet(dtxt.slice(0, 200)),
            why:'The findings above marked "decoded base64" were not visible in the file as written — they only appeared after decoding. Encoding a command is a deliberate act of concealment.' });
        }
      }
    }

    /* ---- embedded executable ------------------------------------ */
    if (family !== 'exe' && family !== 'zip' && family !== 'archive' && family !== 'image') {
      var mz = indexOfBytes(bytes, new Uint8Array([0x4d, 0x5a]), 1);
      var guard = 0;
      while (mz > 0 && guard++ < 24) {
        if (mz + 0x40 < bytes.length) {
          var dvv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          try {
            var lf = dvv.getUint32(mz + 0x3c, true);
            if (lf > 0x3f && mz + lf + 4 < bytes.length && dvv.getUint32(mz + lf, true) === 0x00004550) {
              found.add({ id:'embed-pe', sev:'high', cat:'embed',
                title:'Windows executable embedded inside the file',
                detail:'Valid PE header found at offset 0x' + mz.toString(16).toUpperCase() + '.',
                why:'A complete program stored inside a file of another type. Installers and self-extracting archives do this legitimately; so does a document carrying its own payload.' });
              break;
            }
          } catch (e) { /* keep looking */ }
        }
        mz = indexOfBytes(bytes, new Uint8Array([0x4d, 0x5a]), mz + 1);
      }
    }

    /* ---- entropy judgement --------------------------------------- */
    /* PE files are judged on per-section entropy in analysePE() instead: an
       installer's compressed payload sits in an overlay and would otherwise
       make every setup.exe look packed. */
    var naturallyPacked = (mg && mg.packed) || family === 'archive' || family === 'media' ||
                          family === 'zip' || (mg && mg.id === 'pe');
    if (!naturallyPacked && res.entropy > 7.2 && bytes.length > 4096) {
      found.add({ id:'entropy-high', sev:'medium', cat:'entropy',
        title:'File content is compressed or encrypted throughout',
        detail:'Whole-file entropy ' + res.entropy.toFixed(2) + ' bits/byte.',
        why:'Ordinary code and text are repetitive and measure well under 7. A value this high in a format that is not itself a compressed one means the real content is packed or encrypted, and nothing can read it until it unpacks itself.' });
    } else if (!naturallyPacked && res.peakEntropy > 7.85 && bytes.length > 65536 && res.entropy < 7.0) {
      found.add({ id:'entropy-blob', sev:'medium', cat:'entropy',
        title:'High-entropy block inside an otherwise ordinary file',
        detail:'Peak ' + res.peakEntropy.toFixed(2) + ' bits/byte near offset 0x' + res.peakAt.toString(16).toUpperCase() + '.',
        why:'One region is effectively random while the rest of the file is not. That is the shape of an encrypted payload stored inside a normal-looking carrier.' });
    }

    /* ---- format-specific ---------------------------------------- */
    if (family === 'exe' && mg && mg.id === 'pe')      analysePE(bytes, res, found, ext);
    else if (family === 'exe' && mg && mg.id === 'elf') analyseELF(bytes, res, found);
    if (family === 'pdf' || ext === 'pdf')             analysePDF(bytes, text, lower, res, found);
    if (family === 'script' || family === 'text' || family === 'html') analyseHTMLPayload(text, lower, res, found);
    if (mg && mg.id === 'ole')                         analyseOLE(bytes, res, found, ext);
    if (mg && mg.family === 'zip')                     return analyseZip(bytes, res, found, ext, ctx).then(finish);

    return Promise.resolve(finish());

    function finish() {
      res.score = score(found.list);
      /* A nested file's verdict propagates upward: an archive is exactly
         as dangerous as the worst thing inside it. */
      for (var i = 0; i < res.nested.length; i++) {
        var nv = res.nested[i];
        if (nv.verdict === 'malicious' || nv.verdict === 'suspicious') {
          res.score = Math.max(res.score, nv.score);
        }
      }
      res.verdict = verdictFor(res.score, found.list);
      found.list.sort(function (a, b) {
        var W = SIG.weights;
        return (W[b.sev] || 0) - (W[a.sev] || 0);
      });
      return res;
    }
  }

  /* ---- PE ------------------------------------------------------- */
  function analysePE(bytes, res, found, ext) {
    var pe = parsePE(bytes);
    if (!pe) {
      found.add({ id:'pe-broken', sev:'medium', cat:'pe',
        title:'Malformed PE header',
        detail:'The file starts with MZ but its PE structures do not parse.',
        why:'Either a truncated download, or a file deliberately malformed so that tools give up while Windows still loads it.' });
      return;
    }
    res.pe = {
      bits: pe.bits, machine: pe.machineName, subsystem: pe.subsystemName,
      sections: pe.sections.length, dll: pe.isDLL, dotnet: pe.dotnet,
      signed: pe.signed, imports: pe.imports.length, dlls: pe.dlls.length,
      aslr: pe.aslr, dep: pe.dep, overlay: pe.overlay,
      timestamp: pe.timestamp ? new Date(pe.timestamp * 1000).toISOString().slice(0, 10) : null,
      sectionList: pe.sections.map(function (s) {
        return { name: s.name, entropy: +s.entropy.toFixed(2), vsize: s.vsize, rsize: s.rsize,
                 flags: (s.read ? 'R' : '-') + (s.write ? 'W' : '-') + (s.exec ? 'X' : '-') };
      })
    };

    /* packers */
    var packers = {}, i, s;
    for (i = 0; i < pe.sections.length; i++) {
      var p = SIG.packers[pe.sections[i].name];
      if (p) packers[p] = 1;
    }
    var pk = Object.keys(packers);
    if (pk.length) {
      found.add({ id:'pe-packer', sev:'medium', cat:'packer',
        title:'Packed with ' + pk.join(', '),
        detail:'Section names identify ' + pk.join(', ') + '.',
        why:'The real code is compressed and only exists once the program unpacks itself in memory. Commercial software packs to deter copying and to save space, so this is not damning on its own — but it does mean nothing here can see what the program actually does.' });
    } else {
      var packedSections = 0;
      for (i = 0; i < pe.sections.length; i++) {
        if (pe.sections[i].entropy > 7.2 && pe.sections[i].rsize > 4096) packedSections++;
      }
      if (packedSections && pe.sections.length) {
        found.add({ id:'pe-packed-sec', sev:'medium', cat:'packer',
          title:packedSections + ' of ' + pe.sections.length + ' sections are compressed or encrypted',
          detail:'Section entropy above 7.2 bits/byte.',
          why:'An unidentified packer, or code encrypted until runtime. Compilers do not produce sections like this.' });
      }
    }

    /* writable + executable */
    for (i = 0; i < pe.sections.length; i++) {
      s = pe.sections[i];
      if (s.exec && s.write) {
        found.add({ id:'pe-wx', sev:'medium', cat:'pe',
          title:'Section "' + s.name + '" is both writable and executable',
          detail:'Flags RWX.',
          why:'Memory that a program can both rewrite and run is what self-modifying and self-decrypting code needs. Modern compilers never emit it; packers and shellcode loaders require it.' });
        break;
      }
    }

    /* entry point */
    if (pe.entryRVA && !pe.entrySection) {
      found.add({ id:'pe-entry-out', sev:'high', cat:'pe',
        title:'Entry point falls outside every section',
        detail:'Entry RVA 0x' + pe.entryRVA.toString(16).toUpperCase() + '.',
        why:'The address where execution begins does not lie in any declared section. Legitimate linkers cannot produce this; it is a deliberate malformation to confuse analysis tools.' });
    } else if (pe.entrySection && pe.entryIndex === pe.sections.length - 1 && pe.sections.length > 1) {
      found.add({ id:'pe-entry-last', sev:'medium', cat:'pe',
        title:'Entry point is in the last section',
        detail:'Begins in "' + pe.entrySection.name + '".',
        why:'Compilers put the entry point in the first code section. The last section is where a packer writes its unpacking stub after appending the compressed original.' });
    }
    if (!pe.entryRVA && !pe.isDLL) {
      found.add({ id:'pe-noentry', sev:'medium', cat:'pe',
        title:'Executable with no entry point',
        detail:'AddressOfEntryPoint is zero.', why:'Unusual outside resource-only DLLs.' });
    }

    /* section size anomalies */
    for (i = 0; i < pe.sections.length; i++) {
      s = pe.sections[i];
      if (s.rsize === 0 && s.vsize > 262144) {
        found.add({ id:'pe-virt', sev:'medium', cat:'pe',
          title:'Section "' + s.name + '" reserves memory but stores nothing',
          detail:(s.vsize / 1024).toFixed(0) + ' KB virtual, 0 bytes on disk.',
          why:'A large empty region carved out at load time. Typical of a packer reserving space to decompress into.' });
        break;
      }
    }

    /* timestamp */
    if (pe.timestamp) {
      var when = pe.timestamp * 1000, now = Date.now();
      if (when > now + 86400000) {
        found.add({ id:'pe-future', sev:'medium', cat:'pe',
          title:'Build timestamp is in the future',
          detail:new Date(when).toISOString().slice(0, 10),
          why:'The compile timestamp has been forged, or the build machine’s clock was wrong. Timestamps are frequently faked to frustrate the timelining of an incident.' });
      } else if (when < 788918400000 && when > 0) {
        found.add({ id:'pe-old', sev:'low', cat:'pe',
          title:'Build timestamp predates 1995',
          detail:new Date(when).toISOString().slice(0, 10), why:'Almost certainly a forged or zeroed timestamp.' });
      }
    } else {
      found.add({ id:'pe-nots', sev:'low', cat:'pe',
        title:'Build timestamp is zero',
        detail:'No compile time recorded.',
        why:'Reproducible builds zero this deliberately, so it is weak on its own — but it is also the simplest way to remove a forensic marker.' });
    }

    /* signature */
    if (!pe.signed) {
      found.add({ id:'pe-unsigned', sev:'low', cat:'trust',
        title:'Not digitally signed',
        detail:'No Authenticode certificate table.',
        why:'Most small tools and in-house builds are unsigned, so this is normal. It matters when the file claims to come from a large vendor — those are always signed.' });
    } else {
      res.pe.signedNote = true;
      found.add({ id:'pe-signed', sev:'info', cat:'trust',
        title:'Carries a digital signature',
        detail:'An Authenticode certificate table is present.',
        why:'Shield can see that a signature exists but cannot verify it: validating the certificate chain and timestamp needs the operating system’s trust store, which a web page has no access to. Treat this as "claims to be signed", not as "verified". Check the file’s Properties → Digital Signatures on Windows to confirm.' });
    }

    /* imports */
    if (pe.imports.length) {
      var set = {}, j;
      for (j = 0; j < pe.imports.length; j++) set[pe.imports[j]] = 1;
      var groups = [];
      for (j = 0; j < SIG.apiGroups.length; j++) {
        var g = SIG.apiGroups[j], hit = [];
        for (var k = 0; k < g.fns.length; k++) if (set[g.fns[k]]) hit.push(g.fns[k]);
        /* One match from a broad group is noise; require corroboration
           before reporting, except where a single API is decisive. */
        var need = (g.id === 'inject' || g.id === 'creds') ? 2 : 3;
        if (hit.length >= need) {
          groups.push(g.label);
          found.add({ id:'api-' + g.id, sev:g.sev, cat:'api',
            title:g.label + ' capability',
            detail:'Imports ' + hit.slice(0, 6).join(', ') + (hit.length > 6 ? ' and ' + (hit.length - 6) + ' more' : '') + '.',
            why:g.why });
        }
      }
      res.pe.capabilities = groups;
      var mappedSize = 0;
      for (j = 0; j < pe.sections.length; j++) mappedSize += pe.sections[j].rsize;
      if (pe.imports.length < 12 && pe.dlls.length <= 3 && mappedSize > 65536) {
        found.add({ id:'pe-fewimports', sev:'medium', cat:'packer',
          title:'Almost no imports for a file of this size',
          detail:pe.imports.length + ' functions from ' + pe.dlls.length + ' libraries across ' + (mappedSize / 1024).toFixed(0) + ' KB of sections.',
          why:'A program this large needs the operating system for far more than this. An import table this thin means the real ones are resolved at runtime, which is the standard consequence of packing.' });
      }
    } else if (!pe.dotnet) {
      found.add({ id:'pe-noimports', sev:'high', cat:'packer',
        title:'No readable import table',
        detail:'The import directory is absent or unreadable.',
        why:'Every normal Windows program declares the system functions it needs. A file with none either resolves everything by hand at runtime — a hallmark of shellcode loaders and heavily packed samples — or has a deliberately corrupted directory.' });
    }

    if (pe.overlay > 1024 * 1024) {
      found.add({ id:'pe-overlay', sev:'low', cat:'pe',
        title:'Large block of data appended after the last section',
        detail:(pe.overlay / 1048576).toFixed(1) + ' MB from offset 0x' + pe.overlayAt.toString(16).toUpperCase() + '.',
        why:'Installers and self-extracting archives store their payload here, so this is common and usually benign. It is also where a second file gets stapled onto a legitimate signed program.' });
    }
    if (pe.isSystem || /\.(sys|drv)$/i.test(res.name)) {
      found.add({ id:'pe-driver', sev:'medium', cat:'pe',
        title:'Kernel-mode driver',
        detail:pe.subsystemName + '.',
        why:'Drivers run with full control of the machine. A malicious or vulnerable one can disable security software outright, which is why signed-but-vulnerable drivers are actively traded and abused.' });
    }
  }

  /* ---- ELF ------------------------------------------------------ */
  function analyseELF(bytes, res, found) {
    var elf = parseELF(bytes);
    if (!elf) return;
    res.elf = elf;
    if (!elf.shnum) {
      found.add({ id:'elf-nosections', sev:'medium', cat:'packer',
        title:'ELF binary with no section headers',
        detail:'Section header count is zero.',
        why:'Stripping the section table breaks most analysis tools while leaving the program perfectly runnable. Some packers do it as a matter of course.' });
    }
    if (indexOfBytes(bytes, new Uint8Array([0x55, 0x50, 0x58, 0x21]), 0) > 0) {
      found.add({ id:'elf-upx', sev:'medium', cat:'packer',
        title:'UPX-packed ELF binary',
        detail:'UPX! marker present.',
        why:'The executable is compressed; its real contents are not visible until it unpacks at runtime.' });
    }
  }

  /* ---- HTML payload delivery ------------------------------------
     Blob + createObjectURL + a download attribute is how every dashboard on
     the web exports a CSV, so that combination says nothing by itself. What
     separates smuggling from an export button is that the bytes written to
     disk came from a literal embedded in the page rather than from data the
     page was working with. All three conditions are required here.
     ---------------------------------------------------------------- */
  function analyseHTMLPayload(text, lower, res, found) {
    if (lower.indexOf('blob') < 0 && lower.indexOf('createobjecturl') < 0) return;
    if (!/new\s+Blob\s*\(|msSaveOrOpenBlob|URL\.createObjectURL/i.test(text)) return;
    if (!/(?:\.download\s*=|setAttribute\s*\(\s*["']download["']\s*,)/i.test(text)) return;

    /* A long literal run of base64 or hex that is not an inline asset. Fonts,
       icons and images are written as data: URIs, so those are skipped. */
    function literalPayload(re, dataRe) {
      var m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        if (!dataRe.test(text.slice(Math.max(0, m.index - 64), m.index))) return m[0];
      }
      return null;
    }
    var payload = literalPayload(/[A-Za-z0-9+\/]{600,}={0,2}/g, /data:[\w.+-]+\/[\w.+-]+;base64,\s*$/i) ||
                  literalPayload(/[0-9a-fA-F]{1600,}/g, /data:[\w.+-]+\/[\w.+-]+;(base16|hex),\s*$/i);

    var nameMatch = /(?:\.download\s*=|["']download["']\s*,)\s*["']([^"']{1,160})["']/i.exec(text);
    var execName = !!(nameMatch && /\.(exe|scr|pif|com|bat|cmd|msi|jar|hta|vbs|vbe|js|jse|wsf|ps1|lnk|iso|img|dll|cpl|7z|cab|apk)\s*$/i.test(nameMatch[1]));

    if (payload && execName) {
      found.add({ id:'html-smuggle', sev:'critical', cat:'smuggle',
        title:'HTML smuggling \u2014 the page assembles an executable and saves it to disk',
        detail:'Embedded ' + payload.length.toLocaleString() + '-character payload, downloaded as "' + snippet(nameMatch[1]) + '".',
        why:'The file is built inside the browser out of data carried in the page, then pushed into the downloads folder. Nothing recognisable crosses the network, so a mail gateway or proxy inspecting the traffic sees only HTML. This page is the delivery mechanism; the file it writes is the payload.' });
    } else if (payload) {
      found.add({ id:'html-payload', sev:'high', cat:'smuggle',
        title:'Page carries an embedded payload it writes to disk',
        detail:'Embedded ' + payload.length.toLocaleString() + '-character literal alongside a download action.',
        why:'An export button builds its file from data the page is already working with. A long literal blob compiled into the page itself and saved out as a file is a different thing \u2014 the page is a container for whatever it delivers.' });
    } else if (execName) {
      found.add({ id:'html-execdl', sev:'medium', cat:'smuggle',
        title:'Page offers an executable download',
        detail:'Download named "' + snippet(nameMatch[1]) + '".',
        why:'The page writes out a program rather than a document. Expected on a software download page; worth questioning in a file that arrived as an attachment.' });
    }
  }

  /* ---- PDF ------------------------------------------------------ */
  function analysePDF(bytes, text, lower, res, found) {
    var ver = /^%PDF-(\d\.\d)/.exec(text);
    res.pdf = {
      version: ver ? ver[1] : 'unknown',
      objects: (text.match(/\d+\s+\d+\s+obj\b/g) || []).length,
      streams: (text.match(/\bstream\b/g) || []).length,
      updates: Math.max(0, (text.match(/%%EOF/g) || []).length - 1),
      encrypted: lower.indexOf('/encrypt') >= 0
    };
    if (res.pdf.encrypted) {
      found.add({ id:'pdf-enc', sev:'low', cat:'pdf',
        title:'PDF is encrypted',
        detail:'An /Encrypt dictionary is present.',
        why:'Often just a permissions password on an ordinary document. It does mean parts of the file cannot be inspected here.' });
    }
    if (res.pdf.updates >= 3) {
      found.add({ id:'pdf-updates', sev:'low', cat:'pdf',
        title:res.pdf.updates + ' incremental updates',
        detail:'Multiple %%EOF markers.',
        why:'The file has been appended to repeatedly. Normal for signed or reviewed documents; also a way to hide an object behind revisions a simple parser will not reach.' });
    }
  }

  /* ---- OLE2 ----------------------------------------------------- */
  function analyseOLE(bytes, res, found, ext) {
    var ole = parseOLE(bytes);
    if (!ole) return;
    var names = ole.entries.map(function (e) { return e.name; });
    res.ole = { streams: ole.entries.length, names: names.slice(0, 60) };

    var hasVBA = names.some(function (n) {
      return /^(Macros|_VBA_PROJECT_CUR|VBA|_VBA_PROJECT|dir)$/i.test(n);
    }) || names.some(function (n) { return /^VBA$/i.test(n); });
    if (hasVBA) {
      found.add({ id:'ole-vba', sev:'high', cat:'macro',
        title:'Document contains VBA macros',
        detail:'A macro storage is present in the compound file.',
        why:'Macros are code that runs inside Word or Excel with the same rights as you. A legitimate macro-enabled document is usually one you were expecting from someone you know; an unexpected one is the single most common way office networks get compromised.' });
    }
    if (names.some(function (n) { return /Ole10Native/i.test(n); })) {
      found.add({ id:'ole-pkg', sev:'high', cat:'macro',
        title:'Embedded file package inside the document',
        detail:'An Ole10Native stream is present.',
        why:'An arbitrary file stored inside the document, typically presented to the user as an icon to double-click.' });
    }
    if (names.some(function (n) { return /Equation|EQNEDT/i.test(n); })) {
      found.add({ id:'ole-eqn', sev:'critical', cat:'exploit',
        title:'Legacy Equation Editor object',
        detail:'An Equation stream is present.',
        why:'The Equation Editor component was withdrawn by Microsoft after years of exploitation of memory-corruption bugs in it. A document embedding one now is far more likely to be an exploit than an equation.' });
    }
    if (ext === 'msi' || names.some(function (n) { return /^(!_(Tables|Columns)|_Tables|_Columns|Property)$/i.test(n); })) {
      res.ole.installer = true;
      found.add({ id:'ole-msi', sev:'low', cat:'pe',
        title:'Windows Installer package',
        detail:'MSI database streams present.',
        why:'An installer makes system-wide changes by design, including running custom actions. Only run one you obtained from the vendor directly.' });
    }
  }

  /* ---- ZIP / OOXML ---------------------------------------------- */
  function analyseZip(bytes, res, found, ext, ctx) {
    var zip = parseZip(bytes);
    if (!zip) {
      found.add({ id:'zip-broken', sev:'low', cat:'zip',
        title:'ZIP directory could not be read',
        detail:'No end-of-central-directory record found.',
        why:'A truncated download, a self-extracting archive, or a container deliberately malformed so that scanners skip it while the target’s unarchiver still opens it.' });
      return Promise.resolve();
    }

    var names = zip.entries.map(function (e) { return e.name; });
    var isOOXML = names.indexOf('[Content_Types].xml') >= 0;
    var totalUncomp = 0, totalComp = 0, encrypted = 0, i, e;
    for (i = 0; i < zip.entries.length; i++) {
      e = zip.entries[i];
      totalUncomp += e.uncomp; totalComp += e.comp;
      if (e.encrypted) encrypted++;
    }
    res.zip = {
      entries: zip.entries.length, declared: zip.count, ooxml: isOOXML,
      uncompressed: totalUncomp, compressed: totalComp, encrypted: encrypted,
      names: names.slice(0, 80)
    };

    if (encrypted) {
      found.add({ id:'zip-enc', sev:'medium', cat:'zip',
        title:encrypted + ' encrypted entr' + (encrypted === 1 ? 'y' : 'ies') + ' — contents cannot be scanned',
        detail:'Password-protected members.',
        why:'No scanner can look inside a password-protected archive. Sending one with the password in the same email is a standard technique for getting a payload past a mail gateway intact — the gateway cannot open it, but the recipient can.' });
    }

    /* zip bomb */
    var ratio = totalComp > 0 ? totalUncomp / totalComp : 0;
    if (ratio > 1000 && totalUncomp > 50 * 1024 * 1024) {
      found.add({ id:'zip-bomb', sev:'high', cat:'zip',
        title:'Extreme compression ratio (' + Math.round(ratio) + ':1)',
        detail:(totalComp / 1024).toFixed(0) + ' KB expands to ' + (totalUncomp / 1048576).toFixed(0) + ' MB.',
        why:'A decompression bomb: a small archive that expands until it exhausts disk or memory. Used to knock over scanners and mail gateways rather than to steal anything.' });
    }

    /* zip slip */
    for (i = 0; i < zip.entries.length; i++) {
      var nm = zip.entries[i].name;
      if (/(^|[\\\/])\.\.[\\\/]/.test(nm) || /^([a-zA-Z]:[\\\/]|[\\\/])/.test(nm)) {
        found.add({ id:'zip-slip', sev:'high', cat:'zip',
          title:'Archive entry escapes the extraction directory',
          detail:'Entry path "' + snippet(nm) + '".',
          why:'A path that climbs out of the target folder, or an absolute one. On an unarchiver that does not sanitise paths this overwrites files elsewhere on the system — a startup script, an SSH key, a binary on the PATH.' });
        break;
      }
    }

    /* dangerous members */
    var BIN_IN_ZIP = ['exe','scr','pif','com','bat','cmd','msi','msp','hta','jse','vbe',
                      'wsf','wsh','cpl','lnk','reg','inf','sct','jar','apk','app','dmg',
                      'msc','gadget','vbs','ps1','settingcontent-ms','url'];
    var binary = [], scripts = [];
    for (i = 0; i < zip.entries.length; i++) {
      if (zip.entries[i].dir) continue;
      var en = extOf(zip.entries[i].name);
      if (BIN_IN_ZIP.indexOf(en) >= 0) binary.push(zip.entries[i].name);
      else if (['js','mjs','cjs','py','pyw','sh','bash','rb','pl'].indexOf(en) >= 0) scripts.push(zip.entries[i].name);
    }
    if (binary.length && !isOOXML) {
      found.add({ id:'zip-exec', sev:'medium', cat:'zip',
        title:'Archive contains ' + binary.length + ' executable file' + (binary.length === 1 ? '' : 's'),
        detail:binary.slice(0, 5).map(snippet).join(', ') + (binary.length > 5 ? ' …' : ''),
        why:'Programs inside an archive. Perfectly normal for software distribution, and the standard way a malicious attachment arrives when the raw file type would be blocked.' });
    } else if (scripts.length && !isOOXML) {
      /* Source bundles are full of .js and .py. Noting them is useful; scoring
         them as though they were .exe files would flag every repository
         download, so this stays low and each member is still scanned on its
         own merits below. */
      found.add({ id:'zip-script', sev:'low', cat:'zip',
        title:'Archive contains ' + scripts.length + ' script file' + (scripts.length === 1 ? '' : 's'),
        detail:scripts.slice(0, 5).map(snippet).join(', ') + (scripts.length > 5 ? ' …' : ''),
        why:'Ordinary in a source or project archive. Worth a second look when the archive arrived as an attachment and contains little else \u2014 a lone script in a zip is a long-standing delivery trick.' });
    }

    /* OOXML */
    if (isOOXML) {
      var vba = names.filter(function (n) { return /vbaProject\.bin$/i.test(n) || /vbaData\.xml$/i.test(n); });
      var macroFreeExt = ['docx','xlsx','pptx','dotx','xltx','potx'].indexOf(ext) >= 0;
      if (vba.length) {
        if (macroFreeExt) {
          found.add({ id:'ooxml-vba-hidden', sev:'critical', cat:'macro',
            title:'Macro project inside a .' + ext + ', which cannot legitimately contain one',
            detail:vba.join(', '),
            why:'The .' + ext + ' format exists precisely to be the macro-free variant — Office will not save a macro into one. Finding a VBA project here means the file was renamed to look harmless, or built by hand to evade a policy that blocks .docm and .xlsm.' });
        } else {
          found.add({ id:'ooxml-vba', sev:'high', cat:'macro',
            title:'Document contains VBA macros',
            detail:vba.join(', '),
            why:'Macros are code that runs with your privileges the moment you click Enable Content. Expected in a departmental template you already trust, alarming in anything that arrived unannounced.' });
        }
      }
      if (names.some(function (n) { return /^xl\/macrosheets\//i.test(n); })) {
        found.add({ id:'ooxml-xlm', sev:'critical', cat:'macro',
          title:'Excel 4.0 macro sheet',
          detail:'xl/macrosheets/ present.',
          why:'A macro format from 1992 that modern Excel still executes. It sits outside the VBA security model, which is exactly why it was revived as an evasion technique.' });
      }
      if (names.some(function (n) { return /^word\/embeddings\//i.test(n) || /oleObject\d*\.bin$/i.test(n); })) {
        found.add({ id:'ooxml-ole', sev:'medium', cat:'macro',
          title:'Embedded OLE object in the document',
          detail:'Embedded object parts present.',
          why:'Another file carried inside the document. Sometimes a legitimate attachment, sometimes an executable disguised as an icon.' });
      }
    }

    /* JAR / APK */
    if (names.indexOf('classes.dex') >= 0 || names.indexOf('AndroidManifest.xml') >= 0) {
      res.zip.android = true;
      found.add({ id:'zip-apk', sev:'low', cat:'zip',
        title:'Android application package',
        detail:'classes.dex / AndroidManifest.xml present.',
        why:'An installable Android app. Shield does not analyse Dalvik bytecode or the permission manifest, so this identification is all it can offer — install only from a store you trust.' });
    }

    /* ---- recurse ---- */
    if (ctx.depth >= LIMITS.nestedDepth || !HAVE_INFLATE) {
      if (!HAVE_INFLATE && zip.entries.length) {
        found.add({ id:'zip-noinflate', sev:'info', cat:'zip',
          title:'Archive contents not decompressed',
          detail:'This browser does not provide DecompressionStream.',
          why:'Members were listed from the directory but not unpacked and scanned. A current Chrome, Edge, Firefox or Safari will do this properly.' });
      }
      return Promise.resolve();
    }

    var queue = zip.entries.filter(function (x) {
      return !x.dir && !x.encrypted && x.uncomp > 0 && x.uncomp <= LIMITS.nestedEach;
    });
    /* Scan the most interesting members first, so a budget that runs out
       runs out on a readme rather than on the payload. */
    queue.sort(function (a, b) { return priority(b.name) - priority(a.name); });
    queue = queue.slice(0, LIMITS.nestedEntries);

    var idx = 0;
    function next() {
      if (idx >= queue.length || ctx.budget <= 0 || ctx.entries > LIMITS.nestedEntries) {
        return Promise.resolve();
      }
      var entry = queue[idx++];
      ctx.entries++;
      return readZipEntry(bytes, entry).then(function (data) {
        if (!data || !data.length) return next();
        ctx.budget -= data.length;
        var childCtx = { depth: ctx.depth + 1, budget: ctx.budget, entries: ctx.entries };
        return analyze(data, {
          name: entry.name.split('/').pop() || entry.name,
          path: res.path + ' › ' + entry.name,
          size: data.length
        }, childCtx).then(function (child) {
          ctx.entries = childCtx.entries;
          ctx.budget = childCtx.budget;
          if (child.verdict !== 'clean' || child.findings.length) res.nested.push(child);
          if (child.verdict === 'malicious' || child.verdict === 'suspicious') {
            found.add({ id:'zip-child-' + child.verdict, sev: child.verdict === 'malicious' ? 'critical' : 'high',
              cat:'nested',
              title:'Archive contains a ' + child.verdict + ' file',
              detail:entry.name + ' — ' + (child.findings[0] ? child.findings[0].title : 'see detail'),
              why:'An archive is only as safe as its contents. Extracting this would put the flagged file on your disk.' });
          }
          return next();
        });
      }).catch(function () { return next(); });
    }

    function priority(n) {
      var e = extOf(n);
      if (/vbaProject\.bin$/i.test(n)) return 100;
      if (/\.rels$/i.test(n)) return 70;
      if (SIG.execExt.indexOf(e) >= 0) return 90;
      if (['xml','js','vbs','ps1','bat','cmd','html','htm'].indexOf(e) >= 0) return 60;
      if (['png','jpg','jpeg','gif','woff','woff2','ttf','svg'].indexOf(e) >= 0) return 5;
      return 30;
    }

    return next();
  }

  /* ---------------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------------- */

  function readBytes(file) {
    if (file.size <= LIMITS.fullRead) {
      return file.arrayBuffer().then(function (b) {
        return { bytes: new Uint8Array(b), partial: false };
      });
    }
    /* Too large to hold entirely. Take the head (headers, imports, scripts
       all live there) and the tail (archive directories, appended
       payloads, overlays), and say so in the result. */
    var n = LIMITS.headTail;
    return Promise.all([
      file.slice(0, n).arrayBuffer(),
      file.slice(file.size - n).arrayBuffer()
    ]).then(function (parts) {
      var a = new Uint8Array(parts[0]), b = new Uint8Array(parts[1]);
      var out = new Uint8Array(a.length + b.length);
      out.set(a, 0); out.set(b, a.length);
      return { bytes: out, partial: true };
    });
  }

  function scanFile(file, opts) {
    opts = opts || {};
    var t0 = (root.performance && root.performance.now) ? root.performance.now() : Date.now();
    var meta = {
      name: file.name || 'unnamed',
      path: opts.path || file.webkitRelativePath || file.name || 'unnamed',
      size: file.size
    };

    if (file.size === 0) {
      return Promise.resolve({
        name: meta.name, path: meta.path, size: 0, analysed: 0, ext: extOf(meta.name),
        format: 'Empty file', family: 'empty', formatId: 'empty',
        entropy: 0, peakEntropy: 0, findings: [], nested: [], info: {},
        score: 0, verdict: 'clean', hashes: {}, ms: 0
      });
    }

    return readBytes(file).then(function (r) {
      meta.partial = r.partial;
      var bytes = r.bytes;
      var jobs = [digest('SHA-256', bytes), digest('SHA-1', bytes)];
      return Promise.all(jobs).then(function (h) {
        return analyze(bytes, meta, null).then(function (res) {
          res.hashes = {
            sha256: h[0],
            sha1: h[1],
            md5: (file.size <= LIMITS.md5 && !r.partial) ? md5(bytes) : null
          };
          if (r.partial) {
            res.findings.push({
              id:'partial', sev:'info', cat:'scan', count:1,
              title:'Large file — analysed in part',
              detail:'First and last ' + (LIMITS.headTail / 1048576) + ' MB of ' + (file.size / 1048576).toFixed(0) + ' MB.',
              why:'A browser tab cannot hold a file this size in memory. The hashes shown cover only the parts read, so they will not match a hash computed over the whole file. Treat a clean result here as incomplete.'
            });
          }
          /* Known-bad hash lookup happens last so it overrides everything:
             an exact match is not a heuristic. */
          checkHashes(res, opts.extraHashes);
          res.score = score(res.findings);
          res.verdict = verdictFor(res.score, res.findings);
          res.ms = Math.round(((root.performance && root.performance.now) ? root.performance.now() : Date.now()) - t0);
          return res;
        });
      });
    }).catch(function (err) {
      return {
        name: meta.name, path: meta.path, size: file.size, analysed: 0, ext: extOf(meta.name),
        format: 'Unreadable', family: 'error', formatId: 'error',
        entropy: 0, peakEntropy: 0, nested: [], info: {}, hashes: {},
        findings: [{ id:'error', sev:'info', cat:'scan', count:1,
          title:'File could not be read',
          detail:String(err && err.message || err),
          why:'The browser refused or failed to read the file. A file that is locked, was moved during the scan, or that the page has no permission to open will do this.' }],
        score: 0, verdict: 'unscannable', ms: 0
      };
    });
  }

  function checkHashes(res, extra) {
    var h = res.hashes || {}, tables = [SIG.hashes];
    if (extra) tables.push(extra);
    for (var t = 0; t < tables.length; t++) {
      var tbl = tables[t];
      ['sha256', 'sha1', 'md5'].forEach(function (algo) {
        if (!h[algo] || !tbl[algo]) return;
        var hit = tbl[algo][h[algo].toLowerCase()];
        if (!hit) return;
        res.findings.unshift({
          id: 'hash-' + algo, sev: hit.sev || 'critical', cat: 'hash', count: 1,
          title: 'Exact match for known malware: ' + hit.name,
          detail: algo.toUpperCase() + ' ' + h[algo],
          why: hit.note || 'This file’s cryptographic hash matches an entry in the signature database. A hash match is not a guess — the file is byte-for-byte identical to a sample already identified as malicious.'
        });
      });
    }
  }

  root.ShieldEngine = {
    scanFile: scanFile,
    analyze: analyze,
    limits: LIMITS,
    md5: md5,
    entropy: entropy,
    identify: identify,
    extOf: extOf,
    parsePE: parsePE,
    parseZip: parseZip,
    parseOLE: parseOLE,
    haveInflate: HAVE_INFLATE,
    haveCrypto: !!subtle,
    version: SIG.version
  };

})(typeof self !== 'undefined' ? self : this);
