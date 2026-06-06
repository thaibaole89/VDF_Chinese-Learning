"use client";

// Let the learner choose which Chinese (zh) voice the app reads with.
// Saves the chosen voiceURI to localStorage (lib/speech). "Tự động" = the
// app's ranked best voice. A "Nghe thử" button speaks a sample with the
// selection so they can compare. Voices load asynchronously, so we listen for
// `voiceschanged`.

import { useEffect, useState } from "react";
import {
  listZhVoices,
  getPreferredZhVoiceURI,
  setPreferredZhVoiceURI,
  speak,
  speechSupported,
} from "@/lib/speech";

const SAMPLE = "您好，欢迎光临！";

export default function VoicePicker() {
  const [voices, setVoices] = useState<{ voiceURI: string; name: string; lang: string; localService: boolean }[]>([]);
  const [selected, setSelected] = useState<string>(""); // "" = auto
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(speechSupported());
    const refresh = () => setVoices(listZhVoices());
    refresh();
    setSelected(getPreferredZhVoiceURI() ?? "");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
      return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
    }
  }, []);

  function choose(uri: string) {
    setSelected(uri);
    setPreferredZhVoiceURI(uri || null);
  }

  if (!supported) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <h3 className="text-sm font-semibold text-ink">Giọng đọc tiếng Trung</h3>
        <p className="mt-1 text-xs text-gray-500">
          Trình duyệt này không hỗ trợ đọc văn bản. Thử Chrome / Edge mới.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
      <h3 className="text-sm font-semibold text-ink">Giọng đọc tiếng Trung</h3>
      <p className="mt-0.5 text-xs text-gray-500">
        Chọn giọng đọc bạn thích cho phần phát âm mẫu.
      </p>

      <select
        value={selected}
        onChange={(e) => choose(e.target.value)}
        className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
        aria-label="Chọn giọng đọc tiếng Trung"
      >
        <option value="">Tự động (giọng tốt nhất trên máy)</option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name} · {v.lang}
            {v.localService ? "" : " (mạng)"}
          </option>
        ))}
      </select>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="hanzi text-base text-ink">{SAMPLE}</span>
        <button
          onClick={() => speak(SAMPLE)}
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white tap"
        >
          🔊 Nghe thử
        </button>
      </div>

      {voices.length === 0 && (
        <p className="mt-2 text-[11px] text-amber-700">
          Máy chưa có giọng tiếng Trung — có thể cần cài voice pack zh-CN trong cài đặt hệ điều hành.
        </p>
      )}
    </div>
  );
}
