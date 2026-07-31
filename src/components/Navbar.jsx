import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm rounded ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link to="/dashboard" className="font-semibold mr-4">
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
          <span className="text-sm text-gray-600">
            {user.name} <span className="text-gray-400">({user.role})</span>
          </span>
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
