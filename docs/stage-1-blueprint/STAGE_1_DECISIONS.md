# STAGE_1_DECISIONS.md

**LanXgrow — open questions, assumptions, and decisions required**
Compiled: 18 October 2026

This file records everything that cannot be resolved without the founder. It separates (A) decisions needed, (B) assumptions this blueprint makes, (C) claims awaiting approval, and (D) known unknowns we chose not to paper over.

---

## A. Decisions required from the founder

| # | Decision | Options | Why it needs you |
| --- | --- | --- | --- |
| D1 | **Home headline** | (a) keep *"The confidence to speak English, built with care."* (b) adopt the proposed question *"What changes when a learner can say exactly what they mean?"* | The brief asks Home to open with a reflective question, but the existing headline is approved copy. This is a direct replacement. |
| D2 | **Publish any statistic?** | (a) publish **none** (recommended). (b) publish one: *"57.3% of rural 14–18-year-olds can read English sentences (ASER 2023)."* | Only one figure clears the evidence bar, and even it is a *reading*, rural-only measure. It must never be dressed up as "Indian students can't speak English". |
| D3 | **Knowledge-and-use section placement** | (a) Home + About (proposed). (b) About only (leaner Home). | Affects Home length and emphasis. |
| D4 | **Add the "Measuring progress" section to About?** | (a) yes (proposed). (b) fold into FAQ only. | Introduces the baseline → tasks → feedback → follow-up model the brief requests; it is a substantive new section. |
| D5 | **Add the two new FAQ items?** (progress; recording/privacy) | (a) both (proposed). (b) progress only. | The privacy answer commits future behaviour, so it should be your words. |
| D6 | **Verify the "seven to ten years" claim wording** | keep, soften, or drop | It is the one research-backed sentence proposed for public use (British Council 2022). Confirm you are comfortable attributing it as "a 2022 British Council review of Indian school English teaching". |
| D7 | **Contact channel publishing** | provide verified email/phone/address, or stay blank | `contactChannels` is intentionally empty. The site renders an honest placeholder until you supply real, verified channels. Do **not** invent one. |
| D8 | **Auth scope for launch** | (a) email OTP only. (b) email + phone | Phone needs a **paid** SMS provider and must not be activated without your explicit approval. |
| D9 | **Enquiry delivery** | provide a real HTTPS endpoint, or leave the form as an honest preview | If you want enquiries to actually arrive, we need a working endpoint. No free, safe mechanism exists in the current workspace. |

---

## B. Assumptions this blueprint makes (please confirm or correct)

1. The audience remains **parents, students and adult learners** interested in English Communication. (Confirmed by the brief.)
2. The four services/pillars and the two published services stay unchanged.
3. The approved visual design must not change; this blueprint only sharpens copy and adds at most two small visuals.
4. "Smart AI" support is **not yet built**; nothing on the site should imply it is running today.
5. No pricing, schedule, guarantee or cohort fact is public yet.
6. LandXgrow will **not** position itself against mother-tongue learning. (NEP 2020 foregrounds multilingualism; the About page should respect that.)
7. No Vedic Maths content belongs on this website (standing instruction).

---

## C. Claims awaiting explicit approval

Every item below is a *claim*, i.e. something a reader could hold the company to.

| # | Claim | Source strength | Recommendation |
| --- | --- | --- | --- |
| C1 | "Children in India typically study English for seven to ten years at school, yet speaking and listening get comparatively little practice." | Strong qualitative (British Council 2022 review; R5) | **Approve with attribution.** |
| C2 | "Employers consistently rank communication-adjacent skills — listening, empathy, influence — among the most valued." | Strong but global (WEF 2025; R2) | **Approve with "globally" wording.** |
| C3 | "57.3% of rural 14–18-year-olds can read English sentences." | Strong but narrow (ASER 2023; R1) | **Optional.** Must keep "rural", "14–18", "read". |
| C4 | Baseline → comparable tasks → feedback → follow-up as the progress method | Future-facing product description | **Approve** and keep the "no fixed timeline" sentence. |
| C5 | "Nothing is recorded on this website." | Factually true today | **Approve**; revisit before live assessments ship. |

**Not approved and not proposed:** wage/uplift percentages (R3a), "47% unemployable" (R8a), the 54.81% employability figure as a national fact (R8), any South-India statistic (R7/R10), any outcome guarantee or timeline.

---

## D. Known unknowns and unresolved issues

1. **No representative statistic on spoken English in India exists** in the sources reviewed. If the founder wants a figure about *speaking*, the honest answer is: we do not have one. Do not manufacture one.
2. **The live authentication path is unverified end-to-end.** It requires the owner's Supabase project URL/anon key plus a custom SMTP setup (the built-in email sender is rate-limited and not for production, and the code-email template is gated behind custom SMTP). Only a local stub was exercised. Before launch, this must be proven against the real project.
3. **Phone/SMS OTP is blocked by the free tier.** Document, do not activate.
4. **No live contact endpoint exists**, so "enquiry sent" can only be shown after a real 2xx from a real endpoint.
5. **Lighthouse and pixel-level visual review for the current stage are outstanding** (tooling unavailable in this workspace). A Stage 2 pass previously scored 100/100/100; that does not carry forward automatically.
6. **Larger "Smart AI" product claims** remain undefined: what exactly is measured, how, and with what accuracy is unknown. Until it is defined, the site must continue to describe it as support for mentorship, with no accuracy or scoring claims.
7. **Restricted: no large media files.** Any future photography/video needs a separate decision and must not enter the repo as large binaries.
8. **Stale in-code notes** (`package.json` "Stage 1 (visual frontend only)", `TODO(stage-2)` in `site.ts`) should be corrected when implementation resumes; they are internal only but misleading.
9. **Focus on the free tier.** Nothing in this blueprint requires a paid service. Any step that would (SMS provider, custom domain email sending beyond free limits) must be brought to you first.

---

## E. Recommended next step

Approve or amend D1–D9 and C1–C5. On approval, implementation would (in a later, explicitly-authorised stage) apply the copy revisions, add the two small visuals and the two FAQ items, correct the stale in-code notes, add a README, and run build + type + responsive verification. **No such work has been started.**
