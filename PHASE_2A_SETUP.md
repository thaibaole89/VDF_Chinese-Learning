# PHASE_2A_SETUP — Supabase setup for the pilot

Áp dụng cho **Phase 2A.1** (scaffold: login + middleware + 3 bảng + /account rỗng).
Các phase tiếp (2A.2 RPC, 2A.3 sync, 2A.4 cert) sẽ thêm migration mới, không sửa file cũ.

> **Trạng thái:** code đã push (commit `<sẽ điền sau khi commit>`). App chỉ thực sự gate auth khi
> 2 env var bên dưới được đặt; ngược lại app vẫn chạy như Phase 1H (chỉ password gate).

---

## A. Tạo Supabase project (anh — một lần)

1. Vào https://supabase.com → New project.
2. **Region: Singapore (Southeast Asia)** — gần Việt Nam, latency thấp.
3. Đặt **strong DB password**, lưu trong 1Password / VDF IT vault.
4. **Plan: Free** đủ cho pilot (500MB DB, 1GB file, 50k MAU). Lên Pro khi rollout.

## B. Lấy env vars

Vào **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (vd `https://abcdefgh.supabase.co`)
- **`anon` `public` key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (JWT bắt đầu bằng `eyJ…` role=anon)

**KHÔNG dùng `service_role` key** trong env này — nó bypass RLS và phải ở-server-only.

## C. Chạy SQL migration

1. Supabase Dashboard → **SQL Editor** → **New query**.
2. Copy/paste toàn bộ `supabase/migrations/001_phase_2a_core.sql`.
3. **Run**. Verify 3 bảng `profiles`, `lesson_progress`, `voice_attempts` xuất hiện trong **Table Editor**.
4. Verify **RLS enabled** (icon khoá xanh) trên cả 3 bảng.

> *(Khi nào dùng Supabase CLI, có thể thay bằng `supabase db push`.)*

## D. Tạo 1 test staff account (anh — admin tay)

Vì Phase 2A spec quyết định: **admin-created** (không có /signup).

1. Supabase Dashboard → **Authentication → Users → Add user → Create new user**.
2. Email: vd `test.staff@vdf.test` · Password: chọn mạnh · ✅ **Auto Confirm User**.
3. *(Optional)* Click user → **User metadata** → set `full_name` → save:
   ```json
   { "full_name": "Nguyễn Văn Test" }
   ```
4. Trigger `on_auth_user_created` tự insert row vào `profiles`. Verify trong Table Editor → `profiles`.

Lặp cho 5–10 staff khi pilot mở rộng.

## E. Set env vars trên Vercel

1. Vercel Dashboard → project `vdf-chinese-learning` → **Settings → Environment Variables**.
2. Add 2 biến (cả Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Save** → **Deployments → Redeploy** latest production.

## F. Test login flow (5 phút)

1. Mở `https://vdf-chinese-learning.vercel.app/` trong Incognito.
2. **Pilot gate** xuất hiện (nếu còn) → nhập `PILOT_ACCESS_PASSWORD`.
3. App redirect tới `/login` (auth gate). Trang phải hiện form **"Đăng nhập"**.
4. Nhập email + password của test user.
5. Login thành công → redirect về `/`. Bottom nav hiện bình thường, **Day-One thẻ xanh** vẫn render.
6. Mở `/account` → hiện **"Xin chào {full_name}"** + email + role.
7. Bấm **"Đăng xuất"** → quay lại `/login`.
8. Thử mở `/day-one` trực tiếp không login → phải redirect `/login?next=/day-one`.

## G. Sau khi 2A.1 OK — chờ duyệt

Phase 2A theo memo §7 chia thành 5 sub-phases. **STOP** sau 2A.1 để anh review:

- ✅ Login work, /account hiển thị profile.
- ✅ Tiến độ cũ trên thiết bị (localStorage) **vẫn còn** (chưa migrate).
- ✅ Voice/quiz/flashcard **vẫn local**, không server-side. Đúng dự kiến 2A.1.
- ⏭️ 2A.2 (RPCs SECURITY DEFINER + forge-attack test) — cần thiết trước khi cấp cert.

## H. Rotate keys khi cần

- **Anon key** vừa được paste vào chat → coi như exposed. Sau khi 2A.1 ổn:
  Supabase Dashboard → Settings → API → "Reset anon key" → update lại `.env.local` + Vercel.
- **DB password** lưu trong vault, không paste anywhere.

## I. Backup (Free tier không có PITR — phải tự lo)

Trước khi pilot live, hẹn lịch tay:
- Supabase CLI: `supabase db dump > backup-YYYY-MM-DD.sql` định kỳ.
- Hoặc upgrade Pro ($25/tháng) để có Point-In-Time Recovery khi rollout rộng.

## Troubleshooting

| Triệu chứng | Nguyên nhân hay gặp | Fix |
|---|---|---|
| Login redirect loop | Auth cookie không set được | Kiểm tra `NEXT_PUBLIC_SUPABASE_URL` đúng format `https://*.supabase.co` |
| "Email or password is invalid" | Đúng | User chưa tạo, sai pass, hoặc chưa Auto Confirm |
| `/account` báo Supabase chưa cấu hình | Env vars chưa nạp | Vercel: Redeploy sau khi add env; Local: restart `npm run dev` |
| Trigger không tạo profile | RLS chặn trigger | Trigger là `security definer`; nếu vẫn lỗi, check Database → Functions → handle_new_user |
| Anon key bị reject | Token sai project | Decode JWT, verify `ref` khớp `<project-ref>` trong URL |

---

*Phase 2A.1 = scaffold only. Đừng kỳ vọng cert / dashboard / sync ở chunk này.*
