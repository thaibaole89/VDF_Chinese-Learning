"use client";

import type { VocabularyItem } from "@/lib/types";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import NoteVi from "./NoteVi";

export default function VocabularyCard({
  item,
  hard,
  onToggleHard,
}: {
  item: VocabularyItem;
  hard?: boolean;
  onToggleHard?: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="hanzi text-4xl font-semibold text-ink">{item.hanzi}</div>
          <div className="mt-1 text-base text-gray-500">{item.pinyin}</div>
          <div className="mt-1 text-base text-ink">
            {item.meaningVi}
            {item.meaningEn ? <span className="text-gray-400"> · {item.meaningEn}</span> : null}
          </div>
        </div>
        <SpeakButton text={item.audioText ?? item.hanzi} />
      </div>
      {item.examples?.length ? (
        <ul className="mt-2 space-y-1">
          {item.examples.map((ex, i) => (
            <li key={i} className="text-sm text-gray-600">
              <span className="hanzi">{ex.zh}</span> <span className="text-gray-400">{ex.pinyin}</span>
              {ex.vi ? ` — ${ex.vi}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />
        <RiskBadge riskLevel={item.riskLevel} />
      </div>
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
