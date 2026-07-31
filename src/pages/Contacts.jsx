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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/contacts').then((res) => setContacts(res.data));
    api.get('/companies').then((res) => setCompanies(res.data));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post('/contacts', form);
      const res = await api.get('/contacts');
      setContacts(res.data);
      setForm(empty);
      toast.success('Contact created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create contact');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contact deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete contact');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Contacts</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-4 mb-6">
          <div className="grid sm:grid-cols-4 gap-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <select
              value={form.companyId}
              onChange={(e) => update('companyId', e.target.value)}
              className="border rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">No company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-3 bg-gray-900 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add contact'}
          </button>
        </form>
      )}

      {contacts.length === 0 && <p className="text-sm text-gray-500">No contacts yet.</p>}

      {contacts.length > 0 && (
        <div className="bg-white border rounded divide-y">
          {contacts.map((c) => (
            <div key={c._id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {c.companyId?.name || 'No company'}
                  {c.email && ` · ${c.email}`}
                </p>
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
