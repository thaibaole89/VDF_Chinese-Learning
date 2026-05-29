"use client";

import { useEffect, useState } from "react";
import { speak, speechSupported } from "@/lib/speech";

export default function SpeakButton({
  text,
  label,
  className,
}: {
  text?: string;
  label?: string;
  className?: string;
}) {
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(speechSupported()), []);

  if (!text) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      title={supported ? "Nghe phát âm (zh-CN)" : "Trình duyệt không hỗ trợ đọc"}
      aria-label="Nghe phát âm"
      className={`inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 tap ${
        supported ? "" : "opacity-60"
      } ${className ?? ""}`}
    >
      <span aria-hidden>🔊</span>
      <span>{label ?? "Nghe"}</span>
    </button>
  );
}
