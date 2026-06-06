// /api/translate — server translation route. Phase 2B.4 (stub) → 2B.4.1 (Google).
//
// PROVIDER: Google Cloud Translation API v2, wired ONLY when the server env is
// configured (TRANSLATE_PROVIDER=google + GOOGLE_TRANSLATE_API_KEY). The key is
// read server-side only — never NEXT_PUBLIC, never sent to the client, never
// fully logged. When the env is absent the route returns { configured: false }
// and the client uses the on-device browser translator (or shows "chưa bật").
//
// Privacy: this route stores NOTHING (no Supabase writes) and logs NO source or
// translated text. Only auth + length + language-pair are enforced.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_TEXT_LENGTH = 600;
const ALLOWED = new Set(["vi", "zh"]);

// Map our internal codes to Google Translation v2 language codes.
function toGoogleLang(code: string): string {
  return code === "zh" ? "zh-CN" : code; // "vi" stays "vi"
}

// --- Best-effort in-memory rate limit -------------------------------------
// NOTE: Vercel serverless instances are ephemeral and NOT shared, so this is a
// per-instance soft guard only — it blunts a single runaway client but is not a
// durable limiter. For real protection use Vercel KV / Upstash Ratelimit. See
// TRANSLATION_SETUP.md. Kept lightweight on purpose (no new dependency).
const RATE_LIMIT = 30; // requests
const RATE_WINDOW_MS = 60_000; // per minute, per user, per instance
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimited(userId: string, now: number): boolean {
  const rec = hits.get(userId);
  if (!rec || now - rec.windowStart > RATE_WINDOW_MS) {
    hits.set(userId, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

// Minimal HTML-entity decode — Google v2 may HTML-escape a few chars even with
// format:"text" (e.g. &#39; &amp; &quot;).
function decodeEntities(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

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

  // --- Provider dispatch ---
  const provider = process.env.TRANSLATE_PROVIDER; // "google" for this phase
  if (provider !== "google") {
    return NextResponse.json({
      configured: false,
      message:
        "Bản dịch tự động trên máy chủ chưa được bật. Hãy dùng trình duyệt Chrome mới (có dịch sẵn trên máy) hoặc liên hệ trưởng nhóm pilot để bật dịch máy chủ.",
    });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    // Provider named but key missing → treat as not configured (don't 500).
    return NextResponse.json({
      configured: false,
      message: "Dịch máy chủ chưa được cấu hình đầy đủ (thiếu khoá).",
    });
  }

  // --- Rate limit (best-effort) ---
  const now = Date.now();
  if (rateLimited(user.id, now)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Bạn dịch hơi nhanh. Thử lại sau giây lát." },
      { status: 429 }
    );
  }

  const sourceLang = toGoogleLang(source);
  const targetLang = toGoogleLang(target);

  // --- Google Cloud Translation API v2 ---
  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
        }),
      }
    );

    if (!res.ok) {
      // Log status only — never the key or the text.
      console.warn(`[translate] google provider HTTP ${res.status}`);
      return NextResponse.json(
        { error: "provider_error", message: "Dịch tự động đang lỗi. Vui lòng thử lại sau." },
        { status: 502 }
      );
    }

    const data = (await res.json().catch(() => null)) as
      | { data?: { translations?: Array<{ translatedText?: string }> } }
      | null;
    const raw = data?.data?.translations?.[0]?.translatedText;
    if (!raw || !raw.trim()) {
      return NextResponse.json(
        { error: "empty_result", message: "Không dịch được nội dung này. Thử lại nhé." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      translatedText: decodeEntities(raw),
      provider: "google",
      sourceLang,
      targetLang,
    });
  } catch {
    // Network/parse failure — no content logged.
    console.warn("[translate] google provider request failed");
    return NextResponse.json(
      { error: "provider_unreachable", message: "Không kết nối được dịch tự động. Thử lại sau." },
      { status: 502 }
    );
  }
}
