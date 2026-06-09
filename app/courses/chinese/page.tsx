// Chinese course home (Phase 2D). Gives the Chinese course the same hero +
// landing treatment as the English/Korean course homes, while routing into the
// EXISTING rich Chinese surfaces (Day-One, full lesson catalog, certificate,
// Hall of Fame). It only READS the Chinese progress/cert/leaderboard pipeline —
// nothing in that pipeline changes.

import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { computeDayOneEligibility } from "@/lib/dayOneEligibility";
import { computeLearnerDashboard } from "@/lib/learnerDashboard";
import { chineseCourseHeroVisual } from "@/lib/chineseVisuals";
import { COURSES } from "@/lib/courses";
import Visual from "@/components/Visual";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tiếng Trung bán hàng · VDF",
  robots: { index: false, follow: false },
};

const ZH = COURSES.find((c) => c.id === "chinese-sales");

type EntryCard = { href: string; icon: string; label: string; sub: string };

export default async function ChineseCourseHome() {
  if (!isSupabaseConfigured()) return <Hero />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <Hero />;

  const eligibility = await computeDayOneEligibility(supabase);
  const dashboard = await computeLearnerDashboard(supabase, eligibility);

  const zhPct = Math.round(dashboard.required.ratio * 100);
  const zhStarted = dashboard.required.completed > 0 || eligibility.phrasesLearned > 0;
  const zhDone = dashboard.required.remaining === 0 && dashboard.required.total > 0;

  const continueHref = (zhStarted && dashboard.next.href) || "/day-one";
  const continueLabel = zhDone
    ? "Ôn lại lộ trình"
    : zhStarted
      ? dashboard.next.label
        ? `Tiếp tục: ${dashboard.next.label}`
        : "Tiếp tục học"
      : "Bắt đầu Day-One";

  const entries: EntryCard[] = [
    { href: "/day-one", icon: "🌟", label: "Day-One — 10 câu sống còn", sub: "Lộ trình bắt buộc, dẫn tới chứng nhận." },
    { href: "/lessons", icon: "📚", label: "Tất cả bài học", sub: "Bắt buộc · Tự chọn · Tra cứu (ngành hàng, ngữ pháp)." },
    { href: "/certificate/day-one", icon: "🎓", label: "Chứng nhận Day-One", sub: "Nhận chứng nhận khi hoàn thành Day-One." },
    { href: "/hall-of-fame", icon: "🏆", label: "Bảng vinh danh", sub: "Xếp hạng tuần (khoá tiếng Trung)." },
  ];

  return (
    <div className="space-y-5">
      <Hero />

      <div className="flex items-center justify-between text-sm">
        <Link href="/courses" className="font-medium text-brand-700">
          ← Chọn khoá khác
        </Link>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">🇨🇳 中文 · zh-CN</span>
      </div>

      {/* Progress */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Tiến độ tiếng Trung</span>
          <span className="nums text-sm font-bold text-brand-700">{zhPct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${zhPct}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Lộ trình bắt buộc: {dashboard.required.completed}/{dashboard.required.total} bài.
        </p>
      </section>

      {/* Primary CTA */}
      <Link
        href={continueHref}
        className="flex items-center justify-between rounded-2xl bg-brand-600 p-4 text-white shadow-card tap-card"
      >
        <span className="font-semibold">{continueLabel}</span>
        <span aria-hidden>→</span>
      </Link>

      {/* Entry cards into existing Chinese surfaces */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500">Học & ôn tập</h2>
        {entries.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl" aria-hidden>
              {e.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink">{e.label}</div>
              <p className="mt-0.5 text-xs text-gray-600">{e.sub}</p>
            </div>
            <span className="shrink-0 text-brand-600">→</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Hero() {
  return (
    <div className="overflow-hidden rounded-2xl shadow-card-lg">
      <Visual asset={chineseCourseHeroVisual()} variant="header" priority />
      <header className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Khoá học · 中文</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{ZH?.titleVi ?? "Tiếng Trung bán hàng"}</h1>
        <p className="mt-1 text-sm text-brand-100">
          {ZH?.descriptionVi ?? "10 câu sống còn + quy trình bán hàng tại quầy bằng tiếng Trung."}
        </p>
      </header>
    </div>
  );
}
