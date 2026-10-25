# SMART AI — staged implementation and review

## Scope and isolation
The owner's attached master brief requires isolated development and no production database/service changes. Work lives on `preview/smart-ai-foundation`, based on the current live site. The new Vercel review project has no Supabase or AI credentials. The original domain/project and production database must not be changed. No SQL in this folder has been applied.

The owner confirmed that the six homepage product features are the intended journey: Call; Practice; Video Assessment; English Pro Course; Learn & Entertainment; Dashboard. They are kept in the original order, described as learning areas rather than fabricated proficiency levels. No human mentor workflow is built.

## Existing site and visual direction
React 18, TypeScript, Vite 5, Tailwind, React Router and an existing Supabase authentication adapter. Preserve the marketing site and add a lazy-loaded `/smart-ai` route. The existing footer logo has orange and cyan edge lighting around a dark emblem and sculpted light wordmark. SMART AI uses proposed page tokens black #111111, blue #00BDEB and orange #FF861C, with neutral text. They are not asserted to be official corporate specifications. Fraunces remains on the LanXgrow wordmark; Inter is used for the technology interface.

Lan-X is an original procedural Three.js character prototype: rounded extruded head and visor, lathed body shell, articulated arms/hands with fingers and thumbs, legs/feet, joint details, brand chest mark and dual propulsion. This is a prototype rig, not an artist-authored final production character model. States include idle, greeting, listening, speaking, thinking and encouragement; propulsion changes can support flying. It does not track the cursor. The visitor can pause, minimise or restore it. Reduced-motion and lightweight fallback are built in.

## Component map
- `smart/SmartAI.tsx`: page composition, dialogs, public demo allowance, onboarding, local activity dashboard.
- `smart/Companion.tsx`: lazily loaded WebGL scene and animation lifecycle.
- `smart/model.ts`: confirmed area content, topics, activity contract, versioned browser persistence.
- `smart/Conversation.tsx`: scripted typed conversation/call rehearsal. Not live AI.
- `smart/Lessons.tsx`: structured writing/self-review, three-check communication lesson, original story comprehension.
- `smart/SpeechLab.tsx`: truthful device-voice availability for en-IN, en-US, en-GB, playback/transcript and a comprehension question.
- `smart/Recorder.tsx`: local-only camera/microphone rehearsal. User permission and explicit recording controls; no upload or assessment request.
- `smart/smart.css`: responsive dark interface and full-screen mobile activity dialogs.

## Working phase-one flows
Visitor → choose a topic or custom subject → guided activity → self-review or objective lesson check → browser-local activity history. Onboarding saves three interests, goal, speaking comfort, challenge and difficulty. Interests can be changed later; custom topics remain available. Scripted follow-ups become simpler when requested; these are not adaptive model responses.

The public allowance is three minutes of active showcase interaction. A one-second timer runs only when an activity is open, the page is visible and there has been an interaction within 15 seconds. Reading the marketing page does not use the allowance. This is an interface demonstration, not a secure usage/quota boundary. It resets on a new page session and cannot control paid API costs. Exhausting it closes local recording through component cleanup and shows a non-urgent signup invitation.

Local storage holds preferences and at most 30 activity summaries (type, topic, counts, date). Submitted answer text is not persisted. Recordings never enter local storage or a remote service. A person can clear the browser-local data. No real customer records or authentication state are simulated.

## Evidence and progress definitions
- Written words: whitespace-separated words in submitted activity text.
- Active text practice: recent interaction seconds during the guided task.
- Recording duration: elapsed seconds of local recording, capped at 60.
- Conversation milestone: at least three responses of three or more words.
- Writing milestone: at least 20 words plus explicit point/example/closing self-review.
- Course milestone: all three communication checks correct.
- Story milestone: correct comprehension choice and at least 15 summary words.
- Recording milestone: at least five seconds and an explicit self-review.
- Dashboard: read-only reflection; opening it earns nothing.
These are practice milestones, not English mastery, pronunciation quality, confidence, intelligence or fluency scores. No facial-expression inference is implemented.

## Supabase plan and customer access
`sql/001_core.sql` defines owner-protected learner profiles, submitted activities, server-written assessment results and recording consent records. A non-exposed, server-controlled admin-role table permits verified admins to read appropriate customer learning details. Ordinary learners can read only their own rows. Public/anonymous users have no access. Client roles cannot write timestamps, roles or assessment results.

Apply this only after selecting an isolated Supabase development project/branch. The only connected project inspected is the existing live project; its listed branch is the default main branch, not a separate development database. No production table or configuration has been changed for SMART AI.

Before enabling real account data: apply the SQL to the isolated project, inspect RLS and grants with two separate test accounts plus an explicitly designated admin, run Supabase security advisors, test ownership changes/cross-user reads and unauthenticated access, then wire a Supabase repository adapter. Do not grant admin based on user metadata or expose a service-role key in the frontend. Admin email/phone lookup belongs in a server endpoint using Supabase Auth admin APIs, not a public mirror table. The owner must identify the actual admin account before provisioning it.

## Later AI architecture
Phase 2: a server endpoint verifies the user or issues a short anonymous demo ticket, enforces IP/session quotas and concurrency/budget limits, then creates a short-lived real-time provider session. Permanent API credentials remain server-side. Native microphone tracks are negotiated only after consent and are closed on end, error, hidden page or unmount. Include interruption handling and transcript opt-in. Add curated/verified accent samples rather than claiming browser voices are authentic recorded speakers.

Phase 3: private storage upload only after explicit recording/processing consent; object paths begin with verified user ID. Cap file type/size/duration; issue short signed playback URLs; validate the attempt owner server-side. A worker transcribes and evaluates only supported spoken-content/audio evidence against a versioned rubric. No face/personality scoring. Proposed raw-media retention is seven days, subject to owner approval before storage is enabled. Implement object deletion plus database cleanup, opt-out/discard flows and an expiry worker before any production upload. Local-only phase one has no cloud retention.

Phase 4: persist real attempts and provider-backed results; derive area progress from defined evidence, not page views. Phase 5: recommendations from goals, interests and assessed needs, with learner override and traceable reasoning. Do not treat a small number of attempts as a validated proficiency score.

## External prerequisites and honest boundaries
No paid AI or telephony service is connected. Live voice AI, transcription, pronunciation assessment, submitted video analysis, server-enforced anonymous limits and cloud progress are pending. Google/phone authentication configuration remains unchanged and pending from the earlier project. Device voices and recording support vary by browser; unsupported states are shown. Camera/microphone permission testing requires an explicit user action. No cross-device account data is claimed.

## Local development
`npm ci`, then `npm run dev -- --host 0.0.0.0` and open `/smart-ai` on localhost. Use a trusted HTTPS origin or localhost for camera/microphone. Build with `VITE_SMART_SHOWCASE=true npm run build`; this review flag skips service-worker registration on the isolated preview so updates do not become stale. The review branch adds noindex headers. Never copy preview-only headers or flags to live without a reviewed release.

## Performance and QA plan
Three.js is dynamically loaded; the main page, media recorder and accent lab are separate chunks. Cap device pixel ratio at 1.5, aim for 30 rendered frames per second, pause rendering outside the viewport/hidden page, omit real-time shadows and dispose geometry/materials/environment/renderer. Test 320/390/430/768/1280px, dialog scrolling, keyboard focus, simple practice milestones, topic persistence, denied devices and no unsupported scoring. Browser-engine testing is distinct from physical Android/iPhone/Safari and low-end-device testing; report only checks actually performed.

## Production release
Owner reviews isolated preview → revisions → owner explicitly authorises production → complete provider/account/media/privacy checks for the intended phase → prepare a production-only release without noindex/review controls → verify → publish the approved version. Design acceptance or preview interaction alone is not permission to deploy production.

## Reference-motion revision — 25 October

The seven mentor-first content pillars replace the initial six-area marketing overview. The homepage product areas and saved activity IDs remain unchanged.

`MotionScenes.tsx` adds an original orbital SVG composition around Lan-X, a compact seven-card overview linking to full descriptions, and scroll-linked accent selection. The selected accent retains colour; the other two use grayscale. Buttons support keyboard and tap, and a horizontal touch gesture changes accents. On short landscape viewports the sticky scroll stage becomes a normal compact block. Reduced motion disables floating animations and smooth transitions. Pause motion also pauses the orbital scene; the overview has its own pause control.

The 3D character remains the primary renderer. A new original lightweight SVG robot replaces the old logo fallback on devices without WebGL, so the central composition still contains Lan-X.

No Cashfree brand assets, code or payment content are used. Accent skyline illustrations are stylised listening visuals, not portraits or assertions that a nation has only one English accent. Live AI and account-linked persistence are still future phases.
