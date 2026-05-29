import Link from "next/link";
import type { Lesson } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function LessonCard({
  lesson,
  completed,
  hasRisk,
}: {
  lesson: Lesson;
  completed?: boolean;
  hasRisk?: boolean;
}) {
  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 tap"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink">
          {lesson.titleVi}
          {lesson.titleZh ? (
            <span className="ml-1 hanzi text-sm font-normal text-gray-400">{lesson.titleZh}</span>
          ) : null}
        </h3>
        {completed && (
          <span className="shrink-0 text-green-600" title="Đã hoàn thành">
            ✓
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{lesson.objectiveVi}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span>⏱ {lesson.estimatedMinutes} phút</span>
        <StatusBadge status={lesson.status} />
        {hasRisk && (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-800">
            Cần xác nhận
          </span>
        )}
      </div>
    </Link>
  );
}
