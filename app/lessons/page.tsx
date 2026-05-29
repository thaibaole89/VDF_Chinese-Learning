"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLessonGroups, lessonHasRisk } from "@/lib/content";
import { getProgress } from "@/lib/storage";
import LessonCard from "@/components/LessonCard";

export default function LessonsPage() {
  const groups = getLessonGroups();
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => setCompleted(getProgress().completedLessonIds), []);

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tất cả bài học</h1>
      </header>

      {groups.map((g) => (
        <section key={g.id}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {g.titleVi}
          </h2>
          <div className="space-y-2">
            {g.lessons.map((m) => (
              <LessonCard
                key={m.lesson.id}
                lesson={m.lesson}
                completed={completed.includes(m.lesson.id)}
                hasRisk={lessonHasRisk(m.lesson)}
              />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Tra cứu</h2>
        <Link
          href="/references"
          className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 tap"
        >
          <h3 className="font-semibold text-ink">🏷️ Thương hiệu & lượng từ</h3>
          <p className="mt-1 text-sm text-gray-500">
            Phát âm tên thương hiệu (mỹ phẩm, rượu, thuốc lá) và lượng từ theo ngành hàng.
          </p>
        </Link>
      </section>
    </div>
  );
}
