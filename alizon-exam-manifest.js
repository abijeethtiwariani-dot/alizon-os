/* ALIZON OS — examination question-bank manifest
   Lists every bank available to the mock-practice, internal-examination and
   admin question-bank pages. Those pages load ONLY the bank the user selects,
   so adding a module here is the single change needed to publish it.
   Each bank file registers itself into window.ALIZON_EXAM_BANKS[code].        */
window.ALIZON_EXAM_MANIFEST = {
  programme: 'Pharmacy AI',
  course: 'Certificate Course in Digital Health & Artificial Intelligence for Pharmacy',
  modules: [
   {n:1, code:'ALZ-PH-M1', file:'alizon-exam-bank-m1.js?v=3', title:'AI Foundations & Digital Systems for Pharmacy Practice'},
   {n:2, code:'ALZ-PH-M2', file:'alizon-exam-bank-m2.js?v=1', title:'Digital Pharmacy, EHR & Telepharmacy'},
   {n:3, code:'ALZ-PH-M3', file:'alizon-exam-bank-m3.js?v=1', title:'AI-Based Clinical Decision Support in Pharmacy'},
   {n:4, code:'ALZ-PH-M4', file:'alizon-exam-bank-m4.js?v=1', title:'AI in Drug Development, Vaccines & Injectables'},
   {n:5, code:'ALZ-PH-M5', file:'alizon-exam-bank-m5.js?v=1', title:'Clinical Trials, Pharmacovigilance & Evidence-Based Pharmacy'},
   {n:6, code:'ALZ-PH-M6', file:'alizon-exam-bank-m6.js?v=1', title:'Pharmacy Data Analytics & Predictive Modelling'},
   {n:7, code:'ALZ-PH-M7', file:'alizon-exam-bank-m7.js?v=1', title:'Robotics & Automation in Pharmacy Practice'},
   {n:8, code:'ALZ-PH-M8', file:'alizon-exam-bank-m8.js?v=1', title:'AI-Enabled Clinical Case Studies & Simulations'}
  ]
};

/* Shared loader used by all three pages. Resolves with the bank object. */
window.AlizonExamBanks = (function(){
  var loaded = {};
  function byModule(n){
    var M = window.ALIZON_EXAM_MANIFEST.modules;
    for (var i=0;i<M.length;i++) if (M[i].n === +n) return M[i];
    return null;
  }
  function load(n){
    var m = byModule(n);
    if (!m) return Promise.reject(new Error('Unknown module ' + n));
    var reg = window.ALIZON_EXAM_BANKS || {};
    if (reg[m.code]) return Promise.resolve(reg[m.code]);
    if (loaded[m.code]) return loaded[m.code];
    loaded[m.code] = new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = m.file;
      s.onload = function(){
        var b = (window.ALIZON_EXAM_BANKS || {})[m.code];
        if (b) res(b); else rej(new Error('Bank ' + m.code + ' did not register'));
      };
      s.onerror = function(){ rej(new Error('Could not load ' + m.file)); };
      document.head.appendChild(s);
    });
    return loaded[m.code];
  }
  return { list: function(){ return window.ALIZON_EXAM_MANIFEST.modules.slice(); },
           byModule: byModule, load: load };
})();
