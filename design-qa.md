# Lan-X assessment frontend design QA — 29 October 2026

final result: passed

Scope: responsive frontend review, not production release or live assessment verification. Vercel team authorization was resolved; remote preview publication is being verified separately. Real authentication, AI analysis, payment verification, media-device permission grants and native phone hardware remain unverified.

## Sources and captures
- Source visual truth: owner-uploaded `LanXgrow_ Meet Lan-X(1).png`, `LanXgrow English Learning Dashboard(2).png`, and the seven accompanying setup, active assessment, processing, report, comparison and payment screenshots.
- Source mobile images: 853 × 1844 pixels. Normalized for composition comparison to 390 × 844 pixels. Source CSS density was not supplied; normalization is geometric, not a claim about original font metrics.
- Browser captures: `docs/preview/assessment-qa/intro-390.jpg` and `home-390.jpg`, 390 × 844 pixels; Chrome cloud browser with an actual 390 × 844 iframe viewport. The temporary QA host was removed from delivery.
- Combined comparison inputs: `comparison-intro.jpg`, `comparison-home.jpg`. Both were opened with view_image, after viewing the originals and browser captures. Full source images were reviewed for all nine supplied designs.
- Additional rendered widths: 320 phone, 768 tablet, full browser desktop. Normal vertical scrolling is retained.

## Five fidelity surfaces
1. Typography: existing Fraunces/Inter reused. Serif display headings and readable sans-serif controls match the established brand hierarchy. Source raster font cannot be determined exactly; native website fonts deliberately retained.
2. Spacing/layout: intro maintains logo → heading → central orb → explanation → CTA. Both Home designs retained. Responsive Home uses two activity columns on phones and four on tablet/desktop to avoid the supplied board's tiny mobile card text. This is an intentional readable reflow, not a pixel-identical copy of its condensed four-column board.
3. Colours: existing warm ivory/charcoal/terracotta variables retained with restrained champagne surfaces and subdued semantic report tints. No unrelated theme introduced.
4. Assets: supplied official logo, orb, neutral camera illustration, companion, document art and main activity illustrations reused as small WebP assets. No full-page screenshot UI. Orb is an animated raster, not an independently simulated 3D mesh; this boundary is documented.
5. Copy: key headings, questions, guidance and report naming retained. Intentional changes: Home CTA → Start learning; unapproved price → Price to be confirmed; fake playable report audio → disabled until real audio exists; account status → neutral view-plan text; clearly separate frontend review controls and fixture notices.

Focused details were readable in normalized comparisons: logo geometry, orb identity, serif heading, CTA shape and colours, 3D activity icons. No extra zoom was needed to identify those features.

## Comparison / repair history
- P2: 320px Home grid overflowed horizontally (body width 305, scroll width 314). Fixed minmax(0,1fr), zero intrinsic button minimum and smaller small-phone title size. Retest: body width = scroll width = 305. 768px retest: body width = scroll width = 753; all images loaded.
- P2: companion crop included a fragment of neighbouring source text. Recropped from the clean illustration area. Latest capture contains no source-copy fragment.
- P2: initial programmatic heading focus produced a large outline around the title. Removed outline only from non-interactive h1 focus; interactive controls retain visible keyboard focus.
- P2: initial main Home activity icons were flat line icons rather than the supplied 3D art. Replaced them with the actual supplied activity illustrations.
- No remaining actionable P0/P1/P2 findings within the responsive frontend-review scope. This is not a claim of pixel-identical fidelity or production readiness.

## Interactions verified in the cloud browser
- Intro → setup → active conversation.
- No camera/microphone success status before permission.
- Open conversation → type local response → advance scripted question; previous response remains visible.
- End-assessment confirmation → processing → explicitly open example Snapshot.
- Snapshot → comparison → checkout → pending → error → return to Snapshot → Start learning → new Home.
- Full existing 14-step local onboarding → existing welcome video finishes → Meet Lan-X.
- Inside the integrated learner container, Snapshot → Start learning → new Home → switch to existing Home, preserving local profile.
- Speaking and listening appearance controls change computed animation names to af-speak and af-listen with different colour/brightness treatments.
- 320px Home buttons inspected: no visible button under 44px high.
- Console inspected: returned errors were browser-extension metadata messages, not application exceptions. No application error was observed in the exercised paths.
- TypeScript and production build passed.

## Expected boundaries / follow-up
- Review chrome adds vertical space compared with the source's bare app canvas.
- Small orbit lights currently move with the supplied raster rather than as independent meshes. Real TTS playback will drive speaking state in a later integration.
- Device permission grant/denial and recording playback need real-phone hands-on testing; no permission was granted during automated review.
- Payment success is a labelled fixture only, never an entitlement. Price, benefits and seven-day access start rules remain to be approved.
- Production welcome video was not changed or replaced by this task.
