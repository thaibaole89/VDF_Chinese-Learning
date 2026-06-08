// English grammar / sentence-building tips, keyed by English lesson id.
// Phase 2C.1.6. Kept separate from lib/englishCourse.ts so content stays modular.

import type { GrammarTip } from "@/lib/grammar";

export const ENGLISH_GRAMMAR: Record<string, GrammarTip[]> = {
  english_greeting_help: [
    {
      titleVi: "Khung mời giúp lịch sự: May I…?",
      pattern: "May I + [động từ nguyên thể] + …?",
      bodyVi:
        "Dùng “May I…?” để xin phép/mời giúp rất lịch sự. Sau “May I” luôn là động từ nguyên thể (không thêm -s/-ing). Đổi động từ để tạo câu mới.",
      examples: [
        { text: "May I help you?", vi: "Tôi giúp gì được ạ?" },
        { text: "May I show you something?", vi: "Tôi cho anh/chị xem mẫu nhé?" },
        { text: "May I take your bag?", vi: "Tôi cầm túi giúp nhé?" },
      ],
    },
    {
      titleVi: "Mời nhẹ nhàng: Please feel free to…",
      pattern: "Please feel free to + [động từ]",
      bodyVi: "Cấu trúc để khách thoải mái làm gì đó. Thay động từ phía sau để dùng nhiều tình huống.",
      examples: [
        { text: "Please feel free to look around.", vi: "Anh/chị cứ thoải mái xem ạ." },
        { text: "Please feel free to ask.", vi: "Cứ thoải mái hỏi ạ." },
      ],
    },
  ],
  english_asking_needs: [
    {
      titleVi: "Câu hỏi với từ để hỏi (Wh-) + be/do",
      pattern: "What / Which / Who + (do you …) ?",
      bodyVi:
        "Câu hỏi mở bắt đầu bằng What (gì), Which (cái nào), Who (ai)… Với động từ thường, thêm “do you”. Ghi nhớ trật tự: Từ hỏi + do + you + động từ.",
      examples: [
        { text: "What are you looking for?", vi: "Anh/chị đang tìm gì ạ?" },
        { text: "Which brand do you prefer?", vi: "Anh/chị thích thương hiệu nào ạ?" },
        { text: "Who is it for?", vi: "Mua cho ai ạ?" },
      ],
    },
    {
      titleVi: "Câu hỏi lựa chọn: … or …?",
      pattern: "Is it + A + or + B?",
      bodyVi: "Đưa hai lựa chọn bằng “or”. Lên giọng ở A, xuống giọng ở B.",
      examples: [{ text: "Is it for yourself or a gift?", vi: "Anh/chị dùng hay làm quà ạ?" }],
    },
  ],
  english_recommendation: [
    {
      titleVi: "So sánh hơn nhất: the + …-est / the most…",
      pattern: "the + best / newest / most popular + [danh từ]",
      bodyVi:
        "Để nói “…nhất”, tính từ ngắn thêm -est (new → newest), tính từ dài dùng “the most…”. Luôn có “the”.",
      examples: [
        { text: "This is our best seller.", vi: "Đây là sản phẩm bán chạy nhất." },
        { text: "It's our newest arrival.", vi: "Đây là mẫu mới nhất." },
        { text: "This is the most popular one.", vi: "Đây là mẫu được ưa chuộng nhất." },
      ],
    },
    {
      titleVi: "Mời thử: Would you like to…?",
      pattern: "Would you like to + [động từ]?",
      bodyVi: "“Would you like to…?” lịch sự hơn “Do you want to…?”. Sau nó là động từ nguyên thể.",
      examples: [{ text: "Would you like to try it?", vi: "Anh/chị muốn thử không ạ?" }],
    },
  ],
  english_price_promotion: [
    {
      titleVi: "Mệnh lệnh mời mua: Buy…, get…",
      pattern: "Buy + [số/SP], get + [số/SP] + free",
      bodyVi: "Câu khuyến mãi dùng dạng mệnh lệnh (động từ đứng đầu). Rất gọn để giới thiệu chương trình.",
      examples: [
        { text: "Buy one, get one free.", vi: "Mua một tặng một." },
        { text: "Spend over 1,000 and get a gift.", vi: "Mua trên 1.000 được tặng quà." },
      ],
    },
    {
      titleVi: "So sánh hơn: …-er than / more … than",
      pattern: "[tính từ]-er + than + …",
      bodyVi: "Tính từ ngắn thêm -er (cheap → cheaper); tính từ dài dùng “more … than”.",
      examples: [{ text: "It's cheaper than the city price.", vi: "Rẻ hơn giá ngoài thành phố." }],
    },
  ],
  english_payment_receipt: [
    {
      titleVi: "Hỏi cách thức: How would you like to…?",
      pattern: "How would you like to + [động từ]?",
      bodyVi: "Hỏi khách muốn làm theo cách nào một cách lịch sự. “How” = như thế nào / bằng cách nào.",
      examples: [{ text: "How would you like to pay?", vi: "Anh/chị muốn thanh toán thế nào ạ?" }],
    },
    {
      titleVi: "Đề nghị lịch sự: Please + [động từ]",
      pattern: "Please + [động từ nguyên thể] …",
      bodyVi: "Thêm “please” trước động từ để biến mệnh lệnh thành lời đề nghị lịch sự.",
      examples: [
        { text: "Please insert your card.", vi: "Anh/chị cắm thẻ giúp ạ." },
        { text: "Please keep your receipt.", vi: "Anh/chị giữ hóa đơn giúp ạ." },
      ],
    },
  ],
  english_polite_closing: [
    {
      titleVi: "Lời chúc: Have a + [tính từ] + [danh từ]!",
      pattern: "Have a + [tính từ] + [danh từ]!",
      bodyVi: "Khung chúc rất hữu dụng. Đổi tính từ + danh từ để chúc nhiều kiểu.",
      examples: [
        { text: "Have a pleasant trip!", vi: "Chúc chuyến đi vui vẻ!" },
        { text: "Have a safe flight!", vi: "Chúc bay an toàn!" },
        { text: "Have a nice day!", vi: "Chúc một ngày tốt lành!" },
      ],
    },
    {
      titleVi: "Cảm ơn + lý do: Thank you for + V-ing",
      pattern: "Thank you for + [động từ + -ing]",
      bodyVi: "Sau “Thank you for” dùng danh từ hoặc động từ thêm -ing.",
      examples: [{ text: "Thank you for shopping with us.", vi: "Cảm ơn anh/chị đã mua sắm." }],
    },
  ],
  english_perfume_sales: [
    {
      titleVi: "Danh từ sở hữu: men's / women's",
      pattern: "[danh từ]'s + [sản phẩm]",
      bodyVi: "Thêm ’s để chỉ “dành cho…”: men's = của nam, women's = của nữ.",
      examples: [{ text: "men's or women's perfume", vi: "nước hoa nam hay nữ" }],
    },
    {
      titleVi: "Mô tả sản phẩm: It + is/has/comes in…",
      pattern: "It + [tính từ] / It comes in + [lựa chọn]",
      bodyVi: "Dùng “It is + tính từ” để tả; “It comes in…” để nói có các loại/dung tích/màu.",
      examples: [
        { text: "It's fresh and light.", vi: "Nó tươi mát và nhẹ." },
        { text: "It comes in 50 and 100 ml.", vi: "Có dung tích 50 và 100 ml." },
      ],
    },
  ],
  english_cosmetics_sales: [
    {
      titleVi: "Tốt cho…: good for + [danh từ]",
      pattern: "It's good for + [loại da/nhu cầu]",
      bodyVi: "Sau “good for” là danh từ. Đổi danh từ để hợp từng loại da.",
      examples: [
        { text: "This is good for dry skin.", vi: "Loại này hợp da khô." },
        { text: "It's good for oily skin.", vi: "Hợp với da dầu." },
      ],
    },
    {
      titleVi: "Hai hành động nối bằng “and”",
      pattern: "It + [động từ-s] + and + [động từ-s]",
      bodyVi: "Chủ ngữ số ít (It) thì động từ thêm -s. Nối hai công dụng bằng “and”.",
      examples: [{ text: "It hydrates and brightens the skin.", vi: "Cấp ẩm và làm sáng da." }],
    },
  ],
  english_wine_spirits_sales: [
    {
      titleVi: "Hỏi gu: Do you prefer A or B?",
      pattern: "Do you prefer + A + or + B?",
      bodyVi: "“prefer” = thích hơn. Dùng để hỏi lựa chọn giữa hai thứ.",
      examples: [{ text: "Do you prefer red or white wine?", vi: "Anh/chị thích vang đỏ hay trắng ạ?" }],
    },
    {
      titleVi: "Mục đích: for the + [danh từ]",
      pattern: "… for the + [mục đích]",
      bodyVi: "Dùng “for the…” để nêu lý do/mục đích, ví dụ kiểm tra độ tuổi.",
      examples: [{ text: "May I see your passport for the age check?", vi: "Cho xem hộ chiếu để kiểm tra độ tuổi ạ?" }],
    },
  ],
  english_tobacco_sales: [
    {
      titleVi: "Lựa chọn A hay B: … or …?",
      pattern: "Do you want + A + or + B?",
      bodyVi: "Hỏi khách lấy đơn vị nào (cây/gói). Danh từ đếm được số nhiều thêm -s (cartons).",
      examples: [{ text: "Do you want a carton or a single pack?", vi: "Anh/chị lấy cây hay gói lẻ ạ?" }],
    },
    {
      titleVi: "Có giới hạn: There is a limit on…",
      pattern: "There is a limit on + [mặt hàng]",
      bodyVi: "“There is…” = có (số ít). Đổi mặt hàng phía sau để nói về quy định.",
      examples: [{ text: "There is a limit on tobacco.", vi: "Thuốc lá có giới hạn số lượng." }],
    },
  ],
  english_confectionery_sales: [
    {
      titleVi: "Phủ định mức độ: not too + [tính từ]",
      pattern: "It's not too + [tính từ]",
      bodyVi: "“not too…” = không quá… Rất tiện để trấn an khách (không quá ngọt/đậm).",
      examples: [{ text: "It's not too sweet.", vi: "Không quá ngọt." }],
    },
    {
      titleVi: "Hợp để…: perfect for + [danh từ]",
      pattern: "It's perfect for + [danh từ/V-ing]",
      bodyVi: "Sau “perfect for” dùng danh từ hoặc động từ -ing.",
      examples: [{ text: "This box is perfect for a gift.", vi: "Hộp này rất hợp làm quà." }],
    },
  ],
  english_boarding_passport: [
    {
      titleVi: "Xin phép lịch sự: May I see…?",
      pattern: "May I see + your + [giấy tờ]?",
      bodyVi: "Khung xin xem giấy tờ. Đổi danh từ giấy tờ phía sau.",
      examples: [
        { text: "May I see your boarding pass?", vi: "Cho em xem thẻ lên máy bay ạ?" },
        { text: "May I see your passport?", vi: "Cho em xem hộ chiếu ạ?" },
      ],
    },
    {
      titleVi: "Hỏi thông tin: What is your…?",
      pattern: "What is your + [thông tin]?",
      bodyVi: "Hỏi một thông tin cụ thể của khách (số chuyến bay, tên…).",
      examples: [{ text: "What is your flight number?", vi: "Số chuyến bay của anh/chị là gì ạ?" }],
    },
  ],
  english_duty_free_allowance: [
    {
      titleVi: "Cần điều kiện: You need + [danh từ] + to + [động từ]",
      pattern: "You need + [danh từ] + to + [động từ]",
      bodyVi: "Nói điều kiện: cần X để làm Y. Sau “to” là động từ nguyên thể.",
      examples: [{ text: "You need an international boarding pass to buy.", vi: "Anh/chị cần thẻ lên máy bay quốc tế để mua." }],
    },
    {
      titleVi: "Khả năng/nghĩa vụ: may need to…",
      pattern: "You may need to + [động từ]",
      bodyVi: "“may need to” = có thể phải… Dùng khi chưa chắc chắn về quy định.",
      examples: [{ text: "You may need to declare this at customs.", vi: "Anh/chị có thể phải khai báo ở hải quan." }],
    },
  ],
  english_gate_flight_timing: [
    {
      titleVi: "Hỏi giờ: What time…?",
      pattern: "What time is + [danh từ]?",
      bodyVi: "Hỏi thời điểm. “What time” = mấy giờ.",
      examples: [{ text: "What time is your flight?", vi: "Chuyến bay của anh/chị mấy giờ ạ?" }],
    },
    {
      titleVi: "Còn / vẫn: still + [động từ]",
      pattern: "You still have + [danh từ]",
      bodyVi: "“still” = vẫn còn, đặt trước động từ thường. Dùng để trấn an khách.",
      examples: [{ text: "You still have enough time.", vi: "Anh/chị vẫn còn đủ thời gian." }],
    },
  ],
  english_stock_alternative: [
    {
      titleVi: "Xin lỗi + báo tin: I'm sorry, …",
      pattern: "I'm sorry, + [câu thông báo]",
      bodyVi: "Mở đầu bằng “I'm sorry,” khi báo tin không vui (hết hàng). “out of stock” = hết hàng.",
      examples: [{ text: "I'm sorry, this is out of stock.", vi: "Xin lỗi, mẫu này hết hàng." }],
    },
    {
      titleVi: "Đề nghị lịch sự: May I suggest…?",
      pattern: "May I suggest + [danh từ]?",
      bodyVi: "Cách đề nghị nhã nhặn. Sau “suggest” là danh từ (a similar product…).",
      examples: [{ text: "May I suggest a similar product?", vi: "Em gợi ý sản phẩm tương tự nhé ạ?" }],
    },
  ],
  english_refund_escalation: [
    {
      titleVi: "Câu bị động: was + [V3] (declined)",
      pattern: "[chủ ngữ] + was + [động từ phân từ 3]",
      bodyVi: "Bị động để nói việc xảy ra với chủ ngữ. “declined” = bị từ chối (V3 của decline).",
      examples: [{ text: "Your card was declined.", vi: "Thẻ của anh/chị bị từ chối." }],
    },
    {
      titleVi: "Xin để tôi…: Let me + [động từ]",
      pattern: "Let me + [động từ nguyên thể] …",
      bodyVi: "“Let me…” để xin phép tự làm gì đó (gọi quản lý, kiểm tra…). Sau nó là động từ nguyên thể.",
      examples: [{ text: "Let me call my manager to help you.", vi: "Để em gọi quản lý hỗ trợ ạ." }],
    },
  ],
};
