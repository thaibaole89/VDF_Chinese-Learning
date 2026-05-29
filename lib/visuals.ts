// Visual-asset metadata + mappers. Images live in /public/visuals.
//
// NOTE: AI illustrations were NOT generated in this environment (no Gemini /
// "Nano Banana" capability connected). The files referenced here are clean
// brand-gradient PLACEHOLDERS (approvalStatus: "placeholder"). Re-run
// `node scripts/gen-visuals.mjs` with a GEMINI_API_KEY set to produce the real
// illustrations (same filenames). WebP wasn't available locally, so files are
// optimized PNG.

import type { Lesson, Course } from "@/lib/types";

export type VisualCategory =
  | "day_one_survival"
  | "greeting"
  | "documents"
  | "payment"
  | "price"
  | "duty_free"
  | "out_of_stock"
  | "closing"
  | "perfume"
  | "cosmetics"
  | "liquor"
  | "tobacco"
  | "confectionery"
  | "brand_reference"
  | "measure_words";

export type VisualAsset = {
  id: string;
  src: string;
  altVi: string;
  category: VisualCategory;
  source: "ai_generated";
  model: "Nano Banana";
  approvalStatus: "placeholder";
  rightsNoteVi: string;
};

const RIGHTS =
  "Ảnh minh hoạ AI-generated, không dùng logo/thương hiệu thật; cần VDF duyệt trước khi dùng chính thức.";

function v(category: VisualCategory, file: string, altVi: string): VisualAsset {
  return {
    id: category,
    src: `/visuals/${file}`,
    altVi,
    category,
    source: "ai_generated",
    model: "Nano Banana",
    approvalStatus: "placeholder",
    rightsNoteVi: RIGHTS,
  };
}

export const VISUALS: Record<VisualCategory, VisualAsset> = {
  day_one_survival: v("day_one_survival", "day-one-survival.png", "Nhân viên VDF chào khách Trung Quốc tại quầy miễn thuế sân bay."),
  greeting: v("greeting", "greeting.png", "Nhân viên đón khách bước vào cửa hàng miễn thuế."),
  documents: v("documents", "documents.png", "Kiểm tra hộ chiếu và thẻ lên máy bay tại quầy (dữ liệu giả)."),
  payment: v("payment", "payment.png", "Khách thanh toán bằng quét mã QR và thẻ tại quầy."),
  price: v("price", "price-promotion.png", "Kệ hàng miễn thuế với bảng giá và biển khuyến mãi chung."),
  duty_free: v("duty_free", "duty-free.png", "Không gian cửa hàng miễn thuế sân bay, kệ hàng sạch sẽ."),
  out_of_stock: v("out_of_stock", "out-of-stock.png", "Nhân viên gợi ý sản phẩm thay thế khi hết hàng."),
  closing: v("closing", "closing.png", "Nhân viên trao túi hàng và hoá đơn, chào tạm biệt khách."),
  perfume: v("perfume", "perfume.png", "Các chai nước hoa chung trên kệ miễn thuế, không nhãn hiệu."),
  cosmetics: v("cosmetics", "cosmetics.png", "Các lọ dưỡng da, hũ kem, son chung trên quầy mỹ phẩm."),
  liquor: v("liquor", "liquor.png", "Các chai rượu whisky/cognac/vang chung, không nhãn hiệu."),
  tobacco: v("tobacco", "tobacco.png", "Cây thuốc lá bao trơn sau quầy miễn thuế, không nhãn hiệu."),
  confectionery: v("confectionery", "confectionery.png", "Hộp socola và kẹo chung trên kệ miễn thuế."),
  brand_reference: v("brand_reference", "brand-reference.png", "Bảng tra phát âm tên thương hiệu chung trên máy tính bảng."),
  measure_words: v("measure_words", "measure-words.png", "Các vật phẩm nhóm theo lượng từ: chai, hộp, túi, đôi, bộ."),
};

export function getVisualForCategory(category: VisualCategory): VisualAsset {
  return VISUALS[category] ?? VISUALS.greeting;
}

function categoryFromKeywords(s: string | undefined): VisualCategory | undefined {
  if (!s) return undefined;
  const k = s.toLowerCase();
  if (k.includes("day_one") || k.includes("survival")) return "day_one_survival";
  if (k.includes("document") || k.includes("verify_documents") || k.includes("passport")) return "documents";
  if (k.includes("payment")) return "payment";
  if (k.includes("price")) return "price";
  if (k.includes("duty_free") || k.includes("explain_duty_free")) return "duty_free";
  if (k.includes("out_of_stock")) return "out_of_stock";
  if (k.includes("closing")) return "closing";
  if (k.includes("greeting")) return "greeting";
  if (k.includes("perfume")) return "perfume";
  if (k.includes("skincare") || k.includes("beauty") || k.includes("cosmetic")) return "cosmetics";
  if (k.includes("liquor") || k.includes("wine") || k.includes("spirit")) return "liquor";
  if (k.includes("tobacco") || k.includes("cigarette")) return "tobacco";
  if (k.includes("sweet") || k.includes("choco") || k.includes("candy") || k.includes("confection")) return "confectionery";
  if (k.includes("measure")) return "measure_words";
  if (k.includes("brand")) return "brand_reference";
  return undefined;
}

export function getVisualForLesson(lesson: Lesson): VisualAsset {
  const cat = categoryFromKeywords(lesson.salesStage) ?? categoryFromKeywords(lesson.category) ?? "greeting";
  return getVisualForCategory(cat);
}

export function getVisualForCourse(course: Course): VisualAsset {
  const cat = categoryFromKeywords(course.id) ?? categoryFromKeywords(course.track) ?? "greeting";
  return getVisualForCategory(cat);
}

export function getVisualForReference(type: "brand" | "number" | "color" | "measure_word"): VisualAsset {
  return type === "measure_word" ? VISUALS.measure_words : VISUALS.brand_reference;
}
