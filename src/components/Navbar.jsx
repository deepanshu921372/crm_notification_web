import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 text-sm rounded-md transition-colors ${
    isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link to="/dashboard" className="font-semibold text-slate-900 mr-5">
            CRM
          </Link>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/companies" className={linkClass}>
            Companies
          </NavLink>
          <NavLink to="/contacts" className={linkClass}>
            Contacts
          </NavLink>
          {user.role === 'admin' && (
            <NavLink to="/assignments/new" className={linkClass}>
              Assign
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="link-action">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
