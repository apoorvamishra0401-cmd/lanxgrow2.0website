---
title: LanXgrow Learning API
sdk: docker
app_port: 7860
---
# Isolated Writing backend foundation
Not deployed or connected to customer data. No migrations run automatically.

Implemented: Supabase Auth verification via /auth/v1/user, private PostgreSQL schema, one daily writing start under row lock + unique index, server calendar entitlements, owned submission/discard, subscription-gated report listing, Docker port 7860. No service-role key in browser.

Secrets/settings required in a NEW development Hugging Face Docker Space:
- DATABASE_URL: dedicated least-privilege PostgreSQL connection to explicitly selected DEVELOPMENT project only.
- SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY: matching development authentication project.
- ALLOWED_ORIGINS: exact separate Vercel review origin.
- GROQ_API_KEY and GROQ_MODEL: server secrets for later analysis adapter; currently not called.

Run schema.sql manually ONLY after selecting isolated development DB. Provision learner row through a future trusted onboarding endpoint; never copy browser-local timestamps or subscription claims into server entitlements. Dedicated backend DB role needs schema/table permissions; do not expose schema via Data API. Tables have RLS and no client grants. Database owner connection is for setup only.

Before connecting frontend: connect frontend autosave to the deadline-checked draft endpoint, then submit the stored snapshot; durable analysis queue/lease and provider JSON schema validation; bounded retries; verified technical-failure session restoration; onboarding/auth integration; moderation; consent; request size/rate limits; DB integration tests for duplicate starts/ownership/report locks; optional Google Sheets outbox. No placeholder scores or simulated successful analysis.

Reports API returns stored report only; this foundation does not generate one. Dashboard and Writing UI remain local until isolated infrastructure and the above gates are ready. Do not deploy this unfinished backend as a live learner service.

Local: pip install -r requirements.txt; uvicorn app:app --port 7860 (from backend directory). Tests: python -m unittest discover -s backend/tests (repository root). HF filesystem is not the durable database; use external PostgreSQL. Never store recordings or API secrets in GitHub, logs, image layers or frontend variables.
