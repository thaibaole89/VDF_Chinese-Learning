// Server-side learner dashboard. Phase 2B.1 → 2B.2.
//
// Computes the data the /account page renders: lesson completion (cross-device
// truth from Supabase), Day-One section progress (derived from voice_attempts),
// and the next-lesson suggestion.
//
// 2B.2 change: the main progress bar is now the REQUIRED learning path (see
// lib/courseCatalog.ts), not all 29 lessons. Optional + reference lessons are
// counted separately. The next-suggestion walks required → optional → review.
//
// Server-only by design. All reads are RLS-scoped to the authenticated user.
// localStorage is never consulted here.

import type { SupabaseClient } from "@supabase/supabase-js";
import { getLessonById } from "@/lib/content";
import {
  DAY_ONE_LESSON_ID,
  DAY_ONE_REQUIREMENTS,
  type DayOneEligibility,
} from "@/lib/dayOneEligibility";
import {
  getDayOneDialogueRequiredPhraseIds,
  getDayOneRoleplayRequiredPhraseIds,
  DAY_ONE_QUIZ_PASS_SCORE,
} from "@/lib/dayOneModule";
import { ACTIVE_CATALOG } from "@/lib/courseCatalog";

export type CourseSummary = {
  id: string;
  titleVi: string;
  language: string;
};

export const ACTIVE_COURSE: CourseSummary = {
  id: ACTIVE_CATALOG.courseId,
  titleVi: ACTIVE_CATALOG.titleVi,
  language: ACTIVE_CATALOG.language,
};

export type DayOneSectionMini = {
  label: string;
  ratio: number;
  display: string;
  status: "not_started" | "in_progress" | "completed";
};

export type NextSuggestion =
  | { kind: "day_one"; label: string; href: string; reasonVi: string }
  | {
      kind: "lesson";
      label: string;
      href: string;
      reasonVi: string;
      lessonId: string;
      track: "required" | "optional";
    }
  | { kind: "all_done"; label: string; href: string; reasonVi: string };

export type LearnerDashboard = {
  course: CourseSummary;
  /** REQUIRED-path progress — drives the main bar. */
  required: { total: number; completed: number; remaining: number; ratio: number };
  /** Optional practice lessons. */
  optional: { total: number; completed: number };
  /** Reference / lookup lessons (no completion concept — count only). */
  reference: { total: number };
  /** Lesson IDs server-reported as completed (deduped with Day-One virtual completion). */
  completedLessonIds: string[];
  dayOne: {
    eligible: boolean;
    phrases: DayOneSectionMini;
    dialogue: DayOneSectionMini;
    roleplay: DayOneSectionMini;
    quiz: DayOneSectionMini;
    bestQuizScore: number;
  };
  next: NextSuggestion;
};

function isPassResult(r: string | null | undefined): boolean {
  return r === "pass" || r === "manual";
}

export async function computeLearnerDashboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", any>,
  eligibility: DayOneEligibility
): Promise<LearnerDashboard> {
  const catalog = ACTIVE_CATALOG;

  // ---- Lesson completion: RLS-scoped read of lesson_progress ----
  const { data: lessonRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("completed", true);

  const dbCompleted = new Set<string>(
    (lessonRows ?? [])
      .map((r) => r.lesson_id as string)
      .filter((x): x is string => typeof x === "string" && x.length > 0)
  );

  // Day-One counts as a completed lesson once cert eligibility passes — even if
  // the learner never opened /lessons/<day-one-id> directly.
  if (eligibility.eligible) dbCompleted.add(DAY_ONE_LESSON_ID);

  const requiredIds = catalog.requiredLessonIds;
  const optionalIds = catalog.optionalLessonIds;
  const referenceIds = catalog.referenceLessonIds;

  const requiredCompletedIds = requiredIds.filter((id) => dbCompleted.has(id));
  const requiredCompleted = requiredCompletedIds.length;
  const requiredTotal = requiredIds.length;
  const requiredRemaining = Math.max(0, requiredTotal - requiredCompleted);
  const requiredRatio = requiredTotal > 0 ? requiredCompleted / requiredTotal : 0;

  const optionalCompleted = optionalIds.filter((id) => dbCompleted.has(id)).length;

  const completedLessonIds = [...requiredCompletedIds, ...optionalIds.filter((id) => dbCompleted.has(id))];

  // ---- Day-One sub-section mini-progress ----
  const { data: voiceRows } = await supabase
    .from("voice_attempts")
    .select("phrase_id, result")
    .eq("lesson_id", DAY_ONE_LESSON_ID)
    .in("result", ["pass", "manual"]);

  const passedPhraseIds = new Set<string>(
    (voiceRows ?? [])
      .filter((r) => isPassResult(r.result as string | null))
      .map((r) => r.phrase_id as string)
  );

  const dialogueReq = getDayOneDialogueRequiredPhraseIds();
  const roleplayReq = getDayOneRoleplayRequiredPhraseIds();
  const dialoguePassed = dialogueReq.filter((id) => passedPhraseIds.has(id)).length;
  const roleplayPassed = roleplayReq.filter((id) => passedPhraseIds.has(id)).length;

  function mini(label: string, passed: number, total: number, display?: string): DayOneSectionMini {
    const r = total > 0 ? passed / total : 0;
    const status: DayOneSectionMini["status"] =
      total > 0 && passed >= total ? "completed" : passed > 0 ? "in_progress" : "not_started";
    return { label, ratio: r, display: display ?? `${passed}/${total}`, status };
  }

  const phrasesMini = mini("10 câu", eligibility.phrasesLearned, eligibility.totalPhrases);
  const dialogueMini = mini("Hội thoại", dialoguePassed, dialogueReq.length);
  const roleplayMini = mini("Đóng vai", roleplayPassed, roleplayReq.length);

  const bestQuiz = Number(eligibility.bestQuizScore ?? 0);
  const quizMini: DayOneSectionMini = {
    label: "Kiểm tra",
    ratio: Math.min(1, bestQuiz / 100),
    display: `${Math.round(bestQuiz)}/100`,
    status:
      bestQuiz >= DAY_ONE_QUIZ_PASS_SCORE ? "completed" : bestQuiz > 0 ? "in_progress" : "not_started",
  };

  // ---- Next suggestion: Day-One → required path → optional → review ----
  const next = computeNext({
    eligibility,
    dbCompleted,
    catalog,
  });

  return {
    course: ACTIVE_COURSE,
    required: {
      total: requiredTotal,
      completed: requiredCompleted,
      remaining: requiredRemaining,
      ratio: requiredRatio,
    },
    optional: { total: optionalIds.length, completed: optionalCompleted },
    reference: { total: referenceIds.length },
    completedLessonIds,
    dayOne: {
      eligible: eligibility.eligible,
      phrases: phrasesMini,
      dialogue: dialogueMini,
      roleplay: roleplayMini,
      quiz: quizMini,
      bestQuizScore: bestQuiz,
    },
    next,
  };
}

function computeNext(args: {
  eligibility: DayOneEligibility;
  dbCompleted: Set<string>;
  catalog: typeof ACTIVE_CATALOG;
}): NextSuggestion {
  const { eligibility, dbCompleted, catalog } = args;

  // 1. Day-One not yet complete → point at the first unmet Day-One step.
  if (!eligibility.eligible) {
    const met = eligibility.met;
    if (!met.phrasesLearned) {
      return {
        kind: "day_one",
        label: "Học 10 câu sống còn",
        href: "/day-one/phrases",
        reasonVi:
          eligibility.phrasesLearned === 0
            ? "Bắt đầu với 10 câu phải thuộc trước ca bán hàng."
            : `Còn ${DAY_ONE_REQUIREMENTS.phrasesLearnedTarget - eligibility.phrasesLearned} câu nữa cần đánh dấu đã thuộc.`,
      };
    }
    if (!met.voicePassed) {
      return {
        kind: "day_one",
        label: "Luyện đọc Day-One",
        href: "/day-one/phrases",
        reasonVi: `Đọc đạt ít nhất ${DAY_ONE_REQUIREMENTS.voicePassedTarget}/${DAY_ONE_REQUIREMENTS.totalPhrases} câu để mở chứng nhận.`,
      };
    }
    if (!met.bestQuizScore) {
      return {
        kind: "day_one",
        label: "Làm bài kiểm tra Day-One",
        href: "/day-one/quiz",
        reasonVi: `Cần điểm tốt nhất ≥ ${DAY_ONE_REQUIREMENTS.bestQuizScoreTarget}/100 để hoàn thành Day-One.`,
      };
    }
    return {
      kind: "day_one",
      label: "Tiếp tục Day-One",
      href: "/day-one",
      reasonVi: "Quay lại Day-One để xem mục còn cần hoàn thành.",
    };
  }

  // 2. Day-One done → next incomplete REQUIRED lesson, in recommended order.
  //    recommendedOrder leads with Day-One itself, so skip that.
  const nextRequired = catalog.recommendedOrder.find(
    (id) => id !== catalog.dayOneLessonId && !dbCompleted.has(id)
  );
  if (nextRequired) {
    const lesson = getLessonById(nextRequired);
    return {
      kind: "lesson",
      label: lesson?.titleVi ?? "Bài bắt buộc tiếp theo",
      href: `/lessons/${nextRequired}`,
      reasonVi: "Bài bắt buộc tiếp theo trong lộ trình quy trình bán hàng.",
      lessonId: nextRequired,
      track: "required",
    };
  }

  // 3. Required path done → suggest the first incomplete OPTIONAL lesson.
  const nextOptional = catalog.optionalLessonIds.find((id) => !dbCompleted.has(id));
  if (nextOptional) {
    const lesson = getLessonById(nextOptional);
    return {
      kind: "lesson",
      label: lesson?.titleVi ?? "Bài tự chọn tiếp theo",
      href: `/lessons/${nextOptional}`,
      reasonVi: "Đã xong lộ trình bắt buộc — học thêm bài tự chọn để nâng cao.",
      lessonId: nextOptional,
      track: "optional",
    };
  }

  // 4. Everything done → review / reference.
  return {
    kind: "all_done",
    label: "Ôn tập & tra cứu",
    href: "/lessons",
    reasonVi: "Đã hoàn thành cả lộ trình bắt buộc và bài tự chọn — quay lại ôn tập hoặc tra cứu bất kỳ bài nào.",
  };
}
