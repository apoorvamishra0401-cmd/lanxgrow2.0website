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
- Current work: preview/smart-ai-foundation. SMART AI is an isolated staged showcase. Do not merge, promote, alter the original project/domain or change any production database/service. The owner requires fresh explicit approval for eventual production publication.
- Do not merge to main, promote a deployment, or change the live website without explicit user authorization.
- Commit code and these project requirements to GitHub so future work retains the same standards.

## Approved onboarding and device experience
- Restore the original stacked hero on phones and tablets: heading, body and CTAs first, then the full-width product visual. The user rejected the compact side-by-side mobile hero on 25 October 2026. Keep desktop two-column layout, readable type and 44px controls.
- Service-entry CTAs lead to `/get-started`, including header Sign in. Contact page removed by user request. Use floating WhatsApp, footer email and login support links instead. Old contact URLs redirect to the welcome screen.
- Welcome -> `/signin` -> Google, email/password, or phone/password. Do not claim a provider works unless configuration and real authentication have been verified.
- Keep the next learner screen at the existing placeholder until the user supplies its design.

## Account data
- Supabase Auth owns passwords and identities. Never create a plain-text password table.
- Policy acceptance is append-only and versioned; use database-generated timestamps and owner-only RLS.
- Google OAuth needs configured client credentials; phone registration requires an SMS provider and verified OTP. Do not bypass verification to make a provider appear available.

## SMART AI
- Preserve the confirmed six homepage area names and order; these are product areas, not proficiency levels.
- Black #111111 / blue #00BDEB / orange #FF861C follow the footer logo lighting; these are proposed page tokens, not asserted official corporate specifications.
- Scripted conversation and browser-local recording must be labelled clearly. Never fabricate AI scores or grant mastery for opening an activity.
- Prepare Supabase schema only until an isolated development database is identified. Customer rows must be owner-only; admin access requires a server-controlled role.
