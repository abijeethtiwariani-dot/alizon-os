/* alizon-backup.js — point-in-time snapshots of the institutional data.
   Requires firebase-sync.js (provides firebase, auth and the same Firestore).

   Why this exists: on 11 Aug 2026 a routine hand-over wiped every submitted
   practical report, and there was no copy of it anywhere — no export had ever
   been taken, and Firestore keeps no history of its own. A backup that depends
   on somebody remembering to click "download" is not a backup.

   So snapshots are written automatically:
     · once a day, by whichever admin browser opens the portal first;
     · immediately before anything destructive, with the reason recorded.

   Snapshots live in the SAME `sync` collection the rest of the app uses, under
   a `bk_` prefix (`bk_<key>__<YYYY-MM-DD>`), one document per key per day, and
   the last KEEP days are retained. They go there rather than a `backups`
   collection because the Firestore rules only grant access to `sync` — a
   separate collection returns permission-denied. The sync listener subscribes
   to named key documents individually, so these extra documents are inert. Restoring
   writes the value back through localStorage, so it syncs to every device by
   the normal path — including the mass-deletion guard, which a restore is
   explicitly allowed to pass.

   API:
     AlizonBackup.snapshotNow(reason)      -> Promise  (all critical keys)
     AlizonBackup.list()                   -> Promise<[{id,key,date,count,reason}]>
     AlizonBackup.restore(id)              -> Promise<{key,count}>
     AlizonBackup.lastRun()                -> ISO string or null
*/
(function () {
  'use strict';
  if (window.AlizonBackup) return;

  /* the data whose loss would actually hurt */
  var KEYS = ['alizonStudents','alizonSubmissions','alizonFaculty','alizonHR','alizonResults',
              'alizonPrograms','alizonAttendance','alizonExperience','alizonExamAttempts',
              'alizonCurriculum','alizonFees'];
  var KEEP = 14;                       /* days of history */
  var LAST = 'alizonBackupLastRun';
  var PFX  = 'bk_';                    /* doc-id prefix inside `sync` */

  function db(){ try { return firebase.firestore(); } catch (e) { return null; } }
  function authed(){ try { return !!firebase.auth().currentUser; } catch (e) { return false; } }
  function today(){ var d=new Date();
    return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
  function countOf(v){
    try { var p = JSON.parse(v||'null');
      if (Array.isArray(p)) return p.length;
      if (p && typeof p === 'object') return Object.keys(p).length;
    } catch(e){}
    return v ? 1 : 0;
  }
  function ready(cb, tries){
    tries = tries || 0;
    if (db() && authed()) return cb(true);
    if (tries > 30) return cb(false);
    setTimeout(function(){ ready(cb, tries+1); }, 400);
  }

  /* Never let an empty local copy overwrite a good snapshot for the same day:
     a browser that has not finished syncing must not record "0 students". */
  function worthSaving(key, val, existing){
    var n = countOf(val);
    if (n > 0) return true;
    return !(existing && existing.count > 0);
  }

  function writeOne(key, reason){
    var d = db(); if (!d) return Promise.resolve(false);
    var val = localStorage.getItem(key);
    if (val == null) return Promise.resolve(false);
    var id = PFX + key + '__' + today();
    return d.collection('sync').doc(id).get().then(function(doc){
      var existing = doc.exists ? doc.data() : null;
      if (!worthSaving(key, val, existing)) return false;
      return d.collection('sync').doc(id).set({
        bk: 1, key: key, date: today(), value: val, count: countOf(val),
        reason: reason || 'daily', at: new Date().toISOString()
      }).then(function(){ return true; });
    }).catch(function(){ return false; });
  }

  function prune(){
    var d = db(); if (!d) return Promise.resolve();
    var cut = new Date(Date.now() - KEEP*864e5);
    var cutStr = cut.getFullYear()+'-'+('0'+(cut.getMonth()+1)).slice(-2)+'-'+('0'+cut.getDate()).slice(-2);
    return d.collection('sync').where('bk','==',1).where('date','<',cutStr).get().then(function(qs){
      var batch = [];
      qs.forEach(function(doc){ batch.push(doc.ref.delete().catch(function(){})); });
      return Promise.all(batch);
    }).catch(function(){});
  }

  var API = {
    snapshotNow: function(reason){
      return new Promise(function(resolve){
        ready(function(ok){
          if (!ok) return resolve({ saved: 0, offline: true });
          Promise.all(KEYS.map(function(k){ return writeOne(k, reason); })).then(function(res){
            var saved = res.filter(Boolean).length;
            try { localStorage.setItem(LAST, new Date().toISOString()); } catch(e){}
            prune();
            resolve({ saved: saved });
          });
        });
      });
    },
    list: function(){
      return new Promise(function(resolve){
        ready(function(ok){
          var d = db();
          if (!ok || !d) return resolve([]);
          d.collection('sync').where('bk','==',1).get().then(function(qs){
            var out = [];
            qs.forEach(function(doc){
              var x = doc.data() || {};
              out.push({ id: doc.id, key: x.key, date: x.date, count: x.count, reason: x.reason, at: x.at });
            });
            out.sort(function(a,b){ return (b.date+b.key).localeCompare(a.date+a.key); });
            resolve(out);
          }).catch(function(){ resolve([]); });
        });
      });
    },
    restore: function(id){
      return new Promise(function(resolve, reject){
        ready(function(ok){
          var d = db();
          if (!ok || !d) return reject(new Error('offline'));
          d.collection('sync').doc(id).get().then(function(doc){
            if (!doc.exists) return reject(new Error('not found'));
            var x = doc.data();
            /* a restore legitimately replaces the whole collection, including
               when that means putting records back that were deleted */
            try { if (window.alizonSync) window.alizonSync.confirmDestructive(x.key); } catch(e){}
            localStorage.setItem(x.key, x.value);
            resolve({ key: x.key, count: x.count, date: x.date });
          }).catch(reject);
        });
      });
    },
    lastRun: function(){ try { return localStorage.getItem(LAST); } catch(e){ return null; } }
  };

  /* ---- automatic daily snapshot ---------------------------------------- */
  function auto(){
    var last = API.lastRun();
    if (last && String(last).slice(0,10) === today()) return;   /* already today */
    /* wait for the data to actually arrive before photographing it */
    setTimeout(function(){ API.snapshotNow('daily'); }, 9000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
  else auto();

  window.AlizonBackup = API;
})();
