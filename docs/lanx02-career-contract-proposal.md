# LANX-02 compatibility proposal — review by LANX-00 and LANX-03

**Status:** Proposed API shapes, not currently deployed endpoints or accepted shared DTOs. Owner-scope branch only. Do not wire into a live environment without separate review.

## UI and authorization boundary

- Component: `src/features/interview/InterviewPreparation.tsx`, rendered with a `CareerTransport` instance.
- No default transport: absent service must display **unavailable**, not claim an interview is saved, evaluated, or scored.
- LANX-00 owns route registration, current authenticated access token, consent/version verification, source of truth for audience and entitlements, and any age eligibility decisions. Frontend role flags are not an authorization boundary.
- Server must authorize every operation from the bearer identity, not a client-supplied `ownerId`, `audience`, or arbitrary attempt identifier.
- Only verified `fresher` and `professional` audiences may start; students are denied even with a fabricated UI flag.
- Keep separate from the 60-second founder/guest introduction and student Video Practice. No public auth/route changes in this patch.

## Proposed HTTP mapping (not an existing claim)

| Method | Relative path under explicitly configured `baseUrl` | Shape / durable side effect |
|---|---|---|
| GET | `career/access` | `{userId, audience, allowed}` derived from trusted server context |
| POST | `career/attempts` | `{kind}`, Idempotency-Key header, returns `Attempt`; creates exactly one owner-scoped timed attempt per key |
| GET | `career/attempts/:attemptId` | Restores server-persisted questions, answers, deadline and receipt; foreign owner must be denied |
| PUT | `career/attempts/:attemptId/answers/:questionId` | `{value}`, server validates ownership, prompt assignment, revision/deadline |
| POST | `career/attempts/:attemptId/submission` | Multipart `attemptId` plus optional `recording`; Idempotency-Key header, returns durable `Receipt` |
| GET | `career/receipts/:receiptId` | `{id, status, reportId?, error?}`, readback only for authenticated owner |

The proposed `Attempt` is `{id,ownerId,kind,audience,startedAt,deadlineAt,questions:[{id,prompt,format,choices?}],answers,status,receipt?}`. Server timestamps must be immutable, with 600-second video and 1,200-second assessment maximum duration. Reject or truncate overlong starts rather than trusting client clocks. The browser timer is informative only.

## Idempotency and crash recovery

- Start: client stores a pending random idempotency key in sessionStorage through ambiguous network failure; clears it only on confirmed start. New completed attempts use new start keys. Server must scope and persist deduplication by authenticated owner, kind, and key.
- Submit: `lanx02-submit:<attemptId>` stays stable across refresh/retry; server must deduplicate atomic durable job creation, receipt creation and media association. A lost HTTP acknowledgement must not create a second logical job.
- Receipt: must be committed durably before returning a successful HTTP response. A process restart must preserve owner-isolated readback.
- Browser retains only attempt-id metadata in localStorage, partitioned by authenticated owner and journey; no raw video or sensitive answers. On refresh, server restores the answers and the original deadline.
- Raw media is **not** durable until successfully uploaded. Refresh loses locally recorded segments; the UI warns that the learner must re-enable camera and re-record if time remains. Complete resumable media upload requires an additional approved backend contract.
- Camera denial, unsupported MediaRecorder, stale session, offline save, duplicate submit, elapsed time, and failed receipt lookup must surface recoverable UI errors.
- Server must enforce request size, media type, anti-abuse limits, storage security, and retention policy. Do not assume local browser consent checkbox replaces formal legal acceptance.

## LANX-03 evaluation handoff — approval required

- Accept only verified durable owner-scoped video/assessment submission references, authoritative question IDs and versions, and documented consent.
- Define pinned evaluator input/output shapes and provider failure states. Do not score empty evidence or classify an unconfirmed upload as successful.
- Receipt `queued/processing/complete/failed` and `reportId` must be issued by the trusted service; the UI does not calculate scores.
- LANX-03/LANX-00 must confirm report URL/reader, access control, language/format handling, and whether retry is the same job or a new idempotently linked generation.
- Questions in `questionBank.ts` are original prompt templates to version server-side, not proprietary test copies or a substitute for secure assignment.

## Evidence and remaining blockers

- Synthetic unit/fixture/HTTP-adapter tests run in the isolated branch with Node 22; they are **not** evidence of a deployed endpoint, production database, browser permission flow or real AI evaluator.
- Need real development endpoint, authenticated test accounts, durable job storage, authorized media upload, report-reader contract, and browser E2E tests on phones/tablets/desktops.
- Do not change shared router/auth, schema/RLS, consent policy versions or live Vercel deployment as part of this patch.
