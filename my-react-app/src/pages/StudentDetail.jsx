import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { calculateStudentDebt } from '../utils/debt';
import { currentMonthString, formatDate, formatMoney, studentName, statusLabel } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import StatusBadge from '../components/StatusBadge';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [group, setGroup] = useState(null);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const studentRes = await api.get(`/students/${id}`);
        const s = studentRes.data;
        setStudent(s);

        const [groupsRes, paymentsRes, attendanceRes] = await Promise.all([
          api.get('/groups'),
          api.get('/payments', { params: { studentId: s.id } }),
          api.get('/attendance')
        ]);

        setGroup(groupsRes.data.find((g) => String(g.id) === String(s.groupId)) || null);
        setPayments(paymentsRes.data.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)));
        setAttendance(
          attendanceRes.data.filter((a) =>
            (a.records || []).some((r) => String(r.studentId) === String(s.id))
          )
        );
      } finally {
        setLoading(false);
      }
    };
    load().catch((err) => {
      setError(getErrorMessage(err, "Talaba ma'lumotlarini yuklab bo'lmadi."));
    });
  }, [id]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <p role="alert" className="text-rose-600">{error}</p>;
  if (!student) return <div>Talaba topilmadi.</div>;

  const currentMonth = currentMonthString();
  const { debtAmount, isDebtor } = calculateStudentDebt(student, group, payments, currentMonth);

  return (
    <div className="space-y-6">
      <Link to="/dashboard/students" className="text-sm text-blue-600 hover:underline">
        ← Talabalarga qaytish
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{studentName(student)}</h2>
            <p className="text-slate-500 text-sm mt-1">{student.phone}</p>
          </div>
          <StatusBadge status={student.status} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="text-slate-500">Guruh</p>
            <p className="font-medium">{group?.name || '—'}</p>
          </div>
          <div>
            <p className="text-slate-500">Tug'ilgan sana</p>
            <p className="font-medium">{formatDate(student.birthDate)}</p>
          </div>
          <div>
            <p className="text-slate-500">Qo'shilgan</p>
            <p className="font-medium">{formatDate(student.joinedAt)}</p>
          </div>
          <div>
            <p className="text-slate-500">Joriy oy qarzi</p>
            <p className={`font-medium ${isDebtor ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatMoney(debtAmount)}
            </p>
          </div>
        </div>
        {student.note && <p className="mt-4 text-sm text-slate-500">Izoh: {student.note}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold mb-3">To'lovlar</h3>
          {payments.length === 0 && <p className="text-sm text-slate-500">To'lovlar yo'q.</p>}
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-700 py-2">
                <div>
                  <p>{p.month}</p>
                  <p className="text-xs text-slate-400">{p.paidAt} · {statusLabel(p.method)}</p>
                </div>
                <span className="font-semibold text-emerald-600">{formatMoney(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold mb-3">Davomat</h3>
          {attendance.length === 0 && <p className="text-sm text-slate-500">Davomat yozuvlari yo'q.</p>}
          <div className="space-y-2">
            {attendance.map((a) => {
              const rec = (a.records || []).find((r) => String(r.studentId) === String(student.id));
              return (
                <div key={a.id} className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                  <span>{a.date}</span>
                  <StatusBadge status={rec?.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
