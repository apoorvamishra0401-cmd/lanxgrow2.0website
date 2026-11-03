-- Additive development setup. Reports can be written only by the authenticated server.
create table public.interview_reports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  candidate jsonb not null,
  status text not null default 'processing' check (status in ('processing', 'complete', 'failed')),
  transcript text,
  feedback jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'complete' or (transcript is not null and feedback is not null))
);
create index interview_reports_owner_created on public.interview_reports(user_id, created_at desc);
alter table public.interview_reports enable row level security;
revoke all on public.interview_reports from anon, authenticated;
grant select on public.interview_reports to authenticated;
grant all on public.interview_reports to service_role;
create policy interview_reports_read_own on public.interview_reports for select to authenticated using ((select auth.uid()) = user_id);

-- Serialize reservations and retries per owner. Only the server role can call this.
create function public.reserve_interview_report(p_id uuid, p_user uuid, p_candidate jsonb)
returns public.interview_reports language plpgsql security invoker set search_path = '' as $$
declare result public.interview_reports;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user::text, 42));
  select * into result from public.interview_reports where id = p_id;
  if found then
    if result.user_id <> p_user then raise exception 'REPORT_UNAVAILABLE'; end if;
    if result.status = 'complete' then return result; end if;
    if result.status = 'processing' and result.updated_at > now() - interval '5 minutes' then raise exception 'REPORT_PROCESSING'; end if;
    raise exception 'RECORD_AGAIN';
  end if;
  if (select count(*) from public.interview_reports where user_id = p_user and created_at >= date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata') >= 3 then
    raise exception 'DAILY_LIMIT';
  end if;
  insert into public.interview_reports(id, user_id, candidate) values(p_id, p_user, p_candidate) returning * into result;
  return result;
end;
$$;
revoke all on function public.reserve_interview_report(uuid, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.reserve_interview_report(uuid, uuid, jsonb) to service_role;
