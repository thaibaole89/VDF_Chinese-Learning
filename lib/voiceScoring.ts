// lib/voiceScoring.ts — SOFT matching of a recognition transcript against the
// expected Chinese phrase. This is a recognition result, NOT pronunciation
// accuracy / tone scoring. Keep it explainable.

export type VoiceScoreResult = "pass" | "near" | "retry" | "unsupported" | "manual";

export type VoiceScore = {
  result: VoiceScoreResult;
  score: number; // 0–100
  matchedKeywords: string[];
  missingKeywords: string[];
  transcript: string;
  feedbackVi: string;
};

export const FEEDBACK_VI = {
  pass: "Tốt, hệ thống đã nhận ra phần chính của câu.",
  near: "Gần đúng rồi, thử đọc chậm hơn một lần nữa.",
  retry: "Chưa nhận ra đủ ý chính. Hãy nghe mẫu và thử lại.",
};

// VDF-context important terms (used as keywords when present in the phrase).
const IMPORTANT_TERMS = [
  "您好", "欢迎光临", "护照", "登机牌", "免税", "价格", "付款", "支付", "小票",
  "没有货", "推荐", "旅途愉快", "支付宝", "微信支付", "银联卡", "二维码", "现金",
  "刷卡", "扫码", "品牌", "香水", "化妆品", "口红", "面霜", "威士忌", "香烟", "巧克力",
];

function onlyChinese(s: string): string {
  let o = "";
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3400 && c <= 0x4dbf)) o += ch;
  }
  return o;
}

function dedupe(a: string[]): string[] {
  return [...new Set(a)];
}

export function extractChineseKeywords(zh: string): string[] {
  const han = onlyChinese(zh);
  if (!han) return [];
  const found = IMPORTANT_TERMS.filter((t) => han.includes(t));
  if (found.length) return dedupe(found).slice(0, 5);
  // No important terms: short phrase = itself; otherwise rough 2-char chunks.
  if (han.length <= 4) return [han];
  const chunks: string[] = [];
  for (let i = 0; i < han.length - 1; i += 2) chunks.push(han.slice(i, i + 2));
  return dedupe(chunks).slice(0, 5);
}

// Ratio of expected characters that appear anywhere in the transcript.
function charOverlapRatio(expected: string, transcript: string): number {
  if (!expected) return 0;
  const set = new Set([...transcript]);
  let hit = 0;
  for (const ch of expected) if (set.has(ch)) hit++;
  return hit / expected.length;
}

export function scoreVoice(
  expected: { id: string; zh: string; pinyin?: string; vi?: string },
  transcript: string,
  keyTerms?: string[]
): VoiceScore {
  const expHan = onlyChinese(expected.zh);
  const tHan = onlyChinese(transcript);
  const keywords = keyTerms && keyTerms.length ? keyTerms : extractChineseKeywords(expected.zh);
  const matchedKeywords = keywords.filter((k) => tHan.includes(k));
  const missingKeywords = keywords.filter((k) => !tHan.includes(k));
  const kwCoverage = keywords.length ? matchedKeywords.length / keywords.length : 0;
  const overlap = charOverlapRatio(expHan, tHan);

  // Short phrases: char overlap matters more. Long phrases: keyword coverage.
  const isShort = expHan.length <= 4;
  const raw = isShort ? 0.7 * overlap + 0.3 * kwCoverage : 0.4 * overlap + 0.6 * kwCoverage;
  const score = Math.max(0, Math.min(100, Math.round(raw * 100)));

  let result: VoiceScoreResult;
  let feedbackVi: string;
  if (score >= 70) {
    result = "pass";
    feedbackVi = FEEDBACK_VI.pass;
  } else if (score >= 45) {
    result = "near";
    feedbackVi = FEEDBACK_VI.near;
  } else {
    result = "retry";
    feedbackVi = FEEDBACK_VI.retry;
  }
  return { result, score, matchedKeywords, missingKeywords, transcript, feedbackVi };
}
