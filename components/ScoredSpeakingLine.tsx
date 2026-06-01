"use client";

// One scorable Chinese line in dialogue / roleplay. Phase 2A.8.
//
// Composition: speaker label + ChineseLine (zh + pinyin + vi + speak button)
// + VoicePracticePanel (the existing state-machine voice UX).
//
// Server scoring goes through the existing lib/progress.submitVoiceAttempt
// facade (which calls submit_voice_attempt RPC). No new RPC; no new local
// storage shape — voice records land in KEY_VOICE so the dashboard derives
// dialogue/roleplay completion automatically via computeDashboard().

import ChineseLine from "@/components/ChineseLine";
import VoicePracticePanel from "@/components/VoicePracticePanel";
import { getVoicePracticeRecord } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { VoicePracticeRecord } from "@/lib/types";

export default function ScoredSpeakingLine({
  phraseId,
  lessonId,
  zh,
  pinyin,
  vi,
  audioText,
  speakerLabel,
  /** When true, indicates this line is required for the section to count completed. */
  required = true,
  onSaved,
}: {
  phraseId: string;
  lessonId: string;
  zh: string;
  pinyin?: string;
  vi?: string;
  audioText?: string;
  speakerLabel?: string;
  required?: boolean;
  onSaved?: () => void;
}) {
  const [record, setRecord] = useState<VoicePracticeRecord | undefined>(undefined);

  useEffect(() => {
    setRecord(getVoicePracticeRecord(phraseId));
  }, [phraseId]);

  function refresh() {
    setRecord(getVoicePracticeRecord(phraseId));
    onSaved?.();
  }

  const passed = record?.result === "pass" || record?.result === "manual";

  return (
    <article
      className={`rounded-2xl p-3 shadow-sm ring-1 ${
        passed ? "bg-green-50 ring-green-100" : "bg-white ring-gray-100"
      }`}
      aria-label={speakerLabel ? `Câu của ${speakerLabel}` : "Câu cần đọc"}
    >
      <header className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wide ${
            passed ? "text-green-700" : "text-brand-700"
          }`}
        >
          {speakerLabel ?? "Câu cần đọc"}
          {required ? " · bắt buộc" : ""}
        </span>
        {passed && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-800">
            ✓ Đã đạt {record?.score !== undefined && record?.score !== null ? `${Math.round(record.score)}/100` : ""}
          </span>
        )}
      </header>
      <ChineseLine zh={zh} pinyin={pinyin} vi={vi} size="sm" />
      <div className="mt-2">
        <VoicePracticePanel
          phrase={{ id: phraseId, zh, pinyin, vi, audioText, lessonId }}
          onSaved={refresh}
        />
      </div>
    </article>
  );
}
