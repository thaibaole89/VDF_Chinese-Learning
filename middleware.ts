// Lightweight pilot access gate.
//
// If env PILOT_ACCESS_PASSWORD is set (read at runtime), every matched route
// requires the `vdf_pilot_access_granted=1` cookie. The cookie is set by
// /api/pilot-access after the user submits the correct password.
//
// If the env var is NOT set, the middleware is a no-op (open access).
//
// This is NOT enterprise auth — see SECURITY.md §3.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Gate is off when no password is configured (e.g. local dev without .env).
  if (!process.env.PILOT_ACCESS_PASSWORD) return NextResponse.next();

  const granted = req.cookies.get("vdf_pilot_access_granted")?.value === "1";
  if (granted) return NextResponse.next();

  // Preserve original destination (pathname + query) for post-login redirect.
  const dest = req.nextUrl.pathname + req.nextUrl.search;
  const url = req.nextUrl.clone();
  url.pathname = "/pilot-access";
  url.search = `?next=${encodeURIComponent(dest)}`;
  return NextResponse.redirect(url);
}

// Match everything EXCEPT Next.js internals, the gate page, its API,
// and any path with a file extension (icons, images, robots.txt, manifest, …).
export const config = {
  matcher: ["/((?!_next|pilot-access|api/pilot-access|.*\\.[^/]+$).*)"],
};
