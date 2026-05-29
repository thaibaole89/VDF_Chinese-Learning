"use client";

import type { SentencePattern } from "@/lib/types";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import NoteVi from "./NoteVi";

export default function SentencePatternCard({
  item,
  hard,
  onToggleHard,
}: {
  item: SentencePattern;
  hard?: boolean;
  onToggleHard?: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="hanzi text-2xl font-semibold leading-snug text-ink">{item.zh}</div>
          <div className="mt-1 text-base text-gray-500">{item.pinyin}</div>
          <div className="mt-1 text-base text-ink">{item.vi}</div>
        </div>
        <SpeakButton text={item.audioText ?? item.zh} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />
        <RiskBadge riskLevel={item.riskLevel} />
      </div>
      {item.usageVi && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Khi dùng: </span>
          {item.usageVi}
        </p>
      )}
      <NoteVi note={item.noteVi} />
      {onToggleHard && (
        <button
          onClick={() => onToggleHard(item.id)}
          className={`mt-3 rounded-full px-3 py-1.5 text-sm font-medium tap ${
            hard ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {hard ? "★ Đang đánh dấu khó" : "☆ Đánh dấu khó"}
        </button>
      )}
    </div>
  );
}
