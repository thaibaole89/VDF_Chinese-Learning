// Learning overview block on /account. Phase 2B.1.
// Visual layers: active-course header → Day-One module status row → overall
// lessons progress (segmented bar + counts) → next-action CTA.
//
// Presentational only — receives the precomputed dashboard from
// computeLearnerDashboard (server). No localStorage reads here.

import Link from "next/link";
import type { DayOneSectionMini, LearnerDashboard } from "@/lib/learnerDashboard";

const STATUS_DOT: Record<DayOneSectionMini["status"], string> = {
  not_started: "bg-gray-300",
  in_progress: "bg-brand-500",
  completed: "bg-green-500",
};

const STATUS_TEXT: Record<DayOneSectionMini["status"], string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang học",
  completed: "Hoàn thành",
};

function SubsectionTile({ section }: { section: DayOneSectionMini }) {
  const pct = Math.max(0, Math.min(100, Math.round(section.ratio * 100)));
  return (
    <div
      className={`rounded-xl p-2.5 ring-1 ${
        section.status === "completed"
          ? "bg-green-50 ring-green-100"
          : section.status === "in_progress"
            ? "bg-white ring-brand-100"
            : "bg-gray-50 ring-gray-100"
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span
          className={`inline-block h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[section.status]}`}
          aria-hidden
        />
        <span className="truncate text-[11px] font-semibold text-ink">{section.label}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200/60">
        <div
          className={`h-full rounded-full transition-all ${
            section.status === "completed" ? "bg-green-500" : "bg-brand-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px]">
        <span className="font-semibold tabular-nums text-gray-700">{section.display}</span>
        <span className="text-gray-400">{STATUS_TEXT[section.status]}</span>
      </div>
    </div>
  );
}

function SegmentedProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  // Render up to N segments (cap at 12 for visual sanity). For total > 12,
  // we render 12 segments where each segment represents 1/12 of total.
  const N = Math.min(total, 12);
  const filledFloat = total > 0 ? (completed / total) * N : 0;
  return (
    <div className="flex h-3 gap-0.5" aria-hidden>
      {Array.from({ length: N }).map((_, i) => {
        const fillRatio = Math.max(0, Math.min(1, filledFloat - i));
        const colour =
          fillRatio >= 0.999
            ? "bg-brand-600"
            : fillRatio > 0
              ? "bg-brand-300"
              : "bg-gray-200";
        return <span key={i} className={`h-3 flex-1 rounded-sm ${colour}`} />;
      })}
    </div>
  );
}

const NEXT_ICON: Record<LearnerDashboard["next"]["kind"], string> = {
  day_one: "🎯",
  lesson: "📘",
  all_done: "🏁",
};

export default function LearningOverviewCard({ data }: { data: LearnerDashboard }) {
  const pct = Math.round(data.ratio * 100);

  return (
    <section
      className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
      aria-label="Tổng quan học tập"
    >
      {/* Active course banner */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            Khoá học đang theo
          </p>
          <h2 className="mt-0.5 text-base font-bold text-ink">{data.course.titleVi}</h2>
          <p className="text-xs text-gray-500">{data.course.language}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            data.dayOne.eligible
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {data.dayOne.eligible ? "Day-One hoàn thành" : "Đang học Day-One"}
        </span>
      </div>

      {/* Day-One module mini-status */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Mô-đun Day-One
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <SubsectionTile section={data.dayOne.phrases} />
          <SubsectionTile section={data.dayOne.dialogue} />
          <SubsectionTile section={data.dayOne.roleplay} />
          <SubsectionTile section={data.dayOne.quiz} />
        </div>
      </div>

      {/* Overall lessons progress */}
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Tiến độ tất cả bài học
          </h3>
          <span className="text-xs font-semibold tabular-nums text-gray-700">
            {data.completedLessons}/{data.totalLessons} bài · {pct}%
          </span>
        </div>
        <div className="mt-2">
          <SegmentedProgress completed={data.completedLessons} total={data.totalLessons} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500">
          <span>✓ {data.completedLessons} hoàn thành</span>
          <span>
            {data.remainingLessons > 0
              ? `Còn ${data.remainingLessons} bài`
              : "Đã hoàn thành lộ trình"}
          </span>
        </div>
      </div>

      {/* Next-action suggestion */}
      <Link
        href={data.next.href}
        className={`flex items-center gap-3 rounded-2xl p-3 ring-1 tap ${
          data.next.kind === "all_done"
            ? "bg-green-50 ring-green-100"
            : "bg-brand-50 ring-brand-100"
        }`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl ${
            data.next.kind === "all_done" ? "bg-green-100" : "bg-brand-100"
          }`}
          aria-hidden
        >
          {NEXT_ICON[data.next.kind]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            {data.next.kind === "all_done"
              ? "Đã hoàn thành lộ trình"
              : "Gợi ý tiếp theo"}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-ink">{data.next.label}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{data.next.reasonVi}</p>
        </div>
        <span className="shrink-0 text-brand-600">→</span>
      </Link>

      <Link
        href="/lessons"
        className="block rounded-xl bg-white px-3 py-2.5 text-center text-xs font-medium text-brand-700 ring-1 ring-brand-100 tap"
      >
        Xem toàn bộ danh sách bài học →
      </Link>
    </section>
  );
}
