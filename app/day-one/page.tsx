"use client";

// Day-One module dashboard. Phase 2A.6.
//
// Linear page (Phase 1B) → module hub with 4 cards. Each card is the entry to
// a dedicated subroute (/day-one/{phrases,dialogue,roleplay,quiz}). Quiz is
// locked until phrases=10/10 + dialogue completed + roleplay completed.

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDayOneLesson } from "@/lib/content";
import {
  getProgress,
  getDayOneModuleProgress,
  getVoicePracticeRecords,
  type DayOneModuleProgress,
} from "@/lib/storage";
import {
  computeDashboard,
  DAY_ONE_QUIZ_PASS_SCORE,
  type DayOneDashboardSnapshot,
} from "@/lib/dayOneModule";
import Visual from "@/components/Visual";
import { getVisualForCategory } from "@/lib/visuals";
import DayOneModuleCard from "@/components/DayOneModuleCard";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";

export default function DayOneDashboardPage() {
  const lesson = getDayOneLesson();
  const [snapshot, setSnapshot] = useState<DayOneDashboardSnapshot | null>(null);

  useEffect(() => {
    const refresh = () => {
      const progress = getProgress();
      const moduleProgress: DayOneModuleProgress = getDayOneModuleProgress();
      const voiceRecords = getVoicePracticeRecords();
      setSnapshot(
        computeDashboard({
          completedPhraseIds: progress.completedPhraseIds,
          voiceRecords,
          module: moduleProgress,
        })
      );
    };
    refresh();
    // Re-read when the tab regains focus (user finished a section then comes back).
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  if (!lesson) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>
      </div>
    );
  }

  // SSR-safe placeholders before useEffect runs (avoids a blank flash).
  const s: DayOneDashboardSnapshot =
    snapshot ?? {
      phrases: { learned: 0, total: lesson.sentencePatterns?.length ?? 10, status: "not_started" },
      dialogue: { passedRequired: 0, totalRequired: 4, status: "not_started" },
      roleplay: { passedRequired: 0, totalRequired: 4, status: "not_started" },
      quiz: { unlocked: false, lastScore: null, status: "locked", passed: false, unmet: [
        `Học đủ ${lesson.sentencePatterns?.length ?? 10} câu`,
        "Đọc đạt các câu nhân viên trong hội thoại",
        "Đọc đạt các câu bắt buộc trong đóng vai",
      ] },
    };

  // Overall module progress for the top bar = average of the 4 sections.
  // Dialogue/Roleplay use the actual passed/required ratio so the bar reflects
  // real voice progress (not a coarse 0/0.5/1 step).
  const sectionProgress = [
    s.phrases.learned / Math.max(1, s.phrases.total),
    s.dialogue.totalRequired > 0 ? s.dialogue.passedRequired / s.dialogue.totalRequired : 0,
    s.roleplay.totalRequired > 0 ? s.roleplay.passedRequired / s.roleplay.totalRequired : 0,
    s.quiz.status === "completed" ? 1 : s.quiz.lastScore !== null ? (s.quiz.lastScore / 100) : 0,
  ];
  const overallPct = Math.round((sectionProgress.reduce((a, b) => a + b, 0) / 4) * 100);
  const completedSections = [
    s.phrases.status === "completed",
    s.dialogue.status === "completed",
    s.roleplay.status === "completed",
    s.quiz.status === "completed",
  ].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">{lesson.titleVi}</h1>
        <p className="text-sm text-gray-500">{lesson.objectiveVi}</p>
        <div className="mt-3">
          <Visual asset={getVisualForCategory("day_one_survival")} variant="header" priority rounded />
        </div>
      </header>

      {/* Overall progress */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">Hoàn thành mô-đun</span>
          <span className="text-gray-500">
            {completedSections}/4 phần · {overallPct}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Học lần lượt từng phần. Bài kiểm tra cuối mở khoá khi đủ điều kiện.
        </p>
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <SpeechToggle />
        <PinyinToggle />
      </div>

      {/* 4 module cards */}
      <section className="space-y-3" aria-label="Các phần học Day-One">
        <DayOneModuleCard
          href="/day-one/phrases"
          icon="📒"
          title="10 câu phải thuộc trước ca bán hàng"
          subtitle="Học, nghe phát âm và luyện đọc 10 câu cốt lõi."
          progress={s.phrases.learned / Math.max(1, s.phrases.total)}
          progressLabel={`${s.phrases.learned}/${s.phrases.total} câu`}
          status={s.phrases.status}
        />
        <DayOneModuleCard
          href="/day-one/dialogue"
          icon="💬"
          title="Luyện hội thoại"
          subtitle="Đọc đạt các câu nhân viên trong hội thoại mẫu."
          progress={s.dialogue.totalRequired > 0 ? s.dialogue.passedRequired / s.dialogue.totalRequired : 0}
          progressLabel={
            s.dialogue.totalRequired > 0
              ? `${s.dialogue.passedRequired}/${s.dialogue.totalRequired} câu đạt`
              : "—"
          }
          status={s.dialogue.status}
        />
        <DayOneModuleCard
          href="/day-one/roleplay"
          icon="🎭"
          title="Đóng vai"
          subtitle="Đọc đạt các câu bắt buộc cho tình huống tại quầy."
          progress={s.roleplay.totalRequired > 0 ? s.roleplay.passedRequired / s.roleplay.totalRequired : 0}
          progressLabel={
            s.roleplay.totalRequired > 0
              ? `${s.roleplay.passedRequired}/${s.roleplay.totalRequired} câu đạt`
              : "—"
          }
          status={s.roleplay.status}
        />
        <DayOneModuleCard
          href="/day-one/quiz"
          icon="📝"
          title="Kiểm tra nhanh"
          subtitle={`Bài kiểm tra cuối · cần đạt ${DAY_ONE_QUIZ_PASS_SCORE}/100 để hoàn thành.`}
          progress={s.quiz.status === "completed" ? 1 : s.quiz.lastScore !== null ? s.quiz.lastScore / 100 : 0}
          progressLabel={
            s.quiz.lastScore !== null ? `${s.quiz.lastScore}/100` : s.quiz.unlocked ? "Chưa làm" : "Đang khoá"
          }
          status={s.quiz.status}
          lockedReasons={!s.quiz.unlocked ? s.quiz.unmet : undefined}
        />
      </section>

      <section className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-100">
        <p className="text-sm font-semibold">📍 Mẹo</p>
        <p className="mt-1">
          Tiến độ ghi cả trên thiết bị và tài khoản. Mở{" "}
          <Link href="/account" className="font-medium text-amber-900 underline">
            Tài khoản
          </Link>{" "}
          để xem chứng nhận Day-One khi đủ điều kiện.
        </p>
      </section>
    </div>
  );
}
