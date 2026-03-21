import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api/employer';

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-blue-50 text-blue-700 border-blue-200',
  Resigned: 'bg-amber-50 text-amber-700 border-amber-200',
  Terminated: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString();
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '--';
};

const EmployeeStatusBadge = ({ status }) => {
  const classes = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${classes}`}>
      {status}
    </span>
  );
};

const Employees = () => {
  const { token } = useAuth();

  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [updatingEmployeeId, setUpdatingEmployeeId] = useState(null);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState({
    company: null,
    summary: null,
    employees: [],
  });

  const fetchEmployees = async (filterStatus = statusFilter, keyword = search) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== 'All') {
        params.set('status', filterStatus);
      }
      if (keyword.trim()) {
        params.set('search', keyword.trim());
      }

      const response = await fetch(`${API}/employees?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load employees.');
      }

      setPayload(data);
    } catch (fetchError) {
      setPayload({
        company: null,
        summary: null,
        employees: [],
      });
      setError(fetchError.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (employeeId, nextStatus) => {
    try {
      setUpdatingEmployeeId(employeeId);
      setError('');

      const response = await fetch(`${API}/employees/${employeeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee status.');
      }

      setPayload((current) => ({
        ...current,
        employees: current.employees.map((employee) => (
          employee.EmployeeID === employeeId ? data.employee : employee
        )),
      }));

      await fetchEmployees(statusFilter, search);
    } catch (updateError) {
      setError(updateError.message || 'Failed to update employee status.');
    } finally {
      setUpdatingEmployeeId(null);
    }
  };

  const handleExport = () => {
    if (!payload.employees.length) return;

    const rows = [
      ['Employee Name', 'Email', 'Job Title', 'Hired Date', 'End Date', 'Status'],
      ...payload.employees.map((employee) => ([
        employee.FullName,
        employee.Email,
        employee.JobTitle,
        formatDate(employee.HiredDate),
        formatDate(employee.EndDate),
        employee.Status,
      ])),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!token) return;
    fetchEmployees(statusFilter, search);
  }, [token, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
          <p className="text-slate-500 mt-1">Manage candidates you have hired through Online Job Searching.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative max-w-sm flex-1">
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                value={searchDraft}
                onChange={(event) => {
                  setSearchDraft(event.target.value);
                  setSearch(event.target.value);
                }}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={!payload.employees.length}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Export List
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100 bg-white flex flex-wrap gap-3 text-xs font-medium text-slate-500">
          <span>Total: <strong className="text-slate-900">{payload.summary?.TotalEmployees || 0}</strong></span>
          <span>Active: <strong className="text-emerald-700">{payload.summary?.ActiveEmployees || 0}</strong></span>
          <span>On Leave: <strong className="text-blue-700">{payload.summary?.OnLeaveEmployees || 0}</strong></span>
          <span>Resigned: <strong className="text-amber-700">{payload.summary?.ResignedEmployees || 0}</strong></span>
          <span>Terminated: <strong className="text-red-700">{payload.summary?.TerminatedEmployees || 0}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Employee Name</th>
                <th className="p-4 font-bold">Job Title</th>
                <th className="p-4 font-bold">Hired Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Update Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    Loading employees...
                  </td>
                </tr>
              ) : payload.employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No employees to display. Data will appear here once loaded from the API.
                  </td>
                </tr>
              ) : (
                payload.employees.map((employee) => (
                  <tr key={employee.EmployeeID} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(employee.FullName)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{employee.FullName}</div>
                          <div className="text-sm text-slate-500">{employee.Email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{employee.JobTitle}</div>
                      <div className="text-sm text-slate-500">
                        {[employee.JobLevel, employee.JobType, employee.JobLocation].filter(Boolean).join(' | ') || 'Not specified'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      <div>{formatDate(employee.HiredDate)}</div>
                      <div className="text-xs text-slate-400">End: {formatDate(employee.EndDate)}</div>
                    </td>
                    <td className="p-4">
                      <EmployeeStatusBadge status={employee.Status} />
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={employee.Status}
                        disabled={updatingEmployeeId === employee.EmployeeID}
                        onChange={(event) => handleStatusUpdate(employee.EmployeeID, event.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700 disabled:opacity-50"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/employer/employees/${employee.EmployeeID}`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-sm transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          to={`/employer/employees/${employee.EmployeeID}/edit`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
