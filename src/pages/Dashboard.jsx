import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/assignments/mine')
      .then((res) => setAssignments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Hi {user.name.split(' ')[0]}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {user.role === 'admin'
          ? 'Create companies and contacts, then assign them to a user.'
          : 'Records assigned to you show up here.'}
      </p>

      <h2 className="text-sm font-medium mb-2">My assignments</h2>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && assignments.length === 0 && (
        <p className="text-sm text-gray-500">Nothing assigned to you yet.</p>
      )}

      {assignments.length > 0 && (
        <div className="bg-white border rounded divide-y">
          {assignments.map((a) => (
            <div key={a._id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm">{a.targetId?.name || 'Deleted record'}</p>
                <p className="text-xs text-gray-500">{a.targetType}</p>
              </div>
              <span className="text-xs bg-gray-100 rounded px-2 py-1">
                {a.role.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
