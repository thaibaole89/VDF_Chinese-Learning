"use client";

import type { SentencePattern } from "@/lib/types";
import ChineseLine from "./ChineseLine";

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
      <ChineseLine
        zh={item.zh}
        pinyin={item.pinyin}
        vi={item.vi}
        audioText={item.audioText}
        status={item.status}
        riskLevel={item.riskLevel}
        noteVi={item.noteVi}
        size="md"
      />
      {item.usageVi && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Khi dùng: </span>
          {item.usageVi}
        </p>
      )}
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
