# Native-Speaker Review Checklist — VDF Chinese Sales Tutor

**Cho:** Người bản xứ tiếng Trung (ưu tiên người quen ngữ cảnh bán lẻ) rà soát trước Phase 1B.
**Cách dùng:** Tick từng mục; nếu cần sửa, ghi câu đúng vào cột "Sửa / Ghi chú".
Sau khi duyệt, các mục `needs_review` sẽ được chuyển sang `from_source` (đã xác nhận) trong JSON.

- Người duyệt: ____________________   Ngày: ____________

---

## A. 6 câu đã chỉnh tiếng Trung (`status: needs_review`) — CẦN DUYỆT KỸ

Xác nhận câu "Sau" nghe tự nhiên, đúng ngữ cảnh bán hàng, **không đổi ý**.

| ☐ | ID | Trước (slide) | Sau (đề xuất) | OK? | Sửa / Ghi chú |
|---|---|---|---|---|---|
| ☐ | `sp_ask_what_product` | 您想看什么？ | 请问您想看什么产品？ | | |
| ☐ | `sp_recommend` | 我可以给您推荐 | 我可以给您推荐几款。 | | |
| ☐ | `sp_bestseller_basic` | 这个很好卖 | 这款很好卖。 | | |
| ☐ | `sp_bestseller_strong` | 这个很好卖 | 这款是我们的畅销产品。 | | |
| ☐ | `sp_payment_checkout` | 我帮您结账 | 我来帮您结账。 | | |
| ☐ | `sp_liquor_self_gift` | 您自己用还是送人？ *(Hán slide thiếu 是, pinyin có shì)* | 您是自己用还是送人？ | | |

> Mục cuối (`sp_liquor_self_gift`) là mục **pinyin/Hán lệch nhau trên slide**: chữ Hán thiếu 是 nhưng
> pinyin lại có "shì". Phase 1A.1 đã chọn câu đầy đủ tự nhiên `您是自己用还是送人？` (cấu trúc 是…还是…).
> → Cần xác nhận đây là câu mong muốn.

---

## B. Chính sách xưng hô (Address-Term Policy)

Xem `content/ADDRESS_TERM_POLICY.md`. Xác nhận chính sách cho bán lẻ cao cấp sân bay:

- ☐ Đồng ý **mặc định 您 / 先生 / 女士** (`riskLevel: safe`).
- ☐ Đồng ý **để 老板 / 美女 / 帅哥 ở mức `use_with_care`** — chỉ để nhận biết & dùng tùy chọn, không
  dạy mặc định.
- ☐ (Nếu khác) Chính sách VDF mong muốn: ____________________________________________

---

## C. Phát âm SK-II

- ☐ Xác nhận cách dạy đọc SK-II: hiện để pinyin **"S K èr"**, `audioText: "SK二"` (máy TTS đọc được).
- Lựa chọn khác khách hay dùng: "S K Two". → VDF muốn dạy cách nào? ____________________

---

## D. Ảnh đại từ/xưng hô độ phân giải thấp (Screenshots 2–5)

Các bảng này transcribe từ ảnh chụp màn hình hơi mờ — soát lại **dấu thanh pinyin** & chữ Hán:

- ☐ `Screenshot (2).png` — đại từ nhân xưng (我 / 你 / 他·她 / 我们 / 你们 / 他们·她们)
- ☐ `Screenshot (3).png` — từ xưng hô (您 / 先生 / 女士 / 老板 / 美女 / 帅哥)
- ☐ `Screenshot (4).png` — chỉ định (这 / 那 / 这里 / 那里 / 这些 / 那些)
- ☐ `Screenshot (5).png` — nghi vấn (谁 / 什么 / 哪 / 哪儿·哪里 / 怎么 / 怎么样 / 几 / 多少 / 为什么)

---

## E. Spot-check phát âm thương hiệu (55 brands)

Kiểm tra ngẫu nhiên pinyin/Hán phiên âm, nhất là tên dài/khó:

- ☐ Mỹ phẩm (17): Lancôme 兰蔻, Estée Lauder 雅诗兰黛, Givenchy 纪梵希, La Mer 海蓝之谜, SK-II…
- ☐ Rượu (quốc tế + Trung Quốc): Johnnie Walker, Hennessy, Moutai 茅台, Wuliangye 五粮液…
- ☐ Thuốc lá (quốc tế + Trung Quốc): Marlboro, Chunghwa 中华, Panda 熊猫…
- ☐ Xác nhận **6 "loại rượu chung"** (red/white wine, vodka, gin, rum, champagne) được hiểu là
  **tên loại, không phải brand** (đã ghi `noteVi`).

---

## F. Các mục lệch pinyin/Hán & dữ liệu cần đối chiếu ảnh gốc

- ☐ `sp_liquor_self_gift` — lệch 是 (xem mục A, đã xử lý, cần xác nhận).
- ☐ Lượng từ rượu/thuốc/bánh kẹo — slide đánh số nhảy cóc **1,2,3,4,6,7,9** (thiếu 5, 8).
  Đối chiếu ảnh `lượng từ rượu, thuốc,c hoco.jpg` xem có sót lượng từ nào không.
- ☐ Số đếm & màu sắc — nghĩa tiếng Việt do Phase 1A thêm (slide gốc chỉ có tiếng Anh); soát lại
  nghĩa, nhất là các màu ghép.

---

## G. Kết luận

- ☐ Tất cả mục A–F đã duyệt.
- Số câu cần sửa lại: ______
- Ghi chú chung: _______________________________________________________________

*Sau khi duyệt xong, gửi lại file này (đã tick + ghi chú) để cập nhật JSON và chốt Phase 1A trước khi sang Phase 1B.*
