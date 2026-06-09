import { notFound } from "next/navigation";
import { getKoreanLesson } from "@/lib/koreanCourse";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadKoreanProgress } from "@/lib/koreanServerProgress";
import KoreanLessonView from "@/components/KoreanLessonView";

// Korean lesson page (Phase 2D). Server component resolves the lesson, reads the
// learner's server-side progress (RLS-scoped), then hands off to the client view
// which writes changes back through server actions + a local mirror.
export const dynamic = "force-dynamic";

export default async function KoreanLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getKoreanLesson(lessonId);
  if (!lesson) notFound();

  let serverOk = false;
  let initialLearned: string[] = [];
  let initialVoice: string[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const progress = await loadKoreanProgress(supabase);
    serverOk = progress.serverOk;
    initialLearned = progress.learnedPhraseIds;
    initialVoice = progress.voicePassedPhraseIds;
  }

  return (
    <KoreanLessonView
      lesson={lesson}
      serverOk={serverOk}
      initialLearned={initialLearned}
      initialVoice={initialVoice}
    />
  );
}
