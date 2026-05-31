# SECURITY — VDF Chinese Sales Tutor (Internal Preview)

**Phạm vi:** Phase 1F internal pilot preview. Đây **không phải bản production cho khách hàng**.

---

## 1. Quy tắc tuyệt đối

- **KHÔNG share link preview ra ngoài nhóm pilot** (5–10 nhân viên + supervisor + người duyệt nội dung).
- **KHÔNG đăng link lên Facebook / Zalo / LinkedIn / website public.**
- **KHÔNG để repo GitHub chuyển sang Public** — phải giữ **Private**.
- Nội dung tiếng Trung và hình ảnh đều `needs_review` / `placeholder` — chưa phải nội dung chính thức.

## 2. Bật Vercel Deployment Protection (BẮT BUỘC trước khi gửi link cho ai)

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

## 3. Bảo mật ở tầng app (đã có sẵn — không phải làm thêm)

- ✅ Repo GitHub là **Private** (`thaibaole89/VDF_Chinese-Learning`).
- ✅ `.gitignore` chặn raw media (`*.mov`, `*.mp4`, `*.jpg/.jpeg/.png/.heic/.webp` ở thư mục nguồn);
  chỉ cho qua các icon + logo VDF + 15 visual generated.
- ✅ Content `sourceRefs` được strip ở build-time (`lib/content.data.json`) — bundle client
  không lộ raw filename / OneDrive path.
- ✅ Banner *"Bản xem nội bộ — nội dung đang chờ duyệt…"* hiện ở mọi route.
- ✅ Badge **"Chờ duyệt"** + **"Cần xác nhận"** + `noteVi` hiển thị đầy đủ.
- ✅ `robots.txt` + meta `noindex,nofollow` + header `X-Robots-Tag: noindex, nofollow`
  → công cụ tìm kiếm không index trang preview (chặn vô tình lộ qua Google).

## 4. App hiện tại CHƯA có

- ❌ Account / đăng nhập riêng cho từng nhân viên.
- ❌ Backend / database / API server riêng.
- ❌ Audio upload, lưu giọng nói của người dùng.
- ❌ Phân quyền admin.
- ❌ Cấp chứng chỉ chính thức.

→ Tiến độ học **chỉ lưu trên `localStorage` của thiết bị từng người** (key `vdf_chinese_progress`,
`vdf_chinese_flashcards`, `vdf_chinese_quiz_attempts`, `vdf_chinese_voice_practice`). Xoá lịch sử
trình duyệt = mất tiến độ.

## 5. Voice / micro — lưu ý

- App dùng **browser Speech Recognition API** (zh-CN) cho tính năng "🎤 Luyện đọc".
- Trên Chrome, audio được trình duyệt **gửi lên máy chủ Google** để nhận diện
  (chính sách của trình duyệt, **không** phải app gửi).
- **App KHÔNG lưu / KHÔNG upload file ghi âm**. Chỉ lưu transcript (text máy nghe được) + score
  + result trong `localStorage`.
- Quyền micro chỉ được yêu cầu khi nhân viên **bấm "Bắt đầu đọc"**, không đòi sẵn.
- Xem `VOICE_PRACTICE_TEST_NOTES.md` để hiểu rõ "điểm" là kết quả nhận diện, KHÔNG phải chấm phát âm.

## 6. Nếu có sự cố / nghi ngờ lộ thông tin

1. **Tắt Vercel deployment** ngay lập tức (Vercel Dashboard → project → Deployments → Disable).
2. **Đổi key/secret** đã từng dùng (vd Gemini API key — đã được sinh lại sau Phase 1C.3).
3. Báo cho trưởng nhóm pilot + VDF IT/Legal.
4. Soát log Vercel xem có truy cập lạ không (Settings → Deployment Protection → Access Logs).

## 7. Trước khi mở rộng ra ngoài pilot

- Cần làm Phase 2 (account + audit log + chính sách PII cho hồ sơ đào tạo nhân viên).
- Cần ký HR/Legal về việc thu thập dữ liệu học của nhân viên.
- Xem `PHASE_2_ROADMAP.md`.
