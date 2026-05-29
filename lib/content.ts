// lib/content.ts — single content access layer.
// Statically imports every /content course + reference JSON, normalizes them
// into typed arrays, and exposes query helpers. The content-gap backlog is
// intentionally NOT imported (it is not learning content).
//
// No new learning content is created here — this only reads the approved JSON.

import dayOne from "../content/day_one_survival.json";
import counterSurvival from "../content/sales_flow_core.json";
import p1gaps from "../content/sales_flow_p1_gaps.json";
import beauty from "../content/product_beauty.json";
import liquor from "../content/product_liquor_tobacco_sweets.json";
import pronouns from "../content/foundation_pronouns.json";
import numbers from "../content/foundation_numbers_colors.json";
import measure from "../content/foundation_measure_words.json";
import beautyBrands from "../content/reference_beauty_brands.json";
import liquorBrands from "../content/reference_liquor_tobacco_brands.json";

import type {
  Course,
  Lesson,
  ReferenceTable,
  MeasureWord,
  BrandReference,
  Dialogue,
  FlashItem,
  SearchResult,
  QuizWithContext,
  RoleplayWithContext,
  LessonMeta,
  LessonGroup,
  ProgressData,
  FlashcardStore,
  QuizAttempt,
  ReviewStats,
} from "@/lib/types";

export const DAY_ONE_COURSE_ID = "course_day_one_survival";

type RawCourse = { course: Course; fileKey: string };

const RAW: RawCourse[] = [
  { course: dayOne as unknown as Course, fileKey: "day_one_survival" },
  { course: counterSurvival as unknown as Course, fileKey: "sales_flow_core" },
  { course: p1gaps as unknown as Course, fileKey: "sales_flow_p1_gaps" },
  { course: beauty as unknown as Course, fileKey: "product_beauty" },
  { course: liquor as unknown as Course, fileKey: "product_liquor_tobacco_sweets" },
  { course: pronouns as unknown as Course, fileKey: "foundation_pronouns" },
  { course: numbers as unknown as Course, fileKey: "foundation_numbers_colors" },
  { course: measure as unknown as Course, fileKey: "foundation_measure_words" },
];

export const courses: Course[] = RAW.map((r) => r.course);

export const referenceTables: ReferenceTable[] = [
  beautyBrands as unknown as ReferenceTable,
  liquorBrands as unknown as ReferenceTable,
];

// ---------- lesson index ----------

const lessonMetas: LessonMeta[] = [];
for (const { course, fileKey } of RAW) {
  for (const lesson of course.lessons ?? []) {
    lessonMetas.push({
      lesson,
      courseId: course.id,
      courseTitleVi: course.titleVi,
      track: course.track,
      fileKey,
    });
  }
}
const lessonMetaById = new Map<string, LessonMeta>(
  lessonMetas.map((m) => [m.lesson.id, m])
);

// ---------- grouping for /lessons ----------

const GROUP_DEFS: { id: string; titleVi: string; files: string[] }[] = [
  { id: "quickstart", titleVi: "Bắt đầu nhanh", files: ["day_one_survival"] },
  {
    id: "sales_flow",
    titleVi: "Quy trình bán hàng",
    files: ["sales_flow_core", "sales_flow_p1_gaps"],
  },
  {
    id: "product",
    titleVi: "Ngành hàng",
    files: ["product_beauty", "product_liquor_tobacco_sweets"],
  },
  {
    id: "foundation",
    titleVi: "Nền tảng",
    files: ["foundation_pronouns", "foundation_numbers_colors", "foundation_measure_words"],
  },
];

export function getLessonGroups(): LessonGroup[] {
  return GROUP_DEFS.map((g) => ({
    id: g.id,
    titleVi: g.titleVi,
    lessons: lessonMetas.filter((m) => g.files.includes(m.fileKey)),
  })).filter((g) => g.lessons.length > 0);
}

// ---------- basic getters ----------

export function getCourses(): Course[] {
  return courses;
}
export function getLessonById(id: string): Lesson | undefined {
  return lessonMetaById.get(id)?.lesson;
}
export function getLessonMeta(id: string): LessonMeta | undefined {
  return lessonMetaById.get(id);
}
export function getAllLessonIds(): string[] {
  return lessonMetas.map((m) => m.lesson.id);
}
export function getDayOneCourse(): Course | undefined {
  return courses.find((c) => c.id === DAY_ONE_COURSE_ID);
}
export function getDayOneLesson(): Lesson | undefined {
  return getDayOneCourse()?.lessons[0];
}

const RISKY = new Set(["use_with_care", "avoid_for_customer"]);
export function lessonHasRisk(lesson: Lesson): boolean {
  const v = (lesson.vocabulary ?? []).some((x) => x.riskLevel && RISKY.has(x.riskLevel));
  const s = (lesson.sentencePatterns ?? []).some((x) => x.riskLevel && RISKY.has(x.riskLevel));
  return v || s;
}

// ---------- flashcards ----------

const PRIORITY_RANK: Record<string, number> = { must_know: 0, useful: 1, advanced: 2 };

export function getAllFlashcardItems(): FlashItem[] {
  const items: FlashItem[] = [];
  for (const m of lessonMetas) {
    const isDayOne = m.fileKey === "day_one_survival";
    for (const v of m.lesson.vocabulary ?? []) {
      if (v.displayMode === "reference_only") continue;
      const ex = v.examples?.[0];
      items.push({
        id: v.id,
        kind: "vocab",
        zh: v.hanzi,
        pinyin: v.pinyin,
        vi: v.meaningVi,
        note: ex ? `${ex.zh}${ex.vi ? " — " + ex.vi : ""}` : v.noteVi,
        priority: v.priority,
        status: v.status,
        riskLevel: v.riskLevel,
        lessonId: m.lesson.id,
        isDayOne,
      });
    }
    for (const s of m.lesson.sentencePatterns ?? []) {
      items.push({
        id: s.id,
        kind: "pattern",
        zh: s.zh,
        pinyin: s.pinyin,
        vi: s.vi,
        note: s.usageVi,
        priority: "useful",
        status: s.status,
        riskLevel: s.riskLevel,
        lessonId: m.lesson.id,
        isDayOne,
      });
    }
  }
  items.sort((a, b) => {
    if (a.isDayOne !== b.isDayOne) return a.isDayOne ? -1 : 1;
    return (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);
  });
  // de-duplicate by Chinese text (Day-One copies appear first and win)
  const seen = new Set<string>();
  const out: FlashItem[] = [];
  for (const it of items) {
    if (seen.has(it.zh)) continue;
    seen.add(it.zh);
    out.push(it);
  }
  return out;
}

// ---------- quizzes ----------

export function getAllQuizQuestions(): QuizWithContext[] {
  const out: QuizWithContext[] = [];
  for (const m of lessonMetas) {
    for (const q of m.lesson.quizzes ?? []) {
      out.push({ ...q, lessonId: m.lesson.id, courseId: m.courseId, category: m.lesson.category });
    }
  }
  return out;
}

// ---------- roleplays + dialogues ----------

const dialogueById = new Map<string, Dialogue>();
for (const m of lessonMetas) {
  for (const d of m.lesson.dialogues ?? []) dialogueById.set(d.id, d);
}

export function getAllRoleplays(): RoleplayWithContext[] {
  const out: RoleplayWithContext[] = [];
  for (const m of lessonMetas) {
    for (const r of m.lesson.roleplays ?? []) out.push({ ...r, lessonId: m.lesson.id });
  }
  return out;
}
export function getDialogueById(id?: string): Dialogue | undefined {
  return id ? dialogueById.get(id) : undefined;
}

// ---------- references ----------

export function getBrands(): BrandReference[] {
  return referenceTables.flatMap((t) => t.brands ?? []);
}
export function getBrandsByCategory(): {
  beauty: BrandReference[];
  liquorTobacco: BrandReference[];
} {
  const brands = getBrands();
  return {
    beauty: brands.filter((b) => b.category === "beauty"),
    liquorTobacco: brands.filter((b) => b.category === "liquor" || b.category === "tobacco"),
  };
}
export function getMeasureWords(): MeasureWord[] {
  const out: MeasureWord[] = [];
  for (const m of lessonMetas) {
    for (const w of m.lesson.measureWords ?? []) out.push(w);
  }
  return out;
}
export function getMeasureWordsByCategory(): Record<string, MeasureWord[]> {
  const cats: Record<string, MeasureWord[]> = {};
  for (const w of getMeasureWords()) {
    (cats[w.productCategory] ??= []).push(w);
  }
  return cats;
}

// ---------- search ----------

function norm(s: string): string {
  // strip combining diacritics so "ho chieu" matches "hộ chiếu" and
  // "erweima" matches "èrwéimǎ" — codepoint filter avoids regex-literal issues
  let out = "";
  for (const ch of s.toLowerCase().normalize("NFD")) {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 0x300 && c <= 0x36f) continue; // combining diacritical marks
    out += ch;
  }
  return out;
}

type IndexEntry = SearchResult & { hay: string };
let searchIndex: IndexEntry[] | null = null;

function buildSearchIndex(): IndexEntry[] {
  if (searchIndex) return searchIndex;
  const idx: IndexEntry[] = [];
  for (const m of lessonMetas) {
    for (const v of m.lesson.vocabulary ?? []) {
      idx.push({
        type: "vocabulary",
        id: v.id,
        zh: v.hanzi,
        pinyin: v.pinyin,
        vi: v.meaningVi,
        extra: v.meaningEn,
        audioText: v.audioText ?? v.hanzi,
        lessonId: m.lesson.id,
        status: v.status,
        riskLevel: v.riskLevel,
        hay: norm([v.hanzi, v.pinyin, v.meaningVi, v.meaningEn, ...(v.tags ?? [])].filter(Boolean).join(" ")),
      });
    }
    for (const s of m.lesson.sentencePatterns ?? []) {
      idx.push({
        type: "phrase",
        id: s.id,
        zh: s.zh,
        pinyin: s.pinyin,
        vi: s.vi,
        extra: s.usageVi,
        audioText: s.audioText ?? s.zh,
        lessonId: m.lesson.id,
        status: s.status,
        riskLevel: s.riskLevel,
        hay: norm([s.zh, s.pinyin, s.vi, s.usageVi, ...(s.tags ?? [])].filter(Boolean).join(" ")),
      });
    }
    for (const w of m.lesson.measureWords ?? []) {
      idx.push({
        type: "measure_word",
        id: w.id,
        zh: w.hanzi,
        pinyin: w.pinyin,
        vi: w.usesForVi,
        audioText: w.hanzi,
        lessonId: m.lesson.id,
        status: w.status,
        hay: norm([w.hanzi, w.pinyin, w.usesForVi].filter(Boolean).join(" ")),
      });
    }
    for (const d of m.lesson.dialogues ?? []) {
      for (const line of d.lines ?? []) {
        idx.push({
          type: "dialogue",
          id: `${d.id}:${line.zh}`,
          zh: line.zh,
          pinyin: line.pinyin,
          vi: line.vi,
          extra: d.titleVi,
          audioText: line.zh,
          lessonId: m.lesson.id,
          hay: norm([line.zh, line.pinyin, line.vi].filter(Boolean).join(" ")),
        });
      }
    }
  }
  for (const b of getBrands()) {
    idx.push({
      type: "brand",
      id: b.id,
      zh: b.hanzi,
      pinyin: b.pinyin,
      vi: b.latinName,
      extra: b.noteVi ?? b.origin,
      audioText: b.audioText ?? b.hanzi,
      status: b.status,
      hay: norm([b.latinName, b.hanzi, b.pinyin, b.origin].filter(Boolean).join(" ")),
    });
  }
  searchIndex = idx;
  return idx;
}

export function searchContent(query: string, limit = 60): SearchResult[] {
  const q = norm(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const idx = buildSearchIndex();
  const hits = idx.filter((e) => terms.every((t) => e.hay.includes(t)));
  return hits.slice(0, limit).map((e) => ({
    type: e.type,
    id: e.id,
    zh: e.zh,
    pinyin: e.pinyin,
    vi: e.vi,
    extra: e.extra,
    audioText: e.audioText,
    lessonId: e.lessonId,
    status: e.status,
    riskLevel: e.riskLevel,
  }));
}

// ---------- stats ----------

const itemCategoryById = new Map<string, string>();
for (const m of lessonMetas) {
  for (const v of m.lesson.vocabulary ?? []) itemCategoryById.set(v.id, m.lesson.category);
  for (const s of m.lesson.sentencePatterns ?? []) itemCategoryById.set(s.id, m.lesson.category);
}

export function getReviewStats(
  progress: ProgressData,
  flashcards: FlashcardStore,
  attempts: QuizAttempt[]
): ReviewStats {
  const validLessonIds = new Set(getAllLessonIds());
  const lessonsCompleted = progress.completedLessonIds.filter((id) => validLessonIds.has(id)).length;
  const dayOne = getDayOneLesson();
  const dayOneTotal = dayOne ? (dayOne.sentencePatterns ?? []).length : 0;
  const dayOneCompleted = dayOne
    ? (dayOne.sentencePatterns ?? []).filter((p) => progress.completedPhraseIds.includes(p.id)).length
    : 0;
  const cardsReviewed = Object.values(flashcards).filter((f) => f && f.seen > 0).length;
  const quizTotal = attempts.length;
  const quizCorrect = attempts.filter((a) => a.correct).length;
  const quizAccuracy = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0;
  return {
    lessonsCompleted,
    lessonsTotal: lessonMetas.length,
    dayOneCompleted,
    dayOneTotal,
    cardsReviewed,
    hardWords: progress.hardItemIds.length,
    quizTotal,
    quizCorrect,
    quizAccuracy,
    streak: progress.streak,
    lastStudyDate: progress.lastStudyDate,
  };
}

export function getDifficultCategories(
  attempts: QuizAttempt[]
): { category: string; wrong: number }[] {
  const counts: Record<string, number> = {};
  for (const a of attempts) {
    if (a.correct) continue;
    const cat = (a.generatedFrom && itemCategoryById.get(a.generatedFrom)) || "khác";
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([category, wrong]) => ({ category, wrong }))
    .sort((a, b) => b.wrong - a.wrong);
}
