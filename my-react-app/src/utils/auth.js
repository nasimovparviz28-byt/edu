export const readStoredAdmin = () => {
  const storedAdmin = localStorage.getItem('admin');
  if (!storedAdmin) return null;

  try {
    const admin = JSON.parse(storedAdmin);
    if (!admin || typeof admin !== 'object' || Array.isArray(admin) || !admin.id) {
      localStorage.removeItem('admin');
      return null;
    }
    return admin;
  } catch {
    localStorage.removeItem('admin');
    return null;
  }
};
