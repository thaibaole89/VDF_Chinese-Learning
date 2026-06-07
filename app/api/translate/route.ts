// /api/translate — server translation route.
// 2B.4 (stub) → 2B.4.1 (Google) → 2B.8 (durable usage tracking + abuse guard).
//
// PROVIDER: Google Cloud Translation v2, enabled only when TRANSLATE_PROVIDER=
// google + GOOGLE_TRANSLATE_API_KEY are set (server-only; never bundled, never
// fully logged).
//
// USAGE TRACKING (2B.8): each call inserts a METADATA-ONLY row into
// public.translation_usage (language pair, provider, char COUNT, success flag,
// error code) — NEVER the source or translated text. The same table backs a
// durable per-user abuse guard (60 requests/hour, 10k chars/day VN). If the
// table isn't applied yet (migration 004), tracking is skipped and a soft
// in-memory guard is used so translation keeps working.
//
// Privacy invariants: no source/translated text is stored, logged, or returned
// to anyone but the requesting client.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ALLOWED_TRANSLATE_CODES } from "@/lib/languages";

const MAX_TEXT_LENGTH = 600;
// Allowed translation language codes (shared with the client via lib/languages).
// Codes are already Google-Cloud-Translation-v2 compatible — they pass straight
// through with no per-provider remap.
const ALLOWED = new Set<string>(ALLOWED_TRANSLATE_CODES);

const RATE_MAX_REQUESTS_PER_HOUR = 60;
const RATE_MAX_CHARS_PER_DAY = 10_000;

const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Ho_Chi_Minh, no DST

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = SupabaseClient<any, "public", any>;

function vnStartOfDayISO(nowMs: number): string {
  const vn = new Date(nowMs + VN_OFFSET_MS);
  const midnightUtcMs = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - VN_OFFSET_MS;
  return new Date(midnightUtcMs).toISOString();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

// Insert metadata-only usage row. Best-effort: never throws into the request.
async function recordUsage(
  supabase: SB,
  row: {
    user_id: string;
    source_lang: string;
    target_lang: string;
    provider: string;
    char_count: number;
    success: boolean;
    error_code: string | null;
  }
): Promise<void> {
  try {
    await supabase.from("translation_usage").insert(row);
  } catch {
    /* table missing or transient — ignore; tracking is non-critical */
  }
}

// Soft per-instance fallback used only when the durable usage table isn't
// available (e.g. migration 004 not applied yet).
const memHits = new Map<string, { count: number; windowStart: number }>();
const MEM_LIMIT = 30;
const MEM_WINDOW_MS = 60_000;
function memRateLimited(userId: string, now: number): boolean {
  const rec = memHits.get(userId);
  if (!rec || now - rec.windowStart > MEM_WINDOW_MS) {
    memHits.set(userId, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MEM_LIMIT;
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

  // --- Parse + validate (client mistakes are NOT tracked as usage) ---
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

  // --- Provider config ---
  const provider = process.env.TRANSLATE_PROVIDER;
  if (provider !== "google") {
    return NextResponse.json({
      configured: false,
      message:
        "Bản dịch tự động trên máy chủ chưa được bật. Hãy dùng trình duyệt Chrome mới (có dịch sẵn trên máy) hoặc liên hệ trưởng nhóm pilot để bật dịch máy chủ.",
    });
  }
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      message: "Dịch máy chủ chưa được cấu hình đầy đủ (thiếu khoá).",
    });
  }

  // Codes are already Google-compatible (vi, zh-CN, en, ko, ja, fr).
  const sourceLang = source;
  const targetLang = target;
  const charCount = text.length;
  const usageBase = {
    user_id: user.id,
    source_lang: sourceLang,
    target_lang: targetLang,
    provider: "google",
    char_count: charCount,
  };

  // --- Durable abuse guard (translation_usage) with in-memory fallback ---
  const nowMs = Date.now();
  let durableOk = false;
  try {
    const hourAgo = new Date(nowMs - 3_600_000).toISOString();
    const dayStart = vnStartOfDayISO(nowMs);

    const reqRes = await supabase
      .from("translation_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", hourAgo);
    if (reqRes.error) throw reqRes.error;

    const charRes = await supabase
      .from("translation_usage")
      .select("char_count")
      .eq("user_id", user.id)
      .eq("success", true)
      .gte("created_at", dayStart);
    if (charRes.error) throw charRes.error;

    durableOk = true;
    const reqCount = reqRes.count ?? 0;
    const charsToday = (charRes.data ?? []).reduce(
      (sum, r) => sum + Number((r as { char_count: number }).char_count || 0),
      0
    );

    if (reqCount >= RATE_MAX_REQUESTS_PER_HOUR) {
      await recordUsage(supabase, { ...usageBase, success: false, error_code: "rate_limited" });
      return NextResponse.json(
        { error: "rate_limited", message: "Bạn dịch hơi nhiều trong 1 giờ. Thử lại sau giây lát." },
        { status: 429 }
      );
    }
    if (charsToday + charCount > RATE_MAX_CHARS_PER_DAY) {
      await recordUsage(supabase, { ...usageBase, success: false, error_code: "rate_limited_chars" });
      return NextResponse.json(
        { error: "rate_limited", message: "Đã đạt giới hạn dịch trong ngày. Thử lại vào ngày mai." },
        { status: 429 }
      );
    }
  } catch {
    durableOk = false;
  }

  if (!durableOk && memRateLimited(user.id, nowMs)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Bạn dịch hơi nhanh. Thử lại sau giây lát." },
      { status: 429 }
    );
  }

  // --- Google Cloud Translation API v2 ---
  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: "text" }),
      }
    );

    if (!res.ok) {
      console.warn(`[translate] google provider HTTP ${res.status}`); // status only — never text/key
      await recordUsage(supabase, { ...usageBase, success: false, error_code: `provider_http_${res.status}` });
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
      await recordUsage(supabase, { ...usageBase, success: false, error_code: "empty_result" });
      return NextResponse.json(
        { error: "empty_result", message: "Không dịch được nội dung này. Thử lại nhé." },
        { status: 502 }
      );
    }

    await recordUsage(supabase, { ...usageBase, success: true, error_code: null });
    return NextResponse.json({
      translatedText: decodeEntities(raw),
      provider: "google",
      sourceLang,
      targetLang,
    });
  } catch {
    console.warn("[translate] google provider request failed"); // no content logged
    await recordUsage(supabase, { ...usageBase, success: false, error_code: "provider_unreachable" });
    return NextResponse.json(
      { error: "provider_unreachable", message: "Không kết nối được dịch tự động. Thử lại sau." },
      { status: 502 }
    );
  }
}
