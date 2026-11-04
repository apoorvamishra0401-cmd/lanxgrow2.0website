# LanXgrow — install, mobile and public demo review
Date: 4 November 2026. Preview only; no production/main/database/settings changes.
Base: cf27edf71afa816588ae1b67e95468c8b8184175 (current production source read-only).
Branch: preview/pwa-mobile-guest-20261104.

## Changes
- Public Install app suggestion appears 3.5 seconds after each full page opening. Dismissal lasts only this page opening. Installed/standalone state suppresses it. An available browser event opens the native install dialog only after a user click; otherwise browser-specific Home Screen instructions appear. Browser controls eligibility, cooldown and native UI. It cannot be forced every visit.
- Capture install events before React mounts. Start service worker registration immediately instead of waiting for all page media to load. No auth-showcase flag silently disables registration.
- A standalone touch-phone launch corrects a virtual desktop viewport when the browser exposes a narrow physical window hint. It does not disable zoom or force laptops/tablets into a phone canvas. Real Android desktop-mode installation and iOS Home Screen relaunch remain required tests; no universal browser guarantee.
- Portrait mobile feature section now pins a legible preview and changes it with vertical scrolling, forward and backward. Tap/swipe remain available. Short windows/landscape retain natural content scrolling and touch selectors instead of a pinned trap.
- Anonymous text and dictated messages share 10 messages per rolling ten-day window, starting on the first site visit. Ordinary visits do not reset or extend it. Counter and reset date are visible; zero remaining blocks input and offers signup. At ten elapsed days a new window becomes available. Old used-message counts migrate. Signed-in access is unchanged.
- Public static asset caching remains build-versioned. Auth, API, tokens and private data are excluded. Cached public pages/assets can reopen offline; account services and future AI inference still require internet. The first successful full cache installation is required. Browser storage can be evicted; offline availability is not unconditional.

## Verified
PASS: npm run build (TypeScript + Vite + PWA build).
PASS: node scripts/test-smart-trial.mjs — ten replies, 11th blocked, reload/shared persistent count, no daily renewal, exact ten-day boundary, cookie fallback, unavailable storage, legacy migration and malformed-state rejection.
PASS: node scripts/test-install.mjs — no automatic native prompt, captured event, one use per event, manual fallback, installed detection, simulated desktop-viewport phone recovery with zoom preserved.
PASS: node scripts/test-pwa.mjs — 35 allowlisted assets/icons, offline shell/JS, online fresh HTML, auth/API/token exclusions (service-worker VM tests, not a physical offline installation).
PASS: node scripts/test-smart-model.mjs — existing model/persistence regression checks before final first-visit initializer change; this initializer does not alter that model.
PASS browser: custom Install app suggestion appears and click without a native event reveals manual browser instructions.
PASS browser: 390 × 844 iframe mobile rendering, sticky feature preview and vertical scroll change its active screen in both directions.
PASS browser: ten typed demo replies counted down to zero; Send and Speak disabled; full website reload retained the zero-count gate and reset date.
These are guided local replies, NOT real model/API responses. Dictation uses the existing browser speech path; microphone capture was not tested or changed.

## Still required before production
- Real Android Chrome install from both normal and request-desktop-site modes; force-close/reopen installed app; verify portrait/landscape, keyboard and safe areas. iOS manual Add to Home Screen check.
- Native prompt and actual network-off reopening after successful caching on HTTPS. Local preview cannot prove native eligibility or phone offline behaviour.
- Check 320/375/430 px phones and tablets/desktop, reduced-motion and short landscape screens on devices; runtime phone evidence here is 390 px outer frame (375 px content after desktop scrollbar).
- Anonymous browser storage is not identity: clearing all site data, another browser/device, clock manipulation or simultaneous-tab races can bypass/reset a browser-only allowance. Real AI requests need atomic server-side entitlement checks; no API quota protection is claimed here.
- Google-hosted fonts are not part of this public same-origin precache; offline uses available browser font cache or fallbacks. Login, AI, video analysis and payments cannot operate fully offline.
- Local static review server has no direct deep-link SPA fallback; enter through Home links. Existing Vercel SPA rewrites are unchanged.

## Safety and next action
No Supabase change is needed for these presentation/local-demo fixes; no database read/write was performed. No production deploy, branch merge, secret/DNS/protection change or paid service.
Review this isolated branch/preview, then complete the real-device checklist. Production release requires separate explicit approval. Do not treat the local guest counter as a paid-service security boundary.
