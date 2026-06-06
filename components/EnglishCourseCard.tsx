"use client";

// English course card for the /courses dashboard. English progress is
// local-only this phase, so this is a client island. Phase 2C.1.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ENGLISH_COURSE } from "@/lib/englishCourse";
import { getEnLearned } from "@/lib/courses";

export default function EnglishCourseCard() {
  const [learned, setLearned] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLearned(getEnLearned());
    setReady(true);
  }, []);

  const allIds = ENGLISH_COURSE.modules.flatMap((m) => m.lessons).flatMap((l) => l.phrases.map((p) => p.id));
  const done = allIds.filter((id) => learned.includes(id)).length;
  const total = allIds.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  let statusLabel = "Chưa bắt đầu";
  let statusCls = "bg-gray-100 text-gray-600";
  let cta = "Bắt đầu";
  if (ready && done > 0 && done < total) {
    statusLabel = "Đang học";
    statusCls = "bg-amber-100 text-amber-800";
    cta = "Tiếp tục học";
  } else if (ready && total > 0 && done >= total) {
    statusLabel = "Hoàn thành";
    statusCls = "bg-green-100 text-green-800";
    cta = "Ôn lại";
  }

  return (
    <Link href="/courses/english" className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
          🇬🇧
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">{ENGLISH_COURSE.titleVi}</h3>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">English</span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{ENGLISH_COURSE.descriptionVi}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusCls}`}>{statusLabel}</span>
            <span className="nums text-[11px] text-gray-500">{pct}%</span>
          </div>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-right text-sm font-semibold text-brand-700">{cta} →</div>
    </Link>
  );
}
