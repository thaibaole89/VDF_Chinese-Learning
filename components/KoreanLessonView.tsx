"use client";

// Renders one Korean lesson (phrases + dialogue + roleplay + quiz). Korean
// progress is local-only this phase. Phase 2C.1.4.

import { useEffect, useState } from "react";
import Link from "next/link";
import type { KoLesson } from "@/lib/koreanCourse";
import type { KoVoiceResult } from "@/lib/koreanVoiceScore";
import { getKoLearned, toggleKoLearned, getKoVoicePassed, markKoVoicePassed } from "@/lib/koreanProgress";
import { speakInLang, speechSupported } from "@/lib/speech";
import { koreanLessonVisual } from "@/lib/koreanVisuals";
import { KOREAN_GRAMMAR } from "@/lib/koreanGrammar";
import Visual from "@/components/Visual";
import GrammarTips from "@/components/GrammarTips";
import KoreanPhraseCard from "@/components/KoreanPhraseCard";

function DialogueLine({ speaker, ko, roman, vi, ttsOk }: { speaker: "staff" | "customer"; ko: string; roman: string; vi: string; ttsOk: boolean }) {
  const isStaff = speaker === "staff";
  return (
    <div className={`flex ${isStaff ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isStaff ? "bg-brand-50 text-ink" : "bg-gray-100 text-ink"}`}>
        <div className="text-[11px] font-medium text-gray-500">{isStaff ? "Nhân viên" : "Khách"}</div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="hanzi font-medium">{ko}</span>
          <button onClick={() => speakInLang(ko, "ko-KR")} disabled={!ttsOk} className="shrink-0 text-brand-600 disabled:opacity-40" title="Nghe" aria-label="Nghe">
            🔊
          </button>
        </div>
        <div className="text-[11px] italic text-gray-500">{roman}</div>
        <div className="mt-0.5 text-xs text-gray-600">{vi}</div>
      </div>
    </div>
  );
}

function Quiz({ lesson }: { lesson: KoLesson }) {
  const quiz = lesson.quiz ?? [];
  const [picked, setPicked] = useState<Record<string, string>>({});
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
                    className={`hanzi flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm tap ${cls}`}
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

export default function KoreanLessonView({ lesson }: { lesson: KoLesson }) {
  const [learned, setLearned] = useState<string[]>([]);
  const [voice, setVoice] = useState<string[]>([]);
  const [ttsOk, setTtsOk] = useState(true);

  useEffect(() => {
    setLearned(getKoLearned());
    setVoice(getKoVoicePassed());
    setTtsOk(speechSupported());
  }, []);

  function handleVoiceResult(phraseId: string, result: KoVoiceResult) {
    if (result === "pass" || result === "manual") setVoice(markKoVoicePassed(phraseId));
  }

  const total = lesson.phrases.length;
  const doneCount = lesson.phrases.filter((p) => learned.includes(p.id)).length;

  if (lesson.status === "coming" || lesson.phrases.length === 0) {
    return (
      <div className="space-y-4">
        <header>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Bài học</div>
          <h1 className="text-xl font-bold text-ink">{lesson.titleVi}</h1>
          <p className="hanzi text-sm text-gray-500">{lesson.titleKo}</p>
        </header>
        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
          🚧 Bài học này đang được biên soạn và sẽ sớm có nội dung đầy đủ.
        </div>
        <Link href="/courses/korean" className="block text-center text-sm font-medium text-brand-700">
          ← Về khoá tiếng Hàn
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Visual asset={koreanLessonVisual(lesson.id)} variant="header" rounded priority className="shadow-card" />
      <header>
        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Bài học · <span className="hanzi">{lesson.titleKo}</span></div>
        <h1 className="text-xl font-bold text-ink">{lesson.titleVi}</h1>
        <p className="mt-1 text-sm text-gray-600">{lesson.objectiveVi}</p>
        <div className="mt-2 inline-flex nums rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Đã thuộc {doneCount}/{total} câu
        </div>
        <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
          ⚠️ Tiếng Hàn đang chờ duyệt nội bộ về ngôn ngữ. Tiến độ lưu trên thiết bị này.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500">Câu mẫu</h2>
        {lesson.phrases.map((p, i) => (
          <KoreanPhraseCard
            key={p.id}
            index={i + 1}
            phrase={p}
            done={learned.includes(p.id)}
            voicePassed={voice.includes(p.id)}
            onToggleDone={() => setLearned(toggleKoLearned(p.id))}
            onVoiceResult={(result) => handleVoiceResult(p.id, result)}
          />
        ))}
      </section>

      <GrammarTips tips={KOREAN_GRAMMAR[lesson.id]} cjk />

      {lesson.dialogue && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Hội thoại — {lesson.dialogue.titleVi}</h2>
          <div className="space-y-2 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
            {lesson.dialogue.lines.map((l, i) => (
              <DialogueLine key={i} speaker={l.speaker} ko={l.ko} roman={l.roman} vi={l.vi} ttsOk={ttsOk} />
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
            <p className="mt-2 hanzi text-xs text-gray-500">
              Câu cần dùng:{" "}
              {lesson.roleplay.requiredPhraseIds
                .map((id) => lesson.phrases.find((p) => p.id === id)?.ko)
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </section>
      )}

      <Quiz lesson={lesson} />

      <Link href="/courses/korean" className="block text-center text-sm font-medium text-brand-700">
        ← Về khoá tiếng Hàn
      </Link>
    </div>
  );
}
