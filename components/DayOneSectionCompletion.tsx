// Shared "mark this section as completed" widget for /day-one/dialogue and
// /day-one/roleplay. Phase 2A.6.
//
// Phase 2A.8 will add real voice scoring for these sections — for now,
// completion is learner-asserted (button toggle). The button is sized big
// + thumb-friendly so it fits the same mobile flow as the phrase "đã thuộc"
// button.

"use client";

import { useEffect, useState } from "react";
import {
  getDayOneModuleProgress,
  markDayOneSectionCompleted,
  markDayOneSectionStarted,
} from "@/lib/storage";

type Section = "dialogue" | "roleplay";

const LABELS: Record<Section, { incomplete: string; complete: string; hint: string }> = {
  dialogue: {
    incomplete: "✓ Đánh dấu đã hoàn thành phần Luyện hội thoại",
    complete: "✓ Đã hoàn thành — bấm để bỏ đánh dấu",
    hint:
      "Khi anh/chị đã đọc qua hết hội thoại mẫu và tự tin với câu của nhân viên, bấm để mở khoá phần tiếp theo.",
  },
  roleplay: {
    incomplete: "✓ Đánh dấu đã hoàn thành phần Đóng vai",
    complete: "✓ Đã hoàn thành — bấm để bỏ đánh dấu",
    hint:
      "Sau khi anh/chị đã thử xử lý tình huống đóng vai và đọc qua hội thoại mẫu, bấm để mở khoá phần kiểm tra.",
  },
};

export default function DayOneSectionCompletion({ section }: { section: Section }) {
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  useEffect(() => {
    // Auto-mark "started" the first time the user lands here, so the dashboard
    // can show "Đang học" without waiting for the user to take any action.
    const m = markDayOneSectionStarted(section);
    setCompletedAt(m[section].completedAt);
  }, [section]);

  function toggle() {
    const next = !completedAt;
    const m = markDayOneSectionCompleted(section, next);
    setCompletedAt(m[section].completedAt);
  }

  // Cached helper so a stale storage read doesn't lose the "completedAt" after re-render.
  useEffect(() => {
    setCompletedAt(getDayOneModuleProgress()[section].completedAt);
  }, [section]);

  const labels = LABELS[section];
  const isComplete = !!completedAt;

  return (
    <section
      className={`rounded-2xl p-4 shadow-sm ring-1 ${
        isComplete ? "bg-green-50 ring-green-100" : "bg-white ring-gray-100"
      }`}
    >
      <p className="text-sm text-gray-700">{labels.hint}</p>
      <button
        onClick={toggle}
        className={`mt-3 w-full rounded-xl px-4 py-3.5 text-sm font-semibold tap ${
          isComplete ? "bg-green-600 text-white" : "bg-brand-600 text-white"
        }`}
      >
        {isComplete ? labels.complete : labels.incomplete}
      </button>
      {isComplete && completedAt && (
        <p className="mt-2 text-center text-[11px] text-green-700">
          Hoàn thành lúc {new Date(completedAt).toLocaleString("vi-VN")}
        </p>
      )}
    </section>
  );
}
