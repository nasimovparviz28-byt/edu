import { Link } from 'react-router-dom';
import { readStoredAdmin } from '../utils/auth';

export default function NotFound() {
  const admin = readStoredAdmin();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-200">404</h1>
      <p className="text-slate-500 mt-2">Sahifa topilmadi</p>
      <Link to={admin ? '/dashboard' : '/login'} className="btn-primary mt-4">
        {admin ? 'Bosh panelga qaytish' : 'Kirish sahifasi'}
      </Link>
    </div>
  );
}
