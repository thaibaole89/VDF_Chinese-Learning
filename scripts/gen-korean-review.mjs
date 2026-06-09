// Generates KOREAN_REVIEW_PACKET.md straight from the source of truth
// (lib/koreanCourse.ts + lib/koreanGrammar.ts) so the native-review document
// can never drift from what the app actually shows. Run: node scripts/gen-korean-review.mjs
// Requires Node >= 22 (TypeScript type-stripping). Docs only — touches no app code.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const { KOREAN_COURSE } = await import("../lib/koreanCourse.ts");
const { KOREAN_GRAMMAR } = await import("../lib/koreanGrammar.ts");

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const out = [];
const w = (s = "") => out.push(s);

const lessons = KOREAN_COURSE.modules.flatMap((m) => m.lessons);
const phraseCount = lessons.reduce((n, l) => n + l.phrases.length, 0);
const grammarTipCount = Object.values(KOREAN_GRAMMAR).reduce((n, a) => n + a.length, 0);

// ---------------- Header ----------------
w(`# Gói duyệt nội dung tiếng Hàn — VDF Sales Tutor`);
w(``);
w(`> **Tự động sinh** từ \`lib/koreanCourse.ts\` + \`lib/koreanGrammar.ts\`.`);
w(`> KHÔNG sửa tay file này — sửa nội dung trong source rồi chạy lại \`node scripts/gen-korean-review.mjs\`.`);
w(``);
w(`- **Khoá:** ${KOREAN_COURSE.titleVi} (${KOREAN_COURSE.titleKo}) · id \`${KOREAN_COURSE.id}\``);
w(`- **Quy mô:** ${KOREAN_COURSE.modules.length} module · ${lessons.length} bài · ${phraseCount} câu · ${grammarTipCount} tip ngữ pháp`);
w(`- **Trạng thái:** *Đang chờ duyệt nội bộ về ngôn ngữ* — chưa bật cho học thật đại trà.`);
w(``);
w(`---`);
w(``);

// ---------------- Reviewer guide ----------------
w(`## 1. Dành cho người duyệt (bản xứ / thạo tiếng Hàn)`);
w(``);
w(`Mục tiêu: đảm bảo từng câu **đúng, tự nhiên, lịch sự đúng mực** cho ngữ cảnh **bán hàng miễn thuế sân bay** phục vụ khách Hàn.`);
w(``);
w(`**6 tiêu chí cần soát mỗi câu:**`);
w(``);
w(`1. **Chính tả Hangul** — đúng chính tả, đúng dấu cách, đúng từ.`);
w(`2. **Phiên âm (Revised Romanization)** — khớp Hangul, nhất quán hệ RR.`);
w(`3. **Mức kính ngữ** — phải là kính ngữ phục vụ khách (해요체 / 합쇼체, đuôi -세요, -시겠어요?, -드릴게요…). Không quá suồng sã, không quá cứng/cổ.`);
w(`4. **Tự nhiên** — người Hàn ở quầy có thật sự nói vậy không? Có cách nói hay hơn không?`);
w(`5. **Nghĩa tiếng Việt** — bản dịch VN có đúng & dễ hiểu cho nhân viên không.`);
w(`6. **Phù hợp ngữ cảnh & văn hoá** — đúng quy định miễn thuế (giấy tờ, độ tuổi, hạn mức), không gây khó chịu.`);
w(``);
w(`**Thang mức độ lỗi:**`);
w(``);
w(`- 🔴 **P0 — Sai/khó chịu:** sai nghĩa, sai ngữ pháp nặng, bất lịch sự → phải sửa trước khi dạy.`);
w(`- 🟡 **P1 — Chưa tự nhiên:** hiểu được nhưng không giống người bản xứ → nên sửa.`);
w(`- 🟢 **P2 — Gợi ý nhỏ:** phiên âm/cách diễn đạt có thể trau chuốt → tuỳ chọn.`);
w(``);
w(`**Cách ghi:** điền vào **Bảng tổng hợp chỉnh sửa** ngay dưới đây (mỗi lỗi 1 dòng). Cột "Đúng?" trong mỗi bài chỉ để tick nhanh ✅ (ổn) / ✏️ (cần sửa — ghi chi tiết vào bảng tổng hợp).`);
w(``);

// ---------------- Master correction log ----------------
w(`## 2. Bảng tổng hợp chỉnh sửa (người duyệt điền)`);
w(``);
w(`| # | Bài (id) | Câu (id) | Tiêu chí | Hiện tại | Đề xuất sửa | Mức |`);
w(`|---|----------|----------|----------|----------|-------------|-----|`);
for (let i = 1; i <= 6; i++) w(`| ${i} |  |  |  |  |  |  |`);
w(`| … |  |  |  |  |  |  |`);
w(``);
w(`---`);
w(``);

// ---------------- Per-module / per-lesson content ----------------
w(`## 3. Nội dung để soát (theo module → bài)`);
w(``);

let lessonNo = 0;
for (const mod of KOREAN_COURSE.modules) {
  w(`### ▌Module: ${mod.titleVi} — ${mod.titleKo}`);
  w(``);
  w(`*${mod.objectiveVi}*`);
  w(``);
  for (const l of mod.lessons) {
    lessonNo++;
    w(`#### ${lessonNo}. ${l.titleVi} — ${l.titleKo}  \`${l.id}\``);
    w(``);
    w(`> Mục tiêu: ${l.objectiveVi}`);
    w(``);
    // phrases
    w(`**Câu (${l.phrases.length}):**`);
    w(``);
    w(`| # | id | Hangul | Phiên âm (RR) | Tiếng Việt | Đúng? |`);
    w(`|---|----|--------|---------------|------------|-------|`);
    l.phrases.forEach((p, i) => {
      w(`| ${i + 1} | \`${p.id}\` | ${esc(p.ko)} | ${esc(p.roman)} | ${esc(p.vi)} |  |`);
    });
    w(``);
    // dialogue
    if (l.dialogue) {
      w(`**Hội thoại — ${esc(l.dialogue.titleVi)}:**`);
      w(``);
      for (const ln of l.dialogue.lines) {
        const who = ln.speaker === "staff" ? "NV" : "Khách";
        w(`- **${who}:** ${esc(ln.ko)} — *${esc(ln.roman)}* — ${esc(ln.vi)}`);
      }
      w(``);
    }
    // roleplay
    if (l.roleplay) {
      w(`**Đóng vai — ${esc(l.roleplay.titleVi)}:** Khách: ${esc(l.roleplay.customerGoalVi)} · NV: ${esc(l.roleplay.staffGoalVi)} · (câu bắt buộc: ${l.roleplay.requiredPhraseIds.join(", ")})`);
      w(``);
    }
    // quiz
    if (l.quiz?.length) {
      w(`**Quiz (đáp án đúng):**`);
      w(``);
      for (const q of l.quiz) {
        w(`- ${esc(q.promptVi)} → **${esc(q.correctAnswer)}**`);
      }
      w(``);
    }
    // grammar
    const tips = KOREAN_GRAMMAR[l.id] || [];
    if (tips.length) {
      w(`**Ngữ pháp / cách ghép câu (${tips.length} tip):**`);
      w(``);
      for (const t of tips) {
        w(`- **${esc(t.titleVi)}**${t.pattern ? ` — mẫu: \`${esc(t.pattern)}\`` : ""}`);
        w(`  - ${esc(t.bodyVi)}`);
        for (const ex of t.examples ?? []) {
          w(`  - VD: ${esc(ex.text)}${ex.gloss ? ` (*${esc(ex.gloss)}*)` : ""} — ${esc(ex.vi)}`);
        }
      }
      w(``);
    } else {
      w(`**Ngữ pháp:** *(chưa có tip — kiểm tra xem có thiếu không)*`);
      w(``);
    }
    w(`> ✍️ Ghi chú người duyệt cho bài này:`);
    w(``);
    w(`---`);
    w(``);
  }
}

// ---------------- Sign-off ----------------
w(`## 4. Xác nhận hoàn tất duyệt`);
w(``);
w(`| | Họ tên | Vai trò | Ngày | Kết luận |`);
w(`|---|--------|---------|------|----------|`);
w(`| Người duyệt ngôn ngữ |  |  |  | ☐ Đạt ☐ Cần sửa lại |`);
w(`| Người phê duyệt (PO/Ops) |  |  |  | ☐ Đồng ý đưa vào pilot |`);
w(``);
w(`> Sau khi duyệt xong: chuyển các dòng trong **Bảng tổng hợp chỉnh sửa** cho team kỹ thuật cập nhật vào \`lib/koreanCourse.ts\` / \`lib/koreanGrammar.ts\`, rồi chạy lại script này để ra bản mới.`);
w(``);

const target = path.join(root, "KOREAN_REVIEW_PACKET.md");
fs.writeFileSync(target, out.join("\n"), "utf8");
console.log(`✅ Wrote ${path.relative(root, target)}`);
console.log(`   modules=${KOREAN_COURSE.modules.length} lessons=${lessons.length} phrases=${phraseCount} grammarTips=${grammarTipCount}`);
