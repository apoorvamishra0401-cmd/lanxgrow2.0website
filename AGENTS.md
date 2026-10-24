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
- Current work belongs on `preview/brand-research-footer` and its Vercel preview. The prior responsive/onboarding release is already on main.
- Do not merge to main, promote a deployment, or change the live website without explicit user authorization.
- Commit code and these project requirements to GitHub so future work retains the same standards.

## Approved onboarding and device experience
- Keep hero copy and its product visual together on phones and tablets, using a compact two-column layout; preserve content and 44px interactive targets instead of a shrunken desktop canvas.
- Service-entry CTAs lead to `/get-started`, including header Sign in. Preserve Contact in header/footer as a separate support destination.
- Welcome -> `/signin` -> Google, email/password, or phone/password. Do not claim a provider works unless configuration and real authentication have been verified.
- Keep the next learner screen at the existing placeholder until the user supplies its design.
