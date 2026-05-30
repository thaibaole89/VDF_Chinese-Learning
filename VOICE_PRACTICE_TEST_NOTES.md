# Voice Practice — Test Notes (Phase 1D)

**Tính năng:** Luyện đọc bằng nhận diện giọng nói của trình duyệt (browser speech recognition).
**Trạng thái:** ✅ **Đã PASS kiểm thử ban đầu trên thiết bị thật** (2026-05-29). Chủ sở hữu xác nhận
tính năng chạy được và **có trả về kết quả/điểm**. Đang chạy trên bản preview nội bộ.

---

## 1. Bản chất của "điểm" — đọc kỹ
Điểm hiển thị là **kết quả nhận diện của trình duyệt (browser speech-recognition score)**,
**KHÔNG phải chấm phát âm chính thức**. Cụ thể:

- Hệ thống chỉ so khớp **mềm**: trình duyệt nghe ra chuỗi chữ Hán nào, rồi đối chiếu **từ khoá /
  độ trùng ký tự** với câu mẫu → ra `Đạt` / `Gần đúng` / `Cần luyện thêm`.
- **KHÔNG** chấm **thanh điệu (tone)**, **không** chấm độ chuẩn giọng/khẩu âm như giáo viên.
- Vì vậy điểm dùng để **động viên luyện tập**, không dùng làm đánh giá năng lực phát âm chính thức.

> Nói ngắn gọn: đây là "máy có nghe ra ý chính của câu không", không phải "phát âm đúng chuẩn Bắc Kinh chưa".

## 2. Quy ước câu chữ giao diện (giữ thận trọng)
Giữ wording thận trọng, **tránh** gây hiểu nhầm là chấm điểm chính thức.

- **Dùng:** "Kiểm tra câu đọc", "Kết quả nhận diện", "Luyện đọc / Nhận diện giọng đọc".
- **KHÔNG dùng:** "Chấm phát âm chính thức" / "official pronunciation scoring".
- **UI hiện tại** (để đối chiếu): nút "🎤 Luyện đọc"; tiêu đề "Luyện đọc bằng giọng nói"; nhãn kết quả
  "Đạt / Gần đúng / Cần luyện thêm"; disclaimer cố định *"Nhận diện giọng nói chỉ hỗ trợ luyện tập,
  chưa phải chấm điểm phát âm chính thức."* + *"Không lưu file ghi âm — kết quả chỉ lưu trên thiết bị này."*
  → Phù hợp với chính sách thận trọng ở trên.
- *(Tuỳ chọn, chưa làm — cần duyệt):* nếu muốn dùng đúng nhãn "Kiểm tra câu đọc" / "Kết quả nhận diện"
  trong UI thì đây là chỉnh **copy nhỏ**, không đổi logic. Hiện **chưa đổi code** (theo yêu cầu).

## 3. Dự phòng thủ công (manual fallback) — PHẢI giữ
Hỗ trợ nhận diện giọng nói **khác nhau theo trình duyệt/thiết bị**, nên:

- Luôn giữ nút **"Đánh dấu đã đọc được"** để nhân viên tự xác nhận khi máy không nhận diện được
  hoặc trình duyệt không hỗ trợ.
- Khi không hỗ trợ → hiện thông báo *"Thiết bị/trình duyệt này chưa hỗ trợ… Bạn vẫn có thể nghe mẫu
  và tự luyện."* + cho phép đánh dấu thủ công.
- **Không gỡ** dự phòng thủ công trong bất kỳ bản nào sắp tới.

## 4. Tương thích trình duyệt (đã biết)
- **Tốt:** Chrome / Edge trên desktop, **Android Chrome**.
- **Hạn chế:** iOS Safari thường **chưa hỗ trợ** nhận diện tiếng Trung → người dùng rơi vào nhánh
  fallback + đánh dấu thủ công (đúng thiết kế).
- Cần internet (Chrome gửi audio lên máy chủ Google để nhận diện). **Không** lưu/đẩy file ghi âm ở app.

## 5. Phạm vi & giới hạn
- Đây là **bản nhẹ trong v1**: browser-only, **không** server, **không** upload audio, **không** AI
  chấm điểm, **không** account/chứng chỉ. Tiến độ luyện đọc lưu `localStorage` (`vdf_chinese_voice_practice`).
- "Gate" Day-One (khuyến nghị 8/10) là **mềm, không khoá** — bài nâng cao chỉ hiển thị gợi ý
  "Nên hoàn thành luyện đọc Day-One…" + nút "Vẫn tiếp tục học".
- Bản **chấm phát âm đáng tin cậy + "đạt mới cho qua" cứng + account/chứng chỉ** vẫn là **Phase 2**
  (cần API trả phí + backend + chính sách PII) — xem `PHASE_2_ROADMAP.md`.

## 6. Vị trí code (tham chiếu)
- `lib/speechRecognition.ts` — wrapper Web Speech API (zh-CN), phát hiện hỗ trợ + map lỗi tiếng Việt.
- `lib/voiceScoring.ts` — so khớp mềm (từ khoá + độ trùng ký tự) → pass/near/retry.
- `components/VoicePracticePanel.tsx`, `VoiceGateSummary.tsx`, `VoiceStatusBadge.tsx`.
- Tích hợp: `/day-one`, `/lessons/[id]`, `/progress`. Lưu trữ: `lib/storage.ts` (key `vdf_chinese_voice_practice`).

---

*Kết luận: Phase 1D đạt kiểm thử ban đầu trên thiết bị thật; điểm là kết quả nhận diện trình duyệt
(không phải chấm phát âm chính thức); giữ dự phòng thủ công; giữ wording thận trọng.*
