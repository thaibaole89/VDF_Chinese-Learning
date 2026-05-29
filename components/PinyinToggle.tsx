"use client";

import { usePinyinPref, setShowPinyin } from "@/lib/usePinyin";

export default function PinyinToggle({ className }: { className?: string }) {
  const show = usePinyinPref(true);
  return (
    <button
      type="button"
      onClick={() => setShowPinyin(!show)}
      aria-pressed={show}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium tap ${
        show ? "border-brand-200 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"
      } ${className ?? ""}`}
    >
      {show ? "Ẩn pinyin" : "Hiện pinyin"}
    </button>
  );
}
