# Lan-X assessment frontend — 29 October 2026

## Scope
Separate preview only. No production domain, Supabase, Hugging Face deployment, model, payment or entitlement changes.
Source designs: the nine owner-provided assessment screenshots dated 29 October. Their original UI text is rendered as HTML, not as page-sized screenshots. Supplied illustration assets are extracted as small WebP files, preserving the official brand logo. Existing warm ivory/charcoal/terracotta tokens and Fraunces/Inter typography are reused.

## Review entry points
- `/assessment-preview`: independently review the complete assessment screen flow.
- `/app-preview`: existing onboarding; completing the welcome video now leads into Meet Lan-X. Finishing or skipping the report offer returns to the authenticated learning Home design preview.
- `/app-preview?home=classic`: existing Home, preserved alongside the new Home. A completed local onboarding profile is required for this entry point.
- Preview-only routes require `VITE_SMART_SHOWCASE=true`. Do not set this in production as part of this work.

## Screens
1. Meet Lan-X
2. Camera/microphone setup
3. Active conversation with optional local recording and a scripted text-conversation panel
4. Processing layout
5. Communication Snapshot
6. Snapshot / Personal Growth Blueprint comparison
7. Checkout layout
8. Payment pending
9. Payment retry
10. Payment success example
11. Personal Growth Blueprint layout
12. New learning Home
13. Existing learning Home retained

CTA to app Home: **Start learning**. Both Home designs remain selectable for design-team review. The public marketing Home is not replaced.

## Functional boundaries
- No automatic device access. Check my devices explicitly requests camera and microphone; actual stream is displayed only after permission. The microphone meter uses Web Audio input measurements.
- Tap to speak captures local audio only after explicit activation; stopping exposes a native local audio player. Audio is not uploaded or persisted.
- Stream and AudioContext cleanup is implemented. Permission denial has actionable copy. Real media permissions/recording still require hands-on device testing.
- Conversation text advances through scripted questions, not generated AI replies.
- Processing does not fabricate completion. Reviewers explicitly open the example report.
- Snapshot feedback is illustrative supplied design content, not a score or observation from the learner's recording.
- Report audio is disabled until a real asset is available.
- Price is not invented. Pay is disabled. Pending/success/failure are selectable design states; no money is taken, no trial is restarted and no enhanced benefits are granted.
- Optional report purchase remains separate from subscription; final price/benefits/start-time remain unresolved.
- Existing practices remain available through the existing learning container. Standalone new Home uses local detail panels where account context is absent.

## Orb
A reusable state-driven component: ready, listening, thinking, speaking, connection issue. Warm illumination is preserved; speaking uses a subtle irregular pulse/tilt, listening a slower brightness pulse, thinking a subdued slower float. Pointer/touch contact adds a small contained response. Reduced-motion disables animated transforms. This is an animated raster asset, not a newly rendered 3D mesh or a live AI/audio connection. Real speaking state must later be driven by actual TTS playback events.

## Deployment
Vercel team authorization was completed by the owner. Deploy only to the preview environment of lanxgrow-learner-review; this project also has the live custom domains attached, so never use production deployment or domain promotion for this work. Source is on preview/lanx-assessment-screens. Local cloud-browser preview was verified separately.
