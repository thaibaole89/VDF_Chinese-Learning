import { notFound } from "next/navigation";
import { getEnglishLesson } from "@/lib/englishCourse";
import EnglishLessonView from "@/components/EnglishLessonView";

// English lesson page. Server component resolves the lesson by id, then hands
// off to the client view (local progress + voice practice). Scalable route:
// /courses/english/lessons/[lessonId].

export function generateStaticParams() {
  // Best-effort static params; dynamic ids still render at request time.
  return [];
}

export default async function EnglishLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getEnglishLesson(lessonId);
  if (!lesson) notFound();
  return <EnglishLessonView lesson={lesson} />;
}
