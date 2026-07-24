/* Alizon OS — service worker KILL-SWITCH.
   Purpose: end the stale-cache problem. This SW caches NOTHING, deletes every
   old cache, and unregisters itself, so the live site always matches the
   deployed files. Safe to keep permanently. */
self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try { await self.clients.claim(); } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
  })());
});

/* Never intercept requests — everything goes straight to the network (fresh). */
self.addEventListener('fetch', () => {});
