// Maps Korean lessons to the existing (Chinese-course) illustration set so the
// Korean course looks as lively as the others — no new image assets. 2C.1.4.

import { getVisualForCategory, type VisualAsset, type VisualCategory } from "@/lib/visuals";

const LESSON_VISUAL: Record<string, VisualCategory> = {
  ko_greeting_help: "greeting",
  ko_asking_needs: "greeting",
  ko_recommendation: "out_of_stock",
  ko_price_promotion: "price",
  ko_payment_receipt: "payment",
  ko_polite_closing: "closing",
  ko_perfume_sales: "perfume",
  ko_cosmetics_sales: "cosmetics",
  ko_wine_spirits_sales: "liquor",
  ko_tobacco_sales: "tobacco",
  ko_confectionery_sales: "confectionery",
  ko_boarding_passport: "documents",
  ko_duty_free_allowance: "duty_free",
  ko_gate_flight_timing: "documents",
  ko_stock_alternative: "out_of_stock",
  ko_refund_escalation: "payment",
};

export function koreanLessonVisual(lessonId: string): VisualAsset {
  return getVisualForCategory(LESSON_VISUAL[lessonId] ?? "duty_free");
}
export function koreanCourseHeroVisual(): VisualAsset {
  return getVisualForCategory("day_one_survival");
}
