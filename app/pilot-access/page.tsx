import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot access · VDF Chinese",
  robots: { index: false, follow: false },
};

// Open-redirect guard: only allow same-origin internal paths.
function safeNext(next?: string): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export default function PilotAccessPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = safeNext(searchParams?.next);
  const error = searchParams?.error === "1";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-sm flex-col justify-center py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-xl font-bold text-ink">VDF Chinese Sales Tutor</h1>
        <p className="mt-1 text-sm text-gray-500">Bản preview nội bộ</p>

        <p className="mt-4 text-sm text-ink">Vui lòng nhập mật khẩu pilot để truy cập.</p>

        {/* Server-rendered form — no client JS; password is never sent to the client bundle. */}
        <form action="/api/pilot-access" method="POST" className="mt-3 space-y-3">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="pwd" className="block text-xs font-medium text-gray-600">
            Mật khẩu pilot
          </label>
          <input
            id="pwd"
            name="password"
            type="password"
            required
            autoComplete="off"
            autoFocus
            className="w-full rounded-xl border border-gray-300 px-3 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {error && (
            <p className="text-sm text-red-600">Mật khẩu chưa đúng. Vui lòng thử lại.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap"
          >
            Truy cập
          </button>
        </form>

        <div className="mt-4 space-y-1 text-xs text-gray-500">
          <p>🔒 Không chia sẻ link hoặc mật khẩu ra ngoài nhóm pilot.</p>
          <p>App không lưu file ghi âm. Tiến độ học hiện lưu trên thiết bị này.</p>
        </div>
      </div>

      <div className="pt-4 text-center text-[11px] text-gray-400">
        Phase 1H · Pilot Access Gate
      </div>
    </div>
  );
}
