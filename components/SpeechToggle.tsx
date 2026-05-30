"use client";

import { useEffect, useState } from "react";
import { getSlowSpeech, setSlowSpeech, SLOW_EVENT } from "@/lib/speech";

export default function SpeechToggle({ className }: { className?: string }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    setSlow(getSlowSpeech());
    const h = () => setSlow(getSlowSpeech());
    window.addEventListener(SLOW_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(SLOW_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setSlowSpeech(!slow)}
      aria-pressed={slow}
      title="Đọc chậm hơn cho người mới"
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium tap ${
        slow ? "border-brand-200 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"
      } ${className ?? ""}`}
    >
      🐢 {slow ? "Đang đọc chậm" : "Đọc chậm"}
    </button>
  );
}
