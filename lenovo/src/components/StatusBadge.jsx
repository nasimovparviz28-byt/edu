import { statusLabel } from '../utils/format';

const styles = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  frozen: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  left: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  finished: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-rose-100 text-rose-700',
  late: 'bg-amber-100 text-amber-700'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {statusLabel(status)}
    </span>
  );
}
