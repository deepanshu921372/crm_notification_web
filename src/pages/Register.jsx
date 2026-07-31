import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border rounded p-6">
        <h1 className="text-xl font-semibold mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-5">New accounts are always regular users.</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <label className="block text-sm mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
          minLength={6}
          className="w-full border rounded px-3 py-2 mb-5 text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-900 text-white rounded py-2 text-sm disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create account'}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
