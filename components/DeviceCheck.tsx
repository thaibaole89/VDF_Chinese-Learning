"use client";

// Self-diagnostic: lets the user test that audio playback (speaker / TTS) and
// the microphone work BEFORE starting voice practice. No content scoring; no
// state persisted. Pure client-side.

import { useEffect, useRef, useState } from "react";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import {
  getSpeechRecognitionSupport,
  createRecognizer,
  type Recognizer,
  type SpeechRecognitionSupport,
} from "@/lib/speechRecognition";

const SAMPLE_ZH = "您好，欢迎光临！";
const SAMPLE_PINYIN = "Nín hǎo, huānyíng guānglín!";
const SAMPLE_VI = "Xin chào, chào mừng đến cửa hàng ạ!";

type SpeakerVote = "untested" | "ok" | "fail";
type MicState = "idle" | "listening" | "result" | "error" | "manual";

function describeBrowser(ua: string): string {
  if (!ua) return "";
  // Order matters: Edge before Chrome before Safari.
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

export default function DeviceCheck() {
  const [ttsSupported, setTtsSupported] = useState<boolean | null>(null);
  const [zhVoices, setZhVoices] = useState<{ name: string; lang: string; local: boolean }[]>([]);
  const [pickedVoice, setPickedVoice] = useState<string | null>(null);
  const [speakerVote, setSpeakerVote] = useState<SpeakerVote>("untested");

  const [recSupport, setRecSupport] = useState<SpeechRecognitionSupport | null>(null);
  const [micState, setMicState] = useState<MicState>("idle");
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [micError, setMicError] = useState<string | null>(null);
  const recRef = useRef<Recognizer | null>(null);

  const [ua, setUa] = useState<string>("");
  const [online, setOnline] = useState<boolean>(true);

  // ---- Probe on mount ----
  useEffect(() => {
    setTtsSupported(speechSupported());
    setRecSupport(getSpeechRecognitionSupport());
    setUa(typeof navigator !== "undefined" ? navigator.userAgent : "");
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const refresh = () => {
        const all = window.speechSynthesis.getVoices() || [];
        const zh = all
          .filter((v) => /^zh/i.test(v.lang || ""))
          .map((v) => ({ name: v.name, lang: v.lang, local: !!v.localService }));
        setZhVoices(zh);
        const picked =
          zh.find((v) => /^zh-cn$/i.test(v.lang))?.name ?? zh[0]?.name ?? null;
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

  // ---- Speaker test ----
  function playSample(slow: boolean) {
    setSpeakerVote("untested");
    speak(SAMPLE_ZH, { rate: slow ? 0.6 : 0.9 });
  }

  // ---- Mic test ----
  function startMic() {
    setMicError(null);
    setTranscript("");
    setConfidence(undefined);
    const rec = createRecognizer({
      onStart: () => setMicState("listening"),
      onEnd: () => setMicState((s) => (s === "listening" ? "idle" : s)),
      onError: (_code, msg) => {
        setMicError(msg);
        setMicState("error");
      },
      onResult: (r) => {
        setTranscript(r.transcript);
        setConfidence(r.confidence);
        setMicState("result");
      },
    });
    recRef.current = rec;
    rec?.start();
  }
  function stopMic() {
    recRef.current?.stop();
    setMicState("idle");
  }

  const browserName = describeBrowser(ua);
  const platform = describePlatform(ua);

  return (
    <div className="space-y-5">
      {/* ============ SPEAKER ============ */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-base font-semibold text-ink">🔊 Kiểm tra loa</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bấm để nghe câu mẫu. Nếu nghe được tức là loa + giọng đọc tiếng Trung hoạt động.
        </p>

        <div className="mt-3 rounded-xl bg-brand-50 p-3">
          <div className="hanzi text-2xl font-semibold text-ink">{SAMPLE_ZH}</div>
          <div className="mt-0.5 text-sm text-gray-500">{SAMPLE_PINYIN}</div>
          <div className="mt-0.5 text-sm text-ink">{SAMPLE_VI}</div>
        </div>

        {ttsSupported === false && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            ⚠️ Trình duyệt này không hỗ trợ đọc văn bản (TTS). Vẫn dùng app được, nhưng sẽ không
            có giọng đọc mẫu. Thử dùng Chrome / Edge.
          </p>
        )}

        {ttsSupported && (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => playSample(false)}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white tap"
              >
                Phát bình thường
              </button>
              <button
                onClick={() => playSample(true)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 tap"
              >
                🐢 Phát chậm
              </button>
              <button
                onClick={stopSpeaking}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-gray-200 tap"
              >
                Dừng
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Giọng đang dùng:{" "}
              <span className="font-medium text-ink">
                {pickedVoice ?? "(trình duyệt sẽ chọn tự động)"}
              </span>
              {zhVoices.length === 0 && (
                <span className="ml-1 text-amber-700">
                  · Không tìm thấy giọng tiếng Trung trên máy — có thể cần cài voice pack zh-CN
                  trong cài đặt hệ điều hành.
                </span>
              )}
              {zhVoices.length > 0 && (
                <span className="ml-1">· Có {zhVoices.length} giọng zh trên máy.</span>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setSpeakerVote("ok")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold tap ${
                  speakerVote === "ok" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                ✓ Nghe được
              </button>
              <button
                onClick={() => setSpeakerVote("fail")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold tap ${
                  speakerVote === "fail" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                ✗ Không nghe được
              </button>
            </div>

            {speakerVote === "fail" && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
                <li>Tăng âm lượng thiết bị + media volume.</li>
                <li>Nếu đeo tai nghe, kiểm tra kết nối Bluetooth/jack.</li>
                <li>Cài voice pack tiếng Trung trong Settings → Languages → Speech (Android).</li>
                <li>Một số trình duyệt không phải Chrome/Edge có thể không có giọng zh-CN.</li>
              </ul>
            )}
          </>
        )}
      </section>

      {/* ============ MIC ============ */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-base font-semibold text-ink">🎤 Kiểm tra micro</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bấm "Bắt đầu nói", đọc to câu bên dưới. Máy sẽ hiển thị nó nghe được gì.
        </p>

        {recSupport && !recSupport.supported ? (
          <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            ⚠️ Trình duyệt này không hỗ trợ nhận diện giọng nói tiếng Trung. Đây là giới hạn của
            trình duyệt, không phải lỗi micro. Trong app, bạn vẫn dùng được nút{" "}
            <strong>“Đánh dấu đã đọc được”</strong> ở mỗi câu luyện đọc — vẫn tính vào tiến độ.
            <br />
            <span className="mt-1 inline-block">
              Thử dùng <strong>Chrome</strong> hoặc <strong>Edge</strong> mới nhất.
            </span>
          </div>
        ) : (
          <>
            <div className="mt-3 rounded-xl bg-brand-50 p-3">
              <div className="text-xs font-semibold text-brand-700">Đọc câu này:</div>
              <div className="hanzi mt-1 text-xl text-ink">{SAMPLE_ZH}</div>
              <div className="text-sm text-gray-500">{SAMPLE_PINYIN}</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {micState !== "listening" ? (
                <button
                  onClick={startMic}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white tap"
                >
                  {micState === "result" || micState === "error" ? "Thử lại" : "Bắt đầu nói"}
                </button>
              ) : (
                <button
                  onClick={stopMic}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 tap"
                >
                  Dừng
                </button>
              )}
            </div>

            {micState === "listening" && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">
                <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                Đang nghe… hãy đọc to câu trên.
              </div>
            )}

            {micState === "result" && (
              <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm">
                <div className="font-semibold text-green-800">✓ Máy đã nghe được:</div>
                <div className="hanzi mt-1 text-lg text-ink">{transcript || "(rỗng)"}</div>
                {confidence !== undefined && (
                  <div className="mt-1 text-xs text-gray-500">
                    Mức tự tin: {(confidence * 100).toFixed(0)}%
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-600">
                  Nếu transcript khác câu mẫu nhiều, không sao — phần luyện đọc của app chấm bằng
                  từ khoá và độ trùng ký tự, không cần khớp 100%.
                </p>
              </div>
            )}

            {micState === "error" && (
              <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                <div className="font-semibold">✗ {micError}</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-800">
                  <li>Vào Settings → Apps → trình duyệt → Permissions → Microphone → Allow.</li>
                  <li>Tắt VPN nếu đang dùng (nhận diện gọi máy chủ Google).</li>
                  <li>Đảm bảo có kết nối internet.</li>
                  <li>Đọc to + gần micro (~20cm), tránh nguồn ồn.</li>
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* ============ DIAGNOSTICS ============ */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-sm font-semibold text-gray-500">Thông tin trình duyệt</h2>
        <dl className="mt-2 space-y-1 text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Trình duyệt</dt>
            <dd className="text-ink">
              {browserName}
              {platform ? ` · ${platform}` : ""}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Hỗ trợ TTS</dt>
            <dd className={ttsSupported ? "text-green-700" : "text-red-700"}>
              {ttsSupported ? "✓ Có" : "✗ Không"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Hỗ trợ nhận diện giọng</dt>
            <dd className={recSupport?.supported ? "text-green-700" : "text-red-700"}>
              {recSupport?.supported ? "✓ Có" : "✗ Không"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Giọng zh trên máy</dt>
            <dd className="text-ink">{zhVoices.length}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Kết nối internet</dt>
            <dd className={online ? "text-green-700" : "text-red-700"}>
              {online ? "✓ Online" : "✗ Offline"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-100">
        <p className="font-semibold">Mẹo nếu micro / loa không chạy:</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>
            Trên Android (kể cả Honor / Huawei tablet): dùng <strong>Chrome</strong> từ Play Store /
            GBox, KHÔNG dùng Honor Browser / Huawei Browser.
          </li>
          <li>
            iOS Safari thường <strong>không hỗ trợ</strong> nhận diện tiếng Trung — đây là giới hạn
            của Safari. Vẫn dùng app được, nhưng phải bấm "Đánh dấu đã đọc được" cho phần luyện
            đọc.
          </li>
          <li>Lần đầu mở: trình duyệt sẽ hỏi quyền micro — phải bấm <strong>Cho phép</strong>.</li>
          <li>Nhận diện gửi audio lên máy chủ Google — cần internet ổn định, không VPN chặn.</li>
        </ul>
      </section>
    </div>
  );
}
