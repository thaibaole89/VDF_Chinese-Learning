-- Phase 2B.3 — Weekly Hall of Fame leaderboard (IDEMPOTENT).
--
-- Apply in Supabase SQL Editor (paste & run). Re-runnable: create-or-replace
-- only, no data writes, NO schema changes (no new tables/columns). Depends on
-- 001 + 002 having been applied.
--
-- Adds ONE SECURITY DEFINER function:
--   get_weekly_leaderboard() -> ranked rows
--
-- WHY SECURITY DEFINER:
--   A leaderboard must read EVERY staff member's profile + progress, which RLS
--   would otherwise restrict to the calling user's own rows. The function runs
--   as its owner (bypassing RLS) but returns ONLY non-sensitive columns
--   (display name, store, scores) — never email. Execute is granted to
--   `authenticated` only; anon cannot call it.
--
-- ANTI-GAMING (see LEADERBOARD_SCORING.md):
--   - Weekly activity uses FIRST-completion timestamps (lesson_progress.
--     completed_at, voice_attempts first pass), so re-doing an already-done
--     lesson/phrase earns nothing.
--   - Voice points use DISTINCT phrases (not raw attempts).
--   - Quiz uses profiles.best_quiz_score (best, not attempt count).
--   - Day-One certificate is a one-time standing bonus.
--
-- SCORING (weekly_score):
--   20 * (required lessons first-completed THIS WEEK)
-- + 10 * (optional lessons first-completed THIS WEEK)
-- +  5 * (distinct phrases first voice-passed THIS WEEK)
-- + 100 if Day-One certified (standing)
-- + best_quiz_score capped at 100 (standing)
--
-- Week boundary = Monday 00:00 Asia/Ho_Chi_Minh (local week for VN staff).
--
-- NOTE: the required/optional lesson id arrays below MUST stay in sync with
-- lib/courseCatalog.ts. If the catalog changes, update both.

create or replace function public.get_weekly_leaderboard()
returns table (
  rank                     bigint,
  user_id                  uuid,
  display_name             text,
  store                    text,
  weekly_score             int,
  completed_required_count int,
  voice_pass_count         int,
  best_quiz_score          numeric,
  day_one_certified        boolean
)
language sql
security definer
set search_path = public
stable
as $$
  with consts as (
    select
      -- Monday 00:00 in Vietnam local time, as a timestamptz for comparison.
      timezone(
        'Asia/Ho_Chi_Minh',
        date_trunc('week', timezone('Asia/Ho_Chi_Minh', now()))
      )                                   as week_start,
      'lesson_day_one_10_phrases'::text   as day_one_lesson,
      10                                  as day_one_phrase_target,
      8                                   as day_one_voice_target,
      70::numeric                         as day_one_quiz_target,
      array[
        'lesson_day_one_10_phrases','lesson_cs_greeting','lesson_cs_ask_needs',
        'lesson_cs_recommend','lesson_cs_bestseller','lesson_cs_browsing',
        'lesson_cs_out_of_stock','lesson_cs_verify_goods','lesson_cs_payment',
        'lesson_p1_dutyfree','lesson_p1_passport','lesson_p1_price',
        'lesson_p1_oos','lesson_p1_payment','lesson_p1_closing'
      ]::text[]                           as required_lessons,
      array[
        'lesson_perfume','lesson_skincare','lesson_liquor','lesson_tobacco',
        'lesson_confectionery','lesson_numbers','lesson_colors',
        'lesson_personal_pronouns','lesson_address_terms','lesson_demonstratives',
        'lesson_interrogatives'
      ]::text[]                           as optional_lessons
  ),

  -- Per-user lesson completion (all-time totals + this-week first-completions).
  lessons as (
    select
      lp.user_id,
      count(distinct lp.lesson_id)
        filter (where lp.lesson_id = any(c.required_lessons))                    as req_total,
      count(distinct lp.lesson_id)
        filter (where lp.lesson_id = any(c.required_lessons)
                  and lp.completed_at >= c.week_start)                           as req_week,
      count(distinct lp.lesson_id)
        filter (where lp.lesson_id = any(c.optional_lessons)
                  and lp.completed_at >= c.week_start)                           as opt_week,
      bool_or(lp.lesson_id = c.day_one_lesson)                                   as day_one_lp
    from public.lesson_progress lp
    cross join consts c
    where lp.completed = true
    group by lp.user_id
  ),

  -- Distinct phrases whose FIRST pass/manual happened this week (new mastery).
  voice_week as (
    select vf.user_id, count(*) as n
    from (
      select user_id, phrase_id, min(created_at) as first_at
      from public.voice_attempts
      where result in ('pass','manual')
      group by user_id, phrase_id
    ) vf
    cross join consts c
    where vf.first_at >= c.week_start
    group by vf.user_id
  ),

  -- Day-One-scoped voice passes (distinct phrases) — for cert eligibility.
  voice_dayone as (
    select va.user_id, count(distinct va.phrase_id) as day_one_voice_passed
    from public.voice_attempts va
    cross join consts c
    where va.result in ('pass','manual')
      and va.lesson_id = c.day_one_lesson
    group by va.user_id
  ),

  -- Day-One-scoped phrases learned — for cert eligibility.
  phrases_dayone as (
    select pp.user_id, count(*) as day_one_phrases_learned
    from public.phrase_progress pp
    cross join consts c
    where pp.learned = true
      and pp.lesson_id = c.day_one_lesson
    group by pp.user_id
  ),

  scored as (
    select
      p.id as user_id,
      coalesce(
        nullif(trim(p.full_name), ''),
        'Học viên ' || upper(substr(replace(p.id::text, '-', ''), 1, 4))
      )                                                  as display_name,
      p.store                                            as store,
      coalesce(l.req_total, 0)                           as req_total,
      coalesce(l.req_week, 0)                            as req_week,
      coalesce(l.opt_week, 0)                            as opt_week,
      coalesce(l.day_one_lp, false)                      as day_one_lp,
      coalesce(vw.n, 0)                                  as voice_week,
      coalesce(p.voice_pass_count, 0)                    as voice_pass_count,
      coalesce(p.best_quiz_score, 0)                     as best_quiz_score,
      (
        coalesce(ph.day_one_phrases_learned, 0) >= (select day_one_phrase_target from consts)
        and coalesce(vd.day_one_voice_passed, 0) >= (select day_one_voice_target from consts)
        and coalesce(p.best_quiz_score, 0) >= (select day_one_quiz_target from consts)
      )                                                  as day_one_certified
    from public.profiles p
    left join lessons        l  on l.user_id  = p.id
    left join voice_week     vw on vw.user_id = p.id
    left join voice_dayone   vd on vd.user_id = p.id
    left join phrases_dayone ph on ph.user_id = p.id
    where coalesce(p.role, 'staff') <> 'manager'
  ),

  final as (
    select
      user_id,
      display_name,
      store,
      (
        20 * req_week
        + 10 * opt_week
        + 5  * voice_week
        + (case when day_one_certified then 100 else 0 end)
        + least(100, round(best_quiz_score))::int
      )                                                  as weekly_score,
      (req_total + (case when day_one_certified and not day_one_lp then 1 else 0 end)) as completed_required_count,
      voice_pass_count,
      best_quiz_score,
      day_one_certified
    from scored
  )

  select
    rank() over (order by weekly_score desc)             as rank,
    user_id,
    display_name,
    store,
    weekly_score,
    completed_required_count,
    voice_pass_count,
    best_quiz_score,
    day_one_certified
  from final
  order by weekly_score desc, display_name asc;
$$;

revoke all     on function public.get_weekly_leaderboard() from public;
grant  execute on function public.get_weekly_leaderboard() to authenticated;

-- ============================================================
-- Verify (read-only):
--   select * from public.get_weekly_leaderboard();
-- Expected: one row per non-manager profile, ranked by weekly_score desc,
-- NO email column present.
-- ============================================================
