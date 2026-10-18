# VISUAL_BLUEPRINT.md

**LanXgrow — page-by-page visual direction**
Compiled: 18 October 2026

## Design rules (binding)

- **Preserve the approved design.** Ivory/alabaster ground, restrained terracotta accent, dark ink, serif display (Fraunces) + humanist body (Inter), generous whitespace, hairline rules, small radii, black CTAs. No new theme, no palette change, no section rewrites.
- **Original assets only.** Every visual is hand-built SVG/CSS in the LanXgrow vocabulary. No third-party logos, marks, interfaces, iconography or illustration styles — in particular nothing copied from other companies' products or pages.
- **Honest by construction.** No visual may imply a real recording, a real score, a real result or a real customer outcome. Every illustrative composition is labelled as such.
- **Meaningful over decorative.** Prefer a diagram that explains the *model* (journey, guided practice, assessment, progress) over ornament.
- **Mobile-first.** Must hold at 320/360/375/390/430 and tablet/desktop with no horizontal overflow, no overlap, and touch-safe targets. Motion must respect `prefers-reduced-motion`.
- **Calm pages stay calm.** About, FAQ and Contact receive little or no new imagery.
- **No large media files.** Vector/CSS only; no photography, no video assets.

---

## 1. Existing visual inventory (already in the codebase)

| # | Component | Where | Idea it carries | Status |
| --- | --- | --- | --- | --- |
| V1 | `TwoWaysOnePlan` | Home hero mentor card | Voice and video are two entrances to one mentor-made plan | Implemented |
| V2 | `SignalToGuidance` | Home · Smart AI | A learner speaks → patterns surface → a mentor guides | Implemented |
| V3 | `ConversationThreads` | Services · English Communication | A conversation moving between speaking and listening | Implemented |
| V4 | `GuidedPath` | Services · Mentorship | A mentor stands beside every stage of the path | Implemented |
| V5 | `VoiceScene` / `VideoScene` / `Waveform` | Home + Services | Voice/video assessment demonstration | Implemented |
| V6 | `VoiceMotif` | Hero background motif | Quiet audio-wave suggestion | Implemented |
| V7 | Brand `Logo` | Header/footer | Original wordmark | Implemented |

These already satisfy the brief's "prioritise the Home hero and product visual, the voice/video showcase, and a small number of elements on Services." The blueprint below therefore proposes **sharpening and at most two additions**, not a rebuild.

---

## 2. HOME — section order and visual direction

Order and purpose (unchanged): **Hero → Why LanXgrow → Smart AI → Journey → Closing CTA.**

### 2.1 Hero
- **Purpose:** State the brand's question and the three-part promise in one breath.
- **Headline (proposed):** *What changes when a learner can say exactly what they mean?*
- **Supporting:** see `WEBSITE_COPY.md` §1.1.
- **Recommended visual:** keep **V1 `TwoWaysOnePlan`** as the hero's product visual (the bordered mentor card), and **V6 `VoiceMotif`** as the quiet background. These together communicate "voice + video → one guided plan" without claiming any live capture.
- **Intended action:** *Get started* (primary), *Explore our services* (secondary).
- **Mobile behaviour:** card stacks below the copy; motif sits behind at low opacity and never overlaps text; the motif must remain non-interactive and `aria-hidden`.
- **Citation:** none required.

### 2.2 Why LanXgrow (three pillars)
- **Purpose:** the compact brand story.
- **Recommended visual:** none — typography-led, using the existing hairline/card treatment. Restraint here makes the hero and Smart AI visuals land harder.
- **Mobile:** pillars stack; no card taller than roughly one viewport.

### 2.3 Smart AI
- **Purpose:** explain that AI supports, never replaces, the mentor.
- **Recommended visual:** keep **V2 `SignalToGuidance`** — the single clearest "learn → signals → human guidance" composition.
- **Mobile behaviour:** the three steps become a vertical list; the panel is capped in width at mid-range (768–1023px) to avoid stretched diagrams.
- **Citation:** none required for the drawing itself.

### 2.4 Journey (Explore → Connect → Learn and practise)
- **Recommended visual (optional ➕):** a thin three-node progress rule that echoes the mentor-path vocabulary — **no** new icon set, **no** arrows pointing at outcomes.
- **Mobile:** nodes stack 01/02/03; the honest "intended journey" note stays directly under the steps.

### 2.5 Closing CTA
- **Recommended visual:** none. Keep it quiet and typographic.

---

## 3. ABOUT — deliberately minimal

- **Section order (unchanged):** Intro → Why we exist → *(new)* Measuring progress → What we believe → Approach → Commitments.
- **Visual direction:** **no new illustrations.** About should feel like a written statement of intent. If one diagram is wanted, use a **single restrained "baseline → practice → feedback → follow-up" loop** in the existing hairline style, placed inside the new "Measuring progress" section.
  - **Recommended:** the same four-step rule used on Home §2.4, so the model is visually consistent.
- **Intended action:** read, then continue to Services or Start a conversation.
- **Mobile:** the loop becomes four stacked labelled rows; text and rule never collide.
- **Citation:** if the "seven to ten years" line is used, it must sit beside the R5 attribution in plain text — **no** free-floating statistic graphic.

---

## 4. SERVICES — small number of elements only

- **Section order (unchanged):** Intro → English Communication (V3) → Mentorship (V4) → Smart AI-supported assessments (V5 tiles) → Before you begin.
- **Recommended visuals:** keep **V3, V4, V5** exactly as they are — this is the "small number of elements" the brief allows.
- **Two added micro-visuals (optional ➕), same vocabulary:**
  1. Under **English Communication**, a single "speaking · listening · expression" hairline triad (three words around one small mark) — communicates the three skills without implying a score.
  2. Under **Mentorship**, reuse the **V4 `GuidedPath`** companion pattern as a static "what happens next" strip (mentor → practice → review), *not* a second competing illustration.
- **Intended action:** *Get started* or *Start a conversation* on the relevant service.
- **Mobile:** motifs capped in width; the assessment tiles stack; the four-step strip wraps to two rows rather than shrinking below legibility.
- **Citation:** none.

---

## 5. FAQ — calm

- **Visual direction:** none beyond the existing accordion chrome and hairline dividers. The two new answers (progress, recording/privacy) are text only.
- **Intended action:** find an answer; escalate via Contact.
- **Mobile:** single column, generous row height, visible focus states, `h2`/button semantics preserved.

---

## 6. CONTACT — calm

- **Visual direction:** none. Form, aside and notice only.
- **Intended action:** submit an honest enquiry (preview or endpoint-backed).
- **Mobile:** single column; inputs full-width; the "what happens next" aside moves below the form; the preview/live notice remains visible and never collapses.
- **Citation:** none.

---

## 7. SIGN IN / ACCOUNT — quiet utility

- **Visual direction:** no illustration. The configured OTP flow uses the existing six-box `OtpInput` and alert states only.
- **Mobile:** six OTP boxes must stay tappable (current ~29px width at 320px is a carried-forward accessibility item to improve).
- **Intended action:** enter code → land on Account → sign out.

---

## 8. The voice/video assessment showcase (cross-page)

- **Purpose:** show *how* an assessment feels — the "product visual" the brief prioritises — while being unmistakably illustrative.
- **Components:** `AssessmentShowcase` with `VoiceScene` / `VideoScene`, `Waveform` (animated) and `SceneProgress`.
- **Rules to preserve:** the visible disclaimer *"Visual demonstration — no camera or microphone is in use."*; the "Illustrative preview" progress label; `Waveform animated={false}` under reduced motion; no real scoring, no inference, no "result" state.
- **Mobile:** selector stays a two-option control; scenes scale without overflow; the animated waveform pauses when reduced motion is requested.

---

## 9. Mobile behaviour checklist (applies to every visual)

1. No horizontal overflow at 320/360/375/390/430 or tablet/desktop.
2. No element wider than the viewport; diagrams cap their own width at mid-range (768–1023px).
3. Touch targets remain usable; controls reachable one-handed.
4. Text and drawing never overlap at any breakpoint.
5. All motion is subtle and disabled under `prefers-reduced-motion`.
6. Every composition that conveys meaning has a short text alternative; purely decorative layers are `aria-hidden`.

---

## 10. What the blueprint deliberately does NOT propose

- No stock photography, no video, no font changes, no new colour, no new icon library.
- No dashboard mock, no chart of "results", no progress-percentage graphic, no before/after claim.
- No logos of partners, employers or institutions.
- No illustration that could be mistaken for a real assessment output.
- No imagery on About/FAQ/Contact beyond what is described above.

This keeps the visual layer honest, original, lightweight and consistent with the approved design.
