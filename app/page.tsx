"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress, getFlashcards, getQuizAttempts, defaultProgress } from "@/lib/storage";
import { getReviewStats } from "@/lib/content";
import type { ReviewStats } from "@/lib/types";
import ProgressSummary from "@/components/ProgressSummary";
import Visual from "@/components/Visual";
import { getVisualForCategory } from "@/lib/visuals";

const QUICK_ACTIONS = [
  { href: "/tools/translate", label: "Dịch nhanh tại quầy", icon: "🗣️" },
  { href: "/flashcards", label: "Thẻ ghi nhớ", icon: "🃏" },
  { href: "/roleplay", label: "Đóng vai", icon: "🎭" },
  { href: "/search", label: "Tìm câu / từ", icon: "🔍" },
  { href: "/references", label: "Phát âm thương hiệu", icon: "🏷️" },
];

export default function Home() {
  const [stats, setStats] = useState<ReviewStats>(() =>
    getReviewStats(defaultProgress(), {}, [])
  );

  useEffect(() => {
    setStats(getReviewStats(getProgress(), getFlashcards(), getQuizAttempts()));
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

      {/* Primary path: Day-One survival */}
      <Link href="/day-one" className="block overflow-hidden rounded-2xl shadow-card-lg tap-card">
        <Visual asset={getVisualForCategory("day_one_survival")} variant="header" priority />
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vdf-logo-white.png" alt="" width={1772} height={393} className="mb-3 h-5 w-auto opacity-95" />
          <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Bắt đầu nhanh</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-balance">10 câu sống còn tại quầy</div>
          <p className="mt-1 text-sm text-brand-100">Thuộc 10 câu cốt lõi để xử lý một giao dịch cơ bản.</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="nums rounded-full bg-white/15 px-3 py-1 text-sm">
              {stats.dayOneCompleted}/{stats.dayOneTotal} câu
            </span>
            <span className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-ink">Học 5 phút →</span>
          </div>
        </div>
      </Link>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Tiến độ của bạn</h2>
        <ProgressSummary stats={stats} />
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
