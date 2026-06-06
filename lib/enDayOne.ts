// English Day-One Survival content. Phase 2C.1.
//
// Authored to mirror the Chinese Day-One 10-phrase set (content/day_one_survival
// .json) for VDF sales staff serving English-speaking customers. Kept as a typed
// TS module (not content/*.json) so it doesn't go through the zh-specific
// content validator. ALL strings are status "needs_review" — the phonetic
// respellings (VN-friendly) and phrasing must be checked by a native/Operations
// reviewer before official training, exactly like the Chinese set.
//
// `phonetic` is a simple Vietnamese-friendly respelling (not IPA) so staff with
// little English can approximate the sound. It is a learning aid, not a standard.

export type EnPhrase = {
  id: string;
  en: string;
  phonetic: string; // VN-friendly respelling, needs_review
  vi: string;
  usageVi: string;
  riskLevel?: "safe" | "use_with_care";
  noteVi?: string;
};

export const EN_DAY_ONE_PHRASES: EnPhrase[] = [
  {
    id: "en_day1_1",
    en: "Hello, welcome!",
    phonetic: "Hê-lâu, wel-kâm",
    vi: "Xin chào, chào mừng quý khách!",
    usageVi: "Câu chào khi khách bước vào quầy.",
  },
  {
    id: "en_day1_2",
    en: "What would you like to look at?",
    phonetic: "Goát wud zu lai tu lúc ét?",
    vi: "Quý khách muốn xem sản phẩm gì ạ?",
    usageVi: "Hỏi nhu cầu khi khách chưa nói rõ.",
  },
  {
    id: "en_day1_3",
    en: "Which brand do you like?",
    phonetic: "Guých brend đu zu lai?",
    vi: "Quý khách thích thương hiệu nào ạ?",
    usageVi: "Hỏi thương hiệu khách quan tâm.",
  },
  {
    id: "en_day1_4",
    en: "I can recommend a few for you.",
    phonetic: "Ai khen re-kơ-men ơ phiu pho zu.",
    vi: "Em có thể giới thiệu cho quý khách vài mẫu ạ.",
    usageVi: "Chủ động gợi ý sản phẩm.",
  },
  {
    id: "en_day1_5",
    en: "This is the duty-free price.",
    phonetic: "Đít ít đơ điu-ti-phri prai.",
    vi: "Cái này là giá miễn thuế ạ.",
    usageVi: "Cho khách biết đây là giá miễn thuế.",
  },
  {
    id: "en_day1_6",
    en: "May I see your passport and boarding pass, please?",
    phonetic: "Mây ai si zo pát-pót en bo-đing pát, pliz?",
    vi: "Cho em xem hộ chiếu và thẻ lên máy bay của quý khách ạ?",
    usageVi: "Đề nghị giấy tờ khi mua hàng miễn thuế.",
    riskLevel: "use_with_care",
    noteVi: "Cần VDF Operations/Legal xác nhận trước khi đào tạo chính thức.",
  },
  {
    id: "en_day1_7",
    en: "Would you like to pay by card or by QR code?",
    phonetic: "Wud zu lai tu pây bai card o bai kiu-a-rờ cốt?",
    vi: "Quý khách muốn quẹt thẻ hay quét mã QR ạ?",
    usageVi: "Hỏi cách thanh toán.",
  },
  {
    id: "en_day1_8",
    en: "Payment successful. Here is your receipt.",
    phonetic: "Pây-mần sấc-sét-phâu. Hia ít zo ri-sít.",
    vi: "Thanh toán thành công ạ. Đây là hóa đơn của quý khách.",
    usageVi: "Xác nhận thanh toán và đưa hóa đơn.",
  },
  {
    id: "en_day1_9",
    en: "Sorry, this item is out of stock right now.",
    phonetic: "So-ri, đít ai-tầm ít aut ơv stóc rai nao.",
    vi: "Xin lỗi quý khách, mẫu này hiện tại hết hàng ạ.",
    usageVi: "Báo hết hàng lịch sự.",
  },
  {
    id: "en_day1_10",
    en: "Thank you. Have a pleasant trip!",
    phonetic: "Thanh kiu. Hév ơ ple-zần tríp!",
    vi: "Cảm ơn quý khách. Chúc quý khách một chuyến đi vui vẻ!",
    usageVi: "Câu kết khi tiễn khách rời quầy.",
  },
];

export type EnQuiz = {
  id: string;
  promptVi: string;
  options: string[];
  correctAnswer: string;
  explanationVi?: string;
};

export const EN_DAY_ONE_QUIZ: EnQuiz[] = [
  {
    id: "enq_day1_1",
    promptVi: "Khách vừa bước vào quầy. Nên chào thế nào?",
    options: ["Hello, welcome!", "Payment successful.", "It is out of stock."],
    correctAnswer: "Hello, welcome!",
    explanationVi: "Câu chào đón khách khi vào quầy.",
  },
  {
    id: "enq_day1_2",
    promptVi: "Muốn hỏi khách thích thương hiệu nào?",
    options: ["Which brand do you like?", "Here is your receipt.", "Have a pleasant trip!"],
    correctAnswer: "Which brand do you like?",
    explanationVi: "Hỏi thương hiệu khách quan tâm.",
  },
  {
    id: "enq_day1_3",
    promptVi: "Đề nghị khách xuất trình giấy tờ khi mua miễn thuế?",
    options: [
      "May I see your passport and boarding pass, please?",
      "What would you like to look at?",
      "This is the duty-free price.",
    ],
    correctAnswer: "May I see your passport and boarding pass, please?",
    explanationVi: "Mua hàng miễn thuế cần xuất trình hộ chiếu + thẻ lên máy bay.",
  },
  {
    id: "enq_day1_4",
    promptVi: "Hỏi khách muốn thanh toán bằng cách nào?",
    options: [
      "Would you like to pay by card or by QR code?",
      "I can recommend a few for you.",
      "Hello, welcome!",
    ],
    correctAnswer: "Would you like to pay by card or by QR code?",
    explanationVi: "Hỏi cách thanh toán: thẻ hay mã QR.",
  },
  {
    id: "enq_day1_5",
    promptVi: "Câu tiễn khách khi kết thúc giao dịch?",
    options: ["Thank you. Have a pleasant trip!", "Which brand do you like?", "Sorry, this item is out of stock right now."],
    correctAnswer: "Thank you. Have a pleasant trip!",
    explanationVi: "Lời cảm ơn + chúc đi vui khi tiễn khách.",
  },
];
