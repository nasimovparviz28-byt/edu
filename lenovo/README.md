# EduPanel

O'quv markazi uchun React asosidagi boshqaruv paneli. Talabalar va guruhlarni yuritish, to'lovlarni qayd qilish, davomat belgilash va oylik qarzdorlikni kuzatish imkonini beradi.

## Ishga tushirish

Node.js o'rnatilgan bo'lishi kerak. Buyruqlarni loyiha papkasida, ya'ni `package.json` fayli turgan joyda bajaring. Windows PowerShell'da `npm` buyrug'i skript siyosati sabab bloklansa, `npm.cmd` dan foydalaning.

```sh
npm.cmd install
npm.cmd run dev
```

`npm.cmd run dev` Vite interfeysini va `json-server` ma'lumotlar serverini birga ishga tushiradi. Interfeys `http://localhost:5173`, API esa `http://localhost:3001` manzilida ishlaydi. Demo ma'lumotlar `db.json` faylida saqlanadi. Ikkala server ham bitta terminal oynasida log chiqaradi; to'xtatish uchun `Ctrl+C` bosing.

Serverlarni alohida ishga tushirish kerak bo'lsa, ikkita terminalda `npm.cmd run server` va `npm.cmd run client` buyruqlarini bajaring. Faqat API kerak bo'lsa `npm.cmd run server`, faqat interfeys kerak bo'lsa `npm.cmd run client` dan foydalaning.

Demo hisob:

- Foydalanuvchi nomi: `Parviz`
- Parol: `admin123`

## Netlify'ga joylash

Loyihani GitHub orqali Netlify'ga ulanganda `netlify.toml` build buyrug'i (`npm run build`) va nashr papkasini (`dist`) sozlaydi. `public/_redirects` React Router ichki sahifalarini qayta yuklaganda Netlify 404 ko'rsatishining oldini oladi.

Netlify faqat interfeysni joylaydi; `db.json` va `json-server` u yerda API server sifatida ishlamaydi. Login va ma'lumotlarni saqlash uchun API'ni alohida serverga joylab, Netlify sayti environment variables bo'limida `VITE_API_URL` qiymatini shu API manziliga o'rnating. API Netlify saytidan so'rov qabul qilishi (CORS) kerak. Environment variable build vaqtida ishlatilgani uchun qiymatni o'rnatgandan keyin saytni qayta joylang. API sozlanmaguncha Netlify'dagi login va ma'lumotlar bilan ishlash to'liq ishlamaydi. `db.json` ichidagi demo ma'lumotlar va parollarni ommaviy serverga joylamang.

## Buyruqlar

```sh
npm.cmd run lint     # kodni tekshirish
npm.cmd run build    # production build yaratish
npm.cmd run preview  # build natijasini lokal ko'rish
npm.cmd run server   # faqat json-server'ni ishga tushirish
npm.cmd run client   # faqat Vite interfeysini ishga tushirish
```

## Asosiy bo'limlar

- Bosh panel: faol talabalar va guruhlar, joriy oy tushumi, qarzdorlar va so'nggi to'lovlar.
- Talabalar va guruhlar: qidirish, qo'shish, tahrirlash hamda holatni ko'rish.
- To'lovlar: yangi to'lovlarni qayd etish, oy yoki talaba bo'yicha filtrlash.
- Davomat: guruh va sana bo'yicha kelganlik holatini belgilash.
- Sozlamalar: admin ma'lumotlari va demo parolini yangilash.

## Muhim

Bu loyiha `json-server` va `db.json` orqali ishlaydigan demo. Parollarni tekshirish va saqlash usuli production muhiti uchun mo'ljallanmagan; haqiqiy foydalanishda server tomonda autentifikatsiya, xavfsiz parol xeshlash va ma'lumotlar bazasi kerak bo'ladi.
