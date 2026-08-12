#!/usr/bin/env python3
"""Pull the finished chapters out of a textbook-authoring workflow run.

The workflow writes one journal line per agent, but the journal carries no
label — so a chapter is matched to its syllabus unit by content: the unit's
opening topic phrase against the chapter's own @chapter/@section headings.
Where both the draft and the reviewed version are present, the longer one
wins, which is always the reviewed pass.

Usage:
    python3 tools-extract-ha-chapters.py <run-id-or-journal-path> <module-no>

Writes /tmp/ha_m<N>_chapters.json, ready for tools-build-ha-book.js.
"""
import json, sys, os, re, difflib

if len(sys.argv) < 3:
    sys.exit(__doc__)

arg, module_no = sys.argv[1], str(int(sys.argv[2]))

# accept a run id or a full path
if os.path.isfile(arg):
    journal = arg
else:
    base = os.path.expanduser(
        '~/.claude/projects/-Users-kukku-Desktop/a543ad11-3958-42cd-89a4-ba675588b38f/subagents/workflows')
    journal = os.path.join(base, arg, 'journal.jsonl')
if not os.path.isfile(journal):
    sys.exit(f'no journal at {journal}')

HERE = os.path.dirname(os.path.abspath(__file__))
CUR = json.load(open(os.path.join(HERE, 'ha-curriculum.json')))
mod = CUR[module_no]
units = mod['units']

STOP = set('the a an and or of for in to with on by from into its it is are as at be that this those these '
            'introduction basics fundamentals systems system management practice practices online practical '
            'healthcare health hospital administration administrative unit module'.split())

def words(s):
    return {w for w in re.findall(r'[a-z]{4,}', s.lower()) if w not in STOP}

def topic(unit_text):
    """Everything before the first colon is the unit's own subject line."""
    return unit_text.split(':', 1)[0]

def head(text):
    lines = [l for l in text.splitlines() if l.startswith('@chapter') or l.startswith('@section')]
    return ' '.join(lines[:5])

texts = []
for line in open(journal):
    line = line.strip()
    if not line:
        continue
    row = json.loads(line)
    if row.get('type') != 'result':
        continue
    val = row.get('result')
    if isinstance(val, dict):
        val = val.get('text') or ''
    if not isinstance(val, str):
        continue
    # the book starts at a real @chapter LINE. A reviewer sometimes mentions
    # "@chapter" inside backticks in a preamble, so an index() on the bare word
    # would slice the commentary in as the opening of the book.
    m = re.search(r'^@chapter .+$', val, re.M)
    if not m:
        continue
    texts.append(val[m.start():])

if not texts:
    sys.exit('no chapters found in the journal')

# one entry per distinct chapter title, keeping the longest (the reviewed pass)
by_title = {}
for t in texts:
    title = t.splitlines()[0].strip().lower()
    if title not in by_title or len(t) > len(by_title[title]):
        by_title[title] = t
cands = list(by_title.values())
print(f'{len(texts)} results -> {len(cands)} distinct chapters')

# score every unit against every chapter, then assign 1:1 best-first
scores = []
for i, unit in enumerate(units, 1):
    uw = words(topic(unit)) | words(unit.split('|')[0])
    for c in cands:
        hw = words(head(c))
        overlap = len(uw & hw) / max(1, len(uw))
        scores.append((overlap, i, c))
scores.sort(key=lambda x: -x[0])

best, used = {}, set()
for sc, i, c in scores:
    if i in best or id(c) in used:
        continue
    best[i] = c
    used.add(id(c))
for i in range(1, len(units) + 1):          # anything unmatched takes what is left
    if i not in best:
        left = [c for c in cands if id(c) not in used]
        if left:
            best[i] = left[0]
            used.add(id(left[0]))

chapters = [{'u': u, 'text': best[u]} for u in sorted(best)]

out = {'moduleNo': int(module_no), 'moduleTitle': mod['title'], 'chapters': chapters}
path = f'/tmp/ha_m{module_no}_chapters.json'
json.dump(out, open(path, 'w'))
print(f'{path} — {len(chapters)} chapters')
for c in chapters:
    print(f"  U{c['u']}: {len(c['text'].split()):>5} words | {c['text'].splitlines()[0][:70]}")
