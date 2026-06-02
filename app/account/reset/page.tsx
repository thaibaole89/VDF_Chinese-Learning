// /account/reset — explicit progress-reset confirmation page. Phase 2B.2.
//
// Auth-gated (middleware already enforces login app-wide; this server component
// also resolves the user so the page can't render for an unconfigured/null
// session). The destructive action itself runs client-side in ResetProgressForm
// (local wipe + clearServerProgress RPC-less deletes scoped to auth.uid()).

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ResetProgressForm from "@/components/ResetProgressForm";

export const metadata = {
  title: "Xoá tiến độ · VDF Chinese",
  robots: { index: false, follow: false },
};

export default async function ResetPage() {
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
        <p className="text-sm text-gray-500">
          Bạn cần đăng nhập để dùng tính năng này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/account" className="text-sm text-brand-600">
          ← Tài khoản
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">Xoá tiến độ học</h1>
        <p className="text-sm text-gray-500">
          Đặt lại toàn bộ tiến độ học của tài khoản <strong>{user.email}</strong>.
        </p>
      </header>

      <ResetProgressForm />

      <p className="text-center text-xs text-gray-400">
        Không muốn xoá?{" "}
        <Link href="/account" className="text-brand-600 underline">
          Quay lại Tài khoản
        </Link>
      </p>
    </div>
  );
}
