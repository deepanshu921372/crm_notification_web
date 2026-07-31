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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
        <p className="text-sm text-slate-500 mt-1">
          {companies.length} {companies.length === 1 ? 'company' : 'companies'}
        </p>
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit company' : 'Add a company'}
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder="Acme Corp"
                className="input"
              />
            </div>
            <div>
              <label className="label">Industry</label>
              <input
                value={form.industry}
                onChange={(e) => update('industry', e.target.value)}
                placeholder="SaaS"
                className="input"
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="https://acme.com"
                className="input"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add company'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {companies.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500">No companies yet.</p>
        </div>
      )}

      {companies.length > 0 && (
        <div className="card divide-y divide-slate-100">
          {companies.map((c) => (
            <div
              key={c._id}
              className={`px-4 py-3 flex items-center justify-between ${
                editingId === c._id ? 'bg-indigo-50/50' : ''
              }`}
            >
              <div className="min-w-0">
                <Link
                  to={`/companies/${c._id}`}
                  className="text-sm font-medium text-slate-900 hover:text-indigo-600"
                >
                  {c.name}
                </Link>
                <p className="text-xs text-slate-500 truncate">
                  {c.industry || 'No industry'}
                  {c.website && ` · ${c.website}`}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-4 shrink-0 ml-4">
                  <button onClick={() => startEdit(c)} className="link-action">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="link-danger">
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
