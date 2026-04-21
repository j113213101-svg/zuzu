# 租租 zuzu

台中在地租屋媒合平台．Next.js 16 + Prisma + Postgres．

## 本機開發

```bash
npm install
# DATABASE_URL 指向任一 Postgres（本機 docker 或 Neon）
npx prisma db push
npm run seed          # 建立 demo 帳號與假房源
npm run dev
```

Demo 仲介帳號：
- `demo@zuzu.tw` / `zuzu1234`
- `alex@zuzu.tw` / `zuzu1234`

## 部署到 Vercel + Neon

1. 在 https://neon.tech 建立免費 Postgres 專案，複製 pooled `DATABASE_URL`
2. 在 https://vercel.com → Add New → Project → Import this repo
3. 環境變數（Project Settings → Environment Variables）：
   - `DATABASE_URL` = Neon 的 pooled connection string
   - `AUTH_SECRET` = `openssl rand -base64 32` 的輸出
4. Deploy（build 會自動跑 `prisma db push` 建表）
5. 第一次部署後，在本機跑一次 seed 灌資料：
   ```
   DATABASE_URL="<同上>" npm run seed
   ```

## 技術棧

- Next.js 16 (App Router, Turbopack)
- Prisma 6 + PostgreSQL (Neon)
- jose (JWT session cookie) + bcryptjs
- Tailwind CSS 4 + Morandi palette
- TypeScript
