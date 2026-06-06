// Course registry for the course picker. Phase 2C.1.
//
// Lightweight, separate from lib/courseCatalog.ts (which holds the Chinese
// required-path + dashboard logic) so adding the English course doesn't disturb
// the existing Chinese progress/cert/leaderboard pipeline.
//
// Each course points at its own "start here" route. The Chinese course is the
// existing experience (/day-one). English (Phase 2C.1) is /en/day-one — a
// learn/listen/read/quiz MVP; voice practice + server scoring come in a later
// phase.

export type CourseSummary = {
  id: string;
  titleVi: string;
  language: string;
  flag: string;
  descriptionVi: string;
  startHref: string;
  status: "active" | "coming";
};

export const COURSES: CourseSummary[] = [
  {
    id: "chinese_vdf_sales",
    titleVi: "Tiếng Trung bán hàng",
    language: "中文 · zh-CN",
    flag: "🇨🇳",
    descriptionVi: "10 câu sống còn + quy trình bán hàng tại quầy bằng tiếng Trung.",
    startHref: "/day-one",
    status: "active",
  },
  {
    id: "english_vdf_sales",
    titleVi: "Tiếng Anh bán hàng",
    language: "English · en",
    flag: "🇬🇧",
    descriptionVi: "10 câu sống còn tại quầy bằng tiếng Anh (đang phát triển — luyện nói thêm sau).",
    startHref: "/en/day-one",
    status: "active",
  },
];

// ---------- English Day-One local progress (client only) ----------
// English progress is stored locally this phase — the server `phrases` table is
// seeded with Chinese ids only, so the existing voice/phrase RPCs would reject
// English ids. Server sync + scoring for English is a later phase.

const EN_DAYONE_KEY = "vdf_en_dayone_learned";

export function getEnDayOneLearned(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EN_DAYONE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toggleEnDayOneLearned(id: string): string[] {
  if (typeof window === "undefined") return [];
  const cur = getEnDayOneLearned();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  try {
    window.localStorage.setItem(EN_DAYONE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
