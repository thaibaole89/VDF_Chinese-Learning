// lib/speech.ts — zh-CN pronunciation via the browser Web Speech API.
// Client-side only. Safe no-ops during SSR or when unsupported.

let warmed = false;

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Voices load asynchronously in some browsers; touch them once so the first
// `speak()` has a chance to pick a Chinese voice.
function warmVoices() {
  if (warmed || !speechSupported()) return;
  warmed = true;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      // no-op; cached internally by the browser
    });
  } catch {
    /* ignore */
  }
}

function pickChineseVoice(): SpeechSynthesisVoice | undefined {
  try {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang?.toLowerCase() === "zh-cn") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("zh"))
    );
  } catch {
    return undefined;
  }
}

/** Speak Chinese text. Cancels any current utterance first. */
export function speak(text: string, opts?: { rate?: number }): void {
  if (!speechSupported() || !text || !text.trim()) return;
  warmVoices();
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = opts?.rate ?? 0.9;
    u.pitch = 1;
    const voice = pickChineseVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore — never crash the UI over TTS */
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
