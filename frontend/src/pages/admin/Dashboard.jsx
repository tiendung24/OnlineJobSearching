import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000/api/admin';

// ── Mini bar chart using SVG (no library needed) ──────────────────
const BarChart = ({ data, valueKey, labelKey, color = '#6366f1' }) => {
  if (!data || data.length === 0) return <p className="text-sm text-slate-400 py-4 text-center">No data</p>;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-2 h-28 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[10px] font-bold text-slate-500">{d[valueKey]}</span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${(d[valueKey] / max) * 80}px`, background: color }}
          />
          <span className="text-[10px] text-slate-400 truncate w-full text-center">
            {d[labelKey]?.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, bg, iconColor, sub }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 hover:shadow-md transition-all">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-900">{value ?? '–'}</h3>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
    <div className={`w-14 h-14 ${bg} ${iconColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

// ── Status Badge ──────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    'Published':       'bg-emerald-100 text-emerald-700',
    'Pending Approval':'bg-amber-100 text-amber-700',
    'Closed/Expired':  'bg-slate-100 text-slate-600',
    'Locked':          'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${map[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats]       = useState(null);
  const [pending, setPending]   = useState([]);
  const [monthly, setMonthly]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [period, setPeriod]     = useState('jobs');    // 'users' | 'jobs' | 'applications'
  const [actionMsg, setActionMsg] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, m] = await Promise.all([
        fetch(`${API}/stats`).then(r => r.json()),
        fetch(`${API}/pending-jobs`).then(r => r.json()),
        fetch(`${API}/monthly-stats`).then(r => r.json()),
      ]);
      setStats(s);
      setPending(p);
      setMonthly(m);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleJobAction = async (id, action) => {
    try {
      await fetch(`${API}/jobs/${id}/${action}`, { method: 'PATCH' });
      setActionMsg(`Job ${action === 'approve' ? 'approved ✅' : 'rejected ❌'} successfully.`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchAll();
    } catch {
      setActionMsg('Action failed.');
    }
  };

  // Hire rate
  const hireRate = stats
    ? stats.totalApplications > 0
      ? ((stats.totalHired / stats.totalApplications) * 100).toFixed(1)
      : '0'
    : null;

  const chartData = monthly
    ? { users: monthly.users, jobs: monthly.jobs, applications: monthly.applications }
    : {};

  const chartColors = { users: '#3b82f6', jobs: '#6366f1', applications: '#a855f7' };

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-slate-500 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1 text-sm">Platform overview and key performance metrics.</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
          {actionMsg}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          label="Job Seekers"
          value={stats?.totalJobSeekers}
          bg="bg-blue-50" iconColor="text-blue-600"
          sub={`${stats?.activeUsers ?? 0} active users total`}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
        />
        <KpiCard
          label="Employers"
          value={stats?.totalEmployers}
          bg="bg-indigo-50" iconColor="text-indigo-600"
          sub="Registered companies"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
        />
        <KpiCard
          label="Published Jobs"
          value={stats?.publishedJobs}
          bg="bg-emerald-50" iconColor="text-emerald-600"
          sub={`${stats?.pendingJobs ?? 0} pending approval`}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
        />
        <KpiCard
          label="Hire Success Rate"
          value={hireRate !== null ? `${hireRate}%` : '–'}
          bg="bg-purple-50" iconColor="text-purple-600"
          sub={`${stats?.totalHired ?? 0} hired / ${stats?.totalApplications ?? 0} applications`}
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
      </div>

      {/* Charts + Pending Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900">Activity (Last 6 Months)</h3>
            <div className="flex gap-1">
              {['users', 'jobs', 'applications'].map(k => (
                <button
                  key={k}
                  onClick={() => setPeriod(k)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${period === k ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <BarChart
            data={chartData[period] || []}
            valueKey={period === 'users' ? 'NewUsers' : period === 'jobs' ? 'NewJobs' : 'NewApplications'}
            labelKey="Month"
            color={chartColors[period]}
          />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Platform Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Applications', value: stats?.totalApplications, color: 'bg-purple-500' },
              { label: 'Active Employees', value: stats?.activeEmployees, color: 'bg-emerald-500' },
              { label: 'Total Jobs', value: stats?.totalJobs, color: 'bg-blue-500' },
              { label: 'Jobs Pending', value: stats?.pendingJobs, color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{item.value ?? '–'}</span>
              </div>
            ))}
          </div>

          {/* Hire rate donut visual */}
          <div className="mt-6 flex items-center gap-4 p-4 bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl border border-brand-100">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#6366f1" strokeWidth="3.5"
                  strokeDasharray={`${hireRate ?? 0} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-700">
                {hireRate}%
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Hire Success Rate</p>
              <p className="text-xs text-slate-500 mt-0.5">{stats?.totalHired} successful hires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Jobs Queue */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Jobs Pending Approval
          </h3>
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              {pending.length} Pending
            </span>
            <Link to="/admin/jobs" className="text-sm font-bold text-brand-600 hover:underline">
              View All →
            </Link>
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="font-semibold text-slate-500">No jobs pending approval 🎉</p>
            <p className="text-sm mt-1">All posted jobs have been reviewed.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pending.slice(0, 5).map(job => (
              <div key={job.JobID} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                {/* Company logo placeholder */}
                <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                  {job.CompanyName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{job.Title}</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-xs text-slate-500">{job.CompanyName}</span>
                    {job.Location && <span className="text-xs text-slate-400">📍 {job.Location}</span>}
                    {job.SalaryRange && <span className="text-xs text-slate-400">💰 {job.SalaryRange}</span>}
                    {job.Level && <span className="text-xs text-slate-400">🎓 {job.Level}</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submitted {new Date(job.CreatedAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleJobAction(job.JobID, 'approve')}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleJobAction(job.JobID, 'reject')}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
