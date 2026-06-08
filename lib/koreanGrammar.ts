// Korean grammar / sentence-building tips, keyed by Korean lesson id.
// Phase 2C.1.6. Focuses on the particles + polite endings that let learners
// build their own sentences. Needs native review (same as the Korean course).

import type { GrammarTip } from "@/lib/grammar";

export const KOREAN_GRAMMAR: Record<string, GrammarTip[]> = {
  ko_greeting_help: [
    {
      titleVi: "Đuôi lịch sự -(으)세요 (mời/đề nghị)",
      pattern: "[gốc động từ] + -(으)세요",
      bodyVi:
        "Thêm -세요 (gốc kết thúc nguyên âm) hoặc -으세요 (gốc kết thúc phụ âm) để mời/đề nghị lịch sự. Đây là đuôi câu hay dùng nhất khi phục vụ khách.",
      examples: [
        { text: "천천히 둘러보세요.", gloss: "cheoncheonhi dulleoboseyo", vi: "Anh/chị cứ thong thả xem ạ." },
        { text: "또 오세요.", gloss: "tto oseyo", vi: "Lại đến nữa nhé ạ." },
      ],
    },
    {
      titleVi: "Chào theo ngữ cảnh: 가세요 / 계세요",
      bodyVi:
        "안녕하세요 = xin chào. Khi tiễn: nói 안녕히 가세요 (chúc người ĐI), còn người ở lại nói 안녕히 계세요.",
      examples: [{ text: "안녕히 가세요.", gloss: "annyeonghi gaseyo", vi: "Anh/chị đi ạ (tạm biệt)." }],
    },
  ],
  ko_asking_needs: [
    {
      titleVi: "Trợ từ tân ngữ 을/를",
      pattern: "[danh từ] + 을/를 + [động từ]",
      bodyVi:
        "Tân ngữ + 을 (khi có phụ âm cuối) / 를 (khi kết thúc nguyên âm) rồi mới đến động từ. Trật tự Hàn là: Chủ ngữ – Tân ngữ – Động từ.",
      examples: [
        { text: "무엇을 찾으세요?", gloss: "mueoseul chajeuseyo", vi: "Anh/chị tìm gì ạ?" },
        { text: "향수를 찾으세요?", gloss: "hyangsureul chajeuseyo", vi: "Anh/chị tìm nước hoa ạ?" },
      ],
    },
    {
      titleVi: "Hỏi lựa chọn A …, B …?",
      pattern: "[A](이)세요, [B](이)세요?",
      bodyVi: "Đưa hai lựa chọn bằng hai vế cùng đuôi (이)세요.",
      examples: [{ text: "본인용이세요, 선물용이세요?", gloss: "bonin-yong-iseyo, seonmul-yong-iseyo", vi: "Anh/chị dùng hay làm quà ạ?" }],
    },
  ],
  ko_recommendation: [
    {
      titleVi: "Mời thử: -아/어 보시겠어요?",
      pattern: "[động từ] + -아/어 보시겠어요?",
      bodyVi: "“보다 (thử)” + đuôi lịch sự -시겠어요? = mời khách thử làm gì.",
      examples: [{ text: "한번 써 보시겠어요?", gloss: "hanbeon sseo bosigesseoyo", vi: "Anh/chị thử một lần nhé ạ?" }],
    },
    {
      titleVi: "Khiêm nhường 드리다 (= 주다)",
      pattern: "[động từ]해 + 드릴게요",
      bodyVi: "Khi mình làm gì cho khách, dùng 드리다 thay 주다 để khiêm nhường, lịch sự hơn.",
      examples: [{ text: "추천해 드릴게요.", gloss: "chucheonhae deurilgeyo", vi: "Em xin giới thiệu ạ." }],
    },
  ],
  ko_price_promotion: [
    {
      titleVi: "“là …”: 이에요 / 예요",
      pattern: "[danh từ] + 이에요/예요",
      bodyVi: "Để nói “là …”: dùng 이에요 (có phụ âm cuối) / 예요 (kết thúc nguyên âm).",
      examples: [{ text: "면세 가격이에요.", gloss: "myeonse gagyeog-ieyo", vi: "Là giá miễn thuế ạ." }],
    },
    {
      titleVi: "So sánh hơn: …보다",
      pattern: "[danh từ] + 보다 + [tính từ]",
      bodyVi: "“보다” = hơn (so với). Đặt sau cái được đem ra so sánh.",
      examples: [{ text: "시내보다 저렴해요.", gloss: "sinaeboda jeoryeomhaeyo", vi: "Rẻ hơn trong phố ạ." }],
    },
  ],
  ko_payment_receipt: [
    {
      titleVi: "Phương tiện/cách thức: (으)로",
      pattern: "[danh từ] + (으)로",
      bodyVi: "“(으)로” chỉ phương tiện/cách thức: 카드로 = bằng thẻ, QR로 = bằng QR.",
      examples: [{ text: "카드로 하시겠어요?", gloss: "kadeuro hasigesseoyo", vi: "Anh/chị thanh toán bằng thẻ ạ?" }],
    },
    {
      titleVi: "Nhờ lịch sự: -아/어 주시겠어요?",
      pattern: "[động từ] + -아/어 주시겠어요?",
      bodyVi: "Nhờ khách làm gì một cách rất lịch sự (xin xem giấy tờ, cắm thẻ…).",
      examples: [{ text: "여권을 보여 주시겠어요?", gloss: "yeogwoneul boyeo jusigesseoyo", vi: "Cho em xem hộ chiếu ạ?" }],
    },
  ],
  ko_polite_closing: [
    {
      titleVi: "Lời chúc: … 되세요",
      pattern: "[좋은/안전한 + danh từ] + 되세요",
      bodyVi: "Khung chúc rất tiện. Đổi tính từ + danh từ để chúc nhiều kiểu.",
      examples: [
        { text: "좋은 여행 되세요!", gloss: "joeun yeohaeng doeseyo", vi: "Chúc chuyến đi vui vẻ!" },
        { text: "안전한 비행 되세요!", gloss: "anjeonhan bihaeng doeseyo", vi: "Chúc bay an toàn!" },
      ],
    },
    {
      titleVi: "Cảm ơn vì…: -아/어 주셔서 감사합니다",
      pattern: "[động từ]해 주셔서 감사합니다",
      bodyVi: "Cấu trúc cảm ơn vì khách đã làm gì đó.",
      examples: [{ text: "이용해 주셔서 감사합니다.", gloss: "iyonghae jusyeoseo gamsahamnida", vi: "Cảm ơn anh/chị đã mua sắm ạ." }],
    },
  ],
  ko_perfume_sales: [
    {
      titleVi: "Hậu tố 용 (dành cho…)",
      pattern: "[danh từ] + 용",
      bodyVi: "Thêm 용 để nói “dành cho…”: 남성용 = cho nam, 여성용 = cho nữ, 선물용 = để làm quà.",
      examples: [{ text: "남성용 향수, 여성용 향수", gloss: "namseong-yong, yeoseong-yong", vi: "nước hoa nam, nước hoa nữ" }],
    },
    {
      titleVi: "Nối tính từ bằng -고",
      pattern: "[tính từ]-고 + [tính từ]",
      bodyVi: "“-고” nối hai vế (và). Dùng để tả nhiều đặc điểm cùng lúc.",
      examples: [{ text: "상큼하고 가벼워요.", gloss: "sangkeumhago gabyeowoyo", vi: "Tươi mát và nhẹ ạ." }],
    },
  ],
  ko_cosmetics_sales: [
    {
      titleVi: "Tốt cho…: …에 좋아요",
      pattern: "[danh từ] + 에 좋아요",
      bodyVi: "“에” chỉ đối tượng; “좋아요” = tốt. Đổi loại da phía trước.",
      examples: [{ text: "건성 피부에 좋아요.", gloss: "geonseong pibue joayo", vi: "Hợp với da khô ạ." }],
    },
    {
      titleVi: "Mời thử thao tác: -아/어 보세요",
      pattern: "[động từ] + -아/어 보세요",
      bodyVi: "Mời khách thử một thao tác (thoa thử, ngửi thử…).",
      examples: [{ text: "손등에 발라 보세요.", gloss: "sondeunge balla boseyo", vi: "Thử thoa lên mu bàn tay ạ." }],
    },
  ],
  ko_wine_spirits_sales: [
    {
      titleVi: "Hỏi gu: …이/가 좋으세요?",
      pattern: "[danh từ] + 이/가 좋으세요?",
      bodyVi: "Trợ từ chủ ngữ 이(có phụ âm cuối)/가(nguyên âm cuối) + 좋으세요? để hỏi khách thích cái nào.",
      examples: [{ text: "레드 와인이 좋으세요?", gloss: "redeu waini joeuseyo", vi: "Anh/chị thích vang đỏ ạ?" }],
    },
    {
      titleVi: "Mục đích: …을/를 위해",
      pattern: "[danh từ] + 을/를 위해",
      bodyVi: "“위해” = để/vì (mục đích). Dùng khi giải thích lý do (kiểm tra độ tuổi…).",
      examples: [{ text: "나이 확인을 위해…", gloss: "nai hwagineul wihae", vi: "Để kiểm tra độ tuổi…" }],
    },
  ],
  ko_tobacco_sales: [
    {
      titleVi: "Hỏi đơn vị: …로 드릴까요?",
      pattern: "[số/đơn vị] + 로 드릴까요?",
      bodyVi: "“드릴까요?” = (em) đưa… nhé? Dùng để hỏi khách lấy đơn vị nào (cây/gói).",
      examples: [{ text: "한 보루로 드릴까요?", gloss: "han boruro deurilkkayo", vi: "Lấy một cây nhé ạ?" }],
    },
    {
      titleVi: "Chủ đề + có giới hạn: 은/는 … 제한이 있어요",
      pattern: "[danh từ] + 은/는 … 제한이 있어요",
      bodyVi: "Trợ từ chủ đề 은/는 nêu thứ đang nói; “제한이 있어요” = có giới hạn.",
      examples: [{ text: "담배는 수량 제한이 있어요.", gloss: "dambaeneun suryang jehani isseoyo", vi: "Thuốc lá có giới hạn số lượng ạ." }],
    },
  ],
  ko_confectionery_sales: [
    {
      titleVi: "Không quá…: 너무 …-지 않아요",
      pattern: "너무 + [tính từ]-지 않아요",
      bodyVi: "“-지 않아요” là cách phủ định lịch sự; “너무” = quá. Ghép lại = “không quá…”.",
      examples: [{ text: "너무 달지 않아요.", gloss: "neomu dalji anayo", vi: "Không quá ngọt ạ." }],
    },
    {
      titleVi: "Hợp để…: …(으)로 좋아요",
      pattern: "[danh từ] + (으)로 좋아요",
      bodyVi: "Nói cái gì đó hợp với mục đích nào: 선물로 좋아요 = hợp làm quà.",
      examples: [{ text: "선물로 좋아요.", gloss: "seonmullo joayo", vi: "Hợp làm quà ạ." }],
    },
  ],
  ko_boarding_passport: [
    {
      titleVi: "Xin xem giấy tờ: …을/를 보여 주시겠어요?",
      pattern: "[giấy tờ] + 을/를 보여 주시겠어요?",
      bodyVi: "Khung xin xem giấy tờ rất lịch sự. Đổi danh từ giấy tờ phía trước.",
      examples: [{ text: "탑승권을 보여 주시겠어요?", gloss: "tapseunggwoneul boyeo jusigesseoyo", vi: "Cho em xem thẻ lên máy bay ạ?" }],
    },
    {
      titleVi: "Hỏi thông tin lịch sự: …이/가 어떻게 되세요?",
      pattern: "[danh từ] + 이/가 어떻게 되세요?",
      bodyVi: "Cách hỏi thông tin (tên, số chuyến bay…) rất lịch sự, nhẹ nhàng.",
      examples: [{ text: "항공편 번호가 어떻게 되세요?", gloss: "hanggongpyeon beonhoga eotteoke doeseyo", vi: "Số chuyến bay của anh/chị là gì ạ?" }],
    },
  ],
  ko_duty_free_allowance: [
    {
      titleVi: "Cần…: …이/가 필요해요",
      pattern: "[danh từ] + 이/가 필요해요",
      bodyVi: "“필요해요” = cần. Trợ từ chủ ngữ 이/가 đứng trước.",
      examples: [{ text: "탑승권이 필요해요.", gloss: "tapseunggwoni piryohaeyo", vi: "Cần thẻ lên máy bay ạ." }],
    },
    {
      titleVi: "Có thể phải…: -ㄹ/을 수도 있어요",
      pattern: "[động từ] + -ㄹ/을 수도 있어요",
      bodyVi: "Diễn đạt khả năng “có thể phải/sẽ…”. Dùng khi chưa chắc về quy định.",
      examples: [{ text: "신고해야 할 수도 있어요.", gloss: "singohaeya hal sudo isseoyo", vi: "Có thể phải khai báo ạ." }],
    },
  ],
  ko_gate_flight_timing: [
    {
      titleVi: "Hỏi giờ: …이/가 몇 시예요?",
      pattern: "[danh từ] + 이/가 몇 시예요?",
      bodyVi: "“몇 시” = mấy giờ. Hỏi thời điểm của chuyến bay…",
      examples: [{ text: "비행기 시간이 몇 시예요?", gloss: "bihaenggi sigani myeot siyeyo", vi: "Chuyến bay mấy giờ ạ?" }],
    },
    {
      titleVi: "Vẫn còn…: 아직 …",
      pattern: "아직 + [danh từ]이/가 + [tính từ]",
      bodyVi: "“아직” = vẫn/còn. Dùng để trấn an khách còn đủ thời gian.",
      examples: [{ text: "아직 시간이 충분해요.", gloss: "ajik sigani chungbunhaeyo", vi: "Vẫn còn đủ thời gian ạ." }],
    },
  ],
  ko_stock_alternative: [
    {
      titleVi: "Xin lỗi + tình huống: 죄송합니다, …",
      pattern: "죄송합니다, + [câu]",
      bodyVi: "Mở đầu bằng 죄송합니다 khi báo tin không vui (hết hàng). 품절이에요 = hết hàng rồi.",
      examples: [{ text: "죄송합니다, 품절이에요.", gloss: "joesonghamnida, pumjeorieyo", vi: "Xin lỗi, đã hết hàng ạ." }],
    },
    {
      titleVi: "Đề nghị: …해 드릴까요?",
      pattern: "[động từ]해 드릴까요?",
      bodyVi: "Hỏi khách có muốn mình làm gì cho không (gợi ý mẫu khác…).",
      examples: [{ text: "비슷한 상품을 추천해 드릴까요?", gloss: "biseuthan sangpumeul chucheonhae deurilkkayo", vi: "Em gợi ý mẫu tương tự nhé ạ?" }],
    },
  ],
  ko_refund_escalation: [
    {
      titleVi: "Phủ định quá khứ: -지 않았어요",
      pattern: "[động từ] + -지 않았어요",
      bodyVi: "Phủ định lịch sự ở quá khứ. 승인되지 않았어요 = đã không được chấp nhận.",
      examples: [{ text: "카드가 승인되지 않았어요.", gloss: "kadeuga seungindoeji anasseoyo", vi: "Thẻ không được chấp nhận ạ." }],
    },
    {
      titleVi: "Đề nghị cái khác: 다른 …로 해 보시겠어요?",
      pattern: "다른 + [danh từ] + 로 해 보시겠어요?",
      bodyVi: "“다른” = khác. Đề nghị khách thử cách/thẻ khác.",
      examples: [{ text: "다른 카드로 해 보시겠어요?", gloss: "dareun kadeuro hae bosigesseoyo", vi: "Anh/chị thử thẻ khác nhé ạ?" }],
    },
  ],
};
