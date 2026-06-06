"use client";

// Live translation tool. Phase 2B.4 — MVP shell.
// Browser-native first (Chrome on-device Translator + Web Speech STT/TTS).
// No conversation text touches Supabase; session history is sessionStorage.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionSupport,
  createRecognizer,
  type Recognizer,
} from "@/lib/speechRecognition";
import { speakInLang, speechSupported, stopSpeaking } from "@/lib/speech";
import {
  translateText,
  directionLangs,
  STT_LANG,
  loadHistory,
  pushHistory,
  clearHistory,
  type Direction,
  type TranslateOutcome,
  type HistoryItem,
} from "@/lib/translate";

const DIRECTIONS: { id: Direction; label: string; short: string }[] = [
  { id: "vi2zh", label: "Nhân viên nói tiếng Việt → Dịch sang tiếng Trung", short: "VI → 中文" },
  { id: "zh2vi", label: "Khách nói tiếng Trung → Dịch sang tiếng Việt", short: "中文 → VI" },
];

type Phase = "idle" | "listening" | "translating";

export default function TranslateTool() {
  const [dir, setDir] = useState<Direction>("vi2zh");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sourceText, setSourceText] = useState("");
  const [result, setResult] = useState<TranslateOutcome | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [ttsOk, setTtsOk] = useState(true);
  const [noSpeech, setNoSpeech] = useState(false);

  const recRef = useRef<Recognizer | null>(null);
  const resultFiredRef = useRef(false);

  useEffect(() => {
    setMicSupported(getSpeechRecognitionSupport().supported);
    setTtsOk(speechSupported());
    setHistory(loadHistory());
    return () => {
      recRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  const { source, target } = directionLangs(dir);
  const targetIsZh = target === "zh";

  function changeDir(next: Direction) {
    if (phase !== "idle") return;
    setDir(next);
    setSourceText("");
    setResult(null);
    setNoSpeech(false);
  }

  async function doTranslate(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPhase("translating");
    setResult(null);
    setCopied(false);
    const outcome = await translateText(dir, trimmed);
    setResult(outcome);
    if (outcome.status === "ok") {
      setHistory(
        pushHistory({ dir, source: trimmed, target: outcome.text, engine: outcome.engine })
      );
    }
    setPhase("idle");
  }

  function startListening() {
    if (phase !== "idle" || !micSupported) return;
    setResult(null);
    setNoSpeech(false);
    setSourceText("");
    resultFiredRef.current = false;
    setPhase("listening");
    const rec = createRecognizer({
      lang: STT_LANG[source],
      onResult: (r) => {
        resultFiredRef.current = true;
        const t = r.transcript ?? "";
        setSourceText(t);
        void doTranslate(t);
      },
      onEnd: () => {
        if (!resultFiredRef.current) {
          setPhase((p) => (p === "listening" ? "idle" : p));
          setNoSpeech(true);
        }
      },
      onError: () => {
        setPhase((p) => (p === "listening" ? "idle" : p));
        setNoSpeech(true);
      },
    });
    recRef.current = rec;
    rec?.start();
  }

  function stopAndTranslate() {
    if (phase !== "listening") return;
    // onResult (fired after stop) flips to translating; show interim state now.
    setPhase("translating");
    recRef.current?.stop();
  }

  function speakResult() {
    if (result?.status === "ok") speakInLang(result.text, target);
  }

  async function copyResult() {
    if (result?.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  function resetHistory() {
    clearHistory();
    setHistory([]);
  }

  const sourcePlaceholder =
    source === "vi" ? "Nhập hoặc nói tiếng Việt…" : "Nhập hoặc nói tiếng Trung… (中文)";
  const outputLabel = targetIsZh ? "Tiếng Trung — đọc cho khách" : "Tiếng Việt";

  return (
    <div className="space-y-5">
      {/* Direction toggle */}
      <section aria-label="Chiều dịch" className="rounded-2xl bg-white p-2 shadow-card ring-1 ring-gray-100">
        <div className="grid grid-cols-1 gap-2">
          {DIRECTIONS.map((d) => {
            const active = d.id === dir;
            return (
              <button
                key={d.id}
                onClick={() => changeDir(d.id)}
                disabled={phase !== "idle"}
                className={`rounded-xl px-4 py-3 text-left text-sm font-semibold tap disabled:opacity-60 ${
                  active ? "bg-brand-600 text-white shadow-card" : "bg-gray-50 text-gray-700"
                }`}
                aria-pressed={active}
              >
                <span className="mr-2 text-xs font-bold opacity-80">{d.short}</span>
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Source input + mic */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {source === "vi" ? "Nội dung (tiếng Việt)" : "Nội dung (tiếng Trung)"}
        </label>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={sourcePlaceholder}
          rows={3}
          disabled={phase === "listening"}
          className={`mt-2 w-full resize-none rounded-xl border border-gray-300 p-3 text-base outline-none focus:border-brand-500 ${
            source === "zh" ? "hanzi" : ""
          }`}
        />

        {/* Mic states */}
        {micSupported ? (
          phase === "listening" ? (
            <div className="mt-3 rounded-2xl bg-brand-50 p-5 text-center ring-1 ring-brand-100">
              <div className="relative mx-auto h-20 w-20">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-300 opacity-60" style={{ animationDuration: "1.4s" }} />
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-brand-600 text-3xl shadow-card">🎤</div>
              </div>
              <p className="mt-3 text-base font-semibold text-brand-700">Đang nghe…</p>
              <p className="mt-0.5 text-xs text-gray-600">
                {source === "vi" ? "Nói bằng tiếng Việt" : "Mời khách nói bằng tiếng Trung"}
              </p>
              <button onClick={stopAndTranslate} className="mt-4 w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white tap">
                ⏹ Dừng và dịch
              </button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={startListening}
                disabled={phase !== "idle"}
                className="rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white tap disabled:opacity-60"
              >
                🎤 Bấm để nói
              </button>
              <button
                onClick={() => doTranslate(sourceText)}
                disabled={phase !== "idle" || !sourceText.trim()}
                className="rounded-xl bg-gray-100 px-4 py-3.5 text-sm font-semibold text-gray-800 tap disabled:opacity-50"
              >
                {phase === "translating" ? "Đang dịch…" : "Dịch"}
              </button>
            </div>
          )
        ) : (
          <div className="mt-3">
            <button
              onClick={() => doTranslate(sourceText)}
              disabled={phase !== "idle" || !sourceText.trim()}
              className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white tap disabled:opacity-50"
            >
              {phase === "translating" ? "Đang dịch…" : "Dịch"}
            </button>
            <p className="mt-2 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800 ring-1 ring-amber-100">
              Trình duyệt này không hỗ trợ nói. Bạn vẫn gõ chữ rồi bấm “Dịch”.{" "}
              <Link href="/check" className="font-medium underline">
                Kiểm tra micro & loa →
              </Link>
            </p>
          </div>
        )}

        {noSpeech && (
          <p className="mt-2 text-xs text-amber-700">
            Chưa nghe được. Hãy thử lại, hoặc gõ chữ rồi bấm “Dịch”.{" "}
            <Link href="/check" className="font-medium underline">
              Kiểm tra micro →
            </Link>
          </p>
        )}
      </section>

      {/* Output */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{outputLabel}</span>
          {result?.status === "ok" && (
            <span className="text-[11px] text-gray-400">
              {result.engine === "browser" ? "Dịch trên máy" : "Dịch máy chủ"}
            </span>
          )}
        </div>

        {result?.status === "ok" ? (
          <>
            <div className={`mt-2 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100 ${targetIsZh ? "hanzi text-2xl" : "text-lg"} text-ink`}>
              {result.text}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={speakResult}
                disabled={!ttsOk}
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white tap disabled:opacity-50"
              >
                🔊 Đọc to
              </button>
              <button onClick={copyResult} className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 tap">
                {copied ? "✓ Đã chép" : "⧉ Sao chép"}
              </button>
            </div>
          </>
        ) : result?.status === "not_configured" ? (
          <div className="mt-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
            <p className="font-semibold">Chưa bật dịch tự động</p>
            <p className="mt-1">{result.message}</p>
          </div>
        ) : result?.status === "error" ? (
          <div className="mt-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-100">{result.message}</div>
        ) : (
          <p className="mt-2 text-sm text-gray-400">Bản dịch sẽ hiện ở đây.</p>
        )}
      </section>

      {/* Privacy / accuracy notice */}
      <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
        ⚠️ Công cụ dịch hỗ trợ giao tiếp nhanh, không dùng để xác nhận thông tin pháp lý, hộ chiếu,
        thanh toán hoặc cam kết giá nếu chưa kiểm tra lại.
      </p>

      {/* Session history */}
      {history.length > 0 && (
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500">Lịch sử phiên này</h2>
            <button onClick={resetHistory} className="text-xs text-gray-400 underline tap">
              Xoá lịch sử
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {history.map((h) => (
              <li key={h.id} className="rounded-xl bg-gray-50 p-2.5 text-sm">
                <div className="text-gray-600">{h.source}</div>
                <div className={`mt-0.5 font-medium text-ink ${h.dir === "vi2zh" ? "hanzi" : ""}`}>
                  → {h.target}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-gray-400">
            Lịch sử chỉ lưu tạm trên thiết bị trong phiên này, không gửi lên máy chủ.
          </p>
        </section>
      )}
    </div>
  );
}
