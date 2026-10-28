# Go integration decision — 28 October 2026

Status: evaluated, not implemented. Owner's React + Go/Java + Python suggestion is optional.

## Current verified source
- Frontend package.json: React 18, Vite, TypeScript; Tailwind dependency exists.
- Speech workspace: Python + Gradio, PyTorch/Transformers and Kokoro.
- Current Gradio queue has max_size=8 and default_concurrency_limit=1.
- This is not evidence that all future users can be served concurrently.
- Voice auditions run separately; no frontend production connection or replacement voice is claimed.

## Decision
Keep the existing frontend and Python/Gradio speech workspace while validating model quality and runtime reliability.
Do not migrate the ZeroGPU Space to Docker or rewrite inference in Go.
Go remains a possible later CPU gateway for connection management and request routing.
No Go/Java runtime, new paid service, SDK conversion or production deployment has been added.

## Why
Go is free/open source and suitable for compiled network services and concurrency.
It does not itself improve voice naturalness, provide a GPU, eliminate free quotas or guarantee faster model inference.
PyTorch's heavy tensor work executes in native CPU/GPU kernels; a language change around those calls is not a measured inference speedup.
An extra service adds deployment, memory, logging, authentication and inter-service failure paths.
HF Docker Spaces support Go endpoints, but ZeroGPU documentation currently limits compatibility to the Gradio SDK. A Docker SDK conversion is not an equivalent free GPU setup.

## If measurements later justify Go
Keep Python responsible for model execution.
A separate Go CPU gateway can authenticate requests, stream/buffer bounded audio, enforce backpressure and forward to Python APIs.
Use a long-running Python worker rather than spawning Python or reloading models per turn.
Preserve server-side session identity, verified auth and idempotency; those are future implementation requirements, not completed features.
Do not buffer entire concurrent audio sessions unnecessarily or add workers that duplicate GPU model memory.

## Measure before choosing
Record upload/capture delay, queue wait, STT time, response generation time, TTS first-audio delay, audio transfer and total turn latency separately.
Compare existing Python routing against any proposed Go gateway under the same workload and hardware.
Only adopt the extra gateway if it resolves an observed routing/connection bottleneck without harming reliability, memory budget or HF compatibility.
No performance percentage or 1,000-minute daily capacity is guaranteed.

## Cost boundary
Language/toolchain licence cost is separate from compute, model API and storage costs.
No paid hardware, billing or credits enabled.
Free service quotas, sleep behaviour and account eligibility still apply.

## Voice policy
See voice_candidate_policy.json.
Pause rejected Kokoro/VoxCPM2/Edge auditions and previously unused second-choice Qwen.
Retain liked VibeVoice Carter and Chatterbox male for report-narration evaluation.
Next untested auditions: CosyVoice3 and Miso; Sesame CSM remains research/access/compute review.
Historical liked female first-clip reference can be used as a benchmark without selecting its engine.
Use different speakers for different accents when needed; do not call an accent verified from an instruction alone.

Sources verified:
https://go.dev/doc/faq
https://go.dev/LICENSE
https://huggingface.co/docs/hub/spaces-sdks-docker
https://huggingface.co/docs/hub/spaces-zerogpu
