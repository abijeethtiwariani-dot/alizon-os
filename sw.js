/* Alizon OS — service worker KILL-SWITCH (v2).
   Pages no longer register this; they actively unregister instead. This file
   only exists so browsers that still hold an old registration clean themselves
   up on next activation.

   IMPORTANT: there is deliberately NO 'fetch' listener. A fetch listener makes
   the worker intercept every navigation, and while the worker is unregistering
   itself that interception can make page-to-page navigation fail intermittently
   ("sometimes shows an error"). With no fetch handler the browser always goes
   straight to the network. */
self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
  })());
});
