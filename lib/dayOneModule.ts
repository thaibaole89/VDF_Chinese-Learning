// Day-One module shape + status helpers shared by the dashboard and the 4
// sub-routes. Phase 2A.6 (initial) → Phase 2A.8 (voice-based completion).
//
// IMPORTANT: phrase-learning count is sourced from local progress
// (vdf_chinese_progress.completedPhraseIds) for fast UI; SERVER is the source
// of truth for certificate eligibility (see lib/dayOneEligibility.ts running
// on /account server-side).
//
// 2A.8 change: dialogue/roleplay completion is now derived from the
// per-phrase voice records (KEY_VOICE) — NOT from learner self-mark. Each
// required staff line must have a voice attempt with result IN (pass, manual).

import { getDayOneLesson } from "@/lib/content";
import type { VoicePracticeStore } from "@/lib/types";
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
    passedRequired: number;
    totalRequired: number;
    status: SectionStatus;
  };
  roleplay: {
    passedRequired: number;
    totalRequired: number;
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

// ---------- Day-One phrase lookups ----------

/** Returns the Day-One phrase IDs (10 ids from content). Stable across builds. */
export function dayOnePhraseIds(): string[] {
  const lesson = getDayOneLesson();
  return (lesson?.sentencePatterns ?? []).map((p) => p.id);
}

type PhraseRow = { id: string; zh: string; pinyin?: string; vi?: string; audioText?: string };

function dayOnePhraseRows(): PhraseRow[] {
  const lesson = getDayOneLesson();
  return (lesson?.sentencePatterns ?? []).map((p) => ({
    id: p.id,
    zh: p.zh,
    pinyin: p.pinyin,
    vi: p.vi,
    audioText: p.audioText,
  }));
}

/**
 * Find the Day-One phrase row whose Chinese text exactly matches `zh`.
 * Returns null if no exact match. Used to decide which dialogue staff lines
 * and which roleplay required-phrase entries can be scored by the existing
 * submit_voice_attempt RPC (which requires phrase_id to exist in
 * public.phrases — that table is seeded from Day-One sentencePatterns only).
 *
 * Concatenated dialogue lines (e.g. "A.B" where A and B are two separate
 * phrases) will NOT match — they're displayed as context, not scored.
 */
export function matchDayOnePhraseRow(zh: string): PhraseRow | null {
  if (!zh) return null;
  const rows = dayOnePhraseRows();
  return rows.find((r) => r.zh === zh) ?? null;
}

// ---------- Required staff-line IDs for dialogue + roleplay ----------

/**
 * Returns the phrase IDs that gate dialogue completion: each staff turn whose
 * Chinese text matches a Day-One phrase row. Unmatched (concatenated) lines
 * are intentionally excluded — they show as context with no scoring.
 */
export function getDayOneDialogueRequiredPhraseIds(): string[] {
  const lesson = getDayOneLesson();
  const ids: string[] = [];
  for (const d of lesson?.dialogues ?? []) {
    for (const line of d.lines ?? []) {
      if (line.speaker !== "staff") continue;
      const row = matchDayOnePhraseRow(line.zh);
      if (row && !ids.includes(row.id)) ids.push(row.id);
    }
  }
  return ids;
}

/**
 * Returns the phrase IDs that gate roleplay completion: each entry in any
 * roleplay's requiredPhrases array that matches a Day-One phrase row.
 */
export function getDayOneRoleplayRequiredPhraseIds(): string[] {
  const lesson = getDayOneLesson();
  const ids: string[] = [];
  for (const r of lesson?.roleplays ?? []) {
    for (const zh of r.requiredPhrases ?? []) {
      const row = matchDayOnePhraseRow(zh);
      if (row && !ids.includes(row.id)) ids.push(row.id);
    }
  }
  return ids;
}

// ---------- Dashboard snapshot ----------

function isPassed(rec: { result?: string } | undefined): boolean {
  return rec?.result === "pass" || rec?.result === "manual";
}

/**
 * Build the dashboard snapshot from local data only. Server reconciles cert
 * eligibility on /account; this drives in-module UI state.
 */
export function computeDashboard(args: {
  completedPhraseIds: string[];
  voiceRecords: VoicePracticeStore;
  module: DayOneModuleProgress;
}): DayOneDashboardSnapshot {
  const phraseIds = dayOnePhraseIds();
  const phraseTotal = phraseIds.length;
  const learned = phraseIds.filter((id) => args.completedPhraseIds.includes(id)).length;
  const phrasesStatus: SectionStatus =
    learned === 0 ? "not_started" : learned >= phraseTotal ? "completed" : "in_progress";

  const dlgReq = getDayOneDialogueRequiredPhraseIds();
  const rpReq = getDayOneRoleplayRequiredPhraseIds();
  const dlgPassed = dlgReq.filter((id) => isPassed(args.voiceRecords[id])).length;
  const rpPassed = rpReq.filter((id) => isPassed(args.voiceRecords[id])).length;

  function deriveSectionStatus(
    passed: number,
    total: number,
    startedAt: string | null
  ): SectionStatus {
    if (total > 0 && passed >= total) return "completed";
    if (passed > 0 || startedAt) return "in_progress";
    return "not_started";
  }
  const dialogueStatus = deriveSectionStatus(dlgPassed, dlgReq.length, args.module.dialogue.startedAt);
  const roleplayStatus = deriveSectionStatus(rpPassed, rpReq.length, args.module.roleplay.startedAt);

  // Quiz lock rule: ALL of
  //   1. learned phrases >= 10 (all of them)
  //   2. dialogue required staff lines all voice-passed (or manual)
  //   3. roleplay required staff lines all voice-passed (or manual)
  const unmet: string[] = [];
  if (learned < phraseTotal) unmet.push(`Học đủ ${phraseTotal} câu (đang ${learned}/${phraseTotal})`);
  if (dlgReq.length === 0) {
    // No scorable dialogue lines — defensive, shouldn't happen for Day-One.
    unmet.push("Hoàn thành phần Luyện hội thoại");
  } else if (dlgPassed < dlgReq.length) {
    unmet.push(`Đọc đạt ${dlgReq.length} câu nhân viên trong hội thoại (đang ${dlgPassed}/${dlgReq.length})`);
  }
  if (rpReq.length === 0) {
    unmet.push("Hoàn thành phần Đóng vai");
  } else if (rpPassed < rpReq.length) {
    unmet.push(`Đọc đạt ${rpReq.length} câu bắt buộc trong đóng vai (đang ${rpPassed}/${rpReq.length})`);
  }
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
    phrases: { learned, total: phraseTotal, status: phrasesStatus },
    dialogue: { passedRequired: dlgPassed, totalRequired: dlgReq.length, status: dialogueStatus },
    roleplay: { passedRequired: rpPassed, totalRequired: rpReq.length, status: roleplayStatus },
    quiz: { unlocked, lastScore, status: quizStatus, passed, unmet },
  };
}

export const STATUS_COPY: Record<SectionStatus, { label: string; cta: string; tone: "neutral" | "info" | "success" | "warning" }> = {
  not_started: { label: "Chưa bắt đầu", cta: "Bắt đầu", tone: "neutral" },
  in_progress: { label: "Đang học", cta: "Tiếp tục", tone: "info" },
  completed: { label: "Hoàn thành", cta: "Ôn lại", tone: "success" },
  locked: { label: "Đang khóa", cta: "Bị khóa", tone: "warning" },
};
