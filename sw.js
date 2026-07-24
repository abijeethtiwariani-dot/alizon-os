/* Alizon OS — service worker
   Strategy:
   - Firebase / Auth traffic: never intercepted (data always live).
   - HTML navigations: network-first (fresh pages when online) → cache → offline page.
   - Static assets (css/js/img/fonts): stale-while-revalidate.
*/
const VERSION = 'alizon-os-v4';
const STATIC_CACHE = 'alizon-static-' + VERSION;
const PAGE_CACHE   = 'alizon-pages-'  + VERSION;

const PRECACHE = [
  '/offline.html',
  '/manifest.webmanifest',
  '/alizon-logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

/* Hosts that must always hit the network directly (live data + sign-in). */
const BYPASS = /(firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|firebaseio\.com|firebaseinstallations\.googleapis\.com|firebase-settings\.crashlytics\.com|\/__\/)/i;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.indexOf(VERSION) < 0).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* allow the page to trigger an immediate update */
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // never touch writes / auth POSTs
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (BYPASS.test(url.href)) return;                // Firebase / auth → straight to network

  /* HTML page loads: network-first */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(PAGE_CACHE);
        c.put(req, fresh.clone());
        return fresh;
      } catch (_) {
        const cached = await caches.match(req);
        return cached || (await caches.match('/offline.html')) ||
          new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  /* Static assets (same-origin files + cross-origin fonts/CDN): stale-while-revalidate */
  const isAsset = /\.(css|js|mjs|png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf|otf|json)$/i.test(url.pathname);
  if (isAsset || url.origin !== self.location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          caches.open(STATIC_CACHE).then((c) => c.put(req, res.clone())).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })());
  }
});
