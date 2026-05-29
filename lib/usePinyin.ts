"use client";

// Global "show pinyin" preference, persisted in localStorage and shared across
// components via a window event so every ChineseLine updates when toggled.

import { useEffect, useState } from "react";

export const PINYIN_KEY = "vdf_chinese_show_pinyin";
const EVT = "vdf-pinyin-change";

export function getShowPinyin(fallback = true): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(PINYIN_KEY);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}

export function setShowPinyin(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PINYIN_KEY, v ? "1" : "0");
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

/** Subscribe to the global pinyin preference. `fallback` is the SSR/default value. */
export function usePinyinPref(fallback = true): boolean {
  const [show, setShow] = useState(fallback);
  useEffect(() => {
    setShow(getShowPinyin(fallback));
    const h = () => setShow(getShowPinyin(fallback));
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, [fallback]);
  return show;
}
