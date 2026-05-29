"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllQuizQuestions } from "@/lib/content";
import { recordQuizAttempt } from "@/lib/storage";
import type { QuizWithContext } from "@/lib/types";
import QuizCard from "@/components/QuizCard";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [deck, setDeck] = useState<QuizWithContext[]>(() => getAllQuizQuestions());
  const [pos, setPos] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Shuffle only after mount to avoid SSR/hydration mismatch.
  useEffect(() => setDeck(shuffle(getAllQuizQuestions())), []);

  const cur = deck[pos];
  const acc = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  function onAnswered(correct: boolean) {
    if (answered || !cur) return;
    setAnswered(true);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordQuizAttempt(cur.id, correct, cur.generatedFrom);
  }
  function next() {
    setAnswered(false);
    setPos((p) => p + 1);
  }
  function restart() {
    setDeck(shuffle(getAllQuizQuestions()));
    setPos(0);
    setAnswered(false);
    setScore({ correct: 0, total: 0 });
  }

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">Kiểm tra</h1>
          <span className="text-sm text-gray-400">
            Điểm: {score.correct}/{score.total} ({acc}%)
          </span>
        </div>
      </header>

      {deck.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có câu hỏi kiểm tra.
        </div>
      ) : cur ? (
        <>
          <div className="text-center text-xs text-gray-400">
            Câu {pos + 1} / {deck.length}
          </div>
          <QuizCard key={cur.id} quiz={cur} onAnswered={onAnswered} />
          {answered && (
            <button
              onClick={next}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap"
            >
              {pos + 1 < deck.length ? "Câu tiếp theo →" : "Xem kết quả"}
            </button>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
          <div className="text-3xl">🎯</div>
          <p className="mt-2 font-semibold text-ink">Hoàn thành!</p>
          <p className="mt-1 text-sm text-gray-500">
            Đúng {score.correct}/{score.total} câu ({acc}%).
          </p>
          <button
            onClick={restart}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white tap"
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
}
