-- Run ONLY on an explicitly selected development database. Never applied automatically.
create schema if not exists learning_private;
revoke all on schema learning_private from public, anon, authenticated;
create table if not exists learning_private.learners (
 user_id uuid primary key, onboarding_completed_at timestamptz not null default now(),
 paid_until timestamptz
);
create table if not exists learning_private.writing_sessions (
 id uuid primary key, user_id uuid not null references learning_private.learners(user_id),
 day date not null, started_at timestamptz not null, deadline timestamptz not null,
 status text not null check(status in ('active','submitted','processing','complete','discarded','restored')),
 response text, submitted_at timestamptz, report jsonb,
 constraint response_size check(length(response)<=12000)
);
create unique index if not exists writing_daily_session on learning_private.writing_sessions(user_id,day) where status<>'restored';
alter table learning_private.learners enable row level security;
alter table learning_private.writing_sessions enable row level security;
-- Deliberately no public Data API grants/policies. Access through a dedicated server DB role only.
-- Never let browser clients write paid_until, onboarding_completed_at, deadlines, or session status.
