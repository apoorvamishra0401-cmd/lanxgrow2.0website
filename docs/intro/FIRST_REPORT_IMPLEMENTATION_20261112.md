# LanXgrow first introduction — implementation and verification (2026-11-12)

## Scope
GitHub review branch: `dev/lanx-getstarted-first-report-tour-20261112`, based on `dev/lanx00-unified-live-20261111`. No production deployment, branch merge, DNS, schema, RLS, or secrets changes.

## Implemented
1. Get Started audience choices route to the verified development enrollment form, not guest simulation.
2. Enrollment redirects to an authenticated one-minute introduction recording page; students, freshers and professionals use the same introductory path without changing 10/20-minute career entitlements.
3. 60-second WebM MediaRecorder camera+microphone capture, stop/start controls, private signed upload ticket and retry within the same page session; optional browser speech-to-text requires separate explicit consent.
4. Owner/Google/consent/learner-verified `intro/start`, `intro/complete`, `intro/reports` and `intro/reports/:id` backend endpoints; videos in the existing private development bucket, reports in the existing `interview_reports` table. No migration. Report playback uses five-minute signed URL after owner lookup.
5. Deterministic non-AI transcript-length and introduction-structure checklist: no unverified grammar, fluency, pronunciation or employment score.
6. Report section retrieves owner-specific saved reports from the server after any new signed-in session; first-time dashboard tour directs learners to Reports first. Tour's local marker is scoped per authenticated user.

## Verification — 2026-11-12 isolated Vercel Sandbox (not a deployed site)
- `node --test scripts/test-introduction.mjs scripts/test-audience-routes.mjs` — **PASS 10/10**.
- `npm run typecheck` — **PASS**.
- `npm run build` — **PASS** (Vite/PWA).
- `npm exec --yes --package=deno@2.9.6 -- deno check --config supabase/functions/career/deno.json supabase/functions/career/index.ts` — **PASS**.
- Browser Chromium test — **BLOCKED**: isolated runner lacks `libnspr4.so`, `libnss3.so`, `libnssutil3.so` and package mirror DNS; no browser PASS.
- Hosted `intro` route, camera permissions, real signed upload, schema compatibility and server persistence — **NOT TESTED** against development backend. New Edge Function source is committed only, not deployed.
- Refresh/relogin and owner-vs-other-user denial — **NOT TESTED** with real Google sessions. Requires two distinct consented test users on the specifically verified development target and a deployed development-only Edge Function.
- The preexisting `scripts/test-career-live-http.mjs` external test failed from sandbox network DNS, not an application assertion. Two credential-based cases SKIPPED.

## Known limitations and safeguards
- Signed upload tokens are short-lived and client upload retries must occur before token expiry. Refresh during an unfinished recording loses the unsent browser-media buffer. **After successful save**, history comes from server rather than localStorage.
- The one-minute timer is browser-enforced; the browser-reported duration is not independently verified by decoding the media on the backend. Do not market this as certified server-verified 60s media evidence.
- The optional browser transcript may be incomplete or wrong. No speech acoustic model or AI Soul was installed.
- The existing development schema, bucket and consent policy must be validated in a true hosted test before integrating or releasing.

## Required release gate
1. Verify the exact development project `kzjvvwuyigiclryoqpkv`, private bucket and existing `interview_reports` columns.
2. Deploy Edge Function to this *development* target only after explicit project/operation confirmation; do not touch production or shared auth configuration.
3. Using two test Google accounts (and all three audience categories), record/upload a real video, read the report, refresh, sign out and sign in, check cross-user 403/404, expired ticket, storage failures, duplicate completion, slow uploads and mobile support.
4. Run real browser accessibility, reduced motion and 320/390/768/1280px checks; review any policy notice updates before approval.
5. Coordinator reviews changes and tests in a draft PR; **NO-GO** for live release until these tests PASS.

Rollback: revert the isolated branch's commits (or close the draft PR); no DB migration, public deployment or live config was changed.
