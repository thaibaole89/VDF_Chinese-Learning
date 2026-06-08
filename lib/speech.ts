// lib/speech.ts — device Web Speech TTS with per-language voice ranking.
// Client-side only. Safe no-ops during SSR or when unsupported.
//
// 2C.1.5: generalised from "Chinese-only" to per-language. For each language
// (zh, en, ko, …) the app ranks and caches the best available device voice and
// lets the learner override it (saved per language in localStorage). This fixes
// Korean reading (it now picks a real ko-KR voice / the learner's choice instead
// of the first arbitrary match). Still 100% device-based — no API, no cost.

let warmed = false;
const bestCache = new Map<string, SpeechSynthesisVoice | null>();

const SLOW_KEY = "vdf_chinese_slow_speech";
const SLOW_EVT = "vdf-slow-change";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// ---------- per-language voice ranking ----------
// region = the most-preferred BCP-47 tag; names = high-quality voice names
// (best first). Covers Apple / Google / Microsoft across Chrome/Edge/Safari/iOS.
type VoicePref = { region: string; names: string[] };

const VOICE_PREF: Record<string, VoicePref> = {
  zh: {
    region: "zh-cn",
    names: [
      "yunyang", "xiaoxiao", "xiaoyi", "yunxi", "yunjian", // MS neural
      "tingting", "ting-ting", "meijia", "mei-jia", // Apple
      "google 普通话", "google zh", "中文（中国大陆", "chinese (china", "mandarin",
      "huihui", "kangkang",
    ],
  },
  en: {
    region: "en-us",
    names: [
      "samantha", "aria", "jenny", "ava", "allison", "evan", "guy", // Apple/MS neural
      "google us english", "google uk english",
      "michelle", "zira", "david", "mark", "siri", "alex", "daniel", "tom",
      "natural", "neural", "enhanced",
    ],
  },
  ko: {
    region: "ko-kr",
    names: [
      "yuna", "유나", "sora", "수진", "지수", // Apple
      "google 한국", "google ko", "korean", "한국어", "한국의",
      "sun-hi", "sunhi", "heami", "혜미", "injoon", "인준", "bongjin", // MS
      "natural", "neural", "enhanced", "siri",
    ],
  },
  ja: {
    region: "ja-jp",
    names: ["kyoko", "otoya", "o-ren", "google 日本語", "japanese", "nanami", "keita", "ayumi", "ichiro", "natural", "neural"],
  },
  fr: {
    region: "fr-fr",
    names: ["amelie", "amélie", "thomas", "audrey", "google français", "french", "denise", "henri", "natural", "neural"],
  },
};

// Score a voice for a language. The genuinely "native-like" AND reliable web
// voices are the NETWORK natural ones (Google on Chrome/Android, Microsoft
// "Online (Natural)" on Edge) — so they win by default. Apple's robotic local
// defaults (Samantha, compact) are pushed down; premium/Siri Apple voices score
// well but the speak() watchdog rescues them if they play silently.
function scoreVoiceFor(prefix: string, v: SpeechSynthesisVoice): number {
  const lang = (v.lang || "").toLowerCase().replace("_", "-");
  if (!lang.startsWith(prefix)) return -1;
  const name = (v.name || "").toLowerCase();
  const pref = VOICE_PREF[prefix];
  let s = pref && lang === pref.region ? 60 : 20; // prefer the main region
  if (v.localService === false) s += 50; // network = natural + reliable (Google / MS Online)
  if (/natural|online/.test(name)) s += 30;
  if (name.includes("google")) s += 25;
  if (/neural|enhanced|premium/.test(name)) s += 12;
  if (name.includes("siri")) s += 8;
  if (/compact|espeak|low|reduced|novelty|eloquence|whisper|organ|bells|bubbles|wobble/.test(name)) s -= 60;
  if (pref) {
    const idx = pref.names.findIndex((p) => name.includes(p)); // curated names = tie-break
    if (idx >= 0) s += pref.names.length - idx;
  }
  return s;
}

function pickBestVoiceFor(prefix: string): SpeechSynthesisVoice | undefined {
  try {
    const voices = window.speechSynthesis.getVoices();
    let best: SpeechSynthesisVoice | undefined;
    let bestScore = 0;
    for (const v of voices) {
      const sc = scoreVoiceFor(prefix, v);
      if (sc > bestScore) {
        bestScore = sc;
        best = v;
      }
    }
    return best;
  } catch {
    return undefined;
  }
}

// ---------- learner-chosen voice (per language) ----------
function prefKey(prefix: string): string {
  return `vdf_voice_${prefix}`;
}
const LEGACY_ZH_KEY = "vdf_zh_voice";

export function getPreferredVoiceURI(prefix: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(prefKey(prefix));
    if (v) return v;
    if (prefix === "zh") return window.localStorage.getItem(LEGACY_ZH_KEY) || null; // migrate old key
    return null;
  } catch {
    return null;
  }
}

export function setPreferredVoiceURI(prefix: string, uri: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (uri) window.localStorage.setItem(prefKey(prefix), uri);
    else {
      window.localStorage.removeItem(prefKey(prefix));
      if (prefix === "zh") window.localStorage.removeItem(LEGACY_ZH_KEY);
    }
  } catch {
    /* ignore */
  }
}

/** Available voices for a language prefix (for the voice picker), best first. */
export function listVoices(prefix: string): { voiceURI: string; name: string; lang: string; localService: boolean }[] {
  if (!speechSupported()) return [];
  try {
    return window.speechSynthesis
      .getVoices()
      .filter((v) => (v.lang || "").toLowerCase().startsWith(prefix))
      .map((v) => ({ v, sc: scoreVoiceFor(prefix, v) }))
      .sort((a, b) => b.sc - a.sc)
      .map(({ v }) => ({ voiceURI: v.voiceURI, name: v.name, lang: v.lang, localService: !!v.localService }));
  } catch {
    return [];
  }
}

/** The voice to use for a language: learner's choice if available, else the
    auto-ranked best (cached). */
function chosenVoiceFor(prefix: string): SpeechSynthesisVoice | undefined {
  const uri = getPreferredVoiceURI(prefix);
  if (uri) {
    try {
      const v = window.speechSynthesis.getVoices().find((x) => x.voiceURI === uri);
      if (v) return v;
    } catch {
      /* fall through to auto */
    }
  }
  if (!bestCache.has(prefix)) bestCache.set(prefix, pickBestVoiceFor(prefix) ?? null);
  return bestCache.get(prefix) ?? undefined;
}

function warmVoices() {
  if (warmed || !speechSupported()) return;
  warmed = true;
  try {
    window.speechSynthesis.addEventListener?.("voiceschanged", () => bestCache.clear());
  } catch {
    /* ignore */
  }
}

// ---------- backward-compatible Chinese helpers ----------
export const ZH_VOICE_KEY = LEGACY_ZH_KEY;
export function getPreferredZhVoiceURI(): string | null {
  return getPreferredVoiceURI("zh");
}
export function setPreferredZhVoiceURI(uri: string | null): void {
  setPreferredVoiceURI("zh", uri);
}
export function listZhVoices() {
  return listVoices("zh");
}

// ---------- slow-speech preference ----------
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

// Per-language default speaking rate. CJK/Korean read clearer a touch slower.
function defaultRate(prefix: string): number {
  const slow = getSlowSpeech();
  if (prefix === "zh") return slow ? 0.6 : 0.85;
  if (prefix === "ko" || prefix === "ja") return slow ? 0.65 : 0.85;
  return slow ? 0.7 : 0.92;
}

/** Speak Chinese text (voice practice). Cancels any current utterance first. */
// Core speak with a silence watchdog. Some device voices (notably Apple
// premium/Siri voices) appear in the list but produce NO audio when assigned to
// a web utterance. If the chosen voice hasn't started speaking within a short
// window, we re-speak the same text with the system-default voice for that
// language so the learner always hears something.
function speakCore(text: string, langTag: string, prefix: string, rate: number): void {
  warmVoices();
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  const make = (withVoice: boolean): SpeechSynthesisUtterance => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langTag;
    u.rate = rate;
    u.pitch = 1;
    if (withVoice) {
      const v = chosenVoiceFor(prefix);
      if (v) {
        u.voice = v;
        if (v.lang) u.lang = v.lang; // match the chosen voice's exact tag
      }
    }
    return u;
  };

  try {
    const u = make(true);
    let started = false;
    let fellBack = false;
    u.onstart = () => {
      started = true;
    };
    // Only guard when a specific (non-default) voice was assigned.
    if (u.voice) {
      window.setTimeout(() => {
        if (started || fellBack) return;
        fellBack = true;
        try {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(make(false)); // system default voice for langTag
        } catch {
          /* ignore */
        }
      }, 500);
    }
    window.speechSynthesis.speak(u);
  } catch {
    /* never crash the UI over TTS */
  }
}

/** Speak Chinese text (voice practice). Cancels any current utterance first. */
export function speak(text: string, opts?: { rate?: number }): void {
  if (!speechSupported() || !text || !text.trim()) return;
  speakCore(text, "zh-CN", "zh", opts?.rate ?? defaultRate("zh"));
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
 * Speak text in a given language. Picks the learner's chosen voice for that
 * language (or the auto-ranked best), so English/Korean/etc. read with a proper
 * native voice — not the first arbitrary match. Falls back to the system voice
 * if the chosen one plays silently. `lang` may be a prefix ("en") or a full tag
 * ("en-US", "ko-KR").
 */
export function speakInLang(text: string, lang: string): void {
  if (!speechSupported() || !text || !text.trim()) return;
  const prefix = lang.toLowerCase().slice(0, 2);
  const fullTag = lang.includes("-") ? lang : VOICE_PREF[prefix]?.region;
  const langTag = prefix === "zh" ? "zh-CN" : prefix === "vi" ? "vi-VN" : fullTag ?? lang;
  speakCore(text, langTag, prefix, defaultRate(prefix));
}
