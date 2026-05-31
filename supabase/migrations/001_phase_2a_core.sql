-- Phase 2A.1 — core schema (IDEMPOTENT).
-- Re-runnable in Supabase SQL Editor. Safe to paste again if anything failed
-- partway. Does NOT drop or truncate existing data.
--
-- Includes:
--   - 3 tables (profiles, lesson_progress, voice_attempts) with FORCE RLS
--   - default-deny grants + column-level locked role on profiles
--   - self-only RLS for staff
--   - manager-read RLS on all 3 tables (via SECURITY DEFINER user_role() helper)
--   - auto-create-profile trigger on auth.users insert
--   - updated_at touch triggers
--   - backfill: insert profile rows for any existing auth.users that lost them
--
-- KNOWN GAP (closed in Phase 2A.2): voice_attempts.score / result are
-- client-supplied. Phase 2A.2 will REVOKE INSERT and funnel through a
-- submit_voice_attempt() RPC with SECURITY DEFINER. Do NOT issue certificates
-- before that lockdown ships.

-- ============================================================
-- 1. Tables (CREATE IF NOT EXISTS — never drops existing rows)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  store       text,
  role        text not null default 'staff' check (role in ('staff','manager')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     text not null,
  completed     boolean not null default false,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.voice_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  phrase_id    text not null,
  lesson_id    text,
  transcript   text,
  score        numeric,
  result       text not null check (result in ('pass','near','retry','manual')),
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 2. Indexes (IF NOT EXISTS)
-- ============================================================
create index if not exists lesson_progress_user_id_idx     on public.lesson_progress(user_id);
create index if not exists voice_attempts_user_id_idx      on public.voice_attempts(user_id);
create index if not exists voice_attempts_user_phrase_idx  on public.voice_attempts(user_id, phrase_id);

-- ============================================================
-- 3. RLS enable + force (idempotent — no-op if already set)
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.profiles         force  row level security;
alter table public.lesson_progress  enable row level security;
alter table public.lesson_progress  force  row level security;
alter table public.voice_attempts   enable row level security;
alter table public.voice_attempts   force  row level security;

-- ============================================================
-- 4. Grants — default-deny then explicit (idempotent)
-- ============================================================
-- profiles: select; update only safe columns (role intentionally omitted
-- at the column-grant level so staff cannot self-elevate)
revoke all on public.profiles from anon, authenticated;
grant  select on public.profiles to authenticated;
grant  update (full_name, store) on public.profiles to authenticated;

-- lesson_progress: full read/write via RLS-filtered access
revoke all on public.lesson_progress from anon, authenticated;
grant  select, insert, update on public.lesson_progress to authenticated;

-- voice_attempts: insert allowed in 2A.1 (locked down to RPC in 2A.2)
revoke all on public.voice_attempts from anon, authenticated;
grant  select, insert on public.voice_attempts to authenticated;

-- ============================================================
-- 5. SECURITY DEFINER helper: read current user's role without RLS recursion
-- ============================================================
create or replace function public.user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

revoke all on function public.user_role() from public;
grant  execute on function public.user_role() to authenticated;

-- ============================================================
-- 6. Policies — drop + recreate (idempotent)
--    Multiple SELECT policies on the same role are OR-combined:
--    staff sees own rows OR manager sees all rows.
-- ============================================================

-- ---- profiles ----
drop policy if exists profiles_self_select    on public.profiles;
drop policy if exists profiles_self_update    on public.profiles;
drop policy if exists profiles_manager_select on public.profiles;

create policy profiles_self_select on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_manager_select on public.profiles
  for select to authenticated
  using (public.user_role() = 'manager');

-- ---- lesson_progress ----
drop policy if exists lp_self_select    on public.lesson_progress;
drop policy if exists lp_self_insert    on public.lesson_progress;
drop policy if exists lp_self_update    on public.lesson_progress;
drop policy if exists lp_manager_select on public.lesson_progress;

create policy lp_self_select on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());
create policy lp_self_insert on public.lesson_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy lp_self_update on public.lesson_progress
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy lp_manager_select on public.lesson_progress
  for select to authenticated using (public.user_role() = 'manager');

-- ---- voice_attempts ----
drop policy if exists va_self_select    on public.voice_attempts;
drop policy if exists va_self_insert    on public.voice_attempts;
drop policy if exists va_manager_select on public.voice_attempts;

create policy va_self_select on public.voice_attempts
  for select to authenticated using (user_id = auth.uid());
create policy va_self_insert on public.voice_attempts
  for insert to authenticated with check (user_id = auth.uid());
create policy va_manager_select on public.voice_attempts
  for select to authenticated using (public.user_role() = 'manager');

-- ============================================================
-- 7. Trigger functions (CREATE OR REPLACE — idempotent)
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

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ============================================================
-- 8. Triggers — drop + recreate (idempotent)
-- ============================================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists lesson_progress_touch_updated_at on public.lesson_progress;
create trigger lesson_progress_touch_updated_at
  before update on public.lesson_progress
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 9. Backfill: any auth.users without a profile row gets one now.
--    Covers users created BEFORE the trigger existed.
-- ============================================================
insert into public.profiles (id, email, full_name)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
  from auth.users u
  left join public.profiles p on p.id = u.id
 where p.id is null;

-- ============================================================
-- 10. Verify — should return non-error counts
-- ============================================================
select
  (select count(*) from public.profiles)        as profiles_rows,
  (select count(*) from public.lesson_progress) as lesson_progress_rows,
  (select count(*) from public.voice_attempts)  as voice_attempts_rows,
  (select count(*) from pg_policies
     where schemaname = 'public'
       and tablename in ('profiles','lesson_progress','voice_attempts'))  as policy_count,
  (select count(*) from pg_trigger
     where tgname in ('on_auth_user_created',
                      'profiles_touch_updated_at',
                      'lesson_progress_touch_updated_at')
       and not tgisinternal)                                              as trigger_count;
