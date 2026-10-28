# Audition status — 28 October 2026

No new voice sample was generated in this run.

1. Initial CI runner lacked ffmpeg. Fixed reference transport using the existing soundfile library; no new system dependency.
2. CosyVoice3 official demo rejects the requested arbitrary mentor-style instruction because its Gradio dropdown accepts fixed presets only. This is a hosted-demo control limitation, not evidence the model sounds bad.
3. Added API-schema preflight to detect that restriction before inference. No further CosyVoice retry under the exhausted quota.
4. Miso rejected the first GPU request: 120 seconds requested, 0 seconds free quota left.
5. Remaining GPU calls stopped. No quota bypass, account switching, paid upgrade or model substitution.
6. Raw first transport failures and subsequent results remain in Git history.
7. Existing working speech workspace, hardware, production website and frontend deployments remain unchanged.

Next permitted work:
- Use already published model demonstrations for screening without consuming inference quota.
- Verify an interface exposing CosyVoice's intended controls before another audition.
- When quota is actually available, run a bounded Miso audition.
- Review Sesame CSM access/compute and reference requirements before attempting an audition.
- Keep report-narration shortlist and paused-voice policy in voice_candidate_policy.json.
