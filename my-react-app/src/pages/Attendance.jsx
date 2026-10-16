import { useEffect, useState } from 'react';
import api from '../api/axios';
import { localDateString, studentName } from '../utils/format';

const today = localDateString();

export default function Attendance() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState(today);
  const [existing, setExisting] = useState(null);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/groups')
      .then((res) => {
        if (cancelled) return;
        const activeGroups = res.data.filter((group) => group.status === 'active');
        setGroups(activeGroups);
        if (activeGroups[0]) setGroupId(String(activeGroups[0].id));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Guruhlarni yuklab bo'lmadi. Server ishlayotganini tekshiring.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!groupId) return undefined;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          api.get('/students', { params: { groupId } }),
          api.get('/attendance', { params: { groupId, date } })
        ]);
        if (cancelled) return;

        const activeStudents = studentsRes.data.filter((student) => student.status === 'active');
        const record = attendanceRes.data[0] || null;
        const nextMarks = {};
        activeStudents.forEach((student) => {
          const found = record?.records?.find((item) => String(item.studentId) === String(student.id));
          nextMarks[student.id] = found?.status || 'present';
        });

        setStudents(activeStudents);
        setExisting(record);
        setMarks(nextMarks);
      } catch {
        if (!cancelled) setError("Davomat ma'lumotlarini yuklab bo'lmadi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [groupId, date]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    const records = students.map((student) => ({
      studentId: student.id,
      status: marks[student.id] || 'present'
    }));
    const currentStudentIds = new Set(records.map((record) => String(record.studentId)));
    const historicalRecords = (existing?.records || []).filter(
      (record) => !currentStudentIds.has(String(record.studentId))
    );
    const payload = { groupId: Number(groupId), date, records: [...historicalRecords, ...records] };

    try {
      if (existing) {
        await api.patch(`/attendance/${existing.id}`, payload);
      } else {
        const response = await api.post('/attendance', payload);
        setExisting(response.data);
      }
      setMessage('Davomat saqlandi.');
    } catch {
      setError("Davomatni saqlashda xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Davomat</h2>

      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className="input sm:w-64"
          value={groupId}
          onChange={(event) => setGroupId(event.target.value)}
          disabled={!groups.length}
          aria-label="Guruhni tanlang"
        >
          {!groups.length && <option value="">Faol guruh yo'q</option>}
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input sm:w-48"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-label="Davomat sanasi"
        />
        <button
          onClick={save}
          disabled={saving || loading || students.length === 0}
          className="btn-primary"
        >
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">Talaba</th>
              <th className="p-3">Holat</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-slate-500">Yuklanmoqda...</td>
              </tr>
            )}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-slate-500">
                  Bu guruhda faol talaba yo'q.
                </td>
              </tr>
            )}
            {!loading && students.map((student) => (
              <tr key={student.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="p-3 font-medium">{studentName(student)}</td>
                <td className="p-3">
                  <select
                    className="input max-w-48"
                    value={marks[student.id] || 'present'}
                    onChange={(event) => setMarks((previous) => ({
                      ...previous,
                      [student.id]: event.target.value
                    }))}
                    aria-label={`${studentName(student)} davomat holati`}
                  >
                    <option value="present">Kelgan</option>
                    <option value="late">Kechikkan</option>
                    <option value="absent">Kelmagan</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
