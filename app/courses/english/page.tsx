// English course home (Phase 2C.2). Server component reads the learner's
// server-side progress (RLS-scoped) and hands it to a client list that renders
// per-lesson status, falls back to local-only when the server is unavailable,
// and offers a one-time sync of any leftover local progress.

import Link from "next/link";
import { ENGLISH_COURSE } from "@/lib/englishCourse";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadEnglishProgress } from "@/lib/englishProgress";
import { englishCourseHeroVisual } from "@/lib/englishVisuals";
import Visual from "@/components/Visual";
import EnglishLessonList from "@/components/EnglishLessonList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tiếng Anh bán hàng · VDF",
  robots: { index: false, follow: false },
};

export default async function EnglishCourseHome() {
  let serverOk = false;
  let learnedPhraseIds: string[] = [];
  let voicePassedPhraseIds: string[] = [];
  let completedLessonIds: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const p = await loadEnglishProgress(supabase);
    serverOk = p.serverOk;
    learnedPhraseIds = p.learnedPhraseIds;
    voicePassedPhraseIds = p.voicePassedPhraseIds;
    completedLessonIds = p.completedLessonIds;
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl shadow-card-lg">
        <Visual asset={englishCourseHeroVisual()} variant="header" priority />
        <header className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-brand-100">Khoá học · English</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{ENGLISH_COURSE.titleEn}</h1>
          <p className="mt-1 text-sm text-brand-100">{ENGLISH_COURSE.descriptionVi}</p>
        </header>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link href="/courses" className="font-medium text-brand-700">
          ← Chọn khoá khác
        </Link>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">🇬🇧 English · en-US</span>
      </div>

      <EnglishLessonList
        serverOk={serverOk}
        learnedPhraseIds={learnedPhraseIds}
        voicePassedPhraseIds={voicePassedPhraseIds}
        completedLessonIds={completedLessonIds}
      />
    </div>
  );
}
