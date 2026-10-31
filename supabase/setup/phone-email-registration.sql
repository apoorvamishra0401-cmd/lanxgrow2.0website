create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table public.auth_registration_receipts (
 id uuid primary key default gen_random_uuid(), proof_hash text not null unique,
 channel text not null check(channel in ('email','phone')), identity text not null,
 grant_hash text not null unique, verified_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '10 minutes', claimed_at timestamptz,
 completed_user_id uuid references auth.users(id) on delete set null
);
create table public.account_verifications (
 user_id uuid primary key references auth.users(id) on delete cascade,
 channel text not null check(channel in ('email','phone')), identity text not null,
 provider text not null default 'phone.email', verified_at timestamptz not null default now()
);
create table public.learner_onboarding (
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table public.legal_consents (
 user_id uuid not null references auth.users(id) on delete cascade,
 policy_version text not null, accepted_at timestamptz not null default now(),
 primary key(user_id,policy_version)
);
create table public.auth_registration_limits (
 bucket text primary key, attempts integer not null, created_at timestamptz not null default now()
);
alter table public.auth_registration_receipts enable row level security;
alter table public.account_verifications enable row level security;
alter table public.learner_onboarding enable row level security;
alter table public.legal_consents enable row level security;
alter table public.auth_registration_limits enable row level security;
revoke all on public.auth_registration_receipts,public.auth_registration_limits from anon,authenticated;
revoke all on public.account_verifications,public.learner_onboarding,public.legal_consents from anon,authenticated;
grant select on public.account_verifications,public.learner_onboarding,public.legal_consents to authenticated;
grant insert on public.legal_consents to authenticated;
grant all on public.auth_registration_receipts,public.account_verifications,public.learner_onboarding,public.legal_consents,public.auth_registration_limits to service_role;
create policy own_verification on public.account_verifications for select to authenticated using((select auth.uid())=user_id);
create policy own_onboarding on public.learner_onboarding for select to authenticated using((select auth.uid())=user_id);
create policy own_consent on public.legal_consents for select to authenticated using((select auth.uid())=user_id);
create policy accept_own_policy on public.legal_consents for insert to authenticated with check((select auth.uid())=user_id and policy_version='2026-10-25.1');
create function public.registration_rate_limit(p_key text,p_limit integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare used integer;
begin
 insert into public.auth_registration_limits(bucket,attempts) values(p_key,1)
 on conflict(bucket) do update set attempts=public.auth_registration_limits.attempts+1
 returning attempts into used;
 return used<=p_limit;
end;$$;
revoke all on function public.registration_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.registration_rate_limit(text,integer) to service_role;
-- Only the Auth service can insert users. The receipt and verification are finalized
-- in the SAME database transaction as account creation, not from browser metadata.
create function private.finalize_verified_registration() returns trigger
language plpgsql security definer set search_path='' as $$
declare receipt public.auth_registration_receipts%rowtype;
begin
 if new.raw_app_meta_data->>'registration_receipt_id' is null then return new; end if;
 select * into receipt from public.auth_registration_receipts
 where id=(new.raw_app_meta_data->>'registration_receipt_id')::uuid
   and claimed_at is not null and completed_user_id is null and expires_at>now()
 for update;
 if not found then raise exception 'Registration verification expired'; end if;
 if receipt.channel='email' and (new.email_confirmed_at is null or lower(new.email) is distinct from receipt.identity) then raise exception 'Email verification mismatch'; end if;
 if receipt.channel='phone' and (new.phone_confirmed_at is null or ('+'||ltrim(new.phone,'+')) is distinct from receipt.identity) then raise exception 'Phone verification mismatch'; end if;
 insert into public.account_verifications(user_id,channel,identity,verified_at) values(new.id,receipt.channel,receipt.identity,receipt.verified_at);
 insert into public.legal_consents(user_id,policy_version) values(new.id,'2026-10-25.1');
 update public.auth_registration_receipts set completed_user_id=new.id where id=receipt.id;
 return new;
end;$$;
revoke all on function private.finalize_verified_registration() from public,anon,authenticated;
create trigger finalize_verified_registration after insert on auth.users for each row execute function private.finalize_verified_registration();
