// /manager/learners/[userId] — single learner detail (manager-only). Phase 2B.7.
// Read-only. Email is shown here (manager view only, never on Hall of Fame).

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadLearnerDetail, STATUS_LABEL, type LearnerStatus } from "@/lib/managerDashboard";
import { loadLearnerEnglishProgress } from "@/lib/englishProgress";

export const metadata = {
  title: "Chi tiết học viên · VDF Chinese",
  robots: { index: false, follow: false },
};

const STATUS_PILL: Record<LearnerStatus, string> = {
  certified: "bg-green-100 text-green-800",
  needs_quiz: "bg-amber-100 text-amber-800",
  needs_voice: "bg-orange-100 text-orange-800",
  not_certified: "bg-gray-100 text-gray-700",
  not_started: "bg-gray-100 text-gray-500",
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

const RESULT_PILL: Record<string, string> = {
  pass: "bg-green-100 text-green-800",
  manual: "bg-brand-100 text-brand-700",
  near: "bg-amber-100 text-amber-800",
  retry: "bg-orange-100 text-orange-800",
};
const RESULT_LABEL: Record<string, string> = {
  pass: "Đạt",
  manual: "Thủ công",
  near: "Gần đúng",
  retry: "Luyện thêm",
};

export default async function LearnerDetailPage({ params }: { params: { userId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <p className="text-sm text-gray-500">Bạn cần đăng nhập.</p>
      </div>
    );
  }

  const detail = await loadLearnerDetail(supabase, params.userId);

  // Not a manager OR learner not found → restricted message (no data leak).
  if (!detail) {
    return (
      <div className="space-y-5">
        <header className="pt-2">
          <Link href="/manager" className="text-sm text-brand-600">
            ← Quản lý tiến độ
          </Link>
          <h1 className="mt-1 text-xl font-bold text-ink">Không khả dụng</h1>
        </header>
        <p className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800 ring-1 ring-amber-100">
          Không tìm thấy học viên, hoặc bạn không có quyền xem (chỉ quản lý mới truy cập được).
        </p>
      </div>
    );
  }

  const r = detail.requirements;
  const english = await loadLearnerEnglishProgress(supabase, params.userId);

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/manager" className="text-sm text-brand-600">
          ← Quản lý tiến độ
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-ink">{detail.displayName}</h1>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_PILL[detail.status]}`}>
            {STATUS_LABEL[detail.status]}
          </span>
        </div>
      </header>

      {/* Profile (manager-only — email shown here, never on Hall of Fame) */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-gray-500">Email</dt>
            <dd className="truncate text-ink">{detail.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t pt-2">
            <dt className="text-gray-500">Cửa hàng</dt>
            <dd className="text-ink">{detail.store ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t pt-2">
            <dt className="text-gray-500">Vai trò</dt>
            <dd className="text-ink">{detail.role}</dd>
          </div>
        </dl>
      </section>

      {/* Day-One requirement breakdown */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <h2 className="text-sm font-bold text-ink">Điều kiện chứng nhận Day-One</h2>
        <ul className="mt-2 space-y-2 text-sm">
          <ReqRow
            label="Câu đã thuộc (Day-One)"
            value={`${detail.dayOnePhrasesLearned}/${r.phrasesLearnedTarget}`}
            met={detail.dayOnePhrasesLearned >= r.phrasesLearnedTarget}
          />
          <ReqRow
            label="Luyện đọc đạt (Day-One)"
            value={`${detail.dayOneVoicePassed}/${r.voicePassedTarget}`}
            met={detail.dayOneVoicePassed >= r.voicePassedTarget}
          />
          <ReqRow
            label="Điểm quiz tốt nhất"
            value={`${detail.bestQuizScore.toFixed(0)}/${r.bestQuizScoreTarget}`}
            met={detail.bestQuizScore >= r.bestQuizScoreTarget}
          />
        </ul>
        <div
          className={`mt-3 rounded-xl p-2.5 text-center text-sm font-semibold ${
            detail.certified ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
          }`}
        >
          {detail.certified ? "✓ Đã đạt chứng nhận Day-One" : "Chưa đạt chứng nhận Day-One"}
        </div>
        {detail.certified && (
          <p className="mt-2 text-center text-[11px] text-gray-500">
            Học viên có thể tự xem &amp; in chứng nhận trong mục Tài khoản của mình.
          </p>
        )}
      </section>

      {/* English course progress (separate course; not part of Day-One cert) */}
      {english.available && (
        <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-ink">Khoá tiếng Anh 🇬🇧</h2>
            <span className="nums text-xs font-semibold text-gray-600">
              {english.learned}/{english.total} câu · {english.pct}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${english.pct}%` }} />
          </div>
          {english.completedLessons.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {english.completedLessons.map((l) => (
                <li key={l.lessonId} className="flex items-center gap-2 text-sm">
                  <span className="text-green-600" aria-hidden>
                    ✓
                  </span>
                  <span className="text-ink">{l.titleVi}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-gray-400">Chưa hoàn thành bài tiếng Anh nào.</p>
          )}
          <p className="mt-2 text-[11px] text-gray-400">Khoá tiếng Anh chưa tính vào chứng nhận / Bảng vinh danh.</p>
        </section>
      )}

      {/* Required lessons */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-ink">Lộ trình bắt buộc</h2>
          <span className="nums text-xs font-semibold text-gray-600">
            {detail.requiredCompleted}/{detail.requiredTotal}
          </span>
        </div>
        <ul className="mt-2 space-y-1">
          {detail.requiredLessons.map((l) => (
            <li key={l.lessonId} className="flex items-center gap-2 text-sm">
              <span className={l.completed ? "text-green-600" : "text-gray-300"} aria-hidden>
                {l.completed ? "✓" : "○"}
              </span>
              <span className={l.completed ? "text-ink" : "text-gray-500"}>
                {l.titleVi ?? l.lessonId}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent voice attempts */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <h2 className="text-sm font-bold text-ink">Luyện đọc gần đây</h2>
        {detail.recentVoice.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">Chưa có lượt luyện đọc.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {detail.recentVoice.map((v, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5">
                <span className="hanzi min-w-0 truncate text-sm text-ink">{v.phraseZh ?? v.phraseId}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {v.score !== null && <span className="nums text-xs text-gray-500">{v.score}</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RESULT_PILL[v.result] ?? "bg-gray-100 text-gray-600"}`}>
                    {RESULT_LABEL[v.result] ?? v.result}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent lesson completions */}
      <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
        <h2 className="text-sm font-bold text-ink">Bài đã hoàn thành gần đây</h2>
        {detail.recentLessons.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">Chưa hoàn thành bài nào.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {detail.recentLessons.map((l, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-ink">{l.titleVi ?? l.lessonId}</span>
                <span className="shrink-0 text-[11px] text-gray-400">{fmt(l.completedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="rounded-xl bg-gray-50 p-3 text-[11px] text-gray-500">
        Chỉ xem — không sửa được tiến độ học viên ở phiên bản này.
      </p>
    </div>
  );
}

function ReqRow({ label, value, met }: { label: string; value: string; met: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2">
        <span className={met ? "text-green-600" : "text-gray-300"} aria-hidden>
          {met ? "✓" : "○"}
        </span>
        <span className="text-gray-700">{label}</span>
      </span>
      <span className={`nums text-sm font-semibold ${met ? "text-green-700" : "text-gray-600"}`}>{value}</span>
    </li>
  );
}
