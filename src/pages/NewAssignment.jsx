import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const roles = [
  { value: 'owner', label: 'Account Owner' },
  { value: 'sales_rep', label: 'Sales Rep' },
  { value: 'support', label: 'Support' },
  { value: 'viewer', label: 'Viewer' }
];

export default function NewAssignment() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    targetType: 'company',
    targetId: '',
    role: 'owner'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data));
    api.get('/companies').then((res) => setCompanies(res.data));
    api.get('/contacts').then((res) => setContacts(res.data));
  }, []);

  const targets = form.targetType === 'company' ? companies : contacts;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function changeTargetType(value) {
    setForm((prev) => ({ ...prev, targetType: value, targetId: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post('/assignments', form);
      toast.success('Assigned, the user has been notified');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not assign');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-1">New assignment</h1>
      <p className="text-sm text-gray-500 mb-5">
        The user gets a live notification as soon as you assign.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-4">
        <label className="block text-sm mb-1">User</label>
        <select
          value={form.userId}
          onChange={(e) => update('userId', e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm bg-white"
        >
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1">Assign to</label>
        <div className="flex gap-2 mb-4">
          {['company', 'contact'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => changeTargetType(type)}
              className={`text-sm px-3 py-1.5 rounded border capitalize ${
                form.targetType === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          value={form.targetId}
          onChange={(e) => update('targetId', e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm bg-white"
        >
          <option value="">Select a {form.targetType}</option>
          {targets.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1">Role on this record</label>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          className="w-full border rounded px-3 py-2 mb-5 text-sm bg-white"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          {saving ? 'Assigning...' : 'Assign'}
        </button>
      </form>
    </div>
  );
}
