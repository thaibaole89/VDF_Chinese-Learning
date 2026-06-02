// Server-side learner dashboard. Phase 2B.1.
//
// Computes the data the /account page renders: lesson completion counts
// (cross-device truth from Supabase), Day-One section progress (derived from
// voice_attempts), and the next-lesson suggestion based on canonical lesson
// order.
//
// Server-only by design. All reads are RLS-scoped to the authenticated user.
// localStorage is never consulted here — that data drives per-device UI in the
// learning routes; this helper is the source of truth on /account.

import type { SupabaseClient } from "@supabase/supabase-js";
import { getLessonGroups } from "@/lib/content";
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

export type CourseSummary = {
  /** Slug used internally (only one course today, but the shape supports more). */
  id: string;
  titleVi: string;
  language: string;
};

export const ACTIVE_COURSE: CourseSummary = {
  id: "chinese_vdf_sales",
  titleVi: "Chinese for VDF Sales",
  language: "Tiếng Trung (zh-CN)",
};

export type DayOneSectionMini = {
  label: string;
  /** 0..1 ratio for the progress fragment. */
  ratio: number;
  /** Display string e.g. "10/10" or "78/100". */
  display: string;
  status: "not_started" | "in_progress" | "completed";
};

export type NextSuggestion =
  | {
      kind: "day_one";
      label: string;
      href: string;
      reasonVi: string;
    }
  | {
      kind: "lesson";
      label: string;
      href: string;
      reasonVi: string;
      lessonId: string;
      groupTitleVi: string;
    }
  | {
      kind: "all_done";
      label: string;
      href: string;
      reasonVi: string;
    };

export type LearnerDashboard = {
  course: CourseSummary;
  /** Server-truth lesson completion. Day-One counted as done if eligible. */
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  /** 0..1 ratio for the segmented bar. */
  ratio: number;
  /** Lesson IDs server-reported as completed (deduped with Day-One virtual completion). */
  completedLessonIds: string[];
  /** Order of all lesson IDs as they appear in the catalog (group/file order). */
  orderedLessonIds: string[];
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

/**
 * Canonical lesson order — used to pick the next suggestion. Walks the
 * /lessons group definitions in order, then lessons inside each group in
 * file order. Day-One is the first group, then sales_flow, product,
 * foundation.
 */
function orderedLessons(): { lessonId: string; titleVi: string; groupTitleVi: string }[] {
  const out: { lessonId: string; titleVi: string; groupTitleVi: string }[] = [];
  for (const g of getLessonGroups()) {
    for (const m of g.lessons) {
      out.push({
        lessonId: m.lesson.id,
        titleVi: m.lesson.titleVi,
        groupTitleVi: g.titleVi,
      });
    }
  }
  return out;
}

export async function computeLearnerDashboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", any>,
  eligibility: DayOneEligibility
): Promise<LearnerDashboard> {
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

  // Day-One counts as a completed lesson once cert eligibility passes — even
  // if the learner never opened /lessons/<day-one-id> directly. Keeps the
  // count honest with what the learner actually achieved.
  if (eligibility.eligible) dbCompleted.add(DAY_ONE_LESSON_ID);

  const ordered = orderedLessons();
  const orderedIds = ordered.map((o) => o.lessonId);
  const totalLessons = ordered.length;
  // Only count completions that map to a real lesson in the current catalog
  // (defensive: a lesson row referring to a removed lesson shouldn't inflate).
  const completedIds = orderedIds.filter((id) => dbCompleted.has(id));
  const completedLessons = completedIds.length;
  const remainingLessons = Math.max(0, totalLessons - completedLessons);
  const ratio = totalLessons > 0 ? completedLessons / totalLessons : 0;

  // ---- Day-One sub-section mini-progress ----
  // Re-query voice_attempts scoped to Day-One; dedup phrase_id with a
  // pass/manual result. dayOneEligibility already pulled this data but didn't
  // expose the per-section breakdown.
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

  function mini(
    label: string,
    passed: number,
    total: number,
    display?: string
  ): DayOneSectionMini {
    const r = total > 0 ? passed / total : 0;
    const status: DayOneSectionMini["status"] =
      total > 0 && passed >= total ? "completed" : passed > 0 ? "in_progress" : "not_started";
    return { label, ratio: r, display: display ?? `${passed}/${total}`, status };
  }

  const phrasesMini = mini(
    "10 câu",
    eligibility.phrasesLearned,
    eligibility.totalPhrases
  );
  const dialogueMini = mini("Hội thoại", dialoguePassed, dialogueReq.length);
  const roleplayMini = mini("Đóng vai", roleplayPassed, roleplayReq.length);

  const bestQuiz = Number(eligibility.bestQuizScore ?? 0);
  const quizMini: DayOneSectionMini = {
    label: "Kiểm tra",
    ratio: Math.min(1, bestQuiz / 100),
    display: `${Math.round(bestQuiz)}/100`,
    status:
      bestQuiz >= DAY_ONE_QUIZ_PASS_SCORE
        ? "completed"
        : bestQuiz > 0
          ? "in_progress"
          : "not_started",
  };

  // ---- Next-lesson suggestion ----
  let next: NextSuggestion;
  if (!eligibility.eligible) {
    // Find the most actionable Day-One step — first unmet requirement.
    const unmet = eligibility.met;
    if (!unmet.phrasesLearned) {
      next = {
        kind: "day_one",
        label: "Học 10 câu sống còn",
        href: "/day-one/phrases",
        reasonVi:
          eligibility.phrasesLearned === 0
            ? "Bắt đầu với 10 câu phải thuộc trước ca bán hàng."
            : `Còn ${DAY_ONE_REQUIREMENTS.phrasesLearnedTarget - eligibility.phrasesLearned} câu nữa cần đánh dấu đã thuộc.`,
      };
    } else if (!unmet.voicePassed) {
      next = {
        kind: "day_one",
        label: "Luyện đọc Day-One",
        href: "/day-one/phrases",
        reasonVi: `Đọc đạt ít nhất ${DAY_ONE_REQUIREMENTS.voicePassedTarget}/${DAY_ONE_REQUIREMENTS.totalPhrases} câu để mở chứng nhận.`,
      };
    } else if (!unmet.bestQuizScore) {
      next = {
        kind: "day_one",
        label: "Làm bài kiểm tra Day-One",
        href: "/day-one/quiz",
        reasonVi: `Cần điểm tốt nhất ≥ ${DAY_ONE_REQUIREMENTS.bestQuizScoreTarget}/100 để hoàn thành Day-One.`,
      };
    } else {
      // Shouldn't happen — eligible is false but every met flag is true.
      next = {
        kind: "day_one",
        label: "Tiếp tục Day-One",
        href: "/day-one",
        reasonVi: "Quay lại Day-One để xem mục còn cần hoàn thành.",
      };
    }
  } else {
    // Day-One done. Pick the first non-completed lesson in canonical order.
    const candidate = ordered.find(
      (o) => o.lessonId !== DAY_ONE_LESSON_ID && !dbCompleted.has(o.lessonId)
    );
    if (candidate) {
      next = {
        kind: "lesson",
        label: candidate.titleVi,
        href: `/lessons/${candidate.lessonId}`,
        reasonVi: `Bài tiếp theo trong nhóm "${candidate.groupTitleVi}".`,
        lessonId: candidate.lessonId,
        groupTitleVi: candidate.groupTitleVi,
      };
    } else {
      next = {
        kind: "all_done",
        label: "Ôn tập danh sách bài học",
        href: "/lessons",
        reasonVi: "Đã hoàn thành tất cả bài học hiện có — quay lại ôn tập bất kỳ bài nào.",
      };
    }
  }

  return {
    course: ACTIVE_COURSE,
    totalLessons,
    completedLessons,
    remainingLessons,
    ratio,
    completedLessonIds: completedIds,
    orderedLessonIds: orderedIds,
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
