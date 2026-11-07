# LANX-00 isolated Writing HTTP checkpoint — 2026-11-07

## Scope
Branch: `dev/lanx00-stage2-backend-isolated-20261107`.
Added `backend_dev/auth.py`, `backend_dev/http_api.py`, `tests/test_http_auth.py`.
No production deployment, database schema/RLS, DNS, or paid AI calls.

## Local verification
`python -m unittest discover -s tests -p 'test_http_auth.py' -v` — 4 tests PASS in local Python 3.13 environment (PyJWT and cryptography installed).
Tests exercise loopback HTTP, generated RS256 test keys, JWT issuer/audience/expiry validation, cross-user 404 isolation, SQLite restart readback, invalid requests, and evaluator failure.

## Explicit limitations / release gate
- JWT verifier requires explicitly configured development Supabase issuer and public PEM; only RS256. Actual dev project's signing algorithm/key has NOT been verified; if it uses ES256 or legacy HS256, this adapter cannot be used as-is.
- Evaluator is injected synthetic callback. RC2 Soul `client(text, context)` contract integration remains pending.
- SQLite persists only on the local filesystem; not durable hosted storage.
- No hosted auth, CORS, browser, load, or cloud persistence acceptance.
- Local HTTP server binds 127.0.0.1 only; not for deployment.
- No frontend wiring; not production ready.
- Dependency installation must include PyJWT and cryptography.
- Source RC2 archive lacks verified Git ancestry; this branch is a separately isolated development implementation, not a proven RC2 merge.
- Prior baseline tests were not re-run against a fresh GitHub checkout in this checkpoint.

## Next steps
Confirm dev Supabase JWKS signing algorithm and issuer using read-only access; adapt to pinned JWKS public keys without trusting arbitrary token headers. Integrate RC2 evaluator contract with $0 synthetic fallback, add HTTP idempotency and error-state persistence, verify ownership and consent rules, then protected preview only with separate approval.
