"use client";

import { useState } from "react";
import type { FlashItem } from "@/lib/types";
import SpeakButton from "./SpeakButton";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";

// Parent should pass a `key={item.id}` so flip state resets per card.
export default function Flashcard({
  item,
  onGrade,
  onNext,
}: {
  item: FlashItem;
  onGrade: (knewIt: boolean) => void;
  onNext?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="block w-full text-center tap"
        aria-label="Lật thẻ"
      >
        <div className="hanzi text-5xl font-semibold text-ink">{item.zh}</div>
        {!flipped ? (
          <div className="mt-4 text-xs text-gray-400">Bấm để xem nghĩa</div>
        ) : (
          <div className="mt-4">
            <div className="text-lg text-gray-500">{item.pinyin}</div>
            <div className="text-lg text-ink">{item.vi}</div>
            {item.note && <div className="mt-1 text-sm text-gray-500">{item.note}</div>}
          </div>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        <SpeakButton text={item.zh} label="Nghe lại" />
        <StatusBadge status={item.status} />
        <RiskBadge riskLevel={item.riskLevel} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onGrade(false)}
          className="rounded-xl bg-red-100 py-3 text-sm font-semibold text-red-700 tap"
        >
          Khó
        </button>
        <button
          onClick={() => onGrade(true)}
          className="rounded-xl bg-green-100 py-3 text-sm font-semibold text-green-700 tap"
        >
          Biết rồi
        </button>
      </div>
      {onNext && (
        <button
          onClick={onNext}
          className="mt-2 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 tap"
        >
          Tiếp theo →
        </button>
      )}
    </div>
  );
}
