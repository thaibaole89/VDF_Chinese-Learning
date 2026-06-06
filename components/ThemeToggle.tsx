"use client";

// Theme selector: Sáng / Tối / Tự động. Phase: dark-theme.
// "Tự động" follows the clock (dark 18:00–06:00). Choice persists in
// localStorage and applies immediately. The no-FOUC script in app/layout.tsx
// applies the saved choice before paint on every load.

import { useEffect, useState } from "react";
import { getThemePref, setThemePref, type ThemePref } from "@/lib/theme";

const OPTIONS: { value: ThemePref; label: string; icon: string }[] = [
  { value: "light", label: "Sáng", icon: "☀️" },
  { value: "dark", label: "Tối", icon: "🌙" },
  { value: "auto", label: "Tự động", icon: "🕕" },
];

export default function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPref(getThemePref());
    setMounted(true);
  }, []);

  function choose(p: ThemePref) {
    setPref(p);
    setThemePref(p); // persists + applies <html class="dark">
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-ink">Giao diện</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            “Tự động” bật nền tối từ 18h tối đến 6h sáng.
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Chọn giao diện">
        {OPTIONS.map((o) => {
          const active = mounted && pref === o.value;
          return (
            <button
              key={o.value}
              onClick={() => choose(o.value)}
              aria-pressed={active}
              className={`rounded-xl px-2 py-2.5 text-sm font-semibold tap ${
                active ? "bg-brand-600 text-white shadow-card" : "bg-gray-50 text-gray-700"
              }`}
            >
              <span className="mr-1" aria-hidden>
                {o.icon}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
