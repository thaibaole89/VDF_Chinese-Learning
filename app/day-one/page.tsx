"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDayOneLesson, getDialogueById } from "@/lib/content";
import { getProgress, getVoicePracticeRecords } from "@/lib/storage";
import { togglePhraseLearned, recordQuizAttempt, recordQuizSession } from "@/lib/progress";
import PhraseCard from "@/components/PhraseCard";
import DialoguePractice from "@/components/DialoguePractice";
import RoleplayCard from "@/components/RoleplayCard";
import QuizCard from "@/components/QuizCard";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import Visual from "@/components/Visual";
import { getVisualForCategory } from "@/lib/visuals";
import VoicePracticePanel from "@/components/VoicePracticePanel";
import VoiceGateSummary from "@/components/VoiceGateSummary";
import type { VoicePracticeStore } from "@/lib/types";

export default function DayOnePage() {
  const lesson = getDayOneLesson();
  const [done, setDone] = useState<string[]>([]);
  const [voiceRecords, setVoiceRecords] = useState<VoicePracticeStore>({});
  const [quizSession, setQuizSession] = useState({ correct: 0, total: 0, submitted: false });

  useEffect(() => {
    setDone(getProgress().completedPhraseIds);
    setVoiceRecords(getVoicePracticeRecords());
  }, []);

  const refreshVoice = () => setVoiceRecords(getVoicePracticeRecords());

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
    setDone(togglePhraseLearned(id).completedPhraseIds);
  }

  function onQuizAnswered(quizId: string, generatedFrom: string | undefined, correct: boolean) {
    recordQuizAttempt(quizId, correct, generatedFrom);
    setQuizSession((s) => {
      const next = {
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
        submitted: s.submitted,
      };
      // Submit the aggregated session score to the server exactly once when
      // the batch is fully answered. Server is best-tracked, so re-submits
      // would be benign — but skipping them keeps the network polite.
      if (!s.submitted && lesson && quizzes.length > 0 && next.total >= quizzes.length) {
        recordQuizSession({
          lessonId: lesson.id,
          correctCount: next.correct,
          totalCount: next.total,
        });
        next.submitted = true;
      }
      return next;
    });
  }

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

      <div className="flex flex-wrap justify-end gap-2">
        <SpeechToggle />
        <PinyinToggle />
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Luyện đọc bằng giọng nói</h2>
        <VoiceGateSummary phraseIds={phrases.map((p) => p.id)} records={voiceRecords} target={8} />
      </section>

      <section className="space-y-3">
        {phrases.map((p, i) => (
          <div key={p.id} className="space-y-2">
            <PhraseCard
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
            <VoicePracticePanel
              phrase={{ id: p.id, zh: p.zh, pinyin: p.pinyin, vi: p.vi, audioText: p.audioText, lessonId: lesson.id }}
              onSaved={refreshVoice}
            />
          </div>
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
              onAnswered={(correct) => onQuizAnswered(q.id, q.generatedFrom, correct)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
