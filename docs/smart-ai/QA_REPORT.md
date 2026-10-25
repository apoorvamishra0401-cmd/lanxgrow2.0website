# SMART AI foundation review — 25 October 2026

Isolated branch/project only. No production database changes or live-site promotion.

## Verified
- TypeScript and Vite production build pass.
- Model contract checks pass: exact six-area order, real word counts, storage roundtrip, malformed data rejection and unavailable-storage fallback.
- Existing PWA contract checks pass (34 public assets).
- Chromium embedded widths 390, 430, 768, 1280: document fits viewport. A 320px minimum-content overflow was corrected; the deployed document now fits at 320px as well.
- Three-step onboarding requires three interests. Saved Travel, Technology and Education appear in the device dashboard.
- Three submitted conversation replies unlock Save. Saving records one activity and the actual 15 submitted words, with no proficiency score.
- Opening a dashboard or activity alone does not complete a milestone.
- Recorder starts with devices off. Its explanation and Not now flow work without browser permission.

## Limits / remaining validation
- Cloud Chromium disables WebGL. The graceful branded fallback works; 3D appearance, frame rate and thermal behaviour must be reviewed on WebGL-capable physical phones.
- Microphone/camera permissions were not granted. Actual recording/playback, iOS codec compatibility and device speech voices require physical-device tests.
- Browser voice availability is device-dependent; no voices are relabelled as another accent.
- Three.js remains a lazy-loaded ~705kB minified / 181kB gzip chunk; Vite reports its size warning. Avoid claiming an established performance budget.
- Supabase migration is prepared only, not applied or integration-tested. No cloud account-linked progress or admin customer screen is live.
- Live AI voice, assessment analysis, secure server quotas and adaptive intelligence are future phases, explicitly labelled in the interface.

## Motion revision verification
- Updated isolated deployment: commit 858e2a12ba786dde0f4a0475de587d41858390fe.
- Chromium review frames at 320, 390, 430, 768 and 1280px fit without horizontal document overflow.
- Exactly seven compact overview links lead to their matching descriptions.
- Accent buttons select the matching description; after the transition, selected filter is grayscale(0), inactive filters are grayscale(1).
- PageDown through the sticky accent section changes Indian -> American -> British.
- At 390px, selecting British settles the active card fully inside the viewport (left 67px, right 325px in a 373px content viewport).
- Pause motion pauses the orbital animation; Pause overview motion pauses card drift.
- Lightweight original robot fallback is visible with the orbital scene in WebGL-disabled Chromium. WebGL 3D visual review remains pending.
- Touch gesture handlers are implemented, but a physical-device swipe test remains pending.
- TypeScript/Vite build, model checks and existing PWA contract checks pass after the motion update.
