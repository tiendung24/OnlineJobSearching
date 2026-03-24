import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const API_BASE = 'http://localhost:3000/api/admin/users';

const initialForm = {
  email: '',
  password: '',
  roleId: 2,
  isActive: true,
  fullName: '',
  companyName: '',
};

const UserManager = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const tabToQuery = useMemo(() => {
    if (activeTab === 'jobseekers') return { roleId: 2 };
    if (activeTab === 'employers') return { roleId: 3 };
    if (activeTab === 'banned') return { status: 'inactive' };
    return {};
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set('search', search.trim());
      if (tabToQuery.roleId) params.set('roleId', String(tabToQuery.roleId));
      if (tabToQuery.status) params.set('status', tabToQuery.status);

      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load users.');

      setUsers(data.data || []);
      setPagination(data.pagination || { page: 1, limit, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      email: user.Email || '',
      password: '',
      roleId: user.RoleID || 2,
      isActive: !!user.IsActive,
      fullName: user.FullName || user.DisplayName || '',
      companyName: user.CompanyName || user.DisplayName || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(initialForm);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        email: form.email.trim(),
        roleId: Number(form.roleId),
        isActive: !!form.isActive,
        fullName: form.fullName.trim(),
        companyName: form.companyName.trim(),
      };
      if (!editingUser || form.password.trim()) payload.password = form.password;

      const isEdit = !!editingUser;
      const url = isEdit ? `${API_BASE}/${editingUser.UserID}` : API_BASE;
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save user.');

      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to toggle user.');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa user này?')) return;
    try {
      const response = await fetch(`${API_BASE}/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete user.');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 mt-1">Manage users with add, edit, delete and pagination.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold"
        >
          + Add User
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 px-6 pt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="flex gap-4 overflow-x-auto">
            {[
              ['all', 'All Users'],
              ['jobseekers', 'JobSeekers'],
              ['employers', 'Employers'],
              ['banned', 'Banned'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setPage(1);
                }}
                className={`pb-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === key ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={onSearchSubmit} className="pb-3 relative sm:max-w-xs w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-3 pr-20 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <button type="submit" className="absolute right-1 top-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center text-slate-500">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-slate-500">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.UserID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{user.DisplayName || user.Email}</div>
                      <div className="text-xs text-slate-500">{user.Email}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{user.RoleName}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(user.CreatedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-bold ${user.IsActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {user.IsActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">Edit</button>
                        <button onClick={() => handleToggleStatus(user.UserID)} className="px-3 py-1.5 border border-amber-200 bg-amber-50 rounded text-xs font-bold text-amber-700 hover:bg-amber-100">{user.IsActive ? 'Lock' : 'Unlock'}</button>
                        <button onClick={() => handleDelete(user.UserID)} className="px-3 py-1.5 border border-red-200 bg-red-50 rounded text-xs font-bold text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500">Total: {pagination.total || 0}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border rounded disabled:opacity-40"
            >
              Prev
            </button>
            <span>Page {pagination.page} / {pagination.totalPages}</span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="px-3 py-1.5 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={submitForm} className="space-y-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder={editingUser ? 'New password (optional)' : 'Password'} type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required={!editingUser} />
              <select className="w-full border rounded px-3 py-2" value={form.roleId} onChange={(e) => setForm((f) => ({ ...f, roleId: Number(e.target.value) }))}>
                <option value={1}>Admin</option>
                <option value={2}>JobSeeker</option>
                <option value={3}>Employer</option>
              </select>
              {form.roleId === 2 && (
                <input className="w-full border rounded px-3 py-2" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              )}
              {form.roleId === 3 && (
                <input className="w-full border rounded px-3 py-2" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active account
              </label>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-600 text-white rounded disabled:opacity-60">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
