// Maps English lessons to the existing (Chinese-course) illustration set so the
// English course looks as lively as the Chinese one — no new image assets.
// Phase 2C.1.3. Matches by sales/airport context; falls back to the closest
// existing duty-free illustration.

import { getVisualForCategory, type VisualAsset, type VisualCategory } from "@/lib/visuals";

const LESSON_VISUAL: Record<string, VisualCategory> = {
  // Module 0 — Foundations
  english_basics_greetings: "greeting",
  english_basics_pronouns: "greeting",
  english_basics_numbers: "price",
  english_basics_colors: "cosmetics",
  english_basics_time: "documents",
  english_basics_directions: "duty_free",
  // Module 1 — Counter Survival
  english_greeting_help: "greeting",
  english_asking_needs: "greeting",
  english_recommendation: "out_of_stock", // staff recommending a product — closest existing art
  english_price_promotion: "price",
  english_payment_receipt: "payment",
  english_polite_closing: "closing",
  // Module 2 — Product Sales
  english_perfume_sales: "perfume",
  english_cosmetics_sales: "cosmetics",
  english_wine_spirits_sales: "liquor",
  english_tobacco_sales: "tobacco",
  english_confectionery_sales: "confectionery",
  // Module 3 — Airport / Duty-free
  english_boarding_passport: "documents",
  english_duty_free_allowance: "duty_free",
  english_gate_flight_timing: "documents",
  english_stock_alternative: "out_of_stock",
  english_refund_escalation: "payment",
};

/** Illustration asset for an English lesson (reuses the Chinese visual set). */
export function englishLessonVisual(lessonId: string): VisualAsset {
  return getVisualForCategory(LESSON_VISUAL[lessonId] ?? "duty_free");
}

/** Hero illustration for the English course home + module headers. */
export function englishCourseHeroVisual(): VisualAsset {
  return getVisualForCategory("day_one_survival");
}
