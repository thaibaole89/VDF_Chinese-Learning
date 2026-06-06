"use client";

// English course home. Lists modules → lessons with local progress, status
// pills (Chưa bắt đầu / Đang học / Hoàn thành) and a CTA. Phase 2C.1.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ENGLISH_COURSE, type EnLesson } from "@/lib/englishCourse";
import { getEnLearned } from "@/lib/courses";

function lessonStatus(lesson: EnLesson, learned: string[]): { label: string; cls: string; cta: string } {
  if (lesson.status === "coming" || lesson.phrases.length === 0) {
    return { label: "Sắp ra mắt", cls: "bg-gray-100 text-gray-500", cta: "Xem trước" };
  }
  const done = lesson.phrases.filter((p) => learned.includes(p.id)).length;
  if (done === 0) return { label: "Chưa bắt đầu", cls: "bg-gray-100 text-gray-600", cta: "Bắt đầu" };
  if (done >= lesson.phrases.length) return { label: "Hoàn thành", cls: "bg-green-100 text-green-800", cta: "Ôn lại" };
  return { label: `Đang học · ${done}/${lesson.phrases.length}`, cls: "bg-amber-100 text-amber-800", cta: "Tiếp tục học" };
}

export default function EnglishCourseHome() {
  const [learned, setLearned] = useState<string[]>([]);
  useEffect(() => setLearned(getEnLearned()), []);

  const totals = useMemo(() => {
    const all = ENGLISH_COURSE.modules.flatMap((m) => m.lessons).flatMap((l) => l.phrases.map((p) => p.id));
    const done = all.filter((id) => learned.includes(id)).length;
    return { all: all.length, done };
  }, [learned]);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-card-lg">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Khoá học · English</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{ENGLISH_COURSE.titleEn}</h1>
        <p className="mt-1 text-sm text-brand-100">{ENGLISH_COURSE.descriptionVi}</p>
        <div className="mt-3 inline-flex nums rounded-full bg-white/15 px-3 py-1 text-sm">
          Đã thuộc {totals.done}/{totals.all} câu
        </div>
      </header>

      <div className="flex items-center justify-between text-sm">
        <Link href="/courses" className="font-medium text-brand-700">
          ← Chọn khoá khác
        </Link>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">🇬🇧 English · en-US</span>
      </div>

      {ENGLISH_COURSE.modules.map((m) => (
        <section key={m.id} className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-ink">{m.titleVi}</h2>
            <p className="text-xs text-gray-500">
              {m.titleEn} — {m.objectiveVi}
            </p>
          </div>
          <div className="space-y-2">
            {m.lessons.map((lesson) => {
              const st = lessonStatus(lesson, learned);
              return (
                <Link
                  key={lesson.id}
                  href={`/courses/english/lessons/${lesson.id}`}
                  className="block rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100 tap-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-ink">{lesson.titleVi}</div>
                      <div className="text-xs text-gray-500">{lesson.titleEn}</div>
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
        Nội dung tiếng Anh đang chờ duyệt nội bộ. Tiến độ tiếng Anh hiện lưu trên thiết bị này (đồng bộ máy chủ ở giai đoạn sau).
      </p>
    </div>
  );
}
