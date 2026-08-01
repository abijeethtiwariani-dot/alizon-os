/* alizon-textbook-content.js — manifest and lazy loader for the module textbooks.

   Each module lives in its own file (alizon-book-m1.js … m8.js) and self-registers
   into window.ALIZON_TEXTBOOKS. They are loaded on demand, exactly as the exam
   banks are, so the studio does not carry every book on every page load — the
   full-length books run to tens of thousands of words each.

   window.AlizonBooks.load(n) -> Promise<{meta, src}>
*/
(function(){
'use strict';
window.ALIZON_TEXTBOOKS = window.ALIZON_TEXTBOOKS || {};

var FILES = {
  1:'alizon-book-m1.js?v=1', 2:'alizon-book-m2.js?v=1', 3:'alizon-book-m3.js?v=1', 4:'alizon-book-m4.js?v=1',
  5:'alizon-book-m5.js?v=1', 6:'alizon-book-m6.js?v=1', 7:'alizon-book-m7.js?v=1', 8:'alizon-book-m8.js?v=1'
};
var pending = {};

window.AlizonBooks = {
  list: function(){ return Object.keys(FILES).map(Number); },
  loaded: function(n){ return !!window.ALIZON_TEXTBOOKS['m'+n]; },
  load: function(n){
    n = Number(n);
    var key = 'm'+n;
    if (window.ALIZON_TEXTBOOKS[key]) return Promise.resolve(window.ALIZON_TEXTBOOKS[key]);
    if (pending[n]) return pending[n];
    var file = FILES[n];
    if (!file) return Promise.reject(new Error('No textbook for module '+n));
    pending[n] = new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = file;
      s.onload = function(){
        var b = window.ALIZON_TEXTBOOKS[key];
        if (b) res(b); else rej(new Error('Module '+n+' loaded but did not register'));
      };
      s.onerror = function(){ rej(new Error('Could not load '+file)); };
      document.head.appendChild(s);
    });
    return pending[n];
  },
  /* every book, for the publish-all pass */
  loadAll: function(){
    var self = this;
    return Object.keys(FILES).reduce(function(chain, n){
      return chain.then(function(acc){
        return self.load(n).then(function(b){ acc[n]=b; return acc; })
                           .catch(function(){ return acc; });
      });
    }, Promise.resolve({}));
  }
};
})();
