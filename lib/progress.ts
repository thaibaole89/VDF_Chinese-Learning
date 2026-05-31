"use client";

// Progress facade — Phase 2A.3.
//
// Pattern: local-first, server-mirror. Every write hits localStorage immediately
// (synchronously, so the UI updates without latency); if a Supabase session
// exists, the same write fires the matching RPC in the background. For voice
// the function AWAITS the RPC because the server is the source of truth for
// the score (client-side scoring is just for instant feedback).
//
// Components keep importing localStorage helpers from @/lib/storage for reads
// and for the still-local concerns (flashcards, hard-item flags). For writes
// that need to mirror to the server, components import from THIS file.

import { createClient } from "@/lib/supabase/client";
import * as Storage from "@/lib/storage";
import type { ProgressData, VoiceResult, VoicePracticeRecord } from "@/lib/types";

// ---------- Singleton Supabase client + cached auth state ----------

type SupabaseClient = ReturnType<typeof createClient>;

let _sb: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!_sb) _sb = createClient();
  return _sb;
}

let _isAuth = false;
let _authResolved = false;
let _userId: string | null = null;

if (typeof window !== "undefined") {
  // Initial probe — Supabase persists the session in localStorage so this is fast.
  sb()
    .auth.getSession()
    .then(({ data }) => {
      _isAuth = !!data.session;
      _userId = data.session?.user?.id ?? null;
      _authResolved = true;
    })
    .catch(() => {
      _authResolved = true;
    });
  // Keep _isAuth current as the user logs in / out within this tab.
  sb().auth.onAuthStateChange((_event, session) => {
    _isAuth = !!session;
    _userId = session?.user?.id ?? null;
  });
}

export function isAuthenticated(): boolean {
  return _isAuth;
}
export function authResolved(): boolean {
  return _authResolved;
}
export function currentUserId(): string | null {
  return _userId;
}

// ---------- Fire-and-forget helper ----------

function fireRPC(name: string, p: PromiseLike<{ error: { message?: string } | null }>): void {
  Promise.resolve(p)
    .then(({ error }) => {
      if (error && typeof console !== "undefined") {
        console.warn(`[progress] ${name} failed:`, error.message ?? error);
      }
    })
    .catch((err: unknown) => {
      if (typeof console !== "undefined") {
        const msg =
          err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : String(err);
        console.warn(`[progress] ${name} threw:`, msg);
      }
    });
}

// ---------- Write-through actions ----------

/** Toggle "phrase learned" locally + mirror to server. Returns the new local ProgressData. */
export function togglePhraseLearned(phraseId: string): ProgressData {
  const next = Storage.togglePhraseComplete(phraseId);
  const learned = next.completedPhraseIds.includes(phraseId);
  if (_isAuth) {
    fireRPC(
      "mark_phrase_learned",
      sb().rpc("mark_phrase_learned", { p_phrase_id: phraseId, p_learned: learned })
    );
  }
  return next;
}

/** Set "lesson complete" to a specific boolean locally + mirror to server. */
export function setLessonComplete(lessonId: string, completed: boolean): ProgressData {
  const next = Storage.setLessonComplete(lessonId, completed);
  if (_isAuth) {
    fireRPC(
      "mark_lesson_complete",
      sb().rpc("mark_lesson_complete", { p_lesson_id: lessonId, p_completed: completed })
    );
  }
  return next;
}

/**
 * Record a single quiz attempt locally. Does NOT touch the server — server
 * scoring is per-session, see recordQuizSession.
 */
export function recordQuizAttempt(quizId: string, correct: boolean, generatedFrom?: string): void {
  Storage.recordQuizAttempt(quizId, correct, generatedFrom);
}

/**
 * Submit a finished quiz session (lesson_id + correct/total) to the server so
 * profile.best_quiz_score can be updated. Pages call this once when the batch
 * is fully answered. Local quiz attempts have already been recorded.
 */
export function recordQuizSession(args: {
  lessonId: string;
  correctCount: number;
  totalCount: number;
  quizId?: string;
}): void {
  if (!_isAuth) return;
  if (!args.totalCount || args.totalCount <= 0) return;
  fireRPC(
    "submit_quiz_attempt",
    sb().rpc("submit_quiz_attempt", {
      p_quiz_id: args.quizId ?? "session",
      p_lesson_id: args.lessonId,
      p_correct_count: args.correctCount,
      p_total_count: args.totalCount,
    })
  );
}

// ---------- Voice ----------

/**
 * Save a voice attempt: write locally with client-computed values first (for
 * instant feedback), then — if authenticated — call the RPC which computes its
 * own score and overwrites the local row with the server's truth.
 */
export async function submitVoiceAttempt(args: {
  phraseId: string;
  lessonId?: string;
  zh: string;
  transcript?: string;
  manual?: boolean;
  /** Client-computed score for instant UI before the RPC returns. */
  clientScore?: number;
  /** Client-computed result for instant UI. Must be one of pass/near/retry. */
  clientResult?: VoiceResult;
}): Promise<{ score: number; result: VoiceResult; record?: VoicePracticeRecord }> {
  const isManual = args.manual === true;
  const localResult: VoiceResult = isManual ? "manual" : args.clientResult ?? "retry";
  const localScore = isManual ? undefined : args.clientScore;

  Storage.saveVoicePracticeRecord({
    phraseId: args.phraseId,
    lessonId: args.lessonId,
    zh: args.zh,
    transcript: isManual ? undefined : args.transcript,
    score: localScore,
    result: localResult,
  });

  if (!_isAuth) {
    return {
      score: localScore ?? 0,
      result: localResult,
      record: Storage.getVoicePracticeRecord(args.phraseId),
    };
  }

  try {
    const { data, error } = await sb().rpc("submit_voice_attempt", {
      p_phrase_id: args.phraseId,
      p_lesson_id: args.lessonId ?? null,
      p_transcript: isManual ? null : args.transcript ?? null,
      p_manual: isManual,
    });
    if (error) {
      console.warn("[progress] submit_voice_attempt failed:", error.message);
      return {
        score: localScore ?? 0,
        result: localResult,
        record: Storage.getVoicePracticeRecord(args.phraseId),
      };
    }
    const row = (data as Array<{ score: number; result: string }> | null)?.[0];
    if (!row) {
      return {
        score: localScore ?? 0,
        result: localResult,
        record: Storage.getVoicePracticeRecord(args.phraseId),
      };
    }
    const serverResult: VoiceResult =
      row.result === "pass" || row.result === "near" || row.result === "retry" || row.result === "manual"
        ? row.result
        : "retry";
    // Overwrite local with server values so re-read is consistent.
    Storage.saveVoicePracticeRecord({
      phraseId: args.phraseId,
      lessonId: args.lessonId,
      zh: args.zh,
      transcript: isManual ? undefined : args.transcript,
      score: isManual ? undefined : row.score,
      result: serverResult,
    });
    return {
      score: row.score ?? 0,
      result: serverResult,
      record: Storage.getVoicePracticeRecord(args.phraseId),
    };
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : String(err);
    console.warn("[progress] submit_voice_attempt threw:", msg);
    return {
      score: localScore ?? 0,
      result: localResult,
      record: Storage.getVoicePracticeRecord(args.phraseId),
    };
  }
}

// ---------- Aggregates (server) ----------

export type ServerStats = {
  bestQuizScore: number;
  voicePassCount: number;
  phraseLearnedCount: number;
};

export async function fetchServerStats(): Promise<ServerStats | null> {
  if (!_isAuth) return null;
  try {
    const { data, error } = await sb()
      .from("profiles")
      .select("best_quiz_score, voice_pass_count, phrase_learned_count")
      .maybeSingle();
    if (error || !data) return null;
    return {
      bestQuizScore: Number(data.best_quiz_score ?? 0),
      voicePassCount: Number(data.voice_pass_count ?? 0),
      phraseLearnedCount: Number(data.phrase_learned_count ?? 0),
    };
  } catch {
    return null;
  }
}

// ---------- One-shot localStorage → server push ----------

export type SyncSummary = {
  phrasesPushed: number;
  phrasesFailed: number;
  lessonsPushed: number;
  lessonsFailed: number;
  skipped: { voice: number; quiz: number };
};

/**
 * Push the user's localStorage progress to the server in one shot. Currently
 * pushes phrase-learned + lesson-complete only. Voice attempts and quiz
 * attempts are intentionally skipped because their server scoring/aggregation
 * shapes differ from local logs.
 */
export async function syncLocalToServer(): Promise<SyncSummary> {
  const summary: SyncSummary = {
    phrasesPushed: 0,
    phrasesFailed: 0,
    lessonsPushed: 0,
    lessonsFailed: 0,
    skipped: {
      voice: Object.keys(Storage.getVoicePracticeRecords()).length,
      quiz: Storage.getQuizAttempts().length,
    },
  };
  if (!_isAuth) return summary;
  const p = Storage.getProgress();
  for (const phraseId of p.completedPhraseIds) {
    try {
      const { error } = await sb().rpc("mark_phrase_learned", {
        p_phrase_id: phraseId,
        p_learned: true,
      });
      if (error) summary.phrasesFailed++;
      else summary.phrasesPushed++;
    } catch {
      summary.phrasesFailed++;
    }
  }
  for (const lessonId of p.completedLessonIds) {
    try {
      const { error } = await sb().rpc("mark_lesson_complete", {
        p_lesson_id: lessonId,
        p_completed: true,
      });
      if (error) summary.lessonsFailed++;
      else summary.lessonsPushed++;
    } catch {
      summary.lessonsFailed++;
    }
  }
  return summary;
}

/**
 * Wipe the user's server progress rows (does NOT touch localStorage — caller
 * usually wipes that separately via storage.ts).
 */
export async function clearServerProgress(): Promise<void> {
  if (!_isAuth) return;
  const uid = _userId;
  if (!uid) return;
  try {
    await sb().from("lesson_progress").delete().eq("user_id", uid);
    await sb().from("phrase_progress").delete().eq("user_id", uid);
    await sb().from("voice_attempts").delete().eq("user_id", uid);
    // Reset aggregates on profile (the only column-grantable here would be
    // none for these, so use an RPC if added later; for now best-effort via
    // the trigger on update of voice_attempts. We can attempt direct UPDATE
    // but column grant blocks. Skip — aggregates will recompute when new
    // events arrive.)
  } catch (err) {
    console.warn("[progress] clearServerProgress threw:", err);
  }
}
