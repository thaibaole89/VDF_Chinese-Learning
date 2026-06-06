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

// ---- learner-chosen Chinese voice ----
export const ZH_VOICE_KEY = "vdf_zh_voice";

export function getPreferredZhVoiceURI(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ZH_VOICE_KEY) || null;
  } catch {
    return null;
  }
}

export function setPreferredZhVoiceURI(uri: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (uri) window.localStorage.setItem(ZH_VOICE_KEY, uri);
    else window.localStorage.removeItem(ZH_VOICE_KEY);
  } catch {
    /* ignore */
  }
}

/** All available Chinese voices on this device (for the voice picker). */
export function listZhVoices(): { voiceURI: string; name: string; lang: string; localService: boolean }[] {
  if (!speechSupported()) return [];
  try {
    return window.speechSynthesis
      .getVoices()
      .filter((v) => /^zh/i.test(v.lang || ""))
      .map((v) => ({ voiceURI: v.voiceURI, name: v.name, lang: v.lang, localService: !!v.localService }));
  } catch {
    return [];
  }
}

/** The voice to speak Chinese with: the learner's choice if available, else the
    auto-ranked best. */
function chosenChineseVoice(): SpeechSynthesisVoice | undefined {
  const uri = getPreferredZhVoiceURI();
  if (uri) {
    try {
      const v = window.speechSynthesis.getVoices().find((x) => x.voiceURI === uri);
      if (v) return v;
    } catch {
      /* fall through to auto */
    }
  }
  return cachedVoice ?? pickChineseVoice();
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
    const voice = chosenChineseVoice();
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

/**
 * Speak text in an arbitrary language (translation tool). Picks the best voice
 * whose lang matches the prefix (e.g. "zh", "vi"); reuses the ranked Chinese
 * voice for zh. Falls back to setting the utterance lang only. Does not touch
 * the zh-CN-specific `speak()` used by voice practice.
 */
export function speakInLang(text: string, lang: string): void {
  if (!speechSupported() || !text || !text.trim()) return;
  warmVoices();
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const prefix = lang.toLowerCase().slice(0, 2);
    u.lang = prefix === "zh" ? "zh-CN" : prefix === "vi" ? "vi-VN" : lang;
    u.rate = getSlowSpeech() ? 0.7 : 0.9;
    u.pitch = 1;
    let voice: SpeechSynthesisVoice | undefined;
    if (prefix === "zh") {
      voice = chosenChineseVoice();
    } else {
      try {
        const voices = window.speechSynthesis.getVoices();
        voice =
          voices.find((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(`${prefix}-`)) ??
          voices.find((v) => (v.lang || "").toLowerCase().startsWith(prefix));
      } catch {
        voice = undefined;
      }
    }
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    /* never crash the UI over TTS */
  }
}
