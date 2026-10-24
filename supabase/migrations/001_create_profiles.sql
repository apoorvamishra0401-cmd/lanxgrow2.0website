-- Create profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read only their own profile
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can insert only their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No public access
create policy "No public read access"
  on public.profiles
  for select
  to public
  using (false);

-- Trigger function: auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, created_at, updated_at)
  values (new.id, new.raw_user_meta_data->>'full_name', now(), now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: call handle_new_user on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();