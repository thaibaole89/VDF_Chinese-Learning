# TRANSLATION_SETUP — Google Cloud Translation fallback (Phase 2B.4.1)

`/tools/translate` translates VI ↔ 中文 for staff at the counter. It tries the
**on-device browser translator first** (Chrome 138+, free, private). For devices
without browser translation, it falls back to a **server route** (`/api/translate`)
that calls the **Google Cloud Translation API v2**. The server route is enabled
only when the two env vars below are set; otherwise the tool still works
on-device and shows "chưa bật dịch tự động" elsewhere.

## 1. Create a Google Cloud Translation API key

1. Go to **https://console.cloud.google.com/** → create or select a project.
2. **APIs & Services → Library** → search **"Cloud Translation API"** → **Enable**.
   (Billing must be enabled on the project — Translation is a paid API.)
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Copy the key. You'll paste it into Vercel (step 3), not into the repo.

## 2. Restrict the key (strongly recommended)

An unrestricted key that leaks can be abused and billed to you. On the key's
edit page:

- **API restrictions → Restrict key → Cloud Translation API** (only).
- **Application restrictions:** API keys can't be restricted to a server IP
  reliably on Vercel (egress IPs vary), so rely on:
  - the API restriction above (key only works for Translation),
  - the key being **server-only** (never in the client bundle — see §5),
  - a **budget alert + quota cap** (§4).
- Rotate the key if it is ever exposed: create a new key, update Vercel, delete
  the old key.

## 3. Set Vercel environment variables

Vercel → project `vdf-chinese-learning` → **Settings → Environment Variables**.
Add both (Production + Preview):

| Name | Value | Notes |
|---|---|---|
| `TRANSLATE_PROVIDER` | `google` | turns on the server fallback |
| `GOOGLE_TRANSLATE_API_KEY` | *your key* | **server-only — NOT** `NEXT_PUBLIC_` |

Then **Redeploy**. Locally, put the same two vars in `.env.local` (gitignored).

> ⚠️ Never prefix the key with `NEXT_PUBLIC_`. Anything `NEXT_PUBLIC_` is inlined
> into the client bundle and would expose your billable key to every visitor.

## 4. Cost + budget guard

- Google Cloud Translation v2 bills **~US$20 per 1,000,000 characters** (first
  500K chars/month are free under the current free tier — verify current pricing).
- A busy counter using the server fallback all day can add up. Mitigations:
  - On-device translation is the default path and costs **nothing** — keep it.
  - The route caps input at **600 characters** per request.
  - The route has a **best-effort in-memory rate limit** (30 req/min/user per
    serverless instance). This is a soft guard only — Vercel instances are
    ephemeral and not shared. For real protection add **Vercel KV / Upstash
    Ratelimit** (a durable, cross-instance limiter). TODO noted in the route.
  - **Set a budget alert:** Google Cloud → **Billing → Budgets & alerts →
    Create budget** → scope to the project → set a monthly amount (e.g. US$20)
    and alert thresholds (50/90/100%). Optionally cap the Translation API quota
    under **APIs & Services → Cloud Translation API → Quotas**.

## 5. Privacy

- The route **stores nothing** — no Supabase writes, no DB rows.
- It **logs no source or translated text** (only HTTP status codes on failure).
- Text is sent to Google only to translate it; nothing is retained app-side.
- The accuracy notice in the UI stands: the tool is for quick communication, not
  for confirming legal / passport / payment / price details.

## 6. Test

After setting the env + redeploying, sign in as a pilot user and open
`/tools/translate`:

1. **Typed input:** type "Xin chào, anh cần mua gì?" (VI → 中文) → **Dịch** →
   Chinese text appears. Tap **🔊 Đọc to** to hear it, **⧉ Sao chép** to copy.
2. **Reverse:** switch to "Khách nói tiếng Trung → tiếng Việt", type
   "我想买香水" → **Dịch** → Vietnamese appears.
3. **Mic:** **🎤 Bấm để nói** → speak → **⏹ Dừng và dịch**.
4. **Browser-native path:** on Chrome 138+ the tool may translate on-device
   without calling the server at all (the output shows "Dịch trên máy"); on
   other browsers it shows "Dịch máy chủ".
5. **Not-configured path:** remove the env (or before setting it) → the output
   shows "Chưa bật dịch tự động" instead of an error.

### Quick server check (optional, replace TOKEN with a logged-in user JWT)

```bash
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL_unused/api/translate" >/dev/null # n/a
# Against the deployed app, with a valid session cookie/JWT:
#   POST /api/translate  { "source":"vi", "target":"zh", "text":"Xin chào" }
# Expect: { "translatedText":"你好", "provider":"google", "sourceLang":"vi", "targetLang":"zh-CN" }
# Unauthenticated → 401. Bad pair (vi→vi) → 400. >600 chars → 413.
```
