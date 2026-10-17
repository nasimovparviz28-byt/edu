import { Navigate, Outlet } from 'react-router-dom';
import { readStoredAdmin } from '../utils/auth';

export default function ProtectedRoute() {
  const admin = readStoredAdmin();
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
}
