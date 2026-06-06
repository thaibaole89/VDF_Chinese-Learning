// English voice scoring — word/keyword level. Phase 2C.1.
//
// Deliberately does NOT reuse the Chinese character-overlap logic (that's for
// CJK). For English: normalize (lowercase, strip punctuation/apostrophes),
// compare the phrase's important content words against the recognised
// transcript, and score by coverage. Lenient — small function words (articles,
// prepositions) are not in the important-word list, so they're never penalised.
// Client-side MVP only; no paid AI, no server call.

export type EnVoiceResult = "pass" | "retry" | "manual";

export const EN_FEEDBACK: Record<EnVoiceResult, string> = {
  pass: "Tốt! Máy nghe rõ các từ chính.",
  retry: "Gần rồi — đọc to, rõ từng từ chính rồi thử lại nhé.",
  manual: "Đã đánh dấu thủ công (dùng khi máy không hỗ trợ nhận diện).",
};

const EN_PASS_THRESHOLD = 70; // % of important words present

function normalizeWords(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .replace(/['’]/g, "") // men's -> mens
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type EnScore = {
  score: number; // 0..100
  result: EnVoiceResult;
  matched: string[];
  missing: string[];
};

/** Score a spoken English transcript against a phrase's important words. */
export function scoreEnglish(importantWords: string[], transcript: string): EnScore {
  const imp = Array.from(
    new Set(importantWords.map((w) => w.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]/g, "")).filter(Boolean))
  );
  const heard = new Set(normalizeWords(transcript));
  if (imp.length === 0) {
    return { score: transcript.trim() ? 100 : 0, result: transcript.trim() ? "pass" : "retry", matched: [], missing: [] };
  }
  const matched = imp.filter((w) => heard.has(w));
  const missing = imp.filter((w) => !heard.has(w));
  const score = Math.round((matched.length / imp.length) * 100);
  const result: EnVoiceResult = score >= EN_PASS_THRESHOLD ? "pass" : "retry";
  return { score, result, matched, missing };
}
