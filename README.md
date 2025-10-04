# Project Bolt (Starter)

Bộ khởi tạo ứng dụng React + Vite + TypeScript nhỏ, kèm Supabase để lưu trữ *invitations* (thư mời). Tài liệu này viết bằng tiếng Việt để dễ dùng nhanh.

## Tổng quan

Ứng dụng cho phép tạo một thư mời cá nhân hóa, lưu vào Supabase và cung cấp một đường link chia sẻ (query param `?code=`) để người khác xem.

## Yêu cầu

- Node.js (>= 18 recommended)
- npm hoặc pnpm/yarn
- Một project Supabase (URL + ANON KEY) với bảng `invitations` (có sẵn migration trong `supabase/migrations`)

## Biến môi trường

Tạo file `.env` (hoặc cấu hình host) với các biến sau (Vite yêu cầu `VITE_` prefix):

- `VITE_SUPABASE_URL` — URL của Supabase
- `VITE_SUPABASE_ANON_KEY` — ANON public key

Ví dụ (.env):

VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key

## Scripts (từ `package.json`)

- `npm run dev` — khởi động dev server (Vite)
- `npm run build` — build production bundle
- `npm run preview` — preview production build
- `npm run lint` — chạy ESLint
- `npm run typecheck` — chạy TypeScript typecheck (noEmit)

Chạy dev:

1. Cài đặt phụ thuộc: `npm install`
2. Thiết lập `.env` với biến Supabase
3. `npm run dev`

## Database / Migration

Migration tạo bảng `invitations` nằm tại:

`supabase/migrations/20251003165711_create_invitations_table.sql`

Kiểm tra/áp dụng migration bằng CLI Supabase (nếu dùng local development):

1. Cài `supabase` CLI theo hướng dẫn chính thức
2. Áp dụng migration hoặc import schema theo tài liệu Supabase

## Các tệp chính

- `src/main.tsx` — entry, mount React
- `src/App.tsx` — ứng dụng chính (form tạo thư, hiển thị link, xem danh sách, load invitation từ query param `code`)
- `src/lib/supabase.ts` — khởi tạo client Supabase; lưu ý sử dụng `import.meta.env.VITE_SUPABASE_*`
- `src/components/InvitationView.tsx` — component hiển thị thư mời (xem khi truy cập link có `code`)
- `src/components/InvitationList.tsx` — danh sách thư mời

## Ghi chú phát triển

- Đường link chia sẻ được tạo dạng: `${window.location.origin}${window.location.pathname}?code=${share_code}`
- Khi mở link có `code` thì `App` sẽ tải invitation tương ứng và tăng `views_count`

## Triển khai

- Build với `npm run build` và triển khai thư mục `dist` lên hosting tĩnh (Vercel, Netlify, Cloudflare Pages, ...). Đừng quên cấu hình biến môi trường Supabase trên môi trường production.

## Liên hệ / License

Tệp mẫu, dùng cho mục đích demo. Tuỳ chỉnh theo nhu cầu.
