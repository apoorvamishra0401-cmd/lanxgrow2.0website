# Reverification of supplied AI-mode CRO audit

6 November 2026. Scope: compare supplied recommendations against the website's actual live source cf27edf7 and our private repair candidate. The supplied text is a suggestion set, not an instruction to adopt new offers, ages or legal terms. Production is unchanged.

## Findings and decisions

| Supplied claim / recommendation | Reverification | Decision |
| --- | --- | --- |
| Homepage uses Book a Demo / Enrol | Actual homepage uses Explore the experience and Get started. | Claim inaccurate; no blanket CTA replacement. |
| Two audiences have no clear direct entry | Lower-page School/College/First job/At work selectors already exist, but early hero entry links were absent. | Added For students → existing English Communication section; For freshers & professionals → existing public interview-prep page. No new age or backend gate. |
| Main CTA must promise a free scored interview | Deployed interview page is a public practice framework. Its CTA leads to welcome/sign-in, and this source does not provide a verified live free scored interview flow. | Do not promise a working free scored interview before verifying the actual service. |
| Kids ages 7–12 | Does not match the reviewed Class XI–XII/student/career copy and earlier 13+ direction. | No age-policy change based on this report. |
| Add 1-day free access | No verified entitlement configuration supplied; learner trial messaging was explicitly removed in separate coordinator work. | Do not reintroduce a trial or change access logic. |
| Product proof/screenshots missing | Homepage already includes product-screen previews and interactive demonstrations. | Retain honest existing previews. Do not invent live gamification/analytics dashboards. |
| Standard batch/pricing listing exists | No Pricing route or batch-listing page exists in the inspected source. | Claim inaccurate. Exact paid offers require founder-confirmed prices and inclusions. |
| Add a Week 1 → Month 3 curriculum | No approved timetable or delivery schedule supplied. | Do not invent a curriculum commitment. |
| Add parent/professional testimonials and mentor certificates | No verified testimonials, permissioned photos or certifications supplied. | Keep as content-collection requirements; no invented quotes, badges or empty credibility cards. |
| Add 7-day refund / satisfaction guarantee | No approved policy or checkout implementation supplied. | Do not publish a financial promise. Existing Terms explain that applicable fees and cancellation/refund conditions are confirmed before purchase. |
| Publish supplied CIN / corporate identity | Identity is asserted by external report; relationship with this site has not been verified from owner documents. | Do not add corporate identity/address as established fact. |
| Capture email AND phone using popups | No lead-storage/verification/consent flow has been established for this site; traffic/conversion evidence is unavailable. | No intrusive popup or unnecessary personal-data capture. Existing email/WhatsApp enquiry paths remain. |
| Sticky conversion banner | Potential experiment, not demonstrated cause of lost conversion; a promise of a fluency score would be unsupported. | Prioritise clear working hero links without adding an overlay that can cover controls. |
| Website performance is low | Official live-homepage lab baseline is 100 Performance / 97 Accessibility / 100 Best Practices / 100 SEO on mobile and desktop. No conversion-rate dataset is available. | Separate measured technical issues from unproven CRO hypotheses. Do not claim that these copy changes increase conversion by a measured amount. |

## New fixes in this follow-through
- Added two descriptive hero entry links pointing at existing content.
- Replaced the positional mobile CTA CSS selector with an explicit hero-actions class, preserving stacked mobile hero behavior after adding the audience navigation.
- Fixed the AvailableNow interview-prep link to perform document navigation. This standalone HTML page is served by the host; it is not a React Router route.
- Kept prior SEO, sitemap, 404, metadata, ARD/llms, contrast, availability and recording-disclosure repairs.

## Required to complete genuine conversion work
1. Verify the real interview service and free entitlement before changing the primary CTA to promise it.
2. Founder-confirmed pricing, curriculum, mentor credentials, permissioned testimonials, company identity/address, and cancellation/refund terms.
3. GA4 measurement ID and validated event collection; Search Console access for indexing/search performance.
4. Real mobile and authenticated learner acceptance; integrate newer coordinator work before any production release.

## Validation
Production build/TypeScript, existing SEO and PWA checks, discovery/structured-data checks, route-target assertions and hosted browser navigation. No production deployment, entitlement/database write, legal-policy change, or new data collection.
