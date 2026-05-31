"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLessonById, getLessonMeta, getDialogueById, getDayOneLesson } from "@/lib/content";
import { getVisualForLesson } from "@/lib/visuals";
import Visual from "@/components/Visual";
import { getProgress, toggleHardItem, getVoicePracticeRecords } from "@/lib/storage";
import { setLessonComplete, recordQuizAttempt, recordQuizSession } from "@/lib/progress";
import VocabularyCard from "@/components/VocabularyCard";
import SentencePatternCard from "@/components/SentencePatternCard";
import DialoguePractice from "@/components/DialoguePractice";
import RoleplayCard from "@/components/RoleplayCard";
import QuizCard from "@/components/QuizCard";
import VoicePracticePanel from "@/components/VoicePracticePanel";
import StatusBadge from "@/components/StatusBadge";
import SpeakButton from "@/components/SpeakButton";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";

export default function LessonDetail({ id }: { id: string }) {
  const lesson = getLessonById(id);
  const meta = getLessonMeta(id);
  const [hard, setHard] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [dayOneVoiceMet, setDayOneVoiceMet] = useState(true);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [quizSession, setQuizSession] = useState({ correct: 0, total: 0, submitted: false });

  useEffect(() => {
    const p = getProgress();
    setHard(p.hardItemIds);
    setCompleted(p.completedLessonIds.includes(id));
    const dayOne = getDayOneLesson();
    const recs = getVoicePracticeRecords();
    const ids = (dayOne?.sentencePatterns ?? []).map((sp) => sp.id);
    const passed = ids.filter((vid) => {
      const r = recs[vid];
      return r && (r.result === "pass" || r.result === "manual");
    }).length;
    setDayOneVoiceMet(ids.length === 0 || passed >= 8);
  }, [id]);

  if (!lesson) {
    return (
      <div className="space-y-3">
        <Link href="/lessons" className="text-sm text-brand-600">
          ← Bài học
        </Link>
        <p className="text-gray-500">Không tìm thấy bài học.</p>
      </div>
    );
  }

  const onToggleHard = (itemId: string) => setHard(toggleHardItem(itemId).hardItemIds);

  function onQuizAnswered(quizId: string, generatedFrom: string | undefined, correct: boolean) {
    recordQuizAttempt(quizId, correct, generatedFrom);
    setQuizSession((s) => {
      const next = {
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
        submitted: s.submitted,
      };
      if (!s.submitted && lesson && (lesson.quizzes?.length ?? 0) > 0 && next.total >= (lesson.quizzes?.length ?? 0)) {
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

  const vocab = lesson.vocabulary ?? [];
  const patterns = lesson.sentencePatterns ?? [];
  const measures = lesson.measureWords ?? [];
  const dialogues = lesson.dialogues ?? [];
  const roleplays = lesson.roleplays ?? [];
  const quizzes = lesson.quizzes ?? [];

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/lessons" className="text-sm text-brand-600">
          ← Bài học
        </Link>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-ink">
            {lesson.titleVi}
            {lesson.titleZh ? (
              <span className="ml-1 hanzi text-base font-normal text-gray-400">{lesson.titleZh}</span>
            ) : null}
          </h1>
          <StatusBadge status={lesson.status} />
        </div>
        <p className="mt-1 text-sm text-gray-500">{lesson.objectiveVi}</p>
        <div className="mt-1 text-xs text-gray-400">
          ⏱ {lesson.estimatedMinutes} phút{meta ? ` · ${meta.courseTitleVi}` : ""}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <SpeechToggle />
          <PinyinToggle />
        </div>
        <div className="mt-3">
          <Visual asset={getVisualForLesson(lesson)} variant="header" priority rounded />
        </div>
      </header>

      {!dayOneVoiceMet && !hintDismissed && lesson.id !== "lesson_day_one_10_phrases" && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-100">
          Nên hoàn thành luyện đọc Day-One trước khi học bài nâng cao.
          <div className="mt-2 flex gap-2">
            <Link
              href="/day-one"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Luyện Day-One
            </Link>
            <button
              onClick={() => setHintDismissed(true)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
            >
              Vẫn tiếp tục học
            </button>
          </div>
        </div>
      )}

      {vocab.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Từ vựng ({vocab.length})</h2>
          {vocab.map((v) => (
            <VocabularyCard key={v.id} item={v} hard={hard.includes(v.id)} onToggleHard={onToggleHard} />
          ))}
        </section>
      )}

      {patterns.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Mẫu câu ({patterns.length})</h2>
          {patterns.map((s) => (
            <div key={s.id} className="space-y-2">
              <SentencePatternCard item={s} hard={hard.includes(s.id)} onToggleHard={onToggleHard} />
              <VoicePracticePanel
                phrase={{ id: s.id, zh: s.zh, pinyin: s.pinyin, vi: s.vi, audioText: s.audioText, lessonId: lesson.id }}
              />
            </div>
          ))}
        </section>
      )}

      {measures.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Lượng từ ({measures.length})</h2>
          {measures.map((w) => (
            <div
              key={w.id}
              className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <div className="min-w-0">
                <div className="hanzi text-3xl font-semibold text-ink">{w.hanzi}</div>
                <div className="text-sm text-gray-500">{w.pinyin}</div>
                <div className="text-sm text-ink">{w.usesForVi}</div>
                {w.examples?.length ? (
                  <ul className="mt-1 space-y-0.5">
                    {w.examples.map((ex, i) => (
                      <li key={i} className="text-xs text-gray-500">
                        <span className="hanzi">{ex.zh}</span> {ex.pinyin}
                        {ex.vi ? ` — ${ex.vi}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <SpeakButton text={w.hanzi} label="" />
            </div>
          ))}
        </section>
      )}

      {dialogues.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Hội thoại</h2>
          {dialogues.map((d) => (
            <DialoguePractice key={d.id} dialogue={d} />
          ))}
        </section>
      )}

      {roleplays.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Đóng vai</h2>
          {roleplays.map((r) => (
            <RoleplayCard key={r.id} roleplay={r} sampleDialogue={getDialogueById(r.sampleDialogueId)} />
          ))}
        </section>
      )}

      {quizzes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500">Kiểm tra ({quizzes.length})</h2>
          {quizzes.map((q) => (
            <QuizCard key={q.id} quiz={q} onAnswered={(c) => onQuizAnswered(q.id, q.generatedFrom, c)} />
          ))}
        </section>
      )}

      <button
        onClick={() => {
          const p = setLessonComplete(id, !completed);
          setCompleted(p.completedLessonIds.includes(id));
        }}
        className={`w-full rounded-xl py-3 text-sm font-semibold tap ${
          completed ? "bg-green-100 text-green-800" : "bg-brand-600 text-white"
        }`}
      >
        {completed ? "✓ Đã hoàn thành — bấm để bỏ" : "Đánh dấu hoàn thành bài"}
      </button>
    </div>
  );
}
