# Mobile-first review — separate from the live site

Requested 25 October 2026. Base production commit: 3962fbce47f537f4321d3a71d4c73151b9c7c62a. Work stays on preview/mobile-first-review and a dedicated Vercel review project. Do not merge or publish to the existing live project without owner approval.

## Experience
- Preserve the ivory/charcoal/terracotta palette, Fraunces/Inter typefaces and all existing content.
- Stacked phone hero follows the owner's reference. Readable body text, consistent gutters, clearer labels and 50px CTAs.
- Phone feature explorer uses readable two-column choices, all subtitles, next/previous controls and horizontal swipe. Vertical page scrolling stays native; desktop keeps the scroll-driven experience.
- About, Services, FAQs, footer and legal pages share a more consistent mobile reading rhythm. Existing goals, search and filters retained.
- Login/registration have comfortable touch controls and readable consent/support details. No provider or database changes.
- Mobile menu supports focus cycling, Escape and closing when a desktop breakpoint is reached.
- Review-only /review route shows real same-origin frames at 320, 390, 430, 768 and 1280px for comparison. The ordinary / route is the actual responsive site, without a device frame.

## Isolation
VITE_MOBILE_REVIEW=true enables a clear review notice and the /review viewer; service-worker registration is skipped so review updates do not get stuck behind an old cache. Preview responses use X-Robots-Tag noindex,nofollow. No Supabase credentials have been added to the review project, and no account creation or authentication testing is part of this design review.

Before eventual promotion, remove the review-only robots header and review flag. Keep the live PWA configuration. Do not point the original live domain at the review project.

## Checks
Production TypeScript/Vite compilation, PWA worker contract checks and whitespace checks pass. Device-frame interaction and width checks are performed against the hosted review before sharing it. The preview is a visual/usability proposal, not confirmation that Google/phone providers have been activated.
