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
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/companies').then((res) => setCompanies(res.data));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(company) {
    setEditingId(company._id);
    setForm({
      name: company.name,
      industry: company.industry || '',
      website: company.website || ''
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const res = await api.put(`/companies/${editingId}`, form);
        setCompanies((prev) => prev.map((c) => (c._id === editingId ? res.data : c)));
        toast.success('Company updated');
      } else {
        const res = await api.post('/companies', form);
        setCompanies((prev) => [res.data, ...prev]);
        toast.success('Company created');
      }

      cancelEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save company');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));

      if (editingId === id) {
        cancelEdit();
      }

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

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add company'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="border rounded px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
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
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
