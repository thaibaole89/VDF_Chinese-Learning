# VDF Chinese Sales Tutor — Phase 1A Content Review

**Mục đích / Purpose:** Tài liệu này để chủ sở hữu nội dung (VDF) rà soát toàn bộ JSON nội dung
đã chuẩn bị ở Phase 1A trước khi dựng app. Nó liệt kê những gì giữ nguyên từ slide gốc, những gì
đã chỉnh sửa nhẹ (và vì sao), những gì cần người bản xứ duyệt, và phần nội dung còn thiếu.

- **Phase:** 1A — chuẩn bị nội dung (content preparation), **chưa dựng app, chưa có UI/DB/API.**
- **Nguồn:** Chỉ từ 29 ảnh slide đã transcribe ở Phase 0. Không tự bịa nội dung mới.
- **Validation:** `node validate-content.mjs` → ✅ PASS, 0 lỗi.
- **Ngày:** 2026-05-29.

---

## 1. Files created

Tất cả nằm trong `/content`:

| File | Loại | Nội dung |
|---|---|---|
| `schema.ts` | Schema | Định nghĩa kiểu (single source of truth) + quy ước `status` |
| `foundation_pronouns.json` | Course (foundation) | Đại từ nhân xưng, xưng hô, chỉ định, nghi vấn |
| `foundation_numbers_colors.json` | Course (foundation) | Số đếm + màu sắc (đã thêm nghĩa tiếng Việt) |
| `foundation_measure_words.json` | Course (foundation) | Lượng từ theo ngành (mỹ phẩm / rượu-thuốc-bánh / thời trang) |
| `sales_flow_core.json` | Course (sales_flow) | **Counter Survival** — bộ câu sống còn ngày đầu tại quầy |
| `product_beauty.json` | Course (product) | Câu tư vấn nước hoa & dưỡng da |
| `product_liquor_tobacco_sweets.json` | Course (product) | Câu tư vấn rượu / thuốc lá / bánh kẹo |
| `reference_beauty_brands.json` | ReferenceTable | 17 thương hiệu mỹ phẩm (Latin → Hán → pinyin) |
| `reference_liquor_tobacco_brands.json` | ReferenceTable | 38 thương hiệu/loại rượu & thuốc lá |
| `content_gap_backlog.json` | Backlog | 13 nhóm nội dung còn thiếu (P1/P2/P3) — **chưa soạn** |

Cộng cụ kiểm tra ở thư mục gốc: `validate-content.mjs`.

### Counts (từ validator)

| Hạng mục | Số lượng |
|---|---|
| JSON files | 9 |
| Courses | 6 |
| Lessons | 22 |
| Vocabulary items | 57 |
| Sentence patterns | 30 |
| Measure words | 17 |
| Brand references | 55 |
| Reference tables | 2 |
| Content gaps (backlog) | 13 |

> Lưu ý: **không có** dialogue / quiz / roleplay nào được tạo ở Phase 1A — slide gốc không có,
> và brief cấm tự soạn. Các kiểu này đã định nghĩa sẵn trong schema, để dành cho Phase 1B.

**Làm rõ số lượng thương hiệu (Brand references = 55):**
- **Mỹ phẩm = 17** = **16 thương hiệu mỹ phẩm có tên** (8 Pháp + 5 Mỹ/Anh + 3 Nhật/Hàn) **+ 1 mục SK-II**
  (mục phát âm đặc biệt: giữ tên Latin "SK-II", pinyin "S K èr", `audioText: "SK二"`).
- **Rượu & thuốc lá = 38** = 12 rượu quốc tế + 6 loại rượu chung (generic, **không phải brand**) +
  10 thuốc lá quốc tế + 5 rượu Trung Quốc + 5 thuốc lá Trung Quốc.
- **Tổng = 17 + 38 = 55**, khớp đúng số validator in ra (`Brand references : 55`).

---

## 2. Quy ước `status` (đọc trước khi review)

Mỗi mục nội dung mang một trong ba trạng thái — cho biết chúng tôi đã "chạm" vào nó bao nhiêu:

- **`from_source`** — Hán + pinyin + tiếng Việt **đúng như slide** (chỉ chuẩn hóa khoảng trắng pinyin).
  Việc đổi xưng hô tiếng Việt (Bạn → Quý khách) **vẫn để `from_source`** vì chủ nội dung đã duyệt
  trước đúng cách đổi này; có `noteVi` ghi lại và `sourceRefs` vẫn trỏ về slide.
- **`needs_review`** — **đã chỉnh tiếng Trung** (polish cho tự nhiên). Câu mới là `zh` chính;
  `noteVi` giải thích, `sourceRefs[].note` giữ bản gốc. → **Đây là phần cần người bản xứ duyệt.**
- **`authored`** — nội dung không có trên slide. Ở Phase 1A **chỉ là** nghĩa tiếng Việt thêm vào
  cho Số đếm & Màu sắc (slide gốc chỉ có tiếng Anh).

---

## 3. Phần giữ nguyên từ slide (`from_source`)

Phần lớn nội dung là verbatim: toàn bộ đại từ/xưng hô/chỉ định/nghi vấn, lượng từ, câu tư vấn
nước hoa & dưỡng da, một số câu trong Counter Survival (chào hỏi, hỏi thương hiệu, mời kiểm tra hàng,
báo hết hàng, mời xem từ từ), và **toàn bộ 55 thương hiệu**. Đây là phần đáng tin cậy nhất, chỉ cần
soát chính tả Hán/pinyin.

---

## 4. Phần đã polish tiếng Trung (`needs_review`) — CẦN DUYỆT

6 câu được chỉnh tiếng Trung cho tự nhiên hơn (5 trong `sales_flow_core.json` + 1 trong
`product_liquor_tobacco_sweets.json`). **Ý không đổi**, nhưng nên để người bản xứ xác nhận:

| ID | Bản gốc (slide) | Bản đã chỉnh | Lý do |
|---|---|---|---|
| `sp_ask_what_product` | 您想看什么？ | 请问您想看什么产品？ | Thêm 请问 (xin hỏi) + 产品 (sản phẩm) cho lịch sự, trọn ý |
| `sp_recommend` | 我可以给您推荐 | 我可以给您推荐几款。 | Câu gốc cụt; thêm 几款 (vài mẫu) cho hoàn chỉnh |
| `sp_bestseller_basic` | 这个很好卖 | 这款很好卖。 | Dùng lượng từ 款 (mẫu) tự nhiên hơn 个 cho sản phẩm |
| `sp_bestseller_strong` | 这个很好卖 | 这款是我们的畅销产品。 | Phương án diễn đạt mạnh/đầy đủ hơn (thêm lựa chọn) |
| `sp_payment_checkout` | 我帮您结账 | 我来帮您结账。 | Thêm 来 cho câu chủ động, tự nhiên |
| `sp_liquor_self_gift` | 您自己用还是送人？ *(Hán slide thiếu 是; pinyin có shì)* | 您是自己用还是送人？ | Thêm 是 cho khớp pinyin gốc → câu bán hàng đầy đủ (cấu trúc 是…还是…) |

> Các lesson chứa câu polish (`lesson_cs_ask_needs`, `_recommend`, `_bestseller`, `_payment` trong
> sales_flow; và `lesson_liquor` trong product) cũng mang `status: needs_review` ở cấp lesson để báo hiệu.

---

## 5. Phần chuẩn hóa xưng hô tiếng Việt (Bạn → Quý khách)

Theo chỉ đạo, các câu hướng tới khách đổi "Bạn" → "Quý khách … ạ". **Tiếng Trung giữ nguyên 100%.**
Để `from_source` (đổi đã được duyệt trước), có `noteVi` + bản gốc trong `sourceRefs[].note`. 3 câu:

| ID | VN gốc (slide) | VN đã chuẩn hóa |
|---|---|---|
| `sp_liquor_what` | Bạn muốn mua loại rượu nào? | Quý khách muốn mua loại rượu nào ạ? |
| `sp_liquor_whisky_cognac` | Bạn thích Whisky hay Cognac? | Quý khách thích Whisky hay Cognac ạ? |
| `sp_tobacco_soft_hard` | Bạn muốn mua thuốc lá bao mềm hay bao cứng? | Quý khách muốn mua thuốc lá bao mềm hay bao cứng ạ? |

> `sp_liquor_self_gift` ban đầu cũng nằm ở đây (Bạn → Quý khách … ạ), nhưng Phase 1A.1 còn chỉnh chữ Hán
> (thêm 是) nên đã chuyển sang **mục 4** (`needs_review`) để không liệt kê trùng.

---

## 6. Phần tự thêm (`authored`) — chỉ nghĩa tiếng Việt cho Số & Màu

Slide Số đếm và Màu sắc **chỉ có chữ Hán + pinyin + nghĩa tiếng Anh**. Chúng tôi thêm nghĩa tiếng Việt
(và giữ nghĩa tiếng Anh) để dùng làm flashcard. Mỗi mục có `sourceRefs[].note = "Vietnamese meaning
added during Phase 1A"`. Cần soát lại nghĩa Việt (đặc biệt các màu ghép). 23 mục: 13 số + 10 màu.

---

## 7. Quyết định `riskLevel` cho từ xưng hô

Trong `foundation_pronouns.json > lesson_address_terms`, mỗi từ xưng hô được gắn mức độ an toàn khi
dùng với khách:

| Từ | Mức | Ghi chú |
|---|---|---|
| 您 (nín) | `safe` | Kính ngữ "anh/chị/quý khách" — dùng mặc định |
| 先生 (xiānsheng) | `safe` | "Quý ông / ngài" |
| 女士 (nǚshì) | `safe` | "Quý bà / quý cô" |
| 老板 (lǎobǎn) | `use_with_care` | "Ông chủ" — thân mật, hợp khách nam đứng tuổi; có thể dùng họ + 总 |
| 美女 (měinǚ) | `use_with_care` | "Người đẹp" — thân mật, không dùng trong ngữ cảnh trang trọng |
| 帅哥 (shuàigē) | `use_with_care` | "Anh đẹp trai" — thân mật, tùy đối tượng |

> **Đề xuất review:** xác nhận chính sách xưng hô của VDF — có cho phép nhân viên dùng
> 美女/帅哥/老板 với khách không, hay chỉ dùng 您/先生/女士.

---

## 8. Việc cần chủ nội dung / người bản xứ làm (action items)

1. **Duyệt 6 câu `needs_review`** ở mục 4 (tiếng Trung polish).
2. **Duyệt nghĩa tiếng Việt** của 23 mục số/màu (mục 6).
3. **Chốt chính sách xưng hô** 美女/帅哥/老板 (mục 7).
4. **Soát chính tả Hán/pinyin** của 55 thương hiệu, đặc biệt tên phiên âm.
5. **Duyệt câu `sp_liquor_self_gift`** (mục 4): slide ghi pinyin "Nín **shì** zìjǐ…" nhưng chữ Hán thiếu 是.
   Phase 1A.1 đã thêm 是 vào chữ Hán → 您是自己用还是送人？ (câu bán hàng đầy đủ); đánh dấu `needs_review`.

---

## 9. Vấn đề chất lượng dữ liệu còn tồn đọng (đã xử lý tạm, nên soát lại)

- **Pinyin ≠ Hán ở slide §4.F (rượu):** chữ Hán "您自己用还是送人？" thiếu 是 nhưng pinyin gốc có "shì".
  Phase 1A.1 chuẩn hóa theo hướng câu đầy đủ tự nhiên — thêm 是 vào chữ Hán → 您是自己用还是送人？, đánh dấu
  `needs_review` (xem mục 4). → Cần người bản xứ xác nhận.
- **Lượng từ rượu/thuốc/bánh — đánh số STT nhảy cóc:** slide gốc (tên file có lỗi gõ
  `lượng từ rượu, thuốc,c hoco.jpg`) đánh số 1,2,3,4,6,7,9 (thiếu 5,8). Đã giữ đủ các mục đọc được,
  ghi chú trong `sourceRefs[].note`. → Cần đối chiếu lại ảnh gốc xem có sót lượng từ nào không.
- **Ảnh đại từ/xưng hô độ phân giải thấp (Screenshot 2–5):** transcribe theo khả năng đọc tốt nhất;
  nên soát lại vài pinyin có dấu thanh.
- **Xưng hô không nhất quán giữa các slide:** slide rượu/thuốc dùng "Bạn", slide khác dùng "您/anh-chị".
  Đã chuẩn hóa hướng "Quý khách … ạ" cho câu hướng tới khách (mục 5).
- **SK-II:** giữ tên Latin "SK-II", pinyin "S K èr", `audioText: "SK二"` để máy đọc được. Cần xác nhận
  cách đọc VDF muốn dạy.

---

## 10. Tóm tắt Gap Backlog (13 nhóm — CHƯA soạn)

Theo brief, **không** tự soạn các nhóm này ở Phase 1A. Đã liệt kê trong `content_gap_backlog.json`:

**P1 (cần nhất cho ngày đầu):**
1. Hộ chiếu & thẻ lên máy bay
2. Thanh toán Alipay / WeChat Pay / UnionPay
3. Giá, giảm giá & khuyến mãi
4. Khái niệm hàng miễn thuế
5. Hết hàng — gợi ý sản phẩm thay thế
6. Hoàn tất giao dịch & tiễn khách

**P2:**
7. Bán thêm & bán chéo (upsell/cross-sell)
8. Tư vấn quà tặng
9. Giới hạn số lượng mua (hải quan)
10. Câu hỏi khó & xử lý phàn nàn

**P3:**
11. Câu giao tiếp ngành thời trang & phụ kiện
12. Hội thoại sản phẩm đầy đủ (nhiều lượt)
13. Bài làm quen phát âm (pinyin & thanh điệu)

---

## 11. Đề xuất cho Phase 1B

1. **Chủ nội dung duyệt mục 8 trước** — nhất là 5 câu `needs_review` và chính sách xưng hô. Đây là
   "khóa chất lượng" trước khi nội dung lên app.
2. **Bổ sung P1 gap** — đặc biệt thanh toán (Alipay/WeChat/UnionPay), hộ chiếu/boarding pass, và
   bước "closing". Đây là các bước bắt buộc trong một giao dịch thật mà nguồn hiện thiếu.
3. **Xây app Next.js** sau khi nội dung được duyệt: render flashcard từ `vocabulary`, câu mẫu từ
   `sentencePatterns`, bảng tra từ `ReferenceTable`; track "sales_flow" (Counter Survival) làm
   lộ trình ngày-đầu (`requiredForDayOne: true`, sắp theo `salesStage`).
4. **Phát âm:** dùng Web Speech API (zh-CN) đọc trường `audioText` (mặc định = Hán/zh).
5. **Sinh quiz** từ vocab/pattern đã duyệt (schema đã có `QuizQuestion.generatedFrom`).
6. **Bảo mật:** tài liệu gốc là nội dung nội bộ VDF trên OneDrive — repo (nếu có) phải **Private**,
   chỉ chứa code + JSON, **không** đẩy ảnh/video gốc (dùng `.gitignore`).

---

## 12. Phase 1B — authored P1 gap content (đã soạn)

> **Cập nhật 2026-05-29 (Phase 1B):** 6 nhóm P1 trong backlog (mục 10) đã được **soạn mới** vào
> `content/sales_flow_p1_gaps.json`. Chi tiết đầy đủ + ghi chú nhạy cảm pháp lý xem
> **[`PHASE_1B_CONTENT_REVIEW.md`](./PHASE_1B_CONTENT_REVIEW.md)**.

- **Nguồn:** nội dung **do AI soạn** (không có trên slide) → tất cả `status: "needs_review"`,
  `sourceRefs.sourceType: "authored"`. **Khác** với `authored` của Phase 1A (chỉ thêm nghĩa Việt cho
  số/màu, vẫn trỏ ảnh slide). Đây là lý do dùng `needs_review`, không phải `authored`.
- **Đã thêm:** 1 course · 6 lesson (`lesson_p1_passport / payment / price / dutyfree / oos / closing`) ·
  65 vocab · 51 sentence pattern · 12 dialogue (54 dòng) · 12 roleplay · 30 quiz.
- **Nhạy cảm pháp lý/tuân thủ:** các câu về giấy tờ & quy định miễn thuế (`sp_passport_1`, `sp_passport_7`,
  `sp_dutyfree_3`, `sp_dutyfree_6`, cùng lesson 1 & 4 + dialogue/roleplay liên quan) đánh
  `riskLevel: "use_with_care"` + note song ngữ *"Must be verified by VDF operations/legal before staff
  training."* Câu về phương thức thanh toán & khuyến mãi đánh `use_with_care` ("phải khớp thực tế VDF").
- **Schema:** `SalesStage` mở rộng thêm `verify_documents` / `price_inquiry` / `explain_duty_free`
  (chỉ thêm, không phá vỡ giá trị cũ).
- **Validator nâng cấp:** kiểm tra dialogues / roleplays / quizzes / `quiz.generatedFrom` (phải trỏ
  đúng id vocab/pattern) / sourceType hợp lệ / authored-traceability. `node validate-content.mjs` → ✅ PASS, 0 lỗi.

**Tổng toàn dự án sau Phase 1B:** 10 file · 7 course · 28 lesson · 122 vocab · 81 pattern · 17 lượng từ ·
55 brand · 2 bảng tra cứu · 13 backlog gap · 12 dialogue (54 dòng) · 12 roleplay · 30 quiz.

> Còn lại trong backlog (**chưa soạn**): P2 (mục 7–10) và P3 (mục 11–13).

**Phase 1B.1 cleanup (2026-05-29):** chỉnh một số câu tiếng Trung cho an toàn/chuyên nghiệp hơn — bỏ giá theo
元 trong dialogue thanh toán; làm mềm câu giải thích miễn thuế & điều kiện chuyến bay quốc tế; câu hỏi điểm
đến tự nhiên hơn (请问您飞往哪里？); câu tiền mặt chuyển thành câu xác nhận an toàn; 商品 thay 东西; thêm ghi chú
cách dùng 请慢走 — và thêm bài **"10 câu sống còn"** (`content/day_one_survival.json`). Chi tiết: xem
**[`PHASE_1B_CONTENT_REVIEW.md`](./PHASE_1B_CONTENT_REVIEW.md) §11**. Validator vẫn ✅ PASS, 0 lỗi.
Tổng sau 1B.1: 11 file · 8 course · 29 lesson · 122 vocab · 91 pattern · 17 lượng từ · 55 brand · 13 backlog ·
13 dialogue (64 dòng) · 13 roleplay · 35 quiz.

---

*Hết. Phase 1A đã được duyệt; Phase 1B + 1B.1 đã soạn/chỉnh nội dung 6 nhóm P1 + bài "10 câu sống còn"
(tất cả `needs_review`) và dừng tại đây để chờ duyệt — **chưa dựng app, UI, DB, API**, và **chưa soạn P2/P3**.*
