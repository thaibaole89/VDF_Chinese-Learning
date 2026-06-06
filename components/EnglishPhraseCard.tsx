"use client";

// One English phrase card. Phase 2C.1 (upgraded).
//
// English text (big) + IPA (the pronunciation standard — shown clearly under
// the phrase) + Vietnamese meaning + VN-learner pronunciation tips + optional
// stress pattern, vocab breakdown and replaceable slots. Two actions: "Nghe"
// (en-US TTS via speakInLang) and "Luyện phát âm" (toggles EnglishVoicePractice
// — en-US STT + word-level scoring). Plus a local "Đã thuộc" toggle.

import { useEffect, useState } from "react";
import { speakInLang, speechSupported } from "@/lib/speech";
import EnglishVoicePractice from "@/components/EnglishVoicePractice";
import type { EnPhrase } from "@/lib/englishCourse";

export default function EnglishPhraseCard({
  index,
  phrase,
  done,
  voicePassed,
  onToggleDone,
  onVoicePassed,
}: {
  index: number;
  phrase: EnPhrase;
  done: boolean;
  voicePassed: boolean;
  onToggleDone: () => void;
  onVoicePassed: () => void;
}) {
  const [ttsOk, setTtsOk] = useState(true);
  const [practice, setPractice] = useState(false);
  useEffect(() => setTtsOk(speechSupported()), []);

  return (
    <div className={`rounded-2xl p-4 shadow-card ring-1 ${done ? "bg-green-50 ring-green-100" : "bg-white ring-gray-100"}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {index}
        </span>
        {voicePassed && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">🎙️ Đạt phát âm</span>
        )}
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-ink">{phrase.en}</div>
          {/* IPA — clearly shown under the phrase */}
          <div className="mt-1 font-mono text-sm text-brand-700">
            IPA <span className="text-gray-700">{phrase.ipa}</span>
          </div>
          <div className="mt-1 text-sm text-gray-700">{phrase.vi}</div>
        </div>
        <button
          onClick={() => speakInLang(phrase.en, "en")}
          disabled={!ttsOk}
          title={ttsOk ? "Nghe phát âm tiếng Anh" : "Trình duyệt không hỗ trợ đọc"}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 tap disabled:opacity-50"
        >
          <span aria-hidden>🔊</span> Nghe
        </button>
      </div>

      {phrase.stress && (
        <p className="mt-2 text-xs text-gray-500">
          Trọng âm: <span className="font-medium text-gray-700">{phrase.stress}</span>
        </p>
      )}

      {phrase.pronTips && phrase.pronTips.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {phrase.pronTips.map((t, i) => (
            <li key={i} className="text-xs text-gray-600">
              • {t}
            </li>
          ))}
        </ul>
      )}

      {phrase.vocab && phrase.vocab.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {phrase.vocab.map((v) => (
            <span key={v.word} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
              <b>{v.word}</b> <span className="font-mono text-gray-500">{v.ipa}</span> — {v.vi}
            </span>
          ))}
        </div>
      )}

      {phrase.replaceable && phrase.replaceable.length > 0 && (
        <div className="mt-2 space-y-1">
          {phrase.replaceable.map((r, i) => (
            <p key={i} className="text-xs text-gray-600">
              Thay {r.slotVi}: {r.alts.map((a) => `${a.en} (${a.vi})`).join(", ")}
            </p>
          ))}
        </div>
      )}

      {phrase.usageVi && <p className="mt-2 text-xs text-gray-500">{phrase.usageVi}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setPractice((v) => !v)}
          className="flex-1 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 tap"
        >
          🎙️ {practice ? "Ẩn luyện phát âm" : "Luyện phát âm"}
        </button>
        <button
          onClick={onToggleDone}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold tap ${
            done ? "bg-green-600 text-white" : "bg-brand-600 text-white"
          }`}
        >
          {done ? "✓ Đã thuộc" : "Đánh dấu thuộc"}
        </button>
      </div>

      {practice && (
        <EnglishVoicePractice
          phraseId={phrase.id}
          importantWords={phrase.importantWords}
          passed={voicePassed}
          onPassed={onVoicePassed}
        />
      )}
    </div>
  );
}
