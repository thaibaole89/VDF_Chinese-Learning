# Chính sách xưng hô với khách (Address-Term Policy)

**Áp dụng cho:** Nhân viên bán hàng VDF tại quầy miễn thuế sân bay, khi xưng hô với khách nói tiếng Trung.
**Mục đích:** Thống nhất cách gọi khách cho lịch sự, phù hợp môi trường bán lẻ cao cấp ở sân bay.

> Liên quan dữ liệu: các từ này nằm trong `content/foundation_pronouns.json > lesson_address_terms`,
> mỗi từ có trường `riskLevel` (`safe` hoặc `use_with_care`) khớp với chính sách dưới đây.

---

## 1. Mặc định nên dùng (`safe`)

| Hán | Pinyin | Nghĩa | Khi nào dùng |
|---|---|---|---|
| 您 | nín | quý khách / anh-chị (kính ngữ) | **Mặc định cho mọi khách.** An toàn nhất, luôn đúng. |
| 先生 | xiānsheng | quý ông / ngài | Khách nam. Có thể ghép họ: 王先生 (ông Vương). |
| 女士 | nǚshì | quý bà / quý cô | Khách nữ. Lịch sự, trung tính về tuổi. |

→ **Nhân viên mới hãy dùng 您 / 先生 / 女士 làm mặc định.** Ba từ này an toàn nhất cho bán lẻ
miễn thuế cao cấp ở sân bay và không bao giờ gây khó xử.

---

## 2. Dùng thận trọng (`use_with_care`)

| Hán | Pinyin | Nghĩa | Lưu ý |
|---|---|---|---|
| 老板 | lǎobǎn | ông chủ / sếp | Thân mật, hợp khách nam đứng tuổi. Có thể nghe xã giao thái quá ở quầy cao cấp. |
| 美女 | měinǚ | người đẹp (gọi khách nữ) | Thân thiện ở chợ/cửa hàng bình dân, nhưng **quá suồng sã** cho sân bay cao cấp. |
| 帅哥 | shuàigē | anh đẹp trai (gọi khách nam) | Thân thiện nhưng suồng sã; tùy đối tượng, dễ kém trang trọng. |

→ Ở **bán lẻ cao cấp sân bay**, 美女 / 帅哥 / 老板 có thể nghe thân thiện ở cửa hàng bình thường,
nhưng thường **quá thân mật / kém trang trọng** cho môi trường VDF.

---

## 3. Cách dùng trong app

- **Dạy mặc định:** chỉ luyện chủ động 您 / 先生 / 女士.
- **美女 / 帅哥 / 老板:** giữ lại trong app **chủ yếu để NHẬN BIẾT** (khi khách hoặc đồng nghiệp dùng,
  nhân viên hiểu được) và để **dùng tùy chọn** khi nhân viên đã có kinh nghiệm đọc tình huống —
  **không** đặt làm nội dung luyện mặc định.
- Trong dữ liệu, ba từ thận trọng được gắn `riskLevel: "use_with_care"` kèm `noteVi` cảnh báo;
  ba từ mặc định gắn `riskLevel: "safe"`.

---

## 4. Tóm tắt một dòng cho nhân viên

> **Không chắc thì gọi 您. Biết giới tính thì 先生 / 女士. Tránh 美女 / 帅哥 / 老板 trừ khi chắc chắn hợp.**

*(Cần chủ nội dung VDF xác nhận chính sách này trước khi đưa vào đào tạo chính thức — xem
`NATIVE_REVIEW_CHECKLIST.md`.)*
