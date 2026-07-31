import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CompanyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [data, setData] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/companies/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load company'));

    if (isAdmin) {
      api.get('/assignments', { params: { targetId: id } }).then((res) => setAssignees(res.data));
    }
  }, [id, isAdmin]);

  async function handleUnassign(assignmentId) {
    try {
      await api.delete(`/assignments/${assignmentId}`);
      setAssignees((prev) => prev.filter((a) => a._id !== assignmentId));
      toast.success('Assignment removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove');
    }
  }

  if (error) {
    return <p className="text-sm text-gray-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">{data.company.name}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {data.company.industry || 'No industry'}
        {data.company.website && ` · ${data.company.website}`}
      </p>

      <h2 className="text-sm font-medium mb-2">Contacts</h2>
      {data.contacts.length === 0 && (
        <p className="text-sm text-gray-500 mb-6">No contacts for this company.</p>
      )}
      {data.contacts.length > 0 && (
        <div className="bg-white border rounded divide-y mb-6">
          {data.contacts.map((c) => (
            <div key={c._id} className="px-4 py-3">
              <p className="text-sm">{c.name}</p>
              <p className="text-xs text-gray-500">
                {c.email || 'No email'}
                {c.phone && ` · ${c.phone}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <h2 className="text-sm font-medium mb-2">Assigned users</h2>
          {assignees.length === 0 && <p className="text-sm text-gray-500">Nobody assigned yet.</p>}
          {assignees.length > 0 && (
            <div className="bg-white border rounded divide-y">
              {assignees.map((a) => (
                <div key={a._id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm">{a.userId.name}</p>
                    <p className="text-xs text-gray-500">{a.role.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={() => handleUnassign(a._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Unassign
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
