# SMART AI foundation review — 25 October 2026

Isolated branch/project only. No production database changes or live-site promotion.

## Verified
- TypeScript and Vite production build pass.
- Model contract checks pass: exact six-area order, real word counts, storage roundtrip, malformed data rejection and unavailable-storage fallback.
- Existing PWA contract checks pass (34 public assets).
- Chromium embedded widths 390, 430, 768, 1280: document fits viewport. A 320px minimum-content overflow was found and corrected with bounded grid tracks and heading wrapping; final deployment recheck required.
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
