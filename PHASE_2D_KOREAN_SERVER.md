# Phase 2D — Tiến độ tiếng Hàn lên máy chủ

Mục tiêu: đưa tiến độ học **tiếng Hàn** lên Supabase (đồng bộ đa thiết bị + quản lý theo dõi được), **tái dùng nguyên** lớp progress generic của migration 005. Tiếng Hàn **vẫn KHÔNG** vào Bảng vinh danh và **KHÔNG** có chứng nhận.

## Đã code sẵn (deploy cùng phase)
- `supabase/migrations/006_korean_course_progress.sql` — seed `korean-sales` (156 câu / 22 bài, gồm 6 bài Nền tảng của Phase 2E) vào `course_phrases`. **Không** thêm bảng/RPC/grant — Hàn dùng chung RPC của 005.
- `lib/koreanServerProgress.ts` — đọc tiến độ Hàn (server) + tổng hợp cho manager.
- `lib/koreanActions.ts` — server actions ghi qua RPC generic (validate theo catalog Hàn). Metadata-only, **không** transcript.
- Trang chủ Hàn, trang bài học Hàn, thẻ ở `/courses`, Manager Dashboard + chi tiết học viên → đọc/ghi server, fallback cục bộ khi chưa áp dụng migration.

## Áp dụng (bạn chạy — ~1 phút)
**Phụ thuộc:** migration **005 đã áp dụng** (đã làm trước đó).

1. Mở **Supabase → SQL Editor → New query**.
2. Dán toàn bộ nội dung `supabase/migrations/006_korean_course_progress.sql` → **Run**.
   (Idempotent — chạy lại nhiều lần vẫn an toàn, không mất dữ liệu; chỉ đụng `course_id='korean-sales'`.)

### Kết quả mong đợi (dòng verify cuối script)
| cột | giá trị đúng |
|---|---|
| `korean_phrases_seeded` | **156** |
| `korean_lessons` | **22** |

## Sau khi chạy
- **Không cần deploy lại** — code đã live, tự dùng các dòng seed này.
- Học thử 1 câu tiếng Hàn → đổi thiết bị / đăng nhập lại vẫn còn.
- Đăng nhập manager → mục **“Tiến độ khoá tiếng Hàn 🇰🇷”** hiện số liệu.

## Ràng buộc giữ nguyên
- Hàn **không** vào Hall of Fame, **không** chứng nhận.
- Luyện đọc chỉ lưu **metadata** (kết quả + điểm), **không** lưu lời nói/transcript.
- Mỗi nhân viên chỉ đọc/ghi của mình; quản lý **chỉ xem**. Không service_role, không secret.
- Không đụng tới tiếng Trung / tiếng Anh.
