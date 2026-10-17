import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  CalendarCheck,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { readStoredAdmin } from '../utils/auth';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const admin = readStoredAdmin() || {};
  const currentPage = [
    { path: '/dashboard/students', title: 'Talabalar' },
    { path: '/dashboard/groups', title: 'Guruhlar' },
    { path: '/dashboard/payments', title: "To'lovlar" },
    { path: '/dashboard/attendance', title: 'Davomat' },
    { path: '/dashboard/settings', title: 'Sozlamalar' },
    { path: '/dashboard', title: 'Bosh panel' }
  ].find((page) => location.pathname === page.path || location.pathname.startsWith(`${page.path}/`));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Bosh panel', icon: LayoutDashboard, end: true },
    { to: '/dashboard/students', label: 'Talabalar', icon: Users },
    { to: '/dashboard/groups', label: 'Guruhlar', icon: BookOpen },
    { to: '/dashboard/payments', label: "To'lovlar", icon: CreditCard },
    { to: '/dashboard/attendance', label: 'Davomat', icon: CalendarCheck },
    { to: '/dashboard/settings', label: 'Sozlamalar', icon: Settings }
  ];

  const sidebar = (
    <aside className="w-64 h-full bg-[#171918] text-white border-r border-white/5 flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center justify-between mb-9 px-2 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d8ff65] flex items-center justify-center text-[#171918] shadow-lg shadow-lime-300/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-white">Najot Ta'lim</span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">O'quv boshqaruvi</span>
            </div>
          </div>
          <button className="md:hidden p-1 text-slate-300" onClick={() => setSidebarOpen(false)} aria-label="Yopish">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="px-3 mb-2 text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">Asosiy menyu</p>
        <nav className="space-y-1.5" aria-label="Asosiy navigatsiya">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#d8ff65] text-[#171918] shadow-md shadow-lime-300/10'
                        : 'text-slate-500 group-hover:text-white'
                    }`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-[#d8ff65]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors font-medium text-sm w-full"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
          <LogOut className="w-[18px] h-[18px]" />
        </span>
        <span>Hisobdan chiqish</span>
      </button>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#f6f7f4] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      <div className="hidden md:block">{sidebar}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Menyuni yopish"
          />
          <div className="absolute inset-y-0 left-0 z-50">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative z-10 min-h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 md:px-7">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">NAJOT TA'LIM · BOSHQARUV</p>
              <h1 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                {currentPage?.title || 'EduPanel'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Mavzuni almashtirish"
            >
                {darkMode ? <Sun className="w-5 h-5 text-lime-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            <div className="flex items-center gap-2.5 border-l pl-3 sm:pl-4 border-slate-200 dark:border-slate-700">
              <img
                src={admin.avatar || 'https://i.pravatar.cc/150?img=12'}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 dark:ring-slate-700"
              />
              <div className="text-sm hidden sm:block">
                <p className="font-medium">{admin.fullName || 'Admin'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">@{admin.username || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
