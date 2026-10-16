import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
});

export const studentSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiya kamida 2 ta harfdan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri"),
  birthDate: z.string().min(1, "Tug'ilgan sana majburiy"),
  groupId: z.coerce.number().min(1, "Guruhni tanlang"),
  status: z.enum(['active', 'frozen', 'left']),
  joinedAt: z.string().min(1, "Qo'shilgan sana majburiy"),
  note: z.string().optional()
});

export const groupSchema = z.object({
  name: z.string().min(2, "Guruh nomi majburiy"),
  course: z.string().min(2, "Kurs nomi majburiy"),
  teacher: z.string().min(2, "O'qituvchi ismi majburiy"),
  days: z.enum(['toq', 'juft']),
  time: z.string().min(1, "Vaqtni kiriting"),
  monthlyPrice: z.coerce.number().min(10000, "Narx noto'g'ri"),
  startDate: z.string().min(1, "Boshlanish sanasi majburiy"),
  status: z.enum(['active', 'finished'])
});

export const paymentSchema = z.object({
  studentId: z.coerce.number().min(1, "Talabani tanlang"),
  amount: z.coerce.number().min(1000, "Summa kiritilishi shart"),
  month: z.string().min(1, "Oyni tanlang"),
  method: z.enum(['naqd', 'karta', 'click']),
  paidAt: z.string().min(1, "To'lov sanasi kiritilishi shart")
});

export const settingsSchema = z.object({
  fullName: z.string().trim().min(3, "To'liq ism majburiy"),
  username: z.string().trim().min(3, "Foydalanuvchi nomi kamida 3 ta belgi"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional()
}).refine(
  (data) => {
    if (data.newPassword) return data.newPassword.length >= 6 && Boolean(data.currentPassword);
    return true;
  },
  {
    message: "Parolni o'zgartirish uchun joriy parolni kiriting; yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
    path: ['newPassword']
  }
);
