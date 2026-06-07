"use client";

// Live translation tool. Phase 2B.4 → 2C.1.3 (multilingual).
// Browser-native first (Chrome on-device Translator + Web Speech STT/TTS), with
// a server fallback (Google) for all supported languages. The learner picks the
// customer's language (zh-CN / en / ko / ja / fr) and a swap toggle flips the
// direction between Vietnamese and that language.
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
  loadHistory,
  pushHistory,
  clearHistory,
  type TranslateOutcome,
  type HistoryItem,
} from "@/lib/translate";
import {
  TARGET_LANGUAGES,
  labelOf,
  flagOf,
  sttLang,
  ttsLang,
  isCjk,
  type LangCode,
} from "@/lib/languages";

type Phase = "idle" | "listening" | "translating";

const VI: LangCode = "vi";

export default function TranslateTool() {
  // The non-Vietnamese language (customer side). Vietnamese is always the other.
  const [other, setOther] = useState<LangCode>("zh-CN");
  // Direction: when true, translate FROM Vietnamese TO `other`; else the reverse.
  const [fromVi, setFromVi] = useState(true);

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

  const source: LangCode = fromVi ? VI : other;
  const target: LangCode = fromVi ? other : VI;
  const targetCjk = isCjk(target);

  function reset() {
    setSourceText("");
    setResult(null);
    setNoSpeech(false);
  }
  function changeOther(next: LangCode) {
    if (phase !== "idle") return;
    setOther(next);
    reset();
  }
  function swapDirection() {
    if (phase !== "idle") return;
    setFromVi((v) => !v);
    reset();
  }

  async function doTranslate(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPhase("translating");
    setResult(null);
    setCopied(false);
    const outcome = await translateText(source, target, trimmed);
    setResult(outcome);
    if (outcome.status === "ok") {
      setHistory(
        pushHistory({
          sourceLang: source,
          targetLang: target,
          source: trimmed,
          target: outcome.text,
          engine: outcome.engine,
        })
      );
    }
    setPhase("idle");
  }

  function startListening() {
    if (phase !== "idle" || !micSupported) return;
    reset();
    resultFiredRef.current = false;
    setPhase("listening");
    const rec = createRecognizer({
      lang: sttLang(source),
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
    setPhase("translating");
    recRef.current?.stop();
  }

  function speakResult() {
    if (result?.status === "ok") speakInLang(result.text, ttsLang(target));
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

  const sourceLabel = labelOf(source);
  const targetLabel = labelOf(target);

  return (
    <div className="space-y-5">
      {/* Customer language selector */}
      <section aria-label="Ngôn ngữ khách" className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-gray-100">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ngôn ngữ của khách</span>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {TARGET_LANGUAGES.map((l) => {
            const active = l.code === other;
            return (
              <button
                key={l.code}
                onClick={() => changeOther(l.code)}
                disabled={phase !== "idle"}
                aria-pressed={active}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-medium tap disabled:opacity-60 ${
                  active ? "bg-brand-600 text-white shadow-card" : "bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {l.flag}
                </span>
                <span className="leading-tight">{l.labelVi.replace("Tiếng ", "")}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Direction toggle / swap */}
      <section className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-50 px-2 py-2 text-sm font-semibold text-brand-700">
            <span className="truncate">
              {flagOf(source)} {sourceLabel}
            </span>
          </div>
          <button
            onClick={swapDirection}
            disabled={phase !== "idle"}
            aria-label="Đổi chiều dịch"
            title="Đổi chiều dịch"
            className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-lg text-white tap disabled:opacity-60"
          >
            ⇄
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-50 px-2 py-2 text-sm font-semibold text-gray-700">
            <span className="truncate">
              {flagOf(target)} {targetLabel}
            </span>
          </div>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-gray-400">
          {fromVi ? "Bạn nói tiếng Việt → dịch cho khách" : "Khách nói → dịch sang tiếng Việt"}
        </p>
      </section>

      {/* Source input + mic */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nội dung ({sourceLabel})</label>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={`Nhập hoặc nói ${sourceLabel}…`}
          rows={3}
          disabled={phase === "listening"}
          className={`mt-2 w-full resize-none rounded-xl border border-gray-300 p-3 text-base outline-none focus:border-brand-500 ${
            isCjk(source) ? "hanzi" : ""
          }`}
        />

        {micSupported ? (
          phase === "listening" ? (
            <div className="mt-3 rounded-2xl bg-brand-50 p-5 text-center ring-1 ring-brand-100">
              <div className="relative mx-auto h-20 w-20">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-300 opacity-60" style={{ animationDuration: "1.4s" }} />
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-brand-600 text-3xl shadow-card">🎤</div>
              </div>
              <p className="mt-3 text-base font-semibold text-brand-700">Đang nghe…</p>
              <p className="mt-0.5 text-xs text-gray-600">Nói bằng {sourceLabel}</p>
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
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{targetLabel}</span>
          {result?.status === "ok" && (
            <span className="text-[11px] text-gray-400">{result.engine === "browser" ? "Dịch trên máy" : "Dịch máy chủ"}</span>
          )}
        </div>

        {result?.status === "ok" ? (
          <>
            <div className={`mt-2 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100 ${targetCjk ? "hanzi text-2xl" : "text-lg"} text-ink`}>
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
                <div className="text-[11px] text-gray-400">
                  {flagOf(h.sourceLang)} → {flagOf(h.targetLang)}
                </div>
                <div className="text-gray-600">{h.source}</div>
                <div className={`mt-0.5 font-medium text-ink ${isCjk(h.targetLang) ? "hanzi" : ""}`}>→ {h.target}</div>
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
