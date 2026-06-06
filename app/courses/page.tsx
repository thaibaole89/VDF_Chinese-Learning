"use client";

// /courses — course picker. Phase 2C.1. Learner chooses which language course
// to study. Mobile-first; reuses the app design tokens.

import Link from "next/link";
import { COURSES } from "@/lib/courses";

export default function CoursesPage() {
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Chọn khoá học</h1>
        <p className="text-sm text-gray-500">Chọn ngôn ngữ bạn muốn học để bắt đầu.</p>
      </header>

      <section className="space-y-3">
        {COURSES.map((c) => (
          <Link
            key={c.id}
            href={c.startHref}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
              {c.flag}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink">{c.titleVi}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                  {c.language}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{c.descriptionVi}</p>
              <span className="mt-1 inline-block text-xs font-semibold text-brand-600">Bắt đầu học →</span>
            </div>
          </Link>
        ))}
      </section>

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Khoá tiếng Anh đang ở giai đoạn đầu (học / nghe / đọc / kiểm tra nhanh). Phần luyện nói có
        chấm điểm cho tiếng Anh sẽ được bổ sung ở bản sau.
      </p>
    </div>
  );
}
