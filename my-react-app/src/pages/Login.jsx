import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '../schemas/authSchema';
import api from '../api/axios';

export default function Login() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryHelp, setShowRecoveryHelp] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await api.get('/admins', {
        params: { username: data.username, password: data.password }
      });
      if (res.data.length > 0) {
        const adminWithoutPassword = { ...res.data[0] };
        delete adminWithoutPassword.password;
        localStorage.setItem('admin', JSON.stringify(adminWithoutPassword));
        navigate('/dashboard');
      } else {
        setError("Foydalanuvchi nomi yoki parol noto'g'ri!");
      }
    } catch {
      setError("Serverga ulanishda xatolik yuz berdi. json-server ishga tushganini tekshiring.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Najot Ta'lim'ga kirish</h2>
          <p className="text-slate-500 text-sm mt-1">Admin panelga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Foydalanuvchi nomi</label>
            <input type="text" autoComplete="username" {...register('username')} className="input" placeholder="admin" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="input pr-11"
                placeholder="Parolingizni kiriting"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            <button
              type="button"
              className="mt-2 text-xs text-blue-600 hover:underline"
              aria-expanded={showRecoveryHelp}
              onClick={() => setShowRecoveryHelp((visible) => !visible)}
            >
              Parolni unutdingizmi?
            </button>
            {showRecoveryHelp && (
              <p role="status" className="mt-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                Email yoki telefon orqali tiklash bu loyihada sozlanmagan. Hisob egasi yoki tizim administratoriga
                murojaat qiling. Demo hisob: <strong>admin / admin123</strong>.
              </p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">Demo hisob: admin / admin123</p>
      </div>
    </div>
  );
}
