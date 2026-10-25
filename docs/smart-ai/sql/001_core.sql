-- Apply ONLY to an isolated Supabase development project/branch.
-- This file has not been executed against production.
begin;
create schema if not exists smart_private;
revoke all on schema smart_private from public, anon;
grant usage on schema smart_private to authenticated;
create table smart_private.admin_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check(role='admin'),
 granted_at timestamptz not null default now()
);
alter table smart_private.admin_roles enable row level security;
revoke all on smart_private.admin_roles from public,anon,authenticated;
create function smart_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from smart_private.admin_roles where user_id=(select auth.uid()) and role='admin');
$$;
revoke all on function smart_private.is_admin() from public,anon;
grant execute on function smart_private.is_admin() to authenticated;
create table public.smart_learner_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text check(char_length(display_name)<=100),
 goal text not null default 'Everyday confidence' check(char_length(goal)<=200),
 comfort text not null default 'Finding my words' check(char_length(comfort)<=200),
 challenge text not null default 'Organising my thoughts' check(char_length(challenge)<=200),
 difficulty text not null default 'Gentle start' check(difficulty in ('Gentle start','Everyday conversation','Challenge me')),
 interests text[] not null default '{}',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check(cardinality(interests)<=3 and cardinality(interests)>=0),
 check(array_to_string(interests,',') is null or char_length(array_to_string(interests,','))<=300)
);
alter table public.smart_learner_profiles enable row level security;
revoke all on public.smart_learner_profiles from public,anon,authenticated;
grant select on public.smart_learner_profiles to authenticated;
grant insert(user_id,display_name,goal,comfort,challenge,difficulty,interests) on public.smart_learner_profiles to authenticated;
grant update(display_name,goal,comfort,challenge,difficulty,interests) on public.smart_learner_profiles to authenticated;
create policy "Owner or authorised admin reads learner" on public.smart_learner_profiles for select to authenticated using ((select auth.uid())=user_id or (select smart_private.is_admin()));
create policy "Owner creates own learner" on public.smart_learner_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Owner updates own preferences" on public.smart_learner_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create function smart_private.touch_profile() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();return new;end; $$;
revoke all on function smart_private.touch_profile() from public,anon,authenticated;
create trigger touch_smart_profile before update on public.smart_learner_profiles for each row execute function smart_private.touch_profile();
create table public.smart_activity_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 area text not null check(area in ('call','practice','video','course','entertainment','dashboard')),
 topic text not null check(char_length(topic) between 1 and 180),
 activity_type text not null check(activity_type in ('text_rehearsal','call_rehearsal','course_check','story_summary','local_recording')),
 response_text text check(char_length(response_text)<=6000),
 self_reported_seconds integer not null default 0 check(self_reported_seconds between 0 and 3600),
 evidence jsonb not null default '{}'::jsonb check(jsonb_typeof(evidence)='object' and octet_length(evidence::text)<=12000),
 source text not null default 'client_rehearsal' check(source='client_rehearsal'),
 created_at timestamptz not null default now()
);
create index smart_attempt_user_date on public.smart_activity_attempts(user_id,created_at desc);
alter table public.smart_activity_attempts enable row level security;
revoke all on public.smart_activity_attempts from public,anon,authenticated;
grant select on public.smart_activity_attempts to authenticated;
grant insert(user_id,area,topic,activity_type,response_text,self_reported_seconds,evidence) on public.smart_activity_attempts to authenticated;
create policy "Owner or admin reads attempts" on public.smart_activity_attempts for select to authenticated using ((select auth.uid())=user_id or (select smart_private.is_admin()));
create policy "Owner submits own rehearsal" on public.smart_activity_attempts for insert to authenticated with check ((select auth.uid())=user_id and source='client_rehearsal');
-- Assessment results are server-written ONLY. Client activity counts are not trusted scores.
create table public.smart_assessment_results (
 id uuid primary key default gen_random_uuid(),
 attempt_id uuid not null references public.smart_activity_attempts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 evidence_type text not null check(evidence_type in ('transcript','audio')),
 rubric_version text not null,
 provider_model text not null,
 feedback jsonb not null check(jsonb_typeof(feedback)='object'),
 created_at timestamptz not null default now(),
 unique(attempt_id,rubric_version)
);
create index smart_results_user_date on public.smart_assessment_results(user_id,created_at desc);
alter table public.smart_assessment_results enable row level security;
revoke all on public.smart_assessment_results from public,anon,authenticated;
grant select on public.smart_assessment_results to authenticated;
create policy "Owner or admin reads supported assessment" on public.smart_assessment_results for select to authenticated using ((select auth.uid())=user_id or (select smart_private.is_admin()));
-- Server workers must resolve user_id from the validated attempt, not from a request field.
create table public.smart_recording_consents (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 policy_version text not null check(char_length(policy_version)<=40),
 purpose text not null check(purpose='speaking_assessment'),
 accepted_at timestamptz not null default now()
);
create index smart_consent_user_date on public.smart_recording_consents(user_id,accepted_at desc);
alter table public.smart_recording_consents enable row level security;
revoke all on public.smart_recording_consents from public,anon,authenticated;
grant select on public.smart_recording_consents to authenticated;
grant insert(user_id,policy_version,purpose) on public.smart_recording_consents to authenticated;
create policy "Owner reads recording agreement" on public.smart_recording_consents for select to authenticated using ((select auth.uid())=user_id);
create policy "Owner makes recording agreement" on public.smart_recording_consents for insert to authenticated with check ((select auth.uid())=user_id);
commit;
-- Provision an admin only through a reviewed service-side operation after the owner
-- identifies the exact account. Never derive roles from user-editable metadata.
-- No admin is provisioned by this script. No password/email mirror table is created.
