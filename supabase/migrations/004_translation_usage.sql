-- Phase 2B.8 — translation usage tracking (METADATA ONLY, IDEMPOTENT).
--
-- Apply in Supabase SQL Editor (paste & run). Re-runnable. Depends on 001
-- (provides public.user_role()).
--
-- PRIVACY — this table deliberately has NO source_text / translated_text
-- columns. It records only metadata for cost visibility + abuse guarding:
-- language pair, provider, character COUNT (a number, not the text), success
-- flag, and an error code. No conversation content is ever stored.

create table if not exists public.translation_usage (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  source_lang  text not null,
  target_lang  text not null,
  provider     text not null,
  char_count   int  not null,
  success      boolean not null,
  error_code   text,
  created_at   timestamptz not null default now()
);

create index if not exists translation_usage_user_idx    on public.translation_usage(user_id, created_at);
create index if not exists translation_usage_created_idx on public.translation_usage(created_at);

-- RLS: staff read own rows, managers read all, users insert only their own.
alter table public.translation_usage enable row level security;
alter table public.translation_usage force  row level security;

-- Grant SELECT + INSERT only — never UPDATE/DELETE, so usage rows are
-- append-only and tamper-proof from the app.
revoke all            on public.translation_usage from anon, authenticated;
grant  select, insert on public.translation_usage to   authenticated;

drop policy if exists tu_self_select    on public.translation_usage;
drop policy if exists tu_manager_select on public.translation_usage;
drop policy if exists tu_self_insert    on public.translation_usage;

create policy tu_self_select on public.translation_usage
  for select to authenticated using (user_id = auth.uid());

create policy tu_manager_select on public.translation_usage
  for select to authenticated using (public.user_role() = 'manager');

create policy tu_self_insert on public.translation_usage
  for insert to authenticated with check (user_id = auth.uid());

-- No update/delete policies — combined with the grant above, nothing in the
-- app can mutate or remove usage rows.

-- ============================================================
-- Verify (read-only):
--   select count(*) from public.translation_usage;
--   -- column list must NOT contain source_text / translated_text:
--   select column_name from information_schema.columns
--     where table_schema='public' and table_name='translation_usage'
--     order by ordinal_position;
-- ============================================================
