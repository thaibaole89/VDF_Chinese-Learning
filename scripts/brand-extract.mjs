// One-off brand tooling (no external deps):
//  1. Samples the exact navy + gold hex from public/vdf-logo.png.
//  2. If given a (pre-resized) VDF mark PNG path, composites it centered on a
//     navy square and writes public/icon-512.png.
//
// Usage:
//   node scripts/brand-extract.mjs                 # print colors only
//   node scripts/brand-extract.mjs /tmp/mark.png   # print colors + write icon-512

import { inflateSync, deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

// ---------- PNG decode (8-bit, non-interlaced; colorType 0/2/4/6) ----------
function decodePNG(buf) {
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); pos += 4;
    const type = buf.toString("ascii", pos, pos + 4); pos += 4;
    const data = buf.subarray(pos, pos + len); pos += len + 4;
    if (type === "IHDR") {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
  }
  if (bitDepth !== 8 || interlace !== 0) throw new Error(`unsupported PNG (bd=${bitDepth}, il=${interlace})`);
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : colorType === 0 ? 1 : 0;
  if (!ch) throw new Error(`unsupported colorType ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const rec = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const f = raw[rp++];
    const o = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? rec[o + x - ch] : 0;
      const b = y > 0 ? rec[o - stride + x] : 0;
      const c = x >= ch && y > 0 ? rec[o - stride + x - ch] : 0;
      let v = raw[rp++];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      rec[o + x] = v;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    let r, g, b, al;
    if (ch === 4) { r = rec[i*4]; g = rec[i*4+1]; b = rec[i*4+2]; al = rec[i*4+3]; }
    else if (ch === 3) { r = rec[i*3]; g = rec[i*3+1]; b = rec[i*3+2]; al = 255; }
    else if (ch === 2) { r = g = b = rec[i*2]; al = rec[i*2+1]; }
    else { r = g = b = rec[i]; al = 255; }
    rgba[i*4] = r; rgba[i*4+1] = g; rgba[i*4+2] = b; rgba[i*4+3] = al;
  }
  return { width, height, rgba };
}

// ---------- PNG encode (RGBA) ----------
function crc32(buf) {
  let c = ~0 >>> 0;
  for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width,0); ihdr.writeUInt32BE(height,4); ihdr[8]=8; ihdr[9]=6;
  const stride = width*4, raw = Buffer.alloc((stride+1)*height);
  for (let y=0;y<height;y++){ raw[y*(stride+1)]=0; rgba.copy(raw, y*(stride+1)+1, y*stride, y*stride+stride); }
  return Buffer.concat([sig, chunk("IHDR",ihdr), chunk("IDAT", deflateSync(raw,{level:9})), chunk("IEND", Buffer.alloc(0))]);
}

const hex = (r,g,b) => "#" + [r,g,b].map((x)=>x.toString(16).padStart(2,"0")).join("");

// ---------- 1) sample colors from the color logo ----------
const logo = decodePNG(readFileSync(join(PUBLIC, "vdf-logo.png")));
const counts = new Map();
for (let i=0;i<logo.width*logo.height;i++){
  const a = logo.rgba[i*4+3]; if (a < 200) continue;
  const r = logo.rgba[i*4], g = logo.rgba[i*4+1], b = logo.rgba[i*4+2];
  const key = (r>>3<<10)|(g>>3<<5)|(b>>3); // quantize to 5-bit/channel
  const e = counts.get(key) || { n:0, r:0, g:0, b:0 };
  e.n++; e.r+=r; e.g+=g; e.b+=b; counts.set(key, e);
}
const clusters = [...counts.values()].map((e)=>({ n:e.n, r:Math.round(e.r/e.n), g:Math.round(e.g/e.n), b:Math.round(e.b/e.n) })).sort((a,b)=>b.n-a.n);
const navy = clusters.find((c)=> c.b > c.r && c.b < 150 && Math.max(c.r,c.g,c.b) < 130) || clusters[0];
const gold = clusters.find((c)=> c.r > 150 && c.g > 110 && c.g < 195 && c.b < 120 && c.r > c.b + 50);
console.log("NAVY:", hex(navy.r,navy.g,navy.b), navy);
if (gold) console.log("GOLD:", hex(gold.r,gold.g,gold.b), gold);
else console.log("GOLD: (not found)");

// ---------- 2) optional: composite mark on navy square -> icon-512 ----------
const markPath = process.argv[2];
if (markPath) {
  const mark = decodePNG(readFileSync(markPath));
  const S = 512;
  const out = Buffer.alloc(S*S*4);
  for (let i=0;i<S*S;i++){ out[i*4]=navy.r; out[i*4+1]=navy.g; out[i*4+2]=navy.b; out[i*4+3]=255; }
  const ox = Math.round((S-mark.width)/2), oy = Math.round((S-mark.height)/2);
  for (let y=0;y<mark.height;y++) for (let x=0;x<mark.width;x++){
    const si=(y*mark.width+x)*4, al=mark.rgba[si+3]/255; if (al<=0) continue;
    const dx=ox+x, dy=oy+y; if (dx<0||dy<0||dx>=S||dy>=S) continue;
    const di=(dy*S+dx)*4;
    out[di]   = Math.round(mark.rgba[si]  *al + out[di]  *(1-al));
    out[di+1] = Math.round(mark.rgba[si+1]*al + out[di+1]*(1-al));
    out[di+2] = Math.round(mark.rgba[si+2]*al + out[di+2]*(1-al));
    out[di+3] = 255;
  }
  writeFileSync(join(PUBLIC, "icon-512.png"), encodePNG(S, S, out));
  console.log(`✓ wrote public/icon-512.png (mark ${mark.width}x${mark.height} on navy ${hex(navy.r,navy.g,navy.b)})`);
}
