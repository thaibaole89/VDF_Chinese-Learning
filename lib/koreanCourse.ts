// Korean for VDF Sales — course content. Phase 2C.1.4.
//
// A practical Korean sales-training course for Vietnamese VDF staff serving
// Korean customers, mirroring the Chinese & English courses. Each phrase carries
// Hangul, Revised Romanization, Vietnamese meaning, VN-friendly pronunciation
// tips, and Hangul keywords used for client-side voice scoring (ko-KR STT).
//
// Module 1 (Counter Survival) + Perfume + Duty-free allowance are fully authored;
// remaining Module 2/3 lessons are scaffolded (status:"coming"). All content is
// needs_review until a native/Operations reviewer signs off.

export type KoVocab = { word: string; roman: string; vi: string };
export type KoReplaceable = { slotVi: string; alts: { ko: string; vi: string }[] };

export type KoPhrase = {
  id: string;
  ko: string; // Hangul
  roman: string; // Revised Romanization
  vi: string;
  pronTips?: string[];
  vocab?: KoVocab[];
  replaceable?: KoReplaceable[];
  usageVi?: string;
  /** Hangul keywords used for ko-KR voice scoring. */
  importantWords: string[];
};

export type KoDialogueLine = { speaker: "staff" | "customer"; ko: string; roman: string; vi: string };
export type KoRoleplay = { titleVi: string; customerGoalVi: string; staffGoalVi: string; requiredPhraseIds: string[] };
export type KoQuiz = { id: string; promptVi: string; options: string[]; correctAnswer: string; explanationVi?: string };

export type KoLesson = {
  id: string;
  titleKo: string;
  titleVi: string;
  objectiveVi: string;
  status: "ready" | "coming";
  phrases: KoPhrase[];
  dialogue?: { titleVi: string; lines: KoDialogueLine[] };
  roleplay?: KoRoleplay;
  quiz?: KoQuiz[];
};

export type KoModule = { id: string; titleKo: string; titleVi: string; objectiveVi: string; lessons: KoLesson[] };
export type KoreanCourse = { id: string; titleKo: string; titleVi: string; descriptionVi: string; modules: KoModule[] };

// ============================================================
// MODULE 1 — Counter Survival Korean
// ============================================================

const L1: KoLesson = {
  id: "ko_greeting_help",
  titleKo: "인사 & 도움 제안",
  titleVi: "Chào hỏi & mời giúp đỡ",
  objectiveVi: "Chào khách Hàn và mở lời mời hỗ trợ lịch sự.",
  status: "ready",
  phrases: [
    { id: "ko_g_1", ko: "안녕하세요, 환영합니다!", roman: "Annyeonghaseyo, hwanyeonghamnida!", vi: "Xin chào, chào mừng quý khách!", pronTips: ["'안녕하세요' đọc 'an-nyong-ha-sê-yô'."], importantWords: ["안녕하세요", "환영"] },
    { id: "ko_g_2", ko: "무엇을 도와드릴까요?", roman: "Mueoseul dowadeurilkkayo?", vi: "Em có thể giúp gì cho quý khách ạ?", pronTips: ["'도와드릴까요' = 'tô-wa-tư-ril-ka-yô'."], vocab: [{ word: "돕다", roman: "dopda", vi: "giúp" }], importantWords: ["도와", "무엇"] },
    { id: "ko_g_3", ko: "천천히 둘러보세요.", roman: "Cheoncheonhi dulleoboseyo.", vi: "Quý khách cứ thong thả xem ạ.", pronTips: ["'천천히' = 'chon-chon-hi'."], importantWords: ["천천히", "둘러"] },
    { id: "ko_g_4", ko: "필요하시면 불러 주세요.", roman: "Piryohasimyeon bulleo juseyo.", vi: "Cần gì quý khách cứ gọi ạ.", pronTips: ["'주세요' = 'chu-sê-yô' (làm ơn)."], importantWords: ["필요", "불러"] },
    { id: "ko_g_5", ko: "선물을 찾으세요?", roman: "Seonmureul chajeuseyo?", vi: "Quý khách tìm quà tặng ạ?", vocab: [{ word: "선물", roman: "seonmul", vi: "quà tặng" }], importantWords: ["선물", "찾"] },
    { id: "ko_g_6", ko: "처음 오셨어요?", roman: "Cheoeum osyeosseoyo?", vi: "Lần đầu quý khách ghé ạ?", importantWords: ["처음"] },
    { id: "ko_g_7", ko: "편하게 보세요.", roman: "Pyeonhage boseyo.", vi: "Quý khách xem thoải mái ạ.", importantWords: ["편하게"] },
    { id: "ko_g_8", ko: "좋은 하루 되세요.", roman: "Joeun haru doeseyo.", vi: "Chúc quý khách một ngày tốt lành.", importantWords: ["좋은", "하루"] },
  ],
  dialogue: { titleVi: "Khách bước vào quầy", lines: [
    { speaker: "staff", ko: "안녕하세요, 환영합니다! 무엇을 도와드릴까요?", roman: "Annyeonghaseyo! Mueoseul dowadeurilkkayo?", vi: "Xin chào! Em giúp gì cho quý khách ạ?" },
    { speaker: "customer", ko: "그냥 구경할게요.", roman: "Geunyang gugyeonghalgeyo.", vi: "Tôi chỉ xem thôi." },
    { speaker: "staff", ko: "네, 천천히 둘러보세요.", roman: "Ne, cheoncheonhi dulleoboseyo.", vi: "Vâng, quý khách cứ thong thả xem ạ." },
    { speaker: "staff", ko: "필요하시면 불러 주세요.", roman: "Piryohasimyeon bulleo juseyo.", vi: "Cần gì quý khách cứ gọi ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: chào & mời giúp", customerGoalVi: "Khách mới vào, chưa rõ muốn gì.", staffGoalVi: "Chào, mời giúp, để khách thoải mái xem.", requiredPhraseIds: ["ko_g_1", "ko_g_2", "ko_g_3"] },
  quiz: [
    { id: "koq_g_1", promptVi: "Câu mời giúp lịch sự khi khách vào?", options: ["무엇을 도와드릴까요?", "영수증 여기 있습니다.", "면세 가격이에요."], correctAnswer: "무엇을 도와드릴까요?" },
    { id: "koq_g_2", promptVi: "Để khách thoải mái xem?", options: ["천천히 둘러보세요.", "어떻게 결제하시겠어요?", "또 오세요."], correctAnswer: "천천히 둘러보세요." },
    { id: "koq_g_3", promptVi: "Chào mừng quý khách?", options: ["안녕하세요, 환영합니다!", "선물을 찾으세요?", "할인 중이에요."], correctAnswer: "안녕하세요, 환영합니다!" },
  ],
};

const L2: KoLesson = {
  id: "ko_asking_needs",
  titleKo: "고객 요구 파악",
  titleVi: "Hỏi nhu cầu của khách",
  objectiveVi: "Hỏi khách tìm gì, cho ai, tầm giá.",
  status: "ready",
  phrases: [
    { id: "ko_n_1", ko: "무엇을 찾으세요?", roman: "Mueoseul chajeuseyo?", vi: "Quý khách tìm gì ạ?", importantWords: ["무엇", "찾"] },
    { id: "ko_n_2", ko: "어떤 브랜드를 좋아하세요?", roman: "Eotteon beuraendeureul joahaseyo?", vi: "Quý khách thích thương hiệu nào ạ?", vocab: [{ word: "브랜드", roman: "beuraendeu", vi: "thương hiệu" }], importantWords: ["브랜드", "좋아"] },
    { id: "ko_n_3", ko: "본인용이세요, 선물용이세요?", roman: "Bonin-yong-iseyo, seonmul-yong-iseyo?", vi: "Quý khách mua dùng hay làm quà ạ?", importantWords: ["선물", "본인"] },
    { id: "ko_n_4", ko: "예산이 어떻게 되세요?", roman: "Yesan-i eotteoke doeseyo?", vi: "Tầm giá quý khách khoảng bao nhiêu ạ?", vocab: [{ word: "예산", roman: "yesan", vi: "ngân sách" }], importantWords: ["예산"] },
    { id: "ko_n_5", ko: "누구에게 줄 선물이세요?", roman: "Nuguege jul seonmuriseyo?", vi: "Quà cho ai ạ?", importantWords: ["누구", "선물"] },
    { id: "ko_n_6", ko: "몇 가지 보여 드릴까요?", roman: "Myeot gaji boyeo deurilkkayo?", vi: "Em đưa vài mẫu để xem nhé ạ?", importantWords: ["보여", "가지"] },
    { id: "ko_n_7", ko: "가벼운 걸 원하세요, 진한 걸 원하세요?", roman: "Gabyeoun geol wonhaseyo, jinhan geol wonhaseyo?", vi: "Quý khách thích loại nhẹ hay đậm ạ?", importantWords: ["가벼운", "진한"] },
  ],
  dialogue: { titleVi: "Hỏi nhu cầu", lines: [
    { speaker: "staff", ko: "무엇을 찾으세요?", roman: "Mueoseul chajeuseyo?", vi: "Quý khách tìm gì ạ?" },
    { speaker: "customer", ko: "향수를 찾고 있어요.", roman: "Hyangsureul chatgo isseoyo.", vi: "Tôi đang tìm nước hoa." },
    { speaker: "staff", ko: "본인용이세요, 선물용이세요?", roman: "Bonin-yong-iseyo, seonmul-yong-iseyo?", vi: "Quý khách dùng hay làm quà ạ?" },
    { speaker: "customer", ko: "선물용이에요.", roman: "Seonmul-yong-ieyo.", vi: "Làm quà ạ." },
    { speaker: "staff", ko: "몇 가지 보여 드릴까요?", roman: "Myeot gaji boyeo deurilkkayo?", vi: "Em đưa vài mẫu nhé ạ?" },
  ] },
  roleplay: { titleVi: "Đóng vai: tìm hiểu nhu cầu", customerGoalVi: "Khách muốn mua quà, chưa rõ loại.", staffGoalVi: "Hỏi cho ai, tầm giá, gu; rồi mời xem mẫu.", requiredPhraseIds: ["ko_n_1", "ko_n_3", "ko_n_4"] },
  quiz: [
    { id: "koq_n_1", promptVi: "Hỏi khách mua dùng hay làm quà?", options: ["본인용이세요, 선물용이세요?", "영수증 여기 있습니다.", "또 오세요."], correctAnswer: "본인용이세요, 선물용이세요?" },
    { id: "koq_n_2", promptVi: "Hỏi tầm giá?", options: ["예산이 어떻게 되세요?", "신상품이에요.", "안전한 비행 되세요!"], correctAnswer: "예산이 어떻게 되세요?" },
    { id: "koq_n_3", promptVi: "Hỏi khách tìm gì?", options: ["무엇을 찾으세요?", "면세 가격이에요.", "봉투 드릴까요?"], correctAnswer: "무엇을 찾으세요?" },
  ],
};

const L3: KoLesson = {
  id: "ko_recommendation",
  titleKo: "상품 추천",
  titleVi: "Giới thiệu & tư vấn sản phẩm",
  objectiveVi: "Gợi ý sản phẩm, nêu hàng bán chạy/mới về, mời thử.",
  status: "ready",
  phrases: [
    { id: "ko_r_1", ko: "몇 가지 추천해 드릴게요.", roman: "Myeot gaji chucheonhae deurilgeyo.", vi: "Em xin giới thiệu vài mẫu ạ.", vocab: [{ word: "추천", roman: "chucheon", vi: "giới thiệu, đề xuất" }], importantWords: ["추천"] },
    { id: "ko_r_2", ko: "이건 아주 인기가 많아요.", roman: "Igeon aju ingiga manayo.", vi: "Mẫu này rất được ưa chuộng ạ.", vocab: [{ word: "인기", roman: "ingi", vi: "sự ưa chuộng" }], importantWords: ["인기"] },
    { id: "ko_r_3", ko: "이건 베스트셀러예요.", roman: "Igeon beseuteuselleoyeyo.", vi: "Đây là sản phẩm bán chạy nhất ạ.", importantWords: ["베스트셀러"] },
    { id: "ko_r_4", ko: "신상품이에요.", roman: "Sinsangpum-ieyo.", vi: "Đây là hàng mới về ạ.", vocab: [{ word: "신상품", roman: "sinsangpum", vi: "hàng mới" }], importantWords: ["신상품"] },
    { id: "ko_r_5", ko: "한번 써 보시겠어요?", roman: "Hanbeon sseo bosigesseoyo?", vi: "Quý khách thử một lần nhé ạ?", importantWords: ["써", "보시"] },
    { id: "ko_r_6", ko: "잘 어울리세요.", roman: "Jal eoulliseyo.", vi: "Rất hợp với quý khách ạ.", importantWords: ["어울"] },
    { id: "ko_r_7", ko: "여러 가지 색이 있어요.", roman: "Yeoreo gaji saegi isseoyo.", vi: "Có nhiều màu ạ.", replaceable: [{ slotVi: "thuộc tính", alts: [{ ko: "사이즈", vi: "kích cỡ" }, { ko: "향", vi: "mùi hương" }] }], importantWords: ["색"] },
  ],
  dialogue: { titleVi: "Tư vấn mẫu", lines: [
    { speaker: "customer", ko: "추천해 주시겠어요?", roman: "Chucheonhae jusigesseoyo?", vi: "Bạn gợi ý giúp được không?" },
    { speaker: "staff", ko: "네, 몇 가지 추천해 드릴게요.", roman: "Ne, myeot gaji chucheonhae deurilgeyo.", vi: "Vâng, em giới thiệu vài mẫu ạ." },
    { speaker: "staff", ko: "이건 베스트셀러예요. 인기가 많아요.", roman: "Igeon beseuteuselleoyeyo. Ingiga manayo.", vi: "Mẫu này bán chạy nhất, rất được ưa chuộng ạ." },
    { speaker: "staff", ko: "한번 써 보시겠어요?", roman: "Hanbeon sseo bosigesseoyo?", vi: "Quý khách thử nhé ạ?" },
  ] },
  roleplay: { titleVi: "Đóng vai: gợi ý sản phẩm", customerGoalVi: "Khách nhờ tư vấn.", staffGoalVi: "Gợi ý mẫu bán chạy/mới, mời thử.", requiredPhraseIds: ["ko_r_1", "ko_r_3", "ko_r_5"] },
  quiz: [
    { id: "koq_r_1", promptVi: "Nói đây là hàng bán chạy nhất?", options: ["이건 베스트셀러예요.", "예산이 어떻게 되세요?", "또 오세요."], correctAnswer: "이건 베스트셀러예요." },
    { id: "koq_r_2", promptVi: "Mời khách thử sản phẩm?", options: ["한번 써 보시겠어요?", "영수증 여기 있습니다.", "면세점이에요."], correctAnswer: "한번 써 보시겠어요?" },
    { id: "koq_r_3", promptVi: "Giới thiệu hàng mới về?", options: ["신상품이에요.", "봉투 드릴까요?", "할인 중이에요."], correctAnswer: "신상품이에요." },
  ],
};

const L4: KoLesson = {
  id: "ko_price_promotion",
  titleKo: "가격 & 행사",
  titleVi: "Giá & khuyến mãi",
  objectiveVi: "Báo giá miễn thuế, giải thích khuyến mãi.",
  status: "ready",
  phrases: [
    { id: "ko_p_1", ko: "이건 면세 가격이에요.", roman: "Igeon myeonse gagyeog-ieyo.", vi: "Đây là giá miễn thuế ạ.", vocab: [{ word: "면세", roman: "myeonse", vi: "miễn thuế" }, { word: "가격", roman: "gagyeok", vi: "giá" }], importantWords: ["면세", "가격"] },
    { id: "ko_p_2", ko: "지금 할인 중이에요.", roman: "Jigeum harin jung-ieyo.", vi: "Hiện đang giảm giá ạ.", vocab: [{ word: "할인", roman: "harin", vi: "giảm giá" }], importantWords: ["할인"] },
    { id: "ko_p_3", ko: "원 플러스 원 행사예요.", roman: "Won peulleoseu won haengsayeyo.", vi: "Chương trình mua một tặng một ạ.", vocab: [{ word: "행사", roman: "haengsa", vi: "chương trình KM" }], importantWords: ["행사"] },
    { id: "ko_p_4", ko: "제가 가격을 확인해 드릴게요.", roman: "Jega gagyeogeul hwaginhae deurilgeyo.", vi: "Để em kiểm tra giá giúp ạ.", importantWords: ["가격", "확인"] },
    { id: "ko_p_5", ko: "시내보다 저렴해요.", roman: "Sinaeboda jeoryeomhaeyo.", vi: "Rẻ hơn giá trong phố ạ.", vocab: [{ word: "저렴하다", roman: "jeoryeomhada", vi: "rẻ" }], importantWords: ["시내", "저렴"] },
    { id: "ko_p_6", ko: "이미 할인된 가격이에요.", roman: "Imi harindoen gagyeog-ieyo.", vi: "Đây đã là giá giảm rồi ạ.", importantWords: ["할인", "가격"] },
    { id: "ko_p_7", ko: "사은품이 있어요.", roman: "Saeunpum-i isseoyo.", vi: "Có quà tặng kèm ạ.", importantWords: ["사은품"] },
  ],
  dialogue: { titleVi: "Báo giá & khuyến mãi", lines: [
    { speaker: "customer", ko: "이거 얼마예요?", roman: "Igeo eolmayeyo?", vi: "Cái này bao nhiêu?" },
    { speaker: "staff", ko: "제가 가격을 확인해 드릴게요. 면세 가격이에요.", roman: "Jega gagyeogeul hwaginhae deurilgeyo. Myeonse gagyeog-ieyo.", vi: "Để em kiểm tra ạ. Đây là giá miễn thuế." },
    { speaker: "staff", ko: "지금 원 플러스 원 행사예요.", roman: "Jigeum won peulleoseu won haengsayeyo.", vi: "Đang có mua một tặng một ạ." },
    { speaker: "customer", ko: "좋네요.", roman: "Jonneyo.", vi: "Hời đấy." },
  ] },
  roleplay: { titleVi: "Đóng vai: hỏi giá", customerGoalVi: "Khách hỏi giá & khuyến mãi.", staffGoalVi: "Kiểm tra giá, nêu giá miễn thuế + khuyến mãi.", requiredPhraseIds: ["ko_p_1", "ko_p_2", "ko_p_4"] },
  quiz: [
    { id: "koq_p_1", promptVi: "Cho khách biết đây là giá miễn thuế?", options: ["이건 면세 가격이에요.", "한번 써 보시겠어요?", "누구에게 줄 선물이세요?"], correctAnswer: "이건 면세 가격이에요." },
    { id: "koq_p_2", promptVi: "Báo mua một tặng một?", options: ["원 플러스 원 행사예요.", "천천히 둘러보세요.", "여권을 보여 주세요."], correctAnswer: "원 플러스 원 행사예요." },
    { id: "koq_p_3", promptVi: "Nói để kiểm tra giá giúp khách?", options: ["제가 가격을 확인해 드릴게요.", "신상품이에요.", "좋은 여행 되세요!"], correctAnswer: "제가 가격을 확인해 드릴게요." },
  ],
};

const L5: KoLesson = {
  id: "ko_payment_receipt",
  titleKo: "결제 & 영수증",
  titleVi: "Thanh toán & hóa đơn",
  objectiveVi: "Hỏi cách thanh toán, xin giấy tờ, xác nhận, đưa hóa đơn.",
  status: "ready",
  phrases: [
    { id: "ko_pay_1", ko: "어떻게 결제하시겠어요?", roman: "Eotteoke gyeoljehasigesseoyo?", vi: "Quý khách thanh toán bằng cách nào ạ?", vocab: [{ word: "결제", roman: "gyeolje", vi: "thanh toán" }], importantWords: ["결제"] },
    { id: "ko_pay_2", ko: "카드로 하시겠어요, QR로 하시겠어요?", roman: "Kadeuro hasigesseoyo, QR-ro hasigesseoyo?", vi: "Quý khách quẹt thẻ hay quét QR ạ?", vocab: [{ word: "카드", roman: "kadeu", vi: "thẻ" }], importantWords: ["카드"] },
    { id: "ko_pay_3", ko: "여권과 탑승권을 보여 주시겠어요?", roman: "Yeogwon-gwa tapseunggwon-eul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?", vocab: [{ word: "여권", roman: "yeogwon", vi: "hộ chiếu" }, { word: "탑승권", roman: "tapseunggwon", vi: "thẻ lên máy bay" }], usageVi: "Mua hàng miễn thuế cần xuất trình giấy tờ.", importantWords: ["여권", "탑승권"] },
    { id: "ko_pay_4", ko: "카드를 넣어 주세요.", roman: "Kadeureul neoeo juseyo.", vi: "Quý khách cắm thẻ giúp ạ.", importantWords: ["카드", "넣어"] },
    { id: "ko_pay_5", ko: "결제가 완료되었어요.", roman: "Gyeoljega wallyodoeeosseoyo.", vi: "Thanh toán đã hoàn tất ạ.", importantWords: ["결제", "완료"] },
    { id: "ko_pay_6", ko: "영수증 여기 있습니다.", roman: "Yeongsujeung yeogi itseumnida.", vi: "Đây là hóa đơn ạ.", vocab: [{ word: "영수증", roman: "yeongsujeung", vi: "hóa đơn" }], importantWords: ["영수증"] },
    { id: "ko_pay_7", ko: "봉투 드릴까요?", roman: "Bongtu deurilkkayo?", vi: "Quý khách cần túi không ạ?", importantWords: ["봉투"] },
  ],
  dialogue: { titleVi: "Thanh toán", lines: [
    { speaker: "staff", ko: "어떻게 결제하시겠어요?", roman: "Eotteoke gyeoljehasigesseoyo?", vi: "Quý khách thanh toán bằng gì ạ?" },
    { speaker: "customer", ko: "카드로 할게요.", roman: "Kadeuro halgeyo.", vi: "Bằng thẻ." },
    { speaker: "staff", ko: "여권과 탑승권을 보여 주시겠어요?", roman: "Yeogwon-gwa tapseunggwon-eul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?" },
    { speaker: "staff", ko: "결제가 완료되었어요. 영수증 여기 있습니다.", roman: "Gyeoljega wallyodoeeosseoyo. Yeongsujeung yeogi itseumnida.", vi: "Thanh toán hoàn tất. Đây là hóa đơn ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: thu tiền", customerGoalVi: "Khách thanh toán bằng thẻ.", staffGoalVi: "Hỏi cách trả, xin giấy tờ, xác nhận, đưa hóa đơn.", requiredPhraseIds: ["ko_pay_1", "ko_pay_3", "ko_pay_6"] },
  quiz: [
    { id: "koq_pay_1", promptVi: "Hỏi khách trả bằng thẻ hay QR?", options: ["카드로 하시겠어요, QR로 하시겠어요?", "영수증 여기 있습니다.", "천천히 둘러보세요."], correctAnswer: "카드로 하시겠어요, QR로 하시겠어요?" },
    { id: "koq_pay_2", promptVi: "Xác nhận thanh toán hoàn tất?", options: ["결제가 완료되었어요.", "선물을 찾으세요?", "안녕하세요!"], correctAnswer: "결제가 완료되었어요." },
    { id: "koq_pay_3", promptVi: "Đưa hóa đơn cho khách?", options: ["영수증 여기 있습니다.", "예산이 어떻게 되세요?", "신상품이에요."], correctAnswer: "영수증 여기 있습니다." },
  ],
};

const L6: KoLesson = {
  id: "ko_polite_closing",
  titleKo: "정중한 마무리",
  titleVi: "Kết thúc lịch sự",
  objectiveVi: "Cảm ơn, chúc khách và tiễn khách lịch sự.",
  status: "ready",
  phrases: [
    { id: "ko_c_1", ko: "이용해 주셔서 감사합니다.", roman: "Iyonghae jusyeoseo gamsahamnida.", vi: "Cảm ơn quý khách đã mua sắm ạ.", vocab: [{ word: "감사합니다", roman: "gamsahamnida", vi: "cảm ơn" }], importantWords: ["감사"] },
    { id: "ko_c_2", ko: "좋은 여행 되세요!", roman: "Joeun yeohaeng doeseyo!", vi: "Chúc quý khách chuyến đi vui vẻ!", vocab: [{ word: "여행", roman: "yeohaeng", vi: "chuyến đi" }], importantWords: ["여행"] },
    { id: "ko_c_3", ko: "안전한 비행 되세요!", roman: "Anjeonhan bihaeng doeseyo!", vi: "Chúc quý khách bay an toàn!", importantWords: ["안전", "비행"] },
    { id: "ko_c_4", ko: "또 오세요.", roman: "Tto oseyo.", vi: "Hẹn gặp lại ạ.", importantWords: ["또"] },
    { id: "ko_c_5", ko: "즐거운 쇼핑 되세요.", roman: "Jeulgeoun syoping doeseyo.", vi: "Chúc quý khách mua sắm vui vẻ ạ.", importantWords: ["쇼핑"] },
    { id: "ko_c_6", ko: "상품을 확인해 주세요.", roman: "Sangpum-eul hwaginhae juseyo.", vi: "Quý khách kiểm tra hàng giúp ạ.", importantWords: ["상품", "확인"] },
    { id: "ko_c_7", ko: "안녕히 가세요.", roman: "Annyeonghi gaseyo.", vi: "Quý khách đi ạ (tạm biệt).", importantWords: ["안녕히"] },
  ],
  dialogue: { titleVi: "Tiễn khách", lines: [
    { speaker: "staff", ko: "상품을 확인해 주세요.", roman: "Sangpum-eul hwaginhae juseyo.", vi: "Quý khách kiểm tra hàng giúp ạ." },
    { speaker: "customer", ko: "감사합니다.", roman: "Gamsahamnida.", vi: "Cảm ơn." },
    { speaker: "staff", ko: "이용해 주셔서 감사합니다. 좋은 여행 되세요!", roman: "Iyonghae jusyeoseo gamsahamnida. Joeun yeohaeng doeseyo!", vi: "Cảm ơn quý khách đã mua sắm. Chúc đi vui ạ!" },
    { speaker: "staff", ko: "안녕히 가세요.", roman: "Annyeonghi gaseyo.", vi: "Quý khách đi ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: tiễn khách", customerGoalVi: "Khách vừa nhận hàng, chuẩn bị đi.", staffGoalVi: "Cảm ơn, chúc đi vui/bay an toàn, hẹn gặp lại.", requiredPhraseIds: ["ko_c_1", "ko_c_2", "ko_c_3"] },
  quiz: [
    { id: "koq_c_1", promptVi: "Cảm ơn khách đã mua sắm?", options: ["이용해 주셔서 감사합니다.", "어떻게 결제하시겠어요?", "무엇을 찾으세요?"], correctAnswer: "이용해 주셔서 감사합니다." },
    { id: "koq_c_2", promptVi: "Chúc khách bay an toàn?", options: ["안전한 비행 되세요!", "원 플러스 원 행사예요.", "천천히 둘러보세요."], correctAnswer: "안전한 비행 되세요!" },
    { id: "koq_c_3", promptVi: "Hẹn gặp lại lịch sự?", options: ["또 오세요.", "여권을 보여 주세요.", "할인 중이에요."], correctAnswer: "또 오세요." },
  ],
};

// ============================================================
// MODULE 2 — Product Sales Korean
// ============================================================

const PERFUME: KoLesson = {
  id: "ko_perfume_sales",
  titleKo: "향수 판매",
  titleVi: "Bán nước hoa",
  objectiveVi: "Tư vấn nước hoa: nam/nữ, mùi hương, thử mùi, gói quà.",
  status: "ready",
  phrases: [
    { id: "ko_pf_1", ko: "남성용 향수를 찾으세요, 여성용을 찾으세요?", roman: "Namseong-yong hyangsureul chajeuseyo, yeoseong-yong-eul chajeuseyo?", vi: "Quý khách tìm nước hoa nam hay nữ ạ?", vocab: [{ word: "향수", roman: "hyangsu", vi: "nước hoa" }], importantWords: ["향수", "남성", "여성"] },
    { id: "ko_pf_2", ko: "어떤 향을 좋아하세요?", roman: "Eotteon hyang-eul joahaseyo?", vi: "Quý khách thích mùi nào ạ?", vocab: [{ word: "향", roman: "hyang", vi: "mùi hương" }], importantWords: ["향", "좋아"] },
    { id: "ko_pf_3", ko: "이건 상큼하고 가벼워요.", roman: "Igeon sangkeumhago gabyeowoyo.", vi: "Mẫu này tươi mát và nhẹ ạ.", replaceable: [{ slotVi: "tính chất mùi", alts: [{ ko: "달콤해요", vi: "ngọt" }, { ko: "진해요", vi: "đậm" }] }], importantWords: ["상큼", "가벼"] },
    { id: "ko_pf_4", ko: "시향해 보시겠어요?", roman: "Sihyanghae bosigesseoyo?", vi: "Quý khách thử mùi nhé ạ?", vocab: [{ word: "시향", roman: "sihyang", vi: "thử mùi" }], importantWords: ["시향"] },
    { id: "ko_pf_5", ko: "향이 오래가요.", roman: "Hyang-i oraegayo.", vi: "Mùi lưu lại lâu ạ.", importantWords: ["향", "오래"] },
    { id: "ko_pf_6", ko: "선물로 인기가 많아요.", roman: "Seonmullo ingiga manayo.", vi: "Được ưa chuộng làm quà ạ.", importantWords: ["선물", "인기"] },
    { id: "ko_pf_7", ko: "선물 포장해 드릴까요?", roman: "Seonmul pojanghae deurilkkayo?", vi: "Quý khách có muốn gói quà không ạ?", vocab: [{ word: "포장", roman: "pojang", vi: "gói" }], importantWords: ["포장"] },
  ],
  dialogue: { titleVi: "Bán nước hoa", lines: [
    { speaker: "staff", ko: "남성용 향수를 찾으세요, 여성용을 찾으세요?", roman: "Namseong-yong hyangsureul chajeuseyo, yeoseong-yong-eul chajeuseyo?", vi: "Quý khách tìm nước hoa nam hay nữ ạ?" },
    { speaker: "customer", ko: "여성용이요, 선물이에요.", roman: "Yeoseong-yong-iyo, seonmurieyo.", vi: "Nữ ạ, để làm quà." },
    { speaker: "staff", ko: "어떤 향을 좋아하세요?", roman: "Eotteon hyang-eul joahaseyo?", vi: "Cô ấy thích mùi nào ạ?" },
    { speaker: "staff", ko: "이건 상큼하고 가벼워요. 시향해 보시겠어요?", roman: "Igeon sangkeumhago gabyeowoyo. Sihyanghae bosigesseoyo?", vi: "Mẫu này tươi nhẹ. Quý khách thử mùi nhé?" },
  ] },
  roleplay: { titleVi: "Đóng vai: tư vấn nước hoa làm quà", customerGoalVi: "Khách mua nước hoa nữ làm quà, thích mùi tươi.", staffGoalVi: "Hỏi nam/nữ + mùi, gợi ý mẫu tươi nhẹ, mời thử, hỏi gói quà.", requiredPhraseIds: ["ko_pf_1", "ko_pf_2", "ko_pf_4", "ko_pf_7"] },
  quiz: [
    { id: "koq_pf_1", promptVi: "Hỏi nước hoa nam hay nữ?", options: ["남성용 향수를 찾으세요, 여성용을 찾으세요?", "영수증 여기 있습니다.", "또 오세요."], correctAnswer: "남성용 향수를 찾으세요, 여성용을 찾으세요?" },
    { id: "koq_pf_2", promptVi: "Mời khách thử mùi?", options: ["시향해 보시겠어요?", "어떻게 결제하시겠어요?", "천천히 둘러보세요."], correctAnswer: "시향해 보시겠어요?" },
    { id: "koq_pf_3", promptVi: "Hỏi gói quà?", options: ["선물 포장해 드릴까요?", "예산이 어떻게 되세요?", "신상품이에요."], correctAnswer: "선물 포장해 드릴까요?" },
  ],
};

const COSMETICS: KoLesson = {
  id: "ko_cosmetics_sales",
  titleKo: "화장품 판매",
  titleVi: "Bán mỹ phẩm & dưỡng da",
  objectiveVi: "Tư vấn mỹ phẩm theo loại da, công dụng và cách dùng.",
  status: "ready",
  phrases: [
    { id: "ko_cos_1", ko: "스킨케어를 찾으세요, 메이크업을 찾으세요?", roman: "Seukinkeeoreul chajeuseyo, meikeueobeul chajeuseyo?", vi: "Quý khách tìm đồ dưỡng da hay trang điểm ạ?", pronTips: ["'스킨케어' = 'sư-khin-khê-ơ'."], vocab: [{ word: "스킨케어", roman: "seukinkeeo", vi: "đồ dưỡng da" }, { word: "메이크업", roman: "meikeueop", vi: "trang điểm" }], importantWords: ["스킨케어", "메이크업"] },
    { id: "ko_cos_2", ko: "피부 타입이 어떻게 되세요?", roman: "Pibu taibi eotteoke doeseyo?", vi: "Da của quý khách thuộc loại nào ạ?", vocab: [{ word: "피부", roman: "pibu", vi: "da" }], importantWords: ["피부", "타입"] },
    { id: "ko_cos_3", ko: "이건 건성 피부에 좋아요.", roman: "Igeon geonseong pibue joayo.", vi: "Loại này hợp với da khô ạ.", replaceable: [{ slotVi: "loại da", alts: [{ ko: "지성", vi: "da dầu" }, { ko: "민감성", vi: "da nhạy cảm" }, { ko: "복합성", vi: "da hỗn hợp" }] }], importantWords: ["건성", "피부"] },
    { id: "ko_cos_4", ko: "수분을 주고 피부를 환하게 해요.", roman: "Subuneul jugo pibureul hwanhage haeyo.", vi: "Cấp ẩm và làm sáng da ạ.", vocab: [{ word: "수분", roman: "subun", vi: "độ ẩm" }], importantWords: ["수분", "환하"] },
    { id: "ko_cos_5", ko: "샘플 한번 써 보시겠어요?", roman: "Saempeul hanbeon sseo bosigesseoyo?", vi: "Quý khách thử mẫu thử nhé ạ?", vocab: [{ word: "샘플", roman: "saempeul", vi: "mẫu thử" }], importantWords: ["샘플", "써"] },
    { id: "ko_cos_6", ko: "손등에 조금 발라 보세요.", roman: "Sondeunge jogeum balla boseyo.", vi: "Quý khách thử thoa một chút lên mu bàn tay ạ.", vocab: [{ word: "바르다", roman: "bareuda", vi: "thoa, bôi" }], importantWords: ["손등", "발라"] },
    { id: "ko_cos_7", ko: "이 색이 피부 톤에 잘 맞아요.", roman: "I saegi pibu tone jal majayo.", vi: "Màu này hợp với tông da của quý khách ạ.", usageVi: "Dùng khi tư vấn son/phấn nền theo màu da.", importantWords: ["색", "톤", "맞아"] },
  ],
  dialogue: { titleVi: "Bán dưỡng da", lines: [
    { speaker: "staff", ko: "스킨케어를 찾으세요, 메이크업을 찾으세요?", roman: "Seukinkeeoreul chajeuseyo, meikeueobeul chajeuseyo?", vi: "Quý khách tìm dưỡng da hay trang điểm ạ?" },
    { speaker: "customer", ko: "스킨케어요, 건성 피부예요.", roman: "Seukinkeeoyo, geonseong pibuyeyo.", vi: "Dưỡng da, da khô ạ." },
    { speaker: "staff", ko: "이건 건성 피부에 좋아요. 수분을 주고 피부를 환하게 해요.", roman: "Igeon geonseong pibue joayo. Subuneul jugo pibureul hwanhage haeyo.", vi: "Loại này hợp da khô, cấp ẩm và làm sáng da ạ." },
    { speaker: "staff", ko: "샘플 한번 써 보시겠어요?", roman: "Saempeul hanbeon sseo bosigesseoyo?", vi: "Quý khách thử mẫu nhé ạ?" },
  ] },
  roleplay: { titleVi: "Đóng vai: tư vấn dưỡng da", customerGoalVi: "Khách da khô tìm đồ dưỡng.", staffGoalVi: "Hỏi loại da, gợi ý sản phẩm hợp, mời thử mẫu.", requiredPhraseIds: ["ko_cos_1", "ko_cos_2", "ko_cos_3", "ko_cos_5"] },
  quiz: [
    { id: "koq_cos_1", promptVi: "Hỏi loại da của khách?", options: ["피부 타입이 어떻게 되세요?", "영수증 여기 있습니다.", "또 오세요."], correctAnswer: "피부 타입이 어떻게 되세요?" },
    { id: "koq_cos_2", promptVi: "Gợi ý sản phẩm cho da khô?", options: ["이건 건성 피부에 좋아요.", "원 플러스 원 행사예요.", "누구에게 줄 선물이세요?"], correctAnswer: "이건 건성 피부에 좋아요." },
    { id: "koq_cos_3", promptVi: "Mời khách thử mẫu thử?", options: ["샘플 한번 써 보시겠어요?", "어떻게 결제하시겠어요?", "안전한 비행 되세요!"], correctAnswer: "샘플 한번 써 보시겠어요?" },
  ],
};

const WINE: KoLesson = {
  id: "ko_wine_spirits_sales",
  titleKo: "주류 판매",
  titleVi: "Bán rượu vang & rượu mạnh",
  objectiveVi: "Tư vấn rượu; lưu ý quy định độ tuổi & hạn mức.",
  status: "ready",
  phrases: [
    { id: "ko_wine_1", ko: "와인을 찾으세요, 양주를 찾으세요?", roman: "Waineul chajeuseyo, yangjureul chajeuseyo?", vi: "Quý khách tìm rượu vang hay rượu mạnh ạ?", vocab: [{ word: "와인", roman: "wain", vi: "rượu vang" }, { word: "양주", roman: "yangju", vi: "rượu mạnh (ngoại)" }], importantWords: ["와인", "양주"] },
    { id: "ko_wine_2", ko: "레드 와인이 좋으세요, 화이트 와인이 좋으세요?", roman: "Redeu waini joeuseyo, hwaiteu waini joeuseyo?", vi: "Quý khách thích vang đỏ hay vang trắng ạ?", importantWords: ["레드", "화이트"] },
    { id: "ko_wine_3", ko: "이 위스키는 아주 부드러워요.", roman: "I wiseukineun aju budeureowoyo.", vi: "Loại whisky này rất êm ạ.", vocab: [{ word: "위스키", roman: "wiseuki", vi: "whisky" }, { word: "부드럽다", roman: "budeureopda", vi: "êm, mượt" }], replaceable: [{ slotVi: "loại rượu", alts: [{ ko: "꼬냑", vi: "cognac" }, { ko: "보드카", vi: "vodka" }] }], importantWords: ["위스키", "부드러"] },
    { id: "ko_wine_4", ko: "이건 싱글 몰트예요.", roman: "Igeon singgeul molteuyeyo.", vi: "Đây là rượu single malt ạ.", importantWords: ["싱글", "몰트"] },
    { id: "ko_wine_5", ko: "해산물과 잘 어울려요.", roman: "Haesanmulgwa jal eoullyeoyo.", vi: "Hợp khi dùng với hải sản ạ.", vocab: [{ word: "해산물", roman: "haesanmul", vi: "hải sản" }], importantWords: ["해산물", "어울"] },
    { id: "ko_wine_6", ko: "나이 확인을 위해 여권을 보여 주시겠어요?", roman: "Nai hwagineul wihae yeogwoneul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu để kiểm tra độ tuổi ạ?", usageVi: "Bán rượu cần kiểm tra độ tuổi theo quy định.", importantWords: ["나이", "여권"] },
    { id: "ko_wine_7", ko: "주류는 수량 제한이 있어요.", roman: "Juryuneun suryang jehani isseoyo.", vi: "Rượu có giới hạn số lượng ạ.", vocab: [{ word: "주류", roman: "juryu", vi: "đồ uống có cồn" }], importantWords: ["주류", "제한"] },
  ],
  dialogue: { titleVi: "Bán rượu", lines: [
    { speaker: "staff", ko: "와인을 찾으세요, 양주를 찾으세요?", roman: "Waineul chajeuseyo, yangjureul chajeuseyo?", vi: "Quý khách tìm vang hay rượu mạnh ạ?" },
    { speaker: "customer", ko: "위스키요, 선물이에요.", roman: "Wiseukiyo, seonmurieyo.", vi: "Whisky, để làm quà." },
    { speaker: "staff", ko: "이 위스키는 아주 부드러워요. 싱글 몰트예요.", roman: "I wiseukineun aju budeureowoyo. Singgeul molteuyeyo.", vi: "Loại này rất êm, là single malt ạ." },
    { speaker: "staff", ko: "나이 확인을 위해 여권을 보여 주시겠어요?", roman: "Nai hwagineul wihae yeogwoneul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu để kiểm tra độ tuổi ạ?" },
  ] },
  roleplay: { titleVi: "Đóng vai: bán whisky làm quà", customerGoalVi: "Khách mua whisky làm quà.", staffGoalVi: "Hỏi loại, gợi ý mẫu êm, kiểm tra độ tuổi, nêu hạn mức.", requiredPhraseIds: ["ko_wine_1", "ko_wine_3", "ko_wine_6"] },
  quiz: [
    { id: "koq_wine_1", promptVi: "Hỏi khách thích vang đỏ hay trắng?", options: ["레드 와인이 좋으세요, 화이트 와인이 좋으세요?", "영수증 여기 있습니다.", "천천히 둘러보세요."], correctAnswer: "레드 와인이 좋으세요, 화이트 와인이 좋으세요?" },
    { id: "koq_wine_2", promptVi: "Xin hộ chiếu để kiểm tra độ tuổi?", options: ["나이 확인을 위해 여권을 보여 주시겠어요?", "신상품이에요.", "또 오세요."], correctAnswer: "나이 확인을 위해 여권을 보여 주시겠어요?" },
    { id: "koq_wine_3", promptVi: "Nói rượu có giới hạn số lượng?", options: ["주류는 수량 제한이 있어요.", "봉투 드릴까요?", "안녕하세요!"], correctAnswer: "주류는 수량 제한이 있어요." },
  ],
};

const TOBACCO: KoLesson = {
  id: "ko_tobacco_sales",
  titleKo: "담배 판매",
  titleVi: "Bán thuốc lá",
  objectiveVi: "Bán thuốc lá theo quy định: độ tuổi, hạn mức, giấy tờ.",
  status: "ready",
  phrases: [
    { id: "ko_tob_1", ko: "어떤 브랜드로 드릴까요?", roman: "Eotteon beuraendeuro deurilkkayo?", vi: "Quý khách lấy loại nào ạ?", importantWords: ["브랜드"] },
    { id: "ko_tob_2", ko: "한 보루로 드릴까요, 한 갑으로 드릴까요?", roman: "Han boruro deurilkkayo, han gabeuro deurilkkayo?", vi: "Quý khách lấy cây hay gói lẻ ạ?", vocab: [{ word: "보루", roman: "boru", vi: "cây (thuốc)" }, { word: "갑", roman: "gap", vi: "gói, bao" }], importantWords: ["보루", "갑"] },
    { id: "ko_tob_3", ko: "여권과 탑승권을 보여 주시겠어요?", roman: "Yeogwon-gwa tapseunggwoneul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?", usageVi: "Bán thuốc lá cần kiểm tra giấy tờ & độ tuổi.", importantWords: ["여권", "탑승권"] },
    { id: "ko_tob_4", ko: "담배는 수량 제한이 있어요.", roman: "Dambaeneun suryang jehani isseoyo.", vi: "Thuốc lá có giới hạn số lượng ạ.", vocab: [{ word: "담배", roman: "dambae", vi: "thuốc lá" }], importantWords: ["담배", "제한"] },
    { id: "ko_tob_5", ko: "최대 두 보루까지예요.", roman: "Choedae du borukkajiyeyo.", vi: "Tối đa là hai cây ạ.", importantWords: ["최대", "보루"] },
    { id: "ko_tob_6", ko: "필요하면 세관에 신고하세요.", roman: "Piryohamyeon segwane singohaseyo.", vi: "Nếu cần, quý khách khai báo ở hải quan ạ.", importantWords: ["세관", "신고"] },
    { id: "ko_tob_7", ko: "영수증 여기 있습니다. 보관해 주세요.", roman: "Yeongsujeung yeogi itseumnida. Bogwanhae juseyo.", vi: "Đây là hóa đơn, quý khách giữ giúp ạ.", importantWords: ["영수증", "보관"] },
  ],
  dialogue: { titleVi: "Bán thuốc lá", lines: [
    { speaker: "customer", ko: "한 보루 주세요.", roman: "Han boru juseyo.", vi: "Cho tôi một cây." },
    { speaker: "staff", ko: "여권과 탑승권을 보여 주시겠어요?", roman: "Yeogwon-gwa tapseunggwoneul boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu và thẻ lên máy bay ạ?" },
    { speaker: "staff", ko: "담배는 수량 제한이 있어요. 최대 두 보루까지예요.", roman: "Dambaeneun suryang jehani isseoyo. Choedae du borukkajiyeyo.", vi: "Thuốc lá có giới hạn, tối đa hai cây ạ." },
    { speaker: "staff", ko: "영수증 여기 있습니다. 보관해 주세요.", roman: "Yeongsujeung yeogi itseumnida. Bogwanhae juseyo.", vi: "Đây là hóa đơn, quý khách giữ giúp ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: bán thuốc lá theo quy định", customerGoalVi: "Khách mua thuốc lá.", staffGoalVi: "Xin giấy tờ, nêu giới hạn, đưa hóa đơn.", requiredPhraseIds: ["ko_tob_2", "ko_tob_3", "ko_tob_4"] },
  quiz: [
    { id: "koq_tob_1", promptVi: "Hỏi khách lấy cây hay gói lẻ?", options: ["한 보루로 드릴까요, 한 갑으로 드릴까요?", "좋은 여행 되세요!", "어떤 브랜드를 좋아하세요?"], correctAnswer: "한 보루로 드릴까요, 한 갑으로 드릴까요?" },
    { id: "koq_tob_2", promptVi: "Nói thuốc lá có giới hạn?", options: ["담배는 수량 제한이 있어요.", "지금 할인 중이에요.", "천천히 둘러보세요."], correctAnswer: "담배는 수량 제한이 있어요." },
    { id: "koq_tob_3", promptVi: "Xin giấy tờ để bán theo quy định?", options: ["여권과 탑승권을 보여 주시겠어요?", "봉투 드릴까요?", "즐거운 쇼핑 되세요."], correctAnswer: "여권과 탑승권을 보여 주시겠어요?" },
  ],
};

const CONFECTIONERY: KoLesson = {
  id: "ko_confectionery_sales",
  titleKo: "과자 & 선물",
  titleVi: "Bánh kẹo & quà tặng",
  objectiveVi: "Tư vấn socola, bánh kẹo và quà tặng; gói quà.",
  status: "ready",
  phrases: [
    { id: "ko_conf_1", ko: "초콜릿을 찾으세요, 사탕을 찾으세요?", roman: "Chokolliseul chajeuseyo, satangeul chajeuseyo?", vi: "Quý khách tìm socola hay kẹo ạ?", vocab: [{ word: "초콜릿", roman: "chokollit", vi: "socola" }, { word: "사탕", roman: "satang", vi: "kẹo" }], importantWords: ["초콜릿", "사탕"] },
    { id: "ko_conf_2", ko: "이건 베스트셀러예요.", roman: "Igeon beseuteuselleoyeyo.", vi: "Đây là sản phẩm bán chạy nhất ạ.", importantWords: ["베스트셀러"] },
    { id: "ko_conf_3", ko: "너무 달지 않아요.", roman: "Neomu dalji anayo.", vi: "Không quá ngọt ạ.", importantWords: ["달지"] },
    { id: "ko_conf_4", ko: "이 박스는 선물로 좋아요.", roman: "I bakseuneun seonmullo joayo.", vi: "Hộp này rất hợp làm quà ạ.", vocab: [{ word: "박스", roman: "bakseu", vi: "hộp" }], importantWords: ["박스", "선물"] },
    { id: "ko_conf_5", ko: "선물 포장해 드릴까요?", roman: "Seonmul pojanghae deurilkkayo?", vi: "Quý khách có muốn gói quà không ạ?", importantWords: ["포장"] },
    { id: "ko_conf_6", ko: "유통기한을 확인해 주세요.", roman: "Yutonggihaneul hwaginhae juseyo.", vi: "Quý khách xem hạn sử dụng giúp ạ.", vocab: [{ word: "유통기한", roman: "yutonggihan", vi: "hạn sử dụng" }], importantWords: ["유통기한", "확인"] },
    { id: "ko_conf_7", ko: "견과류가 들어 있어요.", roman: "Gyeongwaryuga deureo isseoyo.", vi: "Có chứa các loại hạt ạ.", usageVi: "Lưu ý dị ứng cho khách.", importantWords: ["견과류"] },
  ],
  dialogue: { titleVi: "Bán bánh kẹo", lines: [
    { speaker: "staff", ko: "초콜릿을 찾으세요, 사탕을 찾으세요?", roman: "Chokolliseul chajeuseyo, satangeul chajeuseyo?", vi: "Quý khách tìm socola hay kẹo ạ?" },
    { speaker: "customer", ko: "초콜릿이요, 선물이에요.", roman: "Chokolliriyo, seonmurieyo.", vi: "Socola, để làm quà." },
    { speaker: "staff", ko: "이 박스는 선물로 좋아요. 베스트셀러예요.", roman: "I bakseuneun seonmullo joayo. Beseuteuselleoyeyo.", vi: "Hộp này hợp làm quà, bán chạy nhất ạ." },
    { speaker: "staff", ko: "선물 포장해 드릴까요?", roman: "Seonmul pojanghae deurilkkayo?", vi: "Quý khách có muốn gói quà không ạ?" },
  ] },
  roleplay: { titleVi: "Đóng vai: bán socola làm quà", customerGoalVi: "Khách mua socola làm quà.", staffGoalVi: "Gợi ý hộp đẹp/bán chạy, hỏi gói quà, nhắc hạn dùng.", requiredPhraseIds: ["ko_conf_1", "ko_conf_4", "ko_conf_5"] },
  quiz: [
    { id: "koq_conf_1", promptVi: "Hỏi khách tìm socola hay kẹo?", options: ["초콜릿을 찾으세요, 사탕을 찾으세요?", "어떻게 결제하시겠어요?", "안전한 비행 되세요!"], correctAnswer: "초콜릿을 찾으세요, 사탕을 찾으세요?" },
    { id: "koq_conf_2", promptVi: "Hỏi khách có gói quà không?", options: ["선물 포장해 드릴까요?", "담배는 수량 제한이 있어요.", "천천히 둘러보세요."], correctAnswer: "선물 포장해 드릴까요?" },
    { id: "koq_conf_3", promptVi: "Nhắc khách xem hạn sử dụng?", options: ["유통기한을 확인해 주세요.", "면세 가격이에요.", "누구에게 줄 선물이세요?"], correctAnswer: "유통기한을 확인해 주세요." },
  ],
};

// ============================================================
// MODULE 3 — Airport / Duty-free Korean
// ============================================================

const DUTY_FREE: KoLesson = {
  id: "ko_duty_free_allowance",
  titleKo: "면세 규정 기본",
  titleVi: "Quy định miễn thuế cơ bản",
  objectiveVi: "Giải thích cơ bản điều kiện & hạn mức mua hàng miễn thuế.",
  status: "ready",
  phrases: [
    { id: "ko_df_1", ko: "여기는 면세점이에요.", roman: "Yeogineun myeonsejeom-ieyo.", vi: "Đây là cửa hàng miễn thuế ạ.", vocab: [{ word: "면세점", roman: "myeonsejeom", vi: "cửa hàng miễn thuế" }], importantWords: ["면세점"] },
    { id: "ko_df_2", ko: "국제선 탑승권이 필요해요.", roman: "Gukjeseon tapseunggwon-i piryohaeyo.", vi: "Cần thẻ lên máy bay quốc tế ạ.", vocab: [{ word: "국제선", roman: "gukjeseon", vi: "chuyến quốc tế" }], importantWords: ["탑승권", "필요"] },
    { id: "ko_df_3", ko: "일부 상품은 수량 제한이 있어요.", roman: "Ilbu sangpum-eun suryang jehan-i isseoyo.", vi: "Một số sản phẩm có giới hạn số lượng ạ.", vocab: [{ word: "제한", roman: "jehan", vi: "giới hạn" }], importantWords: ["제한", "수량"] },
    { id: "ko_df_4", ko: "가격은 면세예요.", roman: "Gagyeog-eun myeonseyeyo.", vi: "Giá là giá miễn thuế ạ.", importantWords: ["면세"] },
    { id: "ko_df_5", ko: "규정을 확인해 드릴게요.", roman: "Gyujeong-eul hwaginhae deurilgeyo.", vi: "Để em kiểm tra quy định giúp ạ.", vocab: [{ word: "규정", roman: "gyujeong", vi: "quy định" }], importantWords: ["규정", "확인"] },
    { id: "ko_df_6", ko: "세관에 신고해야 할 수도 있어요.", roman: "Segwan-e singohaeya hal sudo isseoyo.", vi: "Quý khách có thể phải khai báo ở hải quan ạ.", vocab: [{ word: "세관", roman: "segwan", vi: "hải quan" }, { word: "신고", roman: "singo", vi: "khai báo" }], importantWords: ["세관", "신고"] },
    { id: "ko_df_7", ko: "탑승할 때까지 영수증을 보관하세요.", roman: "Tapseunghal ttaekkaji yeongsujeung-eul bogwanhaseyo.", vi: "Giữ hóa đơn đến khi lên máy bay ạ.", importantWords: ["영수증", "보관"] },
  ],
  dialogue: { titleVi: "Hỏi về miễn thuế", lines: [
    { speaker: "customer", ko: "정말 면세예요?", roman: "Jeongmal myeonseyeyo?", vi: "Miễn thuế thật à?" },
    { speaker: "staff", ko: "네, 여기는 면세점이에요. 가격은 면세예요.", roman: "Ne, yeogineun myeonsejeom-ieyo. Gagyeog-eun myeonseyeyo.", vi: "Vâng, đây là cửa hàng miễn thuế, giá miễn thuế ạ." },
    { speaker: "staff", ko: "국제선 탑승권이 필요해요.", roman: "Gukjeseon tapseunggwon-i piryohaeyo.", vi: "Cần thẻ lên máy bay quốc tế ạ." },
    { speaker: "customer", ko: "수량 제한이 있어요?", roman: "Suryang jehan-i isseoyo?", vi: "Có giới hạn số lượng không?" },
    { speaker: "staff", ko: "일부 상품은 제한이 있어요. 규정을 확인해 드릴게요.", roman: "Ilbu sangpum-eun jehan-i isseoyo. Gyujeong-eul hwaginhae deurilgeyo.", vi: "Một số mặt hàng có hạn mức. Để em kiểm tra ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: giải thích miễn thuế", customerGoalVi: "Khách hỏi có thật miễn thuế & có giới hạn không.", staffGoalVi: "Xác nhận miễn thuế, cần boarding pass quốc tế, nêu hạn mức + sẽ kiểm tra.", requiredPhraseIds: ["ko_df_1", "ko_df_2", "ko_df_3", "ko_df_5"] },
  quiz: [
    { id: "koq_df_1", promptVi: "Cần gì để mua miễn thuế?", options: ["국제선 탑승권이 필요해요.", "봉투 드릴까요?", "좋은 여행 되세요!"], correctAnswer: "국제선 탑승권이 필요해요." },
    { id: "koq_df_2", promptVi: "Nói một số sản phẩm có giới hạn?", options: ["일부 상품은 수량 제한이 있어요.", "이건 베스트셀러예요.", "천천히 둘러보세요."], correctAnswer: "일부 상품은 수량 제한이 있어요." },
    { id: "koq_df_3", promptVi: "Đề nghị giữ hóa đơn đến khi lên máy bay?", options: ["탑승할 때까지 영수증을 보관하세요.", "어떤 브랜드를 좋아하세요?", "안녕하세요!"], correctAnswer: "탑승할 때까지 영수증을 보관하세요." },
  ],
};

const BOARDING: KoLesson = {
  id: "ko_boarding_passport",
  titleKo: "탑승권 & 여권",
  titleVi: "Thẻ lên máy bay & hộ chiếu",
  objectiveVi: "Xin và kiểm tra hộ chiếu, thẻ lên máy bay khi bán hàng miễn thuế.",
  status: "ready",
  phrases: [
    { id: "ko_board_1", ko: "탑승권을 보여 주시겠어요?", roman: "Tapseunggwoneul boyeo jusigesseoyo?", vi: "Cho em xem thẻ lên máy bay ạ?", vocab: [{ word: "탑승권", roman: "tapseunggwon", vi: "thẻ lên máy bay" }], importantWords: ["탑승권"] },
    { id: "ko_board_2", ko: "여권도 보여 주시겠어요?", roman: "Yeogwondo boyeo jusigesseoyo?", vi: "Cho em xem hộ chiếu nữa ạ?", vocab: [{ word: "여권", roman: "yeogwon", vi: "hộ chiếu" }], importantWords: ["여권"] },
    { id: "ko_board_3", ko: "항공편 번호가 어떻게 되세요?", roman: "Hanggongpyeon beonhoga eotteoke doeseyo?", vi: "Số chuyến bay của quý khách là gì ạ?", vocab: [{ word: "항공편", roman: "hanggongpyeon", vi: "chuyến bay" }, { word: "번호", roman: "beonho", vi: "số" }], importantWords: ["항공편", "번호"] },
    { id: "ko_board_4", ko: "어디로 가세요?", roman: "Eodiro gaseyo?", vi: "Quý khách bay đi đâu ạ?", importantWords: ["어디"] },
    { id: "ko_board_5", ko: "탑승권을 스캔하겠습니다.", roman: "Tapseunggwoneul seukaenhagesseumnida.", vi: "Em sẽ quét thẻ lên máy bay ạ.", importantWords: ["탑승권", "스캔"] },
    { id: "ko_board_6", ko: "협조해 주셔서 감사합니다.", roman: "Hyeopjohae jusyeoseo gamsahamnida.", vi: "Cảm ơn quý khách đã hợp tác ạ.", importantWords: ["협조", "감사"] },
    { id: "ko_board_7", ko: "여권 여기 있습니다. 잘 보관하세요.", roman: "Yeogwon yeogi itseumnida. Jal bogwanhaseyo.", vi: "Đây là hộ chiếu, quý khách giữ cẩn thận ạ.", importantWords: ["여권", "보관"] },
  ],
  dialogue: { titleVi: "Kiểm tra giấy tờ", lines: [
    { speaker: "staff", ko: "탑승권을 보여 주시겠어요?", roman: "Tapseunggwoneul boyeo jusigesseoyo?", vi: "Cho em xem thẻ lên máy bay ạ?" },
    { speaker: "customer", ko: "여기요.", roman: "Yeogiyo.", vi: "Đây ạ." },
    { speaker: "staff", ko: "여권도 보여 주시겠어요? 어디로 가세요?", roman: "Yeogwondo boyeo jusigesseoyo? Eodiro gaseyo?", vi: "Cho em xem hộ chiếu nữa ạ? Quý khách đi đâu?" },
    { speaker: "customer", ko: "서울로 가요.", roman: "Seoullo gayo.", vi: "Đi Seoul." },
    { speaker: "staff", ko: "감사합니다. 여권 여기 있습니다. 잘 보관하세요.", roman: "Gamsahamnida. Yeogwon yeogi itseumnida. Jal bogwanhaseyo.", vi: "Cảm ơn ạ. Đây là hộ chiếu, quý khách giữ cẩn thận." },
  ] },
  roleplay: { titleVi: "Đóng vai: xin giấy tờ", customerGoalVi: "Khách mua hàng miễn thuế.", staffGoalVi: "Xin thẻ lên máy bay + hộ chiếu, hỏi điểm đến, trả lại giấy tờ.", requiredPhraseIds: ["ko_board_1", "ko_board_2", "ko_board_7"] },
  quiz: [
    { id: "koq_board_1", promptVi: "Xin thẻ lên máy bay?", options: ["탑승권을 보여 주시겠어요?", "봉투 드릴까요?", "지금 할인 중이에요."], correctAnswer: "탑승권을 보여 주시겠어요?" },
    { id: "koq_board_2", promptVi: "Hỏi số chuyến bay?", options: ["항공편 번호가 어떻게 되세요?", "예산이 어떻게 되세요?", "천천히 둘러보세요."], correctAnswer: "항공편 번호가 어떻게 되세요?" },
    { id: "koq_board_3", promptVi: "Trả hộ chiếu và dặn giữ cẩn thận?", options: ["여권 여기 있습니다. 잘 보관하세요.", "이건 베스트셀러예요.", "안녕하세요!"], correctAnswer: "여권 여기 있습니다. 잘 보관하세요." },
  ],
};

const GATE: KoLesson = {
  id: "ko_gate_flight_timing",
  titleKo: "탑승구 & 시간",
  titleVi: "Cửa khởi hành & giờ bay",
  objectiveVi: "Hỏi/đáp về cửa, giờ bay; nhắc khách kịp giờ.",
  status: "ready",
  phrases: [
    { id: "ko_gate_1", ko: "비행기 시간이 몇 시예요?", roman: "Bihaenggi sigani myeot siyeyo?", vi: "Chuyến bay của quý khách mấy giờ ạ?", vocab: [{ word: "비행기", roman: "bihaenggi", vi: "máy bay" }, { word: "시간", roman: "sigan", vi: "thời gian" }], importantWords: ["비행기", "시간"] },
    { id: "ko_gate_2", ko: "몇 번 게이트에서 출발하세요?", roman: "Myeot beon geiteueseo chulbalhaseyo?", vi: "Quý khách khởi hành ở cửa số mấy ạ?", vocab: [{ word: "게이트", roman: "geiteu", vi: "cửa khởi hành" }, { word: "출발", roman: "chulbal", vi: "khởi hành" }], importantWords: ["게이트", "출발"] },
    { id: "ko_gate_3", ko: "게이트는 가까워요.", roman: "Geiteuneun gakkawoyo.", vi: "Cửa ở gần thôi ạ.", importantWords: ["게이트", "가까"] },
    { id: "ko_gate_4", ko: "곧 탑승이 시작돼요. 늦지 마세요.", roman: "Got tapseungi sijakdwaeyo. Neutji maseyo.", vi: "Sắp tới giờ lên máy bay, quý khách đừng trễ ạ.", importantWords: ["탑승", "늦지"] },
    { id: "ko_gate_5", ko: "아직 시간이 충분해요.", roman: "Ajik sigani chungbunhaeyo.", vi: "Vẫn còn đủ thời gian ạ.", importantWords: ["시간", "충분"] },
    { id: "ko_gate_6", ko: "항공편 정보를 확인해 드릴게요.", roman: "Hanggongpyeon jeongboreul hwaginhae deurilgeyo.", vi: "Để em kiểm tra thông tin chuyến bay ạ.", vocab: [{ word: "정보", roman: "jeongbo", vi: "thông tin" }], importantWords: ["항공편", "정보"] },
    { id: "ko_gate_7", ko: "즐거운 여행 되세요!", roman: "Jeulgeoun yeohaeng doeseyo!", vi: "Chúc quý khách hành trình vui vẻ!", importantWords: ["여행"] },
  ],
  dialogue: { titleVi: "Hỏi giờ bay & cửa", lines: [
    { speaker: "customer", ko: "비행기를 놓칠까요?", roman: "Bihaenggireul nochilkkayo?", vi: "Tôi có bị trễ chuyến không?" },
    { speaker: "staff", ko: "비행기 시간이 몇 시예요? 몇 번 게이트에서 출발하세요?", roman: "Bihaenggi sigani myeot siyeyo? Myeot beon geiteueseo chulbalhaseyo?", vi: "Chuyến mấy giờ ạ? Cửa số mấy?" },
    { speaker: "customer", ko: "세 시, 12번 게이트요.", roman: "Se si, sibibeon geiteuyo.", vi: "Ba giờ, cửa số 12." },
    { speaker: "staff", ko: "아직 시간이 충분해요. 게이트는 가까워요.", roman: "Ajik sigani chungbunhaeyo. Geiteuneun gakkawoyo.", vi: "Quý khách còn đủ giờ, cửa ở gần thôi ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: trấn an khách lo trễ giờ", customerGoalVi: "Khách lo bị trễ chuyến.", staffGoalVi: "Hỏi giờ/cửa, trấn an còn đủ giờ, chỉ đường ngắn gọn.", requiredPhraseIds: ["ko_gate_1", "ko_gate_2", "ko_gate_5"] },
  quiz: [
    { id: "koq_gate_1", promptVi: "Hỏi giờ chuyến bay?", options: ["비행기 시간이 몇 시예요?", "영수증 여기 있습니다.", "어떤 브랜드를 좋아하세요?"], correctAnswer: "비행기 시간이 몇 시예요?" },
    { id: "koq_gate_2", promptVi: "Hỏi cửa khởi hành?", options: ["몇 번 게이트에서 출발하세요?", "한번 써 보시겠어요?", "천천히 둘러보세요."], correctAnswer: "몇 번 게이트에서 출발하세요?" },
    { id: "koq_gate_3", promptVi: "Trấn an khách còn đủ giờ?", options: ["아직 시간이 충분해요.", "신상품이에요.", "또 오세요."], correctAnswer: "아직 시간이 충분해요." },
  ],
};

const STOCK: KoLesson = {
  id: "ko_stock_alternative",
  titleKo: "품절 & 대체",
  titleVi: "Hết hàng & gợi ý thay thế",
  objectiveVi: "Báo hết hàng lịch sự và gợi ý sản phẩm thay thế.",
  status: "ready",
  phrases: [
    { id: "ko_stock_1", ko: "죄송합니다, 이건 품절이에요.", roman: "Joesonghamnida, igeon pumjeorieyo.", vi: "Xin lỗi, mẫu này đã hết hàng ạ.", vocab: [{ word: "품절", roman: "pumjeol", vi: "hết hàng" }], importantWords: ["죄송", "품절"] },
    { id: "ko_stock_2", ko: "지금은 다 팔렸어요.", roman: "Jigeumeun da pallyeosseoyo.", vi: "Hiện tại đã bán hết ạ.", importantWords: ["팔렸"] },
    { id: "ko_stock_3", ko: "비슷한 상품을 추천해 드릴까요?", roman: "Biseuthan sangpumeul chucheonhae deurilkkayo?", vi: "Em gợi ý sản phẩm tương tự được không ạ?", vocab: [{ word: "비슷하다", roman: "biseuthada", vi: "tương tự" }], importantWords: ["비슷", "추천"] },
    { id: "ko_stock_4", ko: "이건 아주 비슷해요.", roman: "Igeon aju biseuthaeyo.", vi: "Mẫu này rất giống ạ.", importantWords: ["비슷"] },
    { id: "ko_stock_5", ko: "같은 브랜드예요.", roman: "Gateun beuraendeuyeyo.", vi: "Cùng một thương hiệu ạ.", importantWords: ["같은", "브랜드"] },
    { id: "ko_stock_6", ko: "한번 보시겠어요?", roman: "Hanbeon bosigesseoyo?", vi: "Quý khách xem thử không ạ?", importantWords: ["보시"] },
    { id: "ko_stock_7", ko: "재고를 확인해 드릴게요.", roman: "Jaegoreul hwaginhae deurilgeyo.", vi: "Để em kiểm tra hàng giúp quý khách ạ.", vocab: [{ word: "재고", roman: "jaego", vi: "hàng tồn kho" }], importantWords: ["재고", "확인"] },
  ],
  dialogue: { titleVi: "Hết hàng & thay thế", lines: [
    { speaker: "customer", ko: "이거 있어요?", roman: "Igeo isseoyo?", vi: "Có loại này không?" },
    { speaker: "staff", ko: "죄송합니다, 이건 품절이에요.", roman: "Joesonghamnida, igeon pumjeorieyo.", vi: "Xin lỗi, mẫu này hết hàng ạ." },
    { speaker: "staff", ko: "비슷한 상품을 추천해 드릴까요? 이건 아주 비슷해요. 같은 브랜드예요.", roman: "Biseuthan sangpumeul chucheonhae deurilkkayo? Igeon aju biseuthaeyo. Gateun beuraendeuyeyo.", vi: "Em gợi ý mẫu tương tự nhé? Mẫu này rất giống, cùng hãng ạ." },
    { speaker: "customer", ko: "네, 보여 주세요.", roman: "Ne, boyeo juseyo.", vi: "Được, cho tôi xem." },
  ] },
  roleplay: { titleVi: "Đóng vai: hết hàng, gợi ý thay thế", customerGoalVi: "Khách hỏi mẫu đã hết.", staffGoalVi: "Xin lỗi báo hết, gợi ý mẫu tương tự cùng hãng, mời xem.", requiredPhraseIds: ["ko_stock_1", "ko_stock_3", "ko_stock_6"] },
  quiz: [
    { id: "koq_stock_1", promptVi: "Báo hết hàng lịch sự?", options: ["죄송합니다, 이건 품절이에요.", "원 플러스 원 행사예요.", "안전한 비행 되세요!"], correctAnswer: "죄송합니다, 이건 품절이에요." },
    { id: "koq_stock_2", promptVi: "Gợi ý sản phẩm tương tự?", options: ["비슷한 상품을 추천해 드릴까요?", "어떻게 결제하시겠어요?", "누구에게 줄 선물이세요?"], correctAnswer: "비슷한 상품을 추천해 드릴까요?" },
    { id: "koq_stock_3", promptVi: "Nói cùng một thương hiệu?", options: ["같은 브랜드예요.", "면세 가격이에요.", "천천히 둘러보세요."], correctAnswer: "같은 브랜드예요." },
  ],
};

const REFUND: KoLesson = {
  id: "ko_refund_escalation",
  titleKo: "환불 & 결제 문제",
  titleVi: "Hoàn tiền & sự cố thanh toán",
  objectiveVi: "Xử lý lịch sự sự cố thanh toán/đổi trả; biết khi nào gọi quản lý.",
  status: "ready",
  phrases: [
    { id: "ko_refund_1", ko: "불편을 드려 죄송합니다.", roman: "Bulpyeoneul deuryeo joesonghamnida.", vi: "Em xin lỗi vì sự bất tiện ạ.", vocab: [{ word: "불편", roman: "bulpyeon", vi: "sự bất tiện" }], importantWords: ["불편", "죄송"] },
    { id: "ko_refund_2", ko: "카드가 승인되지 않았어요.", roman: "Kadeuga seungindoeji anasseoyo.", vi: "Thẻ của quý khách không được chấp nhận ạ.", vocab: [{ word: "승인", roman: "seungin", vi: "phê duyệt, chấp nhận" }], importantWords: ["카드", "승인"] },
    { id: "ko_refund_3", ko: "다른 카드로 해 보시겠어요?", roman: "Dareun kadeuro hae bosigesseoyo?", vi: "Quý khách thử thẻ khác được không ạ?", importantWords: ["다른", "카드"] },
    { id: "ko_refund_4", ko: "QR로 결제하시겠어요?", roman: "QR-ro gyeoljehasigesseoyo?", vi: "Quý khách quét QR thay thế nhé ạ?", importantWords: ["결제"] },
    { id: "ko_refund_5", ko: "영수증을 가지고 계세요?", roman: "Yeongsujeungeul gajigo gyeseyo?", vi: "Quý khách có giữ hóa đơn không ạ?", importantWords: ["영수증"] },
    { id: "ko_refund_6", ko: "환불은 매장 규정을 따라요.", roman: "Hwanbureun maejang gyujeongeul ttarayo.", vi: "Việc hoàn tiền theo quy định cửa hàng ạ.", vocab: [{ word: "환불", roman: "hwanbul", vi: "hoàn tiền" }, { word: "규정", roman: "gyujeong", vi: "quy định" }], importantWords: ["환불", "규정"] },
    { id: "ko_refund_7", ko: "매니저를 불러 드릴게요.", roman: "Maenijeoreul bulleo deurilgeyo.", vi: "Để em gọi quản lý hỗ trợ ạ.", usageVi: "Khi vượt thẩm quyền, hãy mời quản lý.", importantWords: ["매니저", "불러"] },
    { id: "ko_refund_8", ko: "잠시만 기다려 주세요.", roman: "Jamsiman gidaryeo juseyo.", vi: "Quý khách vui lòng đợi một lát ạ.", importantWords: ["잠시", "기다려"] },
  ],
  dialogue: { titleVi: "Sự cố thanh toán", lines: [
    { speaker: "staff", ko: "죄송합니다, 카드가 승인되지 않았어요.", roman: "Joesonghamnida, kadeuga seungindoeji anasseoyo.", vi: "Xin lỗi, thẻ của quý khách không được chấp nhận ạ." },
    { speaker: "staff", ko: "다른 카드로 해 보시겠어요? 아니면 QR로 결제하시겠어요?", roman: "Dareun kadeuro hae bosigesseoyo? Animyeon QR-ro gyeoljehasigesseoyo?", vi: "Quý khách thử thẻ khác, hoặc quét QR nhé?" },
    { speaker: "customer", ko: "여전히 안 돼요.", roman: "Yeojeonhi an dwaeyo.", vi: "Vẫn không được." },
    { speaker: "staff", ko: "불편을 드려 죄송합니다. 매니저를 불러 드릴게요. 잠시만 기다려 주세요.", roman: "Bulpyeoneul deuryeo joesonghamnida. Maenijeoreul bulleo deurilgeyo. Jamsiman gidaryeo juseyo.", vi: "Em xin lỗi vì bất tiện. Để em gọi quản lý hỗ trợ, quý khách đợi một lát ạ." },
  ] },
  roleplay: { titleVi: "Đóng vai: thẻ bị từ chối", customerGoalVi: "Thẻ của khách bị từ chối.", staffGoalVi: "Xin lỗi, đề nghị thẻ khác/QR; nếu không được thì mời quản lý.", requiredPhraseIds: ["ko_refund_2", "ko_refund_3", "ko_refund_7"] },
  quiz: [
    { id: "koq_refund_1", promptVi: "Báo thẻ không được chấp nhận?", options: ["카드가 승인되지 않았어요.", "영수증 여기 있습니다.", "좋은 여행 되세요!"], correctAnswer: "카드가 승인되지 않았어요." },
    { id: "koq_refund_2", promptVi: "Đề nghị thanh toán bằng QR thay thế?", options: ["QR로 결제하시겠어요?", "어떤 브랜드를 좋아하세요?", "천천히 둘러보세요."], correctAnswer: "QR로 결제하시겠어요?" },
    { id: "koq_refund_3", promptVi: "Khi vượt thẩm quyền, nên nói gì?", options: ["매니저를 불러 드릴게요.", "신상품이에요.", "또 오세요."], correctAnswer: "매니저를 불러 드릴게요." },
  ],
};

// ============================================================
// MODULE 0 — Foundations (learn FIRST, before sales). Phase 2E.
// ============================================================

const KF1: KoLesson = {
  id: "ko_basics_greetings",
  titleKo: "인사 & 예절",
  titleVi: "Chào hỏi & lịch sự",
  objectiveVi: "Chào hỏi và dùng từ lịch sự cơ bản với khách Hàn.",
  status: "ready",
  phrases: [
    { id: "ko_bg_1", ko: "안녕하세요.", roman: "Annyeonghaseyo.", vi: "Xin chào ạ.", pronTips: ["đọc 'an-nyong-ha-sê-yô'."], importantWords: ["안녕하세요"] },
    { id: "ko_bg_2", ko: "어서 오세요.", roman: "Eoseo oseyo.", vi: "Mời quý khách vào ạ.", importantWords: ["어서", "오세요"] },
    { id: "ko_bg_3", ko: "감사합니다.", roman: "Gamsahamnida.", vi: "Cảm ơn ạ.", importantWords: ["감사합니다"] },
    { id: "ko_bg_4", ko: "천만에요.", roman: "Cheonmaneyo.", vi: "Không có gì ạ.", importantWords: ["천만에요"] },
    { id: "ko_bg_5", ko: "죄송합니다.", roman: "Joesonghamnida.", vi: "Em xin lỗi ạ.", importantWords: ["죄송합니다"] },
    { id: "ko_bg_6", ko: "잠시만요.", roman: "Jamsimanyo.", vi: "Quý khách chờ một lát ạ.", importantWords: ["잠시만요"] },
    { id: "ko_bg_7", ko: "안녕히 가세요.", roman: "Annyeonghi gaseyo.", vi: "Quý khách đi ạ (tạm biệt).", importantWords: ["안녕히", "가세요"] },
  ],
  quiz: [
    { id: "koq_bg_1", promptVi: "Cảm ơn khách?", options: ["감사합니다.", "얼마예요?", "왼쪽으로 가세요."], correctAnswer: "감사합니다." },
    { id: "koq_bg_2", promptVi: "Chào đón khách vào cửa hàng?", options: ["어서 오세요.", "천만에요.", "지금 몇 시예요?"], correctAnswer: "어서 오세요." },
    { id: "koq_bg_3", promptVi: "Tạm biệt khách (người đi)?", options: ["안녕히 가세요.", "죄송합니다.", "다른 색도 있어요."], correctAnswer: "안녕히 가세요." },
  ],
};

const KF2: KoLesson = {
  id: "ko_basics_pronouns",
  titleKo: "대명사 & 사람",
  titleVi: "Đại từ & người",
  objectiveVi: "Dùng đại từ cơ bản (tôi-khiêm nhường, quý khách, cái này/kia...).",
  status: "ready",
  phrases: [
    { id: "ko_bp_1", ko: "제가 도와드릴게요.", roman: "Jega dowadeurilgeyo.", vi: "Để em giúp ạ.", vocab: [{ word: "저/제가", roman: "jeo/jega", vi: "tôi (khiêm nhường)" }], importantWords: ["제가", "도와"] },
    { id: "ko_bp_2", ko: "손님, 이쪽이에요.", roman: "Sonnim, ijjogieyo.", vi: "Quý khách, lối này ạ.", vocab: [{ word: "손님", roman: "sonnim", vi: "quý khách" }], importantWords: ["손님", "이쪽"] },
    { id: "ko_bp_3", ko: "이것은 선물이에요.", roman: "Igeoseun seonmurieyo.", vi: "Cái này là quà ạ.", importantWords: ["이것", "선물"] },
    { id: "ko_bp_4", ko: "저것도 보여 드릴까요?", roman: "Jeogeotdo boyeo deurilkkayo?", vi: "Đưa cái kia xem nữa nhé ạ?", importantWords: ["저것", "보여"] },
    { id: "ko_bp_5", ko: "우리 매장이에요.", roman: "Uri maejang-ieyo.", vi: "Cửa hàng của chúng tôi ạ.", importantWords: ["우리", "매장"] },
    { id: "ko_bp_6", ko: "이거예요, 저거예요?", roman: "Igeoyeyo, jeogeoyeyo?", vi: "Cái này hay cái kia ạ?", importantWords: ["이거", "저거"] },
    { id: "ko_bp_7", ko: "누구 선물이에요?", roman: "Nugu seonmurieyo?", vi: "Quà cho ai ạ?", importantWords: ["누구", "선물"] },
  ],
  quiz: [
    { id: "koq_bp_1", promptVi: "Mời giúp khách ('em/tôi giúp')?", options: ["제가 도와드릴게요.", "얼마예요?", "쭉 가세요."], correctAnswer: "제가 도와드릴게요." },
    { id: "koq_bp_2", promptVi: "Hỏi cái này hay cái kia?", options: ["이거예요, 저거예요?", "감사합니다.", "오늘, 내일"], correctAnswer: "이거예요, 저거예요?" },
    { id: "koq_bp_3", promptVi: "Gọi 'quý khách'?", options: ["손님", "누구", "우리"], correctAnswer: "손님" },
  ],
};

const KF3: KoLesson = {
  id: "ko_basics_numbers",
  titleKo: "숫자 & 가격",
  titleVi: "Số đếm & giá tiền",
  objectiveVi: "Đếm số (Hán-Hàn) và hỏi/nói giá, số lượng.",
  status: "ready",
  phrases: [
    { id: "ko_bn_1", ko: "일, 이, 삼.", roman: "Il, i, sam.", vi: "Một, hai, ba (số Hán-Hàn).", usageVi: "Số Hán-Hàn dùng cho giá tiền, số đếm.", importantWords: ["일", "이", "삼"] },
    { id: "ko_bn_2", ko: "십, 백, 천.", roman: "Sip, baek, cheon.", vi: "Mười, trăm, nghìn.", importantWords: ["십", "백", "천"] },
    { id: "ko_bn_3", ko: "얼마예요?", roman: "Eolmayeyo?", vi: "Bao nhiêu tiền ạ?", importantWords: ["얼마"] },
    { id: "ko_bn_4", ko: "만 원이에요.", roman: "Man wonieyo.", vi: "Mười nghìn won ạ.", vocab: [{ word: "원", roman: "won", vi: "won (tiền Hàn)" }], importantWords: ["만", "원"] },
    { id: "ko_bn_5", ko: "몇 개 드릴까요?", roman: "Myeot gae deurilkkayo?", vi: "Lấy mấy cái ạ?", importantWords: ["몇", "개"] },
    { id: "ko_bn_6", ko: "십 퍼센트 할인이에요.", roman: "Sip peosenteu harinieyo.", vi: "Giảm mười phần trăm ạ.", importantWords: ["퍼센트", "할인"] },
    { id: "ko_bn_7", ko: "원 플러스 원이에요.", roman: "Won peulleoseu wonieyo.", vi: "Mua một tặng một ạ.", importantWords: ["원", "플러스"] },
  ],
  quiz: [
    { id: "koq_bn_1", promptVi: "Hỏi giá?", options: ["얼마예요?", "안녕하세요.", "오른쪽으로 가세요."], correctAnswer: "얼마예요?" },
    { id: "koq_bn_2", promptVi: "Hỏi khách lấy mấy cái?", options: ["몇 개 드릴까요?", "감사합니다.", "이 색 어떠세요?"], correctAnswer: "몇 개 드릴까요?" },
    { id: "koq_bn_3", promptVi: "Báo mua một tặng một?", options: ["원 플러스 원이에요.", "만 원이에요.", "잠시만요."], correctAnswer: "원 플러스 원이에요." },
  ],
};

const KF4: KoLesson = {
  id: "ko_basics_colors",
  titleKo: "색깔 & 묘사",
  titleVi: "Màu sắc & mô tả",
  objectiveVi: "Gọi tên màu sắc và mô tả sản phẩm cơ bản.",
  status: "ready",
  phrases: [
    { id: "ko_bc_1", ko: "빨간색, 파란색, 검은색.", roman: "Ppalgansaek, paransaek, geomeunsaek.", vi: "Đỏ, xanh dương, đen.", importantWords: ["빨간색", "파란색", "검은색"] },
    { id: "ko_bc_2", ko: "흰색, 금색, 은색.", roman: "Huinsaek, geumsaek, eunsaek.", vi: "Trắng, vàng kim, bạc.", importantWords: ["흰색", "금색", "은색"] },
    { id: "ko_bc_3", ko: "이 색 어떠세요?", roman: "I saek eotteoseyo?", vi: "Quý khách thấy màu này thế nào ạ?", importantWords: ["색", "어떠"] },
    { id: "ko_bc_4", ko: "다른 색도 있어요.", roman: "Dareun saekdo isseoyo.", vi: "Có màu khác nữa ạ.", importantWords: ["다른", "색"] },
    { id: "ko_bc_5", ko: "큰 거, 작은 거?", roman: "Keun geo, jageun geo?", vi: "To hay nhỏ ạ?", importantWords: ["큰", "작은"] },
    { id: "ko_bc_6", ko: "이게 인기가 많아요.", roman: "Ige ingiga manayo.", vi: "Cái này được ưa chuộng ạ.", importantWords: ["인기"] },
    { id: "ko_bc_7", ko: "품질이 좋아요.", roman: "Pumjiri joayo.", vi: "Chất lượng tốt ạ.", importantWords: ["품질", "좋아"] },
  ],
  quiz: [
    { id: "koq_bc_1", promptVi: "Hỏi khách thấy màu này thế nào?", options: ["이 색 어떠세요?", "얼마예요?", "안녕히 가세요."], correctAnswer: "이 색 어떠세요?" },
    { id: "koq_bc_2", promptVi: "Nói có màu khác?", options: ["다른 색도 있어요.", "원 플러스 원이에요.", "잠시만요."], correctAnswer: "다른 색도 있어요." },
    { id: "koq_bc_3", promptVi: "Nói chất lượng tốt?", options: ["품질이 좋아요.", "큰 거, 작은 거?", "누구 선물이에요?"], correctAnswer: "품질이 좋아요." },
  ],
};

const KF5: KoLesson = {
  id: "ko_basics_time",
  titleKo: "날짜 & 시간",
  titleVi: "Ngày giờ & thời gian",
  objectiveVi: "Hỏi/nói giờ giấc, giờ mở cửa và giờ bay.",
  status: "ready",
  phrases: [
    { id: "ko_bt_1", ko: "지금 몇 시예요?", roman: "Jigeum myeot siyeyo?", vi: "Bây giờ mấy giờ ạ?", importantWords: ["몇", "시"] },
    { id: "ko_bt_2", ko: "오늘, 내일.", roman: "Oneul, naeil.", vi: "Hôm nay, ngày mai.", importantWords: ["오늘", "내일"] },
    { id: "ko_bt_3", ko: "아홉 시에 열어요.", roman: "Ahop sie yeoreoyo.", vi: "Mở cửa lúc 9 giờ ạ.", importantWords: ["아홉", "열어"] },
    { id: "ko_bt_4", ko: "열 시에 닫아요.", roman: "Yeol sie dadayo.", vi: "Đóng cửa lúc 10 giờ ạ.", importantWords: ["열", "닫아"] },
    { id: "ko_bt_5", ko: "비행기가 세 시예요.", roman: "Bihaenggiga se siyeyo.", vi: "Chuyến bay lúc 3 giờ ạ.", importantWords: ["비행기", "세"] },
    { id: "ko_bt_6", ko: "시간이 충분해요.", roman: "Sigani chungbunhaeyo.", vi: "Còn đủ thời gian ạ.", importantWords: ["시간", "충분"] },
    { id: "ko_bt_7", ko: "조금 서둘러 주세요.", roman: "Jogeum seodulleo juseyo.", vi: "Quý khách nhanh lên chút ạ.", importantWords: ["서둘러"] },
  ],
  quiz: [
    { id: "koq_bt_1", promptVi: "Hỏi mấy giờ?", options: ["지금 몇 시예요?", "얼마예요?", "어서 오세요."], correctAnswer: "지금 몇 시예요?" },
    { id: "koq_bt_2", promptVi: "Trấn an khách còn đủ giờ?", options: ["시간이 충분해요.", "열 시에 닫아요.", "감사합니다."], correctAnswer: "시간이 충분해요." },
    { id: "koq_bt_3", promptVi: "Báo chuyến bay lúc 3 giờ?", options: ["비행기가 세 시예요.", "아홉 시에 열어요.", "품질이 좋아요."], correctAnswer: "비행기가 세 시예요." },
  ],
};

const KF6: KoLesson = {
  id: "ko_basics_directions",
  titleKo: "길 안내 & 위치",
  titleVi: "Hỏi đường & vị trí",
  objectiveVi: "Chỉ đường và nói vị trí cơ bản trong sân bay.",
  status: "ready",
  phrases: [
    { id: "ko_bd_1", ko: "저쪽에 있어요.", roman: "Jeojjoge isseoyo.", vi: "Ở đằng kia ạ.", importantWords: ["저쪽"] },
    { id: "ko_bd_2", ko: "쭉 가세요.", roman: "Jjuk gaseyo.", vi: "Đi thẳng ạ.", importantWords: ["쭉", "가세요"] },
    { id: "ko_bd_3", ko: "왼쪽으로 가세요.", roman: "Oenjjogeuro gaseyo.", vi: "Rẽ trái ạ.", replaceable: [{ slotVi: "hướng", alts: [{ ko: "오른쪽", vi: "phải" }] }], importantWords: ["왼쪽", "가세요"] },
    { id: "ko_bd_4", ko: "게이트는 이쪽이에요.", roman: "Geiteuneun ijjogieyo.", vi: "Cổng đi lối này ạ.", importantWords: ["게이트", "이쪽"] },
    { id: "ko_bd_5", ko: "화장실은 왼쪽에 있어요.", roman: "Hwajangsireun oenjjoge isseoyo.", vi: "Nhà vệ sinh ở bên trái ạ.", vocab: [{ word: "화장실", roman: "hwajangsil", vi: "nhà vệ sinh" }], importantWords: ["화장실", "왼쪽"] },
    { id: "ko_bd_6", ko: "5번 게이트 근처예요.", roman: "O-beon geiteu geuncheoyeyo.", vi: "Gần cổng số 5 ạ.", importantWords: ["게이트", "근처"] },
    { id: "ko_bd_7", ko: "안내판을 따라가세요.", roman: "Annaepaneul ttaragaseyo.", vi: "Quý khách đi theo bảng chỉ dẫn ạ.", importantWords: ["안내판", "따라"] },
  ],
  quiz: [
    { id: "koq_bd_1", promptVi: "Chỉ 'đi thẳng'?", options: ["쭉 가세요.", "얼마예요?", "감사합니다."], correctAnswer: "쭉 가세요." },
    { id: "koq_bd_2", promptVi: "Nói cổng đi lối này?", options: ["게이트는 이쪽이에요.", "아홉 시에 열어요.", "큰 거, 작은 거?"], correctAnswer: "게이트는 이쪽이에요." },
    { id: "koq_bd_3", promptVi: "Bảo khách đi theo bảng chỉ dẫn?", options: ["안내판을 따라가세요.", "다른 색도 있어요.", "누구 선물이에요?"], correctAnswer: "안내판을 따라가세요." },
  ],
};

export const KOREAN_COURSE: KoreanCourse = {
  id: "korean-sales",
  titleKo: "VDF 판매 한국어",
  titleVi: "Tiếng Hàn bán hàng VDF",
  descriptionVi:
    "Khoá tiếng Hàn thực dụng cho nhân viên bán hàng miễn thuế VDF phục vụ khách Hàn Quốc: học nền tảng trước (chào hỏi, đại từ, số đếm, màu sắc, giờ giấc, chỉ đường), rồi tới chào hỏi bán hàng, tư vấn, giá/khuyến mãi, thanh toán, miễn thuế (có chữ Hàn + phiên âm).",
  modules: [
    {
      id: "ko_m0_foundations",
      titleKo: "기초 한국어",
      titleVi: "Nền tảng",
      objectiveVi: "Nắm vững nền tảng (chào hỏi, đại từ, số đếm, màu sắc, giờ giấc, chỉ đường) trước khi học bán hàng.",
      lessons: [KF1, KF2, KF3, KF4, KF5, KF6],
    },
    {
      id: "ko_m1_counter_survival",
      titleKo: "기본 응대 한국어",
      titleVi: "Tiếng Hàn sống còn tại quầy",
      objectiveVi: "Xử lý được một giao dịch cơ bản tại quầy bằng tiếng Hàn.",
      lessons: [L1, L2, L3, L4, L5, L6],
    },
    {
      id: "ko_m2_product_sales",
      titleKo: "상품별 한국어",
      titleVi: "Tiếng Hàn theo ngành hàng",
      objectiveVi: "Tư vấn theo từng nhóm sản phẩm.",
      lessons: [PERFUME, COSMETICS, WINE, TOBACCO, CONFECTIONERY],
    },
    {
      id: "ko_m3_airport_duty_free",
      titleKo: "공항 / 면세 한국어",
      titleVi: "Tiếng Hàn sân bay / miễn thuế",
      objectiveVi: "Xử lý ngữ cảnh sân bay & miễn thuế.",
      lessons: [BOARDING, DUTY_FREE, GATE, STOCK, REFUND],
    },
  ],
};

// ---------- helpers ----------

export function getAllKoreanLessons(): KoLesson[] {
  return KOREAN_COURSE.modules.flatMap((m) => m.lessons);
}
export function getKoreanLesson(id: string): KoLesson | undefined {
  return getAllKoreanLessons().find((l) => l.id === id);
}
export function allKoreanPhraseIds(): string[] {
  return getAllKoreanLessons().flatMap((l) => l.phrases.map((p) => p.id));
}
