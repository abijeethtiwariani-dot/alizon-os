/* Shared Module 1 assignment + portal data.
   Required by tools-build-m1-practicals-deck.js and
   tools-build-m1-assignments-deck.js so the two decks cannot drift apart. */
/* ---------------- the four assignment questions ------------------------
   One question per unit. Each is a worked question with a definite answer,
   not an essay title. ------------------------------------------------- */
/* The four topics, the instruction line and the recommendation are the
   course office's own wording — reproduced verbatim, not paraphrased. */
const BRIEF = {
  instruction: 'Select any ONE topic and submit an assignment of approximately 500–700 words.',
  length: '500–700 words',
  recommended: 4,
  why: 'Topic 4 is the strongest overall Module 1 assignment because it lets you connect AI, digital pharmacy systems, documentation, patient safety and data management in one practical topic.'
};

const ASSIGN = [
  {
    n: 1, unit: 'Unit 1 · Foundations of AI in Pharmacy',
    title: 'Artificial Intelligence in Modern Pharmacy: Applications, Benefits and Future Scope',
    brief: 'Discuss how AI is being used in drug discovery, formulation development, medication safety, pharmacovigilance, and pharmacy practice.',
    cover: ['Drug discovery', 'Formulation development', 'Medication safety',
            'Pharmacovigilance', 'Pharmacy practice']
  },
  {
    n: 2, unit: 'Unit 2 · Digital Pharmacy & Information Systems',
    title: 'Digital Pharmacy Information Systems: PIS, HIS and Electronic Health Records (EHR)',
    brief: 'Explain how PIS, HIS, and EHR work together and how their integration improves medication management, workflow efficiency, and patient safety.',
    cover: ['How PIS, HIS and EHR work together', 'Medication management',
            'Workflow efficiency', 'Patient safety']
  },
  {
    n: 3, unit: 'Unit 3 · Ethics, Regulation & Data Protection',
    title: 'Ethics, Data Privacy and Cybersecurity in Digital Pharmacy Practice',
    brief: 'Discuss pharmacists\' responsibilities in protecting patient information, maintaining confidentiality, obtaining consent, preventing unauthorized access, and ensuring data security.',
    cover: ['Protecting patient information', 'Maintaining confidentiality',
            'Obtaining consent', 'Preventing unauthorized access', 'Ensuring data security']
  },
  {
    n: 4, unit: 'Unit 4 · Computer Applications & Digital Documentation',
    title: 'Digital Transformation of Pharmacy: From Prescription to Digital Documentation',
    brief: 'Explain the complete digital pharmacy workflow, including e-prescriptions, drug databases, inventory management, billing, digital reporting, regulatory documentation, cloud storage, and audit trails.',
    cover: ['E-prescriptions', 'Drug databases', 'Inventory management', 'Billing',
            'Digital reporting', 'Regulatory documentation', 'Cloud storage', 'Audit trails']
  }
];



/* ---------------- the real alizongov.com submission policy -------------
   Read from the portal source, not invented:
     src/lib/student-constants.ts        PDF only, 10 MB, 45-day resubmission
     src/lib/assignment-upload-policy.ts one live submission per module
     src/components/student/StudentDashboardView.tsx   the upload form
   ------------------------------------------------------------------- */
const PORTAL = {
  site: 'alizongov.com',
  path: 'Student Dashboard → Assignments',
  fields: [['Module', 'Choose Module 1 from the dropdown'],
           ['Title', 'Name the submission — minimum three characters'],
           ['File', 'One PDF, 10 MB or smaller']],
  rules: [
    ['PDF only', 'The portal rejects every other file type. Export from Word, do not rename the file.'],
    ['10 MB maximum', 'Compress images before you export. A rejected upload is not a submission.'],
    ['One live submission per module', 'While a submission is Pending or Approved the portal will not let you upload again for that module. Send the complete work the first time.'],
    ['45 days to resubmit', 'Only if your submission is Rejected. The window runs from the date it was graded and is set per programme.']
  ],
  statuses: [
    ['Pending', 'Received and waiting for the faculty. You cannot upload again for this module while it sits here.', '6E6A63'],
    ['Approved', 'Marked and closed. Your marks appear against the module. No further upload is possible.', '2C5F2D'],
    ['Rejected', 'Sent back with feedback. Fix it and upload again within the resubmission window.', '8C1515']
  ]
};



module.exports = { ASSIGN, PORTAL, BRIEF };
