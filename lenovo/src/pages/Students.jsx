import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '../api/axios';
import { studentSchema } from '../schemas/authSchema';
import { localDateString, studentName } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const emptyStudent = {
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',
  groupId: '',
  status: 'active',
  joinedAt: localDateString(),
  note: ''
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: emptyStudent
  });

  const load = async () => {
    try {
      const [s, g] = await Promise.all([api.get('/students'), api.get('/groups')]);
      setStudents(s.data);
      setGroups(g.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, "Talabalar ma'lumotlarini yuklab bo'lmadi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get('/students'), api.get('/groups')])
      .then(([studentsResponse, groupsResponse]) => {
        if (cancelled) return;
        setStudents(studentsResponse.data);
        setGroups(groupsResponse.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Talabalar ma'lumotlarini yuklab bo'lmadi."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groupName = (id) => groups.find((g) => String(g.id) === String(id))?.name || '—';

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        studentName(s).toLowerCase().includes(q) ||
        (s.phone || '').includes(q);
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [students, query, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    reset(emptyStudent);
    setOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    reset({ ...student, groupId: Number(student.groupId) });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      if (editing) {
        await api.patch(`/students/${editing.id}`, data);
      } else {
        await api.post('/students', data);
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Talabani saqlashda xatolik yuz berdi."));
    }
  };

  const onDelete = async (student) => {
    if (!window.confirm(`${studentName(student)} ni o'chirishni tasdiqlaysizmi?`)) return;
    setError('');
    try {
      await api.delete(`/students/${student.id}`);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Talabani o'chirishda xatolik yuz berdi."));
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Talabalar</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            O'quv markazingizdagi talabalarni boshqaring
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto">
          <Plus className="w-4 h-4" /> Qo'shish
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

      <div className="card flex flex-col sm:flex-row gap-3 p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            className="input pl-9 border-transparent bg-slate-50 dark:bg-slate-800/70 focus:border-blue-400"
            placeholder="Ism yoki telefon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input sm:w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Barcha holat</option>
          <option value="active">Faol</option>
          <option value="frozen">Muzlatilgan</option>
          <option value="left">Chiqib ketgan</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">Talaba</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Guruh</th>
              <th className="p-3">Holat</th>
              <th className="p-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Talabalar topilmadi.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="p-3">
                  <Link to={`/dashboard/students/${s.id}`} className="font-medium text-blue-600 hover:underline">
                    {studentName(s)}
                  </Link>
                </td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{groupName(s.groupId)}</td>
                <td className="p-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label={`${studentName(s)} ma'lumotlarini tahrirlash`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600"
                      aria-label={`${studentName(s)} ni o'chirish`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Talabani tahrirlash' : "Yangi talaba"} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Ism</label>
              <input className="input mt-1" {...register('firstName')} />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-sm">Familiya</label>
              <input className="input mt-1" {...register('lastName')} />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm">Telefon</label>
            <input className="input mt-1" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Tug'ilgan sana</label>
              <input type="date" className="input mt-1" {...register('birthDate')} />
              {errors.birthDate && <p className="text-red-500 text-xs">{errors.birthDate.message}</p>}
            </div>
            <div>
              <label className="text-sm">Qo'shilgan sana</label>
              <input type="date" className="input mt-1" {...register('joinedAt')} />
              {errors.joinedAt && <p className="text-red-500 text-xs">{errors.joinedAt.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Guruh</label>
              <select className="input mt-1" {...register('groupId')}>
                <option value="">Tanlang</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.groupId && <p className="text-red-500 text-xs">{errors.groupId.message}</p>}
            </div>
            <div>
              <label className="text-sm">Holat</label>
              <select className="input mt-1" {...register('status')}>
                <option value="active">Faol</option>
                <option value="frozen">Muzlatilgan</option>
                <option value="left">Chiqib ketgan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm">Izoh</label>
            <textarea className="input mt-1" rows={2} {...register('note')} />
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
