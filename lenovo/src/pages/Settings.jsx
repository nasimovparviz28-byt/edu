import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema } from '../schemas/authSchema';
import api from '../api/axios';
import { getErrorMessage } from '../utils/errors';
import { readStoredAdmin } from '../utils/auth';

export default function Settings() {
  const stored = readStoredAdmin() || {};
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: stored.fullName || '',
      username: stored.username || '',
      currentPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setMessage('');
    setError('');
    try {
      const res = await api.get(`/admins/${stored.id}`);
      const admin = res.data;

      if (data.newPassword) {
        if (data.currentPassword !== admin.password) {
          setError("Joriy parol noto'g'ri.");
          return;
        }
      }

      const payload = {
        fullName: data.fullName,
        username: data.username
      };
      if (data.newPassword) payload.password = data.newPassword;

      const updated = await api.patch(`/admins/${stored.id}`, payload);
      const safe = { ...updated.data };
      delete safe.password;
      localStorage.setItem('admin', JSON.stringify(safe));
      setMessage('Sozlamalar saqlandi.');
    } catch (err) {
      setError(getErrorMessage(err, "Sozlamalarni saqlashda xatolik yuz berdi."));
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Sozlamalar</h2>
      <div className="card p-6">
        {message && <p className="mb-3 text-sm text-emerald-600">{message}</p>}
        {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm">To'liq ism</label>
            <input className="input mt-1" {...register('fullName')} />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-sm">Foydalanuvchi nomi</label>
            <input className="input mt-1" {...register('username')} />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>
          <div>
            <label className="text-sm">Joriy parol (parolni o'zgartirish uchun)</label>
            <input type="password" className="input mt-1" {...register('currentPassword')} />
          </div>
          <div>
            <label className="text-sm">Yangi parol</label>
            <input type="password" className="input mt-1" {...register('newPassword')} />
            {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
          </div>
          <button disabled={isSubmitting} className="btn-primary">
            Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
