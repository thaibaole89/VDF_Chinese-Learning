// /hall-of-fame — weekly Hall of Fame leaderboard. Phase 2B.3.
//
// Server-rendered. Auth is enforced app-wide by middleware (unauthenticated →
// /login); this component also resolves the user to highlight their row and to
// guard against an unconfigured session. Data comes from the SECURITY DEFINER
// RPC get_weekly_leaderboard() — server-trusted, email-free.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchWeeklyLeaderboard } from "@/lib/leaderboard";
import LeaderboardView from "@/components/LeaderboardView";
import LeaderboardScoringInfo from "@/components/LeaderboardScoringInfo";

export const metadata = {
  title: "Hall of Fame · VDF Chinese",
  robots: { index: false, follow: false },
};

export default async function HallOfFamePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-3">
        <Link href="/account" className="text-sm text-brand-600">
          ← Tài khoản
        </Link>
        <p className="text-sm text-gray-500">Bạn cần đăng nhập để xem bảng xếp hạng.</p>
      </div>
    );
  }

  const { entries, unavailable } = await fetchWeeklyLeaderboard(supabase);
  const myEntry = entries.find((e) => e.userId === user.id) ?? null;

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/account" className="text-sm text-brand-600">
          ← Tài khoản
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-ink">🏆 Hall of Fame</h1>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Tuần này
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Bảng vinh danh nhân viên học chăm nhất — làm mới mỗi tuần (giờ Việt Nam).
        </p>
      </header>

      {/* Pilot disclaimer — keep the board friendly, not a performance review. */}
      <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-800 ring-1 ring-amber-100">
        Bảng xếp hạng dùng cho pilot đào tạo nội bộ, không dùng làm đánh giá KPI chính thức.
      </div>

      <LeaderboardScoringInfo />

      {unavailable ? (
        <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800 ring-1 ring-amber-100">
          <p className="font-semibold">Bảng xếp hạng chưa sẵn sàng</p>
          <p className="mt-1">
            Tính năng này cần cập nhật máy chủ (migration 003). Liên hệ trưởng nhóm pilot để bật.
          </p>
        </div>
      ) : (
        <>
          {/* Current user's standing — shown when they have an entry but
              aren't necessarily on the podium. */}
          {myEntry && (
            <section className="rounded-2xl bg-brand-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                    Hạng của bạn tuần này
                  </p>
                  <p className="mt-0.5 text-2xl font-bold">#{myEntry.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums">{myEntry.weeklyScore}đ</p>
                  <p className="text-[11px] text-white/70">
                    {myEntry.completedRequiredCount} bài bắt buộc · {myEntry.voicePassCount} câu đọc đạt
                  </p>
                </div>
              </div>
            </section>
          )}

          <LeaderboardView entries={entries} currentUserId={user.id} />

          <p className="text-center text-[11px] text-gray-400">
            Bảng chỉ hiển thị tên và cửa hàng — không hiển thị email. Điểm tính từ dữ liệu máy chủ.
          </p>
        </>
      )}
    </div>
  );
}
