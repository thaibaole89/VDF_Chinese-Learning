"use client";

// Collapsible "how scoring works" box for /hall-of-fame. Phase 2B.3.
// Default collapsed; explains the formula + the anti-gaming rules in plain
// Vietnamese so staff trust the ranking.

import { useState } from "react";
import { SCORING } from "@/lib/leaderboard";

export default function LeaderboardScoringInfo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left tap"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>ℹ️</span>
          <span className="text-sm font-bold text-ink">Cách tính điểm</span>
        </span>
        <span className={`text-sm text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4 text-sm text-gray-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Điểm tuần này được tính như sau
          </p>
          <ul className="space-y-1.5">
            <li className="flex justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span>Bài bắt buộc hoàn thành trong tuần</span>
              <span className="font-semibold text-ink">+{SCORING.requiredLessonPoints}đ / bài</span>
            </li>
            <li className="flex justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span>Bài tự chọn hoàn thành trong tuần</span>
              <span className="font-semibold text-ink">+{SCORING.optionalLessonPoints}đ / bài</span>
            </li>
            <li className="flex justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span>Câu luyện đọc mới đạt trong tuần</span>
              <span className="font-semibold text-ink">+{SCORING.voicePassPoints}đ / câu</span>
            </li>
            <li className="flex justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span>Có chứng nhận Day-One</span>
              <span className="font-semibold text-ink">+{SCORING.dayOneCertBonus}đ</span>
            </li>
            <li className="flex justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span>Điểm quiz tốt nhất</span>
              <span className="font-semibold text-ink">tối đa +{SCORING.quizMaxPoints}đ</span>
            </li>
          </ul>

          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-100">
            <p className="font-semibold">Công bằng &amp; minh bạch:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li><strong>Không tính số lần bấm thử lại</strong> — đọc lại câu đã đạt không được thêm điểm.</li>
              <li>Quiz tính theo <strong>điểm cao nhất</strong>, không tính số lần làm bài.</li>
              <li>Mỗi bài học chỉ tính điểm <strong>một lần</strong>.</li>
              <li>Chứng nhận Day-One chỉ cộng <strong>một lần</strong>.</li>
              <li>Mọi số liệu lấy từ <strong>máy chủ</strong> — không tính tiến độ riêng trên thiết bị.</li>
              <li><strong>Không hiển thị email</strong> — chỉ hiện tên và cửa hàng.</li>
            </ul>
          </div>

          <p className="rounded-xl bg-brand-50 p-3 text-xs text-brand-800 ring-1 ring-brand-100">
            Xếp hạng nhằm <strong>khuyến khích học tập</strong>, không phải đánh giá nhân sự chính thức.
          </p>
        </div>
      )}
    </section>
  );
}
