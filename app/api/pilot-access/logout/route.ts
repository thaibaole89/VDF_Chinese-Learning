// Clear the pilot-access cookie and bounce back to the gate.
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/pilot-access", req.url), { status: 303 });
  res.cookies.set("vdf_pilot_access_granted", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
