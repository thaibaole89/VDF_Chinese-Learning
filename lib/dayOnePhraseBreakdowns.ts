// Day-One phrase vocabulary + grammar breakdowns (Phase 2A.7).
//
// Structured Vietnamese-language teaching content for each of the 10 Day-One
// survival phrases. Kept as a typed TS const so the validator stays focused
// on the JSON content tree and so types remain strict at the call site.
//
// Audience: VDF shop-floor sales staff with little-to-no Mandarin background.
// Language style: clear, conversational Vietnamese — NOT academic linguistics.
// Goal: learner understands every token, the word order, and how/when to
// say the phrase at the counter.

export type BreakdownToken = {
  zh: string;
  pinyin: string;
  vi: string;
  /** Role in the sentence — kept short and learner-friendly. */
  role: string;
};

export type BreakdownAlternative = {
  zh: string;
  pinyin: string;
  vi: string;
};

export type BreakdownReplaceable = {
  /** The slot in the original phrase that can be swapped (Chinese). */
  slot: string;
  /** Vietnamese label describing the slot. */
  slotVi: string;
  alternatives: BreakdownAlternative[];
};

export type BreakdownMistake = {
  /** Short Vietnamese description of what learners get wrong. */
  wrongVi: string;
  /** Why it's wrong / what the right move is. */
  noteVi: string;
};

export type BreakdownExample = {
  zh: string;
  pinyin: string;
  vi: string;
  noteVi?: string;
};

export type PhraseBreakdown = {
  phraseId: string;
  tokens: BreakdownToken[];
  pattern: { zh: string; vi: string };
  usageVi: string;
  whyOrderVi: string;
  replaceable: BreakdownReplaceable[];
  mistakes: BreakdownMistake[];
  extraExample?: BreakdownExample;
};

export const DAY_ONE_PHRASE_BREAKDOWNS: Record<string, PhraseBreakdown> = {
  // ============================================================
  // 1. 您好，欢迎光临！
  // ============================================================
  sp_day1_1: {
    phraseId: "sp_day1_1",
    tokens: [
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "đại từ chỉ khách, trang trọng" },
      { zh: "好", pinyin: "hǎo", vi: "tốt — ghép với 您 thành lời chào", role: "tính từ ghép vào lời chào" },
      { zh: "欢迎", pinyin: "huānyíng", vi: "chào mừng", role: "động từ chào đón" },
      { zh: "光临", pinyin: "guānglín", vi: "ghé thăm (trang trọng)", role: "động từ trang trọng — “quang lâm”" },
    ],
    pattern: { zh: "您好 + 欢迎光临", vi: "lời chào cá nhân + lời mời cửa hàng" },
    usageVi:
      "Câu đầu tiên khi khách bước vào quầy. Nở nụ cười + giao tiếp mắt + nói chậm rõ. Có thể nói luôn khi vừa nhìn thấy khách bước đến.",
    whyOrderVi:
      "Tiếng Trung chào người trước, mời vào cửa hàng sau: “您好” (chào quý khách) → “欢迎光临” (mừng quý khách đến). Đảo ngược nghe gượng và không tự nhiên.",
    replaceable: [
      {
        slot: "您好",
        slotVi: "lời chào theo thời gian trong ngày",
        alternatives: [
          { zh: "早上好", pinyin: "Zǎoshang hǎo", vi: "Chào buổi sáng" },
          { zh: "下午好", pinyin: "Xiàwǔ hǎo", vi: "Chào buổi chiều" },
          { zh: "晚上好", pinyin: "Wǎnshang hǎo", vi: "Chào buổi tối" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Dùng 你好 (nǐ hǎo) thay 您好 với khách Trung Quốc lớn tuổi",
        noteVi:
          "你好 là chào thân mật, dùng với bạn bè. Khách hàng — đặc biệt người lớn tuổi — phải dùng 您好 mới đủ kính.",
      },
      {
        wrongVi: "Bỏ luôn 您好, chỉ nói 欢迎光临",
        noteVi:
          "Thiếu lời chào cá nhân nghe như loa phát thanh tự động. Luôn chào người trước, mời vào cửa hàng sau.",
      },
    ],
    extraExample: {
      zh: "您好，请进。",
      pinyin: "Nín hǎo, qǐng jìn.",
      vi: "Xin chào quý khách, mời vào ạ.",
      noteVi: "Phiên bản ngắn gọn hơn, dùng khi cửa hàng đông và phải chào nhanh nhiều khách.",
    },
  },

  // ============================================================
  // 2. 请问您想看什么产品？
  // ============================================================
  sp_day1_2: {
    phraseId: "sp_day1_2",
    tokens: [
      { zh: "请问", pinyin: "qǐng wèn", vi: "cho phép hỏi (lịch sự)", role: "cụm mở đầu câu hỏi lịch sự" },
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "chủ ngữ — khách" },
      { zh: "想", pinyin: "xiǎng", vi: "muốn", role: "trợ động từ chỉ ý muốn" },
      { zh: "看", pinyin: "kàn", vi: "xem", role: "động từ chính" },
      { zh: "什么", pinyin: "shénme", vi: "gì", role: "đại từ nghi vấn — đứng trước danh từ" },
      { zh: "产品", pinyin: "chǎnpǐn", vi: "sản phẩm", role: "danh từ — đối tượng được xem" },
    ],
    pattern: {
      zh: "请问 + 您 + 想 + 看 + 什么 + 产品?",
      vi: "[lịch sự] + chủ ngữ + muốn + động từ + 什么 + danh từ",
    },
    usageVi:
      "Câu hỏi mở khi khách vừa vào, chưa nói rõ muốn gì. Tốt nhất dùng sau câu chào để mời khách nói chuyện.",
    whyOrderVi:
      "Tiếng Trung đặt 什么 (gì) ĐỨNG TRƯỚC danh từ, ngược tiếng Việt. Tiếng Việt: “sản phẩm gì”. Tiếng Trung: “什么产品” (gì sản phẩm). Quen mẫu này sẽ áp dụng được cho nhiều câu hỏi khác.",
    replaceable: [
      {
        slot: "产品",
        slotVi: "loại hàng cụ thể nếu đã hướng được",
        alternatives: [
          { zh: "香水", pinyin: "xiāngshuǐ", vi: "nước hoa" },
          { zh: "口红", pinyin: "kǒuhóng", vi: "son môi" },
          { zh: "礼物", pinyin: "lǐwù", vi: "quà" },
          { zh: "酒", pinyin: "jiǔ", vi: "rượu" },
        ],
      },
      {
        slot: "想看",
        slotVi: "động từ chính nếu đã chắc khách mua",
        alternatives: [
          { zh: "想买", pinyin: "xiǎng mǎi", vi: "muốn mua" },
          { zh: "需要", pinyin: "xūyào", vi: "cần" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Đặt 什么 SAU 产品 → “产品什么”",
        noteVi: "Sai trật tự. Trong câu hỏi tiếng Trung, 什么 phải ĐỨNG TRƯỚC danh từ: “什么产品”.",
      },
      {
        wrongVi: "Quên 想 → “您看什么产品”",
        noteVi:
          "“您看什么产品” nghĩa là “anh/chị xem sản phẩm gì”, kém tự nhiên. Có 想 mới rõ ý “muốn xem”.",
      },
      {
        wrongVi: "Bỏ 请问 đi thẳng vào câu hỏi",
        noteVi: "Thiếu 请问 nghe cộc, giống đang tra hỏi. Có 请问 mới đủ lịch sự đầu ca.",
      },
    ],
    extraExample: {
      zh: "请问您想买什么？",
      pinyin: "Qǐngwèn nín xiǎng mǎi shénme?",
      vi: "Cho hỏi quý khách muốn mua gì ạ?",
    },
  },

  // ============================================================
  // 3. 您喜欢什么品牌？
  // ============================================================
  sp_day1_3: {
    phraseId: "sp_day1_3",
    tokens: [
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "chủ ngữ — khách" },
      { zh: "喜欢", pinyin: "xǐhuan", vi: "thích", role: "động từ chính" },
      { zh: "什么", pinyin: "shénme", vi: "gì", role: "đại từ nghi vấn — trước danh từ" },
      { zh: "品牌", pinyin: "pǐnpái", vi: "thương hiệu", role: "danh từ" },
    ],
    pattern: { zh: "您 + 喜欢 + 什么 + 品牌?", vi: "chủ ngữ + động từ + 什么 + danh từ" },
    usageVi:
      "Dùng khi khách đã chỉ vào quầy nhưng chưa chọn thương hiệu — hoặc khi muốn gợi ý sản phẩm theo gu khách.",
    whyOrderVi:
      "Cùng mẫu “什么 + danh từ” như câu hỏi “sản phẩm gì”. Câu này NGẮN hơn (không có 请问) vẫn ổn nhờ đại từ 您 đảm bảo phép lịch sự.",
    replaceable: [
      {
        slot: "品牌",
        slotVi: "thuộc tính khách quan tâm",
        alternatives: [
          { zh: "颜色", pinyin: "yánsè", vi: "màu" },
          { zh: "味道", pinyin: "wèidao", vi: "mùi / vị" },
          { zh: "包装", pinyin: "bāozhuāng", vi: "kiểu hộp / bao bì" },
          { zh: "价位", pinyin: "jiàwèi", vi: "tầm giá" },
        ],
      },
      {
        slot: "喜欢",
        slotVi: "động từ tuỳ ngữ cảnh",
        alternatives: [
          { zh: "想要", pinyin: "xiǎng yào", vi: "muốn lấy" },
          { zh: "需要", pinyin: "xūyào", vi: "cần" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Nói 你喜欢 thay 您喜欢",
        noteVi: "你 dành cho người thân, bạn bè. Khách dùng 您.",
      },
      {
        wrongVi: "Lẫn 喜欢 (xǐhuan) với 喜爱 (xǐ'ài)",
        noteVi: "喜爱 nặng hơn — gần “yêu quý”, dùng cho người/đam mê. Bán hàng dùng 喜欢.",
      },
    ],
    extraExample: {
      zh: "您喜欢这款吗？",
      pinyin: "Nín xǐhuan zhè kuǎn ma?",
      vi: "Quý khách có thích mẫu này không?",
      noteVi: "Câu hỏi đóng — dùng khi đã đưa khách xem một mẫu cụ thể.",
    },
  },

  // ============================================================
  // 4. 我可以给您推荐几款。
  // ============================================================
  sp_day1_4: {
    phraseId: "sp_day1_4",
    tokens: [
      { zh: "我", pinyin: "wǒ", vi: "tôi / em", role: "chủ ngữ — nhân viên" },
      { zh: "可以", pinyin: "kěyǐ", vi: "có thể", role: "trợ động từ" },
      { zh: "给", pinyin: "gěi", vi: "cho / giới thiệu cho", role: "giới từ chỉ đối tượng nhận" },
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "tân ngữ gián tiếp — người nhận" },
      { zh: "推荐", pinyin: "tuījiàn", vi: "giới thiệu / đề xuất", role: "động từ chính" },
      { zh: "几", pinyin: "jǐ", vi: "vài", role: "số đếm không xác định" },
      { zh: "款", pinyin: "kuǎn", vi: "mẫu / loại", role: "lượng từ cho sản phẩm" },
    ],
    pattern: {
      zh: "我 + 可以 + 给 + 您 + 推荐 + 几款",
      vi: "chủ ngữ + có thể + giới từ + người nhận + động từ chính + số + lượng từ",
    },
    usageVi:
      "Chủ động đề xuất sản phẩm khi khách đang phân vân — hoặc khi khách hỏi “có gì hay không”.",
    whyOrderVi:
      "Tiếng Trung đặt 给 + người nhận TRƯỚC động từ chính (推荐). Tiếng Việt nói “giới thiệu cho anh” — đảo ngược. Nhớ thứ tự: “给 + 您” (cho anh) → 推荐 (giới thiệu).",
    replaceable: [
      {
        slot: "几款",
        slotVi: "số lượng / chủng loại đề xuất",
        alternatives: [
          { zh: "这款", pinyin: "zhè kuǎn", vi: "mẫu này" },
          { zh: "新款", pinyin: "xīn kuǎn", vi: "mẫu mới" },
          { zh: "几个牌子", pinyin: "jǐ gè páizi", vi: "vài thương hiệu" },
        ],
      },
      {
        slot: "推荐",
        slotVi: "động từ chính",
        alternatives: [
          { zh: "介绍", pinyin: "jièshào", vi: "giới thiệu" },
          { zh: "看看", pinyin: "kànkan", vi: "cho xem thử" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Bỏ 几 → “我可以给您推荐款”",
        noteVi: "Thiếu số đếm trước 款 nên câu sai ngữ pháp. Phải có “几 + lượng từ”.",
      },
      {
        wrongVi: "Quên 给 → “我推荐您几款”",
        noteVi:
          "Vẫn hiểu được nhưng đổi cấu trúc. Câu mẫu VDF dùng “给 + 您 + 推荐” cho lịch sự và rõ ràng.",
      },
    ],
    extraExample: {
      zh: "我给您介绍一下。",
      pinyin: "Wǒ gěi nín jièshào yīxià.",
      vi: "Để em giới thiệu cho anh/chị một chút ạ.",
      noteVi: "Mẫu thay thế ngắn hơn, dùng khi muốn dẫn khách đến quầy.",
    },
  },

  // ============================================================
  // 5. 这个是免税价格。
  // ============================================================
  sp_day1_5: {
    phraseId: "sp_day1_5",
    tokens: [
      { zh: "这个", pinyin: "zhège", vi: "cái này", role: "đại từ chỉ định — chỉ vào sản phẩm" },
      { zh: "是", pinyin: "shì", vi: "là", role: "động từ liên kết" },
      { zh: "免税", pinyin: "miǎnshuì", vi: "miễn thuế", role: "tính từ ghép trước danh từ" },
      { zh: "价格", pinyin: "jiàgé", vi: "giá", role: "danh từ chính" },
    ],
    pattern: { zh: "这个 + 是 + 免税 + 价格", vi: "cái này + là + tính từ + giá" },
    usageVi:
      "Khi khách hỏi giá, hoặc tỏ vẻ ngạc nhiên về mức giá. Nhấn vào chữ 免税 để khách biết đây là lợi thế cửa hàng.",
    whyOrderVi:
      "Tính từ 免税 đứng TRƯỚC danh từ 价格 (giống tiếng Anh “duty-free price”), ngược tiếng Việt “giá miễn thuế”. Nhớ: thuộc tính trước, sự vật sau.",
    replaceable: [
      {
        slot: "免税",
        slotVi: "loại giá",
        alternatives: [
          { zh: "优惠", pinyin: "yōuhuì", vi: "khuyến mãi" },
          { zh: "活动", pinyin: "huódòng", vi: "(của) đợt khuyến mãi" },
          { zh: "现在", pinyin: "xiànzài", vi: "hiện tại" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Đặt 价格 trước 免税 → “这个是价格免税”",
        noteVi: "Sai trật tự. Trong tiếng Trung, tính từ luôn đứng TRƯỚC danh từ nó bổ nghĩa.",
      },
      {
        wrongVi: "Quên 是 → “这个免税价格”",
        noteVi: "Câu thiếu động từ liên kết, nghe ngỡ chưa hết câu.",
      },
    ],
    extraExample: {
      zh: "这是优惠价。",
      pinyin: "Zhè shì yōuhuì jià.",
      vi: "Đây là giá khuyến mãi ạ.",
      noteVi: "Phiên bản ngắn — dùng khi không nhấn vào ý “miễn thuế”.",
    },
  },

  // ============================================================
  // 6. 请出示您的护照和登机牌。
  // ============================================================
  sp_day1_6: {
    phraseId: "sp_day1_6",
    tokens: [
      { zh: "请", pinyin: "qǐng", vi: "xin / mời (kính ngữ)", role: "trạng từ kính ngữ mở câu" },
      { zh: "出示", pinyin: "chūshì", vi: "xuất trình", role: "động từ chính (trang trọng)" },
      { zh: "您的", pinyin: "nín de", vi: "của anh / chị", role: "sở hữu cách — của khách" },
      { zh: "护照", pinyin: "hùzhào", vi: "hộ chiếu", role: "danh từ A" },
      { zh: "和", pinyin: "hé", vi: "và", role: "liên từ nối hai danh từ" },
      { zh: "登机牌", pinyin: "dēngjīpái", vi: "thẻ lên máy bay", role: "danh từ B" },
    ],
    pattern: {
      zh: "请 + 出示 + 您的 + (danh từ A) + 和 + (danh từ B)",
      vi: "kính ngữ + động từ + sở hữu + danh từ A + và + danh từ B",
    },
    usageVi:
      "Đề nghị khách xuất trình giấy tờ khi mua hàng miễn thuế. Luôn mỉm cười, đưa tay nhận giấy tờ bằng hai tay khi khách chìa ra.",
    whyOrderVi:
      "请 luôn đứng ĐẦU câu — đây là tín hiệu lịch sự bắt buộc. 您的 (của anh/chị) đứng TRƯỚC danh từ vì tiếng Trung dùng cấu trúc “sở hữu + sự vật”. 和 nối hai danh từ — luôn ĐỨNG GIỮA, không bao giờ ở cuối câu.",
    replaceable: [
      {
        slot: "护照",
        slotVi: "giấy tờ định danh chính (tuỳ quy định)",
        alternatives: [
          { zh: "身份证", pinyin: "shēnfènzhèng", vi: "chứng minh thư / căn cước" },
          { zh: "证件", pinyin: "zhèngjiàn", vi: "giấy tờ (chung)" },
        ],
      },
      {
        slot: "出示",
        slotVi: "động từ chính",
        alternatives: [
          { zh: "拿出", pinyin: "ná chū", vi: "lấy ra" },
          { zh: "给我看", pinyin: "gěi wǒ kàn", vi: "cho em xem" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Quên 请 → “出示您的护照和登机牌”",
        noteVi: "Thiếu 请 câu thành mệnh lệnh, khách dễ thấy bị ép, đặc biệt người lớn tuổi.",
      },
      {
        wrongVi: "Đặt 和 cuối câu → “您的护照登机牌和”",
        noteVi: "和 luôn ĐỨNG GIỮA hai danh từ, không bao giờ ở cuối câu. Khác hẳn tiếng Anh “and”.",
      },
      {
        wrongVi: "Dùng 你的 thay 您的",
        noteVi: "Khi yêu cầu giấy tờ, phải dùng kính ngữ 您的 để giữ phép tôn trọng khách.",
      },
    ],
    extraExample: {
      zh: "请稍等一下。",
      pinyin: "Qǐng shāo děng yīxià.",
      vi: "Xin quý khách đợi một chút ạ.",
      noteVi: "Mẫu kính ngữ tương tự — dùng khi cần thời gian kiểm tra giấy tờ / kho.",
    },
  },

  // ============================================================
  // 7. 您要刷卡还是扫码支付？
  // ============================================================
  sp_day1_7: {
    phraseId: "sp_day1_7",
    tokens: [
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "chủ ngữ — khách" },
      { zh: "要", pinyin: "yào", vi: "muốn / định", role: "trợ động từ" },
      { zh: "刷卡", pinyin: "shuākǎ", vi: "quẹt thẻ", role: "phương thức A" },
      { zh: "还是", pinyin: "háishì", vi: "hay là", role: "liên từ cho câu hỏi A-hay-B" },
      { zh: "扫码", pinyin: "sǎomǎ", vi: "quét mã (QR)", role: "phương thức B" },
      { zh: "支付", pinyin: "zhīfù", vi: "thanh toán", role: "động từ chính chỉ hành động" },
    ],
    pattern: {
      zh: "您 + 要 + (lựa chọn A) + 还是 + (lựa chọn B) + 支付?",
      vi: "chủ ngữ + muốn + A + hay là + B + thanh toán",
    },
    usageVi:
      "Hỏi cách thanh toán sau khi khách đã chốt sản phẩm. Nói rõ từng phương thức để khách dễ chọn.",
    whyOrderVi:
      "还是 luôn ĐỨNG GIỮA hai lựa chọn — đây là dấu hiệu câu hỏi “A hay B”. Không dùng 或者 (huòzhě) trong câu hỏi — 或者 chỉ dành cho câu khẳng định (“tôi sẽ dùng A hoặc B”).",
    replaceable: [
      {
        slot: "刷卡 / 扫码",
        slotVi: "hai phương thức thanh toán",
        alternatives: [
          { zh: "现金", pinyin: "xiànjīn", vi: "tiền mặt" },
          { zh: "支付宝", pinyin: "Zhīfùbǎo", vi: "Alipay" },
          { zh: "微信支付", pinyin: "Wēixìn zhīfù", vi: "WeChat Pay" },
          { zh: "银联卡", pinyin: "yínlián kǎ", vi: "thẻ UnionPay" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Dùng 或者 thay 还是 → “您要刷卡或者扫码？”",
        noteVi: "或者 chỉ dùng cho câu khẳng định/giả định. Câu hỏi “A hay B” bắt buộc dùng 还是.",
      },
      {
        wrongVi: "Bỏ 您要 → đi thẳng “刷卡还是扫码？”",
        noteVi: "Vẫn hiểu nhưng cộc. Có 您要 mới đủ lịch sự và rõ chủ thể.",
      },
    ],
    extraExample: {
      zh: "您用支付宝还是微信？",
      pinyin: "Nín yòng Zhīfùbǎo háishì Wēixìn?",
      vi: "Quý khách dùng Alipay hay WeChat ạ?",
      noteVi: "Cùng cấu trúc 还是. Hữu ích khi khách chọn quét mã rồi cần biết app nào.",
    },
  },

  // ============================================================
  // 8. 付款成功了，这是您的小票。
  // ============================================================
  sp_day1_8: {
    phraseId: "sp_day1_8",
    tokens: [
      { zh: "付款", pinyin: "fùkuǎn", vi: "thanh toán", role: "danh động từ — hành động trả tiền" },
      { zh: "成功", pinyin: "chénggōng", vi: "thành công", role: "tính từ — kết quả" },
      { zh: "了", pinyin: "le", vi: "rồi (chỉ đã xong)", role: "trợ từ báo việc đã hoàn thành" },
      { zh: "这", pinyin: "zhè", vi: "đây", role: "chỉ định từ — chỉ vào tờ hóa đơn" },
      { zh: "是", pinyin: "shì", vi: "là", role: "động từ liên kết" },
      { zh: "您的", pinyin: "nín de", vi: "của anh / chị", role: "sở hữu cách" },
      { zh: "小票", pinyin: "xiǎopiào", vi: "hóa đơn (nhỏ)", role: "danh từ — tờ hóa đơn" },
    ],
    pattern: {
      zh: "[hành động] + 成功 + 了 ，这是 + 您的 + [vật trao]",
      vi: "[hành động] đã xong + đây là [vật] của anh/chị",
    },
    usageVi:
      "Xác nhận thanh toán xong + trao hóa đơn. Nói liền mạch — đầu câu xác nhận, sau dấu phẩy là trao đồ.",
    whyOrderVi:
      "了 LUÔN đứng SAU 成功 để báo “đã xong”. Không có 了 nghe như tường thuật khô. 这是 mở đầu cho phần trao vật — cố định, không đảo.",
    replaceable: [
      {
        slot: "小票",
        slotVi: "vật trao tay khách",
        alternatives: [
          { zh: "收据", pinyin: "shōujù", vi: "biên lai" },
          { zh: "商品", pinyin: "shāngpǐn", vi: "sản phẩm" },
          { zh: "找的零钱", pinyin: "zhǎo de língqián", vi: "tiền thừa" },
        ],
      },
      {
        slot: "付款",
        slotVi: "hành động xác nhận",
        alternatives: [
          { zh: "支付", pinyin: "zhīfù", vi: "thanh toán (trang trọng hơn)" },
          { zh: "扫码", pinyin: "sǎomǎ", vi: "quét mã" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Quên 了 → “付款成功，这是您的小票”",
        noteVi: "Thiếu trợ từ 了 nên câu mất cảm giác “đã xong”. Khách Trung Quốc rất chú ý điểm này.",
      },
      {
        wrongVi: "Đặt 您的 SAU danh từ → “这是小票您的”",
        noteVi: "Sai trật tự sở hữu. Tiếng Trung luôn là “您的 + danh từ”.",
      },
    ],
    extraExample: {
      zh: "这是您的商品，请收好。",
      pinyin: "Zhè shì nín de shāngpǐn, qǐng shōu hǎo.",
      vi: "Đây là sản phẩm của quý khách, xin cất kỹ ạ.",
      noteVi: "Mẫu trao đồ cuối ca — cùng cấu trúc 这是 + 您的.",
    },
  },

  // ============================================================
  // 9. 不好意思，这款现在没有货。
  // ============================================================
  sp_day1_9: {
    phraseId: "sp_day1_9",
    tokens: [
      { zh: "不好意思", pinyin: "bùhǎoyìsi", vi: "xin lỗi / ngại quá (nhẹ)", role: "cụm xin lỗi mở đầu" },
      { zh: "这款", pinyin: "zhè kuǎn", vi: "mẫu này", role: "chủ ngữ — sản phẩm cụ thể" },
      { zh: "现在", pinyin: "xiànzài", vi: "hiện tại / bây giờ", role: "trạng từ thời gian" },
      { zh: "没有", pinyin: "méiyǒu", vi: "không có", role: "phủ định động từ 有" },
      { zh: "货", pinyin: "huò", vi: "hàng (hoá)", role: "danh từ — chỉ hàng tồn kho" },
    ],
    pattern: {
      zh: "不好意思，+ chủ ngữ + 现在 + 没有 + 货",
      vi: "xin lỗi + chủ ngữ + thời gian + không có + hàng",
    },
    usageVi:
      "Báo hết hàng. Tránh nói cộc “没了” (hết rồi) — quá ngắn cho khách. Có 不好意思 + 现在 mới mềm và mở đường cho phương án thay thế.",
    whyOrderVi:
      "Trạng từ thời gian (现在) đứng TRƯỚC động từ (没有), khác tiếng Việt “không có hàng hiện tại”. Tiếng Trung là “hiện tại không có”.",
    replaceable: [
      {
        slot: "这款",
        slotVi: "phạm vi hết hàng",
        alternatives: [
          { zh: "这个", pinyin: "zhège", vi: "cái này" },
          { zh: "这个颜色", pinyin: "zhège yánsè", vi: "màu này" },
          { zh: "这个尺码", pinyin: "zhège chǐmǎ", vi: "cỡ này" },
        ],
      },
      {
        slot: "现在",
        slotVi: "phạm vi thời gian",
        alternatives: [
          { zh: "今天", pinyin: "jīntiān", vi: "hôm nay" },
          { zh: "这两天", pinyin: "zhè liǎng tiān", vi: "mấy hôm nay" },
          { zh: "暂时", pinyin: "zànshí", vi: "tạm thời" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Dùng 对不起 (duìbuqǐ) thay 不好意思",
        noteVi:
          "对不起 = xin lỗi nặng (cho lỗi lớn). Với hết hàng / phiền nhỏ, dùng 不好意思 nhẹ và đúng văn hoá hơn.",
      },
      {
        wrongVi: "Đặt 现在 SAU 没有 → “没有现在货”",
        noteVi: "Sai trật tự trạng từ thời gian. Tiếng Trung trạng từ luôn TRƯỚC động từ.",
      },
      {
        wrongVi: "Chỉ nói 没了 với khách lạ",
        noteVi: "没了 quá ngắn cho khách, dễ thấy bị từ chối thẳng. Câu mẫu VDF lịch sự hơn nhiều.",
      },
    ],
    extraExample: {
      zh: "不好意思，让您久等了。",
      pinyin: "Bùhǎoyìsi, ràng nín jiǔ děng le.",
      vi: "Xin lỗi đã để quý khách đợi lâu ạ.",
      noteVi: "Cùng mở đầu 不好意思 — dùng khi quầy đông, khách chờ lâu.",
    },
  },

  // ============================================================
  // 10. 谢谢您，祝您旅途愉快。
  // ============================================================
  sp_day1_10: {
    phraseId: "sp_day1_10",
    tokens: [
      { zh: "谢谢", pinyin: "xièxie", vi: "cảm ơn", role: "động từ cảm ơn" },
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "đối tượng cảm ơn" },
      { zh: "祝", pinyin: "zhù", vi: "chúc", role: "động từ chúc tụng" },
      { zh: "您", pinyin: "nín", vi: "anh / chị (kính ngữ)", role: "người nhận lời chúc" },
      { zh: "旅途", pinyin: "lǚtú", vi: "hành trình / chuyến đi", role: "danh từ — nội dung được chúc" },
      { zh: "愉快", pinyin: "yúkuài", vi: "vui vẻ", role: "tính từ — chốt câu chúc" },
    ],
    pattern: {
      zh: "谢谢您，+ 祝 + 您 + [danh từ] + 愉快",
      vi: "cảm ơn + chúc + người nhận + danh từ + vui vẻ",
    },
    usageVi:
      "Câu kết khi tiễn khách rời quầy. Nói chậm, mỉm cười, gật đầu nhẹ. Đây là ấn tượng cuối — đầu tư công sức ngang câu chào.",
    whyOrderVi:
      "Cấu trúc “祝 + người nhận + nội dung + tính từ”. Tiếng Việt nói “chúc anh chuyến đi vui vẻ” — tiếng Trung 旅途 đứng GIỮA, 愉快 đứng CUỐI để chốt câu chúc.",
    replaceable: [
      {
        slot: "旅途",
        slotVi: "nội dung chúc tuỳ ngữ cảnh",
        alternatives: [
          { zh: "一天", pinyin: "yī tiān", vi: "một ngày" },
          { zh: "周末", pinyin: "zhōumò", vi: "cuối tuần" },
          { zh: "假期", pinyin: "jiàqī", vi: "kỳ nghỉ" },
          { zh: "购物", pinyin: "gòuwù", vi: "việc mua sắm" },
        ],
      },
    ],
    mistakes: [
      {
        wrongVi: "Bỏ 您 sau 祝 → “祝旅途愉快”",
        noteVi:
          "Câu vẫn được hiểu nhưng kém kính. Câu mẫu VDF có 您 để xác nhận đang chúc trực tiếp khách.",
      },
      {
        wrongVi: "Dùng 高兴 (gāoxìng - vui) thay 愉快",
        noteVi:
          "高兴 nghe trẻ con, kém trang trọng. 愉快 mới đúng văn phong dịch vụ.",
      },
      {
        wrongVi: "Đặt 愉快 TRƯỚC 旅途 → “祝您愉快旅途”",
        noteVi: "Sai trật tự. Trong cấu trúc chúc, tính từ luôn ĐỨNG SAU danh từ được chúc.",
      },
    ],
    extraExample: {
      zh: "祝您一路平安！",
      pinyin: "Zhù nín yīlù píng'ān!",
      vi: "Chúc quý khách thượng lộ bình an!",
      noteVi: "Mẫu thay thế — đặc biệt phù hợp với khách lớn tuổi.",
    },
  },
};

export function getDayOneBreakdown(phraseId: string): PhraseBreakdown | undefined {
  return DAY_ONE_PHRASE_BREAKDOWNS[phraseId];
}
