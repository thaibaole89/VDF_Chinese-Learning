// Email + password login. POST handler reads form, calls Supabase, sets
// session cookies via the SSR client (cookies returned in the redirect response).
import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function safeNext(next: string | null): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/"));

  if (!isSupabaseConfigured()) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "unconfigured");
    return NextResponse.redirect(url, { status: 303 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "invalid");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL(next, req.url), { status: 303 });
}
