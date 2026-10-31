# Verified accounts — isolated development

## Flow and deployment
Phone OR email OTP → server proof check → password + policy consent → Supabase Auth session → learner preferences → welcome video → assessment → learning Home.

Development project: lanxgrow-auth-development, kzjvvwuyigiclryoqpkv, ap-south-1. SQL source: supabase/setup/phone-email-registration.sql, applied as phone_email_verified_registration. Edge source: supabase/functions/registration. Preview-only VITE_AUTH_VERIFICATION=true plus development URL and publishable key. Never put service-role keys in VITE variables. Public Phone.Email client ID: 16602682226704766067. Check provider domain allowlists for the preview if required.

No production-database changes or live-domain promotion. AI, payments and activity entitlements remain separate; account integration does not make simulated feedback real.

## Trust boundaries
The browser callback is not trusted identity. Server accepts only HTTPS user.phone.email proof paths, rejects redirects/oversized data, fetches identity and creates a short-lived opaque grant. Used proof URLs cannot register twice. Password submission claims the grant. A database trigger commits verification and policy consent atomically with the Auth account.

Receipt and rate-limit tables are backend-only. Other tables use owner-only RLS. Profile endpoints validate real bearer users. Verified contact cannot be changed by profile saves. Profile saves are serialized per account and refuse changed session owners. Supabase hashes passwords and refreshes sessions. Same-browser session restoration requires valid refresh tokens; clearing browser data, private browsing, admin revocation or security policy may require login again. Auth responses are never service-worker cached.

## Verified checks
Frontend and strict Edge type checks passed. Proof tests covered protocol, host/path, userinfo, port, query/fragment, redirect and payload rejection, normalization. Transactional database fixtures checked verification/consent atomicity and owner access, then rolled back.

Disposable email Auth fixture passed password login, profile save/load, own-row isolation, session refresh, logout and rejection of refresh after logout. Phone fixture returned phone_provider_disabled (422). All disposable Auth users, receipt rows and associated profile data were removed. No real customer OTP/password was used. Browser tested signup at 320/390px, email widget loading/opening and phone-unavailable handling; no horizontal body overflow. Real delivery and full OTP signup remain unverified.

## Required configuration and user test
Supabase development Phone provider is OFF. Enable under Authentication → Sign In / Providers → Phone. Do not invent SMS credentials if configuration is requested. Availability refreshes after 30 seconds. User must perform actual OTP/password entry. Test email signup → preferences → refresh → logout → password login; repeat for phone after enabling. Confirm existing accounts cannot be overwritten and another account cannot read the profile. Configure/test email recovery redirects and SMTP separately. Phone password recovery is not implemented.

Quotas are not assumed unlimited. Do not log proof URLs, OTPs, grants or passwords. Expired receipt/rate bucket cleanup needs an operational retention policy before broad release.

Review /signup on the new Vercel staging deployment. Vercel protection may require owner login; no protection bypass is included.


## Latest owner revision — phone without OTP
Phone signup now uses phone number + password + confirmation + policy consent. Email still uses Phone.Email verification. Google button uses Supabase OAuth and remains disabled until configured. Phone provider must be enabled AND phone confirmations disabled (phone_autoconfirm=true); never enter fake Twilio credentials. Config blocks no-OTP phone signup unless both settings match, to avoid sending an unintended SMS. Ordinary phone/password sign-in only needs phone provider enabled.

New native phone contacts have provider=unverified-phone and verified_at=null, even if Supabase internally auto-confirms the identity for password login. This is not proof of ownership. Existing actually verified records are retained. The nullable timestamp migration is in supabase/setup/unverified-phone-accounts.sql and was applied only to development.

Current actual settings: phone=false, phone_autoconfirm=false, google=false, email=true. Therefore full phone signup/login and Google OAuth remain configuration-blocked, not verified working. Phone password recovery remains unavailable; an unverified number must never alone authorize password reset. Owner's previous OTP-reset proposal requires a fresh verified recovery method before implementation.
