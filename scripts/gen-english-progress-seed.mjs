// Generate the course_phrases seed (course_id, lesson_id, phrase_id) for the
// English course from lib/englishCourse.ts. Linear scan of the source: track the
// current lesson id (a string id matching /^english_/), then attribute each
// subsequent phrase id (/^en_/, not /^english_/) to that lesson. Emits SQL
// VALUES rows on stdout for pasting into supabase/migrations/005_course_progress.sql.
//
// Re-run after editing English content:
//   node scripts/gen-english-progress-seed.mjs
//
// This mirrors scripts/gen-phase2a-rpcs.mjs (Chinese phrases) but the catalog is
// TS, so we parse the source text rather than import JSON.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "lib", "englishCourse.ts");
const COURSE_ID = "english-sales";

const text = readFileSync(SRC, "utf8");
const lines = text.split("\n");

// Known lesson ids (anything matching english_*). We detect a lesson header by
// `id: "english_..."` and a phrase by `id: "en_..."` (excluding english_).
const idRe = /id:\s*"([a-z0-9_]+)"/;

let currentLesson = null;
const rows = [];
const seen = new Set();

for (const line of lines) {
  const m = line.match(idRe);
  if (!m) continue;
  const id = m[1];
  if (id.startsWith("english_")) {
    currentLesson = id;
  } else if (id.startsWith("en_")) {
    if (!currentLesson) continue;
    const key = `${currentLesson}::${id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ lesson: currentLesson, phrase: id });
  }
}

if (rows.length === 0) {
  console.error("No phrases found — check the parser / source format.");
  process.exit(1);
}

const values = rows
  .map((r) => `  ('${COURSE_ID}', '${r.lesson}', '${r.phrase}')`)
  .join(",\n");

const idList = rows.map((r) => `'${r.phrase}'`).join(", ");

console.log(`-- ${rows.length} English phrases across ${new Set(rows.map((r) => r.lesson)).size} lessons`);
console.log("insert into public.course_phrases (course_id, lesson_id, phrase_id) values");
console.log(values + "");
console.log("on conflict (course_id, phrase_id) do update set");
console.log("  lesson_id = excluded.lesson_id;");
console.log("");
console.log("-- prune list (phrase ids no longer in content):");
console.log(`delete from public.course_phrases where course_id = '${COURSE_ID}' and phrase_id not in (${idList});`);
