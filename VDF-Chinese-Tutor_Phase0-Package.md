# VDF Chinese Sales Tutor — Phase 0 Analysis Package

> **For the reviewer (e.g. ChatGPT):** This is a self-contained package of a Phase 0 (read-and-analyze-only) review for a mobile web app that teaches shop-floor Mandarin to Vietnamese duty-free sales staff. The original teaching materials are **images and videos only** — this document contains the **full text transcription** of every image slide so you can verify the analysis and schema without seeing the files. No app code has been written yet. **What we want from your review is listed in §10.**
>
> Generated 2026-05-29.

---

## Table of contents
1. Project brief (the goal)
2. Source-material reality
3. File inventory
4. **Full content transcription** (verbatim from every slide)
5. Content summary
6. Gap analysis
7. Proposed content taxonomy
8. Proposed JSON / TypeScript schema
9. Confirmed decisions & Phase 1 plan
10. Questions for the reviewer
11. Transcription notes & data-quality flags

---

## 1. Project brief (the goal)

A **mobile-first web app** for **Vietnam Duty Free (VDF)** airport sales associates to learn practical Mandarin fast, for real counter situations: greeting Chinese customers, asking needs, introducing products, explaining promotions, asking for passport/boarding pass, explaining duty-free limits, handling payment, upselling, answering common questions, closing politely.

- **Not** general Chinese learning. **Not** for tourists. **Not** business negotiation.
- **Primary user:** Vietnamese sales associate at VDF airport shops. **Device:** mobile phone.
- **Languages:** App UI = Vietnamese. Learning content = Simplified Hanzi + pinyin + Vietnamese meaning. English only where useful (product/brand names, airport retail).
- **Learning style:** bite-sized, ~5 minutes per session, immediately usable counter phrases, simple/polite/natural Mandarin, no grammar-heavy academic approach.
- **Tech direction (v1):** Next.js App Router, TypeScript, Tailwind CSS, static JSON content, localStorage for progress, deploy to Vercel, no database, no auth, no paid API, Web Speech API `SpeechSynthesis` for zh-CN pronunciation.

---

## 2. Source-material reality

**Every teaching asset is a video or an image. There are zero text documents (no docx/pdf/xlsx/txt/md).**

- **29 images** — well-structured bilingual slides (Hanzi + pinyin + Vietnamese + per-word gloss). Fully transcribable; all transcribed in §4.
- **9 videos** (~1.23 GB total) — narrated recordings of the same slide decks. The narration audio is the only asset that could not be extracted to text (no `ffmpeg` available; video audio is not text-parseable). Decision taken: videos serve as a human-pronunciation reference only; the app will use Web Speech TTS.
- Image filenames are auto-generated (`z78….jpg`) with no descriptive meaning; §3 maps each to its real content.

---

## 3. File inventory

38 files total: 29 images (parseable) + 9 videos (not parseable as text).

| Folder | File | Format | Size | Content | Parseable? |
|---|---|---|---|---|---|
| các câu giao tiếp cơ bản | NHỮNG CÂU GIAO TIẾP CƠ BẢN….mov | mov | 405 MB | Narrated core sales-flow | No (audio) |
| các câu giao tiếp cơ bản | z7760840847694….jpg | jpg | 170 KB | HỎI NHU CẦU (ask needs) | ✅ |
| các câu giao tiếp cơ bản | z7760840848950….jpg | jpg | 197 KB | CHÀO HỎI (greeting) | ✅ |
| các câu giao tiếp cơ bản | z7760840850688….jpg | jpg | 145 KB | THANH TOÁN (payment) | ✅ |
| các câu giao tiếp cơ bản | z7760840851491….jpg | jpg | 176 KB | GIỚI THIỆU–HỖ TRỢ | ✅ |
| các câu giao tiếp cơ bản | z7760840851831….jpg | jpg | 180 KB | XỬ LÝ TÌNH HUỐNG | ✅ |
| Đại từ nhân xưng, chỉ định, nghi vấn | Đại từ nhân xưng….mov | mov | 167 MB | Narrated pronoun lesson | No |
| Đại từ nhân xưng, chỉ định, nghi vấn | Screenshot (2).png | png | 434 KB | Personal pronouns | ✅ (low-fi) |
| Đại từ nhân xưng, chỉ định, nghi vấn | Screenshot (3).png | png | 355 KB | Customer address terms | ✅ (low-fi) |
| Đại từ nhân xưng, chỉ định, nghi vấn | Screenshot (4).png | png | 508 KB | Demonstratives | ✅ (low-fi) |
| Đại từ nhân xưng, chỉ định, nghi vấn | Screenshot (5).png | png | 541 KB | Interrogatives | ✅ (low-fi) |
| Các câu giao tiếp…mỹ phẩm | Basic Beauty Conversation.MP4 | mp4 | 208 MB | Narrated cosmetics convo | No |
| Các câu giao tiếp…mỹ phẩm | z7804165127269….jpg | jpg | 376 KB | Perfume (sentences 1–2) | ✅ |
| Các câu giao tiếp…mỹ phẩm | z7804165130446….jpg | jpg | 353 KB | Perfume (sentences 3–6) | ✅ |
| Các câu giao tiếp…mỹ phẩm | z7804165139836….jpg | jpg | 340 KB | Skincare (sentences 4–5) | ✅ |
| Các câu giao tiếp…mỹ phẩm | z7804165145891….jpg | jpg | 445 KB | Skincare (sentences 1–3) | ✅ |
| Các tên brands Beauty | BEAUTY BRANDS.MP4 | mp4 | 111 MB | Narrated beauty brands | No |
| Các tên brands Beauty | z7770571307456….jpg | jpg | 67 KB | French brands | ✅ |
| Các tên brands Beauty | z7770571315843….jpg | jpg | 78 KB | American & England brands | ✅ |
| Các tên brands Beauty | z7770571323953….jpg | jpg | 88 KB | Japan & Korean brands + SK-II | ✅ |
| Các brands Rượu và thuốc lá | CÁC BRAND RƯỢU VÀ THUỐC LÁ….mov | mov | 97 MB | Narrated liquor/tobacco brands | No |
| Các brands Rượu và thuốc lá | z7822030503074….jpg | jpg | 275 KB | Liquor 11–18 + types | ✅ |
| Các brands Rượu và thuốc lá | z7822030510647….jpg | jpg | 292 KB | Chinese liquor + tobacco | ✅ |
| Các brands Rượu và thuốc lá | z7822030513056….jpg | jpg | 199 KB | Tobacco 1–10 | ✅ |
| Các brands Rượu và thuốc lá | z7822030520496….jpg | jpg | 223 KB | Liquor 1–10 | ✅ |
| Giao tiếp…Rượu_TL_Bánh kẹo | TIẾNG TRUNG RƯỢU….mov | mov | 39 MB | Narrated liquor/tobacco/sweets | No |
| Giao tiếp…Rượu_TL_Bánh kẹo | z7785878055180….jpg | jpg | 188 KB | LIQUOR (1–2) | ✅ |
| Giao tiếp…Rượu_TL_Bánh kẹo | z7785878057157….jpg | jpg | 195 KB | TOBACCO (1–2) | ✅ |
| Giao tiếp…Rượu_TL_Bánh kẹo | z7785878065198….jpg | jpg | 196 KB | LIQUOR (3–4) | ✅ |
| Giao tiếp…Rượu_TL_Bánh kẹo | z7785878069485….jpg | jpg | 182 KB | CONFECTIONERY (1–2) | ✅ |
| lượng từ | LƯỢNG TỪ TRONG TIẾNG TRUNG.mov | mov | 53 MB | Narrated measure words | No |
| lượng từ | lượng từ beauty.jpg | jpg | 105 KB | Measure words — cosmetics | ✅ |
| lượng từ | lượng từ rượu, thuốc, choco.jpg | jpg | 131 KB | Measure words — liquor/tobacco/sweets | ✅ |
| lượng từ | lượng từ thời trang.jpg | jpg | 100 KB | Measure words — fashion | ✅ |
| số đếm & màu sắc | Part 1 - Color.mov | mov | 30 MB | Narrated colors | No |
| số đếm & màu sắc | Part2 - Number.mov | mov | 95 MB | Narrated numbers | No |
| số đếm & màu sắc | số đếm.jpg | jpg | 74 KB | Numbers (English template) | ✅ |
| số đếm & màu sắc | màu sắc.jpg | jpg | 46 KB | Colors (English template) | ✅ |

---

## 4. Full content transcription (verbatim from every slide)

Format per line: **Hanzi / Pinyin / Vietnamese** + word gloss where the slide provided one. Transcribed faithfully (including original inconsistencies — see §11).

### 4.A — Core sales flow (folder: các câu giao tiếp cơ bản)

**CHÀO HỎI (Greeting)**
1. 您好，欢迎光临！/ Nín hǎo, huānyíng guānglín! / Xin chào, chào mừng quý khách!  — *huānyíng:* hoan nghênh; *guānglín:* quý khách
2. 您好，需要帮忙吗？/ Nín hǎo, xūyào bāngmáng ma? / Anh/chị cần hỗ trợ không?  — *xūyào:* cần; *bāngmáng:* giúp đỡ, hỗ trợ

**HỎI NHU CẦU (Ask needs)**
1. 您想看什么？/ Nín xiǎng kàn shénme? / Anh/chị muốn xem gì?  — *xiǎng:* muốn; *kàn:* xem, nhìn
2. 您喜欢什么品牌？/ Nín xǐhuān shénme pǐnpái? / Anh/chị thích thương hiệu gì?  — *xǐhuān:* thích; *pǐnpái:* thương hiệu

**GIỚI THIỆU – HỖ TRỢ (Introduce / recommend)**
1. 我可以给您推荐 / Wǒ kěyǐ gěi nín tuījiàn / Em có thể giới thiệu cho anh/chị  — *kěyǐ:* có thể; *gěi:* cho; *tuījiàn:* giới thiệu
2. 这个很好卖 / Zhège hěn hǎo mài / Món này bán rất chạy  — *mài:* bán; *mǎi:* mua; *hěn hǎo:* rất tốt, rất chạy

**THANH TOÁN (Payment)**
1. 我帮您结账 / Wǒ bāng nín jiézhàng / Em hỗ trợ thanh toán  — *jiézhàng:* thanh toán
2. 请您检查一下商品 / Qǐng nín jiǎnchá yíxià shāngpǐn / Anh/chị vui lòng kiểm tra lại hàng  — *jiǎnchá:* kiểm tra; *shāngpǐn:* hàng hóa

**XỬ LÝ TÌNH HUỐNG (Handle situations)**
1. 不好意思，这个现在没有货 / Bù hǎoyìsi, zhège xiànzài méiyǒu huò / Xin lỗi, hiện tại hết hàng  — *Bù hǎoyìsi:* Xin lỗi; *xiànzài:* hiện tại; *huò:* hàng
2. 您可以慢慢看 / Nín kěyǐ màn man kàn / Anh/chị cứ xem từ từ ạ  — *màn man:* từ từ

### 4.B — Grammar foundation (folder: Đại từ nhân xưng, chỉ định, nghi vấn)

**Personal pronouns (ĐẠI TỪ NHÂN XƯNG)**
- 我 (wǒ) — tôi · 你 (nǐ) — bạn · 他/她 (tā) — anh ấy/cô ấy · 我们 (wǒmen) — chúng tôi · 你们 (nǐmen) — các bạn · 他们/她们 (tāmen) — họ

**Customer address terms (honorifics)**
- 您 (nín) — ngài (you, polite) · 先生 (xiānshēng) — tiên sinh (Mr) · 女士 (nǚshì) — quý cô (Ms) · 老板 (lǎobǎn) — sếp [or surname + 总 (zǒng) when the customer's name is known] · 美女 (měinǚ) — người đẹp · 帅哥 (shuàigē) — anh đẹp trai

**Demonstratives (ĐẠI TỪ CHỈ ĐỊNH)**
- 这 (zhè) — này/cái này · 那 (nà) — kia/cái kia · 这里 (zhèlǐ) — ở đây/chỗ này · 那里 (nàlǐ) — ở kia/chỗ đó · 这些 (zhèxiē) — những cái này · 那些 (nàxiē) — những cái kia

**Interrogatives (ĐẠI TỪ NGHI VẤN)**
- 谁 (shéi/shuí) — Ai · 什么 (shénme) — Cái gì/gì · 哪 (nǎ) — Nào (lựa chọn) · 哪儿/哪里 (nǎr/nǎlǐ) — Ở đâu · 怎么 (zěnme) — Thế nào/làm sao · 怎么样 (zěnmeyàng) — Như thế nào · 几 (jǐ) — mấy (<10) · 多少 (duōshǎo) — Bao nhiêu (>10) · 为什么 (wèishénme) — Tại sao

### 4.C — Cosmetics communication (folder: …nghành mỹ phẩm)

**香水 Perfume (xiāngshuǐ)**
1. 您在寻找男士香水还是女士香水？/ Nín zài xúnzhǎo nánshì xiāngshuǐ háishì nǚshì xiāngshuǐ? / Anh/chị muốn tìm nước hoa nam hay nước hoa nữ?  — *nánshì:* Nam; *nǚshì:* Nữ; *xiāngshuǐ:* Nước hoa
2. 您喜欢什么香味？/ Nín xǐhuān shénme xiāngwèi? / Anh/chị thích loại mùi hương nào? (花香 huāxiāng / 木香 mùxiāng / 清新香 qīngxīnxiāng — hương hoa / hương gỗ / hương tươi mát)  — *xǐhuān:* yêu thích; *xiāngwèi:* mùi hương
3. 这是新款香水 / Zhè shì xīnkuǎn xiāngshuǐ / Đây là mẫu nước hoa mới  — *xīnkuǎn:* mẫu mới
4. 这款香水是畅销产品 / Zhè kuǎn xiāngshuǐ shì chàngxiāo chǎnpǐn / Mẫu nước hoa này là sản phẩm bán chạy nhất  — *chàngxiāo:* bán chạy nhất
5. 您想闻一下吗？/ Nín xiǎng wén yíxià ma? / Anh/chị có muốn ngửi thử không?  — *wén:* ngửi
6. 这款香水味道很浓/很淡 / Zhè kuǎn xiāngshuǐ wèidào hěn nóng / hěn dàn / Mùi hương nước hoa này rất nồng / rất nhẹ  — *wèidào:* mùi hương; *nóng:* nồng; *dàn:* nhẹ

**护肤品 Skincare (hùfūpǐn)**
1. 您在寻找护肤产品吗？/ Nín zài xúnzhǎo hùfū chǎnpǐn ma? / Anh/chị đang tìm sản phẩm dưỡng da phải không?  — *xúnzhǎo:* tìm kiếm; *hùfū:* dưỡng da; *chǎnpǐn:* sản phẩm
2. 您在寻找哪个品牌？/ Nín zài xúnzhǎo nǎge pǐnpái? / Anh/chị đang tìm thương hiệu nào?  — *pǐnpái:* thương hiệu
3. 您在寻找哪种护肤产品？/ Nín zài xúnzhǎo nǎ zhǒng hùfū chǎnpǐn? / Anh/chị đang tìm loại sản phẩm dưỡng da nào?  — *zhǒng:* loại; 面霜 *miànshuāng:* kem mặt/Face cream; 精华液 *jīnghuáyè:* tinh chất/Serum; 爽肤水 *shuǎngfūshuǐ:* nước hoa hồng/Toner; 防晒霜 *fángshàishuāng:* kem chống nắng/Sunscreen
4. 您的皮肤是什么类型的？/ Nín de pífū shì shénme lèixíng de? / Anh/chị thuộc loại da nào?  — *pífū:* da; *lèixíng:* kiểu/loại
5. 您是买来送人还是自己用？/ Nín shì mǎi lái sòngrén háishì zìjǐ yòng? / Anh/chị mua tặng hay là cho bản thân dùng?  — *sòng:* tặng; *háishì:* hay là; *zìjǐ:* bản thân

### 4.D — Beauty brand pronunciation (folder: Các tên brands Beauty)

**French brands** — Lancôme 兰蔻 (Lán kòu) · Chanel 香奈儿 (Xiāng nài ér) · Dior 迪奥 (Dí ào) · Clarins 娇韵诗 (Jiāo yùn shī) · L'Occitane 欧舒丹 (Ōu shū dān) · Givenchy 纪梵希 (Jì fàn xī) · Yves Saint Laurent 圣罗兰 (Shèng luó lán) · L'Oréal 欧莱雅 (Ōu lái yǎ)

**American & England brands** — Estée Lauder (Mỹ) 雅诗兰黛 (Yǎ shī lán dài) · Jo Malone London (Anh) 祖·玛珑 (Zǔ mǎ lóng) · Kiehl's (Mỹ) 科颜氏 (Kē yán shì) · Tom Ford Beauty (Mỹ) 汤姆·福特 (Tāng mǔ fú tè) · La Mer (Mỹ) 海蓝之谜 (Hǎi lán zhī mí)

**Japan & Korean brands** — Shiseido (Nhật) 资生堂 (Zī shēng táng) · Sulwhasoo (Hàn) 雪花秀 (Xuě huā xiù) · Laneige (Hàn) 兰芝 (Lán zhī)
**Other** — SK-II: thường giữ nguyên tên tiếng Anh; cách đọc phổ biến "S K èr", hoặc khách gọi "S K Two".

### 4.E — Liquor & tobacco brand pronunciation (folder: Các brands Rượu và thuốc lá)

**LIQUOR 酒类 — international (1–18)**
1. Johnnie Walker 尊尼获加 (Zūn ní huò jiā) · 2. Chivas Regal 芝华士 (Zhī huá shì) · 3. The Macallan 麦卡伦 (Mài kǎ lún) · 4. Glenfiddich 格兰菲迪 (Gé lán fēi dí) · 5. Hennessy 轩尼诗 (Xuān ní shī) · 6. Martell 马爹利 (Mǎ diē lì) · 7. Rémy Martin 人头马 (Rén tóu mǎ) · 8. Ballantine's 百龄坛 (Bǎi líng tán) · 9. Royal Salute 皇家礼炮 (Huáng jiā lǐ pào) · 10. Hibiki 响 (Xiǎng) · 11. The Glenlivet 格兰利威 (Gé lán lì wēi) · 12. Balvenie 百富 (Bǎi fù) · 13. Rượu vang đỏ 红葡萄酒 (Hóng pútáojiǔ) · 14. Rượu vang trắng 白葡萄酒 (Bái pútáojiǔ) · 15. Vodka 伏特加 (Fú tè jiā) · 16. Gin 金酒 (Jīn jiǔ) · 17. Rum 朗姆酒 (Lǎng mǔ jiǔ) · 18. Champagne 香槟 (Xiāng bīn)

**TOBACCO 烟草 — international (1–10)**
1. Marlboro 万宝路 (Wàn bǎo lù) · 2. Dunhill 登喜路 (Dēng xǐ lù) · 3. Camel 骆驼 (Luò tuó) · 4. Winston 温斯顿 (Wēn sī dùn) · 5. Mevius 柔和七星 (Róu hé qī xīng) · 6. Seven Stars 七星 (Qī xīng) · 7. State Express 555 三五 (Sān wǔ) · 8. Esse 爱喜 (Ài xǐ) · 9. Jet 杰特 (Jié tè) · 10. Cigaronne 卡比龙 (Kǎ bǐ lóng)

**CHINESE LIQUOR 中国酒** — 1. Moutai 茅台 (Máotái) · 2. Wuliangye 五粮液 (Wǔ liáng yè) · 3. Shui Jing Fang 水井坊 (Shuǐ jǐng fāng) · 4. Meng Zhi Lan 梦之蓝 (Mèng zhī lán) · 5. Fen Jiu 汾酒 (Fénjiǔ)
**CHINESE TOBACCO 中国烟** — 1. Chunghwa 中华 (Zhōng huá) · 2. Panda 熊猫 (Xióng māo) · 3. Liqun 利群 (Lì qún) · 4. Huanghelou 黄鹤楼 (Huáng hè lóu) · 5. Yuxi 玉溪 (Yùxī)

### 4.F — Liquor / tobacco / confectionery communication (folder: Giao tiếp cơ bản_Rượu_TL_Bánh kẹo)

**LIQUOR (酒类)**
1. 您想买什么酒？/ Nín xiǎng mǎi shénme jiǔ? / Bạn muốn mua loại rượu nào?  — *jiǔ:* rượu
2. 您喜欢威士忌还是干邑？/ Nín xǐhuan wēishìjì háishì gānyì? / Bạn thích Whisky hay Cognac?  — *wēishìjì:* Whisky; *gānyì:* Cognac
3. 您自己用还是送人？/ Nín shì zìjǐ yòng háishì sòng rén? / Bạn muốn để uống hay tặng?  — *zìjǐ:* tự (bản thân); *háishì:* hay/hoặc là; *sòng:* tặng
4. 我们这里有很多进口酒 / Wǒmen zhèlǐ yǒu hěn duō jìnkǒu jiǔ / Bên em có nhiều loại rượu nhập khẩu  — *duō:* nhiều; *jìnkǒu:* nhập khẩu

**TOBACCO (烟草)**
1. 您要软盒还是硬盒？/ Nín yào ruǎn hé háishì yìng hé? / Bạn muốn mua thuốc lá bao mềm hay bao cứng?  — *ruǎn:* mềm; *yìng:* cứng
2. 这个口味比较淡 / Zhège kǒuwèi bǐjiào dàn / Loại này vị nhẹ hơn  — *kǒuwèi:* vị; *bǐjiào:* hơn (so sánh); *dàn:* nhẹ; *nóng:* nồng

**CONFECTIONERY (糖果)**
1. 这个很适合送礼 / Zhège hěn shìhé sòng lǐ / Cái này rất phù hợp làm quà  — *shìhé:* phù hợp; *sòng lǐ:* làm quà
2. 这个不太甜 / Zhège bú tài tián / Loại này không quá ngọt  — *tài:* quá; *tián:* ngọt; *kǔ:* đắng

### 4.G — Measure words / classifiers (folder: lượng từ)

**Cosmetics** — 瓶 (píng) chai nước hoa/serum · *vd* 一瓶精华 (Yì píng jīnghuá) = 1 chai serum | 支 (zhī) son, mascara, tuýp nhỏ · 一支口红 (Yì zhī kǒuhóng) = 1 thỏi son | 盒 (hé) hộp mỹ phẩm · 一盒粉底 (Yì hé fěndǐ) = 1 hộp kem nền | 片 (piàn) mặt nạ · 一片面膜 (Yí piàn miànmó) = 1 miếng mặt nạ | 套 (tào) bộ sản phẩm · 一套护肤品 (Yí tào hùfūpǐn) = 1 bộ skincare

**Liquor / tobacco / confectionery** — 瓶 (píng) chai rượu · 一瓶红酒 (Yì píng hóngjiǔ) = 1 chai rượu vang | 支 (zhī) chai rượu/điếu thuốc · 一支威士忌 (Yì zhī wēishìjì) / 一支烟 (Yì zhī yān) | 条 (tiáo) cây thuốc lá (10 gói)/thanh chocolate · 一条香烟 (Yì tiáo xiāngyān) / 一条巧克力 (Yì tiáo qiǎokèlì) | 包 (bāo) bao thuốc lá/gói bánh · 一包香烟 (Yì bāo xiāngyān) / 一包饼干 (Yì bāo bǐnggān) | 盒 (hé) hộp bánh/kẹo · 一盒巧克力 (Yì hé qiǎokèlì) | 袋 (dài) bịch kẹo/snack · 一袋糖果 (Yí dài tángguǒ) | 颗 (kē) viên kẹo · 一颗糖 (Yì kē táng)

**Fashion** — 条 (tiáo) thắt lưng · 一条皮带 (Yì tiáo pídài) | 双 (shuāng) giày, tất · 一双鞋 (Yì shuāng xié) | 只 (zhī) túi xách/đồng hồ · 一只包 (Yì zhī bāo) | 副 (fù) mắt kính · 一副太阳镜 (Yí fù tàiyángjìng) | 顶 (dǐng) nón/mũ · 一顶帽子 (Yí dǐng màozi)

### 4.H — Numbers & colors (folder: số đếm & màu sắc) — *English template, NO Vietnamese on slide*

**Numbers 数字 (shùzì)** — 一 yī (1/One) · 二 èr (2/Two) · 三 sān (3/Three) · 四 sì (4/Four) · 五 wǔ (5/Five) · 六 liù (6/Six) · 七 qī (7/Seven) · 八 bā (8/Eight) · 九 jiǔ (9/Nine) · 十 shí (10/Ten) · 百 bǎi (100/Hundred) · 千 qiān (1000/Thousand) · 万 wàn (10000/Ten thousand)

**Colors 颜色 (yánsè)** — 红色 hóngsè (Red) · 蓝色 lánsè (Blue) · 绿色 lǜsè (Green) · 黄色 huángsè (Yellow) · 白色 báisè (White) · 黑色 hēisè (Black) · 灰色 huīsè (Grey) · 紫色 zǐsè (Purple) · 粉色 fěnsè (Pink) · 橙色 chéngsè (Orange)

---

## 5. Content summary

| Folder | Organized by | Hanzi | Pinyin | Vietnamese | English | Examples | Dialogues | Quizzes | Audio |
|---|---|---|---|---|---|---|---|---|---|
| Core sales flow (A) | Scenario | ✅ | ✅ | ✅ | — | — | ❌ (staff-only lines) | ❌ | video only |
| Pronouns (B) | Grammar | ✅ | ✅ | ✅ | — | — | ❌ | ❌ | video only |
| Cosmetics (C) | Product category | ✅ | ✅ | ✅ | ✅ (product types) | — | ❌ | ❌ | video only |
| Beauty brands (D) | Reference table | ✅ | ✅ | — | (Latin names) | — | ❌ | ❌ | video only |
| Liquor/tobacco brands (E) | Reference table | ✅ | ✅ | partial (generic types) | (Latin names) | — | ❌ | ❌ | video only |
| Liquor/tobacco/sweets convo (F) | Product category | ✅ | ✅ | ✅ | — | — | ❌ | ❌ | video only |
| Measure words (G) | Product category | ✅ | ✅ | ✅ | — | ✅ (worked) | ❌ | ❌ | video only |
| Numbers & colors (H) | Vocab list | ✅ | ✅ | ❌ (English instead) | ✅ | — | ❌ | ❌ | video only |

**Strong:** greeting, ask-needs, product discovery (perfume/skincare/liquor/tobacco/sweets), customer address terms, measure words (incl. fashion), brand pronunciation (~16 beauty + ~43 liquor/tobacco), numbers, colors. **Absent across all materials:** dialogues, role-plays, quizzes/exercises.

---

## 6. Gap analysis (against the project's checklist)

| Checklist item | Status | Note |
|---|---|---|
| Pinyin | ✅ Covered | Tones everywhere |
| Vietnamese translation | ⚠️ Partial | Missing on numbers + colors (English only) |
| Sales-floor dialogues | ❌ Major gap | Only one-sided staff lines |
| Staff vs customer role distinction | ❌ Gap | No customer turns to react to |
| Payment phrases | ⚠️ Weak | Only "I'll check you out" + "please check goods" |
| Alipay / WeChat Pay / UnionPay | ❌ Missing | No e-wallet/QR phrases — critical for Chinese travelers |
| Passport / boarding pass | ❌ Missing | No 护照/登机牌 phrases |
| Duty-free concept | ❌ Missing | No 免税 explanation |
| Purchase / quantity limits | ❌ Missing | No allowance phrases |
| Discount / promotion | ❌ Missing | "Bestseller" only; no price/discount |
| Upsell / cross-sell | ⚠️ Seed only | "很好卖", "gift or self-use" exist |
| Out-of-stock / substitute | ⚠️ Partial | Out-of-stock ✅; substitute suggestion ❌ |
| Difficult-question handling | ❌ Gap | "browse slowly" only |
| Quiz-ready structure | ❌ Missing | Author + auto-generate |
| Audio-ready text | ✅ Covered | Clean Hanzi → TTS |
| Source traceability | ⚠️ Manual | Folder + filename mapping (done in §3) |

**Must be authored fresh:** duty-free concept, passport/boarding pass, purchase limits, e-wallet payment, promotions/pricing, closing the sale, difficult-question handling, and ALL dialogues / role-plays / quizzes.

---

## 7. Proposed content taxonomy (3 tracks)

VN labels = UI text. ✅ exists · ✍️ must be authored.

**Track 1 — Nền tảng (Foundation):** Đại từ & cách xưng hô khách hàng ✅ · Số đếm ✅ · Màu sắc ✅ *(add Vietnamese)* · Lượng từ (mỹ phẩm / rượu-thuốc-bánh kẹo / thời trang) ✅

**Track 2 — Quy trình bán hàng (Sales-floor flow):** 1) Chào hỏi ✅ · 2) Hỏi nhu cầu ✅ · 3) Giới thiệu & tư vấn ✅ · 4) Giá & khuyến mãi ✍️ · 5) Miễn thuế ✍️ · 6) Hộ chiếu / thẻ lên máy bay ✍️ · 7) Giới hạn mua hàng ✍️ · 8) Thanh toán ⚠️ · 9) Alipay/WeChat/UnionPay ✍️ · 10) Hết hàng / hàng thay thế ⚠️ · 11) Upsell/cross-sell ⚠️ · 12) Kết thúc giao dịch ✍️ · 13) Câu hỏi khó của khách ✍️

**Track 3 — Theo ngành hàng (Product modules):** Nước hoa ✅ · Mỹ phẩm/chăm sóc da ✅ · Rượu ✅ · Thuốc lá ✅ · Bánh kẹo ✅ · Thời trang/phụ kiện ✍️ *(measure words exist; phrases to author)*

**Reference (browsable dictionary, not a lesson):** Brand pronunciation — Beauty (~16) + Liquor/Tobacco (~43).

---

## 8. Proposed JSON / TypeScript schema

Refined from the project's starting schema. Key additions vs. the original: `gloss[]` (the recurring per-word breakdown), optional English everywhere, a dedicated `MeasureWord` and `BrandReference` type, `examples[]` (array), an extended `SourceRef` (image/video traceability), and a `status` flag (`from_source` | `authored` | `needs_review`) on every node.

```ts
type Lang = { zh: string; pinyin: string; vi: string; en?: string };
type ContentStatus = "from_source" | "authored" | "needs_review";

type SourceRef = {
  sourceType: "image" | "video" | "doc" | "authored";
  assetPath?: string;        // e.g. "các câu giao tiếp cơ bản/z7760840848950_….jpg"
  folder?: string;
  slideTitle?: string;       // e.g. "CHÀO HỎI"
  itemNumber?: number;
  mediaTimestamp?: string;   // "mm:ss" if traced to a video
  note?: string;
};

type Course = {
  id: string;
  track: "foundation" | "sales_flow" | "product" | "reference";
  titleVi: string;
  descriptionVi: string;
  lessons: Lesson[];
};

type Lesson = {
  id: string;
  titleVi: string;
  titleZh?: string;
  level: "starter" | "basic" | "sales" | "advanced";
  estimatedMinutes: number;   // target ~5
  category: string;           // taxonomy key
  objectiveVi: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  measureWords?: MeasureWord[];
  dialogues: Dialogue[];
  roleplays: RoleplayScenario[];
  quizzes: QuizQuestion[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

type Example = { zh: string; pinyin: string; vi?: string; en?: string };

type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  meaningEn?: string;
  productCategory?: string;
  examples?: Example[];
  tags: string[];             // ["color"], ["number"], ["address_term"], …
  audioText?: string;         // defaults to hanzi
  priority: "must_know" | "useful" | "advanced";
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

type Gloss = { hanzi?: string; pinyin: string; meaningVi: string }; // "xiǎng: muốn"

type SentencePattern = {
  id: string;
  zh: string;
  pinyin: string;
  vi: string;
  en?: string;
  usageVi: string;
  register: "friendly" | "polite" | "sales" | "firm" | "emergency";
  focusWords?: string[];      // color-highlighted keywords on slides
  gloss?: Gloss[];
  tags: string[];
  audioText?: string;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

type MeasureWord = {
  id: string;
  hanzi: string;              // 瓶, 支, 条…
  pinyin: string;
  usesForVi: string;
  productCategory: "beauty" | "liquor_tobacco_sweets" | "fashion" | "general";
  examples: Example[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

type BrandReference = {
  id: string;
  latinName: string;          // "Lancôme", "Johnnie Walker"
  hanzi: string;              // 兰蔻
  pinyin: string;             // Lán kòu
  category: "beauty" | "liquor" | "tobacco";
  origin?: string;            // "Pháp", "Mỹ", "Trung Quốc"
  noteVi?: string;            // e.g. SK-II pronunciation note
  audioText?: string;
  sourceRefs?: SourceRef[];
};

type ReferenceTable = {
  id: string;
  titleVi: string;
  type: "brand" | "number" | "color" | "measure_word";
  brands?: BrandReference[];
  vocab?: VocabularyItem[];
};

type DialogueLine = {
  speaker: "staff" | "customer";
  zh: string; pinyin: string; vi: string;
  gloss?: Gloss[];
  noteVi?: string;
};
type Dialogue = {
  id: string; titleVi: string; scenarioVi: string;
  lines: DialogueLine[];
  status: ContentStatus; sourceRefs?: SourceRef[];
};

type QuizQuestion = {
  id: string;
  type: "meaning_mcq" | "hanzi_to_pinyin" | "listening_mcq" | "fill_pinyin" | "choose_reply";
  promptVi: string; promptZh?: string; audioText?: string;
  options?: string[]; correctAnswer: string; explanationVi?: string;
  generatedFrom?: string;     // id of the vocab/pattern it was built from
  status: ContentStatus; sourceRefs?: SourceRef[];
};

type RoleplayScenario = {
  id: string; titleVi: string; scenarioVi: string;
  customerGoalVi: string; staffGoalVi: string;
  requiredPhrases: string[]; sampleDialogueId?: string;
  status: ContentStatus; sourceRefs?: SourceRef[];
};
```

---

## 9. Confirmed decisions & Phase 1 plan

**Decisions confirmed by the product owner (2026-05-29):**
1. **Gap content = "I draft, you review."** Claude authors shop-floor Mandarin for every missing category and auto-generates dialogues + quizzes; owner approves each category; authored items tagged `status: "authored"`.
2. **Source = images/videos only.** No editable source decks; rely on the §4 transcriptions; videos are a pronunciation reference only.
3. **Phase 1 starts with "Content JSON first."** Convert all existing materials into the §8 schema for the owner to verify Hanzi/pinyin/Vietnamese accuracy **before any app code**.

**Phase 1 step 1 (pending owner go-ahead):**
- Produce `content/*.json` seeded entirely from §4 (from_source), with full `SourceRef` traceability.
- Add Vietnamese to numbers & colors (currently English-only).
- Standardize register to polite "Anh/chị" (fix the "Bạn" inconsistency in folder F).
- Deliver JSON for review → then author gap categories (step 2) → then scaffold the Next.js app (step 3).

No code or content has been written yet — Phase 0 is analysis only.

---

## 10. Questions for the reviewer

Please pressure-test the following and flag anything you'd change:
1. **Schema soundness** — Is the §8 schema the right shape for a static-JSON, localStorage, no-DB v1? Any fields missing or over-engineered? Is splitting `BrandReference`/`MeasureWord` from `VocabularyItem` worth it, or should they be unified?
2. **Taxonomy** — Is the 3-track structure (Foundation / Sales-flow / Product) the best learning frame for ~5-min mobile sessions, or would a single linear scenario path be better for retention?
3. **Mandarin accuracy & register** — Review the §4 Chinese for correctness and naturalness in an airport duty-free context. Is consistent 您-level politeness right, or should some phrases be warmer (美女/帅哥 register)? Any phrasing a native clerk wouldn't actually say?
4. **Gap priorities** — Of the ✍️ gaps (duty-free, passport, limits, e-wallets, promotions, closing, difficult questions), which are highest-impact to author first for day-one counter usefulness?
5. **Pedagogy** — For staff with no Chinese background, is "Hanzi + pinyin + Vietnamese + gloss + TTS + quiz" enough, or is a tone/pronunciation-onboarding module needed before phrases?
6. **Quiz/dialogue auto-generation** — Any risks in generating quizzes and customer-turn dialogues from one-sided staff phrases? What guardrails would you add?

---

## 11. Transcription notes & data-quality flags

- **Register inconsistency:** Folder F (liquor/tobacco/sweets) translates 您 as "Bạn"; Folder A uses "Anh/chị". Recommend standardizing to "Anh/chị" (more polite/appropriate for airport retail).
- **Numbers & colors have no Vietnamese** (Folder H uses an English "01 Vocabulary" template with page numbers — likely an older/separate deck). Vietnamese to be added in Phase 1.
- **Measure-word liquor table (Folder G)** had odd STT numbering on the slide (1,2,3,4,6,7,9 — skips 5/8); content is complete, numbering is a slide typo.
- **Pronoun slides (Folder B)** are screen-grabs of a media player showing a document — lowest visual fidelity; the 老板 entry note was slightly garbled (interpreted as: address as surname + 总 zǒng when the customer's name is known).
- **Pinyin spacing** on some slides is irregular (e.g., "nǚ shì" vs "nǚshì"); normalized to standard spacing in §4 where unambiguous.
- **Brand tables** intentionally omit Vietnamese meaning and example sentences — they are pronunciation lookups (Latin name → Hanzi → pinyin).
- **Two slide families with English instead of Vietnamese** appear in Folder H only; all other folders are Vietnamese-first.
- **Videos** were not transcribed (no ffmpeg; audio not text-parseable). They appear to narrate the same slides; their unique value is native pronunciation, which v1 replaces with Web Speech TTS.
