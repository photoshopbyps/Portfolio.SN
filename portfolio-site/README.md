# Sorawich Portfolio — Cloudflare Worker + D1

เว็บพอร์ตโฟลิโอมินิมอล ขาว-ดำ ดึงข้อมูลจาก D1 (โปรไฟล์ Upwork + ผลงาน Canva ที่คัดเลือกมา 12 ชิ้น)
เรนเดอร์ฝั่งเซิร์ฟเวอร์ใน Worker เดียว ไม่ต้องมี build step

## โครงสร้างไฟล์

```
portfolio-site/
├── wrangler.toml          # ตั้งค่า Worker + D1 binding
├── package.json           # scripts สำหรับ dev/deploy/migrate
├── migrations/
│   └── 0001_init.sql      # schema + seed data (โปรไฟล์ + ผลงาน 12 ชิ้น)
└── src/
    └── index.js           # Worker: render หน้าเว็บ + API (/api/profile, /api/portfolio)
```

## ขั้นตอน deploy (ใช้เครื่องคุณเอง)

**1. ติดตั้ง wrangler และ login**
```bash
npm install
npx wrangler login
```
จะเปิดเบราว์เซอร์ให้ล็อกอินบัญชี Cloudflare ของคุณ

**2. สร้างฐานข้อมูล D1**
```bash
npx wrangler d1 create sorawich_portfolio_db
```
คำสั่งนี้จะพิมพ์ `database_id` ออกมา — คัดลอกค่านั้นไปแทนที่
`REPLACE_WITH_YOUR_DATABASE_ID` ใน `wrangler.toml`

**3. รัน schema + seed ข้อมูล**
```bash
# ทดสอบ local ก่อน (ไม่กระทบ production)
npm run db:migrate:local

# ดูตัวอย่างบนเครื่อง
npx wrangler dev
# เปิด http://localhost:8787

# พร้อมแล้วค่อย migrate ขึ้นจริง
npm run db:migrate:remote
```

**4. Deploy**
```bash
npm run deploy
```
จะได้ลิงก์ประมาณ `https://sorawich-portfolio.<your-subdomain>.workers.dev`

**5. (ไม่บังคับ) ผูกโดเมนของตัวเอง**
ใน Cloudflare Dashboard → Workers & Pages → เลือก Worker นี้ → Settings → Domains & Routes → Add Custom Domain
(โดเมนต้องอยู่ใน Cloudflare อยู่แล้ว)

## ข้อควรรู้ / ข้อจำกัด

- **รูปธัมบ์เนล Canva**: ลิงก์รูปที่ใช้อยู่ตอนนี้ (`design.canva.ai/...`) เป็นลิงก์ที่ดึงมาจาก Canva API ณ ตอนที่คัดผลงาน ลิงก์ประเภทนี้**อาจหมดอายุได้**ในบางกรณี ถ้ารูปหายไปในอนาคต ให้บอกผมให้ดึงลิงก์ใหม่จาก Canva แล้วอัปเดตตาราง `portfolio_items` หรือจะโหลดรูปจริงมาเก็บถาวรใน Cloudflare R2/Images ก็ทำได้ (ผมช่วยต่อยอดได้ถ้าต้องการ)
- **แก้ไขข้อมูลภายหลัง**: แก้ตรงๆ ได้ด้วยคำสั่ง `wrangler d1 execute` (UPDATE/INSERT/DELETE) หรือบอกผมมาว่าจะเปลี่ยนอะไร แล้วผมจะเขียน SQL ให้
- **เพิ่ม/ลดผลงาน**: เพิ่มแถวใหม่ในตาราง `portfolio_items` ตามรูปแบบใน `migrations/0001_init.sql`
- โค้ดหน้าเว็บเป็น server-rendered ล้วนๆ (ไม่มี framework) จึงโหลดเร็วและไม่ต้อง build

## API endpoints (เผื่อเอาไปต่อยอด)

- `GET /` — หน้าเว็บเต็ม
- `GET /api/profile` — JSON ข้อมูลโปรไฟล์
- `GET /api/portfolio` — JSON รายการผลงาน
