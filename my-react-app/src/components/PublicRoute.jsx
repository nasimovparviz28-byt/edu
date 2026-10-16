import { Navigate, Outlet } from 'react-router-dom';
import { readStoredAdmin } from '../utils/auth';

export default function PublicRoute() {
  const admin = readStoredAdmin();
  return !admin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
