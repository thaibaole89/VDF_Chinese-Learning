// Generate simple, dependency-free PNG app icons (no logo, no brand artwork).
// Full-bleed brand-blue tile + white circle + gold accent dot, 4x supersampled.
// Run: npm run gen:icons   (outputs public/icon-180.png, -192.png, -512.png)

import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const BLUE = [30, 64, 175]; // #1e40af
const GOLD = [201, 162, 39]; // #c9a227
const WHITE = [255, 255, 255];

function crc32(buf) {
  let c = ~0 >>> 0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function pngFromRGBA(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function colorAt(size, fx, fy) {
  const cx = size / 2,
    cy = size * 0.52,
    rW = size * 0.3;
  const gx = size * 0.74,
    gy = size * 0.3,
    rG = size * 0.1;
  const dg = (fx - gx) ** 2 + (fy - gy) ** 2;
  if (dg <= rG * rG) return GOLD;
  const dw = (fx - cx) ** 2 + (fy - cy) ** 2;
  if (dw <= rW * rW) return WHITE;
  return BLUE;
}

function render(size) {
  const SS = 2; // 2x2 supersampling
  const rgba = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0,
        g = 0,
        b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const c = colorAt(size, x + (sx + 0.5) / SS, y + (sy + 0.5) / SS);
          r += c[0];
          g += c[1];
          b += c[2];
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r / n);
      rgba[i + 1] = Math.round(g / n);
      rgba[i + 2] = Math.round(b / n);
      rgba[i + 3] = 255; // opaque (good for maskable + apple-touch)
    }
  }
  return pngFromRGBA(size, rgba);
}

for (const size of [180, 192, 512]) {
  writeFileSync(join(PUBLIC, `icon-${size}.png`), render(size));
  console.log(`✓ wrote public/icon-${size}.png`);
}
