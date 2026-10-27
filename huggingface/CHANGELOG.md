# Hugging Face change history

## 27 October 2026 — speech backend implementation

- Downloaded the currently deployed four-file source snapshot at `06fa100b785968a7f51bf559a1ce25796943c883` into `backups/06fa100b785968a7f51bf559a1ce25796943c883/`.
- Prepared Whisper large-v3-turbo input processing up to 600 seconds, in independent 30-second windows.
- Added Kokoro-82M American and British voice synthesis with a 600-second output bound.
- Added named `transcribe` and `synthesize` interfaces for later frontend adapter work, shared GPU queue, media cleanup and bounded input processing.
- Added a development-only workflow uploading five files, with source readback verification. It does not delete files or modify hardware.
- Preserved the original source snapshot for rollback. Production website unchanged.
- Runtime, model compatibility, 10-minute generation and recognition quality must be checked on Hugging Face after build. Vision, conversation, auth and frontend connection remain pending.

## Access verification

HF_TOKEN availability, authentication and development Space write permission verified: https://github.com/apoorvamishra0401-cmd/lanxgrow2.0website/actions/runs/40459228186
