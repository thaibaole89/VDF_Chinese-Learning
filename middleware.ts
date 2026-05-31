// Two-layer gate for the internal pilot:
//
//   1. Pilot password gate (Phase 1H) — active when PILOT_ACCESS_PASSWORD is set.
//   2. Supabase auth gate (Phase 2A.1) — active when NEXT_PUBLIC_SUPABASE_URL +
//      NEXT_PUBLIC_SUPABASE_ANON_KEY are set. Redirects unauthenticated users to /login.
//
// Either gate is a no-op when its env vars are absent (local dev / first deploy).
// Both run server-side; passwords/sessions never reach the client bundle.

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  // ---------- Layer 1: pilot password gate ----------
  if (process.env.PILOT_ACCESS_PASSWORD) {
    const granted = req.cookies.get("vdf_pilot_access_granted")?.value === "1";
    if (!granted) {
      const dest = req.nextUrl.pathname + req.nextUrl.search;
      const url = req.nextUrl.clone();
      url.pathname = "/pilot-access";
      url.search = `?next=${encodeURIComponent(dest)}`;
      return NextResponse.redirect(url);
    }
  }

  // ---------- Layer 2: Supabase auth gate ----------
  const { response, user, configured } = await updateSession(req);
  if (configured && !user) {
    const dest = req.nextUrl.pathname + req.nextUrl.search;
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(dest)}`;
    return NextResponse.redirect(url);
  }

  // Return the response that updateSession built — it carries any refreshed
  // Supabase session cookies.
  return response;
}

export const config = {
  matcher: [
    // Match everything EXCEPT _next, the two public auth surfaces (pilot gate
    // + login), their API routes, and any path with a file extension.
    "/((?!_next|pilot-access|api/pilot-access|login|api/auth|.*\\.[^/]+$).*)",
  ],
};
