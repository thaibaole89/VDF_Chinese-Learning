// One-off: refresh the english-sales course_phrases seed inside migration 005
// from lib/englishCourse.ts. Run after editing English content:
//   node scripts/update-005-english-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "lib/englishCourse.ts";
const MIG = "supabase/migrations/005_course_progress.sql";
const COURSE = "english-sales";

const lines = readFileSync(SRC, "utf8").split("\n");
const idRe = /id:\s*"([a-z0-9_]+)"/;
let cur = null;
const rows = [];
const seen = new Set();
for (const l of lines) {
  const m = l.match(idRe);
  if (!m) continue;
  const id = m[1];
  if (id.startsWith("english_")) cur = id;
  else if (id.startsWith("en_")) {
    if (!cur) continue;
    const k = cur + "::" + id;
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push([cur, id]);
  }
}

const q = (s) => "'" + s + "'";
const values = rows.map((r) => `  (${q(COURSE)}, ${q(r[0])}, ${q(r[1])})`).join(",\n");
const idList = rows.map((r) => q(r[1])).join(", ");
const lessons = new Set(rows.map((r) => r[0])).size;

let mig = readFileSync(MIG, "utf8");

const insertRe =
  /insert into public\.course_phrases \(course_id, lesson_id, phrase_id\) values[\s\S]*?on conflict \(course_id, phrase_id\) do update set\n {2}lesson_id = excluded\.lesson_id,\n {2}updated_at = now\(\);/;
const deleteRe =
  /delete from public\.course_phrases\n where course_id = 'english-sales'\n {3}and phrase_id not in \([^)]*\);/;

const newInsert =
  `insert into public.course_phrases (course_id, lesson_id, phrase_id) values\n${values}\n` +
  `on conflict (course_id, phrase_id) do update set\n  lesson_id = excluded.lesson_id,\n  updated_at = now();`;
const newDelete =
  `delete from public.course_phrases\n where course_id = 'english-sales'\n   and phrase_id not in (${idList});`;

if (!insertRe.test(mig)) {
  console.error("INSERT block not matched");
  process.exit(1);
}
if (!deleteRe.test(mig)) {
  console.error("DELETE block not matched");
  process.exit(1);
}

mig = mig.replace(insertRe, newInsert).replace(deleteRe, newDelete);
mig = mig.replace(/\d+ English phrases across \d+ ready lessons\./, `${rows.length} English phrases across ${lessons} lessons.`);
mig = mig.replace(/english_phrases_seeded=\d+/, `english_phrases_seeded=${rows.length}`);

writeFileSync(MIG, mig);
console.log(`Updated 005 seed: ${rows.length} phrases across ${lessons} lessons`);
