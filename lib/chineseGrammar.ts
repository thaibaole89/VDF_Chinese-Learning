// Chinese grammar / sentence-building tips, keyed by Chinese lesson id.
// Phase 2C.1.6. Separate TS module so we don't touch the validated content JSON.
// Rendered by app/lessons/[id]/LessonDetail.tsx.

import type { GrammarTip } from "@/lib/grammar";

export const CHINESE_GRAMMAR: Record<string, GrammarTip[]> = {
  // ---------- Foundation (grammar-rich) ----------
  lesson_personal_pronouns: [
    {
      titleVi: "Đại từ & kính ngữ 您",
      pattern: "我 / 你·您 / 他·她 / 我们 / 你们 / 他们",
      bodyVi: "您 (nín) là “anh/chị/quý khách” — dạng lịch sự của 你. Khi phục vụ khách LUÔN dùng 您.",
      examples: [
        { text: "您好！", gloss: "Nín hǎo!", vi: "Xin chào (lịch sự)!" },
        { text: "我可以帮您。", gloss: "Wǒ kěyǐ bāng nín.", vi: "Tôi có thể giúp anh/chị." },
      ],
    },
  ],
  lesson_demonstratives: [
    {
      titleVi: "Chỉ định: 这/那 + lượng từ + danh từ",
      pattern: "这/那 + 量词 + 名词",
      bodyVi: "这 (zhè) = này, 那 (nà) = kia. Giữa từ chỉ định và danh từ phải có lượng từ (thường là 个).",
      examples: [
        { text: "这个", gloss: "zhège", vi: "cái này" },
        { text: "这款香水", gloss: "zhè kuǎn xiāngshuǐ", vi: "mẫu nước hoa này" },
      ],
    },
  ],
  lesson_interrogatives: [
    {
      titleVi: "Câu hỏi KHÔNG đảo trật tự",
      pattern: "Đặt từ hỏi (什么/哪/几/多少) vào vị trí câu trả lời",
      bodyVi:
        "Tiếng Trung không đảo từ như tiếng Anh: cứ đặt từ để hỏi ngay chỗ cần thông tin. 什么 = gì, 哪 = nào, 几/多少 = bao nhiêu.",
      examples: [
        { text: "您想看什么？", gloss: "Nín xiǎng kàn shénme?", vi: "Anh/chị muốn xem gì?" },
        { text: "多少钱？", gloss: "Duōshǎo qián?", vi: "Bao nhiêu tiền?" },
      ],
    },
    {
      titleVi: "Câu hỏi Có/Không với 吗",
      pattern: "[câu khẳng định] + 吗？",
      bodyVi: "Thêm 吗 (ma) vào cuối câu khẳng định để thành câu hỏi Có/Không.",
      examples: [{ text: "需要帮忙吗？", gloss: "Xūyào bāngmáng ma?", vi: "Cần giúp không ạ?" }],
    },
  ],
  lesson_numbers: [
    {
      titleVi: "Số đếm & “mười mấy / mấy mươi”",
      pattern: "十=10 · 二十=20 · 二十五=25 · 一百=100",
      bodyVi: "Ghép số rất logic: 十一 (11), 二十 (20), 二十五 (25). Hàng trăm: 一百, 两百.",
      examples: [{ text: "一千二百", gloss: "yìqiān èrbǎi", vi: "1.200" }],
    },
  ],
  lesson_mw_beauty: [
    {
      titleVi: "Lượng từ: Số + 量词 + Danh từ",
      pattern: "数词 + 量词 + 名词",
      bodyVi:
        "Tiếng Trung đếm vật phải có “lượng từ” giữa số và danh từ. 瓶 (chai), 盒 (hộp), 支 (thỏi/cây), 个 (cái – dùng chung).",
      examples: [
        { text: "一瓶香水", gloss: "yì píng xiāngshuǐ", vi: "một chai nước hoa" },
        { text: "两支口红", gloss: "liǎng zhī kǒuhóng", vi: "hai thỏi son" },
      ],
    },
  ],
  lesson_mw_fashion: [
    {
      titleVi: "Lượng từ thời trang",
      pattern: "数词 + 量词 + 名词",
      bodyVi: "件 (đồ mặc), 条 (vật dài: khăn, dây), 双 (đôi). Nhớ: số 2 khi đếm dùng 两 chứ không dùng 二.",
      examples: [{ text: "一双鞋", gloss: "yì shuāng xié", vi: "một đôi giày" }],
    },
  ],
  lesson_mw_liquor_tobacco_sweets: [
    {
      titleVi: "Lượng từ rượu/thuốc/kẹo",
      pattern: "数词 + 量词 + 名词",
      bodyVi: "瓶 (chai rượu), 条 (cây thuốc lá), 盒 (hộp/bao), 包 (gói).",
      examples: [
        { text: "一瓶酒", gloss: "yì píng jiǔ", vi: "một chai rượu" },
        { text: "一条烟", gloss: "yì tiáo yān", vi: "một cây thuốc lá" },
      ],
    },
  ],
  lesson_address_terms: [
    {
      titleVi: "Xưng hô lịch sự với khách",
      bodyVi: "Dùng 您 cho khách; gọi 先生 (ông/anh), 女士 (bà/chị). Tránh suy đoán tuổi/giới khi chưa chắc.",
      examples: [{ text: "先生，您好！", gloss: "Xiānsheng, nín hǎo!", vi: "Chào anh ạ!" }],
    },
  ],

  // ---------- Counter Survival ----------
  lesson_day_one_10_phrases: [
    {
      titleVi: "4 khung câu cốt lõi tại quầy",
      pattern: "需要…吗？ · 想 + V · 请 + V · A 还是 B",
      bodyVi:
        "Hầu hết câu bán hàng dựng từ 4 khung này: hỏi Có/Không (…吗), nói muốn (想), đề nghị lịch sự (请), và hỏi lựa chọn (A 还是 B).",
      examples: [
        { text: "您想看什么？", gloss: "Nín xiǎng kàn shénme?", vi: "Anh/chị muốn xem gì?" },
        { text: "刷卡还是扫码？", gloss: "Shuākǎ háishì sǎomǎ?", vi: "Quẹt thẻ hay quét mã?" },
      ],
    },
  ],
  lesson_cs_greeting: [
    {
      titleVi: "Mời giúp: 需要…吗？",
      pattern: "需要 + [danh từ/动词] + 吗？",
      bodyVi: "需要 (xūyào) = cần. Thêm 吗 thành câu hỏi mời giúp.",
      examples: [{ text: "需要帮忙吗？", gloss: "Xūyào bāngmáng ma?", vi: "Cần giúp gì không ạ?" }],
    },
  ],
  lesson_cs_ask_needs: [
    {
      titleVi: "Muốn làm gì: 想 + động từ",
      pattern: "(您)想 + [动词] + [宾语]",
      bodyVi: "想 (xiǎng) = muốn, đứng trước động từ. Đổi động từ/tân ngữ để hỏi nhu cầu.",
      examples: [
        { text: "您想看什么？", gloss: "Nín xiǎng kàn shénme?", vi: "Anh/chị muốn xem gì?" },
        { text: "您想买什么？", gloss: "Nín xiǎng mǎi shénme?", vi: "Anh/chị muốn mua gì?" },
      ],
    },
  ],
  lesson_cs_recommend: [
    {
      titleVi: "Làm gì CHO ai: 给 + 您 + động từ",
      pattern: "(我)给您 + [động từ]",
      bodyVi: "给 (gěi) + người + động từ = làm việc đó cho người. 可以 (kěyǐ) = có thể.",
      examples: [{ text: "我可以给您推荐几款。", gloss: "Wǒ kěyǐ gěi nín tuījiàn jǐ kuǎn.", vi: "Tôi có thể giới thiệu cho anh/chị vài mẫu." }],
    },
  ],
  lesson_cs_bestseller: [
    {
      titleVi: "“là” với 是 và “rất” với 很",
      pattern: "这款 + 是 + 名词 · 这款 + 很 + 形容词",
      bodyVi:
        "Với danh từ dùng 是 (shì = là). Với tính từ KHÔNG dùng 是, mà dùng 很 (hěn): 很好卖 = rất bán chạy.",
      examples: [
        { text: "这款是畅销产品。", gloss: "Zhè kuǎn shì chàngxiāo chǎnpǐn.", vi: "Mẫu này là hàng bán chạy." },
        { text: "这款很好卖。", gloss: "Zhè kuǎn hěn hǎo mài.", vi: "Mẫu này rất bán chạy." },
      ],
    },
  ],
  lesson_cs_browsing: [
    {
      titleVi: "Để khách thoải mái: 可以慢慢…",
      pattern: "您可以 + 慢慢 + [động từ]",
      bodyVi: "可以 = được/cứ; 慢慢 (mànmàn) = từ từ. Ghép để mời khách thong thả.",
      examples: [{ text: "您可以慢慢看。", gloss: "Nín kěyǐ mànmàn kàn.", vi: "Anh/chị cứ từ từ xem ạ." }],
    },
  ],
  lesson_cs_payment: [
    {
      titleVi: "Hỏi cách thức: 怎么 + động từ",
      pattern: "(您)怎么 + [动词]？",
      bodyVi: "怎么 (zěnme) = như thế nào. Đặt trước động từ để hỏi cách làm.",
      examples: [{ text: "您怎么付款？", gloss: "Nín zěnme fùkuǎn?", vi: "Anh/chị thanh toán thế nào ạ?" }],
    },
  ],
  lesson_cs_out_of_stock: [
    {
      titleVi: "Không có: 没有 + danh từ",
      pattern: "没有 + [名词]",
      bodyVi: "没有 (méiyǒu) = không có (phủ định của 有). “不好意思” mở đầu để lịch sự.",
      examples: [{ text: "不好意思，现在没有货。", gloss: "Bù hǎoyìsi, xiànzài méiyǒu huò.", vi: "Xin lỗi, hiện không có hàng." }],
    },
  ],
  lesson_cs_verify_goods: [
    {
      titleVi: "Lịch sự: 请 + động từ",
      pattern: "请 + [động từ] …",
      bodyVi: "请 (qǐng) = xin/mời, đặt đầu câu để đề nghị lịch sự.",
      examples: [{ text: "请您检查一下商品。", gloss: "Qǐng nín jiǎnchá yíxià shāngpǐn.", vi: "Mời anh/chị kiểm tra hàng ạ." }],
    },
  ],

  // ---------- Sales-flow (P1) ----------
  lesson_p1_price: [
    {
      titleVi: "“Có” khuyến mãi: 有 + danh từ",
      pattern: "有 + 优惠/折扣 · 买一送一",
      bodyVi: "有 (yǒu) = có. 有优惠 = có ưu đãi, 有折扣 = có giảm giá. 买一送一 = mua một tặng một.",
      examples: [
        { text: "现在有优惠活动。", gloss: "Xiànzài yǒu yōuhuì huódòng.", vi: "Hiện có chương trình ưu đãi." },
        { text: "现在买一送一。", gloss: "Xiànzài mǎi yī sòng yī.", vi: "Đang mua một tặng một." },
      ],
    },
  ],
  lesson_p1_payment: [
    {
      titleVi: "Lựa chọn: A 还是 B",
      pattern: "您要 + A + 还是 + B？",
      bodyVi: "还是 (háishì) = hay (trong câu hỏi lựa chọn). 您要…= anh/chị muốn…",
      examples: [{ text: "您要刷卡还是扫码支付？", gloss: "Nín yào shuākǎ háishì sǎomǎ zhīfù?", vi: "Anh/chị quẹt thẻ hay quét mã ạ?" }],
    },
  ],
  lesson_p1_passport: [
    {
      titleVi: "Xin xuất trình: 请出示…",
      pattern: "请出示 + [giấy tờ]",
      bodyVi: "出示 (chūshì) = xuất trình. 请出示… để xin khách đưa giấy tờ một cách lịch sự.",
      examples: [{ text: "请出示您的护照和登机牌。", gloss: "Qǐng chūshì nín de hùzhào hé dēngjīpái.", vi: "Xin xuất trình hộ chiếu và thẻ lên máy bay ạ." }],
    },
  ],
  lesson_p1_dutyfree: [
    {
      titleVi: "Sở hữu với 的 + “là” với 是",
      pattern: "[名词] + 的 + [名词] · 这是 + 名词",
      bodyVi: "的 (de) nối để tạo sở hữu/định ngữ: 免税的价格. 这是… = đây là…",
      examples: [{ text: "这是免税店。", gloss: "Zhè shì miǎnshuì diàn.", vi: "Đây là cửa hàng miễn thuế." }],
    },
  ],
  lesson_p1_oos: [
    {
      titleVi: "Gợi ý mẫu khác: 另外一款",
      pattern: "(我)可以给您推荐 + 另外一款",
      bodyVi: "另外 (lìngwài) = khác; 一款 = một mẫu. Ghép với 给您推荐 để gợi ý thay thế.",
      examples: [{ text: "我可以给您推荐另外一款。", gloss: "Wǒ kěyǐ gěi nín tuījiàn lìngwài yì kuǎn.", vi: "Tôi gợi ý cho anh/chị một mẫu khác nhé." }],
    },
  ],
  lesson_p1_closing: [
    {
      titleVi: "Lời chúc: 祝您 + …",
      pattern: "祝您 + [lời chúc]",
      bodyVi: "祝 (zhù) = chúc. 祝您旅途愉快 = chúc anh/chị đi vui. 请慢走 = anh/chị đi cẩn thận.",
      examples: [{ text: "祝您旅途愉快。", gloss: "Zhù nín lǚtú yúkuài.", vi: "Chúc anh/chị chuyến đi vui vẻ." }],
    },
  ],

  // ---------- Products ----------
  lesson_perfume: [
    {
      titleVi: "Tìm A hay B: 寻找…还是…",
      pattern: "您在寻找 + A + 还是 + B？",
      bodyVi: "在寻找 (zài xúnzhǎo) = đang tìm. Kết hợp 还是 để hỏi nam/nữ, loại nào.",
      examples: [{ text: "您在寻找男士香水还是女士香水？", gloss: "Nín zài xúnzhǎo nánshì xiāngshuǐ háishì nǚshì xiāngshuǐ?", vi: "Anh/chị tìm nước hoa nam hay nữ ạ?" }],
    },
  ],
  lesson_skincare: [
    {
      titleVi: "Hỏi loại: …是什么类型？",
      pattern: "[名词] + 是什么类型？",
      bodyVi: "什么类型 (shénme lèixíng) = loại gì. Dùng để hỏi loại da, loại sản phẩm.",
      examples: [{ text: "您的皮肤是什么类型的？", gloss: "Nín de pífū shì shénme lèixíng de?", vi: "Da của anh/chị thuộc loại nào ạ?" }],
    },
  ],
  lesson_liquor: [
    {
      titleVi: "Thích A hay B: 喜欢…还是…",
      pattern: "您喜欢 + A + 还是 + B？",
      bodyVi: "喜欢 (xǐhuān) = thích. Ghép 还是 để hỏi gu khách.",
      examples: [{ text: "您喜欢威士忌还是干邑？", gloss: "Nín xǐhuān wēishìjì háishì gānyì?", vi: "Anh/chị thích whisky hay cognac ạ?" }],
    },
  ],
  lesson_tobacco: [
    {
      titleVi: "Lấy loại nào: 您要 A 还是 B",
      pattern: "您要 + A + 还是 + B？",
      bodyVi: "您要…还是…？ để hỏi khách chọn loại/đơn vị nào.",
      examples: [{ text: "您要软盒还是硬盒？", gloss: "Nín yào ruǎn hé háishì yìng hé?", vi: "Anh/chị lấy bao mềm hay bao cứng ạ?" }],
    },
  ],
  lesson_confectionery: [
    {
      titleVi: "Hợp để…: 适合 + danh từ/动词",
      pattern: "(这个)很适合 + [送礼/danh từ]",
      bodyVi: "适合 (shìhé) = hợp/phù hợp. 适合送礼 = hợp để làm quà.",
      examples: [{ text: "这个很适合送礼。", gloss: "Zhège hěn shìhé sònglǐ.", vi: "Cái này rất hợp làm quà." }],
    },
  ],
};
