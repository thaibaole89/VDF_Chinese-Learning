"use client";

// Let the learner choose which voice the app reads a given language with.
// Generalised in 2C.1.5 to any language (zh / en / ko / …). Saves the chosen
// voiceURI per language to localStorage (lib/speech). "Tự động" = the app's
// ranked best voice. "Nghe thử" speaks a sample with the current selection.
// Voices load asynchronously, so we listen for `voiceschanged`.

import { useEffect, useState } from "react";
import {
  listVoices,
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  speakInLang,
  speechSupported,
} from "@/lib/speech";

export default function VoicePicker({
  prefix = "zh",
  titleVi = "Giọng đọc tiếng Trung",
  sample = "您好，欢迎光临！",
  ttsLang = "zh-CN",
  cjk = true,
  installHintVi,
}: {
  prefix?: string;
  titleVi?: string;
  sample?: string;
  ttsLang?: string;
  cjk?: boolean;
  installHintVi?: string;
}) {
  const [voices, setVoices] = useState<{ voiceURI: string; name: string; lang: string; localService: boolean }[]>([]);
  const [selected, setSelected] = useState<string>(""); // "" = auto
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(speechSupported());
    const refresh = () => setVoices(listVoices(prefix));
    refresh();
    setSelected(getPreferredVoiceURI(prefix) ?? "");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
      return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
    }
  }, [prefix]);

  function choose(uri: string) {
    setSelected(uri);
    setPreferredVoiceURI(prefix, uri || null);
  }

  if (!supported) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <h3 className="text-sm font-semibold text-ink">{titleVi}</h3>
        <p className="mt-1 text-xs text-gray-500">Trình duyệt này không hỗ trợ đọc văn bản. Thử Chrome / Edge mới.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
      <h3 className="text-sm font-semibold text-ink">{titleVi}</h3>
      <p className="mt-0.5 text-xs text-gray-500">Chọn giọng đọc bạn thích cho phần phát âm mẫu.</p>

      <select
        value={selected}
        onChange={(e) => choose(e.target.value)}
        className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
        aria-label={titleVi}
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
        <span className={`${cjk ? "hanzi " : ""}text-base text-ink`}>{sample}</span>
        <button
          onClick={() => speakInLang(sample, ttsLang)}
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white tap"
        >
          🔊 Nghe thử
        </button>
      </div>

      {voices.length === 0 && (
        <p className="mt-2 text-[11px] text-amber-700">
          {installHintVi ?? "Máy chưa có giọng cho ngôn ngữ này — có thể cần cài voice pack trong cài đặt hệ điều hành."}
        </p>
      )}
    </div>
  );
}
