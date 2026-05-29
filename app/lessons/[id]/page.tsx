import { getAllLessonIds } from "@/lib/content";
import LessonDetail from "./LessonDetail";

export function generateStaticParams() {
  return getAllLessonIds().map((id) => ({ id }));
}

export const dynamicParams = false;

export default function Page({ params }: { params: { id: string } }) {
  return <LessonDetail id={params.id} />;
}
