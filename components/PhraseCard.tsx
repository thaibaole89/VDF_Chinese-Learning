"use client";

import type { ContentStatus, RiskLevel } from "@/lib/types";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import NoteVi from "./NoteVi";

export default function PhraseCard({
  zh,
  pinyin,
  vi,
  usageVi,
  note,
  audioText,
  status,
  riskLevel,
  index,
  done,
  onToggleDone,
}: {
  zh: string;
  pinyin: string;
  vi: string;
  usageVi?: string;
  note?: string;
  audioText?: string;
  status?: ContentStatus;
  riskLevel?: RiskLevel;
  index?: number;
  done?: boolean;
  onToggleDone?: () => void;
}) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${done ? "ring-green-200" : "ring-gray-100"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {typeof index === "number" && (
            <div className="mb-1 text-xs font-semibold text-brand-600">Câu {index}</div>
          )}
          <div className="hanzi text-3xl font-semibold leading-snug text-ink">{zh}</div>
          <div className="mt-1 text-base text-gray-500">{pinyin}</div>
          <div className="mt-1 text-base text-ink">{vi}</div>
        </div>
        <SpeakButton text={audioText ?? zh} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        <RiskBadge riskLevel={riskLevel} />
      </div>
      {usageVi && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Khi dùng: </span>
          {usageVi}
        </p>
      )}
      <NoteVi note={note} />
      {onToggleDone && (
        <button
          onClick={onToggleDone}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold tap ${
            done ? "bg-green-100 text-green-800" : "bg-brand-600 text-white"
          }`}
        >
          {done ? "✓ Đã thuộc câu này" : "Tôi đã thuộc câu này"}
        </button>
      )}
    </div>
  );
}
