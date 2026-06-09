// Korean course home (Phase 2D). Server component reads the learner's
// server-side Korean progress (RLS-scoped, migration 005/006) and hands it to a
// client list that renders per-lesson status, falls back to local-only when the
// server is unavailable, and offers a one-time sync of leftover local progress.
// Korean is NOT in the Hall of Fame and has no certificate.

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadKoreanProgress } from "@/lib/koreanServerProgress";
import KoreanLessonList from "@/components/KoreanLessonList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tiếng Hàn bán hàng · VDF",
  robots: { index: false, follow: false },
};

export default async function KoreanCourseHome() {
  let serverOk = false;
  let learnedPhraseIds: string[] = [];
  let voicePassedPhraseIds: string[] = [];
  let completedLessonIds: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const p = await loadKoreanProgress(supabase);
    serverOk = p.serverOk;
    learnedPhraseIds = p.learnedPhraseIds;
    voicePassedPhraseIds = p.voicePassedPhraseIds;
    completedLessonIds = p.completedLessonIds;
  }

  return (
    <KoreanLessonList
      serverOk={serverOk}
      learnedPhraseIds={learnedPhraseIds}
      voicePassedPhraseIds={voicePassedPhraseIds}
      completedLessonIds={completedLessonIds}
    />
  );
}
