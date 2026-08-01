#!/usr/bin/env python3
"""
Convert the author's Word textbook into Alizon textbook markup, one file per module.

Two jobs:
  1. Preserve the author's body text, headings, tables and boxes faithfully.
  2. REPLACE every "Practical Session" / "Practical N" block — those describe the
     old observational practicals ("Study of ...") and the platform now runs
     interactive simulations with different titles and different tasks.

Practical blocks in the source are a bold heading followed by a two-column
Component/Details table, so both must be dropped together.
"""
import zipfile, re, html, json, sys, os

# Module 8 is hand-authored (the manuscript held only an outline for it), so a
# regeneration from the Word file must not overwrite alizon-book-m8.js.
SKIP_MODULES = {8}

DOCX = "/Users/kukku/Downloads/Text book (1) (1).docx"
OUT  = "/Users/kukku/Desktop/junk/alizon-os-deploy"

# ---------------------------------------------------------------- real labs
# Titles and hrefs taken from DEFAULT_PROGRAMS, so the book matches the platform.
LABS = {
 1: [("1","AI Drug Discovery Lab","ALIZON-OS-Module1-AI-Drug-Discovery.html",
      "Work a molecule through an AI-assisted discovery workflow: choose a target, screen candidates, read the model's confidence and decide what to take forward."),
     ("3","Ethics, Regulation & Data Protection Lab","ALIZON-OS-Module1-Ethics-Lab.html",
      "Run a live patient-data breach as the responsible pharmacist. The inbox fills as the incident develops; you must contain, assess, notify under the DPDP Act, handle a subject access request and refuse the press."),
     ("4","RxDetect — Digital Drug Information & Formulary Investigation","ALIZON-OS-Module1-RxDetect.html",
      "Verify a live hospital prescription: interrogate simulated drug databases, judge the interactions, choose a formulary alternative, and catch the AI assistant recommending a drug the patient is allergic to.")],
 2: [("1","Digital Dispensing — FEFO/FIFO & Patient Counselling","ALIZON-OS-Module2-Dispensing.html",
      "A ten-case dispensing OSCE with real stock logic. Pick the correct batch by earliest expiry, spot the wrong strength, and counsel the patient. Scored against a 110-mark rubric with automatic critical-fail detection."),
     ("4","Electronic ADR Reporting & Pharmacovigilance","ALIZON-OS-Module2-ADR.html",
      "Interview a patient to build the history, decide seriousness and expectedness, score causality live on the Naranjo scale as answers arrive, and complete a report that meets the four minimum elements.")],
 3: [("1","CDSS Alert Management Console","ALIZON-OS-Module3-CDSS.html",
      "A twenty-minute shift on a live alert queue. Ten alerts arrive on the clock; you must open the chart before deciding, and one badged 'moderate' is the most dangerous item in the queue. Alert Fatigue and Patient Safety are tracked separately from your mark."),
     ("2","Selection of Safe & Effective Antimicrobial Therapy","ALIZON-OS-Module3-Antimicrobial.html",
      "A five-day ward round with a local antibiogram. Start empirical therapy, respond when the culture returns on day three, and de-escalate — with 'it seems to be working' as the tempting wrong answer."),
     ("3","Identifying High-Risk Patients & High-Alert Medicines","ALIZON-OS-Module3-HighRisk.html",
      "A six-bed ward against a fifteen-minute clock. Triage each bed, identify the hazard, and choose a control from the hierarchy of controls. One bed is deliberately safe.")],
 4: [("2","AI Support in Scientific Research & Data Analysis","ALIZON-OS-Module4-AIResearch.html",
      "A twenty-five row dataset with four planted problems. Clean it defensibly, choose the right test, interpret the result, and verify an AI-drafted summary against what the data actually shows."),
     ("3","Digital Quality & Safety Documentation in Pharmaceutical Manufacturing","ALIZON-OS-Module4-QADocs.html",
      "Review a twenty-line batch record containing eight findings, four of them critical. Classify each against ALCOA+, decide the batch disposition and raise the CAPA."),
     ("4","Digital Vaccine Cold-Chain Monitoring & Compliance","ALIZON-OS-Module4-ColdChain.html",
      "A visual fridge of thirty-two vials and a forty-eight point temperature trace peaking at 14.2 °C. Read the vaccine vial monitors — including a pentavalent vial with a perfect VVM that was destroyed by freezing — quarantine, assess and decide.")],
 5: [("1","Clinical Trial Phase Identification Challenge","ALIZON-OS-Module5-ClinicalTrials.html",
      "Identify the phase of each trial from its design, population and endpoint, and justify the classification."),
     ("1","Ethics Committee (IEC/IRB) Approval Simulation","ALIZON-OS-Module5-EthicsCommittee.html",
      "Sit on the committee. Review a protocol, its consent materials and its arrangements for vulnerable participants, then approve, request changes or reject — with reasons."),
     ("1","Clinical Trial Audit Readiness Challenge","ALIZON-OS-Module5-AuditReady.html",
      "Prepare a site for inspection: reconcile investigational product, check delegation and training records, and find the deviations before the auditor does."),
     ("4","Evidence-Based Therapy Escape Room — The Right Prescription","ALIZON-OS-Module5-EvidenceEscape.html",
      "Eight stages against a ninety-minute clock, with three AI mentor hints. Work from question to evidence to a defensible prescribing decision."),
     ("4","AI-Driven Literature Analysis — The Systematic Review Sprint","ALIZON-OS-Module5-LitAnalysis.html",
      "Screen, appraise and synthesise a body of literature under time pressure, using AI tools for the search and your own judgement for the appraisal."),
     ("1","Become the Clinical Trial Manager — Capstone Simulation","ALIZON-OS-Module5-TrialManager.html",
      "Run study ALZ-DM-2026-04 end to end. Every decision moves a compliance score that begins at 100% and only falls.")],
 6: [("1","Pharmacy Data Quality Audit","ALIZON-OS-Module6-DataQuality.html",
      "A 300% spike that turns out to be a duplicated import, and the defect that actually matters: a quantity column that switched from packs to units mid-year, so every total spanning the change is wrong and nothing looks unusual."),
     ("2","Model Evaluation Clinic","ALIZON-OS-Module6-ModelClinic.html",
      "Three readmission models at 6% prevalence. The 94%-accurate one finds 5 of 60; the best-discriminating one is badly calibrated and collapses for the over-80s."),
     ("3","Prescribing Analytics Investigation","ALIZON-OS-Module6-RxAnalytics.html",
      "Six prescribers and one obvious outlier. Adjust for case mix and the outlier is the best of them, while the real unwarranted variation sat mid-table."),
     ("4","Demand Forecasting & Stock Decisions","ALIZON-OS-Module6-Forecasting.html",
      "A steep demand trend that is really a contract ending in October, and a medicine worth pennies that must never run out.")],
 7: [("1","Automation Business Case","ALIZON-OS-Module7-AutomationCase.html",
      "The board wants a picking robot. Picking is not the constraint, and a robot loaded from a shelf layout that groups look-alikes reproduces the error faster."),
     ("2","Automated Dispensing Cabinet Investigation","ALIZON-OS-Module7-CabinetAudit.html",
      "A controlled-drug discrepancy with a named nurse on both counts. A technician overrode a barcode mismatch and loaded 10 mg ampoules into a 5 mg pocket."),
     ("3","Serialisation & Falsified Medicine Trace","ALIZON-OS-Module7-Serialisation.html",
      "Six packs at goods-in. The falsified one scans as verified, because its serial is real — decommissioned 900 km away three weeks ago."),
     ("4","Workflow Optimisation & Root Cause","ALIZON-OS-Module7-Workflow.html",
      "Mean turnaround fell 22% and the slowest 5% doubled — and a fifth of that tail is medicines where lateness is the harm.")],
}
CAPSTONE = ("Integrated Clinical Simulation","ALIZON-OS-Clinical-Simulation.html",
            "A full patient journey drawing on everything in the programme.")

def practical_markup(mod):
    labs = LABS.get(mod, [])
    if not labs:
        return ("@note\nThe practical programme for this module is delivered as supervised workplace "
                "exercises and case discussion. Browser-based simulations for this module are in "
                "development and will appear in the Practicals area of ALIZON OS when released.\n\n")
    out = ["@section Practical programme\n\n",
           "The practicals for this module run in ALIZON OS and are scored in the browser. Each one "
           "withholds information until you go and look for it, so the mark reflects what you "
           "investigated as well as what you concluded. Open them from the Practicals area of the "
           "portal.\n\n"]
    for i,(unit,title,href,desc) in enumerate(labs, 1):
        out.append(f"@activity Practical {i} · {title} (Unit {unit})\n{desc}\n\n")
    return "".join(out)

# ---------------------------------------------------------------- docx reading
NS_T = re.compile(r'<w:t[^>]*>(.*?)</w:t>', re.S)
def cell_text(x):
    return html.unescape(re.sub(r'<[^>]+>', '', ''.join(NS_T.findall(x)))).strip()

def para_text(p):
    return html.unescape(re.sub(r'<[^>]+>', '', ''.join(NS_T.findall(p)))).strip()

def para_bold(p):
    # bold if any run carries <w:b/> and the paragraph is short enough to be a heading
    return bool(re.search(r'<w:b/>|<w:b ', p))

def read_blocks():
    z = zipfile.ZipFile(DOCX)
    xml = z.read('word/document.xml').decode('utf-8', 'replace')
    body = xml[xml.index('<w:body>'):]
    blocks = []
    for m in re.finditer(r'(<w:p[ >].*?</w:p>)|(<w:tbl>.*?</w:tbl>)', body, re.S):
        if m.group(1):
            t = para_text(m.group(1))
            if t:
                blocks.append(('p', t, para_bold(m.group(1)), '<w:numPr>' in m.group(1)))
        else:
            rows = []
            for r in re.findall(r'<w:tr[ >].*?</w:tr>', m.group(2), re.S):
                cells = [cell_text(c) for c in re.findall(r'<w:tc>.*?</w:tc>', r, re.S)]
                if any(cells):
                    rows.append(cells)
            if rows:
                blocks.append(('tbl', rows, False, False))
    return blocks

# ---------------------------------------------------------------- conversion
# The manuscript uses three heading forms for the same thing.
CHAP = re.compile(r'^Module\s*(\d+)\s*[–-]\s*Unit\s*(\d+)\s*[:–-]?\s*(.*)$', re.I)   # Module 3 – Unit 2: Title
UNIT = re.compile(r'^Unit\s*(\d+)\s*[:–-]\s*(.+)$', re.I)                              # Unit 2 – Title
MODH = re.compile(r'^Module\s*(\d+)\s*[–-]\s*(.+)$', re.I)                             # Module 7 – Title
CAPS = re.compile(r'^[^a-z]{25,}$')                                                       # AUTHOR'S ALL-CAPS EMPHASIS
PRAC = re.compile(r'^(Practical\s*(Session)?\s*\d*\s*[:.]|Module\s*\d+\s*[–-]\s*(Unit\s*\d+\s*)?Practical)', re.I)
SKIP = re.compile(r'^(Module\s*\d+\s*[–-]\s*Unit\s*\d+\s*$|Module\s*\d+\s*$)', re.I)

def esc_md(s):
    return s.replace('|', '/')      # | is the table separator in our markup

def convert():
    blocks = read_blocks()
    modules = {n: [] for n in range(1, 9)}
    cur_mod = None
    in_practical = False
    pending_units = {}

    for kind, val, bold, listed in blocks:
        if kind == 'p':
            t = val
            m = CHAP.match(t)
            if m:
                cur_mod = int(m.group(1))
                unit = int(m.group(2))
                title = m.group(3).strip() or f"Unit {unit}"
                in_practical = False
                pending_units.setdefault(cur_mod, set())
                if unit in pending_units[cur_mod]:
                    continue                      # the source repeats headings
                pending_units[cur_mod].add(unit)
                modules[cur_mod].append(f"@chapter {esc_md(title)}\n\n")
                continue
            mh = MODH.match(t)
            if mh and not UNIT.match(t):
                # a module banner: sets context, contributes no chapter of its own
                cur_mod = int(mh.group(1)); in_practical = False
                pending_units.setdefault(cur_mod, set())
                continue
            mu = UNIT.match(t)
            if mu and cur_mod:
                unit = int(mu.group(1)); title = mu.group(2).strip()
                in_practical = False
                pending_units.setdefault(cur_mod, set())
                if unit in pending_units[cur_mod]:
                    continue
                pending_units[cur_mod].add(unit)
                modules[cur_mod].append(f"@chapter {esc_md(title)}\n\n")
                continue
            if cur_mod is None:
                continue                          # front matter
            if PRAC.match(t):
                in_practical = True               # drop this heading and its table
                continue
            if in_practical:
                # practical blocks are short; a new real heading ends them
                if bold and len(t) < 90 and not SKIP.match(t):
                    in_practical = False
                else:
                    continue
            if SKIP.match(t):
                continue
            if re.match(r'^(did you know)\b', t, re.I):
                modules[cur_mod].append("@know Did you know?\n")
                continue
            if listed:
                modules[cur_mod].append(f"- {esc_md(t)}\n")
                continue
            if CAPS.match(t) and len(t) > 30:
                pretty = t[0] + t[1:].lower()
                modules[cur_mod].append(f"@note\n{esc_md(pretty)}\n\n")
                continue
            if bold and 3 < len(t) < 90:
                modules[cur_mod].append(f"@section {esc_md(t)}\n\n")
                continue
            modules[cur_mod].append(esc_md(t) + "\n\n")
        else:
            if cur_mod is None or in_practical:
                continue                          # drop the practical's own table
            rows = val
            width = max(len(r) for r in rows)
            rows = [r + [''] * (width - len(r)) for r in rows]
            modules[cur_mod].append("@table \n" + "\n".join(" | ".join(esc_md(c) for c in r) for r in rows) + "\n\n")
    return modules

# Unit-1 titles from the examination syllabus. Used as a safety net when the
# manuscript opens a module with body text before any unit heading — that content
# belongs to Unit 1 and would otherwise be dropped.
UNIT1 = {
 1:'Foundations of Artificial Intelligence in Pharmacy',
 2:'Digital Pharmacy & E-Prescription Systems',
 3:'Clinical Decision Support Systems (CDSS)',
 4:'AI in Drug Discovery & Molecular Targeting',
 5:'Clinical Trials in Pharmacy',
 6:'Introduction to Pharmacy Data & Analytics',
 7:'Introduction to Pharmacy Robotics',
 8:'AI-Based Prescription Review & Safety Audits',
}

def tidy(chunks):
    s = "".join(chunks)
    s = re.sub(r'\n{3,}', '\n\n', s)
    # a @know with no body is useless
    s = re.sub(r'@know Did you know\?\n(?=@|\Z)', '', s)
    return s.strip() + "\n"

META = {
 1:("AI Foundations & Digital Systems for Pharmacy Practice","A Practice-Based Introduction"),
 2:("Digital Pharmacy, EHR & Telepharmacy","Systems, Records and Remote Care"),
 3:("AI-Based Clinical Decision Support in Pharmacy","Alerts, Interactions and Prediction"),
 4:("AI in Drug Development, Vaccines & Injectables","Discovery, Sterile Products and the Cold Chain"),
 5:("Clinical Trials, Pharmacovigilance & Evidence-Based Pharmacy","Evidence, Ethics and Safety"),
 6:("Pharmacy Data Analytics & Predictive Modelling","From Records to Decisions"),
 7:("Robotics & Automation in Pharmacy Practice","Machines, Workflow and Quality"),
 8:("AI-Enabled Clinical Case Studies & Simulations","Putting It Together"),
}

def js_string(s):
    out = []
    for line in s.split('\n'):
        out.append("'" + line.replace('\\', '\\\\').replace("'", "\\'") + "\\n'")
    return "+\n".join(out)

if __name__ == '__main__':
    mods = convert()
    report = []
    for n in range(1, 9):
        if n in SKIP_MODULES:
            report.append((n, 0, 0, 'skipped — hand-authored')); continue
        body = tidy(mods[n])
        if body.strip() and not body.lstrip().startswith('@chapter'):
            i = body.find('@chapter ')
            # Four units per module is the syllabus. If we found fewer, the leading
            # text is a whole missing unit; if we already have four, it is a preamble.
            if i >= 0 and body.count('@chapter ') >= 4:
                # a preamble before the first unit heading: fold it into that unit
                lead, rest = body[:i].strip(), body[i:]
                head, _, tail = rest.partition('\n')
                body = head + '\n\n' + lead + '\n\n' + tail.lstrip('\n')
            else:
                # a unit heading is missing from the manuscript — restore it
                body = f"@chapter {UNIT1[n]}\n\n" + body
        if not body.strip():
            report.append((n, 0, 0, 'EMPTY — check heading pattern')); continue
        body += "\n" + practical_markup(n)
        if n == 8:
            body += (f"@activity Capstone · {CAPSTONE[0]}\n{CAPSTONE[2]}\n\n")
        title, sub = META[n]
        js = ("/* alizon-book-m%d.js — Module %d textbook.\n"
              "   Body text converted from the author's manuscript; the practical programme is\n"
              "   generated from the labs actually running in ALIZON OS, replacing the older\n"
              "   observational \"Study of ...\" sessions in the manuscript. */\n"
              "(function(){\n"
              "(window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {}).m%d = {\n"
              " meta:{module:'%d', title:%s, sub:%s, prog:'Diploma in Pharmacy AI',\n"
              "       ed:'First Edition · 2026', auth:'Alizon School of Medical & Digital Intelligence'},\n"
              " src:\n%s\n};\n})();\n") % (n, n, n, n, json.dumps(title), json.dumps(sub), js_string(body))
        open(os.path.join(OUT, f"alizon-book-m{n}.js"), 'w', encoding='utf-8').write(js)
        report.append((n, len(body.split()), body.count('@chapter'), 'ok'))
    for n, w, c, st in report:
        print(f"   m{n}: {c} units, {w:>6} words  {st}")
