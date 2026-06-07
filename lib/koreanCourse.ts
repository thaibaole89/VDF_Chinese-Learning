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

function koScaffold(id: string, titleKo: string, titleVi: string, objectiveVi: string): KoLesson {
  return { id, titleKo, titleVi, objectiveVi, status: "coming", phrases: [] };
}

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

export const KOREAN_COURSE: KoreanCourse = {
  id: "korean-sales",
  titleKo: "VDF 판매 한국어",
  titleVi: "Tiếng Hàn bán hàng VDF",
  descriptionVi:
    "Khoá tiếng Hàn thực dụng cho nhân viên bán hàng miễn thuế VDF phục vụ khách Hàn Quốc: chào hỏi, hỏi nhu cầu, tư vấn, giá/khuyến mãi, thanh toán, miễn thuế (có chữ Hàn + phiên âm).",
  modules: [
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
      lessons: [
        PERFUME,
        koScaffold("ko_cosmetics_sales", "화장품 판매", "Bán mỹ phẩm", "Tư vấn mỹ phẩm: loại da, công dụng."),
        koScaffold("ko_wine_spirits_sales", "주류 판매", "Bán rượu", "Tư vấn rượu vang & rượu mạnh."),
        koScaffold("ko_tobacco_sales", "담배 판매", "Bán thuốc lá", "Tư vấn thuốc lá (theo quy định)."),
        koScaffold("ko_confectionery_sales", "과자 & 선물", "Bánh kẹo & quà", "Tư vấn bánh kẹo, quà tặng."),
      ],
    },
    {
      id: "ko_m3_airport_duty_free",
      titleKo: "공항 / 면세 한국어",
      titleVi: "Tiếng Hàn sân bay / miễn thuế",
      objectiveVi: "Xử lý ngữ cảnh sân bay & miễn thuế.",
      lessons: [
        koScaffold("ko_boarding_passport", "탑승권 & 여권", "Thẻ lên máy bay & hộ chiếu", "Ngôn ngữ về giấy tờ."),
        DUTY_FREE,
        koScaffold("ko_gate_flight_timing", "탑승구 & 시간", "Cửa & giờ bay", "Hỏi/đáp về cửa và giờ bay."),
        koScaffold("ko_stock_alternative", "품절 & 대체", "Hết hàng & thay thế", "Báo hết hàng, gợi ý thay thế."),
        koScaffold("ko_refund_escalation", "환불 & 결제 문제", "Hoàn tiền & sự cố thanh toán", "Xử lý/escalate sự cố thanh toán."),
      ],
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
