# VDF Sales Tutor

Ứng dụng học ngoại ngữ thực dụng cho **nhân viên bán hàng miễn thuế VDF** tại sân bay — 3 khoá: 🇨🇳 Tiếng Trung · 🇬🇧 Tiếng Anh · 🇰🇷 Tiếng Hàn. Học nền tảng → bán hàng, có luyện nghe/nói, quiz, chứng nhận, theo dõi tiến độ và Manager Dashboard.

- **Production:** https://vdf-learning.vercel.app
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Auth + Postgres) · Vercel.

## 📦 Bàn giao cho IT

➡️ **Đọc [`IT_HANDOVER.md`](./IT_HANDOVER.md)** — hướng dẫn đầy đủ: kiến trúc, biến môi trường, triển khai, migrations, mô hình bảo mật, vận hành, checklist chuyển giao tài khoản.

## Chạy local

```bash
npm install
cp .env.example .env.local      # điền NEXT_PUBLIC_SUPABASE_URL + ANON_KEY (xem .env.example)
npm run dev                     # http://localhost:3000
```

> Không có biến env Supabase: app chạy ở chế độ ẩn danh (local-only) — tiện cho dev sớm.

## Kiểm thử trước khi deploy

```bash
npm run typecheck
rm -rf .next && npm run build
npm run validate-content
```

## Cấu trúc chính

| Đường dẫn | Nội dung |
|---|---|
| `app/` | Routes (Next.js App Router) |
| `components/` | UI components |
| `lib/` | Logic: nội dung khoá (`englishCourse.ts`, `koreanCourse.ts`), tiến độ, speech, Supabase client |
| `content/*.json` | Nội dung tiếng Trung (nguồn được kiểm thử) |
| `supabase/migrations/` | Schema DB (001 → 007) — xem IT_HANDOVER |
| `scripts/` | Công cụ sinh nội dung/seed/gói duyệt |
| `public/` | PWA icons, logo, ảnh minh hoạ |

Bảo mật & chi tiết khác: [`SECURITY.md`](./SECURITY.md) và chỉ mục tài liệu trong [`IT_HANDOVER.md`](./IT_HANDOVER.md).
