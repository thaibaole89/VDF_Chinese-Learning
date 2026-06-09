# Phase 2E — Nền tảng trước, bán hàng sau (3 khoá)

Học **nền tảng trước**, rồi mới tới bán hàng — áp dụng cho cả Trung, Anh, Hàn.

## Đã làm
**Tiếng Trung** — không thêm nội dung (đã có sẵn), chỉ **xếp lại thứ tự**:
- `/lessons`: nhóm **Nền tảng** lên đầu (đại từ, xưng hô, chỉ định, nghi vấn, số đếm, màu sắc).
- Lộ trình: 6 bài nền tảng thành **bắt buộc + đầu lộ trình**; gợi ý học **Nền tảng → Day-One → bán hàng**.
- **Giữ nguyên** chứng nhận Day-One và Bảng vinh danh (chấm điểm bằng SQL riêng, không bị ảnh hưởng).

**Tiếng Anh & Hàn** — soạn mới **module "Nền tảng" (6 bài)** đặt lên đầu khoá:
1. Chào hỏi & lịch sự · 2. Đại từ & người · 3. Số đếm & giá tiền · 4. Màu sắc & mô tả · 5. Ngày giờ & thời gian · 6. Hỏi đường & vị trí.
- Mỗi bài: câu mẫu + IPA (Anh) / phiên âm (Hàn) + nghĩa Việt + tip ngữ pháp + quiz.
- Tiếng Hàn: nội dung mới đã thêm vào `KOREAN_REVIEW_PACKET.md` để bản xứ soát (đang chờ duyệt).

## Migrations cần chạy sau khi push (Supabase SQL Editor)
Tiến độ Anh/Hàn lưu trên máy chủ → các câu mới phải được seed vào `course_phrases`.

| Migration | Nội dung | Verify |
|---|---|---|
| `006_korean_course_progress.sql` | **Toàn bộ** tiếng Hàn (đã gồm nền tảng) | `korean_phrases_seeded = 156`, `korean_lessons = 22` |
| `007_english_foundations.sql` | **Chỉ thêm** 42 câu nền tảng tiếng Anh (không đụng 128 câu cũ của 005) | `foundation_phrases = 42`, `english_phrases_total = 170` |

> Thứ tự: 005 (đã chạy) → **006** → **007**. Tất cả idempotent, chỉ đụng `course_phrases`, không tạo bảng/RPC mới, không service_role/secret.

## Ràng buộc giữ nguyên
- Không phá Day-One / chứng nhận / Bảng vinh danh tiếng Trung.
- Tiếng Anh & Hàn vẫn không có chứng nhận, không vào Bảng vinh danh.
- Luyện đọc chỉ lưu metadata; không transcript. Không secret.
