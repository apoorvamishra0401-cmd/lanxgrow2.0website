# LanXgrow frontend review — 29 October 2026

## Correct learner journey
Website → `/get-started` → Sign in / Create new account → learner preferences → existing welcome video → Meet Lan-X → device setup → conversation → processing → Communication Snapshot → optional Growth Blueprint offer → learning Home.

New learners cannot enter assessment before completing onboarding. Old `/assessment-preview` redirects through the account/onboarding container. `/design-review/assessment` is a separate designer route with screen selectors. Both learning Home designs are retained.

## Isolation
Only `preview/lanx-assessment-screens`, Vercel staging deployment, `VITE_SMART_SHOWCASE=true`. Never promote or attach production domains. No Supabase, Hugging Face, model, payment, billing or production configuration changes.

## Implemented frontend inventory
- Account: email/phone tabs, Google explanation/sample profile, password visibility, terms links, sign-in/signup/reset states and validation. Review account navigation is session-local, not authentication. Passwords are never stored or sent.
- Fourteen onboarding steps: name, phone, WhatsApp, email, age, state/city/PIN, learner category, studies/work, board/degree/experience, daily time/commitment, goals and interests. Required fields block progression; progress saves locally.
- Welcome video and complete assessment UI, local device preview/recording, conversation panel, processing, illustrative reports/comparison and disconnected checkout states.
- Both Home designs, Call selector, AI Call instructions/timer/local response/review/submission/report layout.
- All three Practice modes with start, active task, response review and feedback layouts.
- Video recording/upload selection, metadata-duration checks, review, submission and report layout. Media remains in memory and is revoked on leaving; no analysis upload occurs.
- Progress/activity history, reports entry, notifications, profile editing, plan tabs, settings, privacy export/reset, help FAQs and coming-soon interest states.
- `/design-review/admin`: fixture learner list/search/details, reports link, empty review queue, local content draft, settings outline. This is neither secure admin authentication nor a complete CMS.

## Honest boundaries
No real accounts, provider OAuth, server sessions, daily entitlement enforcement, live AI responses, transcription, analysis, report generation, payment processing or subscription changes. No fabricated personal scores. Recorded audio/video is local to the open screen. Sample report and checkout-success designs are explicitly labelled examples; payments remain disabled. Prices and enhanced report benefits are not invented. Real backend ownership and roles remain required before release.

## Visual system
Original official logo; supplied illustration assets extracted to WebP; warm ivory, charcoal, terracotta, champagne with Fraunces/Inter. Orb now generates a changing sphere surface from 3D coordinates, directional lighting and flowing terracotta/champagne fields, while preserving the original central brand glyph. The old orb image is only a canvas-unavailable fallback. Rendering is capped, hidden/off-screen painting is paused, and reduced motion uses static state treatments. Explicitly activated microphone streams drive surface response through a local RMS analyser. This is not a live AI or connected TTS playback. No new screenshots used as entire interactive pages.

## Verification performed
- TypeScript check and Vite production build.
- Browser: old assessment URL → signup; sample signup → first name; all fourteen onboarding steps → welcome video → intro → setup → text-conversation response → end → processing → example report → learning Home.
- AI Call start, timer, local text response, review, submit and report layout; fixed missing crypto.randomUUID on non-secure local browser host with a UI-ID fallback.
- Local activity appears in Progress; Monthly/Quarterly plan tabs switch; Settings preference saves across direct-page refresh.
- Direct app route survives refresh; completed profiles do not return to the onboarding introduction. Screen selection is confined to designer review.
- Mobile signup at 390px, Progress at 320px and admin at 768px inspected; observed no horizontal document overflow in these tested views. Existing assessment/Home screenshots remain in assessment-qa.
- Admin content tab and local draft save exercised.

## Remaining device/release checks
Actual camera/microphone permission and recording on target devices, video upload duration rejection/acceptance, Safari/Android media support, slow-network behaviour and full accessibility audit. The automated file picker test timed out, so video selection is not claimed verified. Vercel preview is authentication-protected; remote rendered-app QA cannot be claimed without authorized access. The owner can open the deployment while signed into Vercel.

## Earlier overlay candidate verification — 29 October
- Local Chrome desktop and 390px embedded phone viewport: enhanced canvas active, no layout overlay, brand mark preserved. Phone canvas measured 331px, bounded by a 520px maximum backing resolution.
- Generated audio fixture (not microphone speech): listening input rose from 27 to 100 on increasing amplitude and settled to 0 after stopping; all ready/listening/thinking/speaking/connection states exercised. Fixture is removed from deployable source.
- Listening uses the actual stream created by explicit recording in assessment and AI Call. No extra permission prompt or network upload is added by the orb. Real phone microphone testing and TTS playback synchronisation remain outstanding.
- Browser console contains existing React Router future warnings and extension metadata errors; no orb application runtime error observed after the Canvas implementation. Initial WebGL experiment was discarded because the testing browser does not support WebGL.

## Fluid surface revision
The previous image-plus-overlay version was rejected by the owner. The enhanced renderer now generates its own sphere pixels from a time-varying 3D surface field, including liquid colour folds, directional lighting, a softly changing silhouette and touch deformation. It does not draw the old orb artwork during normal rendering; that file is only an unsupported-canvas fallback. The original brand glyph remains a separate small central layer. No WebGL/GPU dependency was added.

Surface checks: 22,022 pixels changed across time in the 200px reference render; changing audio energy affected 1,905 edge pixels. Transparent corners and opaque centre passed. Mean software surface update was 6.11ms on the development host (not a phone-performance guarantee). Phone viewports use a 144px surface buffer, compact instances 80px, while large viewport instances use 200px. Actual low-end phone performance remains a release check.

Final visual checks: generated surface rendered on the actual assessment intro in desktop Chrome and a 390×844 iframe (375px inner content width, no document overflow). A six-second motion study was rendered with the same surface module for reviewing the changing folds and silhouette; it is not a microphone or AI conversation recording.
