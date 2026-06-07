"use server";

// Server actions for English course progress (Phase 2C.2). Called from the
// English client components. Each action:
//   1. confirms an authenticated user,
//   2. validates course/lesson/phrase against lib/englishCourse (TS catalog),
//   3. writes via the SECURITY DEFINER RPCs (migration 005), which re-validate
//      against the seeded course_phrases table and hard-set user_id=auth.uid().
// So a caller can only ever write their OWN progress, and only for real phrases.
//
// Returns plain serializable objects. On any failure returns { ok:false } so the
// client can fall back to local-only with a warning. No secrets, no service_role.

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getEnglishLesson } from "@/lib/englishCourse";
import { ENGLISH_COURSE_ID } from "@/lib/englishProgress";

// NOTE: a "use server" module may only EXPORT async functions, so this type is
// intentionally NOT exported (it is compile-time only and used internally).
type EnActionResult = { ok: boolean; error?: string };

function lessonHasPhrase(lessonId: string, phraseId: string): boolean {
  const lesson = getEnglishLesson(lessonId);
  return !!lesson && lesson.phrases.some((p) => p.id === phraseId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuthed(): Promise<{ sb: any; userId: string } | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  return { sb, userId: user.id };
}

/** Recompute lesson completion from server-side learned counts; upsert. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function recomputeLessonCompletion(sb: any, lessonId: string): Promise<void> {
  const lesson = getEnglishLesson(lessonId);
  if (!lesson || lesson.phrases.length === 0) return;
  const { data, error } = await sb
    .from("course_phrase_progress")
    .select("phrase_id")
    .eq("course_id", ENGLISH_COURSE_ID)
    .eq("lesson_id", lessonId)
    .eq("learned", true);
  if (error) return;
  const learned = new Set((data ?? []).map((r: { phrase_id: string }) => r.phrase_id));
  const allLearned = lesson.phrases.every((p) => learned.has(p.id));
  await sb.rpc("mark_course_lesson_complete", {
    p_course_id: ENGLISH_COURSE_ID,
    p_lesson_id: lessonId,
    p_completed: allLearned,
  });
}

export async function markEnglishPhraseLearned(
  lessonId: string,
  phraseId: string,
  learned: boolean
): Promise<EnActionResult> {
  const auth = await getAuthed();
  if (!auth) return { ok: false, error: "unauthenticated" };
  if (!lessonHasPhrase(lessonId, phraseId)) return { ok: false, error: "invalid_phrase" };

  const { error } = await auth.sb.rpc("mark_course_phrase_learned", {
    p_course_id: ENGLISH_COURSE_ID,
    p_lesson_id: lessonId,
    p_phrase_id: phraseId,
    p_learned: learned,
  });
  if (error) return { ok: false, error: "write_failed" };

  await recomputeLessonCompletion(auth.sb, lessonId);
  return { ok: true };
}

export async function submitEnglishVoiceAttempt(
  lessonId: string,
  phraseId: string,
  result: "pass" | "retry" | "manual",
  score: number | null
): Promise<EnActionResult> {
  const auth = await getAuthed();
  if (!auth) return { ok: false, error: "unauthenticated" };
  if (!lessonHasPhrase(lessonId, phraseId)) return { ok: false, error: "invalid_phrase" };
  if (!["pass", "retry", "manual"].includes(result)) return { ok: false, error: "invalid_result" };
  const safeScore =
    score === null || score === undefined ? null : Math.max(0, Math.min(100, Math.round(score)));

  const { error } = await auth.sb.rpc("submit_course_voice_attempt", {
    p_course_id: ENGLISH_COURSE_ID,
    p_lesson_id: lessonId,
    p_phrase_id: phraseId,
    p_result: result,
    p_score: safeScore,
  });
  if (error) return { ok: false, error: "write_failed" };
  return { ok: true };
}

export async function submitEnglishQuizAttempt(
  lessonId: string,
  correct: number,
  total: number
): Promise<EnActionResult & { passed?: boolean }> {
  const auth = await getAuthed();
  if (!auth) return { ok: false, error: "unauthenticated" };
  const lesson = getEnglishLesson(lessonId);
  if (!lesson) return { ok: false, error: "invalid_lesson" };
  if (!Number.isInteger(total) || total <= 0) return { ok: false, error: "invalid_total" };
  if (!Number.isInteger(correct) || correct < 0 || correct > total) return { ok: false, error: "invalid_correct" };

  const { data, error } = await auth.sb.rpc("submit_course_quiz_attempt", {
    p_course_id: ENGLISH_COURSE_ID,
    p_lesson_id: lessonId,
    p_correct: correct,
    p_total: total,
  });
  if (error) return { ok: false, error: "write_failed" };
  const row = Array.isArray(data) ? data[0] : data;
  return { ok: true, passed: !!row?.passed };
}

/**
 * One-time migration: push existing local English progress to the server.
 * Validates each id against the catalog; ignores unknowns. Idempotent (RPC
 * upserts). Returns counts synced.
 */
export async function syncLocalEnglishProgress(payload: {
  learned?: string[];
  voicePassed?: string[];
}): Promise<EnActionResult & { learnedSynced?: number; voiceSynced?: number }> {
  const auth = await getAuthed();
  if (!auth) return { ok: false, error: "unauthenticated" };

  // Build phrase -> lesson map from the catalog.
  const phraseToLesson = new Map<string, string>();
  const { getAllEnglishLessons } = await import("@/lib/englishCourse");
  for (const lesson of getAllEnglishLessons()) {
    for (const p of lesson.phrases) phraseToLesson.set(p.id, lesson.id);
  }

  const learned = Array.from(new Set(payload.learned ?? [])).filter((id) => phraseToLesson.has(id));
  const voice = Array.from(new Set(payload.voicePassed ?? [])).filter((id) => phraseToLesson.has(id));
  const touchedLessons = new Set<string>();

  let learnedSynced = 0;
  for (const phraseId of learned) {
    const lessonId = phraseToLesson.get(phraseId)!;
    const { error } = await auth.sb.rpc("mark_course_phrase_learned", {
      p_course_id: ENGLISH_COURSE_ID,
      p_lesson_id: lessonId,
      p_phrase_id: phraseId,
      p_learned: true,
    });
    if (!error) {
      learnedSynced += 1;
      touchedLessons.add(lessonId);
    }
  }

  let voiceSynced = 0;
  for (const phraseId of voice) {
    const lessonId = phraseToLesson.get(phraseId)!;
    const { error } = await auth.sb.rpc("submit_course_voice_attempt", {
      p_course_id: ENGLISH_COURSE_ID,
      p_lesson_id: lessonId,
      p_phrase_id: phraseId,
      p_result: "manual",
      p_score: null,
    });
    if (!error) voiceSynced += 1;
  }

  for (const lessonId of touchedLessons) await recomputeLessonCompletion(auth.sb, lessonId);

  return { ok: true, learnedSynced, voiceSynced };
}
