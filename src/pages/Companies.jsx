import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', industry: '', website: '' };

export default function Companies() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/companies').then((res) => setCompanies(res.data));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.post('/companies', form);
      setCompanies((prev) => [res.data, ...prev]);
      setForm(empty);
      toast.success('Company created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create company');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
      toast.success('Company deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete company');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Companies</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-4 mb-6">
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Industry"
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Website"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-3 bg-gray-900 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add company'}
          </button>
        </form>
      )}

      {companies.length === 0 && <p className="text-sm text-gray-500">No companies yet.</p>}

      {companies.length > 0 && (
        <div className="bg-white border rounded divide-y">
          {companies.map((c) => (
            <div key={c._id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <Link to={`/companies/${c._id}`} className="text-sm hover:underline">
                  {c.name}
                </Link>
                <p className="text-xs text-gray-500">{c.industry || 'No industry'}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
