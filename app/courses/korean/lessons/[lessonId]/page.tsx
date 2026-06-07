import { notFound } from "next/navigation";
import { getKoreanLesson } from "@/lib/koreanCourse";
import KoreanLessonView from "@/components/KoreanLessonView";

// Korean lesson page. Phase 2C.1.4. Resolves the lesson by id, hands to the
// client view (local progress + voice practice).

export default async function KoreanLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getKoreanLesson(lessonId);
  if (!lesson) notFound();
  return <KoreanLessonView lesson={lesson} />;
}
