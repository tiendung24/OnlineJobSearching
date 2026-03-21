import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api/employer';

const initialForm = {
  CurrentJobTitle: '',
  Department: '',
  Team: '',
  Status: 'Active',
  HiredDate: '',
  EndDate: '',
  InternalNotes: '',
  CompanyEmail: '',
  CompanyPhone: '',
};

const toDateInput = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
};

const ReadOnlyCard = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</p>
    <p className="text-slate-900 font-medium break-words">{value || '-'}</p>
  </div>
);

const EmployeeEdit = () => {
  const { token } = useAuth();
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API}/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load employee detail.');
        }

        setEmployee(data.employee);
        setFormData({
          CurrentJobTitle: data.employee.CurrentJobTitle || data.employee.JobTitle || '',
          Department: data.employee.Department || '',
          Team: data.employee.Team || '',
          Status: data.employee.Status || 'Active',
          HiredDate: toDateInput(data.employee.HiredDate),
          EndDate: toDateInput(data.employee.EndDate),
          InternalNotes: data.employee.InternalNotes || '',
          CompanyEmail: data.employee.CompanyEmail || '',
          CompanyPhone: data.employee.CompanyPhone || '',
        });
      } catch (fetchError) {
        setEmployee(null);
        setError(fetchError.message || 'Failed to load employee detail.');
      } finally {
        setLoading(false);
      }
    };

    if (token && employeeId) {
      fetchEmployeeDetail();
    }
  }, [token, employeeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      const response = await fetch(`${API}/employees/${employeeId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee profile.');
      }

      navigate(`/employer/employees/${employeeId}`);
    } catch (saveError) {
      setError(saveError.message || 'Failed to update employee profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li>
                <Link to="/employer/employees" className="hover:text-brand-600">Employees</Link>
              </li>
              <li>
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </li>
              <li>
                <Link to={`/employer/employees/${employeeId}`} className="hover:text-brand-600">Employee Profile</Link>
              </li>
              <li>
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </li>
              <li aria-current="page" className="text-slate-700 font-medium">Edit</li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Edit Employee Profile</h2>
          <p className="text-slate-500 mt-1">Update only internal work profile fields managed by the employer.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/employer/employees/${employeeId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="employeeEditForm"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center text-slate-500">
          Loading employee profile...
        </div>
      ) : employee ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <form id="employeeEditForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Editable Work Profile</h3>
                <p className="text-sm text-slate-500 mt-1">These fields belong to the employer and internal company record.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="CurrentJobTitle"
                    value={formData.CurrentJobTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Working Status</label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="Department"
                    value={formData.Department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Team</label>
                  <input
                    type="text"
                    name="Team"
                    value={formData.Team}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="HiredDate"
                    value={formData.HiredDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="EndDate"
                    value={formData.EndDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Email</label>
                  <input
                    type="email"
                    name="CompanyEmail"
                    value={formData.CompanyEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Phone</label>
                  <input
                    type="text"
                    name="CompanyPhone"
                    value={formData.CompanyPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Internal Notes / Performance Review</label>
                <textarea
                  rows={6}
                  name="InternalNotes"
                  value={formData.InternalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                />
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Read-Only Personal Profile</h3>
              <p className="text-sm text-slate-500 mt-1">These fields belong to the employee account and should not be edited by the employer.</p>
            </div>

            <ReadOnlyCard label="Full Name" value={employee.FullName} />
            <ReadOnlyCard label="Personal Email" value={employee.PersonalEmail} />
            <ReadOnlyCard label="Phone" value={employee.Phone} />
            <ReadOnlyCard label="Address" value={employee.Address} />
            <ReadOnlyCard label="Original Job Application" value={employee.JobTitle} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeEdit;
