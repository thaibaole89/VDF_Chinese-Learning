"use client";

import type { ContentStatus, RiskLevel } from "@/lib/types";
import ChineseLine from "./ChineseLine";

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
      {typeof index === "number" && (
        <div className="mb-1 text-xs font-semibold text-brand-600">Câu {index}</div>
      )}
      <ChineseLine
        zh={zh}
        pinyin={pinyin}
        vi={vi}
        audioText={audioText}
        status={status}
        riskLevel={riskLevel}
        noteVi={note}
        size="lg"
      />
      {usageVi && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Khi dùng: </span>
          {usageVi}
        </p>
      )}
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
