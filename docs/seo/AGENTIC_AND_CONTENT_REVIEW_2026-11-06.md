# Agent discovery and content follow-through — 6 November 2026

## Baseline and target
The inspected Google PageSpeed report for the live homepage shows Performance 100, Accessibility 97, Best Practices 100, SEO 100 and Agentic Browsing **2/4**, not 2/5. The fraction counts applicable experimental checks; its denominator is not a fixed target. Goal: pass all relevant checks and preserve the experience, rather than manufacture an extra check.

Baseline report: https://pagespeed.web.dev/analysis/https-www-lanxgrow-com/iv36lurylj?form_factor=desktop

## Verified causes
- llms.txt: response was HTML without Markdown H1/links.
- ARD: homepage HTML was parsed as JSON and failed with unexpected '<'.
- Homepage contrast: undersaturated tiny feature/research/conversation labels.
- Identically named Sign-in links had different destinations.

## Candidate changes
- Real /llms.txt Markdown summary with public links and honest feature availability.
- Real /.well-known/ard.json, discovered using rel=ard on public pages. Describes an actual read-only public-guide JSON resource; does not invent an MCP server or assessment API.
- /agent-guide.json includes public routes, capability status and support information. It exposes no learner records, recordings or payment actions.
- Organization/WebSite/WebPage JSON-LD using verified public facts, without invented legal identity, ratings or testimonials.
- Social preview image metadata using the existing brand signature asset.
- Visible 'What you can try today' section on Home and Services; clarified availability and recording FAQ.
- Corrected footer Sign-in destination and retained the existing student/auth routes.
- Interactive ecosystem SVG uses group semantics rather than an implicit image containing interactive buttons.
- Caption contrast and minimum miniature-label sizes improved.

## Validation
- Production build and TypeScript.
- SEO/prerender assertions, discovery resource/link coverage, structured-data JSON parsing, existing PWA regression checks.
- Corrected caption colour (#685846) meets 4.5:1 against its tested light surfaces.
- Official Lighthouse **13.6.0** audit classes run directly against the built resource artifacts: llms-txt score 1; ard-schema score 1, no details/warnings. These tests validate the artifacts, not a complete browser Lighthouse score.
- Protected deployment HTTP/browser checks follow publishing of this candidate; no claim of Google 100 accessibility or a final 4/4/5/5 report until measured.

## Remaining content and account work
| Item | Status / next requirement |
| --- | --- |
| Accurate pricing, detailed curriculum, schedules and enrolment inclusions | Not verified; a clear team-enquiry path is present. Founder must confirm actual offers before publishing exact details. |
| Team credentials and outcome evidence | No verified biography/testimonial supplied. Do not manufacture names, certifications, testimonials or placement results. |
| Privacy-policy consistency | FAQ now distinguishes passive homepage animation, optional local recording and browser speech service. Published legal policy/version needs owner review before launch of real cloud recording/AI. |
| Analytics | Verified GA4 measurement ID and live event validation remain unavailable. No guessed ID installed. |
| Google Search Console | Needs connected property access to inspect indexing/queries and submit released sitemap. |
| Actual AI assessment and authenticated interview routing | Public page remains an honest demonstration; this SEO change does not implement backend product capabilities. |
| Full mobile and authenticated acceptance | Not represented by static validators; further real-session testing is needed. |
| Official score rerun | Google's public audit cannot evaluate an owner-protected preview. Keep privacy; rerun after approved release, or use a local authenticated Lighthouse session. |
| Production release | Requires explicit approval. Preserve coordinator changes (including removed learner trial messaging) when integrating into newer work. |

## Primary references
- https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring
- https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt
- https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/ard-schema.js
- https://github.com/ards-project/ard-spec/blob/f073b1ea9b01a5f068d0b0986426f2ea49fa30b2/spec/schemas/ard-entry.schema.json
