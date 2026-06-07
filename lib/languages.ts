// Shared language config for the Live Translation tool. Phase 2C.1.3.
//
// One source of truth for the supported translation languages, used by both the
// client (UI, STT/TTS, browser translator) and the server (/api/translate
// validation). No secrets, no client-only imports — safe on both sides.
//
// Canonical codes match what Google Cloud Translation v2 accepts directly, so
// no per-provider remapping is needed (zh-CN works as-is). For the Chrome
// on-device Translator (ISO base codes) we down-map zh-CN -> zh.

export type LangCode = "vi" | "zh-CN" | "en" | "ko" | "ja" | "fr";

export type LanguageInfo = {
  code: LangCode;
  labelVi: string;
  flag: string;
  stt: string; // BCP-47 for SpeechRecognition
  tts: string; // BCP-47 for SpeechSynthesis (speakInLang)
  cjk?: boolean; // larger output font for CJK scripts
};

export const LANGUAGES: LanguageInfo[] = [
  { code: "vi", labelVi: "Tiếng Việt", flag: "🇻🇳", stt: "vi-VN", tts: "vi-VN" },
  { code: "zh-CN", labelVi: "Tiếng Trung", flag: "🇨🇳", stt: "zh-CN", tts: "zh-CN", cjk: true },
  { code: "en", labelVi: "Tiếng Anh", flag: "🇬🇧", stt: "en-US", tts: "en-US" },
  { code: "ko", labelVi: "Tiếng Hàn", flag: "🇰🇷", stt: "ko-KR", tts: "ko-KR", cjk: true },
  { code: "ja", labelVi: "Tiếng Nhật", flag: "🇯🇵", stt: "ja-JP", tts: "ja-JP", cjk: true },
  { code: "fr", labelVi: "Tiếng Pháp", flag: "🇫🇷", stt: "fr-FR", tts: "fr-FR" },
];

export const LANG_INFO: Record<LangCode, LanguageInfo> = LANGUAGES.reduce(
  (acc, l) => {
    acc[l.code] = l;
    return acc;
  },
  {} as Record<LangCode, LanguageInfo>
);

/** All codes accepted by /api/translate. */
export const ALLOWED_TRANSLATE_CODES: LangCode[] = ["vi", "zh-CN", "en", "ko", "ja", "fr"];

/** Target languages a learner can pick opposite Vietnamese. */
export const TARGET_LANGUAGES: LanguageInfo[] = LANGUAGES.filter((l) => l.code !== "vi");

export function isAllowedLang(code: string): code is LangCode {
  return (ALLOWED_TRANSLATE_CODES as string[]).includes(code);
}

export function labelOf(code: LangCode): string {
  return LANG_INFO[code]?.labelVi ?? code;
}
export function flagOf(code: LangCode): string {
  return LANG_INFO[code]?.flag ?? "🏳️";
}
export function sttLang(code: LangCode): string {
  return LANG_INFO[code]?.stt ?? "en-US";
}
export function ttsLang(code: LangCode): string {
  return LANG_INFO[code]?.tts ?? code;
}
export function isCjk(code: LangCode): boolean {
  return !!LANG_INFO[code]?.cjk;
}

/** Chrome on-device Translator expects base ISO codes (no region for Chinese). */
export function toBrowserLang(code: LangCode): string {
  return code === "zh-CN" ? "zh" : code;
}
