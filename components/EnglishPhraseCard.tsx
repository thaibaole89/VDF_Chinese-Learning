"use client";

// One English Day-One phrase. Phase 2C.1.
// Big English text + VN-friendly phonetic + Vietnamese, a "Nghe" button (en-US
// TTS via speakInLang), and a local "Đã thuộc" toggle. No hanzi/pinyin; no voice
// scoring yet (that's a later phase).

import { useEffect, useState } from "react";
import { speakInLang, speechSupported } from "@/lib/speech";
import StatusBadge from "@/components/StatusBadge";

export default function EnglishPhraseCard({
  index,
  en,
  phonetic,
  vi,
  usageVi,
  noteVi,
  riskLevel,
  done,
  onToggleDone,
}: {
  index: number;
  en: string;
  phonetic: string;
  vi: string;
  usageVi?: string;
  noteVi?: string;
  riskLevel?: "safe" | "use_with_care";
  done: boolean;
  onToggleDone: () => void;
}) {
  const [ttsOk, setTtsOk] = useState(true);
  useEffect(() => setTtsOk(speechSupported()), []);

  return (
    <div
      className={`rounded-2xl p-4 shadow-card ring-1 ${
        done ? "bg-green-50 ring-green-100" : "bg-white ring-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {index}
        </span>
        {riskLevel === "use_with_care" && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-800">
            Cần xác nhận
          </span>
        )}
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-ink">{en}</div>
          <div className="mt-0.5 text-sm italic text-gray-500">/ {phonetic} /</div>
          <div className="mt-1 text-sm text-gray-700">{vi}</div>
        </div>
        <button
          onClick={() => speakInLang(en, "en")}
          disabled={!ttsOk}
          title={ttsOk ? "Nghe phát âm (en)" : "Trình duyệt không hỗ trợ đọc"}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 tap disabled:opacity-50"
        >
          <span aria-hidden>🔊</span> Nghe
        </button>
      </div>

      {usageVi && <p className="mt-2 text-xs text-gray-500">{usageVi}</p>}
      {noteVi && <p className="mt-1 text-xs text-orange-700">{noteVi}</p>}

      <button
        onClick={onToggleDone}
        className={`mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold tap ${
          done ? "bg-green-600 text-white" : "bg-brand-600 text-white"
        }`}
      >
        {done ? "✓ Đã thuộc — bấm để bỏ" : "Đánh dấu đã thuộc"}
      </button>
    </div>
  );
}
