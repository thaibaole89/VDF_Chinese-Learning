// Translation engine for /tools/translate. Phase 2B.4.
//
// Two tiers, browser-native first (per spec "use browser-native capabilities
// first"):
//   1. Chrome built-in Translator API (on-device, free, private). Chrome 138+.
//      Feature-detected at runtime; if the vi↔zh pair is unavailable it falls
//      through to tier 2.
//   2. POST /api/translate — a SECURE SERVER STUB. It returns
//      { configured: false } until a translation provider is explicitly wired
//      (no API key is bundled or hardcoded anywhere; the key, if ever added,
//      lives only in server env). See app/api/translate/route.ts.
//
// No translation text is ever sent to Supabase. Session history is localStorage
// only and cleared per the UI's "Xoá lịch sử" action / new session.

export type Lang = "vi" | "zh";

export type Direction = "vi2zh" | "zh2vi";

export function directionLangs(dir: Direction): { source: Lang; target: Lang } {
  return dir === "vi2zh" ? { source: "vi", target: "zh" } : { source: "zh", target: "vi" };
}

export const STT_LANG: Record<Lang, string> = { vi: "vi-VN", zh: "zh-CN" };

export type TranslateOutcome =
  | { status: "ok"; text: string; engine: "browser" | "server" }
  | { status: "not_configured"; message: string }
  | { status: "error"; message: string };

// ---------- Tier 1: Chrome built-in Translator API ----------
/* eslint-disable @typescript-eslint/no-explicit-any */

function translatorGlobal(): any | null {
  if (typeof self === "undefined") return null;
  // Stable shape (Chrome 138+): global `Translator`.
  if ((self as any).Translator) return (self as any).Translator;
  // Older experimental shape: `translation.createTranslator`.
  if ((self as any).translation) return (self as any).translation;
  return null;
}

export function browserTranslatorMaybeAvailable(): boolean {
  return translatorGlobal() != null;
}

async function browserTranslate(source: Lang, target: Lang, text: string): Promise<string | null> {
  const T = translatorGlobal();
  if (!T) return null;
  try {
    // Stable API
    if (typeof T.availability === "function" && typeof T.create === "function") {
      const avail = await T.availability({ sourceLanguage: source, targetLanguage: target });
      if (avail === "unavailable") return null;
      const translator = await T.create({ sourceLanguage: source, targetLanguage: target });
      const out = await translator.translate(text);
      try {
        translator.destroy?.();
      } catch {
        /* ignore */
      }
      return typeof out === "string" ? out : null;
    }
    // Experimental API
    if (typeof T.canTranslate === "function" && typeof T.createTranslator === "function") {
      const can = await T.canTranslate({ sourceLanguage: source, targetLanguage: target });
      if (can === "no") return null;
      const translator = await T.createTranslator({ sourceLanguage: source, targetLanguage: target });
      const out = await translator.translate(text);
      return typeof out === "string" ? out : null;
    }
  } catch {
    return null;
  }
  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------- Tier 2: server route ----------

async function serverTranslate(
  source: Lang,
  target: Lang,
  text: string
): Promise<TranslateOutcome> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, target, text }),
    });
    const data = (await res.json().catch(() => null)) as
      | { configured?: boolean; text?: string; message?: string }
      | null;
    if (!data) return { status: "error", message: "Không nhận được phản hồi từ máy chủ." };
    if (data.configured === false) {
      return {
        status: "not_configured",
        message: data.message ?? "Bản dịch tự động chưa được bật trên máy chủ.",
      };
    }
    if (typeof data.text === "string") {
      return { status: "ok", text: data.text, engine: "server" };
    }
    return { status: "error", message: data.message ?? "Dịch thất bại." };
  } catch {
    return { status: "error", message: "Lỗi kết nối khi dịch." };
  }
}

// ---------- Public API ----------

export async function translateText(dir: Direction, text: string): Promise<TranslateOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { status: "error", message: "Chưa có nội dung để dịch." };
  const { source, target } = directionLangs(dir);

  // Tier 1 — browser-native, on-device.
  const native = await browserTranslate(source, target, trimmed);
  if (native && native.trim()) {
    return { status: "ok", text: native, engine: "browser" };
  }

  // Tier 2 — server route (currently a not-configured stub).
  return serverTranslate(source, target, trimmed);
}

// ---------- Session history (localStorage, current session only) ----------

export type HistoryItem = {
  id: string;
  dir: Direction;
  source: string;
  target: string;
  engine: "browser" | "server";
  at: number;
};

const HISTORY_KEY = "vdf_translate_session";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(item: Omit<HistoryItem, "id" | "at">): HistoryItem[] {
  if (typeof window === "undefined") return [];
  const list = loadHistory();
  // No Date.now in some sandboxes during build, but this only runs in the
  // browser at interaction time, so it's safe here.
  const entry: HistoryItem = { ...item, id: `${list.length}-${Date.now()}`, at: Date.now() };
  const next = [entry, ...list].slice(0, 50);
  try {
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}
