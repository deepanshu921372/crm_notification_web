import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { unread, lastPush } = useNotifications();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lastPush && lastPush.type !== 'assignment') {
      return;
    }

    api
      .get('/assignments/mine')
      .then((res) => setAssignments(res.data))
      .finally(() => setLoading(false));
  }, [lastPush]);

  const companyCount = assignments.filter((a) => a.targetType === 'company').length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Hi {user.name.split(' ')[0]}</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        {user.role === 'admin'
          ? 'Create companies and contacts, then assign them to a user.'
          : 'Records assigned to you show up here, live.'}
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Assigned</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{assignments.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Companies</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{companyCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Unread</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{unread}</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-900 mb-3">My assignments</h2>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {!loading && assignments.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500">Nothing assigned to you yet.</p>
          {user.role === 'admin' && (
            <Link
              to="/assignments/new"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
            >
              Create an assignment
            </Link>
          )}
        </div>
      )}

      {assignments.length > 0 && (
        <div className="card divide-y divide-slate-100">
          {assignments.map((a) => (
            <div key={a._id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {a.targetId?.name || 'Deleted record'}
                </p>
                <p className="text-xs text-slate-500 capitalize">{a.targetType}</p>
              </div>
              <span className="badge capitalize">{a.role.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
