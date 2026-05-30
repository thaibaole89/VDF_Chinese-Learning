# Phase 2 Roadmap — góp ý từ team (2026-05-29)

Team đề xuất 3 cải tiến. **Cả 3 đều vượt ranh giới v1** (`no DB/auth/API`, `no paid API`,
`no pronunciation scoring`) → cần anh duyệt mở rộng kiến trúc + ngân sách trước khi build.
Tài liệu này **chỉ là kế hoạch** (chưa build phần backend/trả phí).

---

## ✅ Đã làm ngay trong v1 (không cần backend/key)
**Giọng đọc — nâng chất lượng:** `lib/speech.ts` giờ **xếp hạng & chọn giọng zh-CN tốt nhất**
có trên máy (Apple Tingting, Google Mandarin, MS neural Xiaoxiao/Yunyang…), hạ tốc độ mặc định
xuống 0.85 cho rõ, và thêm nút **"🐢 Đọc chậm"** (rate 0.6) cho người mới. Vẫn 100% device-based,
miễn phí. *Giới hạn:* chất lượng vẫn phụ thuộc thiết bị — muốn giọng người thật đồng nhất mọi máy
thì cần phương án (1) dưới đây.

---

## 1. Giọng đọc người thật, đồng nhất mọi thiết bị
**Khuyến nghị: pre-generate audio neural tĩnh.** Nội dung là ~200 câu **cố định**, nên generate
giọng một lần → lưu file MP3 tĩnh (`public/audio/<id>.mp3`), `SpeakButton` phát file thay giọng máy
(fallback Web Speech nếu thiếu file).
- **Kiến trúc:** vẫn static, **KHÔNG cần backend**, không tốn phí theo người dùng.
- **Công cụ:** Gemini TTS (`gemini-2.5-flash-preview-tts`) / Google Cloud TTS Neural2 / ElevenLabs /
  Azure Neural. *(Claude/Anthropic chưa có TTS tiếng Trung công khai.)*
- **Chi phí:** ~1 lần generate vài $; dung lượng ~4–8 MB.
- **Cần:** 1 key TTS (anh cấp + rotate sau như lần trước) → em viết `scripts/gen-audio.mjs` tương tự
  `gen-visuals.mjs`, generate cho mọi `audioText`, gắn `audioSrc` vào content/visuals.
- **Effort:** ~nửa ngày. **Rủi ro:** thấp.

## 2. Kiểm tra phát âm, "đạt mới cho qua bài"
= **chấm phát âm + nhận diện giọng** (đã hoãn ở v1).
- **Miễn phí (Web Speech Recognition):** zh-CN không ổn định (Chrome tạm ổn; Safari/iOS kém), cần
  internet → **không đủ tin cậy để gate tiến độ công bằng**. Chỉ hợp "ghi âm tự nghe lại".
- **Chấm chuẩn (khuyến nghị nếu làm thật): Azure Pronunciation Assessment** (chấm accuracy/fluency/
  completeness theo âm tiết) hoặc Google STT / SpeechSuper.
  - **Cần backend** (proxy giấu key) + **chi phí theo lượt** (Azure ~vài $/giờ audio).
  - **Logic gate:** điểm ≥ ngưỡng (vd 70) mới mở bài tiếp; cho thử lại; lưu điểm.
- **Effort:** 2–4 ngày (gồm backend + UI ghi âm). **Phụ thuộc:** mục 3 (cần account để lưu điểm/gate).
- **Đã có bản nhẹ (Phase 1D):** luyện đọc bằng browser speech recognition (không chấm chuẩn thanh điệu) — đã PASS test thiết bị thật; xem **`VOICE_PRACTICE_TEST_NOTES.md`**. Bản "đạt mới cho qua" đáng tin cậy vẫn cần API + backend như trên.

## 3. Account + theo dõi tiến độ + cấp chứng chỉ
= **auth + database + backend** (lõi Phase 2).
- **Khuyến nghị:** Supabase (Auth + Postgres) hoặc Vercel Postgres + một auth provider.
  - Bảng: `staff` (mã NV, tên, cửa hàng), `progress` (bài/điểm/ngày), `certificates`.
  - Admin xem được ai học/đạt gì; cấp **chứng chỉ PDF** khi hoàn thành track (vd "10 câu sống còn" /
    toàn bộ P1) — sinh client-side hoặc server.
- **⚠️ PII/Bảo mật:** lưu hồ sơ đào tạo + danh tính nhân viên = **dữ liệu cá nhân** → cần chính sách
  bảo mật, đồng ý của nhân viên, phân quyền ai xem được. Nên hỏi HR/Legal VDF trước.
- **Chi phí:** Supabase free tier đủ cho quy mô nội bộ ban đầu; lên ~$25/tháng nếu cần.
- **Effort:** 3–6 ngày (auth + schema + UI đăng nhập/tiến độ + cert + admin tối thiểu).

---

## Đề xuất thứ tự
1. **(1) Giọng neural tĩnh** — giá trị cao, rủi ro/chi phí thấp, hợp kiến trúc hiện tại. Làm trước.
2. **(3) Account + tiến độ + chứng chỉ** — nền tảng để (2) gate được; quyết định stack + PII trước.
3. **(2) Chấm phát âm + gate** — sau khi có account để lưu điểm.

## Quyết định cần từ anh trước khi build Phase 2
- [ ] Duyệt mở rộng kiến trúc khỏi v1 (cho phép backend/DB/auth + API trả phí)?
- [ ] Nhà cung cấp TTS (mục 1) + cấp key?
- [ ] Stack backend (Supabase? Vercel Postgres?) + provider auth?
- [ ] Chính sách PII cho hồ sơ đào tạo nhân viên (HR/Legal VDF)?
- [ ] Ngân sách hằng tháng chấp nhận được?
