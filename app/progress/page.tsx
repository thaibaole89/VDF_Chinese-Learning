"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getProgress,
  getFlashcards,
  getQuizAttempts,
  defaultProgress,
  KEY_PROGRESS,
  KEY_FLASHCARDS,
  KEY_QUIZ,
  KEY_VOICE,
  getVoicePracticeRecords,
  getVoicePracticeSummary,
} from "@/lib/storage";
import { getReviewStats, getDifficultCategories, getLessonById, getDayOneLesson } from "@/lib/content";
import type { ReviewStats, VoicePracticeStore, VoicePracticeSummary } from "@/lib/types";
import ProgressSummary from "@/components/ProgressSummary";
import VoiceGateSummary from "@/components/VoiceGateSummary";
import { APP_VERSION_LABEL } from "@/lib/version";

const CATEGORY_VI: Record<string, string> = {
  documents: "Giấy tờ",
  payment: "Thanh toán",
  price: "Giá & khuyến mãi",
  duty_free: "Miễn thuế",
  out_of_stock: "Hết hàng",
  closing: "Kết thúc",
  greeting: "Chào hỏi",
  day_one_survival: "Câu sống còn",
  khác: "Khác",
};

export default function ProgressPage() {
  const [stats, setStats] = useState<ReviewStats>(() => getReviewStats(defaultProgress(), {}, []));
  const [diff, setDiff] = useState<{ category: string; wrong: number }[]>([]);
  const [lessonIds, setLessonIds] = useState<string[]>([]);
  const [voiceRecords, setVoiceRecords] = useState<VoicePracticeStore>({});
  const [voiceSummary, setVoiceSummary] = useState<VoicePracticeSummary>({ practiced: 0, passed: 0, attempts: 0 });

  function refresh() {
    const p = getProgress();
    const fc = getFlashcards();
    const at = getQuizAttempts();
    setStats(getReviewStats(p, fc, at));
    setDiff(getDifficultCategories(at).slice(0, 5));
    setLessonIds(p.completedLessonIds);
    setVoiceRecords(getVoicePracticeRecords());
    setVoiceSummary(getVoicePracticeSummary());
  }

  useEffect(refresh, []);

  function reset() {
    if (typeof window === "undefined") return;
    if (!window.confirm("Đặt lại toàn bộ tiến độ học?")) return;
    try {
      window.localStorage.removeItem(KEY_PROGRESS);
      window.localStorage.removeItem(KEY_FLASHCARDS);
      window.localStorage.removeItem(KEY_QUIZ);
      window.localStorage.removeItem(KEY_VOICE);
    } catch {
      /* ignore */
    }
    refresh();
  }

  const completedLessons = lessonIds
    .map((id) => ({ id, title: getLessonById(id)?.titleVi }))
    .filter((x) => x.title);

  const dayOnePhrases = getDayOneLesson()?.sentencePatterns ?? [];
  const needVoicePractice = dayOnePhrases.filter((p) => {
    const r = voiceRecords[p.id];
    return r && r.result !== "pass" && r.result !== "manual";
  });

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tiến độ</h1>
      </header>

      <ProgressSummary stats={stats} />

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Câu sống còn đã thuộc</span>
          <span className="font-semibold text-ink">
            {stats.dayOneCompleted}/{stats.dayOneTotal}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Học gần nhất</span>
          <span className="font-semibold text-ink">{stats.lastStudyDate ?? "Chưa học"}</span>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Luyện đọc bằng giọng nói</h2>
        <VoiceGateSummary phraseIds={dayOnePhrases.map((p) => p.id)} records={voiceRecords} target={8} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">{voiceSummary.practiced}</div>
            <div className="text-xs text-gray-500">Đã luyện</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">{voiceSummary.passed}</div>
            <div className="text-xs text-gray-500">Đạt/đã đánh dấu</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">{voiceSummary.attempts}</div>
            <div className="text-xs text-gray-500">Lượt thử</div>
          </div>
        </div>
        {needVoicePractice.length > 0 && (
          <div className="mt-2">
            <div className="mb-1 text-xs font-semibold text-gray-500">Câu cần luyện thêm</div>
            <ul className="space-y-1">
              {needVoicePractice.map((p) => (
                <li key={p.id} className="rounded-xl bg-white p-2 text-sm shadow-sm ring-1 ring-gray-100">
                  <span className="hanzi text-ink">{p.zh}</span>{" "}
                  <span className="text-gray-400">{p.pinyin}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Bài đã hoàn thành ({completedLessons.length})</h2>
        {completedLessons.length ? (
          <ul className="space-y-1">
            {completedLessons.map((l) => (
              <li key={l.id}>
                <Link href={`/lessons/${l.id}`} className="block rounded-xl bg-white p-3 text-sm text-ink shadow-sm ring-1 ring-gray-100 tap">
                  ✓ {l.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Chưa có bài nào được đánh dấu hoàn thành.</p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Chủ đề hay sai nhất</h2>
        {diff.length ? (
          <ul className="space-y-1">
            {diff.map((d) => (
              <li
                key={d.category}
                className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-gray-100"
              >
                <span className="text-ink">{CATEGORY_VI[d.category] ?? d.category}</span>
                <span className="text-red-600">{d.wrong} câu sai</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Chưa đủ dữ liệu — hãy làm vài câu kiểm tra.</p>
        )}
      </section>

      <button
        onClick={reset}
        className="w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-500 tap"
      >
        Đặt lại tiến độ
      </button>

      <div className="pt-2 text-center text-[11px] text-gray-400">
        <Link href="/about" className="underline">
          Giới thiệu · Phản hồi
        </Link>
        <span className="mx-1">·</span>
        {APP_VERSION_LABEL}
      </div>
    </div>
  );
}
