# Voice quality diagnosis — 28 October 2026

## Owner feedback and preserved choices
- Provisional female preference: native-accent audition first/Indian-labelled clip.
- Provisional male preference: third/British-labelled clip, relatively more expression.
- Both remain below the owner's target; not approved as production interviewer voices.
- Owner reports echo in female American/British samples, insufficient emotion, weak accent differences and unstable identities.
- Earlier first question female clip (10.92 seconds) remains an identity checkpoint.

## Verified implementation facts
1. Previous three accent variants shared the same synthetic reference within each gender. Only the accent phrase in an instruction changed. No region-specific native speaker was selected.
2. All those calls used controllable reference mode: use_prompt_text=False. Exact-transcript continuation was never tested in those accent calls.
3. The reference lineage repeatedly used generated outputs as subsequent references: original voice design -> v2 B -> v3 question -> primary accent auditions.
4. Model receives the instruction as a parenthesized prefix to text. Demo forwards target_text, cfg_value and reference base64 to a separate hosted backend.
5. This public demo API exposes CFG but no seed or inference-step setting. We did not tune those hidden parameters or fine-tune model weights.
6. Stored six primary-accent source files: mono MP3, 48 kHz, 192 kbps. Decode is valid, finite samples; no samples at abs >= .999 in the tested decoded 24 kHz stream. This does not establish naturalness or absence of reverb.
7. Our generation scripts add no echo, chorus or room reverb. The sequential previews inserted only silence between clips.
8. Audio auditions have no live user STT/contextual conversation model attached. They cannot demonstrate actual understanding, adaptive response or end-to-end latency.
9. Technical file checks, human perceived quality and accent identification are different acceptance gates. Previous successful checks established only technical validity.

## Supported interpretation, not proven root cause
- Reference conditioning may dominate the text accent request. The failed listener review means accent control is unproven; catalogue labels must not be treated as evidence.
- Reusing synthetic reference generations may carry acoustic defects and drift forward. It is a risk, not a proven explanation for this echo.
- Long, overlapping delivery instructions may give weaker control than a short single-direction test. More prose is not evidence of improved expression.
- Echo may be generated reverb, repetition or playback overlap. Mono audio and clean decoding cannot decide which. Preserve raw sources and compare one at a time.
- Model documentation explicitly notes variable style-control results. No instruction guarantees one identity, three accents and commercial-service quality simultaneously.

## Controlled corrective tests in voice_gap_controls.py
A. Six native-locale stock voices selected from a live catalogue matching locale and gender: en-IN/en-US/en-GB. This tests identifiable regional baselines without clone/accent conflict.
   These are different speakers and a hosted proprietary Microsoft service via open-source edge-tts. Not our selected VoxCPM identity, not an open-weight model, and not a promised production provider.
B. Two selected-voice references with their exact reference transcript, use_prompt_text=True, no conflicting style instruction. This tests identity continuation separately; it does not attempt an accent transformation.
All calls use the same new short passage with diagnostic words (after, class, hard, words, starting, thought).
No paid upgrade or production deploy. Record provider failures rather than pretending samples succeeded.

## Acceptance gates before production
- Listening: no perceptible echo/repeated words; natural pacing, clear pronunciation, appropriate curiosity/correction and stable speaker identity over multiple different turns.
- Accent: independent competent listener identifies requested region without seeing its label; do not manufacture a classifier score.
- Text fidelity: transcript checked against exact script; no swallowed or added words.
- Repeatability: keep fixed approved reference; avoid promoting each new output as the next reference.
- Conversation: connect actual STT -> context-bearing response -> delivery plan -> TTS only after voice tests; test meaning-dependent tone, turn timing and failures.
- Performance: measure first audible response and complete turn, not file generation time alone.
- If a model cannot pass these gates, retain the preferred samples as benchmarks and compare another capable engine. Do not keep claiming prompt-only progress.
- User review required before any voice replaces a primary or reaches a live application.

Sources checked:
https://voxcpm.readthedocs.io/en/latest/cookbook.html
https://voxcpm.readthedocs.io/en/latest/usage_guide.html
https://huggingface.co/openbmb/VoxCPM2
https://github.com/rany2/edge-tts
https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
