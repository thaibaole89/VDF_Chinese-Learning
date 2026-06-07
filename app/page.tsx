import { redirect } from "next/navigation";

// Phase 2C.1.2 — the course selector (/courses) is the canonical logged-in
// landing page. Authenticated visits to "/" redirect there. Anonymous users
// never reach this: middleware redirects them to /login first. Keeping "/" as a
// redirect (rather than deleting it) means existing "← Trang chủ" back-links and
// bookmarks still resolve to the new home.
export default function Home() {
  redirect("/courses");
}
