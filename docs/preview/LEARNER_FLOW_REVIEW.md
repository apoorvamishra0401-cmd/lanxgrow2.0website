# Learner flow — isolated local review

26 October 2026. Branch: preview/learner-onboarding. Base: 6c01971.

Owner selected local preview first instead of provisioning Supabase. No original deployment or database changes. Entry: /app-preview, enabled only with VITE_SMART_SHOWCASE=true. Device harness includes Learning app.

Implemented: 14-step resumable local onboarding; student/professional branches; college course field; contact/age validation; minimum 20-minute commitment gate; multiple goals/interests plus custom text; supplied welcome film; first-completion date and IST calendar trial display; six-destination Home; navigation; local upcoming-feature interest registration; empty Dashboard; profile/goal editing without trial restart.

Not implemented: real authentication in the new flow, server-side persistence/entitlements, generated learning plan, learning sessions/assessment, payments, admin/CMS or external notifications. Existing auth screens are preserved and not connected to the local profile. Review notice explicitly asks for sample data. No fake success for external services. Activity detail pages explain that no session was consumed.

QA: build/typecheck; state tests for IST boundary/year rollover and malformed/blocked storage; browser-tested empty-name validation, student/college branch, same-as-mobile, refusal of commitment, reload/resume, goals/interests, welcome completion to Home, local waitlist save, plan date, profile editor. Home has no horizontal overflow at 320/390/768/1280 iframe widths. Physical phone media playback not verified. Professional branch is implemented but not fully traversed in browser. Supplied video has visible source colour-code text in some frames; source is unchanged pending owner asset revision.

Before production: replace local adapter with audited isolated auth/data service; enforce all validation and trial state server-side; verify minors/privacy rules; implement real content and admin roles; recheck accessibility and media recovery on actual phones. Local test dates can be manipulated and are not security enforcement.
