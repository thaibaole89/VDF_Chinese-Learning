// Auth gate for the pilot. Phase 2A.5 retired the legacy pilot-password gate;
// Supabase Auth is now the sole entry control. Unauthenticated users are
// redirected to /login.
//
// The gate is a no-op when Supabase env vars are absent (local dev / first
// deploy) — useful for early scaffolding.

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
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
    // Match everything EXCEPT _next, the login surface + its API routes, and
    // any path with a file extension (assets, manifests, images, etc.).
    "/((?!_next|login|api/auth|.*\\.[^/]+$).*)",
  ],
};
