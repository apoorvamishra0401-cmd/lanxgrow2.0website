# Connected Practice setup (development only)

Project: `lanxgrow-auth-development` (`kzjvvwuyigiclryoqpkv`). Never run this on production.

## Current release boundary

The frontend and design review are implemented. `VITE_CONNECTED_PRACTICE` defaults off, so the separate preview uses explicitly labelled sample review without account writes. Neither opening a screen nor sample answers award real learning days, scores or CEFR levels.

The `practice_journey.sql` setup and `learning-practice` Edge Function are prepared but not applied/deployed: native Supabase setup confirmations expired. Do not describe the new storage integration as verified until the checks below pass.

## Enable real session persistence

1. Review and apply `practice_journey.sql` to the development project. It adds one owner-readable table, a service-only transactional session-start RPC and a private 25 MB-per-file audio bucket. Client roles cannot write reports, change session status or bypass milestones.
2. Deploy every file in `supabase/functions/learning-practice/` with entrypoint `index.ts`, import map `deno.json`, and platform JWT verification disabled only because the function explicitly verifies every bearer token through Supabase Auth. Preserve CORS restrictions to the preview and local development origins.
3. Using disposable development users, verify ownership, draft saving, signed audio playback, missing-upload rejection, stale-revision rejection, double-submit idempotency, one daily session at midnight India time, absence/resume, and the 15/30-day milestone boundaries.
4. Add verified lesson narration assets and set each original topic's `audioSrc`. No browser speech recognition or browser TTS is used. The original Qwen public demos returned no generated audio during this task; do not claim narration is ready.
5. Define consent/retention and abandoned-upload cleanup before inviting customer uploads. Original media must be deleted after successful future analysis; reports/transcripts remain. The current response-storage function does not perform media analysis or deletion.
6. Enable `VITE_CONNECTED_PRACTICE=true` only for the Vercel preview after those checks. Never change production environment variables or domains as part of this setup.

## Learning/report boundary

- Completed material counts as a submitted learning day, not mastery. Server-derived totals and transactional session IDs prevent duplicate learning-day credit.
- A submitted milestone opens the next block regardless of marks. No invented 70% passing threshold is implemented.
- Model analysis must write evidence-linked `report` data through a trusted backend. Learners have read-only access to reports.
- Report fields support four skill breakdowns, actual learner excerpts, strengths, improvements and next steps. Unsupported skill levels must stay absent. Read-aloud cannot establish reading comprehension or independent grammar by itself.
- `reportFocus` uses reviewed improvements; it does not fabricate weaknesses. The full adaptive exercise generator, pronunciation analysis, voice report, baseline inference and three-month curriculum remain separate pending work.
- Six original editorial topic sets are seed content. They are not recent news, copyrighted extracts, celebrity quotations or a completed 90-day curriculum.
- UI completion records the eight expressions presented. Correct independent usage requires actual reviewed evidence and is never inferred from exposure alone.

Phone provider setup and real Google/email authentication tests remain pending separately.
