import type { Metadata } from "next";
import AuthTabs from "@/components/AuthTabs";

export const metadata: Metadata = {
  title: "Đăng nhập · VDF Chinese",
  robots: { index: false, follow: false },
};

function safeNext(next?: string): string {
  // Default landing after a fresh login = the course picker, so the learner
  // chooses a course first. A specific `next` (deep link) is preserved.
  if (!next) return "/courses";
  if (!next.startsWith("/") || next.startsWith("//")) return "/courses";
  return next;
}

const ERROR_LABEL: Record<string, string> = {
  invalid: "Email hoặc mật khẩu chưa đúng.",
  unconfigured: "Hệ thống chưa được cấu hình. Liên hệ trưởng nhóm pilot.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = safeNext(searchParams?.next);
  const error = searchParams?.error ? ERROR_LABEL[searchParams.error] : null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-sm flex-col justify-center py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-xl font-bold text-ink">Chào mừng đến VDF</h1>
        <p className="mt-1 text-sm text-gray-500">Đăng nhập hoặc tạo tài khoản để bắt đầu học.</p>

        <div className="mt-4">
          <AuthTabs next={next} loginError={error} />
        </div>

        <p className="mt-4 text-xs text-gray-500">Quên mật khẩu? Liên hệ trưởng nhóm pilot để đặt lại.</p>
      </div>

      <div className="pt-4 text-center text-[11px] text-gray-400">VDF Sales Tutor</div>
    </div>
  );
}
