-- Agreement to add the app is recorded separately from legal consent.
-- This is NOT an assertion that installation completed.
create table public.home_screen_requests (
 user_id uuid not null references auth.users(id) on delete cascade,
 request_version text not null check(request_version='1'),
 requested_at timestamptz not null default now(),
 primary key(user_id,request_version)
);
alter table public.home_screen_requests enable row level security;
revoke all on public.home_screen_requests from anon,authenticated;
grant select on public.home_screen_requests to authenticated;
grant all on public.home_screen_requests to service_role;
create policy own_home_screen_request on public.home_screen_requests for select to authenticated using((select auth.uid())=user_id);
create or replace function private.finalize_verified_registration() returns trigger
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
 insert into public.home_screen_requests(user_id,request_version) values(new.id,'1');
 update public.auth_registration_receipts set completed_user_id=new.id where id=receipt.id;
 return new;
end;$$;
