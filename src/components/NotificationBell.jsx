import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/time';

export default function NotificationBell() {
  const { items, unread, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const latest = items.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded hover:bg-gray-100 flex items-center justify-center"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-white border rounded shadow-lg z-10">
          <div className="px-4 py-2 border-b text-sm font-medium">Notifications</div>

          {latest.length === 0 && <p className="px-4 py-6 text-sm text-gray-500">Nothing yet.</p>}

          <div className="divide-y max-h-80 overflow-y-auto">
            {latest.map((n) => (
              <div key={n._id} className={`px-4 py-3 ${n.isRead ? '' : 'bg-blue-50'}`}>
                <p className="text-sm">{n.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{timeAgo(n.createdAt)}</span>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 border-t text-sm text-center text-gray-600 hover:text-gray-900"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
