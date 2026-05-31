"use client";

import { useEffect, useState } from "react";
import {
  syncLocalToServer,
  isAuthenticated,
  authResolved,
  type SyncSummary,
} from "@/lib/progress";
import { getProgress } from "@/lib/storage";

// Shows a single-click "Đồng bộ tiến độ" button on pages where the user is
// authenticated AND localStorage has progress that hasn't been mirrored yet.
// One-way push only (per memo §4 hard guardrail #4) — server becomes the
// truth after this.
export default function SyncProgressButton() {
  const [authReady, setAuthReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [localCount, setLocalCount] = useState({ phrases: 0, lessons: 0 });
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<SyncSummary | null>(null);

  useEffect(() => {
    const tick = () => {
      setAuthReady(authResolved());
      setAuthed(isAuthenticated());
      const p = getProgress();
      setLocalCount({ phrases: p.completedPhraseIds.length, lessons: p.completedLessonIds.length });
    };
    tick();
    // Poll briefly until auth resolves (Supabase getSession is async on first load).
    const iv = setInterval(() => {
      if (!authResolved()) tick();
      else { tick(); clearInterval(iv); }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  async function onClick() {
    setBusy(true);
    setSummary(null);
    try {
      const s = await syncLocalToServer();
      setSummary(s);
    } finally {
      setBusy(false);
    }
  }

  // Hide entirely if not signed in, or no local progress to push.
  if (!authReady) return null;
  if (!authed) return null;
  if (localCount.phrases + localCount.lessons === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-sm font-semibold text-ink">Đồng bộ tiến độ</h2>
      <p className="mt-1 text-xs text-gray-500">
        Tiến độ trên thiết bị này có thể được đẩy lên tài khoản. Sau khi đồng bộ, tài khoản trở thành
        nguồn chính.
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Sẵn sàng đẩy: {localCount.phrases} câu đã thuộc · {localCount.lessons} bài đã xong.
      </p>
      <button
        onClick={onClick}
        disabled={busy}
        className="mt-3 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white tap disabled:opacity-60"
      >
        {busy ? "Đang đồng bộ…" : "Đẩy tiến độ thiết bị lên tài khoản"}
      </button>
      {summary && (
        <p className="mt-2 text-xs text-gray-600">
          ✓ {summary.phrasesPushed + summary.lessonsPushed} mục đã đồng bộ
          {summary.phrasesFailed + summary.lessonsFailed > 0
            ? ` · ${summary.phrasesFailed + summary.lessonsFailed} lỗi`
            : ""}
          {summary.skipped.voice > 0 || summary.skipped.quiz > 0
            ? ` · bỏ qua ${summary.skipped.voice} luyện đọc + ${summary.skipped.quiz} câu kiểm tra (sẽ tự ghi nhận từ lần sau)`
            : ""}
          .
        </p>
      )}
    </div>
  );
}
