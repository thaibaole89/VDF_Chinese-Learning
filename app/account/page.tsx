// Minimal /account page — Phase 2A.1 only proves login + profile fetch work.
// 2A.4 will expand this into the dashboard + certificate ladder.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_VERSION_LABEL } from "@/lib/version";

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
    .select("full_name, store, role, email")
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

      <section className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
        <p className="font-medium">📍 Phase 2A.1 — bản scaffold</p>
        <p className="mt-1">
          Tài khoản hoạt động, nhưng tiến độ học hiện vẫn lưu trên thiết bị (localStorage). Bản 2A.3
          sẽ đồng bộ lên server. Bản 2A.4 sẽ thêm chứng nhận Day-One.
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
