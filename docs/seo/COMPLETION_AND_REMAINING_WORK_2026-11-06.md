# LanXgrow — completion and remaining-work report

Date: 6 November 2026. Owner of this workstream: LANX-01 Website & PWA.

## What the percentage means

**16 of 24 defined repair/release checkpoints are complete in the private candidate: 66.7% complete, 33.3% open.** This is a transparent count of checkpoints, not an effort estimate, Google score, conversion uplift, whole-app completion percentage or claim that all website problems have been discovered. Checkpoints have different sizes; one backend integration can take more work than several metadata repairs. A checkpoint marked complete covers the specific defect below, not universal perfection of that category.

The production domain still serves commit `cf27edf71afa816588ae1b67e95468c8b8184175`, verified through Vercel on this date. **The candidate repairs have not been released to production.** Do not interpret 66.7% as repairs already visible on the public domain. Preview code is prepared and tested; live release and live verification remain open.

The prior official live-homepage lab baseline was Performance 100, Accessibility 97, Best Practices 100, SEO 100, and experimental Agentic Browsing 2/4. These are separate measurements, not this completion percentage. No candidate Google score or measured conversion change is claimed.

## Completed checkpoints — 16

| ID | Specific repair | Evidence / boundary |
| --- | --- | --- |
| C01 | Public marketing/legal content rendered into initial HTML | Build renders Home, About, Services, FAQ, SMART AI, Privacy and Terms; initial HTML assertions pass. |
| C02 | Valid XML sitemap and robots sitemap reference | Build/SEO tests validate entries and absolute canonical URLs. |
| C03 | Public-page titles, descriptions and canonicals | Shared build/browser metadata; SEO assertions. Does not prove Google's selected canonical. |
| C04 | Unknown URLs return real HTTP 404 | Restricted rewrites; service worker preserves 404; previous hosted check passed. |
| C05 | Account/review URLs excluded from indexing | Candidate noindex headers/metadata; account entry routes retained. |
| C06 | SMART AI prerender/hydration consistency | SMART AI stylesheet included and existing rendered root hydrated. |
| C07 | Interview animation startup exception | Missing optional counter guarded; previous hosted stage selection passed. |
| C08 | Interview entry goal survives welcome/sign-in | `goal=interview` preserved; entry intention stored. Authenticated final destination remains P04. |
| C09 | Known small-caption contrast defects | Corrected specific feature/research/conversation colours; contrast calculations pass. Full accessibility acceptance remains P05/P07. |
| C10 | Known product-image layout/loading omissions | Explicit actual dimensions and deferred loading/decoding added to affected feature images. |
| C11 | Inconsistent Sign-in navigation | Shared/footer links point to `/signin`. |
| C12 | `/llms.txt` returned HTML | Real Markdown guide; built and prior hosted official audit-class validation passed. |
| C13 | Agent discovery JSON returned HTML | Actual ARD and read-only guide resource; validated JSON/schema links. Not a new AI service. |
| C14 | Structured data/social preview omissions | Organization/WebSite/WebPage JSON-LD and existing brand-image metadata. No invented review data. |
| C15 | Early audience navigation and broken interview card | Student/career entry links added; standalone interview document navigation repaired. Hosted browser clicks passed. |
| C16 | Inconsistent availability and offer copy | Clear available/planned distinctions, recording FAQ; this follow-up removes contradictory Free/access-package/benchmark claims and explicitly labels proposed timings. Build and existing regression checks pass. |

## Still open — 8 checkpoints, all owned for follow-through

| ID / priority | What is not right or not proven | How I will solve it | Completion evidence / dependency |
| --- | --- | --- | --- |
| P01 / high | Privacy Notice omits local recording, optional browser speech processing and saved activity metadata although SMART AI offers them. FAQ is more explicit than the formal notice. | Prepare a versioned notice update covering actual device permissions, local recording lifetime, activity metadata, browser speech service and deletion controls. Reconcile historical acceptance versions; keep new analytics disclosure conditional on activation. A proposed disclosure is below. | Requires owner-confirmed processing/retention and policy version review before release; existing acceptances must not silently acquire changed text. No legal-policy change made in this repair. |
| P02 / high | No verified GA4 web-stream measurement ID or successful event collection. Earlier connector queries were empty; this does not establish zero traffic. | Obtain actual `G-...` stream ID through account access; map consent and install one tracker; validate page views and useful events such as audience selection, interview CTA, signup completion and actual interview completion. Test no duplicates and no PII in event payloads. | GA4 Realtime/DebugView shows test events and a validated funnel. Never send an interview-complete event for merely opening a page. No guessed ID. |
| P03 / high | Search Console indexing, selected canonicals and search-query performance remain unknown. A sitemap file alone does not prove indexing. | Use a verified property to inspect key URLs, crawling, selected canonical, mobile issues and search queries. Submit the production sitemap after approved release, then follow actual indexing failures. | Verified Search Console access; changes to domain verification/DNS only if needed and separately authorised. GA4-only connector cannot perform these actions. |
| P04 / critical | The public interview page explains a framework; it does not provide a verified live interview → evaluation → report journey. “Take the Interview for Free” would currently overpromise. | Integrate the current coordinator/LANX-02/LANX-03 candidate rather than replacing it with this older branch. Verify signup/login, consent, student preservation, professional goal, actual submission, safe failure, durable feedback and refresh/re-login. Apply the free-interview CTA only when that flow and entitlement genuinely pass. | Current integration candidate + isolated test configuration/account. Backend capabilities and access rights must be real; do not fabricate reports or bypass existing gating. |
| P05 / high | Full 320–430px phone, tablet, short landscape, keyboard and authenticated accessibility acceptance is not complete. Existing CSS and static checks are not evidence of device acceptance. | Test agreed viewport matrix, menu/focus order, 44px targets, zoom, reduced motion, sticky content, overflow, media permission denial and relevant forms; fix observed failures. | Reproducible viewport/session evidence. Current browser navigation checks covered public destinations, not the whole matrix. |
| P06 / high | Exact programme/pricing/curriculum, genuine mentor proof and official corporate/refund details are not verified. This blocks informative conversion content. | Reuse confirmed founder decisions from the current candidate and owner documents, reconcile conflicting old offers, then publish truthful inclusions and terms. Add permissioned biographies/testimonials only when available. | Owner-verified current commercial facts, actual company details and proof assets. Do not invent prices, certificates, results, a 7-day guarantee, ages 7–12 or a 1-day entitlement. This is one content-approval checkpoint, not one small edit. |
| P07 / medium | Candidate-wide Google/agentic score and post-fix accessibility score have not been measured. Direct audit-class passes validate resources only. | Run a full authenticated/local Lighthouse audit where available; preserve preview protection. After approved release rerun public PageSpeed/agentic on exact live URLs and compare dates/commits. | Fresh complete audit tied to repaired commit. Experimental check counts vary; no manufactured 5/5 or guaranteed ranking. |
| P08 / critical for live benefit | Repair branch is based on older live source; production still serves it, while newer coordinator work exists separately. | Review/integrate the exact source diff into current Website/PWA candidate, preserve removed trial messaging and auth/admin work, resolve conflicts, repeat affected acceptance. Present concrete release candidate; deploy only after owner's production approval, verify live resources and maintain rollback target. | Integration checks, protected preview review, explicit production approval, exact live commit and post-release checks. No automatic merge or promotion. |

## Additional findings addressed in this follow-up

The earlier fixes disclosed availability at the top of pages, but some lower headings still contradicted them. This was incomplete and is corrected in the candidate:

- “The 1-Minute Introductory Session (Free)” becomes “Introductory Assessment (Planned)”.
- Proposed 10/20-minute formats and 90-second answer windows are labelled illustrative, not functioning assessment limits.
- Unverified 3-day/month/quarter paid passes become non-commercial preparation examples; no access or pricing promise remains.
- Public career filters are described as directory filters, not a personalised question bank or dashboard configuration.
- Unverified employer benchmark descriptions are replaced by plain workplace communication examples.
- FAQ answers consistently distinguish demonstrations from planned AI assessment.
- Feature screenshot caption now says “Illustrative app screen · availability varies”.

## Proposed privacy addition — draft only, not a replacement policy

The homepage animation does not use your camera or microphone. If you choose local voice or video rehearsal in SMART AI, your browser requests the relevant device permissions. In the reviewed implementation, the recording is held in the current screen for local playback, is not uploaded by the recorder, and is discarded when that screen closes. Choosing Save records activity duration/type on this device rather than saving the recording. Browser speech-to-text is a separate optional feature; its provider may process audio outside your device. Review that provider's permission and privacy information before enabling it. Device/site-data controls can be used to revoke permissions and clear local data. Hosted account services and any later cloud AI processing need their own accurate disclosure before activation.

This draft must be reconciled with the implemented storage and retention paths, current coordinator work and historical acceptance records before assigning a new published policy version.

## Execution order

1. Complete available source-level repairs and preserve them in the draft repair PR — done for C01–C16.
2. Reconcile with current integration candidate; finish P04/P05 using isolated test configuration. P01 policy draft can proceed in parallel conceptually without publishing new terms.
3. Resolve account/content inputs for P01/P02/P03/P06; activate only verified capabilities and measurement.
4. Close P07/P08 with full candidate acceptance, review, owner-approved production release and live retest.

No need to ask the owner to write code. Remaining owner input is limited to missing verified account/business facts and the final production decision. Do not request passwords, OTPs or private API keys in chat.

## Validation and limits

Production build/TypeScript and existing SEO, discovery/structured-data, PWA and SMART AI regression checks are used for this source change. Hosted smoke checks verify the updated availability text. No database migration, pricing/entitlement change, tracking activation, production promotion or authenticated end-to-end success is claimed.

References within this repository: `RELEASE_REVIEW_2026-11-05.md`, `AGENTIC_AND_CONTENT_REVIEW_2026-11-06.md`, `EXTERNAL_CRO_AUDIT_REVERIFICATION_2026-11-06.md`.
