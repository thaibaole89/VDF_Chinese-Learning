"use client";

import { useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionSupport,
  createRecognizer,
  type Recognizer,
  type SpeechRecognitionSupport,
} from "@/lib/speechRecognition";
import { scoreVoice, type VoiceScore } from "@/lib/voiceScoring";
import { saveVoicePracticeRecord, getVoicePracticeRecord } from "@/lib/storage";
import type { VoicePracticeRecord } from "@/lib/types";
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
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState<VoiceScore | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [record, setRecord] = useState<VoicePracticeRecord | undefined>(undefined);
  const recRef = useRef<Recognizer | null>(null);

  useEffect(() => {
    setSupport(getSpeechRecognitionSupport());
    setRecord(getVoicePracticeRecord(phrase.id));
    return () => recRef.current?.stop();
  }, [phrase.id]);

  function start() {
    setErrorMsg(null);
    setScore(null);
    const rec = createRecognizer({
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
      onError: (_code, message) => {
        setErrorMsg(message);
        setListening(false);
      },
      onResult: (r) => {
        const sc = scoreVoice(
          { id: phrase.id, zh: phrase.zh, pinyin: phrase.pinyin, vi: phrase.vi },
          r.transcript,
          phrase.voiceKeywords
        );
        setScore(sc);
        setListening(false);
        saveVoicePracticeRecord({
          phraseId: phrase.id,
          lessonId: phrase.lessonId,
          zh: phrase.zh,
          transcript: r.transcript,
          score: sc.score,
          result: sc.result === "near" || sc.result === "retry" ? sc.result : "pass",
        });
        setRecord(getVoicePracticeRecord(phrase.id));
        onSaved?.();
      },
    });
    recRef.current = rec;
    rec?.start();
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  function markManual() {
    saveVoicePracticeRecord({
      phraseId: phrase.id,
      lessonId: phrase.lessonId,
      zh: phrase.zh,
      transcript: score?.transcript,
      score: score?.score,
      result: "manual",
    });
    setRecord(getVoicePracticeRecord(phrase.id));
    onSaved?.();
  }

  const btn = "rounded-xl px-4 py-2 text-sm font-semibold tap";

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
          {/* Voice panel keeps pinyin visible regardless of the global toggle — staff need it to read aloud. */}
          <ChineseLine zh={phrase.zh} pinyin={phrase.pinyin} vi={phrase.vi} audioText={phrase.audioText} size="md" showPinyin />

          {support === null ? null : !support.supported ? (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              Thiết bị/trình duyệt này chưa hỗ trợ nhận diện giọng nói tiếng Trung. Bạn vẫn có thể nghe
              mẫu và tự luyện.
              <div className="mt-2">
                <button onClick={markManual} className={`${btn} bg-brand-600 text-white`}>
                  Đánh dấu đã đọc được
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!listening && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={start} className={`${btn} bg-brand-600 text-white`}>
                    {score || errorMsg ? "Thử lại" : "Bắt đầu đọc"}
                  </button>
                  <button onClick={markManual} className={`${btn} bg-gray-100 text-gray-600`}>
                    Đánh dấu đã đọc được
                  </button>
                </div>
              )}

              {listening && (
                <div className="flex items-center justify-between gap-2 rounded-xl bg-brand-50 p-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-brand-700">
                    <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                    Đang nghe…
                  </span>
                  <button onClick={stop} className={`${btn} bg-white text-gray-700 ring-1 ring-gray-200`}>
                    Dừng
                  </button>
                </div>
              )}

              {errorMsg && !listening && <p className="text-sm text-orange-700">{errorMsg}</p>}

              {score && !listening && (
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <VoiceStatusBadge result={score.result} />
                    <span className="text-xs text-gray-400">({score.score}/100)</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{score.feedbackVi}</p>
                  {score.transcript ? (
                    <p className="mt-1 text-sm">
                      <span className="text-gray-400">Máy nghe được: </span>
                      <span className="hanzi text-ink">{score.transcript}</span>
                    </p>
                  ) : null}
                  {(score.matchedKeywords.length > 0 || score.missingKeywords.length > 0) && (
                    <p className="mt-1 text-[11px] text-gray-400">
                      {score.matchedKeywords.length > 0 && (
                        <span className="text-green-700">Đã nhận ra: {score.matchedKeywords.join(" ")} </span>
                      )}
                      {score.missingKeywords.length > 0 && (
                        <span>· Còn thiếu: {score.missingKeywords.join(" ")}</span>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-gray-400">
            Nhận diện giọng nói chỉ hỗ trợ luyện tập, chưa phải chấm điểm phát âm chính thức. Không lưu
            file ghi âm — kết quả chỉ lưu trên thiết bị này. Hoạt động tốt nhất trên Chrome/Edge.
          </p>
        </div>
      )}
    </div>
  );
}
