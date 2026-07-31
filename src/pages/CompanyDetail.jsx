import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <Link to="/companies" className="text-sm text-slate-500 hover:text-slate-900">
        Back to companies
      </Link>

      <div className="flex items-center gap-4 mt-4 mb-8">
        <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-lg flex items-center justify-center">
          {data.company.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{data.company.name}</h1>
          <p className="text-sm text-slate-500">
            {data.company.industry || 'No industry'}
            {data.company.website && ` · ${data.company.website}`}
          </p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-900 mb-3">
        Contacts <span className="text-slate-400 font-normal">({data.contacts.length})</span>
      </h2>

      {data.contacts.length === 0 && (
        <div className="card p-6 text-center mb-8">
          <p className="text-sm text-slate-500">No contacts for this company.</p>
        </div>
      )}

      {data.contacts.length > 0 && (
        <div className="card divide-y divide-slate-100 mb-8">
          {data.contacts.map((c) => (
            <div key={c._id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">
                  {c.email || 'No email'}
                  {c.phone && ` · ${c.phone}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Assigned users <span className="text-slate-400 font-normal">({assignees.length})</span>
          </h2>

          {assignees.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-sm text-slate-500">Nobody assigned yet.</p>
              <Link
                to="/assignments/new"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
              >
                Assign someone
              </Link>
            </div>
          )}

          {assignees.length > 0 && (
            <div className="card divide-y divide-slate-100">
              {assignees.map((a) => (
                <div key={a._id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
                      {a.userId.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{a.userId.name}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {a.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleUnassign(a._id)} className="link-danger">
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
