# Kế hoạch Pilot nhỏ — VDF Sales Tutor (đa ngôn ngữ)

> Mục tiêu: chạy thử **quy mô nhỏ, 1–2 tuần** để xác nhận app **dạy được việc thật**, nội dung **đúng & hữu ích**, và trải nghiệm ổn — **trước khi** mở rộng.
> App: **https://vdf-learning.vercel.app** (link cũ `vdf-chinese-learning…` đã tự chuyển hướng).

---

## 1. Mục tiêu pilot

1. **Chất lượng nội dung:** câu có đúng, tự nhiên, dùng được tại quầy không?
2. **Hiệu quả học:** nhân viên hoàn thành được Day-One / Module 1 và nói lại được không?
3. **Trải nghiệm:** đăng nhập, micro/loa, giọng đọc, chấm điểm phát âm có mượt không?
4. **Vận hành dữ liệu:** quản lý theo dõi được tiến độ (Trung & Anh) không?

---

## 2. Phạm vi theo ngôn ngữ (quan trọng)

| Ngôn ngữ | Trạng thái | Đưa vào pilot? | Ghi chú |
|---|---|---|---|
| 🇨🇳 **Tiếng Trung** | Đầy đủ, đã duyệt, có chứng nhận + Hall of Fame + tiến độ máy chủ | ✅ Có | Khoá "xương sống", dùng làm chuẩn so sánh. |
| 🇬🇧 **Tiếng Anh** | 16 bài đầy đủ; **tiến độ máy chủ vừa bật (migration 005)** | ✅ Có | Quản lý đã xem được số liệu. Chưa có chứng nhận, không vào Hall of Fame (cố ý). |
| 🇰🇷 **Tiếng Hàn** | 16 bài đầy đủ nhưng **đang chờ duyệt nội bộ về ngôn ngữ** | ⚠️ Có điều kiện | **Chỉ pilot SAU khi người bản xứ duyệt** xong (xem `KOREAN_REVIEW_PACKET.md`). Tiến độ Hàn hiện **chỉ lưu trên thiết bị** — quản lý chưa theo dõi tập trung được (sẽ làm ở phase sau). |

> 👉 Đề xuất: **đợt 1** chạy Trung + Anh ngay; **tiếng Hàn** ghép vào ngay khi duyệt ngôn ngữ xong (có thể trong cùng tuần).

---

## 3. Người tham gia (nhỏ gọn)

- **6–9 nhân viên** bán hàng, chia theo nhu cầu thực tế của quầy:
  - 3 người **tiếng Trung**, 3 người **tiếng Anh** (+ 2–3 **tiếng Hàn** khi sẵn sàng).
  - Trộn 1 người khá + 1 trung bình + 1 mới mỗi nhóm để thấy nhiều mức.
- **1 quản lý** (test4 hoặc tài khoản manager thật) theo dõi qua **Manager Dashboard**.
- **1 người duyệt ngôn ngữ Hàn** (bản xứ/thạo Hàn) — làm việc trên `KOREAN_REVIEW_PACKET.md`.

---

## 4. Cách chạy (1–2 tuần)

**Chuẩn bị (ngày 0):**
- Cấp tài khoản: bật tự đăng ký (Supabase: *Allow signup = ON*, *Confirm Email = OFF*) **hoặc** tạo sẵn tài khoản cho nhân viên.
- Mỗi người mở `/check` để **kiểm tra micro & loa**, và vào *Tài khoản → Cài đặt* chọn **giọng đọc** ưng ý cho ngôn ngữ của mình.

**Hằng ngày (15–20 phút/người):**
- Học theo lộ trình: **Day-One (Trung)** hoặc **Module 1** của khoá Anh/Hàn.
- Bắt buộc **luyện đọc bằng giọng nói** (không chỉ đọc thầm) + làm **quiz** cuối bài.
- Ghi lại nhanh: câu nào khó đọc, câu nào thấy "không giống thực tế", chỗ nào app trục trặc.

**Cuối tuần:** họp 20 phút nghe phản hồi + xem số liệu trên Manager Dashboard.

---

## 5. Thu thập phản hồi

- **Trong app:** form góp ý sẵn có (xem `FEEDBACK_FORM.md`).
- **Theo dõi hằng ngày:** `pilot/03-daily-tracking-checklist.md`.
- **Lỗi nội dung tiếng Hàn:** ghi vào "Bảng tổng hợp chỉnh sửa" trong `KOREAN_REVIEW_PACKET.md`.
- **Số liệu tự động (Trung & Anh):** Manager Dashboard — số người học, % tiến độ, bài hoàn thành, lượt luyện đọc.

---

## 6. Tiêu chí thành công (gợi ý ngưỡng)

| Chỉ số | Ngưỡng đề xuất |
|---|---|
| Tỷ lệ hoàn thành Day-One / Module 1 | ≥ 70% người tham gia |
| Tỷ lệ **đạt** khi luyện đọc (voice pass) | ≥ 60% lượt |
| Quiz cuối bài | ≥ 70% đạt |
| Lỗi nội dung **P0** (sai/khó chịu) còn lại | **0** trước khi mở rộng |
| Phản hồi "thấy hữu ích cho công việc" | đa số đồng ý |

---

## 7. Vai trò & mốc

| Việc | Ai | Khi nào |
|---|---|---|
| Duyệt ngôn ngữ tiếng Hàn (`KOREAN_REVIEW_PACKET.md`) | Người bản xứ | Trước khi đưa Hàn vào pilot |
| Chọn nhân viên + cấp tài khoản | PO / Quản lý | Ngày 0 |
| Theo dõi tiến độ + tổng hợp phản hồi | Quản lý | Hằng ngày |
| Quyết định mở rộng / cần sửa | PO | Cuối pilot (`pilot/05-decision-memo-template.md`) |

---

## 8. Sau pilot

- Gom lỗi nội dung → team kỹ thuật cập nhật `lib/koreanCourse.ts` / `lib/englishCourse.ts` / content tiếng Trung → chạy lại bộ kiểm tra.
- Nếu muốn quản lý **theo dõi cả tiếng Hàn** tập trung → làm **Phase: nối tiến độ tiếng Hàn lên server** (giống tiếng Anh).
- Ra quyết định: mở rộng số người / số quầy, hoặc bổ sung nội dung.

> Tài liệu liên quan: `pilot/01-kickoff-email.md`, `02-review-request.md`, `03-daily-tracking-checklist.md`, `04-summary-report-template.md`, `05-decision-memo-template.md`, `KOREAN_REVIEW_PACKET.md`, `FEEDBACK_FORM.md`, `INTERNAL_REVIEW_GUIDE.md`.
