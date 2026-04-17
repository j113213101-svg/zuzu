# 租租 zuzu

台中在地租屋媒合平台．Next.js 16 + Prisma + SQLite．

## 本機開發

```bash
npm install
npx prisma migrate dev
npm run seed          # 建立 demo 帳號與假房源
npm run dev
```

Demo 仲介帳號：
- `demo@zuzu.tw` / `zuzu1234`
- `alex@zuzu.tw` / `zuzu1234`

## 部署到 Zeabur

1. 把這個 repo push 到 GitHub
2. 到 https://zeabur.com → New Project → Deploy from GitHub → 選此 repo
3. Zeabur 會自動偵測 Next.js．等它跑完 build
4. **設定持久化儲存（SQLite 需要）**：
   - 在該服務的 Volumes 頁籤，新增 volume：mount path `/data`
5. **環境變數**：
   - `DATABASE_URL=file:/data/zuzu.db`
   - `AUTH_SECRET=<隨機 32 字元字串，用 openssl rand -base64 32>`
   - `NODE_ENV=production`
6. 綁定 domain：Networking → Add Domain
7. （首次部署後）在 Zeabur 該服務的 Terminal 執行一次：
   ```
   npm run seed:prod
   ```
   塞入 demo 房源與仲介帳號

## 技術棧

- Next.js 16 (App Router, Turbopack)
- Prisma 6 + SQLite
- jose (JWT session cookie) + bcryptjs
- Tailwind CSS 4 + Morandi palette
- TypeScript
