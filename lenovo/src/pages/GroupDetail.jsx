import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { formatMoney, studentName } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import StatusBadge from '../components/StatusBadge';

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [g, s] = await Promise.all([api.get(`/groups/${id}`), api.get('/students', { params: { groupId: id } })]);
        setGroup(g.data);
        setStudents(s.data);
      } finally {
        setLoading(false);
      }
    };
    load().catch((err) => {
      setError(getErrorMessage(err, "Guruh ma'lumotlarini yuklab bo'lmadi."));
    });
  }, [id]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <p role="alert" className="text-rose-600">{error}</p>;
  if (!group) return <div>Guruh topilmadi.</div>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard/groups" className="text-sm text-blue-600 hover:underline">
        ← Guruhlarga qaytish
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <p className="text-slate-500">{group.course}</p>
          </div>
          <StatusBadge status={group.status} />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="text-slate-500">O'qituvchi</p>
            <p className="font-medium">{group.teacher}</p>
          </div>
          <div>
            <p className="text-slate-500">Jadval</p>
            <p className="font-medium">
              {group.days === 'toq' ? 'Toq kunlar' : 'Juft kunlar'} · {group.time}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Oylik narx</p>
            <p className="font-medium">{formatMoney(group.monthlyPrice)}</p>
          </div>
          <div>
            <p className="text-slate-500">Boshlanish</p>
            <p className="font-medium">{group.startDate}</p>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-bold p-4 pb-0">Guruh talabalari</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="p-4">Talaba</th>
              <th className="p-4">Telefon</th>
              <th className="p-4">Holat</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-slate-500">
                  Bu guruhda talaba yo'q.
                </td>
              </tr>
            )}
            {students.map((s) => (
              <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="p-4">
                  <Link to={`/dashboard/students/${s.id}`} className="text-blue-600 hover:underline">
                    {studentName(s)}
                  </Link>
                </td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4">
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
