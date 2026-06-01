// Shared header + footer nav for the 4 Day-One sub-routes. Phase 2A.6.
// Mobile-first. Always shows: "← Day-One" link at the top + previous/next
// (or back to dashboard) at the bottom.

import Link from "next/link";
import { SECTION_ORDER, SECTION_TITLES, type Section } from "@/lib/dayOneModule";

const SECTION_HREF: Record<Section, string> = {
  phrases: "/day-one/phrases",
  dialogue: "/day-one/dialogue",
  roleplay: "/day-one/roleplay",
  quiz: "/day-one/quiz",
};

export function DayOneSectionHeader({
  section,
  badge,
}: {
  section: Section;
  /** Optional pill on the right of the title (e.g. "Đã hoàn thành"). */
  badge?: { label: string; tone: "neutral" | "success" | "warning" };
}) {
  const meta = SECTION_TITLES[section];
  const tone = badge
    ? badge.tone === "success"
      ? "bg-green-100 text-green-800"
      : badge.tone === "warning"
        ? "bg-amber-100 text-amber-800"
        : "bg-gray-100 text-gray-700"
    : "";
  return (
    <header className="pt-2">
      <div className="flex items-center justify-between gap-2">
        <Link href="/day-one" className="text-sm text-brand-600">
          ← Day-One
        </Link>
        {badge && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
            {badge.label}
          </span>
        )}
      </div>
      <h1 className="mt-1 text-xl font-bold text-ink">{meta.vi}</h1>
      <p className="text-sm text-gray-500">{meta.subtitle}</p>
    </header>
  );
}

export function DayOneSectionFooter({
  section,
  hideNext = false,
}: {
  section: Section;
  /** When true (e.g. on quiz locked screen), only the dashboard link is shown. */
  hideNext?: boolean;
}) {
  const idx = SECTION_ORDER.indexOf(section);
  const prev = idx > 0 ? SECTION_ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < SECTION_ORDER.length - 1 ? SECTION_ORDER[idx + 1] : null;

  return (
    <nav className="mt-4 flex flex-col gap-2" aria-label="Điều hướng Day-One">
      <div className="grid grid-cols-2 gap-2">
        {prev ? (
          <Link
            href={SECTION_HREF[prev]}
            className="rounded-xl bg-gray-100 px-3 py-3 text-center text-sm font-medium text-gray-700 tap"
          >
            ← {SECTION_TITLES[prev].vi}
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {!hideNext && next ? (
          <Link
            href={SECTION_HREF[next]}
            className="rounded-xl bg-brand-600 px-3 py-3 text-center text-sm font-semibold text-white tap"
          >
            {SECTION_TITLES[next].vi} →
          </Link>
        ) : (
          <span aria-hidden />
        )}
      </div>
      <Link
        href="/day-one"
        className="rounded-xl bg-white px-3 py-2.5 text-center text-sm font-medium text-brand-600 ring-1 ring-brand-100 tap"
      >
        ⌂ Về Day-One dashboard
      </Link>
    </nav>
  );
}
