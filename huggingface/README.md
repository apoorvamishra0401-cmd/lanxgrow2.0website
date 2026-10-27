# LanXgrow Hugging Face workspace

This folder is the central location for Hugging Face source, setup notes and change history.

Development Space: https://huggingface.co/spaces/Apoorva-Mishra/lanxgrow-learning-dev
Working branch: development/verify-hf-access

## Organization

- `space/`: app files intended for the development Space root: app.py, components.py, requirements.txt, packages.txt and the Space README.md. This is the source uploaded by the development deployment workflow.
- `experiments/`: separate model experiments such as Kokoro, kept independent until verified.
- `backups/`: the source snapshot taken before the current changes, available for rollback.
- `FRONTEND_INTEGRATION.md`: API contract and future authenticated Vercel preview integration.
- `CHANGELOG.md`: changes, validation and deployment status.
- This README: manual update instructions and file map.

GitHub Actions requires executable workflow files under `.github/workflows/`, outside this folder. `verify-hf-access.yml` checks access only. `deploy-hf-development.yml` tests utilities and uploads only the five files from `space/` to the development Space when those files change on the working branch.

## Manual editing

1. Select the working branch above in GitHub.
2. Open the relevant file in `space/`, or an independent experiment in `experiments/`.
3. Review its deployment status in the changelog before using it.
4. When manually updating Hugging Face, copy the contents of the chosen Space directory into the root of the intended Hugging Face Space. Do not copy the website repository root.
5. Keep GitHub source in sync with manual changes before the next automatic deployment.

## Current status

- HF_TOKEN availability, authentication and development Space write permission verified successfully on 27 October 2026.
- Automatic development deployment is configured; the first upload succeeded and file readback matched.
- Original deployed source is stored under `backups/06fa100b785968a7f51bf559a1ce25796943c883/`.
- Kokoro and Whisper backend source is in `space/`. Hugging Face build/runtime checks are tracked in CHANGELOG.md; upload success alone does not establish working inference.
- No production website deployment is authorized by this organizational change.

## Secrets and capacity

Store HF_TOKEN only in GitHub Actions secrets. Provider keys belong in Hugging Face Secrets, never in this folder.
No 250-minute daily application cap is requested. 1,000 minutes/day is a planning target, not a measured capacity guarantee. Ten-minute audio bounds and chunking are implemented; real ten-minute GPU runtime and audio quality still require evaluation.
