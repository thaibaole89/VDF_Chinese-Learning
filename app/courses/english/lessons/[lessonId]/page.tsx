import { notFound } from "next/navigation";
import { getEnglishLesson } from "@/lib/englishCourse";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadEnglishProgress } from "@/lib/englishProgress";
import EnglishLessonView from "@/components/EnglishLessonView";

// English lesson page (Phase 2C.2). Server component resolves the lesson, reads
// the learner's server-side progress (RLS-scoped), then hands off to the client
// view which writes changes back through server actions + a local mirror.
export const dynamic = "force-dynamic";

export default async function EnglishLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getEnglishLesson(lessonId);
  if (!lesson) notFound();

  let serverOk = false;
  let initialLearned: string[] = [];
  let initialVoice: string[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const progress = await loadEnglishProgress(supabase);
    serverOk = progress.serverOk;
    initialLearned = progress.learnedPhraseIds;
    initialVoice = progress.voicePassedPhraseIds;
  }

  return (
    <EnglishLessonView
      lesson={lesson}
      serverOk={serverOk}
      initialLearned={initialLearned}
      initialVoice={initialVoice}
    />
  );
}
