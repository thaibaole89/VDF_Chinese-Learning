// /account — learner dashboard (Phase 2B.1).
//
// One stop for a pilot learner: profile + active course + Day-One module
// status + overall lessons progress + next-action suggestion + certificate
// (when eligible) + utilities. Replaces the older /progress as the canonical
// "where am I in this course" page; /progress now redirects here.
//
// Server-rendered. Eligibility + dashboard both read RLS-scoped data from
// Supabase. localStorage is never trusted for cert grants or counts.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_VERSION_LABEL } from "@/lib/version";
import SyncProgressButton from "@/components/SyncProgressButton";
import DayOneCertificate from "@/components/DayOneCertificate";
import DayOneNextActions from "@/components/DayOneNextActions";
import LearningOverviewCard from "@/components/LearningOverviewCard";
import { computeDayOneEligibility } from "@/lib/dayOneEligibility";
import { computeLearnerDashboard } from "@/lib/learnerDashboard";

export const metadata = {
  title: "Tài khoản · VDF Chinese",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
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
        <p className="text-sm text-gray-500">
          Supabase chưa được cấu hình. Liên hệ trưởng nhóm pilot.
        </p>
      </div>
    );
  }

  // Profile + Day-One eligibility in parallel. Dashboard then depends on
  // eligibility, so it runs after — but it's a single round-trip so the
  // sequential wait is negligible.
  const [{ data: profile }, eligibility] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, store, role, email, best_quiz_score, voice_pass_count, phrase_learned_count"
      )
      .eq("id", user.id)
      .maybeSingle(),
    computeDayOneEligibility(supabase),
  ]);
  const dashboard = await computeLearnerDashboard(supabase, eligibility);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Bạn";

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tài khoản học tập</h1>
        <p className="text-sm text-gray-500">
          Thông tin tài khoản, tiến độ khoá học và gợi ý bước học tiếp theo.
        </p>
      </header>

      {/* Profile */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">Xin chào,</p>
        <p className="mt-1 text-2xl font-bold text-ink">{displayName}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-t pt-2">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
          {profile?.store && (
            <div className="flex justify-between border-t pt-2">
              <dt className="text-gray-500">Cửa hàng</dt>
              <dd className="text-ink">{profile.store}</dd>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <dt className="text-gray-500">Vai trò</dt>
            <dd className="text-ink">{profile?.role ?? "staff"}</dd>
          </div>
        </dl>
      </section>

      {/* Learning dashboard — active course + Day-One module + overall + next */}
      <LearningOverviewCard data={dashboard} />

      {/* Weekly Hall of Fame — friendly competition. Lives off the dashboard,
          not in BottomNav (already crowded). */}
      <Link
        href="/hall-of-fame"
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-brand-50 p-4 shadow-sm ring-1 ring-amber-100 tap"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl" aria-hidden>
          🏆
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink">Hall of Fame tuần này</div>
          <p className="mt-0.5 text-xs text-gray-600">
            Xem bảng xếp hạng học chăm nhất trong tuần.
          </p>
        </div>
        <span className="shrink-0 text-brand-600">→</span>
      </Link>

      {/* Day-One certificate when eligible; next-action ladder otherwise.
          The ladder gives the granular phrase/voice/quiz unmet copy that the
          mini-status above only summarises. */}
      {eligibility.eligible ? (
        <DayOneCertificate
          displayName={displayName}
          store={profile?.store ?? null}
          earliestEligibleAt={eligibility.earliestEligibleAt}
          phrasesLearned={eligibility.phrasesLearned}
          voicePassed={eligibility.voicePassed}
          bestQuizScore={eligibility.bestQuizScore}
          totalPhrases={eligibility.totalPhrases}
        />
      ) : (
        <DayOneNextActions data={eligibility} />
      )}

      {/* Profile counts — still useful as a glance summary even when the
          overview card shows the same numbers in mini-tiles. Kept tight. */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Số liệu trên tài khoản</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">
              {Number(profile?.best_quiz_score ?? 0).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Điểm quiz tốt nhất</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">{profile?.voice_pass_count ?? 0}</div>
            <div className="text-xs text-gray-500">Câu luyện đọc đạt</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100">
            <div className="text-2xl font-semibold text-ink">
              {profile?.phrase_learned_count ?? 0}
            </div>
            <div className="text-xs text-gray-500">Câu đã thuộc</div>
          </div>
        </div>
      </section>

      {/* Utilities — sync + device check + reset/logout. Demoted from primary
          flow to a clearly-labeled "Tiện ích" group so they don't compete with
          the learning dashboard for attention. */}
      {/* Manager-only entry — shown only when this account's role is manager. */}
      {profile?.role === "manager" && (
        <Link
          href="/manager"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-50 to-white p-4 shadow-card ring-1 ring-brand-100 tap"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-2xl" aria-hidden>
            📊
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-ink">Quản lý tiến độ nhân viên</div>
            <p className="mt-0.5 text-xs text-gray-600">Xem tiến độ học của cả nhóm (chỉ quản lý).</p>
          </div>
          <span className="shrink-0 text-brand-600">→</span>
        </Link>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500">Tiện ích</h2>
        <SyncProgressButton />
        <Link
          href="/check"
          className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 tap"
        >
          <div>
            <div className="font-semibold text-ink">🔊🎤 Kiểm tra micro & loa</div>
            <p className="mt-0.5 text-xs text-gray-500">
              Chạy trước khi vào phần luyện đọc để chắc thiết bị hoạt động.
            </p>
          </div>
          <span className="text-brand-600">→</span>
        </Link>
        <Link
          href="/about"
          className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 tap"
        >
          <div>
            <div className="font-semibold text-ink">ℹ️ Giới thiệu & phản hồi</div>
            <p className="mt-0.5 text-xs text-gray-500">
              Bản xem nội bộ, cách báo lỗi, lưu ý về luyện đọc.
            </p>
          </div>
          <span className="text-brand-600">→</span>
        </Link>
        {/* Reset lives on its own confirmation page — never a one-tap button here. */}
        <Link
          href="/account/reset"
          className="block px-1 pt-1 text-center text-xs text-gray-400 underline tap"
        >
          Xoá tiến độ học của tôi
        </Link>
      </section>

      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="w-full rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 tap"
        >
          Đăng xuất
        </button>
      </form>

      <div className="pt-2 text-center text-[11px] text-gray-400">{APP_VERSION_LABEL}</div>
    </div>
  );
}
