# Phase 1B — Báo cáo nội dung đã soạn (P1 Gap Content)

**Phase:** 1B — *Author P1 Gap Content Only* (chưa dựng app/UI, chưa DB/auth/API).
**Ngày:** 2026-05-29
**Trạng thái toàn bộ nội dung mới:** `needs_review` (chưa nội dung nào được coi là chính thức).
**Validator:** `node validate-content.mjs` → ✅ PASS, 0 lỗi.

> ⚠️ **Cảnh báo quan trọng:** Đây là nội dung do AI soạn (drafted), **không phải** chính sách chính thức
> của VDF. Mọi câu liên quan giấy tờ (hộ chiếu/thẻ lên máy bay), khái niệm/quy định miễn thuế, hải quan,
> phương thức thanh toán được chấp nhận và khuyến mãi/giá **phải được VDF Operations/Legal xác nhận
> trước khi đưa vào đào tạo**. Người bản xứ tiếng Trung cần rà soát toàn bộ tiếng Trung trước Phase 1C.

---

## 1. File tạo/đổi trong Phase 1B

| File | Loại | Ghi chú |
|---|---|---|
| `content/sales_flow_p1_gaps.json` | **MỚI** | Course P1 gap: 6 lesson (tất cả `needs_review`). |
| `content/schema.ts` | sửa | Mở rộng `SalesStage` (+`verify_documents`, `price_inquiry`, `explain_duty_free`) — chỉ thêm, không phá vỡ giá trị cũ. |
| `validate-content.mjs` | nâng cấp | Thêm kiểm tra dialogues / roleplays / quizzes / `generatedFrom` / sourceType / authored-traceability. |
| `PHASE_1B_CONTENT_REVIEW.md` | **MỚI** | File này. |
| `CONTENT_REVIEW.md` | sửa | Thêm mục "Phase 1B authored P1 gap content" trỏ về file này. |

---

## 2. Tổng số (Phase 1B mới soạn)

| Hạng mục | Phase 1B thêm |
|---|---|
| Course | 1 (`course_sales_flow_p1_gaps`) |
| Lessons | 6 |
| Vocabulary | 65 |
| Sentence patterns | 51 |
| Dialogues | 12 (54 dòng) |
| Roleplays | 12 |
| Quizzes | 30 |

**Tổng toàn dự án sau Phase 1B (validator):** 10 file JSON · 7 course · 28 lesson · 122 vocab ·
81 pattern · 17 lượng từ · 55 brand · 2 bảng tra cứu · 13 backlog gap · 12 dialogue (54 dòng) ·
12 roleplay · 30 quiz.

---

## 3. Danh sách 6 lesson

| # | Lesson ID | Tiêu đề | `salesStage` | Category | v / p / d / r / q |
|---|---|---|---|---|---|
| 1 | `lesson_p1_passport` | Kiểm tra hộ chiếu & thẻ lên máy bay | `verify_documents` | documents | 11 / 8 / 2 / 2 / 5 |
| 2 | `lesson_p1_payment` | Thanh toán | `payment` | payment | 12 / 9 / 2 / 2 / 5 |
| 3 | `lesson_p1_price` | Giá & khuyến mãi | `price_inquiry` | price | 11 / 9 / 2 / 2 / 5 |
| 4 | `lesson_p1_dutyfree` | Khái niệm miễn thuế | `explain_duty_free` | duty_free | 10 / 8 / 2 / 2 / 5 |
| 5 | `lesson_p1_oos` | Hết hàng & gợi ý thay thế | `out_of_stock` | out_of_stock | 11 / 9 / 2 / 2 / 5 |
| 6 | `lesson_p1_closing` | Kết thúc giao dịch | `closing` | closing | 10 / 8 / 2 / 2 / 5 |

Tất cả: `level: "sales"`, `estimatedMinutes: 5`, `requiredForDayOne: true`, `reviewPriority: 1`.

---

## 4. Các câu "an toàn khi chưa chắc" (guardrail bắt buộc)

Theo nguyên tắc "không bịa quy định/giá" — khi nhân viên không chắc, **luôn dùng câu xác nhận**:

| ID | Câu | Dùng khi |
|---|---|---|
| `sp_price_5` | 我帮您确认一下价格。 | Chưa chắc về giá. |
| `sp_dutyfree_4` | 具体规定我帮您确认一下。 | Khách hỏi quy định mua hàng miễn thuế. |
| `sp_dutyfree_8` | 关于海关规定，我帮您问一下。 | Khách hỏi quy định hải quan (không tự tư vấn pháp lý). |

---

## 5. Câu/nội dung NHẠY CẢM — CẦN XÁC NHẬN

### 5a. Pháp lý / tuân thủ (Must be verified by VDF operations/legal)

Đánh `riskLevel: "use_with_care"` + `noteVi` + source note song ngữ:

| Lesson | ID | Câu | Vì sao nhạy cảm |
|---|---|---|---|
| 1 | `sp_passport_1` | 请出示您的护照和登机牌。 | Yêu cầu giấy tờ — quy trình do VDF/Operations quy định. |
| 1 | `sp_passport_7` | 买免税商品需要出示登机牌。 | Khẳng định điều kiện mua hàng — cần xác nhận. |
| 4 | `sp_dutyfree_3` | 免税商品需要按规定购买。 | Nói về "quy định" mua hàng — không được tự định nghĩa. |
| 4 | `sp_dutyfree_6` | 买免税商品要坐国际航班。 | Điều kiện chuyến bay quốc tế — cần VDF xác nhận đúng. |

Ngoài ra, **lesson 1 & lesson 4** (cả `sourceRefs` cấp lesson), các dialogue `dlg_passport_1/2`,
`dlg_dutyfree_1/2` và roleplay `rp_passport_2`, `rp_dutyfree_2` đều mang note song ngữ:
*"Must be verified by VDF operations/legal before staff training."*

### 5b. Vận hành / thương mại (phải khớp thực tế VDF)

| Lesson | ID | Câu | Cần xác nhận |
|---|---|---|---|
| 2 | `sp_payment_2` | 您可以用支付宝、微信支付或者银联卡。 | Phương thức chấp nhận tùy POS/quy định VDF. |
| 2 | `sp_payment_7` | 我们也收现金。 | Việc nhận tiền mặt/loại tiền tệ tùy quy định VDF. |
| 3 | `sp_price_2` | 现在有优惠活动。 | Khuyến mãi phải khớp chương trình thực tế. |
| 3 | `sp_price_3` | 这款有折扣。 | Giảm giá phải khớp thực tế. |
| 3 | `sp_price_6` | 这个比原价便宜。 | So sánh giá — phải đúng dữ liệu thật. |
| 3 | `sp_price_8` | 现在买一送一。 | Chương trình cụ thể phải khớp thực tế. |
| 3 | `sp_price_9` | 满一千有优惠。 | Mức/điều kiện phải khớp thực tế. |

> **Lưu ý vận hành:** giá ví dụ trong dialogue (vd "两千元", "一千二") chỉ là **số minh hoạ để luyện tập**,
> không phải bảng giá thật.

---

## 6. Các mục `needs_review` theo lesson

**100% nội dung Phase 1B là `needs_review`.** Người bản xứ cần soát tiếng Trung (chữ + pinyin + độ tự nhiên),
người phụ trách nội dung VDF cần soát nghĩa tiếng Việt & tính chính xác nghiệp vụ.

| Lesson | Vocab | Pattern | Dialogue | Roleplay | Quiz |
|---|---|---|---|---|---|
| `lesson_p1_passport` | 11 | 8 | 2 | 2 | 5 |
| `lesson_p1_payment` | 12 | 9 | 2 | 2 | 5 |
| `lesson_p1_price` | 11 | 9 | 2 | 2 | 5 |
| `lesson_p1_dutyfree` | 10 | 8 | 2 | 2 | 5 |
| `lesson_p1_oos` | 11 | 9 | 2 | 2 | 5 |
| `lesson_p1_closing` | 10 | 8 | 2 | 2 | 5 |

Quy ước `sourceRefs`:
- Chuẩn: `{ sourceType: "authored", note: "Phase 1B authored (P1 gap); cần người bản xứ duyệt." }`
- Nhạy cảm pháp lý: `{ sourceType: "authored", note: "Phase 1B authored (P1 gap). Must be verified by VDF operations/legal before staff training. / Cần VDF Operations/Legal xác nhận trước khi đào tạo chính thức." }`

---

## 7. Ghi chú rà soát cho người bản xứ tiếng Trung

- Toàn bộ câu dùng kính ngữ **您**; xưng hô **先生/女士** khi biết giới tính. **Không** dùng 美女/帅哥/老板
  trong các module P1 (theo `content/ADDRESS_TERM_POLICY.md`).
- Cần soát độ tự nhiên của: 二维码 / 扫码 (thanh toán), 满减 / 买一送一 (khuyến mãi),
  缺货 vs 没有货 vs 卖完了 (hết hàng), 旅途愉快 / 慢走 / 欢迎下次光临 (kết thúc).
- Kiểm tra dấu thanh pinyin các từ dài: `èrwéimǎ` (二维码), `lǚtú yúkuài` (旅途愉快), `héduì` (核对),
  `guīdìng` (规定), `xiāngsì` (相似), `pèihé` (配合).
- `支付宝 = Zhīfùbǎo`, `微信支付 = Wēixìn zhīfù`, `银联卡 = yínlián kǎ` — xác nhận cách đọc/viết hoa.

---

## 8. Ghi chú cho VDF Operations / Legal

1. Xác nhận **quy trình giấy tờ** thực tế: khi nào bắt buộc xem hộ chiếu, khi nào chỉ cần thẻ lên máy bay.
2. Xác nhận **điều kiện mua hàng miễn thuế** (chuyến bay quốc tế? hạn mức?) — Phase 1B **không** ghi hạn mức
   cụ thể, không ghi quy định hoàn/đổi, không tư vấn hải quan (theo guardrail).
3. Xác nhận **phương thức thanh toán** thực tế được chấp nhận tại quầy (Alipay/WeChat/UnionPay/thẻ/tiền mặt).
4. Cung cấp **chính sách khuyến mãi/giá** thật để thay các câu minh hoạ ở lesson 3 (hoặc đánh dấu tắt nếu
   không dùng).
5. Sau khi xác nhận: hạ `riskLevel` về `safe` (nếu phù hợp) và chuyển `status` các mục đã duyệt sang
   `from_source`/`authored` theo đúng quy ước.

---

## 9. Rủi ro còn lại

- **Chưa có người bản xứ duyệt** tiếng Trung → có thể còn câu chưa thật tự nhiên với khách Trung Quốc.
- **Nghiệp vụ chưa chốt:** giấy tờ, hạn mức, miễn thuế, thanh toán, khuyến mãi đều chờ VDF xác nhận.
- **Giá/khuyến mãi là minh hoạ**, dễ bị hiểu nhầm là cam kết nếu không thay bằng dữ liệu thật.
- Audio TTS (`audioText`) mặc định = `zh`/`hanzi`; chưa kiểm tra thực tế giọng zh-CN đọc các thuật ngữ
  (二维码, 银联卡…) — sẽ kiểm ở phase dựng app.

---

## 10. Đề xuất cho Phase 1C

1. **Trước tiên: vòng duyệt.** Gửi `NATIVE_REVIEW_CHECKLIST.md` + file này cho (a) người bản xứ tiếng Trung
   và (b) VDF Operations/Legal. Thu thập chỉnh sửa, cập nhật JSON, hạ cờ `needs_review`/`use_with_care` cho
   các mục đã duyệt.
2. **Sau khi duyệt nội dung P1:** mới bắt đầu **Phase 1C = dựng app Next.js** (đọc JSON tĩnh, localStorage,
   TTS Web Speech zh-CN) — đây là việc của phase sau, **không làm trong 1B**.
3. **Chưa soạn P2/P3** (upsell/cross-sell, gợi ý quà, hạn mức chi tiết, khiếu nại khó, thời trang/phụ kiện,
   onboarding phát âm) — giữ trong `content/content_gap_backlog.json` cho phase sau.

---

## 11. Phase 1B.1 cleanup (2026-05-29)

Sau khi **duyệt cấu trúc Phase 1B**, đã thực hiện các chỉnh sửa sau (tất cả giữ `status: needs_review`;
mọi thay đổi đều ghi lại bằng `noteVi`/`sourceRefs.note` để không "âm thầm"):

| # | Thay đổi | Trước | Sau | Vì sao |
|---|---|---|---|---|
| 1 | Bỏ giá theo 元/RMB trong dialogue thanh toán (`dlg_payment_1`) | 一共是两千元。 | 一共是这个价格。 | Không dạy nhân viên báo giá bằng RMB/元 khi chưa được VDF xác nhận. (Vẫn giữ câu 您要怎么付款？ phía sau để dialogue trôi chảy.) |
| 2 | Làm mềm giải thích miễn thuế (`dlg_dutyfree_1`) | 就是不用交税，所以比较便宜。 | 这是免税价格，所以一般会比较优惠。 | Tránh để nhân viên giải thích thuế/pháp lý trực tiếp. |
| 3 | Làm mềm điều kiện chuyến bay quốc tế (`sp_dutyfree_6`) | 买免税商品要坐国际航班。 | 一般需要国际航班的登机牌。 | Thận trọng hơn; giữ `use_with_care` + note "must be verified by VDF Operations/Legal". |
| 4 | Câu hỏi điểm đến tự nhiên hơn (`sp_passport_6`) | 您去哪个目的地？ | 请问您飞往哪里？ | Tự nhiên hơn trong ngữ cảnh sân bay. |
| 5 | Câu tiền mặt an toàn hơn (`sp_payment_7`) | 我们也收现金。 | 现金是否可以使用，我帮您确认一下。 | Chính sách nhận tiền mặt chưa xác nhận → chuyển thành câu xác nhận an toàn; `riskLevel` `use_with_care` → `safe`. |
| 6 | 商品 thay 东西 (chuyên nghiệp hơn) | 这是您的东西… / 请拿好您的东西。 | 这是您的商品… / 请拿好您的商品。 | 商品 chuyên nghiệp hơn 东西 trong bán lẻ. Áp dụng cho `sp_closing_8`, dòng staff trong `dlg_closing_2`, và `requiredPhrases` của `rp_closing_2` (giữ nhất quán; các câu **khách** nói vẫn để 东西). |
| 7 | Ghi chú cách dùng 请慢走 (`sp_closing_6`) | usageVi cũ ("Câu chào khi khách rời đi.") | usageVi: *"Không dịch máy móc là 'đi chậm'…"* | Tránh hiểu/dịch sai câu chào tiễn khách. |
| 8 | Thêm bài **"10 câu sống còn"** | — | `content/day_one_survival.json` | Nổi bật 10 câu quan trọng nhất cho nhân viên mới trước ca đầu. |

### Bài Day-One Survival (`course_day_one_survival` / `lesson_day_one_10_phrases`)

- **1 course · 1 lesson · 10 sentence patterns · 1 dialogue (10 dòng) · 1 roleplay · 5 quiz · 0 vocab.**
- 10 câu: chào → hỏi nhu cầu → hỏi thương hiệu → gợi ý → giá miễn thuế → giấy tờ → thanh toán →
  xác nhận+hóa đơn → hết hàng → cảm ơn+tiễn khách.
- Các câu **trùng/rút gọn** từ phần đã soạn; `sourceRefs.note` trỏ về id gốc
  (`sp_greeting_welcome`, `sp_ask_what_product`, `sp_ask_brand`, `sp_recommend`, `sp_price_1`,
  `sp_passport_1`, `sp_payment_4`, `sp_payment_5`+`sp_payment_6`, `sp_oos_1`, `sp_closing_1`+`sp_closing_4`).
- Câu giấy tờ `sp_day1_6` giữ `riskLevel: "use_with_care"` + note compliance (như `sp_passport_1`).

**Validator sau 1B.1:** ✅ PASS, 0 lỗi. Tổng toàn dự án: 11 file · 8 course · 29 lesson · 122 vocab ·
**91 pattern** · 17 lượng từ · 55 brand · 13 backlog · **13 dialogue (64 dòng)** · **13 roleplay** · **35 quiz**.

---

*Hết Phase 1B / 1B.1 — chờ phê duyệt trước khi sang bất kỳ phase nào. Chưa dựng app/UI/DB/API; chưa soạn P2/P3.*
