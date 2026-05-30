// lib/speech.ts — zh-CN pronunciation via the browser Web Speech API.
// Client-side only. Safe no-ops during SSR or when unsupported.
//
// Improvements: rank and cache the highest-quality available Chinese voice
// (Apple Tingting, Google Mandarin, MS neural Xiaoxiao/Yunyang, etc.), and a
// global "slow speech" preference for beginners. Still 100% device-based —
// no API, no backend, no cost. (For a fully natural, device-independent voice
// see PHASE_2_ROADMAP.md → pre-generated neural audio.)

let warmed = false;
let cachedVoice: SpeechSynthesisVoice | null = null;

const SLOW_KEY = "vdf_chinese_slow_speech";
const SLOW_EVT = "vdf-slow-change";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Higher score = better. Names checked best-first (covers Edge/Chrome/Safari/iOS).
const PREFERRED = [
  "yunyang", "xiaoxiao", "xiaoyi", "yunxi", "yunjian", // MS neural (zh-CN)
  "tingting", "ting-ting", "meijia", "mei-jia", // Apple
  "google 普通话", "google zh", "中文（中国大陆", "chinese (china", "mandarin", // Google/Chrome
  "huihui", "kangkang", // older MS
];

function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = (v.lang || "").toLowerCase().replace("_", "-");
  const name = (v.name || "").toLowerCase();
  if (!lang.startsWith("zh")) return -1;
  let s = lang === "zh-cn" ? 100 : 40; // strongly prefer mainland Mandarin
  const idx = PREFERRED.findIndex((p) => name.includes(p));
  if (idx >= 0) s += (PREFERRED.length - idx) * 5;
  if (name.includes("google")) s += 20;
  if (name.includes("siri") || name.includes("premium") || name.includes("neural")) s += 15;
  if (/compact|espeak|low|reduced/.test(name)) s -= 30;
  if (v.localService === false) s += 5; // network voices are usually richer
  return s;
}

function pickChineseVoice(): SpeechSynthesisVoice | undefined {
  try {
    const voices = window.speechSynthesis.getVoices();
    let best: SpeechSynthesisVoice | undefined;
    let bestScore = 0;
    for (const v of voices) {
      const sc = scoreVoice(v);
      if (sc > bestScore) { bestScore = sc; best = v; }
    }
    return best;
  } catch {
    return undefined;
  }
}

function warmVoices() {
  if (warmed || !speechSupported()) return;
  warmed = true;
  try {
    cachedVoice = pickChineseVoice() ?? null;
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      cachedVoice = pickChineseVoice() ?? null;
    });
  } catch {
    /* ignore */
  }
}

// ---- slow-speech preference ----
export function getSlowSpeech(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SLOW_KEY) === "1";
  } catch {
    return false;
  }
}
export function setSlowSpeech(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SLOW_KEY, v ? "1" : "0");
    window.dispatchEvent(new Event(SLOW_EVT));
  } catch {
    /* ignore */
  }
}
export const SLOW_EVENT = SLOW_EVT;

/** Speak Chinese text. Cancels any current utterance first. */
export function speak(text: string, opts?: { rate?: number }): void {
  if (!speechSupported() || !text || !text.trim()) return;
  warmVoices();
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = opts?.rate ?? (getSlowSpeech() ? 0.6 : 0.85);
    u.pitch = 1;
    const voice = cachedVoice ?? pickChineseVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    /* never crash the UI over TTS */
  }
}

export function stopSpeaking(): void {
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
