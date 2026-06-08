// Shared grammar-tip type. Phase 2C.1.6.
//
// Grammar / sentence-building tips so learners understand the PATTERN behind the
// phrases (and can swap words to build their own sentences), instead of only
// memorising fixed sentences. Authored per course in lib/<lang>Grammar.ts and
// rendered by components/GrammarTips.tsx.

export type GrammarExample = {
  /** Target-language text (Hanzi / English / Hangul). */
  text: string;
  /** Optional reading aid (pinyin / romanization). */
  gloss?: string;
  /** Vietnamese meaning. */
  vi: string;
};

export type GrammarTip = {
  /** Short Vietnamese title, e.g. "Khung câu mời giúp". */
  titleVi: string;
  /** Vietnamese explanation of the rule / how to build the sentence. */
  bodyVi: string;
  /** A reusable sentence frame, e.g. "May I + [động từ] + ...?" */
  pattern?: string;
  /** 1–3 worked examples applying the pattern. */
  examples?: GrammarExample[];
};
