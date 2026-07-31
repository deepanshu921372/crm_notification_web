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
        className="relative w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center"
        aria-label="Notifications"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-indigo-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">Notifications</span>
            {unread > 0 && <span className="badge">{unread} new</span>}
          </div>

          {latest.length === 0 && (
            <p className="px-4 py-8 text-sm text-slate-500 text-center">Nothing yet.</p>
          )}

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {latest.map((n) => (
              <div key={n._id} className={`px-4 py-3 ${n.isRead ? '' : 'bg-indigo-50/40'}`}>
                <p className="text-sm text-slate-700">{n.message}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                  {!n.isRead && (
                    <button onClick={() => markRead(n._id)} className="link-action">
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
            className="block px-4 py-2.5 border-t border-slate-200 text-sm font-medium text-center text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
