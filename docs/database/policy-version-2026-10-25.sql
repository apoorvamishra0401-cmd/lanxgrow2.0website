begin;
alter table public.legal_consents drop constraint legal_consents_policy_version_check;
alter table public.legal_consents add constraint legal_consents_policy_version_check check (policy_version in ('2026-10-24.1','2026-10-25.1'));
alter policy "Accept current policies for self" on public.legal_consents with check ((select auth.uid()) = user_id and policy_version in ('2026-10-24.1','2026-10-25.1'));
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles (id, full_name, created_at, updated_at)
 values (new.id, new.raw_user_meta_data->>'full_name', now(), now()) on conflict (id) do nothing;
 if new.raw_user_meta_data->>'policy_version' in ('2026-10-24.1','2026-10-25.1') then
  insert into public.legal_consents(user_id,policy_version)
  values(new.id,new.raw_user_meta_data->>'policy_version') on conflict do nothing;
 end if;
 return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
commit;
