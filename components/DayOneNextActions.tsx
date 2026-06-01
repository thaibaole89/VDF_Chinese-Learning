// Next-action ladder shown on /account when the learner is NOT yet eligible
// for the Day-One certificate. Mirrors the eligibility helper's three
// requirements 1:1.
//
// All numbers come from server-side eligibility (lib/dayOneEligibility.ts),
// never localStorage. The component is presentational only.

import Link from "next/link";
import type { DayOneEligibility } from "@/lib/dayOneEligibility";

type Step = {
  key: "phrasesLearned" | "voicePassed" | "bestQuizScore";
  title: string;
  done: boolean;
  /** "x/10" or "67/70" copy line. */
  progress: string;
  /** Short Vietnamese hint about how to advance. */
  hint: string;
  /** Where to send the user. /day-one for everything; quiz section also linked separately. */
  href: string;
  ctaLabel: string;
};

export default function DayOneNextActions({
  data,
}: {
  data: DayOneEligibility;
}) {
  const r = data.requirements;
  const steps: Step[] = [
    {
      key: "phrasesLearned",
      title: "Thuộc đủ 10 câu sống còn",
      done: data.met.phrasesLearned,
      progress: `${data.phrasesLearned}/${r.phrasesLearnedTarget}`,
      hint:
        data.phrasesLearned >= r.phrasesLearnedTarget
          ? "Đã đủ — tốt lắm!"
          : `Vào phần 10 câu và bấm "Đã thuộc" cho ${r.phrasesLearnedTarget - data.phrasesLearned} câu còn lại.`,
      href: "/day-one/phrases",
      ctaLabel: "Học 10 câu",
    },
    {
      key: "voicePassed",
      title: "Luyện đọc đạt yêu cầu",
      done: data.met.voicePassed,
      progress: `${data.voicePassed}/${r.voicePassedTarget}`,
      hint:
        data.voicePassed >= r.voicePassedTarget
          ? "Đã đủ — tốt lắm!"
          : `Cần ${r.voicePassedTarget - data.voicePassed} câu nữa đạt "pass" (hoặc dùng "Đánh dấu thủ công" nếu trình duyệt không hỗ trợ giọng nói).`,
      href: "/day-one/phrases",
      ctaLabel: "Luyện đọc",
    },
    {
      key: "bestQuizScore",
      title: `Quiz đạt từ ${r.bestQuizScoreTarget}/100`,
      done: data.met.bestQuizScore,
      progress: `${Number(data.bestQuizScore).toFixed(0)}/${r.bestQuizScoreTarget}`,
      hint:
        data.bestQuizScore >= r.bestQuizScoreTarget
          ? "Đã đủ — tốt lắm!"
          : data.bestQuizScore <= 0
            ? "Chưa làm quiz lần nào. Mở khoá bằng cách học xong 3 phần trước, rồi vào Kiểm tra nhanh."
            : `Còn ${(r.bestQuizScoreTarget - data.bestQuizScore).toFixed(0)} điểm. Thử lại bài kiểm tra để cải thiện.`,
      href: "/day-one/quiz",
      ctaLabel: "Làm bài kiểm tra",
    },
  ];

  const completedSteps = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const pct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <section
      aria-label="Lộ trình lấy chứng nhận"
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
    >
      <header className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-ink">🎯 Đường tới chứng nhận Day-One</h2>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {completedSteps}/{totalSteps}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Hoàn thành cả 3 mục bên dưới để mở chứng nhận. Số liệu lấy trực tiếp
          từ tài khoản — không tính tiến độ offline trên thiết bị khác.
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <ol className="mt-2 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s.key}
            className={`flex items-start gap-3 rounded-xl p-3 ring-1 ${
              s.done
                ? "bg-green-50 ring-green-100"
                : "bg-gray-50 ring-gray-100"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                s.done
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-500 ring-1 ring-gray-200"
              }`}
              aria-hidden
            >
              {s.done ? "✓" : i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3
                  className={`text-sm font-semibold ${
                    s.done ? "text-green-800" : "text-ink"
                  }`}
                >
                  {s.title}
                </h3>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    s.done ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {s.progress}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-600">{s.hint}</p>
              {!s.done && (
                <Link
                  href={s.href}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white tap"
                >
                  {s.ctaLabel} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
