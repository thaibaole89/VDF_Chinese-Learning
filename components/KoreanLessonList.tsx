"use client";

// Korean course home — modules → lessons with local progress, status pills and
// reused illustrations. Korean progress is local-only this phase. 2C.1.4.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KOREAN_COURSE, allKoreanPhraseIds, type KoLesson } from "@/lib/koreanCourse";
import { getKoLearned } from "@/lib/koreanProgress";
import { koreanCourseHeroVisual, koreanLessonVisual } from "@/lib/koreanVisuals";
import Visual from "@/components/Visual";

function lessonStatus(lesson: KoLesson, learned: Set<string>): { label: string; cls: string; cta: string } {
  if (lesson.status === "coming" || lesson.phrases.length === 0) {
    return { label: "Sắp ra mắt", cls: "bg-gray-100 text-gray-500", cta: "Xem trước" };
  }
  const done = lesson.phrases.filter((p) => learned.has(p.id)).length;
  if (done >= lesson.phrases.length && lesson.phrases.length > 0) return { label: "Hoàn thành", cls: "bg-green-100 text-green-800", cta: "Ôn lại" };
  if (done === 0) return { label: "Chưa bắt đầu", cls: "bg-gray-100 text-gray-600", cta: "Bắt đầu" };
  return { label: `Đang học · ${done}/${lesson.phrases.length}`, cls: "bg-amber-100 text-amber-800", cta: "Tiếp tục học" };
}

export default function KoreanLessonList() {
  const [learned, setLearned] = useState<Set<string>>(new Set());
  useEffect(() => setLearned(new Set(getKoLearned())), []);

  const totals = useMemo(() => {
    const all = allKoreanPhraseIds();
    const done = all.filter((id) => learned.has(id)).length;
    return { all: all.length, done, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }, [learned]);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl shadow-card-lg">
        <Visual asset={koreanCourseHeroVisual()} variant="header" priority />
        <header className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Khoá học · 한국어</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{KOREAN_COURSE.titleVi}</h1>
          <p className="mt-1 text-sm text-brand-100">{KOREAN_COURSE.descriptionVi}</p>
        </header>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link href="/courses" className="font-medium text-brand-700">
          ← Chọn khoá khác
        </Link>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">🇰🇷 한국어 · ko-KR</span>
      </div>

      <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
        ⚠️ Tiếng Hàn đang chờ duyệt nội bộ về ngôn ngữ.
      </p>

      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Tiến độ tiếng Hàn</span>
          <span className="nums text-sm font-bold text-brand-700">{totals.pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${totals.pct}%` }} />
        </div>
        <p className="mt-2 nums text-xs text-gray-500">Đã thuộc {totals.done}/{totals.all} câu</p>
      </section>

      {KOREAN_COURSE.modules.map((m) => (
        <section key={m.id} className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-ink">{m.titleVi}</h2>
            <p className="hanzi text-xs text-gray-500">
              {m.titleKo} — {m.objectiveVi}
            </p>
          </div>
          <div className="space-y-2">
            {m.lessons.map((lesson) => {
              const st = lessonStatus(lesson, learned);
              return (
                <Link key={lesson.id} href={`/courses/korean/lessons/${lesson.id}`} className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card">
                  <div className="flex items-start gap-3">
                    <Visual asset={koreanLessonVisual(lesson.id)} variant="thumb" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-ink">{lesson.titleVi}</div>
                      <div className="hanzi text-xs text-gray-500">{lesson.titleKo}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{lesson.objectiveVi}</span>
                    <span className="shrink-0 text-sm font-medium text-brand-700">{st.cta} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
        Nội dung tiếng Hàn đang chờ duyệt nội bộ. Tiến độ tiếng Hàn hiện lưu trên thiết bị này (đồng bộ máy chủ ở giai đoạn sau).
      </p>
    </div>
  );
}
