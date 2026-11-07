# Isolated Writing backend (development only)

This package is not connected to the website, RC2 interview flow or hosted Supabase.

Install offline test dependencies from an approved source:
`python -m pip install -r backend_dev/requirements-dev.txt`

Run:
`python -m unittest discover -s tests -p 'test_writing_api.py' -v`
`python -m unittest discover -s tests -p 'test_http_auth.py' -v`

The JWT verifier supports explicitly configured RS256 PEM keys and rejects other algorithms. Before integration, verify the actual development Supabase JWKS issuer and key rotation behavior; do not use legacy JWT secrets or expose service-role credentials. An injected evaluator is only a test double and is not the RC2 Soul contract. The local SQLite file persists the report but **not** original writing text. Do not deploy this standalone listener.
