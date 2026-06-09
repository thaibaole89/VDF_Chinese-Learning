// /courses — multi-course selection dashboard. The canonical logged-in landing
// page (Phase 2C.1.2: "/" and login both land here; the bottom-nav home tab
// points here too).
//
// Reuses the learner's account/dashboard data (name, store, overall Chinese
// progress, next action) so learners see where they are and choose a course.
// Card order: greeting + overall progress → "Chọn khoá học" (Chinese, English) →
// prominent "Tài khoản của tôi" → quick links (Live Translation, Hall of Fame) →
// Manager Dashboard (managers only; /manager is server-role-gated).
//
// Server-rendered; all reads RLS-scoped to the authenticated user. The Chinese
// course progress/cert/leaderboard pipeline is untouched — this only reads it.

import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { computeDayOneEligibility } from "@/lib/dayOneEligibility";
import { computeLearnerDashboard } from "@/lib/learnerDashboard";
import { loadEnglishProgress, englishCourseSummary } from "@/lib/englishProgress";
import EnglishCourseCard from "@/components/EnglishCourseCard";
import KoreanCourseCard from "@/components/KoreanCourseCard";

export const metadata = {
  title: "Khoá học · VDF",
  robots: { index: false, follow: false },
};

// My Account gets its own prominent card below; these are the secondary links.
const QUICK_LINKS = [
  { href: "/tools/translate", icon: "🗣️", label: "Dịch đa ngôn ngữ", sub: "Việt ↔ Trung, Anh, Hàn, Nhật, Pháp khi giao tiếp với khách" },
  { href: "/hall-of-fame", icon: "🏆", label: "Bảng vinh danh", sub: "Xếp hạng tuần (khoá tiếng Trung)" },
];

export default async function CoursesPage() {
  if (!isSupabaseConfigured()) {
    return <UnconfiguredFallback />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <UnconfiguredFallback />;

  const [{ data: profile }, eligibility] = await Promise.all([
    supabase.from("profiles").select("full_name, store, role").eq("id", user.id).maybeSingle(),
    computeDayOneEligibility(supabase),
  ]);
  const [dashboard, englishProgress] = await Promise.all([
    computeLearnerDashboard(supabase, eligibility),
    loadEnglishProgress(supabase),
  ]);
  const enSummary = englishCourseSummary(englishProgress);
  const enStarted = enSummary.learned > 0;
  const enDone = enSummary.total > 0 && enSummary.learned >= enSummary.total;
  const enStatus = enDone ? "Hoàn thành" : enStarted ? "Đang học" : "Chưa bắt đầu";
  const enStatusCls = enDone
    ? "bg-green-100 text-green-800"
    : enStarted
      ? "bg-amber-100 text-amber-800"
      : "bg-gray-100 text-gray-600";
  const enCta = enStarted ? "Tiếp tục học" : "Bắt đầu";

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Bạn";
  const isManager = profile?.role === "manager";

  // Chinese course status from the required-path ratio.
  const zhPct = Math.round(dashboard.required.ratio * 100);
  const zhStarted = dashboard.required.completed > 0 || eligibility.phrasesLearned > 0;
  const zhDone = dashboard.required.remaining === 0 && dashboard.required.total > 0;
  const zhStatus = zhDone ? "Hoàn thành" : zhStarted ? "Đang học" : "Chưa bắt đầu";
  const zhStatusCls = zhDone ? "bg-green-100 text-green-800" : zhStarted ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600";
  const zhCta = zhStarted ? "Tiếp tục học" : "Bắt đầu";
  // Open the Chinese course home (hero + landing), consistent with English/Korean
  // cards. The "continue where you left off" deep-link lives inside that home.
  const zhHref = "/courses/chinese";

  return (
    <div className="space-y-5">
      <header className="pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/vdf-logo.png" alt="VDF — Vietnam Duty Free" width={1772} height={393} className="h-9 w-auto" />
        <h1 className="mt-3 text-xl font-bold text-ink">Xin chào, {displayName}</h1>
        <p className="text-sm text-gray-500">
          {profile?.store ? `Cửa hàng ${profile.store} · ` : ""}Chọn khoá học để bắt đầu.
        </p>
      </header>

      {/* Overall progress (pilot course = Chinese) */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Tiến độ học tập (khoá tiếng Trung)</span>
          <span className="nums text-sm font-bold text-brand-700">{zhPct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${zhPct}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Lộ trình bắt buộc: {dashboard.required.completed}/{dashboard.required.total} bài.
          {dashboard.next.label ? ` Tiếp theo: ${dashboard.next.label}.` : ""}
        </p>
      </section>

      {/* Course cards */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-ink">Chọn khoá học</h2>

        {/* Chinese — server progress */}
        <Link href={zhHref} className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
              🇨🇳
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Tiếng Trung bán hàng</h3>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">Chinese</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                10 câu sống còn + quy trình bán hàng tại quầy bằng tiếng Trung.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${zhStatusCls}`}>{zhStatus}</span>
                <span className="nums text-[11px] text-gray-500">{zhPct}%</span>
              </div>
            </div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${zhPct}%` }} />
          </div>
          <div className="mt-2 text-right text-sm font-semibold text-brand-700">{zhCta} →</div>
        </Link>

        {/* English — server progress (falls back to local client card if unavailable) */}
        {englishProgress.serverOk ? (
          <Link href="/courses/english" className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
                🇬🇧
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">Tiếng Anh bán hàng</h3>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">English</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                  Counter Survival, ngành hàng & sân bay/miễn thuế bằng tiếng Anh (IPA + luyện phát âm).
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${enStatusCls}`}>{enStatus}</span>
                  <span className="nums text-[11px] text-gray-500">{enSummary.pct}%</span>
                </div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${enSummary.pct}%` }} />
            </div>
            <div className="mt-2 text-right text-sm font-semibold text-brand-700">{enCta} →</div>
          </Link>
        ) : (
          <EnglishCourseCard />
        )}

        {/* Korean — local progress (client) */}
        <KoreanCourseCard />
      </section>

      {/* My Account — prominent (profile, progress detail, certificate, reset) */}
      <Link
        href="/account"
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-50 to-white p-4 shadow-card ring-1 ring-brand-100 tap-card"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl" aria-hidden>
          👤
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-ink">Tài khoản của tôi</div>
          <p className="mt-0.5 text-xs text-gray-600">
            Hồ sơ, tiến độ chi tiết, chứng nhận và đặt lại tiến độ — tất cả ở một nơi.
          </p>
        </div>
        <span className="shrink-0 text-brand-600">→</span>
      </Link>

      {/* Quick links */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500">Truy cập nhanh</h2>
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl" aria-hidden>
              {q.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-ink">{q.label}</div>
              <p className="mt-0.5 text-xs text-gray-600">{q.sub}</p>
            </div>
            <span className="shrink-0 text-brand-600">→</span>
          </Link>
        ))}
      </section>

      {/* Manager dashboard card — managers only (/manager is server-role-gated) */}
      {isManager && (
        <Link
          href="/manager"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl" aria-hidden>
            📊
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-ink">Quản lý tiến độ</div>
            <p className="mt-0.5 text-xs text-gray-600">Theo dõi tiến độ học & luyện tập của nhân viên (chỉ quản lý).</p>
          </div>
          <span className="shrink-0 text-brand-600">→</span>
        </Link>
      )}

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Khoá tiếng Trung là khoá pilot chính (có chứng nhận, bảng vinh danh). Tiến độ tiếng Anh đã đồng bộ trên máy chủ.
        Khoá tiếng Hàn đang chờ duyệt nội bộ về ngôn ngữ; tiến độ tiếng Hàn hiện lưu trên thiết bị này.
      </p>
    </div>
  );
}

function UnconfiguredFallback() {
  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-xl font-bold text-ink">Chọn khoá học</h1>
        <p className="text-sm text-gray-500">Chọn ngôn ngữ bạn muốn học để bắt đầu.</p>
      </header>
      <div className="space-y-3">
        <Link href="/courses/chinese" className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
          <span className="text-3xl" aria-hidden>🇨🇳</span>
          <div>
            <div className="font-bold text-ink">Tiếng Trung bán hàng</div>
            <p className="text-xs text-gray-600">10 câu sống còn + quy trình bán hàng tại quầy.</p>
          </div>
        </Link>
        <Link href="/courses/english" className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
          <span className="text-3xl" aria-hidden>🇬🇧</span>
          <div>
            <div className="font-bold text-ink">Tiếng Anh bán hàng</div>
            <p className="text-xs text-gray-600">Counter Survival, ngành hàng & sân bay/miễn thuế.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
