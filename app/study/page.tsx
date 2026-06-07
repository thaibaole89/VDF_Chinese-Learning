// /study — "Bài học" hub. Phase 2C.1.4.
//
// The bottom-nav "Bài học" tab lands here. Instead of showing only the Chinese
// lessons, it lists every course the learner can study and links into each
// course's lesson list. Reuses the existing (Chinese) illustration set.

import Link from "next/link";
import Visual from "@/components/Visual";
import { getVisualForCategory } from "@/lib/visuals";

export const metadata = {
  title: "Bài học · VDF",
  robots: { index: false, follow: false },
};

const STUDY_COURSES = [
  {
    id: "chinese-sales",
    titleVi: "Tiếng Trung bán hàng",
    flag: "🇨🇳",
    language: "中文 · zh-CN",
    descVi: "10 câu sống còn + toàn bộ bài học quy trình bán hàng tại quầy.",
    href: "/lessons",
    visual: "day_one_survival" as const,
  },
  {
    id: "english-sales",
    titleVi: "Tiếng Anh bán hàng",
    flag: "🇬🇧",
    language: "English · en-US",
    descVi: "Counter Survival, ngành hàng & sân bay/miễn thuế (IPA + luyện phát âm).",
    href: "/courses/english",
    visual: "greeting" as const,
  },
  {
    id: "korean-sales",
    titleVi: "Tiếng Hàn bán hàng",
    flag: "🇰🇷",
    language: "한국어 · ko-KR",
    descVi: "Chào hỏi, tư vấn, thanh toán & sân bay bằng tiếng Hàn (có phiên âm).",
    href: "/courses/korean",
    visual: "payment" as const,
  },
];

export default function StudyHubPage() {
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/courses" className="text-sm text-brand-600">
          ← Khoá học
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Bài học</h1>
        <p className="text-sm text-gray-500">Chọn một khoá để xem danh sách bài học.</p>
      </header>

      <section className="space-y-3">
        {STUDY_COURSES.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className="block overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-gray-100 tap-card"
          >
            <div className="flex items-stretch gap-3 p-3">
              <Visual asset={getVisualForCategory(c.visual)} variant="thumb" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {c.flag}
                  </span>
                  <h2 className="text-base font-bold text-ink">{c.titleVi}</h2>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{c.descVi}</p>
                <span className="mt-1 inline-block text-xs font-semibold text-brand-600">Xem bài học →</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Khoá tiếng Trung là khoá pilot chính. Khoá tiếng Anh & tiếng Hàn đang chờ duyệt nội bộ.
      </p>
    </div>
  );
}
