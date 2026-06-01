"use client";

// /day-one/roleplay — Day-One roleplay practice (Phase 2A.6).
// Renders all roleplays defined on the Day-One lesson + a self-mark completion
// button. Phase 2A.8 will add voice scoring on each required phrase.

import { useEffect, useState } from "react";
import { getDayOneLesson, getDialogueById } from "@/lib/content";
import RoleplayCard from "@/components/RoleplayCard";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import DayOneSectionCompletion from "@/components/DayOneSectionCompletion";
import { getDayOneModuleProgress } from "@/lib/storage";

export default function DayOneRoleplayPage() {
  const lesson = getDayOneLesson();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(!!getDayOneModuleProgress().roleplay.completedAt);
    const refresh = () =>
      setCompleted(!!getDayOneModuleProgress().roleplay.completedAt);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const roleplays = lesson.roleplays ?? [];

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="roleplay"
        badge={completed ? { label: "✓ Đã hoàn thành", tone: "success" } : undefined}
      />

      <div className="flex flex-wrap justify-end gap-2">
        <SpeechToggle />
        <PinyinToggle />
      </div>

      {roleplays.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có tình huống đóng vai cho Day-One.
        </p>
      ) : (
        <section className="space-y-3">
          {roleplays.map((r) => (
            <RoleplayCard
              key={r.id}
              roleplay={r}
              sampleDialogue={r.sampleDialogueId ? getDialogueById(r.sampleDialogueId) : undefined}
            />
          ))}
        </section>
      )}

      <DayOneSectionCompletion section="roleplay" />

      <DayOneSectionFooter section="roleplay" />
    </div>
  );
}
