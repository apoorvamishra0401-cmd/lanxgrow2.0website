---
title: LanXgrow Learning Dev
emoji: 🎙️
colorFrom: yellow
colorTo: red
sdk: gradio
sdk_version: 6.30.0
app_file: app.py
python_version: "3.10"
pinned: false
---

# LanXgrow speech backend development

Independent Gradio ZeroGPU workspace. Not connected to the live website.

## Implemented interfaces

- `/transcribe`: audio filepath -> transcript and structured processing metadata.
- `/synthesize`: English text and American/British voice -> WAV file and duration metadata.

Audio input limit is 600 seconds per request. No 250-minute or 1,000-minute daily application cap is implemented. 1,000 minutes/day is an unverified planning target; free hosting quotas and queues apply. Generated speech is capped at 600 seconds and oversized output fails explicitly rather than silently truncating. A 24,000-character request bound protects text processing and does not guarantee output fits 600 seconds.

Speech recognition uses independent 30-second windows: boundary words can be affected and segment times are window boundaries, not verified word timestamps. The model can omit grammar errors, hallucinate speech or mishear accents; do not derive pronunciation or speaking scores solely from this transcript. Quiet-audio gain also increases noise. Indian-English TTS is not provided by these two Kokoro voices.

Original server-side input files are deleted after each attempt. Unused uploads use Gradio cache cleanup. Generated speech is deleted after a 15-minute playback window while the process runs. No guarantee is made about underlying host backups or original browser copies.

## Frontend integration

These development endpoints must not be directly used as authenticated customer APIs. Later, the separate Vercel preview server must verify the Supabase session, enforce per-activity access and time allowances, and call this Space through a server-side Gradio client. HF_TOKEN remains server-side. The current public demo has no customer authorization or production rate limit. Do not enter personal recordings during development tests.

Speech-to-speech requires an additional conversation model between the two endpoints. Video analysis requires a separate verified vision model and rubric. Neither feature is implemented here. There is no Google Sheets or durable learner data storage yet.
