// Renders a lesson's grammar / sentence-building tips. Phase 2C.1.6.
// Pure presentational; used by the English, Korean and Chinese lesson views.

import type { GrammarTip } from "@/lib/grammar";

export default function GrammarTips({ tips, cjk = false }: { tips?: GrammarTip[]; cjk?: boolean }) {
  if (!tips || tips.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500">🧩 Ngữ pháp & cách ghép câu</h2>
      {tips.map((t, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
          <div className="text-sm font-bold text-ink">{t.titleVi}</div>
          {t.pattern && (
            <div
              className={`mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 ${cjk ? "hanzi" : "font-mono"}`}
            >
              {t.pattern}
            </div>
          )}
          <p className="mt-2 text-sm text-gray-700">{t.bodyVi}</p>
          {t.examples && t.examples.length > 0 && (
            <ul className="mt-2 space-y-1">
              {t.examples.map((ex, j) => (
                <li key={j} className="text-sm leading-relaxed">
                  <span className={cjk ? "hanzi text-ink" : "font-medium text-ink"}>{ex.text}</span>
                  {ex.gloss && <span className="ml-1 text-xs italic text-gray-400">{ex.gloss}</span>}
                  <span className="text-gray-600"> — {ex.vi}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
