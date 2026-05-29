"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { getPinyinFor } from "@/lib/content";
import SpeakButton from "./SpeakButton";
import QuizOption from "./QuizOption";

// toneless, space-insensitive comparison for pinyin answers
function strip(s: string): string {
  let o = "";
  for (const ch of s.normalize("NFD")) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 0x300 && c <= 0x36f) continue;
    o += ch;
  }
  return o.toLowerCase().replace(/\s+/g, "");
}

export default function QuizCard({
  quiz,
  onAnswered,
}: {
  quiz: QuizQuestion;
  onAnswered?: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [hint, setHint] = useState(false); // "Xem pinyin" — per-question hint only

  const isText = quiz.type === "fill_pinyin" || quiz.type === "hanzi_to_pinyin";
  const isChinese = quiz.type === "choose_reply";
  const hasChinese = isChinese || !!quiz.promptZh;

  function finish(isCorrect: boolean) {
    setCorrect(isCorrect);
    setSubmitted(true);
    onAnswered?.(isCorrect);
  }
  function choose(opt: string) {
    if (submitted) return;
    setPicked(opt);
    finish(opt === quiz.correctAnswer);
  }
  function submitText() {
    if (submitted || !text.trim()) return;
    finish(strip(text) === strip(quiz.correctAnswer));
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium text-gray-700">{quiz.promptVi}</div>
        {quiz.audioText && <SpeakButton text={quiz.audioText} label="Nghe" />}
      </div>

      {quiz.promptZh && !quiz.audioText && (
        <div className="mt-2">
          <div className="hanzi text-3xl font-semibold text-ink">{quiz.promptZh}</div>
          {hint && getPinyinFor(quiz.promptZh) ? (
            <div className="mt-0.5 text-sm text-gray-500">{getPinyinFor(quiz.promptZh)}</div>
          ) : null}
        </div>
      )}
      {quiz.type === "listening_mcq" && (
        <div className="mt-1 text-xs text-gray-400">Bấm “Nghe” rồi chọn nghĩa đúng.</div>
      )}

      {/* Pinyin hint — only when the question shows Chinese (prompt or options) */}
      {hasChinese && !isText && (
        <button
          onClick={() => setHint((v) => !v)}
          className="mt-2 text-xs font-medium text-brand-600 underline"
        >
          {hint ? "Ẩn pinyin" : "Xem pinyin"}
        </button>
      )}

      {isText ? (
        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitted}
            placeholder="Nhập pinyin (không cần dấu)"
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-brand-500"
          />
          {!submitted && (
            <button onClick={submitText} className="rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white tap">
              Kiểm tra
            </button>
          )}
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {(quiz.options ?? []).map((opt, i) => (
            <QuizOption
              key={i}
              text={opt}
              isChinese={isChinese}
              pinyin={isChinese ? getPinyinFor(opt) : undefined}
              showPinyin={hint}
              state={submitted ? (opt === quiz.correctAnswer ? "correct" : picked === opt ? "wrong" : "idle") : "idle"}
              disabled={submitted}
              onClick={() => choose(opt)}
            />
          ))}
        </div>
      )}

      {submitted && (
        <div className={`mt-3 rounded-xl p-3 text-sm ${correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          <div className="font-semibold">{correct ? "✓ Chính xác" : "✗ Chưa đúng"}</div>
          {!correct && (
            <div className="mt-1">
              Đáp án: <span className="font-medium">{quiz.correctAnswer}</span>
            </div>
          )}
          {quiz.explanationVi && <div className="mt-1 text-gray-600">{quiz.explanationVi}</div>}
        </div>
      )}
    </div>
  );
}
