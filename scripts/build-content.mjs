// Build-time content sanitizer.
//
// Reads the approved /content/*.json (the single source of truth), strips ALL
// provenance/source-path fields (sourceRefs + assetPath/folder/slideTitle/...),
// and writes a sanitized lib/content.data.json that the app imports.
//
// Why: lib/content.ts statically imports content for the client. If it imported
// the raw JSON, webpack would bundle the deeply-nested sourceRefs (with relative
// raw-media filenames) into the client JS. Importing this sanitized copy instead
// keeps those filenames out of the browser bundle.
//
// The validator (validate-content.mjs) still reads the ORIGINAL /content/*.json.
// Re-run via `npm run gen:content` (also runs automatically on predev/prebuild).

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");

// Keys removed everywhere they appear (sourceRefs holds assetPath/folder/etc.;
// the rest are listed defensively in case a stray copy exists outside sourceRefs).
const DROP = new Set(["sourceRefs", "assetPath", "folder", "slideTitle", "mediaTimestamp"]);

function strip(value) {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (DROP.has(k)) continue;
      out[k] = strip(v);
    }
    return out;
  }
  return value;
}

const COURSE_FILES = [
  ["day_one_survival", "day_one_survival.json"],
  ["sales_flow_core", "sales_flow_core.json"],
  ["sales_flow_p1_gaps", "sales_flow_p1_gaps.json"],
  ["product_beauty", "product_beauty.json"],
  ["product_liquor_tobacco_sweets", "product_liquor_tobacco_sweets.json"],
  ["foundation_pronouns", "foundation_pronouns.json"],
  ["foundation_numbers_colors", "foundation_numbers_colors.json"],
  ["foundation_measure_words", "foundation_measure_words.json"],
];
const REF_FILES = ["reference_beauty_brands.json", "reference_liquor_tobacco_brands.json"];

const read = (f) => JSON.parse(readFileSync(join(CONTENT, f), "utf8"));

// NOTE: intentionally no timestamp — keep output deterministic so rebuilds
// don't produce spurious git diffs.
const out = {
  courses: COURSE_FILES.map(([fileKey, f]) => ({ fileKey, course: strip(read(f)) })),
  referenceTables: REF_FILES.map((f) => strip(read(f))),
};

// Hard guard: refuse to write if any provenance/media-path marker survived.
// NOTE: bare Vietnamese words like "lượng từ" (= measure word) are legitimate
// display text — we only flag media FILE extensions + source-path keys, which
// never appear in legitimate learning content.
const serialized = JSON.stringify(out);
const FORBIDDEN = [
  "sourceRefs",
  "assetPath",
  ".jpg",
  ".jpeg",
  ".png",
  ".mov",
  ".mp4",
  ".heic",
  ".webp",
  "OneDrive",
  "CloudStorage",
  "IPPG",
];
for (const bad of FORBIDDEN) {
  if (serialized.includes(bad)) {
    console.error(`✗ Sanitization failed — found "${bad}" in output.`);
    process.exit(1);
  }
}

writeFileSync(join(ROOT, "lib", "content.data.json"), serialized);
console.log(
  `✓ Wrote lib/content.data.json — ${out.courses.length} courses, ${out.referenceTables.length} reference tables, sourceRefs stripped.`
);
