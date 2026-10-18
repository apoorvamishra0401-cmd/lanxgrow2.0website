# PROJECT_AUDIT.md

**LanXgrow public website — Stage 1 audit**
Company: LanXgrow India Private Limited · Brand: LanXgrow
Audit date: 18 October 2026
Workspace: `/Users/apoorvsmac/Documents/LanXgrow Project 2.0`
Scope: read-only inspection of the current implementation. No source, configuration, dependency or deployment file was modified in producing this document.
Corrected: 18 October 2026, on the `launch-readiness-spa-and-privacy` branch. This document no longer describes a sign-in form, a signed-in Account page, a "preview only" contact form or a missing privacy route, because the launch build ships none of those. Where a statement still records the Stage 1 snapshot rather than current behaviour, it now says so.

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
| Auth SDK | `@supabase/supabase-js` | ^2.118.0 — committed, but used only by dormant code (nothing imports `src/lib/auth.ts`) |
| Runtime observed | Node v24.16.0, npm 11.13.0 | — |

Fonts: **Fraunces** (display/serif) and **Inter** (body), loaded from Google Fonts in `index.html`. Browser theme colour is `#FAF7F2` (ivory).

Scripts: `dev` (vite), `build` (`tsc --noEmit && vite build`), `typecheck` (`tsc --noEmit`), `preview` (vite preview).

Note: the `package.json` `description` field now reads *"LanXgrow public website"*. `src/config/site.ts` still carries a Stage 1 comment and a `TODO(stage-2)` for contact channels; those remain open because no verified LanXgrow enquiry inbox has been supplied.

---

## 3. Routes (verified from `src/App.tsx`)

All routes render inside one shared `SiteLayout` shell (header + footer).

| Path | Component | Purpose | Status |
| --- | --- | --- | --- |
| `/` | `Home` | Brand story, approach, Smart AI, journey, closing CTA | Live |
| `/about` | `About` | Purpose, philosophy, approach, commitments | Live |
| `/services` | `Services` | Two services + assessment note + "before you begin" | Live |
| `/faq` | `Faq` | Eight accordion questions | Live |
| `/contact` | `Contact` | Enquiry form; controls stay disabled while no delivery endpoint is configured | Live — inactive |
| `/signin` | `SignIn` | Informational: account access is not available | Live — informational |
| `/account` | `Account` | Informational pointer to the programme; there is no signed-in area | Live — informational |
| `/privacy` | `Privacy` | Privacy Notice | Live |
| `*` | `NotFound` | 404 fallback | Live |

There is **no** dashboard, course, pricing, blog, careers or terms route. A Privacy Notice exists at `/privacy` and is linked from the footer. The brief's "Account page, if present" applies: an Account page exists as a placeholder.

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
- A contact form with real client-side validation whose controls stay disabled, and whose submit does nothing, while no enquiry endpoint is configured.
- A Privacy Notice at `/privacy` that describes the configuration actually built (see `src/content/privacy.ts`).

**Illustrative only (no claim of real capture or analysis):**
- The voice/video assessment selector — "Visual demonstration — no camera or microphone is in use."
- All four editorial visuals — labelled illustrative; no score, result or recording is implied.

**Not implemented (correctly stated as such on the site):**
- No sign-in, no verification step and no signed-in area is offered by the shipped pages. `/signin` and `/account` are informational, and the provider-backed Supabase flow exists only as dormant, unreferenced code in `src/lib/auth.ts` and `src/hooks/useAuthSession.ts`.
- No account can be created while no provider is configured.
- No enquiry is stored or sent while no endpoint is configured.
- Phone/SMS sign-in is not enabled.

---

## 6. Verified limitations (current state)

1. **Authentication is not offered at all in this build.** No Supabase URL/key exist in the workspace, and `/signin` and `/account` render informational copy that never touches the auth helper. The gated Supabase flow in `src/lib/auth.ts` is dormant and unreferenced, so even a configured build would not expose a sign-in form without further work. Confirmed: the Supabase chunk is lazily imported, is not requested, and is tree-shaken out of the shipped bundle.
2. **Phone/SMS OTP cannot be enabled on a free tier.** Supabase phone auth requires a paid SMS provider (Twilio/MessageBird/Vonage/Textlocal). This is a hard free-tier boundary, and it is part of why the launch build offers no sign-in form at all rather than simulating one.
3. **Public email OTP delivery is not configured.** Supabase's built-in email sender is limited (a small hourly cap, and by default restricted to project-organisation addresses) and is not intended for production; production delivery needs the owner's Supabase project credentials plus custom SMTP. Nothing can be invented here. Consequence: the provider path is **unverified end-to-end** — it was exercised only against a local stub during development — and it is dormant, so no shipped page reaches it.
4. **Contact delivery is not configured.** `contactChannels` is intentionally empty and no `VITE_CONTACT_ENDPOINT` is set, so the enquiry form renders with all controls disabled, submission does nothing, and an availability notice is shown. With an endpoint set, delivery is reported as successful **only** after a real 2xx response, and a failed or interrupted request is reported as *unconfirmed delivery* rather than as "nothing was sent", because a POST that reached the endpoint before the connection dropped may already have been processed. The Privacy Notice adapts to whichever state is built.
5. **The README is empty.** A 0-byte `README.md` is tracked in the repository, so setup, environment variables, the Supabase custom-SMTP step and the free-tier limits remain undocumented in-repo.
6. **No test framework.** There are no automated tests; verification to date has been manual plus measurement scripts.
7. **Lighthouse has not been re-run for the current stage** (the tool is not installed globally, locally or in `node_modules/.bin`). A Stage 2 run previously scored 100/100/100 across the seven routes.
8. **Dev-toolchain advisories.** `npm` reports advisories in the development toolchain; none are in shipped runtime code, but they are unresolved.
9. **Accessibility carry-forwards.** Required text inputs rely on a visually hidden "(required)" label; the six OTP boxes in the dormant `OtpInput` component are ~29px wide at 320px (not reachable, since no page renders them); React Router v7 future-flag dev warnings appear in development only.
10. **State hygiene.** At the audit date the working tree held 16 uncommitted/untracked entries (the auth + contact layer and the Supabase dependency). Those are now committed on the `launch-readiness-spa-and-privacy` branch, which was published through the authorised GitHub integration rather than the local CLI credential.

---

## 7. Repository state (verified)

- Git repository: yes. Remote `origin` = `https://github.com/apoorvamishra0401-cmd/lanxgrow2.0website.git`.
- At the audit date the checkout was `main` at `2d1fc0d` (visuals), on top of `7c9d008` (Stage 2 baseline checkpoint). The work that was uncommitted at that date is now committed on `launch-readiness-spa-and-privacy`, a 33-file delta (19 modified, 14 added, no deletions) built on remote `main` commit `fbf5677` and open as PR #1. Local `main` and remote `main` share no common ancestor, so the branch — not `main` — is what carries this work.
- Committed by that branch (previously uncommitted): `package.json`, `package-lock.json`, `src/App.tsx`, `src/components/home/{GetStarted,Hero}.tsx`, `src/content/{about,auth,contact,faq,home,services}.ts`, `src/pages/{About,Contact,NotFound,SignIn}.tsx`, plus the added `.env.example`, `vercel.json`, `src/content/privacy.ts`, `src/hooks/useAuthSession.ts`, `src/lib/{auth,enquiry}.ts`, `src/pages/{Account,Privacy}.tsx`, `src/vite-env.d.ts` and the `docs/stage-1-blueprint/` set.
- `.gitignore` excludes `node_modules`, `dist`, `.env*` (except `.env.example`), key/credential files and OS/editor noise.
- Sibling projects under `~/Documents` (a learning project and a separate project) are outside this workspace and must not be initialised or touched.

---

## 8. Claims and content that are deliberately absent

The current site contains **no** testimonials, customer counts, ratings, outcome guarantees, statistics, prices, schedules or partnership logos. This is correct and should be preserved. Any future addition of numbers must clear the evidence bar set out in `RESEARCH_REGISTER.md`.

---

## 9. Audit summary

The site is a well-structured, honestly-worded, accessible marketing frontend with a centralised content layer and a properly gated auth/contact layer. Its principal gaps are **not** design gaps: they are (a) missing provider credentials and a missing contact endpoint, (b) missing documentation, and (c) the absence of an automated test and performance-verification pass for the current stage. No redesign is warranted or recommended.
