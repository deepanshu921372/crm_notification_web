import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/time';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'reminder', label: 'Reminders' }
];

const typeStyles = {
  assignment: 'bg-indigo-50 text-indigo-700',
  reminder: 'bg-amber-50 text-amber-700',
  system: 'bg-slate-100 text-slate-700'
};

export default function Notifications() {
  const { items, unread, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? items : items.filter((n) => n.type === filter);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary">
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
              filter === f.value
                ? 'bg-slate-900 text-white border-slate-900 font-medium'
                : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500">Nothing here.</p>
        </div>
      )}

      {visible.length > 0 && (
        <div className="card divide-y divide-slate-100">
          {visible.map((n) => (
            <div key={n._id} className={`px-4 py-4 ${n.isRead ? '' : 'bg-indigo-50/40'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <span className={`badge capitalize ${typeStyles[n.type]}`}>{n.type}</span>
                  </div>

                  {n.link ? (
                    <Link to={n.link} className="text-sm text-slate-600 hover:text-indigo-600">
                      {n.message}
                    </Link>
                  ) : (
                    <p className="text-sm text-slate-600">{n.message}</p>
                  )}

                  <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="link-action whitespace-nowrap shrink-0"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
