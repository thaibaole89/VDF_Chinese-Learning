"use client";

// Explicit, low-risk progress reset. Phase 2B.2.
//
// Lives on its own page (/account/reset), NOT on the main dashboard, so a
// learner can't wipe their progress with a stray tap. Requires an explicit
// checkbox acknowledgement before the destructive button enables. Clears local
// device progress (all localStorage keys) AND server progress for the current
// user (clearServerProgress → deletes lesson_progress / phrase_progress /
// voice_attempts rows scoped to auth.uid()).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetAllLocalProgress } from "@/lib/storage";
import { clearServerProgress, isAuthenticated } from "@/lib/progress";

export default function ResetProgressForm() {
  const router = useRouter();
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onReset() {
    if (!ack || busy) return;
    setBusy(true);
    setError(null);
    try {
      // Local first (synchronous, always succeeds).
      resetAllLocalProgress();
      // Server next — best-effort; clearServerProgress no-ops if unauthenticated.
      if (isAuthenticated()) {
        await clearServerProgress();
      }
      setDone(true);
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : String(e);
      setError(`Có lỗi khi xoá tiến độ trên máy chủ: ${msg}. Tiến độ trên thiết bị này đã được xoá.`);
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 p-5 ring-1 ring-green-100">
        <h2 className="text-base font-bold text-green-800">Đã xoá tiến độ</h2>
        <p className="mt-1 text-sm text-green-900">
          Tiến độ học của bạn trên thiết bị này đã được xoá
          {isAuthenticated() ? " và tài khoản đã được đặt lại" : ""}.
        </p>
        {error && <p className="mt-2 text-xs text-amber-800">{error}</p>}
        <button
          onClick={() => router.push("/account")}
          className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap"
        >
          Về trang Tài khoản
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
      <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-100">
        <p className="text-sm font-semibold text-red-800">⚠️ Hành động này không thể hoàn tác.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-800">
          <li>Xoá toàn bộ tiến độ học trên thiết bị này (câu đã thuộc, luyện đọc, thẻ, kiểm tra).</li>
          <li>Đặt lại tiến độ trên tài khoản: câu đã thuộc, luyện đọc, bài đã hoàn thành.</li>
          <li>
            Sau khi xoá, chứng nhận Day-One sẽ <strong>không còn</strong> cho đến khi bạn học và đạt lại.
          </li>
        </ul>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <span className="text-sm text-gray-700">
          Tôi hiểu rằng việc này sẽ xoá vĩnh viễn tiến độ học của tôi trên thiết bị này và trên tài khoản.
        </span>
      </label>

      <button
        onClick={onReset}
        disabled={!ack || busy}
        className="mt-4 w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white tap disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Đang xoá…" : "Xóa tiến độ của tôi"}
      </button>
    </div>
  );
}
