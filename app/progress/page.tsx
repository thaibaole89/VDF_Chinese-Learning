// /progress — legacy route. Phase 2B.1 promoted /account to the canonical
// learner dashboard. This route now redirects so existing bookmarks and any
// in-app links land on the new page without 404s.
//
// The old reset-and-stats UI moved into /account ("Tiện ích" group for
// sync/check + dashboard for stats). The reset action will return in a
// dedicated /account/reset confirmation page if we need it later.

import { redirect } from "next/navigation";

export default function ProgressPage() {
  redirect("/account");
}
