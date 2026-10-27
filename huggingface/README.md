# LanXgrow Hugging Face workspace

This folder is the central location for Hugging Face source, setup notes and change history.

Development Space: https://huggingface.co/spaces/Apoorva-Mishra/lanxgrow-learning-dev
Working branch: development/verify-hf-access

## Organization

- `space/`: app files intended for the development Space root: app.py, components.py, requirements.txt, packages.txt and the Space README.md. Populate from the actual deployed Space before enabling sync; do not substitute an unverified earlier sample.
- `experiments/`: separate model experiments such as Kokoro, kept independent until verified.
- `CHANGELOG.md`: changes, validation and deployment status.
- This README: manual update instructions and file map.

GitHub Actions requires executable workflow files under `.github/workflows/`, outside this folder. The existing `verify-hf-access.yml` checks access only and does not deploy anything.

## Manual editing

1. Select the working branch above in GitHub.
2. Open the relevant file in `space/`, or an independent experiment in `experiments/`.
3. Review its deployment status in the changelog before using it.
4. When manually updating Hugging Face, copy the contents of the chosen Space directory into the root of the intended Hugging Face Space. Do not copy the website repository root.
5. Keep GitHub source in sync with manual changes before the next automatic deployment.

## Current status

- HF_TOKEN availability, authentication and development Space write permission verified successfully on 27 October 2026.
- Automatic deployment is not configured yet.
- No authoritative snapshot of the deployed Space source has been copied here yet.
- Model examples from earlier chat remain unverified until installed and tested.
- No production website deployment is authorized by this organizational change.

## Secrets and capacity

Store HF_TOKEN only in GitHub Actions secrets. Provider keys belong in Hugging Face Secrets, never in this folder.
No 250-minute daily application cap is requested. 1,000 minutes/day is a planning target, not a measured capacity guarantee. Ten-minute media support is a requirement to implement and test, not current verified functionality.
