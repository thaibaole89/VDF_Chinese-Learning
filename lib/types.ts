// lib/types.ts — app-side content + progress types.
// Mirrors content/schema.ts (the content single-source-of-truth) so the UI is
// decoupled from the JSON files. No new content is defined here.

export type ContentStatus = "from_source" | "authored" | "needs_review";
export type RiskLevel = "safe" | "use_with_care" | "avoid_for_customer";
export type Register = "friendly" | "polite" | "sales" | "firm" | "emergency";
export type Priority = "must_know" | "useful" | "advanced";
export type DisplayMode = "flashcard" | "reference_only" | "quiz_ready";

export type SourceRef = {
  sourceType: "image" | "video" | "doc" | "authored";
  assetPath?: string;
  folder?: string;
  slideTitle?: string;
  itemNumber?: number;
  mediaTimestamp?: string;
  note?: string;
};

export type Example = { zh: string; pinyin: string; vi?: string; en?: string };
export type Gloss = { hanzi?: string; pinyin: string; meaningVi: string };

export type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  meaningEn?: string;
  productCategory?: string;
  examples?: Example[];
  tags: string[];
  audioText?: string;
  priority: Priority;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
  displayMode?: DisplayMode;
  riskLevel?: RiskLevel;
  noteVi?: string;
};

export type SentencePattern = {
  id: string;
  zh: string;
  pinyin: string;
  vi: string;
  en?: string;
  usageVi: string;
  register: Register;
  focusWords?: string[];
  gloss?: Gloss[];
  tags: string[];
  audioText?: string;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
  riskLevel?: RiskLevel;
  customerFacing?: boolean;
  noteVi?: string;
};

export type MeasureWord = {
  id: string;
  hanzi: string;
  pinyin: string;
  usesForVi: string;
  productCategory: "beauty" | "liquor_tobacco_sweets" | "fashion" | "general";
  examples: Example[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type BrandReference = {
  id: string;
  latinName: string;
  hanzi: string;
  pinyin: string;
  category: "beauty" | "liquor" | "tobacco";
  origin?: string;
  noteVi?: string;
  audioText?: string;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type DialogueLine = {
  speaker: "staff" | "customer";
  zh: string;
  pinyin: string;
  vi: string;
  gloss?: Gloss[];
  noteVi?: string;
  speed?: "slow" | "normal";
  repeatAfterMe?: boolean;
};

export type Dialogue = {
  id: string;
  titleVi: string;
  scenarioVi: string;
  lines: DialogueLine[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type QuizType =
  | "meaning_mcq"
  | "hanzi_to_pinyin"
  | "listening_mcq"
  | "fill_pinyin"
  | "choose_reply";

export type QuizQuestion = {
  id: string;
  type: QuizType;
  promptVi: string;
  promptZh?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  explanationVi?: string;
  generatedFrom?: string;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type RoleplayScenario = {
  id: string;
  titleVi: string;
  scenarioVi: string;
  customerGoalVi: string;
  staffGoalVi: string;
  requiredPhrases: string[];
  sampleDialogueId?: string;
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type Lesson = {
  id: string;
  titleVi: string;
  titleZh?: string;
  level: "starter" | "basic" | "sales" | "advanced";
  estimatedMinutes: number;
  category: string;
  objectiveVi: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  measureWords?: MeasureWord[];
  dialogues: Dialogue[];
  roleplays: RoleplayScenario[];
  quizzes: QuizQuestion[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
  salesStage?: string;
  requiredForDayOne?: boolean;
  reviewPriority?: 1 | 2 | 3;
};

export type Track = "foundation" | "sales_flow" | "product" | "reference";

export type Course = {
  id: string;
  track: Track;
  titleVi: string;
  descriptionVi: string;
  lessons: Lesson[];
};

export type ReferenceTable = {
  id: string;
  titleVi: string;
  type: "brand" | "number" | "color" | "measure_word";
  descriptionVi?: string;
  brands?: BrandReference[];
  vocab?: VocabularyItem[];
  sourceRefs?: SourceRef[];
};

// ---------- app-only derived types ----------

export type FlashItem = {
  id: string;
  kind: "vocab" | "pattern";
  zh: string;
  pinyin: string;
  vi: string;
  note?: string;
  priority: Priority;
  status: ContentStatus;
  riskLevel?: RiskLevel;
  lessonId: string;
  isDayOne: boolean;
};

export type SearchResultType = "vocabulary" | "phrase" | "brand" | "measure_word" | "dialogue";

export type SearchResult = {
  type: SearchResultType;
  id: string;
  zh: string;
  pinyin: string;
  vi: string;
  extra?: string;
  audioText?: string;
  lessonId?: string;
  status?: ContentStatus;
  riskLevel?: RiskLevel;
};

export type QuizWithContext = QuizQuestion & {
  lessonId: string;
  courseId: string;
  category: string;
};

export type RoleplayWithContext = RoleplayScenario & { lessonId: string };

export type LessonMeta = {
  lesson: Lesson;
  courseId: string;
  courseTitleVi: string;
  track: Track;
  fileKey: string;
};

export type LessonGroup = {
  id: string;
  titleVi: string;
  lessons: LessonMeta[];
};

// ---------- progress (localStorage) ----------

export type FlashcardState = { ease: number; seen: number; correct: number; lastSeen: number };
export type FlashcardStore = Record<string, FlashcardState>;

export type QuizAttempt = {
  quizId: string;
  generatedFrom?: string;
  correct: boolean;
  at: number;
};

export type ProgressData = {
  completedLessonIds: string[];
  completedPhraseIds: string[];
  hardItemIds: string[];
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
};

export type ReviewStats = {
  lessonsCompleted: number;
  lessonsTotal: number;
  dayOneCompleted: number;
  dayOneTotal: number;
  cardsReviewed: number;
  hardWords: number;
  quizTotal: number;
  quizCorrect: number;
  quizAccuracy: number; // 0..100
  streak: number;
  lastStudyDate: string | null;
};

// ---------- voice practice (browser speech recognition; localStorage) ----------

export type VoiceResult = "pass" | "near" | "retry" | "manual";

export type VoicePracticeRecord = {
  phraseId: string;
  lessonId?: string;
  zh: string;
  transcript?: string;
  score?: number;
  result: VoiceResult;
  practicedAt: string;
  attempts: number;
  bestScore?: number;
  bestTranscript?: string;
};

export type VoicePracticeStore = Record<string, VoicePracticeRecord>;

export type VoicePracticeSummary = {
  practiced: number;
  passed: number; // pass or manual
  attempts: number;
};
