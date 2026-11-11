# LANX-00 Cross-repository clean-start reconciliation — 2026-11-11
**Read-only audit comparing:**
- `apoorvamishra0401-cmd/english-made-easy` Lovable-maintained app, main at `283ff15b` (not modified).
- `apoorvamishra0401-cmd/lanxgrow2.0website` isolated integration `dev/lanx00-app-integration-20261111`.
- New Lovable app audit/bugfix draft PR: https://github.com/apoorvamishra0401-cmd/english-made-easy/pull/2

## Important differences / potential merge conflicts
| Component | Lovable app | Website integration | Action |
|---|---|---|---|
| Frontend stack | React 19, TanStack Start/Router, Vite 8 | React 18, React Router 6, Vite 5 | Do not replace src tree or package.json wholesale. Decide host architecture and route boundaries first. |
| Backend | TanStack server functions, Lovable gateway, separate Supabase project | Supabase career Edge Function v5 and project kzjvvwuyigiclryoqpkv | Never switch URL or migrate data without verified mapping/backups/approval. |
| Login | Signup email/password; returning email/password + mobile OTP | Google-verified career access requirement | Product decision + identity migration required. |
| Audience | Student / Working Professional; no separate Fresher type | Student / Fresher / Professional with server role | Map approved audience taxonomy before using new dashboard data. |
| Interview | 15-minute AI-generated interview, 45-minute English assessment | 10-minute video interview and 20-minute skills assessment | Keep distinct journeys until approved specification resolves names, duration, eligibility, report differences. |
| Tutor | Lovable AI gateway, server AI endpoints | Modular AI Soul and provider-independent evaluator boundary | Reuse validated interfaces after accuracy/security and budget checks. |
| Reports | Learning reports in Lovable Supabase | Interview receipts/interview_reports and objective-only feedback | Reconcile ownership, consent, provenance and migration; do not combine scoring semantics. |
| Payments | Coupons and plan UI, payment incomplete | Server-paid entitlement required | Never use UI/coupon to authorize paid features. |

## Existing integration CI evidence
- Latest previous coordinator workflow: https://github.com/apoorvamishra0401-cmd/lanxgrow2.0website/actions/runs/43010224727
- Actual forged HTTP denial 1 PASS; credential-requiring two-user E2E SKIPPED.
- Real Chromium audience preview smoke PASS; does not prove signed-in role isolation.
- Career dev Edge Function v5 ACTIVE with JWT verification. Real AI/video evaluation is NOT VERIFIED.

## Preservation rules
- Never delete existing components because of name similarity or a static unused-code report alone.
- Respect Lovable AGENTS.md: no direct generated file/migration/gateway mutations, no force push/rebase/amend.
- All actual code fixes land on isolated source branch with reproducible tests and review; integration requires ownership-level diff, no blanket merge.
- Do not change production, main, live website, DNS, production Supabase/schema/RLS/provider settings or Vercel visibility.
- No production release until product signs off 10/20 vs 15/45, login method, three-audience role matrix, DB ownership and AI provider budget.

**STATUS:** Cross-repository design conflicts documented; automatic migration/merge BLOCKED pending explicit product approval and per-feature integration testing.
