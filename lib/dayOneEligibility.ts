// Server-side Day-One certificate eligibility.
//
// SOURCE OF TRUTH: Supabase tables (phrase_progress, voice_attempts, profiles)
// filtered by Day-One's lesson_id. NEVER reads localStorage.
//
// Phase 2A.4 deliberately keeps eligibility check on the server:
//   - phrase_progress.learned filtered to lesson_id = DAY_ONE_LESSON_ID
//   - voice_attempts.result IN ('pass','manual') joined to Day-One phrase_ids
//   - profiles.best_quiz_score (global; for pilot this is effectively Day-One
//     since Day-One is the primary quiz path — documented limitation; can be
//     scoped per-lesson in a future migration if/when other lesson quizzes
//     are actually used in production).
//
// IMPORTANT: ts-ignore on the supabase client type — callers pass a server
// client from lib/supabase/server.ts, which Next infers without DB types here.

import type { SupabaseClient } from "@supabase/supabase-js";

export const DAY_ONE_LESSON_ID = "lesson_day_one_10_phrases";

export const DAY_ONE_REQUIREMENTS = {
  // Out of 10 Day-One phrases, learner must have toggled "đã thuộc" on all 10.
  phrasesLearnedTarget: 10,
  // Out of 10 Day-One phrases, learner must have a 'pass' or 'manual' on >= 8
  // distinct phrases. Mirrors the soft target in VoiceGateSummary.
  voicePassedTarget: 8,
  // Best quiz score (0–100). Global aggregate; pilot has Day-One quizzes only.
  bestQuizScoreTarget: 70,
  // Total Day-One phrases (used for "x/10" copy).
  totalPhrases: 10,
} as const;

export type DayOneEligibility = {
  phrasesLearned: number;
  voicePassed: number;
  bestQuizScore: number;
  totalPhrases: number;
  requirements: typeof DAY_ONE_REQUIREMENTS;
  /** True iff all three thresholds are met. Single source of truth for cert. */
  eligible: boolean;
  /** Per-requirement booleans, useful for the next-action ladder. */
  met: {
    phrasesLearned: boolean;
    voicePassed: boolean;
    bestQuizScore: boolean;
  };
  /** UTC ISO timestamp of the most recent action that made the user eligible. */
  earliestEligibleAt: string | null;
};

/**
 * Compute Day-One eligibility for the currently-authenticated user. The
 * supabase server client is RLS-scoped to the user, so the queries below are
 * implicitly filtered by user_id = auth.uid().
 *
 * Returns zeros for everything if any query fails — fail closed, never grant
 * the certificate on a transient error.
 */
export async function computeDayOneEligibility(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", any>
): Promise<DayOneEligibility> {
  const reqs = DAY_ONE_REQUIREMENTS;

  // 1. Distinct Day-One phrases the user has learned.
  //    phrase_progress is per-(user, phrase) with `learned` boolean and
  //    `lesson_id`. RLS already restricts to user_id = auth.uid().
  const phrasesLearnedPromise = supabase
    .from("phrase_progress")
    .select("phrase_id", { count: "exact", head: true })
    .eq("lesson_id", DAY_ONE_LESSON_ID)
    .eq("learned", true);

  // 2. Distinct Day-One phrases the user has passed (or manually marked) on
  //    voice. We pull rows and de-dup client-side; "head + count" would count
  //    all rows including retries.
  const voiceRowsPromise = supabase
    .from("voice_attempts")
    .select("phrase_id, result, created_at")
    .eq("lesson_id", DAY_ONE_LESSON_ID)
    .in("result", ["pass", "manual"]);

  // 3. Best quiz score (global aggregate on profile).
  const profilePromise = supabase
    .from("profiles")
    .select("best_quiz_score")
    .maybeSingle();

  const [phrasesLearnedRes, voiceRowsRes, profileRes] = await Promise.all([
    phrasesLearnedPromise,
    voiceRowsPromise,
    profilePromise,
  ]);

  const phrasesLearned = phrasesLearnedRes.count ?? 0;

  const voiceRows = (voiceRowsRes.data ?? []) as Array<{
    phrase_id: string;
    result: string;
    created_at: string;
  }>;
  const distinctVoicePhrases = new Set(voiceRows.map((r) => r.phrase_id));
  const voicePassed = distinctVoicePhrases.size;

  const bestQuizScore = Number(profileRes.data?.best_quiz_score ?? 0);

  const met = {
    phrasesLearned: phrasesLearned >= reqs.phrasesLearnedTarget,
    voicePassed: voicePassed >= reqs.voicePassedTarget,
    bestQuizScore: bestQuizScore >= reqs.bestQuizScoreTarget,
  };
  const eligible = met.phrasesLearned && met.voicePassed && met.bestQuizScore;

  // Best-effort earliest-eligible timestamp: the most recent voice pass that
  // tipped the user over the voice threshold. Not used for trust — purely a
  // "Hoàn thành lúc:" label on the certificate.
  let earliestEligibleAt: string | null = null;
  if (eligible) {
    // Sort voice rows ascending by created_at, take the row that pushed the
    // distinct-phrase count to >= target — that's our "passed-the-bar" moment.
    const sorted = [...voiceRows].sort((a, b) =>
      a.created_at < b.created_at ? -1 : 1
    );
    const seen = new Set<string>();
    for (const r of sorted) {
      seen.add(r.phrase_id);
      if (seen.size >= reqs.voicePassedTarget) {
        earliestEligibleAt = r.created_at;
        break;
      }
    }
  }

  return {
    phrasesLearned,
    voicePassed,
    bestQuizScore,
    totalPhrases: reqs.totalPhrases,
    requirements: reqs,
    eligible,
    met,
    earliestEligibleAt,
  };
}
