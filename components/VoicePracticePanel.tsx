"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionSupport,
  createRecognizer,
  type Recognizer,
  type SpeechRecognitionSupport,
} from "@/lib/speechRecognition";
import { scoreVoice, FEEDBACK_VI, type VoiceScore } from "@/lib/voiceScoring";
import { getVoicePracticeRecord } from "@/lib/storage";
import { submitVoiceAttempt } from "@/lib/progress";
import type { VoicePracticeRecord, VoiceResult } from "@/lib/types";
import ChineseLine from "./ChineseLine";
import VoiceStatusBadge from "./VoiceStatusBadge";

type Phrase = {
  id: string;
  zh: string;
  pinyin?: string;
  vi?: string;
  audioText?: string;
  lessonId?: string;
  voiceKeywords?: string[];
};

// State machine — only one phase active at a time, prevents double-submit.
type Phase = "idle" | "listening" | "processing" | "done" | "noresult" | "error";

function narrowResult(r: VoiceScore["result"]): VoiceResult {
  if (r === "pass" || r === "near" || r === "retry" || r === "manual") return r;
  return "retry";
}

const RESULT_STYLE: Record<
  VoiceResult,
  { label: string; icon: string; cardBg: string; iconBg: string; text: string }
> = {
  pass: { label: "Đạt", icon: "✓", cardBg: "bg-green-50", iconBg: "bg-green-500", text: "text-green-800" },
  near: { label: "Gần đúng", icon: "~", cardBg: "bg-amber-50", iconBg: "bg-amber-500", text: "text-amber-800" },
  retry: { label: "Cần luyện thêm", icon: "↻", cardBg: "bg-orange-50", iconBg: "bg-orange-500", text: "text-orange-800" },
  manual: { label: "Đã đánh dấu thủ công", icon: "★", cardBg: "bg-brand-50", iconBg: "bg-brand-600", text: "text-brand-700" },
};

export default function VoicePracticePanel({
  phrase,
  defaultOpen = false,
  onSaved,
}: {
  phrase: Phrase;
  defaultOpen?: boolean;
  onSaved?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [support, setSupport] = useState<SpeechRecognitionSupport | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<VoiceScore | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [record, setRecord] = useState<VoicePracticeRecord | undefined>(undefined);
  const recRef = useRef<Recognizer | null>(null);
  const resultFiredRef = useRef(false);

  useEffect(() => {
    setSupport(getSpeechRecognitionSupport());
    setRecord(getVoicePracticeRecord(phrase.id));
    return () => recRef.current?.stop();
  }, [phrase.id]);

  function start() {
    if (phase === "listening" || phase === "processing") return; // anti-double-tap
    setErrorMsg(null);
    setScore(null);
    setPhase("listening");
    resultFiredRef.current = false;

    const rec = createRecognizer({
      onStart: () => {
        /* state already set to listening */
      },
      onEnd: () => {
        // If recognition ended without ever firing onResult, treat as noresult
        // (unless we've already moved to error/done/processing).
        if (!resultFiredRef.current) {
          setPhase((prev) => (prev === "listening" || prev === "processing" ? "noresult" : prev));
        }
      },
      onError: (_code, message) => {
        setErrorMsg(message);
        setPhase("error");
      },
      onResult: async (r) => {
        resultFiredRef.current = true;
        setPhase("processing");

        // 1) Score locally for instant feedback
        const sc = scoreVoice(
          { id: phrase.id, zh: phrase.zh, pinyin: phrase.pinyin, vi: phrase.vi },
          r.transcript,
          phrase.voiceKeywords
        );

        // 2) Persist locally + (if logged in) await server for authoritative score
        try {
          const final = await submitVoiceAttempt({
            phraseId: phrase.id,
            lessonId: phrase.lessonId,
            zh: phrase.zh,
            transcript: r.transcript,
            clientScore: sc.score,
            clientResult: narrowResult(sc.result),
          });
          const fb =
            final.result === "pass"
              ? FEEDBACK_VI.pass
              : final.result === "near"
                ? FEEDBACK_VI.near
                : final.result === "manual"
                  ? sc.feedbackVi
                  : FEEDBACK_VI.retry;
          setScore({
            ...sc,
            score: final.score,
            result: final.result,
            feedbackVi: fb,
          });
          setRecord(final.record ?? getVoicePracticeRecord(phrase.id));
          setPhase("done");
          onSaved?.();
        } catch {
          // Fall back to local score (already saved by submitVoiceAttempt)
          setScore(sc);
          setRecord(getVoicePracticeRecord(phrase.id));
          setPhase("done");
          onSaved?.();
        }
      },
    });
    recRef.current = rec;
    rec?.start();
  }

  function stopAndScore() {
    if (phase !== "listening") return;
    // Move UI to processing immediately so the user gets feedback even before
    // the browser flushes its onResult/onEnd cycle.
    setPhase("processing");
    recRef.current?.stop();
    // Either onResult (with partial transcript) or onEnd (no result) will fire
    // and complete the state transition.
  }

  async function markManual() {
    if (phase === "listening" || phase === "processing") return;
    setPhase("processing");
    try {
      const final = await submitVoiceAttempt({
        phraseId: phrase.id,
        lessonId: phrase.lessonId,
        zh: phrase.zh,
        manual: true,
      });
      setScore({
        zh: phrase.zh,
        score: 0,
        result: "manual",
        matchedKeywords: [],
        missingKeywords: [],
        transcript: "",
        feedbackVi: "Đã đánh dấu là đã đọc được. Hệ thống không chấm điểm vì bạn tự xác nhận.",
      } as VoiceScore);
      setRecord(final.record ?? getVoicePracticeRecord(phrase.id));
      setPhase("done");
      onSaved?.();
    } catch {
      setRecord(getVoicePracticeRecord(phrase.id));
      setPhase("idle");
    }
  }

  function reset() {
    if (phase === "listening" || phase === "processing") return;
    setScore(null);
    setErrorMsg(null);
    setPhase("idle");
  }

  const busy = phase === "listening" || phase === "processing";
  const primaryBtn =
    "rounded-xl px-5 py-3 text-base font-semibold tap shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtn =
    "rounded-xl px-4 py-2.5 text-sm font-medium tap disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-brand-700">🎤 Luyện đọc</span>
        <span className="flex items-center gap-2">
          {record && <VoiceStatusBadge result={record.result} />}
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Voice panel keeps pinyin visible regardless of the global toggle. */}
          <ChineseLine zh={phrase.zh} pinyin={phrase.pinyin} vi={phrase.vi} audioText={phrase.audioText} size="md" showPinyin />

          {/* ============ UNSUPPORTED FALLBACK ============ */}
          {support !== null && !support.supported && (
            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
                ⚠️ Thiết bị/trình duyệt này chưa hỗ trợ nhận diện giọng nói tiếng Trung. Bạn vẫn dùng được phần luyện đọc
                qua nút bên dưới — vẫn tính vào tiến độ.
                <div className="mt-2">
                  <Link href="/check" className="font-medium text-brand-700 underline">
                    Mở phần kiểm tra micro & loa →
                  </Link>
                </div>
              </div>
              <button onClick={markManual} disabled={busy} className={`${primaryBtn} w-full bg-brand-600 text-white`}>
                Đánh dấu đã đọc được
              </button>
            </div>
          )}

          {/* ============ STATE: IDLE ============ */}
          {support?.supported && phase === "idle" && (
            <div className="flex flex-wrap gap-2">
              <button onClick={start} disabled={busy} className={`${primaryBtn} flex-1 bg-brand-600 text-white`}>
                🎤 Bắt đầu đọc
              </button>
              <button onClick={markManual} disabled={busy} className={`${secondaryBtn} bg-gray-100 text-gray-700`}>
                Đánh dấu thủ công
              </button>
            </div>
          )}

          {/* ============ STATE: LISTENING ============ */}
          {support?.supported && phase === "listening" && (
            <div className="rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
              {/* Animated mic + pulse rings */}
              <div className="relative mx-auto h-28 w-28">
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-brand-300 opacity-60"
                  style={{ animationDuration: "1.4s" }}
                />
                <span
                  className="absolute inset-3 animate-ping rounded-full bg-brand-400 opacity-70"
                  style={{ animationDuration: "1.4s", animationDelay: "0.4s" }}
                />
                <div className="absolute inset-5 flex items-center justify-center rounded-full bg-brand-600 text-4xl shadow-lg">
                  🎤
                </div>
              </div>
              <p className="mt-4 text-lg font-semibold text-brand-700">Đang nghe…</p>
              <p className="mt-0.5 text-sm text-gray-600">Hãy đọc to và rõ câu tiếng Trung phía trên</p>
              <button
                onClick={stopAndScore}
                className={`${primaryBtn} mt-5 w-full bg-red-600 text-white shadow-md`}
              >
                ⏹ Dừng và chấm điểm
              </button>
            </div>
          )}

          {/* ============ STATE: PROCESSING ============ */}
          {support?.supported && phase === "processing" && (
            <div className="rounded-2xl bg-gray-50 p-6 text-center ring-1 ring-gray-100">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
              <p className="mt-3 text-base font-medium text-gray-700">Đang chấm điểm…</p>
              <p className="mt-0.5 text-xs text-gray-500">Đang đồng bộ với máy chủ</p>
            </div>
          )}

          {/* ============ STATE: DONE ============ */}
          {phase === "done" && score && (
            <div className={`rounded-2xl ${RESULT_STYLE[score.result as VoiceResult].cardBg} p-4 ring-1 ring-gray-100`}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white ${
                    RESULT_STYLE[score.result as VoiceResult].iconBg
                  }`}
                >
                  {RESULT_STYLE[score.result as VoiceResult].icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xl font-bold ${RESULT_STYLE[score.result as VoiceResult].text}`}>
                    {RESULT_STYLE[score.result as VoiceResult].label}
                  </div>
                  {score.result !== "manual" && (
                    <div className="text-sm text-gray-600">
                      Điểm: <span className="font-semibold">{score.score}</span>/100
                    </div>
                  )}
                </div>
              </div>

              {score.transcript && (
                <div className="mt-3 rounded-xl bg-white/70 p-3">
                  <div className="text-xs text-gray-500">Máy nghe được:</div>
                  <div className="hanzi mt-1 text-xl text-ink">{score.transcript}</div>
                </div>
              )}

              <p className="mt-3 text-sm text-gray-700">{score.feedbackVi}</p>

              {(score.matchedKeywords.length > 0 || score.missingKeywords.length > 0) && (
                <p className="mt-2 text-[11px] text-gray-500">
                  {score.matchedKeywords.length > 0 && (
                    <span className="text-green-700">Đã nhận ra: {score.matchedKeywords.join(" ")} </span>
                  )}
                  {score.missingKeywords.length > 0 && <span>· Còn thiếu: {score.missingKeywords.join(" ")}</span>}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {support?.supported && (
                  <button onClick={start} className={`${primaryBtn} flex-1 bg-brand-600 text-white`}>
                    Thử lại
                  </button>
                )}
                {score.result !== "manual" && (
                  <button onClick={markManual} className={`${secondaryBtn} bg-gray-100 text-gray-700`}>
                    Đánh dấu thủ công
                  </button>
                )}
                {score.result === "manual" && (
                  <button onClick={reset} className={`${secondaryBtn} bg-gray-100 text-gray-700`}>
                    Đóng
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ============ STATE: NORESULT ============ */}
          {phase === "noresult" && (
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <p className="font-semibold text-amber-900">🤔 Máy chưa nhận được giọng nói.</p>
              <p className="mt-1 text-sm text-amber-800">
                Có thể micro chưa bắt được âm thanh, hoặc trình duyệt cần thêm thời gian. Hãy thử lại, hoặc dùng nút
                đánh dấu thủ công nếu trình duyệt không hỗ trợ tốt tiếng Trung.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={start} className={`${primaryBtn} flex-1 bg-brand-600 text-white`}>
                  Thử lại
                </button>
                <button onClick={markManual} className={`${secondaryBtn} bg-white text-gray-700 ring-1 ring-gray-200`}>
                  Đánh dấu thủ công
                </button>
              </div>
              <Link href="/check" className="mt-3 inline-block text-xs text-brand-600 underline">
                Kiểm tra micro & loa →
              </Link>
            </div>
          )}

          {/* ============ STATE: ERROR ============ */}
          {phase === "error" && (
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
              <p className="font-semibold text-red-900">✗ Không thể nhận diện</p>
              <p className="mt-1 text-sm text-red-800">{errorMsg ?? "Lỗi không xác định."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={start} className={`${primaryBtn} flex-1 bg-brand-600 text-white`}>
                  Thử lại
                </button>
                <button onClick={markManual} className={`${secondaryBtn} bg-white text-gray-700 ring-1 ring-gray-200`}>
                  Đánh dấu thủ công
                </button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] leading-relaxed text-gray-400">
            Nhận diện giọng nói chỉ hỗ trợ luyện tập, chưa phải chấm điểm phát âm chính thức. Không lưu file ghi âm —
            kết quả chỉ lưu trên thiết bị này (và đồng bộ vào tài khoản nếu đã đăng nhập). Hoạt động tốt nhất trên
            Chrome/Edge.
          </p>
        </div>
      )}
    </div>
  );
}
