// VDF Chinese Sales Tutor — content schema (Phase 1A)
//
// This is the single source of truth for the shape of every file in /content.
// It is content-preparation only: no app, DB, or API depends on it yet.
//
// Conventions used across the JSON files:
//   ContentStatus tells the reviewer how much we touched an item:
//     "from_source"  — Hanzi + pinyin + Vietnamese exactly as on the slide
//                      (trivial pinyin-spacing normalization aside). Vietnamese
//                      register normalization (Bạn → Quý khách) also stays
//                      "from_source" because the owner pre-approved that exact
//                      swap; a `noteVi` records it and `sourceRefs` still points
//                      to the slide.
//     "needs_review" — we changed the Mandarin (light polish for naturalness).
//                      The improved phrase is the main `zh`; `noteVi` explains
//                      the change and `sourceRefs[].note` keeps the original.
//     "authored"     — content not present on any slide. In Phase 1A this is
//                      ONLY the Vietnamese meanings added to numbers & colors
//                      (the slides were English-only).
//
//   Every leaf content item (VocabularyItem, SentencePattern, MeasureWord,
//   BrandReference) and every Lesson carries a `status`. Courses are containers
//   and intentionally have none.
//
//   Source-derived items ("from_source" / "needs_review") always carry a
//   non-empty `sourceRefs`. "authored" items may omit it (numbers/colors keep
//   one to credit the slide their Hanzi/pinyin came from).

export type Lang = { zh: string; pinyin: string; vi: string; en?: string };

export type ContentStatus = "from_source" | "authored" | "needs_review";

// Where a piece of content came from, for traceability back to the slide deck.
export type SourceRef = {
  sourceType: "image" | "video" | "doc" | "authored";
  assetPath?: string; // e.g. "các câu giao tiếp cơ bản/z7760840848950_….jpg"
  folder?: string;
  slideTitle?: string; // e.g. "CHÀO HỎI"
  itemNumber?: number;
  mediaTimestamp?: string; // "mm:ss" if traced to a video
  note?: string; // e.g. original Mandarin before polish, or "VN added in Phase 1A"
};

// Stage of the sales conversation a lesson belongs to (Counter Survival flow).
// [Phase 1A addition] drives day-one ordering of the sales_flow track.
// [Phase 1B addition] verify_documents / price_inquiry / explain_duty_free were
// added to model the P1-gap modules (passport-boarding-pass, price/discount,
// duty-free concept) accurately. Additive only; existing values unchanged.
export type SalesStage =
  | "greeting"
  | "discover_needs"
  | "recommend"
  | "bestseller"
  | "verify_documents" // [1B] passport / boarding-pass check
  | "price_inquiry" // [1B] price, discount, promotion talk
  | "explain_duty_free" // [1B] duty-free concept / tax-free price
  | "payment"
  | "verify_goods"
  | "out_of_stock"
  | "browsing"
  | "closing";

export type Course = {
  id: string;
  track: "foundation" | "sales_flow" | "product" | "reference";
  titleVi: string;
  descriptionVi: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  titleVi: string;
  titleZh?: string;
  level: "starter" | "basic" | "sales" | "advanced";
  estimatedMinutes: number; // target ~5
  category: string; // taxonomy key, e.g. "greeting", "perfume", "measure_words"
  objectiveVi: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  measureWords?: MeasureWord[];
  dialogues: Dialogue[]; // empty in Phase 1A — none in source, none authored
  roleplays: RoleplayScenario[]; // empty in Phase 1A
  quizzes: QuizQuestion[]; // empty in Phase 1A
  status: ContentStatus;
  sourceRefs?: SourceRef[];

  // [Phase 1A additions]
  salesStage?: SalesStage; // set on sales_flow lessons
  requiredForDayOne?: boolean; // true for the Counter Survival starter course
  reviewPriority?: 1 | 2 | 3; // 1 = review first (most used at the counter)
};

export type Example = { zh: string; pinyin: string; vi?: string; en?: string };

export type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  meaningEn?: string;
  productCategory?: string;
  examples?: Example[];
  tags: string[]; // ["color"], ["number"], ["address_term"], …
  audioText?: string; // defaults to hanzi
  priority: "must_know" | "useful" | "advanced";
  status: ContentStatus;
  sourceRefs?: SourceRef[];

  // [Phase 1A additions]
  displayMode?: "flashcard" | "reference_only" | "quiz_ready";
  // riskLevel: how safe a word is to use with a customer. Added so the address
  // terms 美女/帅哥/老板 can be flagged "use_with_care" while 先生/女士/您 are "safe".
  riskLevel?: "safe" | "use_with_care" | "avoid_for_customer";
  noteVi?: string;
};

export type Gloss = { hanzi?: string; pinyin: string; meaningVi: string }; // "xiǎng: muốn"

export type SentencePattern = {
  id: string;
  zh: string;
  pinyin: string;
  vi: string;
  en?: string;
  usageVi: string;
  register: "friendly" | "polite" | "sales" | "firm" | "emergency";
  focusWords?: string[]; // color-highlighted keywords on the slide
  gloss?: Gloss[];
  tags: string[];
  audioText?: string; // defaults to zh
  status: ContentStatus;
  sourceRefs?: SourceRef[];

  // [Phase 1A additions]
  riskLevel?: "safe" | "use_with_care" | "avoid_for_customer";
  customerFacing?: boolean; // true = staff says this to a customer
  // noteVi: records a Mandarin polish or a register normalization so the change
  // is never silent. Mirrors the existing noteVi on DialogueLine/BrandReference.
  noteVi?: string;
};

export type MeasureWord = {
  id: string;
  hanzi: string; // 瓶, 支, 条…
  pinyin: string;
  usesForVi: string;
  productCategory: "beauty" | "liquor_tobacco_sweets" | "fashion" | "general";
  examples: Example[];
  status: ContentStatus;
  sourceRefs?: SourceRef[];
};

export type BrandReference = {
  id: string;
  latinName: string; // "Lancôme", "Johnnie Walker"
  hanzi: string; // 兰蔻
  pinyin: string; // Lán kòu
  category: "beauty" | "liquor" | "tobacco";
  origin?: string; // "Pháp", "Mỹ", "Trung Quốc", "Quốc tế"
  noteVi?: string; // e.g. SK-II pronunciation note, or "loại rượu (generic), không phải brand"
  audioText?: string;
  // [Phase 1A addition] every item carries a status; brands are lookups copied
  // verbatim from the slides, so this is "from_source".
  status: ContentStatus;
  sourceRefs?: SourceRef[];
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

// ---- Types reserved for Phase 1B (no instances authored in Phase 1A) ----

export type DialogueLine = {
  speaker: "staff" | "customer";
  zh: string;
  pinyin: string;
  vi: string;
  gloss?: Gloss[];
  noteVi?: string;

  // [Phase 1A additions] playback hints for the future practice UI
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

export type QuizQuestion = {
  id: string;
  type:
    | "meaning_mcq"
    | "hanzi_to_pinyin"
    | "listening_mcq"
    | "fill_pinyin"
    | "choose_reply";
  promptVi: string;
  promptZh?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  explanationVi?: string;
  generatedFrom?: string; // id of the vocab/pattern it was built from
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

// Backlog of categories to author in Phase 1B (see content_gap_backlog.json).
export type ContentGap = {
  id: string;
  priority: 1 | 2 | 3;
  category: string;
  titleVi: string;
  descriptionVi: string;
  exampleNeedsVi?: string[];
  status: "backlog";
};
