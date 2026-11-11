# LANX-04 | Server authorization contract and acceptance gate

Scope: dev/lanx04-admin-access-20261111, issue #22. No production changes.

## Implemented
- src/admin/server-access.mjs is a **server-only** fail-closed access adapter, not a deployed API.
- src/admin/tests/server-access.test.mjs tests 35 mocked-adapter cases.
- Run: node --test src/admin/tests/server-access.test.mjs
- Validated Google-provider identity, server-derived role/audience, record ownership and current consent are required to grant learner access.
- Typed founder email is only review UI confirmation and grants no privileges.

## BLOCKED actual backend enforcement
The current repository is a Vite review frontend. No existing deployed admin, interview, assessment or video API uses this module. It must not be imported into browser code or treated as server protection.

LANX-00/backend owner must confirm the development backend and Supabase project before any synthetic writes. Implement verified token handling via Supabase getUser/JWT validation, server-controlled audience/admin role lookup, current consent lookup, trusted path-to-resource mapping, DB-row owner lookup, and event audit receipts. Reject client-controlled roles, user_metadata and claimed owner IDs. Then execute direct HTTP negative tests with two separate synthetic Google users: student interview denial, fresher/professional student video denial, unauthorized admin denial, token expiry, cross-user read/write, versioned consent, refresh/relogin and concurrent actions.

RLS/schema/shared-auth changes require separate approval. No OAuth provider or deployment protection settings changed.

## Evidence and release
Unit tests exercise mocked server adapters, NOT live Supabase enforcement or SSO. Cloud endpoint authentication, owner-only RLS, Google provider configuration, consent receipts, hosted browser and persistent audit logs remain NOT TESTED/BLOCKED.
The owner branch diverges from dev/lanx-founder-review-20261110. LANX-00 must inspect ancestry before cherry-picking or merging. NO-GO for security release until deployed endpoint denial tests pass.
