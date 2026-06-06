"use client";

// English pronunciation practice. Phase 2C.1.
//
// Uses the Web Speech recognizer in en-US (NOT zh-CN) and scores with the
// word-level English scorer (lib/englishVoiceScore — never the Chinese
// char-overlap path). A pass (or manual mark) is stored locally via
// markEnVoicePassed. Manual fallback covers browsers without SpeechRecognition.

import { useEffect, useRef, useState } from "react";
import {
  createRecognizer,
  getSpeechRecognitionSupport,
  type Recognizer,
} from "@/lib/speechRecognition";
import { scoreEnglish, EN_FEEDBACK, type EnScore } from "@/lib/englishVoiceScore";
import { markEnVoicePassed } from "@/lib/courses";

type Phase = "idle" | "listening" | "done" | "error";

export default function EnglishVoicePractice({
  phraseId,
  importantWords,
  passed,
  onPassed,
}: {
  phraseId: string;
  importantWords: string[];
  passed: boolean;
  onPassed: () => void;
}) {
  const [supported, setSupported] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<EnScore | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const recRef = useRef<Recognizer | null>(null);

  useEffect(() => {
    setSupported(getSpeechRecognitionSupport().supported);
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  function start() {
    setTranscript("");
    setScore(null);
    setErrMsg("");
    setPhase("listening");
    const rec = createRecognizer({
      lang: "en-US",
      onResult: (r) => {
        const text = r.transcript || "";
        setTranscript(text);
        const s = scoreEnglish(importantWords, text);
        setScore(s);
        setPhase("done");
        if (s.result === "pass") {
          markEnVoicePassed(phraseId);
          onPassed();
        }
      },
      onError: (_code, message) => {
        setErrMsg(message || "Không nghe được");
        setPhase("error");
      },
      onEnd: () => {
        setPhase((p) => (p === "listening" ? "idle" : p));
      },
    });
    if (!rec) {
      setSupported(false);
      setPhase("idle");
      return;
    }
    recRef.current = rec;
    rec.start();
  }

  function stop() {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
  }

  function markManual() {
    markEnVoicePassed(phraseId);
    onPassed();
    setScore({ score: 100, result: "manual", matched: [], missing: [] });
    setPhase("done");
  }

  return (
    <div className="mt-3 rounded-xl bg-brand-50/60 p-3 ring-1 ring-brand-100">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-brand-700">🎙️ Luyện phát âm</span>
        {passed && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">✓ Đã đạt</span>
        )}
      </div>

      {!supported ? (
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy đọc to câu trên rồi tự đánh dấu.
          </p>
          <button
            onClick={markManual}
            className="mt-2 w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white tap"
          >
            Tôi đã đọc được — đánh dấu đạt
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2 flex gap-2">
            {phase === "listening" ? (
              <button onClick={stop} className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white tap">
                ⏺ Đang nghe… bấm để dừng
              </button>
            ) : (
              <button onClick={start} className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white tap">
                {phase === "done" || phase === "error" ? "Thử lại" : "Bắt đầu nói"}
              </button>
            )}
            <button
              onClick={markManual}
              title="Dùng khi máy nghe không chuẩn"
              className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-700 tap"
            >
              Tự đánh dấu
            </button>
          </div>

          {transcript && (
            <p className="mt-2 text-xs text-gray-600">
              Máy nghe: <span className="italic text-gray-800">“{transcript}”</span>
            </p>
          )}

          {score && (
            <div
              className={`mt-2 rounded-lg p-2 text-xs ${
                score.result === "retry" ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"
              }`}
            >
              <div className="font-semibold">
                {score.result !== "manual" && <span className="nums">{score.score}% · </span>}
                {EN_FEEDBACK[score.result]}
              </div>
              {score.missing.length > 0 && score.result === "retry" && (
                <div className="mt-1">Chú ý từ: {score.missing.join(", ")}</div>
              )}
            </div>
          )}

          {phase === "error" && <p className="mt-2 text-xs text-red-600">{errMsg}. Hãy thử lại hoặc tự đánh dấu.</p>}
        </>
      )}
    </div>
  );
}
