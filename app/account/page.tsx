// /account — Phase 2A.3 adds: server stats card + sync button. Cert UI still
// belongs to 2A.4.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_VERSION_LABEL } from "@/lib/version";
import SyncProgressButton from "@/components/SyncProgressButton";

export const metadata = {
  title: "Tài khoản · VDF Chinese",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already enforces auth — if user is null here, env isn't configured.
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, store, role, email, best_quiz_score, voice_pass_count, phrase_learned_count")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Bạn";

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Tài khoản</h1>
      </header>

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

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-500">Tiến độ trên tài khoản</h2>
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
            <div className="text-2xl font-semibold text-ink">{profile?.phrase_learned_count ?? 0}</div>
            <div className="text-xs text-gray-500">Câu đã thuộc</div>
          </div>
        </div>
      </section>

      <SyncProgressButton />

      <section className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
        <p className="font-medium">📍 Phase 2A.3 — đồng bộ tiến độ</p>
        <p className="mt-1">
          Mỗi lần học, app ghi vào thiết bị và đồng thời đẩy lên tài khoản. Chứng nhận Day-One sẽ
          xuất hiện ở bản 2A.4 khi đủ điều kiện.
        </p>
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
