// Korean voice scoring — Hangul keyword level. Phase 2C.1.4.
// ko-KR STT returns Hangul; we check the lesson's Hangul keywords against the
// transcript. Client-side MVP only; no paid AI. NOT the Chinese/English scorers.

export type KoVoiceResult = "pass" | "retry" | "manual";

export const KO_FEEDBACK: Record<KoVoiceResult, string> = {
  pass: "Tốt! Máy nghe rõ các từ chính.",
  retry: "Gần rồi — đọc to, rõ từng từ chính rồi thử lại nhé.",
  manual: "Đã đánh dấu thủ công (dùng khi máy không hỗ trợ nhận diện).",
};

const KO_PASS_THRESHOLD = 60; // % of important Hangul keywords present

function stripNonHangul(s: string): string {
  // keep Hangul syllables + jamo, drop everything else (spaces, punctuation, latin)
  return (s || "").replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
}

export type KoScore = { score: number; result: KoVoiceResult; matched: string[]; missing: string[] };

export function scoreKorean(importantWords: string[], transcript: string): KoScore {
  const imp = Array.from(new Set(importantWords.map((w) => stripNonHangul(w)).filter(Boolean)));
  const heard = stripNonHangul(transcript);
  if (imp.length === 0) {
    const ok = heard.length > 0;
    return { score: ok ? 100 : 0, result: ok ? "pass" : "retry", matched: [], missing: [] };
  }
  const matched = imp.filter((w) => heard.includes(w));
  const missing = imp.filter((w) => !heard.includes(w));
  const score = Math.round((matched.length / imp.length) * 100);
  return { score, result: score >= KO_PASS_THRESHOLD ? "pass" : "retry", matched, missing };
}
