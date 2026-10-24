# Preview onboarding and responsive work

- All implementation belongs to preview/scroll-feature-showcase; production remains unchanged.
- Main public page introductions include a left-aligned Get started CTA. Service-entry CTAs use /get-started.
- Contact remains in header/footer as a support page.
- /get-started is the welcome screen; its button opens /signin.
- /signin offers Google and email/phone password choices, reading provider availability from Supabase's public settings endpoint.
- Preview Vite environment variables are scoped only to this Git branch. No production env or database schema was changed.
- Supabase public settings inspected: email enabled; Google and phone disabled.
- Google and phone are visibly unavailable until the owner configures them. Google requires OAuth client configuration, plus the exact preview /auth-callback URL in Supabase's redirect allowlist. Do not collect provider secrets in chat or commit them.
- Phone/password requires phone authentication configured and an existing verified phone/password account. New phone registration/verification needs its own flow and SMS-provider setup.
- OAuth uses SDK PKCE and callback verification with getUser, never query-string claims of success.
- Existing post-login placeholder remains pending the user's next-screen design.
- Hero keeps copy and visual together on phone/tablet; no fixed desktop viewport or disabled browser zoom.
- Browser visual checks are blocked by Vercel deployment authentication; build success alone is not visual or successful-login verification.
