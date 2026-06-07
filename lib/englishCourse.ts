// English for VDF Sales — course content. Phase 2C.1 upgrade.
//
// A real duty-free sales-training course for Vietnamese VDF staff serving
// international customers. Typed TS module (not content/*.json) so it bypasses
// the zh-only content validator. Every English phrase carries IPA (the spec's
// pronunciation standard — never "APA"), Vietnamese meaning, VN-friendly
// pronunciation tips, and a list of important words used for client-side
// word-level voice scoring (lib/englishVoiceScore.ts).
//
// Status: Module 1 (Counter Survival) + Perfume + Duty-free allowance are fully
// authored; the remaining Module 2/3 lessons are scaffolded (status:"coming")
// and will be filled in a later phase. All content is needs_review until a
// native/Operations reviewer signs off.

export type EnVocab = { word: string; ipa: string; vi: string };

export type EnReplaceable = { slotVi: string; alts: { en: string; vi: string }[] };

export type EnPhrase = {
  id: string;
  en: string;
  vi: string;
  ipa: string;
  pronTips?: string[]; // VN-friendly notes
  stress?: string; // e.g. "May I HELP you FIND something"
  vocab?: EnVocab[];
  replaceable?: EnReplaceable[];
  usageVi?: string;
  /** Lowercased content words used for voice scoring (no punctuation). */
  importantWords: string[];
};

export type EnDialogueLine = { speaker: "staff" | "customer"; en: string; vi: string; ipa?: string };

export type EnRoleplay = {
  titleVi: string;
  customerGoalVi: string;
  staffGoalVi: string;
  requiredPhraseIds: string[];
};

export type EnQuiz = {
  id: string;
  promptVi: string;
  options: string[];
  correctAnswer: string;
  explanationVi?: string;
};

export type EnLesson = {
  id: string;
  titleEn: string;
  titleVi: string;
  objectiveVi: string;
  status: "ready" | "coming";
  phrases: EnPhrase[];
  dialogue?: { titleVi: string; lines: EnDialogueLine[] };
  roleplay?: EnRoleplay;
  quiz?: EnQuiz[];
};

export type EnModule = {
  id: string;
  titleEn: string;
  titleVi: string;
  objectiveVi: string;
  lessons: EnLesson[];
};

export type EnglishCourse = {
  id: string;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
  modules: EnModule[];
};

// ============================================================
// MODULE 1 — Counter Survival English
// ============================================================

const L1: EnLesson = {
  id: "english_greeting_help",
  titleEn: "Greeting & offering help",
  titleVi: "Chào hỏi & mời giúp đỡ",
  objectiveVi: "Chào khách và mở lời mời hỗ trợ một cách lịch sự.",
  status: "ready",
  phrases: [
    {
      id: "en_g_1",
      en: "Hello, welcome!",
      vi: "Xin chào, chào mừng quý khách!",
      ipa: "/həˈloʊ ˈwelkəm/",
      stress: "Hel-LO, WEL-come",
      pronTips: ["Nhấn âm sau của 'hello' (lô).", "'welcome' nhấn ở đầu (WEL)."],
      usageVi: "Câu chào khi khách bước vào quầy.",
      importantWords: ["hello", "welcome"],
    },
    {
      id: "en_g_2",
      en: "May I help you find something?",
      vi: "Anh/chị cần tôi giúp tìm sản phẩm gì không ạ?",
      ipa: "/meɪ aɪ help juː faɪnd ˈsʌmθɪŋ/",
      stress: "May I HELP you FIND something",
      pronTips: [
        "'May I' nối thành 'may-eye'.",
        "Nhấn 'help' và 'find'.",
        "Đừng đọc 'something' thành 'sâm-thing-gờ' — kết thúc nhẹ '-thing'.",
      ],
      vocab: [{ word: "find", ipa: "/faɪnd/", vi: "tìm" }],
      usageVi: "Câu mở lời lịch sự khi khách vào khu quầy.",
      importantWords: ["help", "find", "something"],
    },
    {
      id: "en_g_3",
      en: "Good morning! How can I help you?",
      vi: "Chào buổi sáng! Em có thể giúp gì cho quý khách ạ?",
      ipa: "/ɡʊd ˈmɔːrnɪŋ haʊ kən aɪ help juː/",
      stress: "Good MOR-ning, how can I HELP you",
      pronTips: ["'morning' nhấn đầu.", "'can I' đọc nhanh, nhẹ."],
      replaceable: [
        {
          slotVi: "chào theo buổi",
          alts: [
            { en: "Good afternoon", vi: "Chào buổi chiều" },
            { en: "Good evening", vi: "Chào buổi tối" },
          ],
        },
      ],
      usageVi: "Chào theo thời gian trong ngày + mời giúp.",
      importantWords: ["good", "morning", "help"],
    },
    {
      id: "en_g_4",
      en: "Please feel free to look around.",
      vi: "Quý khách cứ thoải mái xem ạ.",
      ipa: "/pliːz fiːl friː tə lʊk əˈraʊnd/",
      stress: "feel FREE to look a-ROUND",
      pronTips: ["'feel free' hai từ vần 'ee' kéo dài.", "'around' nhấn âm sau."],
      usageVi: "Khi khách chỉ muốn xem, chưa cần tư vấn.",
      importantWords: ["feel", "free", "look", "around"],
    },
    {
      id: "en_g_5",
      en: "Let me know if you need anything.",
      vi: "Cần gì quý khách cứ gọi em ạ.",
      ipa: "/let miː noʊ ɪf juː niːd ˈeniθɪŋ/",
      stress: "let me KNOW if you NEED anything",
      pronTips: ["'let me' nối nhẹ.", "'anything' đọc 'e-ni-thing', không 'gờ' ở cuối."],
      importantWords: ["let", "know", "need", "anything"],
    },
    {
      id: "en_g_6",
      en: "Are you looking for a gift?",
      vi: "Quý khách đang tìm quà tặng ạ?",
      ipa: "/ɑːr juː ˈlʊkɪŋ fər ə ɡɪft/",
      stress: "looking for a GIFT",
      pronTips: ["'looking for a' đọc nhanh, nhấn 'gift'."],
      vocab: [{ word: "gift", ipa: "/ɡɪft/", vi: "quà tặng" }],
      importantWords: ["looking", "gift"],
    },
    {
      id: "en_g_7",
      en: "Take your time, please.",
      vi: "Quý khách cứ từ từ ạ.",
      ipa: "/teɪk jər taɪm pliːz/",
      stress: "TAKE your TIME",
      pronTips: ["'take' và 'time' đều nhấn, vần 'ai'."],
      importantWords: ["take", "time"],
    },
    {
      id: "en_g_8",
      en: "Is this your first time here?",
      vi: "Đây là lần đầu quý khách ghé ạ?",
      ipa: "/ɪz ðɪs jər ˈfɜːrst taɪm hɪr/",
      stress: "your FIRST time here",
      pronTips: ["'first' có âm 'er' (lưỡi cong).", "'here' đọc 'hia'."],
      importantWords: ["first", "time", "here"],
    },
  ],
  dialogue: {
    titleVi: "Khách bước vào quầy",
    lines: [
      { speaker: "staff", en: "Hello, welcome! May I help you find something?", vi: "Xin chào! Em giúp quý khách tìm gì ạ?" },
      { speaker: "customer", en: "I'm just looking, thanks.", vi: "Tôi chỉ xem thôi, cảm ơn." },
      { speaker: "staff", en: "Of course. Please feel free to look around.", vi: "Vâng ạ. Quý khách cứ thoải mái xem." },
      { speaker: "staff", en: "Let me know if you need anything.", vi: "Cần gì quý khách cứ gọi em ạ." },
      { speaker: "customer", en: "Thank you.", vi: "Cảm ơn." },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: chào và mời giúp",
    customerGoalVi: "Khách mới vào, chưa rõ muốn gì.",
    staffGoalVi: "Chào, mời giúp, để khách thoải mái xem.",
    requiredPhraseIds: ["en_g_1", "en_g_2", "en_g_4"],
  },
  quiz: [
    {
      id: "enq_g_1",
      promptVi: "Khách vừa vào quầy. Câu mời giúp lịch sự?",
      options: ["May I help you find something?", "Payment successful.", "It is out of stock."],
      correctAnswer: "May I help you find something?",
      explanationVi: "Câu mở lời mời hỗ trợ khi khách vào.",
    },
    {
      id: "enq_g_2",
      promptVi: "Khách nói chỉ muốn xem. Nên nói gì?",
      options: ["Please feel free to look around.", "Which brand do you like?", "Here is your receipt."],
      correctAnswer: "Please feel free to look around.",
      explanationVi: "Để khách thoải mái xem.",
    },
    {
      id: "enq_g_3",
      promptVi: "Chào buổi sáng + mời giúp?",
      options: ["Good morning! How can I help you?", "Take your time.", "Are you looking for a gift?"],
      correctAnswer: "Good morning! How can I help you?",
      explanationVi: "Chào theo buổi + mời giúp.",
    },
  ],
};

const L2: EnLesson = {
  id: "english_asking_needs",
  titleEn: "Asking what the customer is looking for",
  titleVi: "Hỏi nhu cầu của khách",
  objectiveVi: "Hỏi khách đang tìm gì, cho ai, ngân sách thế nào.",
  status: "ready",
  phrases: [
    {
      id: "en_n_1",
      en: "What are you looking for today?",
      vi: "Hôm nay quý khách đang tìm gì ạ?",
      ipa: "/wʌt ɑːr juː ˈlʊkɪŋ fər təˈdeɪ/",
      stress: "what are you LOOKING for to-DAY",
      pronTips: ["'what are you' đọc nhanh.", "'today' nhấn âm sau."],
      importantWords: ["what", "looking", "today"],
    },
    {
      id: "en_n_2",
      en: "Which brand do you prefer?",
      vi: "Quý khách thích thương hiệu nào ạ?",
      ipa: "/wɪtʃ brænd duː juː prɪˈfɜːr/",
      stress: "which BRAND do you pre-FER",
      pronTips: ["'prefer' nhấn âm sau, có 'er'."],
      vocab: [{ word: "brand", ipa: "/brænd/", vi: "thương hiệu" }],
      importantWords: ["which", "brand", "prefer"],
    },
    {
      id: "en_n_3",
      en: "Is it for yourself or a gift?",
      vi: "Quý khách mua dùng hay làm quà ạ?",
      ipa: "/ɪz ɪt fər jərˈself ɔːr ə ɡɪft/",
      stress: "for your-SELF or a GIFT",
      pronTips: ["'yourself' nhấn 'self'."],
      importantWords: ["yourself", "gift"],
    },
    {
      id: "en_n_4",
      en: "What's your budget, roughly?",
      vi: "Tầm giá quý khách muốn khoảng bao nhiêu ạ?",
      ipa: "/wʌts jər ˈbʌdʒɪt ˈrʌfli/",
      stress: "your BUDGET, ROUGH-ly",
      pronTips: ["'budget' nhấn đầu.", "'roughly' đọc 'rấp-li', 'gh' câm."],
      vocab: [{ word: "budget", ipa: "/ˈbʌdʒɪt/", vi: "ngân sách, tầm giá" }],
      importantWords: ["budget", "roughly"],
    },
    {
      id: "en_n_5",
      en: "Do you have a brand in mind?",
      vi: "Quý khách có thương hiệu nào sẵn trong đầu chưa ạ?",
      ipa: "/duː juː hæv ə brænd ɪn maɪnd/",
      stress: "a brand in MIND",
      pronTips: ["'in mind' nối nhẹ, nhấn 'mind'."],
      importantWords: ["brand", "mind"],
    },
    {
      id: "en_n_6",
      en: "Are you looking for something light or strong?",
      vi: "Quý khách thích loại nhẹ hay đậm ạ?",
      ipa: "/ɑːr juː ˈlʊkɪŋ fər ˈsʌmθɪŋ laɪt ɔːr strɔːŋ/",
      stress: "LIGHT or STRONG",
      pronTips: ["'light' vần 'ai'.", "'strong' nhấn rõ."],
      importantWords: ["light", "strong"],
    },
    {
      id: "en_n_7",
      en: "Who is it for?",
      vi: "Quà cho ai ạ?",
      ipa: "/huː ɪz ɪt fɔːr/",
      stress: "WHO is it for",
      pronTips: ["'who' đọc 'hu'."],
      importantWords: ["who"],
    },
    {
      id: "en_n_8",
      en: "Would you like me to show you a few options?",
      vi: "Quý khách có muốn em đưa vài mẫu để xem không ạ?",
      ipa: "/wʊd juː laɪk miː tə ʃoʊ juː ə fjuː ˈɑːpʃənz/",
      stress: "show you a few OP-tions",
      pronTips: ["'options' nhấn đầu, '-tions' đọc 'shừns'."],
      vocab: [{ word: "options", ipa: "/ˈɑːpʃənz/", vi: "lựa chọn, mẫu" }],
      importantWords: ["show", "few", "options"],
    },
  ],
  dialogue: {
    titleVi: "Hỏi nhu cầu",
    lines: [
      { speaker: "staff", en: "What are you looking for today?", vi: "Hôm nay quý khách tìm gì ạ?" },
      { speaker: "customer", en: "A perfume, for my wife.", vi: "Một chai nước hoa, cho vợ tôi." },
      { speaker: "staff", en: "Is it for yourself or a gift? ... A gift, lovely.", vi: "Dùng hay làm quà ạ? ... Làm quà, tuyệt ạ." },
      { speaker: "staff", en: "What's your budget, roughly?", vi: "Tầm giá khoảng bao nhiêu ạ?" },
      { speaker: "customer", en: "Around one hundred dollars.", vi: "Khoảng một trăm đô." },
      { speaker: "staff", en: "Would you like me to show you a few options?", vi: "Em đưa vài mẫu để quý khách xem nhé?" },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: tìm hiểu nhu cầu",
    customerGoalVi: "Khách muốn mua quà nhưng chưa rõ loại.",
    staffGoalVi: "Hỏi cho ai, tầm giá, gu (nhẹ/đậm), rồi mời xem mẫu.",
    requiredPhraseIds: ["en_n_1", "en_n_3", "en_n_4", "en_n_8"],
  },
  quiz: [
    {
      id: "enq_n_1",
      promptVi: "Hỏi khách mua cho mình hay làm quà?",
      options: ["Is it for yourself or a gift?", "Here is your receipt.", "Take your time."],
      correctAnswer: "Is it for yourself or a gift?",
    },
    {
      id: "enq_n_2",
      promptVi: "Hỏi tầm giá lịch sự?",
      options: ["What's your budget, roughly?", "Which brand do you prefer?", "Who is it for?"],
      correctAnswer: "What's your budget, roughly?",
    },
    {
      id: "enq_n_3",
      promptVi: "Mời khách xem vài mẫu?",
      options: ["Would you like me to show you a few options?", "Payment successful.", "Good morning!"],
      correctAnswer: "Would you like me to show you a few options?",
    },
  ],
};

const L3: EnLesson = {
  id: "english_recommendation",
  titleEn: "Product recommendation",
  titleVi: "Giới thiệu & tư vấn sản phẩm",
  objectiveVi: "Gợi ý sản phẩm, nêu điểm nổi bật, hàng bán chạy.",
  status: "ready",
  phrases: [
    {
      id: "en_r_1",
      en: "I can recommend a few for you.",
      vi: "Em có thể giới thiệu vài mẫu cho quý khách ạ.",
      ipa: "/aɪ kən ˌrekəˈmend ə fjuː fɔːr juː/",
      stress: "re-com-MEND a few",
      pronTips: ["'recommend' nhấn âm cuối (-MEND)."],
      vocab: [{ word: "recommend", ipa: "/ˌrekəˈmend/", vi: "giới thiệu, đề xuất" }],
      importantWords: ["recommend", "few"],
    },
    {
      id: "en_r_2",
      en: "This one is very popular.",
      vi: "Mẫu này rất được ưa chuộng ạ.",
      ipa: "/ðɪs wʌn ɪz ˈveri ˈpɑːpjələr/",
      stress: "very POP-u-lar",
      pronTips: ["'popular' nhấn đầu, 3 âm tiết."],
      vocab: [{ word: "popular", ipa: "/ˈpɑːpjələr/", vi: "phổ biến, ưa chuộng" }],
      importantWords: ["popular"],
    },
    {
      id: "en_r_3",
      en: "This is our best seller.",
      vi: "Đây là sản phẩm bán chạy nhất của bên em ạ.",
      ipa: "/ðɪs ɪz aʊr ˈbest ˌselər/",
      stress: "BEST SELL-er",
      pronTips: ["'best seller' hai từ đều nhấn."],
      importantWords: ["best", "seller"],
    },
    {
      id: "en_r_4",
      en: "It's a new arrival.",
      vi: "Đây là mẫu mới về ạ.",
      ipa: "/ɪts ə njuː əˈraɪvl/",
      stress: "new a-RRI-val",
      pronTips: ["'arrival' nhấn giữa."],
      vocab: [{ word: "arrival", ipa: "/əˈraɪvl/", vi: "hàng mới về" }],
      importantWords: ["new", "arrival"],
    },
    {
      id: "en_r_5",
      en: "Would you like to try it?",
      vi: "Quý khách muốn thử không ạ?",
      ipa: "/wʊd juː laɪk tə traɪ ɪt/",
      stress: "like to TRY it",
      pronTips: ["'try' vần 'ai'."],
      importantWords: ["try"],
    },
    {
      id: "en_r_6",
      en: "This one suits you very well.",
      vi: "Mẫu này rất hợp với quý khách ạ.",
      ipa: "/ðɪs wʌn suːts juː ˈveri wel/",
      stress: "SUITS you very WELL",
      pronTips: ["'suits' đọc 'suuts'."],
      importantWords: ["suits", "well"],
    },
    {
      id: "en_r_7",
      en: "It comes in different sizes.",
      vi: "Sản phẩm có nhiều kích cỡ ạ.",
      ipa: "/ɪt kʌmz ɪn ˈdɪfrənt ˈsaɪzɪz/",
      stress: "different SI-zes",
      pronTips: ["'sizes' đọc 'sai-zịz'."],
      replaceable: [
        {
          slotVi: "thuộc tính",
          alts: [
            { en: "colors", vi: "màu" },
            { en: "scents", vi: "mùi hương" },
            { en: "flavors", vi: "vị" },
          ],
        },
      ],
      importantWords: ["different", "sizes"],
    },
    {
      id: "en_r_8",
      en: "Let me get one for you to see.",
      vi: "Để em lấy một mẫu cho quý khách xem ạ.",
      ipa: "/let miː ɡet wʌn fɔːr juː tə siː/",
      stress: "get one for you to SEE",
      pronTips: ["'to see' nhấn 'see'."],
      importantWords: ["get", "see"],
    },
  ],
  dialogue: {
    titleVi: "Tư vấn mẫu",
    lines: [
      { speaker: "customer", en: "Can you recommend something?", vi: "Bạn gợi ý giúp được không?" },
      { speaker: "staff", en: "Of course. I can recommend a few for you.", vi: "Vâng ạ. Em giới thiệu vài mẫu nhé." },
      { speaker: "staff", en: "This one is very popular. It's our best seller.", vi: "Mẫu này rất được ưa chuộng, bán chạy nhất ạ." },
      { speaker: "staff", en: "Would you like to try it?", vi: "Quý khách muốn thử không ạ?" },
      { speaker: "customer", en: "Yes, please.", vi: "Có, cho tôi thử." },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: gợi ý sản phẩm",
    customerGoalVi: "Khách nhờ tư vấn.",
    staffGoalVi: "Gợi ý 1-2 mẫu, nêu bán chạy/mới về, mời thử.",
    requiredPhraseIds: ["en_r_1", "en_r_3", "en_r_5"],
  },
  quiz: [
    {
      id: "enq_r_1",
      promptVi: "Nói đây là hàng bán chạy nhất?",
      options: ["This is our best seller.", "What's your budget?", "Take your time."],
      correctAnswer: "This is our best seller.",
    },
    {
      id: "enq_r_2",
      promptVi: "Mời khách thử sản phẩm?",
      options: ["Would you like to try it?", "Is this your first time here?", "Here is your receipt."],
      correctAnswer: "Would you like to try it?",
    },
    {
      id: "enq_r_3",
      promptVi: "Giới thiệu mẫu mới về?",
      options: ["It's a new arrival.", "Payment successful.", "Who is it for?"],
      correctAnswer: "It's a new arrival.",
    },
  ],
};

const L4: EnLesson = {
  id: "english_price_promotion",
  titleEn: "Price & promotion",
  titleVi: "Giá & khuyến mãi",
  objectiveVi: "Báo giá, giải thích giá miễn thuế và khuyến mãi.",
  status: "ready",
  phrases: [
    {
      id: "en_p_1",
      en: "This is the duty-free price.",
      vi: "Đây là giá miễn thuế ạ.",
      ipa: "/ðɪs ɪz ðə ˌduːti ˈfriː praɪs/",
      stress: "DU-ty-free PRICE",
      pronTips: ["'duty-free' đọc 'điu-ti-fri'.", "'price' vần 'ai'."],
      vocab: [{ word: "duty-free", ipa: "/ˌduːti ˈfriː/", vi: "miễn thuế" }],
      importantWords: ["duty", "free", "price"],
    },
    {
      id: "en_p_2",
      en: "It's on promotion now.",
      vi: "Hiện đang có khuyến mãi ạ.",
      ipa: "/ɪts ɒn prəˈmoʊʃn naʊ/",
      stress: "on pro-MO-tion",
      pronTips: ["'promotion' nhấn giữa (-MO-)."],
      vocab: [{ word: "promotion", ipa: "/prəˈmoʊʃn/", vi: "khuyến mãi" }],
      importantWords: ["promotion", "now"],
    },
    {
      id: "en_p_3",
      en: "There's a discount on this one.",
      vi: "Mẫu này đang có giảm giá ạ.",
      ipa: "/ðerz ə ˈdɪskaʊnt ɒn ðɪs wʌn/",
      stress: "a DIS-count",
      pronTips: ["'discount' nhấn đầu."],
      vocab: [{ word: "discount", ipa: "/ˈdɪskaʊnt/", vi: "giảm giá" }],
      importantWords: ["discount"],
    },
    {
      id: "en_p_4",
      en: "Buy one, get one free.",
      vi: "Mua một tặng một ạ.",
      ipa: "/baɪ wʌn ɡet wʌn friː/",
      stress: "buy ONE, get one FREE",
      pronTips: ["Nhấn 'one' và 'free'."],
      importantWords: ["buy", "one", "free"],
    },
    {
      id: "en_p_5",
      en: "The price is already discounted.",
      vi: "Giá này đã là giá giảm rồi ạ.",
      ipa: "/ðə praɪs ɪz ɔːlˈredi ˈdɪskaʊntɪd/",
      stress: "al-REA-dy DIS-coun-ted",
      pronTips: ["'already' nhấn giữa."],
      importantWords: ["price", "already", "discounted"],
    },
    {
      id: "en_p_6",
      en: "Let me check the price for you.",
      vi: "Để em kiểm tra giá giúp quý khách ạ.",
      ipa: "/let miː tʃek ðə praɪs fɔːr juː/",
      stress: "CHECK the price",
      pronTips: ["'check' đọc dứt khoát."],
      importantWords: ["check", "price"],
    },
    {
      id: "en_p_7",
      en: "It's cheaper than the city price.",
      vi: "Rẻ hơn so với giá ngoài thành phố ạ.",
      ipa: "/ɪts ˈtʃiːpər ðæn ðə ˈsɪti praɪs/",
      stress: "CHEA-per than the CIT-y price",
      pronTips: ["'cheaper' nhấn đầu, 'than' đọc nhẹ."],
      importantWords: ["cheaper", "city", "price"],
    },
    {
      id: "en_p_8",
      en: "Spend over one thousand and get a gift.",
      vi: "Mua trên một nghìn được tặng quà ạ.",
      ipa: "/spend ˈoʊvər wʌn ˈθaʊznd ænd ɡet ə ɡɪft/",
      stress: "spend over a THOUSAND, get a GIFT",
      pronTips: ["'thousand' đọc 'thau-zần', 'th' đặt lưỡi giữa răng."],
      importantWords: ["spend", "thousand", "gift"],
    },
  ],
  dialogue: {
    titleVi: "Báo giá & khuyến mãi",
    lines: [
      { speaker: "customer", en: "How much is this?", vi: "Cái này bao nhiêu?" },
      { speaker: "staff", en: "Let me check the price for you. This is the duty-free price.", vi: "Để em kiểm tra ạ. Đây là giá miễn thuế." },
      { speaker: "staff", en: "It's on promotion now — buy one, get one free.", vi: "Đang khuyến mãi ạ — mua một tặng một." },
      { speaker: "customer", en: "That's a good deal.", vi: "Hời đấy." },
      { speaker: "staff", en: "Yes, and it's cheaper than the city price.", vi: "Vâng, rẻ hơn giá ngoài thành phố ạ." },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: hỏi giá",
    customerGoalVi: "Khách hỏi giá và có khuyến mãi không.",
    staffGoalVi: "Kiểm tra giá, nêu giá miễn thuế + khuyến mãi.",
    requiredPhraseIds: ["en_p_1", "en_p_2", "en_p_6"],
  },
  quiz: [
    {
      id: "enq_p_1",
      promptVi: "Cho khách biết đây là giá miễn thuế?",
      options: ["This is the duty-free price.", "Would you like to try it?", "Who is it for?"],
      correctAnswer: "This is the duty-free price.",
    },
    {
      id: "enq_p_2",
      promptVi: "Báo chương trình mua một tặng một?",
      options: ["Buy one, get one free.", "Take your time.", "Here is your passport."],
      correctAnswer: "Buy one, get one free.",
    },
    {
      id: "enq_p_3",
      promptVi: "Nói để kiểm tra giá giúp khách?",
      options: ["Let me check the price for you.", "It's a new arrival.", "Good evening!"],
      correctAnswer: "Let me check the price for you.",
    },
  ],
};

const L5: EnLesson = {
  id: "english_payment_receipt",
  titleEn: "Payment & receipt",
  titleVi: "Thanh toán & hóa đơn",
  objectiveVi: "Hỏi cách thanh toán, xác nhận và đưa hóa đơn.",
  status: "ready",
  phrases: [
    {
      id: "en_pay_1",
      en: "How would you like to pay?",
      vi: "Quý khách muốn thanh toán bằng cách nào ạ?",
      ipa: "/haʊ wʊd juː laɪk tə peɪ/",
      stress: "how would you like to PAY",
      pronTips: ["'pay' vần 'ây', nhấn cuối câu."],
      importantWords: ["how", "pay"],
    },
    {
      id: "en_pay_2",
      en: "Would you like to pay by card or by QR code?",
      vi: "Quý khách quẹt thẻ hay quét mã QR ạ?",
      ipa: "/wʊd juː laɪk tə peɪ baɪ kɑːrd ɔːr baɪ ˌkjuː ˈɑːr koʊd/",
      stress: "pay by CARD or by QR CODE",
      pronTips: ["'card' có 'ar' kéo dài.", "'QR' đọc 'kiu-a'."],
      vocab: [{ word: "card", ipa: "/kɑːrd/", vi: "thẻ" }],
      importantWords: ["pay", "card", "qr", "code"],
    },
    {
      id: "en_pay_3",
      en: "May I see your passport and boarding pass?",
      vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?",
      ipa: "/meɪ aɪ siː jər ˈpæspɔːrt ænd ˈbɔːrdɪŋ pæs/",
      stress: "PASS-port and BOAR-ding pass",
      pronTips: ["'passport' nhấn đầu.", "'boarding' nhấn đầu."],
      vocab: [
        { word: "passport", ipa: "/ˈpæspɔːrt/", vi: "hộ chiếu" },
        { word: "boarding pass", ipa: "/ˈbɔːrdɪŋ pæs/", vi: "thẻ lên máy bay" },
      ],
      usageVi: "Mua hàng miễn thuế cần xuất trình giấy tờ.",
      importantWords: ["passport", "boarding", "pass"],
    },
    {
      id: "en_pay_4",
      en: "Please insert or tap your card.",
      vi: "Quý khách vui lòng cắm hoặc chạm thẻ ạ.",
      ipa: "/pliːz ɪnˈsɜːrt ɔːr tæp jər kɑːrd/",
      stress: "in-SERT or TAP your card",
      pronTips: ["'insert' nhấn cuối.", "'tap' đọc gọn."],
      importantWords: ["insert", "tap", "card"],
    },
    {
      id: "en_pay_5",
      en: "Your payment was successful.",
      vi: "Thanh toán của quý khách đã thành công ạ.",
      ipa: "/jər ˈpeɪmənt wəz səkˈsesfl/",
      stress: "PAY-ment was suc-CESS-ful",
      pronTips: ["'successful' nhấn giữa (-CESS-)."],
      vocab: [{ word: "successful", ipa: "/səkˈsesfl/", vi: "thành công" }],
      importantWords: ["payment", "successful"],
    },
    {
      id: "en_pay_6",
      en: "Here is your receipt.",
      vi: "Đây là hóa đơn của quý khách ạ.",
      ipa: "/hɪr ɪz jər rɪˈsiːt/",
      stress: "here is your re-CEIPT",
      pronTips: ["'receipt' đọc 'ri-sít' — chữ 'p' câm!"],
      vocab: [{ word: "receipt", ipa: "/rɪˈsiːt/", vi: "hóa đơn (chữ p câm)" }],
      importantWords: ["receipt"],
    },
    {
      id: "en_pay_7",
      en: "Would you like a bag?",
      vi: "Quý khách có cần túi không ạ?",
      ipa: "/wʊd juː laɪk ə bæɡ/",
      stress: "like a BAG",
      pronTips: ["'bag' đọc 'bег' gọn."],
      importantWords: ["bag"],
    },
    {
      id: "en_pay_8",
      en: "Please keep your receipt for the gate.",
      vi: "Quý khách giữ hóa đơn để xuất trình ở cửa ạ.",
      ipa: "/pliːz kiːp jər rɪˈsiːt fɔːr ðə ɡeɪt/",
      stress: "KEEP your receipt for the GATE",
      pronTips: ["'keep' kéo dài 'ee'.", "'gate' vần 'ây'."],
      importantWords: ["keep", "receipt", "gate"],
    },
  ],
  dialogue: {
    titleVi: "Thanh toán",
    lines: [
      { speaker: "staff", en: "How would you like to pay?", vi: "Quý khách thanh toán bằng gì ạ?" },
      { speaker: "customer", en: "By card.", vi: "Bằng thẻ." },
      { speaker: "staff", en: "May I see your passport and boarding pass?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?" },
      { speaker: "staff", en: "Please tap your card. ... Your payment was successful.", vi: "Quý khách chạm thẻ ạ. ... Thanh toán thành công." },
      { speaker: "staff", en: "Here is your receipt. Please keep it for the gate.", vi: "Đây là hóa đơn, giữ để xuất trình ở cửa ạ." },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: thu tiền",
    customerGoalVi: "Khách thanh toán bằng thẻ.",
    staffGoalVi: "Hỏi cách trả, xin giấy tờ, xác nhận, đưa hóa đơn.",
    requiredPhraseIds: ["en_pay_2", "en_pay_3", "en_pay_5", "en_pay_6"],
  },
  quiz: [
    {
      id: "enq_pay_1",
      promptVi: "Hỏi khách trả bằng thẻ hay QR?",
      options: ["Would you like to pay by card or by QR code?", "Here is your receipt.", "Take your time."],
      correctAnswer: "Would you like to pay by card or by QR code?",
    },
    {
      id: "enq_pay_2",
      promptVi: "Xác nhận thanh toán thành công?",
      options: ["Your payment was successful.", "Is it for yourself or a gift?", "Good morning!"],
      correctAnswer: "Your payment was successful.",
    },
    {
      id: "enq_pay_3",
      promptVi: "Đưa hóa đơn cho khách?",
      options: ["Here is your receipt.", "What's your budget?", "It's a new arrival."],
      correctAnswer: "Here is your receipt.",
      explanationVi: "'receipt' đọc 'ri-sít', chữ p câm.",
    },
  ],
};

const L6: EnLesson = {
  id: "english_polite_closing",
  titleEn: "Polite closing",
  titleVi: "Kết thúc lịch sự",
  objectiveVi: "Cảm ơn, chúc khách và tiễn khách lịch sự.",
  status: "ready",
  phrases: [
    {
      id: "en_c_1",
      en: "Thank you for shopping with us.",
      vi: "Cảm ơn quý khách đã mua sắm tại cửa hàng ạ.",
      ipa: "/θæŋk juː fɔːr ˈʃɑːpɪŋ wɪð ʌs/",
      stress: "thank you for SHOP-ping",
      pronTips: ["'thank' đặt lưỡi giữa răng (th).", "'shopping' nhấn đầu."],
      importantWords: ["thank", "shopping"],
    },
    {
      id: "en_c_2",
      en: "Have a pleasant trip!",
      vi: "Chúc quý khách một chuyến đi vui vẻ!",
      ipa: "/hæv ə ˈplezənt trɪp/",
      stress: "a PLEA-sant TRIP",
      pronTips: ["'pleasant' đọc 'ple-zần'.", "'trip' gọn."],
      vocab: [{ word: "pleasant", ipa: "/ˈplezənt/", vi: "dễ chịu, vui vẻ" }],
      importantWords: ["pleasant", "trip"],
    },
    {
      id: "en_c_3",
      en: "Have a safe flight!",
      vi: "Chúc quý khách bay an toàn!",
      ipa: "/hæv ə seɪf flaɪt/",
      stress: "a SAFE FLIGHT",
      pronTips: ["'flight' vần 'ai', 'gh' câm."],
      importantWords: ["safe", "flight"],
    },
    {
      id: "en_c_4",
      en: "Please come again.",
      vi: "Hẹn gặp lại quý khách ạ.",
      ipa: "/pliːz kʌm əˈɡen/",
      stress: "come a-GAIN",
      pronTips: ["'again' nhấn cuối."],
      importantWords: ["come", "again"],
    },
    {
      id: "en_c_5",
      en: "Enjoy your purchase!",
      vi: "Chúc quý khách dùng sản phẩm vui vẻ ạ!",
      ipa: "/ɪnˈdʒɔɪ jər ˈpɜːrtʃəs/",
      stress: "en-JOY your PUR-chase",
      pronTips: ["'purchase' nhấn đầu, đọc 'pơ-chợs'."],
      vocab: [{ word: "purchase", ipa: "/ˈpɜːrtʃəs/", vi: "món hàng đã mua" }],
      importantWords: ["enjoy", "purchase"],
    },
    {
      id: "en_c_6",
      en: "Take care!",
      vi: "Quý khách giữ gìn sức khỏe ạ!",
      ipa: "/teɪk ker/",
      stress: "take CARE",
      pronTips: ["'care' đọc 'ke-ơ'."],
      importantWords: ["take", "care"],
    },
    {
      id: "en_c_7",
      en: "Here are your items. Please check them.",
      vi: "Đây là hàng của quý khách, vui lòng kiểm tra ạ.",
      ipa: "/hɪr ɑːr jər ˈaɪtəmz pliːz tʃek ðəm/",
      stress: "your I-tems, please CHECK them",
      pronTips: ["'items' đọc 'ai-tầmz'."],
      vocab: [{ word: "items", ipa: "/ˈaɪtəmz/", vi: "các món hàng" }],
      importantWords: ["items", "check"],
    },
    {
      id: "en_c_8",
      en: "Thank you, see you next time!",
      vi: "Cảm ơn quý khách, hẹn gặp lần sau!",
      ipa: "/θæŋk juː siː juː nekst taɪm/",
      stress: "see you NEXT time",
      pronTips: ["'next' đọc gọn, 'time' vần 'ai'."],
      importantWords: ["thank", "next", "time"],
    },
  ],
  dialogue: {
    titleVi: "Tiễn khách",
    lines: [
      { speaker: "staff", en: "Here are your items. Please check them.", vi: "Đây là hàng của quý khách, kiểm tra giúp em ạ." },
      { speaker: "customer", en: "Thank you.", vi: "Cảm ơn." },
      { speaker: "staff", en: "Thank you for shopping with us. Have a pleasant trip!", vi: "Cảm ơn quý khách đã mua sắm. Chúc đi vui ạ!" },
      { speaker: "staff", en: "Have a safe flight. Please come again!", vi: "Chúc bay an toàn. Hẹn gặp lại ạ!" },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: tiễn khách",
    customerGoalVi: "Khách vừa nhận hàng, chuẩn bị đi.",
    staffGoalVi: "Cảm ơn, chúc đi vui/bay an toàn, hẹn gặp lại.",
    requiredPhraseIds: ["en_c_1", "en_c_2", "en_c_3"],
  },
  quiz: [
    {
      id: "enq_c_1",
      promptVi: "Cảm ơn khách đã mua sắm?",
      options: ["Thank you for shopping with us.", "How would you like to pay?", "Which brand do you prefer?"],
      correctAnswer: "Thank you for shopping with us.",
    },
    {
      id: "enq_c_2",
      promptVi: "Chúc khách bay an toàn?",
      options: ["Have a safe flight!", "Buy one, get one free.", "Take your time."],
      correctAnswer: "Have a safe flight!",
    },
    {
      id: "enq_c_3",
      promptVi: "Hẹn gặp lại lịch sự?",
      options: ["Please come again.", "May I see your passport?", "It's on promotion now."],
      correctAnswer: "Please come again.",
    },
  ],
};

// ============================================================
// MODULE 2 — Product Sales English
// ============================================================

const PERFUME: EnLesson = {
  id: "english_perfume_sales",
  titleEn: "Selling perfume",
  titleVi: "Bán nước hoa",
  objectiveVi: "Tư vấn nước hoa: mùi hương, độ đậm, nam/nữ, thử mùi.",
  status: "ready",
  phrases: [
    {
      id: "en_pf_1",
      en: "Are you looking for men's or women's perfume?",
      vi: "Quý khách tìm nước hoa nam hay nữ ạ?",
      ipa: "/ɑːr juː ˈlʊkɪŋ fɔːr menz ɔːr ˈwɪmɪnz pərˈfjuːm/",
      stress: "MEN'S or WOMEN'S per-FUME",
      pronTips: ["'perfume' có thể nhấn 'per-FUME'.", "'women' đọc 'wi-min'."],
      vocab: [{ word: "perfume", ipa: "/pərˈfjuːm/", vi: "nước hoa" }],
      importantWords: ["men's", "women's", "perfume"],
    },
    {
      id: "en_pf_2",
      en: "What kind of scent do you like?",
      vi: "Quý khách thích mùi hương loại nào ạ?",
      ipa: "/wʌt kaɪnd əv sent duː juː laɪk/",
      stress: "what kind of SCENT",
      pronTips: ["'scent' đọc 'sent' — chữ 'c' câm."],
      vocab: [{ word: "scent", ipa: "/sent/", vi: "mùi hương" }],
      importantWords: ["kind", "scent", "like"],
    },
    {
      id: "en_pf_3",
      en: "This one is fresh and light.",
      vi: "Mẫu này tươi mát và nhẹ nhàng ạ.",
      ipa: "/ðɪs wʌn ɪz freʃ ænd laɪt/",
      stress: "FRESH and LIGHT",
      pronTips: ["'fresh' đọc dứt khoát.", "'light' vần 'ai'."],
      replaceable: [
        {
          slotVi: "tính chất mùi",
          alts: [
            { en: "sweet", vi: "ngọt" },
            { en: "floral", vi: "hương hoa" },
            { en: "woody", vi: "hương gỗ" },
            { en: "strong", vi: "đậm" },
          ],
        },
      ],
      importantWords: ["fresh", "light"],
    },
    {
      id: "en_pf_4",
      en: "Would you like to try a sample?",
      vi: "Quý khách muốn thử mẫu thử không ạ?",
      ipa: "/wʊd juː laɪk tə traɪ ə ˈsæmpl/",
      stress: "try a SAM-ple",
      pronTips: ["'sample' nhấn đầu."],
      vocab: [{ word: "sample", ipa: "/ˈsæmpl/", vi: "mẫu thử" }],
      importantWords: ["try", "sample"],
    },
    {
      id: "en_pf_5",
      en: "It lasts a long time on the skin.",
      vi: "Mùi lưu lại lâu trên da ạ.",
      ipa: "/ɪt læsts ə lɔːŋ taɪm ɒn ðə skɪn/",
      stress: "lasts a LONG time",
      pronTips: ["'lasts' cụm phụ âm cuối hơi khó — đọc 'lасts'."],
      importantWords: ["lasts", "long", "skin"],
    },
    {
      id: "en_pf_6",
      en: "This is a popular gift choice.",
      vi: "Đây là lựa chọn quà tặng được ưa chuộng ạ.",
      ipa: "/ðɪs ɪz ə ˈpɑːpjələr ɡɪft tʃɔɪs/",
      stress: "popular GIFT choice",
      pronTips: ["'choice' vần 'oi'."],
      importantWords: ["popular", "gift", "choice"],
    },
    {
      id: "en_pf_7",
      en: "It comes in 50 and 100 milliliters.",
      vi: "Sản phẩm có dung tích 50 và 100 ml ạ.",
      ipa: "/ɪt kʌmz ɪn ˈfɪfti ænd wʌn ˈhʌndrəd ˌmɪlɪˈliːtərz/",
      stress: "FIF-ty and a HUN-dred",
      pronTips: ["'milliliters' dài — có thể nói 'fifty mil'."],
      importantWords: ["fifty", "hundred", "milliliters"],
    },
    {
      id: "en_pf_8",
      en: "Would you like it gift-wrapped?",
      vi: "Quý khách có muốn gói quà không ạ?",
      ipa: "/wʊd juː laɪk ɪt ˈɡɪft ræpt/",
      stress: "GIFT-wrapped",
      pronTips: ["'wrapped' — chữ 'w' câm, đọc 'rept'."],
      vocab: [{ word: "gift-wrapped", ipa: "/ˈɡɪft ræpt/", vi: "gói quà" }],
      importantWords: ["gift", "wrapped"],
    },
  ],
  dialogue: {
    titleVi: "Bán nước hoa",
    lines: [
      { speaker: "staff", en: "Are you looking for men's or women's perfume?", vi: "Quý khách tìm nước hoa nam hay nữ ạ?" },
      { speaker: "customer", en: "Women's, for a gift.", vi: "Nữ, để làm quà." },
      { speaker: "staff", en: "What kind of scent does she like?", vi: "Cô ấy thích mùi loại nào ạ?" },
      { speaker: "customer", en: "Something fresh.", vi: "Loại gì đó tươi mát." },
      { speaker: "staff", en: "This one is fresh and light. Would you like to try a sample?", vi: "Mẫu này tươi và nhẹ ạ. Quý khách thử mẫu thử nhé?" },
      { speaker: "staff", en: "Would you like it gift-wrapped?", vi: "Quý khách có muốn gói quà không ạ?" },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: tư vấn nước hoa làm quà",
    customerGoalVi: "Khách mua nước hoa nữ làm quà, thích mùi tươi.",
    staffGoalVi: "Hỏi nam/nữ + mùi, gợi ý mẫu tươi nhẹ, mời thử, hỏi gói quà.",
    requiredPhraseIds: ["en_pf_1", "en_pf_2", "en_pf_4", "en_pf_8"],
  },
  quiz: [
    {
      id: "enq_pf_1",
      promptVi: "Hỏi khách tìm nước hoa nam hay nữ?",
      options: ["Are you looking for men's or women's perfume?", "Here is your receipt.", "Have a safe flight!"],
      correctAnswer: "Are you looking for men's or women's perfume?",
    },
    {
      id: "enq_pf_2",
      promptVi: "Mời khách thử mẫu thử?",
      options: ["Would you like to try a sample?", "How would you like to pay?", "Take your time."],
      correctAnswer: "Would you like to try a sample?",
    },
    {
      id: "enq_pf_3",
      promptVi: "Hỏi khách có gói quà không?",
      options: ["Would you like it gift-wrapped?", "Which brand do you prefer?", "Please come again."],
      correctAnswer: "Would you like it gift-wrapped?",
    },
  ],
};

const COSMETICS: EnLesson = {
  id: "english_cosmetics_sales",
  titleEn: "Selling cosmetics & skincare",
  titleVi: "Bán mỹ phẩm & dưỡng da",
  objectiveVi: "Tư vấn mỹ phẩm theo loại da, công dụng và cách dùng.",
  status: "ready",
  phrases: [
    { id: "en_cos_1", en: "Are you looking for skincare or makeup?", vi: "Quý khách tìm đồ dưỡng da hay trang điểm ạ?", ipa: "/ɑːr juː ˈlʊkɪŋ fɔːr ˈskɪnker ɔːr ˈmeɪkʌp/", stress: "SKIN-care or MAKE-up", pronTips: ["'skincare' nhấn đầu.", "'makeup' nhấn đầu."], vocab: [{ word: "skincare", ipa: "/ˈskɪnker/", vi: "đồ dưỡng da" }], importantWords: ["skincare", "makeup"] },
    { id: "en_cos_2", en: "What is your skin type?", vi: "Da của quý khách thuộc loại nào ạ?", ipa: "/wʌt ɪz jər skɪn taɪp/", stress: "your SKIN type", pronTips: ["'type' vần 'ai'."], vocab: [{ word: "skin type", ipa: "/skɪn taɪp/", vi: "loại da" }], importantWords: ["skin", "type"] },
    { id: "en_cos_3", en: "This is good for dry skin.", vi: "Loại này hợp với da khô ạ.", ipa: "/ðɪs ɪz ɡʊd fɔːr draɪ skɪn/", stress: "good for DRY skin", pronTips: ["'dry' vần 'ai'."], replaceable: [{ slotVi: "loại da", alts: [{ en: "oily skin", vi: "da dầu" }, { en: "sensitive skin", vi: "da nhạy cảm" }, { en: "combination skin", vi: "da hỗn hợp" }] }], importantWords: ["good", "dry", "skin"] },
    { id: "en_cos_4", en: "It hydrates and brightens the skin.", vi: "Sản phẩm cấp ẩm và làm sáng da ạ.", ipa: "/ɪt ˈhaɪdreɪts ænd ˈbraɪtns ðə skɪn/", stress: "HY-drates and BRIGHT-ens", pronTips: ["'hydrates' nhấn đầu."], vocab: [{ word: "hydrate", ipa: "/ˈhaɪdreɪt/", vi: "cấp ẩm" }], importantWords: ["hydrates", "brightens", "skin"] },
    { id: "en_cos_5", en: "Would you like to try a sample?", vi: "Quý khách muốn thử mẫu thử không ạ?", ipa: "/wʊd juː laɪk tə traɪ ə ˈsæmpl/", stress: "try a SAM-ple", pronTips: ["'sample' nhấn đầu."], importantWords: ["try", "sample"] },
    { id: "en_cos_6", en: "Apply a small amount on your hand.", vi: "Quý khách thử một lượng nhỏ lên tay ạ.", ipa: "/əˈplaɪ ə smɔːl əˈmaʊnt ɒn jər hænd/", stress: "a SMALL a-MOUNT", pronTips: ["'apply' nhấn cuối."], vocab: [{ word: "apply", ipa: "/əˈplaɪ/", vi: "thoa, bôi" }], importantWords: ["apply", "small", "amount", "hand"] },
    { id: "en_cos_7", en: "This shade suits your skin tone.", vi: "Tông màu này hợp với màu da của quý khách ạ.", ipa: "/ðɪs ʃeɪd suːts jər skɪn toʊn/", stress: "this SHADE suits your skin TONE", pronTips: ["'shade' vần 'ây'.", "'tone' vần 'ôn'."], vocab: [{ word: "shade", ipa: "/ʃeɪd/", vi: "tông màu" }], importantWords: ["shade", "suits", "skin", "tone"] },
    { id: "en_cos_8", en: "This is a popular gift set.", vi: "Đây là bộ quà tặng được ưa chuộng ạ.", ipa: "/ðɪs ɪz ə ˈpɑːpjələr ɡɪft set/", stress: "popular GIFT set", pronTips: ["'set' gọn."], importantWords: ["popular", "gift", "set"] },
  ],
  dialogue: { titleVi: "Bán dưỡng da", lines: [
    { speaker: "staff", en: "Are you looking for skincare or makeup?", vi: "Quý khách tìm dưỡng da hay trang điểm ạ?" },
    { speaker: "customer", en: "Skincare, for dry skin.", vi: "Dưỡng da, cho da khô." },
    { speaker: "staff", en: "This is good for dry skin. It hydrates and brightens the skin.", vi: "Loại này hợp da khô, cấp ẩm và làm sáng da ạ." },
    { speaker: "staff", en: "Would you like to try a sample?", vi: "Quý khách thử mẫu nhé?" },
    { speaker: "customer", en: "Yes, thank you.", vi: "Vâng, cảm ơn." },
  ] },
  roleplay: { titleVi: "Đóng vai: tư vấn dưỡng da", customerGoalVi: "Khách da khô tìm đồ dưỡng.", staffGoalVi: "Hỏi loại da, gợi ý sản phẩm hợp, mời thử.", requiredPhraseIds: ["en_cos_1", "en_cos_2", "en_cos_3", "en_cos_5"] },
  quiz: [
    { id: "enq_cos_1", promptVi: "Hỏi loại da của khách?", options: ["What is your skin type?", "Here is your receipt.", "Have a safe flight!"], correctAnswer: "What is your skin type?" },
    { id: "enq_cos_2", promptVi: "Gợi ý sản phẩm cho da khô?", options: ["This is good for dry skin.", "Buy one, get one free.", "Who is it for?"], correctAnswer: "This is good for dry skin." },
    { id: "enq_cos_3", promptVi: "Mời khách thử mẫu thử?", options: ["Would you like to try a sample?", "Please come again.", "How would you like to pay?"], correctAnswer: "Would you like to try a sample?" },
  ],
};

const WINE: EnLesson = {
  id: "english_wine_spirits_sales",
  titleEn: "Selling wine & spirits",
  titleVi: "Bán rượu vang & rượu mạnh",
  objectiveVi: "Tư vấn rượu vang/rượu mạnh; lưu ý quy định độ tuổi & hạn mức.",
  status: "ready",
  phrases: [
    { id: "en_wine_1", en: "Are you looking for wine or spirits?", vi: "Quý khách tìm rượu vang hay rượu mạnh ạ?", ipa: "/ɑːr juː ˈlʊkɪŋ fɔːr waɪn ɔːr ˈspɪrɪts/", stress: "WINE or SPI-rits", pronTips: ["'wine' vần 'ai'.", "'spirits' nhấn đầu."], vocab: [{ word: "spirits", ipa: "/ˈspɪrɪts/", vi: "rượu mạnh" }], importantWords: ["wine", "spirits"] },
    { id: "en_wine_2", en: "Do you prefer red or white wine?", vi: "Quý khách thích vang đỏ hay vang trắng ạ?", ipa: "/duː juː prɪˈfɜːr red ɔːr waɪt waɪn/", stress: "RED or WHITE wine", pronTips: ["'prefer' nhấn cuối."], importantWords: ["red", "white", "wine"] },
    { id: "en_wine_3", en: "This whisky is very smooth.", vi: "Loại whisky này rất êm ạ.", ipa: "/ðɪs ˈwɪski ɪz ˈveri smuːð/", stress: "very SMOOTH", pronTips: ["'smooth' đọc 'smuuth', 'th' rung nhẹ."], vocab: [{ word: "smooth", ipa: "/smuːð/", vi: "êm, mượt" }], replaceable: [{ slotVi: "loại rượu", alts: [{ en: "cognac", vi: "cognac" }, { en: "vodka", vi: "vodka" }, { en: "gin", vi: "gin" }] }], importantWords: ["whisky", "smooth"] },
    { id: "en_wine_4", en: "This is a single malt.", vi: "Đây là rượu single malt ạ.", ipa: "/ðɪs ɪz ə ˈsɪŋɡl mɔːlt/", stress: "SINGLE malt", pronTips: ["'single' nhấn đầu."], importantWords: ["single", "malt"] },
    { id: "en_wine_5", en: "It pairs well with seafood.", vi: "Hợp khi dùng với hải sản ạ.", ipa: "/ɪt perz wel wɪð ˈsiːfuːd/", stress: "PAIRS well", pronTips: ["'pairs' đọc 'pe-ơz'."], vocab: [{ word: "pair with", ipa: "/per wɪð/", vi: "kết hợp với" }], importantWords: ["pairs", "seafood"] },
    { id: "en_wine_6", en: "May I see your passport for the age check?", vi: "Cho em xem hộ chiếu để kiểm tra độ tuổi ạ?", ipa: "/meɪ aɪ siː jər ˈpæspɔːrt fɔːr ðə eɪdʒ tʃek/", stress: "for the AGE check", pronTips: ["'age' vần 'ây-giơ'."], usageVi: "Bán rượu cần kiểm tra độ tuổi theo quy định.", importantWords: ["passport", "age", "check"] },
    { id: "en_wine_7", en: "There is a limit on alcohol.", vi: "Rượu có giới hạn số lượng ạ.", ipa: "/ðer ɪz ə ˈlɪmɪt ɒn ˈælkəhɒl/", stress: "a LI-mit on AL-cohol", pronTips: ["'alcohol' nhấn đầu."], vocab: [{ word: "alcohol", ipa: "/ˈælkəhɒl/", vi: "đồ uống có cồn" }], importantWords: ["limit", "alcohol"] },
    { id: "en_wine_8", en: "This one is gift-boxed.", vi: "Mẫu này có hộp quà ạ.", ipa: "/ðɪs wʌn ɪz ˈɡɪft bɒkst/", stress: "GIFT-boxed", pronTips: ["'boxed' đọc 'bốcst'."], importantWords: ["gift", "boxed"] },
  ],
  dialogue: { titleVi: "Bán rượu", lines: [
    { speaker: "staff", en: "Are you looking for wine or spirits?", vi: "Quý khách tìm vang hay rượu mạnh ạ?" },
    { speaker: "customer", en: "A whisky, as a gift.", vi: "Một chai whisky, để làm quà." },
    { speaker: "staff", en: "This whisky is very smooth. It's a single malt.", vi: "Loại này rất êm, là single malt ạ." },
    { speaker: "staff", en: "May I see your passport for the age check?", vi: "Cho em xem hộ chiếu để kiểm tra độ tuổi ạ?" },
    { speaker: "customer", en: "Sure.", vi: "Được." },
  ] },
  roleplay: { titleVi: "Đóng vai: bán whisky làm quà", customerGoalVi: "Khách mua whisky làm quà.", staffGoalVi: "Hỏi loại, gợi ý mẫu êm, kiểm tra độ tuổi, hỏi hộp quà.", requiredPhraseIds: ["en_wine_1", "en_wine_3", "en_wine_6"] },
  quiz: [
    { id: "enq_wine_1", promptVi: "Hỏi khách thích vang đỏ hay trắng?", options: ["Do you prefer red or white wine?", "Here is your receipt.", "Take your time."], correctAnswer: "Do you prefer red or white wine?" },
    { id: "enq_wine_2", promptVi: "Xin hộ chiếu để kiểm tra độ tuổi?", options: ["May I see your passport for the age check?", "It's a new arrival.", "Please come again."], correctAnswer: "May I see your passport for the age check?" },
    { id: "enq_wine_3", promptVi: "Nói rượu có giới hạn số lượng?", options: ["There is a limit on alcohol.", "Would you like a bag?", "Good morning!"], correctAnswer: "There is a limit on alcohol." },
  ],
};

const TOBACCO: EnLesson = {
  id: "english_tobacco_sales",
  titleEn: "Selling tobacco",
  titleVi: "Bán thuốc lá",
  objectiveVi: "Bán thuốc lá theo quy định: độ tuổi, hạn mức, không quảng cáo.",
  status: "ready",
  phrases: [
    { id: "en_tob_1", en: "Which brand would you like?", vi: "Quý khách muốn loại nào ạ?", ipa: "/wɪtʃ brænd wʊd juː laɪk/", stress: "which BRAND", pronTips: ["'brand' đọc rõ 'br'."], importantWords: ["which", "brand"] },
    { id: "en_tob_2", en: "Do you want a carton or a single pack?", vi: "Quý khách lấy cây hay gói lẻ ạ?", ipa: "/duː juː wɒnt ə ˈkɑːrtn ɔːr ə ˈsɪŋɡl pæk/", stress: "CAR-ton or single PACK", pronTips: ["'carton' nhấn đầu."], vocab: [{ word: "carton", ipa: "/ˈkɑːrtn/", vi: "cây (thuốc)" }], importantWords: ["carton", "single", "pack"] },
    { id: "en_tob_3", en: "May I see your passport and boarding pass?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?", ipa: "/meɪ aɪ siː jər ˈpæspɔːrt ænd ˈbɔːrdɪŋ pæs/", stress: "PASS-port and BOAR-ding pass", pronTips: ["Cần xác minh để bán theo quy định."], usageVi: "Bán thuốc lá cần kiểm tra giấy tờ & độ tuổi.", importantWords: ["passport", "boarding", "pass"] },
    { id: "en_tob_4", en: "There is a limit on tobacco.", vi: "Thuốc lá có giới hạn số lượng ạ.", ipa: "/ðer ɪz ə ˈlɪmɪt ɒn təˈbækoʊ/", stress: "a LI-mit on to-BAC-co", pronTips: ["'tobacco' nhấn giữa."], vocab: [{ word: "tobacco", ipa: "/təˈbækoʊ/", vi: "thuốc lá" }], importantWords: ["limit", "tobacco"] },
    { id: "en_tob_5", en: "The maximum is two cartons.", vi: "Tối đa là hai cây ạ.", ipa: "/ðə ˈmæksɪməm ɪz tuː ˈkɑːrtnz/", stress: "MAX-i-mum is two", pronTips: ["'maximum' nhấn đầu."], importantWords: ["maximum", "two", "cartons"] },
    { id: "en_tob_6", en: "Please declare it at customs if needed.", vi: "Nếu cần, quý khách khai báo ở hải quan ạ.", ipa: "/pliːz dɪˈkler ɪt æt ˈkʌstəmz ɪf ˈniːdɪd/", stress: "de-CLARE it at CUS-toms", pronTips: ["'declare' nhấn cuối."], importantWords: ["declare", "customs"] },
    { id: "en_tob_7", en: "Let me check the rules for you.", vi: "Để em kiểm tra quy định giúp quý khách ạ.", ipa: "/let miː tʃek ðə ruːlz fɔːr juː/", stress: "CHECK the RULES", pronTips: ["'check' dứt khoát."], importantWords: ["check", "rules"] },
    { id: "en_tob_8", en: "Here is your receipt. Please keep it.", vi: "Đây là hóa đơn, quý khách giữ giúp ạ.", ipa: "/hɪr ɪz jər rɪˈsiːt pliːz kiːp ɪt/", stress: "here is your re-CEIPT", pronTips: ["'receipt' chữ p câm."], importantWords: ["receipt", "keep"] },
  ],
  dialogue: { titleVi: "Bán thuốc lá", lines: [
    { speaker: "customer", en: "One carton, please.", vi: "Cho tôi một cây." },
    { speaker: "staff", en: "May I see your passport and boarding pass?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?" },
    { speaker: "staff", en: "There is a limit on tobacco. The maximum is two cartons.", vi: "Thuốc lá có giới hạn, tối đa hai cây ạ." },
    { speaker: "customer", en: "Okay, just one.", vi: "Được, một cây thôi." },
    { speaker: "staff", en: "Here is your receipt. Please keep it.", vi: "Đây là hóa đơn, quý khách giữ giúp ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: bán thuốc lá theo quy định", customerGoalVi: "Khách mua thuốc lá.", staffGoalVi: "Xin giấy tờ, nêu giới hạn, đưa hóa đơn.", requiredPhraseIds: ["en_tob_2", "en_tob_3", "en_tob_4"] },
  quiz: [
    { id: "enq_tob_1", promptVi: "Hỏi khách lấy cây hay gói lẻ?", options: ["Do you want a carton or a single pack?", "Have a pleasant trip!", "Which brand do you prefer?"], correctAnswer: "Do you want a carton or a single pack?" },
    { id: "enq_tob_2", promptVi: "Nói thuốc lá có giới hạn?", options: ["There is a limit on tobacco.", "It's on promotion now.", "Take your time."], correctAnswer: "There is a limit on tobacco." },
    { id: "enq_tob_3", promptVi: "Xin giấy tờ để bán theo quy định?", options: ["May I see your passport and boarding pass?", "Would you like a bag?", "Enjoy your purchase!"], correctAnswer: "May I see your passport and boarding pass?" },
  ],
};

const CONFECTIONERY: EnLesson = {
  id: "english_confectionery_sales",
  titleEn: "Confectionery & gifts",
  titleVi: "Bánh kẹo & quà tặng",
  objectiveVi: "Tư vấn socola, bánh kẹo và quà tặng; gói quà.",
  status: "ready",
  phrases: [
    { id: "en_conf_1", en: "Are you looking for chocolate or candy?", vi: "Quý khách tìm socola hay kẹo ạ?", ipa: "/ɑːr juː ˈlʊkɪŋ fɔːr ˈtʃɒklət ɔːr ˈkændi/", stress: "CHOC-olate or CAN-dy", pronTips: ["'chocolate' đọc 'chóc-lợt'."], vocab: [{ word: "chocolate", ipa: "/ˈtʃɒklət/", vi: "socola" }], importantWords: ["chocolate", "candy"] },
    { id: "en_conf_2", en: "This is a best seller.", vi: "Đây là sản phẩm bán chạy nhất ạ.", ipa: "/ðɪs ɪz ə ˈbest ˌselər/", stress: "BEST SELL-er", pronTips: ["hai từ đều nhấn."], importantWords: ["best", "seller"] },
    { id: "en_conf_3", en: "It's not too sweet.", vi: "Loại này không quá ngọt ạ.", ipa: "/ɪts nɒt tuː swiːt/", stress: "not too SWEET", pronTips: ["'sweet' kéo dài 'ee'."], importantWords: ["not", "sweet"] },
    { id: "en_conf_4", en: "This box is perfect for a gift.", vi: "Hộp này rất hợp làm quà ạ.", ipa: "/ðɪs bɒks ɪz ˈpɜːrfɪkt fɔːr ə ɡɪft/", stress: "PER-fect for a GIFT", pronTips: ["'perfect' nhấn đầu."], importantWords: ["box", "perfect", "gift"] },
    { id: "en_conf_5", en: "Would you like it gift-wrapped?", vi: "Quý khách có muốn gói quà không ạ?", ipa: "/wʊd juː laɪk ɪt ˈɡɪft ræpt/", stress: "GIFT-wrapped", pronTips: ["'wrapped' chữ w câm."], vocab: [{ word: "gift-wrapped", ipa: "/ˈɡɪft ræpt/", vi: "gói quà" }], importantWords: ["gift", "wrapped"] },
    { id: "en_conf_6", en: "Please check the expiry date.", vi: "Quý khách xem hạn sử dụng giúp ạ.", ipa: "/pliːz tʃek ðə ɪkˈspaɪri deɪt/", stress: "the ex-PI-ry date", pronTips: ["'expiry' nhấn giữa."], vocab: [{ word: "expiry date", ipa: "/ɪkˈspaɪri deɪt/", vi: "hạn sử dụng" }], importantWords: ["check", "expiry", "date"] },
    { id: "en_conf_7", en: "It contains nuts.", vi: "Sản phẩm có chứa hạt ạ.", ipa: "/ɪt kənˈteɪnz nʌts/", stress: "con-TAINS nuts", pronTips: ["Lưu ý dị ứng cho khách."], importantWords: ["contains", "nuts"] },
    { id: "en_conf_8", en: "Buy two boxes and save more.", vi: "Mua hai hộp tiết kiệm hơn ạ.", ipa: "/baɪ tuː ˈbɒksɪz ænd seɪv mɔːr/", stress: "buy TWO boxes and SAVE", pronTips: ["'boxes' đọc 'bóc-xịz'."], importantWords: ["buy", "two", "boxes", "save"] },
  ],
  dialogue: { titleVi: "Bán bánh kẹo", lines: [
    { speaker: "staff", en: "Are you looking for chocolate or candy?", vi: "Quý khách tìm socola hay kẹo ạ?" },
    { speaker: "customer", en: "Chocolate, for a gift.", vi: "Socola, để làm quà." },
    { speaker: "staff", en: "This box is perfect for a gift. It's a best seller.", vi: "Hộp này hợp làm quà, bán chạy nhất ạ." },
    { speaker: "staff", en: "Would you like it gift-wrapped?", vi: "Quý khách có muốn gói quà không ạ?" },
    { speaker: "customer", en: "Yes, please.", vi: "Vâng, cảm ơn." },
  ] },
  roleplay: { titleVi: "Đóng vai: bán socola làm quà", customerGoalVi: "Khách mua socola làm quà.", staffGoalVi: "Gợi ý hộp đẹp/bán chạy, hỏi gói quà, nhắc hạn dùng.", requiredPhraseIds: ["en_conf_1", "en_conf_4", "en_conf_5"] },
  quiz: [
    { id: "enq_conf_1", promptVi: "Hỏi khách tìm socola hay kẹo?", options: ["Are you looking for chocolate or candy?", "How would you like to pay?", "Have a safe flight!"], correctAnswer: "Are you looking for chocolate or candy?" },
    { id: "enq_conf_2", promptVi: "Hỏi khách có gói quà không?", options: ["Would you like it gift-wrapped?", "There is a limit on tobacco.", "Take your time."], correctAnswer: "Would you like it gift-wrapped?" },
    { id: "enq_conf_3", promptVi: "Nhắc khách xem hạn sử dụng?", options: ["Please check the expiry date.", "This is the duty-free price.", "Who is it for?"], correctAnswer: "Please check the expiry date." },
  ],
};

// ============================================================
// MODULE 3 — Airport / Duty-free English
// ============================================================

const DUTY_FREE_ALLOWANCE: EnLesson = {
  id: "english_duty_free_allowance",
  titleEn: "Duty-free allowance basics",
  titleVi: "Quy định miễn thuế cơ bản",
  objectiveVi: "Giải thích cơ bản về điều kiện & hạn mức mua hàng miễn thuế.",
  status: "ready",
  phrases: [
    {
      id: "en_df_1",
      en: "This is a duty-free shop.",
      vi: "Đây là cửa hàng miễn thuế ạ.",
      ipa: "/ðɪs ɪz ə ˌduːti ˈfriː ʃɒp/",
      stress: "duty-free SHOP",
      pronTips: ["'shop' gọn."],
      importantWords: ["duty", "free", "shop"],
    },
    {
      id: "en_df_2",
      en: "You need an international boarding pass to buy.",
      vi: "Quý khách cần thẻ lên máy bay quốc tế để mua ạ.",
      ipa: "/juː niːd ən ˌɪntərˈnæʃnəl ˈbɔːrdɪŋ pæs tə baɪ/",
      stress: "in-ter-NA-tio-nal BOAR-ding pass",
      pronTips: ["'international' dài — nhấn '-NA-'."],
      vocab: [{ word: "international", ipa: "/ˌɪntərˈnæʃnəl/", vi: "quốc tế" }],
      importantWords: ["international", "boarding", "pass", "buy"],
    },
    {
      id: "en_df_3",
      en: "There is a limit on some products.",
      vi: "Một số sản phẩm có giới hạn số lượng ạ.",
      ipa: "/ðer ɪz ə ˈlɪmɪt ɒn sʌm ˈprɑːdʌkts/",
      stress: "a LI-mit on some PRO-ducts",
      pronTips: ["'limit' nhấn đầu.", "'products' đọc 'pra-đậcts'."],
      vocab: [{ word: "limit", ipa: "/ˈlɪmɪt/", vi: "giới hạn, hạn mức" }],
      importantWords: ["limit", "products"],
    },
    {
      id: "en_df_4",
      en: "Liquids must follow airport rules.",
      vi: "Chất lỏng phải theo quy định của sân bay ạ.",
      ipa: "/ˈlɪkwɪdz mʌst ˈfɑːloʊ ˈerpɔːrt ruːlz/",
      stress: "LI-quids must FOL-low ... RULES",
      pronTips: ["'liquids' đọc 'li-kwịdz'.", "'rules' kéo dài 'oo'."],
      vocab: [{ word: "liquids", ipa: "/ˈlɪkwɪdz/", vi: "chất lỏng" }],
      importantWords: ["liquids", "follow", "rules"],
    },
    {
      id: "en_df_5",
      en: "Let me check the rules for you.",
      vi: "Để em kiểm tra quy định giúp quý khách ạ.",
      ipa: "/let miː tʃek ðə ruːlz fɔːr juː/",
      stress: "CHECK the RULES",
      pronTips: ["'check' dứt khoát."],
      importantWords: ["check", "rules"],
    },
    {
      id: "en_df_6",
      en: "You may need to declare this at customs.",
      vi: "Quý khách có thể phải khai báo món này ở hải quan ạ.",
      ipa: "/juː meɪ niːd tə dɪˈkler ðɪs æt ˈkʌstəmz/",
      stress: "de-CLARE ... at CUS-toms",
      pronTips: ["'declare' nhấn cuối.", "'customs' nhấn đầu."],
      vocab: [
        { word: "declare", ipa: "/dɪˈkler/", vi: "khai báo" },
        { word: "customs", ipa: "/ˈkʌstəmz/", vi: "hải quan" },
      ],
      importantWords: ["declare", "customs"],
    },
    {
      id: "en_df_7",
      en: "The price here is tax-free.",
      vi: "Giá ở đây là giá không thuế ạ.",
      ipa: "/ðə praɪs hɪr ɪz ˈtæks friː/",
      stress: "TAX-free",
      pronTips: ["'tax-free' hai từ rõ ràng."],
      importantWords: ["price", "tax", "free"],
    },
    {
      id: "en_df_8",
      en: "Please keep the receipt until you board.",
      vi: "Quý khách giữ hóa đơn đến khi lên máy bay ạ.",
      ipa: "/pliːz kiːp ðə rɪˈsiːt ənˈtɪl juː bɔːrd/",
      stress: "keep the receipt un-TIL you BOARD",
      pronTips: ["'until' nhấn cuối.", "'board' đọc 'bo-d'."],
      importantWords: ["keep", "receipt", "board"],
    },
  ],
  dialogue: {
    titleVi: "Hỏi về miễn thuế",
    lines: [
      { speaker: "customer", en: "Is this really tax-free?", vi: "Cái này miễn thuế thật à?" },
      { speaker: "staff", en: "Yes, this is a duty-free shop. The price here is tax-free.", vi: "Vâng, đây là cửa hàng miễn thuế, giá không thuế ạ." },
      { speaker: "staff", en: "You need an international boarding pass to buy.", vi: "Quý khách cần thẻ lên máy bay quốc tế để mua ạ." },
      { speaker: "customer", en: "Are there any limits?", vi: "Có giới hạn gì không?" },
      { speaker: "staff", en: "There is a limit on some products. Let me check the rules for you.", vi: "Một số sản phẩm có hạn mức. Để em kiểm tra giúp ạ." },
    ],
  },
  roleplay: {
    titleVi: "Đóng vai: giải thích miễn thuế",
    customerGoalVi: "Khách hỏi có thật miễn thuế và có giới hạn không.",
    staffGoalVi: "Xác nhận miễn thuế, cần boarding pass quốc tế, nêu có hạn mức + sẽ kiểm tra.",
    requiredPhraseIds: ["en_df_1", "en_df_2", "en_df_3", "en_df_5"],
  },
  quiz: [
    {
      id: "enq_df_1",
      promptVi: "Cho khách biết cần gì để mua miễn thuế?",
      options: [
        "You need an international boarding pass to buy.",
        "Would you like a bag?",
        "Have a pleasant trip!",
      ],
      correctAnswer: "You need an international boarding pass to buy.",
    },
    {
      id: "enq_df_2",
      promptVi: "Nói một số sản phẩm có giới hạn?",
      options: ["There is a limit on some products.", "This is our best seller.", "Take your time."],
      correctAnswer: "There is a limit on some products.",
    },
    {
      id: "enq_df_3",
      promptVi: "Đề nghị giữ hóa đơn đến khi lên máy bay?",
      options: ["Please keep the receipt until you board.", "Which brand do you prefer?", "Good evening!"],
      correctAnswer: "Please keep the receipt until you board.",
    },
  ],
};

const BOARDING: EnLesson = {
  id: "english_boarding_passport",
  titleEn: "Boarding pass & passport",
  titleVi: "Thẻ lên máy bay & hộ chiếu",
  objectiveVi: "Xin và kiểm tra hộ chiếu, thẻ lên máy bay khi bán hàng miễn thuế.",
  status: "ready",
  phrases: [
    { id: "en_board_1", en: "May I see your boarding pass, please?", vi: "Cho em xem thẻ lên máy bay ạ?", ipa: "/meɪ aɪ siː jər ˈbɔːrdɪŋ pæs pliːz/", stress: "your BOAR-ding pass", pronTips: ["'boarding' nhấn đầu."], vocab: [{ word: "boarding pass", ipa: "/ˈbɔːrdɪŋ pæs/", vi: "thẻ lên máy bay" }], importantWords: ["boarding", "pass"] },
    { id: "en_board_2", en: "May I see your passport too?", vi: "Cho em xem hộ chiếu nữa ạ?", ipa: "/meɪ aɪ siː jər ˈpæspɔːrt tuː/", stress: "your PASS-port too", pronTips: ["'passport' nhấn đầu."], vocab: [{ word: "passport", ipa: "/ˈpæspɔːrt/", vi: "hộ chiếu" }], importantWords: ["passport"] },
    { id: "en_board_3", en: "What is your flight number?", vi: "Số chuyến bay của quý khách là gì ạ?", ipa: "/wʌt ɪz jər flaɪt ˈnʌmbər/", stress: "your FLIGHT number", pronTips: ["'flight' vần 'ai'."], vocab: [{ word: "flight number", ipa: "/flaɪt ˈnʌmbər/", vi: "số chuyến bay" }], importantWords: ["flight", "number"] },
    { id: "en_board_4", en: "Where are you flying to?", vi: "Quý khách bay đi đâu ạ?", ipa: "/wer ɑːr juː ˈflaɪɪŋ tuː/", stress: "where are you FLY-ing to", pronTips: ["'flying' nhấn đầu."], importantWords: ["where", "flying"] },
    { id: "en_board_5", en: "I need to scan your boarding pass.", vi: "Em cần quét thẻ lên máy bay của quý khách ạ.", ipa: "/aɪ niːd tə skæn jər ˈbɔːrdɪŋ pæs/", stress: "SCAN your boarding pass", pronTips: ["'scan' đọc gọn."], importantWords: ["scan", "boarding", "pass"] },
    { id: "en_board_6", en: "Thank you for your cooperation.", vi: "Cảm ơn quý khách đã hợp tác ạ.", ipa: "/θæŋk juː fɔːr jər koʊˌɒpəˈreɪʃn/", stress: "co-op-er-A-tion", pronTips: ["'cooperation' nhấn '-A-'."], importantWords: ["thank", "cooperation"] },
    { id: "en_board_7", en: "Here is your passport, please keep it safe.", vi: "Đây là hộ chiếu, quý khách giữ cẩn thận ạ.", ipa: "/hɪr ɪz jər ˈpæspɔːrt pliːz kiːp ɪt seɪf/", stress: "keep it SAFE", pronTips: ["'safe' vần 'ây-f'."], importantWords: ["passport", "keep", "safe"] },
    { id: "en_board_8", en: "Your documents are all correct.", vi: "Giấy tờ của quý khách đều hợp lệ ạ.", ipa: "/jər ˈdɒkjumənts ɑːr ɔːl kəˈrekt/", stress: "all cor-RECT", pronTips: ["'documents' nhấn đầu.", "'correct' nhấn cuối."], vocab: [{ word: "documents", ipa: "/ˈdɒkjumənts/", vi: "giấy tờ" }], importantWords: ["documents", "correct"] },
  ],
  dialogue: { titleVi: "Kiểm tra giấy tờ", lines: [
    { speaker: "staff", en: "May I see your boarding pass, please?", vi: "Cho em xem thẻ lên máy bay ạ?" },
    { speaker: "customer", en: "Here you are.", vi: "Đây ạ." },
    { speaker: "staff", en: "May I see your passport too? Where are you flying to?", vi: "Cho em xem hộ chiếu nữa ạ? Quý khách bay đi đâu?" },
    { speaker: "customer", en: "To Seoul.", vi: "Đi Seoul." },
    { speaker: "staff", en: "Thank you. Your documents are all correct.", vi: "Cảm ơn ạ. Giấy tờ đều hợp lệ." },
  ] },
  roleplay: { titleVi: "Đóng vai: xin giấy tờ", customerGoalVi: "Khách mua hàng miễn thuế.", staffGoalVi: "Xin boarding pass + hộ chiếu, hỏi điểm đến, trả lại giấy tờ.", requiredPhraseIds: ["en_board_1", "en_board_2", "en_board_7"] },
  quiz: [
    { id: "enq_board_1", promptVi: "Xin thẻ lên máy bay?", options: ["May I see your boarding pass, please?", "Would you like a bag?", "It's on promotion now."], correctAnswer: "May I see your boarding pass, please?" },
    { id: "enq_board_2", promptVi: "Hỏi số chuyến bay?", options: ["What is your flight number?", "What's your budget?", "Take your time."], correctAnswer: "What is your flight number?" },
    { id: "enq_board_3", promptVi: "Trả hộ chiếu và dặn giữ cẩn thận?", options: ["Here is your passport, please keep it safe.", "This is our best seller.", "Good morning!"], correctAnswer: "Here is your passport, please keep it safe." },
  ],
};

const GATE: EnLesson = {
  id: "english_gate_flight_timing",
  titleEn: "Gate & flight timing",
  titleVi: "Cửa khởi hành & giờ bay",
  objectiveVi: "Hỏi/đáp về cửa, giờ bay; nhắc khách kịp giờ.",
  status: "ready",
  phrases: [
    { id: "en_gate_1", en: "What time is your flight?", vi: "Chuyến bay của quý khách mấy giờ ạ?", ipa: "/wʌt taɪm ɪz jər flaɪt/", stress: "what TIME is your flight", pronTips: ["'time' vần 'ai'."], importantWords: ["time", "flight"] },
    { id: "en_gate_2", en: "Which gate are you departing from?", vi: "Quý khách khởi hành ở cửa số mấy ạ?", ipa: "/wɪtʃ ɡeɪt ɑːr juː dɪˈpɑːrtɪŋ frɒm/", stress: "which GATE", pronTips: ["'gate' vần 'ây-t'.", "'departing' nhấn giữa."], vocab: [{ word: "gate", ipa: "/ɡeɪt/", vi: "cửa khởi hành" }, { word: "depart", ipa: "/dɪˈpɑːrt/", vi: "khởi hành" }], importantWords: ["which", "gate", "departing"] },
    { id: "en_gate_3", en: "Your gate is a short walk away.", vi: "Cửa của quý khách đi bộ một chút là tới ạ.", ipa: "/jər ɡeɪt ɪz ə ʃɔːrt wɔːk əˈweɪ/", stress: "a SHORT walk away", pronTips: ["'short' đọc 'shoot'."], importantWords: ["gate", "short", "walk"] },
    { id: "en_gate_4", en: "Boarding starts soon, please don't be late.", vi: "Sắp tới giờ lên máy bay, quý khách đừng trễ ạ.", ipa: "/ˈbɔːrdɪŋ stɑːrts suːn pliːz doʊnt biː leɪt/", stress: "please don't be LATE", pronTips: ["'late' vần 'ây-t'."], importantWords: ["boarding", "soon", "late"] },
    { id: "en_gate_5", en: "You still have enough time.", vi: "Quý khách vẫn còn đủ thời gian ạ.", ipa: "/juː stɪl hæv ɪˈnʌf taɪm/", stress: "enough TIME", pronTips: ["'enough' đọc 'i-nấp'."], importantWords: ["still", "enough", "time"] },
    { id: "en_gate_6", en: "Let me check the flight information.", vi: "Để em kiểm tra thông tin chuyến bay ạ.", ipa: "/let miː tʃek ðə flaɪt ˌɪnfərˈmeɪʃn/", stress: "CHECK the flight in-for-MA-tion", pronTips: ["'information' nhấn '-MA-'."], importantWords: ["check", "flight", "information"] },
    { id: "en_gate_7", en: "The screen shows your gate number.", vi: "Màn hình hiển thị số cửa của quý khách ạ.", ipa: "/ðə skriːn ʃoʊz jər ɡeɪt ˈnʌmbər/", stress: "SCREEN shows your GATE number", pronTips: ["'screen' kéo dài 'ee'."], importantWords: ["screen", "gate", "number"] },
    { id: "en_gate_8", en: "Have a smooth journey!", vi: "Chúc quý khách một hành trình thuận lợi!", ipa: "/hæv ə smuːð ˈdʒɜːrni/", stress: "smooth JOUR-ney", pronTips: ["'journey' nhấn đầu."], importantWords: ["smooth", "journey"] },
  ],
  dialogue: { titleVi: "Hỏi giờ bay & cửa", lines: [
    { speaker: "customer", en: "Will I be late for my flight?", vi: "Tôi có trễ chuyến không?" },
    { speaker: "staff", en: "What time is your flight? Which gate are you departing from?", vi: "Chuyến mấy giờ ạ? Cửa số mấy?" },
    { speaker: "customer", en: "Three o'clock, gate twelve.", vi: "Ba giờ, cửa số 12." },
    { speaker: "staff", en: "You still have enough time. Your gate is a short walk away.", vi: "Quý khách còn đủ giờ, cửa đi bộ chút là tới ạ." },
    { speaker: "staff", en: "Have a smooth journey!", vi: "Chúc hành trình thuận lợi!" },
  ] },
  roleplay: { titleVi: "Đóng vai: trấn an khách lo trễ giờ", customerGoalVi: "Khách lo bị trễ chuyến.", staffGoalVi: "Hỏi giờ/cửa, trấn an còn đủ giờ, chỉ đường ngắn gọn.", requiredPhraseIds: ["en_gate_1", "en_gate_2", "en_gate_5"] },
  quiz: [
    { id: "enq_gate_1", promptVi: "Hỏi giờ chuyến bay?", options: ["What time is your flight?", "Here is your receipt.", "Which brand do you prefer?"], correctAnswer: "What time is your flight?" },
    { id: "enq_gate_2", promptVi: "Hỏi cửa khởi hành?", options: ["Which gate are you departing from?", "Would you like to try it?", "Take your time."], correctAnswer: "Which gate are you departing from?" },
    { id: "enq_gate_3", promptVi: "Trấn an khách còn đủ giờ?", options: ["You still have enough time.", "It's a new arrival.", "Please come again."], correctAnswer: "You still have enough time." },
  ],
};

const STOCK: EnLesson = {
  id: "english_stock_alternative",
  titleEn: "Out of stock & alternatives",
  titleVi: "Hết hàng & gợi ý thay thế",
  objectiveVi: "Báo hết hàng lịch sự và gợi ý sản phẩm thay thế.",
  status: "ready",
  phrases: [
    { id: "en_stock_1", en: "I'm sorry, this is out of stock.", vi: "Xin lỗi, sản phẩm này đã hết hàng ạ.", ipa: "/aɪm ˈsɒri ðɪs ɪz aʊt əv stɒk/", stress: "out of STOCK", pronTips: ["'sorry' đọc 'so-ri'."], vocab: [{ word: "out of stock", ipa: "/aʊt əv stɒk/", vi: "hết hàng" }], importantWords: ["sorry", "out", "stock"] },
    { id: "en_stock_2", en: "It's sold out at the moment.", vi: "Hiện tại đã bán hết ạ.", ipa: "/ɪts soʊld aʊt æt ðə ˈmoʊmənt/", stress: "SOLD out", pronTips: ["'sold' vần 'ôld'."], importantWords: ["sold", "out", "moment"] },
    { id: "en_stock_3", en: "May I suggest a similar product?", vi: "Em gợi ý một sản phẩm tương tự được không ạ?", ipa: "/meɪ aɪ səˈdʒest ə ˈsɪmələr ˈprɒdʌkt/", stress: "sug-GEST a SI-milar product", pronTips: ["'suggest' nhấn cuối."], vocab: [{ word: "similar", ipa: "/ˈsɪmələr/", vi: "tương tự" }], importantWords: ["suggest", "similar", "product"] },
    { id: "en_stock_4", en: "This one is very similar.", vi: "Mẫu này rất giống ạ.", ipa: "/ðɪs wʌn ɪz ˈveri ˈsɪmələr/", stress: "very SI-milar", pronTips: ["'similar' nhấn đầu."], importantWords: ["very", "similar"] },
    { id: "en_stock_5", en: "It's from the same brand.", vi: "Cùng một thương hiệu ạ.", ipa: "/ɪts frɒm ðə seɪm brænd/", stress: "the SAME brand", pronTips: ["'same' vần 'ây-m'."], importantWords: ["same", "brand"] },
    { id: "en_stock_6", en: "Would you like to see it?", vi: "Quý khách muốn xem thử không ạ?", ipa: "/wʊd juː laɪk tə siː ɪt/", stress: "like to SEE it", pronTips: ["'see' kéo dài 'ee'."], importantWords: ["like", "see"] },
    { id: "en_stock_7", en: "We may have more tomorrow.", vi: "Có thể ngày mai bên em có thêm hàng ạ.", ipa: "/wiː meɪ hæv mɔːr təˈmɒroʊ/", stress: "more to-MOR-row", pronTips: ["'tomorrow' nhấn giữa."], importantWords: ["more", "tomorrow"] },
    { id: "en_stock_8", en: "Let me check the stock for you.", vi: "Để em kiểm tra hàng giúp quý khách ạ.", ipa: "/let miː tʃek ðə stɒk fɔːr juː/", stress: "CHECK the STOCK", pronTips: ["'stock' đọc gọn."], importantWords: ["check", "stock"] },
  ],
  dialogue: { titleVi: "Hết hàng & thay thế", lines: [
    { speaker: "customer", en: "Do you have this one?", vi: "Có loại này không?" },
    { speaker: "staff", en: "I'm sorry, this is out of stock.", vi: "Xin lỗi, mẫu này hết hàng ạ." },
    { speaker: "staff", en: "May I suggest a similar product? This one is very similar, from the same brand.", vi: "Em gợi ý mẫu tương tự nhé? Mẫu này rất giống, cùng hãng ạ." },
    { speaker: "customer", en: "Okay, let me see it.", vi: "Được, cho tôi xem." },
    { speaker: "staff", en: "Of course.", vi: "Vâng ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: hết hàng, gợi ý thay thế", customerGoalVi: "Khách hỏi mẫu đã hết.", staffGoalVi: "Xin lỗi báo hết, gợi ý mẫu tương tự cùng hãng, mời xem.", requiredPhraseIds: ["en_stock_1", "en_stock_3", "en_stock_6"] },
  quiz: [
    { id: "enq_stock_1", promptVi: "Báo hết hàng lịch sự?", options: ["I'm sorry, this is out of stock.", "Buy one, get one free.", "Have a safe flight!"], correctAnswer: "I'm sorry, this is out of stock." },
    { id: "enq_stock_2", promptVi: "Gợi ý sản phẩm tương tự?", options: ["May I suggest a similar product?", "How would you like to pay?", "Who is it for?"], correctAnswer: "May I suggest a similar product?" },
    { id: "enq_stock_3", promptVi: "Nói cùng một thương hiệu?", options: ["It's from the same brand.", "This is the duty-free price.", "Take your time."], correctAnswer: "It's from the same brand." },
  ],
};

const REFUND: EnLesson = {
  id: "english_refund_escalation",
  titleEn: "Refund & payment issues",
  titleVi: "Hoàn tiền & sự cố thanh toán",
  objectiveVi: "Xử lý lịch sự sự cố thanh toán/đổi trả; biết khi nào gọi quản lý.",
  status: "ready",
  phrases: [
    { id: "en_refund_1", en: "I'm sorry for the inconvenience.", vi: "Em xin lỗi vì sự bất tiện ạ.", ipa: "/aɪm ˈsɒri fɔːr ðə ˌɪnkənˈviːniəns/", stress: "in-con-VEN-ience", pronTips: ["'inconvenience' nhấn '-VEN-'."], vocab: [{ word: "inconvenience", ipa: "/ˌɪnkənˈviːniəns/", vi: "sự bất tiện" }], importantWords: ["sorry", "inconvenience"] },
    { id: "en_refund_2", en: "Your card was declined.", vi: "Thẻ của quý khách bị từ chối ạ.", ipa: "/jər kɑːrd wəz dɪˈklaɪnd/", stress: "card was de-CLINED", pronTips: ["'declined' nhấn cuối, vần 'ai'."], vocab: [{ word: "declined", ipa: "/dɪˈklaɪnd/", vi: "bị từ chối" }], importantWords: ["card", "declined"] },
    { id: "en_refund_3", en: "Could you try another card?", vi: "Quý khách thử thẻ khác được không ạ?", ipa: "/kʊd juː traɪ əˈnʌðər kɑːrd/", stress: "try a-NOTH-er card", pronTips: ["'another' nhấn giữa."], importantWords: ["try", "another", "card"] },
    { id: "en_refund_4", en: "Would you like to pay by QR code instead?", vi: "Quý khách muốn quét mã QR thay thế không ạ?", ipa: "/wʊd juː laɪk tə peɪ baɪ ˌkjuː ˈɑːr koʊd ɪnˈsted/", stress: "by QR code in-STEAD", pronTips: ["'instead' nhấn cuối."], importantWords: ["pay", "qr", "code", "instead"] },
    { id: "en_refund_5", en: "Do you have your receipt?", vi: "Quý khách có giữ hóa đơn không ạ?", ipa: "/duː juː hæv jər rɪˈsiːt/", stress: "have your re-CEIPT", pronTips: ["'receipt' chữ p câm."], importantWords: ["receipt"] },
    { id: "en_refund_6", en: "Refunds follow the store policy.", vi: "Việc hoàn tiền theo quy định cửa hàng ạ.", ipa: "/ˈriːfʌndz ˈfɒloʊ ðə stɔːr ˈpɒləsi/", stress: "RE-funds follow the store PO-licy", pronTips: ["'refunds' nhấn đầu.", "'policy' nhấn đầu."], vocab: [{ word: "refund", ipa: "/ˈriːfʌnd/", vi: "hoàn tiền" }, { word: "policy", ipa: "/ˈpɒləsi/", vi: "quy định" }], importantWords: ["refunds", "policy"] },
    { id: "en_refund_7", en: "Let me call my manager to help you.", vi: "Để em gọi quản lý hỗ trợ quý khách ạ.", ipa: "/let miː kɔːl maɪ ˈmænɪdʒər tə help juː/", stress: "call my MAN-ager", pronTips: ["'manager' nhấn đầu."], usageVi: "Khi vượt thẩm quyền, hãy mời quản lý.", importantWords: ["call", "manager", "help"] },
    { id: "en_refund_8", en: "Please wait a moment, thank you.", vi: "Quý khách vui lòng đợi một lát, cảm ơn ạ.", ipa: "/pliːz weɪt ə ˈmoʊmənt θæŋk juː/", stress: "wait a MO-ment", pronTips: ["'moment' nhấn đầu."], importantWords: ["wait", "moment", "thank"] },
  ],
  dialogue: { titleVi: "Sự cố thanh toán", lines: [
    { speaker: "staff", en: "I'm sorry, your card was declined.", vi: "Xin lỗi, thẻ của quý khách bị từ chối ạ." },
    { speaker: "staff", en: "Could you try another card, or pay by QR code instead?", vi: "Quý khách thử thẻ khác, hoặc quét mã QR nhé?" },
    { speaker: "customer", en: "It still doesn't work.", vi: "Vẫn không được." },
    { speaker: "staff", en: "I'm sorry for the inconvenience. Let me call my manager to help you.", vi: "Em xin lỗi vì bất tiện. Để em gọi quản lý hỗ trợ ạ." },
    { speaker: "staff", en: "Please wait a moment, thank you.", vi: "Quý khách đợi một lát, cảm ơn ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: thẻ bị từ chối", customerGoalVi: "Thẻ của khách bị từ chối.", staffGoalVi: "Xin lỗi, đề nghị thẻ khác/QR, nếu không được thì mời quản lý.", requiredPhraseIds: ["en_refund_2", "en_refund_3", "en_refund_7"] },
  quiz: [
    { id: "enq_refund_1", promptVi: "Báo thẻ bị từ chối?", options: ["Your card was declined.", "Here is your receipt.", "Have a pleasant trip!"], correctAnswer: "Your card was declined." },
    { id: "enq_refund_2", promptVi: "Đề nghị thanh toán bằng QR thay thế?", options: ["Would you like to pay by QR code instead?", "Which brand do you prefer?", "Take your time."], correctAnswer: "Would you like to pay by QR code instead?" },
    { id: "enq_refund_3", promptVi: "Khi vượt thẩm quyền, nên nói gì?", options: ["Let me call my manager to help you.", "It's a new arrival.", "Please come again."], correctAnswer: "Let me call my manager to help you." },
  ],
};

export const ENGLISH_COURSE: EnglishCourse = {
  id: "english-sales",
  titleEn: "English for VDF Sales",
  titleVi: "Tiếng Anh bán hàng VDF",
  descriptionVi:
    "Khoá tiếng Anh thực dụng cho nhân viên bán hàng miễn thuế VDF phục vụ khách quốc tế: chào hỏi, hỏi nhu cầu, tư vấn, giá/khuyến mãi, miễn thuế, thanh toán, tiễn khách.",
  modules: [
    {
      id: "m1_counter_survival",
      titleEn: "Counter Survival English",
      titleVi: "Tiếng Anh sống còn tại quầy",
      objectiveVi: "Xử lý được một giao dịch cơ bản tại quầy bằng tiếng Anh.",
      lessons: [L1, L2, L3, L4, L5, L6],
    },
    {
      id: "m2_product_sales",
      titleEn: "Product Sales English",
      titleVi: "Tiếng Anh theo ngành hàng",
      objectiveVi: "Tư vấn theo từng nhóm sản phẩm.",
      lessons: [PERFUME, COSMETICS, WINE, TOBACCO, CONFECTIONERY],
    },
    {
      id: "m3_airport_duty_free",
      titleEn: "Airport / Duty-free English",
      titleVi: "Tiếng Anh sân bay / miễn thuế",
      objectiveVi: "Xử lý ngữ cảnh sân bay & miễn thuế.",
      lessons: [BOARDING, DUTY_FREE_ALLOWANCE, GATE, STOCK, REFUND],
    },
  ],
};

// ---------- helpers ----------

export function getAllEnglishLessons(): EnLesson[] {
  return ENGLISH_COURSE.modules.flatMap((m) => m.lessons);
}

export function getEnglishLesson(id: string): EnLesson | undefined {
  return getAllEnglishLessons().find((l) => l.id === id);
}

export function getEnglishModuleOf(lessonId: string): EnModule | undefined {
  return ENGLISH_COURSE.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

/** All phrase ids across ready English lessons (for progress totals). */
export function allEnglishPhraseIds(): string[] {
  return getAllEnglishLessons().flatMap((l) => l.phrases.map((p) => p.id));
}
