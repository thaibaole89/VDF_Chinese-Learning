// /manager — read-only manager progress dashboard. Phase 2B.7.
//
// Server-rendered. Access is gated TWICE: (1) explicit role check here, and
// (2) the Phase 2A.1 manager-read RLS policies — a staff caller's queries would
// only return their own rows even if they reached the data layer. No
// service_role, no new RPC, no schema change.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadManagerDashboard, loadTranslationUsage } from "@/lib/managerDashboard";
import ManagerLearnerList from "@/components/ManagerLearnerList";

export const metadata = {
  title: "Quản lý tiến độ · VDF Chinese",
  robots: { index: false, follow: false },
};

function SummaryCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "warn";
}) {
  const valueTone =
    tone === "good" ? "text-green-700" : tone === "warn" ? "text-amber-700" : "text-ink";
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-card ring-1 ring-gray-100">
      <div className={`nums text-2xl font-bold tracking-tight ${valueTone}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-gray-500">{label}</div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
    </div>
  );
}

export default async function ManagerPage() {
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

  const dashboard = await loadManagerDashboard(supabase);

  // Not a manager → polite restricted message (staff).
  if (!dashboard) {
    return (
      <div className="space-y-5">
        <header className="pt-2">
          <Link href="/account" className="text-sm text-brand-600">
            ← Tài khoản
          </Link>
          <h1 className="mt-1 text-xl font-bold text-ink">Khu vực quản lý</h1>
        </header>
        <section className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800 ring-1 ring-amber-100">
          <p className="font-semibold">🔒 Chỉ dành cho quản lý</p>
          <p className="mt-1">
            Trang này chỉ dành cho tài khoản quản lý (manager). Nếu anh/chị cần quyền xem tiến độ
            nhóm, vui lòng liên hệ trưởng nhóm pilot để được cấp quyền.
          </p>
          <Link
            href="/account"
            className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white tap"
          >
            Về trang Tài khoản
          </Link>
        </section>
      </div>
    );
  }

  const s = dashboard.summary;
  // Manager already confirmed above → safe to load usage (RLS is the backstop).
  const usage = await loadTranslationUsage(supabase);

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/account" className="text-sm text-brand-600">
          ← Tài khoản
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">📊 Quản lý tiến độ</h1>
        <p className="text-sm text-gray-500">
          Theo dõi tiến độ học của nhân viên (chỉ xem). Số liệu lấy từ máy chủ.
        </p>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-3 gap-2">
        <SummaryCard label="Tổng học viên" value={`${s.totalLearners}`} />
        <SummaryCard label="Đã đạt Day-One" value={`${s.certified}`} tone="good" />
        <SummaryCard label="Chưa đạt" value={`${s.notCertified}`} tone="warn" />
        <SummaryCard label="Quiz TB" value={`${s.avgBestQuiz}`} sub="/ 100" />
        <SummaryCard label="Đọc đạt TB" value={`${s.avgVoicePass}`} sub="câu / người" />
        <SummaryCard label="Lộ trình BB" value={`${s.avgRequiredCompletionPct}%`} sub="hoàn thành TB" />
      </section>

      {/* Translation usage (metadata only — no conversation content) */}
      {usage && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Sử dụng dịch thuật</h2>
          <div className="grid grid-cols-3 gap-2">
            <SummaryCard label="Lượt dịch hôm nay" value={`${usage.todayRequests}`} />
            <SummaryCard label="Ký tự hôm nay" value={`${usage.todayChars.toLocaleString("vi-VN")}`} />
            <SummaryCard label="Ký tự 7 ngày" value={`${usage.sevenDayChars.toLocaleString("vi-VN")}`} />
            <SummaryCard label="Lỗi (7 ngày)" value={`${usage.failureCount}`} tone={usage.failureCount > 0 ? "warn" : "default"} />
            <SummaryCard label="Chặn giới hạn" value={`${usage.rateLimitCount}`} tone={usage.rateLimitCount > 0 ? "warn" : "default"} />
            <SummaryCard label="Nhà cung cấp" value="Google" />
          </div>
          {usage.topUsers.length > 0 && (
            <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Dùng nhiều nhất (7 ngày · theo ký tự)
              </h3>
              <ul className="mt-2 space-y-1.5">
                {usage.topUsers.map((u, i) => (
                  <li key={u.userId} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0 text-center text-xs font-bold text-gray-400">{i + 1}</span>
                      <span className="truncate text-ink">{u.displayName}</span>
                    </span>
                    <span className="nums shrink-0 text-xs font-semibold text-gray-600">
                      {u.chars.toLocaleString("vi-VN")} ký tự
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-[11px] text-gray-400">
            Chỉ thống kê số liệu (ngôn ngữ, số ký tự, thành công/lỗi) — không lưu nội dung câu dịch.
          </p>
        </section>
      )}

      {/* Learner list + filters */}
      <ManagerLearnerList learners={dashboard.learners} stores={dashboard.stores} />

      <p className="rounded-xl bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-500">
        Bảng chỉ để theo dõi & hỗ trợ đào tạo nội bộ, không phải đánh giá nhân sự chính thức. Quản lý
        chỉ xem, không sửa được tiến độ học viên ở phiên bản này.
      </p>
    </div>
  );
}
