# SEO repair candidate — 5 November 2026

Base: cf27edf71afa816588ae1b67e95468c8b8184175, the deployment serving www.lanxgrow.com in Vercel project lanxgrow-learner-review.

## Implemented
- Build-time rendered Home, About, Services, FAQ, Privacy, Terms and error page. Canonical metadata shared between build and browser routes.
- Valid XML sitemap and robots sitemap reference.
- Restricted SPA rewrites preserve existing account/app URLs and let unknown requests return HTTP 404. Service worker preserves real 404 responses.
- Interview story handles its missing optional counter element without throwing.
- Interview CTAs preserve goal=interview through welcome and sign-in; session storage records that entry goal without rerouting consent or replacing existing onboarding. Full authenticated career routing is not claimed.
- Clarified public demo/planned functionality, removed unsupported claims of validated assessment equivalence, and simplified main interview copy.
- Public account/preview routes receive noindex headers; JS-free public content remains visible.

## Validation
npm run build (includes TypeScript), npm run test:seo, node scripts/test-pwa.mjs, node scripts/test-smart-model.mjs, node scripts/test-smart-trial.mjs, git diff --check.
Hosted/browser results are recorded after deployment.

## Still requires account data or approval
- GA4 property 505915169 returned no rows across short and extended ranges. No verified web-stream measurement ID is available. Obtain the G-... ID from the web stream; verify Realtime/DebugView and consent configuration before activating tracking. Property ID is not a measurement ID. No guessed tracking identifier was installed.
- Search Console: verify domain ownership, inspect rendered/indexed pages and selected canonicals, submit sitemap after production release. This GA4-only connector cannot access Search Console.
- PageSpeed request was rate-limited. No performance scores, ranking promises, traffic totals or search impressions are fabricated.
- SMART AI remains a client-rendered interactive route; six main static marketing/legal routes are prerendered. Full authenticated diagnostic/interview service integration and real AI implementation are outside this repair candidate.
- Confirm ownership before changing similarly named third-party profiles or lanxgrow.in references.
- No production promotion, DNS edit, Supabase change, new paid service or public sharing expansion.
