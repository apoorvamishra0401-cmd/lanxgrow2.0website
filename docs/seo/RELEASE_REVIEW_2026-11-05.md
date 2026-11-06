# SEO repair candidate — 5 November 2026

Base: cf27edf71afa816588ae1b67e95468c8b8184175, the deployment serving www.lanxgrow.com in Vercel project lanxgrow-learner-review.

## Implemented
- Build-time rendered Home, About, Services, FAQ, SMART AI, Privacy, Terms and error page. Canonical metadata shared between build and browser routes.
- Valid XML sitemap and robots sitemap reference.
- Restricted SPA rewrites preserve existing account/app URLs and let unknown requests return HTTP 404. Service worker preserves real 404 responses.
- Interview story handles its missing optional counter element without throwing.
- Interview CTAs preserve goal=interview through welcome and sign-in; session storage records that entry goal without rerouting consent or replacing existing onboarding. Full authenticated career routing is not claimed.
- Clarified public demo/planned functionality, removed unsupported claims of validated assessment equivalence, and simplified main interview copy.
- Public account/preview routes receive noindex headers; JS-free public content remains visible.

## Validation
npm run build (includes TypeScript), npm run test:seo, node scripts/test-pwa.mjs, node scripts/test-smart-model.mjs, node scripts/test-smart-trial.mjs, git diff --check.
Hosted checks on the first preview confirmed XML sitemap (200/application/xml), About/Services/FAQ rendered content and canonicals, unknown URL (404), account entries (200/noindex), and interview welcome/sign-in goal preservation. Browser coaching-stage selection passed without the original application exception; browser-extension errors were excluded. Mobile viewport emulation and a real authenticated account journey remain unverified.

Follow-through: added SMART AI prerendering with its stylesheet and hydration of existing public markup. Vercel environment inspection found no GA4 configuration.

## Still requires account data or approval
- GA4 property 505915169 returned no rows across short and extended ranges. No verified web-stream measurement ID is available. Obtain the G-... ID from the web stream; verify Realtime/DebugView and consent configuration before activating tracking. Property ID is not a measurement ID. No guessed tracking identifier was installed.
- Search Console: verify domain ownership, inspect rendered/indexed pages and selected canonicals, submit sitemap after production release. This GA4-only connector cannot access Search Console.
- Initial PageSpeed API request was rate-limited; later official browser test completed (see baseline below). No candidate score or ranking promises are made.
- Seven public marketing/legal routes are prerendered. Full authenticated diagnostic/interview service integration and real AI implementation are outside this repair candidate.
- Confirm ownership before changing similarly named third-party profiles or lanxgrow.in references.
- No production promotion, DNS edit, Supabase change, new paid service or public sharing expansion.

## Google lab baseline — 6 November 2026
Google PageSpeed Insights completed on the CURRENT LIVE homepage (not this private candidate): mobile and desktop Performance 100, Accessibility 97, Best Practices 100, SEO 100. Mobile LCP 1.5 s, TBT 0 ms, CLS 0.036. Desktop LCP 0.4 s, TBT 0 ms, CLS 0. No CrUX real-user data. Report: https://pagespeed.web.dev/analysis/https-www-lanxgrow-com/iv36lurylj?form_factor=mobile

Measured follow-ups addressed in candidate: darkened low-contrast feature/research/conversation labels; explicit product image dimensions and deferred decoding/loading. Candidate Lighthouse score is NOT claimed.
