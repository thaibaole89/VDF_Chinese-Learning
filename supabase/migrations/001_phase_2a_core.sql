-- Phase 2A.1 — core auth + bare-bones progress tables.
--
-- Apply on Supabase: Dashboard → SQL Editor → New query → paste & run,
-- OR `supabase db push` if Supabase CLI linked.
--
-- This migration only sets up TABLES + RLS. It does NOT yet lock down direct
-- INSERT to voice_attempts — that comes in Phase 2A.2 (RPCs with SECURITY
-- DEFINER that compute score server-side). For now, score/result accepts
-- whatever the client posts; that is the known forge risk documented in
-- PHASE_2A_REVIEW_MEMO §5 risk #1 — must be closed before any cert issuance.

-- ============================================================
-- 1. profiles (1:1 with auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  store       text,
  role        text not null default 'staff' check (role in ('staff','manager')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- Default-deny, then explicit grants. role column is UPDATE-locked at the
-- column-grant level so staff cannot self-elevate even with a permissive policy.
revoke all on public.profiles from anon, authenticated;
grant  select on public.profiles to authenticated;
grant  update (full_name, store) on public.profiles to authenticated;

create policy profiles_self_select on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Manager-all-read policy is deliberately deferred to Phase 2A.2 (along with
-- the auth.user_role() SECURITY DEFINER helper to avoid RLS recursion).

-- ============================================================
-- 2. lesson_progress (per-user lesson completion)
-- ============================================================
create table public.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     text not null,
  completed     boolean not null default false,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index lesson_progress_user_id_idx on public.lesson_progress(user_id);

alter table public.lesson_progress enable row level security;
alter table public.lesson_progress force row level security;

revoke all on public.lesson_progress from anon, authenticated;
grant  select, insert, update on public.lesson_progress to authenticated;

create policy lp_self_select on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());
create policy lp_self_insert on public.lesson_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy lp_self_update on public.lesson_progress
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- 3. voice_attempts (one row per practice attempt — no audio)
-- ============================================================
create table public.voice_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  phrase_id    text not null,
  lesson_id    text,
  transcript   text,
  score        numeric,
  result       text not null check (result in ('pass','near','retry','manual')),
  created_at   timestamptz not null default now()
);
create index voice_attempts_user_id_idx     on public.voice_attempts(user_id);
create index voice_attempts_user_phrase_idx on public.voice_attempts(user_id, phrase_id);

alter table public.voice_attempts enable row level security;
alter table public.voice_attempts force row level security;

revoke all on public.voice_attempts from anon, authenticated;
grant  select, insert on public.voice_attempts to authenticated;
-- NOTE: 2A.2 will REVOKE insert and funnel through submit_voice_attempt() RPC.

create policy va_self_select on public.voice_attempts
  for select to authenticated using (user_id = auth.uid());
create policy va_self_insert on public.voice_attempts
  for insert to authenticated with check (user_id = auth.uid());

-- ============================================================
-- 4. Auto-create profile row on new auth.users insert
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. updated_at touch trigger (DRY)
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger lesson_progress_touch_updated_at
  before update on public.lesson_progress
  for each row execute function public.touch_updated_at();
