"use client";

// Self-diagnostic: lets the user test speaker (TTS) and microphone
// (SpeechRecognition) BEFORE starting voice practice. No content scoring;
// no state persisted. Pure client-side.

import { useEffect, useRef, useState } from "react";
import { speechSupported, stopSpeaking } from "@/lib/speech";
import {
  getSpeechRecognitionSupport,
  createRecognizer,
  type Recognizer,
  type SpeechRecognitionSupport,
} from "@/lib/speechRecognition";

const SAMPLE_ZH = "您好，欢迎光临！";
const SAMPLE_PINYIN = "Nín hǎo, huānyíng guānglín!";
const SAMPLE_VI = "Xin chào quý khách, chào mừng đến cửa hàng ạ!";

// ----- Speaker state -----
type SpeakerPhase = "ready" | "playing" | "heard" | "not-heard" | "unsupported";

// ----- Mic state -----
type MicPhase = "ready" | "listening" | "processing" | "received" | "failed" | "unsupported";

function describeBrowser(ua: string): string {
  if (!ua) return "";
  if (/EdgA?\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Edg/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua)) return "Safari";
  if (/HuaweiBrowser\//.test(ua)) return "Huawei Browser";
  if (/HONORBrowser/i.test(ua)) return "Honor Browser";
  return "Khác";
}

function describePlatform(ua: string): string {
  if (!ua) return "";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Macintosh/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  return "";
}

// Status pill component
function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "info" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    neutral: "bg-gray-100 text-gray-700",
    info: "bg-brand-100 text-brand-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-700",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {label}
    </span>
  );
}

export default function DeviceCheck() {
  // --- Speaker ---
  const [speakerPhase, setSpeakerPhase] = useState<SpeakerPhase>("ready");
  const [zhVoices, setZhVoices] = useState<{ name: string; lang: string; local: boolean }[]>([]);
  const [pickedVoice, setPickedVoice] = useState<string | null>(null);
  const ttsSupportedRef = useRef<boolean | null>(null);

  // --- Mic ---
  const [micPhase, setMicPhase] = useState<MicPhase>("ready");
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [micError, setMicError] = useState<string | null>(null);
  const recRef = useRef<Recognizer | null>(null);
  const resultFiredRef = useRef(false);

  // --- Diagnostics ---
  const [recSupport, setRecSupport] = useState<SpeechRecognitionSupport | null>(null);
  const [ua, setUa] = useState<string>("");
  const [online, setOnline] = useState<boolean>(true);

  // --- Probe on mount ---
  useEffect(() => {
    ttsSupportedRef.current = speechSupported();
    if (!ttsSupportedRef.current) setSpeakerPhase("unsupported");
    const supp = getSpeechRecognitionSupport();
    setRecSupport(supp);
    if (!supp.supported) setMicPhase("unsupported");
    setUa(typeof navigator !== "undefined" ? navigator.userAgent : "");
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const refresh = () => {
        const all = window.speechSynthesis.getVoices() || [];
        const zh = all
          .filter((v) => /^zh/i.test(v.lang || ""))
          .map((v) => ({ name: v.name, lang: v.lang, local: !!v.localService }));
        setZhVoices(zh);
        const picked = zh.find((v) => /^zh-cn$/i.test(v.lang))?.name ?? zh[0]?.name ?? null;
        setPickedVoice(picked);
      };
      refresh();
      window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
      return () => {
        window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
        recRef.current?.stop();
        stopSpeaking();
      };
    }
    return () => {
      recRef.current?.stop();
    };
  }, []);

  // --- Speaker: play sample with onend tracking ---
  function playSample(slow: boolean) {
    if (!ttsSupportedRef.current || typeof window === "undefined") return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(SAMPLE_ZH);
      u.lang = "zh-CN";
      u.rate = slow ? 0.6 : 0.9;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices() || [];
      const v = voices.find((x) => /^zh-cn$/i.test(x.lang)) ?? voices.find((x) => /^zh/i.test(x.lang));
      if (v) u.voice = v;
      u.onend = () => setSpeakerPhase((prev) => (prev === "playing" ? "ready" : prev));
      u.onerror = () => setSpeakerPhase((prev) => (prev === "playing" ? "ready" : prev));
      setSpeakerPhase("playing");
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }
  function stopSpeaker() {
    stopSpeaking();
    setSpeakerPhase((prev) => (prev === "playing" ? "ready" : prev));
  }

  // --- Mic: state machine identical pattern to VoicePracticePanel ---
  function startMic() {
    if (micPhase === "listening" || micPhase === "processing") return;
    setMicError(null);
    setTranscript("");
    setConfidence(undefined);
    setMicPhase("listening");
    resultFiredRef.current = false;
    const rec = createRecognizer({
      onStart: () => {
        /* phase already listening */
      },
      onEnd: () => {
        if (!resultFiredRef.current) {
          setMicPhase((prev) => (prev === "listening" || prev === "processing" ? "failed" : prev));
          if (!micError) setMicError("Máy chưa nhận được giọng nói. Hãy thử nói to và rõ hơn.");
        }
      },
      onError: (_code, msg) => {
        setMicError(msg);
        setMicPhase("failed");
      },
      onResult: (r) => {
        resultFiredRef.current = true;
        setMicPhase("processing");
        // No async server call here — purely diagnostic. Show the transcript.
        setTranscript(r.transcript);
        setConfidence(r.confidence);
        setMicPhase("received");
      },
    });
    recRef.current = rec;
    rec?.start();
  }
  function stopMic() {
    if (micPhase !== "listening") return;
    setMicPhase("processing");
    recRef.current?.stop();
  }
  function resetMic() {
    if (micPhase === "listening" || micPhase === "processing") return;
    setMicError(null);
    setTranscript("");
    setConfidence(undefined);
    setMicPhase("ready");
  }

  const browserName = describeBrowser(ua);
  const platform = describePlatform(ua);

  // Pills
  const speakerPill =
    speakerPhase === "ready"
      ? { label: "Sẵn sàng", tone: "neutral" as const }
      : speakerPhase === "playing"
        ? { label: "Đang phát…", tone: "info" as const }
        : speakerPhase === "heard"
          ? { label: "✓ Nghe được", tone: "success" as const }
          : speakerPhase === "not-heard"
            ? { label: "✗ Không nghe được", tone: "danger" as const }
            : { label: "Không hỗ trợ", tone: "warning" as const };

  const micPill =
    micPhase === "ready"
      ? { label: "Sẵn sàng", tone: "neutral" as const }
      : micPhase === "listening"
        ? { label: "Đang nghe…", tone: "info" as const }
        : micPhase === "processing"
          ? { label: "Đang xử lý…", tone: "info" as const }
          : micPhase === "received"
            ? { label: "✓ Đã nhận", tone: "success" as const }
            : micPhase === "failed"
              ? { label: "✗ Thất bại", tone: "danger" as const }
              : { label: "Không hỗ trợ", tone: "warning" as const };

  const primaryBtn =
    "rounded-xl px-5 py-3.5 text-base font-semibold tap shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtn =
    "rounded-xl px-4 py-2.5 text-sm font-medium tap disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-5">
      {/* ============================================================ SPEAKER ============================================================ */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <header className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">🔊 Kiểm tra loa</h2>
          <StatusPill label={speakerPill.label} tone={speakerPill.tone} />
        </header>

        <p className="text-sm text-gray-500">Bấm nút bên dưới để nghe câu mẫu tiếng Trung.</p>

        {/* Sample phrase — large */}
        <div className="mt-4 rounded-2xl bg-brand-50 p-5 text-center ring-1 ring-brand-100">
          <div className="hanzi text-3xl font-semibold text-ink sm:text-4xl">{SAMPLE_ZH}</div>
          <div className="mt-2 text-base text-gray-600">{SAMPLE_PINYIN}</div>
          <div className="mt-1 text-sm text-gray-500">{SAMPLE_VI}</div>
        </div>

        {speakerPhase === "unsupported" ? (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
            ⚠️ Trình duyệt này không hỗ trợ đọc văn bản (TTS). Vẫn dùng app được, nhưng sẽ không có giọng đọc mẫu.
            Thử dùng Chrome / Edge.
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => playSample(false)}
                disabled={speakerPhase === "playing"}
                className={`${primaryBtn} bg-brand-600 text-white`}
              >
                ▶ Phát bình thường
              </button>
              <button
                onClick={() => playSample(true)}
                disabled={speakerPhase === "playing"}
                className={`${primaryBtn} bg-gray-100 text-gray-800`}
              >
                🐢 Phát chậm
              </button>
            </div>
            {speakerPhase === "playing" && (
              <button onClick={stopSpeaker} className={`${secondaryBtn} mt-2 w-full bg-white text-gray-700 ring-1 ring-gray-200`}>
                ⏹ Dừng
              </button>
            )}

            <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs">
              <div className="text-gray-500">
                Giọng đang dùng:{" "}
                <span className="font-semibold text-ink">{pickedVoice ?? "(trình duyệt sẽ chọn tự động)"}</span>
              </div>
              <div className="mt-0.5 text-gray-500">
                Số giọng tiếng Trung trên máy: <span className="font-semibold text-ink">{zhVoices.length}</span>
                {zhVoices.length === 0 && (
                  <span className="ml-1 text-amber-700">— có thể cần cài voice pack zh-CN trong cài đặt hệ điều hành.</span>
                )}
              </div>
            </div>

            {/* Vote — only shown after at least 1 playback */}
            {(speakerPhase === "ready" || speakerPhase === "heard" || speakerPhase === "not-heard") && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSpeakerPhase("heard")}
                  className={`${primaryBtn} ${
                    speakerPhase === "heard" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"
                  }`}
                >
                  ✓ Nghe được
                </button>
                <button
                  onClick={() => setSpeakerPhase("not-heard")}
                  className={`${primaryBtn} ${
                    speakerPhase === "not-heard" ? "bg-red-500 text-white" : "bg-red-100 text-red-700"
                  }`}
                >
                  ✗ Không nghe được
                </button>
              </div>
            )}

            {speakerPhase === "not-heard" && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-gray-700">
                <li>Tăng âm lượng thiết bị + media volume.</li>
                <li>Nếu đeo tai nghe, kiểm tra kết nối Bluetooth/jack.</li>
                <li>Cài voice pack tiếng Trung trong Settings → Language → Speech (Android).</li>
                <li>Trình duyệt Honor / Huawei / Safari đôi khi thiếu giọng zh-CN — thử Chrome.</li>
              </ul>
            )}
          </>
        )}
      </section>

      {/* ============================================================ MICROPHONE ============================================================ */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <header className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">🎤 Kiểm tra micro</h2>
          <StatusPill label={micPill.label} tone={micPill.tone} />
        </header>

        {micPhase === "unsupported" ? (
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
            ⚠️ Trình duyệt này không hỗ trợ nhận diện giọng nói tiếng Trung. Đây là giới hạn trình duyệt, không phải
            lỗi micro. Trong app, bạn vẫn dùng được nút <strong>"Đánh dấu đã đọc được"</strong> ở mỗi câu — vẫn tính
            vào tiến độ.
            <p className="mt-2">
              Thử <strong>Chrome</strong> hoặc <strong>Edge</strong> mới nhất.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">Bấm "Bắt đầu nói", đọc câu bên dưới. Máy sẽ hiển thị nó nghe được gì.</p>

            {/* Prompt — large */}
            <div className="mt-4 rounded-2xl bg-brand-50 p-5 text-center ring-1 ring-brand-100">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">Đọc câu này</div>
              <div className="hanzi mt-2 text-3xl font-semibold text-ink sm:text-4xl">{SAMPLE_ZH}</div>
              <div className="mt-2 text-base text-gray-600">{SAMPLE_PINYIN}</div>
            </div>

            {/* State machine UI */}
            {micPhase === "ready" && (
              <button onClick={startMic} className={`${primaryBtn} mt-4 w-full bg-brand-600 text-white`}>
                🎤 Bắt đầu nói
              </button>
            )}

            {micPhase === "listening" && (
              <div className="mt-4 rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
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
                <p className="mt-0.5 text-sm text-gray-600">Đọc to và rõ câu tiếng Trung phía trên</p>
                <button onClick={stopMic} className={`${primaryBtn} mt-5 w-full bg-red-600 text-white shadow-md`}>
                  ⏹ Dừng và xem kết quả
                </button>
              </div>
            )}

            {micPhase === "processing" && (
              <div className="mt-4 rounded-2xl bg-gray-50 p-6 text-center ring-1 ring-gray-100">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
                <p className="mt-3 text-base font-medium text-gray-700">Đang xử lý…</p>
              </div>
            )}

            {micPhase === "received" && (
              <div className="mt-4 rounded-2xl bg-green-50 p-5 ring-1 ring-green-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
                    ✓
                  </div>
                  <div className="text-lg font-bold text-green-800">Đã nhận được giọng nói</div>
                </div>
                <div className="mt-3 rounded-xl bg-white/70 p-3">
                  <div className="text-xs text-gray-500">Máy nghe được:</div>
                  <div className="hanzi mt-1 text-2xl text-ink">{transcript || "(rỗng)"}</div>
                </div>
                {confidence !== undefined && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mức tự tin: <span className="font-semibold text-ink">{(confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
                <p className="mt-3 text-xs text-gray-600">
                  Nếu transcript khác câu mẫu nhiều, không sao — phần luyện đọc của app chấm bằng từ khoá và độ trùng
                  ký tự, không cần khớp 100%.
                </p>
                <button onClick={resetMic} className={`${primaryBtn} mt-3 w-full bg-brand-600 text-white`}>
                  Thử lại
                </button>
              </div>
            )}

            {micPhase === "failed" && (
              <div className="mt-4 rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-2xl text-white">
                    ✗
                  </div>
                  <div className="text-lg font-bold text-red-800">Thất bại</div>
                </div>
                <p className="mt-2 text-sm text-red-800">{micError ?? "Không xác định."}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-red-800">
                  <li>Vào Settings → Apps → trình duyệt → Permissions → Microphone → Allow.</li>
                  <li>Tắt VPN nếu đang dùng (nhận diện gọi máy chủ Google).</li>
                  <li>Đảm bảo có kết nối internet.</li>
                  <li>Đọc to + gần micro (~20cm), tránh nguồn ồn.</li>
                </ul>
                <button onClick={resetMic} className={`${primaryBtn} mt-3 w-full bg-brand-600 text-white`}>
                  Thử lại
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ============================================================ DIAGNOSTICS ============================================================ */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Thông tin trình duyệt</h2>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Trình duyệt</dt>
            <dd className="font-semibold text-ink">{browserName || "—"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Hệ điều hành</dt>
            <dd className="font-semibold text-ink">{platform || "—"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Hỗ trợ TTS</dt>
            <dd className={ttsSupportedRef.current ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
              {ttsSupportedRef.current ? "✓ Có" : "✗ Không"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Hỗ trợ nhận diện</dt>
            <dd className={recSupport?.supported ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
              {recSupport?.supported ? "✓ Có" : "✗ Không"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Giọng zh trên máy</dt>
            <dd className="font-semibold text-ink">{zhVoices.length}</dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <dt className="text-gray-500">Kết nối</dt>
            <dd className={online ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
              {online ? "✓ Online" : "✗ Offline"}
            </dd>
          </div>
        </dl>
      </section>

      {/* ============================================================ TIPS ============================================================ */}
      <section className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-100">
        <p className="text-sm font-semibold">Mẹo nếu micro / loa không chạy:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Trên Android (Honor / Huawei tablet): dùng <strong>Chrome</strong> từ Play Store / GBox, KHÔNG dùng Honor
            Browser / Huawei Browser.
          </li>
          <li>
            iOS Safari thường <strong>không hỗ trợ</strong> nhận diện tiếng Trung — đây là giới hạn của Safari. Vẫn
            dùng app được, nhưng phải bấm "Đánh dấu đã đọc được" cho phần luyện đọc.
          </li>
          <li>Lần đầu mở: trình duyệt sẽ hỏi quyền micro — phải bấm <strong>Cho phép</strong>.</li>
          <li>Nhận diện gửi audio lên máy chủ Google — cần internet ổn định, không VPN chặn.</li>
        </ul>
      </section>
    </div>
  );
}
