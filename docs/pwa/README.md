# LanXgrow PWA and Android packaging

## Files and automatic deployment
- `public/manifest.json`: app identity, standalone display, colours, scope and icons. Vite copies it to `/manifest.json`.
- `public/service-worker.js`: cache-first public navigation/static-asset worker template.
- `scripts/build-pwa.mjs`: runs after Vite in `npm run build`. It fingerprints the output and injects the current build's complete static asset list into `dist/service-worker.js`. This includes all JS chunks (including lazy Supabase SDK code), CSS, public images and icons. Do not deploy the template by itself.
- `src/registerServiceWorker.ts`: production HTTPS registration and safe update handling.
- `src/main.tsx` registers it with:

```ts
import { registerServiceWorker } from './registerServiceWorker';
// After rendering the application:
registerServiceWorker();
```

Every online visitor receives the worker automatically on page load. They do not have to install the app first. The first online visit must finish downloading the static assets. Repeat public navigation and images use the cache first; install is atomic and retries on another visit if interrupted. Initial controls remain available while the cache downloads.

## Cache scope and updates
Public SPA routes use the cached `/index.html`; public assets are cached only if in the build-time allowlist. Authentication pages prefer network with a static-shell offline fallback. No API responses, cross-origin requests, non-GET requests, or token-bearing URLs are cached. Login and support messages still require internet. Google Fonts is not placed in the offline cache; system typeface fallbacks remain available offline.

A new release changes the worker's version. A replacement worker waits until old tabs close, or the visitor chooses Update in the app. An update reloads open controlled pages and removes the old LanXgrow cache. The service worker itself is served with no-cache headers. Authentication sessions already managed by Supabase in local storage are separate from the public offline cache.

Cache data is per browser/device and may be evicted by the browser. No website can guarantee instantaneous loading or permanent offline storage on every device. Clearing site data removes the worker and cache. No personal form submissions are queued or silently retried.

## Checks
Run `npm run build` then `node scripts/test-pwa.mjs`. On an HTTPS deployment, allow the first installation to complete, reload, and use browser DevTools' offline mode to verify `/`, `/about`, static images and the welcome screen. Verify login/network failures remain honest offline. Check Application > Manifest and Service Workers for installability. Android Chrome may offer Install app; iOS users can use Share > Add to Home Screen.

## Android later — Trusted Web Activity / Bubblewrap
A TWA is an Android shell around the hosted PWA; it does not require rewriting React. Use the permanent production origin, not a preview URL.

```sh
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://lanxgrow2-0website.vercel.app/manifest.json
bubblewrap build
```

The CLI will request the package ID, signing configuration and Android/JDK tooling. Keep the signing keystore private and backed up; do not commit it. Use the generated APK for testing and a signed AAB for the Play Store as required by its current submission process.

Publish `/.well-known/assetlinks.json` on the website, containing the actual Android package ID and SHA-256 signing-certificate fingerprint. With Play App Signing use the Play app-signing certificate for the store release. Bubblewrap can help generate the statement. Do not deploy a placeholder certificate or package ID. Without matching Digital Asset Links, the page opens in a browser Custom Tab rather than as a verified full-screen TWA. The same PWA cache supports offline browsing; login and remote features still need network.

Primary references:
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching
- https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2
- https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli
