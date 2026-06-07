// Server-side English course progress (Phase 2C.2). Server-only reads, all
// RLS-scoped to the authenticated user (or manager-read for aggregates). Reads
// the generic course-progress tables from migration 005. Never touches the
// Chinese tables. Degrades gracefully (serverOk=false / null) when Supabase is
// unconfigured or migration 005 hasn't been applied yet.

import type { SupabaseClient } from "@supabase/supabase-js";
import { allEnglishPhraseIds, getAllEnglishLessons, type EnLesson } from "@/lib/englishCourse";

export const ENGLISH_COURSE_ID = "english-sales";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = SupabaseClient<any, "public", any>;

export type EnglishProgress = {
  serverOk: boolean;
  learnedPhraseIds: string[];
  voicePassedPhraseIds: string[];
  completedLessonIds: string[];
};

const EMPTY: EnglishProgress = {
  serverOk: false,
  learnedPhraseIds: [],
  voicePassedPhraseIds: [],
  completedLessonIds: [],
};

/** Current user's English progress from Supabase. serverOk=false on any failure. */
export async function loadEnglishProgress(supabase: SB): Promise<EnglishProgress> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return EMPTY;

  const [phraseRes, voiceRes, lessonRes] = await Promise.all([
    supabase
      .from("course_phrase_progress")
      .select("phrase_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("learned", true),
    supabase
      .from("course_voice_attempts")
      .select("phrase_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .in("result", ["pass", "manual"]),
    supabase
      .from("course_lesson_progress")
      .select("lesson_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("completed", true),
  ]);

  // Table missing (migration not applied) or RLS/transient error → local fallback.
  if (phraseRes.error || voiceRes.error || lessonRes.error) return EMPTY;

  return {
    serverOk: true,
    learnedPhraseIds: (phraseRes.data ?? []).map((r) => (r as { phrase_id: string }).phrase_id),
    voicePassedPhraseIds: Array.from(
      new Set((voiceRes.data ?? []).map((r) => (r as { phrase_id: string }).phrase_id))
    ),
    completedLessonIds: (lessonRes.data ?? []).map((r) => (r as { lesson_id: string }).lesson_id),
  };
}

export type EnglishCourseSummary = { total: number; learned: number; pct: number };

export function englishCourseSummary(p: EnglishProgress): EnglishCourseSummary {
  const total = allEnglishPhraseIds().length;
  const learnedSet = new Set(p.learnedPhraseIds);
  const learned = allEnglishPhraseIds().filter((id) => learnedSet.has(id)).length;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
  return { total, learned, pct };
}

export type EnglishLessonProgress = {
  learned: number;
  total: number;
  completed: boolean;
};

export function lessonProgressOf(lesson: EnLesson, p: EnglishProgress): EnglishLessonProgress {
  const learnedSet = new Set(p.learnedPhraseIds);
  const learned = lesson.phrases.filter((ph) => learnedSet.has(ph.id)).length;
  return {
    learned,
    total: lesson.phrases.length,
    completed: p.completedLessonIds.includes(lesson.id),
  };
}

// ---------- Manager aggregates ----------

function displayNameOf(fullName: string | null | undefined, id: string): string {
  const t = (fullName ?? "").trim();
  return t.length > 0 ? t : "Học viên " + id.replace(/-/g, "").slice(0, 4).toUpperCase();
}

export type EnglishManagerSummary = {
  available: boolean; // false if migration 005 not applied
  startedLearners: number;
  avgProgressPct: number;
  lessonsCompleted: number;
  totalPhrases: number;
  topLearners: { userId: string; displayName: string; learned: number; pct: number }[];
};

/**
 * English aggregates for the manager dashboard. Manager-read RLS returns all
 * rows. Returns { available:false } if the table isn't there yet (graceful).
 */
export async function loadEnglishManagerSummary(supabase: SB): Promise<EnglishManagerSummary> {
  const totalPhrases = allEnglishPhraseIds().length;
  const unavailable: EnglishManagerSummary = {
    available: false,
    startedLearners: 0,
    avgProgressPct: 0,
    lessonsCompleted: 0,
    totalPhrases,
    topLearners: [],
  };

  const [phraseRes, lessonRes] = await Promise.all([
    supabase
      .from("course_phrase_progress")
      .select("user_id, phrase_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("learned", true),
    supabase
      .from("course_lesson_progress")
      .select("user_id, lesson_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("completed", true),
  ]);
  if (phraseRes.error || lessonRes.error) return unavailable;

  const learnedByUser = new Map<string, Set<string>>();
  for (const r of (phraseRes.data ?? []) as Array<{ user_id: string; phrase_id: string }>) {
    if (!learnedByUser.has(r.user_id)) learnedByUser.set(r.user_id, new Set());
    learnedByUser.get(r.user_id)!.add(r.phrase_id);
  }

  const startedLearners = learnedByUser.size;
  const lessonsCompleted = (lessonRes.data ?? []).length;

  let pctSum = 0;
  const perUser: { userId: string; learned: number; pct: number }[] = [];
  for (const [userId, set] of learnedByUser.entries()) {
    const learned = set.size;
    const pct = totalPhrases > 0 ? Math.round((learned / totalPhrases) * 100) : 0;
    pctSum += pct;
    perUser.push({ userId, learned, pct });
  }
  const avgProgressPct = startedLearners > 0 ? Math.round(pctSum / startedLearners) : 0;

  perUser.sort((a, b) => b.learned - a.learned);
  const topIds = perUser.slice(0, 5);

  const nameById = new Map<string, string>();
  if (topIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in(
        "id",
        topIds.map((u) => u.userId)
      );
    for (const pr of (profs ?? []) as Array<{ id: string; full_name: string | null }>) {
      nameById.set(pr.id, displayNameOf(pr.full_name, pr.id));
    }
  }

  const topLearners = topIds.map((u) => ({
    userId: u.userId,
    displayName: nameById.get(u.userId) ?? displayNameOf(null, u.userId),
    learned: u.learned,
    pct: u.pct,
  }));

  return { available: true, startedLearners, avgProgressPct, lessonsCompleted, totalPhrases, topLearners };
}

export type LearnerEnglishProgress = {
  available: boolean;
  learned: number;
  total: number;
  pct: number;
  completedLessons: { lessonId: string; titleVi: string }[];
};

/** One learner's English progress for the manager learner-detail page. */
export async function loadLearnerEnglishProgress(supabase: SB, userId: string): Promise<LearnerEnglishProgress> {
  const total = allEnglishPhraseIds().length;
  const lessons = getAllEnglishLessons();
  const titleById = new Map(lessons.map((l) => [l.id, l.titleVi]));

  const [phraseRes, lessonRes] = await Promise.all([
    supabase
      .from("course_phrase_progress")
      .select("phrase_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("user_id", userId)
      .eq("learned", true),
    supabase
      .from("course_lesson_progress")
      .select("lesson_id")
      .eq("course_id", ENGLISH_COURSE_ID)
      .eq("user_id", userId)
      .eq("completed", true),
  ]);
  if (phraseRes.error || lessonRes.error) {
    return { available: false, learned: 0, total, pct: 0, completedLessons: [] };
  }

  const learned = (phraseRes.data ?? []).length;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
  const completedLessons = ((lessonRes.data ?? []) as Array<{ lesson_id: string }>).map((r) => ({
    lessonId: r.lesson_id,
    titleVi: titleById.get(r.lesson_id) ?? r.lesson_id,
  }));

  return { available: true, learned, total, pct, completedLessons };
}
