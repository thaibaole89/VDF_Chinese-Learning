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

function scaffold(id: string, titleEn: string, titleVi: string, objectiveVi: string): EnLesson {
  return { id, titleEn, titleVi, objectiveVi, status: "coming", phrases: [] };
}

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
      lessons: [
        PERFUME,
        scaffold("english_cosmetics_sales", "Selling cosmetics", "Bán mỹ phẩm", "Tư vấn mỹ phẩm: loại da, công dụng."),
        scaffold("english_wine_spirits_sales", "Selling wine & spirits", "Bán rượu", "Tư vấn rượu vang & rượu mạnh."),
        scaffold("english_tobacco_sales", "Selling tobacco", "Bán thuốc lá", "Tư vấn thuốc lá (theo quy định)."),
        scaffold("english_confectionery_sales", "Confectionery & gifts", "Bánh kẹo & quà", "Tư vấn bánh kẹo, quà tặng."),
      ],
    },
    {
      id: "m3_airport_duty_free",
      titleEn: "Airport / Duty-free English",
      titleVi: "Tiếng Anh sân bay / miễn thuế",
      objectiveVi: "Xử lý ngữ cảnh sân bay & miễn thuế.",
      lessons: [
        scaffold("english_boarding_passport", "Boarding pass & passport", "Thẻ lên máy bay & hộ chiếu", "Ngôn ngữ về giấy tờ."),
        DUTY_FREE_ALLOWANCE,
        scaffold("english_gate_flight_timing", "Gate & flight timing", "Cửa & giờ bay", "Hỏi/đáp về cửa và giờ bay."),
        scaffold("english_stock_alternative", "Out of stock & alternatives", "Hết hàng & thay thế", "Báo hết hàng, gợi ý thay thế."),
        scaffold("english_refund_escalation", "Refund & payment issues", "Hoàn tiền & sự cố thanh toán", "Xử lý/escalate sự cố thanh toán."),
      ],
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
