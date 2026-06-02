# LEADERBOARD_SCORING — Weekly Hall of Fame (Phase 2B.3)

How `/hall-of-fame` ranks staff. The authoritative computation lives in
`supabase/migrations/003_phase_2b_leaderboard.sql`
(`get_weekly_leaderboard()`); this doc explains the design and the trust model.

## Formula

```
weekly_score =
    20 × (required lessons FIRST-completed this week)
  + 10 × (optional lessons FIRST-completed this week)
  +  5 × (distinct phrases FIRST voice-passed this week)
  + 100  if Day-One certificate achieved   (standing bonus)
  + best_quiz_score, capped at 100         (standing bonus)
```

- **Week boundary:** Monday 00:00 `Asia/Ho_Chi_Minh` (local week for VN staff).
- **Required / optional lesson sets:** defined in the RPC, mirroring
  `lib/courseCatalog.ts` (15 required, 11 optional, 3 reference). Reference
  lessons never score. **If the catalog changes, update the RPC arrays too.**

### Weekly vs standing components

The activity components (lessons, voice) are **weekly** — they only count
first-time completions whose timestamp falls in the current week, so the board
genuinely changes week to week. The Day-One certificate and best-quiz-score are
**standing achievements** that carry over (per the product spec, which lists
them as "achieved … once" and "best quiz score"). This means a certified,
high-quiz learner keeps a baseline even in an inactive week. See *Known
limitations*.

## Why attempts are NOT rewarded (anti-gaming)

Points come from **server-trusted state**, never from raw action counts or
localStorage:

| Action | What's counted | Why it can't be farmed |
|---|---|---|
| Voice practice | Distinct phrases whose **first** pass/manual is this week | Re-reading an already-passed phrase has an earlier `min(created_at)`, so it never re-qualifies. Spamming the mic earns nothing. |
| Quiz | `profiles.best_quiz_score` (0–100) | Retaking the quiz only matters if you beat your best; repeated attempts add nothing. |
| Lesson completion | Distinct lesson, `completed_at` in week | `completed_at` is set once (first completion). Toggling complete again doesn't move it. |
| Day-One certificate | Boolean state, +100 once | One-time; can't be re-earned for more points. |

All inputs are read from Supabase tables (`lesson_progress`, `voice_attempts`,
`phrase_progress`, `profiles`) inside a `SECURITY DEFINER` function. The client
never supplies scores. `localStorage` is never consulted.

## Privacy

The RPC returns, per staff member:

- `rank`, `weekly_score`
- `display_name` — `full_name`, or a non-identifying fallback
  (`"Học viên A1B2"` from the first hex of the user id) when `full_name` is
  empty. **Never** the email or its local part.
- `store`
- `completed_required_count`, `voice_pass_count`, `best_quiz_score`,
  `day_one_certified`

**Email is never selected or returned.** Managers (`role = 'manager'`) are
excluded from the ranked entries (they're observers, not competitors). Only
`authenticated` users may execute the function; `anon` cannot. Staff can view
the board but cannot edit it — there is no write path.

## Known limitations

1. **Standing achievements carry over.** Cert (+100) and best-quiz (≤+100) are
   not windowed to the week (no `certified_at` column, no server-side quiz
   history table). A learner who certified weeks ago still shows ≥100 in an
   idle week, which can outrank an active newcomer. A future version could add
   a timestamped quiz-session table + a `certified_at` column to make these
   fully weekly, or split the board into "All-time" and "Most active this week".
2. **Weekly voice re-mastery.** Points are for the *first* pass of a phrase, so
   there is no per-week re-earning for the same phrase. This is deliberate
   (anti-farm) but means a learner who has already passed every phrase earns
   voice points only from genuinely new phrases.
3. **Lesson set is hardcoded in SQL.** The required/optional arrays duplicate
   `lib/courseCatalog.ts`. They must be kept in sync by hand until a
   `course_lessons` reference table is introduced.
4. **No tie-break beyond name.** Equal scores share a rank (SQL `RANK()`), then
   sort by display name. No recency tie-break.
5. **Timezone fixed to Vietnam.** The week boundary is hardcoded to
   `Asia/Ho_Chi_Minh`; fine for the current pilot, revisit for multi-region.

## Applying the migration

Paste `supabase/migrations/003_phase_2b_leaderboard.sql` into the Supabase SQL
Editor and run. Idempotent (create-or-replace; no schema changes). Until it's
applied, `/hall-of-fame` shows a "chưa sẵn sàng" notice instead of erroring.
