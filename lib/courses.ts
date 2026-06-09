// Course registry + English local progress. Phase 2C.1.
//
// Separate from lib/courseCatalog.ts (Chinese required-path / dashboard logic)
// so adding English doesn't disturb the Chinese progress/cert/leaderboard
// pipeline. English progress is LOCAL-only this phase (server `phrases` table is
// seeded with Chinese ids only; English ids would be rejected by the existing
// RPCs). Server sync + Hall-of-Fame inclusion for English are later phases.

export type CourseSummary = {
  id: string;
  titleVi: string;
  language: string;
  flag: string;
  badge: string; // "Chinese" / "English"
  descriptionVi: string;
  startHref: string;
  status: "active" | "coming";
};

export const COURSES: CourseSummary[] = [
  {
    id: "chinese-sales",
    titleVi: "Tiếng Trung bán hàng",
    language: "中文 · zh-CN",
    flag: "🇨🇳",
    badge: "Chinese",
    descriptionVi: "10 câu sống còn + quy trình bán hàng tại quầy bằng tiếng Trung.",
    startHref: "/courses/chinese",
    status: "active",
  },
  {
    id: "english-sales",
    titleVi: "Tiếng Anh bán hàng",
    language: "English · en-US",
    flag: "🇬🇧",
    badge: "English",
    descriptionVi: "Counter Survival, ngành hàng & sân bay/miễn thuế bằng tiếng Anh (IPA + luyện phát âm).",
    startHref: "/courses/english",
    status: "active",
  },
  {
    id: "korean-sales",
    titleVi: "Tiếng Hàn bán hàng",
    language: "한국어 · ko-KR",
    flag: "🇰🇷",
    badge: "한국어",
    descriptionVi: "Chào hỏi, tư vấn, thanh toán & sân bay bằng tiếng Hàn (có chữ Hàn + phiên âm).",
    startHref: "/courses/korean",
    status: "active",
  },
];

// ---------- English local progress (client only) ----------

const EN_LEARNED_KEY = "vdf_en_learned"; // phrase ids marked "đã thuộc"
const EN_VOICE_KEY = "vdf_en_voice"; // phrase ids voice-passed/manual

function readSet(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function toggleIn(key: string, id: string): string[] {
  if (typeof window === "undefined") return [];
  const cur = readSet(key);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

function addTo(key: string, id: string): string[] {
  if (typeof window === "undefined") return [];
  const cur = readSet(key);
  if (cur.includes(id)) return cur;
  const next = [...cur, id];
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

function writeSet(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    /* ignore */
  }
}

export function getEnLearned(): string[] {
  return readSet(EN_LEARNED_KEY);
}
export function toggleEnLearned(id: string): string[] {
  return toggleIn(EN_LEARNED_KEY, id);
}
export function getEnVoicePassed(): string[] {
  return readSet(EN_VOICE_KEY);
}
export function markEnVoicePassed(id: string): string[] {
  return addTo(EN_VOICE_KEY, id);
}

/** Overwrite the local mirror to match server-truth state (Phase 2C.2). */
export function writeEnLearned(ids: string[]): void {
  writeSet(EN_LEARNED_KEY, ids);
}
export function writeEnVoicePassed(ids: string[]): void {
  writeSet(EN_VOICE_KEY, ids);
}
