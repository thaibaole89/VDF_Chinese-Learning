# Phase 2C.2 — Server-side English progress: setup

Makes English course progress server-backed (persists across devices; visible to
managers). The Chinese course, certificate, Hall of Fame, Manager Dashboard and
translation tracking are unchanged.

## What ships

- **Migration `supabase/migrations/005_course_progress.sql`** — a generic
  multi-course progress layer (does **not** touch the Chinese tables):
  - `course_phrases` — reference table (`course_id, lesson_id, phrase_id`),
    seeded with 64 English phrases from `lib/englishCourse.ts`.
  - `course_phrase_progress`, `course_voice_attempts`, `course_quiz_attempts`,
    `course_lesson_progress` — per-user, keyed by `(user_id, course_id, …)`.
  - FORCE RLS on all tables: **staff read only their own rows; managers read
    all**. No public access. No write grants — all writes go through RPCs.
  - 4 `SECURITY DEFINER` RPCs (`mark_course_phrase_learned`,
    `submit_course_voice_attempt`, `submit_course_quiz_attempt`,
    `mark_course_lesson_complete`) that hard-set `user_id = auth.uid()` and
    validate against `course_phrases` + score/total bounds + the result enum.
- App code: server reads (`lib/englishProgress.ts`), server actions
  (`lib/englishActions.ts`), and UI wiring on `/courses`, `/courses/english`,
  `/courses/english/lessons/[lessonId]`, plus a manager English section.

## Apply the migration (Supabase SQL Editor)

1. Open the project's Supabase → **SQL Editor**.
2. Paste the entire contents of `supabase/migrations/005_course_progress.sql`
   and **Run**. It is idempotent — safe to re-run; never drops data.
3. The final `select` should report:
   `english_phrases_seeded = 64`, `rpcs_created = 4`, `policy_count = 8`,
   `direct_insert_grants = 0`.

Depends on migration `001` (provides `public.user_role()` and
`public.touch_updated_at()`). Apply 001 first if a fresh project.

## Re-generating the English phrase seed

After editing English content in `lib/englishCourse.ts`:

```
node scripts/gen-english-progress-seed.mjs
```

Paste the printed `insert … on conflict …` + `delete … not in (…)` block over
the seed section of `005_course_progress.sql`, then re-run the migration.

## Security / privacy

- **No service_role**, no new secrets, no client-bundle secrets.
- `course_voice_attempts` stores **metadata only** (result + score) — no speech
  transcript is accepted or stored.
- A learner can only ever read/write their **own** progress (RLS + RPC
  `auth.uid()`). Managers can **read** all course progress; they cannot write it.
- English is **not** in the Chinese Hall of Fame and has **no certificate** —
  intentionally out of scope this phase.

## Graceful degradation

If migration 005 is not yet applied, the app detects the missing tables and
falls back to local-only English progress with a visible warning; the manager
English section shows a "no data yet" placeholder. Applying the migration
switches everything to server-backed automatically (plus a one-time "sync local
progress" button on `/courses/english`).
