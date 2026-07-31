import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/time';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'reminder', label: 'Reminders' }
];

export default function Notifications() {
  const { items, unread, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? items : items.filter((n) => n.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-gray-500">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm px-3 py-1 rounded border ${
              filter === f.value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && <p className="text-sm text-gray-500">Nothing here.</p>}

      <div className="bg-white border rounded divide-y">
        {visible.map((n) => (
          <div key={n._id} className={`px-4 py-3 ${n.isRead ? '' : 'bg-blue-50'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <span className="text-xs text-gray-500">
                  {n.type} · {timeAgo(n.createdAt)}
                </span>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead(n._id)}
                  className="text-xs text-gray-600 hover:text-gray-900 underline whitespace-nowrap"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
