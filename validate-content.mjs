// VDF Chinese Sales Tutor — content validator (Phase 1A + Phase 1B)
//
// Walks every *.json in /content, checks structural integrity against the
// conventions in content/schema.ts, and prints counts. Run with:
//   node validate-content.mjs
//
// Rules enforced:
//   - file parses as JSON
//   - every container and leaf item has a non-empty `id`
//   - vocab items have hanzi + pinyin + meaningVi
//   - sentence patterns have zh + pinyin + vi
//   - measure words have hanzi + pinyin + usesForVi
//   - brand references have latinName + hanzi + pinyin
//   - every lesson / vocab / sentencePattern / measureWord / brandReference /
//     dialogue / roleplay / quiz carries a `status`
//   - every source-derived item (status from_source | needs_review) has a
//     non-empty sourceRefs[]  (authored / backlog items are exempt)
//   - every sourceRef has a valid sourceType (image|video|doc|authored);
//     authored sourceRefs include a note (traceability)
//   - authored content (status "authored" OR any authored sourceRef) carries
//     non-empty sourceRefs  ["authored-items-have-authored-sourceRefs"]
//   [Phase 1B additions]
//   - dialogues: non-empty lines; each line has speaker (staff|customer) + zh + pinyin + vi
//   - roleplays: customerGoalVi + staffGoalVi + non-empty requiredPhrases[]
//   - quizzes: valid type + promptVi + correctAnswer; correctAnswer ∈ options
//     (when options present); generatedFrom (if set) resolves to a real
//     vocab/sentencePattern id collected across all files

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), "content");

const errors = [];
const counts = {
  files: 0,
  courses: 0,
  lessons: 0,
  vocab: 0,
  sentencePatterns: 0,
  measureWords: 0,
  brandReferences: 0,
  referenceTables: 0,
  gaps: 0,
  dialogues: 0,
  dialogueLines: 0,
  roleplays: 0,
  quizzes: 0,
};

const SOURCE_DERIVED = new Set(["from_source", "needs_review"]);
const SOURCE_TYPES = new Set(["image", "video", "doc", "authored"]);
const QUIZ_TYPES = new Set([
  "meaning_mcq",
  "hanzi_to_pinyin",
  "listening_mcq",
  "fill_pinyin",
  "choose_reply",
]);
const SPEAKERS = new Set(["staff", "customer"]);

const has = (v) => typeof v === "string" && v.trim().length > 0;
const hasSources = (o) => Array.isArray(o.sourceRefs) && o.sourceRefs.length > 0;

// Global registry of vocab + sentencePattern ids, used to resolve
// quiz.generatedFrom references. Populated in pass 1 before validation.
const knownRefIds = new Set();

function checkStatusAndSource(item, where) {
  if (!has(item.status)) {
    errors.push(`${where}: missing status`);
    return;
  }
  if (SOURCE_DERIVED.has(item.status) && !hasSources(item)) {
    errors.push(`${where}: status "${item.status}" requires non-empty sourceRefs`);
  }
}

function checkSourceRefs(item, where) {
  if (!Array.isArray(item.sourceRefs)) return;
  item.sourceRefs.forEach((s, i) => {
    if (!s || !SOURCE_TYPES.has(s.sourceType)) {
      errors.push(`${where}: sourceRefs[${i}] has invalid/missing sourceType`);
    } else if (s.sourceType === "authored" && !has(s.note)) {
      errors.push(`${where}: authored sourceRefs[${i}] should include a note`);
    }
  });
}

// "authored items have authored sourceRefs": authored content — flagged either
// by status "authored" or by carrying an authored sourceRef — must keep a
// non-empty sourceRefs[] for traceability. (Phase 1A numbers/colors are
// status "authored" but cite the slide via an "image" ref — still non-empty.)
function checkAuthoredTraceability(item, where) {
  const authoredRef =
    Array.isArray(item.sourceRefs) &&
    item.sourceRefs.some((s) => s && s.sourceType === "authored");
  if ((item.status === "authored" || authoredRef) && !hasSources(item)) {
    errors.push(`${where}: authored content must carry non-empty sourceRefs`);
  }
}

function checkProvenance(item, where) {
  checkStatusAndSource(item, where);
  checkSourceRefs(item, where);
  checkAuthoredTraceability(item, where);
}

function validateVocab(v, where) {
  if (!has(v.id)) errors.push(`${where}: vocab missing id`);
  const w = `${where} > vocab "${v.id ?? "?"}"`;
  if (!has(v.hanzi)) errors.push(`${w}: missing hanzi`);
  if (!has(v.pinyin)) errors.push(`${w}: missing pinyin`);
  if (!has(v.meaningVi)) errors.push(`${w}: missing meaningVi`);
  checkProvenance(v, w);
  counts.vocab++;
}

function validateSentencePattern(s, where) {
  if (!has(s.id)) errors.push(`${where}: sentencePattern missing id`);
  const w = `${where} > sentencePattern "${s.id ?? "?"}"`;
  if (!has(s.zh)) errors.push(`${w}: missing zh`);
  if (!has(s.pinyin)) errors.push(`${w}: missing pinyin`);
  if (!has(s.vi)) errors.push(`${w}: missing vi`);
  checkProvenance(s, w);
  counts.sentencePatterns++;
}

function validateMeasureWord(m, where) {
  if (!has(m.id)) errors.push(`${where}: measureWord missing id`);
  const w = `${where} > measureWord "${m.id ?? "?"}"`;
  if (!has(m.hanzi)) errors.push(`${w}: missing hanzi`);
  if (!has(m.pinyin)) errors.push(`${w}: missing pinyin`);
  if (!has(m.usesForVi)) errors.push(`${w}: missing usesForVi`);
  checkProvenance(m, w);
  counts.measureWords++;
}

function validateBrand(b, where) {
  if (!has(b.id)) errors.push(`${where}: brand missing id`);
  const w = `${where} > brand "${b.id ?? "?"}"`;
  if (!has(b.latinName)) errors.push(`${w}: missing latinName`);
  if (!has(b.hanzi)) errors.push(`${w}: missing hanzi`);
  if (!has(b.pinyin)) errors.push(`${w}: missing pinyin`);
  checkProvenance(b, w);
  counts.brandReferences++;
}

function validateDialogue(d, where) {
  if (!has(d.id)) errors.push(`${where}: dialogue missing id`);
  const w = `${where} > dialogue "${d.id ?? "?"}"`;
  checkProvenance(d, w);
  if (!Array.isArray(d.lines) || d.lines.length === 0) {
    errors.push(`${w}: must have a non-empty lines[]`);
  }
  (d.lines ?? []).forEach((ln, i) => {
    const lw = `${w} > line[${i}]`;
    if (!SPEAKERS.has(ln.speaker)) errors.push(`${lw}: speaker must be staff|customer`);
    if (!has(ln.zh)) errors.push(`${lw}: missing zh`);
    if (!has(ln.pinyin)) errors.push(`${lw}: missing pinyin`);
    if (!has(ln.vi)) errors.push(`${lw}: missing vi`);
    counts.dialogueLines++;
  });
  counts.dialogues++;
}

function validateRoleplay(r, where) {
  if (!has(r.id)) errors.push(`${where}: roleplay missing id`);
  const w = `${where} > roleplay "${r.id ?? "?"}"`;
  checkProvenance(r, w);
  if (!has(r.customerGoalVi)) errors.push(`${w}: missing customerGoalVi`);
  if (!has(r.staffGoalVi)) errors.push(`${w}: missing staffGoalVi`);
  if (!Array.isArray(r.requiredPhrases) || r.requiredPhrases.length === 0) {
    errors.push(`${w}: requiredPhrases must be a non-empty array`);
  }
  counts.roleplays++;
}

function validateQuiz(q, where) {
  if (!has(q.id)) errors.push(`${where}: quiz missing id`);
  const w = `${where} > quiz "${q.id ?? "?"}"`;
  if (!QUIZ_TYPES.has(q.type)) errors.push(`${w}: invalid/missing type`);
  if (!has(q.promptVi)) errors.push(`${w}: missing promptVi`);
  if (!has(q.correctAnswer)) errors.push(`${w}: missing correctAnswer`);
  if (
    Array.isArray(q.options) &&
    q.options.length > 0 &&
    has(q.correctAnswer) &&
    !q.options.includes(q.correctAnswer)
  ) {
    errors.push(`${w}: correctAnswer is not one of options[]`);
  }
  if (has(q.generatedFrom) && !knownRefIds.has(q.generatedFrom)) {
    errors.push(
      `${w}: generatedFrom "${q.generatedFrom}" does not match any vocab/sentencePattern id`
    );
  }
  checkProvenance(q, w);
  counts.quizzes++;
}

function validateLesson(l, where) {
  if (!has(l.id)) errors.push(`${where}: lesson missing id`);
  const w = `${where} > lesson "${l.id ?? "?"}"`;
  checkProvenance(l, w);
  for (const v of l.vocabulary ?? []) validateVocab(v, w);
  for (const s of l.sentencePatterns ?? []) validateSentencePattern(s, w);
  for (const m of l.measureWords ?? []) validateMeasureWord(m, w);
  for (const d of l.dialogues ?? []) validateDialogue(d, w);
  for (const r of l.roleplays ?? []) validateRoleplay(r, w);
  for (const q of l.quizzes ?? []) validateQuiz(q, w);
  counts.lessons++;
}

function validateCourse(c, file) {
  if (!has(c.id)) errors.push(`${file}: course missing id`);
  const w = `${file} > course "${c.id ?? "?"}"`;
  if (!Array.isArray(c.lessons)) errors.push(`${w}: lessons must be an array`);
  for (const l of c.lessons ?? []) validateLesson(l, w);
  counts.courses++;
}

function validateReferenceTable(t, file) {
  if (!has(t.id)) errors.push(`${file}: referenceTable missing id`);
  const w = `${file} > referenceTable "${t.id ?? "?"}"`;
  for (const b of t.brands ?? []) validateBrand(b, w);
  for (const v of t.vocab ?? []) validateVocab(v, w);
  counts.referenceTables++;
}

function validateGapBacklog(g, file) {
  if (!has(g.id)) errors.push(`${file}: gap backlog missing id`);
  const w = `${file} > gaps`;
  for (const gap of g.gaps ?? []) {
    if (!has(gap.id)) errors.push(`${w}: gap missing id`);
    if (gap.status !== "backlog")
      errors.push(`${w} > "${gap.id ?? "?"}": status must be "backlog"`);
    counts.gaps++;
  }
}

// ---- Parse every file once ----
const parsed = [];
const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

for (const file of files) {
  counts.files++;
  try {
    parsed.push({ file, data: JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8")) });
  } catch (e) {
    errors.push(`${file}: JSON parse error — ${e.message}`);
  }
}

// ---- Pass 1: collect vocab + sentencePattern ids for generatedFrom resolution ----
for (const { data } of parsed) {
  for (const l of data.lessons ?? []) {
    for (const v of l.vocabulary ?? []) if (has(v.id)) knownRefIds.add(v.id);
    for (const s of l.sentencePatterns ?? []) if (has(s.id)) knownRefIds.add(s.id);
  }
  for (const v of data.vocab ?? []) if (has(v.id)) knownRefIds.add(v.id);
}

// ---- Pass 2: validate ----
for (const { file, data } of parsed) {
  if (Array.isArray(data.lessons)) validateCourse(data, file);
  else if (Array.isArray(data.gaps)) validateGapBacklog(data, file);
  else if (data.type || Array.isArray(data.brands) || Array.isArray(data.vocab))
    validateReferenceTable(data, file);
  else errors.push(`${file}: unrecognized top-level shape`);
}

console.log("\n=== VDF Chinese Sales Tutor — content validation (Phase 1A + 1B) ===\n");
console.log("Counts:");
console.log(`  JSON files          : ${counts.files}`);
console.log(`  Courses             : ${counts.courses}`);
console.log(`  Lessons             : ${counts.lessons}`);
console.log(`  Vocabulary items    : ${counts.vocab}`);
console.log(`  Sentence patterns   : ${counts.sentencePatterns}`);
console.log(`  Measure words       : ${counts.measureWords}`);
console.log(`  Brand references    : ${counts.brandReferences}`);
console.log(`  Reference tables    : ${counts.referenceTables}`);
console.log(`  Content gaps        : ${counts.gaps}`);
console.log(`  Dialogues           : ${counts.dialogues}`);
console.log(`  Dialogue lines      : ${counts.dialogueLines}`);
console.log(`  Roleplays           : ${counts.roleplays}`);
console.log(`  Quizzes             : ${counts.quizzes}`);

if (errors.length === 0) {
  console.log("\n✅ PASS — no validation errors.\n");
  process.exit(0);
} else {
  console.log(`\n❌ FAIL — ${errors.length} error(s):\n`);
  for (const e of errors) console.log(`  - ${e}`);
  console.log("");
  process.exit(1);
}
