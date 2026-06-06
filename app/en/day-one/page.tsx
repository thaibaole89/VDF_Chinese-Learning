import { redirect } from "next/navigation";

// /en/day-one is superseded by the full English course (Phase 2C.1). The old
// 10-phrase English Day-One is now Module 1 of /courses/english. Permanent
// in-app redirect keeps any old bookmarks working.
export default function EnglishDayOneRedirect() {
  redirect("/courses/english");
}
