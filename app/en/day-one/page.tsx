"use client";

// /en/day-one — English Day-One Survival. Phase 2C.1.
// Learn / listen (en-US TTS) / read (VN-friendly phonetic) / quiz. Progress is
// local-only this phase (server sync + voice scoring for English come later).

import Link from "next/link";
import { useEffect, useState } from "react";
import { EN_DAY_ONE_PHRASES, EN_DAY_ONE_QUIZ } from "@/lib/enDayOne";
import { getEnDayOneLearned, toggleEnDayOneLearned } from "@/lib/courses";
import { speakInLang } from "@/lib/speech";
import EnglishPhraseCard from "@/components/EnglishPhraseCard";

export default function EnglishDayOnePage() {
  const [learned, setLearned] = useState<string[]>([]);

  useEffect(() => {
    setLearned(getEnDayOneLearned());
  }, []);

  const total = EN_DAY_ONE_PHRASES.length;
  const done = EN_DAY_ONE_PHRASES.filter((p) => learned.includes(p.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  function toggle(id: string) {
    setLearned(toggleEnDayOneLearned(id));
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/courses" className="text-sm text-brand-600">
          ← Khoá học
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🇬🇧
          </span>
          <h1 className="text-xl font-bold text-ink">English Day-One — 10 câu sống còn</h1>
        </div>
        <p className="text-sm text-gray-500">
          10 câu tiếng Anh cốt lõi để xử lý một giao dịch cơ bản tại quầy.
        </p>
      </header>

      {/* Sticky progress */}
      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Đã thuộc {done}/{total}
          </span>
          <span className="text-gray-400">{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <section className="space-y-3">
        {EN_DAY_ONE_PHRASES.map((p, i) => (
          <EnglishPhraseCard
            key={p.id}
            index={i + 1}
            en={p.en}
            phonetic={p.phonetic}
            vi={p.vi}
            usageVi={p.usageVi}
            noteVi={p.noteVi}
            riskLevel={p.riskLevel}
            done={learned.includes(p.id)}
            onToggleDone={() => toggle(p.id)}
          />
        ))}
      </section>

      {/* Quiz */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500">Kiểm tra nhanh</h2>
        {EN_DAY_ONE_QUIZ.map((q) => (
          <EnQuizCard key={q.id} q={q} />
        ))}
      </section>

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Nội dung tiếng Anh đang ở trạng thái <strong>chờ duyệt</strong>. Phần luyện nói có chấm điểm
        cho tiếng Anh sẽ được bổ sung ở bản sau. Tiến độ tiếng Anh hiện lưu trên thiết bị này.
      </p>

      <Link
        href="/courses"
        className="block rounded-xl bg-white p-3 text-center text-sm font-medium text-brand-700 shadow-card ring-1 ring-brand-100 tap-card"
      >
        ← Về danh sách khoá học
      </Link>
    </div>
  );
}

function EnQuizCard({
  q,
}: {
  q: { id: string; promptVi: string; options: string[]; correctAnswer: string; explanationVi?: string };
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const submitted = picked !== null;
  const correct = picked === q.correctAnswer;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
      <p className="text-sm font-medium text-gray-700">{q.promptVi}</p>
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const isAnswer = submitted && opt === q.correctAnswer;
          const isWrongPick = submitted && picked === opt && opt !== q.correctAnswer;
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setPicked(opt)}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-base tap ${
                isAnswer
                  ? "border-green-400 bg-green-50"
                  : isWrongPick
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-ink">{opt}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  speakInLang(opt, "en");
                }}
                className="shrink-0 text-brand-600"
                aria-label="Nghe"
              >
                🔊
              </span>
            </button>
          );
        })}
      </div>
      {submitted && (
        <div className={`mt-3 rounded-xl p-3 text-sm ${correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          <div className="font-semibold">{correct ? "✓ Chính xác" : "✗ Chưa đúng"}</div>
          {!correct && (
            <div className="mt-1">
              Đáp án: <span className="font-medium">{q.correctAnswer}</span>
            </div>
          )}
          {q.explanationVi && <div className="mt-1 text-gray-600">{q.explanationVi}</div>}
        </div>
      )}
    </div>
  );
}
