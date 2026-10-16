# EduPanel

O'quv markazi uchun React asosidagi boshqaruv paneli. Talabalar va guruhlarni yuritish, to'lovlarni qayd qilish, davomat belgilash va oylik qarzdorlikni kuzatish imkonini beradi.

## Ishga tushirish

Node.js o'rnatilgan bo'lishi kerak.

```sh
npm install
npm run dev
```

`npm run dev` Vite interfeysini va `json-server` ma'lumotlar serverini birga ishga tushiradi. Interfeys odatda `http://localhost:5173`, API esa `http://localhost:3001` manzilida ishlaydi. Demo ma'lumotlar `db.json` faylida saqlanadi.

Demo hisob:

- Foydalanuvchi nomi: `admin`
- Parol: `admin123`

## Buyruqlar

```sh
npm run lint     # kodni tekshirish
npm run build    # production build yaratish
npm run preview  # build natijasini lokal ko'rish
npm run server   # faqat json-server'ni ishga tushirish
```

## Asosiy bo'limlar

- Bosh panel: faol talabalar va guruhlar, joriy oy tushumi, qarzdorlar va so'nggi to'lovlar.
- Talabalar va guruhlar: qidirish, qo'shish, tahrirlash hamda holatni ko'rish.
- To'lovlar: yangi to'lovlarni qayd etish, oy yoki talaba bo'yicha filtrlash.
- Davomat: guruh va sana bo'yicha kelganlik holatini belgilash.
- Sozlamalar: admin ma'lumotlari va demo parolini yangilash.

## Muhim

Bu loyiha `json-server` va `db.json` orqali ishlaydigan demo. Parollarni tekshirish va saqlash usuli production muhiti uchun mo'ljallanmagan; haqiqiy foydalanishda server tomonda autentifikatsiya, xavfsiz parol xeshlash va ma'lumotlar bazasi kerak bo'ladi.
