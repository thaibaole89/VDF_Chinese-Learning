// /api/translate — server translation route. Phase 2B.4.
//
// STATUS: SECURE STUB. No translation provider is wired yet, and NO API key is
// hardcoded or bundled. The route exists so the client has a stable contract
// and so the secure architecture is in place for when a provider is approved:
//
//   - The provider key would live ONLY in server env (e.g. Vercel project env
//     `TRANSLATE_API_KEY`), never NEXT_PUBLIC_, never in the client bundle.
//   - This handler runs server-side only; the key never leaves the server.
//   - Requests are auth-gated (must be a logged-in user) + length-capped.
//   - No conversation text is stored anywhere (no Supabase writes, no logs of
//     content).
//
// Until `TRANSLATE_PROVIDER` is set in server env, the route returns
// { configured: false } and the client shows a "chưa bật" message + the
// browser-native on-device translator is used when available.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_TEXT_LENGTH = 600;
const ALLOWED = new Set(["vi", "zh"]);

export async function POST(req: Request) {
  // --- Auth gate (defense in depth; middleware also protects this path) ---
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // --- Parse + validate ---
  let body: { source?: unknown; target?: unknown; text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const source = String(body.source ?? "");
  const target = String(body.target ?? "");
  const text = String(body.text ?? "");
  if (!ALLOWED.has(source) || !ALLOWED.has(target) || source === target) {
    return NextResponse.json({ error: "bad_language_pair" }, { status: 400 });
  }
  if (!text.trim()) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "too_long" }, { status: 413 });
  }

  // --- Provider dispatch (not configured by default) ---
  const provider = process.env.TRANSLATE_PROVIDER; // e.g. "google" | "gemini" | "openai"
  if (!provider) {
    return NextResponse.json({
      configured: false,
      message:
        "Bản dịch tự động trên máy chủ chưa được bật. Hãy dùng trình duyệt Chrome mới (có dịch sẵn trên máy) hoặc liên hệ trưởng nhóm pilot để bật dịch máy chủ.",
    });
  }

  // When a provider is approved + configured, the call goes here. It MUST read
  // its key from server env only (e.g. process.env.TRANSLATE_API_KEY) and must
  // not store conversation text. Intentionally left unimplemented in this phase
  // (no paid integration without explicit approval).
  return NextResponse.json({
    configured: false,
    message: "Nhà cung cấp dịch chưa được cấu hình đầy đủ.",
  });
}
