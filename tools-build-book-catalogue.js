/* tools-build-book-catalogue.js — build the PUBLIC textbook catalogue.
   node tools-build-book-catalogue.js  →  book-catalogue.json

   The public page must show what each textbook contains without shipping the
   textbooks themselves: the book files total about a megabyte, and the whole
   point of the catalogue is that the body text stays behind the student login.
   So this extracts structure only — chapters, sections, lengths — plus the
   opening section of chapter one as a sample. */
const fs = require('fs');

const PROGRAMMES = {
  m:  { id:'pharmacy', name:'Pharmacy AI' },
  ha: { id:'hospital', name:'Hospital Administration' }
};
const SAMPLE_WORDS = 220;

function loadBooks(){
  const win = { ALIZON_TEXTBOOKS:{} };
  for(const f of fs.readdirSync('.').filter(n=>/^alizon-book-.*\.js$/.test(n)).sort()){
    /* the book files assign onto window; give them one and run them */
    new Function('window', fs.readFileSync(f,'utf8'))(win);
  }
  return win.ALIZON_TEXTBOOKS;
}

function outline(src){
  const chapters = [];
  let chapter = null;
  for(const raw of String(src||'').split('\n')){
    const line = raw.trim();
    let m;
    if((m = /^@chapter\s+(.+)$/.exec(line))){
      chapter = { title:m[1].trim(), sections:[], words:0 };
      chapters.push(chapter);
    } else if((m = /^@section\s+(.+)$/.exec(line))){
      if(chapter) chapter.sections.push(m[1].trim());
    } else if(line && !line.startsWith('@') && chapter){
      chapter.words += (line.match(/\S+/g)||[]).length;
    }
  }
  return chapters;
}

/* the first prose paragraphs of chapter one — enough to judge the writing */
function sample(src){
  const lines = String(src||'').split('\n');
  const out = [];
  let seenChapter = false, words = 0;
  for(const raw of lines){
    const line = raw.trim();
    if(/^@chapter/.test(line)){ if(seenChapter) break; seenChapter = true; continue; }
    if(!seenChapter || !line || line.startsWith('@')) continue;
    out.push(line);
    words += (line.match(/\S+/g)||[]).length;
    if(words >= SAMPLE_WORDS) break;
  }
  return out.join('\n\n');
}

const books = loadBooks();
const cat = Object.keys(books).sort((a,b)=>{
  const pa=/^ha/.test(a)?1:0, pb=/^ha/.test(b)?1:0;
  return pa-pb || (parseInt(a.replace(/\D/g,''),10)-parseInt(b.replace(/\D/g,''),10));
}).map(id=>{
  const b = books[id], meta = b.meta||{};
  const chapters = outline(b.src);
  const words = chapters.reduce((n,c)=>n+c.words,0);
  const prog = PROGRAMMES[/^ha/.test(id) ? 'ha' : 'm'];
  return {
    id, module: meta.module||'', title: meta.title||'', sub: meta.sub||'',
    programme: prog.name, programmeId: prog.id,
    course: meta.prog||'', edition: meta.ed||'', authors: meta.auth||'',
    chapters: chapters.map(c=>({ title:c.title, sections:c.sections })),
    stats: { chapters: chapters.length,
             sections: chapters.reduce((n,c)=>n+c.sections.length,0),
             words,
             pages: Math.max(1, Math.round(words/380)) },   /* ~380 words to an A4 page */
    sample: sample(b.src)
  };
});

fs.writeFileSync('book-catalogue.json', JSON.stringify({
  generated: 'run tools-build-book-catalogue.js to refresh',
  books: cat
}, null, 1));

console.log('books:', cat.length);
cat.forEach(b=>console.log(`  ${b.id.padEnd(6)} ${b.programme.padEnd(24)} M${b.module} ${String(b.stats.chapters).padStart(2)} ch ${String(b.stats.sections).padStart(3)} sec ${String(b.stats.pages).padStart(3)} pp  ${b.title.slice(0,42)}`));
console.log('catalogue size:', (fs.statSync('book-catalogue.json').size/1024).toFixed(1), 'KB');
