"use client";

// Renders one English lesson and drives server-backed progress (Phase 2C.2).
//
// Progress source of truth is Supabase (passed in as initialLearned /
// initialVoice from the server component). Every change is written via a server
// action AND mirrored to localStorage. If the server is unavailable (serverOk
// false) or a write fails, the view falls back to local-only and shows a
// warning so the learner knows their progress is on this device only.

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EnLesson } from "@/lib/englishCourse";
import type { EnVoiceResult } from "@/lib/englishVoiceScore";
import {
  getEnLearned,
  getEnVoicePassed,
  writeEnLearned,
  writeEnVoicePassed,
} from "@/lib/courses";
import {
  markEnglishPhraseLearned,
  submitEnglishVoiceAttempt,
  submitEnglishQuizAttempt,
} from "@/lib/englishActions";
import { speakInLang, speechSupported } from "@/lib/speech";
import { englishLessonVisual } from "@/lib/englishVisuals";
import Visual from "@/components/Visual";
import EnglishPhraseCard from "@/components/EnglishPhraseCard";

function DialogueLine({ speaker, en, vi, ttsOk }: { speaker: "staff" | "customer"; en: string; vi: string; ttsOk: boolean }) {
  const isStaff = speaker === "staff";
  return (
    <div className={`flex ${isStaff ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isStaff ? "bg-brand-50 text-ink" : "bg-gray-100 text-ink"}`}>
        <div className="text-[11px] font-medium text-gray-500">{isStaff ? "Nhân viên" : "Khách"}</div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-medium">{en}</span>
          <button
            onClick={() => speakInLang(en, "en")}
            disabled={!ttsOk}
            className="shrink-0 text-brand-600 disabled:opacity-40"
            title="Nghe"
            aria-label="Nghe"
          >
            🔊
          </button>
        </div>
        <div className="mt-0.5 text-xs text-gray-600">{vi}</div>
      </div>
    </div>
  );
}

function Quiz({ lesson, onComplete }: { lesson: EnLesson; onComplete: (correct: number, total: number) => void }) {
  const quiz = lesson.quiz ?? [];
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (quiz.length === 0 || submitted) return;
    const answered = quiz.filter((q) => picked[q.id]);
    if (answered.length === quiz.length) {
      const correct = quiz.filter((q) => picked[q.id] === q.correctAnswer).length;
      setSubmitted(true);
      onComplete(correct, quiz.length);
    }
  }, [picked, quiz, submitted, onComplete]);

  if (quiz.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500">Kiểm tra nhanh</h2>
      {quiz.map((q) => {
        const sel = picked[q.id];
        return (
          <div key={q.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
            <p className="text-sm font-medium text-ink">{q.promptVi}</p>
            <div className="mt-2 space-y-2">
              {q.options.map((opt) => {
                const isSel = sel === opt;
                const isCorrect = opt === q.correctAnswer;
                let cls = "border-gray-200 bg-white text-ink";
                if (sel) {
                  if (isCorrect) cls = "border-green-300 bg-green-50 text-green-800";
                  else if (isSel) cls = "border-red-300 bg-red-50 text-red-800";
                  else cls = "border-gray-200 bg-white text-gray-400";
                }
                return (
                  <button
                    key={opt}
                    disabled={!!sel}
                    onClick={() => setPicked((p) => ({ ...p, [q.id]: opt }))}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm tap ${cls}`}
                  >
                    <span>{opt}</span>
                    {sel && isCorrect && <span>✓</span>}
                    {sel && isSel && !isCorrect && <span>✗</span>}
                  </button>
                );
              })}
            </div>
            {sel && q.explanationVi && <p className="mt-2 text-xs text-gray-500">{q.explanationVi}</p>}
          </div>
        );
      })}
    </section>
  );
}

export default function EnglishLessonView({
  lesson,
  serverOk,
  initialLearned,
  initialVoice,
}: {
  lesson: EnLesson;
  serverOk: boolean;
  initialLearned: string[];
  initialVoice: string[];
}) {
  const [learned, setLearned] = useState<string[]>([]);
  const [voice, setVoice] = useState<string[]>([]);
  const [ttsOk, setTtsOk] = useState(true);
  const [localOnly, setLocalOnly] = useState(!serverOk);

  // Hydrate: server-truth when available, else the local mirror (offline fallback).
  useEffect(() => {
    if (serverOk) {
      setLearned(initialLearned);
      setVoice(initialVoice);
    } else {
      setLearned(getEnLearned());
      setVoice(getEnVoicePassed());
      setLocalOnly(true);
    }
    setTtsOk(speechSupported());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function mirrorLearned(next: string[]) {
    setLearned(next);
    writeEnLearned(next);
  }
  function mirrorVoice(next: string[]) {
    setVoice(next);
    writeEnVoicePassed(next);
  }

  async function toggleLearned(phraseId: string) {
    const isOn = learned.includes(phraseId);
    const next = isOn ? learned.filter((x) => x !== phraseId) : [...learned, phraseId];
    mirrorLearned(next); // optimistic + local mirror
    const res = await markEnglishPhraseLearned(lesson.id, phraseId, !isOn);
    if (!res.ok) setLocalOnly(true);
  }

  async function handleVoiceResult(phraseId: string, result: EnVoiceResult, score: number | null) {
    if (result === "pass" || result === "manual") {
      if (!voice.includes(phraseId)) mirrorVoice([...voice, phraseId]);
    }
    const res = await submitEnglishVoiceAttempt(lesson.id, phraseId, result, score);
    if (!res.ok) setLocalOnly(true);
  }

  async function handleQuizComplete(correct: number, total: number) {
    const res = await submitEnglishQuizAttempt(lesson.id, correct, total);
    if (!res.ok) setLocalOnly(true);
  }

  const total = lesson.phrases.length;
  const doneCount = lesson.phrases.filter((p) => learned.includes(p.id)).length;

  if (lesson.status === "coming" || lesson.phrases.length === 0) {
    return (
      <div className="space-y-4">
        <header>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Bài học</div>
          <h1 className="text-xl font-bold text-ink">{lesson.titleVi}</h1>
          <p className="text-sm text-gray-500">{lesson.titleEn}</p>
        </header>
        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
          🚧 Bài học này đang được biên soạn và sẽ sớm có nội dung đầy đủ.
        </div>
        <Link href="/courses/english" className="block text-center text-sm font-medium text-brand-700">
          ← Về khoá tiếng Anh
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Visual asset={englishLessonVisual(lesson.id)} variant="header" rounded priority className="shadow-card" />
      <header>
        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Bài học · {lesson.titleEn}</div>
        <h1 className="text-xl font-bold text-ink">{lesson.titleVi}</h1>
        <p className="mt-1 text-sm text-gray-600">{lesson.objectiveVi}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex nums rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            Đã thuộc {doneCount}/{total} câu
          </span>
          {doneCount >= total && total > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">✓ Hoàn thành</span>
          )}
        </div>
        {localOnly && (
          <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 ring-1 ring-amber-100">
            ⚠️ Đang lưu tiến độ trên thiết bị này (chưa đồng bộ máy chủ). Tiến độ vẫn được giữ trên máy.
          </p>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500">Câu mẫu</h2>
        {lesson.phrases.map((p, i) => (
          <EnglishPhraseCard
            key={p.id}
            index={i + 1}
            phrase={p}
            done={learned.includes(p.id)}
            voicePassed={voice.includes(p.id)}
            onToggleDone={() => toggleLearned(p.id)}
            onVoiceResult={(result, score) => handleVoiceResult(p.id, result, score)}
          />
        ))}
      </section>

      {lesson.dialogue && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Hội thoại — {lesson.dialogue.titleVi}</h2>
          <div className="space-y-2 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
            {lesson.dialogue.lines.map((l, i) => (
              <DialogueLine key={i} speaker={l.speaker} en={l.en} vi={l.vi} ttsOk={ttsOk} />
            ))}
          </div>
        </section>
      )}

      {lesson.roleplay && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Đóng vai — {lesson.roleplay.titleVi}</h2>
          <div className="rounded-2xl bg-white p-4 text-sm shadow-card ring-1 ring-gray-100">
            <p>
              <b>Khách:</b> {lesson.roleplay.customerGoalVi}
            </p>
            <p className="mt-1">
              <b>Bạn:</b> {lesson.roleplay.staffGoalVi}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Câu cần dùng:{" "}
              {lesson.roleplay.requiredPhraseIds
                .map((id) => lesson.phrases.find((p) => p.id === id)?.en)
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </section>
      )}

      <Quiz lesson={lesson} onComplete={handleQuizComplete} />

      <Link href="/courses/english" className="block text-center text-sm font-medium text-brand-700">
        ← Về khoá tiếng Anh
      </Link>
    </div>
  );
}
