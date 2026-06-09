// Hero illustration for the Chinese course home — reuses the existing
// (Chinese-course) illustration set; no new image assets. Phase 2D.
// Mirrors lib/koreanVisuals + lib/englishVisuals so all three course homes
// share the same hero pattern.

import { getVisualForCategory, type VisualAsset } from "@/lib/visuals";

export function chineseCourseHeroVisual(): VisualAsset {
  return getVisualForCategory("day_one_survival");
}
