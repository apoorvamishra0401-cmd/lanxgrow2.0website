begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists public.legal_consents (
 user_id uuid not null references auth.users(id) on delete cascade,
 policy_version text not null check (policy_version = '2026-10-24.1'),
 accepted_at timestamptz not null default now(),
 primary key (user_id, policy_version)
);
alter table public.legal_consents enable row level security;
revoke all on public.legal_consents from public, anon, authenticated;
grant select on public.legal_consents to authenticated;
grant insert (user_id, policy_version) on public.legal_consents to authenticated;
create policy "Read own policy agreement" on public.legal_consents for select to authenticated using ((select auth.uid()) = user_id);
create policy "Accept current policies for self" on public.legal_consents for insert to authenticated with check ((select auth.uid()) = user_id and policy_version = '2026-10-24.1');
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles (id, full_name, created_at, updated_at)
 values (new.id, new.raw_user_meta_data->>'full_name', now(), now()) on conflict (id) do nothing;
 if new.raw_user_meta_data->>'policy_version' = '2026-10-24.1' then
  insert into public.legal_consents(user_id,policy_version) values(new.id,'2026-10-24.1') on conflict do nothing;
 end if;
 return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
drop function public.handle_new_user();
commit;
