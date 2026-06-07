// Translation engine for /tools/translate. Phase 2B.4 → 2C.1.3 (multilingual).
//
// Two tiers, browser-native first:
//   1. Chrome built-in Translator API (on-device, free, private). Feature-
//      detected; falls through if the pair is unavailable.
//   2. POST /api/translate — secure server route (Google Cloud Translation,
//      enabled only when the server env is configured; no key is ever bundled).
//
// Languages come from lib/languages.ts (vi, zh-CN, en, ko, ja, fr). No
// translation text is ever sent to Supabase; session history is sessionStorage
// only and cleared per the UI's "Xoá lịch sử" action / new session.

import { toBrowserLang, type LangCode } from "@/lib/languages";

export type TranslateOutcome =
  | { status: "ok"; text: string; engine: "browser" | "server" }
  | { status: "not_configured"; message: string }
  | { status: "error"; message: string };

// ---------- Tier 1: Chrome built-in Translator API ----------
/* eslint-disable @typescript-eslint/no-explicit-any */

function translatorGlobal(): any | null {
  if (typeof self === "undefined") return null;
  if ((self as any).Translator) return (self as any).Translator;
  if ((self as any).translation) return (self as any).translation;
  return null;
}

export function browserTranslatorMaybeAvailable(): boolean {
  return translatorGlobal() != null;
}

async function browserTranslate(source: LangCode, target: LangCode, text: string): Promise<string | null> {
  const T = translatorGlobal();
  if (!T) return null;
  const sourceLanguage = toBrowserLang(source);
  const targetLanguage = toBrowserLang(target);
  try {
    if (typeof T.availability === "function" && typeof T.create === "function") {
      const avail = await T.availability({ sourceLanguage, targetLanguage });
      if (avail === "unavailable") return null;
      const translator = await T.create({ sourceLanguage, targetLanguage });
      const out = await translator.translate(text);
      try {
        translator.destroy?.();
      } catch {
        /* ignore */
      }
      return typeof out === "string" ? out : null;
    }
    if (typeof T.canTranslate === "function" && typeof T.createTranslator === "function") {
      const can = await T.canTranslate({ sourceLanguage, targetLanguage });
      if (can === "no") return null;
      const translator = await T.createTranslator({ sourceLanguage, targetLanguage });
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

async function serverTranslate(source: LangCode, target: LangCode, text: string): Promise<TranslateOutcome> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, target, text }),
    });
    const data = (await res.json().catch(() => null)) as
      | { configured?: boolean; translatedText?: string; text?: string; message?: string }
      | null;
    if (!data) return { status: "error", message: "Không nhận được phản hồi từ máy chủ." };
    if (data.configured === false) {
      return {
        status: "not_configured",
        message: data.message ?? "Bản dịch tự động chưa được bật trên máy chủ.",
      };
    }
    const out = data.translatedText ?? data.text;
    if (typeof out === "string" && out.trim()) {
      return { status: "ok", text: out, engine: "server" };
    }
    return { status: "error", message: data.message ?? "Dịch thất bại." };
  } catch {
    return { status: "error", message: "Lỗi kết nối khi dịch." };
  }
}

// ---------- Public API ----------

export async function translateText(source: LangCode, target: LangCode, text: string): Promise<TranslateOutcome> {
  const trimmed = text.trim();
  if (!trimmed) return { status: "error", message: "Chưa có nội dung để dịch." };
  if (source === target) return { status: "error", message: "Hãy chọn hai ngôn ngữ khác nhau." };

  // Tier 1 — browser-native, on-device.
  const native = await browserTranslate(source, target, trimmed);
  if (native && native.trim()) {
    return { status: "ok", text: native, engine: "browser" };
  }

  // Tier 2 — server route.
  return serverTranslate(source, target, trimmed);
}

// ---------- Session history (sessionStorage, current session only) ----------

export type HistoryItem = {
  id: string;
  sourceLang: LangCode;
  targetLang: LangCode;
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
