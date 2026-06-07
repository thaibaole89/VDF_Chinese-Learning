// /tools/translate — live translation tool. Phase 2B.4.
// Auth is enforced app-wide by middleware (unauthenticated → /login). The tool
// itself is a client component; this server wrapper resolves the user as a
// guard and renders the page chrome.

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TranslateTool from "./TranslateTool";

export const metadata = {
  title: "Dịch đa ngôn ngữ · VDF",
  robots: { index: false, follow: false },
};

export default async function TranslatePage() {
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
        <p className="text-sm text-gray-500">Bạn cần đăng nhập để dùng công cụ dịch.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link href="/" className="text-sm text-brand-600">
          ← Trang chủ
        </Link>
        <h1 className="mt-1 text-xl font-bold text-ink">🗣️ Dịch đa ngôn ngữ tại quầy</h1>
        <p className="text-sm text-gray-500">
          Nói hoặc gõ — dịch nhanh giữa tiếng Việt và tiếng Trung, Anh, Hàn, Nhật, Pháp để giao tiếp với khách.
        </p>
      </header>

      <TranslateTool />
    </div>
  );
}
