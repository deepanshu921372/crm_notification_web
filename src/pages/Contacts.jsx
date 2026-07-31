import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', email: '', phone: '', companyId: '' };

export default function Contacts() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/contacts').then((res) => setContacts(res.data));
    api.get('/companies').then((res) => setCompanies(res.data));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(contact) {
    setEditingId(contact._id);
    setForm({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      companyId: contact.companyId?._id || ''
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
        await api.put(`/contacts/${editingId}`, form);
        toast.success('Contact updated');
      } else {
        await api.post('/contacts', form);
        toast.success('Contact created');
      }

      const res = await api.get('/contacts');
      setContacts(res.data);
      cancelEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save contact');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));

      if (editingId === id) {
        cancelEdit();
      }

      toast.success('Contact deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete contact');
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
        <p className="text-sm text-slate-500 mt-1">
          {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
        </p>
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6">
          <p className="text-sm font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit contact' : 'Add a contact'}
          </p>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder="Priya Sharma"
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="priya@acme.com"
                className="input"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="9810011111"
                className="input"
              />
            </div>
            <div>
              <label className="label">Company</label>
              <select
                value={form.companyId}
                onChange={(e) => update('companyId', e.target.value)}
                className="input"
              >
                <option value="">No company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add contact'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {contacts.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500">No contacts yet.</p>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="card divide-y divide-slate-100">
          {contacts.map((c) => (
            <div
              key={c._id}
              className={`px-4 py-3 flex items-center justify-between ${
                editingId === c._id ? 'bg-indigo-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {c.companyId?.name || 'No company'}
                    {c.email && ` · ${c.email}`}
                  </p>
                </div>
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
