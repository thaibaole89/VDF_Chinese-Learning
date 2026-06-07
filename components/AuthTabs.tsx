"use client";

// Login + self sign-up tabs for /login. Phase 2C.1.3.
//
// - "Đăng nhập": the existing server form POST to /api/auth/login (unchanged).
// - "Đăng ký": client-side supabase.auth.signUp ONLY (no admin API, no
//   service_role). New users are always staff — role is never sent and the DB
//   column grant blocks self-elevation; the auto-create-profile trigger defaults
//   role='staff'. After a session is returned we set full_name/store on the
//   learner's OWN profile row and land on /courses. If the project still has
//   "Confirm Email" enabled, signUp returns no session and we show a clear note.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD = 6;

function signupErrorVi(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("exists")) {
    return "Email này đã có tài khoản. Hãy chuyển sang tab Đăng nhập.";
  }
  if (m.includes("password")) return "Mật khẩu chưa hợp lệ (tối thiểu 6 ký tự).";
  if (m.includes("email")) return "Email chưa hợp lệ.";
  if (m.includes("signups not allowed") || m.includes("disabled")) {
    return "Đăng ký đang tắt trên hệ thống. Liên hệ quản trị viên để bật đăng ký.";
  }
  return "Không tạo được tài khoản. Vui lòng thử lại hoặc liên hệ quản trị viên.";
}

export default function AuthTabs({ next, loginError }: { next: string; loginError?: string | null }) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Sign-up state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [store, setStore] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNotice(null);

    const name = fullName.trim();
    const mail = email.trim().toLowerCase();
    if (!name) return setErr("Vui lòng nhập họ tên.");
    if (!mail) return setErr("Vui lòng nhập email.");
    if (password.length < MIN_PASSWORD) return setErr(`Mật khẩu cần tối thiểu ${MIN_PASSWORD} ký tự.`);
    if (password !== confirm) return setErr("Mật khẩu nhập lại không khớp.");

    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: mail,
        password,
        // role is intentionally NOT included — new users are staff only.
        options: { data: { full_name: name } },
      });
      if (error) {
        setErr(signupErrorVi(error.message));
        setBusy(false);
        return;
      }

      if (data.session && data.user) {
        // Session established (Confirm Email is OFF). Set own profile fields.
        try {
          await supabase
            .from("profiles")
            .update({ full_name: name, store: store.trim() || null })
            .eq("id", data.user.id);
        } catch {
          /* non-critical — trigger already created the profile with full_name */
        }
        router.push(next || "/courses");
        router.refresh();
        return;
      }

      // No session → project still requires email confirmation.
      setNotice(
        "Tài khoản đã được tạo. Vui lòng kiểm tra email để xác nhận trước khi đăng nhập. " +
          "Nếu cần đăng nhập ngay, quản trị viên cần tắt “Confirm Email” trong Supabase."
      );
      setBusy(false);
    } catch {
      setErr("Hệ thống chưa sẵn sàng. Vui lòng thử lại sau hoặc liên hệ quản trị viên.");
      setBusy(false);
    }
  }

  const inputCls =
    "mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setTab("login")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold tap ${tab === "login" ? "bg-white text-brand-700 shadow-card" : "text-gray-600"}`}
          aria-pressed={tab === "login"}
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold tap ${tab === "signup" ? "bg-white text-brand-700 shadow-card" : "text-gray-600"}`}
          aria-pressed={tab === "signup"}
        >
          Đăng ký
        </button>
      </div>

      {tab === "login" ? (
        <form action="/api/auth/login" method="POST" className="mt-4 space-y-3">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" autoFocus className={inputCls} />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600">
              Mật khẩu
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </div>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap">
            Tiếp tục học
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="mt-4 space-y-3">
          <div>
            <label htmlFor="su-name" className="block text-xs font-medium text-gray-600">
              Họ và tên
            </label>
            <input
              id="su-name"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="su-email" className="block text-xs font-medium text-gray-600">
              Email
            </label>
            <input
              id="su-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="su-store" className="block text-xs font-medium text-gray-600">
              Cửa hàng / bộ phận <span className="text-gray-400">(không bắt buộc)</span>
            </label>
            <input
              id="su-store"
              type="text"
              autoComplete="organization"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="su-pass" className="block text-xs font-medium text-gray-600">
              Mật khẩu <span className="text-gray-400">(tối thiểu {MIN_PASSWORD} ký tự)</span>
            </label>
            <input
              id="su-pass"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="su-confirm" className="block text-xs font-medium text-gray-600">
              Nhập lại mật khẩu
            </label>
            <input
              id="su-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputCls}
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {notice && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-100">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white tap disabled:opacity-60"
          >
            {busy ? "Đang tạo tài khoản…" : "Tạo tài khoản & bắt đầu học"}
          </button>
          <p className="text-[11px] text-gray-400">
            Tài khoản đăng ký là tài khoản nhân viên. Quyền quản lý do quản trị viên cấp riêng.
          </p>
        </form>
      )}
    </div>
  );
}
