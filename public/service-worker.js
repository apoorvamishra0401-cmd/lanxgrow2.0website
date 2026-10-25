/* The build script injects a content-derived version and complete static asset list. */
const VERSION = '__BUILD_VERSION__';
const PRECACHE = /* PRECACHE */ [];
const CACHE = `lanxgrow-static-${VERSION}`;
const AUTH_ROUTES = /^\/(signin|signup|consent|auth-callback|account|placeholder|forgot-password|reset-password)(\/|$)/;
const SENSITIVE = /(?:access_token|refresh_token|code|token|password|error_description)=/i;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Bound parallelism to avoid overwhelming low-bandwidth devices.
      for (let index = 0; index < PRECACHE.length; index += 4) {
        await Promise.all(PRECACHE.slice(index, index + 4).map(async path => {
          const response = await fetch(new Request(path, { cache: 'reload', redirect: 'error', credentials: 'same-origin' }));
          if (!response.ok || response.type === 'opaque' || response.redirected) throw new Error('Static cache not complete');
          await cache.put(path, response);
        }));
      }
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
    // Updated workers wait until existing tabs close or the visitor chooses Update.
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('lanxgrow-static-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // Never handle API, provider, message, non-GET or token-bearing requests.
  if (request.method !== 'GET' || url.origin !== self.location.origin || SENSITIVE.test(url.search) || url.pathname.startsWith('/api/') || url.pathname === '/service-worker.js') return;
  // Archived public policy documents must open as documents, not the SPA shell.
  if (!url.search && url.pathname.startsWith('/policies/') && PRECACHE.includes(url.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.pathname)) || fetch(request))());
    return;
  }
  if (request.mode === 'navigate') {
    if (AUTH_ROUTES.test(url.pathname) || url.search) {
      // Network-only auth navigation. An offline shell contains no account data.
      event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match('/index.html')));
      return;
    }
    // Public routes share Vite's static SPA shell, served instantly from the cache.
    event.respondWith((async () => {
      const shell = await (await caches.open(CACHE)).match('/index.html');
      return shell || fetch(request);
    })());
    return;
  }
  // Only the build-time allowlist may enter the cache. No runtime account data.
  if (url.search || !PRECACHE.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(url.pathname);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && !response.redirected && response.type !== 'opaque') await cache.put(url.pathname, response.clone());
    return response;
  })());
});
