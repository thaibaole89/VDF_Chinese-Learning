# Gói duyệt nội dung tiếng Hàn — VDF Sales Tutor

> **Tự động sinh** từ `lib/koreanCourse.ts` + `lib/koreanGrammar.ts`.
> KHÔNG sửa tay file này — sửa nội dung trong source rồi chạy lại `node scripts/gen-korean-review.mjs`.

- **Khoá:** Tiếng Hàn bán hàng VDF (VDF 판매 한국어) · id `korean-sales`
- **Quy mô:** 4 module · 22 bài · 156 câu · 44 tip ngữ pháp
- **Trạng thái:** *Đang chờ duyệt nội bộ về ngôn ngữ* — chưa bật cho học thật đại trà.

---

## 1. Dành cho người duyệt (bản xứ / thạo tiếng Hàn)

Mục tiêu: đảm bảo từng câu **đúng, tự nhiên, lịch sự đúng mực** cho ngữ cảnh **bán hàng miễn thuế sân bay** phục vụ khách Hàn.

**6 tiêu chí cần soát mỗi câu:**

1. **Chính tả Hangul** — đúng chính tả, đúng dấu cách, đúng từ.
2. **Phiên âm (Revised Romanization)** — khớp Hangul, nhất quán hệ RR.
3. **Mức kính ngữ** — phải là kính ngữ phục vụ khách (해요체 / 합쇼체, đuôi -세요, -시겠어요?, -드릴게요…). Không quá suồng sã, không quá cứng/cổ.
4. **Tự nhiên** — người Hàn ở quầy có thật sự nói vậy không? Có cách nói hay hơn không?
5. **Nghĩa tiếng Việt** — bản dịch VN có đúng & dễ hiểu cho nhân viên không.
6. **Phù hợp ngữ cảnh & văn hoá** — đúng quy định miễn thuế (giấy tờ, độ tuổi, hạn mức), không gây khó chịu.

**Thang mức độ lỗi:**

- 🔴 **P0 — Sai/khó chịu:** sai nghĩa, sai ngữ pháp nặng, bất lịch sự → phải sửa trước khi dạy.
- 🟡 **P1 — Chưa tự nhiên:** hiểu được nhưng không giống người bản xứ → nên sửa.
- 🟢 **P2 — Gợi ý nhỏ:** phiên âm/cách diễn đạt có thể trau chuốt → tuỳ chọn.

**Cách ghi:** điền vào **Bảng tổng hợp chỉnh sửa** ngay dưới đây (mỗi lỗi 1 dòng). Cột "Đúng?" trong mỗi bài chỉ để tick nhanh ✅ (ổn) / ✏️ (cần sửa — ghi chi tiết vào bảng tổng hợp).

## 2. Bảng tổng hợp chỉnh sửa (người duyệt điền)

| # | Bài (id) | Câu (id) | Tiêu chí | Hiện tại | Đề xuất sửa | Mức |
|---|----------|----------|----------|----------|-------------|-----|
| 1 |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |
| … |  |  |  |  |  |  |

---

## 3. Nội dung để soát (theo module → bài)

### ▌Module: Nền tảng — 기초 한국어

*Nắm vững nền tảng (chào hỏi, đại từ, số đếm, màu sắc, giờ giấc, chỉ đường) trước khi học bán hàng.*

#### 1. Chào hỏi & lịch sự — 인사 & 예절  `ko_basics_greetings`

> Mục tiêu: Chào hỏi và dùng từ lịch sự cơ bản với khách Hàn.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bg_1` | 안녕하세요. | Annyeonghaseyo. | Xin chào ạ. |  |
| 2 | `ko_bg_2` | 어서 오세요. | Eoseo oseyo. | Mời quý khách vào ạ. |  |
| 3 | `ko_bg_3` | 감사합니다. | Gamsahamnida. | Cảm ơn ạ. |  |
| 4 | `ko_bg_4` | 천만에요. | Cheonmaneyo. | Không có gì ạ. |  |
| 5 | `ko_bg_5` | 죄송합니다. | Joesonghamnida. | Em xin lỗi ạ. |  |
| 6 | `ko_bg_6` | 잠시만요. | Jamsimanyo. | Quý khách chờ một lát ạ. |  |
| 7 | `ko_bg_7` | 안녕히 가세요. | Annyeonghi gaseyo. | Quý khách đi ạ (tạm biệt). |  |

**Quiz (đáp án đúng):**

- Cảm ơn khách? → **감사합니다.**
- Chào đón khách vào cửa hàng? → **어서 오세요.**
- Tạm biệt khách (người đi)? → **안녕히 가세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Đuôi lịch sự -세요** — mẫu: `[gốc động từ] + -세요`
  - Rất nhiều câu chào/đề nghị kết thúc bằng -세요 (lịch sự): 안녕하세요 (xin chào), 가세요 (đi nhé), 오세요 (đến/vào).
  - VD: 안녕하세요. (*annyeonghaseyo*) — Xin chào ạ.
  - VD: 어서 오세요. (*eoseo oseyo*) — Mời vào ạ.
- **Cảm ơn / xin lỗi cố định**
  - Học thuộc nguyên cụm: 감사합니다 (cảm ơn), 죄송합니다 (xin lỗi), 천만에요 (không có gì), 잠시만요 (chờ một lát).
  - VD: 잠시만요. (*jamsimanyo*) — Chờ một lát ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 2. Đại từ & người — 대명사 & 사람  `ko_basics_pronouns`

> Mục tiêu: Dùng đại từ cơ bản (tôi-khiêm nhường, quý khách, cái này/kia...).

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bp_1` | 제가 도와드릴게요. | Jega dowadeurilgeyo. | Để em giúp ạ. |  |
| 2 | `ko_bp_2` | 손님, 이쪽이에요. | Sonnim, ijjogieyo. | Quý khách, lối này ạ. |  |
| 3 | `ko_bp_3` | 이것은 선물이에요. | Igeoseun seonmurieyo. | Cái này là quà ạ. |  |
| 4 | `ko_bp_4` | 저것도 보여 드릴까요? | Jeogeotdo boyeo deurilkkayo? | Đưa cái kia xem nữa nhé ạ? |  |
| 5 | `ko_bp_5` | 우리 매장이에요. | Uri maejang-ieyo. | Cửa hàng của chúng tôi ạ. |  |
| 6 | `ko_bp_6` | 이거예요, 저거예요? | Igeoyeyo, jeogeoyeyo? | Cái này hay cái kia ạ? |  |
| 7 | `ko_bp_7` | 누구 선물이에요? | Nugu seonmurieyo? | Quà cho ai ạ? |  |

**Quiz (đáp án đúng):**

- Mời giúp khách ('em/tôi giúp')? → **제가 도와드릴게요.**
- Hỏi cái này hay cái kia? → **이거예요, 저거예요?**
- Gọi 'quý khách'? → **손님**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Xưng hô khi phục vụ: 저 & 손님**
  - Tự xưng khiêm nhường là 저 (제가 = tôi/em + chủ ngữ). Gọi khách là 손님 (quý khách) thay vì 너/당신.
  - VD: 제가 도와드릴게요. (*jega dowadeurilgeyo*) — Để em giúp ạ.
- **Chỉ định: 이것 / 저것** — mẫu: `이 (này) · 그 (đó) · 저 (kia) + 것/거`
  - 이것/이거 = cái này (gần), 저것/저거 = cái kia (xa). Nói nhanh thường dùng 이거/저거.
  - VD: 이거예요, 저거예요? (*igeoyeyo, jeogeoyeyo*) — Cái này hay cái kia ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 3. Số đếm & giá tiền — 숫자 & 가격  `ko_basics_numbers`

> Mục tiêu: Đếm số (Hán-Hàn) và hỏi/nói giá, số lượng.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bn_1` | 일, 이, 삼. | Il, i, sam. | Một, hai, ba (số Hán-Hàn). |  |
| 2 | `ko_bn_2` | 십, 백, 천. | Sip, baek, cheon. | Mười, trăm, nghìn. |  |
| 3 | `ko_bn_3` | 얼마예요? | Eolmayeyo? | Bao nhiêu tiền ạ? |  |
| 4 | `ko_bn_4` | 만 원이에요. | Man wonieyo. | Mười nghìn won ạ. |  |
| 5 | `ko_bn_5` | 몇 개 드릴까요? | Myeot gae deurilkkayo? | Lấy mấy cái ạ? |  |
| 6 | `ko_bn_6` | 십 퍼센트 할인이에요. | Sip peosenteu harinieyo. | Giảm mười phần trăm ạ. |  |
| 7 | `ko_bn_7` | 원 플러스 원이에요. | Won peulleoseu wonieyo. | Mua một tặng một ạ. |  |

**Quiz (đáp án đúng):**

- Hỏi giá? → **얼마예요?**
- Hỏi khách lấy mấy cái? → **몇 개 드릴까요?**
- Báo mua một tặng một? → **원 플러스 원이에요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Số Hán-Hàn cho giá tiền** — mẫu: `일 이 삼 사 오 … + 원`
  - Giá tiền dùng số Hán-Hàn: 일(1) 이(2) 삼(3) … 십(10) 백(100) 천(1000) 만(10.000), kèm 원 (won).
  - VD: 만 원이에요. (*man wonieyo*) — Mười nghìn won ạ.
- **Hỏi giá: 얼마예요?**
  - “얼마” = bao nhiêu (tiền). Câu hỏi giá cố định: 얼마예요?
  - VD: 얼마예요? (*eolmayeyo*) — Bao nhiêu tiền ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 4. Màu sắc & mô tả — 색깔 & 묘사  `ko_basics_colors`

> Mục tiêu: Gọi tên màu sắc và mô tả sản phẩm cơ bản.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bc_1` | 빨간색, 파란색, 검은색. | Ppalgansaek, paransaek, geomeunsaek. | Đỏ, xanh dương, đen. |  |
| 2 | `ko_bc_2` | 흰색, 금색, 은색. | Huinsaek, geumsaek, eunsaek. | Trắng, vàng kim, bạc. |  |
| 3 | `ko_bc_3` | 이 색 어떠세요? | I saek eotteoseyo? | Quý khách thấy màu này thế nào ạ? |  |
| 4 | `ko_bc_4` | 다른 색도 있어요. | Dareun saekdo isseoyo. | Có màu khác nữa ạ. |  |
| 5 | `ko_bc_5` | 큰 거, 작은 거? | Keun geo, jageun geo? | To hay nhỏ ạ? |  |
| 6 | `ko_bc_6` | 이게 인기가 많아요. | Ige ingiga manayo. | Cái này được ưa chuộng ạ. |  |
| 7 | `ko_bc_7` | 품질이 좋아요. | Pumjiri joayo. | Chất lượng tốt ạ. |  |

**Quiz (đáp án đúng):**

- Hỏi khách thấy màu này thế nào? → **이 색 어떠세요?**
- Nói có màu khác? → **다른 색도 있어요.**
- Nói chất lượng tốt? → **품질이 좋아요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Màu + 색; hỏi ý: 어떠세요?** — mẫu: `[màu]색 … 어떠세요?`
  - Tên màu thường ghép với 색 (màu): 빨간색, 파란색… Hỏi khách thấy sao: 어떠세요?
  - VD: 이 색 어떠세요? (*i saek eotteoseyo*) — Màu này thế nào ạ?
- **Tính từ + 거 (cái…)** — mẫu: `[tính từ]-(으)ㄴ + 거`
  - Ghép tính từ với 거 để nói “cái …”: 큰 거 (cái to), 작은 거 (cái nhỏ).
  - VD: 큰 거, 작은 거? (*keun geo, jageun geo*) — Cái to hay cái nhỏ ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 5. Ngày giờ & thời gian — 날짜 & 시간  `ko_basics_time`

> Mục tiêu: Hỏi/nói giờ giấc, giờ mở cửa và giờ bay.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bt_1` | 지금 몇 시예요? | Jigeum myeot siyeyo? | Bây giờ mấy giờ ạ? |  |
| 2 | `ko_bt_2` | 오늘, 내일. | Oneul, naeil. | Hôm nay, ngày mai. |  |
| 3 | `ko_bt_3` | 아홉 시에 열어요. | Ahop sie yeoreoyo. | Mở cửa lúc 9 giờ ạ. |  |
| 4 | `ko_bt_4` | 열 시에 닫아요. | Yeol sie dadayo. | Đóng cửa lúc 10 giờ ạ. |  |
| 5 | `ko_bt_5` | 비행기가 세 시예요. | Bihaenggiga se siyeyo. | Chuyến bay lúc 3 giờ ạ. |  |
| 6 | `ko_bt_6` | 시간이 충분해요. | Sigani chungbunhaeyo. | Còn đủ thời gian ạ. |  |
| 7 | `ko_bt_7` | 조금 서둘러 주세요. | Jogeum seodulleo juseyo. | Quý khách nhanh lên chút ạ. |  |

**Quiz (đáp án đúng):**

- Hỏi mấy giờ? → **지금 몇 시예요?**
- Trấn an khách còn đủ giờ? → **시간이 충분해요.**
- Báo chuyến bay lúc 3 giờ? → **비행기가 세 시예요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Giờ: [số] 시 + 에** — mẫu: `[số] 시에 + [động từ]`
  - “시” = giờ; “에” = vào lúc. VD: 아홉 시에 (lúc 9 giờ). Giờ dùng số thuần Hàn (아홉=9, 열=10).
  - VD: 아홉 시에 열어요. (*ahop sie yeoreoyo*) — Mở cửa lúc 9 giờ ạ.
- **Hỏi giờ: 몇 시예요?**
  - “몇 시” = mấy giờ. 지금 몇 시예요? = Bây giờ mấy giờ?
  - VD: 지금 몇 시예요? (*jigeum myeot siyeyo*) — Bây giờ mấy giờ ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 6. Hỏi đường & vị trí — 길 안내 & 위치  `ko_basics_directions`

> Mục tiêu: Chỉ đường và nói vị trí cơ bản trong sân bay.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_bd_1` | 저쪽에 있어요. | Jeojjoge isseoyo. | Ở đằng kia ạ. |  |
| 2 | `ko_bd_2` | 쭉 가세요. | Jjuk gaseyo. | Đi thẳng ạ. |  |
| 3 | `ko_bd_3` | 왼쪽으로 가세요. | Oenjjogeuro gaseyo. | Rẽ trái ạ. |  |
| 4 | `ko_bd_4` | 게이트는 이쪽이에요. | Geiteuneun ijjogieyo. | Cổng đi lối này ạ. |  |
| 5 | `ko_bd_5` | 화장실은 왼쪽에 있어요. | Hwajangsireun oenjjoge isseoyo. | Nhà vệ sinh ở bên trái ạ. |  |
| 6 | `ko_bd_6` | 5번 게이트 근처예요. | O-beon geiteu geuncheoyeyo. | Gần cổng số 5 ạ. |  |
| 7 | `ko_bd_7` | 안내판을 따라가세요. | Annaepaneul ttaragaseyo. | Quý khách đi theo bảng chỉ dẫn ạ. |  |

**Quiz (đáp án đúng):**

- Chỉ 'đi thẳng'? → **쭉 가세요.**
- Nói cổng đi lối này? → **게이트는 이쪽이에요.**
- Bảo khách đi theo bảng chỉ dẫn? → **안내판을 따라가세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Hướng: (으)로 + 가세요** — mẫu: `[hướng](으)로 가세요`
  - “(으)로” chỉ hướng đi: 왼쪽으로 (sang trái), 오른쪽으로 (sang phải), rồi 가세요 (đi nhé).
  - VD: 왼쪽으로 가세요. (*oenjjogeuro gaseyo*) — Rẽ trái ạ.
- **Vị trí: …에 있어요** — mẫu: `[nơi chốn] + 에 있어요`
  - “에 있어요” = ở/nằm tại. VD: 왼쪽에 있어요 (ở bên trái), 저쪽에 있어요 (ở đằng kia).
  - VD: 화장실은 왼쪽에 있어요. (*hwajangsireun oenjjoge isseoyo*) — Nhà vệ sinh ở bên trái ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

### ▌Module: Tiếng Hàn sống còn tại quầy — 기본 응대 한국어

*Xử lý được một giao dịch cơ bản tại quầy bằng tiếng Hàn.*

#### 7. Chào hỏi & mời giúp đỡ — 인사 & 도움 제안  `ko_greeting_help`

> Mục tiêu: Chào khách Hàn và mở lời mời hỗ trợ lịch sự.

**Câu (8):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_g_1` | 안녕하세요, 환영합니다! | Annyeonghaseyo, hwanyeonghamnida! | Xin chào, chào mừng quý khách! |  |
| 2 | `ko_g_2` | 무엇을 도와드릴까요? | Mueoseul dowadeurilkkayo? | Em có thể giúp gì cho quý khách ạ? |  |
| 3 | `ko_g_3` | 천천히 둘러보세요. | Cheoncheonhi dulleoboseyo. | Quý khách cứ thong thả xem ạ. |  |
| 4 | `ko_g_4` | 필요하시면 불러 주세요. | Piryohasimyeon bulleo juseyo. | Cần gì quý khách cứ gọi ạ. |  |
| 5 | `ko_g_5` | 선물을 찾으세요? | Seonmureul chajeuseyo? | Quý khách tìm quà tặng ạ? |  |
| 6 | `ko_g_6` | 처음 오셨어요? | Cheoeum osyeosseoyo? | Lần đầu quý khách ghé ạ? |  |
| 7 | `ko_g_7` | 편하게 보세요. | Pyeonhage boseyo. | Quý khách xem thoải mái ạ. |  |
| 8 | `ko_g_8` | 좋은 하루 되세요. | Joeun haru doeseyo. | Chúc quý khách một ngày tốt lành. |  |

**Hội thoại — Khách bước vào quầy:**

- **NV:** 안녕하세요, 환영합니다! 무엇을 도와드릴까요? — *Annyeonghaseyo! Mueoseul dowadeurilkkayo?* — Xin chào! Em giúp gì cho quý khách ạ?
- **Khách:** 그냥 구경할게요. — *Geunyang gugyeonghalgeyo.* — Tôi chỉ xem thôi.
- **NV:** 네, 천천히 둘러보세요. — *Ne, cheoncheonhi dulleoboseyo.* — Vâng, quý khách cứ thong thả xem ạ.
- **NV:** 필요하시면 불러 주세요. — *Piryohasimyeon bulleo juseyo.* — Cần gì quý khách cứ gọi ạ.

**Đóng vai — Đóng vai: chào & mời giúp:** Khách: Khách mới vào, chưa rõ muốn gì. · NV: Chào, mời giúp, để khách thoải mái xem. · (câu bắt buộc: ko_g_1, ko_g_2, ko_g_3)

**Quiz (đáp án đúng):**

- Câu mời giúp lịch sự khi khách vào? → **무엇을 도와드릴까요?**
- Để khách thoải mái xem? → **천천히 둘러보세요.**
- Chào mừng quý khách? → **안녕하세요, 환영합니다!**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Đuôi lịch sự -(으)세요 (mời/đề nghị)** — mẫu: `[gốc động từ] + -(으)세요`
  - Thêm -세요 (gốc kết thúc nguyên âm) hoặc -으세요 (gốc kết thúc phụ âm) để mời/đề nghị lịch sự. Đây là đuôi câu hay dùng nhất khi phục vụ khách.
  - VD: 천천히 둘러보세요. (*cheoncheonhi dulleoboseyo*) — Anh/chị cứ thong thả xem ạ.
  - VD: 또 오세요. (*tto oseyo*) — Lại đến nữa nhé ạ.
- **Chào theo ngữ cảnh: 가세요 / 계세요**
  - 안녕하세요 = xin chào. Khi tiễn: nói 안녕히 가세요 (chúc người ĐI), còn người ở lại nói 안녕히 계세요.
  - VD: 안녕히 가세요. (*annyeonghi gaseyo*) — Anh/chị đi ạ (tạm biệt).

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 8. Hỏi nhu cầu của khách — 고객 요구 파악  `ko_asking_needs`

> Mục tiêu: Hỏi khách tìm gì, cho ai, tầm giá.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_n_1` | 무엇을 찾으세요? | Mueoseul chajeuseyo? | Quý khách tìm gì ạ? |  |
| 2 | `ko_n_2` | 어떤 브랜드를 좋아하세요? | Eotteon beuraendeureul joahaseyo? | Quý khách thích thương hiệu nào ạ? |  |
| 3 | `ko_n_3` | 본인용이세요, 선물용이세요? | Bonin-yong-iseyo, seonmul-yong-iseyo? | Quý khách mua dùng hay làm quà ạ? |  |
| 4 | `ko_n_4` | 예산이 어떻게 되세요? | Yesan-i eotteoke doeseyo? | Tầm giá quý khách khoảng bao nhiêu ạ? |  |
| 5 | `ko_n_5` | 누구에게 줄 선물이세요? | Nuguege jul seonmuriseyo? | Quà cho ai ạ? |  |
| 6 | `ko_n_6` | 몇 가지 보여 드릴까요? | Myeot gaji boyeo deurilkkayo? | Em đưa vài mẫu để xem nhé ạ? |  |
| 7 | `ko_n_7` | 가벼운 걸 원하세요, 진한 걸 원하세요? | Gabyeoun geol wonhaseyo, jinhan geol wonhaseyo? | Quý khách thích loại nhẹ hay đậm ạ? |  |

**Hội thoại — Hỏi nhu cầu:**

- **NV:** 무엇을 찾으세요? — *Mueoseul chajeuseyo?* — Quý khách tìm gì ạ?
- **Khách:** 향수를 찾고 있어요. — *Hyangsureul chatgo isseoyo.* — Tôi đang tìm nước hoa.
- **NV:** 본인용이세요, 선물용이세요? — *Bonin-yong-iseyo, seonmul-yong-iseyo?* — Quý khách dùng hay làm quà ạ?
- **Khách:** 선물용이에요. — *Seonmul-yong-ieyo.* — Làm quà ạ.
- **NV:** 몇 가지 보여 드릴까요? — *Myeot gaji boyeo deurilkkayo?* — Em đưa vài mẫu nhé ạ?

**Đóng vai — Đóng vai: tìm hiểu nhu cầu:** Khách: Khách muốn mua quà, chưa rõ loại. · NV: Hỏi cho ai, tầm giá, gu; rồi mời xem mẫu. · (câu bắt buộc: ko_n_1, ko_n_3, ko_n_4)

**Quiz (đáp án đúng):**

- Hỏi khách mua dùng hay làm quà? → **본인용이세요, 선물용이세요?**
- Hỏi tầm giá? → **예산이 어떻게 되세요?**
- Hỏi khách tìm gì? → **무엇을 찾으세요?**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Trợ từ tân ngữ 을/를** — mẫu: `[danh từ] + 을/를 + [động từ]`
  - Tân ngữ + 을 (khi có phụ âm cuối) / 를 (khi kết thúc nguyên âm) rồi mới đến động từ. Trật tự Hàn là: Chủ ngữ – Tân ngữ – Động từ.
  - VD: 무엇을 찾으세요? (*mueoseul chajeuseyo*) — Anh/chị tìm gì ạ?
  - VD: 향수를 찾으세요? (*hyangsureul chajeuseyo*) — Anh/chị tìm nước hoa ạ?
- **Hỏi lựa chọn A …, B …?** — mẫu: `[A](이)세요, [B](이)세요?`
  - Đưa hai lựa chọn bằng hai vế cùng đuôi (이)세요.
  - VD: 본인용이세요, 선물용이세요? (*bonin-yong-iseyo, seonmul-yong-iseyo*) — Anh/chị dùng hay làm quà ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 9. Giới thiệu & tư vấn sản phẩm — 상품 추천  `ko_recommendation`

> Mục tiêu: Gợi ý sản phẩm, nêu hàng bán chạy/mới về, mời thử.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_r_1` | 몇 가지 추천해 드릴게요. | Myeot gaji chucheonhae deurilgeyo. | Em xin giới thiệu vài mẫu ạ. |  |
| 2 | `ko_r_2` | 이건 아주 인기가 많아요. | Igeon aju ingiga manayo. | Mẫu này rất được ưa chuộng ạ. |  |
| 3 | `ko_r_3` | 이건 베스트셀러예요. | Igeon beseuteuselleoyeyo. | Đây là sản phẩm bán chạy nhất ạ. |  |
| 4 | `ko_r_4` | 신상품이에요. | Sinsangpum-ieyo. | Đây là hàng mới về ạ. |  |
| 5 | `ko_r_5` | 한번 써 보시겠어요? | Hanbeon sseo bosigesseoyo? | Quý khách thử một lần nhé ạ? |  |
| 6 | `ko_r_6` | 잘 어울리세요. | Jal eoulliseyo. | Rất hợp với quý khách ạ. |  |
| 7 | `ko_r_7` | 여러 가지 색이 있어요. | Yeoreo gaji saegi isseoyo. | Có nhiều màu ạ. |  |

**Hội thoại — Tư vấn mẫu:**

- **Khách:** 추천해 주시겠어요? — *Chucheonhae jusigesseoyo?* — Bạn gợi ý giúp được không?
- **NV:** 네, 몇 가지 추천해 드릴게요. — *Ne, myeot gaji chucheonhae deurilgeyo.* — Vâng, em giới thiệu vài mẫu ạ.
- **NV:** 이건 베스트셀러예요. 인기가 많아요. — *Igeon beseuteuselleoyeyo. Ingiga manayo.* — Mẫu này bán chạy nhất, rất được ưa chuộng ạ.
- **NV:** 한번 써 보시겠어요? — *Hanbeon sseo bosigesseoyo?* — Quý khách thử nhé ạ?

**Đóng vai — Đóng vai: gợi ý sản phẩm:** Khách: Khách nhờ tư vấn. · NV: Gợi ý mẫu bán chạy/mới, mời thử. · (câu bắt buộc: ko_r_1, ko_r_3, ko_r_5)

**Quiz (đáp án đúng):**

- Nói đây là hàng bán chạy nhất? → **이건 베스트셀러예요.**
- Mời khách thử sản phẩm? → **한번 써 보시겠어요?**
- Giới thiệu hàng mới về? → **신상품이에요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Mời thử: -아/어 보시겠어요?** — mẫu: `[động từ] + -아/어 보시겠어요?`
  - “보다 (thử)” + đuôi lịch sự -시겠어요? = mời khách thử làm gì.
  - VD: 한번 써 보시겠어요? (*hanbeon sseo bosigesseoyo*) — Anh/chị thử một lần nhé ạ?
- **Khiêm nhường 드리다 (= 주다)** — mẫu: `[động từ]해 + 드릴게요`
  - Khi mình làm gì cho khách, dùng 드리다 thay 주다 để khiêm nhường, lịch sự hơn.
  - VD: 추천해 드릴게요. (*chucheonhae deurilgeyo*) — Em xin giới thiệu ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 10. Giá & khuyến mãi — 가격 & 행사  `ko_price_promotion`

> Mục tiêu: Báo giá miễn thuế, giải thích khuyến mãi.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_p_1` | 이건 면세 가격이에요. | Igeon myeonse gagyeog-ieyo. | Đây là giá miễn thuế ạ. |  |
| 2 | `ko_p_2` | 지금 할인 중이에요. | Jigeum harin jung-ieyo. | Hiện đang giảm giá ạ. |  |
| 3 | `ko_p_3` | 원 플러스 원 행사예요. | Won peulleoseu won haengsayeyo. | Chương trình mua một tặng một ạ. |  |
| 4 | `ko_p_4` | 제가 가격을 확인해 드릴게요. | Jega gagyeogeul hwaginhae deurilgeyo. | Để em kiểm tra giá giúp ạ. |  |
| 5 | `ko_p_5` | 시내보다 저렴해요. | Sinaeboda jeoryeomhaeyo. | Rẻ hơn giá trong phố ạ. |  |
| 6 | `ko_p_6` | 이미 할인된 가격이에요. | Imi harindoen gagyeog-ieyo. | Đây đã là giá giảm rồi ạ. |  |
| 7 | `ko_p_7` | 사은품이 있어요. | Saeunpum-i isseoyo. | Có quà tặng kèm ạ. |  |

**Hội thoại — Báo giá & khuyến mãi:**

- **Khách:** 이거 얼마예요? — *Igeo eolmayeyo?* — Cái này bao nhiêu?
- **NV:** 제가 가격을 확인해 드릴게요. 면세 가격이에요. — *Jega gagyeogeul hwaginhae deurilgeyo. Myeonse gagyeog-ieyo.* — Để em kiểm tra ạ. Đây là giá miễn thuế.
- **NV:** 지금 원 플러스 원 행사예요. — *Jigeum won peulleoseu won haengsayeyo.* — Đang có mua một tặng một ạ.
- **Khách:** 좋네요. — *Jonneyo.* — Hời đấy.

**Đóng vai — Đóng vai: hỏi giá:** Khách: Khách hỏi giá & khuyến mãi. · NV: Kiểm tra giá, nêu giá miễn thuế + khuyến mãi. · (câu bắt buộc: ko_p_1, ko_p_2, ko_p_4)

**Quiz (đáp án đúng):**

- Cho khách biết đây là giá miễn thuế? → **이건 면세 가격이에요.**
- Báo mua một tặng một? → **원 플러스 원 행사예요.**
- Nói để kiểm tra giá giúp khách? → **제가 가격을 확인해 드릴게요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **“là …”: 이에요 / 예요** — mẫu: `[danh từ] + 이에요/예요`
  - Để nói “là …”: dùng 이에요 (có phụ âm cuối) / 예요 (kết thúc nguyên âm).
  - VD: 면세 가격이에요. (*myeonse gagyeog-ieyo*) — Là giá miễn thuế ạ.
- **So sánh hơn: …보다** — mẫu: `[danh từ] + 보다 + [tính từ]`
  - “보다” = hơn (so với). Đặt sau cái được đem ra so sánh.
  - VD: 시내보다 저렴해요. (*sinaeboda jeoryeomhaeyo*) — Rẻ hơn trong phố ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 11. Thanh toán & hóa đơn — 결제 & 영수증  `ko_payment_receipt`

> Mục tiêu: Hỏi cách thanh toán, xin giấy tờ, xác nhận, đưa hóa đơn.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_pay_1` | 어떻게 결제하시겠어요? | Eotteoke gyeoljehasigesseoyo? | Quý khách thanh toán bằng cách nào ạ? |  |
| 2 | `ko_pay_2` | 카드로 하시겠어요, QR로 하시겠어요? | Kadeuro hasigesseoyo, QR-ro hasigesseoyo? | Quý khách quẹt thẻ hay quét QR ạ? |  |
| 3 | `ko_pay_3` | 여권과 탑승권을 보여 주시겠어요? | Yeogwon-gwa tapseunggwon-eul boyeo jusigesseoyo? | Cho em xem hộ chiếu và thẻ lên máy bay ạ? |  |
| 4 | `ko_pay_4` | 카드를 넣어 주세요. | Kadeureul neoeo juseyo. | Quý khách cắm thẻ giúp ạ. |  |
| 5 | `ko_pay_5` | 결제가 완료되었어요. | Gyeoljega wallyodoeeosseoyo. | Thanh toán đã hoàn tất ạ. |  |
| 6 | `ko_pay_6` | 영수증 여기 있습니다. | Yeongsujeung yeogi itseumnida. | Đây là hóa đơn ạ. |  |
| 7 | `ko_pay_7` | 봉투 드릴까요? | Bongtu deurilkkayo? | Quý khách cần túi không ạ? |  |

**Hội thoại — Thanh toán:**

- **NV:** 어떻게 결제하시겠어요? — *Eotteoke gyeoljehasigesseoyo?* — Quý khách thanh toán bằng gì ạ?
- **Khách:** 카드로 할게요. — *Kadeuro halgeyo.* — Bằng thẻ.
- **NV:** 여권과 탑승권을 보여 주시겠어요? — *Yeogwon-gwa tapseunggwon-eul boyeo jusigesseoyo?* — Cho em xem hộ chiếu và thẻ lên máy bay ạ?
- **NV:** 결제가 완료되었어요. 영수증 여기 있습니다. — *Gyeoljega wallyodoeeosseoyo. Yeongsujeung yeogi itseumnida.* — Thanh toán hoàn tất. Đây là hóa đơn ạ.

**Đóng vai — Đóng vai: thu tiền:** Khách: Khách thanh toán bằng thẻ. · NV: Hỏi cách trả, xin giấy tờ, xác nhận, đưa hóa đơn. · (câu bắt buộc: ko_pay_1, ko_pay_3, ko_pay_6)

**Quiz (đáp án đúng):**

- Hỏi khách trả bằng thẻ hay QR? → **카드로 하시겠어요, QR로 하시겠어요?**
- Xác nhận thanh toán hoàn tất? → **결제가 완료되었어요.**
- Đưa hóa đơn cho khách? → **영수증 여기 있습니다.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Phương tiện/cách thức: (으)로** — mẫu: `[danh từ] + (으)로`
  - “(으)로” chỉ phương tiện/cách thức: 카드로 = bằng thẻ, QR로 = bằng QR.
  - VD: 카드로 하시겠어요? (*kadeuro hasigesseoyo*) — Anh/chị thanh toán bằng thẻ ạ?
- **Nhờ lịch sự: -아/어 주시겠어요?** — mẫu: `[động từ] + -아/어 주시겠어요?`
  - Nhờ khách làm gì một cách rất lịch sự (xin xem giấy tờ, cắm thẻ…).
  - VD: 여권을 보여 주시겠어요? (*yeogwoneul boyeo jusigesseoyo*) — Cho em xem hộ chiếu ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 12. Kết thúc lịch sự — 정중한 마무리  `ko_polite_closing`

> Mục tiêu: Cảm ơn, chúc khách và tiễn khách lịch sự.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_c_1` | 이용해 주셔서 감사합니다. | Iyonghae jusyeoseo gamsahamnida. | Cảm ơn quý khách đã mua sắm ạ. |  |
| 2 | `ko_c_2` | 좋은 여행 되세요! | Joeun yeohaeng doeseyo! | Chúc quý khách chuyến đi vui vẻ! |  |
| 3 | `ko_c_3` | 안전한 비행 되세요! | Anjeonhan bihaeng doeseyo! | Chúc quý khách bay an toàn! |  |
| 4 | `ko_c_4` | 또 오세요. | Tto oseyo. | Hẹn gặp lại ạ. |  |
| 5 | `ko_c_5` | 즐거운 쇼핑 되세요. | Jeulgeoun syoping doeseyo. | Chúc quý khách mua sắm vui vẻ ạ. |  |
| 6 | `ko_c_6` | 상품을 확인해 주세요. | Sangpum-eul hwaginhae juseyo. | Quý khách kiểm tra hàng giúp ạ. |  |
| 7 | `ko_c_7` | 안녕히 가세요. | Annyeonghi gaseyo. | Quý khách đi ạ (tạm biệt). |  |

**Hội thoại — Tiễn khách:**

- **NV:** 상품을 확인해 주세요. — *Sangpum-eul hwaginhae juseyo.* — Quý khách kiểm tra hàng giúp ạ.
- **Khách:** 감사합니다. — *Gamsahamnida.* — Cảm ơn.
- **NV:** 이용해 주셔서 감사합니다. 좋은 여행 되세요! — *Iyonghae jusyeoseo gamsahamnida. Joeun yeohaeng doeseyo!* — Cảm ơn quý khách đã mua sắm. Chúc đi vui ạ!
- **NV:** 안녕히 가세요. — *Annyeonghi gaseyo.* — Quý khách đi ạ.

**Đóng vai — Đóng vai: tiễn khách:** Khách: Khách vừa nhận hàng, chuẩn bị đi. · NV: Cảm ơn, chúc đi vui/bay an toàn, hẹn gặp lại. · (câu bắt buộc: ko_c_1, ko_c_2, ko_c_3)

**Quiz (đáp án đúng):**

- Cảm ơn khách đã mua sắm? → **이용해 주셔서 감사합니다.**
- Chúc khách bay an toàn? → **안전한 비행 되세요!**
- Hẹn gặp lại lịch sự? → **또 오세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Lời chúc: … 되세요** — mẫu: `[좋은/안전한 + danh từ] + 되세요`
  - Khung chúc rất tiện. Đổi tính từ + danh từ để chúc nhiều kiểu.
  - VD: 좋은 여행 되세요! (*joeun yeohaeng doeseyo*) — Chúc chuyến đi vui vẻ!
  - VD: 안전한 비행 되세요! (*anjeonhan bihaeng doeseyo*) — Chúc bay an toàn!
- **Cảm ơn vì…: -아/어 주셔서 감사합니다** — mẫu: `[động từ]해 주셔서 감사합니다`
  - Cấu trúc cảm ơn vì khách đã làm gì đó.
  - VD: 이용해 주셔서 감사합니다. (*iyonghae jusyeoseo gamsahamnida*) — Cảm ơn anh/chị đã mua sắm ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

### ▌Module: Tiếng Hàn theo ngành hàng — 상품별 한국어

*Tư vấn theo từng nhóm sản phẩm.*

#### 13. Bán nước hoa — 향수 판매  `ko_perfume_sales`

> Mục tiêu: Tư vấn nước hoa: nam/nữ, mùi hương, thử mùi, gói quà.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_pf_1` | 남성용 향수를 찾으세요, 여성용을 찾으세요? | Namseong-yong hyangsureul chajeuseyo, yeoseong-yong-eul chajeuseyo? | Quý khách tìm nước hoa nam hay nữ ạ? |  |
| 2 | `ko_pf_2` | 어떤 향을 좋아하세요? | Eotteon hyang-eul joahaseyo? | Quý khách thích mùi nào ạ? |  |
| 3 | `ko_pf_3` | 이건 상큼하고 가벼워요. | Igeon sangkeumhago gabyeowoyo. | Mẫu này tươi mát và nhẹ ạ. |  |
| 4 | `ko_pf_4` | 시향해 보시겠어요? | Sihyanghae bosigesseoyo? | Quý khách thử mùi nhé ạ? |  |
| 5 | `ko_pf_5` | 향이 오래가요. | Hyang-i oraegayo. | Mùi lưu lại lâu ạ. |  |
| 6 | `ko_pf_6` | 선물로 인기가 많아요. | Seonmullo ingiga manayo. | Được ưa chuộng làm quà ạ. |  |
| 7 | `ko_pf_7` | 선물 포장해 드릴까요? | Seonmul pojanghae deurilkkayo? | Quý khách có muốn gói quà không ạ? |  |

**Hội thoại — Bán nước hoa:**

- **NV:** 남성용 향수를 찾으세요, 여성용을 찾으세요? — *Namseong-yong hyangsureul chajeuseyo, yeoseong-yong-eul chajeuseyo?* — Quý khách tìm nước hoa nam hay nữ ạ?
- **Khách:** 여성용이요, 선물이에요. — *Yeoseong-yong-iyo, seonmurieyo.* — Nữ ạ, để làm quà.
- **NV:** 어떤 향을 좋아하세요? — *Eotteon hyang-eul joahaseyo?* — Cô ấy thích mùi nào ạ?
- **NV:** 이건 상큼하고 가벼워요. 시향해 보시겠어요? — *Igeon sangkeumhago gabyeowoyo. Sihyanghae bosigesseoyo?* — Mẫu này tươi nhẹ. Quý khách thử mùi nhé?

**Đóng vai — Đóng vai: tư vấn nước hoa làm quà:** Khách: Khách mua nước hoa nữ làm quà, thích mùi tươi. · NV: Hỏi nam/nữ + mùi, gợi ý mẫu tươi nhẹ, mời thử, hỏi gói quà. · (câu bắt buộc: ko_pf_1, ko_pf_2, ko_pf_4, ko_pf_7)

**Quiz (đáp án đúng):**

- Hỏi nước hoa nam hay nữ? → **남성용 향수를 찾으세요, 여성용을 찾으세요?**
- Mời khách thử mùi? → **시향해 보시겠어요?**
- Hỏi gói quà? → **선물 포장해 드릴까요?**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Hậu tố 용 (dành cho…)** — mẫu: `[danh từ] + 용`
  - Thêm 용 để nói “dành cho…”: 남성용 = cho nam, 여성용 = cho nữ, 선물용 = để làm quà.
  - VD: 남성용 향수, 여성용 향수 (*namseong-yong, yeoseong-yong*) — nước hoa nam, nước hoa nữ
- **Nối tính từ bằng -고** — mẫu: `[tính từ]-고 + [tính từ]`
  - “-고” nối hai vế (và). Dùng để tả nhiều đặc điểm cùng lúc.
  - VD: 상큼하고 가벼워요. (*sangkeumhago gabyeowoyo*) — Tươi mát và nhẹ ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 14. Bán mỹ phẩm & dưỡng da — 화장품 판매  `ko_cosmetics_sales`

> Mục tiêu: Tư vấn mỹ phẩm theo loại da, công dụng và cách dùng.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_cos_1` | 스킨케어를 찾으세요, 메이크업을 찾으세요? | Seukinkeeoreul chajeuseyo, meikeueobeul chajeuseyo? | Quý khách tìm đồ dưỡng da hay trang điểm ạ? |  |
| 2 | `ko_cos_2` | 피부 타입이 어떻게 되세요? | Pibu taibi eotteoke doeseyo? | Da của quý khách thuộc loại nào ạ? |  |
| 3 | `ko_cos_3` | 이건 건성 피부에 좋아요. | Igeon geonseong pibue joayo. | Loại này hợp với da khô ạ. |  |
| 4 | `ko_cos_4` | 수분을 주고 피부를 환하게 해요. | Subuneul jugo pibureul hwanhage haeyo. | Cấp ẩm và làm sáng da ạ. |  |
| 5 | `ko_cos_5` | 샘플 한번 써 보시겠어요? | Saempeul hanbeon sseo bosigesseoyo? | Quý khách thử mẫu thử nhé ạ? |  |
| 6 | `ko_cos_6` | 손등에 조금 발라 보세요. | Sondeunge jogeum balla boseyo. | Quý khách thử thoa một chút lên mu bàn tay ạ. |  |
| 7 | `ko_cos_7` | 이 색이 피부 톤에 잘 맞아요. | I saegi pibu tone jal majayo. | Màu này hợp với tông da của quý khách ạ. |  |

**Hội thoại — Bán dưỡng da:**

- **NV:** 스킨케어를 찾으세요, 메이크업을 찾으세요? — *Seukinkeeoreul chajeuseyo, meikeueobeul chajeuseyo?* — Quý khách tìm dưỡng da hay trang điểm ạ?
- **Khách:** 스킨케어요, 건성 피부예요. — *Seukinkeeoyo, geonseong pibuyeyo.* — Dưỡng da, da khô ạ.
- **NV:** 이건 건성 피부에 좋아요. 수분을 주고 피부를 환하게 해요. — *Igeon geonseong pibue joayo. Subuneul jugo pibureul hwanhage haeyo.* — Loại này hợp da khô, cấp ẩm và làm sáng da ạ.
- **NV:** 샘플 한번 써 보시겠어요? — *Saempeul hanbeon sseo bosigesseoyo?* — Quý khách thử mẫu nhé ạ?

**Đóng vai — Đóng vai: tư vấn dưỡng da:** Khách: Khách da khô tìm đồ dưỡng. · NV: Hỏi loại da, gợi ý sản phẩm hợp, mời thử mẫu. · (câu bắt buộc: ko_cos_1, ko_cos_2, ko_cos_3, ko_cos_5)

**Quiz (đáp án đúng):**

- Hỏi loại da của khách? → **피부 타입이 어떻게 되세요?**
- Gợi ý sản phẩm cho da khô? → **이건 건성 피부에 좋아요.**
- Mời khách thử mẫu thử? → **샘플 한번 써 보시겠어요?**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Tốt cho…: …에 좋아요** — mẫu: `[danh từ] + 에 좋아요`
  - “에” chỉ đối tượng; “좋아요” = tốt. Đổi loại da phía trước.
  - VD: 건성 피부에 좋아요. (*geonseong pibue joayo*) — Hợp với da khô ạ.
- **Mời thử thao tác: -아/어 보세요** — mẫu: `[động từ] + -아/어 보세요`
  - Mời khách thử một thao tác (thoa thử, ngửi thử…).
  - VD: 손등에 발라 보세요. (*sondeunge balla boseyo*) — Thử thoa lên mu bàn tay ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 15. Bán rượu vang & rượu mạnh — 주류 판매  `ko_wine_spirits_sales`

> Mục tiêu: Tư vấn rượu; lưu ý quy định độ tuổi & hạn mức.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_wine_1` | 와인을 찾으세요, 양주를 찾으세요? | Waineul chajeuseyo, yangjureul chajeuseyo? | Quý khách tìm rượu vang hay rượu mạnh ạ? |  |
| 2 | `ko_wine_2` | 레드 와인이 좋으세요, 화이트 와인이 좋으세요? | Redeu waini joeuseyo, hwaiteu waini joeuseyo? | Quý khách thích vang đỏ hay vang trắng ạ? |  |
| 3 | `ko_wine_3` | 이 위스키는 아주 부드러워요. | I wiseukineun aju budeureowoyo. | Loại whisky này rất êm ạ. |  |
| 4 | `ko_wine_4` | 이건 싱글 몰트예요. | Igeon singgeul molteuyeyo. | Đây là rượu single malt ạ. |  |
| 5 | `ko_wine_5` | 해산물과 잘 어울려요. | Haesanmulgwa jal eoullyeoyo. | Hợp khi dùng với hải sản ạ. |  |
| 6 | `ko_wine_6` | 나이 확인을 위해 여권을 보여 주시겠어요? | Nai hwagineul wihae yeogwoneul boyeo jusigesseoyo? | Cho em xem hộ chiếu để kiểm tra độ tuổi ạ? |  |
| 7 | `ko_wine_7` | 주류는 수량 제한이 있어요. | Juryuneun suryang jehani isseoyo. | Rượu có giới hạn số lượng ạ. |  |

**Hội thoại — Bán rượu:**

- **NV:** 와인을 찾으세요, 양주를 찾으세요? — *Waineul chajeuseyo, yangjureul chajeuseyo?* — Quý khách tìm vang hay rượu mạnh ạ?
- **Khách:** 위스키요, 선물이에요. — *Wiseukiyo, seonmurieyo.* — Whisky, để làm quà.
- **NV:** 이 위스키는 아주 부드러워요. 싱글 몰트예요. — *I wiseukineun aju budeureowoyo. Singgeul molteuyeyo.* — Loại này rất êm, là single malt ạ.
- **NV:** 나이 확인을 위해 여권을 보여 주시겠어요? — *Nai hwagineul wihae yeogwoneul boyeo jusigesseoyo?* — Cho em xem hộ chiếu để kiểm tra độ tuổi ạ?

**Đóng vai — Đóng vai: bán whisky làm quà:** Khách: Khách mua whisky làm quà. · NV: Hỏi loại, gợi ý mẫu êm, kiểm tra độ tuổi, nêu hạn mức. · (câu bắt buộc: ko_wine_1, ko_wine_3, ko_wine_6)

**Quiz (đáp án đúng):**

- Hỏi khách thích vang đỏ hay trắng? → **레드 와인이 좋으세요, 화이트 와인이 좋으세요?**
- Xin hộ chiếu để kiểm tra độ tuổi? → **나이 확인을 위해 여권을 보여 주시겠어요?**
- Nói rượu có giới hạn số lượng? → **주류는 수량 제한이 있어요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Hỏi gu: …이/가 좋으세요?** — mẫu: `[danh từ] + 이/가 좋으세요?`
  - Trợ từ chủ ngữ 이(có phụ âm cuối)/가(nguyên âm cuối) + 좋으세요? để hỏi khách thích cái nào.
  - VD: 레드 와인이 좋으세요? (*redeu waini joeuseyo*) — Anh/chị thích vang đỏ ạ?
- **Mục đích: …을/를 위해** — mẫu: `[danh từ] + 을/를 위해`
  - “위해” = để/vì (mục đích). Dùng khi giải thích lý do (kiểm tra độ tuổi…).
  - VD: 나이 확인을 위해… (*nai hwagineul wihae*) — Để kiểm tra độ tuổi…

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 16. Bán thuốc lá — 담배 판매  `ko_tobacco_sales`

> Mục tiêu: Bán thuốc lá theo quy định: độ tuổi, hạn mức, giấy tờ.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_tob_1` | 어떤 브랜드로 드릴까요? | Eotteon beuraendeuro deurilkkayo? | Quý khách lấy loại nào ạ? |  |
| 2 | `ko_tob_2` | 한 보루로 드릴까요, 한 갑으로 드릴까요? | Han boruro deurilkkayo, han gabeuro deurilkkayo? | Quý khách lấy cây hay gói lẻ ạ? |  |
| 3 | `ko_tob_3` | 여권과 탑승권을 보여 주시겠어요? | Yeogwon-gwa tapseunggwoneul boyeo jusigesseoyo? | Cho em xem hộ chiếu và thẻ lên máy bay ạ? |  |
| 4 | `ko_tob_4` | 담배는 수량 제한이 있어요. | Dambaeneun suryang jehani isseoyo. | Thuốc lá có giới hạn số lượng ạ. |  |
| 5 | `ko_tob_5` | 최대 두 보루까지예요. | Choedae du borukkajiyeyo. | Tối đa là hai cây ạ. |  |
| 6 | `ko_tob_6` | 필요하면 세관에 신고하세요. | Piryohamyeon segwane singohaseyo. | Nếu cần, quý khách khai báo ở hải quan ạ. |  |
| 7 | `ko_tob_7` | 영수증 여기 있습니다. 보관해 주세요. | Yeongsujeung yeogi itseumnida. Bogwanhae juseyo. | Đây là hóa đơn, quý khách giữ giúp ạ. |  |

**Hội thoại — Bán thuốc lá:**

- **Khách:** 한 보루 주세요. — *Han boru juseyo.* — Cho tôi một cây.
- **NV:** 여권과 탑승권을 보여 주시겠어요? — *Yeogwon-gwa tapseunggwoneul boyeo jusigesseoyo?* — Cho em xem hộ chiếu và thẻ lên máy bay ạ?
- **NV:** 담배는 수량 제한이 있어요. 최대 두 보루까지예요. — *Dambaeneun suryang jehani isseoyo. Choedae du borukkajiyeyo.* — Thuốc lá có giới hạn, tối đa hai cây ạ.
- **NV:** 영수증 여기 있습니다. 보관해 주세요. — *Yeongsujeung yeogi itseumnida. Bogwanhae juseyo.* — Đây là hóa đơn, quý khách giữ giúp ạ.

**Đóng vai — Đóng vai: bán thuốc lá theo quy định:** Khách: Khách mua thuốc lá. · NV: Xin giấy tờ, nêu giới hạn, đưa hóa đơn. · (câu bắt buộc: ko_tob_2, ko_tob_3, ko_tob_4)

**Quiz (đáp án đúng):**

- Hỏi khách lấy cây hay gói lẻ? → **한 보루로 드릴까요, 한 갑으로 드릴까요?**
- Nói thuốc lá có giới hạn? → **담배는 수량 제한이 있어요.**
- Xin giấy tờ để bán theo quy định? → **여권과 탑승권을 보여 주시겠어요?**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Hỏi đơn vị: …로 드릴까요?** — mẫu: `[số/đơn vị] + 로 드릴까요?`
  - “드릴까요?” = (em) đưa… nhé? Dùng để hỏi khách lấy đơn vị nào (cây/gói).
  - VD: 한 보루로 드릴까요? (*han boruro deurilkkayo*) — Lấy một cây nhé ạ?
- **Chủ đề + có giới hạn: 은/는 … 제한이 있어요** — mẫu: `[danh từ] + 은/는 … 제한이 있어요`
  - Trợ từ chủ đề 은/는 nêu thứ đang nói; “제한이 있어요” = có giới hạn.
  - VD: 담배는 수량 제한이 있어요. (*dambaeneun suryang jehani isseoyo*) — Thuốc lá có giới hạn số lượng ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 17. Bánh kẹo & quà tặng — 과자 & 선물  `ko_confectionery_sales`

> Mục tiêu: Tư vấn socola, bánh kẹo và quà tặng; gói quà.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_conf_1` | 초콜릿을 찾으세요, 사탕을 찾으세요? | Chokolliseul chajeuseyo, satangeul chajeuseyo? | Quý khách tìm socola hay kẹo ạ? |  |
| 2 | `ko_conf_2` | 이건 베스트셀러예요. | Igeon beseuteuselleoyeyo. | Đây là sản phẩm bán chạy nhất ạ. |  |
| 3 | `ko_conf_3` | 너무 달지 않아요. | Neomu dalji anayo. | Không quá ngọt ạ. |  |
| 4 | `ko_conf_4` | 이 박스는 선물로 좋아요. | I bakseuneun seonmullo joayo. | Hộp này rất hợp làm quà ạ. |  |
| 5 | `ko_conf_5` | 선물 포장해 드릴까요? | Seonmul pojanghae deurilkkayo? | Quý khách có muốn gói quà không ạ? |  |
| 6 | `ko_conf_6` | 유통기한을 확인해 주세요. | Yutonggihaneul hwaginhae juseyo. | Quý khách xem hạn sử dụng giúp ạ. |  |
| 7 | `ko_conf_7` | 견과류가 들어 있어요. | Gyeongwaryuga deureo isseoyo. | Có chứa các loại hạt ạ. |  |

**Hội thoại — Bán bánh kẹo:**

- **NV:** 초콜릿을 찾으세요, 사탕을 찾으세요? — *Chokolliseul chajeuseyo, satangeul chajeuseyo?* — Quý khách tìm socola hay kẹo ạ?
- **Khách:** 초콜릿이요, 선물이에요. — *Chokolliriyo, seonmurieyo.* — Socola, để làm quà.
- **NV:** 이 박스는 선물로 좋아요. 베스트셀러예요. — *I bakseuneun seonmullo joayo. Beseuteuselleoyeyo.* — Hộp này hợp làm quà, bán chạy nhất ạ.
- **NV:** 선물 포장해 드릴까요? — *Seonmul pojanghae deurilkkayo?* — Quý khách có muốn gói quà không ạ?

**Đóng vai — Đóng vai: bán socola làm quà:** Khách: Khách mua socola làm quà. · NV: Gợi ý hộp đẹp/bán chạy, hỏi gói quà, nhắc hạn dùng. · (câu bắt buộc: ko_conf_1, ko_conf_4, ko_conf_5)

**Quiz (đáp án đúng):**

- Hỏi khách tìm socola hay kẹo? → **초콜릿을 찾으세요, 사탕을 찾으세요?**
- Hỏi khách có gói quà không? → **선물 포장해 드릴까요?**
- Nhắc khách xem hạn sử dụng? → **유통기한을 확인해 주세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Không quá…: 너무 …-지 않아요** — mẫu: `너무 + [tính từ]-지 않아요`
  - “-지 않아요” là cách phủ định lịch sự; “너무” = quá. Ghép lại = “không quá…”.
  - VD: 너무 달지 않아요. (*neomu dalji anayo*) — Không quá ngọt ạ.
- **Hợp để…: …(으)로 좋아요** — mẫu: `[danh từ] + (으)로 좋아요`
  - Nói cái gì đó hợp với mục đích nào: 선물로 좋아요 = hợp làm quà.
  - VD: 선물로 좋아요. (*seonmullo joayo*) — Hợp làm quà ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

### ▌Module: Tiếng Hàn sân bay / miễn thuế — 공항 / 면세 한국어

*Xử lý ngữ cảnh sân bay & miễn thuế.*

#### 18. Thẻ lên máy bay & hộ chiếu — 탑승권 & 여권  `ko_boarding_passport`

> Mục tiêu: Xin và kiểm tra hộ chiếu, thẻ lên máy bay khi bán hàng miễn thuế.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_board_1` | 탑승권을 보여 주시겠어요? | Tapseunggwoneul boyeo jusigesseoyo? | Cho em xem thẻ lên máy bay ạ? |  |
| 2 | `ko_board_2` | 여권도 보여 주시겠어요? | Yeogwondo boyeo jusigesseoyo? | Cho em xem hộ chiếu nữa ạ? |  |
| 3 | `ko_board_3` | 항공편 번호가 어떻게 되세요? | Hanggongpyeon beonhoga eotteoke doeseyo? | Số chuyến bay của quý khách là gì ạ? |  |
| 4 | `ko_board_4` | 어디로 가세요? | Eodiro gaseyo? | Quý khách bay đi đâu ạ? |  |
| 5 | `ko_board_5` | 탑승권을 스캔하겠습니다. | Tapseunggwoneul seukaenhagesseumnida. | Em sẽ quét thẻ lên máy bay ạ. |  |
| 6 | `ko_board_6` | 협조해 주셔서 감사합니다. | Hyeopjohae jusyeoseo gamsahamnida. | Cảm ơn quý khách đã hợp tác ạ. |  |
| 7 | `ko_board_7` | 여권 여기 있습니다. 잘 보관하세요. | Yeogwon yeogi itseumnida. Jal bogwanhaseyo. | Đây là hộ chiếu, quý khách giữ cẩn thận ạ. |  |

**Hội thoại — Kiểm tra giấy tờ:**

- **NV:** 탑승권을 보여 주시겠어요? — *Tapseunggwoneul boyeo jusigesseoyo?* — Cho em xem thẻ lên máy bay ạ?
- **Khách:** 여기요. — *Yeogiyo.* — Đây ạ.
- **NV:** 여권도 보여 주시겠어요? 어디로 가세요? — *Yeogwondo boyeo jusigesseoyo? Eodiro gaseyo?* — Cho em xem hộ chiếu nữa ạ? Quý khách đi đâu?
- **Khách:** 서울로 가요. — *Seoullo gayo.* — Đi Seoul.
- **NV:** 감사합니다. 여권 여기 있습니다. 잘 보관하세요. — *Gamsahamnida. Yeogwon yeogi itseumnida. Jal bogwanhaseyo.* — Cảm ơn ạ. Đây là hộ chiếu, quý khách giữ cẩn thận.

**Đóng vai — Đóng vai: xin giấy tờ:** Khách: Khách mua hàng miễn thuế. · NV: Xin thẻ lên máy bay + hộ chiếu, hỏi điểm đến, trả lại giấy tờ. · (câu bắt buộc: ko_board_1, ko_board_2, ko_board_7)

**Quiz (đáp án đúng):**

- Xin thẻ lên máy bay? → **탑승권을 보여 주시겠어요?**
- Hỏi số chuyến bay? → **항공편 번호가 어떻게 되세요?**
- Trả hộ chiếu và dặn giữ cẩn thận? → **여권 여기 있습니다. 잘 보관하세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Xin xem giấy tờ: …을/를 보여 주시겠어요?** — mẫu: `[giấy tờ] + 을/를 보여 주시겠어요?`
  - Khung xin xem giấy tờ rất lịch sự. Đổi danh từ giấy tờ phía trước.
  - VD: 탑승권을 보여 주시겠어요? (*tapseunggwoneul boyeo jusigesseoyo*) — Cho em xem thẻ lên máy bay ạ?
- **Hỏi thông tin lịch sự: …이/가 어떻게 되세요?** — mẫu: `[danh từ] + 이/가 어떻게 되세요?`
  - Cách hỏi thông tin (tên, số chuyến bay…) rất lịch sự, nhẹ nhàng.
  - VD: 항공편 번호가 어떻게 되세요? (*hanggongpyeon beonhoga eotteoke doeseyo*) — Số chuyến bay của anh/chị là gì ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 19. Quy định miễn thuế cơ bản — 면세 규정 기본  `ko_duty_free_allowance`

> Mục tiêu: Giải thích cơ bản điều kiện & hạn mức mua hàng miễn thuế.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_df_1` | 여기는 면세점이에요. | Yeogineun myeonsejeom-ieyo. | Đây là cửa hàng miễn thuế ạ. |  |
| 2 | `ko_df_2` | 국제선 탑승권이 필요해요. | Gukjeseon tapseunggwon-i piryohaeyo. | Cần thẻ lên máy bay quốc tế ạ. |  |
| 3 | `ko_df_3` | 일부 상품은 수량 제한이 있어요. | Ilbu sangpum-eun suryang jehan-i isseoyo. | Một số sản phẩm có giới hạn số lượng ạ. |  |
| 4 | `ko_df_4` | 가격은 면세예요. | Gagyeog-eun myeonseyeyo. | Giá là giá miễn thuế ạ. |  |
| 5 | `ko_df_5` | 규정을 확인해 드릴게요. | Gyujeong-eul hwaginhae deurilgeyo. | Để em kiểm tra quy định giúp ạ. |  |
| 6 | `ko_df_6` | 세관에 신고해야 할 수도 있어요. | Segwan-e singohaeya hal sudo isseoyo. | Quý khách có thể phải khai báo ở hải quan ạ. |  |
| 7 | `ko_df_7` | 탑승할 때까지 영수증을 보관하세요. | Tapseunghal ttaekkaji yeongsujeung-eul bogwanhaseyo. | Giữ hóa đơn đến khi lên máy bay ạ. |  |

**Hội thoại — Hỏi về miễn thuế:**

- **Khách:** 정말 면세예요? — *Jeongmal myeonseyeyo?* — Miễn thuế thật à?
- **NV:** 네, 여기는 면세점이에요. 가격은 면세예요. — *Ne, yeogineun myeonsejeom-ieyo. Gagyeog-eun myeonseyeyo.* — Vâng, đây là cửa hàng miễn thuế, giá miễn thuế ạ.
- **NV:** 국제선 탑승권이 필요해요. — *Gukjeseon tapseunggwon-i piryohaeyo.* — Cần thẻ lên máy bay quốc tế ạ.
- **Khách:** 수량 제한이 있어요? — *Suryang jehan-i isseoyo?* — Có giới hạn số lượng không?
- **NV:** 일부 상품은 제한이 있어요. 규정을 확인해 드릴게요. — *Ilbu sangpum-eun jehan-i isseoyo. Gyujeong-eul hwaginhae deurilgeyo.* — Một số mặt hàng có hạn mức. Để em kiểm tra ạ.

**Đóng vai — Đóng vai: giải thích miễn thuế:** Khách: Khách hỏi có thật miễn thuế & có giới hạn không. · NV: Xác nhận miễn thuế, cần boarding pass quốc tế, nêu hạn mức + sẽ kiểm tra. · (câu bắt buộc: ko_df_1, ko_df_2, ko_df_3, ko_df_5)

**Quiz (đáp án đúng):**

- Cần gì để mua miễn thuế? → **국제선 탑승권이 필요해요.**
- Nói một số sản phẩm có giới hạn? → **일부 상품은 수량 제한이 있어요.**
- Đề nghị giữ hóa đơn đến khi lên máy bay? → **탑승할 때까지 영수증을 보관하세요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Cần…: …이/가 필요해요** — mẫu: `[danh từ] + 이/가 필요해요`
  - “필요해요” = cần. Trợ từ chủ ngữ 이/가 đứng trước.
  - VD: 탑승권이 필요해요. (*tapseunggwoni piryohaeyo*) — Cần thẻ lên máy bay ạ.
- **Có thể phải…: -ㄹ/을 수도 있어요** — mẫu: `[động từ] + -ㄹ/을 수도 있어요`
  - Diễn đạt khả năng “có thể phải/sẽ…”. Dùng khi chưa chắc về quy định.
  - VD: 신고해야 할 수도 있어요. (*singohaeya hal sudo isseoyo*) — Có thể phải khai báo ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 20. Cửa khởi hành & giờ bay — 탑승구 & 시간  `ko_gate_flight_timing`

> Mục tiêu: Hỏi/đáp về cửa, giờ bay; nhắc khách kịp giờ.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_gate_1` | 비행기 시간이 몇 시예요? | Bihaenggi sigani myeot siyeyo? | Chuyến bay của quý khách mấy giờ ạ? |  |
| 2 | `ko_gate_2` | 몇 번 게이트에서 출발하세요? | Myeot beon geiteueseo chulbalhaseyo? | Quý khách khởi hành ở cửa số mấy ạ? |  |
| 3 | `ko_gate_3` | 게이트는 가까워요. | Geiteuneun gakkawoyo. | Cửa ở gần thôi ạ. |  |
| 4 | `ko_gate_4` | 곧 탑승이 시작돼요. 늦지 마세요. | Got tapseungi sijakdwaeyo. Neutji maseyo. | Sắp tới giờ lên máy bay, quý khách đừng trễ ạ. |  |
| 5 | `ko_gate_5` | 아직 시간이 충분해요. | Ajik sigani chungbunhaeyo. | Vẫn còn đủ thời gian ạ. |  |
| 6 | `ko_gate_6` | 항공편 정보를 확인해 드릴게요. | Hanggongpyeon jeongboreul hwaginhae deurilgeyo. | Để em kiểm tra thông tin chuyến bay ạ. |  |
| 7 | `ko_gate_7` | 즐거운 여행 되세요! | Jeulgeoun yeohaeng doeseyo! | Chúc quý khách hành trình vui vẻ! |  |

**Hội thoại — Hỏi giờ bay & cửa:**

- **Khách:** 비행기를 놓칠까요? — *Bihaenggireul nochilkkayo?* — Tôi có bị trễ chuyến không?
- **NV:** 비행기 시간이 몇 시예요? 몇 번 게이트에서 출발하세요? — *Bihaenggi sigani myeot siyeyo? Myeot beon geiteueseo chulbalhaseyo?* — Chuyến mấy giờ ạ? Cửa số mấy?
- **Khách:** 세 시, 12번 게이트요. — *Se si, sibibeon geiteuyo.* — Ba giờ, cửa số 12.
- **NV:** 아직 시간이 충분해요. 게이트는 가까워요. — *Ajik sigani chungbunhaeyo. Geiteuneun gakkawoyo.* — Quý khách còn đủ giờ, cửa ở gần thôi ạ.

**Đóng vai — Đóng vai: trấn an khách lo trễ giờ:** Khách: Khách lo bị trễ chuyến. · NV: Hỏi giờ/cửa, trấn an còn đủ giờ, chỉ đường ngắn gọn. · (câu bắt buộc: ko_gate_1, ko_gate_2, ko_gate_5)

**Quiz (đáp án đúng):**

- Hỏi giờ chuyến bay? → **비행기 시간이 몇 시예요?**
- Hỏi cửa khởi hành? → **몇 번 게이트에서 출발하세요?**
- Trấn an khách còn đủ giờ? → **아직 시간이 충분해요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Hỏi giờ: …이/가 몇 시예요?** — mẫu: `[danh từ] + 이/가 몇 시예요?`
  - “몇 시” = mấy giờ. Hỏi thời điểm của chuyến bay…
  - VD: 비행기 시간이 몇 시예요? (*bihaenggi sigani myeot siyeyo*) — Chuyến bay mấy giờ ạ?
- **Vẫn còn…: 아직 …** — mẫu: `아직 + [danh từ]이/가 + [tính từ]`
  - “아직” = vẫn/còn. Dùng để trấn an khách còn đủ thời gian.
  - VD: 아직 시간이 충분해요. (*ajik sigani chungbunhaeyo*) — Vẫn còn đủ thời gian ạ.

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 21. Hết hàng & gợi ý thay thế — 품절 & 대체  `ko_stock_alternative`

> Mục tiêu: Báo hết hàng lịch sự và gợi ý sản phẩm thay thế.

**Câu (7):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_stock_1` | 죄송합니다, 이건 품절이에요. | Joesonghamnida, igeon pumjeorieyo. | Xin lỗi, mẫu này đã hết hàng ạ. |  |
| 2 | `ko_stock_2` | 지금은 다 팔렸어요. | Jigeumeun da pallyeosseoyo. | Hiện tại đã bán hết ạ. |  |
| 3 | `ko_stock_3` | 비슷한 상품을 추천해 드릴까요? | Biseuthan sangpumeul chucheonhae deurilkkayo? | Em gợi ý sản phẩm tương tự được không ạ? |  |
| 4 | `ko_stock_4` | 이건 아주 비슷해요. | Igeon aju biseuthaeyo. | Mẫu này rất giống ạ. |  |
| 5 | `ko_stock_5` | 같은 브랜드예요. | Gateun beuraendeuyeyo. | Cùng một thương hiệu ạ. |  |
| 6 | `ko_stock_6` | 한번 보시겠어요? | Hanbeon bosigesseoyo? | Quý khách xem thử không ạ? |  |
| 7 | `ko_stock_7` | 재고를 확인해 드릴게요. | Jaegoreul hwaginhae deurilgeyo. | Để em kiểm tra hàng giúp quý khách ạ. |  |

**Hội thoại — Hết hàng & thay thế:**

- **Khách:** 이거 있어요? — *Igeo isseoyo?* — Có loại này không?
- **NV:** 죄송합니다, 이건 품절이에요. — *Joesonghamnida, igeon pumjeorieyo.* — Xin lỗi, mẫu này hết hàng ạ.
- **NV:** 비슷한 상품을 추천해 드릴까요? 이건 아주 비슷해요. 같은 브랜드예요. — *Biseuthan sangpumeul chucheonhae deurilkkayo? Igeon aju biseuthaeyo. Gateun beuraendeuyeyo.* — Em gợi ý mẫu tương tự nhé? Mẫu này rất giống, cùng hãng ạ.
- **Khách:** 네, 보여 주세요. — *Ne, boyeo juseyo.* — Được, cho tôi xem.

**Đóng vai — Đóng vai: hết hàng, gợi ý thay thế:** Khách: Khách hỏi mẫu đã hết. · NV: Xin lỗi báo hết, gợi ý mẫu tương tự cùng hãng, mời xem. · (câu bắt buộc: ko_stock_1, ko_stock_3, ko_stock_6)

**Quiz (đáp án đúng):**

- Báo hết hàng lịch sự? → **죄송합니다, 이건 품절이에요.**
- Gợi ý sản phẩm tương tự? → **비슷한 상품을 추천해 드릴까요?**
- Nói cùng một thương hiệu? → **같은 브랜드예요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Xin lỗi + tình huống: 죄송합니다, …** — mẫu: `죄송합니다, + [câu]`
  - Mở đầu bằng 죄송합니다 khi báo tin không vui (hết hàng). 품절이에요 = hết hàng rồi.
  - VD: 죄송합니다, 품절이에요. (*joesonghamnida, pumjeorieyo*) — Xin lỗi, đã hết hàng ạ.
- **Đề nghị: …해 드릴까요?** — mẫu: `[động từ]해 드릴까요?`
  - Hỏi khách có muốn mình làm gì cho không (gợi ý mẫu khác…).
  - VD: 비슷한 상품을 추천해 드릴까요? (*biseuthan sangpumeul chucheonhae deurilkkayo*) — Em gợi ý mẫu tương tự nhé ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

#### 22. Hoàn tiền & sự cố thanh toán — 환불 & 결제 문제  `ko_refund_escalation`

> Mục tiêu: Xử lý lịch sự sự cố thanh toán/đổi trả; biết khi nào gọi quản lý.

**Câu (8):**

| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |
|---|----|--------|---------------|------------|-------|
| 1 | `ko_refund_1` | 불편을 드려 죄송합니다. | Bulpyeoneul deuryeo joesonghamnida. | Em xin lỗi vì sự bất tiện ạ. |  |
| 2 | `ko_refund_2` | 카드가 승인되지 않았어요. | Kadeuga seungindoeji anasseoyo. | Thẻ của quý khách không được chấp nhận ạ. |  |
| 3 | `ko_refund_3` | 다른 카드로 해 보시겠어요? | Dareun kadeuro hae bosigesseoyo? | Quý khách thử thẻ khác được không ạ? |  |
| 4 | `ko_refund_4` | QR로 결제하시겠어요? | QR-ro gyeoljehasigesseoyo? | Quý khách quét QR thay thế nhé ạ? |  |
| 5 | `ko_refund_5` | 영수증을 가지고 계세요? | Yeongsujeungeul gajigo gyeseyo? | Quý khách có giữ hóa đơn không ạ? |  |
| 6 | `ko_refund_6` | 환불은 매장 규정을 따라요. | Hwanbureun maejang gyujeongeul ttarayo. | Việc hoàn tiền theo quy định cửa hàng ạ. |  |
| 7 | `ko_refund_7` | 매니저를 불러 드릴게요. | Maenijeoreul bulleo deurilgeyo. | Để em gọi quản lý hỗ trợ ạ. |  |
| 8 | `ko_refund_8` | 잠시만 기다려 주세요. | Jamsiman gidaryeo juseyo. | Quý khách vui lòng đợi một lát ạ. |  |

**Hội thoại — Sự cố thanh toán:**

- **NV:** 죄송합니다, 카드가 승인되지 않았어요. — *Joesonghamnida, kadeuga seungindoeji anasseoyo.* — Xin lỗi, thẻ của quý khách không được chấp nhận ạ.
- **NV:** 다른 카드로 해 보시겠어요? 아니면 QR로 결제하시겠어요? — *Dareun kadeuro hae bosigesseoyo? Animyeon QR-ro gyeoljehasigesseoyo?* — Quý khách thử thẻ khác, hoặc quét QR nhé?
- **Khách:** 여전히 안 돼요. — *Yeojeonhi an dwaeyo.* — Vẫn không được.
- **NV:** 불편을 드려 죄송합니다. 매니저를 불러 드릴게요. 잠시만 기다려 주세요. — *Bulpyeoneul deuryeo joesonghamnida. Maenijeoreul bulleo deurilgeyo. Jamsiman gidaryeo juseyo.* — Em xin lỗi vì bất tiện. Để em gọi quản lý hỗ trợ, quý khách đợi một lát ạ.

**Đóng vai — Đóng vai: thẻ bị từ chối:** Khách: Thẻ của khách bị từ chối. · NV: Xin lỗi, đề nghị thẻ khác/QR; nếu không được thì mời quản lý. · (câu bắt buộc: ko_refund_2, ko_refund_3, ko_refund_7)

**Quiz (đáp án đúng):**

- Báo thẻ không được chấp nhận? → **카드가 승인되지 않았어요.**
- Đề nghị thanh toán bằng QR thay thế? → **QR로 결제하시겠어요?**
- Khi vượt thẩm quyền, nên nói gì? → **매니저를 불러 드릴게요.**

**Ngữ pháp / cách ghép câu (2 tip):**

- **Phủ định quá khứ: -지 않았어요** — mẫu: `[động từ] + -지 않았어요`
  - Phủ định lịch sự ở quá khứ. 승인되지 않았어요 = đã không được chấp nhận.
  - VD: 카드가 승인되지 않았어요. (*kadeuga seungindoeji anasseoyo*) — Thẻ không được chấp nhận ạ.
- **Đề nghị cái khác: 다른 …로 해 보시겠어요?** — mẫu: `다른 + [danh từ] + 로 해 보시겠어요?`
  - “다른” = khác. Đề nghị khách thử cách/thẻ khác.
  - VD: 다른 카드로 해 보시겠어요? (*dareun kadeuro hae bosigesseoyo*) — Anh/chị thử thẻ khác nhé ạ?

> ✍️ Ghi chú người duyệt cho bài này:

---

## 4. Xác nhận hoàn tất duyệt

| | Họ tên | Vai trò | Ngày | Kết luận |
|---|--------|---------|------|----------|
| Người duyệt ngôn ngữ |  |  |  | ☐ Đạt ☐ Cần sửa lại |
| Người phê duyệt (PO/Ops) |  |  |  | ☐ Đồng ý đưa vào pilot |

> Sau khi duyệt xong: chuyển các dòng trong **Bảng tổng hợp chỉnh sửa** cho team kỹ thuật cập nhật vào `lib/koreanCourse.ts` / `lib/koreanGrammar.ts`, rồi chạy lại script này để ra bản mới.
