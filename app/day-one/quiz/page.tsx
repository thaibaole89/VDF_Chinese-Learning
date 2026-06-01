"use client";

// /day-one/quiz — Day-One final test (Phase 2A.6).
//
// Two states:
//   1. LOCKED: prereqs (phrases=10/10, dialogue completed, roleplay completed)
//      not met. Shows a checklist + links back to each unmet section. Cannot
//      be bypassed — even a deep-link visit hits this screen.
//   2. UNLOCKED: real final-test mode. Learner answers ALL questions first
//      (no per-question reveal). Single "Hoàn thành bài kiểm tra" submit
//      computes the score, persists the result locally, and fires the
//      existing recordQuizSession RPC so profiles.best_quiz_score updates.
//
// We deliberately do NOT use the existing QuizCard component because it
// auto-reveals correct/wrong on each pick. A fresh inline question renderer
// keeps the no-spoiler invariant explicit.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDayOneLesson } from "@/lib/content";
import {
  getProgress,
  getDayOneModuleProgress,
  recordDayOneQuizResult,
} from "@/lib/storage";
import { recordQuizSession, recordQuizAttempt } from "@/lib/progress";
import {
  computeDashboard,
  DAY_ONE_LESSON_ID,
  DAY_ONE_QUIZ_PASS_SCORE,
} from "@/lib/dayOneModule";
import { getPinyinFor } from "@/lib/content";
import SpeakButton from "@/components/SpeakButton";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import type { QuizQuestion } from "@/lib/types";

// toneless, space-insensitive comparison for pinyin (mirrors components/QuizCard).
function strip(s: string): string {
  let o = "";
  for (const ch of s.normalize("NFD")) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 0x300 && c <= 0x36f) continue;
    o += ch;
  }
  return o.toLowerCase().replace(/\s+/g, "");
}

type Answer = string;
type AnswerMap = Record<string, Answer>;

function isCorrect(quiz: QuizQuestion, answer: Answer | undefined): boolean {
  if (answer === undefined || answer === "") return false;
  const isText = quiz.type === "fill_pinyin" || quiz.type === "hanzi_to_pinyin";
  return isText
    ? strip(answer) === strip(quiz.correctAnswer)
    : answer === quiz.correctAnswer;
}

export default function DayOneQuizPage() {
  const lesson = getDayOneLesson();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unmet, setUnmet] = useState<string[]>([]);
  const [bestLocalScore, setBestLocalScore] = useState<number | null>(null);

  // Quiz interaction state
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [submittedCorrect, setSubmittedCorrect] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const quizzes: QuizQuestion[] = useMemo(
    () => (lesson?.quizzes ?? []) as QuizQuestion[],
    [lesson]
  );

  // Lock state — derived from local data (server reconciles separately on /account).
  useEffect(() => {
    const refresh = () => {
      const p = getProgress();
      const m = getDayOneModuleProgress();
      const s = computeDashboard({
        completedPhraseIds: p.completedPhraseIds,
        module: m,
      });
      setUnlocked(s.quiz.unlocked);
      setUnmet(s.quiz.unmet);
      setBestLocalScore(m.quiz?.lastScore ?? null);
      setReady(true);
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  // ---------- LOCKED SCREEN ----------
  if (ready && !unlocked) {
    return (
      <div className="space-y-5">
        <DayOneSectionHeader
          section="quiz"
          badge={{ label: "🔒 Đang khoá", tone: "warning" }}
        />
        <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
          <h2 className="text-base font-bold text-amber-900">
            Bài kiểm tra chỉ mở khi đã học xong các phần trước
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            Tránh việc anh/chị xem trước câu hỏi và chỉ học thuộc đáp án — hãy hoàn
            thành các phần học bên dưới rồi quay lại.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {unmet.map((u) => (
              <li
                key={u}
                className="flex items-start gap-2 rounded-xl bg-white/70 p-2.5 ring-1 ring-amber-100"
              >
                <span aria-hidden className="mt-0.5 text-amber-700">•</span>
                <span className="text-amber-900">{u}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Link
              href="/day-one/phrases"
              className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white tap"
            >
              Đi học phần 10 câu →
            </Link>
            <Link
              href="/day-one/dialogue"
              className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-brand-600 ring-1 ring-brand-100 tap"
            >
              Đi luyện hội thoại →
            </Link>
            <Link
              href="/day-one/roleplay"
              className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-brand-600 ring-1 ring-brand-100 tap"
            >
              Đi đóng vai →
            </Link>
          </div>
        </section>
        <DayOneSectionFooter section="quiz" hideNext />
      </div>
    );
  }

  // ---------- UNLOCKED — FINAL TEST ----------

  const submitted = submittedScore !== null;
  const total = quizzes.length;
  const answeredCount = quizzes.filter((q) => isCorrect(q, answers[q.id]) || answers[q.id]).length;
  // Compute "everything is answered" — both text + mcq accept any non-empty string.
  const allAnswered =
    total > 0 &&
    quizzes.every((q) => {
      const a = answers[q.id];
      return typeof a === "string" && a.trim().length > 0;
    });

  function pick(quizId: string, option: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [quizId]: option }));
  }
  function setText(quizId: string, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [quizId]: value }));
  }

  function submit() {
    if (submitted || !allAnswered || submitting) return;
    setSubmitting(true);
    let correct = 0;
    for (const q of quizzes) {
      const ok = isCorrect(q, answers[q.id]);
      if (ok) correct++;
      // Mirror per-attempt log to localStorage (lib/storage). Server best is
      // updated by recordQuizSession below.
      recordQuizAttempt(q.id, ok, q.generatedFrom);
    }
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    // Persist locally so the dashboard sees the result + best.
    recordDayOneQuizResult({ correctCount: correct, totalCount: total });
    // Server: fires the existing RPC — updates profiles.best_quiz_score.
    recordQuizSession({
      lessonId: DAY_ONE_LESSON_ID,
      correctCount: correct,
      totalCount: total,
      quizId: `day_one_final_${Date.now()}`,
    });
    setSubmittedCorrect(correct);
    setSubmittedScore(score);
    setSubmitting(false);
    // Scroll the result panel into view (top of page).
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retake() {
    setAnswers({});
    setSubmittedScore(null);
    setSubmittedCorrect(0);
  }

  const passed = (submittedScore ?? 0) >= DAY_ONE_QUIZ_PASS_SCORE;

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="quiz"
        badge={
          submitted
            ? passed
              ? { label: "✓ Đạt", tone: "success" }
              : { label: "Chưa đạt", tone: "warning" }
            : bestLocalScore !== null && bestLocalScore >= DAY_ONE_QUIZ_PASS_SCORE
              ? { label: `Tốt nhất ${bestLocalScore}/100`, tone: "success" }
              : undefined
        }
      />

      {/* Top banner: not submitted */}
      {!submitted && (
        <section className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-900 ring-1 ring-brand-100">
          <p className="font-semibold">📝 Bài kiểm tra cuối — Day-One</p>
          <p className="mt-1">
            Trả lời <strong>tất cả {total} câu</strong> rồi bấm <strong>Hoàn thành bài kiểm tra</strong>.
            Đáp án chỉ hiện sau khi nộp bài. Cần đạt từ {DAY_ONE_QUIZ_PASS_SCORE}/100 để hoàn thành.
          </p>
          {bestLocalScore !== null && (
            <p className="mt-1 text-xs text-brand-800">
              Lần làm tốt nhất gần nhất: <strong>{bestLocalScore}/100</strong>.
            </p>
          )}
        </section>
      )}

      {/* Top banner: result */}
      {submitted && (
        <section
          className={`rounded-2xl p-5 ring-1 ${
            passed
              ? "bg-green-50 ring-green-100"
              : "bg-amber-50 ring-amber-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white ${
                passed ? "bg-green-500" : "bg-amber-500"
              }`}
              aria-hidden
            >
              {passed ? "✓" : "↻"}
            </div>
            <div className="min-w-0">
              <div className={`text-lg font-bold ${passed ? "text-green-800" : "text-amber-900"}`}>
                {passed ? "Đạt yêu cầu!" : "Chưa đạt — thử lại nhé"}
              </div>
              <div className="text-sm text-gray-700">
                Đúng <strong>{submittedCorrect}/{total}</strong> · Điểm{" "}
                <strong>{submittedScore}/100</strong>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Kết quả đã ghi vào tài khoản (nếu đã đăng nhập). Điểm tốt nhất trong tài khoản
            được giữ — làm lại không làm điểm tốt nhất bị tụt xuống.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={retake}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 ring-1 ring-brand-100 tap"
            >
              Làm lại
            </button>
            <Link
              href="/day-one"
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white tap"
            >
              Về dashboard →
            </Link>
          </div>
        </section>
      )}

      {/* Question list */}
      <section className="space-y-3">
        {quizzes.map((q, idx) => {
          const a = answers[q.id];
          const isText = q.type === "fill_pinyin" || q.type === "hanzi_to_pinyin";
          const isChineseOption = q.type === "choose_reply";
          const correctForThis = submitted ? isCorrect(q, a) : null;

          return (
            <article
              key={q.id}
              className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${
                submitted
                  ? correctForThis
                    ? "ring-green-200"
                    : "ring-red-200"
                  : "ring-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium text-gray-700">
                  <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {idx + 1}
                  </span>
                  {q.promptVi}
                </div>
                {q.audioText && <SpeakButton text={q.audioText} label="Nghe" />}
              </div>

              {q.promptZh && !q.audioText && (
                <div className="mt-2 hanzi text-2xl font-semibold text-ink">{q.promptZh}</div>
              )}

              {q.type === "listening_mcq" && (
                <p className="mt-1 text-xs text-gray-400">Bấm "Nghe" rồi chọn nghĩa đúng.</p>
              )}

              {isText ? (
                <div className="mt-3 flex gap-2">
                  <input
                    value={a ?? ""}
                    onChange={(e) => setText(q.id, e.target.value)}
                    disabled={submitted}
                    placeholder="Nhập pinyin (không cần dấu)"
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-brand-500"
                  />
                </div>
              ) : (
                <div className="mt-3 grid gap-2">
                  {(q.options ?? []).map((opt, i) => {
                    const isPicked = a === opt;
                    const isAnswer = submitted && opt === q.correctAnswer;
                    const isWrongPick = submitted && isPicked && opt !== q.correctAnswer;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={submitted}
                        onClick={() => pick(q.id, opt)}
                        className={`w-full rounded-xl border px-3 py-3 text-left tap ${
                          isAnswer
                            ? "border-green-400 bg-green-50"
                            : isWrongPick
                              ? "border-red-400 bg-red-50"
                              : isPicked
                                ? "border-brand-400 bg-brand-50"
                                : "border-gray-200 bg-white"
                        }`}
                      >
                        <span className={isChineseOption ? "hanzi text-lg text-ink" : "text-base text-ink"}>
                          {opt}
                        </span>
                        {isChineseOption && getPinyinFor(opt) ? (
                          <span className="mt-0.5 block text-xs text-gray-500">{getPinyinFor(opt)}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}

              {submitted && (
                <div
                  className={`mt-3 rounded-xl p-3 text-sm ${
                    correctForThis ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="font-semibold">
                    {correctForThis ? "✓ Chính xác" : "✗ Chưa đúng"}
                  </div>
                  {!correctForThis && (
                    <div className="mt-1">
                      Đáp án: <span className="font-medium">{q.correctAnswer}</span>
                    </div>
                  )}
                  {q.explanationVi && <div className="mt-1 text-gray-700">{q.explanationVi}</div>}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Submit button (only before submission) */}
      {!submitted && (
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã trả lời <strong>{Object.values(answers).filter((v) => typeof v === "string" && v.trim()).length}/{total}</strong>{" "}
              câu.
            </p>
            <button
              onClick={submit}
              disabled={!allAnswered || submitting}
              className="mt-3 w-full rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white tap disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Đang chấm điểm…" : "✓ Hoàn thành bài kiểm tra"}
            </button>
            {!allAnswered && (
              <p className="mt-2 text-xs text-gray-500">Phải trả lời tất cả câu mới nộp được.</p>
            )}
          </div>
        </section>
      )}

      <DayOneSectionFooter section="quiz" hideNext />
    </div>
  );
}
