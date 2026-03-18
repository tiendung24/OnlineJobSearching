import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:3000/api/employer';

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-blue-50 text-blue-700 border-blue-200',
  Resigned: 'bg-amber-50 text-amber-700 border-amber-200',
  Terminated: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (value, includeTime = false) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return includeTime ? date.toLocaleString() : date.toLocaleDateString();
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '--';
};

const EmployeeStatusBadge = ({ status }) => {
  const classes = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${classes}`}>
      {status}
    </span>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</p>
    <p className="text-slate-900 font-semibold break-words">{value || '-'}</p>
  </div>
);

const EmployeeDetail = () => {
  const { token } = useAuth();
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
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
              <li aria-current="page" className="text-slate-700 font-medium">
                {employee?.FullName || 'Employee Detail'}
              </li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Employee Profile</h2>
          <p className="text-slate-500 mt-1">View detailed information for this hired candidate.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/employer/employees/${employeeId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Profile
          </Link>
          <Link
            to="/employer/employees"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Employees
          </Link>
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
        <>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-2xl shrink-0">
                  {getInitials(employee.FullName)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{employee.FullName}</h3>
                  <p className="text-slate-500 mt-1">{employee.Email}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {[employee.JobTitle, employee.JobLevel, employee.JobType].filter(Boolean).join(' | ') || 'No job metadata'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-3">
                <EmployeeStatusBadge status={employee.Status} />
                <p className="text-sm text-slate-500">Company: <span className="font-medium text-slate-700">{employee.CompanyName}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <InfoCard label="Phone" value={employee.Phone} />
            <InfoCard label="Address" value={employee.Address} />
            <InfoCard label="Hired Date" value={formatDate(employee.HiredDate, true)} />
            <InfoCard label="End Date" value={formatDate(employee.EndDate, true)} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Employment Information</h3>
              <InfoCard label="Job Title" value={employee.JobTitle} />
              <InfoCard label="Department" value={employee.Department} />
              <InfoCard label="Team" value={employee.Team} />
              <InfoCard label="Location" value={employee.JobLocation} />
              <InfoCard label="Level" value={employee.JobLevel} />
              <InfoCard label="Job Type" value={employee.JobType} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Internal Profile</h3>
              <InfoCard label="Company Email" value={employee.CompanyEmail} />
              <InfoCard label="Company Phone" value={employee.CompanyPhone} />
              <InfoCard label="Internal Notes" value={employee.InternalNotes} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Read-Only Personal Profile</h3>
              <InfoCard label="Personal Email" value={employee.PersonalEmail} />
              <InfoCard label="Phone" value={employee.Phone} />
              <InfoCard label="Address" value={employee.Address} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Profile Summary</h3>
              <InfoCard label="Employee ID" value={employee.EmployeeID} />
              <InfoCard label="Job Seeker ID" value={employee.JobSeekerID} />
              <InfoCard label="Job ID" value={employee.JobID} />
              <InfoCard label="Current Status" value={employee.Status} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EmployeeDetail;
