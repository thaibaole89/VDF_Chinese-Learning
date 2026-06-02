// Weekly Hall of Fame fetch helper. Phase 2B.3.
//
// Calls the SECURITY DEFINER RPC get_weekly_leaderboard() (migration 003).
// Server-only — invoked from the /hall-of-fame server component with an
// RLS-scoped server client. The RPC itself returns server-trusted, email-free
// rows for every staff member.
//
// Scoring weights are mirrored here ONLY for the UI info box; the authoritative
// computation lives in SQL. Keep in sync with 003_phase_2b_leaderboard.sql.

import type { SupabaseClient } from "@supabase/supabase-js";

export const SCORING = {
  requiredLessonPoints: 20,
  optionalLessonPoints: 10,
  voicePassPoints: 5,
  dayOneCertBonus: 100,
  quizMaxPoints: 100,
} as const;

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  store: string | null;
  weeklyScore: number;
  completedRequiredCount: number;
  voicePassCount: number;
  bestQuizScore: number;
  dayOneCertified: boolean;
};

export type LeaderboardResult = {
  entries: LeaderboardEntry[];
  /** True when the RPC isn't available yet (migration 003 not applied). */
  unavailable: boolean;
};

type RpcRow = {
  rank: number | string;
  user_id: string;
  display_name: string;
  store: string | null;
  weekly_score: number | string;
  completed_required_count: number | string;
  voice_pass_count: number | string;
  best_quiz_score: number | string;
  day_one_certified: boolean;
};

export async function fetchWeeklyLeaderboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, "public", any>
): Promise<LeaderboardResult> {
  try {
    const { data, error } = await supabase.rpc("get_weekly_leaderboard");
    if (error) {
      // 42883 = undefined_function → migration not applied yet.
      if (typeof console !== "undefined") {
        console.warn("[leaderboard] RPC failed:", error.message);
      }
      return { entries: [], unavailable: true };
    }
    const rows = (data ?? []) as RpcRow[];
    const entries: LeaderboardEntry[] = rows.map((r) => ({
      rank: Number(r.rank),
      userId: r.user_id,
      displayName: r.display_name,
      store: r.store,
      weeklyScore: Number(r.weekly_score),
      completedRequiredCount: Number(r.completed_required_count),
      voicePassCount: Number(r.voice_pass_count),
      bestQuizScore: Number(r.best_quiz_score),
      dayOneCertified: !!r.day_one_certified,
    }));
    return { entries, unavailable: false };
  } catch (e) {
    if (typeof console !== "undefined") {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : String(e);
      console.warn("[leaderboard] threw:", msg);
    }
    return { entries: [], unavailable: true };
  }
}
