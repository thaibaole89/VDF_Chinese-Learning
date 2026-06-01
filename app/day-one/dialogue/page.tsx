"use client";

// /day-one/dialogue — Day-One dialogue practice (Phase 2A.6).
// Renders all dialogues defined on the Day-One lesson and lets the learner
// self-mark the section as completed. Phase 2A.8 will add voice scoring; the
// layout already gives DialoguePractice room for a voice button under each line.

import { useEffect, useState } from "react";
import { getDayOneLesson } from "@/lib/content";
import DialoguePractice from "@/components/DialoguePractice";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import DayOneSectionCompletion from "@/components/DayOneSectionCompletion";
import { getDayOneModuleProgress } from "@/lib/storage";

export default function DayOneDialoguePage() {
  const lesson = getDayOneLesson();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(!!getDayOneModuleProgress().dialogue.completedAt);
    const refresh = () =>
      setCompleted(!!getDayOneModuleProgress().dialogue.completedAt);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const dialogues = lesson.dialogues ?? [];

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="dialogue"
        badge={completed ? { label: "✓ Đã hoàn thành", tone: "success" } : undefined}
      />

      <div className="flex flex-wrap justify-end gap-2">
        <SpeechToggle />
        <PinyinToggle />
      </div>

      {dialogues.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có hội thoại mẫu cho Day-One.
        </p>
      ) : (
        <section className="space-y-3">
          {dialogues.map((d, i) => (
            <DialoguePractice key={d.id ?? i} dialogue={d} />
          ))}
        </section>
      )}

      <DayOneSectionCompletion section="dialogue" />

      <DayOneSectionFooter section="dialogue" />
    </div>
  );
}
