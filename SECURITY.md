# SECURITY — VDF Chinese Sales Tutor (Internal Preview)

**Phạm vi:** Phase 1F internal pilot preview. Đây **không phải bản production cho khách hàng**.

---

## 1. Quy tắc tuyệt đối

- **KHÔNG share link preview ra ngoài nhóm pilot** (5–10 nhân viên + supervisor + người duyệt nội dung).
- **KHÔNG đăng link lên Facebook / Zalo / LinkedIn / website public.**
- **KHÔNG để repo GitHub chuyển sang Public** — phải giữ **Private**.
- Nội dung tiếng Trung và hình ảnh đều `needs_review` / `placeholder` — chưa phải nội dung chính thức.

## 2. Vì sao có **app-level password gate** (Phase 1H)

Vercel **Standard Deployment Protection** chỉ chặn các URL preview/branch — **không
chặn domain production** `https://vdf-chinese-learning.vercel.app`. Muốn protect cả
production cần **Advanced Deployment Protection** (gói trả phí).

Trong khi chờ quyết định mua gói, app có một **password gate nhẹ ở tầng app**
(middleware) để nội dung không bị mở công khai cho bất kỳ ai có URL.

### Cách hoạt động
- Khi env `PILOT_ACCESS_PASSWORD` được đặt, mọi route chính của app yêu cầu nhập mật
  khẩu pilot trước (`/pilot-access`).
- Mật khẩu được so sánh **trên server** trong route `/api/pilot-access` — **không bao
  giờ** vào client bundle.
- Thành công → set cookie `vdf_pilot_access_granted=1` (**httpOnly**, sameSite=lax,
  secure khi production, hết hạn 7 ngày) → quay lại route ban đầu.
- Không đặt env → gate tắt, app mở bình thường.
- Không index (`robots.txt` + meta + `X-Robots-Tag`) vẫn giữ.

### Đặt mật khẩu trên Vercel
1. Vercel Dashboard → project `vdf-chinese-learning` → **Settings** → **Environment Variables**.
2. **Add new**:
   - Key: `PILOT_ACCESS_PASSWORD`
   - Value: *mật khẩu mạnh, ≥12 ký tự* (không trùng các mật khẩu cá nhân).
   - Environments: tick **Production** + **Preview** (không cần Development).
3. **Save** → vào **Deployments** → **Redeploy** lần gần nhất (hoặc push commit mới).
4. **Verify trong Incognito:** mở URL → phải hiện trang `/pilot-access` đòi mật khẩu.

### Rotate (đổi mật khẩu)
- Đổi value của `PILOT_ACCESS_PASSWORD` trên Vercel → **Redeploy**. Cookie cũ tự hết
  hạn sau 7 ngày, hoặc người dùng có thể bấm **"Khoá lại quyền truy cập"** trong trang
  **/about** để xoá cookie ngay.
- Đổi mật khẩu sau **mỗi đợt pilot kết thúc** hoặc **mỗi khi nhân viên rời nhóm test**.

### Giới hạn (đọc kỹ)
- **Đây không phải enterprise auth.** Là **password chung** cho cả nhóm — không phân
  biệt từng nhân viên, không audit ai vào lúc nào.
- Mật khẩu **được chia sẻ** qua kênh riêng cho nhóm pilot (Zalo/Teams 1-1), **không**
  group lớn, **không** đính kèm trong link.
- Nếu lộ mật khẩu, **đổi ngay** + redeploy. Trong vòng ≤7 ngày tất cả cookie cũ hết
  hạn, nhưng mật khẩu đã lộ có thể bị dùng trước đó — coi đó là incident.
- **Khuyến nghị dài hạn:** mua **Vercel Advanced Deployment Protection** (chặn cả
  production domain ở tầng Vercel) hoặc xây tài khoản thật ở **Phase 2** (xem
  `PHASE_2_ROADMAP.md`).

### Local dev
- Tạo `.env.local` (đã gitignore): `PILOT_ACCESS_PASSWORD=test123` → `npm run dev`.
- Hoặc bỏ trống env để dev không gate.
- Mẫu xem `.env.example`.

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

## 5. App hiện tại CHƯA có

- ❌ Account / đăng nhập riêng cho từng nhân viên.
- ❌ Backend / database / API server riêng.
- ❌ Audio upload, lưu giọng nói của người dùng.
- ❌ Phân quyền admin.
- ❌ Cấp chứng chỉ chính thức.

→ Tiến độ học **chỉ lưu trên `localStorage` của thiết bị từng người** (key `vdf_chinese_progress`,
`vdf_chinese_flashcards`, `vdf_chinese_quiz_attempts`, `vdf_chinese_voice_practice`). Xoá lịch sử
trình duyệt = mất tiến độ.

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
