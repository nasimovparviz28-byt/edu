import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { groupSchema } from '../schemas/authSchema';
import { formatMoney } from '../utils/format';
import { localDateString } from '../utils/format';
import { getErrorMessage } from '../utils/errors';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const emptyGroup = {
  name: '',
  course: '',
  teacher: '',
  days: 'toq',
  time: '',
  monthlyPrice: '',
  startDate: localDateString(),
  status: 'active'
};

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: emptyGroup
  });

  const load = async () => {
    try {
      const [g, s] = await Promise.all([api.get('/groups'), api.get('/students')]);
      setGroups(g.data);
      setStudents(s.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, "Guruhlar ma'lumotlarini yuklab bo'lmadi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get('/groups'), api.get('/students')])
      .then(([groupsResponse, studentsResponse]) => {
        if (cancelled) return;
        setGroups(groupsResponse.data);
        setStudents(studentsResponse.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Guruhlar ma'lumotlarini yuklab bo'lmadi."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const countInGroup = (id) => students.filter((s) => String(s.groupId) === String(id) && s.status === 'active').length;

  const openCreate = () => {
    setEditing(null);
    reset(emptyGroup);
    setOpen(true);
  };

  const openEdit = (group) => {
    setEditing(group);
    reset(group);
    setOpen(true);
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      if (editing) {
        await api.patch(`/groups/${editing.id}`, data);
      } else {
        await api.post('/groups', data);
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Guruhni saqlashda xatolik yuz berdi."));
    }
  };

  const onDelete = async (group) => {
    if (students.some((student) => String(student.groupId) === String(group.id))) {
      setError("Guruhda talabalar bor. Avval ularni boshqa guruhga o'tkazing yoki guruhdan chiqaring.");
      return;
    }
    if (!window.confirm(`${group.name} guruhini o'chirishni tasdiqlaysizmi?`)) return;
    setError('');
    try {
      await api.delete(`/groups/${group.id}`);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Guruhni o'chirishda xatolik yuz berdi."));
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Guruhlar</h2>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
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

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.length === 0 && <p className="text-slate-500">Guruhlar yo'q.</p>}
        {groups.map((g) => (
          <div key={g.id} className="card p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/dashboard/groups/${g.id}`} className="font-bold text-lg hover:text-blue-600">
                  {g.name}
                </Link>
                <p className="text-sm text-slate-500">{g.course}</p>
              </div>
              <StatusBadge status={g.status} />
            </div>
            <div className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
              <p>O'qituvchi: {g.teacher}</p>
              <p>
                {g.days === 'toq' ? 'Toq kunlar' : 'Juft kunlar'} · {g.time}
              </p>
              <p>Narx: {formatMoney(g.monthlyPrice)}</p>
              <p>Faol talabalar: {countInGroup(g.id)} ta</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => openEdit(g)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={`${g.name} guruhini tahrirlash`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(g)}
                className="p-2 rounded-lg hover:bg-rose-50 text-rose-600"
                aria-label={`${g.name} guruhini o'chirish`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title={editing ? 'Guruhni tahrirlash' : 'Yangi guruh'} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm">Nomi</label>
            <input className="input mt-1" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Kurs</label>
              <input className="input mt-1" {...register('course')} />
              {errors.course && <p className="text-red-500 text-xs">{errors.course.message}</p>}
            </div>
            <div>
              <label className="text-sm">O'qituvchi</label>
              <input className="input mt-1" {...register('teacher')} />
              {errors.teacher && <p className="text-red-500 text-xs">{errors.teacher.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Kunlar</label>
              <select className="input mt-1" {...register('days')}>
                <option value="toq">Toq</option>
                <option value="juft">Juft</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Vaqt</label>
              <input className="input mt-1" placeholder="18:00-20:00" {...register('time')} />
              {errors.time && <p className="text-red-500 text-xs">{errors.time.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Oylik narx</label>
              <input type="number" className="input mt-1" {...register('monthlyPrice')} />
              {errors.monthlyPrice && <p className="text-red-500 text-xs">{errors.monthlyPrice.message}</p>}
            </div>
            <div>
              <label className="text-sm">Boshlanish</label>
              <input type="date" className="input mt-1" {...register('startDate')} />
              {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm">Holat</label>
            <select className="input mt-1" {...register('status')}>
              <option value="active">Faol</option>
              <option value="finished">Tugatilgan</option>
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
