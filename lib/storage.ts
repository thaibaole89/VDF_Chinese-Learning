// lib/storage.ts — localStorage-backed progress. Client-side only.
// Every read is wrapped in try/catch and falls back to safe defaults so a
// corrupted value never crashes the app.

import type {
  ProgressData,
  FlashcardStore,
  FlashcardState,
  QuizAttempt,
  VoicePracticeRecord,
  VoicePracticeStore,
  VoicePracticeSummary,
  VoiceResult,
} from "@/lib/types";

export const KEY_PROGRESS = "vdf_chinese_progress";
export const KEY_FLASHCARDS = "vdf_chinese_flashcards";
export const KEY_QUIZ = "vdf_chinese_quiz_attempts";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / disabled — ignore */
  }
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

export function defaultProgress(): ProgressData {
  return {
    completedLessonIds: [],
    completedPhraseIds: [],
    hardItemIds: [],
    streak: 0,
    lastStudyDate: null,
  };
}

export function getProgress(): ProgressData {
  const p = read<Partial<ProgressData>>(KEY_PROGRESS, {});
  return {
    completedLessonIds: arr(p.completedLessonIds),
    completedPhraseIds: arr(p.completedPhraseIds),
    hardItemIds: arr(p.hardItemIds),
    streak: typeof p.streak === "number" && p.streak >= 0 ? p.streak : 0,
    lastStudyDate: typeof p.lastStudyDate === "string" ? p.lastStudyDate : null,
  };
}

export function saveProgress(p: ProgressData): void {
  write(KEY_PROGRESS, p);
}

export function getFlashcards(): FlashcardStore {
  const f = read<FlashcardStore>(KEY_FLASHCARDS, {});
  return f && typeof f === "object" ? f : {};
}

export function saveFlashcards(f: FlashcardStore): void {
  write(KEY_FLASHCARDS, f);
}

export function getQuizAttempts(): QuizAttempt[] {
  const a = read<QuizAttempt[]>(KEY_QUIZ, []);
  return Array.isArray(a) ? a : [];
}

export function saveQuizAttempts(a: QuizAttempt[]): void {
  write(KEY_QUIZ, a);
}

// ---------- streak ----------

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

/** Call on any study action. Updates streak + lastStudyDate. Returns new progress. */
export function touchStreak(p?: ProgressData): ProgressData {
  const progress = p ?? getProgress();
  const today = todayStr();
  if (progress.lastStudyDate === today) {
    return progress; // already counted today
  }
  if (progress.lastStudyDate && daysBetween(progress.lastStudyDate, today) === 1) {
    progress.streak = progress.streak + 1;
  } else {
    progress.streak = 1;
  }
  progress.lastStudyDate = today;
  saveProgress(progress);
  return progress;
}

// ---------- mutations ----------

function toggleIn(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function setLessonComplete(id: string, done = true): ProgressData {
  const p = getProgress();
  const has = p.completedLessonIds.includes(id);
  if (done && !has) p.completedLessonIds.push(id);
  if (!done && has) p.completedLessonIds = p.completedLessonIds.filter((x) => x !== id);
  saveProgress(p);
  touchStreak(p);
  return getProgress();
}

export function togglePhraseComplete(id: string): ProgressData {
  const p = getProgress();
  p.completedPhraseIds = toggleIn(p.completedPhraseIds, id);
  saveProgress(p);
  touchStreak(p);
  return getProgress();
}

export function toggleHardItem(id: string): ProgressData {
  const p = getProgress();
  p.hardItemIds = toggleIn(p.hardItemIds, id);
  saveProgress(p);
  return getProgress();
}

export function recordQuizAttempt(
  quizId: string,
  correct: boolean,
  generatedFrom?: string
): void {
  const list = getQuizAttempts();
  list.push({ quizId, correct, generatedFrom, at: Date.now() });
  // keep the log bounded
  saveQuizAttempts(list.slice(-2000));
  touchStreak();
}

const DEFAULT_EASE = 2.5;

export function gradeFlashcard(id: string, knewIt: boolean): FlashcardStore {
  const store = getFlashcards();
  const prev: FlashcardState = store[id] ?? {
    ease: DEFAULT_EASE,
    seen: 0,
    correct: 0,
    lastSeen: 0,
  };
  const ease = knewIt
    ? Math.min(3.2, prev.ease + 0.12)
    : Math.max(1.3, prev.ease - 0.3);
  store[id] = {
    ease,
    seen: prev.seen + 1,
    correct: prev.correct + (knewIt ? 1 : 0),
    lastSeen: Date.now(),
  };
  saveFlashcards(store);
  touchStreak();
  return store;
}

// ---------- voice practice ----------

export const KEY_VOICE = "vdf_chinese_voice_practice";

export function getVoicePracticeRecords(): VoicePracticeStore {
  const v = read<VoicePracticeStore>(KEY_VOICE, {});
  return v && typeof v === "object" ? v : {};
}

export function getVoicePracticeRecord(phraseId: string): VoicePracticeRecord | undefined {
  return getVoicePracticeRecords()[phraseId];
}

export function saveVoicePracticeRecord(input: {
  phraseId: string;
  lessonId?: string;
  zh: string;
  transcript?: string;
  score?: number;
  result: VoiceResult;
}): VoicePracticeStore {
  const all = getVoicePracticeRecords();
  const prev = all[input.phraseId];
  const prevBest = prev?.bestScore ?? 0;
  const score = input.score;
  const isBetter = (score ?? 0) >= prevBest;
  all[input.phraseId] = {
    phraseId: input.phraseId,
    lessonId: input.lessonId ?? prev?.lessonId,
    zh: input.zh,
    transcript: input.transcript,
    score,
    result: input.result,
    practicedAt: new Date().toISOString(),
    attempts: (prev?.attempts ?? 0) + 1,
    bestScore: Math.max(prevBest, score ?? 0),
    bestTranscript: isBetter ? input.transcript ?? prev?.bestTranscript : prev?.bestTranscript,
  };
  write(KEY_VOICE, all);
  touchStreak();
  return all;
}

export function getVoicePracticeSummary(): VoicePracticeSummary {
  const all = Object.values(getVoicePracticeRecords());
  return {
    practiced: all.length,
    passed: all.filter((r) => r.result === "pass" || r.result === "manual").length,
    attempts: all.reduce((n, r) => n + (r.attempts ?? 0), 0),
  };
}

export function resetVoicePracticeRecords(): void {
  write(KEY_VOICE, {});
}
