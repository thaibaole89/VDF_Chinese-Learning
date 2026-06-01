// Day-One module shape + status helpers shared by the dashboard and the 4
// sub-routes. Phase 2A.6.
//
// IMPORTANT: phrase-learning count is sourced from the same localStorage keys
// the rest of the app uses (vdf_chinese_progress.completedPhraseIds) — server
// is the source of truth for certificate eligibility (see lib/dayOneEligibility.ts
// — that runs server-side only). Here we only need fast local reads to drive
// the UI; the server reconciles on /account.

import { getDayOneLesson } from "@/lib/content";
import type { DayOneModuleProgress } from "@/lib/storage";

export const DAY_ONE_LESSON_ID = "lesson_day_one_10_phrases";

/** Pass score for the Day-One final quiz. Matches the cert eligibility target. */
export const DAY_ONE_QUIZ_PASS_SCORE = 70;

export type Section = "phrases" | "dialogue" | "roleplay" | "quiz";

export type SectionStatus = "locked" | "not_started" | "in_progress" | "completed";

export const SECTION_TITLES: Record<Section, { vi: string; subtitle: string }> = {
  phrases: {
    vi: "10 câu phải thuộc trước ca bán hàng",
    subtitle: "Học và luyện đọc 10 câu cốt lõi.",
  },
  dialogue: {
    vi: "Luyện hội thoại",
    subtitle: "Đọc theo hội thoại mẫu nhân viên · khách.",
  },
  roleplay: {
    vi: "Đóng vai",
    subtitle: "Tình huống thực tế tại quầy, thử xử lý.",
  },
  quiz: {
    vi: "Kiểm tra nhanh",
    subtitle: "Bài kiểm tra cuối — mở khoá sau khi học xong 3 phần trên.",
  },
};

export const SECTION_ORDER: Section[] = ["phrases", "dialogue", "roleplay", "quiz"];

export type DayOneDashboardSnapshot = {
  phrases: {
    learned: number;
    total: number;
    status: SectionStatus;
  };
  dialogue: {
    available: boolean;
    status: SectionStatus;
  };
  roleplay: {
    available: boolean;
    status: SectionStatus;
  };
  quiz: {
    unlocked: boolean;
    lastScore: number | null;
    status: SectionStatus;
    passed: boolean;
    /** Human-readable list of unmet prerequisites — drives the locked screen copy. */
    unmet: string[];
  };
};

/** Returns the Day-One phrase IDs (10 ids from content). Stable across builds. */
export function dayOnePhraseIds(): string[] {
  const lesson = getDayOneLesson();
  return (lesson?.sentencePatterns ?? []).map((p) => p.id);
}

/**
 * Build the dashboard snapshot from local data only. Server reconciles cert
 * eligibility on /account; this drives in-module UI state.
 */
export function computeDashboard(args: {
  completedPhraseIds: string[];
  module: DayOneModuleProgress;
}): DayOneDashboardSnapshot {
  const phraseIds = dayOnePhraseIds();
  const total = phraseIds.length;
  const learned = phraseIds.filter((id) => args.completedPhraseIds.includes(id)).length;
  const phrasesStatus: SectionStatus =
    learned === 0 ? "not_started" : learned >= total ? "completed" : "in_progress";

  function sectionStatus(s: { startedAt: string | null; completedAt: string | null }): SectionStatus {
    if (s.completedAt) return "completed";
    if (s.startedAt) return "in_progress";
    return "not_started";
  }

  const dialogueStatus = sectionStatus(args.module.dialogue);
  const roleplayStatus = sectionStatus(args.module.roleplay);

  // Quiz lock rule: ALL of
  //   1. learned phrases >= 10 (all of them)
  //   2. dialogue.completedAt set
  //   3. roleplay.completedAt set
  const unmet: string[] = [];
  if (learned < total) unmet.push(`Học đủ ${total} câu (đang ${learned}/${total})`);
  if (!args.module.dialogue.completedAt) unmet.push("Hoàn thành phần Luyện hội thoại");
  if (!args.module.roleplay.completedAt) unmet.push("Hoàn thành phần Đóng vai");
  const unlocked = unmet.length === 0;

  const lastScore = args.module.quiz?.lastScore ?? null;
  const passed = (lastScore ?? 0) >= DAY_ONE_QUIZ_PASS_SCORE;
  const quizStatus: SectionStatus = !unlocked
    ? "locked"
    : passed
      ? "completed"
      : lastScore === null
        ? "not_started"
        : "in_progress";

  return {
    phrases: { learned, total, status: phrasesStatus },
    dialogue: { available: true, status: dialogueStatus },
    roleplay: { available: true, status: roleplayStatus },
    quiz: { unlocked, lastScore, status: quizStatus, passed, unmet },
  };
}

export const STATUS_COPY: Record<SectionStatus, { label: string; cta: string; tone: "neutral" | "info" | "success" | "warning" }> = {
  not_started: { label: "Chưa bắt đầu", cta: "Bắt đầu", tone: "neutral" },
  in_progress: { label: "Đang học", cta: "Tiếp tục", tone: "info" },
  completed: { label: "Hoàn thành", cta: "Ôn lại", tone: "success" },
  locked: { label: "Đang khóa", cta: "Bị khóa", tone: "warning" },
};
