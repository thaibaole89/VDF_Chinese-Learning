// Visual generator for /public/visuals.
//
//  - With GEMINI_API_KEY set: generates real illustrations via the Gemini image
//    model ("Nano Banana", gemini-2.5-flash-image) using the prompts below.
//  - Without a key (current environment): writes clean brand-gradient PLACEHOLDER
//    PNGs so the UI works end-to-end. These are NOT the AI illustrations.
//
// Run: node scripts/gen-visuals.mjs
// WebP isn't available locally (no sharp/cwebp/sips-webp), so output is PNG.

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "visuals");
mkdirSync(OUT, { recursive: true });

const NAVY = [0x00, 0x2e, 0x76]; // VDF navy #002e76
const GOLD = [0xc2, 0x97, 0x56]; // VDF gold #c29756

const BASE_PROMPT =
  "Professional semi-realistic editorial illustration for a mobile learning app used by airport duty-free sales staff. Clean modern airport retail environment, soft natural lighting, blue and gold accent palette, Vietnamese duty-free shop context, premium but friendly. No logos, no real brands, no readable trademarked packaging, no celebrity likeness, no real personal data, no scannable QR code. Simple composition, high clarity at small mobile size, 16:9 aspect ratio.";

const NEGATIVE =
  "no real brand logos, no VDF logo, no fake exact brand packaging, no readable passport number, no readable boarding pass personal data, no real QR code, no credit card number, no watermark, no text-heavy image, no cluttered background, no photorealistic identifiable person, no copyrighted characters";

// [filename, scene description appended to BASE_PROMPT]
const VISUALS = [
  ["day-one-survival.png", "Vietnamese duty-free sales associate at an airport counter politely greeting a Chinese traveler. Clean airport retail environment, no logos, no real brands."],
  ["greeting.png", "Sales associate welcoming a traveler entering a duty-free shop. Friendly, professional."],
  ["documents.png", "Generic passport and boarding pass being shown at a duty-free counter. No real personal data, fictional text only."],
  ["payment.png", "Customer paying at a counter with phone QR payment and card terminal. Generic QR shape only, not scannable, no real payment logos."],
  ["price-promotion.png", "Duty-free shelf with generic price tag and promotion sign. No brand names, no real prices, professional retail style."],
  ["duty-free.png", "Airport duty-free shop interior with generic Duty Free style sign, no VDF logo, no brand logos, clean shelves."],
  ["out-of-stock.png", "Sales associate politely suggesting an alternative product when one item is unavailable. Generic shelf and product silhouettes."],
  ["closing.png", "Sales associate handing shopping bag and receipt to traveler, polite farewell at airport retail counter. No logos."],
  ["perfume.png", "Elegant generic perfume bottles on duty-free shelf, no brand labels, premium retail lighting."],
  ["cosmetics.png", "Generic skincare bottles, cream jars, lipstick-like items on beauty counter, no brand labels."],
  ["liquor.png", "Generic whisky/cognac/wine bottles on duty-free shelf, no labels or trademarks, premium lighting."],
  ["tobacco.png", "Generic cigarette cartons behind duty-free counter, plain packaging without brand names or warning labels, subtle and compliant."],
  ["confectionery.png", "Generic chocolate and candy boxes on duty-free shelf, no brand labels."],
  ["brand-reference.png", "Pronunciation reference concept: staff looking at a tablet with generic brand-name pronunciation table, no real logos."],
  ["measure-words.png", "Learning concept showing generic product items grouped by quantity/classifier: bottle, box, bag, pair, set. Clean educational style."],
];

// ---- PNG encoder (RGBA, filter 0; row-uniform gradients compress tiny) ----
function crc32(buf) {
  let c = ~0 >>> 0;
  for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return (~c) >>> 0;
}
function chunk(t, d) {
  const l = Buffer.alloc(4); l.writeUInt32BE(d.length, 0);
  const b = Buffer.concat([Buffer.from(t, "ascii"), d]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(b), 0);
  return Buffer.concat([l, b, c]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const stride = w * 4, raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function placeholder(idx) {
  const W = 768, H = 432;
  const rgba = Buffer.alloc(W * H * 4);
  const bot = [Math.min(255, NAVY[0] + 22 + idx * 2), Math.min(255, NAVY[1] + 34 + idx * 3), Math.min(255, NAVY[2] + 46 + idx * 3)];
  const bandTop = Math.floor(H * (0.66 + (idx % 5) * 0.02));
  const bandBot = bandTop + 10;
  for (let y = 0; y < H; y++) {
    const t = y / H;
    let col = [
      Math.round(NAVY[0] + (bot[0] - NAVY[0]) * t),
      Math.round(NAVY[1] + (bot[1] - NAVY[1]) * t),
      Math.round(NAVY[2] + (bot[2] - NAVY[2]) * t),
    ];
    if (y >= bandTop && y < bandBot) col = GOLD;
    for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; rgba[i] = col[0]; rgba[i + 1] = col[1]; rgba[i + 2] = col[2]; rgba[i + 3] = 255; }
  }
  return encodePNG(W, H, rgba);
}

async function generateNanoBanana(key, prompt) {
  // Best-effort Gemini image call (untested in this env). Adjust if the API shape changes.
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
let total = 0;
for (let i = 0; i < VISUALS.length; i++) {
  const [file, scene] = VISUALS[i];
  let buf;
  if (key) {
    try {
      buf = await generateNanoBanana(key, `${BASE_PROMPT}\nScene: ${scene}\nAvoid: ${NEGATIVE}`);
    } catch (e) {
      console.warn(`! Nano Banana failed for ${file}: ${e.message} — using placeholder`);
      buf = placeholder(i);
    }
  } else {
    buf = placeholder(i);
  }
  writeFileSync(join(OUT, file), buf);
  total += buf.length;
  console.log(`${key ? "gen" : "placeholder"}: ${file} (${(buf.length / 1024).toFixed(1)} KB)`);
}
console.log(
  `\nTotal: ${(total / 1024).toFixed(1)} KB across ${VISUALS.length} files ${
    key ? "(Nano Banana)" : "(brand-gradient placeholders — set GEMINI_API_KEY to generate real illustrations)"
  }`
);
