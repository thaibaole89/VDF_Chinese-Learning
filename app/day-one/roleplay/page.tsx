"use client";

// /day-one/roleplay — Day-One roleplay with voice-scored required staff lines.
// Phase 2A.8 replaces the self-mark widget with per-line voice scoring on each
// requiredPhrase from the roleplay scenario. Customer-goal and staff-goal
// summary remain as context; the sample dialogue (if any) is collapsible
// context. Section completion is voice-derived (computeDashboard).

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDayOneLesson, getDialogueById } from "@/lib/content";
import {
  getProgress,
  getVoicePracticeRecords,
  getDayOneModuleProgress,
  markDayOneSectionStarted,
} from "@/lib/storage";
import {
  computeDashboard,
  DAY_ONE_LESSON_ID,
  matchDayOnePhraseRow,
} from "@/lib/dayOneModule";
import ChineseLine from "@/components/ChineseLine";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import StatusBadge from "@/components/StatusBadge";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import ScoredSpeakingLine from "@/components/ScoredSpeakingLine";

export default function DayOneRoleplayPage() {
  const lesson = getDayOneLesson();
  const [passedRequired, setPassedRequired] = useState(0);
  const [totalRequired, setTotalRequired] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showSamples, setShowSamples] = useState<Record<string, boolean>>({});

  function refresh() {
    const p = getProgress();
    const vr = getVoicePracticeRecords();
    const m = getDayOneModuleProgress();
    const s = computeDashboard({
      completedPhraseIds: p.completedPhraseIds,
      voiceRecords: vr,
      module: m,
    });
    setPassedRequired(s.roleplay.passedRequired);
    setTotalRequired(s.roleplay.totalRequired);
    setCompleted(s.roleplay.status === "completed");
  }

  useEffect(() => {
    markDayOneSectionStarted("roleplay");
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const roleplays = lesson.roleplays ?? [];
  const pct = totalRequired > 0 ? Math.round((passedRequired / totalRequired) * 100) : 0;

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="roleplay"
        badge={completed ? { label: "✓ Đã hoàn thành", tone: "success" } : undefined}
      />

      {/* Section progress bar */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Câu bắt buộc đã đọc đạt {passedRequired}/{totalRequired}
          </span>
          <span className={completed ? "font-medium text-green-700" : "text-gray-500"}>{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${completed ? "bg-green-500" : "bg-brand-600"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {completed
            ? "Đã đọc đạt tất cả câu bắt buộc trong tình huống đóng vai. 👍"
            : `Đọc đạt ${totalRequired} câu bắt buộc (điểm ≥ 70 hoặc dùng "Đánh dấu thủ công" nếu micro không hoạt động).`}
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/check" className="text-xs text-brand-600 underline">
          Kiểm tra micro & loa →
        </Link>
        <div className="flex flex-wrap gap-2">
          <SpeechToggle />
          <PinyinToggle />
        </div>
      </div>

      {roleplays.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có tình huống đóng vai cho Day-One.
        </p>
      ) : (
        <section className="space-y-5">
          {roleplays.map((rp) => {
            const sample = rp.sampleDialogueId ? getDialogueById(rp.sampleDialogueId) : undefined;
            const sampleOpen = !!showSamples[rp.id];
            return (
              <div key={rp.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-ink">{rp.titleVi}</h2>
                  <StatusBadge status={rp.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500">{rp.scenarioVi}</p>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <span className="font-medium text-gray-600">🧍 Khách muốn: </span>
                    {rp.customerGoalVi}
                  </div>
                  <div className="rounded-lg bg-brand-50 p-2">
                    <span className="font-medium text-brand-700">🧑‍💼 Nhân viên cần: </span>
                    {rp.staffGoalVi}
                  </div>
                </div>

                {rp.requiredPhrases?.length ? (
                  <div className="mt-4">
                    <h3 className="mb-2 text-sm font-bold text-ink">
                      Đọc đạt các câu bắt buộc bên dưới
                    </h3>
                    <ul className="space-y-3">
                      {rp.requiredPhrases.map((zh, i) => {
                        const matched = matchDayOnePhraseRow(zh);
                        if (!matched) {
                          // Defensive: shouldn't happen for Day-One — all 4 required phrases map.
                          return (
                            <li
                              key={i}
                              className="rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100"
                            >
                              <div className="mb-1 text-[11px] font-semibold uppercase text-amber-800">
                                Câu bắt buộc · không chấm điểm
                              </div>
                              <ChineseLine zh={zh} size="sm" />
                            </li>
                          );
                        }
                        return (
                          <li key={i}>
                            <ScoredSpeakingLine
                              phraseId={matched.id}
                              lessonId={DAY_ONE_LESSON_ID}
                              zh={matched.zh}
                              pinyin={matched.pinyin}
                              vi={matched.vi}
                              audioText={matched.audioText}
                              speakerLabel={`Câu bắt buộc ${i + 1}`}
                              required
                              onSaved={refresh}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                {sample && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowSamples((s) => ({ ...s, [rp.id]: !sampleOpen }))}
                      className="text-sm font-medium text-brand-600 underline"
                    >
                      {sampleOpen ? "Ẩn hội thoại mẫu" : "Xem hội thoại mẫu"}
                    </button>
                    {sampleOpen && (
                      <ul className="mt-2 space-y-2">
                        {sample.lines.map((ln, j) => (
                          <li
                            key={j}
                            className={`rounded-lg p-2 ring-1 ${
                              ln.speaker === "staff"
                                ? "bg-brand-50 ring-brand-100"
                                : "bg-gray-50 ring-gray-100"
                            }`}
                          >
                            <div className="mb-0.5 text-[11px] font-semibold uppercase text-gray-400">
                              {ln.speaker === "staff" ? "NV" : "Khách"}
                            </div>
                            <ChineseLine
                              zh={ln.zh}
                              pinyin={ln.pinyin}
                              vi={ln.vi}
                              size="sm"
                              showSpeak={false}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      <p className="rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
        Trình duyệt không hỗ trợ giọng nói? Kết quả vẫn được ghi nhận khi bấm{" "}
        <strong>"Đánh dấu thủ công"</strong> trong từng câu — chỉ dùng khi micro không hoạt động.
      </p>

      <DayOneSectionFooter section="roleplay" />
    </div>
  );
}
