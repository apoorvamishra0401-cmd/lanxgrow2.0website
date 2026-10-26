---
title: LanXgrow Learning Dev
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
python_version: '3.11'
---
# LanXgrow isolated component setup
Upload these files to the DEVELOPMENT Gradio Space only. No live-site connection.

Dependencies: Gradio + Edge-TTS. Local transcription is OPTIONAL: add requirements-speech.txt packages to requirements.txt and set ENABLE_LOCAL_STT=true to opt into CPU Whisper base.en/int8 download. Model weights are not bundled or downloaded on startup. No GPU allocation is required by this implementation. ZeroGPU selected hardware does not itself guarantee continuous GPU access.

Speech output: Edge-TTS is an open-source CLIENT of Microsoft's online speech service, not an offline model or guaranteed unlimited production API. No key required, but availability and usage suitability must be checked before launch. Only fictional sample text in this development utility.

No LLM, customer database, visual scoring, subscription, consent, moderation or learner auth is activated here. Do not submit customer information. User-facing public app remains unchanged. Writing backend foundations remain in backend/ and must not be exposed through anonymous Gradio callbacks.

Runtime: queue concurrency 1, max queue 8; max speech input 500 characters; no raw provider errors. Temporary generated audio is removed by Gradio cache cleanup (60-second age, 30-second scan interval), not immediate deletion. Provider-side retention is separate. Audio uploads and real learners are intentionally disabled until authentication/consent/retention are integrated.

API keys are NOT needed for this initial sample TTS setup. Later: GROQ_API_KEY, GROQ_MODEL, separate dev database and verified auth configuration. Put secrets only in Space Settings > Secrets. Do not place secrets in this repository. No Google Sheets export or media uploads are enabled.

Not runtime-verified on owner Space yet. requirements-speech.txt is optional, not a complete installed STT service. Speech adapter unit tests cover text/voice validation only; online synthesis and model download require deployment checks.
