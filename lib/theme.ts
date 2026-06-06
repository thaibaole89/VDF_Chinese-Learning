// Theme preference (light / dark / auto). Client-only.
//
// "auto" → dark from 18:00 to 06:00 (local time), light during the day, per the
// product request "sau 6h tối mở app sẽ hiển thị dark theme". Default is "auto"
// so a fresh user gets dark in the evening with no action.
//
// The actual <html class="dark"> toggle happens in two places that MUST stay in
// sync with resolveDark(): the no-FOUC inline script in app/layout.tsx (runs
// before paint) and applyTheme() here (runs on user change).

export type ThemePref = "light" | "dark" | "auto";

export const THEME_KEY = "vdf_theme";
export const DARK_START_HOUR = 18; // 6 PM
export const DARK_END_HOUR = 6; // 6 AM

export function getThemePref(): ThemePref {
  if (typeof window === "undefined") return "auto";
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" || v === "auto" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function setThemePref(pref: ThemePref): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* ignore */
  }
  applyTheme(pref);
}

/** Whether the given preference resolves to dark right now. */
export function resolveDark(pref: ThemePref, hour: number): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return hour >= DARK_START_HOUR || hour < DARK_END_HOUR; // auto
}

export function applyTheme(pref: ThemePref): void {
  if (typeof document === "undefined") return;
  const dark = resolveDark(pref, new Date().getHours());
  document.documentElement.classList.toggle("dark", dark);
}
