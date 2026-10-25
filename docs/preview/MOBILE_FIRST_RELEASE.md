# Mobile-first and Terms release — 25 October 2026

The owner approved deploying the mobile-first proposal and revised Terms to the existing live website. The release is based on preview/mobile-first-review (620dc4c72090be5ebd3c0681db7bdb1983e4d1aa).

## Production preparation
- Retain all mobile layout, touch-navigation, menu, account-form and typography improvements from the reviewed preview.
- Remove the review banner and /review device-viewer route. The standalone review deployment remains available separately.
- Remove the review-only noindex response header and service-worker registration bypass. Normal PWA installation and explicit Update prompt resume on the live origin.
- Terms use positive, balanced language about learning, support, payments, privacy and concerns. No invented fluency or employment guarantees, liability waivers or unsupported response-time promises.
- Policy acceptance version is now 2026-10-25.1. Privacy processing content is unchanged; its shared version and date update alongside Terms. Old texts are preserved under /policies/2026-10-24.1/ and linked from the pages.
- Supabase consent version constraints, owner-only insert policy and profile trigger accept both versions for cached-client compatibility. The updated app requires the new version. Existing agreement rows and timestamps are preserved.
- Historical policy text is precached as public content; the worker serves these files directly rather than replacing them with the application shell.

## Validation
TypeScript/Vite build, worker tests including offline policy-document navigation, and whitespace checks. Rolled-back SQL verifies new-version capture, retaining distinct old/new acceptance records and preventing client-written timestamps. Supabase security advisor has no findings. Previous mobile review verified 320/390/430/768/1280px frames and touch controls; post-deploy Terms and release cleanup are checked on the live origin.

Google and phone provider enablement remains pending at the owner's request. This release does not change credentials or provider settings.
