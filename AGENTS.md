# LanXgrow project requirements

## Responsive web app — ongoing user requirement
- Build mobile-first. Most learners will use phones; support tablets and laptops equally.
- Use responsive layouts, fluid widths and readable type, rather than a fixed phone or desktop canvas.
- Support 320px phones, common 375–430px phones, 768–1024px tablets and wider desktop windows, including landscape.
- No unintended horizontal scrolling, clipped controls, overlapping text or inaccessible content. Keep browser zoom enabled.
- Use touch targets of at least 44px for primary controls. Form inputs should use at least 16px text on phones to avoid automatic iOS zoom.
- All interactions must work with touch and keyboard; hover is an enhancement, never a requirement.
- Respect reduced motion, dynamic viewport heights and safe areas. Short landscape screens must remain naturally scrollable.
- Verify navigation, forms, media and sticky sections at phone, tablet and desktop sizes when changing layouts.
- Preserve existing pages and functionality unless the user asks to change them.

## Preview workflow
- On 25 October 2026 the owner explicitly approved publishing SMART AI and adding Meet our Lan-X AI after Home. This release may update the original production website. Future substantial work still requires preview review. Database changes remain outside this publication scope.
- Do not merge to main, promote a deployment, or change the live website without explicit user authorization.
- Commit code and these project requirements to GitHub so future work retains the same standards.

## Approved onboarding and device experience
- Restore the original stacked hero on phones and tablets: heading, body and CTAs first, then the full-width product visual. The user rejected the compact side-by-side mobile hero on 25 October 2026. Keep desktop two-column layout, readable type and 44px controls.
- Service-entry CTAs lead to `/get-started`, including header Sign in. Contact page removed by user request. Use floating WhatsApp, footer email and login support links instead. Old contact URLs redirect to the welcome screen.
- Welcome -> `/signin` -> Google, email/password, or phone/password. Do not claim a provider works unless configuration and real authentication have been verified.
- Learner flow approved 29 October: account entry → learner preferences → welcome video → Lan-X assessment → reports → learning Home. Never bypass preferences for a new learner. The review build uses explicitly labelled local account navigation, not real authentication.

## Account data
- Supabase Auth owns passwords and identities. Never create a plain-text password table.
- Policy acceptance is append-only and versioned; use database-generated timestamps and owner-only RLS.
- Google OAuth needs configured client credentials; phone registration requires an SMS provider and verified OTP. Do not bypass verification to make a provider appear available.

## SMART AI
- SMART AI marketing content uses the owner’s seven mentor-first pillars (25 October revision), not the six homepage product areas. Preserve underlying activity history identifiers; do not alter other homepage content.
- Black #111111 / blue #00BDEB / orange #FF861C follow the footer logo lighting; these are proposed page tokens, not asserted official corporate specifications.
- Scripted conversation and browser-local recording must be labelled clearly. Never fabricate AI scores or grant mastery for opening an activity.
- Prepare Supabase schema only until an isolated development database is identified. Customer rows must be owner-only; admin access requires a server-controlled role.

## Shared navigation and mobile parity — 25 October 2026
- The owner explicitly approved direct publication of shared navigation and mobile-first improvements across all pages.
- Use the same Header component on marketing, SMART AI, welcome, sign-in, sign-up and consent pages. Keep Home, Meet our Lan-X AI, About, Services and FAQ available; account links include Sign in, Sign up and Get started.
- On phones use the vertical mobile drawer, with touch and keyboard access, natural scrolling and safe-area spacing. No separate back button is required for main-site navigation.
- Preserve complete graphics, feature content and activity availability on phones. Reflow layouts rather than shrinking a desktop canvas. Tap/swipe/scroll must provide the actions available through desktop hover.
- Sign in now links directly to /signin, Sign up to /signup, and Get started to /get-started.

## Learner assessment design — 29 October 2026
- All new learner screens must use the existing website and supplied-screen colour family: warm ivory, charcoal, muted terracotta and restrained champagne highlights. Reuse existing typography and tokens.
- Use the supplied official LanXgrow logo; do not invent a replacement mark.
- Existing onboarding welcome video hands off to Meet Lan-X, then setup, conversation, processing, reports and the authenticated learning Home. Do not redirect this CTA to the public marketing homepage.
- Retain both existing and new learning Home designs for design-team review. Do not delete either until the owner chooses.
- Home CTA is provisionally Start learning. Report purchase remains separate from subscriptions; do not invent price, access benefits or payment success.
- Orb has distinct ready/listening/thinking/speaking/connection states with touch support and reduced-motion behaviour. Future real speaking/listening states must be driven by real media events.
- Current implementation is frontend review only on preview/lanx-assessment-screens. No live domain promotion is authorised.

## Complete frontend preview — 29 October 2026
- Keep `/get-started` as the review entry. Old `/assessment-preview` must go through account/onboarding gates. Screen selectors belong only to `/design-review/assessment`, never the normal learner journey.
- Current local review account state is not security. Real authentication, ownership, entitlements, payments and admin roles must be enforced server-side before customer release.
- Keep both learning Home variants, all three Practice flows, Call, Video, Reports, Plan, Profile, Settings and support navigable in the isolated preview. Admin review contains fixtures only.
- Never store passwords, provider keys or recordings in browser persistent storage. Do not show fabricated scores or payment success as real results.

## Verified accounts — 31 October 2026
- Latest owner decision: phone signup uses number + password without OTP; label/store phone as unverified. Email retains OTP; Google uses configured OAuth. Current policy agreement remains required.
- VITE_AUTH_VERIFICATION builds use real Supabase sessions and server identity, never local review flags.
- Use development project lanxgrow-auth-development (kzjvvwuyigiclryoqpkv), never production for this work.
- Phone provider must be enabled with phone confirmations disabled for the owner-approved no-OTP flow. Never invent SMS credentials. Native phone account creation must not be mistaken for proof of number ownership.
- Keep passwords in Supabase Auth; owner-only profile/verification/consent access. Never log or persist OTPs, proof URLs, grants or passwords in browser profile storage.
- Restore and refresh sessions on the same browser. Clearing browser data or revoked sessions may require signing in again.

## Home Screen agreement and Google — 31 October 2026
- Owner requires a separate Home Screen agreement at signup, alongside legal consent. Record it separately in home_screen_requests; never mark installation completed merely from a checkbox.
- Offer native install only after a learner gesture and available browser event; otherwise show manual instructions. Do not force installation on unsupported browsers or enable notifications.
- Google sign-in must use owner-supplied Google Cloud Web OAuth credentials stored only in Supabase provider settings. Never put OAuth client secrets in frontend/env VITE variables or pretend Google works when provider is off.
