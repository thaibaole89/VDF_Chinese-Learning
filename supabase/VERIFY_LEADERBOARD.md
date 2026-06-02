# VERIFY_LEADERBOARD — live checks for `get_weekly_leaderboard()` (Phase 2B.3.1)

Run these in **Supabase → SQL Editor** after applying
`migrations/003_phase_2b_leaderboard.sql`. This is the authoritative way to
verify against real data (the app code calls the same function). Each block is
read-only except the optional anti-farm test in §6, which uses an RPC the way
the app does.

> Note: the agent intentionally does NOT log into production with guessed
> credentials. Use these SQL checks, or hand the agent a current test login if
> you want REST-level verification.

## 1. Function exists + is SECURITY DEFINER

```sql
select p.proname,
       p.prosecdef           as security_definer,   -- expect: true
       pg_get_function_result(p.oid) as returns
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'get_weekly_leaderboard';
```
Expect one row, `security_definer = true`, and the return signature listing the
9 columns — **note there is no `email` column**.

## 2. Grants — authenticated only, never anon/public

```sql
select grantee, privilege_type
from information_schema.routine_privileges
where routine_schema = 'public' and routine_name = 'get_weekly_leaderboard';
```
Expect `authenticated / EXECUTE`. There must be **no** row for `anon` or
`PUBLIC`.

## 3. Call it (as the table owner here; the app calls it as `authenticated`)

```sql
select * from public.get_weekly_leaderboard();
```
Check:
- Rows are ordered by `weekly_score` desc, `rank` ascending.
- **No email anywhere.** `display_name` is the person's `full_name`, or a
  `Học viên XXXX` fallback.
- Managers do **not** appear (see §5).

## 4. Fallback display name (null full_name)

```sql
-- Pick any user and blank their full_name, then re-run §3 to see the fallback.
-- (Reversible — restore the name afterward.)
select id, full_name from public.profiles order by created_at limit 5;
-- update public.profiles set full_name = null where id = '<uuid>';
-- select display_name from public.get_weekly_leaderboard() where user_id = '<uuid>';
-- expect: 'Học viên ' || first 4 hex of the id (NOT an email).
```

## 5. Manager exclusion

```sql
-- Mark a test user manager, confirm they drop out of the board.
-- update public.profiles set role = 'manager' where id = '<uuid>';
select count(*) filter (where role = 'manager') as managers_in_profiles
from public.profiles;
select count(*) as managers_on_board
from public.get_weekly_leaderboard() lb
join public.profiles p on p.id = lb.user_id
where p.role = 'manager';     -- expect: 0
-- restore: update public.profiles set role = 'staff' where id = '<uuid>';
```

## 6. Anti-farm spot checks

**Voice — re-passing an already-passed phrase adds no points.** The score uses
the *first* pass per (user, phrase):

```sql
-- Count distinct phrases first-passed THIS week for a user (the voice term):
with consts as (
  select timezone('Asia/Ho_Chi_Minh',
                  date_trunc('week', timezone('Asia/Ho_Chi_Minh', now()))) as week_start
)
select count(*) as voice_points_basis
from (
  select phrase_id, min(created_at) as first_at
  from public.voice_attempts
  where user_id = '<uuid>' and result in ('pass','manual')
  group by phrase_id
) f, consts c
where f.first_at >= c.week_start;
```
Now call `submit_voice_attempt` again for a phrase that already passed and re-run
— the count is unchanged (a new row has a later `created_at`, so `min` is still
the original first pass).

**Quiz — only the best matters.** `submit_quiz_attempt` with a lower score does
not change `profiles.best_quiz_score`, so the quiz term is unchanged.

**Lessons — completed once.** `mark_lesson_complete` sets `completed_at` only on
the first completion; re-marking doesn't move it, so the weekly lesson terms
don't re-count.

## Expected scoring (reference)

```
weekly_score = 20·(required first-completed this week)
             + 10·(optional first-completed this week)
             +  5·(distinct phrases first-passed this week)
             + 100 if Day-One certified
             + min(100, round(best_quiz_score))
```
Example: certified user, 3 required + 1 optional this week, 5 new phrases, best
quiz 90 → 60 + 10 + 25 + 100 + 90 = **285**.
```
```
