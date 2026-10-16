# EduPanel

O'quv markazi uchun React asosidagi boshqaruv paneli. Talabalar va guruhlarni yuritish, to'lovlarni qayd qilish, davomat belgilash va oylik qarzdorlikni kuzatish imkonini beradi.

## Ishga tushirish

Node.js o'rnatilgan bo'lishi kerak. Windows PowerShell'da `npm` buyrug'i PowerShell skript siyosati sabab bloklansa, quyidagi misollardagi kabi `npm.cmd` dan foydalaning. Bu loyiha xatosi emas; `npm.ps1` ishga tushishiga ruxsat berilmaganini anglatadi.

```sh
npm.cmd install
npm.cmd run dev
```

`npm.cmd run dev` Vite interfeysini va `json-server` ma'lumotlar serverini birga ishga tushiradi. Interfeys `http://localhost:5173`, API esa `http://localhost:3001` manzilida ishlaydi. Demo ma'lumotlar `db.json` faylida saqlanadi. Ikkala server ham bitta terminal oynasida log chiqaradi; to'xtatish uchun `Ctrl+C` bosing.

Serverlarni alohida ishga tushirish kerak bo'lsa, ikkita terminalda `npm.cmd run server` va `npm.cmd run client` buyruqlarini bajaring. Faqat API kerak bo'lsa `npm.cmd run server`, faqat interfeys kerak bo'lsa `npm.cmd run client` dan foydalaning.

Demo hisob:

- Foydalanuvchi nomi: `admin`
- Parol: `admin123`

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
