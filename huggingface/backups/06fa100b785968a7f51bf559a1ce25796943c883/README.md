---
title: LanXgrow Learning Dev
emoji: 🚀
colorFrom: yellow
colorTo: red
sdk: gradio
sdk_version: 6.30.0
app_file: app.py
python_version: "3.10"
pinned: false
---

# LanXgrow speech development test

Replace all four root files together. Keep existing ZeroGPU hardware. No provider key is required. No paid hardware is requested.

Uses openai/whisper-large-v3-turbo with bounded volume normalization, English transcription and no grammar-rewriting prompt. English is forced; mixed Hindi-English is not yet a supported evaluation target. Normalization also raises noise, so whisper recognition is not guaranteed. No aggressive denoising is enabled until tested with learner recordings.

The Convert button becomes available after the server receives the file. Source recordings are deleted after every processing attempt. Unused uploads are periodically removed from Gradio cache while the process runs; this is not a guarantee of immediate deletion from underlying hosting infrastructure.

Edge TTS sends entered text to Microsoft's online speech service. No Google Sheets, learner accounts, LLM interpretation, reports or production website changes are included.

## Acceptance checks after build

Test the SAME sentence using normal volume, soft volume and a whisper, then repeat with background noise. Include Indian English speakers and deliberately ungrammatical English. Compare transcript with the actual words, not a corrected sentence. Record failures; do not claim a measured accuracy without a labelled evaluation set. Silence must not be treated as reliable speech. Review any invented words.

The model download and GPU runtime have not been verified in the owner's Space by the code author. Free GPU quotas still apply. A 20-second limit is for this isolated test only.
