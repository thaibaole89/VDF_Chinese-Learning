# PILOT_README — VDF Chinese Sales Tutor (Internal Pilot)

**Bản:** Phase 1F Internal Pilot Preview · **Trạng thái:** preview nội bộ, nội dung chờ duyệt.

---

## 1. Mục tiêu pilot

Kiểm tra trên thiết bị thật của nhân viên bán hàng VDF (Nội Bài / Phú Quốc) xem app:

- **Có dùng được thực tế tại quầy** không (mobile, ngắn, ~5 phút mỗi lần).
- **Có giúp nhớ câu** tiếng Trung sống còn không (Day-One 10 câu, quy trình bán hàng P1).
- **UX có rõ ràng** với nhân viên mới không (pinyin, voice, hình minh hoạ, quiz).
- **Phát hiện lỗi/khó dùng** trước khi mở rộng training chính thức.

> Pilot **không** đánh giá năng lực phát âm chính thức của nhân viên (hiện app chỉ có
> nhận diện giọng nói của trình duyệt, không chấm thanh điệu — xem `VOICE_PRACTICE_TEST_NOTES.md`).

## 2. Nhóm người test đề xuất

- **5–10 nhân viên bán hàng VDF**, ưu tiên người **mới biết tiếng Trung cơ bản hoặc chưa biết**.
- **2–3 supervisor / trưởng ca** để cho góc nhìn vận hành.
- **1 người bản xứ tiếng Trung** (riêng cho duyệt nội dung — dùng `INTERNAL_REVIEW_GUIDE.md`).
- **1 đại diện VDF Operations** và **1 đại diện Legal/Compliance** (duyệt các câu `Cần xác nhận`).

## 3. Thời lượng test

- **5–10 phút/ngày × 5 ngày** cho mỗi nhân viên (không cần liền mạch).
- **Mỗi ngày 1 phiên ngắn**, ưu tiên giờ giao ca hoặc giờ ít khách.
- **Tổng cho mỗi người: ~30–50 phút thực dùng**, đủ để chạy Day-One + 2 bài P1 + vài lần kiểm tra.

## 4. Thiết bị / trình duyệt nên dùng

| Thiết bị | Trình duyệt | Voice (Phase 1D) | Khuyến nghị |
|---|---|---|---|
| Android | **Chrome** | ✅ hoạt động tốt | **Ưu tiên** |
| Desktop/laptop | **Chrome / Edge** | ✅ hoạt động tốt | Tốt cho supervisor |
| iPhone | Safari | ⚠️ thường không hỗ trợ → rơi vào nhánh dự phòng "đánh dấu thủ công" | Vẫn dùng được phần học, voice giới hạn |
| iPad | Safari | ⚠️ như iPhone | Như iPhone |

- Cần **internet** (giọng đọc + nhận diện giọng nói gọi qua mạng).
- Cần cấp **quyền micro** khi bấm "Bắt đầu đọc" (chỉ lúc đó, không đòi sẵn).

## 5. Cách test (theo route)

> **Truy cập:** link Vercel preview do trưởng nhóm pilot gửi riêng. **Không** chia sẻ ra ngoài.
> Khi mở lần đầu: bấm **"Thêm vào màn hình chính"** (Android Chrome / iPhone Safari) để dùng như app.

### A. Day-One — bắt buộc thử trước

1. Mở **Trang chủ** → bấm thẻ xanh **"10 câu sống còn tại quầy"** (hoặc `/day-one`).
2. Đọc lần lượt 10 câu: nghe phát âm (nút 🔊), bật **"🐢 Đọc chậm"** nếu cần, đọc theo.
3. Bấm **"Tôi đã thuộc câu này"** khi đã thuộc.
4. Mở **🎤 Luyện đọc** từng câu: **"Bắt đầu đọc"** → đọc → xem kết quả (Đạt / Gần đúng / Cần luyện thêm).
   - Nếu máy không nhận ra giọng, dùng **"Đánh dấu đã đọc được"**.
5. Mục tiêu: **8/10 câu** đạt hoặc tự đánh dấu.
6. Cuộn xuống dưới: thử **Hội thoại**, **Đóng vai**, **5 Quiz nhanh** (bấm "Xem pinyin" nếu cần).

### B. Quiz `/quiz`

- Bấm chọn đáp án → xem giải thích → bấm **"Câu tiếp theo"**.
- Có 35 câu. Test ~10 câu là đủ. Thử cả 4 loại: chọn nghĩa, chọn câu đáp, nghe, điền pinyin.

### C. Flashcard `/flashcards`

- Lật thẻ (bấm vào chữ) → bấm **"Khó" / "Biết rồi"** → sang thẻ sau.
- Test ~20 thẻ. Kiểm tra thẻ "Khó" có quay lại nhiều hơn không.

### D. Voice (đã tích hợp trong Day-One & các bài)

- Mỗi mẫu câu có **"🎤 Luyện đọc"** mở rộng được. Thử ở cả Day-One **và** một bài P1
  (vd `/lessons/lesson_p1_payment`).

### E. Search `/search`

- Gõ thử: **`ho chieu`** (không dấu), **`thanh toán`**, **`Alipay`**, **`Marlboro`**, **`免税`**.
- Kết quả phải ra hỗn hợp Mẫu câu / Hội thoại / Từ vựng / Thương hiệu, có nút nghe + link bài học.

### F. References `/references`

- Bấm nghe phát âm vài thương hiệu mỹ phẩm + rượu/thuốc lá.
- Xem bảng lượng từ.

### G. Progress `/progress`

- Sau vài ngày test, kiểm tra số liệu: bài đã thuộc, thẻ đã ôn, độ chính xác quiz, **gate luyện đọc Day-One**.

## 6. Tiêu chí pass / fail của pilot

App được coi là **PASS pilot** nếu **TẤT CẢ** các tiêu chí dưới đạt:

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| P1 | Không có crash / lỗi trắng màn hình trong toàn bộ pilot | 0 crash blocking |
| P2 | Day-One mở được và 10 câu hiển thị đúng trên thiết bị thật | 100% người test |
| P3 | Phát âm mẫu (🔊) hoạt động trên ≥80% thiết bị test | ≥80% |
| P4 | Voice "Luyện đọc" có kết quả hoặc fallback "đánh dấu thủ công" hoạt động | 100% |
| P5 | ≥70% nhân viên tự nói "**dễ dùng**" hoặc "**bình thường**" (≥3/5) ở câu hỏi UX | ≥70% |
| P6 | ≥70% nói câu Day-One **giúp họ tự tin hơn** khi xử lý khách (≥3/5) | ≥70% |
| P7 | Không có khiếu nại về **lộ thông tin / brand logo / passport thật** | 0 |

App **FAIL** nếu **bất kỳ** tiêu chí dưới rơi vào:

- Có crash chặn dùng trên ≥30% thiết bị test.
- ≥30% người test phản ánh nội dung **khó hiểu / sai ngữ pháp / xúc phạm khách**.
- Có nội dung nhạy cảm (giấy tờ, thanh toán, miễn thuế) bị **người bản xứ / VDF Legal**
  đánh giá **sai hoặc nguy hiểm** khi đào tạo → phải sửa trước khi tiếp tục.

## 7. Sau pilot

- Tổng hợp `FEEDBACK_FORM.md` từ tất cả người test.
- Tổng hợp `INTERNAL_REVIEW_GUIDE.md` từ người bản xứ + VDF Ops/Legal.
- Quyết định: (a) sửa & pilot lại, (b) chuyển sang Phase 2 (account/cert/chấm phát âm
  — xem `PHASE_2_ROADMAP.md`), hoặc (c) mở rộng training cho nhiều store hơn.
