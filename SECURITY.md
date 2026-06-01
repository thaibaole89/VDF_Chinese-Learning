# SECURITY — VDF Chinese Sales Tutor (Internal Pilot)

**Phạm vi:** Internal pilot for Vietnam Duty Free shop-floor staff. Đây **không
phải bản production cho khách hàng**.

---

## 1. Quy tắc tuyệt đối

- **KHÔNG share link app ra ngoài nhóm pilot** (5–10 nhân viên + supervisor + người duyệt nội dung).
- **KHÔNG đăng link lên Facebook / Zalo / LinkedIn / website public.**
- **KHÔNG để repo GitHub chuyển sang Public** — phải giữ **Private**.
- **KHÔNG chia sẻ tài khoản (email + password) giữa các nhân viên** — mỗi staff phải có account riêng.
- Nội dung tiếng Trung và hình ảnh đều `needs_review` / `placeholder` — chưa phải nội dung chính thức.

## 2. Gate chính: Supabase Auth (Phase 2A)

**Phase 2A.5 đã bỏ pilot password gate cũ.** Toàn bộ quyền truy cập app hiện
đi qua tài khoản Supabase (email + password) riêng cho từng nhân viên.

### Cách hoạt động
- Khi `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` được set,
  mọi route chính (trừ `/login`, `/api/auth/*`, static assets) yêu cầu user
  đã đăng nhập. Chưa login → redirect `/login?next=<path>`.
- Session lưu trong **httpOnly cookie** do Supabase SSR quản lý; middleware
  refresh session mỗi request. Token không bao giờ vào localStorage/JS.
- Anon JWT (role=anon) AN TOÀN trong client bundle. **Service_role key
  KHÔNG BAO GIỜ** vào client/repo/env app.
- Account creation = **admin-only** (anh tạo tay trong Supabase Studio); KHÔNG có /signup public.
- Không index (`robots.txt` + meta `noindex,nofollow` + header `X-Robots-Tag`) vẫn giữ.

### Quản lý tài khoản (anh — admin)
1. **Tạo:** Supabase Dashboard → Authentication → Users → Add user → ✅ Auto Confirm.
2. **Reset password:** Authentication → Users → click user → Send password recovery / set new.
3. **Disable / xoá:** Authentication → Users → menu hàng → Delete user (revoke ngay).
4. **Audit access:** Authentication → Logs (signins, signouts, password resets).

### Local dev
- Tạo `.env.local` (đã gitignore) với `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Hoặc bỏ trống cả 2 env → gate tắt hoàn toàn (anonymous mode, dùng cho UI dev).
- Mẫu xem `.env.example`.

### Legacy gate retirement (2A.5 changes)
- ❌ `PILOT_ACCESS_PASSWORD` env var — **đã không còn dùng**. Xoá khỏi Vercel Settings
  → Environment Variables.
- ❌ `/pilot-access` route + `/api/pilot-access` API — đã xoá khỏi codebase.
- ❌ Cookie `vdf_pilot_access_granted` — không còn được set; cookie cũ trên thiết bị
  user vô hại (không bị middleware đọc), tự hết hạn sau 7 ngày.
- ✅ Logout duy nhất hiện qua **/account → Đăng xuất** (gọi `/api/auth/logout`).

---

## 3. Bật Vercel Deployment Protection (KHUYẾN NGHỊ thêm — bảo vệ tầng Vercel)

Hiện trạng: app đang deploy public trên Vercel (không protect). Phải bật Deployment Protection
để chỉ người trong team / có mật khẩu mới mở được.

### Hướng dẫn từng bước

1. Vào **Vercel Dashboard** → chọn project `vdf-chinese-learning`.
2. Vào **Settings** (menu trên) → **Deployment Protection** (menu trái).
3. Chọn **Vercel Authentication** (mặc định khuyến nghị):
   - Áp dụng cho: **All deployments** (cả production + preview).
   - Ai được vào: **Only members of your team** (kéo email người duyệt nội dung + pilot supervisor
     vào team Vercel, gán role **Member** hoặc **Viewer**).
   - Bấm **Save**.
4. *(Tuỳ chọn nếu nhân viên không có tài khoản Vercel)* dùng **Password Protection** thay thế:
   - Đặt **mật khẩu mạnh** (≥12 ký tự, không trùng mật khẩu khác).
   - Lưu mật khẩu trong **1 nơi an toàn** (vd 1Password / VDF IT vault).
   - Gửi mật khẩu **qua kênh riêng** (Zalo cá nhân, không group), **không** đính kèm trong link.

### Kiểm tra sau khi bật

- ☐ Mở **chế độ Ẩn danh (Incognito / Private Window)** trên Chrome/Edge.
- ☐ Dán URL preview → phải **bị chặn / hiện form đăng nhập / mật khẩu** (không vào thẳng được).
- ☐ Đăng nhập (hoặc nhập mật khẩu) → vào được app.
- ☐ Mở thử trên điện thoại Android của 1 nhân viên pilot → vẫn bị chặn cho đến khi đăng nhập/nhập mật khẩu.

> **Nếu thử Incognito mà vẫn vào được app không cần login → Protection CHƯA bật đúng. Dừng pilot
> cho đến khi sửa.**

## 3.5. Supabase Auth + DB (Phase 2A — hoàn thiện)

### Forge-proof voice scoring (Phase 2A.2a)
- `REVOKE INSERT` trên `voice_attempts` — mọi ghi đi qua RPC `submit_voice_attempt()`
  `SECURITY DEFINER` đặt trên server. Client gửi `transcript`; server tự tính
  `score` + `result` từ PL/pgSQL port của `lib/voiceScoring.ts`. Mọi score/result
  client tự đặt đều bị bỏ qua.
- Đã verify bằng 13 forge-attack test (xem `supabase/FORGE_ATTACK_TEST.md`).

### Server-side cert eligibility (Phase 2A.4)
- Chứng nhận Day-One được tính trực tiếp từ `phrase_progress` + `voice_attempts` +
  `profiles.best_quiz_score`, filter theo `lesson_id='lesson_day_one_10_phrases'`,
  RLS auto-scope `user_id = auth.uid()`.
- Eligibility **không bao giờ** đọc localStorage. Reset localStorage không cấp được cert giả.

### An toàn ở tầng DB
- **Anon key** (role=anon, JWT) AN TOÀN trong client bundle. **Service_role key
  KHÔNG BAO GIỜ** vào client/repo/env app.
- **RLS bật + FORCE** trên tất cả 4 bảng (`profiles`, `lesson_progress`, `voice_attempts`,
  `phrase_progress`).
- **Default-deny + explicit grants.** Mọi policy có cả `USING` và `WITH CHECK`.
- **Column-level lock:** `role` column trên `profiles` **không** trong `GRANT UPDATE` → staff không
  tự elevate được dù policy cho phép update row của mình.
- **Auto-create profile** trigger `on_auth_user_created` chạy `SECURITY DEFINER`.

### Setup + env vars
Chi tiết step-by-step: xem **`PHASE_2A_SETUP.md`**.

### Rotate
- Anon key: Settings → API → "Reset anon key" → update env trên Vercel. Người dùng phải đăng nhập lại.
- Admin user passwords: anh reset trong Authentication → Users.

---

## 4. Bảo mật ở tầng app (đã có sẵn — không phải làm thêm)

- ✅ Repo GitHub là **Private** (`thaibaole89/VDF_Chinese-Learning`).
- ✅ `.gitignore` chặn raw media (`*.mov`, `*.mp4`, `*.jpg/.jpeg/.png/.heic/.webp` ở thư mục nguồn);
  chỉ cho qua các icon + logo VDF + 15 visual generated.
- ✅ Content `sourceRefs` được strip ở build-time (`lib/content.data.json`) — bundle client
  không lộ raw filename / OneDrive path.
- ✅ Banner *"Bản xem nội bộ — nội dung đang chờ duyệt…"* hiện ở mọi route.
- ✅ Badge **"Chờ duyệt"** + **"Cần xác nhận"** + `noteVi` hiển thị đầy đủ.
- ✅ `robots.txt` + meta `noindex,nofollow` + header `X-Robots-Tag: noindex, nofollow`
  → công cụ tìm kiếm không index trang preview (chặn vô tình lộ qua Google).

## 5. App hiện tại có / CHƯA có (sau Phase 2A.5)

**ĐÃ CÓ:**
- ✅ Account riêng cho từng nhân viên (Supabase email + password).
- ✅ Server-side database (Supabase Postgres + RLS) lưu phrase_progress + lesson_progress + voice_attempts.
- ✅ Server-side cert eligibility (Day-One certificate trên `/account`).
- ✅ Phân quyền `staff` / `manager` ở DB (column `profiles.role`, đã có policy manager-read; manager dashboard chưa build).
- ✅ Local-first write-through: thao tác lưu vào localStorage rồi mirror lên Supabase, giúp tiến độ không mất khi tạm offline.

**CHƯA CÓ (đúng dự kiến pilot):**
- ❌ Manager dashboard (chỉ có policy DB, chưa có UI).
- ❌ PDF / print chứng nhận.
- ❌ Audio upload — KHÔNG lưu giọng nói, chỉ lưu transcript.
- ❌ Cấp chứng chỉ chính thức từ phòng đào tạo (cert hiện tại là internal-only).

## 6. Voice / micro — lưu ý

- App dùng **browser Speech Recognition API** (zh-CN) cho tính năng "🎤 Luyện đọc".
- Trên Chrome, audio được trình duyệt **gửi lên máy chủ Google** để nhận diện
  (chính sách của trình duyệt, **không** phải app gửi).
- **App KHÔNG lưu / KHÔNG upload file ghi âm**. Chỉ lưu transcript (text máy nghe được) + score
  + result trong `localStorage`.
- Quyền micro chỉ được yêu cầu khi nhân viên **bấm "Bắt đầu đọc"**, không đòi sẵn.
- Xem `VOICE_PRACTICE_TEST_NOTES.md` để hiểu rõ "điểm" là kết quả nhận diện, KHÔNG phải chấm phát âm.

## 7. Nếu có sự cố / nghi ngờ lộ thông tin

1. **Tắt Vercel deployment** ngay lập tức (Vercel Dashboard → project → Deployments → Disable).
2. **Đổi key/secret** đã từng dùng (vd Gemini API key — đã được sinh lại sau Phase 1C.3).
3. Báo cho trưởng nhóm pilot + VDF IT/Legal.
4. Soát log Vercel xem có truy cập lạ không (Settings → Deployment Protection → Access Logs).

## 8. Trước khi mở rộng ra ngoài pilot

- Cần làm Phase 2 (account + audit log + chính sách PII cho hồ sơ đào tạo nhân viên).
- Cần ký HR/Legal về việc thu thập dữ liệu học của nhân viên.
- Xem `PHASE_2_ROADMAP.md`.
