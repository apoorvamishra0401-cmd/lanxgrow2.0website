# Account registration and policy acceptance

Release: account-consent-experience. Production project: pgmlxzwicabgbctxyqvb.

## Implemented
- Email/password registration and sign-in; email verification redirect uses the current origin `/auth-callback`.
- Google OAuth PKCE code flow for sign-in and registration once the provider is configured.
- International phone/password registration, SMS verification screen and phone/password sign-in once an SMS provider is configured.
- Unchecked-by-default, required agreement checkbox linking `/terms` and `/privacy` (version `2026-10-24.1`). Google-created accounts are checked again after verified authentication; existing accounts without current acceptance must review it.
- Supabase Auth stores credentials. Existing `profiles` trigger retained with its function moved to non-exposed `private` schema and a fixed empty search path.
- `legal_consents` stores account ID, policy version and server timestamp. Owner-only SELECT/INSERT; no client UPDATE or DELETE; column privileges prevent clients setting timestamps. Auth registration metadata is a learner's acceptance statement, never an authorization role.
- Authenticated application screens must check current policy acceptance before exposing future learning functionality. The present placeholder also checks.
- Public offline cache excludes requests to Supabase and treats `/consent` as an online-first account route.

## Provider status observed on 24 October 2026
Public Supabase `/auth/v1/settings`: email enabled, signup enabled, email confirmation required; Google disabled, phone disabled. The connector exposes SQL and project tools but no authentication configuration endpoint. No OAuth or SMS secrets were requested, read or committed. Production SMTP settings and real email delivery have not been verified.

## Owner configuration required
1. Google Cloud: create the web OAuth client, configure the consent screen, and add Supabase's callback `https://pgmlxzwicabgbctxyqvb.supabase.co/auth/v1/callback`. Enter client ID and secret directly in Supabase Authentication → Sign-in/providers → Google and enable it. Do not paste the secret into chat or source code.
2. Supabase URL Configuration: set Site URL `https://lanxgrow2-0website.vercel.app`; allow exact production `/auth-callback` and `/reset-password` redirects. Add explicit preview callbacks only when testing there.
3. Phone: configure an SMS provider in Supabase, including sender requirements for India where applicable; enable phone registration with phone confirmation. Keep verification enabled. Provider SMS charges are separate. Do not enable without a configured delivery provider.
4. Email: configure a production SMTP service. Supabase default SMTP may restrict recipient addresses and throughput. Verify signup confirmation and password reset delivery to an owner-controlled inbox. Keep email verification enabled.
5. Test each complete flow on production with owner-controlled Google/email/phone identities, including SMS code expiry and incorrect codes, then sign out. Frontend availability updates from Supabase public settings without a rebuild.

## Validation performed
- Production TypeScript/Vite build and worker contract tests pass.
- Transactional SQL tests (rolled back) cover profile creation, signup consent capture, owner-only reads, direct acceptance insertion, rejection of client-written timestamps, and rejected deletion. No test accounts persisted.
- Supabase security advisors returned no lints after the schema change.
- A real Google/phone login cannot be verified while those providers are disabled. Email delivery needs an owner-controlled inbox; do not describe provider enablement as complete.

## Policy lifecycle
The terms cover the current public site/account scope without invented fees or guarantees. Review them as the paid learning service develops. Before changing either policy, archive the currently accepted text, assign a new shared version, extend the database version constraint and acceptance policy, and request renewed acceptance. Keep historical acceptance records; never overwrite a timestamp.

The SQL in `docs/database/account-consent.sql` is an audit of the already-applied change, not an automatically executed deployment migration. Do not rerun it blindly: inspect current policies first.
