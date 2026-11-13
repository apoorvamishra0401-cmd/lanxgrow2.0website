# Truecaller Mobile Web Verification — Isolated Developer Candidate

Target repository: \`apoorvamishra0401-cmd/lanxgrow2.0website\`.
This repository is **React 18 + Vite**, not Next.js App Router. Use Vercel \`api/*.js\` functions, **not** \`app/api/.../route.js\`.

## Files

- \`api/_truecaller.js\`: short-lived server-side Redis ticket storage, secure state cookie, endpoint validation
- \`api/truecaller-start.js\`: POST to mint requestNonce and browser-bound secret state
- \`api/truecaller-callback.js\`: POST from Truecaller, accepts provider proof without issuing a session
- \`api/truecaller-status.js\`: GET polling with same-browser cookie; calls allowlisted Truecaller profile endpoint; consumes ticket
- \`src/components/auth/TruecallerButton.tsx\`: Android deep link and two-second polling, with fallback
- \`src/pages/SignIn.tsx\`: review-only integration, next to existing Google sign-in

## Required environment (Vercel preview only; do NOT set production without authorization)

\`\`\`dotenv
VITE_TRUECALLER_PARTNER_KEY=<public Truecaller web Partner Key>
UPSTASH_REDIS_REST_URL=<HTTPS REST URL of an existing test Redis database>
UPSTASH_REDIS_REST_TOKEN=<server-only REST token>
\`\`\`

Vercel KV REST equivalents \`KV_REST_API_URL\` and \`KV_REST_API_TOKEN\` are also supported.
Do not place Redis credentials, Supabase service roles, tokens or accessToken in Vite browser variables.

## Provider configuration

Truecaller developer portal must have the **exact hostname** and HTTPS callback URL matching the running deployment.
The provided callback \`https://lanxgrow.com/api/truecaller-callback\` is for production, **not** an isolated preview URL.
To test on a private preview, arrange a separate developer app/callback registration for the private test hostname; do not redirect the provider to the production website under Standing Rule 001.
Android browser with Truecaller installed is needed for complete real consent verification.

## Security and release gates

- A random requestNonce is minted on the server; it is bound to an HttpOnly/Secure/SameSite cookie.
- Both callback and polling store provider tokens only in temporary server storage; status consumes and deletes the ticket.
- The profile URL must be an HTTPS Truecaller profile endpoint; arbitrary callback-supplied URLs are rejected.
- Truecaller callback approval proves a **verified phone**, not membership, learner role, consent, ownership, or a LanXgrow login.
- The existing founder-review sign-in flow is Google-only and uses Supabase Auth. A verified Truecaller phone does **not** create a Supabase Auth session.
- There is no \`/dashboard\` route in inspected founder-review \`src/App.tsx\`. Never redirect to a protected dashboard without linking to an existing authorized identity and issuing a server-verified session. Add account-linking and policy/role checks in an independently reviewed auth-owner change.
- No production, DNS, schema, RLS, public branch, paid service, or provider settings were modified by these commits.

## Tests to run before merging

1. \`npm ci && npm run typecheck && npm run build\` in this isolated branch.
2. Start endpoint: cross-origin POST denies, no Redis config fails safely, fresh IDs are distinct, cookie HttpOnly+Secure.
3. Callback: unknown IDs harmless, flow_invoked and user_rejected work, bad URL rejected, fake token fails profile fetch.
4. Status: missing/tampered cookie denies, no token exposed, profile fetched only over allowlisted HTTPS origin, ticket consumed.
5. Android: phone app installed and absent, timeout, rejection, real callback after consent, fallback.
6. Login: **blocked** until Supabase Auth integration, existing-account linking, session validation, consent, owner isolation, and protected-route authorization are implemented.
