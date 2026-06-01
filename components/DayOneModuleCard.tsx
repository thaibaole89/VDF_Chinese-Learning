// Dashboard card for one Day-One sub-section. Phase 2A.6.

import Link from "next/link";
import { STATUS_COPY, type SectionStatus } from "@/lib/dayOneModule";

type Props = {
  href: string;
  icon: string;             // emoji
  title: string;
  subtitle: string;
  /** 0..1 — drives the progress bar fill. */
  progress: number;
  /** "x/10" or "67/100" copy beside the bar. */
  progressLabel?: string;
  status: SectionStatus;
  /** When locked, show a small bullet list of remaining prereqs. */
  lockedReasons?: string[];
};

const TONE_BG: Record<SectionStatus, string> = {
  not_started: "bg-white ring-gray-100",
  in_progress: "bg-white ring-brand-100",
  completed: "bg-green-50 ring-green-100",
  locked: "bg-gray-50 ring-gray-200",
};
const BADGE_TONE: Record<SectionStatus, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-brand-100 text-brand-700",
  completed: "bg-green-100 text-green-800",
  locked: "bg-amber-100 text-amber-800",
};
const BAR_TONE: Record<SectionStatus, string> = {
  not_started: "bg-gray-300",
  in_progress: "bg-brand-600",
  completed: "bg-green-500",
  locked: "bg-gray-300",
};

export default function DayOneModuleCard({
  href,
  icon,
  title,
  subtitle,
  progress,
  progressLabel,
  status,
  lockedReasons,
}: Props) {
  const meta = STATUS_COPY[status];
  const locked = status === "locked";
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  const inner = (
    <div className={`rounded-2xl p-4 shadow-sm ring-1 ${TONE_BG[status]} ${locked ? "opacity-90" : ""}`}>
      <div className="flex items-start gap-3">
        {/* Big visual area */}
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${
            locked ? "bg-gray-200" : status === "completed" ? "bg-green-100" : "bg-brand-50"
          }`}
          aria-hidden
        >
          {locked ? "🔒" : icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <h3 className="text-base font-bold text-ink">{title}</h3>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_TONE[status]}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full rounded-full transition-all ${BAR_TONE[status]}`} style={{ width: `${pct}%` }} />
        </div>
        {progressLabel && (
          <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-600">{progressLabel}</span>
        )}
      </div>

      {/* Locked detail / CTA row */}
      {locked && lockedReasons && lockedReasons.length > 0 ? (
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-xs text-amber-800">
          {lockedReasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {locked ? "Mở khoá sau khi đủ điều kiện trên" : status === "completed" ? "Có thể ôn lại bất cứ lúc nào" : ""}
        </span>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            locked
              ? "bg-gray-200 text-gray-500"
              : status === "completed"
                ? "bg-green-600 text-white"
                : "bg-brand-600 text-white"
          }`}
        >
          {meta.cta} {locked ? "" : "→"}
        </span>
      </div>
    </div>
  );

  if (locked) {
    // Locked card is still tappable so the learner can see the locked-screen detail
    // with full prereq list, but visually disabled.
    return (
      <Link href={href} className="block tap" aria-disabled>
        {inner}
      </Link>
    );
  }
  return (
    <Link href={href} className="block tap">
      {inner}
    </Link>
  );
}
