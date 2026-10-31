/* The build script injects a content-derived version and complete static asset list. */
const VERSION = '__BUILD_VERSION__';
const PRECACHE = /* PRECACHE */ [];
const CACHE = `lanxgrow-static-${VERSION}`;
const AUTH_ROUTES = /^\/(signin|signup|consent|auth|auth-callback|account|app-preview|placeholder|forgot-password|reset-password)(\/|$)/;
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
    // Activate only after the complete new static bundle is cached. Existing clients
    // reload through controllerchange so old routes cannot keep showing a stale app.
    await self.skipWaiting();
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
    // HTML must be fresh online: a cached old router may not know newly added pages.
    // Hashed static assets remain cache-first; the complete versioned shell is the
    // offline fallback, never overwritten by HTML from a different deployment.
    event.respondWith((async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      try {
        const response = await fetch(request, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Navigation unavailable');
        return response;
      } catch (error) {
        const shell = await (await caches.open(CACHE)).match('/index.html');
        if (shell) return shell;
        throw error;
      } finally { clearTimeout(timer); }
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
