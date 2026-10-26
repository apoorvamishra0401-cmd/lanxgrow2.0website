# Learner flow — isolated local review

26 October 2026. Branch: preview/learner-onboarding. Base: 6c01971.

Owner selected local preview first instead of provisioning Supabase. No original deployment or database changes. Entry: /app-preview, enabled only with VITE_SMART_SHOWCASE=true. Device harness includes Learning app.

Implemented: 14-step resumable local onboarding; student/professional branches; college course field; contact/age validation; minimum 20-minute commitment gate; multiple goals/interests plus custom text; supplied welcome film; first-completion date and IST calendar trial display; six-destination Home; navigation; local upcoming-feature interest registration; empty Dashboard; profile/goal editing without trial restart.

Not implemented: real authentication in the new flow, server-side persistence/entitlements, generated learning plan, learning sessions/assessment, payments, admin/CMS or external notifications. Existing auth screens are preserved and not connected to the local profile. Review notice explicitly asks for sample data. No fake success for external services. Activity detail pages explain that no session was consumed.

QA: build/typecheck; state tests for IST boundary/year rollover and malformed/blocked storage; browser-tested empty-name validation, student/college branch, same-as-mobile, refusal of commitment, reload/resume, goals/interests, welcome completion to Home, local waitlist save, plan date, profile editor. Home has no horizontal overflow at 320/390/768/1280 iframe widths. Physical phone media playback not verified. Professional branch is implemented but not fully traversed in browser. Supplied video has visible source colour-code text in some frames; source is unchanged pending owner asset revision.

Before production: replace local adapter with audited isolated auth/data service; enforce all validation and trial state server-side; verify minors/privacy rules; implement real content and admin roles; recheck accessibility and media recovery on actual phones. Local test dates can be manipulated and are not security enforcement.


## 26 October feedback iteration
- State/union territory native dropdown before dependent common-city dropdown, with custom city fallback; six-digit PIN; board dropdown plus custom board. Existing local profiles hydrate with empty PIN and retain other data. No postcode lookup or location transmission.
- Supplied original 1080x1920 ten-second film with original audio, centered contain layout. Attempt audible playback immediately; retry muted if browser policy rejects it. No play/skip control added. Media failure still offers recovery to Home. Actual sound depends on device/browser policy.
- Confirmed clear-preview-data action removes learner profile and local writing attempt, preserves unrelated site data.
- Next frontend slice: Writing Practice topic, start, deadline-based editor, word count, stop-input on expiry, submit/discard confirmation, local saved response. No generated scores, real sessions, backend or daily security enforcement. Resuming cannot restart the local deadline; full data reset remains owner review tooling.
- QA: dropdown state/city flow, custom city, short PIN rejection, CBSE selection, completion video to Home, writing input and submit tested in cloud browser. Build and learner-state checks passed. Device harness used for mobile/tablet/desktop checks. Physical iOS/Android sound testing remains outstanding.
