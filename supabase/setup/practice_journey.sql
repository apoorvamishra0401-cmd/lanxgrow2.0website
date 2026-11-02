-- Development project only: kzjvvwuyigiclryoqpkv. No production migration.
create table if not exists public.practice_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('daily','milestone')),
 day_index integer not null check(day_index>0),
 practice_date date not null default (now() at time zone 'Asia/Kolkata')::date,
 topic_key text not null,
 status text not null default 'draft' check(status in ('draft','submitted','reviewed')),
 responses jsonb not null default '{}'::jsonb check(jsonb_typeof(responses)='object'),
 report jsonb,
 updated_at timestamptz not null default now(),
 submitted_at timestamptz,
 unique(user_id,kind,day_index)
);
create unique index if not exists practice_daily_date_unique on public.practice_sessions(user_id,practice_date) where kind='daily';
alter table public.practice_sessions enable row level security;
drop policy if exists practice_owner_read on public.practice_sessions;
create policy practice_owner_read on public.practice_sessions for select to authenticated using((select auth.uid())=user_id);
revoke all on public.practice_sessions from anon,authenticated;
grant select on public.practice_sessions to authenticated;
grant all on public.practice_sessions to service_role;
create or replace function public.start_learning_practice(p_user_id uuid,p_topic text)
returns public.practice_sessions language plpgsql security invoker set search_path=public,pg_catalog as $$
declare completed integer; milestone_needed boolean; result public.practice_sessions; next_day integer; next_kind text; pending_boundary integer;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
 select count(*) into completed from public.practice_sessions where user_id=p_user_id and kind='daily' and status in ('submitted','reviewed');
 select min(boundary) into pending_boundary from generate_series(15,completed,15) as boundary where not exists(select 1 from public.practice_sessions where user_id=p_user_id and kind='milestone' and day_index=boundary and status in ('submitted','reviewed'));
 milestone_needed:=pending_boundary is not null;
 if milestone_needed then next_day:=pending_boundary;next_kind:='milestone';
  select topic_key into p_topic from public.practice_sessions where user_id=p_user_id and kind='daily' and status in ('submitted','reviewed') order by day_index desc limit 1;
 else
  select * into result from public.practice_sessions where user_id=p_user_id and kind='daily' and practice_date=(now() at time zone 'Asia/Kolkata')::date;
  if found then return result;end if;
  next_day:=completed+1;next_kind:='daily';
 end if;
 select * into result from public.practice_sessions where user_id=p_user_id and kind=next_kind and day_index=next_day;
 if found then return result;end if;
 insert into public.practice_sessions(user_id,kind,day_index,topic_key) values(p_user_id,next_kind,next_day,p_topic) returning * into result;
 return result;
end $$;
revoke all on function public.start_learning_practice(uuid,text) from public,anon,authenticated;
grant execute on function public.start_learning_practice(uuid,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('practice-media','practice-media',false,26214400,array['audio/webm','audio/mp4','audio/ogg','audio/wav','audio/mpeg','audio/x-m4a']) on conflict(id) do nothing;
drop policy if exists practice_audio_owner_insert on storage.objects;
create policy practice_audio_owner_insert on storage.objects for insert to authenticated with check(bucket_id='practice-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.practice_sessions s where s.user_id=(select auth.uid()) and s.status='draft' and s.id::text=(storage.foldername(name))[2]));
drop policy if exists practice_audio_owner_read on storage.objects;
create policy practice_audio_owner_read on storage.objects for select to authenticated using(bucket_id='practice-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
