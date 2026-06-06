// Manager dashboard data. Phase 2B.7. Server-only.
//
// ACCESS: relies on the Phase 2A.1 manager-read RLS policies. When the caller's
// profile.role = 'manager', the manager_select policies return ALL learner rows
// for profiles / lesson_progress / voice_attempts / phrase_progress. For a staff
// caller the same queries return only their own rows — so RLS itself is the
// backstop, in addition to the explicit role check in loadManagerDashboard().
//
// No service_role, no new RPC, no schema change. localStorage is never used.
// Queries are bulk (4 total for the list) and aggregated in JS — fine at pilot
// scale and avoids N+1.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DAY_ONE_LESSON_ID,
  DAY_ONE_REQUIREMENTS,
} from "@/lib/dayOneEligibility";
import { ACTIVE_CATALOG } from "@/lib/courseCatalog";
import { getLessonById, getPhraseTextById } from "@/lib/content";

export type LearnerStatus =
  | "certified"
  | "needs_quiz"
  | "needs_voice"
  | "not_certified"
  | "not_started";

export const STATUS_LABEL: Record<LearnerStatus, string> = {
  certified: "Đã đạt",
  needs_quiz: "Cần làm quiz",
  needs_voice: "Cần luyện nói",
  not_certified: "Chưa đạt",
  not_started: "Chưa bắt đầu",
};

export type ManagerLearnerRow = {
  userId: string;
  displayName: string;
  store: string | null;
  role: string;
  certified: boolean;
  status: LearnerStatus;
  phraseLearnedCount: number; // global aggregate (all lessons)
  voicePassCount: number; // global aggregate (all lessons)
  bestQuizScore: number;
  dayOnePhrasesLearned: number; // Day-One scoped
  dayOneVoicePassed: number; // Day-One scoped distinct
  requiredCompleted: number;
  requiredTotal: number;
  lastActivity: string | null; // ISO
};

export type ManagerSummary = {
  totalLearners: number;
  certified: number;
  notCertified: number;
  avgBestQuiz: number;
  avgVoicePass: number;
  avgRequiredCompletionPct: number;
};

export type ManagerDashboard = {
  summary: ManagerSummary;
  learners: ManagerLearnerRow[];
  stores: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = SupabaseClient<any, "public", any>;

function fallbackName(id: string): string {
  return "Học viên " + id.replace(/-/g, "").slice(0, 4).toUpperCase();
}
function displayNameOf(fullName: string | null | undefined, id: string): string {
  const trimmed = (fullName ?? "").trim();
  return trimmed.length > 0 ? trimmed : fallbackName(id);
}

function isPass(result: string | null | undefined): boolean {
  return result === "pass" || result === "manual";
}

function deriveStatus(args: {
  certified: boolean;
  phraseLearnedCount: number;
  voicePassCount: number;
  bestQuizScore: number;
  requiredCompleted: number;
  dayOneVoicePassed: number;
}): LearnerStatus {
  const noActivity =
    args.phraseLearnedCount === 0 &&
    args.voicePassCount === 0 &&
    args.bestQuizScore === 0 &&
    args.requiredCompleted === 0;
  if (noActivity) return "not_started";
  if (args.certified) return "certified";
  if (args.bestQuizScore < DAY_ONE_REQUIREMENTS.bestQuizScoreTarget) return "needs_quiz";
  if (args.dayOneVoicePassed < DAY_ONE_REQUIREMENTS.voicePassedTarget) return "needs_voice";
  return "not_certified";
}

/** True if the current user is a manager (server-side, RLS-safe). */
export async function isManager(supabase: SB): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return data?.role === "manager";
}

/**
 * Load the full manager dashboard. Returns null if the caller is NOT a manager
 * (defense in depth alongside RLS). 4 bulk queries, aggregated in JS.
 */
export async function loadManagerDashboard(supabase: SB): Promise<ManagerDashboard | null> {
  if (!(await isManager(supabase))) return null;

  const requiredIds = ACTIVE_CATALOG.requiredLessonIds;
  const requiredSet = new Set(requiredIds);
  const requiredTotal = requiredIds.length;

  const [profilesRes, phraseRes, voiceRes, lessonRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, store, role, best_quiz_score, voice_pass_count, phrase_learned_count, updated_at")
      .neq("role", "manager"),
    supabase
      .from("phrase_progress")
      .select("user_id, phrase_id")
      .eq("lesson_id", DAY_ONE_LESSON_ID)
      .eq("learned", true),
    supabase
      .from("voice_attempts")
      .select("user_id, phrase_id, created_at")
      .eq("lesson_id", DAY_ONE_LESSON_ID)
      .in("result", ["pass", "manual"]),
    supabase.from("lesson_progress").select("user_id, lesson_id, completed_at").eq("completed", true),
  ]);

  const profiles = (profilesRes.data ?? []) as Array<{
    id: string;
    full_name: string | null;
    store: string | null;
    role: string;
    best_quiz_score: number | string | null;
    voice_pass_count: number | string | null;
    phrase_learned_count: number | string | null;
    updated_at: string | null;
  }>;

  // Day-One phrases learned per user.
  const dayOnePhrases = new Map<string, number>();
  for (const r of (phraseRes.data ?? []) as Array<{ user_id: string }>) {
    dayOnePhrases.set(r.user_id, (dayOnePhrases.get(r.user_id) ?? 0) + 1);
  }

  // Day-One distinct voice-passed phrases per user.
  const dayOneVoice = new Map<string, Set<string>>();
  for (const r of (voiceRes.data ?? []) as Array<{ user_id: string; phrase_id: string }>) {
    if (!dayOneVoice.has(r.user_id)) dayOneVoice.set(r.user_id, new Set());
    dayOneVoice.get(r.user_id)!.add(r.phrase_id);
  }

  // Completed required lessons + latest lesson activity per user.
  const completedRequired = new Map<string, Set<string>>();
  const lastLessonAt = new Map<string, string>();
  for (const r of (lessonRes.data ?? []) as Array<{ user_id: string; lesson_id: string; completed_at: string | null }>) {
    if (requiredSet.has(r.lesson_id)) {
      if (!completedRequired.has(r.user_id)) completedRequired.set(r.user_id, new Set());
      completedRequired.get(r.user_id)!.add(r.lesson_id);
    }
    if (r.completed_at) {
      const prev = lastLessonAt.get(r.user_id);
      if (!prev || r.completed_at > prev) lastLessonAt.set(r.user_id, r.completed_at);
    }
  }

  const learners: ManagerLearnerRow[] = profiles.map((p) => {
    const dop = dayOnePhrases.get(p.id) ?? 0;
    const dov = dayOneVoice.get(p.id)?.size ?? 0;
    const bestQuiz = Number(p.best_quiz_score ?? 0);
    const certified =
      dop >= DAY_ONE_REQUIREMENTS.phrasesLearnedTarget &&
      dov >= DAY_ONE_REQUIREMENTS.voicePassedTarget &&
      bestQuiz >= DAY_ONE_REQUIREMENTS.bestQuizScoreTarget;

    const reqSet = completedRequired.get(p.id) ?? new Set<string>();
    let requiredCompleted = reqSet.size;
    // Day-One is a required lesson but the module routes don't write
    // lesson_progress for it — count it when certified (matches /account).
    if (certified && !reqSet.has(DAY_ONE_LESSON_ID)) requiredCompleted += 1;
    requiredCompleted = Math.min(requiredCompleted, requiredTotal);

    const phraseLearnedCount = Number(p.phrase_learned_count ?? 0);
    const voicePassCount = Number(p.voice_pass_count ?? 0);

    // Last activity = max(profile.updated_at, latest required/any lesson completion).
    const lessonAt = lastLessonAt.get(p.id) ?? null;
    let lastActivity = p.updated_at ?? null;
    if (lessonAt && (!lastActivity || lessonAt > lastActivity)) lastActivity = lessonAt;

    const status = deriveStatus({
      certified,
      phraseLearnedCount,
      voicePassCount,
      bestQuizScore: bestQuiz,
      requiredCompleted,
      dayOneVoicePassed: dov,
    });

    return {
      userId: p.id,
      displayName: displayNameOf(p.full_name, p.id),
      store: p.store,
      role: p.role,
      certified,
      status,
      phraseLearnedCount,
      voicePassCount,
      bestQuizScore: bestQuiz,
      dayOnePhrasesLearned: dop,
      dayOneVoicePassed: dov,
      requiredCompleted,
      requiredTotal,
      lastActivity,
    };
  });

  // Sort: certified last? Managers usually want to see who needs help first.
  // Order by status priority (not_started, needs_*, not_certified, certified),
  // then by name.
  const statusRank: Record<LearnerStatus, number> = {
    not_started: 0,
    needs_quiz: 1,
    needs_voice: 2,
    not_certified: 3,
    certified: 4,
  };
  learners.sort((a, b) => {
    if (statusRank[a.status] !== statusRank[b.status]) return statusRank[a.status] - statusRank[b.status];
    return a.displayName.localeCompare(b.displayName, "vi");
  });

  const total = learners.length;
  const certifiedCount = learners.filter((l) => l.certified).length;
  const avg = (sel: (l: ManagerLearnerRow) => number) =>
    total > 0 ? learners.reduce((s, l) => s + sel(l), 0) / total : 0;

  const summary: ManagerSummary = {
    totalLearners: total,
    certified: certifiedCount,
    notCertified: total - certifiedCount,
    avgBestQuiz: Math.round(avg((l) => l.bestQuizScore)),
    avgVoicePass: Math.round(avg((l) => l.voicePassCount) * 10) / 10,
    avgRequiredCompletionPct: Math.round(avg((l) => l.requiredCompleted / l.requiredTotal) * 100),
  };

  const stores = Array.from(
    new Set(learners.map((l) => l.store).filter((s): s is string => !!s && s.trim().length > 0))
  ).sort((a, b) => a.localeCompare(b, "vi"));

  return { summary, learners, stores };
}

// ---------- Learner detail ----------

export type RecentVoice = {
  phraseId: string;
  phraseZh: string | null;
  result: string;
  score: number | null;
  at: string;
};
export type RecentLesson = {
  lessonId: string;
  titleVi: string | null;
  completedAt: string | null;
};

export type LearnerDetail = {
  userId: string;
  displayName: string;
  email: string | null; // manager-only view
  store: string | null;
  role: string;
  certified: boolean;
  status: LearnerStatus;
  dayOnePhrasesLearned: number;
  dayOneVoicePassed: number;
  bestQuizScore: number;
  phraseLearnedCount: number;
  voicePassCount: number;
  requiredCompleted: number;
  requiredTotal: number;
  requiredLessons: { lessonId: string; titleVi: string | null; completed: boolean }[];
  recentVoice: RecentVoice[];
  recentLessons: RecentLesson[];
  requirements: typeof DAY_ONE_REQUIREMENTS;
};

/**
 * Load one learner's detail. Returns null if caller isn't a manager, or if the
 * target profile isn't found. Email is included here (manager-only view).
 */
export async function loadLearnerDetail(supabase: SB, userId: string): Promise<LearnerDetail | null> {
  if (!(await isManager(supabase))) return null;

  const requiredIds = ACTIVE_CATALOG.requiredLessonIds;
  const requiredSet = new Set(requiredIds);

  const [profileRes, phraseRes, voiceRes, lessonRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, store, role, best_quiz_score, voice_pass_count, phrase_learned_count")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("phrase_progress")
      .select("phrase_id")
      .eq("user_id", userId)
      .eq("lesson_id", DAY_ONE_LESSON_ID)
      .eq("learned", true),
    supabase
      .from("voice_attempts")
      .select("phrase_id, result, score, created_at, lesson_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(15),
    supabase
      .from("lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", userId)
      .eq("completed", true),
  ]);

  const p = profileRes.data as
    | {
        id: string;
        full_name: string | null;
        email: string | null;
        store: string | null;
        role: string;
        best_quiz_score: number | string | null;
        voice_pass_count: number | string | null;
        phrase_learned_count: number | string | null;
      }
    | null;
  if (!p) return null;

  const dayOnePhrasesLearned = (phraseRes.data ?? []).length;

  // Day-One distinct voice-passed (from the recent slice we only have 15; query
  // a scoped count instead for accuracy).
  const { data: dayOneVoiceRows } = await supabase
    .from("voice_attempts")
    .select("phrase_id")
    .eq("user_id", userId)
    .eq("lesson_id", DAY_ONE_LESSON_ID)
    .in("result", ["pass", "manual"]);
  const dayOneVoicePassed = new Set((dayOneVoiceRows ?? []).map((r) => (r as { phrase_id: string }).phrase_id)).size;

  const bestQuizScore = Number(p.best_quiz_score ?? 0);
  const certified =
    dayOnePhrasesLearned >= DAY_ONE_REQUIREMENTS.phrasesLearnedTarget &&
    dayOneVoicePassed >= DAY_ONE_REQUIREMENTS.voicePassedTarget &&
    bestQuizScore >= DAY_ONE_REQUIREMENTS.bestQuizScoreTarget;

  const completedLessonIds = new Set(
    ((lessonRes.data ?? []) as Array<{ lesson_id: string }>).map((r) => r.lesson_id)
  );
  const requiredLessons = requiredIds.map((id) => ({
    lessonId: id,
    titleVi: getLessonById(id)?.titleVi ?? null,
    completed: completedLessonIds.has(id) || (id === DAY_ONE_LESSON_ID && certified),
  }));
  const requiredCompleted = requiredLessons.filter((l) => l.completed).length;

  const recentVoice: RecentVoice[] = ((voiceRes.data ?? []) as Array<{
    phrase_id: string;
    result: string;
    score: number | string | null;
    created_at: string;
  }>).map((r) => ({
    phraseId: r.phrase_id,
    phraseZh: getPhraseTextById(r.phrase_id) ?? null,
    result: r.result,
    score: r.score === null || r.score === undefined ? null : Number(r.score),
    at: r.created_at,
  }));

  const recentLessons: RecentLesson[] = ((lessonRes.data ?? []) as Array<{
    lesson_id: string;
    completed_at: string | null;
  }>)
    .slice()
    .sort((a, b) => (a.completed_at && b.completed_at ? (a.completed_at < b.completed_at ? 1 : -1) : 0))
    .slice(0, 12)
    .map((r) => ({
      lessonId: r.lesson_id,
      titleVi: getLessonById(r.lesson_id)?.titleVi ?? null,
      completedAt: r.completed_at,
    }));

  const status = deriveStatus({
    certified,
    phraseLearnedCount: Number(p.phrase_learned_count ?? 0),
    voicePassCount: Number(p.voice_pass_count ?? 0),
    bestQuizScore,
    requiredCompleted,
    dayOneVoicePassed,
  });

  return {
    userId: p.id,
    displayName: displayNameOf(p.full_name, p.id),
    email: p.email ?? null,
    store: p.store,
    role: p.role,
    certified,
    status,
    dayOnePhrasesLearned,
    dayOneVoicePassed,
    bestQuizScore,
    phraseLearnedCount: Number(p.phrase_learned_count ?? 0),
    voicePassCount: Number(p.voice_pass_count ?? 0),
    requiredCompleted,
    requiredTotal: requiredIds.length,
    requiredLessons,
    recentVoice,
    recentLessons,
    requirements: DAY_ONE_REQUIREMENTS,
  };
}
