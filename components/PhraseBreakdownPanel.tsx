"use client";

// "Hiểu câu này" — expandable vocabulary + grammar breakdown for one Day-One
// phrase. Phase 2A.7.
//
// Default collapsed (saves vertical space on a long page); when opened, shows
// six sections: tokens, sentence pattern, why-this-order, usage-at-counter,
// replaceable slots, common mistakes, and an optional extra example.
//
// Mobile-first: chip layouts for tokens, no horizontal scroll, generous
// padding for thumb taps. Background is a soft blue card so it sits clearly
// between PhraseCard (white) and VoicePracticePanel (white/colored states).

import { useState } from "react";
import SpeakButton from "@/components/SpeakButton";
import { getDayOneBreakdown } from "@/lib/dayOnePhraseBreakdowns";

export default function PhraseBreakdownPanel({ phraseId }: { phraseId: string }) {
  const [open, setOpen] = useState(false);
  const b = getDayOneBreakdown(phraseId);
  if (!b) return null;

  return (
    <section
      className={`rounded-2xl ring-1 transition-colors ${
        open ? "bg-sky-50 ring-sky-200" : "bg-white ring-gray-100"
      } shadow-sm`}
      aria-label="Hiểu câu này"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left tap"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-base">🧠</span>
          <span className="text-sm font-bold text-ink">Hiểu câu này</span>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
            từ vựng · ngữ pháp · cách dùng
          </span>
        </span>
        <span className={`text-sm text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-5 px-4 pb-4">
          {/* 1. Word-by-word tokens */}
          <Section title="1. Tách từng từ" caption="Bấm 🔊 để nghe phát âm từng tiếng.">
            <ul className="space-y-2">
              {b.tokens.map((t, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-white p-3 ring-1 ring-sky-100"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="hanzi text-xl font-semibold text-ink">{t.zh}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{t.pinyin}</div>
                    </div>
                    <SpeakButton text={t.zh} label="" className="shrink-0" />
                  </div>
                  <div className="mt-1.5 text-sm text-ink">{t.vi}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wide text-sky-700">{t.role}</div>
                </li>
              ))}
            </ul>
          </Section>

          {/* 2. Sentence pattern */}
          <Section title="2. Cấu trúc câu">
            <div className="rounded-xl bg-white p-3 ring-1 ring-sky-100">
              <div className="hanzi text-lg font-semibold text-ink">{b.pattern.zh}</div>
              <div className="mt-1 text-sm text-gray-600">{b.pattern.vi}</div>
            </div>
          </Section>

          {/* 3. Why-this-order */}
          <Section title="3. Vì sao đọc thế">
            <p className="rounded-xl bg-white p-3 text-sm leading-relaxed text-gray-800 ring-1 ring-sky-100">
              {b.whyOrderVi}
            </p>
          </Section>

          {/* 4. Usage at counter */}
          <Section title="4. Cách dùng tại quầy">
            <p className="rounded-xl bg-brand-50 p-3 text-sm leading-relaxed text-ink ring-1 ring-brand-100">
              {b.usageVi}
            </p>
          </Section>

          {/* 5. Replaceable slots */}
          {b.replaceable.length > 0 && (
            <Section title="5. Có thể thay" caption="Từ trong câu có thể đổi cho tình huống khác.">
              <ul className="space-y-3">
                {b.replaceable.map((r, i) => (
                  <li key={i} className="rounded-xl bg-white p-3 ring-1 ring-sky-100">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="hanzi text-base font-semibold text-ink">{r.slot}</div>
                      <span className="text-[11px] uppercase tracking-wide text-sky-700">{r.slotVi}</span>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {r.alternatives.map((a, j) => (
                        <li key={j} className="flex items-baseline gap-2 rounded-lg bg-sky-50 px-2.5 py-1.5">
                          <span className="hanzi text-sm font-semibold text-ink">{a.zh}</span>
                          <span className="text-[11px] text-gray-500">{a.pinyin}</span>
                          <span className="ml-auto text-xs text-ink">{a.vi}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 6. Common mistakes */}
          {b.mistakes.length > 0 && (
            <Section title="6. Lỗi thường gặp">
              <ul className="space-y-2">
                {b.mistakes.map((m, i) => (
                  <li
                    key={i}
                    className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100"
                  >
                    <div className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-amber-700">⚠</span>
                      <div>
                        <div className="text-sm font-semibold text-amber-900">{m.wrongVi}</div>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">{m.noteVi}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* 7. Extra example */}
          {b.extraExample && (
            <Section title="7. Ví dụ thêm">
              <div className="rounded-xl bg-white p-3 ring-1 ring-sky-100">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="hanzi text-base font-semibold text-ink">{b.extraExample.zh}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{b.extraExample.pinyin}</div>
                    <div className="mt-1 text-sm text-ink">{b.extraExample.vi}</div>
                  </div>
                  <SpeakButton text={b.extraExample.zh} label="" className="shrink-0" />
                </div>
                {b.extraExample.noteVi && (
                  <p className="mt-2 text-[11px] italic text-gray-500">{b.extraExample.noteVi}</p>
                )}
              </div>
            </Section>
          )}

          {/* Close shortcut at the bottom for long panels */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-sky-700 ring-1 ring-sky-100 tap"
          >
            ▴ Đóng phần “Hiểu câu này”
          </button>
        </div>
      )}
    </section>
  );
}

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-700">{title}</h4>
      {caption && <p className="mt-0.5 text-[11px] text-gray-500">{caption}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
