import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { paymentSchema } from '../schemas/authSchema';
import { currentMonthString, formatMoney, localDateString, studentName, statusLabel } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import Modal from '../components/Modal';

const today = localDateString();
const thisMonth = currentMonthString();

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: '',
      amount: '',
      month: thisMonth,
      method: 'naqd',
      paidAt: today
    }
  });

  const load = async () => {
    try {
      const [p, s] = await Promise.all([api.get('/payments'), api.get('/students')]);
      setPayments(p.data.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)));
      setStudents(s.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, "To'lovlar ma'lumotlarini yuklab bo'lmadi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get('/payments'), api.get('/students')])
      .then(([paymentsResponse, studentsResponse]) => {
        if (cancelled) return;
        setPayments(paymentsResponse.data.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)));
        setStudents(studentsResponse.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "To'lovlar ma'lumotlarini yuklab bo'lmadi."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const findStudent = (id) => students.find((s) => String(s.id) === String(id));

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const monthOk = !monthFilter || p.month === monthFilter;
      const studentOk = !studentFilter || String(p.studentId) === String(studentFilter);
      return monthOk && studentOk;
    });
  }, [payments, monthFilter, studentFilter]);

  const total = filtered.reduce((sum, p) => sum + Number(p.amount), 0);

  const onSubmit = async (data) => {
    setError('');
    try {
      await api.post('/payments', data);
      setOpen(false);
      reset({ studentId: '', amount: '', month: thisMonth, method: 'naqd', paidAt: today });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "To'lovni saqlashda xatolik yuz berdi."));
    }
  };

  const onDelete = async (payment) => {
    if (!window.confirm("To'lovni o'chirishni tasdiqlaysizmi?")) return;
    setError('');
    try {
      await api.delete(`/payments/${payment.id}`);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "To'lovni o'chirishda xatolik yuz berdi."));
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">To'lovlar</h2>
        <button onClick={() => setOpen(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Qabul qilish
        </button>
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-rose-600">
          <p>{error}</p>
          <button
            className="underline"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Qayta urinish
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="month" className="input sm:w-48" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
        <select className="input sm:w-64" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
          <option value="">Barcha talabalar</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {studentName(s)}
            </option>
          ))}
        </select>
        <div className="card px-4 py-2 text-sm flex items-center">
          Jami: <span className="font-bold ml-2">{formatMoney(total)}</span>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">Talaba</th>
              <th className="p-3">Oy</th>
              <th className="p-3">Usul</th>
              <th className="p-3">Sana</th>
              <th className="p-3">Summa</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  To'lovlar topilmadi.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="p-3 font-medium">{studentName(findStudent(p.studentId))}</td>
                <td className="p-3">{p.month}</td>
                <td className="p-3">{statusLabel(p.method)}</td>
                <td className="p-3">{p.paidAt}</td>
                <td className="p-3 text-emerald-600 font-semibold">{formatMoney(p.amount)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onDelete(p)}
                    className="p-2 rounded-lg hover:bg-rose-50 text-rose-600"
                    aria-label={`${studentName(findStudent(p.studentId))} to'lovini o'chirish`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Yangi to'lov" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm">Talaba</label>
            <select className="input mt-1" {...register('studentId')}>
              <option value="">Tanlang</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {studentName(s)}
                </option>
              ))}
            </select>
            {errors.studentId && <p className="text-red-500 text-xs">{errors.studentId.message}</p>}
          </div>
          <div>
            <label className="text-sm">Summa</label>
            <input type="number" className="input mt-1" {...register('amount')} />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Oy</label>
              <input type="month" className="input mt-1" {...register('month')} />
              {errors.month && <p className="text-red-500 text-xs">{errors.month.message}</p>}
            </div>
            <div>
              <label className="text-sm">Sana</label>
              <input type="date" className="input mt-1" {...register('paidAt')} />
              {errors.paidAt && <p className="text-red-500 text-xs">{errors.paidAt.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm">Usul</label>
            <select className="input mt-1" {...register('method')}>
              <option value="naqd">Naqd</option>
              <option value="karta">Karta</option>
              <option value="click">Click</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
              Bekor
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
