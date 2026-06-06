import type { Metadata } from "next";

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
        <h1 className="text-xl font-bold text-ink">Đăng nhập</h1>
        <p className="mt-1 text-sm text-gray-500">VDF Chinese Sales Tutor · pilot nội bộ</p>

        <form action="/api/auth/login" method="POST" className="mt-4 space-y-3">
          <input type="hidden" name="next" value={next} />

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap"
          >
            Tiếp tục học
          </button>
        </form>

        <div className="mt-4 space-y-1 text-xs text-gray-500">
          <p>🔒 Tài khoản được trưởng nhóm pilot cấp riêng. Không tự đăng ký được.</p>
          <p>Quên mật khẩu? Liên hệ trưởng nhóm pilot để reset.</p>
        </div>
      </div>

      <div className="pt-4 text-center text-[11px] text-gray-400">
        Phase 2A.1 · Account scaffold
      </div>
    </div>
  );
}
