// Course catalog layer. Phase 2B.2.
//
// The content tree (content/*.json) doesn't know which lessons are core to a
// learner's path vs optional practice vs lookup-only reference. This module
// adds that classification ON TOP of content, without touching the JSON or the
// DB. It's the single source of truth for:
//   - the /account required-path progress bar
//   - the next-lesson suggestion order
//   - the Required / Optional / Reference labels on /lessons
//
// Classification policy (conservative — when unsure, prefer "optional" over
// "required", and never hide a lesson with learnable content as "reference"):
//   - REQUIRED:  Day-One + the counter-survival sales flow + the P1 practical
//                gap lessons. This is the transaction path every VDF sales
//                staff must be able to run.
//   - OPTIONAL:  product-category lessons (perfume, skincare, liquor, tobacco,
//                confectionery) + foundation grammar lessons that carry
//                learnable vocab (numbers, colors, pronouns, demonstratives,
//                interrogatives, address terms).
//   - REFERENCE: lookup-only lessons with no learnable sentence patterns /
//                vocab / quizzes — currently the three measure-word tables.
//
// If a lesson id is not listed in any bucket, classifyLesson() returns
// "optional" so a newly-authored lesson never silently disappears from the
// catalog or gets force-counted into the required bar.

export type LessonClassification = "required" | "optional" | "reference";

export type CourseCatalog = {
  courseId: string;
  titleVi: string;
  subtitleVi: string;
  language: string;
  descriptionVi: string;
  dayOneLessonId: string;
  requiredLessonIds: string[];
  optionalLessonIds: string[];
  referenceLessonIds: string[];
  /** Suggested study order through the REQUIRED path (Day-One first). */
  recommendedOrder: string[];
};

const DAY_ONE_LESSON_ID = "lesson_day_one_10_phrases";

// Phase 2E — Foundations come FIRST (learn the basics before sales): pronouns,
// address terms, demonstratives, question words, numbers, colors.
const FOUNDATION_LESSON_IDS = [
  "lesson_personal_pronouns",
  "lesson_address_terms",
  "lesson_demonstratives",
  "lesson_interrogatives",
  "lesson_numbers",
  "lesson_colors",
];

// Required path — Foundations first, then Day-One, the counter-survival flow,
// then P1 depth.
const REQUIRED_LESSON_IDS = [
  ...FOUNDATION_LESSON_IDS,
  DAY_ONE_LESSON_ID,
  // Counter-survival short flow (sales_flow_core.json)
  "lesson_cs_greeting",
  "lesson_cs_ask_needs",
  "lesson_cs_recommend",
  "lesson_cs_bestseller",
  "lesson_cs_browsing",
  "lesson_cs_out_of_stock",
  "lesson_cs_verify_goods",
  "lesson_cs_payment",
  // P1 practical-gap depth lessons (sales_flow_p1_gaps.json)
  "lesson_p1_dutyfree",
  "lesson_p1_passport",
  "lesson_p1_price",
  "lesson_p1_oos",
  "lesson_p1_payment",
  "lesson_p1_closing",
];

const OPTIONAL_LESSON_IDS = [
  // Product categories (product_beauty.json + product_liquor_tobacco_sweets.json)
  "lesson_perfume",
  "lesson_skincare",
  "lesson_liquor",
  "lesson_tobacco",
  "lesson_confectionery",
];

const REFERENCE_LESSON_IDS = [
  // Measure-word tables — lookup-only (no sentence patterns / vocab / quizzes).
  "lesson_mw_beauty",
  "lesson_mw_liquor_tobacco_sweets",
  "lesson_mw_fashion",
];

// recommendedOrder follows a natural learning arc: master Day-One, learn the
// short counter phrases, then the detailed P1 lessons covering each stage.
const RECOMMENDED_ORDER = [...REQUIRED_LESSON_IDS];

export const VDF_CHINESE_SALES: CourseCatalog = {
  courseId: "vdf_chinese_sales",
  titleVi: "Chinese for VDF Sales",
  subtitleVi: "Tiếng Trung dùng ngay tại quầy duty-free",
  language: "Tiếng Trung (zh-CN)",
  descriptionVi:
    "Lộ trình tiếng Trung cho nhân viên bán hàng VDF: bắt đầu với Day-One 10 câu sống còn, sau đó học trọn quy trình bán hàng tại quầy. Các bài ngành hàng và ngữ pháp nền tảng là tự chọn; bảng lượng từ là tra cứu.",
  dayOneLessonId: DAY_ONE_LESSON_ID,
  requiredLessonIds: REQUIRED_LESSON_IDS,
  optionalLessonIds: OPTIONAL_LESSON_IDS,
  referenceLessonIds: REFERENCE_LESSON_IDS,
  recommendedOrder: RECOMMENDED_ORDER,
};

/** The single active course (multi-course support can extend this later). */
export const ACTIVE_CATALOG = VDF_CHINESE_SALES;

const REQUIRED_SET = new Set(REQUIRED_LESSON_IDS);
const REFERENCE_SET = new Set(REFERENCE_LESSON_IDS);

/**
 * Classify a lesson id. Unknown ids default to "optional" so newly-authored
 * lessons surface as optional practice rather than silently inflating the
 * required-path bar.
 */
export function classifyLesson(lessonId: string): LessonClassification {
  if (REQUIRED_SET.has(lessonId)) return "required";
  if (REFERENCE_SET.has(lessonId)) return "reference";
  return "optional";
}

export const CLASSIFICATION_LABEL: Record<LessonClassification, string> = {
  required: "Bắt buộc",
  optional: "Tự chọn",
  reference: "Tra cứu",
};
