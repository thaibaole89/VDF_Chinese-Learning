// lib/speechRecognition.ts — thin wrapper around the browser Web Speech
// Recognition API (zh-CN). Client-only, feature-detected, never crashes.
// This is recognition for practice — NOT official pronunciation scoring.

export type SpeechRecognitionSupport = { supported: boolean; reason?: string };

export type SpeechRecognitionResultData = {
  transcript: string;
  confidence?: number;
  alternatives?: Array<{ transcript: string; confidence?: number }>;
};

export type SpeechRecognitionErrorCode =
  | "unsupported"
  | "not_allowed"
  | "no_speech"
  | "audio_capture"
  | "network"
  | "language_not_supported"
  | "unknown";

export const ERROR_MESSAGES_VI: Record<SpeechRecognitionErrorCode, string> = {
  unsupported: "Trình duyệt này chưa hỗ trợ nhận diện giọng nói tiếng Trung.",
  not_allowed: "Bạn cần cho phép micro để luyện đọc.",
  no_speech: "Chưa nghe thấy giọng đọc. Hãy thử lại.",
  audio_capture: "Không truy cập được micro. Kiểm tra thiết bị và thử lại.",
  network: "Nhận diện giọng nói gặp lỗi mạng. Hãy thử lại.",
  language_not_supported: "Trình duyệt này chưa hỗ trợ nhận diện tiếng Trung.",
  unknown: "Chưa thể nhận diện giọng đọc. Hãy thử lại.",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function getCtor(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function getSpeechRecognitionSupport(): SpeechRecognitionSupport {
  if (typeof window === "undefined") return { supported: false, reason: "ssr" };
  return getCtor() ? { supported: true } : { supported: false, reason: "unsupported" };
}

function mapError(e: string): SpeechRecognitionErrorCode {
  switch (e) {
    case "not-allowed":
    case "service-not-allowed":
      return "not_allowed";
    case "no-speech":
      return "no_speech";
    case "audio-capture":
      return "audio_capture";
    case "network":
      return "network";
    case "language-not-supported":
    case "bad-grammar":
      return "language_not_supported";
    default:
      return "unknown";
  }
}

export type Recognizer = { start: () => void; stop: () => void };

// Single-shot recognizer. Mic permission is only requested when start() is called.
export function createRecognizer(opts: {
  onResult: (r: SpeechRecognitionResultData) => void;
  onError: (code: SpeechRecognitionErrorCode, message: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}): Recognizer | null {
  const Ctor = getCtor();
  if (!Ctor) {
    opts.onError("unsupported", ERROR_MESSAGES_VI.unsupported);
    return null;
  }
  let rec: any;
  try {
    rec = new Ctor();
    rec.lang = "zh-CN";
    rec.interimResults = false;
    rec.continuous = false;
    try {
      rec.maxAlternatives = 3;
    } catch {
      /* some impls ignore */
    }
    rec.onstart = () => opts.onStart?.();
    rec.onend = () => opts.onEnd?.();
    rec.onerror = (ev: any) => {
      const code = mapError(ev?.error || "unknown");
      opts.onError(code, ERROR_MESSAGES_VI[code]);
    };
    rec.onresult = (ev: any) => {
      try {
        const res = ev.results[0];
        const alternatives: Array<{ transcript: string; confidence?: number }> = [];
        for (let i = 0; i < res.length; i++) {
          alternatives.push({ transcript: res[i].transcript, confidence: res[i].confidence });
        }
        opts.onResult({
          transcript: res[0]?.transcript ?? "",
          confidence: res[0]?.confidence,
          alternatives,
        });
      } catch {
        opts.onError("unknown", ERROR_MESSAGES_VI.unknown);
      }
    };
  } catch {
    opts.onError("unsupported", ERROR_MESSAGES_VI.unsupported);
    return null;
  }
  return {
    start: () => {
      try {
        rec.start();
      } catch {
        /* InvalidStateError if already running — ignore */
      }
    },
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
