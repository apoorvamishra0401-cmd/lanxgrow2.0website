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
Original official logo; supplied illustration assets extracted to WebP; warm ivory, charcoal, terracotta, champagne with Fraunces/Inter. Orb is a state-animated image, not a live AI or 3D mesh. Reduced motion is respected. No new screenshots used as entire interactive pages.

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
