import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { currentMonthString, formatMoney, studentName, statusLabel } from '../utils/format';
import { calculateStudentDebt } from '../utils/debt';
import { Users, BookOpen, DollarSign, AlertCircle, ArrowUpRight } from 'lucide-react';

const initialStats = { activeStudents: 0, activeGroups: 0, monthlyRevenue: 0, debtorsCount: 0, totalDebt: 0 };

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [recentPayments, setRecentPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [studentsRes, groupsRes, paymentsRes] = await Promise.all([
          api.get('/students'), api.get('/groups'), api.get('/payments')
        ]);
        if (cancelled) return;

        const allStudents = studentsRes.data;
        const groups = groupsRes.data;
        const payments = paymentsRes.data;
        const currentMonth = currentMonthString();
        const activeStudents = allStudents.filter((student) => student.status === 'active');
        const activeGroups = groups.filter((group) => group.status === 'active');
        const monthlyRevenue = payments
          .filter((payment) => payment.month === currentMonth)
          .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

        const debtorsList = activeStudents.flatMap((student) => {
          const group = groups.find((item) => String(item.id) === String(student.groupId));
          const { debtAmount } = calculateStudentDebt(student, group, payments, currentMonth);
          return debtAmount > 0 ? [{ student, debtAmount }] : [];
        }).sort((a, b) => b.debtAmount - a.debtAmount);

        setStudents(allStudents);
        setDebtors(debtorsList.slice(0, 5));
        setStats({
          activeStudents: activeStudents.length,
          activeGroups: activeGroups.length,
          monthlyRevenue,
          debtorsCount: debtorsList.length,
          totalDebt: debtorsList.reduce((sum, item) => sum + item.debtAmount, 0)
        });
        setRecentPayments([...payments].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)).slice(0, 5));
      } catch {
        if (!cancelled) setError("Ma'lumotlarni yuklab bo'lmadi. json-server (port 3001) ishlayotganini tekshiring.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDashboard();
    return () => { cancelled = true; };
  }, [reloadKey]);

  if (loading) return <div className="p-4 text-sm text-slate-500">Yuklanmoqda...</div>;
  if (error) {
    return (
      <div role="alert" className="card p-5 text-rose-600">
        <p>{error}</p>
        <button className="btn-ghost mt-3" onClick={() => setReloadKey((key) => key + 1)}>Qayta urinish</button>
      </div>
    );
  }

  const cards = [
    { label: 'Faol talabalar', value: `${stats.activeStudents} ta`, icon: Users, tone: 'lime', detail: 'Barcha guruhlar bo‘yicha' },
    { label: 'Faol guruhlar', value: `${stats.activeGroups} ta`, icon: BookOpen, tone: 'sky', detail: 'O‘qish davom etmoqda' },
    { label: 'Joriy oy tushumi', value: formatMoney(stats.monthlyRevenue), icon: DollarSign, tone: 'violet', detail: currentMonthString() },
    { label: 'Qarzdorlar', value: `${stats.debtorsCount} ta`, icon: AlertCircle, tone: 'rose', detail: `Jami ${formatMoney(stats.totalDebt)}` }
  ];
  const toneClasses = {
    lime: 'border-t-lime-400 bg-lime-100 text-lime-800',
    sky: 'border-t-sky-400 bg-sky-100 text-sky-700',
    violet: 'border-t-violet-400 bg-violet-100 text-violet-700',
    rose: 'border-t-rose-400 bg-rose-100 text-rose-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-700">O‘quv markazi</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Bosh panel</h2>
        </div>
        <p className="text-sm text-slate-500">Bugungi holat va o‘quv jarayonlari</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone, detail }) => (
          <div key={label} className={`card border-t-2 p-5 ${toneClasses[tone].split(' ').slice(0, 1).join(' ')}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{detail}</p>
              </div>
              <span className={`rounded-2xl p-3 ${toneClasses[tone].split(' ').slice(1).join(' ')}`}><Icon className="h-5 w-5" /></span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <section className="card p-6 xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Oxirgi to‘lovlar</h3>
              <p className="mt-1 text-xs text-slate-500">Yaqinda qabul qilingan to‘lovlar</p>
            </div>
            <Link to="/dashboard/payments" className="flex items-center gap-1 text-sm font-semibold text-lime-700 hover:underline">Barchasi <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div>
            {recentPayments.length === 0 && <p className="py-4 text-sm text-slate-500">Hali to‘lovlar yo‘q.</p>}
            {recentPayments.map((payment) => {
              const student = students.find((item) => String(item.id) === String(payment.studentId));
              return (
                <div key={payment.id} className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0 dark:border-slate-700">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{studentName(student)}</p>
                    <p className="text-xs text-slate-400">{payment.paidAt} · {statusLabel(payment.method)} · {payment.month}</p>
                  </div>
                  <span className="whitespace-nowrap font-bold text-emerald-700">{formatMoney(payment.amount)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">To‘lov nazorati</h3>
              <p className="mt-1 text-xs text-slate-500">Joriy oy qarzdorlari</p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">{stats.debtorsCount} ta</span>
          </div>
          {debtors.length === 0 ? <p className="py-4 text-sm text-slate-500">Qarzdorlar yo‘q. To‘lovlar o‘z vaqtida!</p> : (
            debtors.map(({ student, debtAmount }) => (
              <Link key={student.id} to={`/dashboard/students/${student.id}`} className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0 hover:text-rose-700 dark:border-slate-700">
                <span className="truncate text-sm font-medium">{studentName(student)}</span>
                <span className="whitespace-nowrap text-sm font-bold text-rose-600">{formatMoney(debtAmount)}</span>
              </Link>
            ))
          )}
        </section>
      </div>

      <section className="rounded-3xl bg-[#171918] p-6 text-white sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Tezkor amallar</p>
            <h3 className="mt-1 text-xl font-bold">O‘quv jarayonini boshqaring</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/students" className="rounded-xl bg-[#d8ff65] px-4 py-2.5 text-sm font-bold text-[#171918] hover:bg-lime-300">Talaba qo‘shish</Link>
            <Link to="/dashboard/attendance" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Davomat belgilash</Link>
            <Link to="/dashboard/payments" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">To‘lov qabul qilish</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
