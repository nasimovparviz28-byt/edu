import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, GraduationCap, KeyRound, ShieldCheck } from 'lucide-react';
import { loginSchema } from '../schemas/authSchema';
import api from '../api/axios';
import { getErrorMessage } from '../utils/errors';

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
    } catch (err) {
      setError(getErrorMessage(err, "API serverga ulanib bo'lmadi. Server ishlayotganini, VITE_API_URL va CORS sozlamalarini tekshiring."));
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7f4] p-4 dark:bg-slate-950 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#d8ff65] p-10 text-[#171918] lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[36px] border-black/5" aria-hidden="true" />
          <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full border-[48px] border-black/5" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171918] text-[#d8ff65]">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Najot Ta'lim</span>
          </div>

          <div className="relative max-w-lg py-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800/70">Admin panel</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">
              Ta'lim jarayonini bir joydan boshqaring
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-800/75">
              Talabalar, guruhlar, to'lovlar va davomatni qulay boshqarish uchun tizimga kiring.
            </p>
            <div className="mt-9 flex items-center gap-3 rounded-2xl border border-black/10 bg-white/45 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium leading-6">Faqat administrator hisoblari uchun mo'ljallangan.</p>
            </div>
          </div>

          <p className="relative text-xs font-medium text-slate-800/60">Najot Ta'lim · Boshqaruv tizimi</p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8ff65] text-[#171918]">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Najot Ta'lim · Admin panel</p>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Xush kelibsiz</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Davom etish uchun administrator ma'lumotlarini kiriting.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Foydalanuvchi nomi
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  {...register('username')}
                  className="input"
                  placeholder="Foydalanuvchi nomingiz"
                />
                {errors.username && <p id="username-error" className="mt-1.5 text-xs text-red-600">{errors.username.message}</p>}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Parol</label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                    aria-expanded={showRecoveryHelp}
                    aria-controls="password-recovery-help"
                    onClick={() => setShowRecoveryHelp((visible) => !visible)}
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="input pr-12"
                    placeholder="Parolingizni kiriting"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/30 dark:hover:text-slate-100"
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p id="password-error" className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
                {showRecoveryHelp && (
                  <div id="password-recovery-help" role="status" className="mt-3 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                    <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    <p>
                      Email yoki SMS orqali avtomatik tiklash hali sozlanmagan. Hisobingizni tiklash uchun tizim administratoriga murojaat qiling.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex w-full items-center justify-center gap-2 py-3"
              >
                {isSubmitting ? 'Tekshirilmoqda...' : <>Kirish <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Kirishda muammo bormi? Tizim administratoriga murojaat qiling.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
