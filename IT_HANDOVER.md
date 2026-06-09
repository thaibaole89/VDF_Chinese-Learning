# VDF Sales Tutor — Tài liệu bàn giao cho bộ phận IT

> Tài liệu này giúp đội IT **tiếp quản và vận hành** ứng dụng học bán hàng đa ngôn ngữ của VDF (Tiếng Trung / Anh / Hàn). Đọc hết phần 1–6 trước khi triển khai; phần 7–12 là vận hành & tham chiếu.

---

## 1. Tổng quan sản phẩm

App học ngoại ngữ thực dụng cho **nhân viên bán hàng miễn thuế VDF** tại sân bay.

- **3 khoá:** 🇨🇳 Tiếng Trung (khoá pilot chính — có chứng nhận + Bảng vinh danh), 🇬🇧 Tiếng Anh, 🇰🇷 Tiếng Hàn.
- Mỗi khoá: học **Nền tảng trước** → bán hàng → ngành hàng → sân bay/miễn thuế. Mỗi bài có câu mẫu (chữ + phiên âm/IPA + nghĩa Việt), tip ngữ pháp, **nghe (TTS)** + **luyện phát âm (STT)**, quiz.
- **Tài khoản & tiến độ** lưu trên máy chủ (đồng bộ đa thiết bị); **Manager Dashboard** theo dõi tiến độ nhân viên.
- Công cụ **Dịch đa ngôn ngữ** hỗ trợ giao tiếp với khách.
- Là **PWA** (cài lên màn hình chính như app), giao diện tiếng Việt, có dark mode.

**URL production:** `https://vdf-learning.vercel.app`

---

## 2. Kiến trúc & công nghệ

| Lớp | Công nghệ |
|---|---|
| Frontend + Backend | **Next.js 14 (App Router)** + React 18 + TypeScript |
| Styling | Tailwind CSS |
| Auth + Database | **Supabase** (Postgres + Auth email/mật khẩu) |
| Hosting / CI-CD | **Vercel** (auto-deploy từ nhánh `main`) |
| Giọng nói | **Web Speech API** của trình duyệt (TTS + STT) — chạy client, miễn phí, không gọi AI trả phí |
| Dịch thuật | Dịch trên thiết bị (browser) trước; tùy chọn fallback **Google Cloud Translation API v2** (server) |

- Server logic dùng **Server Components + Server Actions** (Next.js) — không có backend riêng.
- Không có service trả phí bắt buộc nào ngoài Supabase (free tier đủ cho pilot) + Vercel.

---

## 3. Mã nguồn & quy trình triển khai

- **Repo:** `github.com:thaibaole89/VDF_Chinese-Learning.git` (private).
- **Nhánh chính:** `main`. **Vercel tự build & deploy mỗi khi push lên `main`.** Mỗi PR/nhánh khác tạo Preview Deploy riêng.
- Lệnh build: `npm install` → `npm run build` (tự chạy `prebuild` sinh nội dung). Output Next.js chuẩn.
- **Node:** khuyến nghị **Node 20 LTS trở lên** (môi trường dev dùng Node 24; các script `scripts/gen-*.mjs` cần **Node ≥ 22** vì dùng tính năng chạy TypeScript trực tiếp).

### Scripts (package.json)
| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy local (tự sinh nội dung trước) |
| `npm run build` | Build production (tự chạy `prebuild`) |
| `npm run start` | Chạy bản build |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
| `npm run validate-content` | Kiểm tra nội dung tiếng Trung (`content/*.json`) |
| `npm run gen:content` | Sinh `lib/content.data.json` đã loại bỏ thông tin nguồn (chạy tự động ở `predev`/`prebuild`) |

---

## 4. ✅ Checklist chuyển giao tài khoản & dịch vụ

IT cần được cấp quyền sở hữu/quản trị các tài khoản sau (chủ sản phẩm thực hiện):

- [ ] **GitHub** — thêm IT làm collaborator/owner repo `VDF_Chinese-Learning` (private).
- [ ] **Vercel** — chuyển project sang Team của IT (hoặc add thành viên). Đây là nơi build/deploy + cấu hình **Environment Variables** + tên miền.
- [ ] **Supabase** — thêm IT vào Organization/Project (Auth + Database). Nơi chạy **migrations** và quản lý người dùng.
- [ ] **Google Cloud** (tùy chọn) — nếu dùng dịch tự động: chuyển/đồng sở hữu project chứa **Cloud Translation API key** + thiết lập **billing budget/quota**.
- [ ] **Tên miền** — nếu chuyển từ `*.vercel.app` sang domain công ty: trỏ DNS trong Vercel.
- [ ] (Khuyến nghị) **Xoá/đổi mật khẩu các tài khoản test** (`test1@vndf.net`, `test4@vndf.net`) trước khi mở rộng.

---

## 5. Biến môi trường (Vercel → Settings → Environment Variables)

| Biến | Bắt buộc | Phạm vi | Mô tả |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Có** | Client | URL project Supabase (`https://<ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Có** | Client | Khoá **anon/public** (an toàn để lộ ở client). |
| `TRANSLATE_PROVIDER` | Không | Server | Đặt `google` để bật fallback dịch server. |
| `GOOGLE_TRANSLATE_API_KEY` | Không | **Server-only** | Khoá Google Cloud Translation. **TUYỆT ĐỐI** không thêm tiền tố `NEXT_PUBLIC_`. |

**Quan trọng về bảo mật:**
- **KHÔNG** đặt `service_role` / secret key của Supabase ở bất kỳ đâu trong app/Vercel client. App chỉ dùng **anon key** + RLS.
- Lấy giá trị từ: Supabase → Project Settings → API.
- Mẫu đầy đủ + chú thích: xem `.env.example`. Hướng dẫn dịch thuật + chi phí: `TRANSLATION_SETUP.md`.

---

## 6. Cơ sở dữ liệu Supabase (migrations)

Tất cả schema nằm ở `supabase/migrations/`. **Áp dụng theo thứ tự**, idempotent (chạy lại an toàn). Cách chạy: **Supabase → SQL Editor → New query → dán nội dung file → Run** (hoặc dùng Supabase CLI).

| File | Nội dung |
|---|---|
| `001_phase_2a_core.sql` | Bảng lõi: `profiles`, `lesson_progress`, `voice_attempts` + RLS + trigger tạo profile tự động (role mặc định `staff`). |
| `002_phase_2a_rpcs.sql` | RPC ghi tiến độ tiếng Trung (SECURITY DEFINER). |
| `003_phase_2b_leaderboard.sql` | RPC `get_weekly_leaderboard()` (Bảng vinh danh — chỉ tiếng Trung). |
| `004_translation_usage.sql` | Bảng đo lường dịch thuật (chỉ **metadata**: số ký tự, thành công/lỗi — KHÔNG lưu nội dung dịch). |
| `005_course_progress.sql` | Lớp tiến độ generic cho khoá mới (Anh) + 4 RPC + RLS FORCE + seed tiếng Anh. |
| `006_korean_course_progress.sql` | Seed tiếng Hàn (`korean-sales`, 156 câu/22 bài) vào lớp generic của 005. |
| `007_english_foundations.sql` | Seed bổ sung 42 câu **Nền tảng** tiếng Anh (additive). |

> **Trạng thái hiện tại:** 001–007 **đã áp dụng** trên Supabase production. Khi tạo môi trường mới (staging…), chạy lại lần lượt 001→007.
> Thiết kế bảo mật & test tấn công giả mạo: `SECURITY.md`, `supabase/FORGE_ATTACK_TEST.md`. Cách chấm điểm Bảng vinh danh: `LEADERBOARD_SCORING.md`.

---

## 7. Mô hình bảo mật (đã thiết kế — IT cần giữ nguyên)

- **RLS FORCE** trên mọi bảng dữ liệu người học: nhân viên chỉ đọc/ghi **dữ liệu của chính mình**; **quản lý chỉ ĐỌC** của tất cả (không sửa được).
- **Ghi dữ liệu chỉ qua RPC SECURITY DEFINER** (hard-set `user_id = auth.uid()`) — không cấp quyền INSERT/UPDATE trực tiếp ⇒ không thể giả mạo tiến độ người khác.
- **Không dùng `service_role`** trong app; chỉ **anon key** + RLS.
- **Riêng tư:** luyện phát âm chỉ lưu **metadata** (đạt/chưa + điểm), **KHÔNG** lưu giọng nói/transcript; công cụ dịch **KHÔNG** lưu câu gốc/câu dịch.
- **Bảo mật tài liệu nguồn:** ảnh/video gốc của VDF **bị loại khỏi repo** (`.gitignore`); bước build `scripts/build-content.mjs` **xoá mọi đường dẫn nguồn (`sourceRefs`)** trước khi đóng gói client ⇒ không lộ tên file gốc trong bundle.
- **Noindex:** `next.config.mjs` gửi header `X-Robots-Tag: noindex, nofollow` toàn site (app nội bộ, không lên Google).
- **Tự đăng ký:** chỉ tạo tài khoản **staff** (qua `supabase.auth.signUp`); **không ai tự đăng ký làm manager**.

---

## 8. Vận hành (runbook)

### 8.1 Cấp tài khoản nhân viên
- **Tự đăng ký:** bật trong Supabase → Authentication → Providers/Settings: *Allow new users to sign up* = **ON**, *Confirm email* = **OFF** (đăng ký không cần xác minh email). App tự tạo profile `staff`.
- Hoặc tạo thủ công user trong Supabase → Authentication → Users.

### 8.2 Cấp quyền quản lý (manager)
- Manager **không** tự đăng ký được. Cấp thủ công: Supabase → Table editor → `profiles` → đặt `role = 'manager'` cho user tương ứng. (Cột `role` được khoá quyền để người dùng không tự nâng quyền.)

### 8.3 Sửa/thêm nội dung bài học
- **Tiếng Trung:** sửa file trong `content/*.json` → chạy `npm run validate-content` (phải PASS) → `npm run gen:content`. (Đây là nguồn nội dung được kiểm thử.)
- **Tiếng Anh:** sửa `lib/englishCourse.ts` (+ `lib/englishGrammar.ts`, `lib/englishVisuals.ts`).
- **Tiếng Hàn:** sửa `lib/koreanCourse.ts` (+ `lib/koreanGrammar.ts`, `lib/koreanVisuals.ts`).
- **Khi thêm/bớt CÂU ở Anh/Hàn** (đổi `phrase_id`): phải cập nhật seed `course_phrases` để tiến độ server nhận câu mới:
  - Hàn: `node scripts/gen-korean-progress-seed.mjs` → sinh lại `006_*.sql` → chạy trong Supabase.
  - Anh: `node scripts/gen-english-foundations-seed.mjs` (hoặc cập nhật seed 005) → chạy migration tương ứng.
- **Gói duyệt tiếng Hàn:** `node scripts/gen-korean-review.mjs` → sinh lại `KOREAN_REVIEW_PACKET.md`.
- Sau mọi thay đổi: `npm run typecheck` → `npm run build` (xem mục 10).

### 8.4 Ảnh minh hoạ
- Ảnh ở `public/visuals/*.jpg` là **AI-generated placeholder** (chưa duyệt chính thức) — xem `PRODUCT_IMAGE_GUIDELINES.md`. Sinh lại bằng `scripts/gen-visuals.mjs` (cần `GEMINI_API_KEY`).

### 8.5 Dịch tự động (tùy chọn)
- Bật bằng `TRANSLATE_PROVIDER=google` + `GOOGLE_TRANSLATE_API_KEY`. Đặt **budget/quota** ở Google Cloud. Chi tiết: `TRANSLATION_SETUP.md`.

---

## 9. Kiểm thử & chất lượng (gates trước khi deploy)

Chạy tuần tự, tất cả phải sạch:

```bash
npm run typecheck                       # TypeScript
rm -rf .next && npm run build           # Build production
npm run validate-content                # Nội dung tiếng Trung: PASS
# Quét lộ secret/đường dẫn nguồn trong bundle client (phải rỗng):
grep -rIlE "service_role|GOOGLE_TRANSLATE_API_KEY|source_text|/Users/|raw/" .next/static
```

> Lưu ý: chữ `transcript` (Web Speech API) và tên trường `sourceRefs` (danh sách bị-xoá của bộ sanitize) có thể xuất hiện trong bundle — **đây là bình thường**, không phải rò rỉ. Chỉ cần các token ở lệnh grep trên rỗng.

---

## 10. Giới hạn hiện tại & lộ trình

- **Nội dung tiếng Hàn** (gồm phần Nền tảng) **đang chờ người bản xứ duyệt** — dùng `KOREAN_REVIEW_PACKET.md`. Nên duyệt xong trước khi đào tạo đại trà.
- **Phần Nền tảng tiếng Anh** mới soạn — nên rà nhanh IPA/diễn đạt.
- **Ảnh minh hoạ** là placeholder AI — cần VDF duyệt/đổi ảnh chính thức nếu muốn.
- **Giọng nói** dùng Web Speech API của trình duyệt → chất lượng/khả dụng **khác nhau theo thiết bị & trình duyệt** (tốt nhất trên Chrome/Safari mới). Lộ trình nâng cấp audio neural dựng sẵn: `PHASE_2_ROADMAP.md`.
- Tiếng Anh & Hàn **không** vào Bảng vinh danh và **không** có chứng nhận (cố ý — chỉ tiếng Trung).

---

## 11. Chỉ mục tài liệu (trong repo)

| File | Nội dung |
|---|---|
| `README.md` | Điểm vào nhanh. |
| `IT_HANDOVER.md` | **Tài liệu này** — bàn giao & vận hành. |
| `SECURITY.md` | Mô hình bảo mật chi tiết. |
| `supabase/FORGE_ATTACK_TEST.md` | Kịch bản test chống giả mạo RLS. |
| `PHASE_2A_SETUP.md` | Thiết lập Supabase Auth ban đầu. |
| `PHASE_2C2_SETUP.md` · `PHASE_2D_KOREAN_SERVER.md` · `PHASE_2E_FOUNDATIONS.md` | Hướng dẫn áp dụng migrations 005 / 006 / 007. |
| `LEADERBOARD_SCORING.md` | Cách chấm điểm Bảng vinh danh (SQL). |
| `TRANSLATION_SETUP.md` | Thiết lập dịch Google + chi phí. |
| `PRODUCT_IMAGE_GUIDELINES.md` | Quy chuẩn ảnh minh hoạ. |
| `CONTENT_REVIEW.md` · `PHASE_1B_CONTENT_REVIEW.md` · `NATIVE_REVIEW_CHECKLIST.md` | Rà soát nội dung tiếng Trung. |
| `KOREAN_REVIEW_PACKET.md` | Gói duyệt nội dung tiếng Hàn (tự sinh). |
| `PILOT_README.md` · `pilot/*` · `FEEDBACK_FORM.md` · `INTERNAL_REVIEW_GUIDE.md` | Tài liệu chạy pilot. |
| `PHASE_2_ROADMAP.md` | Lộ trình nâng cấp (audio neural, v.v.). |
| `VOICE_PRACTICE_TEST_NOTES.md` | Ghi chú kiểm thử giọng nói. |

---

## 12. Liên hệ / ngữ cảnh

- App do chủ sản phẩm (VDF) phối hợp phát triển theo từng phase; lịch sử commit trên GitHub mô tả chi tiết từng thay đổi.
- Khi tiếp quản, IT nên: (1) nhận quyền các tài khoản ở mục 4 → (2) xác nhận build/deploy trên Vercel → (3) tạo môi trường staging nếu cần (chạy lại 001–007) → (4) đổi/xoá tài khoản test → (5) lên kế hoạch duyệt nội dung tiếng Hàn + pilot.
