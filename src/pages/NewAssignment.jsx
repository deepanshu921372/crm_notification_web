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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">New assignment</h1>
        <p className="text-sm text-slate-500 mt-1">
          The user gets a live notification as soon as you assign.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5">
        <label className="label">User</label>
        <select
          value={form.userId}
          onChange={(e) => update('userId', e.target.value)}
          required
          className="input mb-5"
        >
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <label className="label">Assign to</label>
        <div className="inline-flex rounded-md border border-slate-300 p-0.5 mb-3">
          {['company', 'contact'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => changeTargetType(type)}
              className={`text-sm px-4 py-1.5 rounded capitalize transition-colors ${
                form.targetType === type
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900'
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
          className="input mb-5"
        >
          <option value="">Select a {form.targetType}</option>
          {targets.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <label className="label">Role on this record</label>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          className="input mb-6"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Assigning...' : 'Assign'}
        </button>
      </form>
    </div>
  );
}
