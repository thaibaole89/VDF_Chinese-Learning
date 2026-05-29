"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDayOneLesson, getDialogueById } from "@/lib/content";
import { getProgress, togglePhraseComplete, recordQuizAttempt } from "@/lib/storage";
import PhraseCard from "@/components/PhraseCard";
import DialoguePractice from "@/components/DialoguePractice";
import RoleplayCard from "@/components/RoleplayCard";
import QuizCard from "@/components/QuizCard";

export default function DayOnePage() {
  const lesson = getDayOneLesson();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => setDone(getProgress().completedPhraseIds), []);

  if (!lesson) {
    return <p className="text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const phrases = lesson.sentencePatterns ?? [];
  const dialogue = lesson.dialogues?.[0];
  const roleplay = lesson.roleplays?.[0];
  const quizzes = lesson.quizzes ?? [];
  const completedCount = phrases.filter((p) => done.includes(p.id)).length;
  const pct = phrases.length ? Math.round((completedCount / phrases.length) * 100) : 0;

  function toggle(id: string) {
    setDone(togglePhraseComplete(id).completedPhraseIds);
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">{lesson.titleVi}</h1>
        <p className="text-sm text-gray-500">{lesson.objectiveVi}</p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Đã thuộc {completedCount}/{phrases.length}
          </span>
          <span className="text-gray-400">{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <section className="space-y-3">
        {phrases.map((p, i) => (
          <PhraseCard
            key={p.id}
            index={i + 1}
            zh={p.zh}
            pinyin={p.pinyin}
            vi={p.vi}
            usageVi={p.usageVi}
            note={p.noteVi}
            audioText={p.audioText}
            status={p.status}
            riskLevel={p.riskLevel}
            done={done.includes(p.id)}
            onToggleDone={() => toggle(p.id)}
          />
        ))}
      </section>

      {dialogue && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Luyện hội thoại</h2>
          <DialoguePractice dialogue={dialogue} />
        </section>
      )}

      {roleplay && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Đóng vai</h2>
          <RoleplayCard roleplay={roleplay} sampleDialogue={getDialogueById(roleplay.sampleDialogueId)} />
        </section>
      )}

      {quizzes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Kiểm tra nhanh</h2>
          {quizzes.map((q) => (
            <QuizCard
              key={q.id}
              quiz={q}
              onAnswered={(correct) => recordQuizAttempt(q.id, correct, q.generatedFrom)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
