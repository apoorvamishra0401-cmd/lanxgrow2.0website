# American voice model comparison — 28 October 2026

All six generated files use the same target script. They have valid readable 24 kHz audio and nonzero signal. Perceived naturalness, American accent, pronunciation, transcript fidelity and coaching delivery still need listener review. No 98% score was measured.

| Requested item | Exact tested model | Result |
| --- | --- | --- |
| Qwen3-TTS-0.6B | Qwen/Qwen3-TTS-12Hz-0.6B-Base | Male and female WAV generated through official Qwen demo |
| VibeVoice-0.5B | microsoft/VibeVoice-Realtime-0.5B | Carter and Grace English preset WAVs generated through the model-linked demo; accent unverified |
| Chatterbox Turbo | ResembleAI/chatterbox-turbo | Male and female WAV generated through official ResembleAI demo |
| Miso One | MisoLabs/MisoTTS (8B) | Attempt blocked by ZeroGPU quota before output; no Miso sample generated |
| VibeVoice | Legacy VibeVoice-TTS-1.5B if distinct from Realtime | Not tested: Microsoft lists legacy demo disabled and original TTS code removed; do not count 0.5B twice |

## Comparison limitations

- Qwen Base, Chatterbox and Miso use the same previously generated synthetic Kokoro American reference voices; they do not use a real person's recording. Reference quality can affect output style.
- VibeVoice uses embedded presets instead of those references, so this is not a controlled speaker-identity comparison.
- Request timings include remote queue, transport and download; they are not comparable local inference benchmarks.
- Qwen 0.6B Base is a reference-conditioned model, not the earlier 1.7B VoiceDesign model.
- Miso is an 8B model, not a tiny CPU alternative. Its model card marks licence as 'other'; review exact licence before commercial adoption.
- Public demos are audition tools, not dependable production backends. Nothing was connected to the customer website or installed into the LanXgrow backend.
- No quota bypass, paid hardware upgrade, watermark stripping or real-person voice cloning was performed.

## Sources

- https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base
- https://huggingface.co/ResembleAI/chatterbox-turbo
- https://huggingface.co/microsoft/VibeVoice-Realtime-0.5B
- https://github.com/microsoft/VibeVoice
- https://huggingface.co/MisoLabs/MisoTTS
- https://github.com/MisoLabsAI/MisoTTS

Next decision: listener shortlist, then repeatability, longer text, real deployment resource/latency testing and licence review before choosing a backend model.
