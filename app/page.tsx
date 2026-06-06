"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress, getFlashcards, getQuizAttempts, defaultProgress } from "@/lib/storage";
import { getReviewStats } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";
import type { ReviewStats } from "@/lib/types";
import ProgressSummary from "@/components/ProgressSummary";
import Visual from "@/components/Visual";
import { getVisualForCategory } from "@/lib/visuals";

// Primary feature cards (always visible to authenticated users). Day-One is the
// hero card above; these are cards 2–4 of the spec's order.
const FEATURES = [
  {
    href: "/tools/translate",
    icon: "🗣️",
    title: "Công cụ dịch trực tiếp",
    subtitle: "Nói hoặc gõ — dịch nhanh Việt ↔ Trung để giao tiếp với khách.",
  },
  {
    href: "/hall-of-fame",
    icon: "🏆",
    title: "Bảng vinh danh",
    subtitle: "Xem xếp hạng học tập tuần này và thành tích nổi bật.",
  },
  {
    href: "/account",
    icon: "👤",
    title: "Tài khoản",
    subtitle: "Tiến độ khoá học, chứng nhận và gợi ý bước học tiếp theo.",
  },
];

const QUICK_ACTIONS = [
  { href: "/flashcards", label: "Thẻ ghi nhớ", icon: "🃏" },
  { href: "/roleplay", label: "Đóng vai", icon: "🎭" },
  { href: "/search", label: "Tìm câu / từ", icon: "🔍" },
  { href: "/references", label: "Phát âm thương hiệu", icon: "🏷️" },
];

function FeatureCard({
  href,
  icon,
  title,
  subtitle,
  accent = false,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl p-4 shadow-card ring-1 tap-card ${
        accent ? "bg-gradient-to-r from-brand-50 to-white ring-brand-100" : "bg-white ring-gray-100"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl ${
          accent ? "bg-brand-100" : "bg-brand-50"
        }`}
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-ink">{title}</div>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{subtitle}</p>
      </div>
      <span className="shrink-0 text-brand-600">→</span>
    </Link>
  );
}

export default function Home() {
  const [stats, setStats] = useState<ReviewStats>(() => getReviewStats(defaultProgress(), {}, []));
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    setStats(getReviewStats(getProgress(), getFlashcards(), getQuizAttempts()));
  }, []);

  // Client-side role lookup for the manager card. This is COSMETIC only — the
  // /manager route itself is server-role-gated (lib/managerDashboard), so hiding
  // the card is not a security boundary. Defaults to hidden until confirmed.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const sb = createClient();
        const {
          data: { user },
        } = await sb.auth.getUser();
        if (!user || !active) return;
        const { data } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (active) setIsManager(data?.role === "manager");
      } catch {
        /* ignore — card just stays hidden */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <header className="pt-2">
        {/* Official VDF logo (Horizontal Ver 01) provided by the brand owner. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vdf-logo.png"
          alt="VDF — Vietnam Duty Free"
          width={1772}
          height={393}
          className="h-10 w-auto"
        />
        <h1 className="sr-only">VDF Chinese Sales Tutor</h1>
        <p className="mt-2 text-sm text-gray-500">Tiếng Trung dùng ngay tại quầy duty-free</p>
      </header>

      {/* Course picker entry — prominent, so returning learners can switch course. */}
      <Link
        href="/courses"
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-50 to-white p-4 shadow-card ring-1 ring-brand-100 tap-card"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl" aria-hidden>
          🎓
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-ink">Chọn khoá học</div>
          <p className="mt-0.5 text-xs text-gray-600">Tiếng Trung 🇨🇳 hoặc Tiếng Anh 🇬🇧 — chọn để bắt đầu.</p>
        </div>
        <span className="shrink-0 text-brand-600">→</span>
      </Link>

      {/* Card 1 — Bài học hôm nay (Day-One survival, khoá tiếng Trung) */}
      <Link href="/day-one" className="block overflow-hidden rounded-2xl shadow-card-lg tap-card">
        <Visual asset={getVisualForCategory("day_one_survival")} variant="header" priority />
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vdf-logo-white.png" alt="" width={1772} height={393} className="mb-3 h-5 w-auto opacity-95" />
          <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Bài học hôm nay</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-balance">10 câu sống còn tại quầy</div>
          <p className="mt-1 text-sm text-brand-100">Thuộc 10 câu cốt lõi để xử lý một giao dịch cơ bản.</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="nums rounded-full bg-white/15 px-3 py-1 text-sm">
              {stats.dayOneCompleted}/{stats.dayOneTotal} câu
            </span>
            <span className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-[#0f172a]">Học 5 phút →</span>
          </div>
        </div>
      </Link>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Tiến độ của bạn</h2>
        <ProgressSummary stats={stats} />
      </section>

      {/* Cards 2–5 — main features (manager card only for managers) */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500">Tính năng</h2>
        {FEATURES.map((f) => (
          <FeatureCard key={f.href} {...f} />
        ))}
        {isManager && (
          <FeatureCard
            href="/manager"
            icon="📊"
            title="Quản lý tiến độ"
            subtitle="Theo dõi tiến độ học, chứng chỉ và trạng thái luyện tập của nhân viên."
            accent
          />
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
            >
              <span className="text-2xl" aria-hidden>
                {a.icon}
              </span>
              <span className="text-sm font-medium text-ink">{a.label}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/lessons"
          className="mt-2 block rounded-2xl bg-white p-4 text-center text-sm font-medium text-brand-700 shadow-card ring-1 ring-gray-100 tap-card"
        >
          📚 Xem tất cả bài học
        </Link>
      </section>

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Một số nội dung đang chờ duyệt nội bộ trước khi đào tạo chính thức.
      </p>
    </div>
  );
}
