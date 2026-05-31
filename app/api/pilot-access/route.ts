// Pilot access gate — server-only POST handler.
// Verifies submitted password against `PILOT_ACCESS_PASSWORD` (read on the
// server only — never exposed to the client bundle), sets an httpOnly cookie
// on success, and redirects safely back to `next` (internal paths only).

import { NextResponse } from "next/server";

const COOKIE_NAME = "vdf_pilot_access_granted";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function safeNext(next: string | null): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/"));
  const expected = process.env.PILOT_ACCESS_PASSWORD;

  // If the gate isn't configured, treat any submit as success.
  if (!expected) {
    return NextResponse.redirect(new URL(next, req.url), { status: 303 });
  }

  if (password !== expected) {
    const back = new URL("/pilot-access", req.url);
    back.searchParams.set("error", "1");
    back.searchParams.set("next", next);
    return NextResponse.redirect(back, { status: 303 });
  }

  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });
  res.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
