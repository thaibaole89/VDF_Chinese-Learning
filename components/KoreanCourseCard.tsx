"use client";

// Korean course card for the /courses dashboard. Phase 2D: prefers server-side
// progress (passed from the server page) and falls back to the local mirror when
// the server is unavailable.

import { useEffect, useState } from "react";
import Link from "next/link";
import { KOREAN_COURSE, allKoreanPhraseIds } from "@/lib/koreanCourse";
import { getKoLearned } from "@/lib/koreanProgress";

export default function KoreanCourseCard({
  serverOk = false,
  serverLearned = 0,
  serverTotal = 0,
}: {
  serverOk?: boolean;
  serverLearned?: number;
  serverTotal?: number;
}) {
  const [learned, setLearned] = useState<string[]>([]);
  const [ready, setReady] = useState(serverOk);
  useEffect(() => {
    if (serverOk) return;
    setLearned(getKoLearned());
    setReady(true);
  }, [serverOk]);

  const all = allKoreanPhraseIds();
  const done = serverOk ? serverLearned : all.filter((id) => learned.includes(id)).length;
  const total = serverOk ? serverTotal : all.length;
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
    <Link href="/courses/korean" className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>
          🇰🇷
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">{KOREAN_COURSE.titleVi}</h3>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">한국어</span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{KOREAN_COURSE.descriptionVi}</p>
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
