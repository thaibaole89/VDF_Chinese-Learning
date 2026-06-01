"use client";

// /day-one/dialogue — Day-One dialogue with voice-scored staff lines.
// Phase 2A.8 replaces the self-mark widget with per-line voice scoring.
//
// Layout: render each dialogue line in order. Customer lines are context only
// (display + speak button). Staff lines whose Chinese text exactly matches a
// Day-One phrase row get a ScoredSpeakingLine (full VoicePracticePanel). Staff
// lines that don't match (concatenated phrases — see lib/dayOneModule notes)
// render as "Đọc theo · không chấm điểm" context to preserve dialogue flow.
//
// Section completion is derived in computeDashboard() from the user's voice
// records intersected with getDayOneDialogueRequiredPhraseIds(). The dashboard,
// the quiz lock, and this page's own progress bar all read from the same
// source — no separate "completed" flag.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDayOneLesson } from "@/lib/content";
import {
  getProgress,
  getVoicePracticeRecords,
  getDayOneModuleProgress,
  markDayOneSectionStarted,
} from "@/lib/storage";
import {
  computeDashboard,
  DAY_ONE_LESSON_ID,
  getDayOneDialogueRequiredPhraseIds,
  matchDayOnePhraseRow,
} from "@/lib/dayOneModule";
import ChineseLine from "@/components/ChineseLine";
import PinyinToggle from "@/components/PinyinToggle";
import SpeechToggle from "@/components/SpeechToggle";
import { DayOneSectionHeader, DayOneSectionFooter } from "@/components/DayOneSectionNav";
import ScoredSpeakingLine from "@/components/ScoredSpeakingLine";

export default function DayOneDialoguePage() {
  const lesson = getDayOneLesson();
  const [passedRequired, setPassedRequired] = useState(0);
  const [totalRequired, setTotalRequired] = useState(0);
  const [completed, setCompleted] = useState(false);

  function refresh() {
    const p = getProgress();
    const vr = getVoicePracticeRecords();
    const m = getDayOneModuleProgress();
    const s = computeDashboard({
      completedPhraseIds: p.completedPhraseIds,
      voiceRecords: vr,
      module: m,
    });
    setPassedRequired(s.dialogue.passedRequired);
    setTotalRequired(s.dialogue.totalRequired);
    setCompleted(s.dialogue.status === "completed");
  }

  useEffect(() => {
    // Auto-mark page-visit for analytics + cross-section "Đang học" signal.
    markDayOneSectionStarted("dialogue");
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!lesson) {
    return <p className="text-sm text-gray-500">Không tìm thấy nội dung Day-One.</p>;
  }

  const dialogues = lesson.dialogues ?? [];
  const requiredIds = getDayOneDialogueRequiredPhraseIds();
  const pct = totalRequired > 0 ? Math.round((passedRequired / totalRequired) * 100) : 0;

  return (
    <div className="space-y-5">
      <DayOneSectionHeader
        section="dialogue"
        badge={completed ? { label: "✓ Đã hoàn thành", tone: "success" } : undefined}
      />

      {/* Section progress bar */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Câu nhân viên đã đọc đạt {passedRequired}/{totalRequired}
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
            ? "Đã đọc đạt tất cả câu nhân viên trong hội thoại. 👍"
            : `Đọc đạt ${totalRequired} câu nhân viên (điểm ≥ 70 hoặc dùng "Đánh dấu thủ công" nếu trình duyệt không hỗ trợ giọng nói).`}
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

      {dialogues.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          Chưa có hội thoại mẫu cho Day-One.
        </p>
      ) : (
        <section className="space-y-5">
          {dialogues.map((dlg, di) => (
            <div key={dlg.id ?? di} className="space-y-3">
              <header>
                <h2 className="text-sm font-bold text-ink">{dlg.titleVi}</h2>
                <p className="text-xs text-gray-500">{dlg.scenarioVi}</p>
              </header>
              <ol className="space-y-3">
                {dlg.lines.map((ln, li) => {
                  const isStaff = ln.speaker === "staff";
                  const matched = isStaff ? matchDayOnePhraseRow(ln.zh) : null;
                  const isRequired = !!matched && requiredIds.includes(matched.id);

                  if (isStaff && matched) {
                    return (
                      <li key={li}>
                        <ScoredSpeakingLine
                          phraseId={matched.id}
                          lessonId={DAY_ONE_LESSON_ID}
                          zh={matched.zh}
                          pinyin={matched.pinyin}
                          vi={matched.vi}
                          audioText={matched.audioText}
                          speakerLabel="Nhân viên"
                          required={isRequired}
                          onSaved={refresh}
                        />
                      </li>
                    );
                  }

                  // Context-only line: customer turn OR concatenated staff
                  // line that doesn't map to a single phrase row.
                  return (
                    <li
                      key={li}
                      className={`rounded-2xl p-3 ring-1 ${
                        isStaff ? "bg-amber-50 ring-amber-100" : "bg-gray-50 ring-gray-100"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wide ${
                            isStaff ? "text-amber-800" : "text-gray-500"
                          }`}
                        >
                          {isStaff ? "Nhân viên · đọc theo, không chấm điểm" : "Khách"}
                        </span>
                      </div>
                      <ChineseLine zh={ln.zh} pinyin={ln.pinyin} vi={ln.vi} noteVi={ln.noteVi} size="sm" />
                      {isStaff && (
                        <p className="mt-1.5 text-[11px] text-amber-700">
                          Câu này nối từ nhiều mẫu nên không tính điểm — bạn vẫn nên đọc theo để
                          quen ngữ điệu.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      )}

      <p className="rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
        Trình duyệt không hỗ trợ giọng nói? Kết quả vẫn được ghi nhận khi bấm{" "}
        <strong>"Đánh dấu thủ công"</strong> trong từng câu — chỉ dùng khi micro không hoạt động;
        không phải nút phổ thông.
      </p>

      <DayOneSectionFooter section="dialogue" />
    </div>
  );
}
