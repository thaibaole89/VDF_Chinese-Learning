// Korean course home. Phase 2C.1.4. Korean progress is local-only (client).

import KoreanLessonList from "@/components/KoreanLessonList";

export const metadata = {
  title: "Tiếng Hàn bán hàng · VDF",
  robots: { index: false, follow: false },
};

export default function KoreanCourseHome() {
  return <KoreanLessonList />;
}
