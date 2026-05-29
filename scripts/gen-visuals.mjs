// Visual generator for /public/visuals (768×432 JPEG, ~16:9).
//
//  - With GEMINI_API_KEY set: generates real illustrations via the Gemini image
//    model ("Nano Banana", gemini-2.5-flash-image), then optimizes with `sips`
//    (resize 768w → center-crop 432h → JPEG q72). Each image falls back to a
//    brand-gradient placeholder if its API call fails.
//  - Without a key: writes brand-gradient PLACEHOLDER JPEGs so the UI works.
//
// Requires macOS `sips` for optimization (no sharp/WebP/ImageMagick here). If
// sips is missing, writes an unoptimized PNG fallback and warns.
//
// Run: GEMINI_API_KEY=... node scripts/gen-visuals.mjs    (or no key for placeholders)
// The API key is read from the environment only — never store it in this repo.

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "visuals");
mkdirSync(OUT, { recursive: true });

const NAVY = [0x00, 0x2e, 0x76];
const GOLD = [0xc2, 0x97, 0x56];

const BASE_PROMPT =
  "Professional semi-realistic editorial illustration for a mobile learning app used by airport duty-free sales staff. Clean modern airport retail environment, soft natural lighting, blue and gold accent palette, Vietnamese duty-free shop context, premium but friendly. No logos, no real brands, no readable trademarked packaging, no celebrity likeness, no real personal data, no scannable QR code. Simple composition, high clarity at small mobile size, 16:9 aspect ratio.";
const NEGATIVE =
  "no real brand logos, no VDF logo, no fake exact brand packaging, no readable passport number, no readable boarding pass personal data, no real QR code, no credit card number, no watermark, no text-heavy image, no cluttered background, no photorealistic identifiable person, no copyrighted characters";

const VISUALS = [
  ["day-one-survival.jpg", "Vietnamese duty-free sales associate at an airport counter politely greeting a Chinese traveler. Clean airport retail environment, no logos, no real brands."],
  ["greeting.jpg", "Sales associate welcoming a traveler entering a duty-free shop. Friendly, professional."],
  ["documents.jpg", "Generic passport and boarding pass being shown at a duty-free counter. No real personal data, fictional text only."],
  ["payment.jpg", "Customer paying at a counter with phone QR payment and card terminal. Generic QR shape only, not scannable, no real payment logos."],
  ["price-promotion.jpg", "Duty-free shelf with generic price tag and promotion sign. No brand names, no real prices, professional retail style."],
  ["duty-free.jpg", "Airport duty-free shop interior with generic Duty Free style sign, no VDF logo, no brand logos, clean shelves."],
  ["out-of-stock.jpg", "Sales associate politely suggesting an alternative product when one item is unavailable. Generic shelf and product silhouettes."],
  ["closing.jpg", "Sales associate handing shopping bag and receipt to traveler, polite farewell at airport retail counter. No logos."],
  ["perfume.jpg", "Elegant generic perfume bottles on duty-free shelf, no brand labels, premium retail lighting."],
  ["cosmetics.jpg", "Generic skincare bottles, cream jars, lipstick-like items on beauty counter, no brand labels."],
  ["liquor.jpg", "Generic whisky/cognac/wine bottles on duty-free shelf, no labels or trademarks, premium lighting."],
  ["tobacco.jpg", "Generic cigarette cartons behind duty-free counter, plain packaging without brand names or warning labels, subtle and compliant."],
  ["confectionery.jpg", "Generic chocolate and candy boxes on duty-free shelf, no brand labels."],
  ["brand-reference.jpg", "Pronunciation reference concept: staff looking at a tablet with generic brand-name pronunciation table, no real logos."],
  ["measure-words.jpg", "Learning concept showing generic product items grouped by quantity/classifier: bottle, box, bag, pair, set. Clean educational style."],
];

// ---- tiny PNG encoder for placeholders ----
function crc32(b) { let c = ~0 >>> 0; for (let i = 0; i < b.length; i++) { c ^= b[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return (~c) >>> 0; }
function chunk(t, d) { const l = Buffer.alloc(4); l.writeUInt32BE(d.length, 0); const b = Buffer.concat([Buffer.from(t, "ascii"), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(b), 0); return Buffer.concat([l, b, c]); }
function encodePNG(w, h, rgba) { const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; const stride = w * 4, raw = Buffer.alloc((stride + 1) * h); for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); } return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]); }
function placeholderPNG(idx) {
  const W = 768, H = 432, rgba = Buffer.alloc(W * H * 4);
  const bot = [Math.min(255, NAVY[0] + 22 + idx * 2), Math.min(255, NAVY[1] + 34 + idx * 3), Math.min(255, NAVY[2] + 46 + idx * 3)];
  const bandTop = Math.floor(H * (0.66 + (idx % 5) * 0.02)), bandBot = bandTop + 10;
  for (let y = 0; y < H; y++) {
    const t = y / H;
    let col = [Math.round(NAVY[0] + (bot[0] - NAVY[0]) * t), Math.round(NAVY[1] + (bot[1] - NAVY[1]) * t), Math.round(NAVY[2] + (bot[2] - NAVY[2]) * t)];
    if (y >= bandTop && y < bandBot) col = GOLD;
    for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; rgba[i] = col[0]; rgba[i + 1] = col[1]; rgba[i + 2] = col[2]; rgba[i + 3] = 255; }
  }
  return encodePNG(W, H, rgba);
}

function hasSips() { try { execFileSync("sips", ["--version"], { stdio: "ignore" }); return true; } catch { return false; } }

// raw PNG buffer -> optimized 768x432 JPEG at outJpg via sips
function optimizeToJpg(buf, outJpg) {
  const t1 = join(tmpdir(), `vdf_v1_${Date.now()}.png`);
  const t2 = join(tmpdir(), `vdf_v2_${Date.now()}.png`);
  const t3 = join(tmpdir(), `vdf_v3_${Date.now()}.png`);
  writeFileSync(t1, buf);
  execFileSync("sips", ["--resampleWidth", "768", t1, "--out", t2], { stdio: "ignore" });
  execFileSync("sips", ["--cropToHeightWidth", "432", "768", t2, "--out", t3], { stdio: "ignore" });
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "72", t3, "--out", outJpg], { stdio: "ignore" });
  for (const t of [t1, t2, t3]) { try { rmSync(t); } catch { /* ignore */ } }
}

async function generateNanoBanana(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  const parts = j?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("no image in response");
  return Buffer.from(img.inlineData.data, "base64");
}

const key = process.env.GEMINI_API_KEY;
const SIPS = hasSips();
if (!SIPS) console.warn("! sips not found — writing unoptimized PNG fallback (rename refs accordingly).");

let total = 0, real = 0;
for (let i = 0; i < VISUALS.length; i++) {
  const [file, scene] = VISUALS[i];
  let buf, source = "placeholder";
  if (key) {
    try {
      buf = await generateNanoBanana(key, `${BASE_PROMPT}\nScene: ${scene}\nStrictly avoid: ${NEGATIVE}`);
      source = "nano-banana";
      real++;
    } catch (e) {
      console.warn(`! ${file}: Nano Banana failed (${e.message}) — placeholder`);
      buf = placeholderPNG(i);
    }
  } else {
    buf = placeholderPNG(i);
  }
  const outJpg = join(OUT, file);
  if (SIPS) optimizeToJpg(buf, outJpg);
  else writeFileSync(outJpg.replace(/\.jpg$/, ".png"), buf);
  const { statSync } = await import("node:fs");
  const sz = statSync(SIPS ? outJpg : outJpg.replace(/\.jpg$/, ".png")).size;
  total += sz;
  console.log(`${source}: ${file} (${(sz / 1024).toFixed(1)} KB)`);
  if (key) await new Promise((r) => setTimeout(r, 800)); // gentle pacing
}
console.log(`\nTotal: ${(total / 1024).toFixed(1)} KB · ${real}/${VISUALS.length} real (Nano Banana), rest placeholder.`);
