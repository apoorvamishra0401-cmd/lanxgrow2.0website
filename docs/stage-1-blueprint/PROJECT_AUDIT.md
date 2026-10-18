# PROJECT_AUDIT.md

**LanXgrow public website — Stage 1 audit**
Company: LanXgrow India Private Limited · Brand: LanXgrow
Audit date: 18 October 2026
Workspace: `/Users/apoorvsmac/Documents/LanXgrow Project 2.0`
Scope: read-only inspection of the current implementation. No source, configuration, dependency or deployment file was modified in producing this document.

---

## 1. What this project is

A single public marketing website for LanXgrow, an early-stage education brand focused on **English Communication, human mentorship and AI-supported voice/video assessment**. The site is a client-rendered React single-page application. It is a *frontend* project: there is no backend, no database, no CMS and no analytics in the current workspace.

The stated product scope is deliberately narrow: English Communication as the core service, supported by mentorship/guided learning and a demonstration of "Smart AI-supported" voice/video assessment. No Vedic Maths content is present or planned (per standing instruction).

---

## 2. Technology stack (verified from `package.json`, lockfile and config)

| Area | Choice | Version |
| --- | --- | --- |
| UI library | React + React DOM | ^18.3.1 |
| Routing | react-router-dom | ^6.26.2 |
| Build tool | Vite | ^5.4.8 |
| Language | TypeScript | ^5.6.2 |
| Styling | Tailwind CSS (+ PostCSS, Autoprefixer) | ^3.4.13 |
| Auth SDK | `@supabase/supabase-js` | ^2.118.0 — **present in working tree, uncommitted** |
| Runtime observed | Node v24.16.0, npm 11.13.0 | — |

Fonts: **Fraunces** (display/serif) and **Inter** (body), loaded from Google Fonts in `index.html`. Browser theme colour is `#FAF7F2` (ivory).

Scripts: `dev` (vite), `build` (`tsc --noEmit && vite build`), `typecheck` (`tsc --noEmit`), `preview` (vite preview).

Note: the `package.json` `description` field still reads *"Stage 1 (visual frontend only)"* and `src/config/site.ts` still contains a `TODO(stage-2)` for contact channels. These are stale relative to the code that now exists and should be corrected in a later implementation stage.

---

## 3. Routes (verified from `src/App.tsx`)

All routes render inside one shared `SiteLayout` shell (header + footer).

| Path | Component | Purpose | Status |
| --- | --- | --- | --- |
| `/` | `Home` | Brand story, approach, Smart AI, journey, closing CTA | Live |
| `/about` | `About` | Purpose, philosophy, approach, commitments | Live |
| `/services` | `Services` | Two services + assessment note + "before you begin" | Live |
| `/faq` | `Faq` | Eight accordion questions | Live |
| `/contact` | `Contact` | Enquiry form (preview or endpoint-backed) | Live |
| `/signin` | `SignIn` | Email-or-phone OTP sign-in (preview or provider-backed) | Live, not connected |
| `/account` | `Account` | Post-sign-in placeholder + sign-out | Live, not connected |
| `*` | `NotFound` | 404 fallback | Live |

There is **no** dashboard, course, pricing, blog, careers or legal (privacy/terms) route. The brief's "Account page, if present" applies: an Account page exists as a placeholder.

---

## 4. Component and content architecture

**Layout** — `SiteLayout`, `Header` (desktop nav + mobile drawer), `Footer`, `RouteErrorBoundary`.

**UI primitives** — `Section`, `Container`, `Eyebrow`, `PageIntro`, `Button`, `Field`, `OtpInput`, `Accordion`, `Alert`, `Reveal` (scroll-reveal, reduced-motion aware), `Logo`, `VoiceMotif`.

**Home sections** — `Hero`, `Approach`, `SmartAi`, `GetStarted`, `ClosingCta`.

**Assessment demonstration** — `AssessmentModes`, `AssessmentShowcase`, `VoiceScene`, `VideoScene`, `Waveform`, `LearnerPortrait`, `SceneProgress`. This is an **illustrative** voice/video selector; no camera or microphone is ever used.

**Original editorial visuals (Stage 3)** — `components/visuals/ConversationThreads`, `GuidedPath`, `SignalToGuidance`, `TwoWaysOnePlan`, with copy in `src/content/visuals.ts`.

**Content layer** — All user-facing strings are centralised in `src/config/site.ts` and `src/content/*.ts` (`home`, `about`, `services`, `faq`, `contact`, `auth`, `assessment`, `visuals`). This is a genuine strength: copy can be revised without touching components.

**Logic layer** — `src/lib/auth.ts` (Supabase adapter + config gate + lazy dynamic import), `src/lib/enquiry.ts` (contact POST seam), `src/lib/validation.ts` (enquiry validation), `src/lib/cn.ts`. Hooks: `useAuthSession`, `usePageMeta`, `useReveal`, `useScrollToTop`.

---

## 5. What is genuinely implemented vs. illustrative

This distinction matters for honest publication and is currently handled well in the product copy.

**Implemented (real behaviour):**
- Full responsive marketing site across all routes.
- Mobile drawer navigation with correct focus/`inert` handling.
- Accordion FAQ with proper heading semantics.
- Original SVG/CSS visuals that are deterministic and reduced-motion safe.
- Scroll reveal animations that disable under `prefers-reduced-motion`.
- A contact form with real client-side validation.
- A sign-in form that, **when a provider is configured via environment variables**, performs a real send-code / verify-code round trip.
- A session-aware Account page with working sign-out.

**Illustrative only (no claim of real capture or analysis):**
- The voice/video assessment selector — "Visual demonstration — no camera or microphone is in use."
- All four editorial visuals — labelled illustrative; no score, result or recording is implied.

**Not implemented (correctly stated as such on the site):**
- No account can be created while no provider is configured.
- No enquiry is stored or sent while no endpoint is configured.
- Phone/SMS sign-in is not enabled.

---

## 6. Verified limitations (current state)

1. **Authentication is not live by default.** No Supabase URL/key exist in the workspace, so the site ships gated on `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. Unconfigured → honest "preview only" copy and no provider request. Confirmed: the Supabase chunk is lazily imported and not requested when unconfigured.
2. **Phone/SMS OTP cannot be enabled on a free tier.** Supabase phone auth requires a paid SMS provider (Twilio/MessageBird/Vonage/Textlocal). The site refuses phone sign-in honestly rather than simulating success. This is a hard free-tier boundary.
3. **Public email OTP delivery is not configured.** Supabase's built-in email sender is limited (a small hourly cap, and by default restricted to project-organisation addresses) and is not intended for production; production delivery needs the owner's Supabase project credentials plus custom SMTP. Nothing can be invented here. Consequence: the live provider path is **unverified end-to-end** — it was exercised only against a local stub during development.
4. **Contact delivery is not configured.** `contactChannels` is intentionally empty and no `VITE_CONTACT_ENDPOINT` is set, so the form shows a preview notice. With an endpoint set, success is shown **only** after a real 2xx response.
5. **No README exists in the workspace.** Setup, environment variables, the Supabase custom-SMTP step and the free-tier limits are undocumented in-repo.
6. **No test framework.** There are no automated tests; verification to date has been manual plus measurement scripts.
7. **Lighthouse has not been re-run for the current stage** (the tool is not installed globally, locally or in `node_modules/.bin`). A Stage 2 run previously scored 100/100/100 across the seven routes.
8. **Dev-toolchain advisories.** `npm` reports advisories in the development toolchain; none are in shipped runtime code, but they are unresolved.
9. **Accessibility carry-forwards.** Required text inputs rely on a visually hidden "(required)" label; the six OTP boxes are ~29px wide at 320px; React Router v7 future-flag dev warnings appear in development only.
10. **State hygiene.** The working tree contains 16 uncommitted/untracked entries (the auth + contact layer and the Supabase dependency). Committed baseline is `7c9d008`; visuals commit is `2d1fc0d`. `origin` is configured but pushing from this machine is not possible with the available credentials (see §7).

---

## 7. Repository state (verified)

- Git repository: yes. Branch `main`. Remote `origin` = `https://github.com/apoorvamishra0401-cmd/lanxgrow2.0website.git`.
- Commits: `2d1fc0d` (visuals) on top of `7c9d008` (Stage 2 baseline checkpoint).
- Uncommitted: `package.json`, `package-lock.json`, `src/App.tsx`, `src/components/home/{GetStarted,Hero}.tsx`, `src/content/{auth,contact,home}.ts`, `src/pages/{Contact,SignIn}.tsx` (modified) plus `.env.example`, `src/hooks/useAuthSession.ts`, `src/lib/{auth,enquiry}.ts`, `src/pages/Account.tsx`, `src/vite-env.d.ts` (untracked).
- `.gitignore` excludes `node_modules`, `dist`, `.env*` (except `.env.example`), key/credential files and OS/editor noise.
- Sibling projects under `~/Documents` (a learning project and a separate project) are outside this workspace and must not be initialised or touched.

---

## 8. Claims and content that are deliberately absent

The current site contains **no** testimonials, customer counts, ratings, outcome guarantees, statistics, prices, schedules or partnership logos. This is correct and should be preserved. Any future addition of numbers must clear the evidence bar set out in `RESEARCH_REGISTER.md`.

---

## 9. Audit summary

The site is a well-structured, honestly-worded, accessible marketing frontend with a centralised content layer and a properly gated auth/contact layer. Its principal gaps are **not** design gaps: they are (a) missing provider credentials and a missing contact endpoint, (b) missing documentation, and (c) the absence of an automated test and performance-verification pass for the current stage. No redesign is warranted or recommended.
