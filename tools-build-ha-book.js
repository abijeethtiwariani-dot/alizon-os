/* =====================================================================
   ALIZON — assemble a Hospital Administration module textbook.

   Input : a JSON file {moduleNo, moduleTitle, chapters:[{u, unit, text}]}
           where `text` is @chapter/@section/@note/@table markup.
   Output: alizon-book-ha-m<N>.js, registering into window.ALIZON_TEXTBOOKS
           under the key 'ha<N>' — the same contract the Pharmacy books use,
           read by alizon-textbook-content.js and the Textbook Studio.

   Run:  node tools-build-ha-book.js chapters-m1.json
   ===================================================================== */
const fs = require('fs'), path = require('path');

const IN = process.argv[2];
if (!IN) { console.error('usage: node tools-build-ha-book.js <chapters.json>'); process.exit(1); }
const D = JSON.parse(fs.readFileSync(IN, 'utf8'));
const N = D.moduleNo;

const PROG = 'Advanced Certification Program in AI-Assisted Hospital Administration & Digital Healthcare Management';

/* Normalise a chapter: exactly one @chapter at the top, no stray fences, and
   the trailing whitespace tidied. Content is left alone otherwise. */
function clean(t){
  let s = String(t || '').replace(/\r/g,'').trim();
  s = s.replace(/^```[a-z]*\s*/i,'').replace(/\s*```$/,'');       /* stray code fences */
  /* a reviewer sometimes prefaces the chapter with a line of its own commentary
     ("2948 words, one @chapter, tables consistent. Corrected chapter:") — the
     book starts at the first @chapter and nothing before it belongs in print */
  const first = s.indexOf('@chapter');
  if (first > 0) s = s.slice(first);
  const lines = s.split('\n');
  let seen = false;
  const out = [];
  for (const ln of lines){
    if (/^@chapter\b/.test(ln)){
      if (seen) { out.push(ln.replace(/^@chapter\b/,'@section')); continue; }  /* demote a second one */
      seen = true;
    }
    out.push(ln.replace(/\s+$/,''));
  }
  if (!seen) out.unshift('@chapter Unit ' + (D.chapters.indexOf(t)+1));
  return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}

const chapters = (D.chapters || [])
  .slice()
  .sort((a,b)=>a.u-b.u)
  .map(c => clean(c.text));

const src = chapters.join('\n\n');
const words = src.split(/\s+/).filter(Boolean).length;

/* JS string-literal encoding, one source line per output line — the same
   shape as the Pharmacy books so the studio diffs stay readable. */
function jsLines(text){
  return text.split('\n')
    .map(l => "'" + l.replace(/\\/g,'\\\\').replace(/'/g,"\\'") + "\\n'")
    .join('+\n');
}

const banner = `/* alizon-book-ha-m${N}.js — Hospital Administration, Module ${N} textbook.

   Written from the ASAP Kerala accreditation curriculum (ha-curriculum.json),
   one chapter per syllabus unit. Unlike the Pharmacy books, which were
   converted from the author's manuscript, this text was drafted for the
   programme and then checked against the syllabus unit by unit — it should be
   reviewed by the subject faculty before it is treated as final.

   ${chapters.length} chapters · approximately ${words.toLocaleString('en-IN')} words.
*/`;

const out = `${banner}
(function(){
(window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).ha${N} = {
 meta:{module:'${N}', title:${JSON.stringify(D.moduleTitle)}, sub:"Hospital Administration & Digital Healthcare Management",
       prog:${JSON.stringify(PROG)},
       ed:'First Edition · 2026', auth:'Alizon School of Medical & Digital Intelligence'},
 src:
${jsLines(src)}
};
})();
`;

const file = path.join(__dirname, `alizon-book-ha-m${N}.js`);
fs.writeFileSync(file, out);
console.log(`wrote ${path.basename(file)} — ${chapters.length} chapters, ${words.toLocaleString('en-IN')} words, ${Math.round(out.length/1024)} KB`);
