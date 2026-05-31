# INTERNAL_REVIEW_GUIDE — Cho người bản xứ tiếng Trung + VDF Ops/Legal

**Mục đích:** Hướng dẫn duyệt nội dung bằng tay trước khi đào tạo chính thức.
**Phạm vi:** App `VDF Chinese Sales Tutor` (Phase 1F preview).
**Người duyệt cần:** (a) **người bản xứ tiếng Trung** quen ngữ cảnh bán lẻ, (b) **VDF Operations**, (c) **VDF Legal/Compliance**.

> Liên quan: `NATIVE_REVIEW_CHECKLIST.md` (checklist ban đầu Phase 1A.1), `CONTENT_REVIEW.md`,
> `PHASE_1B_CONTENT_REVIEW.md`, `content/ADDRESS_TERM_POLICY.md`.

---

## ⚠️ Quy tắc tuyệt đối

1. **KHÔNG được tự ý đổi `status: "needs_review"` thành `"from_source"` hoặc `"authored"` nếu chưa
   có người duyệt thật ký xác nhận.** Đây là khoá chất lượng duy nhất hiện có.
2. **KHÔNG được tự ý gỡ `riskLevel: "use_with_care"`** trên các câu compliance-sensitive (giấy tờ,
   miễn thuế, thanh toán, khuyến mãi) nếu chưa có **VDF Operations/Legal** xác nhận bằng văn bản.
3. **KHÔNG được tự ý gỡ `noteVi`** (ghi chú/cảnh báo) trên item đã duyệt — nếu cần đổi text, ghi rõ
   trong commit ai duyệt và ngày.
4. Mọi chỉnh sửa nội dung **chỉ chạm vào `/content/*.json`**, không sửa code.
5. Sau khi sửa, **chạy `node validate-content.mjs`** — phải PASS 0 lỗi.

---

## A. Checklist tiếng Trung (người bản xứ)

Soát toàn bộ câu **`status: needs_review`** + **`riskLevel: use_with_care`**:

### A1. Chữ Hán
- ☐ Đúng giản thể, không sai tự dạng.
- ☐ Đúng cách dùng (thán từ, lượng từ, ngữ điệu) cho ngữ cảnh **bán lẻ cao cấp** sân bay.
- ☐ Không có chữ hiếm/cổ khiến nhân viên mới khó học.
- ☐ Câu chào / tiễn / xin lỗi đủ lịch sự với khách Trung Quốc.

### A2. Pinyin
- ☐ **Tách âm tiết** đúng (vd "Qǐngwèn" chứ không "Qing wen").
- ☐ **Dấu thanh** đúng (vd `lǚtú yúkuài`, `èrwéimǎ`, `héduì`, `guīdìng`, `xiāngsì`, `pèihé`).
- ☐ **Chữ in hoa** hợp lý cho thương hiệu (vd `Zhīfùbǎo`, `Wēixìn`).
- ☐ Pinyin khớp với chữ Hán hiển thị (đặc biệt các câu Phase 1A.1 đã sửa, vd `sp_liquor_self_gift`).

### A3. Cách xưng hô
Đối chiếu `content/ADDRESS_TERM_POLICY.md`:
- ☐ Mặc định **您 / 先生 / 女士** trong môi trường VDF sân bay.
- ☐ Các từ **老板 / 美女 / 帅哥** giữ `riskLevel: "use_with_care"` — chỉ để nhận biết, **không**
  đưa vào câu dạy mặc định.
- ☐ Trong các bài P1 (gaps) không dùng 美女/帅哥/老板.

### A4. Độ tự nhiên
- ☐ Khách Trung Quốc đại lục nghe câu này có thấy **tự nhiên** không, hay **quá sách vở**?
- ☐ Câu có ngắn đủ cho nhân viên mới học thuộc trong vài lần lặp?
- ☐ Câu "an toàn khi chưa chắc" (`我帮您确认一下…`, `具体规定我帮您确认一下。`,
  `关于海关规定，我帮您问一下。`) có đúng mức lịch sự + an toàn không?

## B. Checklist tiếng Việt (người phụ trách nội dung VDF)

- ☐ Bản dịch tiếng Việt **đúng nghĩa**, không lệch ý câu Hán.
- ☐ Dùng **"Quý khách / anh / chị … ạ"** nhất quán cho câu nhân viên nói với khách.
- ☐ Tránh dịch máy móc (vd "请慢走" KHÔNG dịch là "đi chậm" — phải hiểu là "đi cẩn thận / chào tạm biệt"; câu này đã có `usageVi` giải thích).
- ☐ Số đếm + màu sắc + thương hiệu (Phase 1A): nghĩa Việt đúng, không sai chính tả.

## C. Checklist câu nhạy cảm (BẮT BUỘC có VDF Ops/Legal duyệt)

### C1. Giấy tờ — passport / boarding pass
Lesson `lesson_p1_passport` + các câu trong `lesson_day_one_10_phrases` liên quan:

- ☐ `sp_passport_1` "请出示您的护照和登机牌。" — VDF Ops xác nhận quy trình đề nghị giấy tờ.
- ☐ `sp_passport_7` "买免税商品需要出示登机牌。" — Legal xác nhận điều kiện này đúng.
- ☐ `sp_day1_6` (Day-One copy của passport check) — đồng bộ với trên.
- ☐ Phần dialogue `dlg_passport_1/2` — không có dữ liệu cá nhân thật.

### C2. Miễn thuế — duty-free
Lesson `lesson_p1_dutyfree`:

- ☐ `sp_dutyfree_3` "免税商品需要按规定购买。" — Legal xác nhận từ ngữ phù hợp.
- ☐ `sp_dutyfree_6` "一般需要国际航班的登机牌。" — đã làm mềm ở Phase 1B.1; xác nhận đúng.
- ☐ Dialogue giải thích miễn thuế (`dlg_dutyfree_1`) không khẳng định nội dung pháp lý quá mạnh.
- ☐ Câu "an toàn" `sp_dutyfree_4`/`8` (chuyển câu hỏi quy định/hải quan lên cấp trên) — giữ.

### C3. Thanh toán
Lesson `lesson_p1_payment`:

- ☐ `sp_payment_2` "您可以用支付宝、微信支付或者银联卡。" — VDF Ops xác nhận **đúng các phương thức
  thực sự chấp nhận tại quầy** (Alipay / WeChat / UnionPay / khác).
- ☐ `sp_payment_7` "现金是否可以使用，我帮您确认一下。" — phù hợp với chính sách tiền mặt thực tế.
- ☐ Dialogue `dlg_payment_1` không nói số tiền cụ thể bằng đơn vị tệ (đã đổi sang câu trung lập
  ở Phase 1B.1).

### C4. Giá & khuyến mãi
Lesson `lesson_p1_price`:

- ☐ Các câu `sp_price_2/3/6/8/9` (giảm giá / mua-một-tặng-một / mua đủ ưu đãi) — VDF Marketing
  xác nhận **phù hợp chương trình thực tế hiện hành** hoặc đánh dấu **không dạy mặc định**
  cho đến khi có chương trình cụ thể.
- ☐ Câu an toàn `sp_price_5` "我帮您确认一下价格。" — giữ làm fallback bắt buộc khi chưa chắc.

### C5. Hết hàng / kết thúc
Lesson `lesson_p1_oos`, `lesson_p1_closing`:

- ☐ Cách từ chối lịch sự, gợi ý thay thế — VDF Ops xác nhận khớp SOP bán hàng.
- ☐ Câu kết thúc (`sp_closing_*`) — VDF Marketing xác nhận tone phù hợp brand.

### C6. Thương hiệu (55 brand pronunciation)
- ☐ Phiên âm tên brand chính xác (đặc biệt SK-II → "S K èr" hay "S K Two" theo VDF muốn).
- ☐ 6 mục **"loại rượu chung"** (red/white wine, vodka, gin, rum, champagne) đã ghi rõ
  *không phải brand* trong `noteVi` — xác nhận giữ.

## D. Sau khi duyệt xong

1. Người duyệt ký nhận: tên, ngày, mục đã duyệt.
2. Người sửa JSON (nếu cần) ghi commit message rõ: vd
   `Approve sp_passport_1 (VDF Ops 2026-06-xx) — riskLevel safe, status from_source`.
3. **Chạy `node validate-content.mjs`** — phải PASS 0 lỗi.
4. **Chạy `npm run typecheck && npm run build`** — phải PASS.
5. Push lên repo riêng, redeploy preview.
6. Báo cho trưởng nhóm pilot: đã có vòng duyệt mới.

---

**Tóm tắt một dòng:** *Không có chữ ký người duyệt → không gỡ `needs_review` / `use_with_care` / `noteVi`.*
