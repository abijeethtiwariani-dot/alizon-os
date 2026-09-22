/* =====================================================================
   shield-worker.js — runs the engine off the main thread.

   Hashing a few hundred megabytes and inflating every member of an
   archive is real work. Done on the UI thread it freezes the page for
   the length of the scan, and a scanner that stops responding while it
   scans is one people stop trusting. The engine is written with no DOM
   dependency precisely so it can be loaded here unchanged.

   shield-ui.js falls back to calling the engine directly if a worker
   cannot start (file:// origins, strict sandboxes), so this is an
   optimisation rather than a requirement.
   ===================================================================== */
/* global importScripts, ShieldEngine */
importScripts('shield-signatures.js?v=1', 'shield-engine.js?v=1');

var extraHashes = null;

self.onmessage = function (e) {
  var msg = e.data || {};

  if (msg.type === 'hashes') {          /* imported signature list */
    extraHashes = msg.hashes || null;
    self.postMessage({ type: 'hashes-ok' });
    return;
  }

  if (msg.type === 'scan') {
    ShieldEngine.scanFile(msg.file, { path: msg.path, extraHashes: extraHashes })
      .then(function (result) {
        self.postMessage({ type: 'result', id: msg.id, result: result });
      })
      .catch(function (err) {
        self.postMessage({
          type: 'error', id: msg.id,
          message: String((err && err.message) || err),
          name: msg.name, path: msg.path, size: msg.size
        });
      });
    return;
  }

  if (msg.type === 'ping') {
    self.postMessage({
      type: 'ready',
      version: ShieldEngine.version,
      inflate: ShieldEngine.haveInflate,
      crypto: ShieldEngine.haveCrypto
    });
  }
};
